import dotenv from 'dotenv';
import { connectToDatabase } from './lib/mongodb.js';

dotenv.config({ path: '.env.local' });

async function verify() {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection('menu').countDocuments({ category_name: 'Pâtes' });
    console.log(`📊 Total Pâtes items: ${count}`);
    
    const items = await db.collection('menu').find({ category_name: 'Pâtes' }).toArray();
    console.log('\n📋 All Pâtes items:');
    items.forEach(item => {
      console.log(`   - ${item.name}: ${item.price} DT`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verify();
