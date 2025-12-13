import Decimal from 'break_infinity.js'
import { AntProducers } from '../../structs/structs'
import type { PlayerAntProducers } from '../structs/structs'

export const emptyAntProducer = (): PlayerAntProducers => ({
  purchased: 0,
  generated: Decimal.fromString('0')
})

export const createDefaultAntProducers = (): Record<AntProducers, PlayerAntProducers> => ({
  [AntProducers.Workers]: emptyAntProducer(),
  [AntProducers.Breeders]: emptyAntProducer(),
  [AntProducers.MetaBreeders]: emptyAntProducer(),
  [AntProducers.MegaBreeders]: emptyAntProducer(),
  [AntProducers.Queens]: emptyAntProducer(),
  [AntProducers.LordRoyals]: emptyAntProducer(),
  [AntProducers.Almighties]: emptyAntProducer(),
  [AntProducers.Disciples]: emptyAntProducer(),
  [AntProducers.HolySpirit]: emptyAntProducer()
})
