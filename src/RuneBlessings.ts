import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import {
  AchievementGroup,
  awardAchievementGroup,
  awardUngroupedAchievement,
  UngroupedAchievement
} from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateSalvageRuneEXPMultiplier } from './Calculate'
import { resetTiers } from './Reset'
import { getRuneTotalLevel, runes, RuneType } from './Runes'
import { registerSpriteAlias, spritePlaceholder } from './SpriteSheets'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Tabs } from './Tabs'
import { getTalismanEffects } from './Talismans'
import { CloseModal, Modal } from './UpdateHTML'
import { assert, isMobile, memoize } from './Utility'
import { Globals as G } from './Variables'

export const blessingRuneTypes = [
  RuneType.Speed,
  RuneType.Duplication,
  RuneType.Prism,
  RuneType.Thrift,
  RuneType.SuperiorIntellect
] as const

export type BlessingRuneType = typeof blessingRuneTypes[number]

type RuneBlessingTypeMap = {
  [RuneType.Speed]: { globalSpeed: number }
  [RuneType.Duplication]: { multiplierBoosts: number }
  [RuneType.Prism]: { antSacrificeMult: number }
  [RuneType.Thrift]: { accelBoostCostDelay: number }
  [RuneType.SuperiorIntellect]: { obtToAntExponent: number }
}

interface RuneBlessingData<K extends BlessingRuneType> {
  costCoefficient: Decimal
  levelsPerOOM: number
  effectiveLevelMult: () => number
  runeEXPPerOffering: () => Decimal
  minimalResetTier: keyof typeof resetTiers
  effects: (n: number) => RuneBlessingTypeMap[K]
  effectsDescription: (n: number) => string
  name: () => string
  description: () => string
}

const otherBlessingMultipliers = () => {
  return (1 + (6.9 * player.researches[134]) / 100)
    * (getTalismanEffects('midas').blessingBonus)
    * (1 + 0.1 * Decimal.log(player.epicFragments.add(1), 10) * player.researches[174])
    * (1 + (2 * player.researches[194]) / 100)
    * (1 + 0.25 * player.researches[160])
    * G.challenge15Rewards.blessingBonus.value
}

const blessingMultiplier = (rune: BlessingRuneType) => {
  return (
    getRuneTotalLevel(rune)
    * otherBlessingMultipliers()
  )
}

export const runeBlessings: { [K in BlessingRuneType]: RuneBlessingData<K> } = {
  [RuneType.Speed]: {
    costCoefficient: new Decimal(1e6),
    levelsPerOOM: 4,
    effects: (level) => {
      const globalSpeed = 1 + level / 1000000
      return {
        globalSpeed
      }
    },
    effectsDescription: (level) => {
      const globalSpeed = runeBlessings[RuneType.Speed].effects(level).globalSpeed
      return i18next.t('runes.blessings.speed.globalSpeed', {
        val: formatAsPercentIncrease(globalSpeed, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier(RuneType.Speed),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Speed].name(),
    description: () => i18next.t('runes.blessings.speed.description')
  },
  [RuneType.Duplication]: {
    costCoefficient: new Decimal(1e7),
    levelsPerOOM: 4,
    effects: (level) => {
      const multiplierBoosts = 1 + level / 1000000
      return {
        multiplierBoosts
      }
    },
    effectsDescription: (level) => {
      const multiplierBoosts = runeBlessings[RuneType.Duplication].effects(level).multiplierBoosts
      return i18next.t('runes.blessings.duplication.multiplierBoosts', {
        val: formatAsPercentIncrease(multiplierBoosts, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier(RuneType.Duplication),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Duplication].name(),
    description: () => i18next.t('runes.blessings.duplication.description')
  },
  [RuneType.Prism]: {
    costCoefficient: new Decimal(1e9),
    levelsPerOOM: 4,
    effects: (level) => {
      const antSacrificeMult = 1 + level / 1000000
      return {
        antSacrificeMult
      }
    },
    effectsDescription: (level) => {
      const antSacrificeMult = runeBlessings[RuneType.Prism].effects(level).antSacrificeMult
      return i18next.t('runes.blessings.prism.antSacrifice', {
        val: formatAsPercentIncrease(antSacrificeMult, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier(RuneType.Prism),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Prism].name(),
    description: () => i18next.t('runes.blessings.prism.description')
  },
  [RuneType.Thrift]: {
    costCoefficient: new Decimal(1e12),
    levelsPerOOM: 4,
    effects: (level) => {
      const accelBoostCostDelay = 1 + level / 1000000
      return {
        accelBoostCostDelay
      }
    },
    effectsDescription: (level) => {
      const accelBoostCostDelay = runeBlessings[RuneType.Thrift].effects(level).accelBoostCostDelay
      return i18next.t('runes.blessings.thrift.acceleratorBoostDelay', {
        val: formatAsPercentIncrease(accelBoostCostDelay, 2)
      })
    },
    effectiveLevelMult: () => blessingMultiplier(RuneType.Thrift),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Thrift].name(),
    description: () => i18next.t('runes.blessings.thrift.description')
  },
  [RuneType.SuperiorIntellect]: {
    costCoefficient: new Decimal(1e15),
    levelsPerOOM: 4,
    effects: (level) => {
      const obtToAntExponent = Math.log(1 + level / 1000000)
      return {
        obtToAntExponent
      }
    },
    effectsDescription: (level) => {
      const obtToAntExponent = runeBlessings[RuneType.SuperiorIntellect].effects(level).obtToAntExponent
      const obtExponentHTML = i18next.t('runes.blessings.superiorIntellect.obtExponent', {
        val: format(obtToAntExponent, 3, true)
      })
      const antSpeedHTML = i18next.t('runes.blessings.superiorIntellect.antSpeed', {
        val: format(Decimal.pow(player.obtainium, obtToAntExponent), 2, false)
      })
      return `${obtExponentHTML}<br>${antSpeedHTML}`
    },
    effectiveLevelMult: () => blessingMultiplier(RuneType.SuperiorIntellect),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.SuperiorIntellect].name(),
    description: () => i18next.t('runes.blessings.superiorIntellect.description')
  }
}

const getRuneBlessingPower = (bless: BlessingRuneType): number => {
  const blessingPowerMult = runeBlessings[bless].effectiveLevelMult()
  return player.blessingLevels[bless] * blessingPowerMult
}

export const getRuneBlessingEffect = <T extends BlessingRuneType>(bless: T): RuneBlessingTypeMap[T] => {
  return runeBlessings[bless].effects(getRuneBlessingPower(bless))
}

const getRuneBlessingEXPPerOffering = (bless: BlessingRuneType): Decimal => {
  return runeBlessings[bless].runeEXPPerOffering()
}

const computeEXPToLevel = (bless: BlessingRuneType, level: number) => {
  const levelPerOOM = runeBlessings[bless].levelsPerOOM
  return runeBlessings[bless].costCoefficient.times(Decimal.pow(10, level / levelPerOOM).minus(1))
}

const computeEXPLeftToLevel = (bless: BlessingRuneType, level: number) => {
  return Decimal.max(0, computeEXPToLevel(bless, level).minus(player.blessingEXP[bless]))
}

export const buyBlessingLevels = (blessing: BlessingRuneType, budget: Decimal) => {
  if (!player.unlocks.blessings) {
    return
  }

  const levelsToAdd = player.runeBlessingBuyAmount

  levelBlessing(blessing, levelsToAdd, budget)
  updateLevelsFromEXP(blessing)
}

export const buyAllBlessingLevels = (budget: Decimal) => {
  const ratio = blessingRuneTypes.length
  const budgetPerBlessing = budget.div(ratio).floor()
  for (const rune of blessingRuneTypes) {
    buyBlessingLevels(rune, budgetPerBlessing)
  }

  const zero = new Decimal()
  if (player.offerings.lt(zero)) {
    // TODO: Figure out why this fucking happens so often
    player.offerings = zero
  }
}

const levelBlessing = (bless: BlessingRuneType, timesLeveled: number, budget: Decimal) => {
  let budgetUsed: Decimal

  const expRequired = computeEXPLeftToLevel(bless, player.blessingLevels[bless] + timesLeveled)
  const runeEXPPerOffering = getRuneBlessingEXPPerOffering(bless)
  const offeringsRequired = Decimal.max(1, expRequired.div(runeEXPPerOffering).ceil())

  if (offeringsRequired.gt(budget)) {
    player.blessingEXP[bless] = player.blessingEXP[bless].add(budget.times(runeEXPPerOffering))
    budgetUsed = budget
  } else {
    player.blessingEXP[bless] = computeEXPToLevel(bless, player.blessingLevels[bless] + timesLeveled)
    budgetUsed = offeringsRequired
  }

  player.offerings = player.offerings.sub(budgetUsed)

  // this.updatePlayerEXP()
  // this.updateRuneEffectHTML()
}

const updateLevelsFromEXP = (bless: BlessingRuneType) => {
  const levelsPerOOM = runeBlessings[bless].levelsPerOOM
  const levels = Math.floor(
    levelsPerOOM * Decimal.log10(player.blessingEXP[bless].div(runeBlessings[bless].costCoefficient).plus(1))
  )
  // Floating point imprecision fix
  if (computeEXPLeftToLevel(bless, levels + 1).eq(new Decimal())) {
    player.blessingLevels[bless] = levels + 1
  } else {
    player.blessingLevels[bless] = levels
  }

  if (bless === RuneType.Speed) {
    awardAchievementGroup(AchievementGroup.SpeedBlessing)
    awardUngroupedAchievement(UngroupedAchievement.HighlyBlessed)
  }
}

export const updateAllBlessingLevelsFromEXP = () => {
  for (const bless of blessingRuneTypes) {
    updateLevelsFromEXP(bless)
  }
}

// Gives levels to buy, total EXP to that level, and offerings required to reach that level
const maxBlessingLevelPurchaseInformation = (bless: BlessingRuneType, budget: Decimal) => {
  if (budget.lt(new Decimal())) {
    return { levels: 0, expRequired: new Decimal(), offerings: new Decimal() }
  }

  const runeEXPPerOffering = getRuneBlessingEXPPerOffering(bless)
  const totalEXPAvailable = budget.times(runeEXPPerOffering).add(player.blessingEXP[bless])
  const levelsPerOOM = runeBlessings[bless].levelsPerOOM
  const costCoeff = runeBlessings[bless].costCoefficient

  // Take into account the smallest increment to floating point
  const minOfferingsToIncreaseEXP = Decimal.ceil(
    player.blessingEXP[bless].div(runeEXPPerOffering.times(Number.MAX_SAFE_INTEGER))
  )

  // Calculate max level we can reach with available EXP
  // EXP formula: costCoeff * (10^(level/levelsPerOOM) - 1)
  // Solving for level: level = levelsPerOOM * log10((EXP/costCoeff) + 1)
  // Unlike Runes, we always call this function, BUT we have a set cap on levels we can buy at once
  // (chosen by the player)
  const upperLimit = player.runeBlessingBuyAmount
  const maxLevel = Math.floor(levelsPerOOM * Decimal.log10(totalEXPAvailable.div(costCoeff).plus(1)))
  const levelsGained = Math.min(upperLimit, Math.max(0, maxLevel - player.blessingLevels[bless]))

  if (levelsGained === 0) {
    // Can't afford any levels, return next level stuff
    const nextLevelEXP = computeEXPToLevel(bless, player.blessingLevels[bless] + 1)
    const offeringsRequired = Decimal.max(
      minOfferingsToIncreaseEXP,
      nextLevelEXP.minus(player.blessingEXP[bless]).div(runeEXPPerOffering).ceil()
    )
    return { levels: 1, expRequired: nextLevelEXP, offerings: offeringsRequired }
  }

  // Return the levels we can gain and the EXP required for that many levels
  const expRequired = computeEXPToLevel(bless, player.blessingLevels[bless] + levelsGained)
  // Need to be recomputed since offerings required is not necessarily equal to budget.
  const offeringsRequired = Decimal.max(
    minOfferingsToIncreaseEXP,
    expRequired.minus(player.blessingEXP[bless]).div(runeEXPPerOffering).ceil()
  )
  return { levels: levelsGained, expRequired: expRequired, offerings: offeringsRequired }
}

export const updateWebRuneBlessingHTML = (bless: BlessingRuneType) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingLevel`).innerHTML = i18next.t('runes.blessings.blessingLevel', {
    amount: format(player.blessingLevels[bless], 0, true)
  })

  const { levels, offerings } = maxBlessingLevelPurchaseInformation(bless, player.offerings)

  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingTNL`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: levels,
    offerings: format(offerings, 2, false)
  })
}

export const updateMobileRuneBlessingHTML = (bless: BlessingRuneType) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  // {rune}Rune, {rune}RuneLevel, {rune}RuneCoefficient, {rune}RuneIncreasePerLevel, {rune}RunePower, {rune}RuneEffects, {rune}RuneCost
  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingLevel`).innerHTML = i18next.t('runes.blessings.blessingLevel', {
    amount: format(player.blessingLevels[bless], 0, true)
  })
  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingCoefficient`).textContent = i18next.t(
    'runes.blessings.runeCoefficientText',
    {
      val: format(runeBlessings[bless].levelsPerOOM, 0, true)
    }
  )

  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingIncreasePerLevel`).innerHTML = i18next.t('runes.perLevelIncrease', {
    x: format(Math.pow(10, 1 / runeBlessings[bless].levelsPerOOM), 4, false)
  })

  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingPower`).innerHTML = i18next.t(
    'runes.blessings.effectiveBlessingPower',
    {
      power: format(getRuneBlessingPower(bless), 0, true)
    }
  )

  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingEffects`).innerHTML = runeBlessings[bless].effectsDescription(
    getRuneBlessingPower(bless)
  )

  const { levels, offerings } = maxBlessingLevelPurchaseInformation(bless, player.offerings)
  DOMCacheGetOrSet(`${runes[bless].key}RuneBlessingCost`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: format(levels, 0, true),
    offerings: format(offerings, 0, true)
  })
}

export const updateRuneBlessingHTML = (bless: BlessingRuneType) => {
  if (isMobile) {
    updateMobileRuneBlessingHTML(bless)
  } else {
    updateWebRuneBlessingHTML(bless)
  }
}

export const focusedRuneBlessingHTML = (bless: BlessingRuneType) => {
  const name = runeBlessings[bless].name()
  const nameHTML = `<span style="color: var(--orchid-color)">${name}</span>`

  const description = runeBlessings[bless].description()
  const descriptionHTML = `<span style="color: var(--lightgray-color)">${description}</span>`

  const blessingPowerHTML = i18next.t('runes.blessings.effectiveBlessingPower', {
    power: format(getRuneBlessingPower(bless), 0, true)
  })
  const baseBlessingPowerHTML = i18next.t('runes.blessings.baseBlessingPower', {
    level: format(player.blessingLevels[bless], 0, true)
  })
  const runePowerMultHTML = i18next.t('runes.blessings.runePowerMult', {
    level: format(getRuneTotalLevel(bless), 0, true),
    name: runes[bless].name()
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
    exp: format(player.blessingEXP[bless], 2, true),
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
  for (const bless of blessingRuneTypes) {
    if (resetTiers[tier] >= resetTiers[runeBlessings[bless].minimalResetTier]) {
      player.blessingLevels[bless] = 0
      player.blessingEXP[bless] = new Decimal()
    }
  }
}

export const generateWebRuneBlessingsHTML = () => {
  const blessingRow = DOMCacheGetOrSet('runeBlessings')

  for (const rune of blessingRuneTypes) {
    const key = runes[rune].key
    // Create unlocked rune container
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeType'
    runesDiv.id = `${key}RuneBlessingContainer`
    runesDiv.style.border = `2px solid ${runes[rune].runeHTMLStyle.borderColor}`
    runesDiv.style.borderRadius = '8px'
    runesDiv.style.margin = '2px'
    runesDiv.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${runes[rune].runeHTMLStyle.borderColor} 50%, var(--orchid-color) 50%)`
    )
    runesDiv.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneBlessingHTML(rune), e.clientX, e.clientY, {
          borderColor: runes[rune].runeHTMLStyle.borderColor
        })
      }
    )
    runesDiv.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}RuneBlessing`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneBlessingHTML(rune), elmRect.x, elmRect.y + elmRect.height / 2, {
        borderColor: runes[rune].runeHTMLStyle.borderColor
      })
    })
    runesDiv.addEventListener('mouseout', CloseModal)

    const runeName = document.createElement('p')
    runeName.className = 'runeTypeElement'
    runeName.setAttribute('i18n', `runes.${key}.name`)
    runeName.textContent = i18next.t(`runes.${key}.name`)

    runesDiv.appendChild(runeName)

    const runeIcon = document.createElement('img')
    runeIcon.className = 'runeImage'
    runeIcon.id = `${key}RuneBlessing`
    runeIcon.alt = `${key} Rune`
    runeIcon.src = spritePlaceholder
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
    sacrificeButton.addEventListener(
      'click',
      () => buyBlessingLevels(rune, player.offerings)
    )

    runesDiv.appendChild(sacrificeButton)

    blessingRow.appendChild(runesDiv)
  }
}

export const generateMobileRuneBlessingsHTML = () => {
  const blessingRow = DOMCacheGetOrSet('runeBlessings')
  for (const rune of blessingRuneTypes) {
    const key = runes[rune].key
    // Create unlocked rune container
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeTypeMobile'
    runesDiv.id = `${key}RuneBlessingContainer`
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
    runeIcon.id = `${key}RuneBlessing`
    runeIcon.alt = `${key} Rune`
    runeIcon.src = spritePlaceholder
    runeIcon.loading = 'lazy'

    registerSpriteAlias(runeIcon.id, runeIcon.id, 32)

    topRow.appendChild(runeIcon)

    const runeName = document.createElement('p')
    runeName.className = 'runeTypeElementMobile'
    runeName.setAttribute('i18n', `runes.${key}.name`)
    runeName.innerHTML = i18next.t(`runes.${key}.name`)
    topRow.appendChild(runeName)

    runesDiv.appendChild(topRow)

    const level = document.createElement('p')
    level.className = 'runeTypeElementMobile'
    level.id = `${key}RuneBlessingLevel`
    level.textContent = '0 [+0]'
    level.style.color = 'var(--white-color)'
    runesDiv.appendChild(level)

    const coefficientText = document.createElement('p')
    coefficientText.className = 'runeTypeElementMobile'
    coefficientText.id = `${key}RuneBlessingCoefficient`
    coefficientText.textContent = '1'
    coefficientText.style.color = 'var(--white-color)'
    runesDiv.appendChild(coefficientText)

    const increasePerLevelText = document.createElement('p')
    increasePerLevelText.className = 'runeTypeElementMobile'
    increasePerLevelText.id = `${key}RuneBlessingIncreasePerLevel`
    increasePerLevelText.textContent = '1'
    increasePerLevelText.style.color = 'var(--white-color)'
    runesDiv.appendChild(increasePerLevelText)

    const runePower = document.createElement('p')
    runePower.className = 'runeTypeElementMobile'
    runePower.id = `${key}RuneBlessingPower`
    runePower.textContent = '1'
    runePower.style.color = 'var(--white-color)'
    runesDiv.appendChild(runePower)

    const runeEffects = document.createElement('p')
    runeEffects.className = 'runeTypeElementMobile'
    runeEffects.id = `${key}RuneBlessingEffects`
    runeEffects.textContent = '1'
    runeEffects.style.color = 'var(--white-color)'
    runesDiv.appendChild(runeEffects)

    const runeCost = document.createElement('p')
    runeCost.className = 'runeTypeElementMobile'
    runeCost.id = `${key}RuneBlessingCost`
    runeCost.textContent = '1'
    runeCost.style.color = 'var(--white-color)'
    runesDiv.appendChild(runeCost)

    const sacrificeButton = document.createElement('button')
    sacrificeButton.className = 'runeTypeElementMobile'
    sacrificeButton.id = `${key}RuneBlessingPurchase`
    sacrificeButton.setAttribute('i18n', 'general.blessCapital')
    sacrificeButton.textContent = i18next.t('general.blessCapital')
    sacrificeButton.addEventListener(
      'click',
      () => buyBlessingLevels(rune, player.offerings)
    )

    runesDiv.appendChild(sacrificeButton)

    blessingRow.appendChild(runesDiv)
  }
}

export const generateBlessingsHTML = memoize(() => {
  if (isMobile) {
    generateMobileRuneBlessingsHTML()
  } else {
    generateWebRuneBlessingsHTML()
  }
})
