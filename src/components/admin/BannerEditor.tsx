'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  raceDayId: string
  initialBannerUrl: string | null
}

export function BannerEditor({ raceDayId, initialBannerUrl }: Props) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialBannerUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/admin/race-days/${raceDayId}/banner`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload fehlgeschlagen')
      setBannerUrl(data.bannerUrl + '?t=' + Date.now())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete() {
    if (!confirm('Banner wirklich löschen?')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/race-days/${raceDayId}/banner`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Löschen fehlgeschlagen')
      setBannerUrl(null)
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
          <p className="text-white/40 text-xs font-mono mt-0.5">Bild für die Renntag-Detailseite</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-xs uppercase tracking-widest rounded transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-3 h-3 border border-white/40 border-t-white rounded-full" />
                Lädt…
              </span>
            ) : (
              '↑ Hochladen'
            )}
          </button>
          {bannerUrl && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 disabled:opacity-40 disabled:cursor-not-allowed text-red-400 font-mono text-xs uppercase tracking-widest rounded transition-colors"
            >
              ✕ Löschen
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

      {bannerUrl ? (
        <div className="relative w-full aspect-video rounded overflow-hidden border border-white/10">
          <Image src={bannerUrl} alt="Hero Banner" fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="w-full aspect-video rounded border border-dashed border-white/20 bg-white/5 flex items-center justify-center">
          <p className="text-white/20 font-mono text-sm">Kein Banner — Bild hochladen</p>
        </div>
      )}
    </div>
  )
}
