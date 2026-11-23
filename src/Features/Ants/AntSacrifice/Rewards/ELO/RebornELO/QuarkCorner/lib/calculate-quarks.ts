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

export const antCycleBaseQuarks = (leaderboard: Array<{ elo: number; sacrificeId: number }>) => {
  const totalELOValue = calculateLeaderboardValue(leaderboard)
  let numStages = calculateRebornELOThresholds(totalELOValue)
  let baseQuarks = 0
  const stageMult = Math.pow(quarkMultiplierPerThreshold, Math.min(numStages, 1000))
  for (const tranch of thresholdTranches) {
    const stagesInThisTranche = Math.min(tranch.stages, numStages)
    baseQuarks += stagesInThisTranche * tranch.quarkPerStage
    numStages -= stagesInThisTranche
    if (numStages <= 0) {
      break
    }
  }

  return baseQuarks * stageMult
}
