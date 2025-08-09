import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [{ count: subjects_count }] = await sql<{ count: string }>`
    select count(*)::text as count from subjects where user_id = ${user.id}
  `
  const [{ count: cards_count }] = await sql<{ count: string }>`
    select count(*)::text as count from cards where user_id = ${user.id}
  `
  const statsRows = await sql<{
    total_games: number
    total_score: number
  }>`select total_games, total_score from user_stats where user_id = ${user.id}`
  const stats = statsRows[0] ?? { total_games: 0, total_score: 0 }

  return NextResponse.json({
    totalSubjects: Number.parseInt(subjects_count, 10),
    totalCards: Number.parseInt(cards_count, 10),
    totalGames: stats.total_games ?? 0,
    bestScore: stats.total_score ?? 0,
    user: { id: user.id, email: user.email },
  })
}
