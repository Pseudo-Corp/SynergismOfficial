import { awardAchievementGroup } from '../../../../Achievements'
import { player } from '../../../../Synergism'
import { AntProducers, LAST_ANT_PRODUCER } from '../../structs/structs'
import { getCostMaxAnts, getCostNextAnt, getMaxPurchasableAnts } from './get-cost'

export const buyAntProducers = (ant: AntProducers, max: boolean) => {
  const hadZeroProducers = player.ants.producers[ant].purchased === 0
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
  if (hadZeroProducers && player.ants.producers[ant].purchased > 0) {
    // Indicates that the first purchase was made; check for immortal ELO achievements
    awardAchievementGroup('sacMult')
  }
}

export const buyAllAntProducers = (max: boolean) => {
  for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
    buyAntProducers(ant, max)
  }
}
