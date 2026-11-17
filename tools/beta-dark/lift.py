"""Overlay the designer's real dark values onto the generated dark page.

For every selector the beta page shares with Chapter Journey (dark), the
colour-bearing declarations are taken from that file verbatim. Layout
declarations stay as the beta page has them, because the beta page is the
Learn & Practice build and its geometry differs.
"""
import re, io, sys

RULE = re.compile(r"(?P<sel>(?:^|\n)[ \t]*\.[a-zA-Z][^\{\n]{0,160}?)\{(?P<body>[^}]*)\}")
COLOUR_PROPS = ("background", "background-color", "background-image", "color",
                "border", "border-color", "border-top", "border-right",
                "border-bottom", "border-left", "box-shadow", "fill", "stroke",
                "outline", "outline-color", "text-shadow", "-webkit-text-fill-color",
                "caret-color", "accent-color", "border-top-color",
                "border-bottom-color", "border-left-color", "border-right-color")

def decls(body):
    out = []
    depth = 0; cur = ""
    for ch in body:
        if ch == "(": depth += 1
        if ch == ")": depth -= 1
        if ch == ";" and depth == 0:
            out.append(cur); cur = ""
        else:
            cur += ch
    if cur.strip(): out.append(cur)
    return [d for d in out if d.strip()]

def prop_of(d):
    i = d.find(":")
    return d[:i].strip().lower() if i > 0 else ""

def index_rules(text):
    idx = {}
    for m in RULE.finditer(text):
        idx.setdefault(m.group("sel").strip(), m.group("body"))
    return idx

def merge(dark_body, ref_body):
    """Keep dark_body's layout; take ref_body's colour declarations."""
    ref = {}
    for d in decls(ref_body):
        p = prop_of(d)
        if p in COLOUR_PROPS: ref[p] = d.strip()
    if not ref: return None
    out, seen = [], set()
    for d in decls(dark_body):
        p = prop_of(d)
        if p in ref:
            out.append(ref[p]); seen.add(p)
        else:
            out.append(d.strip())
    for p, d in ref.items():
        if p not in seen: out.append(d)
    return ";".join(out) + ";"

def lift(target_path, ref_path, prefixes):
    tgt = io.open(target_path, encoding="utf-8", errors="replace").read()
    ref = index_rules(io.open(ref_path, encoding="utf-8", errors="replace").read())
    n = 0
    def repl(m):
        nonlocal n
        sel = m.group("sel").strip()
        if not any(sel.lstrip(".").startswith(p) or sel.startswith("." + p) for p in prefixes):
            return m.group(0)
        if sel not in ref: return m.group(0)
        merged = merge(m.group("body"), ref[sel])
        if merged is None: return m.group(0)
        n += 1
        return m.group("sel") + "{" + merged + "}"
    out = RULE.sub(repl, tgt)
    io.open(target_path, "w", encoding="utf-8").write(out)
    return n

if __name__ == "__main__":
    n = lift(sys.argv[1], sys.argv[2], sys.argv[3].split(","))
    print(f"  lifted real dark values into {n} selectors of {sys.argv[1]}")
