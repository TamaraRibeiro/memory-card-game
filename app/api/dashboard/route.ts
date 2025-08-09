import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    const sql = getDB()

    const [{ count: subjects }] =
      await sql /* sql */`select count(*)::int as count from subjects where user_id = ${userId}`
    const [{ count: cards }] = await sql /* sql */`select count(*)::int as count from cards where user_id = ${userId}`
    const statsRows = await sql /* sql */`
      select total_games, total_score from user_stats where user_id = ${userId} limit 1
    `
    const { total_games = 0, total_score = 0 } = statsRows[0] ?? {}

    return NextResponse.json({
      totalSubjects: subjects,
      totalCards: cards,
      totalGames: total_games,
      totalScore: total_score,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao carregar resumo" }, { status: 500 })
  }
}
