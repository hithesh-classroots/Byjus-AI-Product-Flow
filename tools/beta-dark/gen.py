import os, sys, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from darken import convert_text
for src,dst in [("Chapter Journey - Beta.dc.html","Chapter Journey - Beta Dark.dc.html"),
                ("Practice Room - Guided Retry Beta.dc.html","Practice Room - Guided Retry Beta Dark.dc.html")]:
    s=convert_text(io.open(src,encoding="utf-8",errors="replace").read()).replace("canvas-bg.css","canvas-bg-dark.css")
    io.open(dst,"w",encoding="utf-8").write(s)
    print(f"  generated {dst}")
