import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courseId: string; holeId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error
    const { holeId } = await params
    const body = await request.json()

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock' })
    }

    // Whitelist allowed fields to prevent mass assignment
    const ALLOWED_FIELDS = ['hole_number', 'par', 'distance_metres', 'is_active', 'jackpot_amount'] as const
    const updates: Record<string, unknown> = {}
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { error } = await auth.adminClient
      .from('holes')
      .update(updates)
      .eq('id', holeId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ courseId: string; holeId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error
    const { holeId } = await params

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock' })
    }

    const { error } = await auth.adminClient
      .from('holes')
      .delete()
      .eq('id', holeId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
