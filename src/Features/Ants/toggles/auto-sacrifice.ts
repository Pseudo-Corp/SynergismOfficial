import { player } from '../../../Synergism'
import { autoAntSacrificeEnabledHTML } from '../HTML/updates/toggles/sacrifice-enabled'
import { autoAntSacrificeModeNameHTML } from '../HTML/updates/toggles/sacrifice-mode'
import { type AutoSacrificeModes, NUM_SACRIFICE_MODES } from './structs/sacrifice'

export const toggleAutoAntSacrificeEnabled = (): void => {
  player.ants.toggles.autoSacrificeEnabled = !player.ants.toggles.autoSacrificeEnabled

  autoAntSacrificeEnabledHTML(player.ants.toggles.autoSacrificeEnabled)
}

export const toggleAutoAntSacrificeMode = (): void => {
  console.log(NUM_SACRIFICE_MODES)
  const nextEnum = (player.ants.toggles.autoSacrificeMode + 1) % NUM_SACRIFICE_MODES
  player.ants.toggles.autoSacrificeMode = nextEnum as AutoSacrificeModes

  autoAntSacrificeModeNameHTML(player.ants.toggles.autoSacrificeMode)
}

export const toggleAutoAntSacrificeThreshold = (value: number): void => {
  player.ants.toggles.autoSacrificeThreshold = value
}

export const toggleAlwaysSacrificeMaxRebornELO = (): void => {
  player.ants.toggles.alwaysSacrificeMaxRebornELO = !player.ants.toggles.alwaysSacrificeMaxRebornELO
}

export const toggleOnlySacrificeMaxRebornELO = (): void => {
  player.ants.toggles.onlySacrificeMaxRebornELO = !player.ants.toggles.onlySacrificeMaxRebornELO
}
