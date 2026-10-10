import Decimal from 'break_infinity.js'
import { awardAchievementGroup } from './Achievements'
import { type baseTraction, calculateBuildingConstruction, calculateConstruction, calculateTraction } from './Calculate'
import { reset } from './Reset'
import { getRuneEffects } from './Runes'
import { player } from './Synergism'
import type { BuyAmount, OneToFive, ZeroToFour } from './types/Synergism'
import { crystalupgradedescriptions, upgradeRequirements, upgradeupdate } from './Upgrades'
import { smallestInc } from './Utility'
import { Globals as G, Upgrade } from './Variables'

const producerData = {
  coin: {
    name: 'Coin',
    currency: 'coins',
    production: 'coin',
    costs: [100, 1000, 2e4, 4e5, 8e6],
    growth: [1, 2, 3, 4, 5]
  },
  diamond: {
    name: 'Diamonds',
    currency: 'prestigePoints',
    production: 'crystal',
    costs: [100, 1e5, 1e15, 1e40, 1e100],
    growth: [1, 3, 6, 10, 15]
  },
  mythos: {
    name: 'Mythos',
    currency: 'transcendPoints',
    production: 'mythos',
    costs: [1, 1e2, 1e4, 1e8, 1e16],
    growth: [1, 3, 6, 10, 15]
  },
  particle: {
    name: 'Particles',
    currency: 'reincarnationPoints',
    production: 'particle',
    costs: [1, 1e2, 1e4, 1e8, 1e16],
    growth: [1, 1, 1, 1, 1]
  }
} as const

const accelMultData = {
  accelerator: {
    cost: 500,
    growth: 4
  },
  multiplier: {
    cost: 10000,
    growth: 10
  }
} as const

const softcap = 1e15

const getScalingThreshold = (value: number, cap = softcap) => value <= cap ? value : cap * Math.cbrt(value / cap)

const linSum = (n: number) => n * (n + 1) / 2

export type BuildingType = keyof typeof producerData | keyof typeof accelMultData | 'acceleratorBoost'
type ScalingBuildingType = keyof typeof producerData

const challengeBuildingSoftcap = 1e13
const challenge8BuildingSoftcap = 1e12
const challenge8GrowthPower = 2
const acceleratorBoostCost = 1000
const acceleratorBoostLinearExponent = 9.5
const acceleratorBoostPostTractionMultiplier = 10
const affordabilityTolerance = 1 + 1e-9

interface CostCurve {
  growth: number
  log10Growth: number
  scale: Decimal
  exponentBetween: (from: number, to: number) => number
  countForExponent: (exponent: number) => number
}

const isScalingBuilding = (type: BuildingType): type is ScalingBuildingType =>
  type === 'coin' || type === 'diamond' || type === 'mythos' || type === 'particle'

export const getBuildingCostKey = () =>
  `${calculateConstruction()}|${calculateTraction('accelerator')}|${calculateTraction('multiplier')}|${
    calculateTraction('acceleratorBoost')
  }|${player.currentChallenge.transcension}|${player.currentChallenge.reincarnation}|${player.currentChallenge.ascension}`

const createQuadraticCostCurve = (cost: number, growth: number, threshold: number): CostCurve => ({
  growth,
  log10Growth: Math.log10(growth),
  scale: Decimal.fromNumber(cost / (growth - 1)),
  exponentBetween: (from, to) => {
    let exponent = 0
    let start = from
    if (start < threshold) {
      const end = Math.min(to, threshold)
      exponent += end - start
      start = end
    }
    if (start < to) {
      exponent += (to - start) * (1 + (to + start - 2 * threshold) / threshold)
    }
    return exponent
  },
  countForExponent: (exponent) =>
    exponent <= threshold
      ? exponent
      : (threshold + Math.sqrt(4 * threshold * exponent - 3 * Math.pow(threshold, 2))) / 2
})

const acceleratorBoostBaseExponentBetween = (from: number, to: number) =>
  (to - from) * (acceleratorBoostLinearExponent + (to + from) / 2)

const createAcceleratorBoostCostCurve = (threshold: number): CostCurve => {
  const thresholdExponent = acceleratorBoostBaseExponentBetween(0, threshold)
  const exponentBetween = (from: number, to: number) => {
    const end = Math.min(to, threshold)
    const start = Math.max(from, threshold)
    return (from < end ? acceleratorBoostBaseExponentBetween(from, end) : 0)
      + (start < to ? acceleratorBoostPostTractionMultiplier * acceleratorBoostBaseExponentBetween(start, to) : 0)
  }

  return {
    growth: 10,
    log10Growth: 1,
    scale: Decimal.fromNumber(acceleratorBoostCost / (Math.pow(10, exponentBetween(0, 1)) - 1)),
    exponentBetween,
    countForExponent: (exponent) => {
      const baseExponent = exponent <= thresholdExponent
        ? exponent
        : thresholdExponent + (exponent - thresholdExponent) / acceleratorBoostPostTractionMultiplier
      return Math.sqrt(Math.pow(acceleratorBoostLinearExponent, 2) + 2 * baseExponent) - acceleratorBoostLinearExponent
    }
  }
}

const getBaseBuildingSoftcap = (type: ScalingBuildingType) => {
  if (type === 'particle') {
    return softcap
  }
  if (player.currentChallenge.reincarnation === 8) {
    return challenge8BuildingSoftcap
  }
  if (
    type !== 'mythos'
    && (player.currentChallenge.transcension === 4 || player.currentChallenge.reincarnation === 10)
  ) {
    return challengeBuildingSoftcap
  }
  return softcap
}

export const getBuildingScalingThreshold = (type: ScalingBuildingType) =>
  getScalingThreshold(calculateBuildingConstruction(type), getBaseBuildingSoftcap(type))

export const getTractionScalingThreshold = (type: keyof typeof baseTraction) =>
  getScalingThreshold(calculateTraction(type))

const getBuildingCostCurve = (type: ScalingBuildingType, index: ZeroToFour): CostCurve => {
  const growthPower = player.currentChallenge.reincarnation === 8 && type !== 'particle' ? challenge8GrowthPower : 1
  return createQuadraticCostCurve(
    producerData[type].costs[index],
    Math.pow(1.25, producerData[type].growth[index] * growthPower),
    getBuildingScalingThreshold(type)
  )
}

const getAccelMultCostCurve = (type: keyof typeof accelMultData): CostCurve => {
  const data = accelMultData[type]
  const growthPower = player.currentChallenge.reincarnation === 8 ? challenge8GrowthPower : 1
  return createQuadraticCostCurve(data.cost, Math.pow(data.growth, growthPower), getTractionScalingThreshold(type))
}

const getCostCurve = (type: BuildingType, index: ZeroToFour): CostCurve => {
  switch (type) {
    case 'accelerator':
    case 'multiplier':
      return getAccelMultCostCurve(type)
    case 'acceleratorBoost':
      return createAcceleratorBoostCostCurve(getTractionScalingThreshold('acceleratorBoost'))
  }
  return getBuildingCostCurve(type, index)
}

const costBetween = (curve: CostCurve, from: number, to: number): Decimal => {
  if (to <= from) {
    return new Decimal()
  }
  const exponent = curve.exponentBetween(from, to)
  const increase = curve.log10Growth * exponent < 300
    ? Decimal.fromNumber(Math.pow(curve.growth, exponent) - 1)
    : Decimal.pow(curve.growth, exponent)
  return curve.scale.times(Decimal.pow(curve.growth, curve.exponentBetween(0, from))).times(increase)
}

const maxAffordable = (curve: CostCurve, owned: number, budget: Decimal) => {
  const limit = budget.times(affordabilityTolerance)
  const log10Total = Decimal.pow(10, curve.log10Growth * curve.exponentBetween(0, owned))
    .add(budget.div(curve.scale))
    .log10()
  let count = Math.max(owned, Math.floor(curve.countForExponent(log10Total / curve.log10Growth)))
  while (count > owned && costBetween(curve, owned, count).gt(limit)) {
    count -= smallestInc(count)
  }
  while (
    count + smallestInc(count) <= Number.MAX_SAFE_INTEGER
    && costBetween(curve, owned, count + smallestInc(count)).lte(limit)
  ) {
    count += smallestInc(count)
  }
  return count
}

const curveBuildings: readonly { type: BuildingType; index: ZeroToFour }[] = [
  ...(['coin', 'diamond', 'mythos', 'particle'] as const).flatMap((type) =>
    ([0, 1, 2, 3, 4] as const).map((index) => ({ type, index }))
  ),
  { type: 'accelerator', index: 0 },
  { type: 'multiplier', index: 0 },
  { type: 'acceleratorBoost', index: 0 }
]

const getCurveBuildingKeys = (type: BuildingType, index: ZeroToFour) => {
  if (isScalingBuilding(type)) {
    const { currency, name, production } = producerData[type]
    const pos = G.ordinals[index]
    return {
      currency,
      owned: `${pos}Owned${name}` as const,
      paid: `${pos}Paid${name}` as const,
      amount: player[`${production}buyamount` as const]
    }
  }
  return {
    currency: type === 'acceleratorBoost' ? 'prestigePoints' as const : 'coins' as const,
    owned: `${type}Bought` as const,
    paid: `${type}Paid` as const,
    amount: player.coinbuyamount
  }
}

export type CurvePaidKey = ReturnType<typeof getCurveBuildingKeys>['paid']

const setCurveBuildingState = (type: BuildingType, index: ZeroToFour, curve: CostCurve, owned: number) => {
  const keys = getCurveBuildingKeys(type, index)
  player[keys.owned] = owned
  const price = costBetween(curve, owned, owned + smallestInc(owned))
  const credit = player[keys.paid].sub(costBetween(curve, 0, owned))
  G.buildingCosts[type][index] = credit.gt(0) && credit.lt(price) ? price.sub(credit) : price
}

export const getBuildingCost = (type: BuildingType, index: ZeroToFour = 0) => G.buildingCosts[type][index]

export const syncCurveBuilding = (type: BuildingType, index: ZeroToFour = 0) => {
  const curve = getCostCurve(type, index)
  setCurveBuildingState(type, index, curve, maxAffordable(curve, 0, player[getCurveBuildingKeys(type, index).paid]))
}

export const syncCurveBuildings = () => {
  for (const { type, index } of curveBuildings) {
    syncCurveBuilding(type, index)
  }
}

export const grantCurveBuildings = (type: BuildingType, index: ZeroToFour, count: number) => {
  const curve = getCostCurve(type, index)
  const keys = getCurveBuildingKeys(type, index)
  player[keys.paid] = Decimal.max(player[keys.paid], costBetween(curve, 0, count))
  setCurveBuildingState(type, index, curve, maxAffordable(curve, 0, player[keys.paid]))
}

export const initializeCurveBuildingsPaid = (isPaidLoaded: (key: CurvePaidKey) => boolean) => {
  for (const { type, index } of curveBuildings) {
    const keys = getCurveBuildingKeys(type, index)
    if (!isPaidLoaded(keys.paid)) {
      player[keys.paid] = costBetween(getCostCurve(type, index), 0, player[keys.owned])
    }
  }
  syncCurveBuildings()
}

const buyCurveBuilding = (type: BuildingType, amount: BuyAmount | 'max' | undefined, index: ZeroToFour) => {
  const keys = getCurveBuildingKeys(type, index)
  const curve = getCostCurve(type, index)
  const owned = player[keys.owned]
  const paid = player[keys.paid]
  const buyAmount = amount ?? keys.amount

  let buyTo = maxAffordable(curve, 0, paid.add(player[keys.currency]))
  if (buyAmount !== 'max') {
    buyTo = Math.min(buyTo, owned + buyAmount)
  }
  if (buyTo <= owned) {
    return false
  }

  const totalCost = costBetween(curve, 0, buyTo)
  player[keys.currency] = player[keys.currency].sub(totalCost.sub(paid).max(0)).max(0)
  player[keys.paid] = Decimal.max(paid, totalCost)
  setCurveBuildingState(type, index, curve, buyTo)
  return true
}

export const buyBuilding = (
  type: BuildingType,
  amount?: BuyAmount | 'max',
  index: ZeroToFour = 0
) => {
  if (!buyCurveBuilding(type, amount, index)) {
    return
  }

  if (type === 'accelerator' || type === 'multiplier') {
    player[`prestigeno${type}` as const] = false
    player[`transcendno${type}` as const] = false
    player[`reincarnateno${type}` as const] = false
    awardAchievementGroup(`${type}s` as const)
  } else if (type === 'acceleratorBoost') {
    player.transcendnoaccelerator = false
    player.reincarnatenoaccelerator = false
  }
}

export const buyUpgrades = (type: Upgrade, pos: number, state?: boolean) => {
  if (!upgradeRequirements[pos]()) {
    return
  }

  const currency = type
  let sub: Decimal
  if (player.upgrades[pos] === 0 && player[currency].gte(sub = Decimal.pow(10, G.upgradeCosts[pos]))) {
    player[currency] = player[currency].sub(sub)
    player.upgrades[pos] = 1
    upgradeupdate(pos, state)
  }

  if (type === Upgrade.transcend) {
    player.reincarnatenocoinprestigeortranscendupgrades = false
    player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false
  }
  if (type === Upgrade.prestige) {
    player.transcendnocoinorprestigeupgrades = false
    player.reincarnatenocoinorprestigeupgrades = false
    player.reincarnatenocoinprestigeortranscendupgrades = false
    player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false
  }
  if (type === Upgrade.coin) {
    player.prestigenocoinupgrades = false
    player.transcendnocoinupgrades = false
    player.transcendnocoinorprestigeupgrades = false
    player.reincarnatenocoinupgrades = false
    player.reincarnatenocoinorprestigeupgrades = false
    player.reincarnatenocoinprestigeortranscendupgrades = false
    player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false
  }
}

const calculateCrystalBuy = (i: number) => {
  const u = i - 1
  const exponent = Decimal.log(player.prestigeShards.add(1), 10)
  const exponentCostReduction = getRuneEffects('prism', 'costDivisorLog10')
  const toBuy = Math.floor(
    Math.pow(
      Math.max(
        0,
        2 * (exponent + exponentCostReduction - G.crystalUpgradesCost[u]) / G.crystalUpgradeCostIncrement[u] + 1 / 4
      ),
      1 / 2
    )
      + 1 / 2
  )
  return toBuy
}

export const buyCrystalUpgrades = (i: number, auto = false) => {
  const u = i - 1

  let c = 0
  if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
    c += 10
  }

  const costReduction = getRuneEffects('prism', 'costDivisorLog10')

  const toBuy = calculateCrystalBuy(i)

  if (toBuy + c > player.crystalUpgrades[u]) {
    player.crystalUpgrades[u] = 100 / 100 * (toBuy + c)
    /* Automation no longer spends Crystals. Late game players experience weird 'zeroing' of Crystals
       When they can afford Crystal Upgrades, due to precision issues. It is easier to just
       Not spend crystals before this becomes a significant issue. */
    if (toBuy > 0 && !auto) {
      player.prestigeShards = player.prestigeShards.sub(
        Decimal.pow(
          10,
          G.crystalUpgradesCost[u] - costReduction
            + G.crystalUpgradeCostIncrement[u] * (1 / 2 * Math.pow(toBuy - 1 / 2, 2) - 1 / 8)
        )
      )
      if (!auto) {
        crystalupgradedescriptions(i)
      }
      // This can sometimes just happen... yeah pretty bad!
      player.prestigeShards = player.prestigeShards.max(0)
    }
  }
}

export const boostAccelerator = (amount: BuyAmount | 'max' = player.coinbuyamount) => {
  if (player.upgrades[88] < 1) {
    while (player.prestigePoints.gte(getBuildingCost('acceleratorBoost')) && G.ticker < 1) {
      if (player.prestigePoints.gte(getBuildingCost('acceleratorBoost'))) {
        grantCurveBuildings('acceleratorBoost', 0, player.acceleratorBoostBought + 1)
        player.transcendnoaccelerator = false
        player.reincarnatenoaccelerator = false
        if (player.upgrades[88] < 0.5) {
          for (let j = 21; j < 41; j++) {
            player.upgrades[j] = 0
          }
          reset('prestige')
          player.prestigePoints = new Decimal()
        }
      }
    }
  } else {
    buyBuilding('acceleratorBoost', amount)
  }

  G.ticker = 0
  awardAchievementGroup('acceleratorBoosts')
}

const tesseractBuildingCosts = [1, 10, 100, 1000, 10000] as const

// The nth tesseract building of tier i costs
//   tesseractBuildingCosts[i-1] * n^3.
// so the first n tesseract buildings of tier i costs
//   cost(n) = tesseractBuildingCosts[i-1] * (n * (n+1) / 2)^2
// in total. Use cost(owned+buyAmount) - cost(owned) to figure the cost of
// buying multiple buildings.

export type TesseractBuildings = [number | null, number | null, number | null, number | null, number | null]

const buyTessBuildingsToCheapestPrice = (
  ownedBuildings: TesseractBuildings,
  cheapestPrice: number
): [number, TesseractBuildings] => {
  const buyToBuildings = []
  let price = 0

  for (let i = 0; i < ownedBuildings.length; i++) {
    const currentlyOwned = ownedBuildings[i]
    if (currentlyOwned === null) {
      buyToBuildings.push(null)
      continue
    }
    // thisPrice >= cheapestPrice = tesseractBuildingCosts[i] * (buyTo+1)^3
    // buyTo = cuberoot(cheapestPrice / tesseractBuildingCosts[i]) - 1
    // If buyTo has a fractional part, we want to round UP so that this
    // price costs more than the cheapest price.
    // If buyTo doesn't have a fractional part, thisPrice = cheapestPrice.
    // It could be possible that cheapestPrice is less than the CURRENT
    // price of this building, so take the max of the number of buildings
    // we currently have.
    const buyTo = Math.max(
      currentlyOwned,
      Math.ceil(Math.pow(cheapestPrice / tesseractBuildingCosts[i], 1 / 3) - 1)
    )
    buyToBuildings.push(buyTo)
    price += tesseractBuildingCosts[i] * (Math.pow(linSum(buyTo), 2) - Math.pow(linSum(currentlyOwned), 2))
  }

  return [price, buyToBuildings as TesseractBuildings]
}

/**
 * Calculate the result of repeatedly buying the cheapest tesseract building,
 * given an initial list of owned buildings and a budget.
 *
 * This function is pure and does not rely on any global state other than
 * constants for ease of testing.
 *
 * For tests:
 * calculateInBudget([0, 0, 0, 0, 0], 100) = [3, 1, 0, 0, 0]
 * calculateInBudget([null, 0, 0, 0, 0], 100) = [null, 2, 0, 0, 0]
 * calculateInBudget([3, 1, 0, 0, 0], 64+80-1) = [4, 1, 0, 0, 0]
 * calculateInBudget([3, 1, 0, 0, 0], 64+80) = [4, 2, 0, 0, 0]
 * calculateInBudget([9, 100, 100, 0, 100], 1000) = [9, 100, 100, 1, 100]
 * calculateInBudget([9, 100, 100, 0, 100], 2000) = [10, 100, 100, 1, 100]
 *
 * and calculateInBudget([0, 0, 0, 0, 0], 1e46) should run in less than a
 * second.
 *
 * @param ownedBuildings The amount of buildings owned, or null if the building
 * should not be bought.
 * @param budget The number of tesseracts to spend.
 * @returns The amount of buildings owned after repeatedly buying the cheapest
 * building with the budget.
 */
export const calculateTessBuildingsInBudget = (
  ownedBuildings: TesseractBuildings,
  budget: number
): TesseractBuildings => {
  // Nothing is affordable.
  // Also catches the case when budget <= 0, and all values are null.
  let minCurrentPrice: number | null = null
  for (let i = 0; i < ownedBuildings.length; i++) {
    const owned = ownedBuildings[i]
    if (owned === null) {
      continue
    }
    const price = tesseractBuildingCosts[i] * Math.pow(owned + 1, 3)
    if (minCurrentPrice === null || price < minCurrentPrice) {
      minCurrentPrice = price
    }
  }

  if (minCurrentPrice === null || minCurrentPrice > budget) {
    return ownedBuildings
  }

  // Every time the cheapest building is bought, the cheapest price either
  // stays constant (if there are two or more cheapest buildings), or
  // increases.
  //
  // Additionally, given the price of a building, calculating
  // - the amount of buildings needed to hit that price and
  // - the cumulative cost to buy to that amount of buildings
  // can be done with a constant number of floating point operations.
  //
  // Therefore, by binary searching over "cheapest price when finished", we
  // are able to efficiently (O(log budget)) determine the number of buildings
  // owned after repeatedly buying the cheapest building. Calculating the
  // cheapest building and buying one at a time would take O(budget^(1/4))
  // time - and as the budget could get very large (this is Synergism after
  // all), this is probably too slow.
  //
  // That is, we have a function f(cheapestPrice) which returns the cost of
  // buying buildings until all prices to buy are cheapestPrice or higher, and
  // we want to find the maximum value of cheapestPrice such that
  // f(cheapestPrice) <= budget.
  // In this case, f(x) = buyTessBuildingsToCheapestPrice(ownedBuildings, x)[0].

  // f(minCurrentPrice) = 0 < budget. We also know that we can definitely buy
  // at least one thing.
  let lo = minCurrentPrice
  // Do an exponential search to find the upper bound.
  let hi = lo * 2
  while (buyTessBuildingsToCheapestPrice(ownedBuildings, hi)[0] <= budget) {
    lo = hi
    hi *= 2
  }
  // Invariant:
  // f(lo) <= budget < f(hi).
  while (hi - lo > 0.5) {
    const mid = lo + (hi - lo) / 2
    // It's possible to get into an infinite loop if mid here is equal to
    // the boundaries, even if hi !== lo (due to floating point inaccuracy).
    if (mid === lo || mid === hi) {
      break
    }
    if (buyTessBuildingsToCheapestPrice(ownedBuildings, mid)[0] <= budget) {
      lo = mid
    } else {
      hi = mid
    }
  }

  // Binary search is done (with lo being the best candidate).
  const [cost, buildings] = buyTessBuildingsToCheapestPrice(ownedBuildings, lo)

  // Note that this has a slight edge case when 2 <= N <= 5 buildings are the
  // same price, and it is optimal to buy only M < N of them at that price.
  // The result of this edge case is that we can finish the binary search with
  // a set of buildings which are affordable, but more buildings can still be
  // bought. To fix this, we greedily buy the cheapest building one at a time,
  // which should take 4 or less iterations to run out of budget.
  let remainingBudget = budget - cost
  const currentPrices = buildings.map((num, index) => {
    if (num === null) {
      return null
    }
    return tesseractBuildingCosts[index] * Math.pow(num + 1, 3)
  })

  for (let iteration = 1; iteration <= 5; iteration++) {
    let minimum: { price: number; index: number } | null = null
    for (let index = 0; index < currentPrices.length; index++) {
      const price = currentPrices[index]
      if (price === null) {
        continue
      }
      // <= is used instead of < to prioritise the higher tier buildings
      // over the lower tier ones if they have the same price.
      if (minimum === null || price <= minimum.price) {
        minimum = { price, index }
      }
    }
    if (minimum !== null && minimum.price <= remainingBudget) {
      remainingBudget -= minimum.price
      // buildings[minimum.index] should always be a number.
      // In extreme situations (when buildings[minimum.index] is bigger
      // than Number.MAX_SAFE_INTEGER), this below increment won't work.
      // However, that requires 1e47 tesseracts to get to, which shouldn't
      // ever happen.
      buildings[minimum.index]!++
      currentPrices[minimum.index] = tesseractBuildingCosts[minimum.index] * Math.pow(buildings[minimum.index]! + 1, 3)
    } else {
      // Can't afford cheapest any more - break.
      break
    }
  }

  return buildings
}

/**
 * @param index Which tesseract building to get the cost of.
 * @param amount The amount to buy. Defaults to tesseract buy amount.
 * @param checkCanAfford Whether to limit the purchase amount to the number of buildings the player can afford.
 * @returns A pair of [number of buildings after purchase, cost of purchase].
 */
const getTesseractCost = (
  index: OneToFive,
  amount?: number,
  checkCanAfford = true,
  buyFrom?: number
): [number, number] => {
  amount ??= player.tesseractbuyamount
  buyFrom ??= player[`ascendBuilding${index}` as const].owned
  const intCost = tesseractBuildingCosts[index - 1]
  const subCost = intCost * Math.pow(linSum(buyFrom), 2)

  let actualBuy: number
  if (checkCanAfford) {
    const buyTo = Math.floor(
      -1 / 2 + 1 / 2 * Math.pow(1 + 8 * Math.pow((Number(player.wowTesseracts) + subCost) / intCost, 1 / 2), 1 / 2)
    )
    actualBuy = Math.min(buyTo, buyFrom + amount)
  } else {
    actualBuy = buyFrom + amount
  }
  const actualCost = intCost * Math.pow(linSum(actualBuy), 2) - subCost
  return [actualBuy, actualCost]
}

export const buyTesseractBuilding = (index: OneToFive, amount: number = player.tesseractbuyamount) => {
  const intCost = tesseractBuildingCosts[index - 1]
  const ascendBuildingIndex = `ascendBuilding${index}` as const
  // Destructuring FTW!
  const [buyTo, actualCost] = getTesseractCost(index, amount)

  player[ascendBuildingIndex].owned = buyTo
  player.wowTesseracts.sub(actualCost)
  player[ascendBuildingIndex].cost = intCost * Math.pow(1 + buyTo, 3)
}

export type SingularityUpgradePurchaseQuote = { levels: number; cost: number }

export type SingularityUpgradePurchaseOptions = {
  getMaxLevels: () => number
  getBalance: () => number
  /** Total cost of buying this many additional levels from the current level. */
  getCost: (levels: number) => number
}

export type SingularityUpgradePurchaseInput = 'levels' | 'cost'

/** Quote a Singularity-tier upgrade purchase without changing player state. All limits are read afresh. */
export const calculateSingularityUpgradePurchase = (
  options: SingularityUpgradePurchaseOptions,
  amount: number,
  input: SingularityUpgradePurchaseInput
): SingularityUpgradePurchaseQuote | null => {
  if (
    !Number.isFinite(amount)
    || (amount < 0 && amount !== -1)
    || (input === 'levels' && !Number.isInteger(amount))
  ) {
    return null
  }

  const remaining = options.getMaxLevels()
  const balance = options.getBalance()
  if (Number.isNaN(remaining) || Number.isNaN(balance)) {
    return null
  }

  const maxLevels = Math.max(0, Math.floor(Math.min(remaining, Number.MAX_SAFE_INTEGER)))
  const budget = Math.max(0, input === 'cost' && amount !== -1 ? Math.min(amount, balance) : balance)
  let low = 0
  let high = input === 'levels' && amount !== -1 ? Math.min(amount, maxLevels) : maxLevels

  while (low < high) {
    const middle = low + Math.ceil((high - low) / 2)
    const cost = options.getCost(middle)
    if (Number.isFinite(cost) && cost >= 0 && cost <= budget) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return { levels: low, cost: low === 0 ? 0 : options.getCost(low) }
}
