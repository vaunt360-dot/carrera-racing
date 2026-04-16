import Link from 'next/link'
import { getRaceDays, getRaceResults } from '@/lib/actions'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton'

export const metadata = {
  title: 'Admin — Renntage | CRC',
}

export default async function AdminRaceDaysPage() {
  const [raceDays, results] = await Promise.all([getRaceDays(), getRaceResults()])

  const completedDayIds = new Set(results.map(r => r.race_day_id))
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen bg-racing-black pt-24 pb-16">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-1 w-8 bg-racing-red" />
              <span className="text-racing-red font-mono text-xs uppercase tracking-widest">Admin</span>
            </div>
            <h1 className="font-display text-5xl text-white">RENNTAGE</h1>
          </div>
          <AdminLogoutButton />
        </div>

        {/* Race Days List */}
        <div className="space-y-3">
          {raceDays.map((day) => {
            const isComplete = completedDayIds.has(day.id)
            const isPast = day.date < today

            return (
              <div key={day.id} className="glass-panel p-5 flex items-center gap-5">
                {/* Round */}
                <span className="font-display text-3xl text-white w-12 text-center flex-shrink-0">
                  {day.round_number.toString().padStart(2, '0')}
                </span>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-semibold">Runde {day.round_number}</span>
                    {isComplete && <Badge className="bg-green-600/30 text-green-400 border-green-500/30 text-xs">Abgeschlossen</Badge>}
                    {day.cancelled && <Badge variant="outline" className="text-white/30 border-white/10 text-xs">Abgesagt</Badge>}
                    {isPast && !isComplete && !day.cancelled && <Badge variant="outline" className="text-yellow-500/60 border-yellow-500/30 text-xs">Ausstehend</Badge>}
                  </div>
                  <p className="text-white/40 text-sm font-mono">
                    {format(new Date(day.date), 'EEEE, d. MMMM yyyy', { locale: de })}
                  </p>
                </div>

                {/* Edit Button */}
                <Link
                  href={`/admin/race-days/${day.id}/edit`}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/60 text-sm hover:border-racing-red hover:text-white transition-colors font-mono"
                >
                  Bearbeiten →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
