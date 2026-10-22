import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { pickRoasts, type Roast } from "@/lib/pick-roasts"

// Swap the hero's static fallback roast and marquee for this visit's picks.
for (const id of ["hero-bubbles", "hero-marquee"]) document.getElementById(id)!.replaceChildren()
// Without JS the install link goes to the README; with JS the install section exists on the page.
document.querySelector("[data-install-link]")!.setAttribute("href", "#install")

// The roast pool is its own chunk so it doesn't weigh on the main bundle;
// the static hero is already on screen while it loads.
import("./roasts.json").then(({ default: roasts }) =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App picks={pickRoasts(roasts as Roast[])} />
    </StrictMode>
  )
)
