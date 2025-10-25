import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { defaultAntSacrificeCount, defaultCurrentSacrificeId } from './default'

export const resetPlayerAntSacrificeCounts = (resetTier: AntSacrificeTiers) => {
  // ALWAYS increment sacrificeId for the permanent Reborn ELO leaderboard
  player.ants.currentSacrificeId++
  if (resetTier >= AntSacrificeTiers.singularity) {
    player.ants.antSacrificeCount = defaultAntSacrificeCount
  } else {
    player.ants.antSacrificeCount++
  }

  // If you reset the game
  if (resetTier >= AntSacrificeTiers.never) {
    player.ants.currentSacrificeId = defaultCurrentSacrificeId
  }
}
