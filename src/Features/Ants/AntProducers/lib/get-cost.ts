import Decimal from 'break_infinity.js'
import { player } from '../../../../Synergism'
import type { AntProducers } from '../../structs/structs'
import { antProducerData } from '../data/data'

export const getCostNextAnt = (ant: AntProducers) => {
  const data = antProducerData[ant]
  const nextCost = data.baseCost.times(
    Decimal.pow(
      data.costIncrease,
      player.ants.producers[ant].purchased
    )
  )
  const lastCost = player.ants.producers[ant].purchased > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.producers[ant].purchased - 1
      )
    )
    : null
  return lastCost ? nextCost.sub(lastCost) : nextCost
}

export const getCostMaxAnts = (ant: AntProducers) => {
  const maxBuyable = getMaxPurchasableAnts(ant, player.ants.crumbs)
  const data = antProducerData[ant]

  const spent = player.ants.producers[ant].purchased > 0
    ? Decimal.pow(data.costIncrease, player.ants.producers[ant].purchased - 1).times(data.baseCost)
    : null

  const maxAntCost = Decimal.pow(data.costIncrease, maxBuyable - 1).times(data.baseCost)

  return spent ? maxAntCost.sub(spent) : maxAntCost
}

export const getMaxPurchasableAnts = (ant: AntProducers, budget: Decimal): number => {
  const data = antProducerData[ant]
  const sunkCost = player.ants.producers[ant].purchased > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.producers[ant].purchased - 1
      )
    )
    : null
  const realBudget = sunkCost ? budget.add(sunkCost) : budget

  return Math.max(0, 1 + Math.floor(Decimal.log(realBudget.div(data.baseCost), data.costIncrease)))
}
