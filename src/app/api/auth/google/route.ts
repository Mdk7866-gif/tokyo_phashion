import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: 'No Google credential provided.' }, { status: 400 });
    }

    // 1. Verify the Google ID Token
    // In a production app, use 'google-auth-library'. 
    // Here we use the public tokeninfo endpoint for simplicity without extra libs.
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Invalid Google token.' }, { status: 401 });
    }

    const payload = await verifyRes.json();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return NextResponse.json({ error: 'Email not provided by Google.' }, { status: 400 });
    }

    // 2. Sync with Database
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const users = db.collection('userdata');

    // Find user by email or google id
    let user = await users.findOne({ 
      $or: [
        { email: email },
        { "login_credentials.id": googleId }
      ]
    });

    const googleCredential = {
      provider: 'google',
      id: googleId,
      email: email,
      name: name,
      picture: picture,
      last_login: new Date()
    };

    if (!user) {
      // Create new user
      const newUser = {
        email: email,
        username: name,
        mobile_no: "", // Can be collected later if needed
        address: {},
        cartitems: [],
        login_credentials: [googleCredential],
        created_At: new Date(),
        updated_At: new Date(),
        last_login: new Date(),
      };
      const result = await users.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId } as any;
    } else {
      // Update existing user
      // Check if google credentials already in array
      const hasGoogle = user.login_credentials?.some((c: any) => c.provider === 'google' && c.id === googleId);
      
      const updateData: any = {
        $set: { 
          last_login: new Date(),
          updated_At: new Date()
        }
      };

      if (!hasGoogle) {
        updateData.$push = { login_credentials: googleCredential };
      } else {
        // Update existing google credential in array
        updateData.$set["login_credentials.$[elem]"] = googleCredential;
      }

      await users.updateOne(
        { _id: user._id },
        updateData,
        { arrayFilters: [{ "elem.provider": "google", "elem.id": googleId }] }
      );
    }

    // 3. Generate JWTs
    const tokenPayload = {
      userId: user!._id.toString(),
      email: user!.email,
      mobile_no: user!.mobile_no || ""
    };

    const accessToken = await generateAccessToken(tokenPayload);
    const refreshToken = await generateRefreshToken(tokenPayload);

    // 4. Set Cookies
    const response = NextResponse.json({ 
      success: true, 
      user: { userId: tokenPayload.userId, email: tokenPayload.email, username: user!.username } 
    });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
