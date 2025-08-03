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
import { setStorageData, mockUser } from "@/lib/mock-data"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        setStorageData("memory-cards-user", { ...mockUser, email })
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Erro no login",
          description: "Preencha todos os campos",
          variant: "destructive",
        })
      }
      setLoading(false)
    }, 1000)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email && password.length >= 6) {
        toast({
          title: "Cadastro realizado!",
          description: "Você já pode fazer login com suas credenciais.",
        })
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Verifique se a senha tem pelo menos 6 caracteres",
          variant: "destructive",
        })
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="relative z-50 w-full max-w-md">
      <Card className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 shadow-2xl">
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold text-center">Acesse sua conta</CardTitle>
          <CardDescription className="text-center">Entre ou crie uma nova conta para começar</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 relative z-10">
              <TabsTrigger value="signin" className="relative z-10">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="signup" className="relative z-10">
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="relative z-10">
              <form onSubmit={handleSignIn} className="space-y-4 relative z-10">
                <div className="space-y-2 relative z-10">
                  <Label htmlFor="signin-email" className="relative z-10">
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="relative z-10 bg-white dark:bg-gray-800 border-2 focus:border-primary"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>
                <div className="space-y-2 relative z-10">
                  <Label htmlFor="signin-password" className="relative z-10">
                    Senha
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="relative z-10 bg-white dark:bg-gray-800 border-2 focus:border-primary"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full relative z-10 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
                  disabled={loading}
                  style={{ pointerEvents: "auto" }}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="relative z-10">
              <form onSubmit={handleSignUp} className="space-y-4 relative z-10">
                <div className="space-y-2 relative z-10">
                  <Label htmlFor="signup-email" className="relative z-10">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="relative z-10 bg-white dark:bg-gray-800 border-2 focus:border-primary"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>
                <div className="space-y-2 relative z-10">
                  <Label htmlFor="signup-password" className="relative z-10">
                    Senha
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="relative z-10 bg-white dark:bg-gray-800 border-2 focus:border-primary"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full relative z-10 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
                  disabled={loading}
                  style={{ pointerEvents: "auto" }}
                >
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
