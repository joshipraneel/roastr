type ClassValue = string | false | null | undefined | Record<string, boolean | undefined>

// clsx-style join. No tailwind-merge: callers here never pass conflicting
// utilities, and it saved ~7 KB of gzipped JS.
export function cn(...values: ClassValue[]) {
  return values
    .flatMap((v) => (!v ? [] : typeof v === "string" ? [v] : Object.keys(v).filter((k) => v[k])))
    .join(" ")
}
