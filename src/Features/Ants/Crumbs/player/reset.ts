import Decimal from 'break_infinity.js'
import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { defaultCrumbs, defaultHighestCrumbsEver, defaultHighestCrumbsThisSacrifice } from './default'

export const resetPlayerAntCrumbs = (resetTier: AntSacrificeTiers): void => {
  if (resetTier >= AntSacrificeTiers.sacrifice) {
    player.ants.crumbs = Decimal.fromDecimal(defaultCrumbs)
    player.ants.highestCrumbsThisSacrifice = Decimal.fromDecimal(defaultHighestCrumbsThisSacrifice)
  }
  // Sing Perk
  if (player.highestSingularityCount >= 20) {
    player.ants.crumbs = Decimal.fromString('1e100')
  }
  // If player resets the game
  if (resetTier >= AntSacrificeTiers.never) {
    player.ants.highestCrumbsEver = Decimal.fromDecimal(defaultHighestCrumbsEver)
  }
}
