import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:3000';
  // paths that require no auth
  const whitelisted = ["/", "/login"]

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is not signed in and the current path is not whitelisted, redirect the user to /login
  if (!user && !whitelisted.includes(req.nextUrl.pathname)) {
    const response = NextResponse.redirect(`${baseUrl}/login`)
    response.cookies.set("forwardUrl", req.nextUrl.pathname); // store where they were trying to go
    return response
  }

  return res
}

export const config = {
  // Run middleware for paths that match these patterns:
  matcher: [
    // These are probably overkill but just to be explicit:
    '/account',
    '/retro/:publicId*',
    /*
      * Match all request paths except for the ones starting with:
      * - api (API routes)
      * - _next/static (static files)
      * - _next/image (image optimization files)
      * - favicon.ico (favicon file)
     */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
