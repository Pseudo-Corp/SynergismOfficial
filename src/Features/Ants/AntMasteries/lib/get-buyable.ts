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
    const elo = player.ants.immortalELO
    const eloCheck = elo >= reqELO
    const particleCheck = player.reincarnationPoints.gte(antMasteryData[ant].particleCosts[level])
    return eloCheck && particleCheck
  }
}
