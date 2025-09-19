import Decimal, { type DecimalSource } from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAnts } from './Calculate'
import { getResetResearches } from './Reset'
import { calculateSingularityDebuff } from './singularity'
import { format, player } from './Synergism'
import { revealStuff, updateChallengeDisplay } from './UpdateHTML'
import { sortDecimalWithIndices, updateClassList } from './Utility'

export interface IResearchData {
  baseCost: Decimal
  maxLevel: number
  // Some research (e.g. 200) can have custom growth (i.e. nonconstant)
  // may as well specify in general.
  buyToLevel: (budget: Decimal, baseCost: Decimal, currLevel: number, maxLevel: number) => number
  // A given levelsBuyable should correspond to a cost for that many levels
  // It is generally difficult to calculate inverses since budget != cost for levels
  // So we should choose functions for which it is easy to compute the inverse.
  costForLevels: (baseCost: Decimal, currLevel: number, buyTo: number) => Decimal
  unlocked: () => boolean
}

// TODO: Maybe we should just manually create this map? I was a bit lazy to port all the values
// dprint-ignore
const researchBaseCosts: DecimalSource[] = [
  Number.POSITIVE_INFINITY,
  1, 1, 1, 1, 1,
  1, 1e2, 1e4, 1e6, 1e8,
  2, 2e2, 2e4, 2e6, 2e8,
  4e4, 4e8, 10, 1e5, 1e9,
  100, 100, 1e4, 2e3, 2e5,
  40, 200, 50, 5000, 20000000,
  777, 7777, 50000, 500000, 5000000,
  2e3, 2e6, 2e9, 1e5, 1e9,
  1, 1, 5, 25, 125,
  2, 5, 320, 1280, 2.5e9,
  10, 2e3, 4e5, 8e7, 2e9,
  5, 400, 1e4, 3e6, 9e8,
  100, 2500, 100, 2000, 2e5,
  1, 20, 3e3, 4e5, 5e7,
  10, 40, 160, 1000, 10000,
  4e9, 7e9, 1e10, 1.2e10, 1.5e10,
  1e12, 1e13, 3e12, 2e13, 2e13,
  2e14, 6e14, 2e15, 6e15, 2e16,
  1e16, 2e16, 2e17, 4e17, 1e18,
  1e13, 1e14, 1e15, 7.777e18, 7.777e20,
  1e16, 3e16, 1e17, 3e17, 1e20,
  1e18, 3e18, 1e19, 3e19, 1e20,
  1e20, 2e20, 4e20, 8e20, 1e21,
  2e21, 4e21, 8e21, 2e22, 4e22,
  3.2e21, 2e23, 4e23, 1e21, 7.777e32,
  5e8, 5e12, 5e16, 5e20, 5e24, /*ascension tier */
  1e25, 2e25, 4e25, 8e25, 1e26,
  4e26, 8e26, 1e27, 2e27, 1e28,
  5e9, 5e15, 5e21, 5e27, 1e28, /*challenge 11 tier */
  1e29, 2e29, 4e29, 8e29, 1e27,
  2e30, 4e30, 8e30, 1e31, 2e31,
  5e31, 1e32, 2e32, 4e32, 8e32, /*challenge 12 tier */
  1e33, 2e33, 4e33, 8e33, 1e34,
  3e34, 1e35, 3e35, 6e35, 1e36,
  3e36, 1e37, 3e37, 1e38, 3e38, /*challenge 13 tier */
  1e39, 3e39, 1e40, 3e40, 1e50,
  3e41, 1e42, 3e42, 6e42, 1e43,
  3e43, 1e44, 3e44, 1e45, 3e45, /*challenge 14 tier */
  2e46, 6e46, 2e47, 6e47, 1e64,
  6e48, 2e49, 1e50, 1e51, 4e56
]

// dprint-ignore
const researchMaxLevels: DecimalSource[] = [
  0, 1, 1, 1, 1, 1,
  10, 10, 10, 10, 10,
  10, 10, 10, 10, 10,
  10, 10, 1, 1, 1,
  25, 25, 25, 20, 20,
  10, 10, 10, 10, 10,
  12, 12, 10, 10, 10,
  10, 10, 10, 1, 1,
  1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
  10, 10, 10, 10, 10,
  20, 20, 20, 20, 20,
  1, 5, 4, 5, 5,
  10, 10, 10, 10, 10,
  1, 1, 1, 1, 1,
  10, 15, 15, 15, 15,
  10, 1, 20, 20, 20,
  20, 20, 20, 20, 10,
  20, 20, 20, 20, 1,
  20, 5, 5, 3, 2,
  10, 10, 10, 10, 1,
  10, 10, 20, 25, 25,
  15, 15, 15, 15, 30,
  10, 10, 10, 100, 100,
  25, 25, 25, 1, 5,
  10, 10, 10, 10, 1,
  10, 10, 10, 1, 1,
  25, 25, 25, 15, 1,
  10, 10, 10, 10, 1,
  10, 1, 6, 10, 1,
  25, 25, 1, 15, 1,
  10, 10, 10, 1, 1,
  10, 10, 10, 10, 1,
  25, 25, 25, 15, 1,
  10, 10, 10, 1, 1,
  10, 3, 6, 10, 5,
  25, 25, 1, 15, 1,
  20, 20, 20, 1, 1,
  20, 1, 50, 50, 10,
  25, 25, 25, 15, 100000
]

export interface IResearchData {
  baseCost: Decimal
  maxLevel: number
  // Some research (e.g. 200) can have custom growth (i.e. nonconstant)
  // may as well specify in general.
  buyToLevel: (budget: Decimal, baseCost: Decimal, currLevel: number, maxLevel: number) => number
  // A given levelsBuyable should correspond to a cost for that many levels
  // It is generally difficult to calculate inverses since budget != cost for levels
  // So we should choose functions for which the inverse is analytical (see below functions)
  costForLevels: (baseCost: Decimal, currLevel: number, buyTo: number) => Decimal
  unlocked: () => boolean
}

// Requires degree != 0, should only be used for positive degree, though
const polyBuyToLevel = (
  degree: number
): (budget: Decimal, baseCost: Decimal, currLevel: number, maxLevel: number) => number => {
  return (budget: Decimal, baseCost: Decimal, currLevel: number, maxLevel: number) => {
    const effectiveBudget = budget.add(baseCost.times(Math.pow(currLevel, degree)))
    return Math.min(maxLevel, Decimal.floor(Decimal.pow(effectiveBudget.div(baseCost), 1 / degree)).toNumber())
  }
}

// Requires degree != 0, should only be used for positive degree, though
const polyCostForLevels = (degree: number): (baseCost: Decimal, currlevel: number, toBuy: number) => Decimal => {
  return (baseCost: Decimal, currLevel: number, buyTo: number) => {
    if (currLevel === buyTo) {
      return new Decimal(0)
    }
    return baseCost.times(Math.pow(buyTo, degree) - Math.pow(currLevel, degree))
  }
}

type RangeLevelAndCost = {
  range: [number, number]
  level: (budget: Decimal, baseCost: Decimal, currLevel: number, maxLevel: number) => number
  cost: (baseCost: Decimal, currLevel: number, buyTo: number) => Decimal
}

// polyCostForLevels(1) implies constant cost per level, polyCostForLevels(2) implies linear growth in cost per level, etc.
const researchLevelCostRanges: RangeLevelAndCost[] = [
  { range: [0, 199], level: polyBuyToLevel(1), cost: polyCostForLevels(1) },
  { range: [200, 200], level: polyBuyToLevel(2), cost: polyCostForLevels(2) }
]

type RangeCondition = {
  range: [number, number]
  condition: () => boolean
}

const researchUnlockRanges: RangeCondition[] = [
  { range: [0, 0], condition: () => true }, // Not sure if needed!
  { range: [1, 80], condition: () => player.unlocks.reincarnate },
  { range: [81, 100], condition: () => player.unlocks.anthill },
  { range: [101, 110], condition: () => player.unlocks.talismans },
  { range: [111, 125], condition: () => player.unlocks.ascensions },
  { range: [126, 140], condition: () => player.ascensionCount > 0 },
  { range: [141, 155], condition: () => player.highestchallengecompletions[11] > 0 },
  { range: [156, 170], condition: () => player.highestchallengecompletions[12] > 0 },
  { range: [171, 185], condition: () => player.highestchallengecompletions[13] > 0 },
  { range: [186, 200], condition: () => player.highestchallengecompletions[14] > 0 }
]

const createResearchDataMap = (
  rangeLC: RangeLevelAndCost[],
  rangeU: RangeCondition[],
  costs: DecimalSource[],
  maxLevels: DecimalSource[]
): Record<number, IResearchData> => {
  const dataMap: Record<number, IResearchData> = {}

  const unlockLookup: Record<number, () => boolean> = {}
  for (const { range, condition } of rangeU) {
    const [start, end] = range
    for (let i = start; i <= end; i++) {
      unlockLookup[i] = condition
    }
  }

  const levelCostLookup: Record<number, { level: typeof rangeLC[0]['level']; cost: typeof rangeLC[0]['cost'] }> = {}
  for (const { range, level, cost } of rangeLC) {
    const [start, end] = range
    for (let i = start; i <= end; i++) {
      levelCostLookup[i] = { level, cost }
    }
  }

  for (let i = 0; i < costs.length && i < maxLevels.length; i++) {
    const levelCostFunctions = levelCostLookup[i]
    const unlockFunction = unlockLookup[i]

    if (levelCostFunctions && unlockFunction) {
      dataMap[i] = {
        baseCost: new Decimal(costs[i]),
        maxLevel: Number(maxLevels[i]),
        buyToLevel: levelCostFunctions.level,
        costForLevels: levelCostFunctions.cost,
        unlocked: unlockFunction
      }
    }
  }

  return dataMap
}

export const researchData = createResearchDataMap(
  researchLevelCostRanges,
  researchUnlockRanges,
  researchBaseCosts,
  researchMaxLevels
)

export const isResearchUnlocked = (index: number): boolean => {
  const unlockFunction = researchData[index].unlocked
  return unlockFunction ? unlockFunction() : false
}

export const getBuyableResearchLevel = (index: number): number => {
  const buyToLevelFunc = researchData[index].buyToLevel
  const baseCost = researchData[index].baseCost
  const currLevel = player.researches[index]
  const maxLevel = researchData[index].maxLevel
  const budget = player.obtainium

  const researchCostMulti = calculateSingularityDebuff('Researches')

  return buyToLevelFunc(budget, baseCost.times(researchCostMulti), currLevel, maxLevel)
}

export const getCostForResearchLevels = (index: number, buyTo: number): Decimal => {
  const costForLevelsFunc = researchData[index].costForLevels
  const baseCost = researchData[index].baseCost
  const currLevel = player.researches[index]

  const researchCostMulti = calculateSingularityDebuff('Researches')

  return costForLevelsFunc(baseCost.times(researchCostMulti), currLevel, buyTo)
}

export const researchOrderByCost: number[] = sortDecimalWithIndices(researchBaseCosts)

// For mode 'manual'
export const updateResearchAuto = (index: number) => {
  DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
  DOMCacheGetOrSet(`res${index}`).classList.add('researchRoomba')
  player.autoResearch = index

  // Research is maxed
  if (isResearchMaxed(index)) {
    updateClassList(`res${player.autoResearch}`, ['researchMaxed'], ['researchPurchased'])
  } else if (player.researches[index] >= 1) {
    // Research purchased above level 0 but not maxed
    updateClassList(`res${player.autoResearch}`, ['researchPurchased'], ['researchMaxed'])
  } else {
    // Research has not been purchased yet
    updateClassList(`res${player.autoResearch}`, [], ['researchPurchased', 'researchMaxed'])
  }
}

// For mode 'cheapest' and assumes you have Cube Upgrade 9 (1x9) purchased
export const updateResearchRoomba = () => {
  if (isResearchMaxed(player.autoResearch) || !isResearchUnlocked(player.autoResearch)) {
    DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
    player.roombaResearchIndex = Math.min(researchOrderByCost.length - 1, player.roombaResearchIndex + 1)
    player.autoResearch = researchOrderByCost[player.roombaResearchIndex]
  }
  // Edge Case? If we reach end of the list, but there is still unlockable research,
  // we can loop around again. This should not affect performance that much, and stops
  // a few of the more annoying bugs
  if (player.roombaResearchIndex === 200 && !isResearchUnlocked(200)) {
    player.roombaResearchIndex = 0 // Reset to the start if we reach the end
    player.autoResearch = researchOrderByCost[player.roombaResearchIndex]
  }

  DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.add('researchRoomba')
}

/**
 * Should the user have access to roomba autoResearch
 * @returns boolean
 */
export const roombaResearchEnabled = (): boolean => {
  return (player.cubeUpgrades[9] === 1 || player.highestSingularityCount > 10)
}
/**
 * Attempts to buy the research of the index selected. This is hopefully an improvement over buyResearch. Fuck
 * @param index
 * @param auto
 * @returns
 */
export const buyResearch = (index: number, auto: boolean, hover: boolean) => {
  if (isResearchMaxed(index) || !isResearchUnlocked(index)) {
    return
  }

  // Get our costs, and determine if anything is purchasable.
  const buyAmount = (player.researchBuyMaxToggle || auto || hover) ? Number.POSITIVE_INFINITY : 1
  const maxLevel = researchData[index].maxLevel

  let levelToBuy = getBuyableResearchLevel(index)
  levelToBuy = Math.min(maxLevel, levelToBuy, player.researches[index] + buyAmount)

  const researchCost = getCostForResearchLevels(index, levelToBuy)

  // If the cost is 0, then we are only able to buy up to currentLevel, which is true
  // when the cost to the next level is too prohibitive (getCost is cumulative)
  const canBuy = researchCost.gt(0)

  if (canBuy) {
    player.researches[index] = levelToBuy
    player.obtainium = player.obtainium.sub(researchCost)
    // Quick check after upgrading for max. This is to update any automation regardless of auto state
    if (isResearchMaxed(index)) {
      DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
    }

    researchDescriptions(index, auto)

    if (index >= 47 && index <= 50) {
      player.unlocks.rrow1 ||= player.researches[47] > 0
      player.unlocks.rrow2 ||= player.researches[48] > 0
      player.unlocks.rrow3 ||= player.researches[49] > 0
      player.unlocks.rrow4 ||= player.researches[50] > 0
      revealStuff()
    }
    if ((index >= 66 && index <= 70) || index === 105) {
      updateChallengeDisplay()
    }

    // Update ants.
    calculateAnts()
  }

  return
}

export const isResearchMaxed = (index: number) => player.researches[index] >= researchData[index].maxLevel

export const researchDescriptions = (index: number, auto = false) => {
  const buyAmount = (player.researchBuyMaxToggle || auto) ? Number.POSITIVE_INFINITY : 1

  const y = i18next.t(`researches.descriptions.${index}`)
  const p = `res${index}`

  let levelToBuy = getBuyableResearchLevel(index)
  levelToBuy = Math.min(researchData[index].maxLevel, levelToBuy, player.researches[index] + buyAmount)

  let obtainiumCost = new Decimal(0)

  // If levelToBuy is = current level, either we've already maxxed the upgrade
  // OR we cannot afford any levels. Check which one.
  if (levelToBuy === player.researches[index]) {
    // If max level, we don't actually need to change anything
    // If not max level, we need to show the cost of the next level
    if (!isResearchMaxed(index)) {
      levelToBuy += 1
      obtainiumCost = getCostForResearchLevels(index, levelToBuy)
    }
  } else {
    obtainiumCost = getCostForResearchLevels(index, levelToBuy)
  }

  let z = i18next.t('researches.cost', {
    x: format(obtainiumCost, 0, false),
    y: format(levelToBuy - player.researches[index], 0, true)
  })

  if (isResearchMaxed(index)) {
    DOMCacheGetOrSet('researchcost').style.color = 'Gold'
    DOMCacheGetOrSet('researchinfo3').style.color = 'plum'
    updateClassList(p, ['researchMaxed'], ['researchAvailable', 'researchPurchased', 'researchPurchasedAvailable'])
    z += i18next.t('researches.maxed')
  } else {
    DOMCacheGetOrSet('researchcost').style.color = 'limegreen'
    DOMCacheGetOrSet('researchinfo3').style.color = 'white'
    if (player.researches[index] > 0) {
      updateClassList(p, ['researchPurchased', 'researchPurchasedAvailable'], [
        'researchAvailable',
        'researchMaxed'
      ])
    } else {
      updateClassList(p, ['researchAvailable'], ['researchPurchased', 'researchMaxed'])
    }
  }

  if (player.obtainium.lt(obtainiumCost) && !isResearchMaxed(index)) {
    DOMCacheGetOrSet('researchcost').style.color = 'var(--crimson-text-color)'
    updateClassList(p, [], ['researchMaxed', 'researchAvailable', 'researchPurchasedAvailable'])
  }

  DOMCacheGetOrSet('researchinfo2').innerHTML = y
  DOMCacheGetOrSet('researchcost').textContent = z
  DOMCacheGetOrSet('researchinfo3').textContent = i18next.t('researches.level', {
    x: player.researches[index],
    y: researchData[index].maxLevel
  })
  const resetInfo = DOMCacheGetOrSet('researchinfo4')

  if (getResetResearches().includes(index)) {
    resetInfo.textContent = i18next.t('researches.resets')
    resetInfo.classList.remove('crimsonText')
  } else {
    resetInfo.textContent = i18next.t('researches.doesNotReset')
    resetInfo.classList.add('crimsonText')
  }
}

// This should only happen in rare cases, when an update changes max levels
// We still need to handle this on each load, since very old savefiles likely have
// several overcaps
export const refundOvercapResearches = () => {
  for (let i = 1; i <= player.researches.length - 1; i++) {
    if (player.researches[i] > researchData[i].maxLevel) {
      const overcapLevel = player.researches[i]
      player.researches[i] = researchData[i].maxLevel

      // This works because this function computes the cost to get from current level
      // (which is maxLevel at this point) to the overcapLevel, and it's a cumulative function.
      const obtainiumSpentAboveCap = getCostForResearchLevels(i, overcapLevel)
      player.obtainium = player.obtainium.add(obtainiumSpentAboveCap)
    }
  }
}

export const updateResearchBG = (index: number) => {
  const id = `res${index}`
  if (player.researches[index] > 0 && !isResearchMaxed(index)) {
    updateClassList(id, ['researchPurchased'], ['researchMaxed'])
  } else if (player.researches[index] > 0 && isResearchMaxed(index)) {
    updateClassList(id, ['researchMaxed'], ['researchPurchased'])
  } else {
    updateClassList(id, [], ['researchPurchased', 'researchMaxed'])
  }
}
