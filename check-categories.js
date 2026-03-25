import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkCategories() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    console.log('🔍 Checking MongoDB categories...\n');
    await client.connect();
    const db = client.db('lucullus');
    
    const categories = await db.collection('categories').find({}).sort({ order_index: 1 }).toArray();
    
    console.log('📋 Current Categories:');
    if (categories.length === 0) {
      console.log('  ❌ No categories found!');
    } else {
      categories.forEach(cat => {
        console.log(`  ${cat.order_index}. ${cat.name}`);
      });
    }
    
    console.log(`\n✅ Total: ${categories.length} categories`);
    
    // Also check menu items count
    const menuCount = await db.collection('menu_items').countDocuments();
    console.log(`📦 Total menu items: ${menuCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkCategories();
