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
        s.id, s.name, s.description, s.user_id, s.created_at, s.updated_at,
        (select count(*)::int from cards c where c.subject_id = s.id) as card_count
      from subjects s
      where s.user_id = ${userId}
      order by s.created_at desc
    `
    return NextResponse.json({ subjects: rows })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao listar assuntos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name: string; description?: string | null; userId: string }
    if (!body?.name || !body?.userId)
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    const sql = getDB()
    const rows = await sql /* sql */`
      insert into subjects (name, description, user_id)
      values (${body.name}, ${body.description ?? null}, ${body.userId})
      returning id, name, description, user_id, created_at, updated_at
    `
    return NextResponse.json({ subject: rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao criar assunto" }, { status: 500 })
  }
}
