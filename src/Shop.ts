import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateBaseObtainium,
  calculateBaseOfferings,
  calculateFreeShopInfinityUpgrades,
  calculateObtainium,
  calculateObtainiumPotionBaseObtainium,
  calculateOfferingPotionBaseOfferings,
  calculateOfferingsDecimal,
  calculatePotionValue,
  calculateSummationNonLinear,
  sumOfExaltCompletions
} from './Calculate'
import type { IMultiBuy } from './Cubes'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getRuneEffectiveLevel } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, Confirm, Prompt, revealStuff } from './UpdateHTML'
import { Globals as G } from './Variables'

export enum shopUpgradeTypes {
  CONSUMABLE = 'consume',
  UPGRADE = 'upgrade'
}

type QuarkShopUpgradeRewards = {
  offeringPotion: { skipSeconds: number }
  obtainiumPotion: { skipSeconds: number }
  offeringEX: { offeringMult: number }
  offeringEX2: { offeringMult: number }
  offeringEX3: { offeringMult: number; baseOfferings: number }
  obtainiumEX: { obtainiumMult: number }
  obtainiumEX2: { obtainiumMult: number }
  obtainiumEX3: { obtainiumMult: number; immaculateObtainiuMult: number }
  offeringAuto: { offeringMult: number; automaticSpending: boolean }
  obtainiumAuto: { obtainiumMult: number; automaticSpending: boolean }
  cashGrab: { obtainiumMult: number; offeringMult: number }
  cashGrab2: { obtainiumMult: number; offeringMult: number }
  shopTalisman: { talismanUnlocked: boolean }
  infiniteAscent: { runeUnlocked: boolean }
  shopSadisticRune: { runeUnlocked: boolean }
  antSpeed: { antELO: number }
  instantChallenge: { unlocked: boolean; extraCompPerTick: number }
  instantChallenge2: { unlocked: boolean; extraCompPerTick: number }
  challengeExtension: { reincarnationChallengeCap: number }
  challengeTome: { c10RequirementReduction: number; c9c10ScalingMultiplier: number }
  challengeTome2: { c10RequirementReduction: number; c9c10ScalingMultiplier: number }
  challenge15Auto: { unlocked: boolean }
  seasonPass: { wowCubeMult: number; wowTesseractMult: number }
  seasonPass2: { wowHypercubeMult: number; wowPlatonicMult: number }
  seasonPass3: { wowHepteractMult: number; wowOcteractMult: number }
  // Octeract Multipliers *ignore* Cube Multipliers. I still think this is probably a flawed design choice...
  seasonPassY: { globalCubeMult: number; wowOcteractMult: number }
  seasonPassZ: { globalCubeMult: number; wowOcteractMult: number }
  seasonPassLost: { wowOcteractMult: number }
  seasonPassInfinity: { globalCubeMult: number; wowOcteractMult: number }
  calculator: { addQuarkMult: number; autoAnswer: boolean; autoFill: boolean }
  calculator2: { addCodeCapacity: number; addQuarkMult: number }
  calculator3: { addRewardVarianceMultiplier: number; ascensionTimerAdd: number }
  calculator4: { addCodeIntervalMult: number; addCodeCapacity: number }
  calculator5: { importGQTimerAdd: number; addCodeCapacity: number }
  calculator6: { octeractTimerAdd: number; addCodeCapacity: number }
  calculator7: { blueberryTimerAdd: number; addCodeCapacity: number }
  chronometer: { ascensionSpeedMult: number }
  chronometer2: { ascensionSpeedMult: number }
  chronometer3: { ascensionSpeedMult: number }
  chronometerZ: { ascensionSpeedMult: number }
  shopChronometerS: { ascensionSpeedMult: number; globalSpeedMult: number }
  chronometerInfinity: { ascensionSpeedMult: number; exponentSpread: number }
  improveQuarkHept: { quarkHeptExponent: number }
  improveQuarkHept2: { quarkHeptExponent: number }
  improveQuarkHept3: { quarkHeptExponent: number }
  improveQuarkHept4: { quarkHeptExponent: number }
  improveQuarkHept5: { quarkHeptExponent: number }
  cubeToQuark: { cubeQuarkMult: number }
  tesseractToQuark: { tesseractQuarkMult: number }
  hypercubeToQuark: { hypercubeQuarkMult: number }
  cubeToQuarkAll: { cubeQuarkMult: number; tesseractQuarkMult: number; hypercubeQuarkMult: number }
  shopImprovedDaily: { dailyCodeQuarkMult: number }
  shopImprovedDaily2: { freeSingularityUpgrades: number; dailyCodeGoldenQuarkMult: number }
  shopImprovedDaily3: { freeSingularityUpgrades: number; dailyCodeGoldenQuarkMult: number }
  shopImprovedDaily4: { freeSingularityUpgrades: number; dailyCodeGoldenQuarkMult: number }
  constantEX: { maxPercentIncrease: number }
  powderEX: { orbToPowderConversionMult: number }
  powderAuto: { automaticPowderFraction: number }
  autoWarp: { unlocked: boolean }
  extraWarp: { additionalWarps: number }
  shopAmbrosiaGeneration1: { ambrosiaGenerationMult: number }
  shopAmbrosiaGeneration2: { ambrosiaGenerationMult: number }
  shopAmbrosiaGeneration3: { ambrosiaGenerationMult: number }
  shopAmbrosiaGeneration4: { ambrosiaGenerationMult: number }
  shopAmbrosiaAccelerator: { ambrosiaPointRequirementMult: number }
  shopAmbrosiaLuck1: { ambrosiaLuck: number }
  shopAmbrosiaLuck2: { ambrosiaLuck: number }
  shopAmbrosiaLuck3: { ambrosiaLuck: number }
  shopAmbrosiaLuck4: { ambrosiaLuck: number }
  shopAmbrosiaLuckMultiplier4: { additiveAmbrosiaLuckMult: number }
  shopOcteractAmbrosiaLuck: { ambrosiaLuck: number }
  shopAmbrosiaUltra: { ambrosiaLuck: number }
  shopRedLuck1: { redLuck: number; luckConversionRatio: number }
  shopRedLuck2: { redLuck: number; luckConversionRatio: number }
  shopRedLuck3: { redLuck: number; luckConversionRatio: number }
  shopHorseShoe: { bonusHorseLevels: number; singularityPenaltyMult: number }
  shopInfiniteShopUpgrades: { infiniteVouchers: number }
  shopSingularityPenaltyDebuff: { singularityPenaltyReducers: number }
  shopCashGrabUltra: { ambrosiaGenerationMult: number; cubesMult: number; quarkMult: number }
  shopEXUltra: { offeringMult: number; obtainiumMult: number; cubeMult: number }
  shopSingularitySpeedup: { singularityUpgradeSpeedMult: number }
  shopSingularityPotency: { freeUpgradeMult: number }
}

export type ShopUpgradeNames = keyof QuarkShopUpgradeRewards

interface IShopData<T extends ShopUpgradeNames> {
  name: () => string
  description: () => string
  effects: (n: number) => QuarkShopUpgradeRewards[T]
  effectDescription: () => string
  refundable: boolean
  resetOnSingularity: () => boolean
  isUnlocked: () => boolean
  price: number
  priceIncrease: number
  maxLevel: number
  type: shopUpgradeTypes
  refundMinimumLevel: number
}

const resetNever = () => false
const resetUntilSingularity10 = () => player.highestSingularityCount < 10
const resetUntilSingularity50 = () => player.highestSingularityCount < 50

export const shopUpgrades: { [K in ShopUpgradeNames]: IShopData<K> } = {
  offeringPotion: {
    name: () => i18next.t('shop.names.offeringPotion'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringPotion'),
    effects: (_n: number) => ({ skipSeconds: 7200 }),
    effectDescription: () => {
      const amount = format(
        calculatePotionValue(player.prestigecounter, calculateOfferingsDecimal(), calculateBaseOfferings()),
        2,
        true
      )
      const amount2 = format(player.shopPotionsConsumed.offering, 0, true)
      const amount3 = format(calculateOfferingPotionBaseOfferings().amount, 0, true)
      const amount4 = format(calculateOfferingPotionBaseOfferings().toNext, 0, true)
      return i18next.t('shop.upgradeEffects.offeringPotion', { amount, amount2, amount3, amount4 })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 100,
    priceIncrease: 0,
    maxLevel: Math.pow(10, 15),
    type: shopUpgradeTypes.CONSUMABLE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  obtainiumPotion: {
    name: () => i18next.t('shop.names.obtainiumPotion'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumPotion'),
    effects: (_n: number) => ({ skipSeconds: 7200 }),
    effectDescription: () => {
      const amount = format(
        calculatePotionValue(player.reincarnationcounter, calculateObtainium(), calculateBaseObtainium()),
        2,
        true
      )
      const amount2 = format(player.shopPotionsConsumed.obtainium, 0, true)
      const amount3 = format(calculateObtainiumPotionBaseObtainium().amount, 0, true)
      const amount4 = format(calculateObtainiumPotionBaseObtainium().toNext, 0, true)
      return i18next.t('shop.upgradeEffects.obtainiumPotion', {
        amount,
        amount2,
        amount3,
        amount4
      })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 100,
    priceIncrease: 0,
    maxLevel: Math.pow(10, 15),
    type: shopUpgradeTypes.CONSUMABLE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  offeringEX: {
    name: () => i18next.t('shop.names.offeringEX'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringEX'),
    effects: (n: number) => ({ offeringMult: 1 + 0.04 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('offeringEX').offeringMult
      return i18next.t('shop.upgradeEffects.offeringEX', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 0
  },
  offeringAuto: {
    name: () => i18next.t('shop.names.offeringAuto'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringAuto'),
    effects: (n: number) => ({ offeringMult: 1 + 0.02 * n, automaticSpending: n > 0 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('offeringAuto')
      return i18next.t('shop.upgradeEffects.offeringAuto', {
        amount: effects.automaticSpending ? 1 : 0,
        amount2: formatAsPercentIncrease(effects.offeringMult, 0)
      })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 1
  },
  obtainiumEX: {
    name: () => i18next.t('shop.names.obtainiumEX'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumEX'),
    effects: (n: number) => ({ obtainiumMult: 1 + 0.04 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('obtainiumEX').obtainiumMult
      return i18next.t('shop.upgradeEffects.obtainiumEX', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 0
  },
  obtainiumAuto: {
    name: () => i18next.t('shop.names.obtainiumAuto'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumAuto'),
    effects: (n: number) => ({ obtainiumMult: 1 + 0.02 * n, automaticSpending: n > 0 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('obtainiumAuto')
      return i18next.t('shop.upgradeEffects.obtainiumAuto', {
        amount: formatAsPercentIncrease(effects.obtainiumMult, 0)
      })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 1
  },
  instantChallenge: {
    name: () => i18next.t('shop.names.instantChallenge'),
    description: () => i18next.t('shop.upgradeDescriptions.instantChallenge'),
    effects: (n: number) => ({ unlocked: n > 0, extraCompPerTick: 10 * n }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.instantChallenge')
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 300,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  antSpeed: {
    name: () => i18next.t('shop.names.antSpeed'),
    description: () => i18next.t('shop.upgradeDescriptions.antSpeed'),
    effects: (n: number) => ({ antELO: 4 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('antSpeed').antELO
      return i18next.t('shop.upgradeEffects.antSpeed', { amount: format(effect) })
    },
    isUnlocked: () =>
      player.highestchallengecompletions[10] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 200,
    priceIncrease: 25,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 0
  },
  cashGrab: {
    name: () => i18next.t('shop.names.cashGrab'),
    description: () => i18next.t('shop.upgradeDescriptions.cashGrab'),
    effects: (n: number) => ({ obtainiumMult: 1 + 0.01 * n, offeringMult: 1 + 0.01 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('cashGrab')
      return i18next.t('shop.upgradeEffects.cashGrab', { amount: formatAsPercentIncrease(effects.obtainiumMult, 0) })
    },
    isUnlocked: () =>
      player.highestchallengecompletions[8] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 100,
    priceIncrease: 40,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 0
  },
  shopTalisman: {
    name: () => i18next.t('shop.names.shopTalisman'),
    description: () => i18next.t('shop.upgradeDescriptions.shopTalisman'),
    effects: (n: number) => ({ talismanUnlocked: n > 0 || PCoinUpgradeEffects.INSTANT_UNLOCK_1 > 0 }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.shopTalisman')
    },
    isUnlocked: () =>
      player.highestchallengecompletions[9] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0
      || PCoinUpgradeEffects.INSTANT_UNLOCK_1 > 0,
    price: 1500,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  seasonPass: {
    name: () => i18next.t('shop.names.seasonPass'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPass'),
    effects: (n: number) => ({ wowCubeMult: 1 + 0.0225 * n, wowTesseractMult: 1 + 0.0225 * n }),
    effectDescription: () => {
      const effects = getShopUpgradeEffects('seasonPass')
      return i18next.t('shop.upgradeEffects.seasonPass', { amount: formatAsPercentIncrease(effects.wowCubeMult) })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 75,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0
  },
  challengeExtension: {
    name: () => i18next.t('shop.names.challengeExtension'),
    description: () => i18next.t('shop.upgradeDescriptions.challengeExtension'),
    effects: (n: number) => ({ reincarnationChallengeCap: 2 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('challengeExtension').reincarnationChallengeCap
      return i18next.t('shop.upgradeEffects.challengeExtension', { amount: format(effect) })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 250,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  challengeTome: {
    name: () => i18next.t('shop.names.challengeTome'),
    description: () => i18next.t('shop.upgradeDescriptions.challengeTome'),
    effects: (n: number) => ({ c10RequirementReduction: 2e7 * n, c9c10ScalingMultiplier: 1 - 0.2 * n / 15 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('challengeTome')
      return i18next.t('shop.upgradeEffects.challengeTome', {
        amount1: format(effects.c10RequirementReduction, 0, true),
        amount2: format(effects.c9c10ScalingMultiplier, 3, true)
      })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 250,
    maxLevel: 15,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  cubeToQuark: {
    name: () => i18next.t('shop.names.cubeToQuark'),
    description: () => i18next.t('shop.upgradeDescriptions.cubeToQuark'),
    effects: (n: number) => ({ cubeQuarkMult: 1 + 0.5 * n }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.cubeToQuark')
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 2000,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  tesseractToQuark: {
    name: () => i18next.t('shop.names.tesseractToQuark'),
    description: () => i18next.t('shop.upgradeDescriptions.tesseractToQuark'),
    effects: (n: number) => ({ tesseractQuarkMult: 1 + 0.5 * n }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.tesseractToQuark')
    },
    isUnlocked: () => player.highestchallengecompletions[11] > 0 || player.highestSingularityCount > 0,
    price: 3500,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  hypercubeToQuark: {
    name: () => i18next.t('shop.names.hypercubeToQuark'),
    description: () => i18next.t('shop.upgradeDescriptions.hypercubeToQuark'),
    effects: (n: number) => ({ hypercubeQuarkMult: 1 + 0.5 * n }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.hypercubeToQuark')
    },
    isUnlocked: () => player.highestchallengecompletions[13] > 0 || player.highestSingularityCount > 0,
    price: 5000,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  seasonPass2: {
    name: () => i18next.t('shop.names.seasonPass2'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPass2'),
    effects: (n: number) => ({ wowHypercubeMult: 1 + 0.015 * n, wowPlatonicMult: 1 + 0.015 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPass2')
      return i18next.t('shop.upgradeEffects.seasonPass2', {
        amount: formatAsPercentIncrease(effects.wowHypercubeMult, 1)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0,
    price: 2500,
    priceIncrease: 250,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0
  },
  seasonPass3: {
    name: () => i18next.t('shop.names.seasonPass3'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPass3'),
    effects: (n: number) => ({ wowHepteractMult: 1 + 0.015 * n, wowOcteractMult: 1 + 0.015 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPass3')
      return i18next.t('shop.upgradeEffects.seasonPass3', {
        amount: formatAsPercentIncrease(effects.wowHepteractMult, 1)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0,
    price: 5000,
    priceIncrease: 500,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0
  },
  chronometer: {
    name: () => i18next.t('shop.names.chronometer'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometer'),
    effects: (n: number) => ({ ascensionSpeedMult: 1 + 0.012 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometer').ascensionSpeedMult
      return i18next.t('shop.upgradeEffects.chronometer', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => player.highestchallengecompletions[12] > 0 || player.highestSingularityCount > 0,
    price: 1600,
    priceIncrease: 400,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0
  },
  infiniteAscent: {
    name: () => i18next.t('shop.names.infiniteAscent'),
    description: () => i18next.t('shop.upgradeDescriptions.infiniteAscent'),
    effects: (n: number) => ({ runeUnlocked: n > 0 || PCoinUpgradeEffects.INSTANT_UNLOCK_2 > 0 }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.infiniteAscent')
    },
    isUnlocked: () =>
      player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0
      || PCoinUpgradeEffects.INSTANT_UNLOCK_2 > 0,
    price: 25000,
    priceIncrease: 9999999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  calculator: {
    name: () => i18next.t('shop.names.calculator'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator'),
    effects: (n: number) => ({ addQuarkMult: 1 + 0.14 * n, autoAnswer: n > 0, autoFill: n === 5 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('calculator')
      return i18next.t('shop.upgradeEffects.calculator', {
        amount1: formatAsPercentIncrease(effects.addQuarkMult, 0),
        bool1: effects.autoAnswer,
        bool2: effects.autoFill
      })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 300,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 1
  },
  calculator2: {
    name: () => i18next.t('shop.names.calculator2'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator2'),
    effects: (n: number) => ({ addCodeCapacity: 2 * n, addQuarkMult: n === 12 ? 1.25 : 1 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('calculator2')
      return i18next.t('shop.upgradeEffects.calculator2', {
        amount1: effects.addCodeCapacity,
        amount2: formatAsPercentIncrease(effects.addQuarkMult, 0)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[11] > 0 || player.highestSingularityCount > 0,
    price: 2500,
    priceIncrease: 800,
    maxLevel: 12,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  calculator3: {
    name: () => i18next.t('shop.names.calculator3'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator3'),
    effects: (n: number) => ({ addRewardVarianceMultiplier: 1 - n / 10, ascensionTimerAdd: 60 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('calculator3')
      return i18next.t('shop.upgradeEffects.calculator3', {
        amount1: formatAsPercentIncrease(2 - effects.addRewardVarianceMultiplier, 0),
        amount2: format(effects.ascensionTimerAdd)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[13] > 0 || player.highestSingularityCount > 0,
    price: 7500,
    priceIncrease: 1500,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  calculator4: {
    name: () => i18next.t('shop.names.calculator4'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator4'),
    effects: (n: number) => ({ addCodeIntervalMult: 1 - n / 25, addCodeCapacity: n === 10 ? 32 : 0 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('calculator4')
      return i18next.t('shop.upgradeEffects.calculator4', {
        amount1: formatAsPercentIncrease(2 - effects.addCodeIntervalMult, 0),
        amount2: effects.addCodeCapacity
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass')),
    price: 1e7,
    priceIncrease: 1e6,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  calculator5: {
    name: () => i18next.t('shop.names.calculator5'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator5'),
    effects: (n: number) => ({ importGQTimerAdd: 6 * n, addCodeCapacity: Math.floor(n / 10) + (n === 100 ? 6 : 0) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('calculator5')
      return i18next.t('shop.upgradeEffects.calculator5', {
        amount1: format(effects.importGQTimerAdd),
        amount2: format(effects.addCodeCapacity)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 1e8,
    priceIncrease: 1e8,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  calculator6: {
    name: () => i18next.t('shop.names.calculator6'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator6'),
    effects: (n: number) => ({ octeractTimerAdd: n, addCodeCapacity: n === 100 ? 24 : 0 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('calculator6')
      return i18next.t('shop.upgradeEffects.calculator6', {
        amount1: format(effects.octeractTimerAdd),
        amount2: format(effects.addCodeCapacity)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 1e11,
    priceIncrease: 2e10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  constantEX: {
    name: () => i18next.t('shop.names.constantEX'),
    description: () => i18next.t('shop.upgradeDescriptions.constantEX'),
    effects: (n: number) => ({ maxPercentIncrease: 0.01 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('constantEX').maxPercentIncrease
      return i18next.t('shop.upgradeEffects.constantEX', { amount: formatAsPercentIncrease(1 + effect, 0) })
    },
    isUnlocked: () => player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0,
    price: 100000,
    priceIncrease: 899999,
    maxLevel: 2,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  powderEX: {
    name: () => i18next.t('shop.names.powderEX'),
    description: () => i18next.t('shop.upgradeDescriptions.powderEX'),
    effects: (n: number) => ({ orbToPowderConversionMult: 1 + 0.02 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('powderEX').orbToPowderConversionMult
      return i18next.t('shop.upgradeEffects.powderEX', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () =>
      player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
      || player.highestSingularityCount > 0,
    price: 1000,
    priceIncrease: 750,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  chronometer2: {
    name: () => i18next.t('shop.names.chronometer2'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometer2'),
    effects: (n: number) => ({ ascensionSpeedMult: 1 + 0.006 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometer2').ascensionSpeedMult
      return i18next.t('shop.upgradeEffects.chronometer2', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () =>
      player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
      || player.highestSingularityCount > 0,
    price: 5000,
    priceIncrease: 1500,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0
  },
  chronometer3: {
    name: () => i18next.t('shop.names.chronometer3'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometer3'),
    effects: (n: number) => ({ ascensionSpeedMult: 1 + 0.015 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometer3').ascensionSpeedMult
      return i18next.t('shop.upgradeEffects.chronometer3', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass')),
    price: 250,
    priceIncrease: 250,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  seasonPassY: {
    name: () => i18next.t('shop.names.seasonPassY'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassY'),
    effects: (n: number) => ({ globalCubeMult: 1 + 0.0075 * n, wowOcteractMult: 1 + 0.0075 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPassY')
      return i18next.t('shop.upgradeEffects.seasonPassY', {
        amount: formatAsPercentIncrease(effects.globalCubeMult, 2)
      })
    },
    isUnlocked: () =>
      player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
      || player.highestSingularityCount > 0,
    price: 10000,
    priceIncrease: 1500,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0
  },
  seasonPassZ: {
    name: () => i18next.t('shop.names.seasonPassZ'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassZ'),
    effects: (n: number) => ({
      globalCubeMult: 1 + 0.01 * n * player.singularityCount,
      wowOcteractMult: 1 + 0.01 * n * player.singularityCount
    }),
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPassZ')
      return i18next.t('shop.upgradeEffects.seasonPassZ', {
        amount: formatAsPercentIncrease(effects.globalCubeMult, 0)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass')),
    price: 250,
    priceIncrease: 250,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  challengeTome2: {
    name: () => i18next.t('shop.names.challengeTome2'),
    description: () => i18next.t('shop.upgradeDescriptions.challengeTome2'),
    effects: (n: number) => ({ c10RequirementReduction: 2e7 * n, c9c10ScalingMultiplier: 1 - 0.04 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('challengeTome2')
      return i18next.t('shop.upgradeEffects.challengeTome2', {
        amount1: format(effects.c10RequirementReduction, 0, true),
        amount2: format(effects.c9c10ScalingMultiplier, 2, true)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass')),
    price: 1000000,
    priceIncrease: 1000000,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  instantChallenge2: {
    name: () => i18next.t('shop.names.instantChallenge2'),
    description: () => i18next.t('shop.upgradeDescriptions.instantChallenge2'),
    effects: (n: number) => ({ unlocked: n > 0, extraCompPerTick: n * player.highestSingularityCount }),
    effectDescription () {
      const effects = getShopUpgradeEffects('instantChallenge2')
      return i18next.t('shop.upgradeEffects.instantChallenge2', { amount: format(effects.extraCompPerTick) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass')),
    price: 20000000,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  cubeToQuarkAll: {
    name: () => i18next.t('shop.names.cubeToQuarkAll'),
    description: () => i18next.t('shop.upgradeDescriptions.cubeToQuarkAll'),
    effects: (n: number) => ({
      cubeQuarkMult: 1 + 0.002 * n,
      tesseractQuarkMult: 1 + 0.002 * n,
      hypercubeQuarkMult: 1 + 0.002 * n
    }),
    effectDescription () {
      const effects = getShopUpgradeEffects('cubeToQuarkAll')
      return i18next.t('shop.upgradeEffects.cubeToQuarkAll', {
        amount: formatAsPercentIncrease(effects.cubeQuarkMult, 1)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 2222222,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  cashGrab2: {
    name: () => i18next.t('shop.names.cashGrab2'),
    description: () => i18next.t('shop.upgradeDescriptions.cashGrab2'),
    effects: (n: number) => ({ obtainiumMult: 1 + 0.005 * n, offeringMult: 1 + 0.005 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('cashGrab2')
      return i18next.t('shop.upgradeEffects.cashGrab2', { amount: formatAsPercentIncrease(effects.obtainiumMult, 1) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 5000,
    priceIncrease: 5000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  chronometerZ: {
    name: () => i18next.t('shop.names.chronometerZ'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometerZ'),
    effects: (n: number) => ({ ascensionSpeedMult: 1 + 0.001 * n * player.singularityCount }),
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometerZ').ascensionSpeedMult
      return i18next.t('shop.upgradeEffects.chronometerZ', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 12500,
    priceIncrease: 12500,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  offeringEX2: {
    name: () => i18next.t('shop.names.offeringEX2'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringEX2'),
    effects: (n: number) => ({ offeringMult: 1 + 0.01 * n * player.singularityCount }),
    effectDescription () {
      const effect = getShopUpgradeEffects('offeringEX2').offeringMult
      return i18next.t('shop.upgradeEffects.offeringEX2', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 10000,
    priceIncrease: 10000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  obtainiumEX2: {
    name: () => i18next.t('shop.names.obtainiumEX2'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumEX2'),
    effects: (n: number) => ({ obtainiumMult: 1 + 0.01 * n * player.singularityCount }),
    effectDescription () {
      const effect = getShopUpgradeEffects('obtainiumEX2').obtainiumMult
      return i18next.t('shop.upgradeEffects.obtainiumEX2', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 10000,
    priceIncrease: 10000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  powderAuto: {
    name: () => i18next.t('shop.names.powderAuto'),
    description: () => i18next.t('shop.upgradeDescriptions.powderAuto'),
    effects: (n: number) => ({ automaticPowderFraction: 0.01 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('powderAuto').automaticPowderFraction
      return i18next.t('shop.upgradeEffects.powderAuto', { amount: formatAsPercentIncrease(1 + effect, 0) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 5e6,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  seasonPassLost: {
    name: () => i18next.t('shop.names.seasonPassLost'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassLost'),
    effects: (n: number) => ({ wowOcteractMult: 1 + 0.001 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('seasonPassLost').wowOcteractMult
      return i18next.t('shop.upgradeEffects.seasonPassLost', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 1000000,
    priceIncrease: 25000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  challenge15Auto: {
    name: () => i18next.t('shop.names.challenge15Auto'),
    description: () => i18next.t('shop.upgradeDescriptions.challenge15Auto'),
    effects: (n: number) => ({ unlocked: n > 0 }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.challenge15Auto')
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 5e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  extraWarp: {
    name: () => i18next.t('shop.names.extraWarp'),
    description: () => i18next.t('shop.upgradeDescriptions.extraWarp'),
    effects: (n: number) => ({ additionalWarps: n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('extraWarp')
      return i18next.t('shop.upgradeEffects.extraWarp', { amount: effects.additionalWarps })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 1.25e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  autoWarp: {
    name: () => i18next.t('shop.names.autoWarp'),
    description: () => i18next.t('shop.upgradeDescriptions.autoWarp'),
    effects: (n: number) => ({ unlocked: n > 0 }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.autoWarp')
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 5e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  improveQuarkHept: {
    name: () => i18next.t('shop.names.improveQuarkHept'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept'),
    effects: (n: number) => ({ quarkHeptExponent: 0.01 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept')
      return i18next.t('shop.upgradeEffects.improveQuarkHept', { amount: format(effects.quarkHeptExponent, 2, true) })
    },
    isUnlocked: () =>
      player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
      || player.highestSingularityCount > 0,
    price: 2e5 - 1,
    priceIncrease: 19999,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  improveQuarkHept2: {
    name: () => i18next.t('shop.names.improveQuarkHept2'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept2'),
    effects: (n: number) => ({ quarkHeptExponent: 0.01 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept2')
      return i18next.t('shop.upgradeEffects.improveQuarkHept2', { amount: format(effects.quarkHeptExponent, 2, true) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass')),
    price: 2e7 - 1,
    priceIncrease: 2e6 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  improveQuarkHept3: {
    name: () => i18next.t('shop.names.improveQuarkHept3'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept3'),
    effects: (n: number) => ({ quarkHeptExponent: 0.01 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept3')
      return i18next.t('shop.upgradeEffects.improveQuarkHept3', { amount: format(effects.quarkHeptExponent, 2, true) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 2e9 - 1,
    priceIncrease: 2e9 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  improveQuarkHept4: {
    name: () => i18next.t('shop.names.improveQuarkHept4'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept4'),
    effects: (n: number) => ({ quarkHeptExponent: 0.01 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept4')
      return i18next.t('shop.upgradeEffects.improveQuarkHept4', { amount: format(effects.quarkHeptExponent, 2, true) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 2e11 - 1,
    priceIncrease: 2e11 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopImprovedDaily: {
    name: () => i18next.t('shop.names.shopImprovedDaily'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily'),
    effects: (n: number) => ({ dailyCodeQuarkMult: 1 + 0.05 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopImprovedDaily')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily', {
        amount: formatAsPercentIncrease(effects.dailyCodeQuarkMult, 0)
      })
    },
    isUnlocked: () =>
      player.highestchallengecompletions[14] > 0
      || player.highestSingularityCount > 0,
    price: 5000,
    priceIncrease: 2500,
    maxLevel: 20,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopImprovedDaily2: {
    name: () => i18next.t('shop.names.shopImprovedDaily2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily2'),
    effects: (n: number) => ({ freeSingularityUpgrades: n, dailyCodeGoldenQuarkMult: 1 + 0.2 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopImprovedDaily2')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily2', {
        amount2: formatAsPercentIncrease(effects.dailyCodeGoldenQuarkMult, 0),
        amount1: effects.freeSingularityUpgrades
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass')),
    price: 500000,
    priceIncrease: 500000,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopImprovedDaily3: {
    name: () => i18next.t('shop.names.shopImprovedDaily3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily3'),
    effects: (n: number) => ({ freeSingularityUpgrades: n, dailyCodeGoldenQuarkMult: 1 + 0.15 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopImprovedDaily3')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily3', {
        amount2: formatAsPercentIncrease(effects.dailyCodeGoldenQuarkMult, 0),
        amount1: effects.freeSingularityUpgrades
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass2')),
    price: 5000000,
    priceIncrease: 12500000,
    maxLevel: 15,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopImprovedDaily4: {
    name: () => i18next.t('shop.names.shopImprovedDaily4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily4'),
    effects: (n: number) => ({ freeSingularityUpgrades: n, dailyCodeGoldenQuarkMult: 1 + n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopImprovedDaily4')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily4', {
        amount2: formatAsPercentIncrease(effects.dailyCodeGoldenQuarkMult, 0),
        amount1: effects.freeSingularityUpgrades
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 5e9,
    priceIncrease: 5e9,
    maxLevel: 25,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  offeringEX3: {
    name: () => i18next.t('shop.names.offeringEX3'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringEX3'),
    effects: (n: number) => ({ offeringMult: Math.pow(1.012, n), baseOfferings: Math.floor(n / 25) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('offeringEX3')
      return i18next.t('shop.upgradeEffects.offeringEX3', {
        amount: formatAsPercentIncrease(effects.offeringMult),
        amount2: effects.baseOfferings
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1,
    priceIncrease: 1.25e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  obtainiumEX3: {
    name: () => i18next.t('shop.names.obtainiumEX3'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumEX3'),
    effects: (n: number) => ({
      obtainiumMult: Math.pow(1.012, n),
      immaculateObtainiuMult: Math.pow(1.06, Math.floor(n / 25))
    }),
    effectDescription () {
      const effects = getShopUpgradeEffects('obtainiumEX3')
      return i18next.t('shop.upgradeEffects.obtainiumEX3', {
        amount: formatAsPercentIncrease(effects.obtainiumMult),
        amount2: formatAsPercentIncrease(effects.immaculateObtainiuMult)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1,
    priceIncrease: 1.25e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  improveQuarkHept5: {
    name: () => i18next.t('shop.names.improveQuarkHept5'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept5'),
    effects: (n: number) => ({ quarkHeptExponent: 0.01 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept5')
      return i18next.t('shop.upgradeEffects.improveQuarkHept5', { amount: format(effects.quarkHeptExponent, 2, true) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1,
    priceIncrease: 2.5e13,
    maxLevel: 80,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  chronometerInfinity: {
    name: () => i18next.t('shop.names.chronometerInfinity'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometerInfinity'),
    effects: (n: number) => ({ ascensionSpeedMult: Math.pow(1.006, n), exponentSpread: 0.001 * Math.floor(n / 40) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('chronometerInfinity')
      return i18next.t('shop.upgradeEffects.chronometerInfinity', {
        amount: formatAsPercentIncrease(effects.ascensionSpeedMult),
        amount2: format(effects.exponentSpread, 3, true)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1,
    priceIncrease: 2.5e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  seasonPassInfinity: {
    name: () => i18next.t('shop.names.seasonPassInfinity'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassInfinity'),
    effects: (n: number) => ({ globalCubeMult: Math.pow(1.012, n), wowOcteractMult: Math.pow(1.012, n * 1.25) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPassInfinity')
      return i18next.t('shop.upgradeEffects.seasonPassInfinity', {
        amount: formatAsPercentIncrease(effects.globalCubeMult),
        amount2: formatAsPercentIncrease(effects.wowOcteractMult)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1,
    priceIncrease: 3.75e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopSingularityPenaltyDebuff: {
    name: () => i18next.t('shop.names.shopSingularityPenaltyDebuff'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSingularityPenaltyDebuff'),
    effects: (n: number) => ({ singularityPenaltyReducers: n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopSingularityPenaltyDebuff')
      return i18next.t('shop.upgradeEffects.shopSingularityPenaltyDebuff', {
        amount1: player.singularityCount,
        amount2: player.singularityCount - effects.singularityPenaltyReducers
      })
    },
    isUnlocked: () =>
      Boolean(
        player.singularityChallenges.noSingularityUpgrades.rewards.shopUpgrade
      ),
    price: 1e17,
    priceIncrease: 9.99e19,
    maxLevel: 4,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuckMultiplier4: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuckMultiplier4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuckMultiplier4'),
    effects: (n: number) => ({ additiveAmbrosiaLuckMult: 0.01 * n }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopAmbrosiaLuckMultiplier4')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuckMultiplier4', {
        amount: formatAsPercentIncrease(1 + effects.additiveAmbrosiaLuckMult, 0)
      })
    },
    isUnlocked: () =>
      Boolean(
        player.singularityChallenges.oneChallengeCap.rewards.shopUpgrade
      ),
    price: 1e20,
    priceIncrease: 3e20,
    maxLevel: 4,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  calculator7: {
    name: () => i18next.t('shop.names.calculator7'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator7'),
    effects: (n: number) => ({ blueberryTimerAdd: n, addCodeCapacity: n === 50 ? 48 : 0 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('calculator7')
      return i18next.t('shop.upgradeEffects.calculator7', {
        amount1: format(effects.blueberryTimerAdd),
        amount2: format(effects.addCodeCapacity)
      })
    },
    isUnlocked: () =>
      Boolean(
        player.singularityChallenges.limitedAscensions.rewards.shopUpgrade
      ),
    price: 1e20,
    priceIncrease: 1e19,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopOcteractAmbrosiaLuck: {
    name: () => i18next.t('shop.names.shopOcteractAmbrosiaLuck'),
    description: () => i18next.t('shop.upgradeDescriptions.shopOcteractAmbrosiaLuck'),
    effects: (n: number) => ({ ambrosiaLuck: n * (1 + Math.floor(Math.max(0, Math.log10(player.wowOcteracts)))) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopOcteractAmbrosiaLuck')
      return i18next.t('shop.upgradeEffects.shopOcteractAmbrosiaLuck', { amount: format(effects.ambrosiaLuck) })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.noOcteracts.rewards.shopUpgrade),
    price: 1e21,
    priceIncrease: 9e21,
    maxLevel: 2,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration1: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration1'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration1'),
    effects: (n: number) => ({ ambrosiaGenerationMult: 1 + 0.01 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration1').ambrosiaGenerationMult
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration1', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 5e11,
    priceIncrease: 5e11,
    maxLevel: 25,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration2: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration2'),
    effects: (n: number) => ({ ambrosiaGenerationMult: 1 + 0.01 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration2').ambrosiaGenerationMult
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration2', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 5e12,
    priceIncrease: 5e12,
    maxLevel: 30,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration3: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration3'),
    effects: (n: number) => ({ ambrosiaGenerationMult: 1 + 0.01 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration3').ambrosiaGenerationMult
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration3', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 5e13,
    priceIncrease: 5e13,
    maxLevel: 35,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration4: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration4'),
    effects: (n: number) => ({ ambrosiaGenerationMult: 1 + 0.001 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration4').ambrosiaGenerationMult
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration4', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1e17,
    priceIncrease: 4 * 1e16,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck1: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck1'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck1'),
    effects: (n: number) => ({ ambrosiaLuck: 2 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck1').ambrosiaLuck
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck1', { amount: format(effect) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 2e11,
    priceIncrease: 2e11,
    maxLevel: 40,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck2: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck2'),
    effects: (n: number) => ({ ambrosiaLuck: 2 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck2').ambrosiaLuck
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck2', { amount: format(effect) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass3')),
    price: 2e12,
    priceIncrease: 2e12,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck3: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck3'),
    effects: (n: number) => ({ ambrosiaLuck: 2 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck3').ambrosiaLuck
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck3', { amount: format(effect) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 2e13,
    priceIncrease: 2e13,
    maxLevel: 60,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck4: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck4'),
    effects: (n: number) => ({ ambrosiaLuck: 0.6 * n }),
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck4').ambrosiaLuck
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck4', { amount: format(effect, 1, true) })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1e17,
    priceIncrease: 4 * 1e16,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopRedLuck1: {
    name: () => i18next.t('shop.names.shopRedLuck1'),
    description: () => i18next.t('shop.upgradeDescriptions.shopRedLuck1'),
    effects: (n: number) => ({ redLuck: 0.05 * n, luckConversionRatio: -0.01 * Math.floor(n / 20) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopRedLuck1')
      return i18next.t('shop.upgradeEffects.shopRedLuck1', {
        amount: format(effects.redLuck, 2, true),
        amount2: format(-effects.luckConversionRatio, 2, true)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 5e13,
    priceIncrease: 5e13,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopRedLuck2: {
    name: () => i18next.t('shop.names.shopRedLuck2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopRedLuck2'),
    effects: (n: number) => ({ redLuck: 0.075 * n, luckConversionRatio: -0.01 * Math.floor(n / 20) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopRedLuck2')
      return i18next.t('shop.upgradeEffects.shopRedLuck2', {
        amount: format(effects.redLuck, 3, true),
        amount2: format(-effects.luckConversionRatio, 2, true)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1e17,
    priceIncrease: 1e17,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopRedLuck3: {
    name: () => i18next.t('shop.names.shopRedLuck3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopRedLuck3'),
    effects: (n: number) => ({ redLuck: 0.1 * n, luckConversionRatio: -0.01 * Math.floor(n / 20) }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopRedLuck3')
      return i18next.t('shop.upgradeEffects.shopRedLuck3', {
        amount: format(effects.redLuck, 1, true),
        amount2: format(-effects.luckConversionRatio, 2, true)
      })
    },
    isUnlocked: () => Boolean(getGQUpgradeEffect('wowPass4')),
    price: 1e21,
    priceIncrease: 3e19,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopCashGrabUltra: {
    name: () => i18next.t('shop.names.shopCashGrabUltra'),
    description: () => i18next.t('shop.upgradeDescriptions.shopCashGrabUltra'),
    effects: (n: number) => {
      const ratio = Math.min(1, Math.cbrt(player.lifetimeAmbrosia / 1e7))
      return {
        ambrosiaGenerationMult: 1 + 0.15 * n * ratio,
        cubesMult: 1 + 1.2 * n * ratio,
        quarkMult: 1 + 0.08 * n * ratio
      }
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopCashGrabUltra')
      return i18next.t('shop.upgradeEffects.shopCashGrabUltra', {
        amount: formatAsPercentIncrease(effects.ambrosiaGenerationMult),
        amount2: formatAsPercentIncrease(effects.cubesMult),
        amount3: formatAsPercentIncrease(effects.quarkMult)
      })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.noSingularityUpgrades.rewards.shopUpgrade2),
    price: 1,
    priceIncrease: 1e22,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaAccelerator: {
    name: () => i18next.t('shop.names.shopAmbrosiaAccelerator'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaAccelerator'),
    effects: (n: number) => {
      const ex5Comps = player.singularityChallenges.noAmbrosiaUpgrades.completions
      return {
        ambrosiaPointRequirementMult: 1 - 0.004 * n * ex5Comps
      }
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopAmbrosiaAccelerator')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaAccelerator', {
        amount: formatAsPercentIncrease(2 - effects.ambrosiaPointRequirementMult, 1)
      })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.noAmbrosiaUpgrades.rewards.shopUpgrade),
    price: 1e21,
    priceIncrease: 2e21,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopEXUltra: {
    name: () => i18next.t('shop.names.shopEXUltra'),
    description: () => i18next.t('shop.upgradeDescriptions.shopEXUltra'),
    effects: (n: number) => {
      const ambrosiaMult = Math.min(125 * n, player.lifetimeAmbrosia / 1000) / 1000
      return {
        offeringMult: 1 + ambrosiaMult,
        obtainiumMult: 1 + ambrosiaMult,
        cubeMult: 1 + ambrosiaMult
      }
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopEXUltra')
      return i18next.t('shop.upgradeEffects.shopEXUltra', { amount: formatAsPercentIncrease(effects.offeringMult) })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.noAmbrosiaUpgrades.rewards.shopUpgrade2),
    price: 5e21,
    priceIncrease: 0,
    maxLevel: 80,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopChronometerS: {
    name: () => i18next.t('shop.names.shopChronometerS'),
    description: () => i18next.t('shop.upgradeDescriptions.shopChronometerS'),
    effects: (n: number) => ({
      ascensionSpeedMult: Math.pow(1.01, n * Math.max(0, player.singularityCount - 200)),
      globalSpeedMult: Math.pow(1.01, n * Math.max(0, player.singularityCount - 200))
    }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopChronometerS')
      return i18next.t('shop.upgradeEffects.shopChronometerS', {
        amount: formatAsPercentIncrease(effects.ascensionSpeedMult)
      })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.limitedTime.rewards.tier1Upgrade),
    price: 5e21,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopAmbrosiaUltra: {
    name: () => i18next.t('shop.names.shopAmbrosiaUltra'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaUltra'),
    effects: (n: number) => {
      const totalExaltChallengeCompletions = sumOfExaltCompletions()
      return {
        ambrosiaLuck: n * totalExaltChallengeCompletions
      }
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopAmbrosiaUltra')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaUltra', { amount: format(effects.ambrosiaLuck) })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.limitedTime.rewards.tier2Upgrade),
    price: 8e23,
    priceIncrease: 2e23,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopSingularitySpeedup: {
    name: () => i18next.t('shop.names.shopSingularitySpeedup'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSingularitySpeedup'),
    effects: (n: number) => ({ singularityUpgradeSpeedMult: n > 0 ? 50 : 1 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopSingularitySpeedup')
      return i18next.t('shop.upgradeEffects.shopSingularitySpeedup', {
        amount: format(effects.singularityUpgradeSpeedMult)
      })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.sadisticPrequel.rewards.shopUpgrade),
    price: 2e22,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopSingularityPotency: {
    name: () => i18next.t('shop.names.shopSingularityPotency'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSingularityPotency'),
    effects: (n: number) => ({ freeUpgradeMult: n > 0 ? 3.66 : 1 }),
    effectDescription () {
      const effects = getShopUpgradeEffects('shopSingularityPotency')
      return i18next.t('shop.upgradeEffects.shopSingularityPotency', {
        amount: format(effects.freeUpgradeMult, 2, true)
      })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.sadisticPrequel.rewards.shopUpgrade2),
    price: 2e23,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopSadisticRune: {
    name: () => i18next.t('shop.names.shopSadisticRune'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSadisticRune'),
    effects: (n: number) => ({ runeUnlocked: n > 0 }),
    effectDescription () {
      return i18next.t('shop.upgradeEffects.shopSadisticRune')
    },
    isUnlocked: () => Boolean(player.singularityChallenges.sadisticPrequel.rewards.shopUpgrade3),
    price: 2e27,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopInfiniteShopUpgrades: {
    name: () => i18next.t('shop.names.shopInfiniteShopUpgrades'),
    description: () => i18next.t('shop.upgradeDescriptions.shopInfiniteShopUpgrades'),
    effects: (n: number) => {
      const totalExaltChallengeCompletions = sumOfExaltCompletions()
      return {
        infiniteVouchers: Math.floor(0.005 * n * totalExaltChallengeCompletions)
      }
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopInfiniteShopUpgrades')
      return i18next.t('shop.upgradeEffects.shopInfiniteShopUpgrades', {
        amount: format(effects.infiniteVouchers, 0)
      })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.limitedAscensions.rewards.shopUpgrade0),
    price: 1e20,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  },
  shopHorseShoe: {
    name: () => i18next.t('shop.names.shopHorseShoe'),
    description: () => i18next.t('shop.upgradeDescriptions.shopHorseShoe'),
    effects: (n: number) => {
      const horseShoeLevel = getRuneEffectiveLevel('horseShoe')
      return {
        bonusHorseLevels: 3 * n,
        singularityPenaltyMult: 1 - Math.min(300, horseShoeLevel * n) / 1000
      }
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopHorseShoe')
      return i18next.t('shop.upgradeEffects.shopHorseShoe', {
        amount1: effects.bonusHorseLevels,
        amount2: formatAsPercentIncrease(effects.singularityPenaltyMult)
      })
    },
    isUnlocked: () => Boolean(player.singularityChallenges.taxmanLastStand.rewards.shopUpgrade),
    price: 5e26,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0
  }
}

const infinityUpgrades: Set<ShopUpgradeNames> = new Set([
  'offeringEX3',
  'obtainiumEX3',
  'chronometerInfinity',
  'seasonPassInfinity'
])

const getShopUpgradeEffects = <T extends ShopUpgradeNames>(upgradeKey: T): QuarkShopUpgradeRewards[T] => {
  let bonusLevels = 0
  if (infinityUpgrades.has(upgradeKey)) {
    bonusLevels += calculateFreeShopInfinityUpgrades()
  }
  return shopUpgrades[upgradeKey].effects(player.shopUpgrades[upgradeKey] + bonusLevels)
}

export const updateShopLevels = () => {
  for (const upgrade in player.shopUpgrades) {
    const k = upgrade as ShopUpgradeNames
    player.shopUpgrades[k] = Math.min(player.shopUpgrades[k], shopUpgrades[k].maxLevel)
  }
}

export const getShopCosts = (input: ShopUpgradeNames) => {
  if (
    shopUpgrades[input].type === shopUpgradeTypes.CONSUMABLE
    || shopUpgrades[input].maxLevel === 1
  ) {
    return shopUpgrades[input].price
  } else {
    const priceIncreaseMult = player.shopUpgrades[input]
    return (
      shopUpgrades[input].price + shopUpgrades[input].priceIncrease * priceIncreaseMult
    )
  }
}

export const createShopHTML = (input: ShopUpgradeNames) => {
  const name = shopUpgrades[input].name()
  const infinitySymbol = infinityUpgrades.has(input)
    ? '<span style="color: cyan">[\u221E]</span>'
    : ''
  const level = player.shopUpgrades[input]
  const maxLevel = shopUpgrades[input].maxLevel
  const levelHTMLColor = level >= maxLevel ? 'orchid' : 'white'

  const levelHTML = i18next.t('shop.levelWithText', { x: format(level), y: format(maxLevel) })
  const infinityLevel = infinityUpgrades.has(input)
    ? `<span style="color: cyan">[+${calculateFreeShopInfinityUpgrades()}]</span>`
    : ''

  const description = shopUpgrades[input].description()
  const cost = getShopCosts(input)
  const costHTML = player.shopUpgrades[input] >= shopUpgrades[input].maxLevel
    ? ''
    : `${i18next.t('shop.upgradeFor', { x: format(cost, 0, false) })}<br>`

  const effectDescription = shopUpgrades[input].effectDescription()

  const refundableHTML = shopUpgrades[input].refundable
    ? `<span style="color: lightgreen">♚ ${
      i18next.t('shop.refundable', { level: shopUpgrades[input].refundMinimumLevel })
    }</span><br>`
    : `<span style="color: crimson">⚠ ${i18next.t('shop.cannotRefund')}</span><br>`

  let resetHTML = ''
  if (getRuneEffectiveLevel('antiquities') > 0 || player.highestSingularityCount > 0) {
    resetHTML = shopUpgrades[input].resetOnSingularity()
      ? `<span style="color: crimson">⚠ ${
        i18next.t('shop.resetOnSingularity', { x: shopUpgrades[input].refundMinimumLevel })
      }</span><br>`
      : `<span style="color: lightgreen">♔ ${i18next.t('shop.noResetOnSingularity')}</span><br>`
  }

  return `${name} ${infinitySymbol}<br>
  <span style="color:${levelHTMLColor}">${levelHTML}</span> ${infinityLevel}<br>
  ${costHTML}
  ${description}<br>
  ▶ ${effectDescription} <br><br>
  ${refundableHTML}
  ${resetHTML}`
}

export const shopDescriptions = (input: ShopUpgradeNames) => {
  const rofl = DOMCacheGetOrSet('quarkdescription')
  const lol = DOMCacheGetOrSet('quarkeffect')
  const refundable = DOMCacheGetOrSet('quarkRefundable')

  rofl.innerHTML = shopUpgrades[input].description()

  refundable.textContent = shopUpgrades[input].refundable
    ? i18next.t('shop.refundable', { level: shopUpgrades[input].refundMinimumLevel })
    : i18next.t('shop.cannotRefund')

  lol.innerHTML = shopUpgrades[input].effectDescription()
}

export const buyShopUpgrades = async (input: ShopUpgradeNames) => {
  const shopItem = shopUpgrades[input]
  const name = shopItem.name()

  if (player.shopUpgrades[input] >= shopItem.maxLevel) {
    return player.shopConfirmationToggle
      ? Alert(
        `You can't purchase ${name} because you are already at the maximum ${
          shopItem.type === shopUpgradeTypes.UPGRADE ? 'level' : 'capacity'
        }!`
      )
      : null
  } else if (Number(player.worlds) < getShopCosts(input)) {
    return player.shopConfirmationToggle
      ? Alert(
        `You can't purchase ${name} because you don't have enough Quarks!`
      )
      : null
  }

  // Actually lock for HTML exploit
  if (!shopItem.isUnlocked()) {
    return Alert(
      `You do not have the right to purchase ${name}!`
    )
  }

  let buyData: IMultiBuy
  const maxBuyAmount = shopItem.maxLevel - player.shopUpgrades[input]
  let buyAmount: number
  let buyCost: number
  switch (player.shopBuyMaxToggle) {
    case false:
      buyAmount = 1
      buyCost = getShopCosts(input)
      break
    case 'TEN':
      buyData = calculateSummationNonLinear(
        player.shopUpgrades[input],
        shopItem.price,
        +player.worlds,
        shopItem.priceIncrease / shopItem.price,
        Math.min(10, maxBuyAmount)
      )
      buyAmount = buyData.levelCanBuy - player.shopUpgrades[input]
      buyCost = buyData.cost
      break
    default:
      buyData = calculateSummationNonLinear(
        player.shopUpgrades[input],
        shopItem.price,
        +player.worlds,
        shopItem.priceIncrease / shopItem.price,
        maxBuyAmount
      )
      buyAmount = buyData.levelCanBuy - player.shopUpgrades[input]
      buyCost = buyData.cost
  }

  const singular = shopItem.maxLevel === 1
  const merch = buyAmount.toLocaleString()
    + (shopItem.type === shopUpgradeTypes.UPGRADE ? ' level' : ' vial')
    + (buyAmount === 1 ? '' : 's')
  const noRefunds = shopItem.refundable
    ? ''
    : '\n\n\u26A0\uFE0F !! No Refunds !! \u26A0\uFE0F'
  const maxPots = shopItem.type === shopUpgradeTypes.CONSUMABLE
    ? '\n\nType -1 in Buy: ANY to buy equal amounts of both Potions.'
    : ''

  if (player.shopBuyMaxToggle === 'ANY' && !singular) {
    const buyInput = await Prompt(
      `You can afford to purchase up to ${merch} of ${name} for ${buyCost.toLocaleString()} Quarks. How many would you like to buy?${
        maxPots + noRefunds
      }`
    )
    let buyAny: number
    if (
      Number(buyInput) === -1
      && shopItem.type === shopUpgradeTypes.CONSUMABLE
    ) {
      const other = input === 'offeringPotion' ? 'obtainiumPotion' : 'offeringPotion'
      const toSpend = Math.max(+player.worlds / 2, +player.worlds - buyCost)
      const otherPot: IMultiBuy = calculateSummationNonLinear(
        player.shopUpgrades[other],
        shopUpgrades[other].price,
        toSpend,
        shopUpgrades[other].priceIncrease / shopUpgrades[other].price,
        shopUpgrades[other].maxLevel - player.shopUpgrades[other]
      )
      player.worlds.sub(otherPot.cost)
      player.shopUpgrades[other] = otherPot.levelCanBuy
      shopDescriptions(other)
      buyAny = buyAmount
    } else {
      buyAny = Math.floor(Number(buyInput))
      if (buyAny === 0) {
        return
      } else if (Number.isNaN(buyAny) || !Number.isFinite(buyAny)) {
        Alert(i18next.t('general.validation.finite'))
        return
      } else if (buyAny < 0) {
        Alert(i18next.t('general.validation.zeroOrLess'))
        return
      }
    }
    const anyData: IMultiBuy = calculateSummationNonLinear(
      player.shopUpgrades[input],
      shopItem.price,
      +player.worlds,
      shopItem.priceIncrease / shopItem.price,
      Math.min(buyAny, buyAmount)
    )
    player.worlds.sub(anyData.cost)
    player.shopUpgrades[input] = anyData.levelCanBuy
    shopDescriptions(input)
    revealStuff()
    return
  }

  let p = true
  if (
    player.shopConfirmationToggle
    || (!shopItem.refundable && player.shopBuyMaxToggle !== false)
  ) {
    p = await Confirm(
      `You are about to ${
        singular ? 'unlock' : `purchase ${merch} of`
      } ${name} for ${buyCost.toLocaleString()} Quarks. Press 'OK' to finalize purchase.${maxPots + noRefunds}`
    )
  }
  if (p) {
    player.worlds.sub(buyCost)
    player.shopUpgrades[input] += buyAmount
    shopDescriptions(input)
    revealStuff()
  }
}

export const useConsumablePrompt = async (
  input: ShopUpgradeNames,
  used = 1,
  spend = true
) => {
  const p = !player.shopConfirmationToggle || await Confirm('Would you like to use some of this potion?')

  if (p) {
    return useConsumable(input, false, used, spend)
  }
}

export const useConsumable = (
  input: ShopUpgradeNames,
  automatic = false,
  used = 1,
  spend = true
) => {
  const infiniteAutoBrew = PCoinUpgradeEffects.AUTO_POTION_FREE_POTIONS_QOL

  if (input === 'offeringPotion') {
    let offeringPotionValue = calculatePotionValue(
      player.prestigecounter,
      calculateOfferingsDecimal(),
      calculateBaseOfferings()
    )

    if (
      player.singularityChallenges.taxmanLastStand.enabled
      && player.singularityChallenges.taxmanLastStand.completions >= 2
    ) {
      offeringPotionValue = Decimal.min(
        offeringPotionValue,
        player.offerings.times(100).plus(1)
      )
    }

    if (infiniteAutoBrew && automatic) {
      player.offerings = player.offerings.add(offeringPotionValue.times(used))
      player.shopPotionsConsumed.offering += used
    } else if (player.shopUpgrades.offeringPotion >= used || !spend) {
      player.shopUpgrades.offeringPotion -= spend ? used : 0
      player.offerings = player.offerings.add(offeringPotionValue.times(used))
      player.shopPotionsConsumed.offering += used
    }

    if (!automatic) {
      shopDescriptions('offeringPotion')
    }
  } else if (input === 'obtainiumPotion') {
    if (player.currentChallenge.ascension === 14) {
      return
    }

    let obtainiumPotionValue = calculatePotionValue(
      player.reincarnationcounter,
      calculateObtainium(),
      calculateBaseObtainium()
    )

    if (
      player.singularityChallenges.taxmanLastStand.enabled
      && player.singularityChallenges.taxmanLastStand.completions >= 2
    ) {
      obtainiumPotionValue = Decimal.min(
        obtainiumPotionValue,
        player.obtainium.times(100).plus(1)
      )
    }

    if (infiniteAutoBrew && automatic) {
      player.obtainium = player.obtainium.add(obtainiumPotionValue.times(used))
      player.shopPotionsConsumed.obtainium += used
    } else if (player.shopUpgrades.obtainiumPotion >= used || !spend) {
      player.shopUpgrades.obtainiumPotion -= spend ? used : 0
      player.obtainium = player.obtainium.add(obtainiumPotionValue.times(used))
      player.shopPotionsConsumed.obtainium += used
    }

    if (!automatic) {
      shopDescriptions('obtainiumPotion')
    }
  }
}

export const resetShopUpgrades = async () => {
  const p = player.shopConfirmationToggle
    ? await Confirm(i18next.t('shop.refundConfirmation'))
    : true

  if (p) {
    return forceResetShopUpgrades()
  }
}

export const resetShopUpgradesOnSingularity = () => {
  for (const shopKey of Object.keys(shopUpgrades) as ShopUpgradeNames[]) {
    const item = shopUpgrades[shopKey]
    const reset = item.resetOnSingularity()
    const refundableLevel = item.refundMinimumLevel
    if (reset) {
      player.shopUpgrades[shopKey] = Math.min(player.shopUpgrades[shopKey], refundableLevel)
    }
  }
}

export const forceResetShopUpgrades = () => {
  let totalRefundAmt = 0
  for (const shopKey of Object.keys(shopUpgrades) as ShopUpgradeNames[]) {
    const item = shopUpgrades[shopKey]
    const refundableLevel = item.refundMinimumLevel
    const isRefundable = item.refundable
    if (
      isRefundable
      && player.shopUpgrades[shopKey] > refundableLevel
    ) {
      // How many quarks it costs to get to level `refundMinimumLevel`
      // We do not want to refund this portion of the quarks spent.
      const doNotRefund = item.price * refundableLevel
        + (item.priceIncrease
            * refundableLevel
            * (refundableLevel - 1))
          / 2

      // How many quarks the player spent on this upgrade in total
      const quarksSpentOnUpgrade = item.price * player.shopUpgrades[shopKey]
        + (item.priceIncrease
            * player.shopUpgrades[shopKey]
            * (player.shopUpgrades[shopKey] - 1))
          / 2

      totalRefundAmt += quarksSpentOnUpgrade - doNotRefund
      player.worlds.add(quarksSpentOnUpgrade - doNotRefund, false, false)
      player.shopUpgrades[shopKey] = refundableLevel
    }
  }
  void Alert(i18next.t('shop.refundSuccessful', {
    amount: format(totalRefundAmt, 0, false)
  }))
}
