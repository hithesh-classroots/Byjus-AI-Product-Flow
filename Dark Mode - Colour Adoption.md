# Dark Mode — Colour Adoption

How the dark theme is derived, and what each kind of component does when it crosses rooms.

Reference implementations: `Component Systems - Dark.dc.html` (all seven systems), `Teaching Room - Dark.dc.html`, `Chapter Journey - Dark.dc.html`, `Home Page - Dark.dc.html`.

---

## 1. The premise

**A component never decides whether it is light or dark. The room does.**

The content canvas is transparent, so a board inherits whatever surface it sits on. That is only workable if every colour is specified as a **role** and resolved per room — never as a fixed value. A component that hardcodes a light hex has silently chosen a room.

There are two rooms. Nothing else about a component changes between them: every size, weight, radius, gap, duration, easing, dash pattern and vertex position is identical. **The dark room is a palette resolution, not a redesign.** If a component needs different geometry in one room, the component is wrong.

---

## 2. The ten roles

| Role | Light room | Dark room | What it paints |
|---|---|---|---|
| `canvas` | `#f8f5fe` gradient | `#1a1526` | The room itself — **and the ink on any light accent fill** |
| `surface` | `#ffffff` | `#262038` | Cards, panels, bubbles, form controls |
| `surface2` | `#f1f3f5` | `#2e2745` | Nested surface, resting control face |
| `line` | `#e9ecef` | `#3d3459` | Borders, dividers, scrollbar thumbs |
| `line2` | `#ced4da` | `#4d4666` | Heavier rule, disabled edge |
| `ink` | `#212529` | `#cdc7de` | Primary text — 9.5:1 on surface |
| `dim` | `#495057` | `#918aac` | Secondary text, labels, body copy — 5.5:1 |
| `faint` | `#adb5bd` | `#6b6485` | **Lines only.** Never text |
| `concept` | `#7950f2` | `#a385fa` | Violet — the AI companion, definitions |
| `emphasis` | `#e8590c` | `#e8a53f` | Warm — rewards, streak, the thing being pointed at |
| `action` | `#1c7ed6` | `#4da3f0` | Blue — primary action, links |
| `correct` | `#2f9e44` | `#4cbf6e` | Success only |
| `wrong` | `#c92a2a` | `#f07171` | Error only |
| `lattice` | `rgba(96,74,190,.13)` | `rgba(163,133,250,.10)` | The dot grid |

**Ten tokens is enough because of one rule:** in the dark room every *light* accent fill takes `canvas` as its ink. A per-hue approach needs seven extra near-blacks for that job; one role replaces all of them.

Alpha tints of these roles are free and do not count against the palette. So are `rgba(0,0,0,…)` and `rgba(255,255,255,…)` — see §4.

---

## 3. The generated ladder

Component-local colour is not picked by hand. A variant is **one number — a hue angle** — and five stops are generated from it in `oklch()`. **The lightness constants are per room, and the ladder inverts:**

| Stop | Light room | Dark room | Painted on |
|---|---|---|---|
| `fill` | `92% .12` | `26% .05` | Surface at rest — the term's own chip |
| `fill2` | `84% .155` | `32% .07` | Nested surface, selected face, chart band |
| `base` | `48% .19` | `62% .15` | Highlight stroke, primary face, plotted marker |
| `edge` | `36% .165` | `50% .13` | A raised control's drop face |
| `text` | `40% .155` | `88% .06` | Label on `fill` |

Read the two columns against each other and the shape of the whole theme falls out:

- **Surface stops go dark.** `fill` and `fill2` cross from near-white to near-black.
- **`text` goes light.** It is the ink for those surfaces, so it inverts with them.
- **`base` crosses the middle.** It is a *dark* fill in the light room and a *light* fill in the dark room — which is why ink on a `base` face is **white** in the light room and **`canvas`** in the dark one.

⚠️ **Why this is the part that breaks.** The ladder is authored in `oklch()`, so a hex-based sweep is structurally blind to it. A `fill` at `92%` stays a near-white plate wherever it lands, and it will not show up in a contrast audit — because it pairs a light fill with dark ink and is therefore *internally consistent as a light-mode component*. Fifty-one such plates once survived a sweep that otherwise measured clean.

**The rule that closes it:** *a tint is an alpha of its accent, or a per-room lightness — never a fixed value, in any colour space.* Any component-local face built the same way — a slider track, a counter tile, a chart band — inverts with the ladder.

---

## 4. Depth

**Shadows are depth, never brand.** Every dark-room shadow is pure black; a hued glow on near-black reads as a smear.

| Use | Light room | Dark room |
|---|---|---|
| Resting card | `0 2px 6px -3px rgba(70,46,146,.16)` | `0 2px 7px rgba(0,0,0,.20)` |
| Raised / popover | `0 14px 30px -18px rgba(70,46,146,.36)` | `0 18px 44px rgba(0,0,0,.40)` |
| Panel separation | `-10px 0 34px rgba(70,46,146,.10)` | `-22px 0 52px rgba(0,0,0,.34)` |

Large soft shadows smudge on a dark canvas — keep them tight and raise the alpha instead of the blur.

**The one white allowed in a shadow** is the lit top edge that gives a filled control its form: `inset 0 1px 0 rgba(255,255,255,.32)`. It replaces the light room's button gradient, which collapses to a flat fill here — a two-stop gradient inside one token is dead weight.

---

## 5. Component behaviour

### Buttons

| State | Light room | Dark room |
|---|---|---|
| Primary | `base` face, white ink | `base` face, **`canvas` ink** |
| Default (neutral) | `96% .022` — near-white, hue shows anyway | **`36% .085`** — hue must come from *chroma* |
| Selected | `fill` face, `text` ink | **`fill2`** face, `text` ink |
| Correct / wrong | `correct` / `wrong` face | same roles, `canvas` ink |
| Disabled | grey fill, grey ink, edge shortened | fill *below* the live face, ink `dim` |

Three dark-room-specific notes:

- **A resting face needs chroma, not just lightness.** At `.022` the light room's near-white plate still showed its hue; at 36% lightness it is simply grey and reads as disabled. `.085` keeps it clearly neutral next to `base` at `.15`.
- **A face must sit above its room.** Anything at 24–26% is level with `canvas` (L 0.19) and reads as a hole rather than a surface. 32–36% is the floor.
- **Disabled must recede on lightness, not only hue.** A disabled fill *lighter* than the live face still reads as raised, and disabled ink brighter than active ink reads as the live state.

### Sliders

- **Track, unfilled** — a dark surface (`30% .05`), not a pale tint.
- **Track, filled** — `base`. In the dark room that is a *light* stop, so the filled portion is the bright part.
- **Thumb** — the only element a student touches, so it must be the **brightest thing on the control**: `ink` with a lighter rim. Do not tie it to a resting-surface value; in the light room that value was near-white, which is exactly what made it read as the handle.
- **Thumb drop face** (`--edge`) — stays **darker** than the thumb. It is the ledge the handle casts, not a rim highlight.
- **Notches** — off `46% .10`, on `66% .14`.
- **Counter chip** — a light `base`-family face with `canvas` ink.

### Counters

- **Value tile** — dark fill, **light `text` ink**. The single most common defect here is a tile whose fill was inverted while its ink stayed `deep`: both end up dark and the numeral is *invisible*, not merely dim.
- **± buttons** — `base` family face, `canvas` ink.
- **Disabled** — fill just above `surface`, ink `faint`. Recessive on both axes.

### Figures, graphs, number lines

- **Fills** — pale fill + saturated stroke in both rooms, but in the dark room the *fill* is the alpha tint and the stroke is the room's accent. A pale hex fill would glow.
- **Vertex and axis labels** — these sit on the room's `surface`, not on a light face, so they take the ladder's **`text`** stop. `deep` on `surface` is the same luminance: a 1.00:1 invisible label.
- **Hidden edges** — `faint`, dashed. Three dash patterns keep their three meanings: `6 4` hidden, `2 6` construction, `4 4` ghost.
- **Grid and lattice** — ⚠️ **inverts.** Light room: dark dots at low alpha. Dark room: *light* dots at low alpha. A "darken the dots" sweep erases them.

### Chat and bubbles

- **A bubble is a surface, not a state.** Bubbles are `surface`; `correct` and `wrong` mean success and error only. A nearest-hue sweep will happily map a lavender bubble onto the success token.
- **Companion bubbles** keep their character's hue as a tint: violet for the tutor, warm for the sidekick.
- **User bubbles** take the `action` gradient with `canvas` ink.

### Media overlays

⚠️ **The one place light ink is correct in the dark room.** A translucent near-black scrim over video takes `ink`. Sweeping these to `canvas` gives near-black on near-black (~1.05:1). This is the exact inverse of the accent-fill rule, which is why a single-direction sweep cannot satisfy both.

### Chrome — goal, streak, progress widgets

- **Fill-less by default:** no background, no border, only a soft downward lift.
- **Expanded panels** take `surface` (as a gradient, `2e2745 → 262038 → 211c31`). ⚠️ A conversion sweep will map the light room's white panel onto **`ink`**, producing a near-white panel whose dark contents vanish. The panel is the defect, not the contents.
- **Non-text shapes inside a gradient panel** — grid pips, dots — must clear 3:1 against the panel's **lightest** stop, not its mid stop, or they disappear where the panel lifts.

---

## 6. Contrast

AA in both rooms, with the large-text exemption (≥24px, or ≥18.66px bold → 3:1). Meaningful non-text shapes need 3:1.

Every dark-room role measured against `surface` (`#262038`):

| Role | Ratio |
|---|---|
| `ink` | 9.5:1 |
| `dim` | 5.5:1 |
| `warm` | 7.3:1 |
| `blue` | 5.9:1 |
| `violet` | 5.4:1 |
| `green` | 6.5:1 |
| `red` | 5.5:1 |

**Two rules that are easy to get backwards:**

1. **An accent fill takes `canvas` ink** — *if the accent is light.* White on a light dark-room accent is 1.4–2.4:1. But `base` in the light room is a **dark** fill, so the same rule inverted gives white there.
2. **An ink authored for a light plate is not a dark-room ink.** Inverting the fills is only half the sweep. After inverting a fill, re-check every ink that sat on it, and every ink that now lands on `surface` directly.

---

## 7. Adopting the theme — the order that works

1. **Roles first.** Port §2 as variables. Do not start on components.
2. **Shell and shadows.** Room gradient, lattice, the black shadow set.
3. **The ladder.** Swap the `oklch()` constants for the dark column. This is the step a hex sweep cannot do for you.
4. **Fills, programmatically.** Classify every colour literal by the property it feeds: a **fill** inverts, an **ink** does not. Enumerating literals by hand does not converge — an unlisted value survives silently and there is no way to know from the source which ones remain.
5. **Then the inks that landed on the fills you just moved.**
6. **Then the six inversions** in §8, each of which needs the opposite treatment to the sweep.
7. **Measure last, and measure properly.** `getComputedStyle` returns `oklch()` verbatim; a naive rgb parse of that string reports a false **1.00:1**. Convert through a canvas (`ctx.fillStyle = css`, then `getImageData`) or the audit will pass while the page is broken.

---

## 8. The six inversions

Everything else in the theme is a substitution. These six need the *opposite* of the sweep, and each one shipped a real defect before it was written down:

1. **Figure fills** — the fill becomes the alpha tint; the stroke becomes the accent.
2. **Translucent scrims over media** — keep light ink. The only such place in the dark room.
3. **Grid and lattice** — dark dots become *light* dots.
4. **The ladder's `base` face** — a dark fill in the light room, a light fill in the dark room, so its ink flips with it.
5. **Disabled states** — recessive is not illegible. A disabled numeral still owes 4.5:1 against its own fill.
6. **An ink authored for a light plate** — inverts with the plate it used to sit on.

---

## 9. Audit

```js
// exactly ten roles, and nothing else
const hex = [...new Set((src.match(/#[0-9a-fA-F]{6}\b/g) || []).map(h => h.toLowerCase()))];
// short forms hide here — #fff is an eleventh colour
const short = [...new Set(src.match(/#[0-9a-fA-F]{3}\b/g) || [])];
// coloured rgba that is not an alpha tint of the ten
const off = [...new Set(src.match(/rgba\(\d+,\s*\d+,\s*\d+,[\d.]+\)/g) || [])].filter(s => {
  const [r, g, b] = s.match(/\d+/g).map(Number);
  return Math.max(r, g, b) - Math.min(r, g, b) >= 24 && !ROLES.some(t => t.join() === [r, g, b].join());
});
// any shadow carrying a hue
const shadows = src.match(/(box-shadow|drop-shadow)[^;"'}]*rgba\((\d+),\s*(\d+),\s*(\d+)/g) || [];
// light ladder fills — the class a hex sweep cannot see
const lightFills = [...src.matchAll(/oklch\((\d{1,3})% (\.\d+)/g)].filter(m => +m[1] >= 66);
```

Then live, in the page: walk every element collecting `color / backgroundColor / fill / stroke / borderTopColor / backgroundImage / boxShadow`, **convert each through a canvas**, and compare against the element's own font size and weight. Audit any iframe separately through `contentDocument` — a parent-document sweep cannot reach it.

**Four ways an audit reports a false clean:**

1. **A `#rrggbb`-only regex misses `rgba()` and `oklch()`.** A "unique hex" count is not evidence a collapse is complete.
2. **A colour absent from source is invisible to a source audit.** Form controls fall back to the UA's dark-mode grey when no `background` is authored.
3. **`scrollbar-color` and `::-webkit-scrollbar-thumb` both colour the same thumb**, and when `scrollbar-width` is set the standards property wins.
4. **A light fill with dark ink measures fine** — it is internally consistent as a light-mode component. Contrast alone will never find it; only a lightness check will.
