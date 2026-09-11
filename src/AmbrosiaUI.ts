import i18next from 'i18next'
import { type AmbrosiaUpgradeNames, ambrosiaUpgrades } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import type { RedAmbrosiaNames } from './RedAmbrosiaUpgrades'
import { MEDIUM_MODAL_UPDATE_TICK, Modal } from './UpdateHTML'
import { isMobile } from './Utility'

const ambrosiaBalances = [
  { amountId: 'ambrosiaAmount', nameId: 'ambrosiaLedgerName', sectionId: 'ambrosiaDisplay' },
  { amountId: 'redAmbrosiaAmount', nameId: 'redAmbrosiaLedgerName', sectionId: 'redAmbrosiaDisplay' },
  { amountId: 'purpleAmbrosiaAmount', nameId: 'purpleAmbrosiaLedgerName', sectionId: 'purpleAmbrosiaDisplay' },
  { amountId: 'blueberryAmount', nameId: 'blueberryLedgerName', sectionId: 'blueberryDisplay' }
] as const

const ambrosiaBalanceDetails = (): string => {
  const content = document.createElement('div')
  for (const { amountId, nameId, sectionId } of ambrosiaBalances) {
    if (DOMCacheGetOrSet(sectionId).hidden) continue
    const line = document.createElement('p')
    const name = document.createElement('strong')
    name.textContent = DOMCacheGetOrSet(nameId).textContent
    line.append(name, document.createElement('br'))
    // Reuse the live, localized balance description maintained by UpdateVisuals.
    line.append(DOMCacheGetOrSet(amountId).getAttribute('aria-label') ?? '')
    content.append(line)
  }
  return content.innerHTML
}

const initializeMobileAmbrosiaLedger = () => {
  DOMCacheGetOrSet('ambrosiaLedgerControls').hidden = false
  const details = DOMCacheGetOrSet('ambrosiaBalanceDetails')
  details.addEventListener('click', () => {
    Modal(ambrosiaBalanceDetails, 0, 0, {}, MEDIUM_MODAL_UPDATE_TICK, { targetElement: details })
  })

  const toggle = DOMCacheGetOrSet('ambrosiaToggleBonuses')
  toggle.addEventListener('click', () => {
    const collapsed = DOMCacheGetOrSet('ambrosiaLedger').classList.toggle('ambrosiaLedgerBonusesCollapsed')
    const label = collapsed ? 'ambrosia.ledger.showBonuses' : 'ambrosia.ledger.hideBonuses'
    toggle.setAttribute('aria-expanded', String(!collapsed))
    toggle.setAttribute('i18n', label)
    toggle.textContent = i18next.t(label)
  })
}

export const initializeAmbrosiaLedger = () => {
  if (isMobile) initializeMobileAmbrosiaLedger()
}

// Keep prerequisite upgrades before their dependents within each group.
// Cross-group prerequisites remain visible through the existing hover highlights.
// General upgrades occupy the first column. The remaining six groups each occupy
// one row of at most seven upgrades, with hybrids below their base modules.
const blueberryUpgradeGroups = {
  general: [
    'ambrosiaTutorial',
    'ambrosiaPatreon',
    'ambrosiaBrickOfLead',
    'twoMind',
    'ambrosiaObtainium1',
    'ambrosiaHyperflux'
  ],
  quarks: [
    'ambrosiaQuarks1',
    'ambrosiaQuarks2',
    'ambrosiaQuarks3',
    'ambrosiaQuarks4',
    'ambrosiaFreeQuarkUpgrades'
  ],
  cubes: [
    'ambrosiaCubes1',
    'ambrosiaCubes2',
    'ambrosiaCubes3',
    'ambrosiaCubes4',
    'ambrosiaFreeCubeUpgrades'
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
    'ambrosiaQuarkCube1',
    'ambrosiaLuckCube1',
    'ambrosiaQuarkLuck1',
    'ambrosiaCubeLuck1'
  ],
  resources: [
    'ambrosiaBaseObtainium1',
    'ambrosiaBaseObtainium2',
    'ambrosiaFreeObtainiumUpgrades',
    'ambrosiaOffering1',
    'ambrosiaBaseOffering1',
    'ambrosiaBaseOffering2',
    'ambrosiaFreeOfferingUpgrades'
  ],
  utility: [
    'ambrosiaSingReduction1',
    'ambrosiaSingReduction2',
    'ambrosiaTalismanBonusRuneLevel',
    'ambrosiaRuneOOMBonus',
    'ambrosiaInfiniteShopUpgrades1',
    'ambrosiaInfiniteShopUpgrades2',
    'ambrosiaInfiniteShopUpgrades3'
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
    'redGenerationSpeed2',
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
