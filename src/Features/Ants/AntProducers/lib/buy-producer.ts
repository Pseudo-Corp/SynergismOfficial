import { player } from '../../../../Synergism'
import type { AntProducers } from '../../structs/structs'
import { getCostMaxAnts, getCostNextAnt, getMaxPurchasableAnts } from './get-cost'

export const buyAntProducers = (ant: AntProducers, max: boolean) => {
  if (max) {
    const buyTo = getMaxPurchasableAnts(ant, player.ants.crumbs)
    if (buyTo <= player.ants.producers[ant].purchased) {
      return
    } else {
      const cost = getCostMaxAnts(ant)
      if (player.ants.crumbs.gte(cost)) {
        player.ants.crumbs = player.ants.crumbs.sub(cost)
        player.ants.producers[ant].purchased = buyTo
      }
    }
  } else {
    const cost = getCostNextAnt(ant)
    if (player.ants.crumbs.gte(cost)) {
      player.ants.crumbs = player.ants.crumbs.sub(cost)
      player.ants.producers[ant].purchased += 1
    }
  }
}
