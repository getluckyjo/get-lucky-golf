import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── Rate limiting (in-memory sliding window) ──────────────────────────────
interface RateEntry { count: number; resetAt: number }
const rateStore = new Map<string, RateEntry>()
let cleanupCounter = 0

const RATE_LIMITS: { pattern: string; limit: number; windowMs: number }[] = [
  { pattern: '/api/payments/payfast/notify', limit: 0, windowMs: 0 },     // EXEMPT — never rate-limit ITN
  { pattern: '/api/payments/payfast',        limit: 5,  windowMs: 60_000 },
  { pattern: '/api/bets/create',             limit: 10, windowMs: 60_000 },
  { pattern: '/api/videos/upload-url',       limit: 10, windowMs: 60_000 },
  { pattern: '/api/admin',                   limit: 30, windowMs: 60_000 },
]
const DEFAULT_API_LIMIT = 60
const DEFAULT_API_WINDOW = 60_000

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

function checkRateLimit(request: NextRequest, pathname: string): NextResponse | null {
  if (!pathname.startsWith('/api/')) return null

  // Find matching rule
  let limit = DEFAULT_API_LIMIT
  let windowMs = DEFAULT_API_WINDOW
  for (const rule of RATE_LIMITS) {
    if (pathname.startsWith(rule.pattern)) {
      if (rule.limit === 0) return null // exempt
      limit = rule.limit
      windowMs = rule.windowMs
      break
    }
  }

  const ip = getClientIp(request)
  const routeKey = RATE_LIMITS.find(r => r.limit > 0 && pathname.startsWith(r.pattern))?.pattern ?? '/api'
  const key = `${ip}:${routeKey}`
  const now = Date.now()
  const entry = rateStore.get(key)

  if (!entry || entry.resetAt < now) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs })
  } else {
    entry.count++
    if (entry.count > limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      )
    }
  }

  // Lazy cleanup every ~100 requests
  if (++cleanupCounter >= 100) {
    cleanupCounter = 0
    for (const [k, e] of rateStore) { if (e.resetAt < now) rateStore.delete(k) }
  }

  return null
}

// ── Route config ──────────────────────────────────────────────────────────
const PUBLIC_ROUTES = ['/splash', '/onboarding', '/auth', '/home', '/history', '/leaderboard', '/account', '/membership', '/terms', '/privacy', '/responsible-play', '/app']
// '/payment-return' is load-bearing here. PayFast sends the payer back to it
// (return_url, api/payments/payfast/route.ts), and it is where the bet row is
// created. Gated, a payer whose cookie went stale during the PayFast detour is
// bounced to /auth — money taken, no bet, and pf_pending never consumed.
// '/age-check' is reached by redirect from the auth callback; gating it turns a
// bad cookie into a redirect loop.
const PLAY_ROUTES = ['/select-course', '/choose-stake', '/payment-return', '/record', '/confirm', '/result', '/verify', '/age-check']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Rate limiting check (API routes only) ───────────────────────────────
  const rateLimitResponse = checkRateLimit(request, pathname)
  if (rateLimitResponse) return rateLimitResponse

  // API routes, public routes, play routes, and admin routes need no middleware auth
  // (Admin routes handle their own auth in the admin layout and API handlers)
  if (
    pathname === '/' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    PUBLIC_ROUTES.some(r => pathname.startsWith(r)) ||
    pathname.startsWith('/auth/callback') ||
    PLAY_ROUTES.some(r => pathname.startsWith(r))
  ) {
    return NextResponse.next({ request })
  }

  // Skip auth gate if Supabase is not yet configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_REF')) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export default proxy

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|otf|ttf|woff|woff2)$).*)',
  ],
}
