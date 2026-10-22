import { BatteryMedium, Signal, Wifi } from "lucide-react"

// The Android status bar drawn inside device screens.
export function PhoneStatus({ time, className = "" }: { time: string; className?: string }) {
  return (
    <div className={`flex h-7 items-center justify-between px-5 pt-1 text-[11px] font-semibold text-white/90 tabular-nums ${className}`}>
      <span>{time}</span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <Signal className="size-3" />
        <Wifi className="size-3" />
        <BatteryMedium className="size-3.5" />
      </span>
    </div>
  )
}
