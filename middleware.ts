import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Target the TidesOS project path specifically
  if (pathname.startsWith('/tidesos')) {
    const securityKey = searchParams.get('key')
    const isAuthorized = request.cookies.has('tides_access_granted')

    // 1. If they have the key (e.g., ?key=tides_exclusive_2026), grant access and set cookie
    if (securityKey === 'tides_exclusive_2026' || isAuthorized) {
      const response = NextResponse.next()
      if (securityKey) {
        response.cookies.set('tides_access_granted', 'true', {
          maxAge: 60 * 60 * 24 * 7, // Keep them authorized for a week
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        })
      }
      return response
    }

    // 2. If they click from your landing page without a key, send to the gate
    return NextResponse.redirect(new URL('/tidesos/restricted', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/tidesos/:path*',
}
