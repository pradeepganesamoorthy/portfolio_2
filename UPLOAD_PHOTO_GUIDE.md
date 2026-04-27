# How to Add Your Profile Picture

## Method 1: Using the Admin Panel (Easiest)

### Step 1: Upload the image
1. Go to your portfolio at `http://localhost:3000`
2. Click **admin** in the header → login
3. Go to **Settings** tab (or we'll add an Images tab)
4. Upload your photo (JPG, PNG, WebP supported)

### Step 2: Update the About section
1. Go to **Content** tab
2. Select **about** section
3. Click **Edit** on the "main" entry
4. Add this line to the JSON:
```json
{
  "bio": "Your bio text...",
  "location": "Bangalore, Karnataka",
  "email": "pradeepganesh111@gmail.com",
  "phone": "+91 8807526370",
  "linkedin": "https://linkedin.com/in/pradeepganesamoorthy",
  "github": "https://github.com/pradeepganesh",
  "profileImage": "/uploads/your-photo.jpg"
}
```
5. Click **Save Draft** → **Publish All**

---

## Method 2: Direct File Upload (Faster for now)

### Step 1: Add your photo to the project
1. Find your photo file (JPG or PNG)
2. Rename it to something simple like `pradeep.jpg`
3. Copy it into: `portfolio/public/uploads/pradeep.jpg`

### Step 2: Update the database directly
Open your terminal in the portfolio folder:

```bash
# Start Prisma Studio (database GUI)
npx prisma studio
```

This opens at `http://localhost:5555`

1. Click **Portfolio** table
2. Find the row where `section = "about"` and `key = "main"`
3. Click on the **draftValue** field
4. Edit the JSON to add:
```json
"profileImage": "/uploads/pradeep.jpg"
```
5. Save
6. Also update **liveValue** with the same change
7. Close Prisma Studio

### Step 3: Refresh your portfolio
Go to `http://localhost:3000` → you should see your photo in the About section with a colorful glowing ring!

---

## Method 3: Quick Seed Update (For fresh installs)

Edit `prisma/seed.ts` and update the about section:

```typescript
{
  section: 'about',
  key: 'main',
  draftValue: {
    bio: '...',
    location: 'Bangalore, Karnataka',
    email: 'pradeepganesh111@gmail.com',
    phone: '+91 8807526370',
    linkedin: 'https://linkedin.com/in/pradeepganesamoorthy',
    github: 'https://github.com/pradeepganesh',
    profileImage: '/uploads/pradeep.jpg',  // <-- ADD THIS
  },
  order: 1,
}
```

Then re-seed:
```bash
npm run db:seed
```

---

## Image Specifications

**Recommended:**
- Format: JPG or PNG
- Size: 500x500 pixels (square)
- File size: Under 500KB
- Professional headshot or portrait

**The app will:**
- Display it as a 180px circle
- Add a rainbow gradient glow ring around it
- Auto-optimize for web (Next.js Image component)

---

## Troubleshooting

**Image not showing?**
1. Check the file path is correct: `/uploads/pradeep.jpg`
2. Make sure the file exists in `public/uploads/`
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Check browser console (F12) for errors

**Image looks blurry?**
- Use a higher resolution source (at least 500x500px)
- JPG quality should be 85% or higher

**Rainbow ring not appearing?**
- The glow animates on hover
- Make sure you're using the updated About.tsx component
