"""Derive a property-aware light->dark colour mapping from the designer's own
Teaching Room dark build, then measure how faithfully it reproduces it."""
import difflib, re, io, json, sys
from collections import Counter, defaultdict

COLOR = re.compile(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)")
# the css property immediately preceding a colour, e.g. "background:#fff"
PROP = re.compile(r"([-a-zA-Z]+)\s*:\s*[^;\"']*$")

def role_of(text, pos):
    """Classify the colour at `pos` by the css property it belongs to."""
    head = text[max(0, pos-120):pos]
    m = PROP.search(head)
    p = (m.group(1).lower() if m else "")
    if p in ("color", "caret-color", "-webkit-text-fill-color"): return "ink"
    if "shadow" in p: return "shadow"
    if "border" in p or "outline" in p: return "line"
    if p in ("background", "background-color", "background-image"): return "bg"
    if p in ("fill",): return "fill"
    if p in ("stroke",): return "stroke"
    if p.startswith("--"): return "var"
    if "gradient" in head[-60:]: return "bg"
    return p or "other"

def pairs_from(lpath, dpath):
    L = io.open(lpath, encoding="utf-8", errors="replace").read().split("\n")
    D = io.open(dpath, encoding="utf-8", errors="replace").read().split("\n")
    out = defaultdict(Counter)
    sm = difflib.SequenceMatcher(None, L, D, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag != "replace" or (i2-i1) != (j2-j1):
            continue
        for a, b in zip(L[i1:i2], D[j1:j2]):
            ca = [(m.group(0), m.start()) for m in COLOR.finditer(a)]
            cb = [m.group(0) for m in COLOR.finditer(b)]
            if len(ca) != len(cb) or COLOR.sub("~", a) != COLOR.sub("~", b):
                continue
            for (x, pos), y in zip(ca, cb):
                if x.lower() != y.lower():
                    out[(role_of(a, pos), x.lower())][y] += 1
    return out

pairs = pairs_from("Teaching Room.dc.html", "Teaching Room - Dark.dc.html")
mapping = {}
conflicts = 0
for (role, src), tgt in pairs.items():
    best, n = tgt.most_common(1)[0]
    total = sum(tgt.values())
    mapping[f"{role}|{src}"] = best
    if len(tgt) > 1:
        conflicts += 1

print(f"rules learned: {len(mapping)}   still ambiguous after role split: {conflicts}")
by_role = Counter(k.split('|')[0] for k in mapping)
print("rules per role:", dict(by_role))
print("\n=== how #fff resolves by role ===")
for (role, src), tgt in sorted(pairs.items()):
    if src == "#fff":
        print(f"  {role:8} -> {tgt.most_common(1)[0][0]}   (from {dict(tgt)})")
json.dump(mapping, io.open(sys.argv[1], "w"), indent=0, sort_keys=True)
print(f"\nwrote {sys.argv[1]}")
