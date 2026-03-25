# Production Deployment Guide

## Environment Setup

### Local Development
1. **MongoDB Connection**: Uses MongoDB Atlas (cloud)
2. **Environment File**: `.env.local`
3. **Start Command**: `npm run dev`

### Production (Vercel/Cloud)
1. **Set environment variables** in your deployment platform:
   ```
   MONGODB_URI = your-mongodb-atlas-connection-string
   ADMIN_PASSWORD = your-secure-password
   NEXT_PUBLIC_API_URL = https://your-production-domain.com
   NODE_ENV = production
   ```

## Environment Variables Explained

| Variable | Local | Production | Required |
|----------|-------|-----------|----------|
| `MONGODB_URI` | AtlasDB | AtlasDB | Yes |
| `ADMIN_PASSWORD` | String | Secure string (32+ chars) | Yes |
| `NEXT_PUBLIC_API_URL` | http://localhost:3000 | https://domain.com | Yes |
| `NODE_ENV` | development | production | No (defaults work) |

## MongoDB Atlas Setup

### Connection String Format
```
mongodb+srv://user:password@cluster.mongodb.net/?appName=dbname&retryWrites=true&w=majority
```

### SSL/TLS Configuration
- **Automatic**: Atlas certificates are automatically validated
- **Local Testing**: Works seamlessly with `tls=true` option
- **Production**: No additional configuration needed

## API Endpoints

All APIs use HTTP status codes properly:
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (missing auth)
- `403`: Forbidden (invalid auth)
- `404`: Not found
- `405`: Method not allowed
- `503`: Service unavailable (DB connection failed)
- `504`: Timeout

### GET /api/menu
Returns all menu items with categories (public endpoint)

### GET /api/categories
Returns all categories ordered (public endpoint)

### GET /api/promotions
Returns active promotions (public endpoint)

### POST /api/promotions
Create promotion (requires auth)
```bash
curl -X POST http://localhost:3000/api/promotions \
  -H "Authorization: Bearer $(echo -n 'password' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"title": "Summer Deal", ...}'
```

## Build & Deployment

### Local Build
```bash
npm run build    # Creates optimized production build
npm run start    # Runs production build locally
```

### Production Build (Vercel)
```bash
git push origin main  # Automatic build and deploy
```

## Troubleshooting

### MongoDB Connection Errors
1. Check `MONGODB_URI` is correct
2. Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0)
3. Test connection: `npm run dev`

### SSL/TLS Errors
- Already handled automatically
- Verify connection string includes `?appName=lucullus`

### Build Failures
1. Run `npm install`
2. Check for TypeScript errors: `npm run lint`
3. Verify `.env.local` exists with correct variables

### Timeout Errors
- MongoDB connection timeout: Check Atlas cluster status
- API response timeout: MongoDB Atlas may be overloaded
- Solution: Increase timeout or upgrade cluster

## Performance Tips

1. **Connection Pooling**: Automatic (2-10 connections)
2. **Keep-Alive**: Enabled every 10 seconds
3. **Cache**: Using MongoDB's built-in indexing
4. **Images**: Compressed to max 1MB JPEG
5. **CSS**: Minified in production build

## Security

### Authentication
- Password sent base64-encoded in Authorization header
- **Production**: Use environment-specific password (32+ chars)

### Database Access
- MongoDB Atlas firewall enabled
- Collections auto-created on first run
- Indexes on frequently queried fields

### CORS
- Only same-origin requests (set via NEXT_PUBLIC_API_URL)
- Images stored as base64 in database

## Monitoring

### Logs
- API errors logged with timestamps
- Development mode includes error stack traces
- Production mode hides stack traces

### Health Check
Test endpoint connectivity:
```bash
curl http://localhost:3000/api/categories
```

## Next Steps

1. Set production MongoDB password (32+ characters)
2. Configure domain in NEXT_PUBLIC_API_URL
3. Deploy to production (Vercel, Netlify, or custom)
4. Test all endpoints in production
5. Monitor error logs
