"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Brain, BookOpen, Plus, Play, Trophy, LogOut, Settings, Zap, Target, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Dados mockados para demonstração
  const stats = {
    totalSubjects: 5,
    totalCards: 24,
    totalGames: 12,
    totalScore: 1850,
    accuracy: 87.5,
    streak: 7,
  }

  useEffect(() => {
    const currentUser =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("memory-cards-user") || "null") : null

    if (!currentUser) {
      router.push("/")
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("memory-cards-user")
    toast({
      title: "Logout realizado com sucesso!",
      description: "Até logo!",
    })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/5 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b">
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

      {/* Conteúdo principal */}
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

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Assuntos",
              value: stats.totalSubjects,
              description: "categorias criadas",
              icon: BookOpen,
              color: "text-blue-600",
              bgColor: "bg-blue-100 dark:bg-blue-900/30",
              delay: 0,
            },
            {
              title: "Cards",
              value: stats.totalCards,
              description: "cards disponíveis",
              icon: Brain,
              color: "text-green-600",
              bgColor: "bg-green-100 dark:bg-green-900/30",
              delay: 0.1,
            },
            {
              title: "Jogos",
              value: stats.totalGames,
              description: "sessões jogadas",
              icon: Play,
              color: "text-purple-600",
              bgColor: "bg-purple-100 dark:bg-purple-900/30",
              delay: 0.2,
            },
            {
              title: "Pontuação",
              value: stats.totalScore,
              description: "pontos totais",
              icon: Trophy,
              color: "text-yellow-600",
              bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
              delay: 0.3,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="glass hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`p-2 rounded-full ${stat.bgColor}`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: stat.delay + 0.2 }}
                    className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Cards de ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Gerenciar Cards",
              description: "Crie, edite e organize seus memory cards por assuntos",
              icon: Settings,
              badge: `${stats.totalCards} cards`,
              buttonText: "Gerenciar",
              href: "/cards",
              color: "from-blue-600 to-blue-500",
              delay: 0,
            },
            {
              title: "Iniciar Jogo",
              description: "Configure e inicie uma nova sessão de treinamento",
              icon: Zap,
              badge: `${stats.totalSubjects} assuntos`,
              buttonText: "Jogar Agora",
              href: "/game",
              color: "from-green-600 to-green-500",
              delay: 0.1,
            },
            {
              title: "Rankings",
              description: "Veja seu progresso e compare com outros jogadores",
              icon: Trophy,
              badge: `${stats.totalGames} jogos`,
              buttonText: "Ver Ranking",
              href: "/rankings",
              color: "from-purple-600 to-purple-500",
              delay: 0.2,
            },
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: action.delay }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={action.href}>
                <Card className="h-full glass hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-2 rounded-lg bg-primary/10 text-primary"
                      >
                        <action.icon className="h-6 w-6" />
                      </motion.div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {action.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <Button
                        className={`w-full bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-300`}
                      >
                        {action.buttonText}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Progresso e estatísticas detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Seu Progresso
                </CardTitle>
                <CardDescription>Estatísticas detalhadas do seu desempenho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Precisão:</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {stats.accuracy}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sequência atual:</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {stats.streak} acertos
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Pontuação média:</span>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {Math.round(stats.totalScore / stats.totalGames)} pts/jogo
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Próximos Passos
                </CardTitle>
                <CardDescription>Continue evoluindo seus estudos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalCards}</div>
                  <p className="text-muted-foreground mb-4">Cards criados até agora</p>
                  <div className="flex gap-2">
                    <Link href="/cards" className="flex-1">
                      <Button className="w-full" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Mais
                      </Button>
                    </Link>
                    <Link href="/game" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Praticar
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
