import { NextRequest, NextResponse } from 'next/server';
import { sendOtp } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    // sendOtp in lib/twilio now handles normalization internally
    await sendOtp(phone);

    return NextResponse.json({ message: 'OTP sent successfully.' });
  } catch (error: any) {
    console.error('[sendotp] Error:', error);
    
    // Check for Twilio specific invalid number error
    if (error?.code === 60200) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please include your country code (e.g., +91 for India).' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
