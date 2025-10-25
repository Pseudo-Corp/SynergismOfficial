import type Decimal from 'break_infinity.js'
import type { AntProducers } from '../../structs/structs'

export interface AntProducerTexts {
  text: () => string
  displayCondition: () => boolean
}

export interface AntProducerData {
  baseCost: Decimal
  costIncrease: number
  baseProduction: Decimal
  color: string
  additionalTexts: AntProducerTexts[]
  produces?: AntProducers
}

export interface PlayerAntProducers {
  purchased: number
  generated: Decimal
}
