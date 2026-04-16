// ============================================================
// Carrera Racing Club — Server-Side Data Fetching
// ============================================================

import { createClient } from './supabase/server'
import { Driver, RaceDay, RaceResult, RaceDayDetail, CupStandings } from './types'
import { Cup, CUPS } from './constants'
import { calculateCupStandings } from './calculations'

// ---------------------
// Drivers
// ---------------------

export async function getDrivers(): Promise<Driver[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('number', { ascending: true })

  if (error) throw new Error(`Failed to fetch drivers: ${error.message}`)
  return data ?? []
}

// ---------------------
// Race Days
// ---------------------

export async function getRaceDays(): Promise<RaceDay[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('race_days')
    .select('*')
    .order('round_number', { ascending: true })

  if (error) throw new Error(`Failed to fetch race days: ${error.message}`)
  return data ?? []
}

export async function getRaceDayDetail(id: string): Promise<RaceDayDetail | null> {
  const supabase = await createClient()

  const [{ data: raceDay, error: rdError }, { data: results, error: rError }] = await Promise.all([
    supabase.from('race_days').select('*').eq('id', id).single(),
    supabase.from('race_results').select('*').eq('race_day_id', id),
  ])

  if (rdError || !raceDay) return null
  if (rError) throw new Error(`Failed to fetch race results: ${rError.message}`)

  return {
    ...raceDay,
    results: results ?? [],
    isComplete: (results ?? []).length === 24, // 6 drivers × 4 races
  }
}

// ---------------------
// Race Results
// ---------------------

export async function getRaceResults(): Promise<RaceResult[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('race_results')
    .select('*')

  if (error) throw new Error(`Failed to fetch race results: ${error.message}`)
  return data ?? []
}

export async function getRaceDayResults(raceDayId: string): Promise<RaceResult[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('race_results')
    .select('*')
    .eq('race_day_id', raceDayId)

  if (error) throw new Error(`Failed to fetch race day results: ${error.message}`)
  return data ?? []
}

// ---------------------
// Standings
// ---------------------

export async function getAllStandings(): Promise<Record<Cup, CupStandings>> {
  const [drivers, raceDays, results] = await Promise.all([
    getDrivers(),
    getRaceDays(),
    getRaceResults(),
  ])

  const standings = {} as Record<Cup, CupStandings>
  for (const cup of CUPS) {
    standings[cup] = calculateCupStandings(cup, drivers, raceDays, results)
  }
  return standings
}

export async function getCupStandings(cup: Cup): Promise<CupStandings> {
  const [drivers, raceDays, results] = await Promise.all([
    getDrivers(),
    getRaceDays(),
    getRaceResults(),
  ])
  return calculateCupStandings(cup, drivers, raceDays, results)
}

// ---------------------
// Next Race Day
// ---------------------

export async function getNextRaceDay(): Promise<RaceDay | null> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('race_days')
    .select('*')
    .gte('date', today)
    .eq('cancelled', false)
    .order('date', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`Failed to fetch next race day: ${error.message}`)
  return data
}

// ---------------------
// Admin: Upsert Results
// ---------------------

export async function upsertRaceResults(results: Omit<RaceResult, 'id' | 'created_at'>[]): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('race_results')
    .upsert(results, { onConflict: 'race_day_id,driver_id,cup,race_number' })

  if (error) throw new Error(`Failed to upsert results: ${error.message}`)
}

export async function updateRaceDay(id: string, data: Partial<RaceDay>): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('race_days')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(`Failed to update race day: ${error.message}`)
}
