import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateCubeMultFromPowder,
  calculateCubeQuarkMultiplier,
  calculatePowderConversion,
  calculateQuarkMultFromPowder,
  forcedDailyReset
} from './Calculate'
import { Cube } from './CubeExperimental'
import { getOcteractUpgradeEffect } from './Octeracts'
import { resetTiers } from './Reset'
import { calculateSingularityDebuff, getGQUpgradeEffect } from './singularity'
import { format, formatAsPercentIncrease, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Confirm, Prompt } from './UpdateHTML'
import { isDecimal } from './Utility'
import { Globals } from './Variables'

type HepteractTypeMap = {
  chronos: { ascensionSpeed: number }
  hyperrealism: { hypercubeMultiplier: number }
  quark: { quarkMultiplier: number }
  challenge: { c15ScoreMultiplier: number }
  abyss: { salvage: number }
  accelerator: { accelerators: number; acceleratorMultiplier: number }
  acceleratorBoost: { acceleratorBoostMultiplier: number }
  multiplier: { multiplier: number; multiplierMultiplier: number }
}

export type HepteractKeys = keyof HepteractTypeMap

export interface HepteractValues {
  BAL: number
  TIMES_CAP_EXTENDED: number
  AUTO: boolean
}

export interface HepteractData<K extends HepteractKeys> extends HepteractValues {
  BASE_CAP: number
  HEPTERACT_CONVERSION: number
  OTHER_CONVERSIONS: Record<string, number>
  UNLOCKED: () => boolean
  EFFECTS: (hept: number) => HepteractTypeMap[K]
  EFFECTSDESCRIPTION: (hept: number) => string
  DESCRIPTION: () => string
  RESET_TIER: keyof typeof resetTiers
  LIMIT: number
  DR: number
  DR_INCREASE: () => number
}

export const defaultHepteractValues: HepteractValues = {
  BAL: 0,
  TIMES_CAP_EXTENDED: 0,
  AUTO: false
}

export const hepteracts: { [K in HepteractKeys]: HepteractData<K> } = {
  chronos: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e4,
    OTHER_CONVERSIONS: { obtainium: 1e115 },
    UNLOCKED: () => true,
    EFFECTS: (hept) => {
      return {
        ascensionSpeed: 1 + 6 * hept / 10000
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.chronos.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.chronos.currentEffect', {
        x: formatAsPercentIncrease(effects.ascensionSpeed, 2)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.chronos.effect'),
    RESET_TIER: 'singularity',
    LIMIT: 1000,
    DR: 1 / 6,
    DR_INCREASE: () => player.platonicUpgrades[19] / 750
  },
  hyperrealism: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e4,
    OTHER_CONVERSIONS: { offerings: 1e80 },
    UNLOCKED: () => true,
    EFFECTS: (hept) => {
      return {
        hypercubeMultiplier: 1 + 6 * hept / 10000
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.hyperrealism.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.hyperrealism.currentEffect', {
        x: formatAsPercentIncrease(effects.hypercubeMultiplier * 6 / 100, 2)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.hyperrealism.effect'),
    RESET_TIER: 'singularity',
    LIMIT: 1000,
    DR: 1 / 3,
    DR_INCREASE: () => 0
  },
  quark: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e4,
    OTHER_CONVERSIONS: { worlds: 100 },
    UNLOCKED: () => true,
    EFFECTS: (hept) => {
      const exponent = hepteracts.quark.DR + hepteracts.quark.DR_INCREASE()
      if (hept <= hepteracts.quark.LIMIT) {
        return {
          quarkMultiplier: Math.pow(1 + 5 * hept / 10000, exponent)
        }
      }
      return {
        quarkMultiplier: Math.pow(1.5 + 0.2 * Math.log2(hept / 1000), exponent)
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.quark.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.quark.currentEffect', {
        x: formatAsPercentIncrease(effects.quarkMultiplier, 2)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.quark.effect'),
    RESET_TIER: 'never',
    LIMIT: 1000,
    DR: 1,
    DR_INCREASE: () => {
      return getGQUpgradeEffect('singQuarkHepteract')
        + getGQUpgradeEffect('singQuarkHepteract2')
        + getGQUpgradeEffect('singQuarkHepteract3')
        + getOcteractUpgradeEffect('octeractImprovedQuarkHept')
        + player.shopUpgrades.improveQuarkHept / 100
        + player.shopUpgrades.improveQuarkHept2 / 100
        + player.shopUpgrades.improveQuarkHept3 / 100
        + player.shopUpgrades.improveQuarkHept4 / 100
        + player.shopUpgrades.improveQuarkHept5 / 100
    }
  },
  challenge: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 5e4,
    OTHER_CONVERSIONS: { wowPlatonicCubes: 1e11, wowCubes: 1e22 },
    UNLOCKED: () => {
      const condition = Globals.challenge15Rewards.challengeHepteractUnlocked.value
      return Boolean(condition)
    },
    EFFECTS: (hept) => {
      return {
        c15ScoreMultiplier: 1 + 5 * hept / 10000
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.challenge.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.challenge.currentEffect', {
        x: formatAsPercentIncrease(effects.c15ScoreMultiplier, 2)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.challenge.effect'),
    RESET_TIER: 'singularity',
    LIMIT: 1000,
    DR: 1 / 6,
    DR_INCREASE: () => 0
  },
  abyss: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1,
    HEPTERACT_CONVERSION: 1e8,
    OTHER_CONVERSIONS: { wowCubes: 69 },
    UNLOCKED: () => {
      const condition = Globals.challenge15Rewards.abyssHepteractUnlocked.value
      return Boolean(condition)
    },
    EFFECTS: (hept) => {
      return {
        salvage: 0.1 * Math.floor(10 * Math.log2(Math.max(1, hept * 2)))
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.abyss.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.abyss.currentEffect', {
        x: format(effects.salvage, 1, true)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.abyss.effect'),
    RESET_TIER: 'singularity',
    LIMIT: 1,
    DR: 1,
    DR_INCREASE: () => 0
  },
  accelerator: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e5,
    OTHER_CONVERSIONS: { wowTesseracts: 1e14 },
    UNLOCKED: () => {
      const condition = Globals.challenge15Rewards.acceleratorHepteractUnlocked.value
      return Boolean(condition)
    },
    EFFECTS: (hept) => {
      return {
        accelerators: 2000 * hept,
        acceleratorMultiplier: 1 + 3 * hept / 10000
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.accelerator.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.accelerator.currentEffect', {
        x: format(effects.accelerators, 0, true),
        y: formatAsPercentIncrease(effects.acceleratorMultiplier * 3 / 100, 2)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.accelerator.effect'),
    RESET_TIER: 'singularity',
    LIMIT: 1000,
    DR: 1 / 5,
    DR_INCREASE: () => 0
  },
  acceleratorBoost: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 2e5,
    OTHER_CONVERSIONS: { wowHypercubes: 1e10 },
    UNLOCKED: () => {
      const condition = Globals.challenge15Rewards.acceleratorBoostHepteractUnlocked.value
      return Boolean(condition)
    },
    EFFECTS: (hept) => {
      return {
        acceleratorBoostMultiplier: 1 + hept / 1000
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.acceleratorBoost.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.acceleratorBoost.currentEffect', {
        x: format(effects.acceleratorBoostMultiplier, 2, true)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.acceleratorBoost.effect'),
    RESET_TIER: 'singularity',
    LIMIT: 1000,
    DR: 1 / 5,
    DR_INCREASE: () => 0
  },
  multiplier: {
    BAL: 0,
    TIMES_CAP_EXTENDED: 0,
    AUTO: false,
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 3e5,
    OTHER_CONVERSIONS: { obtainium: 1e130 },
    UNLOCKED: () => {
      const condition = Globals.challenge15Rewards.multiplierHepteractUnlocked.value
      return Boolean(condition)
    },
    EFFECTS: (hept) => {
      return {
        multiplier: 1000 * hept,
        multiplierMultiplier: 1 + 3 * hept / 10000
      }
    },
    EFFECTSDESCRIPTION: (hept) => {
      const effects = hepteracts.multiplier.EFFECTS(hept)
      return i18next.t('wowCubes.hepteractForge.descriptions.multiplier.currentEffect', {
        x: format(effects.multiplier, 0, true),
        y: formatAsPercentIncrease(effects.multiplierMultiplier * 3 / 100, 2)
      })
    },
    DESCRIPTION: () => i18next.t('wowCubes.hepteractForge.descriptions.multiplier.effect'),
    RESET_TIER: 'singularity',
    LIMIT: 1000,
    DR: 1 / 5,
    DR_INCREASE: () => 0
  }
}

export const hepteractKeys = Object.keys(hepteracts) as HepteractKeys[]

export const getHepteractEffects = <K extends HepteractKeys>(hept: K): HepteractTypeMap[K] => {
  const heptAmount = hepteractEffective(hept)
  return hepteracts[hept].EFFECTS(heptAmount)
}

export const getHepteractCap = (hept: HepteractKeys): number => {
  return Math.pow(2, hepteracts[hept].TIMES_CAP_EXTENDED) * hepteracts[hept].BASE_CAP
}

export const getFinalHepteractCap = (hept: HepteractKeys): number => {
  const specialMultiplier = player.singularityChallenges.limitedAscensions.rewards.hepteractCap ? 2 : 1
  return getHepteractCap(hept) * specialMultiplier
}

export const craftHepteracts = async (hept: HepteractKeys, max = false) => {
  let craftAmount = null
  const heptCap = getFinalHepteractCap(hept)
  const craftCostMulti = calculateSingularityDebuff('Hepteract Costs')
  // If craft is unlocked, we return object
  if (!hepteracts[hept].UNLOCKED()) {
    return Alert(i18next.t('hepteracts.notUnlocked'))
  }

  if (heptCap - hepteracts[hept].BAL <= 0) {
    if (player.toggles[35]) {
      return Alert(i18next.t('hepteracts.reachedCapacity', { x: format(heptCap, 0, true) }))
    }
  }

  if (isNaN(player.wowAbyssals) || !isFinite(player.wowAbyssals) || player.wowAbyssals < 0) {
    player.wowAbyssals = 0
  }

  // Calculate the largest craft amount possible, with an upper limit being craftAmount
  const hepteractLimit = Math.floor(
    player.wowAbyssals / (hepteracts[hept].HEPTERACT_CONVERSION * craftCostMulti)
  )

  // Create an array of how many we can craft using our conversion limits for additional items
  const itemLimits: number[] = []
  for (const item in hepteracts[hept].OTHER_CONVERSIONS) {
    const indexableItem = item as keyof Player
    // The type of player[item] is number | Decimal | Cube.
    if (item === 'worlds') {
      itemLimits.push(
        Math.floor((player[indexableItem] as number) / (hepteracts[hept].OTHER_CONVERSIONS[indexableItem] ?? 1))
      )
    } else if (isDecimal(player[indexableItem])) {
      itemLimits.push(
        Decimal.min(
          Decimal.floor(
            (player[indexableItem] as Decimal).div(craftCostMulti * hepteracts[hept].OTHER_CONVERSIONS[indexableItem]!)
          ),
          1e300
        ).toNumber()
      )
    } else {
      itemLimits.push(
        Math.floor((player[indexableItem] as number) / (hepteracts[hept].OTHER_CONVERSIONS[indexableItem] ?? 1))
      )
    }
  }

  // Get the smallest of the array we created
  const smallestItemLimit = Math.min(...itemLimits)

  let amountToCraft = Math.min(smallestItemLimit, hepteractLimit, heptCap, heptCap - hepteracts[hept].BAL)

  // Return if the material is not a calculable number
  if (isNaN(amountToCraft) || !isFinite(amountToCraft)) {
    return Alert(i18next.t('hepteracts.executionFailed'))
  }

  // Prompt used here. Thank you Khafra for the already made code! -Platonic
  if (!max) {
    const craftingPrompt = await Prompt(i18next.t('hepteracts.craft', {
      x: format(amountToCraft, 0, true),
      y: Math.floor(amountToCraft / heptCap * 10000) / 100
    }))

    if (craftingPrompt === null) { // Number(null) is 0. Yeah..
      if (player.toggles[35]) {
        return Alert(i18next.t('hepteracts.cancelled'))
      } else {
        return // If no return, then it will just give another message
      }
    }
    craftAmount = Number(craftingPrompt)
  } else {
    craftAmount = heptCap
  }

  // Check these lol
  if (isNaN(craftAmount) || !isFinite(craftAmount) || !Number.isInteger(craftAmount)) { // nan + Infinity checks
    return Alert(i18next.t('general.validation.finite'))
  } else if (craftAmount <= 0) { // 0 or less selected
    return Alert(i18next.t('general.validation.zeroOrLess'))
  }

  // Get the smallest of hepteract limit, limit found above and specified input
  amountToCraft = Math.min(smallestItemLimit, hepteractLimit, craftAmount, heptCap - hepteracts[hept].BAL)

  if (max && player.toggles[35]) {
    const craftYesPlz = await Confirm(i18next.t('hepteracts.craftMax', {
      x: format(amountToCraft, 0, true),
      y: Math.floor(amountToCraft / heptCap * 10000) / 100
    }))

    if (!craftYesPlz) {
      return Alert(i18next.t('hepteracts.cancelled'))
    }
  }

  hepteracts[hept].BAL = Math.min(heptCap, hepteracts[hept].BAL + amountToCraft)

  // Subtract spent items from player
  player.wowAbyssals -= amountToCraft * hepteracts[hept].HEPTERACT_CONVERSION * craftCostMulti

  if (player.wowAbyssals < 0) {
    player.wowAbyssals = 0
  }

  for (const item of (Object.keys(hepteracts[hept].OTHER_CONVERSIONS) as (keyof Player)[])) {
    if (typeof player[item] === 'number') {
      ;(player[item] as number) -= amountToCraft * craftCostMulti
        * hepteracts[hept].OTHER_CONVERSIONS[item]!
    }

    if ((player[item] as number) < 0) {
      ;(player[item] as number) = 0
    } else if (player[item] instanceof Cube) {
      ;(player[item] as Cube).sub(
        amountToCraft * craftCostMulti * hepteracts[hept].OTHER_CONVERSIONS[item]!
      )
    } else if (item === 'worlds') {
      player.worlds.sub(amountToCraft * hepteracts[hept].OTHER_CONVERSIONS[item]!)
    } else if (player[item] instanceof Decimal) {
      ;(player[item] as Decimal).sub(
        new Decimal(amountToCraft).times(craftCostMulti).times(hepteracts[hept].OTHER_CONVERSIONS[item]!)
      )
    }
  }

  if (player.toggles[35]) {
    if (!max) {
      return Alert(i18next.t('hepteracts.craftedHepteracts', { x: format(amountToCraft, 0, true) }))
    }

    return Alert(i18next.t('hepteracts.craftedHepteractsMax', { x: format(amountToCraft, 0, true) }))
  }
}

export const expandHepteracts = async (hept: HepteractKeys) => {
  const expandMultiplier = 2
  const currentBalance = hepteracts[hept].BAL
  const heptCap = getFinalHepteractCap(hept)
  const currHeptCapNoMulti = getHepteractCap(hept)

  if (!hepteracts[hept].UNLOCKED()) {
    return Alert(i18next.t('hepteracts.notUnlocked'))
  }

  // Below capacity
  if (currentBalance < currHeptCapNoMulti) {
    if (player.toggles[35]) {
      return Alert(i18next.t('hepteracts.notEnough'))
    } else {
      return
    }
  }

  const expandPrompt = await Confirm(i18next.t('hepteracts.expandPrompt', {
    x: format(currHeptCapNoMulti),
    y: format(heptCap),
    z: format(heptCap * expandMultiplier),
    a: format(expandMultiplier, 2, true)
  }))

  if (!expandPrompt) {
    return
  }

  // Avoid a double-expand exploit due to player waiting to confirm until after autocraft fires and expands
  if (hepteracts[hept].BAL !== currentBalance) {
    if (player.toggles[35]) {
      return Alert(i18next.t('hepteracts.doubleSpent'))
    } else {
      return
    }
  }

  // Empties inventory in exchange for doubling maximum capacity.
  hepteracts[hept].BAL -= currHeptCapNoMulti
  hepteracts[hept].BAL = Math.max(0, hepteracts[hept].BAL)

  hepteracts[hept].TIMES_CAP_EXTENDED += 1

  if (player.toggles[35]) {
    return Alert(i18next.t('hepteracts.expandedInventory', {
      x: format(heptCap * expandMultiplier, 0, true)
    }))
  }
}

export const autoCraftHepteracts = (hept: HepteractKeys, heptAmount: number) => {
  const craftCostMulti = calculateSingularityDebuff('Hepteract Costs')
  let baseCap = getHepteractCap(hept)
  let heptCap = getFinalHepteractCap(hept)

  // Calculate the largest craft amount possible, with an upper limit being craftAmount
  const hepteractLimitCraft = Math.floor(
    heptAmount / (craftCostMulti * hepteracts[hept].HEPTERACT_CONVERSION)
  )

  // Create an array of how many we can craft using our conversion limits for additional items
  const itemLimits: number[] = []
  const quarks = hepteracts[hept].OTHER_CONVERSIONS.worlds

  if (typeof quarks === 'number') {
    // When Auto is turned on, only Quarks and hepteracts are consumed.
    itemLimits.push(
      Math.floor(player.worlds.valueOf() / quarks)
    )
  }

  // Get the smallest of the array we created [If Empty, this will be infinite]
  const smallestItemLimit = Math.min(...itemLimits)

  let amountToCraft = Math.min(smallestItemLimit, hepteractLimitCraft)
  let amountCrafted = 0

  let craft = Math.min(heptCap - hepteracts[hept].BAL, amountToCraft) // Always nonzero
  hepteracts[hept].BAL += craft
  amountCrafted += craft
  amountToCraft -= craft

  while (hepteracts[hept].BAL >= heptCap && amountToCraft >= baseCap) {
    hepteracts[hept].BAL -= baseCap
    hepteracts[hept].TIMES_CAP_EXTENDED += 1

    heptCap *= 2
    baseCap *= 2

    craft = Math.min(heptCap - hepteracts[hept].BAL, amountToCraft)

    hepteracts[hept].BAL += craft
    amountCrafted += craft
    amountToCraft -= craft
  }

  if (typeof quarks === 'number') {
    player.worlds.sub(amountCrafted * quarks)
  }

  player.wowAbyssals -= amountCrafted * craftCostMulti * hepteracts[hept].HEPTERACT_CONVERSION
  if (player.wowAbyssals < 0) {
    player.wowAbyssals = 0
  }
}

export const setAutomaticHepteractTexts = () => {
  for (const hept of hepteractKeys) {
    const HTML = DOMCacheGetOrSet(`${hept}HepteractAuto`)
    hepteracts[hept].AUTO = player.hepteracts[hept].AUTO ?? hepteracts[hept].AUTO

    HTML.textContent = hepteracts[hept].AUTO ? i18next.t('general.autoOnColon') : i18next.t('general.autoOffColon')
    HTML.style.border = `2px solid ${hepteracts[hept].AUTO ? 'green' : 'red'}`
  }
}

export const toggleAutomaticHepteracts = (hept: HepteractKeys, newValue?: boolean) => {
  const HTML = DOMCacheGetOrSet(`${hept}HepteractAuto`)

  // When newValue is empty, current value is toggled
  hepteracts[hept].AUTO = newValue ?? !hepteracts[hept].AUTO

  HTML.textContent = hepteracts[hept].AUTO ? i18next.t('general.autoOnColon') : i18next.t('general.autoOffColon')
  HTML.style.border = `2px solid ${hepteracts[hept].AUTO ? 'green' : 'red'}`
}

export const resetHepteracts = (tier: keyof typeof resetTiers) => {
  for (const key of hepteractKeys) {
    if (resetTiers[tier] >= resetTiers[hepteracts[key].RESET_TIER]) {
      hepteracts[key].BAL = 0
      hepteracts[key].TIMES_CAP_EXTENDED = 0

      player.hepteracts[key] = {
        BAL: 0,
        TIMES_CAP_EXTENDED: 0,
        AUTO: hepteracts[key].AUTO
      }
    }
  }
}

export const hepteractEffective = (hept: HepteractKeys) => {
  // Quark Hept now uses a custom (nonpolynomial) formula, so just return val
  if (hept === 'quark') {
    return hepteracts[hept].BAL
  }

  const rawHeptAmount = hepteracts[hept].BAL
  let effectiveValue = Math.min(rawHeptAmount, hepteracts[hept].LIMIT)
  const exponent = hepteracts[hept].DR + hepteracts[hept].DR_INCREASE()

  // Save in case I go back to this - Platonic
  /*
  if (hept === 'quark') {
    if (1000 < rawHeptAmount && rawHeptAmount <= 1000 * Math.pow(2, 10)) {
      return effectiveValue * Math.pow(rawHeptAmount / 1000, exponent)
    } else if (1000 * Math.pow(2, 10) < rawHeptAmount && rawHeptAmount <= 1000 * Math.pow(2, 18)) {
      return effectiveValue * Math.pow(Math.pow(2, 10), exponent)
        * Math.pow(rawHeptAmount / (1000 * Math.pow(2, 10)), exponent / 2)
    } else if (1000 * Math.pow(2, 18) < rawHeptAmount && rawHeptAmount <= 1000 * Math.pow(2, 44)) {
      return effectiveValue * Math.pow(Math.pow(2, 10), exponent)
        * Math.pow(Math.pow(2, 8), exponent / 2)
        * Math.pow(rawHeptAmount / (1000 * Math.pow(2, 18)), exponent / 3)
    } else if (1000 * Math.pow(2, 44) < rawHeptAmount) {
      return effectiveValue * Math.pow(Math.pow(2, 10), exponent)
        * Math.pow(Math.pow(2, 8), exponent / 2)
        * Math.pow(Math.pow(2, 26), exponent / 3)
        * Math.pow(rawHeptAmount / (1000 * Math.pow(2, 44)), exponent / 6)
    }
  }*/

  if (rawHeptAmount > hepteracts[hept].LIMIT) {
    effectiveValue *= Math.pow(
      rawHeptAmount / hepteracts[hept].LIMIT,
      exponent
    )
  }

  return effectiveValue
}

export const hepteractDescriptions = (hept: HepteractKeys) => {
  DOMCacheGetOrSet('hepteractUnlockedText').style.display = 'block'
  DOMCacheGetOrSet('hepteractCurrentEffectText').style.display = 'block'
  DOMCacheGetOrSet('hepteractBalanceText').style.display = 'block'
  DOMCacheGetOrSet('powderDayWarpText').style.display = 'none'
  DOMCacheGetOrSet('hepteractCostText').style.display = 'block'

  const unlockedText = DOMCacheGetOrSet('hepteractUnlockedText')
  const effectText = DOMCacheGetOrSet('hepteractEffectText')
  const currentEffectText = DOMCacheGetOrSet('hepteractCurrentEffectText')
  const balanceText = DOMCacheGetOrSet('hepteractBalanceText')
  const costText = DOMCacheGetOrSet('hepteractCostText')
  const bonusCapacityText = DOMCacheGetOrSet('hepteractBonusCapacity')
  const craftCostMulti = calculateSingularityDebuff('Hepteract Costs')

  const multiplier = getHepteractCap(hept) / getFinalHepteractCap(hept)
  bonusCapacityText.innerHTML = (multiplier > 1)
    ? i18next.t('wowCubes.hepteractForge.multiplierText', {
      multiplier: format(multiplier, 0, true)
    })
    : ''

  const currentEffectRecord = hepteracts[hept].EFFECTSDESCRIPTION(hepteractEffective(hept))
  let oneCost!: string | Record<string, string>

  switch (hept) {
    case 'chronos':
      oneCost = format(1e115 * craftCostMulti, 0, false)

      break
    case 'hyperrealism':
      oneCost = format(1e80 * craftCostMulti, 0, true)
      break
    case 'quark':
      oneCost = '100'
      break
    case 'challenge':
      oneCost = {
        y: format(1e11 * craftCostMulti),
        z: format(1e22 * craftCostMulti)
      }
      break
    case 'abyss':
      oneCost = format(69 * craftCostMulti)
      break
    case 'accelerator':
      oneCost = format(1e14 * craftCostMulti)
      break
    case 'acceleratorBoost':
      oneCost = format(1e10 * craftCostMulti)
      break
    case 'multiplier':
      oneCost = format(1e130 * craftCostMulti)
      break
  }

  effectText.textContent = i18next.t(`wowCubes.hepteractForge.descriptions.${hept}.effect`)
  currentEffectText.innerHTML = currentEffectRecord

  balanceText.textContent = i18next.t('wowCubes.hepteractForge.inventory', {
    x: format(hepteracts[hept].BAL, 0, true),
    y: format(getFinalHepteractCap(hept), 0, true)
  })
  const record = typeof oneCost === 'string' ? { y: oneCost } : oneCost
  costText.textContent = i18next.t(`wowCubes.hepteractForge.descriptions.${hept}.oneCost`, {
    x: format(hepteracts[hept].HEPTERACT_CONVERSION * craftCostMulti, 0, true),
    ...record
  })

  unlockedText.textContent = hepteracts[hept].UNLOCKED()
    ? i18next.t('wowCubes.hepteractForge.unlocked')
    : i18next.t('wowCubes.hepteractForge.locked')
}

/**
 * Generates the description at the bottom of the page for Overflux Orb crafting
 */
export const hepteractToOverfluxOrbDescription = () => {
  DOMCacheGetOrSet('hepteractUnlockedText').style.display = 'none'
  DOMCacheGetOrSet('powderDayWarpText').style.display = 'none'
  DOMCacheGetOrSet('hepteractCostText').style.display = 'block'

  DOMCacheGetOrSet('hepteractCurrentEffectText').textContent = i18next.t('hepteracts.orbEffect', {
    x: format(100 * (-1 + calculateCubeQuarkMultiplier()), 2, true)
  })
  DOMCacheGetOrSet('hepteractBalanceText').textContent = i18next.t('hepteracts.orbsPurchasedToday', {
    x: format(player.overfluxOrbs, 0, true)
  })
  DOMCacheGetOrSet('hepteractEffectText').textContent = i18next.t('hepteracts.amalgamate')
  DOMCacheGetOrSet('hepteractCostText').textContent = i18next.t('hepteracts.cost250k')
}

/**
 * Trades Hepteracts for Overflux Orbs at 250,000 : 1 ratio. If null or invalid will gracefully terminate.
 * @returns Alert of either purchase failure or success
 */
export const tradeHepteractToOverfluxOrb = async (buyMax?: boolean) => {
  const maxBuy = Math.floor(player.wowAbyssals / 250000)
  let toUse: number

  if (buyMax) {
    if (player.toggles[35]) {
      const craftYesPlz = await Confirm(i18next.t('hepteracts.craftMaxOrbs', { x: format(maxBuy, 0, true) }))
      if (!craftYesPlz) {
        return Alert(i18next.t('hepteracts.cancelled'))
      }
    }
    toUse = maxBuy
  } else {
    const hepteractInput = await Prompt(i18next.t('hepteracts.hepteractInput', { x: format(maxBuy, 0, true) }))
    if (hepteractInput === null) {
      if (player.toggles[35]) {
        return Alert(i18next.t('hepteracts.cancelled'))
      } else {
        return
      }
    }

    toUse = Number(hepteractInput)
    if (
      isNaN(toUse)
      || !isFinite(toUse)
      || !Number.isInteger(toUse)
      || toUse <= 0
    ) {
      return Alert(i18next.t('general.validation.invalidNumber'))
    }
  }

  const buyAmount = Math.min(maxBuy, Math.floor(toUse))
  const beforeEffect = calculateCubeQuarkMultiplier()
  player.overfluxOrbs += buyAmount
  player.wowAbyssals -= 250000 * buyAmount
  const afterEffect = calculateCubeQuarkMultiplier()

  if (player.wowAbyssals < 0) {
    player.wowAbyssals = 0
  }

  const powderGain = player.shopUpgrades.powderAuto * calculatePowderConversion() * buyAmount / 100
  player.overfluxPowder += powderGain

  const powderText = (powderGain > 0) ? i18next.t('hepteracts.gainedPowder', { x: format(powderGain, 2, true) }) : ''
  if (player.toggles[35]) {
    return Alert(i18next.t('hepteracts.purchasedOrbs', {
      x: format(buyAmount, 0, true),
      y: format(100 * (afterEffect - beforeEffect), 2, true),
      z: powderText
    }))
  }
}

export const toggleAutoBuyOrbs = (newValue?: boolean, firstLoad = false) => {
  const HTML = DOMCacheGetOrSet('hepteractToQuarkTradeAuto')

  if (!firstLoad) {
    // When newValue is empty, current value is toggled
    player.overfluxOrbsAutoBuy = newValue ?? !player.overfluxOrbsAutoBuy
  }

  HTML.textContent = player.overfluxOrbsAutoBuy ? i18next.t('general.autoOnColon') : i18next.t('general.autoOffColon')
  HTML.style.border = `2px solid ${player.overfluxOrbsAutoBuy ? 'green' : 'red'}`
}

/**
 * Generates the description at the bottom of the page for Overflux Powder Properties
 */
export const overfluxPowderDescription = () => {
  let powderEffectText: string
  if (player.platonicUpgrades[16] > 0) {
    powderEffectText = i18next.t('hepteracts.allCubeGainExtended', {
      x: format(100 * (calculateCubeMultFromPowder() - 1), 2, true),
      y: format(100 * (calculateQuarkMultFromPowder() - 1), 3, true),
      z: format(2 * player.platonicUpgrades[16] * Math.min(1, player.overfluxPowder / 1e5), 2, true),
      a: format(Decimal.pow(player.overfluxPowder + 1, 10 * player.platonicUpgrades[16]))
    })
  } else {
    powderEffectText = i18next.t('hepteracts.allCubeGain', {
      x: format(100 * (calculateCubeMultFromPowder() - 1), 2, true),
      y: format(100 * (calculateQuarkMultFromPowder() - 1), 3, true)
    })
  }
  DOMCacheGetOrSet('hepteractUnlockedText').style.display = 'none'
  DOMCacheGetOrSet('hepteractCurrentEffectText').textContent = i18next.t('hepteracts.powderEffect', {
    x: powderEffectText
  })
  DOMCacheGetOrSet('hepteractBalanceText').textContent = i18next.t('hepteracts.powderLumps', {
    x: format(player.overfluxPowder, 2, true)
  })
  DOMCacheGetOrSet('hepteractEffectText').textContent = i18next.t('hepteracts.expiredOrbs', {
    x: format(1 / calculatePowderConversion(), 1, true)
  })
  DOMCacheGetOrSet('hepteractCostText').style.display = 'none'

  DOMCacheGetOrSet('powderDayWarpText').style.display = 'block'
  DOMCacheGetOrSet('powderDayWarpText').textContent = i18next.t('hepteracts.dayWarpsRemaining', {
    x: player.dailyPowderResetUses
  })
}

/**
 * Attempts to operate a 'Day Reset' which, if successful, resets Daily Cube counters for the player.
 * Note by Platonic: kinda rushed job but idk if it can be improved.
 * @returns Alert, either for success or failure of warping
 */
export const overfluxPowderWarp = async (auto: boolean) => {
  if (!auto) {
    if (player.autoWarpCheck) {
      return Alert(i18next.t('hepteracts.warpImpossible'))
    }
    if (player.dailyPowderResetUses <= 0) {
      return Alert(i18next.t('hepteracts.machineCooldown'))
    }
    if (player.overfluxPowder < 25) {
      return Alert(i18next.t('hepteracts.atleastPowder'))
    }
    const c = await Confirm(i18next.t('hepteracts.stumbleMachine'))
    if (!c) {
      if (player.toggles[35]) {
        return Alert(i18next.t('hepteracts.walkAwayMachine'))
      }
    } else {
      player.overfluxPowder -= 25
      player.dailyPowderResetUses -= 1
      forcedDailyReset()
      if (player.toggles[35]) {
        return Alert(i18next.t('hepteracts.useMachine'))
      }
    }
  } else {
    if (player.autoWarpCheck) {
      const a = await Confirm(i18next.t('hepteracts.useAllWarpsPrompt'))
      if (a) {
        DOMCacheGetOrSet('warpAuto').textContent = i18next.t('general.autoOffColon')
        DOMCacheGetOrSet('warpAuto').style.border = '2px solid red'
        player.autoWarpCheck = false
        player.dailyPowderResetUses = 0
        return Alert(i18next.t('hepteracts.machineCooldown'))
      } else {
        if (player.toggles[35]) {
          return Alert(i18next.t('hepteracts.machineDidNotConsume'))
        }
      }
    } else {
      const a = await Confirm(i18next.t('hepteracts.boostQuarksPrompt'))
      if (a) {
        DOMCacheGetOrSet('warpAuto').textContent = i18next.t('general.autoOnColon')
        DOMCacheGetOrSet('warpAuto').style.border = '2px solid green'
        player.autoWarpCheck = true
        if (player.dailyPowderResetUses === 0) {
          return Alert(i18next.t('hepteracts.machineOverdrive'))
        }
        return Alert(i18next.t('hepteracts.machineInOverdrive'))
      } else {
        if (player.toggles[35]) {
          return Alert(i18next.t('hepteracts.machineUsualContinue'))
        }
      }
    }
  }
}
