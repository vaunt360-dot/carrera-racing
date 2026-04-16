import Link from 'next/link'
import { getRaceDays, getRaceResults } from '@/lib/actions'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Renntage | Carrera Racing Club',
}

export default async function RaceDaysPage() {
  const [raceDays, results] = await Promise.all([getRaceDays(), getRaceResults()])

  const today = new Date().toISOString().split('T')[0]

  const completedDayIds = new Set(results.map(r => r.race_day_id))

  return (
    <main className="min-h-screen bg-racing-black pt-24 pb-16">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-racing-red" />
            <span className="text-racing-red font-mono text-xs uppercase tracking-widest">Kalender</span>
          </div>
          <h1 className="font-display text-6xl md:text-7xl text-white">RENNTAGE</h1>
          <p className="text-white/40 mt-3 font-mono text-sm">Saison 2026–2027 · 20 Renntage</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-4">
            {raceDays.map((day) => {
              const isComplete = completedDayIds.has(day.id)
              const isPast = day.date < today
              const isNext = !isPast && !isComplete && !day.cancelled

              return (
                <Link key={day.id} href={`/race-days/${day.id}`}>
                  <div
                    className={`relative flex items-center gap-6 p-5 ml-16 rounded-lg border transition-all duration-200 cursor-pointer
                      ${isComplete ? 'glass-panel border-white/10 hover:border-racing-red/30' : ''}
                      ${isNext ? 'border-racing-red/40 bg-racing-red/5 hover:bg-racing-red/10' : ''}
                      ${isPast && !isComplete && !day.cancelled ? 'border-white/5 bg-white/2 opacity-60' : ''}
                      ${day.cancelled ? 'border-white/5 opacity-40' : ''}
                      ${!isPast && !isNext ? 'border-white/5 hover:border-white/15' : ''}
                    `}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[2.65rem] w-4 h-4 rounded-full border-2 flex-shrink-0
                        ${isComplete ? 'bg-racing-red border-racing-red' : ''}
                        ${isNext ? 'bg-racing-red/50 border-racing-red animate-pulse' : ''}
                        ${!isComplete && !isNext ? 'bg-racing-black border-white/20' : ''}
                        ${day.cancelled ? 'bg-racing-black border-white/10' : ''}
                      `}
                    />

                    {/* Round number */}
                    <div className="text-center w-12 flex-shrink-0">
                      <span className={`font-display text-3xl ${isComplete || isNext ? 'text-white' : 'text-white/30'}`}>
                        {day.round_number.toString().padStart(2, '0')}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className={`font-semibold ${isComplete || isNext ? 'text-white' : 'text-white/50'}`}>
                          Runde {day.round_number}
                        </p>
                        {isNext && <Badge className="bg-racing-red text-white text-xs">Nächstes Rennen</Badge>}
                        {day.cancelled && <Badge variant="outline" className="text-white/30 border-white/10 text-xs">Abgesagt</Badge>}
                        {isComplete && <Badge variant="outline" className="text-green-500/60 border-green-500/30 text-xs">Abgeschlossen</Badge>}
                      </div>
                      <p className={`text-sm font-mono ${isComplete || isNext ? 'text-white/60' : 'text-white/25'}`}>
                        {format(new Date(day.date), 'EEEE, d. MMMM yyyy', { locale: de })}
                      </p>
                      {day.notes && (
                        <p className="text-white/30 text-xs mt-1">{day.notes}</p>
                      )}
                    </div>

                    {/* Arrow */}
                    <span className={`text-white/20 text-lg flex-shrink-0 ${isComplete || isNext ? 'text-white/40' : ''}`}>→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
