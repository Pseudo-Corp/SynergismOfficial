import { getAchievementReward } from '../../../Achievements'
import { getLevelMilestone } from '../../../Levels'
import { player } from '../../../Synergism'
import { buyAntUpgrade } from '../AntUpgrades/lib/buy-upgrade'
import { AntUpgrades, LAST_ANT_UPGRADE } from '../AntUpgrades/structs/structs'

export const autobuyAntUpgrades = () => {
  const upgradesUnlocked = +getAchievementReward('antUpgradeAutobuyers')
  for (let upgrade = AntUpgrades.AntSpeed; upgrade < LAST_ANT_UPGRADE; upgrade++) {
    if (upgrade < upgradesUnlocked) {
      buyAntUpgrade(upgrade, player.ants.toggles.maxBuyUpgrades)
    }
  }

  // The way mortuus autobuy is unlocked is
  // research 6x20. The above loop won't catch it!
  if (player.researches[145] > 0) {
    buyAntUpgrade(AntUpgrades.Mortuus, player.ants.toggles.maxBuyUpgrades)
  }

  if (getLevelMilestone('antSpeed2Autobuyer')) {
    buyAntUpgrade(AntUpgrades.AntSpeed2, player.ants.toggles.maxBuyUpgrades)
  }
  if (getLevelMilestone('ascensionScoreAutobuyer')) {
    buyAntUpgrade(AntUpgrades.AscensionScore, player.ants.toggles.maxBuyUpgrades)
  }
  if (getLevelMilestone('wowCubesAutobuyer')) {
    buyAntUpgrade(AntUpgrades.WowCubes, player.ants.toggles.maxBuyUpgrades)
  }
  if (getLevelMilestone('mortuus2Autobuyer')) {
    buyAntUpgrade(AntUpgrades.Mortuus2, player.ants.toggles.maxBuyUpgrades)
  }
}
