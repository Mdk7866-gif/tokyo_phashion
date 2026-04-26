import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';
// Secret token stored only on server — never exposed to browser
const ADMIN_TOKEN = 'tp_admin_secret_2026';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Compare against server-side env variable — NOT the NEXT_PUBLIC_ one
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    // Set secure httpOnly cookie that expires in 7 days
    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return response;
}

// Helper used by middleware
export const ADMIN_SESSION_COOKIE_NAME = ADMIN_SESSION_COOKIE;
export const ADMIN_TOKEN_VALUE = ADMIN_TOKEN;
