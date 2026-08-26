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
  const [waiting, setWaiting] = useState(false)
  const didRun = useRef(false)

  // Polls /api/bets/create until PayFast's ITN has landed. Total wait is capped;
  // beyond that the payment is real but unconfirmed, which is an ops problem, not
  // something the player can fix by waiting longer.
  async function createBetWhenPaymentConfirms(
    payload: { courseId: string; holeId: string; tier: string; m_payment_id: string },
  ): Promise<{ betId: string }> {
    const delaysMs = [0, 1500, 2500, 4000, 6000, 8000, 10000]

    for (let attempt = 0; attempt < delaysMs.length; attempt++) {
      if (delaysMs[attempt]) await new Promise(r => setTimeout(r, delaysMs[attempt]))

      const res = await fetch('/api/bets/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: payload.courseId,
          holeId:   payload.holeId,
          tier:     payload.tier,
          paymentIntentId: payload.m_payment_id,
        }),
      })

      if (res.ok) return res.json()

      const err = await res.json().catch(() => ({ error: 'Unknown error' }))

      if (res.status === 202 && err.code === 'PAYMENT_PENDING') {
        setWaiting(true)
        continue
      }

      console.error('[PaymentReturn] Bet creation failed:', err)
      throw new Error(err.error ?? 'Could not register your bet. Please contact support.')
    }

    throw new Error(
      'Your payment went through, but we could not confirm it in time. ' +
      'Nothing is lost — please contact support with reference ' + payload.m_payment_id + '.',
    )
  }

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

        // ── 3. Create the bet, once the payment is confirmed ────────────────
        // The server only grants a bet after PayFast's ITN has verified the
        // payment. That notification frequently arrives after the browser gets
        // back here, so a 202 PAYMENT_PENDING is normal — poll rather than fail.
        const bet = await createBetWhenPaymentConfirms({ courseId, holeId, tier, m_payment_id })
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
        background: 'linear-gradient(180deg, #1e3120 0%, #335231 100%)',
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
              {waiting ? 'Confirming Your Payment' : 'Setting Up Your Bet'}
            </h3>
            <p style={{
              fontSize: 14,
              opacity: 0.7,
              lineHeight: 1.5,
            }}>
              {waiting
                ? 'Waiting for confirmation from PayFast. This usually takes a few seconds — please don\u2019t close this page.'
                : 'Payment confirmed. Preparing your challenge...'}
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
