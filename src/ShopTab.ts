import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateSummationNonLinear } from './Calculate'
import { testing } from './Config'
import { getRuneEffectiveLevel } from './Runes'
import {
  buyShopUpgrades,
  getShopCosts,
  getShopTypeSymbolsHTML,
  instantUnlocked,
  shopDescriptions,
  type ShopUpgradeNames,
  shopUpgrades
} from './Shop'
import { format, player } from './Synergism'

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
          { key: 'shopImprovedDaily4', icon: 'Pictures/Default/ShopImprovedDaily3.png' }
        ]
      },
      {
        id: 'infiniteAscent',
        tiers: [
          { key: 'infiniteAscent', icon: 'Pictures/Default/ShopInfiniteAscentRune.png' },
          { key: 'shopSadisticRune', icon: 'Pictures/Default/ShopSadisticRune.png' }
        ]
      },
      {
        id: 'shopInfiniteShopUpgrades',
        tiers: [{ key: 'shopInfiniteShopUpgrades', icon: 'Pictures/Default/ShopInfiniteShopUpgrades.png' }]
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
          { key: 'shopAmbrosiaLuck4', icon: 'Pictures/Default/ShopAmbrosiaLuck4.png' }
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
          { key: 'shopRedLuck3', icon: 'Pictures/img_transparent.png' }
        ]
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
      }
    ]
  }
] as const satisfies readonly ShopSectionData[]

type CoveredShopTiers = (typeof shopSections)[number]['families'][number]['tiers'][number]['key']
type UncoveredShopTiers = Exclude<ShopUpgradeNames, CoveredShopTiers | 'offeringPotion' | 'obtainiumPotion'>
export const shopFamilyCoverage: [UncoveredShopTiers] extends [never] ? true : UncoveredShopTiers = true

let selectedFamily: ShopFamilyData = shopSections[0].families[0]
let selectedTier: ShopUpgradeNames = shopSections[0].families[0].tiers[0].key

const tierUnlocked = (key: ShopUpgradeNames) => shopUpgrades[key].isUnlocked()

const tierMaxed = (key: ShopUpgradeNames) =>
  player.shopUpgrades[key] >= shopUpgrades[key].maxLevel || instantUnlocked(key)

const familyNameKey = (family: ShopFamilyData) =>
  family.tiers.length > 1 ? `shop.familyNames.${family.id}` : `shop.names.${family.tiers[0].key}`

const frontierTier = (family: ShopFamilyData) => {
  for (const tier of family.tiers) {
    if (tierUnlocked(tier.key) && !tierMaxed(tier.key)) {
      return tier
    }
  }
  for (let i = family.tiers.length - 1; i >= 0; i--) {
    if (tierUnlocked(family.tiers[i].key)) {
      return family.tiers[i]
    }
  }
  return family.tiers[0]
}

const createFamilyRow = (family: ShopFamilyData) => {
  const row = document.createElement('button')
  row.id = `shopFamilyRow-${family.id}`
  row.className = 'shopFamilyRow'

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

  if (family.tiers.length > 1) {
    const dots = document.createElement('span')
    dots.className = 'shopFamilyRowTiers'
    for (const tier of family.tiers) {
      const dot = document.createElement('span')
      dot.id = `shopTierDot-${tier.key}`
      dot.className = 'shopTierDot'
      dots.appendChild(dot)
    }
    info.appendChild(dots)
  }

  const cost = document.createElement('span')
  cost.id = `shopFamilyRowCost-${family.id}`
  cost.className = 'shopFamilyRowCost'

  row.append(icon, info, cost)
  row.addEventListener('click', () => selectShopFamily(family))
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
}

const selectShopFamily = (family: ShopFamilyData) => {
  selectedFamily = family
  selectShopTier(frontierTier(family).key)
}

const selectShopTier = (key: ShopUpgradeNames) => {
  selectedTier = key
  shopDescriptions(key)
  updateShopTab()
}

const buyButtonLabel = (key: ShopUpgradeNames) => {
  const shopItem = shopUpgrades[key]
  if (tierMaxed(key)) {
    return i18next.t('shop.maxed')
  }
  if (player.shopBuyMaxToggle === false) {
    return i18next.t('shop.upgradeFor', { x: format(getShopCosts(key)) })
  }
  const buyMaxAmount = shopItem.maxLevel - player.shopUpgrades[key]
  const amount = player.shopBuyMaxToggle === 'TEN' ? Math.min(10, buyMaxAmount) : buyMaxAmount
  const buyData = calculateSummationNonLinear(
    player.shopUpgrades[key],
    shopItem.price,
    +player.worlds,
    shopItem.priceIncrease / shopItem.price,
    amount
  )
  return i18next.t('shop.plusForQuarks', {
    x: format(buyData.levelCanBuy - player.shopUpgrades[key], 0, true),
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
        chip.style.display = isSelectedFamily && (tierUnlocked(tier.key) || testing) ? '' : 'none'
        if (!isSelectedFamily) {
          continue
        }
        chip.classList.toggle('shopTierSelected', tier.key === selectedTier)
        chip.classList.toggle('shopTierMaxed', tierMaxed(tier.key))
        chip.classList.toggle('shopTestingOnly', testing && !tierUnlocked(tier.key))
        DOMCacheGetOrSet(`shopTierChipLevel-${tier.key}`).textContent = shopUpgrades[tier.key].maxLevel === 1
          ? (tierMaxed(tier.key) ? '✓' : '✕')
          : i18next.t('shop.level', {
            x: format(player.shopUpgrades[tier.key]),
            y: format(shopUpgrades[tier.key].maxLevel)
          })
      }
    }
  }

  DOMCacheGetOrSet('shopDetailName').innerHTML = `${item.name()}${getShopTypeSymbolsHTML(selectedTier)}`

  const levelEl = DOMCacheGetOrSet('shopDetailLevel')
  if (item.maxLevel === 1) {
    const bought = tierMaxed(selectedTier)
    levelEl.textContent = bought ? i18next.t('shop.bought') : i18next.t('shop.notBought')
    levelEl.style.color = bought ? 'gold' : 'white'
  } else {
    levelEl.textContent = i18next.t('shop.levelWithText', {
      x: format(player.shopUpgrades[selectedTier]),
      y: format(item.maxLevel)
    })
    levelEl.style.color = tierMaxed(selectedTier) ? 'gold' : 'white'
  }

  const resetEl = DOMCacheGetOrSet('shopDetailReset')
  if (player.highestSingularityCount > 0 || getRuneEffectiveLevel('antiquities') > 0) {
    resetEl.innerHTML = item.resetOnSingularity()
      ? `<span style="color: crimson">⚠ ${i18next.t('shop.resetOnSingularity', { x: item.refundMinimumLevel })}</span>`
      : `<span style="color: lightgreen">♔ ${i18next.t('shop.noResetOnSingularity')}</span>`
  } else {
    resetEl.innerHTML = ''
  }

  DOMCacheGetOrSet('shopDetailBuy').textContent = buyButtonLabel(selectedTier)
}

export const updateShopTab = () => {
  let firstVisibleFamily: ShopFamilyData | null = null
  let selectedVisible = false
  for (const section of shopSections) {
    let visibleFamilies = 0
    for (const family of section.families) {
      const row = DOMCacheGetOrSet(`shopFamilyRow-${family.id}`)
      const anyUnlocked = family.tiers.some((tier) => tierUnlocked(tier.key)) || testing
      const allDone = family.tiers.every((tier) => !tierUnlocked(tier.key) || tierMaxed(tier.key))
      const hidden = !anyUnlocked || (player.shopHideToggle && allDone)
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

      const frontier = family.tiers.find((tier) => tierUnlocked(tier.key) && !tierMaxed(tier.key))
      const cost = DOMCacheGetOrSet(`shopFamilyRowCost-${family.id}`)
      if (frontier === undefined) {
        cost.textContent = i18next.t('shop.maxed')
        cost.classList.add('shopFamilyMaxed')
        cost.classList.remove('shopCantAfford')
      } else {
        const price = getShopCosts(frontier.key)
        cost.textContent = format(price, 0, true)
        cost.classList.remove('shopFamilyMaxed')
        cost.classList.toggle('shopCantAfford', +player.worlds < price)
      }

      if (family.tiers.length > 1) {
        for (const tier of family.tiers) {
          const dot = DOMCacheGetOrSet(`shopTierDot-${tier.key}`)
          dot.style.display = tierUnlocked(tier.key) || testing ? '' : 'none'
          dot.classList.toggle('shopTierDotMaxed', tierMaxed(tier.key))
          dot.classList.toggle('shopTierDotFrontier', tier === frontier)
          dot.classList.toggle('shopTierDotStarted', !tierMaxed(tier.key) && player.shopUpgrades[tier.key] > 0)
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

  DOMCacheGetOrSet('actualShop').style.display = ''
  updateShopDetail()
}
