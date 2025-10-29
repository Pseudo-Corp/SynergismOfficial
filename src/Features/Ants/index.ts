import { player } from '../../Synergism'
import { autobuyAntMasteries } from './Automation/masteries'
import { autobuyAntProducers } from './Automation/producers'
import { autobuyAntUpgrades } from './Automation/upgrades'

export const autobuyAnts = (): void => {
  if (player.ants.toggles.autobuyMasteries) {
    autobuyAntMasteries()
  }
  if (player.ants.toggles.autobuyProducers) {
    autobuyAntProducers()
  }
  if (player.ants.toggles.autobuyUpgrades) {
    autobuyAntUpgrades()
  }
}
