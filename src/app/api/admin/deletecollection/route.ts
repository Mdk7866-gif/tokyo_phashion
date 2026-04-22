import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('name');

    if (!collectionName || !collectionName.trim()) {
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

    const exists = await db
      .listCollections({ name: collectionName })
      .hasNext();

    if (!exists) {
      return NextResponse.json(
        { error: 'Collection does not exist' },
        { status: 404 }
      );
    }

    await db.collection(collectionName).drop();

    return NextResponse.json({
      message: `Collection '${collectionName}' deleted successfully`,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
