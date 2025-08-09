import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const subjectId = searchParams.get("subjectId")

  if (subjectId) {
    const rows = await sql`
      select c.id, c.title, c.content, c.difficulty, c.subject_id, c.user_id, c.created_at, c.updated_at,
             s.name as subject_name
      from cards c
      join subjects s on s.id = c.subject_id
      where c.user_id = ${user.id} and c.subject_id = ${subjectId}
      order by c.created_at desc
    `
    return NextResponse.json(rows)
  } else {
    const rows = await sql`
      select c.id, c.title, c.content, c.difficulty, c.subject_id, c.user_id, c.created_at, c.updated_at,
             s.name as subject_name
      from cards c
      join subjects s on s.id = c.subject_id
      where c.user_id = ${user.id}
      order by c.created_at desc
    `
    return NextResponse.json(rows)
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => null)
  const { title, content, difficulty, subject_id } = body || {}
  if (!title || !content || !subject_id) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
  }
  const diff = Number.parseInt(String(difficulty ?? 1))
  const rows = await sql`
    insert into cards (title, content, difficulty, subject_id, user_id)
    values (${title}, ${content}, ${diff}, ${subject_id}, ${user.id})
    returning id, title, content, difficulty, subject_id, user_id, created_at, updated_at
  `
  return NextResponse.json(rows[0], { status: 201 })
}
