// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1) skip NextAuth, static assets, and your public signin page
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/auth/signin'
  ) {
    return NextResponse.next()
  }

  // 2) Look for the JWT in the 'nubras-session' cookie
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
    cookieName: 'nubras-session',    // ← must match AuthOptions
  })

  console.log(token)
  // 3) If no token (or it's expired), full redirect to your login app on :3000
  if (!token) {
    const signInUrl = new URL('http://localhost:3000/api/auth/signin')
    signInUrl.searchParams.set(
      'callbackUrl',
      `${req.nextUrl.origin}${pathname}`
    )
    return NextResponse.redirect(signInUrl.toString())
  }

  // 4) Valid token? Let them through
  return NextResponse.next()
}

export const config = { matcher: ['/:path*'] }
