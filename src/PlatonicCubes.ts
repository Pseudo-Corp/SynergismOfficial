import type { CorruptionCubeType } from './Corruptions'
import { player } from './Synergism'

export const calculateCubeMultiplierPlatonicBlessing = () => {
  const DR = 1 / 5
  const effectPerBlessing = 2 / 4e6
  const limit = 4e6
  if (player.platonicBlessings.cubes < limit) {
    return 1 + effectPerBlessing * player.platonicBlessings.cubes
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.cubes, DR)
  }
}

export const calculateTesseractMultiplierPlatonicBlessing = () => {
  const DR = 1 / 5
  const effectPerBlessing = 1.5 / 4e6
  const limit = 4e6
  if (player.platonicBlessings.tesseracts < limit) {
    return 1 + effectPerBlessing * player.platonicBlessings.tesseracts
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.tesseracts, DR)
  }
}

export const calculateHypercubeMultiplierPlatonicBlessing = () => {
  const DR = 1 / 5
  const effectPerBlessing = 1 / 4e6
  const limit = 4e6
  if (player.platonicBlessings.hypercubes < limit) {
    return 1 + effectPerBlessing * player.platonicBlessings.hypercubes
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.hypercubes, DR)
  }
}

export const calculatePlatonicMultiplierPlatonicBlessing = () => {
  const DR = 1 / 5
  const effectPerBlessing = 1 / 8e4
  const limit = 8e4
  if (player.platonicBlessings.platonics < limit) {
    return 1 + effectPerBlessing * player.platonicBlessings.platonics
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.platonics, DR)
  }
}

export const calculateHypercubeBlessingMultiplierPlatonicBlessing = () => {
  const DR = 1 / 16
  const effectPerBlessing = 1 / 1e4
  const limit = 1e4
  if (player.platonicBlessings.hypercubeBonus < limit) {
    return 1 + effectPerBlessing * player.platonicBlessings.hypercubeBonus
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.hypercubeBonus, DR)
  }
}

export const calculateTaxPlatonicBlessing = () => {
  // 0 < effect < 1
  const factor = Math.pow(Math.log10(1 + player.platonicBlessings.taxes), 1.5)
  return factor / (125 + factor)

  // Should this be improved?
  /*const clippedAmount = Math.min(player.platonicBlessings.taxes, 1e20)

  if (player.platonicBlessings.taxes < limit) {
    return 1 + effectPerBlessing * player.platonicBlessings.taxes
  }
  else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.taxes, DR)
  }*/
}

const highScoringStatueBase = (blessings: number) => {
  const DR1 = 1 / 4
  const DR2 = 1 / 8
  const limit1 = 1e4
  const limit2 = 1e20
  const effectPerBlessing = 1 / 1e4

  if (blessings < limit1) {
    return 1 + effectPerBlessing * blessings
  } else if (limit1 <= blessings && blessings < limit2) {
    const limitMult = Math.pow(limit1, 1 - DR1)
    return 1 + effectPerBlessing * limitMult * Math.pow(blessings, DR1)
  } else {
    // Can derive that this works using algebra (Platonic did it)
    const limitMult1 = Math.pow(limit1, 1 - DR1)
    const limitMult2 = Math.pow(limit2, DR1 - DR2)
    return 1 + effectPerBlessing * limitMult1 * limitMult2 * Math.pow(blessings, DR2)
  }
}

const highScoringStatueSoftcap = 1e25

const highScoringStatueScaling: Record<CorruptionCubeType, { power: number; normalization: number }> = {
  cubes: { power: 1 / 4.1, normalization: 0 },
  tesseracts: { power: 0.35, normalization: 0 },
  hypercubes: { power: 0.5, normalization: 0 },
  platonics: { power: 0.75, normalization: 0 },
  hepteracts: { power: 0.85, normalization: 1e12 },
  octeracts: { power: 1, normalization: 1e25 }
}

export const calculateCubePlatonicBlessing = (cube: CorruptionCubeType) => {
  const { power, normalization } = highScoringStatueScaling[cube]
  const blessings = player.platonicBlessings.scoreBonus
  const softcapped = highScoringStatueBase(Math.min(blessings, highScoringStatueSoftcap))
  const excess = highScoringStatueBase(Math.max(blessings, highScoringStatueSoftcap))
    / highScoringStatueBase(highScoringStatueSoftcap)
  return Math.pow(Math.max(1, softcapped * Math.sqrt(excess) / highScoringStatueBase(normalization)), power)
}

export const calculateGlobalSpeedPlatonicBlessing = () => {
  const DR = 1 / 8
  const limit = 1e4
  const effectPerBlessing = 1 / 1e4

  if (player.platonicBlessings.globalSpeed < limit) {
    return 1 + effectPerBlessing * player.platonicBlessings.globalSpeed
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.globalSpeed, DR)
  }
}
