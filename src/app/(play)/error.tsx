'use client'

import { useEffect } from 'react'
import PhoneFrame from '@/components/layout/PhoneFrame'

export default function PlayError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[PlayError]', error)
  }, [error])

  return (
    <PhoneFrame statusTheme="light">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 32,
        background: 'linear-gradient(180deg, #1e3120 0%, #335231 100%)',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
        <h3 style={{
          fontFamily: "'Poster Gothic', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 12,
          textTransform: 'uppercase',
        }}>
          Something Went Wrong
        </h3>
        <p style={{
          fontSize: 14,
          opacity: 0.7,
          lineHeight: 1.5,
          marginBottom: 28,
          maxWidth: 280,
        }}>
          There was an error with your challenge. Your payment is safe — please try again or return home.
        </p>
        <button
          onClick={reset}
          style={{
            background: '#c9a84c',
            color: '#1e3120',
            border: 'none',
            borderRadius: 12,
            padding: '14px 32px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          Try Again
        </button>
        <a
          href="/home"
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Back to Home
        </a>
      </div>
    </PhoneFrame>
  )
}
