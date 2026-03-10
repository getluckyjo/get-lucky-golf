import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID ?? '10000100'
const PASSPHRASE  = process.env.PAYFAST_PASSPHRASE  ?? 'jt7NOE43FZPn'
const SANDBOX     = process.env.PAYFAST_SANDBOX !== 'false'

// PayFast production + sandbox IP ranges
const VALID_IPS = new Set([
  '197.97.145.144', '197.97.145.145', '197.97.145.146', '197.97.145.147',
  '196.33.227.224', '196.33.227.225',
  // Sandbox
  '197.97.145.144',
])

// ---------------------------------------------------------------------------
// Verify ITN signature
// ---------------------------------------------------------------------------
function verifySignature(data: Record<string, string>): boolean {
  const { signature, ...rest } = data
  const qs = Object.entries(rest)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
    .join('&')
  const toHash = PASSPHRASE
    ? `${qs}&passphrase=${encodeURIComponent(PASSPHRASE).replace(/%20/g, '+')}`
    : qs
  const computed = crypto.createHash('md5').update(toHash).digest('hex')
  return computed === signature
}

// ---------------------------------------------------------------------------
// POST /api/payments/payfast/notify  (called by PayFast — not the browser)
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const params  = Object.fromEntries(new URLSearchParams(rawBody))

    // 1. IP check (skip in sandbox — PayFast sandbox doesn't have fixed IPs)
    if (!SANDBOX) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? request.headers.get('x-real-ip')
               ?? ''
      if (!VALID_IPS.has(ip)) {
        console.error('[PayFast ITN] Rejected unknown IP:', ip)
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // 2. Verify signature
    if (!verifySignature(params)) {
      console.error('[PayFast ITN] Invalid signature')
      return new NextResponse('Invalid signature', { status: 400 })
    }

    // 3. Merchant ID check
    if (params.merchant_id !== MERCHANT_ID) {
      console.error('[PayFast ITN] Merchant ID mismatch:', params.merchant_id)
      return new NextResponse('Merchant mismatch', { status: 400 })
    }

    // 4. Only process COMPLETE payments
    if (params.payment_status !== 'COMPLETE') {
      console.log('[PayFast ITN] Non-complete status:', params.payment_status)
      return new NextResponse('OK', { status: 200 })
    }

    // 5. Update the bet: replace our m_payment_id with PayFast's pf_payment_id
    //    m_payment_id was stored as payment_intent_id when the bet was created
    const mPaymentId  = params.m_payment_id
    const pfPaymentId = params.pf_payment_id

    if (mPaymentId && pfPaymentId) {
      try {
        const supabase = createAdminClient()
        const { error } = await supabase
          .from('bets')
          .update({ payment_intent_id: pfPaymentId })
          .eq('payment_intent_id', mPaymentId)

        if (error) console.error('[PayFast ITN] DB update error:', error.message)
        else console.log('[PayFast ITN] Bet updated:', mPaymentId, '→', pfPaymentId)
      } catch (dbErr) {
        // Service role key not configured — log and continue (non-fatal in dev)
        console.warn('[PayFast ITN] Could not update bet (SUPABASE_SERVICE_ROLE_KEY missing?):', dbErr)
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[PayFast ITN] Unexpected error:', err)
    return new NextResponse('Error', { status: 500 })
  }
}
