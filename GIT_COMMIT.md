# Git Commit Template

## Quick Commit
```bash
git add -A
git commit -m "Fix: MongoDB SSL/TLS connection errors and refactor API handlers

- Fix MongoDB TLS/SSL configuration for Atlas connection
- Add keepAlive and proper timeout settings (30s socket timeout)
- Create centralized API error handler (lib/apiHandler.js)
- Refactor all API endpoints to use shared handler
- Remove 200+ lines of duplicate timeout/error logic
- Add input validation for API requests
- Fix admin page security (move auth to server-side)
- Verify build succeeds and app runs locally"
git push origin main
```

## Detailed Commit (if preferred)
```bash
git add lib/mongodb.js lib/apiHandler.js
git commit -m "feat: Add TLS/SSL config and centralized error handling

BREAKING CHANGE: API endpoints now use consistent error handling

- Add TLS/SSL configuration to MongoDB connection
- Implement keepAlive for persistent connections
- Extend socket timeout to 30 seconds
- Create withApiHandler wrapper for consistent error responses
- Add validateRequired helper for input validation

Closes: SSL/TLS connection error issue"

git add pages/api/menu/index.js pages/api/categories/index.js pages/api/promotions/index.js
git commit -m "refactor: Simplify API endpoints with shared handler

- Refactor /api/menu endpoint (-35 lines)
- Refactor /api/categories endpoint (-15 lines)
- Refactor /api/promotions endpoint (-20 lines)
- Use withApiHandler for consistent error handling
- Move auth logic to dedicated middleware"

git add pages/admin.js
git commit -m "fix: Move authentication to server-side

- Remove client-side password validation
- Use server API Bearer token authentication
- Improve security by not exposing password validation logic"

git push origin main
```

## Verify Before Pushing
```bash
npm run lint
npm run build
npm run dev  # Test locally, should work at http://localhost:3001
```
