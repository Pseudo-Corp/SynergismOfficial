import {
  calculateAdditiveLuckMult,
  calculateAdditivePixelLuckMult,
  calculateAmbrosiaGenerationOcteractUpgrade,
  calculateAmbrosiaGenerationSingularityUpgrade,
  calculateAmbrosiaGenerationSpeed,
  calculateAmbrosiaLuck,
  calculateAmbrosiaLuckOcteractUpgrade,
  calculateAmbrosiaLuckSingularityUpgrade,
  calculateBlueberryInventory,
  calculateCashGrabBlueberryBonus,
  calculateDilatedFiveLeafBonus,
  calculateEventBuff,
  calculatePixelBarLevelBonuses,
  calculatePixelGenerationSpeed,
  calculatePixelLuck,
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
  | 'BarLevel'
  | 'PixelUpgrade1'
  | 'PixelUpgrade2'
  | 'PixelUpgrade3'
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
  | 'BarLevel'
  | 'PixelUpgrade1'
  | 'PixelUpgrade2'
  | 'PixelUpgrade3'
  | 'Exalt2'
  | 'CashGrabUltra'
  | 'Exalt5'

type BlueberryInventory =
  | 'Exalt1'
  | 'SingularityUpgrade'
  | 'SingularityPerk'
  | 'Exalt5'
  | 'PixelUpgrade1'
  | 'PixelUpgrade2'
  | 'PixelUpgrade3'

type AmbrosiaLuckAdditiveMult =
  | 'Base'
  | 'Exalt1'
  | 'BlueberryLuckDilator'
  | 'SingularityPerk'
  | 'BarLevel'
  | 'ShopUpgrades'
  | 'Exalt5'
  | 'Event'
  
type UltimatePixelGeneration =
  | 'Base'
  | 'BarLevel'

type UltimatePixelLuck =
  | 'Base'
  | 'BarLevel'
  | 'PixelUpgrade1'
  | 'SingularityPixelLuck1'
  | 'SingularityPixelLuck2'
  | 'OcteractPixelLuck1'
  | 'OcteractPixelLuck2'
  | 'BlueberryPixelLuck1'
  | 'BlueberryPixelLuck2'

type UltimatePixelLuckAdditiveMult =
  | 'Base'
  | 'BarLevel'
  | 'Exalt1'
  | 'Event'

type UltimatePixelGeneration =
  | 'Base'
  | 'BarLevel'

type UltimatePixelLuck =
  | 'Base'
  | 'BarLevel'
  | 'PixelUpgrade1'
  | 'SingularityPixelLuck1'
  | 'SingularityPixelLuck2'
  | 'OcteractPixelLuck1'
  | 'OcteractPixelLuck2'
  | 'BlueberryPixelLuck1'
  | 'BlueberryPixelLuck2'

type UltimatePixelLuckAdditiveMult =
  | 'Base'
  | 'BarLevel'
  | 'Exalt1'
  | 'Event'

export class AmbrosiaLuckAdditiveMultCache extends AdditionCache<AmbrosiaLuckAdditiveMult> {
  vals!: Record<AmbrosiaLuckAdditiveMult, number>
  totalVal!: number

  constructor () {
    super()
    this.reset()
  }

  reset () {
    this.vals = {
      Base: 1,
      Exalt1: 0,
      BlueberryLuckDilator: 0,
      SingularityPerk: 0,
      BarLevel: 0,
      ShopUpgrades: 0,
      Exalt5: 0,
      Event: 0
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
      case 'BlueberryLuckDilator': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaLuckDilator.bonus.ambrosiaLuckMult
        break
      }
      case 'SingularityPerk': {
        this.vals[key] = calculateDilatedFiveLeafBonus()
        break
      }
      case 'BarLevel': {
        this.vals[key] = calculatePixelBarLevelBonuses().AmbrosiaLuckMult
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
  vals!: Record<AmbrosialLuck, number>
  totalVal!: number
  usedTotal!: number

  constructor () {
    super()
    this.reset()
  }

  reset () {
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
      BarLevel: 0,
      PixelUpgrade1: 0,
      PixelUpgrade2: 0,
      PixelUpgrade3: 0,
      OneHundredThirtyOne: 0,
      TwoHundredSixtyNine: 0,
      ShopOcteractAmbrosiaLuck: 0,
      Exalt5: 0
    }
    this.totalVal = 100
    this.usedTotal = 100
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
      case 'BarLevel': {
        this.vals[key] = calculatePixelBarLevelBonuses().AmbrosiaLuck
        break
      }
      case 'PixelUpgrade1': {
        this.vals[key] = +player.pixelUpgrades.pixelAmbrosiaLuck.bonus.ambrosiaLuck
        break
      }
      case 'PixelUpgrade2': {
        this.vals[key] = +player.pixelUpgrades.pixelAmbrosiaLuck2.bonus.ambrosiaLuck
        break
      }
      case 'PixelUpgrade3': {
        this.vals[key] = +player.pixelUpgrades.pixelAmbrosiaLuck3.bonus.ambrosiaLuck
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
  vals!: Record<AmbrosiaGeneration, number>
  totalVal!: number

  constructor () {
    super()
    this.reset()
  }

  reset () {
    this.vals = {
      DefaultVal: 1,
      Blueberries: 1,
      ShopUpgrades: 1,
      SingularityBerries: 1,
      OcteractBerries: 1,
      BlueberryPatreon: 1,
      BarLevel: 1,
      PixelUpgrade1: 1,
      PixelUpgrade2: 1,
      PixelUpgrade3: 1,
      Exalt2: 1,
      Exalt5: 1,
      CashGrabUltra: 1,
      Event: 1
    }
    this.totalVal = 2
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
      case 'BarLevel': {
        this.vals[key] = calculatePixelBarLevelBonuses().BlueberrySpeedMult
        break
      }
      case 'PixelUpgrade1': {
        this.vals[key] = +player.pixelUpgrades.pixelAmbrosiaGeneration.bonus.ambrosiaGeneration
        break
      }
      case 'PixelUpgrade2': {
        this.vals[key] = +player.pixelUpgrades.pixelAmbrosiaGeneration2.bonus.ambrosiaGeneration
        break
      }
      case 'PixelUpgrade3': {
        this.vals[key] = +player.pixelUpgrades.pixelAmbrosiaGeneration3.bonus.ambrosiaGeneration
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
    player.caches.ultimatePixelGeneration.updateVal('Base')
  }
}

export class BlueberryInventoryCache extends AdditionCache<BlueberryInventory> {
  vals!: Record<BlueberryInventory, number>
  totalVal!: number

  constructor () {
    super()
    this.reset()
  }

  reset () {
    this.vals = {
      Exalt1: 0,
      SingularityUpgrade: 0,
      SingularityPerk: 0,
      PixelUpgrade1: 0,
      PixelUpgrade2: 0,
      PixelUpgrade3: 0,
      Exalt5: 0
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
        break
      }
      case 'PixelUpgrade1': {
        this.vals[key] = +player.pixelUpgrades.pixelBlueberry.bonus.blueberry
        break
      }
      case 'PixelUpgrade2': {
        this.vals[key] = +player.pixelUpgrades.pixelBlueberry2.bonus.blueberry
        break
      }
      case 'PixelUpgrade3': {
        this.vals[key] = +player.pixelUpgrades.pixelBlueberry3.bonus.blueberry
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
    player.caches.ambrosiaGeneration.updateVal('Blueberries') // Dependant cache
  }
}

export class UltimatePixelGenerationCache extends MultiplicationCache<UltimatePixelGeneration> {
  vals!: Record<UltimatePixelGeneration, number>
  public totalVal!: number

  constructor () {
    super()
    this.reset()
  }

  reset () {
    this.vals = {
      Base: 1,
      BarLevel: 1
    }
    this.totalVal = 1
  }

  updateVal (key: UltimatePixelGeneration, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'Base': {
        if (!player.singularityChallenges.limitedAscensions.rewards.ultimateProgressBarUnlock) {
          this.vals[key] = 0
        } else {
          const ambrosiaGen = player.caches.ambrosiaGeneration.totalVal
          const addedBase = +player.pixelUpgrades.pixelPixelGeneration.bonus.pixelGenerationAdd
          const addedBase2 = +player.pixelUpgrades.pixelPixelGeneration2.bonus.pixelGenerationAdd
          const addedBase3 = +player.pixelUpgrades.pixelPixelGeneration3.bonus.pixelGenerationAdd
          this.vals[key] = Math.max(1, Math.min(ambrosiaGen, Math.pow(1000000 * ambrosiaGen, 1 / 3))) + addedBase
            + addedBase2 + addedBase3
        }
        break
      }
      case 'BarLevel': {
        this.vals[key] = calculatePixelBarLevelBonuses().PixelProgressMult
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
  }
}

export class UltimatePixelLuckCache extends AdditionCache<UltimatePixelLuck> {
  vals!: Record<UltimatePixelLuck, number>
  public totalVal!: number
  public usedTotal!: number

  constructor () {
    super()
    this.reset()
  }

  reset () {
    this.vals = {
      Base: 100,
      BarLevel: 0,
      PixelUpgrade1: 0,
      SingularityPixelLuck1: 0,
      SingularityPixelLuck2: 0,
      OcteractPixelLuck1: 0,
      OcteractPixelLuck2: 0,
      BlueberryPixelLuck1: 0,
      BlueberryPixelLuck2: 0
    }
    this.totalVal = 100
    this.usedTotal = 100
  }

  updateVal (key: UltimatePixelLuck, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'Base': {
        this.vals[key] = 100
        break
      }
      case 'BarLevel': {
        this.vals[key] = calculatePixelBarLevelBonuses().PixelLuck
        break
      }
      case 'PixelUpgrade1': {
        this.vals[key] = +player.pixelUpgrades.pixelPixelLuck.bonus.pixelLuck
        break
      }
      case 'SingularityPixelLuck1': {
        this.vals[key] = +player.singularityUpgrades.singPixelLuck.getEffect().bonus
        break
      }
      case 'SingularityPixelLuck2': {
        this.vals[key] = +player.singularityUpgrades.singPixelLuck2.getEffect().bonus
        break
      }
      case 'OcteractPixelLuck1': {
        this.vals[key] = +player.octeractUpgrades.octeractPixelLuck.getEffect().bonus
        break
      }
      case 'OcteractPixelLuck2': {
        this.vals[key] = +player.octeractUpgrades.octeractPixelLuck2.getEffect().bonus
        break
      }
      case 'BlueberryPixelLuck1': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaPixelLuck.bonus.pixelLuck
        break
      }
      case 'BlueberryPixelLuck2': {
        this.vals[key] = +player.blueberryUpgrades.ambrosiaPixelLuck2.bonus.pixelLuck
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
    this.usedTotal = Math.floor(
      this.totalVal * player.caches.ultimatePixelAdditiveMult.totalVal
    )
  }
}

export class UltimatePixelLuckAdditiveMultCache extends AdditionCache<UltimatePixelLuckAdditiveMult> {
  vals!: Record<UltimatePixelLuckAdditiveMult, number>
  public totalVal!: number

  constructor () {
    super()
    this.reset()
  }

  reset () {
    this.vals = {
      Base: 1,
      BarLevel: 0,
      Exalt1: 0,
      Event: 0
    }
    this.totalVal = 1
  }

  updateVal (key: UltimatePixelLuckAdditiveMult, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'Base': {
        this.vals[key] = 1
        break
      }
      case 'BarLevel': {
        this.vals[key] = calculatePixelBarLevelBonuses().PixelLuckMult
        break
      }
      case 'Exalt1': {
        this.vals[key] = +player.singularityChallenges.noSingularityUpgrades.rewards.luckBonus
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
    player.caches.ultimatePixelLuck.updateVal('Base') // Dependant cache, though maybe need a better system than calling Base
  }
}

export const cacheReinitialize = () => {
  // TODO: REMOVE THIS FUCKING SHIT ASS CODE
  // WHY THE FUCK ARE WE CACHING MATH OPERATIONS???
  /*player.caches.ambrosiaLuckAdditiveMult.initialize()
  player.caches.blueberryInventory.initialize()
  player.caches.ambrosiaGeneration.initialize()
  player.caches.ambrosiaLuck.initialize() */

  // As of 6/13/2024, caches are no longer used. Instead calculations are done directly and the end value is stored in a Global variable
  // which is not stored in the save.

  Globals.ambrosiaCurrStats = {
    ambrosiaAdditiveLuckMult: calculateAdditiveLuckMult().value,
    ambrosiaLuck: calculateAmbrosiaLuck().value,
    ambrosiaBlueberries: calculateBlueberryInventory().value,
    ambrosiaGenerationSpeed: calculateAmbrosiaGenerationSpeed().value
  }

  Globals.pixelCurrStats = {
    pixelAdditiveLuckMult: calculateAdditivePixelLuckMult().value,
    pixelLuck: calculatePixelLuck().value,
    pixelGenerationSpeed: calculatePixelGenerationSpeed().value
  }
}
