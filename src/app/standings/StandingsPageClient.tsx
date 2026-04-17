'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StandingsTable } from '@/components/standings/StandingsTable'
import { SeasonChart } from '@/components/standings/SeasonChart'
import { CupStandings, Driver, RaceDay, RaceResult } from '@/lib/types'
import { Cup } from '@/lib/constants'

interface StandingsPageClientProps {
  standings: Record<Cup, CupStandings>
  drivers: Driver[]
  raceDays: RaceDay[]
  results: RaceResult[]
}

type View = 'compact' | 'detail'

export function StandingsPageClient({ standings, drivers, raceDays, results }: StandingsPageClientProps) {
  const [activeCup, setActiveCup] = useState<Cup>('nascar')
  const [view, setView] = useState<View>('compact')

  return (
    <div>
      {/* Global view toggle */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center bg-white/5 border border-white/10 rounded overflow-hidden">
          {(['compact', 'detail'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                view === v
                  ? 'bg-racing-red text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {v === 'compact' ? 'Kompakt' : 'Detail'}
            </button>
          ))}
        </div>
      </div>

      <Tabs value={activeCup} onValueChange={(v) => setActiveCup(v as Cup)}>
        <TabsList className="bg-white/5 border border-white/10 mb-8 h-12">
          <TabsTrigger
            value="nascar"
            className="font-display text-sm tracking-widest data-[state=active]:bg-racing-red data-[state=active]:text-white px-8"
          >
            NASCAR CUP
          </TabsTrigger>
          <TabsTrigger
            value="classic"
            className="font-display text-sm tracking-widest data-[state=active]:bg-racing-red data-[state=active]:text-white px-8"
          >
            CLASSIC CUP
          </TabsTrigger>
        </TabsList>

        {(['nascar', 'classic'] as Cup[]).map((cup) => (
          <TabsContent key={cup} value={cup} className="space-y-8 mt-0">
            <div className="glass-panel overflow-hidden">
              <StandingsTable standings={standings[cup]} view={view} />
            </div>
            <SeasonChart
              cup={cup}
              drivers={drivers}
              raceDays={raceDays}
              results={results}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
