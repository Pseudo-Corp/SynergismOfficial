import { player } from '../../../../Synergism'
import { AntProducers, LAST_ANT_PRODUCER } from '../../structs/structs'
import { antMasteryData } from '../data/data'
import { canBuyAntMastery } from './get-buyable'

export const buyAntMastery = (ant: AntProducers): void => {
  if (canBuyAntMastery(ant)) {
    const level = player.ants.masteries[ant].mastery
    player.ants.masteries[ant].mastery += 1
    player.ants.masteries[ant].highestMastery = Math.max(
      player.ants.masteries[ant].highestMastery,
      player.ants.masteries[ant].mastery
    )
    player.reincarnationPoints = player.reincarnationPoints.sub(antMasteryData[ant].particleCosts[level])
  }
}

export const buyAllAntMasteries = (): void => {
  for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
    while (canBuyAntMastery(ant)) {
      buyAntMastery(ant)
    }
  }
}
