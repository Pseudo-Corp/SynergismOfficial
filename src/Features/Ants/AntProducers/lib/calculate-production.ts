import Decimal from 'break_infinity.js'
import { player } from '../../../../Synergism'
import { calculateSelfSpeedFromMastery } from '../../AntMasteries/lib/ant-speed'
import type { AntProducers } from '../../structs/structs'
import { antProducerData } from '../data/data'

export const calculateBaseAntsToBeGenerated = (ant: AntProducers, antSpeedMult = Decimal.fromString('1')) => {
  return player.ants.producers[ant].generated
    .add(player.ants.producers[ant].purchased)
    .times(antProducerData[ant].baseProduction)
    .times(calculateSelfSpeedFromMastery(ant))
    .times(antSpeedMult)
}
