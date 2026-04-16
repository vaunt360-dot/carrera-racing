import Link from 'next/link'
import { Flag } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#09090B] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E8002D] flex items-center justify-center">
              <Flag className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bebas text-lg tracking-widest">
              Carrera Racing Club
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
            <Link href="/race-days" className="hover:text-white transition-colors">Race Days</Link>
            <Link href="/drivers" className="hover:text-white transition-colors">Drivers</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>

          <p className="text-xs text-zinc-600">
            Season 2026/27 · NASCAR Cup & Classic Cup
          </p>
        </div>
      </div>
    </footer>
  )
}
