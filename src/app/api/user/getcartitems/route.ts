import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';

const DB_NAME = process.env.DATABASE_NAME!;

/**
 * GET /api/user/getcartitems
 * Fetches all cart items for the logged-in user.
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.mobile_no) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    const user = await users.findOne({ mobile_no: payload.mobile_no });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      cartitems: user.cartitems || []
    });

  } catch (error) {
    console.error('[getcartitems] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
