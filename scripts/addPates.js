import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodb.js';

dotenv.config({ path: '.env.local' });

const patesData = [
  { name: "Spaghetti puttanesca", price: 32 },
  { name: "Spaghetti chevrette", price: 36 },
  { name: "Spaghetti bolognaise / boulettes", price: 36 },
  { name: "Alfredo", price: 38 },
  { name: "Penne 4 fromages", price: 40 },
  { name: "Tagliatelle saumon fumé", price: 44 },
  { name: "Spaghetti boutargue", price: 44 },
  { name: "Spaghetti fruits de mer", price: 46 }
];

async function addPates() {
  try {
    const { db } = await connectToDatabase();
    
    // Get Pâtes category ID
    const patesCategory = await db.collection('categories').findOne({ name: 'Pâtes' });
    
    if (!patesCategory) {
      console.error('❌ Pâtes category not found');
      process.exit(1);
    }

    console.log('📝 Adding Pâtes items...');
    
    // Prepare menu items
    const menuItems = patesData.map(item => ({
      category_id: patesCategory._id,
      category_name: 'Pâtes',
      name: item.name,
      price: item.price,
      unit: 'portion',
      image: '',
      description: '',
      available: true,
      created_at: new Date(),
      updated_at: new Date()
    }));

    // Insert items
    const result = await db.collection('menu').insertMany(menuItems);
    
    console.log(`✅ Added ${result.insertedCount} Pâtes items successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding items:', error.message);
    process.exit(1);
  }
}

addPates();
