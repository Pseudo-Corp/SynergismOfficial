import { getAchievementReward } from '../../../Achievements'
import { player } from '../../../Synergism'
import { buyAntProducers } from '../AntProducers/lib/buy-producer'
import { AntProducers, LAST_ANT_PRODUCER } from '../structs/structs'

export const autobuyAntProducers = () => {
  const tiersUnlocked = +getAchievementReward('antAutobuyers') - 1
  for (let ant = LAST_ANT_PRODUCER; ant >= AntProducers.Workers; ant--) {
    if (ant <= tiersUnlocked) {
      buyAntProducers(ant, player.ants.toggles.maxBuyProducers)
    }
  }
}
