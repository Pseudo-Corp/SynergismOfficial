import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { getAchievementReward } from '../../../../Achievements'
import { calculateSigmoidExponential } from '../../../../Calculate'
import { getLevelMilestone } from '../../../../Levels'
import { AntSacrificeTiers } from '../../../../Reset'
import { format, formatAsPercentIncrease, player } from '../../../../Synergism'
import { getAntUpgradeEffect } from '../lib/upgrade-effects'
import { type AntUpgradeData, AntUpgrades } from '../structs/structs'

export const antUpgradeData: { [K in AntUpgrades]: AntUpgradeData<K> } = {
  [AntUpgrades.AntSpeed]: {
    baseCost: Decimal.fromString('100'),
    costIncreaseExponent: 1,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('inceptusAutobuy')),
    name: () => i18next.t('ants.upgrades.antSpeed.name'),
    intro: () => i18next.t('ants.upgrades.antSpeed.intro'),
    description: () => {
      let baseMul = 1.1
      baseMul += player.researches[101] / 1000 // Research 5x1
      baseMul += player.researches[162] / 1000 // Research 7x12
      return i18next.t('ants.upgrades.antSpeed.description', { x: format(baseMul, 3, true) })
    },
    effect: (n: number) => {
      let baseMul = 1.1
      baseMul += player.researches[101] / 1000 // Research 5x1
      baseMul += player.researches[162] / 1000 // Research 7x12
      return {
        antSpeed: Decimal.pow(baseMul, n)
      }
    },
    effectDescription: () => {
      const antSpeed = getAntUpgradeEffect(AntUpgrades.AntSpeed).antSpeed
      return i18next.t('ants.upgrades.antSpeed.effect', { x: format(antSpeed, 2, true) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.antSpeed.lockedAutomation')
  },
  [AntUpgrades.Coins]: {
    baseCost: Decimal.fromString('100'),
    costIncreaseExponent: 1,
    antUpgradeHTML: {
      color: 'yellow'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('fortunaeAutobuy')),
    name: () => i18next.t('ants.upgrades.coins.name'),
    intro: () => i18next.t('ants.upgrades.coins.intro'),
    description: () => i18next.t('ants.upgrades.coins.description'),
    effect: (n: number) => {
      let divisor = 1
      if (player.currentChallenge.ascension === 15) {
        divisor = 100 + 9900 * (1000 + n) / (1000 + n ** 2)
      }
      const baseExponent = 999999 + calculateSigmoidExponential(49000001, n / 3000)
      const bonusExponent = 250 * n
      const exponent = (baseExponent + bonusExponent) / divisor
      const coinMult = Decimal.max(1, Decimal.pow(player.ants.crumbs, exponent))
      return {
        crumbToCoinExp: exponent,
        coinMultiplier: coinMult
      }
    },
    effectDescription: () => {
      const crumbToCoinExp = getAntUpgradeEffect(AntUpgrades.Coins).crumbToCoinExp
      const overallEffect = Decimal.max(1, Decimal.pow(player.ants.crumbs, crumbToCoinExp))
      const effect1 = i18next.t('ants.upgrades.coins.effect', { x: format(crumbToCoinExp, 0, true) })
      const effect2 = i18next.t('ants.upgrades.coins.effect2', { x: format(overallEffect, 2, true) })
      return `${effect1}<br>${effect2}`
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.coins.lockedAutomation')
  },
  [AntUpgrades.Taxes]: {
    baseCost: Decimal.fromString('1000'),
    costIncreaseExponent: 1,
    antUpgradeHTML: {
      color: 'lightgray'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('tributumAutobuy')),
    name: () => i18next.t('ants.upgrades.taxes.name'),
    intro: () => i18next.t('ants.upgrades.taxes.intro'),
    description: () => i18next.t('ants.upgrades.taxes.description'),
    effect: (n: number) => {
      return {
        taxReduction: 0.005 + 0.995 * Math.pow(0.99, n)
      }
    },
    effectDescription: () => {
      const taxReduction = getAntUpgradeEffect(AntUpgrades.Taxes).taxReduction
      return i18next.t('ants.upgrades.taxes.effect', { x: formatAsPercentIncrease(taxReduction, 4) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.taxes.lockedAutomation')
  },
  [AntUpgrades.AcceleratorBoosts]: {
    baseCost: Decimal.fromString('1000'),
    costIncreaseExponent: 1,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('celeritasAutobuy')),
    name: () => i18next.t('ants.upgrades.acceleratorBoosts.name'),
    intro: () => i18next.t('ants.upgrades.acceleratorBoosts.intro'),
    description: () => i18next.t('ants.upgrades.acceleratorBoosts.description'),
    effect: (n: number) => {
      return {
        acceleratorBoostMult: calculateSigmoidExponential(20, n / 1000)
      }
    },
    effectDescription: () => {
      const acceleratorBoostMult = getAntUpgradeEffect(AntUpgrades.AcceleratorBoosts).acceleratorBoostMult
      return i18next.t('ants.upgrades.acceleratorBoosts.effect', {
        x: formatAsPercentIncrease(acceleratorBoostMult, 2)
      })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.acceleratorBoosts.lockedAutomation')
  },
  [AntUpgrades.Multipliers]: {
    baseCost: Decimal.fromString('1e5'),
    costIncreaseExponent: 2,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('exploratoremAutobuy')),
    name: () => i18next.t('ants.upgrades.multipliers.name'),
    intro: () => i18next.t('ants.upgrades.multipliers.intro'),
    description: () => i18next.t('ants.upgrades.multipliers.description'),
    effect: (n: number) => {
      return {
        multiplierMult: calculateSigmoidExponential(40, n / 1000)
      }
    },
    effectDescription: () => {
      const multiplierMult = getAntUpgradeEffect(AntUpgrades.Multipliers).multiplierMult
      return i18next.t('ants.upgrades.multipliers.effect', { x: formatAsPercentIncrease(multiplierMult, 2) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.multipliers.lockedAutomation')
  },
  [AntUpgrades.Offerings]: {
    baseCost: Decimal.fromString('1e6'),
    costIncreaseExponent: 2,
    antUpgradeHTML: {
      color: 'orange'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('sacrificiumAutobuy')),
    name: () => i18next.t('ants.upgrades.offerings.name'),
    intro: () => i18next.t('ants.upgrades.offerings.intro'),
    description: () => i18next.t('ants.upgrades.offerings.description'),
    effect: (n: number) => {
      return {
        offeringMult: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const offeringMult = getAntUpgradeEffect(AntUpgrades.Offerings).offeringMult
      return i18next.t('ants.upgrades.offerings.effect', { x: formatAsPercentIncrease(offeringMult, 2) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.offerings.lockedAutomation')
  },
  [AntUpgrades.BuildingCostScale]: {
    baseCost: Decimal.fromString('1e11'),
    costIncreaseExponent: 2,
    antUpgradeHTML: {
      color: 'lime'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('hicAutobuy')),
    name: () => i18next.t('ants.upgrades.buildingCostScale.name'),
    intro: () => i18next.t('ants.upgrades.buildingCostScale.intro'),
    description: () => i18next.t('ants.upgrades.buildingCostScale.description'),
    effect: (n: number) => {
      const scalePercent = 3 * n
      const buildingPowerMult = 1 + n / 100
      return {
        buildingCostScale: scalePercent / 100,
        buildingPowerMult
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.BuildingCostScale)
      const effect1 = i18next.t('ants.upgrades.buildingCostScale.effect', {
        x: formatAsPercentIncrease(1 + effects.buildingCostScale, 2)
      })
      const effect2 = i18next.t('ants.upgrades.buildingCostScale.effect2', {
        x: format(effects.buildingPowerMult, 2, true)
      })
      return `${effect1}<br>${effect2}`
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.buildingCostScale.lockedAutomation')
  },
  [AntUpgrades.Salvage]: {
    baseCost: Decimal.fromString('1e15'),
    costIncreaseExponent: 3,
    antUpgradeHTML: {
      color: 'green'
    },
    minimumResetTier: AntSacrificeTiers.ascension,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('scientiaAutobuy')),
    name: () => i18next.t('ants.upgrades.salvage.name'),
    intro: () => i18next.t('ants.upgrades.salvage.intro'),
    description: () => i18next.t('ants.upgrades.salvage.description'),
    effect: (n: number) => {
      return {
        salvage: 120 * (1 - Math.pow(0.995, n))
      }
    },
    effectDescription: () => {
      const salvage = getAntUpgradeEffect(AntUpgrades.Salvage).salvage
      return i18next.t('ants.upgrades.salvage.effect', { x: format(salvage, 2) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.salvage.lockedAutomation')
  },
  [AntUpgrades.FreeRunes]: {
    baseCost: Decimal.fromString('1e20'),
    costIncreaseExponent: 3,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('praemoenioAutobuy')),
    name: () => i18next.t('ants.upgrades.freeRunes.name'),
    intro: () => i18next.t('ants.upgrades.freeRunes.intro'),
    description: () => i18next.t('ants.upgrades.freeRunes.description'),
    effect: (n: number) => {
      return {
        freeRuneLevel: 3000 * (1 - Math.pow(1 - 1 / 3000, n))
      }
    },
    effectDescription: () => {
      const freeRuneLevel = getAntUpgradeEffect(AntUpgrades.FreeRunes).freeRuneLevel
      return i18next.t('ants.upgrades.freeRunes.effect', { x: format(freeRuneLevel, 0, true) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.freeRunes.lockedAutomation')
  },
  [AntUpgrades.Obtainium]: {
    baseCost: Decimal.fromString('1e6'),
    costIncreaseExponent: 2,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('experientiaAutobuy')),
    name: () => i18next.t('ants.upgrades.obtainium.name'),
    intro: () => i18next.t('ants.upgrades.obtainium.intro'),
    description: () => i18next.t('ants.upgrades.obtainium.description'),
    effect: (n: number) => {
      return {
        obtainiumMult: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const obtainiumMult = getAntUpgradeEffect(AntUpgrades.Obtainium).obtainiumMult
      return i18next.t('ants.upgrades.obtainium.effect', { x: formatAsPercentIncrease(obtainiumMult, 2) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.obtainium.lockedAutomation')
  },
  [AntUpgrades.AntSacrifice]: {
    baseCost: Decimal.fromString('1e120'),
    costIncreaseExponent: 20,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getAchievementReward('phylacteriumAutobuy')),
    name: () => i18next.t('ants.upgrades.antSacrifice.name'),
    intro: () => i18next.t('ants.upgrades.antSacrifice.intro'),
    description: () => i18next.t('ants.upgrades.antSacrifice.description'),
    effect: (n: number) => {
      return {
        antSacrificeMultiplier: Math.pow(1 + n / 10, 0.5),
        elo: Math.round(5 * Math.min(200, n))
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.AntSacrifice)
      const effect1 = i18next.t('ants.upgrades.antSacrifice.effect', {
        x: formatAsPercentIncrease(effects.antSacrificeMultiplier, 2)
      })
      const effect2 = i18next.t('ants.upgrades.antSacrifice.effect2', { x: format(effects.elo, 0, true) })
      return `${effect1}<br>${effect2}`
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.antSacrifice.lockedAutomation')
  },
  [AntUpgrades.Mortuus]: {
    baseCost: Decimal.fromString('1e300'),
    costIncreaseExponent: 100,
    antUpgradeHTML: {
      color: 'gray'
    },
    minimumResetTier: AntSacrificeTiers.ascension,
    exemptFromCorruption: true,
    autobuy: () => player.researches[145] > 0,
    name: () => i18next.t('ants.upgrades.mortuus.name'),
    intro: () => i18next.t('ants.upgrades.mortuus.intro'),
    description: () => i18next.t('ants.upgrades.mortuus.description'),
    effect: (n: number) => {
      return {
        talismanUnlock: n > 0,
        globalSpeed: 2 - Math.pow(0.99, n)
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.Mortuus)
      const effect1 = i18next.t('ants.upgrades.mortuus.effect', { checkMark: effects.talismanUnlock ? '✔️' : '❌' })
      const effect2 = i18next.t('ants.upgrades.mortuus.effect2', { x: formatAsPercentIncrease(effects.globalSpeed, 2) })
      return `${effect1}<br>${effect2}`
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.mortuus.lockedAutomation')
  },
  [AntUpgrades.AntELO]: {
    baseCost: Decimal.fromString('1e70'),
    costIncreaseExponent: 4,
    antUpgradeHTML: {
      color: '#FF766A'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    exemptFromCorruption: false,
    autobuy: () => Boolean(getLevelMilestone('antSpeed2Autobuyer')),
    name: () => i18next.t('ants.upgrades.antSpeed2.name'),
    intro: () => i18next.t('ants.upgrades.antSpeed2.intro'),
    description: () => i18next.t('ants.upgrades.antSpeed2.description'),
    effect: (n: number) => {
      const antSacrificeLimitCount = n + 200 * Math.min(1, n)
      const upgradeImprover = Math.min(n, +getAchievementReward('antSpeed2UpgradeImprover'))
      const effectiveSacs = Math.min(
        antSacrificeLimitCount + upgradeImprover,
        player.ants.antSacrificeCount + upgradeImprover
      )
      const antELO = effectiveSacs
      return {
        antELO: antELO,
        antSacrificeLimitCount: antSacrificeLimitCount
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.AntELO)
      const effect1 = i18next.t('ants.upgrades.antSpeed2.effect', { x: format(effects.antELO, 2, true) })
      const effect2 = i18next.t('ants.upgrades.antSpeed2.effect2', {
        x: format(effects.antSacrificeLimitCount, 0, true)
      })
      return `${effect1}<br>${effect2}`
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.antSpeed2.lockedAutomation')
  },
  [AntUpgrades.Mortuus2]: {
    baseCost: Decimal.fromString('1e37777'),
    costIncreaseExponent: 2000,
    antUpgradeHTML: {
      color: 'darkgray'
    },
    minimumResetTier: AntSacrificeTiers.singularity,
    exemptFromCorruption: true,
    autobuy: () => Boolean(getLevelMilestone('mortuus2Autobuyer')),
    name: () => i18next.t('ants.upgrades.mortuus2.name'),
    intro: () => i18next.t('ants.upgrades.mortuus2.intro'),
    description: () => i18next.t('ants.upgrades.mortuus2.description'),
    effect: (n: number) => {
      const talismanMaxLevels = Math.min(1200, Math.floor(n / 2))
      const talismanEffectBuff = 1 + 0.9 * (1 - Math.pow(0.999, n)) + 0.005 * Math.min(20, n)
      const ascensionSpeed = 2 - Math.pow(0.996, n)
      return {
        talismanLevelIncreaser: talismanMaxLevels,
        talismanEffectBuff: talismanEffectBuff,
        ascensionSpeed: ascensionSpeed
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.Mortuus2)
      const effect1 = i18next.t('ants.upgrades.mortuus2.effect', { x: format(effects.talismanLevelIncreaser, 0, true) })
      const effect2 = i18next.t('ants.upgrades.mortuus2.effect2', {
        x: formatAsPercentIncrease(effects.talismanEffectBuff, 2)
      })
      const effect3 = i18next.t('ants.upgrades.mortuus2.effect3', {
        x: formatAsPercentIncrease(effects.ascensionSpeed, 2)
      })
      return `${effect1}<br>${effect2}<br>${effect3}`
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.mortuus2.lockedAutomation')
  },
  [AntUpgrades.AscensionScore]: {
    baseCost: Decimal.fromString('1e300'),
    costIncreaseExponent: 2,
    antUpgradeHTML: {
      color: 'orange'
    },
    minimumResetTier: AntSacrificeTiers.ascension,
    exemptFromCorruption: true,
    autobuy: () => Boolean(getLevelMilestone('ascensionScoreAutobuyer')),
    name: () => i18next.t('ants.upgrades.ascensionScore.name'),
    intro: () => i18next.t('ants.upgrades.ascensionScore.intro'),
    description: () => i18next.t('ants.upgrades.ascensionScore.description'),
    effect: (n: number) => {
      const ascensionScoreBase = 100000 * (1 - Math.pow(0.999, n))
      const bankedCubes = 4 * Math.min(200, n) + n
      return {
        cubesBanked: bankedCubes,
        ascensionScoreBase: ascensionScoreBase
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.AscensionScore)
      const effect1 = i18next.t('ants.upgrades.ascensionScore.effect', {
        x: format(effects.ascensionScoreBase, 0, true)
      })
      const effect2 = i18next.t('ants.upgrades.ascensionScore.effect2', { x: format(effects.cubesBanked, 0, true) })
      return `${effect1}<br>${effect2}`
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.ascensionScore.lockedAutomation')
  },
  [AntUpgrades.WowCubes]: {
    baseCost: Decimal.fromString('1e400'),
    costIncreaseExponent: 10,
    minimumResetTier: AntSacrificeTiers.ascension,
    exemptFromCorruption: true,
    autobuy: () => Boolean(getLevelMilestone('wowCubesAutobuyer')),
    name: () => i18next.t('ants.upgrades.wowCubes.name'),
    intro: () => i18next.t('ants.upgrades.wowCubes.intro'),
    description: () => i18next.t('ants.upgrades.wowCubes.description'),
    antUpgradeHTML: {
      color: '#66FFFF'
    },
    effect: (n: number) => {
      return {
        wowCubes: 2 - Math.pow(0.999, n)
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.WowCubes)
      return i18next.t('ants.upgrades.wowCubes.effect', { x: formatAsPercentIncrease(effects.wowCubes, 2) })
    },
    lockedAutoDescription: () => i18next.t('ants.upgrades.wowCubes.lockedAutomation')
  }
}
