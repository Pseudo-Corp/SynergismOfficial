import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { calculateSigmoidExponential } from '../../../../Calculate'
import { AntSacrificeTiers } from '../../../../Reset'
import { format, formatAsPercentIncrease, player } from '../../../../Synergism'
import { getAntUpgradeEffect } from '../lib/upgrade-effects'
import { type AntUpgradeData, AntUpgrades } from '../structs/structs'

export const antUpgradeData: { [K in AntUpgrades]: AntUpgradeData<K> } = {
  [AntUpgrades.AntSpeed]: {
    baseCost: new Decimal(100),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
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
    }
  },
  [AntUpgrades.Coins]: {
    baseCost: new Decimal(100),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'yellow'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    name: () => i18next.t('ants.upgrades.coins.name'),
    intro: () => i18next.t('ants.upgrades.coins.intro'),
    description: () => i18next.t('ants.upgrades.coins.description'),
    effect: (n: number) => {
      let divisor = player.corruptions.used.corruptionEffects('extinction')
      if (player.currentChallenge.ascension === 15) {
        divisor *= 1000
      }
      const exponent = (99999 + calculateSigmoidExponential(49900001, n / 5000 * 500 / 499)) / divisor
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
    }
  },
  [AntUpgrades.Taxes]: {
    baseCost: new Decimal(1000),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'lightgray'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
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
    }
  },
  [AntUpgrades.AcceleratorBoosts]: {
    baseCost: new Decimal(1000),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    name: () => i18next.t('ants.upgrades.acceleratorBoosts.name'),
    intro: () => i18next.t('ants.upgrades.acceleratorBoosts.intro'),
    description: () => i18next.t('ants.upgrades.acceleratorBoosts.description'),
    effect: (n: number) => {
      return {
        acceleratorBoostMult: calculateSigmoidExponential(40, n / 1000 * 40 / 39)
      }
    },
    effectDescription: () => {
      const acceleratorBoostMult = getAntUpgradeEffect(AntUpgrades.AcceleratorBoosts).acceleratorBoostMult
      return i18next.t('ants.upgrades.acceleratorBoosts.effect', {
        x: formatAsPercentIncrease(acceleratorBoostMult, 2)
      })
    }
  },
  [AntUpgrades.Multipliers]: {
    baseCost: new Decimal(1e5),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    name: () => i18next.t('ants.upgrades.multipliers.name'),
    intro: () => i18next.t('ants.upgrades.multipliers.intro'),
    description: () => i18next.t('ants.upgrades.multipliers.description'),
    effect: (n: number) => {
      return {
        multiplierMult: calculateSigmoidExponential(40, n / 1000 * 80 / 79)
      }
    },
    effectDescription: () => {
      const multiplierMult = getAntUpgradeEffect(AntUpgrades.Multipliers).multiplierMult
      return i18next.t('ants.upgrades.multipliers.effect', { x: formatAsPercentIncrease(multiplierMult, 2) })
    }
  },
  [AntUpgrades.Offerings]: {
    baseCost: new Decimal(1e6),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'orange'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
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
    }
  },
  [AntUpgrades.BuildingCostScale]: {
    baseCost: new Decimal(1e11),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'lime'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    name: () => i18next.t('ants.upgrades.buildingCostScale.name'),
    intro: () => i18next.t('ants.upgrades.buildingCostScale.intro'),
    description: () => i18next.t('ants.upgrades.buildingCostScale.description'),
    effect: (n: number) => {
      const scalePercent = Math.min(9999999, 3 * n)
      return {
        buildingCostScale: scalePercent / 100
      }
    },
    effectDescription: () => {
      const buildingCostScale = getAntUpgradeEffect(AntUpgrades.BuildingCostScale).buildingCostScale
      return i18next.t('ants.upgrades.buildingCostScale.effect', {
        x: formatAsPercentIncrease(1 + buildingCostScale, 0)
      })
    }
  },
  [AntUpgrades.Salvage]: {
    baseCost: new Decimal(1e15),
    costIncrease: 1000,
    antUpgradeHTML: {
      color: 'green'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
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
    }
  },
  [AntUpgrades.FreeRunes]: {
    baseCost: new Decimal(1e20),
    costIncrease: 1000,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
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
    }
  },
  [AntUpgrades.Obtainium]: {
    baseCost: new Decimal(1e6),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
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
    }
  },
  [AntUpgrades.AntSacrifice]: {
    baseCost: new Decimal(1e120),
    costIncrease: 1e20,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
    name: () => i18next.t('ants.upgrades.antSacrifice.name'),
    intro: () => i18next.t('ants.upgrades.antSacrifice.intro'),
    description: () => i18next.t('ants.upgrades.antSacrifice.description'),
    effect: (n: number) => {
      return {
        antSacrificeMultiplier: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const antSacrificeMultiplier = getAntUpgradeEffect(AntUpgrades.AntSacrifice).antSacrificeMultiplier
      return i18next.t('ants.upgrades.antSacrifice.effect', { x: formatAsPercentIncrease(antSacrificeMultiplier, 2) })
    }
  },
  [AntUpgrades.Mortuus]: {
    baseCost: new Decimal(1e300),
    costIncrease: 1e100,
    antUpgradeHTML: {
      color: 'gray'
    },
    minimumResetTier: AntSacrificeTiers.sacrifice,
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
    }
  }
}
