import { useEffect, useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react"
import { ReactLenis, useLenis, type LenisRef } from "lenis/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { Observer } from "gsap/Observer"
import type Lenis from "lenis"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, SplitText, Observer, useGSAP)

// The page's Lenis instance, and whether an anchor link is mid-jump, for
// stepScene below.
let lenisNow: Lenis | null = null
const nav = { jumping: false }

const query = "(prefers-reduced-motion: reduce)"

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(query)
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => matchMedia(query).matches
  )
}

// Lenis smooth scroll driven by GSAP's ticker, so ScrollTrigger and Lenis
// share one animation loop. With reduced motion the page scrolls natively.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    if (reduced) return
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33) // GSAP's defaults
    }
  }, [reduced])

  if (reduced) return <>{children}</>
  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <SyncScrollTrigger />
      {children}
    </>
  )
}

// ReactLenis creates its instance in its own effect, so subscribe through the
// hook rather than reading the ref, which is still empty on first mount.
// Also glide to in-page anchors; Lenis's own `anchors` option lets the
// browser jump first, so the smooth scroll never shows.
function SyncScrollTrigger() {
  const lenis = useLenis(ScrollTrigger.update)
  useEffect(() => {
    if (!lenis) return
    lenisNow = lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      const target = a && document.querySelector(a.hash)
      if (!target) return
      e.preventDefault()
      history.pushState(null, "", a.hash)
      nav.jumping = true
      lenis.scrollTo(target as HTMLElement, { force: true, onComplete: () => (nav.jumping = false) })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [lenis])
  return null
}

// Plays a pinned scene one beat per scroll, swipe or arrow key, so a fast
// scroller still sees every change. The page holds while the scene is at the
// top; past the last beat (or on Skip) it scrolls on. It holds only on the
// first pass down; scrolling up never gets stopped. Beats are the timeline's labels.
// ponytail: holding the page is deliberate scroll-jacking the user asked for;
// Skip, keys and nav links always get out.
export function stepScene(trigger: Element, tl: gsap.core.Timeline, { end = "+=30%", speed = 4.5, skip }: { end?: string; speed?: number; skip?: HTMLElement | null }) {
  const labels = Object.entries(tl.labels).sort((a, b) => a[1] - b[1]).map(([name]) => name)
  let idx = 0
  let busy = false
  let locked = false
  // Watched to the end (or skipped): never hold the page again this visit.
  let done = false

  const show = (on: boolean) => skip && (skip.hidden = !on)
  const unlock = () => {
    if (!locked) return
    locked = false
    obs.disable()
    show(false)
    lenisNow?.start()
  }
  const release = (down: boolean) => {
    if (down) done = true
    unlock()
    lenisNow?.scrollTo(down ? st.end + 2 : st.start - 2, { force: true })
  }
  const lock = (i: number, overshot = false) => {
    // Skip anchor jumps, and jumps that land past the scene (scrollbar drag,
    // Home/End, a restored scroll position) unless it was a small overshoot.
    if (nav.jumping || !lenisNow || (!overshot && (st.progress <= 0 || st.progress >= 1))) return
    locked = true
    busy = false
    idx = i
    tl.seek(labels[i])
    lenisNow.stop()
    // Hold 1px inside the range: sitting exactly on an edge re-fires onEnter
    // as soon as the release scroll moves, which would lock it again.
    lenisNow.scrollTo(i ? st.end - 1 : st.start + 1, { immediate: true, force: true })
    obs.enable()
    show(true)
  }
  // One beat per gesture: a wheel or trackpad burst fires dozens of events,
  // so only the first after a quiet gap counts.
  let last = 0
  const step = (dir: 1 | -1) => {
    const now = performance.now()
    const quiet = now - last > 240
    last = now
    if (!locked || busy || !quiet) return
    const n = idx + dir
    if (n < 0) return release(false)
    if (n >= labels.length) return release(true)
    busy = true
    const d = Math.max(0.4, Math.abs(tl.labels[labels[n]] - tl.time()) * speed)
    idx = n
    tl.tweenTo(labels[n], { duration: d, ease: "power1.inOut", onComplete: () => void (busy = false) })
  }

  const st = ScrollTrigger.create({
    trigger,
    start: "top top",
    end,
    pin: true,
    // Hold only on the way down, and only until it has been watched. Coming
    // back up, the scene shows its last frame and scrolls past like any section.
    // onUpdate rather than onEnter: a layout refresh mid-scroll (fonts,
    // images) can move the range without firing onEnter.
    onUpdate: (self) => !locked && !done && self.direction === 1 && lock(0),
    onEnterBack: () => !locked && tl.seek(labels[labels.length - 1]),
    // A wheel step or PageDown can carry the page clean past the short range
    // in one update. If it landed less than a screen past, pull back and hold.
    onLeave: (self) => (!locked && !done && scrollY - self.end < innerHeight ? lock(0, true) : unlock()),
    onLeaveBack: unlock,
  })
  const obs = Observer.create({ target: window, type: "wheel,touch", wheelSpeed: -1, tolerance: 10, preventDefault: true, onUp: () => step(1), onDown: () => step(-1) })
  obs.disable()
  const onKey = (e: KeyboardEvent) => {
    if (!locked) return
    const dir = ["ArrowDown", "PageDown", " "].includes(e.key) ? 1 : ["ArrowUp", "PageUp"].includes(e.key) ? -1 : 0
    if (!dir) return
    e.preventDefault()
    step(dir)
  }
  const onSkip = () => {
    tl.seek(labels[labels.length - 1])
    release(true)
  }
  window.addEventListener("keydown", onKey)
  skip?.addEventListener("click", onSkip)
  return () => {
    window.removeEventListener("keydown", onKey)
    skip?.removeEventListener("click", onSkip)
    unlock()
    obs.kill()
  }
}

// Fades every [data-up] inside `scope` up into place as it scrolls into view.
export function useReveal(scope: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  useGSAP(
    () => {
      if (reduced) return
      gsap.set("[data-up]", { autoAlpha: 0, y: 24 })
      ScrollTrigger.batch("[data-up]", {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }),
      })
    },
    { scope, dependencies: [reduced] }
  )
  return reduced
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
