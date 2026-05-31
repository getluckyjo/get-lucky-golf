import { ShieldCheck, Lock, Trophy } from 'lucide-react'

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Underwritten',
    body: 'Every swing is underwritten by Indwe Risk Services. When you sink the ace, the insurer pays — not us.',
  },
  {
    icon: Lock,
    title: 'Authorised',
    body: 'Indwe is an Authorised Financial Services Provider, FSP 3425. Over 100 years of insurance heritage.',
  },
  {
    icon: Trophy,
    title: 'Guaranteed',
    body: 'Prizes from R25 000 to R1 million, paid out on every verified hole-in-one. No fine print.',
  },
]

export default function Traction() {
  return (
    <section
      id="traction"
      aria-labelledby="traction-heading"
      className="bg-[#e8e0cc]"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
              Backed by Indwe
            </p>
            <h2
              id="traction-heading"
              className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[#1e3120] leading-[1.02] uppercase tracking-tight"
            >
              Real prizes.
              <br />
              <span className="text-[#c9a94e]">Real payouts.</span>
            </h2>
            <p className="mt-6 text-[#1e3120]/75 text-lg leading-relaxed">
              Not a promotion. A promise. Every swing is underwritten before you tee off —
              so when you sink the ace, the insurer pays you out, no friction.
            </p>
          </div>

          {/* Indwe trust card */}
          <div className="relative bg-white rounded-3xl p-7 md:p-10 shadow-[0_30px_80px_-30px_rgba(30,49,32,0.25)] border border-[#1e3120]/8 overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-48 h-48 bg-[#c9a94e]/10 rounded-full blur-2xl"
            />
            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#c9a94e] font-semibold mb-2">
                  Headline sponsor
                </p>
                <p
                  className="font-playfair text-3xl md:text-4xl text-[#0072B8] tracking-tight leading-none"
                  style={{ letterSpacing: '0.02em' }}
                >
                  INDWE
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#1e3120]/60 font-semibold">
                  Risk Services
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-[#1e3120]/50 uppercase tracking-[0.18em]">
                  Authorised FSP
                </p>
                <p className="font-mono text-base text-[#1e3120]/90 mt-1">3425</p>
              </div>
            </div>

            <div className="relative mt-7 grid grid-cols-3 gap-4 md:gap-6 border-t border-[#1e3120]/10 pt-6">
              <div>
                <p className="font-playfair text-2xl md:text-3xl text-[#1e3120] leading-none">100+</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#1e3120]/55">
                  years in insurance
                </p>
              </div>
              <div className="border-x border-[#1e3120]/10 px-3 md:px-4">
                <p className="font-playfair text-2xl md:text-3xl text-[#1e3120] leading-none">R1M</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#1e3120]/55">
                  max prize underwritten
                </p>
              </div>
              <div>
                <p className="font-playfair text-2xl md:text-3xl text-[#1e3120] leading-none">24h</p>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-[#1e3120]/55">
                  verification window
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-14 md:mt-20 grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white/60 border border-[#1e3120]/8 rounded-2xl p-6 backdrop-blur-sm"
            >
              <span className="bg-[#335231]/10 text-[#335231] w-10 h-10 rounded-full grid place-items-center mb-4">
                <Icon className="w-5 h-5" aria-hidden />
              </span>
              <h3 className="font-bold text-[#1e3120]">{title}</h3>
              <p className="mt-2 text-sm text-[#1e3120]/65 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
