# 📋 Database Seeding Guide

## Quick Start - Populate Your Database

Your complete restaurant menu has been prepared and is ready to be added to MongoDB!

### What's Included

✅ **116 menu items** organized by 10 categories:
- 20 Entrées (appetizers & seafood)
- 8 Pâtes (pasta dishes)
- 5 Viandes (meat dishes)
- 3 Poissons (fish dishes)
- 4 Desserts
- 27 Vins (red, white, rosé wines)
- 3 Mousseux (sparkling wines)
- 11 Bières & Softs (beers and soft drinks)
- 22 Spiritueux (liqueurs, spirits)
- 13 Cocktails (cocktails and shots)

### Step 1: Install Dependencies

```bash
npm install
```

This installs `dotenv` which is needed to read your `.env.local` file.

### Step 2: Ensure MongoDB Connection

Make sure your `.env.local` file has:

```env
MONGODB_URI=mongodb+srv://admin:your-password@cluster.mongodb.net/lucullus?retryWrites=true&w=majority
ADMIN_PASSWORD=your-admin-password
```

### Step 3: Run the Seed Script

```bash
npm run seed
```

This will:
1. ✅ Connect to your MongoDB database
2. ✅ Clear existing menu items (if any)
3. ✅ Add all 116 menu items
4. ✅ Show you a summary of what was added

### Example Output

```
🌱 Starting database seed...

✓ LES ENTRÉES: 20 items added
✓ LES PÂTES: 9 items added
✓ SÉLECTION CARNÉE: 5 items added
✓ DÉLICES MARINS: 3 items added
✓ LES DESSERTS: 4 items added
✓ LES VINS: 27 items added
✓ LES MOUSSEUX: 3 items added
✓ BIÈRES & SOFTS: 11 items added
✓ SPIRITUEUX: 22 items added
✓ LES COCKTAILS: 13 items added

✅ Successfully added 116 menu items to the database!

📊 Summary:
  - Entrées: 20 items
  - Pâtes: 8 items
  - Viandes: 5 items
  - Poissons: 3 items
  - Desserts: 4 items
  - Vins (includes rosé & blanc): 27 items
  - Mousseux: 3 items
  - Bières & Softs: 11 items
  - Spiritueux: 22 items
  - Cocktails: 13 items
  ────────────────────
  Total: 116 items
```

### Step 4: Verify in Your Application

1. Start your app:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000/ and see your complete menu with all items!

3. Visit http://localhost:3000/admin/ to manage your promotions

## Troubleshooting

### "MONGODB_URI not defined"
- Check `.env.local` exists in the root directory
- Verify the variable name is exactly `MONGODB_URI`
- Restart after creating the file

### "Cannot find module 'dotenv'"
- Run `npm install` to install dotenv
- Run the seed again: `npm run seed`

### "Connect ECONNREFUSED"
- Check MongoDB URI is correct
- Verify MongoDB Atlas cluster is running
- Check IP whitelist includes your machine (or use 0.0.0.0/0)

### "Items not appearing in menu"
- Check data was actually inserted:
  ```bash
  npm run dev
  ```
- Open browser console (F12) and check for errors
- Go to http://localhost:3000/api/menu to see raw data

## Running Seed Again

To reset and reload all menu items:

```bash
npm run seed
```

This will clear all existing items and add fresh ones from the seed file.

## Customizing the Menu

To modify items after seeding:

### Edit Names/Prices
1. Edit `scripts/seedMenuItems.js`
2. Find the item in the menu data
3. Change name or price
4. Run `npm run seed` again

### Add New Items
1. Open `scripts/seedMenuItems.js`
2. Add to the appropriate category array:
   ```javascript
   'LES ENTRÉES': [
     // existing items...
     { name: 'New Item', price: 35 }
   ]
   ```
3. Run `npm run seed`

### Use Admin Dashboard to Modify Individual Items
1. Log in at http://localhost:3000/admin
2. Enter admin password
3. Use the dashboard to update items
4. No need to re-seed

## File Location

- Seed script: `scripts/seedMenuItems.js`
- All menu data is stored in MongoDB (not in files)

## Next Steps

1. ✅ Run `npm run seed` to populate database
2. ✅ Start your app: `npm run dev`
3. ✅ Check menu at http://localhost:3000/
4. ✅ Deploy to Vercel
5. ✅ Seed production database

## Seeding Production Database on Vercel

When deploying to Vercel:

1. Push code to GitHub
2. Deploy to Vercel (as per DEPLOYMENT_CHECKLIST.md)
3. In Vercel terminal, run once to seed production:
   ```bash
   npm run seed
   ```

Or add to deployment process by creating a `scripts/vercel-seed.sh` file.

---

**Ready?** Run `npm run seed` and your entire menu will be in the database! 🚀
