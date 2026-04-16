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

-- RACE DAYS (20 events, monthly April 2026 – November 2027)
INSERT INTO race_days (date, round_number, cancelled) VALUES
  ('2026-04-18', 1,  false),
  ('2026-05-16', 2,  false),
  ('2026-06-20', 3,  false),
  ('2026-07-18', 4,  false),
  ('2026-08-15', 5,  false),
  ('2026-09-19', 6,  false),
  ('2026-10-17', 7,  false),
  ('2026-11-21', 8,  false),
  ('2027-01-16', 9,  false),
  ('2027-02-20', 10, false),
  ('2027-03-20', 11, false),
  ('2027-04-17', 12, false),
  ('2027-05-15', 13, false),
  ('2027-06-19', 14, false),
  ('2027-07-17', 15, false),
  ('2027-08-21', 16, false),
  ('2027-09-18', 17, false),
  ('2027-10-16', 18, false),
  ('2027-11-20', 19, false),
  ('2027-12-11', 20, false);
