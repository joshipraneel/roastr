import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Eyebrow, title and lede: how every section on the page opens.
export function SectionHeader({
  eyebrow,
  title,
  lede,
  className,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-display-lg text-balance">{title}</h2>
      {lede && <p className="mt-5 max-w-[56ch] text-lede text-pretty text-muted-foreground">{lede}</p>}
    </div>
  )
}
