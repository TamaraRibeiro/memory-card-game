import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => null)
  const { score, correctAnswers, wrongAnswers, totalCards, subjectId, timePerCard } = body || {}
  if (typeof score !== "number" || typeof correctAnswers !== "number" || typeof wrongAnswers !== "number") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  // Insert session
  await sql`
    insert into game_sessions (user_id, subject_id, total_cards, time_per_card, score, correct_answers, wrong_answers, completed, completed_at)
    values (${user.id}, ${subjectId ?? null}, ${totalCards ?? 0}, ${timePerCard ?? null}, ${score}, ${correctAnswers}, ${wrongAnswers}, true, now())
  `

  // Upsert aggregated stats
  await sql`
    insert into user_stats (user_id, total_games, total_correct, total_wrong, best_streak, total_score, updated_at)
    values (${user.id}, 1, ${correctAnswers}, ${wrongAnswers}, ${correctAnswers}, ${score}, now())
    on conflict (user_id) do update set
      total_games = user_stats.total_games + 1,
      total_correct = user_stats.total_correct + ${correctAnswers},
      total_wrong = user_stats.total_wrong + ${wrongAnswers},
      best_streak = greatest(user_stats.best_streak, ${correctAnswers}),
      total_score = user_stats.total_score + ${score},
      updated_at = now()
  `

  return NextResponse.json({ ok: true })
}
