import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

dotenv.config({ path: '.env.local' });

const entreesData = [
  { name: "Huîtres", price: 6, unit: "pièce" },
  { name: "Carpaccio de bœuf", price: 36 },
  { name: "Salade César", price: 32 },
  { name: "Brochette de viande hachée", price: 28 },
  { name: "Chevrette sautées", price: 32 },
  { name: "Croquettes de chevrette", price: 34 },
  { name: "Seiche grillée", price: 34 },
  { name: "Moules", price: 32 },
  { name: "Ceviche / spécialité froide", price: 36 },
  { name: "Bébés calamars grillés", price: 32 },
  { name: "Camembert au four", price: 32 },
  { name: "Calamars panés", price: 36 },
  { name: "Coquillages", price: 40 },
  { name: "Carpaccio de poulpe", price: 38 },
  { name: "Bébés calamars farcis", price: 38 },
  { name: "Salade fruits de mer", price: 42 },
  { name: "Salade de poulpe", price: 42 },
  { name: "Moules gratinées", price: 46 },
  { name: "Assiette de saumon fumé", price: 49 },
  { name: "Assiette de boutargue", price: 42 }
];

async function addEntrees() {
  try {
    const { db } = await connectToDatabase();
    
    // Get Entrées category ID
    const entreesCategory = await db.collection('categories').findOne({ name: 'Entrées' });
    
    if (!entreesCategory) {
      console.error('❌ Entrées category not found');
      process.exit(1);
    }

    console.log('📝 Adding Entrées items...');
    
    // Prepare menu items
    const menuItems = entreesData.map(item => ({
      category_id: entreesCategory._id,
      category_name: 'Entrées',
      name: item.name,
      price: item.price,
      unit: item.unit || 'portion',
      image: '',
      description: '',
      available: true,
      created_at: new Date(),
      updated_at: new Date()
    }));

    // Insert items
    const result = await db.collection('menu').insertMany(menuItems);
    
    console.log(`✅ Added ${result.insertedCount} Entrées items successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding items:', error.message);
    process.exit(1);
  }
}

addEntrees();
