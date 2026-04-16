// ============================================================
// Carrera Racing Club — Championship Calculations Engine
// ============================================================
// RULES:
//  - 20 race days total, April 2026 – November 2027
//  - Each day: 4 races (NASCAR R1, NASCAR R2, Classic R1, Classic R2)
//  - Points: 1st=8, 2nd=6, 3rd=4, 4th=3, 5th=2, 6th=1, DNS=0
//  - Standings: best 15 of 20 days count
//  - DROPS: 5 worst days are dropped (based on SUM of all 4 races per day)
//  - DYNAMIC: drops are applied from race day 16 onward
//    (days 1–15: no drops; day 16: drop 1; day 17: drop 2; …; day 20: drop 5)
//  - Nascar & Classic Cup are SEPARATE championships
//  - Both cups share the same dropped days (calculated from combined 4-race total)
// ============================================================

import { Driver, RaceDay, RaceResult, DriverDayResult, DriverStanding, CupStandings } from './types'
import { Cup, COUNTED_RACE_DAYS, TOTAL_RACE_DAYS } from './constants'

/**
 * Calculate which race days are dropped for a given driver
 * based on the combined 4-race total per day.
 */
export function getDroppedDayIds(
  dayResults: DriverDayResult[],
  completedDays: number
): Set<string> {
  // Only start dropping from day 16 onwards
  const toDrop = Math.max(0, completedDays - COUNTED_RACE_DAYS)
  if (toDrop === 0) return new Set()

  const sorted = [...dayResults].sort((a, b) => a.dayTotal - b.dayTotal)
  return new Set(sorted.slice(0, toDrop).map(d => d.raceDayId))
}

/**
 * Build per-driver, per-day result summaries from raw race results
 */
export function buildDriverDayResults(
  driverId: string,
  raceDays: RaceDay[],
  results: RaceResult[]
): DriverDayResult[] {
  const driverResults = results.filter(r => r.driver_id === driverId)

  return raceDays.map(day => {
    const dayResults = driverResults.filter(r => r.race_day_id === day.id)

    const get = (cup: Cup, raceNumber: 1 | 2): number => {
      const r = dayResults.find(r => r.cup === cup && r.race_number === raceNumber)
      return r ? r.points : 0
    }

    const nascarR1 = get('nascar', 1)
    const nascarR2 = get('nascar', 2)
    const classicR1 = get('classic', 1)
    const classicR2 = get('classic', 2)

    return {
      raceDayId: day.id,
      roundNumber: day.round_number,
      date: day.date,
      cancelled: day.cancelled,
      nascarR1,
      nascarR2,
      classicR1,
      classicR2,
      nascarTotal: nascarR1 + nascarR2,
      classicTotal: classicR1 + classicR2,
      dayTotal: nascarR1 + nascarR2 + classicR1 + classicR2,
    }
  })
}

/**
 * Calculate cup standings with drop logic applied
 */
export function calculateCupStandings(
  cup: Cup,
  drivers: Driver[],
  raceDays: RaceDay[],
  results: RaceResult[]
): CupStandings {
  // Count completed race days (have at least one result)
  const completedDayIds = new Set(results.map(r => r.race_day_id))
  const completedDays = raceDays.filter(d => completedDayIds.has(d.id)).length
  const activeDroppingCount = Math.max(0, completedDays - COUNTED_RACE_DAYS)

  const standings: DriverStanding[] = drivers.map(driver => {
    const dayResults = buildDriverDayResults(driver.id, raceDays, results)
    const droppedDayIds = getDroppedDayIds(dayResults, completedDays)

    // Cup points: only non-dropped days
    const cupPoints = dayResults
      .filter(d => !droppedDayIds.has(d.raceDayId))
      .reduce((sum, d) => sum + (cup === 'nascar' ? d.nascarTotal : d.classicTotal), 0)

    const totalRawPoints = dayResults
      .reduce((sum, d) => sum + (cup === 'nascar' ? d.nascarTotal : d.classicTotal), 0)

    const droppedPoints = dayResults
      .filter(d => droppedDayIds.has(d.raceDayId))
      .reduce((sum, d) => sum + (cup === 'nascar' ? d.nascarTotal : d.classicTotal), 0)

    // Wins: first place in either race of the cup on a non-dropped day
    const cupResults = results.filter(r => r.driver_id === driver.id && r.cup === cup)
    const wins = cupResults.filter(r => {
      const day = raceDays.find(d => d.id === r.race_day_id)
      return r.position === 1 && day && !droppedDayIds.has(day.id)
    }).length

    const podiums = cupResults.filter(r => {
      const day = raceDays.find(d => d.id === r.race_day_id)
      return r.position !== null && r.position <= 3 && day && !droppedDayIds.has(day.id)
    }).length

    return {
      driver,
      cupPoints,
      totalRawPoints,
      droppedPoints,
      position: 0, // assigned after sort
      wins,
      podiums,
      dayResults,
      droppedDayIds,
    }
  })

  // Sort by cup points desc, then wins as tiebreaker
  standings.sort((a, b) => b.cupPoints - a.cupPoints || b.wins - a.wins)
  standings.forEach((s, i) => { s.position = i + 1 })

  return { cup, standings, completedDays, activeDroppingCount }
}

/**
 * Calculate both cup standings at once
 */
export function calculateAllStandings(
  drivers: Driver[],
  raceDays: RaceDay[],
  results: RaceResult[]
) {
  return {
    nascar: calculateCupStandings('nascar', drivers, raceDays, results),
    classic: calculateCupStandings('classic', drivers, raceDays, results),
  }
}

/**
 * Get season progression data for charts
 * Returns cumulative points after each race day (with drops applied at that point in time)
 */
export function getSeasonProgression(
  cup: Cup,
  driver: Driver,
  raceDays: RaceDay[],
  results: RaceResult[]
): Array<{ round: number; date: string; points: number; isDropped: boolean }> {
  const dayResults = buildDriverDayResults(driver.id, raceDays, results)

  // For each completed day, simulate what the standings would have been
  const progression: Array<{ round: number; date: string; points: number; isDropped: boolean }> = []

  const completedDayIds = new Set(results.map(r => r.race_day_id))
  const completedDays = raceDays.filter(d => completedDayIds.has(d.id))

  completedDays.forEach((_, idx) => {
    const daysUpToNow = dayResults.slice(0, idx + 1)
    const completedCount = daysUpToNow.length
    const droppedIds = getDroppedDayIds(daysUpToNow, completedCount)

    const points = daysUpToNow
      .filter(d => !droppedIds.has(d.raceDayId))
      .reduce((sum, d) => sum + (cup === 'nascar' ? d.nascarTotal : d.classicTotal), 0)

    const day = completedDays[idx]
    progression.push({
      round: day.round_number,
      date: day.date,
      points,
      isDropped: droppedIds.has(day.id),
    })
  })

  return progression
}

/**
 * Get points value for a position
 */
export function getPoints(position: number | null, dns: boolean): number {
  if (dns || position === null) return 0
  const map: Record<number, number> = { 1: 8, 2: 6, 3: 4, 4: 3, 5: 2, 6: 1 }
  return map[position] ?? 0
}

/**
 * Format gap to leader string
 */
export function formatGap(leaderPoints: number, driverPoints: number): string {
  if (leaderPoints === driverPoints) return 'LEADER'
  return `-${leaderPoints - driverPoints}`
}
