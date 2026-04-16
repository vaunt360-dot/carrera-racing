'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Flag } from 'lucide-react'

const links = [
  { href: '/',           label: 'Home'       },
  { href: '/standings',  label: 'Standings'  },
  { href: '/race-days',  label: 'Race Days'  },
  { href: '/drivers',    label: 'Drivers'    },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#E8002D] flex items-center justify-center glow-red transition-all duration-300 group-hover:scale-110">
              <Flag className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bebas text-xl tracking-widest text-white">
              CRC<span className="text-[#E8002D]">·</span>Racing
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                  pathname === href
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {pathname === href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-white/[0.06] rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0.05, 0, 1] }}
            className="md:hidden overflow-hidden bg-[#09090B]/95 backdrop-blur-md border-b border-white/[0.06]"
          >
            <nav className="px-4 pb-4 pt-2 flex flex-col gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                    pathname === href
                      ? 'bg-white/[0.06] text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
