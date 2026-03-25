# Vercel Production Setup - Lucullus Restaurant Menu

## Architecture Overview
- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes (serverless)
- **Database**: MongoDB Atlas
- **Hosting**: Vercel

## Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/lucullus`

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/lucullus
```

### 4. Run Locally
```bash
npm run dev
```
Visit:
- Menu: http://localhost:3000/
- Admin: http://localhost:3000/admin
- API: http://localhost:3000/api/menu

### 5. Deploy to Vercel
1. Push to GitHub
2. Go to vercel.com and import the repo
3. Add MONGODB_URI to Environment Variables
4. Deploy!

## API Endpoints
- GET /api/menu - Get all menu items
- GET /api/promotions - Get active promotions
- POST /api/admin/promotions - Create promotion (requires auth)
- PUT /api/admin/promotions/[id] - Update promotion
- DELETE /api/admin/promotions/[id] - Delete promotion

## Features
✅ Restaurant menu with categories
✅ Promotional posters with images (base64)
✅ Admin dashboard
✅ Responsive design
✅ Mobile-first
✅ Production-ready
