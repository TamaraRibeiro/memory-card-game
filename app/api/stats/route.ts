import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const rows = await sql<{
    user_id: string
    total_games: number
    total_correct: number
    total_wrong: number
    best_streak: number
    total_score: number
    updated_at: string
  }>`select * from user_stats where user_id = ${user.id} limit 1`
  if (!rows.length) {
    return NextResponse.json({
      user_id: user.id,
      total_games: 0,
      total_correct: 0,
      total_wrong: 0,
      best_streak: 0,
      total_score: 0,
      updated_at: new Date().toISOString(),
      email: user.email,
    })
  }
  return NextResponse.json({ ...rows[0], email: user.email })
}
