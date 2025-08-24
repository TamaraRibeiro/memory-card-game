"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Plus, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

interface Subject {
  id: string
  name: string
  description: string
  cardCount: number
}

interface CardItem {
  id: string
  title: string
  content: string
  difficulty: number
  subjectId: string
  subjectName: string
}

export default function CardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSubjectDialog, setShowSubjectDialog] = useState(false)
  const [showCardDialog, setShowCardDialog] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editingCard, setEditingCard] = useState<CardItem | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Dados mockados
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Matemática", description: "Conceitos fundamentais", cardCount: 8 },
    { id: "2", name: "História", description: "Eventos importantes", cardCount: 6 },
    { id: "3", name: "Programação", description: "Desenvolvimento de software", cardCount: 10 },
  ])

  const [cards, setCards] = useState<CardItem[]>([
    {
      id: "1",
      title: "Teorema de Pitágoras",
      content: "Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos.",
      difficulty: 2,
      subjectId: "1",
      subjectName: "Matemática",
    },
    {
      id: "2",
      title: "Revolução Francesa",
      content: "Período de mudança política e social radical na França (1789-1799).",
      difficulty: 3,
      subjectId: "2",
      subjectName: "História",
    },
    {
      id: "3",
      title: "React Hooks",
      content: "Funções que permitem usar estado e outras funcionalidades do React em componentes funcionais.",
      difficulty: 3,
      subjectId: "3",
      subjectName: "Programação",
    },
  ])

  const [subjectForm, setSubjectForm] = useState({ name: "", description: "" })
  const [cardForm, setCardForm] = useState({ title: "", content: "", difficulty: 1, subjectId: "" })

  // useEffect(() => {
  //   const currentUser =
  //     typeof window !== "undefined" ? JSON.parse(localStorage.getItem("memory-cards-user") || "null") : null

  //   if (!currentUser) {
  //     router.push("/")
  //     return
  //   }

  //   setUser(currentUser)
  //   setLoading(false)
  // }, [router])

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.subjectName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDifficultyText = (difficulty: number) => {
    const levels = ["", "Muito Fácil", "Fácil", "Médio", "Difícil", "Muito Difícil"]
    return levels[difficulty] || "Desconhecido"
  }

  const getDifficultyClass = (difficulty: number) => {
    return `difficulty-${difficulty}`
  }

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSubject) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editingSubject.id ? { ...s, name: subjectForm.name, description: subjectForm.description } : s,
        ),
      )
      toast({ title: "Assunto atualizado com sucesso!" })
    } else {
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: subjectForm.name,
        description: subjectForm.description,
        cardCount: 0,
      }
      setSubjects((prev) => [...prev, newSubject])
      toast({ title: "Assunto criado com sucesso!" })
    }
    setSubjectForm({ name: "", description: "" })
    setEditingSubject(null)
    setShowSubjectDialog(false)
  }

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = subjects.find((s) => s.id === cardForm.subjectId)
    if (!subject) return

    if (editingCard) {
      setCards((prev) =>
        prev.map((c) => (c.id === editingCard.id ? { ...c, ...cardForm, subjectName: subject.name } : c)),
      )
      toast({ title: "Card atualizado com sucesso!" })
    } else {
      const newCard: CardItem = {
        id: Date.now().toString(),
        ...cardForm,
        subjectName: subject.name,
      }
      setCards((prev) => [...prev, newCard])
      setSubjects((prev) => prev.map((s) => (s.id === cardForm.subjectId ? { ...s, cardCount: s.cardCount + 1 } : s)))
      toast({ title: "Card criado com sucesso!" })
    }
    setCardForm({ title: "", content: "", difficulty: 1, subjectId: "" })
    setEditingCard(null)
    setShowCardDialog(false)
  }

  const handleDeleteSubject = (id: string) => {
    if (!confirm("Tem certeza? Todos os cards deste assunto serão excluídos.")) return
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setCards((prev) => prev.filter((c) => c.subjectId !== id))
    toast({ title: "Assunto excluído com sucesso!" })
  }

  const handleDeleteCard = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este card?")) return
    const card = cards.find((c) => c.id === id)
    if (card) {
      setCards((prev) => prev.filter((c) => c.id !== id))
      setSubjects((prev) =>
        prev.map((s) => (s.id === card.subjectId ? { ...s, cardCount: Math.max(0, s.cardCount - 1) } : s)),
      )
      toast({ title: "Card excluído com sucesso!" })
    }
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <motion.div
  //         animate={{ rotate: 360 }}
  //         transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
  //         className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
  //       />
  //     </div>
  //   )
  // }

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
            <h1 className="text-2xl font-bold">Gerenciar Cards</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Dialog para criar/editar assunto */}
            <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSubject(null)
                    setSubjectForm({ name: "", description: "" })
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Novo Assunto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSubject ? "Editar Assunto" : "Novo Assunto"}</DialogTitle>
                  <DialogDescription>
                    {editingSubject
                      ? "Edite as informações do assunto."
                      : "Crie um novo assunto para organizar seus cards."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubjectSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="subject-name">Nome</Label>
                    <Input
                      id="subject-name"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                      placeholder="Ex: Matemática, História..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject-description">Descrição (opcional)</Label>
                    <Textarea
                      id="subject-description"
                      value={subjectForm.description}
                      onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                      placeholder="Descreva o assunto..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingSubject ? "Atualizar" : "Criar"} Assunto
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Dialog para criar/editar card */}
            <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCard(null)
                    setCardForm({ title: "", content: "", difficulty: 1, subjectId: "" })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Card
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingCard ? "Editar Card" : "Novo Card"}</DialogTitle>
                  <DialogDescription>
                    {editingCard ? "Edite as informações do card." : "Crie um novo memory card."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="card-subject">Assunto</Label>
                    <Select
                      value={cardForm.subjectId}
                      onValueChange={(value) => setCardForm({ ...cardForm, subjectId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="card-title">Título</Label>
                    <Input
                      id="card-title"
                      value={cardForm.title}
                      onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                      placeholder="Título do card"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-content">Conteúdo</Label>
                    <Textarea
                      id="card-content"
                      value={cardForm.content}
                      onChange={(e) => setCardForm({ ...cardForm, content: e.target.value })}
                      placeholder="Conteúdo completo do card..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-difficulty">Dificuldade</Label>
                    <Select
                      value={cardForm.difficulty.toString()}
                      onValueChange={(value) => setCardForm({ ...cardForm, difficulty: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Muito Fácil</SelectItem>
                        <SelectItem value="2">2 - Fácil</SelectItem>
                        <SelectItem value="3">3 - Médio</SelectItem>
                        <SelectItem value="4">4 - Difícil</SelectItem>
                        <SelectItem value="5">5 - Muito Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingCard ? "Atualizar" : "Criar"} Card
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Seção de Assuntos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Assuntos ({subjects.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingSubject(subject)
                            setSubjectForm({ name: subject.name, description: subject.description })
                            setShowSubjectDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSubject(subject.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {subject.description && <CardDescription>{subject.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{subject.cardCount} cards</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seção de Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Cards ({cards.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{card.title}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCard(card)
                            setCardForm({
                              title: card.title,
                              content: card.content,
                              difficulty: card.difficulty,
                              subjectId: card.subjectId,
                            })
                            setShowCardDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCard(card.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{card.content}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{card.subjectName}</Badge>
                      <Badge className={getDifficultyClass(card.difficulty)}>
                        {getDifficultyText(card.difficulty)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "Nenhum card encontrado" : "Nenhum card criado ainda"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Tente ajustar sua busca ou criar um novo card"
                  : "Crie seus primeiros memory cards para começar a estudar"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCardDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Card
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
