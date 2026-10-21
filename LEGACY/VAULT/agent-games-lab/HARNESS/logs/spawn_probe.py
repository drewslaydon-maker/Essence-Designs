"""spawn_probe.py — debug: does PtyProcess.spawn hang when parent stdout/stderr
are redirected to files?"""
import sys
import time
from winpty import PtyProcess

print("probe started", flush=True)
sys.stdout.flush()
try:
    p = PtyProcess.spawn(
        r"C:\Users\Andrew\Projects\LEGACY\VAULT\agent-games-lab\ENGINES\dcss\stone_soup-console-0.34\crawl.exe",
        cwd=r"C:\Users\Andrew\Projects\LEGACY\VAULT\agent-games-lab\ENGINES\dcss\stone_soup-console-0.34",
        dimensions=(24, 80),
    )
    print("spawned ok", flush=True)
    time.sleep(3)
    print("alive:", p.isalive(), flush=True)
    p.terminate()
    print("terminated", flush=True)
except Exception as e:
    print("ERROR:", repr(e), flush=True)
    sys.exit(1)