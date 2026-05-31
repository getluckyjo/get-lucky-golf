import { TrendingUp, Smartphone, Banknote } from 'lucide-react'

const BEATS = [
  {
    icon: TrendingUp,
    title: 'Golfers want more',
    body: 'Global golf is up 3 million players year-on-year. Non-traditional formats now exceed traditional play. The hunger is here.',
  },
  {
    icon: Smartphone,
    title: 'The tech is here',
    body: 'GPS, instant verification, insurance APIs, digital wallets. Real-time stake-to-win is now possible for the first time.',
  },
  {
    icon: Banknote,
    title: 'The category is doubling',
    body: 'Prize indemnity hits $2.4B by 2033. The market is coming either way. The question is who owns the consumer layer.',
  },
]

export default function WhyNow() {
  return (
    <section
      id="why-now"
      aria-labelledby="why-now-heading"
      className="bg-[#e8e0cc]"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
            Why now
          </p>
          <h2
            id="why-now-heading"
            className="font-playfair text-3xl sm:text-5xl text-[#1e3120] leading-[1.05] uppercase tracking-tight"
          >
            Three forces. One window.
          </h2>
        </div>
        <div className="mt-12 md:mt-16 grid gap-5 md:grid-cols-3">
          {BEATS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white border border-[#1e3120]/8 rounded-2xl p-7 transition-colors hover:border-[#c9a94e]/40"
            >
              <span className="bg-[#c9a94e]/15 text-[#c9a94e] w-12 h-12 rounded-full grid place-items-center mb-5">
                <Icon className="w-6 h-6" aria-hidden />
              </span>
              <h3 className="font-playfair text-2xl text-[#1e3120] uppercase leading-tight">
                {title}
              </h3>
              <p className="mt-3 text-[#1e3120]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
