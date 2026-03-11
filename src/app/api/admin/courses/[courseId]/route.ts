import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_COURSES } from '@/lib/admin-mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error
    const { courseId } = await params

    if (auth.isMock || !auth.adminClient) {
      const course = MOCK_ADMIN_COURSES.find(c => c.id === courseId)
      if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ course, holes: [] })
    }

    const adminClient = auth.adminClient
    const { data: course, error } = await adminClient
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (error || !course) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: holes } = await adminClient
      .from('holes')
      .select('*')
      .eq('course_id', courseId)
      .order('hole_number', { ascending: true })

    return NextResponse.json({ course, holes: holes ?? [] })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error
    const { courseId } = await params
    const body = await request.json()

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock' })
    }

    const { error } = await auth.adminClient
      .from('courses')
      .update(body)
      .eq('id', courseId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error
    const { courseId } = await params

    if (auth.isMock || !auth.adminClient) {
      return NextResponse.json({ success: true, source: 'mock' })
    }

    // Check if any bets reference this course
    const { count } = await auth.adminClient
      .from('bets')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId)

    if (count && count > 0) {
      return NextResponse.json({ error: 'Cannot delete course with existing bets' }, { status: 400 })
    }

    // Delete holes first, then course
    await auth.adminClient.from('holes').delete().eq('course_id', courseId)
    const { error } = await auth.adminClient.from('courses').delete().eq('id', courseId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
