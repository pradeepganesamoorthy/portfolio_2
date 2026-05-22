# 🔧 Database Error Fix

## Error
```
The column `Portfolio.createdAt` does not exist in the current database.
```

## Cause
Your database schema is outdated. The Prisma schema has fields that don't exist in your actual database yet.

## ✅ Solution (3 Steps)

### Step 1: Stop the Server
Press `Ctrl+C` in your terminal to stop the dev server.

### Step 2: Push Schema to Database
```bash
npx prisma db push
```

This will:
- Add missing `createdAt` and `updatedAt` columns
- Add the `Video` table
- Add the `VideoConfig` table
- Update all database tables to match the schema

You'll see output like:
```
✔ Generated Prisma Client
✔ The database is now in sync with the Prisma schema
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 4: Restart Server
```bash
npm run dev
```

## ✅ Done!
Your portfolio should now load without errors.

---

## If That Doesn't Work...

### Option A: Reset Database (Clean Slate)
```bash
# WARNING: This deletes all data
npx prisma migrate reset --force
npx prisma db push
npm run db:seed
npm run dev
```

### Option B: Check Database Connection
Make sure your `.env` file has the correct `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-secret-here"
```

---

## What npm run db:push Does

It synchronizes your database with your Prisma schema WITHOUT creating migrations:
- Adds missing tables
- Adds missing columns
- Updates existing tables
- **Does NOT delete data** (safe to run)

---

## After Fix - Test Checklist

1. Visit `http://localhost:3000` ✓
2. All sections load (Hero, About, Skills, etc.) ✓
3. Go to `/admin` ✓
4. Try adding a video ✓

If all work → You're good! 🎉
