import type { Character } from '@/types'
import type { ClassTemplate } from '@/data/classTemplates'
import { CLASS_TEMPLATES } from '@/data/classTemplates'
import { rollDice } from '@/utils/dice'

export const CLASS_NAMES = CLASS_TEMPLATES.map((t) => t.name)

function resolveBonus(formula: ClassTemplate['atk'], level: number): string {
  switch (formula) {
    case '+0': return '+0'
    case '+1': return '+1'
    case '+L': return `+${level}`
    case '+1/2L': return `+${Math.floor(level / 2)}`
  }
}

export function applyClassTemplate(className: string, level = 1): Partial<Character> | undefined {
  const template = CLASS_TEMPLATES.find((t) => t.name === className)
  if (!template) return undefined

  const hp = template.hpBase + level
  const gp = rollDice(template.startingGold.count, template.startingGold.sides).total
    + (template.startingGold.bonus ?? 0)

  const traits = []
  const available = [...template.traits]
  for (let i = 0; i < template.traitCount && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length)
    traits.push(available[idx]!)
    available.splice(idx, 1)
  }

  const result: Partial<Character> = {
    class: template.name,
    lvl: level,
    hp: `${hp}/${hp}`,
    gp,
    atk: resolveBonus(template.atk, level),
    def: resolveBonus(template.def, level),
    gear: [...template.startingGear],
    spells: [...template.spells],
    abilities: [...template.abilities],
    traits: traits.map((t) => ({ val: t.val, det: t.det })),
  }

  if (template.lantern) {
    result.lantern = true
  }

  if (template.startingRationsDice) {
    const rd = template.startingRationsDice
    result.rations = rollDice(rd.count, rd.sides).total + (rd.bonus ?? 0)
  }

  return result
}
