import type { DecimalSource } from 'break_infinity.js'
import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { achievementaward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateCorruptionPoints, calculateRuneBonuses, calculateSummationLinear } from './Calculate'
import { CalcECC } from './Challenges'
import { reset } from './Reset'
import { format, player, updateAllMultiplier, updateAllTick } from './Synergism'
import type { FirstToFifth, OneToFive, ZeroToFour } from './types/Synergism'
import { crystalupgradedescriptions, upgradeupdate } from './Upgrades'
import { smallestInc } from './Utility'
import { Globals as G, Upgrade } from './Variables'

export const getReductionValue = () => {
  let reduction = 1
  reduction += Math.min(1e15, (G.rune4level * G.effectiveLevelMult) / 160)
  reduction += (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59]
    + player.researches[60]) / 200
  reduction += CalcECC('transcend', player.challengecompletions[4]) / 200
  reduction += Math.min(99999.9, (3 * (player.antUpgrades[7 - 1]! + G.bonusant7)) / 100)
  return reduction
}

const getCostAccelerator = (buyingTo: number): Decimal => {
  ;--buyingTo

  const originalCost = 500
  let cost = new Decimal(originalCost)

  cost = cost.times(Decimal.pow(4 / G.costDivisor, buyingTo))

  if (buyingTo > (125 + 5 * CalcECC('transcend', player.challengecompletions[4]))) {
    const num = buyingTo - 125 - 5 * CalcECC('transcend', player.challengecompletions[4])
    const factorialBit = new Decimal(num).factorial()
    const multBit = Decimal.pow(4, num)
    cost = cost.times(multBit.times(factorialBit))
  }

  if (buyingTo > (2000 + 5 * CalcECC('transcend', player.challengecompletions[4]))) {
    const sumNum = buyingTo - 2000 - 5 * CalcECC('transcend', player.challengecompletions[4])
    const sumBit = sumNum * (sumNum + 1) / 2
    cost = cost.times(Decimal.pow(2, sumBit))
  }

  if (player.currentChallenge.transcension === 4) {
    const sumBit = buyingTo * (buyingTo + 1) / 2
    cost = cost.times(Decimal.pow(10, sumBit))
  }

  if (player.currentChallenge.reincarnation === 8) {
    const sumBit = buyingTo * (buyingTo + 1) / 2
    cost = cost.times(Decimal.pow(1e50, sumBit))
  }
  const buymax = Math.pow(10, 15)
  if (buyingTo > buymax) {
    const diminishingExponent = 1 / 8

    const QuadrillionCost = getCostAccelerator(buymax)

    const newCost = QuadrillionCost.pow(Math.pow(buyingTo / buymax, 1 / diminishingExponent))
    const newExtra = newCost.exponent - Math.floor(newCost.exponent)
    newCost.exponent = Math.floor(newCost.exponent)
    newCost.mantissa *= Math.pow(10, newExtra)
    newCost.normalize()
    return Decimal.max(cost, newCost)
  }
  return cost
}

export const buyAccelerator = (autobuyer?: boolean) => {
  const buyStart = player.acceleratorBought
  const buymax = Math.pow(10, 15)
  // If at least buymax, we will use a different formulae
  if (buyStart >= buymax) {
    const diminishingExponent = 1 / 8

    const log10Resource = Decimal.log10(player.coins)
    const log10QuadrillionCost = Decimal.log10(getCostAccelerator(buymax))

    let hi = Math.floor(buymax * Math.max(1, Math.pow(log10Resource / log10QuadrillionCost, diminishingExponent)))
    let lo = buymax
    while (hi - lo > 0.5) {
      const mid = Math.floor(lo + (hi - lo) / 2)
      if (mid === lo || mid === hi) {
        break
      }
      if (!player.coins.gte(getCostAccelerator(mid))) {
        hi = mid
      } else {
        lo = mid
      }
    }
    const buyable = lo
    const thisCost = getCostAccelerator(buyable)

    player.acceleratorBought = buyable
    player.acceleratorCost = thisCost
    return
  }

  // Start buying at the current amount bought + 1
  const buydefault = buyStart + smallestInc(buyStart)
  let buyTo = buydefault

  let cashToBuy = getCostAccelerator(buyTo)
  while (player.coins.gte(cashToBuy)) {
    // then multiply by 4 until it reaches just above the amount needed
    buyTo = buyTo * 4
    cashToBuy = getCostAccelerator(buyTo)
  }
  let stepdown = Math.floor(buyTo / 8)
  while (stepdown >= smallestInc(buyTo)) {
    // if step down would push it below out of expense range then divide step down by 2
    if (getCostAccelerator(buyTo - stepdown).lte(player.coins)) {
      stepdown = Math.floor(stepdown / 2)
    } else {
      buyTo = buyTo - Math.max(smallestInc(buyTo), stepdown)
    }
  }

  if (!autobuyer && (player.coinbuyamount as number | string) !== 'max') {
    if (player.acceleratorBought + player.coinbuyamount < buyTo) {
      buyTo = player.acceleratorBought + player.coinbuyamount
    }
  }

  let buyFrom = Math.max(buyTo - 6 - smallestInc(buyTo), buydefault)
  let thisCost = getCostAccelerator(buyFrom)
  while (buyFrom <= buyTo && player.coins.gte(thisCost)) {
    if (buyFrom >= buymax) {
      buyFrom = buymax
    }
    player.coins = player.coins.sub(thisCost)
    player.acceleratorBought = buyFrom
    buyFrom = buyFrom + smallestInc(buyFrom)
    thisCost = getCostAccelerator(buyFrom)
    player.acceleratorCost = thisCost
    if (buyFrom >= buymax) {
      return
    }
  }

  player.prestigenoaccelerator = false
  player.transcendnoaccelerator = false
  player.reincarnatenoaccelerator = false
  updateAllTick()
  if (player.acceleratorBought >= 5 && player.achievements[148] === 0) {
    achievementaward(148)
  }
  if (player.acceleratorBought >= 25 && player.achievements[149] === 0) {
    achievementaward(149)
  }
  if (player.acceleratorBought >= 100 && player.achievements[150] === 0) {
    achievementaward(150)
  }
  if (player.acceleratorBought >= 666 && player.achievements[151] === 0) {
    achievementaward(151)
  }
  if (player.acceleratorBought >= 2000 && player.achievements[152] === 0) {
    achievementaward(152)
  }
  if (player.acceleratorBought >= 12500 && player.achievements[153] === 0) {
    achievementaward(153)
  }
  if (player.acceleratorBought >= 100000 && player.achievements[154] === 0) {
    achievementaward(154)
  }
}

const getCostMultiplier = (buyingTo: number): Decimal => {
  ;--buyingTo

  const originalCost = 1e4
  let cost = new Decimal(originalCost)
  cost = cost.times(Decimal.pow(10, buyingTo / G.costDivisor))

  if (buyingTo > (75 + 2 * CalcECC('transcend', player.challengecompletions[4]))) {
    const num = buyingTo - 75 - 2 * CalcECC('transcend', player.challengecompletions[4])
    const factorialBit = new Decimal(num).factorial()
    const powBit = Decimal.pow(10, num)
    cost = cost.times(factorialBit.times(powBit))
  }

  if (buyingTo > (2000 + 2 * CalcECC('transcend', player.challengecompletions[4]))) {
    const sumNum = buyingTo - 2000 - 2 * CalcECC('transcend', player.challengecompletions[4])
    const sumBit = sumNum * (sumNum + 1) / 2
    cost = cost.times(Decimal.pow(2, sumBit))
  }
  if (player.currentChallenge.transcension === 4) {
    const sumBit = buyingTo * (buyingTo + 1) / 2
    cost = cost.times(Decimal.pow(10, sumBit))
  }
  if (player.currentChallenge.reincarnation === 8) {
    const sumBit = buyingTo * (buyingTo + 1) / 2
    cost = cost.times(Decimal.pow(1e50, sumBit))
  }
  const buymax = Math.pow(10, 15)
  if (buyingTo > buymax) {
    const diminishingExponent = 1 / 8

    const QuadrillionCost = getCostMultiplier(buymax)

    const newCost = QuadrillionCost.pow(Math.pow(buyingTo / buymax, 1 / diminishingExponent))
    const newExtra = newCost.exponent - Math.floor(newCost.exponent)
    newCost.exponent = Math.floor(newCost.exponent)
    newCost.mantissa *= Math.pow(10, newExtra)
    newCost.normalize()
    return Decimal.max(cost, newCost)
  }
  return cost
}

export const buyMultiplier = (autobuyer?: boolean) => {
  const buyStart = player.multiplierBought
  const buymax = Math.pow(10, 15)
  // If at least buymax, we will use a different formulae
  if (buyStart >= buymax) {
    const diminishingExponent = 1 / 8

    const log10Resource = Decimal.log10(player.coins)
    const log10QuadrillionCost = Decimal.log10(getCostMultiplier(buymax))

    let hi = Math.floor(buymax * Math.max(1, Math.pow(log10Resource / log10QuadrillionCost, diminishingExponent)))
    let lo = buymax
    while (hi - lo > 0.5) {
      const mid = Math.floor(lo + (hi - lo) / 2)
      if (mid === lo || mid === hi) {
        break
      }
      if (!player.coins.gte(getCostMultiplier(mid))) {
        hi = mid
      } else {
        lo = mid
      }
    }
    const buyable = lo
    const thisCost = getCostMultiplier(buyable)

    player.multiplierBought = buyable
    player.multiplierCost = thisCost
    return
  }

  // Start buying at the current amount bought + 1
  const buydefault = buyStart + smallestInc(buyStart)
  let buyTo = buydefault

  let cashToBuy = getCostMultiplier(buyTo)
  while (player.coins.gte(cashToBuy)) {
    // then multiply by 4 until it reaches just above the amount needed
    buyTo = buyTo * 4
    cashToBuy = getCostMultiplier(buyTo)
  }
  let stepdown = Math.floor(buyTo / 8)
  while (stepdown >= smallestInc(buyTo)) {
    // if step down would push it below out of expense range then divide step down by 2
    if (getCostMultiplier(buyTo - stepdown).lte(player.coins)) {
      stepdown = Math.floor(stepdown / 2)
    } else {
      buyTo = buyTo - Math.max(smallestInc(buyTo), stepdown)
    }
  }

  if (!autobuyer && (player.coinbuyamount as number | string) !== 'max') {
    if (player.multiplierBought + player.coinbuyamount < buyTo) {
      buyTo = player.multiplierBought + player.coinbuyamount
    }
  }

  let buyFrom = Math.max(buyTo - 6 - smallestInc(buyTo), buydefault)
  let thisCost = getCostMultiplier(buyFrom)
  while (buyFrom <= buyTo && player.coins.gte(thisCost)) {
    if (buyFrom >= buymax) {
      buyFrom = buymax
    }
    player.coins = player.coins.sub(thisCost)
    player.multiplierBought = buyFrom
    buyFrom = buyFrom + smallestInc(buyFrom)
    thisCost = getCostMultiplier(buyFrom)
    player.multiplierCost = thisCost
    if (buyFrom >= buymax) {
      return
    }
  }

  player.prestigenomultiplier = false
  player.transcendnomultiplier = false
  player.reincarnatenomultiplier = false
  updateAllMultiplier()
  if (player.multiplierBought >= 2 && player.achievements[155] === 0) {
    achievementaward(155)
  }
  if (player.multiplierBought >= 20 && player.achievements[156] === 0) {
    achievementaward(156)
  }
  if (player.multiplierBought >= 100 && player.achievements[157] === 0) {
    achievementaward(157)
  }
  if (player.multiplierBought >= 500 && player.achievements[158] === 0) {
    achievementaward(158)
  }
  if (player.multiplierBought >= 2000 && player.achievements[159] === 0) {
    achievementaward(159)
  }
  if (player.multiplierBought >= 12500 && player.achievements[160] === 0) {
    achievementaward(160)
  }
  if (player.multiplierBought >= 100000 && player.achievements[161] === 0) {
    achievementaward(161)
  }
}

/*
// Uses same as Decimal prototype but does so without creating new objects
Decimal.prototype.factorial = function () {
  // Using Stirling's Approximation.
  // https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
  var n = this.toNumber() + 1;
  return Decimal.pow(n / Math.E * Math.sqrt(n * Math.sinh(1 / n) + 1 / (810 * Math.pow(n, 6))), n).mul(Math.sqrt(2 * Math.PI / n));
};
*/

const mantissaFactorialPartExtra = Math.log10(2 * Math.PI)
const exponentFactorialPartExtra = Math.log10(Math.E)

const factorialByExponent = (fact: number) => {
  if (++fact === 0) {
    return 0
  }
  return ((Math.log10(fact * Math.sqrt(fact * Math.sinh(1 / fact) + 1 / (810 * Math.pow(fact, 6))))
    - exponentFactorialPartExtra) * fact) + ((mantissaFactorialPartExtra - Math.log10(fact)) / 2)
}

const fact100exponent = Math.log10(9.332621544394e+157)

// system of equations
// 16 digits of precision
// log10(1.25)xn = log10(x)+16
// see: https://www.wolframalpha.com/input/?i=log10%28x%29%2B16+%3D+log10%281.25%29x
// xn ~= 188.582
// x ~= 188.582/n
const precision16_loss_addition_of_ones = 188.582
const known_log10s = (() => {
  // needed logs
  const needed = [1.03, 1.25]
  const nums = [1, 2, 3, 4, 5, 6, 10, 15]
  for (const num of nums) {
    needed.push(100 + (100 * num))
    needed.push(10 + (10 * num))
  }

  // Gets all possible challenge 8 completion amounts
  const chalcompletions = 1000
  for (let i = 0; i < chalcompletions; ++i) {
    needed.push(1 + (i / 2))
  }

  // constructing all logs
  const obj: Record<number, number> = {}
  for (const need of needed) {
    if (typeof obj[need] === 'undefined') {
      obj[need] = Math.log10(need)
    }
  }
  return obj
})()

const coinBuildingCosts = [100, 1000, 2e4, 4e5, 8e6] as const
const diamondBuildingCosts = [100, 1e5, 1e15, 1e40, 1e100] as const
const mythosAndParticleBuildingCosts = [1, 1e2, 1e4, 1e8, 1e16] as const

const getCostInternal = (
  originalCost: DecimalSource,
  buyingTo: number,
  type: keyof typeof buyProducerTypes,
  num: number,
  r: number
): Decimal => {
  // It's 0 indexed by mistake so you have to subtract 1 somewhere.
  ;--buyingTo
  const buymax = Math.pow(10, 15)
  // Accounts for the multiplies by 1.25^num buyingTo times
  const cost = new Decimal(originalCost)
  let mlog10125 = num * buyingTo
  // Accounts for the add 1s
  if (buyingTo < precision16_loss_addition_of_ones / num) {
    cost.mantissa += buyingTo / Math.pow(10, cost.exponent)
  }
  let fastFactMultBuyTo = 0
  // floored r value gets used a lot in removing calculations
  let fr = Math.floor(r * 1000)
  if (buyingTo >= r * 1000) {
    // This code is such a mess at this point, just know that this is equivalent to what it was before
    ;++fastFactMultBuyTo
    cost.exponent -= factorialByExponent(fr)
    cost.exponent += (-3 + Math.log10(1 + (num / 2))) * (buyingTo - fr)
  }

  fr = Math.floor(r * 5000)
  if (buyingTo >= r * 5000) {
    // This code is such a mess at this point, just know that this is equivalent to what it was before
    ;++fastFactMultBuyTo
    cost.exponent -= factorialByExponent(fr)
    cost.exponent += ((known_log10s[10 + num * 10] + 1) * (buyingTo - fr - 1)) + 1
  }

  fr = Math.floor(r * 20000)
  if (buyingTo >= r * 20000) {
    // This code is such a mess at this point, just know that this is equivalent to what it was before
    fastFactMultBuyTo += 3
    cost.exponent -= factorialByExponent(fr) * 3
    cost.exponent += (known_log10s[100 + (100 * num)] + 5) * (buyingTo - fr)
  }

  fr = Math.floor(r * 250000)
  if (buyingTo >= r * 250000) {
    // 1.03^x*1.03^y = 1.03^(x+y), we'll abuse this for this section of the algorithm
    // 1.03^(x+y-((number of terms)250000*r))
    // up to 250003 case
    // assume r = 1 for this case
    // (1.03^250000-250000)(1.03^250001-250000)(1.03^250002-250000)(1.03^250003) = (1.03^0*1.03^1*1.03^2*1.03^3)
    // so in reality we just need to take buyingTo - fr and sum the power up to it
    // (1.03^(sum from 0 to buyingTo - fr)) is the multiplier
    // so (1.03^( (buyingTo-fr)(buyingTo-fr+1)/2 )
    // god damn that was hard to make an algo for
    cost.exponent += Math.log10(1.03) * (buyingTo - fr) * ((buyingTo - fr + 1) / 2)
  }
  // Applies the factorials from earlier without computing them 5 times
  cost.exponent += factorialByExponent(buyingTo) * fastFactMultBuyTo
  let fastFactMultBuyTo100 = 0
  if ((player.currentChallenge.transcension === 4) && (type === 'Coin' || type === 'Diamonds')) {
    // you would not fucking believe how long it took me to figure this out
    // (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
    ;++fastFactMultBuyTo100
    if (buyingTo >= (1000 - (10 * player.challengecompletions[4]))) {
      // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo
      mlog10125 += buyingTo * (buyingTo + 1) / 2
    }
  }
  if ((player.currentChallenge.reincarnation === 10) && (type === 'Coin' || type === 'Diamonds')) {
    // you would not fucking believe how long it took me to figure this out
    // (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
    ;++fastFactMultBuyTo100
    if (buyingTo >= (r * 25000)) {
      // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo
      mlog10125 += buyingTo * (buyingTo + 1) / 2
    }
  }
  // Applies the factorial w/ formula from earlier n times to avoid multiple computations
  cost.exponent += fastFactMultBuyTo100
    * ((factorialByExponent(buyingTo + 100) - fact100exponent + (2 * buyingTo))
      * (1.25 + (player.challengecompletions[4] / 4)))
  // Applies all the Math.log10(1.25)s from earlier n times to avoid multiple computations
  // log10(1.25)
  cost.exponent += known_log10s[1.25] * mlog10125
  fr = Math.floor(r * 1000 * player.challengecompletions[8])
  if (
    player.currentChallenge.reincarnation === 8 && (type === 'Coin' || type === 'Diamonds' || type === 'Mythos')
    && buyingTo >= (1000 * player.challengecompletions[8] * r)
  ) {
    cost.exponent +=
      ((known_log10s[2] * ((buyingTo - fr + 1) / 2)) - known_log10s[1 + (player.challengecompletions[8] / 2)])
      * (buyingTo - fr)
  }

  const extra = cost.exponent - Math.floor(cost.exponent)
  cost.exponent = Math.floor(cost.exponent)
  cost.mantissa *= Math.pow(10, extra)
  cost.normalize()
  if (buyingTo > buymax) {
    const diminishingExponent = 1 / 8

    const QuadrillionCost = getCostInternal(originalCost, buymax, type, num, r)

    const newCost = QuadrillionCost.pow(Math.pow(buyingTo / buymax, 1 / diminishingExponent))
    const newExtra = newCost.exponent - Math.floor(newCost.exponent)
    newCost.exponent = Math.floor(newCost.exponent)
    newCost.mantissa *= Math.pow(10, newExtra)
    newCost.normalize()
    return Decimal.max(cost, newCost)
  }
  return cost
}

const getOriginalCostAndNum = (index: OneToFive, type: keyof typeof buyProducerTypes) => {
  const originalCostArray = type === 'Coin'
    ? coinBuildingCosts
    : type === 'Diamonds'
    ? diamondBuildingCosts
    : mythosAndParticleBuildingCosts
  const num = type === 'Coin' ? index : index * (index + 1) / 2
  const originalCost = originalCostArray[index - 1 as ZeroToFour]
  return [originalCost, num] as const
}

export const getCost = (index: OneToFive, type: keyof typeof buyProducerTypes, buyingTo: number, r?: number) => {
  const [originalCost, num] = getOriginalCostAndNum(index, type)
  return getCostInternal(originalCost, buyingTo, type, num, r ?? getReductionValue())
}

export const buyMax = (index: OneToFive, type: keyof typeof buyProducerTypes) => {
  const zeroIndex = index - 1 as ZeroToFour
  const pos = G.ordinals[zeroIndex]
  const [originalCost, num] = getOriginalCostAndNum(index, type)

  const buymax = Math.pow(10, 15)
  const coinmax = 1e99
  const r = getReductionValue()
  const tag = buyProducerTypes[type][0]

  const posOwnedType = `${pos}Owned${type}` as const

  const buyStart = player[posOwnedType]
  // If at least buymax, we will use a different formulae
  if (buyStart >= buymax) {
    const diminishingExponent = 1 / 8

    const log10Resource = Decimal.log10(player[tag])
    const log10QuadrillionCost = Decimal.log10(getCostInternal(originalCost, buymax, type, num, r))

    let hi = Math.floor(buymax * Math.max(1, Math.pow(log10Resource / log10QuadrillionCost, diminishingExponent)))
    let lo = buymax
    while (hi - lo > 0.5) {
      const mid = Math.floor(lo + (hi - lo) / 2)
      if (mid === lo || mid === hi) {
        break
      }
      if (!player[tag].gte(getCostInternal(originalCost, mid, type, num, r))) {
        hi = mid
      } else {
        lo = mid
      }
    }
    const buyable = lo
    const thisCost = getCostInternal(originalCost, buyable, type, num, r)

    player[posOwnedType] = buyable
    player[`${pos}Cost${type}` as const] = thisCost
    return
  }

  // Start buying at the current amount bought + 1
  const buydefault = buyStart + smallestInc(buyStart)
  let buyInc = 1

  let cashToBuy = getCostInternal(originalCost, buyStart + buyInc, type, num, r)

  // Degenerate Case: return maximum if coins is too large
  if (cashToBuy.exponent >= coinmax || !player[tag].gte(cashToBuy)) {
    return
  }

  while (cashToBuy.exponent < coinmax && player[tag].gte(cashToBuy)) {
    // then multiply by 4 until it reaches just above the amount needed
    buyInc = buyInc * 4
    cashToBuy = getCostInternal(originalCost, buyStart + buyInc, type, num, r)
  }
  let stepdown = Math.floor(buyInc / 8)
  while (stepdown >= smallestInc(buyInc)) {
    // if step down would push it below out of expense range then divide step down by 2
    if (getCostInternal(originalCost, buyStart + buyInc - stepdown, type, num, r).lte(player[tag])) {
      stepdown = Math.floor(stepdown / 2)
    } else {
      buyInc = buyInc - Math.max(smallestInc(buyInc), stepdown)
    }
  }

  // Resolves the infamous autobuyer bug, for large values. This prevents the notion of even being able
  // to go above the buymax. Future instances will also not check more than the first few lines
  // meaning that the code below this cannot run if this ever runs.
  if (buyStart + buyInc >= buymax) {
    player[posOwnedType] = buymax
    player[`${pos}Cost${type}` as const] = getCostInternal(originalCost, buymax, type, num, r)
    return
  }

  // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
  let buyFrom = Math.max(buyStart + buyInc - 6 - smallestInc(buyInc), buydefault)
  let thisCost = getCostInternal(originalCost, buyFrom, type, num, r)
  while (buyFrom <= buyStart + buyInc && player[tag].gte(thisCost)) {
    player[tag] = player[tag].sub(thisCost)
    player[posOwnedType] = buyFrom
    buyFrom = buyFrom + smallestInc(buyFrom)
    thisCost = getCostInternal(originalCost, buyFrom, type, num, r)
    player[`${pos}Cost${type}` as const] = thisCost
  }
}

const buyProducerTypes = {
  Diamonds: ['prestigePoints', 'crystal'],
  Mythos: ['transcendPoints', 'mythos'],
  Particles: ['reincarnationPoints', 'particle'],
  Coin: ['coins', 'coin']
} as const

export const buyProducer = (
  pos: FirstToFifth,
  type: keyof typeof buyProducerTypes,
  num: number,
  autobuyer?: boolean
) => {
  const [tag, amounttype] = buyProducerTypes[type]
  const buythisamount = autobuyer ? 500 : player[`${amounttype}buyamount` as const]
  let r = 1
  r += (G.rune4level * G.effectiveLevelMult) / 160
  r += (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59]
    + player.researches[60]) / 200
  r += CalcECC('transcend', player.challengecompletions[4]) / 200
  r += (3 * (G.bonusant7 + player.antUpgrades[7 - 1]!)) / 100

  const posCostType = `${pos}Cost${type}` as const
  const posOwnedType = `${pos}Owned${type}` as const

  while (
    player[tag].gte(player[posCostType]) && G.ticker < buythisamount && player[posOwnedType] < Number.MAX_SAFE_INTEGER
  ) {
    player[tag] = player[tag].sub(player[posCostType])
    player[posOwnedType] += 1
    player[posCostType] = player[posCostType].times(Decimal.pow(1.25, num))
    player[posCostType] = player[posCostType].add(1)
    if (player[posOwnedType] >= (1000 * r)) {
      player[posCostType] = player[posCostType].times(player[posOwnedType]).dividedBy(1000).times(1 + num / 2)
    }
    if (player[posOwnedType] >= (5000 * r)) {
      player[posCostType] = player[posCostType].times(player[posOwnedType]).times(10).times(10 + num * 10)
    }
    if (player[posOwnedType] >= (20000 * r)) {
      player[posCostType] = player[posCostType].times(Decimal.pow(player[posOwnedType], 3)).times(100000).times(
        100 + num * 100
      )
    }
    if (player[posOwnedType] >= (250000 * r)) {
      player[posCostType] = player[posCostType].times(Decimal.pow(1.03, player[posOwnedType] - 250000 * r))
    }
    if (player.currentChallenge.transcension === 4 && (type === 'Coin' || type === 'Diamonds')) {
      player[posCostType] = player[posCostType].times(
        Math.pow(100 * player[posOwnedType] + 10000, 1.25 + 1 / 4 * player.challengecompletions[4])
      )
      if (player[posOwnedType] >= 1000 - (10 * player.challengecompletions[4])) {
        player[posCostType] = player[posCostType].times(Decimal.pow(1.25, player[posOwnedType]))
      }
    }
    if (
      player.currentChallenge.reincarnation === 8 && (type === 'Coin' || type === 'Diamonds' || type === 'Mythos')
      && player[posOwnedType] >= (1000 * player.challengecompletions[8] * r)
    ) {
      player[posCostType] = player[posCostType].times(
        Decimal.pow(
          2,
          (player[posOwnedType] - (1000 * player.challengecompletions[8] * r))
            / (1 + (player.challengecompletions[8] / 2))
        )
      )
    }
    G.ticker += 1
  }
  G.ticker = 0
}

export const buyUpgrades = (type: Upgrade, pos: number, state?: boolean) => {
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

export const calculateCrystalBuy = (i: number) => {
  const u = i - 1
  const exponent = Decimal.log(player.prestigeShards.add(1), 10)

  const toBuy = Math.floor(
    Math.pow(Math.max(0, 2 * (exponent - G.crystalUpgradesCost[u]) / G.crystalUpgradeCostIncrement[u] + 1 / 4), 1 / 2)
      + 1 / 2
  )
  return toBuy
}

export const buyCrystalUpgrades = (i: number, auto = false) => {
  const u = i - 1

  let c = 0
  c += Math.floor(G.rune3level / 16 * G.effectiveLevelMult) * 100 / 100
  if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
    c += 10
  }

  const toBuy = calculateCrystalBuy(i)

  if (toBuy + c > player.crystalUpgrades[u]) {
    player.crystalUpgrades[u] = 100 / 100 * (toBuy + c)
    if (toBuy > 0) {
      player.prestigeShards = player.prestigeShards.sub(
        Decimal.pow(
          10,
          G.crystalUpgradesCost[u] + G.crystalUpgradeCostIncrement[u] * (1 / 2 * Math.pow(toBuy - 1 / 2, 2) - 1 / 8)
        )
      )
      if (!auto) {
        crystalupgradedescriptions(i)
      }
    }
  }
}

export const boostAccelerator = (automated?: boolean) => {
  let buyamount = 1
  if (player.upgrades[46] === 1) {
    buyamount = automated ? 9999 : player.coinbuyamount
  }

  if (player.upgrades[46] < 1) {
    while (player.prestigePoints.gte(player.acceleratorBoostCost) && G.ticker < buyamount) {
      if (player.prestigePoints.gte(player.acceleratorBoostCost)) {
        player.acceleratorBoostBought += 1
        player.acceleratorBoostCost = player.acceleratorBoostCost.times(1e10).times(
          Decimal.pow(10, player.acceleratorBoostBought)
        )
        if (player.acceleratorBoostBought > (1000 * (1 + 2 * G.effectiveRuneBlessingPower[4]))) {
          player.acceleratorBoostCost = player.acceleratorBoostCost.times(
            Decimal.pow(
              10,
              Math.pow(player.acceleratorBoostBought - (1000 * (1 + 2 * G.effectiveRuneBlessingPower[4])), 2)
                / (1 + 2 * G.effectiveRuneBlessingPower[4])
            )
          )
        }
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
    const buyStart = player.acceleratorBoostBought
    const buymax = Math.pow(10, 15)
    // If at least buymax, we will use a different formulae
    if (buyStart >= buymax) {
      const diminishingExponent = 1 / 8

      const log10Resource = Decimal.log10(player.prestigePoints)
      const log10QuadrillionCost = Decimal.log10(getAcceleratorBoostCost(buymax))

      let hi = Math.floor(buymax * Math.max(1, Math.pow(log10Resource / log10QuadrillionCost, diminishingExponent)))
      let lo = buymax
      while (hi - lo > 0.5) {
        const mid = Math.floor(lo + (hi - lo) / 2)
        if (mid === lo || mid === hi) {
          break
        }
        if (!player.prestigePoints.gte(getAcceleratorBoostCost(mid))) {
          hi = mid
        } else {
          lo = mid
        }
      }
      const buyable = lo
      const thisCost = getAcceleratorBoostCost(buyable)

      player.acceleratorBoostBought = buyable
      player.acceleratorBoostCost = thisCost
      return
    }

    // Start buying at the current amount bought + 1
    const buydefault = buyStart + smallestInc(buyStart)
    let buyInc = 1

    let cost = getAcceleratorBoostCost(buyStart + buyInc)
    while (player.prestigePoints.gte(cost)) {
      buyInc *= 4
      cost = getAcceleratorBoostCost(buyStart + buyInc)
    }
    let stepdown = Math.floor(buyInc / 8)
    while (stepdown >= smallestInc(buyInc)) {
      // if step down would push it below out of expense range then divide step down by 2
      if (getAcceleratorBoostCost(buyStart + buyInc - stepdown).lte(player.prestigePoints)) {
        stepdown = Math.floor(stepdown / 2)
      } else {
        buyInc = buyInc - Math.max(smallestInc(buyInc), stepdown)
      }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyStart + buyInc - 6 - smallestInc(buyInc), buydefault)
    let thisCost = getAcceleratorBoostCost(player.acceleratorBoostBought)
    while (buyFrom <= buyStart + buyInc && player.prestigePoints.gte(getAcceleratorBoostCost(buyFrom))) {
      player.prestigePoints = player.prestigePoints.sub(thisCost)
      if (buyFrom >= buymax) {
        buyFrom = buymax
      }
      player.acceleratorBoostBought = buyFrom
      buyFrom = buyFrom + smallestInc(buyFrom)
      thisCost = getAcceleratorBoostCost(buyFrom)
      player.acceleratorBoostCost = thisCost

      player.transcendnoaccelerator = false
      player.reincarnatenoaccelerator = false
      if (buyFrom >= buymax) {
        return
      }
    }
  }

  G.ticker = 0
  if (player.acceleratorBoostBought >= 2 && player.achievements[162] === 0) {
    achievementaward(162)
  }
  if (player.acceleratorBoostBought >= 10 && player.achievements[163] === 0) {
    achievementaward(163)
  }
  if (player.acceleratorBoostBought >= 50 && player.achievements[164] === 0) {
    achievementaward(164)
  }
  if (player.acceleratorBoostBought >= 200 && player.achievements[165] === 0) {
    achievementaward(165)
  }
  if (player.acceleratorBoostBought >= 1000 && player.achievements[166] === 0) {
    achievementaward(166)
  }
  if (player.acceleratorBoostBought >= 5000 && player.achievements[167] === 0) {
    achievementaward(167)
  }
  if (player.acceleratorBoostBought >= 15000 && player.achievements[168] === 0) {
    achievementaward(168)
  }
}

const getAcceleratorBoostCost = (level = 1): Decimal => {
  // formula starts at 0 but buying starts at 1
  level--
  const buymax = Math.pow(10, 15)
  const base = new Decimal(1e3)
  const eff = 1 + 2 * G.effectiveRuneBlessingPower[4]
  const linSum = (n: number) => n * (n + 1) / 2
  const sqrSum = (n: number) => n * (n + 1) * (2 * n + 1) / 6
  let cost = base
  if (level > 1000 * eff) {
    cost = base.times(Decimal.pow(
      10,
      10 * level
        + linSum(level) // each level increases the exponent by 1 more each time
        + sqrSum(level - 1000 * eff) / eff
    )) // after cost delay is passed each level increases the cost by the square each time
  } else {
    cost = base.times(Decimal.pow(10, 10 * level + linSum(level)))
  }
  if (level > buymax) {
    const diminishingExponent = 1 / 8

    const QuadrillionCost = getAcceleratorBoostCost(buymax)

    const newCost = QuadrillionCost.pow(Math.pow(level / buymax, 1 / diminishingExponent))
    const newExtra = newCost.exponent - Math.floor(newCost.exponent)
    newCost.exponent = Math.floor(newCost.exponent)
    newCost.mantissa *= Math.pow(10, newExtra)
    newCost.normalize()
    return Decimal.max(cost, newCost)
  }
  return cost
}

const getParticleCost = (originalCost: DecimalSource, buyTo: number): Decimal => {
  ;--buyTo
  originalCost = new Decimal(originalCost)
  let cost = originalCost.times(Decimal.pow(2, buyTo))

  const DR = (player.currentChallenge.ascension !== 15) ? 325000 : 1000

  if (buyTo > DR) {
    cost = cost.times(Decimal.pow(1.001, (buyTo - DR) * ((buyTo - DR + 1) / 2)))
  }
  const buymax = Math.pow(10, 15)
  if (buyTo > buymax) {
    const diminishingExponent = 1 / 8

    const QuadrillionCost = getParticleCost(originalCost, buymax)

    const newCost = QuadrillionCost.pow(Math.pow(buyTo / buymax, 1 / diminishingExponent))
    const newExtra = newCost.exponent - Math.floor(newCost.exponent)
    newCost.exponent = Math.floor(newCost.exponent)
    newCost.mantissa *= Math.pow(10, newExtra)
    newCost.normalize()
    return Decimal.max(cost, newCost)
  }
  return cost
}

export const buyParticleBuilding = (
  index: OneToFive,
  autobuyer = false
) => {
  const zeroIndex = index - 1 as ZeroToFour
  const originalCost = mythosAndParticleBuildingCosts[zeroIndex]
  const pos = G.ordinals[zeroIndex]
  const key = `${pos}OwnedParticles` as const
  const buyStart = player[key]
  const buymax = Math.pow(10, 15)
  // If at least buymax, we will use a different formulae
  if (buyStart >= buymax) {
    const diminishingExponent = 1 / 8

    const log10Resource = Decimal.log10(player.reincarnationPoints)
    const log10QuadrillionCost = Decimal.log10(getParticleCost(originalCost, buymax))

    let hi = Math.floor(buymax * Math.max(1, Math.pow(log10Resource / log10QuadrillionCost, diminishingExponent)))
    let lo = buymax
    while (hi - lo > 0.5) {
      const mid = Math.floor(lo + (hi - lo) / 2)
      if (mid === lo || mid === hi) {
        break
      }
      if (!player.reincarnationPoints.gte(getParticleCost(originalCost, mid))) {
        hi = mid
      } else {
        lo = mid
      }
    }
    const buyable = lo
    const thisCost = getParticleCost(originalCost, buyable)

    player[key] = buyable
    player[`${pos}CostParticles` as const] = thisCost
    return
  }

  // Start buying at the current amount bought + 1
  const buydefault = buyStart + smallestInc(buyStart)
  let buyTo = buydefault

  let cashToBuy = getParticleCost(originalCost, buyTo)
  while (player.reincarnationPoints.gte(cashToBuy)) {
    // then multiply by 4 until it reaches just above the amount needed
    buyTo = buyTo * 4
    cashToBuy = getParticleCost(originalCost, buyTo)
  }
  let stepdown = Math.floor(buyTo / 8)
  while (stepdown >= smallestInc(buyTo)) {
    // if step down would push it below out of expense range then divide step down by 2
    if (getParticleCost(originalCost, buyTo - stepdown).lte(player.reincarnationPoints)) {
      stepdown = Math.floor(stepdown / 2)
    } else {
      buyTo = buyTo - Math.max(smallestInc(buyTo), stepdown)
    }
  }

  if (!autobuyer) {
    if (player.particlebuyamount + buyStart < buyTo) {
      buyTo = buyStart + player.particlebuyamount + smallestInc(player[key] + player.particlebuyamount)
    }
  }

  // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
  let buyFrom = Math.max(buyTo - 6 - smallestInc(buyTo), buydefault)
  let thisCost = getParticleCost(originalCost, buyFrom)
  while (buyFrom <= buyTo && player.reincarnationPoints.gte(thisCost)) {
    player.reincarnationPoints = player.reincarnationPoints.sub(thisCost)
    player[key] = buyFrom
    buyFrom = buyFrom + smallestInc(buyFrom)
    thisCost = getParticleCost(originalCost, buyFrom)
    player[`${pos}CostParticles` as const] = thisCost
  }
}

export const tesseractBuildingCosts = [1, 10, 100, 1000, 10000] as const

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
    price += tesseractBuildingCosts[i]
      * (Math.pow(buyTo * (buyTo + 1) / 2, 2) - Math.pow(buyFrom * (buyFrom + 1) / 2, 2))
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
export const getTesseractCost = (
  index: OneToFive,
  amount?: number,
  checkCanAfford = true,
  buyFrom?: number
): [number, number] => {
  amount ??= player.tesseractbuyamount
  buyFrom ??= player[`ascendBuilding${index}` as const].owned
  const intCost = tesseractBuildingCosts[index - 1]
  const subCost = intCost * Math.pow(buyFrom * (buyFrom + 1) / 2, 2)

  let actualBuy: number
  if (checkCanAfford) {
    const buyTo = Math.floor(
      -1 / 2 + 1 / 2 * Math.pow(1 + 8 * Math.pow((Number(player.wowTesseracts) + subCost) / intCost, 1 / 2), 1 / 2)
    )
    actualBuy = Math.min(buyTo, buyFrom + amount)
  } else {
    actualBuy = buyFrom + amount
  }
  const actualCost = intCost * Math.pow(actualBuy * (actualBuy + 1) / 2, 2) - subCost
  return [actualBuy, actualCost]
}

export const buyTesseractBuilding = (index: OneToFive, amount = player.tesseractbuyamount) => {
  const intCost = tesseractBuildingCosts[index - 1]
  const ascendBuildingIndex = `ascendBuilding${index}` as const
  // Destructuring FTW!
  const [buyTo, actualCost] = getTesseractCost(index, amount)

  player[ascendBuildingIndex].owned = buyTo
  player.wowTesseracts.sub(actualCost)
  player[ascendBuildingIndex].cost = intCost * Math.pow(1 + buyTo, 3)
}

export const buyRuneBonusLevels = (type: 'Blessings' | 'Spirits', index: number) => {
  const unlocked = type === 'Spirits' ? player.challengecompletions[12] > 0 : player.achievements[134] === 1
  if (unlocked && isFinite(player.runeshards) && player.runeshards > 0) {
    let baseCost: number
    let baseLevels: number
    let levelCap: number
    if (type === 'Spirits') {
      baseCost = G.spiritBaseCost
      baseLevels = player.runeSpiritLevels[index]
      levelCap = player.runeSpiritBuyAmount
    } else {
      baseCost = G.blessingBaseCost
      baseLevels = player.runeBlessingLevels[index]
      levelCap = player.runeBlessingBuyAmount
    }

    const [level, cost] = calculateSummationLinear(baseLevels, baseCost, player.runeshards, levelCap)
    if (type === 'Spirits') {
      player.runeSpiritLevels[index] = level
    } else {
      player.runeBlessingLevels[index] = level
    }

    player.runeshards -= cost

    if (player.runeshards < 0) {
      player.runeshards = 0
    }

    updateRuneBlessing(type, index)
  }
}

export const updateRuneBlessing = (type: 'Blessings' | 'Spirits', index: number) => {
  if (index === 1) {
    const requirementArray = [0, 1e5, 1e8, 1e11]
    for (let i = 1; i <= 3; i++) {
      if (player.runeBlessingLevels[1] >= requirementArray[i] && player.achievements[231 + i] < 1) {
        achievementaward(231 + i)
      }
      if (player.runeSpiritLevels[1] >= 10 * requirementArray[i] && player.achievements[234 + i] < 1) {
        achievementaward(234 + i)
      }
    }
    if (player.runeBlessingLevels[1] >= 1e22 && player.achievements[245] < 1) {
      achievementaward(245)
    }
  }

  calculateRuneBonuses()

  if (type === 'Blessings') {
    const blessingMultiplierArray = [0, 8, 10, 6.66, 2, 1]
    const t = (index === 5) ? 1 : 0
    DOMCacheGetOrSet(`runeBlessingPower${index}Value1`).innerHTML = i18next.t('runes.blessings.blessingPower', {
      reward: i18next.t(`runes.blessings.rewards.${index - 1}`),
      value: format(G.runeBlessings[index]),
      speed: format(1 - t + blessingMultiplierArray[index] * G.effectiveRuneBlessingPower[index], 4, true)
    })
  } else if (type === 'Spirits') {
    const spiritMultiplierArray = [0, 1, 1, 20, 1, 100]
    spiritMultiplierArray[index] *= calculateCorruptionPoints() / 400
    const t = (index === 3) ? 1 : 0

    DOMCacheGetOrSet(`runeSpiritPower${index}Value1`).innerHTML = i18next.t('runes.spirits.spiritPower', {
      reward: i18next.t(`runes.spirits.rewards.${index - 1}`),
      value: format(G.runeSpirits[index]),
      speed: format(1 - t + spiritMultiplierArray[index] * G.effectiveRuneSpiritPower[index], 4, true)
    })
  }
}

export const buyAllBlessings = (type: 'Blessings' | 'Spirits', percentage = 100, auto = false) => {
  const unlocked = type === 'Spirits' ? player.challengecompletions[12] > 0 : player.achievements[134] === 1
  if (unlocked) {
    const runeshards = Math.floor(player.runeshards / 100 * percentage / 5)
    for (let index = 1; index < 6; index++) {
      if (isFinite(player.runeshards) && player.runeshards > 0) {
        let baseCost: number
        let baseLevels: number
        const levelCap = 1e300
        if (type === 'Spirits') {
          baseCost = G.spiritBaseCost
          baseLevels = player.runeSpiritLevels[index]
        } else {
          baseCost = G.blessingBaseCost
          baseLevels = player.runeBlessingLevels[index]
        }

        const [level, cost] = calculateSummationLinear(baseLevels, baseCost, runeshards, levelCap)
        if (level > baseLevels && (!auto || (level - baseLevels) * 10000 > baseLevels)) {
          if (type === 'Spirits') {
            player.runeSpiritLevels[index] = level
          } else {
            player.runeBlessingLevels[index] = level
          }

          player.runeshards -= cost

          if (player.runeshards < 0) {
            player.runeshards = 0
          }

          updateRuneBlessing(type, index)
        }
      }
    }
  }
}
