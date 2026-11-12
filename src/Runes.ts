import {
  calculateFirstFiveRuneSalvage,
  calculateOfferings,
  calculateSalvageRuneEXPMultiplier,
  calculateTotalSalvage
} from './Calculate'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { AchievementGroup, awardAchievementGroup, getAchievementReward, updateProgressiveCache } from './Achievements'
import { getAmbrosiaUpgradeEffects } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { campaignTokenBonuses } from './Campaign'
import { getAntUpgradeEffect } from './Features/Ants/AntUpgrades/lib/upgrade-effects'
import { AntUpgrades } from './Features/Ants/AntUpgrades/structs/structs'
import { getLevelMilestone } from './Levels'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getPurpleAmbrosiaUpgradeEffects } from './PurpleAmbrosiaUpgrades'
import { resetTiers } from './Reset'
import { createShopUpgradeTypeIcon, getShopUpgradeEffects, ShopUpgradeGroups } from './Shop'
import { getSingularityChallengeEffect } from './SingularityChallenges'
import { firstFiveRuneEffectivenessStatsProduct, runeEffectivenessStatsSIProduct } from './Statistics'
import { Tabs } from './Tabs'
import { getRuneBonusFromAllTalismans, getTalismanEffects } from './Talismans'
import { toggleAutoSacrificeRune } from './Toggles'
import { CloseModal, Modal } from './UpdateHTML'
import { assert, isMobile, memoize, sumContents } from './Utility'

export enum RuneType {
  Speed = 0,
  Duplication = 1,
  Prism = 2,
  Thrift = 3,
  SuperiorIntellect = 4,
  InfiniteAscent = 5,
  Antiquities = 6,
  HorseShoe = 7,
  FiniteDescent = 8,
  TopHat = 9
}

export const allRuneTypes = Object.values(RuneType).filter((v): v is RuneType => typeof v === 'number')

type RuneTypeMap = {
  [RuneType.Speed]: {
    acceleratorPower: number
    multiplicativeAccelerators: number
    globalSpeed: number
  }
  [RuneType.Duplication]: {
    multiplierBoosts: number
    multiplicativeMultipliers: number
    taxReduction: number
  }
  [RuneType.Prism]: {
    productionLog10: number
    costDivisorLog10: number
  }
  [RuneType.Thrift]: {
    construction: number
    salvage: number
    taxReduction: number
  }
  [RuneType.SuperiorIntellect]: {
    offeringMult: number
    obtainiumMult: number
    antSpeed: number
  }
  [RuneType.InfiniteAscent]: {
    quarkMult: number
    cubeMult: number
    salvage: number
  }
  [RuneType.Antiquities]: {
    addCodeCooldownReduction: number
    offeringLog10: number
    obtainiumLog10: number
    cubeBonus: number
  }
  [RuneType.HorseShoe]: {
    ambrosiaLuck: number
    redLuck: number
    purpleHoneyLuck: number
  }
  [RuneType.FiniteDescent]: {
    cubesBanked: number
    corruptionFreeLevels: number
    infiniteAscentFreeLevel: number
  }
  [RuneType.TopHat]: {
    freeOfferingLevels: number
    freeObtainiumLevels: number
    freeCubeLevels: number
    freeSpeedLevels: number
    freeInfinityLevels: number
  }
}

interface RuneHTMLStyle {
  borderColor: string
  nameColor: string
}

interface RuneData<T extends RuneType, K extends keyof RuneTypeMap[T]> {
  key: string
  costCoefficient: Decimal
  levelsPerOOM: number
  ignoreChal9: boolean
  levelsPerOOMIncrease: () => number
  effectiveLevelMult: () => number
  freeLevels: () => number
  salvage: () => number
  isUnlocked: () => boolean
  minimalResetTier: keyof typeof resetTiers
  effects: (n: number, key: K) => RuneTypeMap[T][K]
  effectsDescription: () => string
  name: () => string
  description: () => string
  valueText: () => string
  runeHTMLStyle: RuneHTMLStyle
}

const salvagePerkLevels = [30, 40, 61, 81, 111, 131, 161, 191, 236, 260]

const firstFiveFreeLevels = () => {
  return (
    getAntUpgradeEffect(AntUpgrades.FreeRunes).freeRuneLevel
    + 7 * Math.min(player.constantUpgrades[7], 1000)
  )
}

const bonusRuneLevelsSpeed = () => {
  return (
    getRuneBonusFromAllTalismans(RuneType.Speed)
    + (
      player.upgrades[27] * (Math.min(50, Math.floor(Decimal.log(player.coinsThisPrestige.add(1), 1e10)))
        + Math.max(0, Math.min(50, Math.floor(Decimal.log(player.coinsThisPrestige.add(1), 1e50)) - 10)))
    )
    + (player.upgrades[29] > 0 ? Math.floor(Math.min(100, sumContents(player.coinBuildings) / 400)) : 0)
  )
}

const bonusRuneLevelsDuplication = () => {
  return (
    getRuneBonusFromAllTalismans(RuneType.Duplication)
    + (player.upgrades[28] > 0 ? Math.min(100, Math.floor(sumContents(player.coinBuildings) / 400)) : 0)
    + (
      player.upgrades[30] * (Math.min(50, Math.floor(Decimal.log(player.coinsThisPrestige.add(1), 1e30)))
        + Math.min(50, Math.floor(Decimal.log(player.coinsThisPrestige.add(1), 1e300))))
    )
  )
}

const bonusRuneLevelsPrism = () => {
  return (
    getRuneBonusFromAllTalismans(RuneType.Prism)
  )
}

const bonusRuneLevelsThrift = () => {
  return (
    getRuneBonusFromAllTalismans(RuneType.Thrift)
  )
}

const bonusRuneLevelsSI = () => {
  return (
    getRuneBonusFromAllTalismans(RuneType.SuperiorIntellect)
  )
}

const bonusRuneLevelsIA = () => {
  return (
    (PCoinUpgradeEffects.INSTANT_UNLOCK_2 ? 6 : 0)
    + player.cubeUpgrades[73]
    + campaignTokenBonuses.rune6()
    + getRuneBonusFromAllTalismans(RuneType.InfiniteAscent)
    + getRuneEffects(RuneType.FiniteDescent, 'infiniteAscentFreeLevel')
  )
}

const bonusRuneLevelsAntiquities = () => {
  return getRuneBonusFromAllTalismans(RuneType.Antiquities)
}

const bonusRuneLevelsHorseShoe = () => {
  return getRuneBonusFromAllTalismans(RuneType.HorseShoe)
    + getShopUpgradeEffects('shopHorseShoe', 'bonusHorseLevels')
}

const speedRuneOOMIncrease = () => {
  return (
    player.challengecompletions[2]
    + player.upgrades[66] * 2
    + player.researches[78]
    + player.researches[111]
    + player.challengecompletions[11]
    + 1.5 * player.challengecompletions[14]
    + player.cubeUpgrades[16]
    + getTalismanEffects('chronos').speedOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus', 'runeOOMBonus')
    + getLevelMilestone('speedRune')
  )
}

const duplicationRuneOOMIncrease = () => {
  return (
    0.8 * player.challengecompletions[1]
    + player.upgrades[66] * 2
    + player.researches[90]
    + player.researches[112]
    + player.challengecompletions[11]
    + 1.5 * player.challengecompletions[14]
    + getTalismanEffects('exemption').duplicationOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus', 'runeOOMBonus')
    + getLevelMilestone('duplicationRune')
  )
}

const prismRuneOOMIncrease = () => {
  return (
    0.6 * player.challengecompletions[3]
    + player.upgrades[66] * 2
    + player.researches[79]
    + player.researches[113]
    + player.challengecompletions[11]
    + 1.5 * player.challengecompletions[14]
    + player.cubeUpgrades[16]
    + getTalismanEffects('mortuus').prismOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus', 'runeOOMBonus')
    + getLevelMilestone('prismRune')
  )
}

const thriftRuneOOMIncrease = () => {
  return (
    0.4 * player.challengecompletions[4]
    + player.upgrades[66] * 2
    + player.researches[77]
    + player.researches[114]
    + player.challengecompletions[11]
    + 1.5 * player.challengecompletions[14]
    + player.cubeUpgrades[37]
    + getTalismanEffects('midas').thriftOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus', 'runeOOMBonus')
    + getLevelMilestone('thriftRune')
  )
}

const superiorIntellectOOMIncrease = () => {
  return (
    0.2 * player.challengecompletions[5]
    + player.upgrades[66] * 2
    + player.researches[115]
    + player.challengecompletions[11]
    + 1.5 * player.challengecompletions[14]
    + player.cubeUpgrades[37]
    + getTalismanEffects('polymath').SIOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus', 'runeOOMBonus')
    + getLevelMilestone('SIRune')
  )
}

const infiniteAscentOOMIncrease = () => {
  return (
    getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus', 'infiniteAscentOOMBonus')
  )
}

const antiquitiesOOMIncrease = () => {
  return getPurpleAmbrosiaUpgradeEffects('capricorn', 'antiquitiesOfAntGodCoefficient')
}

const horseShoeOOMIncrease = () => {
  return getPurpleAmbrosiaUpgradeEffects('sagittarius', 'horseShoeRuneCoefficient')
}

export const firstFiveEffectiveRuneLevelMult = () => {
  return firstFiveRuneEffectivenessStatsProduct()
}

export const SIEffectiveRuneLevelMult = () => {
  return runeEffectivenessStatsSIProduct()
}

const runeEXPMult = (purchasedLevels: number, salvage: number): Decimal => {
  // recycleMult accounted for all recycle chance, but inversed so it's a multiplier instead
  const recycleMultiplier = calculateSalvageRuneEXPMultiplier(salvage)

  // Rune multiplier that is summed instead of added
  /* TODO: Replace the effects of these upgrades with new ones
    const allRuneExpAdditiveMultiplier = sumContents([
        // Reincarnation 2x1
        1 * player.upgrades[66]
      ])
    }*/
  const allRuneExpAdditiveMultiplier = (
    // Base amount multiplied per offering
    1
    // +1 if C1 completion
    + Math.min(1, player.highestchallengecompletions[1])
    // +0.10 per C1 completion
    + (0.4 / 10) * player.highestchallengecompletions[1]
    // Research 5x2
    + 0.6 * player.researches[22]
    // Research 5x3
    + 0.3 * player.researches[23]
    // Particle upgrade 3x1
    + (player.upgrades[71] * purchasedLevels) / 25
  )

  // Rune multiplier that gets applied to all runes
  const allRuneExpMultiplier = [
    // Research 4x16
    1 + player.researches[91] / 20,
    // Research 4x17
    1 + player.researches[92] / 20,
    // Cube Upgrade Bonus
    1 + (player.ascensionCounter / 1000) * player.cubeUpgrades[32],
    // Constant Upgrade Multiplier
    1 + (1 / 10) * player.constantUpgrades[8],
    // Challenge 15 reward multiplier
    G.challenge15Rewards.runeExp.value
  ].reduce((x, y) => x.times(y), new Decimal('1'))

  return allRuneExpMultiplier.times(allRuneExpAdditiveMultiplier).times(recycleMultiplier)
}

const runeSalvageHTML = (rune: RuneType) => {
  const globalSalvage = calculateTotalSalvage()
  const salvage = runes[rune].salvage()
  const lines = [i18next.t('runes.salvageModal.global', { amount: format(globalSalvage, 1, true) })]
  if (salvage !== globalSalvage) {
    lines.push(i18next.t('runes.salvageModal.modifiers', {
      name: runes[rune].name(),
      amount: format(salvage - globalSalvage, 1, true)
    }))
  }
  const recycle = calculateSalvageRuneEXPMultiplier(salvage)
  lines.push(
    salvage >= 0
      ? i18next.t('runes.salvageModal.total', { amount: format(salvage, 1, true), mult: format(recycle, 2, true) })
      : i18next.t('runes.salvageModal.totalNegative', {
        amount: format(salvage, 1, true),
        div: format(Decimal.pow(recycle, -1), 2, true)
      })
  )
  return lines.join('<br>')
}

const runeConstructionEffect = (power: number) => power > 0 ? 0.03 * Math.pow(1 + Math.log(1 + power), 2) : 0

export const runes: { [K in RuneType]: RuneData<K, keyof RuneTypeMap[K]> } = {
  [RuneType.Speed]: {
    key: 'speed',
    costCoefficient: new Decimal(50),
    levelsPerOOM: 150,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => speedRuneOOMIncrease(),
    effects: (n, key) => {
      if (key === 'acceleratorPower') {
        return 0.0002 * n
      } else if (key === 'multiplicativeAccelerators') {
        return 1 + n / 400
      } else {
        return 2 - Math.exp(-Math.cbrt(n) / 100) // globalSpeed
      }
    },
    effectsDescription: () => {
      const acceleratorPower = getRuneEffects(RuneType.Speed, 'acceleratorPower')
      const multiplicativeAccelerators = getRuneEffects(RuneType.Speed, 'multiplicativeAccelerators')
      const globalSpeed = getRuneEffects(RuneType.Speed, 'globalSpeed')
      const acceleratorPowerText = i18next.t('runes.speed.acceleratorPower', {
        val: format(100 * acceleratorPower, 2)
      })
      const multiplicativeAcceleratorsText = i18next.t('runes.speed.freeAccelerators', {
        val: formatAsPercentIncrease(multiplicativeAccelerators, 2)
      })
      const globalSpeedText = i18next.t('runes.speed.globalSpeed', {
        val: formatAsPercentIncrease(globalSpeed, 3)
      })
      return `${acceleratorPowerText}<br>${multiplicativeAcceleratorsText}<br>${globalSpeedText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsSpeed(),
    salvage: () => calculateFirstFiveRuneSalvage(),
    isUnlocked: () => true,
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.speed.name'),
    description: () => i18next.t('runes.speed.description'),
    valueText: () => i18next.t('runes.speed.values'),
    runeHTMLStyle: {
      borderColor: 'var(--maroon-color)',
      nameColor: 'var(--tomato-color)'
    }
  },
  [RuneType.Duplication]: {
    key: 'duplication',
    costCoefficient: new Decimal(20000),
    levelsPerOOM: 120,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => duplicationRuneOOMIncrease(),
    effects: (n, key) => {
      if (key === 'multiplierBoosts') {
        return n / 5
      } else if (key === 'multiplicativeMultipliers') {
        return 1 + n / 400
      } else {
        return 0.001 + .999 * Math.exp(-Math.cbrt(n) / 5) // taxReduction
      }
    },
    effectsDescription: () => {
      const multiplierBoosts = getRuneEffects(RuneType.Duplication, 'multiplierBoosts')
      const multiplicativeMultipliers = getRuneEffects(RuneType.Duplication, 'multiplicativeMultipliers')
      const taxReduction = getRuneEffects(RuneType.Duplication, 'taxReduction')
      const multiplierPowerBoostsText = i18next.t('runes.duplication.multiplierPower', {
        val: format(multiplierBoosts, 2, true)
      })
      const multiplicativeMultipliersText = i18next.t('runes.duplication.freeMultipliers', {
        val: formatAsPercentIncrease(multiplicativeMultipliers, 2)
      })
      const taxReductionText = i18next.t('runes.duplication.taxReduction', {
        val: format(100 * (1 - taxReduction), 4, true)
      })
      return `${multiplierPowerBoostsText}<br>${multiplicativeMultipliersText}<br>${taxReductionText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsDuplication(),
    salvage: () => calculateFirstFiveRuneSalvage(),
    isUnlocked: () => getAchievementReward('duplicationRuneUnlock'),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.duplication.name'),
    description: () => i18next.t('runes.duplication.description'),
    valueText: () => i18next.t('runes.duplication.values'),
    runeHTMLStyle: {
      borderColor: 'var(--purple-color)',
      nameColor: 'var(--orchid-color)'
    }
  },
  [RuneType.Prism]: {
    key: 'prism',
    costCoefficient: new Decimal(5e5),
    levelsPerOOM: 90,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => prismRuneOOMIncrease(),
    effects: (n, key) => {
      if (key === 'productionLog10') {
        return Math.max(0, 2 * Math.log10(1 + n / 2) + (n / 2) * Math.log10(2) - Math.log10(256))
      } else {
        return Math.floor(n / 10) // costDivisorLog10
      }
    },
    effectsDescription: () => {
      const productionLog10 = getRuneEffects(RuneType.Prism, 'productionLog10')
      const costDivisorLog10 = getRuneEffects(RuneType.Prism, 'costDivisorLog10')
      const productionText = i18next.t('runes.prism.crystalProduction', {
        val: format(Decimal.pow(10, productionLog10), 2, true)
      })
      const costReductionText = i18next.t('runes.prism.costDivisor', {
        val: format(Decimal.pow(10, costDivisorLog10), 0, true)
      })
      return `${productionText}<br>${costReductionText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsPrism(),
    salvage: () => calculateFirstFiveRuneSalvage(),
    isUnlocked: () => getAchievementReward('prismRuneUnlock'),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.prism.name'),
    description: () => i18next.t('runes.prism.description'),
    valueText: () => i18next.t('runes.prism.values'),
    runeHTMLStyle: {
      borderColor: 'var(--lightblue-color)',
      nameColor: 'var(--cyan-color)'
    }
  },
  [RuneType.Thrift]: {
    key: 'thrift',
    costCoefficient: new Decimal(2.5e7),
    levelsPerOOM: 60,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => thriftRuneOOMIncrease(),
    effects: (n, key) => {
      if (key === 'construction') {
        return runeConstructionEffect(n)
      } else if (key === 'salvage') {
        return 2.5 * Math.log(1 + n / 10)
      } else {
        return 0.01 + 0.99 * Math.exp(-Math.cbrt(n) / 10) // taxReduction
      }
    },
    effectsDescription: () => {
      const construction = getRuneEffects(RuneType.Thrift, 'construction')
      const salvage = getRuneEffects(RuneType.Thrift, 'salvage')
      const taxReduction = getRuneEffects(RuneType.Thrift, 'taxReduction')
      const constructionText = i18next.t('runes.thrift.construction', {
        val: format(construction, 3, true)
      })
      const salvageText = i18next.t('runes.thrift.salvage', { val: format(salvage, 2, true) })
      const taxReductionText = i18next.t('runes.thrift.taxReduction', {
        val: format(100 * (1 - taxReduction), 3, true)
      })
      return `${constructionText}<br>${salvageText}<br>${taxReductionText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsThrift(),
    salvage: () => calculateFirstFiveRuneSalvage(),
    isUnlocked: () => getAchievementReward('thriftRuneUnlock'),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.thrift.name'),
    description: () => i18next.t('runes.thrift.description'),
    valueText: () => i18next.t('runes.thrift.values'),
    runeHTMLStyle: {
      borderColor: 'var(--green-color)',
      nameColor: 'var(--lime-color)'
    }
  },
  [RuneType.SuperiorIntellect]: {
    key: 'superiorIntellect',
    costCoefficient: new Decimal(1e12),
    levelsPerOOM: 30,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => superiorIntellectOOMIncrease(),
    effects: (n, key) => {
      if (key === 'offeringMult') {
        return 1 + n / 2000
      } else if (key === 'obtainiumMult') {
        return 1 + n / 200
      } else {
        return Math.pow(1 + n / 500, 2) // antSpeed
      }
    },
    effectsDescription: () => {
      const offeringMult = getRuneEffects(RuneType.SuperiorIntellect, 'offeringMult')
      const obtainiumMult = getRuneEffects(RuneType.SuperiorIntellect, 'obtainiumMult')
      const antSpeed = getRuneEffects(RuneType.SuperiorIntellect, 'antSpeed')
      const offeringMultText = i18next.t('runes.superiorIntellect.offeringMult', {
        val: formatAsPercentIncrease(offeringMult, 2)
      })
      const obtainiumMultText = i18next.t('runes.superiorIntellect.obtainiumMult', {
        val: formatAsPercentIncrease(obtainiumMult, 2)
      })
      const antSpeedText = i18next.t('runes.superiorIntellect.antSpeed', { val: format(antSpeed, 2) })
      return `${offeringMultText}<br>${obtainiumMultText}<br>${antSpeedText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult() * SIEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsSI(),
    salvage: () => calculateFirstFiveRuneSalvage(),
    isUnlocked: () => player.researches[82] > 0,
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.superiorIntellect.name'),
    description: () => i18next.t('runes.superiorIntellect.description'),
    valueText: () => i18next.t('runes.superiorIntellect.values'),
    runeHTMLStyle: {
      borderColor: 'var(--blue-color)',
      nameColor: 'var(--turquoise-color)'
    }
  },
  [RuneType.InfiniteAscent]: {
    key: 'infiniteAscent',
    costCoefficient: new Decimal(1e75),
    levelsPerOOM: 1 / 2,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => infiniteAscentOOMIncrease(),
    effects: (n, key) => {
      if (key === 'quarkMult') {
        return 1 + n / 500 + (n > 0 ? 0.1 : 0)
      } else if (key === 'cubeMult') {
        return 1 + n / 100
      } else {
        return n * 0.025 * salvagePerkLevels.filter((x) => x <= player.highestSingularityCount).length // salvage
      }
    },
    effectsDescription: () => {
      const quarkMult = getRuneEffects(RuneType.InfiniteAscent, 'quarkMult')
      const cubeMult = getRuneEffects(RuneType.InfiniteAscent, 'cubeMult')
      const salvage = getRuneEffects(RuneType.InfiniteAscent, 'salvage')
      const quarkText = i18next.t('runes.infiniteAscent.quarkBonus', {
        val: formatAsPercentIncrease(quarkMult, 2)
      })
      const cubeText = i18next.t('runes.infiniteAscent.cubeBonus', {
        val: formatAsPercentIncrease(cubeMult, 2)
      })
      if (player.highestSingularityCount >= 30) {
        const salvageCoefficient = 0.025 * salvagePerkLevels.filter((x) => x <= player.highestSingularityCount).length
        const salvageText = `<span style="color: var(--lightgoldenrodyellow-color)">${
          i18next.t('runes.infiniteAscent.salvage', {
            val: format(salvage, 2, true),
            val2: format(salvageCoefficient, 3, true)
          })
        }</span>`
        return `${quarkText}<br>${cubeText}<br>${salvageText}`
      } else {
        return `${quarkText}<br>${cubeText}`
      }
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsIA(),
    salvage: () => calculateTotalSalvage(),
    isUnlocked: () => getShopUpgradeEffects('infiniteAscent', 'runeUnlocked'),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.infiniteAscent.name'),
    description: () => i18next.t('runes.infiniteAscent.description'),
    valueText: () => i18next.t('runes.infiniteAscent.values'),
    runeHTMLStyle: {
      borderColor: 'var(--gold-color)',
      nameColor: 'var(--lightgoldenrodyellow-color)'
    }
  },
  [RuneType.Antiquities]: {
    key: 'antiquities',
    costCoefficient: new Decimal(1e206),
    levelsPerOOM: 1 / 50,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => antiquitiesOOMIncrease(),
    effects: (n, key) => {
      if (key === 'addCodeCooldownReduction') {
        return n > 0 ? 0.8 - 0.3 * (n - 1) / (n + 10) : 1
      } else if (key === 'offeringLog10') {
        return n
      } else if (key === 'obtainiumLog10') {
        return n
      } else {
        return (n > 0) ? Math.pow(1.01, Math.min(5, n) * player.singularityCount) : 1 // cubeBonus
      }
    },
    effectsDescription: () => {
      const offeringLog10 = getRuneEffects(RuneType.Antiquities, 'offeringLog10')
      const obtainiumLog10 = getRuneEffects(RuneType.Antiquities, 'obtainiumLog10')
      const addCodeCooldownReduction = getRuneEffects(RuneType.Antiquities, 'addCodeCooldownReduction')
      const cubeBonus = getRuneEffects(RuneType.Antiquities, 'cubeBonus')
      const singularText = i18next.t('runes.antiquities.singularityUnlock', {
        symbol: player.runeLevels[RuneType.Antiquities] >= 1
          ? '<span class="rainbowText">✔</span>'
          : '<span class="red">✗</span>'
      })
      const offeringText = i18next.t('runes.antiquities.offeringBonus', {
        val: format(Decimal.pow(10, offeringLog10), 2, true)
      })
      const obtainiumText = i18next.t('runes.antiquities.obtainiumBonus', {
        val: format(Decimal.pow(10, obtainiumLog10), 2, true)
      })
      const addCodeCooldownReductionText = i18next.t('runes.antiquities.addCode', {
        val: formatAsPercentIncrease(addCodeCooldownReduction, 2)
      })
      const cubeBonusText = i18next.t('runes.antiquities.cubeBonus', {
        val: formatAsPercentIncrease(cubeBonus, 2)
      })
      return `${singularText}<br>${offeringText}<br>${obtainiumText}<br>${addCodeCooldownReductionText}<br>${cubeBonusText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsAntiquities(),
    salvage: () => calculateTotalSalvage(),
    isUnlocked: () => player.platonicUpgrades[20] > 0,
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.antiquities.name'),
    description: () => i18next.t('runes.antiquities.description'),
    valueText: () => i18next.t('runes.antiquities.values'),
    runeHTMLStyle: {
      borderColor: 'var(--white-color)',
      nameColor: 'var(--gainsboro-color)'
    }
  },
  [RuneType.HorseShoe]: {
    key: 'horseShoe',
    costCoefficient: new Decimal('1e500'),
    levelsPerOOM: 1 / 20,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => horseShoeOOMIncrease(),
    effects: (n, key) => {
      if (key === 'ambrosiaLuck') {
        return 2 * n
      } else if (key === 'redLuck') {
        return 2 * n / 5
      } else {
        return n / 5 // purpleHoneyLuck
      }
    },
    effectsDescription: () => {
      const ambrosiaLuck = getRuneEffects(RuneType.HorseShoe, 'ambrosiaLuck')
      const redLuck = getRuneEffects(RuneType.HorseShoe, 'redLuck')
      const purpleHoneyLuck = getRuneEffects(RuneType.HorseShoe, 'purpleHoneyLuck')
      const ambrosiaLuckText = i18next.t('runes.horseShoe.ambrosiaLuck', { val: format(ambrosiaLuck, 2, true) })
      const redLuckText = i18next.t('runes.horseShoe.redLuck', { val: format(redLuck, 2, true) })
      const purpleHoneyLuckText = i18next.t('runes.horseShoe.purpleHoneyLuck', {
        val: format(purpleHoneyLuck, 2, true)
      })
      return `${ambrosiaLuckText}<br>${redLuckText}<br>${purpleHoneyLuckText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsHorseShoe(),
    salvage: () => calculateTotalSalvage(),
    isUnlocked: () => {
      return getPurpleAmbrosiaUpgradeEffects('sagittarius', 'horseshoeRuneUnlocked')
    },
    minimalResetTier: 'never',
    name: () => i18next.t('runes.horseShoe.name'),
    description: () => i18next.t('runes.horseShoe.description'),
    valueText: () => i18next.t('runes.horseShoe.values'),
    runeHTMLStyle: {
      borderColor: 'var(--brown-color)',
      nameColor: 'var(--peru-color)'
    }
  },
  [RuneType.FiniteDescent]: {
    key: 'finiteDescent',
    costCoefficient: new Decimal('1e-40'),
    levelsPerOOM: 0.1,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => 0,
    effects: (n, key) => {
      if (key === 'cubesBanked') {
        return n >= 1 ? Math.round(40 + 960 * (n - 1) / (n + 25)) : 0
      } else if (key === 'corruptionFreeLevels') {
        return 0.01 * Math.min(n, 100)
      } else {
        return Math.floor(n / 2) // infiniteAscentFreeLevel
      }
    },
    effectsDescription: () => {
      const corruptionFreeLevels = getRuneEffects(RuneType.FiniteDescent, 'corruptionFreeLevels')
      const cubesBanked = getRuneEffects(RuneType.FiniteDescent, 'cubesBanked')
      const infiniteAscentFreeLevel = getRuneEffects(RuneType.FiniteDescent, 'infiniteAscentFreeLevel')
      const corruptionFreeLevelsText = i18next.t('runes.finiteDescent.corruptionLevels', {
        val: format(corruptionFreeLevels, 3, true)
      })
      const cubesBankedText = i18next.t('runes.finiteDescent.cubesBanked', {
        val: format(cubesBanked, 0, true)
      })
      const infiniteAscentFreeLevelText = i18next.t('runes.finiteDescent.infiniteAscentLevels', {
        val: format(infiniteAscentFreeLevel, 0, true)
      })
      return `${corruptionFreeLevelsText}<br>${cubesBankedText}<br>${infiniteAscentFreeLevelText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => 0,
    salvage: () => calculateTotalSalvage(),
    isUnlocked: () => getShopUpgradeEffects('shopSadisticRune', 'runeUnlocked'),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.finiteDescent.name'),
    description: () => i18next.t('runes.finiteDescent.description'),
    valueText: () => i18next.t('runes.finiteDescent.values'),
    runeHTMLStyle: {
      borderColor: 'var(--gray-color)',
      nameColor: 'var(--darkgray-color)'
    }
  },
  [RuneType.TopHat]: {
    key: 'topHat',
    costCoefficient: new Decimal('1'),
    levelsPerOOM: 1,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => 0,
    effects: (n, key) => {
      if (key === 'freeOfferingLevels') {
        return Math.round(200 * (1 - Math.pow(0.995, n))) / 10
      } else if (key === 'freeObtainiumLevels') {
        return Math.round(200 * (1 - Math.pow(0.995, n))) / 10
      } else if (key === 'freeCubeLevels') {
        return Math.round(150 * (1 - Math.pow(0.997, n))) / 10
      } else if (key === 'freeSpeedLevels') {
        return Math.round(150 * (1 - Math.pow(0.997, n))) / 10
      } else {
        return Math.round(100 * (1 - Math.pow(0.999, n))) / 10 // freeInfinityLevels
      }
    },
    effectsDescription: () => {
      const freeOfferingLevels = getRuneEffects(RuneType.TopHat, 'freeOfferingLevels')
      const freeObtainiumLevels = getRuneEffects(RuneType.TopHat, 'freeObtainiumLevels')
      const freeCubeLevels = getRuneEffects(RuneType.TopHat, 'freeCubeLevels')
      const freeSpeedLevels = getRuneEffects(RuneType.TopHat, 'freeSpeedLevels')
      const freeInfinityLevels = getRuneEffects(RuneType.TopHat, 'freeInfinityLevels')
      const offeringLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Offering),
        val: format(freeOfferingLevels, 1, true),
        max: 20
      })
      const obtainiumLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Obtainium),
        val: format(freeObtainiumLevels, 1, true),
        max: 20
      })
      const cubeLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Cubes),
        val: format(freeCubeLevels, 1, true),
        max: 15
      })
      const speedLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Speed),
        val: format(freeSpeedLevels, 1, true),
        max: 15
      })
      const infinityLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.InfinityUpgrades),
        val: format(freeInfinityLevels, 1, true),
        max: 10
      })
      return `${offeringLevelsText}<br>${obtainiumLevelsText}<br>${cubeLevelsText}<br>${speedLevelsText}<br>${infinityLevelsText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => 0,
    salvage: () => calculateTotalSalvage(),
    isUnlocked: () => getSingularityChallengeEffect('noQuarkUpgrades', 'topHatUnlock'),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.topHat.name'),
    description: () => i18next.t('runes.topHat.description'),
    valueText: () => i18next.t('runes.topHat.values'),
    runeHTMLStyle: {
      borderColor: 'var(--white-color)',
      nameColor: 'var(--gainsboro-color)'
    }
  }
}

export const sumOfFreeRuneLevels = () => {
  let sum = 0
  for (const rune of allRuneTypes) {
    sum += runes[rune].freeLevels()
  }
  return sum
}

export const getRuneTotalLevel = (rune: RuneType): number => player.runeLevels[rune] + runes[rune].freeLevels()

export const getRuneEffectiveLevel = (rune: RuneType): number => {
  if (!runes[rune].isUnlocked()) {
    return 0
  }
  if (player.currentChallenge.reincarnation === 9 && !runes[rune].ignoreChal9) {
    return 1
  }
  return getRuneTotalLevel(rune) * runes[rune].effectiveLevelMult()
}

export const getRuneEffects = <T extends RuneType, K extends keyof RuneTypeMap[T]>(
  rune: T,
  key: K
): RuneTypeMap[T][K] => {
  return runes[rune].effects(getRuneEffectiveLevel(rune), key) as RuneTypeMap[T][K]
}

const getLevelsPerOOM = (rune: RuneType): number => {
  return runes[rune].levelsPerOOM + runes[rune].levelsPerOOMIncrease()
}

const getRuneEXPPerOffering = (rune: RuneType): Decimal => {
  return runeEXPMult(player.runeLevels[rune], runes[rune].salvage())
}

const computeEXPToLevel = (rune: RuneType, level: number) => {
  const levelPerOOM = getLevelsPerOOM(rune)
  return runes[rune].costCoefficient.times(Decimal.pow(10, level / levelPerOOM).minus(1))
}

const computeEXPLeftToLevel = (rune: RuneType, level: number) => {
  return Decimal.max(0, computeEXPToLevel(rune, level).minus(player.runeEXP[rune]))
}

const computeOfferingsToLevel = (rune: RuneType, level: number, runeEXPPerOffering: Decimal) => {
  return Decimal.max(1, computeEXPLeftToLevel(rune, level).div(runeEXPPerOffering).ceil())
}

// For some dumb reason that old Platonic might be able to explain, 'MAX' was defined to
// be 100,000 levels. This retroactively corrects the display logic.
const getRuneBuyLimit = () => {
  return player.offeringbuyamount === 100000 ? Number.POSITIVE_INFINITY : player.offeringbuyamount
}

// Gives levels to buy, total EXP to that level, and offerings required to reach that level
const maxRuneLevelPurchaseInformation = (rune: RuneType, budget: Decimal, upperLimit: number) => {
  if (!runes[rune].isUnlocked() || budget.lt(new Decimal())) {
    return { levels: 0, expRequired: new Decimal(), offerings: new Decimal() }
  }

  const runeEXPPerOffering = getRuneEXPPerOffering(rune)
  const totalEXPAvailable = budget.times(runeEXPPerOffering).add(player.runeEXP[rune])
  const levelsPerOOM = getLevelsPerOOM(rune)
  const costCoeff = runes[rune].costCoefficient

  // Calculate max level we can reach with available EXP
  // EXP formula: costCoeff * (10^(level/levelsPerOOM) - 1)
  // Solving for level: level = levelsPerOOM * log10((EXP/costCoeff) + 1)
  const maxLevel = Math.floor(levelsPerOOM * Decimal.log10(totalEXPAvailable.div(costCoeff).plus(1)))
  const levelsGained = Math.min(upperLimit, Math.max(0, maxLevel - player.runeLevels[rune]))

  if (levelsGained === 0) {
    // Can't afford any levels, return next level stuff
    return {
      levels: 1,
      expRequired: computeEXPToLevel(rune, player.runeLevels[rune] + 1),
      offerings: computeOfferingsToLevel(rune, player.runeLevels[rune] + 1, runeEXPPerOffering)
    }
  }

  // Return the levels we can gain and the EXP required for that many levels
  return {
    levels: levelsGained,
    expRequired: computeEXPToLevel(rune, player.runeLevels[rune] + levelsGained),
    offerings: computeOfferingsToLevel(rune, player.runeLevels[rune] + levelsGained, runeEXPPerOffering)
  }
}

let runeLevelAchievementsDirty = true

const setRuneLevel = (rune: RuneType, level: number) => {
  const exp = computeEXPToLevel(rune, level)
  runeLevelAchievementsDirty ||= player.runeLevels[rune] !== level
  player.runeLevels[rune] = level
  player.runeEXP[rune] = exp
}

const updateLevelsFromEXP = (rune: RuneType) => {
  const previousLevel = player.runeLevels[rune]
  const levelsPerOOM = getLevelsPerOOM(rune)
  const levels = Math.floor(levelsPerOOM * Decimal.log10(player.runeEXP[rune].div(runes[rune].costCoefficient).plus(1)))
  // Floating point imprecision fix
  if (computeEXPLeftToLevel(rune, levels + 1).eq(new Decimal())) {
    player.runeLevels[rune] = levels + 1
  } else {
    player.runeLevels[rune] = levels
  }

  runeLevelAchievementsDirty ||= previousLevel !== player.runeLevels[rune]
}

const updateRuneLevelAchievementProgress = (force = false, sourcedFromUpdate = false) => {
  if (!force && !runeLevelAchievementsDirty) {
    return
  }

  awardAchievementGroup(AchievementGroup.RuneLevel)
  updateProgressiveCache('runeLevel', sourcedFromUpdate)
  runeLevelAchievementsDirty = false
}

interface UpdateRuneLevelOptions {
  forceAchievementCheck?: boolean
  sourcedFromUpdate?: boolean
}

export const updateAllRuneLevelsFromEXP = (
  { forceAchievementCheck = true, sourcedFromUpdate = false }: UpdateRuneLevelOptions = {}
) => {
  for (const rune of allRuneTypes) {
    updateLevelsFromEXP(rune)
  }
  updateRuneLevelAchievementProgress(forceAchievementCheck, sourcedFromUpdate)
}

export const updateWebRuneHTML = (rune: RuneType) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  DOMCacheGetOrSet(`${runes[rune].key}RuneLevel`).textContent = i18next.t('runes.level', {
    x: format(player.runeLevels[rune], 0, true)
  })
  DOMCacheGetOrSet(`${runes[rune].key}RuneFreeLevel`).innerHTML = i18next.t('runes.freeLevels', {
    x: format(runes[rune].freeLevels(), 0, true)
  })

  const { levels, offerings } = maxRuneLevelPurchaseInformation(rune, player.offerings, getRuneBuyLimit())
  DOMCacheGetOrSet(`${runes[rune].key}RuneTNL`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: format(levels, 0, true),
    offerings: format(offerings, 2, false)
  })
}

export const updateMobileRuneHTML = (rune: RuneType) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  // {rune}Rune, {rune}RuneLevel, {rune}RuneCoefficient, {rune}RuneIncreasePerLevel, {rune}RunePower, {rune}RuneEffects, {rune}RuneCost
  DOMCacheGetOrSet(`${runes[rune].key}RuneLevel`).innerHTML = `${
    i18next.t('runes.level', { x: format(player.runeLevels[rune], 0, true) })
  } ${i18next.t('runes.freeLevels', { x: format(runes[rune].freeLevels(), 0, true) })}`
  DOMCacheGetOrSet(`${runes[rune].key}RuneCoefficient`).textContent = i18next.t('runes.runeCoefficientText', {
    base: format(runes[rune].levelsPerOOM, 2, true),
    bonus: format(runes[rune].levelsPerOOMIncrease(), 2, true),
    total: format(getLevelsPerOOM(rune), 2, true)
  })

  DOMCacheGetOrSet(`${runes[rune].key}RuneIncreasePerLevel`).innerHTML = i18next.t('runes.perLevelIncrease', {
    x: format(Math.pow(10, 1 / getLevelsPerOOM(rune)), 4, false)
  })

  DOMCacheGetOrSet(`${runes[rune].key}RunePower`).innerHTML = i18next.t('runes.runeEffectiveLevel', {
    level: format(getRuneEffectiveLevel(rune), 2, false)
  })

  DOMCacheGetOrSet(`${runes[rune].key}RuneEffects`).innerHTML = runes[rune].effectsDescription()

  const { levels, offerings } = maxRuneLevelPurchaseInformation(rune, player.offerings, getRuneBuyLimit())
  DOMCacheGetOrSet(`${runes[rune].key}RuneCost`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: format(levels, 0, true),
    offerings: format(offerings, 0, true)
  })
}

export const updateRuneHTML = (rune: RuneType) => {
  if (isMobile) {
    updateMobileRuneHTML(rune)
  } else {
    updateWebRuneHTML(rune)
  }
}

export const focusedRuneHTML = (rune: RuneType) => {
  const name = i18next.t('runes.runeName', {
    color: runes[rune].runeHTMLStyle.nameColor,
    name: runes[rune].name()
  })

  const nameHTML = `<span style="color: var(--orange-color)">${name}</span>`

  const description = runes[rune].description()
  const descriptionHTML = `<span style="color: var(--lightgray-color)">${description}</span>`
  const effectiveLevelHTML = i18next.t('runes.runeEffectiveLevel', {
    level: format(getRuneEffectiveLevel(rune), 2, false)
  })
  const effectiveLevelCalcHTML = i18next.t('runes.runeEffectiveLevelCalc', {
    purchased: format(player.runeLevels[rune], 0, true),
    free: format(runes[rune].freeLevels(), 2, true),
    mult: format(runes[rune].effectiveLevelMult(), 2, true)
  })

  const effectText = runes[rune].effectsDescription()
  const coefficientText = i18next.t('runes.runeCoefficientText', {
    base: format(runes[rune].levelsPerOOM, 2, true),
    bonus: format(runes[rune].levelsPerOOMIncrease(), 2, true),
    total: format(getLevelsPerOOM(rune), 2, true)
  })
  const levelCostIncreaseText = i18next.t('runes.perLevelIncrease', {
    x: format(Math.pow(10, 1 / getLevelsPerOOM(rune)), 4, false)
  })

  const experienceInfo = i18next.t('runes.runeEXP', {
    exp: format(player.runeEXP[rune], 2, true),
    perEXP: format(getRuneEXPPerOffering(rune), 2, true)
  })

  const { levels, expRequired, offerings } = maxRuneLevelPurchaseInformation(
    rune,
    player.offerings,
    getRuneBuyLimit()
  )
  const levelInfo = i18next.t('runes.EXPNeeded', {
    level: format(levels, 0, true),
    exp: format(expRequired, 2, true),
    offerings: format(offerings, 0, true)
  })
  return `${nameHTML}<br>${descriptionHTML}
  <br><br>${effectiveLevelHTML}<br>${effectiveLevelCalcHTML}<br>${effectText}
  <br><br>${coefficientText}<br>${levelCostIncreaseText}
  <br><br>${runeSalvageHTML(rune)}
  <br><br>${experienceInfo}<br>${levelInfo}`
}

export const focusedRuneLockedHTML = (rune: RuneType) => {
  const name = i18next.t('runes.lockedRuneModal')
  const nameHTML = `<span style="color: var(--gray-color)">${name}</span>`

  const lockedDescription = i18next.t(`runes.${runes[rune].key}.lockedDescription`)
  const lockedDescriptionHTML = `<span style="color: var(--lightcoral-color)">${lockedDescription}</span>`

  return `${nameHTML}<br>${lockedDescriptionHTML}`
}

export const getNumberUnlockedRunes = () => {
  return Object.values(runes).filter((rune) => rune.isUnlocked()).length
}

export function resetRunes (tier: keyof typeof resetTiers) {
  if (runes === null) {
    throw new Error('Runes not initialized. Call initRunes first.')
  }
  for (const rune of allRuneTypes) {
    if (resetTiers[tier] >= resetTiers[runes[rune].minimalResetTier]) {
      runeLevelAchievementsDirty ||= player.runeLevels[rune] !== 0
      player.runeLevels[rune] = 0
      player.runeEXP[rune] = new Decimal()
    }

    if (resetTiers[tier] === resetTiers[runes[rune].minimalResetTier] && tier === 'ascension') {
      setRuneLevel(rune, 3 * player.cubeUpgrades[26])
    }
  }
}

export const resetOfferings = () => {
  player.offerings = player.offerings.add(calculateOfferings())
}

export const sacrificeOfferings = (rune: RuneType, budget: Decimal, auto = false) => {
  // if automated && 2x10 cube upgrade bought, this will be >0.

  if (!runes[rune].isUnlocked()) {
    return
  }

  if (auto && rune === RuneType.InfiniteAscent && player.highestSingularityCount < 30) {
    return
  }

  if (auto && rune === RuneType.Antiquities && player.highestSingularityCount < 50) {
    return
  }

  const { levels, expRequired, offerings } = maxRuneLevelPurchaseInformation(
    rune,
    budget,
    auto ? Number.POSITIVE_INFINITY : getRuneBuyLimit()
  )
  if (levels > 0 && offerings.lte(budget)) {
    player.runeEXP[rune] = expRequired
    player.offerings = player.offerings.sub(offerings)
  }

  updateLevelsFromEXP(rune)
  updateRuneLevelAchievementProgress()
  player.offerings = Decimal.max(0, player.offerings)
}

export const generateWebRunesHTML = () => {
  const runeContainer = DOMCacheGetOrSet('runeDetails')

  for (const rune of allRuneTypes) {
    const key = runes[rune].key
    // Create unlocked rune container
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeType'
    runesDiv.id = `${key}RuneContainer`
    runesDiv.style.border = `2px solid ${runes[rune].runeHTMLStyle.borderColor}`
    runesDiv.style.borderRadius = '8px'
    runesDiv.style.margin = '2px'
    // Add custom property for glow color
    runesDiv.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${runes[rune].runeHTMLStyle.borderColor} 50%, var(--orange-color) 50%)`
    )

    runesDiv.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneHTML(rune), e.clientX, e.clientY, { borderColor: runes[rune].runeHTMLStyle.borderColor })
      }
    )
    runesDiv.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}Rune`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneHTML(rune), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: runes[rune].runeHTMLStyle.borderColor
      })
    })
    runesDiv.addEventListener('mouseout', CloseModal)

    const runeName = document.createElement('p')
    runeName.className = 'runeTypeElement'
    runeName.setAttribute('i18n', `runes.${key}.name`)
    runeName.innerHTML = i18next.t(`runes.${key}.name`)

    runesDiv.appendChild(runeName)

    const runeIcon = document.createElement('img')
    runeIcon.className = 'runeImage'
    runeIcon.id = `${key}Rune`
    runeIcon.alt = `${key} Rune`
    runeIcon.src = `Pictures/Runes/${key.charAt(0).toUpperCase() + key.slice(1)}.png`
    runeIcon.loading = 'lazy'
    runeIcon.addEventListener('click', () => toggleAutoSacrificeRune(rune))

    runesDiv.appendChild(runeIcon)

    const runeLevel = document.createElement('span')
    runeLevel.className = 'runeTypeElement'
    runeLevel.id = `${key}RuneLevel`
    runeLevel.textContent = 'Level 0/30'

    runesDiv.appendChild(runeLevel)

    const runeFreeLevel = document.createElement('span')
    runeFreeLevel.className = 'runeTypeElement'
    runeFreeLevel.id = `${key}RuneFreeLevel`
    runeFreeLevel.textContent = '0'
    runeFreeLevel.style.color = 'var(--white-color)'

    runesDiv.appendChild(runeFreeLevel)

    const runeTNL = document.createElement('span')
    runeTNL.className = 'runeTypeElement'
    runeTNL.id = `${key}RuneTNL`
    runeTNL.textContent = '0'
    runesDiv.appendChild(runeTNL)

    const sacrificeButton = document.createElement('button')
    sacrificeButton.className = 'runeTypeElement disable-hover-color'
    sacrificeButton.id = `${key}RuneSacrifice`
    sacrificeButton.setAttribute('i18n', 'general.sacrificeCapital')
    sacrificeButton.textContent = i18next.t('general.sacrificeCapital')
    sacrificeButton.addEventListener('click', () => sacrificeOfferings(rune, player.offerings, false))

    runesDiv.appendChild(sacrificeButton)

    runeContainer.appendChild(runesDiv)

    // Create locked rune container
    const lockedRunesDiv = document.createElement('div')
    lockedRunesDiv.className = 'runeType runeTypeLocked'
    lockedRunesDiv.id = `${key}RuneLockedContainer`
    lockedRunesDiv.style.border = '2px solid var(--lightgray-color)'
    lockedRunesDiv.style.borderRadius = '8px'
    lockedRunesDiv.style.margin = '2px'

    lockedRunesDiv.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneLockedHTML(rune), e.clientX, e.clientY, { borderColor: 'var(--gray-color)' })
      }
    )
    lockedRunesDiv.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}RuneLockedContainer`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneLockedHTML(rune), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: 'var(--gray-color)'
      })
    })
    lockedRunesDiv.addEventListener('mouseout', CloseModal)

    const lockedRuneName = document.createElement('p')
    lockedRuneName.className = 'runeTypeElement'
    lockedRuneName.setAttribute('i18n', 'runes.lockedRune')
    lockedRuneName.textContent = i18next.t('runes.lockedRune')

    lockedRunesDiv.appendChild(lockedRuneName)

    const lockedRuneIcon = document.createElement('img')
    lockedRuneIcon.className = 'runeImage runeImageLocked'
    lockedRuneIcon.id = `${key}RuneLocked`
    lockedRuneIcon.alt = `${key} Rune - Locked`
    lockedRuneIcon.src = `Pictures/Runes/${key.charAt(0).toUpperCase() + key.slice(1)}.png`
    lockedRuneIcon.loading = 'lazy'

    lockedRunesDiv.appendChild(lockedRuneIcon)

    runeContainer.appendChild(lockedRunesDiv)
  }
}

export const generateMobileRunesHTML = () => {
  const runeContainer = DOMCacheGetOrSet('runeDetails')
  for (const rune of allRuneTypes) {
    const key = runes[rune].key
    // Create unlocked rune container
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeTypeMobile'
    runesDiv.id = `${key}RuneContainer`
    runesDiv.style.border = `2px solid ${runes[rune].runeHTMLStyle.borderColor}`
    runesDiv.style.borderRadius = '8px'
    runesDiv.style.margin = '2px'

    // Top of div lefthand (icon, name)
    const topRow = document.createElement('div')
    topRow.classList.add('runeIconAndName')

    const runeIcon = document.createElement('img')
    runeIcon.className = 'runeImage'
    runeIcon.height = 32 // make smaller on mobile versions
    runeIcon.width = 32
    runeIcon.id = `${key}Rune`
    runeIcon.alt = `${key} Rune`
    runeIcon.src = `Pictures/Runes/${key.charAt(0).toUpperCase() + key.slice(1)}.png`
    runeIcon.loading = 'lazy'
    runeIcon.addEventListener('click', () => toggleAutoSacrificeRune(rune))

    topRow.appendChild(runeIcon)

    const runeName = document.createElement('p')
    runeName.className = 'runeTypeElementMobile'
    runeName.setAttribute('i18n', `runes.${key}.name`)
    runeName.innerHTML = i18next.t(`runes.${key}.name`)
    topRow.appendChild(runeName)

    runesDiv.appendChild(topRow)

    const level = document.createElement('p')
    level.className = 'runeTypeElementMobile'
    level.id = `${key}RuneLevel`
    level.textContent = '0 [+0]'
    level.style.color = 'var(--white-color)'
    runesDiv.appendChild(level)

    const coefficientText = document.createElement('p')
    coefficientText.className = 'runeTypeElementMobile'
    coefficientText.id = `${key}RuneCoefficient`
    coefficientText.textContent = '1'
    coefficientText.style.color = 'var(--white-color)'
    runesDiv.appendChild(coefficientText)

    const increasePerLevelText = document.createElement('p')
    increasePerLevelText.className = 'runeTypeElementMobile'
    increasePerLevelText.id = `${key}RuneIncreasePerLevel`
    increasePerLevelText.textContent = '1'
    increasePerLevelText.style.color = 'var(--white-color)'
    runesDiv.appendChild(increasePerLevelText)

    const runePower = document.createElement('p')
    runePower.className = 'runeTypeElementMobile'
    runePower.id = `${key}RunePower`
    runePower.textContent = '1'
    runePower.style.color = 'var(--white-color)'
    runesDiv.appendChild(runePower)

    const runeEffects = document.createElement('p')
    runeEffects.className = 'runeTypeElementMobile'
    runeEffects.id = `${key}RuneEffects`
    runeEffects.textContent = '1'
    runeEffects.style.color = 'var(--white-color)'
    runesDiv.appendChild(runeEffects)

    const runeCost = document.createElement('p')
    runeCost.className = 'runeTypeElementMobile'
    runeCost.id = `${key}RuneCost`
    runeCost.textContent = '1'
    runeCost.style.color = 'var(--white-color)'
    runesDiv.appendChild(runeCost)

    // Sacrifice button on the righthand side of the div
    const sacrificeButton = document.createElement('button')
    sacrificeButton.className = 'runeTypeElementMobile disable-hover-color'
    sacrificeButton.id = `${key}RuneSacrifice`
    sacrificeButton.setAttribute('i18n', 'general.sacrificeCapital')
    sacrificeButton.textContent = i18next.t('general.sacrificeCapital')
    sacrificeButton.addEventListener('click', () => sacrificeOfferings(rune, player.offerings, false))
    runesDiv.appendChild(sacrificeButton)

    runeContainer.appendChild(runesDiv)

    // Create locked rune container
    const lockedRunesDiv = document.createElement('div')
    lockedRunesDiv.className = 'runeTypeMobile runeTypeLocked'
    lockedRunesDiv.id = `${key}RuneLockedContainer`
    lockedRunesDiv.style.border = '2px solid var(--lightgray-color)'
    lockedRunesDiv.style.borderRadius = '8px'
    lockedRunesDiv.style.margin = '2px'

    const lockedInfoSection = document.createElement('div')
    lockedInfoSection.className = 'runeInfoSectionMobile'

    const topRowLocked = document.createElement('div')
    topRowLocked.classList.add('runeIconAndName')

    const lockedRuneIcon = document.createElement('img')
    lockedRuneIcon.className = 'runeImage runeImageLocked'
    lockedRuneIcon.id = `${key}RuneLocked`
    lockedRuneIcon.alt = `${key} Rune - Locked`
    lockedRuneIcon.src = `Pictures/Runes/${key.charAt(0).toUpperCase() + key.slice(1)}.png`
    lockedRuneIcon.height = 32
    lockedRuneIcon.width = 32
    lockedRuneIcon.loading = 'lazy'

    topRowLocked.appendChild(lockedRuneIcon)

    const lockedRuneName = document.createElement('p')
    lockedRuneName.className = 'runeTypeElementMobile'
    lockedRuneName.setAttribute('i18n', 'runes.lockedRune')
    lockedRuneName.textContent = i18next.t('runes.lockedRune')

    topRowLocked.appendChild(lockedRuneName)
    lockedInfoSection.appendChild(topRowLocked)

    const lockedDescription = document.createElement('p')
    lockedDescription.className = 'runeTypeElementMobile'
    lockedDescription.setAttribute('i18n', `runes.${key}.lockedDescription`)
    lockedDescription.innerHTML = i18next.t(`runes.${key}.lockedDescription`)

    lockedInfoSection.appendChild(lockedDescription)

    lockedRunesDiv.appendChild(lockedInfoSection)
    runeContainer.appendChild(lockedRunesDiv)
  }
}

export const generateRunesHTML = memoize(() => {
  if (isMobile) {
    generateMobileRunesHTML()
  } else {
    generateWebRunesHTML()
  }
})
