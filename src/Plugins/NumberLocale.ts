import type { PostProcessorModule } from 'i18next'
import { format } from '../Synergism'
import Decimal from 'break_infinity.js'

export default {
  type: 'postProcessor',
  name: 'NumberLocale',
  process: (value: string): string => value.includes('num:') ? value.replace(
    // Regex replacement is faster than doing it in a loop
    /num:\(\(([^e)]*(e?)[^)]*)\)\)/g, //num:1e6000 => 1e6,000; num:1000000 => 1,000,000; num:0.1% => 0.1%
    (_, num, exp) => format(Decimal.fromString(num), 5, exp !== 'e', true)
  ) : value
} satisfies PostProcessorModule
