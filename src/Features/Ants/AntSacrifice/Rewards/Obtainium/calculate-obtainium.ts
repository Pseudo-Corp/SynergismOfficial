import Decimal from 'break_infinity.js'
import {
  calculateAntSacrificeMultiplier,
  calculateGlobalTimerModifiers,
  calculateObtainium
} from '../../../../../Calculate'
import { player } from '../../../../../Synergism'

export const calculateAntSacrificeObtainium = (stageMult: number, useTime = true) => {
  const antSacMult = calculateAntSacrificeMultiplier()
  const timeMultiplier = calculateGlobalTimerModifiers(player.antSacrificeTimer, useTime)

  const overallSacrificeMultiplier = Decimal.fromString('1').times(antSacMult).times(stageMult).times(timeMultiplier)

  const useTimeMultInCalculateObtainium = false
  const finalObtainium = calculateObtainium(useTimeMultInCalculateObtainium).times(overallSacrificeMultiplier)

  return (player.singularityChallenges.taxmanLastStand.enabled
      && player.singularityChallenges.taxmanLastStand.completions >= 2)
    ? Decimal.min(player.obtainium.times(100).plus(1), finalObtainium)
    : finalObtainium
}
