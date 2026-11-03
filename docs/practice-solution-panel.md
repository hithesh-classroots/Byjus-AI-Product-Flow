# Practice · Solution panel rules

Locked rules for the step-by-step panel ("solution panel") in `Practice Room - Guided Retry.dc.html`. All sizes are in design units: the canvas is 1280 × 720 and scales as one piece, so the same numbers hold at every window size. If you change one of these in the code, change it here too.

## 1. One panel size

- The panel is the same size in every state: step-by-step, Spark watching, and done.
- It starts at the bottom of the question text and ends 80 above the bottom of the canvas. It is full width, with a 16 radius and a 2 border.
- When the chat opens or closes the canvas keeps one size and only slides sideways. Nothing inside the panel resizes.

## 2. A question's picture joins the solution

The picture shown with the question is **the same picture** all the way through. It is never swapped for a copy, never shrunk, and never hidden while help opens.

- When the panel appears (second wrong answer), the panel takes the full width. The picture card stays where it is for 380 ms while the panel lands, then **slides into the panel** and rests on the right of the explanation, vertically centred against the text.
- It keeps its size: the card is the same width and height inside the panel as it was beside the question (for example 460 × 312 for the grain store).
- To make that possible the panel reserves an empty slot of exactly the card's size on the right of its content area, with 28 between the explanation text and the slot. The card sits above the panel while it travels (z-index 8).
- The slide takes 760 ms with an ease-out (quartic). The card follows its slot on every frame, so it lands exactly in the slot even while the panel is still settling.
- When the panel closes (Got it, or Spark finishing), the card slides back to its original place in 420 ms.
- **Nothing may crop the picture.** The card leaves the grid cell it normally sits in, so while it travels the cell around it must not clip: the cell's overflow is `visible` whenever the panel is open (`qsFigCellOv`), and as a guard the code also lifts `overflow` on every ancestor between the card and the question area for the duration of the move, then restores it 460 ms after the card is back. Any new wrapper added around the picture is covered by the guard; do not add a clip that the guard does not lift.
- **Self-check.** When the card lands, the code checks that it sits fully inside the panel's content area and logs a console warning naming this rule if it does not. A picture that is too large for the panel is a content problem: shrink the picture, never let it overflow.
- To verify a change: open help on a question with a picture at 1024 × 768, 1280 × 720 and 1440 × 900 and confirm the whole picture is visible each time.
- Questions with no picture keep the explanation text centred on its own. Number-line questions (the fraction question) draw their own line in the panel and have no separate picture.

Code: `renderVals` (the `vhWide` block) reserves the slot (`vhFigIn`, `vhSlotW`, `vhSlotH`) and lifts the card (`qsFigZ`); the slide and the return are in `componentDidUpdate` (`#qsFigCard`, `#vhFigSlot`); the picture itself is drawn by `_qsFigure`.

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

## 6. Writing a step

- One answer per step, typed or chosen: `num`, `frac`, `choice`, or `ack` (read and continue).
- A step has: a short **name** (rule 3), a **question**, a short **explanation** (what the formula or fact is), the **answer**, a one-line **confirmation** that shows the working, and a **hint**.
- The hint says what to do, never the answer.

Questions that use this format: question 2 (grain store) and question 3 (compare 3/4 and 5/8). Their steps live next to their questions in `_qsAll` as `vhSteps`.
