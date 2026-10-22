import { useRef } from "react"
import { Bookmark, Heart, MessageCircle, Music2, Send, Volume2 } from "lucide-react"
import { PhoneStatus } from "@/components/PhoneStatus"
import { gsap, useGSAP, useReducedMotion } from "@/lib/motion"

const LIMIT = 5
// The real app's reel pill, "🔥 n / 5", goes mustard to orange to red.
const pillColors = ["#c9b236", "#d1b130", "#f0a030", "#e66a35", "#e0482f"]
// Out-of-focus "footage": two soft light sources over a tinted base, so it
// reads as video without pretending to be anyone's real clip.
const reels = [
  { user: "chef.ankit", caption: "3-ingredient pasta you will never make", likes: "214K", base: "#3a2414", a: "#c77a3d", b: "#f2c48a" },
  { user: "catsofmumbai", caption: "he knocked it off on purpose (part 4)", likes: "1.2M", base: "#18222c", a: "#5b7b96", b: "#d9c9a8" },
  { user: "gym.rahul", caption: "why you're not growing. it's not protein", likes: "88K", base: "#221a2a", a: "#7a4f8f", b: "#e2a3c7" },
  { user: "desi.memes.daily", caption: "me at 2am: one more reel", likes: "402K", base: "#14231f", a: "#3f8a72", b: "#c8e6b0" },
  { user: "study.with.ria", caption: "study with me (I didn't)", likes: "57K", base: "#2a1616", a: "#a1473b", b: "#f0b78c" },
  { user: "carvlogs", caption: "nobody asked, here's the drift", likes: "33K", base: "#1a1d24", a: "#4c5a78", b: "#c0c8d8" },
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
      mm.add({ any: "all", phone: "(max-width: 767px)", short: "(max-height: 640px)" }, (ctx) => {
        const { phone, short } = ctx.conditions!
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
          scrollTrigger: short
            ? { trigger: root.current, start: "top 60%", toggleActions: "play none none none" }
            : { trigger: root.current, start: "top top", end: phone ? "+=150%" : "+=220%", pin: true, scrub: 0.6 },
        })
        tl.to(t, { m: 31, duration: 0.86, onUpdate: () => (clock.textContent = `02:${Math.round(t.m)}`) }, 0)
        // Hold on each reel, then one quick swipe, like a thumb does.
        for (let i = 1; i < LIMIT; i++) {
          const at = 0.06 + (i - 1) * 0.15
          tl.to(q("[data-reels]"), { yPercent: (-100 / reels.length) * i, duration: 0.07, ease: "power3.inOut" }, at + 0.06)
            .to(q(`[data-reel="${i - 1}"] [data-footage]`), { scale: 1.08, duration: 0.13 }, at)
            .set(pills[i - 1], { autoAlpha: 0 }, at + 0.12)
            .set(pills[i], { autoAlpha: 1 }, at + 0.12)
            .to(q("[data-bar]"), { scaleX: (i + 1) / LIMIT, backgroundColor: pillColors[i], duration: 0.04 }, at + 0.12)
        }
        // Limit hit: the app shrinks away like Android closing it, home shows,
        // and the roast drops in from the top.
        tl.to(q("[data-app]"), { scale: 0.82, y: "6%", autoAlpha: 0, duration: 0.08, ease: "power2.in" }, 0.7)
          .to(q("[data-home]"), { autoAlpha: 1, scale: 1, duration: 0.08, ease: "power2.out" }, 0.74)
          .to(q("[data-notif]"), { autoAlpha: 1, yPercent: 0, duration: 0.06, ease: "power3.out" }, 0.8)
          .to(q("[data-quote]"), { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.86)
          .to(q("[data-payoff]"), { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.9)
          .to({}, { duration: 0.08 })
        if (short) tl.timeScale(0.3)
      })
      return () => {
        mm.revert()
        clock.textContent = "02:31"
      }
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 py-10 md:px-8">
      <div className="glow-spot pointer-events-none absolute inset-0 -z-10 m-auto size-[720px] opacity-60" />
      <p
        data-clock
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 text-center font-display text-[30vw] leading-none text-foreground/[0.045] tabular-nums md:text-[22vw]"
      >
        02:31
      </p>

      <div className="grid w-full max-w-6xl items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-12">
        <div className="text-center md:text-left">
          <p className="eyebrow">2:14 a.m.</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[0.95]">“Just one more reel.”</h2>
          <p className="mt-4 max-w-[32ch] text-muted-foreground max-md:hidden">
            Set a limit in reels or minutes for Instagram Reels and YouTube Shorts. Roastr counts every swipe. Nothing is recorded or sent anywhere.
          </p>
        </div>

        <div className="device mx-auto aspect-[9/19.5] h-[min(50svh,600px)] md:h-[min(72svh,600px)]">
          <div className="relative h-full bg-black">
            {/* The reels app, resting closed. */}
            <div data-app className="invisible absolute inset-0 opacity-0">
              <div data-reels className="absolute inset-x-0 top-0" style={{ height: `${reels.length * 100}%` }}>
                {reels.map((r, i) => (
                  <div key={r.user} data-reel={i} className="relative overflow-hidden" style={{ height: `${100 / reels.length}%` }}>
                    <div
                      data-footage
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(60% 40% at 35% 38%, ${r.b}cc, transparent 70%), radial-gradient(70% 55% at 70% 65%, ${r.a}, transparent 75%), ${r.base}`,
                        filter: "blur(14px) saturate(0.85)",
                      }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.35),transparent_22%,transparent_55%,rgb(0_0_0/0.75))]" />
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

        <div className="mx-auto w-full max-w-sm md:mx-0">
          <div className="max-md:hidden">
            <p className="flex justify-between text-sm text-muted-foreground">
              <span>Reels this session</span>
              <span className="text-foreground">Limit {LIMIT}</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div data-bar className="h-full origin-left rounded-full" style={{ backgroundColor: pillColors[LIMIT - 1] }} />
            </div>
          </div>
          {roast && (
            <figure data-quote className="mt-0 rounded-2xl bg-shame p-5 shadow-raised md:mt-8">
              <figcaption className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                <Volume2 className="size-3.5" /> Roastr, out loud
              </figcaption>
              <blockquote className="mt-2 font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-tight text-roast">“{roast}”</blockquote>
            </figure>
          )}
          <p data-payoff className="mt-5 text-muted-foreground max-md:hidden">
            Hit your limit and Roastr kicks you to the home screen and roasts you out loud.
            <b className="block font-semibold text-foreground">Then again every five reels you stay.</b>
          </p>
        </div>
      </div>
    </section>
  )
}
