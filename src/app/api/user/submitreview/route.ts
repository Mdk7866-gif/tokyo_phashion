import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DATABASE_NAME!;

export async function POST(request: NextRequest) {
  try {
    const { orderId, review_stars, review_comment } = await request.json();

    if (!orderId || !review_stars) {
      return NextResponse.json({ error: 'Order ID and rating are required' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    
    const result = await db.collection('ordereddata').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { review_stars: review_stars.toString(), review_comment: review_comment || "" } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
