import { useRef, useState } from "react"
import type { Roast } from "@/lib/pick-roasts"
import { gsap, ScrollTrigger, useGSAP, useReducedMotion } from "@/lib/motion"

const names = { en: "English", hi: "हिंदी", mr: "मराठी", kn: "ಕನ್ನಡ" } as const

// A loud red band. With motion, a fresh roast takes the spot every few seconds
// while the band is on screen, working through the whole pool; without it the
// first four sit stacked.
export function Languages({ langs }: { langs: Roast[] }) {
  const root = useRef<HTMLElement>(null)
  const visible = useRef(false)
  const tl = useRef<gsap.core.Timeline>(null)
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  const lines = reduced || langs.length < 2 ? langs.slice(0, 4) : [langs[i % langs.length]]

  useGSAP(
    () => {
      if (reduced || langs.length < 2) return
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible.current = self.isActive
          if (self.isActive) tl.current?.play()
          else tl.current?.pause()
        },
      })
    },
    { scope: root, dependencies: [reduced] }
  )

  useGSAP(
    () => {
      if (reduced || langs.length < 2) return
      const el = root.current?.querySelector("[data-line]")
      if (!el) return
      gsap.set(el, { autoAlpha: 0, yPercent: 30 })
      tl.current = gsap
        .timeline({ paused: !visible.current, onComplete: () => setI((n) => n + 1) })
        .to(el, { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: "power3.out" })
        .to(el, { autoAlpha: 0, yPercent: -30, duration: 0.4, ease: "power2.in" }, "+=2.4")
    },
    { scope: root, dependencies: [i, reduced] }
  )

  return (
    <section ref={root} className="bg-primary px-4 py-24 text-primary-foreground">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-black tracking-[0.3em] uppercase opacity-80">Roasted in your language</p>
        <div className={`mt-10 grid gap-12 ${lines.length === 1 ? "min-h-72 content-center" : ""}`}>
          {lines.map((r) => (
            <figure key={r.text} data-line>
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
