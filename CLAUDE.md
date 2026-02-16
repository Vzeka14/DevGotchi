# CLAUDE.md — DevGotchi

Guidelines for AI assistants working on this codebase.

## Project Overview

**DevGotchi** is a developer-themed virtual pet (Tamagotchi) game. Players raise a
developer pet from an **egg** through career stages — junior, mid, senior, lead —
by performing actions (feed, sleep, code, play, learn). Stats decay over time; the
player must keep the pet alive and progressing.

## Tech Stack

| Layer         | Technology              |
|---------------|-------------------------|
| UI framework  | React 18 (functional components, hooks) |
| Language      | TypeScript 5.6 (strict mode) |
| Build tool    | Vite 6                  |
| Testing       | Vitest + React Testing Library + jsdom |
| Linting       | ESLint 9 (`@typescript-eslint`) |
| Formatting    | Prettier 3              |
| Persistence   | `localStorage` (JSON serialisation) |

## Repository Structure

```
DevGotchi/
├── index.html               # Vite entry HTML
├── package.json             # Scripts, deps, metadata
├── tsconfig.json            # TypeScript config (strict, path aliases)
├── vite.config.ts           # Vite + test config
├── vite-env.d.ts            # Vite client type reference
├── README.md                # User-facing documentation
├── CLAUDE.md                # This file — AI assistant guidelines
│
└── src/
    ├── main.tsx             # React DOM entry point
    ├── App.tsx              # Root component (routing between Hatch/Pet screens)
    │
    ├── components/          # Presentational React components
    │   ├── index.ts         # Barrel re-exports
    │   ├── ActionButtons.tsx # Grid of pet action buttons
    │   ├── HatchScreen.tsx  # Initial name-your-pet form
    │   ├── PetDisplay.tsx   # Main pet view (avatar, stats, actions)
    │   └── StatsBar.tsx     # Single stat progress bar
    │
    ├── hooks/               # Custom React hooks
    │   ├── index.ts
    │   └── usePet.ts        # Core game loop hook (state, decay timer, actions)
    │
    ├── types/               # TypeScript type definitions
    │   ├── index.ts
    │   └── pet.ts           # Pet, PetStats, PetStage, PetAction
    │
    ├── utils/               # Pure logic / helpers (no React)
    │   ├── index.ts
    │   ├── petEngine.ts     # Stat decay, XP/stage calc, action effects
    │   └── storage.ts       # localStorage save/load/clear
    │
    ├── styles/              # CSS files
    │   └── App.css          # Global and component styles
    │
    ├── assets/              # Static assets (images, fonts — currently empty)
    │
    └── __tests__/           # Test files
        ├── setup.ts         # Vitest setup (jest-dom matchers)
        └── petEngine.test.ts# Unit tests for game engine logic
```

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Type-check then production build → dist/
npm run preview      # Preview production build locally
npm run test         # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage# Run tests with coverage report
npm run lint         # Lint .ts/.tsx files
npm run lint:fix     # Lint and auto-fix
npm run format       # Format with Prettier
npm run format:check # Check formatting without writing
npm run typecheck    # Type-check without emitting
```

## Architecture & Conventions

### Path Aliases

Use `@/` to reference `src/` in imports:
```ts
import { Pet } from "@/types";
import { applyAction } from "@/utils/petEngine";
```

Configured in both `tsconfig.json` (`paths`) and `vite.config.ts` (`resolve.alias`).

### Component Pattern

- **Functional components only** — no class components.
- Components live in `src/components/` and are re-exported via `index.ts`.
- Props are defined as inline interfaces in the same file.
- BEM-like CSS class names: `block__element` (e.g., `stats-bar__fill`).

### Hooks

- Custom hooks live in `src/hooks/`.
- `usePet` is the central hook that owns game state, handles persistence,
  and runs the stat-decay timer.

### Game Engine (`src/utils/petEngine.ts`)

Pure functions — no side effects, no React imports. Core logic:

| Function      | Purpose                                         |
|---------------|-------------------------------------------------|
| `decayStats`  | Reduce hunger/energy/happiness over elapsed time |
| `stageForXp`  | Map cumulative XP → lifecycle stage             |
| `applyAction` | Apply an action's stat deltas and award XP      |
| `clampStat`   | Clamp a number to 0–100 range                   |

**Stage thresholds:** egg (0), junior (50), mid (200), senior (500), lead (1000).

**Stat range:** All stats are integers in 0–100.

### Persistence (`src/utils/storage.ts`)

Pet state is serialised to `localStorage` under key `devgotchi_save`.
On load, elapsed time since `lastInteraction` is applied as stat decay.

### Types (`src/types/pet.ts`)

| Type        | Description                                |
|-------------|--------------------------------------------|
| `PetStats`  | `{ hunger, energy, happiness, skill }` (0–100) |
| `PetStage`  | `"egg" \| "junior" \| "mid" \| "senior" \| "lead"` |
| `PetAction` | `"feed" \| "sleep" \| "code" \| "play" \| "learn"` |
| `Pet`       | Full pet state including id, name, stage, stats, xp, timestamps |

## Testing

- Tests live in `src/__tests__/`.
- Testing framework: **Vitest** with `jsdom` environment and `globals: true`.
- `@testing-library/jest-dom` matchers are available via the setup file.
- Name test files `*.test.ts` (pure logic) or `*.test.tsx` (component tests).
- Run `npm run test` before committing — all tests must pass.

### Writing Tests

```ts
import { describe, it, expect } from "vitest";
// vitest globals are enabled, but explicit imports are preferred for clarity
```

## Code Style Rules

1. **TypeScript strict mode** is enabled — do not use `any` or `@ts-ignore`.
2. **No unused variables or parameters** (`noUnusedLocals`, `noUnusedParameters`).
3. **Prefer `interface` for object shapes**, `type` for unions/aliases.
4. **Use `const` by default**; `let` only when reassignment is needed.
5. **Named exports** (no default exports, except `App.tsx`).
6. **Barrel exports** — each directory has an `index.ts` that re-exports public API.
7. **No inline styles** except for dynamic values (like stat bar width/color).
8. **Prettier handles formatting** — do not argue about semicolons, quotes, etc.

## Commit Conventions

- Use short imperative messages: `add feed action`, `fix stat decay overflow`.
- Prefix with category when helpful: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`.
- Keep commits focused — one logical change per commit.

## Common Pitfalls

- **Stat overflow:** Always clamp stats to 0–100 when modifying. Use `clampStat()`.
- **Timer cleanup:** `usePet` sets a `setInterval` — ensure cleanup in `useEffect` return.
- **Storage format changes:** If `Pet` shape changes, handle migration in `loadPet()` or
  old saves will break (`JSON.parse` will succeed but fields may be missing).
- **Path alias in tests:** Vitest resolves `@/` via the Vite config — keep both in sync.

## Adding New Features

### New Action
1. Add the action name to `PetAction` in `src/types/pet.ts`.
2. Add stat effects in `ACTION_EFFECTS` in `src/utils/petEngine.ts`.
3. Add button entry in `ACTIONS` array in `src/components/ActionButtons.tsx`.
4. Add tests in `src/__tests__/petEngine.test.ts`.

### New Stat
1. Add the field to `PetStats` in `src/types/pet.ts`.
2. Update `decayStats` if it should decay.
3. Add a `<StatsBar>` in `PetDisplay.tsx`.
4. Update affected actions in `ACTION_EFFECTS`.

### New Stage
1. Add to `PetStage` union in `src/types/pet.ts`.
2. Add XP threshold in `STAGE_THRESHOLDS` in `petEngine.ts`.
3. Add emoji/art in `STAGE_ART` in `PetDisplay.tsx`.
