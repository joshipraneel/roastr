import { useRef, useState, type ReactNode } from "react"
import { SectionHeader } from "@/components/SectionHeader"
import { useReveal } from "@/lib/motion"

// The app's own thresholds (WeeklyReport.kt, screenTitle).
const title = (h: number) =>
  h < 2 ? "Suspiciously Functional Human" : h < 4 ? "Casual Glass Licker" : h < 6 ? "Part-Time Pixel Farmer" : h < 8 ? "Full-Time Screen Employee" : "Phone With a Human Attached"

const apps: [string, number][] = [
  ["Instagram", 9.7],
  ["YouTube", 8.1],
  ["WhatsApp", 4.5],
  ["Chrome", 2.2],
  ["BGMI", 1.8],
]

function Card({ label, children, line }: { label: string; children: ReactNode; line?: string }) {
  return (
    <li data-up className="flex aspect-[4/5] w-[78vw] max-w-72 shrink-0 snap-center flex-col rounded-3xl bg-shame p-6 text-white shadow-raised xl:aspect-auto xl:min-h-[26rem] xl:w-auto xl:max-w-none">
      <p className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">{label}</p>
      <div className="mt-4">{children}</div>
      {line && <p className="mt-auto pt-4 text-sm leading-snug text-white/85">“{line}”</p>}
    </li>
  )
}

// Demo numbers; the lines are real ones from the app's weekly list.
export function SundayReport() {
  const root = useRef<HTMLElement>(null)
  const [hours, setHours] = useState(4.5)
  useReveal(root)

  return (
    <section ref={root} id="sunday" className="py-section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeader
          eyebrow="Sunday roast report"
          title="Every Sunday, a report card you'll want to hide."
          lede="Your week's screen time, roasted, one swipeable card at a time. Share any card as an image. It's made on your phone, and you can switch it off in Settings."
        />
      </div>
      <ol className="mx-auto mt-12 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:px-8 xl:grid xl:grid-cols-5 xl:overflow-visible">
        <Card label="This week" line="31h on your phone. That's not screen time, that's a second job with no salary.">
          <p className="font-display text-display-lg text-roast tabular-nums">31h 12m</p>
          <p className="mt-1 text-sm text-white/70">4h 27m a day</p>
        </Card>
        <Card label="Top apps">
          <ul className="space-y-2.5 text-sm">
            {apps.map(([name, h]) => (
              <li key={name}>
                <span className="flex justify-between text-white/85">
                  {name}
                  <span className="tabular-nums">{Math.floor(h)}h {Math.round((h % 1) * 60)}m</span>
                </span>
                <span className="mt-1 block h-1.5 rounded-full bg-roast" style={{ width: `${(h / apps[0][1]) * 100}%` }} />
              </li>
            ))}
          </ul>
        </Card>
        <Card label="Vs last week" line="You didn't break the habit. You gave it a promotion.">
          <p className="font-display text-display-lg text-roast tabular-nums">+3h 20m</p>
          <p className="mt-1 text-sm text-white/70">Worst day: Saturday</p>
        </Card>
        <Card label="After midnight" line="Your phone saw the sunrise. You were still on it.">
          <p className="font-display text-display-lg text-roast tabular-nums">4h 50m</p>
          <p className="mt-1 text-sm text-white/70">312 unlocks</p>
        </Card>
        <Card label="Title earned" line="Same time next Sunday. Try to give me less material.">
          <p className="font-display text-display-md text-roast" aria-live="polite">
            {title(hours)}
          </p>
          <label className="mt-5 block text-sm text-white/80">
            <span className="flex justify-between">
              Hours a day <span className="tabular-nums">{hours}h</span>
            </span>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-2 h-11 w-full accent-roast"
            />
          </label>
        </Card>
      </ol>
    </section>
  )
}
