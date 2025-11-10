import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { AntProducers, LAST_ANT_PRODUCER } from '../../structs/structs'
import { defaultAntMasteries } from './default'

export const resetPlayerAntMasteries = (reset: AntSacrificeTiers) => {
  if (reset >= AntSacrificeTiers.sacrifice) {
    for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
      player.ants.masteries[ant].mastery = defaultAntMasteries[ant].mastery
    }
  }
}
