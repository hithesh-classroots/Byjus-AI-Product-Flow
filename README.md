# Byjus.AI — Product Flow

Clickable walkthrough of every main screen, from onboarding to profile.

## Open it

**Online (recommended):** push this folder to a GitHub repo, then turn on **Settings → Pages → Deploy from branch → main / root**. Share the Pages link. It opens `index.html`, which goes straight to the Product Flow.

**Locally:** the pages load each other, so they need a web server; double-clicking a file will not work.

```
npx serve .
# or
python3 -m http.server 8000
```

Then open http://localhost:8000.

## What's inside

Screens (in flow order):

1. `Onboarding.dc.html`
2. `Home Page.dc.html` · dark: `Home Page - Dark.dc.html`
3. `Goal Page.dc.html`
4. `Chapter Journey - L&P.dc.html` · dark: `Chapter Journey - Dark.dc.html`
5. `Teaching Room Spark.dc.html` · dark: `Teaching Room - Dark.dc.html` (+ `Teaching Room.dc.html`)
6. `Practice Room.dc.html`
7. `Assessment.dc.html`
8. `Profile.dc.html`

Shell: `Product Flow.dc.html`. Use the step pills, ‹ › or the arrow keys; **Dark** toggles dark versions where they exist.

Supporting files:

- `support.js`: runtime that every `.dc.html` page needs.
- `app-cosmos.js`, `app-cosmos-dark.js`: the Home page app.
- `nav-rail.js`, `mobile-nav.js`: the icon rail and phone nav.
- `canvas-bg.css`: the shared lavender page background.
- `applet-inline.js`, `image-slot.js`, `content-canvas/`: lesson board pieces.
- `vyom.riv`, `vyom-rive.js`, `vyom-mascot.png`: Vyom's animation, loader and still image.
- `spark-mascot-sm.png`, `max-mascot-sm.png`, `aarav-avatar.png`, `logo.png`: characters, avatar and logo.
- `icons/`: the five chapter-island badges.
- `lesson-video.mp4`: the Teaching Room video.
- `_ds/`: the Mantine design-system styles and component bundle.

## Notes

- Keep `.nojekyll` in the repo root. Without it, GitHub Pages hides the `_ds/` folder and the styles break.
- File names contain spaces and `&`. Keep them as they are; the pages link to these exact names.
- An internet connection is needed for the Tabler icon font and the Rive runtime, which load from CDNs. Without it, Vyom falls back to his still image.
- `lesson-video.mp4` is under GitHub's 100 MB file limit, so plain git works with no LFS needed.
