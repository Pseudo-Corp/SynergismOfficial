import { getAchievementReward } from '../../../Achievements'
import { player } from '../../../Synergism'
import { buyAntMastery } from '../AntMasteries/lib/buy-mastery'
import { canBuyAntMastery } from '../AntMasteries/lib/get-buyable'
import { AntProducers, LAST_ANT_PRODUCER } from '../structs/structs'

export const autobuyAntMasteries = (): void => {
  const highestUnlockedTier = +getAchievementReward('antAutobuyers') - 1
  for (let ant = LAST_ANT_PRODUCER; ant >= AntProducers.Workers; ant--) {
    if (ant <= highestUnlockedTier) {
      while (canBuyAntMastery(ant) && player.ants.masteries[ant].mastery < player.ants.masteries[ant].highestMastery) {
        buyAntMastery(ant)
      }
    }
  }
}
