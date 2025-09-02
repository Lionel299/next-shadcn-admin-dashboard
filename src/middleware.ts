import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/v2/login', '/auth/v1/register', '/auth/v2/register'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Get the token from cookies or headers
  const token = request.cookies.get('accessToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // If accessing root path, redirect to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/v2/login', request.url));
  }
  
  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/v2/login', request.url));
  }
  
  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
