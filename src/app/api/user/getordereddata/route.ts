import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { normalizePhone } from '@/lib/utils';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

/**
 * GET /api/user/getordereddata
 * Fetches all orders for the logged-in user using userId or mobile_no.
 */
export async function GET(request: NextRequest) {
  try {
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

    // Fetch orders linked to this userId OR the mobile number associated with the session
    const query = {
      $or: [
        { userId: payload.userId }
      ] as Array<Record<string, unknown>>
    };

    if (payload.mobile_no) {
      query.$or.push({ mobile_no: normalizePhone(payload.mobile_no) });
    }

    const userOrders = await orders.find(query).sort({ created_at: -1 }).toArray();

    return NextResponse.json({
      success: true,
      orders: userOrders
    });

  } catch (error) {
    console.error('[getordereddata] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
