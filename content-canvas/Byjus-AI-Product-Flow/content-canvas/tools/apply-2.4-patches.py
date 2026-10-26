#!/usr/bin/env python3
"""Apply the 2.4.0-draft edits that touch existing 2.3.0 files, then refresh every size and hash in
content-canvas.index.json. Run from sources/content_canvas after copying the new files in. Safe to re-run."""
from pathlib import Path
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "source"

MOTION = SRC / "guidance/12-motion.html"
EDITS = [
    ("<li>A motion no move covers never blocks a build:",
     "<li>Interaction presets, lines of working and multi-step problems are built from the behaviour tokens and recipes in "
     "<a href=\"#interaction\">14 / Interaction</a>; the moves below are behaviour tokens too. Call them; never rebuild or re-time them.</li>"
     "<li>A motion no move covers never blocks a build:"),
    ("and <code>--cc-hold</code> a mark's motion when the feedback line's length is not passed.",
     "and <code>--cc-hold</code> a mark's motion when the feedback line's length is not passed. Easing is <code>--cc-ease-move</code>, "
     "<code>--cc-ease-in</code> or <code>--cc-ease-out</code>; siblings step <code>--cc-stagger</code> apart."),
]
text = MOTION.read_text()
for old, new in EDITS:
    if new in text:
        continue
    if text.count(old) != 1:
        raise SystemExit(f"12-motion.html: expected exactly one match for: {old[:60]}...")
    text = text.replace(old, new)
MOTION.write_text(text)

index_path = ROOT / "content-canvas.index.json"
index = json.loads(index_path.read_text())
files = {}
for rel in sorted(index["files"]):
    data = (SRC / rel).read_bytes()
    files[rel] = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
index["files"] = files
for concern in index["concerns"]:
    concern["contextBytes"] = sum(files[f]["bytes"] for f in concern["readFiles"])
    concern["resourceBytes"] = sum(files[f]["bytes"] for f in concern["resourceFiles"])
index_path.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n")
print("12-motion.html patched; index sizes and hashes refreshed for", len(files), "files")
