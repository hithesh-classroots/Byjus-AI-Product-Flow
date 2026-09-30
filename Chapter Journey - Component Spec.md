# Chapter Journey — Component Spec

Reusable components for the **Byjus.AI Chapter Journey** (cosmic Petrova-trail map + drill-in). Captures variants, states, and tokens so these can be reused consistently on future pages. Source: `Byjus.AI Chapter Journey.dc.html`.

---

## Design tokens

### Status color system (single source of truth — `vis()` + `buildArt()` palettes)
| Status | Meaning | Base | Light | Dark | Rim | Spot | Glow RGB | Glow α |
|---|---|---|---|---|---|---|---|---|
| `done` | Completed | `#12b886` | `#96f2d7` | `#0b7a5c` | `#c3fae8` | `#63e6be` | `99,230,190` | 0.50 |
| `ongoing` | In progress | `#3b8ef0` | `#a5d8ff` | `#1864ab` | `#e7f5ff` | `#74c0fc` | `116,192,252` | 0.62 |
| `new` | Upcoming / locked | `#7c828a` | `#b8bdc4` | `#40464d` | `#dee2e6` | `#adb5bd` | `150,140,200` | 0.30 |

### Space canvas
- Background: `radial-gradient(ellipse at 30% 12%, #2a2360, #141138 46%, #0a0918 100%)`
- Body base: `#0b0a1e`

### Motion timings
- Planet bob: `cjBob`, 3–4.5s ease-in-out (per-planet duration/delay), −7px
- Trail shimmer: `cjShim`, 3.6s (opacity .5↔.95)
- Pulse ring: `cjPulseR`, 2.4s (scale .72→1.72, fade out)
- Here-marker bob: `cjHere`, 2.6s (−4px)
- Star twinkle: `cjTwinkle`, 2–6s (per-star)
- Hover lift: 0.22s cubic-bezier(.2,.8,.3,1)
- All disabled under `prefers-reduced-motion`

### z-index by status
`new` 6 · `done` 8 · `ongoing` 10 · **current** 14 · hover 60 · tooltip 70

---

## Revision 2 — layout, ribbon & particle field
- **Layout:** planets are now **equally distributed** horizontally (`startX 320 · step 312 · endPad 320`), not size/status-spaced. Order still done→ongoing→locked.
- **PetrovaTrail:** smoother **structured curve** — single long-wavelength sine (`contentW/2.6`) + gentle 2.35× harmonic; constant-width ribbon (offset edges, no jagged wobble); sampled every 8px. Fill gradient now **darkens in hue** toward locked (`#12b886 → #1c7ed6 → #2b3a8f → #171a45 → #070512`, opacity rising to .8) so the ribbon itself goes dark, not just transparent.
- **Locked planets** (`new`): darker desaturated charcoal palette (`base #464b54 · dark #23262d`), glow α 0.24 / opacity 0.3. **Lock icon centered** on the sphere (40px glass disc), replacing the corner badge.
- **Particle field:** multi-lane — every dot rides the centerline path offset by `laneY` (cube-biased so most sit in the **center lane**, few near edges, span = `maxSize/2 + 26`). Count `max(220, contentW/20)`, half-speed travel (16–36s).

---

## Map components

### 1. PlanetNode — the chapter planet
## Revision 11 — First-time user experience (FTUE), cross-page
One-time guided flow spanning Teaching Room → Chapter Journey → Home → Chapter Journey, driven by `localStorage`. Gated so non-FTUE opens of every page are untouched.

**State (localStorage):** `ftueStage` = `arrival` | `setup` | `final` (drives which page resumes what); `chapterJourneyFtueCompleted='true'` locks it out after Not-now / completion; `learningFlowSetupStatus`, `ftueResumeModule`. All reduced-motion aware.

| Component | Page | States |
|---|---|---|
| **Teaching-room transport** | Teaching Room | on module-complete celebration: copy → "First module complete!" / "Let's see where your journey continues"; sets `ftueStage=arrival` (only if not completed) then navigates to Journey. `_celT5` timer. |
| **FTUE data override** | Chapter Journey | when `ftue` set, Chapter 4 = sole active (done→ongoing, 1 module done), all others locked — brand-new-student journey. `buildModules` forces Ch4 doneMods=1 (M1 done, M2 active, static per decision). |
| **ArrivalSequence** (`.ftue-arrival`) | Chapter Journey | phase 1 lock shown · 2 lock opens · 3 lock lifts + 3 `.ftue-ring` ripples (teal→blue, celebratory) + glow · 4 Vyom lands · 5 camera-zoom (reuses `open(4)`) into module view. Timed, reduced-motion collapses. |
| **IntroModal** (`.ftue-modal`) | Chapter Journey | no close icon, no outside-close, dim+blur behind. Step 1 Vyom "Hi, I'm Vyom…" · 2 Spark slides in "Hi, {name}!…" · 3 Spark exits, Vyom + two CTAs (Set up my learning flow / Not now). |
| **Branch A — Not now** | Chapter Journey | sets completed, closes modal, stays on module view (Module 2 active). |
| **Branch B — Set up** | → Home | sets `ftueStage=setup`, navigates to Home. |
| **FtueSetup questionnaire** (`FtueSetup` in app-cosmos.js) | Home | reuses chat visual language (Vyom header, bubbles, quick-reply chips). Q1 goal (+conditional Q1b test-date / stuck-point), Q2 session length (+confirm), Q3 study time → "Perfect…" → loading. Returns null unless `ftueStage=setup`. |
| **PersonalisedLoading** | Home | spinner + "Setting up your personalised learning flow" + cycling messages (~4.2s) → sets `ftueStage=final` + completed, navigates to Journey. |
| **FinalJourney** (`_ftueFinal`) | Chapter Journey | Ch4 focused; Vyom rests above with speech "Your learning flow is ready!…"; **Resume learning** CTA (`.ftue-resume`) → opens Module 2 in Teaching Room, clears FTUE. |

- **Gating:** default (no `ftueStage`) → every page renders normally; FTUE code paths are inert. Teaching Room only arms the flow when `chapterJourneyFtueCompleted!=='true'`.
- **Page hops are reloads** (separate files) masked by matching dark fades; in-page beats (unlock, camera-zoom) are smooth.

---

## Revision 10 — Library mode + chapter card + 50% hero growth
- **RightPanelModes** — segmented control (`.cd-seg`, Learning Journey | Library) pinned **below the back button, right-aligned**; active tab filled with chapter accent; cross-fades (`.cd-modeview` cdFade). Default Journey; scroll resets to top on switch. States: journey · library.
- **LibraryView** — two labelled sections (Videos, Applets) as an auto-fit card grid (`.cd-grid` `repeat(auto-fill,minmax(198px,1fr))`); tiles = 16:9 gradient thumb + type icon + title + meta; completed videos get a check. No connectors. Chapter-lock blur + lock cover carry over both modes.
- **ChapterCard** (`.cd-card`) — chapter details (eyebrow, H1 name, module pill, XP/Orbs) now on a glass card (rgba(20,16,38,.62), radius 20, blur, shadow), centered.
- **CameraZoom growth** — selected planet grows **×1.5** (`_cam.scale = 1.5`, was fixed 240px target). Park x is measured from the live `.cd-left` center at camera time (not a guessed %), so planet + card share the panel's exact center across responsive widths (44%/38%). `camHy = vh·0.36`.
- **Chapter-details hint** — the map's "Scroll to travel…" hint hides (`hintOpacity 0`) while a chapter is open.

---

## Revision 9 — single-scene camera-zoom to module view (replaces two-page morph)
The map and module views are now **one continuous scene** — the earlier two-page + fixed-ghost approach caused 3 planet copies and a coordinate-broken ghost (fixed element trapped in a transformed ancestor). Diagnosis + fix:

| Component | What | States |
|---|---|---|
| **SingleScene** | one map scene always mounted (`isMap` always true); no separate chapter page, no ghost | idle · zooming · settled |
| **CameraZoom** (`_applyCamera` on `.cj-stage`) | `transform: translate + scale` with `transform-origin` at the clicked planet's stage-local center, flying it to the hero park (`hx≈vw·0.2, hy≈vh·0.4`, target size 240 → S=240/planetSize). The petrova line + all planets scale/translate **with** it (anchored zoom). `.cj-scrollx` overflow frozen during zoom. | `in` (0.74s cubic-bezier .5,0,.2,1 → auto-advances to `settled` after 760ms) · `settled` · `out` (0.6s reverse → clears active) · reduced-motion (instant) |
| **ModuleOverlay** (`.cd-overlay`) | `position:fixed; inset:0` transparent overlay over the zoomed scene; **left** = Chapter N / name / "X of Y modules" / XP+Orbs (spacer pushes text below the parked hero planet showing through); **right** = module path (scrim bg, scrollable). `pointer-events:none` root, `auto` on right panel + back. | hidden (opacity 0 while `in`) · shown (opacity 1 at `settled`, 0.38s fade) |
| **SceneDim** | on zoom: non-selected planets → opacity 0, selected stays, trail → 0.34; selected planet's stars/ring/pct suppressed | — |

- **Key fixes vs. broken morph:** (1) the clicked planet is the *same DOM node* throughout (no duplicate); (2) no `position:fixed` ghost, so no transformed-ancestor coordinate bug; (3) `_adjustShift`/`_centerNow` guarded with `if (this.state.active != null) return;` so they don't fight the camera transform.
- **Runtime note:** this project's older `support.js` does not hot-swap newly-added class methods onto the live instance — a full reload (show_html) is required after adding a method for it to take effect. (Cost us a debugging loop; documented so future edits force a reload before testing new methods.)
- **Navigation:** module pods → Teaching Room (unlocked) / inline lock message (locked); back reverses the camera.

---

## Revision 8 — chapter iconography (stars/crown, progress ring, tuned ripple)
- **Completed planets:** replaced the tick badge with a **3-star rating** above the planet (center star larger); collected stars glow gold `#ffd43b`, uncollected are dull `#4a4763`. Star count from mastery (`≥85→3, ≥68→2, else 1`).
- **Crown:** a golden `ti-crown` appears above the stars for "incredible" performance (`mastery ≥ 90`), gentle float (`cj-crown`).
- **In-progress planets:** an **orange (`#ff922b`) ring-chart** around the sphere (SVG circle, `stroke-dasharray` = pct·circumference, rotated −90°, rounded cap, glow) + a `{pct}%` pill below. Track is faint white.
- **Ongoing ripple (`cjPulseR`):** expansion reduced ~20% (max scale 1.72→1.52) and speed +20% (2.4s→1.9s).
- **States (PlanetBadge):** done → StarRating (0–3 filled) [+Crown if incredible] · ongoing → ProgressRing (orange, pct) + %pill + ripple · locked → centered lock disc.

---

## Revision 7 — card row rhythm + stage auto-shift
- **Uniform card rows:** all vertical gaps between the 5 rows (eyebrow · name · stat tiles · modules+bar · CTA) set to a single **23px** rhythm; content nudged up via `cardPadTop = size·0.5 + 14` (was +24).
- **Stage auto-shift (`.cj-stage`):** when a hover card is open, `_adjustShift()` (called in `componentDidUpdate`) measures the card's edges (incl. 34px glow padding) against the frame and keeps a **≥30px margin on all four sides** — bottom (translate up), left and right (translate horizontally). The entire stage — Petrova line, planets, particles, all associated elements — translates smoothly to accommodate. Reverts to `translate(0,0)` on leave. Transition `transform .42s cubic-bezier(.42,0,.58,1)` (ease-in-out). States: `rest` (0,0) · `lifted` (dx,dy). **[REQUIREMENT: document this in the page's UI requirement doc.]**

---

## Revision 6 — hover card upgrades + 150% scale
- **Global sizing ×1.5** ("150% zoom" feel): planet size `clamp(144, 144+count·1.95, 294)`, step 468, startX/endPad 400; done-badge 36px, lock disc 60px, card typography enlarged. Excluded: top progress bar, close button, bottom scroll hint.
- **Antigravity is now group-wide:** hovering index `hi` shifts the entire left group by `−168px` and the entire right group by `+168px` (constant `D`), preserving intra-group spacing (not just immediate neighbors).
- **Focus dimming:** on hover, the Petrova trail drops to `opacity .4` and every non-hovered planet to `.38`; hovered planet scales to **1.15**.
- **BorderGlow** softened: sweep slowed to 13s, outer glow layers reduced (dropped the 25/50px halos).
- **Card content:** eyebrow "Chapter N" (unit removed) · name · two stat tiles (**XP earned** ⚡, **Orbs** ◎) · **Modules {done}/{count}** with a progress bar · CTA (Explore more / Locked). Width 392. Data: `xp = done·35 + mastery·1.5`, `orbs = ⌊done/3⌋` (derived in `vis()`).

---

## Revision 5 — Planet hover card (BorderGlow + antigravity)
Hovering a planet grows a **card that forms around it** (planet at top-center, info stacked below), pushes neighbors away, and lights a status-colored animated border. Replaces the old text tooltip.

| Component | Class | Variants | States |
|---|---|---|---|
| **PlanetHoverCard** | `.border-glow-card` + `.glow-{done/ongoing/locked}` | unlocked (Explore more CTA) · locked (Locked pill) | `hidden` (default) · `shown` (hover, `cjCardIn` grow-in) — planet sits at top-center, eyebrow (Chapter N · Unit) + name + "{count} modules" + CTA below |
| **BorderGlow** | `::before` (mesh-gradient border, conic mask) + `.edge-light` (outer glow) | glow hue by status (teal/blue/grey via `--glow-color*`) | `sweeping` (`--cursor-angle` animated 6s via `@property`), driven by `--edge-proximity` (100 when shown) · off (reduced-motion) |
| **PlanetCTA** | `.cj-cta` | done (teal grad) · ongoing (blue grad) | default · hover (brighten+lift) · active |
| **Antigravity push** | `--push` on `.cj-planet` | — | neighbors translate away from hovered, linear falloff over 560px (max 165px), eased `transform .34s`; hovered planet z=300 |
- **Interaction:** JS `hover` state via `onMouseEnter/onMouseLeave` (card is a descendant of `.cj-planet`, so moving onto it keeps hover; CTA stays clickable). Reference: BorderGlow + Antigravity (React Bits) — recreated in pure CSS/JS (no three.js).
- **Tokens:** border-radius 22 · glow-padding 34 · cone-spread 24 · edge-sensitivity 26; card bg `#141026`, width 266.

---

## Fluid variant (`Byjus.AI Chapter Journey - Fluid.dc.html`)
Alternate treatment adapting a reference GIF: the trail becomes a glowing **spectrum fluid ribbon**. Same journey logic/data/drill-in as the base page; only the map background + trail differ.

| Component | What | Variants | States |
|---|---|---|---|
| **FluidTrail** | wide rounded-cap stroke of the centerline with a rainbow `fluidGrad` (magenta→purple→blue→cyan→green→yellow); blurred glow copy + white gloss highlight; whole group `hue-rotate` cycles the spectrum | — | `flowing` (hue-shift 16s) · fade-to-locked (horizontal `fluidFade` mask → 0.12 past frontier) · frozen |
| **FlowLine** (`.cj-flow`) | 5 thin white streaks inside the ribbon, lane-offset (translateY ±62), animated `stroke-dashoffset` | fast/slow (`--fl` 6–9s) | `flowing` · off |
| **FrontierOrb** (`.cj-orb`) | bright radial head (`orbGrad`) + blurred halo at the current frontier (leading edge of ongoing zone) | — | `pulse` (opacity) · static |
| **Background** | flat navy radial + faint far/mid stars only (gif-faithful; no nebula/shapes/comets/celestial) | — | twinkle · frozen |
- **Spectrum tokens:** `#ff3ea5 · #b14bff · #4d7cff · #2bd4c4 · #57e389 · #ffe14d`; ribbon width `maxSize+66`, orb r `ribW·0.5`.
- **Semantics kept:** planets retain status colors (teal/blue/grey) + check/lock badges over the vibrant ribbon; the frontier orb marks "you are here", the dim tail = not-yet-reached (locked).

---

## Revision 4 — Celestial bodies (JWST-inspired deep layer)
Flat-graphical (gradient-only) far-space bodies + color clouds behind the ribbon, all parallaxing and dimming toward locked space. Never overpower the Petrova line (opacity ≤ ~0.5, edge-cropped into top/bottom margins).

| Component | Class | Variants | States |
|---|---|---|---|
| **CelestialBody** | `.cj-body.cj-drift` | `planet` (radial sphere + rim) · `ringed` (sphere + gradient ring ellipse) · `galaxy` (soft elliptical core, `.cj-spin`) | `drift` (slow translateY) · `spin` (galaxy only) · parallax(0.05) · `dim-at-locked` (op × `1−0.4·frac`) · frozen |
| **RimGlow** | (box-shadow on body fill) | crescent limb (`inset` offset) + outer halo | static; JWST limb-light in off-palette hue |
| **GlowCloud** | `.cj-cloud.cj-breathe` | amber / gold / teal / rose (JWST palette) | `breathe` (opacity+scale) · parallax(0.09) · dim-at-locked · frozen |
| **DiffractionSparkle** | `.cj-spark` | 8-point (two crossed gradient bars) | `twinkle` (cjTwinkle) · parallax(0.4, with near stars) · off |

- **Off-palette hues** (so they add color without clashing with the teal→blue→violet ribbon): dusty amber `#c8935e`, muted rose `#b56b8a`, pale cyan `#6fb3c4`, indigo `#4a4a95`, pale-violet galaxy. Clouds: `255,170,90` / `255,205,120` / `90,200,190` / `200,120,160`.
- **Parallax stack (back→front):** SpaceCanvas(0) → CelestialBody(0.05) → GlowCloud(0.09) → far★(0.15) → mid★(0.24) → near★+Sparkle(0.4) → DepthShapes(0.06) → comets → Petrova + planets.
- **Placement rule:** bodies biased into top/bottom margins and partially edge-cropped for scale; kept out of the ribbon's vertical center so the trail stays dominant.

---

## Revision 3 — WebGL background layer system
The flat CSS radial nebula is replaced by a **Background Layer System** (stacked, each with defined states + a shared cosmic hue ramp). z-order: SpaceCanvas(0) → StarLayer far(1)/near(2) → DepthShapes(3) → Vignette(4) → journey content(10) → chrome(30).

| Component | What | Variants | States |
|---|---|---|---|
| **SpaceCanvas** (`canvas.cj-gl`) | real WebGL fragment-shader nebula (FBM domain-warp), fixed to viewport, opaque base | cosmic | `live` (rAF) · `frozen` (reduced-motion → single frame at t=8s) · `fallback` (no WebGL → CSS radial gradient on root stays) |
| **DepthShapes** (`.cj-shape.cj-float`) | 6 blurred gradient rounded-rects drifting in depth (ShapeHero-style) | teal / blue / violet / indigo / cyan / deep-void | `float` (drift+rotate) · `static` (reduced-motion) |
| **StarLayer** (`.cj-starL1 / .cj-starL2b / .cj-starL2`) | 3 parallax star fields for deep-space depth | far / mid / near | twinkle · parallax(0.15 / 0.24 / 0.4) · frozen |
| **CometStreak** (`.cj-comet`) | thin glowing streak crossing the frame, periodic | short / long (len 90–180px), angle 14–32° | `streaking` (linear, constant-speed travel over ~20% of cycle) · `idle` (invisible gap, ~80% of cycle) · `off` (reduced-motion). Position is linear-in-time (0.05·dist per %) so speed never varies; fades in by 2%, out by 20%. |
| **Vignette** | radial edge darken over canvas | — | static |

- **Scroll → hue:** the shader reads `uScroll` (0→1 = normalized `scrollLeft`). Hue ramps **teal `#12b886` → blue `#1c7ed6` → violet `#5b3f9e`**, brightness `0.85 → 0.10`, base deep-space darkening — so travelling toward locked chapters literally darkens into unknown space. Nebula also drifts horizontally with `uScroll` for parallax.
- **Perf:** DPR capped at 1.5; single fullscreen triangle-strip; 5-octave FBM. Cleaned up in `componentWillUnmount` (cancel rAF + remove resize).
- **Tokens (shader):** teal `(.07,.72,.55)` · blue `(.11,.49,.84)` · violet `(.36,.25,.62)`; base `(.03,.02,.07)→(.008,.006,.028)`.

---

The core element. One per chapter.

- **Status variants:** Completed (teal) · In progress (blue) · Upcoming (grey/dim).
- **Texture archetypes** (`buildArt`, assigned `(id-1) % 4`): `crater` (cratered rock) · `bands` (banded gas-giant) · `ringed` (orbital ring) · `swirl` (storm streaks). All recolored by status palette; Kurzgesagt signature = bright rim arc (top-left) + dark inner shadow (bottom-right).
- **Sizing:** by module count → `clamp(96, 96 + count×1.3, 196)` px.
- **States:**
  - `default` — bob + status glow (α 0.9 done/ongoing, 0.5 new).
  - `hover` — lift (−10px, scale 1.06) + glow to full + tooltip in.
  - `pressed` (`:active`) — settle (−4px, scale .99).
  - `current` — pulse ring + "You are here" marker + z-index 14; auto-centered on load.
  - `focus` — **GAP: no keyboard focus ring yet** (see Future work).
- **Sub-elements:** `.cj-glow`, `.cj-pulsering` (current only), StatusBadge, HereMarker (current), PlanetTooltip.

### 2. PetrovaTrail — wavy-edged pipeline band
Abstract glowing gas river the planets ride down the center of.
- 3 layers: blurred fill (`blur(9px)`) + sharper fill (α .5) + shimmering core line.
- Fade: bright teal → blue → dim grey, left→right (gradient `cjBandGrad`/`cjCoreGrad`).
- Geometry: sine centerline (amp `min(72, vh×0.12)`, wavelength 560) + higher-freq edge wobble; `half = maxPlanetSize/2 + 48`.
- **States:** static fade (default) · shimmer (animated core).

### 3. StarField — parallax backdrop
Two layers spanning the full journey width.
- `starsFar` (~contentW/20, 1–1.8px) parallax ×0.15 · `starsNear` (~contentW/44, 1.6–2.8px + glow) parallax ×0.34.
- **States:** twinkle (per-star) · parallax translate on horizontal scroll.

### 4. PlanetTooltip — hover reveal (names now hidden on-circle)
- **Content:** chapter name + `{done}/{count}` + status label.
- **States:** `hidden` (default, opacity 0) · `visible` (on planet hover).
- **Position variants:** `above` (default) · `below` (`.cj-tip-below`, used for current so it clears the marker).

### 5. ActiveZone — in-progress stretch treatment (replaces HereMarker)
"You are here" was a single-planet pin — wrong for a 3-chapter in-progress band. Instead the whole ongoing stretch is lit: a **pulsing blue aurora column** (`cj-zone`, radial screen-blend glow) spanning `min→max` ongoing-planet x ±160px, with faint boundary edges. All `isOngoing` planets carry the pulse ring; the view auto-centers on the zone midpoint. No text. States: pulse (default) · static (reduced-motion).

### 6. StatusBadge — corner indicator
- `done` → teal check · `new` → grey lock · `ongoing` → **no badge** (marker/glow carries it).
- 24px circle, 2px `#0a0918` ring, top-right.

### 7. Legend — status key
Three glass pills (Completed / In progress / Upcoming), each with a radial status dot. Fixed top-left.

### 8. ScrollHint
Bottom-center "Scroll to travel your learning path" with ← → arrows. Static, non-interactive.

---

## Drill-in components (unchanged this pass — documented for completeness)

### 9. ChapterHeader
Back button · eyebrow (Chapter N · Unit) · title + status pill · Progress stat · Mastery stat · Resume button · progress bar.
- **Resume label variants:** `Start chapter` (new) · `Resume` (ongoing) · `Review` (done).
- **Note:** Resume `onClick` is currently a no-op (`resume: () => {}`) — wire to Teaching Room to match Home's "Resume a class".

### 10. ModuleBead
Serpentine module dot. **States:** `done` (teal check) · `current` (white/blue play) · `locked` (grey number).

### 11. BackButton
Light pill (`← All chapters`), hover `#f1f3f5`. Also reused as the Resume button base class (`.cj-back`).

---

## Future work / consistency notes
- **Focus states:** PlanetNode, beads, and pills need keyboard focus rings (Mantine `focusRing: auto`, 2px primary) for a11y — currently hover-only.
- **Two themes on one screen:** map is dark-cosmic, drill-in is light-Mantine. Intentional context switch, but the drill-in still uses Mantine blue `#228be6` while the map's blue is `#3b8ef0` — align the "in progress" blue across both.
- **Empty/error/loading states** not yet defined for PlanetNode (e.g. data still loading) — add skeleton planet if this ever pulls live data.
- Ties into the earlier **Component Inventory** flags (badge vocabulary, radius scale, primary-color drift).
