-- Migration 005: Add banner_url to race_days
ALTER TABLE race_days ADD COLUMN IF NOT EXISTS banner_url TEXT;
