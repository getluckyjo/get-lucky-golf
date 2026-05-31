import Link from 'next/link'
import Image from 'next/image'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '/home'

export default function Footer() {
  return (
    <footer className="relative bg-[#0f1d10] text-white/70 overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a94e]/40 to-transparent"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-16 md:pt-24 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="" width={44} height={44} />
              <span className="font-playfair text-xl text-white uppercase tracking-tight">
                Get Lucky Golf
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-white/65">
              One shot. R1 million. Back yourself on any par-3. Built in Cape Town.
              Designed to scale globally.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45">
              <span className="w-1 h-1 rounded-full bg-[#c9a94e]" aria-hidden />
              Underwritten by Indwe Risk Services · FSP 3425
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-4">Challenge</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={APP_URL} className="hover:text-white transition-colors">Open the app</Link></li>
              <li><a href="#how" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#courses" className="hover:text-white transition-colors">Where to play</a></li>
              <li><Link href="/responsible-play" className="hover:text-white transition-colors">Responsible play</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-4">Partners</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#opportunity" className="hover:text-white transition-colors">The opportunity</a></li>
              <li><a href="#partners" className="hover:text-white transition-colors">Why partner</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Get in touch</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Oversized brand watermark line */}
        <div className="mt-16 md:mt-24 relative" aria-hidden>
          <p className="font-playfair text-[14vw] md:text-[12vw] leading-[0.85] uppercase tracking-[-0.02em] text-white/[0.06] select-none whitespace-nowrap overflow-hidden">
            Back yourself.
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-xs leading-relaxed text-white/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Get Lucky Golf. All rights reserved.</p>
          <p className="max-w-xl md:text-right">
            Prize insurance underwritten via Indwe Risk Services (FSP 3425).
          </p>
        </div>
      </div>
    </footer>
  )
}
