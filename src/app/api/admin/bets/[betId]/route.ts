import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_BETS } from '@/lib/admin-mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ betId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { betId } = await params

    if (auth.isMock || !auth.adminClient) {
      const bet = MOCK_ADMIN_BETS.find(b => b.id === betId)
      if (!bet) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(bet)
    }

    const adminClient = auth.adminClient
    const { data: bet, error } = await adminClient
      .from('bets')
      .select('*')
      .eq('id', betId)
      .single()

    if (error || !bet) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Fetch related data separately
    const [profileRes, courseRes, holeRes] = await Promise.all([
      bet.user_id ? adminClient.from('profiles').select('name').eq('id', bet.user_id).single() : Promise.resolve({ data: null }),
      bet.course_id ? adminClient.from('courses').select('name').eq('id', bet.course_id).single() : Promise.resolve({ data: null }),
      bet.hole_id ? adminClient.from('holes').select('hole_number').eq('id', bet.hole_id).single() : Promise.resolve({ data: null }),
    ])

    return NextResponse.json({
      id: bet.id,
      userId: bet.user_id,
      userName: profileRes.data?.name ?? null,
      tier: bet.tier,
      stakeCents: bet.stake_pence,
      potentialWinCents: bet.potential_win_pence,
      status: bet.status,
      declaredResult: bet.declared_result,
      declaredAt: bet.declared_at,
      videoUrl: bet.video_url,
      paymentIntentId: bet.payment_intent_id,
      courseName: courseRes.data?.name ?? '',
      courseId: bet.course_id,
      holeNumber: holeRes.data?.hole_number ?? 0,
      holeId: bet.hole_id,
      createdAt: bet.created_at,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ betId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { betId } = await params
    const body = await request.json()

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock', betId })
    }

    // Whitelist allowed fields and values to prevent mass assignment + invalid states
    const VALID_STATUSES = ['active', 'miss', 'claimed', 'verified', 'paid'] as const
    const VALID_RESULTS = ['miss', 'win'] as const
    const updates: Record<string, unknown> = {}

    if (body.status !== undefined) {
      if (!(VALID_STATUSES as readonly string[]).includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
      }
      updates.status = body.status
    }
    if (body.declared_result !== undefined) {
      if (!(VALID_RESULTS as readonly string[]).includes(body.declared_result)) {
        return NextResponse.json({ error: 'Invalid declared_result value' }, { status: 400 })
      }
      updates.declared_result = body.declared_result
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { error } = await auth.adminClient
      .from('bets')
      .update(updates)
      .eq('id', betId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, betId })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
