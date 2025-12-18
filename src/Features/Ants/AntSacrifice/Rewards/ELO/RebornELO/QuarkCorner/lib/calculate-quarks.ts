import { player } from '../../../../../../../../Synergism'
import {
  calculateRebornELOThresholds,
  quarkMultiplierPerThreshold,
  thresholdTranches
} from '../../Stages/lib/threshold'
import { calculateLeaderboardValue } from './calculate-leaderboard'

export const quarksFromELOMult = () => {
  const lifetimeTotalELOValue = calculateLeaderboardValue(player.ants.highestRebornELOEver)
  const numStages = calculateRebornELOThresholds(lifetimeTotalELOValue)
  return 2 - Math.pow(0.8, numStages / 100)
}

export const availableQuarksFromELO = () => {
  const totalELOValue = calculateLeaderboardValue(player.ants.highestRebornELODaily)
  let numStages = calculateRebornELOThresholds(totalELOValue)
  let baseQuarks = 0
  const usedNumberStagesForMult = Math.min(numStages, 1000)
  const stageMult = Math.pow(quarkMultiplierPerThreshold, usedNumberStagesForMult)
  for (const tranch of thresholdTranches) {
    const stagesInThisTranche = Math.min(tranch.stages, numStages)
    baseQuarks += stagesInThisTranche * tranch.quarkPerStage
    numStages -= stagesInThisTranche
    if (numStages <= 0) {
      break
    }
  }

  let antQuarkMult = quarksFromELOMult()
  antQuarkMult *= stageMult
  antQuarkMult *= (player.autoWarpCheck) ? 1 + player.dailyPowderResetUses : 1
  return Math.max(0, player.worlds.applyBonus(baseQuarks) * antQuarkMult - player.ants.quarksGainedFromAnts)
}
