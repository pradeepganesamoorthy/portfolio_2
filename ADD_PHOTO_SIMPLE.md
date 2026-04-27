# 🖼️ Add Your Profile Photo — 3 Simple Steps

## Easiest Method (No coding!)

### Step 1: Put your photo in the right folder
1. Find your photo (JPG or PNG recommended)
2. Rename it to `pradeep.jpg` (or keep the original name)
3. Copy it into: `portfolio/public/uploads/`

So the file should be at: `portfolio/public/uploads/pradeep.jpg`

---

### Step 2: Update the database
Open terminal in your portfolio folder and run:

```bash
npx prisma studio
```

This opens a database editor at http://localhost:5555

1. Click the **Portfolio** table on the left
2. Find the row where:
   - `section` = `about`
   - `key` = `main`
3. Click to edit the **draftValue** column
4. You'll see JSON like this:
```json
{
  "bio": "Results-driven Data Engineer...",
  "location": "Bangalore, Karnataka",
  "email": "pradeepganesh111@gmail.com",
  "phone": "+91 8807526370",
  "linkedin": "https://linkedin.com/in/pradeepganesamoorthy",
  "github": "https://github.com/pradeepganesh"
}
```

5. Add this line BEFORE the last `}`:
```json
  "profileImage": "/uploads/pradeep.jpg"
```

So it becomes:
```json
{
  "bio": "Results-driven Data Engineer...",
  "location": "Bangalore, Karnataka",
  "email": "pradeepganesh111@gmail.com",
  "phone": "+91 8807526370",
  "linkedin": "https://linkedin.com/in/pradeepganesamoorthy",
  "github": "https://github.com/pradeepganesh",
  "profileImage": "/uploads/pradeep.jpg"
}
```

6. Click the **Save 1 change** button
7. Now also edit **liveValue** column the same way
8. Save again

---

### Step 3: See your photo!
1. Go back to your portfolio: http://localhost:3000
2. Scroll to the About section
3. Your photo will appear with a colorful glowing rainbow ring! 🌈

---

## 🎨 Photo Requirements

**Best results:**
- Square photo (500x500 pixels minimum)
- Professional headshot or portrait
- Good lighting, clear face
- JPG or PNG format
- Under 2MB file size

The photo will show as a 180px circle with an animated rainbow glow around it.

---

## ❓ Troubleshooting

**Can't see the photo?**
- Check the filename matches exactly: `/uploads/pradeep.jpg`
- Make sure the file is actually in `public/uploads/`
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Photo looks pixelated?**
- Use a higher resolution source image (at least 500x500px)

**Rainbow ring not glowing?**
- It's working! The ring pulses and shifts colors continuously
- Colors cycle through red → yellow → green → blue → purple → orange
