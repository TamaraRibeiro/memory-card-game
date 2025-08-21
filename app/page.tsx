"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BookOpen, Trophy, Timer, Sparkles, Zap, Target } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { FloatingParticles } from "@/components/floating-particles"
import { AnimatedBackground } from "@/components/animated-background"
import { motion } from "framer-motion"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = typeof window !== "undefined" ? localStorage.getItem("memory-cards-user") : null
    if (currentUser) {
      router.push("/dashboard")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />

      <header className="relative z-20 container mx-auto px-4 py-4 flex justify-end">
        <ThemeToggle />
      </header>

      <div className="relative z-20 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative"
            >
              <Brain className="h-16 w-16 text-primary drop-shadow-lg" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 rounded-full bg-primary/20 blur-xl pointer-events-none"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl font-bold ml-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Memory Cards
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Crie seus próprios memory cards e treine sua memória de forma inteligente e divertida
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
            <span className="text-sm font-medium text-primary">Gamificado • Inteligente • Divertido</span>
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                {
                  icon: BookOpen,
                  title: "Crie Cards",
                  desc: "Organize por assuntos",
                  color: "from-blue-500 to-blue-600",
                  delay: 0,
                },
                {
                  icon: Timer,
                  title: "Cronômetro",
                  desc: "Treine contra o tempo",
                  color: "from-green-500 to-green-600",
                  delay: 0.1,
                },
                {
                  icon: Zap,
                  title: "Jogo Inteligente",
                  desc: "Sistema adaptativo",
                  color: "from-purple-500 to-purple-600",
                  delay: 0.2,
                },
                {
                  icon: Trophy,
                  title: "Rankings",
                  desc: "Compete globalmente",
                  color: "from-yellow-500 to-yellow-600",
                  delay: 0.3,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  className="group relative z-10"
                >
                  <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                    <CardContent className="p-6 text-center relative">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${item.color} p-3 text-white shadow-lg`}
                      >
                        <item.icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative z-10"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur-sm border-2 hover:border-primary/30 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 pointer-events-none" />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Como Funciona</CardTitle>
                  </div>
                  <CardDescription>Três passos simples para começar a treinar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Crie seus Cards",
                      desc: "Adicione assuntos, títulos, conteúdo e defina a dificuldade",
                    },
                    {
                      step: "2",
                      title: "Configure o Jogo",
                      desc: "Escolha quantos cards, tempo limite e assuntos específicos",
                    },
                    { step: "3", title: "Treine e Compete", desc: "Complete os cards e suba no ranking global" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex items-start space-x-4 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                      >
                        {item.step}
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center relative z-30"
          >
            <div className="relative w-full max-w-md">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-20 pointer-events-none"
              />
              <AuthForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
