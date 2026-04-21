import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';

const DB_NAME = process.env.DATABASE_NAME!;

/**
 * GET /api/user/orders
 * Fetches the user's orders from the ordereddata collection.
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

    const normalized = payload.mobile_no;

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const ordersCollection = db.collection('ordereddata');

    // Fetch orders for this user
    const orders = await ordersCollection
      .find({ mobile_no: normalized })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('[orders GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
