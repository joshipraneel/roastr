import { useRef } from "react"
import { gsap, useGSAP, useReducedMotion } from "@/lib/motion"

// Morning: the night fades into sunrise, the alarm phone shakes and the maths
// mission solves itself. The resting markup is the end state (reduced motion).
export function MorningScene({ roast }: { roast: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const mm = gsap.matchMedia()
      mm.add({ phone: "(max-width: 767px)", desk: "(min-width: 768px)" }, (ctx) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: ctx.conditions?.phone ? "+=100%" : "+=150%",
              pin: true,
              scrub: 0.6,
            },
          })
          .from(root.current, { backgroundColor: "#0f0c0c", color: "#f4ecea", ease: "none", duration: 0.4 })
          .from("[data-sun]", { autoAlpha: 0, yPercent: 40, ease: "none", duration: 0.4 }, 0)
          .from("[data-clock]", { autoAlpha: 0, y: 30, duration: 0.15 }, 0.1)
          .to("[data-alarm]", { keyframes: { rotate: [0, -6, 6, -6, 6, -4, 4, 0] }, duration: 0.3 }, 0.3)
          .from("[data-answer]", { autoAlpha: 0, scale: 0.6, duration: 0.1 }, 0.65)
          .from("[data-check]", { autoAlpha: 0, scale: 0, ease: "back.out(3)", duration: 0.1 }, 0.78)
          .from("[data-wake-roast]", { autoAlpha: 0, y: 20, duration: 0.12 }, 0.85)
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} className="relative grid min-h-svh place-items-center overflow-hidden bg-(--morning) px-4 py-16 text-foreground">
      <div data-sun className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%] bg-[radial-gradient(ellipse_at_50%_100%,#ff8a3d55,#ff525222_40%,transparent_70%)]" />
      <div className="relative grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
        <div data-clock className="text-center md:text-right">
          <p className="text-6xl font-black tracking-tight tabular-nums md:text-7xl">07:00</p>
          {roast && <p data-wake-roast className="mt-3 text-lg font-bold text-primary">“{roast}”</p>}
        </div>

        <div data-alarm className="mx-auto w-[min(68vw,250px)] rounded-[2.2rem] border bg-[#0b0909] p-2 shadow-[0_30px_60px_-20px_var(--glow)]">
          <div className="grid aspect-[9/16] place-items-center rounded-[1.8rem] bg-[#1a1414] p-5 text-center text-[#f4ecea]">
            <div>
              <p className="text-xs font-black tracking-[0.3em] text-hot">WAKE-UP MISSION</p>
              <p className="mt-2 text-sm text-[#b3a5a3]">Sum 3 of 3</p>
              <p className="mt-6 text-4xl font-black tabular-nums">17 × 3</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <p data-answer className="rounded-xl border border-[#2e2423] bg-black/40 px-5 py-2 text-3xl font-black tabular-nums">51</p>
                <span data-check className="grid size-10 place-items-center rounded-full bg-ok text-xl font-black text-[#0b0909]" aria-label="correct">✓</span>
              </div>
              <p className="mt-6 text-xs text-[#b3a5a3]">Alarm off. Good morning, legend.</p>
            </div>
          </div>
        </div>

        <p className="text-center text-lg text-muted-foreground md:text-left">
          The Wake-up roast yells you out of bed. Make it stop with
          <b className="text-foreground"> three maths sums or 30 real steps.</b>
          <span className="block font-bold text-foreground">Snoozing is not a mission.</span>
        </p>
      </div>
    </section>
  )
}
