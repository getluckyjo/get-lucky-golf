import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from './faq.data'

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-[#f5f0e1]">
      <div className="mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-28">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a94e] mb-3">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="font-playfair text-3xl sm:text-5xl text-[#1e3120] leading-[1.05] uppercase tracking-tight"
          >
            The questions you actually have.
          </h2>
        </div>
        <ul className="space-y-0">
          {FAQ_ITEMS.map((item) => (
            <li key={item.q}>
              <details className="group border-b border-[#1e3120]/12 py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-semibold text-[#1e3120] text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a94e] rounded">
                  <span>{item.q}</span>
                  <ChevronDown
                    className="w-5 h-5 mt-1 shrink-0 text-[#335231] transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="pt-3 text-[#1e3120]/70 leading-relaxed">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
