'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet } from '@/context/BetContext'
import { createClient } from '@/lib/supabase/client'
import { useShareVideo } from '@/hooks/useShareVideo'

interface UploadStep {
  id: string
  title: string
  desc: string
  done: boolean
  storagePath?: string
}

export default function ClaimPage() {
  const router = useRouter()
  const { betId, resetSession, videoBlob } = useBet()
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
    title: 'HOLE-IN-ONE on Get Lucky Golf!',
    text: 'I just hit a HOLE-IN-ONE on Get Lucky Golf! ⛳🏆 Watch the shot!',
  })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handleShare() {
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

  const [steps, setSteps] = useState<UploadStep[]>([
    { id: 'video', title: 'Shot Video', desc: 'Your recording has been uploaded', done: true },
    { id: 'certificate', title: 'Course Certificate', desc: 'Official hole-in-one certificate from the club', done: false },
    { id: 'affidavit', title: '4-Ball Affidavit', desc: 'Signed declaration from your playing partners', done: false },
  ])
  const [loading, setLoading] = useState(false)

  async function handleUpload(stepId: string) {
    return new Promise<void>(resolve => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*,application/pdf'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) { resolve(); return }

        let storagePath: string | undefined

        // Attempt Supabase Storage upload
        try {
          const supabase = createClient()
          const path = `${betId ?? 'mock'}/${stepId}/${file.name}`
          const { data } = await supabase.storage
            .from('verification-docs')
            .upload(path, file, { upsert: true })
          storagePath = data?.path
        } catch {
          // Storage not configured — continue without upload
        }

        setSteps(prev =>
          prev.map(s => s.id === stepId ? { ...s, done: true, storagePath } : s)
        )
        resolve()
      }
      input.oncancel = () => resolve()
      input.click()
    })
  }

  const allDone = steps.every(s => s.done)

  async function handleSubmit() {
    if (!allDone) return
    setLoading(true)

    const certificateStep = steps.find(s => s.id === 'certificate')
    const affidavitStep = steps.find(s => s.id === 'affidavit')

    await fetch(`/api/verifications/${betId ?? 'mock'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        certificatePath: certificateStep?.storagePath ?? null,
        affidavitPath: affidavitStep?.storagePath ?? null,
      }),
    }).catch(() => {})

    setLoading(false)
    router.push('/verify')
  }

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-upload">
        <div className="signup-header" style={{ padding: 'var(--space-md) var(--page-px) 0' }}>
          <button className="back-btn" onClick={() => router.back()}>←</button>
        </div>
        <div className="upload-celebration">
          <div className="upload-trophy">🏆</div>
          <div className="upload-congrats">Incredible Shot!</div>
          <div className="upload-info">
            Upload your verification documents to claim your prize. All documents are reviewed within 24 hours.
          </div>
        </div>
        <div className="upload-steps">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`upload-step${step.done ? ' done' : ''}`}
              onClick={() => !step.done && handleUpload(step.id)}
              style={{ cursor: step.done ? 'default' : 'pointer' }}
            >
              <div className="upload-step-num">{step.done ? '✓' : i + 1}</div>
              <div className="upload-step-text">
                <h5>{step.title}</h5>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="upload-dropzone"
          onClick={() => {
            const nextPending = steps.find(s => !s.done)
            if (nextPending) handleUpload(nextPending.id)
          }}
        >
          <div className="upload-dropzone-icon">📁</div>
          <div className="upload-dropzone-text">
            {allDone ? 'All documents uploaded ✓' : 'Tap to upload next document'}
          </div>
          <div className="upload-dropzone-sub">Photo, scan, or PDF — any format accepted</div>
        </div>
        <div className="upload-footer">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!allDone || loading}
            style={{ opacity: !allDone || loading ? 0.5 : 1 }}
          >
            {loading ? 'Submitting...' : 'Submit Claim →'}
          </button>

          <button
            className="btn-share"
            onClick={handleShare}
            disabled={isSharing}
            style={{ marginTop: 10 }}
          >
            {isSharing ? 'Sharing...' : '📤 Share My Hole-in-One!'}
          </button>

          {/* Escape hatch — user can return to home and submit docs later */}
          <button
            onClick={() => { resetSession(); router.push('/home') }}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
              fontSize: 'var(--text-body)', marginTop: 'var(--space-sm)', cursor: 'pointer', padding: '8px 0',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            I&apos;ll upload documents later
          </button>
          <div style={{
            fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)',
            marginTop: 4, textAlign: 'center',
          }}>
            You have 7 days to submit from the date of your shot
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast gold" style={{ bottom: 40, zIndex: 200 }}>
          {toast}
        </div>
      )}
    </PhoneFrame>
  )
}
