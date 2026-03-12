'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet } from '@/context/BetContext'

const MAX_SECONDS = 120 // 2 minutes max

export default function RecordPage() {
  const router = useRouter()
  const { selectedCourse, selectedHole, setVideoBlob, startBackgroundUpload } = useBet()
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [permissionState, setPermissionState] = useState<'checking' | 'prompt' | 'granted' | 'denied' | 'unsupported'>('checking')

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

  // Request camera access and attach stream
  const requestCamera = useCallback(async () => {
    setPermissionState('checking')
    setCameraError(false)

    // Check if getUserMedia is available at all
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState('unsupported')
      setCameraError(true)
      setCameraReady(true)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
      }
      setPermissionState('granted')
      setCameraReady(true)
    } catch (err: unknown) {
      const name = err instanceof DOMException ? err.name : ''
      if (name === 'NotAllowedError') {
        // User denied or dismissed the prompt — check if permanently denied
        try {
          const status = await navigator.permissions.query({ name: 'camera' as PermissionName })
          setPermissionState(status.state === 'denied' ? 'denied' : 'prompt')
        } catch {
          // permissions.query not supported — assume prompt can be retried
          setPermissionState('denied')
        }
      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        setPermissionState('unsupported')
      } else {
        setPermissionState('denied')
      }
      setCameraError(true)
      setCameraReady(true)
    }
  }, [])

  // Start camera preview on mount
  useEffect(() => {
    let cancelled = false

    async function init() {
      // Pre-check permission state if API is available
      try {
        const status = await navigator.permissions.query({ name: 'camera' as PermissionName })
        if (cancelled) return
        if (status.state === 'denied') {
          setPermissionState('denied')
          setCameraError(true)
          setCameraReady(true)
          return
        }
        // 'granted' or 'prompt' — proceed to request
      } catch {
        // permissions API not supported — just request directly
      }

      if (!cancelled) requestCamera()
    }

    init()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [requestCamera])

  const handleRecordingComplete = useCallback((blob: Blob, mimeType: string) => {
    setVideoBlob(blob)
    startBackgroundUpload(blob, mimeType) // runs in background — doesn't block
    router.push('/confirm')
  }, [setVideoBlob, startBackgroundUpload, router])

  function startRecording() {
    if (!streamRef.current) return // No camera — permission overlay handles this

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : 'video/webm'

    mimeTypeRef.current = mimeType
    chunksRef.current = []

    const mr = new MediaRecorder(streamRef.current, {
      mimeType,
      videoBitsPerSecond: 1_500_000, // 1.5 Mbps — ~22 MB for 2 min at 720p
    })
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current })
      streamRef.current?.getTracks().forEach(t => t.stop())
      handleRecordingComplete(blob, mimeTypeRef.current)
    }
    mr.start(1000) // 1s chunks — less overhead than 100ms
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
            position: 'absolute', top: 'var(--page-px)', left: 'var(--page-px)', zIndex: 10,
            width: 36, height: 36, background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: '50%', color: 'white',
            fontSize: 'var(--text-md)', cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {/* Camera permission overlay */}
        {cameraError && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)', padding: '0 32px', textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              fontSize: 28,
            }}>
              {permissionState === 'unsupported' ? '📵' : '📷'}
            </div>

            {permissionState === 'unsupported' ? (
              <>
                <div style={{ color: 'white', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>
                  Camera Not Available
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-body)', lineHeight: 1.5, marginBottom: 24 }}>
                  Your device does not have a camera or your browser doesn&apos;t support camera access.
                </div>
              </>
            ) : permissionState === 'denied' ? (
              <>
                <div style={{ color: 'white', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>
                  Camera Access Blocked
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-body)', lineHeight: 1.5, marginBottom: 24 }}>
                  Camera permission was denied. To record your shot, please enable camera access in your browser settings, then tap the button below.
                </div>
                <button
                  onClick={requestCamera}
                  style={{
                    background: 'var(--color-gold)', color: 'var(--color-green-dark)',
                    border: 'none', borderRadius: 12, padding: '14px 32px',
                    fontSize: 'var(--text-body)', fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                >
                  Try Again
                </button>
              </>
            ) : permissionState === 'prompt' ? (
              <>
                <div style={{ color: 'white', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>
                  Camera Access Required
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-body)', lineHeight: 1.5, marginBottom: 24 }}>
                  We need camera access to record your hole-in-one attempt. Tap below and allow camera access when prompted.
                </div>
                <button
                  onClick={requestCamera}
                  style={{
                    background: 'var(--color-gold)', color: 'var(--color-green-dark)',
                    border: 'none', borderRadius: 12, padding: '14px 32px',
                    fontSize: 'var(--text-body)', fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                >
                  Enable Camera
                </button>
              </>
            ) : (
              /* checking state */
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-body)' }}>
                Requesting camera access...
              </div>
            )}

            <button
              onClick={handleCancel}
              style={{
                marginTop: 16, background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)',
                cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Go Back
            </button>
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

        {/* Tap-to-record hint — shown only when idle and ready */}
        {!isRecording && cameraReady && (
          <div style={{
            position: 'absolute', bottom: 138, left: 0, right: 0,
            textAlign: 'center', zIndex: 10,
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(0,0,0,0.45)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 'var(--text-body)', fontWeight: 600,
              padding: '6px 18px', borderRadius: 20,
              letterSpacing: '0.02em',
            }}>
              Tap ● to start recording
            </div>
          </div>
        )}

        <div className="record-controls">
          <button
            className={`record-btn-main${isRecording ? ' recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!cameraReady || cameraError}
          >
            <div className="record-btn-main-inner" />
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
