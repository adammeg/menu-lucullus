const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// Database initialization
const dbPath = path.join(__dirname, 'lucullus.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create menu categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      order_index INTEGER DEFAULT 0
    )`);

    // Create menu items table
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);

    // Create promotions/reductions table
    db.run(`CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      category_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      discount_percent REAL NOT NULL,
      discount_amount REAL,
      image_url TEXT,
      start_date DATETIME,
      end_date DATETIME,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES menu_items(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);

    // Add image_url column if it doesn't exist (migration for existing databases)
    db.run(`PRAGMA table_info(promotions)`, [], (err, columns) => {
      if (columns && !columns.find(col => col.name === 'image_url')) {
        db.run(`ALTER TABLE promotions ADD COLUMN image_url TEXT`);
      }
    });

    // Insert default categories if not exist
    const categories = [
      { name: 'LES ENTRÉES', order_index: 1 },
      { name: 'SÉLECTION CARNÉE', order_index: 2 },
      { name: 'DÉLICES MARINS', order_index: 3 },
      { name: 'LES PÂTES', order_index: 4 },
      { name: 'À PARTAGER', order_index: 5 },
      { name: 'LES DESSERTS', order_index: 6 },
      { name: 'LES VINS', order_index: 7 },
      { name: 'BIÈRES & SOFTS', order_index: 8 },
      { name: 'SPIRITUEUX', order_index: 9 },
      { name: 'LES COCKTAILS', order_index: 10 }
    ];

    categories.forEach(cat => {
      db.run(`INSERT OR IGNORE INTO categories (name, order_index) VALUES (?, ?)`, 
        [cat.name, cat.order_index]);
    });

    console.log('Database tables initialized');
  });
}

// Routes - Get all menu items with categories
app.get('/api/menu', (req, res) => {
  db.all(`
    SELECT m.*, c.name as category_name FROM menu_items m
    JOIN categories c ON m.category_id = c.id
    ORDER BY c.order_index, m.id
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Group by category
    const groupedMenu = {};
    rows.forEach(item => {
      if (!groupedMenu[item.category_name]) {
        groupedMenu[item.category_name] = [];
      }
      groupedMenu[item.category_name].push(item);
    });
    
    res.json(groupedMenu);
  });
});

// Get categories
app.get('/api/categories', (req, res) => {
  db.all(`SELECT * FROM categories ORDER BY order_index`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get menu items by category
app.get('/api/menu/category/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  db.all(`SELECT * FROM menu_items WHERE category_id = ? ORDER BY id`, 
    [categoryId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get active promotions
app.get('/api/promotions', (req, res) => {
  const now = new Date().toISOString();
  db.all(`
    SELECT p.*, m.name as item_name, m.price FROM promotions p
    LEFT JOIN menu_items m ON p.item_id = m.id
    WHERE p.is_active = 1 
    AND (p.start_date IS NULL OR p.start_date <= ?)
    AND (p.end_date IS NULL OR p.end_date >= ?)
    ORDER BY p.created_at DESC
  `, [now, now], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add menu item (Admin)
app.post('/api/admin/menu-items', (req, res) => {
  const { category_id, name, description, price, image_url } = req.body;
  
  if (!category_id || !name || !price) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  db.run(`
    INSERT INTO menu_items (category_id, name, description, price, image_url)
    VALUES (?, ?, ?, ?, ?)
  `, [category_id, name, description, price, image_url], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, category_id, name, description, price, image_url });
  });
});

// Update menu item (Admin)
app.put('/api/admin/menu-items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;
  
  db.run(`
    UPDATE menu_items 
    SET name = ?, description = ?, price = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [name, description, price, category_id, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, changes: this.changes });
  });
});

// Delete menu item (Admin)
app.delete('/api/admin/menu-items/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM menu_items WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, changes: this.changes });
  });
});

// Add promotion (Admin)
app.post('/api/admin/promotions', (req, res) => {
  try {
    const { item_id, category_id, title, description, discount_percent, discount_amount, start_date, end_date, image_url } = req.body;
    
    if (!title || (!discount_percent && !discount_amount)) {
      res.status(400).json({ error: 'Missing required fields: title and discount are required' });
      return;
    }
    
    db.run(`
      INSERT INTO promotions (item_id, category_id, title, description, discount_percent, discount_amount, start_date, end_date, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [item_id || null, category_id || null, title, description || null, discount_percent || null, discount_amount || null, start_date || null, end_date || null, image_url || null], function(err) {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: `Database error: ${err.message}` });
        return;
      }
      res.json({ 
        id: this.lastID, 
        item_id, 
        category_id, 
        title, 
        description, 
        discount_percent, 
        discount_amount,
        start_date,
        end_date,
        image_url: image_url ? 'Image stored' : null
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

// Update promotion (Admin)
app.put('/api/admin/promotions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discount_percent, discount_amount, start_date, end_date, is_active, image_url } = req.body;
    
    db.run(`
      UPDATE promotions 
      SET title = ?, description = ?, discount_percent = ?, discount_amount = ?, 
          start_date = ?, end_date = ?, is_active = ?, image_url = ?
      WHERE id = ?
    `, [title, description || null, discount_percent || null, discount_amount || null, start_date || null, end_date || null, is_active !== undefined ? is_active : 1, image_url || null, id], function(err) {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: `Database error: ${err.message}` });
        return;
      }
      res.json({ success: true, changes: this.changes });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

// Delete promotion (Admin)
app.delete('/api/admin/promotions/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM promotions WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, changes: this.changes });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Database close error:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
