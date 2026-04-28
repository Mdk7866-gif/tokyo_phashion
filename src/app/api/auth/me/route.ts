import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    return NextResponse.json({ user: null, expired: true }, { status: 401 });
  }

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.DATABASE_NAME || 'tokyofashion');
    const users = db.collection('userdata');
    
    const user = await users.findOne({ _id: new ObjectId(payload.userId as string) });
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      user: { 
        userId: payload.userId, 
        mobile_no: user.mobile_no, 
        email: user.email,
        username: user.username,
        cartitems: user.cartitems || [],
        wishlistitems: user.wishlistitems || [],
      },
    });
  } catch (error) {
    console.error('[auth/me] Error:', error);
    return NextResponse.json({
      user: { userId: payload.userId, mobile_no: payload.mobile_no, email: payload.email },
    });
  }
}
