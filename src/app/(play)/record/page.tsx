'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet } from '@/context/BetContext'

const MAX_SECONDS = 120 // 2 minutes max

export default function RecordPage() {
  const router = useRouter()
  const { selectedCourse, selectedHole, setVideoBlob, betId } = useBet()
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [uploading, setUploading] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mimeTypeRef = useRef<string>('video/webm')

  const holeLabel = selectedHole
    ? `Hole ${selectedHole.holeNumber} · Par ${selectedHole.par} · ${selectedHole.distanceMetres}m`
    : 'Hole 7 · Par 3 · 142m'
  const courseName = selectedCourse?.name ?? 'Boschenmeer Golf Club'

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  // Start camera preview on mount
  useEffect(() => {
    let cancelled = false

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setCameraReady(true)
      } catch {
        setCameraError(true)
        setCameraReady(true) // Allow simulated recording
      }
    }

    initCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleRecordingComplete = useCallback(async (blob: Blob, mimeType: string) => {
    setUploading(true)

    try {
      const urlRes = await fetch('/api/videos/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betId: betId ?? 'mock', mimeType }),
      })
      const { signedUrl } = await urlRes.json()

      if (signedUrl) {
        await fetch(signedUrl, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': mimeType },
        })
      }
    } catch {
      // Non-critical — proceed
    }

    setUploading(false)
    setVideoBlob(blob)
    router.push('/confirm')
  }, [betId, setVideoBlob, router])

  function startRecording() {
    if (!streamRef.current) {
      // Simulated recording (no camera)
      setIsRecording(true)
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds(s => {
        if (s + 1 >= MAX_SECONDS) { stopRecordingRef.current() }
        return s + 1
      }), 1000)
      return
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : 'video/webm'

    mimeTypeRef.current = mimeType
    chunksRef.current = []

    const mr = new MediaRecorder(streamRef.current, { mimeType })
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current })
      streamRef.current?.getTracks().forEach(t => t.stop())
      handleRecordingComplete(blob, mimeTypeRef.current)
    }
    mr.start(100)
    mediaRecorderRef.current = mr
    setIsRecording(true)
    setSeconds(0)
    timerRef.current = setInterval(() => setSeconds(s => {
      if (s + 1 >= MAX_SECONDS) { stopRecordingRef.current() }
      return s + 1
    }), 1000)
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current)

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    } else {
      // Simulated: empty blob
      const blob = new Blob([], { type: 'video/webm' })
      setVideoBlob(blob)
      router.push('/confirm')
    }
    setIsRecording(false)
  }

  // Stable ref to avoid stale closure in timer
  const stopRecordingRef = useRef(stopRecording)
  useEffect(() => { stopRecordingRef.current = stopRecording })

  function handleCancel() {
    if (timerRef.current) clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    router.push('/choose-stake')
  }

  return (
    <PhoneFrame statusTheme="light" showStatus={false}>
      <div className="screen-record">
        {/* Live camera feed */}
        {!cameraError ? (
          <video
            ref={videoRef}
            muted
            playsInline
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', zIndex: 0,
            }}
          />
        ) : (
          <div className="record-course-bg" />
        )}

        <div className="record-viewfinder" />
        <div className="record-grid" />

        <button
          onClick={handleCancel}
          style={{
            position: 'absolute', top: 24, left: 24, zIndex: 10,
            width: 36, height: 36, background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: '50%', color: 'white',
            fontSize: 16, cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {cameraError && (
          <div style={{
            position: 'absolute', top: 24, right: 24, zIndex: 10, fontSize: 10,
            background: 'rgba(0,0,0,0.5)', color: '#ffd', padding: '4px 8px', borderRadius: 6,
          }}>
            SIMULATED
          </div>
        )}

        <div className="record-top-bar">
          <div className="record-live-badge">
            <div className="record-live-dot" style={{ opacity: isRecording ? 1 : 0 }} />
            {isRecording ? 'REC' : 'READY'}
          </div>
          <div className="record-timer">{formatTime(seconds)}</div>
        </div>

        <div className="record-challenge-info">
          <div className="record-hole-label">{holeLabel}</div>
          <div className="record-course-name">{courseName}</div>
        </div>

        <div className="record-controls">
          <button className="record-btn-secondary" style={{ opacity: 0.4 }}>🔄</button>
          <button
            className={`record-btn-main${isRecording ? ' recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!cameraReady || uploading}
          >
            {uploading ? (
              <div style={{
                width: 20, height: 20, border: '2px solid white',
                borderTopColor: 'transparent', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }} />
            ) : (
              <div className="record-btn-main-inner" />
            )}
          </button>
          <button className="record-btn-secondary" style={{ opacity: 0.4 }}>📸</button>
        </div>
      </div>
    </PhoneFrame>
  )
}
