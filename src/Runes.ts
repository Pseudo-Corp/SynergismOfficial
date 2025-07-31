import {
  calculateOfferings,
  calculateSalvageRuneEXPMultiplier,
  calculateSigmoidExponential,
  isIARuneUnlocked
} from './Calculate'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { getAmbrosiaUpgradeEffects } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcECC } from './Challenges'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { firstFiveRuneEffectivenessStats, runeEffectivenessStatsSI } from './Statistics'
import { Tabs } from './Tabs'
import { getRuneBonusFromAllTalismans, getTalismanEffects } from './Talismans'
import { assert } from './Utility'
import { awardAchievementGroup, getAchievementReward } from './Achievements'
import { getLevelMilestone } from './Levels'

export enum resetTiers {
  prestige = 1,
  transcension = 2,
  reincarnation = 3,
  ascension = 4,
  singularity = 5,
  never = 6
}

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
  Object.entries(indexToRune).map(([key, value]) => [value as RuneKeys, key as unknown])
) as Record<RuneKeys, number>

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
  }
  horseShoe: {
    ambrosiaLuck: number
    redLuck: number
    redLuckConversion: number
  }
}

export type RuneKeys = keyof RuneTypeMap

export interface RuneData<K extends RuneKeys> {
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
}

export const firstFiveFreeLevels = () => {
  return (
    Math.min(1e3, player.antUpgrades[8] ?? 0 + G.bonusant9)
    + 7 * Math.min(player.constantUpgrades[7], 1000)
  )
}

export const bonusRuneLevelsSpeed = () => {
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

export const bonusRuneLevelsDuplication = () => {
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

export const bonusRuneLevelsPrism = () => {
  return (
    getRuneBonusFromAllTalismans('prism')
  )
}

export const bonusRuneLevelsThrift = () => {
  return (
    getRuneBonusFromAllTalismans('thrift')
  )
}

export const bonusRuneLevelsSI = () => {
  return (
    getRuneBonusFromAllTalismans('superiorIntellect')
  )
}

export const bonusRuneLevelsIA = () => {
  return (
    (PCoinUpgradeEffects.INSTANT_UNLOCK_2 ? 6 : 0)
    + player.cubeUpgrades[73]
    + player.campaigns.bonusRune6
    + getRuneBonusFromAllTalismans('infiniteAscent')
  )
}

export const bonusRuneLevelsAntiquities = () => {
  return getRuneBonusFromAllTalismans('antiquities')
}

export const bonusRuneLevelsHorseShoe = () => {
  return getRuneBonusFromAllTalismans('horseShoe')
}

export const speedRuneOOMIncrease = () => {
  return (
    player.upgrades[66] * 2
    + player.researches[77]
    + player.researches[111]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + player.cubeUpgrades[16]
    + getTalismanEffects('chronos').speedOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('speedRune')
  )
}

export const duplicationRuneOOMIncrease = () => {
  return (
    0.75 * CalcECC('transcend', player.challengecompletions[1])
    + player.upgrades[66] * 2
    + player.researches[78]
    + player.researches[112]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + getTalismanEffects('exemption').duplicationOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('duplicationRune')
  )
}

export const prismRuneOOMIncrease = () => {
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

export const thriftRuneOOMIncrease = () => {
  return (
    player.upgrades[66] * 2
    + player.researches[80]
    + player.researches[114]
    + CalcECC('ascension', player.challengecompletions[11])
    + 1.5 * CalcECC('ascension', player.challengecompletions[14])
    + player.cubeUpgrades[37]
    + getTalismanEffects('midas').thriftOOMBonus
    + getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').runeOOMBonus
    + getLevelMilestone('thriftRune')
  )
}

export const superiorIntellectOOMIncrease = () => {
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

export const infiniteAscentOOMIncrease = () => {
  return (
    getAmbrosiaUpgradeEffects('ambrosiaRuneOOMBonus').infiniteAscentOOMBonus
  )
}

export const antiquitiesOOMIncrease = () => {
  return (
    +player.singularityChallenges.noOfferingPower.rewards.antiquitiesOOMBonus
  )
}

export const firstFiveEffectiveRuneLevelMult = () => {
  return firstFiveRuneEffectivenessStats.reduce((x, y) => x * y.stat(), 1)
}

export const SIEffectiveRuneLevelMult = () => {
  return runeEffectivenessStatsSI.reduce((x, y) => x * y.stat(), 1)
}

export const universalRuneEXPMult = (purchasedLevels: number): Decimal => {
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
    // Particle Upgrade 1x1
    + 2 * player.upgrades[61]
    // Particle upgrade 3x1
    + (player.upgrades[71] * purchasedLevels) / 25
  )

  // Rune multiplier that gets applied to all runes
  const allRuneExpMultiplier = [
    // Research 4x16
    1 + player.researches[91] / 20,
    // Research 4x17
    1 + player.researches[92] / 20,
    // Ant 8
    calculateSigmoidExponential(
      999,
      (1 / 10000) * Math.pow(player.antUpgrades[8 - 1]! + G.bonusant8, 1.1)
    ),
    // Cube Bonus
    G.cubeBonusMultiplier[4],
    // Cube Upgrade Bonus
    1 + (player.ascensionCounter / 1000) * player.cubeUpgrades[32],
    // Constant Upgrade Multiplier
    1 + (1 / 10) * player.constantUpgrades[8],
    // Challenge 15 reward multiplier
    G.challenge15Rewards.runeExp.value
  ].reduce((x, y) => x.times(y), new Decimal('1'))

  return allRuneExpMultiplier.times(allRuneExpAdditiveMultiplier).times(recycleMultiplier)
}

export const speedEXPMult = () => {
  return [
    1 + CalcECC('reincarnation', player.challengecompletions[7]) / 10
  ].reduce((x, y) => x.times(y), new Decimal('1'))
}

export const duplicationEXPMult = () => {
  return [
    1 + CalcECC('reincarnation', player.challengecompletions[7]) / 10
  ].reduce((x, y) => x.times(y), new Decimal('1'))
}

export const prismEXPMult = () => {
  return [
    1 + CalcECC('reincarnation', player.challengecompletions[8]) / 5
  ].reduce((x, y) => x.times(y), new Decimal('1'))
}

export const thriftEXPMult = () => {
  return [
    1 + CalcECC('reincarnation', player.challengecompletions[6]) / 10
  ].reduce((x, y) => x.times(y), new Decimal('1'))
}

export const superiorIntellectEXPMult = () => {
  return [
    1 + CalcECC('reincarnation', player.challengecompletions[9]) / 5,
    1 + 1 / 20 * player.researches[83]
  ].reduce((x, y) => x.times(y), new Decimal('1'))
}

export const infiniteAscentEXPMult = () => {
  return new Decimal('1')
}

export const antiquitiesEXPMult = () => {
  return new Decimal('1')
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
      return i18next.t('runes.speed.effect', {
        val: format(100 * effects.acceleratorPower, 2),
        val2: formatAsPercentIncrease(effects.multiplicativeAccelerators, 2),
        val3: formatAsPercentIncrease(effects.globalSpeed, 2)
      })
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsSpeed(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels).times(speedEXPMult()),
    isUnlocked: () => true,
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.speed.name'),
    description: () => i18next.t('runes.speed.description'),
    valueText: () => i18next.t('runes.speed.values')
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
      const taxReduction = 0.001 + .999 * Math.exp(-Math.cbrt(n) / 10)
      return {
        multiplierBoosts: multiplierBoosts,
        multiplicativeMultipliers: multiplicativeMultipliers,
        taxReduction: taxReduction
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('duplication')
      return i18next.t('runes.duplication.effect', {
        val: format(effect.multiplierBoosts, 2, true),
        val2: formatAsPercentIncrease(effect.multiplicativeMultipliers, 2),
        val3: format(100 * (1 - effect.taxReduction), 3, true)
      })
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsDuplication(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels).times(duplicationEXPMult()),
    isUnlocked: () => Boolean(getAchievementReward('duplicationRuneUnlock')),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.duplication.name'),
    description: () => i18next.t('runes.duplication.description'),
    valueText: () => i18next.t('runes.duplication.values')
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
      return i18next.t('runes.prism.effect', {
        val: format(
          Decimal.pow(10, effect.productionLog10),
          2,
          true
        ),
        val2: format(Decimal.pow(10, effect.costDivisorLog10), 2, true)
      })},
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsPrism(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels).times(prismEXPMult()),
    isUnlocked: () => Boolean(getAchievementReward('prismRuneUnlock')),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.prism.name'),
    description: () => i18next.t('runes.prism.description'),
    valueText: () => i18next.t('runes.prism.values')
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
      const taxReduction = 0.01 + 0.99 * Math.exp(-Math.cbrt(level) / 20)
      return {
        costDelay: costDelay,
        salvage: salvage,
        taxReduction: taxReduction
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('thrift')
      return i18next.t('runes.thrift.effect', {
        val: format(effect.costDelay, 2, true),
        val2: format(effect.salvage, 2, true),
        val3: format(100 * (1 - effect.taxReduction), 2, true)
      })
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsThrift(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels).times(thriftEXPMult()),
    isUnlocked: () => Boolean(getAchievementReward('thriftRuneUnlock')),
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.thrift.name'),
    description: () => i18next.t('runes.thrift.description'),
    valueText: () => i18next.t('runes.thrift.values')
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
      const antSpeed = 1 + Math.pow(level, 2) / 2500
      return {
        offeringMult: offeringMult,
        obtainiumMult: obtainiumMult,
        antSpeed: antSpeed
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('superiorIntellect')
      return i18next.t('runes.superiorIntellect.effect', {
        val: format(effect.offeringMult, 3, true),
        val2: format(effect.obtainiumMult, 3, true),
        val3: format(effect.antSpeed, 3, true)
      })
    },
    effectiveLevelMult: () => firstFiveEffectiveRuneLevelMult() * SIEffectiveRuneLevelMult(),
    freeLevels: () => firstFiveFreeLevels() + bonusRuneLevelsSI(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels).times(superiorIntellectEXPMult()),
    isUnlocked: () => player.researches[82] > 0,
    minimalResetTier: 'ascension',
    name: () => i18next.t('runes.superiorIntellect.name'),
    description: () => i18next.t('runes.superiorIntellect.description'),
    valueText: () => i18next.t('runes.superiorIntellect.values')
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

      const salvagePerkLevels = [30, 40, 55, 70, 90, 110, 130, 160, 190, 235, 260]
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
      let text = ''
      text += i18next.t('runes.infiniteAscent.effect', {
        val: formatAsPercentIncrease(effectValues.quarkMult),
        val2: formatAsPercentIncrease(effectValues.cubeMult)
      })
      if (player.highestSingularityCount >= 30) {
        text += ` ${
          i18next.t('runes.infiniteAscent.bonusEffect', {
            val3: format(effectValues.salvage, 2, true)
          })
        }`
      }
      return text
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsIA(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels).times(infiniteAscentEXPMult()),
    isUnlocked: () => isIARuneUnlocked(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.infiniteAscent.name'),
    description: () => i18next.t('runes.infiniteAscent.description'),
    valueText: () => i18next.t('runes.infiniteAscent.values')
  },
  antiquities: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal(1e206),
    levelsPerOOM: 1 / 50,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => 0,
    effects: (level) => {
      const addCodeCooldownReduction = level > 0 ? 0.8 - 0.3 * (level - 1) / (level + 10) : 1
      const offeringLog10 = level
      const obtainiumLog10 = level
      return {
        addCodeCooldownReduction: addCodeCooldownReduction,
        offeringLog10: offeringLog10,
        obtainiumLog10: obtainiumLog10
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('antiquities')
      return i18next.t('runes.antiquities.effect', {
        val: format(Decimal.pow(10, effect.offeringLog10), 0, true),
        val2: format(Decimal.pow(10, effect.obtainiumLog10), 0, true),
        val3: format(100 * effect.addCodeCooldownReduction, 2, true)
      })
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsAntiquities(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels).times(antiquitiesEXPMult()),
    isUnlocked: () => player.platonicUpgrades[20] > 0,
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.antiquities.name'),
    description: () => i18next.t('runes.antiquities.description'),
    valueText: () => i18next.t('runes.antiquities.values')
  },
  horseShoe: {
    level: 0,
    runeEXP: new Decimal('0'),
    costCoefficient: new Decimal('1e500'),
    levelsPerOOM: 1 / 16,
    ignoreChal9: true,
    levelsPerOOMIncrease: () => 0,
    effects: (level) => {
      const ambrosiaLuck = 5 * level
      const redLuck = level
      const redLuckConversion = -0.5 * level / (level + 50)
      return {
        ambrosiaLuck: ambrosiaLuck,
        redLuck: redLuck,
        redLuckConversion: redLuckConversion
      }
    },
    effectsDescription: () => {
      const effect = getRuneEffects('horseShoe')
      return i18next.t('runes.horseShoe.effect', {
        val: format(effect.ambrosiaLuck, 0, true),
        val2: format(effect.redLuck, 0, true),
        val3: format(effect.redLuckConversion, 3, false)
      })
    },
    effectiveLevelMult: () => 1,
    freeLevels: () => bonusRuneLevelsHorseShoe(),
    runeEXPPerOffering: (purchasedLevels) => universalRuneEXPMult(purchasedLevels),
    isUnlocked: () => {
      const condition = Boolean(player.singularityChallenges.noOfferingPower.rewards.horseShoeUnlock)
      return condition
    },
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.horseShoe.name'),
    description: () => i18next.t('runes.horseShoe.description'),
    valueText: () => i18next.t('runes.horseShoe.values')
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

export const getLevelsPerOOM = (rune: RuneKeys): number => {
  return runes[rune].levelsPerOOM + runes[rune].levelsPerOOMIncrease()
}

export const getRuneEXPPerOffering = (rune: RuneKeys): Decimal => {
  return runes[rune].runeEXPPerOffering(runes[rune].level)
}

export const computeEXPToLevel = (rune: RuneKeys, level: number) => {
  const levelPerOOM = getLevelsPerOOM(rune)
  return runes[rune].costCoefficient.times(Decimal.pow(10, level / levelPerOOM).minus(1))
}

export const computeEXPLeftToLevel = (rune: RuneKeys, level: number) => {
  return Decimal.max(0, computeEXPToLevel(rune, level).minus(runes[rune].runeEXP))
}

export const computeOfferingsToLevel = (rune: RuneKeys, level: number) => {
  return Decimal.max(1, computeEXPLeftToLevel(rune, level).div(getRuneEXPPerOffering(rune)).ceil())
}

export const getRuneTNL = (rune: RuneKeys) => {
  return computeEXPLeftToLevel(rune, runes[rune].level + 1)
}

export const levelRune = (rune: RuneKeys, timesLeveled: number, budget: Decimal) => {
  let budgetUsed: Decimal

  const expRequired = computeEXPLeftToLevel(rune, runes[rune].level + timesLeveled)
  const runeEXPPerOffering = getRuneEXPPerOffering(rune)
  const offeringsRequired = Decimal.max(1, expRequired.div(runeEXPPerOffering).ceil())

  if (offeringsRequired.gt(budget)) {
    runes[rune].runeEXP = runes[rune].runeEXP.add(budget.times(runeEXPPerOffering))
    budgetUsed = budget
  } else {
    runes[rune].runeEXP = runes[rune].runeEXP.add(offeringsRequired.times(runeEXPPerOffering))
    budgetUsed = offeringsRequired
  }

  player.offerings = player.offerings.sub(budgetUsed)

  // this.updatePlayerEXP()
  // this.updateRuneEffectHTML()
}

export const setRuneLevel = (rune: RuneKeys, level: number) => {
  const exp = computeEXPToLevel(rune, level)
  runes[rune].level = level
  runes[rune].runeEXP = exp
}

export const updateLevelsFromEXP = (rune: RuneKeys) => {
  const levelsPerOOM = getLevelsPerOOM(rune)
  const levels = Math.floor(levelsPerOOM * Decimal.log10(runes[rune].runeEXP.div(runes[rune].costCoefficient).plus(1)))
  runes[rune].level = levels
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
  DOMCacheGetOrSet(`${rune}RuneFreeLevel`).textContent = i18next.t('runes.freeLevels', {
    x: format(runes[rune].freeLevels(), 0, true)
  })
  DOMCacheGetOrSet(`${rune}RuneTNL`).textContent = i18next.t('runes.TNL', { EXP: format(getRuneTNL(rune), 2, false) })
}

export const updateFocusedRuneHTML = (rune: RuneKeys) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  DOMCacheGetOrSet('focusedRuneName').textContent = runes[rune].name()
  DOMCacheGetOrSet('focusedRuneDescription').innerHTML = runes[rune].description()
  DOMCacheGetOrSet('focusedRuneValues').innerHTML = runes[rune].valueText()
  DOMCacheGetOrSet('focusedRuneCoefficient').textContent = i18next.t('runes.runeCoefficientText', {
    x: format(runes[rune].levelsPerOOM, 2, true),
    y: format(runes[rune].levelsPerOOMIncrease(), 2, true),
    z: format(getLevelsPerOOM(rune), 2, true)
  })
  DOMCacheGetOrSet('focusedRuneLevelInfo').textContent = i18next.t('runes.offeringText', {
    exp: format(getRuneEXPPerOffering(rune), 2, true),
    offeringReq: format(computeOfferingsToLevel(rune, runes[rune].level + player.offeringbuyamount), 0, true),
    levels: format(player.offeringbuyamount, 0, true)
  })
}

export const updateRuneEffectHTML = (rune: RuneKeys) => {
  if (G.currentTab === Tabs.Runes) {
    DOMCacheGetOrSet(`${rune}RunePower`).innerHTML = runes[rune].effectsDescription()
  }
}

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

  let levelsToAdd = player.offeringbuyamount
  if (auto) {
    levelsToAdd = 20 * player.shopUpgrades.offeringAuto
  }
  if (auto && player.cubeUpgrades[20] > 0) {
    levelsToAdd *= 20
  }

  levelRune(rune, levelsToAdd, budget)

  player.offerings = Decimal.max(0, player.offerings)
}

export const generateRunesHTML = () => {
  const alreadyGenerated = document.getElementsByClassName('runeType').length > 0

  if (alreadyGenerated) {
    return
  } else {
    const runeContainer = DOMCacheGetOrSet('runeDetails')

    for (const key of Object.keys(runes) as RuneKeys[]) {
      const runesDiv = document.createElement('div')
      runesDiv.className = 'runeType'
      runesDiv.id = `${key}RuneContainer`

      const runeName = document.createElement('p')
      runeName.className = 'runeTypeElement'
      runeName.setAttribute('i18n', `runes.${key}.name`)
      runeName.textContent = i18next.t(`runes.${key}.name`)

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
      runeFreeLevel.style.color = 'orange'

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
    }
  }
}
