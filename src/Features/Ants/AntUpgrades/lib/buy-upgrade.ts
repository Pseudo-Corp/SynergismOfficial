import { player } from '../../../../Synergism'
import type { AntUpgrades } from '../structs/structs'
import { getCostMaxAntUpgrades, getCostNextAntUpgrade, getMaxPurchasableAntUpgrades } from './get-cost'

export const buyAntUpgrade = (antUpgrade: AntUpgrades, max: boolean) => {
  if (max) {
    const buyTo = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
    if (buyTo <= player.ants.upgrades[antUpgrade]) {
      return
    } else {
      const cost = getCostMaxAntUpgrades(antUpgrade)
      if (player.ants.crumbs.gte(cost)) {
        player.ants.crumbs = player.ants.crumbs.sub(cost)
        player.ants.upgrades[antUpgrade] = buyTo
      }
    }
  } else {
    const cost = getCostNextAntUpgrade(antUpgrade)
    if (player.ants.crumbs.gte(cost)) {
      player.ants.crumbs = player.ants.crumbs.sub(cost)
      player.ants.upgrades[antUpgrade] += 1
    }
  }
}
