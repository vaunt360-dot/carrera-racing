import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getRaceDayDetail, getDrivers } from '@/lib/actions'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { POINTS_MAP, CUP_LABELS, CUP_SUBTITLES } from '@/lib/constants'
import { Cup } from '@/lib/constants'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RaceDayDetailPage({ params }: Props) {
  const { id } = await params
  const [raceDay, drivers] = await Promise.all([
    getRaceDayDetail(id),
    getDrivers(),
  ])

  if (!raceDay) notFound()

  const cups: Cup[] = ['nascar', 'classic']

  // Build results matrix: cup → race → driver → result
  const getResult = (cup: Cup, raceNum: 1 | 2, driverId: string) =>
    raceDay.results.find(r => r.cup === cup && r.race_number === raceNum && r.driver_id === driverId)

  return (
    <main className="min-h-screen bg-racing-black pb-16">

      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        {raceDay.banner_url ? (
          <Image
            src={raceDay.banner_url}
            alt={`Renntag ${raceDay.round_number} Banner`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-racing-black via-racing-black/40 to-transparent" />

        {/* Header text on banner */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 container mx-auto max-w-5xl">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-1 w-12 bg-racing-red" />
            <span className="text-racing-red font-mono text-xs uppercase tracking-widest">
              Runde {raceDay.round_number}
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-white">
            RENNTAG {raceDay.round_number.toString().padStart(2, '0')}
          </h1>
          <p className="text-white/60 mt-1 font-mono text-sm">
            {format(new Date(raceDay.date), 'EEEE, d. MMMM yyyy', { locale: de })}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 pt-8">
        {/* Back */}
        <Link href="/race-days" className="text-white/40 hover:text-white font-mono text-sm mb-8 block">
          ← Alle Renntage
        </Link>

        {/* Badges */}
        <div className="mb-10 flex gap-2 flex-wrap">
          {raceDay.cancelled && (
            <Badge variant="outline" className="text-white/40 border-white/20">Veranstaltung abgesagt</Badge>
          )}
          {raceDay.isComplete && (
            <Badge className="bg-green-600/30 text-green-400 border-green-500/30">Alle Ergebnisse eingetragen</Badge>
          )}
        </div>

        {/* Results per cup */}
        {raceDay.cancelled ? (
          <div className="glass-panel p-12 text-center">
            <p className="font-display text-2xl text-white/30">RENNTAG ABGESAGT</p>
            <p className="text-white/20 text-sm mt-2">Alle Fahrer erhalten DNS (0 Punkte)</p>
          </div>
        ) : !raceDay.isComplete ? (
          <div className="glass-panel p-12 text-center">
            <p className="font-display text-2xl text-white/30">ERGEBNISSE AUSSTEHEND</p>
            <p className="text-white/20 text-sm mt-2 font-mono">Noch nicht eingetragen</p>
          </div>
        ) : (
          <div className="space-y-10">
            {cups.map((cup) => (
              <div key={cup} className="glass-panel overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <h2 className="font-display text-2xl text-white">{CUP_LABELS[cup]}</h2>
                  <p className="text-white/40 text-sm font-mono">{CUP_SUBTITLES[cup]}</p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/40 font-mono text-xs">Fahrer</TableHead>
                      <TableHead className="text-white/40 font-mono text-xs text-center">Rennen 1</TableHead>
                      <TableHead className="text-white/40 font-mono text-xs text-center">Rennen 2</TableHead>
                      <TableHead className="text-white/40 font-mono text-xs text-right">Gesamt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...drivers]
                      .map(driver => {
                        const r1 = getResult(cup, 1, driver.id)
                        const r2 = getResult(cup, 2, driver.id)
                        const total = (r1?.points ?? 0) + (r2?.points ?? 0)
                        return { driver, r1, r2, total }
                      })
                      .sort((a, b) => b.total - a.total)
                      .map(({ driver, r1, r2, total }) => (
                        <TableRow key={driver.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: driver.color }} />
                              <span className="text-white font-medium">{driver.name}</span>
                              <span className="text-white/30 text-xs font-mono">#{driver.number}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {r1 ? (
                              r1.dns ? (
                                <span className="text-white/20 text-xs font-mono">DNS</span>
                              ) : (
                                <span className="text-white font-mono inline-flex items-center gap-0.5">
                                  <span className="inline-block w-4 text-center text-yellow-400 text-xs">
                                    {r1.pole ? '★' : ''}
                                  </span>
                                  P{r1.position}
                                  <span className="text-white/40 text-xs ml-1">({r1.points}P)</span>
                                </span>
                              )
                            ) : (
                              <span className="text-white/15 text-xs">–</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {r2 ? (
                              r2.dns ? (
                                <span className="text-white/20 text-xs font-mono">DNS</span>
                              ) : (
                                <span className="text-white font-mono inline-flex items-center gap-0.5">
                                  <span className="inline-block w-4 text-center text-yellow-400 text-xs">
                                    {r2.pole ? '★' : ''}
                                  </span>
                                  P{r2.position}
                                  <span className="text-white/40 text-xs ml-1">({r2.points}P)</span>
                                </span>
                              )
                            ) : (
                              <span className="text-white/15 text-xs">–</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-display text-xl text-white">{total}</span>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
