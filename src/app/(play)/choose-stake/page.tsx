'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet, BET_TIERS, BetTier } from '@/context/BetContext'

export default function ChooseStakePage() {
  const router = useRouter()
  const { selectedCourse, selectedHole, selectTier, confirmPayment, setBetId } = useBet()
  const [selected, setSelected] = useState<BetTier>('tier_2')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const selectedTierData = BET_TIERS.find(t => t.tier === selected)!
  const subtitle = selectedCourse
    ? `${selectedCourse.name} · Hole ${selectedHole?.holeNumber} · ${selectedHole?.distanceMetres}m`
    : 'Select your stake to play'

  async function handleConfirm() {
    setLoading(true)
    setErrorMsg('')
    selectTier(selected)

    try {
      // 1. Simulate payment
      const paymentRes = await fetch('/api/payments/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedTierData.stakeGBP * 100,
          currency: 'gbp',
          tier: selected,
        }),
      })
      const payment = await paymentRes.json()

      if (!paymentRes.ok || !payment.id) {
        throw new Error('Payment failed')
      }

      confirmPayment(payment.id)

      // 2. Create bet record
      const betRes = await fetch('/api/bets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse?.id,
          holeId: selectedHole?.id,
          tier: selected,
          paymentIntentId: payment.id,
        }),
      })
      const bet = await betRes.json()
      setBetId(bet.betId ?? `bet_fallback_${Date.now()}`)

      setLoading(false)
      router.push('/record')
    } catch (err) {
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
              ? 'Processing...'
              : `Confirm £${selectedTierData.stakeGBP} Entry →`}
          </button>
          <div className="bet-disclaimer">🛡️ All prizes fully insured · Skill-based competition</div>
        </div>
      </div>
    </PhoneFrame>
  )
}
