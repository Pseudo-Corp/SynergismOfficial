import { player } from '../../../../Synergism'
import type { AntUpgrades } from '../structs/structs'
import { computeFreeAntUpgradeLevels } from './free-levels'

export const calculateTrueAntLevel = (antUpgrade: AntUpgrades) => {
  const freeLevels = computeFreeAntUpgradeLevels()
  const corruptionDivisor = player.corruptions.used.corruptionEffects('extinction')
  if (player.currentChallenge.ascension === 11) {
    return freeLevels / corruptionDivisor
  } else {
    return (player.ants.upgrades[antUpgrade]
      + Math.min(player.ants.upgrades[antUpgrade], freeLevels)) / corruptionDivisor
  }
}
