import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_COURSES } from '@/lib/admin-mock-data'
import type { AdminCourseRecord, PaginatedResponse } from '@/types/admin'

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const partner = searchParams.get('partner')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))

    if (auth.isMock || !auth.adminClient) {
      let filtered = [...MOCK_ADMIN_COURSES]
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(c => c.name.toLowerCase().includes(s) || (c.region?.toLowerCase() || '').includes(s))
      }
      if (partner === 'true') filtered = filtered.filter(c => c.is_partner)
      if (partner === 'false') filtered = filtered.filter(c => !c.is_partner)

      const total = filtered.length
      const start = (page - 1) * limit
      const data = filtered.slice(start, start + limit)

      const resp: PaginatedResponse<AdminCourseRecord> = { data, total, page, limit, totalPages: Math.ceil(total / limit) }
      return NextResponse.json(resp)
    }

    const adminClient = auth.adminClient
    let query = adminClient
      .from('courses')
      .select('*, holes ( id, is_active )', { count: 'exact' })

    if (partner === 'true') query = query.eq('is_partner', true)
    if (partner === 'false') query = query.eq('is_partner', false)

    query = query.order('name', { ascending: true })

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: rows, count, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: AdminCourseRecord[] = (rows ?? []).map((c: any) => {
      const holes = Array.isArray(c.holes) ? c.holes : []
      return {
        ...c,
        holes: undefined,
        holeCount: holes.length,
        activeHoleCount: holes.filter((h: { is_active: boolean }) => h.is_active).length,
        totalBets: 0,
      }
    })

    if (search) {
      const s = search.toLowerCase()
      data = data.filter(c => c.name.toLowerCase().includes(s) || (c.region?.toLowerCase() || '').includes(s))
    }

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

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const body = await request.json()

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock', id: 'mock-course-new' })
    }

    const { data, error } = await auth.adminClient
      .from('courses')
      .insert({
        name: body.name,
        location_text: body.location_text || null,
        region: body.region || null,
        country: body.country || 'South Africa',
        lat: body.lat || null,
        lng: body.lng || null,
        is_partner: body.is_partner || false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
