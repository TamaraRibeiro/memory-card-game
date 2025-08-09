import { neon } from "@neondatabase/serverless"

let sqlSingleton: ReturnType<typeof neon> | null = null

export function getDB() {
  if (sqlSingleton) return sqlSingleton
  const conn =
    process.env.NEON_NEON_DATABASE_URL ||
    process.env.NEON_POSTGRES_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_NEON_DATABASE_URL

  if (!conn) {
    throw new Error(
      "Missing Neon connection string. Please set NEON_DATABASE_URL (or NEON_POSTGRES_URL / POSTGRES_URL).",
    )
  }
  sqlSingleton = neon(conn)
  return sqlSingleton
}

export type SQL = ReturnType<typeof getDB>
