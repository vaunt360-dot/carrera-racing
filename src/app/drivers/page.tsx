import Image from 'next/image'
import Link from 'next/link'
import { getDrivers, getAllStandings } from '@/lib/actions'
import { CUP_LABELS } from '@/lib/constants'

export const metadata = {
  title: 'Fahrer | Carrera Racing Club',
}

export default async function DriversPage() {
  let drivers: Awaited<ReturnType<typeof getDrivers>> = []
  let standings: Awaited<ReturnType<typeof getAllStandings>> | null = null

  try {
    ;[drivers, standings] = await Promise.all([
      getDrivers(),
      getAllStandings(),
    ])
  } catch (err) {
    console.error('DriversPage fetch error:', err)
  }

  // Build quick stats per driver
  const driverStats = drivers.map(driver => {
    const nascarStanding = standings?.nascar.standings.find(s => s.driver.id === driver.id)
    const classicStanding = standings?.classic.standings.find(s => s.driver.id === driver.id)
    return {
      driver,
      nascarPos: nascarStanding?.position ?? 0,
      nascarPts: nascarStanding?.cupPoints ?? 0,
      classicPos: classicStanding?.position ?? 0,
      classicPts: classicStanding?.cupPoints ?? 0,
      totalWins: (nascarStanding?.wins ?? 0) + (classicStanding?.wins ?? 0),
    }
  }).sort((a, b) => b.nascarPts + b.classicPts - a.nascarPts - a.classicPts)

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
          <p className="text-white/40 mt-3 font-mono text-sm">6 Piloten · Saison 2026–2027</p>
        </div>

        {/* Driver Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {driverStats.map(({ driver, nascarPos, nascarPts, classicPos, classicPts, totalWins }) => (
            <div
              key={driver.id}
              className="glass-panel overflow-hidden group hover:border-white/20 transition-all duration-300"
              style={{ borderColor: `${driver.color}20` }}
            >
              {/* Color bar */}
              <div className="h-1 w-full" style={{ backgroundColor: driver.color }} />

              {/* Driver Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={`/images/drivers/${driver.name.toLowerCase()}.jpg`}
                  alt={driver.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => {}} // graceful fallback handled by Next.js
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Number overlay */}
                <div className="absolute bottom-4 right-4">
                  <span
                    className="font-display text-5xl opacity-60"
                    style={{ color: driver.color }}
                  >
                    #{driver.number}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h2 className="font-display text-3xl text-white mb-4">{driver.name.toUpperCase()}</h2>

                <div className="space-y-3">
                  {/* NASCAR */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs font-mono uppercase">NASCAR Cup</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-xs font-mono">P{nascarPos}</span>
                      <span className="text-white font-display text-lg">{nascarPts} <span className="text-white/30 text-xs">Pkt</span></span>
                    </div>
                  </div>

                  {/* Classic */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs font-mono uppercase">Classic Cup</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-xs font-mono">P{classicPos}</span>
                      <span className="text-white font-display text-lg">{classicPts} <span className="text-white/30 text-xs">Pkt</span></span>
                    </div>
                  </div>

                  {/* Wins */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-white/40 text-xs font-mono uppercase">Siege gesamt</span>
                    <span className="text-white font-display text-lg">{totalWins}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
