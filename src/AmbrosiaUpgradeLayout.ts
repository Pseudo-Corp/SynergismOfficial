import { type AmbrosiaUpgradeNames, ambrosiaUpgrades } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import type { RedAmbrosiaNames } from './RedAmbrosiaUpgrades'

// Keep prerequisite upgrades before their dependents within each group.
// Cross-group prerequisites remain visible through the existing hover highlights.
// General upgrades occupy the first column. The remaining six groups each occupy
// one row of at most seven upgrades, with hybrids below their base modules.
const blueberryUpgradeGroups = {
  general: [
    'ambrosiaTutorial',
    'ambrosiaPatreon',
    'ambrosiaObtainium1',
    'ambrosiaOffering1',
    'ambrosiaHyperflux',
    'ambrosiaBrickOfLead'
  ],
  quarks: [
    'ambrosiaQuarks1',
    'ambrosiaQuarks2',
    'ambrosiaQuarks3',
    'ambrosiaFreeQuarkUpgrades'
  ],
  cubes: [
    'ambrosiaCubes1',
    'ambrosiaCubes2',
    'ambrosiaCubes3'
  ],
  luck: [
    'ambrosiaLuck1',
    'ambrosiaLuck2',
    'ambrosiaLuck3',
    'ambrosiaLuck4',
    'ambrosiaFreeLuckUpgrades',
    'ambrosiaFreeRedLuckUpgrades',
    'ambrosiaFreeGenerationUpgrades'
  ],
  hybrids: [
    'ambrosiaCubeQuark1',
    'ambrosiaLuckQuark1',
    'ambrosiaLuckCube1',
    'ambrosiaQuarkCube1',
    'ambrosiaCubeLuck1',
    'ambrosiaQuarkLuck1'
  ],
  resources: [
    'ambrosiaBaseObtainium1',
    'ambrosiaBaseOffering1',
    'ambrosiaBaseObtainium2',
    'ambrosiaBaseOffering2'
  ],
  utility: [
    'ambrosiaSingReduction1',
    'ambrosiaSingReduction2',
    'ambrosiaTalismanBonusRuneLevel',
    'ambrosiaRuneOOMBonus',
    'ambrosiaInfiniteShopUpgrades1',
    'ambrosiaInfiniteShopUpgrades2'
  ]
} as const satisfies Record<string, readonly AmbrosiaUpgradeNames[]>

// Each group occupies one row, in display order.
const redAmbrosiaUpgradeGroups = {
  miscellaneous: ['tutorial', 'viscount', 'salvageYinYang'],
  freeBlueberryLevels: ['freeTutorialLevels', 'freeLevelsRow2', 'freeLevelsRow3', 'freeLevelsRow4', 'freeLevelsRow5'],
  redAmbrosiaResources: ['redAmbrosiaCube', 'redAmbrosiaCubeImprover', 'redAmbrosiaObtainium', 'redAmbrosiaOffering'],
  freeLevels: [
    'freeOfferingUpgrades',
    'freeObtainiumUpgrades',
    'freeCubeUpgrades',
    'freeSpeedUpgrades',
    'infiniteShopUpgrades',
    'redAmbrosiaFreeAccumulator'
  ],
  luck: [
    'redLuck',
    'conversionImprovement1',
    'conversionImprovement2',
    'conversionImprovement3',
    'regularLuck',
    'regularLuck2'
  ],
  barSpeed: [
    'blueberryGenerationSpeed',
    'blueberryGenerationSpeed2',
    'blueberries',
    'redGenerationSpeed',
    'redAmbrosiaAccelerator'
  ]
} as const satisfies Record<string, readonly RedAmbrosiaNames[]>

export const initializeAmbrosiaUpgradeLayout = () => {
  const container = DOMCacheGetOrSet('blueberryUpgradeGroups')
  for (const [key, upgrades] of Object.entries(blueberryUpgradeGroups)) {
    const group = document.createElement('div')
    group.className = 'blueberryUpgradeGroup ambrosiaUpgradeGroup'
    group.dataset.upgradeGroup = key
    for (const upgrade of upgrades) {
      const button = DOMCacheGetOrSet(upgrade)
      button.classList.add(ambrosiaUpgrades[upgrade].unlockCriterion)
      group.appendChild(button)
    }
    container.appendChild(group)
  }

  const redContainer = DOMCacheGetOrSet('redAmbrosiaUpgradeGroups')
  for (const [key, upgrades] of Object.entries(redAmbrosiaUpgradeGroups)) {
    const group = document.createElement('div')
    group.className = 'ambrosiaUpgradeGroup'
    group.dataset.upgradeGroup = key
    for (const upgrade of upgrades) {
      const id = `redAmbrosia${upgrade[0].toUpperCase()}${upgrade.slice(1)}`
      group.appendChild(DOMCacheGetOrSet(id))
    }
    redContainer.appendChild(group)
  }
}
