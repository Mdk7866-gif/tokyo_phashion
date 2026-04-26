import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

/**
 * POST /api/user/cancelorder
 * Updates order status to 'cancelled' using userId for security.
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const orders = db.collection('ordereddata');

    // Security check: ensure this order belongs to the logged-in user
    // We match by ID AND (userId OR mobile_no)
    const query: any = { 
      _id: new ObjectId(orderId),
      $or: [
        { userId: payload.userId }
      ]
    };
    
    if (payload.mobile_no) {
        query.$or.push({ mobile_no: payload.mobile_no });
    }

    const result = await orders.updateOne(
      query,
      { $set: { status: 'cancelled', updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order cancelled successfully' });

  } catch (error) {
    console.error('[cancelorder] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
