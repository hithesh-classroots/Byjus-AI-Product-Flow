#!/bin/sh
# Rebuild the beta dark pages. Run from the repo root.
#
#   1 convert what has no reference, and point at canvas-bg-dark.css
#   2 lift colour values from Chapter Journey (dark) for the shared selectors
#   3 lift the island surfaces (const glass) from it verbatim
#   4 give the Learn & Practice cards Home (dark)'s card recipe
#   5 relink so every link stays inside the dark beta set
#
# The palette model (model.pkl) is learned from the designer's own light/dark
# pairs; regenerate it with extract.py if those pages change.
set -e
T=tools/beta-dark
python3 -I "$T/gen.py"
python3 -I "$T/lift.py"      "Chapter Journey - Beta Dark.dc.html" "Chapter Journey - Dark.dc.html" "cj-,cd-"
python3 -I "$T/liftjs.py"    "Chapter Journey - Beta Dark.dc.html" "Chapter Journey - Dark.dc.html" "const glass"
python3 -I "$T/homecards.py" "Chapter Journey - Beta Dark.dc.html"
python3 -I "$T/relink.py"
