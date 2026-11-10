import * as z from 'zod'
import { printRules } from '../AutoAscension'
import type { Player } from '../types/Synergism'
import { playerSchema } from './PlayerSchema'

export const playerJsonSchema = playerSchema.extend({
  codes: z.any().transform((codes: Player['codes']) => Array.from(codes)),

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

  autoAscendRules: z.any().transform((rules: Player['autoAscendRules']) => printRules(rules)),

  dayCheck: z.any().transform((dayCheck: Player['dayCheck']) => dayCheck?.toISOString() ?? null)
})
