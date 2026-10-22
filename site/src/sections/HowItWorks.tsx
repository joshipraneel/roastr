import { useRef } from "react"
import { Gauge, Infinity as Endless, Megaphone } from "lucide-react"
import { SectionHeader } from "@/components/SectionHeader"
import { gsap, useGSAP, useReveal } from "@/lib/motion"

const steps = [
  { icon: Gauge, title: "Set a limit", body: "Minutes a day, or reels a session, for YouTube and Instagram." },
  { icon: Endless, title: "Scroll past it", body: "You will. Everyone does. That's the whole reason this exists." },
  { icon: Megaphone, title: "Get roasted out loud", body: "At the limit, Roastr roasts you. Then again every five minutes you stay." },
]
// Only numbers the README backs up.
const stats = [
  { n: 1000, prefix: "~", label: "voiced roasts" },
  { n: 4, label: "languages" },
  { n: 3, label: "spice levels" },
  { n: 0, label: "internet permissions" },
]

export function HowItWorks() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReveal(root)

  useGSAP(
    () => {
      if (reduced) return
      for (const el of gsap.utils.toArray<HTMLElement>("[data-count]")) {
        const end = Number(el.dataset.count)
        const v = { n: 0 }
        gsap.to(v, {
          n: end,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = Math.round(v.n).toLocaleString("en-IN")),
        })
      }
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} id="how" className="mx-auto max-w-6xl px-5 py-section md:px-8">
      <SectionHeader eyebrow="How it works" title="Three steps. You'll fail step two." />
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li key={title} data-up className="relative overflow-hidden rounded-3xl bg-surface-1 p-6 shadow-card md:p-8">
            <span aria-hidden="true" className="absolute -top-4 right-4 font-display text-[7rem] leading-none text-foreground/[0.04]">
              {i + 1}
            </span>
            <Icon className="size-6 text-primary" aria-hidden="true" />
            <h3 className="mt-6 text-title font-semibold">{title}</h3>
            <p className="mt-2 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <dl className="mt-4 grid grid-cols-2 overflow-hidden rounded-3xl bg-border shadow-card md:grid-cols-4" style={{ gap: 1 }}>
        {stats.map((s) => (
          <div key={s.label} data-up className="bg-surface-1 p-6 md:p-8">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 font-display text-display-md tabular-nums">
              {s.prefix}
              <span data-count={s.n}>{s.n.toLocaleString("en-IN")}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
