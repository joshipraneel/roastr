import { SmoothScroll } from "@/lib/motion"
import type { Picks } from "@/lib/pick-roasts"
import { Closing } from "@/sections/Closing"
import { Features } from "@/sections/Features"
import { Header } from "@/sections/Header"
import { HeroExtras } from "@/sections/Hero"
import { Languages } from "@/sections/Languages"
import { MorningScene } from "@/sections/MorningScene"
import { NightScene } from "@/sections/NightScene"
import { Privacy } from "@/sections/Privacy"

// main.tsx loads the roast pool as its own chunk and picks this visit's lines.
export default function App({ picks }: { picks: Picks }) {
  return (
    <SmoothScroll>
      <Header />
      <HeroExtras bubbles={picks.bubbles} marquee={picks.marquee} />
      <main id="main">
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
