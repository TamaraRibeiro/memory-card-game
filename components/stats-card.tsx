"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: ReactNode
  delay?: number
  color?: "primary" | "success" | "warning" | "danger" | "purple"
}

export function StatsCard({ title, value, description, icon, delay = 0, color = "primary" }: StatsCardProps) {
  const colorClasses: Record<NonNullable<StatsCardProps["color"]>, string> = {
    primary: "from-blue-500 to-blue-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} opacity-5 dark:opacity-10 pointer-events-none`}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className={`p-2 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg`}
          >
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            {value}
          </motion.div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
