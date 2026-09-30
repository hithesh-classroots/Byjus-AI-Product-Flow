# Teaching Room Spark — Handover

**File:** `Teaching Room Spark.dc.html` (a Design Component; opens directly in a browser)
**Derived from:** `Teaching Room.dc.html` — same shell, same 10-token palette, same CCR board rules.
**Previous snapshot:** `versions/Teaching Room Spark - v1 (quiz summary numeric).dc.html`

---

## 1. What this page is

A single guided lesson — *Area of a Trapezoid* — taught by **Vyom** (the tutor mascot) with **Spark** (a curious second character) interjecting. It differs from the base Teaching Room in two ways:

1. **Spark speaks through the chat**, not through a separate overlay.
2. **A 14-question quiz** follows the video, with an adaptive summary ("confidence map").

## 2. Layout

| Region | Role |
|---|---|
| Top chrome | Logo, lesson title, XP / orbs |
| Centre | The 16:9 content canvas (boards, applet, video, quiz) |
| Left | Chat panel (Vyom + Spark messages); collapses to a floating bubble |
| Bottom-left dock | Vyom mascot, chat pill, mic, and (on the quiz) calculator |
| Bottom | Lesson progress track with Previous / Next |

**Next is always active.** All completion gates (applet tried, definition answered, video watched) were removed.

## 3. Spark

- Spark's lines are ordinary chat bubbles in Spark's orange (`#fff4e6` fill, `#ffe8cc` border, `#8a4712` ink), same size, position and font as Vyom's.
- Chat open/close is **never forced** by Spark — it's entirely the student's choice.
- Spark's mascot sits **10px to the right of its bubble**, rendered on the panel wrapper (outside the scroll container, so it is never clipped). Its position is measured from the live bubble.
- Spark's opening line was removed (it duplicated the Spark on the intro board).
- On the definition board, Spark lands by its bubble, then **walks over to the trapezoid** (0.75s ease, grows 34→54px), and **fades out** (0.45s) when done. It reappears only when Spark next speaks.
- Spark still pauses the video when it interjects.
- **Typing indicators** precede every reactive line from both characters (via `_beat(who, cb, ms)`). Quiz pick feedback is deliberately instant.
- Character art: `spark-mascot-sm.png` (512×512, shared with other pages).

## 4. The quiz (after the video)

**10 questions**, mixed formats: pick one, pick several (two are number-result questions shown as options, with the calculator enabled), picture-choice tiles, type a word, type a number, match the pairs. Topics: Parallel sides, Naming the parts, Area formula, Bases & height, Spotting a trapezoid.

Image questions use a 65/35 split (question left, figure right) with the figure on a light-grey surface (`#f1f3f5`). Some pick-one questions use **4:5 picture option tiles** in a row.

**Top of the canvas**
- Numbered question buttons with ← / → arrows (tap any number to jump).
- A stats row: correct count and elapsed time (no wrong count).

**Answering**
- Submit: Content Canvas *Emphasis* style; *Disabled* until something is attempted.
- Next: Content Canvas *Default* style.
- **Skip** sits to the right of Submit; the pair is centred as one group. Skipped questions are revisited once after the set. The last button reads **Next** until the final revisited question, which reads **Finish**.
- Option tiles are 358px wide, 6px apart; question / options / actions are 36px apart.
- **Wrong answers on plain questions** slide the question left and bring in the picture panel (65/35) with a feedback drawing and one line of explanation (`fbFig` + `why.no` on the question). Right answers keep the question centred.
- Correct/wrong feedback appears in Vyom's bubble (bottom-left).
- **Match the pairs:** purple lines while pairing; on submit the right column re-orders to line up, correct pairs turn green, wrong pairs go red and snap to the right tile, the original wrong pairing stays faintly behind (10% opacity), and wrong tiles wiggle every 5s.

**Type-the-answer questions**
- Keyboard and mic buttons sit side by side inside the answer bar.
- Tapping the keyboard grows the answer bar into an on-screen keyboard (0.34s slide; the question glides up rather than jumping). Submit + Skip sit in one row inside the keyboard. Three tabs: **abc**, **123** (default for number questions), and **maths** (super/subscripts, roots, fractions, relations, π, °).

**During the quiz**
- Chat works normally: the student can open, read, type and speak. Open/close is never forced on entering the quiz. Handle stays at full opacity.
- Vyom opens with *"All the best, you can use the calculator if needed."* and then stays silent until the summary.

## 5. Calculator

- The calculator **icon** pops in from the right edge of Vyom's "All the best" bubble; it opens only when tapped. Freely draggable anywhere (grab cursor on edges / when disabled); a one-time finger nudge hints that it moves.
- When enabled it is 15% larger than its disabled size; it auto-closes when moving to a question that doesn't need it.
- The calculator button itself expands into the calculator (teal surface).
- **Basic / Scientific** modes; DEG/RAD; sin/cos/tan, logs, powers, **nth root with a settable n** (stepper, 2–99).
- On number questions it shows **Submit answer** (yellow, the one bright action) to send the result directly.
- **Greys out** ("Not needed for this question") on questions that don't need it — solid, not see-through.

## 6. Quiz summary — the confidence map

- A **radar chart** of the five topics (Parallel sides, Naming the parts, Area formula, Bases & height, Spotting a trapezoid).
- Dashed grey = before the quiz; purple→blue filled shape = now. Animates from before to now.
- Each topic label has a small badge: green ▲ getting stronger, red ▼ needs a look, grey • unchanged.
- The **correct count** sits in the chart's centre in deep indigo (`#1e1646`, ~6:1 contrast).
- Below: Before/Now key, and "x wrong · y skipped" only when relevant, then the title **"Your confidence map"**.
- **Opens directly at the centre** and never moves. Vyom speaks the summary aloud and it goes into chat history, but it doesn't float over the map.
- Continue is removed — the lesson's Next arrow moves on.

## 6b. "I already know this" keystone check (slide 2)

- Five questions in the same UI as the quiz: numbered 1–5 buttons (tap to jump), 358px option tiles, Content Canvas Submit (disabled until a pick) → Next / Finish, Skip to the right of Submit.
- Picking only selects; marking happens on Submit. Skipped ones return once ("Skip again").
- Pass mark: 4 of 5 skips the lesson to the end.

## 7. Key implementation notes

- `QSET` (getter) assembles the 10 questions from `QSET_TEXT`, `QSET_IMG`, `QSET_PICK` plus two inline number questions; each gets a `topic`.
- Question state: `qsIdx`, `qsMarks`, `qsSkipped`, `qsRevisit`, `qsQueue`, `qsDone`.
- Summary: `_qsReport()` tallies by topic; `RAD_PRIOR` holds the "before" values; `_radarVals()` draws the chart (inner-ring floor so dots never cover the centre).
- Content Canvas buttons need an ancestor with `class="cc-theme"` for their states to apply.
- Figures scale inside a 1280×720 design box via `scale(calc(100cqw / 1280px))`.

## 8. Open items

- The new Spark art replaced a shared file, so it also changed on Teaching Room (light/dark), Home, Onboarding, Practice Room and Profile. Split into a separate file if that wasn't intended.
- Quiz pick-feedback has no typing beat by design; add one if consistency matters more than snappiness.
- For under a second as the summary opens, Vyom's previous bubble may still show before the summary line replaces it.

## 9. What's in this ZIP

- `Teaching Room Spark.html` — **open this.** Fully self-contained (video, mascots, fonts, styles, logic). Needs internet only for the Tabler icon font and the Vyom Rive runtime.
- `source/` — editable source: `Teaching Room Spark.dc.html` plus every file it loads. Serve the folder with any local web server (e.g. `npx serve source`) and open `Teaching Room Spark.dc.html` — opening it via file:// will block the video/Rive loads.
- `docs/` — Type Scale, Design System, Content Canvas Rules, Dark Mode colour adoption, Practice Room PRD and layout plan.
- `preview.jpg` — a still of the page.

Links out of the page (close ✕, end of lesson) point to Home Page / Chapter Journey, which are not in this ZIP.
