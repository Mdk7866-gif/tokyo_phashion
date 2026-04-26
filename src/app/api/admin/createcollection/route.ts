import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { collectionName } = await request.json();

    if (typeof collectionName !== 'string' || !collectionName.trim()) {
      return NextResponse.json(
        { error: 'Invalid collection name' },
        { status: 400 }
      );
    }

    const dbName = process.env.DATABASE_NAME;
    if (!dbName) {
      return NextResponse.json(
        { error: 'DATABASE_NAME is not defined' },
        { status: 500 }
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    // ✅ Keep this check (reliable)
    const exists = await db
      .listCollections({ name: collectionName })
      .hasNext();

    if (exists) {
      return NextResponse.json(
        { error: 'this collection already exist please try new' },
        { status: 409 }
      );
    }

    await db.createCollection(collectionName);

    return NextResponse.json({
      message: `Collection '${collectionName}' created successfully`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}