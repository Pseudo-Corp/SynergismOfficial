import Decimal from 'break_infinity.js'
import type { AntSacrificeTiers } from '../../Reset'
import { player } from '../../Synergism'
import { resetPlayerAntMasteries } from './AntMasteries/player/reset'
import { resetPlayerAntProducers } from './AntProducers/player/reset'
import { resetPlayerAntImmortalELO } from './AntSacrifice/Rewards/ELO/ImmortalELO/player/reset'
import { resetPlayerRebornELO } from './AntSacrifice/Rewards/ELO/RebornELO/player/reset'
import { resetPlayerAntUpgrades } from './AntUpgrades/player/reset'
import { autobuyAntMasteries } from './Autobuy/masteries'
import { autobuyAntProducers } from './Autobuy/producers'
import { autobuyAntUpgrades } from './Autobuy/upgrades'
import { resetPlayerAntSacrificeCounts } from './AntSacrifice/player/reset'

export const autobuyAnts = (): void => {
  autobuyAntMasteries()
  autobuyAntProducers()
  autobuyAntUpgrades()
}

export const resetAnts = (resetTier: AntSacrificeTiers): void => {
  resetPlayerAntProducers(resetTier)
  resetPlayerAntMasteries(resetTier)
  resetPlayerAntUpgrades(resetTier)
  resetPlayerRebornELO(resetTier)
  resetPlayerAntImmortalELO(resetTier)
  resetPlayerAntSacrificeCounts(resetTier)

  // Stuff that is not yet ported to the new Ants!
  player.ants.crumbs = new Decimal('1')
  player.ants.highestCrumbsThisSacrifice = new Decimal('1')
  if (player.currentChallenge.ascension === 12) {
    player.ants.crumbs = new Decimal('7')
  }
  player.antSacrificeTimer = 0
  player.antSacrificeTimerReal = 0
}
