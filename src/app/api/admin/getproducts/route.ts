import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('collection');
    const subcategory = searchParams.get('subcategory');

    if (!collectionName) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');
    
    // Support both spellings just in case
    const query = subcategory 
      ? { $or: [{ subcatagory: subcategory }, { subcategory: subcategory }] } 
      : {};

    const products = await db.collection(collectionName)
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
