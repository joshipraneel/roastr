import { useRef, type ReactNode } from "react"
import { Plus } from "lucide-react"
import { SectionHeader } from "@/components/SectionHeader"
import { useReveal } from "@/lib/motion"
import { REPO } from "@/lib/links"

const a = "font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"

// Answers come from the README; nothing here goes beyond it.
const faqs: [string, ReactNode][] = [
  ["Is it on Google Play?", "Not yet. It's coming. Until then, download the APK from this page."],
  [
    "Is installing an APK safe?",
    <>Every release is signed with the same key. Compare its SHA-256 fingerprint (in the Privacy section above) with the one in the <a className={a} href={`${REPO}#install`}>README</a>. If Android asks, allow your browser to install apps.</>,
  ],
  ["Why is it so rude?", "Because polite screen-time reminders are easy to ignore. Pick Mild if you want it clean."],
  ["How rude is rude?", "Three spice levels, from grandma-safe to savage. Every roast is a joke, not abuse: no hard swearing, slurs or family insults, even at 18+."],
  ["Does it send my data anywhere?", "No. Roastr doesn't have internet permission. No account, no ads, no analytics. Uninstall or clear its storage to delete everything."],
  ["My roast didn't play.", "Roasts use the alarm volume. Check the volume slider in Roastr's settings and your phone's alarm volume."],
  ["The alarm was just a notification.", "Android 14 and newer can block full-screen alarms. Open the Wake-up page and tap Allow full-screen alarm."],
  ["How do I update?", "Install the newer APK over the old one. Your stats are kept."],
  ["Can I turn off the Sunday report?", "Yes: Settings › Sunday roast report."],
  ["Which phones does it run on?", "Android 12 or newer."],
  ["Found a bug, or a roast that went too far?", <><a className={a} href={`${REPO}/issues`}>Open an issue</a> on GitHub.</>],
]

export function Faq() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} id="faq" className="mx-auto max-w-6xl px-5 py-section md:px-8">
      <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
        <SectionHeader eyebrow="FAQ" title="Questions you're asking instead of sleeping." />
        <div className="divide-y divide-border border-y border-border">
          {faqs.map(([q, ans]) => (
            <details key={q} name="faq" data-up className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <Plus className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-[60ch] pb-5 text-muted-foreground">{ans}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
