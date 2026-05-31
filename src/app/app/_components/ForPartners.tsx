import { Shield, Megaphone, Globe2 } from 'lucide-react'

const TILES = [
  {
    icon: Shield,
    tag: 'Insurance partners',
    title: 'A daily book, not an event book.',
    body: 'Predictable unit economics. Daily premium volume. Mature actuarial data. Underwrite a category that has only ever existed one event at a time.',
  },
  {
    icon: Megaphone,
    tag: 'Brand sponsors',
    title: 'Own the moment of the ace.',
    body: 'Every winning shot is a branded social moment. Pre-rolled video. Geo-tagged venue. Verified beneficiary. Native reach without a paid campaign.',
  },
  {
    icon: Globe2,
    tag: 'Ambassadors & scaling partners',
    title: 'Equity-aligned. Globally minded.',
    body: 'For golf figures and operators who can open doors in the UK, the US, the Middle East, Asia. We build the rails. You bring the credibility.',
  },
]

export default function ForPartners() {
  return (
    <section id="partners" aria-labelledby="partners-heading" className="bg-[#f5f0e1]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
            For partners, sponsors &amp; ambassadors
          </p>
          <h2
            id="partners-heading"
            className="font-playfair text-3xl sm:text-5xl text-[#1e3120] leading-[1.05] uppercase tracking-tight"
          >
            Three ways in.
          </h2>
        </div>
        <div className="mt-12 md:mt-16 grid gap-5 md:gap-6 md:grid-cols-3">
          {TILES.map(({ icon: Icon, tag, title, body }) => (
            <article
              key={tag}
              className="bg-white border border-[#1e3120]/8 rounded-2xl p-7 flex flex-col gap-4 transition-colors hover:border-[#c9a94e]/40"
            >
              <span className="bg-[#335231]/10 text-[#335231] w-12 h-12 rounded-full grid place-items-center">
                <Icon className="w-6 h-6" aria-hidden />
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a94e]">{tag}</p>
              <h3 className="font-playfair text-2xl text-[#1e3120] uppercase leading-tight">
                {title}
              </h3>
              <p className="text-[#1e3120]/70 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
