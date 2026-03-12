'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet } from '@/context/BetContext'
import type { Course, Hole, BetTier } from '@/context/BetContext'

interface PendingPayment {
  m_payment_id: string
  tier: BetTier
  courseId: string
  holeId: string
  course: Course
  hole: Hole
}

export default function PaymentReturnPage() {
  const router = useRouter()
  const { selectCourse, selectTier, confirmPayment, setBetId } = useBet()
  const [status, setStatus] = useState<'processing' | 'error'>('processing')
  const [errorMsg, setErrorMsg] = useState('')
  const didRun = useRef(false)

  useEffect(() => {
    // Prevent double-execution in React strict mode
    if (didRun.current) return
    didRun.current = true

    async function processReturn() {
      try {
        // ── 1. Read saved session from localStorage ─────────────────────────
        const pendingStr = localStorage.getItem('pf_pending')
        if (!pendingStr) {
          setErrorMsg('No pending payment found. You may have already completed this payment.')
          setStatus('error')
          return
        }

        const pending: PendingPayment = JSON.parse(pendingStr)
        const { m_payment_id, tier, courseId, holeId, course, hole } = pending

        // ── 2. Restore BetContext state (lost during redirect) ──────────────
        selectCourse(course, hole)
        selectTier(tier)
        confirmPayment(m_payment_id)

        // ── 3. Create bet record in database ────────────────────────────────
        const betRes = await fetch('/api/bets/create', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            holeId,
            tier,
            paymentIntentId: m_payment_id,
          }),
        })

        if (!betRes.ok) {
          const betErr = await betRes.json().catch(() => ({ error: 'Unknown error' }))
          console.error('[PaymentReturn] Bet creation failed:', betErr)
          throw new Error(betErr.error ?? 'Could not register your bet. Please contact support.')
        }

        const bet = await betRes.json()
        setBetId(bet.betId)

        // ── 4. Clean up and redirect to record page ─────────────────────────
        localStorage.removeItem('pf_pending')
        router.replace('/record')

      } catch (err) {
        console.error('[PaymentReturn] Error:', err)
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        setErrorMsg(msg)
        setStatus('error')
      }
    }

    processReturn()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PhoneFrame statusTheme="light">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 32,
        background: 'linear-gradient(180deg, #003314 0%, #005a20 100%)',
        color: 'white',
        textAlign: 'center',
      }}>
        {status === 'processing' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#d4af37',
              animation: 'spin 0.8s linear infinite',
              marginBottom: 24,
            }} />
            <h3 style={{
              fontFamily: "'Poster Gothic', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 8,
            }}>
              Setting Up Your Bet
            </h3>
            <p style={{
              fontSize: 14,
              opacity: 0.7,
              lineHeight: 1.5,
            }}>
              Payment confirmed. Preparing your challenge...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>!</div>
            <h3 style={{
              fontFamily: "'Poster Gothic', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 12,
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
              {errorMsg}
            </p>
            <button
              className="btn-gold"
              onClick={() => router.push('/choose-stake')}
              style={{ width: 'auto', padding: '14px 32px' }}
            >
              Try Again
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PhoneFrame>
  )
}
