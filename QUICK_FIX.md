# ⚡ Quick Fix - Database Error

## The Error You're Seeing:
```
The column `Portfolio.createdAt` does not exist in the current database.
```

## The Fix (Copy-Paste These Commands):

```bash
# 1. Stop the server (Ctrl+C)

# 2. Sync database with schema
npx prisma db push

# 3. Generate Prisma client
npx prisma generate

# 4. Start server again
npm run dev
```

That's it! Visit `http://localhost:3000` - it should work now.

---

## What Happened?

Your database was missing some columns. `npx prisma db push` added them.

## Safe?

Yes! This command adds missing columns WITHOUT deleting your data.

---

## Still Not Working?

Try a full reset (⚠️ deletes all data):

```bash
npx prisma migrate reset --force
npx prisma db push
npm run db:seed
npm run dev
```

---

**99% of the time, the first fix works!** ✅
