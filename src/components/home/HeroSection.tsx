'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { RaceDay } from '@/lib/types'
import { format, differenceInDays } from 'date-fns'

interface HeroSectionProps {
  nextRaceDay: RaceDay | null
}

export function HeroSection({ nextRaceDay }: HeroSectionProps) {
  const daysUntil = nextRaceDay
    ? differenceInDays(new Date(nextRaceDay.date), new Date())
    : null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Racing background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-racing-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Animated racing stripe */}
      <motion.div
        className="absolute left-0 top-0 h-1 bg-racing-red"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-1 w-16 bg-racing-red" />
              <span className="text-racing-red font-mono text-sm tracking-widest uppercase">Season 2026–2027</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white leading-none tracking-tight mb-4">
              CARRERA<br />
              <span className="text-racing-red">RACING</span><br />
              CLUB
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-lg mt-6 leading-relaxed">
              Zwei Cups. Sechs Piloten. Eine Meisterschaft.
              Monatliche Renntage auf der Bahn.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link href="/standings" className="btn-primary">
              WM-Stand ansehen
            </Link>
            <Link href="/race-days" className="btn-secondary">
              Renntage →
            </Link>
          </motion.div>

          {/* Next Race Card */}
          {nextRaceDay && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="glass-panel p-6 max-w-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1 font-mono">Nächster Renntag</p>
                  <p className="text-white font-display text-3xl">
                    RUNDE {nextRaceDay.round_number.toString().padStart(2, '0')}
                  </p>
                  <p className="text-white/80 mt-1 text-lg">
                    {format(new Date(nextRaceDay.date), 'dd. MMMM yyyy')}
                  </p>
                </div>
                {daysUntil !== null && (
                  <div className="text-right">
                    <p className="text-racing-red font-display text-4xl">{daysUntil}</p>
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      {daysUntil === 1 ? 'Tag' : 'Tage'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-1">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
