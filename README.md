# Pradeep Ganesamoorthy — Portfolio

A production-ready, full-stack 3D animated portfolio for a Data Engineer.  
Built with **Next.js 14 · Prisma · PostgreSQL · Three.js · Framer Motion**.

---

## ✨ Features

- **3D hero scene** — connected particle network (Three.js)
- **Dark / light mode** — persistent toggle with `next-themes`
- **Admin CMS** — full CRUD on every section, draft + publish workflow
- **Resume parser** — upload PDF or DOCX → auto-extract sections
- **GitHub integration** — auto-fetch public repos, configurable filters
- **Resume download** — recruiters get a one-click download
- **Secure auth** — bcrypt passwords, JWT httpOnly cookies, force-change on first login
- **PostgreSQL** via Prisma — full persistence, no localStorage
- **Mobile responsive** — grid collapses gracefully on all breakpoints
- **Seeded with real data** — your full resume pre-loaded on first run

---

## 🗄️ Database Schema

| Model | Purpose |
|---|---|
| `Admin` | Hashed credentials, isDefault flag |
| `Portfolio` | All sections as JSON, draftValue vs liveValue |
| `ResumeFile` | Uploaded resume file paths, published flag |
| `GithubConfig` | GitHub username + display settings |
| `ProfileImage` | Profile picture + project thumbnails |

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL (local or Supabase / Neon)
- npm or pnpm

### 2. Clone & install

```bash
cd portfolio
npm install
```

### 3. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio"
JWT_SECRET="at-least-32-random-characters-here"
GITHUB_TOKEN=""   # optional but recommended
```

**Getting a DATABASE_URL fast (free options):**
- [Supabase](https://supabase.com) → new project → Settings → Database → Connection string (URI)
- [Neon](https://neon.tech) → new project → copy connection string
- Local: `postgresql://postgres:postgres@localhost:5432/portfolio`

### 4. Push schema & seed

```bash
npm run db:push    # creates tables
npm run db:seed    # seeds your resume data + admin account
```

### 5. Run

```bash
npm run dev
# → http://localhost:3000
```

### 6. First login

Go to `http://localhost:3000` → click **admin** link in the header footer  
Login: `admin` / `admin`  
You will be **forced to change credentials** on first login.

---

## 🛠️ Admin Panel

Navigate to `/admin` after login.

| Tab | What you can do |
|---|---|
| **Content** | Edit/hide/delete any portfolio section. Toggle visibility. Publish all drafts. |
| **GitHub** | Set your GitHub username. Repos auto-refresh every 5 min. |
| **Resume** | Upload PDF/DOCX → parsed → review extracted data |
| **Settings** | Change admin username + password |

### Draft vs Publish

- **Save** edits → stored as `draftValue` (not public)
- **Publish All** → copies `draftValue` → `liveValue` (goes live instantly)

---

## 🌐 Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `GITHUB_TOKEN` (optional)

### Self-hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t portfolio .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  portfolio
```

---

## 📂 File Uploads

Uploaded files (resume, images) are stored in `public/uploads/`.  
For production, replace with **S3 / Cloudflare R2 / Supabase Storage**.  
Update `src/app/api/upload/image/route.ts` and `src/app/api/resume/upload/route.ts` accordingly.

---

## 🎨 Customization

### Change accent color

In `src/app/globals.css`, update:
```css
--accent-warm: #c8602a;   /* your brand color */
--accent-cool: #2a6ec8;
```

### Add a new section

1. Add seed data in `prisma/seed.ts`
2. Create `src/components/sections/YourSection.tsx`
3. Import and add to `src/app/(public)/page.tsx`
4. Section auto-appears in the admin CMS

---

## 🔑 Security Notes

- Passwords hashed with **bcrypt (cost 12)**
- Auth via **HttpOnly, SameSite=Lax JWT cookie** (not accessible to JS)
- Admin routes protected server-side via `requireAdmin()`
- Default credentials forced to change on first login
- `JWT_SECRET` must be a strong random string in production

---

## 📧 Contact

**Pradeep Ganesamoorthy**  
pradeepganesh111@gmail.com · +91 8807526370 · Bangalore
