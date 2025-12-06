import { player } from '../../../../Synergism'
import type { AntProducers } from '../../structs/structs'
import { antMasteryData } from '../data/data'
import { getMaxAntMasteryLevel } from './max-level'

export const canBuyAntMastery = (ant: AntProducers): boolean => {
  const level = player.ants.masteries[ant].mastery
  const maxLevel = getMaxAntMasteryLevel()
  if (level >= maxLevel) {
    return false
  } else {
    const reqELO = antMasteryData[ant].totalELORequirements[level]
    const elo = player.ants.rebornELO
    const eloCheck = elo >= reqELO
    return eloCheck && player.reincarnationPoints.gte(antMasteryData[ant].particleCosts[level])
  }
}

export const getBuyableMasteryLevels = (ant: AntProducers): number => {
  let buyableLevels = 0
  const maxLevel = getMaxAntMasteryLevel()
  const level = player.ants.masteries[ant].mastery
  while (level + buyableLevels < maxLevel) {
    const reqELO = antMasteryData[ant].totalELORequirements[level + buyableLevels]
    const elo = player.ants.rebornELO
    const eloCheck = elo >= reqELO
    const cost = antMasteryData[ant].particleCosts[level + buyableLevels]
    if (eloCheck && player.reincarnationPoints.gte(cost)) {
      buyableLevels++
    } else {
      break
    }
  }
  return buyableLevels
}
