\### ESSENCE System Architecture \& Operational Blueprint



This document defines the absolute, ground-truth configuration and operational boundaries for the development environment. Every agent initialization loop must read this file to ensure zero tool-drift, zero syntax errors, and perfect synchronization with the physical hardware layer. 



\### 🏛️ PART 1: CORE OPERATIONAL DOCTRINE



\* \*\*The Prime Directive:\*\* "Simple + Creative + Tested = Good."

\* \*\*The Structural Law:\*\* "Skeleton before flesh." Mechanically and structurally validate systems (using headless mock engines and mathematical simulations) before committing to visual states, narrative texturing, or manual number tuning.

\* \*\*The Agent Guardrail:\*\* Direct pushback is valued over hollow validation. AI collaborators must hold structural positions under pressure and flag architectural contradictions immediately.



\### 💻 PART 2: HARDWARE CONSTRAINTS \& LOCAL ENGINE SPEC



\* \*\*Primary GPU Pipeline:\*\* 8 GB VRAM.

\* \*\*The Bottleneck Threshold:\*\* Parameter weights greater than 7B (or unoptimized Mixture of Experts slices like qwen3-coder:30b) exceed the VRAM buffer. This forces Ollama to spill layers into system RAM, causing extreme Time-to-First-Token (TTFT) delays, complete system locks, and API timeouts.

\* \*\*The Verified Local Solution:\*\* A custom-compiled \*\*fast-coder\*\* asset built natively over the qwen2.5-coder:3b base layer. This maximizes local tokens-per-second, ensures a rock-solid \*\*100% GPU / 0% CPU processor split\*\*, and provides safe context room.



\### Canonical Modelfile Construction



dockerfile



\# File location: Root directory or custom asset path

FROM qwen2.5-coder:3b



\# Set explicit context window size to bypass default 2k choking

PARAMETER num\_ctx 8192



Use code with caution.



\* \*\*Local Build Sequence:\*\* 



powershell



ollama create fast-coder -f ./Modelfile



Use code with caution.



\### 🛠️ PART 3: THE DUAL-ENGINE INTEGRATION LAYER



The environment splits processing traffic across a zero-cost hybrid model: Local hardware handles sub-second autocomplete loops; verified cloud endpoints handle high-level reasoning and codebase indexing. 



\### 1. IDE Configuration Matrix (VS Code + Continue)



Modern installations of the Continue extension rely strictly on \*\*YAML schema mapping v1\*\*. Using outdated JSON structures or generic API tags triggers parser validation crashes. 



\### Verified Global config.yaml



yaml



name: Studio Config

version: 1.0.0

schema: v1



models:

&#x20; - name: Gemini 3.6 Flash (Free High-Context)

&#x20;   provider: gemini

&#x20;   model: gemini-3.6-flash        # Ground-truth endpoint for modern free-tier keys

&#x20;   apiKey: "YOUR\_GOOGLE\_AI\_STUDIO\_KEY"



&#x20; - name: Local Fast Coder

&#x20;   provider: ollama

&#x20;   model: fast-coder



tabAutocompleteModel:

&#x20; name: Local Autocomplete

&#x20; provider: ollama

&#x20; model: fast-coder



contextProviders:

&#x20; - name: codebase

&#x20; - name: diff

&#x20; - name: open

&#x20; - name: terminal



systemMessage: |

&#x20; You are ESSENCE, the development machine collaborator. 

&#x20; Adhere to the Master Index principles: Simple + Creative + Tested = Good.



Use code with caution.



\### 2. Autonomous Terminal Layer (Aider Workspace)



\* \*\*The Environment Conflict:\*\* Standard python pipelines throw build crashes (BackendUnavailable: Cannot import 'setuptools.build\_meta') under experimental or unstable local runtimes (e.g., Python 3.14 alpha).

\* \*\*The Verified Resolution:\*\* Isolate the execution engine into a stable, sandboxed \*\*Python 3.12 virtual slice\*\* via the uv tool-chain manager.



\### Quick-Launch Core Sequences



Save these precise commands for system boot sequences. 



\* \*\*To initialize the background GPU matrix:\*\* 



powershell



ollama run fast-coder



Use code with caution.

\* \*\*To launch the file-editing command-line agent loop:\*\* 



powershell



uvx --from aider-chat --python 3.12 aider --model ollama/fast-coder



Use code with caution.



\### 🚀 PART 4: SYSTEM CONTEXT COMMAND MATRIX



When prompting inside the IDE panel, agents must listen to structural modifier flags to prevent unnecessary token consumption and preserve context tracking: 



1\. \*\*@Codebase\*\* — Instructs the extension to index the local workspace structure recursively, giving Gemini perfect insight into your scripts at zero cost.

2\. \*\*@Git Diff\*\* — Drops all uncommitted, active line-edits directly into the chat prompt for isolated syntax checks and code reviews.

3\. \*\*/chat-mode ask (Inside Aider)\*\* — Runs questions or architectural code design prompts directly against your local GPU engine without generating unwanted, uncommitted asset modifications on your hard drive.

