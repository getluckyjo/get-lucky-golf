import { resend } from '@/lib/resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? 'Get Lucky Golf <noreply@getluckygolf.co.za>'
const TO_ADDRESS = process.env.LEADS_TO_ADDRESS ?? 'johannes@getluckygolf.co.za'

type Lane = 'partner' | 'investor'

export async function POST(request: NextRequest) {
  try {
    const { email, lane, note, name, company } = (await request.json()) as {
      email?: string
      lane?: Lane
      note?: string
      name?: string
      company?: string
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (lane !== 'partner' && lane !== 'investor') {
      return NextResponse.json({ error: 'Invalid lane' }, { status: 400 })
    }

    const laneLabel = lane === 'investor' ? 'Investor / Ambassador' : 'Club / Sponsor'
    const subject = `New ${laneLabel} lead — ${email}`

    // Persist first so a lead is never lost if the email send fails.
    try {
      const supabase = createAdminClient()
      const { error: dbError } = await supabase.from('leads').insert({
        email,
        lane,
        name: name ?? null,
        company: company ?? null,
        note: note ?? null,
      })
      if (dbError) console.error('[leads] DB insert error:', dbError)
    } catch (dbErr) {
      console.error('[leads] DB unavailable:', dbErr)
    }

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject,
      text: [
        `Lane:    ${laneLabel}`,
        `Email:   ${email}`,
        name ? `Name:    ${name}` : null,
        company ? `Company: ${company}` : null,
        note ? `Note:    ${note}` : null,
        '',
        '— Get Lucky Golf landing page (/app)',
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      console.error('[leads] Resend error:', error)
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    console.log('[leads] Captured', lane, email, '— id:', data?.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[leads] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
