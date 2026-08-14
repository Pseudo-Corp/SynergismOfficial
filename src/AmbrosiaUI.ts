import i18next from 'i18next'
import { type AmbrosiaUpgradeNames, ambrosiaUpgrades, getAmbrosiaUpgradeEffects } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateAmbrosiaBarRequirementMultiplier,
  calculatePurpleHoneyConversionFactor,
  calculateRequiredBlueberryTime,
  calculateRequiredRedAmbrosiaTime
} from './Calculate'
import { getPurpleAmbrosiaUpgradeEffects } from './PurpleAmbrosiaUpgrades'
import type { RedAmbrosiaNames } from './RedAmbrosiaUpgrades'
import { getShopUpgradeEffects } from './Shop'
import { getSingularityChallengeEffect } from './SingularityChallenges'
import { allPurpleHoneyProgressRequirementStats } from './Statistics'
import { format, player } from './Synergism'
import { CloseModal, MEDIUM_MODAL_UPDATE_TICK, Modal } from './UpdateHTML'
import { isMobile } from './Utility'
import { Globals as G } from './Variables'

type AmbrosiaBar = 'ambrosia' | 'red' | 'purple'

const ambrosiaBars = [
  { id: 'ambrosiaProgressBar', type: 'ambrosia' },
  { id: 'pixelProgressBar', type: 'red' },
  { id: 'purpleHoneyProgressBar', type: 'purple' }
] as const

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

export const ambrosiaBarDetails = (type: AmbrosiaBar): string => {
  const lines: string[] = []
  const valueLine = (key: string, value: number) => {
    lines.push(i18next.t('ambrosia.barDetails.value', {
      label: i18next.t(`ambrosia.barDetails.${key}`),
      value: format(value, 2, true)
    }))
  }
  const multiplierLine = (label: string, value: number) => {
    if (value !== 1) {
      lines.push(i18next.t('ambrosia.barDetails.multiplier', {
        label,
        value: format(value, 4, true)
      }))
    }
  }

  if (type === 'purple') {
    for (const [index, line] of allPurpleHoneyProgressRequirementStats.lines.entries()) {
      if (index === 0) {
        valueLine('base', line.stat())
      } else {
        multiplierLine(i18next.t(`statistics.purpleHoneyProgressRequirementStats.${line.i18n}`), line.stat())
      }
    }
    valueLine('total', calculatePurpleHoneyConversionFactor())
  } else {
    if (type === 'ambrosia') {
      valueLine('base', G.TIME_PER_AMBROSIA)
      valueLine('lifetimeAddition', Math.floor(player.lifetimeAmbrosia / 300))
      multiplierLine(
        i18next.t('shop.names.shopAmbrosiaAccelerator'),
        getShopUpgradeEffects('shopAmbrosiaAccelerator', 'ambrosiaPointRequirementMult')
      )
      multiplierLine(
        i18next.t('ambrosia.data.ambrosiaBrickOfLead.name'),
        getAmbrosiaUpgradeEffects('ambrosiaBrickOfLead', 'barRequirementMult')
      )
      if (player.lifetimeAmbrosia >= 10000) {
        multiplierLine(
          i18next.t('ambrosia.barDetails.lifetimeScaling'),
          Math.pow(player.lifetimeAmbrosia / 10000, Math.log10(4))
        )
        lines.push(i18next.t('ambrosia.barDetails.rounding'))
      }
    } else {
      valueLine('base', G.TIME_PER_RED_AMBROSIA)
      valueLine('redLifetimeAddition', 2 * player.lifetimeRedAmbrosia)
      const limitedTime = getSingularityChallengeEffect('limitedTime', 'barRequirementMultiplier')
      multiplierLine(i18next.t('singularityChallenge.data.limitedTime.name'), limitedTime)
      valueLine('cap', 10000 * limitedTime)
    }
    if (player.purpleAmbrosiaUpgrades.gemini > 0) {
      const gemini = calculateAmbrosiaBarRequirementMultiplier()
      multiplierLine(i18next.t('purpleAmbrosia.data.gemini.name'), gemini)
      if (gemini === 1) {
        lines.push(i18next.t('ambrosia.barDetails.geminiInactive', {
          value: format(getPurpleAmbrosiaUpgradeEffects('gemini', 'ambrosiaRequirementMult'), 2, true)
        }))
      }
    }
    valueLine('total', type === 'ambrosia' ? calculateRequiredBlueberryTime() : calculateRequiredRedAmbrosiaTime())
  }

  return `<p>${i18next.t(`ambrosia.barDetails.${type}`)}</p><p>${lines.join('<br>')}</p>`
}

export const initializeAmbrosiaBarDetails = () => {
  if (isMobile) initializeMobileAmbrosiaLedger()

  for (const { id, type } of ambrosiaBars) {
    const element = DOMCacheGetOrSet(id)
    element.tabIndex = 0
    const open = (x = 0, y = 0) =>
      Modal(
        () => ambrosiaBarDetails(type),
        x,
        y,
        {},
        MEDIUM_MODAL_UPDATE_TICK,
        { targetElement: element }
      )
    if (isMobile) {
      element.addEventListener('click', () => open())
    } else {
      element.addEventListener('mouseenter', (event) => open(event.clientX, event.clientY))
      element.addEventListener('mouseleave', CloseModal)
      element.addEventListener('focus', () => open())
      element.addEventListener('blur', CloseModal)
    }
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') CloseModal()
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        open()
      }
    })
  }
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
    'ambrosiaObtainium1',
    'ambrosiaOffering1',
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
