import Decimal from 'break_infinity.js'
import { player } from '../../../../Synergism'
import { antUpgradeData } from '../data/data'
import type { AntUpgrades } from '../structs/structs'

export const getCostNextAntUpgrade = (antUpgrade: AntUpgrades) => {
  const data = antUpgradeData[antUpgrade]
  const nextCost = data.baseCost.times(
    Decimal.pow(
      data.costIncrease,
      player.ants.upgrades[antUpgrade]
    )
  )
  const lastCost = player.ants.upgrades[antUpgrade] > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.upgrades[antUpgrade] - 1
      )
    )
    : new Decimal(0)
  return nextCost.sub(lastCost)
}

export const getCostMaxAntUpgrades = (antUpgrade: AntUpgrades) => {
  const maxBuyable = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
  const data = antUpgradeData[antUpgrade]

  const spent = player.ants.upgrades[antUpgrade] > 0
    ? Decimal.pow(data.costIncrease, player.ants.upgrades[antUpgrade] - 1).times(data.baseCost)
    : new Decimal(0)

  const maxAntUpgradeCost = Decimal.pow(data.costIncrease, maxBuyable - 1).times(data.baseCost)

  return maxAntUpgradeCost.sub(spent)
}

export const getMaxPurchasableAntUpgrades = (antUpgrade: AntUpgrades, budget: Decimal): number => {
  const data = antUpgradeData[antUpgrade]
  const sunkCost = player.ants.upgrades[antUpgrade] > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.upgrades[antUpgrade] - 1
      )
    )
    : new Decimal(0)
  const realBudget = budget.add(sunkCost)

  return Math.max(0, 1 + Math.floor(Decimal.log(realBudget.div(data.baseCost), data.costIncrease)))
}
