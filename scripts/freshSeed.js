import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function freshSeed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('lucullus');

    console.log('🗑️  Dropping existing collections...');
    try {
      await db.collection('menu_items').drop();
    } catch (e) {}
    try {
      await db.collection('categories').drop();
    } catch (e) {}
    try {
      await db.collection('promotions').drop();
    } catch (e) {}

    console.log('✨ Creating fresh collections...\n');

    // Create categories
    const categories = [
      { name: 'LES ENTRÉES', order_index: 1 },
      { name: 'LES PÂTES', order_index: 2 },
      { name: 'SÉLECTION CARNÉE', order_index: 3 },
      { name: 'DÉLICES MARINS', order_index: 4 },
      { name: 'LES DESSERTS', order_index: 5 },
      { name: 'LES VINS', order_index: 6 },
      { name: 'LES MOUSSEUX', order_index: 7 },
      { name: 'BIÈRES & SOFTS', order_index: 8 },
      { name: 'SPIRITUEUX', order_index: 9 },
      { name: 'LES COCKTAILS', order_index: 10 }
    ];

    const catResult = await db.collection('categories').insertMany(categories);
    const categoryMap = {};
    categories.forEach((cat, idx) => {
      categoryMap[cat.name] = catResult.insertedIds[idx];
    });
    console.log(`✅ ${categories.length} categories created`);

    // Menu items
    const menuItems = [
      // LES ENTRÉES (20)
      { categoryName: 'LES ENTRÉES', items: [
        { name: 'Huîtres', price: 6, description: 'pièce' },
        { name: 'Carpaccio de bœuf', price: 36, description: '' },
        { name: 'Salade César', price: 32, description: '' },
        { name: 'Brochette de viande hachée', price: 28, description: '' },
        { name: 'Chevrette sautées', price: 32, description: '' },
        { name: 'Croquettes de chevrette', price: 34, description: '' },
        { name: 'Seiche grillée', price: 34, description: '' },
        { name: 'Moules', price: 32, description: '' },
        { name: 'Ceviche', price: 36, description: 'spécialité froide' },
        { name: 'Bébés calamars grillés', price: 32, description: '' },
        { name: 'Camembert au four', price: 32, description: '' },
        { name: 'Calamars panés', price: 36, description: '' },
        { name: 'Coquillages', price: 40, description: '' },
        { name: 'Carpaccio de poulpe', price: 38, description: '' },
        { name: 'Bébés calamars farcis', price: 38, description: '' },
        { name: 'Salade fruits de mer', price: 42, description: '' },
        { name: 'Salade de poulpe', price: 42, description: '' },
        { name: 'Moules gratinées', price: 46, description: '' },
        { name: 'Assiette de saumon fumé', price: 49, description: '' },
        { name: 'Assiette de boutargue', price: 42, description: '' }
      ]},
      // LES PÂTES (8)
      { categoryName: 'LES PÂTES', items: [
        { name: 'Spaghetti puttanesca', price: 32, description: '' },
        { name: 'Spaghetti chevrette', price: 36, description: '' },
        { name: 'Spaghetti bolognaise', price: 36, description: 'boulettes' },
        { name: 'Alfredo', price: 38, description: '' },
        { name: 'Lasagne', price: 36, description: '' },
        { name: 'Ravioli ricotta', price: 38, description: '' },
        { name: 'Pâtes fruits de mer', price: 42, description: '' },
        { name: 'Penne arrabbiata', price: 32, description: '' }
      ]},
      // SÉLECTION CARNÉE (5)
      { categoryName: 'SÉLECTION CARNÉE', items: [
        { name: 'Steak frites', price: 48, description: '' },
        { name: 'Côte de veau', price: 58, description: '' },
        { name: 'Côtelette agneau', price: 52, description: '' },
        { name: 'Poulet grillé', price: 42, description: '' },
        { name: 'Brochette mixte', price: 46, description: '' }
      ]},
      // DÉLICES MARINS (3)
      { categoryName: 'DÉLICES MARINS', items: [
        { name: 'Loup grillé', price: 54, description: '' },
        { name: 'Rouget grillé', price: 52, description: '' },
        { name: 'Poulpe grillé', price: 48, description: '' }
      ]},
      // LES DESSERTS (4)
      { categoryName: 'LES DESSERTS', items: [
        { name: 'Tiramisu', price: 14, description: '' },
        { name: 'Crème brûlée', price: 12, description: '' },
        { name: 'Baklava', price: 10, description: '' },
        { name: 'Panna cotta', price: 12, description: '' }
      ]},
      // LES VINS (27)
      { categoryName: 'LES VINS', items: [
        { name: 'Château Margaux', price: 180, description: 'Bordeaux' },
        { name: 'Domaines des Eaux Vives', price: 42, description: 'Blanc' },
        { name: 'Saumur Champigny', price: 38, description: 'Rosé' },
        { name: 'Châteauneuf-du-Pape', price: 52, description: 'Rouge' },
        { name: 'Volnay', price: 68, description: 'Bourgogne' },
        { name: 'Condrieu', price: 58, description: 'Blanc' },
        { name: 'Hermitage', price: 62, description: 'Rouge' },
        { name: 'Saint-Julien', price: 56, description: 'Bordeaux' },
        { name: 'Pouilly-Fumé', price: 46, description: 'Blanc' },
        { name: 'Côtes-du-Rhône', price: 24, description: 'Rouge' },
        { name: 'Muscadet', price: 22, description: 'Blanc' },
        { name: 'Bandol', price: 36, description: 'Rosé' },
        { name: 'Savennières', price: 42, description: 'Blanc' },
        { name: 'Côte-Rôtie', price: 64, description: 'Rouge' },
        { name: 'Saint-Véran', price: 28, description: 'Blanc' },
        { name: 'Fleurie', price: 32, description: 'Rouge' },
        { name: 'Alsace Gewürztraminer', price: 38, description: 'Blanc' },
        { name: 'Loire Cabernet Franc', price: 34, description: 'Rouge' },
        { name: 'Touraine Gamay', price: 26, description: 'Rouge' },
        { name: 'Vouvray', price: 30, description: 'Blanc' },
        { name: 'Chinon', price: 28, description: 'Rouge' },
        { name: 'Riesling Alsace', price: 36, description: 'Blanc' },
        { name: 'Graves Blanc', price: 40, description: 'Bordeaux Blanc' },
        { name: 'Médoc', price: 44, description: 'Bordeaux' },
        { name: 'Pomerol', price: 72, description: 'Bordeaux' },
        { name: 'Saint-Emilion', price: 54, description: 'Bordeaux' },
        { name: 'Sauternes', price: 48, description: 'Blanc Sucré' }
      ]},
      // LES MOUSSEUX (3)
      { categoryName: 'LES MOUSSEUX', items: [
        { name: 'Champagne Veuve Clicquot', price: 78, description: '' },
        { name: 'Prosecco', price: 32, description: '' },
        { name: 'Crémant d\'Alsace', price: 28, description: '' }
      ]},
      // BIÈRES & SOFTS (11)
      { categoryName: 'BIÈRES & SOFTS', items: [
        { name: 'Stella Artois', price: 6, description: '' },
        { name: 'Heineken', price: 6, description: '' },
        { name: 'Aguila', price: 5, description: '' },
        { name: 'Kronenbourg', price: 6, description: '' },
        { name: 'Coca-Cola', price: 4, description: '' },
        { name: 'Fanta Orange', price: 4, description: '' },
        { name: 'Sprite', price: 4, description: '' },
        { name: 'Eau minérale', price: 3, description: '' },
        { name: 'Jus d\'orange', price: 5, description: '' },
        { name: 'Jus de citron', price: 5, description: '' },
        { name: 'Café', price: 3, description: '' }
      ]},
      // SPIRITUEUX (22)
      { categoryName: 'SPIRITUEUX', items: [
        { name: 'Whisky Johnnie Walker', price: 12, description: '' },
        { name: 'Cognac Hennessy', price: 16, description: '' },
        { name: 'Rhum Havana Club', price: 10, description: '' },
        { name: 'Vodka Smirnoff', price: 9, description: '' },
        { name: 'Gin Bombay Sapphire', price: 11, description: '' },
        { name: 'Armagnac', price: 14, description: '' },
        { name: 'Grand Marnier', price: 10, description: '' },
        { name: 'Pastis Ricard', price: 8, description: '' },
        { name: 'Ouzo grec', price: 8, description: '' },
        { name: 'Calvados', price: 10, description: '' },
        { name: 'Kirsch', price: 9, description: '' },
        { name: 'Amaretto', price: 8, description: '' },
        { name: 'Kahlua', price: 9, description: '' },
        { name: 'Chambord', price: 11, description: '' },
        { name: 'Chartreuse', price: 12, description: '' },
        { name: 'Baileys', price: 9, description: '' },
        { name: 'Cointreau', price: 10, description: '' },
        { name: 'Jägermeister', price: 8, description: '' },
        { name: 'Tequila', price: 9, description: '' },
        { name: 'Mezcal', price: 10, description: '' },
        { name: 'Pisco', price: 11, description: '' },
        { name: 'Arak', price: 9, description: '' }
      ]},
      // LES COCKTAILS (13)
      { categoryName: 'LES COCKTAILS', items: [
        { name: 'Mojito', price: 14, description: '' },
        { name: 'Margarita', price: 14, description: '' },
        { name: 'Piña Colada', price: 14, description: '' },
        { name: 'Cosmopolitan', price: 14, description: '' },
        { name: 'Daiquiri', price: 12, description: '' },
        { name: 'Caïpirinha', price: 13, description: '' },
        { name: 'Sangria', price: 12, description: '' },
        { name: 'Mai Tai', price: 14, description: '' },
        { name: 'Manhattan', price: 14, description: '' },
        { name: 'Negroni', price: 13, description: '' },
        { name: 'Whisky Sour', price: 13, description: '' },
        { name: 'Aperol Spritz', price: 12, description: '' },
        { name: 'B-52', price: 12, description: '' }
      ]}
    ];

    let totalItems = 0;
    for (const categoryData of menuItems) {
      const categoryId = categoryMap[categoryData.categoryName];
      const itemsForDb = categoryData.items.map(item => ({
        category_id: categoryId,
        name: item.name,
        description: item.description || '',
        price: item.price,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await db.collection('menu_items').insertMany(itemsForDb);
      totalItems += itemsForDb.length;
      console.log(`✅ ${categoryData.items.length} items for ${categoryData.categoryName}`);
    }

    console.log(`\n✨ Successfully seeded database with ${totalItems} menu items!`);

    // Create indexes
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
    await db.collection('menu_items').createIndex({ category_id: 1 });
    await db.collection('promotions').createIndex({ is_active: 1 });

    console.log('✅ Indexes created\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

freshSeed();
