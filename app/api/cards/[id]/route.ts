import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => null)
  const { title, content, difficulty, subject_id } = body || {}
  if (!title || !content || !subject_id) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
  }
  const diff = Number.parseInt(String(difficulty ?? 1))
  const rows = await sql`
    update cards
    set title=${title}, content=${content}, difficulty=${diff}, subject_id=${subject_id}, updated_at = now()
    where id=${params.id} and user_id=${user.id}
    returning id, title, content, difficulty, subject_id, user_id, created_at, updated_at
  `
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await sql`delete from cards where id=${params.id} and user_id=${user.id}`
  return NextResponse.json({ ok: true })
}
