# Class Templates for Character Creation — Design

## Goal

Parse all 20 playable character classes from the 4AD Core Rules Expanded and create a class template system that auto-fills character fields when a class is selected during setup. Rolls gold automatically, populates HP/ATK/DEF, adds spells (limited-use) and abilities (passive), and auto-rolls a random trait from the class trait table.

## Decisions

- **Auto-fill immediately** on class selection (no preview/confirmation step)
- **Replace free-text class input** with a dropdown (20 classes + "Custom" for free-text)
- **Auto-roll random trait(s)** from the class trait table (1 trait for most, 2 for Halfling)
- **Add all available spells** to the spells list for spellcasting classes
- **Available in both** standard setup and troupe mode tavern creator
- **Static TypeScript file** for class data (Approach A)

## Data Model

### DiceExpression
```typescript
interface DiceExpression {
  count: number   // number of dice
  sides: number   // e.g. 6 for d6
  bonus?: number  // flat modifier
}
```

### TraitOption
```typescript
interface TraitOption {
  val: string    // trait name
  det: string    // compact rule summary using L, HCL, Tier abbreviations
}
```

### ClassTemplate
```typescript
interface ClassTemplate {
  name: string
  hp: { base: number }             // Life = base + L
  atk: string                      // description: "+L", "+1/2L", etc.
  def: string                      // description: "+0", "+L", "+1/2L", etc.
  startingGold: DiceExpression
  startingGear: ListItem[]
  spells: ListItem[]               // limited-use: spells, prayers, rage, luck, tricks, etc.
  abilities: ListItem[]            // passive abilities
  traits: TraitOption[]            // 6 options (d6 table)
  traitCount: number               // 1 for most, 2 for halfling
  startingRations?: number
  startingRationsDice?: DiceExpression
  lantern?: boolean
  notes?: string
}
```

## Classes (20 total)

| Class | HP Base | Starting Gold | ATK | DEF | Spells/Limited-Use | Trait Count |
|-------|---------|--------------|-----|-----|-------------------|------------|
| Acrobat | 3 | 1d6 | +1/2L | +L | Tricks (L+3 pts) | 1 |
| Assassin | 3 | 5d6 | +L | +0 | Hide in Shadows | 1 |
| Barbarian | 7 | 1d6 | +L | +0 | Rage (1+1/2L) | 1 |
| Bulwark | 7 | 1d6 | +1/2L | +1/2L | — | 1 |
| Cleric | 4 | 1d6 | +1/2L | +0 | Healing x3, Blessing x3 | 1 |
| Dwarf | 5 | 3d6 | +L melee | +0 | Gold Sense | 1 |
| Druid | 3 | 2d6 | +1/2L | +0 | 2+L spell slots (12 druid spells) | 1 |
| Elf | 4 | 2d6 | +L (not 2h) | +0 | L spell slots (5 basic wizard spells) | 1 |
| Gnome | 4 | 4d6 | +0 | +1/2L | L slots (1 illu spell), L+6 gadget pts | 1 |
| Halfling | 3 | 2d6 | +0 | +0 | Luck (L+1 pts), Nourishing Meal 1x | 2 |
| Illusionist | 2 | 3d6 | +0 | +0 | L+3 slots (12 illu spells) + Distracting Lights | 1 |
| Kukla | 5 | 3d6 | +1 light slash | +1/2L | Red Ring 1x, Green Ring 1x | 1 |
| Light Gladiator | 5 | 1d6 | +1/2L light | +1/2L | Parry & Counter-strike 1x/combat | 1 |
| Mushroom Monk | 4 | 1d6 | +L monk wpns | +1/2L | Spores (Tier x/adv), Hyphae 1x/adv | 1 |
| Paladin | 6 | 1d6 | +L | +0 | Prayer pts (L+1): heal/reroll/steed | 1 |
| Ranger | 6 | 2d6 | +L | +0 | — | 1 |
| Rogue | 3 | 3d6 | +0 | +L | — | 1 |
| Swashbuckler | 4 | 2d6 | +1/2L | +1/2L | Panache (earn per kill, max L) | 1 |
| Warrior | 6 | 2d6 | +L | +0 | — | 1 |
| Wizard | 2 | 4d6 | +0 | +0 | L+2 spell slots (6 basic spells) | 1 |

## Spell/Ability Categorization

**Spells list** (limited-use, tracked count):
- Acrobat: 12 Tricks (pool of L+3 trick points)
- Barbarian: Rage attacks (1+1 per 2 full levels)
- Cleric: Healing (3x/adv), Blessing (3x/adv)
- Druid: 12 druid spells (2+L slots)
- Elf: 5 basic wizard spells — Escape, Lightning, Fireball, Protection, Sleep (L slots)
- Gnome: 1 chosen illusionist spell (L slots), 8 gadget uses (L+6 points)
- Halfling: Luck points (L+1), Nourishing Meal (1x/adv)
- Illusionist: 12 illusionist spells (L+3 slots), Distracting Lights (free), Illusionary Knife Throw (1 slot)
- Kukla: Red Ring (1x lifetime), Green Ring (1x lifetime)
- Light Gladiator: Parry & Counter-strike (1x/combat)
- Mushroom Monk: Spores (Tier x/adv), Hyphae (1x/adv)
- Paladin: Prayer points (L+1) — Heal, Reroll Save, Summon Steed
- Swashbuckler: Panache (earned per kill, max L)
- Assassin: Hide in Shadows (spellcasting-like, once per combat setup)

**Abilities list** (passive, always-on):
- Class-specific combat bonuses, immunities, restrictions, stealth modifiers, etc.

## UI Changes

### CharacterInputGroup (setup screen)
- Replace `<input type="text" placeholder="Class">` with `<select>` dropdown
- 20 class options + "Custom" at bottom
- On class change: call `applyClassTemplate(className, level)` and merge result
- "Custom" reverts to free-text input
- Auto-expand the Detailed Setup section after template is applied

### TavernCreatorModal (troupe mode)
- Same dropdown replacement for class field

## File Structure

```
src/data/classTemplates.ts           — ClassTemplate type + 20 class definitions
src/utils/applyClassTemplate.ts      — applyClassTemplate() resolver function
src/components/setup/CharacterInputGroup.tsx  — dropdown modification
src/components/modals/TavernCreatorModal.tsx  — dropdown modification (if exists)
```

## Template Application Logic

`applyClassTemplate(templateName: string, level: number = 1): Partial<Character>`

1. Look up template by name
2. Roll starting gold via `rollDice(template.startingGold)`
3. Compute HP: `"${base+level}/${base+level}"`
4. Resolve ATK/DEF at given level ("+L" → "+1", "+1/2L" → "+0" at L1)
5. Copy gear, spells, abilities from template
6. Roll random trait(s) from trait table, add to traits list
7. Set rations if applicable (roll dice or fixed value)
8. Set lantern if applicable
9. Return `Partial<Character>`

## Testing

- Unit test `applyClassTemplate()` for each class: verify HP, gold range, non-empty lists
- Verify ATK/DEF resolution at L1 and L5
- Verify trait count (1 for most, 2 for halfling)
- Verify spellcaster classes have non-empty spell lists
