import {
  Smartphone,
  Video,
  MapPin,
  ShieldCheck,
  FileCheck2,
  Trophy,
  CircleDollarSign,
  Wifi,
  Signal,
  BatteryMedium,
} from 'lucide-react'
import { CheckCircle2 } from 'lucide-react'

type IconType = 'target' | 'phone' | 'shield'

const SLIDES: { step: string; icon: IconType; title: string; text: string; cta: string }[] = [
  {
    step: 'Step 1 of 3',
    icon: 'target',
    title: 'Your Hole-in-One\nCould Pay R1M.',
    text: 'Pick any par-3 at 100+ South African courses. Stake from R50 to R1 000 — land the shot, win up to R1 million.',
    cta: 'Next',
  },
  {
    step: 'Step 2 of 3',
    icon: 'phone',
    title: 'Film It.\nSwing It.\nWin It.',
    text: 'Choose your course, select your stake, and hit record before you swing. Three taps and you’re playing for the big prize.',
    cta: 'Next',
  },
  {
    step: 'Step 3 of 3',
    icon: 'shield',
    title: 'Every Prize\nFully Insured.',
    text: 'Prizes underwritten by Indwe Risk Services (FSP 3425). Payments secured by PayFast. Your win is guaranteed.',
    cta: 'Get Started',
  },
]

function GolferSwing({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="rgba(255,255,255,0.95)"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M106.8,44.9c-10.3,0-18.7,8.2-18.7,18.4c0,10.2,8.3,18.4,18.7,18.4c10.3,0,18.6-8.2,18.6-18.4C125.4,53.1,117,44.9,106.8,44.9z" />
      <path d="M201.3,81.2c-0.7-4-3.9-6.2-4.1-6.4L87.6,2.7L77.5,17.4c-1.9,2.9-1.1,6.8,1.8,8.7c2.9,1.9,6.8,1.1,8.7-1.8l5.9-8.5l88.9,58.7L110,87.6c-5.2,0.9-8.9,6-7.7,11.1l15.8,61.3l-51.3,76.9c-3.1,5.2-1.2,12,4.1,15c5.4,3,12.1,1.2,15.2-4.1c0,0,53.5-80.4,53.7-81c0,0,2.8,11.2,2.8,11.2l-8,60.3c-1,6,3.1,11.6,9.1,12.6c6.1,1,11.8-3,12.8-9l8.3-62.1c0.3-1.6-0.1-5.1-0.4-6.6l-18.3-72.7l47.6-8.6C198.7,91.2,202.2,86.3,201.3,81.2z" />
    </svg>
  )
}

function IconCluster({ type }: { type: IconType }) {
  const main = 'text-white/95'
  const sub = 'text-white/45'
  return (
    <div className="relative w-32 h-32 grid place-items-center">
      <span aria-hidden className="absolute inset-0 rounded-full border border-white/15" />
      <span aria-hidden className="absolute inset-3 rounded-full border border-white/10" />
      {type === 'target' && (
        <>
          <GolferSwing size={48} />
          <CircleDollarSign className={`absolute top-2 left-2 w-5 h-5 ${sub}`} aria-hidden />
          <Trophy className={`absolute bottom-2 right-2 w-5 h-5 ${sub}`} aria-hidden />
        </>
      )}
      {type === 'phone' && (
        <>
          <Smartphone className={`w-12 h-12 ${main}`} aria-hidden strokeWidth={1.5} />
          <Video className={`absolute top-2 right-2 w-5 h-5 ${sub}`} aria-hidden />
          <MapPin className={`absolute bottom-2 left-2 w-5 h-5 ${sub}`} aria-hidden />
        </>
      )}
      {type === 'shield' && (
        <>
          <ShieldCheck className={`w-12 h-12 ${main}`} aria-hidden strokeWidth={1.5} />
          <FileCheck2 className={`absolute top-2 left-2 w-5 h-5 ${sub}`} aria-hidden />
          <Trophy className={`absolute bottom-2 right-2 w-5 h-5 ${sub}`} aria-hidden />
        </>
      )}
    </div>
  )
}

function Slide({
  slide,
  index,
}: {
  slide: (typeof SLIDES)[number]
  index: number
}) {
  // Each slide is positioned absolute and gets animated in via the parent CSS.
  return (
    <div
      className="absolute inset-0 flex flex-col bg-[#f5f0e1] mkt-slide"
      style={{ animationDelay: `${index * 4}s` }}
      aria-hidden={index !== 0}
    >
      {/* Status bar */}
      <div className="h-10 flex items-center justify-between px-5 text-white text-[10px] font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <Signal className="w-3 h-3" aria-hidden />
          <Wifi className="w-3 h-3" aria-hidden />
          <BatteryMedium className="w-4 h-4" aria-hidden />
        </div>
      </div>

      {/* Green hero with icons */}
      <div className="relative h-[44%] bg-gradient-to-b from-[#335231] to-[#1e3120] flex items-center justify-center">
        <IconCluster type={slide.icon} />
        <span className="absolute top-3 right-4 text-[10px] uppercase tracking-widest text-white/70 bg-white/15 px-3 py-1 rounded-full">
          Skip
        </span>
      </div>

      {/* Card */}
      <div className="flex-1 -mt-4 bg-[#f5f0e1] rounded-t-3xl px-5 pt-5 pb-4 flex flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#335231] mb-2">
          {slide.step}
        </p>
        <h3 className="font-playfair text-2xl text-[#1e3120] uppercase leading-[1.05] whitespace-pre-line">
          {slide.title}
        </h3>
        <p className="mt-3 text-[12.5px] text-[#1e3120]/75 leading-relaxed">{slide.text}</p>

        <div className="mt-auto pt-4">
          <div className="flex justify-center gap-2 mb-3" aria-hidden>
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-[#335231]' : 'w-1.5 bg-[#1e3120]/15'
                }`}
              />
            ))}
          </div>
          <div className="bg-[#335231] text-white text-center font-semibold text-sm py-3 rounded-xl">
            {slide.cta}
          </div>
        </div>
      </div>
    </div>
  )
}

const PRODUCT_BULLETS = [
  'Pick your stake — R50 to R1 000.',
  'GPS detection at 100+ SA par-3s.',
  'Hit record. One swing. Three taps.',
  'We verify within 24 hours.',
  'Insured payout — underwritten by Indwe (FSP 3425).',
]

export default function AppWalkthrough() {
  return (
    <section
      id="walkthrough"
      aria-labelledby="walkthrough-heading"
      className="relative bg-[#1e3120] text-white overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c9a94e]/8 rounded-full blur-[120px] pointer-events-none"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Phone */}
        <div className="relative mx-auto md:mx-0 md:justify-self-end">
          <div
            aria-hidden
            className="absolute -inset-10 bg-gradient-to-br from-[#c9a94e]/15 via-transparent to-[#335231]/25 blur-3xl rounded-full"
          />
          <div className="relative w-[290px] md:w-[320px] aspect-[9/19.5] rounded-[44px] bg-[#0a0a0a] p-2 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]">
            <div
              aria-hidden
              className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#0a0a0a] rounded-b-2xl z-10"
            />
            <div className="relative w-full h-full overflow-hidden rounded-[36px] bg-[#f5f0e1] mkt-slide-stack">
              {SLIDES.map((s, i) => (
                <Slide key={i} slide={s} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
            The product
          </p>
          <h2
            id="walkthrough-heading"
            className="font-playfair text-3xl sm:text-5xl text-white leading-[1.05] uppercase tracking-tight"
          >
            Your R1 million swing,
            <br />
            in your pocket.
          </h2>
          <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-lg">
            Three taps and you&rsquo;re playing for the big prize. No QR code at the tee.
            No board to install. No paperwork. Just the app, a par-3, and one swing.
          </p>
          <ul className="mt-7 space-y-3.5">
            {PRODUCT_BULLETS.map((b) => (
              <li key={b} className="flex gap-3 text-white/85">
                <CheckCircle2 className="w-5 h-5 text-[#c9a94e] shrink-0 mt-0.5" aria-hidden />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
