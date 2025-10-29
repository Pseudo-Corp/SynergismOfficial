import { player } from '../../../Synergism'
import { autobuyAntUpgradeHTML } from '../HTML/updates/toggles/autobuy-upgrade'

export const toggleAutobuyAntUpgrade = (): void => {
  player.ants.toggles.autobuyUpgrades = !player.ants.toggles.autobuyUpgrades
  autobuyAntUpgradeHTML(player.ants.toggles.autobuyUpgrades)
}
