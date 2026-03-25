import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodb.js';

dotenv.config({ path: '.env.local' });

const cocktails = [
  { name: "Purple camel", recipe: "tequila, crème de, triple sec, citron, géranium", price: 25 },
  { name: "Mermaid call", recipe: "whisky, blue curacao, orange, citron", price: 25 },
  { name: "Amaretto sour", recipe: "amaretto, citron", price: 25 },
  { name: "Greenbean", recipe: "vodka, menthe, concombre, pomme, citron", price: 25 },
  { name: "Smurf daddy", recipe: "vodka, blue curacao, redbull, citron, fraise", price: 25 },
  { name: "Mojito", recipe: "Gin Hendricks, citron, brown sugar, menthe, sprite", price: 25 },
  { name: "Honeywater", recipe: "whisky, orange, amaretto, miel, citron, cannelle", price: 25 },
  { name: "Vulvet underground", recipe: "gin, rhum, orange, citron", price: 25 },
  { name: "Bluebrumble", recipe: "tequila, cassis, blueberry, citron, ananas", price: 25 },
  { name: "Mexican grape", recipe: "tequila bianca, tequila reposado, triple sec, raisin", price: 25 }
];

async function addCocktails() {
  try {
    const { db } = await connectToDatabase();
    const category = await db.collection('categories').findOne({ name: 'Côté Bar' });
    
    if (!category) {
      console.error('❌ Côté Bar category not found');
      process.exit(1);
    }

    console.log('📝 Adding Côté Bar cocktails...');
    
    const menuItems = cocktails.map(item => ({
      category_id: category._id,
      category_name: 'Côté Bar',
      name: item.name,
      price: item.price,
      unit: 'verre',
      image: '',
      description: item.recipe,
      available: true,
      created_at: new Date(),
      updated_at: new Date()
    }));

    const result = await db.collection('menu').insertMany(menuItems);
    console.log(`✅ Added ${result.insertedCount} cocktails successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding cocktails:', error.message);
    process.exit(1);
  }
}

addCocktails();
