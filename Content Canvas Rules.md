# Content Canvas — Design Rules

**Version 1.0** — 17 August 2026. Pin this version rather than the tip; every rule change lands with a changelog entry in `Content Canvas Rules - changelog.md`.

The authoring system for everything that renders **inside the 16:9 content canvas**. Treat this as a slide-master set: an author picks a layout, fills its slots, and the result is correct by construction.

It has two jobs. **Parts 0–9** tell an author how to build a board. **Part 10** is the reverse direction — how to take existing modules, built by many authors with their own colours, boxes, glows and type, and land them inside this system deterministically and at scale. The page shell, top chrome, chat window and dock are governed by `Design System.md`, not here.

It describes the full set a real curriculum needs — not the subset any one demo happens to use.

---

# PART 0 — THE CONTRACT

Five non-negotiables. Everything else in this document is subordinate to these.

## 0.1 The canvas is transparent

**No board ever paints a background.** The 16:9 frame sits on the room's own surface — the lavender→cream gradient plus its dot lattice, ambient blobs, and answer-feedback light leak — and the board must let all of it through.

```css
/* every board root */
background: transparent;
```

Consequences that are easy to get wrong:

- **No white board fills, no tints, no gradients at board level.** A board-level fill hides the room's ambient light and breaks the answer-feedback leak, which is painted *behind* the canvas and depends on being visible through it.
- **No board-level theme.** A board never decides whether it is light or dark; the room does. Because the canvas is transparent, the same board renders on the light room and the dark room unchanged — which is exactly why every colour in this document is a **role**, resolved per theme in §3.6, and never a fixed hex. A board that hardcodes a light value has silently chosen a room. Which is also why white ink is banned.
- **Surfaces are local, never global.** A card, a row, a tint panel — these are small, deliberate, opaque islands *on* the transparent board. If a surface spans the full board, it is a background, and it is wrong.
- **Opaque, not alpha, for local surfaces.** Use `#ffffff`, not `rgba(255,255,255,.8)`. Alpha surfaces let the dot lattice show through the card and make text muddy.
- **Test on all three:** the top of the gradient (`#eee9fd`), the middle (`#f8f5fe`), and the bottom (`#fdfaf0`). A board must read on all of them.

## 0.2 The design canvas is 1600 × 900

Author at **1600 × 900 units**; the room scales the whole board to fit.

**Two scales exist, and confusing them is the most common authoring error.** Every size in Parts 1–4 is a **rendered** value — what it measures on a ~924px-wide board. At the 1600-unit authoring scale, multiply by **1.73**:

| Token | Rendered | Authored (×1.73) |
|---|---|---|
| `hero` | 48 | 83 |
| `title` / `statement` | 36 | 62 |
| `body` | 24 | 42 |
| `label` | 16 | 28 |
| `figure` | 44 | 76 |
| `micro` | 12 | 21 |
| gaps 8 / 14 / 20 / 26 / 40 | — | 14 / 24 / 35 / 45 / 69 |
| board padding `24 34 20` | — | `42 59 35` |
| chip-variant top 44 | — | 76 |
| radii 8 / 12 / 16 | — | 14 / 21 / 28 |
| border 1px · selected 2px | — | **2px · 4px** |
| measure 560 / 720 / 820 | — | 969 / 1246 / 1419 |

**Hairlines are the trap:** a literal `1px` border at authoring scale renders at 0.58px and disappears on some displays. Use **2px** authored for a 1px rendered hairline.

A board authored at render scale (≈924 wide) uses the rendered column directly. Pick one scale per file and never mix.

## 0.3 A board holds one idea

One idea, one layout, one primary action. If a board needs "and also", it is two boards.

## 0.4 A board never scrolls

`scrollHeight === clientHeight`, measured **with the chat panel open** (the board is ~63% width then, and text wraps). §7.6 gives the fix order.

## 0.5 Colour is never the only signal

Every state carried by colour is also carried by weight, an icon, or a shape. ~8% of students cannot separate the correct-green from the wrong-red.

## 0.6 Every board has exactly one focal point

**A board with nothing highlighted has not decided what it is about.** Every board carries exactly one element in `emphasis` — a term, a number, a region or a figure — and that element is traceable to one of the module's key takeaways (§34a).

Not one *per region*, not "at least one": **one**. Two focal points are two boards.

The converse is the sharper half: **if no element on a board deserves the accent, the board has no claim — cut it or merge it.** Colour is never added to relieve blandness; it is placed on the thing the board exists to say. A board that cannot name that thing is a board with nothing to teach.

## 0.7 Nothing ships unchecked

Every rule below this line describes a board that is *right*. **None of them detects a board that is wrong** — and a rule nothing evaluates is a preference. This is the gate.

**Twelve checks, run per board, before it ships.** They are ordered so an early failure makes the later ones moot. Any failure in group A or B is Tier A (§23) and blocks the board; group C is fixed in the same pass.

**A · Does it hold together**

1. **Nothing overlaps** — §7a.1. Measure it; do not eyeball it.
2. **It does not scroll** — `scrollHeight === clientHeight`, with the chat panel open (§0.4).
3. **It is at least half full** — content occupies ≥ 55% of the safe area's height (§7a.2). Four kinds invert this with a ceiling instead: `divider` 40%, `feedback` 50%, `intro` and `section` 60%.
4. **One gap value, optically centred** — §7a.3.

**B · Does it say one thing**

5. **Exactly one focal point, and you can name the takeaway it serves** (§0.6, §34a.2). Zero is an undecided board; two is two boards.
6. **Within the band's ceilings** — words, elements, steps (§2.6). The word count is of words held *simultaneously*; one continuous passage counts as one element instead (§2.6a).
7. **Nothing below the `muted` floor carries information** a student needs (§3.6).
8. **Every state is one of the ten**, applied from the matrix rather than invented (§8a.1).

**C · Is it in the system**

9. **Every colour** comes from a hue angle (§3.7) or the semantic set (§3.2). No hand-picked hex.
10. **Every type value** is one of the four steps at 500 / 700 / 800 (§2), and the face is Roboto — italic serif only on lowercase algebraic variables (§2.0). No fluid sizing, no in-between weight, no third face.
11. **Every radius** is from the ladder (§4); every shadow from §6.
12. **The ban sweep** — no gradient but a primary button's own vertical pair; no bevel but a button's base edge (§20.0.1); no text shadow; no glow but `attention` (§8a.3); no uppercase outside the `label` step.

**Record the pass.** An unchecked board is not "probably fine" — it is unchecked, and across 2000 modules that difference *is* the backlog. The check is cheap: eleven of the twelve are mechanical, and the twelfth (check 5) is one sentence the author had to write anyway.

---

# PART 1 — FOUNDATIONS

## 1. Grid & safe area

| | Units |
|---|---|
| Canvas | 1600 × 900 |
| Safe area | 1456 × 812 (margin 72 sides, 44 top, 44 bottom) |
| Columns | 12, each 96 wide |
| Gutter | 40 |
| Baseline | 8 |

Legal splits — a board uses exactly one:

| Split | Columns | Use |
|---|---|---|
| Full | 12 | Titles, single diagrams, full-width charts |
| Half | 6 / 6 | Visual ↔ text, comparisons |
| Major-left | 8 / 4 | Diagram with a legend or readout |
| Major-right | 4 / 8 | Thumb with explanation |
| Thirds | 4 / 4 / 4 | Three steps, three media |
| Quarters | 3 / 3 / 3 / 3 | Four thumbs or stats |
| Centred | 8, offset 2 | Single statements, formulas, prose |

Everything sits on the 8-unit baseline. Nothing bleeds past the safe area except `media-bleed` (§9.4).

## 2. Type

**Two faces, and the second one is only for variables.**

### 2.0 The stacks

**Everything except algebraic variables** — declared once on `body`, never re-declared:

```css
font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Roboto is pinned, not inherited from the OS. This clause governs every other font reference in this document and in `Design System.md`; anything describing a system stack is superseded.** Self-hosted and subset (Latin + §13.2–13.3 glyphs) at weights 500 / 700 / 800, `font-display: swap`, with a `<link rel="preload">` so the download starts before the CSS is parsed rather than after.

The reason it is pinned rather than left to the system stack: §0.4 (a board never scrolls), §7a.2 (≥ 55% fill) and §2.6 (words per band) are all *measurements*. On a variable stack a board authored on macOS can overflow on Windows, because SF Pro, Segoe UI and Roboto have different widths and x-heights. A pinned face makes a board that fits fit everywhere.

**Algebraic variables** — the one exception:

```css
font-family: "Times New Roman", Tinos, "Liberation Serif", Georgia, serif;
font-style: italic;
```

Italic serif for variables is the convention of every maths textbook and every typeset paper, and it earns its exception: it makes `a` the *unknown* visibly different from `a` the letter, and `x` visibly different from `×`. Tinos and Liberation Serif are metric-compatible with Times New Roman and cover Linux and Android.

**Monospace** — column arithmetic and code only: `"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace`.

Numerals use `font-variant-numeric: tabular-nums` anywhere figures are compared or stacked.

### 2.0a What is a variable — and what is not

The italic serif applies to **lowercase single letters standing for a quantity**: `x y z a b c n k r t`, and their subscripted forms (`x₁`, `aₙ`).

It applies **everywhere that letter appears** — in the expression, in the prose about it, and in the label on a diagram. `aⁿ` in a formula and "the value of *a*" in the sentence below it are the same referent, so they wear the same face (§34.6).

**Everything below stays Roboto upright.** Each line is a real convention, not a preference:

| Not a variable | Why |
|---|---|
| Numerals — `2³`, `27` | A number is not an unknown |
| Operators — `+ − × ÷ =` | Upright, always |
| Function names — `sin cos tan log` | Upright roman: `sin x`, never *sin x* |
| Units — `cm kg s °` | Upright, or `5 s` reads as *5 × s* |
| Point and vertex labels — `A B C`, `△ABC` | Uppercase, geometry not algebra |
| Set names — `N W Z Q` | Uppercase |
| Multi-letter names — `area`, `max` | Two letters would read as a product |
| Constants named by word — `π` | π is upright; it is a fixed value |

**A variable never carries an anchor colour and the italic at the same time** unless it is that board's focal point (§0.6). The face already distinguishes it; adding hue makes two signals for one fact.

### 2.1 The four sizes

| Role | Size | Line-height | Tracking |
|---|---|---|---|
| `hero` | 48 | 1.05 | −0.025em |
| `title` | 36 | 1.2 | −0.015em |
| `body` | 24 | 1.5 | 0 |
| `label` | 16 | 1.3 | 0 (+0.09em when uppercase) |

`hero` and `title` never appear together. A board uses at most three of the four. **Nothing a student reads as a sentence goes below `body`.**

**`hero` and `figure` never appear together either.** At 48 and 44 they are 4px apart, which reads as an inconsistency rather than a distinction. They do not collide in practice: `hero` belongs to the introduction and closing boards (§44), `figure` to data and working boards. If a board seems to need both, the larger one is the board's destination and the other is content — set it at `title`.

### 2.1a Size states role, not enthusiasm

The step is decided by a line's **job on this board**, never by its length or its warmth:

- **The board's destination takes the larger step** — the question it exists to raise, the claim it lands on. On a board asking "So what is repeated multiplication?", that question is the destination even though the recap above it is the longer sentence.
- **A recap of prior knowledge takes `body`.** "You already know that…" is setup, not payload. Setting it at `title` inverts the board: the student's eye lands on what they already know.
- **Reference material is a caption, never a message.** Unit keys ("each □ = 1"), legends, axis labels and source notes sit at `label` or below, in `#868e96`, and never share a line with the board's question. If a legend needs the question's step to be noticed, the visual isn't legible enough — fix the visual.

### 2.1b Title vs narration — the test that decides the step

A prominent line at the top of a board is **not automatically a title.** Apply this test:

| | Title | Statement (narration) |
|---|---|---|
| Form | A noun phrase that *names* the board | A full sentence that *says something* |
| Example | "Area of a trapezoid" · "What you will be able to do" | "One pair of opposite sides is parallel now. You have formed a trapezoid." |
| Step | `title` 36 / **800** | `statement` 36 / **500** |
| Ink | `#212529` | `#495057` |
| Accent | at most one word | the key term, at 800 |

**`statement` (30 / 500) is the one sanctioned use of 30px at content weight.** It exists because setting a whole narrated sentence at 800 spends all of a board's emphasis on connective words — "one pair of", "you have formed a". **Bold is expensive: it buys attention only while it stays scarce.**

A statement carries exactly one accented term at 800 — the thing the sentence exists to deliver.

Two additions for maths and data only:

| Role | Size | Use |
|---|---|---|
| `figure` | 44 | A single result or live value that *is* the content of the board |
| `micro` | 12 | Axis ticks on a dense chart, superscripts. Never a sentence, never prose |

### 2.2 Three weights — and what decides them

Weight encodes **what kind of thing the text is**, never how important it feels. The categories are mutually exclusive, so every string has exactly one correct weight:

| Weight | Category | Test | Examples |
|---|---|---|---|
| **800** | **Destination** — what the eye lands on first, plus highlighted terms | "Is this the single most important element, or one word being marked?" | Board title · highlighted term · badge numeral · a result |
| **700** | **Control** — text inside interactive or navigational chrome | "Is it inside a button, chip, tab, axis or legend, and ≤4 words?" | "Check answer" · "Hint" · eyebrow chips · axis ticks |
| **500** | **Content** — anything read as a sentence | "Would you read it aloud as a sentence?" | Prose · subtitles · list items · options · captions |

**At most ONE 800 element per board.** Weight creates hierarchy only when most text isn't heavy. A board whose title is 800, whose three list rows are 700 and whose button is 700 has no hierarchy — everything shouts.

- **A list item is content, not a label.** Objectives, bullets, MCQ options are `body`/500 even when short.
- **Never use weight for emphasis.** Size says which step it is; colour says whether it carries meaning. Weight only says what kind of text it is.
- **When every ledger token is spoken for, a non-anchored term stays unemphasised.** Weight-in-ink is *not* a fallback. If "addition" and "multiplication" have no anchor because base/exponent/result own all three tokens, they are set as plain content — the sentence's structure does the work. Reaching for 800 to compensate reintroduces exactly the shouting this rule exists to prevent, and it makes the term look anchored when it isn't.
- **No 400, no 600.** 400 is too light at classroom distance; 600 is indistinguishable from 700 and only invites drift.
- A highlighted word goes 800 **at the same size** — the only place 800 repeats, capped at one word per sentence.

### 2.3 The matrix

If a string isn't here, it's wrong:

| Element | Size | Weight | Ink |
|---|---|---|---|
| Title (title board) | 38 | 800 | `#212529` |
| Title (content board) | 30 | 800 | `#212529` |
| Statement (narrated sentence) | 30 | 500 | `#495057` |
| Subtitle | 20 | 500 | `#495057` |
| Prose | 20 | 500 | `#495057` |
| List item / option | 20 | 500 | `#495057` |
| Highlighted term | 20 | 800 | accent |
| Result / live value | 44 | 800 | accent |
| Eyebrow chip | 14 | 700 | accent |
| Button label | 14 | 700 | `#fff` or accent |
| Caption / helper | 14 | 500 | `#868e96` |
| Axis tick / legend / dimension | 14 | 700 | `#868e96` or accent |
| Badge numeral | 14 | 800 | `#fff` |
| Dense axis tick | 12 | 700 | `#868e96` |

### 2.4 Superscripts & subscripts

Maths content is full of them, and they are **not** a type step — they scale off their parent:

| | Value |
|---|---|
| Size | **0.5× the parent's size**, rounded to the nearest whole px |
| Weight | Inherits the parent's |
| Ink | The parent's, unless the exponent *is* the subject — then the accent |
| Alignment | `vertical-align: super` / `sub`; never a raised baseline hack |

In `aⁿ` the base and exponent are **different roles**: the base is the concept accent, the exponent the emphasis accent. Never colour both the same — that is the whole thing the notation teaches.

A superscript never falls below **12 rendered px** (21 authored). If halving the parent breaks that floor, the parent is too small for notation.

### 2.6 Grade bands

The library runs from *Count Objects Using Fingers* to *Two-Point Form: Derivation and Application*. **One type scale and one density cannot serve both.** Every board declares a band, and the band sets the ceilings:

| Band | Grades | Min body | Max words/board | Max elements | Max steps shown |
|---|---|---|---|---|---|
| **Early** | K–2 | `body` 24 | 8 | 5 | 1 |
| **Middle** | 3–5 | `body` 24 | 20 | 8 | 3 |
| **Upper** | 6–8 | `body` 24 | 28 | 12 | 5 |
| **Senior** | 9–10 | `body` 24 | 38 | 16 | 7 |

**Every band's minimum is `body`** — there is no band-specific size. A board scales to fit the viewport, so a rendered px value was never a physical size: the same board is larger on a monitor than on a tablet. A band minimum was always a statement about **proportion**, not legibility. (The earlier table set Early at 24 against a body of 20, naming a size that was not in the scale at all.)

**Early is the one exception, and it needs no new token: Early sets its sentences at `title` 36, not `body` 24.** It carries 8 words and 5 elements, so it has the room, and a Grade 1 board should read larger in proportion to its board. Its labels stay at `label` 16.

### 2.6a What the word ceiling counts

The ceiling counts words a student must hold **simultaneously** — not words on the board.

A 21-word word-problem stem is **one** reading task: read left to right, once, then set aside. The same 21 words spread across seven diagram labels is **seven** tasks, each re-read every time the eye returns to the figure. Counting those as equal is what makes a raw word count the wrong measure.

- **Counted against the ceiling:** labels, tick and axis labels, option text, list rows, callouts, chips, button labels, legend keys — anything scanned, re-read, or held while looking at something else.
- **Not counted:** a single continuous passage read once — a word-problem stem, a definition, a narrated statement. It counts as **one element** against the element ceiling instead, and is capped separately at **30 words**. One such passage per board.

Without this split the rules contradict themselves. §44b requires a word-problem board to carry a stem *and* a given/asked list *and* a model *and* working *and* an answer, while a realistic stem alone runs 20–25 words — so at Upper's ceiling of 28 that board is unbuildable. With the split, the stem is one element and the 28 governs the annotation load, which is what the ceiling was always for.

**The 30-word cap is not a target.** A passage over 30 words is too wordy for any band — rewrite it, never shrink the type (§7a.2).

- **Early boards carry no prose paragraph** — a caption, a number, and the object, with sentences at `title` 36. Instructions are spoken by the tutor, not printed.
- **Early and Middle hit targets are 56px**, not 44 — smaller fingers, and the object *is* the control.
- The `label` step is not used for anything a student must read in Early; it is for the author's chrome only.
- Above the band's element ceiling, the board splits (§0.3). The ceiling counts *countable things a student must attend to*, not tick marks or gridlines.

A module's band comes from its curriculum placement, is written in the module record (§43.1), and is a **Tier A** check — a Grade 1 board carrying a Senior board's 38 words is unreadable to its own audience whatever size it is set at.

## 3. Colour — the decision procedure

Colour has been the least disciplined part of the canvas, so it is specified as a **procedure**, not a palette. Run it on every text run.

### 3.1 The palette

**Ink** — three, no fourth:

| Token | Hex | Contrast on canvas |
|---|---|---|
| `ink` | `#212529` | 15.9:1 |
| `ink-body` | `#495057` | 8.9:1 |
| `ink-muted` | `#868e96` | 3.5:1 — **labels ≥14 only, never sole-source information** |

**Accents** — one active per board. Ink and fill columns are **not interchangeable**; the light end of each scale fails as text:

| Role | Ink | Fill / stroke | Tint surface |
|---|---|---|---|
| Concept (the thing being taught) | `#7950f2` | `#7950f2` | `#f3f0ff` |
| Action (interactive, live) | `#1c7ed6` | `#228be6` | `#e7f5ff` |
| Emphasis (the unknown) | `#e8590c` | `#fd7e14` | `#fff4e6` |
| Correct | `#2b8a3e` | `#40c057` | `#ebfbee` |
| Wrong | `#e03131` | `#fa5252` | `#fff5f5` |

Banned: `#fab005` / `#ffd43b` as ink · white ink · any hue not above · a second violet (`#6741d9`, `#5f3dc4`, `#845ef7` are all the same role as `#7950f2` — pick the one token).

### 3.2 The procedure

For each text run, in order. **Stop at the first rule that applies.**

**Step 1 — Does the run carry a STATE?**
Correct → `#2b8a3e`. Wrong → `#e03131`. A live value that changes as the student interacts → `#1c7ed6`. **Stop.**

**Step 2 — Is this run the SUBJECT of the board?**
The subject is the one term or figure the board exists to teach or ask about. It takes the board's accent at weight 800.
- The concept being taught → `#7950f2`
- The unknown being solved for → `#e8590c`

**At most one subject run per board.** If two things look like the subject, the board has two ideas. **Stop.**

**Step 3 — Otherwise, ink follows the type step.**
`hero`/`title` → `#212529`. `body` → `#495057`. `label` → `#868e96`.

That's the whole procedure. Three steps, deterministic, same answer every time.

### 3.3 What this forbids — read this before styling a title

- **A title is never fully accented.** Titles are `#212529`, with at most one accented word inside. A title set entirely in violet (with a second, lighter violet on one word) is wrong twice over: it accents a whole run, and it uses two tokens for one role.
- **An accent never spans a sentence.** Accents mark one word or one number.
- **Two accents never appear in one run.** "…a shape we already know — a **parallelogram**" is one accented word inside `#212529`, not a violet sentence with a lighter violet word.
- **`ink-muted` never carries information needed to answer.**
- **Sign is never colour-coded with a state colour.** Rendering negative numbers red-orange and positive blue teaches a student who has learnt red = wrong that every negative number is an error. If a board's subject *is* sign, negative takes concept violet and positive takes action blue, and it is registered in the module ledger. Otherwise the minus glyph carries the meaning on its own.
- **A label naming a state takes that state's accent**, not grey — a quiz eyebrow is `#e8590c`, never `#868e96`.

### 3.4 Surfaces

Local and opaque only (§0.1):

| Token | Value | Use |
|---|---|---|
| `surface-plain` | transparent | **Default** |
| `surface-card` | `#ffffff` | Groups content that must read as one unit |
| `surface-sunken` | `#f8f9fa` | List rows, inert containers |
| `surface-tint` | the accent's tint | Semantic panels and chips only |
| `surface-scrim` | `rgba(255,255,255,.72)` | **Only** over media, to carry ink |

A card asserts that its contents are one unit. It is not a wrapper.

### 3.5 Ink over media

Media is the one place ink cannot be trusted against its background:

1. Prefer a caption **outside** the image.
2. If ink must sit on the image, put it on a `surface-scrim` panel — never directly on pixels.
3. Never white ink; the scrim exists so ink stays dark.

### 3.6 The opacity ladder

Opacity was unspecified, so authors used ~0.30, 0.35, 0.40 and 0.45 for the same job. **Five steps, one meaning each. No value between them.**

| Step | Value | Meaning |
|---|---|---|
| `full` | 1 | Default. Everything a student reads is here |
| `muted` | 0.55 | Present but not in scope right now — still readable, still contrast-checked |
| `excluded` | 0.30 | Explicitly not part of the current set/answer/step |
| `tint` | 0.12 | An accent used as a surface fill behind text |
| `hairline-tint` | 0.08 | The faintest legal fill |

**Below `muted`, an element is decorative and may not carry information a student needs.** If something at `excluded` still has to be read — a label, a value, a set member — it is not excluded, it is `muted`, and it must pass 4.5:1 like any other text.

`muted` and `excluded` are **achromatic**: they desaturate to `#868e96` / `#adb5bd` rather than fading the element's own colour. A faded orange still reads as orange and keeps competing for attention; a faded grey does not.

Never apply opacity to a whole board or a whole region to "push it back" — see §8a.4.

### 3.6 Two rooms, one palette

**Reference implementations: `Component Systems.dc.html` (light) and `Component Systems - Dark.dc.html` (dark). Every rule below is demonstrated in both.**

The canvas is transparent (§0.1), so a board inherits its room. There are two rooms, and a board must render correctly in either without changing a line. That is only possible if colour is specified as a **role** and resolved per theme:

| Role | Light room | Dark room |
|---|---|---|
| `canvas` | `#f8f5fe` lavender→cream gradient | `#1a1526` |
| `surface` | `#ffffff` | `#262038` |
| `surface2` | `#f1f3f5` | `#2e2745` |
| `line` | `#e9ecef` | `#3d3459` |
| `line2` | `#ced4da` | `#4d4666` |
| `ink` | `#212529` | `#cdc7de` |
| `dim` | `#495057` | `#918aac` |
| `faint` | `#adb5bd` | `#6b6485` |
| `concept` (violet) | `#7950f2` | `#a385fa` |
| `emphasis` (warm) | `#e8590c` | `#e8a53f` |
| `action` (blue) | `#1c7ed6` | `#4da3f0` |
| `correct` | `#2f9e44` | `#4cbf6e` |
| `wrong` | `#c92a2a` | `#f07171` |
| `lattice` | `rgba(96,74,190,.13)` | `rgba(163,133,250,.10)` |

**The three rules that make one palette serve both rooms:**

1. **An accent's ink is the room's darkest value, not white.** In the light room a saturated fill takes its own hue's `text` stop; in the dark room *every* accent fill takes `canvas` (`#1a1526`). White on a dark-room accent is 1.4–2.4:1. This single rule is what removes the seven near-blacks a per-hue approach would need.
2. **A tint is an alpha of its accent, or a per-room lightness — never a fixed value.** This applies to *any* colour space, not only hex. §3.7's ladder is authored in `oklch()`, and its lightness constants were chosen for a white room: `fill` at `92%` is a near-white plate wherever it lands, and a hex→hex sweep cannot see it. **The ladder therefore has two constant tables, not one:**

   | Stop | Light room | Dark room |
   |---|---|---|
   | `fill` | `92% .12` | `26% .05` |
   | `fill2` | `84% .155` | `32% .07` |
   | `base` | `48% .19` | `62% .15` |
   | `edge` | `36% .165` | `50% .13` |
   | `text` | `40% .155` | `88% .06` |

   Note the ladder **inverts**: the surface stops go dark, `text` goes light, and `base` crosses from dark to light — which is why ink on a `base` face is white in the light room and `canvas` in the dark one. Any component-local face built the same way (a slider track, a counter tile, a chart band) inverts with it.

2a. **The original rule, for hex specifically.** `rgba(163,133,250,.16)` in the dark room where the light room uses `#e5dbff`. A pale hex picked for a white surface goes invisible on a dark one; an alpha tint tracks whichever surface it lands on. Alpha tints are free — they do not count against the palette.
3. **Shadows are depth, never brand.** The light room's shadows are violet-tinted (`rgba(70,46,146,…)`); the dark room's are pure black at a higher alpha (`rgba(0,0,0,.20)` resting, `rgba(0,0,0,.40)` raised). A hued glow on near-black reads as a smear. The one white allowed in a shadow is the lit top edge that gives a filled button its form — `inset 0 1px 0 rgba(255,255,255,.32)` — which replaces the light room's button gradient, since a two-stop gradient inside one token is dead weight.

**Inversions, not conversions.** Three things reverse direction between rooms, and sweeping one direction breaks the other:

- **Figure fills.** Light room: pale fill, saturated stroke (§3.7's `fill` + `base`). Dark room: the same pairing, but the *fill* is the alpha tint and the stroke is the room's accent — a pale hex fill would glow.
- **Translucent scrims over media.** The only place light ink is correct in the dark room — video overlays, control bars. Sweeping these to `canvas` gives near-black on near-black (~1.05:1).
- **Grid and lattice.** Light room: dark dots at low alpha. Dark room: *light* dots at low alpha. A "darken the dots" sweep erases them.
- **The ladder's `base` face.** Rule 1 says an accent fill takes the room's darkest ink — but that assumes the accent is *light*. §3.7's `base` stop is `oklch(48% .19 h)`, L≈0.48, so it is a **dark** fill: `canvas` ink on it is 2.8:1, room `ink` 3.9:1, and **white 6.3:1**. A numeral on a `base` face — slider counter, counter value, button label, plotted marker ring — keeps **white** ink in both rooms. Fold it into the `#ffffff → surface` sweep and every one of those controls fails.
- **An ink authored for a light plate is not a dark-room ink.** Inverting the *fills* is only half the sweep: an ink that used to sit on a pale plate has to invert with it. The ladder's `deep` stop on the dark room's `surface` is the same luminance — 1.00:1, an invisible label, not a dim one. And `faint` is a **line** value; the moment it is used as text it fails. Rule of thumb: after inverting a fill, re-check every ink that landed on it, and every ink that now lands on `surface` directly.
- **Disabled states.** Recessive is not the same as illegible. A disabled numeral still carries text, so it still owes 4.5:1 against its own disabled fill — `dim` on the dark room's disabled fill is 2.7:1, below even the 3:1 non-text floor. Lighten the ink rather than accepting the mapping's side-effect.

**Contrast targets are the same in both rooms** — AA, with the ≥24px (or ≥18.66px bold) 3:1 exemption. But the worst case moves: in the dark room, solve non-text shapes against the surface gradient's **lightest** stop, not its mid stop, or pips vanish where the room lifts.

**What does not change between rooms:** every size, weight, radius, gap, duration, easing, dash pattern, vertex position, layout, and every rule in Parts 1–11 outside this section. The dark room is a palette resolution, not a redesign. If a board needs different geometry in one room, the board is wrong.

### 3.7 The shade ladder — a recipe, not a list

**Reference implementation: `Shape System.dc.html`. It measures its own contrast at render time; trust it over any number written here.**

A fixed list of hues cannot answer *"what if this board needs a tenth term?"* — and every hand-assembled palette drifts, because a human picks each value. So a variant is **one number: a hue angle**. Lightness and chroma are constants, and the five stops are generated from the angle:

| Stop | `oklch()` | Painted on |
|---|---|---|
| `fill` | `92% .12 h` | Surface at rest — the term's own chip |
| `fill2` | `84% .155 h` | Nested surface, chart band, stronger tint |
| `base` | `48% .19 h` | Highlight stroke, button face, plotted marker |
| `edge` | `36% .165 h` | A button's base edge — the face's own hue, darker |
| `text` | `40% .155 h` | Label on that fill |

**Why OKLCH and not HSL.** Its lightness is *perceptual*: `L 40%` is equally dark at 95° (yellow) as at 255° (blue). In HSL it is not, which is precisely why hand-picked scales drift across the hue circle — and why yellow previously had no legal text stop in this system. It has one now.

**What the constants do and do not guarantee.** They keep every hue in one narrow band, and the band clears every threshold. They do **not** make WCAG contrast hue-invariant: that ratio is built on luminance, and chroma moves luminance, so each ratio lands in a *range*. Measured across the eight ladder hues:

| | Threshold | Measured |
|---|---|---|
| text on fill | ≥ 4.5 | 5.9 – 7.1 |
| base on fill | ≥ 3.0 | 3.2 – 4.1 |
| white on base | ≥ 4.5 | 5.2 – 7.3 |

**A newly generated angle is spot-checked at the low end of the band** — teal sits closest to the floor.

**Chroma, not lightness, is what makes a chip visible.** The canvas is a near-neutral lavender (chroma ≈ .02), so a surface separates from it by being *coloured*, not by being *dark*. Fill-on-canvas luminance ratio is only ≈ 1.3 and that is correct — judge a fill by eye against `#eee9fd`, the canvas's darkest stop, never by that number. The first version of this rule set `fill` to L 95.5% and it was invisible on a real board; the obvious repair, darkening it, made every board heavy and adult. Raising chroma and giving lightness back is the fix.

#### 3.7.1 The default ladder

Eight angles pre-solved, taken **in order**, so the first term on any board in the library is violet and nobody chooses:

| # | Name | `h` | | # | Name | `h` |
|---|---|---|---|---|---|---|
| 1 | Violet | 295 | | 5 | Pink | 350 |
| 2 | Orange | 55 | | 6 | Grape | 320 |
| 3 | Blue | 250 | | 7 | Gold | 95 |
| 4 | Teal | 190 | | 8 | Azure | 220 |

Need a ninth? **Generate it.** Any angle is legal provided it is ≥ 25° from every other hue on the board and outside the two reserved arcs. Below 25° two terms stop being tellable apart.

#### 3.7.2 The two reserved arcs

**`15–40°` means _wrong_. `130–170°` means _correct_.** They are never an anchor, never a selection, never decoration. A board wanting a green-ish anchor takes Teal (190°); a red-ish one takes Pink (350°).

#### 3.7.3 The neutral

`oklch(96% .022 295)` face on an `oklch(78% .05 295)` edge — the brand angle at near-zero chroma. **Not white.** A white face on a grey edge reads as an absence of design, and it is the state every answer option rests in, so it is the most-seen shape in the library.

### 3.8 Colour schemes — the sanctioned combinations

**Pick one scheme per board and stay inside it.** These five are the whole set; a combination not listed here is a new entry, added before use.

| Scheme | When | Palette |
|---|---|---|
| **Anchor triad** (default) | Any board with referents — most boards | violet `#7950f2` · orange `#e8590c` · blue `#1c7ed6` |
| **Monochrome depth** | One concept with parts — place-value columns, fraction parts, nested sets | One hue at `light` / `base` / `deep` |
| **Complementary opposition** | Genuine opposites — before/after, input/output, gain/loss | violet + orange · blue + orange · teal + pink |
| **Analogous run** | An ordered sequence of related categories — chart series, sorted groups, stages | blue → cyan → teal · violet → grape → pink |
| **Triad** | Three coordinate, non-ordered categories. **Maximum three** | violet + teal + orange · blue + pink + lime |

**Six composition rules, all checkable:**

1. **60 / 30 / 10.** Neutral dominates the board, one hue carries the structure, one accent marks the focal point. A board split evenly between two hues has no subject.
2. **Never two hues at `base` with equal area.** One drops to `light`, or shrinks. Equal-weight competing hues is the single most common cause of a "busy" board.
3. **Adjacent hues only at different stops.** Blue with cyan, violet with grape, green with lime — legal at different stops, never both at `base`. At the same stop they read as a mistake rather than a distinction.
4. **Warm advances, cool recedes.** The subject takes the warm hue; context takes the cool one. If the background is warmer than the subject, the board fights itself.
5. **Maximum four hues plus neutrals**, on any board, in any scheme.
6. **The greyscale test.** Convert the board to greyscale: every distinction that carried meaning must still be visible. If two categories collapse to the same grey, they were separated by hue alone — which fails §0.5 and fails ~8% of students.

**Reserved and unavailable to any scheme:** `correct` green and `wrong` red. A scheme that needs a green picks teal or lime; one that needs a red picks pink or orange.

## 4. Radius

| Value | Use |
|---|---|
| 8 | Chips, tags, bar tops |
| 12 | Rows, badges, counter chips |
| 16 | Cards, panels, media boxes |
| **20** | **Surfaces and buttons** — both families of the shape system (§20.0), including answer options and inputs |
| 999 | Pills, tracks, dots |
| 50% | Circles — points, avatars, and the slider thumb (§20.0, the one carve-out) |

**20px is not a step in a size ramp; it is a family marker.** Everything a student reads content from or presses is 20px, so radius carries no meaning between the two — depth does (§20.0). Nothing else on a board may use 20.

## 5. Line & border

**One border: 1px `#e9ecef`.** An accent-bearing border uses that accent at 40% alpha, still 1px. **2px in a solid accent means selected** — the width jump *is* the affordance, so nothing else uses 2px.

| Role | Width | Colour |
|---|---|---|
| Shape outline | 2.5 | accent |
| Construction / helper | 1.5 | `#adb5bd` |
| Dashed original / ghost | 1.5, dash `6 4` | `#ced4da` |
| Dimension leader | 1 | `#868e96` |
| Grid line, minor | 1 | `#e9ecef` |
| Grid line, major | 1 | `#dee2e6` |
| Axis | 1.5 | `#adb5bd` |
| Data line | 2.5 | accent |
| Vector / arrow | 2.5 + 8px head | accent |
| Divider | 1 | `#e9ecef` |

## 6. Shadow

```
resting  0 2px 6px -3px rgba(70,46,146,.16)
raised   0 10px 24px -12px rgba(70,46,146,.30)
```

Coloured glows only on a primary button, in its own accent. **No shadow on media** — an image already has an edge. No shadow on a tint panel.

## 7. Spacing

**Margins are banned inside a board** — `gap` only (`margin:0 auto` for centring is the sole exception). Margin chains don't collapse predictably and break when a child is conditionally hidden.

### 7.1 Gap scale

| Token | Units | Between |
|---|---|---|
| `gap-tight` | 8 | Icon and label; numeral and unit |
| `gap-inner` | 14 | Items in one group — rows, legend entries |
| `gap-block` | 20 | Stacked blocks — title → body |
| `gap-surface` | 26 | Before a distinct surface that closes a board |
| `gap-region` | 40 | Board halves — visual ↔ text |

### 7.2 Board padding

```
padding: 24px 34px 20px;      /* base */
padding: 44px 34px 20px;      /* boards that render an eyebrow chip */
```

The chip is `position:absolute` at `top:16px`, so **only a board that renders one needs the clearance.**

**The height budget is real.** A rendered board is ~329 CSS px tall, ~285 after padding. Sum the children before changing any gap or padding.

### 7.3 Inner padding

| Surface | Padding |
|---|---|
| Chip | `6px 12px` |
| Row (comfortable) | `14px 18px` |
| Row (compact) | `10px 16px` |
| Card / panel | `20px 24px` |
| Formula card | `12px 26px` |
| Tint panel | `14px 16px` |
| Button | `12px 22px` |
| Input | `10px 14px` |

### 7.4 Measure

Prose 560 · list 720 · two-column 820 total.

**Express a measure cap as symmetric `padding-inline`, never `max-width`.** This is a correctness rule, not a preference. A board-level text block is a child of a `column` + `align-items:center` flex parent, so it carries `align-self:stretch` (§7.5a). Stretch pins the box's **left** edge to the content edge; a `max-width` then clamps the width from that pinned edge — so `text-align:center` centres about *that box's* midpoint, which sits left of the board's. Different caps on different blocks produce different offsets, and nothing on the board shares an axis.

```
padding-inline = (content width − cap) / 2

cap 969  → 257px      cap 1246 → 118px      cap 1419 → 31px
(on the standard 1482 content width: 1600 − 2×59)
```

The box stays full width, so its centre **is** the board's centre.

### 7.5 Alignment

- **Centred** boards: titles, single statements, formulas, single visuals.
- **Left-aligned** boards: anything with more than two lines of prose, all lists, all tables.
- Never centre a list's text. Centre the *block*, left-align its contents.
- Numerals that are compared are right-aligned and tabular.

### 7.5a Every text block needs a resolved cross size

A board's inner wrapper is `display:flex; flex-direction:column; align-items:center`. **Any direct text child must carry `align-self:stretch`** — give every one of them a shared class rather than patching them individually.

Without it the child is **shrink-to-fit**: it wraps at that narrower width but its box stays *one line tall*, so the next flex sibling is laid out as if line two doesn't exist and paints straight over it. The symptom looks like a spacing bug and isn't — it is a cross-size bug, and it appears the moment any string grows by one word, so it will not show up on the copy you authored with.

Corollaries:

- **An equation carries `white-space:nowrap`.** A formula that wraps out of its own card border is worse than one that overflows the safe area — it reads as two equations.
- **Rows being compared stretch to one shared column width** and centre their own contents. Shrink-to-fit rows each land on a different axis, which silently asserts they are different kinds of object.
- **Decorative overhang must be unclipped.** A ring, halo or focus outline drawn at a negative inset needs no `overflow` on any ancestor — or the inset reserved as padding. `overflow-y:auto` clips **both** axes, so adding it to a stack crops every ring inside it.

### 7.6 Making a board fit

In order. Only the last two touch design tokens:

1. **Check the padding variant** — no chip on the 44px variant wastes 24px.
2. **Make the repeating stack the flexible child** — `flex:0 1 auto; min-height:0; overflow-y:auto` on the row list. Everything the student must always see (title, action) stays `flex:none` **outside** it, so it can never scroll away. This is what makes residual overflow *reachable* rather than destroyed by the board's `overflow:hidden`.
3. **Cut content.**
4. **Switch rows to compact** — `10px 16px` at 1.35 leading. The only sanctioned deviation from §7.3.
5. **Never** shrink a type step or drop a weight category.

**A scroll container clips both axes.** `overflow-y:auto` computes `overflow-x` to `auto` too, so **any decoration overhanging its element is cropped** — celebration rings, focus glows, badges pinned outside a row. Therefore:

- Draw decorations **inside** the element's box (`inset:0`, stroke inset by half its width) — never at a negative inset.
- Give a scrolling stack `padding:4px` so soft shadows still have room.
- Match a decoration's corner radius to the element it traces (a 12px row needs `rx:12`, not 16).

This shipped as a real regression: the objectives ring was drawn at `inset:-3px`, and making the stack scrollable cropped it flat at the left edge.

**Measure with the chat panel open.** The board is ~585px wide then; a list item wraps and a row goes 49 → 76.

## 7a. The layout contract

§7 governs the space *around* things — padding, gaps, the safe area. Nothing governed the space *between* them, which is why boards have passed review with correct margins and colliding interiors.

### 7a.1 Nothing overlaps

**No two elements on a board may overlap.** Not slightly, not at the corners, not "it looks fine at this size". A label clipping a figure by 2px is a defect.

The only sanctioned overlaps are elements drawn *behind* another by design:

- a highlight ripple behind a point, member or numeral (§17a.4, §17b.4)
- a fill behind its own boundary
- a counter tail meeting its thumb (§18.1)
- `media-bleed` past the safe area (§9.4)

**Absolute positioning is the cause.** A board laid out with flex and grid *cannot* collide; a board laid out with `position:absolute` and hand-picked coordinates collides the moment a string gets longer, a hue changes the metrics, or the chat panel opens. Absolute positioning is legal only inside a diagram's own coordinate space — an SVG `viewBox` where the geometry is computed (§16e) — never for board-level layout.

### 7a.2 A board is at least half full

**Content occupies ≥ 55% of the safe area's height.** Below that the board reads as unfinished: a card with a sentence floating in it.

**Four board kinds are exempt from the floor, and instead carry a ceiling — but not the same one:**

| Kinds | Ceiling | Why |
|---|---|---|
| `divider` | **40%** | A chip and a title. It is a pause, and a pause filled to half has stopped being one |
| `feedback` | **50%** | The F01 layout this document prescribes is a verdict icon, the expanded answer, and the why — three elements that cannot land under 40% |
| `intro`, `section` | **60%** | §44's T02 explicitly allows a title board one specimen of the thing. A hero, a subtitle and one artefact lands near 55%, which is correct, not overfull |

Their job is to mark a beginning, a transition or a verdict — §44 states outright that a title board has "no list, no CTA". A spare board is what makes the boards around it feel dense. For all four, the requirement is that the content is optically centred (§7a.3) and under the ceiling.

**A ceiling is per kind, not per group.** Two kinds share a ceiling only when they carry the same number of elements — the first version of this rule gave one number to all four and failed on the intro and the feedback board in turn.

For every other kind, if a board cannot reach 55%, one of three things is true:

1. It is **under-explained** — the missing content is the fix (a model, a worked step, a labelled figure).
2. It belongs **merged with its neighbour** (§0.3).
3. It has **no claim at all** and should be cut (§34a.6).

**Never scale content up to fill the space.** Type comes from the four steps (§2) and a figure's size from its own rules; inflating either is how a 90px numeral ends up beside 24px body text.

The band's element and word ceilings (§2.6) are the upper bound. Between that ceiling and this floor is the legal range — outside it in *either* direction, the board is wrong.

### 7a.3 One vertical rhythm

A board's blocks sit on **one gap value**, chosen from §7 and held for the whole board. Two blocks 24 apart and the next pair 41 apart reads as a mistake even when nobody can name it.

- **Optically centred, not mathematically.** A stack with a heading on top carries more weight above its centre, so it sits 4–8 units lower than a true centre.
- **A board-level text block is full width with symmetric `padding-inline`**, never `max-width` on a stretched child — stretch pins the left edge and `max-width` then centres the text about the block's own midpoint rather than the board's.
- **Sibling groups use `gap`, never margins** (§7).

## 8. Motion

| Duration | Curve | Use |
|---|---|---|
| 150ms | `ease` | Hover, colour |
| 340ms | `cubic-bezier(.2,.8,.3,1)` | Element enter/exit |
| 600ms | `cubic-bezier(.4,0,.2,1)` | Board transition, shape morph |
| 900ms | `ease` | Draw-on (a line, a stroke, a path) |

One-shot only; nothing loops except a live indicator. Stagger a list by 60ms per row, maximum 5 rows. Everything decorative dies under `prefers-reduced-motion`.

## 8a. The state model

The single largest source of drift across authors. States were never defined, so every author invented a treatment: a green glow for "in the set", grey at 35% for "not in the set", an orange ring for "tap this", a green gradient for "you picked this". **One state, one treatment, on every element class.**

### 8a.1 The ten states

| State | Meaning |
|---|---|
| `default` | Nothing special is true of this element |
| `emphasis` | The element under discussion **right now** |
| `muted` | Present, not in scope this moment |
| `excluded` | Explicitly not a member of the current set / not part of the answer |
| `selected` | The student chose this |
| `disabled` | Not available yet, or not choosable |
| `complete` | Finished, done, already covered |
| `attention` | Act here next |
| `correct` / `wrong` | Outcome of a judged answer (§21) |

**One state per element at a time.** They never stack — a selected item that is also correct shows `correct`, and nothing else.

### 8a.2 The matrix

Element class down, state across. This table is the whole rule:

| | Text / numeral | Shape / region | Marker / point | Control |
|---|---|---|---|---|
| `default` | ink `#212529`/`#495057` | 1px `#e9ecef`, no fill | 8px, `#495057` | §20 resting |
| `emphasis` | its anchor colour + 800, **same size** | 2.5px accent outline, `tint` fill | 12px in accent | — |
| `muted` | `#868e96` at `muted` | outline → `#ced4da` | 8px `#adb5bd` | reduced-contrast label |
| `excluded` | `#adb5bd` at `excluded` | outline → `#e9ecef`, no fill | 6px `#dee2e6` | — |
| `selected` | — | 2px solid accent | 12px accent, 2px white halo | 2px accent border, `tint` fill |
| `disabled` | `#adb5bd` | 1px `#e9ecef` | — | `#f1f3f5` fill, `#adb5bd` label, `not-allowed` |
| `complete` | ink + `ti-check` before it | 1px `#e9ecef` | filled `#495057` | tick, label unchanged |
| `attention` | — | — | — | §8a.3 |
| `correct` / `wrong` | — | — | — | §21 |

Three rules the matrix depends on:

1. **`emphasis` is the only state that may use colour.** `muted`, `excluded`, `disabled` and `complete` are achromatic. A state rendered in a hue competes with the anchors and is read as meaning.
2. **`complete` is a tick, never a green fill.** Green is permanently `correct` (§34.1). A green "done" tile teaches a student that finishing is the same signal as answering correctly.
3. **No state changes an element's size, weight or position** — except `emphasis` on text, which goes to 800 at the *same* size, and `attention`'s one-shot pulse. Scaling an element to highlight it reflows everything around it, and the reflow reads as an error.

### 8a.3 Attention — the one sanctioned glow

Glow was found carrying three different meanings in one module: "tap here", "you selected this", and "this is in the set". **A glow may never carry meaning.** Exactly one glow exists:

```
ring   2px solid <the element's own accent>, offset 3px
halo   0 0 0 6px <same accent at 0.18>
motion pulse 1.4s ease-out, TWO iterations, then it stops
```

- **At most one `attention` element per board**, and only on the thing the student must act on next.
- It **stops on its own** and never returns without a new prompt. A permanent pulse is decoration.
- It is **never colour-coded** — it takes the accent of the element it sits on, so it says *where*, never *what*.
- **No drawn hand cursors, pointers or tap graphics.** The control's own state is the affordance. If a gesture genuinely needs demonstrating, it is a one-shot motion of the object itself, not a cartoon hand parked on the board.

Every other glow, halo, bloom and `drop-shadow` is stripped (§38.5).

### 8a.4 Receding content

A common pattern: prior content shrinks and fades as new content arrives. **Legal only if the receded content is no longer needed.**

- If the student still has to read it, it does not recede — it moves, at `full`, or it leaves the board.
- If it is scenery, it goes to `excluded` (0.30) and **its text is removed**, not faded. Faded text is a contrast failure wearing a design decision.
- Never scale a region below 0.6 to make room. Two boards is the right answer (§0.3).

### 8a.5 Text shadow, gradient and bevel are banned

Not "discouraged" — they appear on numerals, titles and buttons across the library and there is no case where they are correct:

- **No `text-shadow`**, anywhere, on anything. Ink on the canvas needs no lift.
- **No gradient fill** on a button, surface, shape or text. Flat tokens only (a primary button's own vertical pair is the sole exception, §20).
- **No bevel, inner shadow, emboss or 3D edge.** A thick coloured bottom edge on a *static* shape is a bevel. The one exception is a button's base edge (§20.0.1) — a flat solid offset that the press spends — which is an interaction model, not decoration.
- **No cartoon or display font.** The system stack is inherited and never re-declared (§2).

---

# PART 2 — CONTENT COMPONENTS

### 8b. Reveal order

§8 gives durations; nothing gave **sequence**. On a step-by-step maths board the order things appear *is* the explanation, so it cannot be left to DOM order.

1. **Frame first** — axes, grid, empty model, board title. The stage exists before anything happens on it.
2. **Given information** — the numbers or shapes the student starts with.
3. **One step at a time**, in the order a person would do them. Never two simultaneous reveals.
4. **Result last**, and never before the working that produces it.

- **120ms between steps**, using `riseIn`. A reveal that outruns reading is decoration.
- **Nothing already revealed moves when the next thing appears.** Reserve the space up front — a board that reflows on every step is unreadable, and it is the single most common animation defect.
- A student can **step back**. An auto-playing reveal with no way back is a video, not a board.
- Under `prefers-reduced-motion` everything is present immediately, in final position.

### 8c. Loading and failure

Every board that mounts an applet, media or data needs both states, or the student sees a blank canvas and assumes they broke it:

| State | Treatment |
|---|---|
| Loading | The board's frame at `muted`, no spinner over content, no layout shift when it arrives |
| Failed | A `#495057` `ti-alert-triangle`, one plain sentence, and a **Retry** secondary button. Never a raw error string |
| Slow (>3s) | Loading plus one line naming what is loading |

A failed applet **never blocks the module** — the nav row stays live so the student can continue.

## 9. Media

### 9.1 Boxes

| Token | Ratio | Radius | Use |
|---|---|---|---|
| `media-wide` | 16:9 | 16 | Scene, screenshot, video still |
| `media-standard` | 4:3 | 16 | Photograph, scan |
| `media-square` | 1:1 | 16 | Object, tile, grid cell |
| `media-portrait` | 3:4 | 16 | Standing figure, tall diagram |
| `media-circle` | 1:1 | 50% | A face or one cut-out object |
| `media-bleed` | 16:9 | 0 | Full-frame, the only thing on the board |

### 9.2 Rules

- **Always a fixed box + `object-fit:cover`.** Never let an image size itself.
- **No border, no shadow.** If it needs separation, put it in a card as a full-bleed section.
- **Caption outside**, below, 16/500 `#868e96`, `gap-tight`, aligned to the box's left edge.
- **Circles are for subjects** — a face, one object. Never crop a diagram or scene to a circle.
- **A row of media is equal ratio and equal height.** Never mix 16:9 with 1:1.
- **Height caps:** 200 single · 150 in a row of 2–3 · 120 in a row of 4+.
- **Placeholder:** `#f1f3f5` fill, centred `ti-photo` 24px `#adb5bd`, radius per box. Never coloured. **It may carry one `label`-size line in `#adb5bd` naming the asset** (`Applet 3 — Rapid fire`, `lesson-video.mp4`) — that is what makes a placeholder actionable for whoever sources it. Never more than one line.
- **One visual kind per board.** Media and diagrams never share a board.

### 9.3 Slot notation

Layouts declare media slots as `MEDIA[wide|standard|square|portrait|circle|bleed]`, so an author knows the ratio before sourcing the asset.

### 9.5 Diagram descriptions

Every diagram, chart, model and instrument carries a **one-sentence description** naming what it shows and its answer-bearing content — not its appearance.

- **Good:** "A number line from −5 to 5 with points plotted at −3 and 2."
- **Bad:** "Number line diagram." · "An image showing maths."
- **A board whose entire content is a diagram with no description is Tier A.** It is unreadable to a screen reader, unsearchable, and cannot be reviewed at scale.
- The description is authored with the diagram, in the same file. It is not alt text bolted on later.
- Decorative illustration (§30) takes an empty description — explicitly empty, never missing.

### 9.6 Scale honesty

- A figure drawn with stated measurements **is drawn to those measurements**. A triangle labelled 3-4-5 with a visibly wrong shape teaches the student not to trust the picture.
- When a figure genuinely cannot be to scale, it carries `Not to scale` as a `label` in `#868e96`, bottom-right of the figure. **This is required, not optional.**
- Two figures compared on one board share one scale, and that scale is stated once.
- A chart's bar heights are proportional to its values, always (§15a).

## 10. Text blocks

| Block | Spec |
|---|---|
| Prose | `body`, max 560, left-aligned past two lines |
| Lead-in | `body` at `#495057`, one sentence, directly under a title |
| Pull quote | 36/500 `#495057`, no quote marks, attribution 16/700 `#868e96` |
| Definition | Tint panel; term 24/800 accent, definition 24/500 `#495057` |
| Note / aside | Tint panel with a 20px icon, text 24/500 |
| Caption | 16/500 `#868e96` |
| Footnote | 16/500 `#868e96`, one line, board bottom-left |

## 11. Lists

| Kind | Marker | Row surface |
|---|---|---|
| Numbered | 32px badge, radius 12, accent fill, numeral 16/800 white | `surface-sunken` |
| Checklist | 32px badge, `ti-check` when done | `surface-sunken` |
| Bulleted | 8px accent dot, `gap-tight` | plain |
| Stepped | Numbered badges with a 1px `#e9ecef` connector between | plain |
| Key–value | `label` left, `body` right, 1px divider | plain |

Max **5 rows** per board; 3 is the target. Text is always `body`/500.

## 12. Tables

- Header row `label`/700 `#868e96`, uppercase, `.09em`.
- 1px `#e9ecef` row dividers only — **no vertical rules, no zebra fill.**
- Cells `body`/500; numerals tabular and right-aligned.
- Max **5 columns × 6 rows**. Beyond that it's a chart.
- First column left-aligned and may be 700 if it labels the row.

## 13. Formulas & notation

- Formula card: `surface-card`, radius 16, padding `12px 26px`, `resting` shadow.
- Formula text 36/800 `#212529`; the subject term takes the accent (§3.2).
- Fractions: stacked, 24/800, 2px `#7950f2` rule, `line-height:1.05`.
- Operators get `gap-tight` breathing room on both sides.
- Variables italic; numbers upright.
- A derivation is one row per transformation, with only the changed term accented.
- Units 16/700 `#868e96`, never italic.

### 13.1 Fractions

| Part | Spec |
|---|---|
| Stack | Numerator and denominator centred on one axis, `tabular-nums` |
| Bar | **1.5px `#495057`**, width = the wider term + 4 units |
| Bar colour | Inherits ink. **Never its own hue** — a violet bar with a blue numerator and a maroon denominator is three colours saying nothing |
| Colour | A term takes an anchor **only** when it is an anchored referent (§34). Otherwise both are ink |
| Size | Both terms at the parent step; the fraction occupies two lines of that step |
| Inline | A fraction inside prose uses the solidus form `3/4` — never a stacked fraction inside a sentence |

### 13.2 Maths glyphs

Authors type what their keyboard offers, so one module contains both `-3` and `–3`. **One glyph per operator, always the Unicode form:**

| Use | Glyph | Not |
|---|---|---|
| Negative sign / minus | `−` (U+2212) | `-` hyphen, `–` en dash, `—` em dash |
| Multiplication | `×` | `x`, `*` |
| Division | `÷` | `/` (the solidus is for inline fractions only) |
| Equals, not-equals | `=`, `≠` | `!=` |
| Comparison | `<`, `>`, `≤`, `≥` | `<=`, `>=` |
| Ellipsis in a sequence | `…` | `...` |
| Degree, prime | `°`, `′` | `o`, `'` |

The negative sign and the minus operator are the **same glyph**, spaced differently: `−3` closed up, `5 − 3` with a hair space either side. Fully automatable — run it on every module (§38.3).

### 13.3 Geometry, algebra and set glyphs

| Use | Glyph | Not |
|---|---|---|
| Angle, triangle, arc | `∠`, `△`, `⌒` | `<`, `^` |
| Parallel, perpendicular | `∥`, `⊥` | `//`, `\|\|`, `T` |
| Congruent, similar | `≅`, `~` | `=~`, `≈` |
| Approximately, therefore | `≈`, `∴` | `~=`, `so` |
| Degree, prime, double prime | `°`, `′`, `″` | `o`, `'`, `"` |
| Root, pi, plus-minus | `√`, `π`, `±` | `sqrt`, `pi`, `+/-` |
| Set membership, subset | `∈`, `⊂`, `⊆` | `belongs to` |
| Union, intersection, empty | `∪`, `∩`, `∅` | `U`, `n`, `{}` |
| Ratio, proportion | `:`, `::` | `to` |
| Repeating decimal | overline on the repetend | `...`, a dot |
| Function mapping | `→` | `->` |

**Primes are the image notation** (§17c): `A′` is the image of `A`. Never an apostrophe — it renders as a quote and breaks at the wrong size.

**Module titles obey the same table.** The library currently contains `⟂ & ∥ Mixed Booster` alongside titles using ASCII substitutes; titles are normalised with the boards (§43.4).

## 14. Callouts & chips

| Kind | Spec |
|---|---|
| Eyebrow chip | 16/700 uppercase `.09em`, accent ink on its tint, radius 8, `6px 12px`, 14px icon |
| Status badge | Radius 999, tint fill, accent ink 16/700 |
| Key-idea panel | Tint panel, radius 12, `14px 16px`, 20px icon + 24/500 text |
| Warning | Emphasis tint, `ti-alert-triangle` |
| Numeral badge | 32px, radius 12, accent fill, 16/800 white |

One callout per board.

---

# PART 3 — DATA, MATHS & DIAGRAMS

## 15. Charts

| Type | Use | Notes |
|---|---|---|
| Bar | Compare discrete values | Radius 8 top only, min width 24, gap = ½ bar |
| Column stack | Parts of a whole over categories | Max 3 segments |
| Line | Change over a continuum | 2.5px, points 8px, no area fill unless area is the point |
| Area | Accumulation | Accent at 15% alpha under a 2.5px line |
| Scatter | Correlation | Points 8px, 2px white ring |
| Pie / donut | One proportion, ≤3 slices | Donut preferred; label directly |
| Pictograph | Counts for younger students | One glyph = one unit, ≤10 glyphs |
| Number line | Position, intervals, negatives | Full width, ticks, marked points |
| Histogram | Distribution | No gap between bars |

Rules: **max 2 series** (concept violet, then action blue) · value labels 16/700 *above* the mark, never inside · no gridlines behind bars · no legend for a single series — label it directly · axes start at zero for bars · one chart per board.

## 15a. The chart set

§15 covers bar, line and scatter. The data cluster also needs these, and each was being drawn differently per author:

| Chart | Spec |
|---|---|
| **Double bar** | Two series only, `gap-inner` between the pair, `gap-row` between categories. Legend above right, swatch 12 units |
| **Pictogram** | One icon = one key value; the key is **mandatory** and sits above the plot. Partial icons clip **vertically from the left**, never scale. Max 10 icons per row |
| **Pie / sector** | Max **6** sectors; below 5% merge into `Other`. Labels outside with 1px leader lines, never rotated. Start at 12 o'clock, largest first, clockwise |
| **Line plot (dot plot)** | Stacked 12-unit dots over a number line (§17a), 4-unit gaps, no connecting line |
| **Frequency table** | §12, with a `Total` row rule 2px `#495057` |
| **Cumulative frequency** | Frequency table plus a running column; the running column is `muted` until it is the point |
| **Box plot** | Box 56 tall 2px accent, median 2.5px `#212529`, whiskers 1.5px with 24-unit caps, outliers 8-unit circles |
| **Histogram** | Bars touching — the absence of a gap is the meaning. Equal class widths, axis labelled with boundaries |

- **The scale starts at zero** on any chart with a bar or an area. A truncated axis on a teaching board misrepresents the data — §36.5 Tier A.
- **Never a 3D chart, never an exploded pie, never a shadow behind a bar.**
- A chart with one series carries no legend — label it directly.

## 16. Geometry

| Element | Spec |
|---|---|
| Shape outline | 2.5px accent, `stroke-linejoin:round` |
| Shape fill | The accent's tint, opaque |
| Ghost / original | 1.5px `#ced4da`, dash `6 4`, no fill |
| Vertex (static) | none |
| Vertex (draggable) | 10px circle, `#fff`, 2.5px accent border, `resting` shadow |
| Side label | 24/800 accent, 12px outside the edge |
| Right angle | 10px square, 1.5px `#adb5bd` |
| Angle arc | 1.5px accent, r=24, label 16/700 at the midpoint |
| Congruence tick | 1.5px, 8px, `#adb5bd` |
| Parallel arrow | 2.5px accent chevron at the edge midpoint |
| Dimension line | 1px `#868e96`, 6px end caps, label 16/700 centred |
| Area shading | Accent tint, or 45° hatch 1px at 6px pitch |

## 16a. Arrows & connectors

Nothing governed these, so arrowhead size, stroke weight and count varied per author — including triple stacked chevrons at three opacities to mean "continues".

| Part | Spec |
|---|---|
| Shaft | Matches the line it belongs to — axis 2px `#adb5bd`, connector 1.5px `#adb5bd`, emphasis 2.5px accent |
| Head | Filled triangle, **length 3× the stroke width**, half-width 2×. One head unless the relation is genuinely bidirectional |
| Curvature | Straight, or a single arc of constant radius. Never an S-curve, never a hand-drawn path |
| Colour | The connector inherits the colour of what it connects. If the two ends differ, it is `#adb5bd` |
| Label | Sits on the shaft midpoint, `label` step, on an opaque chip if it crosses anything |

**Continuation ("the line goes on forever")** is one arrowhead plus the axis extending into the board's fade — **never a train of ghosted chevrons**. Repeating an arrowhead at decreasing opacity reads as three arrows, and it puts information below the `muted` floor (§3.6).

**A connector must connect.** If it does not join two identified things, it is decoration and is deleted.

## 16b. Congruence, equality and construction marking

The notation of the entire congruence/similarity cluster — SSS, SAS, ASA, AAS, HL, similar triangles, special parallelograms, symmetry. Without it, "these two sides are equal" has to be said in words on every board.

| Mark | Spec | Means |
|---|---|---|
| Side ticks | 1, 2 or 3 short 2px strokes across the side's midpoint, 10 units long, perpendicular | Sides with the same count are equal |
| Angle arcs | 1, 2 or 3 concentric 2px arcs at radius 18/24/30 inside the vertex | Angles with the same count are equal |
| Right angle | A 12-unit square at the vertex, 2px, **never an arc** | 90° |
| Parallel marks | 1 or 2 chevrons mid-side, pointing along the line | Sides with the same count are parallel |
| Equal arcs | Ticks across the arc, same rule as sides | Equal arc length |

- **Marks are ink `#495057` by default**, not an accent. They are notation, not emphasis. A mark takes an accent only when that pair *is* the board's current point (§8a `emphasis`).
- **Never reuse a count across different meanings on one board.** If single ticks mean one equal pair, a second pair takes double ticks — not a different colour.
- **Correspondence order is stated in the text**, not implied: `△ABC ≅ △DEF` with vertices drawn in matching positions.
- **Construction and auxiliary lines** are 1.5px `#adb5bd` dashed `6 4` (§5) and always sit *under* the figure.
- **Dimension lines** (for perimeter, area, volume labels): 1.5px `#868e96` with 6-unit end caps, label on the line in `label`/700, offset 14 units clear of the shape.
- **Hatching** for a region under discussion: 45°, 1px accent at `tint` pitch 6 — or a flat `tint` fill. Never both.

## 16c. Solids — the technical isometric exemption

§31 bans 3D, gradients and highlights. Around forty modules are solid geometry — nets, prisms, pyramids, cylinders, cones, spheres, frusta, Euler's formula, front/side/top views, volume and surface area. **They need a legal way to be drawn, and this is it.** It is an exemption for *diagrams of solids only*; decorative illustration stays flat (§30).

| Part | Spec |
|---|---|
| Projection | **Isometric**, 30° axes. Never perspective, never a vanishing point |
| Faces | **Three flat tones, no gradient**: top `#f1f3f5`, left `#dee2e6`, right `#ced4da`. Accent solids use that accent at 0.16 / 0.10 / 0.06 |
| Edges | Visible 2px `#495057`; **hidden 1.5px `#adb5bd` dashed `6 4`** — hidden edges are shown, always, or the solid is unreadable |
| Curved solids | Two silhouette lines plus a 1.5px ellipse at each end; the far half of the ellipse is dashed |
| Vertex | 6px `#495057` dot, label `label`/700 placed outward from the body |
| Face label | Centred on the face, `label`/700, ink — never rotated to "sit on" the face |
| Cutaway / section | 45° hatch 1px accent, pitch 6 |

**Still banned inside a solid:** rim highlights, inner glow, drop shadow, reflection, texture, a light source that is not top-left.

**Nets** unfold with the base fixed, folds as 1.5px `#adb5bd` dashed, cut edges 2px `#495057` solid, and each face carrying the same label it has on the assembled solid — the label is what makes the net readable as *that* solid.

## 16d. The figure system

**`Shape System.dc.html` is a different thing** — it holds surfaces and buttons (§20.0). This section is about *figures*: every 2D and 3D figure in the library is built the same way: **a vertex set, an edge set, a face set.** Not a drawn path — a described object. That is what makes a shape re-labellable, re-colourable, state-switchable and checkable.

### 16d.1 Vertices

| Part | Spec |
|---|---|
| Position | **Snapped to the lattice** (§16e). A vertex at a non-lattice point is a drawing, not a figure |
| Dot | 6px, the edge's stroke colour. Drawn only when the vertex is named, counted or dragged |
| Label | `label`/700, placed **outward along the exterior angle bisector**, 14 units clear |
| Naming | Capitals, anticlockwise from the lower-left. Images take primes (§17c) |
| Draggable | 12px hit dot, 44px hit area, `attention` on first appearance only |

### 16d.2 Edge variants

Six, and the dash pattern is what distinguishes them — never the colour alone:

| Variant | Stroke | Dash | Means |
|---|---|---|---|
| `edge-subject` | 2.5px `base` accent | — | The figure under discussion |
| `edge-ink` | 2px `#495057` | — | A figure present but not the subject |
| `edge-emphasis` | 3px `base` accent | — | **One** edge being measured or named right now |
| `edge-hidden` | 1.5px `#adb5bd` | `6 4` | Behind a solid (§16c) — always drawn |
| `edge-construction` | 1.5px `#adb5bd` | `2 6` | Auxiliary line, mirror line, axis of symmetry, altitude |
| `edge-ghost` | 1.5px `#ced4da` | `4 4` | A previous position or a pre-image |

**Three distinct dash patterns, three distinct meanings.** `6 4` is hidden, `2 6` is construction, `4 4` is ghost. Reusing one pattern for two meanings is what makes a busy geometry board unreadable.

### 16d.3 Face variants

| Variant | Fill | Use |
|---|---|---|
| `face-none` | transparent | **Default.** Perimeter, angles, classification — anything where the interior is not the point |
| `face-tint` | accent at 0.12 | The region under discussion: area, a counted region |
| `face-solid` | accent at 0.85 | A *quantity* of the whole — shaded fraction parts, filled bars |
| `face-shade` | `#f1f3f5` | Context: a figure that is present, uncoloured, and not the subject |
| `face-hatch` | 45°, 1px accent, pitch 6 | Subtracted, overlapped or double-counted regions |
| `face-muted` | `#f1f3f5` at `muted` | Out of scope (§8a) |

**A face is transparent unless the interior carries meaning.** Filling every shape because a fill is available is how a geometry board becomes a colour chart.

### 16d.4 Shape states

The §8a matrix, expressed for figures — this is the highlighted / dehighlighted set:

| State | Edge | Face | Labels |
|---|---|---|---|
| **Highlighted** (`emphasis`) | `edge-subject` 2.5px accent | `face-tint` | Full, in the accent's `deep` stop |
| **Default** | `edge-ink` | `face-none` | Full, ink |
| **Shade only** | 2px `#ced4da` | `face-shade` | Hidden — the shape is scenery |
| **Dehighlighted** (`muted`) | 1.5px `#ced4da` | none | `#adb5bd` |
| **Excluded** | 1.5px `#e9ecef` | none | Removed |
| **Ghost** | `edge-ghost` | none | Primed, `muted` |
| **Selected** | 2px accent | accent 0.12 | Full |

- **State changes stroke and fill only** — never the vertex positions, never the size (§8a.2). A figure that grows when highlighted moves everything around it.
- **One highlighted figure per board** (§0.6). If two figures are compared, the comparison itself is the subject: both take `edge-subject`, and the *difference* between them takes `edge-emphasis`.
- A dehighlighted figure keeps its shape and loses its colour — it never blurs, shrinks or fades below `muted`.

## 16e. Grids & lattices

A shape is only re-drawable if its vertices sit on a defined lattice.

### 16e.1 The 2D lattice

| Part | Spec |
|---|---|
| Authoring space | An SVG `viewBox` in **lattice units**, not pixels — so the figure scales with the board and never carries pixel sizes inward |
| Pitch | 20 units, the working unit for every vertex |
| Minor line | 1px `#e9ecef` |
| Major line | Every 5th, 1px `#dee2e6` |
| Axis | 2px `#adb5bd` with arrowheads (§16a) |
| Origin | 6px `#495057` dot, labelled `O` |

**Visible when** the grid is being counted or read from — area by unit squares, coordinates, translations by vector, slope. **Hidden when** it is only construction scaffolding. A visible grid that nobody reads is texture, and it competes with the figure.

Vertices snap to the pitch. A figure needing half-pitch vertices is drawn at half pitch throughout, never mixed.

### 16e.2 The isometric lattice

| Part | Spec |
|---|---|
| Axes | 30° / 150° / vertical |
| Cell | 20-unit edge — the unit cube |
| Lines | 1px `#e9ecef`, all three directions when visible |
| Face tones | Top `#f1f3f5` · left `#dee2e6` · right `#ced4da` (§16c) |

**One light source, from the top-left, for every solid on every board.** Two solids lit differently on one board is the fastest way to make a page look assembled by two people.

Use for unit cubes, volume by counting, nets, prisms, spatial visualisation and front/side/top views — where the third dimension must be counted. **Not** for a solid whose shape alone is the point; a 2D silhouette with a labelled dimension is clearer.

### 16e.3 Dot lattice

For pattern work, arrays, polygon construction and geoboard tasks: 4px `#dee2e6` dots at 20-unit pitch, no lines. Reads as guidance rather than as a chart, so it never competes with the figure drawn on it.

## 17. The graph sheet

**Reference implementation: `Graph System.dc.html`. It measures its own contrast at render time across every hue; trust it over any number written here.**

### 17.0 Three tiers, deliberately far apart

Grid, axes and plot must never be mistaken for one another. **The grid recedes, the axes hold, the plot leads** — narrow those gaps and a graph becomes a decorated page rather than a diagram.

| Tier | Spec | Reasoning |
|---|---|---|
| Minor grid | 1px `#f0f2f7`, every unit | A ruler, not content. If you notice it before the data, it is too strong |
| Major grid | 1px `#e4e8f0`, every 5th | Orientation only |
| Axes | **2px `#495057`**, arrowheads at all four ends | The frame of reference is never implied |
| Ticks | 1.5px `#adb5bd`, every unit — **3px long when numbered, 5px when not** | A tick is a locator; with a number beside it, it only has to mark *where* |
| Plot | 2.5px in the anchor's `base` | The only saturated thing on the sheet, which is why it leads |

**The origin is a drawn dot** (3px ink), because it is a coordinate like any other. Its **`0` has one permanent home**: left of the y-axis and below the x-axis, clear of both — never centred on the axis line, and never in the y-tick column where the `−1` label collides with it.

**The first unit below the x-axis is reserved for tick labels. Nothing is plotted there.** Moving the labels cannot fix a collision in that band — a marker at `y = −1` spans it whichever side the label sits.

### 17.1 The two sheets

| Sheet | Use when |
|---|---|
| **Labelled** | A value must be read off the plane. Tick numbers, the origin's `0`, named objects |
| **Unlabelled** | The *shape* is the lesson — symmetry, slope, direction, growth |

**Both name their axes.** Dropping the numbers never means dropping `x` and `y`.

### 17.2 The five plottables

The drawn form carries the maths, so form and meaning are locked together:

| # | Kind | Form |
|---|---|---|
| 1 | Point | 4.5px filled dot with a 2px white ring |
| 2 | Line | Runs to both edges, **arrowhead at each end** |
| 3 | Segment | **Endpoint dots, no arrowheads** |
| 4 | 2D shape | Stroked boundary, **10% fill**, vertices marked |
| 5 | 3D shape | Isometric (§16c) — three flat tones, one top-left light source, **opaque** faces |

**Arrowheads continue; endpoint dots stop.** That single distinction separates a line from a segment, and it is the maths — never draw one with the other's ending.

**A point is small.** It marks a *coordinate*, so precise beats prominent — 4.5px, never scaled up to draw attention.

**A ring separates, and a vertex must not be separated.** A standalone point takes a white ring so it reads over gridlines. An **endpoint or a vertex takes none** — it belongs to the line it terminates, and a ring cuts a gap so the segment appears to stop short of itself.

**A fill is 10%** so gridlines still count *through* the shape, because the count is usually the point.

**A solid sits wholly inside one quadrant**, clear of the tick row — otherwise it occludes the axis it is measured against. Derive its anchor from its own projected extent; a hardcoded anchor drifts the moment the sheet is rescaled.

### 17.3 The three states

| State | Treatment |
|---|---|
| Default | 2.5px stroke, 10% fill, 4.5px dots |
| Disabled | 1.5px `#ced4da`, no fill, 3.5px dots, labels `#9aa0a6`. **Keeps its position** — it is still true |
| Highlighted | 3.5px stroke, 18% fill, a soft halo behind linework, and a **two-ring ripple behind a point** |

**State never moves *or resizes* a point.** A bigger dot covers more of the plane and quietly changes what the point says, so a highlighted point keeps its exact size and gains a ripple behind it instead.

**A highlighted object gets a halo, not a different colour** — its identity has to survive the emphasis. One highlighted object per sheet.

**Labels sit clear of what they name** — never on a dot, never across a line, never inside the axis-furniture band.

## 17a. Number line

**Reference implementation: `Number Line System.dc.html`. It measures its own contrast at render time across every hue; trust it over any number written here.**

A number line adds **no new devices** — it is the graph sheet’s axis on its own with the grid removed: the same 2px ink, the same arrowhead construction (§16a), the same generated hue (§3.7) for anything marked.

### 17a.1 The two sets

**The ends declare the set**, drawn and never captioned — it is the first thing a student reads.

| Set | Ends |
|---|---|
| **Whole numbers** | A 3px square cap at zero, one arrowhead right. The cap *is* the rule: nothing exists left of zero in this set |
| **Integers** | An arrowhead at each end. The line continues forever both ways, and the heads say so |

**Stacked lines on one board share the same unit width**, or the comparison between them is a lie. That is the whole point of an “extending the number system” board, so both sets are laid out on the same span.

### 17a.2 The line

| Part | Spec |
|---|---|
| Axis | 2px `#495057`, running **into** the arrowhead’s base — never stopping short of it |
| Tick | 1.5px `#adb5bd`, **5 units either side** |
| Zero | 2.5px ink tick, label 800 — the only emphasised tick by default |
| Tick label | 12/700 `#6b6390` **below** the line, `tabular-nums` |
| Spacing | Equal, always. A broken or compressed scale never appears on a teaching line — the spacing *is* the quantity |
| Range | Symmetric about the region being taught; never more than 17 ticks |

**Every number prints its minus as `−` (U+2212), never a hyphen** (§13.2). `String(-3)` emits U+002D, so a tick label and a marked value 50px apart will silently disagree — route every number through one formatter.

**Only the marks take a hue.** Axis, ticks and numbers stay ink at every angle. That is why a line reads identically whichever hue it counts in, and why two lines in different hues can share one board.

**Tick labels are never colour-coded by sign** (§3.3).

### 17a.3 The two marks

| Mark | Form |
|---|---|
| **Point** | 5px filled dot with a 2px white ring |
| **Region** | A 6px accent rule along the axis plus a band behind it, with endpoint markers |

**Filled means in, hollow means out.** A region’s endpoints carry interval notation — the one place in this system an unfilled marker is legal, and it is maths, so it is never restyled for looks.

**A point wears a ring; an endpoint does not.** A point sits *on* the axis and the ring lifts it clear; an endpoint belongs to the band it terminates, so a ring would cut a gap in it (§17.2).

**Labels go above, ticks below** — two permanent rows, so a marked value and its tick number can never be confused.

**Direction chips** (“Negative integers”) are chips per §14 below the axis, aligned to the region they name — never solid blocks in a hue chosen for sign.

### 17a.4 The three states

| State | Treatment |
|---|---|
| Default | 5px dot, **5% band**, 6px rule |
| Disabled | `#ced4da`, 3.5px dot, **no band** — and it keeps its position, because it is still true |
| Highlighted | Ripple behind the point, **26% band**, 9px rule |

**A default band only has to show the region exists; a highlighted one has to single it out.** At 10% against 20% the highlight read as the same region slightly warmer — hence 5% and 26%.

**State never moves or resizes a mark.** A point highlights with a ripple behind it, a region by deepening its band. A mark that shifts when emphasised has changed the value it names.

**Disabled keeps the value legible.** The achromatic stroke, smaller dot and absent band carry the signal — a marked value is the *value*, not the control (§20.0.2).

**One highlighted mark per line.** Two is none.

## 17b. Set & Venn diagrams

**Reference implementation: `Venn & Set System.dc.html`. It measures its own contrast at render time across every hue; trust it over any number written here.**

A set diagram adds **no new devices** — regions are figures (§16d), and the two things that can be marked are the same pair the number line uses (§17a): a **region** and a **member**.

### 17b.1 The three relations

Given two sets, either one contains the other, or they share some members, or they share none. **There is no fourth case** — the set of diagrams is closed by the mathematics, not by preference.

| Relation | Drawn as | Because |
|---|---|---|
| **Nested** (A ⊂ B) | Rounded rectangles, one inside the next | Every label needs a flat band of its own, and the ring between two concentric circles gives none |
| **Overlapping** (A ∩ B ≠ ∅) | Two circles | The lens is the subject, and only a curve reads as a region belonging to both |
| **Disjoint** (A ∩ B = ∅) | Two circles apart | The gap *is* the claim, so nothing is drawn between them |

The relation is drawn, never captioned. Nesting stops at **four levels** — past four the innermost band is too thin to hold a label, and the stack splits across two boards.

### 17b.2 Anatomy

| Part | Spec |
|---|---|
| Boundary | **2px** in the set's hue at `base`. Always stroked — a set without an edge cannot be pointed at |
| Fill | **Opaque**, painted over its parent. Outermost `oklch(90% .075 h)` → innermost `oklch(96% .03 h)` |
| Label | The hue's `deep` stop (`oklch(32% .10 h)`) at the `body` step, weight 700 |
| Label position | In its own band — never over a nested child, never over a member, never rotated to follow a curve |
| Members | Ink `#212529`, weight 700, at full opacity **in every state** |

Four rules the anatomy depends on:

1. **Fills repaint, never stack.** Every region is opaque. Three translucent regions produce a fourth and fifth colour that mean nothing, and leave the innermost set darkest — implying the most-nested set matters most, which is the opposite of the mathematics. *An alpha fill cannot satisfy this: alpha stacks by definition.*
2. **Depth decreases inward.** Outermost deepest, innermost lightest, six lightness points across the whole stack. Enough to read the nesting, not enough for any level to dominate — and it keeps the smallest region the most legible.
3. **Labels sit in top bands, members in bottom bands.** Each ring gets a strip at its top for the name and one at its bottom for what that ring adds, so a student reads down the diagram and gets the sets in order.
4. **Only regions take the hue.** Members, and the ink they are set in, stay neutral at every angle — which is why two diagrams in different hues can share a board.

### 17b.3 Hue

One hue angle generates every value (§3.7). **Overlapping and disjoint sets share a single hue**, and the lens is that hue one step deeper (`oklch(88% .085 h)`) — a lens cannot wear two hues at once without inventing a third meaning.

**Per-set hues are for nested diagrams only**, where regions never overlap: maximum four, and only when those sets are anchored individually elsewhere in the module. Otherwise one hue for the whole diagram.

**Set anchors are module-level, not board-level.** If "Natural numbers" is violet on board 3 it is violet on board 12, in its label, its boundary and its fill (§34, §43.2). A set that changes colour between boards has taught the student that colour means nothing.

### 17b.4 The three states

| | Boundary | Fill | Label | Members |
|---|---|---|---|---|
| **Default** | 2px `base` | as above | `deep`, 700 | ink |
| **Disabled** | 2px `#ced4da` — the set is still a set | none | `#868e96` | **ink, unchanged** |
| **Highlighted** | 3px `base` | `oklch(82% .13 h)` | `deep`, 800 | ink |

- **A region highlights by deepening; a member highlights by rippling** — two discs behind it in the set's own hue at 10% and 16%. Neither moves, resizes or changes shape. A region that grows changes what it claims to contain; a member that grows looks like a different value.
- **One highlight per diagram**: one region and one member at most. Two highlighted regions is a comparison, and a comparison has to be stated in words as well.
- **Disabled removes colour, not legibility.** Members are the value; the region around them is the annotation. Same line as the disabled slider (§18.3), the disabled counter (§18a.3) and the disabled number line (§17a.4).

## 17c. Transformations — pre-image and image

Dilation, reflection, rotation, translation, series of transformations, similarity. One convention, or a student cannot tell which figure is the answer.

| Part | Spec |
|---|---|
| Pre-image | 2px `#adb5bd`, no fill, vertices `A B C` |
| Image | 2.5px accent, accent at `tint` fill, vertices `A′ B′ C′` (prime, U+2032) |
| Mapping | One 1.5px `#adb5bd` dashed arrow per corresponding vertex, or **one** arrow for the whole figure — never a mix |
| Mirror line | 1.5px `#adb5bd` dash `6 4`, labelled at its end |
| Centre of rotation / dilation | 8px `#495057` dot, labelled, always drawn |
| Rotation | A single arc arrow at the centre carrying the angle and direction |
| Scale factor | On the board as `k = 2`, and in a `label` on one mapping arrow |
| Series | Each stage keeps its own prime count — `A′`, `A″`. Intermediate stages take §8a `muted` |

**The pre-image never disappears.** A transformation board that shows only the result has removed the thing being taught.

---

# PART 3B — THE MODEL LIBRARY

**One model per job, drawn the same way every time it appears in the library.** §36.2 says a module uses one visual model; this part says what the legal models *are*. A model not listed here is a new entry, added before use.

## 17d. Counting & early number

| Model | Spec | Used by |
|---|---|---|
| **Counter** | 36-unit circle (Early: 44), flat accent fill, no shadow. Countable objects are identical | Counting, one-to-one, sharing |
| **Ten-frame** | 2×5 grid, 44-unit cells, 1.5px `#adb5bd`, filled left-to-right then top-to-bottom | Number bonds, adding to 10, doubles |
| **Dot pattern** | Fixed dice/domino arrangements, never re-arranged between boards | Subitising, visual dot representation |
| **Tally** | Four 2.5px verticals + a diagonal fifth, groups spaced 14 apart | Tally marks, tally tables |
| **Base-10 blocks** | unit 20· rod 20×200 · flat 200² · cube isometric (§16c). One tone per place | Place value, rods and flats, regrouping |
| **Number bond** | A whole in a circle, two parts below, 1.5px `#adb5bd` connectors | Decomposing, number pairs |
| **Group ring** | 1.5px dashed `#adb5bd` enclosure around counters | Making equal groups, division |

**A counter is never an illustration.** No faces, no fruit, no themed art — the object must be countable at a glance, and decoration slows counting.

## 17e. Fraction models

| Model | Spec |
|---|---|
| **Area — bar** | The default. 400×80 rectangle, 1.5px `#495057`, equal partitions, shaded parts accent at 0.85 |
| **Area — circle** | Only for halves, thirds, quarters, sixths, eighths. Beyond that, humans cannot compare sectors |
| **Set** | Counters in a group ring, shaded members in accent |
| **Number line** | §17a, with the denominator as the minor-tick subdivision |
| **Fraction strip stack** | Bars of equal total length, stacked, one row per denominator, aligned left |

- **Partitions must be geometrically equal**, measured, not eyeballed — the whole concept is equal parts.
- **One whole is one size across the entire module.** Comparing ⅓ and ½ with different-sized wholes is the classic fraction error, and it is a §36.5 Tier A failure.
- Unshaded parts are `#fff` with the same outline — never `excluded` grey; they are still part of the whole.

## 17f. Bar / tape models

For ratio, proportion, comparison, part-whole word problems, factors and multiples.

| Part | Spec |
|---|---|
| Segment | Height 56, 1.5px `#495057`, accent `tint` fill, **equal segments are equal widths, measured** |
| Label | Inside when it fits, otherwise on a bracket below |
| Bracket | 1.5px `#868e96`, 8-unit end caps, label centred |
| Unknown | `?` in `figure`/800 accent inside the segment |
| Comparison | Two bars, left-aligned, gap 14 — the difference is the visible overhang |

A tape model is **not** a bar chart (§15). It has no axis and its length encodes a quantity relationship, not a measured value.

## 17g. Structure diagrams

| Model | Spec |
|---|---|
| **Factor tree** | Branches at 45°, 1.5px `#adb5bd`; composite nodes ink, **prime leaves circled** 2px accent |
| **Step / ladder** | Divisor column left, quotients descending, 2px `#495057` L-rules; final row boxed |
| **Probability tree** | Left-to-right, branch label above the line, probability below, outcomes in a right-hand column |
| **Sample-space grid** | Table with both dice/coins on the axes; the counted cells take accent `tint` |
| **Arrow / mapping diagram** | Two ovals, elements listed, one arrow per pair (§16a); a many-to-one fan is the point, so never tidy it away |
| **Pattern strip** | Terms in a row with position numbers below, the next term as an empty 2.5px dashed slot |

## 17h. Measurement instruments

| Model | Spec |
|---|---|
| **Ruler** | Major tick 16 units + label, minor 8, zero at the object's left edge — **always show the zero end** |
| **Protractor** | Semicircle, both scales, centre cross on the vertex, the measured arm highlighted in accent |
| **Balance scale** | Symmetric pans, beam tilt proportional to the difference, level when equal |
| **Beaker** | Graduations with labels, liquid at accent 0.85, flat surface — no meniscus, no gloss |
| **Clock** | Hour hand 0.55× radius / 3px, minute 0.85× / 2px, 12 major + 60 minor ticks, numerals at Early band only |

An instrument is a **diagram, not an illustration** (§30) — its scale must be accurate enough to read the answer off it.

## 17i. Arithmetic notation

The column-arithmetic cluster is ~60 modules and had no spec. **Alignment is a correctness issue** — misaligned columns teach the wrong algorithm.

| Part | Spec |
|---|---|
| Digits | `figure`/700, **`tabular-nums` mandatory**, one 44-unit column per place |
| Rule line | 2px `#495057`, spanning the widest row + 8 units each side |
| Operator | Left of the last row, outside the digit columns |
| Carry | Above its column, 0.5× the digit size, emphasis orange |
| Borrow | Struck original 1.5px `#adb5bd`, new value above it at 0.5×, emphasis orange |
| Partial product | Its own row, place-shifted, `muted` until it is the current step |
| Long division | 2px bracket; quotient above, aligned to the dividend's places; each bring-down on its own row |
| Current step | §8a `emphasis` on that column only — never a coloured box around the whole sum |

## 17j. Equation working

| Part | Spec |
|---|---|
| Step stack | One equation per row, **`=` signs vertically aligned across every row** |
| Operation note | Right of the row, `label`/700 `#868e96`, e.g. `− 3 both sides` |
| Changed term | §8a `emphasis` on that term only, in the step where it changes |
| Substitution | The substituted value in concept violet, in both the source and the target |
| Balance model | Two pans (§17h), tiles or counters per term, removed in pairs |
| Solution | Final row boxed: 2px accent, radius 12, accent `tint` |
| Check | An optional final row, `muted`, headed `Check` |

**Never more than the band's step ceiling** (§2.6) on one board. A seven-line solve on a Middle board is two boards.

---

# PART 4 — INTERACTIVE

## 18. Slider

**Reference implementation: `Slider System.dc.html`. It measures its own contrast at render time across every hue; trust it over any number written here.**

A slider invents **no new visual devices**. The track is a surface, the thumb is a button carrying the same flat base edge (§20.0.1) and spending it on grab, and every colour is generated from the anchor's hue angle (§3.7). That is what keeps five types looking like one control.

### 18.1 Anatomy

| Part | Spec |
|---|---|
| Track | **16px**, radius 999, `oklch(93% .06 h)` — a tint of the accent, never neutral grey |
| Fill | The traversed run, `base` (`48% .19 h`) |
| Notches | **2px**, full track height, at every **interior** stop. `oklch(72% .10 h)` unpassed, `oklch(80% .12 h)` passed |
| Thumb | **40px** circle, neutral face `oklch(96% .022 295)`, 4px base edge `oklch(78% .05 295)` |
| Counter | Fits its digits, 34px tall, radius 12, `base` fill, white 800, **tethered by a tail** |
| Tick labels | 15/700 below the track, active stop 800 in the hue's `text` |
| Inline label | `body`/700 left of the track, vertically centred, never above it |

**The bar leads and the thumb rides it.** A 44px thumb on a 12px track is top-heavy — the handle dominates the thing it moves along. The visual thumb is 40px; **the hit target stays 44px** via the input overlay, so the touch area never shrinks with the styling.

**The track wears the accent.** A grey track with a coloured fill reads as two objects that happen to overlap; one hue family reads as a single control with a filled part and an empty part — which is what it is.

**Markers cut through the bar, they never sit on it.** A dot resting on a track is neither a stop nor a division. A notch divides the bar into the parts being counted, which is usually the maths. Interior stops only — the bar's own ends already mark 0 and max.

**The counter is tethered.** A tail joins it to the thumb, and the chip fits its digits with 12px padding — it never floats free, and it never reserves width it is not using.

### 18.2 The five types

Two switches — **the scale** (none / markers / markers + labels) and **the counter** (off / on) — closed by one rule:

> **The value is shown once** — as labels, or as a counter, never both. Two readouts of the same number make the student check which one to believe.

That rules out the sixth combination and leaves exactly five:

| # | Type | Use when |
|---|---|---|
| 1 | Plain | Continuous, and the value is not the point — an explode-view from 0 to 1. The object it drives is the feedback |
| 2 | Markers | Discrete, few stops. The student counts divisions and reads the value off the object |
| 3 | Markers + labels | Discrete, and the scale itself must be readable — here the labels **are** the readout |
| 4 | Plain + counter | Continuous and the value matters. The counter is the only readout, so it never hides |
| 5 | Markers + counter | Discrete, value matters, but the individual stops need no naming |

**The value is always reachable.** The counter shows it, the labels name it, or the object the slider drives makes it obvious. A slider whose value is nowhere teaches nothing.

**Discrete means notches.** If the input snaps, the divisions are drawn. Above 12 stops drop them — they become texture — and use a counter instead (type 4).

### 18.3 The three states

| State | Treatment |
|---|---|
| Default | As §18.1 |
| Highlighted | The row sits on a plate in `fill2` with `inset 0 0 0 3px` at `base`; row label to 800 |
| Disabled | Achromatic — track `#f1f3f5`, fill `#c9ced4`, notches `#9aa0a6`, thumb edge shortened to **3px with no travel** |

**Highlighted is the surface's own highlighted state** (§20.0.2), not a new device — so it works identically for all five types. The slider itself never changes, and **siblings are never dimmed to fake it**. One highlighted slider per board; two is none.

**Losing the depth is how disabled says "not yet."** Geometry is kept and the control is never hidden — removing it reflows the board.

**Disabled keeps the value legible.** Its *control label* may dim, because an inactive control is WCAG-exempt. Its **tick labels and counter may not** — those are the value, not the control (§20.0.2).

### 18.4 Layout

- Label left of the track, vertically centred, never above it.
- Track length 320 min, 480 max; vertical 240–360.
- **Tick labels clear the thumb, not the track.** The thumb plus its base edge reaches 32px below the track top, so a label row tucked under the track sits beneath it — and it strikes the *active* stop, the one the student is reading.
- End labels carry the unit if there is one, and so does the counter. Never a bare number where a unit exists.

## 18a. Counter

**Reference implementation: `Counter System.dc.html`. It measures its own contrast at render time across every hue; trust it over any number written here.**

A counter is **two buttons and one surface** — nothing new. Same 20px radius, same flat base edge (§20.0.1), same generated hue (§3.7).

### 18a.1 Anatomy

| Part | Spec |
|---|---|
| Value | 72×96 min, radius 20, `oklch(88% .155 h)`, numeral `figure` 38/800 in `deep`, `tabular-nums` |
| Lift | `0 5px 14px -9px rgba(70,46,146,.4)` — a soft ambient shadow, **never a base edge** |
| Minus / plus | 56px buttons, radius 20, 4px base edge, glyph in the hue's `text` |
| Glyphs | **4px rounded bars** at 22px — never an icon stroke |
| Shell | Optional, radius 20, `fill` tint, `12px 16px` padding |

**The value always leads**, and it leads *by hierarchy, never by volume*: larger, one step darker, lifted. A saturated tile shouts on a board whose subject is elsewhere, and this element appears on every counter, so it sets the room's volume.

**Loud buttons around a plain number are forbidden** — that makes the student read the controls before the quantity, which is backwards on a board about the quantity.

**One hue family, no grey.** A button's face is always one step lighter than whatever it sits on — the accent's `fill` when bare, white on a shell — and its edge derives from the same hue. Grey handles beside a tinted value tile read as two unrelated controls that happen to be adjacent.

**The value is a surface**: read, never pressed, so it carries no base edge — that would make it look tappable.

**Glyphs are bars, not icons.** A 1.5px icon stroke disappears at classroom distance on a control meant to be used quickly.

### 18a.2 The two types

One switch — **the shell** — because the value always leads, so there is no second axis.

| # | Type | Use when |
|---|---|---|
| 1 | Bare | The counter stands alone on the board. Buttons take the accent's `fill` tint |
| 2 | Held | A `fill` shell groups the three into one object. Buttons go **white** — always one step lighter than what they sit on. Use when the counter shares a board with other controls |

### 18a.3 The three states

| State | Treatment |
|---|---|
| Default | As §18a.1 |
| Highlighted | The shell becomes a plate in `fill2` with `inset 0 0 0 3px` at `base` |
| Disabled | Achromatic — value `#c9ced4`, buttons `#f1f3f5`, edges 3px with **no travel**, lift removed |

**A bare counter grows a shell when highlighted** — the one case where a plate appears from nowhere, because a highlight has to enclose something.

**Disabled keeps the value legible.** Glyphs may dim (inactive controls are WCAG-exempt); the numeral may not — it is the value, not the control (§20.0.2).

### 18a.4 Limits and sizing

- **At a floor or ceiling, one button disables — never the counter.** Disabling wholesale tells the student they broke it; one flat button tells them which way is still open.
- **The value never resizes.** A minimum width sized for the largest value in range, `tabular-nums`. A counter that widens from `9` to `10` shifts everything beside it.
- **One counter per board carries the accent.** A second competes with the first for the same job.

## 19. Other controls

| Control | Spec |
|---|---|
| Option row | Row + 32px letter badge; `2px` accent border when selected |
| Media option | `media-square` + letter badge top-left on a scrim |
| Numeric input | See §19a — an answer box is its own component, not a row entry |
| Toggle | Track 44×24 radius 999; knob a **20px-diameter** circle. The knob is a button (§20.0) and carries its base edge |
| Stepper | See §18a — a counter is its own component, not a row entry |
| Drag token | Radius 20, neutral face, 4px base edge — it is a button that happens to move |
| Drop zone | 1.5px dashed `#adb5bd`, radius 12, tint fill on hover |
| Match pair | Two columns of rows; 2.5px accent connector once linked |
| Hotspot | 32px circle, accent at 40%, pulses once on board entry |

Minimum hit target **44px**. Every control has a visible resting state — nothing is discoverable only by hovering, because there is no hover on tablet.

## 19a. Text & answer boxes

The control a student touches most, and it had one line of spec. Every state is defined here, because an undefined state is an invented one.

| Part | Spec |
|---|---|
| Box | Radius 20, `#fff`, 1px `#e9ecef`, min 44px tall |
| Width | Sized to the **expected answer length** — 3 units per character, min 88, max 320. A full-width box for a two-digit answer tells the student the answer is long |
| Value | `figure` 44/800 `#212529` when numeric, `body` 24/500 when prose. Centred for numeric, left-aligned for prose |
| Placeholder | Never a hint or an example answer. Either empty, or a `label` naming the unit |
| Unit | **Outside** the box, `label` 16/700 `#868e96`, 8 units right — never inside, never typed by the student |
| Caret | Accent |

| State | Treatment |
|---|---|
| Resting | As above |
| Focused | 2px accent border. No glow, no shadow change, no size change |
| Filled | 1px `#e9ecef` — the value carries the weight |
| Correct | 2px `#40c057`, fill `#ebfbee`, `ti-check` **outside** the box, right |
| Wrong | 2px `#e03131`, fill `#fff5f5`, `ti-x` outside, right. **The student's value stays** — clearing it removes the thing they need to look at |
| Disabled | `#f1f3f5` fill, `#adb5bd` value, 1px `#e9ecef` |

**An answer box never shakes, flashes or pulses on a wrong answer.** The border and the icon are the signal; motion on failure reads as punishment.

## 20. Buttons

| Kind | Style | Use |
|---|---|---|
| Primary | `base` fill at the board's anchor angle, white 800, radius 20, `20px 34px`, 5px base edge (§20.0.1) | Check, Continue, Start |
| Secondary | Neutral face `oklch(96% .022 295)`, radius 20, `#212529` 800, 4px neutral base edge | Hint, Show steps, Try again |
| Ghost | transparent, accent 16/700, no edge — the only button without depth | Reveal, Expand |
| Text link | `#868e96` 16/700, underline 3px offset | Skip |

**Labels are sentence case** — "Check answer", "Plot integers". Never `YES` / `NO` / `SAME OR DIFFERENT?`; uppercase belongs to the `label` step only (§2.1).

### 20.0 Surfaces and buttons — the two shape families

**Reference implementation: `Shape System.dc.html`, which measures its own contrast at render time.** This section supersedes the earlier per-component geometry: everything that holds content or is pressed is one of these two families, and nothing else exists.

One base shape — the rounded rectangle at **20px radius**, for both — and both **fit to content**. Radius therefore carries no meaning. **Depth does.**

**One carve-out: the slider thumb is a circle** (§18). It is a button in every other respect — same face, same base edge, same press travel — but it slides continuously along a track, and a rounded rectangle reads as a thing that occupies *positions*. The shape has to say "this moves freely", which only a circle does. Nothing else in either family is exempt.

| | Surface | Button |
|---|---|---|
| Sits | Flat on the page | Raised on a solid edge |
| Fill | `fill` at rest | Face + `edge` beneath it |
| Stroke | **None at rest** | None |
| Padding | `18 / 26` | `20 / 34`, min height 64 |
| Label | 700, hue's `text` | 800 |
| Pressed | — | Face travels down by the edge height |

**Why depth and not radius.** It reads at any size, in greyscale, to any age, at a glance — a pill-vs-rectangle distinction does not survive being scaled into a diagram, and a border-weight distinction does not survive a screenshot.

#### 20.0.1 The base edge — a sanctioned exception to §8a.5

§8a.5 bans bevels. **A button's base edge is not a bevel and is required**, and the distinction is exact:

- A **bevel** fakes three dimensions on a static surface with a gradient body, a lit top face and an inner highlight. It decorates. Still banned, everywhere.
- A **base edge** is a *flat solid offset* — `box-shadow: 0 5px 0 <edge>` — in the face's own hue at `L 36%`. No blur, no gradient, no highlight. It encodes the interaction: **pressing spends it.** The face translates down by exactly the edge height and lands level with the page, then returns.

That travel *is* the affordance, and for a 10–14 audience it is the single most legible "this can be pressed" signal available. Nothing else about a press changes — no scale, no bounce, no colour flash.

#### 20.0.2 Surface — four states

A surface is never pressed, so it has no selected state.

| State | Treatment |
|---|---|
| Default | `fill` alone |
| Highlighted | `inset 0 0 0 3px` at `base` — **inset**, so the shape does not grow and nothing reflows |
| Negative | The wrong arc (25°) used as itself |
| Disabled | `#f1f3f5` fill, label stays `#495057` |

**The stroke appears in exactly one state.** That is what makes it mean something — and it is why a surface carries no border at rest.

**Disabled removes colour, never legibility.** A surface still carries a term the student must read, so its label stays ink; only a *button* may dim its label, and only because an inactive control is WCAG-exempt.

#### 20.0.3 Button — six states

| State | Face | Edge | Label |
|---|---|---|---|
| Default | neutral `96% .022 295` | `78% .05 295` | ink |
| Highlighted | `base` | `edge` | white |
| Selected | `fill` | `edge` | `text` |
| Correct | `fill 145°` | `edge 145°` | `text 145°` + `ti-check` |
| Wrong / negative | `fill 25°` | `edge 25°` | `text 25°` + `ti-x` |
| Disabled | `#f1f3f5` | `#dfe3e7`, **3px, no travel** | `#adb5bd` |

- **Correct and wrong are one state each, shared with negative.** They appear only after an answer is judged — never as a selection, never as an anchor.
- **Selected is a tinted face, never a solid one** — a solid fill collides with the judged states, so the student reads "I chose this" as "I got it right".
- **Losing the travel is how disabled says "not yet."**
- **The outcome icon lives in a reserved slot outside the face**, present in every state, so no state is wider than another (§19a).

#### 20.0.4 Choice groups

Every option in a group is **identical at rest** — same width, same face, same edge, same weight. Nothing may hint at the answer before it is judged: an option styled differently from its siblings has told the student the answer before they thought about it.

An answer option is a **button**, not a surface. Its label is 800 like any button; what keeps it from reading as a call to action is the neutral face, not a lighter weight.
| Disabled | `#f1f3f5`, `#adb5bd`, 1px `#e9ecef` |
| Correct / wrong | §21 |
| Group | One row, `gap-inner`, equal widths. Max 4 |

Three rules that the found examples all broke:

1. **Every option in a group looks identical when resting.** A green "Natural numbers" pill beside two plain text labels tells the student which one is the answer before they think.
2. **Selection is a border and a tint, never a fill colour change.** A green-filled selected option collides with `correct` (§34.1), so the student reads "I chose this" as "I got it right" — before the answer is judged.
3. **No option is emphasised by an `attention` ring.** Attention points at *where to act*, and in a choice group that is the whole group.

| Icon | 44px, radius 20, transparent, `#6b6580` 20px | Audio, flag |

**One primary per board.** Action row at the board bottom, `gap-inner`, primary rightmost. Hint is always secondary — it must never compete with Check.

**Banned on every button, without exception:** gradient fills · text shadow · a lit top face or inner highlight · outer glow that is not `attention` (§8a.3) · a drawn hand or pointer beside it · scale or bounce on press. The flat base edge of §20.0.1 is the one form of depth a button carries, and its travel is the entire press.

### 20.1 Hint pattern
A two-state secondary button, never a modal:

- Collapsed: secondary button, `ti-bulb` + "Hint".
- Expanded: replaced **in place** by a tint panel (`#fff4e6`, radius 12, `14px 16px`), text 24/500, `ti-bulb` 20px `#e8590c`.

Max **two** hints per board, revealed in order, never automatically.

### 20.2 Option-set hygiene

The visual properties of an option set leak the answer. Five rules, all mechanically checkable:

- **Options are within ±20% of each other's length.** The longest option is the correct one far more often than chance, and students learn that before they learn the maths.
- **The correct option's position is uniform across a module.** Count them: if the answer is third on five boards of eight, re-order.
- **No `All of the above` / `None of the above`** — they test reading, not the concept.
- **Options are parallel in form** — all numbers, all phrases, or all diagrams. A single odd-form option is either obviously right or obviously wrong.
- Distractors carry the **predictable misconception** for that skill (the additive reading of an exponent, the un-simplified fraction), so a wrong answer is diagnostic rather than random.

## 21. Feedback

- **Correct:** row border → 2px `#40c057`, fill `#ebfbee`, text `#2b8a3e`, `ti-check` badge, ring pulse once.
- **Wrong:** row border → 2px `#fa5252`, fill `#fff5f5`, text `#e03131`, `ti-x` badge. **No shake, no buzz.**
- The correct row is always revealed alongside a wrong answer.
- Explanation appears below the options as a tint panel, 24/500.
- Never disable retry without showing the answer.

---

---

# PART 5 — EMBEDDED INTERACTIVES (APPLETS)

A real module embeds many applets, simulations and widgets. Most arrive as an iframe with **its own stylesheet**, often authored by another team or vendor, often versioned outside this repo. This is the largest source of drift on the canvas, so it gets its own protocol.

## 22. The boundary rule

**An iframe inside the content canvas is part of the content canvas.** Separate authorship does not exempt it. The student cannot see the boundary — they see one lesson, and a widget with its own violet and a 550 weight reads as a bug.

Every rule in this document therefore applies to applet content. What differs is not *whether* they apply, but *how you are permitted to enforce them* (§24).

## 23. Two tiers of conformance

Sort every finding before touching anything.

### Tier A — non-negotiable, blocks ship

These break the product, not just its consistency:

| Requirement | Why it blocks |
|---|---|
| `html`, `body` and the applet root are `background: transparent` | An opaque applet background hides the room's gradient, dot lattice and the answer-feedback light leak (§0.1) |
| No dark surface, no white ink | There is no dark surface in the system; white ink becomes unreadable the moment the background is fixed |
| Sentences ≥ 24px, labels ≥ 16px | Classroom legibility |
| Hit targets ≥ 44px | Tablet is the primary device |
| No hover-only affordance | There is no hover on tablet |
| Colour is never the only signal | Colour-vision accessibility |
| `prefers-reduced-motion` honoured | Vestibular accessibility |
| Not Roboto | A vendor's Arial, Inter or webfont is instantly visible beside Roboto (§2.0) |

### Tier B — align, but negotiable

Cosmetic conformance. Fix with consent or ownership; never block a lesson on it:

- Exact hue tokens (a vendor's `#5f3dc4` vs our `#7950f2`)
- Radius and shadow ladders
- Gap and padding scales
- Weight categories (550 → 500/700/800)
- Fluid `calc(vw + vh)` sizing → the four fixed steps

## 24. The change-consent protocol

**Never silently rewrite an applet's stylesheet.** Its author may have pedagogical or technical reasons for a value, and it may be maintained elsewhere — a silent edit is lost at their next release.

1. **Audit** against §25; produce findings split into Tier A and Tier B.
2. **Fix Tier A immediately** and notify the owner. These are defects, not preferences — shipping an opaque or illegible applet is not an option.
3. **Request consent for Tier B**, quoting the exact declarations and the tokens they should become. One request per applet, not per property.
4. **If granted**, patch at source and record it in the manifest.
5. **If refused, or the source is not ours**, apply an override layer (§27) — never fork the applet.
6. **Re-audit on every version bump.** A vendor update silently reintroduces its own tokens.

## 25. The onboarding audit

Twelve checks before an applet ships. This is the list that would have caught every problem in the current parallelogram applet:

| # | Check | Fail looks like |
|---|---|---|
| 1 | Root, `html`, `body` transparent | `background: #1f1f1f` |
| 2 | No board-level gradient or tint | a `radial-gradient` on the container |
| 3 | Font stack inherited | `font-family: Arial` |
| 4 | Every `font-size` on the 4-step scale | `calc(1.5vw + 1.45vh)` |
| 5 | Every `font-weight` in 500/700/800 | `font-weight: 550` |
| 6 | Title ink is `#212529`, not an accent | a fully violet title |
| 7 | One token per accent role | `#5f3dc4` *and* `#7950f2` for the same job |
| 8 | Fills opaque, not alpha | `rgba(121,80,242,.20)` shape fill |
| 9 | Grid and axis lines on the §5 table | violet-tinted gridlines |
| 10 | Controls ≥ 44px and visible at rest | a 24px thumb with no resting affordance |
| 11 | Bundle loaded with a version query | a `<script src>` with no `?v=` |
| 12 | Renders on all three gradient stops | text vanishing at the cream end |

**SVG exemption:** a `font-size` in *user units* inside a `viewBox` (e.g. `0.62px` in a 0–10 space) is legal and exempt from check 4 — it is not a CSS pixel size. Judge it by its rendered size.

## 26. The token bridge

Applets must **consume variables, never hardcode**. The room injects this block into every applet frame; the applet's own `:root` declares nothing but fallbacks.

```css
/* injected by the room — the applet's contract with the canvas */
--ink:            #212529;
--ink-body:       #495057;
--ink-muted:      #868e96;
--accent:         #7950f2;   /* concept */
--accent-action:  #228be6;
--accent-emph:    #fd7e14;
--accent-ok:      #40c057;
--accent-no:      #fa5252;
--tint:           #f3f0ff;
--surface:        #ffffff;
--surface-sunken: #f8f9fa;
--border:         #e9ecef;
--grid-minor:     #e9ecef;
--grid-major:     #dee2e6;
--axis:           #adb5bd;
--helper:         #adb5bd;
--ghost:          #ced4da;
--track:          #e9ecef;
--fs-title:       36px;
--fs-body:        24px;
--fs-label:       16px;
--radius-sm:      8px;
--radius-md:      12px;
--radius-lg:      16px;
--shadow-rest:    0 2px 6px -3px rgba(70,46,146,.16);
```

An applet reading only these inherits every future token change for free and needs no consent request when the palette moves. **Bridge-compliance is the goal state for every applet.**

## 27. The override layer

When source cannot be changed, inject a stylesheet scoped to the applet root, loaded **after** its own:

```css
.applet-root .vendor-title { font-size: 30px; font-weight: 800; color: var(--ink); }
```

Scope every selector to the applet root · no `!important` beyond Tier A · one override file per applet · every rule carries a comment naming the audit item it satisfies · the file is deleted when the vendor adopts the bridge.

## 28. Cache discipline

**Every applet bundle loads with a version query, bumped on every edit:**

```html
<script src="applet-inline.js?v=7"></script>
```

Without it the browser serves the cached bundle and **every fix appears to fail** — you change a colour, reload, and see the old one. This has already cost real debugging time here: three separate colour corrections to the parallelogram applet looked like no-ops because its bundle had no version string.

Applies to inlined bundles too (`window.__APPLET_SRCDOC`) — the *host* script needs the query, or the srcdoc string is stale.

## 29. The applet manifest

Each applet carries a short record beside it:

```
applet:    parallelogram-to-trapezoid
owner:     <team or vendor>
version:   1.4.0
bridge:    none          # none | partial | full
audit:     2026-08-10    # last run of §25
tier-a:    clear
tier-b:    3 open (weights, fluid sizing, radius)
overrides: none
consent:   requested 2026-08-10
```

Without this, the next person cannot tell an intentional vendor value from drift.

---

---

# PART 6 — ILLUSTRATION & GRAPHICS

## 30. Illustration vs diagram vs photo

Three different things, three different rule sets. Choosing wrongly is the most common graphics mistake.

| | Illustration | Diagram | Photo |
|---|---|---|---|
| Purpose | Make an abstract idea concrete or a board welcoming | Carry measurable, checkable information | Show a real object or place |
| Accuracy | Stylised; proportion is expressive | **Exact** — a wrong angle teaches a wrong fact | Literal |
| Rules | This part | §16–17 | §9 |
| Palette | Extended hues (§31) | Semantic accents only | n/a |

**Never illustrate a diagram.** If a student could measure it, read a value off it, or be marked wrong because of it, it is a diagram: it follows §16–17, uses only semantic accents, and carries real geometry.

**When to illustrate:** an abstract process with no photographable form (a fraction being split, a force, a flow) · an empty or waiting state · a mascot's props and scenery · a decorative section divider.

**When not to:** a real object a photo shows better · anything demanding factual accuracy (maps, anatomy, apparatus) · anything that exists as a real asset already. Use `MEDIA[...]` with a placeholder and request the asset.

## 31. Flat vector style

The house style is **flat, geometric, two-tone**. Built from primitives, no rendering tricks.

### 31.1 Construction

- **Primitives only** — circles, rounded rectangles, triangles, arcs, simple paths. If it can't be built from those, it's too detailed for this system.
- **Two stops per shape, maximum:** the hue's `base` for the form, its `deep` stop for the turned-away plane. That's the entire shading model.
- **No gradients.** No mesh, no radial, no linear. A gradient is the fastest way to make a flat set look inconsistent.
- **No drop shadows, no glows, no bevels, no inner shadows, no noise or texture.** Separation comes from the `deep` stop or from a gap.
- **No specular highlights.** No white blobs on spheres.
- **Implied light from the top-left** — so `deep` always falls bottom-right. Consistent across every illustration in a module.
- **Flat or 2D-isometric projection.** Never true perspective, never vanishing points.

### 31.2 Geometry

| Property | Value |
|---|---|
| Grid | `viewBox="0 0 100 100"` (or 24 for icon-scale), integers where possible |
| Corner radius | 2–8 user units; nothing razor-sharp unless the subject demands it |
| Outline | None by default. When needed: 2.5 units in the hue's `deep` stop |
| Caps & joins | `round` everywhere |
| Minimum stroke | 1.5 units — thinner disappears when the board scales |
| Minimum shape | 6 units — smaller reads as dirt |

### 31.3 Colour discipline

- **Max 4 hues per illustration**, plus neutrals.
- **The dominant hue is the board's semantic accent**, so the illustration belongs to its board rather than floating on it.
- The other hues are supporting and decorative — they must carry **no meaning**.
- **Never** use `correct` green or `wrong` red decoratively in an illustration. Those two hues mean something on this canvas, and a green leaf next to a wrong answer is a genuine misread.
- Neutrals for structure: `#f8f9fa` (light plane) · `#ced4da` (mid) · `#495057` (line/deep).

### 31.4 Figures & faces

Match the mascot language — minimal, never realistic:

- Eyes are dots or short arcs. **No pupils with highlights, no eyelashes.**
- One curve for a mouth; a nose only if the silhouette needs it.
- Limbs are rounded rectangles with round caps; hands are circles.
- Bodies are primitives — no anatomy.
- **Skin tones** (use the full range across a module, never one):
  `#ffd8b1` · `#f0b98c` · `#c68863` · `#8d5524` · `#5c3317`
- Hair, clothing and props take extended hues.

### 31.5 Output

- **Inline SVG.** No embedded raster, no `<image>`, no external references.
- `currentColor` for anything that should inherit ink.
- `aria-hidden="true"` when decorative; a real `<title>` when it carries meaning.
- No `<style>` blocks inside the SVG — attributes or inline `style` only.
- Budget: **under 8KB** per illustration. Past that it is over-detailed for this style.
- Strip editor cruft — no `id` soup, no `data-name`, no empty groups.

### 31.6 What the found library got wrong

The violations that recur most, stated so a reviewer can name them:

- **Two stroke weights per illustration, maximum** — one structural, one detail. A book outline at 6px beside its content bars at 10px reads as two drawings.
- **No 3D, no isometric-with-gradients, no highlights.** An orange box drawn with a lit top face, a gradient body and a rim highlight is a rendering, not an illustration. Flat faces, flat fills (§31.1).
- **No inner glow.** A warm radial bloom inside a shape is a glow (§8a.3) and is stripped.
- **No display or cartoon font in an illustration.** Text inside a graphic uses the system stack at a canvas step, like every other string.
- **Green ticks are the one green exception.** A `ti-check` may be `#40c057` because a tick *is* a completion signal. The **box around it is not** — it stays `#e9ecef`, and an unchecked box is `#dee2e6` with no fill (§8a.2 `complete`).
- **Illustrated controls follow the real control's spec.** A drawn checkbox, slider or button in a graphic uses §19/§20 geometry — otherwise the student learns one visual language from the picture and meets another in the interaction.

## 32. Extended hue palette

**For illustration only.** These are decorative; they never signal state, and they never appear in text, borders, controls, charts or diagrams — those use §3.2 exclusively.

| Hue | `light` (tint) | `base` (fill) | `deep` (shade) |
|---|---|---|---|
| Red | `#ffe3e3` | `#fa5252` | `#c92a2a` |
| Pink | `#ffdeeb` | `#f06595` | `#a61e4d` |
| Grape | `#f3d9fa` | `#cc5de8` | `#862e9c` |
| Violet | `#e5dbff` | `#7950f2` | `#5f3dc4` |
| Indigo | `#dbe4ff` | `#4c6ef5` | `#3b5bdb` |
| Blue | `#d0ebff` | `#228be6` | `#1864ab` |
| Cyan | `#c5f6fa` | `#15aabf` | `#0b7285` |
| Teal | `#c3fae8` | `#12b886` | `#087f5b` |
| Green | `#d3f9d8` | `#40c057` | `#2b8a3e` |
| Lime | `#e9fac8` | `#82c91e` | `#5c940d` |
| Yellow | `#fff3bf` | `#fcc419` | `#e67700` |
| Orange | `#ffe8cc` | `#fd7e14` | `#d9480f` |

All twelve are Mantine hue scales (shades 1 / 6 / 9), so they sit with the rest of the product rather than beside it.

### 32.1 Using the palette

- **`light`** — background planes, large fills, negative space inside a form.
- **`base`** — the subject. The one hue a viewer would name.
- **`deep`** — the turned-away plane, outlines, and any text on a `base` fill.
- **A hue's three stops always travel together.** Never mix one hue's `base` with another's `deep` on the same form.
- **Yellow and lime `base` fail as text or thin lines** — `#fcc419` is 1.7:1 on white. Use them as fills only; their `deep` stop for anything linear.

### 32.2 Recommended pairings

Four hues, one dominant. These read well and stay distinguishable in greyscale:

| Set | Hues | Feels |
|---|---|---|
| Concept | violet · indigo · cyan · yellow | The default. Matches the canvas |
| Warm | orange · pink · yellow · grape | Energetic, celebratory |
| Cool | blue · teal · cyan · lime | Calm, scientific |
| Earth | orange · lime · teal · deep neutrals | Geography, biology |

Never more than four. Never two adjacent hues as the two most prominent (indigo + violet, cyan + teal) — they read as one colour at board scale.

---

# PART 7 — MODULE STRUCTURE

## 44. The three default boards

Every module has these, authored from fixed layouts so students recognise them instantly.

**Introduction (`T01`/`T02`)** — name the thing, show its shape. Mascots + `hero` + one-line subtitle + at most one artefact. No list, no CTA; the nav row's Next is the only action.

> **Converged with Journey Studio's master vault.** This trope is shared. Journey Studio owns the
> *behaviour* — when the board is shown, re-shown, and which rows are ticked (their domains 1, 2, 4).
> This document owns only its *appearance* (domain 8): the layout below, the type steps, the tick
> treatment and the celebration. Where the two disagree on cadence, theirs governs; on rendering,
> this section governs. Do not implement a second objectives trope.

**Learning objectives (`T06`)** — **3 to 4**, each one sentence beginning with a verb. Numbered badges. One secondary: "I already know these". **This board is the module's spine** — it is re-shown after each objective is met, with that row ticked and a ring pulse.

3 is the target; 4 is the ceiling because a 4-row stack plus a title and an action button is already at the height budget (§7.2), and beyond 4 a student stops reading the list. If a module has 5 objectives, it is two modules.

**Closing (`T05`)** — `title` + the objectives now all ticked + rewards row + one primary CTA. Never introduce new content on a closing board.

## 44a. The module shell

When the canvas runs standalone (an authoring preview, a review build, an export) it needs a way to move between boards. That chrome is **not** part of any board and never paints on the canvas.

**Engineering guardrails for the shell's fit routine** — both of these hang the page, not just misdraw it:

- **The element a fit routine measures must not contain anything that routine sizes.** Measuring a container that holds the scaled stage means each measurement changes the thing being measured: the observer refires, and the main thread never yields. Measure a wrapper that is sized by the viewport alone.
- **Coalesce `ResizeObserver` through one `requestAnimationFrame`**, on top of a size guard that ignores sub-pixel deltas. The guard alone is not enough — a ping-pong between two values that round differently fires the observer synchronously forever.

**Never re-create what the host already shows.** In the product the canvas is mounted inside the Teaching Room, which owns module identity (breadcrumb) and position (module progress bar) in its own top chrome. A canvas that draws its own breadcrumb or `4 of 21` counter states those facts twice — and the two copies drift apart the moment either changes. So:

- **Banned in the shell:** breadcrumb, grade/chapter/module label, module title, percentage or `n of m` counter, streak, XP, goals, close button, logo. All host-owned.
- **Allowed in the shell:** board navigation only — the rail, prev/next, keyboard bindings. These exist because the standalone preview has no host to drive the deck; they are a harness, not product UI.
- **Test before adding any shell element:** *"Would this element still be on screen if the canvas were mounted in the Teaching Room right now?"* If yes, the host draws it — leave it out.

| Element | Spec |
|---|---|
| Board rail | Bottom-centre, 8px dots, `gap-tight`, current stretched to a 20px pill: `#6741d9` current · `#d0bfff` seen · `#dcd8e6` unseen. Clickable |
| Prev / next | 46px icon buttons flanking the rail, radius 20, neutral face, 4px base edge, chevron `#6741d9`, disabled at an end |
| Keyboard | ← / → always move by one board |

The counter lives in the shell, never on a board. A board that prints its own position is duplicating the shell.

## 45. Board kinds

Each board declares one kind, which fixes its chip, accent and action row:

| Kind | Chip | Accent | Action row |
|---|---|---|---|
| `intro` | none | concept | none |
| `divider` | the phase (WATCH AND LEARN / DO AND LEARN) | action | none |
| `objectives` | none | concept | secondary |
| `teach` | none | concept | none |
| `explain` | CONCEPT | concept | Hint |
| `explore` | TRY IT | action | Hint + Check |
| `practice` | QUESTION | emphasis | Hint + Check |
| `feedback` | none | correct/wrong | Continue |
| `recap` | none | concept | none |
| `word-problem` | none | emphasis | Hint + Check |
| `challenge` | CHALLENGE | emphasis | Hint + Check |
| `recall` | RECALL | concept | Check |
| `bridge` | none | concept | none |
| `closing` | none | correct | primary |

Author boards with `data-board-kind`, `data-layout` and `data-band` so drift is visible.

## 44b. The board families the library actually needs

Roughly a fifth of the library is named `Practice: …`, another chunk `Challenges on …`, and another `Word Problems on …`. They are three different things and were being built as one.

### Word problem

The most-used layout in the library, and Part 9 had no entry for it.

```
stem ......... body/500, max words = band ceiling (§2.6), left-aligned, measure 720
given/asked .. the quantities lifted out of the stem as a 2-row list, or marked in the stem
model ........ ONE model from Part 3B — the module's model (§36.2)
working ...... §17i or §17j, at most the band's step ceiling
answer ....... a boxed final line, with its unit
```

- **The stem is never re-read to find a number.** Every quantity the student needs is either lifted into the given list or `emphasis`-marked in the stem itself.
- **The unit is part of the answer.** An unlabelled number is not a solution to a word problem.
- **Names and contexts stay neutral and local** — no brands, no aspirational settings, nothing a student needs cultural knowledge to parse.
- If the stem exceeds the band ceiling, the problem is too wordy for the band — rewrite the stem, never shrink the type.

### Practice

Fluency. Many short items, one skill, low reading load.

- **One item per board**, same layout every board, so only the numbers change. A student in fluency should never re-learn the interface.
- Answer box or option row (§19a / §20.0a), Check, feedback (§21), auto-advance.
- **No new notation and no new model** — practice consolidates, it does not teach.
- 6–12 items per module.

### Challenge

Fewer items, multi-step, may combine skills.

- May introduce a **new context**, never new notation.
- Hint pattern (§20.1) is mandatory — max two, revealed in order.
- Working is shown after the answer is judged, never before.
- 3–5 items per module.

### Recall / recap

Named `Recall …` or `Recap …` across the library — it is a **prerequisite check**, not a lesson.

- Draws only on prior modules, introduces nothing.
- Max 3 boards; if it needs more, the prerequisite is a module of its own.

### Optional / booster

Titled `… (Optional)` or `… Booster`. Carries the `ti-plus` marker chip (§14a) in `#868e96`, and **nothing inside it may be a prerequisite for a later module.**

## 45a. Sequencing

- Never three of the same kind consecutively — alternate explain and practise.
- An `explore` board precedes the first `practice` on a concept.
- A `recap` board follows every objective completion.
- Max 12 boards per module; 8 is the target.

---

---

# PART 8 — AUTHORING FROM SOURCE CONTENT

When a module arrives as an existing deck, PDF or storyboard, **the source is evidence, not raw material.** Its colours and layouts were decided by someone who knew the pedagogy. This part is the pass that must happen **before any board is designed**.

## 33. The pre-flight pass

Read the **entire** module first. Never design board 1 having only read board 1 — anchoring and visual continuity are module-wide properties, invisible slide by slide.

Produce three artefacts before touching a layout:

1. **A colour ledger** (§34) — every colour used in the source, and what it represents.
2. **A visual-model ledger** (§36) — every graphic, and which model it belongs to.
3. **A layout verdict per slide** (§35) — keep, or redesign with a named reason.

If the source is a PDF, extracting text is **not enough** — text extraction discards colour, so a colour ledger built from text alone is guesswork. Render the pages to images and read the anchoring off the pixels.

## 34. Colour anchoring

**A colour in the source is a semantic commitment, not decoration.** If the base is teal on slide 5, it is teal because the author bound that hue to that idea — and a student who learned the binding on slide 5 will carry it to slide 15.

### 34.1 The accent order

Before mapping anything, know the **rank**. The five semantic accents are not peers — they form an order, and a referent's rank in the module decides which one it gets:

| Rank | Token | Hex | Carries |
|---|---|---|---|
| **Primary** | concept | `#7950f2` | **The thing the module exists to teach** |
| **Secondary** | emphasis | `#e8590c` | The supporting term the primary is defined against |
| **Tertiary** | action | `#1c7ed6` | Results, live values, computed outcomes |
| Reserved | correct | `#2b8a3e` | State only — never a referent |
| Reserved | wrong | `#e03131` | State only — never a referent |

**Only three ranks are available for referents.** Green and red are state, permanently. A module needing a fourth referent colour has too many referents (§34.5).

### 34.2 Choosing the primary referent

This is the decision that everything else follows from, and it is **not** a colour question — it is a pedagogy question. Ask, in order:

1. **What is the module's title?** "Introducing **Exponents**" — the exponent is the subject.
2. **What do the learning objectives name most?** All four objectives here mention the exponent; two mention the base.
3. **Which term is being defined, and which is it defined *against*?** The exponent is defined against the base, not the other way round. **The term being defined is primary.**
4. **Which term is new to the student?** They already know what a base number is; the exponent is the new idea.

The referent that wins is **primary**. What it is defined against is **secondary**. Results are always **tertiary**.

**Never rank by which colour looks better, by which referent you happened to read first in the source, or by the source's own hue.** A source deck may put its brightest colour on a supporting term; that is its layout decision, not its pedagogy.

Worked failure: the first ledger assigned base → primary violet and exponent → secondary orange, because the base's coral appeared first when reading the source's fill colours. The result was that a module *called* "Introducing Exponents" rendered the exponent in its second-rank colour — the subject visually subordinate to its own supporting term, on every board. Re-ranked: exponent primary, base secondary, result tertiary.

### 34.2a The comparison-board exception

On a board whose whole job is to contrast **two routes to a number** — the route the student knows against the route being taught — the anchoring changes for that board only:

- The statement naming a route and the **number that route produces** share one token.
- The known route and its result take **secondary**; the taught route and its result (often a `?`) take **primary**.
- **The result token is not used on such a board.** "Which route produced this" outranks "this is a result", and using the result token on both numbers would assert the two are the same kind of answer — which is exactly the confusion the board exists to break.

So `repeated addition` and its `6` are both `#e8590c`; `repeated multiplication` and its `?` are both `#7950f2`. The pairing then reads without a legend, and the student can see which sentence owns which number before reading a word.

Record every use of this exception in the module ledger. Outside a genuine two-route contrast it does not apply — a board merely *showing* a result uses the result token as normal.

**The check:** the module title's key noun and the primary accent must be the same colour. If they are not, the ranking is wrong.

### 34.3 Building the ledger

1. **Inventory** every coloured run across every slide — headings, terms, labels, shape fills, arrows, callouts.
2. **Group by referent**, not by hue: what does each colour *point at*? (`base` · `exponent` · `result` · `wrong path` · `real-world context`.)
3. **Map each referent to exactly one canvas token** from §3.2 — a permanent binding for the whole module.
4. **Lock it.** Record the ledger beside the module; every board reads from it.

```
module: G08C01M01 Exponents
anchors:
  base ............... concept   #7950f2
  exponent ........... emphasis  #e8590c
  result / product ... ink       #212529
  misconception ...... wrong     #e03131
  correct path ....... correct   #2b8a3e
  real-world ......... concept   #7950f2
```

### 34.4 Resolving conflicts

| Source condition | Resolution |
|---|---|
| One hue used for two different referents | **Split.** Two referents need two tokens, or the notation teaches nothing |
| Two hues used for one referent | **Merge** onto one token — the variation was almost certainly incidental |
| A hue with no discernible referent | Decorative — drop it, or move it to the extended palette (§32) if it is inside an illustration |
| A hue that collides with a reserved meaning (green/red) | **Re-map.** Nothing decorative may wear `correct` or `wrong` |

### 34.5 The anchoring rules

- **A term keeps its colour everywhere it appears** — in a title, in prose, in a diagram label, on a chart axis, inside an applet.
- **The module ledger outranks the per-board accent choice.** §3.2 step 2 picks *which run* is the subject; the ledger picks *which token* that subject wears. A board never re-assigns an anchored hue for local contrast.
- **Anchors survive layout changes.** Redesigning a board (§35) never re-colours it.
- **Introduce an anchor once, explicitly** — the board that first names `base` is the board that first colours it. After that, the colour alone carries the meaning.
- **Cap it at three referent anchors per module** — primary, secondary, tertiary. More than three and the bindings stop being learnable, and there is no fourth rank to give them (§34.1).

### 34.6 A word naming a referent wears that referent's anchor

An anchor binds a **referent**, not a glyph. So *every* representation of that referent carries the same token:

| Representation | Example |
|---|---|
| The symbol | the `n` in `aⁿ` |
| **The word that names it** | "exponent", "power", "raised to" |
| The label or callout | a legend key, a diagram arrow label |
| The heading that introduces it | "Introducing **Exponents**" |

**This is where anchoring most often breaks.** §3.2 step 2 identifies *which run* is the subject, and it is tempting to give that run the board's default accent. But if the run **names an anchored referent**, the ledger has already decided its token — and using the default instead silently reassigns the anchor.

Worked failure: a title board read "Introducing **Exponents**" with the word in concept violet, above `2²` and `2³` whose bases were also violet and whose exponents were orange. The board therefore taught that violet means *exponent* in the heading and *base* two lines below it — on the module's very first slide, before the student had any other evidence.

**The check.** On any board showing both a referent's word and its symbol, verify they match:

```
the word "exponent"  →  emphasis  #e8590c
the symbol  n  in aⁿ →  emphasis  #e8590c   ✓ match
the word "base"      →  concept   #7950f2
the symbol  a  in aⁿ →  concept   #7950f2   ✓ match
```

If a board names two referents, both words take their own anchors — that is the one sanctioned case of two accents in a single heading, because they are two referents and not two emphases.

Corollary: **never accent a word with a token anchored to something else.** If the word being highlighted has no anchor, use the board's accent; if it has one, the ledger wins.

## 35. Layout verdicts

**The default is to keep the source layout.** A layout that survived authoring and review usually encodes a reason — a reading order, a comparison, a reveal. Redesigning by reflex discards that.

### 35.1 The three tests

Judge each source slide. It passes unless it fails one of these:

| Test | Fails when |
|---|---|
| **Hierarchy** | You cannot tell in one second what the slide is about; two elements compete for first read; the most important element is not the largest or the most saturated |
| **Readability** | Text below the `body` step; a wall of prose; measure past ~70 characters; ink on an unscrimmed image; a table doing a chart's job |
| **Information architecture** | Two ideas on one board; the order of elements contradicts the order of the explanation; a comparison whose two sides are not parallel; a reveal spoiled by showing the answer alongside the question |

### 35.2 The verdict

- **Passes all three → keep the layout.** Re-skin it with canvas tokens and change nothing structural. Match the source's element order, split, and emphasis.
- **Fails one → fix that one thing.** A hierarchy failure is usually a type-step change, not a new layout.
- **Fails two or more → pick a different layout** from Part 9, and **name the failure** in the build notes. "I preferred a different arrangement" is not a reason.

A slide that is only *plain* has not failed. Plain is often correct.

## 34a. The highlight doctrine

§0.6 says every board has exactly one focal point. This is **how you find it** — a procedure, not a judgement, because with 30 authors a judgement produces 30 answers.

### 34a.1 Key takeaways are the baseline

Before any board is designed, the module declares **3–5 key takeaways** — the sentences a student should be able to say afterwards. Not objectives ("learn to identify…"), but claims:

```
takeaways:
  T1  An exponent counts how many times the base is multiplied by itself.
  T2  The base and the exponent play different roles — 2³ is not 3².
  T3  Repeated multiplication grows far faster than repeated addition.
```

These go in the module record (§43.1) **before board 1 exists**, and everything else refers back to them. They are the module's truth set: if it isn't in the takeaways, it isn't what the module is for.

### 34a.2 The takeaway test — five steps per board

1. **State the board claim** in one sentence: *"After this board, the student knows ___."* If you cannot write it, the board has no point.
2. **Map the claim to a takeaway.** Every board serves at least one. **A board serving none is cut or merged** — this is the rule that removes filler, and it removes a surprising amount.
3. **Find the delta.** What part of the claim was *not* already true before this board? A board's job is the delta, never the whole claim.
4. **Take the shortest span carrying that delta.** One or two words, one number, one region, one edge. Not the sentence, not the topic word.
5. **Colour it by rank** — the anchor of the referent it names (§34.1–34.2). Primary if it is the module's subject, secondary if it is what the subject is defined against, tertiary if it is a result.

**Worked example.** Board claim: *"After this board, the student knows that 2³ means 2×2×2, not 2×3."* → serves **T2**. Delta: the *distinction* between the two readings — T1 already established what an exponent counts. Shortest span: `2 × 2 × 2` and `2 × 3`, the two expressions themselves. Rank: the exponent is primary, so the correct reading takes concept violet and the misreading takes neutral ink — never `wrong` red, because it is a misconception being examined, not an answer being judged.

### 34a.2a Two mechanisms, chosen by length

A highlight is rendered one of two ways, and the **word count decides which** — never taste.

| Span | Mechanism | Class |
|---|---|---|
| **1–2 words** | **Filled pill** — accent surface, `deep` ink, radius 8, padding `2px 12px`, `white-space:nowrap`, `box-decoration-break:clone` | `.hl` |
| **3+ words, a full sentence, or more** | **Font colour only** — accent as `color`, weight 700, no surface, wraps freely | `.hlx` |

**Why this is a rule and not a preference.** A filled pill is an inline background carrying padding and a radius, so it is only sound while it *cannot wrap*. Past two words the two options are both defects:

- Allow it to wrap → the background breaks across lines and shows a notch at the join. `box-decoration-break:clone` rounds each fragment but cannot prevent the break, and a two-word span can still split ("the" / "sketch").
- Set `nowrap` → the pill becomes an unbreakable box wider than its column. On a `minmax(0,1fr)` track — which every text column must be (§7c) — the track is permitted to be narrower than min-content, so the pill silently **overflows** instead.

Dropping the surface removes the failure mode entirely: coloured text wraps like any other text.

**The length limit is a design constraint, not a workaround.** §34a.2 step 4 already asks for the shortest span carrying the delta, so a pill that does not fit in two words is usually a highlight that was never tightened. Reach for `.hlx` when the delta genuinely *is* a clause — a definition, a rule statement, a conclusion — not as a way to keep an untightened phrase.

**One mechanism per board.** A pill and a coloured clause on the same board read as two different kinds of emphasis and split the focal point (§0.6).

**Auditing.** Count words in the source *and* measure `getClientRects().length` in the live DOM. A source-only regex misses template-driven highlights (values arriving through `{{ }}` holes), which is exactly where over-long pills survive unnoticed.

### 34a.3 What is never the highlight

- **The topic word repeated from the title.** If the board is titled "Exponents", the word *exponent* in the body is not news.
- **A connective** — "is", "the", "and", "when". Grammar is not a delta.
- **A term already highlighted on an earlier board.** It is known now; highlighting it again spends the budget on old information and tells the student nothing changed.
- **A whole sentence.** If the delta really is the whole sentence, the board is carrying two ideas (§0.3).
- **Anything not traceable to a takeaway.** That is the test's whole purpose.

### 34a.4 The highlight budget

Highlighting works only while it stays scarce — the same economics as weight (§2.2):

- **A term is highlighted twice in a module: on the board that introduces it, and on the board that recaps it.** Not on the boards in between, where it is context.
- **One highlight per board** (§0.6). A second competes and both are lost.
- **Each takeaway keeps one colour for the whole module**, via the anchor ledger. T1's terms are always violet; T3's always orange.

### 34a.5 The highlight ledger

Recorded per board, beside the colour ledger, so the whole module can be audited in one read:

```
board  claim                                    takeaway  highlight            token
b03    repeated multiplication ≠ repeated add.   T3       "repeated mult."     primary
b05    the small number counts the factors       T1       "how many times"     primary
b08    base and exponent are different roles     T2       "base" / "exponent"  sec / pri
b13    2³ is not 2×3                             T2       "2 × 2 × 2"          primary
```

Three audits fall straight out of this table and all three are mechanical:

- **A takeaway with no board** — the module claims something it never teaches.
- **A board with no takeaway** — filler; cut it.
- **A term highlighted on five boards** — the budget is blown, and none of the five reads as important.

### 34a.6 No bland boards — and no decorative colour

A board carrying no accent at all is a **Tier B failure: an undecided board.** It means nobody named what it was for.

But the fix is never to add colour. Colour is *found*, not applied:

> Run the takeaway test. If it yields a span, that span takes the accent and the board is fixed. **If it yields nothing, the board has no claim — the fix is to cut or merge it, not to paint it.**

This is the difference between a board that looks designed and one that looks decorated, and it is the reason §0.6 is in the contract rather than in a style section. Colour marks meaning; a board with no meaning to mark should not exist.

## 36. Visual continuity

### 36.1 Every content board earns a graphic

**Text-only boards are a failure of authoring, not a style choice.** If a board carries an idea, it carries a visual that makes the idea legible: a diagram, an array, a chart, an annotated media frame, a formula treated as an object.

Budget per content board:

| | Limit |
|---|---|
| Sentences | 2 |
| List rows | 4 |
| Words on the board | ~40 |
| Visuals | 1 |

Over budget means **split the board**, not shrink the type (§7.6).

Exempt: `T01`/`T04` dividers, `T06` objectives, `T05` closing — those are structural, and their job is words.

### 36.2 One visual model per module

The single most common failure in recreated content: **a different metaphor on every slide.** Tiles, then a pie, then a bar chart, then a number line — each fine alone, together teaching nothing, because the student spends every board learning to read a new picture instead of the idea.

- **Choose one model for the module** and declare it in the ledger. For exponents: the **array/tile model** (a factor per row).
- **Introduce it once**, at its simplest, and **extend it** — 2² as two rows, then 2³ as three, then the cube. Each board builds on the last board's picture.
- **The model's parts keep their anchored colours** across every appearance.
- **A second model is permitted for exactly two reasons**, and never for variety:
  - **To contrast** — a wrong model beside the right one, on a single board, then dropped.
  - **To bridge** — the *same quantity* shown in two models simultaneously, because the equivalence **is** the lesson. This covers the whole fraction ↔ decimal ↔ percentage ↔ ratio cluster, and *Connecting Fractions and Decimals*, *Repeated addition is multiplication*, *Connection of Ratios and Fractions* and their kin.

  A bridge board uses layout `D18` and obeys three constraints: **both models show the same quantity** · **the whole is the same physical size in both** · **the equality is written between them**, not implied by adjacency. Once bridged, the module continues in the *destination* model — a bridge is a crossing, not a permanent pairing.
- **Never restart.** If board 12 needs a picture the model cannot express, the model was wrong from board 1 — change it everywhere, not just there.

### 36.3 The concreteness ladder

Within one model, progress in this order and never skip a rung:

| Rung | Form | Example |
|---|---|---|
| Concrete | Countable objects | 8 physical tiles in 3 groups of 2 |
| Representational | The same arrangement, drawn | A 3×2 grid of squares with bracketed labels |
| Symbolic | Notation alone | 2³ = 8 |

A board may show two adjacent rungs side by side — that pairing *is* the teaching. It may never show only the symbolic rung before the concrete one has appeared.

### 36.4 The visual-model ledger

```
module: G08C01M01 Exponents
model:  array / tile  (one row per factor)
parts:
  tile ........... concept tint fill, concept 2.5px outline
  row bracket .... helper 1.5px
  factor label ... concept 800
  count label .... emphasis 800
progression:
  b06 concrete ......... 3 groups of 3, numeric
  b07 representational . general a x a x a
  b12 concrete+symbolic  3 groups of 2 -> 2^3 = 8
  b19 symbolic ......... powers of 2 in a table
```

### 36.5 Content accuracy — the audit every manipulative must pass

A visual that is beautiful and wrong is worse than no visual: it teaches confidently. Run all six checks **before** drawing, and again on the finished board.

**1. The manipulative's grammar must match the operation.**

| Operation | Legitimate grammar | Never |
|---|---|---|
| Repeated addition | A strip or row of units, grouped | — |
| Repeated multiplication | Nesting, branching/doubling tree, area, volume | A strip |
| Comparison of magnitudes | Shared baseline, one unit size | Two different unit sizes |

Repeated multiplication is a doubling *of a doubling* — it is not one-dimensional, so it cannot borrow the additive grammar. Drawing `2 × 2 × 2` as three groups of two depicts `2 × 3`, and a linear arrangement guarantees an additive reading no caption can undo.

**2. Count the factors against the drawing.** A doubling tree for `2 × 2 × 2` opens on the **base** (2 units) and doubles twice — two arrows, three factors. Opening on a single unit with three arrows depicts `1 × 2 × 2 × 2`, which is not the expression written beside it.

**3. One declared unit = one drawn size.** Every instance of a unit is the same dimensions and the same stroke, across every stage and every board. Shrinking units to fit a later stage breaks the link between ink and quantity — 8 units drawn small read as *less* than 6 drawn large, reversing the very growth the board exists to teach. If the last stage doesn't fit at full unit size, reduce the number of stages, not the unit.

**4. A visual may not depict a misconception a later board corrects.** Check every manipulative against the whole module (§33). If board 13 says "2³ is *not* 2 × 3", then no earlier board may draw 2³ as three groups of two — otherwise the module teaches the trap first and penalises it four boards later.

**5. Every "?" must be answerable from what is drawn.** A withheld answer is only productive if the student can reason to it from the board. If the visual makes the *wrong* answer the natural reading, the "?" isn't a question — it's a trap. Test by answering it yourself using only the drawing.

**6. A claimed bridge must be shown, not asserted.** If a line says "repeated addition *is* multiplication", both forms appear on the board — `2 + 2 + 2 = 2 × 3 = 6`, not just the addition. A title asserting an equivalence whose second half is missing leaves the student to take it on faith.

**And define the unit once.** State what one unit means on its first appearance, as a caption (§2.1a), then carry that unit unchanged. Never redefine it, never restyle it, and never restate the definition on a later board — a re-explained unit reads as a *different* unit.

---

# PART 9 — LAYOUT LIBRARY

**Pick a layout and fill its slots. Never arrange a board from scratch.** A new arrangement means a new entry here first.

Slot vocabulary: `TITLE` `SUB` `BODY` `LIST` `MEDIA[…]` `DIAGRAM` `CHART` `FORMULA` `CONTROL` `ACTION` `CAPTION` `CALLOUT` `BADGE` `MASCOT`

## A. Title & statement

| ID | Name | Grid | Slots |
|---|---|---|---|
`T01` | Title | Centred | MASCOT → TITLE(hero) → SUB |
`T02` | Title + artefact | Centred | MASCOT → TITLE(hero) → SUB → FORMULA\|DIAGRAM |
`T03` | Title over media | Full | MEDIA[bleed] + TITLE(hero) on scrim |
`T04` | Section divider | Centred | CALLOUT → figure numeral → TITLE |
`T05` | Closing | Centred | TITLE → LIST(ticked) → BADGE row → ACTION |
`T06` | Objectives | Centred | TITLE → LIST(numbered ×3) → ACTION(secondary) |
`T07` | Single statement | Centred | TITLE only, ≤12 words |
`T08` | Quote | Centred | MEDIA[circle] → BODY(36/500) → CAPTION |

## B. Explanation & lists

| ID | Name | Grid | Slots |
|---|---|---|---|
`E01` | Title + prose | Centred | TITLE → BODY |
`E02` | Title + list | Centred | TITLE → LIST |
`E03` | Checklist | Centred | TITLE → LIST(check) |
`E04` | Steps horizontal | Thirds | TITLE → 3× (BADGE + BODY) |
`E05` | Steps vertical | Centred | TITLE → LIST(stepped) |
`E06` | Two-column compare | Half | TITLE → 2× card(TITLE + LIST) |
`E07` | Do vs don't | Half | As E06 with correct/wrong tints |
`E08` | Key–value | Centred | TITLE → table(2 col) |
`E09` | Definition + example | Centred | TITLE → tint(definition) → card(example) |
`E10` | Term grid | Quarters | TITLE → 4× (BADGE + label + BODY) |
`E11` | Prose + callout | Major-left | TITLE → BODY ‖ CALLOUT |
`E12` | Table board | Full | TITLE → table |

## C. Media

| ID | Name | Grid | Slots |
|---|---|---|---|
`M01` | Media left | Half | MEDIA[standard] ‖ TITLE + BODY |
`M02` | Media right | Half | TITLE + BODY ‖ MEDIA[standard] |
`M03` | Media + caption | Centred | TITLE → MEDIA[wide] → CAPTION |
`M04` | Media pair | Half | TITLE → 2× MEDIA[standard] + CAPTION |
`M05` | Media trio | Thirds | TITLE → 3× MEDIA[square] + CAPTION |
`M06` | Media quad | Quarters | TITLE → 4× MEDIA[square] |
`M07` | Media grid 2×2 | Half | 4× MEDIA[square] with inset labels |
`M08` | Full bleed | Full | MEDIA[bleed] + CAPTION band |
`M09` | Portrait + text | Major-right | MEDIA[portrait] ‖ TITLE + BODY |
`M10` | Media + list | Major-right | MEDIA[square] ‖ TITLE + LIST |
`M11` | Before / after | Half | 2× MEDIA[standard] with pill labels |
`M12` | Annotated media | Full | MEDIA[wide] + numbered hotspots + legend |

## D. Diagram & maths

| ID | Name | Grid | Slots |
|---|---|---|---|
`D01` | Diagram + legend | Major-left | DIAGRAM ‖ legend keys |
`D02` | Diagram + formula | Half | DIAGRAM ‖ FORMULA + variable legend |
`D03` | Diagram compare | Half | 2× DIAGRAM with pill labels, relation glyph between |
`D04` | Diagram + callouts | Full | DIAGRAM centred + numbered callouts pinned |
`D05` | Formula focus | Centred | TITLE → FORMULA(figure) → CAPTION |
`D06` | Derivation | Centred | TITLE → rows of FORMULA, changed term accented |
`D07` | Number line | Full | TITLE → number line → CAPTION |
`D08` | Coordinate plane | Centred | TITLE → plane + plotted data |
`D09` | Plane + readout | Major-left | plane ‖ value cards |
`D10` | Construction steps | Thirds | TITLE → 3× DIAGRAM showing progressive construction |
`D11` | Shape family | Quarters | TITLE → 4× DIAGRAM + label |
`D12` | Proof two-column | Half | TITLE → statements ‖ reasons table |
`D13` | Column arithmetic | Centred | TITLE → §17i stack → CAPTION |
`D14` | Working + model | Half | §17j step stack ‖ the module's model (Part 3B) |
`D15` | Solid + net | Half | §16c solid ‖ its unfolded net, faces labelled alike |
`D16` | Transformation | Half | pre-image ‖ image, mapping arrows across the gutter (§17c) |
`D17` | Congruence pair | Half | 2× figure with §16b marks + correspondence statement below |
`D18` | Model bridge | Half | 2× model of the SAME quantity + the equality between them (§36.2) |
`D19` | Structure diagram | Centred | TITLE → factor / probability tree (§17g) |
`D20` | Instrument read | Major-left | §17h instrument ‖ TITLE + reading |

## E. Data

| ID | Name | Grid | Slots |
|---|---|---|---|
`G01` | Chart full | Full | TITLE → CHART → CAPTION |
`G02` | Chart + readout | Major-left | CHART ‖ value cards |
`G03` | Chart + prose | Half | CHART ‖ TITLE + BODY |
`G04` | Chart pair | Half | TITLE → 2× CHART with labels |
`G05` | Stat row | Quarters | TITLE → 4× (figure + label) |
`G06` | Pictograph | Full | TITLE → glyph rows + key |
`G07` | Table + chart | Half | frequency table ‖ its chart, same category order both sides |
`G08` | Distribution | Full | TITLE → line plot or box plot over one §17a axis |

## E2. Word problem, practice & challenge (§44b)

| ID | Name | Grid | Slots |
|---|---|---|---|
`W01` | Word problem — model | Half | STEM + given/asked ‖ MODEL |
`W02` | Word problem — working | Half | STEM ‖ §17i/§17j working → boxed answer |
`W03` | Word problem — stacked | Centred | STEM → MODEL → boxed answer + unit |
`P01` | Practice — options | Centred | STEM → option row (§20.0a) → CHECK |
`P02` | Practice — entry | Centred | STEM → answer box + unit (§19a) → CHECK |
`P03` | Practice — on a model | Half | MODEL ‖ STEM + answer box |
`P04` | Practice — drag | Full | STEM → drop zones → token tray |
`C01` | Challenge | Centred | STEM → workspace → HINT + CHECK |
`C02` | Challenge — multi-part | Centred | STEM → (a)(b)(c) rows, each with its own answer box |
`R01` | Recall | Centred | TITLE → prior model at `muted` → one question |

## F. Interactive

| ID | Name | Grid | Slots |
|---|---|---|---|
`I01` | Slider + shape | Centred | TITLE → DIAGRAM → CONTROL(slider) + live value |
`I02` | Slider + chart | Half | CHART ‖ CONTROL + readout |
`I03` | Slider pair | Centred | DIAGRAM → 2× CONTROL, one live value each |
`I04` | MCQ | Centred | TITLE(stem) → LIST(options) → ACTION |
`I05` | MCQ with media | Half | TITLE → 4× MEDIA[square] options → ACTION |
`I06` | Numeric input | Centred | TITLE → CONTROL(input) + unit → ACTION |
`I07` | Match pairs | Half | TITLE → 2 columns of rows + connectors |
`I08` | Sort / order | Centred | TITLE → draggable rows |
`I09` | Drag to bins | Half | TITLE → tokens ‖ 2–3 drop zones |
`I10` | Tap the shape | Full | TITLE → DIAGRAM with tappable regions |
`I11` | Plot the point | Centred | TITLE → plane, tap to place |
`I12` | Build the formula | Centred | TITLE → FORMULA with empty slots + token tray |

## G. Feedback

| ID | Name | Grid | Slots |
|---|---|---|---|
`F01` | Answer reveal | Centred | state band → answer(figure) → BODY → ACTION |
`F02` | Worked solution | Centred | TITLE → LIST(stepped: FORMULA + reason) |
`F03` | Hint reveal | Centred | The origin board with the hint panel expanded |
`F04` | Objective earned | Centred | Ticked LIST + ring pulse + reward badges |
`F05` | Misconception | Centred | wrong band → "why" tint panel → correct path → ACTION |

**60 layouts.** Rules: one visual kind per board · never nest layouts · vary consecutive kinds · sum children against the 285px budget before shipping.

---

# PART 10 — NORMALISING AN EXISTING LIBRARY

Parts 0–9 tell an author how to build a board correctly. This part is the other direction: **how to take ~2000 modules built by 30+ authors, each with its own colours, boxes, glows and type, and land them all inside this system** — deterministically, at scale, without hand-judging every board.

Everything here is written to be **executable**: a normaliser (script or agent) reads a found value and gets exactly one legal answer. Where a decision genuinely needs a human, the rule says so and routes it, rather than leaving it to taste.

## 37. The conformance model

### 37.1 What "conformant" means

A module is conformant when **every rendered value is traceable to a token in this document** — not when it merely looks similar. Similar-looking is how 2000 modules drifted in the first place.

Four states, and every module is in exactly one:

| State | Definition | Ships? |
|---|---|---|
| **Conformant** | Zero Tier A failures, Tier B score ≥ 90, record complete | Yes |
| **Skinned** | Zero Tier A failures, Tier B outstanding, exceptions registered | Yes, with a registered debt |
| **Quarantined** | Tier A failure that cannot be fixed without a rebuild | Yes, in the legacy skin (§41.4), flagged |
| **Blocked** | Tier A failure that is fixable and unfixed | No |

### 37.2 The two tiers, generalised

Part 5 defined tiers for applets. **The same two tiers govern every asset class** — do not invent per-class severity.

**Tier A — blocks ship.** These break the product, not its consistency:

- A board paints an opaque background, tint or gradient (§0.1)
- Text below the `body` floor, or text that cannot scale (baked into a raster)
- Contrast below 4.5:1 for text, 3:1 for a graphical boundary
- Colour as the only carrier of a state (§0.5)
- A board that scrolls, or content outside the safe area
- A hit target below 44px, or an affordance discoverable only on hover
- A face other than Roboto visible beside canvas text (§2.0)
- A visual that is **factually or pedagogically wrong** (§36.5) — this is Tier A, not cosmetic

**Tier B — align, negotiable.** Radii, shadow steps, border widths and colours, gap values, non-token accents, illustration hues, fluid type sizing, decorative motion.

### 37.3 Scoring

One score per module, so 2000 modules can be ranked and progress measured:

```
Tier A failures ......... count (must be 0)
Tier B score ............ 100 − (weighted failures / total checked × 100)

weights:  colour 3 · type 3 · geometry 2 · spacing 2 · shadow 1 · motion 1
```

Report per module **and per author** — drift is authored, so the per-author view is what actually reduces the backlog.

## 38. The snap tables

**The core of the migration.** A found value is never "close enough": it is classified, then mapped. These tables must produce the same answer on every run, for every module, without reference to how the board looks.

### 38.1 The first rule of snapping: strip, don't translate

**Most found styling carries no meaning, and the default action is removal — not conversion to a token.** Thirty authors produced thousands of decorative glows, tints, gradients and coloured borders that mean nothing. Translating each one to its "nearest token" preserves the noise in a legal palette; deleting it is what actually unifies the library.

Apply this test to every found declaration:

> **Would a student be unable to answer a question on this board if this declaration were deleted?**

- **No** → delete it. This is the answer for the large majority of found shadows, tints, gradients, glows, coloured borders and decorative fills.
- **Yes** → it carries meaning; snap it via the tables below, and record what it means in the module record.

Only ever snap after the strip pass. Snapping first produces a tidy palette full of things that shouldn't be there.

### 38.2 Colour — classify by function, never by hue

**Never map a found colour to its nearest palette hue.** Nearest-hue matching is the single worst failure mode at scale: a decorative mustard becomes `wrong` red, a brand teal becomes `correct` green, and the library ends up full of false state signals. Classify what the colour *does* first, then map inside that role.

**Step 1 — classify by what the declaration paints:**

| Found on | Role |
|---|---|
| A sentence, a caption, a label | Ink |
| A single term inside a sentence | Anchor candidate → §34 |
| A fill behind text | Surface |
| A 1px line, a divider, a table rule | Border |
| A 2px+ line, an outline that changes on selection | State/selected |
| A shape outline, an axis, a construction line in a diagram | Geometry (§16) |
| A fill in an illustration | Extended hue (§32) |
| A shadow, glow or halo | Shadow (§38.5) |

**Step 2 — map inside the role:**

| Role | Mapping |
|---|---|
| Ink — primary | `#212529` |
| Ink — secondary/prose | `#495057` |
| Ink — tertiary/caption | `#868e96` |
| Anchor | The module's ledger token for that referent (§34). **No referent → strip to ink.** |
| Surface | `surface-card` (opaque white) · `surface-sunken` · accent tint at 8–12% |
| Border | 1px `#e9ecef` |
| State/selected | 2px in the relevant accent |
| Geometry | Per §16 — outline 2.5px accent, helper 1.5px `#adb5bd` |
| Extended hue | Nearest of the 12 hues (§32), snapped to its `light`/`base`/`deep` stop |
| Shadow | §38.5 |

**Step 3 — the reserved-colour guard.** After mapping, assert: no green in the `correct` range and no red in the `wrong` range survives anywhere that is not a state. A decorative green must move to the extended `teal`/`lime` hue, not keep `#40c057`. This check runs on every module, every time — it is the one that prevents a student reading a decorative tick-green as "you got it right".

**Step 4 — de-duplicate violets.** `#7950f2`, `#6741d9`, `#5f3dc4`, `#845ef7` and `#9775fa` are all the same role. Collapse to the one token. Same for any hue appearing at multiple shades in one role.

### 38.3 Type

Weight is **not** snapped from the found value — the found value is only a hint. **Reclassify by category** (§2.2): is this string a destination, a control, or content? Then take that category's weight. A library where every author's 600 became 700 is still wrong.

| Found size (rendered px) | Snaps to |
|---|---|
| ≥ 42 | `hero` 48 |
| 30–41 | `title` / `statement` 36 |
| 20–29 | `body` 24 |
| 14–19 | `label` 16 |
| ≤ 13 | `micro` 12 — **only** if it is not a sentence |

**Round toward legibility.** Any string a student reads as a sentence rounds **up**, never down, and never lands below `body`. A fluid `calc(vw + vh)` size is evaluated at 1600×900 and then snapped.

Also: strip every `font-family` declaration (the stack is inherited), every `italic` (not in the system), every `text-transform:uppercase` that isn't on a `label`, and every `letter-spacing` outside the four steps' values.

### 38.4 Geometry

| Found radius | Snaps to |
|---|---|
| 1–10 | 8 |
| 11–14 | 12 |
| 15–24 | 16 |
| ≥ 25, or a pill | 999 |
| A circle | 50% |
| 0 | 0 — legal **only** on `media-bleed` |

| Found border | Snaps to |
|---|---|
| Any width, no state meaning | 1px `#e9ecef` |
| Any width, marks selection | 2px accent |
| Dashed, any pattern | 1.5px `#ced4da` dash `6 4` |
| Inset / double / groove / ridge | Strip |

| Found gap or padding | Snaps to |
|---|---|
| 1–10 | 8 |
| 11–17 | 14 |
| 18–23 | 20 |
| 24–33 | 26 |
| ≥ 34 | 40 |

Margins inside a board are converted to `gap` on the parent (§7), not snapped.

### 38.5 Shadow, glow and gradient

| Found | Action |
|---|---|
| Any shadow with blur ≤ 8 | `resting` |
| Any shadow with blur > 8 | `raised` |
| A coloured glow, not on a primary button | **Strip** |
| A coloured glow on a primary button | That button's accent |
| Any `inset` shadow | Strip |
| Multiple stacked shadows | Collapse to one step |
| Any shadow on media, or on a tint panel | Strip |
| A gradient on a board background | Strip (Tier A, §0.1) |
| A gradient on a surface or text | Strip; the flat token replaces it |

Text shadows, `filter: drop-shadow` and `backdrop-filter` are all stripped — none exist in this system.

### 38.6 State, opacity and glyphs

| Found | Action |
|---|---|
| Any opacity value | Snap to the ladder: <0.20 → strip the element · 0.20–0.42 → `excluded` · 0.43–0.75 → `muted` · >0.75 → `full`. Tints snap to 0.12 / 0.08 |
| A faded element that still carries information | Raise to `muted` and desaturate; if it fails 4.5:1, it goes to `full` |
| A coloured fade (faded orange, faded green) | Desaturate to the grey ladder (§3.6) |
| A glow carrying meaning | Strip; re-express as the state's own treatment (§8a.2) |
| A glow meaning "act here" | Snap to `attention`, capped at one per board |
| A drawn hand, pointer or tap graphic | Delete |
| Scale-to-highlight | Strip the scale; apply `emphasis` |
| A pulse or blink that loops | Cap at two iterations, or strip |
| `-`, `–`, `—` used as a minus | `−` (U+2212) |
| `x`, `*` as multiplication · `/` as division | `×` · `÷` |
| `<=`, `>=`, `!=`, `...` | `≤`, `≥`, `≠`, `…` |
| Uppercase outside a `label` | Sentence case |
| A coloured fraction bar | Ink `#495057` |
| Sign encoded in colour (negative red, positive blue) | Strip the colour — the glyph carries it (§3.3) |

**The state audit is per element, not per declaration.** For each element ask which of the ten states (§8a.1) it is in, then apply that row of the matrix wholesale — do not translate the author's chosen treatment. Translating preserves ten dialects in legal tokens; classifying produces one language.

## 39. Asset classes and their remediation ceilings

**A rule you cannot enforce on an asset is not a rule — it is a rebuild request.** Each class has a ceiling on what normalisation can reach, and the ceiling determines the route, not the severity of the finding.

| Class | Styling reachable? | Ceiling | Route |
|---|---|---|---|
| Board markup (HTML/CSS) | Fully | Everything | Normalise in place (§40) |
| Inline SVG | Fully | Fills, strokes, type, geometry | Token-map every paint attribute |
| Linked SVG file | Fully, but shared | Same, with copy-on-write | Copy per module before editing; never edit a shared asset in place |
| Photograph | Not needed | Framing only | `MEDIA[...]` box + `object-fit:cover` + scrim if ink sits over it (§9, §3.5) |
| Raster with baked-in text | **No** | Cannot be fixed | **Tier A.** Text in a raster cannot scale, translate, be read aloud or meet contrast. Re-author as markup, or quarantine |
| Raster with baked-in chrome (old card, glow, gradient) | **No** | Crop only | Crop to the content; if the chrome cannot be cropped away, re-author or quarantine |
| Screenshot of a slide | **No** | — | Treat as a source deck (§33), not as an image. Rebuild as boards |
| PDF page | **No** | — | Render, read colour and layout as evidence (§33), rebuild as boards |
| Slide deck (PPT/Slides) | Via extraction | — | Extract text, colour and layout; rebuild per Part 8 |
| Video | **No** | Framing only | Fixed box, token radius, poster frame, no restyle, no shadow |
| HTML simulation, own stylesheet | Via override | Tier A always, Tier B with consent | Part 5 — audit, bridge, override layer |
| HTML simulation, styles in JS | Via config | Whatever the config exposes | Request a token-config hook; until then, override what CSS can reach |
| `<canvas>` / WebGL simulation | **CSS cannot reach it** | Only what its JS config exposes | §39.1 |
| Third-party embed (YouTube, GeoGebra, H5P) | Chrome only | The frame around it | Normalise the frame; register the interior as an exception |
| Icon font other than Tabler | Fully | — | Map glyph-by-glyph to Tabler; no second icon set survives |
| Embedded font file | Fully | — | Delete; the canvas serves Roboto and the applet inherits it (§2.0) |

### 39.1 Canvas and WebGL simulations

A drawn-pixel simulation is the one asset class where the override layer is powerless — there are no elements to select. Rules:

1. **Never attempt a CSS fix.** It will appear to succeed on the frame and change nothing inside.
2. **The palette must come from a config object** the host can set — the JS equivalent of the token bridge (§26). Request one from the owner: an exported `setTokens({ink, concept, emphasis, action, surface, border})` or equivalent.
3. **Until that hook exists**, the simulation is *Skinned* at best. Register it; do not report it as conformant.
4. **Tier A findings inside a canvas** (a wrong visual, unreadable text, colour-only state) make the module **Blocked**, not Skinned. Pedagogical correctness is not negotiable against implementation difficulty.
5. The **frame** around it is always normalised — radius, border, shadow, caption, and the transparent board behind it.

### 39.2 Detailed HTML simulations at scale

Part 5's per-applet protocol works for one applet; for hundreds:

- **Fingerprint before auditing.** Hash each simulation's stylesheet. Identical hashes across modules are the *same* asset — audit once, fix once, apply everywhere. In a 2000-module library, a few hundred distinct simulations typically account for the majority of instances.
- **Group by vendor/author**, then negotiate once per group rather than once per instance (§42).
- **Version-pin every override** to the stylesheet hash it was written against. When the hash changes, the override is stale and the module returns to the audit queue automatically (§29).
- **Never fork a simulation to restyle it.** A fork stops receiving the owner's pedagogy fixes, which is a worse outcome than a cosmetic non-conformance.

## 40. The normalisation pass

Ordered, and the order matters — each step depends on the last. **The pass must be idempotent: running it twice changes nothing the second time.** That is what makes it safe to run across 2000 modules and re-run after every rule change.

```
0  INVENTORY   list every asset by class (§39); hash every stylesheet and shared asset
1  READ        the whole module, all boards, before changing anything (§33)
2  LEDGER      build the colour ledger (§34) and the visual-model ledger (§36.4)
3  STRIP       delete every declaration that fails the §38.1 test
4  STRUCTURE   board background → transparent; margins → gap; assign a layout (Part 9)
5  TYPE        reclassify weight by category; snap sizes; strip families, italics, tracking
6  COLOUR      classify by function; map by role; run the reserved-colour guard
7  GEOMETRY    snap radius, border, gap
8  SHADOW      snap or strip
9  CONTENT     run the §36.5 accuracy audit on every visual — this is where Tier A lives
10 FIT         verify no board scrolls, with the chat panel open (§0.4, §7.6)
11 SCORE       compute Tier A count and Tier B score (§37.3)
12 RECORD      write the module record (§43.1); register every exception
```

**Steps 0–2 are read-only and must complete before step 3.** A normaliser that starts editing while still discovering the module will re-decide anchors mid-pass and produce a module that contradicts itself — this is exactly how the first pass on `Exponents Module` went wrong.

**Step 9 cannot be automated.** Everything above it can be. Route step 9 to a human or a reviewing agent with the module's ledgers in hand (§41.2).

### 40.1 Idempotency requirements

- Every decision that involved judgement is **written to the module record** (§43.1), and re-read on the next pass instead of re-decided.
- Snap functions are **pure** — same input, same output, no reference to the current rendering.
- A stripped declaration is recorded as stripped, so a later pass doesn't reinstate it from the source asset.
- Assert at the end of a second run: **zero diffs**. A non-zero diff means a snap function is unstable or a decision wasn't recorded.

## 41. Triage and routing at scale

2000 modules cannot all be hand-fixed. Route by **cost**, not by how bad it looks.

### 41.1 The four routes

| Route | Criteria | Who |
|---|---|---|
| **Auto** | Every finding is a snap-table entry or a strip | Normaliser, no review |
| **Assisted** | Auto, plus ≤ 3 findings needing a judgement call | Normaliser proposes, human confirms the 3 |
| **Consent** | Findings inside an asset owned elsewhere | §42 |
| **Rebuild** | Tier A that no override can reach: text in rasters, wrong visuals, dark boards baked into assets | Authoring queue, per Part 8 |

Report the split before starting. In a drifted library the Auto route typically covers most modules; concentrating effort on Rebuild is what actually moves the conformance number.

### 41.2 What must never be automated

- The §36.5 content-accuracy audit — a wrong visual looks fine to a linter.
- Choosing the primary referent (§34.2) — it is a pedagogy decision.
- The layout verdict (§35.1) — keep or replace the source layout.
- Deleting content to make a board fit (§7.6).

### 41.3 Batch order

Normalise in this order, because each stage makes the next cheaper:

1. **Shared assets first** — one shared SVG or simulation fixed removes the finding from every module that uses it.
2. **Then by author** — one author's habits are one set of snap decisions, and the per-author score gives them a feedback loop.
3. **Then by chapter** — so cross-module anchor conflicts (§43.2) surface as a set.
4. **Rebuilds last**, prioritised by module traffic.

### 41.4 The legacy skin

A quarantined module still has to ship. Give it a **named legacy skin**: the transparent canvas, Roboto, the ink and surface tokens applied at the board level, and its unreachable interior left alone.

The skin is a **holding state, not a tier** — it never becomes acceptable, it is never used for new content, and every module wearing it is on the rebuild queue with a reason recorded. Its purpose is that the library reads as one product while the backlog is worked, instead of one hard boundary per legacy module.

## 42. Ownership and consent across 30+ authors

§24's per-applet consent protocol does not scale to thousands of instances. Extend it:

- **Tier A needs no consent.** Fix and notify — the module is broken, and asking permission to unbreak it wastes a cycle. The notification names the rule and the fix.
- **Tier B is consented in batches.** One broadcast per author or vendor group listing every finding across all their assets, with the proposed diff, a **10-working-day window**, and a stated default (apply on silence). Thirty authors × one broadcast beats hundreds of individual requests, and gives each author one coherent view of their own drift.
- **A rule change re-opens nothing already consented.** When this document changes, the affected modules re-enter the queue via the drift check (§43.3), not by revoking earlier agreements.
- **Escalation is pedagogical, not aesthetic.** An author who refuses a Tier B change keeps the value and it is registered as an exception. An author who refuses a Tier A fix escalates to whoever owns the curriculum — never resolved by overriding them silently.
- **Author-facing output is the score plus the top three findings** (§37.3). "Your 14 modules score 62; your three most common findings are non-token violets, 6px radii, and coloured glows" changes future authoring. A list of 400 line-items does not.

## 43. Records, registry and re-runs

### 43.1 The module record

One per module, beside it, machine-readable. This is what makes the pass idempotent and the library auditable:

```
module:        G08C01M01
author:        <name>            source: <path>
pass:          2026-08-11        rules-version: <this doc's version>
state:         conformant | skinned | quarantined | blocked
tier-a:        0
tier-b-score:  94

assets:
  <path> ..... class: inline-svg    ceiling: full      state: normalised
  <path> ..... class: canvas-sim    ceiling: config    state: skinned

ledgers:
  colour ..... primary: exponent #7950f2 · secondary: base #e8590c · tertiary: result #1c7ed6
  model ...... array/tile, boards 6·7·12·19

decisions:                       # judgement calls — re-read, never re-decided
  primary referent ... exponent (§34.2: module title + 4/4 objectives)
  layout verdict ..... b03 replaced — source layout failed hierarchy (§35.1)
  §34.2a exception ... b03 comparison board, result token unused

stripped:                        # so a later pass does not reinstate them
  b04 .... coloured glow on formula card
  b09 .... panel gradient

exceptions:                      # registered debts, each with an owner and a reason
  b11 .... canvas sim, no token hook — owner notified 2026-08-04
```

### 43.2 The subject anchor registry

Anchors are per module, but a referent that recurs across a chapter **must keep one token throughout that chapter**. A student meeting "base" in orange in module 1 and violet in module 3 has been taught that colour means nothing.

- One registry per subject, listing every referent and its token.
- A module claims a token for a referent; the next module reuses it.
- A conflict is resolved in favour of the **earlier module in the learning sequence**, not the newer file.
- Across *different* subjects, reuse is fine — no student meets both in one lesson.

### 43.3 Drift detection and re-runs

- **On every rule change**, re-run steps 5–8 and 11 (the pure snap steps) across the library. They are deterministic, so this is cheap and needs no consent.
- **On every asset hash change**, the module re-enters the audit queue automatically (§39.2).
- **Sample continuously** — a random 2% of conformant modules re-scored each week catches regressions that a one-time pass cannot.
- **Never mark a module conformant without a record.** An unrecorded pass cannot be re-run, cannot be audited, and will be re-decided differently next time.

---

# PART 11 — THE RULES

**Cite these as `R1`–`R120`, never with `§`.** Rules live in their own numbering space; `§` refers
only to sections (`§0`–`§45`). Both spaces are permanent: numbers may be added, never reassigned.

1. **Boards are transparent.** No board-level fill, tint or gradient. Surfaces are small, local and opaque.
2. **Roboto, pinned and self-hosted** — italic serif (Times New Roman) only on lowercase algebraic variables, and never on numerals, operators, function names, units or vertex labels (§2.0).
3. **Four sizes: 48 / 36 / 24 / 16** (+ `figure` 44 and `micro` 12 for data). Content is 24; under 24 is a label, never a sentence. A narrated sentence is `statement` 36/500, never 36/800.
4. **Three weights by category:** 800 destination · 700 control · 500 content. **One 800 element per board.**
5. **Colour by procedure (§3.2):** state → subject → type step. A title is never fully accented; an accent never spans a sentence.
6. **One accent per board**, from the semantic table. One token per role.
7. **Three inks.** `#868e96` never carries information needed to answer.
8. **One border: 1px `#e9ecef`.** 2px means selected.
9. **Four radii: 8 / 12 / 16 / 999.**
10. **Two shadows.** Glows belong to primary buttons; media gets none.
11. **One primary button per board.** Hint is always secondary.
12. **`gap`, never margin.** 8 / 14 / 20 / 26 / 40. Padding `24px 34px 20px`, or 44px top with a chip.
13. **Media: fixed box, `object-fit:cover`, no border, no shadow, capped height.**
14. **One visual per board** — media and diagrams never share.
15. **Every board declares a kind and a layout.**
16. **Max 5 list rows** (objectives 3–4), **2 chart series, 5×6 table.**
17. **Colour is never the only signal.**
18. **Minimum hit target 44px**; no hover-only affordances.
19. **Motion is one-shot** and dies under `prefers-reduced-motion`.
20. **A board never scrolls.** If it does, cut content — never shrink type.
21. **No dark boards, no white ink, no warm yellow ink.**
22. **Illustration, diagram and photo are different things** (§30). If a student could measure it, it is a diagram — semantic accents and real geometry only.
23. **Flat vector only:** primitives, two stops per shape, no gradients, no shadows, no highlights, light from the top-left.
24. **Extended hues are decorative** (§32). Max 4 per illustration, dominant = the board's accent, and never `correct` green or `wrong` red for decoration.
25. **Read the whole module before designing any board.** Produce a colour ledger, a visual-model ledger and a per-slide layout verdict first (§33).
26. **Source colours are semantic commitments.** Build the anchor ledger, cap it at three referents, and a term keeps its colour everywhere — the ledger outranks any per-board choice (§34).
25a. **Rank referents before colouring them** (§34.1–34.2): the term the module exists to teach is **primary** concept violet; the term it is defined against is **secondary** emphasis orange; results are **tertiary** action blue. The module title's key noun must be the primary accent.
25b. **A word naming a referent wears that referent's anchor**, not the board's default accent — the word "exponent" and the symbol `n` must be the same colour (§34.6).
26. **Keep the source layout unless it fails hierarchy, readability or information architecture** — and name the failure (§35).
27. **Every content board earns a graphic.** Max 2 sentences, 4 rows, ~40 words, 1 visual. Over budget means split the board (§36.1).
28. **One visual model per module**, introduced once and extended — never a new metaphor per slide (§36.2).
29. **Never show the symbolic rung before the concrete one has appeared** (§36.3).
29a. **A manipulative's grammar must match its operation** — additive is a strip, multiplicative is nesting/branching/area (§36.5). Count the drawn factors against the written expression before shipping the board.
29b. **One declared unit = one drawn size**, on every stage and every board. Ink must track quantity, or the visual reverses the lesson (§36.5).
29c. **A visual may not depict a misconception a later board corrects** (§36.5).
29d. **Every "?" must be answerable from what is drawn**, and every claimed bridge must be shown, not asserted (§36.5).
30. **An embedded applet is part of the canvas.** Every rule applies; §23 says which are non-negotiable.
31. **Never silently rewrite an applet's CSS.** Fix Tier A and notify; request consent for Tier B; override rather than fork.
32. **Applets consume the token bridge**, never hardcoded values.
33. **Every applet bundle loads with a version query** — without it, fixes appear to fail.
34. **Size states role, not enthusiasm** (§2.1a): the board's destination takes the larger step, a recap of prior knowledge takes `body`, and reference material is a caption. Never emphasise a non-anchored term with weight — it stays plain (§2.2).
35. **A measure cap is symmetric `padding-inline`, never `max-width`** (§7.4). On a stretched block, `max-width` moves the block's centre off the board's centre.
36. **Every direct text child of a board's centred column carries `align-self:stretch`** (§7.5a) — shrink-to-fit blocks wrap narrow, keep a one-line box height, and the next sibling paints over line 2. Equations carry `white-space:nowrap`; compared rows stretch to one shared width; decorative overhang stays unclipped.
37. **The shell owns navigation only** (§44a) — nothing the host already draws. A fit routine never measures an element it sizes, and its `ResizeObserver` coalesces through one `requestAnimationFrame`.

**State, and the components that carry it:**

37a. **Ten states, one treatment each, on every element class** (§8a). One state per element at a time; `emphasis` is the only one that may use colour; `complete` is a tick, never a green fill; no state changes an element's size or position.
37b. **Five opacity steps** (§3.6). Below `muted` (0.55) an element is decorative and may not carry information a student needs. Fades are achromatic.
37c. **One glow exists** (§8a.3): `attention` — one per board, two pulses, never colour-coded, never meaning state. Every other glow, bevel, gradient and text shadow is stripped (§8a.5).
37d. **Sign is never colour-coded with state colours** (§3.3) — red negatives teach a student that every negative number is wrong.
37e. **A choice button is content, not an action** (§20.0a): every option looks identical at rest, and selection is a border plus a tint, never a fill.
37f. **Every state of an answer box is specified** (§19a) — and a wrong answer keeps the student's value, with no shake, flash or pulse.
37g. **A set keeps one colour across the whole module** (§17b); boundaries are always stroked, and nested fills repaint rather than stack.
37h. **One glyph per operator** (§13.2) — `− × ÷ ≤ ≥ ≠ …`. A fraction bar is ink, never its own hue (§13.1).

**How this document is kept true:**

110. **One fact, one section, one number.** A section number is unique across the whole document. When a component gets a dedicated section, every earlier row describing it is **deleted**, not left beside its replacement — a superseded spec that stays in the file is indistinguishable from a current one.
111. **A component section names its reference implementation, in one wording** — *"it measures its own contrast at render time across every hue; trust it over any number written here."* The file is the source of truth; this document is its description, and a description drifts.
112. **A carve-out is stated where the general rule is stated** (§20.0's circular slider thumb), never left as a silent contradiction in a distant table.

**The gate:**

113. **Nothing ships unchecked** (§0.7). Twelve checks per board, groups A and B blocking. A rule nothing evaluates is a preference.
114. **Nothing overlaps** (§7a.1), and board-level layout is flex or grid — absolute positioning belongs inside a computed coordinate space, never on a board.
115. **A board is at least half full and no fuller than its band allows** (§7a.2, §2.6) — except `divider` (≤40%), `feedback` (≤50%), `intro` and `section` (≤60%), because a spare board is what makes the boards around it feel dense. **A ceiling is per kind, not per group.** Under the floor a content board is under-explained, mergeable, or claimless — and the fix is never to scale content up.

**Curriculum coverage (K–10):**

46. **Every board declares a grade band** (§2.6). The band sets minimum type, word count, element count and step count — a Grade 1 board at Senior density is a Tier A failure.
47. **Solids are drawn in technical isometric** (§16c) — three flat tones, hidden edges dashed, no gradient or highlight. This is the *only* exemption to §31's flat-vector rule, and it covers diagrams of solids, never illustration.
48. **Congruence is marked, not narrated** (§16b): ticks for equal sides, arcs for equal angles, a square for the right angle, chevrons for parallel — in ink, never in accent unless that pair is the current point.
49. **A transformation always shows its pre-image** (§17c), image primed, centre and mirror line drawn.
50. **Pick a model from Part 3B**, and draw it the way that entry specifies, every time. A model not in the library is a new entry, written before it is used.
51. **Column arithmetic is aligned by place** (§17i) with `tabular-nums`; carries and borrows are annotations in emphasis orange, never a recoloured whole sum.
52. **Equation working aligns every `=`** (§17j), one operation per row, the changed term emphasised in the row where it changes.
53. **A fraction's whole is one size across the whole module** (§17e), and partitions are geometrically equal.
54. **A chart's scale starts at zero**, a pictogram always carries its key, and a pie never exceeds 6 sectors (§15a).
55. **Practice consolidates, challenge extends, recall checks** (§44b) — none of the three introduces new notation, and a word problem's every quantity is either lifted out or marked in the stem.
56. **The module id is the identity; the title is a label** (§43.4). Normalise, fingerprint and resolve duplicates before any pass.
57. **Reveal order is frame → given → one step at a time → result** (§8b), 120ms apart, and **nothing already revealed moves when the next thing appears.**
58. **Every diagram carries a one-sentence description** of what it shows (§9.5). A diagram-only board without one is Tier A.
59. **A figure is drawn to its stated measurements**, or it is labelled `Not to scale` (§9.6).
60. **A second model is allowed to contrast or to bridge — never for variety** (§36.2). A bridge shows the same quantity, at the same whole size, with the equality written between.
61. **An option set must not leak its answer** (§20.2): equal-length options, uniform correct position, parallel form, misconception-bearing distractors.
62. **Loading and failure are designed states** (§8c), and a failed applet never blocks the module.

**Shape, colour and highlight:**

63. **Every board has exactly one focal point** (§0.6), traceable to a key takeaway. If nothing on a board deserves the accent, **the board has no claim — cut it, never paint it.**
64. **A module declares 3–5 key takeaways before board 1** (§34a.1). Every board maps to one; a board mapping to none is filler.
65a. **A highlight of 1–2 words is a filled pill; 3+ words is font colour only** (§34a.2a). A pill cannot wrap without notching or overflowing, so length decides the mechanism. One mechanism per board.
65. **The highlight is the shortest span carrying the delta** (§34a.2) — what was not already true before this board. Never the topic word, never a connective, never a term already highlighted.
66. **A term is highlighted twice per module** — introduction and recap (§34a.4). Highlighting works only while it is scarce.
67. **A fill and its stroke are two stops apart** (§3.7), and text on a fill takes that fill's `deep` stop — never ink black, never white.
68. **One colour scheme per board, from the five** (§3.8): anchor triad, monochrome depth, complementary opposition, analogous run, triad. 60/30/10, max four hues, and it must survive greyscale.
69. **Never two hues at `base` with equal area**, and adjacent hues only at different stops (§3.8).
70. **A shape is a vertex set, an edge set and a face set** (§16d) — snapped to a lattice (§16e), never a drawn path.
71. **Three dash patterns, three meanings** (§16d.2): `6 4` hidden, `2 6` construction, `4 4` ghost. A face is transparent unless its interior carries meaning.
72. **State changes stroke and fill only** (§16d.4) — never vertex positions, never size. A dehighlighted figure keeps its shape and loses its colour.

**Shapes, surfaces and buttons — the closed set:**

73. **Two families, one shape** (§20.0). A surface is flat and holds content; a button is raised and is pressed. Both are 20px radius and fit to content, so **depth is the family signal**, not radius.
74. **A colour variant is a hue angle** (§3.7) — five stops generated from it at fixed lightness and chroma. A ninth colour is generated, never invented, and it will already match.
75. **Chroma makes a chip visible, not darkness** (§3.7). The canvas is near-neutral, so a surface separates by being coloured. Judge a fill by eye against `#eee9fd`; its luminance ratio is meaningless here.
76. **Two arcs are reserved** (§3.7.2): 15–40° is *wrong*, 130–170° is *correct*. Hues on one board sit ≥25° apart, four maximum.
77. **A surface has no stroke at rest** (§20.0.2). The stroke appears in exactly one state — highlighted — inset so nothing reflows.
78. **The base edge is the affordance** (§20.0.1). A flat solid offset in the face's own hue; pressing travels the face down by exactly its height. No scale, no bounce, no colour flash — and no bevel, which is still banned everywhere else.
79. **The neutral is not white** (§3.7.3). It is the brand angle at near-zero chroma, because it is the most-seen shape in the library.
80. **Every option in a group is identical at rest** (§20.0.4), and correct/wrong appear only after judging — never as a selection.
81. **A generated angle is spot-checked** (§3.7). The lightness constants narrow the contrast band; they do not pin it, because chroma moves luminance.

**Sliders:**

82. **A slider invents nothing** (§18). The track is a surface, the thumb is a button with the same base edge, and every colour is generated from the anchor's hue angle.
83. **The value is shown once** (§18.2) — as labels or as a counter, never both. That single rule closes the set at five types.
84. **Markers cut through the bar** (§18.1), 2px at interior stops only — never a dot resting on the track. They divide the bar into the parts being counted.
85. **The track wears the accent** (§18.1). A grey track with a coloured fill reads as two objects overlapping; one hue family reads as one control.
86. **The counter is tethered** (§18.1) by a tail, fits its digits, and never reserves width it is not using.
87. **The bar leads and the thumb rides it** (§18.1) — track 16px, thumb 40px, hit target 44px regardless of how the thumb is styled.
88. **Highlighted is the surface's highlighted state** (§18.3), and siblings are never dimmed to fake it. One highlighted slider per board.
89. **A disabled slider keeps its value legible** (§18.3). Its control label may dim; its tick labels and counter may not.
90. **Tick labels clear the thumb, not the track** (§18.4) — the base edge reaches 32px below the track top, and the stop it would strike is the active one.

**Counters:**

91. **A counter is two buttons and one surface** (§18a) — same radius, same base edge, same generated hue as everything else.
92. **The value always leads, by hierarchy not volume** (§18a.1): larger, one step darker, lifted. Loud buttons around a plain number are forbidden.
93. **One hue family, no grey** (§18a.1). A button's face is one step lighter than what it sits on; its edge comes from the same hue.
94. **The value is a surface** (§18a.1) — no base edge, because it is read and never pressed. Its lift is elevation, not an affordance.
95. **Glyphs are 4px bars** (§18a.1), not icon strokes — a 1.5px stroke disappears at classroom distance.
96. **A limit disables one button, never the counter** (§18a.4), and the value never resizes as its digits grow.

**Graph sheets:**

97. **Three tiers, far apart** (§17.0): grid barely above the paper, axes in ink with arrowheads, plot in the only saturated colour on the sheet.
98. **Arrowheads continue, endpoint dots stop** (§17.2) — the one distinction that separates a line from a segment, and it is the maths.
99. **A ring separates, and a vertex must not be** (§17.2). A standalone point is ringed; an endpoint or vertex never is, or the stroke shows a gap.
100. **A point is small and never resizes** (§17.2–17.3) — it marks a coordinate, and it highlights with a ripple behind it, not by growing.
101. **The first unit below the x-axis belongs to the tick labels** (§17.0). Nothing is plotted there, and a solid sits wholly inside one quadrant.
102. **Both sheets name their axes** (§17.1) — dropping the numbers never means dropping `x` and `y`.
103. **Disabled keeps its position** (§17.3). It is out of scope, not untrue.

**Number lines:**

104. **The ends declare the set** (§17a.1) — a square cap at zero for whole numbers, arrowheads both ways for integers. Drawn, never captioned.
105. **Stacked lines share one unit width** (§17a.1), or the comparison between them is a lie.
106. **Filled means in, hollow means out** (§17a.3) — interval notation, never restyled for looks.
107. **Only the marks take a hue** (§17a.2). Axis, ticks and numbers stay ink at every angle.
108. **Every number prints `−` (U+2212)** (§17a.2) — `String(-3)` emits a hyphen, and a tick label 50px from a marked value will silently disagree.
109. **A default band is 5%, a highlighted one 26%** (§17a.4) — set closer and the highlight reads as the same region, slightly warmer.

**Normalising existing content (Part 10):**

38. **Conformant means every value traces to a token** (§37.1) — not that the board looks similar. Similar-looking is how the library drifted.
39. **Strip before you snap** (§38.1). If deleting a declaration would not stop a student answering the board, delete it. Converting decoration to its nearest token preserves the noise in a legal palette.
40. **Classify colour by function, then map by role** (§38.2) — never by nearest hue. Nearest-hue matching turns decorative greens into `correct` and mustards into `wrong`. The reserved-colour guard runs on every pass.
41. **Weight is reclassified by category, never snapped from the found value** (§38.3). Sizes round toward legibility and never land below `body`.
42. **An unreachable rule is a rebuild request, not a rule** (§39). Text baked into a raster is Tier A and cannot be styled away; CSS never reaches a canvas — only its token config does.
43. **The pass is read-only until the ledgers exist** (§40), and **idempotent** — a second run produces zero diffs. Every judgement call is recorded and re-read, never re-decided.
44. **Content accuracy, referent ranking, layout verdicts and cutting content are never automated** (§41.2). Everything else can be.
45. **A referent keeps one token across a chapter** (§43.2), and **no module is conformant without a record** (§43.3).
### 43.4 Module identity

The registry is keyed on module identity, so identity has to be clean before a pass can be idempotent. The current library is not:

- Near-duplicate titles differing only in punctuation or spacing (`Bar Diagram. Word Problems` / `Bar Diagram.Word Problems`)
- Exact duplicates (`Growing number patterns` twice, `A Few More Challenges`)
- Trailing whitespace, embedded newlines, stray quote characters
- Typos (`Adition of Unlike Fractions`)
- ASCII substitutes for maths glyphs in titles (§13.3)

Before step 0 of the pass (§40):

1. **Normalise** — trim, collapse internal whitespace, strip quotes and newlines, apply §13.3 to the title.
2. **Fingerprint** — casefold and remove punctuation; identical fingerprints are candidate duplicates.
3. **Resolve** — a human decides merge, rename or keep-both. Never automatic: `Practice: GCF` and `Practice Problems: GCF` may be genuinely different modules.
4. **Assign a stable id** (`G08C01M01`) that never changes again. **The title is a label; the id is the identity.** A registry keyed on titles re-splits every time an author fixes a typo.

Record the original title in the module record so a rename is traceable.
