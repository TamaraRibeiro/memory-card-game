"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStorageData, initializeData, mockGlobalRankings, type UserStats } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Trophy, Medal, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface PersonalStats extends UserStats {
  accuracy: number
  averageScore: number
  rank: number
}

export default function RankingsPage() {
  const [user, setUser] = useState(null)
  const [globalRankings, setGlobalRankings] = useState<UserStats[]>([])
  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    initializeData()
    const currentUser = getStorageData("memory-cards-user", null)
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    loadRankings(currentUser.id)
    setLoading(false)
  }, [router])

  const loadRankings = async (userId: string) => {
    try {
      // Use mock global rankings and sort by score
      const processedGlobal = mockGlobalRankings
        .sort((a, b) => b.total_score - a.total_score)
        .map((stat, index) => ({
          ...stat,
          rank: index + 1,
          accuracy: stat.total_games > 0 ? (stat.total_correct / (stat.total_correct + stat.total_wrong)) * 100 : 0,
          averageScore: stat.total_games > 0 ? stat.total_score / stat.total_games : 0,
        }))

      setGlobalRankings(processedGlobal)

      // Load personal stats from localStorage
      const personalData = getStorageData("memory-cards-user-stats", null)

      if (personalData) {
        const userRank = processedGlobal.findIndex((stat) => stat.user_id === userId) + 1
        const personalWithRank: PersonalStats = {
          ...personalData,
          accuracy:
            personalData.total_games > 0
              ? (personalData.total_correct / (personalData.total_correct + personalData.total_wrong)) * 100
              : 0,
          averageScore: personalData.total_games > 0 ? personalData.total_score / personalData.total_games : 0,
          rank: userRank || 0,
        }
        setPersonalStats(personalWithRank)
      }
    } catch (error) {
      console.error("Error loading rankings:", error)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300"
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-300"
      default:
        return "bg-blue-100 text-blue-800 border-blue-300"
    }
  }

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : "U"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
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

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="personal" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Estatísticas Pessoais</TabsTrigger>
            <TabsTrigger value="global">Ranking Global</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {personalStats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Posição Global</CardTitle>
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {personalStats.rank > 0 ? `#${personalStats.rank}` : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground">no ranking global</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pontuação Total</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{personalStats.total_score}</div>
                      <p className="text-xs text-muted-foreground">pontos acumulados</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Precisão</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{personalStats.accuracy.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">taxa de acerto</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Jogos</CardTitle>
                      <Medal className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{personalStats.total_games}</div>
                      <p className="text-xs text-muted-foreground">sessões jogadas</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Desempenho Detalhado</CardTitle>
                      <CardDescription>Suas estatísticas completas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Respostas Corretas:</span>
                        <Badge variant="secondary">{personalStats.total_correct}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Respostas Incorretas:</span>
                        <Badge variant="secondary">{personalStats.total_wrong}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Pontuação Média:</span>
                        <Badge variant="secondary">{personalStats.averageScore.toFixed(1)}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Melhor Sequência:</span>
                        <Badge variant="secondary">{personalStats.best_streak}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progresso</CardTitle>
                      <CardDescription>Continue jogando para melhorar sua posição</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {personalStats.rank > 0 ? personalStats.rank : "?"}
                        </div>
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
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma estatística ainda</h3>
                  <p className="text-muted-foreground mb-6">Jogue algumas partidas para ver suas estatísticas aqui</p>
                  <Link href="/game">
                    <Button>Começar a Jogar</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="global" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ranking Global</CardTitle>
                <CardDescription>Os melhores jogadores por pontuação total</CardDescription>
              </CardHeader>
              <CardContent>
                {globalRankings.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum jogador no ranking ainda. Seja o primeiro!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {globalRankings.map((stat, index) => (
                      <div
                        key={stat.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          stat.user_id === user?.id ? "bg-primary/5 border-primary/20" : "bg-card"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index + 1)}</div>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(stat.email || "U")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {stat.email || "Usuário"}
                                {stat.user_id === user?.id && (
                                  <Badge variant="outline" className="ml-2">
                                    Você
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stat.total_games} jogos • {stat.accuracy.toFixed(1)}% precisão
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{stat.total_score}</div>
                          <div className="text-sm text-muted-foreground">pontos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
