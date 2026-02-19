# Core Rulebook Bestiary Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Pre-populate the bestiary with all ~96 enemies from the 4AD Core Rules Expanded rulebook, with auto-resolution of HCL/Tier formulas based on the current party.

**Architecture:** Add a `vermin` encounter category, extend `BestiaryEntry` with `environment` and `count` fields, create a default bestiary data file with all core rulebook enemies, add HCL/Tier resolution utilities, and update the UI to show locked default entries with environment filtering.

**Tech Stack:** React 19, TypeScript 5.7, Zustand 5, Vitest

---

### Task 1: Add `vermin` to EncounterCategory and update category references

**Files:**
- Modify: `src/types/encounter.ts:1`
- Modify: `src/components/encounters/EncounterCard.tsx:25-26,35-36`
- Modify: `src/stores/useEncounterStore.ts:84`
- Modify: `src/components/modals/EncounterTypeModal.tsx:22-28`

**Step 1: Update EncounterCategory type**

In `src/types/encounter.ts:1`, change:
```typescript
export type EncounterCategory = 'minion' | 'boss' | 'weird' | 'vermin'
```

**Step 2: Update EncounterCard category label and stat logic**

In `src/components/encounters/EncounterCard.tsx:25`, update the stat increment to treat vermin same as minion:
```typescript
const stat = encounter.category === 'minion' || encounter.category === 'vermin' ? 'mv' : 'bw'
```

At line 30, same fix:
```typescript
const stat = encounter.category === 'minion' || encounter.category === 'vermin' ? 'mv' : 'bw'
```

At line 35-36, add vermin label:
```typescript
const categoryLabel =
    encounter.category === 'minion' ? 'Minion' : encounter.category === 'boss' ? 'Boss' : encounter.category === 'vermin' ? 'Vermin' : 'Weird'
```

**Step 3: Update useEncounterStore auto-complete stat**

In `src/stores/useEncounterStore.ts:84`:
```typescript
const stat = e.category === 'minion' || e.category === 'vermin' ? 'mv' : 'bw'
```

**Step 4: Add vermin button to EncounterTypeModal**

In `src/components/modals/EncounterTypeModal.tsx`, split the minion/vermin into two separate buttons:
```tsx
<button className="enc-type-option" onClick={() => selectType('vermin')}>
  <span className="enc-type-icon">&#128027;</span>
  <div className="enc-type-info">
    <div className="enc-type-name">Vermin</div>
    <div className="enc-type-desc">Rats, bats, insects and crawling things</div>
  </div>
</button>
<button className="enc-type-option" onClick={() => selectType('minion')}>
  <span className="enc-type-icon">&#9876;</span>
  <div className="enc-type-info">
    <div className="enc-type-name">Minion</div>
    <div className="enc-type-desc">Goblins, skeletons, orcs and other common foes</div>
  </div>
</button>
```

**Step 5: Update BestiaryManagerModal and EncounterCreationModal category dropdowns**

Add `<option value="vermin">Vermin</option>` to category selects in:
- `src/components/modals/BestiaryManagerModal.tsx:83`
- `src/components/modals/EncounterCreationModal.tsx` (if a category select exists)

**Step 6: Verify build compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 7: Commit**

```bash
git add src/types/encounter.ts src/components/encounters/EncounterCard.tsx src/stores/useEncounterStore.ts src/components/modals/EncounterTypeModal.tsx src/components/modals/BestiaryManagerModal.tsx
git commit -m "feat: add vermin as 4th encounter category"
```

---

### Task 2: Extend BestiaryEntry with environment and count fields

**Files:**
- Modify: `src/types/encounter.ts:22-32`

**Step 1: Add environment type and extend BestiaryEntry**

In `src/types/encounter.ts`, add after the EncounterCategory type:
```typescript
export type BestiaryEnvironment = 'dungeon' | 'caverns' | 'fungal_grottoes' | 'fiendish_foes' | 'custom'

export interface BestiaryEntry {
  type: string
  category: EncounterCategory
  lvl: string
  life: string
  morale: string
  treasure: string
  attacks: string
  abilities: string
  notes: string
  environment: BestiaryEnvironment
  count: string
  isDefault?: boolean
}
```

**Step 2: Update types barrel export**

In `src/types/index.ts:7`, add `BestiaryEnvironment`:
```typescript
export type { Encounter, BestiaryEntry, EncounterCategory, BestiaryEnvironment } from './encounter'
```

**Step 3: Update BestiaryManagerModal to supply new fields for custom entries**

In the `handleAdd` function of `src/components/modals/BestiaryManagerModal.tsx`, add `environment: 'custom'`, `count: '1'` to the entry construction.

**Step 4: Verify build compiles**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/types/encounter.ts src/types/index.ts src/components/modals/BestiaryManagerModal.tsx
git commit -m "feat: extend BestiaryEntry with environment and count fields"
```

---

### Task 3: Create HCL/Tier utility functions with tests

**Files:**
- Create: `src/utils/hclTier.ts`
- Create: `src/utils/hclTier.test.ts`

**Step 1: Write the tests**

```typescript
import { describe, it, expect } from 'vitest'
import { getHCL, getTier, resolveExpression, rollCountFormula } from './hclTier'

describe('getHCL', () => {
  it('returns highest level from 4 characters', () => {
    const chars = [{ lvl: 3 }, { lvl: 5 }, { lvl: 1 }, { lvl: 2 }] as any
    expect(getHCL(chars)).toBe(5)
  })

  it('returns 1 for all level-1 characters', () => {
    const chars = [{ lvl: 1 }, { lvl: 1 }, { lvl: 1 }, { lvl: 1 }] as any
    expect(getHCL(chars)).toBe(1)
  })
})

describe('getTier', () => {
  it('returns tier 1 for levels 1-4', () => {
    expect(getTier(1)).toBe(1)
    expect(getTier(4)).toBe(1)
  })
  it('returns tier 2 for levels 5-9', () => {
    expect(getTier(5)).toBe(2)
    expect(getTier(9)).toBe(2)
  })
  it('returns tier 3 for levels 10-14', () => {
    expect(getTier(10)).toBe(3)
    expect(getTier(14)).toBe(3)
  })
  it('returns tier 4 for levels 15-19', () => {
    expect(getTier(15)).toBe(4)
    expect(getTier(19)).toBe(4)
  })
  it('returns tier 5 for level 20+', () => {
    expect(getTier(20)).toBe(5)
    expect(getTier(25)).toBe(5)
  })
})

describe('resolveExpression', () => {
  const hcl = 5
  const tier = 2

  it('resolves plain numbers', () => {
    expect(resolveExpression('3', hcl, tier)).toBe(3)
  })
  it('resolves HCL', () => {
    expect(resolveExpression('HCL', hcl, tier)).toBe(5)
  })
  it('resolves HCL+N', () => {
    expect(resolveExpression('HCL+2', hcl, tier)).toBe(7)
  })
  it('resolves Tier', () => {
    expect(resolveExpression('Tier', hcl, tier)).toBe(2)
  })
  it('resolves Tier+N', () => {
    expect(resolveExpression('Tier+3', hcl, tier)).toBe(5)
  })
  it('returns original string if unresolvable', () => {
    expect(resolveExpression('special', hcl, tier)).toBe('special')
  })
  it('respects max cap', () => {
    expect(resolveExpression('HCL+2', 10, 3, 6)).toBe(6)
  })
  it('does not cap when below max', () => {
    expect(resolveExpression('HCL+2', 3, 1, 6)).toBe(5)
  })
})

describe('rollCountFormula', () => {
  it('returns fixed number for plain integers', () => {
    expect(rollCountFormula('1')).toBe(1)
    expect(rollCountFormula('4')).toBe(4)
  })
  it('rolls dice formula and returns a number in range', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('d6')
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
    }
  })
  it('handles NdM+K formula', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('2d6+3')
      expect(result).toBeGreaterThanOrEqual(5)  // 2+3
      expect(result).toBeLessThanOrEqual(15) // 12+3
    }
  })
  it('handles d6+N shorthand (1d6+N)', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('d6+3')
      expect(result).toBeGreaterThanOrEqual(4)
      expect(result).toBeLessThanOrEqual(9)
    }
  })
  it('handles NdM without modifier', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('3d6')
      expect(result).toBeGreaterThanOrEqual(3)
      expect(result).toBeLessThanOrEqual(18)
    }
  })
  it('handles d3 formula', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('d3')
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(3)
    }
  })
  it('handles 2d3+N formula', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollCountFormula('2d3+4')
      expect(result).toBeGreaterThanOrEqual(6)
      expect(result).toBeLessThanOrEqual(10)
    }
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/utils/hclTier.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement the utility**

```typescript
import type { Character } from '@/types'

export function getHCL(characters: Pick<Character, 'lvl'>[]): number {
  return Math.max(...characters.map((c) => c.lvl), 1)
}

export function getTier(hcl: number): number {
  if (hcl <= 4) return 1
  if (hcl <= 9) return 2
  if (hcl <= 14) return 3
  if (hcl <= 19) return 4
  return 5
}

export function resolveExpression(expr: string, hcl: number, tier: number, max?: number): number | string {
  const trimmed = expr.trim()

  // Plain number
  const plain = parseInt(trimmed, 10)
  if (!isNaN(plain) && String(plain) === trimmed) {
    return max !== undefined ? Math.min(plain, max) : plain
  }

  // HCL+N or HCL
  const hclMatch = trimmed.match(/^HCL(?:\+(\d+))?$/i)
  if (hclMatch) {
    const bonus = parseInt(hclMatch[1] ?? '0', 10)
    const result = hcl + bonus
    return max !== undefined ? Math.min(result, max) : result
  }

  // Tier+N or Tier
  const tierMatch = trimmed.match(/^Tier(?:\+(\d+))?$/i)
  if (tierMatch) {
    const bonus = parseInt(tierMatch[1] ?? '0', 10)
    const result = tier + bonus
    return max !== undefined ? Math.min(result, max) : result
  }

  return expr
}

export function rollCountFormula(formula: string): number {
  const trimmed = formula.trim()

  // Plain number
  const plain = parseInt(trimmed, 10)
  if (!isNaN(plain) && String(plain) === trimmed) return plain

  // NdM+K or dM+K pattern
  const match = trimmed.match(/^(\d*)d(\d+)(?:\+(\d+))?$/i)
  if (match) {
    const count = parseInt(match[1] || '1', 10)
    const sides = parseInt(match[2]!, 10)
    const bonus = parseInt(match[3] ?? '0', 10)
    let total = bonus
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1
    }
    return total
  }

  return 1
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run src/utils/hclTier.test.ts`
Expected: All PASS

**Step 5: Commit**

```bash
git add src/utils/hclTier.ts src/utils/hclTier.test.ts
git commit -m "feat: add HCL/Tier resolution utilities with tests"
```

---

### Task 4: Create default bestiary data file

**Files:**
- Create: `src/data/defaultBestiary.ts`

This is a large data file. All enemies come from the 4AD Core Rules Expanded PDF. Each entry stores raw formula strings for level and life, plus max cap where applicable. The `abilities` field contains special rules, reactions, and immunities.

**Step 1: Create the data file**

Create `src/data/defaultBestiary.ts` with all ~96 enemies from the core rulebook across 4 environments (dungeon, caverns, fungal_grottoes, fiendish_foes), each with 4 categories (vermin, minion, boss, weird). Each has 6 entries.

Every entry uses this shape:
```typescript
import type { BestiaryEntry } from '@/types'

export interface DefaultBestiaryEntry extends BestiaryEntry {
  maxLvl?: number  // max level cap for resolveExpression
}

export const defaultBestiary: DefaultBestiaryEntry[] = [
  // Dungeon Vermin (6)
  {
    type: 'Rats',
    category: 'vermin',
    environment: 'dungeon',
    lvl: 'HCL',
    life: '1',
    morale: 'Standard',
    treasure: 'None',
    attacks: '1',
    count: '3d6',
    abilities: 'Wounded PCs: 1-in-6 chance of infection (lose 1 Life). Goblins/trolls/orcs/lizardmen/ogres eat rats (1 Food each).',
    notes: 'Reactions: 1-3 Flee, 4-6 Fight',
    isDefault: true,
    maxLvl: 4,
  },
  // ... all other entries
]
```

The full data includes all enemies extracted from the PDF. Key data fields per enemy:
- `type`: Enemy name
- `category`: vermin/minion/boss/weird
- `environment`: dungeon/caverns/fungal_grottoes/fiendish_foes
- `lvl`: Level formula (e.g. "HCL+2")
- `life`: Life formula (e.g. "Tier+3" for bosses/weird, "1" for minions/vermin)
- `morale`: Morale description
- `treasure`: Treasure modifier
- `attacks`: Number of attacks
- `count`: Dice formula for number encountered (e.g. "3d6")
- `abilities`: Special abilities, immunities, combat rules
- `notes`: Reactions and additional notes
- `maxLvl`: Optional max level cap

**Step 2: Verify build compiles**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/data/defaultBestiary.ts
git commit -m "feat: add core rulebook bestiary data (96 enemies)"
```

---

### Task 5: Integrate default bestiary into the store and BestiaryManagerModal

**Files:**
- Modify: `src/components/modals/BestiaryManagerModal.tsx`
- Modify: `src/components/modals/EncounterCreationModal.tsx`
- Modify: `src/components/modals/EncounterModals.css`

**Step 1: Update BestiaryManagerModal with environment filter and default entries section**

The modal should:
- Show a filter dropdown for environment (All / Dungeon / Caverns / Fungal Grottoes / Fiendish Foes)
- Show a filter dropdown for category (All / Vermin / Minion / Boss / Weird)
- List default bestiary entries (read-only, no delete button) matching the filters
- Below, show custom entries section with existing add/delete functionality
- Default entries should be visually distinct (e.g. slightly different background)

**Step 2: Update EncounterCreationModal to use combined bestiary with auto-resolution**

The bestiary dropdown should:
- Combine default + custom entries
- Group by environment with `<optgroup>` labels
- On selection, auto-resolve HCL/Tier formulas using `resolveExpression` from `hclTier.ts`
- Roll `count` using `rollCountFormula` to set the encounter count
- Populate all fields with resolved values

Import `getHCL`, `getTier`, `resolveExpression`, `rollCountFormula` from `@/utils/hclTier` and `defaultBestiary` from `@/data/defaultBestiary`. Read characters from `usePartyStore`.

**Step 3: Add CSS for bestiary filters and default entry styling**

Add to `src/components/modals/EncounterModals.css`:
- `.bestiary-filters` — row of filter dropdowns
- `.bestiary-default-entry` — read-only entry styling (slightly dimmer, no delete button)
- `.bestiary-section-header` — environment group headers

**Step 4: Verify build compiles and test manually**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/components/modals/BestiaryManagerModal.tsx src/components/modals/EncounterCreationModal.tsx src/components/modals/EncounterModals.css
git commit -m "feat: integrate default bestiary with filtering and HCL/Tier auto-resolution"
```

---

### Task 6: Run full test suite and verify build

**Step 1: Run all tests**

Run: `npm run test`
Expected: All tests pass

**Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve any remaining type/test issues"
```
