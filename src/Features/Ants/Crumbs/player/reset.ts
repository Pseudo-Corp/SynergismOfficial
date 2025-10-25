import Decimal from 'break_infinity.js'
import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'

export const resetPlayerAntCrumbs = (resetTier: AntSacrificeTiers): void => {
  if (resetTier >= AntSacrificeTiers.sacrifice) {
    player.ants.crumbs = new Decimal('1')
    player.ants.highestCrumbsThisSacrifice = new Decimal('1')
  }
  // Sing Perk
  if (player.highestSingularityCount >= 20) {
    player.ants.crumbs = new Decimal('1e100')
  }
  // If player resets the game
  if (resetTier >= AntSacrificeTiers.never) {
    player.ants.highestCrumbsEver = new Decimal('1')
  }
}
