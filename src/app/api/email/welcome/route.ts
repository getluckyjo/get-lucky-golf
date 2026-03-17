import { resend } from '@/lib/resend'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? 'Get Lucky Golf <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const firstName = name?.split(' ')[0] ?? 'Golfer'

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Welcome to Get Lucky Golf! ⛳',
      html: buildWelcomeHtml(firstName),
    })

    if (error) {
      console.error('[welcome-email] Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    console.log('[welcome-email] Sent to', email, '— id:', data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('[welcome-email] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildWelcomeHtml(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Get Lucky Golf</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'DM Sans',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#007728;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#c9a84c;font-size:28px;font-weight:700;letter-spacing:0.5px;font-family:'DM Sans',system-ui,sans-serif;">
                Get Lucky Golf
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;font-family:'DM Sans',system-ui,sans-serif;">
                Where amateur golfers win like the pros
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 4px;color:#007728;font-size:22px;font-family:'DM Sans',system-ui,sans-serif;font-weight:700;">
                Welcome to Get Lucky Golf, ${firstName}.
              </h2>
              <p style="margin:0 0 20px;color:#007728;font-size:18px;font-weight:600;font-family:'DM Sans',system-ui,sans-serif;">
                You're officially in.
              </p>
              <p style="margin:0 0 16px;color:#2a2a2a;font-size:16px;line-height:1.6;font-family:'DM Sans',system-ui,sans-serif;">
                Which means the next time you step onto a par-3 tee box, your swing could be worth up to <strong style="color:#007728;">R1,000,000</strong>.
              </p>
              <p style="margin:0 0 28px;color:#2a2a2a;font-size:16px;line-height:1.6;font-family:'DM Sans',system-ui,sans-serif;">
                That's what Get Lucky is all about &ndash; turning an ordinary round of golf into a moment you'll never forget.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#c9a84c;border-radius:8px;padding:14px 32px;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://get-lucky-golf.vercel.app'}/home"
                       style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;display:inline-block;font-family:'DM Sans',system-ui,sans-serif;">
                      Start Playing
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Tiers -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;border-top:1px solid #e8e8e8;padding-top:24px;">
                <tr>
                  <td style="color:#666;font-size:14px;padding-bottom:12px;font-family:'DM Sans',system-ui,sans-serif;">
                    <strong style="color:#007728;">Entry tiers:</strong>
                  </td>
                </tr>
                <tr>
                  <td style="color:#2a2a2a;font-size:14px;line-height:2;font-family:'DM Sans',system-ui,sans-serif;">
                    R50 &rarr; Win R25,000<br/>
                    R100 &rarr; Win R60,000 <span style="color:#c9a84c;font-weight:600;font-size:12px;">MOST POPULAR</span><br/>
                    R250 &rarr; Win R200,000<br/>
                    R500 &rarr; Win R500,000<br/>
                    R1,000 &rarr; Win R1,000,000
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f5f0e8;padding:24px 40px;text-align:center;border-top:1px solid #e8e8e8;">
              <p style="margin:0;color:#999;font-size:12px;line-height:1.6;font-family:'DM Sans',system-ui,sans-serif;">
                Get Lucky Golf Club &mdash; Play smart, get lucky.<br/>
                You're receiving this because you signed up at Get Lucky Golf.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
