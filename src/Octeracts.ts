import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateOcteractMultiplier } from './Calculate'
import { updateMaxTokens, updateTokens } from './Campaign'
import { hepteracts } from './Hepteracts'
import { format, formatAsPercentIncrease, formatTimeShort, player } from './Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { isMobile } from './Utility'

type OcteractUpgradeRewards = {
  octeractStarter: {
    quarkMult: number
    antSpeedMult: number
    octeractMult: number
  }
  octeractGain: { octeractMult: number }
  octeractGain2: { octeractMult: number }
  octeractQuarkGain: { quarkMult: number }
  octeractQuarkGain2: { quarkMult: number }
  octeractCorruption: { corruptionLevelCapIncrease: number }
  octeractGQCostReduce: { goldenQuarkCostMult: number }
  octeractExportQuarks: { exportQuarkMult: number }
  octeractImprovedDaily: { extraGoldenQuarks: number }
  octeractImprovedDaily2: { goldenQuarkMult: number }
  octeractImprovedDaily3: {
    extraGoldenQuarks: number
    goldenQuarkMult: number
  }
  octeractImprovedQuarkHept: { quarkHeptExponent: number }
  octeractImprovedGlobalSpeed: { globalSpeedMult: number }
  octeractImprovedAscensionSpeed: { ascensionSpeedMult: number }
  octeractImprovedAscensionSpeed2: { ascensionSpeedMult: number }
  octeractImprovedFree: {
    unlocked: boolean
    freeLevelPower: number
  }
  octeractImprovedFree2: { freeLevelPowerIncrease: number }
  octeractImprovedFree3: { freeLevelPowerIncrease: number }
  octeractImprovedFree4: { freeLevelPowerIncrease: number }
  octeractSingUpgradeCap: { goldenQuarkUpgradeCapIncrease: number }
  octeractOfferings1: { offeringMult: number }
  octeractObtainium1: { obtainiumMult: number }
  octeractAscensions: { ascensionCountMult: number }
  octeractAscensions2: { ascensionCountMult: number }
  octeractAscensionsOcteractGain: { octeractMult: number }
  octeractFastForward: { lookahead: number }
  octeractAutoPotionSpeed: { autoPotionSpeedMult: number }
  octeractAutoPotionEfficiency: { potionPowerMult: number }
  octeractOneMindImprover: { ascendSpeedExponent: number }
  octeractAmbrosiaLuck: { ambrosiaLuck: number }
  octeractAmbrosiaLuck2: { ambrosiaLuck: number }
  octeractAmbrosiaLuck3: { ambrosiaLuck: number }
  octeractAmbrosiaLuck4: { ambrosiaLuck: number }
  octeractAmbrosiaGeneration: { ambrosiaBarSpeedMult: number }
  octeractAmbrosiaGeneration2: { ambrosiaBarSpeedMult: number }
  octeractAmbrosiaGeneration3: { ambrosiaBarSpeedMult: number }
  octeractAmbrosiaGeneration4: { ambrosiaBarSpeedMult: number }
  octeractBonusTokens1: { lastCompletionBonusTokens: number }
  octeractBonusTokens2: { tokenMultiplier: number }
  octeractBonusTokens3: { firstCompletionBonusTokens: number }
  octeractBonusTokens4: { initialTokenBonus: number }
  octeractBlueberries: { blueberries: number }
  octeractInfiniteShopUpgrades: { infinityVouchers: number }
  octeractTalismanLevelCap1: { talismanLevelCapIncrease: number }
  octeractTalismanLevelCap2: { talismanLevelCapIncrease: number }
  octeractTalismanLevelCap3: { talismanLevelCapIncrease: number }
  octeractTalismanLevelCap4: { talismanLevelCapIncrease: number }
}

export type OcteractUpgrades = keyof OcteractUpgradeRewards

interface OcteractUpgrade<T extends OcteractUpgrades, K extends keyof OcteractUpgradeRewards[T]> {
  level: number
  freeLevel: number
  octeractsInvested: number
  maxLevel: number
  qualityOfLife: boolean
  costPerLevel: number
  costFormula(this: void, level: number, baseCost: number): number
  effect(n: number, key: K): OcteractUpgradeRewards[T][K]
  effectDescription(n: number): string
  name(): string
  description(): string
}

const octeractBlueberryCostArr = [1, 1e3, 1e9, 1e27, 1e81, 1e111]

export const octeractUpgrades: {
  [K in OcteractUpgrades]: OcteractUpgrade<K, keyof OcteractUpgradeRewards[K]>
} = {
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
    effect: (n, key) => {
      if (key === 'quarkMult') {
        return 1 + 0.25 * n
      } else if (key === 'antSpeedMult') {
        return 1 + 99999 * n
      } else {
        return 1 + 0.4 * n // octeractMult
      }
    },
    effectDescription: (n: number) => {
      const quarkMult = getOcteractUpgradeEffect('octeractStarter', 'quarkMult')
      const octeractMult = getOcteractUpgradeEffect('octeractStarter', 'octeractMult')
      const antSpeedMult = getOcteractUpgradeEffect('octeractStarter', 'antSpeedMult')
      return n > 0 ?
      i18next.t('octeract.data.octeractStarter.effectEnabled', {
        amount: formatAsPercentIncrease(quarkMult, 0),
        amount2: formatAsPercentIncrease(octeractMult, 0),
        amount3: format(antSpeedMult, 0, true), 
      }) :
      i18next.t('octeract.data.octeractStarter.effectDisabled')
    },
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
      return 1 + 0.01 * n // octeractMult
    },
    effectDescription: function(_n: number) {
      const effectValue = getOcteractUpgradeEffect('octeractGain', 'octeractMult')
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
      return 1 + 0.01 * n // octeractMult
    },
    effectDescription: function(_n: number) {
      const effectValue = getOcteractUpgradeEffect('octeractGain2', 'octeractMult')
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
      return 1 + 0.011 * n // quarkMult
    },
    effectDescription: function(_n: number) {
      const effectValue = getOcteractUpgradeEffect('octeractQuarkGain', 'quarkMult')
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
      return 1
        + (1 / 10000) * Math.floor(octeractUpgrades.octeractQuarkGain.level / 111)
          * n
          * Math.floor(1 + Math.log10(Math.max(1, hepteracts.quark.BAL))) // quarkMult
    },
    effectDescription: (n: number) => {
      const quarkMult = getOcteractUpgradeEffect('octeractQuarkGain2', 'quarkMult')
      const quarkGain1Levels = octeractUpgrades.octeractQuarkGain.level
      const digits = Math.floor(1 + Math.log10(Math.max(1, hepteracts.quark.BAL)))
      return n > 0 ?
      i18next.t('octeract.data.octeractQuarkGain2.effectEnabled', {
        amount: formatAsPercentIncrease(quarkMult, 2),
        amount2: formatAsPercentIncrease(1 + n / 10000 * Math.floor(quarkGain1Levels / 111), 2),
        amount3: format(digits, 0, true)
      }) :
      i18next.t('octeract.data.octeractQuarkGain2.effectDisabled')
    },
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
      return n // corruptionLevelCapIncrease
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
      return 1 - n / 100 // goldenQuarkCostMult
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
      return 4 * n / 10 + 1 // exportQuarkMult
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
      return n // extraGoldenQuarks
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
      return 1 + 0.01 * n // goldenQuarkMult
    },
    effectDescription: function(_n: number) {
      const goldenQuarkMult = getOcteractUpgradeEffect('octeractImprovedDaily2', 'goldenQuarkMult')
      return i18next.t('octeract.data.octeractImprovedDaily2.effect', {
        n: formatAsPercentIncrease(goldenQuarkMult, 0)
      })
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
    effect: (n, key) => {
      if (key === 'goldenQuarkMult') {
        return 1 + 0.005 * n
      } else {
        return n // extraGoldenQuarks
      }
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
    effectDescription: function(_n: number) {
      const quarkHeptExponent = getOcteractUpgradeEffect('octeractImprovedQuarkHept', 'quarkHeptExponent')
      return i18next.t('octeract.data.octeractImprovedQuarkHept.effect', { n: format(quarkHeptExponent, 2, true) })
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
      return 1 + n * player.singularityCount / 100 // globalSpeedMult
    },
    effectDescription: (n: number) => {
      const globalSpeedMult = getOcteractUpgradeEffect('octeractImprovedGlobalSpeed', 'globalSpeedMult')
      return i18next.t('octeract.data.octeractImprovedGlobalSpeed.effect', {
        n: format(n, 0, true),
        mult: formatAsPercentIncrease(globalSpeedMult, 0)
      })
    },
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
      return 1 + n * player.singularityCount / 2000 // ascensionSpeedMult
    },
    effectDescription: (n: number) => {
      const ascensionSpeedMult = getOcteractUpgradeEffect('octeractImprovedAscensionSpeed', 'ascensionSpeedMult')
      return i18next.t('octeract.data.octeractImprovedAscensionSpeed.effect', {
        n: format(n / 20, 2, true),
        mult: formatAsPercentIncrease(ascensionSpeedMult, 2)
      })
    },
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
      return 1 + n * player.singularityCount / 2000
    },
    effectDescription: (n: number) => {
      const ascensionSpeedMult = getOcteractUpgradeEffect('octeractImprovedAscensionSpeed2', 'ascensionSpeedMult')
      return i18next.t('octeract.data.octeractImprovedAscensionSpeed2.effect', {
        n: format(n / 20, 2, true),
        mult: formatAsPercentIncrease(ascensionSpeedMult, 2)
      })
    },
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
    effect: (n, key) => {
      if (key === 'unlocked') {
        return n > 0
      } else {
        return n > 0 ? 0.6 : 0 // freeLevelPower
      }
    },
    effectDescription: (n: number) => {
      return n > 0 ?
        i18next.t('octeract.data.octeractImprovedFree.effectEnabled') :
        i18next.t('octeract.data.octeractImprovedFree.effectDisabled')
    },
    name: () => i18next.t('octeract.data.octeractImprovedFree.name'),
    description: () => {
      const power = 0.6
        + getOcteractUpgradeEffect('octeractImprovedFree2', 'freeLevelPowerIncrease')
        + getOcteractUpgradeEffect('octeractImprovedFree3', 'freeLevelPowerIncrease')
        + getOcteractUpgradeEffect('octeractImprovedFree4', 'freeLevelPowerIncrease')
      return i18next.t('octeract.data.octeractImprovedFree.description', {
        power: format(power, 2, true)
      })
    },
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
      return 0.05 * n // freeLevelPowerIncrease
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
      return 0.05 * n // freeLevelPowerIncrease
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
      return 0.001 * n + ((n > 0) ? 0.01 : 0) // freeLevelPowerIncrease
    },
    effectDescription: function(_n: number) {
      const freeLevelPowerIncrease = getOcteractUpgradeEffect('octeractImprovedFree4', 'freeLevelPowerIncrease')
      return i18next.t('octeract.data.octeractImprovedFree4.effect', { n: format(freeLevelPowerIncrease, 3, true) })
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
      return 1 + 0.01 * n // offeringMult
    },
    effectDescription: function(_n: number) {
      const offeringMult = getOcteractUpgradeEffect('octeractOfferings1', 'offeringMult')
      return i18next.t('octeract.data.octeractOfferings1.effect', { n: formatAsPercentIncrease(offeringMult, 2) })
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
      return 1 + 0.01 * n // obtainiumMult
    },
    effectDescription: function(_n: number) {
      const obtainiumMult = getOcteractUpgradeEffect('octeractObtainium1', 'obtainiumMult')
      return i18next.t('octeract.data.octeractObtainium1.effect', { n: formatAsPercentIncrease(obtainiumMult, 2) })
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
      return (1 + n / 100) * (1 + 2 * Math.floor(n / 10) / 100) // ascensionCountMult
    },
    effectDescription: function(_n: number) {
      const ascensionCountMult = getOcteractUpgradeEffect('octeractAscensions', 'ascensionCountMult')
      return i18next.t('octeract.data.octeractAscensions.effect', {
        n: format((ascensionCountMult - 1) * 100, 1, true)
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
      return (1 + n / 100) * (1 + 2 * Math.floor(n / 10) / 100) // ascensionCountMult
    },
    effectDescription: function(_n: number) {
      const ascensionCountMult = getOcteractUpgradeEffect('octeractAscensions2', 'ascensionCountMult')
      return i18next.t('octeract.data.octeractAscensions2.effect', {
        n: format((ascensionCountMult - 1) * 100, 1, true)
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
      return Math.pow(
        1 + n / 100,
        1 + Math.floor(Math.log10(1 + player.ascensionCount))
      ) // octeractMult
    },
    effectDescription: (n: number) => {
      const octeractMult = getOcteractUpgradeEffect('octeractAscensionsOcteractGain', 'octeractMult')
      return i18next.t('octeract.data.octeractAscensionsOcteractGain.effect', {
        n: format(n, 1, true),
        mult: formatAsPercentIncrease(octeractMult, 1)
      })
    },
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
      return n // fastForwardLevel
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
      return 1 + 4 * n / 100 // autoPotionSpeedMult
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
      return 1 + 2 * n / 100 // autoPotionEfficiencyMult
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
      return 0.55 + n / 150 // ascendSpeedExponent
    },
    effectDescription: function(_n: number) {
      const ascendSpeedExponent = getOcteractUpgradeEffect('octeractOneMindImprover', 'ascendSpeedExponent')
      return i18next.t('octeract.data.octeractOneMindImprover.effect', { n: format(ascendSpeedExponent, 3, true) })
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
      return 4 * n // ambrosiaLuck
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
      return 2 * n // ambrosiaLuck
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
      return 3 * n // ambrosiaLuck
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
      return 5 * n // ambrosiaLuck
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
      return 1 + n / 100 // ambrosiaBarSpeedMult
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
      return 1 + n / 100 // ambrosiaBarSpeedMult
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
      return 1 + n / 100 // ambrosiaBarSpeedMult
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
      return 1 + 2 * n / 100 // ambrosiaBarSpeedMult
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
      return n // lastCompletionBonusTokens
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
      return 1 + n / 100 // tokenMultiplier
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
      return n // firstCompletionBonusTokens
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
      return 2 * n // initialTokenBonus
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
    costFormula: (level: number) => {
      if (level === 6) {
        return 0
      } else {
        return octeractBlueberryCostArr[level] // Base cost is not used here.
      }
    },
    effect: (n: number) => {
      return n // blueberries
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
      return n // infinityVouchers
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
      return n // talismanLevelCapIncrease
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
      return n // talismanLevelCapIncrease
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
      return n // talismanLevelCapIncrease
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
      return n // talismanLevelCapIncrease
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
  OcteractUpgrades,
  { level: number; freeLevel: number; octeractsInvested: number }
> = Object
  .fromEntries(
    Object.keys(octeractUpgrades).map((key) => [
      key as OcteractUpgrades,
      {
        level: 0,
        freeLevel: 0,
        octeractsInvested: 0
      }
    ])
  ) as Record<OcteractUpgrades, { level: number; freeLevel: number; octeractsInvested: number }>

export const getOcteractUpgradeCostTNL = (upgradeKey: OcteractUpgrades): number => {
  const upgrade = octeractUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return 0
  }

  return upgrade.costFormula(upgrade.level, upgrade.costPerLevel)
}

const computeFreeLevelMultiplier = (): number => {
  return 1 + 0.3 / 100 * player.cubeUpgrades[78]
}

export const computeOcteractFreeLevelSoftcap = (upgradeKey: OcteractUpgrades): number => {
  const freeLevelMult = computeFreeLevelMultiplier()
  const upgrade = octeractUpgrades[upgradeKey]
  return upgrade.freeLevel * freeLevelMult
}

export const actualOcteractUpgradeTotalLevels = (upgradeKey: OcteractUpgrades): number => {
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

export const upgradeOcteractToString = (upgradeKey: OcteractUpgrades): string => {
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
      : i18next.t('general.infinity')
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

export const updateMobileOcteractHTML = (upgradeKey: OcteractUpgrades): void => {
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
  upgradeKey: OcteractUpgrades,
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
      await Prompt(i18next.t('octeract.buyLevel.buyPrompt', { n: format(player.wowOcteracts, 0, true) }))
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
    Alert(i18next.t('octeract.buyLevel.multiBuy', { n: format(purchased) }))
  }

  updateTokens()
  updateMaxTokens()
}

export const getOcteractUpgradeEffect = <
  T extends OcteractUpgrades,
  K extends keyof OcteractUpgradeRewards[T]
>(upgradeKey: T, key: K): OcteractUpgradeRewards[T][K] => {
  const upgrade = octeractUpgrades[upgradeKey]
  const totalLevels = actualOcteractUpgradeTotalLevels(upgradeKey)
  return upgrade.effect(totalLevels, key) as OcteractUpgradeRewards[T][K]
}
