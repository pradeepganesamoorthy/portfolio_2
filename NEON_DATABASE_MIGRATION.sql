-- ========================================
-- NEON DATABASE MIGRATION SQL
-- Run this in your Neon SQL Editor
-- ========================================

-- Table: ThemeConfig
-- Stores color and theme customization settings
CREATE TABLE IF NOT EXISTS "ThemeConfig" (
  "id" TEXT PRIMARY KEY,
  "primaryColor" TEXT NOT NULL DEFAULT '#c77dff',
  "secondaryColor" TEXT NOT NULL DEFAULT '#4d96ff',
  "accentColor" TEXT NOT NULL DEFAULT '#ff6b6b',
  "navbarBgColor" TEXT NOT NULL DEFAULT 'rgba(0,0,0,0.8)',
  "textColor" TEXT NOT NULL DEFAULT '#ffffff',
  "hoverColor" TEXT NOT NULL DEFAULT '#ffd93d',
  "themePreset" TEXT NOT NULL DEFAULT 'custom',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: AnimationConfig
-- Stores hero background animation settings
CREATE TABLE IF NOT EXISTS "AnimationConfig" (
  "id" TEXT PRIMARY KEY,
  "selectedAnimation" TEXT NOT NULL DEFAULT 'particles-torus',
  "animationSpeed" TEXT NOT NULL DEFAULT 'normal',
  "useThemeColors" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Badge
-- Stores badges for skills, certifications, projects
CREATE TABLE IF NOT EXISTS "Badge" (
  "id" TEXT PRIMARY KEY,
  "section" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'preset',
  "iconName" TEXT,
  "customImage" TEXT,
  "color" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "visible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Badge table
CREATE INDEX IF NOT EXISTS "Badge_section_idx" ON "Badge"("section");
CREATE INDEX IF NOT EXISTS "Badge_order_idx" ON "Badge"("order");

-- Insert default theme config (optional - or let app create it)
INSERT INTO "ThemeConfig" ("id", "themePreset")
VALUES ('default', 'custom')
ON CONFLICT ("id") DO NOTHING;

-- Insert default animation config (optional - or let app create it)
INSERT INTO "AnimationConfig" ("id", "selectedAnimation")
VALUES ('default', 'particles-torus')
ON CONFLICT ("id") DO NOTHING;

-- ========================================
-- VERIFICATION QUERIES
-- Run these to verify tables were created
-- ========================================

-- Check ThemeConfig table
SELECT * FROM "ThemeConfig";

-- Check AnimationConfig table
SELECT * FROM "AnimationConfig";

-- Check Badge table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'Badge';

