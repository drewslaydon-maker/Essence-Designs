"""HARNESS/play.py — lab system #1: the terminal play harness.

Drives a terminal-native game (DCSS 0.34.1) through a real PTY (pywinpty),
models the screen with pyte, and exposes a tiny HTTP loop so an agent (or a
human, or Drew) can drive the game turn by turn. Every frame is logged to
HARNESS/logs/session_<n>.jsonl for replay.

Endpoints (localhost:8687 by default):
  GET  /frame            -> {"frame": [...rows], "alive": bool, "n": turn}
  POST /key  {"key": s}  -> sends key, settles, returns new frame
  GET  /log              -> full transcript (action + frame per step)
  POST /restart          -> kill and respawn the game process
  POST /shutdown         -> terminate game + server

CLI same-file client:
  python play.py --frame | --key j | --log | --restart | --shutdown
"""

import argparse
import json
import os
import re
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import pyte
from winpty import PtyProcess

ROOT = os.path.dirname(os.path.abspath(__file__))
LOGS = os.path.join(ROOT, "logs")
PIDFILE = os.path.join(LOGS, "server.pid")
STATUS = os.path.join(LOGS, "status.json")
ENGINE_DIR = os.path.join(os.path.dirname(ROOT), "ENGINES", "dcss", "stone_soup-console-0.34")
CRAWL_EXE = os.path.join(ENGINE_DIR, "crawl.exe")
DEFAULT_PORT = 8687
COLS, ROWS = 80, 24

# ---------------------------------------------------------------- process

class GameSession:
    """One live game process under a PTY, screen-modeled with pyte."""

    def __init__(self, name):
        self.name = name
        self.screen = pyte.Screen(COLS, ROWS)
        self.stream = pyte.Stream(self.screen)
        self.proc = None
        self.alive = False
        self.turn = 0
        self.transcript = []          # list of {"n", "action", "frame"}
        self.last_error = ""
        self.last_frame_at = 0.0
        self._raw = ""             # text accumulator; proc.read() returns str
        self._lock = threading.RLock()   # RLock: frame_lines() nests inside spawn()'s lock
        self._logf = open(os.path.join(LOGS, f"session_{name}.jsonl"), "a", encoding="utf-8")

    def _emit(self, obj):
        self._logf.write(json.dumps(obj, ensure_ascii=False) + "\n")
        self._logf.flush()

    def spawn(self):
        with self._lock:
            if self.proc is not None:
                self.kill_locked()
            self.screen.reset()
            self.proc = PtyProcess.spawn(
                CRAWL_EXE, cwd=ENGINE_DIR, dimensions=(ROWS, COLS)
            )
            self.alive = True
            self.turn += 1
            self._emit({"type": "spawn", "exe": CRAWL_EXE, "cols": COLS, "rows": ROWS})
            self._emit({"type": "frame", "n": self.turn, "frame": self.frame_lines()})
        threading.Thread(target=self._drain, daemon=True).start()

    def _drain(self):
        """Read PTY output forever, feeding the screen model."""
        while True:
            if self.proc is None or not self.proc.isalive():
                with self._lock:
                    self.alive = False
                self._emit({"type": "eof", "note": "process ended"})
                return
            try:
                chunk = self.proc.read(4096)
            except EOFError:
                with self._lock:
                    self.alive = False
                self._emit({"type": "eof", "note": "pty closed"})
                return
            except Exception:
                time.sleep(0.05)
                continue
            if not chunk:
                time.sleep(0.05)
                continue
            with self._lock:
                self._raw += chunk
                try:
                    # NOTE: pywinpty PtyProcess.read() already returns str
                    # (pywinpty decodes internally). Feed str directly.
                    self.stream.feed(chunk)
                    self.last_frame_at = time.time()
                except Exception:
                    import traceback
                    self.last_error = traceback.format_exc(limit=4)
                    self._emit({"type": "feed_error", "trace": self.last_error})
                    break

    def frame_lines(self):
        """Render current screen as a list of stripped rows."""
        with self._lock:
            return [self.screen.display[i].rstrip() for i in range(ROWS)]

    def frame_text(self):
        return "\n".join(l for l in self.frame_lines() if l.strip())

    def send_key(self, key):
        with self._lock:
            if not self.alive or self.proc is None:
                return {"error": "game not alive"}
            self.proc.write(_to_bytes(key))
        time.sleep(0.35)  # settle: let the game redraw
        self.turn += 1
        frame = self.frame_lines()
        self._emit({"type": "key", "n": self.turn, "key": key})
        self._emit({"type": "frame", "n": self.turn, "frame": frame})
        write_status(self)
        return {"n": self.turn, "key": key, "alive": self.alive, "frame": frame}

    def kill_locked(self):
        if self.proc is not None:
            try:
                self.proc.terminate()
            except Exception:
                pass
            self.proc = None
        self.alive = False

    def close(self):
        with self._lock:
            self.kill_locked()
        self._logf.close()


def _to_bytes(key):
    """Map a friendly key name to the byte sequence the PTY needs."""
    special = {
        "enter": "\r", "return": "\r", "space": " ", "spc": " ",
        "esc": "\x1b", "escape": "\x1b", "tab": "\t",
        "backspace": "\x7f", "del": "\x7f",
        "up": "\x1b[A", "down": "\x1b[B", "right": "\x1b[C", "left": "\x1b[D",
    }
    k = special.get(key.lower(), key)
    return k

def write_status(game):
    """Public health record — 'am I stuck?' answered by reading this file."""
    with game._lock:
        rows = game.frame_lines()
        obj = {
            "ts": time.time(),
            "pid": os.getpid(),
            "alive": game.alive,
            "turn": game.turn,
            "nonempty_rows": len([r for r in rows if r.strip()]),
            "last_frame_at": game.last_frame_at,
            "last_error": game.last_error,
            "frame_preview": "\n".join(r for r in rows if r.strip())[:600],
        }
    with open(STATUS, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False)
    return obj


def status_tick(game):
    while True:
        try:
            write_status(game)
        except Exception:
            pass
        time.sleep(5)


# ---------------------------------------------------------------- server

class Handler(BaseHTTPRequestHandler):
    game = None

    def log_message(self, *a):
        pass  # quiet

    def _json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.startswith("/frame"):
            g = self.game
            self._json({"n": g.turn, "alive": g.alive, "frame": g.frame_lines()})
        elif self.path.startswith("/log"):
            self._json({"entries": self.game.transcript})
        elif self.path.startswith("/raw"):
            with self.game._lock:
                raw = self.game._raw[-4000:]
            self._json({"raw": raw})
        else:
            self._json({"error": "unknown"}, 404)

    def do_POST(self):
        body = b""
        length = int(self.headers.get("Content-Length", 0) or 0)
        if length:
            body = self.rfile.read(length)
        try:
            data = json.loads(body.decode("utf-8") or "{}")
        except Exception:
            data = {}
        if self.path.startswith("/key"):
            key = data.get("key", "")
            if not key:
                self._json({"error": "no key"}, 400)
                return
            self._json(self.game.send_key(key))
        elif self.path.startswith("/restart"):
            self.game.spawn()
            self._json({"ok": True, "frame": self.game.frame_lines()})
        elif self.path.startswith("/shutdown"):
            self.game.close()
            self._json({"ok": True})
            threading.Thread(target=lambda: (time.sleep(0.3), os._exit(0)), daemon=True).start()
        else:
            self._json({"error": "unknown"}, 404)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=DEFAULT_PORT)
    ap.add_argument("--key", type=str, default=None)
    ap.add_argument("--keys", type=str, default=None,
                    help="comma-separated key sequence, e.g. --keys h,h,j,j")
    ap.add_argument("--frame", action="store_true")
    ap.add_argument("--log", action="store_true")
    ap.add_argument("--restart", action="store_true")
    ap.add_argument("--shutdown", action="store_true")
    args = ap.parse_args()

    # The game's console font includes glyphs outside cp1252 (e.g. \u2302
    # 'house' for stairs). Never let printing crash the turn loop.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    if any([args.key, args.keys, args.frame, args.log, args.restart, args.shutdown]):
        import urllib.request
        base = f"http://127.0.0.1:{args.port}"
        if args.keys:
            steps = []
            final = None
            for k in [_k for _k in re.split(r"[,+\s]+", args.keys) if _k]:
                k = k.strip()
                if not k:
                    continue
                req = urllib.request.Request(
                    base + "/key", data=json.dumps({"key": k}).encode(), method="POST"
                )
                with urllib.request.urlopen(req, timeout=15) as r:
                    resp = json.loads(r.read().decode("utf-8"))
                    steps.append({"n": resp.get("n"), "key": k, "alive": resp.get("alive")})
                    final = resp.get("frame")
            print(json.dumps({"steps": steps, "final": final}, ensure_ascii=False))
            return
        if args.key:
            req = urllib.request.Request(base + "/key", data=json.dumps({"key": args.key}).encode(), method="POST")
        elif args.restart:
            req = urllib.request.Request(base + "/restart", data=b"{}", method="POST")
        elif args.shutdown:
            req = urllib.request.Request(base + "/shutdown", data=b"{}", method="POST")
        else:
            req = urllib.request.Request(base + ("/log" if args.log else "/frame"))
        with urllib.request.urlopen(req, timeout=15) as r:
            print(r.read().decode("utf-8"))
        return

    os.makedirs(LOGS, exist_ok=True)
    with open(PIDFILE, "w") as pf:
        pf.write(str(os.getpid()))
    n = int(time.time())
    game = GameSession(str(n))
    game.spawn()
    # Startup gate: the game must render a visible frame before we serve.
    # Turns "silent wedge" into a loud, fast failure (Drew's sandpit rule).
    deadline = time.time() + 45
    while time.time() < deadline:
        if game.frame_text().strip():
            break
        time.sleep(1)
    if not game.frame_text().strip():
        sys.stderr.write(
            "GATE FAIL: no visible frame after 45s. Raw tail: "
            + game._raw[-2000:]
            + "\n"
        )
        game.close()
        sys.exit(1)
    print(f"GATE PASS: first visible frame at {time.time():.0f}", flush=True)
    Handler.game = game
    write_status(game)
    threading.Thread(target=status_tick, args=(game,), daemon=True).start()
    srv = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"PLAY HARNESS listening on {args.port} (pid={os.getpid()})")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        game.close()


if __name__ == "__main__":
    main()