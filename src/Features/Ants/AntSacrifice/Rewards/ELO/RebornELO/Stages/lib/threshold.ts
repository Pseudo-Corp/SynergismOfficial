import { player } from '../../../../../../../../Synergism'
import { assert } from '../../../../../../../../Utility'

export const thresholdTranches = [
  { stages: 100, perStage: 100, quarkPerStage: 1 },
  { stages: 100, perStage: 1000, quarkPerStage: 2 },
  { stages: 100, perStage: 3000, quarkPerStage: 3 },
  { stages: 700, perStage: 20000, quarkPerStage: 4 },
  { stages: Number.POSITIVE_INFINITY, perStage: 100000, quarkPerStage: 7 }
]

export const quarkMultiplierPerThreshold = 1.002

export const perThresholdModifiers = {
  rebornSpeedMult: 0.98,
  antSacrificeObtainiumMult: 1.05,
  antSacrificeOfferingMult: 1.05,
  antSacrificeTalismanFragmentMult: 1.2
}

export const singularityPerkRebornSpeedMultModifier = () => {
  const singCount = player.singularityCount
  const levelArray = [1, 9, 25, 49, 81, 121, 169, 196, 225, 256, 289]
  for (let i = levelArray.length - 1; i >= 0; i--) {
    if (singCount >= levelArray[i]) {
      return 0.0001 + 0.00009 * i
    }
  }
  return 0
}

export const calculateStageRebornSpeedMult = () => {
  const base = perThresholdModifiers.rebornSpeedMult
  const increase = singularityPerkRebornSpeedMultModifier()
  return Math.min(1, base + increase)
}

export const calculateRebornELOThresholds = (elo?: number) => {
  let rebornELOBudget = elo ?? player.ants.rebornELO
  let thresholds = 0

  for (const tranche of thresholdTranches) {
    const stagesAdded = Math.min(tranche.stages, Math.floor(rebornELOBudget / tranche.perStage))
    thresholds += stagesAdded
    rebornELOBudget -= stagesAdded * tranche.perStage
    if (stagesAdded < tranche.stages) {
      break
    }
  }
  return thresholds
}

export const calculateToNextELOThreshold = (rebornELO: number, stage?: number) => {
  const thresholds = stage ?? calculateRebornELOThresholds(rebornELO)
  let stagesChecked = 0
  for (const tranche of thresholdTranches) {
    if (thresholds < stagesChecked + tranche.stages) {
      const reqELOThisThreshold = tranche.perStage
      return reqELOThisThreshold - rebornELO % reqELOThisThreshold
    }
    stagesChecked += tranche.stages
  }
  assert(false, 'Unreachable code in calculateToNextELOThreshold')
}

export const calculateLeftoverELO = (rebornELO: number, stage?: number) => {
  const thresholds = stage ?? calculateRebornELOThresholds(rebornELO)
  let usedELO = 0
  let stagesChecked = 0
  for (const tranche of thresholdTranches) {
    const stagesInThisTranche = Math.min(tranche.stages, thresholds - stagesChecked)
    usedELO += stagesInThisTranche * tranche.perStage
    stagesChecked += stagesInThisTranche
    if (stagesChecked >= thresholds) {
      break
    }
  }
  return rebornELO - usedELO
}

export const thresholdModifiers = () => {
  const thresholds = calculateRebornELOThresholds()
  return {
    rebornSpeedMult: Math.pow(calculateStageRebornSpeedMult(), thresholds),
    antSacrificeObtainiumMult: Math.pow(perThresholdModifiers.antSacrificeObtainiumMult, thresholds),
    antSacrificeOfferingMult: Math.pow(perThresholdModifiers.antSacrificeOfferingMult, thresholds),
    antSacrificeTalismanFragmentMult: Math.pow(perThresholdModifiers.antSacrificeTalismanFragmentMult, thresholds)
  }
}
