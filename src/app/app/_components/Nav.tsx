import Image from 'next/image'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '/home'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#walkthrough', label: 'Product' },
  { href: '#courses', label: 'Courses' },
  { href: '#opportunity', label: 'Opportunity' },
  { href: '#partners', label: 'Partners' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-[#c9a94e] focus:text-[#1e3120] focus:px-4 focus:py-2 focus:rounded-full focus:font-semibold"
      >
        Skip to content
      </a>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#1e3120]/30 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2.5 shrink-0" aria-label="Get Lucky Golf — home">
            <Image src="/logo.png" alt="" width={36} height={36} priority />
            <span className="font-playfair text-lg md:text-xl text-white tracking-tight uppercase">
              Get Lucky
            </span>
          </Link>
          <ul className="hidden lg:flex items-center gap-7 text-sm text-white/80">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-[#c9a94e] transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={APP_URL}
            className="inline-flex items-center justify-center bg-[#c9a94e] hover:bg-[#e8d48b] text-[#1e3120] px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-[1.03]"
          >
            Open app
          </Link>
        </nav>
      </header>
    </>
  )
}
