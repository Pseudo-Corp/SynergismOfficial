import i18next from 'i18next'
import { achievementaward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateRuneLevels } from './Calculate'
import { CalcECC } from './Challenges'
import { format, player } from './Synergism'
import { Globals as G } from './Variables'

const talismanResourceCosts = {
  shard: {
    obtainium: 1e13,
    offerings: 1e2
  },
  commonFragment: {
    obtainium: 1e14,
    offerings: 1e4
  },
  uncommonFragment: {
    obtainium: 1e16,
    offerings: 1e5
  },
  rareFragment: {
    obtainium: 1e18,
    offerings: 1e6
  },
  epicFragment: {
    obtainium: 1e20,
    offerings: 1e7
  },
  legendaryFragment: {
    obtainium: 1e22,
    offerings: 1e8
  },
  mythicalFragment: {
    obtainium: 1e24,
    offerings: 1e9
  }
}

const num = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'] as const

export const calculateMaxTalismanLevel = (i: number) => {
  let maxLevel = 30 * player.talismanRarity[i]
  maxLevel += 6 * CalcECC('ascension', player.challengecompletions[13])
  maxLevel += Math.floor(player.researches[200] / 400)

  if (player.cubeUpgrades[67] > 0 && i === 3) {
    maxLevel += 1337
  }

  return maxLevel
}

const getTalismanResourceInfo = (
  type: keyof typeof talismanResourceCosts,
  percentage = player.buyTalismanShardPercent
) => {
  const obtainiumCost = talismanResourceCosts[type].obtainium
  const offeringCost = talismanResourceCosts[type].offerings

  const maxBuyObtainium = Math.max(1, Math.floor(player.researchPoints / obtainiumCost))
  const maxBuyOffering = Math.max(1, Math.floor(player.runeshards / offeringCost))
  const amountToBuy = Math.max(1, Math.floor(percentage / 100 * Math.min(maxBuyObtainium, maxBuyOffering)))
  const canBuy = (obtainiumCost <= player.researchPoints && offeringCost <= player.runeshards)
  return {
    canBuy, // Boolean, if false will not buy any fragments
    buyAmount: amountToBuy, // Integer, will buy as specified above.
    obtainiumCost: obtainiumCost * amountToBuy, // Integer, cost in obtainium to buy (buyAmount) resource
    offeringCost: offeringCost * amountToBuy // Integer, cost in offerings to buy (buyAmount) resource
  }
}

export const updateTalismanCostDisplay = (
  type: keyof typeof talismanResourceCosts | null,
  percentage = player.buyTalismanShardPercent
) => {
  const el = DOMCacheGetOrSet('talismanFragmentCost')
  if (type) {
    const talismanCostInfo = getTalismanResourceInfo(type, percentage)
    const talismanShardName = i18next.t(`runes.talismans.shards.${type}`)

    el.textContent = i18next.t('runes.talismans.costToBuy', {
      name: talismanShardName,
      buyAmount: format(talismanCostInfo.buyAmount),
      obtainium: format(talismanCostInfo.obtainiumCost),
      offerings: format(talismanCostInfo.offeringCost)
    })
  } else {
    // Buy All
    el.textContent = i18next.t('runes.talismans.clickBuyEveryType')
  }
}

export const toggleTalismanBuy = (i = player.buyTalismanShardPercent) => {
  DOMCacheGetOrSet('talismanTen').style.backgroundColor = ''
  DOMCacheGetOrSet('talismanTwentyFive').style.backgroundColor = ''
  DOMCacheGetOrSet('talismanFifty').style.backgroundColor = ''
  DOMCacheGetOrSet('talismanHundred').style.backgroundColor = ''
  player.buyTalismanShardPercent = i
  let x = 'Ten'
  if (i === 25) {
    x = 'TwentyFive'
  }
  if (i === 50) {
    x = 'Fifty'
  }
  if (i === 100) {
    x = 'Hundred'
  }

  DOMCacheGetOrSet(`talisman${x}`).style.backgroundColor = 'green'
}

export const updateTalismanInventory = () => {
  DOMCacheGetOrSet('talismanShardInventory').textContent = format(player.talismanShards)
  DOMCacheGetOrSet('commonFragmentInventory').textContent = format(player.commonFragments)
  DOMCacheGetOrSet('uncommonFragmentInventory').textContent = format(player.uncommonFragments)
  DOMCacheGetOrSet('rareFragmentInventory').textContent = format(player.rareFragments)
  DOMCacheGetOrSet('epicFragmentInventory').textContent = format(player.epicFragments)
  DOMCacheGetOrSet('legendaryFragmentInventory').textContent = format(player.legendaryFragments)
  DOMCacheGetOrSet('mythicalFragmentInventory').textContent = format(player.mythicalFragments)
}

export const buyAllTalismanResources = () => {
  const talismanItemNames = [
    'shard',
    'commonFragment',
    'uncommonFragment',
    'rareFragment',
    'epicFragment',
    'legendaryFragment',
    'mythicalFragment'
  ] as const
  for (let index = talismanItemNames.length - 1; index >= 0; index--) {
    buyTalismanResources(talismanItemNames[index])
  }
}

export const buyTalismanResources = (
  type: keyof typeof talismanResourceCosts,
  percentage = player.buyTalismanShardPercent
) => {
  const talismanResourcesData = getTalismanResourceInfo(type, percentage)

  if (talismanResourcesData.canBuy) {
    if (type === 'shard') {
      player.talismanShards += talismanResourcesData.buyAmount
    } else {
      player[`${type}s` as const] += talismanResourcesData.buyAmount
    }
    if (type === 'mythicalFragment' && player.mythicalFragments >= 1e25 && player.achievements[239] < 1) {
      achievementaward(239)
    }

    player.researchPoints -= talismanResourcesData.obtainiumCost
    player.runeshards -= talismanResourcesData.offeringCost

    // When dealing with high values, calculations can be very slightly off due to floating point precision
    // and result in buying slightly (usually 1) more than the player can actually afford.
    // This results in negative obtainium or offerings with further calcs somehow resulting in NaN/undefined.
    // Instead of trying to work around floating point limits, just make sure nothing breaks as a result.
    // The calculation being done overall is similar to the following calculation:
    // 2.9992198253874083e47 - (Math.floor(2.9992198253874083e47 / 1e20) * 1e20)
    // which, for most values, returns 0, but values like this example will return a negative number instead.
    if (player.researchPoints < 0) {
      player.researchPoints = 0
    }
    if (player.runeshards < 0) {
      player.runeshards = 0
    }
  }
  updateTalismanCostDisplay(type, percentage)
  updateTalismanInventory()
}

export const showTalismanEffect = (i: number) => {
  DOMCacheGetOrSet('talismanlevelup').style.display = 'none'
  DOMCacheGetOrSet('talismanEffect').style.display = 'block'
  DOMCacheGetOrSet('talismanrespec').style.display = 'none'
  const a = DOMCacheGetOrSet('talismanSummary')
  const b = DOMCacheGetOrSet('talismanBonus')
  const c = DOMCacheGetOrSet('talismanRune1Effect')
  const d = DOMCacheGetOrSet('talismanRune2Effect')
  const e = DOMCacheGetOrSet('talismanRune3Effect')
  const f = DOMCacheGetOrSet('talismanRune4Effect')
  const g = DOMCacheGetOrSet('talismanRune5Effect')
  const h = DOMCacheGetOrSet('talismanMythicEffect')

  let talismanKey = ''
  let effectValue = ''

  switch (i) {
    case 0:
      talismanKey = 'exemption'
      effectValue = format(10 * (player.talismanRarity[0] - 1))
      break
    case 1:
      talismanKey = 'chronos'
      effectValue = format(10 * (player.talismanRarity[1] - 1))
      break
    case 2:
      talismanKey = 'midas'
      effectValue = format(10 * (player.talismanRarity[2] - 1))
      break
    case 3:
      talismanKey = 'metaphysics'
      effectValue = format(0.02 * (player.talismanRarity[3] - 1), 2)
      break
    case 4:
      talismanKey = 'polymath'
      effectValue = format(1 * (player.talismanRarity[4] - 1))
      break
    case 5:
      talismanKey = 'mortuus'
      effectValue = format(2 * (player.talismanRarity[5] - 1))
      break
    case 6:
      talismanKey = 'plastic'

      break
  }

  const runeEffectName = `talisman${i + 1}Effect` as
    | 'talisman1Effect'
    | 'talisman2Effect'
    | 'talisman3Effect'
    | 'talisman4Effect'
    | 'talisman5Effect'
    | 'talisman6Effect'
    | 'talisman7Effect'

  a.textContent = i18next.t(`runes.talismans.summaries.${talismanKey}`)
  b.textContent = i18next.t(`runes.talismans.effects.${talismanKey}`, { x: effectValue })
  c.textContent = i18next.t('runes.talismans.bonusRuneLevels.speed', { x: format(G[runeEffectName][1], 2, true) })
  d.textContent = i18next.t('runes.talismans.bonusRuneLevels.duplication', { x: format(G[runeEffectName][2], 2, true) })
  e.textContent = i18next.t('runes.talismans.bonusRuneLevels.prism', { x: format(G[runeEffectName][3], 2, true) })
  f.textContent = i18next.t('runes.talismans.bonusRuneLevels.thrift', { x: format(G[runeEffectName][4], 2, true) })
  g.textContent = i18next.t('runes.talismans.bonusRuneLevels.SI', { x: format(G[runeEffectName][5], 2, true) })
  h.textContent = i18next.t(`runes.talismans.mythicEffects.${talismanKey}`)

  if (player.talismanRarity[i] !== 6) {
    h.textContent = i18next.t('runes.talismans.maxEnhance')
  }
}

export const showTalismanPrices = (i: number) => {
  DOMCacheGetOrSet('talismanEffect').style.display = 'none'
  DOMCacheGetOrSet('talismanlevelup').style.display = 'block'
  DOMCacheGetOrSet('talismanrespec').style.display = 'none'
  const a = DOMCacheGetOrSet('talismanShardCost')
  const b = DOMCacheGetOrSet('talismanCommonFragmentCost')
  const c = DOMCacheGetOrSet('talismanUncommonFragmentCost')
  const d = DOMCacheGetOrSet('talismanRareFragmentCost')
  const e = DOMCacheGetOrSet('talismanEpicFragmentCost')
  const f = DOMCacheGetOrSet('talismanLegendaryFragmentCost')
  const g = DOMCacheGetOrSet('talismanMythicalFragmentCost')

  DOMCacheGetOrSet('talismanLevelUpSummary').textContent = i18next.t('runes.resourcesToLevelup')
  DOMCacheGetOrSet('talismanLevelUpSummary').style.color = 'silver'

  let m = G.talismanLevelCostMultiplier[i]
  if (player.talismanLevels[i] >= 120) {
    m *= (player.talismanLevels[i] - 90) / 30
  }
  if (player.talismanLevels[i] >= 150) {
    m *= (player.talismanLevels[i] - 120) / 30
  }
  if (player.talismanLevels[i] >= 180) {
    m *= (player.talismanLevels[i] - 170) / 10
  }
  a.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i], 3))))
  b.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i] - 30, 3))))
  c.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i] - 60, 3))))
  d.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i] - 90, 3))))
  e.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i] - 120, 3))))
  f.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i] - 150, 3))))
  g.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i] - 150, 3))))
}

export const showEnhanceTalismanPrices = (i: number) => {
  DOMCacheGetOrSet('talismanEffect').style.display = 'none'
  DOMCacheGetOrSet('talismanlevelup').style.display = 'block'
  DOMCacheGetOrSet('talismanrespec').style.display = 'none'
  const a = DOMCacheGetOrSet('talismanShardCost')
  const b = DOMCacheGetOrSet('talismanCommonFragmentCost')
  const c = DOMCacheGetOrSet('talismanUncommonFragmentCost')
  const d = DOMCacheGetOrSet('talismanRareFragmentCost')
  const e = DOMCacheGetOrSet('talismanEpicFragmentCost')
  const f = DOMCacheGetOrSet('talismanLegendaryFragmentCost')
  const g = DOMCacheGetOrSet('talismanMythicalFragmentCost')

  DOMCacheGetOrSet('talismanLevelUpSummary').textContent = i18next.t('runes.resourcesToEnhance')
  DOMCacheGetOrSet('talismanLevelUpSummary').style.color = 'gold'

  const array = [
    G.commonTalismanEnhanceCost,
    G.uncommonTalismanEnchanceCost,
    G.rareTalismanEnchanceCost,
    G.epicTalismanEnhanceCost,
    G.legendaryTalismanEnchanceCost,
    G.mythicalTalismanEnchanceCost
  ]
  const index = player.talismanRarity[i]
  const costArray = array[index - 1]
  const m = G.talismanLevelCostMultiplier[i]
  a.textContent = format(m * costArray[1])
  b.textContent = format(m * costArray[2])
  c.textContent = format(m * costArray[3])
  d.textContent = format(m * costArray[4])
  e.textContent = format(m * costArray[5])
  f.textContent = format(m * costArray[6])
  g.textContent = format(m * costArray[7])
}

export const showRespecInformation = (i: number) => {
  G.talismanRespec = i
  DOMCacheGetOrSet('talismanEffect').style.display = 'none'
  DOMCacheGetOrSet('talismanlevelup').style.display = 'none'
  DOMCacheGetOrSet('talismanrespec').style.display = 'block'

  const runeName = ['speed', 'duplication', 'prism', 'thrift', 'SI']
  const runeModifier = ['positive', 'positive', 'positive', 'positive', 'positive']
  if (i <= 6) {
    for (let k = 1; k <= 5; k++) {
      G.mirrorTalismanStats[k] = player[`talisman${num[i]}` as const][k]
    }
    DOMCacheGetOrSet('confirmTalismanRespec').textContent = i18next.t('runes.talismans.respecConfirm')
  }
  if (i === 7) {
    for (let k = 1; k <= 5; k++) {
      G.mirrorTalismanStats[k] = 1
    }
    DOMCacheGetOrSet('confirmTalismanRespec').textContent = i18next.t('runes.talismans.respecConfirmAll')
  }
  for (let j = 1; j <= 5; j++) {
    const el = DOMCacheGetOrSet(`talismanRespecButton${j}`)
    if (G.mirrorTalismanStats[j] === 1) {
      el.style.border = '2px solid limegreen'
      runeModifier[j - 1] = 'positive'
    } else if (G.mirrorTalismanStats[j] === -1) {
      el.style.border = '2px solid crimson'
      runeModifier[j - 1] = 'negative'
    }
    el.textContent = i18next.t(`runes.talismans.modifiers.${runeModifier[j - 1]}`, {
      name: i18next.t(`runes.names.${runeName[j - 1]}`)
    })
  }

  DOMCacheGetOrSet('confirmTalismanRespec').style.display = 'none'
}

export const changeTalismanModifier = (i: number) => {
  const runeName = [null, 'speed', 'duplication', 'prism', 'thrift', 'SI']
  const el = DOMCacheGetOrSet(`talismanRespecButton${i}`)
  if (G.mirrorTalismanStats[i] === 1) {
    G.mirrorTalismanStats[i] = -1
    el.textContent = i18next.t('runes.talismans.modifiers.negative', { name: i18next.t(`runes.names.${runeName[i]}`) })
    el.style.border = '2px solid crimson'
  } else {
    G.mirrorTalismanStats[i] = 1
    el.textContent = i18next.t('runes.talismans.modifiers.positive', { name: i18next.t(`runes.names.${runeName[i]}`) })
    el.style.border = '2px solid limegreen'
  }

  const checkSum = G.mirrorTalismanStats.reduce((a, b) => a! + b!, 0)

  if (checkSum === 1) {
    DOMCacheGetOrSet('confirmTalismanRespec').style.display = 'block'
  } else {
    DOMCacheGetOrSet('confirmTalismanRespec').style.display = 'none'
  }
}

export const respecTalismanConfirm = (i: number) => {
  if (player.runeshards >= 100000 && i < 7) {
    for (let j = 1; j <= 5; j++) {
      player[`talisman${num[i]}` as const][j] = G.mirrorTalismanStats[j]
    }
    player.runeshards -= 100000
    DOMCacheGetOrSet('confirmTalismanRespec').style.display = 'none'
    DOMCacheGetOrSet('talismanrespec').style.display = 'none'
    DOMCacheGetOrSet('talismanEffect').style.display = 'block'
    showTalismanEffect(i)
  } else if (player.runeshards >= 400000 && i === 7) {
    player.runeshards -= 400000
    for (let j = 0; j < 7; j++) {
      for (let k = 1; k <= 5; k++) {
        player[`talisman${num[j]}` as const][k] = G.mirrorTalismanStats[k]
      }
    }
    DOMCacheGetOrSet('confirmTalismanRespec').style.display = 'none'
  }

  calculateRuneLevels()
}

export const respecTalismanCancel = (i: number) => {
  DOMCacheGetOrSet('talismanrespec').style.display = 'none'
  if (i < 7) {
    DOMCacheGetOrSet('talismanEffect').style.display = 'block'
    showTalismanEffect(i)
  }
}

export const updateTalismanAppearance = (i: number) => {
  const el = DOMCacheGetOrSet(`talisman${i + 1}`)
  const la = DOMCacheGetOrSet(`talisman${i + 1}level`)

  const rarity = player.talismanRarity[i]
  if (rarity === 1) {
    el.style.border = '4px solid white'
    la.style.color = 'white'
  }
  if (rarity === 2) {
    el.style.border = '4px solid limegreen'
    la.style.color = 'limegreen'
  }
  if (rarity === 3) {
    el.style.border = '4px solid lightblue'
    la.style.color = 'lightblue'
  }
  if (rarity === 4) {
    el.style.border = '4px solid plum'
    la.style.color = 'plum'
  }
  if (rarity === 5) {
    el.style.border = '4px solid orange'
    la.style.color = 'orange'
  }
  if (rarity === 6) {
    el.style.border = '4px solid crimson'
    la.style.color = 'var(--crimson-text-color)'
  }
}

// Attempt to buy a fixed number of levels (number varies based on
// ascension). Returns true if any levels were bought, false otherwise.
export const buyTalismanLevels = (i: number, auto = false): boolean => {
  let max = 1
  if (player.ascensionCount > 0) {
    max = 30
  }
  if (player.highestSingularityCount > 0) {
    max = 180
  }
  let hasPurchased = false
  for (let j = 1; j <= max; j++) {
    let checkSum = 0
    let priceMult = G.talismanLevelCostMultiplier[i]
    if (player.talismanLevels[i] >= 120) {
      priceMult *= (player.talismanLevels[i] - 90) / 30
    }
    if (player.talismanLevels[i] >= 150) {
      priceMult *= (player.talismanLevels[i] - 120) / 30
    }
    if (player.talismanLevels[i] >= 180) {
      priceMult *= (player.talismanLevels[i] - 170) / 10
    }

    if (player.talismanLevels[i] < calculateMaxTalismanLevel(i)) {
      if (
        player.talismanShards >= priceMult * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i], 3)))
      ) {
        checkSum++
      }
      if (
        player.commonFragments
          >= priceMult * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i] - 30, 3)))
      ) {
        checkSum++
      }
      if (
        player.uncommonFragments
          >= priceMult * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i] - 60, 3)))
      ) {
        checkSum++
      }
      if (
        player.rareFragments
          >= priceMult * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i] - 90, 3)))
      ) {
        checkSum++
      }
      if (
        player.epicFragments
          >= priceMult * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i] - 120, 3)))
      ) {
        checkSum++
      }
      if (
        player.legendaryFragments
          >= priceMult * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i] - 150, 3)))
      ) {
        checkSum++
      }
      if (
        player.mythicalFragments
          >= priceMult * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i] - 150, 3)))
      ) {
        checkSum++
      }
    }

    if (checkSum === 7) {
      player.talismanShards -= priceMult * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i], 3)))
      player.commonFragments -= priceMult
        * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i] - 30, 3)))
      player.uncommonFragments -= priceMult
        * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i] - 60, 3)))
      player.rareFragments -= priceMult
        * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i] - 90, 3)))
      player.epicFragments -= priceMult
        * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i] - 120, 3)))
      player.legendaryFragments -= priceMult
        * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i] - 150, 3)))
      player.mythicalFragments -= priceMult
        * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i] - 150, 3)))
      player.talismanLevels[i] += 1
      hasPurchased = true
    } else {
      break
    }
  }

  if (!auto && hasPurchased) {
    showTalismanPrices(i)
    // When adding game state recalculations, update the talisman autobuyer in tack() as well
    updateTalismanInventory()
    calculateRuneLevels()
  }

  return hasPurchased
}

export const buyTalismanEnhance = (i: number, auto = false): boolean => {
  let checkSum = 0
  if (player.talismanRarity[i] < 6) {
    const priceMult = G.talismanLevelCostMultiplier[i]
    const array = [
      G.commonTalismanEnhanceCost,
      G.uncommonTalismanEnchanceCost,
      G.rareTalismanEnchanceCost,
      G.epicTalismanEnhanceCost,
      G.legendaryTalismanEnchanceCost,
      G.mythicalTalismanEnchanceCost
    ]
    const index = player.talismanRarity[i] - 1
    const costArray = array[index]
    if (player.commonFragments >= priceMult * costArray[2]) {
      checkSum++
    }
    if (player.uncommonFragments >= priceMult * costArray[3]) {
      checkSum++
    }
    if (player.rareFragments >= priceMult * costArray[4]) {
      checkSum++
    }
    if (player.epicFragments >= priceMult * costArray[5]) {
      checkSum++
    }
    if (player.legendaryFragments >= priceMult * costArray[6]) {
      checkSum++
    }
    if (player.mythicalFragments >= priceMult * costArray[7]) {
      checkSum++
    }

    if (checkSum === 6) {
      player.commonFragments -= priceMult * costArray[2]
      player.uncommonFragments -= priceMult * costArray[3]
      player.rareFragments -= priceMult * costArray[4]
      player.epicFragments -= priceMult * costArray[5]
      player.legendaryFragments -= priceMult * costArray[6]
      player.mythicalFragments -= priceMult * costArray[7]
      player.talismanRarity[i] += 1

      // Appearance always needs updating if bought
      updateTalismanAppearance(i)
      if (!auto) {
        showEnhanceTalismanPrices(i)
        // When adding game state recalculations, update the talisman autobuyer in tack() as well
        updateTalismanInventory()
        calculateRuneLevels()
      }

      return true
    }
  }
  return false
}
