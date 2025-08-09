import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  const rows = await sql<
    {
      user_id: string
      email: string
      total_games: number
      total_correct: number
      total_wrong: number
      best_streak: number
      total_score: number
      updated_at: string
    }[]
  >`
    select u.id as user_id, u.email, s.total_games, s.total_correct, s.total_wrong, s.best_streak, s.total_score, s.updated_at
    from user_stats s
    join users u on u.id = s.user_id
    order by s.total_score desc, s.total_correct desc
  `
  const processed = rows.map((r, i) => {
    const totalAnswers = (r.total_correct ?? 0) + (r.total_wrong ?? 0)
    const accuracy = totalAnswers > 0 ? (r.total_correct / totalAnswers) * 100 : 0
    const averageScore = (r.total_games ?? 0) > 0 ? (r.total_score ?? 0) / r.total_games : 0
    return { ...r, rank: i + 1, accuracy, averageScore }
  })
  return NextResponse.json(processed)
}
