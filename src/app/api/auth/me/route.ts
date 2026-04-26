import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = await verifyAccessToken(accessToken);

  if (!payload) {
    return NextResponse.json({ user: null, expired: true }, { status: 401 });
  }

  return NextResponse.json({
    user: { userId: payload.userId, mobile_no: payload.mobile_no, email: payload.email },
  });
}
