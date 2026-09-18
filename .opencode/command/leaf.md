---
title: leaf
description: Start a Leaf task package with scope lock and DoD gates.
agent: essence
---

# /leaf — start a Leaf task package

Before executing anything:

1. **Confirm the Leaf ID** and its exact target files/directories with Drew
   (Micro-Task Scope Lock). If scope is fuzzy, ASK — do not guess.
2. Confirm the leaf maps to a milestone in
`ED/01_THE_DESIGNS/MILESTONES.md`.
2. Plan the work as a todo list, then execute ONLY the named files.

After the work is done:

- Run diagnostics / healthchecks — 0 failures required.
- Verify canonical docs (`00_ESSENCE_BIBLE.md`, `01_THE_DESIGNS/MILESTONES.md`) still
  match ground truth; update only if Drew instructed or explicitly approved.
- Report results to Drew, then HALT (Single Output Stop).

Do not chain into the next task without fresh instruction.