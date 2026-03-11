'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet, BET_TIERS, BetTier } from '@/context/BetContext'
import { useAuth } from '@/context/AuthContext'

// Tell TypeScript about PayFast's globally-injected function
declare global {
  interface Window {
    payfast_do_onsite_payment: (
      data: { uuid: string },
      callback?: (result: boolean) => void
    ) => void
  }
}

const SANDBOX = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX !== 'false'
const PF_SCRIPT = SANDBOX
  ? 'https://sandbox.payfast.co.za/onsite/engine.js'
  : 'https://www.payfast.co.za/onsite/engine.js'

type LoadingStep = 'idle' | 'opening' | 'confirming' | 'creating'

const LOADING_LABELS: Record<LoadingStep, string> = {
  idle:       '',
  opening:    'Opening payment...',
  confirming: 'Confirming payment...',
  creating:   'Setting up your bet...',
}

export default function ChooseStakePage() {
  const router = useRouter()
  const { selectedCourse, selectedHole, selectTier, confirmPayment, setBetId } = useBet()
  const { user, profile } = useAuth()
  const [selected, setSelected]     = useState<BetTier>('tier_2')
  const [step, setStep]             = useState<LoadingStep>('idle')
  const [errorMsg, setErrorMsg]     = useState('')
  const [pfReady, setPfReady]       = useState(false)

  const loading = step !== 'idle'

  // Guard: if no course selected, send back to select-course
  useEffect(() => {
    if (!selectedCourse || !selectedHole) {
      router.replace('/select-course')
    }
  }, [selectedCourse, selectedHole, router])

  // Load PayFast Onsite engine once on mount
  useEffect(() => {
    if (document.getElementById('payfast-onsite-script')) {
      setPfReady(true)
      return
    }
    const script     = document.createElement('script')
    script.id        = 'payfast-onsite-script'
    script.src       = PF_SCRIPT
    script.async     = true
    script.onload    = () => setPfReady(true)
    script.onerror   = () => console.warn('[PayFast] Failed to load Onsite engine')
    document.head.appendChild(script)
  }, [])

  const selectedTierData = BET_TIERS.find(t => t.tier === selected)!
  const subtitle = selectedCourse
    ? `${selectedCourse.name} · Hole ${selectedHole?.holeNumber} · ${selectedHole?.distanceMetres}m`
    : 'Select your stake to play'

  async function handleConfirm() {
    setStep('opening')
    setErrorMsg('')
    selectTier(selected)

    try {
      // ── 1. Get PayFast Onsite UUID from our server ──────────────────────────
      const pfRes = await fetch('/api/payments/payfast', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier:      selected,
          userEmail: user?.email ?? '',
          userName:  profile?.name ?? user?.user_metadata?.full_name ?? '',
        }),
      })
      const pfData = await pfRes.json()

      if (!pfRes.ok || !pfData.uuid) {
        throw new Error(pfData.error ?? 'Failed to initialise payment')
      }

      // ── 2. Open PayFast Onsite modal ────────────────────────────────────────
      const paymentResult = await new Promise<boolean>((resolve) => {
        if (typeof window.payfast_do_onsite_payment === 'function') {
          window.payfast_do_onsite_payment({ uuid: pfData.uuid }, resolve)
        } else {
          // PayFast JS didn't load — only bypass in non-production
          if (SANDBOX) {
            console.warn('[PayFast] Onsite engine not loaded; bypassing in sandbox/dev')
            resolve(true)
          } else {
            console.error('[PayFast] Onsite engine failed to load in production')
            resolve(false)
          }
        }
      })

      if (!paymentResult) {
        setErrorMsg('Payment was cancelled.')
        setStep('idle')
        return
      }

      setStep('confirming')

      // ── 3. Store payment reference in context ───────────────────────────────
      confirmPayment(pfData.m_payment_id)

      setStep('creating')

      // ── 4. Create the bet record in DB ──────────────────────────────────────
      const betRes = await fetch('/api/bets/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId:        selectedCourse?.id,
          holeId:          selectedHole?.id,
          tier:            selected,
          paymentIntentId: pfData.m_payment_id,
        }),
      })

      if (!betRes.ok) {
        const betErr = await betRes.json().catch(() => ({ error: 'Unknown error' }))
        console.error('[bets/create] Failed:', betErr)
        throw new Error(betErr.error ?? 'Could not register your bet. Please contact support.')
      }

      const bet = await betRes.json()
      setBetId(bet.betId)

      setStep('idle')
      router.push('/record')
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
        <div style={{ position: 'absolute', top: 60, left: 24, zIndex: 10 }}>
          <button
            onClick={() => !loading && router.back()}
            disabled={loading}
            style={{
              width: 36, height: 36, background: 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: 10, color: 'white', fontSize: 18,
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
              onClick={() => !loading && setSelected(tier.tier)}
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
                <div className="bet-win-amount">R{tier.winZAR.toLocaleString('en-ZA')}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bet-footer">
          {errorMsg && (
            <div style={{ fontSize: 12, color: '#ff6b6b', marginBottom: 8, textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}
          <button
            className="btn-gold"
            onClick={handleConfirm}
            disabled={loading || !pfReady}
            style={{ opacity: (loading || !pfReady) ? 0.8 : 1, position: 'relative' }}
          >
            {loading
              ? LOADING_LABELS[step]
              : !pfReady
                ? 'Loading...'
                : `Confirm R${selectedTierData.stakeZAR.toLocaleString('en-ZA')} Entry →`}
          </button>
          <div className="bet-disclaimer">🔒 Payments secured by PayFast · Fully insured</div>
        </div>
      </div>
    </PhoneFrame>
  )
}
