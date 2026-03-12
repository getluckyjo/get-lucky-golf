'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import {
  Target,
  Smartphone,
  Video,
  MapPin,
  ShieldCheck,
  FileCheck2,
  Trophy,
  CircleDollarSign,
} from 'lucide-react'

/* ── Slide data ── */
const slides = [
  {
    step: 'Step 1 of 3',
    icon: 'target' as const,
    title: 'Bet on Yourself.\nWin Big.',
    text: 'Stake as little as R50 on your hole-in-one shot. Land it, and walk away with up to R1 million. Every par-3 is your chance.',
    cta: 'Next',
  },
  {
    step: 'Step 2 of 3',
    icon: 'phone' as const,
    title: 'Record, Swing\n& Win.',
    text: 'Select your course, choose your stake, and record your shot with your phone. Simple, fast, frictionless.',
    cta: 'Next',
  },
  {
    step: 'Step 3 of 3',
    icon: 'shield' as const,
    title: 'Fully Insured.\nAlways Verified.',
    text: 'Every prize is fully insured. Video verification and official documentation ensure every win is real and every payout is guaranteed.',
    cta: 'Get Started',
  },
]

/* ── Icon compositions ── */
const mainIcon = { stroke: 'rgba(255,255,255,0.95)', strokeWidth: 1.5 }
const subIcon = { stroke: 'rgba(255,255,255,0.45)', strokeWidth: 1.2 }

function SlideIllustration({ type }: { type: 'target' | 'phone' | 'shield' }) {
  if (type === 'target') {
    return (
      <div className="onboard-icon-group">
        <Target size={52} {...mainIcon} />
        <span className="orbit orbit-tl"><CircleDollarSign size={20} {...subIcon} /></span>
        <span className="orbit orbit-br"><Trophy size={18} {...subIcon} /></span>
      </div>
    )
  }
  if (type === 'phone') {
    return (
      <div className="onboard-icon-group">
        <Smartphone size={52} {...mainIcon} />
        <span className="orbit orbit-tr"><Video size={20} {...subIcon} /></span>
        <span className="orbit orbit-bl"><MapPin size={18} {...subIcon} /></span>
      </div>
    )
  }
  return (
    <div className="onboard-icon-group">
      <ShieldCheck size={52} {...mainIcon} />
      <span className="orbit orbit-tl"><FileCheck2 size={20} {...subIcon} /></span>
      <span className="orbit orbit-br"><Trophy size={18} {...subIcon} /></span>
    </div>
  )
}

/* ── Swipe hook ── */
function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef(0)
  const startY = useRef(0)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current
      const dy = e.changedTouches[0].clientY - startY.current
      // Only trigger if horizontal swipe is dominant and > 50px
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) onLeft()
        else onRight()
      }
    },
    [onLeft, onRight],
  )

  return { onTouchStart, onTouchEnd }
}

/* ── Page ── */
export default function OnboardingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')

  function goNext() {
    if (current < slides.length - 1) {
      setSlideDir('left')
      setCurrent(current + 1)
    } else {
      finish()
    }
  }

  function goPrev() {
    if (current > 0) {
      setSlideDir('right')
      setCurrent(current - 1)
    }
  }

  function finish() {
    localStorage.setItem('onboarding_seen', 'true')
    router.push('/auth')
  }

  const swipe = useSwipe(goNext, goPrev)
  const slide = slides[current]

  return (
    <PhoneFrame statusTheme="light">
      <div className="screen-onboard" {...swipe}>
        {/* Hero section */}
        <div className="onboard-hero">
          {current === 0 ? (
            <img
              src="/logo.svg"
              alt="Get Lucky Golf Club"
              className="onboard-hero-logo"
            />
          ) : (
            <SlideIllustration type={slide.icon} />
          )}
          <button className="onboard-skip" onClick={finish}>
            Skip
          </button>
        </div>

        {/* Content card */}
        <div className="onboard-body" key={current} data-dir={slideDir}>
          <div className="onboard-step">{slide.step}</div>
          <h3 className="onboard-title" style={{ whiteSpace: 'pre-line' }}>
            {slide.title}
          </h3>
          <p className="onboard-text">{slide.text}</p>

          <div className="onboard-footer">
            <div className="onboard-dots">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={i === current ? 'active' : ''}
                  onClick={() => {
                    setSlideDir(i > current ? 'left' : 'right')
                    setCurrent(i)
                  }}
                />
              ))}
            </div>
            <button className="btn-primary" onClick={goNext}>
              {slide.cta}
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
