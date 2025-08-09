import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const rows = await sql`
    select id, name, description, user_id, created_at, updated_at
    from subjects
    where user_id = ${user.id}
    order by created_at desc
  `
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => null)
  const { name, description } = body || {}
  if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
  const rows = await sql`
    insert into subjects (name, description, user_id)
    values (${name}, ${description ?? null}, ${user.id})
    returning id, name, description, user_id, created_at, updated_at
  `
  return NextResponse.json(rows[0], { status: 201 })
}
