import i18next from 'i18next'
import { type AmbrosiaUpgradeNames, ambrosiaUpgrades } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import type { RedAmbrosiaNames } from './RedAmbrosiaUpgrades'
import { CloseModal, MEDIUM_MODAL_UPDATE_TICK, Modal } from './UpdateHTML'
import {
  ambrosiaBonusesHTML,
  ambrosiaLuckHTML,
  purpleAmbrosiaBonusesHTML,
  redAmbrosiaBonusesHTML,
  redAmbrosiaLuckHTML
} from './UpdateVisuals'
import { isMobile } from './Utility'

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

interface AmbrosiaLedgerModal {
  elementId: string
  img: string
  titleKey: string
  color: string
  detailsHTML: () => string
}

const ambrosiaLedgerModals: AmbrosiaLedgerModal[] = [
  {
    elementId: 'ambrosiaResourceHeader',
    img: 'Pictures/Default/Ambrosia.png',
    titleKey: 'ambrosia.ambrosia',
    color: 'var(--amber-text-color)',
    detailsHTML: ambrosiaBonusesHTML
  },
  {
    elementId: 'ambrosiaLuck',
    img: 'Pictures/Default/Ambrosia.png',
    titleKey: 'ambrosia.ledger.luckTitle',
    color: 'var(--amber-text-color)',
    detailsHTML: ambrosiaLuckHTML
  },
  {
    elementId: 'redAmbrosiaResourceHeader',
    img: 'Pictures/RedAmbrosia/RedAmbrosia.png',
    titleKey: 'redAmbrosia.redAmbrosia',
    color: 'var(--red-text-color)',
    detailsHTML: redAmbrosiaBonusesHTML
  },
  {
    elementId: 'redAmbrosiaLuck',
    img: 'Pictures/RedAmbrosia/RedAmbrosia.png',
    titleKey: 'ambrosia.ledger.redLuckTitle',
    color: 'var(--red-text-color)',
    detailsHTML: redAmbrosiaLuckHTML
  },
  {
    elementId: 'purpleAmbrosiaResourceHeader',
    img: 'Pictures/PurpleAmbrosia/PurpleAmbrosia.png',
    titleKey: 'purpleReactor.synthesis.purpleAmbrosia',
    color: 'var(--purple-text-color)',
    detailsHTML: purpleAmbrosiaBonusesHTML
  }
]

const ambrosiaLedgerModalHTML = ({ img, titleKey, color, detailsHTML }: AmbrosiaLedgerModal) =>
  `<div class="achievementDetailsModal" data-modal-preserve="children">
    <div class="achievementDetailsModalTitle" data-modal-preserve="children">
      <img src="${img}" alt="">
      <span style="color:${color}">${i18next.t(titleKey)}</span>
    </div>
    <div class="achievementDetailsModalInfo">${detailsHTML()}</div>
  </div>`

export const initializeAmbrosiaLedgerModals = () => {
  for (const modal of ambrosiaLedgerModals) {
    const element = DOMCacheGetOrSet(modal.elementId)
    const html = () => ambrosiaLedgerModalHTML(modal)
    const styles = { borderColor: modal.color }

    if (isMobile) {
      element.addEventListener('click', (event: MouseEvent) => {
        Modal(html, event.clientX, event.clientY, styles, MEDIUM_MODAL_UPDATE_TICK, element)
      })
      continue
    }

    element.addEventListener('mousemove', (event: MouseEvent) => {
      Modal(html, event.clientX, event.clientY, styles, MEDIUM_MODAL_UPDATE_TICK)
    })
    element.addEventListener('focus', () => {
      const rect = element.getBoundingClientRect()
      Modal(html, rect.x, rect.y + rect.height / 2, styles, MEDIUM_MODAL_UPDATE_TICK)
    })
    // mouseleave rather than mouseout, so moving between the icon and the name does not flicker
    element.addEventListener('mouseleave', CloseModal)
    element.addEventListener('blur', CloseModal)
  }
}
