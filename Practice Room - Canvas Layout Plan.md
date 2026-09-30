# Practice Room — 16:9 canvas layout plan

## Audit of what is there now

Measured at viewport 924×540, canvas `.bpop` = **716 × 403**.

| # | Finding | Evidence |
|---|---|---|
| 1 | **196px of horizontal canvas is unused.** The question column is fixed at 520px inside a 716px canvas, so 27% of the width is dead space while the content is cramped vertically. | quizCol w=520, canvas w=716 |
| 2 | **Everything is sized in absolute px against a canvas that scales.** The canvas is 16:9 and resizes with the viewport; the type does not. At a large window the text is tiny; at a small one it clips. | qFont 20px fixed, canvas 716–1600px wide |
| 3 | **The type scale is arbitrary.** 20 / 16.5 / 14 / 13.5 / 12px — five sizes with no ratio between them. 16.5 and 14 and 13.5 are three near-identical steps, which reads as noise rather than hierarchy. | measured |
| 4 | **No grouping.** Question, options and actions are siblings in one flow with 13px / 7px / 10px gaps. Because within-group and between-group spacing are nearly equal, the eye cannot tell where one group ends. | gap 7px inside options, 10px to actions |
| 5 | **Option rows are 46px tall with 16.5px text** — below the 44px touch floor once padding is counted, and visually thin against a 403px canvas. | optH 46 |
| 6 | **Vertical padding is asymmetric** (`14px 30px 6px`), so the stack sits 8px above true centre. | pad |
| 7 | **The hint panel is a bolt-on.** It appears beside a column that was sized for the no-hint case, so opening it shrinks the question rather than using the space that was always free. | quizColW 520 → 400 |
| 8 | **Only one question shape is supported.** Diagram, image and GIF questions have nowhere to live. | steps[] all `quiz` text |

## The plan

### A. Canvas-relative scale

The canvas gets `container-type: size`, and every size is expressed in `cqw` (1cqw = 1% of canvas width). The layout then holds at any window size, and one ratio governs the scale.

| Token | Size | Use |
|---|---|---|
| `--q` | 3.6cqw (~26px @716) | Question |
| `--opt` | 2.5cqw (~18px) | Option label |
| `--cta` | 2.1cqw (~15px) | Buttons |
| `--meta` | 1.8cqw (~13px) | Hint body, captions |

Four steps, ratio ≈ 1.4. No 16.5/14/13.5 near-duplicates.

### B. Spacing: groups, not a flow

Three groups with a clear hierarchy of gaps:

- **Within a group** (option to option): `1.2cqw` (~9px)
- **Between groups** (question → options → actions): `3.4cqw` (~24px)

A 2.6× ratio is enough for the eye to read three blocks instead of one list.

### C. Two layouts

**Text-only** — one centred column at `min(78%, 620px)`. Wider than today's 520, so it uses the canvas instead of hugging the middle.

**Media** — a two-column grid: visual on the left (`48%`), question stack on the right. Used for diagram, image and GIF questions. The visual is a real surface with its own rounded frame, not a floating sketch.

### D. Hint behaviour, per layout

- **Text-only**: hint opens a panel on the right. The question column narrows to `52%` and the panel takes `44%` — both sized as fractions, so nothing overflows and the panel is genuinely large (~300px, not 236px).
- **Media**: the hint does *not* open a second panel. It highlights inside the visual already on screen — the relevant element gets a callout stroke and a label — and the hint text appears under the visual. The help sits on the thing it explains.

### E. Question types to support

| Type | Visual | Example |
|---|---|---|
| `quiz` | none | "A tangent touches a circle at how many points?" |
| `diagram` | inline SVG | "Which line is the tangent?" — labelled circle |
| `image` | photo | "Where do you see a tangent here?" — bicycle wheel |
| `gif` | animation | "What happens as the point moves outward?" |

All four share the same question / options / actions grouping; only the presence of the left visual differs.
