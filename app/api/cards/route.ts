import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 })
    const sql = getDB()
    const rows = await sql /* sql */`
      select
        c.id, c.title, c.content, c.difficulty, c.subject_id, c.user_id, c.created_at, c.updated_at,
        s.name as subject_name
      from cards c
      join subjects s on s.id = c.subject_id
      where c.user_id = ${userId}
      order by c.created_at desc
    `
    return NextResponse.json({ cards: rows })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao listar cards" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title: string
      content: string
      difficulty: number
      subject_id: string
      user_id: string
    }
    const { title, content, difficulty, subject_id, user_id } = body
    if (!title || !content || !difficulty || !subject_id || !user_id)
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })

    const sql = getDB()
    const rows = await sql /* sql */`
      insert into cards (title, content, difficulty, subject_id, user_id)
      values (${title}, ${content}, ${difficulty}, ${subject_id}, ${user_id})
      returning id, title, content, difficulty, subject_id, user_id, created_at, updated_at
    `
    return NextResponse.json({ card: rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao criar card" }, { status: 500 })
  }
}
