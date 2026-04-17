'use client'

import { motion } from 'framer-motion'
import { CupStandings } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface StandingsTableProps {
  standings: CupStandings
  view: 'compact' | 'detail'
}

export function StandingsTable({ standings, view }: StandingsTableProps) {
  const { standings: driverStandings, completedDays, activeDroppingCount } = standings

  if (completedDays === 0) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="font-display text-2xl text-white/30">SAISON STARTET BALD</p>
        <p className="text-white/20 text-sm mt-2 font-mono">April 2026</p>
      </div>
    )
  }

  const completedDaysList = driverStandings[0]
    ? driverStandings[0].dayResults.filter((_, i) => i < completedDays)
    : []

  // ── COMPACT VIEW ──────────────────────────────────────────
  if (view === 'compact') {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 font-mono text-xs w-8">P</TableHead>
              <TableHead className="text-white/40 font-mono text-xs">Fahrer</TableHead>
              <TableHead className="text-white/40 font-mono text-xs text-right">Punkte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverStandings.map((ds, idx) => (
              <motion.tr
                key={ds.driver.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-white/5 hover:bg-white/5 transition-colors"
              >
                <TableCell className="font-display text-xl text-center py-4">
                  <span style={{ color: idx === 0 ? '#FFD600' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'rgba(255,255,255,0.4)' }}>
                    {ds.position}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: ds.driver.color }} />
                    <div>
                      <span className="text-white font-semibold">{ds.driver.name}</span>
                      <span className="text-white/30 text-xs ml-2 font-mono">#{ds.driver.number}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4">
                  <span className="font-display text-2xl text-white">{ds.cupPoints}</span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        {activeDroppingCount > 0 && (
          <div className="p-4 border-t border-white/5">
            <span className="text-white/30 text-xs font-mono">{activeDroppingCount} Streicher aktiv</span>
          </div>
        )}
      </div>
    )
  }

  // ── DETAIL VIEW ───────────────────────────────────────────
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-white/40 font-mono text-xs w-8">P</TableHead>
            <TableHead className="text-white/40 font-mono text-xs">Fahrer</TableHead>
            {completedDaysList.map((dr) => (
              <TableHead key={dr.raceDayId} className="text-white/40 font-mono text-xs text-center w-10">
                R{dr.roundNumber}
              </TableHead>
            ))}
            <TableHead className="text-white/40 font-mono text-xs text-right">Gesamt</TableHead>
            <TableHead className="text-white/40 font-mono text-xs text-right">Gewertet</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {driverStandings.map((ds, idx) => (
            <motion.tr
              key={ds.driver.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-white/5 hover:bg-white/5 transition-colors"
            >
              <TableCell className="font-display text-xl text-center py-4">
                <span style={{ color: idx === 0 ? '#FFD600' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'rgba(255,255,255,0.4)' }}>
                  {ds.position}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: ds.driver.color }} />
                  <div>
                    <span className="text-white font-semibold">{ds.driver.name}</span>
                    <span className="text-white/30 text-xs ml-2 font-mono">#{ds.driver.number}</span>
                  </div>
                </div>
              </TableCell>
              {ds.dayResults.filter((_, i) => i < completedDays).map((dr) => {
                const isDropped = ds.droppedDayIds.has(dr.raceDayId)
                const cupPoints = standings.cup === 'nascar' ? dr.nascarTotal : dr.classicTotal
                return (
                  <TableCell key={dr.raceDayId} className="text-center text-xs font-mono py-4">
                    <span className={`inline-block w-7 h-7 leading-7 rounded text-center ${
                      isDropped
                        ? 'bg-white/5 text-white/25 line-through'
                        : cupPoints > 0
                        ? 'bg-racing-red/20 text-white'
                        : 'text-white/30'
                    }`}>
                      {dr.cancelled ? '–' : cupPoints}
                    </span>
                  </TableCell>
                )
              })}
              <TableCell className="text-right font-mono text-white/60 text-sm py-4">
                {ds.totalRawPoints}
              </TableCell>
              <TableCell className="text-right py-4">
                <span className="font-display text-xl text-white">{ds.cupPoints}</span>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 p-4 border-t border-white/5 mt-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 bg-racing-red/20 rounded text-xs text-center leading-5 text-white/60">0</span>
          <span className="text-white/30 text-xs font-mono">gewertet</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 bg-white/5 rounded text-xs text-center leading-5 text-white/25 line-through">0</span>
          <span className="text-white/30 text-xs font-mono">gestrichen</span>
        </div>
        {activeDroppingCount > 0 && (
          <Badge className="ml-auto bg-white/5 text-white/40 border-white/10 font-mono text-xs">
            {activeDroppingCount} Streicher aktiv
          </Badge>
        )}
      </div>
    </div>
  )
}
