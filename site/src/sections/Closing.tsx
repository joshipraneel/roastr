import { useRef } from "react"
import { gsap, SplitText, useGSAP, useReducedMotion } from "@/lib/motion"

const APK = "https://github.com/joshipraneel/roastr/releases/latest/download/roastr.apk"
const REPO = "https://github.com/joshipraneel/roastr"
const link = "font-semibold text-primary underline-offset-4 hover:underline"

// The page roasts you for reaching the bottom, then shows how to install.
export function Closing({ roast }: { roast: string }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const split = SplitText.create("[data-closing-title]", { type: "words", mask: "words" })
      gsap.from(split.words, {
        yPercent: 110,
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.06,
        scrollTrigger: { trigger: "[data-closing-title]", start: "top 80%" },
      })
      return () => split.revert()
    },
    { scope: root, dependencies: [reduced] }
  )

  return (
    <>
      <section ref={root} id="install" className="mx-auto max-w-6xl px-4 py-24">
        <h2 data-closing-title className="text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.9] font-black tracking-[-0.04em]">
          Still scrolling? <span className="text-primary">That's kind of the problem.</span>
        </h2>
        {roast && <p className="mt-6 max-w-2xl text-xl font-bold">“{roast}”</p>}

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <a href={APK} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-lg font-extrabold text-primary-foreground shadow-[0_10px_30px_var(--glow)] transition-transform hover:-translate-y-0.5">
              <span aria-hidden="true">⬇</span> Download for Android
            </a>
            <p className="mt-3 text-sm text-muted-foreground">Free · Android 12+ · No account, no ads, no internet · 18+</p>
          </div>
          <div>
            <h3 className="text-xl font-extrabold">Install</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Download <a className={link} href={APK}>roastr.apk</a> on your Android phone (Android 12 or newer).</li>
              <li>Open it. If Android asks, allow your browser to install apps.</li>
              <li>Open Roastr and let it insult you through setup.</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              To update, install the newer APK over the old one. Your stats are kept. On Android 14 or newer, open the Wake-up page once after setting an alarm and tap <b>Allow full-screen alarm</b> if it shows.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Coming to Google Play. Until then, updates are on the <a className={link} href={`${REPO}/releases`}>releases page</a>.{" "}
              <a className={link} href={`${REPO}#permissions-and-why`}>Permissions, FAQ and checksum on GitHub</a>.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 pt-7 pb-12 text-sm text-muted-foreground">
          Roastr is for adults. The roasts are rude; that's the point. ·{" "}
          <a className="underline-offset-4 hover:underline" href={`${import.meta.env.BASE_URL}privacy/`}>Privacy</a> ·{" "}
          <a className="underline-offset-4 hover:underline" href={REPO}>GitHub</a>
        </div>
      </footer>
    </>
  )
}
