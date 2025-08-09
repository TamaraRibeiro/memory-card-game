"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen, Plus, Play, Trophy, LogOut, Settings, Zap, Target, Star } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getStorageData, setStorageData, initializeData } from "@/lib/mock-data"
import { ThemeToggle } from "@/components/theme-toggle"
import { FloatingParticles } from "@/components/floating-particles"
import { AnimatedBackground } from "@/components/animated-background"
import { GameCard } from "@/components/game-card"
import { StatsCard } from "@/components/stats-card"
import { motion } from "framer-motion"

type UserLite = { id: string; email?: string } | null

export default function DashboardPage() {
  const [user, setUser] = useState<UserLite>(null)
  const [stats, setStats] = useState({ totalSubjects: 0, totalCards: 0, totalGames: 0, bestScore: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    initializeData()
    const currentUser = getStorageData("memory-cards-user", null)
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    loadStats()
    setLoading(false)
  }, [router])

  const loadStats = () => {
    const subjects = getStorageData("memory-cards-subjects", [])
    const cards = getStorageData("memory-cards-cards", [])
    const userStats = getStorageData("memory-cards-user-stats", { total_games: 0, total_score: 0 })

    setStats({
      totalSubjects: subjects.length,
      totalCards: cards.length,
      totalGames: userStats.total_games,
      bestScore: userStats.total_score,
    })
  }

  const handleSignOut = () => {
    setStorageData("memory-cards-user", null)
    toast({ title: "Logout realizado com sucesso!", description: "Até logo!" })
    router.push("/")
  }

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

      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Brain className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Memory Cards
            </h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Olá, {user?.email}</span>
            </motion.div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="hover:bg-destructive hover:text-destructive-foreground bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">Gerencie seus cards e acompanhe seu progresso</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Assuntos"
            value={stats.totalSubjects}
            description="categorias criadas"
            icon={<BookOpen className="h-4 w-4" />}
            delay={0}
            color="primary"
          />
          <StatsCard
            title="Cards"
            value={stats.totalCards}
            description="cards disponíveis"
            icon={<Brain className="h-4 w-4" />}
            delay={0.1}
            color="success"
          />
          <StatsCard
            title="Jogos"
            value={stats.totalGames}
            description="sessões jogadas"
            icon={<Play className="h-4 w-4" />}
            delay={0.2}
            color="warning"
          />
          <StatsCard
            title="Pontuação"
            value={stats.bestScore}
            description="pontos totais"
            icon={<Trophy className="h-4 w-4" />}
            delay={0.3}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/cards">
            <GameCard
              title="Gerenciar Cards"
              description="Crie, edite e organize seus memory cards por assuntos"
              icon={<Settings className="h-6 w-6" />}
              badge={`${stats.totalCards} cards`}
              buttonText="Gerenciar"
              delay={0}
            />
          </Link>
          <Link href="/game">
            <GameCard
              title="Iniciar Jogo"
              description="Configure e inicie uma nova sessão de treinamento"
              icon={<Zap className="h-6 w-6" />}
              badge={`${stats.totalSubjects} assuntos`}
              buttonText="Jogar Agora"
              delay={0.1}
            />
          </Link>
          <Link href="/rankings">
            <GameCard
              title="Rankings"
              description="Veja seu progresso e compare com outros jogadores"
              icon={<Trophy className="h-6 w-6" />}
              badge={`${stats.totalGames} jogos`}
              buttonText="Ver Ranking"
              delay={0.2}
            />
          </Link>
        </div>

        {stats.totalCards === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl pointer-events-none" />
            <div className="relative bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur-sm border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="mb-4"
              >
                <Target className="h-16 w-16 text-primary mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Comece criando seus primeiros cards!</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Você ainda não tem nenhum card. Crie alguns para começar a treinar.
              </p>
              <Link href="/cards">
                <Button size="lg" className="btn-game">
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeiro Card
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
