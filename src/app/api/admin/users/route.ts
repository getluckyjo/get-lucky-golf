import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_USERS } from '@/lib/admin-mock-data'
import type { AdminUserRecord, PaginatedResponse } from '@/types/admin'

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const suspended = searchParams.get('suspended')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))

    if (auth.isMock || !auth.adminClient) {
      let filtered = [...MOCK_ADMIN_USERS]
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(u =>
          (u.name?.toLowerCase() || '').includes(s) || u.email.toLowerCase().includes(s)
        )
      }
      if (suspended === 'true') filtered = filtered.filter(u => u.suspendedAt !== null)
      if (suspended === 'false') filtered = filtered.filter(u => u.suspendedAt === null)

      const total = filtered.length
      const start = (page - 1) * limit
      const data = filtered.slice(start, start + limit)

      const resp: PaginatedResponse<AdminUserRecord> = { data, total, page, limit, totalPages: Math.ceil(total / limit) }
      return NextResponse.json(resp)
    }

    const adminClient = auth.adminClient
    let query = adminClient
      .from('profiles')
      .select('*', { count: 'exact' })

    if (suspended === 'true') query = query.not('suspended_at', 'is', null)
    if (suspended === 'false') query = query.is('suspended_at', null)

    query = query.order('created_at', { ascending: false })

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: profiles, count, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Get bet aggregates for each user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: AdminUserRecord[] = await Promise.all((profiles ?? []).map(async (p: any) => {
      const { data: userBets } = await adminClient
        .from('bets')
        .select('stake_pence, potential_win_pence, status')
        .eq('user_id', p.id)

      const bets = userBets ?? []
      const totalStaked = bets.reduce((sum, b) => sum + (b.stake_pence ?? 0), 0)
      const totalWon = bets
        .filter(b => b.status === 'paid' || b.status === 'verified')
        .reduce((sum, b) => sum + (b.potential_win_pence ?? 0), 0)

      return {
        id: p.id,
        name: p.name,
        email: '', // Will be filled if auth.users available
        handicap: p.handicap,
        totalAttempts: p.total_attempts ?? 0,
        totalStaked,
        totalWon,
        paymentMethod: p.payment_method,
        isAdmin: p.is_admin ?? false,
        suspendedAt: p.suspended_at,
        suspendedReason: p.suspended_reason,
        createdAt: p.created_at,
      }
    }))

    // Post-filter by search
    let result = data
    if (search) {
      const s = search.toLowerCase()
      result = data.filter(u => (u.name?.toLowerCase() || '').includes(s) || u.email.toLowerCase().includes(s))
    }

    return NextResponse.json({
      data: result,
      total: count ?? result.length,
      page,
      limit,
      totalPages: Math.ceil((count ?? result.length) / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
