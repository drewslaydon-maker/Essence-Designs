# ESSENCE — Infrastructure History (Predecessor Context)

This doc is historical/context, not a spec for the new workspace — it explains what came before this system so nothing gets accidentally re-broken or re-litigated.

## Original concept
Six-agent AI pipeline: Dagoth Ur, Vivek, Sotha Sil, Mr. House, Viktor, Mr. New Vegas — modeled on Morrowind's Tribunal and Fallout: New Vegas's power brokers, in a Disco Elysium register. Agents were explicitly designed to argue with each other and with Drew, not to converge on validation. **This adversarial/argumentative design intent should carry forward into the new multi-agent workspace** — it wasn't specific to the old infra, it's the point of having multiple agents at all.

## Original infrastructure (retired)
- Self-hosted via **LibreChat on Render**
- API layer: **OpenRouter**, prepaid credits for billing predictability
- Known issues encountered and fixed:
  - Root cause of a broken deploy: a `.dockerignore` wildcard was blocking `librechat.yaml` from being included in the build.
  - Secondary issue: OpenRouter API key was hardcoded instead of referenced via environment variable.
- Outstanding/unresolved at time of retirement: no permanent values had been set for `CREDS_KEY`, `CREDS_IV`, `JWT_SECRET`, `JWT_REFRESH_SECRET` — these were regenerating on every deploy, invalidating refresh tokens each time. If the new workspace uses similar secrets-based auth, set these once and persist them.
- A "validate before spending" test (mock tribunal run) was planned before infra spend but status at retirement is unclear — the OR pipeline was retired in favor of this new ALLM/Ollama/Qwen-coder host instead.

## Status
**Retired as of 2026-08-22.** Superseded by the new local ALLM + Ollama + Qwen-coder workspace, VSCode-integrated, no token caps, full local control/privacy. This new host is the baseline going forward — expected to be the primary workspace for at least a year if it continues to perform well.
