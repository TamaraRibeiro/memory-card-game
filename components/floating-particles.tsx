"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const colors = [
      "rgb(59, 130, 246)",
      "rgb(147, 51, 234)",
      "rgb(236, 72, 153)",
      "rgb(34, 197, 94)",
      "rgb(251, 191, 36)",
    ]
    const w = typeof window !== "undefined" ? window.innerWidth : 1200
    const h = typeof window !== "undefined" ? window.innerHeight : 800
    const initialParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(initialParticles)

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          const width = typeof window !== "undefined" ? window.innerWidth : w
          const height = typeof window !== "undefined" ? window.innerHeight : h
          let nx = p.x + p.speedX
          let ny = p.y + p.speedY
          if (nx <= 0 || nx >= width) (nx = Math.max(0, Math.min(width, nx))), (p.speedX *= -1)
          if (ny <= 0 || ny >= height) (ny = Math.max(0, Math.min(height, ny))), (p.speedY *= -1)
          return { ...p, x: nx, y: ny }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse pointer-events-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: "blur(1px)",
            transition: "all 0.05s linear",
          }}
        />
      ))}
    </div>
  )
}
