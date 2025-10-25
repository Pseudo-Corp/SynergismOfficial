import { autobuyAntMasteries } from './Autobuy/masteries'
import { autobuyAntProducers } from './Autobuy/producers'
import { autobuyAntUpgrades } from './Autobuy/upgrades'

export const autobuyAnts = (): void => {
  autobuyAntMasteries()
  autobuyAntProducers()
  autobuyAntUpgrades()
}
