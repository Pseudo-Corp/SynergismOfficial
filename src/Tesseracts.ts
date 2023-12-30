import { player } from './Synergism'
import { Globals as G } from './Variables'

export const calculateTesseractBlessings = () => {
  // The visual updates are handled in visualUpdateCubes()
  const tesseractArray = [
    player.tesseractBlessings.accelerator,
    player.tesseractBlessings.multiplier,
    player.tesseractBlessings.offering,
    player.tesseractBlessings.runeExp,
    player.tesseractBlessings.obtainium,
    player.tesseractBlessings.antSpeed,
    player.tesseractBlessings.antSacrifice,
    player.tesseractBlessings.antELO,
    player.tesseractBlessings.talismanBonus,
    player.tesseractBlessings.globalSpeed
  ]

  for (let i = 0; i < 10; i++) {
    let power = 1
    let mult = 1
    if (tesseractArray[i] >= 1000 && i !== 5) {
      power = G.giftDRPower[i]
      mult *= Math.pow(1000, 1 - G.giftDRPower[i])
    }

    G.tesseractBonusMultiplier[i + 1] = 1
      + mult * G.giftbase[i] * Math.pow(tesseractArray[i], power) * G.hypercubeBonusMultiplier[i + 1]!
  }
}
