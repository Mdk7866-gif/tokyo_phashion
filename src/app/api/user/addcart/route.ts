import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

/**
 * POST /api/user/addcart
 * Adds an item to the user's cart using userId from JWT.
 */
export async function POST(request: NextRequest) {
  try {
    const { 
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

    // 1. Verify Authentication
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    // 2. Check if item already exists in cart for this user
    const existingItem = await users.findOne({
      _id: new ObjectId(payload.userId),
      cartitems: {
        $elemMatch: {
          name: name,
          link: link,
          size: size,
          colour: colour
        }
      }
    });

    if (existingItem) {
      return NextResponse.json({ error: 'Item already in cart' }, { status: 400 });
    }

    // 3. Prepare Cart Item
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

    // 4. Update User Cart
    const result = await users.updateOne(
      { _id: new ObjectId(payload.userId) },
      { 
        $push: { cartitems: cartItem } as never,
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
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error.' }, { status: 500 });
  }
}
