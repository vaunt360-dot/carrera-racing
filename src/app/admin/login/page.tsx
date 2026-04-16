'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/race-days')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-racing-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="h-1 w-16 bg-racing-red mx-auto mb-6" />
          <h1 className="font-display text-4xl text-white">ADMIN</h1>
          <p className="text-white/40 text-sm font-mono mt-2">Carrera Racing Club</p>
        </div>

        <form onSubmit={handleLogin} className="glass-panel p-8 space-y-5">
          <div>
            <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
              E-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-racing-red transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-mono uppercase tracking-wider mb-2">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-racing-red transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-racing-red text-sm font-mono">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-racing-red hover:bg-racing-red/80 text-white font-display tracking-widest py-3 h-auto"
          >
            {loading ? 'WIRD GELADEN...' : 'ANMELDEN'}
          </Button>
        </form>
      </div>
    </main>
  )
}
