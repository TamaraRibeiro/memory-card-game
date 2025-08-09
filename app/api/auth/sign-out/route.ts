import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set("mc_user_id", "", { path: "/", maxAge: 0 })
  cookieStore.set("mc_user_email", "", { path: "/", maxAge: 0 })
  return NextResponse.json({ ok: true })
}
