# 🚀 Vercel Deployment Checklist

## ✅ Local Setup (Do This First)

- [ ] Run `npm install` to install all dependencies
- [ ] Copy `.env.example` to `.env.local`
- [ ] Create MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
- [ ] Get MongoDB connection string
- [ ] Add connection string to `.env.local` as `MONGODB_URI`
- [ ] Add admin password to `.env.local` as `ADMIN_PASSWORD`
- [ ] Test locally: `npm run dev`
- [ ] Verify menu loads at http://localhost:3000/
- [ ] Verify admin works at http://localhost:3000/admin/
- [ ] Test adding a promotion with image

## 🔑 MongoDB Setup

- [ ] Create free MongoDB Atlas account
- [ ] Create a cluster (default settings are fine)
- [ ] Create database: `lucullus`
- [ ] Create user:
  - [ ] Username: `admin` (or your choice)
  - [ ] Password: (strong password)
  - [ ] Add to all databases
- [ ] Whitelist IP: Add `0.0.0.0/0` (or specific IP)
- [ ] Get connection string from "Connect" → "Drivers"
- [ ] Format: `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/lucullus?retryWrites=true&w=majority`

**Common MongoDB connection string issue:**
- Special characters in password must be URL-encoded
- Example: `@` becomes `%40`, `:` becomes `%3A`
- Use: https://www.urlencoder.org/ if needed

## 📦 Deployment to Vercel

### Step 1: Prepare Git Repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Create first commit: `git commit -m "Initial Next.js production build"`
- [ ] Create GitHub/GitLab account if you don't have one
- [ ] Create new repository
- [ ] Add remote: `git remote add origin https://github.com/YOUR-USERNAME/lucullus-menu`
- [ ] Push code: `git push -u origin main`

### Step 2: Connect to Vercel
- [ ] Go to https://vercel.com/new
- [ ] Sign up with GitHub (recommended) or email
- [ ] Click "Import Git Repository"
- [ ] Select your `lucullus-menu` repo
- [ ] Vercel auto-detects Next.js (great!)
- [ ] Click "Create Team" (optional) or continue

### Step 3: Add Environment Variables
- [ ] Set `MONGODB_URI`:
  - [ ] Paste your full MongoDB connection string
  - [ ] Double-check username and password are URL-encoded if needed
- [ ] Set `ADMIN_PASSWORD`:
  - [ ] Enter your admin password (same as in `.env.local`)
- [ ] Leave other variables as defaults (they use Next.js defaults)

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait 1-2 minutes for build to complete
- [ ] See green "Congratulations! Your project was successfully deployed"
- [ ] Your site is live at: `https://lucullus-menu.vercel.app` (your-name varies)

### Step 5: Verify Production
- [ ] Visit your deployment URL
- [ ] Test menu page loads correctly
- [ ] Test admin page at `/admin` (you should see login)
- [ ] Login with your admin password
- [ ] Try creating a test promotion with image
- [ ] Check if promotion displays on menu page

## 🔄 Continuous Deployment

- [ ] Every `git push` to main automatically deploys to Vercel
- [ ] No need to manually deploy!
- [ ] Check deployment status in Vercel dashboard
- [ ] View logs if deployment fails

## 📝 Post-Deployment

- [ ] Add your own restaurant categories via MongoDB
- [ ] Add menu items via admin or MongoDB
- [ ] Create first real promotion
- [ ] Share site URL with team
- [ ] Monitor usage in Vercel Analytics
- [ ] Set up domain (optional) in Vercel settings

## 🆘 Troubleshooting

### Build Fails on Vercel
1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing `MONGODB_URI` → Add to environment variables
   - Wrong `next.config.js` syntax → Check for typos
   - Missing dependencies → Run `npm install` locally and push

### API Routes Return 404
1. Check that `pages/api/` folder structure is correct
2. File names must match route names exactly:
   - File: `pages/api/menu/index.js` → Route: `/api/menu`
   - File: `pages/api/promotions/index.js` → Route: `/api/promotions`

### MongoDB Connection Fails
1. Check connection string in `.env` variable
2. Verify IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
3. Test connection string locally first with `npm run dev`
4. Check username/password characters aren't causing issues

### Images Don't Upload
1. Check image file size (should compress to <1MB)
2. Try image in different format (JPEG works best)
3. Check MongoDB connection is working
4. Review browser console for errors (F12)
5. Check Vercel logs for upload errors

### Admin Password Wrong
1. Verify exact password in `.env` variable
2. Don't include spaces or special quotes
3. Restart dev server: Ctrl+C then `npm run dev`
4. Verify password in production matches `.env`

## ✨ Success Indicators

- ✅ Homepage loads with menu and categories
- ✅ Menu categories expand/collapse on click
- ✅ Admin page login works with password
- ✅ Can create new promotion with image
- ✅ Promotion appears on homepage as modal
- ✅ All data persists after page refresh
- ✅ Vercel shows "Ready" status

## 🎉 You Did It!

Your restaurant menu is now hosted on production infrastructure!

### What's Included
- ✅ Professional hosting (Vercel)
- ✅ Global CDN for fast loading
- ✅ Automatic HTTPS/SSL
- ✅ Auto-scaling (handles traffic spikes)
- ✅ MongoDB Atlas database (cloud)
- ✅ Free tier generous limits
- ✅ One-click redeploys on code changes

### Next Features to Add
1. Email notifications for promotions
2. QR code for menu
3. Multi-language support
4. Photo gallery
5. Reservation system
6. Customer reviews

---

**Questions?** Check `PRODUCTION_README.md` for detailed documentation.

**Ready to deploy?** Follow the steps above and you'll be live in 5 minutes! 🚀
