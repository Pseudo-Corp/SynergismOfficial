import type { AntSacrificeTiers } from '../../../Reset'
import { player } from '../../../Synergism'
import { resetPlayerAntMasteries } from '../AntMasteries/player/reset'
import { resetPlayerAntProducers } from '../AntProducers/player/reset'
import { resetPlayerAntSacrificeCounts } from '../AntSacrifice/player/reset'
import { resetPlayerAntImmortalELO } from '../AntSacrifice/Rewards/ELO/ImmortalELO/player/reset'
import { resetPlayerRebornELO } from '../AntSacrifice/Rewards/ELO/RebornELO/player/reset'
import { resetPlayerAntUpgrades } from '../AntUpgrades/player/reset'
import { resetPlayerAntCrumbs } from '../Crumbs/player/reset'

export const resetAnts = (resetTier: AntSacrificeTiers): void => {
  resetPlayerAntCrumbs(resetTier)
  resetPlayerAntProducers(resetTier)
  resetPlayerAntMasteries(resetTier)
  resetPlayerAntUpgrades(resetTier)
  resetPlayerRebornELO(resetTier)
  resetPlayerAntImmortalELO(resetTier)
  resetPlayerAntSacrificeCounts(resetTier)

  // TODO: Port to Features.
  player.antSacrificeTimer = 0
  player.antSacrificeTimerReal = 0
}
