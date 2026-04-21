import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support various naming conventions that might come from the client
    const collectionName = body.collectionname || body.collectionName;
    const productName = body.productname || body.productName;
    const originalPrice = body['original price'] || body.original_price || body.originalPrice;
    const discountPrice = body['discount price'] || body.discount_price || body.discountPrice;
    const images = body.images;
    const size = body.size;
    const stars = body.stars;
    const subcatagory = body.subcatagory || body.subcategory;
    const instoke = body.instoke || body.inStock;
    const created_at = body.created_at || body.createdAt || new Date().toISOString();

    if (!collectionName) {
      return NextResponse.json({ error: 'collectionname is required' }, { status: 400 });
    }

    // Process images concurrently to improve speed
    let processedImages: { url: string; colurname: string }[] = [];
    if (images && Array.isArray(images)) {
      processedImages = await Promise.all(
        images.map(async (img) => {
          let finalUrl = img.url;
          
          if (img.url && img.url.startsWith('data:image')) {
            // Upload the base64 image data to Cloudinary
            finalUrl = await uploadImage(img.url);
          }

          return {
            url: finalUrl,
            colurname: img.colurname || img.colorname // support both spellings
          };
        })
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion'); // Connects to specific DB from environment

    // Prepare the document to insert
    const insertDoc = {
      productname: productName,
      original_price: originalPrice,
      discount_price: discountPrice,
      images: processedImages,
      size: Array.isArray(size) ? size : [size].filter(Boolean),
      stars: typeof stars === 'number' ? stars : parseFloat(stars) || 0,
      subcatagory: subcatagory,
      instoke: instoke,
      created_at: created_at,
    };

    // Store in the dynamically specified collection
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(insertDoc);

    return NextResponse.json({ 
      success: true, 
      message: 'Product inserted successfully',
      insertedId: result.insertedId 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Insert API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
