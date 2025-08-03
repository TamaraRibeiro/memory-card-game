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
      "rgb(59, 130, 246)", // blue-500
      "rgb(147, 51, 234)", // purple-500
      "rgb(236, 72, 153)", // pink-500
      "rgb(34, 197, 94)", // green-500
      "rgb(251, 191, 36)", // yellow-500
    ]

    const initialParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
      y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setParticles(initialParticles)

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          const width = typeof window !== "undefined" ? window.innerWidth : 1200
          const height = typeof window !== "undefined" ? window.innerHeight : 800

          // Bounce off edges
          if (newX <= 0 || newX >= width) {
            particle.speedX *= -1
            newX = Math.max(0, Math.min(width, newX))
          }
          if (newY <= 0 || newY >= height) {
            particle.speedY *= -1
            newY = Math.max(0, Math.min(height, newY))
          }

          return {
            ...particle,
            x: newX,
            y: newY,
          }
        }),
      )
    }

    const interval = setInterval(animateParticles, 50)
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
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  )
}
