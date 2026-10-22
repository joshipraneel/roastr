import { useRef, type ReactNode } from "react"
import { Bookmark, Heart, MessageCircle, Music2, Send, Volume2 } from "lucide-react"
import { PhoneStatus } from "@/components/PhoneStatus"
import { gsap, stepScene, useGSAP, useReducedMotion } from "@/lib/motion"

const LIMIT = 5
// The real app's reel pill, "🔥 n / 5", goes mustard to orange to red.
const pillColors = ["#c9b236", "#d1b130", "#f0a030", "#e66a35", "#e0482f"]
// Real 2 a.m. reels are mostly text posts: POV memes, recipe title cards,
// study timers, list reels. These use the actual Reels text styles instead
// of pretending to be someone's footage.
const box = "box-decoration-clone rounded-md bg-white px-[0.35em] py-[0.08em] leading-[1.45] text-black"
const outline = "[-webkit-text-stroke:0.6px_#000] [paint-order:stroke_fill] [text-shadow:0_2px_8px_rgb(0_0_0/0.5)]"
const reels: { user: string; caption: string; likes: string; bg: string; body: ReactNode }[] = [
  {
    user: "desi.memes.daily",
    caption: "tag someone who does this",
    likes: "402K",
    bg: "radial-gradient(60% 35% at 50% 62%, #2b3d66, transparent 70%), #07090e",
    body: (
      <div className="absolute inset-x-0 top-[17%] bg-white px-4 py-3 text-[6.4cqw] leading-snug font-semibold text-black">
        POV: it's 2 a.m. and you said “one more”
      </div>
    ),
  },
  {
    user: "chef.ankit",
    caption: "save this for later (you won't)",
    likes: "214K",
    bg: "linear-gradient(160deg, #8a4a24, #3a1a0b 70%)",
    body: (
      <div className="absolute inset-x-5 top-[34%] text-center text-[7.5cqw] font-bold">
        <span className={box}>3-ingredient pasta</span>
        <br />
        <span className={`${box} text-[5.2cqw] font-semibold`}>you will never make</span>
      </div>
    ),
  },
  {
    user: "study.with.ria",
    caption: "4 hour study with me, no music",
    likes: "57K",
    bg: "#ece6da",
    body: (
      <div className="absolute inset-x-0 top-[32%] text-center text-[#2a2420]">
        <p className="text-[4.6cqw] tracking-[0.2em] uppercase">study with me</p>
        <p className="mt-2 font-mono text-[13cqw] leading-none font-medium tabular-nums">03:59:12</p>
        <p className="mt-3 text-[4cqw] text-[#2a2420]/60">pomodoro 1 of 8</p>
      </div>
    ),
  },
  {
    user: "gym.rahul",
    caption: "it's not protein",
    likes: "88K",
    bg: "linear-gradient(170deg, #2e2140, #0f0b15 75%)",
    body: (
      <div className={`absolute inset-x-5 top-[28%] text-[6.8cqw] leading-tight font-extrabold text-white ${outline}`}>
        why you're not growing:
        <ol className="mt-3 space-y-1.5 text-[5.6cqw] font-bold">
          <li>1. sleep</li>
          <li>2. sleep</li>
          <li>3. you're watching this at 2 a.m.</li>
        </ol>
      </div>
    ),
  },
  {
    user: "catsofmumbai",
    caption: "he knew exactly what he was doing",
    likes: "1.2M",
    bg: "linear-gradient(180deg, #1c2a2a, #0b1212)",
    body: (
      <div className="absolute inset-x-0 top-[56%] text-white">
        <p className="inline-block bg-[#d42b2b] px-3 py-1 text-[4.2cqw] font-extrabold tracking-wider">BREAKING</p>
        <p className="bg-black/80 px-3 py-2 text-[5cqw] font-semibold">Local cat knocks glass off table, part 4</p>
      </div>
    ),
  },
  {
    user: "carvlogs",
    caption: "nobody asked",
    likes: "33K",
    bg: "#16181d",
    body: <p className={`absolute inset-x-5 top-[40%] text-center text-[7cqw] font-extrabold text-white ${outline}`}>here's the drift, nobody asked</p>,
  },
]

// 2 a.m. You swipe through reels in real snaps, the pill counts to the limit,
// then Roastr closes the app and a roast lands as a heads-up notification.
// The resting markup is the end state, for reduced motion and no-JS.
export function NightScene({ roast }: { roast: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      const clock = q("[data-clock]")[0]
      const pills = q("[data-pill]")
      const t = { m: 14 }
      const mm = gsap.matchMedia()
      mm.add({ any: "all", short: "(max-height: 640px)" }, (ctx) => {
        const { short } = ctx.conditions!
        gsap.set(q("[data-app]"), { autoAlpha: 1, scale: 1, y: 0 })
        gsap.set(q("[data-home]"), { autoAlpha: 0, scale: 1.06 })
        gsap.set(q("[data-notif]"), { autoAlpha: 0, yPercent: -140 })
        gsap.set(q("[data-quote], [data-payoff]"), { autoAlpha: 0, y: 24 })
        gsap.set(pills, { autoAlpha: 0 })
        gsap.set(pills[0], { autoAlpha: 1 })
        gsap.set(q("[data-bar]"), { scaleX: 1 / LIMIT, backgroundColor: pillColors[0] })

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          // Short screens can't fit a pinned scene; play it once instead.
          paused: !short,
          scrollTrigger: short ? { trigger: root.current, start: "top 60%", toggleActions: "play none none none" } : undefined,
        })
        tl.to(t, { m: 31, duration: 0.86, onUpdate: () => (clock.textContent = `02:${Math.round(t.m)}`) }, 0)
        // Each reel plays (its bar fills), then one quick swipe, like a thumb.
        // Labels mark every beat; stepScene plays one per scroll.
        const swipe = (i: number) => 0.12 + (i - 1) * 0.15
        tl.addLabel("reel0", 0.02)
        for (let i = 0; i < LIMIT; i++) {
          const start = i ? swipe(i) + 0.07 : 0
          const end = i < LIMIT - 1 ? swipe(i + 1) : 0.7
          tl.fromTo(q(`[data-reel="${i}"] [data-play]`), { scaleX: 0 }, { scaleX: 1, duration: end - start }, start)
          if (!i) continue
          tl.to(q("[data-reels]"), { yPercent: (-100 / reels.length) * i, duration: 0.07, ease: "power3.inOut" }, swipe(i))
            .set(pills[i - 1], { autoAlpha: 0 }, swipe(i) + 0.06)
            .set(pills[i], { autoAlpha: 1 }, swipe(i) + 0.06)
            .to(q("[data-bar]"), { scaleX: (i + 1) / LIMIT, backgroundColor: pillColors[i], duration: 0.04 }, swipe(i) + 0.06)
            .addLabel(`reel${i}`, swipe(i) + 0.1)
        }
        // Limit hit: the app shrinks away like Android closing it, home shows,
        // and the roast drops in from the top.
        tl.to(q("[data-app]"), { scale: 0.82, y: "6%", autoAlpha: 0, duration: 0.08, ease: "power2.in" }, 0.7)
          .to(q("[data-home]"), { autoAlpha: 1, scale: 1, duration: 0.08, ease: "power2.out" }, 0.74)
          .to(q("[data-notif]"), { autoAlpha: 1, yPercent: 0, duration: 0.06, ease: "power3.out" }, 0.8)
          .addLabel("busted", 0.87)
          .to(q("[data-quote]"), { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.86)
          .to(q("[data-payoff]"), { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.9)
          .addLabel("end", 0.98)
          .to({}, { duration: 0.02 })
        if (short) tl.timeScale(0.3)
        else return stepScene(root.current!, tl, { skip: q("[data-skip]")[0] })
      })
      return () => {
        mm.revert()
        clock.textContent = "02:31"
      }
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 py-10 lg:px-8">
        <button data-skip hidden className="absolute top-20 right-5 z-10 max-md:top-auto max-md:bottom-24 h-11 rounded-full border border-border-strong bg-surface-1/80 px-4 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground lg:right-8">
          Skip scene ↓
        </button>
      <div className="glow-spot pointer-events-none absolute inset-0 -z-10 m-auto size-[720px] opacity-60" />
      <p
        data-clock
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 text-center font-display text-[30vw] leading-none text-foreground/[0.045] tabular-nums lg:text-[22vw]"
      >
        02:31
      </p>

      <div className="grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
        <div className="text-center lg:text-left">
          <p className="eyebrow">2:14 a.m.</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[0.95]">“Just one more reel.”</h2>
          <p className="mt-4 max-w-[32ch] text-muted-foreground max-lg:hidden">
            Set a limit in reels or minutes for Instagram Reels and YouTube Shorts. Roastr counts every swipe. Nothing is recorded or sent anywhere.
          </p>
        </div>

        <div className="device mx-auto aspect-[9/19.5] h-[min(56svh,600px)] md:h-[min(72svh,600px)]">
          <div className="@container relative h-full bg-black">
            {/* The reels app, resting closed. */}
            <div data-app className="invisible absolute inset-0 opacity-0">
              <div data-reels className="absolute inset-x-0 top-0" style={{ height: `${reels.length * 100}%` }}>
                {reels.map((r, i) => (
                  <div key={r.user} data-reel={i} className="relative overflow-hidden" style={{ height: `${100 / reels.length}%` }}>
                    <div className="absolute inset-0" style={{ background: r.bg }} />
                    {r.body}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.3),transparent_18%,transparent_70%,rgb(0_0_0/0.6))]" />
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/25">
                      <span data-play className="block h-full origin-left bg-white" />
                    </span>
                    <div className="absolute right-2.5 bottom-16 flex flex-col items-center gap-3.5 text-[9px] font-semibold text-white" aria-hidden="true">
                      <span className="flex flex-col items-center gap-0.5"><Heart className="size-5" />{r.likes}</span>
                      <span className="flex flex-col items-center gap-0.5"><MessageCircle className="size-5" />1,204</span>
                      <Send className="size-5" />
                      <Bookmark className="size-5" />
                    </div>
                    <div className="absolute inset-x-3 bottom-5 pr-10 text-white">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold">
                        <span className="size-5 rounded-full bg-white/25" />
                        {r.user}
                        <span className="ml-1 rounded-md border border-white/50 px-1.5 py-px text-[9px]">Follow</span>
                      </p>
                      <p className="mt-1.5 line-clamp-1 text-[10px] text-white/85">{r.caption}</p>
                      <p className="mt-1 flex items-center gap-1 text-[9px] text-white/70">
                        <Music2 className="size-2.5" /> Original audio
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <PhoneStatus time="2:14" className="absolute inset-x-0 top-0 pt-2" />
              <p className="absolute top-9 left-4 text-sm font-bold text-white">Reels</p>
              <div className="absolute top-9 right-4">
                {pillColors.map((c, i) => (
                  <span
                    key={c}
                    data-pill
                    className={`absolute top-0 right-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-white tabular-nums shadow-md ${i < LIMIT - 1 ? "invisible opacity-0" : ""}`}
                    style={{ backgroundColor: c }}
                  >
                    🔥 {i + 1} / {LIMIT}
                  </span>
                ))}
              </div>
            </div>

            {/* Kicked to the home screen: the resting end state. */}
            <div data-home className="absolute inset-0 bg-[radial-gradient(120%_70%_at_15%_0%,#5a2420,transparent_65%),radial-gradient(110%_70%_at_100%_100%,#22304a,transparent_65%),#101014]">
              <PhoneStatus time="2:31" className="pt-2" />
              <div className="mt-[34%] text-center text-white">
                <p className="text-[2.6rem] leading-none font-light tabular-nums">2:31</p>
                <p className="mt-1 text-[10px] text-white/70">Thu, 23 Oct</p>
              </div>
              <div className="absolute inset-x-5 bottom-5 grid grid-cols-4 gap-3" aria-hidden="true">
                {["#2b3a4f", "#3d2b2b", "#2b3d33", "#3a3423"].map((c) => (
                  <span key={c} className="aspect-square rounded-2xl" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div data-notif className="absolute inset-x-2 top-8 rounded-3xl bg-[#1f2126]/95 p-3 text-white shadow-2xl">
                <p className="flex items-center gap-1.5 text-[9px] text-white/60">
                  <img src="/icon.svg" alt="" className="size-3.5 rounded" /> Roastr · now
                  <Volume2 className="ml-auto size-3 text-white/70" aria-hidden="true" />
                </p>
                <p className="mt-1.5 text-[11px] font-semibold">Busted. That was reel {LIMIT}.</p>
                <p className="mt-0.5 line-clamp-3 text-[10px] leading-snug text-white/80">{roast}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm lg:mx-0">
          <div className="max-lg:hidden">
            <p className="flex justify-between text-sm text-muted-foreground">
              <span>Reels this session</span>
              <span className="text-foreground">Limit {LIMIT}</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div data-bar className="h-full origin-left rounded-full" style={{ backgroundColor: pillColors[LIMIT - 1] }} />
            </div>
          </div>
          {roast && (
            <figure data-quote className="mt-0 rounded-2xl bg-shame p-5 shadow-raised lg:mt-8">
              <figcaption className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                <Volume2 className="size-3.5" /> Roastr, out loud
              </figcaption>
              <blockquote className="mt-2 font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-tight text-roast">“{roast}”</blockquote>
            </figure>
          )}
          <p data-payoff className="mt-5 text-muted-foreground max-lg:hidden">
            Hit your limit and Roastr kicks you to the home screen and roasts you out loud.
            <b className="block font-semibold text-foreground">Then again every five reels you stay.</b>
          </p>
        </div>
      </div>
    </section>
  )
}
