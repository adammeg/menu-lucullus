import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkMenuByCategory() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    console.log('📊 Menu items by category:\n');
    await client.connect();
    const db = client.db('lucullus');
    
    const categories = await db.collection('categories').find({}).sort({ order_index: 1 }).toArray();
    
    for (const cat of categories) {
      const itemCount = await db.collection('menu_items').countDocuments({ category_id: cat._id });
      console.log(`  ${cat.name}: ${itemCount} items`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkMenuByCategory();
