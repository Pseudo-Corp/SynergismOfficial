import { calculateAmbrosiaGenerationOcteractUpgrade, calculateAmbrosiaGenerationShopUpgrade, calculateAmbrosiaGenerationSingularityUpgrade, calculateEventBuff } from '../../../Calculate'
import { player } from '../../../Synergism'
import { Globals } from '../../../Variables'
import { MultiplicationCache } from './MultiplicationCache'

type AmbrosiaGeneration = 'DefaultVal' | 'Blueberries' | 'SingularityBerries' | 'ShopUpgrades' | 'Event' | 'OcteractBerries' |
                          'BlueberryPatreon' | 'Exalt5' | 'AmbrosiaChallenge1' | 'AmbrosiaChallenge2' | 'AmbrosiaChallenge3'

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
      'Exalt5': 1,
      'AmbrosiaChallenge1': 1,
      'AmbrosiaChallenge2': 1,
      'AmbrosiaChallenge3': 1,
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
      case 'Exalt5': {
        this.vals[key] = +player.singularityChallenges.staggeredCubes.rewards.ambrosiaGeneration
        break
      }
      case 'AmbrosiaChallenge1': {
        const amount = Math.min(25, player.ambrosiaChallengeFills[1])
        this.vals[key] = 1 + 0.01 * amount
        break
      }
      case 'AmbrosiaChallenge2': {
        const amount = Math.min(400, player.ambrosiaChallengeFills[2])
        this.vals[key] = 1 + amount / 400
        break
      }
      case 'AmbrosiaChallenge3': {
        const amount = Math.min(1000, player.ambrosiaChallengeFills[3])
        this.vals[key] = 1 + amount /1000
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
