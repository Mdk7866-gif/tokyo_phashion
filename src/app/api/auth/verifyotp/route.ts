import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { verifyOtp, normalizePhone } from '@/lib/twilio';
import clientPromise from '@/lib/mongodb';

const DB_NAME = process.env.DATABASE_NAME!;

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone and OTP code are required.' },
        { status: 400 }
      );
    }

    const normalized = normalizePhone(phone);

    // 1. Verify OTP with Twilio
    const isValid = await verifyOtp(normalized, code);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP.' },
        { status: 401 }
      );
    }

    // 2. Upsert user in MongoDB
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    const result = await users.findOneAndUpdate(
      { mobile_no: normalized },
      {
        $setOnInsert: { 
          mobile_no: normalized, 
          created_At: new Date(),
          username: '',
          address: {
            full_address: '',
            cityname: '',
            statename: '',
            pincode: ''
          },
          updated_At: new Date(),
          cartitems: []
        },
        $set: { last_login: new Date() },
      },
      { upsert: true, returnDocument: 'after' }
    );

    const userId = result!._id.toString();

    // 3. Generate tokens (async with jose)
    const payload = { userId, mobile_no: normalized };
    const accessToken  = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    // 4. Persist refresh token in DB
    await users.updateOne(
      { mobile_no: normalized },
      { $set: { refreshToken } }
    );

    // 5. Set httpOnly cookies
    const response = NextResponse.json({
      message: 'Login successful.',
      user: { userId, mobile_no: normalized },
    });


    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[verifyotp] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
