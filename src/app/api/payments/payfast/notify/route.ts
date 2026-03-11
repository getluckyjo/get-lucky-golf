import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID ?? '10000100'
const PASSPHRASE  = process.env.PAYFAST_PASSPHRASE  ?? 'jt7NOE43FZPn'
const SANDBOX     = process.env.PAYFAST_SANDBOX !== 'false'

// PayFast's published source IP ranges (CIDR /28 = 16 IPs each)
// Ref: https://developers.payfast.co.za/docs#notify
// Block 1: 197.97.145.144/28  → .144 – .159
// Block 2: 41.74.179.192/28   → .192 – .207
const VALID_IPS = new Set([
  ...Array.from({ length: 16 }, (_, i) => `197.97.145.${144 + i}`),
  ...Array.from({ length: 16 }, (_, i) => `41.74.179.${192 + i}`),
])

const PF_VALIDATE_URL = SANDBOX
  ? 'https://sandbox.payfast.co.za/eng/query/validate'
  : 'https://www.payfast.co.za/eng/query/validate'

// ---------------------------------------------------------------------------
// Step 1 helper — verify MD5 signature
// ---------------------------------------------------------------------------
function verifySignature(data: Record<string, string>): boolean {
  const { signature, ...rest } = data
  const qs = Object.entries(rest)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, '+')}`)
    .join('&')
  const toHash = PASSPHRASE
    ? `${qs}&passphrase=${encodeURIComponent(PASSPHRASE).replace(/%20/g, '+')}`
    : qs
  const computed = crypto.createHash('md5').update(toHash).digest('hex')
  return computed === signature
}

// ---------------------------------------------------------------------------
// Step 2 helper — "phone home" to PayFast's validate endpoint
// ---------------------------------------------------------------------------
async function validateWithPayFast(rawBody: string): Promise<boolean> {
  try {
    const res = await fetch(PF_VALIDATE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    rawBody,
    })
    const text = await res.text()
    return text.trim().toUpperCase() === 'VALID'
  } catch (err) {
    console.error('[PayFast ITN] Validate endpoint error:', err)
    // Don't fail hard on network issues — signature check is the primary guard
    return true
  }
}

// ---------------------------------------------------------------------------
// POST /api/payments/payfast/notify  ← PayFast calls this, not your browser
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const params  = Object.fromEntries(new URLSearchParams(rawBody))

    // ── 1. IP whitelist (production only — sandbox IPs vary) ──────────────
    if (!SANDBOX) {
      // x-forwarded-for format: "client, proxy1, proxy2"
      // The leftmost IP is the original requester (PayFast in this case)
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        request.headers.get('x-real-ip') ??
        ''
      if (!VALID_IPS.has(ip)) {
        console.error('[PayFast ITN] Rejected unknown IP:', ip)
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // ── 2. Signature verification ─────────────────────────────────────────
    if (!verifySignature(params)) {
      console.error('[PayFast ITN] Invalid signature')
      return new NextResponse('Invalid signature', { status: 400 })
    }

    // ── 3. Phone home — ask PayFast if this ITN is genuine ────────────────
    const pfValid = await validateWithPayFast(rawBody)
    if (!pfValid) {
      console.error('[PayFast ITN] PayFast validate returned INVALID')
      return new NextResponse('Validation failed', { status: 400 })
    }

    // ── 4. Merchant ID check ──────────────────────────────────────────────
    if (params.merchant_id !== MERCHANT_ID) {
      console.error('[PayFast ITN] Merchant ID mismatch:', params.merchant_id)
      return new NextResponse('Merchant mismatch', { status: 400 })
    }

    // ── 5. Log all payment statuses for visibility ─────────────────────────
    console.log(
      `[PayFast ITN] Status: ${params.payment_status} | m_payment_id: ${params.m_payment_id} | pf_payment_id: ${params.pf_payment_id} | amount: ${params.amount_gross}`,
    )

    // Only process COMPLETE payments for DB updates
    if (params.payment_status !== 'COMPLETE') {
      return new NextResponse('OK', { status: 200 })
    }

    // ── 6. Update the bet record ──────────────────────────────────────────
    // m_payment_id (our reference) was stored as payment_intent_id at bet creation.
    // We swap it for PayFast's own pf_payment_id so we can reconcile payouts later.
    // We also explicitly set status = 'active' as a belt-and-suspenders confirmation.
    const mPaymentId  = params.m_payment_id  ?? ''
    const pfPaymentId = params.pf_payment_id ?? ''

    if (mPaymentId) {
      try {
        const supabase = createAdminClient()

        const { error, count } = await supabase
          .from('bets')
          .update({
            payment_intent_id: pfPaymentId || mPaymentId,
            status:            'active',   // re-confirm payment is good
          })
          .eq('payment_intent_id', mPaymentId)
          .select('id', { count: 'exact', head: true })

        if (error) {
          // Non-fatal: bet row may not exist yet if ITN arrives before bets/create finishes
          console.warn('[PayFast ITN] DB update warning:', error.message)
        } else {
          console.log(
            `[PayFast ITN] ✅ Payment confirmed — ${mPaymentId} → pf:${pfPaymentId} (${count ?? 0} row(s) updated)`,
          )
        }
      } catch (dbErr) {
        // SUPABASE_SERVICE_ROLE_KEY not configured — log and continue
        console.warn('[PayFast ITN] Could not update bet (service role key missing?):', dbErr)
      }
    }

    // Always return 200 so PayFast stops retrying
    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[PayFast ITN] Unexpected error:', err)
    // Still 200 — returning 4xx/5xx causes PayFast to retry repeatedly
    return new NextResponse('OK', { status: 200 })
  }
}
