import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { isMembershipPlan, type MembershipPlan } from '@/lib/membership'

const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID ?? '10000100').trim()
const PASSPHRASE  = (process.env.PAYFAST_PASSPHRASE  ?? '').trim()
const SANDBOX     = (process.env.PAYFAST_SANDBOX ?? 'true').trim() !== 'false'

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
    // Fail closed on network issues — reject the ITN; PayFast will retry
    return false
  }
}

// ---------------------------------------------------------------------------
// Membership ITN handler — processes recurring subscription events.
// Writes go through the service-role admin client (bypasses RLS + the
// membership guard trigger). Always best-effort; never throws to the caller.
// ---------------------------------------------------------------------------
function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

async function handleMembershipNotification(params: Record<string, string>): Promise<void> {
  const mPaymentId = params.m_payment_id ?? ''
  const userId     = params.custom_str1 ?? ''
  const status     = (params.payment_status ?? '').toUpperCase()
  const token      = params.token ?? ''           // PayFast subscription token
  const amountCents = params.amount_gross
    ? Math.round(parseFloat(params.amount_gross) * 100)
    : null

  // Resolve plan from custom_str2, falling back to the m_payment_id prefix.
  let plan: MembershipPlan | null = isMembershipPlan(params.custom_str2)
    ? params.custom_str2
    : null
  if (!plan) {
    if (mPaymentId.startsWith('gl_mem_annual')) plan = 'annual'
    else if (mPaymentId.startsWith('gl_mem_monthly')) plan = 'monthly'
  }

  if (!userId) {
    console.warn('[PayFast ITN] Membership event missing custom_str1 (user id) — skipping')
    return
  }

  let supabase
  try {
    supabase = createAdminClient()
  } catch (e) {
    console.warn('[PayFast ITN] Service role key missing — cannot update membership:', e)
    return
  }

  // Map PayFast status → our membership_status + audit event_type.
  if (status === 'COMPLETE') {
    // Determine first payment (signup) vs recurring (renewal): a profile with
    // no stored subscription token yet is a fresh signup.
    const { data: existing } = await supabase
      .from('profiles')
      .select('payfast_subscription_token, membership_started_at')
      .eq('id', userId)
      .maybeSingle()

    const isSignup = !existing?.payfast_subscription_token && !existing?.membership_started_at
    const now = new Date()
    const renews = addMonths(now, plan === 'annual' ? 12 : 1)

    const update: Record<string, unknown> = {
      membership_status:   'active',
      membership_renews_at: renews.toISOString(),
    }
    if (plan) update.membership_plan = plan
    if (token) update.payfast_subscription_token = token
    if (isSignup) update.membership_started_at = now.toISOString()

    const { error } = await supabase.from('profiles').update(update).eq('id', userId)
    if (error) console.warn('[PayFast ITN] Membership profile update warning:', error.message)

    await supabase.from('membership_subscriptions').insert({
      user_id: userId,
      plan,
      status: 'active',
      event_type: isSignup ? 'signup' : 'renewal',
      m_payment_id: mPaymentId,
      pf_subscription_token: token || null,
      amount_cents: amountCents,
      raw: params,
    })
    console.log(`[PayFast ITN] ✅ Membership ${isSignup ? 'signup' : 'renewal'} — user ${userId} (${plan})`)
    return
  }

  if (status === 'CANCELLED') {
    const { error } = await supabase
      .from('profiles')
      .update({ membership_status: 'cancelled' })
      .eq('id', userId)
    if (error) console.warn('[PayFast ITN] Membership cancel update warning:', error.message)

    await supabase.from('membership_subscriptions').insert({
      user_id: userId, plan, status: 'cancelled', event_type: 'cancelled',
      m_payment_id: mPaymentId, pf_subscription_token: token || null,
      amount_cents: amountCents, raw: params,
    })
    console.log(`[PayFast ITN] Membership cancelled — user ${userId}`)
    return
  }

  // Any other status (FAILED, etc.) on a recurring charge → past_due.
  const { error } = await supabase
    .from('profiles')
    .update({ membership_status: 'past_due' })
    .eq('id', userId)
  if (error) console.warn('[PayFast ITN] Membership past_due update warning:', error.message)

  await supabase.from('membership_subscriptions').insert({
    user_id: userId, plan, status: 'past_due', event_type: 'failed',
    m_payment_id: mPaymentId, pf_subscription_token: token || null,
    amount_cents: amountCents, raw: params,
  })
  console.log(`[PayFast ITN] Membership payment ${status || 'unknown'} → past_due — user ${userId}`)
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

    // ── 5a. Membership subscriptions branch ───────────────────────────────
    // Recurring membership payments use an m_payment_id prefixed `gl_mem_`.
    // These manage their own statuses (COMPLETE / CANCELLED / failed), so we
    // handle them before the bet-only COMPLETE gate below.
    if ((params.m_payment_id ?? '').startsWith('gl_mem_')) {
      await handleMembershipNotification(params)
      return new NextResponse('OK', { status: 200 })
    }

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

        const { error, data } = await supabase
          .from('bets')
          .update({
            payment_intent_id: pfPaymentId || mPaymentId,
            status:            'active',   // re-confirm payment is good
          })
          .eq('payment_intent_id', mPaymentId)
          .select('id')

        if (error) {
          // Non-fatal: bet row may not exist yet if ITN arrives before bets/create finishes
          console.warn('[PayFast ITN] DB update warning:', error.message)
        } else {
          console.log(
            `[PayFast ITN] ✅ Payment confirmed — ${mPaymentId} → pf:${pfPaymentId} (${data?.length ?? 0} row(s) updated)`,
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
