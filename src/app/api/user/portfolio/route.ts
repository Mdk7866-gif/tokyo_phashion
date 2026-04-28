import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { normalizePhone } from '@/lib/utils';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

/**
 * POST /api/user/portfolio
 * Updates user's profile information using userId from JWT.
 */
export async function POST(request: NextRequest) {
  try {
    const { mobile_no, username, address } = await request.json();

    // Verify User via JWT
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    const normalizedMobile = mobile_no ? normalizePhone(mobile_no) : '';

    // Update the user document by _id
    const result = await users.updateOne(
      { _id: new ObjectId(payload.userId) },
      {
        $set: {
          mobile_no: normalizedMobile,
          username: username || '',
          address: {
            full_address: address?.full_address || '',
            cityname: address?.cityname || '',
            statename: address?.statename || '',
            pincode: address?.pincode || '',
          },
          updated_At: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Portfolio updated successfully.',
      updated: result.modifiedCount > 0,
    });
  } catch (error) {
    console.error('[portfolio POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * GET /api/user/portfolio
 * Fetches the user's profile information using userId from JWT.
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    const user = await users.findOne({ _id: new ObjectId(payload.userId) });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        email: user.email || '',
        mobile_no: user.mobile_no || '',
        username: user.username || '',
        address: user.address || { full_address: '', cityname: '', statename: '', pincode: '' },
        cartitems: user.cartitems || [],
        wishlistitems: user.wishlistitems || [],
      }
    });

  } catch (error) {
    console.error('[portfolio GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
