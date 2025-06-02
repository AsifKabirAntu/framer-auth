import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Skip auth check for public routes
    const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/callback'];
    if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return res;
    }

    // Add your protected routes here
    const protectedRoutes = ['/dashboard', '/profile', '/members'];
    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const redirectUrl = req.nextUrl.clone();
          redirectUrl.pathname = '/auth/signin';
          redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
          return NextResponse.redirect(redirectUrl);
        }
      } catch (error) {
        console.error('Auth error:', error);
        // If there's an auth error, redirect to sign in
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/auth/signin';
        return NextResponse.redirect(redirectUrl);
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's any error, allow the request to proceed
    // This prevents the middleware from breaking the entire app
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}; 