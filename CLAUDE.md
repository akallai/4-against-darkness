# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Proper Party Portfolio** (v2.0.0) — a React rewrite of a single-page PWA for managing tabletop RPG (Four Against Darkness) parties. Ported from a monolithic vanilla HTML file into a typed, component-based React application.

## Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite production build
npm run test         # Run all tests once (vitest run)
npm run test:watch   # Run tests in watch mode (vitest)
npx vitest run src/stores/usePartyStore.test.ts   # Run a single test file
```

No linter is configured. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`) is enforced at build time via `tsc -b`.

## Architecture

### Tech Stack

React 19, TypeScript 5.7, Vite 6, Zustand 5 (state), Vitest + Testing Library (tests), vite-plugin-pwa (service worker). No React Router — screen switching is state-driven.

### Path Alias

`@/*` maps to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`). All imports use this alias.

### Screen-Based Navigation

`App.tsx` reads `useUIStore.screen` and conditionally renders one of 6 screens: `setup`, `tracker`, `journal`, `encounters`, `followers`, `map`. No URL routing — navigation is entirely via Zustand state.

### Component Organization

```
src/components/
  common/     — Reusable UI: Modal, EditableList, StatBox, AutoTextarea, SpellTraitList, ConfirmModal
  layout/     — AppShell (root wrapper), FooterBar, SetupFooter
  setup/      — Party creation: SetupScreen, ModeSelector, SaveSlotManager, CharacterInputGroup, TroupeUI
  tracker/    — Main dashboard: TrackerScreen, CharacterCard (4 fixed slots)
  journal/    — Adventure log: JournalScreen, JournalEntry, NPCLocationPanel, NPCCard
  encounters/ — Combat: EncountersScreen, EncounterCard, PartyCombatSummary, CombatToolsBar
  followers/  — Companions: FollowersScreen, RetainerCard, ProfessionalCard, AnimalGrid, MountRow
  map/        — Dungeon map builder: MapScreen, MapGrid, MapToolbar, TileCatalog, TilePreview, MapTileControls
  modals/     — ModalManager (centralized router) + feature modals (DiceRoller, QuestTracker, Bestiary, Oracle, etc.)
```

Each component has a co-located `.css` file (plain CSS, not CSS Modules). Global theme variables are in `src/styles/theme.css`.

### State Management (Zustand)

8 independent stores in `src/stores/`:

| Store | Persisted? | localStorage key |
|-------|-----------|-----------------|
| `useUIStore` | Partial (theme, skip-confirms) | `4AD_UI` |
| `usePartyStore` | Via explicit save | — |
| `useJournalStore` | Via explicit save | — |
| `useEncounterStore` | Bestiary auto-persisted | `4AD_Enemy_Bestiary` |
| `useFollowerStore` | Via explicit save | — |
| `useQuestStore` | Via explicit save | — |
| `useTavernStore` | Auto-persisted | `4AD_Tavern_Roster` |
| `useMapStore` | Via explicit save | — |

Stores are updated with manual spread operators (no Immer). Most store state is **not** auto-persisted — it is explicitly saved/loaded as a "party bundle" via the `useGameSession` hook.

### Data Persistence

`src/utils/persistence.ts` handles all localStorage I/O. A party is saved as 7 separate localStorage keys:

```
4AD_Party_{Name}              — characters array
4AD_Party_{Name}_JournalData  — journal entries + NPC locations
4AD_Party_{Name}_Followers    — retainers, professionals, animals, mounts
4AD_Party_{Name}_Encounters   — encounter list
4AD_Party_{Name}_PartyStats   — mv and bw counters
4AD_Party_{Name}_Quests       — quest list
4AD_Party_{Name}_MapData      — dungeon map cells, doors, placed tiles, labels
```

Additional global keys: `4AD_CreationMode`, `4AD_LastLoadedParty`, `4AD_Enemy_Bestiary`, `4AD_Tavern_Roster`, `4AD_UI`.

### Save/Load Flow

The `useGameSession` hook (`src/hooks/useGameSession.ts`) orchestrates all save/load operations:
- `save()` — scrapes all store state into a `PartyBundle` and writes to localStorage
- `loadGame(key)` — reads from localStorage and hydrates all stores
- `embark()` — creates a new party, resets world data, saves immediately
- `saveAndQuit()` — saves then navigates back to setup screen

Stores are accessed via `getState()` (outside React render cycle) in the hook for synchronous reads during save/load.

### Map System

The map screen provides a dungeon map builder on a 20x28 grid (`MAP_COLS`/`MAP_ROWS` constants in `src/types/map.ts`). Key concepts:

- **TileTemplate** — predefined tile shapes (grid string + door definitions) stored in `src/data/tileTemplates.ts`
- **PlacedTile** — an instance of a template placed on the map with origin, rotation (0/90/180/270), and mirror state
- **AbsoluteDoor** — a door/passage on a cell edge (top/right/bottom/left side)
- **Door canonicalization** — doors are normalized so that `{col:0, row:0, side:'right'}` and `{col:1, row:0, side:'left'}` are treated as the same door. `canonicalizeDoor()` in `src/utils/mapGeometry.ts` handles this. This is critical to prevent duplicate doors.
- **Undo stack** — `useMapStore` maintains up to 20 snapshots for undo/redo
- **Map tools** — `place`, `draw`, `erase`, `door`, `passage`, `label`, `select`

`src/utils/mapGeometry.ts` provides grid parsing, rotation/mirror transforms, tile stamping with bounds checking, and coordinate/door set operations.

### Game Modes

- **Standard** — one party per session
- **Troupe** — multiple parties share a tavern roster (`useTavernStore`), characters can be assigned to party slots via drag-and-drop

### Theming

Two themes: `dark` (default) and `classic` (parchment). CSS custom properties in `theme.css` are toggled via `document.body.classList`. `useTheme` hook applies the active theme from `useUIStore`.

### Hooks

- `useGameSession` — save/load/embark orchestration (see Save/Load Flow above)
- `useTheme` — applies active theme from `useUIStore`
- `useDragAndDrop` — character card drag-and-drop for reordering slots

### Type System

Core types in `src/types/` with barrel export from `index.ts`. Factory functions (`createEmptyCharacter`, `createEmptyJournalData`, `createEmptyFollowersData`, `createEmptyMapData`) provide defaults. Characters use a fixed 4-slot tuple: `[Character, Character, Character, Character]`. Animals and mounts also use fixed 4-slot arrays.

### Testing

Tests live alongside source files (`*.test.ts`). Current coverage: stores (`usePartyStore`, `useJournalStore`, `useEncounterStore`, `useQuestStore`) and utils (`dice`, `persistence`, `oracle`, `mapGeometry`). Test environment is jsdom with `@testing-library/jest-dom` matchers. Setup file: `src/test/setup.ts`.

## Assets

Static images in `public/`: `dungeon_dark.jpg`, `tavern_background.jpg`, `parchment_texture.jpg` (backgrounds/textures), `arrow_*.png`, `btn_*.png` (UI icons). PWA manifest at `public/manifest.json`.
