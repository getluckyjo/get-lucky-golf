import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import type { BatchActionResult } from '@/types/admin'

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    const body = await request.json()
    const { ids, action, notes } = body as {
      ids: string[]
      action: 'approve' | 'reject' | 'under_review'
      notes?: string
    }

    if (!ids?.length || !action) {
      return NextResponse.json({ error: 'ids and action are required' }, { status: 400 })
    }

    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      under_review: 'under_review',
    } as const

    const newStatus = statusMap[action]

    if (auth.isMock || !auth.adminClient) {
      const results: BatchActionResult[] = ids.map(id => ({ id, success: true }))
      return NextResponse.json({ results, action, newStatus })
    }

    const adminClient = auth.adminClient
    const now = new Date().toISOString()
    const results: BatchActionResult[] = []

    for (const id of ids) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updates: any = {
          status: newStatus,
          reviewed_by: auth.user?.id,
        }
        if (notes) updates.reviewer_notes = notes
        if (newStatus === 'approved') updates.verified_at = now

        const { error } = await adminClient
          .from('verifications')
          .update(updates)
          .eq('id', id)

        if (error) {
          results.push({ id, success: false, error: error.message })
          continue
        }

        // If approved, update bet status
        if (newStatus === 'approved') {
          const { data: ver } = await adminClient
            .from('verifications')
            .select('bet_id')
            .eq('id', id)
            .single()
          if (ver) {
            await adminClient
              .from('bets')
              .update({ status: 'verified' })
              .eq('id', ver.bet_id)
          }
        }

        results.push({ id, success: true })
      } catch {
        results.push({ id, success: false, error: 'Processing failed' })
      }
    }

    return NextResponse.json({ results, action, newStatus })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
