import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateBlueberryInventory } from './Calculate'
import { getOcteractUpgradeEffect } from './Octeracts'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { isMobile } from './Utility'

export type PurpleAmbrosiaUpgradeRewards = {
  aries: { universalBarPointMult: number }
  taurus: { taxDivisor: number }
  gemini: { ambrosiaRequirementMult: number }
  cancer: { barFillRatio: number }
  leo: { unassignedBlueberyLuck: number }
  virgo: { assignedBlueberrySalvage: number }
  libra: { overcapToggleUnlocked: boolean }
  scorpio: { purpleReactorConversionMult: number }
  sagittarius: { horseshoeRuneUnlocked: boolean }
  capricorn: { horseshoeTalismanUnlocked: boolean }
  aquarius: { infiniteTranscriptionExponent: number }
  pisces: { platonicBetaAtStart: boolean }
}

export type PurpleAmbrosiaNames = keyof PurpleAmbrosiaUpgradeRewards

export interface PurpleAmbrosiaUpgrade<
  T extends PurpleAmbrosiaNames,
  K extends keyof PurpleAmbrosiaUpgradeRewards[T]
> {
  level: number
  maxLevel: number
  // In these formulas, costFormula is expected to be a cumulative function
  costFormula: (level: number) => number
  effects: (level: number, key: K) => PurpleAmbrosiaUpgradeRewards[T][K]
  notMaxedEffectsDescription: (level: number) => string
  maxedEffectsDescription: () => string
  apValue: {
    perLevelAP: number
    maxLevelAP: number
  }
  name: () => string
  description: () => string
}

// Writing out 'level' as zero is repetitive...
type PurpleAmbrosiaUpgradeDefinition<
  T extends PurpleAmbrosiaNames,
  K extends keyof PurpleAmbrosiaUpgradeRewards[T]
> = Omit<PurpleAmbrosiaUpgrade<T, K>, 'level'>

type PurpleAmbrosiaUpgradeData = {
  [K in PurpleAmbrosiaNames]: PurpleAmbrosiaUpgradeDefinition<K, keyof PurpleAmbrosiaUpgradeRewards[K]>
}

const purpleAmbrosiaUpgradeData: PurpleAmbrosiaUpgradeData = {
  aries: {
    maxLevel: 25,
    costFormula: (level: number) => level * (level + 1) / 2,
    effects: (level: number) => {
      const digits = [player.lifetimeAmbrosia, player.lifetimeRedAmbrosia, player.lifetimePurpleAmbrosia].reduce(
        (total, ambrosia) => total + (ambrosia > 0 ? Math.floor(Math.log10(ambrosia)) + 1 : 0),
        0
      )
      return 1 + 0.0005 * level * digits
    },
    notMaxedEffectsDescription: (level: number) =>
      i18next.t('purpleAmbrosia.data.aries.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(1 + 0.0005 * level, 2),
        newPercent: formatAsPercentIncrease(1 + 0.0005 * (level + 1), 2),
        oldPercent2: formatAsPercentIncrease(getPurpleAmbrosiaUpgradeEffects('aries', 'universalBarPointMult'), 2),
        newPercent2: formatAsPercentIncrease(
          getPurpleAmbrosiaUpgradeNextLevelEffects('aries', 'universalBarPointMult'),
          2
        )
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.aries.effectMaxed', {
        maxPercent: formatAsPercentIncrease(1 + 0.0005 * purpleAmbrosiaUpgradeData.aries.maxLevel, 2),
        maxPercent2: formatAsPercentIncrease(getPurpleAmbrosiaUpgradeEffects('aries', 'universalBarPointMult'), 2)
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.aries.name'),
    description: () => i18next.t('purpleAmbrosia.data.aries.description')
  },
  taurus: {
    maxLevel: 10,
    costFormula: (level: number) => 50 * level,
    effects: (level: number) => 1 + level / 10,
    notMaxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.taurus.effectNotMaxed', {
        oldValue: format(getPurpleAmbrosiaUpgradeEffects('taurus', 'taxDivisor'), 1, true),
        newValue: format(getPurpleAmbrosiaUpgradeNextLevelEffects('taurus', 'taxDivisor'), 1, true)
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.taurus.effectMaxed', {
        maxValue: format(getPurpleAmbrosiaUpgradeEffects('taurus', 'taxDivisor'), 1, true)
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.taurus.name'),
    description: () => i18next.t('purpleAmbrosia.data.taurus.description')
  },
  gemini: {
    maxLevel: 10,
    costFormula: (level: number) => 80 * level,
    effects: (level: number) => 1 - level / 100,
    notMaxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.gemini.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(
          2 - getPurpleAmbrosiaUpgradeEffects('gemini', 'ambrosiaRequirementMult'),
          0
        ),
        newPercent: formatAsPercentIncrease(
          2 - getPurpleAmbrosiaUpgradeNextLevelEffects('gemini', 'ambrosiaRequirementMult'),
          0
        )
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.gemini.effectMaxed', {
        maxPercent: formatAsPercentIncrease(2 - getPurpleAmbrosiaUpgradeEffects('gemini', 'ambrosiaRequirementMult'), 0)
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.gemini.name'),
    description: () => i18next.t('purpleAmbrosia.data.gemini.description')
  },
  cancer: {
    maxLevel: 10,
    costFormula: (level: number) => 80 * level,
    effects: (level: number) => level / 100,
    notMaxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.cancer.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(1 + getPurpleAmbrosiaUpgradeEffects('cancer', 'barFillRatio'), 0),
        newPercent: formatAsPercentIncrease(1 + getPurpleAmbrosiaUpgradeNextLevelEffects('cancer', 'barFillRatio'), 0)
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.cancer.effectMaxed', {
        maxPercent: formatAsPercentIncrease(1 + getPurpleAmbrosiaUpgradeEffects('cancer', 'barFillRatio'), 0)
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.cancer.name'),
    description: () => i18next.t('purpleAmbrosia.data.cancer.description')
  },
  leo: {
    maxLevel: 25,
    costFormula: (level: number) => 125 * level,
    effects: (level: number) => {
      const unassignedBlueberries = calculateBlueberryInventory() - player.spentBlueberries
      return unassignedBlueberries >= 5 ? unassignedBlueberries * level : 0
    },
    notMaxedEffectsDescription: (level: number) =>
      i18next.t('purpleAmbrosia.data.leo.effectNotMaxed', {
        oldValue: format(level, 0, true),
        newValue: format(level + 1, 0, true),
        oldValue2: format(getPurpleAmbrosiaUpgradeEffects('leo', 'unassignedBlueberyLuck'), 0, true),
        newValue2: format(getPurpleAmbrosiaUpgradeNextLevelEffects('leo', 'unassignedBlueberyLuck'), 0, true)
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.leo.effectMaxed', {
        maxValue: format(purpleAmbrosiaUpgradeData.leo.maxLevel, 0, true),
        maxValue2: format(getPurpleAmbrosiaUpgradeEffects('leo', 'unassignedBlueberyLuck'), 0, true)
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.leo.name'),
    description: () => i18next.t('purpleAmbrosia.data.leo.description')
  },
  virgo: {
    maxLevel: 15,
    costFormula: (level: number) => 60 * level,
    effects: (level: number) => player.spentBlueberries * level,
    notMaxedEffectsDescription: (level: number) =>
      i18next.t('purpleAmbrosia.data.virgo.effectNotMaxed', {
        oldValue: format(level, 0, true),
        newValue: format(level + 1, 0, true),
        oldValue2: format(getPurpleAmbrosiaUpgradeEffects('virgo', 'assignedBlueberrySalvage'), 0, true),
        newValue2: format(getPurpleAmbrosiaUpgradeNextLevelEffects('virgo', 'assignedBlueberrySalvage'), 0, true)
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.virgo.effectMaxed', {
        maxValue: format(purpleAmbrosiaUpgradeData.virgo.maxLevel, 0, true),
        maxValue2: format(getPurpleAmbrosiaUpgradeEffects('virgo', 'assignedBlueberrySalvage'), 0, true)
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.virgo.name'),
    description: () => i18next.t('purpleAmbrosia.data.virgo.description')
  },
  libra: {
    maxLevel: 1,
    costFormula: (level: number) => 1001 * level,
    effects: (level: number) => level > 0,
    notMaxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.libra.effectNotMaxed'),
    maxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.libra.effectMaxed'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.libra.name'),
    description: () => i18next.t('purpleAmbrosia.data.libra.description')
  },
  scorpio: {
    maxLevel: 10,
    costFormula: (level: number) => 750 * level,
    effects: (level: number) => 1 + level / 10,
    notMaxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.scorpio.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(
          getPurpleAmbrosiaUpgradeEffects('scorpio', 'purpleReactorConversionMult'),
          0
        ),
        newPercent: formatAsPercentIncrease(
          getPurpleAmbrosiaUpgradeNextLevelEffects('scorpio', 'purpleReactorConversionMult'),
          0
        )
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.scorpio.effectMaxed', {
        maxPercent: formatAsPercentIncrease(
          getPurpleAmbrosiaUpgradeEffects('scorpio', 'purpleReactorConversionMult'),
          0
        )
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.scorpio.name'),
    description: () => i18next.t('purpleAmbrosia.data.scorpio.description')
  },
  sagittarius: {
    maxLevel: 1,
    costFormula: (level: number) => 200 * level,
    effects: (level: number) => level > 0,
    notMaxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.sagittarius.effectNotMaxed'),
    maxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.sagittarius.effectMaxed'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.sagittarius.name'),
    description: () => i18next.t('purpleAmbrosia.data.sagittarius.description')
  },
  capricorn: {
    maxLevel: 1,
    costFormula: (level: number) => 4_000 * level,
    effects: (level: number) => level > 0,
    notMaxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.capricorn.effectNotMaxed'),
    maxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.capricorn.effectMaxed'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.capricorn.name'),
    description: () => i18next.t('purpleAmbrosia.data.capricorn.description')
  },
  aquarius: {
    maxLevel: 1,
    costFormula: (level: number) => 3000 * level,
    effects: (level: number) =>
      level / 100 * getOcteractUpgradeEffect('octeractOneMindImprover', 'ascendSpeedExponent'),
    notMaxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.aquarius.effectNotMaxed', {
        oldValue: format(getPurpleAmbrosiaUpgradeEffects('aquarius', 'infiniteTranscriptionExponent'), 4, true),
        newValue: format(getPurpleAmbrosiaUpgradeNextLevelEffects('aquarius', 'infiniteTranscriptionExponent'), 4, true)
      }),
    maxedEffectsDescription: () =>
      i18next.t('purpleAmbrosia.data.aquarius.effectMaxed', {
        maxValue: format(getPurpleAmbrosiaUpgradeEffects('aquarius', 'infiniteTranscriptionExponent'), 3, true)
      }),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.aquarius.name'),
    description: () => i18next.t('purpleAmbrosia.data.aquarius.description')
  },
  pisces: {
    maxLevel: 1,
    costFormula: (level: number) => 5000 * level,
    effects: (level: number) => level > 0,
    notMaxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.pisces.effectNotMaxed'),
    maxedEffectsDescription: () => i18next.t('purpleAmbrosia.data.pisces.effectMaxed'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 20
    },
    name: () => i18next.t('purpleAmbrosia.data.pisces.name'),
    description: () => i18next.t('purpleAmbrosia.data.pisces.description')
  }
}

type PurpleAmbrosiaUpgrades = {
  [K in PurpleAmbrosiaNames]: PurpleAmbrosiaUpgrade<K, keyof PurpleAmbrosiaUpgradeRewards[K]>
}

const createPurpleAmbrosiaUpgrades = (definitions: PurpleAmbrosiaUpgradeData): PurpleAmbrosiaUpgrades => {
  return Object.fromEntries(
    Object.entries(definitions).map(([key, definition]) => {
      return [
        key as PurpleAmbrosiaNames,
        {
          ...definition,
          level: 0
        }
      ]
    })
  ) as PurpleAmbrosiaUpgrades
}

export const purpleAmbrosiaUpgrades = createPurpleAmbrosiaUpgrades(purpleAmbrosiaUpgradeData)
export const purpleAmbrosiaUpgradeNames = Object.keys(purpleAmbrosiaUpgrades) as PurpleAmbrosiaNames[]

export const maxPurpleAmbrosiaUpgradeAP = Object.values(purpleAmbrosiaUpgrades).reduce((acc, upgrade) => {
  return acc + upgrade.apValue.maxLevelAP
}, 0)

export const maximumAffordableLevel = (
  upgradeKey: PurpleAmbrosiaNames,
  purpleAmbrosiaAmount: number
): number => {
  const upgrade = purpleAmbrosiaUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return upgrade.level // no need to check maxed upgrades for affordability
  }

  const availablePurpleAmbrosia = purpleAmbrosiaAmount + player.purpleAmbrosiaUpgrades[upgradeKey]

  let low = upgrade.level
  let high = upgrade.maxLevel

  while (low < high) {
    const middle = low + Math.ceil((high - low) / 2)

    if (upgrade.costFormula(middle) <= availablePurpleAmbrosia) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return low
}

export const setPurpleAmbrosiaUpgradeLevels = (): void => {
  for (const upgradeKey of purpleAmbrosiaUpgradeNames) {
    const upgrade = purpleAmbrosiaUpgrades[upgradeKey]
    const oldInvested = player.purpleAmbrosiaUpgrades[upgradeKey] || 0

    upgrade.level = 0

    const maxAffordableLevel = maximumAffordableLevel(upgradeKey, 0)
    const totalCost = upgrade.costFormula(maxAffordableLevel)

    upgrade.level = maxAffordableLevel

    player.purpleAmbrosiaUpgrades[upgradeKey] = totalCost

    const toRefund = oldInvested - totalCost
    if (toRefund > 0) {
      player.purpleAmbrosia += toRefund
    }
  }
}

export const blankPurpleAmbrosiaUpgradeObject: Record<PurpleAmbrosiaNames, number> = Object.fromEntries(
  Object.keys(purpleAmbrosiaUpgrades).map((key) => [
    key as PurpleAmbrosiaNames,
    0
  ])
) as Record<PurpleAmbrosiaNames, number>

export const getPurpleAmbrosiaUpgradeEffects = <
  T extends PurpleAmbrosiaNames,
  K extends keyof PurpleAmbrosiaUpgradeRewards[T]
>(
  upgradeKey: T,
  key: K,
  nextLevel = false
): PurpleAmbrosiaUpgradeRewards[T][K] => {
  const level = purpleAmbrosiaUpgrades[upgradeKey].level + +nextLevel
  return purpleAmbrosiaUpgrades[upgradeKey].effects(level, key) as PurpleAmbrosiaUpgradeRewards[T][K]
}

export const getPurpleAmbrosiaUpgradeNextLevelEffects = <
  T extends PurpleAmbrosiaNames,
  K extends keyof PurpleAmbrosiaUpgradeRewards[T]
>(
  upgradeKey: T,
  key: K
): PurpleAmbrosiaUpgradeRewards[T][K] => {
  return getPurpleAmbrosiaUpgradeEffects(upgradeKey, key, true)
}

const getPurpleAmbrosiaUpgradeNotMaxedDescription = (upgradeKey: PurpleAmbrosiaNames): string => {
  const currentLevel = purpleAmbrosiaUpgrades[upgradeKey].level
  return purpleAmbrosiaUpgrades[upgradeKey].notMaxedEffectsDescription(currentLevel)
}

const getPurpleAmbrosiaUpgradeMaxedDescription = (upgradeKey: PurpleAmbrosiaNames): string => {
  return purpleAmbrosiaUpgrades[upgradeKey].maxedEffectsDescription()
}

const getPurpleAmbrosiaUpgradeCostTNL = (upgradeKey: PurpleAmbrosiaNames): number => {
  const upgrade = purpleAmbrosiaUpgrades[upgradeKey]
  if (upgrade.level === upgrade.maxLevel) {
    return 0
  }
  return upgrade.costFormula(upgrade.level + 1) - upgrade.costFormula(upgrade.level)
}

export const purpleAmbrosiaUpgradeToString = (upgradeKey: PurpleAmbrosiaNames): string => {
  const upgrade = purpleAmbrosiaUpgrades[upgradeKey]
  const costNextLevel = getPurpleAmbrosiaUpgradeCostTNL(upgradeKey)
  const maxLevel = `/${format(upgrade.maxLevel, 0, true)}`
  const isMaxLevel = upgrade.maxLevel === upgrade.level
  const color = isMaxLevel ? 'plum' : 'white'

  const name = upgrade.name()
  const nameSpan = `<span style="color: gold">${name}</span>`
  const levelSpan = `<span style="color: ${color}"> ${i18next.t('general.level')} ${
    format(upgrade.level, 0, true)
  }${maxLevel}</span>`
  const descriptionSpan = `<span style="color: lightgray">${upgrade.description()}</span>`

  let effectSpan = ''
  if (isMaxLevel) {
    const effect = getPurpleAmbrosiaUpgradeMaxedDescription(upgradeKey)
    effectSpan = `<span style="color: white">${effect}</span>`
  } else {
    const effect = getPurpleAmbrosiaUpgradeNotMaxedDescription(upgradeKey)
    effectSpan = `<span style="color: white">${effect}</span>`
  }

  const costNextLevelSpan = i18next.t('purpleAmbrosia.purpleAmbrosiaCost', {
    amount: format(costNextLevel, 0, true)
  })

  const spentSpan = i18next.t('purpleAmbrosia.purpleAmbrosiaSpent', {
    current: format(player.purpleAmbrosiaUpgrades[upgradeKey], 0, true),
    max: format(upgrade.costFormula(upgrade.maxLevel), 0, true)
  })

  let baseString = `${nameSpan} <br> ${descriptionSpan} <br> ${levelSpan} <br><br> ${effectSpan} <br> ${
    (!isMaxLevel) ? `${costNextLevelSpan} <br> ` : ''
  }${spentSpan} <br>`

  if (upgrade.apValue.maxLevelAP > 0) {
    const apMaxLevelSpan = i18next.t('purpleReactor.upgradeAPMax', {
      amount: format(upgrade.apValue.maxLevelAP, 1),
      check: isMaxLevel ? '✔' : '✖'
    })
    baseString += `<br> ${apMaxLevelSpan}`
  }

  return baseString
}

export const updateMobilePurpleAmbrosiaHTML = (upgradeKey: PurpleAmbrosiaNames) => {
  const elm = DOMCacheGetOrSet('singularityAmbrosiaMultiline')
  elm.innerHTML = purpleAmbrosiaUpgradeToString(upgradeKey)
  // MOBILE ONLY - Add a button for buying upgrades
  if (isMobile) {
    const buttonDiv = document.createElement('div')

    const buyOne = document.createElement('button')
    const buyMax = document.createElement('button')

    buyOne.classList.add('modalBtnBuy')
    buyOne.textContent = i18next.t('general.buyOne')
    buyOne.dataset.modalAction = 'one'

    buyMax.classList.add('modalBtnBuy')
    buyMax.textContent = i18next.t('general.buyMax')
    buyMax.dataset.modalAction = 'max'

    buttonDiv.appendChild(buyOne)
    buttonDiv.appendChild(buyMax)
    elm.appendChild(buttonDiv)
  }
}

export const buyPurpleAmbrosiaUpgradeLevel = async (
  upgradeKey: PurpleAmbrosiaNames,
  event: MouseEvent,
  buyMax = false
): Promise<void> => {
  const upgrade = purpleAmbrosiaUpgrades[upgradeKey]
  if (upgrade.level === upgrade.maxLevel) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  const affordableLevel = maximumAffordableLevel(upgradeKey, player.purpleAmbrosia)
  let levelsToPurchase = Math.min(1, affordableLevel - upgrade.level)

  if (levelsToPurchase <= 0) {
    return Alert(i18next.t('purpleAmbrosia.notEnough'))
  }

  if (event.shiftKey || buyMax) {
    // Don't need to clip to maxLevel since maximumAffordableLevel guarantees it is within bounds
    const maxPurchasableLevels = affordableLevel - upgrade.level
    const levelAmountSelected = Number(
      await Prompt(
        i18next.t('purpleAmbrosia.purpleAmbrosiaBuyPrompt', {
          amount: format(maxPurchasableLevels, 0, true)
        })
      )
    )

    if (isNaN(levelAmountSelected) || !isFinite(levelAmountSelected) || !Number.isInteger(levelAmountSelected)) {
      // nan + Infinity checks
      return Alert(i18next.t('general.validation.finite'))
    }

    if (levelAmountSelected === -1) {
      levelsToPurchase = maxPurchasableLevels
    } else if (levelAmountSelected <= 0) {
      return Alert(i18next.t('octeract.buyLevel.cancelPurchase'))
    } else {
      levelsToPurchase = Math.min(levelAmountSelected, maxPurchasableLevels)
    }
  }

  const cost = upgrade.costFormula(upgrade.level + levelsToPurchase) - upgrade.costFormula(upgrade.level)
  player.purpleAmbrosia -= cost
  player.purpleAmbrosiaUpgrades[upgradeKey] += cost
  upgrade.level += levelsToPurchase

  if (levelsToPurchase > 1) {
    return Alert(i18next.t('octeract.buyLevel.multiBuy', { n: format(levelsToPurchase) }))
  }
}

const getPurpleAmbrosiaUpgradeElement = (index: number): HTMLElement | null => {
  return document.querySelectorAll<HTMLElement>('.purpleAmbrosiaUpgrade').item(index)
}

export const displayPurpleAmbrosiaLevels = () => {
  purpleAmbrosiaUpgradeNames.forEach((key, index) => {
    const elm = getPurpleAmbrosiaUpgradeElement(index)
    if (elm === null) {
      return
    }

    const img = elm.querySelector('img') as HTMLImageElement
    const level = purpleAmbrosiaUpgrades[key].level || 0

    img.classList.add('dimmed')
    let levelOverlay = elm.querySelector('.level-overlay') as HTMLDivElement
    if (!levelOverlay) {
      levelOverlay = document.createElement('div')
      levelOverlay.classList.add('level-overlay')
      elm.classList.add('relative-container')
      elm.appendChild(levelOverlay)
    }

    const isMaxLevel = level === purpleAmbrosiaUpgrades[key].maxLevel
    levelOverlay.classList.toggle('maxPurpleAmbrosiaLevel', isMaxLevel)
    levelOverlay.classList.toggle('notMaxPurpleAmbrosiaLevel', !isMaxLevel)
    levelOverlay.textContent = String(level)
  })
}

export const resetPurpleAmbrosiaDisplay = () => {
  purpleAmbrosiaUpgradeNames.forEach((_key, index) => {
    const elm = getPurpleAmbrosiaUpgradeElement(index)
    if (elm === null) {
      return
    }

    const img = elm.querySelector('img') as HTMLImageElement
    img.classList.remove('dimmed')

    const levelOverlay = elm.querySelector('.level-overlay')
    if (levelOverlay) {
      levelOverlay.remove()
      elm.classList.remove('relative-container')
    }
  })
}
