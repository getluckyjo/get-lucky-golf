'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet } from '@/context/BetContext'

export default function ConfirmPage() {
  const router = useRouter()
  const { videoBlob, betId, declareResult } = useBet()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [analysing, setAnalysing] = useState(true)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (videoBlob && videoBlob.size > 0) {
      const url = URL.createObjectURL(videoBlob)
      setVideoUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [videoBlob])

  // Run mock AI verification
  useEffect(() => {
    async function runVerification() {
      try {
        await fetch('/api/videos/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ betId: betId ?? 'mock', storagePath: null }),
        })
      } catch {
        // Non-critical
      }
      setAnalysing(false)
    }
    runVerification()
  }, [betId])

  function handleHoleInOne() {
    declareResult('hole_in_one')
    router.push('/result/claim')
  }

  function handleMiss() {
    declareResult('miss')
    router.push('/result/miss')
  }

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-confirm">
        <div className="signup-header" style={{ padding: '16px 24px 0' }}>
          <button className="back-btn" onClick={() => router.back()}>←</button>
        </div>
        <div className="confirm-video">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="confirm-play-btn">▶</div>
          )}
          <div className="confirm-ai-badge">
            {analysing
              ? '🤖 AI Analysing...'
              : '✅ Analysis Complete'
            }
          </div>
        </div>
        <div className="confirm-question">
          <h3 className="confirm-title">Did it go in?</h3>
          <p className="confirm-desc">
            Watch the replay and confirm your result. Be honest — full verification follows for claimed hole-in-ones.
          </p>
        </div>
        <div className="confirm-buttons">
          <button
            className="btn-hole-in-one"
            onClick={handleHoleInOne}
            disabled={analysing}
            style={{ opacity: analysing ? 0.6 : 1 }}
          >
            🏆 YES — Hole-in-One!
          </button>
          <button className="btn-no-luck" onClick={handleMiss}>
            Not this time
          </button>
        </div>
        <div className="confirm-footer-text">
          Your honest declaration is the first step. Camera footage, course certificate, and 4-ball affidavit required to claim.
        </div>
      </div>
    </PhoneFrame>
  )
}
