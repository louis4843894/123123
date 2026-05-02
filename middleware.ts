import { NextRequest, NextResponse } from 'next/server'

const ADMIN_ROUTES = ['/admin']
const VENDOR_ROUTES = ['/vendor']
const AUTH_ROUTES = ['/cases', '/family', '/plan']

function getSession(req: NextRequest) {
  const raw = req.cookies.get('session')?.value
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as {
      userId: string
      email: string
      name: string
      role: string
    }
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = getSession(req)

  // Admin routes — require admin role
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session) return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, req.url))
    if (session.role !== 'admin') return NextResponse.redirect(new URL('/', req.url))
  }

  // Vendor routes — require vendor or admin role
  if (VENDOR_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session) return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, req.url))
    if (session.role !== 'vendor' && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Auth-required routes — any logged-in user
  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (!session) return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, req.url))
  }

  // Already logged in — redirect away from login page
  if (pathname === '/auth/login' && session) {
    if (session.role === 'admin') return NextResponse.redirect(new URL('/admin', req.url))
    if (session.role === 'vendor') return NextResponse.redirect(new URL('/vendor', req.url))
    return NextResponse.redirect(new URL('/cases', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/cases/:path*', '/family/:path*', '/plan/:path*', '/auth/login'],
}
