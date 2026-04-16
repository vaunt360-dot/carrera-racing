-- ============================================================
-- Migration 003: Update race day dates
-- Every 4 weeks on Thursday, starting 16.04.2026
-- Run this in Supabase SQL Editor
-- ============================================================

UPDATE race_days SET date = '2026-04-16' WHERE round_number = 1;
UPDATE race_days SET date = '2026-05-14' WHERE round_number = 2;
UPDATE race_days SET date = '2026-06-11' WHERE round_number = 3;
UPDATE race_days SET date = '2026-07-09' WHERE round_number = 4;
UPDATE race_days SET date = '2026-08-06' WHERE round_number = 5;
UPDATE race_days SET date = '2026-09-03' WHERE round_number = 6;
UPDATE race_days SET date = '2026-10-01' WHERE round_number = 7;
UPDATE race_days SET date = '2026-10-29' WHERE round_number = 8;
UPDATE race_days SET date = '2026-11-26' WHERE round_number = 9;
UPDATE race_days SET date = '2026-12-24' WHERE round_number = 10;
UPDATE race_days SET date = '2027-01-21' WHERE round_number = 11;
UPDATE race_days SET date = '2027-02-18' WHERE round_number = 12;
UPDATE race_days SET date = '2027-03-18' WHERE round_number = 13;
UPDATE race_days SET date = '2027-04-15' WHERE round_number = 14;
UPDATE race_days SET date = '2027-05-13' WHERE round_number = 15;
UPDATE race_days SET date = '2027-06-10' WHERE round_number = 16;
UPDATE race_days SET date = '2027-07-08' WHERE round_number = 17;
UPDATE race_days SET date = '2027-08-05' WHERE round_number = 18;
UPDATE race_days SET date = '2027-09-02' WHERE round_number = 19;
UPDATE race_days SET date = '2027-09-30' WHERE round_number = 20;
