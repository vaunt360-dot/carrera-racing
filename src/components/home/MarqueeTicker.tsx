'use client'

import { motion } from 'framer-motion'

const TICKER_ITEMS = [
  'NASCAR CUP — CAMARO ZL1',
  'CLASSIC CUP — PORSCHE 917K',
  'SEASON 2026–2027',
  'ROUND 1 — APRIL 2026',
  '6 PILOTEN',
  '20 RENNTAGE',
  'PUNKTE: 8·6·4·3·2·1',
  'STREICHUNGSREGEL: BESTE 15 VON 20',
]

export function MarqueeTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="bg-racing-red py-2 overflow-hidden border-y border-racing-red/20">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span key={i} className="font-display text-white text-sm tracking-widest">
            {item}
            <span className="mx-6 opacity-50">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
