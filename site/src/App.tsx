import { useMemo } from "react"
import { SmoothScroll } from "@/lib/motion"
import { pickRoasts, type Roast } from "@/lib/pick-roasts"
import roasts from "@/roasts.json"
import { Closing } from "@/sections/Closing"
import { Features } from "@/sections/Features"
import { HeroExtras } from "@/sections/Hero"
import { Languages } from "@/sections/Languages"
import { MorningScene } from "@/sections/MorningScene"
import { NightScene } from "@/sections/NightScene"
import { Privacy } from "@/sections/Privacy"

export default function App() {
  const picks = useMemo(() => pickRoasts(roasts as Roast[]), [])
  return (
    <SmoothScroll>
      <HeroExtras bubbles={picks.bubbles} marquee={picks.marquee} />
      <main>
        <NightScene roast={picks.night} />
        <MorningScene roast={picks.morning} />
        <Features />
        <Languages langs={picks.langs} />
        <Privacy />
        <Closing roast={picks.closing} />
      </main>
    </SmoothScroll>
  )
}
