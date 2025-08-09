"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const upsertUser = async (mode: "login" | "signup") => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Falha de autenticação")
      localStorage.setItem("memory-cards-user", JSON.stringify({ id: data.user.id, email: data.user.email }))
      toast({
        title: mode === "login" ? "Login realizado com sucesso!" : "Cadastro realizado!",
        description: mode === "login" ? "Redirecionando para o dashboard..." : "Você já pode fazer login.",
      })
      if (mode === "login") router.push("/dashboard")
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message || "Tente novamente.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({ title: "Erro no login", description: "Preencha todos os campos", variant: "destructive" })
      return
    }
    upsertUser("login")
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "Verifique se a senha tem pelo menos 6 caracteres",
        variant: "destructive",
      })
      return
    }
    upsertUser("signup")
  }

  return (
    <div className="relative z-30 w-full max-w-md">
      <Card className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Acesse sua conta</CardTitle>
          <CardDescription className="text-center">Entre ou crie uma nova conta para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Senha</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
