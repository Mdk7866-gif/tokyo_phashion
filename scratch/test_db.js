const { MongoClient } = require('mongodb');

async function test() {
  const uri = "mongodb+srv://Mdk7866:Mp8xxwi2ra@syp3.ga4ymx2.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('tokyofashion');
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
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

test();
