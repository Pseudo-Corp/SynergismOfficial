import Decimal from 'break_infinity.js'
import { calculateAntSacrificeMultiplier, calculateOfferings } from '../../../../../Calculate'
import { offeringObtainiumTimeModifiers } from '../../../../../Statistics'
import { player } from '../../../../../Synergism'

export const calculateAntSacrificeOffering = (stageMult: number) => {
  const antSacMult = calculateAntSacrificeMultiplier()
  const timeMultiplier = offeringObtainiumTimeModifiers(player.antSacrificeTimer, true).reduce(
    (a, b) => a * b.stat(),
    1
  )
  const overallSacrificeMultiplier = Decimal.fromString('1').times(antSacMult).times(stageMult).times(timeMultiplier)

  const useTimeMultInCalculateOfferings = false
  const offeringMult = calculateOfferings(useTimeMultInCalculateOfferings)

  const finalOfferings = offeringMult.times(overallSacrificeMultiplier)

  return (player.singularityChallenges.taxmanLastStand.enabled
      && player.singularityChallenges.taxmanLastStand.completions >= 2)
    ? Decimal.min(player.offerings.times(100).plus(1), finalOfferings)
    : finalOfferings
}
