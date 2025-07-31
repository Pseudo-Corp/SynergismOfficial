import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { achievementPoints, awardUngroupedAchievement, getAchievementReward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { isShopTalismanUnlocked } from './Calculate'
import { CalcECC } from './Challenges'
import { getOcteractUpgradeEffect } from './Octeracts'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { resetTiers, type RuneKeys } from './Runes'
import { allTalismanRuneBonusStatsSum } from './Statistics'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Tabs } from './Tabs'
import { assert } from './Utility'
import { Globals as G } from './Variables'
import { getLevelMilestone } from './Levels'

interface TalismanFragmentCost {
  obtainium: number
  offerings: number
}

export type TalismanCraftItems =
  | 'shard'
  | 'commonFragment'
  | 'uncommonFragment'
  | 'rareFragment'
  | 'epicFragment'
  | 'legendaryFragment'
  | 'mythicalFragment'

const talismanResourceCosts: Record<TalismanCraftItems, TalismanFragmentCost> = {
  shard: {
    obtainium: 1e13,
    offerings: 1e2
  },
  commonFragment: {
    obtainium: 1e14,
    offerings: 1e4
  },
  uncommonFragment: {
    obtainium: 1e16,
    offerings: 1e5
  },
  rareFragment: {
    obtainium: 1e18,
    offerings: 1e6
  },
  epicFragment: {
    obtainium: 1e20,
    offerings: 1e7
  },
  legendaryFragment: {
    obtainium: 1e22,
    offerings: 1e8
  },
  mythicalFragment: {
    obtainium: 1e24,
    offerings: 1e9
  }
}

export type TalismanRuneBonus = Record<RuneKeys, number>

type TalismanTypeMap = {
  exemption: { taxReduction: number; duplicationOOMBonus: number }
  chronos: { globalSpeed: number; speedOOMBonus: number }
  midas: { blessingBonus: number; thriftOOMBonus: number }
  metaphysics: { talismanEffect: number; extraTalismanEffect: number }
  polymath: { ascensionSpeedBonus: number; SIOOMBonus: number }
  mortuus: { antBonus: number; prismOOMBonus: number }
  plastic: { quarkBonus: number }
  wowSquare: { evenDimBonus: number; oddDimBonus: number }
  achievement: { positiveSalvageMult: number; negativeSalvageMult: number }
  cookieGrandma: { freeCorruptionLevel: number; cookieSix: boolean }
  horseShoe: { luckPercentage: number; redLuck: number }
}

export type TalismanKeys = keyof TalismanTypeMap

export const noTalismanFragments: Record<TalismanCraftItems, number> = {
  shard: 0,
  commonFragment: 0,
  uncommonFragment: 0,
  rareFragment: 0,
  epicFragment: 0,
  legendaryFragment: 0,
  mythicalFragment: 0
}

const rarityValues: Record<number, number> = {
  0: 0,
  1: 1,
  2: 1.2,
  3: 1.5,
  4: 1.8,
  5: 2.1,
  6: 2.5,
  7: 3,
  8: 3.25,
  9: 3.5,
  10: 4
}

interface TalismanData<K extends TalismanKeys> {
  level: number
  rarity: number
  baseMult: number
  maxLevel: number
  costs: (this: void, baseMult: number, level: number) => Record<TalismanCraftItems, number>
  levelCapIncrease: () => number
  effects(n: number): TalismanTypeMap[K]
  inscriptionDesc(n: number): string
  signatureDesc(n: number): string
  isUnlocked: () => boolean
  minimalResetTier: keyof typeof resetTiers
  talismanBaseCoefficient: TalismanRuneBonus
  name: () => string
  description: () => string

  // Field that is stored in the player
  fragmentsInvested: Record<TalismanCraftItems, number>
}

const regularCostProgression = (baseMult: number, level: number): Record<TalismanCraftItems, number> => {
  let priceMult = baseMult
  if (level >= 120) {
    priceMult *= (level - 90) / 30
  }
  if (level >= 150) {
    priceMult *= (level - 120) / 30
  }
  if (level >= 180) {
    priceMult *= (level - 170) / 10
  }

  return {
    'shard': priceMult * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(level, 3))),
    'commonFragment': level >= 30 ? priceMult * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(level - 30, 3))) : 0,
    'uncommonFragment': level >= 60 ? priceMult * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(level - 60, 3))) : 0,
    'rareFragment': level >= 90 ? priceMult * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(level - 90, 3))) : 0,
    'epicFragment': level >= 120 ? priceMult * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(level - 120, 3))) : 0,
    'legendaryFragment': level >= 150 ? priceMult * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(level - 150, 3))) : 0,
    'mythicalFragment': level >= 150 ? priceMult * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(level - 150, 3))) : 0
  }
}

const exponentialCostProgression = (baseMult: number, level: number): Record<TalismanCraftItems, number> => {
  return {
    shard: Math.floor(baseMult * Math.pow(1.12, level) * 100),
    commonFragment: level >= 30 ? Math.floor(baseMult * Math.pow(1.12, level - 30) * 50) : 0,
    uncommonFragment: level >= 60 ? Math.floor(baseMult * Math.pow(1.12, level - 60) * 25) : 0,
    rareFragment: level >= 90 ? Math.floor(baseMult * Math.pow(1.12, level - 90) * 20) : 0,
    epicFragment: level >= 120 ? Math.floor(baseMult * Math.pow(1.12, level - 120) * 15) : 0,
    legendaryFragment: level >= 150 ? Math.floor(baseMult * Math.pow(1.12, level - 150) * 10) : 0,
    mythicalFragment: level >= 150 ? Math.floor(baseMult * Math.pow(1.12, level - 150) * 5) : 0
  }
}

export const universalTalismanMaxLevelIncreasers = () => {
  return (
    6 * CalcECC('ascension', player.challengecompletions[13])
    + Math.floor(player.researches[200] / 400)
    + +player.singularityChallenges.noOfferingPower.rewards.talismanFreeLevel
    + getOcteractUpgradeEffect('octeractTalismanLevelCap1')
    + getOcteractUpgradeEffect('octeractTalismanLevelCap2')
    + getOcteractUpgradeEffect('octeractTalismanLevelCap3')
    + getOcteractUpgradeEffect('octeractTalismanLevelCap4')
  )
}

export const metaphysicsTalismanMaxLevelIncreasers = () => {
  return player.cubeUpgrades[67] > 0 ? 1337 : 0
}

export const plasticTalismanMaxLevelIncreasers = () => {
  return PCoinUpgradeEffects.INSTANT_UNLOCK_1 ? 10 : 0
}

export const talismans: { [K in TalismanKeys]: TalismanData<K> } = {
  exemption: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1,
    maxLevel: 180,
    costs: regularCostProgression,
    levelCapIncrease: () => universalTalismanMaxLevelIncreasers(),
    effects: (n) => {
      const inscriptValues = [0, -0.2, -0.3, -0.4, -0.45, -0.5, -0.55, -0.6, -0.61, -0.62, -0.65]
      const duplicationBonus = (n >= 6) ? 12 : 0
      return {
        taxReduction: inscriptValues[n] ?? 0,
        duplicationOOMBonus: duplicationBonus
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [0, -0.2, -0.3, -0.4, -0.45, -0.5, -0.55, -0.6, -0.61, -0.62, -0.65]
      return i18next.t('runes.talismans.exemption.inscription', {
        val: format(1 + (inscriptValues[n] ?? 1), 2, true)
      })
    },
    signatureDesc: (n) => {
      const duplicationBonus = (n >= 6) ? 12 : 0
      return i18next.t('runes.talismans.exemption.signature', {
        val: format(duplicationBonus, 0, true)
      })
    },
    talismanBaseCoefficient: {
      speed: 0,
      duplication: 1.5,
      prism: 0.75,
      thrift: 0.75,
      superiorIntellect: 0,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return player.unlocks.talismans
    },
    name: () => i18next.t('runes.talismans.exemption.name'),
    description: () => i18next.t('runes.talismans.exemption.description')
  },
  chronos: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 10,
    maxLevel: 180,
    costs: regularCostProgression,
    levelCapIncrease: () => universalTalismanMaxLevelIncreasers(),
    effects: (n) => {
      const inscriptValues = [1, 1.04, 1.08, 1.12, 1.16, 1.20, 1.25, 1.30, 1.325, 1.35, 1.4]
      const speedBonus = (n >= 6) ? 12 : 0
      return {
        globalSpeed: inscriptValues[n] ?? 1,
        speedOOMBonus: speedBonus
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1.04, 1.08, 1.12, 1.16, 1.20, 1.25, 1.30, 1.325, 1.35, 1.4]
      return i18next.t('runes.talismans.chronos.inscription', {
        val: formatAsPercentIncrease(inscriptValues[n] ?? 1, 0)
      })
    },
    signatureDesc: (n) => {
      const speedBonus = (n >= 6) ? 12 : 0
      return i18next.t('runes.talismans.chronos.signature', {
        val: format(speedBonus, 0, true)
      })
    },
    talismanBaseCoefficient: {
      speed: 1.5,
      duplication: 0,
      prism: 0,
      thrift: 0.75,
      superiorIntellect: 0.75,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return Boolean(getAchievementReward('chronosTalisman'))
    },
    name: () => i18next.t('runes.talismans.chronos.name'),
    description: () => i18next.t('runes.talismans.chronos.description')
  },
  midas: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1e4,
    maxLevel: 180,
    costs: regularCostProgression,
    levelCapIncrease: () => universalTalismanMaxLevelIncreasers(),
    effects: (n) => {
      const inscriptValues = [1, 1.04, 1.08, 1.12, 1.16, 1.20, 1.25, 1.30, 1.325, 1.35, 1.40]
      const thriftBonus = (n >= 6) ? 12 : 0
      return {
        blessingBonus: inscriptValues[n] ?? 1,
        thriftOOMBonus: thriftBonus
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1.04, 1.08, 1.12, 1.16, 1.20, 1.25, 1.30, 1.325, 1.35, 1.40]
      return i18next.t('runes.talismans.midas.inscription', {
        val: formatAsPercentIncrease(inscriptValues[n] ?? 1, 0)
      })
    },
    signatureDesc: (n) => {
      const thriftBonus = (n >= 6) ? 12 : 0
      return i18next.t('runes.talismans.midas.signature', {
        val: format(thriftBonus, 0, true)
      })
    },
    talismanBaseCoefficient: {
      speed: 0,
      duplication: 0.75,
      prism: 0.75,
      thrift: 1.5,
      superiorIntellect: 0,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return Boolean(getAchievementReward('midasTalisman'))
    },
    name: () => i18next.t('runes.talismans.midas.name'),
    description: () => i18next.t('runes.talismans.midas.description')
  },
  metaphysics: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1e8,
    maxLevel: 180,
    costs: regularCostProgression,
    levelCapIncrease: () => {
      return universalTalismanMaxLevelIncreasers() + metaphysicsTalismanMaxLevelIncreasers()
    },
    effects: (n) => {
      const inscriptValues = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]
      const signatureValue = (n >= 6) ? 1.07 : 1
      return {
        talismanEffect: inscriptValues[n] ?? 1,
        extraTalismanEffect: signatureValue
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]
      return i18next.t('runes.talismans.metaphysics.inscription', {
        val: formatAsPercentIncrease(1 + (inscriptValues[n] ?? 1), 0)
      })
    },
    signatureDesc: (n) => {
      const signatureValue = (n >= 6) ? 1.07 : 1
      return i18next.t('runes.talismans.metaphysics.signature', {
        val: formatAsPercentIncrease(signatureValue, 2)
      })
    },
    talismanBaseCoefficient: {
      speed: 0.6,
      duplication: 0.6,
      prism: 0.6,
      thrift: 0.6,
      superiorIntellect: 0.6,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return Boolean(getAchievementReward('metaphysicsTalisman'))
    },
    name: () => i18next.t('runes.talismans.metaphysics.name'),
    description: () => i18next.t('runes.talismans.metaphysics.description')
  },
  polymath: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1e16,
    maxLevel: 180,
    costs: regularCostProgression,
    levelCapIncrease: () => universalTalismanMaxLevelIncreasers(),
    effects: (n) => {
      const inscriptValues = [1, 1.04, 1.08, 1.12, 1.16, 1.20, 1.25, 1.30, 1.325, 1.35, 1.40]
      const SIOOMBonus = (n >= 6) ? 12 : 0
      return {
        ascensionSpeedBonus: inscriptValues[n] ?? 1,
        SIOOMBonus: SIOOMBonus
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1.04, 1.08, 1.12, 1.16, 1.20, 1.25, 1.30, 1.325, 1.35, 1.40]
      return i18next.t('runes.talismans.polymath.inscription', {
        val: formatAsPercentIncrease(inscriptValues[n] ?? 1, 0)
      })
    },
    signatureDesc: (n) => {
      const SIOOMBonus = (n >= 6) ? 12 : 0
      return i18next.t('runes.talismans.polymath.signature', {
        val: format(SIOOMBonus, 0, true)
      })
    },
    talismanBaseCoefficient: {
      speed: 0.75,
      duplication: 0.75,
      prism: 0,
      thrift: 0,
      superiorIntellect: 1.5,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return Boolean(getAchievementReward('polymathTalisman'))
    },
    name: () => i18next.t('runes.talismans.polymath.name'),
    description: () => i18next.t('runes.talismans.polymath.description')
  },
  mortuus: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 100,
    maxLevel: 180,
    costs: regularCostProgression,
    levelCapIncrease: () => universalTalismanMaxLevelIncreasers(),
    effects: (n) => {
      const inscriptValues = [1, 1.02, 1.04, 1.06, 1.07, 1.08, 1.09, 1.10, 1.11, 1.125, 1.15]
      const prismOOMBonus = (n >= 6) ? 12 : 0
      return {
        antBonus: inscriptValues[n] ?? 1,
        prismOOMBonus: prismOOMBonus
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1.02, 1.04, 1.06, 1.07, 1.08, 1.09, 1.10, 1.11, 1.125, 1.15]
      return i18next.t('runes.talismans.mortuus.inscription', {
        val: formatAsPercentIncrease(inscriptValues[n] ?? 1, 0)
      })
    },
    signatureDesc: (n) => {
      const prismOOMBonus = (n >= 6) ? 12 : 0
      return i18next.t('runes.talismans.mortuus.signature', {
        val: format(prismOOMBonus, 0, true)
      })
    },
    talismanBaseCoefficient: {
      speed: 0.6,
      duplication: 0.6,
      prism: 0.6,
      thrift: 0.6,
      superiorIntellect: 0.6,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return player.antUpgrades[11]! > 0 || player.ascensionCount > 0
    },
    name: () => i18next.t('runes.talismans.mortuus.name'),
    description: () => i18next.t('runes.talismans.mortuus.description')
  },
  plastic: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1e5,
    maxLevel: 180,
    costs: regularCostProgression,
    levelCapIncrease: () => {
      return universalTalismanMaxLevelIncreasers() + plasticTalismanMaxLevelIncreasers()
    },
    effects: (n) => {
      const inscriptValues = [1, 1.005, 1.01, 1.015, 1.02, 1.025, 1.03, 1.04, 1.045, 1.05, 1.0666]
      return {
        quarkBonus: inscriptValues[n] ?? 1
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1.005, 1.01, 1.015, 1.02, 1.025, 1.03, 1.04, 1.045, 1.05, 1.0666]
      return i18next.t('runes.talismans.plastic.inscription', {
        val: formatAsPercentIncrease(inscriptValues[n] ?? 1, 2)
      })
    },
    signatureDesc: () => i18next.t('runes.talismans.plastic.signature'),
    talismanBaseCoefficient: {
      speed: 0.75,
      duplication: 0,
      prism: 1.5,
      thrift: 0,
      superiorIntellect: 0.75,
      infiniteAscent: 0.005,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return isShopTalismanUnlocked()
    },
    name: () => i18next.t('runes.talismans.plastic.name'),
    description: () => i18next.t('runes.talismans.plastic.description')
  },
  wowSquare: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    maxLevel: 210,
    baseMult: 1e30,
    costs: exponentialCostProgression,
    levelCapIncrease: () => universalTalismanMaxLevelIncreasers(),
    effects: (n) => {
      const inscriptValues = [1, 1.025, 1.05, 1.075, 1.1, 1.125, 1.15, 1.2, 1.225, 1.25, 1.30]
      return {
        evenDimBonus: inscriptValues[n] ?? 1,
        oddDimBonus: n >= 6 ? 1.20 : 1
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1.025, 1.05, 1.075, 1.1, 1.125, 1.15, 1.2, 1.225, 1.25, 1.30]
      return i18next.t('runes.talismans.wowSquare.inscription', {
        val: formatAsPercentIncrease(inscriptValues[n] ?? 1, 0)
      })
    },
    signatureDesc: () => i18next.t('runes.talismans.wowSquare.signature'),
    talismanBaseCoefficient: {
      speed: 0,
      duplication: 1,
      prism: 1,
      thrift: 0,
      superiorIntellect: 1,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'ascension',
    isUnlocked: () => {
      return player.ascensionCount >= 100
    },
    name: () => i18next.t('runes.talismans.wowSquare.name'),
    description: () => i18next.t('runes.talismans.wowSquare.description')
  },
  achievement: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1e50,
    maxLevel: 40,
    costs: exponentialCostProgression,
    levelCapIncrease: () => getLevelMilestone('achievementTalismanEnhancement'),
    effects: (n) => {
      const inscriptValues = [0, 0.001, 0.002, 0.003, 0.004, 0.006, 0.008, .01, .015, .02, .03]
      const signatureValue = (n >= 6) ? -0.02 : 0
      return {
        positiveSalvageMult: inscriptValues[n] ?? 1,
        negativeSalvageMult: signatureValue
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [1, 1, 1, 1, 1, 1, 1, 1.01, 1.015, 1.02, 1.03]
      return i18next.t('runes.talismans.achievement.inscription', {
        val: formatAsPercentIncrease(inscriptValues[n] ?? 1, 1)
      })
    },
    signatureDesc: (n) => {
      const negativeSalvageMult = (n >= 6) ? 0.98 : 1
      return i18next.t('runes.talismans.achievement.signature', {
        val: formatAsPercentIncrease(negativeSalvageMult, 0)
      })
    },
    talismanBaseCoefficient: {
      speed: 1.4,
      duplication: 1.4,
      prism: 1.4,
      thrift: 1.4,
      superiorIntellect: 1.4,
      infiniteAscent: 0.01,
      antiquities: 0,
      horseShoe: 0
    },
    minimalResetTier: 'singularity',
    isUnlocked: () => {
      return getLevelMilestone('achievementTalismanUnlock') === 1
    },
    name: () => i18next.t('runes.talismans.achievement.name'),
    description: () => i18next.t('runes.talismans.achievement.description', {
      num: achievementPoints
    })
  },
  cookieGrandma: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1e290,
    maxLevel: 60,
    costs: exponentialCostProgression,
    levelCapIncrease: () => 0,
    effects: (n) => {
      const inscriptValues = [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.15, 0.16, 0.175]
      const cookiesSix = n >= 6
      return {
        freeCorruptionLevel: inscriptValues[n] ?? 0,
        cookieSix: cookiesSix
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.15, 0.16, 0.175]
      return i18next.t('runes.talismans.cookieGrandma.inscription', {
        val: format(inscriptValues[n] ?? 0, 3)
      })
    },
    signatureDesc: () => i18next.t('runes.talismans.cookieGrandma.signature'),
    talismanBaseCoefficient: {
      speed: 1,
      duplication: 1,
      prism: 1,
      thrift: 1,
      superiorIntellect: 1,
      infiniteAscent: 0.01,
      antiquities: 0.01,
      horseShoe: 0
    },
    minimalResetTier: 'never',
    isUnlocked: () => {
      return player.cubeUpgrades[80] > 0
    },
    name: () => i18next.t('runes.talismans.cookieGrandma.name'),
    description: () => i18next.t('runes.talismans.cookieGrandma.description')
  },
  horseShoe: {
    level: 0,
    rarity: 0,
    fragmentsInvested: { ...noTalismanFragments },
    baseMult: 1e290,
    maxLevel: 100,
    costs: exponentialCostProgression,
    levelCapIncrease: () => 0,
    effects: (n) => {
      const inscriptValues = [0, 0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.055, 0.06, 0.077]
      const signatureValue = (n >= 6) ? 40 : 0
      return {
        luckPercentage: inscriptValues[n] ?? 0,
        redLuck: signatureValue
      }
    },
    inscriptionDesc: (n) => {
      const inscriptValues = [0, 0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.055, 0.06, 0.077]
      return i18next.t('runes.talismans.horseShoe.inscription', {
        val: format(100 * (inscriptValues[n] ?? 0), 2)
      })
    },
    signatureDesc: (n) => {
      const signatureValue = (n >= 6) ? 40 : 0
      return i18next.t('runes.talismans.horseShoe.signature', {
        val: format(signatureValue, 0, true)
      })
    },
    talismanBaseCoefficient: {
      speed: 1.2,
      duplication: 1.2,
      prism: 1.2,
      thrift: 1.2,
      superiorIntellect: 1.2,
      infiniteAscent: 0,
      antiquities: 0,
      horseShoe: 0.01
    },
    minimalResetTier: 'never',
    isUnlocked: () => {
      return Boolean(player.singularityChallenges.noOfferingPower.rewards.talismanUnlock)
    },
    name: () => i18next.t('runes.talismans.horseShoe.name'),
    description: () => i18next.t('runes.talismans.horseShoe.description')
  }
}

export const getTalismanCostTNL = (t: TalismanKeys) => {
  return talismans[t].costs(talismans[t].baseMult, talismans[t].level)
}

export const getTalismanLevelCap = (t: TalismanKeys) => {
  return talismans[t].maxLevel + talismans[t].levelCapIncrease()
}

export const setTalismanRarity = (t: TalismanKeys) => {
  if (!talismans[t].isUnlocked()) {
    talismans[t].rarity = 0
    return
  }

  // Since the actual level cap depends on
  // level cap increasers, this can be greater than 1
  const levelRatio = talismans[t].level / talismans[t].maxLevel

  let extraRarity = 0
  if (levelRatio >= 1) {
    if (levelRatio >= 2) {
      extraRarity += 1
    }
    if (levelRatio >= 4) {
      extraRarity += 1
    }
    if (levelRatio >= 8) {
      extraRarity += 1
    }
  }

  talismans[t].rarity = 1 + Math.min(6, Math.floor(6 * levelRatio)) + extraRarity
}

export const levelsUntilRarityIncrease = (t: TalismanKeys) => {
  const level = talismans[t].level
  const maxLevel = talismans[t].maxLevel
  if (level >= maxLevel) {
    // This ignores rarity above 7...
    // And just tries to level to cap
    return getTalismanLevelCap(t) - level
  } else {
    const currentRarity = talismans[t].rarity
    const levelReq = Math.ceil(maxLevel * currentRarity / 6)
    return levelReq - level
  }
}

export const affordableNextLevel = (t: TalismanKeys, budget: Record<TalismanCraftItems, number>): boolean => {
  const costs = talismans[t].costs(talismans[t].baseMult, talismans[t].level)

  for (const item in costs) {
    if (costs[item as TalismanCraftItems] > budget[item as TalismanCraftItems]) {
      return false
    }
  }
  return true
}

export const updateTalismanLevelAndSpentFromInvested = (t: TalismanKeys): void => {
  let level = 0
  const budget = { ...player.talismans[t] }
  talismans[t].fragmentsInvested = { ...player.talismans[t] }
  const trueLevelCap = getTalismanLevelCap(t)

  let nextCost = talismans[t].costs(talismans[t].baseMult, level)

  let canAffordNextLevel = affordableNextLevel(t, budget)
  while (canAffordNextLevel) {
    for (const item in nextCost) {
      budget[item as TalismanCraftItems] -= nextCost[item as TalismanCraftItems]
    }
    level += 1
    nextCost = talismans[t].costs(talismans[t].baseMult, level)

    if (level >= trueLevelCap) {
      break
    }

    canAffordNextLevel = affordableNextLevel(t, budget)
  }

  talismans[t].level = level
  setTalismanRarity(t)
}

export const updateTalismanRarities = (): void => {
  for (const t of Object.keys(talismans) as TalismanKeys[]) {
    if (talismans[t].isUnlocked()) {
      setTalismanRarity(t)
    }
  }
}

export const getPlayerTalismanBudget = () => {
  return {
    shard: player.talismanShards,
    commonFragment: player.commonFragments,
    uncommonFragment: player.uncommonFragments,
    rareFragment: player.rareFragments,
    epicFragment: player.epicFragments,
    legendaryFragment: player.legendaryFragments,
    mythicalFragment: player.mythicalFragments
  }
}

export const buyTalismanLevel = (t: TalismanKeys, fromMultibuy = false): void => {
  if (!talismans[t].isUnlocked()) {
    return
  }

  if (talismans[t].level >= getTalismanLevelCap(t)) {
    return
  }

  const costs = talismans[t].costs(talismans[t].baseMult, talismans[t].level)
  const budget = getPlayerTalismanBudget()
  const canAffordNextLevel = affordableNextLevel(t, budget)

  if (canAffordNextLevel) {
    player.talismanShards -= costs.shard
    player.commonFragments -= costs.commonFragment
    player.uncommonFragments -= costs.uncommonFragment
    player.rareFragments -= costs.rareFragment
    player.epicFragments -= costs.epicFragment
    player.legendaryFragments -= costs.legendaryFragment
    player.mythicalFragments -= costs.mythicalFragment

    for (const item in costs) {
      talismans[t].fragmentsInvested[item as TalismanCraftItems] += costs[item as TalismanCraftItems]
    }

    talismans[t].level += 1
  }

  if (!fromMultibuy) {
    updateTalismanCostHTML(t)
    updateTalismanInventory()
    setTalismanRarity(t)
  }
}

export const buyTalismanLevelToRarityIncrease = (t: TalismanKeys, auto = false): void => {
  const levelsToBuy = levelsUntilRarityIncrease(t)
  if (levelsToBuy > 0) {
    for (let i = 0; i < levelsToBuy; i++) {
      const budget = getPlayerTalismanBudget()
      if (!affordableNextLevel(t, budget)) {
        break
      }
      buyTalismanLevel(t, true)
    }
  }

  if (!auto) {
    updateTalismanCostHTML(t)
  }
  updateTalismanInventory()
  setTalismanRarity(t)
}

export const buyTalismanLevelToMax = (t: TalismanKeys): void => {
  const trueLevelCap = getTalismanLevelCap(t)
  const levelsToBuy = trueLevelCap - talismans[t].level
  if (levelsToBuy > 0) {
    for (let i = 0; i < levelsToBuy; i++) {
      const budget = getPlayerTalismanBudget()
      if (!affordableNextLevel(t, budget)) {
        break
      }
      buyTalismanLevel(t, true)
    }
  }

  updateTalismanCostHTML(t)
  updateTalismanInventory()
  setTalismanRarity(t)
}

export const getRuneBonusFromIndividualTalisman = (t: TalismanKeys, rune: RuneKeys): number => {
  const talisman = talismans[t]
  if (!talisman.isUnlocked()) {
    return 0
  }

  let metaPhysicsMult = 1
  if (t === 'metaphysics') {
    metaPhysicsMult *= (talisman.effects(talisman.rarity) as TalismanTypeMap['metaphysics']).talismanEffect
    metaPhysicsMult *= (talisman.effects(talisman.rarity) as TalismanTypeMap['metaphysics']).extraTalismanEffect
  }

  return talisman.talismanBaseCoefficient[rune] * metaPhysicsMult * talisman.level * rarityValues[talisman.rarity]
}

export const getRuneBonusFromAllTalismans = (rune: RuneKeys): number => {
  const specialMultiplier = allTalismanRuneBonusStatsSum()
  let totalBonus = 0
  for (const t of Object.keys(talismans) as TalismanKeys[]) {
    totalBonus += getRuneBonusFromIndividualTalisman(t, rune)
  }

  return totalBonus * specialMultiplier
}

export const getTalismanEffects = <T extends TalismanKeys>(
  t: T
): TalismanTypeMap[T] => {
  return talismans[t].effects(talismans[t].rarity)
}

export const talismanRarityInfo = (t: TalismanKeys): void => {

  DOMCacheGetOrSet('rarityInfoTexts').style.display = 'block'

  const title = `<span style="color: lightgoldenrodyellow">${i18next.t('runes.talismans.rarityInfo.title', {
    talismanName: String(i18next.t(`runes.talismans.${t}.name`))
  })}
  </span>`

  const levelCap = talismans[t].maxLevel
  const rarity = talismans[t].rarity

  const common = `<span style="color: white">${i18next.t('runes.talismans.rarityInfo.common')} <span class="rarityReqNum">
  ${rarity === 1 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.default')}
  </span>
  </span>`

  const uncommon = `<span style="color: limegreen">${i18next.t('runes.talismans.rarityInfo.uncommon')} <span class="rarityReqNum">
  ${rarity === 2 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(Math.ceil(levelCap / 6), 0, true)
  })}
  </span>
  </span>`

  const rare = `<span style="color: lightblue">${i18next.t('runes.talismans.rarityInfo.rare')} <span class="rarityReqNum">
  ${rarity === 3 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(Math.ceil(levelCap / 3), 0, true)
  })}
  </span>
  </span>`
 
  const epic = `<span style="color: plum">${i18next.t('runes.talismans.rarityInfo.epic')} <span class="rarityReqNum">
  ${rarity === 4 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(Math.ceil(levelCap / 2), 0, true)
  })}
  </span>
  </span>`

  const legendary = `<span style="color: darkorange">${i18next.t('runes.talismans.rarityInfo.legendary')} <span class="rarityReqNum">
  ${rarity === 5 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(Math.ceil(levelCap * 2 / 3), 0, true)
  })}
  </span>
  </span>`

  const mythic = `<span style="color: crimson">${i18next.t('runes.talismans.rarityInfo.mythic')} <span class="rarityReqNum">
  ${rarity === 6 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(Math.ceil(levelCap * 5 / 6), 0, true)
  })}
  </span>
  </span>`
  
  const extraordinary = `<span style="color: violet">${i18next.t('runes.talismans.rarityInfo.extraordinary')} <span class="rarityReqNum">
  ${rarity === 7 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(levelCap, 0, true)
  })}
  </span>
  </span>`
  
  const godlike = `<span style="color: lightcoral">${i18next.t('runes.talismans.rarityInfo.godlike')} <span class="rarityReqNum">
  ${rarity === 8 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(2 * levelCap, 0, true)
  })}
  </span>
  </span>`

  const perfect = `<span style="color: gold">${i18next.t('runes.talismans.rarityInfo.perfect')} <span class="rarityReqNum">
  ${rarity === 9 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(4 * levelCap, 0, true)
  })}
  </span>
  </span>`

  const immaculate = `<span class="rainbowText">${i18next.t('runes.talismans.rarityInfo.immaculate')} <span class="rarityReqNum rainbowText">
  ${rarity === 10 ? '▶ ' : ''}
  ${i18next.t('runes.talismans.rarityInfo.levelReq', {
    level: format(8 * levelCap, 0, true)
  })}
  </span>
  </span>`

  DOMCacheGetOrSet('rarityInfoMultiline').innerHTML = `${title}<br>${common}<br>${uncommon}
  <br>${rare}<br>${epic}<br>${legendary}
  <br>${mythic}<br>${extraordinary}<br>${godlike}
  <br>${perfect}<br>${immaculate}`
}

export const talismanToStringHTML = (t: TalismanKeys): void => {
  assert(G.currentTab === Tabs.Runes, 'Talisman updateRewardHTML called outside of Runes tab')
  const talisman = talismans[t]
  DOMCacheGetOrSet('talismanLevelUpCost').style.display = 'none'
  DOMCacheGetOrSet('talismanEffect').style.display = 'block'

  DOMCacheGetOrSet('talismanTitle').innerHTML = `${talisman.name()} - ${
    i18next.t(`runes.talismans.rarity.${talisman.rarity}`)
  }`
  DOMCacheGetOrSet('talismanDescription').innerHTML = talisman.description()

  /*const speedHTML = DOMCacheGetOrSet('talismanSpeedEffect')
    const duplicationHTML = DOMCacheGetOrSet('talismanDupeEffect')
    const prismHTML = DOMCacheGetOrSet('talismanPrismEffect')
    const thriftHTML = DOMCacheGetOrSet('talismanThriftEffect')
    const sIHTML = DOMCacheGetOrSet('talismanSIEffect')
    const iAHTML = DOMCacheGetOrSet('talismanIAEffect')
    const antiquitiesHTML = DOMCacheGetOrSet('talismanAntiquitiesEffect')
    const horseShoeHTML = DOMCacheGetOrSet('talismanHorseShoeEffect') */

  const inscriptionHTML = DOMCacheGetOrSet('talismanInscriptionBonus')
  const signatureHTML = DOMCacheGetOrSet('talismanSignatureBonus')

  const noResetHTML = DOMCacheGetOrSet('talismanNoResetText')

  inscriptionHTML.innerHTML = talisman.inscriptionDesc(talisman.rarity)
  signatureHTML.style.display = talisman.rarity >= 6 ? 'block' : 'none'
  signatureHTML.innerHTML = talisman.signatureDesc(talisman.rarity)

  const runeLevelMult = allTalismanRuneBonusStatsSum()
  for (const rune of Object.keys(talisman.talismanBaseCoefficient) as RuneKeys[]) {
    const levels = getRuneBonusFromIndividualTalisman(t, rune) * runeLevelMult
    const capitalizedRune = rune.charAt(0).toUpperCase() + rune.slice(1)
    if (levels > 0) {
      DOMCacheGetOrSet(`talisman${capitalizedRune}Effect`).style.display = 'block'
      DOMCacheGetOrSet(`talisman${capitalizedRune}Effect`).innerHTML = i18next.t(
        `runes.talismans.bonusRuneLevels.${rune}`,
        {
          x: format(levels, 0, true)
        }
      )
    } else {
      DOMCacheGetOrSet(`talisman${capitalizedRune}Effect`).style.display = 'none'
    }
  }

  if (talisman.minimalResetTier === 'never') {
    noResetHTML.style.display = 'block'
    noResetHTML.innerHTML = i18next.t('runes.talismans.doesNotReset')
  } else {
    noResetHTML.style.display = 'none'
  }
}

export const updateTalismanCostHTML = (t: TalismanKeys) => {
  assert(G.currentTab === Tabs.Runes, 'Talisman updateCostHTML called outside of Runes tab')
  DOMCacheGetOrSet('talismanEffect').style.display = 'none'
  DOMCacheGetOrSet('talismanLevelUpCost').style.display = 'block'
  const a = DOMCacheGetOrSet('talismanShardCost')
  const b = DOMCacheGetOrSet('talismanCommonFragmentCost')
  const c = DOMCacheGetOrSet('talismanUncommonFragmentCost')
  const d = DOMCacheGetOrSet('talismanRareFragmentCost')
  const e = DOMCacheGetOrSet('talismanEpicFragmentCost')
  const f = DOMCacheGetOrSet('talismanLegendaryFragmentCost')
  const g = DOMCacheGetOrSet('talismanMythicalFragmentCost')

  DOMCacheGetOrSet('talismanLevelUpSummary').textContent = i18next.t('runes.resourcesToLevelup')
  DOMCacheGetOrSet('talismanLevelUpSummary').style.color = 'silver'

  const nextCost = getTalismanCostTNL(t)
  a.textContent = format(nextCost.shard, 0, false)
  b.textContent = format(nextCost.commonFragment, 0, false)
  c.textContent = format(nextCost.uncommonFragment, 0, false)
  d.textContent = format(nextCost.rareFragment, 0, false)
  e.textContent = format(nextCost.epicFragment, 0, false)
  f.textContent = format(nextCost.legendaryFragment, 0, false)
  g.textContent = format(nextCost.mythicalFragment, 0, false)
}

export const updateTalismanDisplay = (t: TalismanKeys) => {
  assert(G.currentTab === Tabs.Runes, 'Talisman updateTalismanDisplay called outside of Runes tab')
  const talisman = talismans[t]
  const el = DOMCacheGetOrSet(`${t}TalismanIconWrapper`)
  const la = DOMCacheGetOrSet(`${t}TalismanLevel`)
  const ti = DOMCacheGetOrSet(`${t}Talisman`)

  el.classList.remove('rainbowBorder')
  el.classList.add('talismanIcon')
  la.classList.remove('rainbowText')

  la.textContent = `${format(talisman.level)}/${format(getTalismanLevelCap(t))}`
  const rarity = talisman.rarity
  if (rarity === 1) {
    ti.style.border = '3px solid white'
    la.style.color = 'white'
  }
  if (rarity === 2) {
    ti.style.border = '3px solid limegreen'
    la.style.color = 'limegreen'
  }
  if (rarity === 3) {
    ti.style.border = '3px solid lightblue'
    la.style.color = 'lightblue'
  }
  if (rarity === 4) {
    ti.style.border = '3px solid plum'
    la.style.color = 'plum'
  }
  if (rarity === 5) {
    ti.style.border = '3px solid orange'
    la.style.color = 'darkorange'
  }
  if (rarity === 6) {
    ti.style.border = '3px solid crimson'
    la.style.color = 'var(--crimson-text-color)'
  }
  if (rarity === 7) {
    ti.style.border = '3px solid cyan'
    la.style.color = 'cyan'
  }
  if (rarity === 8) {
    ti.style.border = '3px solid red'
    la.style.color = 'red'
  }
  if (rarity === 9) {
    ti.style.border = '3px solid gold'
    la.style.color = 'gold'
  }
  if (rarity === 10) {
    ti.style.border = ''
    el.classList.remove('talismanIcon')
    el.classList.add('rainbowBorder')
    la.style.color = ''
    la.classList.add('talismanLevel')
    la.classList.add('rainbowText')
  }
}

export const resetSingleTalisman = (t: TalismanKeys) => {
  talismans[t].level = 0
  talismans[t].fragmentsInvested = { ...noTalismanFragments }
  player.talismans[t] = { ...noTalismanFragments }
  setTalismanRarity(t)
}

export const resetTalismanData = (tier: keyof typeof resetTiers) => {
  for (const t of Object.keys(talismans) as TalismanKeys[]) {
    if (resetTiers[tier] >= resetTiers[talismans[t].minimalResetTier]) {
      resetSingleTalisman(t)
    }
  }

  player.talismanShards = 0
  player.commonFragments = 0
  player.uncommonFragments = 0
  player.rareFragments = 0
  player.epicFragments = 0
  player.legendaryFragments = 0
  player.mythicalFragments = 0
}

export const sumOfTalismanRarities = (): number => {
  let sum = 0
  for (const t of Object.keys(talismans) as TalismanKeys[]) {
    sum += talismans[t].rarity
  }
  return sum
}

/**
 * Updates legacy talisman data (player.talismanLevels[i]) to the
 * new talismans object. Takes level and creates talisman.level and
 * talismans.fragmentsInvested. Should only be used in PlayerUpdateVarSchema.ts
 */
export const updateResourcePredefinedLevel = (level: number, t: TalismanKeys): void => {
  talismans[t].level = Math.min(level, getTalismanLevelCap(t))
  talismans[t].fragmentsInvested = { ...noTalismanFragments }
  setTalismanRarity(t)

  for (let n = 0; n < talismans[t].level; n++) {
    const nextCost = talismans[t].costs(talismans[t].baseMult, n)
    for (const item in nextCost) {
      talismans[t].fragmentsInvested[item as TalismanCraftItems] += nextCost[item as TalismanCraftItems]
    }
  }
}

export const updateAllTalismanHTML = () => {
  for (const t of Object.keys(talismans) as TalismanKeys[]) {
    updateTalismanDisplay(t)
  }
}

export const generateTalismansHTML = () => {
  const alreadyGenerated = document.getElementsByClassName('talismanContainer').length > 0

  if (alreadyGenerated) {
    return
  } else {
    const talismansContainer = DOMCacheGetOrSet('talismansContainerDiv')

    for (const key of Object.keys(talismans) as TalismanKeys[]) {
      const talismansDiv = document.createElement('div')
      talismansDiv.className = 'talismanContainer'
      talismansDiv.id = `${key}TalismanContainer`

      const talismansName = document.createElement('span')
      talismansName.className = 'talismanName'
      talismansName.setAttribute('i18n', `runes.talismans.names.${key}`)

      talismansDiv.appendChild(talismansName)

      const talismanIconDivWrapper = document.createElement('div')
      talismanIconDivWrapper.id = `${key}TalismanIconWrapper`
      talismanIconDivWrapper.className = 'talismanIcon'

      const talismansIcon = document.createElement('img')
      talismansIcon.id = `${key}Talisman`
      talismansIcon.alt = `${key} Talisman`
      talismansIcon.src = `Pictures/Talismans/${key.charAt(0).toUpperCase() + key.slice(1)}.png`
      talismansIcon.loading = 'lazy'

      talismanIconDivWrapper.appendChild(talismansIcon)

      talismansDiv.appendChild(talismanIconDivWrapper)

      const talismansLevel = document.createElement('span')
      talismansLevel.className = 'talismanLevel'
      talismansLevel.id = `${key}TalismanLevel`
      talismansLevel.textContent = 'Level 0/30'

      talismansDiv.appendChild(talismansLevel)

      const talismansLevelUpButton = document.createElement('button')
      talismansLevelUpButton.className = 'talismanBtn'
      talismansLevelUpButton.id = `level${key}Once`
      talismansLevelUpButton.style.color = 'silver'
      talismansLevelUpButton.style.border = '2px solid white'
      talismansLevelUpButton.setAttribute('i18n', 'runes.talismans.fortify')
      talismansLevelUpButton.textContent = i18next.t('runes.talismans.fortify')

      talismansDiv.appendChild(talismansLevelUpButton)

      const talismansLevelUpButton2 = document.createElement('button')
      talismansLevelUpButton2.className = 'talismanBtn'
      talismansLevelUpButton2.id = `level${key}ToRarityIncrease`
      talismansLevelUpButton2.style.color = 'gold'
      talismansLevelUpButton2.style.border = '2px solid orangered'
      talismansLevelUpButton2.setAttribute('i18n', 'runes.talismans.enhance')
      talismansLevelUpButton2.textContent = i18next.t('runes.talismans.enhance')

      talismansDiv.appendChild(talismansLevelUpButton2)

      const talismansLevelUpButton3 = document.createElement('button')
      talismansLevelUpButton3.className = 'talismanBtn'
      talismansLevelUpButton3.id = `level${key}ToMax`
      talismansLevelUpButton3.style.color = 'plum'
      talismansLevelUpButton3.style.border = '2px solid white'
      talismansLevelUpButton3.setAttribute('i18n', 'runes.talismans.respec')
      talismansLevelUpButton3.textContent = i18next.t('runes.talismans.respec')

      talismansDiv.appendChild(talismansLevelUpButton3)

      talismansContainer.appendChild(talismansDiv)
    }
  }
}

const getTalismanResourceInfo = (
  type: keyof typeof talismanResourceCosts,
  percentage = player.buyTalismanShardPercent
) => {
  const resourceCap = 1e270

  const obtainiumCost = talismanResourceCosts[type].obtainium
  const offeringCost = talismanResourceCosts[type].offerings

  const maxBuyObtainium = Math.max(
    1,
    Math.floor(Decimal.min(player.obtainium.div(obtainiumCost), resourceCap).toNumber())
  )
  const maxBuyOffering = Math.max(
    1,
    Math.floor(Decimal.min(player.offerings.div(offeringCost), resourceCap).toNumber())
  )
  const amountToBuy = Math.max(1, Math.floor(percentage / 100 * Math.min(maxBuyObtainium, maxBuyOffering)))
  const canBuy = player.obtainium.gte(obtainiumCost) && player.offerings.gte(offeringCost)
  return {
    canBuy, // Boolean, if false will not buy any fragments
    buyAmount: amountToBuy, // Integer, will buy as specified above.
    obtainiumCost: obtainiumCost * amountToBuy, // Integer, cost in obtainium to buy (buyAmount) resource
    offeringCost: offeringCost * amountToBuy // Integer, cost in offerings to buy (buyAmount) resource
  }
}

export const updateTalismanCostDisplay = (
  type: keyof typeof talismanResourceCosts | null,
  percentage = player.buyTalismanShardPercent
) => {
  const el = DOMCacheGetOrSet('talismanFragmentCost')
  if (type) {
    const talismanCostInfo = getTalismanResourceInfo(type, percentage)
    const talismanShardName = i18next.t(`runes.talismans.shards.${type}`)

    el.textContent = i18next.t('runes.talismans.costToBuy', {
      name: talismanShardName,
      buyAmount: format(talismanCostInfo.buyAmount),
      obtainium: format(talismanCostInfo.obtainiumCost),
      offerings: format(talismanCostInfo.offeringCost)
    })
  } else {
    // Buy All
    el.textContent = i18next.t('runes.talismans.clickBuyEveryType')
  }
}

export const toggleTalismanBuy = (i = player.buyTalismanShardPercent) => {
  DOMCacheGetOrSet('talismanTen').style.backgroundColor = ''
  DOMCacheGetOrSet('talismanTwentyFive').style.backgroundColor = ''
  DOMCacheGetOrSet('talismanFifty').style.backgroundColor = ''
  DOMCacheGetOrSet('talismanHundred').style.backgroundColor = ''
  player.buyTalismanShardPercent = i
  let x = 'Ten'
  if (i === 25) {
    x = 'TwentyFive'
  }
  if (i === 50) {
    x = 'Fifty'
  }
  if (i === 100) {
    x = 'Hundred'
  }

  DOMCacheGetOrSet(`talisman${x}`).style.backgroundColor = 'green'
}

export const updateTalismanInventory = () => {
  DOMCacheGetOrSet('talismanShardInventory').textContent = format(player.talismanShards)
  DOMCacheGetOrSet('commonFragmentInventory').textContent = format(player.commonFragments)
  DOMCacheGetOrSet('uncommonFragmentInventory').textContent = format(player.uncommonFragments)
  DOMCacheGetOrSet('rareFragmentInventory').textContent = format(player.rareFragments)
  DOMCacheGetOrSet('epicFragmentInventory').textContent = format(player.epicFragments)
  DOMCacheGetOrSet('legendaryFragmentInventory').textContent = format(player.legendaryFragments)
  DOMCacheGetOrSet('mythicalFragmentInventory').textContent = format(player.mythicalFragments)
}

export const buyAllTalismanResources = () => {
  const talismanItemNames = [
    'shard',
    'commonFragment',
    'uncommonFragment',
    'rareFragment',
    'epicFragment',
    'legendaryFragment',
    'mythicalFragment'
  ] as const
  for (let index = talismanItemNames.length - 1; index >= 0; index--) {
    buyTalismanResources(talismanItemNames[index])
  }
}

export const buyTalismanResources = (
  type: keyof typeof talismanResourceCosts,
  percentage = player.buyTalismanShardPercent
) => {
  const talismanResourcesData = getTalismanResourceInfo(type, percentage)

  if (talismanResourcesData.canBuy) {
    if (type === 'shard') {
      player.talismanShards += talismanResourcesData.buyAmount
    } else {
      player[`${type}s` as const] += talismanResourcesData.buyAmount
    }
    if (type === 'mythicalFragment' && player.mythicalFragments >= 1e25) {
      awardUngroupedAchievement('seeingRed')
    }

    player.obtainium = player.obtainium.sub(talismanResourcesData.obtainiumCost)
    player.offerings = player.offerings.sub(talismanResourcesData.offeringCost)

    // When dealing with high values, calculations can be very slightly off due to floating point precision
    // and result in buying slightly (usually 1) more than the player can actually afford.
    // This results in negative obtainium or offerings with further calcs somehow resulting in NaN/undefined.
    // Instead of trying to work around floating point limits, just make sure nothing breaks as a result.
    // The calculation being done overall is similar to the following calculation:
    // 2.9992198253874083e47 - (Math.floor(2.9992198253874083e47 / 1e20) * 1e20)
    // which, for most values, returns 0, but values like this example will return a negative number instead.
    if (player.obtainium.lt(0)) {
      player.obtainium = new Decimal(0)
    }
    if (player.offerings.lt(0)) {
      player.offerings = new Decimal(0)
    }
  }
  updateTalismanCostDisplay(type, percentage)
  updateTalismanInventory()
}
