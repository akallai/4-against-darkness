export interface DiceResult {
  total: number
  rolls: number[]
  individualRolls: number[][]
  detail: string
}

export function rollDice(count: number, sides: number, exploding = false): DiceResult {
  const rolls: number[] = []
  const individualRolls: number[][] = []

  for (let i = 0; i < count; i++) {
    let roll = Math.floor(Math.random() * sides) + 1
    let subtotal = roll
    const dieRolls = [roll]

    if (exploding) {
      while (roll === sides) {
        roll = Math.floor(Math.random() * sides) + 1
        subtotal += roll
        dieRolls.push(roll)
      }
    }

    rolls.push(subtotal)
    individualRolls.push(dieRolls)
  }

  const total = rolls.reduce((a, b) => a + b, 0)

  let detail: string
  if (count === 1) {
    detail = individualRolls[0]!.join(' + ')
  } else {
    detail = individualRolls
      .map((dr) => (dr.length > 1 ? `(${dr.join(' + ')})` : String(dr[0])))
      .join(' + ')
  }

  return { total, rolls, individualRolls, detail }
}

export function rollD66(): number {
  const tens = Math.floor(Math.random() * 6) + 1
  const ones = Math.floor(Math.random() * 6) + 1
  return tens * 10 + ones
}
