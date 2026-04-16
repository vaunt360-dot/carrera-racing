-- ============================================================
-- Carrera Racing Club — Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DRIVERS
-- ============================================================
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  color text NOT NULL,
  number int NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- RACE DAYS (20 events: April 2026 – November 2027)
-- ============================================================
CREATE TABLE race_days (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  round_number int NOT NULL CHECK (round_number BETWEEN 1 AND 20),
  cancelled boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- RACE RESULTS
-- points auto-calculated from position/dns
-- ============================================================
CREATE TABLE race_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  race_day_id uuid NOT NULL REFERENCES race_days(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES drivers(id),
  cup text NOT NULL CHECK (cup IN ('nascar', 'classic')),
  race_number int NOT NULL CHECK (race_number IN (1, 2)),
  position int CHECK (position BETWEEN 1 AND 6),
  dns boolean DEFAULT false,
  points int GENERATED ALWAYS AS (
    CASE
      WHEN dns = true THEN 0
      WHEN position = 1 THEN 8
      WHEN position = 2 THEN 6
      WHEN position = 3 THEN 4
      WHEN position = 4 THEN 3
      WHEN position = 5 THEN 2
      WHEN position = 6 THEN 1
      ELSE 0
    END
  ) STORED,
  created_at timestamptz DEFAULT now(),
  UNIQUE (race_day_id, driver_id, cup, race_number)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read drivers" ON drivers FOR SELECT USING (true);
CREATE POLICY "Public read race_days" ON race_days FOR SELECT USING (true);
CREATE POLICY "Public read race_results" ON race_results FOR SELECT USING (true);

-- Authenticated write access (admin only)
CREATE POLICY "Auth write drivers" ON drivers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write race_days" ON race_days FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write race_results" ON race_results FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_race_results_day ON race_results(race_day_id);
CREATE INDEX idx_race_results_driver ON race_results(driver_id);
CREATE INDEX idx_race_results_cup ON race_results(cup);
CREATE INDEX idx_race_days_round ON race_days(round_number);
