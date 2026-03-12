'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet, BET_TIERS } from '@/context/BetContext'
import { useAuth } from '@/context/AuthContext'
import { useShareVideo } from '@/hooks/useShareVideo'

export default function TryAgainPage() {
  const router = useRouter()
  const { selectedTier, betId, resetSession, videoBlob } = useBet()
  const { profile } = useAuth()
  const [toast, setToast] = useState<string | null>(null)

  const {
    canShareFiles,
    canShareText,
    hasVideo,
    isSharing,
    shareWithVideo,
    shareTextOnly,
    downloadVideo,
  } = useShareVideo({
    videoBlob,
    title: 'My hole-in-one attempt on Get Lucky Golf!',
    text: 'I just took a hole-in-one challenge on Get Lucky Golf 🏌️‍♂️⛳ — next one is going in!',
  })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

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

  async function handleShareShot() {
    if (hasVideo && canShareFiles) {
      const ok = await shareWithVideo()
      if (ok) return
      // Video share failed at OS level — fall back to text
    }
    if (canShareText) {
      await shareTextOnly()
    } else if (hasVideo) {
      downloadVideo()
      showToast('Video saved! Share it from your gallery')
    } else {
      showToast('Sharing not supported on this browser')
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
          The ace is coming — it&apos;s just a matter of time. Keep backing yourself.
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
          <button className="btn-share" onClick={handleShareShot} disabled={isSharing}>
            {isSharing ? 'Sharing...' : hasVideo ? '📤 Share My Shot' : '📤 Share My Attempt'}
          </button>
          <button className="btn-share" onClick={handleHome}>
            🏠 Back to Home
          </button>
        </div>
      </div>

      {/* Toast (replaces alert) */}
      {toast && (
        <div className="toast gold" style={{ bottom: 40, zIndex: 200 }}>
          {toast}
        </div>
      )}
    </PhoneFrame>
  )
}
