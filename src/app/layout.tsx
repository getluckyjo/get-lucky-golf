import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Get Lucky Golf — The Hole-in-One Challenge',
  description: 'Stake R50–R1,000 to win up to R1,000,000. Record your hole-in-one on any par-3 and claim your prize.',
  keywords: ['golf', 'hole-in-one', 'prize', 'South Africa', 'ZAR', 'competition'],
  openGraph: {
    title: 'Get Lucky Golf',
    description: 'One shot. R1,000,000. Back yourself on any par-3.',
    type: 'website',
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Lucky Golf',
    description: 'One shot. R1,000,000. Back yourself on any par-3.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Get Lucky Golf',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#007728',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-ZA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛳</text></svg>" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
