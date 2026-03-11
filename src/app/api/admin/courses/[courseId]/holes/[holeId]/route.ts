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

    const { error } = await auth.adminClient
      .from('holes')
      .update(body)
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
