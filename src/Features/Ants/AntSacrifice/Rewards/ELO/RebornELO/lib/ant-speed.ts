import Decimal from 'break_infinity.js'
import { player } from '../../../../../../../Synergism'

export const calculateAntSpeedMultFromELO = () => {
  return Decimal.pow(1.02, player.ants.rebornELO)
}
