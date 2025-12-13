import { player } from '../../../Synergism'
import { autobuyAntProducerHTML } from '../HTML/updates/toggles/autobuy-producer'

export const toggleAutobuyAntProducer = (): void => {
  player.ants.toggles.autobuyProducers = !player.ants.toggles.autobuyProducers
  autobuyAntProducerHTML(player.ants.toggles.autobuyProducers)
}
