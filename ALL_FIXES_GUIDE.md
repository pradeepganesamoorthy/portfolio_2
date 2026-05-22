# 🔧 Complete Fix Guide - All 7 Issues

## Issues to Fix:
1. ❌ Hero Image not loading correctly
2. ❌ Intro video not playing perfectly
3. ❌ Project videos not visible
4. ❌ No toggle button for video section
5. ❌ "View on YouTube" button not working
6. ❌ "Publish All" button not on all admin pages
7. ❌ Database not in sync

---

## Fix 1: Database Sync (CRITICAL - Do This First!)

```bash
# Run this script I created:
chmod +x fix_database.sh
./fix_database.sh

# OR run these commands manually:
npx prisma generate
npx prisma db push --accept-data-loss
```

**What this does:**
- Adds missing `youtubeId`, `showInGallery`, `projectName`, `description` fields to Video table
- Adds `VideoConfig` table
- Fixes all schema mismatches

---

## Fix 2: Hero Profile Image

The issue is the image path format. Check your database:

```sql
-- The profileImage should be an absolute path like:
"/uploads/profile.jpg"

-- NOT a relative path like:
"uploads/profile.jpg"
```

**Quick fix in admin:**
1. Go to `/admin` → Images tab
2. Re-upload your profile picture
3. Publish

---

## Fix 3 & 4: Intro Video + Project Videos

**Current YouTube URL:** `https://youtu.be/2n4MBM36SlU?si=ERqSzlczy1HZVMI1`

The video URL has tracking parameters (`?si=`). Extract clean ID: `2n4MBM36SlU`

**Test intro video:**
```bash
# In browser console at localhost:3000/admin
fetch('/api/videos', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    type: 'intro',
    title: 'My Introduction',
    description: 'Introduction video',
    youtubeUrl: 'https://youtu.be/2n4MBM36SlU',
    projectName: '',
    order: 0
  })
}).then(r => r.json()).then(console.log)
```

Then publish:
```bash
fetch('/api/videos/publish', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ publishAll: true })
}).then(r => r.json()).then(console.log)
```

---

## Fix 5: "View on YouTube" Button

The button is in admin panel. It should open the YouTube URL.

Check: Does your admin Videos tab have this code?
```tsx
<a
  href={video.youtubeUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  View on YouTube ↗
</a>
```

---

## Fix 6: Global "Publish All" Button

Need to add to admin layout. Will create in next update.

---

## Fix 7: Toggle Buttons for Video Section

**Global Toggle:** Controls if video section shows at all
**Per-Video Toggle:** Controls which videos show in gallery

These need to be added to admin panel.

---

## Testing Checklist

After running fix_database.sh:

1. ✅ Visit `http://localhost:3000`
2. ✅ Check Hero - does 3D scene load?
3. ✅ Check if intro video appears in corner
4. ✅ Scroll down - do all sections load?
5. ✅ Go to `/admin`
6. ✅ Go to Videos tab
7. ✅ Add a video
8. ✅ Publish
9. ✅ Refresh homepage - video should appear

---

## Quick Debug Commands

**Check if videos exist:**
```bash
# In project folder:
npx prisma studio
# Opens GUI at localhost:5555
# Check Video table
```

**Check API response:**
```bash
curl http://localhost:3000/api/videos?type=intro&published=true
```

Should return:
```json
{
  "videos": [{
    "id": "...",
    "youtubeId": "2n4MBM36SlU",
    "title": "My Introduction",
    ...
  }]
}
```

---

## Next Steps

Once database is synced, I'll create:
1. Fixed admin panel with all buttons
2. Toggle controls
3. Proper video display
4. Global "Publish All"

Run the database fix first, then let me know what still isn't working!
