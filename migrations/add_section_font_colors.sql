-- Run this in your Neon database console
-- Adds per-section font color support to ThemeConfig

ALTER TABLE "ThemeConfig" 
ADD COLUMN IF NOT EXISTS "sectionFontColors" TEXT NOT NULL DEFAULT '{}';
