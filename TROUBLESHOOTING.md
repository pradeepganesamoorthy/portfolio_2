# Portfolio Troubleshooting Guide

## Common Issues & Fixes

### 1. "Port 3000 already in use"

**Problem:** Another app is using port 3000  
**Fix:**
```bash
# Kill the process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or just use a different port:
npm run dev -- -p 3001
```

---

### 2. Database connection fails

**Problem:** `Error: P1001: Can't reach database server`  
**Fix:**
- Check your `.env` file exists and has the correct `DATABASE_URL`
- Verify the Neon connection string doesn't have extra quotes or spaces
- Make sure it ends with `?sslmode=require` (Neon includes this automatically)
- Test the connection in Neon dashboard → try running a query there first

---

### 3. Blank white page at localhost:3000

**Problem:** Nothing loads, just white screen  
**Fix:**
1. Wait 15-20 seconds — first compile is slow
2. Check terminal for errors
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

---

### 4. 3D scene not showing / particles missing

**Problem:** Hero section loads but no 3D animation  
**Fix:**
- This is normal on low-end devices or older browsers
- Make sure you're using Chrome, Firefox, or Edge (not Safari on old iOS)
- Check browser console (F12) for WebGL errors
- Try disabling browser extensions temporarily

---

### 5. "Module not found" errors

**Problem:** `Error: Cannot find module 'xyz'`  
**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### 6. Prisma errors after upgrade

**Problem:** `@prisma/client did not initialize yet`  
**Fix:**
```bash
# Regenerate Prisma client
npx prisma generate
npm run dev
```

---

### 7. Admin login not working

**Problem:** Can't log in with admin/admin  
**Fix:**
- Database might not be seeded. Run:
```bash
npm run db:seed
```
- If you already changed credentials and forgot them, reset:
```bash
# Connect to your database and run:
npx prisma studio
# → Delete the admin record
# → Re-run: npm run db:seed
```

---

### 8. Rainbow borders not showing

**Problem:** Card hover effects missing  
**Fix:**
- Clear browser cache (Ctrl+Shift+Delete)
- Make sure you extracted v2 files correctly — check that `globals.css` has `@keyframes rainbowShift`
- Hard refresh the page

---

### 9. Deploy to Vercel fails

**Problem:** Build fails on Vercel  
**Fix:**
- Check Vercel build logs for the exact error
- Most common: missing environment variables
  - Go to Vercel project → Settings → Environment Variables
  - Add `DATABASE_URL` and `JWT_SECRET`
  - Redeploy

---

### 10. TypeScript errors

**Problem:** Red squiggly lines in VSCode  
**Fix:**
```bash
# Restart TypeScript server in VSCode:
# Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
# Type: "TypeScript: Restart TS Server"
```

---

## Still stuck?

1. Check the terminal output — error messages tell you exactly what's wrong
2. Delete `.next` folder and restart: `rm -rf .next && npm run dev`
3. Make sure you're running Node 18+ : `node --version`
4. Try the nuclear option:
```bash
rm -rf node_modules .next package-lock.json
npm install
npm run db:push
npm run db:seed
npm run dev
```

---

## Performance Tips

### Slow initial load?
- Normal on first run — Next.js compiles on demand
- Subsequent page loads are instant (cached)

### 3D scene laggy?
- Reduce particle count in `ParticleField.tsx`: change `count={1800}` to `count={800}`
- Scene auto-adapts to device performance

### Mobile performance?
- Custom cursor is disabled on mobile automatically
- 3D scene uses lower quality on mobile devices
- All animations use `will-change` for GPU acceleration

---

## Quick Health Check

Run these to verify everything is working:

```bash
# 1. Node version (should be 18+)
node --version

# 2. Check .env exists
cat .env

# 3. Check database connection
npx prisma studio
# Should open a GUI at localhost:5555

# 4. Verify packages installed
ls node_modules | wc -l
# Should show 900+ packages

# 5. Check Next.js can compile
npm run build
# Should complete without errors
```
