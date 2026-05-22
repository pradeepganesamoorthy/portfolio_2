# 🚀 GODMODE Portfolio — Quick Start Guide

## What You Got

This is the **complete, production-ready portfolio** with:
- ✅ Full responsive (mobile, tablet, desktop)
- ✅ Profile picture upload in admin
- ✅ Resume upload & replace in admin
- ✅ Add new sections (education, experience, etc.)
- ✅ 3D animated hero with rainbow effects
- ✅ All your resume data pre-loaded

---

## 🏃 Fast Setup (10 minutes)

### Step 1: Unzip & Install
```bash
cd Downloads
unzip portfolio_godmode.zip
cd portfolio
npm install
```

### Step 2: Get Free Database
Go to **neon.tech** → Sign up → Create project → Copy connection string

### Step 3: Create .env File
```bash
cat > .env << 'ENV'
DATABASE_URL="paste-your-neon-string-here"
JWT_SECRET="pradeep-portfolio-secret-2025"
ENV
```

### Step 4: Setup Database
```bash
npm run db:push
npm run db:seed
```

### Step 5: Run
```bash
npm run dev
```
Open **http://localhost:3000**

---

## 🎨 First Things To Do

### 1. Change Default Password
- Click **admin** in header
- Login: `admin` / `admin`
- You'll be forced to set new credentials
- Choose strong password

### 2. Upload Your Picture
- Go to `/admin` → **Images** tab
- Choose your photo (square, 500x500px recommended)
- Click **Upload Image**
- Go to **Content** tab → **Publish All**
- Refresh site — your photo appears with rainbow glow!

### 3. Upload Your Latest Resume
- Go to `/admin` → **Resume** tab
- Choose your resume PDF or DOCX
- Click **Upload & Publish Resume**
- Download button on site now uses your file

### 4. Add Your High School
- Go to `/admin` → **Content** tab
- Click **+ Add New Item**
- Fill in:
  - Section: `education`
  - Key: `high_school`
  - Value:
  ```json
  {
    "degree": "Higher Secondary Certificate",
    "institution": "Your School Name",
    "location": "City, State",
    "startYear": "2010",
    "endYear": "2012"
  }
  ```
- Click **Add Item**
- Click **Publish All**

---

## 📱 Test Responsive Design

### Desktop (1920x1080)
- Full width layout
- 4-column grids
- Rainbow hover effects
- Custom cursor

### Tablet (768px)
- 2-column grids
- Simplified nav
- Touch-friendly

### Mobile (375px)
- 1-column layout
- Larger fonts
- Stacked stats
- No cursor

**How to test:**
- Chrome: F12 → Toggle device toolbar → Select iPhone/iPad
- Firefox: F12 → Responsive design mode
- Safari: Develop → Enter Responsive Design Mode

---

## 🎯 Common Tasks

### Add New Work Experience
```json
{
  "title": "Data Engineer",
  "company": "Company Name",
  "project": "Project Name",
  "location": "City or Remote",
  "startDate": "Jan 2023",
  "endDate": "Present",
  "current": true,
  "bullets": [
    "Achievement 1",
    "Achievement 2",
    "Achievement 3"
  ]
}
```

### Add New Certification
```json
{
  "title": "Certification Name",
  "issuer": "AWS or Google or Oracle",
  "date": "Dec 2024",
  "credentialUrl": "https://..."
}
```

### Add New Project
```json
{
  "title": "Project Name",
  "company": "Company or Personal",
  "period": "2024",
  "description": "What you built and impact",
  "tags": ["Python", "AWS", "Docker"],
  "featured": true
}
```

---

## 🌐 Deploy Free (Vercel + Neon)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "my portfolio"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### 2. Deploy to Vercel
- Go to **vercel.com**
- Sign in with GitHub
- Click **Add New → Project**
- Select your `portfolio` repo
- Add environment variables:
  - `DATABASE_URL` = your Neon string
  - `JWT_SECRET` = your secret key
- Click **Deploy**

### 3. Seed Live Database
```bash
# In your local terminal, run:
npm run db:push
npm run db:seed
```

Done! Your site is live at `https://portfolio-yourname.vercel.app`

---

## 🆘 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Database won't connect?**
- Check `.env` file exists
- Verify Neon connection string is correct
- Make sure it ends with `?sslmode=require`

**Image not showing after upload?**
- Check it uploaded: Look in `public/uploads/`
- Click **Publish All** in admin
- Hard refresh: Ctrl+Shift+R

**Can't add new item?**
- Make sure JSON is valid (use [jsonlint.com](https://jsonlint.com))
- Section name should match existing (education, experience)
- Key must be unique within that section

**3D scene not loading?**
- Wait 15-20 seconds on first load
- Clear browser cache
- Works best in Chrome/Firefox

---

## 📚 Documentation Files

Inside the zip you'll find:
- `README.md` — Overall project info
- `GODMODE_FEATURES.md` — Complete feature list (this file)
- `TROUBLESHOOTING.md` — Common issues & fixes
- `CHANGELOG.md` — What changed from v1 to godmode
- `FEATURES.md` — All portfolio features explained
- `QUICK_START_GODMODE.md` — This guide

---

## 🎉 You're All Set!

Your portfolio now has:
- ✅ Beautiful responsive design
- ✅ Easy image & resume uploads
- ✅ Add unlimited sections
- ✅ Full CMS control
- ✅ Rainbow animations
- ✅ 3D hero scene
- ✅ Production-ready code

**Next steps:**
1. Customize colors in `globals.css`
2. Add your own projects
3. Update experience section
4. Deploy to Vercel for free hosting
5. Share your portfolio link!

Questions? Check `TROUBLESHOOTING.md` or the other docs.
