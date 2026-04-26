import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = process.env.DATABASE_NAME!;

export async function GET() {
  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const customers = await db.collection('userdata')
      .find({})
      .sort({ created_At: -1 }) // Assuming 'created_At' is the field name used in the DB
      .project({
        mobile_no: 1,
        username: 1,
        address: 1,
        created_At: 1,
        last_login: 1
      })
      .toArray();

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
