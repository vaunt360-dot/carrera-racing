'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Driver } from '@/lib/types'
import { DriverStats } from '@/lib/actions'
import DriverImage from './DriverImage'

interface DriverCardProps {
  driver: Driver
  stats: DriverStats
}

function StatBox({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="text-center bg-white/5 rounded py-2 px-1">
      <div className="font-display text-2xl leading-none" style={{ color: color ?? 'white' }}>
        {value}
      </div>
      <div className="text-white/30 text-[10px] font-mono uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  )
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
      <span className="text-white/40 text-xs font-mono">{label}</span>
      <span className="text-white text-xs font-semibold font-mono">{value}</span>
    </div>
  )
}

export function DriverCard({ driver, stats: s }: DriverCardProps) {
  const [flipped, setFlipped] = useState(false)

  const winRate = s.starts > 0 ? Math.round((s.wins / s.starts) * 100) : 0
  const podiumRate = s.starts > 0 ? Math.round((s.podiums / s.starts) * 100) : 0

  const trendIcon = s.trend === null ? null
    : s.trend > 0 ? '▲' : s.trend < 0 ? '▼' : '='
  const trendColor = s.trend === null ? 'text-white/30'
    : s.trend > 0 ? 'text-green-400' : s.trend < 0 ? 'text-red-400' : 'text-white/40'

  const totalDropped = s.nascarDroppedPoints + s.classicDroppedPoints

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d', position: 'relative' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── FRONT ─────────────────────────────────────────── */}
        <div
          className="glass-panel overflow-hidden group hover:border-white/20 transition-all duration-300"
          style={{ borderColor: `${driver.color}20`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="h-1 w-full" style={{ backgroundColor: driver.color }} />

          <div className="relative aspect-square overflow-hidden">
            <DriverImage name={driver.name} color={driver.color} number={driver.number} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 right-4">
              <span className="font-display text-5xl opacity-60" style={{ color: driver.color }}>
                #{driver.number}
              </span>
            </div>
            {/* flip hint */}
            <div className="absolute top-3 right-3 bg-black/50 rounded px-2 py-0.5 text-white/30 text-[10px] font-mono tracking-widest">
              STATS →
            </div>
          </div>

          <div className="p-5">
            <h2 className="font-display text-3xl text-white mb-4">{driver.name.toUpperCase()}</h2>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Siege',  value: s.wins   },
                { label: 'Podien', value: s.podiums },
                { label: 'Poles',  value: s.poles  },
                { label: 'Starts', value: s.starts },
              ].map(({ label, value }) => (
                <StatBox key={label} label={label} value={value} color={driver.color} />
              ))}
            </div>
          </div>
        </div>

        {/* ── BACK ──────────────────────────────────────────── */}
        <div
          className="overflow-hidden absolute inset-0 rounded-lg border"
          style={{
            borderColor: `${driver.color}40`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#0f0f0f',
          }}
        >
          <div className="h-1 w-full" style={{ backgroundColor: driver.color }} />

          {/* Header */}
          <div className="px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-display text-2xl text-white">{driver.name.toUpperCase()}</span>
              <span className="text-white/30 text-xs font-mono ml-2">#{driver.number}</span>
            </div>
            <span className="text-white/20 text-[10px] font-mono tracking-widest">← ZURÜCK</span>
          </div>

          {/* WM Positions */}
          <div className="px-5 pt-4 pb-3 border-b border-white/10">
            <div className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-2">WM-Stand</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'NASCAR CUP', pos: s.nascarPosition, pts: s.nascarRawPoints },
                { label: 'CLASSIC CUP', pos: s.classicPosition, pts: s.classicRawPoints },
              ].map(({ label, pos, pts }) => (
                <div key={label} className="bg-white/5 rounded p-2 text-center">
                  <div
                    className="font-display text-3xl leading-none"
                    style={{ color: pos === 1 ? '#FFD600' : pos === 2 ? '#C0C0C0' : pos === 3 ? '#CD7F32' : driver.color }}
                  >
                    {pos !== null ? `P${pos}` : '–'}
                  </div>
                  <div className="text-white/30 text-[10px] font-mono mt-1">{label}</div>
                  <div className="text-white/50 text-[10px] font-mono">{pts} Pkt gesamt</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Stats */}
          <div className="px-5 py-3 border-b border-white/10">
            <SmallStat label="Ø Punkte / Rennen" value={s.starts > 0 ? s.avgPoints : '–'} />
            <SmallStat label="Beste Platzierung" value={s.bestPosition !== null ? `P${s.bestPosition}` : '–'} />
            <SmallStat label="Siegquote" value={s.starts > 0 ? `${winRate}%` : '–'} />
            <SmallStat label="Podiumsquote" value={s.starts > 0 ? `${podiumRate}%` : '–'} />
            <SmallStat label="DNS" value={s.dns} />
          </div>

          {/* Dropped results */}
          <div className="px-5 py-3 border-b border-white/10">
            <div className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-2">Streichungen</div>
            <SmallStat label="NASCAR gestrichen" value={s.nascarDroppedPoints > 0 ? `${s.nascarDroppedPoints} Pkt` : '–'} />
            <SmallStat label="Classic gestrichen" value={s.classicDroppedPoints > 0 ? `${s.classicDroppedPoints} Pkt` : '–'} />
            <SmallStat label="Gesamt gestrichen" value={totalDropped > 0 ? `${totalDropped} Pkt` : '–'} />
          </div>

          {/* Trend */}
          <div className="px-5 py-3">
            <div className="text-white/30 text-[10px] font-mono uppercase tracking-widest mb-1">Tendenz (letzte 2 Runden)</div>
            {trendIcon === null ? (
              <span className="text-white/20 text-sm font-mono">Noch keine Daten</span>
            ) : (
              <div className={`font-display text-xl ${trendColor}`}>
                {trendIcon} {s.trend !== 0 ? `${s.trend! > 0 ? '+' : ''}${s.trend} Pkt` : 'Stabil'}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
