import Decimal from 'break_infinity.js'
import { AntProducers } from '../../structs/structs'
import type { PlayerAntProducers } from '../structs/structs'

const emptyAntProducer: PlayerAntProducers = {
  purchased: 0,
  generated: new Decimal(0)
}

export const defaultAntProducers: Record<AntProducers, PlayerAntProducers> = {
  [AntProducers.Workers]: { ...emptyAntProducer },
  [AntProducers.Breeders]: { ...emptyAntProducer },
  [AntProducers.MetaBreeders]: { ...emptyAntProducer },
  [AntProducers.MegaBreeders]: { ...emptyAntProducer },
  [AntProducers.Queens]: { ...emptyAntProducer },
  [AntProducers.LordRoyals]: { ...emptyAntProducer },
  [AntProducers.Almighties]: { ...emptyAntProducer },
  [AntProducers.Disciples]: { ...emptyAntProducer },
  [AntProducers.HolySpirit]: { ...emptyAntProducer }
}
