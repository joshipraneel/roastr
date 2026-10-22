import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ScrollTrigger, useGSAP } from "@/lib/motion"

const APK = "https://github.com/joshipraneel/roastr/releases/latest/download/roastr.apk"

// The nav itself is static HTML in index.html; this frosts it once the page
// scrolls. On phones a bottom Download bar appears once the hero button is
// off screen, and steps aside while the install section is showing.
export function Header() {
  const [heroCta, setHeroCta] = useState(true)
  const [install, setInstall] = useState(false)

  useGSAP(() => {
    ScrollTrigger.create({ start: 8, end: "max", toggleClass: { targets: "#site-nav", className: "scrolled" } })
  })

  useEffect(() => {
    const watch = (el: Element | null, set: (v: boolean) => void) => {
      if (!el) return
      const io = new IntersectionObserver(([e]) => set(e.isIntersecting))
      io.observe(el)
      return io
    }
    const ios = [watch(document.querySelector("[data-hero-cta]"), setHeroCta), watch(document.getElementById("install"), setInstall)]
    return () => ios.forEach((io) => io?.disconnect())
  }, [])

  const show = !heroCta && !install
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 p-3 backdrop-blur-lg transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${show ? "" : "translate-y-full"}`}
      inert={!show}
    >
      <a href={APK} className={buttonVariants({ variant: "key", size: "lg", className: "w-full" })}>
        <Download /> Download for Android · Free
      </a>
    </div>
  )
}
