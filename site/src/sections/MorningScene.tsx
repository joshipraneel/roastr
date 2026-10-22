import { useRef } from "react"
import { AlarmClock, ChevronDown, CircleCheck, Volume2 } from "lucide-react"
import { PhoneStatus } from "@/components/PhoneStatus"
import { gsap, useGSAP, useReducedMotion } from "@/lib/motion"

// The app's real maths mission. The second sum gets a wrong answer first,
// because the app mocks those.
const sums = [
  { q: "27 + 47", a: "74" },
  { q: "38 + 19", wrong: "47", a: "57" },
  { q: "16 × 3", a: "48" },
]

// 7 a.m. The alarm takes over the screen, then the maths mission plays out
// the way it does in the app. The resting markup is the end state.
export function MorningScene({ roast }: { roast: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add({ any: "all", phone: "(max-width: 767px)", short: "(max-height: 640px)" }, (ctx) => {
        const { phone, short } = ctx.conditions!
        gsap.set(q("[data-alarm]"), { autoAlpha: 1 })
        gsap.set(q("[data-mission], [data-done]"), { autoAlpha: 0 })
        gsap.set(q("[data-sum]"), { autoAlpha: 0 })
        gsap.set(q('[data-sum="0"]'), { autoAlpha: 1 })
        gsap.set(q("[data-digit], [data-error]"), { autoAlpha: 0 })
        gsap.set(q("[data-placeholder]"), { autoAlpha: 1 })
        gsap.set(q("[data-dot]"), { backgroundColor: "var(--surface-3)" })
        gsap.set(q("[data-sky]"), { autoAlpha: 0, yPercent: 30 })
        gsap.set(q("[data-quote], [data-payoff]"), { autoAlpha: 0, y: 24 })

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: short
            ? { trigger: root.current, start: "top 60%", toggleActions: "play none none none" }
            : { trigger: root.current, start: "top top", end: phone ? "+=160%" : "+=230%", pin: true, scrub: 0.6 },
        })
        tl.to(q("[data-sky]"), { autoAlpha: 1, yPercent: 0, duration: 0.85 }, 0)
          // A phone on vibrate barely moves; keep it to a few pixels.
          .to(q("[data-device]"), { keyframes: { x: [0, -2, 2, -2, 2, -1, 1, 0] }, duration: 0.08 }, 0.04)
          .to(q("[data-alarm]"), { autoAlpha: 0, duration: 0.04 }, 0.14)
          .to(q("[data-mission]"), { autoAlpha: 1, duration: 0.04 }, 0.15)

        // Type an answer a digit at a time, then tap Check.
        let at = 0.2
        const type = (field: string, sel: string) => {
          tl.set(q(`${field} [data-placeholder]`), { autoAlpha: 0 }, at)
          q(`${sel} [data-digit]`).forEach((d, i) => tl.set(d, { autoAlpha: 1 }, at + i * 0.03))
          at += 0.07
          tl.to(q("[data-check]"), { scale: 0.96, duration: 0.01, yoyo: true, repeat: 1 }, at)
          at += 0.03
        }
        sums.forEach((s, i) => {
          const field = `[data-sum="${i}"]`
          if (s.wrong) {
            type(field, `${field} [data-wrong-answer]`)
            tl.to(q(`${field} [data-field]`), { borderColor: "#f2b8b5", duration: 0.01 }, at)
              .set(q(`${field} [data-error]`), { autoAlpha: 1 }, at)
              .set(q(`${field} [data-wrong-answer] [data-digit]`), { autoAlpha: 0 }, at + 0.06)
            at += 0.06
          }
          type(field, `${field} [data-right-answer]`)
          tl.to(q(`${field} [data-field]`), { borderColor: "#3ddc84", duration: 0.01 }, at)
            .set(q(`${field} [data-error]`), { autoAlpha: 0 }, at)
            .set(q("[data-dot]")[i], { backgroundColor: "var(--ok)" }, at)
          at += 0.03
          if (i < sums.length - 1) tl.set(q(field), { autoAlpha: 0 }, at).set(q(`[data-sum="${i + 1}"]`), { autoAlpha: 1 }, at)
        })
        tl.to(q("[data-mission]"), { autoAlpha: 0, duration: 0.03 }, at)
          .to(q("[data-done]"), { autoAlpha: 1, duration: 0.04 }, at + 0.02)
          .to(q("[data-quote]"), { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, at + 0.04)
          .to(q("[data-payoff]"), { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, at + 0.07)
          .to({}, { duration: 0.08 })
        if (short) tl.timeScale(0.3)
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 py-10 md:px-8">
      <div data-sky className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,#2a0f1a55_40%,#8a2a1e66_80%,#ff7a5944_100%)]" />
      <div className="grid w-full max-w-6xl items-center gap-6 md:grid-cols-[auto_1fr] md:gap-20">
        <div className="text-center md:order-2 md:text-left">
          <p className="eyebrow">7:00 a.m. · Wake-up roast</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,1.2rem+3vw,3.75rem)] leading-[0.95]">Snoozing is not a mission.</h2>
          <p className="mt-4 max-w-[44ch] text-muted-foreground max-md:hidden">
            The alarm yells a roast until you finish your mission: three maths sums, or 30 real steps. There's no snooze button, and wrong answers get mocked.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground max-md:hidden">
            Mission
            <span className="flex gap-1.5">
              {sums.map((s) => (
                <span key={s.q} data-dot className="h-1.5 w-8 rounded-full bg-ok" />
              ))}
            </span>
          </div>
          {roast && (
            <figure data-quote className="mt-8 max-w-lg rounded-2xl bg-shame p-5 text-left shadow-raised max-md:hidden">
              <figcaption className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                <Volume2 className="size-3.5" /> What woke you up
              </figcaption>
              <blockquote className="mt-2 font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-tight text-roast">“{roast}”</blockquote>
            </figure>
          )}
          <p data-payoff className="mt-5 font-semibold max-md:hidden">Alarm off. You're up. Mostly.</p>
        </div>

        <div data-device className="device mx-auto aspect-[9/19.5] h-[min(56svh,600px)] md:order-1 md:h-[min(72svh,600px)]">
          <div className="@container relative h-full bg-app text-[#e3e2e6]">
            <PhoneStatus time="7:00" className="pt-2" />

            {/* Full-screen alarm. */}
            <div data-alarm className="invisible absolute inset-0 top-7 flex flex-col items-center px-5 pt-[28%] text-center opacity-0">
              <AlarmClock className="size-6 text-app-accent" aria-hidden="true" />
              <p className="mt-3 text-[3.4rem] leading-none font-light tabular-nums">7:00</p>
              <p className="mt-2 text-[11px] text-white/60">Roastr · Wake-up roast</p>
              <p className="mt-6 flex items-start gap-1.5 text-left text-[11px] leading-snug text-white/85">
                <Volume2 className="mt-px size-3.5 shrink-0 text-app-accent" aria-hidden="true" />
                {roast}
              </p>
              <span className="absolute inset-x-5 bottom-8 rounded-full bg-app-accent py-2.5 text-[11px] font-semibold text-[#1b2f4a]">Start mission</span>
            </div>

            {/* The maths mission, as in the app. */}
            <div data-mission className="invisible absolute inset-0 top-7 px-3 opacity-0">
              <div className="flex items-center gap-2 rounded-2xl bg-[#1d2024] px-2.5 py-2 text-[10px]">
                <img src="/icon.svg" alt="" className="size-5 rounded-full" />
                <span className="truncate font-medium">Wake up! Finish your missi…</span>
                <span className="shrink-0 text-white/50">· now</span>
                <ChevronDown className="ml-auto size-3.5 shrink-0 text-white/60" aria-hidden="true" />
              </div>
              <div className="relative mt-[22%] px-2 text-center">
                {sums.map((s, i) => (
                  <div key={s.q} data-sum={i} className={i ? "absolute inset-x-2 top-0" : ""}>
                    <p className="text-[min(15px,6.4cqw)] leading-tight font-semibold">Get UP, you horizontal disappointment.</p>
                    <p className="mt-2 text-[10px] text-white/75">Solve 3 sums or I keep yelling ({i + 1}/3)</p>
                    <p className="mt-4 text-[min(1.9rem,11cqw)] font-semibold whitespace-nowrap tabular-nums">{s.q} = ?</p>
                    <div data-field className="relative mt-4 h-10 rounded-md border border-white/40 text-left">
                      <span data-placeholder className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-white/50">Answer</span>
                      {s.wrong && (
                        <span data-wrong-answer className="absolute top-1/2 left-3 -translate-y-1/2 text-sm tabular-nums">
                          {[...s.wrong].map((d, k) => <span key={k} data-digit>{d}</span>)}
                        </span>
                      )}
                      <span data-right-answer className="absolute top-1/2 left-3 -translate-y-1/2 text-sm tabular-nums">
                        {[...s.a].map((d, k) => <span key={k} data-digit>{d}</span>)}
                      </span>
                    </div>
                    <p data-error className={`mt-1.5 text-left text-[9px] text-[#f2b8b5] ${s.wrong ? "" : "hidden"}`}>
                      {s.wrong}? Even your alarm can add better than that.
                    </p>
                  </div>
                ))}
              </div>
              <span data-check className="mx-2 mt-8 block rounded-full bg-app-accent py-2.5 text-center text-[11px] font-semibold text-[#1b2f4a]">Check</span>
            </div>

            {/* Done: the resting end state. */}
            <div data-done className="absolute inset-0 top-7 flex flex-col items-center justify-center px-6 text-center">
              <CircleCheck className="size-10 text-ok" aria-hidden="true" />
              <p className="mt-4 text-lg font-semibold">Alarm off.</p>
              <p className="mt-1 text-xs text-white/70">Good morning, legend.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
