import { player } from '../Synergism'

export interface StatCache<T> {

    totalVal: number

    /**
     * Updates the cache value for a statistic
     * @param key: Statistic which we must update for value
     */
    updateVal(key:T, init: boolean): void

    /**
     * Initializes the cache by establishing statistics for each value as well as
     * updating the total statistic.
     */
    initialize(): void
}

export const cacheReinitialize = () => {
  // TODO: Create a hierarchy of cache dependencies (ambrosia generation depends on blueberry inventory)
  player.caches.blueberryInventory.initialize()
  player.caches.ambrosiaGeneration.initialize()
  player.caches.ambrosiaLuck.initialize()
}

