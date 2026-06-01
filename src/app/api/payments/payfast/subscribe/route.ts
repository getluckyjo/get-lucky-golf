import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { MEMBERSHIP_PLANS, isMembershipPlan } from '@/lib/membership'

// ---------------------------------------------------------------------------
// Config — sandbox by default; set PAYFAST_SANDBOX=false for production
// ---------------------------------------------------------------------------
const MERCHANT_ID  = (process.env.PAYFAST_MERCHANT_ID  ?? '10000100').trim()
const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY ?? '46f0cd694581a').trim()
const PASSPHRASE   = (process.env.PAYFAST_PASSPHRASE   ?? '').trim()
const SANDBOX      = (process.env.PAYFAST_SANDBOX ?? 'true').trim() !== 'false'
const SITE_URL     = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').trim()

const REDIRECT_URL = SANDBOX
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process'

// ---------------------------------------------------------------------------
// PayFast parameter order for signature generation — recurring variant.
// Same base order as once-off, with the subscription fields appended after
// payment_method. Order MUST match PayFast's spec exactly or the signature
// (and the hosted checkout) will be rejected.
// Ref: https://developers.payfast.co.za/docs#recurring_billing
// ---------------------------------------------------------------------------
const PF_SUB_FIELD_ORDER = [
  'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
  'name_first', 'name_last', 'email_address', 'cell_number',
  'm_payment_id', 'amount', 'item_name', 'item_description',
  'custom_int1', 'custom_int2', 'custom_int3', 'custom_int4', 'custom_int5',
  'custom_str1', 'custom_str2', 'custom_str3', 'custom_str4', 'custom_str5',
  'email_confirmation', 'confirmation_address', 'currency', 'payment_method',
  'subscription_type', 'billing_date', 'recurring_amount', 'frequency', 'cycles',
]

function pfEncode(value: string): string {
  return encodeURIComponent(value.trim()).replace(/%20/g, '+')
}

function generateSignature(data: Record<string, string>, passphrase: string): string {
  const parts: string[] = []
  for (const key of PF_SUB_FIELD_ORDER) {
    if (data[key] !== undefined && data[key] !== '') {
      parts.push(`${key}=${pfEncode(data[key])}`)
    }
  }
  const paramString = parts.join('&')
  const sigInput = passphrase.trim()
    ? `${paramString}&passphrase=${pfEncode(passphrase)}`
    : paramString
  return crypto.createHash('md5').update(sigInput).digest('hex')
}

// Today as YYYY-MM-DD in SA time (PayFast billing_date format)
function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// POST /api/payments/payfast/subscribe
// Body: { plan: 'monthly' | 'annual', userName? }
// Returns: { redirectUrl, formFields, m_payment_id, plan, sandbox }
//
// The client builds a hidden HTML form with formFields and submits it to
// redirectUrl, sending the user to PayFast's hosted checkout. The first
// charge happens immediately; PayFast then re-bills automatically at the
// chosen frequency until the subscription is cancelled.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // ── Require authenticated user (CSRF + identity) ──────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { plan, userName = '' } = await request.json()
    if (!isMembershipPlan(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    const cfg = MEMBERSHIP_PLANS[plan]

    const safeUserName = String(userName).replace(/[<>"'&]/g, '').slice(0, 100)
    const nameParts = safeUserName.trim().split(/\s+/)
    const firstName = nameParts[0] || 'Player'
    const lastName  = nameParts.slice(1).join(' ') || 'Player'

    // gl_mem_ prefix lets the ITN webhook distinguish membership from bets.
    const mPaymentId = `gl_mem_${plan}_${Date.now()}`

    const data: Record<string, string> = {
      merchant_id:   MERCHANT_ID,
      merchant_key:  MERCHANT_KEY,
      return_url:    `${SITE_URL}/membership/return`,
      cancel_url:    `${SITE_URL}/membership`,
      notify_url:    `${SITE_URL}/api/payments/payfast/notify`,
      name_first:    firstName,
      name_last:     lastName,
      // Generic address — PayFast blocks payments when buyer email == merchant email.
      email_address: 'payments@getluckygolf.co.za',
      m_payment_id:  mPaymentId,
      amount:        cfg.amount,           // first charge
      item_name:     cfg.itemName,
      // custom_str1 carries the user id so the ITN can resolve the profile
      // even before any DB row exists; custom_str2 carries the plan.
      custom_str1:   user.id,
      custom_str2:   plan,
      currency:      'ZAR',
      // ── Recurring fields ──
      subscription_type: '1',
      billing_date:      todayISO(),
      recurring_amount:  cfg.amount,
      frequency:         String(cfg.frequency), // 3 monthly | 6 annual
      cycles:            '0',                    // 0 = until cancelled
    }

    const signature = generateSignature(data, PASSPHRASE)

    console.log('[PayFast Sub] Recurring checkout | sandbox:', SANDBOX, '| plan:', plan, '| amount:', cfg.amount)

    return NextResponse.json({
      redirectUrl:  REDIRECT_URL,
      formFields:   { ...data, signature },
      m_payment_id: mPaymentId,
      plan,
      sandbox:      SANDBOX,
    })
  } catch (err) {
    console.error('[PayFast Sub] Subscription creation failed:', err)
    return NextResponse.json({ error: 'Subscription creation failed' }, { status: 500 })
  }
}
