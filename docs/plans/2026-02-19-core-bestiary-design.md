# Core Rulebook Bestiary Design

## Summary

Pre-populate the bestiary with all enemies from the 4AD Core Rules Expanded PDF (~96 entries across 4 environments). Support dynamic HCL/Tier expression resolution so formulas like "HCL+2" auto-resolve to concrete numbers based on the current party's highest character level.

## Data Model Changes

### EncounterCategory

Add `'vermin'` as a 4th category:

```typescript
export type EncounterCategory = 'minion' | 'boss' | 'weird' | 'vermin'
```

Vermin kills increment the existing `mv` counter (same as minions).

### BestiaryEntry

Add fields:

- `environment`: `'dungeon' | 'caverns' | 'fungal_grottoes' | 'fiendish_foes'` — for filtering
- `count`: `string` — dice formula for number encountered (e.g. `"3d6"`, `"d6+3"`)

Existing `lvl` and `life` fields store formulas as strings (`"HCL+2"`, `"Tier+3"`).

## New Files

### `src/data/defaultBestiary.ts`

All ~96 enemies from the core rulebook organized by environment. Each entry stores raw formulas. Enemies include special abilities, reactions, treasure modifiers, and notes.

### `src/utils/hclTier.ts`

Utility functions:

- `getHCL(characters)` — returns highest character level from party
- `getTier(hcl)` — returns tier number (1-5) based on level ranges
- `resolveExpression(expr, hcl, tier)` — resolves expressions like `"HCL+2"` to numbers, supports max cap notation
- `rollDice(formula)` — resolves dice formulas like `"3d6"`, `"d6+3"` to numbers

## UI Changes

### BestiaryManagerModal

Split into two sections:

1. **Core Rulebook** — locked, read-only reference data, filterable by environment and category
2. **Custom Entries** — user-added entries with existing add/delete functionality

### EncounterCreationModal

Bestiary dropdown groups entries by environment. Auto-resolves HCL/Tier formulas and rolls count dice on selection.

## Enemy Data Scope

- **Dungeon**: 6 vermin, 6 minions, 6 weird, 6 bosses
- **Caverns**: 6 vermin, 6 minions, 6 bosses, 6 weird
- **Fungal Grottoes**: 6 vermin, 6 minions, 6 bosses, 6 weird
- **Fiendish Foes**: 6 vermin, 6 minions, 6 bosses, 6 weird

~96 total entries.
