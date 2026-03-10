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

export default function ChooseStakePage() {
  const router = useRouter()
  const { selectedCourse, selectedHole, selectTier, confirmPayment, setBetId } = useBet()
  const { user, profile } = useAuth()
  const [selected, setSelected]   = useState<BetTier>('tier_2')
  const [loading, setLoading]     = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')
  const [pfReady, setPfReady]     = useState(false)

  // Load PayFast Onsite engine once on mount
  useEffect(() => {
    if (document.getElementById('payfast-onsite-script')) {
      setPfReady(true)
      return
    }
    const script = document.createElement('script')
    script.id    = 'payfast-onsite-script'
    script.src   = PF_SCRIPT
    script.async = true
    script.onload = () => setPfReady(true)
    script.onerror = () => console.warn('[PayFast] Failed to load Onsite engine')
    document.head.appendChild(script)
  }, [])

  const selectedTierData = BET_TIERS.find(t => t.tier === selected)!
  const subtitle = selectedCourse
    ? `${selectedCourse.name} · Hole ${selectedHole?.holeNumber} · ${selectedHole?.distanceMetres}m`
    : 'Select your stake to play'

  async function handleConfirm() {
    setLoading(true)
    setErrorMsg('')
    selectTier(selected)

    try {
      // 1. Get PayFast Onsite UUID from our server
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

      // 2. Open PayFast Onsite modal and wait for result
      const paymentResult = await new Promise<boolean>((resolve) => {
        if (typeof window.payfast_do_onsite_payment === 'function') {
          window.payfast_do_onsite_payment({ uuid: pfData.uuid }, resolve)
        } else {
          // PayFast JS didn't load (e.g. network issue) — resolve true in dev only
          console.warn('[PayFast] Onsite engine not loaded; skipping modal in development')
          resolve(true)
        }
      })

      if (!paymentResult) {
        setErrorMsg('Payment was cancelled.')
        setLoading(false)
        return
      }

      // 3. Store payment reference in context
      confirmPayment(pfData.m_payment_id)

      // 4. Create the bet record in DB
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
      const bet = await betRes.json()
      setBetId(bet.betId ?? `bet_fallback_${Date.now()}`)

      setLoading(false)
      router.push('/record')
    } catch (err) {
      console.error('[PayFast] handleConfirm error:', err)
      setErrorMsg('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <PhoneFrame statusTheme="light">
      <div className="screen-bet">
        <div style={{ position: 'absolute', top: 60, left: 24, zIndex: 10 }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 36, height: 36, background: 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: 10, color: 'white', fontSize: 18, cursor: 'pointer',
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
              onClick={() => setSelected(tier.tier)}
            >
              {tier.isPopular && <div className="bet-popular-tag">Most Popular</div>}
              <div className="bet-stake">
                <div className="bet-stake-amount">£{tier.stakeGBP}</div>
                <div className="bet-stake-label">Stake</div>
              </div>
              <div className="bet-arrow">→</div>
              <div className="bet-multiplier">{tier.multiplier}×</div>
              <div className="bet-win">
                <div className="bet-win-label">Win</div>
                <div className="bet-win-amount">£{tier.winGBP.toLocaleString()}</div>
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
            disabled={loading}
            style={{ opacity: loading ? 0.8 : 1, position: 'relative' }}
          >
            {loading
              ? 'Opening payment...'
              : `Confirm £${selectedTierData.stakeGBP} Entry →`}
          </button>
          <div className="bet-disclaimer">🔒 Payments secured by PayFast · Fully insured</div>
        </div>
      </div>
    </PhoneFrame>
  )
}
