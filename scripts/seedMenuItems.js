import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lucullus';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('lucullus');

    console.log('🌱 Starting database seed...\n');

    // Get categories
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find({}).toArray();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Menu items grouped by category
    const menuData = {
      'LES ENTRÉES': [
        { name: 'Huîtres', price: 6, description: 'pièce' },
        { name: 'Carpaccio de bœuf', price: 36 },
        { name: 'Salade César', price: 32 },
        { name: 'Brochette de viande hachée', price: 28 },
        { name: 'Chevrette sautées', price: 32 },
        { name: 'Croquettes de chevrette', price: 34 },
        { name: 'Seiche grillée', price: 34 },
        { name: 'Moules', price: 32 },
        { name: 'Ceviche', price: 36, description: 'spécialité froide' },
        { name: 'Bébés calamars grillés', price: 32 },
        { name: 'Camembert au four', price: 32 },
        { name: 'Calamars panés', price: 36 },
        { name: 'Coquillages', price: 40 },
        { name: 'Carpaccio de poulpe', price: 38 },
        { name: 'Bébés calamars farcis', price: 38 },
        { name: 'Salade fruits de mer', price: 42 },
        { name: 'Salade de poulpe', price: 42 },
        { name: 'Moules gratinées', price: 46 },
        { name: 'Assiette de saumon fumé', price: 49 },
        { name: 'Assiette de boutargue', price: 42 }
      ],
      'LES PÂTES': [
        { name: 'Spaghetti puttanesca', price: 32 },
        { name: 'Spaghetti chevrette', price: 36 },
        { name: 'Spaghetti bolognaise', price: 36, description: 'boulettes' },
        { name: 'Alfredo', price: 38 },
        { name: 'Penne 4 fromages', price: 40 },
        { name: 'Tagliatelle saumon fumé', price: 44 },
        { name: 'Spaghetti boutargue', price: 44 },
        { name: 'Spaghetti fruits de mer', price: 46 }
      ],
      'SÉLECTION CARNÉE': [
        { name: 'Escalope à la crème', price: 36 },
        { name: 'Escalope milanaise', price: 38 },
        { name: 'Émincé de bœuf', price: 42 },
        { name: 'Filet', price: 59, description: 'sauce au choix' },
        { name: 'Souris d\'agneau', price: 69 }
      ],
      'DÉLICES MARINS': [
        { name: 'Poisson grillé', price: 52, description: 'loup / daurade' },
        { name: 'Quadrio de crevettes', price: 56 },
        { name: 'Filet de daurade farci au saumon fumé', price: 64 }
      ],
      'LES DESSERTS': [
        { name: 'Sorbet citron', price: 14 },
        { name: 'Fondant au chocolat', price: 20 },
        { name: 'Tiramisu', price: 22 },
        { name: 'Assiette de fruits de saison', price: 40 }
      ],
      'LES VINS': [
        { name: 'Gorilla', price: 56 },
        { name: 'Magon Rouge', price: 60 },
        { name: 'Shadrapa', price: 62 },
        { name: 'Selian', price: 65 },
        { name: 'Magon Signature', price: 65 },
        { name: 'Jour et Nuit Rouge', price: 70 },
        { name: 'Magnifique', price: 78 },
        { name: 'Selian Réserve', price: 86 },
        { name: 'Sultan Rouge', price: 86 },
        { name: 'Vieux Magnifique', price: 95 },
        { name: 'Drink pink', price: 56, description: 'Vin rosé' },
        { name: 'Magon Rosé', price: 60, description: 'Vin rosé' },
        { name: 'Désir', price: 62, description: 'Vin rosé' },
        { name: 'Jour et Nuit Rosé', price: 70, description: 'Vin rosé' },
        { name: 'Gioia', price: 78, description: 'Vin rosé' },
        { name: 'Sultan Rosé', price: 86, description: 'Vin rosé' },
        { name: 'The Madcat', price: 56, description: 'Vin blanc' },
        { name: 'The great white', price: 58, description: 'Vin blanc' },
        { name: 'Magon Blanc', price: 60, description: 'Vin blanc' },
        { name: 'Selian Blanc', price: 65, description: 'Vin blanc' },
        { name: 'Chardonnay', price: 65, description: 'Vin blanc' },
        { name: 'Muscat', price: 68, description: 'Vin blanc' },
        { name: 'Jour et Nuit Blanc', price: 70, description: 'Vin blanc' },
        { name: 'Magnifique Blanc', price: 78, description: 'Vin blanc' },
        { name: 'Sultan Blanc', price: 86, description: 'Vin blanc' },
        { name: 'Verdejo', price: 86, description: 'Vin blanc' }
      ],
      'LES MOUSSEUX': [
        { name: 'Kiss blanc', price: 96 },
        { name: 'Kiss rosé', price: 96 },
        { name: 'Trocadéro', price: 110 }
      ],
      'BIÈRES & SOFTS': [
        { name: 'Eau plate', price: 6 },
        { name: 'Eau gazeifiée', price: 6 },
        { name: 'Café', price: 6 },
        { name: 'Soda', price: 8 },
        { name: 'Boisson énergétique', price: 14 },
        { name: 'Celtia', price: 5.5, description: 'Happy hour (jusqu\'à 19h)' },
        { name: 'Amstel', price: 8 },
        { name: 'Beck\'s', price: 6.5, description: 'Happy hour (jusqu\'à 19h)' },
        { name: 'Heineken', price: 9 },
        { name: 'Celtia 50cl', price: 8, description: 'Happy hour (jusqu\'à 19h)' },
        { name: 'Heineken 50cl', price: 8, description: 'Happy hour (jusqu\'à 19h)' }
      ],
      'SPIRITUEUX': [
        { name: 'Pastis', price: 18 },
        { name: 'Jet 27', price: 18 },
        { name: 'Limoncello', price: 18 },
        { name: 'Thibar', price: 16 },
        { name: 'Martini Bianco', price: 20 },
        { name: 'Martini Rosso', price: 20 },
        { name: 'Cognac', price: 26 },
        { name: 'Vodka Danska', price: 18, description: 'Dose' },
        { name: 'Vodka Absolut', price: 20, description: 'Dose' },
        { name: 'Vodka Grey Goose', price: 24, description: 'Dose' },
        { name: 'Grants', price: 18, description: 'Dose' },
        { name: 'JB', price: 18, description: 'Dose' },
        { name: 'JW Red Label', price: 20, description: 'Dose' },
        { name: 'JW Black Label', price: 25, description: 'Dose' },
        { name: 'JW Double Black', price: 28, description: 'Dose' },
        { name: 'Chivas Regal', price: 25, description: 'Dose' },
        { name: 'Jack Daniel\'s', price: 25, description: 'Dose' },
        { name: 'Jack Daniel\'s Honey', price: 25, description: 'Dose' },
        { name: 'Gin Gordon\'s', price: 20, description: 'Dose' },
        { name: 'Gin Hendrick\'s', price: 24, description: 'Dose' },
        { name: 'Champagne Francais', price: 600 },
        { name: 'Moet et Chandon', price: 700 }
      ],
      'LES COCKTAILS': [
        { name: 'Purple camel', price: 25, description: 'tequila, creme de, triple sec, citron, geranium' },
        { name: 'Mermaid call', price: 25, description: 'whisky, blue curacao, orange, citron' },
        { name: 'Amaretto sour', price: 25, description: 'amaretto, citron' },
        { name: 'Greenbean', price: 25, description: 'vodka, menthe, concombre, pomme, citron' },
        { name: 'Smurf daddy', price: 25, description: 'vodka, blue curacao, redbull, citron, fraise' },
        { name: 'Mojito', price: 25, description: 'Gin hendricks, Citron, Brown sugar, menthe, sprite' },
        { name: 'Honeywater', price: 25, description: 'whiskey, orange, amaretto, miel, citron, canelle' },
        { name: 'Vulvet underground', price: 25, description: 'gin, rhum, orange, citron' },
        { name: 'Bluebrumble', price: 25, description: 'tequila, cassis, blueberry, citron, ananas' },
        { name: 'Mexican grape', price: 25, description: 'tequilla bianca, tequilla reposado, triple sec, raisin' },
        { name: 'Jagermeister shots', price: 20 },
        { name: 'Tequila shots', price: 18 },
        { name: 'B52 shots', price: 18, description: 'Crème de café, Bailys, Triple sec' }
      ]
    };

    // Clear existing menu items
    const menuCollection = db.collection('menu_items');
    await menuCollection.deleteMany({});
    console.log('✓ Cleared existing menu items\n');

    // Seed menu items
    let totalInserted = 0;
    for (const [categoryName, items] of Object.entries(menuData)) {
      const categoryId = categoryMap[categoryName];

      if (!categoryId) {
        console.log(`⚠️ Category not found: ${categoryName}`);
        continue;
      }

      const itemsToInsert = items.map(item => ({
        category_id: categoryId,
        name: item.name,
        price: item.price,
        description: item.description || null,
        image_url: null,
        created_at: new Date(),
        updated_at: new Date()
      }));

      const result = await menuCollection.insertMany(itemsToInsert);
      console.log(`✓ ${categoryName}: ${result.insertedIds.length} items added`);
      totalInserted += result.insertedIds.length;
    }

    console.log(`\n✅ Successfully added ${totalInserted} menu items to the database!`);
    console.log('\n📊 Summary:');
    console.log('  - Entrées: 20 items');
    console.log('  - Pâtes: 8 items');
    console.log('  - Viandes: 5 items');
    console.log('  - Poissons: 3 items');
    console.log('  - Desserts: 4 items');
    console.log('  - Vins (includes rosé & blanc): 27 items');
    console.log('  - Mousseux: 3 items');
    console.log('  - Bières & Softs: 11 items');
    console.log('  - Spiritueux: 22 items');
    console.log('  - Cocktails: 13 items');
    console.log(`  ────────────────────\n  Total: ${totalInserted} items`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the seed
seedDatabase();
