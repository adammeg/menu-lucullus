import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodb.js';

dotenv.config({ path: '.env.local' });

const liqueurs = [
  { name: "Vodka Danska", price: 18, description: "Dose: 18 DT | ½ Bouteille: 220 DT | Bouteille: 340 DT" },
  { name: "Vodka Absolut", price: 20, description: "Dose: 20 DT | ½ Bouteille: 240 DT | Bouteille: 380 DT" },
  { name: "Vodka Grey Goose", price: 24, description: "Dose: 24 DT | ½ Bouteille: 280 DT | Bouteille: 540 DT" },
  { name: "GRANTS", price: 18, description: "Dose: 18 DT | ½ Bouteille: 200 DT | Bouteille: 340 DT" },
  { name: "JB", price: 18, description: "Dose: 18 DT | ½ Bouteille: 200 DT | Bouteille: 340 DT" },
  { name: "JW Red Label", price: 20, description: "Dose: 20 DT | ½ Bouteille: 240 DT | Bouteille: 380 DT" },
  { name: "JW Black Label", price: 25, description: "Dose: 25 DT | ½ Bouteille: 280 DT | Bouteille: 540 DT" },
  { name: "JW Double Black", price: 28, description: "Dose: 28 DT | ½ Bouteille: 380 DT | Bouteille: 680 DT" },
  { name: "Chivas Regal", price: 25, description: "Dose: 25 DT | ½ Bouteille: 300 DT | Bouteille: 560 DT" },
  { name: "Jack Daniel's", price: 25, description: "Dose: 25 DT | ½ Bouteille: 260 DT | Bouteille: 540 DT" },
  { name: "Jack Daniel's Honey", price: 25, description: "Dose: 25 DT | ½ Bouteille: 270 DT | Bouteille: 560 DT" },
  { name: "Gin Gordon's", price: 20, description: "Dose: 20 DT | ½ Bouteille: 180 DT | Bouteille: 360 DT" },
  { name: "Gin Hendrick's", price: 24, description: "Dose: 24 DT | ½ Bouteille: 240 DT | Bouteille: 480 DT" }
];

const champagnes = [
  { name: "Champagne Francais", price: 600 },
  { name: "Moet et Chandon", price: 700 }
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
      unit: 'dose',
      image: '',
      description: item.description || '',
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
    console.log('📝 Adding Liqueurs and Champagnes...\n');
    
    await addCategory('Les Liquers', liqueurs);
    await addCategory('Les Champagnes', champagnes);
    
    console.log('\n✅ All liqueur and champagne items added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addAll();
