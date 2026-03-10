import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Mock AI verification — swap with real computer vision when ready
export async function POST(request: NextRequest) {
  try {
    const { betId, storagePath } = await request.json()

    // Simulate AI processing time (1.5–2.5s)
    const delay = 1500 + Math.random() * 1000
    await new Promise(r => setTimeout(r, delay))

    // Mock result — always returns "not verified" so user must self-declare
    // In production this would analyze the video for ball trajectory
    const result = {
      verified: false,
      confidence: 0.0,
      message: 'Manual review required — declare your result below',
      betId,
      storagePath,
      analysedAt: new Date().toISOString(),
    }

    // Store verification record in Supabase if configured
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user && betId && !betId.startsWith('bet_mock') && !betId.startsWith('bet_fallback')) {
        await supabase.from('verifications').upsert({
          bet_id: betId,
          status: 'pending',
          footage_received_at: new Date().toISOString(),
        })

        if (storagePath && !storagePath.startsWith('mock/')) {
          await supabase.from('bets')
            .update({ video_url: storagePath })
            .eq('id', betId)
            .eq('user_id', user.id)
        }
      }
    } catch {
      // Non-critical — continue
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
