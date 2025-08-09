import { cookies } from "next/headers"
import { sql } from "./db"

export type DbUser = {
  id: string
  email: string
  created_at: string
}

export async function getCurrentUser(): Promise<DbUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get("mc_user_id")?.value
  if (!userId) return null
  const rows = await sql<DbUser>`select id, email, created_at from users where id = ${userId} limit 1`
  return rows.length ? rows[0] : null
}
