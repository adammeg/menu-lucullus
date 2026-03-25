import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodb.js';

dotenv.config({ path: '.env.local' });

const viandes = [
  { name: "Escalope à la crème", price: 36 },
  { name: "Escalope milanaise", price: 38 },
  { name: "Émincé de bœuf", price: 42 },
  { name: "Filet (sauce au choix)", price: 59 },
  { name: "Souris d'agneau", price: 69 }
];

const poissons = [
  { name: "Poissant grillé (loup / daurade)", price: 52 },
  { name: "Quadrio de crevettes", price: 56 },
  { name: "Filet de daurade farci au saumon fumé", price: 64 }
];

const desserts = [
  { name: "Sorbet citron", price: 14 },
  { name: "Fondant au chocolat", price: 20 },
  { name: "Tiramisu", price: 22 },
  { name: "Assiette de fruits de saison", price: 40 }
];

async function addCategory(categoryName, items) {
  try {
    const { db } = await connectToDatabase();
    const category = await db.collection('categories').findOne({ name: categoryName });
    
    if (!category) {
      console.error(`❌ ${categoryName} category not found`);
      return 0;
    }

    const menuItems = items.map(item => ({
      category_id: category._id,
      category_name: categoryName,
      name: item.name,
      price: item.price,
      unit: 'portion',
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
    console.log('📝 Adding Viandes, Poissons, Desserts...\n');
    
    await addCategory('Viandes', viandes);
    await addCategory('Poissons', poissons);
    await addCategory('Desserts', desserts);
    
    console.log('\n✅ All items added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addAll();
