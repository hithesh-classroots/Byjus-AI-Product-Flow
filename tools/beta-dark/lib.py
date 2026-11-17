import difflib, re, io
from collections import Counter, defaultdict

COLOR = re.compile(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)")
PROP  = re.compile(r"([-a-zA-Z]+)\s*:\s*[^;\"']*$")

def role_of(text, pos):
    head = text[max(0, pos-120):pos]
    m = PROP.search(head)
    p = (m.group(1).lower() if m else "")
    if p in ("color", "caret-color", "-webkit-text-fill-color"): return "ink"
    if "shadow" in p: return "shadow"
    if "border" in p or "outline" in p: return "line"
    if p in ("background", "background-color", "background-image"): return "bg"
    if p == "fill": return "fill"
    if p == "stroke": return "stroke"
    if p.startswith("--"): return "var"
    if "gradient" in head[-60:]: return "bg"
    return p or "other"

def learn(lpath, dpath, into=None):
    into = into if into is not None else defaultdict(Counter)
    L = io.open(lpath, encoding="utf-8", errors="replace").read().split("\n")
    D = io.open(dpath, encoding="utf-8", errors="replace").read().split("\n")
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, L, D, autojunk=False).get_opcodes():
        if tag != "replace" or (i2-i1) != (j2-j1):
            continue
        for a, b in zip(L[i1:i2], D[j1:j2]):
            ca = [(m.group(0), m.start()) for m in COLOR.finditer(a)]
            cb = [m.group(0) for m in COLOR.finditer(b)]
            if len(ca) != len(cb) or COLOR.sub("~", a) != COLOR.sub("~", b):
                continue
            for (x, pos), y in zip(ca, cb):
                if x.lower() != y.lower():
                    into[(role_of(a, pos), x.lower())][y] += 1
    return into

def resolve(counts):
    return {f"{r}|{s}": c.most_common(1)[0][0] for (r, s), c in counts.items()}

def colours_in(path):
    s = io.open(path, encoding="utf-8", errors="replace").read()
    out = Counter()
    for line in s.split("\n"):
        for m in COLOR.finditer(line):
            out[(role_of(line, m.start()), m.group(0).lower())] += 1
    return out

# ---------- normalisation ----------
def norm(c):
    c = c.strip().lower().replace(" ", "")
    if c.startswith("#") and len(c) == 7:
        if c[1]==c[2] and c[3]==c[4] and c[5]==c[6]:
            return "#" + c[1] + c[3] + c[5]
    return c

def rgb_of(c):
    c = norm(c)
    if c.startswith("#"):
        h = c[1:]
        if len(h) == 3: h = "".join(ch*2 for ch in h)
        if len(h) != 6: return None
        try: return (int(h[0:2],16), int(h[2:4],16), int(h[4:6],16), 1.0)
        except ValueError: return None
    m = re.match(r"rgba?\(([^)]*)\)", c)
    if not m: return None
    parts = [p.strip() for p in m.group(1).split(",")]
    try:
        r,g,b = (int(float(p)) for p in parts[:3])
        a = float(parts[3]) if len(parts) > 3 else 1.0
        return (r,g,b,a)
    except ValueError: return None

def to_css(rgb, like):
    r,g,b,a = rgb
    if a >= 1.0 and not like.startswith("rgba"):
        return "#%02x%02x%02x" % (r,g,b)
    return f"rgba({r},{g},{b},{a:g})"

def learn_keep(lpath, dpath):
    """Colours the designer deliberately left identical in the dark build."""
    L = io.open(lpath, encoding="utf-8", errors="replace").read().split("\n")
    D = io.open(dpath, encoding="utf-8", errors="replace").read().split("\n")
    keep = Counter()
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, L, D, autojunk=False).get_opcodes():
        if tag != "equal": continue
        for a in L[i1:i2]:
            for m in COLOR.finditer(a):
                keep[(role_of(a, m.start()), norm(m.group(0)))] += 1
    return keep
