import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { neon } from "@neondatabase/serverless"

async function run() {
  const url = process.env.NEON_NEON_DATABASE_URL
  if (!url) {
    console.error("NEON_DATABASE_URL não definido")
    process.exit(1)
  }
  const client = neon(url)

  const dir = join(process.cwd(), "scripts", "sql")
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort()

  for (const file of files) {
    const sql = readFileSync(join(dir, file), "utf8")
    console.log(`Executando ${file}...`)
    await client(sql as any)
  }

  console.log("Migrações concluídas!")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
