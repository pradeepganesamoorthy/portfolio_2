#!/bin/bash

echo "🔧 Fixing Portfolio Database..."
echo ""

# Step 1: Generate Prisma Client
echo "Step 1: Generating Prisma Client..."
npx prisma generate

# Step 2: Push schema to database
echo ""
echo "Step 2: Pushing schema to database..."
npx prisma db push --accept-data-loss

# Step 3: Verify
echo ""
echo "✅ Database fixed!"
echo ""
echo "Now run: npm run dev"
