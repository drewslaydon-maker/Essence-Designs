# VAL-001 — DO TASK PACKAGE

> Planted by PLAN 2026-09-19 (Drew-approved green edit), for DO to execute
> in the DO window. DO: read this file, execute it fully per its
> instructions, then halt. Turn no further pages.
> Gates: halt & report per hop; every write needs Drew's approval
> (`edit: ask`); anything dangerous → **BROWN BANANA BREAD** and stop.

## Scope — restate verbatim as your first report line

"Restated VAL-001 scope: build token `VAL-001.md` at
`LEGACY/VAULT/00_SHADOW_COUNCIL/validation/`, stamp HOP-01, run D1–D3,
report, halt."

## Your lane (DO / Builder)

Restate the scope, build the token per this package, stamp HOP-01, run the
named diagnostics, report exactly what was done and not done, halt.
Zero discretion, zero speculation. Touch no other files. Never chain next
steps.

## Step 1 — Build (one write, one file)

Create `C:\Users\Andrew\Projects\LEGACY\VAULT\00_SHADOW_COUNCIL\validation\VAL-001.md` with this exact content (HOP-01 stamp already filled):

```markdown
# VAL-001 — SYSTEM SHAKE-OUT TOKEN

> One token, five seats, hand-to-hand.
> Fail at any hop = halt, review, fix, re-run.
> Build: DO. Each seat stamps ONLY its own HOP block. Never chain.

## HOP-01 — DO (Builder)
Lane: restate scope, build token, run diagnostics, report, halt.
Stamp:
HOP-01 | 2026-09-19 | STAMPED | DO in lane: scope restated, token built at validation/VAL-001.md, D1-D3 PASS

## HOP-02 — EXPERIENCER
Lane: backfill EXPERIENCE_LOG entry #001 from HARNESS/logs/session_1789757055.jsonl,
report, wait; then stamp confirming own records are current.
Stamp:
HOP-02 |

## HOP-03 — COURRIER
Lane: move byte-identical, no editorializing, tag [FERRY <origin> -> <destination>] + date.
Stamp:
HOP-03 |

## DREW VERDICT — SEAL #002
- Every HOP present (stamped, dated, signed by owning seat)
- Every seat stayed in lane
- Verdict:
```

## Step 2 — Diagnostics (run in `C:\Users\Andrew\Projects`)

- **D1** opencode.json parses —
  `Get-Content -Raw -LiteralPath "C:\Users\Andrew\Projects\opencode.json" | ConvertFrom-Json | Out-Null; if ($?) { Write-Output "D1 PASS: opencode.json parses" }`
- **D2** token exists —
  `if (Test-Path -LiteralPath "C:\Users\Andrew\Projects\LEGACY\VAULT\00_SHADOW_COUNCIL\validation\VAL-001.md") { Write-Output "D2 PASS: token exists" } else { Write-Output "D2 FAIL: token missing" }`
- **D3** three HOP blocks present (expect ≥3 matches) —
  `rg -n "HOP-0[123]" "C:\Users\Andrew\Projects\LEGACY\VAULT\00_SHADOW_COUNCIL\validation\VAL-001.md"`

## Step 3 — Definition of Done

- `validation/VAL-001.md` exists, content exactly per Step 1.
- HOP-01 stamped.
- D1, D2, D3 all PASS.

## Step 4 — Report & halt

Report: the exact file path, that HOP-01 is stamped, the D1/D2/D3 results,
and anything not done. Then stop. Do not continue without a fresh package.