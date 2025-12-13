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
    : Decimal.fromString('0')
  return nextCost.sub(lastCost)
}

export const getCostMaxAnts = (ant: AntProducers) => {
  const maxBuyable = getMaxPurchasableAnts(ant, player.ants.crumbs)
  const data = antProducerData[ant]

  const spent = player.ants.producers[ant].purchased > 0
    ? Decimal.pow(data.costIncrease, player.ants.producers[ant].purchased - 1).times(data.baseCost)
    : Decimal.fromString('0')

  const maxAntCost = Decimal.pow(data.costIncrease, maxBuyable - 1).times(data.baseCost)

  return maxAntCost.sub(spent)
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
    : Decimal.fromString('0')
  const realBudget = budget.add(sunkCost)

  return Math.max(0, 1 + Math.floor(Decimal.log(realBudget.div(data.baseCost), data.costIncrease)))
}
