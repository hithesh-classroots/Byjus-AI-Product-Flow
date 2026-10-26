# Content Canvas 2.4.0-draft - integration distribution

This folder contains the atomic design-system sources, a compact context selector and the generated human references.

## Start here

1. Read `content-canvas.index.json`.
2. Select the concern ids relevant to the applet.
3. Load only each concern's `readFiles` into model context.
4. Import or copy its `resourceFiles` without loading their contents into context.
5. When a concern lists `componentTypes`, run `python3 select.py <concern-id>` to emit only those component definitions.
   For the `interaction` concern, `python3 select.py interaction --types steps,table` narrows the interaction presets.

Examples:

```sh
python3 select.py interactive
python3 select.py model-library
python3 select.py interaction --types slice,shade,steps
```

## Authored integration sources

- `source/manifest.json` - source topology
- `source/guidance/` - small concern guidance files (`13-interaction.html` is new in 2.4)
- `source/assets/canvas.css` - visual values and CSS, including the 2.4 behaviour, working and problem tokens
- `source/components/component-specs.json` - component variants, states and parameters
- `source/components/behaviour-tokens.json` - 2.4: the closed set of behaviour tokens and the step recipes built from them
- `source/components/interaction-specs.json` - 2.4: the 35 interaction presets in the component-spec shape, each with its behaviour tokens
- `source/components/interaction-script.schema.json` - 2.4: the script format for lines of working and multi-step problems
- `source/contracts/canvas-contract.json` - semantic contract
- `source/runtime/canvas.js` - framework-neutral runtime (stage moves)
- `source/runtime/canvas-interaction.js` - 2.4: behaviour tokens, working player, multi-step problems (`ContentCanvasInteraction`); load after `canvas.js`
- `source/templates/` - HTML, JavaScript and React integration sources

## Generated human references (not model inputs)

- `Content-Canvas.html` - the comprehensive reference built from `source/`.
- `Interaction-Catalogue.html` - 2.4: behaviour tokens, recipes, the 35 components with their demo boards, worked examples, multi-step problems, use cases and the chapter map, all on one page. Its Working and Multi-step boards run on `runtime/canvas-interaction.js`.
- `reference/interaction/` - sample scripts. Patterns to look at, never content to copy.

This is the studio's canonical Content Canvas source: the applet build/convert skills consume the concern pieces + `source/` substrate directly (via `content-canvas.index.json`); the migration tooling and provenance that produced this decomposition are retained outside the studio in the original standalone distribution.
