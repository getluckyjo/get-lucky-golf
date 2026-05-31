import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import EmailCapture from './EmailCapture'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '/home'

export default function FinalCta() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative bg-[#1e3120] text-white overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[700px] h-[500px] bg-[#c9a94e]/8 rounded-full blur-[140px]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#335231]/30 rounded-full blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-32">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
            Three doors
          </p>
          <h2
            id="contact-heading"
            className="font-playfair text-4xl sm:text-6xl md:text-7xl text-white leading-[0.95] uppercase tracking-tight"
          >
            Pick yours.
          </h2>
          <p className="mt-5 text-white/75 text-lg leading-relaxed">
            Whether you&rsquo;re holding a 7-iron or a chequebook, there&rsquo;s a way in.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid gap-5 md:gap-6 md:grid-cols-[1.25fr_1fr_1fr]">
          {/* Golfers — hero card */}
          <article
            className="relative bg-gradient-to-br from-[#c9a94e] via-[#c9a94e] to-[#b6962f] text-[#1e3120] rounded-3xl p-7 md:p-10 flex flex-col overflow-hidden shadow-[0_30px_80px_-30px_rgba(201,169,78,0.6)]"
          >
            <div
              aria-hidden
              className="absolute -top-20 -right-16 w-72 h-72 bg-white/25 rounded-full blur-3xl"
            />
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1e3120]/70">
              For golfers
            </p>
            <h3 className="relative mt-4 font-playfair text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
              Back yourself.
            </h3>
            <p className="relative mt-5 flex-1 text-[#1e3120]/85 leading-relaxed md:text-lg max-w-md">
              Pick your stake. Pick your par-3. One swing for up to{' '}
              <strong>R1 million</strong>. Underwritten by Indwe. The whole journey
              lives in the app — three taps and you&rsquo;re playing.
            </p>
            <Link
              href={APP_URL}
              className="relative group mt-8 inline-flex items-center justify-center gap-2 bg-[#1e3120] hover:bg-[#0f1d10] text-[#c9a94e] px-7 py-3.5 rounded-full font-bold text-base transition-all hover:scale-[1.03] w-fit shadow-lg shadow-black/20"
            >
              Play Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </article>

          {/* Insurance & sponsors */}
          <article className="bg-white/[0.04] backdrop-blur-sm border border-white/12 rounded-3xl p-7 flex flex-col hover:border-[#c9a94e]/40 transition-colors">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a94e]">
              Insurance &amp; sponsors
            </p>
            <h3 className="mt-3 font-playfair text-2xl md:text-3xl text-white uppercase leading-tight tracking-tight">
              Let&rsquo;s talk.
            </h3>
            <p className="mt-3 flex-1 text-white/70 leading-relaxed text-[15px]">
              Underwrite a daily book. Or own the moment of the ace as a sponsor.
            </p>
            <div className="mt-6">
              <EmailCapture lane="partner" />
            </div>
          </article>

          {/* Investors and ambassadors */}
          <article className="bg-white/[0.04] backdrop-blur-sm border border-white/12 rounded-3xl p-7 flex flex-col hover:border-[#c9a94e]/40 transition-colors">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a94e]">
              Investors &amp; ambassadors
            </p>
            <h3 className="mt-3 font-playfair text-2xl md:text-3xl text-white uppercase leading-tight tracking-tight">
              Open a door.
            </h3>
            <p className="mt-3 flex-1 text-white/70 leading-relaxed text-[15px]">
              Equity-aligned roles for capital partners and global golf figures.
            </p>
            <div className="mt-6">
              <EmailCapture lane="investor" />
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
