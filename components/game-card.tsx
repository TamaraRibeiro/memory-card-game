"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GameCardProps {
  title: string
  description: string
  icon: ReactNode
  badge: string
  buttonText: string
  onClick?: () => void
  className?: string
  delay?: number
}

export function GameCard({
  title,
  description,
  icon,
  badge,
  buttonText,
  onClick,
  className = "",
  delay = 0,
}: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, rotateY: 5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      className={`cursor-pointer ${className}`}
    >
      <Card className="relative overflow-hidden group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 rounded-lg bg-primary/10 text-primary"
            >
              {icon}
            </motion.div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {badge}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Button
              onClick={onClick}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {buttonText}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
