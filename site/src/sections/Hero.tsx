import { createPortal } from "react-dom"
import { Flame, Volume2 } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { gsap, ScrollTrigger, SplitText, useGSAP, useReducedMotion } from "@/lib/motion"

// Bubbles sit against the bezels, never over the screenshot's own UI. The
// second one wears the app's shame-card look. Below 1280px only the first shows.
const bubbleSpots = [
  "top-[14%] right-[calc(100%-1.5rem)] border-border-strong bg-surface-2 max-xl:top-[-7%] max-xl:right-auto max-xl:-left-6 max-xl:max-w-[13rem]",
  "bottom-[12%] left-[calc(100%-1.5rem)] border-transparent bg-shame text-roast max-xl:hidden",
]

// The hero itself is static HTML in index.html. This adds this visit's roast
// bubbles and marquee into its empty slots and animates the headline in.
export function HeroExtras({ bubbles, marquee }: { bubbles: string[]; marquee: string[] }) {
  const reduced = useReducedMotion()

  useGSAP(() => {
    const header = document.querySelector("header")!
    document.getElementById("hero-marquee-sr")!.textContent = `Sample roasts: ${marquee.slice(0, 3).join(" ")}`
    if (reduced) return
    gsap.from("[data-bubble]", { scale: 0, transformOrigin: "center", duration: 0.5, ease: "back.out(2)", stagger: 0.25, delay: 0.9 })
    gsap.to("[data-bubble]", {
      yPercent: -60,
      ease: "none",
      scrollTrigger: { trigger: header, start: "top top", end: "bottom top", scrub: true },
    })
    const float = gsap.to("[data-hero-float]", { y: -8, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 })
    ScrollTrigger.create({ trigger: header, start: "top top", end: "bottom top", onToggle: (s) => (s.isActive ? float.play() : float.pause()) })
    // On a slow connection index.html's failsafe has already shown the hero;
    // replaying the intro would hide it again under the reader's eyes.
    if (!document.documentElement.classList.contains("js-anim")) return
    const split = SplitText.create("[data-hero-title]", { type: "words,chars", mask: "chars" })
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .set(header.querySelectorAll("[data-reveal]"), { visibility: "visible" })
      .from(split.chars, { yPercent: 110, duration: 0.8, stagger: 0.02 })
      .from("[data-reveal]:not([data-hero-title]):not([data-hero-phone])", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.5")
      .from("[data-hero-phone]", { rotate: 12, y: 80, autoAlpha: 0, duration: 1 }, "<")
    return () => split.revert()
  }, [reduced])

  return (
    <>
      {createPortal(
        bubbles.map((b, i) => (
          <p
            key={b}
            data-bubble
            className={`absolute flex w-max max-w-[15rem] gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-raised ${bubbleSpots[i]}`}
          >
            {i === 0 && <Volume2 className="mt-0.5 size-4 shrink-0 text-primary" />}“{b}”
          </p>
        )),
        document.getElementById("hero-bubbles")!
      )}
      {createPortal(
        <Marquee className="p-0 font-display text-lg uppercase [--duration:60s] [--gap:2rem] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          {marquee.map((m) => (
            <span key={m} className="flex items-center gap-8 whitespace-nowrap">
              {m} <Flame className="size-4" />
            </span>
          ))}
        </Marquee>,
        document.getElementById("hero-marquee")!
      )}
    </>
  )
}
