import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  buyPurpleReactorUpgradeLevel,
  getPurpleReactorUpgradePurchase,
  type PurpleReactorNames,
  type PurpleReactorPurchaseAmount,
  purpleReactorUpgrades,
  purpleReactorUpgradeToString
} from './Purple'
import { format, player } from './Synergism'

const purplePopupMediaQuery = window.matchMedia('(width <= 1024px)')

interface PurpleUpgradeTierData {
  readonly key: PurpleReactorNames
  readonly icon: string
}

interface PurpleUpgradeFamilyData {
  readonly id: string
  readonly tiers: readonly PurpleUpgradeTierData[]
}

interface PurpleUpgradeSectionData {
  readonly id: string
  readonly families: readonly PurpleUpgradeFamilyData[]
}

const purpleUpgradePurchaseButtons = [
  { id: 'purpleUpgradeDetailBuyOne', amount: 1 },
  { id: 'purpleUpgradeDetailBuyTen', amount: 10 },
  { id: 'purpleUpgradeDetailBuyHundred', amount: 100 },
  { id: 'purpleUpgradeDetailBuyThousand', amount: 1000 },
  { id: 'purpleUpgradeDetailBuyMax', amount: 'max' }
] as const satisfies readonly { id: string; amount: PurpleReactorPurchaseAmount }[]

const purpleUpgradeSections = [
  {
    id: 'intro',
    families: [
      {
        id: 'tutorial',
        tiers: [{ key: 'tutorial', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleTutorial.png' }]
      }
    ]
  },
  {
    id: 'reactor',
    families: [
      {
        id: 'capacity',
        tiers: [
          {
            key: 'purpleCapacityExpander1',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleCapacityExpander1.png'
          },
          {
            key: 'purpleCapacityExpander2',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleCapacityExpander2.png'
          },
          {
            key: 'purpleCapacityExpander3',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleCapacityExpander3.png'
          },
          {
            key: 'purpleCapacityExpander4',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleCapacityExpander4.png'
          }
        ]
      },
      {
        id: 'efficiency',
        tiers: [
          {
            key: 'purpleEfficiency1',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleEfficiency1.png'
          },
          {
            key: 'purpleEfficiency2',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleEfficiency2.png'
          },
          {
            key: 'purpleEfficiency3',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleEfficiency3.png'
          },
          {
            key: 'purpleEfficiency4',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleEfficiency4.png'
          }
        ]
      },
      {
        id: 'honeyLuck',
        tiers: [
          {
            key: 'purpleHoneyLuck1',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyLuck1.png'
          },
          {
            key: 'purpleHoneyLuck2',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyLuck2.png'
          },
          {
            key: 'purpleHoneyLuck3',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyLuck3.png'
          },
          {
            key: 'purpleHoneyLuck4',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyLuck4.png'
          }
        ]
      },
      {
        id: 'halfLife',
        tiers: [
          { key: 'purpleHalfLife1', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife1.png' },
          { key: 'purpleHalfLife2', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife2.png' },
          { key: 'purpleHalfLife3', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife3.png' },
          { key: 'purpleHalfLife4', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife4.png' }
        ]
      },
      {
        id: 'requirementReduction',
        tiers: [
          {
            key: 'purpleHoneyRequirementReduction1',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyRequirementReduction1.png'
          },
          {
            key: 'purpleHoneyRequirementReduction2',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyRequirementReduction2.png'
          },
          {
            key: 'purpleHoneyRequirementReduction3',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyRequirementReduction3.png'
          },
          {
            key: 'purpleHoneyRequirementReduction4',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleHoneyRequirementReduction4.png'
          }
        ]
      }
    ]
  },
  {
    id: 'honeyPower',
    families: [
      {
        id: 'lifetimeHoneyBonuses',
        tiers: [
          { key: 'lifetimeHoneyQuarks', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyQuarks.png' },
          {
            key: 'lifetimeHoneyGlobalSpeed',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyGlobalSpeed.png'
          },
          {
            key: 'lifetimeHoneyAscensionSpeed',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyAscensionSpeed.png'
          },
          {
            key: 'lifetimeHoneyAmbrosia',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyAmbrosia.png'
          },
          {
            key: 'lifetimeHoneyRedAmbrosia',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyRedAmbrosia.png'
          },
          {
            key: 'lifetimeHoneyAntELO',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyAntElo.png'
          },
          {
            key: 'lifetimeHoneyRebornELOSpeed',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyRebornELOSpeed.png'
          }
        ]
      }
    ]
  },
  {
    id: 'resources',
    families: [
      {
        id: 'offerings',
        tiers: [{ key: 'offerings', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleOfferings.png' }]
      },
      {
        id: 'obtainium',
        tiers: [{ key: 'obtainium', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleObtainium.png' }]
      },
      {
        id: 'purpleQuarkGain',
        tiers: [{ key: 'purpleQuarkGain', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePurpleQuarkGain.png' }]
      }
    ]
  },
  {
    id: 'miscellaneous',
    families: [
      {
        id: 'paperweight',
        tiers: [{ key: 'paperweight', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePaperweight.png' }]
      }
    ]
  }
] as const satisfies readonly PurpleUpgradeSectionData[]

type CoveredPurpleUpgrade = (typeof purpleUpgradeSections)[number]['families'][number]['tiers'][number]['key']
type UncoveredPurpleUpgrade = Exclude<PurpleReactorNames, CoveredPurpleUpgrade>
export const purpleUpgradeFamilyCoverage: [UncoveredPurpleUpgrade] extends [never] ? true : UncoveredPurpleUpgrade =
  true

let selectedFamily: PurpleUpgradeFamilyData = purpleUpgradeSections[0].families[0]
let selectedTier: PurpleReactorNames = purpleUpgradeSections[0].families[0].tiers[0].key
let lastDetailHTML = ''

export type PurpleReactorPopupMode = 'upgrades' | 'synthesis' | null

let purpleReactorPopupMode: PurpleReactorPopupMode = null

const tierMaxed = (key: PurpleReactorNames) => {
  const upgrade = purpleReactorUpgrades[key]
  return upgrade.level === upgrade.maxLevel
}

const nextLevelCost = (key: PurpleReactorNames) => {
  const upgrade = purpleReactorUpgrades[key]
  return tierMaxed(key) ? 0 : upgrade.costFormula(upgrade.level + 1) - upgrade.costFormula(upgrade.level)
}

const frontierTier = (family: PurpleUpgradeFamilyData) => {
  return family.tiers.find((tier) => !tierMaxed(tier.key)) ?? family.tiers[family.tiers.length - 1]
}

const familyNameKey = (family: PurpleUpgradeFamilyData) => {
  return family.tiers.length > 1
    ? `purpleReactor.upgradeShop.familyNames.${family.id}`
    : `purpleReactor.upgrades.${family.tiers[0].key}.name`
}

const scrollToDetailOnMobile = () => {
  if (purplePopupMediaQuery.matches) {
    DOMCacheGetOrSet('purpleUpgradeDetail').scrollTo({ behavior: 'smooth', top: 0 })
  }
}

export const getPurpleReactorPopupMode = () => purpleReactorPopupMode

export const setPurpleReactorPopupMode = (mode: PurpleReactorPopupMode) => {
  purpleReactorPopupMode = mode
  const container = DOMCacheGetOrSet('singularityPurple')
  const upgradesOpen = mode === 'upgrades'
  const synthesisOpen = mode === 'synthesis'
  const popupOpen = mode !== null

  container.hidden = !popupOpen
  container.classList.toggle('purpleSynthesisOpen', synthesisOpen)
  DOMCacheGetOrSet('purpleUpgradeContainer').hidden = !upgradesOpen
  DOMCacheGetOrSet('purpleSynthesisContainer').hidden = !synthesisOpen

  const upgradeToggle = DOMCacheGetOrSet('purpleUpgradeToggle')
  upgradeToggle.setAttribute('aria-expanded', `${upgradesOpen}`)

  const synthesisToggle = DOMCacheGetOrSet('purpleSynthesisToggle')
  synthesisToggle.setAttribute('aria-expanded', `${synthesisOpen}`)

  DOMCacheGetOrSet('purpleReactantContainers').classList.toggle('purplePopupOpen', popupOpen)

  if (upgradesOpen) {
    updatePurpleUpgradeTab()
  }

  if (popupOpen && purplePopupMediaQuery.matches) {
    requestAnimationFrame(() => container.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

const selectPurpleUpgradeFamily = (
  family: PurpleUpgradeFamilyData,
  tier = frontierTier(family).key,
  scrollToDetail = true
) => {
  selectedFamily = family
  selectedTier = tier
  updatePurpleUpgradeTab()

  if (scrollToDetail) {
    scrollToDetailOnMobile()
  }
}

const createFamilyRow = (family: PurpleUpgradeFamilyData) => {
  const row = document.createElement('div')
  row.id = `purpleUpgradeFamilyRow-${family.id}`
  row.className = 'purpleUpgradeFamilyRow'

  const familyButton = document.createElement('button')
  familyButton.type = 'button'
  familyButton.id = `purpleUpgradeFamilyButton-${family.id}`
  familyButton.className = 'purpleUpgradeFamilyButton'

  const icon = document.createElement('img')
  icon.className = 'purpleUpgradeFamilyRowIcon'
  icon.src = family.tiers[0].icon
  icon.alt = ''
  icon.loading = 'lazy'

  const info = document.createElement('span')
  info.className = 'purpleUpgradeFamilyRowInfo'

  const name = document.createElement('span')
  name.className = 'purpleUpgradeFamilyRowName'
  name.setAttribute('i18n', familyNameKey(family))
  name.textContent = i18next.t(familyNameKey(family))

  const cost = document.createElement('span')
  cost.id = `purpleUpgradeFamilyRowCost-${family.id}`
  cost.className = 'purpleUpgradeFamilyRowCost'

  info.append(name, cost)
  familyButton.append(icon, info)
  familyButton.addEventListener('click', () => selectPurpleUpgradeFamily(family))
  row.appendChild(familyButton)

  if (family.tiers.length > 1) {
    const shortcuts = document.createElement('span')
    shortcuts.className = 'purpleUpgradeFamilyRowTiers'

    for (const tier of family.tiers) {
      const shortcut = document.createElement('button')
      shortcut.type = 'button'
      shortcut.id = `purpleUpgradeTierShortcut-${tier.key}`
      shortcut.className = 'purpleUpgradeTierShortcut'
      shortcut.title = i18next.t(`purpleReactor.upgrades.${tier.key}.name`)
      shortcut.setAttribute('aria-label', shortcut.title)

      const shortcutIcon = document.createElement('img')
      shortcutIcon.src = tier.icon
      shortcutIcon.alt = ''
      shortcutIcon.loading = 'lazy'

      shortcut.appendChild(shortcutIcon)
      shortcut.addEventListener('click', () => selectPurpleUpgradeFamily(family, tier.key))
      shortcuts.appendChild(shortcut)
    }

    row.appendChild(shortcuts)
  }

  return row
}

const createTierChip = (family: PurpleUpgradeFamilyData, tier: PurpleUpgradeTierData) => {
  const chip = document.createElement('button')
  chip.type = 'button'
  chip.id = `purpleUpgradeTierChip-${tier.key}`
  chip.className = 'purpleUpgradeTierChip'
  chip.title = i18next.t(`purpleReactor.upgrades.${tier.key}.name`)
  chip.setAttribute('aria-label', chip.title)

  const icon = document.createElement('img')
  icon.src = tier.icon
  icon.alt = ''
  icon.loading = 'lazy'

  const level = document.createElement('span')
  level.id = `purpleUpgradeTierChipLevel-${tier.key}`

  chip.append(icon, level)
  chip.addEventListener('click', () => selectPurpleUpgradeFamily(family, tier.key, false))
  return chip
}

const buySelectedUpgrade = async (purchaseAmount: PurpleReactorPurchaseAmount) => {
  await buyPurpleReactorUpgradeLevel(selectedTier, purchaseAmount)
}

export const generatePurpleUpgradeTabHTML = () => {
  const popup = DOMCacheGetOrSet('singularityPurple')
  const main = popup.closest('main')
  if (main !== null) {
    new ResizeObserver(() => {
      popup.style.setProperty('--purple-popup-viewport-height', `${main.clientHeight}px`)
    }).observe(main)
  }

  const list = DOMCacheGetOrSet('purpleUpgradeFamilyList')
  const rail = DOMCacheGetOrSet('purpleUpgradeTierRail')

  for (const section of purpleUpgradeSections) {
    const header = document.createElement('p')
    header.id = `purpleUpgradeSection-${section.id}`
    header.className = 'purpleUpgradeSectionHeader'
    header.setAttribute('i18n', `purpleReactor.upgradeShop.sections.${section.id}`)
    header.textContent = i18next.t(`purpleReactor.upgradeShop.sections.${section.id}`)
    list.appendChild(header)

    for (const family of section.families) {
      list.appendChild(createFamilyRow(family))
      for (const tier of family.tiers) {
        rail.appendChild(createTierChip(family, tier))
      }
    }
  }

  for (const { id, amount } of purpleUpgradePurchaseButtons) {
    DOMCacheGetOrSet(id).addEventListener('click', () => {
      void buySelectedUpgrade(amount)
    })
  }
  DOMCacheGetOrSet('purpleUpgradeToggle').addEventListener('click', () => {
    setPurpleReactorPopupMode(purpleReactorPopupMode === 'upgrades' ? null : 'upgrades')
  })
  DOMCacheGetOrSet('purpleUpgradeClose').addEventListener('click', () => {
    setPurpleReactorPopupMode(null)
    DOMCacheGetOrSet('purpleUpgradeToggle').focus()
  })
  setPurpleReactorPopupMode(null)
  selectPurpleUpgradeFamily(purpleUpgradeSections[0].families[0], undefined, false)
}

const updateDetail = () => {
  for (const section of purpleUpgradeSections) {
    for (const family of section.families) {
      const isSelectedFamily = family === selectedFamily
      for (const tier of family.tiers) {
        const upgrade = purpleReactorUpgrades[tier.key]
        const maxed = tierMaxed(tier.key)
        const chip = DOMCacheGetOrSet(`purpleUpgradeTierChip-${tier.key}`)
        const levelText = i18next.t('purpleReactor.upgradeShop.level', {
          current: format(upgrade.level, 0, true),
          max: format(upgrade.maxLevel, 0, true)
        })
        chip.style.display = isSelectedFamily ? '' : 'none'
        chip.classList.toggle('purpleUpgradeTierSelected', tier.key === selectedTier)
        chip.classList.toggle('purpleUpgradeTierMaxed', maxed)
        chip.setAttribute('aria-pressed', `${tier.key === selectedTier}`)
        chip.setAttribute(
          'aria-label',
          `${i18next.t(`purpleReactor.upgrades.${tier.key}.name`)}. ${
            maxed ? i18next.t('purpleReactor.upgradeShop.maxed') : levelText
          }`
        )
        DOMCacheGetOrSet(`purpleUpgradeTierChipLevel-${tier.key}`).textContent = upgrade.maxLevel === 1
          ? (maxed ? '✓' : '✕')
          : levelText
      }
    }
  }

  const detailHTML = purpleReactorUpgradeToString(selectedTier)
  if (detailHTML !== lastDetailHTML) {
    DOMCacheGetOrSet('purpleUpgradeDetailText').innerHTML = detailHTML
    lastDetailHTML = detailHTML
  }
  DOMCacheGetOrSet('purpleUpgradeDetail').setAttribute(
    'aria-label',
    i18next.t(`purpleReactor.upgrades.${selectedTier}.name`)
  )

  const upgrade = purpleReactorUpgrades[selectedTier]
  const remainingLevels = upgrade.maxLevel - upgrade.level
  const maxed = remainingLevels === 0

  for (const { id, amount } of purpleUpgradePurchaseButtons) {
    const purchase = getPurpleReactorUpgradePurchase(selectedTier, amount)
    const button = DOMCacheGetOrSet(id) as HTMLButtonElement
    const redundantAtMax = amount !== 'max' && amount !== 1 && amount === remainingLevels
    button.hidden = maxed || redundantAtMax || (amount === 'max' ? remainingLevels === 1 : amount > remainingLevels)
    button.disabled = purchase.amount === 0 || player.purpleReactor.purpleHoney < purchase.cost
    const amountText = amount === 'max'
      ? i18next.t('purpleReactor.upgradeShop.purchaseMax')
      : i18next.t('purpleReactor.upgradeShop.purchaseAmount', { amount: format(amount, 0, true) })
    const costText = i18next.t('purpleReactor.upgradeShop.purchaseCost', {
      cost: format(purchase.cost, 2, true)
    })
    button.textContent = `${amountText}\n${costText}`
  }
}

export const updatePurpleUpgradeTab = () => {
  if (purpleReactorPopupMode !== 'upgrades') {
    return
  }

  for (const section of purpleUpgradeSections) {
    for (const family of section.families) {
      const selected = family === selectedFamily
      const row = DOMCacheGetOrSet(`purpleUpgradeFamilyRow-${family.id}`)
      const familyButton = DOMCacheGetOrSet(`purpleUpgradeFamilyButton-${family.id}`)
      row.classList.toggle('purpleUpgradeFamilySelected', selected)
      familyButton.setAttribute('aria-pressed', `${selected}`)

      const frontier = family.tiers.find((tier) => !tierMaxed(tier.key))
      const cost = DOMCacheGetOrSet(`purpleUpgradeFamilyRowCost-${family.id}`)
      if (frontier === undefined) {
        cost.textContent = i18next.t('purpleReactor.upgradeShop.maxed')
        cost.classList.add('purpleUpgradeFamilyMaxed')
        cost.classList.remove('purpleUpgradeCantAfford')
      } else {
        const price = nextLevelCost(frontier.key)
        const costKey = purpleReactorUpgrades[frontier.key].maxLevel === 1
          ? 'purpleReactor.upgradeShop.cost'
          : 'purpleReactor.upgradeShop.nextCost'
        cost.textContent = i18next.t(costKey, { cost: format(price, 2, true) })
        cost.classList.remove('purpleUpgradeFamilyMaxed')
        cost.classList.toggle('purpleUpgradeCantAfford', player.purpleReactor.purpleHoney < price)
      }

      for (const tier of family.tiers) {
        const title = i18next.t(`purpleReactor.upgrades.${tier.key}.name`)
        const chip = DOMCacheGetOrSet(`purpleUpgradeTierChip-${tier.key}`)
        chip.title = title
        chip.setAttribute('aria-label', title)

        if (family.tiers.length > 1) {
          const shortcut = DOMCacheGetOrSet(`purpleUpgradeTierShortcut-${tier.key}`)
          shortcut.title = title
          shortcut.setAttribute(
            'aria-label',
            `${title}. ${
              tierMaxed(tier.key)
                ? i18next.t('purpleReactor.upgradeShop.maxed')
                : i18next.t('purpleReactor.upgradeShop.level', {
                  current: format(purpleReactorUpgrades[tier.key].level, 0, true),
                  max: format(purpleReactorUpgrades[tier.key].maxLevel, 0, true)
                })
            }`
          )
          shortcut.setAttribute('aria-pressed', `${selected && tier.key === selectedTier}`)
          shortcut.classList.toggle('purpleUpgradeTierShortcutMaxed', tierMaxed(tier.key))
          shortcut.classList.toggle(
            'purpleUpgradeTierShortcutSelected',
            selected && tier.key === selectedTier
          )
        }
      }
    }
  }

  updateDetail()
}
