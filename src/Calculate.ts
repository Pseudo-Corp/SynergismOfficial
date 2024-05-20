import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { achievementaward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcECC } from './Challenges'
import { BuffType, calculateEventSourceBuff } from './Event'
import { addTimers, automaticTools } from './Helper'
import { hepteractEffective } from './Hepteracts'
import { disableHotkeys, enableHotkeys } from './Hotkeys'
import { quarkHandler } from './Quark'
import { reset } from './Reset'
import { calculateSingularityDebuff } from './singularity'
import { getFastForwardTotalMultiplier } from './singularity'
import { format, getTimePinnedToLoadDate, player, resourceGain, saveSynergy, updateAll } from './Synergism'
import { toggleTalismanBuy, updateTalismanInventory } from './Talismans'
import { clearInterval, setInterval } from './Timers'
import type { resetNames } from './types/Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { productContents, sumContents } from './Utility'
import { Globals as G } from './Variables'

const CASH_GRAB_ULTRA_QUARK = 0.08
const CASH_GRAB_ULTRA_CUBE = 1.2
const CASH_GRAB_ULTRA_BLUEBERRY = 0.15

const EX_ULTRA_OFFERING = 0.125
const EX_ULTRA_OBTAINIUM = 0.125
const EX_ULTRA_CUBES = 0.125

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
    G.challenge15Rewards.runeExp
  ])
  // Corruption Divisor
  const droughtEffect = 1
    / Math.pow(
      G.droughtMultiplier[player.usedCorruptions[8]],
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
  return (
    player.runelevels[5]
    + Math.max(0, player.runelevels[5] - 74)
    + Math.max(0, player.runelevels[5] - 98)
  )
}

export function calculateOfferings (input: resetNames): number
export function calculateOfferings (
  input: resetNames,
  calcMult: false,
  statistic?: boolean
): number[]
export function calculateOfferings (
  input: resetNames,
  calcMult: true,
  statistic: boolean
): number
export function calculateOfferings (
  input: resetNames,
  calcMult = true,
  statistic = false
) {
  if (
    input === 'acceleratorBoost'
    || input === 'ascension'
    || input === 'ascensionChallenge'
  ) {
    return 0
  }

  let q = 0
  let a = 0
  let b = 0
  let c = 0

  if (input === 'reincarnation' || input === 'reincarnationChallenge') {
    a += 3
    if (player.achievements[52] > 0.5) {
      a += 25 * Math.min(player.reincarnationcounter / 1800, 1)
    }
    if (player.upgrades[62] > 0.5) {
      a += (1 / 50) * sumContents(player.challengecompletions)
    }
    a += 0.6 * player.researches[25]
    if (player.researches[95] === 1) {
      a += 4
    }
    a += (1 / 200)
      * G.rune5level
      * G.effectiveLevelMult
      * (1 + player.researches[85] / 200)
    a *= 1
      + Math.pow(Decimal.log(player.reincarnationShards.add(1), 10), 2 / 3) / 4
    a *= Math.min(Math.pow(player.reincarnationcounter / 10 + 1, 2), 1)
    if (player.reincarnationcounter >= 5) {
      a *= Math.max(1, player.reincarnationcounter / 10)
    }
  }
  if (
    input === 'transcension'
    || input === 'transcensionChallenge'
    || input === 'reincarnation'
    || input === 'reincarnationChallenge'
  ) {
    b += 2
    if (player.reincarnationCount > 0) {
      b += 2
    }
    if (player.achievements[44] > 0.5) {
      b += 15 * Math.min(player.transcendcounter / 1800, 1)
    }
    if (player.challengecompletions[2] > 0) {
      b += 1
    }
    b += 0.2 * player.researches[24]
    b += (1 / 200)
      * G.rune5level
      * G.effectiveLevelMult
      * (1 + player.researches[85] / 200)
    b *= 1 + Math.pow(Decimal.log(player.transcendShards.add(1), 10), 1 / 2) / 5
    b *= 1 + CalcECC('reincarnation', player.challengecompletions[8]) / 25
    b *= Math.min(Math.pow(player.transcendcounter / 10, 2), 1)
    if (player.transcendCount >= 5) {
      b *= Math.max(1, player.transcendcounter / 10)
    }
  }
  // This will always be calculated if '0' is not already returned
  c += 1
  if (player.transcendCount > 0 || player.reincarnationCount > 0) {
    c += 1
  }
  if (player.reincarnationCount > 0) {
    c += 2
  }
  if (player.achievements[37] > 0.5) {
    c += 15 * Math.min(player.prestigecounter / 1800, 1)
  }
  if (player.challengecompletions[2] > 0) {
    c += 1
  }
  c += 0.2 * player.researches[24]
  c += (1 / 200)
    * G.rune5level
    * G.effectiveLevelMult
    * (1 + player.researches[85] / 200)
  c *= 1 + Math.pow(Decimal.log(player.prestigeShards.add(1), 10), 1 / 2) / 5
  c *= 1 + CalcECC('reincarnation', player.challengecompletions[6]) / 50
  c *= Math.min(Math.pow(player.prestigecounter / 10, 2), 1)
  if (player.prestigeCount >= 5) {
    c *= Math.max(1, player.prestigecounter / 10)
  }
  q = a + b + c

  const arr = [
    1 + (10 * player.achievements[33]) / 100, // Alchemy Achievement 5
    1 + (15 * player.achievements[34]) / 100, // Alchemy Achievement 6
    1 + (25 * player.achievements[35]) / 100, // Alchemy Achievement 7
    1 + (20 * player.upgrades[38]) / 100, // Diamond Upgrade 4x3
    1
    + player.upgrades[75]
      * 2
      * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5)), // Particle Upgrade 3x5
    1 + (1 / 50) * player.shopUpgrades.offeringAuto, // Auto Offering Shop
    1 + (1 / 25) * player.shopUpgrades.offeringEX, // Offering EX Shop
    1 + (1 / 100) * player.shopUpgrades.cashGrab, // Cash Grab
    1
    + (1 / 10000)
      * sumContents(player.challengecompletions)
      * player.researches[85], // Research 4x10
    1 + Math.pow(player.antUpgrades[6 - 1]! + G.bonusant6, 0.66), // Ant Upgrade:
    G.cubeBonusMultiplier[3], // Brutus
    1 + 0.02 * player.constantUpgrades[3], // Constant Upgrade 3
    1
    + 0.0003 * player.talismanLevels[3 - 1] * player.researches[149]
    + 0.0004 * player.talismanLevels[3 - 1] * player.researches[179], // Research 6x24,8x4
    1 + 0.12 * CalcECC('ascension', player.challengecompletions[12]), // Challenge 12
    1 + (0.01 / 100) * player.researches[200], // Research 8x25
    1 + Math.min(1, player.ascensionCount / 1e6) * player.achievements[187], // Ascension Count Achievement
    1 + 0.6 * player.achievements[250] + 1 * player.achievements[251], // Sun&Moon Achievements
    1 + 0.05 * player.cubeUpgrades[46], // Cube Upgrade 5x6
    1 + (0.02 / 100) * player.cubeUpgrades[50], // Cube Upgrade 5x10
    1 + player.platonicUpgrades[5], // Platonic ALPHA
    1 + 2.5 * player.platonicUpgrades[10], // Platonic BETA
    1 + 5 * player.platonicUpgrades[15], // Platonic OMEGA
    G.challenge15Rewards.offering, // C15 Reward
    1 + 5 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0), // Starter Pack Upgrade
    +player.singularityUpgrades.singOfferings1.getEffect().bonus, // Offering Charge GQ Upgrade
    +player.singularityUpgrades.singOfferings2.getEffect().bonus, // Offering Storm GQ Upgrade
    +player.singularityUpgrades.singOfferings3.getEffect().bonus, // Offering Tempest GQ Upgrade
    +player.singularityUpgrades.singCitadel.getEffect().bonus, // Citadel GQ Upgrade
    +player.singularityUpgrades.singCitadel2.getEffect().bonus, // Citadel 2 GQ Upgrade
    1 + player.cubeUpgrades[54] / 100, // Cube upgrade 6x4 (Cx4)
    +player.octeractUpgrades.octeractOfferings1.getEffect().bonus, // Offering Electrolosis OC Upgrade
    1 + 0.001 * +player.blueberryUpgrades.ambrosiaOffering1.bonus.offeringMult, // Ambrosia!!
    calculateEXALTBonusMult(), // 20 Ascensions X20 Bonus [EXALT ONLY]
    calculateEXUltraOfferingBonus(), // EX Ultra Shop Upgrade
    1 + calculateEventBuff(BuffType.Offering) // Event
  ]

  if (calcMult) {
    q *= productContents(arr)
  } else {
    return arr
  }

  if (statistic) {
    return productContents(arr)
  }

  if (G.eventClicked && G.isEvent) {
    q *= 1.05
  }
  q /= calculateSingularityDebuff('Offering')
  q = (Math.floor(q) * 100) / 100
  if (player.currentChallenge.ascension === 15) {
    q *= 1 + 7 * player.cubeUpgrades[62]
  }
  q *= 1 + (1 / 200) * player.shopUpgrades.cashGrab2
  q *= 1 + (1 / 100) * player.shopUpgrades.offeringEX2 * player.singularityCount
  q *= Math.pow(1.02, player.shopUpgrades.offeringEX3)
  q *= calculateTotalOcteractOfferingBonus()
  q = Math.min(1e300, q)

  let persecond = 0
  if (input === 'prestige') {
    persecond = q / (1 + player.prestigecounter)
  }
  if (input === 'transcension' || input === 'transcensionChallenge') {
    persecond = q / (1 + player.transcendcounter)
  }
  if (input === 'reincarnation' || input === 'reincarnationChallenge') {
    persecond = q / (1 + player.reincarnationcounter)
  }
  if (persecond > player.offeringpersecond) {
    player.offeringpersecond = persecond
  }

  return q
}

export const calculateObtainium = () => {
  G.obtainiumGain = 1
  if (player.upgrades[69] > 0) {
    G.obtainiumGain *= Math.min(
      10,
      new Decimal(
        Decimal.pow(Decimal.log(G.reincarnationPointGain.add(10), 10), 0.5)
      ).toNumber()
    )
  }
  if (player.upgrades[72] > 0) {
    G.obtainiumGain *= Math.min(
      50,
      1
        + 2 * player.challengecompletions[6]
        + 2 * player.challengecompletions[7]
        + 2 * player.challengecompletions[8]
        + 2 * player.challengecompletions[9]
        + 2 * player.challengecompletions[10]
    )
  }
  if (player.upgrades[74] > 0) {
    G.obtainiumGain *= 1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5))
  }
  G.obtainiumGain *= 1 + player.researches[65] / 5
  G.obtainiumGain *= 1 + player.researches[76] / 10
  G.obtainiumGain *= 1 + player.researches[81] / 10
  G.obtainiumGain *= 1 + player.shopUpgrades.obtainiumAuto / 50
  G.obtainiumGain *= 1 + player.shopUpgrades.cashGrab / 100
  G.obtainiumGain *= 1
    + (G.rune5level / 200)
      * G.effectiveLevelMult
      * (1
        + (player.researches[84] / 200)
          * (1
            + (1 * G.effectiveRuneSpiritPower[5] * calculateCorruptionPoints())
              / 400))
  G.obtainiumGain *= 1
    + 0.01 * player.achievements[84]
    + 0.03 * player.achievements[91]
    + 0.05 * player.achievements[98]
    + 0.07 * player.achievements[105]
    + 0.09 * player.achievements[112]
    + 0.11 * player.achievements[119]
    + 0.13 * player.achievements[126]
    + 0.15 * player.achievements[133]
    + 0.17 * player.achievements[140]
    + 0.19 * player.achievements[147]
  G.obtainiumGain *= 1 + 2 * Math.pow((player.antUpgrades[10 - 1]! + G.bonusant10) / 50, 2 / 3)
  G.obtainiumGain *= 1 + player.achievements[188] * Math.min(2, player.ascensionCount / 5e6)
  G.obtainiumGain *= 1 + 0.6 * player.achievements[250] + 1 * player.achievements[251]
  G.obtainiumGain *= G.cubeBonusMultiplier[5]
  G.obtainiumGain *= 1 + 0.04 * player.constantUpgrades[4]
  G.obtainiumGain *= 1 + 0.1 * player.cubeUpgrades[47]
  G.obtainiumGain *= 1 + 0.1 * player.cubeUpgrades[3]
  G.obtainiumGain *= 1 + 0.5 * CalcECC('ascension', player.challengecompletions[12])
  G.obtainiumGain *= 1 + (calculateCorruptionPoints() / 400) * G.effectiveRuneSpiritPower[4]
  G.obtainiumGain *= 1
    + ((0.03 * Math.log(player.uncommonFragments + 1)) / Math.log(4))
      * player.researches[144]
  G.obtainiumGain *= 1 + (0.02 / 100) * player.cubeUpgrades[50]
  if (player.achievements[53] > 0) {
    G.obtainiumGain *= 1 + (1 / 800) * G.runeSum
  }
  if (player.achievements[128]) {
    G.obtainiumGain *= 1.5
  }
  if (player.achievements[129]) {
    G.obtainiumGain *= 1.25
  }

  if (player.achievements[51] > 0) {
    G.obtainiumGain += 4
  }
  if (player.reincarnationcounter >= 2) {
    G.obtainiumGain += 1 * player.researches[63]
  }
  if (player.reincarnationcounter >= 5) {
    G.obtainiumGain += 2 * player.researches[64]
  }
  G.obtainiumGain *= Math.min(1, Math.pow(player.reincarnationcounter / 10, 2))
  G.obtainiumGain *= 1 + (1 / 25) * player.shopUpgrades.obtainiumEX
  if (player.reincarnationCount >= 5) {
    G.obtainiumGain *= Math.max(1, player.reincarnationcounter / 10)
  }
  G.obtainiumGain *= Math.pow(
    Decimal.log(player.transcendShards.add(1), 10) / 300,
    2
  )
  G.obtainiumGain = Math.pow(
    G.obtainiumGain,
    Math.min(
      1,
      G.illiteracyPower[player.usedCorruptions[5]]
        * (1
          + (9 / 100)
            * player.platonicUpgrades[9]
            * Math.min(100, Math.log10(player.researchPoints + 10)))
    )
  )
  G.obtainiumGain *= 1 + (4 / 100) * player.cubeUpgrades[42]
  G.obtainiumGain *= 1 + (3 / 100) * player.cubeUpgrades[43]
  G.obtainiumGain *= 1 + player.platonicUpgrades[5]
  G.obtainiumGain *= 1 + 1.5 * player.platonicUpgrades[9]
  G.obtainiumGain *= 1 + 2.5 * player.platonicUpgrades[10]
  G.obtainiumGain *= 1 + 5 * player.platonicUpgrades[15]
  G.obtainiumGain *= G.challenge15Rewards.obtainium
  G.obtainiumGain *= 1 + 5 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0)
  G.obtainiumGain *= +player.singularityUpgrades.singObtainium1.getEffect().bonus
  G.obtainiumGain *= +player.singularityUpgrades.singObtainium2.getEffect().bonus
  G.obtainiumGain *= +player.singularityUpgrades.singObtainium3.getEffect().bonus
  G.obtainiumGain *= 1 + player.cubeUpgrades[55] / 100 // Cube Upgrade 6x5 (Cx5)
  G.obtainiumGain *= 1 + (1 / 200) * player.shopUpgrades.cashGrab2
  G.obtainiumGain *= 1 + (1 / 100) * player.shopUpgrades.obtainiumEX2 * player.singularityCount
  G.obtainiumGain *= 1 + calculateEventBuff(BuffType.Obtainium)
  G.obtainiumGain *= +player.singularityUpgrades.singCitadel.getEffect().bonus
  G.obtainiumGain *= +player.singularityUpgrades.singCitadel2.getEffect().bonus
  G.obtainiumGain *= +player.octeractUpgrades.octeractObtainium1.getEffect().bonus
  G.obtainiumGain *= Math.pow(1.02, player.shopUpgrades.obtainiumEX3)
  G.obtainiumGain *= calculateTotalOcteractObtainiumBonus()

  if (G.eventClicked && G.isEvent) {
    G.obtainiumGain *= 1.05
  }

  if (player.currentChallenge.ascension === 15) {
    G.obtainiumGain += 1
    G.obtainiumGain *= 1 + 7 * player.cubeUpgrades[62]
  }

  G.obtainiumGain *= 1
    + 0.001 * +player.blueberryUpgrades.ambrosiaObtainium1.bonus.obtainiumMult

  G.obtainiumGain *= calculateEXUltraObtainiumBonus()
  G.obtainiumGain *= calculateEXALTBonusMult()

  if (!isFinite(G.obtainiumGain)) {
    G.obtainiumGain = 1e300
  }
  G.obtainiumGain = Math.min(1e300, G.obtainiumGain)
  G.obtainiumGain /= calculateSingularityDebuff('Obtainium')

  if (player.usedCorruptions[5] >= 15) {
    G.obtainiumGain = Math.pow(G.obtainiumGain, 1 / 4)
  }
  if (player.usedCorruptions[5] >= 16) {
    G.obtainiumGain = Math.pow(G.obtainiumGain, 1 / 3)
  }

  G.obtainiumGain = Math.max(1 + player.singularityCount, G.obtainiumGain)
  if (player.currentChallenge.ascension === 14) {
    G.obtainiumGain = 0
  }
  player.obtainiumpersecond = Math.min(1e300, G.obtainiumGain) / (0.1 + player.reincarnationcounter)
  player.maxobtainiumpersecond = Math.max(
    player.maxobtainiumpersecond,
    player.obtainiumpersecond
  )
}

export const calculateAutomaticObtainium = () => {
  return (
    0.05
    * (10 * player.researches[61] + 2 * player.researches[62])
    * player.maxobtainiumpersecond
    * (1 + (4 * player.cubeUpgrades[3]) / 5)
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
          * G.challenge15Rewards.talismanBonus
      } else {
        G.talisman1Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[1 - 1]]!
          - negativeBonus)
          * player.talismanLevels[1 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus
      }

      if (player.talismanTwo[i] === 1) {
        G.talisman2Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[2 - 1]]!
          + positiveBonus)
          * player.talismanLevels[2 - 1]
          * G.challenge15Rewards.talismanBonus
      } else {
        G.talisman2Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[2 - 1]]!
          - negativeBonus)
          * player.talismanLevels[2 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus
      }

      if (player.talismanThree[i] === 1) {
        G.talisman3Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[3 - 1]]!
          + positiveBonus)
          * player.talismanLevels[3 - 1]
          * G.challenge15Rewards.talismanBonus
      } else {
        G.talisman3Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[3 - 1]]!
          - negativeBonus)
          * player.talismanLevels[3 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus
      }

      if (player.talismanFour[i] === 1) {
        G.talisman4Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[4 - 1]]!
          + positiveBonus)
          * player.talismanLevels[4 - 1]
          * G.challenge15Rewards.talismanBonus
      } else {
        G.talisman4Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[4 - 1]]!
          - negativeBonus)
          * player.talismanLevels[4 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus
      }

      if (player.talismanFive[i] === 1) {
        G.talisman5Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[5 - 1]]!
          + positiveBonus)
          * player.talismanLevels[5 - 1]
          * G.challenge15Rewards.talismanBonus
      } else {
        G.talisman5Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[5 - 1]]!
          - negativeBonus)
          * player.talismanLevels[5 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus
      }

      if (player.talismanSix[i] === 1) {
        G.talisman6Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[6 - 1]]!
          + positiveBonus)
          * player.talismanLevels[6 - 1]
          * G.challenge15Rewards.talismanBonus
      } else {
        G.talisman6Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[6 - 1]]!
          - negativeBonus)
          * player.talismanLevels[6 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus
      }

      if (player.talismanSeven[i] === 1) {
        G.talisman7Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[7 - 1]]!
          + positiveBonus)
          * player.talismanLevels[7 - 1]
          * G.challenge15Rewards.talismanBonus
      } else {
        G.talisman7Effect[i] = (G.talismanNegativeModifier[player.talismanRarity[7 - 1]]!
          - negativeBonus)
          * player.talismanLevels[7 - 1]
          * -1
          * G.challenge15Rewards.talismanBonus
      }
    }
  } else {
    for (let i = 1; i <= 5; i++) {
      G.talisman1Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[1 - 1]]!
        + positiveBonus)
        * player.talismanLevels[1 - 1]
        * G.challenge15Rewards.talismanBonus
      G.talisman2Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[2 - 1]]!
        + positiveBonus)
        * player.talismanLevels[2 - 1]
        * G.challenge15Rewards.talismanBonus
      G.talisman3Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[3 - 1]]!
        + positiveBonus)
        * player.talismanLevels[3 - 1]
        * G.challenge15Rewards.talismanBonus
      G.talisman4Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[4 - 1]]!
        + positiveBonus)
        * player.talismanLevels[4 - 1]
        * G.challenge15Rewards.talismanBonus
      G.talisman5Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[5 - 1]]!
        + positiveBonus)
        * player.talismanLevels[5 - 1]
        * G.challenge15Rewards.talismanBonus
      G.talisman6Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[6 - 1]]!
        + positiveBonus)
        * player.talismanLevels[6 - 1]
        * G.challenge15Rewards.talismanBonus
      G.talisman7Effect[i] = (G.talismanPositiveModifier[player.talismanRarity[7 - 1]]!
        + positiveBonus)
        * player.talismanLevels[7 - 1]
        * G.challenge15Rewards.talismanBonus
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
        * G.challenge15Rewards.blessingBonus
    } else if (G.runeBlessings[i] > 1e30) {
      G.effectiveRuneBlessingPower[i] = ((Math.pow(10, 5 / 2) * Math.pow(G.runeBlessings[i], 1 / 24)) / 75)
        * G.challenge15Rewards.blessingBonus
    }

    if (G.runeSpirits[i] <= 1e25) {
      G.effectiveRuneSpiritPower[i] = (Math.pow(G.runeSpirits[i], 1 / 8) / 75)
        * G.challenge15Rewards.spiritBonus
    } else if (G.runeSpirits[i] > 1e25) {
      G.effectiveRuneSpiritPower[i] = ((Math.pow(10, 25 / 12) * Math.pow(G.runeSpirits[i], 1 / 24)) / 75)
        * G.challenge15Rewards.spiritBonus
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
  bonusLevels *= G.challenge15Rewards.bonusAntLevel
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

const calculateAntSacrificeMultipliers = () => {
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

  const maxCap = 1e300
  const rewardsMult = Math.min(maxCap, G.timeMultiplier * G.upgradeMultiplier)
  const rewards: IAntSacRewards = {
    antSacrificePoints: (G.effectiveELO * rewardsMult) / 85,
    offerings: Math.min(
      maxCap,
      (player.offeringpersecond * 0.15 * G.effectiveELO * rewardsMult) / 180
    ),
    obtainium: Math.min(
      maxCap,
      (player.maxobtainiumpersecond * 0.24 * G.effectiveELO * rewardsMult) / 180
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
  await calculateOffline(timeUse)
}

export const calculateOffline = async (forceTime = 0) => {
  disableHotkeys()

  G.timeWarp = true

  // Variable Declarations i guess
  const maximumTimer = 86400 * 3
    + 7200 * 2 * player.researches[31]
    + 7200 * 2 * player.researches[32]
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

  G.timeMultiplier = calculateTimeAcceleration().mult
  calculateObtainium()
  const obtainiumGain = calculateAutomaticObtainium()

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
    quarks: quarkHandler().gain // Calculate this after the fact
  }

  addTimers('ascension', timeAdd)
  addTimers('quarks', timeAdd)
  addTimers('goldenQuarks', timeAdd)
  addTimers('singularity', timeAdd)
  addTimers('octeracts', timeTick)
  addTimers('ambrosia', timeAdd)

  player.prestigeCount += resetAdd.prestige
  player.transcendCount += resetAdd.transcension
  player.reincarnationCount += resetAdd.reincarnation
  timerAdd.ascension = player.ascensionCounter - timerAdd.ascension
  timerAdd.quarks = quarkHandler().gain - timerAdd.quarks

  // 200 simulated all ticks [July 12, 2021]
  const runOffline = setInterval(() => {
    G.timeMultiplier = calculateTimeAcceleration().mult
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

  DOMCacheGetOrSet('offlinePrestigeCountNumber').textContent = format(
    resetAdd.prestige,
    0,
    true
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

  await saveSynergy()

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
    DOMCacheGetOrSet('exitOffline').style.visibility = 'hidden'
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
  calculateObtainium()
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
  return Math.pow(calculateTotalOcteractQuarkBonus(), 1.5)
}

export const calculateTotalOcteractObtainiumBonus = () => {
  if (!player.singularityChallenges.noOcteracts.rewards.obtainiumBonus) {
    return 1
  }
  return Math.pow(calculateTotalOcteractQuarkBonus(), 1.4)
}

export const calculateAllCubeMultiplier = () => {
  const arr = [
    // Ascension Time Multiplier to cubes
    Math.pow(Math.min(1, player.ascensionCounter / 10), 2)
    * (1
      + ((1 / 4) * player.achievements[204]
          + (1 / 4) * player.achievements[211]
          + (1 / 2) * player.achievements[218])
        * Math.max(0, player.ascensionCounter / 10 - 1)),
    // Sun and Moon achievements
    1
    + (6 / 100) * player.achievements[250]
    + (10 / 100) * player.achievements[251],
    // Speed Achievement
    1
    + player.achievements[240]
      * Math.min(
        0.5,
        Math.max(
          0.1,
          (1 / 20) * Math.log10(calculateTimeAcceleration().mult + 0.01)
        )
      ),
    // Challenge 15: All Cube Gain bonuses 1-5
    G.challenge15Rewards.cube1
    * G.challenge15Rewards.cube2
    * G.challenge15Rewards.cube3
    * G.challenge15Rewards.cube4
    * G.challenge15Rewards.cube5,
    // Rune 6: Infinite Ascent
    1 + (1 / 100) * calculateEffectiveIALevel(),
    // BETA: 2x Cubes
    1 + player.platonicUpgrades[10],
    // OMEGA: C9 Cube Bonus
    Math.pow(
      1.01,
      player.platonicUpgrades[15] * player.challengecompletions[9]
    ),
    // Powder Bonus
    calculateCubeMultFromPowder(),
    // Event
    1 + calculateEventBuff(BuffType.Cubes),
    // Singularity Factor
    1 / calculateSingularityDebuff('Cubes'),
    // Wow Pass Y
    1 + (0.75 * player.shopUpgrades.seasonPassY) / 100,
    // BUY THIS! Golden Quark Upgrade
    1 + 4 * (player.singularityUpgrades.starterPack.getEffect().bonus ? 1 : 0),
    // Cube Flame [GQ]
    +player.singularityUpgrades.singCubes1.getEffect().bonus,
    // Cube Blaze [GQ]
    +player.singularityUpgrades.singCubes2.getEffect().bonus,
    // Cube Inferno [GQ]
    +player.singularityUpgrades.singCubes3.getEffect().bonus,
    // Wow Pass Z
    1 + (player.shopUpgrades.seasonPassZ * player.singularityCount) / 100,
    // Cookie Upgrade 16
    1 + 1 * player.cubeUpgrades[66] * (1 - player.platonicUpgrades[15]),
    // Cookie Upgrade 8 (now actually works)
    1 + 0.25 * +G.isEvent * player.cubeUpgrades[58],
    // Wow Octeract Bonus
    calculateTotalOcteractCubeBonus(),
    // No Singularity Upgrades Challenge
    +player.singularityChallenges.noSingularityUpgrades.rewards.cubes,
    // Singularity Citadel
    +player.singularityUpgrades.singCitadel.getEffect().bonus,
    // Singularity Citadel 2
    +player.singularityUpgrades.singCitadel2.getEffect().bonus,
    // Platonic DELTA
    1
    + +player.singularityUpgrades.platonicDelta.getEffect().bonus
      * Math.min(9, player.singularityCounter / (3600 * 24)),
    // Wow Pass INF
    Math.pow(1.02, player.shopUpgrades.seasonPassInfinity),
    // Ambrosia Mult
    calculateAmbrosiaCubeMult(),
    // Module - Tutorial
    +player.blueberryUpgrades.ambrosiaTutorial.bonus.cubes,
    // Module - Cubes 1
    +player.blueberryUpgrades.ambrosiaCubes1.bonus.cubes,
    // Module - Luck-Cube 1
    +player.blueberryUpgrades.ambrosiaLuckCube1.bonus.cubes,
    // Module - Quark-Cube 1
    +player.blueberryUpgrades.ambrosiaQuarkCube1.bonus.cubes,
    // Module - Cubes 2
    +player.blueberryUpgrades.ambrosiaCubes2.bonus.cubes,
    // Module - Hyperflux
    +player.blueberryUpgrades.ambrosiaHyperflux.bonus.hyperFlux,
    // 20 Ascension Challenge - X20 Bonus
    +calculateEXALTBonusMult(),
    // Cash Grab Ultra
    +calculateCashGrabCubeBonus(),
    // EX Ultra
    +calculateEXUltraCubeBonus(),
    // Total Global Cube Multipliers: 33
  ]

  const extraMult = G.isEvent && G.eventClicked ? 1.05 : 1
  return {
    mult: productContents(arr) * extraMult,
    list: arr
  }
}

export const calculateCubeMultiplier = (score = -1) => {
  if (score < 0) {
    score = calculateAscensionScore().effectiveScore
  }

  const arr = [
    // Ascension Score Multiplier
    Math.pow(score / 3000, 1 / 4.1),
    // Global Multiplier
    calculateAllCubeMultiplier().mult,
    // Season Pass 1
    1 + (2.25 * player.shopUpgrades.seasonPass) / 100,
    // Researches (Excl 8x25)
    (1 + player.researches[119] / 400) // 5x19
    * (1 + player.researches[120] / 400) // 5x20
    * (1 + player.researches[137] / 100) // 6x12
    * (1 + (0.9 * player.researches[152]) / 100) // 7x2
    * (1 + (0.8 * player.researches[167]) / 100) // 7x17
    * (1 + (0.7 * player.researches[182]) / 100) // 8x7
    * (1
      + (0.03 / 100) * player.researches[192] * player.antUpgrades[12 - 1]!) // 8x17
    * (1 + (0.6 * player.researches[197]) / 100), // 8x22
    // Research 8x25
    1 + (0.004 / 100) * player.researches[200],
    // Cube Upgrades
    (1 + player.cubeUpgrades[1] / 6) // 1x1
    * (1 + player.cubeUpgrades[11] / 11) // 2x1
    * (1 + 0.4 * player.cubeUpgrades[30]), // 3x10
    // Constant Upgrade 10
    1
    + 0.01
      * Decimal.log(player.ascendShards.add(1), 4)
      * Math.min(1, player.constantUpgrades[10]),
    // Achievement 189 Bonus
    1 + player.achievements[189] * Math.min(2, player.ascensionCount / 2.5e8),
    // Achievement 193 Bonus
    1
    + (player.achievements[193] * Decimal.log(player.ascendShards.add(1), 10))
      / 400,
    // Achievement 195 Bonus
    1
    + Math.min(
      250,
      (player.achievements[195]
        * Decimal.log(player.ascendShards.add(1), 10))
        / 400
    ),
    // Achievement 198-201 Bonus
    1
    + (4 / 100)
      * (player.achievements[198]
        + player.achievements[199]
        + player.achievements[200])
    + (3 / 100) * player.achievements[201],
    // Achievement 254 Bonus
    1
    + Math.min(0.15, (0.6 / 100) * Math.log10(score + 1))
      * player.achievements[254],
    // Spirit Power
    1 + (calculateCorruptionPoints() / 400) * G.effectiveRuneSpiritPower[2],
    // Platonic Cube Opening Bonus
    G.platonicBonusMultiplier[0],
    // Platonic 1x1
    1
    + 0.00009
      * sumContents(player.usedCorruptions)
      * player.platonicUpgrades[1],
    // Cube Upgrade 63 (Cx13)
    1
    + Math.pow(1.03, Math.log10(Math.max(1, player.wowAbyssals)))
      * player.cubeUpgrades[63]
    - player.cubeUpgrades[63]
    // Total Multipliers to cubes: 15
  ]

  // Decided to return a copy of list as well as the actual multiplier, instead of differentiating
  return {
    list: arr,
    mult: productContents(arr)
  }
}

export const calculateTesseractMultiplier = (score = -1) => {
  if (score < 0) {
    score = calculateAscensionScore().effectiveScore
  }

  const corrSum = sumContents(player.usedCorruptions.slice(2, 10))
  const arr = [
    // Ascension Score Multiplier
    Math.pow(1 + Math.max(0, score - 1e5) / 1e4, 0.35),
    // Global Multiplier
    calculateAllCubeMultiplier().mult,
    // Season Pass 1
    1 + (2.25 * player.shopUpgrades.seasonPass) / 100,
    // 10th Const Upgrade +Tesseract%
    1
    + 0.01
      * Decimal.log(player.ascendShards.add(1), 4)
      * Math.min(1, player.constantUpgrades[10]),
    // Cube Upgrade 3x10
    1 + 0.4 * player.cubeUpgrades[30],
    // Cube Upgrade 4x8
    1 + (1 / 200) * player.cubeUpgrades[38] * corrSum,
    // Achievement 195 Bonus
    1
    + Math.min(
      250,
      (player.achievements[195]
        * Decimal.log(player.ascendShards.add(1), 10))
        / 400
    ),
    // Achievement 202 Bonus
    1 + player.achievements[202] * Math.min(2, player.ascensionCount / 5e8),
    // Achievement 205-208 Bonus
    1
    + (4 / 100)
      * (player.achievements[205]
        + player.achievements[206]
        + player.achievements[207])
    + (3 / 100) * player.achievements[208],
    // Achievement 255 Bonus
    1
    + Math.min(0.15, (0.6 / 100) * Math.log10(score + 1))
      * player.achievements[255],
    // Platonic Cube Bonus
    G.platonicBonusMultiplier[1],
    // Platonic Upgrade 1x2
    1 + 0.00018 * corrSum * player.platonicUpgrades[2]
    // Total Tesseract Multipliers: 12
  ]

  return {
    list: arr,
    mult: productContents(arr)
  }
}

export const calculateHypercubeMultiplier = (score = -1) => {
  if (score < 0) {
    score = calculateAscensionScore().effectiveScore
  }

  const arr = [
    // Ascension Score Multiplier
    Math.pow(1 + Math.max(0, score - 1e9) / 1e8, 0.5),
    // Global Multiplier
    calculateAllCubeMultiplier().mult,
    // Season Pass 2
    1 + (1.5 * player.shopUpgrades.seasonPass2) / 100,
    // Achievement 212 - 215 Bonus
    1
    + (4 / 100)
      * (player.achievements[212]
        + player.achievements[213]
        + player.achievements[214])
    + (3 / 100) * player.achievements[215],
    // Achievement 216 Bonus
    1 + player.achievements[216] * Math.min(2, player.ascensionCount / 1e9),
    // Achievement 253 Bonus
    1 + (1 / 10) * player.achievements[253],
    // Achievement 256 Bonus
    1
    + Math.min(0.15, (0.6 / 100) * Math.log10(score + 1))
      * player.achievements[256],
    // Achievement 265 Bonus
    1 + Math.min(2, player.ascensionCount / 2.5e10) * player.achievements[265],
    // Platonic Cubes Opened Bonus
    G.platonicBonusMultiplier[2],
    // Platonic Upgrade 1x3
    1
    + 0.00054
      * sumContents(player.usedCorruptions)
      * player.platonicUpgrades[3],
    // Hyperreal Hepteract Bonus
    1 + (0.6 / 1000) * hepteractEffective('hyperrealism')
    // Total Hypercube Multipliers: 11
  ]

  return {
    list: arr,
    mult: productContents(arr)
  }
}

export const calculatePlatonicMultiplier = (score = -1) => {
  if (score < 0) {
    score = calculateAscensionScore().effectiveScore
  }

  const arr = [
    // Ascension Score Multiplier
    Math.pow(1 + Math.max(0, score - 2.666e12) / 2.666e11, 0.75),
    // Global Multipliers
    calculateAllCubeMultiplier().mult,
    // Season Pass 2
    1 + (1.5 * player.shopUpgrades.seasonPass2) / 100,
    // Achievement 196 Bonus
    1
    + Math.min(
      20,
      ((player.achievements[196] * 1) / 5000)
        * Decimal.log(player.ascendShards.add(1), 10)
    ),
    // Achievement 219-222 Bonus
    1
    + (4 / 100)
      * (player.achievements[219]
        + player.achievements[220]
        + player.achievements[221])
    + (3 / 100) * player.achievements[222],
    // Achievement 223 Bonus
    1 + player.achievements[223] * Math.min(2, player.ascensionCount / 1.337e9),
    // Achievement 257 Bonus
    1
    + Math.min(0.15, (0.6 / 100) * Math.log10(score + 1))
      * player.achievements[257],
    // Platonic Cube Opening Bonus
    G.platonicBonusMultiplier[3],
    // Platonic Upgrade 1x4
    1 + (1.2 * player.platonicUpgrades[4]) / 50
    // Total Platonic Multipliers: 9
  ]

  return {
    list: arr,
    mult: productContents(arr)
  }
}

export const calculateHepteractMultiplier = (score = -1) => {
  if (score < 0) {
    score = calculateAscensionScore().effectiveScore
  }

  const arr = [
    // Ascension Score Multiplier
    Math.pow(1 + Math.max(0, score - 1.666e16) / 3.33e16, 0.85),
    // Global Multiplier
    calculateAllCubeMultiplier().mult,
    // Season Pass 3
    1 + (1.5 * player.shopUpgrades.seasonPass3) / 100,
    // Achievement 258 Bonus
    1
    + Math.min(0.15, (0.6 / 100) * Math.log10(score + 1))
      * player.achievements[258],
    // Achievement 264 Bonus [Max: 8T Asc]
    1 + Math.min(0.4, player.ascensionCount / 2e13) * player.achievements[264],
    // Achievement 265 Bonus [Max: 160T Asc]
    1 + Math.min(0.2, player.ascensionCount / 8e14) * player.achievements[265],
    // Achievement 270 Bonus
    Math.min(
      2,
      1
        + (1 / 1000000)
          * Decimal.log(player.ascendShards.add(1), 10)
          * player.achievements[270]
    )
    // Total Hepteract Multipliers: 7
  ]

  return {
    list: arr,
    mult: productContents(arr)
  }
}

export const getOcteractValueMultipliers = () => {
  const corruptionLevelSum = sumContents(player.usedCorruptions.slice(2, 10))
  return [
    1 + (1.5 * player.shopUpgrades.seasonPass3) / 100,
    1 + (0.75 * player.shopUpgrades.seasonPassY) / 100,
    1 + (player.shopUpgrades.seasonPassZ * player.singularityCount) / 100,
    1 + player.shopUpgrades.seasonPassLost / 1000,
    // cube upgrade 70, ie Cx20
    1 + (+(corruptionLevelSum >= 14 * 8) * player.cubeUpgrades[70]) / 10000,
    1
    + +(corruptionLevelSum >= 14 * 8)
      * +player.singularityUpgrades.divinePack.getEffect().bonus,
    // next three are flame/blaze/inferno
    +player.singularityUpgrades.singCubes1.getEffect().bonus,
    +player.singularityUpgrades.singCubes2.getEffect().bonus,
    +player.singularityUpgrades.singCubes3.getEffect().bonus,
    // absinthe through eighth wonder
    +player.singularityUpgrades.singOcteractGain.getEffect().bonus,
    +player.singularityUpgrades.singOcteractGain2.getEffect().bonus,
    +player.singularityUpgrades.singOcteractGain3.getEffect().bonus,
    +player.singularityUpgrades.singOcteractGain4.getEffect().bonus,
    +player.singularityUpgrades.singOcteractGain5.getEffect().bonus,
    // Patreon bonus
    1
    + (player.worlds.BONUS / 100)
      * +player.singularityUpgrades.singOcteractPatreonBonus.getEffect().bonus,
    // octeracts for dummies
    1 + 0.2 * +player.octeractUpgrades.octeractStarter.getEffect().bonus,
    // cogenesis and trigenesis
    +player.octeractUpgrades.octeractGain.getEffect().bonus,
    +player.octeractUpgrades.octeractGain2.getEffect().bonus,
    derpsmithCornucopiaBonus(),
    // digital octeract accumulator
    Math.pow(
      1
        + +player.octeractUpgrades.octeractAscensionsOcteractGain.getEffect()
          .bonus,
      1 + Math.floor(Math.log10(1 + player.ascensionCount))
    ),
    1 + calculateEventBuff(BuffType.Octeract),
    1
    + +player.singularityUpgrades.platonicDelta.getEffect().bonus
      * Math.min(9, player.singularityCounter / (3600 * 24)),
    // No Singulairty Upgrades
    +player.singularityChallenges.noSingularityUpgrades.rewards.cubes,
    // Wow Pass INF
    Math.pow(1.02, player.shopUpgrades.seasonPassInfinity),
    // Ambrosia Mult
    calculateAmbrosiaCubeMult(),
    // Module- Tutorial
    +player.blueberryUpgrades.ambrosiaTutorial.bonus.cubes,
    // Module- Cubes 1
    +player.blueberryUpgrades.ambrosiaCubes1.bonus.cubes,
    // Module- Luck-Cube 1
    +player.blueberryUpgrades.ambrosiaLuckCube1.bonus.cubes,
    // Module- Quark-Cube 1
    +player.blueberryUpgrades.ambrosiaQuarkCube1.bonus.cubes,
    // Module- Cubes 2
    +player.blueberryUpgrades.ambrosiaCubes2.bonus.cubes,
    // Cash Grab ULTRA
    +calculateCashGrabCubeBonus(),
    // EX ULTRA
    +calculateEXUltraCubeBonus(),
  ]
}

export const octeractGainPerSecond = () => {
  const SCOREREQ = 1e23
  const currentScore = calculateAscensionScore().effectiveScore

  const baseMultiplier = currentScore >= SCOREREQ ? currentScore / SCOREREQ : 0

  const valueMultipliers = getOcteractValueMultipliers()

  const ascensionSpeed = player.singularityUpgrades.oneMind.getEffect().bonus
    ? Math.pow(10, 1 / 2)
    : Math.pow(calculateAscensionAcceleration(), 1 / 2)
  const oneMindModifier = player.singularityUpgrades.oneMind.getEffect().bonus
    ? Math.pow(
      calculateAscensionAcceleration() / 10,
      +player.octeractUpgrades.octeractOneMindImprover.getEffect().bonus
    )
    : 1
  const extraMult = G.isEvent && G.eventClicked ? 1.05 : 1
  const perSecond = (1 / (24 * 3600 * 365 * 1e15))
    * baseMultiplier
    * productContents(valueMultipliers)
    * ascensionSpeed
    * oneMindModifier
    * extraMult
  return perSecond
}

// This is an old calculation used only for Stats for Nerds
export const calculateOcteractMultiplier = (score = -1) => {
  const SCOREREQ = 1e23
  if (score < 0) {
    score = calculateAscensionScore().effectiveScore
  }

  const arr = getOcteractValueMultipliers()

  // add base score to the beginning and ascension speed mult to the end of the list
  arr.unshift(score >= SCOREREQ ? score / SCOREREQ : 0)
  const ascensionSpeed = calculateAscensionAcceleration()

  const ascensionSpeedMulti = player.singularityUpgrades.oneMind.getEffect()
      .bonus
    ? Math.pow(10, 1 / 2)
      * Math.pow(
        ascensionSpeed / 10,
        +player.octeractUpgrades.octeractOneMindImprover.getEffect().bonus
      )
    : Math.pow(ascensionSpeed, 1 / 2)
  arr.push(ascensionSpeedMulti)

  return {
    list: arr,
    mult: productContents(arr)
  }
}

export const calculateTimeAcceleration = () => {
  const preCorruptionArr = [
    1 + (1 / 300) * Math.log10(player.maxobtainium + 1) * player.upgrades[70], // Particle upgrade 2x5
    1 + player.researches[121] / 50, // research 5x21
    1 + 0.015 * player.researches[136], // research 6x11
    1 + 0.012 * player.researches[151], // research 7x1
    1 + 0.009 * player.researches[166], // research 7x16
    1 + 0.006 * player.researches[181], // research 8x6
    1 + 0.003 * player.researches[196], // research 8x21
    1 + 8 * G.effectiveRuneBlessingPower[1], // speed blessing
    1 + (calculateCorruptionPoints() / 400) * G.effectiveRuneSpiritPower[1], // speed SPIRIT
    G.cubeBonusMultiplier[10], // Chronos cube blessing
    1 + player.cubeUpgrades[18] / 5, // cube upgrade 2x8
    calculateSigmoid(2, player.antUpgrades[12 - 1]! + G.bonusant12, 69), // ant 12
    1 + 0.1 * (player.talismanRarity[2 - 1] - 1), // Chronos Talisman bonus
    G.challenge15Rewards.globalSpeed, // Challenge 15 reward
    1 + 0.01 * player.cubeUpgrades[52] // cube upgrade 6x2 (Cx2)
  ]

  // Global Speed softcap + Corruption / Corruption-like effects
  const corruptionArr: number[] = [
    G.lazinessMultiplier[player.usedCorruptions[3]] // Corruption:  Spacial Dilation
  ]

  const corruptableTimeMult = productContents(preCorruptionArr) * corruptionArr[0] // DR applies after base corruption.

  if (corruptableTimeMult > 100) {
    const postSoftcap = 10 * Math.sqrt(corruptableTimeMult)
    const softcapRatio = postSoftcap / corruptableTimeMult

    corruptionArr.push(softcapRatio)
  } else {
    corruptionArr.push(1)
  }

  if (corruptableTimeMult < 1) {
    const postPlat2x2 = Math.pow(
      corruptableTimeMult,
      1 - player.platonicUpgrades[7] / 30
    )
    const plat2x2Ratio = postPlat2x2 / corruptableTimeMult

    corruptionArr.push(plat2x2Ratio)
  } else {
    corruptionArr.push(1)
  }

  corruptionArr.push(1.0 / calculateSingularityDebuff('Global Speed'))

  // Uncorruptable effects
  const postCorruptionArr = [
    G.platonicBonusMultiplier[7], // Chronos statue
    1 + (player.singularityUpgrades.intermediatePack.getEffect().bonus ? 1 : 0),
    1
    + +player.octeractUpgrades.octeractImprovedGlobalSpeed.getEffect().bonus
      * player.singularityCount
  ]

  const timeMult = productContents(preCorruptionArr)
    * productContents(corruptionArr)
    * productContents(postCorruptionArr)

  if (player.usedCorruptions[3] >= 6 && player.achievements[241] < 1) {
    achievementaward(241)
  }
  if (timeMult > 3600 && player.achievements[242] < 1) {
    achievementaward(242)
  }

  return {
    preList: preCorruptionArr,
    drList: corruptionArr,
    postList: postCorruptionArr,
    mult: timeMult
  }
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

export const calculateAscensionSpeedMultiplier = () => {
  const arr = [
    1 + (1.2 / 100) * player.shopUpgrades.chronometer, // Chronometer
    1 + (0.6 / 100) * player.shopUpgrades.chronometer2, // Chronometer 2
    1 + (1.5 / 100) * player.shopUpgrades.chronometer3, // Chronometer 3
    1 + (0.6 / 1000) * hepteractEffective('chronos'), // Chronos Hepteract
    1
    + Math.min(0.1, (1 / 100) * Math.log10(player.ascensionCount + 1))
      * player.achievements[262], // Achievement 262 Bonus
    1
    + Math.min(0.1, (1 / 100) * Math.log10(player.ascensionCount + 1))
      * player.achievements[263], // Achievement 263 Bonus
    1
    + 0.002 * sumContents(player.usedCorruptions) * player.platonicUpgrades[15], // Platonic Omega
    G.challenge15Rewards.ascensionSpeed, // Challenge 15 Reward
    1 + (1 / 400) * player.cubeUpgrades[59], // Cookie Upgrade 9
    1
    + 0.5
      * (player.singularityUpgrades.intermediatePack.getEffect().bonus ? 1 : 0), // Intermediate Pack, Sing Shop
    1 + (1 / 1000) * player.singularityCount * player.shopUpgrades.chronometerZ, // Chronometer Z
    1
    + +player.octeractUpgrades.octeractImprovedAscensionSpeed.getEffect()
        .bonus
      * player.singularityCount, // Abstract Photokinetics, Oct Upg
    1
    + +player.octeractUpgrades.octeractImprovedAscensionSpeed2.getEffect()
        .bonus
      * player.singularityCount, // Abstract Exokinetics, Oct Upg
    1 + calculateEventBuff(BuffType.AscensionSpeed), // Event
    player.singularityUpgrades.singAscensionSpeed2.level > 0
      && player.runelevels[6] < 1
      ? 6
      : 1, // A mediocre ascension speedup!
    Math.pow(1.01, player.shopUpgrades.chronometerInfinity), // Chronometer INF
    1 / calculateLimitedAscensionsDebuff(), // EXALT Debuff
    Math.pow(
      1
        + +player.singularityChallenges.limitedAscensions.rewards
          .ascensionSpeedMult,
      1 + Math.max(0, Math.floor(Math.log10(player.ascensionCount)))
    ) // EXALT Buff                                                                                                 // EXALT Buff
  ]

  // A hecking good ascension speedup!
  const baseMultiplier = productContents(arr)
  const exponent = player.singularityUpgrades.singAscensionSpeed.level > 0
    ? baseMultiplier >= 1
      ? 1.03
      : 0.97
    : 1
  arr.push(Math.pow(baseMultiplier, exponent) / baseMultiplier)

  // Singularity Penalty
  arr.push(1 / calculateSingularityDebuff('Ascension Speed'))

  let multiplier = productContents(arr)
  if (!isFinite(multiplier)) {
    multiplier = 0
  }

  return {
    list: arr,
    mult: multiplier
  }
}

export const calculateAscensionAcceleration = () => {
  return calculateAscensionSpeedMultiplier().mult
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

export const calculateQuarkMultiplier = () => {
  let multiplier = 1
  if (player.achievementPoints > 0) {
    // Achievement Points
    multiplier += player.achievementPoints / 25000 // Cap of +0.20 at 5,000 Pts
  }
  if (player.achievements[250] > 0) {
    // Max research 8x25
    multiplier += 0.1
  }
  if (player.achievements[251] > 0) {
    // Max Wow! Cube Upgrade 5x10
    multiplier += 0.1
  }
  if (player.platonicUpgrades[5] > 0) {
    // Platonic ALPHA upgrade
    multiplier += 0.2
  }
  if (player.platonicUpgrades[10] > 0) {
    // Platonic BETA Upgrade
    multiplier += 0.25
  }
  if (player.platonicUpgrades[15] > 0) {
    // Platonic OMEGA upgrade
    multiplier += 0.3
  }
  if (player.challenge15Exponent >= 1e11) {
    // Challenge 15: Exceed 1e11 exponent reward
    multiplier += G.challenge15Rewards.quarks - 1
  }
  if (player.shopUpgrades.infiniteAscent) {
    // Purchased Infinite Ascent Rune
    multiplier *= 1.1 + (0.15 / 75) * calculateEffectiveIALevel()
  }
  if (player.challenge15Exponent >= 1e15) {
    // Challenge 15: Exceed 1e15 exponent reward
    multiplier *= 1 + (5 / 10000) * hepteractEffective('quark')
  }
  if (player.overfluxPowder > 0) {
    // Overflux Powder [Max: 10% at 10,000]
    multiplier *= calculateQuarkMultFromPowder()
  }
  if (player.achievements[266] > 0) {
    // Achievement 266 [Max: 10% at 1Qa Ascensions]
    multiplier *= 1 + Math.min(0.1, player.ascensionCount / 1e16)
  }
  if (player.singularityCount > 0) {
    // Singularity Modifier
    multiplier *= 1 + player.singularityCount / 10
  }
  if (G.isEvent) {
    multiplier *= 1
      + calculateEventBuff(BuffType.Quark)
      + calculateEventBuff(BuffType.OneMind)
  }
  if (player.cubeUpgrades[53] > 0) {
    // Cube Upgrade 6x3 (Cx3)
    multiplier *= 1 + (0.1 * player.cubeUpgrades[53]) / 100
  }
  if (player.cubeUpgrades[68] > 0) {
    // Cube Upgrade 7x8
    multiplier *= 1
      + (1 / 10000) * player.cubeUpgrades[68]
      + 0.05 * Math.floor(player.cubeUpgrades[68] / 1000)
  }

  multiplier *= calculateSingularityQuarkMilestoneMultiplier()

  multiplier *= +player.octeractUpgrades.octeractQuarkGain.getEffect().bonus // Oct Improver 1
  multiplier *= 1 + 0.3 * +player.octeractUpgrades.octeractStarter.getEffect().bonus // Oct Starter Pack

  multiplier *= 1
    + (1 / 10000)
      * Math.floor(player.octeractUpgrades.octeractQuarkGain.level / 111)
      * player.octeractUpgrades.octeractQuarkGain2.level
      * Math.floor(1 + Math.log10(Math.max(1, player.hepteractCrafts.quark.BAL))) // Improver 2

  multiplier *= 1
    + 0.02 * player.singularityUpgrades.intermediatePack.level // 1.02
    + 0.04 * player.singularityUpgrades.advancedPack.level // 1.06
    + 0.06 * player.singularityUpgrades.expertPack.level // 1.12
    + 0.08 * player.singularityUpgrades.masterPack.level // 1.20
    + 0.1 * player.singularityUpgrades.divinePack.level // 1.30

  multiplier *= 1 + +player.singularityUpgrades.singQuarkImprover1.getEffect().bonus // Doohickey
  multiplier *= calculateTotalOcteractQuarkBonus()

  multiplier *= calculateAmbrosiaQuarkMult()
  multiplier *= +player.blueberryUpgrades.ambrosiaTutorial.bonus.quarks
  multiplier *= +player.blueberryUpgrades.ambrosiaQuarks1.bonus.quarks
  multiplier *= +player.blueberryUpgrades.ambrosiaCubeQuark1.bonus.quarks
  multiplier *= +player.blueberryUpgrades.ambrosiaLuckQuark1.bonus.quarks
  multiplier *= +player.blueberryUpgrades.ambrosiaQuarks2.bonus.quarks
  multiplier *= calculateCashGrabQuarkBonus()

  if (player.highestSingularityCount === 0) {
    multiplier *= 1.25
  }

  return multiplier
}

/**
 * Calculate the number of Golden Quarks earned in current singularity
 */
export const calculateGoldenQuarkMultiplier = (computeMultiplier = false) => {
  const base = 2 * player.singularityCount + 10

  let bonus = player.singularityCount < 10 ? 200 - 10 * player.singularityCount : 0
  if (player.singularityCount === 0) {
    bonus += 200
  }

  let perkMultiplier = 1
  if (player.highestSingularityCount >= 200) {
    perkMultiplier = 3
  }
  if (player.highestSingularityCount >= 208) {
    perkMultiplier = 5
  }
  if (player.highestSingularityCount >= 221) {
    perkMultiplier = 8
  }

  const arr = [
    1 + Math.max(0, Math.log10(player.challenge15Exponent + 1) - 20) / 2, // Challenge 15 Exponent
    1 + player.worlds.BONUS / 100, // Patreon Bonus
    +player.singularityUpgrades.goldenQuarks1.getEffect().bonus, // Golden Quarks I
    1 + 0.12 * player.cubeUpgrades[69], // Cookie Upgrade 19
    +player.singularityChallenges.noSingularityUpgrades.rewards.goldenQuarks, // No Singularity Upgrades
    1 + calculateEventBuff(BuffType.GoldenQuark), // Event
    1 + getFastForwardTotalMultiplier(), // Singularity Fast Forwards
    player.highestSingularityCount >= 100
      ? 1 + Math.min(1, player.highestSingularityCount / 250)
      : 1, // Golden Revolution II
    perkMultiplier // Immaculate Alchemy
  ]

  // Total Quarks Coefficient
  arr.push(
    computeMultiplier
      ? 1 / 1e5
      : ((base + player.quarksThisSingularity / 1e5) * productContents(arr)
        + bonus)
        / productContents(arr)
  )

  return {
    list: arr,
    mult: productContents(arr)
  }
}

export const calculateGoldenQuarkGain = (computeMultiplier = false): number => {
  return calculateGoldenQuarkMultiplier(computeMultiplier).mult
}

export const calculateCorruptionPoints = () => {
  let basePoints = 400
  const bonusLevel = player.singularityUpgrades.corruptionFifteen.getEffect()
      .bonus
    ? 1
    : 0

  for (let i = 1; i <= 9; i++) {
    basePoints += 16 * Math.pow(player.usedCorruptions[i] + bonusLevel, 2)
  }

  return basePoints
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
  multiplier *= G.challenge15Rewards.score
  multiplier *= G.platonicBonusMultiplier[6]

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
  let corruptionMultiplier = 1
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
  for (let i = 2; i < 10; i++) {
    const exponent = i === 2 && player.usedCorruptions[i] >= 10
      ? 1
        + 2 * Math.min(1, player.platonicUpgrades[17])
        + 0.04 * player.platonicUpgrades[17]
      : 1
    corruptionMultiplier *= Math.pow(
      G.corruptionPointMultipliers[player.usedCorruptions[i] + bonusLevel],
      exponent
    ) + bonusVal

    if (
      player.usedCorruptions[i] >= 14
      && player.singularityUpgrades.masterPack.getEffect().bonus
    ) {
      corruptionMultiplier *= 1.1
    }
  }

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
    ? calculateAscensionAcceleration() / 10
    : 1

  // Calculation of Cubes :)
  let cubeGain = cubeBank
  cubeGain *= calculateCubeMultiplier(effectiveScore).mult
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
  tesseractGain *= calculateTesseractMultiplier(effectiveScore).mult
  tesseractGain *= oneMindModifier

  // Calculation of Hypercubes :)))
  let hypercubeGain = effectiveScore >= 1e9 ? 1 : 0
  hypercubeGain *= calculateHypercubeMultiplier(effectiveScore).mult
  hypercubeGain *= oneMindModifier

  // Calculation of Platonic Cubes :))))
  let platonicGain = effectiveScore >= 2.666e12 ? 1 : 0
  platonicGain *= calculatePlatonicMultiplier(effectiveScore).mult
  platonicGain *= oneMindModifier

  // Calculation of Hepteracts :)))))
  let hepteractGain = G.challenge15Rewards.hepteractUnlocked
      && effectiveScore >= 1.666e17
      && player.achievements[255] > 0
    ? 1
    : 0
  hepteractGain *= calculateHepteractMultiplier(effectiveScore).mult
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

    if (player.ascensionCounter >= 10) {
      if (player.achievements[188] > 0) {
        ascCount += 99
      }

      ascCount *= 1
        + (player.ascensionCounter / 10 - 1)
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
    ascCount *= G.challenge15Rewards.ascensions
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
      ? calculateAscensionAcceleration() / 10
      : 1
  }

  return Math.floor(ascCount)
}

/**
 * Calculates the product of all Powder bonuses.
 * @returns The amount of Powder gained per Expired Orb on day reset
 */
export const calculatePowderConversion = () => {
  const arr = [
    1 / 100, // base
    G.challenge15Rewards.powder, // Challenge 15: Powder Bonus
    1 + player.shopUpgrades.powderEX / 50, // powderEX shop upgrade, 2% per level max 20%
    1 + player.achievements[256] / 20, // Achievement 256, 5%
    1 + player.achievements[257] / 20, // Achievement 257, 5%
    1 + 0.01 * player.platonicUpgrades[16], // Platonic Upgrade 4x1
    1 + calculateEventBuff(BuffType.PowderConversion) // Event
  ]

  return {
    list: arr,
    mult: productContents(arr)
  }
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

export const calculateRequiredBlueberryTime = () => {
  let val = G.TIME_PER_AMBROSIA // Currently 600
  val += Math.floor(player.lifetimeAmbrosia / 30)

  const baseVal = val

  const timeThresholds = [
    5000,
    25000,
    75000,
    250000,
    500000,
    1e6,
    2e6,
    4e6,
    1e7,
    2e7,
    4e7,
    1e8
  ]
  for (const threshold of timeThresholds) {
    if (baseVal >= threshold) {
      val *= 2
    }
  }
  return val
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
  return 1 + player.shopUpgrades.shopCashGrabUltra * extra * Math.min(1, Math.pow(player.lifetimeAmbrosia / 1e7, 1/3))
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

export const calculateEXALTBonusMult = () => {
  if (!player.singularityChallenges.limitedAscensions.rewards.exaltBonus)
    return 1

  if (G.currentSingChallenge !== undefined) {
    return Math.pow(1.04, player.singularityChallenges[G.currentSingChallenge].completions)
  }
    return 1
}

export const calculateDilatedFiveLeafBonus = () => {
  const singThresholds = [100, 200, 250, 260, 266]
  for (let i = 0; i < singThresholds.length; i++) {
    if (player.highestSingularityCount <= singThresholds[i]) return i / 100
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
    player.overfluxPowder += player.overfluxOrbs * calculatePowderConversion().mult
    player.overfluxOrbs = G.challenge15Rewards.freeOrbs
  }
}

export const calculateEventBuff = (buff: BuffType) => {
  if (!G.isEvent) {
    return 0
  }
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
