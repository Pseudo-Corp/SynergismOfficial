import type Decimal from 'break_infinity.js'
import type { TalismanCraftItems } from '../../../../Talismans'

export interface AntSacrificeRewards {
  immortalELO: number
  offerings: Decimal
  obtainium: Decimal
  talismanCraftItems: Record<TalismanCraftItems, Decimal>
}
