"""Dark components for the beta pages, using the values the dark pages already use.

Three passes:
  1 explicit recipes for the Learn & Practice components, which exist in no
    dark reference, written from the dark pages' own vocabulary
  2 a contrast pass: within one rule, dark text on a dark surface is the ink
    colour instead. Light-accent buttons with dark text are correct and left be
  3 the practice hero's inline type, which sits on .cd-mesh and so cannot be
    reached by a rule
"""
import re, io, sys

# --- the vocabulary, all of it already in use elsewhere -------------------
INK     = "#cdc7de"                       # app-cosmos-dark INK
DIM     = "#918aac"                       # app-cosmos-dark DIM
CARD    = "#262038"
LINE    = "#3d3459"
# the accent-wash surface Chapter Journey (dark) uses for its island tiles
WASH_V  = "linear-gradient(158deg,#262038 0%,rgba(163,133,250,.22) 100%),#262038"
BUBBLE  = "rgba(36,31,54,.98)"            # Teaching Room (dark) .spk-bubble
# Home (dark)'s resume card, copied from app-cosmos-dark.js: no border, the
# radius is 18, an inset top highlight over a long soft drop, lift on hover.
SHADOW  = "0 1px 0 rgba(255,255,255,.04) inset, 0 14px 30px -18px rgba(0,0,0,.6)"
SHADOW_H= "0 1px 0 rgba(255,255,255,.04) inset, 0 22px 44px -20px rgba(0,0,0,.7)"
HOME_CARD = {"background": CARD, "border": "none", "border-radius": "18px", "box-shadow": SHADOW}

RECIPES = {
    ".cd-mesh":         {"background": CARD},
    # Home's resume card decorates with one faint accent disc off the top-right
    # corner (120px, opacity .55) and a hairline ring behind it
    ".cd-mesh::before": {"background": "radial-gradient(120px 120px at calc(100% + 28px) -28px,rgba(163,133,250,.30) 0%,rgba(163,133,250,.30) 99%,transparent 100%),"
                                       "radial-gradient(176px 176px at calc(100% + 56px) -56px,transparent 97%,rgba(163,133,250,.13) 98%,transparent 100%)"},
    ".cd-pcard":        dict(HOME_CARD),
    ".cd-pcard:hover":  {"box-shadow": SHADOW_H, "transform": "translateY(-3px)"},
    ".cd-intent":       dict(HOME_CARD),
    ".cd-intent:hover": {"box-shadow": SHADOW_H, "transform": "translateY(-3px)", "border-color": "transparent"},
    ".cd-snack":        {"background": CARD, "border": "1px solid " + LINE, "color": INK, "box-shadow": SHADOW},
    ".ftue-speech":     {"background": BUBBLE, "color": INK},
    ".cd-tile-done":    {"background": "rgba(255,255,255,.08)", "border-color": LINE},
    ".cd-tile-score":   {"background": "rgba(255,255,255,.10)", "color": INK},
}

RULE = re.compile(r"(?P<sel>(?:^|\n)[ \t]*[.#a-zA-Z][^\{\n]{0,170}?)\{(?P<body>[^}]*)\}")
HEX  = re.compile(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)")

def _rgb(c):
    c = c.strip().lower()
    if c.startswith("#"):
        h = c[1:]
        if len(h) == 3: h = "".join(x*2 for x in h)
        if len(h) != 6: return None
        try: return (int(h[0:2],16), int(h[2:4],16), int(h[4:6],16), 1.0)
        except ValueError: return None
    m = re.match(r"rgba?\(([^)]*)\)", c)
    if not m: return None
    p = [x.strip() for x in m.group(1).split(",")]
    try:
        return (int(float(p[0])), int(float(p[1])), int(float(p[2])), float(p[3]) if len(p) > 3 else 1.0)
    except (ValueError, IndexError): return None

def _lum(c):
    r = _rgb(c)
    if not r: return None
    return (0.2126*r[0] + 0.7152*r[1] + 0.0722*r[2]) / 255

def _decls(body):
    out, depth, cur = [], 0, ""
    for ch in body:
        if ch == "(": depth += 1
        elif ch == ")": depth -= 1
        if ch == ";" and depth == 0: out.append(cur); cur = ""
        else: cur += ch
    if cur.strip(): out.append(cur)
    return out

def _set(body, prop, val):
    pat = re.compile(r"(^|;)\s*" + re.escape(prop) + r"\s*:[^;]*")
    if pat.search(body):
        return pat.sub(lambda m: (m.group(1) or "") + prop + ":" + val, body, count=1)
    return body.rstrip().rstrip(";") + ";" + prop + ":" + val

def _surface_lum(body):
    """Mean luminance of whatever this rule paints as its own background."""
    vals = []
    for d in _decls(body):
        p = d.split(":", 1)[0].strip().lower()
        if p in ("background", "background-color", "background-image"):
            for c in HEX.findall(d):
                r = _rgb(c)
                if r and r[3] >= 0.5:
                    L = _lum(c)
                    if L is not None: vals.append(L)
    return sum(vals)/len(vals) if vals else None

def apply(path):
    s = io.open(path, encoding="utf-8", errors="replace").read()
    recipes, contrast = [], []

    def repl(m):
        sel, body = m.group("sel").strip(), m.group("body")
        if sel in RECIPES:
            for p, v in RECIPES[sel].items(): body = _set(body, p, v)
            recipes.append(sel)
        bgL = _surface_lum(body)
        if bgL is not None and bgL < 0.38:
            cm = re.search(r"(^|;)\s*color\s*:\s*([^;]+)", body)
            if cm:
                cl = _lum(cm.group(2).strip())
                if cl is not None and cl < 0.40:
                    body = _set(body, "color", INK); contrast.append(sel)
        return m.group("sel") + "{" + body + "}"

    s = RULE.sub(repl, s)

    # the practice-log cards are inline-styled, so no rule reaches them either.
    # Same CSS as Home's resume card.
    log = 0
    for old, new in [
        ("background:rgba(205,199,222,0.78);box-shadow:inset 0 0 0 1px rgba(0,0,0,0.18);",
         "background:%s;box-shadow:%s;" % (CARD, SHADOW)),
        ('style-hover="background:#1a1526;"', 'style-hover="background:#2e2745;"'),
    ]:
        if old in s: s = s.replace(old, new); log += 1

    # the practice hero's type sits on .cd-mesh, so no rule can reach it
    hero = 0
    for old, new in [('color:#1a1526;line-height:1.15;">Practice this chapter',
                      'color:%s;line-height:1.15;">Practice this chapter' % INK),
                     ('color:rgba(26,21,38,0.86);line-height:1.45',
                      'color:%s;line-height:1.45' % DIM)]:
        if old in s: s = s.replace(old, new); hero += 1

    io.open(path, "w", encoding="utf-8").write(s)
    return recipes, contrast, hero, log

if __name__ == "__main__":
    r, c, h, lg = apply(sys.argv[1])
    print(f"  recipes: {len(r)} -> {', '.join(r)}")
    print(f"  contrast fixes (dark text on a dark surface): {len(c)} -> {', '.join(sorted(set(c))[:10])}")
    print(f"  hero inline type: {h}   practice-log cards: {lg}")
