"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Play, Timer, CheckCircle, XCircle, RotateCcw, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

interface GameCard {
  id: string
  title: string
  content: string
  difficulty: number
  subjectName: string
}

interface GameConfig {
  totalCards: number
  timePerCard: number | null
  subjectId: string | null
}

interface GameState {
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

export default function GamePage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Dados mockados
  const subjects = [
    { id: "1", name: "Matemática" },
    { id: "2", name: "História" },
    { id: "3", name: "Programação" },
  ]

  const mockCards: GameCard[] = [
    {
      id: "1",
      title: "Teorema de Pitágoras",
      content:
        "Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos. A fórmula é a² + b² = c².",
      difficulty: 2,
      subjectName: "Matemática",
    },
    {
      id: "2",
      title: "Revolução Francesa",
      content:
        "A Revolução Francesa foi um período de mudança política e social radical na França que durou de 1789 a 1799. Começou com a convocação dos Estados Gerais.",
      difficulty: 3,
      subjectName: "História",
    },
    {
      id: "3",
      title: "React Hooks",
      content:
        "Hooks são funções que permitem usar estado e outras funcionalidades do React em componentes funcionais. Os mais comuns são useState e useEffect.",
      difficulty: 3,
      subjectName: "Programação",
    },
    {
      id: "4",
      title: "Equação do Segundo Grau",
      content:
        "Uma equação do segundo grau tem a forma ax² + bx + c = 0. Suas raízes podem ser encontradas usando a fórmula de Bhaskara.",
      difficulty: 4,
      subjectName: "Matemática",
    },
    {
      id: "5",
      title: "Segunda Guerra Mundial",
      content:
        "A Segunda Guerra Mundial foi um conflito militar global que durou de 1939 a 1945. Envolveu a maioria das nações do mundo.",
      difficulty: 3,
      subjectName: "História",
    },
  ]

  const [config, setConfig] = useState<GameConfig>({ totalCards: 5, timePerCard: null, subjectId: null })
  const [gameState, setGameState] = useState<GameState>({
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

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

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
  }, [gameState.timeLeft, gameState.showResult])

  const startGame = () => {
    let selectedCards = [...mockCards]

    if (config.subjectId) {
      const subjectName = subjects.find((s) => s.id === config.subjectId)?.name
      selectedCards = selectedCards.filter((card) => card.subjectName === subjectName)
    }

    selectedCards = selectedCards.sort(() => Math.random() - 0.5).slice(0, config.totalCards)

    if (selectedCards.length === 0) {
      toast({
        title: "Nenhum card encontrado",
        description: "Crie alguns cards antes de iniciar o jogo.",
        variant: "destructive",
      })
      return
    }

    setGameState({
      currentCardIndex: 0,
      cards: selectedCards,
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

  const completeGame = () => {
    setGameState((prev) => ({ ...prev, gameCompleted: true }))
    toast({
      title: "Jogo concluído!",
      description: `Você acertou ${gameState.correctAnswers} de ${gameState.cards.length} cards!`,
    })
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameState({
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
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
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

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        {!gameStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="glass shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Configurar Jogo
                </CardTitle>
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
                      <SelectItem value="3">3 cards</SelectItem>
                      <SelectItem value="5">5 cards</SelectItem>
                      <SelectItem value="10">10 cards</SelectItem>
                      <SelectItem value="15">15 cards</SelectItem>
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
          </motion.div>
        ) : gameState.gameCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="glass shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">🎉 Jogo Concluído!</CardTitle>
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
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Progress value={getProgress()} className="h-3" />
            </motion.div>

            <motion.div
              key={gameState.currentCardIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass shadow-xl mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{getCurrentCard()?.title}</CardTitle>
                    <Badge className={`difficulty-${getCurrentCard()?.difficulty}`}>
                      Dificuldade {getCurrentCard()?.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-lg leading-relaxed">
                      {getCurrentCard()?.content.substring(
                        0,
                        Math.floor((getCurrentCard()?.content.length || 0) * 0.4),
                      )}
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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div
                        className={`p-4 rounded-lg ${
                          gameState.isCorrect
                            ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {gameState.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          )}
                          <span
                            className={`font-semibold ${
                              gameState.isCorrect
                                ? "text-green-800 dark:text-green-400"
                                : "text-red-800 dark:text-red-400"
                            }`}
                          >
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
                            <div className="text-green-700 dark:text-green-400">
                              <strong>Pontos ganhos:</strong> {getCurrentCard()?.difficulty! * 10}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button onClick={nextCard} className="w-full">
                        {gameState.currentCardIndex + 1 >= gameState.cards.length ? "Finalizar Jogo" : "Próximo Card"}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
