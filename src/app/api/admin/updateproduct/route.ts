import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { uploadImage } from '@/lib/cloudinary';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { _id, collectionname, ...updateData } = body;

    if (!_id || !collectionname) {
      return NextResponse.json({ error: 'Product ID and collection name are required' }, { status: 400 });
    }

    // Process images: if they are base64, upload to Cloudinary. If they are already URLs, keep them.
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = await Promise.all(updateData.images.map(async (img: { url: string }) => {
        if (img.url && img.url.startsWith('data:image')) {
          const uploadedUrl = await uploadImage(img.url, { 
            folder: 'tokyofashion/admin_insert' 
          });
          return { ...img, url: uploadedUrl };
        }
        return img;
      }));
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');

    // Remove _id from updateData to avoid Mongo error
    delete updateData._id;

    const result = await db.collection(collectionname).updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
