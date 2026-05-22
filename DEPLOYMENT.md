# 🚀 Deployment Guide — Go Live in 15 Minutes

## Free Hosting: Vercel + Neon PostgreSQL

Total cost: **₹0/month**

---

## Prerequisites

- [ ] GitHub account (free)
- [ ] Vercel account (free)
- [ ] Neon account (free)
- [ ] Your portfolio code pushed to GitHub

---

## Part 1: Database Setup (5 min)

### Step 1: Create Neon Database
1. Go to **neon.tech**
2. Sign up with GitHub
3. Click **Create Project**
4. Name it: `portfolio`
5. Select region: **AWS / US East (cheapest, fastest from India)**
6. Click **Create**

### Step 2: Get Connection String
1. In your new project → **Dashboard**
2. Find **Connection Details**
3. Click **Copy** on the connection string
4. It looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb
   ```
5. Save this — you'll need it in 2 minutes

✅ **Result**: You have a free cloud PostgreSQL database

---

## Part 2: Deploy to Vercel (5 min)

### Step 1: Push Code to GitHub
If not already done:
```bash
cd portfolio
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to **vercel.com**
2. Sign in with GitHub
3. Click **Add New** → **Project**
4. Find your `portfolio` repo → Click **Import**
5. **Don't deploy yet!** Scroll down first...

### Step 3: Add Environment Variables
Before deploying, add these in the **Environment Variables** section:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste your Neon connection string |
| `JWT_SECRET` | `pradeep-portfolio-live-secret-2025` |

Make sure both are set for: **Production, Preview, Development**

### Step 4: Deploy
1. Click **Deploy**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://portfolio-abc123.vercel.app`

✅ **Result**: Your site is live!

---

## Part 3: Initialize Database (5 min)

Your database is empty. Let's add your data.

### Option A: From Your Local Machine (Easiest)
```bash
# In your portfolio folder
# Update .env with the Neon connection string
echo 'DATABASE_URL="your-neon-string-here"' > .env
echo 'JWT_SECRET="pradeep-portfolio-live-secret-2025"' >> .env

# Push schema and seed data
npm run db:push
npm run db:seed
```

✅ Done! Your live site now has all your resume data.

### Option B: Using Vercel CLI
```bash
npm install -g vercel

# Link to your project
vercel link

# Run seed remotely
vercel env pull
npm run db:push
npm run db:seed
```

---

## Part 4: Verify (2 min)

### Check Your Live Site
1. Go to your Vercel URL: `https://portfolio-abc123.vercel.app`
2. Should see your portfolio with all sections
3. Try login: `admin` / `admin`
4. Change credentials when prompted

### Test Everything
- [ ] Hero section loads with 3D scene
- [ ] About section shows your info
- [ ] Skills, Experience, Projects all populated
- [ ] Download Resume works
- [ ] GitHub repos appear (if username set)
- [ ] Admin panel accessible at `/admin`

---

## Part 5: Custom Domain (Optional, ~₹700/year)

### Buy Domain
1. Go to **Namecheap.com** or **GoDaddy**
2. Search: `pradeepg.in` or `pradeepganesamoorthy.dev`
3. Buy (₹500-1200/year)

### Connect to Vercel
1. In Vercel → Your project → **Settings** → **Domains**
2. Click **Add**
3. Enter your domain: `pradeepg.in`
4. Vercel shows DNS records to add
5. Go to Namecheap/GoDaddy → DNS settings
6. Add the records shown by Vercel:
   - Type: `A`, Value: `76.76.21.21`
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
7. Wait 10-60 minutes for DNS to propagate

### Update URLs
1. Edit `src/app/layout.tsx` → Change URL to your domain
2. Edit `src/app/sitemap.ts` → Change URL to your domain
3. Edit `public/robots.txt` → Change URL to your domain
4. Commit and push → Vercel auto-redeploys

✅ Now your site is at: `https://pradeepg.in`

---

## 🔄 Update Workflow

Every time you want to update your portfolio:

```bash
# 1. Make changes locally
npm run dev  # Test at localhost:3000

# 2. Commit and push
git add .
git commit -m "Update experience section"
git push

# 3. Vercel automatically deploys (2 min)
# Check: https://your-site.vercel.app
```

**No manual deploy needed!** Push to GitHub = Live on Vercel

---

## 📊 Monitor Usage (Free Limits)

### Vercel Free Tier
- ✅ 100GB bandwidth/month (plenty for portfolio)
- ✅ Unlimited deploys
- ✅ Automatic HTTPS
- ✅ Auto-scaling
- ✅ Analytics dashboard

### Neon Free Tier
- ✅ 0.5GB storage (more than enough)
- ✅ Always-on compute (10 hours/day active, then pauses)
- ✅ Auto-resume on request
- ✅ No credit card required

You'll **never hit these limits** with a portfolio site.

---

## 🛠️ Troubleshooting

### Build Failed on Vercel
**Error**: `DATABASE_URL is not defined`

**Fix**: 
1. Vercel → Project → Settings → Environment Variables
2. Add `DATABASE_URL` and `JWT_SECRET`
3. Redeploy

---

### Site Loads but No Data
**Problem**: Database not seeded

**Fix**:
```bash
# From your local machine
npm run db:push
npm run db:seed
```

---

### Can't Login to Admin
**Problem**: Admin credentials not seeded

**Fix**:
```bash
npm run db:seed
```

Default: `admin` / `admin`

---

### Vercel URL is Ugly
**Problem**: Want custom domain

**Solution**: See "Part 5: Custom Domain" above

---

### Database Connection Timeout
**Problem**: Neon database sleeping

**Solution**: This is normal on free tier. First request wakes it (takes 2-3 seconds), then it's fast. Upgrade to $19/month for always-on.

---

## 🎯 Production Checklist

Before sharing your portfolio:

- [ ] Site loads fast (check PageSpeed Insights)
- [ ] All sections have content
- [ ] Profile picture uploaded
- [ ] Resume downloadable
- [ ] GitHub repos showing
- [ ] Contact info correct
- [ ] Admin password changed from default
- [ ] Custom domain added (optional)
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Google

---

## 📈 Post-Launch

### Week 1
- [ ] Share on LinkedIn
- [ ] Add to email signature
- [ ] Send to recruiters
- [ ] Post on Twitter/X

### Month 1
- [ ] Check Google Analytics (if added)
- [ ] Monitor Search Console performance
- [ ] Update with new projects
- [ ] Add blog posts (optional)

### Ongoing
- Update every 2-4 weeks
- Add new certifications
- Keep experience current
- Monitor uptime (Vercel has 99.9% SLA)

---

## 💰 Costs Summary

| Service | Free Tier | Paid (if you outgrow) |
|---------|-----------|----------------------|
| Vercel Hosting | 100GB/month | $20/month for Pro |
| Neon Database | 0.5GB storage | $19/month always-on |
| Custom Domain | - | ₹700/year |
| Google Search Console | Free forever | - |
| SSL Certificate | Free (auto) | - |

**Total for portfolio**: ₹0/month + ₹700/year domain (optional)

---

## 🆘 Get Help

**Vercel issues:**
- Docs: vercel.com/docs
- Discord: vercel.com/discord

**Neon issues:**
- Docs: neon.tech/docs
- Discord: neon.tech/discord

**Portfolio bugs:**
- Check `TROUBLESHOOTING.md` in this repo
- GitHub Issues (if repo is public)

---

## ✅ You're Done!

Your portfolio is now:
- ✅ Live on the internet
- ✅ Fast (global CDN)
- ✅ Secure (HTTPS)
- ✅ Auto-deploying (push to update)
- ✅ Free (no monthly cost)
- ✅ Scalable (handles traffic spikes)
- ✅ Professional (custom domain optional)

Share it with the world! 🎉
