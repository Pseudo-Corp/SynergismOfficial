import type Decimal from 'break_infinity.js'
import type { AntSacrificeTiers } from '../../../../Reset'

export enum AntUpgrades {
  AntSpeed = 0,
  Coins = 1,
  Taxes = 2,
  AcceleratorBoosts = 3,
  Multipliers = 4,
  Offerings = 5,
  BuildingCostScale = 6,
  Salvage = 7,
  FreeRunes = 8,
  Obtainium = 9,
  AntSacrifice = 10,
  Mortuus = 11
}

export const LAST_ANT_UPGRADE = AntUpgrades.Mortuus

export type AntUpgradeTypeMap = {
  [AntUpgrades.AntSpeed]: { antSpeed: Decimal }
  [AntUpgrades.Coins]: {
    crumbToCoinExp: number
    coinMultiplier: Decimal
  }
  [AntUpgrades.Taxes]: { taxReduction: number }
  [AntUpgrades.AcceleratorBoosts]: { acceleratorBoostMult: number }
  [AntUpgrades.Multipliers]: { multiplierMult: number }
  [AntUpgrades.Offerings]: { offeringMult: number }
  [AntUpgrades.BuildingCostScale]: { buildingCostScale: number }
  [AntUpgrades.Salvage]: { salvage: number }
  [AntUpgrades.FreeRunes]: { freeRuneLevel: number }
  [AntUpgrades.Obtainium]: { obtainiumMult: number }
  [AntUpgrades.AntSacrifice]: { antSacrificeMultiplier: number }
  [AntUpgrades.Mortuus]: {
    talismanUnlock: boolean
    globalSpeed: number
  }
}

export interface AntUpgradeData<K extends AntUpgrades> {
  baseCost: Decimal
  costIncrease: number
  antUpgradeHTML: {
    color: string
  }
  minimumResetTier: AntSacrificeTiers
  name: () => string
  intro: () => string
  description: () => string
  effect: (n: number) => AntUpgradeTypeMap[K]
  effectDescription: () => string
}
