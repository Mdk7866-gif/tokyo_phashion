import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');

    const documents = await db
      .collection('usercontactform')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        count: documents.length,
        data: documents,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact form read API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

