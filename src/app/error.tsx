'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050d07',
      color: 'white',
      textAlign: 'center',
      padding: 32,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>⛳</div>
      <h1 style={{
        fontFamily: "'Poster Gothic', sans-serif",
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 12,
        textTransform: 'uppercase',
      }}>
        Something Went Wrong
      </h1>
      <p style={{
        fontSize: 15,
        opacity: 0.6,
        lineHeight: 1.6,
        maxWidth: 320,
        marginBottom: 32,
      }}>
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <button
        onClick={reset}
        style={{
          background: '#c9a84c',
          color: '#1e3120',
          border: 'none',
          borderRadius: 12,
          padding: '14px 36px',
          fontSize: 16,
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
          fontSize: 14,
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        Back to Home
      </a>
    </div>
  )
}
