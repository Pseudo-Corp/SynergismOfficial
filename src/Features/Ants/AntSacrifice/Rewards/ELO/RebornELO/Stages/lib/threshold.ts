import { player } from '../../../../../../../../Synergism'
import { assert } from '../../../../../../../../Utility'

export const thresholdTranches = [
  { stages: 100, perStage: 100 },
  { stages: 100, perStage: 1000 },
  { stages: 100, perStage: 3000 },
  { stages: 700, perStage: 20000 },
  { stages: Infinity, perStage: 100000 }
]

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

export const thresholdModifiers = () => {
  const thresholds = calculateRebornELOThresholds()
  return {
    rebornSpeedMult: Math.pow(0.98, thresholds),
    antSacrificeObtainiumMult: Math.pow(1.05, thresholds),
    antSacrificeOfferingMult: Math.pow(1.05, thresholds),
    antSacrificeTalismanFragmentMult: Math.pow(1.2, thresholds)
  }
}
