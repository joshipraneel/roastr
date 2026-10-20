import { useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger, useGSAP, useReducedMotion } from "@/lib/motion"

const shot = (file: string, alt: string) => (
  <img
    src={`${import.meta.env.BASE_URL}screens/${file}`}
    alt={alt}
    loading="lazy"
    className="mx-auto mt-6 h-64 w-48 rounded-t-[1.6rem] border border-b-0 object-cover object-top shadow-[0_-10px_40px_-10px_var(--glow)]"
  />
)

function Tile({ title, children, extra, className = "" }: { title: string; children: ReactNode; extra?: ReactNode; className?: string }) {
  return (
    <div data-tile className={`flex flex-col overflow-hidden rounded-3xl border bg-card p-6 pb-0 ${className}`}>
      <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
      <p className="mt-2 pb-6 text-muted-foreground">{children}</p>
      {extra && <div className="mt-auto">{extra}</div>}
    </div>
  )
}

export function Features() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      gsap.set("[data-tile]", { autoAlpha: 0, y: 48 })
      ScrollTrigger.batch("[data-tile]", {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 }),
      })
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} id="features" className="mx-auto max-w-6xl px-4 py-24">
      <h2 className="text-[clamp(2.2rem,6vw,4rem)] leading-none font-black tracking-tight">Everything it does</h2>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">Two jobs: get you off your phone at night, and out of bed in the morning.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Tile title="Doomscroll police" className="md:col-span-2" extra={shot("2-home.png", "Home: today's score, streak and limit")}>
          Set a daily limit for YouTube and Instagram. Pass it and you get roasted, again every five minutes you stay.
        </Tile>
        <Tile
          title="Reel counter"
          extra={
            <div className="flex justify-center gap-2 pb-8 text-sm font-black text-[#1d0505]" aria-hidden="true">
              <span className="rounded-full bg-ok px-3 py-1">12</span>
              <span className="rounded-full bg-warn px-3 py-1">31</span>
              <span className="rounded-full bg-hot px-3 py-1">47 Limit</span>
            </div>
          }
        >
          Optional: count every Short and Reel you swipe, with a pill in the corner that goes green, yellow, red. At the limit you're sent home.
        </Tile>
        <Tile title="Wake-up roast" extra={shot("4-wake.png", "Wake-up roast alarm with missions")}>
          An alarm that yells you out of bed. Make it stop with three maths sums or 30 real steps.
        </Tile>
        <Tile
          title="Score and streak"
          extra={
            <p className="pb-8 text-center text-7xl font-black tracking-tight text-primary tabular-nums">
              87<span className="text-2xl text-muted-foreground">/100</span>
            </p>
          }
        >
          A daily score out of 100. Score 80+ and the roasts go easy on you. Don't and you'll hear about it.
        </Tile>
        <Tile title="Shame card and your week" extra={shot("3-shame.png", "Shame card with today's numbers and a roast")}>
          Your numbers plus a fresh roast, ready to share. Plus a weekly summary with the title you earned.
        </Tile>
        <Tile title="Four languages" className="md:col-span-3" extra={shot("6-languages.png", "Pick who roasts you: English, Hindi, Marathi or Kannada")}>
          English, हिंदी, मराठी and ಕನ್ನಡ, with nearly 1,000 voiced lines. Three spice levels, from grandma-safe to savage. All jokes, no slurs. Or record your own.
        </Tile>
      </div>
    </section>
  )
}
