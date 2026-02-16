export interface DiceResult {
  total: number
  rolls: number[]
  detail: string
}

export function rollDice(count: number, sides: number, exploding = false): DiceResult {
  const rolls: number[] = []

  for (let i = 0; i < count; i++) {
    let roll = Math.floor(Math.random() * sides) + 1
    let subtotal = roll

    if (exploding) {
      while (roll === sides) {
        roll = Math.floor(Math.random() * sides) + 1
        subtotal += roll
      }
    }

    rolls.push(subtotal)
  }

  const total = rolls.reduce((a, b) => a + b, 0)
  const detail = rolls.join('+')

  return { total, rolls, detail }
}

export function rollD66(): number {
  const tens = Math.floor(Math.random() * 6) + 1
  const ones = Math.floor(Math.random() * 6) + 1
  return tens * 10 + ones
}
