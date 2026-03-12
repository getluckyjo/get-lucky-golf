import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_BETS } from '@/lib/admin-mock-data'
import type { AdminBetRecord, PaginatedResponse } from '@/types/admin'

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tier = searchParams.get('tier')
    const courseId = searchParams.get('courseId')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))

    if (auth.isMock || !auth.adminClient) {
      let filtered = [...MOCK_ADMIN_BETS]
      if (status) filtered = filtered.filter(b => b.status === status)
      if (tier) filtered = filtered.filter(b => b.tier === tier)
      if (courseId) filtered = filtered.filter(b => b.courseId === courseId)
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(b =>
          (b.userName?.toLowerCase() || '').includes(s) ||
          b.courseName.toLowerCase().includes(s) ||
          b.id.toLowerCase().includes(s)
        )
      }
      if (dateFrom) filtered = filtered.filter(b => b.createdAt >= dateFrom)
      if (dateTo) filtered = filtered.filter(b => b.createdAt <= dateTo)

      filtered.sort((a, b) => {
        const aVal = sort === 'stake_pence' ? a.stakeCents : new Date(a.createdAt).getTime()
        const bVal = sort === 'stake_pence' ? b.stakeCents : new Date(b.createdAt).getTime()
        return order === 'asc' ? aVal - bVal : bVal - aVal
      })

      const total = filtered.length
      const start = (page - 1) * limit
      const data = filtered.slice(start, start + limit)

      const resp: PaginatedResponse<AdminBetRecord> = { data, total, page, limit, totalPages: Math.ceil(total / limit) }
      return NextResponse.json(resp)
    }

    const adminClient = auth.adminClient

    // Step 1: Query bets
    let query = adminClient
      .from('bets')
      .select('*', { count: 'exact' })

    if (status) query = query.eq('status', status)
    if (tier) query = query.eq('tier', tier)
    if (courseId) query = query.eq('course_id', courseId)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo)

    query = query.order(sort === 'stake_pence' ? 'stake_pence' : 'created_at', { ascending: order === 'asc' })

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: rows, count: betCount, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const betRows = rows ?? []

    // Step 2: Fetch related profiles, courses, holes
    const userIds = [...new Set(betRows.map((b: { user_id: string }) => b.user_id).filter(Boolean))]
    const courseIds = [...new Set(betRows.map((b: { course_id: string }) => b.course_id).filter(Boolean))]
    const holeIds = [...new Set(betRows.map((b: { hole_id: string }) => b.hole_id).filter(Boolean))]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profilesMap: Record<string, any> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coursesMap: Record<string, any> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const holesMap: Record<string, any> = {}

    const [profilesRes, coursesRes, holesRes] = await Promise.all([
      userIds.length > 0 ? adminClient.from('profiles').select('id, name').in('id', userIds) : Promise.resolve({ data: [] }),
      courseIds.length > 0 ? adminClient.from('courses').select('id, name').in('id', courseIds) : Promise.resolve({ data: [] }),
      holeIds.length > 0 ? adminClient.from('holes').select('id, hole_number').in('id', holeIds) : Promise.resolve({ data: [] }),
    ])

    for (const p of profilesRes.data ?? []) profilesMap[p.id] = p
    for (const c of coursesRes.data ?? []) coursesMap[c.id] = c
    for (const h of holesRes.data ?? []) holesMap[h.id] = h

    // Step 3: Combine
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: AdminBetRecord[] = betRows.map((b: any) => ({
      id: b.id,
      userId: b.user_id,
      userName: b.user_id ? profilesMap[b.user_id]?.name : null,
      tier: b.tier,
      stakeCents: b.stake_pence,
      potentialWinCents: b.potential_win_pence,
      status: b.status,
      declaredResult: b.declared_result,
      declaredAt: b.declared_at,
      videoUrl: b.video_url,
      paymentIntentId: b.payment_intent_id,
      courseName: b.course_id ? coursesMap[b.course_id]?.name ?? '' : '',
      courseId: b.course_id,
      holeNumber: b.hole_id ? holesMap[b.hole_id]?.hole_number ?? 0 : 0,
      holeId: b.hole_id,
      createdAt: b.created_at,
    }))

    // Post-filter by search (name search requires post-filtering)
    if (search) {
      const s = search.toLowerCase()
      data = data.filter(b =>
        (b.userName?.toLowerCase() || '').includes(s) ||
        b.courseName.toLowerCase().includes(s) ||
        b.id.toLowerCase().includes(s)
      )
    }

    return NextResponse.json({
      data,
      total: betCount ?? data.length,
      page,
      limit,
      totalPages: Math.ceil((betCount ?? data.length) / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
