import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  buyPurpleReactorUpgradeLevel,
  maximumAffordableLevel,
  type PurpleReactorNames,
  purpleReactorUpgrades,
  purpleReactorUpgradeToString
} from './Purple'
import { format, player } from './Synergism'
import { isMobile } from './Utility'

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

const purpleUpgradeSections = [
  {
    id: 'intro',
    families: [
      {
        id: 'tutorial',
        tiers: [{ key: 'tutorial', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleTutorial.png' }]
      },
      {
        id: 'paperweight',
        tiers: [{ key: 'paperweight', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurplePaperweight.png' }]
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
        id: 'halfLife',
        tiers: [
          { key: 'purpleHalfLife1', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife1.png' },
          { key: 'purpleHalfLife2', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife2.png' },
          { key: 'purpleHalfLife3', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife3.png' },
          { key: 'purpleHalfLife4', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/PurpleHalfLife4.png' }
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
        id: 'highestHoneyQuarks',
        tiers: [{ key: 'highestHoneyQuarks', icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyQuarks.png' }]
      },
      {
        id: 'highestHoneyGlobalSpeed',
        tiers: [
          {
            key: 'highestHoneyGlobalSpeed',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyGlobalSpeed.png'
          }
        ]
      },
      {
        id: 'highestHoneyAscensionSpeed',
        tiers: [
          {
            key: 'highestHoneyAscensionSpeed',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyAscensionSpeed.png'
          }
        ]
      },
      {
        id: 'highestHoneyAmbrosia',
        tiers: [
          {
            key: 'highestHoneyAmbrosia',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyAmbrosia.png'
          }
        ]
      },
      {
        id: 'highestHoneyRedAmbrosia',
        tiers: [
          {
            key: 'highestHoneyRedAmbrosia',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyRedAmbrosia.png'
          }
        ]
      },
      {
        id: 'highestHoneyAntELO',
        tiers: [
          {
            key: 'highestHoneyAntELO',
            icon: 'Pictures/PurpleAmbrosia/Purple Upgrades/HighestHoneyAntElo.png'
          }
        ]
      },
      {
        id: 'highestHoneyRebornELOSpeed',
        tiers: [
          {
            key: 'highestHoneyRebornELOSpeed',
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
let upgradeShopOpen = false

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
  if (isMobile) {
    DOMCacheGetOrSet('purpleUpgradeDetail').scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const setUpgradeShopOpen = (open: boolean) => {
  upgradeShopOpen = open
  const container = DOMCacheGetOrSet('singularityPurple')
  const toggle = DOMCacheGetOrSet('purpleUpgradeToggle')
  container.hidden = !open
  toggle.setAttribute('aria-expanded', `${open}`)
  toggle.classList.toggle('purpleUpgradeToggleOpen', open)
  DOMCacheGetOrSet('purpleReactantContainers').classList.toggle('purpleUpgradeShopOpen', open)

  if (open) {
    updatePurpleUpgradeTab()
    if (isMobile) {
      requestAnimationFrame(() => container.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
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

const buySelectedUpgrade = async (buyMax: boolean) => {
  await buyPurpleReactorUpgradeLevel(selectedTier, buyMax)
}

export const generatePurpleUpgradeTabHTML = () => {
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

  DOMCacheGetOrSet('purpleUpgradeDetailBuyOne').addEventListener('click', () => {
    void buySelectedUpgrade(false)
  })
  DOMCacheGetOrSet('purpleUpgradeDetailBuyMax').addEventListener('click', () => {
    void buySelectedUpgrade(true)
  })
  DOMCacheGetOrSet('purpleUpgradeToggle').addEventListener('click', () => {
    setUpgradeShopOpen(!upgradeShopOpen)
  })
  DOMCacheGetOrSet('purpleUpgradeClose').addEventListener('click', () => {
    setUpgradeShopOpen(false)
    DOMCacheGetOrSet('purpleUpgradeToggle').focus()
  })
  setUpgradeShopOpen(false)
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
  const maxed = tierMaxed(selectedTier)
  const cost = nextLevelCost(selectedTier)
  const maxLevel = maximumAffordableLevel(selectedTier, player.purpleReactor.purpleHoney)
  const buyMaxAmount = maxLevel - upgrade.level
  const buyMaxCost = upgrade.costFormula(maxLevel) - upgrade.costFormula(upgrade.level)
  const buyOneButton = DOMCacheGetOrSet('purpleUpgradeDetailBuyOne') as HTMLButtonElement
  const buyMaxButton = DOMCacheGetOrSet('purpleUpgradeDetailBuyMax') as HTMLButtonElement

  buyOneButton.hidden = maxed
  buyMaxButton.hidden = maxed || upgrade.maxLevel === 1
  buyOneButton.disabled = player.purpleReactor.purpleHoney < cost
  buyMaxButton.disabled = buyMaxAmount === 0
  buyOneButton.textContent = i18next.t('purpleReactor.upgradeShop.buyOne', { cost: format(cost, 0, true) })
  buyMaxButton.textContent = i18next.t('purpleReactor.upgradeShop.buyMax', {
    amount: format(buyMaxAmount, 0, true),
    cost: format(buyMaxCost, 0, true)
  })
}

export const updatePurpleUpgradeTab = () => {
  if (!upgradeShopOpen) {
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
        cost.textContent = i18next.t(costKey, { cost: format(price, 0, true) })
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
