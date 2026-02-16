const maleFirst = ["Alaric", "Brond", "Caelum", "Doran", "Elias", "Fendrel", "Garrick", "Horgar", "Ivor", "Joren", "Tarkus"]
const femaleFirst = ["Ayla", "Ambyr", "Brena", "Ceryn", "Dalia", "Elowen", "Ember", "Fia", "Gwenna", "Halia", "Isolde", "Juna"]
const lastNames = ["Ironfoot", "Moorglade", "Shadowstep", "Oakshield", "Riverrun", "Stormborn", "Brighthelm", "Grimward", "Thornbush", "of Sunhillow", "Greenhill", "Oakwarden", "Starblind", "Oathsworn"]
const races = ["Human", "Elf", "Dwarf", "Beastfolk", "Avianfolk", "Greenskin", "Flower Demon", "Pallidskin"]
const traits = [
  "Absent-minded: Preoccupied to the extent of being unaware of immediate surroundings.",
  "Arrogant: Having or displaying a sense of overbearing self-worth or self-importance.",
  "Bold: Too forward, taking undue liberties, and lacking proper modesty or restraint.",
  "Callous: Hardened to emotions, rarely showing any form of expression; unfeeling.",
  "Cruel: Mean to anyone or anything, without care or regard to consequences.",
  "Dishonest: Given to or using fraud and cheating; deceitful and underhanded.",
  "Envious: Painfully desirous of another's advantages; jealous or covetous.",
  "Fierce: Marked by extreme intensity of emotions; inclined to react violently.",
  "Gruff: Brusque or stern in manner or appearance; crusty and surly.",
  "Gullible: Will believe any information given; easily deceived or duped.",
  "Idealist: Unrealistic and impractical, guided more by ideals than practice.",
  "Lazy: Resistant to work or exertion; disposed to idleness.",
  "Nervous: Easily agitated or distressed; high-strung or jumpy.",
  "Paranoid: Characterized by extreme and irrational fear or distrust of others.",
  "Proud: Filled with excessive self-esteem; will shirk help from others.",
  "Reckless: Headstrong with a wild carelessness and disregard for consequences.",
  "Sarcastic: A subtle form of mockery in which meaning is conveyed obliquely.",
  "Selfish: Concerned chiefly or only with oneself.",
  "Stubborn: Unreasonably unyielding and bull-headed; resolute.",
  "Timid: Shy and quiet, shrinking away from strangers and confrontations.",
  "Withdrawn: Not friendly or sociable; aloof.",
  "Zealous: A fanatic marked by intense devotion to a cause.",
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export interface GeneratedNPC {
  name: string
  race: string
  lvl: number
  life: number
  trait: string
}

export function generateNPC(): GeneratedNPC {
  const isMale = Math.random() > 0.5
  const firstName = pickRandom(isMale ? maleFirst : femaleFirst)
  const lastName = pickRandom(lastNames)
  const race = pickRandom(races)
  const trait = pickRandom(traits)
  const lvl = Math.floor(Math.random() * 5) + 1
  const life = Math.floor(Math.random() * 7) + 1

  return {
    name: `${firstName} ${lastName}`,
    race,
    lvl,
    life,
    trait,
  }
}

const yesNoResults = [
  "Yes, and...",
  "Yes",
  "Yes, but...",
  "No, but...",
  "No",
  "No, and...",
]

export function askOracle(): string {
  return pickRandom(yesNoResults)
}

const events = [
  "An ally arrives unexpectedly",
  "A trap is revealed",
  "The environment shifts",
  "A hidden passage is found",
  "Resources are discovered",
  "An enemy retreats",
  "A mysterious sound echoes",
  "Weather changes dramatically",
  "An old friend appears",
  "Equipment breaks down",
  "A rival faction intervenes",
  "A clue is uncovered",
]

export function randomEvent(): string {
  return pickRandom(events)
}
