import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get('collection');
    const productId = searchParams.get('id');

    if (!collectionName || !productId) {
      return NextResponse.json({ error: 'Collection and product ID are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');

    const result = await db.collection(collectionName).deleteOne({ 
      _id: new ObjectId(productId) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
