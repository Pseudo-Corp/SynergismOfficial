import { player } from '../../../../Synergism'
import { antUpgradeData } from '../data/data'
import type { AntUpgrades } from '../structs/structs'
import { computeFreeAntUpgradeLevels } from './free-levels'

export const calculateTrueAntLevel = (antUpgrade: AntUpgrades) => {
  const freeLevels = computeFreeAntUpgradeLevels()
  const corruptionDivisor = (antUpgradeData[antUpgrade].exemptFromCorruption)
    ? 1
    : player.corruptions.used.corruptionEffects('extinction')

  if (player.currentChallenge.ascension === 11) {
    return Math.min(player.ants.upgrades[antUpgrade], freeLevels) / corruptionDivisor
  } else {
    return (player.ants.upgrades[antUpgrade]
      + Math.min(player.ants.upgrades[antUpgrade], freeLevels)) / corruptionDivisor
  }
}
