import type { Module } from 'i18next'
import { format } from '../Synergism'
import Decimal from 'break_infinity.js'

export default {
  type: 'postProcessor',
  name: 'NumberLocale',
  process: (value: string): string => value.replace(
    /num:\(\(([^e)]*(e?)[^e)]*)\)\)/g, //num:1e6 => 1e6; num:1e6L => 1,000,000; num:0.1% => 0.1%
    (_, num, exp) => format(Decimal.fromString(num), 5, exp !== 'e', true)
  )
} as Module
