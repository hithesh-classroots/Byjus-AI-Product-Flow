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
# Home (dark)'s "Today's challenge" card
CHALLENGE_BG     = "linear-gradient(115deg,#3a2f1a 0%,#2c2433 55%,#262038 100%)"
CHALLENGE_SHADOW = "0 14px 30px -18px rgba(0,0,0,.6)"

RECIPES = {
    # The practice hero takes Home (dark)'s "Today's challenge" card, copied
    # from app-cosmos-dark.js: the warm 115deg wash, radius 18, the long soft
    # drop, and the two hairline amber rings that sit off its left edge
    # (150px at left:-40 and 230px at left:-80, both centred vertically).
    ".cd-mesh":         {"background": CHALLENGE_BG,
                         "border-radius": "18px",
                         "box-shadow": CHALLENGE_SHADOW},
    # The decorative layer is animated (cdMesh, 14s), so anything drawn on it
    # drifts. The challenge card's rings are static, and read as moving circles
    # here, so the layer is dropped entirely and the card keeps just its wash.
    ".cd-mesh::before": {"display": "none", "background": "none", "animation": "none"},
    ".cd-pcard":        dict(HOME_CARD),
    ".cd-pcard:hover":  {"box-shadow": SHADOW_H, "transform": "translateY(-3px)"},
    ".cd-intent":       dict(HOME_CARD),
    ".cd-intent:hover": {"box-shadow": SHADOW_H, "transform": "translateY(-3px)", "border-color": "transparent"},
    ".cd-snack":        {"background": CARD, "border": "1px solid " + LINE, "color": INK, "box-shadow": SHADOW},
    ".ftue-speech":     {"background": BUBBLE, "color": INK},
    # the header avatar, beside the light/dark switch
    ".cj-profilebtn":   {"background": "#261f37", "box-shadow": "0 1px 3px rgba(0,0,0,.45)"},
    ".cj-profilebtn:hover": {"box-shadow": "0 4px 10px -3px rgba(0,0,0,.6)"},
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

PAGE_LUM = 0.09          # #1a1526, what every beta dark page sits on
DARK_ACCENTS = ["#4da3f0", "#4cbf6e", "#f07171", "#e8a53f", "#a385fa"]

def _alpha(c):
    import re as _re
    m = _re.match(r"rgba\(([^)]*)\)", c.strip().lower())
    if not m: return 1.0
    parts = [x.strip() for x in m.group(1).split(",")]
    try: return float(parts[3]) if len(parts) > 3 else 1.0
    except (ValueError, IndexError): return 1.0

def _eff_lum(c, under=PAGE_LUM):
    """Luminance as actually seen: a translucent colour is blended with what
       sits behind it, which on these pages is the dark canvas."""
    L = _lum(c)
    if L is None: return None
    a = _alpha(c)
    return a * L + (1 - a) * under

def _contrast(bg, fg):
    lb, lf = _eff_lum(bg), _eff_lum(fg)
    if lb is None or lf is None: return None
    hi, lo = max(lb, lf), min(lb, lf)
    return (hi + 0.05) / (lo + 0.05)

def _chroma_of(c):
    r = _rgb(c)
    if not r: return 0.0
    rr, gg, bb = (x/255 for x in r[:3])
    return max(rr, gg, bb) - min(rr, gg, bb)

def _hue_of(c):
    r = _rgb(c)
    if not r: return None
    rr, gg, bb = (x/255 for x in r[:3])
    mx, mn = max(rr,gg,bb), min(rr,gg,bb)
    d = mx - mn
    if d == 0: return None
    if   mx == rr: h = ((gg-bb)/d) % 6
    elif mx == gg: h = (bb-rr)/d + 2
    else:          h = (rr-gg)/d + 4
    return h * 60

def _readable_on(bg, fg):
    """A text colour that carries on this surface. Neutral text takes the ink
       colour; a real colour keeps its hue and moves to the dark palette's
       member of that family."""
    if _chroma_of(fg) < 0.15:
        return INK if (_eff_lum(bg) or 0) < 0.45 else "#1a1526"
    hf = _hue_of(fg)
    best = None
    for cand in DARK_ACCENTS:
        hc = _hue_of(cand)
        gap = 180 if (hf is None or hc is None) else min(abs(hf-hc) % 360, 360 - abs(hf-hc) % 360)
        con = _contrast(bg, cand) or 0
        if con >= 3.0 and (best is None or gap < best[0]):
            best = (gap, cand)
    return best[1] if best else (INK if (_eff_lum(bg) or 0) < 0.45 else "#1a1526")

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

def _own_background(body):
    for d in _decls(body):
        p = d.split(":", 1)[0].strip().lower()
        if p in ("background", "background-color"):
            cols = HEX.findall(d)
            if cols: return cols[0]
    return None

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
        bg = _own_background(body)
        cm = re.search(r"(^|;)\s*color\s*:\s*([^;]+)", body)
        if bg and cm:
            fg = cm.group(2).strip()
            con = _contrast(bg, fg)
            if con is not None and con < 3.0:
                body = _set(body, "color", _readable_on(bg, fg)); contrast.append(sel)
        return m.group("sel") + "{" + body + "}"

    s = RULE.sub(repl, s)

    # Inline styles get the same check. The calculator is built this way, which
    # is why its keys and tabs kept near-black labels on near-black surfaces.
    inline = 0
    def fix_inline(m):
        nonlocal inline
        body = m.group(1)
        bg = _own_background(body)
        cm = re.search(r"(^|;)\s*color\s*:\s*([^;]+)", body)
        if not (bg and cm): return m.group(0)
        fg = cm.group(2).strip()
        con = _contrast(bg, fg)
        if con is None or con >= 3.0: return m.group(0)
        inline += 1
        return 'style="' + _set(body, "color", _readable_on(bg, fg)) + '"'
    s = re.sub(r'style="([^"]{0,600})"', fix_inline, s)

    # The practice icon carries three decorative rings as aria-hidden spans --
    # two hairline circles and a blurred glow. They are dropped here.
    rings = 0
    for span in [
        '<span style="position:absolute;width:280px;height:280px;border-radius:50%;border:1px solid rgba(205,199,222,0.16);"></span>',
        '<span style="position:absolute;width:190px;height:190px;border-radius:50%;border:1px solid rgba(205,199,222,0.22);"></span>',
        '<span style="position:absolute;width:120px;height:120px;border-radius:50%;background:rgba(205,199,222,0.28);filter:blur(18px);"></span>',
    ]:
        if span in s: s = s.replace(span, ""); rings += 1

    # The calculator keypad is coloured by one ternary chain. Converting it
    # collapsed equals and operators onto the same blue AND gave the operators
    # that same blue as their label, so the glyphs were invisible; the number
    # keys got the same blue on near-black. Rebuilt as a hierarchy from the
    # dark palette: equals is the accent, operators a raised surface, numbers
    # the card, all on the ink colour.
    keypad = 0
    _kp = re.compile(
        r"bg:\s*eq\s*\?\s*'[^']*'\s*:\s*op\s*\?\s*'[^']*'\s*:\s*util\s*\?\s*'[^']*'\s*:\s*'[^']*',"
        r"\s*fg:\s*eq\s*\?\s*'[^']*'\s*:\s*op\s*\?\s*'[^']*'\s*:\s*util\s*\?\s*'[^']*'\s*:\s*'[^']*',"
        r"\s*sh:\s*\(eq\|\|util\)\s*\?\s*'none'\s*:\s*'[^']*'")
    _kp_new = ("bg: eq ? '#4da3f0' : op ? '#3d3459' : util ? 'rgba(255,255,255,.10)' : '#262038', "
               "fg: eq ? '#1a1526' : op ? '" + INK + "' : util ? '" + INK + "' : '" + INK + "', "
               "sh: (eq||util) ? 'none' : '0 2px 0 rgba(0,0,0,.35)'")
    s, keypad = _kp.subn(_kp_new, s)

    # JS-computed style objects. The Practice-with-Vyom panel is built from one
    # of these, which is why it came out a bright purple fill with near-black
    # type -- no stylesheet is involved at all.
    js = 0
    for old_s, new_s in [
        ("cardBg: '#a385fa'",                "cardBg: '" + CARD + "'"),
        ("ink: '#1a1526', sub: 'rgba(205,199,222,0.86)'",
         "ink: '" + INK + "', sub: '" + DIM + "'"),
        ("bg: on ? '#262038' : 'rgba(205,199,222,0.75)'",
         "bg: on ? '#262038' : 'rgba(255,255,255,.08)'"),
        ("bg: on ? '#262038' : 'rgba(205,199,222,0.9)'",
         "bg: on ? '#262038' : 'rgba(255,255,255,.08)'"),
        ("bg: s ? '#1a1526' : 'rgba(205,199,222,0.1)'",
         "bg: s ? '#1a1526' : 'rgba(255,255,255,.08)'"),
        ("ink: s ? '#a385fa' : 'rgba(205,199,222,0.72)'",
         "ink: s ? '#a385fa' : '" + INK + "'"),
        # the calculator's Submit: amber label on an amber button, and a
        # near-black label on the faint disabled veil
        ("calcSubmitFg: ok ? '#b57a24' : '#262038'",
         "calcSubmitFg: ok ? '#1a1526' : 'rgba(205,199,222,.45)'"),
        # The calculator and the answer composer are tinted by a full-bleed
        # overlay -- in light a teal gradient, which converted to a bright blue
        # and made the panel read as a solid colour block on a dark page. They
        # take the raised-card gradient instead. The small accent button that
        # shares the hue is matched separately, by its cursor/colour, so it
        # keeps its blue.
        ("inset:0;background:linear-gradient(45deg,#2a7bbd,#4da3f0)",
         "inset:0;background:linear-gradient(45deg,#262038,#2e2745)"),
        ("inset:0;background:linear-gradient(160deg,#2a7bbd,#2a7bbd)",
         "inset:0;background:linear-gradient(160deg,#211c31,#262038)"),
        # the working-card check label on its #3d3459 chip
        ("vhCheckInk:(v.num && (S.den||v.den) && !v.locked) ? '#1a1526' : '#918aac'",
         "vhCheckInk:(v.num && (S.den||v.den) && !v.locked) ? '#1a1526' : '" + INK + "'"),
    ]:
        if old_s in s: s = s.replace(old_s, new_s); js += 1
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
    for old, new in [('color:#1a1526;">Practice with Vyom',
                      'color:%s;">Practice with Vyom' % INK),
                     ('color:#1a1526;line-height:1.15;">Practice this chapter',
                      'color:%s;line-height:1.15;">Practice this chapter' % INK),
                     ('color:rgba(26,21,38,0.86);line-height:1.45',
                      'color:%s;line-height:1.45' % DIM)]:
        if old in s: s = s.replace(old, new); hero += 1

    io.open(path, "w", encoding="utf-8").write(s)
    return recipes, contrast, hero, log, js, rings, inline, keypad

if __name__ == "__main__":
    r, c, h, lg, j, rg, inl, kp = apply(sys.argv[1])
    print(f"  recipes: {len(r)} -> {', '.join(r)}")
    print(f"  contrast fixes (dark text on a dark surface): {len(c)} -> {', '.join(sorted(set(c))[:10])}")
    print(f"  hero inline type: {h}   practice-log cards: {lg}   js style objects: {j}   decorative rings removed: {rg}   inline contrast fixes: {inl}   keypad: {kp}")
