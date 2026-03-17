'use client'

import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'

export default function ResponsiblePlayPage() {
  const router = useRouter()

  return (
    <PhoneFrame statusTheme="dark">
      <div style={{ width: '100%', height: '100%', background: 'var(--cream-light)', overflowY: 'auto', padding: '60px var(--page-px) var(--space-2xl)' }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36, height: 36, background: '#f5f0e8', border: 'none',
            borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-lg)',
            cursor: 'pointer', color: 'var(--green-deep)', marginBottom: 'var(--space-md)',
          }}
        >
          ←
        </button>
        <h1 style={{ fontFamily: 'Poster Gothic, sans-serif', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--green-deep)', marginBottom: 'var(--space-sm)' }}>
          Responsible Play
        </h1>
        <div style={{ fontSize: 'var(--text-body)', color: 'var(--gray-mid)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 16 }}>
            Get Lucky Golf is a skill-based challenge, not a game of chance. However, we encourage all users to play responsibly.
          </p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>Our Commitment</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}>Only users aged 18+ may participate</li>
            <li style={{ marginBottom: 8 }}>All stakes and potential winnings are shown clearly before payment</li>
            <li style={{ marginBottom: 8 }}>There are no hidden fees or recurring charges</li>
            <li style={{ marginBottom: 8 }}>Each entry is a one-time payment for a single attempt</li>
          </ul>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>Tips for Players</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 8 }}>Set a personal budget for entries and stick to it</li>
            <li style={{ marginBottom: 8 }}>Play for fun — a hole-in-one is a rare achievement</li>
            <li style={{ marginBottom: 8 }}>Never stake more than you can comfortably afford to lose</li>
          </ul>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>Need Help?</h3>
          <p style={{ marginBottom: 16 }}>
            If you feel your participation is becoming problematic, contact us at support@getluckygolf.co.za and we can help restrict or close your account.
          </p>
        </div>
      </div>
    </PhoneFrame>
  )
}
