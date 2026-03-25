# Lucullus Restaurant Menu - Vercel Production Setup

Modern, production-ready restaurant menu application built with **Next.js**, **MongoDB**, and **Vercel serverless functions**.

## 🏗️ Architecture

```
lucullus-menu/
├── pages/                      # Next.js pages and API routes
│   ├── api/                   # Serverless API endpoints
│   │   ├── menu/
│   │   ├── categories/
│   │   └── promotions/
│   ├── index.js              # Menu page
│   └── admin.js              # Admin dashboard
├── lib/
│   └── mongodb.js            # Database connection & setup
├── styles/                    # CSS modules
│   ├── Home.module.css
│   └── Admin.module.css
├── next.config.js            # Next.js configuration
├── vercel.json               # Vercel deployment config
└── .env.example              # Environment variables template
```

## 🚀 Quick Start

### Local Development

1. **Clone and install:**
   ```bash
   npm install
   ```

2. **Create `.env.local`:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add MongoDB Connection:**
   - Create free cluster at https://www.mongodb.com/cloud/atlas
   - Copy connection string to `MONGODB_URI` in `.env.local`
   - Add your admin password to `ADMIN_PASSWORD`

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Visit:**
   - Menu: http://localhost:3000/
   - Admin: http://localhost:3000/admin

### Deploy to Vercel

1. **Push to GitHub** (create a repo if you don't have one):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/lucullus-menu.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Select your GitHub repo
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `ADMIN_PASSWORD`: Your admin panel password

3. **Deploy:**
   - Click "Deploy"
   - Your site will be live in ~1 minute!

## 📋 Features

✅ **Restaurant Menu**
- Organized by categories (10 default categories)
- Item name, description, and price
- Responsive design

✅ **Promotional System**
- Upload poster images (auto-compressed)
- Set discount % or fixed amount
- Schedule start/end dates
- Modal popup on page load

✅ **Admin Dashboard**
- Password protected
- Create/edit/delete promotions
- Upload images with automatic compression
- Real-time updates

✅ **Vercel Optimized**
- Serverless API functions
- Zero-server maintenance
- Auto-scaling
- CDN included
- Free SSL/HTTPS

## 📚 API Endpoints

### Public Endpoints

**GET /api/menu** - Get all menu items
```json
[
  {
    "_id": "...",
    "name": "Calamar Farci",
    "price": 44,
    "description": "...",
    "category": { "name": "DÉLICES MARINS" }
  }
]
```

**GET /api/categories** - Get all categories
```json
[
  { "_id": "...", "name": "LES ENTRÉES", "order_index": 1 }
]
```

**GET /api/promotions** - Get active promotions
```json
[
  {
    "_id": "...",
    "title": "Happy Hour",
    "discount_percent": 25,
    "image_url": "data:image/jpeg;base64,..."
  }
]
```

### Admin Endpoints (Requires Auth)

**POST /api/promotions** - Create promotion
```bash
curl -X POST http://localhost:3000/api/promotions \
  -H "Authorization: Bearer $(echo -n 'password' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sale","discount_percent":20,"image_url":"..."}'
```

**PUT /api/promotions/[id]** - Update promotion

**DELETE /api/promotions/[id]** - Delete promotion

## 🔧 Configuration

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lucullus

# Admin Auth
ADMIN_PASSWORD=your-secure-password

# Frontend Config
NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_IMAGE_COMPRESSION_QUALITY=0.8
NEXT_PUBLIC_MAX_IMAGE_SIZE_MB=1
```

### Next.js Build

- Build: `npm run build`
- Start: `npm start`
- Dev: `npm run dev`

## 🎨 Customization

### Change Colors

Edit `pages/index.js` and `pages/admin.js`:
```javascript
--primary: #2d5a5a;      // Main color
--dark: #1f3f3f;         // Dark accent
--cream: #e8d5c4;        // Light text
--gold: #d4a574;         // Highlight
```

### Add Menu Items

Use the admin dashboard or database directly:
```javascript
db.collection('menu_items').insertOne({
  category_id: ObjectId("..."),
  name: "Item Name",
  price: 25,
  description: "Item description"
})
```

## 📊 Database Schema

### Collections

**categories**
- `_id`: ObjectId
- `name`: String
- `order_index`: Number

**menu_items**
- `_id`: ObjectId
- `category_id`: ObjectId (ref categories)
- `name`: String
- `price`: Number
- `description`: String
- `image_url`: String

**promotions**
- `_id`: ObjectId
- `title`: String
- `description`: String
- `discount_percent`: Number
- `discount_amount`: Number
- `image_url`: String (base64)
- `start_date`: Date
- `end_date`: Date
- `is_active`: Number
- `created_at`: Date

## 🔒 Security

- Admin password hashed in auth header (Base64)
- Environment variables not exposed to client
- API routes validate authentication header
- MongoDB connection string never exposed

⚠️ **Note**: For production, use JWT tokens instead of Base64 passwords.

## 📱 Mobile Support

Fully responsive design supports:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

**"Database error: table doesn't exist"**
- Delete local `lucullus.db` (if using SQLite)
- Database collections auto-create with MongoDB

**"404 Not Found" on admin page**
- Refresh browser (Ctrl+F5)
- Clear cache
- Check `.env.local` is configured

**"PayloadTooLargeError"**
- Image already compressed to <1MB
- Check body-parser limit (100MB in Next.js)

**MongoDB connection fails**
- Verify connection string format
- Check IP whitelist (add 0.0.0.0/0 in Atlas)
- Ensure cluster is running

## 📝 License

MIT

## 🤝 Support

Issues? Check VERCEL_SETUP.md for detailed deployment instructions.
