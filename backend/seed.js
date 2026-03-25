// Seed sample data into the database
// Run this with: node seed.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'lucullus.db');
const db = new sqlite3.Database(dbPath);

const sampleItems = [
  // LES ENTRÉES (Category 1)
  { category_id: 1, name: 'Salade César Poulet', description: 'Salade fraîche avec poulet', price: 36 },
  { category_id: 1, name: 'Carpaccio de Bœuf', description: 'Viande crue finement tranchée', price: 38 },
  { category_id: 1, name: 'Crevettes Panko', description: 'Crevettes panées croustillantes', price: 42 },
  { category_id: 1, name: 'Moules Marinées', description: 'Moules fraîches marinées', price: 32 },
  
  // SÉLECTION CARNÉE (Category 2)
  { category_id: 2, name: 'Suprême de Poulet', description: 'Poulet aux champignons', price: 38 },
  { category_id: 2, name: 'Émincé de Bœuf', description: 'Bœuf tendre sauce à la crème', price: 42 },
  { category_id: 2, name: 'Filet de Bœuf', description: 'Filet premium avec sauce gorgonzola', price: 65 },
  { category_id: 2, name: 'Souris d\'Agneau', description: 'Agneau rôti à la perfection', price: 56 },
  
  // DÉLICES MARINS (Category 3)
  { category_id: 3, name: 'Duo de Loup', description: 'Poisson frais de la mer', price: 40 },
  { category_id: 3, name: 'Dorade Farcie', description: 'Dorade farcie aux herbes', price: 42 },
  { category_id: 3, name: 'Poulpe à la Plancha', description: 'Poulpe grillé à la perfection', price: 48 },
  { category_id: 3, name: 'Calamar Farci', description: 'Calmar farci maison', price: 44 },
  
  // LES PÂTES (Category 4)
  { category_id: 4, name: 'Raviolis Crevettes', description: 'Pâtes farcies aux crevettes', price: 40 },
  { category_id: 4, name: 'Penne Alfredo', description: 'Pâtes à la crème fraîche', price: 36 },
  { category_id: 4, name: 'Linguine Crevettes', description: 'Pâtes avec crevettes', price: 46 },
  { category_id: 4, name: 'Risotto Parmesan', description: 'Risotto au fromage', price: 38 },
  
  // À PARTAGER (Category 5)
  { category_id: 5, name: 'Planche Fromage', description: 'Sélection de fromages fins', price: 42 },
  { category_id: 5, name: 'Duo Charcuterie et Fromage', description: 'Assortiment premium', price: 56 },
  { category_id: 5, name: 'Tapas Mixte 2pax', description: 'Assortiment espagnol', price: 94 },
  
  // LES DESSERTS (Category 6)
  { category_id: 6, name: 'Fondant au Chocolat', description: 'Fondant riche au chocolat', price: 18 },
  { category_id: 6, name: 'Tiramisu', description: 'Tiramisu classique italien', price: 18 },
  { category_id: 6, name: 'Sorbet Citron', description: 'Sorbet frais au citron', price: 14 },
  
  // LES VINS (Category 7)
  { category_id: 7, name: 'Magnifique Rouge', description: 'Vin rouge sélectionné', price: 76 },
  { category_id: 7, name: 'Magon Blanc', description: 'Vin blanc fruité', price: 58 },
  
  // BIÈRES & SOFTS (Category 8)
  { category_id: 8, name: 'Celtia Pression', description: 'Bière fraîche du midi à 20h', price: 6 },
  { category_id: 8, name: 'Coca Cola', description: 'Boisson gazeuse', price: 8 },
  { category_id: 8, name: 'Eau Fraîche', description: 'Eau plate ou gazeifiée', price: 6 },
  
  // SPIRITUEUX (Category 9)
  { category_id: 9, name: 'Vodka Smirnoff', description: 'Vodka premium', price: 16 },
  { category_id: 9, name: 'Rum Havana', description: 'Rhum vieilli', price: 20 },
  
  // LES COCKTAILS (Category 10)
  { category_id: 10, name: 'Mojito', description: 'Classique des cocktails', price: 18 },
  { category_id: 10, name: 'Piña Colada', description: 'Tropical et sucré', price: 18 },
  { category_id: 10, name: 'Espresso Martini', description: 'Café et vodka', price: 22 },
];

const samplePromotions = [
  {
    item_id: null,
    category_id: 1,
    title: '🎉 Promotion Entrées',
    description: 'Réduction sur toutes les entrées',
    discount_percent: 20,
    discount_amount: null,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: 1
  },
  {
    item_id: null,
    category_id: 10,
    title: '🍹 Happy Hour Cocktails',
    description: 'Tous les cocktails en promotion',
    discount_percent: 25,
    discount_amount: null,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: 1
  }
];

db.serialize(() => {
  console.log('Seeding sample data...');
  
  // Add menu items
  sampleItems.forEach(item => {
    db.run(
      `INSERT INTO menu_items (category_id, name, description, price)
       VALUES (?, ?, ?, ?)`,
      [item.category_id, item.name, item.description, item.price],
      function(err) {
        if (err) console.log('Item error:', err);
      }
    );
  });
  
  // Add promotions
  samplePromotions.forEach(promo => {
    db.run(
      `INSERT INTO promotions (item_id, category_id, title, description, discount_percent, discount_amount, start_date, end_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [promo.item_id, promo.category_id, promo.title, promo.description, promo.discount_percent, promo.discount_amount, promo.start_date, promo.end_date, promo.is_active],
      function(err) {
        if (err) console.log('Promotion error:', err);
      }
    );
  });
  
  setTimeout(() => {
    console.log('✅ Sample data seeded successfully!');
    console.log(`   - ${sampleItems.length} menu items added`);
    console.log(`   - ${samplePromotions.length} promotions added`);
    db.close();
  }, 500);
});
