import { useRef, useState } from "react"
import { Check, ChevronLeft, Copy, EyeOff, ShieldCheck, Trash2 } from "lucide-react"
import { SectionHeader } from "@/components/SectionHeader"
import { gsap, useGSAP, useReveal } from "@/lib/motion"
import { FINGERPRINT, PRIVACY } from "@/lib/links"

const points = [
  { icon: ShieldCheck, title: "Stays on your phone", body: "Your name, stats and recordings never leave the device. No account, no analytics, no ads." },
  { icon: EyeOff, title: "Counts, doesn't read", body: "Minutes mode only sees how long apps were open. Reel mode only counts swipes in YouTube and Instagram, and asks first." },
  { icon: Trash2, title: "Delete anytime", body: "Uninstall or clear the app's storage and everything is gone." },
]
// From the README's "Permissions, and why".
const perms = [
  ["Usage access", "Minutes and the Sunday report"],
  ["Accessibility", "Optional · counts reel swipes"],
  ["Notifications", "Busted alerts and the alarm"],
  ["Alarms and full-screen", "Ring on time, over the lock screen"],
  ["Physical activity", "Optional · the 30-step mission"],
  ["Microphone", "Optional · record your own roasts"],
]

export function Privacy() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const reduced = useReveal(root)

  useGSAP(
    () => {
      if (reduced) return
      gsap.from("[data-stamp]", { scale: 1.6, rotate: -14, autoAlpha: 0, duration: 0.5, ease: "back.out(2)", scrollTrigger: { trigger: "[data-stamp]", start: "top 80%", once: true } })
    },
    { scope: root, dependencies: [reduced] }
  )

  const copy = async () => {
    await navigator.clipboard.writeText(FINGERPRINT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={root} id="privacy" className="mx-auto max-w-6xl px-5 py-section md:px-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <SectionHeader eyebrow="Privacy" title="Your roasts never leave your phone." />
          <ul className="mt-10 space-y-7">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} data-up className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-ok shadow-card">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-muted-foreground">{body}</span>
                </span>
              </li>
            ))}
          </ul>
          <a href={PRIVACY} className="mt-8 inline-flex h-11 items-center font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
            Read the privacy policy
          </a>
        </div>

        <div data-up className="self-start rounded-3xl bg-surface-1 p-2 shadow-raised">
          <div className="rounded-[1.25rem] bg-app p-5 text-[#e3e2e6]">
            <p className="flex items-center gap-2 text-sm text-white/60">
              <ChevronLeft className="size-4" aria-hidden="true" /> App info › Roastr
            </p>
            <p className="mt-4 text-xl">Permissions</p>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4">
              <span>
                <span className="block font-semibold">Internet</span>
                <span className="text-sm text-white/60">Network access</span>
              </span>
              <span data-stamp className="rotate-[-6deg] rounded-md border-2 border-ok px-2.5 py-1 text-xs font-bold tracking-wider text-ok uppercase">
                Not requested
              </span>
            </div>
            <ul className="mt-3 divide-y divide-white/8">
              {perms.map(([name, why]) => (
                <li key={name} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <span>{name}</span>
                  <span className="text-right text-white/60">{why}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3 p-4 text-sm">
            <span className="min-w-0">
              <span className="block text-muted-foreground">Signing key, SHA-256</span>
              <code className="block truncate font-mono text-xs">{FINGERPRINT}</code>
            </span>
            <button
              onClick={copy}
              aria-label="Copy the signing fingerprint"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 transition-colors hover:bg-surface-3"
            >
              {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
