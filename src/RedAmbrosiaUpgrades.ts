import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { isMobile } from './Utility'

type RedAmbrosiaUpgradeRewards = {
  tutorial: { cubeMult: number; obtainiumMult: number; offeringMult: number }
  conversionImprovement1: { conversionImprovement: number }
  conversionImprovement2: { conversionImprovement: number }
  conversionImprovement3: { conversionImprovement: number }
  freeTutorialLevels: { freeLevels: number }
  freeLevelsRow2: { freeLevels: number }
  freeLevelsRow3: { freeLevels: number }
  freeLevelsRow4: { freeLevels: number }
  freeLevelsRow5: { freeLevels: number }
  blueberryGenerationSpeed: { blueberryGenerationSpeed: number }
  regularLuck: { ambrosiaLuck: number }
  redGenerationSpeed: { redAmbrosiaGenerationSpeed: number }
  redLuck: { redAmbrosiaLuck: number }
  redAmbrosiaCube: { unlockedRedAmbrosiaCube: number }
  redAmbrosiaObtainium: { unlockRedAmbrosiaObtainium: number }
  redAmbrosiaOffering: { unlockRedAmbrosiaOffering: number }
  redAmbrosiaCubeImprover: { extraExponent: number }
  viscount: { roleUnlock: boolean; quarkBonus: number; luckBonus: number; redLuckBonus: number }
  infiniteShopUpgrades: { freeLevels: number }
  redAmbrosiaAccelerator: { ambrosiaTimePerRedAmbrosia: number }
  regularLuck2: { ambrosiaLuck: number }
  blueberryGenerationSpeed2: { blueberryGenerationSpeed: number }
  salvageYinYang: { positiveSalvage: number; negativeSalvage: number }
}

export type RedAmbrosiaNames = keyof RedAmbrosiaUpgradeRewards

export interface RedAmbrosiaUpgrade<T extends RedAmbrosiaNames> {
  name: () => string
  description: () => string
  level: number
  maxLevel: number
  costPerLevel: number
  redAmbrosiaInvested: number
  costFormula: (level: number, baseCost: number) => number
  effects: (n: number) => RedAmbrosiaUpgradeRewards[T]
  effectsDescription: (n: number) => string
}

export const redAmbrosiaUpgrades: { [K in RedAmbrosiaNames]: RedAmbrosiaUpgrade<K> } = {
  tutorial: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 0 * level // Level has no effect.
    },
    effects: (n: number) => {
      const val = Math.pow(1.01, n)
      return {
        cubeMult: val,
        obtainiumMult: val,
        offeringMult: val
      }
    },
    effectsDescription: (n: number) => {
      const val = Math.pow(1.01, n)
      return i18next.t('redAmbrosia.data.tutorial.effect', {
        amount: formatAsPercentIncrease(val)
      })
    },
    maxLevel: 100,
    costPerLevel: 1,
    name: () => i18next.t('redAmbrosia.data.tutorial.name'),
    description: () => i18next.t('redAmbrosia.data.tutorial.description')
  },
  conversionImprovement1: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    effects: (n: number) => {
      return {
        conversionImprovement: -n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.conversionImprovement1.effect', { amount: n })
    },
    maxLevel: 5,
    costPerLevel: 5,
    name: () => i18next.t('redAmbrosia.data.conversionImprovement1.name'),
    description: () => i18next.t('redAmbrosia.data.conversionImprovement1.description')
  },
  conversionImprovement2: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(4, level)
    },
    effects: (n: number) => {
      return {
        conversionImprovement: -n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.conversionImprovement2.effect', { amount: n })
    },
    maxLevel: 3,
    costPerLevel: 200,
    name: () => i18next.t('redAmbrosia.data.conversionImprovement2.name'),
    description: () => i18next.t('redAmbrosia.data.conversionImprovement2.description')
  },
  conversionImprovement3: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(10, level)
    },
    effects: (n: number) => {
      return {
        conversionImprovement: -n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.conversionImprovement3.effect', { amount: n })
    },
    maxLevel: 2,
    costPerLevel: 10000,
    name: () => i18next.t('redAmbrosia.data.conversionImprovement3.name'),
    description: () => i18next.t('redAmbrosia.data.conversionImprovement3.description')
  },
  freeTutorialLevels: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost + level
    },
    effects: (n: number) => {
      return {
        freeLevels: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.freeTutorialLevels.effect', { amount: n })
    },
    maxLevel: 5,
    costPerLevel: 1,
    name: () => i18next.t('redAmbrosia.data.freeTutorialLevels.name'),
    description: () => i18next.t('redAmbrosia.data.freeTutorialLevels.description')
  },
  freeLevelsRow2: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    effects: (n: number) => {
      return {
        freeLevels: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.freeLevelsRow2.effect', { amount: n })
    },
    maxLevel: 5,
    costPerLevel: 10,
    name: () => i18next.t('redAmbrosia.data.freeLevelsRow2.name'),
    description: () => i18next.t('redAmbrosia.data.freeLevelsRow2.description')
  },
  freeLevelsRow3: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    effects: (n: number) => {
      return {
        freeLevels: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.freeLevelsRow3.effect', { amount: n })
    },
    maxLevel: 5,
    costPerLevel: 250,
    name: () => i18next.t('redAmbrosia.data.freeLevelsRow3.name'),
    description: () => i18next.t('redAmbrosia.data.freeLevelsRow3.description')
  },
  freeLevelsRow4: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    effects: (n: number) => {
      return {
        freeLevels: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.freeLevelsRow4.effect', { amount: n })
    },
    maxLevel: 5,
    costPerLevel: 5000,
    name: () => i18next.t('redAmbrosia.data.freeLevelsRow4.name'),
    description: () => i18next.t('redAmbrosia.data.freeLevelsRow4.description')
  },
  freeLevelsRow5: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * Math.pow(2, level)
    },
    effects: (n: number) => {
      return {
        freeLevels: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.freeLevelsRow5.effect', { amount: n })
    },
    maxLevel: 5,
    costPerLevel: 50000,
    name: () => i18next.t('redAmbrosia.data.freeLevelsRow5.name'),
    description: () => i18next.t('redAmbrosia.data.freeLevelsRow5.description')
  },
  blueberryGenerationSpeed: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      const val = 1 + n / 500
      return {
        blueberryGenerationSpeed: val
      }
    },
    effectsDescription: (n: number) => {
      const val = 1 + n / 500
      return i18next.t('redAmbrosia.data.blueberryGenerationSpeed.effect', { amount: formatAsPercentIncrease(val) })
    },
    maxLevel: 100,
    costPerLevel: 1,
    name: () => i18next.t('redAmbrosia.data.blueberryGenerationSpeed.name'),
    description: () => i18next.t('redAmbrosia.data.blueberryGenerationSpeed.description')
  },
  regularLuck: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      const val = 2 * n
      return {
        ambrosiaLuck: val
      }
    },
    effectsDescription: (n: number) => {
      const val = 2 * n
      return i18next.t('redAmbrosia.data.regularLuck.effect', { amount: val })
    },
    maxLevel: 100,
    costPerLevel: 1,
    name: () => i18next.t('redAmbrosia.data.regularLuck.name'),
    description: () => i18next.t('redAmbrosia.data.regularLuck.description')
  },
  redGenerationSpeed: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      const val = 1 + 3 * n / 1000
      return {
        redAmbrosiaGenerationSpeed: val
      }
    },
    effectsDescription: (n: number) => {
      const val = 1 + 3 * n / 1000
      return i18next.t('redAmbrosia.data.redGenerationSpeed.effect', { amount: formatAsPercentIncrease(val) })
    },
    maxLevel: 100,
    costPerLevel: 12,
    name: () => i18next.t('redAmbrosia.data.redGenerationSpeed.name'),
    description: () => i18next.t('redAmbrosia.data.redGenerationSpeed.description')
  },
  redLuck: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      const val = n
      return {
        redAmbrosiaLuck: val
      }
    },
    effectsDescription: (n: number) => {
      const val = n
      return i18next.t('redAmbrosia.data.redLuck.effect', { amount: val })
    },
    maxLevel: 100,
    costPerLevel: 4,
    name: () => i18next.t('redAmbrosia.data.redLuck.name'),
    description: () => i18next.t('redAmbrosia.data.redLuck.description')
  },
  redAmbrosiaCube: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      return {
        unlockedRedAmbrosiaCube: n
      }
    },
    effectsDescription: (n: number) => {
      const exponent = 0.4 + getRedAmbrosiaUpgradeEffects('redAmbrosiaCubeImprover').extraExponent
      return i18next.t('redAmbrosia.data.redAmbrosiaCube.effect', {
        amount: n > 0,
        exponent: format(exponent, 2, true)
      })
    },
    maxLevel: 1,
    costPerLevel: 500,
    name: () => i18next.t('redAmbrosia.data.redAmbrosiaCube.name'),
    description: () => i18next.t('redAmbrosia.data.redAmbrosiaCube.description')
  },
  redAmbrosiaObtainium: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      return {
        unlockRedAmbrosiaObtainium: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.redAmbrosiaObtainium.effect', { amount: n > 0 })
    },
    maxLevel: 1,
    costPerLevel: 1250,
    name: () => i18next.t('redAmbrosia.data.redAmbrosiaObtainium.name'),
    description: () => i18next.t('redAmbrosia.data.redAmbrosiaObtainium.description')
  },
  redAmbrosiaOffering: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      return {
        unlockRedAmbrosiaOffering: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.redAmbrosiaOffering.effect', { amount: n > 0 })
    },
    maxLevel: 1,
    costPerLevel: 4000,
    name: () => i18next.t('redAmbrosia.data.redAmbrosiaOffering.name'),
    description: () => i18next.t('redAmbrosia.data.redAmbrosiaOffering.description')
  },
  redAmbrosiaCubeImprover: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      const val = 0.01 * n
      return {
        extraExponent: val
      }
    },
    effectsDescription: (n: number) => {
      const val = 0.01 * n
      return i18next.t('redAmbrosia.data.redAmbrosiaCubeImprover.effect', { newExponent: format(0.4 + val, 2, true) })
    },
    maxLevel: 20,
    costPerLevel: 100,
    name: () => i18next.t('redAmbrosia.data.redAmbrosiaCubeImprover.name'),
    description: () => i18next.t('redAmbrosia.data.redAmbrosiaCubeImprover.description')
  },
  viscount: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      return {
        roleUnlock: n > 0,
        quarkBonus: 1 + 0.1 * n,
        luckBonus: 125 * n,
        redLuckBonus: 25 * n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.viscount.effect', { mark: n > 0 ? '✔' : '❌' })
    },
    maxLevel: 1,
    costPerLevel: 99999,
    name: () => i18next.t('redAmbrosia.data.viscount.name'),
    description: () => i18next.t('redAmbrosia.data.viscount.description')
  },
  infiniteShopUpgrades: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 100 * level
    },
    effects: (n: number) => {
      return {
        freeLevels: n
      }
    },
    effectsDescription: (n: number) => {
      return i18next.t('redAmbrosia.data.infiniteShopUpgrades.effect', { amount: n })
    },
    maxLevel: 40,
    costPerLevel: 200,
    name: () => i18next.t('redAmbrosia.data.infiniteShopUpgrades.name'),
    description: () => i18next.t('redAmbrosia.data.infiniteShopUpgrades.description')
  },
  redAmbrosiaAccelerator: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost + level * 0
    },
    effects: (n: number) => {
      const val = 0.02 * n + ((n > 0) ? 1 : 0)
      return {
        ambrosiaTimePerRedAmbrosia: val
      }
    },
    effectsDescription: (n: number) => {
      const val = 0.02 * n + ((n > 0) ? 1 : 0)
      return i18next.t('redAmbrosia.data.redAmbrosiaAccelerator.effect', { amount: format(val, 2, true) })
    },
    maxLevel: 100,
    costPerLevel: 1000,
    name: () => i18next.t('redAmbrosia.data.redAmbrosiaAccelerator.name'),
    description: () => i18next.t('redAmbrosia.data.redAmbrosiaAccelerator.description')
  },
  regularLuck2: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 0 * level
    },
    effects: (n: number) => {
      const val = 2 * n
      return {
        ambrosiaLuck: val
      }
    },
    effectsDescription: (n: number) => {
      const val = 2 * n
      return i18next.t('redAmbrosia.data.regularLuck2.effect', { amount: val })
    },
    maxLevel: 250,
    costPerLevel: 8000,
    name: () => i18next.t('redAmbrosia.data.regularLuck2.name'),
    description: () => i18next.t('redAmbrosia.data.regularLuck2.description')
  },
  blueberryGenerationSpeed2: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost + 0 * level
    },
    effects: (n: number) => {
      const val = 1 + n / 1000
      return {
        blueberryGenerationSpeed: val
      }
    },
    effectsDescription: (n: number) => {
      const val = 1 + n / 1000
      return i18next.t('redAmbrosia.data.blueberryGenerationSpeed2.effect', { amount: formatAsPercentIncrease(val) })
    },
    maxLevel: 250,
    costPerLevel: 8000,
    name: () => i18next.t('redAmbrosia.data.blueberryGenerationSpeed2.name'),
    description: () => i18next.t('redAmbrosia.data.blueberryGenerationSpeed2.description')
  },
  salvageYinYang: {
    level: 0,
    redAmbrosiaInvested: 0,
    costFormula: (level: number, baseCost: number) => {
      return baseCost * (level + 1)
    },
    effects: (n: number) => {
      if (player.singularityChallenges.taxmanLastStand.enabled) {
        return {
          positiveSalvage: 0,
          negativeSalvage: 0
        }
      }
      return {
        positiveSalvage: 10 * n,
        negativeSalvage: -10 * n
      }
    },
    effectsDescription: (n: number) => {
      const bonus = player.singularityChallenges.taxmanLastStand.enabled ? 0 : 10 * n
      return i18next.t('redAmbrosia.data.salvageYinYang.effect', { amount: bonus })
    },
    maxLevel: 100,
    costPerLevel: 200,
    name: () => i18next.t('redAmbrosia.data.salvageYinYang.name'),
    description: () => i18next.t('redAmbrosia.data.salvageYinYang.description')
  }
}

export const maxRedAmbrosiaUpgradeAP = Object.values(redAmbrosiaUpgrades).reduce((acc, upgrade) => {
  if (upgrade.maxLevel === -1) {
    return acc
  }
  return acc + 10
}, 0)

export const setRedAmbrosiaUpgradeLevels = (): void => {
  for (const upgradeKey of Object.keys(redAmbrosiaUpgrades) as RedAmbrosiaNames[]) {
    const upgrade = redAmbrosiaUpgrades[upgradeKey]
    const invested = player.redAmbrosiaUpgrades[upgradeKey] || 0

    let level = 0
    let budget = invested

    let nextCost = upgrade.costFormula(level, upgrade.costPerLevel)

    while (budget >= nextCost) {
      budget -= nextCost
      level += 1
      nextCost = upgrade.costFormula(level, upgrade.costPerLevel)

      if (level >= upgrade.maxLevel) {
        break
      }
    }

    // If there is leftover budget, then the formulae has probably changed, or above max.
    // We refund the remaining budget.
    if (budget > 0) {
      player.redAmbrosiaUpgrades[upgradeKey] -= budget
      player.redAmbrosia += budget
    }

    upgrade.level = level
    upgrade.redAmbrosiaInvested = invested - budget
  }
}

export const blankRedAmbrosiaUpgradeObject: Record<RedAmbrosiaNames, number> = Object.fromEntries(
  Object.keys(redAmbrosiaUpgrades).map((key) => [
    key as RedAmbrosiaNames,
    0
  ])
) as Record<RedAmbrosiaNames, number>

export const getRedAmbrosiaUpgradeEffects = <T extends RedAmbrosiaNames>(
  upgradeKey: T
): RedAmbrosiaUpgradeRewards[T] => {
  const currentLevel = redAmbrosiaUpgrades[upgradeKey].level
  return redAmbrosiaUpgrades[upgradeKey].effects(currentLevel)
}

export const getRedAmbrosiaUpgradeEffectsDescription = (upgradeKey: RedAmbrosiaNames): string => {
  const currentLevel = redAmbrosiaUpgrades[upgradeKey].level
  return redAmbrosiaUpgrades[upgradeKey].effectsDescription(currentLevel)
}

export const getRedAmbrosiaUpgradeCostTNL = (upgradeKey: RedAmbrosiaNames): number => {
  const upgrade = redAmbrosiaUpgrades[upgradeKey]
  if (upgrade.level === upgrade.maxLevel) {
    return 0
  }
  return upgrade.costFormula(upgrade.level, upgrade.costPerLevel)
}

export const refundRedAmbrosiaUpgrade = (upgradeKey: RedAmbrosiaNames): void => {
  const upgrade = redAmbrosiaUpgrades[upgradeKey]

  player.redAmbrosia += upgrade.redAmbrosiaInvested
  player.redAmbrosiaUpgrades[upgradeKey] = 0
  upgrade.redAmbrosiaInvested = 0
  upgrade.level = 0
}

export const redAmbrosiaUpgradeToString = (upgradeKey: RedAmbrosiaNames): string => {
  const upgrade = redAmbrosiaUpgrades[upgradeKey]
  const costNextLevel = getRedAmbrosiaUpgradeCostTNL(upgradeKey)
  const maxLevel = upgrade.maxLevel === -1 ? '' : `/${format(upgrade.maxLevel, 0, true)}`
  const isMaxLevel = upgrade.maxLevel === upgrade.level
  const color = isMaxLevel ? 'plum' : 'white'

  const nameSpan = `<span style="color: gold">${upgrade.name()}</span>`
  const levelSpan = `<span style="color: ${color}"> ${i18next.t('general.level')} ${
    format(upgrade.level, 0, true)
  }${maxLevel}</span>`
  const descriptionSpan = `<span style="color: lightblue">${upgrade.description()}</span>`
  const rewardDescSpan = `<span style="color: gold">${getRedAmbrosiaUpgradeEffectsDescription(upgradeKey)}</span>`

  const costNextLevelSpan = `${
    i18next.t('redAmbrosia.redAmbrosiaCost', {
      amount: format(costNextLevel, 0, true)
    })
  }`

  const spentSpan = `${
    i18next.t('redAmbrosia.redAmbrosiaSpent', {
      amount: format(upgrade.redAmbrosiaInvested, 0, true)
    })
  }`

  const purchaseWarningSpan = `<span>${i18next.t('redAmbrosia.purchaseWarning')}</span>`

  return `${nameSpan} <br> ${levelSpan} <br> ${descriptionSpan} <br> ${rewardDescSpan} <br> ${
    (!isMaxLevel) ? `${costNextLevelSpan} <br>` : ''
  } ${spentSpan} <br> ${purchaseWarningSpan}`
}

export const updateMobileRedAmbrosiaHTML = (k: RedAmbrosiaNames) => {
  const elm = DOMCacheGetOrSet('singularityAmbrosiaMultiline')
  elm.innerHTML = redAmbrosiaUpgradeToString(k)
  // MOBILE ONLY - Add a button for buying upgrades
  if (isMobile) {
    const buttonDiv = document.createElement('div')

    const buyOne = document.createElement('button')
    const buyMax = document.createElement('button')

    buyOne.classList.add('modalBtnBuy')
    buyOne.textContent = i18next.t('general.buyOne')
    buyOne.addEventListener('click', (event: MouseEvent) => {
      buyRedAmbrosiaUpgradeLevel(k, event, false)
      updateMobileRedAmbrosiaHTML(k)
    })

    buyMax.classList.add('modalBtnBuy')
    buyMax.textContent = i18next.t('general.buyMax')
    buyMax.addEventListener('click', (event: MouseEvent) => {
      buyRedAmbrosiaUpgradeLevel(k, event, true)
      updateMobileRedAmbrosiaHTML(k)
    })

    buttonDiv.appendChild(buyOne)
    buttonDiv.appendChild(buyMax)
    elm.appendChild(buttonDiv)
  }
}

export const buyRedAmbrosiaUpgradeLevel = async (
  upgradeKey: RedAmbrosiaNames,
  event: MouseEvent,
  buyMax = false
): Promise<void> => {
  const upgrade = redAmbrosiaUpgrades[upgradeKey]
  let purchased = 0
  let maxPurchasable = 1
  let redAmbrosiaBudget = player.redAmbrosia

  if (event.shiftKey || buyMax) {
    maxPurchasable = 100000000
    const buy = Number(
      await Prompt(
        i18next.t('redAmbrosia.redAmbrosiaBuyPrompt', {
          amount: format(player.redAmbrosia, 0, true)
        })
      )
    )

    if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) {
      // nan + Infinity checks
      return Alert(i18next.t('general.validation.finite'))
    }

    if (buy === -1) {
      redAmbrosiaBudget = player.redAmbrosia
    } else if (buy <= 0) {
      return Alert(i18next.t('octeract.buyLevel.cancelPurchase'))
    } else {
      redAmbrosiaBudget = buy
    }
    redAmbrosiaBudget = Math.min(player.redAmbrosia, redAmbrosiaBudget)
  }

  if (upgrade.maxLevel > 0) {
    maxPurchasable = Math.min(maxPurchasable, upgrade.maxLevel - upgrade.level)
  }

  if (maxPurchasable === 0) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  while (maxPurchasable > 0) {
    const cost = getRedAmbrosiaUpgradeCostTNL(upgradeKey)
    if (player.redAmbrosia < cost || redAmbrosiaBudget < cost) {
      break
    } else {
      player.redAmbrosia -= cost
      redAmbrosiaBudget -= cost
      upgrade.redAmbrosiaInvested += cost
      upgrade.level += 1
      purchased += 1
      maxPurchasable -= 1

      // Update the player storage
      player.redAmbrosiaUpgrades[upgradeKey] += cost
    }
  }

  if (purchased === 0) {
    return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
  }
  if (purchased > 1) {
    return Alert(
      `${i18next.t('octeract.buyLevel.multiBuy', { n: format(purchased) })}`
    )
  }
}

export const displayRedAmbrosiaLevels = () => {
  for (const key of Object.keys(redAmbrosiaUpgrades)) {
    const k = key as RedAmbrosiaNames

    const capKey = key.charAt(0).toUpperCase() + key.slice(1)
    const name = `redAmbrosia${capKey}`
    const elm = DOMCacheGetOrSet(name)
    // There is an image in the elm. find it.
    const img = elm.querySelector('img') as HTMLImageElement
    const level = redAmbrosiaUpgrades[k].level || 0

    img.classList.add('dimmed')
    let levelOverlay = elm.querySelector('.level-overlay') as HTMLDivElement
    if (!levelOverlay) {
      levelOverlay = document.createElement('div')
      levelOverlay.classList.add('level-overlay')

      if (level === redAmbrosiaUpgrades[k].maxLevel) {
        levelOverlay.classList.add('maxRedAmbrosiaLevel')
      } else {
        levelOverlay.classList.add('notMaxRedAmbrosiaLevel')
      }

      elm.classList.add('relative-container') // Apply relative container to the element
      elm.appendChild(levelOverlay) // Append to the element

      levelOverlay.textContent = String(level) // Set the level text
    }
  }
}

export const resetRedAmbrosiaDisplay = () => {
  for (const key of Object.keys(redAmbrosiaUpgrades)) {
    const capKey = key.charAt(0).toUpperCase() + key.slice(1)
    const name = `redAmbrosia${capKey}`
    const elm = DOMCacheGetOrSet(name)
    const img = elm.querySelector('img') as HTMLImageElement
    img.classList.remove('dimmed') // Remove the dimmed class

    // Remove the level overlay if it exists
    const levelOverlay = elm.querySelector('.level-overlay')
    if (levelOverlay) {
      levelOverlay.remove()
      elm.classList.remove('relative-container') // Remove relative container
    }
  }
}
