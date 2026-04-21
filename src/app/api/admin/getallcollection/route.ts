import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

const EXCLUDED_COLLECTIONS = new Set(['userdata', 'ordereddata', 'usercontactformdata']);

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');

    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const names = collections
      .map((c) => c.name)
      .filter((name): name is string => typeof name === 'string' && name.length > 0)
      .filter((name) => !EXCLUDED_COLLECTIONS.has(name))
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json(
      {
        success: true,
        count: names.length,
        collections: names,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get all collection API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

