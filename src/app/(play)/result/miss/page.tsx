'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet, BET_TIERS } from '@/context/BetContext'
import { useAuth } from '@/context/AuthContext'

export default function TryAgainPage() {
  const router = useRouter()
  const { selectedTier, betId, resetSession } = useBet()
  const { profile } = useAuth()

  useEffect(() => {
    if (!betId || betId.startsWith('bet_mock') || betId.startsWith('bet_fallback')) return
    fetch(`/api/bets/${betId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'miss', declared_result: 'miss' }),
    }).catch(() => {})
  }, [betId])

  function handlePlayAgain() {
    resetSession()
    router.push('/select-course')
  }

  function handleShareShot() {
    if (navigator.share) {
      navigator.share({
        title: 'My hole-in-one attempt on Get Lucky Golf!',
        text: 'Watch my shot from the Get Lucky Golf app 🏌️‍♂️⛳',
      }).catch(() => {})
    } else {
      alert('Share not available on this device')
    }
  }

  function handleHome() {
    resetSession()
    router.push('/home')
  }

  const tierData = BET_TIERS.find(t => t.tier === selectedTier) ?? BET_TIERS[1]
  const stakeLabel = `R${tierData.stakeZAR.toLocaleString('en-ZA')}`

  const totalAttempts = profile?.total_attempts ?? 0

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-tryagain">
        <div className="tryagain-illustration">🏌️‍♂️</div>
        <h3 className="tryagain-title">Great Swing!</h3>
        <p className="tryagain-text">
          The ace is coming — it's just a matter of time. Your AI shot trace is ready to share.
        </p>
        <div className="tryagain-stats">
          <div className="tryagain-stat">
            <div className="tryagain-stat-value">{totalAttempts || '—'}</div>
            <div className="tryagain-stat-label">Total Attempts</div>
          </div>
          <div className="tryagain-stat">
            <div className="tryagain-stat-value">⛳</div>
            <div className="tryagain-stat-label">Keep Going</div>
          </div>
          <div className="tryagain-stat">
            <div className="tryagain-stat-value">🎯</div>
            <div className="tryagain-stat-label">Stay Focused</div>
          </div>
        </div>
        <div className="tryagain-actions">
          <button className="btn-primary" onClick={handlePlayAgain}>
            Play Again — {stakeLabel} →
          </button>
          <button className="btn-share" onClick={handleShareShot}>
            📤 Share Shot Video
          </button>
          <button className="btn-share" onClick={handleHome}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
