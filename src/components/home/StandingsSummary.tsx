'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CupStandings } from '@/lib/types'
import { CUP_LABELS, CUP_SUBTITLES } from '@/lib/constants'

interface StandingsSummaryProps {
  standings: Record<'nascar' | 'classic', CupStandings>
}

export function StandingsSummary({ standings }: StandingsSummaryProps) {
  const cups = ['nascar', 'classic'] as const

  return (
    <section className="py-20 px-6 bg-racing-black">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-racing-red" />
            <span className="text-racing-red font-mono text-xs uppercase tracking-widest">Championship</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-white">WM-STAND</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {cups.map((cup, cupIdx) => {
            const { standings: driverStandings, completedDays } = standings[cup]
            const top3 = driverStandings.slice(0, 3)
            const leader = top3[0]

            return (
              <motion.div
                key={cup}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: cupIdx * 0.15 }}
                className="glass-panel p-6"
              >
                {/* Cup Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display text-2xl text-white">{CUP_LABELS[cup]}</h3>
                    <p className="text-white/40 text-sm mt-1 font-mono">{CUP_SUBTITLES[cup]}</p>
                  </div>
                  <span className="text-white/30 font-mono text-xs">{completedDays}/20</span>
                </div>

                {/* Top 3 */}
                {completedDays === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/30 font-mono text-sm">Saison startet bald</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {top3.map((ds, i) => (
                      <div
                        key={ds.driver.id}
                        className={`flex items-center gap-4 p-3 rounded-lg ${i === 0 ? 'bg-white/10' : 'bg-white/5'}`}
                      >
                        <span className="font-display text-xl w-6 text-center" style={{ color: i === 0 ? '#FFD600' : 'rgba(255,255,255,0.4)' }}>
                          {i + 1}
                        </span>
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ds.driver.color }} />
                        <div className="flex-1">
                          <span className="text-white font-semibold">{ds.driver.name}</span>
                          <span className="text-white/30 text-xs ml-2 font-mono">#{ds.driver.number}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-display text-xl">{ds.cupPoints}</span>
                          <span className="text-white/40 text-xs ml-1">Pkt</span>
                        </div>
                        <span className="text-white/30 text-xs font-mono w-12 text-right">
                          {i > 0 && leader ? `-${leader.cupPoints - ds.cupPoints}` : ''}
                        </span>
                      </div>
                    ))}

                    {/* Show remaining */}
                    {driverStandings.length > 3 && (
                      <div className="space-y-1 pt-1">
                        {driverStandings.slice(3).map((ds) => (
                          <div key={ds.driver.id} className="flex items-center gap-4 px-3 py-1">
                            <span className="text-white/30 font-display text-sm w-6 text-center">{ds.position}</span>
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ds.driver.color }} />
                            <span className="text-white/60 text-sm flex-1">{ds.driver.name}</span>
                            <div className="text-right">
                              <span className="text-white/60 text-sm font-display">{ds.cupPoints}</span>
                              <span className="text-white/40 text-xs ml-1">Pkt</span>
                            </div>
                            <span className="text-white/30 text-xs font-mono w-12 text-right">
                              {leader ? `-${leader.cupPoints - ds.cupPoints}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Link
                  href={`/standings?cup=${cup}`}
                  className="mt-6 block text-center text-racing-red text-sm font-mono uppercase tracking-wider hover:underline"
                >
                  Vollständiger Stand →
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
