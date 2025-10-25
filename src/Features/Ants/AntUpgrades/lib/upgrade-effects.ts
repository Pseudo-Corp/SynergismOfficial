import { antUpgradeData } from '../data/data'
import type { AntUpgrades, AntUpgradeTypeMap } from '../structs/structs'
import { calculateTrueAntLevel } from './total-levels'

export const getAntUpgradeEffect = <K extends AntUpgrades>(antUpgrade: K): AntUpgradeTypeMap[K] => {
  const actualLevel = calculateTrueAntLevel(antUpgrade)
  return antUpgradeData[antUpgrade].effect(actualLevel)
}
