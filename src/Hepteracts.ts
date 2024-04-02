import Decimal from 'break_infinity.js'
import type { StringMap } from 'i18next'
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
import { calculateSingularityDebuff } from './singularity'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Confirm, Prompt } from './UpdateHTML'

export interface IHepteractCraft {
  BASE_CAP: number
  HEPTERACT_CONVERSION: number
  OTHER_CONVERSIONS: Record<string, number>
  HTML_STRING: string
  AUTO?: boolean
  UNLOCKED?: boolean
  BAL?: number
  CAP?: number
  DISCOUNT?: number
}

export const hepteractTypeList = [
  'chronos',
  'hyperrealism',
  'quark',
  'challenge',
  'abyss',
  'accelerator',
  'acceleratorBoost',
  'multiplier'
] as const

export type hepteractTypes = typeof hepteractTypeList[number]

export class HepteractCraft {
  /**
   * Craft is unlocked or not (Default is locked)
   */
  UNLOCKED = false

  /**
   * Current Inventory (amount) of craft you possess
   */
  BAL = 0

  /**
   * Maximum Inventory (amount) of craft you can hold
   * base_cap is the smallest capacity for such item.
   */
  CAP = 0
  BASE_CAP = 0

  /**
   * Conversion rate of hepteract to synthesized items
   */
  HEPTERACT_CONVERSION = 0

  /**
   * Automatic crafting toggle. If on, allows crafting to be done automatically upon ascension.
   */
  AUTO = false

  /**
   * Conversion rate of additional items
   * This is in the form of keys being player variables,
   * values being the amount player has.
   */
  OTHER_CONVERSIONS: {
    [key in keyof Player]?: number
  }

  /**
   * Discount Factor (number from [0, 1))
   */
  DISCOUNT = 0

  /**
   * String Prefix used for HTML DOM manipulation
   */
  HTML_STRING: string

  constructor (data: IHepteractCraft) {
    this.BASE_CAP = data.BASE_CAP
    this.HEPTERACT_CONVERSION = data.HEPTERACT_CONVERSION
    this.OTHER_CONVERSIONS = data.OTHER_CONVERSIONS
    this.HTML_STRING = data.HTML_STRING
    this.UNLOCKED = data.UNLOCKED ?? false // This would basically always be true if this parameter is provided
    this.BAL = data.BAL ?? 0
    this.CAP = data.CAP ?? this.BASE_CAP // This sets cap either as previous value or keeps it to default.
    this.DISCOUNT = data.DISCOUNT ?? 0
    this.AUTO = data.AUTO ?? false

    void this.toggleAutomatic(this.AUTO)
  }

  // Unlock a synthesizer craft
  unlock = (hepteractName: string): this | Promise<void> => {
    if (this.UNLOCKED) {
      return this
    }
    this.UNLOCKED = true
    if (player.highestSingularityCount < 5) {
      return Alert(i18next.t('hepteracts.unlockedCraft', { x: hepteractName }))
    } else {
      return this
    }
  }

  computeActualCap = (): number => {
    let multiplier = 1
    multiplier *= (player.singularityChallenges.limitedAscensions.rewards.hepteractCap) ? 2 : 1

    return this.CAP * multiplier
  }

  // Add to balance through crafting.
  craft = async (max = false): Promise<HepteractCraft | void> => {
    let craftAmount = null
    const heptCap = this.computeActualCap()
    const craftCostMulti = calculateSingularityDebuff('Hepteract Costs')
    // If craft is unlocked, we return object
    if (!this.UNLOCKED) {
      return Alert(i18next.t('hepteracts.notUnlocked'))
    }

    if (heptCap - this.BAL <= 0) {
      if (player.toggles[35]) {
        return Alert(i18next.t('hepteracts.reachedCapacity', { x: format(heptCap, 0, true) }))
      }
    }

    if (isNaN(player.wowAbyssals) || !isFinite(player.wowAbyssals) || player.wowAbyssals < 0) {
      player.wowAbyssals = 0
    }

    // Calculate the largest craft amount possible, with an upper limit being craftAmount
    const hepteractLimit = Math.floor(
      (player.wowAbyssals / (this.HEPTERACT_CONVERSION * craftCostMulti)) * 1 / (1 - this.DISCOUNT)
    )

    // Create an array of how many we can craft using our conversion limits for additional items
    const itemLimits: number[] = []
    for (const item in this.OTHER_CONVERSIONS) {
      // The type of player[item] is number | Decimal | Cube.
      if (item === 'worlds') {
        itemLimits.push(
          Math.floor((player[item as keyof Player] as number) / (this.OTHER_CONVERSIONS[item as keyof Player] ?? 1)) * 1
            / (1 - this.DISCOUNT)
        )
      } else {
        itemLimits.push(
          Math.floor(
            (player[item as keyof Player] as number) / (craftCostMulti * this.OTHER_CONVERSIONS[item as keyof Player]!)
          ) * 1 / (1 - this.DISCOUNT)
        )
      }
    }

    // Get the smallest of the array we created
    const smallestItemLimit = Math.min(...itemLimits)

    let amountToCraft = Math.min(smallestItemLimit, hepteractLimit, heptCap, heptCap - this.BAL)

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
    amountToCraft = Math.min(smallestItemLimit, hepteractLimit, craftAmount, heptCap - this.BAL)

    if (max && player.toggles[35]) {
      const craftYesPlz = await Confirm(i18next.t('hepteracts.craftMax', {
        x: format(amountToCraft, 0, true),
        y: Math.floor(amountToCraft / heptCap * 10000) / 100
      }))

      if (!craftYesPlz) {
        return Alert(i18next.t('hepteracts.cancelled'))
      }
    }

    this.BAL = Math.min(heptCap, this.BAL + amountToCraft)

    // Subtract spent items from player
    player.wowAbyssals -= amountToCraft * this.HEPTERACT_CONVERSION * craftCostMulti

    if (player.wowAbyssals < 0) {
      player.wowAbyssals = 0
    }

    for (const item of (Object.keys(this.OTHER_CONVERSIONS) as (keyof Player)[])) {
      if (typeof player[item] === 'number') {
        ;(player[item] as number) -= amountToCraft * craftCostMulti
          * this.OTHER_CONVERSIONS[item]!
      }

      if ((player[item] as number) < 0) {
        ;(player[item] as number) = 0
      } else if (player[item] instanceof Cube) {
        ;(player[item] as Cube).sub(
          amountToCraft * craftCostMulti * this.OTHER_CONVERSIONS[item]!
        )
      } else if (item === 'worlds') {
        player.worlds.sub(amountToCraft * this.OTHER_CONVERSIONS[item]!)
      }
    }

    if (player.toggles[35]) {
      if (!max) {
        return Alert(i18next.t('hepteracts.craftedHepteracts', { x: format(amountToCraft, 0, true) }))
      }

      return Alert(i18next.t('hepteracts.craftedHepteractsMax', { x: format(amountToCraft, 0, true) }))
    }
  }

  // Reduce balance through spending
  spend (amount: number): this {
    if (!this.UNLOCKED) {
      return this
    }

    this.BAL -= amount
    return this
  }

  // Expand your capacity
  /**
   * Expansion can only happen if your current balance is full.
   */
  expand = async (): Promise<HepteractCraft | void> => {
    const expandMultiplier = 2
    const currentBalance = this.BAL
    const heptCap = this.computeActualCap()
    const currHeptCapNoMulti = this.CAP

    if (!this.UNLOCKED) {
      return Alert(i18next.t('hepteracts.notUnlocked'))
    }

    // Below capacity
    if (this.BAL < this.CAP) {
      if (player.toggles[35]) {
        return Alert(i18next.t('hepteracts.notEnough'))
      } else {
        return
      }
    }

    const expandPrompt = await Confirm(i18next.t('hepteracts.expandPrompt', {
      x: format(this.CAP),
      y: format(heptCap),
      z: format(heptCap * expandMultiplier),
      a: format(expandMultiplier, 2, true)
    }))

    if (!expandPrompt) {
      return this
    }

    // Avoid a double-expand exploit due to player waiting to confirm until after autocraft fires and expands
    if (this.BAL !== currentBalance || this.CAP !== currHeptCapNoMulti) {
      if (player.toggles[35]) {
        return Alert(i18next.t('hepteracts.doubleSpent'))
      } else {
        return
      }
    }

    // Empties inventory in exchange for doubling maximum capacity.
    this.BAL -= this.CAP
    this.BAL = Math.max(0, this.BAL)

    this.CAP = Math.min(1e300, this.CAP * expandMultiplier)

    if (player.toggles[35]) {
      return Alert(i18next.t('hepteracts.expandedInventory', {
        x: format(heptCap * expandMultiplier, 0, true)
      }))
    }
  }

  // Add some percentage points to your discount
  /**
   * Discount has boundaries [0, 1), and upper limit
   *  is defined by (1 - EPSILON). Craft amount is multiplied by 1 / (1 - Discount)
   */
  addDiscount (amount: number): this {
    // If amount would put Discount to 1 or higher set to upper limit
    if (this.DISCOUNT + amount > (1 - Number.EPSILON)) {
      this.DISCOUNT = 1 - Number.EPSILON
      return this
    }

    this.DISCOUNT += amount
    return this
  }

  toggleAutomatic (newValue?: boolean): Promise<void> | this {
    const HTML = DOMCacheGetOrSet(`${this.HTML_STRING}HepteractAuto`)

    // When newValue is empty, current value is toggled
    this.AUTO = newValue ?? !this.AUTO

    HTML.textContent = this.AUTO ? i18next.t('general.autoOnColon') : i18next.t('general.autoOffColon')
    HTML.style.border = `2px solid ${this.AUTO ? 'green' : 'red'}`

    return this
  }

  autoCraft (heptAmount: number): this {
    const expandMultiplier = 2
    const craftCostMulti = calculateSingularityDebuff('Hepteract Costs')
    let heptCap = this.computeActualCap()

    // Calculate the largest craft amount possible, with an upper limit being craftAmount
    const hepteractLimitCraft = Math.floor(
      (heptAmount / (craftCostMulti * this.HEPTERACT_CONVERSION)) * 1 / (1 - this.DISCOUNT)
    )

    // Create an array of how many we can craft using our conversion limits for additional items
    const itemLimits: number[] = []
    for (const item in this.OTHER_CONVERSIONS) {
      // When Auto is turned on, only Quarks and hepteracts are consumed.
      if (item === 'worlds') {
        itemLimits.push(
          Math.floor((player[item as keyof Player] as number) / this.OTHER_CONVERSIONS[item as keyof Player]!) * 1
            / (1 - this.DISCOUNT)
        )
      }
    }

    // Get the smallest of the array we created [If Empty, this will be infinite]
    const smallestItemLimit = Math.min(...itemLimits)

    let amountToCraft = Math.min(smallestItemLimit, hepteractLimitCraft)
    let amountCrafted = 0

    let craft = Math.min(heptCap - this.BAL, amountToCraft) // Always nonzero
    this.BAL += craft
    amountCrafted += craft
    amountToCraft -= craft

    while (this.BAL >= heptCap && amountToCraft >= this.CAP) {
      this.BAL -= this.CAP
      this.CAP *= expandMultiplier
      heptCap *= expandMultiplier
      craft = Math.min(heptCap - this.BAL, amountToCraft)

      this.BAL += craft
      amountCrafted += craft
      amountToCraft -= craft
    }

    for (const item in this.OTHER_CONVERSIONS) {
      if (item === 'worlds') {
        player.worlds.sub(amountCrafted * this.OTHER_CONVERSIONS[item]!)
      }
    }

    player.wowAbyssals -= amountCrafted * craftCostMulti * this.HEPTERACT_CONVERSION
    if (player.wowAbyssals < 0) {
      player.wowAbyssals = 0
    }

    return this
  }

  // Get balance of item
  get amount () {
    return this.BAL
  }
  get capacity () {
    return this.CAP
  }
  get discount () {
    return this.DISCOUNT
  }
}

const hepteractEffectiveValues = {
  chronos: {
    LIMIT: 1000,
    DR: 1 / 6
  },
  hyperrealism: {
    LIMIT: 1000,
    DR: 0.33
  },
  quark: {
    LIMIT: 1000,
    DR: 0.5
  },
  challenge: {
    LIMIT: 1000,
    DR: 1 / 6
  },
  abyss: {
    LIMIT: 1,
    DR: 0
  },
  accelerator: {
    LIMIT: 1000,
    DR: 0.2
  },
  acceleratorBoost: {
    LIMIT: 1000,
    DR: 0.2
  },
  multiplier: {
    LIMIT: 1000,
    DR: 0.2
  }
}

export const createHepteract = (data: IHepteractCraft) => {
  return new HepteractCraft(data)
}

export const hepteractEffective = (data: hepteractTypes) => {
  let effectiveValue = Math.min(player.hepteractCrafts[data].BAL, hepteractEffectiveValues[data].LIMIT)
  let exponentBoost = 0
  if (data === 'chronos') {
    exponentBoost += 1 / 750 * player.platonicUpgrades[19]
  }
  if (data === 'quark') {
    exponentBoost += +player.singularityUpgrades.singQuarkHepteract.getEffect().bonus
    exponentBoost += +player.singularityUpgrades.singQuarkHepteract2.getEffect().bonus
    exponentBoost += +player.singularityUpgrades.singQuarkHepteract3.getEffect().bonus
    exponentBoost += +player.octeractUpgrades.octeractImprovedQuarkHept.getEffect().bonus
    exponentBoost += player.shopUpgrades.improveQuarkHept / 100
    exponentBoost += player.shopUpgrades.improveQuarkHept2 / 100
    exponentBoost += player.shopUpgrades.improveQuarkHept3 / 100
    exponentBoost += player.shopUpgrades.improveQuarkHept4 / 100
    exponentBoost += player.shopUpgrades.improveQuarkHept5 / 5000

    const amount = player.hepteractCrafts[data].BAL
    if (1000 < amount && amount <= 1000 * Math.pow(2, 10)) {
      return effectiveValue * Math.pow(amount / 1000, 1 / 2 + exponentBoost)
    } else if (1000 * Math.pow(2, 10) < amount && amount <= 1000 * Math.pow(2, 18)) {
      return effectiveValue * Math.pow(Math.pow(2, 10), 1 / 2 + exponentBoost)
        * Math.pow(amount / (1000 * Math.pow(2, 10)), 1 / 4 + exponentBoost / 2)
    } else if (1000 * Math.pow(2, 18) < amount && amount <= 1000 * Math.pow(2, 44)) {
      return effectiveValue * Math.pow(Math.pow(2, 10), 1 / 2 + exponentBoost)
        * Math.pow(Math.pow(2, 8), 1 / 4 + exponentBoost / 2)
        * Math.pow(amount / (1000 * Math.pow(2, 18)), 1 / 6 + exponentBoost / 3)
    } else if (1000 * Math.pow(2, 44) < amount) {
      return effectiveValue * Math.pow(Math.pow(2, 10), 1 / 2 + exponentBoost)
        * Math.pow(Math.pow(2, 8), 1 / 4 + exponentBoost / 2)
        * Math.pow(Math.pow(2, 26), 1 / 6 + exponentBoost / 3)
        * Math.pow(amount / (1000 * Math.pow(2, 44)), 1 / 12 + exponentBoost / 6)
    }
  }
  if (player.hepteractCrafts[data].BAL > hepteractEffectiveValues[data].LIMIT) {
    effectiveValue *= Math.pow(
      player.hepteractCrafts[data].BAL / hepteractEffectiveValues[data].LIMIT,
      hepteractEffectiveValues[data].DR + exponentBoost
    )
  }

  return effectiveValue
}

export const hepteractDescriptions = (type: hepteractTypes) => {
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

  const multiplier = player.hepteractCrafts[type].computeActualCap() / player.hepteractCrafts[type].CAP
  bonusCapacityText.textContent =
    (player.hepteractCrafts[type].computeActualCap() / player.hepteractCrafts[type].CAP > 1)
      ? `Hepteract capacities are currently multiplied by ${multiplier}. Expansions cost what they would if this multiplier were 1.`
      : ''
  let currentEffectRecord!: StringMap
  let oneCost!: string | Record<string, string>

  switch (type) {
    case 'chronos':
      currentEffectRecord = { x: format(hepteractEffective('chronos') * 6 / 100, 2, true) }
      oneCost = format(1e115 * craftCostMulti, 0, false)

      break
    case 'hyperrealism':
      currentEffectRecord = { x: format(hepteractEffective('hyperrealism') * 6 / 100, 2, true) }
      oneCost = format(1e80 * craftCostMulti, 0, true)
      break
    case 'quark':
      currentEffectRecord = { x: format(hepteractEffective('quark') * 5 / 100, 2, true) }
      oneCost = '100'
      break
    case 'challenge':
      currentEffectRecord = { x: format(hepteractEffective('challenge') * 5 / 100, 2, true) }
      oneCost = {
        y: format(1e11 * craftCostMulti),
        z: format(1e22 * craftCostMulti)
      }
      break
    case 'abyss':
      oneCost = format(69 * craftCostMulti)
      break
    case 'accelerator':
      currentEffectRecord = {
        x: format(2000 * hepteractEffective('accelerator'), 2, true),
        y: format(hepteractEffective('accelerator') * 3 / 100, 2, true)
      }
      oneCost = format(1e14 * craftCostMulti)
      break
    case 'acceleratorBoost':
      currentEffectRecord = { x: format(hepteractEffective('acceleratorBoost') / 10, 2, true) }
      oneCost = format(1e10 * craftCostMulti)
      break
    case 'multiplier':
      currentEffectRecord = {
        x: format(1000 * hepteractEffective('multiplier'), 2, true),
        y: format(hepteractEffective('multiplier') * 3 / 100, 2, true)
      }
      oneCost = format(1e130 * craftCostMulti)
      break
  }

  effectText.textContent = i18next.t(`wowCubes.hepteractForge.descriptions.${type}.effect`)
  currentEffectText.textContent = i18next.t(
    `wowCubes.hepteractForge.descriptions.${type}.currentEffect`,
    currentEffectRecord
  )
  balanceText.textContent = i18next.t('wowCubes.hepteractForge.inventory', {
    x: format(player.hepteractCrafts[type].BAL, 0, true),
    y: format(player.hepteractCrafts[type].computeActualCap(), 0, true)
  })
  const record = typeof oneCost === 'string' ? { y: oneCost } : oneCost
  costText.textContent = i18next.t(`wowCubes.hepteractForge.descriptions.${type}.oneCost`, {
    x: format(player.hepteractCrafts[type].HEPTERACT_CONVERSION * craftCostMulti, 0, true),
    ...record
  })

  unlockedText.textContent = player.hepteractCrafts[type].UNLOCKED
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

  const powderGain = player.shopUpgrades.powderAuto * calculatePowderConversion().mult * buyAmount / 100
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
    x: format(1 / calculatePowderConversion().mult, 1, true)
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

/**
 * Get the HepteractCrafts which are unlocked and auto = ON
 * @returns Array of HepteractCraft
 */
export const getAutoHepteractCrafts = () => {
  const autoHepteracts: HepteractCraft[] = []
  for (const craftName of Object.keys(player.hepteractCrafts)) {
    const craftKey = craftName as keyof Player['hepteractCrafts']
    if (player.hepteractCrafts[craftKey].AUTO && player.hepteractCrafts[craftKey].UNLOCKED) {
      autoHepteracts.push(player.hepteractCrafts[craftKey])
    }
  }
  return autoHepteracts
}

// Hepteract of Chronos [UNLOCKED]
export const ChronosHepteract = new HepteractCraft({
  BASE_CAP: 1000,
  HEPTERACT_CONVERSION: 1e4,
  OTHER_CONVERSIONS: { researchPoints: 1e115 },
  HTML_STRING: 'chronos',
  UNLOCKED: true
})

// Hepteract of Hyperrealism [UNLOCKED]
export const HyperrealismHepteract = new HepteractCraft({
  BASE_CAP: 1000,
  HEPTERACT_CONVERSION: 1e4,
  OTHER_CONVERSIONS: { runeshards: 1e80 },
  HTML_STRING: 'hyperrealism',
  UNLOCKED: true
})

// Hepteract of Too Many Quarks [UNLOCKED]
export const QuarkHepteract = new HepteractCraft({
  BASE_CAP: 1000,
  HEPTERACT_CONVERSION: 1e4,
  OTHER_CONVERSIONS: { worlds: 100 },
  HTML_STRING: 'quark',
  UNLOCKED: true
})

// Hepteract of Challenge [LOCKED]
export const ChallengeHepteract = new HepteractCraft({
  BASE_CAP: 1000,
  HEPTERACT_CONVERSION: 5e4,
  OTHER_CONVERSIONS: { wowPlatonicCubes: 1e11, wowCubes: 1e22 },
  HTML_STRING: 'challenge'
})

// Hepteract of The Abyssal [LOCKED]
export const AbyssHepteract = new HepteractCraft({
  BASE_CAP: 1,
  HEPTERACT_CONVERSION: 1e8,
  OTHER_CONVERSIONS: { wowCubes: 69 },
  HTML_STRING: 'abyss'
})

// Hepteract of Too Many Accelerator [LOCKED]
export const AcceleratorHepteract = new HepteractCraft({
  BASE_CAP: 1000,
  HEPTERACT_CONVERSION: 1e5,
  OTHER_CONVERSIONS: { wowTesseracts: 1e14 },
  HTML_STRING: 'accelerator'
})

// Hepteract of Too Many Accelerator Boost [LOCKED]
export const AcceleratorBoostHepteract = new HepteractCraft({
  BASE_CAP: 1000,
  HEPTERACT_CONVERSION: 2e5,
  OTHER_CONVERSIONS: { wowHypercubes: 1e10 },
  HTML_STRING: 'acceleratorBoost'
})

// Hepteract of Too Many Multiplier [LOCKED]
export const MultiplierHepteract = new HepteractCraft({
  BASE_CAP: 1000,
  HEPTERACT_CONVERSION: 3e5,
  OTHER_CONVERSIONS: { researchPoints: 1e130 },
  HTML_STRING: 'multiplier'
})
