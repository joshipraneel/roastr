import { useRef } from "react"
import { Hourglass, Volume2 } from "lucide-react"
import { SectionHeader } from "@/components/SectionHeader"
import { useReveal } from "@/lib/motion"

// The hero says "your screen time report is too polite". This shows it.
export function Compare() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} className="mx-auto max-w-6xl px-5 py-section md:px-8">
      <SectionHeader
        eyebrow="The problem"
        title="Your screen time report, but make it personal."
        lede="Your phone already tells you how long you scrolled. You swipe it away. Roastr says the same number to your face."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <figure data-up className="flex flex-col rounded-3xl bg-surface-1 p-6 shadow-card md:p-8">
          <figcaption className="text-sm text-subtle">What your phone says</figcaption>
          <div className="mt-6 rounded-2xl bg-surface-2 p-4 text-muted-foreground">
            <p className="flex items-center gap-2 text-xs">
              <Hourglass className="size-3.5" aria-hidden="true" /> Digital Wellbeing · now
            </p>
            <p className="mt-2 text-sm">You've used Instagram for 3h 12m today.</p>
          </div>
          <p className="mt-auto pt-8 text-muted-foreground">Polite. Grey. Swiped away in half a second.</p>
        </figure>
        <figure data-up className="flex flex-col rounded-3xl bg-shame p-6 shadow-raised md:p-8">
          <figcaption className="text-sm text-white/70">What Roastr says</figcaption>
          <div className="mt-6 rounded-2xl bg-black/30 p-4">
            <p className="flex items-center gap-2 text-xs text-white/70">
              <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="size-3.5 rounded" /> Roastr · now
              <Volume2 className="ml-auto size-3.5" aria-hidden="true" />
            </p>
            <blockquote className="mt-2 font-display text-[clamp(1.35rem,1rem+1.2vw,1.9rem)] leading-tight text-roast">
              “3h 12m on Instagram, watching strangers live the life you're too busy scrolling to live.”
            </blockquote>
          </div>
          <p className="mt-auto pt-8 font-semibold text-white">Out loud. Harder to ignore.</p>
        </figure>
      </div>
    </section>
  )
}
