import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mock Stripe-shaped payment intent
// Swap with real stripe.paymentIntents.create() when going live
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'gbp', tier } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 600))

    const paymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    return NextResponse.json({
      id: paymentIntentId,
      object: 'payment_intent',
      amount,
      currency,
      status: 'succeeded',
      tier,
      client_secret: `${paymentIntentId}_secret_mock`,
      created: Math.floor(Date.now() / 1000),
    })
  } catch {
    return NextResponse.json({ error: 'Payment simulation failed' }, { status: 500 })
  }
}
