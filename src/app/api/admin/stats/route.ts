import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_STATS } from '@/lib/admin-mock-data'

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({
        ...MOCK_ADMIN_STATS,
        adminName: 'Admin User',
        adminEmail: 'admin@getlucky.golf',
      })
    }

    const adminClient = auth.adminClient

    // Total revenue (sum of all stakes for bets with payment confirmed)
    const { data: allBets } = await adminClient
      .from('bets')
      .select('stake_pence, potential_win_pence, status')

    const bets = allBets ?? []
    const totalRevenue = bets.reduce((sum, b) => sum + (b.stake_pence ?? 0), 0)
    const activeBets = bets.filter(b => b.status === 'active').length
    const totalPayouts = bets
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + (b.potential_win_pence ?? 0), 0)

    // Pending claims
    const { count: pendingClaims } = await adminClient
      .from('verifications')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'documents_received', 'under_review'])

    // Total users
    const { count: totalUsers } = await adminClient
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    // Recent bets
    const { data: recentBetsRaw } = await adminClient
      .from('bets')
      .select(`*, profiles ( name ), courses ( name ), holes ( hole_number )`)
      .order('created_at', { ascending: false })
      .limit(5)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentBets = (recentBetsRaw ?? []).map((b: any) => ({
      id: b.id,
      userId: b.user_id,
      userName: b.profiles?.name,
      tier: b.tier,
      stakeCents: b.stake_pence,
      potentialWinCents: b.potential_win_pence,
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
    }))

    // Recent verifications
    const { data: recentVerifsRaw } = await adminClient
      .from('verifications')
      .select(`*, bets!inner ( tier, stake_pence, potential_win_pence, video_url, user_id, declared_at, courses ( name ), holes ( hole_number ), profiles ( name ) )`)
      .order('created_at', { ascending: false })
      .limit(3)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentVerifications = (recentVerifsRaw ?? []).map((row: any) => ({
      id: row.id,
      betId: row.bet_id,
      status: row.status,
      tier: row.bets?.tier,
      stakeCents: row.bets?.stake_pence,
      potentialWinCents: row.bets?.potential_win_pence,
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

    // Get admin info
    let adminName = 'Admin'
    let adminEmail = ''
    if (auth.user) {
      const { data: profile } = await adminClient
        .from('profiles')
        .select('name')
        .eq('id', auth.user.id)
        .single()
      adminName = profile?.name || 'Admin'
      adminEmail = auth.user.email || ''
    }

    return NextResponse.json({
      totalRevenue,
      activeBets,
      pendingClaims: pendingClaims ?? 0,
      totalPayouts,
      totalUsers: totalUsers ?? 0,
      recentBets,
      recentVerifications,
      adminName,
      adminEmail,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
