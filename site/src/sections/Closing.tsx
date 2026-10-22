import { useRef } from "react"
import { Download, Info } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ShineBorder } from "@/components/ui/shine-border"
import { gsap, SplitText, useGSAP, useReveal } from "@/lib/motion"
import { APK, REPO } from "@/lib/links"

const steps = [
  ["Download", "Get roastr.apk on your Android phone (Android 12 or newer)."],
  ["Allow the install", "Open it. If Android asks, allow your browser to install apps."],
  ["Get insulted", "Open Roastr and let it roast you through setup."],
]

// The page roasts you for reaching the bottom, then shows how to install.
export function Closing({ roast }: { roast: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReveal(root)

  useGSAP(
    () => {
      if (reduced) return
      const split = SplitText.create("[data-closing-title]", { type: "words", mask: "words" })
      gsap.from(split.words, {
        yPercent: 110,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: "[data-closing-title]", start: "top 80%" },
      })
      return () => split.revert()
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <section ref={root} id="install" className="mx-auto max-w-6xl px-5 py-section text-center md:px-8">
      <h2 data-closing-title className="mx-auto max-w-4xl font-display text-display-xl text-balance">
        Still scrolling? <span className="text-primary">That's kind of the problem.</span>
      </h2>
      {roast && <p className="mx-auto mt-6 max-w-2xl text-lede text-muted-foreground">“{roast}”</p>}

      <div data-up className="relative mx-auto mt-12 max-w-xl overflow-hidden rounded-3xl bg-surface-1 px-4 py-8 shadow-raised md:p-8">
        <ShineBorder shineColor={["#ff5247", "#ffd54f"]} duration={10} />
        <a href={APK} className={buttonVariants({ variant: "key", size: "xl" })}>
          <Download /> Download for Android
        </a>
        <p className="mt-4 text-sm text-muted-foreground">Free · Android 12+ · No account, no ads, no internet · 18+</p>
      </div>

      <ol className="mt-12 grid gap-4 text-left md:grid-cols-3">
        {steps.map(([title, body], i) => (
          <li key={title} data-up className="relative overflow-hidden rounded-3xl bg-surface-1 p-6 shadow-card">
            <span className="font-display text-display-md text-primary">{i + 1}</span>
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>

      <details data-up className="mx-auto mt-6 max-w-3xl rounded-2xl bg-surface-1 text-left shadow-card">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 font-semibold [&::-webkit-details-marker]:hidden">
          <Info className="size-4 text-muted-foreground" aria-hidden="true" /> Updating, and Android 14+
        </summary>
        <div className="space-y-3 px-5 pb-5 text-muted-foreground">
          <p>To update, install the newer APK over the old one. Your stats are kept. Coming to Google Play; until then, updates are on the <a className="font-semibold text-primary underline underline-offset-4" href={`${REPO}/releases`}>releases page</a>.</p>
          <p>On Android 14 or newer, open the Wake-up page once after setting an alarm and tap <b className="text-foreground">Allow full-screen alarm</b> if it shows. Without it, the alarm is just a notification you can swipe away.</p>
        </div>
      </details>
    </section>
  )
}
