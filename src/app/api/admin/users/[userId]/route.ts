import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_USERS, MOCK_ADMIN_BETS } from '@/lib/admin-mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { userId } = await params

    if (auth.isMock || !auth.adminClient) {
      const user = MOCK_ADMIN_USERS.find(u => u.id === userId)
      if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const bets = MOCK_ADMIN_BETS.filter(b => b.userId === userId)
      return NextResponse.json({ user, bets })
    }

    const adminClient = auth.adminClient

    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: userBets } = await adminClient
      .from('bets')
      .select(`*, courses ( name ), holes ( hole_number )`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    const bets = userBets ?? []
    const totalStaked = bets.reduce((sum, b) => sum + (b.stake_pence ?? 0), 0)
    const totalWon = bets
      .filter(b => b.status === 'paid' || b.status === 'verified')
      .reduce((sum, b) => sum + (b.potential_win_pence ?? 0), 0)

    return NextResponse.json({
      user: {
        id: profile.id,
        name: profile.name,
        email: '',
        handicap: profile.handicap,
        totalAttempts: profile.total_attempts ?? 0,
        totalStaked,
        totalWon,
        paymentMethod: profile.payment_method,
        isAdmin: profile.is_admin ?? false,
        suspendedAt: profile.suspended_at,
        suspendedReason: profile.suspended_reason,
        createdAt: profile.created_at,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bets: bets.map((b: any) => ({
        id: b.id,
        userId: b.user_id,
        userName: profile.name,
        tier: b.tier,
        stakePence: b.stake_pence,
        potentialWinPence: b.potential_win_pence,
        status: b.status,
        declaredResult: b.declared_result,
        declaredAt: b.declared_at,
        videoUrl: b.video_url,
        paymentIntentId: b.payment_intent_id,
        courseName: b.courses?.name ?? '',
        courseId: b.course_id,
        holeNumber: b.holes?.hole_number ?? 0,
        holeId: b.hole_id,
        createdAt: b.created_at,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { userId } = await params
    const body = await request.json()
    const { suspended, reason } = body

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock' })
    }

    const updates: Record<string, unknown> = {}
    if (suspended === true) {
      updates.suspended_at = new Date().toISOString()
      if (reason) updates.suspended_reason = reason
    } else if (suspended === false) {
      updates.suspended_at = null
      updates.suspended_reason = null
    }

    const { error } = await auth.adminClient
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
