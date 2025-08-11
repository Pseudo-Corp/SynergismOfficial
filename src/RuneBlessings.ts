import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { awardAchievementGroup } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateSalvageRuneEXPMultiplier } from './Calculate'
import { resetTiers } from './Reset'
import { type RuneKeys, runes } from './Runes'
import { format, player } from './Synergism'
import { Tabs } from './Tabs'
import { getTalismanEffects } from './Talismans'
import { assert } from './Utility'
import { Globals as G } from './Variables'

type RuneBlessingTypeMap = {
  speed: { globalSpeed: number }
  duplication: { multiplierBoosts: number }
  prism: { antSacrificeMult: number }
  thrift: { accelBoostCostDelay: number }
  superiorIntellect: { obtToAntExponent: number }
}

export type RuneBlessingKeys = keyof RuneBlessingTypeMap

export interface RuneBlessingData<K extends RuneBlessingKeys> {
  level: number
  runeEXP: Decimal
  costCoefficient: Decimal
  levelsPerOOM: number
  effectiveLevelMult: () => number
  runeEXPPerOffering: () => Decimal
  minimalResetTier: keyof typeof resetTiers
  effects: (n: number) => RuneBlessingTypeMap[K]
  effectsDescription: (n: number) => string
  name: () => string
}

const blessingMultiplier = (key: RuneKeys) => {
  return (
    runes[key].level + runes[key].freeLevels()
      * (1 + (6.9 * player.researches[134]) / 100)
      * (getTalismanEffects('midas').blessingBonus)
      * (1 + 0.1 * Math.log10(player.epicFragments + 1) * player.researches[174])
      * (1 + (2 * player.researches[194]) / 100)
      * (1 + 0.25 * player.researches[160])
      * G.challenge15Rewards.blessingBonus.value
  )
}

export const runeBlessings: { [K in RuneBlessingKeys]: RuneBlessingData<K> } = {
  speed: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e8),
    levelsPerOOM: 4,
    effects: (level) => {
      const globalSpeed = 1 + level / 1000000
      return {
        globalSpeed
      }
    },
    effectsDescription: (level) => {
      const globalSpeed = runeBlessings.speed.effects(level).globalSpeed
      return i18next.t('runes.blessings.rewards.speed', {
        effect: format(globalSpeed, 3, true)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('speed'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.blessings.speed.name')
  },
  duplication: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e10),
    levelsPerOOM: 4,
    effects: (level) => {
      const multiplierBoosts = 1 + level / 1000000
      return {
        multiplierBoosts
      }
    },
    effectsDescription: (level) => {
      const multiplierBoosts = runeBlessings.duplication.effects(level).multiplierBoosts
      return i18next.t('runes.blessings.rewards.duplication', {
        effect: format(multiplierBoosts, 3, true)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('duplication'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.blessings.duplication.name')
  },
  prism: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e13),
    levelsPerOOM: 4,
    effects: (level) => {
      const antSacrificeMult = 1 + level / 1000000
      return {
        antSacrificeMult
      }
    },
    effectsDescription: (level) => {
      const antSacrificeMult = runeBlessings.prism.effects(level).antSacrificeMult
      return i18next.t('runes.blessings.rewards.prism', {
        effect: format(antSacrificeMult, 3, true)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('prism'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.blessings.prism.name')
  },
  thrift: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e16),
    levelsPerOOM: 4,
    effects: (level) => {
      const accelBoostCostDelay = 1 + level / 1000000
      return {
        accelBoostCostDelay
      }
    },
    effectsDescription: (level) => {
      const accelBoostCostDelay = runeBlessings.thrift.effects(level).accelBoostCostDelay
      return i18next.t('runes.blessings.rewards.thrift', {
        effect: format(accelBoostCostDelay, 3, true)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('thrift'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.blessings.thrift.name')
  },
  superiorIntellect: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e20),
    levelsPerOOM: 4,
    effects: (level) => {
      const obtToAntExponent = Math.log(1 + level / 1000000)
      return {
        obtToAntExponent
      }
    },
    effectsDescription: (level) => {
      const obtToAntExponent = runeBlessings.superiorIntellect.effects(level).obtToAntExponent
      return i18next.t('runes.blessings.rewards.superiorIntellect', {
        effect: format(obtToAntExponent, 3, true),
        effect2: format(Decimal.pow(player.obtainium, obtToAntExponent), 2, false)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('superiorIntellect'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.blessings.superiorIntellect.name')
  }
}

export const runeBlessingKeys = Object.keys(runeBlessings) as RuneBlessingKeys[]

export const getRuneBlessingPower = (bless: RuneBlessingKeys): number => {
  const blessingPowerMult = runeBlessings[bless].effectiveLevelMult()
  return runeBlessings[bless].level * blessingPowerMult
}

export const getRuneBlessingEffect = <T extends RuneBlessingKeys>(bless: T): RuneBlessingTypeMap[T] => {
  return runeBlessings[bless].effects(getRuneBlessingPower(bless))
}

export const getRuneBlessingEXPPerOffering = (bless: RuneBlessingKeys): Decimal => {
  return runeBlessings[bless].runeEXPPerOffering()
}

const computeEXPToLevel = (bless: RuneBlessingKeys, level: number) => {
  const levelPerOOM = runeBlessings[bless].levelsPerOOM
  return runeBlessings[bless].costCoefficient.times(Decimal.pow(10, level / levelPerOOM).minus(1))
}

const computeEXPLeftToLevel = (bless: RuneBlessingKeys, level: number) => {
  return Decimal.max(0, computeEXPToLevel(bless, level).minus(runeBlessings[bless].runeEXP))
}

const computeOfferingsToLevel = (bless: RuneBlessingKeys, level: number) => {
  return Decimal.max(1, computeEXPLeftToLevel(bless, level).div(getRuneBlessingEXPPerOffering(bless)).ceil())
}

export const getRuneBlessingTNL = (bless: RuneBlessingKeys) => {
  return computeEXPLeftToLevel(bless, runeBlessings[bless].level + 1)
}

export const buyBlessingLevels = (blessing: RuneBlessingKeys, budget: Decimal) => {
  if (!player.unlocks.blessings) {
    return
  }

  const levelsToAdd = player.runeBlessingBuyAmount

  levelBlessing(blessing, levelsToAdd, budget)
}

export const buyAllBlessingLevels = (budget: Decimal) => {
  const ratio = runeBlessingKeys.length
  const budgetPerBlessing = budget.div(ratio).floor()
  for (const key of runeBlessingKeys) {
    buyBlessingLevels(key, budgetPerBlessing)
  }

  if (player.offerings.lt(0)) {
    // TODO: Figure out why this fucking happens so often
    player.offerings = new Decimal(0)
  }
}

export const levelBlessing = (bless: RuneBlessingKeys, timesLeveled: number, budget: Decimal) => {
  let budgetUsed: Decimal

  const expRequired = computeEXPLeftToLevel(bless, runeBlessings[bless].level + timesLeveled)
  const runeEXPPerOffering = getRuneBlessingEXPPerOffering(bless)
  const offeringsRequired = Decimal.max(1, expRequired.div(runeEXPPerOffering).ceil())

  if (offeringsRequired.gt(budget)) {
    runeBlessings[bless].runeEXP = runeBlessings[bless].runeEXP.add(budget.times(runeEXPPerOffering))
    budgetUsed = budget
  } else {
    runeBlessings[bless].runeEXP = runeBlessings[bless].runeEXP.add(offeringsRequired.times(runeEXPPerOffering))
    budgetUsed = offeringsRequired
  }

  player.offerings = player.offerings.sub(budgetUsed)

  // this.updatePlayerEXP()
  // this.updateRuneEffectHTML()
}

export const setBlessingLevel = (bless: RuneBlessingKeys, level: number) => {
  const exp = computeEXPToLevel(bless, level)
  runeBlessings[bless].level = level
  runeBlessings[bless].runeEXP = exp
}

const updateLevelsFromEXP = (bless: RuneBlessingKeys) => {
  const levelsPerOOM = runeBlessings[bless].levelsPerOOM
  const levels = Math.floor(
    levelsPerOOM * Decimal.log10(runeBlessings[bless].runeEXP.div(runeBlessings[bless].costCoefficient).plus(1))
  )
  runeBlessings[bless].level = levels
}

const getLevelEstimate = (bless: RuneBlessingKeys, offerings: Decimal) => {
  const runeEXPPerOffering = getRuneBlessingEXPPerOffering(bless)
  const totalEXP = runeBlessings[bless].runeEXP.plus(offerings.times(runeEXPPerOffering))
  return Math.floor(
    runeBlessings[bless].levelsPerOOM * Decimal.log10(totalEXP.div(runeBlessings[bless].costCoefficient).plus(1))
  )
}

export const updateAllBlessingLevelsFromEXP = () => {
  for (const bless of runeBlessingKeys) {
    updateLevelsFromEXP(bless)
  }
  awardAchievementGroup('speedBlessing')
}

export const updateRuneBlessingHTML = (bless: RuneBlessingKeys) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')
  const levelsToDisplay = Math.min(
    player.runeBlessingBuyAmount,
    Math.max(1, getLevelEstimate(bless, player.offerings) - runeBlessings[bless].level)
  )

  DOMCacheGetOrSet(`${bless}RuneBlessingLevel`).innerHTML = `${
    i18next.t('runes.blessings.blessingLevel', {
      amount: format(runeBlessings[bless].level, 0, true)
    })
  } <br> ${i18next.t('runes.offeringInvested', { amount: format(runeBlessings[bless].runeEXP, 0, false) })}`
  DOMCacheGetOrSet(`${bless}RuneBlessingPurchase`).innerHTML = i18next.t('runes.blessings.increaseLevel', {
    amount: format(levelsToDisplay, 0, true),
    offerings: format(computeOfferingsToLevel(bless, runeBlessings[bless].level + levelsToDisplay), 0, false)
  })
  const blessingPower = getRuneBlessingPower(bless)
  DOMCacheGetOrSet(`${bless}RuneBlessingPower`).innerHTML = i18next.t('runes.blessings.blessingPower', {
    value: format(blessingPower, 0, true),
    desc: runeBlessings[bless].effectsDescription(blessingPower)
  })
}

export const updateRuneEffectHTML = (bless: RuneBlessingKeys) => {
  if (G.currentTab === Tabs.Runes) {
    DOMCacheGetOrSet(`${bless}RuneBlessingPower`).innerHTML = runeBlessings[bless].effectsDescription(
      getRuneBlessingPower(bless)
    )
  }
}

export function resetRuneBlessings (tier: keyof typeof resetTiers) {
  for (const bless of runeBlessingKeys) {
    if (resetTiers[tier] >= resetTiers[runeBlessings[bless].minimalResetTier]) {
      runeBlessings[bless].level = 0
      runeBlessings[bless].runeEXP = new Decimal(0)
    }
  }
}
