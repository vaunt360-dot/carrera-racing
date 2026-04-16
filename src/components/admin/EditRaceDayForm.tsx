'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Driver, RaceDayDetail } from '@/lib/types'
import { Cup, CUPS, CUP_LABELS } from '@/lib/constants'
import { Button } from '@/components/ui/button'

type ResultEntry = {
  position: string
  dns: boolean
}

type ResultsMatrix = {
  [driverId: string]: {
    [key: string]: ResultEntry // key = `${cup}_${raceNum}`
  }
}

function buildInitialMatrix(drivers: Driver[], raceDay: RaceDayDetail): ResultsMatrix {
  const matrix: ResultsMatrix = {}
  drivers.forEach(driver => {
    matrix[driver.id] = {}
    CUPS.forEach(cup => {
      [1, 2].forEach(raceNum => {
        const key = `${cup}_${raceNum}`
        const existing = raceDay.results.find(
          r => r.driver_id === driver.id && r.cup === cup && r.race_number === (raceNum as 1 | 2)
        )
        matrix[driver.id][key] = {
          position: existing?.position?.toString() ?? '',
          dns: existing?.dns ?? false,
        }
      })
    })
  })
  return matrix
}

interface EditRaceDayFormProps {
  raceDay: RaceDayDetail
  drivers: Driver[]
}

export function EditRaceDayForm({ raceDay, drivers }: EditRaceDayFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [matrix, setMatrix] = useState<ResultsMatrix>(() => buildInitialMatrix(drivers, raceDay))
  const [cancelled, setCancelled] = useState(raceDay.cancelled)
  const [notes, setNotes] = useState(raceDay.notes ?? '')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  function setEntry(driverId: string, cup: Cup, raceNum: 1 | 2, field: 'position' | 'dns', value: string | boolean) {
    setMatrix(prev => ({
      ...prev,
      [driverId]: {
        ...prev[driverId],
        [`${cup}_${raceNum}`]: {
          ...prev[driverId][`${cup}_${raceNum}`],
          [field]: value,
          // If DNS checked, clear position
          ...(field === 'dns' && value === true ? { position: '' } : {}),
        },
      },
    }))
  }

  async function handleSave() {
    setSaveError('')
    setSaved(false)
    startTransition(async () => {
      try {
        // Build results array
        const results: {
          race_day_id: string
          driver_id: string
          cup: Cup
          race_number: 1 | 2
          position: number | null
          dns: boolean
        }[] = []

        drivers.forEach(driver => {
          CUPS.forEach(cup => {
            ([1, 2] as const).forEach(raceNum => {
              const entry = matrix[driver.id][`${cup}_${raceNum}`]
              const position = entry.dns ? null : (parseInt(entry.position) || null)
              results.push({
                race_day_id: raceDay.id,
                driver_id: driver.id,
                cup,
                race_number: raceNum,
                position,
                dns: entry.dns,
              })
            })
          })
        })

        const response = await fetch(`/api/admin/race-days/${raceDay.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ results, cancelled, notes }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error ?? 'Unbekannter Fehler')
        }

        setSaved(true)
        router.refresh()
      } catch (err: unknown) {
        setSaveError(err instanceof Error ? err.message : 'Fehler beim Speichern')
      }
    })
  }

  const positions = [1, 2, 3, 4, 5, 6]

  return (
    <div className="space-y-8">
      {/* Cancelled toggle */}
      <div className="glass-panel p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Veranstaltung abgesagt</p>
          <p className="text-white/40 text-sm mt-1">Alle Fahrer erhalten DNS (0 Punkte)</p>
        </div>
        <button
          onClick={() => setCancelled(c => !c)}
          className={`w-12 h-6 rounded-full transition-colors ${cancelled ? 'bg-racing-red' : 'bg-white/10'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${cancelled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Notes */}
      <div className="glass-panel p-5">
        <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">Notizen</label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/20 focus:outline-none focus:border-racing-red transition-colors text-sm"
        />
      </div>

      {/* Results per cup */}
      {!cancelled && CUPS.filter(cup => !(cup === 'classic' && raceDay.round_number === 1)).map(cup => (
        <div key={cup} className="glass-panel overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="font-display text-xl text-white">{CUP_LABELS[cup]}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/40 font-mono text-xs w-36">Fahrer</th>
                  {[1, 2].map(raceNum => (
                    <th key={raceNum} colSpan={2} className="text-center p-4 text-white/40 font-mono text-xs border-l border-white/5">
                      Rennen {raceNum}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <th />
                  {[1, 2].map(raceNum => (
                    <>
                      <th key={`${raceNum}-pos`} className="p-3 text-white/30 font-mono text-xs border-l border-white/5 w-24">Position</th>
                      <th key={`${raceNum}-dns`} className="p-3 text-white/30 font-mono text-xs w-16">DNS</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver.id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: driver.color }} />
                        <span className="text-white text-sm">{driver.name}</span>
                      </div>
                    </td>
                    {([1, 2] as const).map(raceNum => {
                      const entry = matrix[driver.id][`${cup}_${raceNum}`]
                      return (
                        <>
                          <td key={`${raceNum}-pos`} className="p-3 border-l border-white/5">
                            <select
                              value={entry.dns ? '' : entry.position}
                              onChange={e => setEntry(driver.id, cup, raceNum, 'position', e.target.value)}
                              disabled={entry.dns}
                              className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm w-20 disabled:opacity-30 focus:outline-none focus:border-racing-red"
                            >
                              <option value="">–</option>
                              {positions.map(p => (
                                <option key={p} value={p.toString()}>P{p}</option>
                              ))}
                            </select>
                          </td>
                          <td key={`${raceNum}-dns`} className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={entry.dns}
                              onChange={e => setEntry(driver.id, cup, raceNum, 'dns', e.target.checked)}
                              className="w-4 h-4 accent-racing-red"
                            />
                          </td>
                        </>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-racing-red hover:bg-racing-red/80 text-white font-display tracking-widest px-8 py-3 h-auto"
        >
          {isPending ? 'WIRD GESPEICHERT...' : 'SPEICHERN'}
        </Button>

        {saved && <span className="text-green-400 font-mono text-sm">✓ Gespeichert</span>}
        {saveError && <span className="text-racing-red font-mono text-sm">{saveError}</span>}
      </div>
    </div>
  )
}
