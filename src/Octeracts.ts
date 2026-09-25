import i18next from 'i18next'
import { calculateSingularityUpgradePurchase } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateOcteractMultiplier } from './Calculate'
import { updateMaxTokens, updateTokens } from './Campaign'
import { getRedAmbrosiaUpgradeEffects } from './RedAmbrosiaUpgrades'
import { format, formatAsPercentIncrease, formatTimeShort, player } from './Synergism'
import { Alert, InfoAlert, infoAlertInactiveHTML, infoAlertTableHTML, PurchasePrompt } from './UpdateHTML'
import { memoize } from './Utility'

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
  maxLevel: number
  qualityOfLife: boolean
  costFormula(this: void, n: number): number
  effect(n: number, key: K): OcteractUpgradeRewards[T][K]
  effectDescription(n: number): string
  name(): string
  description(): string
}

const octeractBlueberryCostArr = [0, 1, 1e3, 1e9, 1e27, 1e81, 1e111]

export const octeractUpgrades: {
  [K in OcteractUpgrades]: OcteractUpgrade<K, keyof OcteractUpgradeRewards[K]>
} = {
  octeractStarter: {
    level: 0,
    maxLevel: 1,
    qualityOfLife: false,
    costFormula: (n) => {
      return 1e-15 * n
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
      if (n > 0) {
        const quarkMult = getOcteractUpgradeEffect('octeractStarter', 'quarkMult')
        const octeractMult = getOcteractUpgradeEffect('octeractStarter', 'octeractMult')
        const antSpeedMult = getOcteractUpgradeEffect('octeractStarter', 'antSpeedMult')
        return i18next.t('octeract.data.octeractStarter.effectEnabled', {
          amount: formatAsPercentIncrease(quarkMult, 0),
          amount2: formatAsPercentIncrease(octeractMult, 0),
          amount3: format(antSpeedMult, 0, true)
        })
      } else {
        return i18next.t('octeract.data.octeractStarter.effectDisabled')
      }
    },
    name: () => i18next.t('octeract.data.octeractStarter.name'),
    description: () => i18next.t('octeract.data.octeractStarter.description')
  },
  octeractGain: {
    level: 0,
    maxLevel: 100_000_000,
    qualityOfLife: false,
    costFormula: (n) => {
      return 1e-8 * Math.pow(n, 6)
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
    costFormula: (n) => {
      // Sum(10^(1/3 sqrt(n))) is approximately 10^(1/3 sqrt(n)) * sqrt(n)
      return 1e10 * Math.pow(10, Math.pow(n, 0.5) / 3) * Math.pow(n, 1 / 2)
    },
    maxLevel: 200_000,
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
    costFormula: (n) => {
      if (n < 1000) {
        return 1e-7 * Math.pow(n, 7) // 0 - 1e14
      } else if (n >= 1000 && n < 10000) {
        return 1e14 * Math.pow(10, (n - 1000) / 1000) // 1e14 - 1e23
      } else {
        return 1e23 * Math.pow(10, (n - 10000) / 125) // 1e23 - 1e103
      }
    },
    maxLevel: 20000,
    qualityOfLife: false,
    effect: (n: number) => {
      return 1 + 0.01 * n // quarkMult
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
    costFormula: (n) => {
      return 1e2 * (Math.pow(1e20, n) - 1)
    },
    maxLevel: 5,
    qualityOfLife: false,
    effect: (n: number) => {
      return 1
        + (1 / 1000) * Math.floor(octeractUpgrades.octeractQuarkGain.level / 1000)
          * n
          * Math.floor(1 + Math.log10(Math.max(1, player.hepteracts.quark.BAL))) // quarkMult
    },
    effectDescription: (n: number) => {
      if (n > 0) {
        const quarkMult = getOcteractUpgradeEffect('octeractQuarkGain2', 'quarkMult')
        const quarkGain1Levels = octeractUpgrades.octeractQuarkGain.level
        const digits = Math.floor(1 + Math.log10(Math.max(1, player.hepteracts.quark.BAL)))
        return i18next.t('octeract.data.octeractQuarkGain2.effectEnabled', {
          amount: formatAsPercentIncrease(quarkMult, 2),
          amount2: formatAsPercentIncrease(1 + n / 1000 * Math.floor(quarkGain1Levels / 1000), 2),
          amount3: format(digits, 0, true)
        })
      } else {
        return i18next.t('octeract.data.octeractQuarkGain2.effectDisabled')
      }
    },
    name: () => i18next.t('octeract.data.octeractQuarkGain2.name'),
    description: () => i18next.t('octeract.data.octeractQuarkGain2.description')
  },
  octeractCorruption: {
    level: 0,
    costFormula: (n) => {
      return 10 * (Math.pow(1e10, n) - 1) / (1e10 - 1)
    },
    maxLevel: 2,
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
    costFormula: (n) => {
      return 1e-9 * (Math.pow(2, n) - 1)
    },
    maxLevel: 50,
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
    costFormula: (n) => {
      return Math.pow(n * (n + 1) / 2, 2)
    },
    maxLevel: 100,
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
    costFormula: (n) => {
      return 1e-3 * (Math.pow(1.6, n) - 1) / (1.6 - 1)
    },
    maxLevel: 50,
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
    costFormula: (n) => {
      return 1e-2 * (Math.pow(2, n) - 1)
    },
    maxLevel: 50,
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
    costFormula: (n) => {
      return 1e20 * (Math.pow(20, n) - 1) / 19
    },
    maxLevel: 100,
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
    costFormula: (n) => {
      return 1 / 10 * (Math.pow(1e3, n) - 1) / 999
    },
    maxLevel: 25,
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
    costFormula: (n) => {
      return 1e-5 * Math.pow(n * (n + 1) / 2, 2)
    },
    maxLevel: 1000,
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
    costFormula: (n) => {
      return 100 * (Math.pow(10 ** (9 / 100), n) - 1) / (10 ** (9 / 100) - 1)
    },
    maxLevel: 100,
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
    costFormula: (n) => {
      return 1e5 * (Math.pow(10 ** (12 / 250), n) - 1) / (10 ** (12 / 250) - 1)
    },
    maxLevel: 250,
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
    costFormula: (n) => {
      return 100 * n
    },
    maxLevel: 1,
    effect: (n, key) => {
      if (key === 'unlocked') {
        return n > 0
      } else {
        return 0.6 * n // freeLevelPower
      }
    },
    effectDescription: (n: number) => {
      if (n > 0) {
        return i18next.t('octeract.data.octeractImprovedFree.effectEnabled')
      } else {
        return i18next.t('octeract.data.octeractImprovedFree.effectDisabled')
      }
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
    costFormula: (n) => {
      return 1e7 * n
    },
    maxLevel: 1,
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
    costFormula: (n) => {
      return 1e17 * n
    },
    maxLevel: 1,
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
    costFormula: (n) => {
      return 1e20 * (Math.pow(10 ** (1 / 2), n) - 1) / (10 ** (1 / 2) - 1)
    },
    maxLevel: 40,
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
    costFormula: (n) => {
      return 1e10 * (Math.pow(1e3, n) - 1) / 999
    },
    maxLevel: 10,
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
    costFormula: (n) => {
      return (Math.pow(10 ** (1 / 25), n) - 1) / (10 ** (1 / 25) - 1)
    },
    maxLevel: 4_000,
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
    costFormula: (n) => {
      return (Math.pow(10 ** (1 / 25), n) - 1) / (10 ** (1 / 25) - 1)
    },
    maxLevel: 4_000,
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
    costFormula: (n) => {
      return Math.pow(n * (n + 1) / 2, 2)
    },
    maxLevel: 1000000,
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
    costFormula: (n) => {
      return 1e12 * Math.pow(10, Math.pow(n, 0.5) / 3) * Math.pow(n, 1 / 2)
    },
    maxLevel: 250_000,
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
    costFormula: (n) => {
      return 1000 * (Math.pow(40, n) - 1) / 39
    },
    maxLevel: 100,
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
    costFormula: (n) => {
      return Math.pow(1e8, n) - 1
    },
    maxLevel: 2,
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
    costFormula: (n) => {
      return 1e-10 * (Math.pow(10, n) - 1) / 9
    },
    maxLevel: 175,
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
    costFormula: (n) => {
      return 1e-10 * Math.pow(10, 0.5) * (Math.pow(10, n) - 1) / 9
    },
    maxLevel: 100,
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
    costFormula: (n) => {
      if (n >= 10) {
        return 10 ** (55 + (n - 10) * 9.2)
      } else {
        return 10 ** (25) * (Math.pow(1e3, n) - 1)
      }
    },
    maxLevel: 20,
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
    costFormula: (n) => {
      return 1e60 * (Math.pow(10, n) - 1) / 9
    },
    maxLevel: 100,
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
    costFormula: (n) => {
      return Math.pow(n, 6)
    },
    maxLevel: 30,
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
    costFormula: (n) => {
      return 1e30 * Math.pow(n, 8)
    },
    maxLevel: 30,
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
    costFormula: (n) => {
      return 1e70 * (Math.pow(3, n) - 1) / 2
    },
    maxLevel: 50,
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
    costFormula: (n) => {
      return 1e60 * (Math.pow(10, n) - 1)
    },
    maxLevel: 100,
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
    costFormula: (n) => {
      return Math.pow(n, 6)
    },
    maxLevel: 20,
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
    costFormula: (n) => {
      return 1e30 * Math.pow(n, 8)
    },
    maxLevel: 35,
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
    costFormula: (n) => {
      return 1e70 * (Math.pow(3, n) - 1)
    },
    maxLevel: 50,
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
    costFormula: (n) => {
      return 1e-5 * (Math.pow(1e2, n) - 1) / 99
    },
    maxLevel: 10,
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
    costFormula: (n) => {
      return Math.pow(1e8, n) - 1
    },
    maxLevel: 5,
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
    costFormula: (n) => {
      return 1e40 * (Math.pow(1e10, n) - 1)
    },
    maxLevel: 5,
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
    costFormula: (n) => {
      return 1e75 * (Math.pow(4, n) - 1)
    },
    maxLevel: 50,
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
    maxLevel: 6,
    costFormula: (level: number) => {
      if (level > 6) {
        return Number.POSITIVE_INFINITY
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
    qualityOfLife: true
  },
  octeractInfiniteShopUpgrades: {
    level: 0,
    maxLevel: 80,
    costFormula: (n) => {
      return 1e30 * (Math.pow(16, n) - 1)
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
    maxLevel: 25,
    costFormula: (n) => {
      return 1e-5 * Math.pow(n, 6)
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
    maxLevel: 35,
    costFormula: (n) => {
      return 1e10 * Math.pow(n, 10)
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
    maxLevel: 40,
    costFormula: (n) => {
      return 1e20 * Math.pow(n, 20)
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
    maxLevel: 120,
    costFormula: (n) => {
      return 1e40 * (Math.pow(10, n) - 1)
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

const OCTERACT_UPGRADE_MAP_ROWS = [
  {
    left: { id: 'core', upgrades: ['octeractStarter'] },
    right: {
      id: 'core',
      upgrades: ['octeractGain', 'octeractGain2', 'octeractAscensionsOcteractGain', 'octeractOneMindImprover']
    }
  },
  {
    left: { id: 'goldenQuarks', upgrades: ['octeractGQCostReduce', 'octeractSingUpgradeCap', 'octeractFastForward'] },
    right: {
      id: 'quarks',
      upgrades: ['octeractQuarkGain', 'octeractQuarkGain2', 'octeractImprovedQuarkHept', 'octeractExportQuarks']
    }
  },
  {
    left: { id: 'daily', upgrades: ['octeractImprovedDaily', 'octeractImprovedDaily2', 'octeractImprovedDaily3'] },
    right: {
      id: 'freeLevels',
      upgrades: ['octeractImprovedFree', 'octeractImprovedFree2', 'octeractImprovedFree3', 'octeractImprovedFree4']
    }
  },
  {
    left: { id: 'ascensions', upgrades: ['octeractAscensions', 'octeractAscensions2'] },
    right: {
      id: 'speed',
      upgrades: ['octeractImprovedGlobalSpeed', 'octeractImprovedAscensionSpeed', 'octeractImprovedAscensionSpeed2']
    }
  },
  {
    left: { id: 'corruption', upgrades: ['octeractCorruption'] },
    right: {
      id: 'tokens',
      upgrades: ['octeractBonusTokens1', 'octeractBonusTokens2', 'octeractBonusTokens3', 'octeractBonusTokens4']
    }
  },
  {
    left: { id: 'resources', upgrades: ['octeractOfferings1', 'octeractObtainium1'] },
    right: { id: 'potions', upgrades: ['octeractAutoPotionSpeed', 'octeractAutoPotionEfficiency'] }
  },
  {
    left: { id: 'shop', upgrades: ['octeractInfiniteShopUpgrades'] },
    right: {
      id: 'talismans',
      upgrades: [
        'octeractTalismanLevelCap1',
        'octeractTalismanLevelCap2',
        'octeractTalismanLevelCap3',
        'octeractTalismanLevelCap4'
      ]
    }
  },
  {
    left: { id: 'blueberries', upgrades: ['octeractBlueberries'] },
    right: {
      id: 'ambrosiaLuck',
      upgrades: ['octeractAmbrosiaLuck2', 'octeractAmbrosiaLuck3', 'octeractAmbrosiaLuck', 'octeractAmbrosiaLuck4']
    }
  },
  {
    left: null,
    right: {
      id: 'ambrosiaGeneration',
      upgrades: [
        'octeractAmbrosiaGeneration2',
        'octeractAmbrosiaGeneration3',
        'octeractAmbrosiaGeneration',
        'octeractAmbrosiaGeneration4'
      ]
    }
  }
]

export const initializeOcteractUpgradeMap = memoize(() => {
  const container = DOMCacheGetOrSet('octeractUpgradeContainer')
  const lines = document.createElement('div')

  container.setAttribute('role', 'group')
  container.setAttribute('aria-label', i18next.t('octeract.map.ariaLabel'))
  lines.classList.add('octeractUpgradeLines')

  for (const { left, right } of OCTERACT_UPGRADE_MAP_ROWS) {
    const leftTrack = document.createElement('div')
    const spine = document.createElement('div')
    const rightTrack = document.createElement('div')

    leftTrack.classList.add('octeractUpgradeTrack', 'octeractUpgradeTrackLeft')
    leftTrack.dataset.octeractLine = left !== null ? left.id : right.id
    spine.classList.add('octeractUpgradeSpine')
    spine.dataset.octeractLine = right.id
    rightTrack.classList.add('octeractUpgradeTrack', 'octeractUpgradeTrackRight')
    rightTrack.dataset.octeractLine = right.id

    if (left !== null) {
      for (const upgrade of left.upgrades) {
        leftTrack.append(DOMCacheGetOrSet(upgrade))
      }
    }

    for (const upgrade of right.upgrades) {
      rightTrack.append(DOMCacheGetOrSet(upgrade))
    }

    lines.append(leftTrack, spine, rightTrack)
  }

  container.replaceChildren(DOMCacheGetOrSet('octeractUpgradeAP'), lines, DOMCacheGetOrSet('octeractUpgradeFooter'))
})

export const octeractUpgradeNames = Object.keys(octeractUpgrades) as OcteractUpgrades[]

export const maximumAffordableLevel = (upgradeKey: OcteractUpgrades, octeractAmount: number): number => {
  const upgrade = octeractUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return upgrade.level // no need to check maxed upgrades for affordability
  }

  const availablePurple = octeractAmount + player.octUpgrades[upgradeKey].octeractsInvested

  let low = upgrade.level
  let high = upgrade.maxLevel

  while (low < high) {
    const middle = low + Math.ceil((high - low) / 2)

    if (upgrade.costFormula(middle) <= availablePurple) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return low
}

const octeractLevelReconstructionTolerance = 1e-10

export const setOcteractUpgradeLevels = (): void => {
  for (const upgradeKey of octeractUpgradeNames) {
    const upgrade = octeractUpgrades[upgradeKey]
    const oldInvested = player.octUpgrades[upgradeKey].octeractsInvested || 0

    upgrade.level = 0

    // Accumulated purchase costs can round slightly below the cumulative level cost.
    // Costs span ~1e-15 to ~1e103, so the tolerance must be relative. It is far below the
    // smallest relative cost step of any upgrade (~6e-8 for octeractGain at max level).
    const maxAffordableLevel = maximumAffordableLevel(upgradeKey, oldInvested * octeractLevelReconstructionTolerance)
    const totalCost = upgrade.costFormula(maxAffordableLevel)

    upgrade.level = maxAffordableLevel

    player.octUpgrades[upgradeKey].octeractsInvested = totalCost

    const toRefund = oldInvested - totalCost
    if (toRefund > 0) {
      player.wowOcteracts += toRefund
    }
  }
}

export const updateOcteractUpgradeVisibility = (
  upgradeKey: OcteractUpgrades,
  element = DOMCacheGetOrSet(upgradeKey)
): boolean => {
  const upgrade = octeractUpgrades[upgradeKey]
  const isMaxed = upgrade.maxLevel !== -1 && octeractUpgrades[upgradeKey].level >= upgrade.maxLevel
  const hideMaxed = DOMCacheGetOrSet('toggleMaxedOcteractUpgrades').getAttribute('aria-pressed') === 'true'

  element.classList.toggle('upgradeHiddenByMaxLevel', hideMaxed && isMaxed)
  return isMaxed
}

export const toggleMaxedOcteractUpgrades = (): void => {
  const toggle = DOMCacheGetOrSet('toggleMaxedOcteractUpgrades')
  const hideMaxed = toggle.getAttribute('aria-pressed') !== 'true'
  const i18nKey = hideMaxed ? 'general.maxedUpgradesHide' : 'general.maxedUpgradesShow'

  toggle.setAttribute('aria-pressed', `${hideMaxed}`)
  toggle.setAttribute('i18n', i18nKey)
  toggle.textContent = i18next.t(i18nKey)
  toggle.style.border = `2px solid ${hideMaxed ? 'red' : 'green'}`

  for (const key of octeractUpgradeNames) {
    updateOcteractUpgradeVisibility(key)
  }
}

export type DailyOcteractFreeUpgradeKey = 'octeractGain' | 'octeractGain2' | 'octeractAscensionsOcteractGain'

export interface DailyOcteractFreeUpgradeEntry {
  freeLevels: () => number
  /** Highest cap, used for achievement points. -1 means no cap */
  freeLevelCap: number
  /** For caps that grow over time; defaults to `freeLevelCap` */
  currentFreeLevelCap?: () => number
  /** `description` must be the full line from a single i18next.t call: nesting translated strings duplicates stat symbols */
  requirement: { isUnlocked: () => boolean; description: () => string }
  formula: () => string
}

const octeractCogenesisDivisor = () => player.highestSingularityCount >= 205 ? 640 : 1000

export const dailyOcteractFreeUpgradeTable: Record<DailyOcteractFreeUpgradeKey, DailyOcteractFreeUpgradeEntry> = {
  octeractGain: {
    freeLevels: () =>
      Math.max(
        octeractUpgrades.octeractGain.level / 100,
        Math.pow(
          octeractUpgrades.octeractGain.level * player.octUpgrades.octeractGain.freeLevel / octeractCogenesisDivisor(),
          0.5
        )
      ),
    freeLevelCap: 20_000_000_000,
    requirement: {
      isUnlocked: () => player.highestSingularityCount >= 200,
      description: () => i18next.t('octeract.freeUpgradeInfo.requirements.singularity', { singularity: 200 })
    },
    formula: () => i18next.t('octeract.freeUpgradeInfo.formulas.octeractGain', { divisor: octeractCogenesisDivisor() })
  },
  octeractGain2: {
    freeLevels: () =>
      Math.max(
        octeractUpgrades.octeractGain2.level / 100,
        Math.pow(
          Math.pow(octeractUpgrades.octeractGain2.level, 2) * player.octUpgrades.octeractGain2.freeLevel / 125000,
          0.333
        )
      ),
    freeLevelCap: 5_000_000,
    requirement: {
      isUnlocked: () => player.highestSingularityCount >= 205,
      description: () => i18next.t('octeract.freeUpgradeInfo.requirements.singularity', { singularity: 205 })
    },
    formula: () => i18next.t('octeract.freeUpgradeInfo.formulas.octeractGain2')
  },
  octeractAscensionsOcteractGain: {
    freeLevels: () => getRedAmbrosiaUpgradeEffects('redAmbrosiaFreeAccumulator', 'freeAccumulatorLevels'),
    freeLevelCap: 2,
    currentFreeLevelCap: () =>
      1 + getRedAmbrosiaUpgradeEffects('redAmbrosiaFreeAccumulator', 'freeAccumulatorLevelCapIncrease'),
    requirement: {
      isUnlocked: () => getRedAmbrosiaUpgradeEffects('redAmbrosiaFreeAccumulator', 'freeAccumulatorLevels') > 0,
      description: () => i18next.t('octeract.freeUpgradeInfo.requirements.redAmbrosiaFreeAccumulator')
    },
    formula: () => i18next.t('octeract.freeUpgradeInfo.formulas.octeractAscensionsOcteractGain')
  }
}

export const dailyOcteractFreeUpgradeKeys = Object.keys(dailyOcteractFreeUpgradeTable) as DailyOcteractFreeUpgradeKey[]

export const maxOcteractUpgradeAP = 8 * octeractUpgradeNames.length
  + 8 * dailyOcteractFreeUpgradeKeys.filter((key) => dailyOcteractFreeUpgradeTable[key].freeLevelCap !== -1).length

const hasOcteractFreeLevelCap = (key: OcteractUpgrades): key is DailyOcteractFreeUpgradeKey =>
  key in dailyOcteractFreeUpgradeTable
  && dailyOcteractFreeUpgradeTable[key as DailyOcteractFreeUpgradeKey].freeLevelCap !== -1

const isOcteractUpgradeMaxed = (key: OcteractUpgrades): boolean =>
  octeractUpgrades[key].maxLevel !== -1 && octeractUpgrades[key].level >= octeractUpgrades[key].maxLevel

export const getOcteractUpgradeAP = (key: OcteractUpgrades): number =>
  (isOcteractUpgradeMaxed(key) ? 8 : 0)
  + (hasOcteractFreeLevelCap(key) && isOcteractFreeLevelAtHighestCap(key) ? 8 : 0)

export const calculateOcteractUpgradeAP = () =>
  octeractUpgradeNames.reduce((sum, key) => sum + getOcteractUpgradeAP(key), 0)

const getCurrentOcteractFreeLevelCap = (key: DailyOcteractFreeUpgradeKey): number => {
  const entry = dailyOcteractFreeUpgradeTable[key]
  return entry.currentFreeLevelCap?.() ?? entry.freeLevelCap
}

const isDailyOcteractFreeUpgradeCapped = (key: DailyOcteractFreeUpgradeKey): boolean => {
  const cap = getCurrentOcteractFreeLevelCap(key)
  return cap !== -1 && player.octUpgrades[key].freeLevel >= cap
}

export const isOcteractFreeLevelAtHighestCap = (key: DailyOcteractFreeUpgradeKey): boolean => {
  const cap = dailyOcteractFreeUpgradeTable[key].freeLevelCap
  return cap !== -1 && player.octUpgrades[key].freeLevel >= cap
}

export const clampOcteractFreeLevelsToCaps = () => {
  for (const key of dailyOcteractFreeUpgradeKeys) {
    const cap = getCurrentOcteractFreeLevelCap(key)
    if (cap !== -1) {
      player.octUpgrades[key].freeLevel = Math.min(player.octUpgrades[key].freeLevel, cap)
    }
  }
}

export const getDailyOcteractFreeLevels = (key: DailyOcteractFreeUpgradeKey): number => {
  const entry = dailyOcteractFreeUpgradeTable[key]
  if (!entry.requirement.isUnlocked()) {
    return 0
  }
  const cap = getCurrentOcteractFreeLevelCap(key)
  const room = cap === -1 ? Number.POSITIVE_INFINITY : Math.max(0, cap - player.octUpgrades[key].freeLevel)
  return Math.min(entry.freeLevels(), room)
}

export const awardDailyOcteractFreeUpgrades = (): Partial<Record<DailyOcteractFreeUpgradeKey, number>> => {
  const gains = dailyOcteractFreeUpgradeKeys.map(getDailyOcteractFreeLevels)
  const gainedLevels: Partial<Record<DailyOcteractFreeUpgradeKey, number>> = {}
  dailyOcteractFreeUpgradeKeys.forEach((key, index) => {
    if (gains[index] > 0) {
      player.octUpgrades[key].freeLevel += gains[index]
      gainedLevels[key] = gains[index]
    }
  })
  return gainedLevels
}

const octeractFreeUpgradeInfoHTML = (): string => {
  const summaryHTML = `<p class="freeUpgradeInfoSummary">${i18next.t('octeract.freeUpgradeInfo.summary')}</p>`

  const rowsHTML = dailyOcteractFreeUpgradeKeys.map((key) => {
    const entry = dailyOcteractFreeUpgradeTable[key]
    const unlocked = entry.requirement.isUnlocked()
    const cap = getCurrentOcteractFreeLevelCap(key)
    const freeLevel = format(player.octUpgrades[key].freeLevel, 3, true)
    const freeLevelText = cap === -1 ? freeLevel : `${freeLevel} / ${format(cap, 1, true)}`

    let nextText: string
    if (!unlocked) {
      nextText = infoAlertInactiveHTML(i18next.t('octeract.freeUpgradeInfo.locked'))
    } else if (isDailyOcteractFreeUpgradeCapped(key)) {
      nextText = infoAlertInactiveHTML(i18next.t('octeract.freeUpgradeInfo.capped'))
    } else {
      nextText = `+${format(getDailyOcteractFreeLevels(key), 3, true)}`
    }

    let detailHTML = ''
    if (!unlocked) {
      detailHTML = `<tr class="freeUpgradeInfoInactive"><td colspan="3">${entry.requirement.description()}</td></tr>`
    } else if (!isDailyOcteractFreeUpgradeCapped(key)) {
      detailHTML = `<tr><td colspan="3">${entry.formula()}</td></tr>`
    }

    return `<tr>
      <td>${octeractUpgrades[key].name()}</td>
      <td>${nextText}</td>
      <td>${freeLevelText}</td>
    </tr>
    ${detailHTML}`
  }).join('')

  return `${summaryHTML}${
    infoAlertTableHTML([
      i18next.t('octeract.freeUpgradeInfo.upgrade'),
      i18next.t('octeract.freeUpgradeInfo.nextDaily'),
      i18next.t('octeract.freeUpgradeInfo.freeLevels')
    ], rowsHTML)
  }`
}

export const showOcteractFreeUpgradeInfo = () =>
  InfoAlert(i18next.t('octeract.freeUpgradeInfo.title'), octeractFreeUpgradeInfoHTML())

export const blankOcteractLevelObject: Record<
  OcteractUpgrades,
  { freeLevel: number; octeractsInvested: number }
> = Object
  .fromEntries(
    octeractUpgradeNames.map((key) => [
      key,
      {
        freeLevel: 0,
        octeractsInvested: 0
      }
    ])
  ) as Record<OcteractUpgrades, { freeLevel: number; octeractsInvested: number }>

export const getOcteractUpgradeCostTNL = (upgradeKey: OcteractUpgrades): number => {
  const upgrade = octeractUpgrades[upgradeKey]

  if (octeractUpgrades[upgradeKey].level === upgrade.maxLevel) {
    return 0
  }

  return upgrade.costFormula(octeractUpgrades[upgradeKey].level + 1)
    - upgrade.costFormula(octeractUpgrades[upgradeKey].level)
}

const computeFreeLevelMultiplier = (): number => {
  return 1 + 0.3 / 100 * player.cubeUpgrades[78]
}

export const computeOcteractFreeLevelSoftcap = (upgradeKey: OcteractUpgrades): number => {
  const freeLevelMult = computeFreeLevelMultiplier()
  return player.octUpgrades[upgradeKey].freeLevel * freeLevelMult
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

  if (octeractUpgrades[upgradeKey].level >= actualFreeLevels) {
    return actualFreeLevels + octeractUpgrades[upgradeKey].level
  } else {
    return 2 * Math.sqrt(actualFreeLevels * octeractUpgrades[upgradeKey].level)
  }
}

export const upgradeOcteractToString = (upgradeKey: OcteractUpgrades): string => {
  const upgrade = octeractUpgrades[upgradeKey]
  const name = upgrade.name()
  const costNextLevel = getOcteractUpgradeCostTNL(upgradeKey)
  const freeLevelMult = computeFreeLevelMultiplier()
  const freeLevelsWithMult = player.octUpgrades[upgradeKey].freeLevel * freeLevelMult
  const totalEffectiveLevels = actualOcteractUpgradeTotalLevels(upgradeKey)

  const maxLevel = `/${format(upgrade.maxLevel, 0, true)}`

  const isMaxLevel = upgrade.maxLevel === octeractUpgrades[upgradeKey].level
  const color = isMaxLevel ? 'plum' : 'white'

  const nameHTML = `<span style="color: gold">${name}</span>`
  const descriptionHTML = `<span style="color: lightblue">${upgrade.description()}</span>`

  const freeLevelMultText = freeLevelMult > 1
    ? `<span style="color: crimson"> (x${format(freeLevelMult, 2, true)})</span>`
    : ''

  let freeLevelText = player.octUpgrades[upgradeKey].freeLevel > 0
    ? `<span style="color: orange"> [+${
      format(player.octUpgrades[upgradeKey].freeLevel, 3, true)
    }${freeLevelMultText}]</span>`
    : ''

  if (freeLevelsWithMult > octeractUpgrades[upgradeKey].level) {
    freeLevelText = `${freeLevelText} <span style="color: var(--maroon-text-color)">${
      i18next.t('general.softCapped')
    }</span>`
  }

  const effectiveLevelText = totalEffectiveLevels
      !== octeractUpgrades[upgradeKey].level + player.octUpgrades[upgradeKey].freeLevel
    ? `<br><b><span style="color: white">${
      i18next.t('general.effectiveLevel', {
        level: format(totalEffectiveLevels, 3, true)
      })
    }</span></b>`
    : ''

  const fullyCapped = upgradeKey in dailyOcteractFreeUpgradeTable
    && isOcteractFreeLevelAtHighestCap(upgradeKey as DailyOcteractFreeUpgradeKey)
    && isMaxLevel
  const fullyCappedText = fullyCapped
    ? `<span style="color: gold" role="img" aria-label="${i18next.t('general.fullyCapped')}"> ★</span>`
    : ''

  const levelHTML = `<span style="color: ${color}"> ${i18next.t('general.level')} ${
    format(octeractUpgrades[upgradeKey].level, 0, true)
  }${maxLevel}${freeLevelText}${fullyCappedText}</span>`

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

  const costHTML = (octeractUpgrades[upgradeKey].level === upgrade.maxLevel && upgrade.maxLevel !== -1)
    ? ''
    : `${
      i18next.t('octeract.toString.costNextLevel', {
        amount: format(costNextLevel, 2)
      })
    } ${affordableInfo}`

  const investedOcteractsHTML = player.octUpgrades[upgradeKey].octeractsInvested > 0
    ? `<br><span style="color: turquoise">${
      i18next.t('octeract.toString.spentOcteracts', {
        spent: format(player.octUpgrades[upgradeKey].octeractsInvested, 2)
      })
    }</span>`
    : ''

  const qualityOfLifeText = upgrade.qualityOfLife
    ? `<br><span style="color: orchid">${i18next.t('general.alwaysEnabled')}</span>`
    : ''

  const maxLevelAPHTML = `<br>${
    i18next.t('general.upgradeAPMax', {
      amount: 8,
      check: isOcteractUpgradeMaxed(upgradeKey) ? '✔' : '✖'
    })
  }`
  const freeLevelAPHTML = hasOcteractFreeLevelCap(upgradeKey)
    ? `<br>${
      i18next.t('general.upgradeAPFreeLevelCap', {
        amount: 8,
        check: isOcteractFreeLevelAtHighestCap(upgradeKey) ? '✔' : '✖'
      })
    }`
    : ''

  return `${nameHTML}<br>${levelHTML}${effectiveLevelText}<br>${descriptionHTML}<br>${effectHTML}<br>${costHTML}${investedOcteractsHTML}${qualityOfLifeText}${maxLevelAPHTML}${freeLevelAPHTML}`
}

export const buyOcteractUpgradeLevel = async (
  upgradeKey: OcteractUpgrades,
  event: MouseEvent,
  buyMax = false
): Promise<void> => {
  const upgrade = octeractUpgrades[upgradeKey]
  if (upgrade.level === upgrade.maxLevel) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  const purchaseOptions = {
    getMaxLevels: () => upgrade.maxLevel - upgrade.level,
    getBalance: () => player.wowOcteracts,
    getCost: (levels: number) => upgrade.costFormula(upgrade.level + levels) - upgrade.costFormula(upgrade.level)
  }
  const initialPurchase = calculateSingularityUpgradePurchase(purchaseOptions, 1, 'levels')
  if (initialPurchase === null || initialPurchase.levels <= 0) {
    return Alert(i18next.t('singularity.goldenQuarks.poor'))
  }

  const selectedPurchase = event.shiftKey || buyMax
    ? await PurchasePrompt({
      ...purchaseOptions,
      title: upgrade.name(),
      getLevel: () => upgrade.level,
      getMaxLevel: () => upgrade.maxLevel,
      resource: 'octeracts'
    })
    : initialPurchase
  if (selectedPurchase === null || selectedPurchase.levels <= 0) {
    return
  }

  const purchase = calculateSingularityUpgradePurchase(
    {
      ...purchaseOptions,
      getBalance: () => Math.min(purchaseOptions.getBalance(), selectedPurchase.cost)
    },
    selectedPurchase.levels,
    'levels'
  )
  if (purchase === null || purchase.levels <= 0) {
    return Alert(i18next.t('singularity.goldenQuarks.poor'))
  }

  const { levels: levelsToPurchase, cost } = purchase
  player.wowOcteracts -= cost
  upgrade.level += levelsToPurchase
  player.octUpgrades[upgradeKey].octeractsInvested = upgrade.costFormula(upgrade.level)
  updateTokens()
  updateMaxTokens()
  if (levelsToPurchase > 1) {
    return Alert(i18next.t('octeract.buyLevel.multiBuy', { n: format(levelsToPurchase) }))
  }
}

export const getOcteractUpgradeEffect = <
  T extends OcteractUpgrades,
  K extends keyof OcteractUpgradeRewards[T]
>(upgradeKey: T, key: K): OcteractUpgradeRewards[T][K] => {
  const upgrade = octeractUpgrades[upgradeKey]
  const totalLevels = actualOcteractUpgradeTotalLevels(upgradeKey)
  return upgrade.effect(totalLevels, key) as OcteractUpgradeRewards[T][K]
}
