import { player } from '../../../../../../../Synergism'
import { availableQuarksFromELO } from '../QuarkCorner/lib/calculate-quarks'
import { updateAntLeaderboards } from '../QuarkCorner/lib/leaderboard-update'
import { calculateRebornELOThresholds, calculateToNextELOThreshold } from '../Stages/lib/threshold'
import { calculateAvailableRebornELO, rebornELOCreationSpeedMult } from './calculate'

export const activateELO = (dt: number) => {
  const toActivate = calculateAvailableRebornELO()
  if (toActivate > 0) {
    const limit = player.ants.immortalELO - player.ants.rebornELO
    const gain = Math.min(limit, dt * rebornELOCreationSpeedMult())
    let stages = calculateRebornELOThresholds(player.ants.rebornELO)
    let ELOToNextThreshold = calculateToNextELOThreshold(player.ants.rebornELO, stages)
    let budget = gain

    while (budget >= ELOToNextThreshold) {
      player.ants.rebornELO += ELOToNextThreshold
      budget -= ELOToNextThreshold
      budget /= 1.02 // Each threshold makes further ELO harder to gain
      stages++
      ELOToNextThreshold = calculateToNextELOThreshold(player.ants.rebornELO, stages)
    }

    player.ants.rebornELO += budget

    // Make it so that *eventually* the ELO is fully activated
    const plusOnePerSecond = Math.min(dt, toActivate)
    player.ants.rebornELO += plusOnePerSecond
  }
  updateAntLeaderboards()
  const quarksToBeGained = availableQuarksFromELO()
  if (quarksToBeGained > 0) {
    player.worlds.add(quarksToBeGained, false)
    player.ants.quarksGainedFromAnts += quarksToBeGained
  }
}
