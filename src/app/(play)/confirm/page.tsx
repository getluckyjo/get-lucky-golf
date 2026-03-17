'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet } from '@/context/BetContext'

export default function ConfirmPage() {
  const router = useRouter()
  const { videoBlob, betId, declareResult, uploadStatus, uploadProgress } = useBet()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [analysing, setAnalysing] = useState(true)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const hasVideo = !!(videoBlob && videoBlob.size > 0)

  // Guard: require a recorded video to reach this page
  useEffect(() => {
    if (!hasVideo) {
      router.replace('/home')
    }
  }, [hasVideo, router])

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

  if (!hasVideo) return null

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-confirm">
        <div className="signup-header" style={{ padding: 'var(--space-md) var(--page-px) 0' }}>
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
          {uploadStatus === 'uploading' && (
            <div style={{
              position: 'absolute', top: 12, left: 12, zIndex: 5,
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              padding: '6px 14px', borderRadius: 20,
              color: 'white', fontSize: 12, fontWeight: 600,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#d4af37',
                animation: 'spin 0.8s linear infinite',
              }} />
              Saving video… {uploadProgress}%
            </div>
          )}
          {uploadStatus === 'error' && (
            <div style={{
              position: 'absolute', top: 12, left: 12, zIndex: 5,
              background: 'rgba(180,60,60,0.7)', backdropFilter: 'blur(8px)',
              padding: '6px 14px', borderRadius: 20,
              color: 'white', fontSize: 12, fontWeight: 600,
            }}>
              ⚠ Video save failed
            </div>
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
