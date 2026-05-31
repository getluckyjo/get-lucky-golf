const STATS = [
  { n: '108M', label: 'Global golfers',         sub: 'R&A 2024, ex-USA/Mexico — +3M YoY' },
  { n: '~150M', label: 'Worldwide incl. USA',   sub: 'NGF: 45M in the US alone' },
  { n: '38,000+', label: 'Golf courses',        sub: 'across 206 countries' },
  { n: '1 / 12,500', label: 'Amateur ace odds', sub: 'priced for stake-to-win' },
]

export default function Opportunity() {
  return (
    <section
      id="opportunity"
      aria-labelledby="opportunity-heading"
      className="relative bg-[#f5f0e1] overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[#c9a94e]/10 rounded-full blur-[140px] pointer-events-none"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-32">
        {/* Hero number — Apple/Stripe-style oversize stat */}
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-4">
            The global opportunity
          </p>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-end">
            <div>
              <h2
                id="opportunity-heading"
                className="font-playfair text-4xl sm:text-6xl md:text-7xl text-[#1e3120] leading-[0.98] uppercase tracking-tight"
              >
                A <span className="text-[#c9a94e]">$2.4 billion</span> category.
                <br />
                Currently offline.
              </h2>
            </div>
            <p className="text-[#1e3120]/75 text-base md:text-lg leading-relaxed md:pb-2">
              Hole-in-one insurance is one of the biggest segments of prize indemnity —{' '}
              <strong className="text-[#1e3120]">$1.2B today, $2.4B by 2033</strong> (8.1% CAGR).
              Today it sells through brokers, one event at a time. We&rsquo;re putting it in every
              golfer&rsquo;s pocket — a daily, insured swing on any par-3 in SA.
            </p>
          </div>
        </div>

        {/* Hero stat — the headline number */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center border-t border-[#1e3120]/10 pt-12 md:pt-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
              Global golfers
            </p>
            <p className="font-playfair text-[88px] sm:text-[140px] md:text-[180px] text-[#1e3120] leading-[0.85] tracking-[-0.04em]">
              108M
            </p>
            <p className="mt-3 text-[#1e3120]/55 text-sm">
              R&amp;A 2024, ex-USA/Mexico. Up 3 million year-on-year.
            </p>
          </div>
          <div className="md:border-l md:border-[#1e3120]/10 md:pl-10">
            <p className="text-[#1e3120]/75 leading-relaxed">
              Add 45M American on-course + off-course golfers and the global pool nears{' '}
              <strong className="text-[#1e3120]">150 million</strong>. Across{' '}
              <strong className="text-[#1e3120]">38 000 courses</strong> in 206 countries.
              Most of them have a par-3.
            </p>
          </div>
        </div>

        {/* Supporting stats — secondary row */}
        <dl className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 md:gap-x-10 border-t border-[#1e3120]/10 pt-10 md:pt-12">
          {STATS.map((s) => (
            <div key={s.label} className="border-l-2 border-[#c9a94e] pl-4 md:pl-5">
              <dt className="font-playfair text-3xl md:text-4xl text-[#1e3120] leading-none tracking-tight">
                {s.n}
              </dt>
              <dd className="mt-2">
                <p className="text-[#1e3120] font-semibold text-sm">{s.label}</p>
                <p className="text-[#1e3120]/55 text-xs mt-1 leading-snug">{s.sub}</p>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-12 md:mt-16 text-[#1e3120]/65 text-sm max-w-3xl leading-relaxed">
          South Africa is the proving ground. The model travels — UK (3 101 courses),
          Germany (1 050), France (804), Australia, the Middle East, Asia.
        </p>
        <p className="mt-3 text-[#1e3120]/40 text-xs">
          Sources: R&amp;A Global Participation Report 2024 · NGF · IMARC Prize Indemnity Insurance Market 2024&ndash;2033.
        </p>
      </div>
    </section>
  )
}
