# Upload to hithesh-classroots/Byjus-AI-Product-Flow

After this PR, `content-canvas/` in Byjus-AI-Product-Flow has exactly the same structure as
`sources/content_canvas/` in classrootsedu/journey_studio_mcpiser, plus the 2.4 interaction files.

## Steps (on a new branch)

1. **Delete** from `content-canvas/` (they are the old 2.1.0 single-file layout and now live under `source/`):
   - `content-canvas/canvas.css`  → replaced by `content-canvas/source/assets/canvas.css`
   - `content-canvas/canvas.js`   → replaced by `content-canvas/source/runtime/canvas.js`
2. **Copy** everything inside `Byjus-AI-Product-Flow/content-canvas/` from this zip into the repo's `content-canvas/`
   (this overwrites `Content-Canvas.html` with the 2.3.0 reference).
3. Commit and open the PR. Nothing needs running: the 12-motion patch is applied and every hash in
   `content-canvas.index.json` matches the files.

```sh
git checkout -b content-canvas-2.4-interaction
git rm content-canvas/canvas.css content-canvas/canvas.js
cp -R <unzipped>/Byjus-AI-Product-Flow/content-canvas/. content-canvas/
git add content-canvas
git commit -m "Content Canvas: 2.1.0 -> 2.3.0 sources, plus 2.4.0-draft interaction"
git push -u origin content-canvas-2.4-interaction
```

`not-for-content-canvas/RULES-AND-GUIDELINES.interaction.update.md` is the relay rules update; it does not go in this folder.

## Resulting tree

```
content-canvas/
  README.md  VERSION  CHANGES-2.4.md  content-canvas.index.json  select.py
  Content-Canvas.html            2.3.0 human reference (generated; not a model input)
  Interaction-Catalogue.html     2.4 human reference (generated; not a model input)
  source/
    manifest.json
    assets/canvas.css            2.3.0 + 2.4 interaction tokens and rules
    components/component-specs.json       2.3.0
    components/behaviour-tokens.json      2.4
    components/interaction-specs.json     2.4
    components/interaction-script.schema.json  2.4
    contracts/canvas-contract.json        2.3.0
    guidance/00-contract … 11-source.html 2.3.0
    guidance/12-motion.html               2.3.0 + two 2.4 sentences
    guidance/13-interaction.html          2.4
    runtime/canvas.js                     2.3.0
    runtime/canvas-interaction.js         2.4
    templates/board.html  CanvasApplet.jsx  example.js   2.3.0
  reference/interaction/   README.md  working-scripts.json  problem-scripts.json   (non-normative)
  tools/apply-2.4-patches.py
```

Every 2.3.0 file was taken from journey_studio_mcpiser and checked against the sha256 in its 2.3.0 index.
