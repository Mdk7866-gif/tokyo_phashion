import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = process.env.DATABASE_NAME || 'tokyofashion';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('collection');
    const subcategoryName = searchParams.get('subcategory');

    if (!collectionName || !subcategoryName) {
      return NextResponse.json({ error: 'Collection and subcategory are required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(collectionName);

    // Try deleting using both common field names
    const result = await collection.deleteMany({
      $or: [
        { subcategory: subcategoryName },
        { sub_category: subcategoryName }
      ]
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} items from subcategory "${subcategoryName}" in collection "${collectionName}".`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Delete subcategory API Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
