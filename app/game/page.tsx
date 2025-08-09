"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Play, Timer, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface GameCard {
  id: string
  title: string
  content: string
  difficulty: number
  subject_id: string
}

interface GameConfig {
  totalCards: number
  timePerCard: number | null
  subjectId: string | null
}

interface GameState {
  sessionId: string | null
  currentCardIndex: number
  cards: GameCard[]
  score: number
  correctAnswers: number
  wrongAnswers: number
  timeLeft: number | null
  userAnswer: string
  showResult: boolean
  isCorrect: boolean | null
  gameCompleted: boolean
}

type Subject = { id: string; name: string }

type UserLite = { id: string; email?: string } | null

export default function GamePage() {
  const [user, setUser] = useState<UserLite>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [config, setConfig] = useState<GameConfig>({ totalCards: 10, timePerCard: null, subjectId: null })
  const [gameState, setGameState] = useState<GameState>({
    sessionId: null,
    currentCardIndex: 0,
    cards: [],
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeLeft: null,
    userAnswer: "",
    showResult: false,
    isCorrect: null,
    gameCompleted: false,
  })

  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const currentUser =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("memory-cards-user") || "null") : null
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    loadSubjects(currentUser.id)
  }, [router])

  useEffect(() => {
    if (gameState.timeLeft !== null && gameState.timeLeft > 0 && !gameState.showResult) {
      const newTimer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft! - 1 }))
      }, 1000)
      setTimer(newTimer)
    } else if (gameState.timeLeft === 0 && !gameState.showResult) {
      handleTimeUp()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [gameState.timeLeft, gameState.showResult]) // eslint-disable-line

  const loadSubjects = async (userId: string) => {
    try {
      const res = await fetch(`/api/subjects?userId=${encodeURIComponent(userId)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao carregar assuntos")
      setSubjects(data.subjects.map((s: any) => ({ id: s.id, name: s.name })))
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao carregar assuntos", description: "Tente novamente mais tarde.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const startGame = async () => {
    if (!user) return
    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          totalCards: config.totalCards,
          subjectId: config.subjectId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao iniciar jogo")
      if (!data.cards || data.cards.length === 0) {
        toast({
          title: "Nenhum card encontrado",
          description: "Crie alguns cards antes de iniciar o jogo.",
          variant: "destructive",
        })
        return
      }
      const sessionId = `session-${Date.now()}`
      setGameState({
        sessionId,
        currentCardIndex: 0,
        cards: data.cards,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        timeLeft: config.timePerCard,
        userAnswer: "",
        showResult: false,
        isCorrect: null,
        gameCompleted: false,
      })
      setGameStarted(true)
      toast({ title: "Jogo iniciado! Boa sorte!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao iniciar jogo", description: "Tente novamente.", variant: "destructive" })
    }
  }

  const handleTimeUp = () => {
    checkAnswer(true)
  }

  const checkAnswer = (timeUp = false) => {
    const currentCard = gameState.cards[gameState.currentCardIndex]
    const answer = gameState.userAnswer.toLowerCase().trim()
    const correctAnswer = currentCard.content.toLowerCase()

    const isCorrect =
      !timeUp &&
      (correctAnswer.includes(answer) || answer.includes(correctAnswer) || similarity(answer, correctAnswer) > 0.6)

    const points = isCorrect ? currentCard.difficulty * 10 : 0

    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
      showResult: true,
      isCorrect,
    }))

    if (timer) clearTimeout(timer)
  }

  const nextCard = () => {
    const nextIndex = gameState.currentCardIndex + 1
    if (nextIndex >= gameState.cards.length) {
      completeGame()
    } else {
      setGameState((prev) => ({
        ...prev,
        currentCardIndex: nextIndex,
        userAnswer: "",
        showResult: false,
        isCorrect: null,
        timeLeft: config.timePerCard,
      }))
    }
  }

  const completeGame = async () => {
    try {
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          score: gameState.score,
          correctAnswers: gameState.correctAnswers,
          wrongAnswers: gameState.wrongAnswers,
        }),
      })
      setGameState((prev) => ({ ...prev, gameCompleted: true }))
      toast({
        title: "Jogo concluído!",
        description: `Você acertou ${gameState.correctAnswers} de ${gameState.cards.length} cards!`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao finalizar jogo",
        description: "Mas seus resultados foram salvos.",
        variant: "destructive",
      })
    }
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameState({
      sessionId: null,
      currentCardIndex: 0,
      cards: [],
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeLeft: null,
      userAnswer: "",
      showResult: false,
      isCorrect: null,
      gameCompleted: false,
    })
    if (timer) clearTimeout(timer)
  }

  const similarity = (s1: string, s2: string) => {
    const longer = s1.length > s2.length ? s1 : s2
    const shorter = s1.length > s2.length ? s2 : s1
    const editDistance = levenshteinDistance(longer, shorter)
    return longer.length === 0 ? 0 : (longer.length - editDistance) / longer.length
  }

  const levenshteinDistance = (str1: string, str2: string) => {
    const matrix: number[][] = []
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i]
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1]
        else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
    return matrix[str2.length][str1.length]
  }

  const getCurrentCard = () => gameState.cards[gameState.currentCardIndex]
  const getProgress = () =>
    gameState.cards.length ? ((gameState.currentCardIndex + 1) / gameState.cards.length) * 100 : 0

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
            <h1 className="text-2xl font-bold">Jogo Memory Cards</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {gameStarted && (
              <>
                <Badge variant="outline">
                  Card {gameState.currentCardIndex + 1} de {gameState.cards.length}
                </Badge>
                <Badge variant="secondary">Pontuação: {gameState.score}</Badge>
                {gameState.timeLeft !== null && (
                  <Badge variant={gameState.timeLeft <= 10 ? "destructive" : "default"}>
                    <Timer className="h-4 w-4 mr-1" />
                    {gameState.timeLeft}s
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!gameStarted ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Jogo</CardTitle>
                <CardDescription>Configure as opções do seu jogo de memory cards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="total-cards">Número de Cards</Label>
                  <Select
                    value={config.totalCards.toString()}
                    onValueChange={(value) => setConfig({ ...config, totalCards: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 cards</SelectItem>
                      <SelectItem value="10">10 cards</SelectItem>
                      <SelectItem value="15">15 cards</SelectItem>
                      <SelectItem value="20">20 cards</SelectItem>
                      <SelectItem value="25">25 cards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time-per-card">Tempo por Card (opcional)</Label>
                  <Select
                    value={config.timePerCard?.toString() || "none"}
                    onValueChange={(value) =>
                      setConfig({ ...config, timePerCard: value === "none" ? null : Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem limite de tempo</SelectItem>
                      <SelectItem value="30">30 segundos</SelectItem>
                      <SelectItem value="60">1 minuto</SelectItem>
                      <SelectItem value="90">1 minuto e 30 segundos</SelectItem>
                      <SelectItem value="120">2 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Assunto (opcional)</Label>
                  <Select
                    value={config.subjectId || "all"}
                    onValueChange={(value) => setConfig({ ...config, subjectId: value === "all" ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os assuntos</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={startGame} className="w-full" size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar Jogo
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : gameState.gameCompleted ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Jogo Concluído!</CardTitle>
                <CardDescription>Confira seus resultados abaixo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{gameState.correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">Acertos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{gameState.wrongAnswers}</div>
                    <div className="text-sm text-muted-foreground">Erros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((gameState.correctAnswers / gameState.cards.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Precisão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{gameState.score}</div>
                    <div className="text-sm text-muted-foreground">Pontos</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={resetGame} className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Jogar Novamente
                  </Button>
                  <Link href="/rankings" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Rankings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Progress value={getProgress()} className="h-2" />
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{getCurrentCard()?.title}</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Dificuldade {getCurrentCard()?.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-lg leading-relaxed">
                    {getCurrentCard()?.content.substring(0, Math.floor((getCurrentCard()?.content.length || 0) * 0.4))}
                    ...
                  </p>
                </div>

                {!gameState.showResult ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-answer">Complete ou descreva o que se refere:</Label>
                      <Textarea
                        id="user-answer"
                        value={gameState.userAnswer}
                        onChange={(e) => setGameState({ ...gameState, userAnswer: e.target.value })}
                        placeholder="Digite sua resposta aqui..."
                        className="min-h-[100px]"
                        disabled={gameState.timeLeft === 0}
                      />
                    </div>
                    <Button onClick={() => checkAnswer()} className="w-full" disabled={!gameState.userAnswer.trim()}>
                      Confirmar Resposta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg ${gameState.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                    >
                      <div className="flex items-center mb-2">
                        {gameState.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mr-2" />
                        )}
                        <span className={`font-semibold ${gameState.isCorrect ? "text-green-800" : "text-red-800"}`}>
                          {gameState.isCorrect ? "Correto!" : "Incorreto"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <strong>Sua resposta:</strong> {gameState.userAnswer || "Tempo esgotado"}
                        </div>
                        <div>
                          <strong>Resposta completa:</strong> {getCurrentCard()?.content}
                        </div>
                        {gameState.isCorrect && (
                          <div className="text-green-700">
                            <strong>Pontos ganhos:</strong> {getCurrentCard()?.difficulty! * 10}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button onClick={nextCard} className="w-full">
                      {gameState.currentCardIndex + 1 >= gameState.cards.length ? "Finalizar Jogo" : "Próximo Card"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
