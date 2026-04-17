import { getDrivers, getDriverStats } from '@/lib/actions'
import DriverImage from '@/components/drivers/DriverImage'

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
          <p className="text-white/40 mt-3 font-mono text-sm">6 Piloten · Saison 2026–2027</p>
        </div>

        {/* Driver Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => {
            const s = stats[driver.id] ?? { wins: 0, podiums: 0, poles: 0, starts: 0 }
            return (
              <div
                key={driver.id}
                className="glass-panel overflow-hidden group hover:border-white/20 transition-all duration-300"
                style={{ borderColor: `${driver.color}20` }}
              >
                {/* Color bar */}
                <div className="h-1 w-full" style={{ backgroundColor: driver.color }} />

                {/* Driver Image */}
                <div className="relative aspect-square overflow-hidden">
                  <DriverImage name={driver.name} color={driver.color} number={driver.number} />
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

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Siege',  value: s.wins   },
                      { label: 'Podien', value: s.podiums },
                      { label: 'Poles',  value: s.poles  },
                      { label: 'Starts', value: s.starts },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center bg-white/5 rounded py-2 px-1">
                        <div
                          className="font-display text-2xl leading-none"
                          style={{ color: driver.color }}
                        >
                          {value}
                        </div>
                        <div className="text-white/30 text-[10px] font-mono uppercase tracking-wide mt-1">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
