import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { AntProducers, LAST_ANT_PRODUCER } from '../../structs/structs'
import { emptyAntProducer } from './default'

export const resetPlayerAntProducers = (resetTier: AntSacrificeTiers) => {
  if (resetTier >= AntSacrificeTiers.sacrifice) {
    for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
      player.ants.producers[ant] = emptyAntProducer()
    }
  }
  if (player.highestSingularityCount >= 10) {
    player.ants.producers[AntProducers.Workers].purchased = 20
  }
  if (player.highestSingularityCount >= 15) {
    player.ants.producers[AntProducers.Workers].purchased = 40
    player.ants.producers[AntProducers.Breeders].purchased = 20
  }
  if (player.highestSingularityCount >= 20) {
    player.ants.producers[AntProducers.MetaBreeders].purchased = 25
  }
}
