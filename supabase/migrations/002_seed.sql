-- ============================================================
-- Carrera Racing Club — Seed Data
-- ============================================================

-- DRIVERS
INSERT INTO drivers (name, color, number) VALUES
  ('Rene',      '#E8002D', 1),
  ('Mike',      '#0096FF', 7),
  ('Christian', '#00C853', 23),
  ('Gerhard',   '#FF6B00', 44),
  ('Ralf',      '#9C27B0', 3),
  ('Wolfi',     '#FFD600', 99);

-- RACE DAYS (20 events, every 4 weeks on Thursday, starting 16.04.2026)
INSERT INTO race_days (date, round_number, cancelled) VALUES
  ('2026-04-16', 1,  false),
  ('2026-05-14', 2,  false),
  ('2026-06-11', 3,  false),
  ('2026-07-09', 4,  false),
  ('2026-08-06', 5,  false),
  ('2026-09-03', 6,  false),
  ('2026-10-01', 7,  false),
  ('2026-10-29', 8,  false),
  ('2026-11-26', 9,  false),
  ('2026-12-24', 10, false),
  ('2027-01-21', 11, false),
  ('2027-02-18', 12, false),
  ('2027-03-18', 13, false),
  ('2027-04-15', 14, false),
  ('2027-05-13', 15, false),
  ('2027-06-10', 16, false),
  ('2027-07-08', 17, false),
  ('2027-08-05', 18, false),
  ('2027-09-02', 19, false),
  ('2027-09-30', 20, false);
