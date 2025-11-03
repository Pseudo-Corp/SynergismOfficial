import Decimal from 'break_infinity.js'
import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { defaultCrumbs, defaultCrumbsEverMade, defaultCrumbsThisSacrifice } from './default'

export const resetPlayerAntCrumbs = (resetTier: AntSacrificeTiers): void => {
  if (resetTier >= AntSacrificeTiers.sacrifice) {
    player.ants.crumbs = Decimal.fromDecimal(defaultCrumbs)
    player.ants.crumbsThisSacrifice = Decimal.fromDecimal(defaultCrumbsThisSacrifice)
  }
  // Sing Perk
  if (player.highestSingularityCount >= 20) {
    player.ants.crumbs = Decimal.fromString('1e50')
  }
  // If player resets the game
  if (resetTier >= AntSacrificeTiers.never) {
    player.ants.crumbsEverMade = Decimal.fromDecimal(defaultCrumbsEverMade)
  }
}
