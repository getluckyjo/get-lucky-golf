'use client'

import { useState, useCallback, useMemo } from 'react'

interface ShareVideoOptions {
  videoBlob: Blob | null
  title: string
  text: string
  url?: string
}

export function useShareVideo(options: ShareVideoOptions) {
  const { videoBlob, title, text, url = 'https://get-lucky-golf.vercel.app' } = options
  const [isSharing, setIsSharing] = useState(false)

  const hasVideo = Boolean(videoBlob && videoBlob.size > 0)

  const fileExtension = useMemo(() => {
    const type = videoBlob?.type ?? ''
    if (type.includes('mp4')) return 'mp4'
    return 'webm'
  }, [videoBlob?.type])

  const canShareFiles = useMemo(() => {
    if (typeof navigator === 'undefined') return false
    if (!navigator.share || !navigator.canShare) return false
    if (!videoBlob) return false
    try {
      const testFile = new File([videoBlob], `shot.${fileExtension}`, {
        type: videoBlob.type || 'video/webm',
      })
      return navigator.canShare({ files: [testFile] })
    } catch {
      return false
    }
  }, [videoBlob, fileExtension])

  const canShareText = typeof navigator !== 'undefined' && Boolean(navigator.share)

  const shareWithVideo = useCallback(async () => {
    if (!videoBlob || !canShareFiles) return
    setIsSharing(true)
    try {
      const file = new File(
        [videoBlob],
        `get-lucky-shot.${fileExtension}`,
        { type: videoBlob.type || 'video/webm' }
      )
      await navigator.share({ title, text, url, files: [file] })
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.warn('[share] Share failed:', err)
      }
    } finally {
      setIsSharing(false)
    }
  }, [videoBlob, canShareFiles, fileExtension, title, text, url])

  const shareTextOnly = useCallback(async () => {
    if (!canShareText) return
    setIsSharing(true)
    try {
      await navigator.share({ title, text, url })
    } catch {
      // AbortError = user cancelled
    } finally {
      setIsSharing(false)
    }
  }, [canShareText, title, text, url])

  const downloadVideo = useCallback(() => {
    if (!videoBlob) return
    const blobUrl = URL.createObjectURL(videoBlob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `get-lucky-shot.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000)
  }, [videoBlob, fileExtension])

  return {
    canShareFiles,
    canShareText,
    hasVideo,
    isSharing,
    shareWithVideo,
    shareTextOnly,
    downloadVideo,
  }
}
