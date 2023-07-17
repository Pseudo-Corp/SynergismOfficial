import { calculateSingularityMilestoneBlueberries } from '../../../Calculate'
import { player } from '../../../Synergism'
import { AdditionCache } from './AdditionCache'

type BlueberryInventory = 'Exalt1' | 'SingularityUpgrade' | 'SingularityPerk'

export class BlueberryInventoryCache extends AdditionCache<BlueberryInventory> {
  vals: Record<BlueberryInventory, number>
  public totalVal: number

  constructor() {
    super()
    this.vals = {
      'Exalt1': 0,
      'SingularityUpgrade': 0,
      'SingularityPerk': 0
    }
    this.totalVal = 0
  }

  updateVal(key: BlueberryInventory, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'Exalt1': {
        this.vals[key] = +(player.singularityChallenges.noSingularityUpgrades.completions > 0)
        break
      }
      case 'SingularityUpgrade': {
        this.vals[key] = +(player.singularityUpgrades.blueberries.getEffect().bonus)
        break
      }
      case 'SingularityPerk': {
        this.vals[key] = calculateSingularityMilestoneBlueberries()
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
    player.caches.ambrosiaGeneration.updateVal('Blueberries') // Dependant cache
  }
}
