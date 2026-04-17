import { getDrivers, getDriverStats } from '@/lib/actions'
import { DriverCard } from '@/components/drivers/DriverCard'

export const metadata = {
  title: 'Fahrer | Carrera Racing Club',
}

export default async function DriversPage() {
  const [drivers, stats] = await Promise.all([getDrivers(), getDriverStats()])

  return (
    <main className="min-h-screen bg-racing-black pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-racing-red" />
            <span className="text-racing-red font-mono text-xs uppercase tracking-widest">Piloten</span>
          </div>
          <h1 className="font-display text-6xl md:text-7xl text-white">FAHRER</h1>
          <p className="text-white/40 mt-3 font-mono text-sm">6 Piloten · Saison 2026–2027 · Karte klicken für Stats</p>
        </div>

        {/* Driver Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => {
            const s = stats[driver.id] ?? {
              wins: 0, podiums: 0, poles: 0, starts: 0, dns: 0,
              bestPosition: null, avgPoints: 0,
              nascarDroppedPoints: 0, classicDroppedPoints: 0,
              nascarRawPoints: 0, classicRawPoints: 0,
              nascarPosition: null, classicPosition: null,
              trend: null, droppedDayCount: 0,
            }
            return <DriverCard key={driver.id} driver={driver} stats={s} />
          })}
        </div>
      </div>
    </main>
  )
}
