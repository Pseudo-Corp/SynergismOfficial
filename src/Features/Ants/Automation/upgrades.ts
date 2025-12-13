import { player } from '../../../Synergism'
import { antUpgradeData } from '../AntUpgrades/data/data'
import { buyAntUpgrade } from '../AntUpgrades/lib/buy-upgrade'
import { AntUpgrades, LAST_ANT_UPGRADE } from '../AntUpgrades/structs/structs'

export const autobuyAntUpgrades = () => {
  for (let upgrade = AntUpgrades.AntSpeed; upgrade <= LAST_ANT_UPGRADE; upgrade++) {
    if (antUpgradeData[upgrade].autobuy()) {
      buyAntUpgrade(upgrade, player.ants.toggles.maxBuyUpgrades)
    }
  }
}
