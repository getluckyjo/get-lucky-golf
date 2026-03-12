'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet, BET_TIERS, BetTier } from '@/context/BetContext'
import { useAuth } from '@/context/AuthContext'

type LoadingStep = 'idle' | 'opening'

export default function ChooseStakePage() {
  const router = useRouter()
  const { selectedCourse, selectedHole, selectTier } = useBet()
  const { user, profile } = useAuth()
  const [selected, setSelected]     = useState<BetTier>('tier_2')
  const [step, setStep]             = useState<LoadingStep>('idle')
  const [errorMsg, setErrorMsg]     = useState('')

  const loading = step !== 'idle'

  // Guard: if no course selected, send back to select-course
  useEffect(() => {
    if (!selectedCourse || !selectedHole) {
      router.replace('/select-course')
    }
  }, [selectedCourse, selectedHole, router])

  const subtitle = selectedCourse
    ? `${selectedCourse.name} · Hole ${selectedHole?.holeNumber} · ${selectedHole?.distanceMetres}m`
    : 'Select your stake to play'

  async function handleConfirm(tier: BetTier) {
    setSelected(tier)
    setStep('opening')
    setErrorMsg('')
    selectTier(tier)

    try {
      // ── 1. Get signed form fields from our server ─────────────────────────
      const pfRes = await fetch('/api/payments/payfast', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          userName: profile?.name ?? user?.user_metadata?.full_name ?? '',
        }),
      })
      const pfData = await pfRes.json()

      if (!pfRes.ok || !pfData?.redirectUrl || !pfData?.formFields) {
        throw new Error(pfData?.error ?? 'Failed to initialise payment')
      }

      // ── 2. Save session data to localStorage (survives redirect) ──────────
      // When the user returns from PayFast, the React context is gone.
      // The payment-return page reads this to create the bet + restore context.
      localStorage.setItem('pf_pending', JSON.stringify({
        m_payment_id: pfData.m_payment_id,
        tier,
        courseId:      selectedCourse?.id,
        holeId:       selectedHole?.id,
        course:       selectedCourse,
        hole:         selectedHole,
      }))

      // ── 3. Build hidden form and submit → redirect to PayFast ─────────────
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = pfData.redirectUrl

      for (const [key, value] of Object.entries(pfData.formFields)) {
        const input = document.createElement('input')
        input.type  = 'hidden'
        input.name  = key
        input.value = String(value)
        form.appendChild(input)
      }

      document.body.appendChild(form)
      form.submit() // User leaves the app → PayFast hosted checkout

    } catch (err: unknown) {
      console.error('[PayFast] handleConfirm error:', err)
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setErrorMsg(msg)
      setStep('idle')
    }
  }

  return (
    <PhoneFrame statusTheme="light">
      <div className="screen-bet">
        <div style={{ position: 'absolute', top: 60, left: 'var(--page-px)', zIndex: 10 }}>
          <button
            onClick={() => !loading && router.back()}
            disabled={loading}
            style={{
              width: 36, height: 36, background: 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: 'var(--text-lg)',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
            }}
          >
            ←
          </button>
        </div>
        <div className="bet-header" style={{ paddingTop: 60 }}>
          <h3 className="bet-title">Back Yourself</h3>
          <p className="bet-subtitle">{subtitle}</p>
        </div>
        <div className="bet-options">
          {BET_TIERS.map(tier => (
            <div
              key={tier.tier}
              className={`bet-card${selected === tier.tier ? ' selected' : ''}${tier.isPopular ? ' popular' : ''}`}
              onClick={() => !loading && handleConfirm(tier.tier)}
              style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}
            >
              {tier.isPopular && <div className="bet-popular-tag">Most Popular</div>}
              <div className="bet-stake">
                <div className="bet-stake-amount">R{tier.stakeZAR.toLocaleString('en-ZA')}</div>
                <div className="bet-stake-label">Stake</div>
              </div>
              <div className="bet-arrow">→</div>
              <div className="bet-multiplier">{tier.multiplier}×</div>
              <div className="bet-win">
                <div className="bet-win-label">Win</div>
                <div className="bet-win-amount">{tier.winZAR >= 1_000_000 ? 'R1 Mil' : tier.winZAR >= 1_000 ? `R${Math.round(tier.winZAR / 1000)}K` : `R${tier.winZAR}`}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bet-footer">
          {errorMsg && (
            <div style={{ fontSize: 'var(--text-sm)', color: '#ff6b6b', marginBottom: 'var(--space-xs)', textAlign: 'center' }}>
              Payment failed. Tap a stake to try again.
            </div>
          )}
          {loading && (
            <button
              className="btn-gold"
              disabled
              style={{ opacity: 0.8 }}
            >
              Redirecting to payment...
            </button>
          )}
          <div className="bet-disclaimer">Payments secured by PayFast · Fully insured</div>
        </div>
      </div>
    </PhoneFrame>
  )
}
