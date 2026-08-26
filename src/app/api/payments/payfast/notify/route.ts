import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseAmountToCents, verifyPaymentAmount } from '@/lib/payments'

const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID ?? '10000100').trim()
const PASSPHRASE  = (process.env.PAYFAST_PASSPHRASE  ?? '').trim()
const SANDBOX     = (process.env.PAYFAST_SANDBOX ?? 'true').trim() !== 'false'

// PayFast's published ITN source IP ranges.
// Ref: https://support.payfast.co.za/portal/en/kb/articles/what-ip-addresses-does-payfast-use
//   197.97.145.144/28  → .144 – .159   (16)
//   41.74.179.192/27   → .192 – .223   (32)
//   102.216.36.0/28    → .0   – .15    (16)
//   102.216.36.128/28  → .128 – .143   (16)
//   144.126.193.139    → single IP
// NOTE: used only as a soft/log signal — see the check below. The MD5 signature
// and the phone-home validate call are the actual authentication.
const VALID_IPS = new Set([
  ...Array.from({ length: 16 }, (_, i) => `197.97.145.${144 + i}`),
  ...Array.from({ length: 32 }, (_, i) => `41.74.179.${192 + i}`),
  ...Array.from({ length: 16 }, (_, i) => `102.216.36.${i}`),
  ...Array.from({ length: 16 }, (_, i) => `102.216.36.${128 + i}`),
  '144.126.193.139',
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
    // Fail closed on network issues — reject the ITN; PayFast will retry
    return false
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
    // VALID_IPS covers PayFast's full current published ranges. If PayFast adds
    // new ranges in future, real ITNs will 403 here — update VALID_IPS then.
    if (!SANDBOX) {
      // On Vercel/trusted proxies, x-forwarded-for is set by the edge and is reliable.
      // Check all IPs in the chain to find a match against PayFast's known ranges.
      const forwardedFor = request.headers.get('x-forwarded-for') ?? ''
      const realIp = request.headers.get('x-real-ip') ?? ''
      const allIps = [
        ...forwardedFor.split(',').map(ip => ip.trim()),
        realIp.trim(),
      ].filter(Boolean)

      const hasValidIp = allIps.some(ip => VALID_IPS.has(ip))
      if (!hasValidIp) {
        console.error('[PayFast ITN] Rejected — no valid IP found in:', allIps)
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
      console.error('[PayFast ITN] Merchant ID mismatch')
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

    // ── 6. Verify the amount matches the tier we sold ─────────────────────
    // Signature + validate prove PayFast sent this, not that it is for the
    // right money. custom_str4 carries the tier from our own signed checkout
    // payload, so comparing against it detects a tampered amount.
    const mPaymentId  = (params.m_payment_id  ?? '').trim()
    const pfPaymentId = (params.pf_payment_id ?? '').trim()
    const tier        = (params.custom_str4   ?? '').trim()
    const userId      = (params.custom_str1   ?? '').trim()
    const courseId    = (params.custom_str2   ?? '').trim()
    const holeId      = (params.custom_str3   ?? '').trim()

    const amountCents = parseAmountToCents(params.amount_gross)
    const check       = verifyPaymentAmount(tier, amountCents)
    const amountOk    = check.ok
    if (!check.ok) {
      console.error(
        `[PayFast ITN] ⚠️ ${check.reason.toUpperCase()} — ${mPaymentId} tier:${tier || '(none)'} ` +
        `paid:${amountCents}c expected:${check.expectedCents ?? '(unknown tier)'}c. Not granting a bet.`,
      )
    }

    if (!mPaymentId) {
      console.error('[PayFast ITN] COMPLETE with no m_payment_id — cannot record')
      return new NextResponse('OK', { status: 200 })
    }

    try {
      const supabase = createAdminClient()

      // ── 7. Record the payment. This ledger is what /api/bets/create checks;
      // until a row lands here, no bet exists for this payment.
      const { error: payErr } = await supabase
        .from('payments')
        .upsert(
          {
            m_payment_id:  mPaymentId,
            pf_payment_id: pfPaymentId || null,
            user_id:       userId   || null,
            course_id:     courseId || null,
            hole_id:       holeId   || null,
            tier:          check.ok ? tier : null,
            amount_cents:  amountCents,
            status:        amountOk ? 'complete' : 'amount_mismatch',
            raw_payload:   params,
          },
          { onConflict: 'm_payment_id' },
        )

      if (payErr) {
        // Fail loudly. PayFast will retry, and a missing ledger row means the
        // payer cannot get their bet — this must not pass silently.
        console.error(
          `[PayFast ITN] ❌ Could not record payment ${mPaymentId}: ${payErr.message}. ` +
          'If this says the relation "payments" does not exist, migration 005 has not been applied.',
        )
        return new NextResponse('Ledger write failed', { status: 500 })
      }

      console.log(`[PayFast ITN] ✅ Payment recorded — ${mPaymentId} → pf:${pfPaymentId} (${amountCents}c)`)

      // ── 8. If the bet already exists, swap our reference for PayFast's so
      // payouts reconcile. Never writes `status`: a late ITN must not reset a
      // resolved result ('miss'/'claimed'/'verified'/'paid') back to 'active'.
      if (pfPaymentId) {
        const { error: betErr } = await supabase
          .from('bets')
          .update({ payment_intent_id: pfPaymentId })
          .eq('payment_intent_id', mPaymentId)
        if (betErr) console.warn('[PayFast ITN] Bet reference swap warning:', betErr.message)
      }
    } catch (dbErr) {
      console.error('[PayFast ITN] ❌ Admin client unavailable (SUPABASE_SERVICE_ROLE_KEY?):', dbErr)
      return new NextResponse('Ledger write failed', { status: 500 })
    }

    // Always return 200 so PayFast stops retrying
    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[PayFast ITN] Unexpected error:', err)
    // Still 200 — returning 4xx/5xx causes PayFast to retry repeatedly
    return new NextResponse('OK', { status: 200 })
  }
}
