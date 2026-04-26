import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

const DB_NAME = process.env.DATABASE_NAME!;

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided.' },
        { status: 401 }
      );
    }

    // 1. Verify the refresh token signature (async jose)
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token.' },
        { status: 401 }
      );
    }

    // 2. Confirm token matches DB record
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const user = await db
      .collection('userdata')
      .findOne({ mobile_no: payload.mobile_no, refreshToken });

    if (!user) {
      return NextResponse.json(
        { error: 'Refresh token revoked or not recognised.' },
        { status: 401 }
      );
    }

    // 3. Issue a fresh access token
    const newAccessToken = await generateAccessToken({
      userId: payload.userId,
      mobile_no: payload.mobile_no,
    });

    const response = NextResponse.json({ message: 'Token refreshed.' });

    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[refresh] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
