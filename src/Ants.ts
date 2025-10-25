import {
  calculateAntSacrificeMultiplier,
  calculateAntSacrificeRewards,
  calculateBaseAntELO,
  calculateEffectiveAntELO,
  calculateSigmoidExponential
} from './Calculate'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { awardAchievementGroup, awardUngroupedAchievement, getAchievementReward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcECC } from './Challenges'
import { calculateAntELOCubeBlessing } from './Cubes'
import { AntProducers } from './Features/Ants/structs/structs'
import { resetHistoryAdd, type ResetHistoryEntryAntSacrifice } from './History'
import { resetAnts, resetTiers } from './Reset'
import { offeringObtainiumTimeModifiers } from './Statistics'
import { getTalismanEffects, updateTalismanInventory } from './Talismans'
import { Confirm } from './UpdateHTML'

/**
 * PART 2: Ant Upgrades (WOAH!)
 */

export enum AntUpgrades {
  AntSpeed = 0,
  Coins = 1,
  Taxes = 2,
  AcceleratorBoosts = 3,
  Multipliers = 4,
  Offerings = 5,
  BuildingCostScale = 6,
  Salvage = 7,
  FreeRunes = 8,
  Obtainium = 9,
  AntSacrifice = 10,
  Mortuus = 11
}

export const LAST_ANT_UPGRADE = AntUpgrades.Mortuus

type AntUpgradeTypeMap = {
  [AntUpgrades.AntSpeed]: { antSpeed: Decimal }
  [AntUpgrades.Coins]: {
    crumbToCoinExp: number
    coinMultiplier: Decimal
  }
  [AntUpgrades.Taxes]: { taxReduction: number }
  [AntUpgrades.AcceleratorBoosts]: { acceleratorBoostMult: number }
  [AntUpgrades.Multipliers]: { multiplierMult: number }
  [AntUpgrades.Offerings]: { offeringMult: number }
  [AntUpgrades.BuildingCostScale]: { buildingCostScale: number }
  [AntUpgrades.Salvage]: { salvage: number }
  [AntUpgrades.FreeRunes]: { freeRuneLevel: number }
  [AntUpgrades.Obtainium]: { obtainiumMult: number }
  [AntUpgrades.AntSacrifice]: { antSacrificeMultiplier: number }
  [AntUpgrades.Mortuus]: {
    talismanUnlock: boolean
    globalSpeed: number
  }
}

interface AntUpgradeData<K extends AntUpgrades> {
  baseCost: Decimal
  costIncrease: number
  antUpgradeHTML: {
    color: string
  }
  minimumResetTier: resetTiers
  name: () => string
  intro: () => string
  description: () => string
  effect: (n: number) => AntUpgradeTypeMap[K]
  effectDescription: () => string
}

export const antUpgrades: { [K in AntUpgrades]: AntUpgradeData<K> } = {
  [AntUpgrades.AntSpeed]: {
    baseCost: new Decimal(100),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.antSpeed.name'),
    intro: () => i18next.t('ants.upgrades.antSpeed.intro'),
    description: () => {
      let baseMul = 1.1
      baseMul += player.researches[101] / 1000 // Research 5x1
      baseMul += player.researches[162] / 1000 // Research 7x12
      return i18next.t('ants.upgrades.antSpeed.description', { x: format(baseMul, 3, true) })
    },
    effect: (n: number) => {
      let baseMul = 1.1
      baseMul += player.researches[101] / 1000 // Research 5x1
      baseMul += player.researches[162] / 1000 // Research 7x12
      return {
        antSpeed: Decimal.pow(baseMul, n)
      }
    },
    effectDescription: () => {
      const antSpeed = getAntUpgradeEffect(AntUpgrades.AntSpeed).antSpeed
      return i18next.t('ants.upgrades.antSpeed.effect', { x: format(antSpeed, 2, true) })
    }
  },
  [AntUpgrades.Coins]: {
    baseCost: new Decimal(100),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'yellow'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.coins.name'),
    intro: () => i18next.t('ants.upgrades.coins.intro'),
    description: () => i18next.t('ants.upgrades.coins.description'),
    effect: (n: number) => {
      let divisor = player.corruptions.used.corruptionEffects('extinction')
      if (player.currentChallenge.ascension === 15) {
        divisor *= 1000
      }
      const exponent = (99999 + calculateSigmoidExponential(49900001, n / 5000 * 500 / 499)) / divisor
      const coinMult = Decimal.max(1, Decimal.pow(player.ants.crumbs, exponent))
      return {
        crumbToCoinExp: exponent,
        coinMultiplier: coinMult
      }
    },
    effectDescription: () => {
      const crumbToCoinExp = getAntUpgradeEffect(AntUpgrades.Coins).crumbToCoinExp
      const overallEffect = Decimal.max(1, Decimal.pow(player.ants.crumbs, crumbToCoinExp))
      const effect1 = i18next.t('ants.upgrades.coins.effect', { x: format(crumbToCoinExp, 0, true) })
      const effect2 = i18next.t('ants.upgrades.coins.effect2', { x: format(overallEffect, 2, true) })
      return `${effect1}<br>${effect2}`
    }
  },
  [AntUpgrades.Taxes]: {
    baseCost: new Decimal(1000),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'lightgray'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.taxes.name'),
    intro: () => i18next.t('ants.upgrades.taxes.intro'),
    description: () => i18next.t('ants.upgrades.taxes.description'),
    effect: (n: number) => {
      return {
        taxReduction: 0.005 + 0.995 * Math.pow(0.99, n)
      }
    },
    effectDescription: () => {
      const taxReduction = getAntUpgradeEffect(AntUpgrades.Taxes).taxReduction
      return i18next.t('ants.upgrades.taxes.effect', { x: formatAsPercentIncrease(taxReduction, 4) })
    }
  },
  [AntUpgrades.AcceleratorBoosts]: {
    baseCost: new Decimal(1000),
    costIncrease: 10,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.acceleratorBoosts.name'),
    intro: () => i18next.t('ants.upgrades.acceleratorBoosts.intro'),
    description: () => i18next.t('ants.upgrades.acceleratorBoosts.description'),
    effect: (n: number) => {
      return {
        acceleratorBoostMult: calculateSigmoidExponential(40, n / 1000 * 40 / 39)
      }
    },
    effectDescription: () => {
      const acceleratorBoostMult = getAntUpgradeEffect(AntUpgrades.AcceleratorBoosts).acceleratorBoostMult
      return i18next.t('ants.upgrades.acceleratorBoosts.effect', {
        x: formatAsPercentIncrease(acceleratorBoostMult, 2)
      })
    }
  },
  [AntUpgrades.Multipliers]: {
    baseCost: new Decimal(1e5),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.multipliers.name'),
    intro: () => i18next.t('ants.upgrades.multipliers.intro'),
    description: () => i18next.t('ants.upgrades.multipliers.description'),
    effect: (n: number) => {
      return {
        multiplierMult: calculateSigmoidExponential(40, n / 1000 * 80 / 79)
      }
    },
    effectDescription: () => {
      const multiplierMult = getAntUpgradeEffect(AntUpgrades.Multipliers).multiplierMult
      return i18next.t('ants.upgrades.multipliers.effect', { x: formatAsPercentIncrease(multiplierMult, 2) })
    }
  },
  [AntUpgrades.Offerings]: {
    baseCost: new Decimal(1e6),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'orange'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.offerings.name'),
    intro: () => i18next.t('ants.upgrades.offerings.intro'),
    description: () => i18next.t('ants.upgrades.offerings.description'),
    effect: (n: number) => {
      return {
        offeringMult: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const offeringMult = getAntUpgradeEffect(AntUpgrades.Offerings).offeringMult
      return i18next.t('ants.upgrades.offerings.effect', { x: formatAsPercentIncrease(offeringMult, 2) })
    }
  },
  [AntUpgrades.BuildingCostScale]: {
    baseCost: new Decimal(1e11),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'lime'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.buildingCostScale.name'),
    intro: () => i18next.t('ants.upgrades.buildingCostScale.intro'),
    description: () => i18next.t('ants.upgrades.buildingCostScale.description'),
    effect: (n: number) => {
      const scalePercent = Math.min(9999999, 3 * n)
      return {
        buildingCostScale: scalePercent / 100
      }
    },
    effectDescription: () => {
      const buildingCostScale = getAntUpgradeEffect(AntUpgrades.BuildingCostScale).buildingCostScale
      return i18next.t('ants.upgrades.buildingCostScale.effect', {
        x: formatAsPercentIncrease(1 + buildingCostScale, 0)
      })
    }
  },
  [AntUpgrades.Salvage]: {
    baseCost: new Decimal(1e15),
    costIncrease: 1000,
    antUpgradeHTML: {
      color: 'green'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.salvage.name'),
    intro: () => i18next.t('ants.upgrades.salvage.intro'),
    description: () => i18next.t('ants.upgrades.salvage.description'),
    effect: (n: number) => {
      return {
        salvage: 120 * (1 - Math.pow(0.995, n))
      }
    },
    effectDescription: () => {
      const salvage = getAntUpgradeEffect(AntUpgrades.Salvage).salvage
      return i18next.t('ants.upgrades.salvage.effect', { x: format(salvage, 2) })
    }
  },
  [AntUpgrades.FreeRunes]: {
    baseCost: new Decimal(1e20),
    costIncrease: 1000,
    antUpgradeHTML: {
      color: 'cyan'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.freeRunes.name'),
    intro: () => i18next.t('ants.upgrades.freeRunes.intro'),
    description: () => i18next.t('ants.upgrades.freeRunes.description'),
    effect: (n: number) => {
      return {
        freeRuneLevel: 3000 * (1 - Math.pow(1 - 1 / 3000, n))
      }
    },
    effectDescription: () => {
      const freeRuneLevel = getAntUpgradeEffect(AntUpgrades.FreeRunes).freeRuneLevel
      return i18next.t('ants.upgrades.freeRunes.effect', { x: format(freeRuneLevel, 0, true) })
    }
  },
  [AntUpgrades.Obtainium]: {
    baseCost: new Decimal(1e6),
    costIncrease: 100,
    antUpgradeHTML: {
      color: 'pink'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.obtainium.name'),
    intro: () => i18next.t('ants.upgrades.obtainium.intro'),
    description: () => i18next.t('ants.upgrades.obtainium.description'),
    effect: (n: number) => {
      return {
        obtainiumMult: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const obtainiumMult = getAntUpgradeEffect(AntUpgrades.Obtainium).obtainiumMult
      return i18next.t('ants.upgrades.obtainium.effect', { x: formatAsPercentIncrease(obtainiumMult, 2) })
    }
  },
  [AntUpgrades.AntSacrifice]: {
    baseCost: new Decimal(1e120),
    costIncrease: 1e20,
    antUpgradeHTML: {
      color: 'crimson'
    },
    minimumResetTier: resetTiers.reincarnation,
    name: () => i18next.t('ants.upgrades.antSacrifice.name'),
    intro: () => i18next.t('ants.upgrades.antSacrifice.intro'),
    description: () => i18next.t('ants.upgrades.antSacrifice.description'),
    effect: (n: number) => {
      return {
        antSacrificeMultiplier: Math.pow(1 + n / 10, 0.5)
      }
    },
    effectDescription: () => {
      const antSacrificeMultiplier = getAntUpgradeEffect(AntUpgrades.AntSacrifice).antSacrificeMultiplier
      return i18next.t('ants.upgrades.antSacrifice.effect', { x: formatAsPercentIncrease(antSacrificeMultiplier, 2) })
    }
  },
  [AntUpgrades.Mortuus]: {
    baseCost: new Decimal(1e300),
    costIncrease: 1e100,
    antUpgradeHTML: {
      color: 'gray'
    },
    minimumResetTier: resetTiers.singularity,
    name: () => i18next.t('ants.upgrades.mortuus.name'),
    intro: () => i18next.t('ants.upgrades.mortuus.intro'),
    description: () => i18next.t('ants.upgrades.mortuus.description'),
    effect: (n: number) => {
      return {
        talismanUnlock: n > 0,
        globalSpeed: 2 - Math.pow(0.99, n)
      }
    },
    effectDescription: () => {
      const effects = getAntUpgradeEffect(AntUpgrades.Mortuus)
      const effect1 = i18next.t('ants.upgrades.mortuus.effect', { checkMark: effects.talismanUnlock ? '✔️' : '❌' })
      const effect2 = i18next.t('ants.upgrades.mortuus.effect2', { x: formatAsPercentIncrease(effects.globalSpeed, 2) })
      return `${effect1}<br>${effect2}`
    }
  }
}

export const computeFreeAntUpgradeLevels = () => {
  let bonusLevels = 0
  bonusLevels += CalcECC('reincarnation', player.challengecompletions[9])
  bonusLevels += 2000 * (1 - Math.pow(0.999, player.constantUpgrades[6]))
  bonusLevels += 12 * CalcECC('ascension', player.challengecompletions[11])
  bonusLevels += 4 * player.researches[97]
  bonusLevels += player.researches[102]
  bonusLevels += 2 * player.researches[132]
  bonusLevels += Math.floor((1 / 200) * player.researches[200])
  bonusLevels *= G.challenge15Rewards.bonusAntLevel.value

  if (player.currentChallenge.ascension === 11) {
    bonusLevels += Math.floor(
      (4 * player.challengecompletions[8]
        + 23 * player.challengecompletions[9])
        * Math.max(0, 1 - player.challengecompletions[11] / 10)
    )
    return bonusLevels
  }

  return bonusLevels
}

export const calculateTrueAntLevel = (antUpgrade: AntUpgrades) => {
  const freeLevels = computeFreeAntUpgradeLevels()
  const corruptionDivisor = player.corruptions.used.corruptionEffects('extinction')
  if (player.currentChallenge.ascension === 11) {
    return freeLevels / corruptionDivisor
  } else {
    return (player.ants.upgrades[antUpgrade]
      + Math.min(player.ants.upgrades[antUpgrade], freeLevels)) / corruptionDivisor
  }
}

export const getAntUpgradeEffect = <K extends AntUpgrades>(antUpgrade: K): AntUpgradeTypeMap[K] => {
  const actualLevel = calculateTrueAntLevel(antUpgrade)
  return antUpgrades[antUpgrade].effect(actualLevel)
}

export const getCostNextAntUpgrade = (antUpgrade: AntUpgrades) => {
  const data = antUpgrades[antUpgrade]
  const nextCost = data.baseCost.times(
    Decimal.pow(
      data.costIncrease,
      player.ants.upgrades[antUpgrade]
    )
  )
  const lastCost = player.ants.upgrades[antUpgrade] > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.upgrades[antUpgrade] - 1
      )
    )
    : new Decimal(0)
  return nextCost.sub(lastCost)
}

export const getCostMaxAntUpgrades = (antUpgrade: AntUpgrades) => {
  const maxBuyable = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
  const data = antUpgrades[antUpgrade]

  const spent = player.ants.upgrades[antUpgrade] > 0
    ? Decimal.pow(data.costIncrease, player.ants.upgrades[antUpgrade] - 1).times(data.baseCost)
    : new Decimal(0)

  const maxAntUpgradeCost = Decimal.pow(data.costIncrease, maxBuyable - 1).times(data.baseCost)

  return maxAntUpgradeCost.sub(spent)
}

export const getMaxPurchasableAntUpgrades = (antUpgrade: AntUpgrades, budget: Decimal): number => {
  const data = antUpgrades[antUpgrade]
  const sunkCost = player.ants.upgrades[antUpgrade] > 0
    ? data.baseCost.times(
      Decimal.pow(
        data.costIncrease,
        player.ants.upgrades[antUpgrade] - 1
      )
    )
    : new Decimal(0)
  const realBudget = budget.add(sunkCost)

  return Math.max(0, 1 + Math.floor(Decimal.log(realBudget.div(data.baseCost), data.costIncrease)))
}

export const buyAntUpgrade = (antUpgrade: AntUpgrades, max: boolean) => {
  if (max) {
    const buyTo = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
    if (buyTo <= player.ants.upgrades[antUpgrade]) {
      return
    } else {
      const cost = getCostMaxAntUpgrades(antUpgrade)
      if (player.ants.crumbs.gte(cost)) {
        player.ants.crumbs = player.ants.crumbs.sub(cost)
        player.ants.upgrades[antUpgrade] = buyTo
      }
    }
  } else {
    const cost = getCostNextAntUpgrade(antUpgrade)
    if (player.ants.crumbs.gte(cost)) {
      player.ants.crumbs = player.ants.crumbs.sub(cost)
      player.ants.upgrades[antUpgrade] += 1
    }
  }
}

export const autoBuyAntUpgrades = () => {
  const upgradesUnlocked = +getAchievementReward('antUpgradeAutobuyers')
  for (let upgrade = AntUpgrades.AntSpeed; upgrade < LAST_ANT_UPGRADE; upgrade++) {
    if (upgrade < upgradesUnlocked) {
      buyAntUpgrade(upgrade, player.antMax)
    }
  }

  // The way mortuus autobuy is unlocked is
  // research 6x20. The above loop won't catch it!
  if (player.researches[145] > 0) {
    buyAntUpgrade(AntUpgrades.Mortuus, player.antMax)
  }
}

export const antUpgradeHTML = (antUpgrade: AntUpgrades) => {
  const upgradeData = antUpgrades[antUpgrade]
  const nameHTML = `<span style="font-size: 1.2em;" class="titleTextFont">${upgradeData.name()}</span>`
  const introHTML = `<span class="titleTextFont" style="color: lightgray">${upgradeData.intro()}</span>`

  const freeLevels = computeFreeAntUpgradeLevels()
  const levelHTML = `<span class="crimsonText">${
    i18next.t('ants.level', { x: format(player.ants.upgrades[antUpgrade], 0, true), y: format(freeLevels, 0, true) })
  }</span>`

  let challengeHTML = ''
  if (player.currentChallenge.ascension === 11) {
    challengeHTML = `<br><span style="color: orange">${i18next.t('ants.challenge11Modifier')}</span>`
  }

  let extinctionHTML = ''
  if (player.corruptions.used.extinction > 0) {
    extinctionHTML = `<br><span style="color: #00DDFF">${
      i18next.t('ants.corruptionDivisor', {
        x: format(player.corruptions.used.extinction, 0, true),
        y: format(player.corruptions.used.corruptionEffects('extinction'), 0, true)
      })
    }</span>`
  }
  const effectiveLevelHTML = `<span><b>${
    i18next.t('ants.effectiveLevel', { level: format(calculateTrueAntLevel(antUpgrade), 2, true) })
  }</b></span>`

  const descriptionHTML = `<span>${upgradeData.description()}</span>`

  const effectHTML = `<span style="color: gold">${upgradeData.effectDescription()}</span>`

  let costHTML: string
  const maxBuy = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
  if (player.antMax && maxBuy > player.ants.upgrades[antUpgrade]) {
    const cost = getCostMaxAntUpgrades(antUpgrade)
    costHTML = i18next.t('ants.costMaxLevels', {
      x: format(maxBuy - player.ants.upgrades[antUpgrade], 0, true),
      y: format(cost, 2, true)
    })
  } else {
    const cost = getCostNextAntUpgrade(antUpgrade)
    costHTML = i18next.t('ants.costSingleLevel', { x: format(cost, 2, true) })
  }

  return `${nameHTML}<br>${introHTML}<br><br>${levelHTML}${challengeHTML}${extinctionHTML}<br>${effectiveLevelHTML}<br><br>${descriptionHTML}<br>${effectHTML}<br><br>${costHTML}`
}

export const calculateRebornELOThresholds = (elo?: number) => {
  const rebornELO = elo ?? player.ants.rebornELO
  let thresholds = 0

  thresholds += Math.floor(Math.min(100, rebornELO / 100))
  thresholds += Math.floor(Math.min(100, Math.max(0, (rebornELO - 10_000) / 1000)))
  thresholds += Math.floor(Math.min(100, Math.max(0, (rebornELO - 110_000) / 3000)))
  thresholds += Math.floor(Math.min(700, Math.max(0, (rebornELO - 410_000) / 20000)))
  thresholds += Math.floor(Math.max(0, (rebornELO - 14_410_000) / 100000))
  return thresholds
}

export const thresholdModifiers = () => {
  const thresholds = calculateRebornELOThresholds()
  return {
    rebornSpeedMult: Math.pow(0.99, thresholds),
    antSacrificeObtainiumMult: Math.pow(1.05, thresholds),
    antSacrificeOfferingMult: Math.pow(1.05, thresholds),
    antSacrificeTalismanFragmentMult: Math.pow(1.2, thresholds)
  }
}

export const showSacrifice = () => {
  const sacRewards = calculateAntSacrificeRewards()

  const baseELO = calculateBaseAntELO()
  const effectiveELO = calculateEffectiveAntELO(baseELO)

  const timeMultiplier = offeringObtainiumTimeModifiers(player.antSacrificeTimer, true).reduce(
    (a, b) => a * b.stat(),
    1
  )
  DOMCacheGetOrSet('ELO').innerHTML = i18next.t('ants.yourAntELO', {
    x: format(effectiveELO, 2, true)
  })

  DOMCacheGetOrSet('crumbCountAgain').textContent = i18next.t(
    'ants.galacticCrumbCountThisSacrifice',
    {
      x: format(player.ants.highestCrumbsThisSacrifice, 2, true, undefined, undefined, true)
    }
  )

  DOMCacheGetOrSet('sacrificeUpgradeMultiplier').innerHTML = i18next.t('ants.altarRewardMultiplier', {
    x: format(calculateAntSacrificeMultiplier(), 3, true)
  })

  DOMCacheGetOrSet('sacrificeTimeMultiplier').innerHTML = i18next.t('ants.altarTimeMultiplier', {
    x: format(timeMultiplier, 3, true)
  })

  DOMCacheGetOrSet('immortalELO').innerHTML = i18next.t('ants.immortalELO', {
    x: format(player.ants.immortalELO, 0, true)
  })
  DOMCacheGetOrSet('activatedImmortalELO').innerHTML = i18next.t('ants.activatedImmortalELO', {
    x: format(player.ants.rebornELO, 2, true),
    y: format(calculateAvailableActivatableELO(), 2, true)
  })

  DOMCacheGetOrSet('ELOStage').innerHTML = i18next.t('ants.eloStage', {
    x: format(calculateRebornELOThresholds(), 0, true)
  })

  DOMCacheGetOrSet('immortalELOAntSpeed').innerHTML = i18next.t('ants.immortalELOAntSpeed', {
    x: format(calculateAntSpeedMultFromELO(), 2, true)
  })

  const thresholdMods = thresholdModifiers()

  DOMCacheGetOrSet('immortalELOOfferings').innerHTML = i18next.t('ants.rebornOfferingMult', {
    x: format(thresholdMods.antSacrificeOfferingMult, 2, false)
  })
  DOMCacheGetOrSet('immortalELOObtainium').innerHTML = i18next.t('ants.rebornObtainiumMult', {
    x: format(thresholdMods.antSacrificeObtainiumMult, 2, false)
  })
  DOMCacheGetOrSet('immortalELOTalismanFragments').innerHTML = i18next.t('ants.rebornTalismanShardMult', {
    x: format(thresholdMods.antSacrificeTalismanFragmentMult, 2, false)
  })

  DOMCacheGetOrSet('immortalELOCreationSpeed').innerHTML = i18next.t('ants.rebornELOGainSpeed', {
    x: format(thresholdMods.rebornSpeedMult, 3, true)
  })

  if (player.ants.immortalELO < effectiveELO) {
    DOMCacheGetOrSet('immortalELOGain').innerHTML = i18next.t('ants.immortalELOGain', {
      x: format(sacRewards.antSacrificePoints, 0, true)
    })
  } else {
    DOMCacheGetOrSet('immortalELOGain').innerHTML = i18next.t('ants.immortalELOUntilGain', {
      x: format(player.ants.immortalELO - effectiveELO, 0, true)
    })
  }

  DOMCacheGetOrSet('antSacrificeOffering').textContent = `+${format(sacRewards.offerings)}`
  DOMCacheGetOrSet('antSacrificeObtainium').textContent = `+${format(sacRewards.obtainium)}`

  // ELO requirements for each reward type
  const eloRequirements = {
    talismanShards: 200,
    commonFragments: 400,
    uncommonFragments: 700,
    rareFragments: 1200,
    epicFragments: 2000,
    legendaryFragments: 4000,
    mythicalFragments: 10000
  }

  if (player.challengecompletions[9] > 0) {
    // Helper function to update reward display and styling
    const updateRewardDisplay = (
      elementId: string,
      reward: Decimal,
      requirement: number,
      parentElementClass?: string
    ) => {
      const element = DOMCacheGetOrSet(elementId)
      const parentElement = parentElementClass ? element.closest(`.${parentElementClass}`) : element.parentElement

      if (effectiveELO >= requirement) {
        // Unlocked: show reward amount, remove locked styling
        element.textContent = i18next.t('ants.elo', { x: format(reward) })
        parentElement?.classList.remove('antSacrificeRewardLocked')
        const img = parentElement?.querySelector('img')
        img?.classList.remove('antSacrificeRewardImageLocked')
      } else {
        // Locked: show ELO requirement, add locked styling
        element.textContent = i18next.t('ants.eloRequirement', { x: format(requirement, 0, true) })
        parentElement?.classList.add('antSacrificeRewardLocked')
        const img = parentElement?.querySelector('img')
        img?.classList.add('antSacrificeRewardImageLocked')
      }
    }

    updateRewardDisplay(
      'antSacrificeTalismanShard',
      sacRewards.talismanShards,
      eloRequirements.talismanShards,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeCommonFragment',
      sacRewards.commonFragments,
      eloRequirements.commonFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeUncommonFragment',
      sacRewards.uncommonFragments,
      eloRequirements.uncommonFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeRareFragment',
      sacRewards.rareFragments,
      eloRequirements.rareFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeEpicFragment',
      sacRewards.epicFragments,
      eloRequirements.epicFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeLegendaryFragment',
      sacRewards.legendaryFragments,
      eloRequirements.legendaryFragments,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeMythicalFragment',
      sacRewards.mythicalFragments,
      eloRequirements.mythicalFragments,
      'antSacrificeRewardColumn'
    )
  }
}

export const sacrificeAnts = async (auto = false) => {
  let p = true

  if (player.ants.crumbs.gte('1e70')) {
    if (!auto && player.toggles[32]) {
      p = await Confirm(i18next.t('ants.autoReset'))
    }
    if (p) {
      const antSacrificePointsBefore = player.ants.immortalELO

      const sacRewards = calculateAntSacrificeRewards()
      player.ants.immortalELO += sacRewards.antSacrificePoints
      player.offerings = player.offerings.add(sacRewards.offerings)

      if (player.currentChallenge.ascension !== 14) {
        player.obtainium = player.obtainium.add(sacRewards.obtainium)
      }

      const baseELO = calculateBaseAntELO()
      const effectiveELO = calculateEffectiveAntELO(baseELO)
      const crumbsPerSecond = player.antSacrificeTimer > 0
        ? player.ants.crumbs.div(player.antSacrificeTimer)
        : 0

      const historyEntry: ResetHistoryEntryAntSacrifice = {
        date: Date.now(),
        seconds: player.antSacrificeTimer,
        kind: 'antsacrifice',
        offerings: sacRewards.offerings,
        obtainium: sacRewards.obtainium,
        antSacrificePointsBefore,
        antSacrificePointsAfter: player.ants.immortalELO,
        baseELO: baseELO,
        effectiveELO: effectiveELO,
        crumbs: player.ants.crumbs.toString(),
        crumbsPerSecond: crumbsPerSecond.toString()
      }

      if (player.challengecompletions[9] > 0) {
        player.talismanShards = player.talismanShards.add(sacRewards.talismanShards)
        player.commonFragments = player.commonFragments.add(sacRewards.commonFragments)
        player.uncommonFragments = player.uncommonFragments.add(sacRewards.uncommonFragments)
        player.rareFragments = player.rareFragments.add(sacRewards.rareFragments)
        player.epicFragments = player.epicFragments.add(sacRewards.epicFragments)
        player.legendaryFragments = player.legendaryFragments.add(sacRewards.legendaryFragments)
        player.mythicalFragments = player.mythicalFragments.add(sacRewards.mythicalFragments)
      }
      awardAchievementGroup('sacMult')
      // Now we're safe to reset the ants.
      resetAnts(resetTiers.reincarnation)
      updateTalismanInventory()
      resetHistoryAdd('ants', historyEntry)
    }
  }

  if (player.mythicalFragments.gte(1e11) && player.currentChallenge.ascension === 14) {
    awardUngroupedAchievement('seeingRedNoBlue')
  }
}

export const calculateAvailableActivatableELO = () => {
  const pool = player.ants.immortalELO
  const alreadyActivated = player.ants.rebornELO
  const currentELO = calculateEffectiveAntELO()
  return Math.max(0, Math.min(pool, currentELO) - alreadyActivated)
}

export const activationSpeedMult = () => {
  let multiplier = 1
  if (player.ants.producers[AntProducers.Queens].purchased > 0) {
    multiplier *= 1.15
  }
  if (player.ants.producers[AntProducers.LordRoyals].purchased > 0) {
    multiplier *= 1.25
  }
  if (player.ants.producers[AntProducers.Almighties].purchased > 0) {
    multiplier *= 1.4
  }
  if (player.ants.producers[AntProducers.Disciples].purchased > 0) {
    multiplier *= 2
  }
  if (player.ants.producers[AntProducers.HolySpirit].purchased > 0) {
    multiplier *= 3
  }
  multiplier *= 1 + 0.1 * player.upgrades[124]
  multiplier *= calculateAntELOCubeBlessing()
  multiplier *= +getAchievementReward('antELOMultiplicative')
  multiplier *= 1 + player.researches[110] / 100
  multiplier *= 1 + player.researches[148] / 100
  multiplier *= 1 + player.platonicUpgrades[12] / 10
  multiplier *= getTalismanEffects('mortuus').antBonus
  multiplier *= thresholdModifiers().rebornSpeedMult
  return multiplier
}

export const activateELO = (dt: number) => {
  const toActivate = calculateAvailableActivatableELO()
  if (toActivate > 0) {
    const activationSpeed = dt * activationSpeedMult()
    const decayedGain = toActivate * (1 - Math.pow(0.999, activationSpeed))
    const linearGain = 100 * activationSpeed
    const actualGain = Math.min(decayedGain, linearGain)
    player.ants.rebornELO += actualGain

    // Make it so that *eventually* the ELO is fully activated
    const smallLeak = Math.min(0.001 * activationSpeed, toActivate - actualGain)
    player.ants.rebornELO += smallLeak
  }
  updateAntLeaderboards()
  const quarksToBeGained = availableQuarksFromELO()
  player.worlds.add(quarksToBeGained, false)
  player.ants.quarksGainedFromAnts += quarksToBeGained
}

export const calculateAntSpeedMultFromELO = () => {
  return Decimal.pow(1.02, player.ants.rebornELO)
}

export const quarksFromELOMult = () => {
  const lifetimeTotalELOValue = calculateLeaderboardValue(player.ants.highestRebornELOEver)
  const numStages = calculateRebornELOThresholds(lifetimeTotalELOValue)
  return 2 - Math.pow(0.8, numStages / 100)
}

export const availableQuarksFromELO = () => {
  const totalELOValue = calculateLeaderboardValue(player.ants.highestRebornELODaily)
  const numStages = calculateRebornELOThresholds(totalELOValue)
  let baseQuarks = 0
  baseQuarks += Math.min(100, numStages)
  baseQuarks += 2 * Math.min(100, Math.max(0, numStages - 100))
  baseQuarks += 3 * Math.min(100, Math.max(0, numStages - 200))
  baseQuarks += 4 * Math.min(700, Math.max(0, numStages - 300))
  baseQuarks += 5 * Math.max(0, numStages - 1000)

  const antQuarkMult = quarksFromELOMult()
  return player.worlds.applyBonus(baseQuarks) * antQuarkMult - player.ants.quarksGainedFromAnts
}

let ELOInformation: 'overview' | 'info' = 'overview'

export const toggleRebornELOInfo = () => {
  ELOInformation = ELOInformation === 'overview' ? 'info' : 'overview'
  const info = DOMCacheGetOrSet('immortalELOInfo')
  const overview = DOMCacheGetOrSet('immortalELOOverview')
  const toggleButton = DOMCacheGetOrSet('immortalELOInfoToggleButton')

  if (ELOInformation === 'overview') {
    info.style.display = 'none'
    overview.style.display = 'flex'
  } else {
    info.style.display = 'flex'
    overview.style.display = 'none'
  }

  const mode = ELOInformation === 'overview' ? 'toggleOverview' : 'toggleInfo'
  toggleButton.setAttribute('data-mode', ELOInformation)
  toggleButton.querySelector('span')!.textContent = i18next.t(`ants.compendium.${mode}`)
  toggleButton.querySelector('span')!.setAttribute('i18n', `ants.compendium.${mode}`)
}

/**
 * PART 3: Ant ELO Leaderboard System
 */

const LEADERBOARD_WEIGHTS = [1, 0.7, 0.5, 0.3, 0.2, 0.15, 0.1, 0.05]

export const updateAntLeaderboards = () => {
  const currentELO = player.ants.rebornELO
  const currentSacrificeId = player.ants.currentSacrificeId

  // Update daily leaderboard
  updateSingleLeaderboard(player.ants.highestRebornELODaily, currentELO, currentSacrificeId)

  // Update all-time leaderboard
  updateSingleLeaderboard(player.ants.highestRebornELOEver, currentELO, currentSacrificeId)
}

const updateSingleLeaderboard = (
  leaderboard: Array<{ elo: number; sacrificeId: number }>,
  currentELO: number,
  currentSacrificeId: number
) => {
  // First, check if currentELO suffices (if it does not... no action needed)
  if (leaderboard.length === 8) {
    if (currentELO < leaderboard[leaderboard.length - 1].elo) {
      return
    }
  }

  // Find if current sacrifice is already in the leaderboard
  const existingIndex = leaderboard.findIndex((entry) => entry.sacrificeId === currentSacrificeId)
  if (existingIndex !== -1) {
    // Update existing entry
    leaderboard[existingIndex].elo = currentELO
    if (existingIndex > 0 && leaderboard[existingIndex].elo > leaderboard[existingIndex - 1].elo) {
      // Sort again
      leaderboard.sort((a, b) => b.elo - a.elo)
    }
  } else {
    // Add new entry
    leaderboard.push({ elo: currentELO, sacrificeId: currentSacrificeId })
    leaderboard.sort((a, b) => b.elo - a.elo)
  }

  // Keep only top 8
  if (leaderboard.length > 8) {
    leaderboard.length = 8
  }
}

export const calculateLeaderboardValue = (leaderboard: Array<{ elo: number; sacrificeId: number }>): number => {
  let total = 0
  for (let i = 0; i < Math.min(leaderboard.length, LEADERBOARD_WEIGHTS.length); i++) {
    total += leaderboard[i].elo * LEADERBOARD_WEIGHTS[i]
  }
  return total
}

export const clearDailyLeaderboard = () => {
  player.ants.highestRebornELODaily = []
}

let currentLeaderboardMode: 'daily' | 'allTime' = 'daily'

export const toggleLeaderboardMode = () => {
  currentLeaderboardMode = currentLeaderboardMode === 'daily' ? 'allTime' : 'daily'
  updateLeaderboardUI()
}

export const updateLeaderboardUI = () => {
  const leaderboard = currentLeaderboardMode === 'daily'
    ? player.ants.highestRebornELODaily
    : player.ants.highestRebornELOEver

  // Update toggle button text
  const toggleButton = DOMCacheGetOrSet('antLeaderboardToggle')
  const modeKey = currentLeaderboardMode === 'daily' ? 'toggleDaily' : 'toggleAllTime'
  toggleButton.querySelector('span')!.setAttribute('i18n', `ants.leaderboard.${modeKey}`)
  toggleButton.querySelector('span')!.textContent = i18next.t(`ants.leaderboard.${modeKey}`)
  toggleButton.setAttribute('data-mode', currentLeaderboardMode)

  // Update leaderboard value
  const leaderboardValue = calculateLeaderboardValue(leaderboard)
  DOMCacheGetOrSet('antLeaderboardValueAmount').innerHTML = i18next.t('ants.leaderboard.value', {
    x: format(leaderboardValue, 0, true),
    y: format(calculateRebornELOThresholds(leaderboardValue), 0, true)
  })

  if (currentLeaderboardMode === 'daily') {
    DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').innerHTML = i18next.t('ants.leaderboard.quarksGained', {
      x: format(player.ants.quarksGainedFromAnts, 0, false)
    })
  } else {
    DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').innerHTML = i18next.t('ants.leaderboard.quarkMult', {
      x: formatAsPercentIncrease(quarksFromELOMult(), 2)
    })
  }

  // Update table rows
  const tbody = DOMCacheGetOrSet('antLeaderboardTableBody')
  tbody.innerHTML = ''

  const currentSacrificeId = player.ants.currentSacrificeId

  for (let i = 0; i < leaderboard.length; i++) {
    const entry = leaderboard[i]
    const row = document.createElement('tr')

    // Highlight current ongoing sacrifice
    if (entry.sacrificeId === currentSacrificeId) {
      row.classList.add('antLeaderboardCurrentSacrifice')
    }

    // Rank column
    const rankCell = document.createElement('td')
    rankCell.textContent = `#${i + 1}`
    row.appendChild(rankCell)

    // ELO column
    const eloCell = document.createElement('td')
    eloCell.textContent = format(entry.elo, 0, true)
    row.appendChild(eloCell)

    const stageCell = document.createElement('td')
    stageCell.textContent = format(calculateRebornELOThresholds(entry.elo), 0, true)
    row.appendChild(stageCell)

    const weightCell = document.createElement('td')
    weightCell.textContent = `${LEADERBOARD_WEIGHTS[i]}`
    row.appendChild(weightCell)

    tbody.appendChild(row)
  }
}

/**
 * PART 4: Player Toggles, Automation
 */

export enum AutoSacrifice {
  InGameTime = 0,
  RealTime = 1
}
