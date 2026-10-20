import { useRef } from "react"
import { gsap, SplitText, useGSAP, useReducedMotion } from "@/lib/motion"

const LIMIT = 47
const reels = [
  ["#3b1f2b", "🍳", "Cooking hack you'll never try"],
  ["#1f2b3b", "🐈", "Cat falls off table (part 4)"],
  ["#2b3b1f", "💃", "Dance trend, again"],
  ["#3b2f1f", "🏋️", "Gym bro explains life"],
  ["#2a1f3b", "🚗", "Car drifts, nobody asked"],
  ["#1f3b38", "😂", "Meme about scrolling at 2 a.m."],
]

// 2 a.m.: the phone pins in the dark, the reel counter climbs to the limit
// and the pill goes green, yellow, red. Then the roast types itself out.
export function NightScene({ roast }: { roast: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const count = { n: 12 }
      const counter = root.current!.querySelector("[data-count]")!
      const label = root.current!.querySelector("[data-pill-label]")!
      counter.textContent = "12"
      label.textContent = "reels"
      const roastEl = root.current!.querySelector("[data-roast]")
      const split = roastEl && SplitText.create(roastEl, { type: "words,chars" })
      const mm = gsap.matchMedia()
      mm.add({ phone: "(max-width: 767px)", desk: "(min-width: 768px)" }, (ctx) => {
        const tl = gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: ctx.conditions?.phone ? "+=100%" : "+=150%",
              pin: true,
              scrub: 0.6,
            },
          })
          .from("[data-clock]", { autoAlpha: 0, y: 30, duration: 0.15 })
          .to("[data-reels]", { yPercent: -66, ease: "none", duration: 0.6 }, 0)
          .to(count, {
            n: LIMIT,
            ease: "none",
            duration: 0.6,
            onUpdate: () => {
              const n = Math.round(count.n)
              counter.textContent = String(n)
              label.textContent = n < LIMIT ? "reels" : "Limit"
            },
          }, 0)
          .to("[data-pill]", { keyframes: { backgroundColor: ["#3ddc84", "#ffd54f", "#ff5252"] }, ease: "none", duration: 0.6 }, 0)
          .from("[data-busted]", { autoAlpha: 0, scale: 1.2, duration: 0.1 }, 0.62)
        if (split) tl.from(split.chars, { autoAlpha: 0, stagger: 0.008, duration: 0.01 }, 0.7)
      })
      return () => {
        mm.revert()
        split?.revert()
        // The counter text was set by hand above; put back the resting end state.
        counter.textContent = String(LIMIT)
        label.textContent = "Limit"
      }
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} className="relative grid min-h-svh place-items-center overflow-hidden bg-night px-4 py-16 text-night-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#ff525233,transparent_55%)]" />
      <div className="relative grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
        <div data-clock className="text-center md:text-right">
          <p className="text-6xl font-black tracking-tight tabular-nums md:text-7xl">02:14</p>
          <p className="mt-2 text-lg text-[#b3a5a3]">“Just one more reel.”</p>
        </div>

        <div className="relative mx-auto h-[min(62svh,520px)] w-[min(68vw,250px)] overflow-hidden rounded-[2.2rem] border border-[#2e2423] bg-[#0b0909] p-2 shadow-[0_0_80px_#ff525240]">
          <div className="relative h-full overflow-hidden rounded-[1.8rem]">
            <div data-reels className="absolute inset-x-0 top-0 h-[300%]">
              {reels.map(([color, emoji, caption]) => (
                <div key={caption} className="relative grid h-1/6 place-items-center border-b border-black/40" style={{ background: `linear-gradient(160deg, ${color}, #0b0909)` }}>
                  <span className="text-5xl" aria-hidden="true">{emoji}</span>
                  <span className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-white/80">{caption}</span>
                </div>
              ))}
            </div>
            <div data-pill className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-hot px-3 py-1 text-xs font-black text-[#1d0505] tabular-nums">
              <span data-count>{LIMIT}</span>
              <span data-pill-label>Limit</span>
            </div>
            <div data-busted className="absolute inset-0 grid place-items-center bg-black/70 p-5 text-center">
              <div>
                <p className="text-xs font-black tracking-[0.3em] text-hot">BUSTED</p>
                {roast && <p data-roast className="mt-3 text-xl leading-snug font-extrabold">“{roast}”</p>}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-lg text-[#b3a5a3] md:text-left">
          Pass your daily limit on YouTube or Instagram and Roastr roasts you, out loud.
          <b className="block text-night-ink">Again every five minutes you stay.</b>
        </p>
      </div>
    </section>
  )
}
