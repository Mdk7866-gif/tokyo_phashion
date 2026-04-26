import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

/**
 * DELETE /api/user/deletecartitem
 * Removes an item from the user's cart using userId from JWT.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { name, link, size, colour } = await request.json();

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

    // 2. Remove the specific item from the cartitems array
    const result = await users.updateOne(
      { _id: new ObjectId(payload.userId) },
      { 
        $pull: { 
          cartitems: { 
            name: name,
            link: link,
            size: size,
            colour: colour
          } 
        } as any,
        $set: { updated_At: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully.'
    });

  } catch (error) {
    console.error('[deletecartitem] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
