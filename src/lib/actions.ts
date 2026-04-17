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
    isComplete: (results ?? []).length === (raceDay.round_number === 1 ? 12 : 24), // round 1: NASCAR only (12), round 2+: all cups (24)
  }
}

// ---------------------
// Driver Stats
// ---------------------

export interface DriverStats {
  wins: number
  podiums: number
  poles: number
  starts: number
  dns: number
  bestPosition: number | null
  avgPoints: number       // avg points per race (incl. pole bonus)
  // per-cup dropped points & raw totals
  nascarDroppedPoints: number
  classicDroppedPoints: number
  nascarRawPoints: number
  classicRawPoints: number
  nascarPosition: number | null
  classicPosition: number | null
  // trend: delta of combined cup points between last two race days
  trend: number | null    // positive = improving, negative = declining, null = not enough data
  droppedDayCount: number // total dropped race-day slots across both cups
}

export async function getDriverStats(): Promise<Record<string, DriverStats>> {
  const [drivers, raceDays, results] = await Promise.all([
    getDrivers(),
    getRaceDays(),
    getRaceResults(),
  ])

  // Cup standings for WM positions and drop info
  const { calculateAllStandings } = await import('./calculations')
  const { nascar, classic } = calculateAllStandings(drivers, raceDays, results)

  const nascarPos: Record<string, number> = {}
  const classicPos: Record<string, number> = {}
  const nascarDropped: Record<string, number> = {}
  const classicDropped: Record<string, number> = {}
  const nascarRaw: Record<string, number> = {}
  const classicRaw: Record<string, number> = {}
  const droppedDayCount: Record<string, number> = {}
  const trendMap: Record<string, number | null> = {}

  for (const ds of nascar.standings) {
    nascarPos[ds.driver.id] = ds.position
    nascarDropped[ds.driver.id] = ds.droppedPoints
    nascarRaw[ds.driver.id] = ds.totalRawPoints
    droppedDayCount[ds.driver.id] = (droppedDayCount[ds.driver.id] ?? 0) + ds.droppedDayIds.size
  }
  for (const ds of classic.standings) {
    classicPos[ds.driver.id] = ds.position
    classicDropped[ds.driver.id] = ds.droppedPoints
    classicRaw[ds.driver.id] = ds.totalRawPoints
    droppedDayCount[ds.driver.id] = (droppedDayCount[ds.driver.id] ?? 0) + ds.droppedDayIds.size
  }

  // Trend: delta of (nascar + classic) cup points between last two completed race days
  const completedDays = nascar.completedDays
  if (completedDays >= 2) {
    for (const ds of nascar.standings) {
      const classicDs = classic.standings.find(s => s.driver.id === ds.driver.id)
      const days = ds.dayResults.filter((_, i) => i < completedDays)
      const last = days[days.length - 1]
      const prev = days[days.length - 2]
      const lastN = last?.nascarTotal ?? 0
      const prevN = prev?.nascarTotal ?? 0
      const lastC = classicDs?.dayResults[days.length - 1]?.classicTotal ?? 0
      const prevC = classicDs?.dayResults[days.length - 2]?.classicTotal ?? 0
      trendMap[ds.driver.id] = (lastN + lastC) - (prevN + prevC)
    }
  }

  // Base stats from raw results
  const stats: Record<string, DriverStats> = {}
  let totalPointsMap: Record<string, number> = {}
  let racesMap: Record<string, number> = {}

  for (const r of results) {
    if (!stats[r.driver_id]) {
      stats[r.driver_id] = {
        wins: 0, podiums: 0, poles: 0, starts: 0, dns: 0,
        bestPosition: null, avgPoints: 0,
        nascarDroppedPoints: nascarDropped[r.driver_id] ?? 0,
        classicDroppedPoints: classicDropped[r.driver_id] ?? 0,
        nascarRawPoints: nascarRaw[r.driver_id] ?? 0,
        classicRawPoints: classicRaw[r.driver_id] ?? 0,
        nascarPosition: nascarPos[r.driver_id] ?? null,
        classicPosition: classicPos[r.driver_id] ?? null,
        trend: trendMap[r.driver_id] ?? null,
        droppedDayCount: droppedDayCount[r.driver_id] ?? 0,
      }
      totalPointsMap[r.driver_id] = 0
      racesMap[r.driver_id] = 0
    }
    const s = stats[r.driver_id]
    if (r.dns) {
      s.dns++
    } else if (r.position !== null) {
      s.starts++
      if (r.position === 1) s.wins++
      if (r.position <= 3) s.podiums++
      if (s.bestPosition === null || r.position < s.bestPosition) s.bestPosition = r.position
      totalPointsMap[r.driver_id] += r.points + (r.pole ? 1 : 0)
      racesMap[r.driver_id]++
    }
    if (r.pole) s.poles++
  }

  // Compute avgPoints
  for (const id of Object.keys(stats)) {
    const races = racesMap[id] ?? 0
    stats[id].avgPoints = races > 0 ? Math.round((totalPointsMap[id] / races) * 10) / 10 : 0
    // Ensure drop/standings fields filled for drivers with 0 results
    stats[id].nascarDroppedPoints = nascarDropped[id] ?? 0
    stats[id].classicDroppedPoints = classicDropped[id] ?? 0
    stats[id].nascarRawPoints = nascarRaw[id] ?? 0
    stats[id].classicRawPoints = classicRaw[id] ?? 0
    stats[id].nascarPosition = nascarPos[id] ?? null
    stats[id].classicPosition = classicPos[id] ?? null
    stats[id].trend = trendMap[id] ?? null
    stats[id].droppedDayCount = droppedDayCount[id] ?? 0
  }

  // Fill in stats for drivers with no results at all
  for (const driver of drivers) {
    if (!stats[driver.id]) {
      stats[driver.id] = {
        wins: 0, podiums: 0, poles: 0, starts: 0, dns: 0,
        bestPosition: null, avgPoints: 0,
        nascarDroppedPoints: 0, classicDroppedPoints: 0,
        nascarRawPoints: 0, classicRawPoints: 0,
        nascarPosition: nascarPos[driver.id] ?? null,
        classicPosition: classicPos[driver.id] ?? null,
        trend: null,
        droppedDayCount: 0,
      }
    }
  }

  return stats
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
