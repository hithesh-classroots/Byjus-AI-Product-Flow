# Byjus.AI — Product Flow handover

Live: https://byjus-ai-flow.vercel.app — opens the Product Flow.

Screens (each links to the others):

1. Onboarding — `Onboarding.html`
2. Home — `Home Page.html` · dark: `Home Page - Dark.html` (opens straight to Home; "Restart demo" in the profile menu goes to Onboarding)
3. Chapter Journey — `Chapter Journey.html` · dark: `Chapter Journey - Dark.html`
4. Teaching Room (Spark) — `Teaching Room Spark.html` · dark: `Teaching Room - Dark.html` · original: `Teaching Room.html`
5. Practice Room — `Practice Room.html`
6. Assessment — `Assessment.html`
7. Profile — `Profile.html`

In `Product Flow.html`: numbered pills, ‹ › buttons or keyboard arrows move between steps; **Dark** toggles the dark variant where one exists; ↗ opens the current screen on its own.

## How it's built
Pages were originally self-unpacking bundles (every page carried its own copy of fonts, scripts and the lesson video). They are now unpacked: each page is a normal HTML file and shared files live alongside them as `asset-*` files (the video is `lesson-video.mp4`) (content-hashed names, cached for a year via `vercel.json`). The lesson video streams instead of downloading up front.

Needs a web server (Vercel, or `npx serve .` locally) — double-clicking the files no longer works in every browser.

**Internet** is needed for React, the Tabler icon font and Vyom's live animation (all from public CDNs).

## Known gap
Chapter Journey expects chapter illustrations at `icons/sm-Realnumbers.png`, `sm-Polynomials.png`, `sm-Pair-of-Linear-equations.png`, `sm-Triangle.png`, `sm-Statistics.png` — not yet supplied.
