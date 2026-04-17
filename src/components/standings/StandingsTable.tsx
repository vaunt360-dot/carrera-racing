'use client'

import { motion } from 'framer-motion'
import { CupStandings, DriverDayResult } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Cup } from '@/lib/constants'

interface StandingsTableProps {
  standings: CupStandings
  view: 'compact' | 'detail'
}

// ── Helpers ─────────────────────────────────────────────────

function formDotColor(pts: number): string {
  if (pts === 0) return 'bg-red-500/60'
  if (pts >= 7) return 'bg-green-400'  // P1 = 8 or 8+1 pole
  if (pts >= 4) return 'bg-yellow-400' // P2–P3 range
  return 'bg-white/30'                  // P4–P6
}

function FormDots({ dayResults, cup, completedDays }: {
  dayResults: DriverDayResult[]
  cup: Cup
  completedDays: number
}) {
  const last5 = dayResults
    .filter((_, i) => i < completedDays)
    .slice(-5)

  return (
    <div className="flex items-center gap-1">
      {last5.map((dr) => {
        const pts = cup === 'nascar' ? dr.nascarTotal : dr.classicTotal
        return (
          <span
            key={dr.raceDayId}
            className={`inline-block w-2 h-2 rounded-full ${formDotColor(pts)}`}
            title={`R${dr.roundNumber}: ${pts} Pkt`}
          />
        )
      })}
      {last5.length === 0 && <span className="text-white/20 text-xs font-mono">–</span>}
    </div>
  )
}

function TrendArrow({ dayResults, cup, completedDays }: {
  dayResults: DriverDayResult[]
  cup: Cup
  completedDays: number
}) {
  const completed = dayResults.filter((_, i) => i < completedDays)
  if (completed.length < 2) return <span className="text-white/20 font-mono text-xs">–</span>

  const last = completed[completed.length - 1]
  const prev = completed[completed.length - 2]
  const lastPts = cup === 'nascar' ? last.nascarTotal : last.classicTotal
  const prevPts = cup === 'nascar' ? prev.nascarTotal : prev.classicTotal
  const delta = lastPts - prevPts

  if (delta > 0) return <span className="text-green-400 text-sm font-bold">▲</span>
  if (delta < 0) return <span className="text-red-400 text-sm font-bold">▼</span>
  return <span className="text-white/30 text-sm">–</span>
}

// ── Component ───────────────────────────────────────────────

export function StandingsTable({ standings, view }: StandingsTableProps) {
  const { standings: driverStandings, completedDays, activeDroppingCount, cup } = standings

  if (completedDays === 0) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="font-display text-2xl text-white/30">SAISON STARTET BALD</p>
        <p className="text-white/20 text-sm mt-2 font-mono">April 2026</p>
      </div>
    )
  }

  const leaderPoints = driverStandings[0]?.cupPoints ?? 0

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
              <TableHead className="text-white/40 font-mono text-xs text-center">Form</TableHead>
              <TableHead className="text-white/40 font-mono text-xs text-center w-8">↕</TableHead>
              <TableHead className="text-white/40 font-mono text-xs text-right">GAP</TableHead>
              <TableHead className="text-white/40 font-mono text-xs text-right">Punkte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverStandings.map((ds, idx) => {
              const gap = ds.cupPoints === leaderPoints
                ? <span className="text-yellow-400 font-mono text-xs tracking-widest">LEADER</span>
                : <span className="text-white/40 font-mono text-xs">–{leaderPoints - ds.cupPoints}</span>

              return (
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
                  <TableCell className="py-4 text-center">
                    <FormDots dayResults={ds.dayResults} cup={cup} completedDays={completedDays} />
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <TrendArrow dayResults={ds.dayResults} cup={cup} completedDays={completedDays} />
                  </TableCell>
                  <TableCell className="text-right py-4">{gap}</TableCell>
                  <TableCell className="text-right py-4">
                    <span className="font-display text-2xl text-white">{ds.cupPoints}</span>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
        {activeDroppingCount > 0 && (
          <div className="p-4 border-t border-white/5 flex items-center gap-4">
            <span className="text-white/30 text-xs font-mono">{activeDroppingCount} Streicher aktiv</span>
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                <span className="text-white/25 text-[10px] font-mono">Top 3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                <span className="text-white/25 text-[10px] font-mono">P4–P6</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/60 inline-block" />
                <span className="text-white/25 text-[10px] font-mono">DNS/0</span>
              </div>
            </div>
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

