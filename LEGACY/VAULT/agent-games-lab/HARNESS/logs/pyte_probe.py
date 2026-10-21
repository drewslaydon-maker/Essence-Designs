"""pyte_probe.py — feed the harness's own /raw payload straight into pyte to
see exactly what pyte does with PDCurses-under-winpty ANSI, errors visible."""
import sys
import urllib.request
import json

import pyte

base = "http://127.0.0.1:8687"
with urllib.request.urlopen(base + "/raw", timeout=10) as r:
    payload = json.loads(r.read().decode("utf-8"))
raw = payload["raw"]

print("raw length:", len(raw), flush=True)

screen = pyte.Screen(80, 24)
stream = pyte.Stream(screen)
try:
    stream.feed(raw)
    print("feed ok", flush=True)
except Exception as e:
    print("FEED ERROR:", repr(e), flush=True)

rows = [screen.display[i] for i in range(24)]
nonempty = [r for r in rows if r.strip()]
print("non-empty rows:", len(nonempty), flush=True)
for r in nonempty[:20]:
    print(repr(r), flush=True)