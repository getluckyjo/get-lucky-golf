'use client'

import { Play, Pause, Maximize, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string | null
  poster?: string
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  if (!src) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '9/16',
          maxHeight: 480,
          background: '#f0f0f0',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 14,
        }}
      >
        No video available
      </div>
    )
  }

  const toggle = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  const restart = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setPlaying(true)
  }

  const fullscreen = () => {
    videoRef.current?.requestFullscreen?.()
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#000',
          aspectRatio: '9/16',
          maxHeight: 480,
          cursor: 'pointer',
        }}
        onClick={toggle}
      >
        <video
          ref={videoRef}
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onEnded={() => setPlaying(false)}
          playsInline
        />
        {!playing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={24} color="#00432a" style={{ marginLeft: 3 }} />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={toggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #e5e5e5',
            background: '#fff',
            fontSize: 13,
            cursor: 'pointer',
            color: '#333',
          }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={restart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #e5e5e5',
            background: '#fff',
            fontSize: 13,
            cursor: 'pointer',
            color: '#333',
          }}
        >
          <RotateCcw size={14} />
          Replay
        </button>
        <button
          onClick={fullscreen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #e5e5e5',
            background: '#fff',
            fontSize: 13,
            cursor: 'pointer',
            color: '#333',
            marginLeft: 'auto',
          }}
        >
          <Maximize size={14} />
          Fullscreen
        </button>
      </div>
    </div>
  )
}
