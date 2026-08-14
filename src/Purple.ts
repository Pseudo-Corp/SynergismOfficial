import i18next from 'i18next'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, Prompt } from './UpdateHTML'

type PurpleReactorUpgradeRewards = {
  tutorial: {
    ambrosiaGeneration: number
    redAmbrosiaGeneration: number
  }
  purpleEfficiency1: {
    purpleEfficiency: number
  }
  purpleAmbrosiaLuck1: {
    purpleAmbrosiaLuck: number
  }
  purpleHalfLife1: {
    halfLifeReduction: number
  }
}

export type PurpleReactorNames = keyof PurpleReactorUpgradeRewards

export type APRewards = {
  perLevelAP: number
  maxLevelAP: number
}

interface PurpleReactorUpgrade<T extends PurpleReactorNames, K extends keyof PurpleReactorUpgradeRewards[T]> {
  level: number
  purpleInvested: number
  maxLevel: number
  // In these formulas, costFormula is expected to be a cumulative function
  costFormula: (level: number) => number
  effects: (n: number, key: K) => PurpleReactorUpgradeRewards[T][K]
  notMaxedEffectsDescription: (n: number) => string
  maxedEffectsDescription: () => string
  apValue: APRewards
}

// Writing out 'level' and 'purpleInvested' as all zeroes is repetitive...
type PurpleReactorUpgradeDefinition<
  T extends PurpleReactorNames,
  K extends keyof PurpleReactorUpgradeRewards[T]
> = Omit<PurpleReactorUpgrade<T, K>, 'level' | 'purpleInvested'>

type PurpleReactorUpgradeData = {
  [K in PurpleReactorNames]: PurpleReactorUpgradeDefinition<K, keyof PurpleReactorUpgradeRewards[K]>
}

export const purpleReactorUpgradeData: PurpleReactorUpgradeData = {
  tutorial: {
    maxLevel: 20,
    costFormula: (level: number) => Math.floor(level * (level + 1) / 2),
    effects: (n) => {
      return 1 + 0.01 * n // Same for ambrosia and red ambrosia generation
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('tutorial', 'ambrosiaGeneration')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('tutorial', 'ambrosiaGeneration')
      return i18next.t('purpleReactor.upgrades.tutorial.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 0),
        newPercent: formatAsPercentIncrease(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('tutorial', 'ambrosiaGeneration')
      return i18next.t('purpleReactor.upgrades.tutorial.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 0
    }
  },
  purpleEfficiency1: {
    maxLevel: 10,
    costFormula: (level: number) => Math.floor(level * (level + 1) / 2),
    effects: (n) => {
      return 1 + 0.01 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency1', 'purpleEfficiency')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleEfficiency1', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 0),
        newPercent: formatAsPercentIncrease(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency1', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  purpleAmbrosiaLuck1: {
    maxLevel: 10,
    costFormula: (level: number) => Math.floor(level * (level + 1) / 2),
    effects: (n) => {
      return n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleAmbrosiaLuck1', 'purpleAmbrosiaLuck')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleAmbrosiaLuck1', 'purpleAmbrosiaLuck')
      return i18next.t('purpleReactor.upgrades.purpleAmbrosiaLuck1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleAmbrosiaLuck1', 'purpleAmbrosiaLuck')
      return i18next.t('purpleReactor.upgrades.purpleAmbrosiaLuck1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  purpleHalfLife1: {
    maxLevel: 50,
    costFormula: (level: number) => Math.floor(level * (level + 1) / 2),
    effects: (n) => {
      return -200 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife1', 'halfLifeReduction')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife1', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife1', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.3,
      maxLevelAP: 5
    }
  }
}

type PurpleReactorUpgrades = {
  [K in PurpleReactorNames]: PurpleReactorUpgrade<K, keyof PurpleReactorUpgradeRewards[K]>
}

function createPurpleReactorUpgrades (
  definitions: PurpleReactorUpgradeData
): PurpleReactorUpgrades {
  return Object.fromEntries(
    Object.entries(definitions).map(([key, definition]) => {
      const name = key as PurpleReactorNames
      return [
        name,
        {
          ...definition,
          level: 0,
          purpleInvested: 0
        }
      ]
    })
  ) as PurpleReactorUpgrades
}

export const purpleReactorUpgrades = createPurpleReactorUpgrades(purpleReactorUpgradeData)
export const purpleReactorUpgradeNames = Object.keys(purpleReactorUpgrades) as PurpleReactorNames[]

export const blankPurpleReactorUpgradeObject: Record<PurpleReactorNames, number> = Object.fromEntries(
  Object.keys(purpleReactorUpgrades).map((key) => [
    key as PurpleReactorNames,
    0
  ])
) as Record<PurpleReactorNames, number>

export const setPurpleReactorUpgradeLevels = (): void => {
  for (const upgradeKey of purpleReactorUpgradeNames) {
    const upgrade = purpleReactorUpgrades[upgradeKey]

    const oldInvested = player.purpleReactorUpgrades[upgradeKey] || 0
    const maxAffordableLevel = maximumAffordableLevel(upgradeKey, oldInvested)
    const totalCost = upgrade.costFormula(maxAffordableLevel)

    upgrade.level = maxAffordableLevel
    upgrade.purpleInvested = totalCost

    player.purpleReactorUpgrades[upgradeKey] = totalCost

    const toRefund = oldInvested - totalCost
    if (toRefund > 0) {
      player.purpleReactor.purpleHoney += toRefund
    }
  }
}

export const getPurpleReactorUpgradeEffects = <
  T extends PurpleReactorNames,
  K extends keyof PurpleReactorUpgradeRewards[T]
>(
  upgradeKey: T,
  key: K,
  nextLevel = false
): PurpleReactorUpgradeRewards[T][K] => {
  const level = purpleReactorUpgrades[upgradeKey].level + +nextLevel
  return purpleReactorUpgrades[upgradeKey].effects(level, key) as PurpleReactorUpgradeRewards[T][K]
}

export const getPurpleReactorUpgradeNextLevelEffects = <
  T extends PurpleReactorNames,
  K extends keyof PurpleReactorUpgradeRewards[T]
>(
  upgradeKey: T,
  key: K
): PurpleReactorUpgradeRewards[T][K] => {
  return getPurpleReactorUpgradeEffects(upgradeKey, key, true)
}

const getPurpleReactorUpgradeNotMaxedDescription = (upgradeKey: PurpleReactorNames): string => {
  const currentLevel = purpleReactorUpgrades[upgradeKey].level
  return purpleReactorUpgradeData[upgradeKey].notMaxedEffectsDescription(currentLevel)
}

const getPurpleReactorUpgradeMaxedDescription = (upgradeKey: PurpleReactorNames): string => {
  return purpleReactorUpgradeData[upgradeKey].maxedEffectsDescription()
}

const getPurpleReactorUpgradeCostTNL = (upgradeKey: PurpleReactorNames): number => {
  const upgrade = purpleReactorUpgrades[upgradeKey]
  if (upgrade.level === upgrade.maxLevel) {
    return 0
  }
  // since costFormula is a cumulative function, level 1 = cost of level 1
  if (upgrade.level === 0) {
    return upgrade.costFormula(1)
  }
  // cost(n) = cumulative(n) - cumulative(n-1)
  return upgrade.costFormula(upgrade.level + 1) - upgrade.costFormula(upgrade.level)
}

export const maximumAffordableLevel = (upgradeKey: PurpleReactorNames, purpleAmount: number): number => {
  const upgrade = purpleReactorUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return upgrade.level // no need to check maxed upgrades for affordability
  }

  const availablePurple = purpleAmount + upgrade.purpleInvested

  let low = upgrade.level
  let high = upgrade.maxLevel

  while (low < high) {
    const middle = low + Math.ceil((high - low) / 2)

    if (upgrade.costFormula(middle) <= availablePurple) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return low
}

export const purpleReactorUpgradeToString = (upgradeKey: PurpleReactorNames): string => {
  const upgrade = purpleReactorUpgrades[upgradeKey]
  const costNextLevel = getPurpleReactorUpgradeCostTNL(upgradeKey)
  const maxLevel = upgrade.maxLevel === -1 ? '' : `/${format(upgrade.maxLevel, 0, true)}`
  const isMaxLevel = upgrade.maxLevel === upgrade.level
  const color = isMaxLevel ? 'plum' : 'white'

  const name = i18next.t(`purpleReactor.upgrades.${upgradeKey}.name`)
  const nameSpan = `<span style="color: gold">${name}</span>`
  const levelSpan = `<span style="color: ${color}"> ${i18next.t('general.level')} ${
    format(upgrade.level, 0, true)
  }${maxLevel}</span>`

  const flavor = i18next.t(`purpleReactor.upgrades.${upgradeKey}.flavor`)
  const flavorSpan = `<span style="color: lightgray">${flavor}</span>`

  let effectSpan = ''
  if (upgrade.level === upgrade.maxLevel) {
    const effect = getPurpleReactorUpgradeMaxedDescription(upgradeKey)
    effectSpan = `<span style="color: white">${effect}</span>`
  } else {
    const effect = getPurpleReactorUpgradeNotMaxedDescription(upgradeKey)
    effectSpan = `<span style="color: white">${effect}</span>`
  }

  const costNextLevelSpan = i18next.t('purpleReactor.purpleHoneyCost', {
    amount: format(costNextLevel, 0, true)
  })

  const spentSpan = i18next.t('purpleReactor.purpleHoneySpent', {
    amount: format(upgrade.purpleInvested, 0, true)
  })

  let baseString = `${nameSpan} <br> ${flavorSpan} <br> ${levelSpan} <br><br> ${effectSpan} <br> ${
    (!isMaxLevel) ? `${costNextLevelSpan} <br>` : ''
  } ${spentSpan} <br>`

  if (upgrade.apValue.perLevelAP > 0) {
    const apPerLevelSpan = i18next.t('purpleReactor.upgradeAPPerLevel', {
      amount: format(upgrade.apValue.perLevelAP, 1),
      total: format(upgrade.level * upgrade.apValue.perLevelAP, 1)
    })
    baseString += `<br> ${apPerLevelSpan}`
  }

  if (upgrade.apValue.maxLevelAP > 0) {
    const apMaxLevelSpan = i18next.t('purpleReactor.upgradeAPMax', {
      amount: format(upgrade.apValue.maxLevelAP, 1),
      check: (upgrade.level === upgrade.maxLevel) ? '✔' : '✖'
    })
    baseString += `<br> ${apMaxLevelSpan}`
  }

  return baseString
}

export const buyPurpleReactorUpgradeLevel = async (
  upgradeKey: PurpleReactorNames,
  event: MouseEvent,
  buyMax = false
): Promise<void> => {
  const upgrade = purpleReactorUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  const highestBuyableLevel = maximumAffordableLevel(upgradeKey, player.purpleReactor.purpleHoney)
  const maxPurchasable = highestBuyableLevel - upgrade.level
  let toPurchase = 1

  if (maxPurchasable <= 0) {
    return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
  }

  if (event.shiftKey || buyMax) {
    const buy = Number(
      await Prompt(
        i18next.t('purpleReactor.purpleHoneyBuyPrompt', {
          max: format(maxPurchasable, 0, true)
        })
      )
    )
    if (buy === -1) {
      toPurchase = maxPurchasable
    } else if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy) || buy <= 0) {
      // nan + Infinity checks
      return Alert(i18next.t('purpleReactor.notPositive'))
    } else {
      toPurchase = Math.min(buy, maxPurchasable)
    }
  }

  const cost = upgrade.costFormula(upgrade.level + toPurchase)
  player.purpleReactor.purpleHoney -= cost
  upgrade.purpleInvested += cost
  upgrade.level += toPurchase
  player.purpleReactorUpgrades[upgradeKey] += cost
  if (toPurchase > 1) {
    return Alert(i18next.t('octeract.buyLevel.multiBuy', { n: format(toPurchase) }))
  }
}

export const calculatePurpleReactorAP = (): number => {
  let totalAP = 0
  for (const upgradeKey of purpleReactorUpgradeNames) {
    const upgrade = purpleReactorUpgrades[upgradeKey]
    totalAP += upgrade.level * upgrade.apValue.perLevelAP
    if (upgrade.level === upgrade.maxLevel) {
      totalAP += upgrade.apValue.maxLevelAP
    }
  }
  return totalAP
}
