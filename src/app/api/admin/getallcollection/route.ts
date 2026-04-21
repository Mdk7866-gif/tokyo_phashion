import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

const EXCLUDED_COLLECTIONS = new Set(['userdata', 'ordereddata', 'usercontactformdata']);

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');

    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const names = collections
      .map((c) => c.name)
      .filter((name): name is string => typeof name === 'string' && name.length > 0)
      .filter((name) => !EXCLUDED_COLLECTIONS.has(name))
      .sort((a, b) => a.localeCompare(b));

    const result = await Promise.all(
      names.map(async (name) => {
        try {
          const collection = db.collection(name);
          const count = await collection.countDocuments();
          
          // Try fetching distinct subcategories from both common field names
          let subcategories = await collection.distinct('subcategory');
          if (subcategories.length === 0) {
            subcategories = await collection.distinct('sub_category');
          }

          console.log(`API Debug: Collection "${name}" (docs: ${count}) found subcategories:`, subcategories);
          
          return {
            name,
            subcategories: subcategories.filter((s): s is string => typeof s === 'string' && s.length > 0),
          };
        } catch (err) {
          console.error(`API Error fetching subcategories for "${name}":`, err);
          return { name, subcategories: [] };
        }
      })
    );

    console.log('API Debug: Final collections result:', JSON.stringify(result, null, 2));

    return NextResponse.json(
      {
        success: true,
        count: result.length,
        collections: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get all collection API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

