import { rebornELOCreationSpeedMultStats } from '../../../../../../../Statistics'
import { player } from '../../../../../../../Synergism'
import { geometricSeries } from '../../../../../../../Utility'
import {
  calculateLeftoverELO,
  calculateRebornELOThresholds,
  calculateStageRebornSpeedMult,
  thresholdModifiers,
  thresholdTranches
} from '../Stages/lib/threshold'

export const calculateAvailableRebornELO = () => {
  const pool = player.ants.immortalELO
  const alreadyActivated = player.ants.rebornELO
  return Math.max(0, pool - alreadyActivated)
}

export const rebornELOCreationSpeedMult = () => {
  return rebornELOCreationSpeedMultStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateTotalProductionForRebornELO = (rebornELO: number) => {
  const stage = calculateRebornELOThresholds(rebornELO)
  const leftover = calculateLeftoverELO(rebornELO, stage)

  const perStageMult = 1 / calculateStageRebornSpeedMult() // Using recriprocal because you need 1/modifier times as much production to get the same ELO/sec

  let production = 0
  let stagesSpent = 0
  for (const tranch of thresholdTranches) {
    const startIndex = stagesSpent
    const stagesInThisTranche = Math.min(tranch.stages, stage - stagesSpent)
    const endIndex = stagesSpent + stagesInThisTranche - 1
    const productionThisTranche = geometricSeries(startIndex, endIndex, perStageMult) * tranch.perStage
    production += productionThisTranche
    stagesSpent += stagesInThisTranche
    if (stagesSpent >= stage) {
      production += leftover * perStageMult ** stage
      break
    }
  }

  return production
}

export const calculateSecondsToMaxRebornELO = () => {
  const stageMod = thresholdModifiers().rebornSpeedMult
  const baseProductionPerSecond = rebornELOCreationSpeedMult() / stageMod

  const discountRequiredProduction = calculateTotalProductionForRebornELO(player.ants.rebornELO)
  const totalRequiredProduction = calculateTotalProductionForRebornELO(player.ants.immortalELO)

  // console.log(`Reborn ELO Production Calculation: ${discountRequiredProduction}`)
  // console.log(`Immortal ELO Production Calculation: ${totalRequiredProduction}`)

  return (totalRequiredProduction - discountRequiredProduction) / baseProductionPerSecond
}
