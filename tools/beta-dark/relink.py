import io
CJ_D="Chapter Journey - Beta Dark.dc.html"; GR_D="Practice Room - Guided Retry Beta Dark.dc.html"
TR_D="Teaching Room - Beta Dark.dc.html"
DARK=[("Practice Room - Guided Retry Beta.dc.html",GR_D),("Teaching Room - Beta.dc.html",TR_D),("Chapter Journey - Beta.dc.html",CJ_D)]
for p in (CJ_D,GR_D):
    s=io.open(p,encoding="utf-8",errors="replace").read(); n=0
    for old,new in sorted(DARK,key=lambda t:-len(t[0])):
        c=s.count(old)
        if c: s=s.replace(old,new); n+=c
    io.open(p,"w",encoding="utf-8").write(s)
    print(f"  relinked {p}: {n}")
