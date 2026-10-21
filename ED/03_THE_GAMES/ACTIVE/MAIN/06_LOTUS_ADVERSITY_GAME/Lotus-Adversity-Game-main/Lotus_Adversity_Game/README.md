# Wheel of Adversity — The Apparatus

A fully static, offline-capable dark-fantasy codex/artifact — **Pantheon · Spokes (RingWheel) · Heraldry · Codex · Pillars**. No backend, no network fonts.

## Prerequisites

- [`bun`](https://bun.sh) (or `npm` — npm also works)

## Commands

All commands run from this directory (`Lotus_Adversity_Game/`).

| Command | What it does |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Vite dev server → http://localhost:5173 |
| `bun run lint` | Type-check only (`tsc --noEmit`) |
| `bun run lab:verify` | Executable canon gates (`tsx verify-lab.ts`) |
| `bun run build` | Production build → `dist/` |
| `bun run preview` | Preview the built `dist/` |
| `bun run clean` | Remove `dist/` |
| `bun run native` | Launch the native Electron window (static app — run `bun run build` first) |

Canonical docs live at the repo root: `AGENTS.md`, `ROADMAP.md`, `VISUAL_DESIGN_MASTER.md`.
Native desktop (Electron) wrapper lives in `electron/` — loads the built `dist/` as a native window; no browser tab.