import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => null)
  const { name, description } = body || {}
  if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
  const rows = await sql`
    update subjects
    set name = ${name}, description = ${description ?? null}, updated_at = now()
    where id = ${params.id} and user_id = ${user.id}
    returning id, name, description, user_id, created_at, updated_at
  `
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await sql`delete from subjects where id = ${params.id} and user_id = ${user.id}`
  return NextResponse.json({ ok: true })
}
