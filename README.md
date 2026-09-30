# Byjus.AI — Product Flow handover

**Open `index.html` (or `Product Flow.html`) — double-click works, no server needed.**

Each screen is a single self-contained HTML file (styles, scripts, images, Vyom's animation and the lesson video are all embedded):

1. Onboarding — `Onboarding.html`
2. Home — `Home Page.html` · dark: `Home Page - Dark.html`
3. Chapter Journey — `Chapter Journey.html` · dark: `Chapter Journey - Dark.html`
4. Teaching Room (Spark) — `Teaching Room Spark.html` · dark: `Teaching Room - Dark.html` · original: `Teaching Room.html`
5. Practice Room — `Practice Room.html`
6. Assessment — `Assessment.html`
7. Profile — `Profile.html`

In `Product Flow.html`: numbered pills, ‹ › buttons or keyboard arrows move between steps; **Dark** toggles the dark variant where one exists; ↗ opens the current screen on its own. Links between screens (Home → Chapter Journey → Teaching Room, profile menu, etc.) also work inside each file.

Teaching Room files are ~23 MB each because the lesson video is embedded — give them a few seconds to open.

**Internet** is needed only for the Tabler icon font, and for Vyom's live animation runtime (without it Vyom shows as a still image).

## Folders
- `assets/` — raw files: Vyom (`vyom.riv` animation, `vyom-mascot.png`, `vyom-rive.js` loader), Spark, Max, Aarav avatar, Byjus.AI logo, lesson video.
- `docs/` — Type Scale, Design System, Content Canvas Rules, Dark Mode colour adoption, Teaching Room Spark handover, Practice Room PRD and canvas layout plan, Chapter Journey component spec.
