import { player } from '../../../../Synergism'
import { sacrificeCountHTML } from './sacrifice'
import {
  updateAlwaysSacrificeMaxRebornELOToggle,
  updateOnlySacrificeMaxRebornELOToggle
} from './toggles/additional-sacrifice-toggles'
import { autobuyAntMasteryHTML } from './toggles/autobuy-mastery'
import { autobuyAntProducerHTML } from './toggles/autobuy-producer'
import { autobuyAntUpgradeHTML } from './toggles/autobuy-upgrade'
import { maxBuyProducerHTML } from './toggles/max-buy-producer'
import { maxBuyUpgradeHTML } from './toggles/max-buy-upgrade'
import { autoAntSacrificeEnabledHTML } from './toggles/sacrifice-enabled'
import { autoAntSacrificeModeNameHTML } from './toggles/sacrifice-mode'

export const loadSynergyAntHTMLUpdates = (): void => {
  autobuyAntProducerHTML(player.ants.toggles.autobuyProducers)
  autobuyAntMasteryHTML(player.ants.toggles.autobuyMasteries)
  autobuyAntUpgradeHTML(player.ants.toggles.autobuyUpgrades)
  maxBuyProducerHTML(player.ants.toggles.maxBuyProducers)
  maxBuyUpgradeHTML(player.ants.toggles.maxBuyUpgrades)
  autoAntSacrificeEnabledHTML(player.ants.toggles.autoSacrificeEnabled)
  autoAntSacrificeModeNameHTML(player.ants.toggles.autoSacrificeMode)
  sacrificeCountHTML(player.ants.antSacrificeCount)
  updateAlwaysSacrificeMaxRebornELOToggle(player.ants.toggles.alwaysSacrificeMaxRebornELO)
  updateOnlySacrificeMaxRebornELOToggle(player.ants.toggles.onlySacrificeMaxRebornELO)
}
