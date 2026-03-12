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

    const { data, error } = await auth.adminClient
      .from('bets')
      .select(`*, profiles ( name ), courses ( name ), holes ( hole_number )`)
      .eq('id', betId)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      id: data.id,
      userId: data.user_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userName: (data as any).profiles?.name,
      tier: data.tier,
      stakePence: data.stake_pence,
      potentialWinPence: data.potential_win_pence,
      status: data.status,
      declaredResult: data.declared_result,
      declaredAt: data.declared_at,
      videoUrl: data.video_url,
      paymentIntentId: data.payment_intent_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      courseName: (data as any).courses?.name ?? '',
      courseId: data.course_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      holeNumber: (data as any).holes?.hole_number ?? 0,
      holeId: data.hole_id,
      createdAt: data.created_at,
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

    // Whitelist allowed fields to prevent mass assignment
    const ALLOWED_FIELDS = ['status', 'declared_result'] as const
    const updates: Record<string, unknown> = {}
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) updates[key] = body[key]
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
