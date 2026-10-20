import { useMemo } from "react"
import { SmoothScroll } from "@/lib/motion"
import { pickRoasts, type Roast } from "@/lib/pick-roasts"
import roasts from "@/roasts.json"
import { HeroExtras } from "@/sections/Hero"

export default function App() {
  const picks = useMemo(() => pickRoasts(roasts as Roast[]), [])
  return (
    <SmoothScroll>
      <HeroExtras bubbles={picks.bubbles} marquee={picks.marquee} />
      {["2 a.m.", "Morning", "Features", "Languages", "Privacy", "Closing"].map((s) => (
        <section key={s} className="grid min-h-svh place-items-center border-b text-4xl font-black">
          {s}
        </section>
      ))}
    </SmoothScroll>
  )
}
