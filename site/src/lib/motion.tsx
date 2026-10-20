import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react"
import { ReactLenis, type LenisRef } from "lenis/react"
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
    const lenis = lenisRef.current?.lenis
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    lenis?.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis?.off("scroll", ScrollTrigger.update)
      gsap.ticker.remove(update)
    }
  }, [reduced])

  if (reduced) return <>{children}</>
  return (
    <>
      <ReactLenis root options={{ autoRaf: false, anchors: true }} ref={lenisRef} />
      {children}
    </>
  )
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
