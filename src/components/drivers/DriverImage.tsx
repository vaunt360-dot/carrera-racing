'use client'

import Image from 'next/image'
import { useState } from 'react'

interface DriverImageProps {
  name: string
  color: string
  number: number
}

export default function DriverImage({ name, color, number }: DriverImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <span
          className="font-display text-8xl opacity-20"
          style={{ color }}
        >
          #{number}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={`/images/drivers/${name.toLowerCase()}.jpg`}
      alt={name}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setError(true)}
    />
  )
}
