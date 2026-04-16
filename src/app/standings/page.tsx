import { Suspense } from 'react'
import { getAllStandings, getDrivers, getRaceDays, getRaceResults } from '@/lib/actions'
import { StandingsPageClient } from './StandingsPageClient'

export const metadata = {
  title: 'WM-Stand | Carrera Racing Club',
}

export default async function StandingsPage() {
  const [standings, drivers, raceDays, results] = await Promise.all([
    getAllStandings(),
    getDrivers(),
    getRaceDays(),
    getRaceResults(),
  ])

  return (
    <main className="min-h-screen bg-racing-black pt-24 pb-16">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-racing-red" />
            <span className="text-racing-red font-mono text-xs uppercase tracking-widest">Championship</span>
          </div>
          <h1 className="font-display text-6xl md:text-7xl text-white">WM-STAND</h1>
          <p className="text-white/40 mt-3 font-mono text-sm">
            Saison 2026–2027 · {standings.nascar.completedDays} von 20 Renntagen absolviert
            {standings.nascar.activeDroppingCount > 0 && (
              <span className="text-racing-red/80"> · {standings.nascar.activeDroppingCount} Streichungen aktiv</span>
            )}
          </p>
        </div>

        <StandingsPageClient
          standings={standings}
          drivers={drivers}
          raceDays={raceDays}
          results={results}
        />
      </div>
    </main>
  )
}
