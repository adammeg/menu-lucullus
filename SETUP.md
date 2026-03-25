# SETUP GUIDE - Lucullus La Goulette Menu Website

## Quick Start (Windows)

### Step 1: Install Node.js
1. Download and install Node.js from https://nodejs.org/ (LTS version recommended)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Start the Backend

```bash
cd backend
npm install
npm start
```

The backend will start on **http://localhost:5000**

### Step 3: Serve Frontend (in a new terminal)

Option A - Using Python:
```bash
cd frontend
python -m http.server 8000
```

Option B - Using Node.js:
```bash
cd frontend
npx http-server . -p 8000
```

Option C - Manual (Open in browser):
```
file:///c:/Users/adamb/lucullus-menu/frontend/index.html
```

### Step 4: Access the Websites

- **Menu Website**: http://localhost:8000
- **Admin Dashboard**: http://localhost:8000/admin/
- **Backend API**: http://localhost:5000

---

## Complete Setup Instructions

### Backend Setup

1. **Navigate to backend folder**:
   ```bash
   cd c:\Users\adamb\lucullus-menu\backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

   You should see:
   ```
   Server running on http://localhost:5000
   Connected to SQLite database
   Database tables initialized
   ```

4. **Seed sample data** (optional, in new terminal):
   ```bash
   cd c:\Users\adamb\lucullus-menu\backend
   node seed.js
   ```

### Frontend Setup

**Important**: Keep backend running before opening frontend!

#### Option 1: Using HTTP Server (Recommended)

```bash
cd c:\Users\adamb\lucullus-menu\frontend
npx http-server . -p 8000
```

Then visit: **http://localhost:8000**

#### Option 2: Direct File Open

Just open this file in your browser:
```
c:\Users\adamb\lucullus-menu\frontend\index.html
```

**Note**: Some features may have CORS limitations when opened directly as a file.

#### Option 3: Python Server

```bash
cd c:\Users\adamb\lucullus-menu\frontend
python -m http.server 8000
```

Then visit: **http://localhost:8000**

---

## API Testing

### Test Health Check
```bash
curl http://localhost:5000/api/health
```
Expected response: `{"status":"OK"}`

### Get All Menu Items
```bash
curl http://localhost:5000/api/menu
```

### Get Categories
```bash
curl http://localhost:5000/api/categories
```

### Get Promotions
```bash
curl http://localhost:5000/api/promotions
```

---

## Admin Dashboard Usage

### Access Dashboard
1. Go to http://localhost:8000/admin/
2. Dashboard loads automatically

### Features

#### Dashboard Tab
- View statistics (total items, promotions, categories)
- See active promotions

#### Menu Management Tab
- **Add Item**: Click "+ Ajouter Article"
  - Select category
  - Enter name, description, price
  - Save

- **Edit Item**: Click "Éditer" button on any item
  - Modify details
  - Save changes

- **Delete Item**: Click "Supprimer" button
  - Confirm deletion

- **Filter**: Use dropdown to filter by category

#### Promotions Tab
- **Add Promotion**: Click "+ Ajouter Promotion"
  - Enter promotion title and description
  - Set discount (% or fixed amount)
  - Optionally target specific item or all items
  - Set start/end dates (optional)
  - Save

- **Edit Promotion**: Click "Éditer" button

- **Delete Promotion**: Click "Supprimer" button

---

## Troubleshooting

### Port Already in Use

If you get "Port 5000 is already in use":

```bash
# Find the process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number shown)
taskkill /PID <PID> /F

# Or use a different port
# Edit backend/server.js and change the PORT variable
```

### Database Issues

If database seems corrupted:

```bash
# Delete the database file (it will be recreated)
cd backend
rm lucullus.db
npm start
node seed.js  # Re-add sample data
```

### CORS Errors

Make sure:
1. Backend is running on http://localhost:5000
2. Frontend is running on http://localhost:8000 or accessed via a server
3. Not opening index.html directly as a file (file:// protocol)

### Module Not Found Errors

```bash
# Reinstall dependencies
cd backend
rm -r node_modules
npm install
npm start
```

---

## File Structure

```
lucullus-menu/
├── backend/
│   ├── server.js          # Main API server
│   ├── seed.js            # Sample data seeding
│   ├── lucullus.db        # SQLite database (auto-created)
│   ├── package.json       # Dependencies
│   └── .env              # Configuration
├── frontend/
│   ├── index.html         # Main website
│   ├── styles.css         # Styling
│   ├── app.js            # Frontend logic
│   └── admin/
│       ├── index.html     # Admin dashboard
│       ├── admin-styles.css
│       └── admin-app.js
├── README.md              # Project documentation
├── SETUP.md              # This file
├── start.bat             # Windows startup script
└── start.sh              # Unix/Mac startup script
```

---

## Features Overview

### Client Menu Website
✅ Luxury responsive design
✅ Browse by category
✅ See active promotions
✅ Popup notifications for special offers
✅ Mobile-friendly interface
✅ Social media links

### Admin Dashboard
✅ Dashboard with statistics
✅ Menu item management (CRUD)
✅ Promotion management
✅ Category filtering
✅ Real-time updates
✅ Beautiful UI

### Backend API
✅ RESTful endpoints
✅ SQLite database
✅ CORS enabled
✅ Error handling
✅ Data validation

---

## Customization

### Change Colors

Edit `frontend/styles.css`:

```css
:root {
    --primary-color: #8B6F47;      /* Main brown */
    --secondary-color: #D4AF37;    /* Gold */
    --accent-color: #c0843d;       /* Copper */
    /* ... other colors ... */
}
```

### Change Restaurant Name

Edit `frontend/index.html`:
```html
<h1 class="restaurant-name">Your Restaurant Name</h1>
```

### Change Logo

Replace the logo image in `frontend/index.html`:
```html
<img src="your-logo-url.png" alt="Logo" class="logo">
```

### Add More Categories

Add to categories list in `backend/server.js` initializeDatabase function.

---

## Production Deployment

For production use:

1. **Add Authentication**
   - Protect admin endpoints
   - Add password for admin login

2. **Environment Variables**
   - Use actual secrets
   - Configure for production database

3. **Database**
   - Use PostgreSQL or MySQL instead of SQLite
   - Set up backups

4. **API Security**
   - Add HTTPS
   - Rate limiting
   - Input validation
   - CORS restrictions

5. **Hosting**
   - Deploy backend to server
   - Deploy frontend to CDN
   - Use domain name
   - SSL certificates

---

## Support & Maintenance

### Regular Tasks
- Check database size
- Review active promotions
- Update menu prices seasonally
- Backup database regularly

### Monitoring
- Monitor API performance
- Check error logs
- Verify data integrity

---

**Version**: 1.0.0
**Last Updated**: March 2025
**Status**: ✅ Ready to Use

For more information, see README.md
