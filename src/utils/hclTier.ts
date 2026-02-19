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

  const plain = parseInt(trimmed, 10)
  if (!isNaN(plain) && String(plain) === trimmed) {
    return max !== undefined ? Math.min(plain, max) : plain
  }

  const hclMatch = trimmed.match(/^HCL(?:\+(\d+))?$/i)
  if (hclMatch) {
    const bonus = parseInt(hclMatch[1] ?? '0', 10)
    const result = hcl + bonus
    return max !== undefined ? Math.min(result, max) : result
  }

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

  const plain = parseInt(trimmed, 10)
  if (!isNaN(plain) && String(plain) === trimmed) return plain

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
