import { getBuildingOwned, getBuildingsOwned, sumBuildingsOwned } from './Buy'
import {
  type AccelMultStats,
  calculateAcceleratorCounts,
  calculateBuildingPowerCoinMultiplier,
  calculateBuildingProduction,
  calculateCoinTierMultiplier,
  calculateFirstSixCoinUpgradeMultiplier,
  calculateGlobalCoinMultiplier,
  player
} from './Synergism'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import { awardUngroupedAchievement } from './Achievements'
import { totalStartingChallengeCompletions, useChallenge13Modifiers } from './Challenges'
import { getAntUpgradeEffect } from './Features/Ants/AntUpgrades/lib/upgrade-effects'
import { AntUpgrades } from './Features/Ants/AntUpgrades/structs/structs'
import { allTaxExponentStatsProduct } from './Statistics'

// im doing this to spite xander, basically changes w5x9 to not impact tax scaling in c13 || Sean#7236
export const challenge13EffectiveCompletions = () => {
  return Math.max(
    0,
    sumContents(player.challengecompletions) - player.challengecompletions[11] - player.challengecompletions[12]
      - player.challengecompletions[13] - player.challengecompletions[14] - player.challengecompletions[15]
      - totalStartingChallengeCompletions()
  )
}

// Cap the calculation overflow bug || httpsnet
export const calculateTaxExponent = () => Math.max(1e-300, allTaxExponentStatsProduct())

export const calculateFlatTaxCapIncrease = (buildingPowerCoinMultiplier = calculateBuildingPowerCoinMultiplier()) => {
  return Decimal.log(getAntUpgradeEffect(AntUpgrades.Coins).coinMultiplier, 10)
    + Decimal.log(buildingPowerCoinMultiplier, 10)
}

export interface CoinProducerInputs {
  coinsOwned: readonly number[]
  firstMythosOwned: number
  firstDiamondOwned: number
}

const getCoinProducerInputs = (): CoinProducerInputs => ({
  coinsOwned: getBuildingsOwned('coin'),
  firstMythosOwned: getBuildingOwned('mythos', 0),
  firstDiamondOwned: getBuildingOwned('diamond', 0)
})

export const calculateTax = (
  stats:
    & Pick<AccelMultStats, 'effectiveFreeAccelerator'>
    & Partial<Pick<AccelMultStats, 'multiplierEffect' | 'acceleratorEffect' | 'totalAccelerator'>> =
      calculateAcceleratorCounts(),
  { coinsOwned, firstMythosOwned, firstDiamondOwned }: CoinProducerInputs = getCoinProducerInputs(),
  buildingPowerCoinMultiplier = calculateBuildingPowerCoinMultiplier(undefined, sumBuildingsOwned(coinsOwned))
) => {
  // To 2020 Platonic: Why the HELL is this done here???
  const totalCoinOwned = sumBuildingsOwned(coinsOwned)
  const first6CoinUp = calculateFirstSixCoinUpgradeMultiplier(totalCoinOwned)
  const coinMultiplier = calculateGlobalCoinMultiplier(
    stats.multiplierEffect,
    stats.acceleratorEffect,
    stats.totalAccelerator
  )
  const tierInputs = {
    first6CoinUp,
    effectiveFreeAccelerator: stats.effectiveFreeAccelerator,
    coinsOwned,
    firstMythosOwned,
    firstDiamondOwned
  }
  const coinTierMultipliers = [
    calculateCoinTierMultiplier(0, tierInputs),
    calculateCoinTierMultiplier(1, tierInputs),
    calculateCoinTierMultiplier(2, tierInputs),
    calculateCoinTierMultiplier(3, tierInputs),
    calculateCoinTierMultiplier(4, tierInputs)
  ] as const
  const grossProduction = calculateBuildingProduction('coin', coinsOwned, [
    coinMultiplier.times(coinTierMultipliers[0]),
    coinMultiplier.times(coinTierMultipliers[1]),
    coinMultiplier.times(coinTierMultipliers[2]),
    coinMultiplier.times(coinTierMultipliers[3]),
    coinMultiplier.times(coinTierMultipliers[4])
  ])
  const produceTotal = grossProduction.reduce((total, production) => total.add(production), new Decimal())
  const production = grossProduction.map((tier) => tier.lte(G.d0_0001) ? new Decimal() : tier)

  const producePerSecond = produceTotal.times(40)

  const exponent = calculateTaxExponent()

  // Ant Upgrade "Fortunae Formicidae" gives a flat max exponent increase equal to its coin multi
  // It multiplies the coin production but is also tax-exempt, which we do by increasing the tax cap
  // While also deducting the log value from `exponentForDivisor`.
  // Implementing this was much more difficult than it needed to be.
  const flatMaxExponentIncrease = calculateFlatTaxCapIncrease(buildingPowerCoinMultiplier)

  const maxexponent = Math.floor(275 / (Decimal.log(1.01, 10) * exponent)) - 1 + flatMaxExponentIncrease

  const exponentForDivisor = Math.max(
    0,
    Math.min(maxexponent, Math.floor(Decimal.log(produceTotal.add(1), 10))) - flatMaxExponentIncrease
  )
  const exponentForWarning = Math.max(0, maxexponent - flatMaxExponentIncrease)

  const divisorExponent = 1 / 550 * Math.pow(exponentForDivisor, 2)
  // Not exactly clear why this is needed?
  const checkExponent = 1 / 550 * Math.pow(exponentForWarning, 2)

  // November 11, 2025: Platonic re-derived these equations to understand why this works.
  // If you write this value out, you end up getting a function whose log is O(exponent^-1),
  // Which is intentional.
  return {
    coinMultiplier,
    coinTierMultipliers,
    production,
    produceTotal,
    producePerSecond,
    maxexponent,
    flatMaxExponentIncrease,
    taxdivisor: Decimal.pow(1.01, divisorExponent * exponent),
    taxdivisorcheck: Decimal.pow(1.01, checkExponent * exponent)
  }
}

export type TaxResult = ReturnType<typeof calculateTax>

export const awardOvertaxedAchievement = ({ maxexponent, flatMaxExponentIncrease }: TaxResult) => {
  if (useChallenge13Modifiers() && (maxexponent - flatMaxExponentIncrease) <= 99999) {
    // i don't think it makes sense to give the achievement as soon as the challenge is opened
    // as soon as the challenge is opened you don't have enough tax reducers to have max exponent above 100000
    // so for the achievement description to make sense i think it should require at least 1 challenge completion || Dorijanko
    if (challenge13EffectiveCompletions() >= 1) {
      awardUngroupedAchievement('overtaxed')
    }
  }
}
