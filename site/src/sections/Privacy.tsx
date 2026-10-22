import { useRef } from "react"
import { gsap, useGSAP, useReducedMotion } from "@/lib/motion"

const cards = [
  ["Stays on your phone", "Your name, stats and recordings never leave the device. No account, no analytics, no ads."],
  ["Counts, doesn't read", "Minutes mode only sees how long apps were open. Reel mode only listens to YouTube and Instagram to count swipes, and asks first."],
  ["Delete anytime", "Uninstall or clear the app's storage and everything is gone."],
]

export function Privacy() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      gsap.from("[data-strike]", {
        scaleX: 0,
        duration: 0.6,
        ease: "power2.inOut",
        scrollTrigger: { trigger: "[data-strike]", start: "top 80%" },
      })
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} id="privacy" className="mx-auto max-w-6xl px-4 py-24">
      <h2 className="text-[clamp(2.2rem,6vw,4rem)] leading-none font-black tracking-tight">Private by design</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Roastr doesn't even have{" "}
        <span className="relative whitespace-nowrap text-foreground">
          internet permission
          <span data-strike aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[3px] origin-left -rotate-2 bg-primary" />
        </span>
        .
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map(([title, body]) => (
          <div key={title} className="rounded-3xl border bg-card p-6">
            <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
            <p className="mt-2 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-muted-foreground">
        Read the full <a className="font-semibold text-primary underline-offset-4 hover:underline" href={`${import.meta.env.BASE_URL}privacy/`}>privacy policy</a>.
      </p>
    </section>
  )
}
