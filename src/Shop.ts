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
import { getRuneEffectiveLevel, getRuneEffects } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { getSingularityChallengeEffect } from './SingularityChallenges'
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
  offeringAuto: { autoRune: boolean; autoRuneSpeedMult: number }
  obtainiumAuto: { autoResearch: boolean; researchCostMult: number }
  cashGrab: { obtainiumMult: number; offeringMult: number }
  cashGrab2: { obtainiumMult: number; offeringMult: number }
  shopTalisman: { talismanUnlocked: boolean }
  infiniteAscent: { runeUnlocked: boolean }
  shopSadisticRune: { runeUnlocked: boolean }
  antSpeed: { antELO: number }
  instantChallenge: { unlocked: boolean; extraCompPerTick: number }
  instantChallenge2: { unlocked: boolean; extraCompPerTick: number }
  challengeExtension: { reincarnationChallengeCap: number }
  challengeTome: { c10RequirementReduction: number; c9c10ScalingReduction: number }
  challengeTome2: { c10RequirementReduction: number; c9c10ScalingReduction: number }
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
  cubeToQuarkAll: { quarkMult: number }
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
  shopPanthema: {
    offeringMult: number
    obtainiumMult: number
    cubeMult: number
    quarkMult: number
    ascensionSpeedMult: number
    infinityMetaBoost: number
  }
}

export type ShopUpgradeNames = keyof QuarkShopUpgradeRewards

export enum ShopUpgradeGroups {
  Offering = 0,
  Obtainium,
  Cubes,
  Speed,
  Quark,
  InfinityUpgrades,
  Utility
}

interface UpgradeTypeInfo {
  HTMLColor: string
  symbol: string
  bonusLevels: () => number
}

export const shopUpgradeTypeInfo: Record<ShopUpgradeGroups, UpgradeTypeInfo> = {
  [ShopUpgradeGroups.Offering]: {
    HTMLColor: 'orange',
    symbol: '☤',
    bonusLevels: () =>
      +getSingularityChallengeEffect('noQuarkUpgrades', 'freeOfferingLevels')
      + getRuneEffects('topHat', 'freeOfferingLevels')
  },
  [ShopUpgradeGroups.Obtainium]: {
    HTMLColor: 'pink',
    symbol: '❍',
    bonusLevels: () =>
      +getSingularityChallengeEffect('noQuarkUpgrades', 'freeObtainiumLevels')
      + getRuneEffects('topHat', 'freeObtainiumLevels')
  },
  [ShopUpgradeGroups.Cubes]: {
    HTMLColor: 'magenta',
    symbol: '⬢',
    bonusLevels: () =>
      +getSingularityChallengeEffect('noQuarkUpgrades', 'freeCubeLevels')
      + getRuneEffects('topHat', 'freeCubeLevels')
  },
  [ShopUpgradeGroups.Speed]: {
    HTMLColor: 'yellow',
    symbol: '⧗',
    bonusLevels: () =>
      +getSingularityChallengeEffect('noQuarkUpgrades', 'freeSpeedLevels')
      + getRuneEffects('topHat', 'freeSpeedLevels')
  },
  [ShopUpgradeGroups.Quark]: {
    HTMLColor: 'cyan',
    symbol: '❂',
    bonusLevels: () => getSingularityChallengeEffect('noQuarkUpgrades', 'freeQuarkLevel')
  },
  [ShopUpgradeGroups.InfinityUpgrades]: {
    HTMLColor: 'lightgoldenrodyellow',
    symbol: '\u221E',
    bonusLevels: () =>
      calculateFreeShopInfinityUpgrades()
      + getSingularityChallengeEffect('noQuarkUpgrades', 'freeInfinityLevels')
      + getRuneEffects('topHat', 'freeInfinityLevels')
  },
  [ShopUpgradeGroups.Utility]: {
    HTMLColor: 'white',
    symbol: '⚙',
    bonusLevels: () => 0
  }
}

export const createShopUpgradeTypeIcon = (type: ShopUpgradeGroups) => {
  const info = shopUpgradeTypeInfo[type]
  return `<span style="color: ${info.HTMLColor}">[${info.symbol}]</span>`
}

const LAST_GROUP = ShopUpgradeGroups.Utility

interface IShopData<T extends ShopUpgradeNames, K extends keyof QuarkShopUpgradeRewards[T]> {
  name: () => string
  description: () => string
  effects: (n: number, key: K) => QuarkShopUpgradeRewards[T][K]
  effectDescription: () => string
  refundable: boolean
  resetOnSingularity: () => boolean
  isUnlocked: () => boolean
  price: number
  priceIncrease: number
  maxLevel: number
  type: shopUpgradeTypes
  refundMinimumLevel: number
  upgradeTypes: ShopUpgradeGroups[]
}

const resetNever = () => false
const resetUntilSingularity10 = () => player.highestSingularityCount < 10
const resetUntilSingularity50 = () => player.highestSingularityCount < 50

export const shopUpgrades: { [K in ShopUpgradeNames]: IShopData<K, keyof QuarkShopUpgradeRewards[K]> } = {
  offeringPotion: {
    name: () => i18next.t('shop.names.offeringPotion'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringPotion'),
    effects: () => 7200, // skipSeconds
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
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  obtainiumPotion: {
    name: () => i18next.t('shop.names.obtainiumPotion'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumPotion'),
    effects: () => 7200, // skipSeconds
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
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  offeringEX: {
    name: () => i18next.t('shop.names.offeringEX'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringEX'),
    effects: (n) => {
      const offeringMult = 1 + 0.06 * n
      const extraMult = Math.pow(1.08, Math.floor(n / 10))
      return offeringMult * extraMult // offeringMult
    },
    effectDescription () {
      const effect = getShopUpgradeEffects('offeringEX', 'offeringMult')
      return i18next.t('shop.upgradeEffects.offeringEX', { amount: formatAsPercentIncrease(effect) })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 225,
    priceIncrease: 15,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Offering]
  },
  offeringAuto: {
    name: () => i18next.t('shop.names.offeringAuto'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringAuto'),
    effects: (n, key) => {
      if (key === 'autoRune') {
        return n > 0
      }

      return 1 + 0.01 * n // autoRuneSpeedMult
    },
    effectDescription () {
      const autoRune = getShopUpgradeEffects('offeringAuto', 'autoRune')
      const autoRuneSpeedMult = getShopUpgradeEffects('offeringAuto', 'autoRuneSpeedMult')
      return i18next.t('shop.upgradeEffects.offeringAuto', {
        amount: autoRune,
        amount2: formatAsPercentIncrease(autoRuneSpeedMult, 0)
      })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Offering, ShopUpgradeGroups.Utility]
  },
  obtainiumEX: {
    name: () => i18next.t('shop.names.obtainiumEX'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumEX'),
    effects: (n: number) => {
      const obtainiumMult = 1 + 0.06 * n
      const extraMult = Math.pow(1.08, Math.floor(n / 10))
      return obtainiumMult * extraMult // obtainiumMult
    },
    effectDescription () {
      const effect = getShopUpgradeEffects('obtainiumEX', 'obtainiumMult')
      return i18next.t('shop.upgradeEffects.obtainiumEX', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 225,
    priceIncrease: 15,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Obtainium]
  },
  obtainiumAuto: {
    name: () => i18next.t('shop.names.obtainiumAuto'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumAuto'),
    effects: (n, key) => {
      if (key === 'autoResearch') {
        return n > 0
      }

      return 1 - 0.001 * n // researchCostMult
    },
    effectDescription () {
      const researchCostMult = getShopUpgradeEffects('obtainiumAuto', 'researchCostMult')
      return i18next.t('shop.upgradeEffects.obtainiumAuto', {
        amount: formatAsPercentIncrease(researchCostMult, 1)
      })
    },
    isUnlocked: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Obtainium, ShopUpgradeGroups.Utility]
  },
  instantChallenge: {
    name: () => i18next.t('shop.names.instantChallenge'),
    description: () => i18next.t('shop.upgradeDescriptions.instantChallenge'),
    effects: (n, key) => {
      if (key === 'unlocked') {
        return n > 0
      }

      return 10 * n // extraCompPerTick
    },
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  antSpeed: {
    name: () => i18next.t('shop.names.antSpeed'),
    description: () => i18next.t('shop.upgradeDescriptions.antSpeed'),
    effects: (n) => 4 * n, // antELO
    effectDescription () {
      const effect = getShopUpgradeEffects('antSpeed', 'antELO')
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
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  cashGrab: {
    name: () => i18next.t('shop.names.cashGrab'),
    description: () => i18next.t('shop.upgradeDescriptions.cashGrab'),
    effects: (n) => 1 + 0.01 * n, // obtainiumMult, offeringMult
    effectDescription () {
      const obtainiumMult = getShopUpgradeEffects('cashGrab', 'obtainiumMult')
      return i18next.t('shop.upgradeEffects.cashGrab', { amount: formatAsPercentIncrease(obtainiumMult, 0) })
    },
    isUnlocked: () =>
      player.highestchallengecompletions[8] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 100,
    priceIncrease: 40,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity10,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Obtainium, ShopUpgradeGroups.Offering]
  },
  shopTalisman: {
    name: () => i18next.t('shop.names.shopTalisman'),
    description: () => i18next.t('shop.upgradeDescriptions.shopTalisman'),
    effects: (n) => n > 0 || PCoinUpgradeEffects.INSTANT_UNLOCK_1 > 0,
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  seasonPass: {
    name: () => i18next.t('shop.names.seasonPass'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPass'),
    effects: (n) => 1 + 0.0225 * n, // wowCubeMult, wowTesseractMult
    effectDescription: () => {
      const effects = getShopUpgradeEffects('seasonPass', 'wowCubeMult')
      return i18next.t('shop.upgradeEffects.seasonPass', { amount: formatAsPercentIncrease(effects) })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 75,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Cubes]
  },
  challengeExtension: {
    name: () => i18next.t('shop.names.challengeExtension'),
    description: () => i18next.t('shop.upgradeDescriptions.challengeExtension'),
    effects: (n) => 2 * n, // reincarnationChallengeCap
    effectDescription () {
      const effect = getShopUpgradeEffects('challengeExtension', 'reincarnationChallengeCap')
      return i18next.t('shop.upgradeEffects.challengeExtension', { amount: format(effect) })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 250,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  challengeTome: {
    name: () => i18next.t('shop.names.challengeTome'),
    description: () => i18next.t('shop.upgradeDescriptions.challengeTome'),
    effects: (n, key) => {
      if (key === 'c10RequirementReduction') {
        return 2e7 * n
      }

      return -n / 100 // c9c10ScalingReduction
    },
    effectDescription () {
      const c10RequirementReduction = getShopUpgradeEffects('challengeTome', 'c10RequirementReduction')
      const c9c10ScalingReduction = getShopUpgradeEffects('challengeTome', 'c9c10ScalingReduction')
      return i18next.t('shop.upgradeEffects.challengeTome', {
        amount1: format(c10RequirementReduction, 0, true),
        amount2: format(c9c10ScalingReduction, 2, true)
      })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 250,
    maxLevel: 15,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  cubeToQuark: {
    name: () => i18next.t('shop.names.cubeToQuark'),
    description: () => i18next.t('shop.upgradeDescriptions.cubeToQuark'),
    effects: (n) => 1 + 0.5 * n, // cubeQuarkMult
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark]
  },
  tesseractToQuark: {
    name: () => i18next.t('shop.names.tesseractToQuark'),
    description: () => i18next.t('shop.upgradeDescriptions.tesseractToQuark'),
    effects: (n) => 1 + 0.5 * n, // tesseractQuarkMult
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark]
  },
  hypercubeToQuark: {
    name: () => i18next.t('shop.names.hypercubeToQuark'),
    description: () => i18next.t('shop.upgradeDescriptions.hypercubeToQuark'),
    effects: (n) => 1 + 0.5 * n, // hypercubeQuarkMult
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark]
  },
  seasonPass2: {
    name: () => i18next.t('shop.names.seasonPass2'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPass2'),
    effects: (n) => 1 + 0.015 * n, // wowHypercubeMult, wowPlatonicMult,
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPass2', 'wowHypercubeMult')
      return i18next.t('shop.upgradeEffects.seasonPass2', {
        amount: formatAsPercentIncrease(effects, 1)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0,
    price: 2500,
    priceIncrease: 250,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Cubes]
  },
  seasonPass3: {
    name: () => i18next.t('shop.names.seasonPass3'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPass3'),
    effects: (n) => 1 + 0.015 * n, // wowHepteractMult, wowOcteractMult
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPass3', 'wowHepteractMult')
      return i18next.t('shop.upgradeEffects.seasonPass3', {
        amount: formatAsPercentIncrease(effects, 1)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0,
    price: 5000,
    priceIncrease: 500,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Cubes]
  },
  chronometer: {
    name: () => i18next.t('shop.names.chronometer'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometer'),
    effects: (n) => 1 + 0.012 * n, // ascensionSpeedMult
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometer', 'ascensionSpeedMult')
      return i18next.t('shop.upgradeEffects.chronometer', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => player.highestchallengecompletions[12] > 0 || player.highestSingularityCount > 0,
    price: 1600,
    priceIncrease: 400,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    resetOnSingularity: resetUntilSingularity50,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Speed]
  },
  infiniteAscent: {
    name: () => i18next.t('shop.names.infiniteAscent'),
    description: () => i18next.t('shop.upgradeDescriptions.infiniteAscent'),
    effects: (n) => n > 0 || PCoinUpgradeEffects.INSTANT_UNLOCK_2 > 0, // runeUnlocked
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  calculator: {
    name: () => i18next.t('shop.names.calculator'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator'),
    effects: (n, key) => {
      if (key === 'autoAnswer') {
        return n > 0
      } else if (key === 'addQuarkMult') {
        return 1 + 0.14 * n
      } else {
        return n === 5 // autoFill
      }
    },
    effectDescription () {
      const addQuarkMult = getShopUpgradeEffects('calculator', 'addQuarkMult')
      const autoAnswer = getShopUpgradeEffects('calculator', 'autoAnswer')
      const autoFill = getShopUpgradeEffects('calculator', 'autoFill')
      return i18next.t('shop.upgradeEffects.calculator', {
        amount1: formatAsPercentIncrease(addQuarkMult, 0),
        bool1: autoAnswer,
        bool2: autoFill
      })
    },
    isUnlocked: () => player.ascensionCount > 0 || player.highestSingularityCount > 0,
    price: 500,
    priceIncrease: 300,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 1,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  calculator2: {
    name: () => i18next.t('shop.names.calculator2'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator2'),
    effects: (n, key) => {
      if (key === 'addCodeCapacity') {
        return 2 * n
      }

      return n === 12 ? 1.25 : 1 // addQuarkMult
    },
    effectDescription () {
      const addCodeCapacity = getShopUpgradeEffects('calculator2', 'addCodeCapacity')
      const addQuarkMult = getShopUpgradeEffects('calculator2', 'addQuarkMult')
      return i18next.t('shop.upgradeEffects.calculator2', {
        amount1: addCodeCapacity,
        amount2: formatAsPercentIncrease(addQuarkMult, 0)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[11] > 0 || player.highestSingularityCount > 0,
    price: 2500,
    priceIncrease: 800,
    maxLevel: 12,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  calculator3: {
    name: () => i18next.t('shop.names.calculator3'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator3'),
    effects: (n, key) => {
      if (key === 'addRewardVarianceMultiplier') {
        return 1 - n / 10
      }

      return 60 * n // ascensionTimerAdd
    },
    effectDescription () {
      const addRewardVarianceMultiplier = getShopUpgradeEffects('calculator3', 'addRewardVarianceMultiplier')
      const ascensionTimerAdd = getShopUpgradeEffects('calculator3', 'ascensionTimerAdd')
      return i18next.t('shop.upgradeEffects.calculator3', {
        amount1: formatAsPercentIncrease(2 - addRewardVarianceMultiplier, 0),
        amount2: format(ascensionTimerAdd)
      })
    },
    isUnlocked: () => player.highestchallengecompletions[13] > 0 || player.highestSingularityCount > 0,
    price: 7500,
    priceIncrease: 1500,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  calculator4: {
    name: () => i18next.t('shop.names.calculator4'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator4'),
    effects: (n, key) => {
      if (key === 'addCodeIntervalMult') {
        return 1 - n / 25
      }

      return n === 10 ? 32 : 0 // addCodeCapacity
    },
    effectDescription () {
      const addCodeIntervalMult = getShopUpgradeEffects('calculator4', 'addCodeIntervalMult')
      const addCodeCapacity = getShopUpgradeEffects('calculator4', 'addCodeCapacity')
      return i18next.t('shop.upgradeEffects.calculator4', {
        amount1: formatAsPercentIncrease(2 - addCodeIntervalMult, 0),
        amount2: addCodeCapacity
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass', 'unlocked'),
    price: 1e7,
    priceIncrease: 1e6,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  calculator5: {
    name: () => i18next.t('shop.names.calculator5'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator5'),
    effects: (n, key) => {
      if (key === 'importGQTimerAdd') {
        return 6 * n
      }

      return Math.floor(n / 10) + (n === 100 ? 6 : 0) // addCodeCapacity
    },
    effectDescription () {
      const importGQTimerAdd = getShopUpgradeEffects('calculator5', 'importGQTimerAdd')
      const addCodeCapacity = getShopUpgradeEffects('calculator5', 'addCodeCapacity')
      return i18next.t('shop.upgradeEffects.calculator5', {
        amount1: format(importGQTimerAdd),
        amount2: format(addCodeCapacity)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 1e8,
    priceIncrease: 1e8,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  calculator6: {
    name: () => i18next.t('shop.names.calculator6'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator6'),
    effects: (n, key) => {
      if (key === 'octeractTimerAdd') {
        return n
      }

      return n === 100 ? 24 : 0
    },
    effectDescription () {
      const octeractTimerAdd = getShopUpgradeEffects('calculator6', 'octeractTimerAdd')
      const addCodeCapacity = getShopUpgradeEffects('calculator6', 'addCodeCapacity')
      return i18next.t('shop.upgradeEffects.calculator6', {
        amount1: format(octeractTimerAdd),
        amount2: format(addCodeCapacity)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 1e11,
    priceIncrease: 2e10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  constantEX: {
    name: () => i18next.t('shop.names.constantEX'),
    description: () => i18next.t('shop.upgradeDescriptions.constantEX'),
    effects: (n) => n, // maxPercentIncrease
    effectDescription () {
      const effect = getShopUpgradeEffects('constantEX', 'maxPercentIncrease')
      return i18next.t('shop.upgradeEffects.constantEX', { amount: format(effect, 0, true) })
    },
    isUnlocked: () => player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0,
    price: 100000,
    priceIncrease: 899999,
    maxLevel: 2,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  powderEX: {
    name: () => i18next.t('shop.names.powderEX'),
    description: () => i18next.t('shop.upgradeDescriptions.powderEX'),
    effects: (n) => 1 + 0.02 * n, // orbToPowderConversionMult
    effectDescription () {
      const effect = getShopUpgradeEffects('powderEX', 'orbToPowderConversionMult')
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
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  chronometer2: {
    name: () => i18next.t('shop.names.chronometer2'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometer2'),
    effects: (n: number) => 1 + 0.006 * n, // ascensionSpeedMult
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometer2', 'ascensionSpeedMult')
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Speed]
  },
  chronometer3: {
    name: () => i18next.t('shop.names.chronometer3'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometer3'),
    effects: (n) => 1 + 0.015 * n, // ascensionSpeedMult
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometer3', 'ascensionSpeedMult')
      return i18next.t('shop.upgradeEffects.chronometer3', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass', 'unlocked'),
    price: 250,
    priceIncrease: 250,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Speed]
  },
  seasonPassY: {
    name: () => i18next.t('shop.names.seasonPassY'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassY'),
    effects: (n) => 1 + 0.0075 * n, // globalCubeMult, wowOcteractMult
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPassY', 'globalCubeMult')
      return i18next.t('shop.upgradeEffects.seasonPassY', {
        amount: formatAsPercentIncrease(effects, 2)
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Cubes]
  },
  seasonPassZ: {
    name: () => i18next.t('shop.names.seasonPassZ'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassZ'),
    effects: (n) => 1 + 0.01 * n * player.singularityCount, // globalCubeMult, wowOcteractMult,
    effectDescription () {
      const effects = getShopUpgradeEffects('seasonPassZ', 'globalCubeMult')
      return i18next.t('shop.upgradeEffects.seasonPassZ', {
        amount: formatAsPercentIncrease(effects, 0)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass', 'unlocked'),
    price: 250,
    priceIncrease: 250,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Cubes]
  },
  challengeTome2: {
    name: () => i18next.t('shop.names.challengeTome2'),
    description: () => i18next.t('shop.upgradeDescriptions.challengeTome2'),
    effects: (n, key) => {
      if (key === 'c10RequirementReduction') {
        return 2e7 * n
      }

      return -n / 100 // c9c10ScalingReduction
    },
    effectDescription () {
      const c10RequirementReduction = getShopUpgradeEffects('challengeTome2', 'c10RequirementReduction')
      const c9c10ScalingReduction = getShopUpgradeEffects('challengeTome2', 'c9c10ScalingReduction')
      return i18next.t('shop.upgradeEffects.challengeTome2', {
        amount1: format(c10RequirementReduction, 0, true),
        amount2: format(c9c10ScalingReduction, 3, true)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass', 'unlocked'),
    price: 1000000,
    priceIncrease: 1000000,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  instantChallenge2: {
    name: () => i18next.t('shop.names.instantChallenge2'),
    description: () => i18next.t('shop.upgradeDescriptions.instantChallenge2'),
    effects: (n, key) => {
      if (key === 'unlocked') {
        return n > 0
      }

      return n * player.highestSingularityCount // extraCompPerTick
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('instantChallenge2', 'extraCompPerTick')
      return i18next.t('shop.upgradeEffects.instantChallenge2', { amount: format(effects) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass', 'unlocked'),
    price: 20000000,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  cubeToQuarkAll: {
    name: () => i18next.t('shop.names.cubeToQuarkAll'),
    description: () => i18next.t('shop.upgradeDescriptions.cubeToQuarkAll'),
    effects: (n) => 1 + 0.002 * n, // quarkMult
    effectDescription () {
      const effects = getShopUpgradeEffects('cubeToQuarkAll', 'quarkMult')
      return i18next.t('shop.upgradeEffects.cubeToQuarkAll', {
        amount: formatAsPercentIncrease(effects, 1)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 2222222,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark]
  },
  cashGrab2: {
    name: () => i18next.t('shop.names.cashGrab2'),
    description: () => i18next.t('shop.upgradeDescriptions.cashGrab2'),
    effects: (n) => 1 + 0.005 * n, // obtainiumMult, offeringMult
    effectDescription () {
      const effects = getShopUpgradeEffects('cashGrab2', 'obtainiumMult')
      return i18next.t('shop.upgradeEffects.cashGrab2', { amount: formatAsPercentIncrease(effects, 1) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 5000,
    priceIncrease: 5000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Obtainium, ShopUpgradeGroups.Offering]
  },
  chronometerZ: {
    name: () => i18next.t('shop.names.chronometerZ'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometerZ'),
    effects: (n: number) => 1 + 0.001 * n * player.singularityCount, // ascensionSpeedMult
    effectDescription () {
      const effect = getShopUpgradeEffects('chronometerZ', 'ascensionSpeedMult')
      return i18next.t('shop.upgradeEffects.chronometerZ', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 12500,
    priceIncrease: 12500,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Speed]
  },
  offeringEX2: {
    name: () => i18next.t('shop.names.offeringEX2'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringEX2'),
    effects: (n) => 1 + 0.01 * n * player.singularityCount, // offeringMult
    effectDescription () {
      const effect = getShopUpgradeEffects('offeringEX2', 'offeringMult')
      return i18next.t('shop.upgradeEffects.offeringEX2', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 10000,
    priceIncrease: 10000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Offering]
  },
  obtainiumEX2: {
    name: () => i18next.t('shop.names.obtainiumEX2'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumEX2'),
    effects: (n) => 1 + 0.01 * n * player.singularityCount, // obtainiumMult
    effectDescription () {
      const effect = getShopUpgradeEffects('obtainiumEX2', 'obtainiumMult')
      return i18next.t('shop.upgradeEffects.obtainiumEX2', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 10000,
    priceIncrease: 10000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Obtainium]
  },
  powderAuto: {
    name: () => i18next.t('shop.names.powderAuto'),
    description: () => i18next.t('shop.upgradeDescriptions.powderAuto'),
    effects: (n) => 0.01 * n, // automaticPowderFraction
    effectDescription () {
      const effect = getShopUpgradeEffects('powderAuto', 'automaticPowderFraction')
      return i18next.t('shop.upgradeEffects.powderAuto', { amount: formatAsPercentIncrease(1 + effect, 0) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 5e6,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  seasonPassLost: {
    name: () => i18next.t('shop.names.seasonPassLost'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassLost'),
    effects: (n) => 1 + 0.001 * n, // wowOcteractMult
    effectDescription () {
      const effect = getShopUpgradeEffects('seasonPassLost', 'wowOcteractMult')
      return i18next.t('shop.upgradeEffects.seasonPassLost', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 1000000,
    priceIncrease: 25000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Cubes]
  },
  challenge15Auto: {
    name: () => i18next.t('shop.names.challenge15Auto'),
    description: () => i18next.t('shop.upgradeDescriptions.challenge15Auto'),
    effects: (n) => n > 0, // unlocked
    effectDescription () {
      return i18next.t('shop.upgradeEffects.challenge15Auto')
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 5e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  extraWarp: {
    name: () => i18next.t('shop.names.extraWarp'),
    description: () => i18next.t('shop.upgradeDescriptions.extraWarp'),
    effects: (n) => n, // additionalWarps
    effectDescription () {
      const effects = getShopUpgradeEffects('extraWarp', 'additionalWarps')
      return i18next.t('shop.upgradeEffects.extraWarp', { amount: effects })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 1.25e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  autoWarp: {
    name: () => i18next.t('shop.names.autoWarp'),
    description: () => i18next.t('shop.upgradeDescriptions.autoWarp'),
    effects: (n) => n > 0, // unlocked
    effectDescription () {
      return i18next.t('shop.upgradeEffects.autoWarp')
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 5e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  improveQuarkHept: {
    name: () => i18next.t('shop.names.improveQuarkHept'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept'),
    effects: (n) => 0.01 * n, // quarkHeptExponent
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept', 'quarkHeptExponent')
      return i18next.t('shop.upgradeEffects.improveQuarkHept', { amount: format(effects, 2, true) })
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
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark, ShopUpgradeGroups.Utility]
  },
  improveQuarkHept2: {
    name: () => i18next.t('shop.names.improveQuarkHept2'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept2'),
    effects: (n) => 0.01 * n, // quarkHeptExponent
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept2', 'quarkHeptExponent')
      return i18next.t('shop.upgradeEffects.improveQuarkHept2', { amount: format(effects, 2, true) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass', 'unlocked'),
    price: 2e7 - 1,
    priceIncrease: 2e6 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark, ShopUpgradeGroups.Utility]
  },
  improveQuarkHept3: {
    name: () => i18next.t('shop.names.improveQuarkHept3'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept3'),
    effects: (n) => 0.01 * n, // quarkHeptExponent
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept3', 'quarkHeptExponent')
      return i18next.t('shop.upgradeEffects.improveQuarkHept3', { amount: format(effects, 2, true) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 2e9 - 1,
    priceIncrease: 2e9 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark, ShopUpgradeGroups.Utility]
  },
  improveQuarkHept4: {
    name: () => i18next.t('shop.names.improveQuarkHept4'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept4'),
    effects: (n) => 0.01 * n, // quarkHeptExponent
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept4', 'quarkHeptExponent')
      return i18next.t('shop.upgradeEffects.improveQuarkHept4', { amount: format(effects, 2, true) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 2e11 - 1,
    priceIncrease: 2e11 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark, ShopUpgradeGroups.Utility]
  },
  shopImprovedDaily: {
    name: () => i18next.t('shop.names.shopImprovedDaily'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily'),
    effects: (n) => 1 + 0.05 * n, // dailyCodeQuarkMult
    effectDescription () {
      const effects = getShopUpgradeEffects('shopImprovedDaily', 'dailyCodeQuarkMult')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily', {
        amount: formatAsPercentIncrease(effects, 0)
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
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopImprovedDaily2: {
    name: () => i18next.t('shop.names.shopImprovedDaily2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily2'),
    effects: (n, key) => {
      if (key === 'freeSingularityUpgrades') {
        return n
      }

      return 1 + 0.2 * n // dailyCodeGoldenQuarkMult
    },
    effectDescription () {
      const dailyCodeGoldenQuarkMult = getShopUpgradeEffects('shopImprovedDaily2', 'dailyCodeGoldenQuarkMult')
      const freeSingularityUpgrades = getShopUpgradeEffects('shopImprovedDaily2', 'freeSingularityUpgrades')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily2', {
        amount2: formatAsPercentIncrease(dailyCodeGoldenQuarkMult, 0),
        amount1: freeSingularityUpgrades
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass', 'unlocked'),
    price: 500000,
    priceIncrease: 500000,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopImprovedDaily3: {
    name: () => i18next.t('shop.names.shopImprovedDaily3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily3'),
    effects: (n, key) => {
      if (key === 'freeSingularityUpgrades') {
        return n
      }

      return 1 + 0.15 * n // dailyCodeGoldenQuarkMult
    },
    effectDescription () {
      const dailyCodeGoldenQuarkMult = getShopUpgradeEffects('shopImprovedDaily3', 'dailyCodeGoldenQuarkMult')
      const freeSingularityUpgrades = getShopUpgradeEffects('shopImprovedDaily3', 'freeSingularityUpgrades')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily3', {
        amount2: formatAsPercentIncrease(dailyCodeGoldenQuarkMult, 0),
        amount1: freeSingularityUpgrades
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass2', 'unlocked'),
    price: 5000000,
    priceIncrease: 12500000,
    maxLevel: 15,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopImprovedDaily4: {
    name: () => i18next.t('shop.names.shopImprovedDaily4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopImprovedDaily4'),
    effects: (n, key) => {
      if (key === 'freeSingularityUpgrades') {
        return n
      }

      return 1 + n // dailyCodeGoldenQuarkMult
    },
    effectDescription () {
      const dailyCodeGoldenQuarkMult = getShopUpgradeEffects('shopImprovedDaily4', 'dailyCodeGoldenQuarkMult')
      const freeSingularityUpgrades = getShopUpgradeEffects('shopImprovedDaily4', 'freeSingularityUpgrades')
      return i18next.t('shop.upgradeEffects.shopImprovedDaily4', {
        amount2: formatAsPercentIncrease(dailyCodeGoldenQuarkMult, 0),
        amount1: freeSingularityUpgrades
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 5e9,
    priceIncrease: 5e9,
    maxLevel: 25,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  offeringEX3: {
    name: () => i18next.t('shop.names.offeringEX3'),
    description: () => i18next.t('shop.upgradeDescriptions.offeringEX3'),
    effects: (n, key) => {
      if (key === 'offeringMult') {
        return Math.pow(1.012, n)
      }

      return Math.floor(n / 25) // baseOfferings
    },
    effectDescription () {
      const offeringMult = getShopUpgradeEffects('offeringEX3', 'offeringMult')
      const baseOfferings = getShopUpgradeEffects('offeringEX3', 'baseOfferings')
      return i18next.t('shop.upgradeEffects.offeringEX3', {
        amount: formatAsPercentIncrease(offeringMult),
        amount2: baseOfferings
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1,
    priceIncrease: 1.25e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Offering, ShopUpgradeGroups.InfinityUpgrades]
  },
  obtainiumEX3: {
    name: () => i18next.t('shop.names.obtainiumEX3'),
    description: () => i18next.t('shop.upgradeDescriptions.obtainiumEX3'),
    effects: (n, key) => {
      if (key === 'obtainiumMult') {
        return Math.pow(1.012, n)
      }

      return Math.pow(1.06, Math.floor(n / 25)) // immaculateObtainiuMult
    },
    effectDescription () {
      const obtainiumMult = getShopUpgradeEffects('obtainiumEX3', 'obtainiumMult')
      const immaculateObtainiuMult = getShopUpgradeEffects('obtainiumEX3', 'immaculateObtainiuMult')
      return i18next.t('shop.upgradeEffects.obtainiumEX3', {
        amount: formatAsPercentIncrease(obtainiumMult),
        amount2: formatAsPercentIncrease(immaculateObtainiuMult)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1,
    priceIncrease: 1.25e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Obtainium, ShopUpgradeGroups.InfinityUpgrades]
  },
  improveQuarkHept5: {
    name: () => i18next.t('shop.names.improveQuarkHept5'),
    description: () => i18next.t('shop.upgradeDescriptions.improveQuarkHept5'),
    effects: (n) => 0.0001 * n, // quarkHeptExponent
    effectDescription () {
      const effects = getShopUpgradeEffects('improveQuarkHept5', 'quarkHeptExponent')
      return i18next.t('shop.upgradeEffects.improveQuarkHept5', { amount: format(effects, 4, true) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1,
    priceIncrease: 2.5e9,
    maxLevel: 7777,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Quark, ShopUpgradeGroups.InfinityUpgrades, ShopUpgradeGroups.Utility]
  },
  chronometerInfinity: {
    name: () => i18next.t('shop.names.chronometerInfinity'),
    description: () => i18next.t('shop.upgradeDescriptions.chronometerInfinity'),
    effects: (n, key) => {
      if (key === 'ascensionSpeedMult') {
        return Math.pow(1.006, n)
      }

      return 0.001 * Math.floor(n / 40) // exponentSpread
    },
    effectDescription () {
      const ascensionSpeedMult = getShopUpgradeEffects('chronometerInfinity', 'ascensionSpeedMult')
      const exponentSpread = getShopUpgradeEffects('chronometerInfinity', 'exponentSpread')
      return i18next.t('shop.upgradeEffects.chronometerInfinity', {
        amount: formatAsPercentIncrease(ascensionSpeedMult),
        amount2: format(exponentSpread, 3, true)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1,
    priceIncrease: 2.5e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Speed, ShopUpgradeGroups.InfinityUpgrades]
  },
  seasonPassInfinity: {
    name: () => i18next.t('shop.names.seasonPassInfinity'),
    description: () => i18next.t('shop.upgradeDescriptions.seasonPassInfinity'),
    effects: (n, key) => {
      if (key === 'globalCubeMult') {
        return Math.pow(1.012, n)
      }

      return Math.pow(1.012, n * 1.25) // wowOcteractMult
    },
    effectDescription () {
      const globalCubeMult = getShopUpgradeEffects('seasonPassInfinity', 'globalCubeMult')
      const wowOcteractMult = getShopUpgradeEffects('seasonPassInfinity', 'wowOcteractMult')
      return i18next.t('shop.upgradeEffects.seasonPassInfinity', {
        amount: formatAsPercentIncrease(globalCubeMult),
        amount2: formatAsPercentIncrease(wowOcteractMult)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1,
    priceIncrease: 3.75e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Cubes, ShopUpgradeGroups.InfinityUpgrades]
  },
  shopSingularityPenaltyDebuff: {
    name: () => i18next.t('shop.names.shopSingularityPenaltyDebuff'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSingularityPenaltyDebuff'),
    effects: (n) => n, // singularityPenaltyReducers
    effectDescription () {
      const effects = getShopUpgradeEffects('shopSingularityPenaltyDebuff', 'singularityPenaltyReducers')
      return i18next.t('shop.upgradeEffects.shopSingularityPenaltyDebuff', {
        amount1: player.singularityCount,
        amount2: player.singularityCount - effects
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('noSingularityUpgrades', 'shopUpgrade'),
    price: 1e17,
    priceIncrease: 9.99e19,
    maxLevel: 4,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaLuckMultiplier4: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuckMultiplier4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuckMultiplier4'),
    effects: (n) => 0.01 * n, // additiveAmbrosiaLuckMult
    effectDescription () {
      const effects = getShopUpgradeEffects('shopAmbrosiaLuckMultiplier4', 'additiveAmbrosiaLuckMult')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuckMultiplier4', {
        amount: formatAsPercentIncrease(1 + effects, 0)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('oneChallengeCap', 'shopUpgrade'),
    price: 1e20,
    priceIncrease: 3e20,
    maxLevel: 4,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  calculator7: {
    name: () => i18next.t('shop.names.calculator7'),
    description: () => i18next.t('shop.upgradeDescriptions.calculator7'),
    effects: (n, key) => {
      if (key === 'blueberryTimerAdd') {
        return n
      }

      return n === 50 ? 48 : 0 // addCodeCapacity
    },
    effectDescription () {
      const blueberryTimerAdd = getShopUpgradeEffects('calculator7', 'blueberryTimerAdd')
      const addCodeCapacity = getShopUpgradeEffects('calculator7', 'addCodeCapacity')
      return i18next.t('shop.upgradeEffects.calculator7', {
        amount1: format(blueberryTimerAdd),
        amount2: format(addCodeCapacity)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('limitedAscensions', 'shopUpgrade'),
    price: 1e20,
    priceIncrease: 1e19,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  shopOcteractAmbrosiaLuck: {
    name: () => i18next.t('shop.names.shopOcteractAmbrosiaLuck'),
    description: () => i18next.t('shop.upgradeDescriptions.shopOcteractAmbrosiaLuck'),
    effects: (n) => n * (1 + Math.floor(Math.max(0, Math.log10(player.wowOcteracts)))), // ambrosiaLuck
    effectDescription () {
      const effects = getShopUpgradeEffects('shopOcteractAmbrosiaLuck', 'ambrosiaLuck')
      return i18next.t('shop.upgradeEffects.shopOcteractAmbrosiaLuck', { amount: format(effects) })
    },
    isUnlocked: () => getSingularityChallengeEffect('noOcteracts', 'shopUpgrade'),
    price: 1e21,
    priceIncrease: 9e21,
    maxLevel: 2,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaGeneration1: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration1'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration1'),
    effects: (n) => 1 + 0.01 * n, // ambrosiaGenerationMult
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration1', 'ambrosiaGenerationMult')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration1', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 5e11,
    priceIncrease: 5e11,
    maxLevel: 25,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaGeneration2: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration2'),
    effects: (n) => 1 + 0.01 * n, // ambrosiaGenerationMult
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration2', 'ambrosiaGenerationMult')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration2', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 5e12,
    priceIncrease: 5e12,
    maxLevel: 30,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaGeneration3: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration3'),
    effects: (n) => 1 + 0.01 * n, // ambrosiaGenerationMult
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration3', 'ambrosiaGenerationMult')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration3', { amount: formatAsPercentIncrease(effect, 0) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 5e13,
    priceIncrease: 5e13,
    maxLevel: 35,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaGeneration4: {
    name: () => i18next.t('shop.names.shopAmbrosiaGeneration4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaGeneration4'),
    effects: (n) => 1 + 0.001 * n, // ambrosiaGenerationMult
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaGeneration4', 'ambrosiaGenerationMult')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration4', { amount: formatAsPercentIncrease(effect, 1) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1e17,
    priceIncrease: 4 * 1e16,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaLuck1: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck1'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck1'),
    effects: (n) => 2 * n, // ambrosiaLuck
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck1', 'ambrosiaLuck')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck1', { amount: format(effect) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 2e11,
    priceIncrease: 2e11,
    maxLevel: 40,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaLuck2: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck2'),
    effects: (n) => 2 * n, // ambrosiaLuck
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck2', 'ambrosiaLuck')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck2', { amount: format(effect) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass3', 'unlocked'),
    price: 2e12,
    priceIncrease: 2e12,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaLuck3: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck3'),
    effects: (n) => 2 * n, // ambrosiaLuck
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck3', 'ambrosiaLuck')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck3', { amount: format(effect) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 2e13,
    priceIncrease: 2e13,
    maxLevel: 60,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaLuck4: {
    name: () => i18next.t('shop.names.shopAmbrosiaLuck4'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaLuck4'),
    effects: (n) => 0.6 * n, // ambrosiaLuck
    effectDescription () {
      const effect = getShopUpgradeEffects('shopAmbrosiaLuck4', 'ambrosiaLuck')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaLuck4', { amount: format(effect, 1, true) })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1e17,
    priceIncrease: 4 * 1e16,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopRedLuck1: {
    name: () => i18next.t('shop.names.shopRedLuck1'),
    description: () => i18next.t('shop.upgradeDescriptions.shopRedLuck1'),
    effects: (n, key) => {
      if (key === 'redLuck') {
        return 0.05 * n
      }

      return -0.01 * Math.floor(n / 20) // luckConversionRatio
    },
    effectDescription () {
      const redLuck = getShopUpgradeEffects('shopRedLuck1', 'redLuck')
      const luckConversionRatio = getShopUpgradeEffects('shopRedLuck1', 'luckConversionRatio')
      return i18next.t('shop.upgradeEffects.shopRedLuck1', {
        amount: format(redLuck, 2, true),
        amount2: format(-luckConversionRatio, 2, true)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 5e13,
    priceIncrease: 5e13,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopRedLuck2: {
    name: () => i18next.t('shop.names.shopRedLuck2'),
    description: () => i18next.t('shop.upgradeDescriptions.shopRedLuck2'),
    effects: (n, key) => {
      if (key === 'redLuck') {
        return 0.075 * n
      }

      return -0.01 * Math.floor(n / 20) // luckConversionRatio
    },
    effectDescription () {
      const redLuck = getShopUpgradeEffects('shopRedLuck2', 'redLuck')
      const luckConversionRatio = getShopUpgradeEffects('shopRedLuck2', 'luckConversionRatio')
      return i18next.t('shop.upgradeEffects.shopRedLuck2', {
        amount: format(redLuck, 3, true),
        amount2: format(-luckConversionRatio, 2, true)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1e17,
    priceIncrease: 1e17,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopRedLuck3: {
    name: () => i18next.t('shop.names.shopRedLuck3'),
    description: () => i18next.t('shop.upgradeDescriptions.shopRedLuck3'),
    effects: (n, key) => {
      if (key === 'redLuck') {
        return 0.1 * n
      }

      return -0.01 * Math.floor(n / 20) // luckConversionRatio
    },
    effectDescription () {
      const redLuck = getShopUpgradeEffects('shopRedLuck3', 'redLuck')
      const luckConversionRatio = getShopUpgradeEffects('shopRedLuck3', 'luckConversionRatio')
      return i18next.t('shop.upgradeEffects.shopRedLuck3', {
        amount: format(redLuck, 1, true),
        amount2: format(-luckConversionRatio, 2, true)
      })
    },
    isUnlocked: () => getGQUpgradeEffect('wowPass4', 'unlocked'),
    price: 1e21,
    priceIncrease: 3e19,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopCashGrabUltra: {
    name: () => i18next.t('shop.names.shopCashGrabUltra'),
    description: () => i18next.t('shop.upgradeDescriptions.shopCashGrabUltra'),
    effects: (n, key) => {
      const ratio = Math.min(1, Math.cbrt(player.lifetimeAmbrosia / 1e7))

      if (key === 'ambrosiaGenerationMult') {
        return 1 + 0.15 * n * ratio
      } else if (key === 'cubesMult') {
        return 1 + 1.2 * n * ratio
      }

      return 1 + 0.08 * n * ratio // quarkMult
    },
    effectDescription () {
      const ambrosiaGenerationMult = getShopUpgradeEffects('shopCashGrabUltra', 'ambrosiaGenerationMult')
      const cubesMult = getShopUpgradeEffects('shopCashGrabUltra', 'cubesMult')
      const quarkMult = getShopUpgradeEffects('shopCashGrabUltra', 'quarkMult')
      return i18next.t('shop.upgradeEffects.shopCashGrabUltra', {
        amount: formatAsPercentIncrease(ambrosiaGenerationMult),
        amount2: formatAsPercentIncrease(cubesMult),
        amount3: formatAsPercentIncrease(quarkMult)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('noSingularityUpgrades', 'shopUpgrade2'),
    price: 1,
    priceIncrease: 1e22,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaAccelerator: {
    name: () => i18next.t('shop.names.shopAmbrosiaAccelerator'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaAccelerator'),
    effects: (n) => {
      const ex5Comps = player.singularityChallenges.noAmbrosiaUpgrades.completions
      return 1 - 0.006 * n * ex5Comps // ambrosiaPointRequirementMult
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopAmbrosiaAccelerator', 'ambrosiaPointRequirementMult')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaAccelerator', {
        amount: formatAsPercentIncrease(2 - effects, 1)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('noAmbrosiaUpgrades', 'shopUpgrade'),
    price: 1e21,
    priceIncrease: 2e21,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopEXUltra: {
    name: () => i18next.t('shop.names.shopEXUltra'),
    description: () => i18next.t('shop.upgradeDescriptions.shopEXUltra'),
    effects: (n) => {
      const ambrosiaMult = Math.min(125 * n, player.lifetimeAmbrosia / 1000) / 1000
      return 1 + ambrosiaMult // offeringMult, obtainiumMult, cubeMult
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopEXUltra', 'offeringMult')
      return i18next.t('shop.upgradeEffects.shopEXUltra', { amount: formatAsPercentIncrease(effects) })
    },
    isUnlocked: () => getSingularityChallengeEffect('noAmbrosiaUpgrades', 'shopUpgrade2'),
    price: 5e21,
    priceIncrease: 0,
    maxLevel: 80,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopChronometerS: {
    name: () => i18next.t('shop.names.shopChronometerS'),
    description: () => i18next.t('shop.upgradeDescriptions.shopChronometerS'),
    effects: (n) => {
      return Math.pow(1.01, n * Math.max(0, player.singularityCount - 200)) // ascensionSpeedMult, globalSpeedMult
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopChronometerS', 'ascensionSpeedMult')
      return i18next.t('shop.upgradeEffects.shopChronometerS', {
        amount: formatAsPercentIncrease(effects)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('limitedTime', 'shopUpgrade'),
    price: 5e21,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopAmbrosiaUltra: {
    name: () => i18next.t('shop.names.shopAmbrosiaUltra'),
    description: () => i18next.t('shop.upgradeDescriptions.shopAmbrosiaUltra'),
    effects: (n) => {
      const totalExaltChallengeCompletions = sumOfExaltCompletions()
      return 2 * n * totalExaltChallengeCompletions // ambrosiaLuck
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopAmbrosiaUltra', 'ambrosiaLuck')
      return i18next.t('shop.upgradeEffects.shopAmbrosiaUltra', { amount: format(effects) })
    },
    isUnlocked: () => getSingularityChallengeEffect('limitedTime', 'shopUpgrade2'),
    price: 8e23,
    priceIncrease: 2e23,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopSingularitySpeedup: {
    name: () => i18next.t('shop.names.shopSingularitySpeedup'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSingularitySpeedup'),
    effects: (n) => n > 0 ? 50 : 1, // singularityUpgradeSpeedMult
    effectDescription () {
      const effects = getShopUpgradeEffects('shopSingularitySpeedup', 'singularityUpgradeSpeedMult')
      return i18next.t('shop.upgradeEffects.shopSingularitySpeedup', {
        amount: format(effects)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('sadisticPrequel', 'shopUpgrade'),
    price: 2e22,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopSingularityPotency: {
    name: () => i18next.t('shop.names.shopSingularityPotency'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSingularityPotency'),
    effects: (n) => n > 0 ? 3.66 : 1, // freeUpgradeMult
    effectDescription () {
      const effects = getShopUpgradeEffects('shopSingularityPotency', 'freeUpgradeMult')
      return i18next.t('shop.upgradeEffects.shopSingularityPotency', {
        amount: format(effects, 2, true)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('sadisticPrequel', 'shopUpgrade2'),
    price: 2e23,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopSadisticRune: {
    name: () => i18next.t('shop.names.shopSadisticRune'),
    description: () => i18next.t('shop.upgradeDescriptions.shopSadisticRune'),
    effects: (n) => n > 0, // runeUnlocked
    effectDescription () {
      return i18next.t('shop.upgradeEffects.shopSadisticRune')
    },
    isUnlocked: () => getSingularityChallengeEffect('sadisticPrequel', 'shopUpgrade3'),
    price: 2e27,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [ShopUpgradeGroups.Utility]
  },
  shopInfiniteShopUpgrades: {
    name: () => i18next.t('shop.names.shopInfiniteShopUpgrades'),
    description: () => i18next.t('shop.upgradeDescriptions.shopInfiniteShopUpgrades'),
    effects: (n) => {
      const totalExaltChallengeCompletions = sumOfExaltCompletions()
      return Math.floor(0.01 * n * totalExaltChallengeCompletions) // infiniteVouchers
    },
    effectDescription () {
      const effects = getShopUpgradeEffects('shopInfiniteShopUpgrades', 'infiniteVouchers')
      return i18next.t('shop.upgradeEffects.shopInfiniteShopUpgrades', {
        amount: format(effects, 0)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('limitedAscensions', 'shopUpgrade'),
    price: 1e20,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopHorseShoe: {
    name: () => i18next.t('shop.names.shopHorseShoe'),
    description: () => i18next.t('shop.upgradeDescriptions.shopHorseShoe'),
    effects: (n, key) => {
      if (key === 'bonusHorseLevels') {
        return 3 * n
      }

      const horseShoeLevel = getRuneEffectiveLevel('horseShoe')
      return 1 - Math.min(300, horseShoeLevel * n) / 1000 // singularityPenaltyMult
    },
    effectDescription () {
      const bonusHorseLevels = getShopUpgradeEffects('shopHorseShoe', 'bonusHorseLevels')
      const singularityPenaltyMult = getShopUpgradeEffects('shopHorseShoe', 'singularityPenaltyMult')
      return i18next.t('shop.upgradeEffects.shopHorseShoe', {
        amount1: bonusHorseLevels,
        amount2: formatAsPercentIncrease(singularityPenaltyMult)
      })
    },
    isUnlocked: () => getSingularityChallengeEffect('taxmanLastStand', 'shopUpgrade'),
    price: 5e26,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: []
  },
  shopPanthema: {
    name: () => i18next.t('shop.names.shopPanthema'),
    description: () => i18next.t('shop.upgradeDescriptions.shopPanthema'),
    effects: (n, key) => {
      const infinityBoost = 1 + 0.01 * n * shopUpgradeTypeInfo[ShopUpgradeGroups.InfinityUpgrades].bonusLevels()

      if (key === 'infinityMetaBoost') {
        return infinityBoost
      } else if (key === 'offeringMult') {
        return 1 + 0.01 * n * shopUpgradeTypeInfo[ShopUpgradeGroups.Offering].bonusLevels() * infinityBoost
      } else if (key === 'obtainiumMult') {
        return 1 + 0.01 * n * shopUpgradeTypeInfo[ShopUpgradeGroups.Obtainium].bonusLevels() * infinityBoost
      } else if (key === 'cubeMult') {
        return 1 + 0.005 * n * shopUpgradeTypeInfo[ShopUpgradeGroups.Cubes].bonusLevels() * infinityBoost
      } else if (key === 'ascensionSpeedMult') {
        return 1 + 0.005 * n * shopUpgradeTypeInfo[ShopUpgradeGroups.Speed].bonusLevels() * infinityBoost
      } else if (key === 'quarkMult') {
        return 1 + 0.001 * n * shopUpgradeTypeInfo[ShopUpgradeGroups.Quark].bonusLevels() * infinityBoost
      }

      throw new TypeError(`unknown effect ${key}`)
    },
    effectDescription () {
      const offeringMult = getShopUpgradeEffects('shopPanthema', 'offeringMult')
      const infinityMetaBoost = getShopUpgradeEffects('shopPanthema', 'infinityMetaBoost')
      const obtainiumMult = getShopUpgradeEffects('shopPanthema', 'obtainiumMult')
      const cubeMult = getShopUpgradeEffects('shopPanthema', 'cubeMult')
      const ascensionSpeedMult = getShopUpgradeEffects('shopPanthema', 'ascensionSpeedMult')
      const quarkMult = getShopUpgradeEffects('shopPanthema', 'quarkMult')

      let effectHTML = i18next.t('shop.upgradeEffects.shopPanthema')
      if (offeringMult > 1) {
        effectHTML += `<br><span style="color:${shopUpgradeTypeInfo[ShopUpgradeGroups.Offering].HTMLColor}">${
          i18next.t('shop.upgradeEffects.shopPanthemaOffering', {
            amount: formatAsPercentIncrease(offeringMult),
            amount2: formatAsPercentIncrease(1 + 0.01 * infinityMetaBoost, 2)
          })
        }</span>`
      }
      if (obtainiumMult > 1) {
        effectHTML += `<br><span style="color:${shopUpgradeTypeInfo[ShopUpgradeGroups.Obtainium].HTMLColor}">${
          i18next.t('shop.upgradeEffects.shopPanthemaObtainium', {
            amount: formatAsPercentIncrease(obtainiumMult),
            amount2: formatAsPercentIncrease(1 + 0.01 * infinityMetaBoost, 2)
          })
        }</span>`
      }
      if (cubeMult > 1) {
        effectHTML += `<br><span style="color:${shopUpgradeTypeInfo[ShopUpgradeGroups.Cubes].HTMLColor}">${
          i18next.t('shop.upgradeEffects.shopPanthemaCubes', {
            amount: formatAsPercentIncrease(cubeMult),
            amount2: formatAsPercentIncrease(1 + 0.005 * infinityMetaBoost, 3)
          })
        }</span>`
      }
      if (ascensionSpeedMult > 1) {
        effectHTML += `<br><span style="color:${shopUpgradeTypeInfo[ShopUpgradeGroups.Speed].HTMLColor}">${
          i18next.t('shop.upgradeEffects.shopPanthemaAscensionSpeed', {
            amount: formatAsPercentIncrease(ascensionSpeedMult),
            amount2: formatAsPercentIncrease(1 + 0.005 * infinityMetaBoost, 3)
          })
        }</span>`
      }
      if (quarkMult > 1) {
        effectHTML += `<br><span style="color:${shopUpgradeTypeInfo[ShopUpgradeGroups.Quark].HTMLColor}">${
          i18next.t('shop.upgradeEffects.shopPanthemaQuarks', {
            amount: formatAsPercentIncrease(quarkMult),
            amount2: formatAsPercentIncrease(1 + 0.001 * infinityMetaBoost, 3)
          })
        }</span>`
      }
      if (infinityMetaBoost > 1) {
        effectHTML += `<br><span style="color:${shopUpgradeTypeInfo[ShopUpgradeGroups.InfinityUpgrades].HTMLColor}">${
          i18next.t('shop.upgradeEffects.shopPanthemaInfinityMeta', {
            amount: formatAsPercentIncrease(infinityMetaBoost, 2)
          })
        }</span>`
      }

      return effectHTML
    },
    isUnlocked: () => getSingularityChallengeEffect('noQuarkUpgrades', 'shopUpgrade'),
    price: 125000,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    resetOnSingularity: resetNever,
    refundMinimumLevel: 0,
    upgradeTypes: [
      ShopUpgradeGroups.Offering,
      ShopUpgradeGroups.Obtainium,
      ShopUpgradeGroups.Cubes,
      ShopUpgradeGroups.Speed,
      ShopUpgradeGroups.InfinityUpgrades,
      ShopUpgradeGroups.Quark
    ]
  }
}

export const shopUpgradeNames: ShopUpgradeNames[] = Object.keys(shopUpgrades) as ShopUpgradeNames[]

const getBonusLevels = (upgradeKey: ShopUpgradeNames) => {
  let bonusLevels = 0
  for (const type of shopUpgrades[upgradeKey].upgradeTypes) {
    bonusLevels += shopUpgradeTypeInfo[type].bonusLevels()
  }
  return bonusLevels
}

const getShopLevel = (upgradeKey: ShopUpgradeNames) => {
  if (
    (player.singularityChallenges.noQuarkUpgrades.enabled
      && !shopUpgrades[upgradeKey].upgradeTypes.includes(ShopUpgradeGroups.Utility))
    || !shopUpgrades[upgradeKey].isUnlocked()
  ) {
    return 0
  }

  if (upgradeKey === 'shopPanthema') {
    return player.shopUpgrades[upgradeKey]
  } else {
    return player.shopUpgrades[upgradeKey] + getBonusLevels(upgradeKey)
  }
}

export const getShopUpgradeEffects = <
  T extends ShopUpgradeNames,
  K extends keyof QuarkShopUpgradeRewards[T]
>(upgradeKey: T, key: K): QuarkShopUpgradeRewards[T][K] => {
  const shopLevel = getShopLevel(upgradeKey)
  return shopUpgrades[upgradeKey].effects(shopLevel, key) as QuarkShopUpgradeRewards[T][K]
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

  let symbolHTML = ''
  let bonusLevelHTML = ''

  // This is done in order for consistent formatting
  for (let i = ShopUpgradeGroups.Offering; i <= LAST_GROUP; i++) {
    if (shopUpgrades[input].upgradeTypes.includes(i)) {
      const bonusLevels = shopUpgradeTypeInfo[i].bonusLevels()
      symbolHTML += `<span style="color: ${shopUpgradeTypeInfo[i].HTMLColor}"> [${
        shopUpgradeTypeInfo[i].symbol
      }]</span>`
      if (bonusLevels > 0) {
        bonusLevelHTML += `<span style="color: ${shopUpgradeTypeInfo[i].HTMLColor}"> [+${
          shopUpgradeTypeInfo[i].bonusLevels()
        }]</span>`
      }
    }
  }
  const level = player.shopUpgrades[input]
  const maxLevel = shopUpgrades[input].maxLevel
  const levelHTMLColor = level >= maxLevel ? 'orchid' : 'white'

  const levelHTML = i18next.t('shop.levelWithText', { x: format(level), y: format(maxLevel) })

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

  return `${name}${symbolHTML}<br>
  <span style="color:${levelHTMLColor}">${levelHTML}</span>${bonusLevelHTML}<br>
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
  if (player.shopConfirmationToggle) {
    void Alert(i18next.t('shop.refundSuccessful', {
      amount: format(totalRefundAmt, 0, false)
    }))
  }
}
