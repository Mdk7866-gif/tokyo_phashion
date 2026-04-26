import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = process.env.DATABASE_NAME!;

export async function GET() {
  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const forms = await db.collection('usercontactformdata').find({}).sort({ created_at: -1 }).toArray();

    return NextResponse.json({ success: true, forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
