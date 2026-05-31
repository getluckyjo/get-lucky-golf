import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Flag, MapPin } from 'lucide-react'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '/home'

const PROOF = [
  { icon: MapPin, label: '100+ SA courses' },
  { icon: Flag, label: 'R50 to R1 000 stakes' },
  { icon: ShieldCheck, label: 'FSP 3425 insured' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[#0f1d10]"
    >
      <Image
        src="/marketing/hero-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_45%] -z-10"
      />
      {/* Layered overlay — preserves photo richness while keeping copy legible */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#0f1d10]/95 via-[#1e3120]/55 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0f1d10] via-[#0f1d10]/30 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#c9a94e]/40 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 min-h-[100svh] flex flex-col justify-end pt-32 pb-16 md:pb-24">
        <div className="max-w-4xl mkt-hero-fade">
          <p className="inline-flex items-center gap-2 text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] text-[#e8d48b] mb-7 bg-white/8 border border-white/15 backdrop-blur-sm rounded-full px-3.5 py-1.5">
            <span className="relative flex w-1.5 h-1.5">
              <span aria-hidden className="absolute inset-0 rounded-full bg-[#c9a94e]/60 animate-ping" />
              <span aria-hidden className="relative rounded-full w-1.5 h-1.5 bg-[#c9a94e]" />
            </span>
            Insurance-backed · Built in Cape Town
          </p>
          <h1
            id="hero-heading"
            className="font-playfair text-[44px] sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[120px] text-white leading-[0.9] tracking-[-0.02em] uppercase"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.4)' }}
          >
            One shot.
            <br />
            <span className="text-[#c9a94e] [text-shadow:0_4px_30px_rgba(201,169,78,0.35)]">
              R1 Million.
            </span>
            <br />
            Back yourself.
          </h1>
          <p className="mt-7 md:mt-9 text-lg md:text-2xl text-white/90 max-w-2xl leading-[1.45] font-light">
            Pick any par-3. Stake from R50 to R1 000.
            Sink the ace, win up to R1 million. Fully insured. No catch.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href={APP_URL}
              className="group inline-flex items-center justify-center gap-2 bg-[#c9a94e] hover:bg-[#e8d48b] text-[#1e3120] px-9 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.04] shadow-[0_18px_40px_-12px_rgba(201,169,78,0.55)]"
            >
              Play Now
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-white/8 hover:bg-white/15 border border-white/30 hover:border-white/60 text-white px-9 py-4 rounded-full text-base font-bold transition-all backdrop-blur-md"
            >
              Partner with us
            </a>
          </div>

          {/* Proof strip */}
          <ul className="mt-10 md:mt-14 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/75">
            {PROOF.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#c9a94e]" aria-hidden strokeWidth={1.75} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Indwe sponsor strip */}
        <div className="mt-12 md:mt-16 flex items-center gap-4 text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-white/55">
          <span aria-hidden className="h-px flex-1 bg-white/15" />
          <span>Proudly sponsored by</span>
          <span className="font-semibold text-white/90 tracking-[0.18em]">INDWE Risk Services</span>
          <span className="font-mono text-[#c9a94e]/80 tracking-normal">FSP 3425</span>
          <span aria-hidden className="h-px flex-1 bg-white/15" />
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#how"
        aria-label="Scroll to how it works"
        className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-white/55 hover:text-white transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.22em]">Scroll</span>
        <span aria-hidden className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent mkt-scroll-line" />
      </a>
    </section>
  )
}
