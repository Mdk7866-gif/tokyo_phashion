import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { collectionName, subcategory } = await request.json();

    if (!collectionName || !collectionName.trim() || !subcategory || !subcategory.trim()) {
      return NextResponse.json(
        { error: 'Invalid collection name or subcategory' },
        { status: 400 }
      );
    }

    const dbName = process.env.DATABASE_NAME;
    if (!dbName) {
      return NextResponse.json({ error: 'DATABASE_NAME is not defined' }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection(collectionName).insertOne({
      subcategory: subcategory.trim(),
      createdAt: new Date(),
      isPlaceholder: true
    });

    return NextResponse.json({
      success: true,
      message: `Subcategory '${subcategory}' added to '${collectionName}' successfully`,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
