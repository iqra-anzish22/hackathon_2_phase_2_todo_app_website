/**
 * Next.js middleware for route protection.
 * Redirects unauthenticated users to sign-in page.
 * Redirects authenticated users away from auth pages.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for authentication token in cookies
  const token = request.cookies.get('auth-token');
  const isAuthenticated = !!token;

  const { pathname } = request.nextUrl;

  // Protected routes - require authentication
  if (pathname.startsWith('/tasks')) {
    if (!isAuthenticated) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Auth routes - redirect if already authenticated
  if (pathname === '/signin' || pathname === '/signup') {
    if (isAuthenticated) {
      // Redirect to tasks page if already authenticated
      return NextResponse.redirect(new URL('/tasks', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tasks/:path*',
    '/signin',
    '/signup',
  ],
};
