"""stage_probe.py — find where play.py hangs. Runs GameSession + HTTP bind
step by step with prints."""
import sys
import time
import faulthandler

faulthandler.dump_traceback_later(12, exit=True)
sys.path.insert(0, r"C:\Users\Andrew\Projects\LEGACY\VAULT\agent-games-lab\HARNESS")
import play

print("A: imported play", flush=True)
g = play.GameSession("stageprobe")
print("B: session created", flush=True)
g.spawn()
print("C: spawned (game alive: %s)" % g.alive, flush=True)
time.sleep(2)
print("C2: frame text head: %r" % g.frame_text()[:80], flush=True)

from http.server import ThreadingHTTPServer
srv = ThreadingHTTPServer(("127.0.0.1", 8687), play.Handler)
print("D: HTTP server constructed", flush=True)
play.Handler.game = g
print("E: handler set", flush=True)
srv.server_close()
g.close()
print("F: closed clean", flush=True)