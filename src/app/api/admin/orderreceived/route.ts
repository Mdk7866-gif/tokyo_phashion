import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DATABASE_NAME!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'in progress';

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    
    // Sort by created_at descending (newest first)
    const orders = await db.collection('ordereddata')
      .find({ status })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    
    const result = await db.collection('ordereddata').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
