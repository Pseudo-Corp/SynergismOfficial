import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateOcteractMultiplier } from './Calculate'
import { updateMaxTokens, updateTokens } from './Campaign'
import { format, formatAsPercentIncrease, formatTimeShort, player } from './Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { isMobile } from './Utility'

export type OcteractDataKeys =
  | 'octeractStarter'
  | 'octeractGain'
  | 'octeractGain2'
  | 'octeractQuarkGain'
  | 'octeractQuarkGain2'
  | 'octeractCorruption'
  | 'octeractGQCostReduce'
  | 'octeractExportQuarks'
  | 'octeractImprovedDaily'
  | 'octeractImprovedDaily2'
  | 'octeractImprovedDaily3'
  | 'octeractImprovedQuarkHept'
  | 'octeractImprovedGlobalSpeed'
  | 'octeractImprovedAscensionSpeed'
  | 'octeractImprovedAscensionSpeed2'
  | 'octeractImprovedFree'
  | 'octeractImprovedFree2'
  | 'octeractImprovedFree3'
  | 'octeractImprovedFree4'
  | 'octeractSingUpgradeCap'
  | 'octeractOfferings1'
  | 'octeractObtainium1'
  | 'octeractAscensions'
  | 'octeractAscensions2'
  | 'octeractAscensionsOcteractGain'
  | 'octeractFastForward'
  | 'octeractAutoPotionSpeed'
  | 'octeractAutoPotionEfficiency'
  | 'octeractOneMindImprover'
  | 'octeractAmbrosiaLuck'
  | 'octeractAmbrosiaLuck2'
  | 'octeractAmbrosiaLuck3'
  | 'octeractAmbrosiaLuck4'
  | 'octeractAmbrosiaGeneration'
  | 'octeractAmbrosiaGeneration2'
  | 'octeractAmbrosiaGeneration3'
  | 'octeractAmbrosiaGeneration4'
  | 'octeractBonusTokens1'
  | 'octeractBonusTokens2'
  | 'octeractBonusTokens3'
  | 'octeractBonusTokens4'
  | 'octeractBlueberries'
  | 'octeractInfiniteShopUpgrades'
  | 'octeractTalismanLevelCap1'
  | 'octeractTalismanLevelCap2'
  | 'octeractTalismanLevelCap3'
  | 'octeractTalismanLevelCap4'

export interface OcteractUpgrade {
  level: number
  freeLevel: number
  octeractsInvested: number
  maxLevel: number
  qualityOfLife: boolean
  costPerLevel: number
  costFormula(this: void, level: number, baseCost: number): number
  effect(n: number): number
  effectDescription(n: number): string
  name(): string
  description(): string
}

export const octeractUpgrades: Record<OcteractDataKeys, OcteractUpgrade> = {
  octeractStarter: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: 1,
    costPerLevel: 1e-15,
    qualityOfLife: false,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effect: (n: number) => {
      return 1 + 0.4 * n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractStarter.effect', { n: (n > 0) ? '' : 'not' }),
    name: () => i18next.t('octeract.data.octeractStarter.name'),
    description: () => i18next.t('octeract.data.octeractStarter.description')
  },
  octeractGain: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: 1e8,
    costPerLevel: 1e-8,
    qualityOfLife: false,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 6) - Math.pow(level, 6))
    },
    effect: (n: number) => {
      return 1 + 0.01 * n
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractGain.effect', { n: formatAsPercentIncrease(effectValue, 2) })
    },
    name: () => i18next.t('octeract.data.octeractGain.name'),
    description: () => i18next.t('octeract.data.octeractGain.description')
  },
  octeractGain2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, Math.pow(level, 0.5) / 3)
    },
    maxLevel: -1,
    costPerLevel: 1e10,
    qualityOfLife: false,
    effect: (n: number) => {
      return 1 + 0.01 * n
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractGain2.effect', { n: formatAsPercentIncrease(effectValue, 2) })
    },
    name: () => i18next.t('octeract.data.octeractGain2.name'),
    description: () => i18next.t('octeract.data.octeractGain2.description')
  },
  octeractQuarkGain: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      if (level < 1000) {
        return baseCost * (Math.pow(level + 1, 7) - Math.pow(level, 7))
      } else {
        const fasterMult = (level >= 10000) ? (Math.pow(10, (level - 10000) / 250)) : 1
        const fasterMult2 = (level >= 15000) ? (Math.pow(10, (level - 15000) / 250)) : 1
        return baseCost * (Math.pow(1001, 7) - Math.pow(1000, 7)) * Math.pow(10, level / 1000) * fasterMult
          * fasterMult2
      }
    },
    maxLevel: 20000,
    costPerLevel: 1e-7,
    qualityOfLife: false,
    effect: (n: number) => {
      return 1 + 0.011 * n
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractQuarkGain.effect', { n: formatAsPercentIncrease(effectValue, 2) })
    },
    name: () => i18next.t('octeract.data.octeractQuarkGain.name'),
    description: () => i18next.t('octeract.data.octeractQuarkGain.description')
  },
  octeractQuarkGain2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e20, level)
    },
    maxLevel: 5,
    costPerLevel: 1e22,
    qualityOfLife: false,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractQuarkGain2.effect', { n: n > 0 ? '' : 'NOT' }),
    name: () => i18next.t('octeract.data.octeractQuarkGain2.name'),
    description: () => i18next.t('octeract.data.octeractQuarkGain2.description')
  },
  octeractCorruption: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level * 10)
    },
    maxLevel: 2,
    costPerLevel: 10,
    qualityOfLife: false,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractCorruption.effect', { n }),
    name: () => i18next.t('octeract.data.octeractCorruption.name'),
    description: () => i18next.t('octeract.data.octeractCorruption.description')
  },
  octeractGQCostReduce: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    maxLevel: 50,
    costPerLevel: 1e-9,
    qualityOfLife: false,
    effect: (n: number) => {
      return 1 - n / 100
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractGQCostReduce.effect', { n }),
    name: () => i18next.t('octeract.data.octeractGQCostReduce.name'),
    description: () => i18next.t('octeract.data.octeractGQCostReduce.description')
  },
  octeractExportQuarks: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 100,
    costPerLevel: 1,
    qualityOfLife: false,
    effect: (n: number) => {
      return 4 * n / 10 + 1
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractExportQuarks.effect', { n: format(40 * n, 0, true) }),
    name: () => i18next.t('octeract.data.octeractExportQuarks.name'),
    description: () => i18next.t('octeract.data.octeractExportQuarks.description')
  },
  octeractImprovedDaily: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1.6, level)
    },
    maxLevel: 50,
    costPerLevel: 1e-3,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractImprovedDaily.effect', { n }),
    name: () => i18next.t('octeract.data.octeractImprovedDaily.name'),
    description: () => i18next.t('octeract.data.octeractImprovedDaily.description'),
    qualityOfLife: true
  },
  octeractImprovedDaily2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    maxLevel: 50,
    costPerLevel: 1e-2,
    effect: (n: number) => {
      return 1 + 0.01 * n
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractImprovedDaily2.effect', { n: formatAsPercentIncrease(effectValue, 2) })
    },
    name: () => i18next.t('octeract.data.octeractImprovedDaily2.name'),
    description: () => i18next.t('octeract.data.octeractImprovedDaily2.description'),
    qualityOfLife: true
  },
  octeractImprovedDaily3: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(20, level)
    },
    maxLevel: -1,
    costPerLevel: 1e20,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractImprovedDaily3.effect', { n: `${n} +${0.5 * n}%` }),
    name: () => i18next.t('octeract.data.octeractImprovedDaily3.name'),
    description: () => i18next.t('octeract.data.octeractImprovedDaily3.description'),
    qualityOfLife: true
  },
  octeractImprovedQuarkHept: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e3, level)
    },
    maxLevel: 25,
    costPerLevel: 1 / 10,
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractImprovedQuarkHept.effect', { n: format(effectValue, 2, true) })
    },
    name: () => i18next.t('octeract.data.octeractImprovedQuarkHept.name'),
    description: () => i18next.t('octeract.data.octeractImprovedQuarkHept.description'),
    qualityOfLife: false
  },
  octeractImprovedGlobalSpeed: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1000,
    costPerLevel: 1e-5,
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractImprovedGlobalSpeed.effect', { n: format(n, 0, true) }),
    name: () => i18next.t('octeract.data.octeractImprovedGlobalSpeed.name'),
    description: () => i18next.t('octeract.data.octeractImprovedGlobalSpeed.description'),
    qualityOfLife: false
  },
  octeractImprovedAscensionSpeed: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e9, level / 100)
    },
    maxLevel: 100,
    costPerLevel: 100,
    effect: (n: number) => {
      return n / 2000
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractImprovedAscensionSpeed.effect', { n: format(n / 20, 2, true) }),
    name: () => i18next.t('octeract.data.octeractImprovedAscensionSpeed.name'),
    description: () => i18next.t('octeract.data.octeractImprovedAscensionSpeed.description'),
    qualityOfLife: false
  },
  octeractImprovedAscensionSpeed2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e12, level / 250)
    },
    maxLevel: 250,
    costPerLevel: 1e5,
    effect: (n: number) => {
      return n / 2000
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractImprovedAscensionSpeed2.effect', { n: format(n / 50, 2, true) }),
    name: () => i18next.t('octeract.data.octeractImprovedAscensionSpeed2.name'),
    description: () => i18next.t('octeract.data.octeractImprovedAscensionSpeed2.description'),
    qualityOfLife: false
  },
  octeractImprovedFree: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1,
    costPerLevel: 100,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractImprovedFree.effect', { n: (n > 0) ? '' : 'NOT' }),
    name: () => i18next.t('octeract.data.octeractImprovedFree.name'),
    description: () => i18next.t('octeract.data.octeractImprovedFree.description'),
    qualityOfLife: false
  },
  octeractImprovedFree2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1,
    costPerLevel: 1e7,
    effect: (n: number) => {
      return 0.05 * n
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractImprovedFree2.effect', { n: format(n / 20, 2, true) }),
    name: () => i18next.t('octeract.data.octeractImprovedFree2.name'),
    description: () => i18next.t('octeract.data.octeractImprovedFree2.description'),
    qualityOfLife: false
  },
  octeractImprovedFree3: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1,
    costPerLevel: 1e17,
    effect: (n: number) => {
      return 0.05 * n
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractImprovedFree3.effect', { n: format(n / 20, 2, true) }),
    name: () => i18next.t('octeract.data.octeractImprovedFree3.name'),
    description: () => i18next.t('octeract.data.octeractImprovedFree3.description'),
    qualityOfLife: false
  },
  octeractImprovedFree4: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e20, level / 40)
    },
    maxLevel: 40,
    costPerLevel: 1e20,
    effect: (n: number) => {
      return 0.001 * n + ((n > 0) ? 0.01 : 0)
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractImprovedFree4.effect', { n: format(effectValue, 3, true) })
    },
    name: () => i18next.t('octeract.data.octeractImprovedFree4.name'),
    description: () => i18next.t('octeract.data.octeractImprovedFree4.description'),
    qualityOfLife: false
  },
  octeractSingUpgradeCap: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e3, level)
    },
    maxLevel: 10,
    costPerLevel: 1e10,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractSingUpgradeCap.effect', { n }),
    name: () => i18next.t('octeract.data.octeractSingUpgradeCap.name'),
    description: () => i18next.t('octeract.data.octeractSingUpgradeCap.description'),
    qualityOfLife: true
  },
  octeractOfferings1: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      if (level < 25) {
        return baseCost * Math.pow(level + 1, 5)
      } else {
        return baseCost * 1e15 * Math.pow(10, level / 25 - 1)
      }
    },
    maxLevel: -1,
    costPerLevel: 1e-15,
    effect: (n: number) => {
      return 1 + 0.01 * n
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractOfferings1.effect', { n: formatAsPercentIncrease(effectValue, 2) })
    },
    name: () => i18next.t('octeract.data.octeractOfferings1.name'),
    description: () => i18next.t('octeract.data.octeractOfferings1.description'),
    qualityOfLife: false
  },
  octeractObtainium1: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      if (level < 25) {
        return baseCost * Math.pow(level + 1, 5)
      } else {
        return baseCost * 1e15 * Math.pow(10, level / 25 - 1)
      }
    },
    maxLevel: -1,
    costPerLevel: 1e-15,
    effect: (n: number) => {
      return 1 + 0.01 * n
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractObtainium1.effect', { n: formatAsPercentIncrease(effectValue, 2) })
    },
    name: () => i18next.t('octeract.data.octeractObtainium1.name'),
    description: () => i18next.t('octeract.data.octeractObtainium1.description'),
    qualityOfLife: false
  },
  octeractAscensions: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 3)
    },
    maxLevel: 1000000,
    costPerLevel: 1,
    effect: (n: number) => {
      return (1 + n / 100) * (1 + 2 * Math.floor(n / 10) / 100)
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractAscensions.effect', {
        n: format((effectValue - 1) * 100, 1, true)
      })
    },
    name: () => i18next.t('octeract.data.octeractAscensions.name'),
    description: () => i18next.t('octeract.data.octeractAscensions.description'),
    qualityOfLife: false
  },
  octeractAscensions2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, Math.pow(level, 0.5) / 3)
    },
    maxLevel: -1,
    costPerLevel: 1e12,
    effect: (n: number) => {
      return (1 + n / 100) * (1 + 2 * Math.floor(n / 10) / 100)
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractAscensions2.effect', {
        n: format((effectValue - 1) * 100, 1, true)
      })
    },
    name: () => i18next.t('octeract.data.octeractAscensions2.name'),
    description: () => i18next.t('octeract.data.octeractAscensions2.description'),
    qualityOfLife: false
  },
  octeractAscensionsOcteractGain: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(40, level)
    },
    maxLevel: -1,
    costPerLevel: 1000,
    effect: (n: number) => {
      return n / 100
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractAscensionsOcteractGain.effect', { n: format(n, 1, true) }),
    name: () => i18next.t('octeract.data.octeractAscensionsOcteractGain.name'),
    description: () => i18next.t('octeract.data.octeractAscensionsOcteractGain.description'),
    qualityOfLife: false
  },
  octeractFastForward: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e8, level)
    },
    maxLevel: 2,
    costPerLevel: 1e8,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractFastForward.effect', { n100: format(2.5 * n, 2, true), n }),
    name: () => i18next.t('octeract.data.octeractFastForward.name'),
    description: () => i18next.t('octeract.data.octeractFastForward.description'),
    qualityOfLife: false
  },
  octeractAutoPotionSpeed: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level)
    },
    maxLevel: -1,
    costPerLevel: 1e-10,
    effect: (n: number) => {
      return 1 + 4 * n / 100
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAutoPotionSpeed.effect', { n: 4 * n }),
    name: () => i18next.t('octeract.data.octeractAutoPotionSpeed.name'),
    description: () => i18next.t('octeract.data.octeractAutoPotionSpeed.description'),
    qualityOfLife: false
  },
  octeractAutoPotionEfficiency: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level)
    },
    maxLevel: 100,
    costPerLevel: 1e-10 * Math.pow(10, 0.5),
    effect: (n: number) => {
      return 1 + 2 * n / 100
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAutoPotionEfficiency.effect', { n: 2 * n }),
    name: () => i18next.t('octeract.data.octeractAutoPotionEfficiency.name'),
    description: () => i18next.t('octeract.data.octeractAutoPotionEfficiency.description'),
    qualityOfLife: false
  },
  octeractOneMindImprover: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      const fasterMult = (level >= 10) ? (Math.pow(1e3, level - 10)) : 1
      return baseCost * Math.pow(1e5, level) * fasterMult
    },
    maxLevel: 20,
    costPerLevel: 1e25,
    effect: (n: number) => {
      return 0.55 + n / 150
    },
    effectDescription: function(n: number) {
      const effectValue = this.effect(n)
      return i18next.t('octeract.data.octeractOneMindImprover.effect', { n: format(effectValue, 3, true) })
    },
    name: () => i18next.t('octeract.data.octeractOneMindImprover.name'),
    description: () => i18next.t('octeract.data.octeractOneMindImprover.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaLuck: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(10, useLevel) - Math.pow(10, useLevel - 1))
    },
    maxLevel: -1,
    costPerLevel: 1e60 / 9,
    effect: (n: number) => {
      return 4 * n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAmbrosiaLuck.effect', { n: format(4 * n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaLuck.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaLuck.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaLuck2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 6) - Math.pow(level, 6))
    },
    maxLevel: 30,
    costPerLevel: 1,
    effect: (n: number) => {
      return 2 * n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAmbrosiaLuck2.effect', { n: format(2 * n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaLuck2.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaLuck2.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaLuck3: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 8) - Math.pow(level, 8))
    },
    maxLevel: 30,
    costPerLevel: 1e30,
    effect: (n: number) => {
      return 3 * n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAmbrosiaLuck3.effect', { n: format(3 * n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaLuck3.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaLuck3.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaLuck4: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(3, useLevel) - Math.pow(3, useLevel - 1))
    },
    maxLevel: 50,
    costPerLevel: 1e70 / 2,
    effect: (n: number) => {
      return 5 * n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAmbrosiaLuck4.effect', { n: format(5 * n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaLuck4.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaLuck4.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaGeneration: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(10, useLevel) - Math.pow(10, useLevel - 1))
    },
    maxLevel: -1,
    costPerLevel: 1e60 / 9,
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAmbrosiaGeneration.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaGeneration.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaGeneration.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaGeneration2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 6) - Math.pow(level, 6))
    },
    maxLevel: 20,
    costPerLevel: 1,
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAmbrosiaGeneration2.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaGeneration2.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaGeneration2.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaGeneration3: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (Math.pow(level + 1, 8) - Math.pow(level, 8))
    },
    maxLevel: 35,
    costPerLevel: 1e30,
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractAmbrosiaGeneration3.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaGeneration3.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaGeneration3.description'),
    qualityOfLife: true
  },
  octeractAmbrosiaGeneration4: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      const useLevel = level + 1
      return baseCost * (Math.pow(3, useLevel) - Math.pow(3, useLevel - 1))
    },
    maxLevel: 50,
    costPerLevel: 1e70 / 2,
    effect: (n: number) => {
      return 1 + 2 * n / 100
    },
    effectDescription: (n: number) =>
      i18next.t('octeract.data.octeractAmbrosiaGeneration4.effect', { n: format(2 * n) }),
    name: () => i18next.t('octeract.data.octeractAmbrosiaGeneration4.name'),
    description: () => i18next.t('octeract.data.octeractAmbrosiaGeneration4.description'),
    qualityOfLife: true
  },
  octeractBonusTokens1: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e2, level)
    },
    maxLevel: 10,
    costPerLevel: 1e-5,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractBonusTokens1.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractBonusTokens1.name'),
    description: () => i18next.t('octeract.data.octeractBonusTokens1.description'),
    qualityOfLife: false
  },
  octeractBonusTokens2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e8, level)
    },
    maxLevel: 5,
    costPerLevel: 1e8,
    effect: (n: number) => {
      return 1 + n / 100
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractBonusTokens2.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractBonusTokens2.name'),
    description: () => i18next.t('octeract.data.octeractBonusTokens2.description'),
    qualityOfLife: false
  },
  octeractBonusTokens3: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(1e10, level)
    },
    maxLevel: 5,
    costPerLevel: 1e40,
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractBonusTokens3.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractBonusTokens3.name'),
    description: () => i18next.t('octeract.data.octeractBonusTokens3.description'),
    qualityOfLife: false
  },
  octeractBonusTokens4: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(4, level)
    },
    maxLevel: 50,
    costPerLevel: 1e75,
    effect: (n: number) => {
      return 2 * n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractBonusTokens4.effect', { n: format(2 * n) }),
    name: () => i18next.t('octeract.data.octeractBonusTokens4.name'),
    description: () => i18next.t('octeract.data.octeractBonusTokens4.description'),
    qualityOfLife: false
  },
  octeractBlueberries: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: 6,
    costPerLevel: 1,
    costFormula: (level: number, baseCost: number) => {
      const costArr = [1, 1e3, 1e9, 1e27, 1e81, 1e111]
      if (level === 6) {
        return 0
      } else {
        return costArr[level] + 0 * baseCost // Base cost is not used here.
      }
    },
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractBlueberries.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractBlueberries.name'),
    description: () => i18next.t('octeract.data.octeractBlueberries.description'),
    qualityOfLife: false
  },
  octeractInfiniteShopUpgrades: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: 80,
    costPerLevel: 1e30,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(16, level)
    },
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractInfiniteShopUpgrades.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractInfiniteShopUpgrades.name'),
    description: () => i18next.t('octeract.data.octeractInfiniteShopUpgrades.description'),
    qualityOfLife: false
  },
  octeractTalismanLevelCap1: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: 25,
    costPerLevel: 1e-5,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 5)
    },
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractTalismanLevelCap1.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractTalismanLevelCap1.name'),
    description: () => i18next.t('octeract.data.octeractTalismanLevelCap1.description'),
    qualityOfLife: false
  },
  octeractTalismanLevelCap2: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: 35,
    costPerLevel: 1e10,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 10)
    },
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractTalismanLevelCap2.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractTalismanLevelCap2.name'),
    description: () => i18next.t('octeract.data.octeractTalismanLevelCap2.description'),
    qualityOfLife: false
  },
  octeractTalismanLevelCap3: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: 40,
    costPerLevel: 1e20,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(level + 1, 20)
    },
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractTalismanLevelCap3.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractTalismanLevelCap3.name'),
    description: () => i18next.t('octeract.data.octeractTalismanLevelCap3.description'),
    qualityOfLife: false
  },
  octeractTalismanLevelCap4: {
    level: 0,
    freeLevel: 0,
    octeractsInvested: 0,
    maxLevel: -1,
    costPerLevel: 1e40,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level)
    },
    effect: (n: number) => {
      return n
    },
    effectDescription: (n: number) => i18next.t('octeract.data.octeractTalismanLevelCap4.effect', { n: format(n) }),
    name: () => i18next.t('octeract.data.octeractTalismanLevelCap4.name'),
    description: () => i18next.t('octeract.data.octeractTalismanLevelCap4.description'),
    qualityOfLife: false
  }
}

export const maxOcteractUpgradeAP = Object.values(octeractUpgrades).reduce((acc, upgrade) => {
  if (upgrade.maxLevel === -1) {
    return acc
  }
  return acc + 8
}, 0)

export const blankOcteractLevelObject: Record<
  OcteractDataKeys,
  { level: number; freeLevel: number; octeractsInvested: number }
> = Object
  .fromEntries(
    Object.keys(octeractUpgrades).map((key) => [
      key as OcteractDataKeys,
      {
        level: 0,
        freeLevel: 0,
        octeractsInvested: 0
      }
    ])
  ) as Record<OcteractDataKeys, { level: number; freeLevel: number; octeractsInvested: number }>

export const getOcteractUpgradeCostTNL = (upgradeKey: OcteractDataKeys): number => {
  const upgrade = octeractUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return 0
  }

  return upgrade.costFormula(upgrade.level, upgrade.costPerLevel)
}

const computeFreeLevelMultiplier = (): number => {
  return 1 + 0.3 / 100 * player.cubeUpgrades[78]
}

export const computeOcteractFreeLevelSoftcap = (upgradeKey: OcteractDataKeys): number => {
  const freeLevelMult = computeFreeLevelMultiplier()
  const upgrade = octeractUpgrades[upgradeKey]
  return upgrade.freeLevel * freeLevelMult
}

export const actualOcteractUpgradeTotalLevels = (upgradeKey: OcteractDataKeys): number => {
  const upgrade = octeractUpgrades[upgradeKey]

  if (
    (player.singularityChallenges.noOcteracts.enabled || player.singularityChallenges.sadisticPrequel.enabled)
    && !upgrade.qualityOfLife
  ) {
    return 0
  }

  const actualFreeLevels = computeOcteractFreeLevelSoftcap(upgradeKey)

  if (upgrade.level >= actualFreeLevels) {
    return actualFreeLevels + upgrade.level
  } else {
    return 2 * Math.sqrt(actualFreeLevels * upgrade.level)
  }
}

export const upgradeOcteractToString = (upgradeKey: OcteractDataKeys): string => {
  const upgrade = octeractUpgrades[upgradeKey]
  const name = upgrade.name()
  const costNextLevel = getOcteractUpgradeCostTNL(upgradeKey)
  const freeLevelMult = computeFreeLevelMultiplier()
  const freeLevelsWithMult = upgrade.freeLevel * freeLevelMult
  const totalEffectiveLevels = actualOcteractUpgradeTotalLevels(upgradeKey)

  const maxLevel = upgrade.maxLevel === -1
    ? ''
    : `/${format(upgrade.maxLevel, 0, true)}`

  const isMaxLevel = upgrade.maxLevel === upgrade.level
  const color = isMaxLevel ? 'plum' : 'white'

  const nameHTML = `<span style="color: gold">${name}</span>`
  const descriptionHTML = `<span style="color: lightblue">${upgrade.description()}</span>`

  const freeLevelMultText = freeLevelMult > 1
    ? `<span style="color: crimson"> (x${format(freeLevelMult, 2, true)})</span>`
    : ''

  let freeLevelText = upgrade.freeLevel > 0
    ? `<span style="color: orange"> [+${format(upgrade.freeLevel, 1, true)}${freeLevelMultText}]</span>`
    : ''

  if (freeLevelsWithMult > upgrade.level) {
    freeLevelText = `${freeLevelText} <span style="color: var(--maroon-text-color)">${
      i18next.t('general.softCapped')
    }</span>`
  }

  const effectiveLevelText = totalEffectiveLevels !== upgrade.level + upgrade.freeLevel
    ? `<br><b><span style="color: white">${
      i18next.t('general.effectiveLevel', {
        level: format(totalEffectiveLevels, 2, true)
      })
    }</span></b>`
    : ''

  const levelHTML = `<span style="color: ${color}"> ${i18next.t('general.level')} ${
    format(upgrade.level, 0, true)
  }${maxLevel}${freeLevelText}</span>`

  const isAffordable = costNextLevel <= player.wowOcteracts
  let affordTime = ''
  if (!isMaxLevel && !isAffordable) {
    const octPerSecond = calculateOcteractMultiplier()
    affordTime = octPerSecond > 0
      ? formatTimeShort((costNextLevel - player.wowOcteracts) / octPerSecond)
      : `${i18next.t('general.infinity')}`
  }

  const affordableInfo = isMaxLevel
    ? `<span style="color: plum"> ${i18next.t('general.maxed')}</span>`
    : isAffordable
    ? `<span style="color: var(--green-text-color)"> ${i18next.t('general.affordable')}</span>`
    : `<span style="color: yellow"> ${i18next.t('octeract.toString.becomeAffordable', { n: affordTime })}</span>`

  const totalLevels = actualOcteractUpgradeTotalLevels(upgradeKey)
  const effectHTML = `<span style="color: gold">${upgrade.effectDescription(totalLevels)}</span>`

  const costHTML = (upgrade.level === upgrade.maxLevel && upgrade.maxLevel !== -1)
    ? ''
    : `${
      i18next.t('octeract.toString.costNextLevel', {
        amount: format(costNextLevel, 2, true, true, true)
      })
    } ${affordableInfo}`

  const investedOcteractsHTML = upgrade.octeractsInvested > 0
    ? `<br><span style="color: turquoise">${
      i18next.t('octeract.toString.spentOcteracts', {
        spent: format(upgrade.octeractsInvested, 2, true, true, true)
      })
    }</span>`
    : ''

  const qualityOfLifeText = upgrade.qualityOfLife
    ? `<br><span style="color: orchid">${i18next.t('general.alwaysEnabled')}</span>`
    : ''

  return `${nameHTML}<br>${levelHTML}${effectiveLevelText}<br>${descriptionHTML}<br>${effectHTML}<br>${costHTML}${investedOcteractsHTML}${qualityOfLifeText}`
}

export const updateMobileOcteractHTML = (upgradeKey: OcteractDataKeys): void => {
  const elm = DOMCacheGetOrSet('singularityOcteractsMultiline')
  elm.innerHTML = upgradeOcteractToString(upgradeKey)

  // MOBILE ONLY - Add a button for buying upgrades
  if (isMobile) {
    const buttonDiv = document.createElement('div')

    const buyOne = document.createElement('button')
    const buyMax = document.createElement('button')

    buyOne.classList.add('modalBtnBuy')
    buyOne.textContent = i18next.t('general.buyOne')
    buyOne.addEventListener('click', (event: MouseEvent) => {
      buyOcteractUpgradeLevel(upgradeKey, event, false)
      updateMobileOcteractHTML(upgradeKey)
    })

    buyMax.classList.add('modalBtnBuy')
    buyMax.textContent = i18next.t('general.buyMax')
    buyMax.addEventListener('click', (event: MouseEvent) => {
      buyOcteractUpgradeLevel(upgradeKey, event, true)
      updateMobileOcteractHTML(upgradeKey)
    })

    buttonDiv.appendChild(buyOne)
    buttonDiv.appendChild(buyMax)
    elm.appendChild(buttonDiv)
  }
}

export const buyOcteractUpgradeLevel = async (
  upgradeKey: OcteractDataKeys,
  event: MouseEvent,
  buyMax = false
): Promise<void> => {
  const upgrade = octeractUpgrades[upgradeKey]
  let purchased = 0
  let maxPurchasable = 1
  let OCTBudget = player.wowOcteracts

  if (event.shiftKey || buyMax) {
    maxPurchasable = 100000000
    const buy = Number(
      await Prompt(`${i18next.t('octeract.buyLevel.buyPrompt', { n: format(player.wowOcteracts, 0, true) })}`)
    )

    if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
      return Alert(i18next.t('general.validation.finite'))
    }

    if (buy === -1) {
      OCTBudget = player.wowOcteracts
    } else if (buy <= 0) {
      return Alert(i18next.t('octeract.buyLevel.cancelPurchase'))
    } else {
      OCTBudget = buy
    }
    OCTBudget = Math.min(player.wowOcteracts, OCTBudget)
  }

  if (upgrade.maxLevel > 0) {
    maxPurchasable = Math.min(maxPurchasable, upgrade.maxLevel - upgrade.level)
  }

  if (maxPurchasable === 0) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  while (maxPurchasable > 0) {
    const cost = upgrade.costFormula(upgrade.level, upgrade.costPerLevel)
    if (player.wowOcteracts < cost || OCTBudget < cost) {
      break
    } else {
      player.wowOcteracts -= cost
      upgrade.octeractsInvested += cost
      OCTBudget -= cost
      upgrade.level += 1
      purchased += 1
      maxPurchasable -= 1
    }
  }

  if (purchased === 0) {
    return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
  }

  if (purchased > 1) {
    Alert(`${i18next.t('octeract.buyLevel.multiBuy', { n: format(purchased) })}`)
  }

  updateTokens()
  updateMaxTokens()
}

export const getOcteractUpgradeEffect = (upgradeKey: OcteractDataKeys): number => {
  const upgrade = octeractUpgrades[upgradeKey]
  const totalLevels = actualOcteractUpgradeTotalLevels(upgradeKey)
  return upgrade.effect(totalLevels)
}
