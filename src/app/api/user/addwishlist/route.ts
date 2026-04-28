import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

/**
 * POST /api/user/addwishlist
 * Adds an item to the user's wishlist in the 'userdata' collection.
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      link, 
      originalprice, 
      discountprice, 
      image, 
      catagory, 
      subcatagory,
      createdAt 
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

    // 2. Check if item already exists in wishlist for this user
    // We use name and link to uniquely identify the product in the wishlist
    const existingItem = await users.findOne({
      _id: new ObjectId(payload.userId),
      wishlistitems: {
        $elemMatch: {
          name: name,
          link: link
        }
      }
    });

    if (existingItem) {
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 400 });
    }

    // 3. Prepare Wishlist Item
    const wishlistItem = {
      name,
      link,
      originalprice,
      discountprice,
      image,
      catagory,
      subcatagory,
      createdAt: createdAt || new Date()
    };

    // 4. Update User Wishlist in the 'userdata' collection
    const result = await users.updateOne(
      { _id: new ObjectId(payload.userId) },
      { 
        $push: { wishlistitems: wishlistItem } as any,
        $set: { updated_At: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist successfully.'
    });

  } catch (error) {
    console.error('[addwishlist] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error.' }, 
      { status: 500 }
    );
  }
}
