import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAccessToken } from '@/lib/auth';
import { normalizePhone } from '@/lib/twilio';

const DB_NAME = process.env.DATABASE_NAME!;

/**
 * POST /api/user/saveordereddata
 * Saves an order to the 'ordereddata' collection.
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

    if (!mobile_no || !items || items.length === 0 || !user_address) {
      return NextResponse.json(
        { error: 'Missing required fields for order.' },
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
    const orders = db.collection('ordereddata');

    const orderData = {
      mobile_no: normalized,
      created_at: new Date(),
      updated_at: new Date(),
      customer_name: customer_name || "",
      items: items, // Array of product objects
      user_address: user_address,
      total_amount: total_amount,
      review_stars: "",
      review_comment: "",
      delivery_type: delivery_type || "COD",
      status: "in progress"
    };

    const result = await orders.insertOne(orderData);

    return NextResponse.json({
      success: true,
      message: 'Order saved successfully.',
      orderId: result.insertedId
    });

  } catch (error) {
    console.error('[saveordereddata] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
