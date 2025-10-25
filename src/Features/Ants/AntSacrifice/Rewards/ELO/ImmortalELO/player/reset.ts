import { AntSacrificeTiers } from '../../../../../../../Reset'
import { player } from '../../../../../../../Synergism'
import { defaultAntImmortalELO } from './default'

export const resetPlayerAntImmortalELO = (resetTiers: AntSacrificeTiers) => {
  if (resetTiers >= AntSacrificeTiers.ascension) {
    player.ants.immortalELO = defaultAntImmortalELO
  }
}
