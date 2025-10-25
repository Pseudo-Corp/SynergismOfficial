import { player } from '../../../../../../../../Synergism'
import { calculateRebornELOThresholds } from '../../Stages/lib/threshold'
import { calculateLeaderboardValue } from './calculate-leaderboard'

export const quarksFromELOMult = () => {
  const lifetimeTotalELOValue = calculateLeaderboardValue(player.ants.highestRebornELOEver)
  const numStages = calculateRebornELOThresholds(lifetimeTotalELOValue)
  return 2 - Math.pow(0.8, numStages / 100)
}

export const availableQuarksFromELO = () => {
  const totalELOValue = calculateLeaderboardValue(player.ants.highestRebornELODaily)
  const numStages = calculateRebornELOThresholds(totalELOValue)
  let baseQuarks = 0
  baseQuarks += Math.min(100, numStages)
  baseQuarks += 2 * Math.min(100, Math.max(0, numStages - 100))
  baseQuarks += 3 * Math.min(100, Math.max(0, numStages - 200))
  baseQuarks += 4 * Math.min(700, Math.max(0, numStages - 300))
  baseQuarks += 5 * Math.max(0, numStages - 1000)

  const antQuarkMult = quarksFromELOMult()
  return player.worlds.applyBonus(baseQuarks) * antQuarkMult - player.ants.quarksGainedFromAnts
}
