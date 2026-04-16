'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export function CupsSection() {
  const cups = [
    {
      id: 'nascar',
      label: 'NASCAR Cup',
      subtitle: 'Chevrolet Camaro ZL1',
      image: '/images/hero/nascar-feature.jpg',
      description: 'Hochleistungs-Musclecars im Kampf um die NASCAR-Krone. Volle Power, enge Rennen.',
    },
    {
      id: 'classic',
      label: 'Classic Cup',
      subtitle: 'Porsche 917K',
      image: '/images/hero/classic-feature.jpg',
      description: 'Legendäre Le-Mans-Rennwagen aus der goldenen Ära. Präzision trifft Geschichte.',
    },
  ]

  return (
    <section className="py-20 px-6 bg-zinc-950">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-racing-red" />
            <span className="text-racing-red font-mono text-xs uppercase tracking-widest">Die Fahrzeuge</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-white">ZWEI CUPS</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {cups.map((cup, i) => (
            <motion.div
              key={cup.id}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-lg aspect-video cursor-pointer"
            >
              <Image
                src={cup.image}
                alt={cup.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-racing-red font-mono text-xs uppercase tracking-widest mb-1">{cup.subtitle}</p>
                <h3 className="font-display text-3xl text-white mb-2">{cup.label}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{cup.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
