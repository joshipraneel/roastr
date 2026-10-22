import { APK, FINGERPRINT, PRIVACY, REPO } from "@/lib/links"

const cols: [string, [string, string][]][] = [
  ["Get it", [["Download APK", APK], ["All releases", `${REPO}/releases`], ["Install help", "#install"]]],
  ["Help", [["FAQ", "#faq"], ["Report a bug or a roast", `${REPO}/issues`], ["Source on GitHub", REPO]]],
  ["Legal", [["Privacy policy", PRIVACY]]],
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border pb-[max(env(safe-area-inset-bottom),5rem)] md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-16 md:grid-cols-[1.5fr_repeat(3,1fr)] md:px-8">
        <div>
          <p className="flex items-center gap-2.5 font-display text-2xl">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="size-8 rounded-lg" /> Roastr
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Made to be rude. Built to be private. For adults: the roasts are rude; that's the point.</p>
          <p className="mt-4 text-xs text-subtle">
            Signing key <code className="font-mono">{FINGERPRINT.slice(0, 23)}…</code>
          </p>
        </div>
        {cols.map(([head, links]) => (
          <div key={head}>
            <p className="text-sm font-semibold">{head}</p>
            <ul className="mt-2 text-sm text-muted-foreground">
              {links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="inline-flex min-h-11 items-center transition-colors hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-5 text-xs text-subtle md:px-8">© 2026 @joshipraneel · No cookies, analytics or trackers on this site either.</p>
      <p aria-hidden="true" className="pointer-events-none mt-6 text-center font-display text-[24vw] leading-[0.75] text-foreground/[0.05] select-none" style={{ fontStretch: "75%" }}>
        ROASTR
      </p>
    </footer>
  )
}
