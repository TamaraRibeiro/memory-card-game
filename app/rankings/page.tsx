"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, Star, Crown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

interface UserStats {
  id: string
  email: string
  totalGames: number
  totalCorrect: number
  totalWrong: number
  bestStreak: number
  totalScore: number
  accuracy: number
  averageScore: number
  rank: number
}

export default function RankingsPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Dados mockados para demonstração
  const globalRankings: UserStats[] = [
    {
      id: "1",
      email: "jogador1@exemplo.com",
      totalGames: 25,
      totalCorrect: 68,
      totalWrong: 12,
      bestStreak: 15,
      totalScore: 2100,
      accuracy: 85.0,
      averageScore: 84.0,
      rank: 1,
    },
    {
      id: "2",
      email: "usuario@exemplo.com",
      totalGames: 12,
      totalCorrect: 42,
      totalWrong: 18,
      bestStreak: 8,
      totalScore: 1850,
      accuracy: 70.0,
      averageScore: 154.2,
      rank: 2,
    },
    {
      id: "3",
      email: "jogador3@exemplo.com",
      totalGames: 18,
      totalCorrect: 45,
      totalWrong: 15,
      bestStreak: 10,
      totalScore: 1650,
      accuracy: 75.0,
      averageScore: 91.7,
      rank: 3,
    },
    {
      id: "4",
      email: "jogador4@exemplo.com",
      totalGames: 8,
      totalCorrect: 28,
      totalWrong: 7,
      bestStreak: 6,
      totalScore: 890,
      accuracy: 80.0,
      averageScore: 111.3,
      rank: 4,
    },
  ]

  const personalStats = globalRankings.find((stat) => stat.email === "usuario@exemplo.com")

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getInitials = (email: string) => email.substring(0, 2).toUpperCase()

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
      {/* Header */}
      <header className="glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Rankings</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="personal" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Estatísticas Pessoais</TabsTrigger>
            <TabsTrigger value="global">Ranking Global</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {personalStats ? (
              <>
                {/* Cards de estatísticas pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Posição Global",
                      value: `#${personalStats.rank}`,
                      description: "no ranking global",
                      icon: Trophy,
                      color: "text-yellow-600",
                      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
                    },
                    {
                      title: "Pontuação Total",
                      value: personalStats.totalScore,
                      description: "pontos acumulados",
                      icon: TrendingUp,
                      color: "text-blue-600",
                      bgColor: "bg-blue-100 dark:bg-blue-900/30",
                    },
                    {
                      title: "Precisão",
                      value: `${personalStats.accuracy}%`,
                      description: "taxa de acerto",
                      icon: Award,
                      color: "text-green-600",
                      bgColor: "bg-green-100 dark:bg-green-900/30",
                    },
                    {
                      title: "Jogos",
                      value: personalStats.totalGames,
                      description: "sessões jogadas",
                      icon: Medal,
                      color: "text-purple-600",
                      bgColor: "bg-purple-100 dark:bg-purple-900/30",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
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
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Detalhes do desempenho */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card className="glass">
                      <CardHeader>
                        <CardTitle>Desempenho Detalhado</CardTitle>
                        <CardDescription>Suas estatísticas completas</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Respostas Corretas:</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {personalStats.totalCorrect}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Respostas Incorretas:</span>
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            {personalStats.totalWrong}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Pontuação Média:</span>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {personalStats.averageScore.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Melhor Sequência:</span>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            {personalStats.bestStreak}
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
                        <CardTitle>Progresso</CardTitle>
                        <CardDescription>Continue jogando para melhorar sua posição</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary mb-2">#{personalStats.rank}</div>
                          <p className="text-muted-foreground">Posição atual</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href="/game" className="flex-1">
                            <Button className="w-full">Jogar Mais</Button>
                          </Link>
                          <Link href="/cards" className="flex-1">
                            <Button variant="outline" className="w-full bg-transparent">
                              Criar Cards
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="glass">
                  <CardContent className="text-center py-12">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma estatística ainda</h3>
                    <p className="text-muted-foreground mb-6">Jogue algumas partidas para ver suas estatísticas aqui</p>
                    <Link href="/game">
                      <Button>Começar a Jogar</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="global" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    Ranking Global
                  </CardTitle>
                  <CardDescription>Os melhores jogadores por pontuação total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {globalRankings.map((stat, index) => (
                      <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                          stat.email === user?.email
                            ? "bg-primary/5 border-primary/20 shadow-md"
                            : "bg-card hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12">{getRankIcon(stat.rank)}</div>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(stat.email)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {stat.email}
                                {stat.email === user?.email && (
                                  <Badge variant="outline" className="text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Você
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stat.totalGames} jogos • {stat.accuracy}% precisão
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{stat.totalScore}</div>
                          <div className="text-sm text-muted-foreground">pontos</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
