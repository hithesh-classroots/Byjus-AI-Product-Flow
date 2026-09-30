# Practice Room — PRD

The room a student lands in from any practice card on a chapter. One job: **answer questions, one at a time, and know instantly how it went.** It is not a lesson — nothing is taught here, and no second character explains anything.

---

## 1. Principles

1. **One question on screen. Nothing else competing.** The question is the page, centred, with generous air around it.
2. **No Spark.** Teaching is the Teaching Room's job. Here, help arrives only when the student asks for it, as a hint.
3. **Vyom is docked, and only reacts.** He sits bottom-right and says one short line after each answer — praise when right, encouragement when wrong. He never explains, never narrates, never asks.
4. **Feedback is felt before it is read.** Colour bursts from the bottom-right corner (Vyom's position), the way rewards fly in the Teaching Room.
5. **A ten-year-old's reading load.** One sentence maximum in any supporting text. No paragraphs.

---

## 2. Layout

Everything on the centre line. Three bands, top to bottom:

| Band | Contains | Alignment |
|---|---|---|
| **Top bar** | Back arrow (left) · mode + chapter (left) · progress rail (centre) · timer, if timed (right) | Full width, fixed height |
| **Stage** | Question number → question → answer options → action row | **Centred column, max ~640px, vertically centred in the remaining height** |
| **Dock** | Vyom + his one-line reaction | Bottom-right, floating over the stage |

The stage is the only thing that changes between question types. The top bar and dock are constant.

**Answer options** are a centred stack (single column) at one width — never a grid, never two columns. Each option is a full-width row: letter key, then the answer text. Numeric answers get the same treatment.

---

## 3. Question types

| Type | Input | Marking |
|---|---|---|
| **Multiple choice** | Tap one of 3–4 options | Instant |
| **Numeric** | Number pad / typed value | Instant, exact match |
| **True or false** | Two large options | Instant |
| **Multi-select** | Tap several, then Check | Instant, all-or-nothing |
| **On paper** | Problems listed, student photographs their sheet | Deferred, marked on method |

All five share the same centred stage and the same feedback grammar.

---

## 4. The answer moment

This is the core interaction. On tap:

1. **Option state resolves immediately** — the correct row goes green, a wrong pick goes red with the correct one still shown green.
2. **Colour burst from the bottom-right.** Correct: warm confetti (gold, green, violet) sprays up and left from Vyom's dock, ~1.2s. Wrong: no burst — a single soft amber pulse behind the dock instead, so failure is quiet rather than punished.
3. **Vyom reacts** with one line, held until the next question:
   - Right: *"Awesome — that's exactly it."* / *"Nailed it."* / *"Yes! Straight through."*
   - Wrong: *"Not this time. Next one's yours."* / *"Close. Shake it off."* / *"That one's tricky — keep going."*
   - Never explains the answer. Never says "you should have…".
4. **The action row appears** with Next question (or See how I did on the last one).

**Rewards.** +XP per correct answer, flying from the dock to the XP widget on completion — same particle treatment as the Teaching Room's milestone payout.

---

## 5. Hints

The only help in the room.

- One **Give me a hint** button, always available before an answer is chosen, never after.
- A hint costs **1 orb**. The button shows the cost; if the student has none, it is disabled with "You're out of orbs".
- The hint replaces Vyom's line in the dock — it does not open a panel or a chat.
- Maximum one hint per question.
- Taking a hint still allows full marks; the cost is the orb, not the score.

---

## 6. Progress and timing

- **Progress rail** in the top bar: one segment per question, filled as you go, green for answered-correct, grey ahead. Small enough to glance at, never a percentage.
- **Timer** only in timed modes, top-right, counting down. At zero the room ends and scores what was answered.
- **No pause.** A ten-minute sprint that can be paused is not a sprint.

---

## 7. Ending a session

A centred result:

- Score as a large fraction (**7 / 10**).
- One line of verdict, warm and non-judgemental.
- XP earned, flying to the widget.
- Two actions: **Back to the chapter** (primary) and **Go again**.
- Below that, a **Review** link — every question with what you answered.

## 8. Reviewing a finished session

Reached from a Finished card on the chapter, or from the result screen.

- Same centred column.
- Each question as a row: tick or cross, the question, what you said, and — only where you were wrong — the right answer.
- The score shown is **that attempt's** recorded mark, never a recount.
- Written work shows the marker's note per problem rather than a right/wrong.

---

## 9. What is deliberately NOT here

- Spark, or any second character.
- A chat panel. Vyom does not converse in this room.
- Explanations, worked solutions, or "learn more" links. Those belong to the Teaching Room.
- Any route to the product-wide Practice page.
- Narration or read-aloud.

---

## 10. States to build

| State | Trigger |
|---|---|
| Asking | Default |
| Answered — correct | Tap correct option |
| Answered — wrong | Tap wrong option |
| Hint shown | Hint tapped |
| Out of orbs | Hint tapped with 0 orbs |
| Paper mode | Mode = on paper |
| Photo taken | Sheet uploaded, awaiting marking |
| Time up | Timer hits zero |
| Finished | Last question answered |
| Reviewing | Opened from a Finished card |

---

## 11. Rules — settled

1. **A hint costs 1 orb.** One per question, before answering only.
2. **Two tries.** First tap wrong: that option goes red, the rest stay live, Vyom says try once more. A correct second try **scores half**. Second tap wrong: the answer is revealed and the question scores zero.
3. **XP is weighted by difficulty** — quick drill 5, sprint 8, chapter test 10, hard problems 12 per question. Half-credit answers pay half XP.
4. **Photo marking is instant.** The sheet is read on the spot; the student never waits.
5. **A timed sprint counts only towards its own best score** — it does not move chapter progress.

Scores are therefore fractional: six questions answered as four first-try, one second-try and one missed reads **4.5 / 6**.
