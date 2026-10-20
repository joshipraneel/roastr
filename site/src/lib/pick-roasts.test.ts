import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { pickRoasts, type Picks, type Roast } from "./pick-roasts.ts"

function seeded(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) % 2 ** 31
    return seed / 2 ** 31
  }
}

function allTexts(p: Picks) {
  return [
    ...p.bubbles,
    ...p.marquee,
    p.night,
    p.morning,
    p.closing,
    p.langs.hi.text,
    p.langs.mr.text,
    p.langs.kn.text,
  ]
}

test("pickRoasts fills every slot from the real pool without repeats", () => {
  const pool: Roast[] = JSON.parse(
    readFileSync(new URL("../roasts.json", import.meta.url), "utf8")
  )
  for (let seed = 1; seed <= 20; seed++) {
    const p = pickRoasts(pool, seeded(seed))
    assert.equal(p.bubbles.length, 2)
    assert.equal(p.marquee.length, 8)
    assert.equal(p.langs.hi.lang, "hi")
    assert.equal(p.langs.mr.lang, "mr")
    assert.equal(p.langs.kn.lang, "kn")
    const texts = allTexts(p)
    assert.equal(new Set(texts).size, texts.length)
    assert.ok(texts.every((t) => t.length > 0))
  }
})

test("pickRoasts never repeats and never throws on a tiny pool", () => {
  const en = (text: string, ctx: string): Roast => ({ lang: "en", text, meaning: text, ctx })
  const pool: Roast[] = [
    en("a", "doom"),
    en("b", "busted"),
    en("c", "wake"),
    en("d", "streak"),
    { lang: "hi", text: "h", meaning: "H", ctx: "wake" },
    { lang: "mr", text: "m", meaning: "M", ctx: "wake" },
    { lang: "kn", text: "k", meaning: "K", ctx: "wake" },
  ]
  const p = pickRoasts(pool, seeded(7))
  const texts = allTexts(p)
  assert.equal(new Set(texts).size, texts.length)
  assert.equal(p.langs.kn.text, "k")
})
