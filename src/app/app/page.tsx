import type { Metadata } from 'next'
import Nav from './_components/Nav'
import Hero from './_components/Hero'
import HowItWorks from './_components/HowItWorks'
import AppWalkthrough from './_components/AppWalkthrough'
import PartnerCourses from './_components/PartnerCourses'
import Opportunity from './_components/Opportunity'
import WhyNow from './_components/WhyNow'
import ForPartners from './_components/ForPartners'
import Traction from './_components/Traction'
import Faq from './_components/Faq'
import FinalCta from './_components/FinalCta'
import Footer from './_components/Footer'
import { FAQ_ITEMS } from './_components/faq.data'

const SITE = 'https://www.getluckygolf.co.za'
const PAGE_URL = `${SITE}/app`
const TITLE = 'Get Lucky Golf — Back yourself on any par-3'
const DESCRIPTION =
  'Stake R50 to R1,000. Sink a hole-in-one on any par-3. Walk off with up to R1,000,000. Insurance-backed. Built in Cape Town.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  keywords: [
    'hole in one challenge',
    'golf prize insurance',
    'par-3 challenge',
    'Get Lucky Golf',
    'South Africa golf',
    'prize indemnity',
    'golf sponsorship',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Get Lucky Golf',
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export default function AppLandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}#org`,
        name: 'Get Lucky Golf',
        url: SITE,
        logo: `${SITE}/logo.png`,
        description:
          'Insurance-backed hole-in-one challenge. Stake on any par-3 and win up to R1,000,000.',
        foundingLocation: 'Cape Town, South Africa',
        sameAs: [],
      },
      {
        '@type': 'Product',
        name: 'Get Lucky Hole-in-One Challenge',
        description:
          'An insurance-backed stake-to-win product. Stake R50 to R1,000 on any par-3; sink a hole-in-one and win up to R1,000,000.',
        brand: { '@id': `${SITE}#org` },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'ZAR',
          lowPrice: '50',
          highPrice: '1000',
          offerCount: 5,
          availability: 'https://schema.org/InStock',
          url: PAGE_URL,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <div className="bg-[#f5f0e1] text-[#1e3120] font-dm antialiased min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <AppWalkthrough />
        <PartnerCourses />
        <Opportunity />
        <WhyNow />
        <ForPartners />
        <Traction />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
