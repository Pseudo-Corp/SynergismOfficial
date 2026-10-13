import Decimal from 'break_infinity.js'
import {
  calculateAntELOHypercubeBlessing,
  calculateAntSacrificeHypercubeBlessing,
  calculateAntSpeedHypercubeBlessing,
  calculateGlobalSpeedHypercubeBlessing,
  calculateObtainiumHypercubeBlessing,
  calculateOfferingHypercubeBlessing,
  calculateRuneEffectivenessHypercubeBlessing,
  calculateSalvageHypercubeBlessing
} from './Hypercubes'
import { player } from './Synergism'

const calculateTractionTesseractBlessing = (blessings: number) => {
  const factor = Math.pow(Math.log10(blessings + 1), 1.25)
  const cap = 0.3
  return cap * factor / (20 + factor)
}

export const calculateAcceleratorTesseractBlessing = () =>
  calculateTractionTesseractBlessing(player.tesseractBlessings.accelerator)

export const calculateMultiplierTesseractBlessing = () =>
  calculateTractionTesseractBlessing(player.tesseractBlessings.multiplier)

export const calculateOfferingTesseractBlessing = () => {
  const DR = 1 / 3
  const effectPerBlessing = calculateOfferingHypercubeBlessing() / 1000
  const limit = 1000
  if (player.tesseractBlessings.offering < limit) {
    return 1 + effectPerBlessing * player.tesseractBlessings.offering
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.tesseractBlessings.offering, DR)
  }
}

export const calculateSalvageTesseractBlessing = () => {
  const factor = Math.pow(Math.log10(player.tesseractBlessings.runeExp + 1), 1.25)
  const cap = 1 / 2 * calculateSalvageHypercubeBlessing()
  return 1 + cap * factor / (20 + factor)
}

export const calculateObtainiumTesseractBlessing = () => {
  const DR = 1 / 3
  const effectPerBlessing = calculateObtainiumHypercubeBlessing() / 1000
  const limit = 1000
  if (player.tesseractBlessings.obtainium < limit) {
    return 1 + effectPerBlessing * player.tesseractBlessings.obtainium
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.tesseractBlessings.obtainium, DR)
  }
}

export const calculateAntSpeedTesseractBlessing = () => {
  const effectPerBlessing = 1 / 1000
  return new Decimal(1 + effectPerBlessing * player.tesseractBlessings.antSpeed).times(
    calculateAntSpeedHypercubeBlessing()
  )
}

export const calculateAntSacrificeTesseractBlessing = () => {
  const DR = 1 / 6
  const effectPerBlessing = calculateAntSacrificeHypercubeBlessing() / 1000
  const limit = 1000
  if (player.tesseractBlessings.antSacrifice < limit) {
    return 1 + effectPerBlessing * player.tesseractBlessings.antSacrifice
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.tesseractBlessings.antSacrifice, DR)
  }
}

export const calculateAntELOTesseractBlessing = () => {
  const hypercubeMult = calculateAntELOHypercubeBlessing()
  return 1 + Math.log10(player.tesseractBlessings.antELO + 1) * hypercubeMult / 100
}

export const calculateRuneEffectivenessTesseractBlessing = () => {
  const DR = 1 / 32
  const effectPerBlessing = calculateRuneEffectivenessHypercubeBlessing() / 1000
  const limit = 1000
  if (player.tesseractBlessings.talismanBonus < limit) {
    return 1 + effectPerBlessing * player.tesseractBlessings.talismanBonus
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.tesseractBlessings.talismanBonus, DR)
  }
}

export const calculateGlobalSpeedTesseractBlessing = () => {
  const DR = 1 / 32
  const effectPerBlessing = calculateGlobalSpeedHypercubeBlessing() / 1000
  const limit = 1000
  if (player.tesseractBlessings.globalSpeed < limit) {
    return 1 + effectPerBlessing * player.tesseractBlessings.globalSpeed
  } else {
    const limitMult = Math.pow(limit, 1 - DR)
    return 1 + effectPerBlessing * limitMult * Math.pow(player.tesseractBlessings.globalSpeed, DR)
  }
}
