import { productContents } from '../../../Utility'
import type { StatCache } from '../../StatCache'

export abstract class MultiplicationCache<T extends string> implements StatCache<T> {

  public totalVal = 1
    abstract vals: Record<T, number>

      /**
       * Updates a particular statistic 'key' and updates total accordingly
       * @param key The statistic to update
       */
      abstract updateVal(key: T, init: boolean): void
      /**
       * Initialize all statistics of interest and compute a total value as product of all statistics
       */
      initialize(): void {
        this.totalVal = 1
        for (const val of (Object.keys(this.vals) as T[])) {
          this.updateVal(val, true)
        }
      }

      updateTotal(oldVal: number, newVal: number, init = false):void {
        if (init) {
          this.totalVal *= newVal
        } else {
          // Optimization: if neither old total or new val is 0 then we can safely just compute factor
          if (this.totalVal !== 0 && newVal !== 0) this.totalVal *= (newVal / oldVal)
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
      flatten(): number[] {
        const arr:number[] = Object.values(this.vals)
        arr.push(this.totalVal)
        return arr
      }

      get total() {
        return Math.min(1e300, this.totalVal)
      }
}
