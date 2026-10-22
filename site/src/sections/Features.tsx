import { useRef, type PointerEvent, type ReactNode } from "react"
import { Mic } from "lucide-react"
import { SectionHeader } from "@/components/SectionHeader"
import { gsap, useGSAP, useReveal } from "@/lib/motion"
import { shot } from "@/lib/links"

const pills = ["#c9b236", "#d1b130", "#f0a030", "#e66a35", "#e0482f"]
const spice = [
  ["Mild", "Grandma-safe"],
  ["Spicy", "Rude, still clean"],
  ["Harasser", "18+, savage"],
]

function Tile({ title, children, art, className = "" }: { title: string; children: ReactNode; art?: ReactNode; className?: string }) {
  return (
    <div
      data-up
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-surface-1 shadow-card transition-shadow hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_0_0_1px_var(--border-strong)] ${className}`}
    >
      {/* Pointer spotlight; --x/--y come from the grid's pointermove. */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 [background:radial-gradient(380px_circle_at_var(--x)_var(--y),rgb(255_82_71/0.08),transparent_45%)]" />
      <div className="relative p-6 md:p-7">
        <h3 className="text-title font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{children}</p>
      </div>
      {art && <div className="relative mt-auto">{art}</div>}
    </div>
  )
}

// A real screenshot in the device frame, cropped to its top and faded out.
const Crop = ({ file, alt, className = "" }: { file: string; alt: string; className?: string }) => (
  <div className={`mx-auto w-56 [mask-image:linear-gradient(#000_55%,transparent)] ${className}`}>
    <div className="device rounded-b-none pb-0">
      <img src={shot(file)} alt={alt} width="540" height="1200" loading="lazy" className="aspect-[9/12] w-full object-cover object-top" />
    </div>
  </div>
)

export function Features() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReveal(root)

  useGSAP(
    () => {
      if (reduced) return
      const loop = gsap.timeline({ repeat: -1, paused: true })
      gsap.utils.toArray<HTMLElement>("[data-feat-pill]").forEach((p, i, all) => {
        loop.set(all, { autoAlpha: 0 }, i * 0.9).set(p, { autoAlpha: 1 }, i * 0.9)
      })
      loop.to({}, { duration: 0.9 })
      gsap.timeline({ scrollTrigger: { trigger: "[data-pill-tile]", start: "top 85%", end: "bottom top", onToggle: (s) => (s.isActive ? loop.play() : loop.pause()) } })
      gsap.from("[data-ring]", { strokeDashoffset: 100, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: "[data-ring]", start: "top 85%", once: true } })
      gsap.from("[data-fan]", { rotate: 0, x: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: "[data-fan]", start: "top 85%", once: true } })
    },
    { scope: root, dependencies: [reduced] }
  )

  const spotlight = (e: PointerEvent<HTMLDivElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>("[data-up]")
    if (!tile) return
    const r = tile.getBoundingClientRect()
    tile.style.setProperty("--x", `${e.clientX - r.left}px`)
    tile.style.setProperty("--y", `${e.clientY - r.top}px`)
  }

  return (
    <section ref={root} id="features" className="mx-auto max-w-6xl px-5 py-section md:px-8">
      <SectionHeader
        eyebrow="What it does"
        title="Night shift. Morning shift."
        lede="Two jobs: get you off your phone at night, and out of bed in the morning."
      />
      <div onPointerMove={spotlight} className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-6">
        <Tile
          title="Doomscroll police"
          className="col-span-2 md:col-span-4 md:row-span-2"
          art={<Crop file="2-home.webp" alt="Home: today's score, streak and limit" className="md:w-72" />}
        >
          Set a daily limit for YouTube and Instagram. Pass it and you get roasted, again every five minutes you stay.
        </Tile>
        <Tile
          title="Reel counter"
          className="md:col-span-2"
          art={
            <div data-pill-tile className="relative mx-6 mb-6 grid h-20 place-items-center rounded-2xl bg-[radial-gradient(70%_80%_at_40%_40%,#5b7b96,#18222c)]" aria-hidden="true">
              {pills.map((c, i) => (
                <span
                  key={c}
                  data-feat-pill
                  className={`absolute rounded-full px-3 py-1 text-sm font-bold text-white tabular-nums shadow-md ${i < pills.length - 1 ? "invisible opacity-0" : ""}`}
                  style={{ backgroundColor: c }}
                >
                  🔥 {i + 1} / 5
                </span>
              ))}
            </div>
          }
        >
          Optional. Counts every Short and Reel you swipe. At the limit you're sent home.
        </Tile>
        <Tile
          title="Score and streak"
          className="md:col-span-2"
          art={
            <div className="mx-6 mb-6 flex items-center gap-4">
              <svg viewBox="0 0 36 36" className="size-20 -rotate-90" aria-hidden="true">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface-3)" strokeWidth="3" />
                <circle data-ring cx="18" cy="18" r="15.9" fill="none" stroke="var(--ok)" strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset="13" />
              </svg>
              <p className="font-display text-display-md tabular-nums">
                87<span className="text-base text-muted-foreground">/100</span>
              </p>
            </div>
          }
        >
          Score 80+ and the roasts go easy on you.
        </Tile>
        <Tile
          title="Wake-up roast"
          className="col-span-2 md:col-span-3"
          art={<Crop file="4-wake.webp" alt="Wake-up roast alarm with missions" />}
        >
          An alarm that yells you out of bed. Make it stop with three maths sums or 30 real steps.
        </Tile>
        <Tile
          title="Shame card and your week"
          className="col-span-2 md:col-span-3"
          art={
            <div className="relative mx-auto h-56 w-64" aria-hidden="true">
              <div data-fan className="absolute inset-x-8 top-6 h-56 rounded-2xl bg-surface-3 shadow-raised" style={{ transform: "translateX(-40px) rotate(-8deg)" }} />
              <div data-fan className="absolute inset-x-8 top-6 h-56 rounded-2xl bg-shame shadow-raised" style={{ transform: "translateX(40px) rotate(8deg)" }} />
              <div className="absolute inset-x-8 top-2 [mask-image:linear-gradient(#000_70%,transparent)]">
                <img src={shot("3-shame.webp")} alt="" width="540" height="1200" loading="lazy" className="aspect-[9/12] w-full rounded-2xl object-cover object-top shadow-raised" />
              </div>
            </div>
          }
        >
          Today's numbers and a fresh roast, ready to share. Plus a Sunday report with the title you earned.
        </Tile>
        <Tile
          title="Three spice levels"
          className="col-span-2 md:col-span-3"
          art={
            <ul className="mx-6 mb-6 grid grid-cols-3 gap-1.5 text-sm">
              {spice.map(([name, note], i) => (
                <li key={name} className="rounded-xl bg-surface-2 p-3">
                  <span className="flex gap-0.5" aria-hidden="true">
                    {[0, 1, 2].map((k) => (
                      <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= i ? "bg-primary" : "bg-surface-3"}`} />
                    ))}
                  </span>
                  <span className="mt-3 block font-semibold">{name}</span>
                  <span className="text-xs text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          }
        >
          All jokes, no slurs, even at 18+.
        </Tile>
        <Tile
          title="Record your own"
          className="col-span-2 md:col-span-3"
          art={
            <div className="mx-6 mb-6 flex items-center gap-4 rounded-2xl bg-surface-2 p-4" aria-hidden="true">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Mic className="size-5" />
              </span>
              <span className="flex h-10 flex-1 items-center gap-[3px]">
                {[3, 6, 9, 5, 8, 10, 4, 7, 9, 6, 3, 5, 8, 6, 4, 7, 10, 8, 5, 3, 6, 9, 7, 4].map((h, i) => (
                  <span key={i} className="flex-1 rounded-full bg-muted-foreground/60" style={{ height: `${h * 10}%` }} />
                ))}
              </span>
            </div>
          }
        >
          Bored of our voices? Record your own roasts.
        </Tile>
      </div>
    </section>
  )
}
