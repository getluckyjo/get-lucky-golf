import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/splash', '/onboarding', '/auth', '/home', '/history', '/leaderboard', '/account']
const PLAY_ROUTES = ['/select-course', '/choose-stake', '/record', '/confirm', '/result', '/verify']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

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
