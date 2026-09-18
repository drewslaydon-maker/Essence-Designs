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