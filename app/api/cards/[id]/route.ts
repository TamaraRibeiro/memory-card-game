import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = (await req.json()) as {
      title: string
      content: string
      difficulty: number
      subject_id: string
    }
    const sql = getDB()
    const rows = await sql /* sql */`
      update cards
      set title = ${body.title},
          content = ${body.content},
          difficulty = ${body.difficulty},
          subject_id = ${body.subject_id},
          updated_at = now()
      where id = ${id}
      returning id, title, content, difficulty, subject_id, user_id, created_at, updated_at
    `
    return NextResponse.json({ card: rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao atualizar card" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const sql = getDB()
    await sql /* sql */`delete from cards where id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao excluir card" }, { status: 500 })
  }
}
