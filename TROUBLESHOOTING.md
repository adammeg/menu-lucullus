# TROUBLESHOOTING GUIDE

## If Backend Won't Start

### Error: "Port 5000 already in use"

**Solution 1: Kill existing process**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
npm start
```

**Solution 2: Use different port**
Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 5001;  // Change to 5001
```

Then update frontend API URL in `frontend/app.js`:
```javascript
const API_URL = 'http://localhost:5001/api';  // Match new port
```

---

## If Frontend Won't Load

### Issue: Shows blank page

**Check 1: Backend is running**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK"}
```

**Check 2: Using HTTP not file://**
- ❌ WRONG: `file:///c:/Users/adamb/lucullus-menu/frontend/index.html`
- ✅ CORRECT: `http://localhost:8000`

**Check 3: Browser console errors (F12)**
- Open DevTools (F12)
- Check Console tab for errors
- Common issue: API_URL mismatch

### Solution: Restart frontend server
```bash
cd frontend
# Kill existing: Ctrl+C
npx http-server . -p 8000
```

---

## If Admin Dashboard Won't Load

### Issue: Admin page shows nothing

**Solution 1: Check backend running**
```bash
curl http://localhost:5000/api/categories
# Should return list of categories
```

**Solution 2: Clear browser cache**
- Open DevTools: F12
- Right-click refresh button → "Empty cache and hard refresh"
- Or press: Ctrl+Shift+Delete

**Solution 3: Check console (F12)**
- Open Console tab
- Look for 404 or CORS errors
- Note the error message

---

## If Database Issues

### Error: "Database connection error"

**Solution: Recreate database**
```bash
cd backend
del lucullus.db
npm start
# Wait for "Database tables initialized"
node seed.js
```

### Error: "No menu items showing"

**Check 1: Items were seeded**
```bash
curl http://localhost:5000/api/menu
# Should return items grouped by category
```

**Check 2: Add manual item via API**
```bash
curl -X POST http://localhost:5000/api/admin/menu-items \
  -H "Content-Type: application/json" \
  -d '{"category_id":1,"name":"Test","price":10}'
```

---

## If CORS Errors in Console

### Error: "No 'Access-Control-Allow-Origin' header"

**Check 1: Backend has CORS enabled**
File: `backend/server.js`
Line should have: `app.use(cors());`

**Check 2: Not using file:// protocol**
- CORS doesn't work with file:// URLs
- Use http://localhost:8000

**Check 3: Restart both servers**
```bash
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npx http-server . -p 8000
```

---

## If Admin Operations Fail

### Can't add menu item in admin

**Check 1: Fill all required fields**
- Category (required)
- Name (required)
- Price (required)
- Description (optional)

**Check 2: Backend running**
```bash
curl http://localhost:5000/api/categories
```

**Check 3: Check browser console**
- F12 → Console tab
- Look for error messages
- Note any API errors

### Promotion won't save

**Check 1: Fill required fields**
- Title (required)
- Discount % OR Discount DT amount (required)

**Check 2: Valid discount value**
- Percentage: 0-100
- Amount: positive number
- At least one must be filled

---

## If Styles Look Wrong

### Colors/fonts not showing correctly

**Solution 1: Hard refresh**
```
Ctrl+Shift+R  (Windows/Linux)
Cmd+Shift+R   (Mac)
```

**Solution 2: Check styles.css loaded**
- F12 → Network tab
- Look for styles.css
- Check status (should be 200)

**Solution 3: Check admin-styles.css path**
- For admin: admin/admin-styles.css
- For frontend: styles.css

---

## If Pages Load Slowly

**Check 1: Database query performance**
- Check how many items in database
- If >1000, consider pagination

**Check 2: Browser console (F12)**
- Check Network tab
- Look for slow API calls

**Check 3: Restart servers**
- Backend: Ctrl+C, npm start
- Frontend: Ctrl+C, npx http-server . -p 8000

---

## If Can't Connect to Admin

### Admin page shows "can't reach API"

**Step 1: Verify backend URL**
In `admin/admin-app.js`, check:
```javascript
const API_URL = 'http://localhost:5000/api';
```

**Step 2: Test API directly**
```bash
curl http://localhost:5000/api/health
```

**Step 3: Check CORS in browser console (F12)**
- Look for CORS or 404 errors
- Note the full error message

**Step 4: Restart backend**
```bash
cd backend
npm start
```

---

## If Promotions Don't Show on Website

### Promotions added but not visible

**Check 1: Promotion is active**
- Admin → Promotions tab
- Status should show "Actif"
- Check dates aren't in future

**Check 2: Dates are correct**
- Start date should be before today
- End date should be after today
- Format: YYYY-MM-DD HH:MM

**Check 3: Hard refresh frontend**
- Ctrl+Shift+R
- Clear browser cache

**Check 4: API returns promotions**
```bash
curl http://localhost:5000/api/promotions
```

---

## If Items Won't Delete

### Can't delete menu item or promotion

**Check 1: Item exists**
- Refresh the page
- Check if item still there

**Check 2: API error**
- Open browser console (F12)
- Try delete operation
- Look for error message

**Check 3: Database issue**
```bash
# Verify database is not locked
# Stop backend: Ctrl+C
# Start backend: npm start
```

---

## General Diagnostic Steps

### If something isn't working:

1. **Check backend is running**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check frontend can reach backend**
   - Go to http://localhost:8000
   - Open browser console (F12)
   - Look for errors

3. **Check database exists**
   ```bash
   # File should exist at:
   c:\Users\adamb\lucullus-menu\backend\lucullus.db
   ```

4. **Check ports are correct**
   - Backend: 5000
   - Frontend: 8000
   - No conflicts with other services

5. **Restart everything**
   ```bash
   # Stop both servers: Ctrl+C in each terminal
   # Clear cache: Browser F12 → settings → Clear storage
   # Start backend: npm start
   # Start frontend: npx http-server . -p 8000
   ```

---

## Performance Optimization

### If system is slow:

1. **Reduce database items**
   - Too many items can slow queries
   - Consider pagination in future

2. **Clear browser cache**
   - F12 → Application tab → Clear storage
   - Or use private/incognito mode

3. **Use modern browser**
   - Chrome/Edge (recommended)
   - Firefox
   - Avoid old IE

4. **Close other applications**
   - Frees up RAM
   - Better performance

---

## Testing Checklist

Before going live:

- [ ] Backend starts without errors
- [ ] Database has sample data
- [ ] Frontend loads at http://localhost:8000
- [ ] Admin dashboard loads at http://localhost:8000/admin
- [ ] Can add menu items in admin
- [ ] Can create promotions in admin
- [ ] Promotions show on menu website
- [ ] Promotion popups work
- [ ] Mobile layout is responsive
- [ ] All API endpoints respond
- [ ] No console errors (F12)

---

## Getting Help

1. **Check QUICK_START.md** - Common tasks
2. **Check SETUP.md** - Setup instructions
3. **Check README.md** - Full documentation
4. **Check code comments** - In source files
5. **Check browser console** - F12 for errors

---

## Emergency Recovery

### If everything breaks:

```bash
# Step 1: Stop all servers (Ctrl+C in each terminal)

# Step 2: Delete database and reinstall
cd backend
del lucullus.db
npm install

# Step 3: Restart backend
npm start

# Step 4: Seed new data
node seed.js

# Step 5: Restart frontend
cd frontend
npx http-server . -p 8000
```

---

**Remember**: Most issues resolve with:
1. Restart backend
2. Clear browser cache
3. Restart frontend

Then try again!
