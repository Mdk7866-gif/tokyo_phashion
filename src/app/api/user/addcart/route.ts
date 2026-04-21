import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { normalizePhone } from '@/lib/twilio';
import { verifyAccessToken } from '@/lib/auth';

const DB_NAME = process.env.DATABASE_NAME!;

/**
 * POST /api/user/addcart
 * Adds an item to the user's cart in the userdata collection.
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      mobile_no, 
      name, 
      link, 
      originalprice, 
      discountprice, 
      image, 
      colour, 
      size, 
      catagory, 
      subcatagory 
    } = await request.json();

    if (!mobile_no || !name) {
      return NextResponse.json(
        { error: 'Mobile number and item name are required.' },
        { status: 400 }
      );
    }

    const normalized = normalizePhone(mobile_no);

    // Security check
    const accessToken = request.cookies.get('access_token')?.value;
    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload && payload.mobile_no !== normalized) {
        return NextResponse.json(
          { error: 'Unauthorized: Mobile number mismatch.' },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    const cartItem = {
      name,
      link,
      originalprice,
      discountprice,
      image,
      colour,
      size,
      catagory,
      subcatagory,
      created_at: new Date()
    };

    // Push to cartitems array
    const result = await users.updateOne(
      { mobile_no: normalized },
      { 
        $push: { cartitems: cartItem } as any,
        $set: { updated_At: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully.'
    });

  } catch (error) {
    console.error('[addcart] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
