import { player } from '../../../../../../../Synergism'
import { calculateEffectiveAntELO } from '../../AntELO/lib/calculate'

export const calculateImmortalELOGain = (): number => {
  const effectiveELO = calculateEffectiveAntELO()
  return Math.max(0, effectiveELO - player.ants.immortalELO)
}

export const calculateAdditionalELORequired = (): number => {
  const effectiveELO = calculateEffectiveAntELO()
  return Math.max(0, player.ants.immortalELO - effectiveELO)
}
