import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

import { normalizePhone } from '@/lib/twilio';
import { verifyAccessToken } from '@/lib/auth';

const DB_NAME = process.env.DATABASE_NAME!;

/**
 * POST /api/user/portfolio
 * Updates or creates the user's profile information.
 * Expected body: { mobile_no, username, address: { full_address, cityname, statename, pincode } }
 */
export async function POST(request: NextRequest) {
  try {
    const { mobile_no, username, address } = await request.json();

    if (!mobile_no) {
      return NextResponse.json(
        { error: 'Mobile number is required.' },
        { status: 400 }
      );
    }

    const normalized = normalizePhone(mobile_no);

    // Optional: Security check to ensure user is logged in as this mobile_no
    const accessToken = request.cookies.get('access_token')?.value;
    if (accessToken) {
        const payload = await verifyAccessToken(accessToken);
        if (payload && payload.mobile_no !== normalized) {
            return NextResponse.json(
                { error: 'Unauthorized: Mobile number mismatch.' },
                { status: 403 }
            );
        }
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    // Update the user document
    const result = await users.updateOne(
      { mobile_no: normalized },
      {
        $set: {
          username: username || '',
          address: {
            full_address: address?.full_address || '',
            cityname: address?.cityname || '',
            statename: address?.statename || '',
            pincode: address?.pincode || '',
          },
          updated_At: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Portfolio updated successfully.',
      updated: result.modifiedCount > 0 || result.upsertedCount > 0,
    });
  } catch (error) {
    console.error('[portfolio] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/portfolio
 * Fetches the user's profile information.
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.mobile_no) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    const user = await users.findOne({ mobile_no: payload.mobile_no });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        mobile_no: user.mobile_no,
        username: user.username || '',
        address: user.address || { full_address: '', cityname: '', statename: '', pincode: '' },
        cartitems: user.cartitems || [],
      }
    });

  } catch (error) {
    console.error('[portfolio GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
