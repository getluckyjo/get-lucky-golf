import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_VERIFICATIONS } from '@/lib/admin-mock-data'
import type { VerificationQueueItem, PaginatedResponse } from '@/types/admin'

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tier = searchParams.get('tier')
    const sort = searchParams.get('sort') || 'oldest'
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))

    if (auth.isMock || !auth.adminClient) {
      let filtered = [...MOCK_ADMIN_VERIFICATIONS]
      if (status) filtered = filtered.filter(v => v.status === status)
      if (tier) filtered = filtered.filter(v => v.tier === tier)

      if (sort === 'oldest') filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      else if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      else if (sort === 'highest') filtered.sort((a, b) => b.potentialWinPence - a.potentialWinPence)

      const total = filtered.length
      const start = (page - 1) * limit
      const data = filtered.slice(start, start + limit)

      const resp: PaginatedResponse<VerificationQueueItem> = {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
      return NextResponse.json(resp)
    }

    // Real DB query
    const adminClient = auth.adminClient
    let query = adminClient
      .from('verifications')
      .select(`
        id,
        bet_id,
        status,
        certificate_path,
        affidavit_path,
        footage_received_at,
        documents_received_at,
        verified_at,
        payout_initiated_at,
        reviewer_notes,
        reviewed_by,
        created_at,
        bets!inner (
          id,
          user_id,
          tier,
          stake_pence,
          potential_win_pence,
          video_url,
          declared_at,
          courses ( name ),
          holes ( hole_number ),
          profiles ( name )
        )
      `, { count: 'exact' })

    if (status) query = query.eq('status', status)

    if (sort === 'oldest') query = query.order('created_at', { ascending: true })
    else if (sort === 'newest') query = query.order('created_at', { ascending: false })

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: rows, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: VerificationQueueItem[] = (rows ?? []).map((row: any) => ({
      id: row.id,
      betId: row.bet_id,
      status: row.status,
      tier: row.bets?.tier,
      stakePence: row.bets?.stake_pence,
      potentialWinPence: row.bets?.potential_win_pence,
      videoUrl: row.bets?.video_url,
      certificatePath: row.certificate_path,
      affidavitPath: row.affidavit_path,
      userName: row.bets?.profiles?.name,
      userId: row.bets?.user_id,
      courseName: row.bets?.courses?.name,
      holeNumber: row.bets?.holes?.hole_number,
      createdAt: row.created_at,
      declaredAt: row.bets?.declared_at,
      documentsReceivedAt: row.documents_received_at,
      reviewerNotes: row.reviewer_notes,
      reviewedBy: row.reviewed_by,
      verifiedAt: row.verified_at,
      payoutInitiatedAt: row.payout_initiated_at,
    }))

    if (tier) {
      // Post-filter by tier since it's on the joined table
      const filtered = data.filter(d => d.tier === tier)
      return NextResponse.json({
        data: filtered,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      })
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
