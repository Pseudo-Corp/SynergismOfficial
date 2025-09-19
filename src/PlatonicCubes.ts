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

export const calculateAscensionScorePlatonicBlessing = () => {
  const DR1 = 1 / 4
  const DR2 = 1 / 8
  const limit1 = 1e4
  const limit2 = 1e20
  const effectPerBlessing = 1 / 1e4

  if (player.platonicBlessings.globalSpeed < limit1) {
    return 1 + effectPerBlessing * player.platonicBlessings.globalSpeed
  } else if (limit1 <= player.platonicBlessings.globalSpeed && player.platonicBlessings.globalSpeed < limit2) {
    const limitMult = Math.pow(limit1, 1 - DR1)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.platonicBlessings.globalSpeed, DR1)
  } else {
    // Can derive that this works using algebra (Platonic did it)
    const limitMult1 = Math.pow(limit1, 1 - DR1)
    const limitMult2 = Math.pow(limit2, DR1 - DR2)
    return 1 + effectPerBlessing * limitMult1 * limitMult2 * Math.pow(player.platonicBlessings.globalSpeed, DR2)
  }
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
