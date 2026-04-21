import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessTokenEdge } from '@/lib/auth';

/** Prefixes that require a logged-in user */
const PROTECTED = ['/account', '/orders', '/wishlist', '/checkout'];

/** Paths a logged-in user should not see */
const AUTH_ONLY = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
