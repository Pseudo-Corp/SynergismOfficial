import { calculateOfferings, calculateSalvageRuneEXPMultiplier } from './Calculate'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { awardAchievementGroup, getAchievementReward } from './Achievements'
import { getAmbrosiaUpgradeEffects } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcECC } from './Challenges'
import { getAntUpgradeEffect } from './Features/Ants/AntUpgrades/lib/upgrade-effects'
import { AntUpgrades } from './Features/Ants/AntUpgrades/structs/structs'
import { getLevelMilestone } from './Levels'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { resetTiers } from './Reset'
import { createShopUpgradeTypeIcon, getShopUpgradeEffects, ShopUpgradeGroups } from './Shop'
import { firstFiveRuneEffectivenessStats, runeEffectivenessStatsSI } from './Statistics'
import { Tabs } from './Tabs'
import { getRuneBonusFromAllTalismans, getTalismanEffects } from './Talismans'
import { assert } from './Utility'

export const indexToRune: Record<number, RuneKeys> = {
  1: 'speed',
  2: 'duplication',
  3: 'prism',
  4: 'thrift',
  5: 'superiorIntellect',
  6: 'infiniteAscent',
  7: 'antiquities'
}

export const runeToIndex = Object.fromEntries(
  Object.entries(indexToRune).map(([key, value]) => [value, key])
) as Record<RuneKeys, string>

type RuneTypeMap = {
  speed: {
    acceleratorPower: number
    multiplicativeAccelerators: number
    globalSpeed: number
  }
  duplication: {
    multiplierBoosts: number
    multiplicativeMultipliers: number
    taxReduction: number
  }
  prism: {
    productionLog10: number
    costDivisorLog10: number
  }
  thrift: {
    costDelay: number
    salvage: number
    taxReduction: number
  }
  superiorIntellect: {
    offeringMult: number
    obtainiumMult: number
    antSpeed: number
  }
  infiniteAscent: {
    quarkMult: number
    cubeMult: number
    salvage: number
  }
  antiquities: {
    addCodeCooldownReduction: number
    offeringLog10: number
    obtainiumLog10: number
    cubeBonus: number
  }
  horseShoe: {
    ambrosiaLuck: number
    redLuck: number
    redLuckConversion: number
  }
  finiteDescent: {
    ascensionScore: number
    corruptionFreeLevels: number
    infiniteAscentFreeLevel: number
  }
  topHat: {
    freeOfferingLevels: number
    freeObtainiumLevels: number
    freeCubeLevels: number
    freeSpeedLevels: number
    freeInfinityLevels: number
  }
}

export type RuneKeys = keyof RuneTypeMap

interface RuneHTMLStyle {
  borderColor: string
  nameColor: string
}

interface RuneData<K extends RuneKeys> {
  level: number
  runeEXP: Decimal
  costCoefficient: Decimal
  levelsPerOOM: number
  ignoreChal9: boolean
  levelsPerOOMIncrease: () => number
  effectiveLevelMult: () => number
  freeLevels: () => number
  runeEXPPerOffering: (purchasedLevels: number) => Decimal
  isUnlocked: () => boolean
  minimalResetTier: keyof typeof resetTiers
  effects: (n: number) => RuneTypeMap[K]
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
    getRuneBonusFromAllTalismans('speed')
    + (
      player.upgrades[27] * (Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e10)))
        + Math.max(0, Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e50)) - 10)))
    )
    + player.upgrades[29] * Math.floor(
        Math.min(
          100,
          (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin
            + player.fifthOwnedCoin) / 400
        )
      )
  )
}

const bonusRuneLevelsDuplication = () => {
  return (
    getRuneBonusFromAllTalismans('duplication')
    + player.upgrades[28] * Math.min(
        100,
        Math.floor(
          (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin
            + player.fifthOwnedCoin) / 400
        )
      )
    + (
      player.upgrades[30] * (Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e30)))
        + Math.min(50, Math.floor(Decimal.log(player.coins.add(1), 1e300))))
    )
  )
}

const bonusRuneLevelsPrism = () => {
  return (
    getRuneBonusFromAllTalismans('prism')
  )
}

const bonusRuneLevelsThrift = () => {
  return (
    getRuneBonusFromAllTalismans('thrift')
  )
}

const bonusRuneLevelsSI = () => {
  return (
    getRuneBonusFromAllTalismans('superiorIntellect')
  )
}

const bonusRuneLevelsIA = () => {
  return (
    (PCoinUpgradeEffects.INSTANT_UNLOCK_2 ? 6 : 0)
    + player.cubeUpgrades[73]
    + player.campaigns.bonusRune6
    + getRuneBonusFromAllTalismans('infiniteAscent')
    + getRuneEffects('finiteDescent').infiniteAscentFreeLevel
  )
}

const bonusRuneLevelsAntiquities = () => {
  return getRuneBonusFromAllTalismans('antiquities')
}

const bonusRuneLevelsHorseShoe = () => {
  return getRuneBonusFromAllTalismans('horseShoe')
    + getShopUpgradeEffects('shopHorseShoe').bonusHorseLevels
}

const speedRuneOOMIncrease = () => {
  return (
    player.upgrades[66] * 2
    + player.researches[78]
    + player.researches[111]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + player.cubeUpgrades[16]
    + getTalismanEffects('chronos').speedOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('speedRune')
  )
}

const duplicationRuneOOMIncrease = () => {
  return (
    0.75 * CalcECC('transcend', player.challengecompletions[1])
    + player.upgrades[66] * 2
    + player.researches[90]
    + player.researches[112]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + getTalismanEffects('exemption').duplicationOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('duplicationRune')
  )
}

const prismRuneOOMIncrease = () => {
  return (
    player.upgrades[66] * 2
    + player.researches[79]
    + player.researches[113]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + player.cubeUpgrades[16]
    + getTalismanEffects('mortuus').prismOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('prismRune')
  )
}

const thriftRuneOOMIncrease = () => {
  return (
    player.upgrades[66] * 2
    + player.researches[77]
    + player.researches[114]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + player.cubeUpgrades[37]
    + getTalismanEffects('midas').thriftOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('thriftRune')
  )
}

const superiorIntellectOOMIncrease = () => {
  return (
    player.upgrades[66] * 2
    + player.researches[115]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + player.cubeUpgrades[37]
    + getTalismanEffects('polymath').SIOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('SIRune')
  )
}

const infiniteAscentOOMIncrease = () => {
  return (
    getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').infiniteAscentOOMBonus
  )
}

const antiquitiesOOMIncrease = () => {
  return (
    +player.singularityChallenges.taxmanLastStand.rewards.antiquityOOM
  )
}

const horseShoeOOMIncrease = () => {
  return (
    +player.singularityChallenges.taxmanLastStand.rewards.horseShoeOOM
  )
}

export const firstFiveEffectiveRuneLevelMult = () => {
  return firstFiveRuneEffectivenessStats.reduce((x, y) => x * y.stat(), 1)
}

export const SIEffectiveRuneLevelMult = () => {
  return runeEffectivenessStatsSI.reduce((x, y) => x * y.stat(), 1)
}

const universalRuneEXPMult = (purchasedLevels: number): Decimal => {
  // recycleMult accounted for all recycle chance, but inversed so it's a multiplier instead
  const recycleMultiplier = calculateSalvageRuneEXPMultiplier()

  // Rune multiplier that is summed instead of added
  /* TODO: Replace the effects of these upgrades with new ones
    const allRuneExpAdditiveMultiplier = sumContents([
        // Challenge 3 completions
        (1 / 100) * player.highestchallengecompletions[3],
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

export const runes: { [K in RuneKeys]: RuneData<K> } = {
  speed: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(50),
    levelsPerOOM: 150,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => speedRuneOOMIncrease(),
    effects: (n) => {
      const acceleratorPower = 0.0002 * n
      const multiplicativeAccelerators = 1 + n / 400
      const globalSpeed = 2 - Math.exp(-Math.cbrt(n) / 100)
      return {
        acceleratorPower: acceleratorPower,
        multiplicativeAccelerators: multiplicativeAccelerators,
        globalSpeed: globalSpeed
      }
    },
    effectsDescription: () => {
      const effects = getRuneEffects('speed')
      const acceleratorPowerText = i18next.t('runes.speed.acceleratorPower', {
        val: format(100 * effects.acceleratorPower, 2)
      })
      const multiplicativeAcceleratorsText = i18next.t('runes.speed.freeAccelerators', {
        val: formatAsPercentIncrease(effects.multiplicativeAccelerators, 2)
      })
      const globalSpeedText = i18next.t('runes.speed.globalSpeed', {
        val: formatAsPercentIncrease(effects.globalSpeed, 3)
      })
      return `${acceleratorPowerText}<br>${multiplicativeAcceleratorsText}<br>${globalSpeedText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsSpeed(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => true,
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.speed.name'),
    description: () => i18next.t('runes.speed.description'),
    valueText: () => i18next.t('runes.speed.values'),
    runeHTMLStyle: {
      borderColor: 'maroon',
      nameColor: 'tomato'
    }
  },
  duplication: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(20000),
    levelsPerOOM: 120,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => duplicationRuneOOMIncrease(),
    effects: (n) => {
      const multiplierBoosts = n / 5
      const multiplicativeMultipliers = 1 + n / 400
      const taxReduction = 0.001 + .999 * Math.exp(-Math.cbrt(n) / 5)
      return {
        multiplierBoosts: multiplierBoosts,
        multiplicativeMultipliers: multiplicativeMultipliers,
        taxReduction: taxReduction
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('duplication')
      const multiplierPowerBoostsText = i18next.t('runes.duplication.multiplierPower', {
        val: format(effect.multiplierBoosts, 2, true)
      })
      const multiplicativeMultipliersText = i18next.t('runes.duplication.freeMultipliers', {
        val: formatAsPercentIncrease(effect.multiplicativeMultipliers, 2)
      })
      const taxReductionText = i18next.t('runes.duplication.taxReduction', {
        val: format(100 * (1 - effect.taxReduction), 3, true)
      })
      return `${multiplierPowerBoostsText}<br>${multiplicativeMultipliersText}<br>${taxReductionText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsDuplication(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => Boolean(getAchievementReward('duplicationRuneUnlock')),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.duplication.name'),
    description: () => i18next.t('runes.duplication.description'),
    valueText: () => i18next.t('runes.duplication.values'),
    runeHTMLStyle: {
      borderColor: 'purple',
      nameColor: 'orchid'
    }
  },
  prism: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(5e5),
    levelsPerOOM: 90,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => prismRuneOOMIncrease(),
    effects: (level) => {
      const productionLog10 = Math.max(0, 2 * Math.log10(1 + level / 2) + (level / 2) * Math.log10(2) - Math.log10(256))
      const costDivisorLog10 = Math.floor(level / 10)
      return {
        productionLog10: productionLog10,
        costDivisorLog10: costDivisorLog10
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('prism')
      const productionText = i18next.t('runes.prism.crystalProduction', {
        val: format(Decimal.pow(10, effect.productionLog10), 2, true)
      })
      const costReductionText = i18next.t('runes.prism.costDivisor', {
        val: format(Decimal.pow(10, effect.costDivisorLog10), 0, true)
      })
      return `${productionText}<br>${costReductionText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsPrism(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => Boolean(getAchievementReward('prismRuneUnlock')),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.prism.name'),
    description: () => i18next.t('runes.prism.description'),
    valueText: () => i18next.t('runes.prism.values'),
    runeHTMLStyle: {
      borderColor: 'lightblue',
      nameColor: 'cyan'
    }
  },
  thrift: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(2.5e7),
    levelsPerOOM: 60,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => thriftRuneOOMIncrease(),
    effects: (level) => {
      const costDelay = Math.min(1e15, level / 125)
      const salvage = 2.5 * Math.log(1 + level / 10)
      const taxReduction = 0.01 + 0.99 * Math.exp(-Math.cbrt(level) / 10)
      return {
        costDelay: costDelay,
        salvage: salvage,
        taxReduction: taxReduction
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('thrift')
      const costDelayText = i18next.t('runes.thrift.costDelay', { val: format(effect.costDelay, 0, true) })
      const salvageText = i18next.t('runes.thrift.salvage', { val: format(effect.salvage, 2, true) })
      const taxReductionText = i18next.t('runes.thrift.taxReduction', {
        val: format(100 * (1 - effect.taxReduction), 3, true)
      })
      return `${costDelayText}<br>${salvageText}<br>${taxReductionText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsThrift(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => Boolean(getAchievementReward('thriftRuneUnlock')),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.thrift.name'),
    description: () => i18next.t('runes.thrift.description'),
    valueText: () => i18next.t('runes.thrift.values'),
    runeHTMLStyle: {
      borderColor: 'darkgreen',
      nameColor: 'lime'
    }
  },
  superiorIntellect: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(1e12),
    levelsPerOOM: 30,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => superiorIntellectOOMIncrease(),
    effects: (level) => {
      const offeringMult = 1 + level / 2000
      const obtainiumMult = 1 + level / 200
      const antSpeed = Math.pow(1 + level / 500, 2)
      return {
        offeringMult: offeringMult,
        obtainiumMult: obtainiumMult,
        antSpeed: antSpeed
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('superiorIntellect')
      const offeringMultText = i18next.t('runes.superiorIntellect.offeringMult', {
        val: formatAsPercentIncrease(effect.offeringMult, 2)
      })
      const obtainiumMultText = i18next.t('runes.superiorIntellect.obtainiumMult', {
        val: formatAsPercentIncrease(effect.obtainiumMult, 2)
      })
      const antSpeedText = i18next.t('runes.superiorIntellect.antSpeed', { val: format(effect.antSpeed, 2) })
      return `${offeringMultText}<br>${obtainiumMultText}<br>${antSpeedText}`
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult() * SIEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsSI(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => player.researches[82] > 0,
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.superiorIntellect.name'),
    description: () => i18next.t('runes.superiorIntellect.description'),
    valueText: () => i18next.t('runes.superiorIntellect.values'),
    runeHTMLStyle: {
      borderColor: 'blue',
      nameColor: 'turquoise'
    }
  },
  infiniteAscent: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(1e75),
    levelsPerOOM: 1 / 2,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => infiniteAscentOOMIncrease(),
    effects: (level) => {
      const quarkMult = 1 + level / 500 + (level > 0 ? 0.1 : 0)
      const cubeMult = 1 + level / 100

      const salvageCoefficient = 0.025 * salvagePerkLevels.filter((x) => x <= player.highestSingularityCount).length
      const salvage = salvageCoefficient * level

      return {
        quarkMult: quarkMult,
        cubeMult: cubeMult,
        salvage: salvage
      }
    },
    effectsDescription: () => {
      const effectValues = getRuneEffects('infiniteAscent')
      const quarkText = i18next.t('runes.infiniteAscent.quarkBonus', {
        val: formatAsPercentIncrease(effectValues.quarkMult, 2)
      })
      const cubeText = i18next.t('runes.infiniteAscent.cubeBonus', {
        val: formatAsPercentIncrease(effectValues.cubeMult, 2)
      })
      if (player.highestSingularityCount >= 30) {
        const salvageCoefficient = 0.025 * salvagePerkLevels.filter((x) => x <= player.highestSingularityCount).length
        const salvageText = `<span style="color: lightgoldenrodyellow">${
          i18next.t('runes.infiniteAscent.salvage', {
            val: format(effectValues.salvage, 2, true),
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
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => getShopUpgradeEffects('infiniteAscent').runeUnlocked,
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.infiniteAscent.name'),
    description: () => i18next.t('runes.infiniteAscent.description'),
    valueText: () => i18next.t('runes.infiniteAscent.values'),
    runeHTMLStyle: {
      borderColor: 'gold',
      nameColor: 'lightgoldenrodyellow'
    }
  },
  antiquities: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(1e206),
    levelsPerOOM: 1 / 50,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => antiquitiesOOMIncrease(),
    effects: (level) => {
      const addCodeCooldownReduction = level > 0 ? 0.8 - 0.3 * (level - 1) / (level + 10) : 1
      const offeringLog10 = level
      const obtainiumLog10 = level
      const cubeBonus = level > 0 ? Math.pow(1.01, Math.min(5, level) * player.singularityCount) : 1
      return {
        addCodeCooldownReduction: addCodeCooldownReduction,
        offeringLog10: offeringLog10,
        obtainiumLog10: obtainiumLog10,
        cubeBonus
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('antiquities')
      const singularText = i18next.t('runes.antiquities.singularityUnlock', {
        symbol: runes.antiquities.level >= 1 ? '<span class="rainbowText">✔</span>' : '<span class="red">✗</span>'
      })
      const offeringText = i18next.t('runes.antiquities.offeringBonus', {
        val: format(Decimal.pow(10, effect.offeringLog10), 2, true)
      })
      const obtainiumText = i18next.t('runes.antiquities.obtainiumBonus', {
        val: format(Decimal.pow(10, effect.obtainiumLog10), 2, true)
      })
      const addCodeCooldownReductionText = i18next.t('runes.antiquities.addCode', {
        val: formatAsPercentIncrease(effect.addCodeCooldownReduction, 2)
      })
      const cubeBonusText = i18next.t('runes.antiquities.cubeBonus', {
        val: formatAsPercentIncrease(effect.cubeBonus, 2)
      })
      return `${singularText}<br>${offeringText}<br>${obtainiumText}<br>${addCodeCooldownReductionText}<br>${cubeBonusText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsAntiquities(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => player.platonicUpgrades[20] > 0,
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.antiquities.name'),
    description: () => i18next.t('runes.antiquities.description'),
    valueText: () => i18next.t('runes.antiquities.values'),
    runeHTMLStyle: {
      borderColor: 'white',
      nameColor: 'gainsboro'
    }
  },
  horseShoe: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal('1e500'),
    levelsPerOOM: 1 / 20,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => horseShoeOOMIncrease(),
    effects: (level) => {
      const ambrosiaLuck = level
      const redLuck = level / 5
      const redLuckConversion = -0.5 * level / (level + 50)
      return {
        ambrosiaLuck: ambrosiaLuck,
        redLuck: redLuck,
        redLuckConversion: redLuckConversion
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('horseShoe')
      const ambrosiaLuckText = i18next.t('runes.horseShoe.ambrosiaLuck', { val: format(effect.ambrosiaLuck, 2, true) })
      const redLuckText = i18next.t('runes.horseShoe.redLuck', { val: format(effect.redLuck, 2, true) })
      const redLuckConversionText = i18next.t('runes.horseShoe.luckConversion', {
        val: format(effect.redLuckConversion, 3, true)
      })
      return `${ambrosiaLuckText}<br>${redLuckText}<br>${redLuckConversionText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsHorseShoe(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => {
      const condition = Boolean(player.singularityChallenges.taxmanLastStand.rewards.horseShoeUnlock)
      return condition
    },
    minimalResetTier: 'never',
    name: () => i18next.t('runes.horseShoe.name'),
    description: () => i18next.t('runes.horseShoe.description'),
    valueText: () => i18next.t('runes.horseShoe.values'),
    runeHTMLStyle: {
      borderColor: 'saddlebrown',
      nameColor: 'peru'
    }
  },
  finiteDescent: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal('1e-40'),
    levelsPerOOM: 0.1,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => 0,
    effects: (level) => {
      const ascensionScore = level >= 1 ? 1.04 + 0.96 * (level - 1) / (level + 25) : 1
      const corruptionFreeLevels = level >= 1 ? 0.01 + 0.14 * (level - 1) / (level + 16) : 0
      const infiniteAscentFreeLevel = Math.floor(level / 2)
      return {
        ascensionScore: ascensionScore,
        corruptionFreeLevels: corruptionFreeLevels,
        infiniteAscentFreeLevel: infiniteAscentFreeLevel
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('finiteDescent')
      const corruptionFreeLevelsText = i18next.t('runes.finiteDescent.corruptionLevels', {
        val: format(effect.corruptionFreeLevels, 3, true)
      })
      const ascensionScoreText = i18next.t('runes.finiteDescent.ascensionScore', {
        val: formatAsPercentIncrease(effect.ascensionScore, 3)
      })
      const infiniteAscentFreeLevelText = i18next.t('runes.finiteDescent.infiniteAscentLevels', {
        val: format(effect.infiniteAscentFreeLevel, 0, true)
      })
      return `${corruptionFreeLevelsText}<br>${ascensionScoreText}<br>${infiniteAscentFreeLevelText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => 0,
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => getShopUpgradeEffects('shopSadisticRune').runeUnlocked,
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.finiteDescent.name'),
    description: () => i18next.t('runes.finiteDescent.description'),
    valueText: () => i18next.t('runes.finiteDescent.values'),
    runeHTMLStyle: {
      borderColor: 'black',
      nameColor: 'dimgray'
    }
  },
  topHat: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal('1'),
    levelsPerOOM: 1,
    ignoreChal9: false,
    levelsPerOOMIncrease: () => 0,
    effects: (level) => {
      const freeOfferingLevels = Math.round(200 * (1 - Math.pow(0.995, level))) / 10
      const freeObtainiumLevels = Math.round(200 * (1 - Math.pow(0.995, level))) / 10
      const freeCubeLevels = Math.round(150 * (1 - Math.pow(0.997, level))) / 10
      const freeSpeedLevels = Math.round(150 * (1 - Math.pow(0.997, level))) / 10
      const freeInfinityLevels = Math.round(100 * (1 - Math.pow(0.999, level))) / 10
      return {
        freeOfferingLevels,
        freeObtainiumLevels,
        freeCubeLevels,
        freeSpeedLevels,
        freeInfinityLevels
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('topHat')
      const offeringLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Offering),
        val: format(effect.freeOfferingLevels, 1, true),
        max: 20
      })
      const obtainiumLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Obtainium),
        val: format(effect.freeObtainiumLevels, 1, true),
        max: 20
      })
      const cubeLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Cubes),
        val: format(effect.freeCubeLevels, 1, true),
        max: 15
      })
      const speedLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.Speed),
        val: format(effect.freeSpeedLevels, 1, true),
        max: 15
      })
      const infinityLevelsText = i18next.t('runes.topHat.freeLevelTemplate', {
        typeIcon: createShopUpgradeTypeIcon(ShopUpgradeGroups.InfinityUpgrades),
        val: format(effect.freeInfinityLevels, 1, true),
        max: 10
      })
      return `${offeringLevelsText}<br>${obtainiumLevelsText}<br>${cubeLevelsText}<br>${speedLevelsText}<br>${infinityLevelsText}`
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => 0,
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => Boolean(player.singularityChallenges.noQuarkUpgrades.rewards.topHatUnlock),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.topHat.name'),
    description: () => i18next.t('runes.topHat.description'),
    valueText: () => i18next.t('runes.topHat.values'),
    runeHTMLStyle: {
      borderColor: 'white',
      nameColor: 'gainsboro'
    }
  }
}

export const getRuneEffectiveLevel = (rune: RuneKeys): number => {
  if (!runes[rune].isUnlocked()) {
    return 0
  }
  if (player.currentChallenge.reincarnation === 9 && !runes[rune].ignoreChal9) {
    return 1
  }
  const effectiveMult = runes[rune].effectiveLevelMult()
  return (runes[rune].level + runes[rune].freeLevels()) * effectiveMult
}

export const getRuneEffects = <T extends RuneKeys>(rune: T): RuneTypeMap[T] => {
  return runes[rune].effects(getRuneEffectiveLevel(rune))
}

const getLevelsPerOOM = (rune: RuneKeys): number => {
  return runes[rune].levelsPerOOM + runes[rune].levelsPerOOMIncrease()
}

const getRuneEXPPerOffering = (rune: RuneKeys): Decimal => {
  return runes[rune].runeEXPPerOffering(runes[rune].level)
}

const computeEXPToLevel = (rune: RuneKeys, level: number) => {
  const levelPerOOM = getLevelsPerOOM(rune)
  return runes[rune].costCoefficient.times(Decimal.pow(10, level / levelPerOOM).minus(1))
}

const computeEXPLeftToLevel = (rune: RuneKeys, level: number) => {
  return Decimal.max(0, computeEXPToLevel(rune, level).minus(runes[rune].runeEXP))
}

const computeOfferingsToLevel = (rune: RuneKeys, level: number) => {
  return Decimal.max(1, computeEXPLeftToLevel(rune, level).div(getRuneEXPPerOffering(rune)).ceil())
}

// Gives levels to buy, total EXP to that level, and offerings required to reach that level
const maxRuneLevelPurchaseInformation = (rune: RuneKeys, budget: Decimal) => {
  if (!runes[rune].isUnlocked() || budget.lt(0)) {
    return { levels: 0, expRequired: new Decimal(0), offerings: new Decimal(0) }
  }

  const runeEXPPerOffering = getRuneEXPPerOffering(rune)
  const totalEXPAvailable = budget.times(runeEXPPerOffering).add(runes[rune].runeEXP)
  const levelsPerOOM = getLevelsPerOOM(rune)
  const costCoeff = runes[rune].costCoefficient

  // Calculate max level we can reach with available EXP
  // EXP formula: costCoeff * (10^(level/levelsPerOOM) - 1)
  // Solving for level: level = levelsPerOOM * log10((EXP/costCoeff) + 1)
  const maxLevel = Math.floor(levelsPerOOM * Decimal.log10(totalEXPAvailable.div(costCoeff).plus(1)))
  const levelsGained = Math.max(0, maxLevel - runes[rune].level)

  if (levelsGained === 0) {
    // Can't afford any levels, return next level stuff
    const nextLevelEXP = computeEXPToLevel(rune, runes[rune].level + 1)
    const offeringsRequired = Decimal.max(1, nextLevelEXP.minus(runes[rune].runeEXP).div(runeEXPPerOffering).ceil())
    return { levels: 1, expRequired: nextLevelEXP, offerings: offeringsRequired }
  }

  // Return the levels we can gain and the EXP required for that many levels
  const expRequired = computeEXPToLevel(rune, runes[rune].level + levelsGained)
  // Need to be recomputed since offerings required is not necessarily equal to budget.
  const offeringsRequired = Decimal.max(1, expRequired.minus(runes[rune].runeEXP).div(runeEXPPerOffering).ceil())
  return { levels: levelsGained, expRequired: expRequired, offerings: offeringsRequired }
}

const levelRune = (rune: RuneKeys, timesLeveled: number, budget: Decimal) => {
  let budgetUsed: Decimal

  const expRequired = computeEXPLeftToLevel(rune, runes[rune].level + timesLeveled)
  const runeEXPPerOffering = getRuneEXPPerOffering(rune)
  const offeringsRequired = Decimal.max(1, expRequired.div(runeEXPPerOffering).ceil())

  if (offeringsRequired.gt(budget)) {
    runes[rune].runeEXP = runes[rune].runeEXP.add(budget.times(runeEXPPerOffering))
    budgetUsed = budget
  } else {
    runes[rune].runeEXP = computeEXPToLevel(rune, runes[rune].level + timesLeveled)
    budgetUsed = offeringsRequired
  }

  player.offerings = player.offerings.sub(budgetUsed)

  // this.updatePlayerEXP()
  // this.updateRuneEffectHTML()
}

const setRuneLevel = (rune: RuneKeys, level: number) => {
  const exp = computeEXPToLevel(rune, level)
  runes[rune].level = level
  runes[rune].runeEXP = exp
}

const updateLevelsFromEXP = (rune: RuneKeys) => {
  const levelsPerOOM = getLevelsPerOOM(rune)
  const levels = Math.floor(levelsPerOOM * Decimal.log10(runes[rune].runeEXP.div(runes[rune].costCoefficient).plus(1)))
  // Floating point imprecision fix
  if (computeEXPLeftToLevel(rune, levels + 1).eq(0)) {
    runes[rune].level = levels + 1
  } else {
    runes[rune].level = levels
  }
}

export const updateAllRuneLevelsFromEXP = () => {
  for (const rune of Object.keys(runes) as RuneKeys[]) {
    updateLevelsFromEXP(rune)
  }
  awardAchievementGroup('runeLevel')
}

export const updateRuneHTML = (rune: RuneKeys) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  DOMCacheGetOrSet(`${rune}RuneLevel`).textContent = i18next.t('runes.level', { x: format(runes[rune].level, 0, true) })
  DOMCacheGetOrSet(`${rune}RuneFreeLevel`).innerHTML = i18next.t('runes.freeLevels', {
    x: format(runes[rune].freeLevels(), 0, true)
  })

  if (player.offeringbuyamount === 100000) {
    const { levels, offerings } = maxRuneLevelPurchaseInformation(rune, player.offerings)
    DOMCacheGetOrSet(`${rune}RuneTNL`).innerHTML = i18next.t('runes.TNL', {
      levelAmount: format(levels, 0, true),
      offerings: format(offerings, 2, false)
    })
  } else {
    DOMCacheGetOrSet(`${rune}RuneTNL`).innerHTML = i18next.t('runes.TNL', {
      levelAmount: format(player.offeringbuyamount, 0, true),
      offerings: format(computeOfferingsToLevel(rune, runes[rune].level + player.offeringbuyamount), 2, false)
    })
  }
}

export const focusedRuneHTML = (rune: RuneKeys) => {
  const name = i18next.t('runes.runeName', {
    color: runes[rune].runeHTMLStyle.nameColor,
    name: runes[rune].name()
  })

  const nameHTML = `<span style="color: orange">${name}</span>`

  const description = runes[rune].description()
  const descriptionHTML = `<span style="color: lightgray">${description}</span>`
  const effectiveLevelHTML = i18next.t('runes.runeEffectiveLevel', {
    level: format(getRuneEffectiveLevel(rune), 2, false)
  })
  const effectiveLevelCalcHTML = i18next.t('runes.runeEffectiveLevelCalc', {
    purchased: format(runes[rune].level, 0, true),
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
    exp: format(runes[rune].runeEXP, 2, true),
    perEXP: format(getRuneEXPPerOffering(rune), 2, true)
  })

  let levelInfo = ''
  // For some dumb reason that old Platonic might be able to explain, 'MAX' was defined to
  // be 100,000 levels. This retroactively corrects the display logic.
  if (player.offeringbuyamount === 100000) {
    const { levels, expRequired, offerings } = maxRuneLevelPurchaseInformation(rune, player.offerings)
    levelInfo = i18next.t('runes.EXPNeeded', {
      level: format(levels, 0, true),
      exp: format(expRequired, 2, true),
      offerings: format(offerings, 0, true)
    })
  } else {
    levelInfo = i18next.t('runes.EXPNeeded', {
      level: format(player.offeringbuyamount, 0, true),
      exp: format(computeEXPToLevel(rune, runes[rune].level + player.offeringbuyamount), 2, true),
      offerings: format(computeOfferingsToLevel(rune, runes[rune].level + player.offeringbuyamount), 2, true)
    })
  }
  return `${nameHTML}<br>${descriptionHTML}
  <br><br>${effectiveLevelHTML}<br>${effectiveLevelCalcHTML}<br>${effectText}
  <br><br>${coefficientText}<br>${levelCostIncreaseText}
  <br><br>${experienceInfo}<br>${levelInfo}`
}

export const focusedRuneLockedHTML = (rune: RuneKeys) => {
  const name = i18next.t('runes.lockedRuneModal')
  const nameHTML = `<span style="color: gray">${name}</span>`

  const lockedDescription = i18next.t(`runes.${rune}.lockedDescription`)
  const lockedDescriptionHTML = `<span style="color: lightcoral">${lockedDescription}</span>`

  return `${nameHTML}<br>${lockedDescriptionHTML}`
}

/*export const updateRuneEffectHTML = (rune: RuneKeys) => {
  if (G.currentTab === Tabs.Runes) {
    DOMCacheGetOrSet(`${rune}RunePower`).innerHTML = runes[rune].effectsDescription()
  }
}*/

export const sumOfRuneLevels = () => {
  return Object.values(runes).reduce((sum, rune) => sum + rune.level, 0)
}

export const sumOfFreeRuneLevels = () => {
  return Object.values(runes).reduce((sum, rune) => sum + rune.freeLevels(), 0)
}

export const getNumberUnlockedRunes = () => {
  return Object.values(runes).filter((rune) => rune.isUnlocked()).length
}

export function resetRunes (tier: keyof typeof resetTiers) {
  if (runes === null) {
    throw new Error('Runes not initialized. Call initRunes first.')
  }
  for (const rune of Object.keys(runes) as RuneKeys[]) {
    if (resetTiers[tier] >= resetTiers[runes[rune].minimalResetTier]) {
      runes[rune].level = 0
      runes[rune].runeEXP = new Decimal(0)
      player.runes[rune] = new Decimal(0)
    }

    if (resetTiers[tier] === resetTiers[runes[rune].minimalResetTier] && tier === 'ascension') {
      setRuneLevel(rune, 3 * player.cubeUpgrades[26])
    }
  }
}

export const resetOfferings = () => {
  player.offerings = player.offerings.add(calculateOfferings())
}

export const sacrificeOfferings = (rune: RuneKeys, budget: Decimal, auto = false) => {
  // if automated && 2x10 cube upgrade bought, this will be >0.

  if (!runes[rune].isUnlocked()) {
    return
  }

  if (auto && rune === 'infiniteAscent' && player.highestSingularityCount < 30) {
    return
  }

  if (auto && rune === 'antiquities' && player.highestSingularityCount < 50) {
    return
  }

  let levelsToAdd = player.offeringbuyamount as number

  if (player.offeringbuyamount !== 100000 && !auto) {
    levelRune(rune, levelsToAdd, budget)
  } // If we have offeringbuyamount === 100000, try to buy max! Fuck you, old Platonic.
  else {
    levelsToAdd = maxRuneLevelPurchaseInformation(rune, budget).levels
    levelRune(rune, levelsToAdd, budget)
  }

  updateLevelsFromEXP(rune)
  player.offerings = Decimal.max(0, player.offerings)
}

export const generateRunesHTML = () => {
  const runeContainer = DOMCacheGetOrSet('runeDetails')

  for (const key of Object.keys(runes) as RuneKeys[]) {
    // Create unlocked rune container
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeType'
    runesDiv.id = `${key}RuneContainer`
    runesDiv.style.border = `2px solid ${runes[key].runeHTMLStyle.borderColor}`
    runesDiv.style.borderRadius = '8px'
    runesDiv.style.margin = '2px'
    // Add custom property for glow color
    runesDiv.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${runes[key].runeHTMLStyle.borderColor} 50%, orange 50%)`
    )

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
    runeFreeLevel.style.color = 'white'

    runesDiv.appendChild(runeFreeLevel)

    const runeTNL = document.createElement('span')
    runeTNL.className = 'runeTypeElement'
    runeTNL.id = `${key}RuneTNL`
    runeTNL.textContent = '0'
    runesDiv.appendChild(runeTNL)

    const sacrificeButton = document.createElement('button')
    sacrificeButton.className = 'runeTypeElement'
    sacrificeButton.id = `${key}RuneSacrifice`
    sacrificeButton.setAttribute('i18n', 'general.sacrificeCapital')
    sacrificeButton.textContent = i18next.t('general.sacrificeCapital')

    runesDiv.appendChild(sacrificeButton)

    runeContainer.appendChild(runesDiv)

    // Create locked rune container
    const lockedRunesDiv = document.createElement('div')
    lockedRunesDiv.className = 'runeType runeTypeLocked'
    lockedRunesDiv.id = `${key}RuneLockedContainer`
    lockedRunesDiv.style.border = '2px solid lightgray'
    lockedRunesDiv.style.borderRadius = '8px'
    lockedRunesDiv.style.margin = '2px'

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
