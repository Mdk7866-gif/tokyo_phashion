import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessTokenEdge } from '@/lib/auth';

/** Prefixes that require a logged-in user */
const PROTECTED = ['/account', '/orders', '/wishlist', '/checkout'];

/** Paths a logged-in user should not see */
const AUTH_ONLY = ['/login'];

/** Admin specific protection */
const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_TOKEN = 'tp_admin_secret_2026';
const ADMIN_PATHS = ['/admin', '/api/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check Admin Paths
  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  if (isAdminPath) {
    // Skip auth for login page, auth API, and public collection fetching
    const PUBLIC_ADMIN_APIS = ['/api/admin/auth', '/api/admin/getallcollection', '/api/admin/getproducts', '/api/admin/getsingleproduct'];
    if (pathname === '/admin/login' || PUBLIC_ADMIN_APIS.includes(pathname)) {
      return NextResponse.next();
    }

    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (sessionToken === ADMIN_TOKEN) {
      return NextResponse.next();
    }

    // Unauthorized Admin Access
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Check User Paths
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly  = AUTH_ONLY.some((p) => pathname.startsWith(p));

  // Skip if route is irrelevant
  if (!isProtected && !isAuthOnly) return NextResponse.next();

  const accessToken = request.cookies.get('access_token')?.value;
  const payload     = accessToken ? await verifyAccessTokenEdge(accessToken) : null;

  // Unauthenticated user trying to access a protected page
  if (isProtected && !payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to go to /login
  if (isAuthOnly && payload) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matches all routes except static assets, but INCLUDES api/admin
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
