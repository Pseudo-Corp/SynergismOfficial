import { calculateSingularityMilestoneBlueberries } from '../../../Calculate'
import { player } from '../../../Synergism'
import { AdditionCache } from './AdditionCache'

type BlueberryInventory = 'Exalt1' | 'SingularityUpgrade' | 'SingularityPerk' |
                          'AmbrosiaChallenge1' | 'AmbrosiaChallenge2' | 'AmbrosiaChallenge3'

export class BlueberryInventoryCache extends AdditionCache<BlueberryInventory> {
  vals: Record<BlueberryInventory, number>
  public totalVal: number

  constructor() {
    super()
    this.vals = {
      'Exalt1': 0,
      'SingularityUpgrade': 0,
      'SingularityPerk': 0,
      'AmbrosiaChallenge1': 0,
      'AmbrosiaChallenge2': 0,
      'AmbrosiaChallenge3': 0
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
      case 'AmbrosiaChallenge1': {
        const amount = +(player.ambrosiaChallengeFills[1] >= 25)
        this.vals[key] = 2 * amount
        break
      }
      case 'AmbrosiaChallenge2': {
        const amount = Math.min(400, player.ambrosiaChallengeFills[2])
        this.vals[key] = Math.floor(amount / 100)
        break
      }
      case 'AmbrosiaChallenge3': {
        const amount = Math.min(1000, player.ambrosiaChallengeFills[3])
        this.vals[key] = Math.floor(amount / 200)
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
    player.caches.ambrosiaGeneration.updateVal('Blueberries') // Dependant cache
  }
}
