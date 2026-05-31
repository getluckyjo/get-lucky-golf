'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AdminError]', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: 32,
      background: '#f7f7f8',
      fontFamily: "'Inter', system-ui, sans-serif",
      textAlign: 'center',
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        marginBottom: 20,
      }}>
        ⚠️
      </div>
      <h2 style={{
        fontSize: 22,
        fontWeight: 700,
        color: '#1a1a1a',
        marginBottom: 8,
      }}>
        Dashboard Error
      </h2>
      <p style={{
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 1.6,
        maxWidth: 360,
        marginBottom: 24,
      }}>
        Something went wrong loading this section. Please try again or navigate to another page.
      </p>
      <button
        onClick={reset}
        style={{
          background: '#335231',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          padding: '12px 28px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  )
}
