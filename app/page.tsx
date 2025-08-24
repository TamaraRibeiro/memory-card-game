"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  Trophy,
  Timer,
  Sparkles,
  Zap,
  Target,
  Play,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

import { manageAuthGoogle, manageAuthSignOut } from "./actions/manage-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  // const router = useRouter();
  // const { toast } = useToast();

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email || !password) {
  //     toast({
  //       title: "Campos obrigatórios",
  //       description: "Preencha email e senha para continuar",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   // Simular login
  //   setTimeout(() => {
  //     localStorage.setItem("memory-cards-user", JSON.stringify({ email }));
  //     toast({
  //       title: "Login realizado com sucesso!",
  //       description: "Redirecionando para o dashboard...",
  //     });
  //     router.push("/dashboard");
  //   }, 1000);
  // };

  // const handleRegister = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email || password.length < 6) {
  //     toast({
  //       title: "Dados inválidos",
  //       description: "Verifique se a senha tem pelo menos 6 caracteres",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   // Simular registro
  //   setTimeout(() => {
  //     localStorage.setItem("memory-cards-user", JSON.stringify({ email }));
  //     toast({
  //       title: "Conta criada com sucesso!",
  //       description: "Bem-vindo ao Memory Cards!",
  //     });
  //     router.push("/dashboard");
  //   }, 1000);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex justify-end">
        <ThemeToggle />
      </header>

      {/* Conteúdo principal */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
          {/* Lado esquerdo - Informações */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="relative"
                >
                  <Brain className="h-16 w-16 text-primary drop-shadow-lg" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                  />
                </motion.div>
                <h1 className="text-5xl lg:text-6xl font-bold ml-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Memory Cards
                </h1>
              </div>

              <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                Transforme seus estudos com memory cards inteligentes. Crie,
                organize e pratique de forma gamificada e divertida.
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Gamificado • Inteligente • Divertido
                </span>
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                {
                  icon: BookOpen,
                  title: "Crie Cards",
                  desc: "Organize por assuntos",
                  color: "text-blue-600",
                },
                {
                  icon: Timer,
                  title: "Cronômetro",
                  desc: "Treine contra o tempo",
                  color: "text-green-600",
                },
                {
                  icon: Zap,
                  title: "Sistema Inteligente",
                  desc: "Adaptativo e eficiente",
                  color: "text-purple-600",
                },
                {
                  icon: Trophy,
                  title: "Rankings",
                  desc: "Compete e evolua",
                  color: "text-yellow-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="h-full glass hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`h-10 w-10 mx-auto mb-3 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-2 shadow-md ${feature.color}`}
                      >
                        <feature.icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="font-semibold text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Como funciona */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Como Funciona</CardTitle>
                  </div>
                  <CardDescription>
                    Três passos simples para começar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Crie seus Cards",
                      desc: "Adicione conteúdo e organize por assuntos",
                    },
                    {
                      step: "2",
                      title: "Configure o Jogo",
                      desc: "Escolha dificuldade e tempo limite",
                    },
                    {
                      step: "3",
                      title: "Treine e Evolua",
                      desc: "Pratique e acompanhe seu progresso",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Lado direito - Formulário de Login */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <Card className="glass shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    Acesse sua conta
                  </CardTitle>
                  <CardDescription>
                    Entre ou crie uma nova conta para começar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {session?.user ? (
                    <div className="flex flex-col w-full gap-2">
                      <Link
                        href={"/dashboard"}
                        className="text-lg hover:scale-105 bg-gradient-to-b text-center from-blue-500 via-yellow-300 to-green-500 bg-clip-text text-transparent font-bold py-2 px-4 rounded w-full shadow-xl/30 hover:inset-shadow-md cursor-pointer ease-in-out duration-300 transition-all"
                      >
                        Meu Painel
                      </Link>
                      <button
                        className="text-lg hover:scale-105 bg-gradient-to-b text-center from-blue-500 via-red-500 to-orange-500 bg-clip-text text-transparent font-bold py-2 px-4 rounded w-full shadow-xl/30 hover:inset-shadow-md cursor-pointer ease-in-out duration-300 transition-all"
                        onClick={manageAuthSignOut}
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-lg bg-gradient-to-b from-blue-500 via-yellow-300 to-green-500 bg-clip-text text-transparent font-bold py-2 px-4 rounded w-full shadow-xl/30 hover:inset-shadow-md cursor-pointer"
                      onClick={manageAuthGoogle}
                    >
                      GOOGLE
                    </button>
                  )}
                </CardContent>
                {/* <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Entrar</TabsTrigger>
                      <TabsTrigger value="register">Cadastrar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4 mt-6">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Senha</Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={loading}
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          Entrar
                        </Button>
                        
                      </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4 mt-6">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email</Label>
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Senha</Label>
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={loading}
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                          ) : (
                            <Users className="w-4 h-4 mr-2" />
                          )}
                          Criar Conta
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent> */}
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { number: "10K+", label: "Usuários Ativos" },
              { number: "50K+", label: "Cards Criados" },
              { number: "100K+", label: "Sessões de Estudo" },
              { number: "95%", label: "Satisfação" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
