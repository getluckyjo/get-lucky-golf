'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import {
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
    title: 'Your Hole-in-One\nCould Pay R1M.',
    text: 'Pick any par-3 at 100+ South African courses. Stake from R50 to R1 000 — land the shot, win up to R1 million.',
    cta: 'Next',
  },
  {
    step: 'Step 2 of 3',
    icon: 'phone' as const,
    title: 'Film It.\nSwing It.\nWin It.',
    text: 'Choose your course, select your stake, and hit record before you swing. Three taps and you\'re playing for the big prize.',
    cta: 'Next',
  },
  {
    step: 'Step 3 of 3',
    icon: 'shield' as const,
    title: 'Every Prize\nFully Insured.',
    text: 'Prizes underwritten by Indwe Risk Services (FSP 3425). Payments secured by PayFast. Your win is guaranteed.',
    cta: 'Get Started',
  },
]

/* ── Icon compositions ── */
const mainIcon = { stroke: 'rgba(255,255,255,0.95)', strokeWidth: 1.5 }
const subIcon = { stroke: 'rgba(255,255,255,0.45)', strokeWidth: 1.2 }

function GolferSwing({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="rgba(255,255,255,0.95)" xmlns="http://www.w3.org/2000/svg">
      <path d="M106.8,44.9c-10.3,0-18.7,8.2-18.7,18.4c0,10.2,8.3,18.4,18.7,18.4c10.3,0,18.6-8.2,18.6-18.4C125.4,53.1,117,44.9,106.8,44.9z"/>
      <path d="M201.3,81.2c-0.7-4-3.9-6.2-4.1-6.4L87.6,2.7L77.5,17.4c-1.9,2.9-1.1,6.8,1.8,8.7c2.9,1.9,6.8,1.1,8.7-1.8l5.9-8.5l88.9,58.7L110,87.6c-5.2,0.9-8.9,6-7.7,11.1l15.8,61.3l-51.3,76.9c-3.1,5.2-1.2,12,4.1,15c5.4,3,12.1,1.2,15.2-4.1c0,0,53.5-80.4,53.7-81c0,0,2.8,11.2,2.8,11.2l-8,60.3c-1,6,3.1,11.6,9.1,12.6c6.1,1,11.8-3,12.8-9l8.3-62.1c0.3-1.6-0.1-5.1-0.4-6.6l-18.3-72.7l47.6-8.6C198.7,91.2,202.2,86.3,201.3,81.2z"/>
    </svg>
  )
}

function SlideIllustration({ type }: { type: 'target' | 'phone' | 'shield' }) {
  if (type === 'target') {
    return (
      <div className="onboard-icon-group">
        <GolferSwing size={52} />
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
          <SlideIllustration type={slide.icon} />
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
