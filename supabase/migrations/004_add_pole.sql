-- ============================================================
-- Migration 004: Add pole position to race_results
-- Run this in Supabase SQL Editor
-- ============================================================

ALTER TABLE race_results ADD COLUMN IF NOT EXISTS pole boolean DEFAULT false;
