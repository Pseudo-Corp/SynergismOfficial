import type { TalismanCraftItems } from '../../../../../Talismans'

export const talismanItemRequiredELO: Record<TalismanCraftItems, number> = {
  shard: 0,
  commonFragment: 300,
  uncommonFragment: 600,
  rareFragment: 1200,
  epicFragment: 2000,
  legendaryFragment: 7500,
  mythicalFragment: 7500
}

export const talismanRewardMultipliers: Record<TalismanCraftItems, number> = {
  shard: 1,
  commonFragment: 0.4,
  uncommonFragment: 0.1,
  rareFragment: 0.06,
  epicFragment: 0.02,
  legendaryFragment: 0.0008,
  mythicalFragment: 0.0001
}
