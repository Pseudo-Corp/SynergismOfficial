import { player } from '../../../Synergism'
import { maxBuyUpgradeHTML } from '../HTML/updates/toggles/max-buy-upgrade'

export const toggleMaxBuyAntUpgrade = (): void => {
  player.ants.toggles.maxBuyUpgrades = !player.ants.toggles.maxBuyUpgrades
  maxBuyUpgradeHTML(player.ants.toggles.maxBuyUpgrades)
}
