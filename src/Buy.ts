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

const getCostBuilding = (
  type: 'coin' | 'diamond' | 'mythos',
  n: number,
  index: ZeroToFour,
  r: number
): Decimal => {

  const owned = n - 1

  const originalCost = producerData[type].costs[index]
  const growth = producerData[type].growth[index]

  // Accounts for the add 1s
  // The formula was (originalCost + n) * 1.25 ^ (n * growth), but that was incorrect
  // The correct formula is (originalCost + add1s) * 1.25^n - add1s
  const add1s = 1 / (Math.pow(1.25, growth) - 1)
  let cost = Decimal.add(originalCost, add1s)

  // Accounts for the multiplies by 1.25^growth owned times
  let steps = growth * owned

  let fastFactMultBuyTo = 0
  let fr = Math.ceil(r * 1000)
  if (owned >= fr) {
    // This code is such a mess at this point, just know that this is equivalent to what it was before
    ;++fastFactMultBuyTo
    //const fr = Math.floor(r * 1000) // floored r value gets used a lot in removing calculations
    cost = cost.dividedBy(Decimal.fromNumber(fr - 1).factorial())
    cost = cost.times(Decimal.pow((1 + growth / 2) / 1000, n - fr))
  }

  fr = Math.ceil(r * 5000)
  if (owned >= fr) {
    // This code is such a mess at this point, just know that this is equivalent to what it was before
    ;++fastFactMultBuyTo
    cost = cost.dividedBy(Decimal.fromNumber(fr - 1).factorial())
    cost = cost.times(Decimal.pow(100 + 100 * growth, n - fr))
  }

  fr = Math.ceil(r * 20000)
  if (owned >= fr) {
    // This code is such a mess at this point, just know that this is equivalent to what it was before
    fastFactMultBuyTo += 3
    cost = cost.dividedBy(Decimal.fromNumber(fr - 1).factorial().pow(3))
    cost = cost.times(Decimal.pow(1e7 + 1e7 * growth, n - fr))
  }

  fr = Math.ceil(r * 250000)
  if (owned >= fr) {
    // 1.03^x*1.03^y = 1.03^(x+y), we'll abuse this for this section of the algorithm
    // 1.03^(x+y-((number of terms)250000*r))
    // up to 250003 case
    // assume r = 1 for this case
    // (1.03^250000-250000)(1.03^250001-250000)(1.03^250002-250000)(1.03^250003) = (1.03^0*1.03^1*1.03^2*1.03^3)
    // so in reality we just need to take owned - fr and sum the power up to it
    // (1.03^(sum from 0 to owned - fr)) is the multiplier
    // so (1.03^( (owned-fr)(owned-fr+1)/2 )
    // god damn that was hard to make an algo for
    cost = cost.times(Decimal.pow(1.03, (owned - fr) * (n - fr) / 2))
  }

  // Applies the factorials from earlier without computing them 5 times
  cost = cost.times(Decimal.fromNumber(owned).factorial().pow(fastFactMultBuyTo))

  if ((player.currentChallenge.transcension === 4) && (type === 'coin' || type === 'diamond')) {
    // you would not fucking believe how long it took me to figure this out
    // (100*costofcurrent + 10000)^n = (((100+owned)!/100!)*100^owned)^n
    const extra = Decimal.fromNumber(owned + 100).factorial().dividedBy(fact100).times(Decimal.pow(100, owned))
    cost = cost.times(extra.pow(1.25 + player.challengecompletions[4] / 4))
    const threshold = Math.max(1, 1000 - 10 * player.challengecompletions[4])
    if (owned >= threshold) {
      // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to owned
      //
      // Summation from 1 to owned is incorrect, it should be from threshold - 1 to owned
      steps += (owned * n - threshold * (threshold - 1)) / 2
    }
  }

  if ((player.currentChallenge.reincarnation === 10) && (type === 'coin' || type === 'diamond')) {
    // you would not fucking believe how long it took me to figure this out
    // (100*costofcurrent + 10000)^n = (((100+owned)!/100!)*100^owned)^n
    fr = Math.ceil(r * 25000)
    if (owned >= fr) {
      // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to owned
      //
      // Assuming the same principle as in challenge 4,
      // summation from 1 to owned is incorrect, it should be from fr - 1 to owned
      steps += (owned * n - fr * (fr - 1)) / 2
    }
  }

  // Applies all the 1.25s from earlier n times to avoid multiple computations
  cost = cost.times(Decimal.pow(1.25, steps))

  if (player.currentChallenge.reincarnation === 8) {
    fr = Math.ceil(r * 1000 * player.challengecompletions[8])
    if (owned > fr) {
      cost = cost.times(Decimal.pow(2, (owned - fr) * (n - fr) / (2 + player.challengecompletions[8])))
    }
  }

  cost = cost.subtract(add1s)
  // c4, c8x0, c10 add1s are annoying to deal with, and it'd be possible to fix that,
  // but that's a lot of work for a minuscule difference

  if (owned > softcap) {
    const QuadrillionCost = getCostBuilding(type, softcap, index, r)
    const newCost = QuadrillionCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
    // No need for normalization, Decimal.prototype.pow() already normalizes the number
    return Decimal.max(cost, newCost)
  }
  return cost

}

const getCostAccelMult = (type: keyof typeof accelMultData, n: number): Decimal => {

  const owned = n - 1
  let steps = owned
  let cost = Decimal.fromNumber(accelMultData[type].cost)

  const c4reward = accelMultData[type].c4effect * CalcECC('transcend', player.challengecompletions[4])
  let threshold = accelMultData[type].threshold + c4reward
  if (owned > threshold) {
    const num = owned - threshold
    steps += num
    cost = cost.times(Decimal.fromNumber(num).factorial())
  }
  cost = cost.times(Decimal.pow(accelMultData[type].growth, steps))

  threshold = 2000 + c4reward
  if (owned > threshold) {
    const num = owned - threshold
    const sumBit = num * (num + 1) / 2
    cost = cost.times(Decimal.pow(2, sumBit))
  }

  let growth = 1
  if (player.currentChallenge.transcension === 4) {
    growth *= 10
  }
  if (player.currentChallenge.reincarnation === 8) {
    growth *= 1e50
  }
  if (growth > 1) {
    const sumBit = owned * n / 2
    cost = cost.times(Decimal.pow(growth, sumBit))
  }

  if (owned > softcap) {
    const QuadrillionCost = getCostAccelMult(type, softcap)
    const newCost = QuadrillionCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
    // No need for normalization, Decimal.prototype.pow() already normalizes the number
    return Decimal.max(cost, newCost)
  }

  return cost

}

const getAcceleratorBoostCost = (n = 1): Decimal => {

  const owned = n - 1
  const base = new Decimal(1000)
  const r = getRuneBlessingEffect('thrift').accelBoostCostDelay

  let exponent = 10 * owned + linSum(owned) // each level increases the exponent by 1 more each time
  if (owned > 1000 * r) {
    // after cost delay is passed each level increases the cost by the square each time
    exponent += sqrSum(owned - 1000 * r) / r
  }
  const cost = base.times(Decimal.pow(10, exponent))

  if (owned > softcap) {
    const QuadrillionCost = getAcceleratorBoostCost(softcap)
    const newCost = QuadrillionCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
    // No need for normalization, Decimal.prototype.pow() already normalizes the number
    return Decimal.max(cost, newCost)
  }
  return cost

}

const getCostParticle = (n: number, index: ZeroToFour): Decimal => {

  const owned = n - 1
  const originalCost = producerData.particle.costs[index]
  let cost = Decimal.fromValue(originalCost).times(Decimal.pow(2, owned))

  const DR = (player.currentChallenge.ascension !== 15) ? 325000 : 1000
  if (owned > DR) {
    cost = cost.times(Decimal.pow(1.001, linSum(owned - DR)))
  }

  if (owned > softcap) {
    const QuadrillionCost = getCostParticle(softcap, index)
    const newCost = QuadrillionCost.pow(Math.pow(owned / softcap, 1 / exponentDR))
    // No need for normalization, Decimal.prototype.pow() already normalizes the number
    return Decimal.max(cost, newCost)
  }
  return cost

}

export const getCost = (
  type: keyof typeof producerData | keyof typeof accelMultData | 'acceleratorBoost',
  n: number,
  index: ZeroToFour = 0,
  r?: number
) => {
  switch(type) {
    case 'accelerator':
    case 'multiplier':
      return getCostAccelMult(type, n)
    case 'acceleratorBoost':
      return getAcceleratorBoostCost(n)
    case 'particle':
      return getCostParticle(n, index)
  }
  r ??= getReductionValue()
  return getCostBuilding(type, n, index, r)
}

export const buyBuilding = (
  type: keyof typeof producerData | keyof typeof accelMultData | 'acceleratorBoost',
  amount?: BuyAmount | 'max',
  index: ZeroToFour = 0
) => {

  const isAccelMult = type === 'accelerator' || type === 'multiplier'
  const isProducer = !isAccelMult && type !== 'acceleratorBoost'
  const pos = G.ordinals[index]

  const coinmax = 1e99
  const r = getReductionValue()
  const tag = isAccelMult ? 'coins' : isProducer ? producerData[type].currency : 'prestigePoints'
  const posOwnedType = isProducer ? `${pos}Owned${producerData[type].name}` as const : `${type}Bought` as const
  const posCostType = isProducer ? `${pos}Cost${producerData[type].name}` as const : `${type}Cost` as const

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
    const log10QuadrillionCost = Decimal.log10(getCost(type, softcap, index, r))

    let hi = Math.floor(softcap * Math.max(1, Math.pow(log10Resource / log10QuadrillionCost, exponentDR)))
    let lo = softcap
    while (hi - lo > 0.5) {
      const mid = Math.floor(lo + (hi - lo) / 2)
      if (mid === lo || mid === hi) {
        break
      }
      if (!player[tag].gte(getCost(type, mid, index, r))) {
        hi = mid
      } else {
        lo = mid
      }
    }
    const buyable = lo
    const thisCost = getCost(type, buyable, index, r)

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

  let cashToBuy = getCost(type, buyDefault, index, r)

  // Degenerate Case: return maximum if coins is too large
  if (cashToBuy.exponent >= coinmax || !player[tag].gte(cashToBuy)) {
    return
  }

  while (cashToBuy.exponent < coinmax && player[tag].gte(cashToBuy)) {
    // then multiply by 4 until it reaches just above the amount needed
    buyInc = buyInc * 4
    cashToBuy = getCost(type, buyStart + buyInc, index, r)
  }
  let stepdown = Math.floor(buyInc / 8)
  while (stepdown >= smallestInc(buyInc)) {
    // if step down would push it below out of expense range then divide step down by 2
    if (getCost(type, buyStart + buyInc - stepdown, index, r).lte(player[tag])) {
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
    player[posCostType] = getCost(type, softcap, index, r)
    return
  }

  // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
  let buyFrom = Math.max(buyStart + buyInc - 6 - smallestInc(buyInc), buyDefault)
  let thisCost = getCost(type, buyFrom, index, r)
  while (buyFrom <= buyStart + buyInc && player[tag].gte(thisCost)) {
    player[tag] = player[tag].sub(thisCost)
    player[posOwnedType] = buyFrom
    buyFrom = buyFrom + smallestInc(buyFrom)
    thisCost = getCost(type, buyFrom, index, r)
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
  if (!upgradeRequirements[pos]) {
    return
  }

  const currency = type
  if (player[currency].gte(Decimal.pow(10, G.upgradeCosts[pos])) && player.upgrades[pos] === 0) {
    player[currency] = player[currency].sub(Decimal.pow(10, G.upgradeCosts[pos]))
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
    while (player.prestigePoints.gte(player.acceleratorBoostCost) && G.ticker < 1) {
      if (player.prestigePoints.gte(player.acceleratorBoostCost)) {
        player.acceleratorBoostBought += 1
        player.acceleratorBoostCost = getAcceleratorBoostCost(player.acceleratorBoostBought)
        player.transcendnoaccelerator = false
        player.reincarnatenoaccelerator = false
        if (player.upgrades[46] < 0.5) {
          for (let j = 21; j < 41; j++) {
            player.upgrades[j] = 0
          }
          reset('prestige')
          player.prestigePoints = new Decimal(0)
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
  const buyToBuildings = ownedBuildings.map((currentlyOwned, index) => {
    if (currentlyOwned === null) {
      return null
    }
    // thisPrice >= cheapestPrice = tesseractBuildingCosts[index] * (buyTo+1)^3
    // buyTo = cuberoot(cheapestPrice / tesseractBuildingCosts[index]) - 1
    // If buyTo has a fractional part, we want to round UP so that this
    // price costs more than the cheapest price.
    // If buyTo doesn't have a fractional part, thisPrice = cheapestPrice.
    const buyTo = Math.ceil(Math.pow(cheapestPrice / tesseractBuildingCosts[index], 1 / 3) - 1)
    // It could be possible that cheapestPrice is less than the CURRENT
    // price of this building, so take the max of the number of buildings
    // we currently have.
    return Math.max(currentlyOwned, buyTo)
  }) as TesseractBuildings

  let price = 0
  for (let i = 0; i < ownedBuildings.length; i++) {
    const buyFrom = ownedBuildings[i]
    const buyTo = buyToBuildings[i]
    if (buyFrom === null || buyTo === null) {
      continue
    }
    price += tesseractBuildingCosts[i] * (Math.pow(linSum(buyTo), 2) - Math.pow(linSum(buyFrom), 2))
  }

  return [price, buyToBuildings]
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
