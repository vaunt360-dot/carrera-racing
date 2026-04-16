// ============================================================
// Carrera Racing Club — Constants
// ============================================================

export const CUPS = ['nascar', 'classic'] as const
export type Cup = (typeof CUPS)[number]

export const CUP_LABELS: Record<Cup, string> = {
  nascar: 'NASCAR Cup',
  classic: 'Classic Cup',
}

export const CUP_SUBTITLES: Record<Cup, string> = {
  nascar: 'Chevrolet Camaro ZL1',
  classic: 'Porsche 917K',
}

// Points system
export const POINTS_MAP: Record<number, number> = {
  1: 8,
  2: 6,
  3: 4,
  4: 3,
  5: 2,
  6: 1,
}

export const DRIVERS = [
  { name: 'Rene',      color: '#E8002D', number: 1,  slug: 'rene'      },
  { name: 'Mike',      color: '#0096FF', number: 7,  slug: 'mike'      },
  { name: 'Christian', color: '#00C853', number: 23, slug: 'christian' },
  { name: 'Gerhard',   color: '#FF6B00', number: 44, slug: 'gerhard'   },
  { name: 'Ralf',      color: '#9C27B0', number: 3,  slug: 'ralf'      },
  { name: 'Wolfi',     color: '#FFD600', number: 99, slug: 'wolfi'     },
] as const

export const TOTAL_RACE_DAYS = 20
export const COUNTED_RACE_DAYS = 15
export const DROPPED_RACE_DAYS = 5
