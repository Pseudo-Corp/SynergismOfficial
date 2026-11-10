import * as z from 'zod'
import { printRules } from '../AutoAscension'
import type { Player } from '../types/Synergism'
import { playerSchema } from './PlayerSchema'

export const playerJsonSchema = playerSchema.extend({
  singularityChallenges: z.any().transform((challenges: Player['singularityChallenges']) =>
    Object.fromEntries(
      Object.entries(challenges).map(([key, value]) => {
        return [
          key,
          {
            completions: value.completions,
            highestSingularityCompleted: value.highestSingularityCompleted,
            enabled: value.enabled
          }
        ]
      })
    )
  ),

  autoAscendRules: z.any().transform((rules: Player['autoAscendRules']) => printRules(rules))
})
