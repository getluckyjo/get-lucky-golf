'use client'

import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'

export default function NotFound() {
  const router = useRouter()

  return (
    <PhoneFrame statusTheme="dark">
      <div style={{
        width: '100%', height: '100%', background: 'var(--cream-light)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 var(--page-px)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 64, marginBottom: 'var(--space-md)' }}>⛳</div>
        <div style={{
          fontFamily: 'Poster Gothic, sans-serif', fontSize: 'var(--text-2xl)',
          fontWeight: 900, color: 'var(--green-deep)', marginBottom: 'var(--space-xs)',
          textTransform: 'uppercase',
        }}>
          Out of Bounds
        </div>
        <div style={{
          fontSize: 'var(--text-body)', color: 'var(--gray-light)',
          marginBottom: 'var(--space-xl)', lineHeight: 1.5,
        }}>
          This page doesn't exist. Let's get you back on the fairway.
        </div>
        <button
          className="btn-gold"
          onClick={() => router.push('/home')}
          style={{
            padding: 'clamp(14px, 3.5vw, 18px) clamp(28px, 7vw, 40px)',
            fontSize: 'var(--text-md)', fontWeight: 700,
            borderRadius: 'var(--radius-md)',
          }}
        >
          Back to Home
        </button>
      </div>
    </PhoneFrame>
  )
}
