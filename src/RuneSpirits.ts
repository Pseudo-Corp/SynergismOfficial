import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { AchievementGroup, awardAchievementGroup } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateSalvageRuneEXPMultiplier } from './Calculate'
import { challenge15CorruptionEffect } from './Corruptions'
import { resetTiers } from './Reset'
import { type BlessingRuneType, blessingRuneTypes, runeBlessings } from './RuneBlessings'
import { getRuneTotalLevel, runes, RuneType } from './Runes'
import { registerSpriteAlias, spritePlaceholder } from './SpriteSheets'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Tabs } from './Tabs'
import { CloseModal, Modal } from './UpdateHTML'
import { assert, isMobile, memoize } from './Utility'
import { Globals as G } from './Variables'

type RuneSpiritTypeMap = {
  [RuneType.Speed]: { globalSpeed: number }
  [RuneType.Duplication]: { wowCubes: number }
  [RuneType.Prism]: { crystalCaps: number }
  [RuneType.Thrift]: { offerings: number }
  [RuneType.SuperiorIntellect]: { obtainium: number }
}

interface RuneSpiritData<K extends BlessingRuneType> {
  costCoefficient: Decimal
  levelsPerOOM: number
  effectiveLevelMult: () => number
  runeEXPPerOffering: () => Decimal
  minimalResetTier: keyof typeof resetTiers
  effects: (n: number) => RuneSpiritTypeMap[K]
  effectsDescription: (n: number) => string
  name: () => string
  description: () => string
}

const spiritPowerPerPercent = 777777
const prismSpiritDivisor = 7.777e7

const otherSpiritMultipliers = () => {
  return (1 + (8 * player.researches[164]) / 100)
    * (player.researches[165] && player.currentChallenge.ascension !== 0 ? 2 : 1)
    * (1 + 0.15 * Decimal.log(player.legendaryFragments.add(1), 10) * player.researches[189])
    * (1 + (2 * player.researches[194]) / 100)
    * G.challenge15Rewards.spiritBonus.value
    * challenge15CorruptionEffect('spirit')
}

const spiritMultiplier = (rune: BlessingRuneType) => {
  return (
    getRuneTotalLevel(rune)
    * player.blessingLevels[rune]
    * otherSpiritMultipliers()
  )
}

export const runeSpirits: { [K in BlessingRuneType]: RuneSpiritData<K> } = {
  [RuneType.Speed]: {
    costCoefficient: new Decimal(1e45),
    levelsPerOOM: 2,
    effects: (level) => {
      const globalSpeed = 1 + level / spiritPowerPerPercent / 100
      return { globalSpeed }
    },
    effectsDescription: (level) => {
      const globalSpeed = runeSpirits[RuneType.Speed].effects(level).globalSpeed
      return i18next.t('runes.spirits.speed.globalSpeed', {
        val: formatAsPercentIncrease(globalSpeed, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier(RuneType.Speed),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Speed].name(),
    description: () => i18next.t('runes.spirits.speed.description')
  },
  [RuneType.Duplication]: {
    costCoefficient: new Decimal(1e52),
    levelsPerOOM: 2,
    effects: (level) => {
      const wowCubes = 1 + level / spiritPowerPerPercent / 100
      return { wowCubes }
    },
    effectsDescription: (level) => {
      const wowCubes = runeSpirits[RuneType.Duplication].effects(level).wowCubes
      return i18next.t('runes.spirits.duplication.wowCubes', {
        val: formatAsPercentIncrease(wowCubes, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier(RuneType.Duplication),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Duplication].name(),
    description: () => i18next.t('runes.spirits.duplication.description')
  },
  [RuneType.Prism]: {
    costCoefficient: new Decimal(1e60),
    levelsPerOOM: 2,
    effects: (level) => {
      const crystalCaps = level / prismSpiritDivisor
      return { crystalCaps }
    },
    effectsDescription: (level) => {
      const crystalCaps = runeSpirits[RuneType.Prism].effects(level).crystalCaps
      return i18next.t('runes.spirits.prism.crystalCaps', {
        val: format(crystalCaps, 2, true)
      })
    },
    effectiveLevelMult: () => spiritMultiplier(RuneType.Prism),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Prism].name(),
    description: () => i18next.t('runes.spirits.prism.description')
  },
  [RuneType.Thrift]: {
    costCoefficient: new Decimal(1e72),
    levelsPerOOM: 2,
    effects: (level) => {
      const offerings = 1 + level / spiritPowerPerPercent / 100
      return { offerings }
    },
    effectsDescription: (level) => {
      const offerings = runeSpirits[RuneType.Thrift].effects(level).offerings
      return i18next.t('runes.spirits.thrift.offerings', {
        val: formatAsPercentIncrease(offerings, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier(RuneType.Thrift),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.Thrift].name(),
    description: () => i18next.t('runes.spirits.thrift.description')
  },
  [RuneType.SuperiorIntellect]: {
    costCoefficient: new Decimal(1e85),
    levelsPerOOM: 2,
    effects: (level) => {
      const obtainium = 1 + level / spiritPowerPerPercent / 100
      return { obtainium }
    },
    effectsDescription: (level) => {
      const obtainium = runeSpirits[RuneType.SuperiorIntellect].effects(level).obtainium
      return i18next.t('runes.spirits.superiorIntellect.obtainium', {
        val: formatAsPercentIncrease(obtainium, 2)
      })
    },
    effectiveLevelMult: () => spiritMultiplier(RuneType.SuperiorIntellect),
    runeEXPPerOffering: () => calculateSalvageRuneEXPMultiplier(),
    minimalResetTier: 'singularity',
    name: () => runes[RuneType.SuperiorIntellect].name(),
    description: () => i18next.t('runes.spirits.superiorIntellect.description')
  }
}

const getRuneSpiritPower = (spirit: BlessingRuneType): number => {
  const spiritpowerMult = runeSpirits[spirit].effectiveLevelMult()
  return player.spiritLevels[spirit] * spiritpowerMult
}

export const getRuneSpiritEffect = <T extends BlessingRuneType>(spirit: T): RuneSpiritTypeMap[T] => {
  return runeSpirits[spirit].effects(getRuneSpiritPower(spirit))
}

const getRuneSpiritEXPPerOffering = (spirit: BlessingRuneType): Decimal => {
  return runeSpirits[spirit].runeEXPPerOffering()
}

const computeEXPToLevel = (spirit: BlessingRuneType, level: number) => {
  const levelPerOOM = runeSpirits[spirit].levelsPerOOM
  return runeSpirits[spirit].costCoefficient.times(Decimal.pow(10, level / levelPerOOM).minus(1))
}

const computeEXPLeftToLevel = (spirit: BlessingRuneType, level: number) => {
  return Decimal.max(0, computeEXPToLevel(spirit, level).minus(player.spiritEXP[spirit]))
}

const computeOfferingsToLevel = (spirit: BlessingRuneType, level: number, runeEXPPerOffering: Decimal) => {
  return Decimal.max(1, computeEXPLeftToLevel(spirit, level).div(runeEXPPerOffering).ceil())
}

export const buySpiritLevels = (spirit: BlessingRuneType, budget: Decimal) => {
  if (!player.unlocks.spirits) {
    return
  }

  const { levels, expRequired, offerings } = maxSpiritLevelPurchaseInformation(spirit, budget)
  if (levels > 0 && offerings.lte(budget)) {
    player.spiritEXP[spirit] = expRequired
    player.offerings = player.offerings.sub(offerings)
  }

  updateLevelsFromEXP(spirit)
}

export const buyAllSpiritLevels = (budget: Decimal) => {
  const ratio = blessingRuneTypes.length
  for (const rune of blessingRuneTypes) {
    buySpiritLevels(rune, Decimal.floor(budget.div(ratio)))
  }

  const zero = new Decimal()
  if (player.offerings.lt(zero)) {
    // TODO: Figure out why this fucking happens so often
    player.offerings = zero
  }
}

const updateLevelsFromEXP = (spirit: BlessingRuneType) => {
  const levelsPerOOM = runeSpirits[spirit].levelsPerOOM
  const levels = Math.floor(
    levelsPerOOM * Decimal.log10(player.spiritEXP[spirit].div(runeSpirits[spirit].costCoefficient).plus(1))
  )
  // Floating point imprecision fix
  if (computeEXPLeftToLevel(spirit, levels + 1).eq(new Decimal())) {
    player.spiritLevels[spirit] = levels + 1
  } else {
    player.spiritLevels[spirit] = levels
  }

  if (spirit === RuneType.Speed) {
    awardAchievementGroup(AchievementGroup.SpeedSpirit)
  }
}

export const updateAllSpiritLevelsFromEXP = () => {
  for (const spirit of blessingRuneTypes) {
    updateLevelsFromEXP(spirit)
  }
}

// Gives levels to buy, total EXP to that level, and offerings required to reach that level
const maxSpiritLevelPurchaseInformation = (spirit: BlessingRuneType, budget: Decimal) => {
  if (budget.lt(new Decimal())) {
    return { levels: 0, expRequired: new Decimal(), offerings: new Decimal() }
  }

  const runeEXPPerOffering = getRuneSpiritEXPPerOffering(spirit)
  const totalEXPAvailable = budget.times(runeEXPPerOffering).add(player.spiritEXP[spirit])
  const levelsPerOOM = runeSpirits[spirit].levelsPerOOM
  const costCoeff = runeSpirits[spirit].costCoefficient

  // Calculate max level we can reach with available EXP
  // EXP formula: costCoeff * (10^(level/levelsPerOOM) - 1)
  // Solving for level: level = levelsPerOOM * log10((EXP/costCoeff) + 1)
  // Unlike Runes, we always call this function, BUT we have a set cap on levels we can buy at once
  // (chosen by the player)
  const upperLimit = player.runeSpiritBuyAmount
  const maxLevel = Math.floor(levelsPerOOM * Decimal.log10(totalEXPAvailable.div(costCoeff).plus(1)))
  const levelsGained = Math.min(upperLimit, Math.max(0, maxLevel - player.spiritLevels[spirit]))

  if (levelsGained === 0) {
    // Can't afford any levels, return next level stuff
    return {
      levels: 1,
      expRequired: computeEXPToLevel(spirit, player.spiritLevels[spirit] + 1),
      offerings: computeOfferingsToLevel(spirit, player.spiritLevels[spirit] + 1, runeEXPPerOffering)
    }
  }

  // Return the levels we can gain and the EXP required for that many levels
  return {
    levels: levelsGained,
    expRequired: computeEXPToLevel(spirit, player.spiritLevels[spirit] + levelsGained),
    offerings: computeOfferingsToLevel(spirit, player.spiritLevels[spirit] + levelsGained, runeEXPPerOffering)
  }
}

export const updateWebRuneSpiritHTML = (spirit: BlessingRuneType) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritLevel`).innerHTML = i18next.t('runes.spirits.spiritLevel', {
    amount: format(player.spiritLevels[spirit], 0, true)
  })

  const { levels, offerings } = maxSpiritLevelPurchaseInformation(spirit, player.offerings)
  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritTNL`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: levels,
    offerings: format(offerings, 2, false)
  })
}

export const updateMobileRuneSpiritHTML = (spirit: BlessingRuneType) => {
  assert(G.currentTab === Tabs.Runes, 'current tab is not Runes')

  // {rune}Rune, {rune}RuneLevel, {rune}RuneCoefficient, {rune}RuneIncreasePerLevel, {rune}RunePower, {rune}RuneEffects, {rune}RuneCost
  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritLevel`).innerHTML = i18next.t('runes.spirits.spiritLevel', {
    amount: format(player.spiritLevels[spirit], 0, true)
  })
  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritCoefficient`).textContent = i18next.t(
    'runes.spirits.runeCoefficientText',
    {
      val: format(runeSpirits[spirit].levelsPerOOM, 0, true)
    }
  )

  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritIncreasePerLevel`).innerHTML = i18next.t('runes.perLevelIncrease', {
    x: format(Math.pow(10, 1 / runeSpirits[spirit].levelsPerOOM), 4, false)
  })

  const spiritPower = getRuneSpiritPower(spirit)

  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritPower`).innerHTML = i18next.t('runes.spirits.effectiveSpiritPower', {
    power: format(spiritPower, 0, true)
  })

  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritEffects`).innerHTML = runeSpirits[spirit].effectsDescription(
    spiritPower
  )

  const { levels, offerings } = maxSpiritLevelPurchaseInformation(spirit, player.offerings)
  DOMCacheGetOrSet(`${runes[spirit].key}RuneSpiritCost`).innerHTML = i18next.t('runes.TNL', {
    levelAmount: format(levels, 0, true),
    offerings: format(offerings, 0, true)
  })
}

export const updateRuneSpiritHTML = (bless: BlessingRuneType) => {
  if (isMobile) {
    updateMobileRuneSpiritHTML(bless)
  } else {
    updateWebRuneSpiritHTML(bless)
  }
}

export const focusedRuneSpiritHTML = (spirit: BlessingRuneType) => {
  const name = runeSpirits[spirit].name()
  const nameHTML = `<span style="color: var(--lightgoldenrodyellow-color)">${name}</span>`

  const description = runeSpirits[spirit].description()
  const descriptionHTML = `<span style="color: var(--lightgray-color)">${description}</span>`

  const spiritPowerHTML = i18next.t('runes.spirits.effectiveSpiritPower', {
    power: format(getRuneSpiritPower(spirit), 0, true)
  })
  const baseSpiritPowerHTML = i18next.t('runes.spirits.baseSpiritPower', {
    level: format(player.spiritLevels[spirit], 0, true)
  })
  const runePowerMultHTML = i18next.t('runes.spirits.runePowerMult', {
    level: format(getRuneTotalLevel(spirit), 0, true),
    name: runes[spirit].name()
  })
  const blessingPowerMultHTML = i18next.t('runes.spirits.blessingPowerMult', {
    level: format(player.blessingLevels[spirit], 0, true),
    name: runeBlessings[spirit].name()
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
    exp: format(player.spiritEXP[spirit], 2, true),
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
  for (const spirit of blessingRuneTypes) {
    if (resetTiers[tier] >= resetTiers[runeSpirits[spirit].minimalResetTier]) {
      player.spiritLevels[spirit] = 0
      player.spiritEXP[spirit] = new Decimal()
    }
  }
}

export const generateWebRuneSpiritsHTML = () => {
  const spiritRow = DOMCacheGetOrSet('runeSpirits')

  for (const rune of blessingRuneTypes) {
    const key = runes[rune].key
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeType'
    runesDiv.id = `${key}RuneSpiritContainer`
    runesDiv.style.border = `2px solid ${runes[rune].runeHTMLStyle.borderColor}`
    runesDiv.style.borderRadius = '8px'
    runesDiv.style.margin = '2px'
    runesDiv.style.setProperty(
      '--glow-color',
      `color-mix(in srgb, ${runes[rune].runeHTMLStyle.borderColor} 50%, var(--lightgoldenrodyellow-color) 50%)`
    )

    runesDiv.addEventListener(
      'mousemove',
      (e) => {
        Modal(() => focusedRuneSpiritHTML(rune), e.clientX, e.clientY, {
          borderColor: runes[rune].runeHTMLStyle.borderColor
        })
      }
    )
    runesDiv.addEventListener('focus', () => {
      const element = DOMCacheGetOrSet(`${key}RuneSpirit`)
      const elmRect = element.getBoundingClientRect()
      Modal(() => focusedRuneSpiritHTML(rune), elmRect.x, elmRect.y + elmRect.height / 2, {
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
    runeIcon.id = `${key}RuneSpirit`
    runeIcon.alt = `${key} Rune`
    runeIcon.src = spritePlaceholder
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
    sacrificeButton.addEventListener(
      'click',
      () => buySpiritLevels(rune, player.offerings)
    )

    runesDiv.appendChild(sacrificeButton)

    spiritRow.appendChild(runesDiv)
  }
}

export const generateMobileRuneSpiritsHTML = () => {
  const spiritRow = DOMCacheGetOrSet('runeSpirits')
  for (const rune of blessingRuneTypes) {
    const key = runes[rune].key
    // Create unlocked rune container
    const runesDiv = document.createElement('div')
    runesDiv.className = 'runeTypeMobile'
    runesDiv.id = `${key}RuneSpiritContainer`
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
    runeIcon.id = `${key}RuneSpirit`
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
    level.id = `${key}RuneSpiritLevel`
    level.textContent = '0 [+0]'
    level.style.color = 'var(--white-color)'
    runesDiv.appendChild(level)

    const coefficientText = document.createElement('p')
    coefficientText.className = 'runeTypeElementMobile'
    coefficientText.id = `${key}RuneSpiritCoefficient`
    coefficientText.textContent = '1'
    coefficientText.style.color = 'var(--white-color)'
    runesDiv.appendChild(coefficientText)

    const increasePerLevelText = document.createElement('p')
    increasePerLevelText.className = 'runeTypeElementMobile'
    increasePerLevelText.id = `${key}RuneSpiritIncreasePerLevel`
    increasePerLevelText.textContent = '1'
    increasePerLevelText.style.color = 'var(--white-color)'
    runesDiv.appendChild(increasePerLevelText)

    const runePower = document.createElement('p')
    runePower.className = 'runeTypeElementMobile'
    runePower.id = `${key}RuneSpiritPower`
    runePower.textContent = '1'
    runePower.style.color = 'var(--white-color)'
    runesDiv.appendChild(runePower)

    const runeEffects = document.createElement('p')
    runeEffects.className = 'runeTypeElementMobile'
    runeEffects.id = `${key}RuneSpiritEffects`
    runeEffects.textContent = '1'
    runeEffects.style.color = 'var(--white-color)'
    runesDiv.appendChild(runeEffects)

    const runeCost = document.createElement('p')
    runeCost.className = 'runeTypeElementMobile'
    runeCost.id = `${key}RuneSpiritCost`
    runeCost.textContent = '1'
    runeCost.style.color = 'var(--white-color)'
    runesDiv.appendChild(runeCost)

    const sacrificeButton = document.createElement('button')
    sacrificeButton.className = 'runeTypeElementMobile'
    sacrificeButton.id = `${key}RuneSpiritPurchase`
    sacrificeButton.setAttribute('i18n', 'general.spiritCapital')
    sacrificeButton.textContent = i18next.t('general.spiritCapital')
    sacrificeButton.addEventListener(
      'click',
      () => buySpiritLevels(rune, player.offerings)
    )

    runesDiv.appendChild(sacrificeButton)

    spiritRow.appendChild(runesDiv)
  }
}

export const generateSpiritsHTML = memoize(() => {
  if (isMobile) {
    generateMobileRuneSpiritsHTML()
  } else {
    generateWebRuneSpiritsHTML()
  }
})
