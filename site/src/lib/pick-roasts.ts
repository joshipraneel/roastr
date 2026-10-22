export type Lang = "en" | "hi" | "mr" | "kn"
export type Roast = { lang: Lang; text: string; meaning?: string; ctx: string }
export type Picks = {
  bubbles: string[]
  marquee: string[]
  night: string
  morning: string
  closing: string
  langs: Roast[]
}

// Picks this visit's roasts. No line appears twice on the page; when a context
// runs dry it falls back to any unused line of the same language, and the
// bubbles and marquee shrink instead of throwing. `langs` is every remaining
// line, shuffled and taken round-robin en, hi, mr, kn so the band never repeats.
export function pickRoasts(pool: Roast[], rand: () => number = Math.random): Picks {
  const used = new Set<string>()

  const take = (lang: Lang, ctxs?: string[]): Roast | undefined => {
    const fresh = pool.filter((r) => r.lang === lang && !used.has(r.text))
    const preferred = ctxs ? fresh.filter((r) => ctxs.includes(r.ctx)) : fresh
    const from = preferred.length ? preferred : fresh
    const r = from[Math.floor(rand() * from.length)]
    if (r) used.add(r.text)
    return r
  }
  const many = (n: number, ctxs: string[]) =>
    Array.from({ length: n }, () => take("en", ctxs)?.text).filter((t): t is string => !!t)

  const night = take("en", ["doom"])?.text ?? ""
  const morning = take("en", ["wake"])?.text ?? ""
  const closing = take("en", ["doom", "streak"])?.text ?? ""
  const bubbles = many(2, ["doom", "busted"])
  const marquee = many(8, ["doom", "busted"])
  const langs: Roast[] = []
  for (let added = true; added; ) {
    added = false
    for (const l of ["en", "hi", "mr", "kn"] as const) {
      const r = take(l)
      if (r) {
        langs.push(r)
        added = true
      }
    }
  }
  return { night, morning, closing, bubbles, marquee, langs }
}
