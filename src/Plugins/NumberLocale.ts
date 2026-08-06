import type { PostProcessorModule } from 'i18next'
import { format } from '../Synergism'
import Decimal from 'break_infinity.js'

export default {
  type: 'postProcessor',
  name: 'NumberLocale',
  process: (value: string): string => {
    let result = ''
    let start = 0, index = 0
    while ((index = value.indexOf('num:((', start)) !== -1) {
      const end = value.indexOf('))', index)
      const num = value.slice(index + 6, end)
      result += value.slice(start, index)
      result += format(Decimal.fromString(num), 5, !num.includes('e'), true)
      start = end + 2
    }
    result += value.slice(start)
    return result
  }
} satisfies PostProcessorModule
