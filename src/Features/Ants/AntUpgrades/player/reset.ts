import type { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { antUpgradeData } from '../data/data'
import { AntUpgrades, LAST_ANT_UPGRADE } from '../structs/structs'
import { defaultAntUpgrades } from './default'

export const resetPlayerAntUpgrades = (resetTier: AntSacrificeTiers) => {
  for (let upgrade = AntUpgrades.AntSpeed; upgrade <= LAST_ANT_UPGRADE; upgrade++) {
    if (resetTier >= antUpgradeData[upgrade].minimumResetTier) {
      player.ants.upgrades[upgrade] = defaultAntUpgrades[upgrade]
    }
  }
  if (player.highestSingularityCount >= 10) {
    player.ants.upgrades[AntUpgrades.AntSpeed] = Math.max(10, player.ants.upgrades[AntUpgrades.AntSpeed])
  }
  if (player.highestSingularityCount >= 20) {
    player.ants.upgrades[AntUpgrades.Mortuus] = Math.max(1, player.ants.upgrades[AntUpgrades.Mortuus])
    player.ants.upgrades[AntUpgrades.AntSpeed] = Math.max(25, player.ants.upgrades[AntUpgrades.AntSpeed])
  }
}
