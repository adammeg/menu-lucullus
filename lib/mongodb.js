import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      await cachedClient.db('admin').command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      cachedClient = null;
      cachedDb = null;
    }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable not defined');
  }

  const mongoOptions = {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 45000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    retryWrites: true,
    w: 'majority',
    tls: true,
    tlsAllowInvalidCertificates: false,
    authSource: 'admin',
    directConnection: false,
    ssl: true
  };

  const client = new MongoClient(process.env.MONGODB_URI, mongoOptions);

  try {
    await client.connect();
    const db = client.db('lucullus');

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    cachedClient = null;
    cachedDb = null;
    throw {
      type: 'MONGODB_CONNECTION_ERROR',
      message: error.message,
      code: error.code
    };
  }
}
