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

export function StandingsPageClient({ standings, drivers, raceDays, results }: StandingsPageClientProps) {
  const [activeCup, setActiveCup] = useState<Cup>('nascar')

  return (
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
            <StandingsTable standings={standings[cup]} />
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
  )
}
