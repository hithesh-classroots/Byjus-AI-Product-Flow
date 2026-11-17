"""Give the Learn & Practice cards -- which only exist in the beta build, so
Chapter Journey (dark) has nothing to lift from -- the card language Home (dark)
uses: #262038 on a 1.5px #3d3459 border, black shadows.
Values copied from app-cosmos-dark.js (CARD, BORDER, SH_*)."""
import re, io, sys

CARD_BG     = "#262038"
CARD_BORDER = "1.5px solid #3d3459"
SHADOW      = "0 1px 0 rgba(255,255,255,.04) inset, 0 14px 30px -18px rgba(0,0,0,.6)"
SHADOW_HOV  = "0 1px 0 rgba(255,255,255,.04) inset, 0 22px 44px -20px rgba(0,0,0,.7)"

CARDS = {
    ".cd-pcard":        {"background": CARD_BG, "border": CARD_BORDER, "box-shadow": SHADOW},
    ".cd-pcard:hover":  {"box-shadow": SHADOW_HOV},
    ".cd-intent":       {"background": CARD_BG, "border": CARD_BORDER, "box-shadow": SHADOW},
    ".cd-intent:hover": {"box-shadow": SHADOW_HOV},
    ".cd-snack":        {"background": CARD_BG, "border": CARD_BORDER, "box-shadow": SHADOW},
}

RULE = re.compile(r"(?P<sel>(?:^|\n)[ \t]*\.[a-zA-Z][^\{\n]{0,160}?)\{(?P<body>[^}]*)\}")

def apply(path):
    s = io.open(path, encoding="utf-8", errors="replace").read()
    hit = []
    def repl(m):
        sel = m.group("sel").strip()
        if sel not in CARDS: return m.group(0)
        body, want = m.group("body"), dict(CARDS[sel])
        for prop, val in want.items():
            pat = re.compile(r"(^|;)\s*" + re.escape(prop) + r"\s*:[^;]*", re.M)
            if pat.search(body): body = pat.sub(lambda mm: (mm.group(1) or "") + prop + ":" + val, body, count=1)
            else:                body = body.rstrip().rstrip(";") + ";" + prop + ":" + val
        hit.append(sel)
        return m.group("sel") + "{" + body + "}"
    io.open(path, "w", encoding="utf-8").write(RULE.sub(repl, s))
    return hit

if __name__ == "__main__":
    print("  home-dark card recipe ->", ", ".join(apply(sys.argv[1])) or "(no match)")
