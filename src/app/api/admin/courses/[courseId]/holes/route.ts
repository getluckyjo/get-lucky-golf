import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error
    const { courseId } = await params

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ holes: [] })
    }

    const { data, error } = await auth.adminClient
      .from('holes')
      .select('*')
      .eq('course_id', courseId)
      .order('hole_number', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ holes: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error
    const { courseId } = await params
    const body = await request.json()

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock', id: 'mock-hole-new' })
    }

    const { data, error } = await auth.adminClient
      .from('holes')
      .insert({
        course_id: courseId,
        hole_number: body.hole_number,
        par: body.par ?? 3,
        distance_metres: body.distance_metres || null,
        is_active: body.is_active ?? true,
        jackpot_amount: body.jackpot_amount ?? 0,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
