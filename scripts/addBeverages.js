import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodb.js';

dotenv.config({ path: '.env.local' });

const mousseux = [
  { name: "Kiss blanc / rosé", price: 96 },
  { name: "Trocadéro", price: 110 }
];

const softs = [
  { name: "Eau plate / Gazéifiée", price: 6 },
  { name: "Café", price: 6 },
  { name: "Soda", price: 8 },
  { name: "Boisson énergétique", price: 14 }
];

const bieres = [
  { name: "Celtia", price: 8 },
  { name: "Amstel", price: 8 },
  { name: "Beck's", price: 9 },
  { name: "Heineken", price: 9 },
  { name: "Shop 50cl Celtia", price: 8 },
  { name: "Shop 50cl Heineken", price: 8 }
];

const aperitifs = [
  { name: "Pastis", price: 18 },
  { name: "Jet 27", price: 18 },
  { name: "Limoncello", price: 18 },
  { name: "Thibar", price: 16 },
  { name: "Martini Bianco", price: 20 },
  { name: "Martini Rosso", price: 20 },
  { name: "Cognac", price: 26 }
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
      unit: 'verre',
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
    console.log('📝 Adding Beverages...\n');
    
    await addCategory('Les Mousseux', mousseux);
    await addCategory('Les Softs', softs);
    await addCategory('Les Biéres', bieres);
    await addCategory('Les Apéritif et Digestif', aperitifs);
    
    console.log('\n✅ All beverage items added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addAll();
