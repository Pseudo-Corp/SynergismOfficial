import type { AntProducers } from '../../structs/structs'
import type { PlayerAntMasteries } from '../structs/structs'

const emptyAntMastery: PlayerAntMasteries = {
  mastery: 0,
  highestMastery: 0
}

export const defaultAntMasteries: Record<AntProducers, PlayerAntMasteries> = {
  [0]: { ...emptyAntMastery },
  [1]: { ...emptyAntMastery },
  [2]: { ...emptyAntMastery },
  [3]: { ...emptyAntMastery },
  [4]: { ...emptyAntMastery },
  [5]: { ...emptyAntMastery },
  [6]: { ...emptyAntMastery },
  [7]: { ...emptyAntMastery },
  [8]: { ...emptyAntMastery }
}
