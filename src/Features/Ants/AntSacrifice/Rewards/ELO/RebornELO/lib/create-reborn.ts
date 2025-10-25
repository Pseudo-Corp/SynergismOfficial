import { player } from '../../../../../../../Synergism'
import { availableQuarksFromELO } from '../QuarkCorner/lib/calculate-quarks'
import { updateAntLeaderboards } from '../QuarkCorner/lib/leaderboard-update'
import { calculateAvailableRebornELO, rebornELOCreationSpeedMult } from './calculate'

export const activateELO = (dt: number) => {
  const toActivate = calculateAvailableRebornELO()
  if (toActivate > 0) {
    const activationSpeed = dt * rebornELOCreationSpeedMult()
    const decayedGain = toActivate * (1 - Math.pow(0.999, activationSpeed))
    const linearGain = 100 * activationSpeed
    const actualGain = Math.min(decayedGain, linearGain)
    player.ants.rebornELO += actualGain

    // Make it so that *eventually* the ELO is fully activated
    const smallLeak = Math.min(0.001 * activationSpeed, toActivate - actualGain)
    player.ants.rebornELO += smallLeak
  }
  updateAntLeaderboards()
  const quarksToBeGained = availableQuarksFromELO()
  player.worlds.add(quarksToBeGained, false)
  player.ants.quarksGainedFromAnts += quarksToBeGained
}
