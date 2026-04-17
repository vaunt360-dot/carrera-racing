'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  raceDayId: string
  initialBannerUrl: string | null
}

export function BannerGenerator({ raceDayId, initialBannerUrl }: Props) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialBannerUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/race-days/${raceDayId}/banner`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Fehler beim Generieren')
      setBannerUrl(data.bannerUrl + '?t=' + Date.now()) // cache bust
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl text-white">HERO BANNER</h3>
          <p className="text-white/40 text-xs font-mono mt-0.5">KI-generiertes Track Mood Shot</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 bg-racing-red hover:bg-racing-red/80 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-xs uppercase tracking-widest rounded transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-3 h-3 border border-white/40 border-t-white rounded-full" />
              Generiere…
            </>
          ) : bannerUrl ? (
            '↺ Neu generieren'
          ) : (
            '✦ Banner generieren'
          )}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs font-mono">{error}</p>
      )}

      {bannerUrl ? (
        <div className="relative w-full aspect-video rounded overflow-hidden border border-white/10">
          <Image
            src={bannerUrl}
            alt="Hero Banner"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="w-full aspect-video rounded border border-white/10 bg-white/5 flex items-center justify-center">
          <p className="text-white/20 font-mono text-sm">Noch kein Banner generiert</p>
        </div>
      )}
    </div>
  )
}
