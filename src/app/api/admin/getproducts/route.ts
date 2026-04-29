import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('collection');
    const subcategory = searchParams.get('subcategory');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const skip = (page - 1) * limit;

    if (!collectionName) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');
    
    // Base query
    const query: any = subcategory 
      ? { $or: [{ subcatagory: subcategory }, { subcategory: subcategory }] } 
      : {};

    // Sorting logic
    let sortQuery: any = { created_at: -1 };
    if (sort === 'price: low to high') sortQuery = { discount_price: 1 };
    else if (sort === 'price: high to low') sortQuery = { discount_price: -1 };
    else if (sort === 'newest first') sortQuery = { created_at: -1 };

    const total = await db.collection(collectionName).countDocuments(query);
    const products = await db.collection(collectionName)
      .find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ 
      success: true, 
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
