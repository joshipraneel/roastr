import { SmoothScroll } from "@/lib/motion"

export default function App() {
  return (
    <SmoothScroll>
      {["Hero", "2 a.m.", "Morning", "Features", "Languages", "Privacy", "Closing"].map((s) => (
        <section key={s} className="grid min-h-svh place-items-center border-b text-4xl font-black">
          {s}
        </section>
      ))}
    </SmoothScroll>
  )
}
