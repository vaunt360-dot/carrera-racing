import { Cup } from './constants'

export interface Driver {
  id: string
  name: string
  color: string
  number: number
  avatar_url: string | null
  created_at: string
}

export interface RaceDay {
  id: string
  date: string
  round_number: number
  cancelled: boolean
  notes: string | null
  created_at: string
}

export interface RaceResult {
  id: string
  race_day_id: string
  driver_id: string
  cup: Cup
  race_number: 1 | 2
  position: number | null
  dns: boolean
  pole: boolean
  points: number
  created_at: string
}

// Enriched types for UI consumption
export interface DriverDayResult {
  raceDayId: string
  roundNumber: number
  date: string
  cancelled: boolean
  nascarR1: number
  nascarR2: number
  classicR1: number
  classicR2: number
  nascarTotal: number
  classicTotal: number
  dayTotal: number // all 4 races combined (used for drop calculation)
}

export interface DriverStanding {
  driver: Driver
  cupPoints: number         // points counting (after drops)
  totalRawPoints: number    // all points before drops
  droppedPoints: number     // points in dropped days
  position: number
  wins: number
  podiums: number
  dayResults: DriverDayResult[]
  droppedDayIds: Set<string>
}

export interface CupStandings {
  cup: Cup
  standings: DriverStanding[]
  completedDays: number
  activeDroppingCount: number // how many days are currently being dropped
}

export interface RaceDayDetail extends RaceDay {
  results: RaceResult[]
  isComplete: boolean // all 24 results entered
}
