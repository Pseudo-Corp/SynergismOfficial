import { calculateHypercubeBlessingMultiplierPlatonicBlessing } from './PlatonicCubes'
import { player } from './Synergism'

export const calculateAcceleratorHypercubeBlessing = () => {
  const DR = 1 / 12
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.accelerator < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.accelerator
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.accelerator, DR)
  }
}

export const calculateMultiplierHypercubeBlessing = () => {
  const DR = 1 / 12
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.multiplier < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.multiplier
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.multiplier, DR)
  }
}

export const calculateOfferingHypercubeBlessing = () => {
  const DR = 1 / 6
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.offering < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.offering
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.offering, DR)
  }
}

export const calculateSalvageHypercubeBlessing = () => {
  const factor = Math.pow(Math.log10(player.hypercubeBlessings.runeExp + 1), 1.25)
  const cap = 3 / 2
  return 1 + cap * factor / (40 + factor)
}

export const calculateObtainiumHypercubeBlessing = () => {
  const DR = 1 / 6
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.obtainium < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.obtainium
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.obtainium, DR)
  }
}

export const calculateAntSpeedHypercubeBlessing = () => {
  const DR = 1 / 2
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.antSpeed < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.antSpeed
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.antSpeed, DR)
  }
}

export const calculateAntSacrificeHypercubeBlessing = () => {
  const DR = 1 / 12
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.antSacrifice < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.antSacrifice
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.antSacrifice, DR)
  }
}

export const calculateAntELOHypercubeBlessing = () => {
  return 1 + Math.log10(player.hypercubeBlessings.antELO + 1) / 25
}

export const calculateRuneEffectivenessHypercubeBlessing = () => {
  const DR = 1 / 64
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.talismanBonus < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.talismanBonus
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.talismanBonus, DR)
  }
}

export const calculateGlobalSpeedHypercubeBlessing = () => {
  const DR = 1 / 64
  const effectPerBlessing = calculateHypercubeBlessingMultiplierPlatonicBlessing() / 1000
  const limit = 1000
  if (player.hypercubeBlessings.globalSpeed < limit) {
    return 1 + effectPerBlessing * player.hypercubeBlessings.globalSpeed
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return effectPerBlessing * limitMult * Math.pow(player.hypercubeBlessings.globalSpeed, DR)
  }
}
