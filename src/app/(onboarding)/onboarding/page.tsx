'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'

const slides = [
  {
    step: 'Step 1 of 3',
    emoji: '⛳',
    title: 'Bet on Yourself.\nWin Big.',
    text: 'Stake as little as £5 on your hole-in-one shot. Land it, and walk away with up to £50,000. Every par-3 is your chance.',
    cta: 'Next →',
  },
  {
    step: 'Step 2 of 3',
    emoji: '📱',
    title: 'Scan, Swing,\nWin.',
    text: 'Select your course, choose your stake, and record your shot with your phone. Simple, fast, frictionless.',
    cta: 'Next →',
  },
  {
    step: 'Step 3 of 3',
    emoji: '🛡️',
    title: 'Fully Insured.\nAlways Verified.',
    text: 'Every prize is fully insured. Video verification and official documentation ensure every win is real and every payout is guaranteed.',
    cta: 'Get Started',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)

  function handleCta() {
    if (current < slides.length - 1) {
      setCurrent(current + 1)
    } else {
      localStorage.setItem('onboarding_seen', 'true')
      router.push('/auth')
    }
  }

  function handleSkip() {
    localStorage.setItem('onboarding_seen', 'true')
    router.push('/auth')
  }

  const slide = slides[current]

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-onboard">
        <div className="onboard-hero">
          <div className="onboard-illustration">{slide.emoji}</div>
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              zIndex: 10,
            }}
          >
            <button
              onClick={handleSkip}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Skip
            </button>
          </div>
        </div>
        <div className="onboard-body">
          <div className="onboard-step">{slide.step}</div>
          <h3 className="onboard-title" style={{ whiteSpace: 'pre-line' }}>
            {slide.title}
          </h3>
          <p className="onboard-text">{slide.text}</p>
          <div className="onboard-dots" style={{ marginTop: 20 }}>
            {slides.map((_, i) => (
              <span
                key={i}
                className={i === current ? 'active' : ''}
                onClick={() => setCurrent(i)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          <button className="btn-primary" onClick={handleCta}>
            {slide.cta}
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
