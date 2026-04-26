import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { normalizePhone } from '@/lib/twilio';
import { verifyAccessToken } from '@/lib/auth';

const DB_NAME = process.env.DATABASE_NAME!;

/**
 * DELETE /api/user/deletecartitem
 * Removes an item from the user's cart.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { mobile_no, name, link, size, colour } = await request.json();

    if (!mobile_no || !name || !link) {
      return NextResponse.json(
        { error: 'Missing required fields for deletion.' },
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

    // Pull the item from the cartitems array
    // Matching by name, link, size, and colour to be specific
    const result = await users.updateOne(
      { mobile_no: normalized },
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
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
