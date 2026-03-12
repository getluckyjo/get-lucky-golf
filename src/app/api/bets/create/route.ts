import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { BET_TIERS } from '@/lib/tiers'

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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
      console.error('[bets/create] DB insert failed:', error.message, error.code, error.details)
      return NextResponse.json({ error: 'Failed to create bet' }, { status: 500 })
    }

    // Increment total_attempts on profile — best-effort, fire-and-forget.
    try {
      await supabase.rpc('increment_attempts', { user_id: user.id })
    } catch {
      // Safe to ignore if RPC fails
    }

    return NextResponse.json({ betId: bet.id })
  } catch (err) {
    console.error('[bets/create] Unexpected error:', err)
    const msg = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
