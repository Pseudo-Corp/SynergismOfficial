import * as z from 'zod'
import { printRules } from '../AutoAscension'
import type { Player } from '../types/Synergism'
import { playerSchema } from './PlayerSchema'

export const playerJsonSchema = playerSchema.extend({
  autoAscendRules: z.any().transform((rules: Player['autoAscendRules']) => printRules(rules))
})
