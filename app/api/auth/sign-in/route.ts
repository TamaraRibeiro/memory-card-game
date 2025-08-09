import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email: string | undefined = body?.email
  if (!email) return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })

  const users = await sql<{ id: string; email: string }>`
    insert into users (email) values (${email})
    on conflict (email) do update set email = excluded.email
    returning id, email
  `
  const user = users[0]
  const cookieStore = await cookies()
  cookieStore.set("mc_user_id", user.id, { httpOnly: true, sameSite: "lax", path: "/" })
  cookieStore.set("mc_user_email", user.email, { httpOnly: false, sameSite: "lax", path: "/" })

  // Ensure user_stats row
  await sql`
    insert into user_stats (user_id) values (${user.id})
    on conflict (user_id) do nothing
  `

  return NextResponse.json(user)
}
