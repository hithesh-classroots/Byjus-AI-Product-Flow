# Update to `RULES-AND-GUIDELINES.md` for Content Canvas 2.4 interaction · draft (for lock)

*Ids are new or amended; no id is renumbered or reused. The full contract is Content Canvas `14 / Interaction`
(`guidance/13-interaction.html`, concern `interaction`).*

## Amend `applet-canvas-10-stage-moves`

After the list of moves, add:

> … or through an **interaction preset**, a **step recipe** or a **behaviour token** (Content Canvas concern
> `interaction`). Every timing, easing and distance is a `--cc-*` token; a kit move that re-times or rebuilds a
> preset or recipe is a finding. *Verbs:* read_source.

## Amend `applet-play-16-synthesised-sound`

> Interaction sound is noise or one glide at `--cc-sfx-peak`, the same pitch on repeats, host mute honoured; a
> two-note rising figure is only correct and a falling one only wrong.

## New rules (append to `applet-play`)

- `applet-play-26-the-learner-makes-the-change` - When the change is the learner's (a cut, a fold, a hop, an
  order), the preset waits on the learner's gesture and the board never shows it already made (P10).
- `applet-play-27-reorder-judged-in-place` - A reorder is judged where the learner left it; the reveal is the last rung (P21).
- `applet-play-28-branch-is-a-choice` - At most four children, two levels; the chosen path stays lit (P22).
- `applet-play-29-the-whole-keeps-its-size` - A slice or fold never changes the size of what it acts on (P11).
- `applet-play-30-working-is-derived` - **Every line of working is born from the line above it through step
  recipes; every number on a line has a source; no side labels name a step** (P12). Simplification uses a hanging
  `=` on every line after the first (P13); multiplication is `×` (P14).
- `applet-play-31-place-value-is-unbreakable` - In column working every digit at rest sits on its own place-value
  column, including products, remainders and carries (P15).
- `applet-play-32-tools-are-called` - Instruments are translucent, arrive from the tool dial and leave when done;
  their guides exist only while they are visible (P16, P17).
- `applet-play-33-weight-uses-physics` - Things with weight move by simulation (P18).
- `applet-play-34-multi-step-uses-the-knowns-rail` - **In a multi-step problem each found quantity is deposited
  into the knowns rail and recalled from it; given quantities are extracted from the statement or figure; nothing
  is retyped** (P23, P24).

## Stage bindings

Add `applet-play-26` … `applet-play-34` to the prototype and MCPise stages.

## Review briefs

`reviews/REVIEW-PHASE-PROTOTYPE.md` and `reviews/REVIEW-CONFORMANCE.md`, motion check: "Every movement is a
behaviour token, step recipe or interaction preset at its own timing; scripts validate against
`interaction-script.schema.json`; no step is named by a board label; place value holds in column working."
