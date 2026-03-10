'use client'

import { useState, useEffect } from 'react'

interface PhoneFrameProps {
  children: React.ReactNode
  statusTheme?: 'light' | 'dark'
  showStatus?: boolean
}

function useLiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    update()
    const id = setInterval(update, 10000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function PhoneFrame({ children, statusTheme = 'dark', showStatus = true }: PhoneFrameProps) {
  const time = useLiveClock()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0d0d',
        padding: '20px',
      }}
    >
      {/* Desktop: phone frame wrapper */}
      <div className="phone-frame-shell" style={{ position: 'relative' }}>
        <div className="phone-notch" />
        <div className="phone-screen">
          {showStatus && (
            <div className={`phone-status-bar ${statusTheme}`}>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time || '9:41'}</span>
              <div className="status-right">
                <span>⚡</span>
                <span>📶</span>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>

      {/* Mobile: full-screen override */}
      <style>{`
        @media (max-width: 430px) {
          .phone-frame-shell {
            width: 100vw !important;
            height: 100dvh !important;
            border-radius: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .phone-notch { display: none; }
          .phone-screen { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  )
}
