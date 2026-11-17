"""Lift a whole JS constant block from the reference dark page.

Some of the island's look is not CSS at all -- the tile surface comes from
`const glass = {...}`, applied inline as style="background:{{ n.islBg }}".
Where the beta and Chapter Journey (dark) declare the same block with the same
shape, the reference wins outright.
"""
import sys, io, re

def find_block(text, decl):
    i = text.find(decl)
    if i < 0: return None
    j = text.find("{", i)
    if j < 0: return None
    depth, k = 0, j
    while k < len(text):
        if text[k] == "{": depth += 1
        elif text[k] == "}":
            depth -= 1
            if depth == 0: return (i, k + 1)
        k += 1
    return None

def shape(blk):
    out = {}
    for sm in re.finditer(r"([a-zA-Z_]\w*)\s*:\s*\{", blk):
        j = blk.find("{", sm.start()); depth, k = 0, j
        while k < len(blk):
            if blk[k] == "{": depth += 1
            elif blk[k] == "}":
                depth -= 1
                if depth == 0: break
            k += 1
        out[sm.group(1)] = sorted(m.group(1) for m in re.finditer(r"(?:^|,)\s*([a-zA-Z_]\w*)\s*:", blk[j+1:k]))
    return out

def lift(target, ref, decl):
    t = io.open(target, encoding="utf-8", errors="replace").read()
    r = io.open(ref, encoding="utf-8", errors="replace").read()
    tb, rb = find_block(t, decl), find_block(r, decl)
    if not tb or not rb:
        return f"  {decl}: not found in both — skipped"
    tblk, rblk = t[tb[0]:tb[1]], r[rb[0]:rb[1]]
    if shape(tblk) != shape(rblk):
        return f"  {decl}: shape differs — skipped (would drop keys)"
    io.open(target, "w", encoding="utf-8").write(t[:tb[0]] + rblk + t[tb[1]:])
    return f"  {decl}: lifted verbatim ({len(tblk)} -> {len(rblk)} chars)"

if __name__ == "__main__":
    print(lift(sys.argv[1], sys.argv[2], sys.argv[3]))
