import { DRIVERS } from '@/lib/constants'
import DriverImage from '@/components/drivers/DriverImage'
import Link from 'next/link'

export const metadata = {
  title: 'Fahrer | Carrera Racing Club',
}

export default function DriversPage() {
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
          {DRIVERS.map((driver) => (
            <div
              key={driver.slug}
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

                <div className="pt-2 border-t border-white/5">
                  <Link
                    href="/standings"
                    className="text-white/40 text-xs font-mono uppercase tracking-widest hover:text-racing-red transition-colors"
                  >
                    WM-Stand ansehen →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
