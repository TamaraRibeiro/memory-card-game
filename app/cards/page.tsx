"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Plus, Edit, Trash2, ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

type UserLite = { id: string; email?: string } | null

type Subject = {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  updated_at: string
  card_count?: number
}

type CardItem = {
  id: string
  title: string
  content: string
  difficulty: number
  subject_id: string
  user_id: string
  created_at: string
  updated_at: string
  subject_name?: string
}

export default function CardsPage() {
  const [user, setUser] = useState<UserLite>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [cards, setCards] = useState<CardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubjectDialog, setShowSubjectDialog] = useState(false)
  const [showCardDialog, setShowCardDialog] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editingCard, setEditingCard] = useState<CardItem | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const [subjectForm, setSubjectForm] = useState({ name: "", description: "" })
  const [cardForm, setCardForm] = useState({ title: "", content: "", difficulty: 1, subject_id: "" })

  useEffect(() => {
    const currentUser =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("memory-cards-user") || "null") : null
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    void loadData(currentUser.id)
  }, [router])

  const loadData = async (userId: string) => {
    try {
      const [subRes, cardRes] = await Promise.all([
        fetch(`/api/subjects?userId=${encodeURIComponent(userId)}`),
        fetch(`/api/cards?userId=${encodeURIComponent(userId)}`),
      ])
      const subData = await subRes.json()
      const cardData = await cardRes.json()
      if (!subRes.ok) throw new Error(subData.error || "Erro ao carregar assuntos")
      if (!cardRes.ok) throw new Error(cardData.error || "Erro ao carregar cards")
      setSubjects(subData.subjects)
      setCards(cardData.cards)
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao carregar dados", description: "Tente novamente mais tarde.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      if (editingSubject) {
        const res = await fetch(`/api/subjects/${editingSubject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: subjectForm.name, description: subjectForm.description || null }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Erro ao atualizar assunto")
        toast({ title: "Assunto atualizado com sucesso!" })
      } else {
        const res = await fetch("/api/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: subjectForm.name,
            description: subjectForm.description || null,
            userId: user.id,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Erro ao criar assunto")
        toast({ title: "Assunto criado com sucesso!" })
      }
      setSubjectForm({ name: "", description: "" })
      setEditingSubject(null)
      setShowSubjectDialog(false)
      await loadData(user.id)
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao salvar assunto", description: "Tente novamente.", variant: "destructive" })
    }
  }

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      if (editingCard) {
        const res = await fetch(`/api/cards/${editingCard.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: cardForm.title,
            content: cardForm.content,
            difficulty: cardForm.difficulty,
            subject_id: cardForm.subject_id,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Erro ao atualizar card")
        toast({ title: "Card atualizado com sucesso!" })
      } else {
        const res = await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: cardForm.title,
            content: cardForm.content,
            difficulty: cardForm.difficulty,
            subject_id: cardForm.subject_id,
            user_id: user.id,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Erro ao criar card")
        toast({ title: "Card criado com sucesso!" })
      }
      setCardForm({ title: "", content: "", difficulty: 1, subject_id: "" })
      setEditingCard(null)
      setShowCardDialog(false)
      await loadData(user.id)
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao salvar card", description: "Tente novamente.", variant: "destructive" })
    }
  }

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Tem certeza? Todos os cards deste assunto serão excluídos.")) return
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao excluir assunto")
      toast({ title: "Assunto excluído com sucesso!" })
      await loadData(user!.id)
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao excluir assunto", description: "Tente novamente.", variant: "destructive" })
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este card?")) return
    try {
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao excluir card")
      toast({ title: "Card excluído com sucesso!" })
      await loadData(user!.id)
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao excluir card", description: "Tente novamente.", variant: "destructive" })
    }
  }

  const openEditSubject = (subject: Subject) => {
    setEditingSubject(subject)
    setSubjectForm({ name: subject.name, description: subject.description || "" })
    setShowSubjectDialog(true)
  }

  const openEditCard = (card: CardItem) => {
    setEditingCard(card)
    setCardForm({ title: card.title, content: card.content, difficulty: card.difficulty, subject_id: card.subject_id })
    setShowCardDialog(true)
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "badge-difficulty-1"
      case 2:
        return "badge-difficulty-2"
      case 3:
        return "badge-difficulty-3"
      case 4:
        return "badge-difficulty-4"
      case 5:
        return "badge-difficulty-5"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Muito Fácil"
      case 2:
        return "Fácil"
      case 3:
        return "Médio"
      case 4:
        return "Difícil"
      case 5:
        return "Muito Difícil"
      default:
        return "Desconhecido"
    }
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
            <h1 className="text-2xl font-bold">Gerenciar Cards</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
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

            <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCard(null)
                    setCardForm({ title: "", content: "", difficulty: 1, subject_id: "" })
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
                      value={cardForm.subject_id}
                      onValueChange={(value) => setCardForm({ ...cardForm, subject_id: value })}
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Assuntos ({subjects.length})</h2>
          {subjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum assunto criado ainda. Crie um assunto para organizar seus cards.
                </p>
                <Button onClick={() => setShowSubjectDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Assunto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card key={subject.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditSubject(subject)}>
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
                    <Badge variant="secondary">{subject.card_count ?? 0} cards</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Cards ({cards.length})</h2>
          {cards.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-8">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum card criado ainda. {subjects.length === 0 ? "Crie um assunto primeiro, depois" : "Crie"} seus
                  primeiros memory cards.
                </p>
                {subjects.length > 0 ? (
                  <Button onClick={() => setShowCardDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Card
                  </Button>
                ) : (
                  <Button onClick={() => setShowSubjectDialog(true)}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Criar Assunto Primeiro
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <Card key={card.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{card.title}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditCard(card)}>
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
                      <Badge variant="outline">{card.subject_name}</Badge>
                      <Badge className={getDifficultyColor(card.difficulty)}>
                        {getDifficultyText(card.difficulty)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
