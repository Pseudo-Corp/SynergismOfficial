import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { AntProducers, LAST_ANT_PRODUCER } from '../../structs/structs'
import { defaultAntProducers } from './default'

export const resetPlayerAntProducers = (resetTier: AntSacrificeTiers) => {
  if (resetTier >= AntSacrificeTiers.sacrifice) {
    for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
      player.ants.producers[ant].generated = defaultAntProducers[ant].generated
      player.ants.producers[ant].purchased = defaultAntProducers[ant].purchased
    }
  }
}
