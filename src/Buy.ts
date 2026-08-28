import Decimal from 'break_infinity.js'
import { awardAchievementGroup } from './Achievements'
import { CalcECC } from './Challenges'
import { getAntUpgradeEffect } from './Features/Ants/AntUpgrades/lib/upgrade-effects'
import { AntUpgrades } from './Features/Ants/AntUpgrades/structs/structs'
import { reset } from './Reset'
import { getRuneBlessingEffect } from './RuneBlessings'
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
    growth: [1, 3, 6, 10, 15]
  }
} as const

const accelMultData = {
  accelerator: {
    cost: 500,
    growth: 4,
    threshold: 125,
    c4effect: 5
  },
  multiplier: {
    cost: 10000,
    growth: 10,
    threshold: 75,
    c4effect: 2
  }
}

const softcap = 1e15
const exponentDR = 1 / 8

export const getReductionValue = () => {
  let reduction = 1
  reduction += getRuneEffects('thrift', 'costDelay')
  reduction += player.researches.slice(56, 61).reduce((sum, level) => sum + level) / 200
  reduction += CalcECC('transcend', player.challengecompletions[4]) / 200
  reduction += getAntUpgradeEffect(AntUpgrades.BuildingCostScale).buildingCostScale
  return reduction
}

const linSum = (n: number) => n * (n + 1) / 2
const sqrSum = (n: number) => n * (n + 1) * (2 * n + 1) / 6
const fact100 = Decimal.fromNumber(100).factorial()

const decimalBases = {
  building: Decimal.fromNumber(1.25),
  lateBuilding: Decimal.fromNumber(1.03),
  oneHundred: Decimal.fromNumber(100),
  two: Decimal.fromNumber(2)
} as const

type BuildingType = keyof typeof producerData | keyof typeof accelMultData | 'acceleratorBoost'
type CostCalculator = (n: number) => Decimal

interface BuildingCostScaling {
  reduction: number
  threshold1000: number
  threshold5000: number
  threshold20000: number
  threshold25000: number
  threshold250000: number
  inverseFactorial1000(): Decimal
  inverseFactorial5000(): Decimal
  inverseFactorial20000Cubed(): Decimal
}

let buildingCostScalingCache: BuildingCostScaling | undefined

const getBuildingCostScaling = (reduction: number): BuildingCostScaling => {
  if (buildingCostScalingCache?.reduction === reduction) {
    return buildingCostScalingCache
  }

  const threshold1000 = Math.ceil(reduction * 1000)
  const threshold5000 = Math.ceil(reduction * 5000)
  const threshold20000 = Math.ceil(reduction * 20000)
  let inverseFactorial1000: Decimal | undefined
  let inverseFactorial5000: Decimal | undefined
  let inverseFactorial20000Cubed: Decimal | undefined

  buildingCostScalingCache = {
    reduction,
    threshold1000,
    threshold5000,
    threshold20000,
    threshold25000: Math.ceil(reduction * 25000),
    threshold250000: Math.ceil(reduction * 250000),
    inverseFactorial1000 () {
      return inverseFactorial1000 ??= Decimal.fromNumber(threshold1000 - 1).factorial().recip()
    },
    inverseFactorial5000 () {
      return inverseFactorial5000 ??= Decimal.fromNumber(threshold5000 - 1).factorial().recip()
    },
    inverseFactorial20000Cubed () {
      return inverseFactorial20000Cubed ??= Decimal.fromNumber(threshold20000 - 1).factorial().pow(3).recip()
    }
  }

  return buildingCostScalingCache
}

const createBuildingCostCalculator = (
  type: 'coin' | 'diamond' | 'mythos',
  index: ZeroToFour,
  r: number
): CostCalculator => {
  const originalCost = producerData[type].costs[index]
  const growth = producerData[type].growth[index]
  const add1s = 1 / (Math.pow(1.25, growth) - 1)
  const baseCost = Decimal.add(originalCost, add1s)
  const firstGrowth = Decimal.fromNumber((1 + growth / 2) / 1000)
  const secondGrowth = Decimal.fromNumber(100 + 100 * growth)
  const thirdGrowth = Decimal.fromNumber(1e7 + 1e7 * growth)
  const scaling = getBuildingCostScaling(r)
  const challenge4Completions = player.challengecompletions[4]
  const challenge4Active = player.currentChallenge.transcension === 4 && type !== 'mythos'
  const challenge4Threshold = Math.max(1, 1000 - 10 * challenge4Completions)
  const challenge4Exponent = 1.25 + challenge4Completions / 4
  const challenge8Completions = player.challengecompletions[8]
  const challenge8Active = player.currentChallenge.reincarnation === 8
  const challenge8Threshold = Math.ceil(r * 1000 * challenge8Completions)
  const challenge10Active = player.currentChallenge.reincarnation === 10 && type !== 'mythos'
  let softcapCost: Decimal | undefined

  const calculateCost: CostCalculator = (n) => {
    const owned = n - 1

    // Accounts for the multiplies by 1.25^growth owned times
    let steps = growth * owned
    let cost = baseCost
    let fastFactMultBuyTo = 0

    if (owned >= scaling.threshold1000) {
      fastFactMultBuyTo += 1
      cost = cost.times(scaling.inverseFactorial1000())
      cost = cost.times(firstGrowth.pow(n - scaling.threshold1000))
    }

    if (owned >= scaling.threshold5000) {
      fastFactMultBuyTo += 1
      cost = cost.times(scaling.inverseFactorial5000())
      cost = cost.times(secondGrowth.pow(n - scaling.threshold5000))
    }

    if (owned >= scaling.threshold20000) {
      fastFactMultBuyTo += 3
      cost = cost.times(scaling.inverseFactorial20000Cubed())
      cost = cost.times(thirdGrowth.pow(n - scaling.threshold20000))
    }

    if (owned >= scaling.threshold250000) {
      // The exponents from each 1.03 multiplier form the sum from zero to owned - threshold.
      cost = cost.times(
        decimalBases.lateBuilding.pow(
          (owned - scaling.threshold250000) * (n - scaling.threshold250000) / 2
        )
      )
    }

    if (fastFactMultBuyTo > 0) {
      // Applies the factorials from earlier without computing them five times.
      cost = cost.times(Decimal.fromNumber(owned).factorial().pow(fastFactMultBuyTo))
    }

    if (challenge4Active) {
      const extra = Decimal.fromNumber(owned + 100).factorial()
        .dividedBy(fact100)
        .times(decimalBases.oneHundred.pow(owned))
      cost = cost.times(extra.pow(challenge4Exponent))
      if (owned >= challenge4Threshold) {
        steps += (owned * n - challenge4Threshold * (challenge4Threshold - 1)) / 2
      }
    }

    if (challenge10Active && owned >= scaling.threshold25000) {
      steps += (owned * n - scaling.threshold25000 * (scaling.threshold25000 - 1)) / 2
    }

    // Applies all the 1.25s from earlier n times to avoid multiple computations.
    cost = cost.times(decimalBases.building.pow(steps))

    if (challenge8Active && owned > challenge8Threshold) {
      cost = cost.times(
        decimalBases.two.pow(
          (owned - challenge8Threshold) * (n - challenge8Threshold) / (2 + challenge8Completions)
        )
      )
    }

    cost = cost.subtract(add1s)
    // c4, c8x0, c10 add1s are annoying to deal with, and it'd be possible to fix that,
    // but that's a lot of work for a minuscule difference.

    if (owned > softcap) {
      softcapCost ??= calculateCost(softcap)
      const newCost = softcapCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
      return Decimal.max(cost, newCost)
    }
    return cost
  }

  return calculateCost
}

const createAccelMultCostCalculator = (type: keyof typeof accelMultData): CostCalculator => {
  const c4reward = accelMultData[type].c4effect * CalcECC('transcend', player.challengecompletions[4])
  const factorialThreshold = accelMultData[type].threshold + c4reward
  const secondaryThreshold = 2000 + c4reward
  const baseCost = Decimal.fromNumber(accelMultData[type].cost)
  const growthBase = Decimal.fromNumber(accelMultData[type].growth)
  let challengeGrowth = 1
  if (player.currentChallenge.transcension === 4) {
    challengeGrowth *= 10
  }
  if (player.currentChallenge.reincarnation === 8) {
    challengeGrowth *= 1e50
  }
  const challengeGrowthBase = challengeGrowth > 1 ? Decimal.fromNumber(challengeGrowth) : undefined
  let softcapCost: Decimal | undefined

  const calculateCost: CostCalculator = (n) => {
    const owned = n - 1
    let steps = owned
    let cost = baseCost

    if (owned > factorialThreshold) {
      const num = owned - factorialThreshold
      steps += num
      cost = cost.times(Decimal.fromNumber(num).factorial())
    }
    cost = cost.times(growthBase.pow(steps))

    if (owned > secondaryThreshold) {
      const num = owned - secondaryThreshold
      cost = cost.times(decimalBases.two.pow(linSum(num)))
    }

    if (challengeGrowthBase !== undefined) {
      cost = cost.times(challengeGrowthBase.pow(linSum(owned)))
    }

    if (owned > softcap) {
      softcapCost ??= calculateCost(softcap)
      const newCost = softcapCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
      return Decimal.max(cost, newCost)
    }

    return cost
  }

  return calculateCost
}

const createAcceleratorBoostCostCalculator = (): CostCalculator => {
  const base = new Decimal(1000)
  const r = getRuneBlessingEffect('thrift').accelBoostCostDelay
  const threshold = 1000 * r
  let softcapCost: Decimal | undefined

  const calculateCost: CostCalculator = (n) => {
    const owned = n - 1
    let exponent = 10 * owned + linSum(owned) // each level increases the exponent by 1 more each time
    if (owned > threshold) {
      // after cost delay is passed each level increases the cost by the square each time
      exponent += sqrSum(owned - threshold) / r
    }
    const cost = base.times(Decimal.pow(10, exponent))

    if (owned > softcap) {
      softcapCost ??= calculateCost(softcap)
      const newCost = softcapCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
      return Decimal.max(cost, newCost)
    }
    return cost
  }

  return calculateCost
}

const createParticleCostCalculator = (index: ZeroToFour): CostCalculator => {
  const originalCost = producerData.particle.costs[index]
  const baseCost = Decimal.fromValue(originalCost)
  const DR = (player.currentChallenge.ascension !== 15) ? 325000 : 1000
  const lateGrowth = Decimal.fromNumber(1.001)
  let softcapCost: Decimal | undefined

  const calculateCost: CostCalculator = (n) => {
    const owned = n - 1
    let cost = baseCost.times(decimalBases.two.pow(owned))

    if (owned > DR) {
      cost = cost.times(lateGrowth.pow(linSum(owned - DR)))
    }

    if (owned > softcap) {
      softcapCost ??= calculateCost(softcap)
      const newCost = softcapCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
      return Decimal.max(cost, newCost)
    }
    return cost
  }

  return calculateCost
}

const createCostCalculator = (
  type: BuildingType,
  index: ZeroToFour = 0,
  r?: number
): CostCalculator => {
  switch (type) {
    case 'accelerator':
    case 'multiplier':
      return createAccelMultCostCalculator(type)
    case 'acceleratorBoost':
      return createAcceleratorBoostCostCalculator()
    case 'particle':
      return createParticleCostCalculator(index)
  }
  return createBuildingCostCalculator(type, index, r ?? getReductionValue())
}

export const getCost = (type: BuildingType, n: number, index: ZeroToFour = 0, r?: number): Decimal =>
  createCostCalculator(type, index, r)(n)

export const buyBuilding = (
  type: BuildingType,
  amount?: BuyAmount | 'max',
  index: ZeroToFour = 0
) => {
  const isAccelMult = type === 'accelerator' || type === 'multiplier'
  const isProducer = !isAccelMult && type !== 'acceleratorBoost'
  const pos = G.ordinals[index]

  const coinmax = 1e99
  const tag = isAccelMult ? 'coins' : isProducer ? producerData[type].currency : 'prestigePoints'
  const posOwnedType = isProducer ? `${pos}Owned${producerData[type].name}` as const : `${type}Bought` as const
  const posCostType = isProducer ? `${pos}Cost${producerData[type].name}` as const : `${type}Cost` as const
  const calculateCost = createCostCalculator(type, index)

  if (amount === undefined) {
    if (isProducer) {
      amount = player[`${producerData[type].production}buyamount` as const]
    } else {
      amount = player.coinbuyamount // Accelerator Boosts use Coin amounts too
    }
  }

  const buyStart = player[posOwnedType]
  // If at least softcap, we will use a different formulae
  if (buyStart >= softcap) {
    const log10Resource = Decimal.log10(player[tag])
    const log10QuadrillionCost = Decimal.log10(calculateCost(softcap))

    let hi = Math.floor(softcap * Math.max(1, Math.pow(log10Resource / log10QuadrillionCost, exponentDR)))
    let lo = softcap
    while (hi - lo > 0.5) {
      const mid = Math.floor(lo + (hi - lo) / 2)
      if (mid === lo || mid === hi) {
        break
      }
      if (!player[tag].gte(calculateCost(mid))) {
        hi = mid
      } else {
        lo = mid
      }
    }
    const buyable = lo
    const thisCost = calculateCost(buyable)

    player[posOwnedType] = buyable
    player[posCostType] = thisCost

    if (isAccelMult) {
      awardAchievementGroup(`${type}s` as const)
    }

    return
  }

  // Start buying at the current amount bought + 1
  let buyInc = smallestInc(buyStart)
  const buyDefault = buyStart + buyInc

  let cashToBuy = calculateCost(buyDefault)

  // Degenerate Case: return maximum if coins is too large
  if (cashToBuy.exponent >= coinmax || !player[tag].gte(cashToBuy)) {
    return
  }

  while (cashToBuy.exponent < coinmax && player[tag].gte(cashToBuy)) {
    // then multiply by 4 until it reaches just above the amount needed
    buyInc = buyInc * 4
    cashToBuy = calculateCost(buyStart + buyInc)
  }
  let stepdown = Math.floor(buyInc / 8)
  while (stepdown >= smallestInc(buyInc)) {
    // if step down would push it below out of expense range then divide step down by 2
    if (calculateCost(buyStart + buyInc - stepdown).lte(player[tag])) {
      stepdown = Math.floor(stepdown / 2)
    } else {
      buyInc = buyInc - Math.max(smallestInc(buyInc), stepdown)
    }
  }

  if (amount !== 'max') {
    buyInc = Math.min(buyInc, amount)
  }

  // Resolves the infamous autobuyer bug, for large values. This prevents the notion of even being able
  // to go above the softcap. Future instances will also not check more than the first few lines
  // meaning that the code below this cannot run if this ever runs.
  if (buyStart + buyInc >= softcap) {
    player[posOwnedType] = softcap
    player[posCostType] = calculateCost(softcap)
    return
  }

  // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
  let buyFrom = Math.max(buyStart + buyInc - 6 - smallestInc(buyInc), buyDefault)
  let thisCost = calculateCost(buyFrom)
  while (buyFrom <= buyStart + buyInc && player[tag].gte(thisCost)) {
    player[tag] = player[tag].sub(thisCost)
    player[posOwnedType] = buyFrom
    buyFrom = buyFrom + smallestInc(buyFrom)
    thisCost = calculateCost(buyFrom)
    player[posCostType] = thisCost
  }

  if (isAccelMult) {
    if (player[posOwnedType] > 0) {
      player[`prestigeno${type}` as const] = false
      player[`transcendno${type}` as const] = false
      player[`reincarnateno${type}` as const] = false
    }
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
  if (player.upgrades[46] < 1) {
    const calculateCost = createAcceleratorBoostCostCalculator()
    while (player.prestigePoints.gte(player.acceleratorBoostCost) && G.ticker < 1) {
      if (player.prestigePoints.gte(player.acceleratorBoostCost)) {
        player.acceleratorBoostBought += 1
        player.acceleratorBoostCost = calculateCost(player.acceleratorBoostBought)
        player.transcendnoaccelerator = false
        player.reincarnatenoaccelerator = false
        if (player.upgrades[46] < 0.5) {
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
