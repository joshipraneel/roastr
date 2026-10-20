import { useRef } from "react"
import type { Picks } from "@/lib/pick-roasts"
import { gsap, ScrollTrigger, useGSAP, useReducedMotion } from "@/lib/motion"

const names = { en: "English", hi: "हिंदी", mr: "मराठी", kn: "ಕನ್ನಡ" } as const

// A loud red band. With motion, this visit's four roasts take turns in one
// spot while the band is on screen; without it they sit stacked.
export function Languages({ langs }: { langs: Picks["langs"] }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const lines = (Object.keys(names) as (keyof typeof names)[]).map((l) => langs[l]).filter((r) => r.text)

  useGSAP(
    () => {
      if (reduced || lines.length < 2) return
      const items = gsap.utils.toArray<HTMLElement>("[data-line]")
      gsap.set(items, { gridArea: "1 / 1", autoAlpha: 0, yPercent: 30 })
      const tl = gsap.timeline({ repeat: -1, paused: true })
      for (const el of items) {
        tl.to(el, { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: "power3.out" })
          .to(el, { autoAlpha: 0, yPercent: -30, duration: 0.4, ease: "power2.in" }, "+=2.4")
      }
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      })
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} className="bg-primary px-4 py-24 text-primary-foreground">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-black tracking-[0.3em] uppercase opacity-80">Roasted in your language</p>
        <div className="mt-10 grid gap-12">
          {lines.map((r) => (
            <figure key={r.lang} data-line>
              <figcaption lang={r.lang} className="text-sm font-bold uppercase opacity-80">{names[r.lang]}</figcaption>
              <blockquote lang={r.lang} className="mt-3 text-[clamp(1.9rem,5.5vw,4rem)] leading-[1.1] font-black tracking-tight">
                “{r.text}”
              </blockquote>
              {r.lang !== "en" && <p className="mt-4 text-lg opacity-85">{r.meaning}</p>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
