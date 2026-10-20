import { createPortal } from "react-dom"
import { Marquee } from "@/components/ui/marquee"
import { gsap, SplitText, useGSAP, useReducedMotion } from "@/lib/motion"

const bubbleSpots = [
  "top-[10%] left-0 md:-left-[22%] bg-card",
  "bottom-[14%] -left-[8%] bg-primary text-primary-foreground border-transparent",
]

// The hero itself is static HTML in index.html. This adds this visit's roast
// bubbles and marquee into its empty slots and animates the headline in.
export function HeroExtras({ bubbles, marquee }: { bubbles: string[]; marquee: string[] }) {
  const reduced = useReducedMotion()

  useGSAP(() => {
    const header = document.querySelector("header")!
    if (reduced) return
    gsap.from("[data-bubble]", { scale: 0, transformOrigin: "right center", duration: 0.5, ease: "back.out(2)", stagger: 0.25, delay: 0.8 })
    gsap.to("[data-bubble]", {
      yPercent: -60,
      ease: "none",
      scrollTrigger: { trigger: header, start: "top top", end: "bottom top", scrub: true },
    })
    // On a slow connection index.html's failsafe has already shown the hero;
    // replaying the intro would hide it again under the reader's eyes.
    if (!document.documentElement.classList.contains("js-anim")) return
    const split = SplitText.create("[data-hero-title]", { type: "words,chars", mask: "chars" })
    gsap
      .timeline({ defaults: { ease: "power4.out" } })
      .set(header.querySelectorAll("[data-reveal]"), { visibility: "visible" })
      .from(split.chars, { yPercent: 110, rotate: 8, duration: 0.7, stagger: 0.025 })
      .from("[data-reveal]:not([data-hero-title])", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
      .from("[data-hero-phone]", { rotate: 18, y: 80, duration: 0.9 }, "<")
    return () => split.revert()
  }, [reduced])

  return (
    <>
      {createPortal(
        bubbles.map((b, i) => (
          <p
            key={b}
            data-bubble
            className={`absolute max-w-[15rem] rounded-2xl border px-4 py-3 text-sm font-bold shadow-lg ${bubbleSpots[i]}`}
          >
            {i === 0 && "🔥 "}“{b}”
          </p>
        )),
        document.getElementById("hero-bubbles")!
      )}
      {createPortal(
        <Marquee className="p-0 text-sm font-black tracking-wide uppercase [--duration:60s] [--gap:2rem]">
          {marquee.map((m) => (
            <span key={m} className="whitespace-nowrap">
              {m} <span className="ml-8">✱</span>
            </span>
          ))}
        </Marquee>,
        document.getElementById("hero-marquee")!
      )}
    </>
  )
}
