import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest first';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');
    
    // Get all collections
    const allCollections = await db.listCollections().toArray();
    const systemCollections = ['userdata', 'ordereddata', 'usercontactformdata', 'admin_users'];
    const productCollections = allCollections
      .map(c => c.name)
      .filter(name => !systemCollections.includes(name));

    let allProducts: any[] = [];
    
    // Fetch from each product collection
    for (const collName of productCollections) {
      const products = await db.collection(collName)
        .find({ 
          discount_price: { $lte: 999 }, 
          isPlaceholder: { $ne: true } 
        })
        .toArray();
      
      // Add collection name to each product for detailed view lookup
      const productsWithColl = products.map(p => ({ ...p, collectionname: collName }));
      allProducts = [...allProducts, ...productsWithColl];
    }

    // Sort the combined results
    if (sort === 'price: low to high') {
      allProducts.sort((a, b) => a.discount_price - b.discount_price);
    } else if (sort === 'price: high to low') {
      allProducts.sort((a, b) => b.discount_price - a.discount_price);
    } else {
      // Default: Newest first
      allProducts.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }

    const total = allProducts.length;
    const paginatedProducts = allProducts.slice(skip, skip + limit);

    return NextResponse.json({ 
      success: true, 
      products: paginatedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Under 999 API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
