# Practice · Solution panel rules

Locked rules for the step-by-step panel ("solution panel") in `Practice Room - Guided Retry.dc.html`. All sizes are in design units: the canvas is 1280 × 720 and scales as one piece, so the same numbers hold at every window size. If you change one of these in the code, change it here too.

## 1. One panel size

- The panel is the same size in every state: step-by-step, Spark watching, and done.
- It starts at the bottom of the question text and ends 80 above the bottom of the canvas. It is full width, with a 16 radius and a 2 border.
- When the chat opens or closes the canvas keeps one size and only slides sideways. Nothing inside the panel resizes.

## 2. A question's picture joins the solution

The picture shown with the question is **the same picture** all the way through, and it has **one home**: it sits in the same place beside the question and inside the solution panel. It never moves when help opens; the panel opens around it.

**Where the home is (measured in design units, the same at every window size).**
- Horizontally: the picture's right edge is **42 in from the right edge of the question area**. That is the panel's own inset: 2 border + 22 panel padding + 18 content padding.
- Vertically: the picture is centred on the panel's centre line. The panel's content centre sits about 2.5 below the panel's centre, so the question area shifts its columns down by **129** (half of the 204 reserved for the answer buttons, less the 80 the panel stops short of the bottom, plus the 2.5).
- Size: the picture card keeps its size (for example 460 × 312 for the grain store) beside the question and inside the panel.

**The layout that goes with it.**
- With a picture, the question area is two columns: the options on the left, taking the space the picture leaves, and the picture on the right. Gap 40.
- Options are **420 wide** (wider than the 358 used without a picture) and centred in their column, so the pair reads as balanced with the picture pushed to the right.
- The options and the picture share one centre line (the same vertical shift is applied to both).
- Questions whose picture only appears as feedback, after answering, keep the old centred layout.

**When the panel opens.**
- The panel takes the full width and reserves an empty slot of exactly the card's size at the picture's home. Because the home and the slot are the same place, the card does not travel (offset 0 at 1024 × 768, 1280 × 720 and 1440 × 900).
- The card sits above the panel (z-index 8) so it reads as part of the explanation.
- The code still glues the card to its slot on every frame, so if a future layout change puts the two apart by a few units the card closes the gap smoothly (760 ms) instead of jumping. When the panel closes it eases back in 420 ms. Aim for an offset of zero; treat any visible movement as a layout bug.
- **Nothing may crop the picture.** While the card is moving the cell around it must not clip: the cell's overflow is `visible` whenever the panel is open (`qsFigCellOv`), and as a guard the code also lifts `overflow` on every ancestor between the card and the question area for the duration of the move, then restores it 460 ms after the card is back. Do not add a clip the guard does not lift.
- **Self-check.** When the card lands, the code checks it sits fully inside the panel's content area and logs a console warning naming this rule if it does not. A picture too large for the panel is a content problem: shrink the picture, never let it overflow.
- To verify a layout change: open help on a question with a picture at 1024 × 768, 1280 × 720 and 1440 × 900. The picture must be fully visible, in the same place before and after, and level with the options.
- Questions with no picture keep the explanation text centred on its own. Number-line questions (the fraction question) draw their own line in the panel and have no separate picture.

Code: `_rv0` (the figure branch) sets the two-column layout, the 42 inset (`qsFigMargin`) and the shift (`qsColShift`); `renderVals` (the `vhWide` block) reserves the slot (`vhFigIn`, `vhSlotW`, `vhSlotH`) and lifts the card (`qsFigZ`); the glue is in `componentDidUpdate` (`#qsFigCard`, `#vhFigSlot`).

## 3. The step rail (left of the panel)

| Rule | Value |
|---|---|
| Rail width | 196, padding 14 top and bottom, 10 sides |
| Gap between step rows | 6 |
| Row | at least 44 tall, grows with its text, padding 8 / 12 / 8 / 8, 12 radius |
| Row text | 14 px, line height 1.25, bold |
| Number dot | 28 |
| Dot to text | 10 |
| Left inset | 12 |
| Focus (current step) | white fill, 1.5 border in the purple accent, soft purple shadow `0 4px 12px -6px rgba(112,72,232,.55)` |
| Done | green dot with a tick, text in dark grey |
| Not reached yet | grey dot, text lightened, 55 % opacity |

- Step names are short enough to fit in at most two lines: **20 characters or fewer** (for example "Long walls", "Slant side", "Take away"). If a name needs two lines the row simply gets taller; text is never clipped.
- The long wording belongs in the step's question, not its name.

## 4. Inside the panel

- Header: badge and stage text on the left, **Got it** pill on the right (tooltip: "Close explanation and submit the answer"). Gap 8.
- Step question: 20 px, line height 1.35, bold, 4 below the header.
- Explanation area: light grey, 14 radius, padding 8 / 18, 12 below the question.
- Explanation lines: 16 px, line height 1.5, 8 between lines. Keep an explanation to **three lines or fewer** where the picture is present.
- Answer row: keypad and boxes at the bottom of the panel. The keypad and the boxes stay in the same place when Spark is solving.

## 5. The question text

- The question box is 120 tall. Up to **170 characters** it is set at 26 px. Longer questions are set at 18 px so they stay inside the same 120.
- Aim for **under 330 characters**: three lines at 18 px. Give only what the steps use, and cut story the student does not need.
- A fraction written as `3/4` in a question is shown stacked, numerator over denominator, with a bar between.
- A picture is mandatory only if the numbers in the question come from it.

## 6. How a step is shown: a short working card

A step is never a paragraph of advice. It is a small card in the same shape the student writes in their notes.

| Row | What it holds |
|---|---|
| NOTE | one sentence of context, only when the step needs it (italic, 14 px) |
| FORMULA | the rule being used, one line (14.5 px) |
| WORKING | the sum written out, one line per calculation (15 px). The values the student must find are **blanks inside the line** |

- Card: white, 12 radius, 14 / 16 padding, 10 between rows. Label column 80 wide (labels 10.5 px, capitals). Given rows use the same card, with the item name in the label column.
- Blanks: 30 tall, 8 radius. Empty = dashed grey, **active** = purple border and the typed value, **done** = green with the value.
- The student fills the blanks **one at a time**, in order, each with its own check. The intermediate values (for example one wall, then two walls) are therefore never skipped. The keypad and box at the bottom feed the active blank and show its unit.
- A wrong blank gives that blank's own hint, not the whole step's. Two wrong answers on a step hand over to Spark.
- The first step of a worked problem is **Given and to find**: a table of what is given and one row stating what to find. No answer is typed.
- Step names are 20 characters or fewer (rule 3).

## 7. The picture does the explaining

Every step of a question with a picture says which part of it the step is about, and the picture shows it.

- A step carries `hl`: which **faces** (`f`), **edges** (`e`) and **labels** (`l`) to light. The picture is drawn again for every step, so it follows the student, and follows Spark when Spark is working.
- Lit faces are filled amber (`#ffe066`) with amber outlines (`#e67700`, 3 wide). Lit labels turn orange (`#d9480f`).
- Everything that is not lit stays visible but dims (outlines at 35 % opacity, faces pale lilac, labels at 40 %).
- A step with no `hl` shows the picture unlit and unchanged. Steps that are only arithmetic (take away, litres, cost) have no `hl`.
- A step that adds the parts together lights all the parts it adds.
- Use one set of label tokens per picture. The grain store uses `L` (8 m), `W` (6 m), `Hc` (3 m, wall height) and `Hg` (4 m, gable height); faces `wall`, `side`, `roof`, `gable`; edges `slant`, `height`, `base`.
- Spark opens each step by pointing at the picture, says what it is looking at, then enters the blanks one by one through the keypad.

Code: a step is `W(name, ask, note, formula, lines, hl, ok, sp)` next to its question in `_qsAll`; the card is built in `_vhVals` (`vhRows`); the highlight is drawn by `_qsFigure(q, done, hl)` using `_vhHl()`.

## 8. Steps where the student does nothing: read and explore

The first step of a worked problem ("Given and to find") asks for no answer. It must not be a block of text.

- It is a table of the given items, one row each (Cuboid, Roof, Not painted, Paint) plus a **To find** row. The label column is 92 wide, with an eye icon at the right of every row.
- **Every row is clickable.** Clicking a row marks it (soft yellow fill, yellow outline, eye-check icon) and lights the part of the picture it names. Clicking it again clears it. Only one row is marked at a time.
- A row that has nothing to show on the picture (for example Paint) still marks itself but lights nothing.
- A line at the bottom of the card says what to do: "Click each item to see it on the picture. Then click Next step to continue." The student never has to type anything here.
- Spark does the same: it taps each row in turn and says one line about it.
- In data, a row is `[name, text, hl]` and the table has `findHl` for the To find row and `footer` for the line at the bottom.

## 9. Closing the panel is not losing it

- **Got it** closes the panel, keeps every step already done, and gives the answer back to the student (the picture slides back beside the question).
- In the action row, **Skip is replaced by Step-by-step** for as long as the panel has been closed this way and the question is unanswered. Clicking it opens the panel again at the same step, with the same blanks filled, and the picture slides back in.
- If the student answers wrong again while the panel is closed, the panel reopens by itself on the same step, with Vyom saying "Let's pick up where we left off."
- While Spark is working, Got it ends the demonstration and starts the question afresh (there is nothing to resume).

## 10. These rules apply to every question

Nothing in this document is specific to one question.

- Every question's steps use the same card. A question that has no authored working still gets the card: its step text becomes the NOTE row.
- Every question with a picture gets the picture inside the panel and the slide in and out (rule 2).
- Every picture lights the right parts. A step can say which parts (`hl`). If it does not, a picture that already knows its key parts (for example the trapezoid pictures) lights those and dims the rest.
- Closing, reopening and resuming (rule 9) are the same for every question.
- When a new picture is added, give it highlight tokens (faces, edges, labels) and use them from the steps.

## 11. Writing a new question's steps

1. Write the working a student would write in their notes: formula, then the sums.
2. Make each calculation a line, and each number the student must find a blank. Do not hide intermediate values.
3. Start with a read-and-explore step if there is anything to read, with a picture highlight per row.
4. For each step decide what on the picture it is about, and give it an `hl`.
5. Give each blank a one-line hint that says what to do, never the answer.
6. Give Spark a line to open each step, then one line per blank, in the first person.
7. Keep the question text under 330 characters (rule 5).

## 12. A step never shows its own answer

Anything visible while a blank is waiting for the student must not contain that blank's answer.

- **Later lines use references, not numbers.** If a line uses an earlier blank's value ("Two long walls = 2 × 24"), write it as a reference to that blank. It shows `?` until that blank is filled, then shows the value. In data this is `R(0)` for blank 0 of the step (a reference never counts as a blank).
- Values from **earlier steps** may be written out: the student has already found them.
- Words matter as much as numbers: a step's question, its note, its caption and the labels on a number line or a picture must not give the answer away. A label that would show the answer (for example the landing point on a number line) shows `?` until the step is answered.
- Hints may point at the method ("Multiply the length by the height") but not hand over the result.
- **Run the audit** after adding or changing any steps: in the browser console, `__TR._vhLeakAudit()` lists every question and step where the question, note, formula, caption or a working line shows an answer. The list must be empty, or each entry must be a deliberate mention of a number that is given in the question.
- Labels drawn on a picture or a number line are not covered by the audit. Check them by looking at each step once.

## 13. The keypad

- The keypad feeds the active blank of a working step, the number box of a number step, and the top or bottom box of a fraction step.
- A number can be up to 6 digits in a working or number step, and 3 digits in a fraction box.
- Always test a new step type by clicking the keys, not only by setting values in code.

