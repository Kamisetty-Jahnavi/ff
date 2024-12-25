import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
    if (token) {
      try {
        await verifyToken(token)
        return NextResponse.redirect(new URL('/student-dashboard', request.url))
      } catch (error) {
        // Token is invalid, proceed to login page
      }
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = await verifyToken(token)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('user', JSON.stringify(decoded))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
}

