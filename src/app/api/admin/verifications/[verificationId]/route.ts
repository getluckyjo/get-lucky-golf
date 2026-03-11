import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getMockVerificationDetail, MOCK_ADMIN_VERIFICATIONS } from '@/lib/admin-mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { verificationId } = await params

    if (auth.isMock || !auth.adminClient) {
      const detail = getMockVerificationDetail(verificationId)
      if (!detail) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(detail)
    }

    const adminClient = auth.adminClient

    // Fetch verification with joined data
    const { data: row, error } = await adminClient
      .from('verifications')
      .select(`
        *,
        bets!inner (
          *,
          courses ( name ),
          holes ( hole_number ),
          profiles ( name, total_attempts )
        )
      `)
      .eq('id', verificationId)
      .single()

    if (error || !row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Generate signed URLs for video and documents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bet = row.bets as any
    let videoSignedUrl = null
    let certificateSignedUrl = null
    let affidavitSignedUrl = null

    if (bet?.video_url) {
      const { data } = await adminClient.storage
        .from('shot-videos')
        .createSignedUrl(bet.video_url, 3600)
      videoSignedUrl = data?.signedUrl ?? null
    }

    if (row.certificate_path) {
      const { data } = await adminClient.storage
        .from('verification-docs')
        .createSignedUrl(row.certificate_path, 3600)
      certificateSignedUrl = data?.signedUrl ?? null
    }

    if (row.affidavit_path) {
      const { data } = await adminClient.storage
        .from('verification-docs')
        .createSignedUrl(row.affidavit_path, 3600)
      affidavitSignedUrl = data?.signedUrl ?? null
    }

    // Fetch user's bet history
    const { data: userBets } = await adminClient
      .from('bets')
      .select(`*, courses ( name ), holes ( hole_number )`)
      .eq('user_id', bet.user_id)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      id: row.id,
      betId: row.bet_id,
      status: row.status,
      tier: bet?.tier,
      stakePence: bet?.stake_pence,
      potentialWinPence: bet?.potential_win_pence,
      videoUrl: bet?.video_url,
      certificatePath: row.certificate_path,
      affidavitPath: row.affidavit_path,
      userName: bet?.profiles?.name,
      userId: bet?.user_id,
      courseName: bet?.courses?.name,
      holeNumber: bet?.holes?.hole_number,
      createdAt: row.created_at,
      declaredAt: bet?.declared_at,
      documentsReceivedAt: row.documents_received_at,
      reviewerNotes: row.reviewer_notes,
      reviewedBy: row.reviewed_by,
      verifiedAt: row.verified_at,
      payoutInitiatedAt: row.payout_initiated_at,
      videoSignedUrl,
      certificateSignedUrl,
      affidavitSignedUrl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userBetHistory: (userBets ?? []).map((b: any) => ({
        id: b.id,
        userId: b.user_id,
        userName: bet?.profiles?.name,
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
      userTotalAttempts: bet?.profiles?.total_attempts ?? 0,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const { verificationId } = await params
    const body = await request.json()
    const { status, reviewerNotes } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    if (auth.isMock || !auth.adminClient) {
      const item = MOCK_ADMIN_VERIFICATIONS.find(v => v.id === verificationId)
      if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, source: 'mock', verificationId, newStatus: status })
    }

    const adminClient = auth.adminClient
    const now = new Date().toISOString()

    // Update verification
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = { status }
    if (reviewerNotes !== undefined) updates.reviewer_notes = reviewerNotes
    if (auth.user) updates.reviewed_by = auth.user.id
    if (status === 'approved') updates.verified_at = now
    if (status === 'under_review') { /* no extra fields */ }

    const { error: verError } = await adminClient
      .from('verifications')
      .update(updates)
      .eq('id', verificationId)

    if (verError) {
      return NextResponse.json({ error: verError.message }, { status: 500 })
    }

    // If approved, also update bet status to 'verified'
    if (status === 'approved') {
      const { data: verification } = await adminClient
        .from('verifications')
        .select('bet_id')
        .eq('id', verificationId)
        .single()

      if (verification) {
        await adminClient
          .from('bets')
          .update({ status: 'verified' })
          .eq('id', verification.bet_id)
      }
    }

    // If rejected, keep bet as 'claimed' (no change needed)

    return NextResponse.json({ success: true, verificationId, newStatus: status })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
