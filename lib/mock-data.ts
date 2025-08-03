export interface Subject {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface CardItem {
  id: string
  title: string
  content: string
  difficulty: number
  subject_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface GameSession {
  id: string
  user_id: string
  subject_id: string | null
  total_cards: number
  time_per_card: number | null
  score: number
  correct_answers: number
  wrong_answers: number
  completed: boolean
  started_at: string
  completed_at: string | null
}

export interface UserStats {
  id: string
  user_id: string
  total_games: number
  total_correct: number
  total_wrong: number
  best_streak: number
  total_score: number
  updated_at: string
  email?: string
}

// Mock user
export const mockUser = {
  id: "user-1",
  email: "usuario@exemplo.com",
}

// Mock subjects
export const mockSubjects: Subject[] = [
  {
    id: "subject-1",
    name: "Matemática",
    description: "Conceitos fundamentais de matemática",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "subject-2",
    name: "História",
    description: "Eventos históricos importantes",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "subject-3",
    name: "Programação",
    description: "Conceitos de desenvolvimento de software",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Mock cards
export const mockCards: CardItem[] = [
  {
    id: "card-1",
    title: "Teorema de Pitágoras",
    content:
      "Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos. A fórmula é a² + b² = c², onde c é a hipotenusa e a e b são os catetos.",
    difficulty: 2,
    subject_id: "subject-1",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "card-2",
    title: "Revolução Francesa",
    content:
      "A Revolução Francesa foi um período de mudança política e social radical na França que durou de 1789 a 1799. Começou com a convocação dos Estados Gerais e terminou com o golpe de Napoleão Bonaparte.",
    difficulty: 3,
    subject_id: "subject-2",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "card-3",
    title: "Função JavaScript",
    content:
      "Uma função em JavaScript é um bloco de código projetado para executar uma tarefa específica. É definida com a palavra-chave function, seguida por um nome, parênteses () e chaves {}.",
    difficulty: 1,
    subject_id: "subject-3",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "card-4",
    title: "Equação do Segundo Grau",
    content:
      "Uma equação do segundo grau tem a forma ax² + bx + c = 0, onde a ≠ 0. Suas raízes podem ser encontradas usando a fórmula de Bhaskara: x = (-b ± √(b²-4ac)) / 2a.",
    difficulty: 4,
    subject_id: "subject-1",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "card-5",
    title: "Segunda Guerra Mundial",
    content:
      "A Segunda Guerra Mundial foi um conflito militar global que durou de 1939 a 1945. Envolveu a maioria das nações do mundo e foi marcada pelo Holocausto e pelo uso de armas nucleares.",
    difficulty: 3,
    subject_id: "subject-2",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "card-6",
    title: "React Hooks",
    content:
      "Hooks são funções que permitem usar estado e outras funcionalidades do React em componentes funcionais. Os hooks mais comuns são useState para gerenciar estado e useEffect para efeitos colaterais.",
    difficulty: 3,
    subject_id: "subject-3",
    user_id: "user-1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Mock user stats
export const mockUserStats: UserStats = {
  id: "stats-1",
  user_id: "user-1",
  total_games: 15,
  total_correct: 42,
  total_wrong: 18,
  best_streak: 8,
  total_score: 1250,
  updated_at: "2024-01-01T00:00:00Z",
  email: "usuario@exemplo.com",
}

// Mock global rankings
export const mockGlobalRankings: UserStats[] = [
  {
    id: "stats-1",
    user_id: "user-1",
    total_games: 15,
    total_correct: 42,
    total_wrong: 18,
    best_streak: 8,
    total_score: 1250,
    updated_at: "2024-01-01T00:00:00Z",
    email: "usuario@exemplo.com",
  },
  {
    id: "stats-2",
    user_id: "user-2",
    total_games: 22,
    total_correct: 58,
    total_wrong: 12,
    best_streak: 12,
    total_score: 1580,
    updated_at: "2024-01-01T00:00:00Z",
    email: "jogador2@exemplo.com",
  },
  {
    id: "stats-3",
    user_id: "user-3",
    total_games: 8,
    total_correct: 28,
    total_wrong: 7,
    best_streak: 6,
    total_score: 890,
    updated_at: "2024-01-01T00:00:00Z",
    email: "jogador3@exemplo.com",
  },
  {
    id: "stats-4",
    user_id: "user-4",
    total_games: 31,
    total_correct: 85,
    total_wrong: 25,
    best_streak: 15,
    total_score: 2100,
    updated_at: "2024-01-01T00:00:00Z",
    email: "jogador4@exemplo.com",
  },
  {
    id: "stats-5",
    user_id: "user-5",
    total_games: 12,
    total_correct: 35,
    total_wrong: 15,
    best_streak: 7,
    total_score: 980,
    updated_at: "2024-01-01T00:00:00Z",
    email: "jogador5@exemplo.com",
  },
]

// Local storage helpers
export const getStorageData = (key: string, defaultValue: any) => {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

export const setStorageData = (key: string, value: any) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Initialize data in localStorage
export const initializeData = () => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("memory-cards-subjects")) {
    setStorageData("memory-cards-subjects", mockSubjects)
  }
  if (!localStorage.getItem("memory-cards-cards")) {
    setStorageData("memory-cards-cards", mockCards)
  }
  if (!localStorage.getItem("memory-cards-user-stats")) {
    setStorageData("memory-cards-user-stats", mockUserStats)
  }
  if (!localStorage.getItem("memory-cards-user")) {
    setStorageData("memory-cards-user", mockUser)
  }
}
