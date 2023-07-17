import type { StatCache } from '../../StatCache'

export abstract class AdditionCache<T extends string> implements StatCache<T> {

  public totalVal = 0
      abstract vals: Record<T, number>

      /**
       * Updates a particular statistic 'key' and updates total accordingly
       * @param key The statistic to update
       */
      abstract updateVal(key: T, init: boolean): void

      /**
       * Initialize all statistics of interest and compute a total value as sum of all statistics
       */
      initialize(): void {
        this.totalVal = 0
        for (const val of (Object.keys(this.vals) as T[])) {
          this.updateVal(val, true)
        }
      }

      /**
       * Updates the value of total after updating individual statistic value, with key
       * @param oldVal: Value present in values[key] before update
       * @param newVal: Value present in values[key] after update
       */
      updateTotal(oldVal: number, newVal: number, init = false):void {
        if (init) {
          this.totalVal += newVal
        } else {
          this.totalVal += (newVal - oldVal)
        }
      }

      /**
       * Flattens the value object into an array, for use in statistics.
       * @returns Array consisting of all additive values as well as sum of elements
       */
      flatten(): number[] {
        const arr:number[] = Object.values(this.vals)
        arr.push(this.totalVal)
        return arr
      }

      get total() {
        return Math.min(this.totalVal, 1e300)
      }
}
