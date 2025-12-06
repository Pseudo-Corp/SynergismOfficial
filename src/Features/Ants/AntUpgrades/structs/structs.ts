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
  Mortuus = 11,
  AntELO = 12,
  WowCubes = 13,
  AscensionScore = 14,
  Mortuus2 = 15
}

export const LAST_ANT_UPGRADE = AntUpgrades.Mortuus2

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
  [AntUpgrades.BuildingCostScale]: { buildingCostScale: number; buildingPowerMult: number }
  [AntUpgrades.Salvage]: { salvage: number }
  [AntUpgrades.FreeRunes]: { freeRuneLevel: number }
  [AntUpgrades.Obtainium]: { obtainiumMult: number }
  [AntUpgrades.AntSacrifice]: {
    antSacrificeMultiplier: number
    elo: number
  }
  [AntUpgrades.Mortuus]: {
    talismanUnlock: boolean
    globalSpeed: number
  }
  [AntUpgrades.AntELO]: {
    antELO: number
    antSacrificeLimitCount: number
  }
  [AntUpgrades.Mortuus2]: {
    talismanLevelIncreaser: number
    talismanEffectBuff: number
    ascensionSpeed: number
  }
  [AntUpgrades.AscensionScore]: {
    cubesBanked: number
    ascensionScoreBase: number
  }
  [AntUpgrades.WowCubes]: {
    wowCubes: number
  }
}

export interface AntUpgradeData<K extends AntUpgrades> {
  baseCost: Decimal
  costIncreaseExponent: number
  antUpgradeHTML: {
    color: string
  }
  minimumResetTier: AntSacrificeTiers
  exemptFromCorruption: boolean
  autobuy: () => boolean
  name: () => string
  intro: () => string
  description: () => string
  effect: (n: number) => AntUpgradeTypeMap[K]
  effectDescription: () => string
  lockedAutoDescription: () => string
}
