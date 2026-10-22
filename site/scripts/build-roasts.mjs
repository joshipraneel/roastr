// Extracts the website's roast pool from the app's wordlists.
// Usage: node scripts/build-roasts.mjs [wordlistDir]
// Default wordlistDir is the app repo next to roastr-public: ../../harasser/wordlists
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { resolve } from "node:path"

const LANGS = ["en", "hi", "mr", "kn"]
const SPICES = new Set(["mild", "spicy"]) // harasser lines stay in the app only
const CAP = 20 // per language and context

// Rows look like: | # | Text | Romanized | Meaning (English) | Spice | Context |
export function parseWordlist(md, lang) {
  const out = []
  for (const line of md.split(/\r?\n/)) {
    if (!/^\| \d+ \|/.test(line)) continue
    const [, , text, , meaning, spice, ctx] = line.split("|").map((c) => c.trim())
    if (!SPICES.has(spice)) continue
    // English rows have no separate meaning; leave it out to keep the bundle small.
    out.push(meaning && meaning !== text ? { lang, text, meaning, ctx } : { lang, text, ctx })
  }
  return out
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const site = resolve(fileURLToPath(import.meta.url), "../..")
  const dir = resolve(site, process.argv[2] ?? "../../harasser/wordlists")
  const pool = []
  for (const lang of LANGS) {
    const counts = {}
    for (const r of parseWordlist(readFileSync(resolve(dir, `roast_${lang}.md`), "utf8"), lang)) {
      counts[r.ctx] = (counts[r.ctx] ?? 0) + 1
      if (counts[r.ctx] <= CAP) pool.push(r)
    }
  }
  writeFileSync(resolve(site, "src/roasts.json"), JSON.stringify(pool, null, 1) + "\n")
  console.log(`wrote ${pool.length} roasts to src/roasts.json`)
}
