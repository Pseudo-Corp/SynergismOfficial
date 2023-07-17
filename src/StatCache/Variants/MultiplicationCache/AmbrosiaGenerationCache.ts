import { calculateAmbrosiaGenerationOcteractUpgrade, calculateAmbrosiaGenerationShopUpgrade, calculateAmbrosiaGenerationSingularityUpgrade, calculateEventBuff } from '../../../Calculate'
import { player } from '../../../Synergism'
import { Globals } from '../../../Variables'
import { MultiplicationCache } from './MultiplicationCache'

type AmbrosiaGeneration = 'DefaultVal' | 'Blueberries' | 'SingularityBerries' | 'ShopUpgrades' | 'Event' | 'OcteractBerries' |
                          'BlueberryPatreon'

export class AmbrosiaGenerationCache extends MultiplicationCache<AmbrosiaGeneration> {

  vals: Record<AmbrosiaGeneration, number>
  public totalVal: number

  constructor() {
    super()
    this.vals = {
      'DefaultVal': 1,
      'Blueberries': 1,
      'ShopUpgrades': 1,
      'SingularityBerries': 1,
      'OcteractBerries': 1,
      'BlueberryPatreon': 1,
      'Event': 1
    }
    this.totalVal = 0
  }

  updateVal(key: AmbrosiaGeneration, init = false): void {
    const oldVal = this.vals[key]
    switch (key) {
      case 'DefaultVal': {
        this.vals[key] = 1 * +(player.visitedAmbrosiaSubtab)
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
      case 'Event': {
        this.vals[key] = (Globals.isEvent) ? 1 + calculateEventBuff('Blueberry Time') : 1
        break
      }
    }
    const newVal = this.vals[key]
    this.updateTotal(oldVal, newVal, init)
  }
}
