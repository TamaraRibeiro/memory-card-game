import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId, totalCards, subjectId } = (await req.json()) as {
      userId: string
      totalCards: number
      subjectId?: string | null
    }
    if (!userId || !totalCards) return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 })
    const sql = getDB()

    const rows = await sql /* sql */`
      select id, title, content, difficulty, subject_id
      from cards
      where user_id = ${userId}
        ${subjectId ? sql`and subject_id = ${subjectId}` : sql``}
      order by random()
      limit ${totalCards}
    `
    return NextResponse.json({ cards: rows })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao iniciar jogo" }, { status: 500 })
  }
}
