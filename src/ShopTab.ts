import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateGoldenQuarkMultiplier,
  calculateQuarkMultiplier,
  calculateSingularityTimeQuarkRate,
  calculateSummationNonLinear
} from './Calculate'
import {
  getQuarkCategoryAwarded,
  getQuarkSourceMultiplier,
  quarkCategories,
  type QuarkCategoryKey,
  quarkCategoryKeys,
  type QuarkSourceKey,
  quarkSourceKeys,
  quarkSources
} from './Quark'
import {
  buyShopUpgrades,
  getShopCosts,
  getShopTypeSymbolsHTML,
  getShopUpgradeEffects,
  instantUnlocked,
  shopDescriptions,
  type ShopUpgradeNames,
  shopUpgrades
} from './Shop'
import {
  getGoldenQuarkSourceMultiplier,
  type GoldenQuarkSourceKey,
  goldenQuarkSourceKeys,
  goldenQuarkSources
} from './singularity'
import { registerSpriteAlias, spritePlaceholder } from './SpriteSheets'
import { format, player } from './Synergism'
import { isMobile } from './Utility'

interface ShopTierData {
  readonly key: ShopUpgradeNames
  readonly icon: string
}

interface ShopFamilyData {
  readonly id: string
  readonly tiers: readonly ShopTierData[]
}

interface ShopSectionData {
  readonly id: string
  readonly families: readonly ShopFamilyData[]
}

const shopSections = [
  {
    id: 'offerings',
    families: [
      {
        id: 'offeringEX',
        tiers: [
          { key: 'offeringEX', icon: 'Pictures/Default/ShopOfferingUpgrade.png' },
          { key: 'offeringEX2', icon: 'Pictures/Default/ShopOfferingUpgrade2.png' },
          { key: 'offeringEX3', icon: 'Pictures/Default/ShopOfferingUpgrade3.png' }
        ]
      },
      {
        id: 'offeringAuto',
        tiers: [{ key: 'offeringAuto', icon: 'Pictures/Default/ShopOfferingAutoUpgrade.png' }]
      },
      {
        id: 'obtainiumEX',
        tiers: [
          { key: 'obtainiumEX', icon: 'Pictures/Default/ShopObtainiumUpgrade.png' },
          { key: 'obtainiumEX2', icon: 'Pictures/Default/ShopObtainiumUpgrade2.png' },
          { key: 'obtainiumEX3', icon: 'Pictures/Default/ShopObtainiumUpgrade3.png' }
        ]
      },
      {
        id: 'obtainiumAuto',
        tiers: [{ key: 'obtainiumAuto', icon: 'Pictures/Default/ShopObtainiumAutoUpgrade.png' }]
      },
      {
        id: 'cashGrab',
        tiers: [
          { key: 'cashGrab', icon: 'Pictures/Default/ShopCashGrab.png' },
          { key: 'cashGrab2', icon: 'Pictures/Default/ShopCashGrab2.png' },
          { key: 'shopCashGrabUltra', icon: 'Pictures/Default/ShopCashGrabUltra.png' }
        ]
      },
      {
        id: 'shopEXUltra',
        tiers: [{ key: 'shopEXUltra', icon: 'Pictures/Default/ShopEXUltra.png' }]
      }
    ]
  },
  {
    id: 'challenges',
    families: [
      {
        id: 'instantChallenge',
        tiers: [
          { key: 'instantChallenge', icon: 'Pictures/Default/ShopInstantChallenge.png' },
          { key: 'instantChallenge2', icon: 'Pictures/Default/ShopInstantChallenge2.png' }
        ]
      },
      {
        id: 'challengeExtension',
        tiers: [{ key: 'challengeExtension', icon: 'Pictures/Default/ShopChallengeUpgrade.png' }]
      },
      {
        id: 'challengeTome',
        tiers: [
          { key: 'challengeTome', icon: 'Pictures/Default/ShopChallenge10TomeUpgrade.png' },
          { key: 'challengeTome2', icon: 'Pictures/Default/ShopChallenge10TomeUpgrade2.png' }
        ]
      },
      {
        id: 'challenge15Auto',
        tiers: [{ key: 'challenge15Auto', icon: 'Pictures/Default/ShopAutoChallenge15.png' }]
      }
    ]
  },
  {
    id: 'ascension',
    families: [
      {
        id: 'seasonPass',
        tiers: [
          { key: 'seasonPass', icon: 'Pictures/img_transparent.png' },
          { key: 'seasonPass2', icon: 'Pictures/img_transparent.png' },
          { key: 'seasonPass3', icon: 'Pictures/img_transparent.png' },
          { key: 'seasonPassY', icon: 'Pictures/img_transparent.png' },
          { key: 'seasonPassZ', icon: 'Pictures/img_transparent.png' },
          { key: 'seasonPassLost', icon: 'Pictures/img_transparent.png' },
          { key: 'seasonPassInfinity', icon: 'Pictures/img_transparent.png' }
        ]
      },
      {
        id: 'chronometer',
        tiers: [
          { key: 'chronometer', icon: 'Pictures/Default/ShopChronometer.png' },
          { key: 'chronometer2', icon: 'Pictures/Default/ShopChronometer2.png' },
          { key: 'chronometer3', icon: 'Pictures/Default/ShopChronometer3.png' },
          { key: 'chronometerZ', icon: 'Pictures/Default/ShopChronometerZ.png' },
          { key: 'chronometerInfinity', icon: 'Pictures/Default/ShopChronometerInfinity.png' },
          { key: 'shopChronometerS', icon: 'Pictures/Default/ShopChronometerS.png' }
        ]
      },
      {
        id: 'constantEX',
        tiers: [{ key: 'constantEX', icon: 'Pictures/Default/ShopConstantExtension.png' }]
      }
    ]
  },
  {
    id: 'quarks',
    families: [
      {
        id: 'calculator',
        tiers: [
          { key: 'calculator', icon: 'Pictures/img_transparent.png' },
          { key: 'calculator2', icon: 'Pictures/img_transparent.png' },
          { key: 'calculator3', icon: 'Pictures/img_transparent.png' },
          { key: 'calculator4', icon: 'Pictures/img_transparent.png' },
          { key: 'calculator5', icon: 'Pictures/img_transparent.png' },
          { key: 'calculator6', icon: 'Pictures/img_transparent.png' },
          { key: 'calculator7', icon: 'Pictures/img_transparent.png' }
        ]
      },
      {
        id: 'improveQuarkHept',
        tiers: [
          { key: 'improveQuarkHept', icon: 'Pictures/Default/ShopImprovedQuarkHepteract0.png' },
          { key: 'improveQuarkHept2', icon: 'Pictures/Default/ShopImprovedQuarkHepteract.png' },
          { key: 'improveQuarkHept3', icon: 'Pictures/Default/ShopImprovedQuarkHepteract2.png' },
          { key: 'improveQuarkHept4', icon: 'Pictures/Default/ShopImprovedQuarkHepteract3.png' },
          { key: 'improveQuarkHept5', icon: 'Pictures/Default/ShopImprovedQuarkHepteractInfinity.png' }
        ]
      },
      {
        id: 'cubeToQuark',
        tiers: [
          { key: 'cubeToQuark', icon: 'Pictures/img_transparent.png' },
          { key: 'tesseractToQuark', icon: 'Pictures/img_transparent.png' },
          { key: 'hypercubeToQuark', icon: 'Pictures/img_transparent.png' },
          { key: 'cubeToQuarkAll', icon: 'Pictures/img_transparent.png' }
        ]
      },
      {
        id: 'shopImprovedDaily',
        tiers: [
          { key: 'shopImprovedDaily', icon: 'Pictures/Default/ShopImprovedDaily0.png' },
          { key: 'shopImprovedDaily2', icon: 'Pictures/Default/ShopImprovedDaily.png' },
          { key: 'shopImprovedDaily3', icon: 'Pictures/Default/ShopImprovedDaily2.png' },
          { key: 'shopImprovedDaily4', icon: 'Pictures/Default/ShopImprovedDaily3.png' },
          { key: 'shopImprovedDaily5', icon: 'Pictures/Default/ShopImprovedDaily4.png' }
        ]
      },
      {
        id: 'infiniteAscent',
        tiers: [{ key: 'infiniteAscent', icon: 'Pictures/Default/ShopInfiniteAscentRune.png' }]
      },
      {
        id: 'shopSadisticRune',
        tiers: [{ key: 'shopSadisticRune', icon: 'Pictures/Default/ShopSadisticRune.png' }]
      },
      {
        id: 'shopInfiniteShopUpgrades',
        tiers: [{ key: 'shopInfiniteShopUpgrades', icon: 'Pictures/Default/ShopInfiniteShopUpgrades.png' }]
      },
      {
        id: 'shopInfiniteShopUpgrades2',
        tiers: [{ key: 'shopInfiniteShopUpgrades2', icon: 'Pictures/Default/ShopInfiniteShopUpgrades2.png' }]
      },
      {
        id: 'shopFreeQuarkUpgrades',
        tiers: [{ key: 'shopFreeQuarkUpgrades', icon: 'Pictures/Default/ShopFreeQuarkUpgrades.png' }]
      }
    ]
  },
  {
    id: 'hepteracts',
    families: [
      {
        id: 'powderEX',
        tiers: [
          { key: 'powderEX', icon: 'Pictures/Default/ShopPowderGainUpgrade.png' },
          { key: 'powderAuto', icon: 'Pictures/Default/ShopPowderGainUpgrade2.png' }
        ]
      },
      {
        id: 'extraWarp',
        tiers: [
          { key: 'extraWarp', icon: 'Pictures/Default/ShopAdditionalWarp.png' },
          { key: 'autoWarp', icon: 'Pictures/Default/ShopAutoWarp.png' }
        ]
      }
    ]
  },
  {
    id: 'ambrosia',
    families: [
      {
        id: 'shopAmbrosiaGeneration1',
        tiers: [
          { key: 'shopAmbrosiaGeneration1', icon: 'Pictures/Default/ShopAmbrosiaGeneration1.png' },
          { key: 'shopAmbrosiaGeneration2', icon: 'Pictures/Default/ShopAmbrosiaGeneration2.png' },
          { key: 'shopAmbrosiaGeneration3', icon: 'Pictures/Default/ShopAmbrosiaGeneration3.png' },
          { key: 'shopAmbrosiaGeneration4', icon: 'Pictures/Default/ShopAmbrosiaGeneration4.png' }
        ]
      },
      {
        id: 'shopAmbrosiaLuck1',
        tiers: [
          { key: 'shopAmbrosiaLuck1', icon: 'Pictures/Default/ShopAmbrosiaLuck1.png' },
          { key: 'shopAmbrosiaLuck2', icon: 'Pictures/Default/ShopAmbrosiaLuck2.png' },
          { key: 'shopAmbrosiaLuck3', icon: 'Pictures/Default/ShopAmbrosiaLuck3.png' },
          { key: 'shopAmbrosiaLuck4', icon: 'Pictures/Default/ShopAmbrosiaLuck4.png' },
          { key: 'shopAmbrosiaLuck5', icon: 'Pictures/Default/ShopAmbrosiaLuck5.png' }
        ]
      },
      {
        id: 'shopAmbrosiaLuckMultiplier4',
        tiers: [
          { key: 'shopAmbrosiaLuckMultiplier4', icon: 'Pictures/Default/ShopAmbrosiaLuckMultiplier4.png' },
          { key: 'shopOcteractAmbrosiaLuck', icon: 'Pictures/Default/ShopOcteractAmbrosiaLuck.png' },
          { key: 'shopAmbrosiaUltra', icon: 'Pictures/Default/ShopAmbrosiaUltra.png' }
        ]
      },
      {
        id: 'shopAmbrosiaAccelerator',
        tiers: [{ key: 'shopAmbrosiaAccelerator', icon: 'Pictures/Default/ShopAmbrosiaAccelerator.png' }]
      },
      {
        id: 'shopRedLuck1',
        tiers: [
          { key: 'shopRedLuck1', icon: 'Pictures/img_transparent.png' },
          { key: 'shopRedLuck2', icon: 'Pictures/img_transparent.png' },
          { key: 'shopRedLuck3', icon: 'Pictures/img_transparent.png' },
          { key: 'shopRedLuck4', icon: 'Pictures/img_transparent.png' }
        ]
      },
      {
        id: 'shopPurpleHoney',
        tiers: [{ key: 'shopPurpleBarRebate', icon: 'Pictures/Default/ShopPurpleBarRebate.png' }]
      },
      {
        id: 'shopPurpleHoneyLuck',
        tiers: [{ key: 'shopPurpleHoneyLuck', icon: 'Pictures/Default/ShopPurpleHoneyLuck.png' }]
      },
      {
        id: 'shopPurpleHoneyLuckFreeLevels',
        tiers: [{ key: 'shopPurpleHoneyLuckFreeLevels', icon: 'Pictures/Default/ShopPurpleHoneyLuckFreeLevels.png' }]
      }
    ]
  },
  {
    id: 'singularity',
    families: [
      {
        id: 'shopSingularityPenaltyDebuff',
        tiers: [{ key: 'shopSingularityPenaltyDebuff', icon: 'Pictures/Default/ShopSingularityPenaltyDebuff.png' }]
      },
      {
        id: 'shopHorseShoe',
        tiers: [{ key: 'shopHorseShoe', icon: 'Pictures/Default/ShopHorseShoe.png' }]
      },
      {
        id: 'shopRootsOfUnity',
        tiers: [{ key: 'shopRootsOfUnity', icon: 'Pictures/Default/ShopRootsOfUnity.png' }]
      },
      {
        id: 'shopSingularitySpeedup',
        tiers: [{ key: 'shopSingularitySpeedup', icon: 'Pictures/Default/ShopSingularitySpeedup.png' }]
      },
      {
        id: 'shopSingularityPotency',
        tiers: [{ key: 'shopSingularityPotency', icon: 'Pictures/Default/ShopSingularityPotency.png' }]
      },
      {
        id: 'shopPanthema',
        tiers: [{ key: 'shopPanthema', icon: 'Pictures/Default/ShopPanthema.png' }]
      }
    ]
  },
  {
    id: 'oddities',
    families: [
      {
        id: 'antSpeed',
        tiers: [{ key: 'antSpeed', icon: 'Pictures/Default/ShopAntSpeed.png' }]
      },
      {
        id: 'shopTalisman',
        tiers: [{ key: 'shopTalisman', icon: 'Pictures/Default/ShopP2WTalisman.png' }]
      },
      {
        id: 'shopMindPalace',
        tiers: [{ key: 'shopMindPalace', icon: 'Pictures/Default/ShopMindPalace.png' }]
      },
      {
        id: 'shopCorruptionScalingReduction',
        tiers: [{ key: 'shopCorruptionScalingReduction', icon: 'Pictures/Default/ShopCorruptionScalingReduction.png' }]
      },
      {
        id: 'shopPrestigeCount',
        tiers: [
          { key: 'shopPrestigeCount', icon: 'Pictures/Default/ShopPrestigeCount.png' },
          { key: 'shopTranscensionCount', icon: 'Pictures/Default/ShopTranscensionCount.png' },
          { key: 'shopReincarnationCount', icon: 'Pictures/Default/ShopReincarnationCount.png' },
          { key: 'shopAntSacrificeCount', icon: 'Pictures/Default/ShopAntSacrificeCount.png' }
        ]
      },
      {
        id: 'shopResetUpgradesImprover',
        tiers: [{ key: 'shopResetUpgradesImprover', icon: 'Pictures/Default/ShopResetUpgradesImprover.png' }]
      }
    ]
  }
] as const satisfies readonly ShopSectionData[]

type CoveredShopTiers = (typeof shopSections)[number]['families'][number]['tiers'][number]['key']
type UncoveredShopTiers = Exclude<ShopUpgradeNames, CoveredShopTiers | 'offeringPotion' | 'obtainiumPotion'>
export const shopFamilyCoverage: [UncoveredShopTiers] extends [never] ? true : UncoveredShopTiers = true

let selectedFamily: ShopFamilyData = shopSections[0].families[0]
let selectedTier: ShopUpgradeNames = shopSections[0].families[0].tiers[0].key

const tierAvailable = (key: ShopUpgradeNames) => TESTING || shopUpgrades[key].isUnlocked()

const tierMaxed = (key: ShopUpgradeNames) =>
  player.shopUpgrades[key] >= shopUpgrades[key].maxLevel || instantUnlocked(key)

const tierHidden = (key: ShopUpgradeNames) => player.shopHideToggle && tierMaxed(key)

const updateTextContentIfChanged = (element: HTMLElement, text: string) => {
  if (element.textContent !== text) {
    element.textContent = text
  }
}

const updateInnerHTMLIfChanged = (element: HTMLElement, html: string) => {
  if (element.innerHTML !== html) {
    element.innerHTML = html
  }
}

const familyNameKey = (family: ShopFamilyData) =>
  family.tiers.length > 1 ? `shop.familyNames.${family.id}` : `shop.names.${family.tiers[0].key}`

const frontierTier = (family: ShopFamilyData) => {
  for (const tier of family.tiers) {
    if (tierAvailable(tier.key) && !tierMaxed(tier.key)) {
      return tier
    }
  }
  for (let i = family.tiers.length - 1; i >= 0; i--) {
    if (tierAvailable(family.tiers[i].key)) {
      return family.tiers[i]
    }
  }
  return family.tiers[0]
}

const createFamilyRow = (family: ShopFamilyData) => {
  const row = document.createElement('div')
  row.id = `shopFamilyRow-${family.id}`
  row.className = 'shopFamilyRow'

  const familyButton = document.createElement('button')
  familyButton.type = 'button'
  familyButton.className = 'shopFamilyButton'

  const icon = document.createElement('img')
  icon.id = `shopFamilyRowIcon-${family.id}`
  icon.className = 'shopFamilyRowIcon'
  icon.src = family.tiers[0].icon
  icon.alt = family.tiers[0].key
  icon.loading = 'lazy'

  const info = document.createElement('span')
  info.className = 'shopFamilyRowInfo'
  const name = document.createElement('span')
  name.className = 'shopFamilyRowName'
  name.setAttribute('i18n', familyNameKey(family))
  name.textContent = i18next.t(familyNameKey(family))
  info.appendChild(name)

  const cost = document.createElement('span')
  cost.id = `shopFamilyRowCost-${family.id}`
  cost.className = 'shopFamilyRowCost'
  info.appendChild(cost)

  familyButton.append(icon, info)
  familyButton.addEventListener('click', () => selectShopFamily(family))
  row.appendChild(familyButton)

  if (family.tiers.length > 1) {
    const shortcuts = document.createElement('span')
    shortcuts.className = 'shopFamilyRowTiers'
    for (const tier of family.tiers) {
      const shortcut = document.createElement('button')
      shortcut.type = 'button'
      shortcut.id = `shopTierShortcut-${tier.key}`
      shortcut.className = 'shopTierShortcut'
      shortcut.title = shopUpgrades[tier.key].name()
      shortcut.setAttribute('aria-label', shopUpgrades[tier.key].name())

      const shortcutIcon = document.createElement('img')
      shortcutIcon.id = `shopTierShortcutIcon-${tier.key}`
      shortcutIcon.src = tier.icon
      shortcutIcon.alt = ''
      shortcutIcon.loading = 'lazy'
      registerSpriteAlias(tier.key, shortcutIcon.id)

      shortcut.appendChild(shortcutIcon)
      shortcut.addEventListener('click', () => selectShopFamily(family, tier.key))
      shortcuts.appendChild(shortcut)
    }
    row.appendChild(shortcuts)
  }

  return row
}

const createTierChip = (tier: ShopTierData) => {
  const chip = document.createElement('button')
  chip.id = `shopTierChip-${tier.key}`
  chip.className = 'shopTierChip'

  const icon = document.createElement('img')
  icon.id = tier.key
  icon.src = tier.icon
  icon.alt = tier.key
  icon.loading = 'lazy'

  const level = document.createElement('span')
  level.id = `shopTierChipLevel-${tier.key}`

  chip.append(icon, level)
  chip.addEventListener('click', () => selectShopTier(tier.key))
  return chip
}

const quarkLedgerColumns = ['base', 'multiplier', 'awarded'] as const

const quarkLedgerCategoryBases: Record<QuarkCategoryKey, number> = { primary: 0, miscellaneous: 0 }
const quarkLedgerCategoryVisible: Record<QuarkCategoryKey, boolean> = { primary: false, miscellaneous: false }

const ledgerMultiplierHTML = (title: string, lines: string[], total: number) =>
  `<span style="font-weight: bold; font-size: 1.2em;">${title}</span><br><br>${lines.join('<br>')}<br><br>${
    i18next.t('shop.quarkLedger.multipliers.total', { x: format(total, 3, true) })
  }`

export const quarkSourceMultiplierHTML = (key: QuarkSourceKey) => {
  const lines = quarkSources[key].lines.map(({ i18n, stat }) =>
    i18next.t(`shop.quarkLedger.multipliers.${i18n}`, { x: format(stat(), 3, true) })
  )
  if (
    quarkSources[key].category === 'primary' && getShopUpgradeEffects('shopRootsOfUnity', 'singularityTimeQuarks')
  ) {
    lines.push(i18next.t('shop.quarkLedger.multipliers.singularityTime', {
      perDay: format(calculateSingularityTimeQuarkRate(), 2, true),
      x: format(quarkCategories.primary.multiplier(), 3, true)
    }))
  }
  const globalMultiplier = calculateQuarkMultiplier()
  lines.push(i18next.t('shop.quarkLedger.multipliers.globalMultiplier', { x: format(globalMultiplier, 3, true) }))
  return ledgerMultiplierHTML(
    i18next.t(`shop.quarkLedger.sources.${key}`),
    lines,
    getQuarkSourceMultiplier(key) * globalMultiplier
  )
}

export const goldenQuarkSourceMultiplierHTML = (key: GoldenQuarkSourceKey) => {
  const lines = goldenQuarkSources[key].lines.map(({ i18n, stat }) =>
    i18next.t(`shop.quarkLedger.multipliers.${i18n}`, { x: format(stat(), 3, true) })
  )
  lines.push(
    i18next.t('shop.quarkLedger.multipliers.goldenQuarkMultiplier', {
      x: format(calculateGoldenQuarkMultiplier(), 3, true)
    })
  )
  return ledgerMultiplierHTML(
    i18next.t(`shop.quarkLedger.goldenQuarkSources.${key}`),
    lines,
    getGoldenQuarkSourceMultiplier(key)
  )
}

export const quarkLedgerAwardedHTML = () =>
  `<span style="font-weight: bold; font-size: 1.2em;">${i18next.t('shop.quarkLedger.awarded')}</span><br><br>${
    i18next.t('shop.quarkLedger.rules.baseGain')
  }<br><br>${i18next.t('shop.quarkLedger.rules.multiplierGrowth')}`

export const goldenQuarkLedgerAwardedHTML = () =>
  `<span style="font-weight: bold; font-size: 1.2em;">${i18next.t('shop.quarkLedger.awarded')}</span><br><br>${
    i18next.t('shop.quarkLedger.goldenQuarkRules.baseGain')
  }<br><br>${i18next.t('shop.quarkLedger.goldenQuarkRules.multiplierGrowth')}<br><br>${
    i18next.t('shop.quarkLedger.goldenQuarkRules.dailyReset')
  }`

export const generateShopTabHTML = () => {
  const list = DOMCacheGetOrSet('shopFamilyList')
  const rail = DOMCacheGetOrSet('shopTierRail')
  for (const section of shopSections) {
    const header = document.createElement('p')
    header.id = `shopSection-${section.id}`
    header.className = 'shopSectionHeader'
    header.setAttribute('i18n', `shop.sections.${section.id}`)
    header.textContent = i18next.t(`shop.sections.${section.id}`)
    list.appendChild(header)
    for (const family of section.families) {
      list.appendChild(createFamilyRow(family))
      for (const tier of family.tiers) {
        rail.appendChild(createTierChip(tier))
      }
    }
  }
  DOMCacheGetOrSet('shopDetailBuy').addEventListener('pointerdown', () => buyShopUpgrades(selectedTier))
  selectShopFamily(shopSections[0].families[0])

  for (const key of quarkSourceKeys) {
    const row = document.createElement('tr')
    row.id = `quarkLedgerRow-${key}`
    row.className = 'quarkLedgerSourceRow'

    const sourceCell = document.createElement('td')
    const source = document.createElement('div')
    source.className = 'quarkLedgerSource'
    const icon = document.createElement('img')
    icon.id = `quarkLedgerIcon-${key}`
    icon.src = spritePlaceholder
    icon.alt = ''
    icon.loading = 'lazy'
    const name = document.createElement('span')
    name.setAttribute('i18n', `shop.quarkLedger.sources.${key}`)
    name.textContent = i18next.t(`shop.quarkLedger.sources.${key}`)
    source.append(icon, name)
    sourceCell.appendChild(source)
    row.appendChild(sourceCell)

    for (const column of quarkLedgerColumns) {
      const cell = document.createElement('td')
      cell.id = `quarkLedger-${key}-${column}`
      row.appendChild(cell)
    }

    DOMCacheGetOrSet(`quarkLedgerBody-${quarkSources[key].category}`).appendChild(row)
  }

  for (const key of goldenQuarkSourceKeys) {
    const row = document.createElement('tr')
    row.className = 'quarkLedgerSourceRow'

    const sourceCell = document.createElement('td')
    const source = document.createElement('div')
    source.className = 'quarkLedgerSource'
    const icon = document.createElement('img')
    icon.id = `goldenQuarkLedgerIcon-${key}`
    icon.alt = ''
    icon.loading = 'lazy'
    if (key === 'purchases') {
      icon.src = 'Pictures/Default/ShopGoldenQuarks.png'
    } else {
      icon.src = spritePlaceholder
      registerSpriteAlias(`quarkLedgerIcon-${key}`, icon.id)
    }
    const name = document.createElement('span')
    name.setAttribute('i18n', `shop.quarkLedger.goldenQuarkSources.${key}`)
    name.textContent = i18next.t(`shop.quarkLedger.goldenQuarkSources.${key}`)
    source.append(icon, name)
    sourceCell.appendChild(source)
    row.appendChild(sourceCell)

    for (const column of quarkLedgerColumns) {
      const cell = document.createElement('td')
      cell.id = `goldenQuarkLedger-${key}-${column}`
      row.appendChild(cell)
    }

    DOMCacheGetOrSet('quarkLedgerBody-goldenQuarks').appendChild(row)
  }
}

const selectShopFamily = (family: ShopFamilyData, tier = frontierTier(family).key) => {
  selectedFamily = family
  selectShopTier(tier)

  if (isMobile) {
    DOMCacheGetOrSet('shopDetail').scrollIntoView({ behavior: 'smooth' })
  }
}

const selectShopTier = (key: ShopUpgradeNames) => {
  selectedTier = key
  shopDescriptions(key)
  updateShopTab()
}

const getShopBuyData = (key: ShopUpgradeNames) => {
  const shopItem = shopUpgrades[key]
  if (player.shopBuyMaxToggle === false) {
    return {
      amount: 1,
      cost: getShopCosts(key)
    }
  }

  const currentLevel = player.shopUpgrades[key]
  const maxBuyAmount = shopItem.maxLevel - currentLevel
  const amount = player.shopBuyMaxToggle === 'TEN' ? Math.min(10, maxBuyAmount) : maxBuyAmount
  const buyData = calculateSummationNonLinear(
    currentLevel,
    shopItem.price,
    player.worlds,
    shopItem.priceIncrease / shopItem.price,
    amount
  )

  return {
    amount: buyData.levelCanBuy - currentLevel,
    cost: buyData.cost
  }
}

const buyButtonLabel = (key: ShopUpgradeNames) => {
  if (tierMaxed(key)) {
    return i18next.t('shop.maxed')
  }
  if (shopUpgrades[key].maxLevel === 1) {
    return i18next.t('shop.upgradeFor', { x: format(getShopCosts(key)) })
  }
  const buyData = getShopBuyData(key)
  if (player.shopBuyMaxToggle === false) {
    return i18next.t('shop.upgradeFor', { x: format(buyData.cost) })
  }
  if (buyData.amount === 0) {
    return i18next.t('shop.plusForQuarks', { x: format(1, 0, true), y: format(getShopCosts(key)) })
  }
  return i18next.t('shop.plusForQuarks', {
    x: format(buyData.amount, 0, true),
    y: format(buyData.cost)
  })
}

const updateShopDetail = () => {
  const item = shopUpgrades[selectedTier]
  for (const section of shopSections) {
    for (const family of section.families) {
      const isSelectedFamily = family === selectedFamily
      for (const tier of family.tiers) {
        const chip = DOMCacheGetOrSet(`shopTierChip-${tier.key}`)
        chip.style.display = isSelectedFamily && tierAvailable(tier.key) && !tierHidden(tier.key)
          ? ''
          : 'none'
        if (!isSelectedFamily) {
          continue
        }
        chip.classList.toggle('shopTierSelected', tier.key === selectedTier)
        chip.classList.toggle('shopTierMaxed', tierMaxed(tier.key))
        chip.classList.toggle('shopTestingOnly', TESTING && !shopUpgrades[tier.key].isUnlocked())
        const levelText = shopUpgrades[tier.key].maxLevel === 1
          ? (tierMaxed(tier.key) ? '✓' : '✕')
          : i18next.t('shop.level', {
            x: format(player.shopUpgrades[tier.key]),
            y: format(shopUpgrades[tier.key].maxLevel)
          })
        updateTextContentIfChanged(DOMCacheGetOrSet(`shopTierChipLevel-${tier.key}`), levelText)
      }
    }
  }

  updateInnerHTMLIfChanged(
    DOMCacheGetOrSet('shopDetailName'),
    `${item.name()}${getShopTypeSymbolsHTML(selectedTier)}`
  )

  const testingOnlyWarning = DOMCacheGetOrSet('shopTestingOnlyWarning')
  const testingOnly = TESTING && !item.isUnlocked()
  testingOnlyWarning.hidden = !testingOnly
  if (testingOnly) {
    updateTextContentIfChanged(testingOnlyWarning, i18next.t('shop.testingOnlyUpgrade'))
  }

  const levelEl = DOMCacheGetOrSet('shopDetailLevel')
  if (item.maxLevel === 1) {
    const bought = tierMaxed(selectedTier)
    updateTextContentIfChanged(levelEl, bought ? i18next.t('shop.bought') : i18next.t('shop.notBought'))
    levelEl.style.color = bought ? 'var(--gold-color)' : 'var(--white-color)'
  } else {
    updateTextContentIfChanged(
      levelEl,
      i18next.t('shop.levelWithText', {
        x: format(player.shopUpgrades[selectedTier]),
        y: format(item.maxLevel)
      })
    )
    levelEl.style.color = tierMaxed(selectedTier) ? 'var(--gold-color)' : 'var(--white-color)'
  }

  const buyButton = DOMCacheGetOrSet('shopDetailBuy')
  buyButton.hidden = tierMaxed(selectedTier)
  updateTextContentIfChanged(buyButton, buyButtonLabel(selectedTier))
}

export const updateShopTab = () => {
  let firstVisibleFamily: ShopFamilyData | null = null
  let selectedVisible = false
  for (const section of shopSections) {
    let visibleFamilies = 0
    for (const family of section.families) {
      const row = DOMCacheGetOrSet(`shopFamilyRow-${family.id}`)
      const anyAvailable = family.tiers.some((tier) => tierAvailable(tier.key))
      const allDone = family.tiers.every((tier) => !tierAvailable(tier.key) || tierMaxed(tier.key))
      const hidden = !anyAvailable || (player.shopHideToggle && allDone)
      row.style.display = hidden ? 'none' : 'flex'
      if (hidden) {
        continue
      }
      visibleFamilies++
      firstVisibleFamily ??= family
      if (family === selectedFamily) {
        selectedVisible = true
      }
      row.classList.toggle('shopFamilySelected', family === selectedFamily)

      const frontier = family.tiers.find((tier) => tierAvailable(tier.key) && !tierMaxed(tier.key))
      const cost = DOMCacheGetOrSet(`shopFamilyRowCost-${family.id}`)
      if (frontier === undefined) {
        updateTextContentIfChanged(cost, i18next.t('shop.maxed'))
        cost.classList.add('shopFamilyMaxed')
        cost.classList.remove('shopCantAfford')
      } else {
        const buyData = getShopBuyData(frontier.key)
        const nextLevelPrice = getShopCosts(frontier.key)
        const price = buyData.amount === 0 ? nextLevelPrice : buyData.cost
        updateTextContentIfChanged(cost, format(price, 0, true))
        cost.classList.remove('shopFamilyMaxed')
        cost.classList.toggle('shopCantAfford', player.worlds < nextLevelPrice)
      }

      if (family.tiers.length > 1) {
        for (const tier of family.tiers) {
          const shortcut = DOMCacheGetOrSet(`shopTierShortcut-${tier.key}`)
          shortcut.style.display = tierAvailable(tier.key) && !tierHidden(tier.key) ? '' : 'none'
          shortcut.classList.toggle('shopTierShortcutMaxed', tierMaxed(tier.key))
          shortcut.classList.toggle(
            'shopTierShortcutUnfinished',
            tier === frontier || (!tierMaxed(tier.key) && player.shopUpgrades[tier.key] > 0)
          )
        }
      }
    }
    DOMCacheGetOrSet(`shopSection-${section.id}`).style.display = visibleFamilies > 0 ? '' : 'none'
  }

  if (!selectedVisible) {
    if (firstVisibleFamily === null) {
      DOMCacheGetOrSet('actualShop').style.display = 'none'
      return
    }
    if (firstVisibleFamily !== selectedFamily) {
      selectShopFamily(firstVisibleFamily)
      return
    }
  }

  if (tierHidden(selectedTier)) {
    selectedTier = frontierTier(selectedFamily).key
    shopDescriptions(selectedTier)
  }

  DOMCacheGetOrSet('actualShop').style.display = ''
  updateShopDetail()
}

export const updateQuarkLedgerTab = () => {
  const globalMultiplier = calculateQuarkMultiplier()
  for (const category of quarkCategoryKeys) {
    quarkLedgerCategoryBases[category] = 0
    quarkLedgerCategoryVisible[category] = false
  }

  for (const key of quarkSourceKeys) {
    const base = player.quarkLedger.base[key]
    const category = quarkSources[key].category
    quarkLedgerCategoryBases[category] += base

    const visible = base > 0 || quarkSources[key].unlocked()
    DOMCacheGetOrSet(`quarkLedgerRow-${key}`).hidden = !visible
    if (!visible) {
      continue
    }
    quarkLedgerCategoryVisible[category] = true

    updateTextContentIfChanged(DOMCacheGetOrSet(`quarkLedger-${key}-base`), format(base, 2, true))
    updateTextContentIfChanged(
      DOMCacheGetOrSet(`quarkLedger-${key}-multiplier`),
      i18next.t('shop.quarkLedger.multiplierValue', {
        x: format(getQuarkSourceMultiplier(key) * globalMultiplier, 2, true)
      })
    )
    updateTextContentIfChanged(
      DOMCacheGetOrSet(`quarkLedger-${key}-awarded`),
      format(Math.floor(player.quarkLedger.awarded[key]), 0, true)
    )
  }

  for (const category of quarkCategoryKeys) {
    DOMCacheGetOrSet(`quarkLedgerTable-${category}`).hidden = !quarkLedgerCategoryVisible[category]
    updateTextContentIfChanged(
      DOMCacheGetOrSet(`quarkLedgerBase-${category}`),
      format(quarkLedgerCategoryBases[category], 2, true)
    )
    updateTextContentIfChanged(
      DOMCacheGetOrSet(`quarkLedgerAwarded-${category}`),
      format(getQuarkCategoryAwarded(category), 0, true)
    )
  }

  updateTextContentIfChanged(
    DOMCacheGetOrSet('quarkLedgerQuarksRewarded'),
    format(player.quarkLedger.credited.primary + player.quarkLedger.credited.miscellaneous, 0, true)
  )

  const goldenQuarksUnlocked = player.highestSingularityCount >= 1
  DOMCacheGetOrSet('quarkLedgerTable-goldenQuarks').hidden = !goldenQuarksUnlocked
  if (!goldenQuarksUnlocked) {
    return
  }

  let goldenQuarkBase = 0
  let goldenQuarkAwarded = 0
  for (const key of goldenQuarkSourceKeys) {
    goldenQuarkBase += player.goldenQuarkLedger.base[key]
    goldenQuarkAwarded += player.goldenQuarkLedger.awarded[key]
    updateTextContentIfChanged(
      DOMCacheGetOrSet(`goldenQuarkLedger-${key}-base`),
      format(player.goldenQuarkLedger.base[key], 2, true)
    )
    updateTextContentIfChanged(
      DOMCacheGetOrSet(`goldenQuarkLedger-${key}-multiplier`),
      i18next.t('shop.quarkLedger.multiplierValue', { x: format(getGoldenQuarkSourceMultiplier(key), 2, true) })
    )
    updateTextContentIfChanged(
      DOMCacheGetOrSet(`goldenQuarkLedger-${key}-awarded`),
      format(player.goldenQuarkLedger.awarded[key], 2, true)
    )
  }
  updateTextContentIfChanged(DOMCacheGetOrSet('quarkLedgerBase-goldenQuarks'), format(goldenQuarkBase, 2, true))
  updateTextContentIfChanged(DOMCacheGetOrSet('quarkLedgerAwarded-goldenQuarks'), format(goldenQuarkAwarded, 2, true))
}
