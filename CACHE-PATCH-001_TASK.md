# CACHE PATCH TASK (CACHE-PATCH-001)

**Target:** `C:\Users\Andrew\Projects\opencode.json`

**Objective:**
Modify the workspace root configuration (`opencode.json`) to permanently lower session execution costs by enabling prompt caching for Google Gemini models (3.1 Pro and Flash-Lite agents). 

**Directives for DOER:**
1. Read `C:\Users\Andrew\Projects\opencode.json` to verify its current structure.
2. Insert a new top-level `"provider"` key into the JSON file that configures Google to forward a persistent cache key, as requested by Drew:
   ```json
   "provider": {
     "google": {
       "options": {
         "setCacheKey": true
       }
     }
   }
   ```
   *Note: Enabling `setCacheKey: true` instructs OpenCode's provider integration to stamp the explicit `cache_control` breakpoints into the system instructions, tool definitions, and agent map payloads under the hood.*
3. Ensure valid JSON syntax (comma placement, braces).
4. Plant your completion report next to this file as `CACHE-PATCH-001_REPORT.md` and halt.

**Constraints:**
- Micro-Task Scope Lock: Only touch `opencode.json`.
- Do not run arbitrary commands beyond file reads/edits.