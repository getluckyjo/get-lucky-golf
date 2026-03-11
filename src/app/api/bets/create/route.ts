import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { BET_TIERS } from '@/context/BetContext'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId, holeId, tier, paymentIntentId } = body

    if (!courseId || !holeId || !tier || !paymentIntentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const tierData = BET_TIERS.find(t => t.tier === tier)
    if (!tierData) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { data: bet, error } = await supabase
      .from('bets')
      .insert({
        user_id:             user.id,
        course_id:           courseId,
        hole_id:             holeId,
        tier,
        stake_pence:         tierData.stakeZAR * 100,
        potential_win_pence: tierData.winZAR   * 100,
        payment_intent_id:   paymentIntentId,
        status:              'active',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[bets/create] DB insert failed:', error.message)
      return NextResponse.json(
        { error: 'Failed to create bet', detail: error.message },
        { status: 500 },
      )
    }

    // Increment total_attempts on profile — best-effort, fire-and-forget.
    // Uses an RPC that may not exist in the DB yet; safe to ignore failures.
    supabase.rpc('increment_attempts', { user_id: user.id }).catch(() => {})

    return NextResponse.json({ betId: bet.id, source: 'database' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
