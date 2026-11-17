"""Light -> dark for the Byjus.AI beta pages.

The palette is not invented: it is learned by diffing the light/dark page pairs
the designer already made (Teaching Room, Chapter Journey, Home), then applied
with a few rules about what a colour is *for*, since a colour-for-colour swap
gets surfaces and accents wrong.
"""
import sys, pickle, io
sys.path.insert(0, "/private/tmp/claude-502/-Users-administrator-Downloads-VyomReact/77d1c8df-b2bb-43b1-98f1-69a838d39a48/scratchpad/theme")
from lib import COLOR, role_of, norm, rgb_of, to_css

M = pickle.load(open("/private/tmp/claude-502/-Users-administrator-Downloads-VyomReact/77d1c8df-b2bb-43b1-98f1-69a838d39a48/scratchpad/theme/model.pkl", "rb"))
CAND, KEEP = M["cand"], M["keep"]

# the dark ramp, read off the designer's own builds
RAMP_BG       = ["#1a1526", "#262038", "#3d3459"]
RAMP_INK      = ["#cdc7de", "#918aac", "#3d3459"]
DARK_SURFACE  = "#262038"
SURFACE_ROLES = ("bg", "line", "shadow", "other")

# ---------- colour maths ----------
def _lum(c):
    r = rgb_of(c)
    if not r: return None
    return (0.2126*r[0] + 0.7152*r[1] + 0.0722*r[2]) / 255

def _chroma(c):
    r = rgb_of(c)
    if not r: return 0.0
    rr, gg, bb = (x/255 for x in r[:3])
    return max(rr, gg, bb) - min(rr, gg, bb)

def _hue(c):
    r = rgb_of(c)
    if not r: return None
    rr, gg, bb = (x/255 for x in r[:3])
    mx, mn = max(rr, gg, bb), min(rr, gg, bb)
    d = mx - mn
    if d == 0: return None
    if   mx == rr: h = ((gg-bb)/d) % 6
    elif mx == gg: h = (bb-rr)/d + 2
    else:          h = (rr-gg)/d + 4
    return h * 60

def _hue_gap(a, b):
    ha, hb = _hue(a), _hue(b)
    if ha is None or hb is None: return 0.0
    d = abs(ha - hb) % 360
    return min(d, 360 - d)

def _dist(a, b):
    return sum((x-y)**2 for x, y in zip(a[:3], b[:3]))

# ---------- role tests ----------
def _is_neutral_light(c):
    L = _lum(c)
    return L is not None and L > 0.72 and _chroma(c) < 0.14

def _is_neutral_dark(c):
    L = _lum(c)
    return L is not None and L < 0.40 and _chroma(c) < 0.22

def _ramp(role, rgb):
    lum = (0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2]) / 255
    if role == "ink":
        return RAMP_INK[0] if lum < 0.5 else RAMP_INK[1]
    return RAMP_BG[0] if lum > 0.8 else (RAMP_BG[1] if lum > 0.5 else RAMP_BG[2])

def _guard(role, src, tgt):
    """A plain light surface must not become the ink colour, and dark body text
       must not stay dark. Saturated brand colours keep their mapping."""
    if tgt is None: return None
    tl = _lum(tgt)
    if tl is None: return tgt
    if role in SURFACE_ROLES and _is_neutral_light(src) and tl > 0.45:
        return _ramp(role if role != "other" else "bg", rgb_of(src))
    if role == "ink" and _is_neutral_dark(src) and tl < 0.45:
        return _ramp("ink", rgb_of(src))
    return tgt

def _translucent_white(role, n):
    """A card drawn as translucent white over a light canvas must not become
       translucent black over a dark one -- it would vanish. The designer turns
       those into a light veil at the same opacity (rgba(255,255,255,.26) ->
       rgba(205,199,222,.26)); this follows that where no explicit rule exists."""
    r = rgb_of(n)
    if not r or r[3] >= 1 or role not in SURFACE_ROLES:
        return None
    if min(r[:3]) < 230 or _chroma(n) > 0.08:
        return None
    # a nearly-opaque white surface is a card, and on a dark page it has to be
    # a dark card -- carrying it across as a light veil is what produced the
    # washed-out practice log. Only a genuinely translucent wash stays a veil.
    if r[3] >= 0.5:
        return DARK_SURFACE
    return to_css((205, 199, 222, r[3]), "rgba")

# ---------- choosing a target ----------
_by_role = {}
for (r, sc) in CAND:
    _by_role.setdefault(r, []).append(sc)
ALL_TARGETS = sorted({t for c in CAND.values() for t in c})

def _hue_ok(src, tgt):
    if _chroma(src) <= 0.15:
        return True
    if _chroma(tgt) <= 0.10:
        return False                     # a real colour must not flatten to grey
    return _hue_gap(src, tgt) <= 45

def _from_candidates(role, src):
    """An explicit mapping the designer made for this exact colour in this exact
       role is taken as-is. They do shift hues on purpose in places, and second
       -guessing that is how you end up further from their work, not closer.
       Hue is only enforced on the inferred paths below."""
    c = CAND.get((role, src))
    if not c: return None
    return max(c.items(), key=lambda kv: kv[1])[0]

def _from_hue_family(src):
    """No same-hue target in this colour's own role? Borrow the closest same-hue
       target the designer used anywhere."""
    if _chroma(src) <= 0.15: return None
    best = None
    cs = _chroma(src)
    for t in ALL_TARGETS:
        ct = _chroma(t)
        if ct <= 0.14: continue            # not a real colour any more
        g = _hue_gap(src, t)
        if g > 45: continue
        # same hue is necessary but not sufficient: a vivid source wants a
        # vivid target, not a muted one of the same family
        score = g + 220 * abs(cs - ct)
        if best is None or score < best[0]: best = (score, t)
    return best[1] if best else None

def _from_nearest(role, src, rgb):
    pools = ([role] if role in _by_role else []) + [k for k in _by_role if k != role]
    for pool in pools:
        ranked = sorted((_dist(rgb, rgb_of(sc)), sc) for sc in _by_role[pool] if rgb_of(sc))
        for d, sc in ranked:
            if d > 6000: break
            t = _from_candidates(pool, sc)
            if t and _hue_ok(src, t): return t
    return None

def convert(colour, role):
    n = norm(colour)
    rgb = rgb_of(n)
    if rgb is None or rgb[3] == 0: return colour
    explicit = _from_candidates(role, n)
    if explicit is not None:
        return _guard(role, n, explicit)
    if (role, n) in KEEP and not (role in SURFACE_ROLES and _is_neutral_light(n)):
        return colour
    if role == "shadow":
        # on a dark canvas a shadow is cast in black, not in the border colour.
        # the designer does the same: rgba(253,126,20,.3) -> rgba(0,0,0,.46)
        a = rgb[3] if rgb[3] < 1 else 0.45
        return to_css((0, 0, 0, round(min(max(a, 0.18), 0.75), 3)), "rgba")
    tw = _translucent_white(role, n)
    if tw is not None: return tw
    pick = _guard(role, n, _from_hue_family(n) or _from_nearest(role, n, rgb))
    if pick is None:
        pick = _ramp(role if role != "other" else "bg", rgb)
    if rgb[3] < 1:
        h = rgb_of(pick)
        if h: return to_css((h[0], h[1], h[2], rgb[3]), "rgba")
    return pick

def convert_line(line):
    out, last = [], 0
    for m in COLOR.finditer(line):
        out.append(line[last:m.start()])
        out.append(convert(m.group(0), role_of(line, m.start())))
        last = m.end()
    out.append(line[last:])
    return "".join(out)

def convert_text(s):
    return "\n".join(convert_line(l) for l in s.split("\n"))
