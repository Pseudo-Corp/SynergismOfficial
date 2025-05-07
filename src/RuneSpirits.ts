import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { awardAchievementGroup } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateSalvageRuneEXPMultiplier } from './Calculate'
import { resetTiers } from './Reset'
import { type RuneBlessingKeys, runeBlessings } from './RuneBlessings'
import { type RuneKeys, runes } from './Runes'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Tabs } from './Tabs'
import { IconSets } from './Themes'
import { assert } from './Utility'
import { Globals as G } from './Variables'

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
  description: () => string
  HTMLData: {
    imgName: string
  }
}

const otherSpiritMultipliers = () => {
  return (1 + (8 * player.researches[164]) / 100)
    * (player.researches[165] && player.currentChallenge.ascension !== 0 ? 2 : 1)
    * (1 + 0.15 * Decimal.log(player.legendaryFragments.add(1), 10) * player.researches[189])
    * (1 + (2 * player.researches[194]) / 100)
    * G.challenge15Rewards.spiritBonus.value
    * player.corruptions.used.totalCorruptionDifficultyMultiplier
}

const spiritMultiplier = (key: RuneKeys) => {
  return (
    (runes[key].level + runes[key].freeLevels())
    * runeBlessings[key as RuneBlessingKeys].level
    * otherSpiritMultipliers()
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
      return i18next.t('runes.spirits.speed.globalSpeed', {
        val: formatAsPercentIncrease(globalSpeed, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('speed'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.speed.name(),
    description: () => i18next.t('runes.spirits.speed.description'),
    HTMLData: {
      imgName: 'SpiritSpeed'
    }
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
      return i18next.t('runes.spirits.duplication.wowCubes', {
        val: formatAsPercentIncrease(wowCubes, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('duplication'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.duplication.name(),
    description: () => i18next.t('runes.spirits.duplication.description'),
    HTMLData: {
      imgName: 'SpiritDuplication'
    }
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
      return i18next.t('runes.spirits.prism.crystalCaps', {
        val: formatAsPercentIncrease(crystalCaps, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('prism'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.prism.name(),
    description: () => i18next.t('runes.spirits.prism.description'),
    HTMLData: {
      imgName: 'SpiritPrism'
    }
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
      return i18next.t('runes.spirits.thrift.offerings', {
        val: formatAsPercentIncrease(offerings, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('thrift'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.thrift.name(),
    description: () => i18next.t('runes.spirits.thrift.description'),
    HTMLData: {
      imgName: 'SpiritThrift'
    }
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
      return i18next.t('runes.spirits.superiorIntellect.obtainium', {
        val: formatAsPercentIncrease(obtainium, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier('superiorIntellect'),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes.superiorIntellect.name(),
    description: () => i18next.t('runes.spirits.superiorIntellect.description'),
    HTMLData: {
      imgName: 'SpiritSI'
    }
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

export const getRuneSpiritTNL = (spirit: RuneSpiritKeys) => {
  return computeEXPLeftToLevel(spirit, runeSpirits[spirit].level + 1)
}

export const buySpiritLevels = (spirit: RuneSpiritKeys, budget: Decimal) => {
  if (!player.unlocks.spirits) {
    return
  }

  const levelsToAdd = player.runeSpiritBuyAmount

  levelSpirit(spirit, levelsToAdd, budget)
  updateLevelsFromEXP(spirit)
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
    runeSpirits[spirit].runeEXP = computeEXPToLevel(spirit, runeSpirits[spirit].level + timesLeveled)
    budgetUsed = offeringsRequired
  }

  player.offerings = player.offerings.sub(budgetUsed)
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
  // Floating point imprecision fix
  if (computeEXPLeftToLevel(spirit, levels + 1).eq(0)) {
    runeSpirits[spirit].level = levels + 1
  } else {
    runeSpirits[spirit].level = levels
  }
}

export const updateAllSpiritLevelsFromEXP = () => {
  for (const spirit of runeSpiritKeys) {
    updateLevelsFromEXP(spirit)
  }
  awardAchievementGroup('speedSpirit')
}

// Gives levels to buy, total EXP to that level, and offerings required to reach that level
export const maxSpiritLevelPurchaseInformation = (spirit: RuneSpiritKeys, budget: Decimal) => {
  if (budget.lt(0)) {
    return { levels: 0, expRequired: new Decimal(0), offerings: new Decimal(0) }
  }

  const runeEXPPerOffering = getRuneSpiritEXPPerOffering(spirit)
  const totalEXPAvailable = budget.times(runeEXPPerOffering).add(runeSpirits[spirit].runeEXP)
  const levelsPerOOM = runeSpirits[spirit].levelsPerOOM
  const costCoeff = runeSpirits[spirit].costCoefficient

  // Calculate max level we can reach with available EXP
  // EXP formula: costCoeff * (10^(level/levelsPerOOM) - 1)
  // Solving for level: level = levelsPerOOM * log10((EXP/costCoeff) + 1)
  // Unlike Runes, we always call this function, BUT we have a set cap on levels we can buy at once
  // (chosen by the player)
  const upperLimit = player.runeSpiritBuyAmount
  const maxLevel = Math.floor(levelsPerOOM * Decimal.log10(totalEXPAvailable.div(costCoeff).plus(1)))
  const levelsGained = Math.min(upperLimit, Math.max(0, maxLevel - runeSpirits[spirit].level))

  if (levelsGained === 0) {
    // Can't afford any levels, return next level stuff
    const nextLevelEXP = computeEXPToLevel(spirit, runeSpirits[spirit].level + 1)
    const offeringsRequired = Decimal.max(
      1,
      nextLevelEXP.minus(runeSpirits[spirit].runeEXP).div(runeEXPPerOffering).ceil()
    )
    return { levels: 1, expRequired: nextLevelEXP, offerings: offeringsRequired }
  }

  // Return the levels we can gain and the EXP required for that many levels
  const expRequired = computeEXPToLevel(spirit, runeSpirits[spirit].level + levelsGained)
  // Need to be recomputed since offerings required is not necessarily equal to budget.
  const offeringsRequired = Decimal.max(
    1,
    expRequired.minus(runeSpirits[spirit].runeEXP).div(runeEXPPerOffering).ceil()
  )
  return { levels: levelsGained, expRequired: expRequired, offerings: offeringsRequired }
}

export const updateRuneSpiritHTML = (spirit: RuneSpiritKeys) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  DOMCacheGetOrSet(`${spirit}RuneSpiritLevel`).innerHTML = i18next.t('runes.spirits.spiritLevel', {
    amount: format(runeSpirits[spirit].level, 0, true)
  })

  const { levels, offerings } = maxSpiritLevelPurchaseInformation(spirit, player.offerings)
  DOMCacheGetOrSet(`${spirit}RuneSpiritTNL`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: levels,
    offerings: format(offerings, 2, false)
  })
}

export const focusedRuneSpiritHTML = (spirit: RuneSpiritKeys) => {
  const name = runeSpirits[spirit].name()
  const nameHTML = `<span style="color: lightgoldenrodyellow">${name}</span>`

  const description = runeSpirits[spirit].description()
  const descriptionHTML = `<span style="color: lightgray">${description}</span>`

  const spiritPowerHTML = i18next.t('runes.spirits.effectiveSpiritPower', {
    power: format(getRuneSpiritPower(spirit), 0, true)
  })
  const baseSpiritPowerHTML = i18next.t('runes.spirits.baseSpiritPower', {
    level: format(runeSpirits[spirit].level, 0, true)
  })
  const runePowerMultHTML = i18next.t('runes.spirits.runePowerMult', {
    level: format(runes[spirit as RuneKeys].level + runes[spirit as RuneKeys].freeLevels(), 0, true),
    name: runes[spirit as RuneKeys].name()
  })
  const blessingPowerMultHTML = i18next.t('runes.spirits.blessingPowerMult', {
    level: format(runeBlessings[spirit as RuneBlessingKeys].level, 0, true),
    name: runeBlessings[spirit as RuneBlessingKeys].name()
  })
  const otherPowerMultHTML = i18next.t('runes.spirits.otherPowerMult', {
    mult: format(otherSpiritMultipliers(), 2, true)
  })

  const effectsDescriptionHTML = runeSpirits[spirit].effectsDescription(getRuneSpiritPower(spirit))

  const coefficientHTML = i18next.t('runes.spirits.runeCoefficientText', {
    val: format(runeSpirits[spirit].levelsPerOOM, 0, true)
  })
  const levelCostIncreaseHTML = i18next.t('runes.perLevelIncrease', {
    x: format(Math.pow(10, 1 / runeSpirits[spirit].levelsPerOOM), 4, false)
  })

  const experienceHTML = i18next.t('runes.spirits.spiritEXP', {
    exp: format(runeSpirits[spirit].runeEXP, 2, true),
    perEXP: format(getRuneSpiritEXPPerOffering(spirit), 2, true)
  })

  const { levels, expRequired, offerings } = maxSpiritLevelPurchaseInformation(spirit, player.offerings)
  const levelInfo = i18next.t('runes.EXPNeeded', {
    level: format(levels, 0, true),
    exp: format(expRequired, 2, true),
    offerings: format(offerings, 0, true)
  })

  return `${nameHTML}<br>${descriptionHTML}
  <br><br>${spiritPowerHTML}<br>${baseSpiritPowerHTML}<br>${runePowerMultHTML}<br>${blessingPowerMultHTML}<br>${otherPowerMultHTML}
  <br><br>${effectsDescriptionHTML}
  <br><br>${coefficientHTML}<br>${levelCostIncreaseHTML}
  <br><br>${experienceHTML}<br>${levelInfo}`
}

export function resetRuneSpirits (tier: keyof typeof resetTiers) {
  for (const spirit of runeSpiritKeys) {
    if (resetTiers[tier] >= resetTiers[runeSpirits[spirit].minimalResetTier]) {
      runeSpirits[spirit].level = 0
      runeSpirits[spirit].runeEXP = new Decimal(0)
    }
  }
}

export const generateSpiritsHTML = () => {
  const spiritRow = DOMCacheGetOrSet('runeSpirits')

  for (const key of runeSpiritKeys) {
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeType'
    runesDiv.id = `${key}RuneSpiritContainer`
    runesDiv.style.border = `2px solid ${runes[key as RuneKeys].runeHTMLStyle.borderColor}`
    runesDiv.style.borderRadius = '8px'
    runesDiv.style.margin = '2px'
    runesDiv.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${runes[key].runeHTMLStyle.borderColor} 50%, lightgoldenrodyellow 50%)`
    )

    const runeName = document.createElement('p')
    runeName.className = 'runeTypeElement'
    runeName.setAttribute('i18n', `runes.${key}.name`)
    runeName.textContent = i18next.t(`runes.${key}.name`)

    runesDiv.appendChild(runeName)

    const runeIcon = document.createElement('img')
    runeIcon.className = 'runeImage'
    runeIcon.id = `${key}RuneSpirit`
    runeIcon.alt = `${key} Rune`
    runeIcon.src = `Pictures/${IconSets[player.iconSet][0]}/${runeSpirits[key].HTMLData.imgName}.png`
    runeIcon.loading = 'lazy'

    runesDiv.appendChild(runeIcon)

    const runeLevel = document.createElement('span')
    runeLevel.className = 'runeTypeElement'
    runeLevel.id = `${key}RuneSpiritLevel`
    runeLevel.textContent = 'Level 0/30'

    runesDiv.appendChild(runeLevel)

    const runeTNL = document.createElement('span')
    runeTNL.className = 'runeTypeElement'
    runeTNL.id = `${key}RuneSpiritTNL`
    runeTNL.textContent = '0'
    runesDiv.appendChild(runeTNL)

    const sacrificeButton = document.createElement('button')
    sacrificeButton.className = 'runeTypeElement'
    sacrificeButton.id = `${key}RuneSpiritPurchase`
    sacrificeButton.setAttribute('i18n', 'general.spiritCapital')
    sacrificeButton.textContent = i18next.t('general.spiritCapital')

    runesDiv.appendChild(sacrificeButton)

    spiritRow.appendChild(runesDiv)
  }
}
