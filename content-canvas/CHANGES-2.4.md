# Content Canvas 2.4.0-draft · interaction · how to apply

Copy this folder over the repo folder (`sources/content_canvas/` in journey_studio_mcpiser, `content-canvas/` in Byjus-AI-Product-Flow). In this package the patch below is already applied; re-running it is safe:

    cd sources/content_canvas && python3 tools/apply-2.4-patches.py

That inserts two sentences into `source/guidance/12-motion.html` and refreshes every size and hash in
`content-canvas.index.json`. Then apply `governance/RULES-AND-GUIDELINES.interaction.update.md` to the relay rules.

## New files
- `source/guidance/13-interaction.html` - guidance for the new `interaction` concern (14 / Interaction)
- `source/components/behaviour-tokens.json` - 39 behaviour tokens + 38 step recipes
- `source/components/interaction-specs.json` - 35 interaction presets (component-spec shape + behaviours)
- `source/components/interaction-script.schema.json` - script format (working and multi-step)
- `source/runtime/canvas-interaction.js` - `ContentCanvasInteraction` runtime
- `Interaction-Catalogue.html` - generated human reference (one page)
- `reference/interaction/` - 19 working and 7 multi-step sample scripts (non-normative)
- `tools/apply-2.4-patches.py`

## Changed files
- `source/assets/canvas.css` - new tokens in the `.cc-theme` block (easing, distances, stagger, working and problem
  layout, sfx peak) and the `.cc-work-*`, `.cc-problem-*`, `.cc-ledger-*` rules at the end. No 2.3 value changed.
- `source/manifest.json`, `content-canvas.index.json` - `interaction` concern; `motion` covers easing and behaviour tokens; new shared keys
- `select.py` - `--types` for interaction presets
- `README.md`, `VERSION`

## Not yet in the runtime
The 35 presets are specified (values, behaviours, rules) and demonstrated on the catalogue, but only lines of
working, multi-step problems and the behaviour tokens run in `canvas-interaction.js` today. Each preset's demo code
is the reference implementation to port as a kit move, then into the runtime, one at a time.
