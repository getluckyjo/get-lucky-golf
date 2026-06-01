import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID ?? '10000100').trim()
const PASSPHRASE  = (process.env.PAYFAST_PASSPHRASE  ?? '').trim()
const SANDBOX     = (process.env.PAYFAST_SANDBOX ?? 'true').trim() !== 'false'

// ---------------------------------------------------------------------------
// PayFast Subscriptions API signature (header-based, differs from checkout).
// All header params + passphrase are sorted alphabetically, url-encoded, then
// MD5-hashed. Ref: https://developers.payfast.co.za/api#authentication
// ---------------------------------------------------------------------------
function apiSignature(headers: Record<string, string>, passphrase: string): string {
  const merged: Record<string, string> = { ...headers }
  if (passphrase) merged.passphrase = passphrase
  const ordered = Object.keys(merged)
    .sort()
    .map(k => `${k}=${encodeURIComponent(merged[k].trim()).replace(/%20/g, '+')}`)
    .join('&')
  return crypto.createHash('md5').update(ordered).digest('hex')
}

// Best-effort call to PayFast to cancel the recurring subscription. Failures
// are non-fatal: the optimistic DB flip + the eventual CANCELLED ITN keep the
// app's state correct even if this call can't be made (e.g. sandbox).
async function cancelPayfastSubscription(token: string): Promise<boolean> {
  if (!token) return false
  try {
    const timestamp = new Date().toISOString()
    const headerParams: Record<string, string> = {
      'merchant-id': MERCHANT_ID,
      timestamp,
      version: 'v1',
    }
    const signature = apiSignature(headerParams, PASSPHRASE)
    const url = `https://api.payfast.co.za/subscriptions/${token}/cancel${SANDBOX ? '?testing=true' : ''}`

    const res = await fetch(url, {
      method: 'PUT',
      headers: { ...headerParams, signature, 'content-type': 'application/json' },
    })
    if (!res.ok) {
      console.warn('[Membership Cancel] PayFast API returned', res.status)
      return false
    }
    return true
  } catch (err) {
    console.warn('[Membership Cancel] PayFast API call failed:', err)
    return false
  }
}

// ---------------------------------------------------------------------------
// POST /api/payments/membership/cancel
// Auth-gated. Optimistically marks the membership cancelled (kept until the
// current period ends via membership_renews_at) and best-effort cancels the
// PayFast subscription so no further charges occur.
// ---------------------------------------------------------------------------
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let admin
    try {
      admin = createAdminClient()
    } catch {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    // Read the current state to get the subscription token.
    const { data: profile } = await admin
      .from('profiles')
      .select('membership_status, membership_plan, payfast_subscription_token')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || profile.membership_status === 'none') {
      return NextResponse.json({ error: 'No active membership' }, { status: 400 })
    }

    // Optimistic flip — access is retained until membership_renews_at.
    const { error } = await admin
      .from('profiles')
      .update({ membership_status: 'cancelled' })
      .eq('id', user.id)
    if (error) {
      console.error('[Membership Cancel] DB update failed:', error.message)
      return NextResponse.json({ error: 'Could not cancel membership' }, { status: 500 })
    }

    await admin.from('membership_subscriptions').insert({
      user_id: user.id,
      plan: profile.membership_plan,
      status: 'cancelled',
      event_type: 'cancelled',
      pf_subscription_token: profile.payfast_subscription_token,
    })

    const pfCancelled = await cancelPayfastSubscription(profile.payfast_subscription_token ?? '')

    return NextResponse.json({ ok: true, payfastCancelled: pfCancelled })
  } catch (err) {
    console.error('[Membership Cancel] Unexpected error:', err)
    return NextResponse.json({ error: 'Cancellation failed' }, { status: 500 })
  }
}
