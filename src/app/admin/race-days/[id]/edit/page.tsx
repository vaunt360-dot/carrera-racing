import { notFound } from 'next/navigation'
import { getRaceDayDetail, getDrivers } from '@/lib/actions'
import { EditRaceDayForm } from '@/components/admin/EditRaceDayForm'
import Link from 'next/link'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminEditRaceDayPage({ params }: Props) {
  const { id } = await params
  const [raceDay, drivers] = await Promise.all([
    getRaceDayDetail(id),
    getDrivers(),
  ])

  if (!raceDay) notFound()

  return (
    <main className="min-h-screen bg-racing-black pt-24 pb-16">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Back */}
        <Link href="/admin/race-days" className="text-white/40 hover:text-white font-mono text-sm mb-8 block">
          ← Alle Renntage
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-1 w-8 bg-racing-red" />
            <span className="text-racing-red font-mono text-xs uppercase tracking-widest">Admin · Bearbeiten</span>
          </div>
          <h1 className="font-display text-5xl text-white">
            RUNDE {raceDay.round_number.toString().padStart(2, '0')}
          </h1>
          <p className="text-white/50 font-mono text-sm mt-2">
            {format(new Date(raceDay.date), 'EEEE, d. MMMM yyyy', { locale: de })}
          </p>
        </div>

        <EditRaceDayForm raceDay={raceDay} drivers={drivers} />
      </div>
    </main>
  )
}
