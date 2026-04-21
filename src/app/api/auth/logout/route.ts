import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

const DB_NAME = process.env.DATABASE_NAME!;

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (refreshToken) {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload) {
        const mongoClient = await clientPromise;
        const db = mongoClient.db(DB_NAME);
        await db
          .collection('userdata')
          .updateOne({ mobile_no: payload.mobile_no }, { $unset: { refreshToken: '' } });
      }
    }

    const response = NextResponse.json({ message: 'Logged out successfully.' });

    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[logout] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
