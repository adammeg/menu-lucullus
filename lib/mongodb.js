import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not defined');
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();
  const db = client.db('lucullus');

  // Initialize collections
  await initializeCollections(db);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

async function initializeCollections(db) {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  // Only initialize if collections don't exist
  if (!collectionNames.includes('categories')) {
    await db.createCollection('categories');
    const categoriesCollection = db.collection('categories');
    await categoriesCollection.createIndex({ name: 1 }, { unique: true });
  }

  if (!collectionNames.includes('menu_items')) {
    await db.createCollection('menu_items');
    const menuCollection = db.collection('menu_items');
    await menuCollection.createIndex({ category_id: 1 });
  }

  if (!collectionNames.includes('promotions')) {
    await db.createCollection('promotions');
    const promotionsCollection = db.collection('promotions');
    await promotionsCollection.createIndex({ is_active: 1 });
  }
}
