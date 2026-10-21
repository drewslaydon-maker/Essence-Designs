"""HARNESS/playloop.py -- lab system #2: burst play-driver.

Runs a DEFINED BURST of play against the live harness (play.py server at
127.0.0.1:8687) inside ONE approved launch call per phase. Every key is
sent one at a time, the frame is re-read after each key, and a compact
JSON summary is returned. Every action is appended to
HARNESS/logs/burstlog.jsonl alongside the canonical session jsonl.

Zero-agent: this tool only presses keys the game itself teaches (vi
movement, o = explore, tab = auto-fight, , = pickup, > / < = stairs).
It NEVER consults guides or wikis. It is the HAND -- the agent (me, the
Experiencer) stays the MIND and picks the burst plan each phase.

Tasks (burst plans):
  key      -- send one key or a key sequence (--keys h,>,pickup,n)
  move     -- send movement keys one at a time; stop early on repeated blocks
  explore  -- press o (auto-explore) until floor is done or budget runs out
  fight    -- press tab (auto-fight) until combat ends or budget runs out
  descend  -- find the down-stairs glyph (>) in the frame, path to it, press >
  phase    -- run a JSON plan file in order (HARNESS/bursts/<name>.json)

Stop conditions checked after EVERY key: game over (death / win / PTY dead),
HP at 0, or the task's own budget. On game over the driver stops and reports.

Usage:
  python playloop.py --check
  python playloop.py --task key     --keys l
  python playloop.py --task move    --keys hhhh
  python playloop.py --task explore [--budget 60]
  python playloop.py --task fight   [--budget 15]
  python playloop.py --task descend [--max-steps 80]
  python playloop.py --task phase   --file bursts/phase_001.json
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.request

DEFAULT_PORT = 8687
ROOT = os.path.dirname(os.path.abspath(__file__))
LOGS = os.path.join(ROOT, "logs")
BURSTLOG = os.path.join(LOGS, "burstlog.jsonl")

FRIENDLY = {
    "pickup": ",",      # grab item on your tile
    "stairs": ">",      # descend stairs
    "down": ">",
    "upstairs": "<",    # ascend stairs
    "up": "<",
    "enter": "\r",
    "return": "\r",
    "space": " ",
    "spc": " ",
    "esc": "\x1b",
    "escape": "\x1b",
    "tab": "\t",
    "backspace": "\x7f",
    "wait": "5",        # DCSS: wait/rest one turn with '5'
}

# Death / terminal-state markers -- scanned in the frame + message tail.
GAMEOVER_MARKS = (
    "you die",
    "you are dead",
    "you have been slain",
    "morgue",
    "escaped with the orb",
)


def to_key(s):
    """Resolve a friendly key name to the raw byte string, else passthrough."""
    return FRIENDLY.get(s.strip().lower(), s)


def split_keys(spec):
    """Split a comma key list, dropping empties; keep friendly names intact."""
    return [p.strip() for p in str(spec).split(",") if p.strip()]


class Harness:
    """Thin client for the play.py HTTP harness."""

    def __init__(self, port):
        self.base = f"http://127.0.0.1:{port}"

    def _req(self, path, data=None, timeout=20):
        if data is None:
            req = urllib.request.Request(self.base + path)
        else:
            body = json.dumps(data).encode("utf-8")
            req = urllib.request.Request(
                self.base + path, data=body, method="POST"
            )
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))

    def frame(self):
        return self._req("/frame")

    def send(self, key):
        return self._req("/key", {"key": key})

    def restart(self):
        return self._req("/restart", {})

    def shutdown(self):
        return self._req("/shutdown", {})


def text_of(frame):
    return "\n".join(frame)


def stats_of(frame):
    """Pull the game's own status fields from the frame (the reliable ones)."""
    t = text_of(frame)
    hp = None
    m = re.search(r"Health:\s*(\d+)/(\d+)", t)
    if m:
        hp = (int(m.group(1)), int(m.group(2)))
    timef = None
    m = re.search(r"Time:\s*([\d.]+)", t)
    if m:
        timef = float(m.group(1))
    place = None
    m = re.search(r"Place:\s*(\S+)", t)
    if m:
        place = m.group(1)
    xl = None
    m = re.search(r"XL:\s*(\d+)", t)
    if m:
        xl = int(m.group(1))
    return {"hp": hp, "time": timef, "place": place, "xl": xl}


def tail_of(frame, n=8):
    """Last nonempty frame rows -- usually the game message window."""
    rows = [r.strip() for r in frame if r.strip()]
    return rows[-n:]


def find_glyph(frame, glyph):
    """Return (row, idx) of the first glyph occurrence, or None."""
    for i, row in enumerate(frame):
        j = row.find(glyph)
        if j >= 0:
            return (i, j)
    return None


def game_over(frame):
    t = text_of(frame).lower()
    st = stats_of(frame)
    if st["hp"] is not None and st["hp"][0] <= 0:
        return True
    return any(mark in t for mark in GAMEOVER_MARKS)


class Burst:
    def __init__(self, port, log=True):
        self.h = Harness(port)
        self.log = log
        self.events = []
        os.makedirs(LOGS, exist_ok=True)

    def _emit(self, obj):
        if self.log:
            with open(BURSTLOG, "a", encoding="utf-8") as fh:
                fh.write(json.dumps(obj, ensure_ascii=False) + "\n")

    def send_check(self, key, note=""):
        """Send one key, record effect, return (resp, stats_before_to_after)."""
        before = None
        try:
            before = self.h.frame()
        except Exception:
            pass
        b_stats = stats_of(before["frame"]) if before else {}
        resp = self.h.send(key)
        stats = stats_of(resp["frame"])
        moved = (
            b_stats.get("time") is not None
            and stats.get("time") is not None
            and stats["time"] > b_stats["time"]
        )
        dead = game_over(resp["frame"])
        ev = {
            "ts": time.time(),
            "key": key,
            "note": note,
            "n": resp.get("n"),
            "alive": resp.get("alive"),
            "time": stats.get("time"),
            "hp": (stats["hp"][0] if stats.get("hp") else None),
            "place": stats.get("place"),
            "moved": moved,
            "game_over": dead,
        }
        self.events.append(ev)
        self._emit(ev)
        return resp, ev

    def run_key(self, keys, budget=None):
        n = 0
        for raw in keys:
            if budget is not None and n >= budget:
                break
            resp, ev = self.send_check(to_key(raw))
            n += 1
            if ev["game_over"]:
                break
        return {"turns": n}

    def run_move(self, keys, budget=None, max_block=3):
        n = 0
        blocked = 0
        for raw in keys:
            if budget is not None and n >= budget:
                break
            resp, ev = self.send_check(to_key(raw))
            n += 1
            if not ev["moved"]:
                blocked += 1
                if blocked >= max_block:
                    break
            else:
                blocked = 0
            if ev["game_over"]:
                break
        return {"turns": n}

    def run_explore(self, budget=60, quiet_stop=2):
        """Press o until the floor is done: twice no time and no new message."""
        n = 0
        quiet = 0
        prev_tail = None
        while n < budget:
            resp, ev = self.send_check("o")
            n += 1
            t = tail_of(resp["frame"])
            if ev["game_over"]:
                break
            changed = ev["moved"] or (t != prev_tail)
            prev_tail = t
            if changed:
                quiet = 0
            else:
                quiet += 1
                if quiet >= quiet_stop:
                    break
        return {"turns": n, "note": "floor explored" if quiet >= quiet_stop else "budget"}

    def run_fight(self, budget=20, quiet_stop=3):
        """Press tab until combat is over or budget runs out."""
        n = 0
        quiet = 0
        prev_tail = None
        while n < budget:
            resp, ev = self.send_check("tab", "auto-fight")
            n += 1
            t = tail_of(resp["frame"])
            if ev["game_over"]:
                break
            changed = ev["moved"] or (t != prev_tail)
            prev_tail = t
            if changed:
                quiet = 0
            else:
                quiet += 1
                if quiet >= quiet_stop:
                    break
        return {"turns": n, "note": "combat over" if quiet >= quiet_stop else "budget"}

    def _step_toward(self, dr, dc):
        """Pick a key for a (row,col) delta, clamped to one step."""
        if dr == 0 and dc == 0:
            return None
        sr = 1 if dr > 0 else (-1 if dr < 0 else 0)
        sc = 1 if dc > 0 else (-1 if dc < 0 else 0)
        # vi keys: j/k/h/l plus diagonals y,u,b,n
        table = {
            (-1, 0): "k", (1, 0): "j", (0, -1): "h", (0, 1): "l",
            (-1, -1): "y", (-1, 1): "u", (1, -1): "b", (1, 1): "n",
        }
        return table.get((sr, sc))

    def _best_step(self, dr, dc):
        """Candidate step keys, most useful first: axis, axis, diagonal.

        Returns a de-duplicated list so the walker can TRY EACH and use the
        first key that actually lands (greedy, no wall-pocket blind spots).
        """
        cands = []
        if dr:
            cands.append(self._step_toward(dr, 0))
        if dc:
            cands.append(self._step_toward(0, dc))
        if dr and dc:
            cands.append(self._step_toward(dr, dc))
        out = []
        for c in cands:
            if c and c not in out:
                out.append(c)
        return out

    def run_descend(self, max_steps=80):
        """Path stepwise to the > down-stairs glyph, then press it.

        Stops early (no 80-step spin) when the way is blocked and the floor
        is already explored -- that case needs the agent's manual routing.
        """
        n = 0
        fail = 0
        while n < max_steps:
            f = self.h.frame()
            if game_over(f["frame"]):
                self.events.append({"ts": time.time(), "key": "stop", "note": "game over"})
                self._emit(self.events[-1])
                break
            pos = find_glyph(f["frame"], "@")
            st = find_glyph(f["frame"], ">")
            if st is None:
                # Stairs not visible as a glyph -- my own @ sprite may be
                # covering them. The game SAYS so in the message window.
                t = text_of(f["frame"]).lower()
                if "leading down" in t:
                    resp, ev = self.send_check(">", "descend on covered stairs")
                    n += 1
                    break
                # Otherwise: explore a step to reveal them.
                resp, ev = self.send_check("o", "reveal stairs")
                n += 1
                if not ev["moved"]:
                    fail += 1
                    if fail >= 6:
                        break
                else:
                    fail = 0
                continue
            if pos is None:
                break
            dr, dc = st[0] - pos[0], st[1] - pos[1]
            if dr == 0 and dc == 0:
                resp, ev = self.send_check(">", "descend")
                n += 1
                break
            moved_any = False
            ev = None
            for key in self._best_step(dr, dc):
                resp, ev = self.send_check(key, "toward stairs")
                n += 1
                if n >= max_steps or ev["game_over"]:
                    break
                if ev["moved"]:
                    moved_any = True
                    break
            if moved_any:
                fail = 0
                continue
            if n >= max_steps or (ev is not None and ev["game_over"]):
                break
            # Nothing landed: one unstick explore; stop when that is futile.
            resp2, ev2 = self.send_check("o", "unstuck explore")
            n += 1
            fail += 1
            if fail >= 4 and not ev2["moved"]:
                break
        return {"turns": n, "note": "descend attempt ended"}

    def run_phase(self, plan, budgets=None):
        rows = []
        for step in plan:
            task = step.get("task")
            if task == "key":
                r = self.run_key(split_keys(step.get("keys", "5")),
                                 budget=step.get("budget"))
            elif task == "move":
                r = self.run_move(split_keys(step.get("keys", "")),
                                  budget=step.get("budget"),
                                  max_block=step.get("max_block", 3))
            elif task == "explore":
                r = self.run_explore(budget=step.get("budget", 60),
                                     quiet_stop=step.get("quiet_stop", 2))
            elif task == "fight":
                r = self.run_fight(budget=step.get("budget", 20),
                                   quiet_stop=step.get("quiet_stop", 3))
            elif task == "descend":
                r = self.run_descend(max_steps=step.get("max_steps", 80))
            else:
                r = {"turns": 0, "note": f"unknown task {task!r}"}
            rows.append({"task": task, **r})
            # phase-level stop: if any step saw the game over screen
            if self.events and self.events[-1].get("game_over"):
                rows.append({"task": "stop", "note": "game over"})
                break
        return {"steps": rows}


def summary(client, task, detail, resp=None, frame=None):
    """One compact report object per invocation."""
    f = frame
    if f is None and resp is not None:
        f = resp["frame"]
    st = stats_of(f) if f else {}
    return {
        "task": task,
        "detail": detail,
        "turns_used": len(client.events),
        "alive": (resp or {}).get("alive"),
        "game_over": bool(f and game_over(f)),
        "hp": st.get("hp"),
        "place": st.get("place"),
        "xl": st.get("xl"),
        "time": st.get("time"),
        "tail": tail_of(f, 6) if f else [],
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=DEFAULT_PORT)
    ap.add_argument("--check", action="store_true",
                    help="probe the harness and print current game state (no keys)")
    ap.add_argument("--task", choices=["key", "move", "explore", "fight", "descend", "phase"])
    ap.add_argument("--keys", type=str, default="", help="comma-separated keys for key/move")
    ap.add_argument("--budget", type=int, default=None)
    ap.add_argument("--max-steps", type=int, default=80)
    ap.add_argument("--file", type=str, default=None, help="phase JSON plan file")
    ap.add_argument("--no-burstlog", action="store_true")
    args = ap.parse_args()

    try:
        recon = getattr(sys.stdout, "reconfigure", None)
        if callable(recon):
            recon(encoding="utf-8", errors="replace")
    except Exception:
        pass

    client = Burst(args.port, log=not args.no_burstlog)

    if args.check or not args.task:
        try:
            f = client.h.frame()
        except Exception as e:
            print(json.dumps({"error": "harness not reachable",
                              "hint": "start play.py server first", "detail": str(e)}))
            sys.exit(1)
        st = stats_of(f["frame"])
        print(json.dumps({
            "check": True,
            "alive": f.get("alive"),
            "n": f.get("n"),
            "game_over": game_over(f["frame"]),
            "hp": st.get("hp"),
            "place": st.get("place"),
            "xl": st.get("xl"),
            "time": st.get("time"),
            "tail": tail_of(f["frame"], 6),
        }, ensure_ascii=False))
        return

    if args.task == "phase":
        path = args.file or ""
        if not path:
            print(json.dumps({"error": "phase requires --file"}))
            sys.exit(1)
        if not os.path.isabs(path):
            path = os.path.join(ROOT, path)
        with open(path, "r", encoding="utf-8") as fh:
            plan = json.load(fh).get("plan", [])
        d = client.run_phase(plan)
        try:
            f = client.h.frame()
        except Exception:
            f = {"frame": []}
        print(json.dumps(summary(client, "phase", d, frame=f["frame"]), ensure_ascii=False))
        return

    if args.task in ("key", "move"):
        keys = split_keys(args.keys or "5")
        if args.task == "key":
            d = client.run_key(keys, budget=args.budget)
        else:
            d = client.run_move(keys, budget=args.budget)
        try:
            f = client.h.frame()
        except Exception:
            f = {"frame": []}
        print(json.dumps(summary(client, args.task, d, frame=f["frame"]), ensure_ascii=False))
        return

    if args.task == "explore":
        d = client.run_explore(budget=args.budget or 60)
        try:
            f = client.h.frame()
        except Exception:
            f = {"frame": []}
        print(json.dumps(summary(client, "explore", d, frame=f["frame"]), ensure_ascii=False))
        return

    if args.task == "fight":
        d = client.run_fight(budget=args.budget or 20)
        try:
            f = client.h.frame()
        except Exception:
            f = {"frame": []}
        print(json.dumps(summary(client, "fight", d, frame=f["frame"]), ensure_ascii=False))
        return

    if args.task == "descend":
        d = client.run_descend(max_steps=args.max_steps)
        try:
            f = client.h.frame()
        except Exception:
            f = {"frame": []}
        print(json.dumps(summary(client, "descend", d, frame=f["frame"]), ensure_ascii=False))
        return


if __name__ == "__main__":
    main()