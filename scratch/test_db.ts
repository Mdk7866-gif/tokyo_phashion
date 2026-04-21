import clientPromise from './src/lib/mongodb';

async function test() {
  const client = await clientPromise;
  const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const EXCLUDED_COLLECTIONS = new Set(['userdata', 'ordereddata', 'usercontactformdata']);
  
  const names = collections
    .map((c) => c.name)
    .filter((name) => typeof name === 'string' && name.length > 0)
    .filter((name) => !EXCLUDED_COLLECTIONS.has(name));

  for (const name of names) {
    const subcategories = await db.collection(name).distinct('subcategory');
    console.log(`Collection: ${name}, Subcategories:`, subcategories);
  }
  process.exit(0);
}

test();
