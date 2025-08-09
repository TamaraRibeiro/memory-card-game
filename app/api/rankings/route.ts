import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function GET() {
  try {
    const sql = getDB()
    const rows = await sql /* sql */`
      select
        us.id,
        us.user_id,
        us.total_games,
        us.total_correct,
        us.total_wrong,
        us.best_streak,
        us.total_score,
        us.updated_at,
        u.email
      from user_stats us
      join users u on u.id = us.user_id
      order by us.total_score desc
      limit 100
    `
    return NextResponse.json({ rankings: rows })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao carregar ranking" }, { status: 500 })
  }
}
