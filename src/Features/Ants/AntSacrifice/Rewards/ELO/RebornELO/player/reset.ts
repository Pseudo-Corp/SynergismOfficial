import { AntSacrificeTiers } from '../../../../../../../Reset'
import { player } from '../../../../../../../Synergism'
import {
  defaultAntRebornELO,
  defaultHighestRebornELODaily,
  defaultHighestRebornELOEver,
  defaultQuarksGainedFromAnts
} from './default'

export const resetPlayerRebornELO = (resetTier: AntSacrificeTiers) => {
  if (resetTier >= AntSacrificeTiers.sacrifice) {
    player.ants.rebornELO = defaultAntRebornELO
  }
  if (resetTier >= AntSacrificeTiers.singularity) {
    player.ants.highestRebornELODaily = [...defaultHighestRebornELODaily]
    player.ants.quarksGainedFromAnts = defaultQuarksGainedFromAnts
  }
  // In the event of a player resetting their save!
  if (resetTier >= AntSacrificeTiers.never) {
    player.ants.highestRebornELOEver = [...defaultHighestRebornELOEver]
  }
}

/**
 * Resets when there is a new real-life day OR a forced dayskip is performed.
 */
export const resetPlayerRebornELODaily = () => {
  player.ants.highestRebornELODaily = [...defaultHighestRebornELODaily]
  player.ants.quarksGainedFromAnts = defaultQuarksGainedFromAnts
}
