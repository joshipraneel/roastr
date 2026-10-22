import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import type { Lang, Roast } from "@/lib/pick-roasts"
import { gsap, ScrollTrigger, useGSAP, useReducedMotion } from "@/lib/motion"
import { shot } from "@/lib/links"

const names: Record<Lang, string> = { en: "English", hi: "हिंदी", mr: "मराठी", kn: "ಕನ್ನಡ" }
const HOLD = 3.4

// One roast at a time, working through the whole pool. It advances on its
// own while on screen, stops on hover, focus or the pause button, and the
// tabs jump to the next line in that language.
export function Languages({ langs }: { langs: Roast[] }) {
  const root = useRef<HTMLElement>(null)
  const tl = useRef<gsap.core.Timeline>(null)
  const visible = useRef(false)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [held, setHeld] = useState(false)
  const reduced = useReducedMotion()
  const r = langs[i % langs.length]
  const running = !reduced && !paused && !held

  // Off-screen also pauses, without touching the button's state.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (s) => {
          visible.current = s.isActive
          if (s.isActive && running) tl.current?.play()
          else tl.current?.pause()
        },
      })
    },
    { scope: root, dependencies: [running] }
  )

  useGSAP(
    () => {
      if (reduced || langs.length < 2) return
      // The entrance always finishes; pausing only ever stops the hold and exit,
      // so a line is never frozen half-clipped.
      gsap
        .timeline()
        .fromTo("[data-line]", { yPercent: 105 }, { yPercent: 0, duration: 0.6, ease: "expo.out" })
        .fromTo("[data-meaning]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.15)
      tl.current = gsap
        .timeline({ paused: !(running && visible.current), onComplete: () => setI((n) => n + 1) })
        .fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: "none" })
        .to("[data-line]", { yPercent: -105, duration: 0.45, ease: "expo.in" })
        .to("[data-meaning]", { autoAlpha: 0, duration: 0.3 }, "<")
    },
    { scope: root, dependencies: [i, reduced] }
  )

  useEffect(() => {
    if (running && visible.current) tl.current?.play()
    else tl.current?.pause()
  }, [running])

  const jump = (l: Lang) => {
    for (let k = 1; k <= langs.length; k++) {
      if (langs[(i + k) % langs.length].lang === l) return setI(i + k)
    }
  }

  if (!r) return null
  return (
    <section
      ref={root}
      id="languages"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      className="relative isolate overflow-hidden bg-shame py-section text-white"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1fr_auto] md:px-8">
        <div>
          <p className="text-eyebrow font-semibold tracking-[0.2em] text-white/75 uppercase">Roasted in your language</p>
          <div className="mt-6 flex flex-wrap items-center gap-1.5">
            {(Object.keys(names) as Lang[]).map((l) => (
              <button
                key={l}
                lang={l}
                aria-pressed={r.lang === l}
                onClick={() => jump(l)}
                className="relative h-11 overflow-hidden rounded-full px-4 text-sm font-semibold text-white/70 transition-colors hover:text-white aria-pressed:bg-white/12 aria-pressed:text-white"
              >
                {names[l]}
                {r.lang === l && !reduced && (
                  <span data-progress aria-hidden="true" className="absolute inset-x-4 bottom-1.5 h-0.5 origin-left rounded-full bg-roast" />
                )}
              </button>
            ))}
            {!reduced && (
              <button
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play roasts" : "Pause roasts"}
                className="ml-1 grid size-11 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            )}
          </div>
          <figure className="mt-10 min-h-[12rem] md:min-h-[14rem]" aria-live={running ? "off" : "polite"}>
            <blockquote lang={r.lang} className="overflow-hidden pb-[0.12em]">
              <p data-line key={i} className="font-display text-[clamp(2rem,1.2rem+3.2vw,4rem)] leading-[1.05] text-balance text-roast">
                “{r.text}”
              </p>
            </blockquote>
            {r.meaning && (
              <figcaption data-meaning className="mt-5 max-w-[50ch] text-lede text-white/80">
                {r.meaning}
              </figcaption>
            )}
          </figure>
        </div>
        <div className="device mx-auto hidden w-60 rotate-3 md:block">
          <img src={shot("6-languages.webp")} alt="Pick who roasts you: English, Hindi, Marathi or Kannada" width="540" height="1200" loading="lazy" className="aspect-[9/20] w-full object-cover" />
        </div>
      </div>
    </section>
  )
}
