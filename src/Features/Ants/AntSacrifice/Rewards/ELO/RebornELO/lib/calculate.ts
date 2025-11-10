import { calculateAntELOCubeBlessing } from '../../../../../../../Cubes'
import { player } from '../../../../../../../Synergism'
import { getTalismanEffects } from '../../../../../../../Talismans'
import { AntProducers } from '../../../../../structs/structs'
import { calculateEffectiveAntELO } from '../../AntELO/lib/calculate'
import { thresholdModifiers } from '../Stages/lib/threshold'

export const calculateAvailableRebornELO = () => {
  const pool = player.ants.immortalELO
  const alreadyActivated = player.ants.rebornELO
  return Math.max(0, pool - alreadyActivated)
}

export const rebornELOCreationSpeedMult = () => {
  let multiplier = 0.001
  const eloMultiplier = calculateEffectiveAntELO() + 1000
  multiplier *= eloMultiplier
  if (player.ants.producers[AntProducers.Queens].purchased > 0) {
    multiplier *= 1.15
  }
  if (player.ants.producers[AntProducers.LordRoyals].purchased > 0) {
    multiplier *= 1.25
  }
  if (player.ants.producers[AntProducers.Almighties].purchased > 0) {
    multiplier *= 1.4
  }
  if (player.ants.producers[AntProducers.Disciples].purchased > 0) {
    multiplier *= 2
  }
  if (player.ants.producers[AntProducers.HolySpirit].purchased > 0) {
    multiplier *= 3
  }
  multiplier *= 1 + 0.1 * player.upgrades[124]
  multiplier *= calculateAntELOCubeBlessing()
  multiplier *= 1 + player.researches[110] / 50
  multiplier *= 1 + player.researches[148] / 50
  multiplier *= 1 + player.platonicUpgrades[12] / 10
  multiplier *= getTalismanEffects('mortuus').antBonus
  multiplier *= thresholdModifiers().rebornSpeedMult
  return multiplier
}
