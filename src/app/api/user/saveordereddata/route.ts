import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { normalizePhone } from '@/lib/utils';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

/**
 * POST /api/user/saveordereddata
 * Saves an order to the 'ordereddata' collection.
 * Uses userId from JWT for security instead of mobile_no mismatch checks.
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      mobile_no, 
      customer_name, 
      items, 
      user_address, 
      total_amount, 
      delivery_type 
    } = await request.json();

    // 1. Verify Authentication
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized: Please login again.' }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid session. Please login again.' }, { status: 401 });
    }

    // 2. Validate Required Fields
    if (!mobile_no || !items || items.length === 0 || !user_address) {
      return NextResponse.json({ error: 'Missing required fields for order.' }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(mobile_no);

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const orders = db.collection('ordereddata');

    // 3. Prepare Order Data
    const orderData = {
      userId: payload.userId, // Link order to user's unique ID
      mobile_no: normalizedPhone,
      created_at: new Date(),
      updated_at: new Date(),
      customer_name: customer_name || "",
      items: items, 
      user_address: user_address,
      total_amount: total_amount,
      review_stars: "",
      review_comment: "",
      delivery_type: delivery_type || "COD",
      status: "in progress"
    };

    const result = await orders.insertOne(orderData);

    // 4. Also update the user's last mobile number used in their profile if they just changed it
    const users = db.collection('userdata');
    await users.updateOne(
      { _id: new ObjectId(payload.userId) },
      { $set: { mobile_no: normalizedPhone, updated_At: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Order saved successfully.',
      orderId: result.insertedId
    });

  } catch (error) {
    console.error('[saveordereddata] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
