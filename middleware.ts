import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSessionEdge } from '@/lib/auth-edge'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login', '/api/auth/register']
  
  // Routes that should redirect to dashboard if authenticated
  const authRedirectRoutes = ['/']
  
  // API routes that don't require authentication
  const publicApiRoutes = ['/api/auth/login', '/api/auth/register']

  // Check if the current path is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Handle root route - redirect to landing if authenticated, login if not
  if (authRedirectRoutes.includes(pathname)) {
    const token = request.cookies.get('auth-token')?.value
    const allCookies = Object.fromEntries(
      request.cookies.getAll().map(cookie => [cookie.name, cookie.value.substring(0, 20) + '...'])
    )
    
    console.log('Middleware - Root route check:', {
      pathname,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'NO_TOKEN',
      allCookies
    })
    
    if (token) {
      console.log('Middleware - Validating token with Edge auth...')
      const user = validateSessionEdge(token)
      console.log('Middleware - User validation result:', { 
        hasUser: !!user,
        userId: user?.id,
        userName: user?.name 
      })
      if (user) {
        console.log('Middleware - Authentication successful, redirecting to /landing')
        return NextResponse.redirect(new URL('/landing', request.url))
      } else {
        console.log('Middleware - Token validation failed')
      }
    } else {
      console.log('Middleware - No auth token found in cookies')
    }
    
    // Not authenticated, redirect to login
    console.log('Middleware - Not authenticated, redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For API routes
  if (pathname.startsWith('/api/')) {
    if (publicApiRoutes.includes(pathname)) {
      return NextResponse.next()
    }
    
    // Check authentication for protected API routes
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = validateSessionEdge(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.next()
  }

  // For page routes, redirect to login if not authenticated
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const user = validateSessionEdge(token)
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
