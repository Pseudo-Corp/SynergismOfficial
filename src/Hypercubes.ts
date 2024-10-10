import { player } from './Synergism'
import { Globals as G } from './Variables'

type Bless = keyof typeof player['hypercubeBlessings']

export const calculateHypercubeBlessings = () => {
  // The visual updates are handled in visualUpdateCubes()

  // we use Object.keys here instead of a for-in loop because we need the index of the key.
  const keys = Object.keys(player.hypercubeBlessings)

  for (const key of keys) {
    const obj = player.hypercubeBlessings[key as Bless]
    const idx = keys.indexOf(key) + 1

    let power = 1
    let mult = 1
    if (obj >= 1000) {
      power = G.benedictionDRPower[idx]!
      mult *= Math.pow(1000, 1 - G.benedictionDRPower[idx]!)
    }

    G.hypercubeBonusMultiplier[idx] = 1
      + mult * G.benedictionbase[idx]! * Math.pow(obj, power) * G.platonicBonusMultiplier[4]
  }
}
