import { MapPin, Coins, Video, BadgeCheck, Trophy } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    tag: 'Pick',
    icon: MapPin,
    title: 'Open the app on a par-3',
    body: 'GPS locks you to a registered hole at 100+ South African courses.',
  },
  {
    n: '02',
    tag: 'Pay',
    icon: Coins,
    title: 'Choose your stake',
    body: 'R50 to R1 000. Bigger stake, bigger prize. Pay in three taps.',
  },
  {
    n: '03',
    tag: 'Play',
    icon: Video,
    title: 'Film. Swing. Win.',
    body: 'Hit record before you swing. One shot. Standard rules apply.',
  },
  {
    n: '04',
    tag: 'Verify',
    icon: BadgeCheck,
    title: 'We confirm the ace',
    body: 'Witness and video review within 24 hours. No disputes.',
  },
  {
    n: '05',
    tag: 'Win',
    icon: Trophy,
    title: 'Get paid',
    body: 'Insured payout straight to your account. Underwritten by Indwe (FSP 3425).',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="bg-[#f5f0e1]"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
            How it works
          </p>
          <h2
            id="how-heading"
            className="font-playfair text-3xl sm:text-5xl text-[#1e3120] leading-[1.05] uppercase tracking-tight"
          >
            Pick. Pay. Play. Win.
          </h2>
          <p className="mt-5 text-[#1e3120]/70 leading-relaxed">
            No membership. No handicap. No QR codes at the tee. Just the app and a par-3 —
            three taps and you&rsquo;re playing for the big prize.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Connector line — desktop only */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#1e3120]/15 to-transparent"
          />

          <ol className="relative grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map(({ n, tag, icon: Icon, title, body }) => (
              <li
                key={n}
                className="group relative bg-white rounded-2xl p-6 shadow-[0_8px_24px_-12px_rgba(30,49,32,0.12)] border border-[#1e3120]/8 flex flex-col gap-4 transition-all hover:border-[#c9a94e]/40 hover:shadow-[0_20px_50px_-20px_rgba(30,49,32,0.2)] hover:-translate-y-1"
              >
                <span
                  aria-hidden
                  className="absolute top-3 right-4 font-playfair text-6xl text-[#1e3120]/[0.05] leading-none tracking-tight"
                >
                  {n}
                </span>
                <span className="relative bg-[#335231]/10 text-[#335231] rounded-full w-11 h-11 grid place-items-center group-hover:bg-[#c9a94e]/15 group-hover:text-[#c9a94e] transition-colors">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a94e]">
                  {tag}
                </p>
                <h3 className="font-bold text-[#1e3120] leading-tight -mt-2 text-[15px]">
                  {title}
                </h3>
                <p className="text-[#1e3120]/65 text-sm leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
