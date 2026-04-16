'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Driver, RaceDay, RaceResult } from '@/lib/types'
import { Cup } from '@/lib/constants'
import { getSeasonProgression } from '@/lib/calculations'
import { DRIVERS } from '@/lib/constants'

interface SeasonChartProps {
  cup: Cup
  drivers: Driver[]
  raceDays: RaceDay[]
  results: RaceResult[]
}

export function SeasonChart({ cup, drivers, raceDays, results }: SeasonChartProps) {
  const data = useMemo(() => {
    if (!drivers.length || !raceDays.length) return []

    // Get progressions for all drivers
    const progressions = drivers.map(driver => ({
      driver,
      prog: getSeasonProgression(cup, driver, raceDays, results),
    }))

    if (!progressions[0]?.prog.length) return []

    // Build unified chart data by round
    const rounds = progressions[0].prog.map(p => p.round)
    return rounds.map(round => {
      const row: Record<string, number | string> = { round: `R${round}` }
      progressions.forEach(({ driver, prog }) => {
        const point = prog.find(p => p.round === round)
        row[driver.name] = point?.points ?? 0
      })
      return row
    })
  }, [cup, drivers, raceDays, results])

  if (!data.length) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="font-display text-2xl text-white/30">KEINE DATEN</p>
        <p className="text-white/20 text-sm mt-2 font-mono">Ergebnisse werden hier angezeigt</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-6"
    >
      <h3 className="font-display text-xl text-white mb-6 uppercase tracking-wide">Punkteverlauf</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="round"
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace' }}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', fontSize: 12 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: 'sans-serif' }}
          />
          {drivers.map(driver => (
            <Line
              key={driver.id}
              type="monotone"
              dataKey={driver.name}
              stroke={driver.color}
              strokeWidth={2}
              dot={{ fill: driver.color, r: 3 }}
              activeDot={{ r: 5, stroke: driver.color, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
