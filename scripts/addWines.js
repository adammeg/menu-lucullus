import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodb.js';

dotenv.config({ path: '.env.local' });

const vinsRouges = [
  { name: "Gorilla", price: 56 },
  { name: "Magon Rouge", price: 60 },
  { name: "Shadrapa", price: 62 },
  { name: "Selian", price: 65 },
  { name: "Magon Signature", price: 65 },
  { name: "Jour et Nuit Rouge", price: 70 },
  { name: "Magnifique", price: 78 },
  { name: "Selian Réserve", price: 86 },
  { name: "Sultan Rouge", price: 86 },
  { name: "Vieux Magnifique", price: 95 }
];

const vinsRoses = [
  { name: "Drink pink", price: 56 },
  { name: "Magon Rosé", price: 60 },
  { name: "Désir", price: 62 },
  { name: "Selian", price: 65 },
  { name: "Jour et Nuit Rosé", price: 70 },
  { name: "Gioia", price: 78 },
  { name: "Magnifique", price: 78 },
  { name: "Sultan Rosé", price: 86 },
  { name: "Selian Réserve", price: 86 }
];

const vinsBlancs = [
  { name: "The Madcat", price: 56 },
  { name: "The great white", price: 58 },
  { name: "Magon Blanc", price: 60 },
  { name: "Selian Blanc", price: 65 },
  { name: "Chardonnay", price: 65 },
  { name: "Muscat", price: 68 },
  { name: "Jour et Nuit Blanc", price: 70 },
  { name: "Magnifique Blanc", price: 78 },
  { name: "Sultan Blanc", price: 86 },
  { name: "Verdejo", price: 86 }
];

async function addCategory(categoryName, items) {
  try {
    const { db } = await connectToDatabase();
    const category = await db.collection('categories').findOne({ name: categoryName });
    
    if (!category) {
      console.error(`❌ ${categoryName} not found`);
      return 0;
    }

    const menuItems = items.map(item => ({
      category_id: category._id,
      category_name: categoryName,
      name: item.name,
      price: item.price,
      unit: 'bouteille',
      image: '',
      description: '',
      available: true,
      created_at: new Date(),
      updated_at: new Date()
    }));

    const result = await db.collection('menu').insertMany(menuItems);
    console.log(`✅ Added ${result.insertedCount} ${categoryName} items`);
    return result.insertedCount;
  } catch (error) {
    console.error(`❌ Error adding ${categoryName}:`, error.message);
    return 0;
  }
}

async function addAll() {
  try {
    console.log('📝 Adding Wines (Vins rouges, rosés, blancs)...\n');
    
    await addCategory('Vins rouges', vinsRouges);
    await addCategory('Vins rosés', vinsRoses);
    await addCategory('Vins blancs', vinsBlancs);
    
    console.log('\n✅ All wine items added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addAll();
