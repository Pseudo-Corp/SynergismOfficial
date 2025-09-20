import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { awardAchievementGroup } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateSalvageRuneEXPMultiplier } from './Calculate'
import { resetTiers } from './Reset'
import { type RuneKeys, runes } from './Runes'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Tabs } from './Tabs'
import { getTalismanEffects } from './Talismans'
import { IconSets } from './Themes'
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
  description: () => string
  HTMLData: {
    imgName: string
  }
}

const otherBlessingMultipliers = () => {
  return (1 + (6.9 * player.researches[134]) / 100)
    * (getTalismanEffects('midas').blessingBonus)
    * (1 + 0.1 * Decimal.log(player.epicFragments.add(1), 10) * player.researches[174])
    * (1 + (2 * player.researches[194]) / 100)
    * (1 + 0.25 * player.researches[160])
    * G.challenge15Rewards.blessingBonus.value
}

const blessingMultiplier = (key: RuneKeys) => {
  return (
    (runes[key].level + runes[key].freeLevels())
    * otherBlessingMultipliers()
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
      return i18next.t('runes.blessings.speed.globalSpeed', {
        val: formatAsPercentIncrease(globalSpeed, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('speed'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.speed.name(),
    description: () => i18next.t('runes.blessings.speed.description'),
    HTMLData: {
      imgName: 'BlessingSpeed'
    }
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
      return i18next.t('runes.blessings.duplication.multiplierBoosts', {
        val: formatAsPercentIncrease(multiplierBoosts, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('duplication'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.duplication.name(),
    description: () => i18next.t('runes.blessings.duplication.description'),
    HTMLData: {
      imgName: 'BlessingDuplication'
    }
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
      return i18next.t('runes.blessings.prism.antSacrifice', {
        val: formatAsPercentIncrease(antSacrificeMult, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('prism'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.prism.name(),
    description: () => i18next.t('runes.blessings.prism.description'),
    HTMLData: {
      imgName: 'BlessingPrism'
    }
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
      return i18next.t('runes.blessings.thrift.acceleratorBoostDelay', {
        val: formatAsPercentIncrease(accelBoostCostDelay, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier('thrift'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.thrift.name(),
    description: () => i18next.t('runes.blessings.thrift.description'),
    HTMLData: {
      imgName: 'BlessingThrift'
    }
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
      const obtExponentHTML = i18next.t('runes.blessings.superiorIntellect.obtExponent', {
        val: format(obtToAntExponent, 3, true)
      })
      const antSpeedHTML = i18next.t('runes.blessings.superiorIntellect.antSpeed', {
        val: format(Decimal.pow(player.obtainium, obtToAntExponent), 2, false)
      })
      return `${obtExponentHTML}<br>${antSpeedHTML}`
    },
    effectiveLevelMult: () => blessingMultiplier('superiorIntellect'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.superiorIntellect.name(),
    description: () => i18next.t('runes.blessings.superiorIntellect.description'),
    HTMLData: {
      imgName: 'BlessingSI'
    }
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

export const getRuneBlessingTNL = (bless: RuneBlessingKeys) => {
  return computeEXPLeftToLevel(bless, runeBlessings[bless].level + 1)
}

export const buyBlessingLevels = (blessing: RuneBlessingKeys, budget: Decimal) => {
  if (!player.unlocks.blessings) {
    return
  }

  const levelsToAdd = player.runeBlessingBuyAmount

  levelBlessing(blessing, levelsToAdd, budget)
  updateLevelsFromEXP(blessing)
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
    runeBlessings[bless].runeEXP = computeEXPToLevel(bless, runeBlessings[bless].level + timesLeveled)
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
  // Floating point imprecision fix
  if (computeEXPLeftToLevel(bless, levels + 1).eq(0)) {
    runeBlessings[bless].level = levels + 1
  } else {
    runeBlessings[bless].level = levels
  }
}

export const updateAllBlessingLevelsFromEXP = () => {
  for (const bless of runeBlessingKeys) {
    updateLevelsFromEXP(bless)
  }
  awardAchievementGroup('speedBlessing')
}

// Gives levels to buy, total EXP to that level, and offerings required to reach that level
export const maxBlessingLevelPurchaseInformation = (bless: RuneBlessingKeys, budget: Decimal) => {
  if (budget.lt(0)) {
    return { levels: 0, expRequired: new Decimal(0), offerings: new Decimal(0) }
  }

  const runeEXPPerOffering = getRuneBlessingEXPPerOffering(bless)
  const totalEXPAvailable = budget.times(runeEXPPerOffering).add(runeBlessings[bless].runeEXP)
  const levelsPerOOM = runeBlessings[bless].levelsPerOOM
  const costCoeff = runeBlessings[bless].costCoefficient

  // Take into account the smallest increment to floating point
  const minOfferingsToIncreaseEXP = Decimal.ceil(
    runeBlessings[bless].runeEXP.div(runeEXPPerOffering.times(Number.MAX_SAFE_INTEGER))
  )

  // Calculate max level we can reach with available EXP
  // EXP formula: costCoeff * (10^(level/levelsPerOOM) - 1)
  // Solving for level: level = levelsPerOOM * log10((EXP/costCoeff) + 1)
  // Unlike Runes, we always call this function, BUT we have a set cap on levels we can buy at once
  // (chosen by the player)
  const upperLimit = player.runeBlessingBuyAmount
  const maxLevel = Math.floor(levelsPerOOM * Decimal.log10(totalEXPAvailable.div(costCoeff).plus(1)))
  const levelsGained = Math.min(upperLimit, Math.max(0, maxLevel - runeBlessings[bless].level))

  if (levelsGained === 0) {
    // Can't afford any levels, return next level stuff
    const nextLevelEXP = computeEXPToLevel(bless, runeBlessings[bless].level + 1)
    const offeringsRequired = Decimal.max(
      minOfferingsToIncreaseEXP,
      nextLevelEXP.minus(runeBlessings[bless].runeEXP).div(runeEXPPerOffering).ceil()
    )
    return { levels: 1, expRequired: nextLevelEXP, offerings: offeringsRequired }
  }

  // Return the levels we can gain and the EXP required for that many levels
  const expRequired = computeEXPToLevel(bless, runeBlessings[bless].level + levelsGained)
  // Need to be recomputed since offerings required is not necessarily equal to budget.
  const offeringsRequired = Decimal.max(
    minOfferingsToIncreaseEXP,
    expRequired.minus(runeBlessings[bless].runeEXP).div(runeEXPPerOffering).ceil()
  )
  return { levels: levelsGained, expRequired: expRequired, offerings: offeringsRequired }
}

export const updateRuneBlessingHTML = (bless: RuneBlessingKeys) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  DOMCacheGetOrSet(`${bless}RuneBlessingLevel`).innerHTML = i18next.t('runes.blessings.blessingLevel', {
    amount: format(runeBlessings[bless].level, 0, true)
  })

  const { levels, offerings } = maxBlessingLevelPurchaseInformation(bless, player.offerings)

  DOMCacheGetOrSet(`${bless}RuneBlessingTNL`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: levels,
    offerings: format(offerings, 2, false)
  })
}

export const focusedRuneBlessingHTML = (bless: RuneBlessingKeys) => {
  const name = runeBlessings[bless].name()
  const nameHTML = `<span style="color: orchid">${name}</span>`

  const description = runeBlessings[bless].description()
  const descriptionHTML = `<span style="color: lightgray">${description}</span>`

  const blessingPowerHTML = i18next.t('runes.blessings.effectiveBlessingPower', {
    power: format(getRuneBlessingPower(bless), 0, true)
  })
  const baseBlessingPowerHTML = i18next.t('runes.blessings.baseBlessingPower', {
    level: format(runeBlessings[bless].level, 0, true)
  })
  const runePowerMultHTML = i18next.t('runes.blessings.runePowerMult', {
    level: format(runes[bless as RuneKeys].level + runes[bless as RuneKeys].freeLevels(), 0, true),
    name: runes[bless as RuneKeys].name()
  })
  const otherPowerMultHTML = i18next.t('runes.blessings.otherPowerMult', {
    mult: format(otherBlessingMultipliers(), 2, true)
  })

  const effectsDescriptionHTML = runeBlessings[bless].effectsDescription(getRuneBlessingPower(bless))

  const coefficientHTML = i18next.t('runes.blessings.runeCoefficientText', {
    val: format(runeBlessings[bless].levelsPerOOM, 0, true)
  })
  const levelCostIncreaseHTML = i18next.t('runes.perLevelIncrease', {
    x: format(Math.pow(10, 1 / runeBlessings[bless].levelsPerOOM), 4, false)
  })

  const experienceHTML = i18next.t('runes.blessings.blessingEXP', {
    exp: format(runeBlessings[bless].runeEXP, 2, true),
    perEXP: format(getRuneBlessingEXPPerOffering(bless), 2, true)
  })

  const { levels, expRequired, offerings } = maxBlessingLevelPurchaseInformation(bless, player.offerings)
  const levelInfo = i18next.t('runes.EXPNeeded', {
    level: format(levels, 0, true),
    exp: format(expRequired, 2, true),
    offerings: format(offerings, 0, true)
  })

  return `${nameHTML}<br>${descriptionHTML}
  <br><br>${blessingPowerHTML}<br>${baseBlessingPowerHTML}<br>${runePowerMultHTML}<br>${otherPowerMultHTML}
  <br><br>${effectsDescriptionHTML}
  <br><br>${coefficientHTML}<br>${levelCostIncreaseHTML}
  <br><br>${experienceHTML}<br>${levelInfo}`
}

export function resetRuneBlessings (tier: keyof typeof resetTiers) {
  for (const bless of runeBlessingKeys) {
    if (resetTiers[tier] >= resetTiers[runeBlessings[bless].minimalResetTier]) {
      runeBlessings[bless].level = 0
      runeBlessings[bless].runeEXP = new Decimal(0)
    }
  }
}

export const generateBlessingsHTML = () => {
  const blessingRow = DOMCacheGetOrSet('runeBlessings')

  for (const key of Object.keys(runeBlessings) as RuneBlessingKeys[]) {
    // Create unlocked rune container
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeType'
    runesDiv.id = `${key}RuneBlessingContainer`
    runesDiv.style.border = `2px solid ${runes[key].runeHTMLStyle.borderColor}`
    runesDiv.style.borderRadius = '8px'
    runesDiv.style.margin = '2px'
    runesDiv.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${runes[key].runeHTMLStyle.borderColor} 50%, orchid 50%)`
    )

    const runeName = document.createElement('p')
    runeName.className = 'runeTypeElement'
    runeName.setAttribute('i18n', `runes.${key}.name`)
    runeName.textContent = i18next.t(`runes.${key}.name`)

    runesDiv.appendChild(runeName)

    const runeIcon = document.createElement('img')
    runeIcon.className = 'runeImage'
    runeIcon.id = `${key}RuneBlessing`
    runeIcon.alt = `${key} Rune`
    runeIcon.src = `Pictures/${IconSets[player.iconSet][0]}/${runeBlessings[key].HTMLData.imgName}.png`
    runeIcon.loading = 'lazy'

    runesDiv.appendChild(runeIcon)

    const runeLevel = document.createElement('span')
    runeLevel.className = 'runeTypeElement'
    runeLevel.id = `${key}RuneBlessingLevel`
    runeLevel.textContent = 'Level 0/30'

    runesDiv.appendChild(runeLevel)

    const runeTNL = document.createElement('span')
    runeTNL.className = 'runeTypeElement'
    runeTNL.id = `${key}RuneBlessingTNL`
    runeTNL.textContent = '0'
    runesDiv.appendChild(runeTNL)

    const sacrificeButton = document.createElement('button')
    sacrificeButton.className = 'runeTypeElement'
    sacrificeButton.id = `${key}RuneBlessingPurchase`
    sacrificeButton.setAttribute('i18n', 'general.blessCapital')
    sacrificeButton.textContent = i18next.t('general.blessCapital')

    runesDiv.appendChild(sacrificeButton)

    blessingRow.appendChild(runesDiv)
  }
}
