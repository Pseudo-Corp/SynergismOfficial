import Decimal from 'break_infinity.js'
import { player } from '../../../../Synergism'
import type { AntProducers } from '../../structs/structs'
import { antMasteryData } from '../data/data'

export const calculateSelfSpeedFromMastery = (ant: AntProducers) => {
  const level = player.ants.masteries[ant].mastery
  const selfPowerIncrement = level * antMasteryData[ant].selfPowerIncrement + 0.01 * Math.min(1, level)
  const selfBaseMult = antMasteryData[ant].selfSpeedMultipliers[level]
  return Decimal.pow(1 + selfPowerIncrement, player.ants.producers[ant].purchased).times(selfBaseMult)
}
