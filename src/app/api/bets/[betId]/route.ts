import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ betId: string }> }
) {
  try {
    const { betId } = await params
    const body = await request.json()
    const { status, declared_result } = body

    // Return mock success for mock bet IDs
    if (betId.startsWith('bet_mock') || betId.startsWith('bet_fallback')) {
      return NextResponse.json({ success: true, source: 'mock' })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    if (declared_result) {
      updates.declared_result = declared_result
      updates.declared_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('bets')
      .update(updates)
      .eq('id', betId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, source: 'database' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ betId: string }> }
) {
  try {
    const { betId } = await params

    if (betId.startsWith('bet_mock') || betId.startsWith('bet_fallback')) {
      return NextResponse.json({ bet: null, source: 'mock' })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: bet, error } = await supabase
      .from('bets')
      .select('*')
      .eq('id', betId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ bet: null, error: error.message })
    }

    return NextResponse.json({ bet, source: 'database' })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
