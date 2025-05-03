import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { achievementaward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcECC } from './Challenges'
import { BuffType, calculateEventSourceBuff } from './Event'
import { addTimers, automaticTools } from './Helper'
import { hepteractEffective } from './Hepteracts'
import { disableHotkeys, enableHotkeys } from './Hotkeys'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { quarkHandler } from './Quark'
import { getRedAmbrosiaUpgrade } from './RedAmbrosiaUpgrades'
import { reset } from './Reset'
import {
  allAdditiveLuckMultStats,
  allAmbrosiaBlueberryStats,
  allAmbrosiaGenerationSpeedStats,
  allAmbrosiaLuckStats,
  allAscensionSpeedStats,
  allBaseObtainiumStats,
  allBaseOfferingStats,
  allCubeStats,
  allGlobalSpeedIgnoreDRStats,
  allGlobalSpeedStats,
  allGoldenQuarkMultiplierStats,
  allGoldenQuarkPurchaseCostStats,
  allHepteractCubeStats,
  allHypercubeStats,
  allLuckConversionStats,
  allObtainiumIgnoreDRStats,
  allObtainiumStats,
  allOcteractCubeStats,
  allOfferingStats,
  allPlatonicCubeStats,
  allPowderMultiplierStats,
  allQuarkStats,
  allRedAmbrosiaGenerationSpeedStats,
  allRedAmbrosiaLuckStats,
  allShopTablets,
  allTesseractStats,
  allWowCubeStats,
  antSacrificeRewardStats,
  antSacrificeTimeStats,
  offeringObtainiumTimeModifiers
} from './Statistics'
import { format, getTimePinnedToLoadDate, player, resourceGain, saveSynergy, updateAll } from './Synergism'
import { toggleTalismanBuy, updateTalismanInventory } from './Talismans'
import { clearInterval, setInterval } from './Timers'
import { Alert, Prompt } from './UpdateHTML'
import { findInsertionIndex, productContents, sumContents } from './Utility'
import { Globals as G } from './Variables'

const CASH_GRAB_ULTRA_QUARK = 0.08
const CASH_GRAB_ULTRA_CUBE = 1.2
const CASH_GRAB_ULTRA_BLUEBERRY = 0.15

const EX_ULTRA_OFFERING = 0.125
const EX_ULTRA_OBTAINIUM = 0.125
const EX_ULTRA_CUBES = 0.125

export const calculateAllCubeMultiplier = () => {
  return allCubeStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateCubeMultiplier = () => {
  return allWowCubeStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateTesseractMultiplier = () => {
  return allTesseractStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateHypercubeMultiplier = () => {
  return allHypercubeStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculatePlatonicMultiplier = () => {
  return allPlatonicCubeStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateHepteractMultiplier = () => {
  return allHepteractCubeStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateOcteractMultiplier = () => {
  return allOcteractCubeStats.reduce((a, b) => a * b.stat(), 1)
}

// 'Decimal' is used for calculating stats that can exceed the 1e300 cap.
export const calculateOfferingsDecimal = () => {
  return allOfferingStats.reduce((a, b) => a.times(b.stat()), new Decimal(1))
}

export const calculateBaseOfferings = () => {
  return allBaseOfferingStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateOfferings = (timeMultUsed = true, logMultOnly = false) => {
  const baseOfferings = calculateBaseOfferings()
  const timeMultiplier = timeMultUsed
    ? offeringObtainiumTimeModifiers(player.prestigecounter, player.prestigeCount > 0).reduce(
      (a, b) => a * b.stat(),
      1
    )
    : 1
  const logMult = Decimal.log(calculateOfferingsDecimal(), 10)

  const totalLog = Math.log10(timeMultiplier) + logMult

  if (logMultOnly) {
    return totalLog
  }

  const effectivePowerOfTen = Math.pow(10, Math.min(300, totalLog))

  // Update Offering Per Second Statistic (For Plat: is this still needed?)
  if (timeMultUsed) {
    if (player.prestigecounter === 0) {
      player.offeringpersecond = 0
    } else {
      player.offeringpersecond = effectivePowerOfTen / player.prestigecounter
    }
  }

  return Math.max(baseOfferings, effectivePowerOfTen)
}

export const calculateOfferingToDecimal = (timeMultUsed = false) => {
  return Decimal.pow(10, calculateOfferings(timeMultUsed, true))
}

// Ditto
export const calculateObtainiumDecimal = () => {
  return allObtainiumStats.reduce((a, b) => a.times(b.stat()), new Decimal(1))
}

export const calculateBaseObtainium = () => {
  return allBaseObtainiumStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateObtainiumDRIgnoreMult = () => {
  return allObtainiumIgnoreDRStats.reduce((a, b) => a * b.stat(), 1)
}

/**
 * @param timeMultUsed Default true. If false, gives multiplier as if time multiplier was 1
 * @param logMultOnly Default false. If true, returns the log10 of the obtainium multiplier, possibly greater than 300.
 * @returns
 */
export const calculateObtainium = (timeMultUsed = true, logMultOnly = false) => {
  // Base Obtainium
  const base = calculateBaseObtainium()

  // Immaculate Offering Capacity
  const immaculate = calculateObtainiumDRIgnoreMult()

  // Illiteracy Effect
  const DR = player.corruptions.used.corruptionEffects('illiteracy')

  // Reincarnation Timer Effects (Including HALF MIND)
  const timeMultiplier = timeMultUsed
    ? offeringObtainiumTimeModifiers(player.reincarnationcounter, player.reincarnationCount >= 5)
      .reduce((a, b) => a * b.stat(), 1)
    : 1

  // Do some voodoo by converting all multipliers to a log10 value
  // If the multiplier is 0, we will want to cancel everything out, so subtract
  // Some large value (say, -99999). We're doing this to preserve multipliers past 1e300
  // For purposes of corruption (It is okay to apply illiteracy to 1e600 if DR is 0.2, since you are left with 1e120)

  const logMult = Decimal.log(calculateObtainiumDecimal(), 10)

  // Thanks to the logMult, we can treat the corruption effect as a multplier instead of an exponent.
  // The simplest formula for the effect on obtainium for is (Immaculate)^(1 - DR) * Mult^DR so logarithmic
  // is log10(Immaculate) + DR * log10(Mult)
  // Hardcap this value at 300, to preserve 1e300 max

  // Why is this a thing? If DR = 0 (which is possible), then the calculation below will not catch chal 14 enabled.
  if (player.currentChallenge.ascension === 14) {
    player.offeringpersecond = 0
    return 0
  }

  const logTotal = Math.log10(immaculate) + DR * logMult + Math.log10(timeMultiplier)

  if (logMultOnly) {
    return logTotal
  }

  const effectivePowerOfTen = Math.min(
    300,
    logTotal
  )

  // As of Statistics Update, you can never get less than your base Offerings per Reincarnation, no matter what.
  const finalRawValue = Math.max(base, Math.pow(10, effectivePowerOfTen))

  // Update OPS
  if (timeMultUsed) {
    if (player.reincarnationcounter === 0) {
      player.obtainiumpersecond = 0
    } else {
      player.obtainiumpersecond = finalRawValue / player.reincarnationcounter
      player.maxobtainiumpersecond = Math.max(player.maxobtainiumpersecond, player.obtainiumpersecond)
    }
  }

  return finalRawValue
}

/**
 * @param timeMultUsed Default false. If true, gives proper time multiplier
 * @returns Decimal of the obtainium multiplier, after all calculations.
 */
export const calculateObtainiumToDecimal = (timeMultUsed = false) => {
  return Decimal.pow(10, calculateObtainium(timeMultUsed, true))
}

export const calculateFastForwardResourcesGlobal = (
  resetTime: number,
  fastForwardAmount: number,
  resourceMult: Decimal,
  baseResource: number
) => {
  // We're going to use the log trick to account for the fact that resourceMult * timeMult can still be >1e300
  // Even if timeMult is very small.

  const logMult = Decimal.log10(resourceMult)

  // Math to compute the change in multiplier based on time
  // The amount of offerings to give is proportional to the difference in
  // Time Multipliers.
  let timeMultiplier: number

  const deltaTime = fastForwardAmount
    * (player.singularityUpgrades.halfMind.getEffect().bonus ? 10 : calculateGlobalSpeedMult())

  // Build approximations through direct computation of the derivative of time multiplier
  // And then multiplying by deltaTime, so basically a linear approximation (See: Calculus)

  // In order for the time multiplier to not decrease as your resetTime increases, while accurately portraying
  //  take the min of
  // two approximations: one with quadratic penalty (if less than threshold) and that of linear penalty
  // Use the derivative of the quadratic part

  timeMultiplier = Math.min(
    2 * resetTime * deltaTime / Math.pow(resetTimeThreshold(), 2),
    deltaTime / resetTimeThreshold()
  )

  // Correct multiplier if half mind is purchased
  timeMultiplier *= player.singularityUpgrades.halfMind.getEffect().bonus ? calculateGlobalSpeedMult() / 10 : 1

  timeMultiplier = Math.min(1e300, timeMultiplier)

  const logTime = Math.log10(timeMultiplier)

  return Math.min(1e300, Math.max(baseResource * fastForwardAmount, Math.pow(10, Math.min(300, logMult + logTime))))
}

export const calculatePotionValue = (resetTime: number, resourceMult: Decimal, baseResource: number) => {
  const potionTimeValue = 7200
  const fastForwardMult = calculateFastForwardResourcesGlobal(resetTime, potionTimeValue, resourceMult, baseResource)
  const potionMultipliers = productContents([
    +player.singularityUpgrades.potionBuff.getEffect().bonus
    * +player.singularityUpgrades.potionBuff2.getEffect().bonus
    * +player.singularityUpgrades.potionBuff3.getEffect().bonus
    * +player.octeractUpgrades.octeractAutoPotionEfficiency.getEffect().bonus
  ])

  return Math.min(1e300, fastForwardMult * potionMultipliers)
}

export const calculateResearchAutomaticObtainium = (deltaTime: number) => {
  if (player.currentChallenge.ascension === 14) {
    return 0
  }

  const multiplier = productContents([
    0.5 * player.researches[61] + 0.1 * player.researches[62],
    1 + 0.8 * player.cubeUpgrades[3]
  ])

  if (multiplier === 0) {
    return 0
  }

  const baseObtainium = calculateBaseObtainium()

  const resourceMult = calculateObtainiumToDecimal()
  const fastForwardMult = calculateFastForwardResourcesGlobal(
    player.reincarnationcounter,
    deltaTime,
    resourceMult,
    baseObtainium
  )
  return Math.min(1e300, fastForwardMult * multiplier)
}

export const calculateQuarkMultiplier = () => {
  return allQuarkStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateAntSacrificeMultiplier = () => {
  return antSacrificeRewardStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateAntSacrificeObtainium = () => {
  const base = 1 / 750
  const antSacMult = calculateAntSacrificeMultiplier()
  const obtainiumMult = calculateObtainiumToDecimal()
  const baseObtainium = calculateBaseObtainium()
  calculateAntSacrificeELO()

  const timeMult = antSacrificeTimeStats(player.antSacrificeTimer, player.achievements[177] > 0).reduce(
    (a, b) => a * b.stat(),
    1
  )
  const deltaTime = Math.min(
    1e300,
    base * antSacMult * G.effectiveELO * timeMult
  )

  return Math.max(
    baseObtainium,
    calculateFastForwardResourcesGlobal(player.reincarnationcounter, deltaTime, obtainiumMult, baseObtainium)
  )
}

export const calculateAntSacrificeOffering = () => {
  const base = 1 / 1200
  const antSacMult = calculateAntSacrificeMultiplier()
  const offeringMult = calculateOfferingToDecimal()
  const baseOfferings = calculateBaseOfferings()

  calculateAntSacrificeELO()

  const timeMult = offeringObtainiumTimeModifiers(player.antSacrificeTimer, player.achievements[177] > 0).reduce(
    (a, b) => a * b.stat(),
    1
  )
  const deltaTime = Math.min(1e300, base * antSacMult * G.effectiveELO * timeMult)

  return Math.max(
    baseOfferings,
    calculateFastForwardResourcesGlobal(player.prestigecounter, deltaTime, offeringMult, baseOfferings)
  )
}

export const calculateGlobalSpeedDRIgnoreMult = () => {
  return allGlobalSpeedIgnoreDRStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateGlobalSpeedDREnabledMult = () => {
  return allGlobalSpeedStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateGlobalSpeedMult = () => {
  let normalMult = calculateGlobalSpeedDREnabledMult()
  if (normalMult > 100) {
    normalMult = Math.pow(normalMult, 0.5) * 10
  } else if (normalMult < 1) {
    const DRPower = calculatePlatonic7UpgradePower()
    normalMult = Math.pow(normalMult, DRPower)
  }

  const immaculateMult = calculateGlobalSpeedDRIgnoreMult()
  const totalTimeMultiplier = normalMult * immaculateMult
  // Achievement Stuffs
  // One second in 100 years
  if (totalTimeMultiplier < 1 / (3600 * 24 * 365 * 100) && player.achievements[241] < 1) {
    achievementaward(241)
  }
  // One hour in a second
  if (totalTimeMultiplier > 3600 && player.achievements[242] < 1) {
    achievementaward(242)
  }

  return totalTimeMultiplier
}

export const calculateRawAscensionSpeedMult = () => {
  return allAscensionSpeedStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateAscensionSpeedMult = () => {
  let base = calculateRawAscensionSpeedMult()

  const exponentSpread = calculateAscensionSpeedExponentSpread()

  if (base < 1) {
    base = Math.pow(base, 1 - exponentSpread)
  } else {
    base = Math.pow(base, 1 + exponentSpread)
  }

  return base
}

export const calculateAmbrosiaAdditiveLuckMult = () => {
  return allAdditiveLuckMultStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateAmbrosiaLuckRaw = () => {
  return allAmbrosiaLuckStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateAmbrosiaLuck = () => {
  const rawLuck = calculateAmbrosiaLuckRaw()
  const multiplier = calculateAmbrosiaAdditiveLuckMult()

  return rawLuck * multiplier
}

export const calculateBlueberryInventory = () => {
  return allAmbrosiaBlueberryStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateAmbrosiaGenerationSpeedRaw = () => {
  return allAmbrosiaGenerationSpeedStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateAmbrosiaGenerationSpeed = () => {
  const rawSpeed = calculateAmbrosiaGenerationSpeedRaw()
  const blueberries = calculateBlueberryInventory()
  return rawSpeed * blueberries
}

export const calculatePowderConversion = () => {
  return allPowderMultiplierStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateGoldenQuarks = () => {
  return allGoldenQuarkMultiplierStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateGoldenQuarkCost = () => {
  return allGoldenQuarkPurchaseCostStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateLuckConversion = () => {
  return allLuckConversionStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateRedAmbrosiaLuck = () => {
  return allRedAmbrosiaLuckStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateRedAmbrosiaGenerationSpeed = () => {
  return allRedAmbrosiaGenerationSpeedStats.reduce((a, b) => a * b.stat(), 1)
}

export const calculateFreeShopInfinityUpgrades = () => {
  return allShopTablets.reduce((a, b) => a + b.stat(), 0)
}

export const calculateTotalCoinOwned = () => {
  G.totalCoinOwned = player.firstOwnedCoin
    + player.secondOwnedCoin
    + player.thirdOwnedCoin
    + player.fourthOwnedCoin
    + player.fifthOwnedCoin
}

export const calculateTotalAcceleratorBoost = () => {
  let b = 0
  if (player.upgrades[26] > 0.5) {
    b += 1
  }
  if (player.upgrades[31] > 0.5) {
    b += (Math.floor(G.totalCoinOwned / 2000) * 100) / 100
  }
  if (player.achievements[7] > 0.5) {
    b += Math.floor(player.firstOwnedCoin / 2000)
  }
  if (player.achievements[14] > 0.5) {
    b += Math.floor(player.secondOwnedCoin / 2000)
  }
  if (player.achievements[21] > 0.5) {
    b += Math.floor(player.thirdOwnedCoin / 2000)
  }
  if (player.achievements[28] > 0.5) {
    b += Math.floor(player.fourthOwnedCoin / 2000)
  }
  if (player.achievements[35] > 0.5) {
    b += Math.floor(player.fifthOwnedCoin / 2000)
  }

  b += player.researches[93]
    * Math.floor(
      (1 / 20)
        * (G.rune1level
          + G.rune2level
          + G.rune3level
          + G.rune4level
          + G.rune5level)
    )
  b += Math.floor(((0.01 + G.rune1level) * G.effectiveLevelMult) / 20)
  b *= 1
    + (1 / 5)
      * player.researches[3]
      * (1 + (1 / 2) * CalcECC('ascension', player.challengecompletions[14]))
  b *= 1 + (1 / 20) * player.researches[16] + (1 / 20) * player.researches[17]
  b *= 1 + (1 / 20) * player.researches[88]
  b *= calculateSigmoidExponential(
    20,
    (((player.antUpgrades[4 - 1]! + G.bonusant4) / 1000) * 20) / 19
  )
  b *= 1 + (1 / 100) * player.researches[127]
  b *= 1 + (0.8 / 100) * player.researches[142]
  b *= 1 + (0.6 / 100) * player.researches[157]
  b *= 1 + (0.4 / 100) * player.researches[172]
  b *= 1 + (0.2 / 100) * player.researches[187]
  b *= 1 + (0.01 / 100) * player.researches[200]
  b *= 1 + (0.01 / 100) * player.cubeUpgrades[50]
  b *= 1 + (1 / 1000) * hepteractEffective('acceleratorBoost')
  if (
    player.upgrades[73] > 0.5
    && player.currentChallenge.reincarnation !== 0
  ) {
    b *= 2
  }
  b = Math.min(1e100, Math.floor(b))
  G.freeAcceleratorBoost = b

  G.totalAcceleratorBoost = (Math.floor(player.acceleratorBoostBought + G.freeAcceleratorBoost) * 100)
    / 100
}

export const calculateAcceleratorMultiplier = () => {
  G.acceleratorMultiplier = 1
  G.acceleratorMultiplier *= 1 + player.achievements[60] / 100
  G.acceleratorMultiplier *= 1 + player.achievements[61] / 100
  G.acceleratorMultiplier *= 1 + player.achievements[62] / 100
  G.acceleratorMultiplier *= 1
    + (1 / 5)
      * player.researches[1]
      * (1 + (1 / 2) * CalcECC('ascension', player.challengecompletions[14]))
  G.acceleratorMultiplier *= 1
    + (1 / 20) * player.researches[6]
    + (1 / 25) * player.researches[7]
    + (1 / 40) * player.researches[8]
    + (3 / 200) * player.researches[9]
    + (1 / 200) * player.researches[10]
  G.acceleratorMultiplier *= 1 + (1 / 20) * player.researches[86]
  G.acceleratorMultiplier *= 1 + (1 / 100) * player.researches[126]
  G.acceleratorMultiplier *= 1 + (0.8 / 100) * player.researches[141]
  G.acceleratorMultiplier *= 1 + (0.6 / 100) * player.researches[156]
  G.acceleratorMultiplier *= 1 + (0.4 / 100) * player.researches[171]
  G.acceleratorMultiplier *= 1 + (0.2 / 100) * player.researches[186]
  G.acceleratorMultiplier *= 1 + (0.01 / 100) * player.researches[200]
  G.acceleratorMultiplier *= 1 + (0.01 / 100) * player.cubeUpgrades[50]
  G.acceleratorMultiplier *= Math.pow(
    1.01,
    player.upgrades[21]
      + player.upgrades[22]
      + player.upgrades[23]
      + player.upgrades[24]
      + player.upgrades[25]
  )
  if (
    (player.currentChallenge.transcension !== 0
      || player.currentChallenge.reincarnation !== 0)
    && player.upgrades[50] > 0.5
  ) {
    G.acceleratorMultiplier *= 1.25
  }
}

export const calculateRecycleMultiplier = () => {
  // Factors where recycle bonus comes from
  const recycleFactors = sumContents([
    0.05 * player.achievements[80],
    0.05 * player.achievements[87],
    0.05 * player.achievements[94],
    0.05 * player.achievements[101],
    0.05 * player.achievements[108],
    0.05 * player.achievements[115],
    0.075 * player.achievements[122],
    0.075 * player.achievements[129],
    0.05 * player.upgrades[61],
    0.25 * Math.min(1, G.rune4level / 400),
    0.005 * player.cubeUpgrades[2]
  ])

  return 1 / (1 - recycleFactors)
}

export function calculateRuneExpGiven (
  runeIndex: number,
  all: boolean,
  runeLevel: number,
  returnFactors: true
): number[]
export function calculateRuneExpGiven (
  runeIndex: number,
  all: boolean,
  runeLevel?: number,
  returnFactors?: false
): number
export function calculateRuneExpGiven (
  runeIndex: number,
  all = false,
  runeLevel = player.runelevels[runeIndex],
  returnFactors = false
) {
  // recycleMult accounted for all recycle chance, but inversed so it's a multiplier instead
  const recycleMultiplier = calculateRecycleMultiplier()

  // Rune multiplier that is summed instead of added
  let allRuneExpAdditiveMultiplier: number | null = null
  if (all) {
    allRuneExpAdditiveMultiplier = sumContents([
      // Challenge 3 completions
      (1 / 100) * player.highestchallengecompletions[3],
      // Reincarnation 2x1
      1 * player.upgrades[66]
    ])
  } else {
    allRuneExpAdditiveMultiplier = sumContents([
      // Base amount multiplied per offering
      1,
      // +1 if C1 completion
      Math.min(1, player.highestchallengecompletions[1]),
      // +0.10 per C1 completion
      (0.4 / 10) * player.highestchallengecompletions[1],
      // Research 5x2
      0.6 * player.researches[22],
      // Research 5x3
      0.3 * player.researches[23],
      // Particle Upgrade 1x1
      2 * player.upgrades[61],
      // Particle upgrade 3x1
      (player.upgrades[71] * runeLevel) / 25
    ])
  }

  // Rune multiplier that gets applied to all runes
  const allRuneExpMultiplier = productContents([
    // Research 4x16
    1 + player.researches[91] / 20,
    // Research 4x17
    1 + player.researches[92] / 20,
    // Ant 8
    calculateSigmoidExponential(
      999,
      (1 / 10000) * Math.pow(player.antUpgrades[8 - 1]! + G.bonusant8, 1.1)
    ),
    // Cube Bonus
    G.cubeBonusMultiplier[4],
    // Cube Upgrade Bonus
    1 + (player.ascensionCounter / 1000) * player.cubeUpgrades[32],
    // Constant Upgrade Multiplier
    1 + (1 / 10) * player.constantUpgrades[8],
    // Challenge 15 reward multiplier
    G.challenge15Rewards.runeExp.value
  ])
  // Corruption Divisor
  const droughtEffect = 1
    / Math.pow(
      G.droughtMultiplier[player.corruptions.used.drought],
      1 - (1 / 2) * player.platonicUpgrades[13]
    )

  // Rune multiplier that gets applied to specific runes
  const runeExpMultiplier = [
    productContents([
      1 + player.researches[78] / 50,
      1 + player.researches[111] / 100,
      1 + CalcECC('reincarnation', player.challengecompletions[7]) / 10,
      droughtEffect
    ]),
    productContents([
      1 + player.researches[80] / 50,
      1 + player.researches[112] / 100,
      1 + CalcECC('reincarnation', player.challengecompletions[7]) / 10,
      droughtEffect
    ]),
    productContents([
      1 + player.researches[79] / 50,
      1 + player.researches[113] / 100,
      1 + CalcECC('reincarnation', player.challengecompletions[8]) / 5,
      droughtEffect
    ]),
    productContents([
      1 + player.researches[77] / 50,
      1 + player.researches[114] / 100,
      1 + CalcECC('reincarnation', player.challengecompletions[6]) / 10,
      droughtEffect
    ]),
    productContents([
      1 + player.researches[83] / 20,
      1 + player.researches[115] / 100,
      1 + CalcECC('reincarnation', player.challengecompletions[9]) / 5,
      droughtEffect
    ]),
    productContents([1]),
    productContents([1])
  ]

  const fact = [
    allRuneExpAdditiveMultiplier,
    allRuneExpMultiplier,
    recycleMultiplier,
    runeExpMultiplier[runeIndex]
  ]

  return returnFactors ? fact : Math.min(1e200, productContents(fact))
}

export const lookupTableGen = (runeLevel: number) => {
  // Rune exp required to level multipliers
  const allRuneExpRequiredMultiplier = productContents([
    Math.pow((runeLevel + 1) / 2, 3),
    (3.5 * runeLevel + 100) / 500,
    Math.max(1, (runeLevel - 200) / 9),
    Math.max(1, (runeLevel - 400) / 12),
    Math.max(1, (runeLevel - 600) / 15),
    Math.max(1, Math.pow(1.03, (runeLevel - 800) / 4))
  ])

  return allRuneExpRequiredMultiplier
}

let lookupTableRuneExp: number[] | null = null

// Returns the amount of exp required to level a rune
export const calculateRuneExpToLevel = (
  runeIndex: number,
  runeLevel = player.runelevels[runeIndex]
) => {
  lookupTableRuneExp ??= Array.from({ length: 40000 + 1 }, (_, i) => lookupTableGen(i))

  // For runes 6 and 7 we will apply a special multiplier
  let multiplier = lookupTableRuneExp[runeLevel]
  if (runeIndex === 5) {
    multiplier = Math.pow(100, runeLevel)
  }
  if (runeIndex === 6) {
    multiplier = Math.pow(1e25, runeLevel) * (player.highestSingularityCount + 1)
  }
  return multiplier * G.runeexpbase[runeIndex]
}

export const calculateMaxRunes = (i: number) => {
  let max = 1000

  const increaseAll = 20 * (player.cubeUpgrades[16] + player.cubeUpgrades[37])
    + 3 * player.constantUpgrades[7]
    + 80 * CalcECC('ascension', player.challengecompletions[11])
    + 200 * CalcECC('ascension', player.challengecompletions[14])
    + Math.floor(0.04 * player.researches[200] + 0.04 * player.cubeUpgrades[50])
  const increaseMaxLevel = [
    null,
    10 * (player.researches[78] + player.researches[111]) + increaseAll,
    10 * (player.researches[80] + player.researches[112]) + increaseAll,
    10 * (player.researches[79] + player.researches[113]) + increaseAll,
    10 * (player.researches[77] + player.researches[114]) + increaseAll,
    10 * player.researches[115] + increaseAll,
    -901,
    -999
  ]

  max = increaseMaxLevel[i]! > G.runeMaxLvl
    ? G.runeMaxLvl
    : max + increaseMaxLevel[i]!
  return max
}

export const calculateEffectiveIALevel = () => {
  let bonus = PCoinUpgradeEffects.INSTANT_UNLOCK_2 ? 6 : 0
  bonus += player.cubeUpgrades[73]
  bonus += player.campaigns.bonusRune6
  const totalRawLevel = player.runelevels[5] + bonus
  return (
    totalRawLevel
    + Math.max(0, totalRawLevel - 74)
    + Math.max(0, totalRawLevel - 98)
  )
}

// TODO: REFACTOR THIS - May 15, 2022.
export const calculateTalismanEffects = () => {
  let positiveBonus = 0
  let negativeBonus = 0
  if (player.achievements[135] === 1) {
    positiveBonus += 0.02
  }
  if (player.achievements[136] === 1) {
    positiveBonus += 0.02
  }
  positiveBonus += 0.02 * (player.talismanRarity[4 - 1] - 1)
  positiveBonus += (3 * player.researches[106]) / 100
  positiveBonus += (3 * player.researches[107]) / 100
  positiveBonus += (3 * player.researches[116]) / 200
  positiveBonus += (3 * player.researches[117]) / 200
  positiveBonus += G.cubeBonusMultiplier[9] - 1
  positiveBonus += 0.0004 * player.cubeUpgrades[50]
  negativeBonus += 0.06 * player.researches[118]
  negativeBonus += 0.0004 * player.cubeUpgrades[50]

  if (player.highestSingularityCount >= 7) {
    positiveBonus += negativeBonus
    negativeBonus = positiveBonus
  }

  if (player.highestSingularityCount < 7) {
    for (let i = 1; i <= 5; i++) {
      if (player.talismanOne[i] === 1) {
        G.talisman1Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[1 - 1]]!
          + positiveBonus)
          * player.talismanLevels[1 - 1]
          * G.challenge15Rewards.talismanBonus.value
      } else {
        G.talisman1Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[1 - 1]]!
          - negativeBonus)
          * player.talismanLevels[1 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus.value
      }

      if (player.talismanTwo[i] === 1) {
        G.talisman2Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[2 - 1]]!
          + positiveBonus)
          * player.talismanLevels[2 - 1]
          * G.challenge15Rewards.talismanBonus.value
      } else {
        G.talisman2Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[2 - 1]]!
          - negativeBonus)
          * player.talismanLevels[2 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus.value
      }

      if (player.talismanThree[i] === 1) {
        G.talisman3Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[3 - 1]]!
          + positiveBonus)
          * player.talismanLevels[3 - 1]
          * G.challenge15Rewards.talismanBonus.value
      } else {
        G.talisman3Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[3 - 1]]!
          - negativeBonus)
          * player.talismanLevels[3 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus.value
      }

      if (player.talismanFour[i] === 1) {
        G.talisman4Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[4 - 1]]!
          + positiveBonus)
          * player.talismanLevels[4 - 1]
          * G.challenge15Rewards.talismanBonus.value
      } else {
        G.talisman4Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[4 - 1]]!
          - negativeBonus)
          * player.talismanLevels[4 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus.value
      }

      if (player.talismanFive[i] === 1) {
        G.talisman5Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[5 - 1]]!
          + positiveBonus)
          * player.talismanLevels[5 - 1]
          * G.challenge15Rewards.talismanBonus.value
      } else {
        G.talisman5Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[5 - 1]]!
          - negativeBonus)
          * player.talismanLevels[5 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus.value
      }

      if (player.talismanSix[i] === 1) {
        G.talisman6Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[6 - 1]]!
          + positiveBonus)
          * player.talismanLevels[6 - 1]
          * G.challenge15Rewards.talismanBonus.value
      } else {
        G.talisman6Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[6 - 1]]!
          - negativeBonus)
          * player.talismanLevels[6 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus.value
      }

      if (player.talismanSeven[i] === 1) {
        G.talisman7Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[7 - 1]]!
          + positiveBonus)
          * player.talismanLevels[7 - 1]
          * G.challenge15Rewards.talismanBonus.value
      } else {
        G.talisman7Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[7 - 1]]!
          - negativeBonus)
          * player.talismanLevels[7 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus.value
      }
    }
  } else {
    for (let i = 1; i <= 5; i++) {
      G.talisman1Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[1 - 1]]!
        + positiveBonus)
        * player.talismanLevels[1 - 1]
        * G.challenge15Rewards.talismanBonus.value
      G.talisman2Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[2 - 1]]!
        + positiveBonus)
        * player.talismanLevels[2 - 1]
        * G.challenge15Rewards.talismanBonus.value
      G.talisman3Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[3 - 1]]!
        + positiveBonus)
        * player.talismanLevels[3 - 1]
        * G.challenge15Rewards.talismanBonus.value
      G.talisman4Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[4 - 1]]!
        + positiveBonus)
        * player.talismanLevels[4 - 1]
        * G.challenge15Rewards.talismanBonus.value
      G.talisman5Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[5 - 1]]!
        + positiveBonus)
        * player.talismanLevels[5 - 1]
        * G.challenge15Rewards.talismanBonus.value
      G.talisman6Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[6 - 1]]!
        + positiveBonus)
        * player.talismanLevels[6 - 1]
        * G.challenge15Rewards.talismanBonus.value
      G.talisman7Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[7 - 1]]!
        + positiveBonus)
        * player.talismanLevels[7 - 1]
        * G.challenge15Rewards.talismanBonus.value
    }
  }
  const talismansEffects = [
    G.talisman1Effect,
    G.talisman2Effect,
    G.talisman3Effect,
    G.talisman4Effect,
    G.talisman5Effect,
    G.talisman6Effect,
    G.talisman7Effect
  ]
  const runesTalisman = [0, 0, 0, 0, 0, 0]
  talismansEffects.forEach((talismanEffect) => {
    talismanEffect.forEach((levels, runeNumber) => {
      runesTalisman[runeNumber] += levels!
    })
  })
  ;[
    ,
    G.rune1Talisman,
    G.rune2Talisman,
    G.rune3Talisman,
    G.rune4Talisman,
    G.rune5Talisman
  ] = runesTalisman
  G.talisman6Power = 0
  G.talisman7Quarks = 0
  if (player.talismanRarity[1 - 1] === 6) {
    G.rune2Talisman += 400
  }
  if (player.talismanRarity[2 - 1] === 6) {
    G.rune1Talisman += 400
  }
  if (player.talismanRarity[3 - 1] === 6) {
    G.rune4Talisman += 400
  }
  if (player.talismanRarity[4 - 1] === 6) {
    G.rune3Talisman += 400
  }
  if (player.talismanRarity[5 - 1] === 6) {
    G.rune5Talisman += 400
  }
  if (player.talismanRarity[6 - 1] === 6) {
    G.talisman6Power = 2.5
  }
  if (player.talismanRarity[7 - 1] === 6) {
    G.talisman7Quarks = 2
  }
}

export const calculateRuneLevels = () => {
  calculateTalismanEffects()
  if (player.currentChallenge.reincarnation !== 9) {
    const antUpgrade8 = player.antUpgrades[8] ?? 0
    G.rune1level = Math.max(
      1,
      player.runelevels[0]
        + Math.min(1e7, antUpgrade8 + G.bonusant9) * 1
        + G.rune1Talisman
        + 7 * player.constantUpgrades[7]
    )
    G.rune2level = Math.max(
      1,
      player.runelevels[1]
        + Math.min(1e7, antUpgrade8 + G.bonusant9) * 1
        + G.rune2Talisman
        + 7 * player.constantUpgrades[7]
    )
    G.rune3level = Math.max(
      1,
      player.runelevels[2]
        + Math.min(1e7, antUpgrade8 + G.bonusant9) * 1
        + G.rune3Talisman
        + 7 * player.constantUpgrades[7]
    )
    G.rune4level = Math.max(
      1,
      player.runelevels[3]
        + Math.min(1e7, antUpgrade8 + G.bonusant9) * 1
        + G.rune4Talisman
        + 7 * player.constantUpgrades[7]
    )
    G.rune5level = Math.max(
      1,
      player.runelevels[4]
        + Math.min(1e7, antUpgrade8 + G.bonusant9) * 1
        + G.rune5Talisman
        + 7 * player.constantUpgrades[7]
    )
  }

  G.runeSum = sumContents([
    G.rune1level,
    G.rune2level,
    G.rune3level,
    G.rune4level,
    G.rune5level
  ])
  calculateRuneBonuses()
}

export const calculateRuneBonuses = () => {
  G.blessingMultiplier = 1
  G.spiritMultiplier = 1

  G.blessingMultiplier *= 1 + (6.9 * player.researches[134]) / 100
  G.blessingMultiplier *= 1 + (player.talismanRarity[3 - 1] - 1) / 10
  G.blessingMultiplier *= 1 + 0.1 * Math.log10(player.epicFragments + 1) * player.researches[174]
  G.blessingMultiplier *= 1 + (2 * player.researches[194]) / 100
  if (player.researches[160] > 0) {
    G.blessingMultiplier *= Math.pow(1.25, 8)
  }
  G.spiritMultiplier *= 1 + (8 * player.researches[164]) / 100
  if (player.researches[165] > 0 && player.currentChallenge.ascension !== 0) {
    G.spiritMultiplier *= Math.pow(2, 8)
  }
  G.spiritMultiplier *= 1
    + 0.15 * Math.log10(player.legendaryFragments + 1) * player.researches[189]
  G.spiritMultiplier *= 1 + (2 * player.researches[194]) / 100
  G.spiritMultiplier *= 1 + (player.talismanRarity[5 - 1] - 1) / 100

  for (let i = 1; i <= 5; i++) {
    G.runeBlessings[i] = G.blessingMultiplier
      * player.runelevels[i - 1]
      * player.runeBlessingLevels[i]
    G.runeSpirits[i] = G.spiritMultiplier
      * player.runelevels[i - 1]
      * player.runeSpiritLevels[i]
  }

  for (let i = 1; i <= 5; i++) {
    if (G.runeBlessings[i] <= 1e30) {
      G.effectiveRuneBlessingPower[i] = (Math.pow(G.runeBlessings[i], 1 / 8) / 75)
        * G.challenge15Rewards.blessingBonus.value
    } else if (G.runeBlessings[i] > 1e30) {
      G.effectiveRuneBlessingPower[i] = ((Math.pow(10, 5 / 2) * Math.pow(G.runeBlessings[i], 1 / 24)) / 75)
        * G.challenge15Rewards.blessingBonus.value
    }

    if (G.runeSpirits[i] <= 1e25) {
      G.effectiveRuneSpiritPower[i] = (Math.pow(G.runeSpirits[i], 1 / 8) / 75)
        * G.challenge15Rewards.spiritBonus.value
    } else if (G.runeSpirits[i] > 1e25) {
      G.effectiveRuneSpiritPower[i] = ((Math.pow(10, 25 / 12) * Math.pow(G.runeSpirits[i], 1 / 24)) / 75)
        * G.challenge15Rewards.spiritBonus.value
    }
  }
}

export const calculateAnts = () => {
  let bonusLevels = 0
  bonusLevels += 2 * (player.talismanRarity[6 - 1] - 1)
  bonusLevels += CalcECC('reincarnation', player.challengecompletions[9])
  bonusLevels += 2 * player.constantUpgrades[6]
  bonusLevels += 12 * CalcECC('ascension', player.challengecompletions[11])
  bonusLevels += Math.floor((1 / 200) * player.researches[200])
  bonusLevels *= G.challenge15Rewards.bonusAntLevel.value
  let c11 = 0
  let c11bonus = 0
  if (player.currentChallenge.ascension === 11) {
    c11 = 999
  }
  if (player.currentChallenge.ascension === 11) {
    c11bonus = Math.floor(
      (4 * player.challengecompletions[8]
        + 23 * player.challengecompletions[9])
        * Math.max(0, 1 - player.challengecompletions[11] / 10)
    )
  }
  G.bonusant1 = Math.min(
    player.antUpgrades[1 - 1]! + c11,
    4 * player.researches[97]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant2 = Math.min(
    player.antUpgrades[2 - 1]! + c11,
    4 * player.researches[97]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant3 = Math.min(
    player.antUpgrades[3 - 1]! + c11,
    4 * player.researches[97]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant4 = Math.min(
    player.antUpgrades[4 - 1]! + c11,
    4 * player.researches[97]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant5 = Math.min(
    player.antUpgrades[5 - 1]! + c11,
    4 * player.researches[97]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant6 = Math.min(
    player.antUpgrades[6 - 1]! + c11,
    4 * player.researches[97]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant7 = Math.min(
    player.antUpgrades[7 - 1]! + c11,
    4 * player.researches[98]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant8 = Math.min(
    player.antUpgrades[8 - 1]! + c11,
    4 * player.researches[98]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant9 = Math.min(
    player.antUpgrades[9 - 1]! + c11,
    4 * player.researches[98]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant10 = Math.min(
    player.antUpgrades[10 - 1]! + c11,
    4 * player.researches[98]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant11 = Math.min(
    player.antUpgrades[11 - 1]! + c11,
    4 * player.researches[98]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
  G.bonusant12 = Math.min(
    player.antUpgrades[12 - 1]! + c11,
    4 * player.researches[98]
      + bonusLevels
      + player.researches[102]
      + 2 * player.researches[132]
      + c11bonus
  )
}

export const calculateAntSacrificeELO = () => {
  G.antELO = 0
  G.effectiveELO = 0
  const antUpgradeSum = sumContents(player.antUpgrades as number[])
  if (player.antPoints.gte('1e40')) {
    G.antELO += Decimal.log(player.antPoints, 10)
    G.antELO += (1 / 2) * antUpgradeSum
    G.antELO += (1 / 10) * player.firstOwnedAnts
    G.antELO += (1 / 5) * player.secondOwnedAnts
    G.antELO += (1 / 3) * player.thirdOwnedAnts
    G.antELO += (1 / 2) * player.fourthOwnedAnts
    G.antELO += player.fifthOwnedAnts
    G.antELO += 2 * player.sixthOwnedAnts
    G.antELO += 4 * player.seventhOwnedAnts
    G.antELO += 8 * player.eighthOwnedAnts
    G.antELO += 666 * player.researches[178]
    G.antELO *= 1
      + 0.01 * player.achievements[180]
      + 0.02 * player.achievements[181]
      + 0.03 * player.achievements[182]
    G.antELO *= 1 + player.researches[110] / 100
    G.antELO *= 1 + (2.5 * player.researches[148]) / 100

    if (player.achievements[176] === 1) {
      G.antELO += 25
    }
    if (player.achievements[177] === 1) {
      G.antELO += 50
    }
    if (player.achievements[178] === 1) {
      G.antELO += 75
    }
    if (player.achievements[179] === 1) {
      G.antELO += 100
    }
    G.antELO += 25 * player.researches[108]
    G.antELO += 25 * player.researches[109]
    G.antELO += 40 * player.researches[123]
    G.antELO += 100 * CalcECC('reincarnation', player.challengecompletions[10])
    G.antELO += 75 * player.upgrades[80]
    G.antELO = (1 / 10) * Math.floor(10 * G.antELO)

    G.effectiveELO += 0.5 * Math.min(3500, G.antELO)
    G.effectiveELO += 0.1 * Math.min(4000, G.antELO)
    G.effectiveELO += 0.1 * Math.min(6000, G.antELO)
    G.effectiveELO += 0.1 * Math.min(10000, G.antELO)
    G.effectiveELO += 0.2 * G.antELO
    G.effectiveELO += G.cubeBonusMultiplier[8] - 1
    G.effectiveELO += 1 * player.cubeUpgrades[50]
    G.effectiveELO *= 1 + 0.03 * player.upgrades[124]
  }
}

export const calculateAntSacrificeMultipliers = () => {
  G.timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 10, 2))
  if (player.achievements[177] === 0) {
    G.timeMultiplier *= Math.min(
      1000,
      Math.max(1, player.antSacrificeTimer / 10)
    )
  }
  if (player.achievements[177] > 0) {
    G.timeMultiplier *= Math.max(1, player.antSacrificeTimer / 10)
  }
  G.timeMultiplier *= player.singularityUpgrades.halfMind.getEffect().bonus ? calculateGlobalSpeedMult() / 10 : 1

  G.upgradeMultiplier = 1
  G.upgradeMultiplier *= 1
    + 2 * (1 - Math.pow(2, -(player.antUpgrades[11 - 1]! + G.bonusant11) / 125))
  G.upgradeMultiplier *= 1 + player.researches[103] / 20
  G.upgradeMultiplier *= 1 + player.researches[104] / 20
  if (player.achievements[132] === 1) {
    G.upgradeMultiplier *= 1.25
  }
  if (player.achievements[137] === 1) {
    G.upgradeMultiplier *= 1.25
  }
  G.upgradeMultiplier *= 1 + (20 / 3) * G.effectiveRuneBlessingPower[3]
  G.upgradeMultiplier *= 1 + (1 / 50) * CalcECC('reincarnation', player.challengecompletions[10])
  G.upgradeMultiplier *= 1 + (1 / 50) * player.researches[122]
  G.upgradeMultiplier *= 1 + (3 / 100) * player.researches[133]
  G.upgradeMultiplier *= 1 + (2 / 100) * player.researches[163]
  G.upgradeMultiplier *= 1 + (1 / 100) * player.researches[193]
  G.upgradeMultiplier *= 1 + (1 / 10) * player.upgrades[79]
  G.upgradeMultiplier *= 1 + (1 / 4) * player.upgrades[40]
  G.upgradeMultiplier *= G.cubeBonusMultiplier[7]
  G.upgradeMultiplier *= 1 + calculateEventBuff(BuffType.AntSacrifice)
  G.upgradeMultiplier = Math.min(1e300, G.upgradeMultiplier)
  return G.upgradeMultiplier
}

interface IAntSacRewards {
  antSacrificePoints: number
  offerings: number
  obtainium: number
  talismanShards: number
  commonFragments: number
  uncommonFragments: number
  rareFragments: number
  epicFragments: number
  legendaryFragments: number
  mythicalFragments: number
}

export const calculateAntSacrificeRewards = (): IAntSacRewards => {
  calculateAntSacrificeELO()
  calculateAntSacrificeMultipliers()

  const halfMindModifier = player.singularityUpgrades.halfMind.getEffect().bonus
    ? calculateGlobalSpeedMult() / 10
    : 1

  const maxCap = 1e300
  const rewardsMult = Math.min(maxCap, G.timeMultiplier * G.upgradeMultiplier * halfMindModifier)
  const rewards: IAntSacRewards = {
    antSacrificePoints: Math.min(maxCap, (G.effectiveELO * rewardsMult) / 85),
    offerings: Math.min(
      maxCap,
      calculateAntSacrificeOffering()
    ),
    obtainium: Math.min(
      maxCap,
      calculateAntSacrificeObtainium()
    ),
    talismanShards: G.antELO > 500
      ? Math.min(
        maxCap,
        Math.max(
          1,
          Math.floor(
            (rewardsMult / 210)
              * Math.pow((1 / 4) * Math.max(0, G.effectiveELO - 500), 2)
          )
        )
      )
      : 0,
    commonFragments: G.antELO > 750
      ? Math.min(
        maxCap,
        Math.max(
          1,
          Math.floor(
            (rewardsMult / 110)
              * Math.pow((1 / 9) * Math.max(0, G.effectiveELO - 750), 1.83)
          )
        )
      )
      : 0,
    uncommonFragments: G.antELO > 1000
      ? Math.min(
        maxCap,
        Math.max(
          1,
          Math.floor(
            (rewardsMult / 170)
              * Math.pow((1 / 16) * Math.max(0, G.effectiveELO - 1000), 1.66)
          )
        )
      )
      : 0,
    rareFragments: G.antELO > 1500
      ? Math.min(
        maxCap,
        Math.max(
          1,
          Math.floor(
            (rewardsMult / 200)
              * Math.pow((1 / 25) * Math.max(0, G.effectiveELO - 1500), 1.5)
          )
        )
      )
      : 0,
    epicFragments: G.antELO > 2000
      ? Math.min(
        maxCap,
        Math.max(
          1,
          Math.floor(
            (rewardsMult / 200)
              * Math.pow((1 / 36) * Math.max(0, G.effectiveELO - 2000), 1.33)
          )
        )
      )
      : 0,
    legendaryFragments: G.antELO > 3000
      ? Math.min(
        maxCap,
        Math.max(
          1,
          Math.floor(
            (rewardsMult / 230)
              * Math.pow((1 / 49) * Math.max(0, G.effectiveELO - 3000), 1.16)
          )
        )
      )
      : 0,
    mythicalFragments: G.antELO > 5000
      ? Math.min(
        maxCap,
        Math.max(
          1,
          Math.floor(
            (rewardsMult / 220)
              * Math.pow((1 / 64) * Math.max(0, G.effectiveELO - 4150), 1)
          )
        )
      )
      : 0
  }

  return rewards
}

export const timeWarp = async () => {
  const time = await Prompt(i18next.t('calculate.timePrompt'))
  const timeUse = Number(time)
  if (Number.isNaN(timeUse) || timeUse <= 0) {
    return Alert(i18next.t('calculate.timePromptError'))
  }

  DOMCacheGetOrSet('offlineContainer').style.display = 'flex'
  DOMCacheGetOrSet('offlineBlur').style.display = ''
  calculateOffline(timeUse)
}

/**
 * @param forceTime The number of SECONDS to warp. Why the fuck is it in seconds?
 */
export const calculateOffline = (forceTime = 0, fromTips = false) => {
  disableHotkeys()

  G.timeWarp = true

  // Variable Declarations i guess
  const maximumTimer = !fromTips
    ? (86400 * 3
      + 7200 * 2 * player.researches[31]
      + 7200 * 2 * player.researches[32])
      * PCoinUpgradeEffects.OFFLINE_TIMER_CAP_BUFF
    : 1e100 // If someone exceeds this, we will be very rich aha!

  const updatedTime = Date.now()
  const timeAdd = Math.min(
    maximumTimer,
    Math.max(forceTime, (updatedTime - player.offlinetick) / 1000)
  )
  const timeTick = timeAdd / 200
  let resourceTicks = 200

  DOMCacheGetOrSet('offlineTimer').textContent = i18next.t(
    'calculate.offlineTimer',
    { value: format(timeAdd, 0) }
  )

  // May 11, 2021: I've revamped calculations for this significantly. Note to May 11 Platonic: Fuck off -May 15 Platonic
  // Some one-time tick things that are relatively important
  toggleTalismanBuy(player.buyTalismanShardPercent)
  updateTalismanInventory()

  const offlineDialog = player.offlinetick > 0

  player.offlinetick = player.offlinetick < 1.5e12 ? Date.now() : player.offlinetick

  G.timeMultiplier = calculateGlobalSpeedMult()
  const obtainiumGain = calculateResearchAutomaticObtainium(timeAdd)

  const resetAdd = {
    prestige: timeAdd / Math.max(0.01, player.fastestprestige),
    offering: Math.floor(timeAdd),
    transcension: timeAdd / Math.max(0.01, player.fastesttranscend),
    reincarnation: timeAdd / Math.max(0.01, player.fastestreincarnate),
    obtainium: timeAdd * obtainiumGain * G.timeMultiplier
  }

  const timerAdd = {
    prestige: timeAdd * G.timeMultiplier,
    transcension: timeAdd * G.timeMultiplier,
    reincarnation: timeAdd * G.timeMultiplier,
    ants: timeAdd * G.timeMultiplier,
    antsReal: timeAdd,
    ascension: player.ascensionCounter, // Calculate this after the fact
    quarks: quarkHandler().gain, // Calculate this after the fact
    ambrosia: player.lifetimeAmbrosia,
    redAmbrosia: player.lifetimeRedAmbrosia,
    ambrosiaPoints: timeAdd * calculateAmbrosiaGenerationSpeed(),
    redAmbrosiaPoints: timeAdd * calculateRedAmbrosiaGenerationSpeed()
  }

  addTimers('ascension', timeAdd)
  addTimers('quarks', timeAdd)
  addTimers('goldenQuarks', timeAdd)
  addTimers('singularity', timeAdd)
  addTimers('octeracts', timeTick)
  addTimers('ambrosia', timeAdd)
  addTimers('redAmbrosia', timeAdd)

  player.prestigeCount += resetAdd.prestige
  player.transcendCount += resetAdd.transcension
  player.reincarnationCount += resetAdd.reincarnation
  timerAdd.ascension = player.ascensionCounter - timerAdd.ascension
  timerAdd.quarks = quarkHandler().gain - timerAdd.quarks
  timerAdd.ambrosia = player.lifetimeAmbrosia - timerAdd.ambrosia
  timerAdd.redAmbrosia = player.lifetimeRedAmbrosia - timerAdd.redAmbrosia

  // 200 simulated all ticks [July 12, 2021]
  const runOffline = setInterval(() => {
    G.timeMultiplier = calculateGlobalSpeedMult()
    calculateObtainium()

    // Reset Stuff lmao!
    addTimers('prestige', timeTick)
    addTimers('transcension', timeTick)
    addTimers('reincarnation', timeTick)
    addTimers('octeracts', timeTick)

    resourceGain(timeTick * G.timeMultiplier)

    // Auto Obtainium Stuff
    if (player.researches[61] > 0 && player.currentChallenge.ascension !== 14) {
      automaticTools('addObtainium', timeTick)
    }

    // Auto Ant Sacrifice Stuff
    if (player.achievements[173] > 0) {
      automaticTools('antSacrifice', timeTick)
    }

    // Auto Offerings
    automaticTools('addOfferings', timeTick)
    // Auto Rune Sacrifice Stuff
    if (player.shopUpgrades.offeringAuto > 0 && player.autoSacrificeToggle) {
      automaticTools('runeSacrifice', timeTick)
    }

    if (resourceTicks % 5 === 1) {
      // 196, 191, ... , 6, 1 ticks remaining
      updateAll()
    }

    resourceTicks -= 1
    // Misc functions
    if (resourceTicks < 1) {
      clearInterval(runOffline)
      G.timeWarp = false
    }
  }, 0)

  DOMCacheGetOrSet('offlinePrestigeCount').innerHTML = i18next.t(
    'offlineProgress.prestigeCount',
    {
      value: format(resetAdd.prestige, 0, true)
    }
  )
  DOMCacheGetOrSet('offlinePrestigeTimer').innerHTML = i18next.t(
    'offlineProgress.currentPrestigeTimer',
    {
      value: format(timerAdd.prestige, 2, false)
    }
  )
  DOMCacheGetOrSet('offlineOfferingCount').innerHTML = i18next.t(
    'offlineProgress.offeringsGenerated',
    {
      value: format(resetAdd.offering, 0, true)
    }
  )
  DOMCacheGetOrSet('offlineTranscensionCount').innerHTML = i18next.t(
    'offlineProgress.transcensionCount',
    {
      value: format(resetAdd.transcension, 0, true)
    }
  )
  DOMCacheGetOrSet('offlineTranscensionTimer').innerHTML = i18next.t(
    'offlineProgress.currentTranscensionCounter',
    {
      value: format(timerAdd.transcension, 2, false)
    }
  )
  DOMCacheGetOrSet('offlineReincarnationCount').innerHTML = i18next.t(
    'offlineProgress.reincarnationCount',
    {
      value: format(resetAdd.reincarnation, 0, true)
    }
  )
  DOMCacheGetOrSet('offlineReincarnationTimer').innerHTML = i18next.t(
    'offlineProgress.currentReincarnationTimer',
    {
      value: format(timerAdd.reincarnation, 2, false)
    }
  )
  DOMCacheGetOrSet('offlineObtainiumCount').innerHTML = i18next.t(
    'offlineProgress.obtainiumGenerated',
    {
      value: format(resetAdd.obtainium, 0, true)
    }
  )
  DOMCacheGetOrSet('offlineAntTimer').innerHTML = i18next.t(
    'offlineProgress.ingameAntSacTimer',
    {
      value: format(timerAdd.ants, 2, false)
    }
  )
  DOMCacheGetOrSet('offlineRealAntTimer').innerHTML = i18next.t(
    'offlineProgress.realAntSacTimer',
    {
      value: format(timerAdd.antsReal, 2, true)
    }
  )
  DOMCacheGetOrSet('offlineAscensionTimer').innerHTML = i18next.t(
    'offlineProgress.currentAscensionTimer',
    {
      value: format(timerAdd.ascension, 2, true)
    }
  )
  DOMCacheGetOrSet('offlineQuarkCount').innerHTML = i18next.t(
    'offlineProgress.exportQuarks',
    {
      value: format(timerAdd.quarks, 0, true)
    }
  )
  DOMCacheGetOrSet('offlineAmbrosiaCount').innerHTML = i18next.t(
    'offlineProgress.ambrosia',
    {
      value: format(timerAdd.ambrosia, 0, true),
      value2: format(timerAdd.ambrosiaPoints, 0, true)
    }
  )
  DOMCacheGetOrSet('offlineRedAmbrosiaCount').innerHTML = i18next.t(
    'offlineProgress.redAmbrosia',
    {
      value: format(timerAdd.redAmbrosia, 0, true),
      value2: format(timerAdd.redAmbrosiaPoints, 0, true)
    }
  )

  DOMCacheGetOrSet('progressbardescription').textContent = i18next.t(
    'calculate.offlineEarnings'
  )

  player.offlinetick = updatedTime
  if (!player.loadedNov13Vers) {
    if (
      player.challengecompletions[14] > 0
      || player.highestchallengecompletions[14] > 0
    ) {
      const ascCount = player.ascensionCount
      reset('ascensionChallenge')
      player.ascensionCount = ascCount + 1
    }
    player.loadedNov13Vers = true
  }

  saveSynergy()

  updateTalismanInventory()
  calculateObtainium()
  calculateAnts()
  calculateRuneLevels()

  // allow aesthetic offline progress
  if (offlineDialog) {
    const el = DOMCacheGetOrSet('notification')
    el.classList.add('slide-out')
    el.classList.remove('slide-in')
    document.body.classList.remove('scrollbar')
    document.body.classList.add('loading')
    DOMCacheGetOrSet('offlineContainer').style.display = 'flex'
    DOMCacheGetOrSet('transparentBG').style.display = 'block'
  } else {
    exitOffline()
  }
}

export const exitOffline = () => {
  document.body.classList.remove('loading')
  document.body.classList.add('scrollbar')
  DOMCacheGetOrSet('transparentBG').style.display = 'none'
  DOMCacheGetOrSet('offlineContainer').style.display = 'none'
  DOMCacheGetOrSet('offlineBlur').style.display = 'none'
  enableHotkeys()
}

export const calculateSigmoid = (
  constant: number,
  factor: number,
  divisor: number
) => {
  return 1 + (constant - 1) * (1 - Math.pow(2, -factor / divisor))
}

export const calculateSigmoidExponential = (
  constant: number,
  coefficient: number
) => {
  return 1 + (constant - 1) * (1 - Math.exp(-coefficient))
}

export const calculateCubeBlessings = () => {
  // The visual updates are handled in visualUpdateCubes()
  const cubeArray = [
    player.cubeBlessings.accelerator,
    player.cubeBlessings.multiplier,
    player.cubeBlessings.offering,
    player.cubeBlessings.runeExp,
    player.cubeBlessings.obtainium,
    player.cubeBlessings.antSpeed,
    player.cubeBlessings.antSacrifice,
    player.cubeBlessings.antELO,
    player.cubeBlessings.talismanBonus,
    player.cubeBlessings.globalSpeed
  ]
  const powerBonus = [
    player.cubeUpgrades[45] / 100,
    player.cubeUpgrades[35] / 100,
    player.cubeUpgrades[24] / 100,
    player.cubeUpgrades[14] / 100,
    player.cubeUpgrades[40] / 100,
    player.cubeUpgrades[22] / 40,
    player.cubeUpgrades[15] / 100,
    player.cubeUpgrades[25] / 100,
    player.cubeUpgrades[44] / 100,
    player.cubeUpgrades[34] / 100
  ]

  for (let i = 1; i <= 10; i++) {
    let power = 1
    let mult = 1
    if (cubeArray[i - 1] >= 1000) {
      power = G.blessingDRPower[i]!
      mult *= Math.pow(
        1000,
        (1 - G.blessingDRPower[i]!) * (1 + powerBonus[i - 1])
      )
    }
    if (i === 6) {
      power = 2.25
      mult = 1
    }

    G.cubeBonusMultiplier[i] = Math.min(
      1e300,
      1
        + mult
          * G.blessingbase[i]!
          * Math.pow(cubeArray[i - 1], power * (1 + powerBonus[i - 1]))
          * G.tesseractBonusMultiplier[i]!
    )
  }
  calculateRuneLevels()
  calculateAntSacrificeELO()
}

export const calculateTotalOcteractCubeBonus = () => {
  if (player.singularityChallenges.noOcteracts.enabled) {
    return 1
  }
  if (player.totalWowOcteracts < 1000) {
    const bonus = 1 + (2 / 1000) * player.totalWowOcteracts // At 1,000 returns 3
    return bonus > 1.00001 ? bonus : 1
  } else {
    const power = 2 + +player.singularityChallenges.noOcteracts.rewards.octeractPow
    return 3 * Math.pow(Math.log10(player.totalWowOcteracts) - 2, power) // At 1,000 returns 3
  }
}

export const calculateTotalOcteractQuarkBonus = () => {
  if (player.singularityChallenges.noOcteracts.enabled) {
    return 1
  }
  if (player.totalWowOcteracts < 1000) {
    const bonus = 1 + (0.2 / 1000) * player.totalWowOcteracts // At 1,000 returns 1.20
    return bonus > 1.00001 ? bonus : 1
  } else {
    return 1.1 + 0.1 * (Math.log10(player.totalWowOcteracts) - 2) // At 1,000 returns 1.20
  }
}

export const calculateTotalOcteractOfferingBonus = () => {
  if (!player.singularityChallenges.noOcteracts.rewards.offeringBonus) {
    return 1
  }
  return Math.pow(calculateTotalOcteractCubeBonus(), 1.25)
}

export const calculateTotalOcteractObtainiumBonus = () => {
  if (!player.singularityChallenges.noOcteracts.rewards.obtainiumBonus) {
    return 1
  }
  return Math.pow(calculateTotalOcteractCubeBonus(), 1.25)
}

export const calculateLimitedAscensionsDebuff = () => {
  if (!player.singularityChallenges.limitedAscensions.enabled) {
    return 1
  } else {
    let exponent = player.ascensionCount
      - Math.max(
        0,
        20 - player.singularityChallenges.limitedAscensions.completions
      )
    exponent = Math.max(0, exponent)
    return Math.pow(2, exponent)
  }
}

export const calculateSingularityQuarkMilestoneMultiplier = () => {
  let multiplier = 1
  // dprint-ignore
  const singThresholds = [
    5, 7, 10, 20, 35, 50, 65, 80, 90, 100, 121, 144, 150, 160, 166, 169, 170,
    175, 180, 190, 196, 200, 201, 202, 203, 204, 205, 210, 212, 214, 216, 218,
    220, 225, 250, 255, 260, 261, 262,
  ];
  for (const sing of singThresholds) {
    if (player.highestSingularityCount >= sing) {
      multiplier *= 1.05
    }
  }

  if (player.highestSingularityCount >= 200) {
    multiplier *= Math.pow((player.highestSingularityCount - 179) / 20, 2)
  }

  return multiplier
}

// If you want to sum from a baseline level i to the maximum buyable level n, what would the cost be and how many levels would you get?
export const calculateSummationLinear = (
  baseLevel: number,
  baseCost: number,
  resourceAvailable: number,
  differenceCap = 1e9
): [number, number] => {
  const subtractCost = (baseCost * baseLevel * (1 + baseLevel)) / 2
  const buyToLevel = Math.min(
    baseLevel + differenceCap,
    Math.floor(
      -1 / 2
        + Math.sqrt(1 / 4 + (2 * (resourceAvailable + subtractCost)) / baseCost)
    )
  )
  const realCost = (baseCost * buyToLevel * (1 + buyToLevel)) / 2 - subtractCost

  return [buyToLevel, realCost]
}

// If you want to sum from a baseline level baseLevel to some level where the cost per level is base * (1 + level * diffPerLevel), this finds out how many total levels you can buy.
export const calculateSummationNonLinear = (
  baseLevel: number,
  baseCost: number,
  resourceAvailable: number,
  diffPerLevel: number,
  buyAmount: number
): { levelCanBuy: number; cost: number } => {
  const c = diffPerLevel / 2
  resourceAvailable = resourceAvailable || 0
  const alreadySpent = baseCost * (c * Math.pow(baseLevel, 2) + baseLevel * (1 - c))
  resourceAvailable += alreadySpent
  const v = resourceAvailable / baseCost
  let buyToLevel = c > 0
    ? Math.max(
      0,
      Math.floor(
        (c - 1) / (2 * c)
          + Math.pow(Math.pow(1 - c, 2) + 4 * c * v, 1 / 2) / (2 * c)
      )
    )
    : Math.floor(v)

  buyToLevel = Math.min(buyToLevel, buyAmount + baseLevel)
  buyToLevel = Math.max(buyToLevel, baseLevel)
  let totalCost = baseCost * (c * Math.pow(buyToLevel, 2) + buyToLevel * (1 - c))
    - alreadySpent
  if (buyToLevel === baseLevel) {
    totalCost = baseCost * (1 + 2 * c * baseLevel)
  }
  return {
    levelCanBuy: buyToLevel,
    cost: totalCost
  }
}

/**
 * @param n A nonnegative integer
 * @returns The sum of the first n positive cubes, 0 if n = 0, or -1 otherwise.
 */
export const calculateSummationCubic = (n: number) => {
  if (n < 0) {
    return -1
  }
  if (!Number.isInteger(n)) {
    return -1
  }

  return Math.pow((n * (n + 1)) / 2, 2)
}

/**
 * Solves a*n^2 + b*n + c = 0 for real solutions.
 * @param a Coefficient of n^2. Must be nonzero!
 * @param b Coefficient of n.
 * @param c Coefficient of constant term
 * @param positive Boolean which if true makes solution use positive discriminant.
 * @returns Positive root of the quadratic, if it exists, and positive is true, otherwise false
 */
export const solveQuadratic = (
  a: number,
  b: number,
  c: number,
  positive: boolean
) => {
  if (a < 0) {
    throw new Error(String(i18next.t('calculate.quadraticImproperError')))
  }
  const determinant = Math.pow(b, 2) - 4 * a * c
  if (determinant < 0) {
    throw new Error(String(i18next.t('calculate.quadraticDeterminantError')))
  }

  if (determinant === 0) {
    return -b / (2 * a)
  }
  const numeratorPos = -b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)
  const numeratorNeg = -b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)

  if (positive) {
    return numeratorPos / (2 * a)
  } else {
    return numeratorNeg / (2 * a)
  }
}

/**
 * @param initialLevel
 * @param base
 * @param amountToSpend
 */
export const calculateCubicSumData = (
  initialLevel: number,
  baseCost: number,
  amountToSpend: number,
  maxLevel: number
) => {
  if (initialLevel >= maxLevel) {
    return {
      levelCanBuy: maxLevel,
      cost: 0
    }
  }
  const alreadySpent = baseCost * calculateSummationCubic(initialLevel)
  const totalToSpend = alreadySpent + amountToSpend

  // Solves (n(n+1)/2)^2 * baseCost = totalToSpend
  /* Create a det = Sqrt(totalToSpend / baseCost)
   *  Simplification gives n * (n+1) = 2 * det
   *  We can rewrite as n^2 + n - 2 * det = 0 and solve for n.
   */
  if (totalToSpend < 0) {
    throw new Error(String(i18next.t('calculate.cubicSumNegativeError')))
  }

  const determinantRoot = Math.pow(totalToSpend / baseCost, 0.5) // Assume nonnegative!
  const solution = solveQuadratic(1, 1, -2 * determinantRoot, true)

  const levelToBuy = Math.max(
    Math.min(maxLevel, Math.floor(solution)),
    initialLevel
  )
  const realCost = levelToBuy === initialLevel
    ? baseCost * Math.pow(initialLevel + 1, 3)
    : baseCost * calculateSummationCubic(levelToBuy) - alreadySpent

  return {
    levelCanBuy: levelToBuy,
    cost: realCost
  }
}

// IDEA: Rework this shit to be friendly for Stats for Nerds
/* May 25, 2021 - Platonic
    Reorganize this function to make sense, because right now it aint
    What I did was use the separation of cube gain method on other cube types, and made some methods their
    own function (specifically: calc of effective score and other global multipliers) to make it easy.
*/

export const computeAscensionScoreBonusMultiplier = () => {
  let multiplier = 1
  multiplier *= G.challenge15Rewards.score.value
  multiplier *= G.platonicBonusMultiplier[6]
  multiplier *= player.campaigns.ascensionScoreMultiplier
  if (player.cubeUpgrades[21] > 0) {
    multiplier *= 1 + 0.05 * player.cubeUpgrades[21]
  }
  if (player.cubeUpgrades[31] > 0) {
    multiplier *= 1 + 0.05 * player.cubeUpgrades[31]
  }
  if (player.cubeUpgrades[41] > 0) {
    multiplier *= 1 + 0.05 * player.cubeUpgrades[41]
  }
  if (player.achievements[267] > 0) {
    multiplier *= 1
      + Math.min(1, (1 / 100000) * Decimal.log(player.ascendShards.add(1), 10))
  }
  if (player.achievements[259] > 0) {
    multiplier *= Math.max(
      1,
      Math.pow(1.01, Math.log2(player.hepteractCrafts.abyss.CAP))
    )
  }
  if (G.isEvent) {
    multiplier *= 1 + calculateEventBuff(BuffType.AscensionScore)
  }

  return multiplier
}

export const calculateAscensionScore = () => {
  let baseScore = 0
  const corruptionMultiplier = player.corruptions.used.totalCorruptionAscensionMultiplier
  let effectiveScore = 0

  let bonusLevel = player.singularityUpgrades.corruptionFifteen.getEffect()
      .bonus
    ? 1
    : 0
  bonusLevel += +player.singularityChallenges.oneChallengeCap.rewards.freeCorruptionLevel

  // Init Arrays with challenge values :)
  const challengeScoreArrays1 = [0, 8, 10, 12, 15, 20, 60, 80, 120, 180, 300]
  const challengeScoreArrays2 = [0, 10, 12, 15, 20, 30, 80, 120, 180, 300, 450]
  const challengeScoreArrays3 = [
    0,
    20,
    30,
    50,
    100,
    200,
    250,
    300,
    400,
    500,
    750
  ]
  const challengeScoreArrays4 = [
    0,
    10000,
    10000,
    10000,
    10000,
    10000,
    2000,
    3000,
    4000,
    5000,
    7500
  ]

  challengeScoreArrays1[1] += player.cubeUpgrades[56]
  challengeScoreArrays1[2] += player.cubeUpgrades[56]
  challengeScoreArrays1[3] += player.cubeUpgrades[56]

  // Iterate challenges 1 through 10 and award base score according to the array values
  // Transcend Challenge: First Threshold at 75 completions, second at 750
  // Reincarnation Challenge: First at 25, second at 60. It probably should be higher but Platonic is a dumb dumb
  for (let i = 1; i <= 10; i++) {
    baseScore += challengeScoreArrays1[i] * player.highestchallengecompletions[i]
    if (i <= 5 && player.highestchallengecompletions[i] >= 75) {
      baseScore += challengeScoreArrays2[i] * (player.highestchallengecompletions[i] - 75)
      if (player.highestchallengecompletions[i] >= 750) {
        baseScore += challengeScoreArrays3[i]
          * (player.highestchallengecompletions[i] - 750)
      }
      if (player.highestchallengecompletions[i] >= 9000) {
        baseScore += challengeScoreArrays4[i]
          * (player.highestchallengecompletions[i] - 9000)
      }
    }
    if (i <= 10 && i > 5 && player.highestchallengecompletions[i] >= 25) {
      baseScore += challengeScoreArrays2[i] * (player.highestchallengecompletions[i] - 25)
      if (player.highestchallengecompletions[i] >= 60) {
        baseScore += challengeScoreArrays3[i]
          * (player.highestchallengecompletions[i] - 60)
      }
    }
  }

  // Calculation of Challenge 10 Exponent (It gives a constant multiplier per completion)
  // 1.03 +
  // 0.005 from Cube 3x9 +
  // 0.0025 from Platonic ALPHA (Plat 1x5)
  // 0.005 from Platonic BETA (Plat 2x5)
  // Max: 1.0425
  baseScore *= Math.pow(
    1.03
      + 0.005 * player.cubeUpgrades[39]
      + 0.0025 * (player.platonicUpgrades[5] + player.platonicUpgrades[10]),
    player.highestchallengecompletions[10]
  )
  // Corruption Multiplier is the product of all Corruption Score multipliers based on used corruptions
  let bonusVal = player.singularityUpgrades.advancedPack.getEffect().bonus
    ? 0.33
    : 0
  bonusVal += +player.singularityChallenges.oneChallengeCap.rewards.corrScoreIncrease
  bonusVal += 0.3 * player.cubeUpgrades[74]

  const bonusMultiplier = computeAscensionScoreBonusMultiplier()

  effectiveScore = baseScore * corruptionMultiplier * bonusMultiplier
  if (effectiveScore > 1e23) {
    effectiveScore = Math.pow(effectiveScore, 0.5) * Math.pow(1e23, 0.5)
  }

  player.singularityUpgrades.expertPack.getEffect().bonus
    ? (effectiveScore *= 1.5)
    : (effectiveScore *= 1)

  return {
    baseScore,
    corruptionMultiplier,
    bonusMultiplier,
    effectiveScore
  }
}

export const CalcCorruptionStuff = () => {
  let cubeBank = 0
  let challengeModifier = 1
  const scores = calculateAscensionScore()

  const baseScore = scores.baseScore
  const corruptionMultiplier = scores.corruptionMultiplier
  const bonusMultiplier = scores.bonusMultiplier
  const effectiveScore = scores.effectiveScore

  for (let i = 1; i <= 10; i++) {
    challengeModifier = i >= 6 ? 2 : 1
    cubeBank += challengeModifier * player.highestchallengecompletions[i]
  }

  const oneMindModifier = player.singularityUpgrades.oneMind.getEffect().bonus
    ? calculateAscensionSpeedMult() / 10
    : 1

  // Calculation of Cubes :)
  let cubeGain = cubeBank
  cubeGain *= calculateCubeMultiplier()
  cubeGain *= oneMindModifier

  const bonusCubeExponent = player.singularityUpgrades.platonicTau.getEffect()
      .bonus
    ? 1.01
    : 1
  cubeGain = Math.pow(cubeGain, bonusCubeExponent)

  // Calculation of Tesseracts :))
  let tesseractGain = 1
  if (effectiveScore >= 100000) {
    tesseractGain += 0.5
  }
  tesseractGain *= calculateTesseractMultiplier()
  tesseractGain *= oneMindModifier

  // Calculation of Hypercubes :)))
  let hypercubeGain = effectiveScore >= 1e9 ? 1 : 0
  hypercubeGain *= calculateHypercubeMultiplier()
  hypercubeGain *= oneMindModifier

  // Calculation of Platonic Cubes :))))
  let platonicGain = effectiveScore >= 2.666e12 ? 1 : 0
  platonicGain *= calculatePlatonicMultiplier()
  platonicGain *= oneMindModifier

  // Calculation of Hepteracts :)))))
  let hepteractGain = G.challenge15Rewards.hepteractsUnlocked.value
      && effectiveScore >= 1.666e17
      && player.achievements[255] > 0
    ? 1
    : 0
  hepteractGain *= calculateHepteractMultiplier()
  hepteractGain *= oneMindModifier

  return [
    cubeBank,
    Math.floor(baseScore),
    corruptionMultiplier,
    Math.floor(effectiveScore),
    Math.min(1e300, Math.floor(cubeGain)),
    Math.min(
      1e300,
      Math.max(player.singularityCount, Math.floor(tesseractGain))
    ),
    Math.min(1e300, Math.floor(hypercubeGain)),
    Math.min(1e300, Math.floor(platonicGain)),
    Math.min(1e300, Math.floor(hepteractGain)),
    bonusMultiplier
  ]
}

export const calcAscensionCount = () => {
  let ascCount = 1

  if (player.singularityChallenges.limitedAscensions.enabled) {
    return ascCount
  }

  if (player.challengecompletions[10] > 0 && player.achievements[197] === 1) {
    const { effectiveScore } = calculateAscensionScore()

    if (player.ascensionCounter >= resetTimeThreshold()) {
      if (player.achievements[188] > 0) {
        ascCount += 99
      }

      ascCount *= 1
        + (player.ascensionCounter / resetTimeThreshold() - 1)
          * 0.2
          * (player.achievements[189]
            + player.achievements[202]
            + player.achievements[209]
            + player.achievements[216]
            + player.achievements[223])
    }

    ascCount *= player.achievements[187] && Math.floor(effectiveScore) > 1e8
      ? Math.log10(Math.floor(effectiveScore) + 1) - 1
      : 1
    ascCount *= G.challenge15Rewards.ascensions.value
    ascCount *= player.achievements[260] > 0 ? 1.1 : 1
    ascCount *= player.achievements[261] > 0 ? 1.1 : 1
    ascCount *= player.platonicUpgrades[15] > 0 ? 2 : 1
    ascCount *= 1 + 0.02 * player.platonicUpgrades[16]
    ascCount *= 1
      + 0.02
        * player.platonicUpgrades[16]
        * Math.min(1, player.overfluxPowder / 100000)
    ascCount *= 1 + player.singularityCount / 10
    ascCount *= +player.singularityUpgrades.ascensions.getEffect().bonus
    ascCount *= +player.octeractUpgrades.octeractAscensions.getEffect().bonus
    ascCount *= +player.octeractUpgrades.octeractAscensions2.getEffect().bonus
    ascCount *= player.singularityUpgrades.oneMind.getEffect().bonus
      ? calculateAscensionSpeedMult() / 10
      : 1
  }

  return Math.floor(ascCount)
}

export const calculateCubeQuarkMultiplier = () => {
  return (
    (calculateSigmoid(2, Math.pow(player.overfluxOrbs, 0.5), 40)
      + calculateSigmoid(1.5, Math.pow(player.overfluxOrbs, 0.5), 160)
      + calculateSigmoid(1.5, Math.pow(player.overfluxOrbs, 0.5), 640)
      + calculateSigmoid(
        1.15,
        +(player.highestSingularityCount >= 1)
          * Math.pow(player.overfluxOrbs, 0.45),
        2560
      )
      + calculateSigmoid(
        1.15,
        +(player.highestSingularityCount >= 2)
          * Math.pow(player.overfluxOrbs, 0.4),
        10000
      )
      + calculateSigmoid(
        1.25,
        +(player.highestSingularityCount >= 5)
          * Math.pow(player.overfluxOrbs, 0.35),
        40000
      )
      + calculateSigmoid(
        1.25,
        +(player.highestSingularityCount >= 10)
          * Math.pow(player.overfluxOrbs, 0.32),
        160000
      )
      + calculateSigmoid(
        1.35,
        +(player.highestSingularityCount >= 15)
          * Math.pow(player.overfluxOrbs, 0.27),
        640000
      )
      + calculateSigmoid(
        1.45,
        +(player.highestSingularityCount >= 20)
          * Math.pow(player.overfluxOrbs, 0.24),
        2e6
      )
      + calculateSigmoid(
        1.55,
        +(player.highestSingularityCount >= 25)
          * Math.pow(player.overfluxOrbs, 0.21),
        1e7
      )
      + calculateSigmoid(
        1.85,
        +(player.highestSingularityCount >= 30)
          * Math.pow(player.overfluxOrbs, 0.18),
        4e7
      )
      + calculateSigmoid(
        3,
        +(player.highestSingularityCount >= 35)
          * Math.pow(player.overfluxOrbs, 0.15),
        1e8
      )
      - 11)
    * (1 + (1 / 500) * player.shopUpgrades.cubeToQuarkAll)
    * (player.autoWarpCheck ? 1 + player.dailyPowderResetUses : 1)
  )
}

export const calculateCubeMultFromPowder = () => {
  return player.overfluxPowder > 10000
    ? 1 + (1 / 16) * Math.pow(Math.log10(player.overfluxPowder), 2)
    : 1 + (1 / 10000) * player.overfluxPowder
}

export const calculateQuarkMultFromPowder = () => {
  return player.overfluxPowder > 10000
    ? 1 + (1 / 40) * Math.log10(player.overfluxPowder)
    : 1 + (1 / 100000) * player.overfluxPowder
}

export const calculateSingularityAmbrosiaLuckMilestoneBonus = () => {
  let bonus = 0
  const singThresholds1 = [35, 42, 49, 56, 63, 70, 77]
  const singThresholds2 = [135, 142, 149, 156, 163, 170, 177]

  for (const sing of singThresholds1) {
    if (player.highestSingularityCount >= sing) {
      bonus += 5
    }
  }

  for (const sing of singThresholds2) {
    if (player.highestSingularityCount >= sing) {
      bonus += 6
    }
  }

  return bonus
}

export const calculateAmbrosiaGenerationShopUpgrade = () => {
  const multipliers = [
    1 + player.shopUpgrades.shopAmbrosiaGeneration1 / 100,
    1 + player.shopUpgrades.shopAmbrosiaGeneration2 / 100,
    1 + player.shopUpgrades.shopAmbrosiaGeneration3 / 100,
    1 + player.shopUpgrades.shopAmbrosiaGeneration4 / 1000
  ]

  return productContents(multipliers)
}

export const calculateAmbrosiaLuckShopUpgrade = () => {
  const vals = [
    2 * player.shopUpgrades.shopAmbrosiaLuck1,
    2 * player.shopUpgrades.shopAmbrosiaLuck2,
    2 * player.shopUpgrades.shopAmbrosiaLuck3,
    0.6 * player.shopUpgrades.shopAmbrosiaLuck4
  ]

  return sumContents(vals)
}

export const calculateAmbrosiaGenerationSingularityUpgrade = () => {
  const vals = [
    +player.singularityUpgrades.singAmbrosiaGeneration.getEffect().bonus,
    +player.singularityUpgrades.singAmbrosiaGeneration2.getEffect().bonus,
    +player.singularityUpgrades.singAmbrosiaGeneration3.getEffect().bonus,
    +player.singularityUpgrades.singAmbrosiaGeneration4.getEffect().bonus
  ]

  return productContents(vals)
}

export const calculateAmbrosiaLuckSingularityUpgrade = () => {
  const vals = [
    +player.singularityUpgrades.singAmbrosiaLuck.getEffect().bonus,
    +player.singularityUpgrades.singAmbrosiaLuck2.getEffect().bonus,
    +player.singularityUpgrades.singAmbrosiaLuck3.getEffect().bonus,
    +player.singularityUpgrades.singAmbrosiaLuck4.getEffect().bonus
  ]

  return sumContents(vals)
}

export const calculateAmbrosiaGenerationOcteractUpgrade = () => {
  const vals = [
    +player.octeractUpgrades.octeractAmbrosiaGeneration.getEffect().bonus,
    +player.octeractUpgrades.octeractAmbrosiaGeneration2.getEffect().bonus,
    +player.octeractUpgrades.octeractAmbrosiaGeneration3.getEffect().bonus,
    +player.octeractUpgrades.octeractAmbrosiaGeneration4.getEffect().bonus
  ]

  return productContents(vals)
}

export const calculateAmbrosiaLuckOcteractUpgrade = () => {
  const vals = [
    +player.octeractUpgrades.octeractAmbrosiaLuck.getEffect().bonus,
    +player.octeractUpgrades.octeractAmbrosiaLuck2.getEffect().bonus,
    +player.octeractUpgrades.octeractAmbrosiaLuck3.getEffect().bonus,
    +player.octeractUpgrades.octeractAmbrosiaLuck4.getEffect().bonus
  ]

  return sumContents(vals)
}

const digitReduction = 4

export const calculateNumberOfThresholds = () => {
  const numDigits = player.lifetimeAmbrosia > 0 ? 1 + Math.floor(Math.log10(player.lifetimeAmbrosia)) : 0
  const matissa = Math.floor(player.lifetimeAmbrosia / Math.pow(10, numDigits - 1))

  const extraReduction = matissa >= 3 ? 1 : 0

  // First reduction at 10^(digitReduction+1), add 1 at 3 * 10^(digitReduction+1)
  return Math.max(0, 2 * (numDigits - digitReduction) - 1 + extraReduction)
}

export const calculateToNextThreshold = () => {
  const numThresholds = calculateNumberOfThresholds()

  if (numThresholds === 0) {
    return 10000 - player.lifetimeAmbrosia
  } else {
    // This is when the previous threshold is of the form 3 * 10^n
    if (numThresholds % 2 === 0) {
      return Math.pow(10, numThresholds / 2 + digitReduction) - player.lifetimeAmbrosia
    } // Previous threshold is of the form 10^n
    else {
      return 3 * Math.pow(10, (numThresholds - 1) / 2 + digitReduction) - player.lifetimeAmbrosia
    }
  }
}

export const calculateRequiredBlueberryTime = () => {
  let val = G.TIME_PER_AMBROSIA // Currently 30
  val += Math.floor(player.lifetimeAmbrosia / 500)

  const thresholds = calculateNumberOfThresholds()
  const thresholdBase = 2
  return Math.pow(thresholdBase, thresholds) * val
}

export const calculateRequiredRedAmbrosiaTime = () => {
  let val = G.TIME_PER_RED_AMBROSIA // Currently 100,000
  val += 200 * player.lifetimeRedAmbrosia

  const max = 1e6 * +player.singularityChallenges.limitedTime.rewards.barRequirementMultiplier
  val *= +player.singularityChallenges.limitedTime.rewards.barRequirementMultiplier

  return Math.min(max, val)
}

export const calculateSingularityMilestoneBlueberries = () => {
  let val = 0
  if (player.highestSingularityCount >= 270) val = 5
  else if (player.highestSingularityCount >= 256) val = 4
  else if (player.highestSingularityCount >= 192) val = 3
  else if (player.highestSingularityCount >= 128) val = 2
  else if (player.highestSingularityCount >= 64) val = 1

  return val
}

export const calculateAmbrosiaCubeMult = () => {
  const effectiveAmbrosia = (player.singularityChallenges.noAmbrosiaUpgrades.enabled) ? 0 : player.lifetimeAmbrosia
  let multiplier = 1
  multiplier += Math.min(1.5, Math.floor(effectiveAmbrosia / 66) / 100)
  if (effectiveAmbrosia >= 10000) {
    multiplier += Math.min(
      1.5,
      Math.floor(effectiveAmbrosia / 666) / 100
    )
  }
  if (effectiveAmbrosia >= 100000) {
    multiplier += Math.floor(effectiveAmbrosia / 6666) / 100
  }

  return multiplier
}

export const calculateAmbrosiaQuarkMult = () => {
  const effectiveAmbrosia = (player.singularityChallenges.noAmbrosiaUpgrades.enabled) ? 0 : player.lifetimeAmbrosia
  let multiplier = 1
  multiplier += Math.min(0.3, Math.floor(effectiveAmbrosia / 1666) / 100)
  if (effectiveAmbrosia >= 50000) {
    multiplier += Math.min(
      0.3,
      Math.floor(effectiveAmbrosia / 16666) / 100
    )
  }
  if (effectiveAmbrosia >= 500000) {
    multiplier += Math.floor(effectiveAmbrosia / 166666) / 100
  }

  return multiplier
}

export const calculateCashGrabBonus = (extra: number) => {
  return 1 + player.shopUpgrades.shopCashGrabUltra * extra * Math.min(1, Math.pow(player.lifetimeAmbrosia / 1e7, 1 / 3))
}

export const calculateCashGrabBlueberryBonus = () => {
  return calculateCashGrabBonus(CASH_GRAB_ULTRA_BLUEBERRY)
}

export const calculateCashGrabCubeBonus = () => {
  return calculateCashGrabBonus(CASH_GRAB_ULTRA_CUBE)
}

export const calculateCashGrabQuarkBonus = () => {
  return calculateCashGrabBonus(CASH_GRAB_ULTRA_QUARK)
}

export const calculateEXUltraBonus = (extra: number) => {
  return 1 + extra * Math.min(player.shopUpgrades.shopEXUltra, Math.floor(player.lifetimeAmbrosia / 1000) / 125)
}

export const calculateEXUltraOfferingBonus = () => {
  return calculateEXUltraBonus(EX_ULTRA_OFFERING)
}

export const calculateEXUltraObtainiumBonus = () => {
  return calculateEXUltraBonus(EX_ULTRA_OBTAINIUM)
}

export const calculateEXUltraCubeBonus = () => {
  return calculateEXUltraBonus(EX_ULTRA_CUBES)
}

export const calculateExalt6Penalty = (comps: number, time: number) => {
  const displacedTime = Math.max(0, time - 600 + 20 * comps)
  if (displacedTime === 0) {
    return 1
  } else {
    return Math.pow(10 + comps, -displacedTime / 60)
  }
}

export const calculateDilatedFiveLeafBonus = () => {
  const singThresholds = [100, 150, 200, 225, 250, 255, 260, 265, 269, 272]
  for (let i = 0; i < singThresholds.length; i++) {
    if (player.highestSingularityCount < singThresholds[i]) return i / 100
  }

  return singThresholds.length / 100
}

export const dailyResetCheck = () => {
  if (!player.dayCheck) {
    return
  }
  const now = new Date(getTimePinnedToLoadDate())
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()
  player.dayTimer = 60 * 60 * 24 - 60 * 60 * h - 60 * m - s

  // Daily is not reset even if it is set to a past time.
  // If the daily is not reset, the data may have been set to a future time.
  if (day.getTime() - 3600000 > player.dayCheck.getTime()) {
    player.dayCheck = day

    forcedDailyReset(true)
    player.dailyPowderResetUses = 1 + player.shopUpgrades.extraWarp
    player.dailyCodeUsed = false

    DOMCacheGetOrSet('cubeQuarksOpenRequirement').style.display = 'block'
    if (player.challengecompletions[11] > 0) {
      DOMCacheGetOrSet('tesseractQuarksOpenRequirement').style.display = 'block'
    }
    if (player.challengecompletions[13] > 0) {
      DOMCacheGetOrSet('hypercubeQuarksOpenRequirement').style.display = 'block'
    }
    if (player.challengecompletions[14] > 0) {
      DOMCacheGetOrSet('platonicCubeQuarksOpenRequirement').style.display = 'block'
    }
  }
}

/**
 * Resets Cube Counts and stuff. NOTE: It is intentional it does not award powder or expire orbs.
 */
export const forcedDailyReset = (rewards = false) => {
  player.cubeQuarkDaily = 0
  player.tesseractQuarkDaily = 0
  player.hypercubeQuarkDaily = 0
  player.platonicCubeQuarkDaily = 0
  player.cubeOpenedDaily = 0
  player.tesseractOpenedDaily = 0
  player.hypercubeOpenedDaily = 0
  player.platonicCubeOpenedDaily = 0

  if (rewards) {
    player.overfluxPowder += player.overfluxOrbs * calculatePowderConversion()
    player.overfluxOrbs = G.challenge15Rewards.freeOrbs.value
  }
}

export const calculateEventBuff = (buff: BuffType) => {
  // if (!G.isEvent) {
  //  return 0
  // }
  return calculateEventSourceBuff(buff)
}

export const derpsmithCornucopiaBonus = () => {
  let counter = 0
  const singCounts = [
    18,
    38,
    58,
    78,
    88,
    98,
    118,
    148,
    178,
    188,
    198,
    208,
    218,
    228,
    238,
    248
  ]
  for (const sing of singCounts) {
    if (player.highestSingularityCount >= sing) {
      counter += 1
    }
  }

  return 1 + (counter * player.highestSingularityCount) / 100
}

export const isIARuneUnlocked = () => {
  return player.shopUpgrades.infiniteAscent > 0 || Boolean(PCoinUpgradeEffects.INSTANT_UNLOCK_2)
}

export const isShopTalismanUnlocked = () => {
  return player.shopUpgrades.shopTalisman > 0 || PCoinUpgradeEffects.INSTANT_UNLOCK_1
}

export const sing6Mult = () => {
  if (player.singularityCount <= 200) {
    return 1
  } else {
    return Math.pow(1.01, player.singularityCount - 200)
  }
}

export const sumOfExaltCompletions = () => {
  let sum = 0
  for (const challenge of Object.values(player.singularityChallenges)) {
    sum += challenge.completions
  }
  return sum
}

export const inheritanceTokens = () => {
  const levels = [2, 5, 10, 17, 26, 37, 50, 65, 82, 101, 220, 240, 260, 270, 277]
  const tokens = [1, 10, 25, 40, 75, 100, 150, 200, 250, 300, 350, 400, 500, 600, 750]

  for (let i = 15; i > 0; i--) {
    if (player.highestSingularityCount >= levels[i]) {
      return tokens[i]
    }
  }

  return 0
}

export const singularityBonusTokenMult = () => {
  const levels = [41, 58, 113, 163, 229]

  for (let i = 5; i > 0; i--) {
    if (player.highestSingularityCount >= levels[i - 1]) {
      return 1 + 0.02 * i
    }
  }

  return 1
}

export const resetTimeThreshold = () => {
  const base = 10
  let reduction = 0

  reduction += player.campaigns.timeThresholdReduction

  return base - reduction
}

export const calculatePlatonic7UpgradePower = () => {
  return 1 - player.platonicUpgrades[7] / 30
}

export const calculateOfferingPotionBaseOfferings = () => {
  const thresholds = [
    1,
    10,
    25,
    50,
    100,
    500,
    1000,
    10000,
    5e4,
    1e5,
    1e6,
    1e7,
    1e8,
    1e9,
    1e10,
    1e11,
    1e12,
    1e13,
    1e14,
    1e15
  ]
  const amount = findInsertionIndex(player.shopPotionsConsumed.offering, thresholds)

  return {
    amount: amount,
    toNext: (amount < thresholds.length)
      ? thresholds[amount] - player.shopPotionsConsumed.offering
      : Number.POSITIVE_INFINITY
  }
}

export const calculateObtainiumPotionBaseObtainium = () => {
  const thresholds = [1, 20, 50, 250, 1000, 20000, 4e5, 1e7, 4e8, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15]
  const amount = findInsertionIndex(player.shopPotionsConsumed.obtainium, thresholds)

  return {
    amount: amount,
    toNext: (amount < thresholds.length)
      ? thresholds[amount] - player.shopPotionsConsumed.obtainium
      : Number.POSITIVE_INFINITY
  }
}

export const calculateAscensionSpeedExponentSpread = () => {
  const vals = [
    player.singularityUpgrades.singAscensionSpeed.getEffect().bonus ? 0.03 : 0,
    +player.singularityUpgrades.singAscensionSpeed2.getEffect().bonus,
    0.001 * Math.floor((player.shopUpgrades.chronometerInfinity + calculateFreeShopInfinityUpgrades()) / 40)
  ]

  return sumContents(vals)
}

export const calculateCookieUpgrade29Luck = () => {
  if (player.cubeUpgrades[79] === 0 || player.lifetimeRedAmbrosia === 0) {
    return 0
  } else {
    return 10 * Math.pow(Math.log10(player.lifetimeRedAmbrosia), 2)
  }
}

export const calculateRedAmbrosiaCubes = () => {
  if (getRedAmbrosiaUpgrade('redAmbrosiaCube').bonus.unlockedRedAmbrosiaCube) {
    const exponent = 0.4 + getRedAmbrosiaUpgrade('redAmbrosiaCubeImprover').bonus.extraExponent
    return 1 + Math.pow(player.lifetimeRedAmbrosia, exponent) / 100
  } else {
    return 1
  }
}

export const calculateRedAmbrosiaObtainium = () => {
  if (getRedAmbrosiaUpgrade('redAmbrosiaObtainium').bonus.unlockRedAmbrosiaObtainium) {
    return 1 + Math.pow(player.lifetimeRedAmbrosia, 0.6) / 100
  } else {
    return 1
  }
}

export const calculateRedAmbrosiaOffering = () => {
  if (getRedAmbrosiaUpgrade('redAmbrosiaOffering').bonus.unlockRedAmbrosiaOffering) {
    return 1 + Math.pow(player.lifetimeRedAmbrosia, 0.6) / 100
  } else {
    return 1
  }
}
