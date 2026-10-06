import { calculateBuildingPowerCoinMultiplier, player } from './Synergism'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import { awardUngroupedAchievement } from './Achievements'
import { useChallenge13Modifiers } from './Challenges'
import { getAntUpgradeEffect } from './Features/Ants/AntUpgrades/lib/upgrade-effects'
import { AntUpgrades } from './Features/Ants/AntUpgrades/structs/structs'
import { allTaxExponentStats, calculateTotalStat } from './Statistics'

// im doing this to spite xander, basically changes w5x9 to not impact tax scaling in c13 || Sean#7236
export const challenge13EffectiveCompletions = () => {
  return Math.max(
    0,
    sumContents(player.challengecompletions) - player.challengecompletions[11] - player.challengecompletions[12]
      - player.challengecompletions[13] - player.challengecompletions[14] - player.challengecompletions[15]
      - ((player.singularityCount >= 15) ? 4 : 0)
      - ((player.singularityCount >= 20) ? 1 : 0)
  )
}

// Cap the calculation overflow bug || httpsnet
export const calculateTaxExponent = () => Math.max(1e-300, calculateTotalStat(allTaxExponentStats))

export const calculateFlatTaxCapIncrease = () => {
  return Decimal.log(getAntUpgradeEffect(AntUpgrades.Coins).coinMultiplier, 10)
    + Decimal.log(calculateBuildingPowerCoinMultiplier(), 10)
}

export const calculatetax = () => {
  // To 2020 Platonic: Why the HELL is this done here???
  G.produceFirst = (player.firstGeneratedCoin.add(player.firstOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinOneMulti
  )
    .times(player.firstProduceCoin)
  G.produceSecond = (player.secondGeneratedCoin.add(player.secondOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinTwoMulti
  )
    .times(player.secondProduceCoin)
  G.produceThird = (player.thirdGeneratedCoin.add(player.thirdOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinThreeMulti
  )
    .times(player.thirdProduceCoin)
  G.produceFourth = (player.fourthGeneratedCoin.add(player.fourthOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinFourMulti
  )
    .times(player.fourthProduceCoin)
  G.produceFifth = (player.fifthGeneratedCoin.add(player.fifthOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinFiveMulti
  )
    .times(player.fifthProduceCoin)
  G.produceTotal = G.produceFirst.add(G.produceSecond).add(G.produceThird).add(G.produceFourth)
    .add(G.produceFifth)

  if (G.produceFirst.lte(G.d0_0001)) {
    G.produceFirst = new Decimal()
  }
  if (G.produceSecond.lte(G.d0_0001)) {
    G.produceSecond = new Decimal()
  }
  if (G.produceThird.lte(G.d0_0001)) {
    G.produceThird = new Decimal()
  }
  if (G.produceFourth.lte(G.d0_0001)) {
    G.produceFourth = new Decimal()
  }
  if (G.produceFifth.lte(G.d0_0001)) {
    G.produceFifth = new Decimal()
  }

  G.producePerSecond = G.produceTotal.times(40)

  const exponent = calculateTaxExponent()

  // Ant Upgrade "Fortunae Formicidae" gives a flat max exponent increase equal to its coin multi
  // It multiplies the coin production but is also tax-exempt, which we do by increasing the tax cap
  // While also deducting the log value from `exponentForDivisor`.
  // Implementing this was much more difficult than it needed to be.
  const flatMaxExponentIncrease = calculateFlatTaxCapIncrease()

  G.maxexponent = Math.floor(275 / (Decimal.log(1.01, 10) * exponent)) - 1 + flatMaxExponentIncrease

  const exponentForDivisor = Math.max(
    0,
    Math.min(G.maxexponent, Math.floor(Decimal.log(G.produceTotal.add(1), 10))) - flatMaxExponentIncrease
  )
  const exponentForWarning = Math.max(0, G.maxexponent - flatMaxExponentIncrease)

  if (useChallenge13Modifiers() && (G.maxexponent - flatMaxExponentIncrease) <= 99999) {
    // i don't think it makes sense to give the achievement as soon as the challenge is opened
    // as soon as the challenge is opened you don't have enough tax reducers to have max exponent above 100000
    // so for the achievement description to make sense i think it should require at least 1 challenge completion || Dorijanko
    if (challenge13EffectiveCompletions() >= 1) {
      awardUngroupedAchievement('overtaxed')
    }
  }

  const divisorExponent = 1 / 550 * Math.pow(exponentForDivisor, 2)
  // Not exactly clear why this is needed?
  const checkExponent = 1 / 550 * Math.pow(exponentForWarning, 2)

  // After the ants update, I really should get rid of these bad globals

  // November 11, 2025: Platonic re-derived these equations to understand why this works.
  // If you write this value out, you end up getting a function whose log is O(exponent^-1),
  // Which is intentional.
  G.taxdivisor = Decimal.pow(1.01, divisorExponent * exponent)
  G.taxdivisorcheck = Decimal.pow(1.01, checkExponent * exponent)
}
