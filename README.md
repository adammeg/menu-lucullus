# Lucullus La Goulette - Menu Website

A luxury, responsive restaurant menu website with admin dashboard for managing menu items, prices, and promotional offers.

## Features

✨ **Responsive Design**
- Mobile, tablet, and desktop optimized
- Elegant, luxury aesthetic matching the restaurant brand
- Smooth animations and transitions

📱 **Client Menu Website**
- Browse menu by categories
- View prices in Tunisian Dinar (DT)
- See active promotions and special offers
- Popup notifications for special deals

🔧 **Admin Dashboard**
- Manage menu items (add, edit, delete)
- Organize items by categories
- Update prices and descriptions
- Create and manage promotions/reductions
- View platform statistics and active offers
- Real-time data updates

🎁 **Promotion System**
- Percentage or fixed amount discounts
- Time-based promotions (start/end dates)
- Item-specific or category-wide offers
- Client-side popup notifications

## Project Structure

```
lucullus-menu/
├── backend/              # Node.js/Express API
│   ├── server.js        # Main server file
│   ├── package.json     # Dependencies
│   └── lucullus.db      # SQLite database (auto-created)
├── frontend/            # Client website
│   ├── index.html       # Main page
│   ├── styles.css       # Styling
│   ├── app.js          # Frontend logic
│   └── admin/          # Admin dashboard
├── admin/              # Admin dashboard
│   ├── index.html      # Admin page
│   ├── admin-styles.css # Admin styling
│   └── admin-app.js    # Admin logic
└── README.md
```

## Tech Stack

- **Backend**: Node.js, Express, SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: SQLite3
- **Architecture**: RESTful API

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:5000`

### 3. Open Frontend Website

```bash
# Open in your browser
frontend/index.html
```

Or serve it with a local server (recommended):

```bash
# Using Python
python -m http.server 8000

# Or using Node.js http-server
npx http-server frontend -p 8000
```

Then visit: `http://localhost:8000`

### 4. Access Admin Dashboard

```bash
# Make sure the frontend server is running, then visit:
# http://localhost:8000/admin/
```

## API Endpoints

### Menu Management

- `GET /api/menu` - Get all menu items grouped by category
- `GET /api/categories` - Get all categories
- `GET /api/menu/category/:categoryId` - Get items in category
- `POST /api/admin/menu-items` - Add menu item (Admin)
- `PUT /api/admin/menu-items/:id` - Update menu item (Admin)
- `DELETE /api/admin/menu-items/:id` - Delete menu item (Admin)

### Promotions

- `GET /api/promotions` - Get active promotions
- `POST /api/admin/promotions` - Create promotion (Admin)
- `PUT /api/admin/promotions/:id` - Update promotion (Admin)
- `DELETE /api/admin/promotions/:id` - Delete promotion (Admin)

### Health

- `GET /api/health` - Check API status

## Default Menu Categories

The system comes pre-configured with these categories:

1. LES ENTRÉES (Appetizers)
2. SÉLECTION CARNÉE (Meat Selection)
3. DÉLICES MARINS (Seafood)
4. LES PÂTES (Pasta)
5. À PARTAGER (To Share)
6. LES DESSERTS (Desserts)
7. LES VINS (Wines)
8. BIÈRES & SOFTS (Beer & Soft Drinks)
9. SPIRITUEUX (Spirits)
10. LES COCKTAILS (Cocktails)

## Usage Guide

### For Customers

1. Visit the menu website
2. Browse categories using navigation buttons
3. Click "Tous" to see all items or select a specific category
4. Promotional items are marked with ⭐
5. Click on promotional items to see details and discount amount

### For Administrators

1. Access the admin dashboard
2. **Dashboard**: View statistics and active promotions
3. **Manage Menu**: 
   - Add new items with category, name, description, and price
   - Edit existing items
   - Delete items
4. **Manage Promotions**:
   - Create promotions with percentage or fixed discounts
   - Set start and end dates
   - Target specific items or all items
   - Track active offers

## Database Schema

### Categories Table
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT UNIQUE
- order_index: INTEGER
```

### Menu Items Table
```sql
- id: INTEGER PRIMARY KEY
- category_id: INTEGER FOREIGN KEY
- name: TEXT
- description: TEXT
- price: REAL
- image_url: TEXT
- created_at: DATETIME
- updated_at: DATETIME
```

### Promotions Table
```sql
- id: INTEGER PRIMARY KEY
- item_id: INTEGER FOREIGN KEY (NULL = all items)
- category_id: INTEGER FOREIGN KEY (NULL = all categories)
- title: TEXT
- description: TEXT
- discount_percent: REAL
- discount_amount: REAL
- start_date: DATETIME
- end_date: DATETIME
- is_active: INTEGER (0 or 1)
- created_at: DATETIME
```

## Styling & Branding

### Color Palette
- Primary: #8B6F47 (Brown/Gold)
- Secondary: #D4AF37 (Gold)
- Accent: #c0843d (Copper)
- Dark: #1a1a1a
- Light: #f5f5f5

### Fonts
- Headers: Georgia, Garamond, serif
- Body: Georgia, serif (frontend); Arial, sans-serif (admin)

### Logo & Images
- Restaurant Logo: Placeholder (replace with actual logo)
- Hero Section: Placeholder (replace with restaurant image)

## Features Details

### Luxury Responsive Design
- ✅ Mobile-first approach
- ✅ Flexbox and CSS Grid layouts
- ✅ Touch-friendly buttons
- ✅ Fast load times
- ✅ Smooth animations

### Admin Dashboard
- ✅ Real-time statistics
- ✅ Quick add/edit/delete operations
- ✅ Category filtering
- ✅ Date range promotions
- ✅ Active/inactive promotion tracking

### Promotion System
- ✅ Percentage-based discounts (-50%, etc.)
- ✅ Fixed amount discounts (-5 DT, etc.)
- ✅ Time-based activation
- ✅ Client-side popups
- ✅ Banner advertisements

## Performance Optimizations

- Data auto-refresh every 5 minutes
- Efficient database queries
- Responsive images and lazy loading ready
- Minimal dependencies for fast load times
- Local caching of categories and promotions

## Browser Support

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## Error Handling

- Comprehensive error messages
- Graceful fallbacks for missing data
- Database connection error handling
- API error responses
- User-friendly notifications

## Security Notes

- No authentication on API (add in production)
- No rate limiting (add in production)
- Input validation on backend
- CORS enabled for local development

## Future Enhancements

- [ ] User authentication system
- [ ] Order management
- [ ] Email notifications
- [ ] Image upload for menu items
- [ ] Restaurant statistics and analytics
- [ ] Multi-language support
- [ ] Reservation system
- [ ] QR code menu links
- [ ] Payment integration

## Troubleshooting

### Port Already in Use
```bash
# Change the port in backend/server.js
const PORT = process.env.PORT || 5001;
```

### Database Issues
```bash
# Delete the database and restart (it will auto-create)
rm backend/lucullus.db
npm start
```

### CORS Errors
- Make sure backend is running on port 5000
- Check that frontend is accessing correct API_URL
- Verify CORS is enabled in server.js

## License

Created for Lucullus La Goulette Restaurant

## Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0
**Last Updated**: March 2025
