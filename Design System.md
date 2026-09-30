# Byjus.AI — Design System

Scanned from the shipped product pages: `Home Page.dc.html` + `app-cosmos.js`, `Teaching Room.dc.html`, `Chapter Journey.dc.html`, `Onboarding v2.dc.html`.

The system is a **Mantine-derived** palette (10-step hue scales, hairline borders, soft layered shadows, system font stack) with three product-specific departures: a **lavender→cream page canvas** instead of Mantine's flat white, **violet-tinted shadows** instead of neutral black, and a **character colour language** (Vyom = violet, Spark = yellow).

---

## 1. Foundations

### 1.1 Page canvas

One gradient, on every page — this is the product's most recognisable surface.

```css
linear-gradient(180deg, #eee9fd 0%, #f8f5fe 46%, #fdfaf0 100%)
```

Pale purple → near-white lavender → pale cream. Exposed as `CANVAS` in `app-cosmos.js`; written literally in each `.dc.html`.

**Dot lattice** overlays the canvas on Home, Chapter Journey, and Onboarding:

```css
background-image: radial-gradient(rgba(96,74,190,.13) 1px, transparent 1px);
background-size: 24px 24px;
```

**Ambient blobs** — two blurred radial washes, top-left violet and bottom-right warm, both under everything:

```css
radial-gradient(circle, rgba(190,170,255,.22), transparent 70%)   /* filter: blur(12px) */
radial-gradient(circle, rgba(255,196,150,.20), transparent 70%)   /* filter: blur(14px) */
```

### 1.2 Colour

**Primary — Mantine blue.** The one saturated accent. CTAs, active states, progress fills.

| Token | Hex | Use |
|---|---|---|
| `BLUE` / blue-5 | `#339af0` | Gradient top of primary buttons |
| `BLUE7` / blue-6 | `#1c7ed6` | Gradient bottom, links, icon accents |
| `BLUE9` / blue-8 | `#1864ab` | Pressed, deep accents |
| `BLUE2` | `#a5d8ff` | Focus rings, active hairlines |
| `BLUE1` | `#d0ebff` | Selected chip fill |
| `BLUE0` | `#e7f5ff` | Tinted panel / featured bubble |

Primary button is always the vertical pair: `linear-gradient(180deg, #339af0, #1c7ed6)`.

**Violet — Vyom / AI.** Every AI surface, every shadow tint.

| Token | Hex | Use |
|---|---|---|
| `VIOLET` | `#7950f2` | Vyom accents, onboarding CTA top |
| `VIOLET9` | `#5f3dc4` | Breadcrumb active, deep violet text |
| `#6741d9` | — | Onboarding CTA bottom, back-button icon |
| `VIOLET2` | `#d0bfff` / `#b197fc` | Hover borders, past-step dots |
| `VIOLET0` | `#f3f0ff` / `#f4f1ff` | Vyom bubble fill, hover wash |
| `#e5dbff` | — | Violet hairline (chat edge, handle border) |

**Yellow/orange — Spark, streaks, goals.**

| Token | Hex | Use |
|---|---|---|
| `TEAL` (misnamed; Spark) | `#f59f00` | Spark accents |
| `TEAL2` | `#ffe066` | Spark highlight |
| `TEAL8` | `#e8590c` | Streak flame, streak text |
| `TEAL9` / goal bar | `#d9480f` | Goals progress fill, goal percentage |
| `#fff4e6` | — | Streak pill fill, Spark bubble |
| `#ffe0b3` | — | Streak pill border |

**Semantic.**

| Meaning | Hex |
|---|---|
| Success | `#40c057` (green-6) · deep `#2f9e44` · fill `#dcf7e1` · border `#b2f2bb` |
| Error / fail | `#fa5252` (red-6) · deep `#e03131` |
| Locked / disabled | `#8f8aa8` icon · `rgba(33,26,74,.09)` fill |

**Text.**

| Token | Hex | Use |
|---|---|---|
| `INK` | `#212529` | Headings, primary text |
| `TXT` | `#343a40` | Body, option labels |
| Deep violet ink | `#211a4a` | Text on canvas (goal statements, chapter titles) |
| Muted | `#5d5880` · `#6b6390` | Secondary text, meta |
| Eyebrow / label | `#6f66a3` · `#7a749b` | Uppercase micro-labels |
| `DIM` | `#868e96` | Icons, placeholders |
| Faint | `#a9a3c4` · `#adb5bd` | Chevrons, future states |

**Neutrals** — cosmic-tinted, not pure grey.

`G0 #f6f5fd` · `G1 #efedfa` · `G2 #e6e3f5` · `G3 #ddd9ee` · `G4 #cdc8e2` · `G5 #a9a3c4`

Structural border is `#dee2e6` (Mantine gray-3) on cards and inputs, `#e6e3f5` on canvas-level chrome.

### 1.3 Type

**One font, pinned.** Roboto is self-hosted and subset — see CCR §2.0, which governs.

```
Roboto, "Helvetica Neue", Arial, sans-serif
```

Weights 500 / 700 / 800, `font-display: swap`. The fallbacks are metric-near, for the swap window only — the product does not render in them.

**8 sizes, 3 weights** — no half-pixel steps, no ad-hoc values.

| Token | Size | Weight | Use |
|---|---|---|---|
| `--fs-display` | 38px | 800 | Celebration headline |
| `--fs-title` | 30px | 800 | Chapter titles, board titles |
| `--fs-heading` | 24px | 700 | Modal titles, onboarding questions |
| `--fs-subheading` | 20px | 700 | Sub-headings, "Locked" |
| `--fs-body` | 16px | 500 | **Default** — bubbles, rows, inputs |
| `--fs-secondary` | 14px | 500 | Meta, chips, buttons |
| `--fs-caption` | 12px | 600–700 | Breadcrumb, badges |
| `--fs-eyebrow` | 11px | 700 | Uppercase labels, `+.08em` tracking |

Weights: `--fw-regular:500` · `--fw-bold:700` · `--fw-heavy:800`.

Headings carry `letter-spacing:-.01em` to `-.02em`. Body line-height 1.4–1.55; headings 1.3.

**Documented exception** — Chapter Journey's decorative chapter numerals are graphic, not text: `--fs-numeral-sm:44px` · `-md:48px` · `-lg:58px`.

### 1.4 Radius

| Value | Use |
|---|---|
| 8px | Segmented-control inner button |
| 10–11px | Small icon buttons, chips, pills, active badges |
| 12px | Logo tile, icon tiles, footer buttons |
| **14px** | **Default card** — resume cards, popovers, inputs, tiles |
| 16px | Bubbles, composer, expanded panels |
| 18–20px | Detail hero, module labels, larger panels |
| 24px | Room-card gutter |
| 999px | Progress tracks, streak pill, avatars |

### 1.5 Shadow

Never neutral black — always violet-tinted, four steps.

```css
SH_XS  0 2px 6px -3px rgba(70,46,146,.16)     /* resting card */
SH_SM  0 6px 14px -8px rgba(70,46,146,.22)
SH_MD  0 10px 24px -12px rgba(70,46,146,.30)
SH_LG  0 14px 30px -18px rgba(70,46,146,.36)  /* popover, raised */
```

Two more special-purpose forms:

- **Soft downward lift** (fill-less chrome — goals and streak widgets): `0 8px 14px -10px rgba(70,46,146,.34)`
- **Coloured button glow**: primary `0 4px 12px rgba(28,126,214,.35)`, violet CTA `0 10px 26px -12px rgba(103,65,217,.6)`

### 1.6 Spacing

Mantine scale: `xs 10 · sm 12 · md 16 · lg 20 · xl 32`.

In practice: 6–9px inside compound controls, 14–18px card padding, 22–28px section gaps, 24–28px page gutter. **Always flex/grid + `gap`**, never margin chains.

### 1.7 Motion

| Duration | Curve | Use |
|---|---|---|
| 120–180ms | `ease` | Hover, colour, background |
| 300–340ms | `cubic-bezier(.2,.8,.3,1)` | Enter/exit, popover |
| 420–600ms | `cubic-bezier(.4,0,.2,1)` | Layer slides, panel travel |
| 700ms | `cubic-bezier(.2,.8,.3,1)` | Progress fills |
| 1.15s | `cubic-bezier(.33,0,.2,1)` | Answer light leak |

Named keyframes: `bob` (mascot idle, 2.6–3.4s) · `popIn` · `riseIn` · `twn` (twinkle) · `dockripple` · `tipRing`. Everything decorative is disabled under `prefers-reduced-motion`.

### 1.8 Icons

**Tabler Icons** webfont — outline, 1.5px stroke, 24px grid.

```html
<link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css">
<i class="ti ti-flame"></i>
```

Sizes: 13–15px inline, 17–20px in controls, 23px in tiles. No emoji as icons (a single 👋 in the greeting is the one exception).

### 1.9 Mascots

| | Vyom | Spark |
|---|---|---|
| Asset | `<vyom-rive>` (live Rive) | `spark-mascot-sm.png` |
| Role | AI tutor — teaches, guides | Study buddy — small questions |
| Colour | Violet | Yellow/orange |
| Bubble | `#f4f1ff` on `#3a3450` | `#fff4e6` on `#8a4712` |
| Idle | `bob` 2.8–3.4s | `bob` +0.4–0.6s delay |

`<vyom-rive>` inflates its canvas by `art-scale` (default 2.5) because the artboard carries transparent padding. **Any fixed-size mount must set `overflow:hidden`** or the art bleeds out of its box.

---

## 2. Components

### 2.1 Buttons

**Primary** — 46–52px tall, radius 11–12px, `linear-gradient(180deg,#339af0,#1c7ed6)`, white 700–800 weight, blue glow. Hover: `brightness(1.07)` + slight scale. Onboarding uses the violet pair instead.

**Secondary** — white fill, `1.5px #dee2e6`, `#343a40` label, `SH_XS`. Hover: `#f3f0ff` wash, border → `#b197fc`.

**Ghost / icon** — 44px square, radius 11px, white, `1px #e6e3f5`, violet icon.

**Text link** — no fill or border, `#5d5880` 600, underline at `3px` offset, `1px` thickness; hover → `#1c7ed6`.

**Nav arrows** (Teaching Room) — 46px squares, chevron only, no label.

### 2.2 Cards

Default: white, radius 14px, `1.5px #dee2e6`, `SH_XS`, 16px padding. Hover raise: `translateY(-2px)` + `SH_LG` + violet border.

**Island / hero surface** — a plain three-stop gradient, no gloss:

```css
linear-gradient(158deg, #ffffff 0%, #fbfaff 48%, #f1ecff 100%)   /* neutral */
linear-gradient(158deg, #ffffff 0%, #f7fdf8 46%, #dcf7e1 100%)   /* completed */
```

**Fill-less chrome** (goals, streak) — no background, no border, only the soft downward lift. Expanding swaps in the canvas gradient plus `0 14px 30px -14px rgba(70,46,146,.28)`.

### 2.3 Inputs

56px tall, radius 14px, white, `1.5px #dee2e6`, `SH_XS`, 18px/600 text, `caret-color:#228be6`, leading icon at 16px.

**Search + dropdown fuse into one component**: while open the field's radius becomes `14px 14px 0 0`, and the panel is pinned at `top:54.5px` (field height minus its border) with `border-top:none` and radius `0 0 14px 14px`, so the two hairlines overlap into one.

### 2.4 Chips & options

Option row: 15×17px padding, radius 14px, white, `1.5px #dee2e6`. Selected adds `.on` — `#d0ebff` fill, blue border, blue label, check icon.

Pills: radius 999px, 8×14px padding, tinted fill + matching border (streak = `#fff4e6` / `#ffe0b3`).

### 2.5 Progress

**Bar** — 5–6px tall, radius 999px, track `rgba(33,26,74,.13)`, fill the semantic colour, `width` transition 700ms.

**Module bar with step nodes** (Teaching Room) — a track with one dot per step, first and last on the ends. Completed nodes filled, upcoming nodes the track colour. A travelling tip (`.tr-tip`) rides the fill with three staggered looping rings, hidden by class at rest.

**Milestone dots** (Onboarding) — 7px dots, active one stretched to 20px; violet-7 current, violet-3 past, `#dcd8e6` future.

### 2.6 Chat

- **Vyom row** — mascot 38px + bubble `4px 15px 15px 15px` (tail top-left), `#fff` or `#e7f5ff` when featured, `1px` border, "Listen" TTS affordance below.
- **User row** — right-aligned, `15px 4px 15px 15px`, blue gradient fill, white text.
- **Typing** — three 5px dots, `hpDots` 1.1s staggered 0.18s.
- **Composer** — 16px radius, white, hairline, paperclip + input + mic + 40px send. Inert states drop the whole component to `opacity:.2` with `pointer-events:none` rather than half-disabling it.

### 2.7 Answer feedback

Not a border or a card tint — a **corner light leak** on the page shell's `::after`:

- Bottom-left, `70vw × 45vh`, `transform-origin: 0% 100%`
- Six-stop radial ramp halving each step (`.88 → .62 → .34 → .15 → .05 → transparent`) so there's no visible ring
- Swells from `scale(.92)`, 1.15s in and out on the same curve
- `z-index:0` — beneath the content canvas, nav, chat, and dock

### 2.8 Overlay / popover

Radius 16–18px, white, `1.5px #dee2e6`, `SH_LG`, 8–18px padding. Enter with `hpIn`/`popIn`. Dismiss with a **capture-phase `pointerdown` listener on `document`**, not a fixed scrim — an animated ancestor's `transform` makes it the containing block, so `position:fixed; inset:0` covers only that ancestor.

---

## 3. Layout & z-order

Every page is the same three-layer stack:

1. **Page shell** — full-height, the canvas gradient, `overflow:hidden`. Owns the ambient light (`z:0`) and the answer leak (`z:0`).
2. **Card gutter** — transparent fill/border, radius 24px, `overflow:hidden`. The clip boundary: any glow or shadow reaching past it gets sliced into a hard line.
3. **Content canvas** — `container-type:size` grid centring the 16:9 stage.

Teaching Room z-order: canvas `1` → nav + progress `6` → chat window, dock, composer `30` → video `20` (`80` full-screen).

---

## 4. Rules

1. **One saturated accent per screen.** Blue for action, violet for AI, orange for progress/streak, green/red only for outcome.
2. **Shadows are violet, never black.** Use the four `SH_*` steps.
3. **Hairlines do the structural work** — 1–1.5px borders before shadow.
4. **Fill-less chrome for ambient widgets.** Anything that isn't a container (goals, streak, logo, top chrome) has no background and no stroke — only a soft downward lift.
5. **8 sizes, 3 weights.** No new type values.
6. **No gradient backgrounds beyond the canvas.** Gradients are for buttons and card surfaces only.
7. **Sentence case everywhere.** Buttons are short imperatives — "Continue", "Start my first class", "Skip this".
8. **Motion is functional.** Nothing decorative survives `prefers-reduced-motion`.
9. **`gap`, not margins.** Sibling groups always flex/grid.
10. **No emoji as iconography.** Tabler only.
