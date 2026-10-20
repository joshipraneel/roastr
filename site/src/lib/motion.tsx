import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react"
import { ReactLenis, useLenis, type LenisRef } from "lenis/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

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
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      const target = a && document.querySelector(a.hash)
      if (!target) return
      e.preventDefault()
      history.pushState(null, "", a.hash)
      lenis.scrollTo(target as HTMLElement)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [lenis])
  return null
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
