import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('admin_token')?.value

    // If no token and not on login page, redirect to login
    if (!authToken && !request.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // If has token and on login page, redirect to dashboard
    if (authToken && request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
} 