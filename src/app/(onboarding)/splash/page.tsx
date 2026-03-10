'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const onboardingSeen = localStorage.getItem('onboarding_seen')
      if (onboardingSeen) {
        router.push('/auth')
      } else {
        router.push('/onboarding')
      }
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <PhoneFrame statusTheme="light">
      <div className="screen-splash">
        <div className="splash-logo">
          Get Lucky
          <span>Golf Club</span>
        </div>
        <div className="splash-tagline">Every shot could change everything</div>
        <div className="splash-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </PhoneFrame>
  )
}
