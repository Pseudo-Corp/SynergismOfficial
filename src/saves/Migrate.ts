import { blankSave } from '../Synergism'
import type { Player, SaveSupplier } from '../types/Synergism'
import { padArray } from '../Utility'

const migrations: SaveSupplier<keyof Player> = new Map([
  ['challengecompletions', (obj) => {
    if (!Array.isArray(obj) && typeof obj === 'object' && obj) {
      const arr = Object.values(obj)
      padArray(
        arr,
        0,
        blankSave.challengecompletions.length
      )
      return arr
    }

    return blankSave.challengecompletions
  }],
  ['highestchallengecompletions', (obj) => {
    if (!Array.isArray(obj) && typeof obj === 'object' && obj) {
      return Object.values(obj) as number[]
    }

    return blankSave.highestchallengecompletions
  }]
])
