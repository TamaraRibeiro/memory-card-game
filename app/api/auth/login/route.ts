import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as { email: string; password?: string }
    if (!email) return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })

    const sql = getDB()

    // Upsert user by email
    const users = await sql /* sql */`
      insert into users (email, password)
      values (${email}, ${password ?? null})
      on conflict (email) do update set email = excluded.email
      returning id, email, created_at
    `
    const user = users[0]

    // Ensure user_stats row
    await sql /* sql */`
      insert into user_stats (user_id)
      values (${user.id})
      on conflict (user_id) do nothing
    `

    return NextResponse.json({ user })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao autenticar" }, { status: 500 })
  }
}
