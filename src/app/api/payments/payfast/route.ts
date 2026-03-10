import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

// ---------------------------------------------------------------------------
// Config — sandbox by default; set PAYFAST_SANDBOX=false for production
// ---------------------------------------------------------------------------
const MERCHANT_ID  = process.env.PAYFAST_MERCHANT_ID  ?? '10000100'
const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY ?? '46f0cd694581a'
const PASSPHRASE   = process.env.PAYFAST_PASSPHRASE   ?? 'jt7NOE43FZPn'
const SANDBOX      = process.env.PAYFAST_SANDBOX !== 'false'
const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const ONSITE_URL = SANDBOX
  ? 'https://sandbox.payfast.co.za/onsite/process'
  : 'https://www.payfast.co.za/onsite/process'

// ---------------------------------------------------------------------------
// ZAR stake amounts per tier — update to match your live pricing
// ---------------------------------------------------------------------------
const TIER_ZAR: Record<string, { amount: string; itemName: string }> = {
  tier_1: { amount: '50.00',  itemName: 'Get Lucky Golf – R50 Hole-in-One Entry'  },
  tier_2: { amount: '100.00', itemName: 'Get Lucky Golf – R100 Hole-in-One Entry' },
  tier_3: { amount: '200.00', itemName: 'Get Lucky Golf – R200 Hole-in-One Entry' },
  tier_4: { amount: '500.00', itemName: 'Get Lucky Golf – R500 Hole-in-One Entry' },
}

// ---------------------------------------------------------------------------
// Signature — MD5 of ordered param string + optional passphrase
// ---------------------------------------------------------------------------
function buildSignature(params: Record<string, string>): string {
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
    .join('&')
  const toHash = PASSPHRASE
    ? `${qs}&passphrase=${encodeURIComponent(PASSPHRASE).replace(/%20/g, '+')}`
    : qs
  return crypto.createHash('md5').update(toHash).digest('hex')
}

// ---------------------------------------------------------------------------
// POST /api/payments/payfast
// Body: { tier, userEmail?, userName? }
// Returns: { uuid, m_payment_id, sandbox }
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const { tier, userEmail = '', userName = '' } = await request.json()

    const tierData = TIER_ZAR[tier as string]
    if (!tierData) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const [firstName = 'Player', ...rest] = userName.trim().split(' ')
    const lastName = rest.join(' ') || 'Player'
    const mPaymentId = `gl_${tier}_${Date.now()}`

    // PayFast requires params in this specific order
    const params: Record<string, string> = {
      merchant_id:   MERCHANT_ID,
      merchant_key:  MERCHANT_KEY,
      return_url:    `${SITE_URL}/choose-stake`,
      cancel_url:    `${SITE_URL}/choose-stake`,
      notify_url:    `${SITE_URL}/api/payments/payfast/notify`,
      name_first:    firstName,
      name_last:     lastName,
      email_address: userEmail,
      m_payment_id:  mPaymentId,
      amount:        tierData.amount,
      item_name:     tierData.itemName,
    }

    // Strip blank values before signing
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''))
    clean.signature = buildSignature(clean)

    const pfRes = await fetch(ONSITE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams(clean).toString(),
    })

    if (!pfRes.ok) {
      const detail = await pfRes.text()
      console.error('[PayFast] Onsite process error:', pfRes.status, detail)
      return NextResponse.json({ error: 'PayFast unavailable', detail }, { status: 502 })
    }

    const { uuid } = (await pfRes.json()) as { uuid: string }
    return NextResponse.json({ uuid, m_payment_id: mPaymentId, sandbox: SANDBOX })
  } catch (err) {
    console.error('[PayFast] Payment creation failed:', err)
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
  }
}
