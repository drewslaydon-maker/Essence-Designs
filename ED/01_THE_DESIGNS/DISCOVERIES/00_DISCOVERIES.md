# DISCOVERIES

*The hard-won lessons and locked operating principles of ESSENCE DESIGNS.*

---

## 1. Reality Has the Final Vote
No amount of theory, documentation, or prompting overrides what the code actually does when executed. If the build crashes, the design is flawed. If the mechanic isn't fun in practice, the spreadsheet math doesn't matter.

## 2. Consoles Answer Questions, They Do Not Own Truth
A console (like Trello, a UI dashboard, or a debug log) facilitates decisions. It is not the source of truth. Every live datum has exactly one owner (usually the code repository itself). If a console is out of sync, the console is wrong, not the codebase.

## 3. Systems Should Be Organized Around Verbs, Not Nouns
Do not build architectures around *things* (e.g., SwordManager, EnemyManager). Build them around *actions* (e.g., ResolveCombat, ProcessTick). This prevents bloated class inheritance and keeps mechanics modular.

## 4. Templates Preserve Thinking, Not Formatting
We use templates not to make things look pretty, but to ensure we don't forget to answer critical questions during the design phase.

## 5. Skeleton Before Flesh
Validate mechanical and structural integrity before layering narrative, numbers, or visual polish. If the core loop (the skeleton) breaks under pressure, no amount of VFX (the flesh) will save it.

## 6. Name Root Causes Before Coding
Diagnose structural causes rather than patching symptoms. A bug in state wiring should result in a refactor of the state flow, not a band-aid useEffect patch.

## 7. Context Reset Purges Drift
Clearing continued chat history clears out accumulated bad data, hallucinations, and prompt drift. The local repository files are the single absolute truth for direction and state.

## 8. The Finger in the Machine (Buffer Stream Precaution)
Typing into an execution agent's chat window during active file edits or terminal runs causes token leaks directly into code files. Execution agents must operate uninterrupted.

## 9. Friction is Necessary for Engagement
Players claim they want to be overpowered, but an absence of resistance leads to immediate boredom. Systems must push back to make player choices meaningful.

## 10. Perfect is the Enemy of Shipped
A flawed game that is playable and testing with a real human (like Phil) is infinitely more valuable than a perfect game locked in a private repository. Do not endlessly polish before gathering real-world data.

## 11. The Leaf Lifecycle is a Flow, Not a Script
"Verify the receipt script" was the ask — there was no script. The
lifecycle — plant a `*_TASK.md`, execute, Drew confirms, MOVE the receipt
into `06_THE_LEDGER/<CODESIGN>/<date>/` — IS the system. It passed
end-to-end twice in one day (VAL-003, VAL-004). Vocabulary, not machinery:
here "script" means the flow, and Drew's "VCS" means Visual Studio Code —
not version control.

## 12. A Sealed Leaf Leaves No Residue
Sealing a leaf does not mean the staging folder is clean. VAL-001's scope
and VAL-002's proposal sat in `validation/` past their seals and needed a
dedicated leaf (VAL-004) to carry them to the chamber. Staging holds only
in-flight references; an empty staging folder is part of the sealed state.

## 13. Rename-with-Prefix is the Ordering Contract
0-Wake / 1-Stone / B-Bolt / X-XP exists because opencode's TUI sorts the
roster alphabetically. The prefix scheme makes alpha order equal the seat
flow, permanently. Future seats inherit the reserved Y/Z tail — the sort
IS the contract.

## 14. One Registration Per Agent
`.opencode/agents/*.md` is the single source of the agent registry; the
`opencode.json` agents map stays empty. A `default_agent` still resolves
from the file registry — proven when the reboot kept this 0-Wake session
alive through the rename.

## 15. Inline Verify + Reboot-Pending is the Registry-Change Pattern
When a package renames live configuration, bake the diagnostics in before
the restart; the reboot is the final proof. Never chain ahead of it.

## 16. Ambiguity Defaults to the Confirmation-Gated Reading
VAL-003's package text conflicted (Unit 2 said file in Unit 4; Unit 6 said
on Drew's go). The executor chose the gated path and stood by. Package
writers must not leave conflicting instructions; executors default to the
safer reading.

## 17. Trust Entries Only Apply to Packages That Have Postinstall Scripts
WHEEL-NATIVE-001 stopped at Unit 1: after `bun add -d electron`, the binary
was absent — and the stop report's root cause ("bun skips untrusted
postinstalls") scored a `trustedDependencies` ruling. The deeper truth,
proven during execution, was simpler: **electron@44 has NO postinstall
script at all.** The ~100 MB binary downloads *lazily* on first use
(`index.js` → `install.js` → `@electron/get`). There was nothing to trust —
the package just had never been invoked. The fix was running the package's
own official `install.js` once, no config knobs added. Plausible root
causes get disproven by execution; when a package's binary isn't present,
run the package's own download step before piling on dependency-trust
settings. (Enshrined 2026-09-19 from the WHEEL-NATIVE-001 stop + ruling +
completion flow.)