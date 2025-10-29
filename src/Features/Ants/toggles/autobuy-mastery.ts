import { player } from '../../../Synergism'
import { autobuyAntMasteryHTML } from '../HTML/updates/toggles/autobuy-mastery'

export const toggleAutobuyAntMastery = (): void => {
  player.ants.toggles.autobuyMasteries = !player.ants.toggles.autobuyMasteries
  autobuyAntMasteryHTML(player.ants.toggles.autobuyMasteries)
}
