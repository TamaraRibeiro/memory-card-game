import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    const sql = getDB()
    const rows = await sql /* sql */`
      select id, user_id, total_games, total_correct, total_wrong, best_streak, total_score, updated_at
      from user_stats
      where user_id = ${userId}
      limit 1
    `
    const stats =
      rows[0] ??
      ({
        id: null,
        user_id: userId,
        total_games: 0,
        total_correct: 0,
        total_wrong: 0,
        best_streak: 0,
        total_score: 0,
        updated_at: new Date().toISOString(),
      } as const)
    return NextResponse.json({ stats })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao buscar estatísticas" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, score, correctAnswers, wrongAnswers } = (await req.json()) as {
      userId: string
      score: number
      correctAnswers: number
      wrongAnswers: number
    }
    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    const sql = getDB()
    const rows = await sql /* sql */`
      insert into user_stats (user_id, total_games, total_correct, total_wrong, total_score, updated_at)
      values (${userId}, 1, ${correctAnswers}, ${wrongAnswers}, ${score}, now())
      on conflict (user_id) do update set
        total_games = user_stats.total_games + 1,
        total_correct = user_stats.total_correct + ${correctAnswers},
        total_wrong = user_stats.total_wrong + ${wrongAnswers},
        total_score = user_stats.total_score + ${score},
        updated_at = now()
      returning id, user_id, total_games, total_correct, total_wrong, best_streak, total_score, updated_at
    `
    return NextResponse.json({ stats: rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao atualizar estatísticas" }, { status: 500 })
  }
}
