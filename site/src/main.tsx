import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

// Swap the hero's static fallback roast and marquee for this visit's picks.
for (const id of ["hero-bubbles", "hero-marquee"]) document.getElementById(id)!.replaceChildren()
// Without JS the install link goes to the README; with JS the install section exists on the page.
document.querySelector("[data-install-link]")!.setAttribute("href", "#install")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
