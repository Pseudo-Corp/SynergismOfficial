import { player } from '../../../Synergism'
import { maxBuyProducerHTML } from '../HTML/updates/toggles/max-buy-producer'

export const toggleMaxBuyAntProducer = (): void => {
  player.ants.toggles.maxBuyProducers = !player.ants.toggles.maxBuyProducers
  maxBuyProducerHTML(player.ants.toggles.maxBuyProducers)
}
