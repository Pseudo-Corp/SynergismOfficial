import { autoBuyAntUpgrades } from '../../Ants'
import type { AntSacrificeTiers } from '../../Reset'
import { resetPlayerAntMasteries } from './AntMasteries/player/reset'
import { resetPlayerAntProducers } from './AntProducers/player/reset'
import { autobuyAntProducers } from './Autobuy/producers'

export const autobuyAnts = (): void => {
  autobuyAntProducers()
  autoBuyAntUpgrades()
}

export const resetAnts = (resetTier: AntSacrificeTiers): void => {
  resetPlayerAntProducers(resetTier)
  resetPlayerAntMasteries(resetTier)
}
