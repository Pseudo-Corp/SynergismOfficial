import Decimal from 'break_infinity.js'
import type { TalismanCraftItems } from '../../../../../Talismans'
import { talismanItemRequiredELO, talismanRewardMultipliers } from './constants'

export const calculateAntSacrificeTalismanItem = (
  item: TalismanCraftItems,
  elo: number,
  rewardMult: Decimal,
  stageMult: number
): Decimal => {
  if (elo < talismanItemRequiredELO[item]) {
    return Decimal.fromString('0')
  } else {
    return Decimal.fromDecimal(rewardMult)
      .times(elo - talismanItemRequiredELO[item] + 1)
      .times(stageMult)
      .times(talismanRewardMultipliers[item])
  }
}
