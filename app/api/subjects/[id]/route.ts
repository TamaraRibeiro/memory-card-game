import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, description } = (await _req.json()) as { name: string; description?: string | null }
    const sql = getDB()
    const rows = await sql /* sql */`
      update subjects
      set name = ${name}, description = ${description ?? null}, updated_at = now()
      where id = ${id}
      returning id, name, description, user_id, created_at, updated_at
    `
    return NextResponse.json({ subject: rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao atualizar assunto" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const sql = getDB()
    await sql /* sql */`delete from subjects where id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao excluir assunto" }, { status: 500 })
  }
}
