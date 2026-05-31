import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_BETS } from '@/lib/admin-mock-data'

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))

    if (auth.isMock || !auth.adminClient) {
      const payouts = MOCK_ADMIN_BETS.filter(b => b.status === 'paid' || b.status === 'verified')
      const total = payouts.length
      const start = (page - 1) * limit
      const data = payouts.slice(start, start + limit)
      return NextResponse.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) })
    }

    const adminClient = auth.adminClient
    const { data: rows, count, error } = await adminClient
      .from('bets')
      .select(`*, profiles ( name ), courses ( name ), holes ( hole_number )`, { count: 'exact' })
      .in('status', ['paid', 'verified'])
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (rows ?? []).map((b: any) => ({
      id: b.id,
      userId: b.user_id,
      userName: b.profiles?.name,
      tier: b.tier,
      stakeCents: b.stake_pence,
      potentialWinCents: b.potential_win_pence,
      status: b.status,
      courseName: b.courses?.name ?? '',
      holeNumber: b.holes?.hole_number ?? 0,
      createdAt: b.created_at,
    }))

    return NextResponse.json({
      data,
      total: count ?? data.length,
      page,
      limit,
      totalPages: Math.ceil((count ?? data.length) / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
