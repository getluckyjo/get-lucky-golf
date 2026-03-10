import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 500)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: bets, error } = await supabase
      .from('bets')
      .select(`
        id,
        tier,
        stake_pence,
        potential_win_pence,
        status,
        declared_result,
        created_at,
        courses (
          id,
          name,
          location_text,
          region
        ),
        holes (
          id,
          hole_number,
          par,
          distance_metres
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ bets: [], error: error.message })
    }

    return NextResponse.json({ bets: bets ?? [] })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
