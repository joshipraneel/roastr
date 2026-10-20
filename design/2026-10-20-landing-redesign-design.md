# Roastr landing page redesign

Date: 2026-10-20
Status: draft, awaiting approval

## Intent

Rebuild the Roastr landing page (https://joshipraneel.github.io/roastr/) with a modern component and motion stack, as an experiment in how well Claude can design a site from library components (shadcn/ui registries, Lenis, GSAP). If it turns out well it replaces the live site.

The current page is one hand-written `docs/index.html`: correct content, warm red-on-cream look, but static. The new page should feel like three things at once:

- **Cinematic:** scroll-driven scenes that tell the story of the app (2 a.m. doomscroll, then the morning alarm).
- **Loud and punchy:** giant kinetic type, a marquee of roasts, the voice of the app.
- **Polished:** smooth scroll, clean layout, nothing janky.

## Goals

- Same content and facts as today's page and README, reordered into a story.
- Replaces the live GitHub Pages site at the same URL.
- Works well on a phone (most visitors arrive on Android to download the APK).
- Light and dark mode, like today.

## Non-goals

- No new copy claims or features beyond what README.md states.
- No backend, analytics, cookies, or trackers. The app's pitch is "no internet, no analytics"; the site must not contradict it.
- No CMS, blog, or extra pages.

## Anti-goals (failure even if it works)

- Download button hard to find, or more than one scroll away on first load.
- Scroll-jacking that makes the page feel slow or traps the user, especially on mobile.
- Heavy page: a visitor on mobile data waits on JS before seeing the headline.
- Looks like a generic AI template.
- Breaks existing URLs: `/roastr/privacy/`, `/roastr/screens/*.png` (README and og:image link to them), `/roastr/icon.svg`.

## Decisions made with the user

- **Hero:** "cream with red hits". Cream background with the current soft red glow; giant headline "ROASTED OFF YOUR PHONE." with "PHONE." in red; subline "Your screen time report is too polite. Roastr is not."; red Download for Android button; tilted phone mockup on the right with roast bubbles popping out of it; red marquee band of roast lines across the bottom of the hero. On phone width the phone mockup drops below the headline.
- **Section flow** (approved as proposed):
  1. Hero (above).
  2. **2 a.m. scene.** Page turns dark. Phone pins in the centre. As the user scrolls, a reel counter ticks up to the limit, the corner pill goes green, yellow, red, and a roast types itself out ("The reels will be there tomorrow. Stop.").
  3. **Morning scene.** Background fades dark to cream like sunrise. Alarm phone shakes; the maths mission solves itself on scroll. "Three maths sums or 30 real steps."
  4. **Everything it does.** The six features from README as a bento grid, with real screenshots from `docs/screens/` inside the larger tiles. Tiles stagger in.
  5. **Four languages.** Loud red band; the same roast swaps between English, हिंदी, मराठी and ಕನ್ನಡ in place.
  6. **Private by design.** Calm. Three short statements (stays on your phone, counts doesn't read, delete anytime) and the privacy policy link.
  7. **Closing roast and install.** "Still scrolling? That's kind of the problem." Then the Download button, the three install steps, and the releases link. Footer as today.
- **Deployment:** replace the live site on GitHub Pages.

## Stack (Claude's call, based on research)

- Vite + React + TypeScript, set up with `npx shadcn@latest init -t vite` (shadcn CLI 4.x, Tailwind v4, React 19).
- shadcn MCP server for Claude to search and install components, using the built-in registries (`@magicui`, `@react-bits`, `@tailark`, `@aceternity`, etc.). Components are copied into the source, so no runtime dependency on the registries.
- Anthropic `frontend-design` plugin to steer visual choices.
- `lenis` for smooth scroll, `gsap` + `@gsap/react` (ScrollTrigger, SplitText) as the **only** animation engine. Lenis is driven from `gsap.ticker`. No Motion / Framer Motion, to avoid two animation loops.
- Fonts: keep Inter (Google Fonts, as today) unless frontend-design suggests a display face for the headline; self-hosting is fine.

## Deployment (Claude's call)

GitHub Pages is set to "deploy from branch `main`, folder `/docs`" (legacy build, no Actions). Keep that.

- Source lives in a new top-level `site/` folder.
- `vite.config.ts`: `base: '/roastr/'`, `build.outDir: '../docs'`, `emptyOutDir: true`.
- Everything that must survive at the same URLs moves into `site/public/`: `icon.svg`, `screens/*.png`, `privacy/index.html` (copied as-is), `.nojekyll`. The build then reproduces the full `docs/` folder.
- The built `docs/` is committed. Release = `npm run build` in `site/`, commit, push.
- Keep the existing `<title>`, meta description and og tags (og:image stays `https://joshipraneel.github.io/roastr/screens/2-home.png`).

## Constraints

- **Reduced motion:** with `prefers-reduced-motion: reduce`, no Lenis, no pinning, no scrubbed scenes; sections render as static end states.
- **Mobile:** 16px side gutter, no horizontal scroll. Pinned scenes must be short enough on phones that they don't feel like a trap; Lenis leaves touch scrolling native (its default).
- **No-JS / slow JS:** the hero headline, subline and Download button must be in the HTML and visible before animation code runs (animate from a visible state, or hide only once JS is ready).
- **Accessibility:** real text (not images) for headlines and roasts; marquee and swapping text hidden from screen readers with a static equivalent; colour contrast at least as good as today's page.
- **Content:** all copy comes from README.md and today's `docs/index.html`. Roast lines come only from the app's wordlists (see "Roast lines" below).
- **Dark mode:** follows system setting, like today (same palette tokens: light `#fbf7f6 / #1d1415 / #c62828`, dark `#0f0c0c / #f4ecea / #ff5252`).

## Roast lines: a different roast on every visit

User asked for this: each refresh or new visitor should see different roasts.

- **Source:** the shipped 1.0 wordlists in the app repo, `C:\Users\cheta\Desktop\harasser\wordlists\roast_<l>.md` for `en`, `hi`, `mr`, `kn`. Columns: `# | Text | Romanized | Meaning (English) | Spice | Context`. These are the audited lines (no hard swearing, slurs or family insults). Do not use `roastr-staging`; it holds older, pre-audit copies.
- **Pool:** extract `mild` and `spicy` lines only (skip `harasser`, since the website is public and its visitors haven't picked a spice level) into `site/src/roasts.json` as `{lang, text, meaning, ctx}`. Do this with a small script in `site/scripts/` that reads the wordlists, so the pool can be regenerated after the app adds lines. Commit the JSON. Roughly 600 lines is far more than needed; it's fine to cap each context at about 40 lines per language to keep the file small.
- **Per visit:** on page load, pick lines at random by context:
  - hero bubbles and marquee: `doom` and `busted` lines, English;
  - 2 a.m. scene typed roast: one `doom` line, English;
  - morning scene: one `wake` line, English;
  - closing roast: one `doom` or `streak` line, English;
  - languages band: one line each in हिंदी, मराठी and ಕನ್ನಡ, shown in its own script with the English meaning underneath (the lists are not line-for-line translations, so the band shows four different real roasts rather than one roast in four languages).
  - No two slots on the same page show the same line.
- **Static HTML fallback:** the hero written into `index.html` uses "The reels will be there tomorrow! Stop!" (en #87). JS may swap the bubbles after load; the headline never changes.
- **Not doing:** writing new roast lines, playing the voice clips, remembering which lines a visitor has already seen. Add later if wanted.

## Calls made by Claude after review (user to check)

- **Dark mode and the scenes.** The hero and the non-scene sections follow the system theme (cream in light, `#0f0c0c` in dark). The 2 a.m. scene is always near-black whatever the theme. The morning scene ends cream in light mode and in dark mode ends on a warm dim surface (`#1a1414`) with a red-orange sunrise glow, so the transition still reads without flashing a dark-mode user with cream.
- **README-only content.** The trust line "Free · Android 12+ · No account, no ads, no internet · 18+" sits under the hero Download button and again in the closing section. The install section adds "To update, install the newer APK over the old one. Your stats are kept." and the Android 14+ full-screen alarm note in one line. The permissions table, FAQ and SHA-256 fingerprint stay in the README, linked from the install section ("Permissions, FAQ and checksum on GitHub"). "Same content and facts" means nothing on today's page is lost; README-only extras are linked, not duplicated.
- **JS weight.** The hero (headline, subline, Download button, trust line, phone with a static screenshot) is written directly into `index.html` so it shows before any JS runs; React mounts over it. Below the hero, content may need JS. Target about 150 KB of gzipped JS total; the scroll scenes may be loaded lazily if the budget is tight.

## Left to the builder

- Exact component choices from the registries, spacing, type scale, animation timings and easings.
- How the reel counter, alarm and maths mission are drawn (HTML/CSS recreations vs screenshots).
- Exact per-context caps for the roast pool, and how the language band animates between lines.

## Done when

- `npm run build` in `site/` produces a `docs/` that serves correctly from a local static server under `/roastr/`.
- Old URLs still resolve: `/roastr/`, `/roastr/privacy/`, `/roastr/screens/2-home.png`, `/roastr/icon.svg`.
- Checked in Chrome at desktop and phone width, light and dark, and with reduced motion: no console errors, no horizontal scroll, Download visible on first load.
- The user has looked at it locally and approved before anything is pushed.
