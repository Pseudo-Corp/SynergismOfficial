import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateSalvageRuneEXPMultiplier } from './Calculate'
import { resetTiers } from './Reset'
import { type RuneBlessingKeys, runeBlessings } from './RuneBlessings'
import { type RuneKeys, runes } from './Runes'
import { format, player } from './Synergism'
import { Tabs } from './Tabs'
import { assert } from './Utility'
import { Globals as G } from './Variables'
import { awardAchievementGroup } from './Achievements'

type RuneSpiritTypeMap = {
  speed: { globalSpeed: number }
  duplication: { wowCubes: number }
  prism: { crystalCaps: number }
  thrift: { offerings: number }
  superiorIntellect: { obtainium: number }
}

export type RuneSpiritKeys = keyof RuneSpiritTypeMap

export interface RuneSpiritData<K extends RuneSpiritKeys> {
  level: number
  runeEXP: Decimal
  costCoefficient: Decimal
  levelsPerOOM: number
  effectiveLevelMult: () => number
  runeEXPPerOffering: () => Decimal
  minimalResetTier: keyof typeof resetTiers
  effects: (n: number) => RuneSpiritTypeMap[K]
  effectsDescription: (n: number) => string
  name: () => string
}

const spiritMultiplier = (key: RuneKeys) => {
  return (
    (runes[key].level + runes[key].freeLevels())
    * runeBlessings[key as RuneBlessingKeys].level
    * (1 + (8 * player.researches[164]) / 100)
    * (player.researches[165] && player.currentChallenge.ascension !== 0 ? 2 : 1)
    * (1 + 0.15 * Math.log10(player.legendaryFragments + 1) * player.researches[189])
    * (1 + (2 * player.researches[194]) / 100)
    * G.challenge15Rewards.spiritBonus.value
    * player.corruptions.used.totalCorruptionDifficultyMultiplier
  )
}

export const runeSpirits: { [K in RuneSpiritKeys]: RuneSpiritData<K> } = {
  speed: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e50),
    levelsPerOOM: 2,
    effects: (level) => {
      const globalSpeed = 1 + level / 1e9
      return { globalSpeed }
    },
    effectsDescription: (level) => {
      const globalSpeed = runeSpirits.speed.effects(level).globalSpeed
      return i18next.t('runes.spirits.rewards.speed', {
        effect: format(globalSpeed, 3, true)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('speed'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.spirits.speed.name')
  },
  duplication: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e60),
    levelsPerOOM: 2,
    effects: (level) => {
      const wowCubes = 1 + level / 1e9
      return { wowCubes }
    },
    effectsDescription: (level) => {
      const wowCubes = runeSpirits.duplication.effects(level).wowCubes
      return i18next.t('runes.spirits.rewards.duplication', {
        effect: format(wowCubes, 3, true)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('duplication'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.spirits.duplication.name')
  },
  prism: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e70),
    levelsPerOOM: 2,
    effects: (level) => {
      const crystalCaps = 1 + level / 1e9
      return { crystalCaps }
    },
    effectsDescription: (level) => {
      const crystalCaps = runeSpirits.prism.effects(level).crystalCaps
      return i18next.t('runes.spirits.rewards.prism', {
        effect: format(crystalCaps, 3, true)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('prism'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.spirits.prism.name')
  },
  thrift: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e85),
    levelsPerOOM: 2,
    effects: (level) => {
      const offerings = 1 + level / 1e9
      return { offerings }
    },
    effectsDescription: (level) => {
      const offerings = runeSpirits.thrift.effects(level).offerings
      return i18next.t('runes.spirits.rewards.thrift', {
        effect: format(offerings, 3, true)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('thrift'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.spirits.thrift.name')
  },
  superiorIntellect: {
    level: 0,
    runeEXP: new Decimal(0),
    costCoefficient: new Decimal(1e100),
    levelsPerOOM: 2,
    effects: (level) => {
      const obtainium = 1 + level / 1e9
      return { obtainium }
    },
    effectsDescription: (level) => {
      const obtainium = runeSpirits.superiorIntellect.effects(level).obtainium
      return i18next.t('runes.spirits.rewards.superiorIntellect', {
        effect: format(obtainium, 3, true)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('superiorIntellect'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => i18next.t('runes.spirits.superiorIntellect.name')
  }
}

export const runeSpiritKeys = Object.keys(runeSpirits) as RuneSpiritKeys[]

export const getRuneSpiritPower = (spirit: RuneSpiritKeys): number => {
  const spiritpowerMult = runeSpirits[spirit].effectiveLevelMult()
  return runeSpirits[spirit].level * spiritpowerMult
}

export const getRuneSpiritEffect = <T extends RuneSpiritKeys>(spirit: T): RuneSpiritTypeMap[T] => {
  return runeSpirits[spirit].effects(getRuneSpiritPower(spirit))
}

export const getRuneSpiritEXPPerOffering = (spirit: RuneSpiritKeys): Decimal => {
  return runeSpirits[spirit].runeEXPPerOffering()
}

const computeEXPToLevel = (spirit: RuneSpiritKeys, level: number) => {
  const levelPerOOM = runeSpirits[spirit].levelsPerOOM
  return runeSpirits[spirit].costCoefficient.times(Decimal.pow(10, level / levelPerOOM).minus(1))
}

const computeEXPLeftToLevel = (spirit: RuneSpiritKeys, level: number) => {
  return Decimal.max(0, computeEXPToLevel(spirit, level).minus(runeSpirits[spirit].runeEXP))
}

const computeOfferingsToLevel = (spirit: RuneSpiritKeys, level: number) => {
  return Decimal.max(1, computeEXPLeftToLevel(spirit, level).div(getRuneSpiritEXPPerOffering(spirit)).ceil())
}

export const getRuneSpiritTNL = (spirit: RuneSpiritKeys) => {
  return computeEXPLeftToLevel(spirit, runeSpirits[spirit].level + 1)
}

export const buySpiritLevels = (spirit: RuneSpiritKeys, budget: Decimal) => {
  if (!player.unlocks.spirits) {
    return
  }

  const levelsToAdd = player.runeSpiritBuyAmount

  levelSpirit(spirit, levelsToAdd, budget)
}

export const buyAllSpiritLevels = (budget: Decimal) => {
  const ratio = runeSpiritKeys.length
  for (const key of runeSpiritKeys) {
    buySpiritLevels(key, Decimal.floor(budget.div(ratio)))
  }

    if (player.offerings.lt(0)) {
      // TODO: Figure out why this fucking happens so often
      player.offerings = new Decimal(0)
    }
}

export const levelSpirit = (spirit: RuneSpiritKeys, timesLeveled: number, budget: Decimal) => {
  let budgetUsed: Decimal

  const expRequired = computeEXPLeftToLevel(spirit, runeSpirits[spirit].level + timesLeveled)
  const runeEXPPerOffering = getRuneSpiritEXPPerOffering(spirit)
  const offeringsRequired = Decimal.max(1, expRequired.div(runeEXPPerOffering).ceil())

  if (offeringsRequired.gt(budget)) {
    runeSpirits[spirit].runeEXP = runeSpirits[spirit].runeEXP.add(budget.times(runeEXPPerOffering))
    budgetUsed = budget
  } else {
    runeSpirits[spirit].runeEXP = runeSpirits[spirit].runeEXP.add(offeringsRequired.times(runeEXPPerOffering))
    budgetUsed = offeringsRequired
  }

  player.offerings = player.offerings.sub(budgetUsed)

  // this.updatePlayerEXP()
  // this.updateRuneEffectHTML()
}

export const setSpiritLevel = (spirit: RuneSpiritKeys, level: number) => {
  const exp = computeEXPToLevel(spirit, level)
  runeSpirits[spirit].level = level
  runeSpirits[spirit].runeEXP = exp
}

const updateLevelsFromEXP = (spirit: RuneSpiritKeys) => {
  const levelsPerOOM = runeSpirits[spirit].levelsPerOOM
  const levels = Math.floor(
    levelsPerOOM * Decimal.log10(runeSpirits[spirit].runeEXP.div(runeSpirits[spirit].costCoefficient).plus(1))
  )
  runeSpirits[spirit].level = levels
}

const getLevelEstimate = (spirit: RuneSpiritKeys, offerings: Decimal) => {
  const runeEXPPerOffering = getRuneSpiritEXPPerOffering(spirit)
  const totalEXP = runeSpirits[spirit].runeEXP.plus(offerings.times(runeEXPPerOffering))
  return Math.floor(
    runeSpirits[spirit].levelsPerOOM * Decimal.log10(totalEXP.div(runeSpirits[spirit].costCoefficient).plus(1))
  )
}

export const updateAllSpiritLevelsFromEXP = () => {
  for (const spirit of runeSpiritKeys) {
    updateLevelsFromEXP(spirit)
  }
  awardAchievementGroup('speedSpirit')
}

export const updateRuneSpiritHTML = (spirit: RuneSpiritKeys) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')
  const levelsToDisplay = Math.min(
    player.runeSpiritBuyAmount,
    Math.max(1, getLevelEstimate(spirit, player.offerings) - runeSpirits[spirit].level)
  )

  DOMCacheGetOrSet(`${spirit}RuneSpiritLevel`).innerHTML = `${
    i18next.t('runes.spirits.spiritLevel', {
      amount: format(runeSpirits[spirit].level, 0, true)
    })
  } <br> ${i18next.t('runes.offeringInvested', { amount: format(runeSpirits[spirit].runeEXP, 0, false) })}`
  DOMCacheGetOrSet(`${spirit}RuneSpiritPurchase`).innerHTML = i18next.t('runes.spirits.increaseLevel', {
    amount: format(levelsToDisplay, 0, true),
    offerings: format(computeOfferingsToLevel(spirit, runeSpirits[spirit].level + levelsToDisplay), 0, false)
  })
  const blessingPower = getRuneSpiritPower(spirit)
  DOMCacheGetOrSet(`${spirit}RuneSpiritPower`).innerHTML = i18next.t('runes.spirits.spiritPower', {
    value: format(blessingPower, 0, true),
    desc: runeSpirits[spirit].effectsDescription(blessingPower)
  })
}

export const updateRuneEffectHTML = (spirit: RuneSpiritKeys) => {
  if (G.currentTab === Tabs.Runes) {
    DOMCacheGetOrSet(`${spirit}RuneSpiritPower`).innerHTML = runeSpirits[spirit].effectsDescription(
      getRuneSpiritPower(spirit)
    )
  }
}

export function resetRuneSpirits (tier: keyof typeof resetTiers) {
  for (const spirit of runeSpiritKeys) {
    if (resetTiers[tier] >= resetTiers[runeSpirits[spirit].minimalResetTier]) {
      runeSpirits[spirit].level = 0
      runeSpirits[spirit].runeEXP = new Decimal(0)
    }
  }
}
