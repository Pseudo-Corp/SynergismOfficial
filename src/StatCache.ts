import {
  calculateAmbrosiaGenerationOcteractUpgrade,
  calculateAmbrosiaGenerationSingularityUpgrade,
  calculateAmbrosiaLuckOcteractUpgrade,
  calculateAmbrosiaLuckSingularityUpgrade,
  calculateCashGrabBlueberryBonus,
  calculateDilatedFiveLeafBonus,
  calculateEventBuff,
  calculateSingularityMilestoneBlueberries
} from './Calculate'
import {
  calculateAmbrosiaGenerationShopUpgrade,
  calculateAmbrosiaLuckShopUpgrade,
  calculateSingularityAmbrosiaLuckMilestoneBonus
} from './Calculate'
import { BuffType } from './Event'
import { player } from './Synergism'
import { productContents } from './Utility'
import { Globals } from './Variables'

interface StatCache<T> {
  totalVal: number

  /**
   * Updates the cache value for a statistic
   * @param key: Statistic which we must update for value
   */
  updateVal(key: T, init: boolean): void

  /**
   * Initializes the cache by establishing statistics for each value as well as
   * updating the total statistic.
   */
  initialize(): void
}

abstract class AdditionCache<T extends string> implements StatCache<T> {
  public totalVal = 0
  abstract vals: Record<T, number>

  /**
   * Updates a particular statistic 'key' and updates total accordingly
   * @param key The statistic to update
   */
  abstract updateVal (key: T, init: boolean): void

  /**
   * Initialize all statistics of interest and compute a total value as sum of all statistics
   */
  initialize (): void {
    this.totalVal = 0
    for (const val of Object.keys(this.vals) as T[]) {
      this.updateVal(val, true)
    }
  }

  /**
   * Updates the value of total after updating individual statistic value, with key
   * @param oldVal: Value present in values[key] before update
   * @param newVal: Value present in values[key] after update
   */
  updateTotal (oldVal: number, newVal: number, init = false): void {
    if (init) {
      this.totalVal += newVal
    } else {
      this.totalVal += newVal - oldVal
    }
  }

  /**
   * Flattens the value object into an array, for use in statistics.
   * @returns Array consisting of all additive values as well as sum of elements
   */
  flatten (): number[] {
    const arr: number[] = Object.values(this.vals)
    arr.push(this.totalVal)
    return arr
  }
}

abstract class MultiplicationCache<T extends string> implements StatCache<T> {
  public totalVal = 1
  abstract vals: Record<T, number>

  /**
   * Updates a particular statistic 'key' and updates total accordingly
   * @param key The statistic to update
   */
  abstract updateVal (key: T, init: boolean): void
  /**
   * Initialize all statistics of interest and compute a total value as product of all statistics
   */
  initialize (): void {
    this.totalVal = 1
    for (const val of Object.keys(this.vals) as T[]) {
      this.updateVal(val, true)
    }
  }

  updateTotal (oldVal: number, newVal: number, init = false): void {
    if (init) {
      this.totalVal *= newVal
    } else {
      // Optimization: if neither old total or new val is 0 then we can safely just compute factor
      if (this.totalVal !== 0 && newVal !== 0) this.totalVal *= newVal / oldVal
      // Optimization: if newVal is 0 we don't have to care about computing
      else if (newVal === 0) this.totalVal = 0
      // Else: Brute force compute total val (TODO: Optimize)
      else {
        const arr = this.flatten()
        // remove last elm
        arr.pop()
        this.totalVal = productContents(arr)
      }
    }
  }

  /**
   * Flattens the value object into an array, for use in statistics.
   * @returns Array consisting of all additive values as well as sum of elements
   */
  flatten (): number[] {
    const arr: number[] = Object.values(this.vals)
    arr.push(this.totalVal)
    return arr
  }
}

/**
 * Define Types Below. For each one, the union is all statistics of a particular stat.
 */

type AmbrosialLuck =
  | 'Base'
  | 'SingPerks'
  | 'OcteractBerries'
  | 'ShopUpgrades'
  | 'BlueberryUpgrade1'
  | 'BlueberryCubeLuck1'
  | 'BlueberryQuarkLuck1'
  | 'SingularityBerries'
  | 'BlueberryUpgrade2'
  | 'ShopOcteractAmbrosiaLuck'
  | 'TwoHundredSixtyNine'
  | 'OneHundredThirtyOne'
  | 'Exalt5'

type AmbrosiaGeneration =
  | 'DefaultVal'
  | 'Blueberries'
  | 'SingularityBerries'
  | 'ShopUpgrades'
  | 'Event'
  | 'OcteractBerries'
  | 'BlueberryPatreon'
  | 'Exalt2'
  | 'CashGrabUltra'
  | 'Exalt5'

type BlueberryInventory = 'Exalt1' | 'SingularityUpgrade' | 'SingularityPerk' | 'Exalt5'

type AmbrosiaLuckAdditiveMult =
  | 'Base'
  | 'Exalt1'
  | 'SingularityPerk'
  | 'ShopUpgrades'
  | 'Exalt5'
  | 'Event'

export class AmbrosiaLuckAdditiveMultCache extends AdditionCache<AmbrosiaLuckAdditiveMult> {
  vals: Record<AmbrosiaLuckAdditiveMult, number>
  public totalVal: number

  constructor () {
    super()
    this.vals = {
      Base: 1,
      Exalt1: 0,
      SingularityPerk: 0,
      ShopUpgrades: 0,
      Exalt5: 0,
      Event: 0,
    }
    this.totalVal = 1
  }

  updateVal (key: AmbrosiaLuckAdditiveMult, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'Base': {
        this.vals[key] = 1
        break
      }
      case 'Exalt1': {
        this.vals[key] = +player.singularityChallenges.noSingularityUpgrades.rewards.luckBonus
        break
      }
      case 'SingularityPerk': {
        this.vals[key] = calculateDilatedFiveLeafBonus()
        break
      }
      case 'ShopUpgrades': {
        this.vals[key] = player.shopUpgrades.shopAmbrosiaLuckMultiplier4 / 100
        break
      }
      case 'Exalt5': {
        this.vals[key] = +player.singularityChallenges.noAmbrosiaUpgrades.rewards.luckBonus
        break
      }
      case 'Event': {
        this.vals[key] = Globals.isEvent
          ? calculateEventBuff(BuffType.AmbrosiaLuck)
          : 0
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
    player.caches.ambrosiaLuck.updateVal('Base') // Dependant cache, though maybe need a better system than calling Base
  }
}

export class AmbrosiaLuckCache extends AdditionCache<AmbrosialLuck> {
  vals: Record<AmbrosialLuck, number>
  public totalVal: number
  public usedTotal: number

  constructor () {
    super()
    this.vals = {
      Base: 100,
      SingPerks: 0,
      ShopUpgrades: 0,
      SingularityBerries: 0,
      OcteractBerries: 0,
      BlueberryUpgrade1: 0,
      BlueberryUpgrade2: 0,
      BlueberryCubeLuck1: 0,
      BlueberryQuarkLuck1: 0,
      OneHundredThirtyOne: 0,
      TwoHundredSixtyNine: 0,
      ShopOcteractAmbrosiaLuck: 0,
      Exalt5: 0,
    }
    this.totalVal = 0
    this.usedTotal = 0
  }

  updateVal (key: AmbrosialLuck, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'Base': {
        this.vals[key] = 100
        break
      }
      case 'SingPerks': {
        this.vals[key] = calculateSingularityAmbrosiaLuckMilestoneBonus()
        break
      }
      case 'ShopUpgrades': {
        this.vals[key] = calculateAmbrosiaLuckShopUpgrade()
        break
      }
      case 'SingularityBerries': {
        this.vals[key] = calculateAmbrosiaLuckSingularityUpgrade()
        break
      }
      case 'OcteractBerries': {
        this.vals[key] = calculateAmbrosiaLuckOcteractUpgrade()
        break
      }
      case 'BlueberryUpgrade1': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaLuck1.bonus.ambrosiaLuck
        break
      }
      case 'BlueberryUpgrade2': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaLuck2.bonus.ambrosiaLuck
        break
      }
      case 'BlueberryCubeLuck1': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaCubeLuck1.bonus.ambrosiaLuck
        break
      }
      case 'BlueberryQuarkLuck1': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaQuarkLuck1.bonus.ambrosiaLuck
        break
      }
      case 'OneHundredThirtyOne': {
        this.vals[key] = player.highestSingularityCount >= 131 ? 131 : 0
        break
      }
      case 'TwoHundredSixtyNine': {
        this.vals[key] = player.highestSingularityCount >= 269 ? 269 : 0
        break
      }
      case 'ShopOcteractAmbrosiaLuck': {
        this.vals[key] = player.shopUpgrades.shopOcteractAmbrosiaLuck
          * (1 + Math.floor(Math.log10(player.totalWowOcteracts + 1)))
        break
      }
      case 'Exalt5': {
        this.vals[key] = +player.singularityChallenges.noAmbrosiaUpgrades.rewards.additiveLuck
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
    this.usedTotal = Math.floor(
      this.totalVal * player.caches.ambrosiaLuckAdditiveMult.totalVal
    )
  }
}

export class AmbrosiaGenerationCache extends MultiplicationCache<AmbrosiaGeneration> {
  vals: Record<AmbrosiaGeneration, number>
  public totalVal: number

  constructor () {
    super()
    this.vals = {
      DefaultVal: 1,
      Blueberries: 1,
      ShopUpgrades: 1,
      SingularityBerries: 1,
      OcteractBerries: 1,
      BlueberryPatreon: 1,
      Exalt2: 1,
      Exalt5: 1,
      CashGrabUltra: 1,
      Event: 1
    }
    this.totalVal = 0
  }

  updateVal (key: AmbrosiaGeneration, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'DefaultVal': {
        this.vals[key] = 1 * +player.visitedAmbrosiaSubtab
        break
      }
      case 'Blueberries': {
        this.vals[key] = player.caches.blueberryInventory.totalVal
        break
      }
      case 'ShopUpgrades': {
        this.vals[key] = calculateAmbrosiaGenerationShopUpgrade()
        break
      }
      case 'SingularityBerries': {
        this.vals[key] = calculateAmbrosiaGenerationSingularityUpgrade()
        break
      }
      case 'OcteractBerries': {
        this.vals[key] = calculateAmbrosiaGenerationOcteractUpgrade()
        break
      }
      case 'BlueberryPatreon': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaPatreon.bonus.blueberryGeneration
        break
      }
      case 'Exalt2': {
        this.vals[key] = +player.singularityChallenges.oneChallengeCap.rewards.blueberrySpeedMult
        break
      }
      case 'Exalt5': {
        this.vals[key] = +player.singularityChallenges.noAmbrosiaUpgrades.rewards.blueberrySpeedMult
        break
      }
      case 'Event': {
        this.vals[key] = Globals.isEvent
          ? 1 + calculateEventBuff(BuffType.BlueberryTime)
          : 1
        break
      }
      case 'CashGrabUltra': {
        this.vals[key] = calculateCashGrabBlueberryBonus()
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
  }
}

export class BlueberryInventoryCache extends AdditionCache<BlueberryInventory> {
  vals: Record<BlueberryInventory, number>
  public totalVal: number

  constructor () {
    super()
    this.vals = {
      Exalt1: 0,
      SingularityUpgrade: 0,
      SingularityPerk: 0,
      Exalt5: 0,
    }
    this.totalVal = 0
  }

  updateVal (key: BlueberryInventory, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'Exalt1': {
        this.vals[key] = +(
          player.singularityChallenges.noSingularityUpgrades.completions > 0
        )
        break
      }
      case 'SingularityUpgrade': {
        this.vals[key] = +player.singularityUpgrades.blueberries.getEffect().bonus
        break
      }
      case 'SingularityPerk': {
        this.vals[key] = calculateSingularityMilestoneBlueberries()
        break
      }
      case 'Exalt5': {
        this.vals[key] = +player.singularityChallenges.noAmbrosiaUpgrades.rewards.blueberries
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
    player.caches.ambrosiaGeneration.updateVal('Blueberries') // Dependant cache
  }
}

export const cacheReinitialize = () => {
  // TODO: Create a hierarchy of cache dependencies (ambrosia generation depends on blueberry inventory)
  player.caches.ambrosiaLuckAdditiveMult.initialize()
  player.caches.blueberryInventory.initialize()
  player.caches.ambrosiaGeneration.initialize()
  player.caches.ambrosiaLuck.initialize()
}
