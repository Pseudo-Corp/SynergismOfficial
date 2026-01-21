import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateBaseObtainium,
  calculateBaseOfferings,
  calculateCashGrabBlueberryBonus,
  calculateCashGrabCubeBonus,
  calculateCashGrabQuarkBonus,
  calculateFreeShopInfinityUpgrades,
  calculateObtainium,
  calculateObtainiumPotionBaseObtainium,
  calculateOfferingPotionBaseOfferings,
  calculateOfferingsDecimal,
  calculatePotionValue,
  calculatePowderConversion,
  calculateSummationNonLinear,
  sumOfExaltCompletions
} from './Calculate'
import type { IMultiBuy } from './Cubes'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getRuneEffectiveLevel } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { format, formatAsPercentIncrease, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Confirm, Prompt, revealStuff } from './UpdateHTML'
import { Globals as G } from './Variables'

/**
 * Standardization of metadata contained for each shop upgrade.
 */
export enum shopUpgradeTypes {
  CONSUMABLE = 'consume',
  UPGRADE = 'upgrade'
}

type shopResetTier =
  | 'Reincarnation'
  | 'Ascension'
  | 'Singularity'
  | 'SingularityVol2'
  | 'SingularityVol3'
  | 'SingularityVol4'
  | 'Exalt1'
  | 'Exalt2'
  | 'Exalt3'
  | 'Exalt4'
  | 'Exalt2x20'
  | 'Exalt1x30'
  | 'Exalt5'
  | 'Exalt5x20'
  | 'Exalt6x15'
  | 'Exalt6x25'
  | 'Exalt7x10'
  | 'Exalt7x20'
  | 'Exalt7x30'
  | 'Exalt8x5'

export interface IShopData {
  price: number
  priceIncrease: number
  maxLevel: number
  type: shopUpgradeTypes
  refundable: boolean
  refundMinimumLevel: number
  tier: shopResetTier
}

export const shopData: Record<keyof Player['shopUpgrades'], IShopData> = {
  offeringPotion: {
    price: 100,
    priceIncrease: 0,
    maxLevel: Math.pow(10, 15),
    type: shopUpgradeTypes.CONSUMABLE,
    refundable: false,
    refundMinimumLevel: 0,
    tier: 'Reincarnation'
  },
  obtainiumPotion: {
    tier: 'Reincarnation',
    price: 100,
    priceIncrease: 0,
    maxLevel: Math.pow(10, 15),
    type: shopUpgradeTypes.CONSUMABLE,
    refundable: false,
    refundMinimumLevel: 0
  },
  offeringEX: {
    tier: 'Reincarnation',
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  offeringAuto: {
    tier: 'Reincarnation',
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 1
  },
  obtainiumEX: {
    tier: 'Reincarnation',
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  obtainiumAuto: {
    tier: 'Reincarnation',
    price: 150,
    priceIncrease: 10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 1
  },
  instantChallenge: {
    tier: 'Reincarnation',
    price: 300,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  antSpeed: {
    tier: 'Reincarnation',
    price: 200,
    priceIncrease: 25,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  cashGrab: {
    tier: 'Reincarnation',
    price: 100,
    priceIncrease: 40,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  shopTalisman: {
    tier: 'Reincarnation',
    price: 1500,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  seasonPass: {
    tier: 'Ascension',
    price: 500,
    priceIncrease: 75,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  challengeExtension: {
    tier: 'Ascension',
    price: 500,
    priceIncrease: 250,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  challengeTome: {
    tier: 'Ascension',
    price: 500,
    priceIncrease: 250,
    maxLevel: 15,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  cubeToQuark: {
    tier: 'Ascension',
    price: 2000,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  tesseractToQuark: {
    tier: 'Ascension',
    price: 3500,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  hypercubeToQuark: {
    tier: 'Ascension',
    price: 5000,
    priceIncrease: 99999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  seasonPass2: {
    tier: 'Ascension',
    price: 2500,
    priceIncrease: 250,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  seasonPass3: {
    tier: 'Ascension',
    price: 5000,
    priceIncrease: 500,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  chronometer: {
    tier: 'Ascension',
    price: 1600,
    priceIncrease: 400,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  infiniteAscent: {
    tier: 'Ascension',
    price: 25000,
    priceIncrease: 9999999,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  calculator: {
    tier: 'Reincarnation',
    price: 500,
    priceIncrease: 300,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 1
  },
  calculator2: {
    tier: 'Ascension',
    price: 2500,
    priceIncrease: 800,
    maxLevel: 12,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  calculator3: {
    tier: 'Ascension',
    price: 7500,
    priceIncrease: 1500,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  calculator4: {
    tier: 'Singularity',
    price: 1e7,
    priceIncrease: 1e6,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  calculator5: {
    tier: 'SingularityVol2',
    price: 1e8,
    priceIncrease: 1e8,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  calculator6: {
    tier: 'SingularityVol3',
    price: 1e11,
    priceIncrease: 2e10,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  constantEX: {
    tier: 'Ascension',
    price: 100000,
    priceIncrease: 899999,
    maxLevel: 2,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  powderEX: {
    tier: 'Ascension',
    price: 1000,
    priceIncrease: 750,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  chronometer2: {
    tier: 'Ascension',
    price: 5000,
    priceIncrease: 1500,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  chronometer3: {
    tier: 'Singularity',
    price: 250,
    priceIncrease: 250,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  seasonPassY: {
    tier: 'Ascension',
    price: 10000,
    priceIncrease: 1500,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: true,
    refundMinimumLevel: 0
  },
  seasonPassZ: {
    tier: 'Singularity',
    price: 250,
    priceIncrease: 250,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  challengeTome2: {
    tier: 'Singularity',
    price: 1000000,
    priceIncrease: 1000000,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  instantChallenge2: {
    tier: 'Singularity',
    price: 20000000,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  cubeToQuarkAll: {
    tier: 'SingularityVol2',
    price: 2222222,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  cashGrab2: {
    tier: 'SingularityVol2',
    price: 5000,
    priceIncrease: 5000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  chronometerZ: {
    tier: 'SingularityVol2',
    price: 12500,
    priceIncrease: 12500,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  offeringEX2: {
    tier: 'SingularityVol2',
    price: 10000,
    priceIncrease: 10000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  obtainiumEX2: {
    tier: 'SingularityVol2',
    price: 10000,
    priceIncrease: 10000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  powderAuto: {
    tier: 'SingularityVol2',
    price: 5e6,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  seasonPassLost: {
    tier: 'SingularityVol2',
    price: 1000000,
    priceIncrease: 25000,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  challenge15Auto: {
    tier: 'SingularityVol3',
    price: 5e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  extraWarp: {
    tier: 'SingularityVol3',
    price: 1.25e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  autoWarp: {
    tier: 'SingularityVol3',
    price: 5e11,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  improveQuarkHept: {
    tier: 'Ascension',
    price: 2e5 - 1,
    priceIncrease: 19999,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  improveQuarkHept2: {
    tier: 'Singularity',
    price: 2e7 - 1,
    priceIncrease: 2e6 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  improveQuarkHept3: {
    tier: 'SingularityVol2',
    price: 2e9 - 1,
    priceIncrease: 2e9 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  improveQuarkHept4: {
    tier: 'SingularityVol3',
    price: 2e11 - 1,
    priceIncrease: 2e11 - 1,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopImprovedDaily: {
    tier: 'Ascension',
    price: 5000,
    priceIncrease: 2500,
    maxLevel: 20,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopImprovedDaily2: {
    tier: 'Singularity',
    price: 500000,
    priceIncrease: 500000,
    maxLevel: 10,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopImprovedDaily3: {
    tier: 'SingularityVol2',
    price: 5000000,
    priceIncrease: 12500000,
    maxLevel: 15,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopImprovedDaily4: {
    tier: 'SingularityVol3',
    price: 5e9,
    priceIncrease: 5e9,
    maxLevel: 25,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  offeringEX3: {
    tier: 'SingularityVol4',
    price: 1,
    priceIncrease: 1.25e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  obtainiumEX3: {
    tier: 'SingularityVol4',
    price: 1,
    priceIncrease: 1.25e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  improveQuarkHept5: {
    tier: 'SingularityVol4',
    price: 1,
    priceIncrease: 2.5e13,
    maxLevel: 80,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  chronometerInfinity: {
    tier: 'SingularityVol4',
    price: 1,
    priceIncrease: 2.5e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  seasonPassInfinity: {
    tier: 'SingularityVol4',
    price: 1,
    priceIncrease: 3.75e12,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopSingularityPenaltyDebuff: {
    tier: 'Exalt1',
    price: 1e17,
    priceIncrease: 9.99e19,
    maxLevel: 4,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuckMultiplier4: {
    tier: 'Exalt2',
    price: 1e20,
    priceIncrease: 3e20,
    maxLevel: 4,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  calculator7: {
    tier: 'Exalt3',
    price: 1e20,
    priceIncrease: 1e19,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopOcteractAmbrosiaLuck: {
    tier: 'Exalt4',
    price: 1e21,
    priceIncrease: 9e21,
    maxLevel: 2,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration1: {
    tier: 'SingularityVol2',
    price: 50000000,
    priceIncrease: 50000000,
    maxLevel: 25,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration2: {
    tier: 'SingularityVol3',
    price: 5e11,
    priceIncrease: 5e11,
    maxLevel: 30,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration3: {
    tier: 'SingularityVol4',
    price: 5e13,
    priceIncrease: 5e13,
    maxLevel: 35,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaGeneration4: {
    tier: 'SingularityVol4',
    price: 1e17,
    priceIncrease: 4 * 1e16,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck1: {
    tier: 'SingularityVol2',
    price: 20000000,
    priceIncrease: 20000000,
    maxLevel: 40,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck2: {
    tier: 'SingularityVol3',
    price: 2e11,
    priceIncrease: 2e11,
    maxLevel: 50,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck3: {
    tier: 'SingularityVol4',
    price: 2e13,
    priceIncrease: 2e13,
    maxLevel: 60,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaLuck4: {
    tier: 'SingularityVol4',
    price: 1e17,
    priceIncrease: 4 * 1e16,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopRedLuck1: {
    tier: 'SingularityVol4',
    price: 5e13,
    priceIncrease: 5e13,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopRedLuck2: {
    tier: 'SingularityVol4',
    price: 1e17,
    priceIncrease: 1e17,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopRedLuck3: {
    tier: 'SingularityVol4',
    price: 1e21,
    priceIncrease: 3e19,
    maxLevel: 1000,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopCashGrabUltra: {
    tier: 'Exalt1x30',
    price: 1,
    priceIncrease: 1e22,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaAccelerator: {
    tier: 'Exalt5',
    price: 1e21,
    priceIncrease: 2e21,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopEXUltra: {
    tier: 'Exalt5x20',
    price: 5e21,
    priceIncrease: 0,
    maxLevel: 80,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopChronometerS: {
    tier: 'Exalt6x15',
    price: 5e21,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopAmbrosiaUltra: {
    tier: 'Exalt6x25',
    price: 8e23,
    priceIncrease: 2e23,
    maxLevel: 5,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopSingularitySpeedup: {
    tier: 'Exalt7x10',
    price: 2e22,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopSingularityPotency: {
    tier: 'Exalt7x20',
    price: 2e23,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopSadisticRune: {
    tier: 'Exalt7x30',
    price: 2e27,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopInfiniteShopUpgrades: {
    tier: 'Exalt2x20',
    price: 1e20,
    priceIncrease: 0,
    maxLevel: 100,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  },
  shopHorseShoe: {
    tier: 'Exalt8x5',
    price: 5e26,
    priceIncrease: 0,
    maxLevel: 1,
    type: shopUpgradeTypes.UPGRADE,
    refundable: false,
    refundMinimumLevel: 0
  }
}

export const updateShopLevels = () => {
  for (const upgrade in player.shopUpgrades) {
    const k = upgrade as keyof Player['shopUpgrades']
    player.shopUpgrades[k] = Math.min(player.shopUpgrades[k], shopData[k].maxLevel)
  }
}

// Names of shop upgrades || Top row indicates potions, and all other upgrades are labeled in order.
// If you are adding more upgrades please make sure the order of labelled upgrades is correct!
type ShopUpgradeNames =
  | 'offeringPotion'
  | 'obtainiumPotion'
  | 'offeringEX'
  | 'offeringAuto'
  | 'offeringEX2'
  | 'obtainiumEX'
  | 'obtainiumAuto'
  | 'obtainiumEX2'
  | 'instantChallenge'
  | 'instantChallenge2'
  | 'antSpeed'
  | 'cashGrab'
  | 'cashGrab2'
  | 'shopTalisman'
  | 'seasonPass'
  | 'challengeExtension'
  | 'challengeTome'
  | 'challengeTome2'
  | 'cubeToQuark'
  | 'tesseractToQuark'
  | 'cubeToQuarkAll'
  | 'hypercubeToQuark'
  | 'seasonPass2'
  | 'seasonPass3'
  | 'seasonPassY'
  | 'seasonPassZ'
  | 'seasonPassLost'
  | 'chronometer'
  | 'chronometer2'
  | 'chronometer3'
  | 'chronometerZ'
  | 'infiniteAscent'
  | 'calculator'
  | 'calculator2'
  | 'calculator3'
  | 'constantEX'
  | 'powderEX'
  | 'powderAuto'
  | 'challenge15Auto'
  | 'extraWarp'
  | 'autoWarp' // And Golden Quarks
  | 'improveQuarkHept'
  | 'improveQuarkHept2'
  | 'improveQuarkHept3'
  | 'improveQuarkHept4'
  | 'shopImprovedDaily'
  | 'shopImprovedDaily2'
  | 'shopImprovedDaily3'
  | 'shopImprovedDaily4'
  | 'calculator4'
  | 'calculator5'
  | 'calculator6'
  | 'calculator7'
  | 'offeringEX3'
  | 'obtainiumEX3'
  | 'improveQuarkHept5'
  | 'seasonPassInfinity'
  | 'chronometerInfinity'
  | 'shopSingularityPenaltyDebuff'
  | 'shopAmbrosiaLuckMultiplier4'
  | 'shopOcteractAmbrosiaLuck'
  | 'shopAmbrosiaGeneration1'
  | 'shopAmbrosiaGeneration2'
  | 'shopAmbrosiaGeneration3'
  | 'shopAmbrosiaGeneration4'
  | 'shopAmbrosiaLuck1'
  | 'shopAmbrosiaLuck2'
  | 'shopAmbrosiaLuck3'
  | 'shopAmbrosiaLuck4'
  | 'shopCashGrabUltra'
  | 'shopAmbrosiaAccelerator'
  | 'shopEXUltra'
  | 'shopChronometerS'
  | 'shopAmbrosiaUltra'
  | 'shopSingularitySpeedup'
  | 'shopSingularityPotency'
  | 'shopSadisticRune'
  | 'shopRedLuck1'
  | 'shopRedLuck2'
  | 'shopRedLuck3'
  | 'shopInfiniteShopUpgrades'
  | 'shopHorseShoe'

export const getShopCosts = (input: ShopUpgradeNames) => {
  if (
    shopData[input].type === shopUpgradeTypes.CONSUMABLE
    || shopData[input].maxLevel === 1
  ) {
    return shopData[input].price
  } else {
    const priceIncreaseMult = player.shopUpgrades[input]
    return (
      shopData[input].price + shopData[input].priceIncrease * priceIncreaseMult
    )
  }
}

export const shopDescriptions = (input: ShopUpgradeNames) => {
  const rofl = DOMCacheGetOrSet('quarkdescription')!
  const lol = DOMCacheGetOrSet('quarkeffect')!
  const refundable = DOMCacheGetOrSet('quarkRefundable')!

  rofl.innerHTML = i18next.t(`shop.upgradeDescriptions.${input}`)

  shopData[input].refundable
    ? (refundable.textContent = i18next.t('shop.refundable', { level: shopData[input].refundMinimumLevel }))
    : (refundable.textContent = i18next.t('shop.cannotRefund'))

  switch (input) {
    case 'offeringPotion':
      lol.innerHTML = i18next.t('shop.upgradeEffects.offeringPotion', {
        amount: format(
          calculatePotionValue(player.prestigecounter, calculateOfferingsDecimal(), calculateBaseOfferings()),
          2,
          true
        ),
        amount2: format(player.shopPotionsConsumed.offering, 0, true),
        amount3: format(calculateOfferingPotionBaseOfferings().amount, 0, true),
        amount4: format(calculateOfferingPotionBaseOfferings().toNext, 0, true)
      })
      break
    case 'obtainiumPotion':
      lol.innerHTML = i18next.t('shop.upgradeEffects.obtainiumPotion', {
        amount: format(
          calculatePotionValue(player.reincarnationcounter, calculateObtainium(), calculateBaseObtainium()),
          2,
          true
        ),
        amount2: format(player.shopPotionsConsumed.obtainium, 0, true),
        amount3: format(calculateObtainiumPotionBaseObtainium().amount, 0, true),
        amount4: format(calculateObtainiumPotionBaseObtainium().toNext, 0, true)
      })
      break
    case 'offeringEX':
      lol.innerHTML = i18next.t('shop.upgradeEffects.offeringEX', {
        amount: format(4 * player.shopUpgrades.offeringEX, 2, true)
      })
      break
    case 'offeringAuto':
      lol.innerHTML = i18next.t('shop.upgradeEffects.offeringAuto', {
        amount1: format(Math.pow(2, player.shopUpgrades.offeringAuto)),
        amount2: format(2 * player.shopUpgrades.offeringAuto, 2)
      })
      break
    case 'obtainiumEX':
      lol.innerHTML = i18next.t('shop.upgradeEffects.obtainiumEX', {
        amount: format(4 * player.shopUpgrades.obtainiumEX, 2, true)
      })
      break
    case 'obtainiumAuto':
      lol.innerHTML = i18next.t('shop.upgradeEffects.obtainiumAuto', {
        amount: format(player.shopUpgrades.obtainiumAuto * 2, 2)
      })
      break
    case 'instantChallenge':
      lol.innerHTML = i18next.t('shop.upgradeEffects.instantChallenge')
      break
    case 'antSpeed':
      lol.innerHTML = i18next.t('shop.upgradeEffects.antSpeed', {
        amount: format(4 * player.shopUpgrades.antSpeed, 0, true)
      })
      break
    case 'cashGrab':
      lol.innerHTML = i18next.t('shop.upgradeEffects.cashGrab', {
        amount: format(player.shopUpgrades.cashGrab, 2)
      })
      break
    case 'shopTalisman':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopTalisman')
      break
    case 'seasonPass':
      lol.innerHTML = i18next.t('shop.upgradeEffects.seasonPass', {
        amount: format(2.25 * player.shopUpgrades.seasonPass)
      })
      break
    case 'challengeExtension':
      lol.innerHTML = i18next.t('shop.upgradeEffects.challengeExtension', {
        amount: format(2 * player.shopUpgrades.challengeExtension)
      })
      break
    case 'challengeTome':
      lol.innerHTML = i18next.t('shop.upgradeEffects.challengeTome', {
        amount1: format(20 * player.shopUpgrades.challengeTome),
        amount2: format(
          1
            - (player.shopUpgrades.challengeTome
                + player.shopUpgrades.challengeTome2)
              / 100,
          2,
          true
        )
      })
      break
    case 'cubeToQuark':
      lol.innerHTML = i18next.t('shop.upgradeEffects.cubeToQuark')
      break
    case 'tesseractToQuark':
      lol.innerHTML = i18next.t('shop.upgradeEffects.tesseractToQuark')
      break
    case 'hypercubeToQuark':
      lol.innerHTML = i18next.t('shop.upgradeEffects.hypercubeToQuark')
      break
    case 'seasonPass2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.seasonPass2', {
        amount: format(1.5 * player.shopUpgrades.seasonPass2)
      })
      break
    case 'seasonPass3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.seasonPass3', {
        amount: format(1.5 * player.shopUpgrades.seasonPass3)
      })
      break
    case 'chronometer':
      lol.innerHTML = i18next.t('shop.upgradeEffects.chronometer', {
        amount: format(1.2 * player.shopUpgrades.chronometer)
      })
      break
    case 'infiniteAscent':
      lol.innerHTML = i18next.t('shop.upgradeEffects.infiniteAscent')
      break
    case 'calculator':
      lol.innerHTML = i18next.t('shop.upgradeEffects.calculator', {
        amount1: format(14 * player.shopUpgrades.calculator),
        bool1: player.shopUpgrades.calculator > 0,
        bool2: player.shopUpgrades.calculator === shopData.calculator.maxLevel
      })
      break
    case 'calculator2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.calculator2', {
        amount1: format(2 * player.shopUpgrades.calculator2),
        amount2: format(
          player.shopUpgrades.calculator2 === shopData.calculator2.maxLevel
            ? 25
            : 0
        )
      })
      break
    case 'calculator3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.calculator3', {
        amount1: format(10 * player.shopUpgrades.calculator3),
        amount2: format(60 * player.shopUpgrades.calculator3)
      })
      break
    case 'calculator4':
      lol.innerHTML = i18next.t('shop.upgradeEffects.calculator4', {
        amount1: format(4 * player.shopUpgrades.calculator4),
        amount2: player.shopUpgrades.calculator4 === 10 ? 32 : 0
      })
      break
    case 'calculator5':
      lol.innerHTML = i18next.t('shop.upgradeEffects.calculator5', {
        amount1: format(6 * player.shopUpgrades.calculator5),
        amount2: Math.floor(player.shopUpgrades.calculator5 / 10)
          + (player.shopUpgrades.calculator4 === shopData.calculator5.maxLevel
            ? 6
            : 0)
      })
      break
    case 'calculator6':
      lol.innerHTML = i18next.t('shop.upgradeEffects.calculator6', {
        amount1: format(player.shopUpgrades.calculator6),
        amount2: player.shopUpgrades.calculator6 === shopData.calculator6.maxLevel
          ? 24
          : 0
      })
      break
    case 'calculator7':
      lol.innerHTML = i18next.t('shop.upgradeEffects.calculator7', {
        amount1: format(player.shopUpgrades.calculator7, 0, true),
        amount2: player.shopUpgrades.calculator7 === shopData.calculator7.maxLevel
          ? 48
          : 0
      })
      break
    case 'constantEX':
      lol.innerHTML = i18next.t('shop.upgradeEffects.constantEX', {
        amount: format(player.shopUpgrades.constantEX, 0, true)
      })
      break
    case 'powderEX':
      lol.innerHTML = i18next.t('shop.upgradeEffects.powderEX', {
        amount: format(2 * player.shopUpgrades.powderEX)
      })
      break
    case 'chronometer2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.chronometer2', {
        amount: format(0.6 * player.shopUpgrades.chronometer2, 1)
      })
      break
    case 'chronometer3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.chronometer3', {
        amount: format(1.5 * player.shopUpgrades.chronometer3, 1)
      })
      break
    case 'seasonPassY':
      lol.innerHTML = i18next.t('shop.upgradeEffects.seasonPassY', {
        amount: format(0.75 * player.shopUpgrades.seasonPassY, 2)
      })
      break
    case 'seasonPassZ':
      lol.innerHTML = i18next.t('shop.upgradeEffects.seasonPassZ', {
        amount: format(
          1 * player.shopUpgrades.seasonPassZ * player.singularityCount,
          0,
          true
        )
      })
      break
    case 'challengeTome2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.challengeTome2', {
        amount1: 20 * player.shopUpgrades.challengeTome2,
        amount2: format(
          1
            - (player.shopUpgrades.challengeTome
                + player.shopUpgrades.challengeTome2)
              / 100,
          2,
          true
        )
      })
      break
    case 'instantChallenge2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.instantChallenge2', {
        amount: format(
          player.shopUpgrades.instantChallenge2 * player.singularityCount,
          0
        )
      })
      break
    case 'cashGrab2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.cashGrab2', {
        amount: format(0.5 * player.shopUpgrades.cashGrab2, 1)
      })
      break
    case 'cubeToQuarkAll':
      lol.innerHTML = i18next.t('shop.upgradeEffects.cubeToQuarkAll', {
        amount: format(0.2 * player.shopUpgrades.cubeToQuarkAll, 2)
      })
      break
    case 'chronometerZ':
      lol.innerHTML = i18next.t('shop.upgradeEffects.chronometerZ', {
        amount: format(
          0.1 * player.singularityCount * player.shopUpgrades.chronometerZ,
          2
        )
      })
      break
    case 'offeringEX2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.offeringEX2', {
        amount: format(
          1 * player.singularityCount * player.shopUpgrades.offeringEX2,
          2
        )
      })
      break
    case 'obtainiumEX2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.obtainiumEX2', {
        amount: format(
          1 * player.singularityCount * player.shopUpgrades.obtainiumEX2,
          2
        )
      })
      break
    case 'powderAuto':
      lol.innerHTML = i18next.t('shop.upgradeEffects.powderAuto', {
        amount: format(
          100
            / (Math.max(1, player.shopUpgrades.powderAuto)
              * calculatePowderConversion()),
          2,
          true
        )
      })
      break
    case 'seasonPassLost':
      lol.innerHTML = i18next.t('shop.upgradeEffects.seasonPassLost', {
        amount: format(0.1 * player.shopUpgrades.seasonPassLost, 2)
      })
      break
    case 'challenge15Auto':
      lol.innerHTML = i18next.t('shop.upgradeEffects.challenge15Auto')
      break
    case 'extraWarp':
      lol.innerHTML = i18next.t('shop.upgradeEffects.extraWarp', {
        amount: player.shopUpgrades.extraWarp
      })
      break
    case 'autoWarp':
      lol.innerHTML = i18next.t('shop.upgradeEffects.autoWarp')
      break
    case 'improveQuarkHept':
      lol.innerHTML = i18next.t('shop.upgradeEffects.improveQuarkHept', {
        amount: format(player.shopUpgrades.improveQuarkHept / 100, 2)
      })
      break
    case 'improveQuarkHept2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.improveQuarkHept2', {
        amount: format(player.shopUpgrades.improveQuarkHept2 / 100, 2)
      })
      break
    case 'improveQuarkHept3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.improveQuarkHept3', {
        amount: format(player.shopUpgrades.improveQuarkHept3 / 100, 2)
      })
      break
    case 'improveQuarkHept4':
      lol.innerHTML = i18next.t('shop.upgradeEffects.improveQuarkHept4', {
        amount: format(player.shopUpgrades.improveQuarkHept4 / 100, 2)
      })
      break
    case 'shopImprovedDaily':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopImprovedDaily', {
        amount: format(5 * player.shopUpgrades.shopImprovedDaily)
      })
      break
    case 'shopImprovedDaily2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopImprovedDaily2', {
        amount1: player.shopUpgrades.shopImprovedDaily2,
        amount2: player.shopUpgrades.shopImprovedDaily2 * 20
      })
      break
    case 'shopImprovedDaily3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopImprovedDaily3', {
        amount1: player.shopUpgrades.shopImprovedDaily3,
        amount2: player.shopUpgrades.shopImprovedDaily3 * 15
      })
      break
    case 'shopImprovedDaily4':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopImprovedDaily4', {
        amount1: player.shopUpgrades.shopImprovedDaily4,
        amount2: player.shopUpgrades.shopImprovedDaily4 * 100
      })
      break
    case 'offeringEX3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.offeringEX3', {
        amount: format(
          100 * (Math.pow(1.012, player.shopUpgrades.offeringEX3 + calculateFreeShopInfinityUpgrades()) - 1),
          2,
          true
        ),
        amount2: format(
          Math.floor((player.shopUpgrades.offeringEX3 + calculateFreeShopInfinityUpgrades()) / 25),
          0,
          true
        )
      })
      break
    case 'obtainiumEX3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.obtainiumEX3', {
        amount: format(
          100 * (Math.pow(1.012, player.shopUpgrades.obtainiumEX3 + calculateFreeShopInfinityUpgrades()) - 1),
          2,
          true
        ),
        amount2: format(
          100
            * (Math.pow(1.06, Math.floor((player.shopUpgrades.obtainiumEX3 + calculateFreeShopInfinityUpgrades()) / 25))
              - 1),
          2,
          true
        )
      })
      break
    case 'improveQuarkHept5':
      lol.innerHTML = i18next.t('shop.upgradeEffects.improveQuarkHept5', {
        amount: format(player.shopUpgrades.improveQuarkHept5 / 100, 2, true)
      })
      break
    case 'seasonPassInfinity':
      lol.innerHTML = i18next.t('shop.upgradeEffects.seasonPassInfinity', {
        amount: format(
          100 * (Math.pow(1.012, player.shopUpgrades.seasonPassInfinity + calculateFreeShopInfinityUpgrades()) - 1),
          2,
          true
        ),
        amount2: format(
          100
            * (Math.pow(1.012, 1.25 * (player.shopUpgrades.seasonPassInfinity + calculateFreeShopInfinityUpgrades()))
              - 1),
          2,
          true
        )
      })
      break
    case 'chronometerInfinity':
      lol.innerHTML = i18next.t('shop.upgradeEffects.chronometerInfinity', {
        amount: format(
          100 * (Math.pow(1.006, player.shopUpgrades.chronometerInfinity + calculateFreeShopInfinityUpgrades()) - 1),
          3,
          true
        ),
        amount2: format(
          0.001 * Math.floor((player.shopUpgrades.chronometerInfinity + calculateFreeShopInfinityUpgrades()) / 40),
          3,
          true
        )
      })
      break
    case 'shopSingularityPenaltyDebuff':
      lol.innerHTML = i18next.t(
        'shop.upgradeEffects.shopSingularityPenaltyDebuff',
        {
          amount1: format(player.singularityCount),
          amount2: format(
            player.singularityCount
              - player.shopUpgrades.shopSingularityPenaltyDebuff
          )
        }
      )
      break
    case 'shopAmbrosiaLuckMultiplier4':
      lol.innerHTML = i18next.t(
        'shop.upgradeEffects.shopAmbrosiaLuckMultiplier4',
        {
          amount: format(player.shopUpgrades.shopAmbrosiaLuckMultiplier4)
        }
      )
      break
    case 'shopOcteractAmbrosiaLuck':
      lol.innerHTML = i18next.t(
        'shop.upgradeEffects.shopOcteractAmbrosiaLuck',
        {
          amount: format(
            player.shopUpgrades.shopOcteractAmbrosiaLuck
              * (1 + Math.floor(Math.log10(player.totalWowOcteracts + 1)))
          )
        }
      )
      break
    case 'shopAmbrosiaGeneration1':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration1', {
        amount: format(player.shopUpgrades.shopAmbrosiaGeneration1)
      })
      break
    case 'shopAmbrosiaGeneration2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration2', {
        amount: format(player.shopUpgrades.shopAmbrosiaGeneration2)
      })
      break
    case 'shopAmbrosiaGeneration3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration3', {
        amount: format(player.shopUpgrades.shopAmbrosiaGeneration3)
      })
      break
    case 'shopAmbrosiaGeneration4':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaGeneration4', {
        amount: format(
          player.shopUpgrades.shopAmbrosiaGeneration4 / 10,
          1,
          true
        )
      })
      break
    case 'shopRedLuck1':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopRedLuck1', {
        amount: format(0.05 * player.shopUpgrades.shopRedLuck1, 2, true),
        amount2: format(0.01 * Math.floor(player.shopUpgrades.shopRedLuck1 / 20), 2, true)
      })
      break
    case 'shopRedLuck2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopRedLuck2', {
        amount: format(0.075 * player.shopUpgrades.shopRedLuck2, 2, true),
        amount2: format(0.01 * Math.floor(player.shopUpgrades.shopRedLuck2 / 20), 2, true)
      })
      break
    case 'shopRedLuck3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopRedLuck3', {
        amount: format(0.1 * player.shopUpgrades.shopRedLuck3, 1, true),
        amount2: format(0.01 * Math.floor(player.shopUpgrades.shopRedLuck3 / 20), 2, true)
      })
      break
    case 'shopAmbrosiaLuck1':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaLuck1', {
        amount: format(2 * player.shopUpgrades.shopAmbrosiaLuck1)
      })
      break
    case 'shopAmbrosiaLuck2':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaLuck2', {
        amount: format(2 * player.shopUpgrades.shopAmbrosiaLuck2)
      })
      break
    case 'shopAmbrosiaLuck3':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaLuck3', {
        amount: format(2 * player.shopUpgrades.shopAmbrosiaLuck3)
      })
      break
    case 'shopAmbrosiaLuck4':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaLuck4', {
        amount: format(
          (6 * player.shopUpgrades.shopAmbrosiaLuck4) / 10,
          1,
          true
        )
      })
      break
    case 'shopCashGrabUltra':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopCashGrabUltra', {
        amount: format(100 * (calculateCashGrabBlueberryBonus() - 1), 2, true),
        amount2: format(100 * (calculateCashGrabCubeBonus() - 1), 2, true),
        amount3: format(100 * (calculateCashGrabQuarkBonus() - 1), 2, true)
      })
      break
    case 'shopAmbrosiaAccelerator':
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaAccelerator', {
        amount: format(0.4 * player.shopUpgrades.shopAmbrosiaAccelerator, 1, true),
        total: format(
          0.4 * player.shopUpgrades.shopAmbrosiaAccelerator
            * player.singularityChallenges.noAmbrosiaUpgrades.completions,
          1,
          true
        )
      })
      break
    case 'shopEXUltra':
      {
        const capacity = 125000 * player.shopUpgrades.shopEXUltra
        lol.innerHTML = i18next.t('shop.upgradeEffects.shopEXUltra', {
          amount: format(0.1 * Math.floor(Math.min(capacity, player.lifetimeAmbrosia) / 1000), 1, true)
        })
      }
      break
    case 'shopChronometerS':
      {
        const singularity = player.singularityCount
        const obtained = player.shopUpgrades.shopChronometerS > 0
        lol.innerHTML = i18next.t('shop.upgradeEffects.shopChronometerS', {
          amount: format(Math.max(0, 100 * (Math.pow(1.01, (singularity - 200) * +obtained) - 1)), 2, true)
        })
      }
      break
    case 'shopAmbrosiaUltra':
      {
        const exaltCompletions = sumOfExaltCompletions()
        lol.innerHTML = i18next.t('shop.upgradeEffects.shopAmbrosiaUltra', {
          amount: format(player.shopUpgrades.shopAmbrosiaUltra * exaltCompletions, 0, true)
        })
      }
      break
    case 'shopSingularitySpeedup': {
      const obtained = player.shopUpgrades.shopSingularitySpeedup > 0
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopSingularitySpeedup', {
        amount: obtained ? 50 : 1
      })
      break
    }
    case 'shopSingularityPotency':
      {
        const obtained = player.shopUpgrades.shopSingularityPotency > 0
        lol.innerHTML = i18next.t('shop.upgradeEffects.shopSingularityPotency', {
          amount: obtained ? 3.66 : 1
        })
      }
      break
    case 'shopSadisticRune': {
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopSadisticRune')
      break
    }
    case 'shopInfiniteShopUpgrades': {
      const exaltCompletions = sumOfExaltCompletions()
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopInfiniteShopUpgrades', {
        amount: format(Math.floor(player.shopUpgrades.shopInfiniteShopUpgrades * 0.005 * exaltCompletions), 0, true)
      })
      break
    }
    case 'shopHorseShoe': {
      const horseShoeLevel = getRuneEffectiveLevel('horseShoe')
      lol.innerHTML = i18next.t('shop.upgradeEffects.shopHorseShoe', {
        amount1: player.shopUpgrades.shopHorseShoe > 0 ? 3 : 0,
        amount2: formatAsPercentIncrease(
          1 - Math.min(300, horseShoeLevel * player.shopUpgrades.shopHorseShoe) / 1000,
          2
        )
      })
    }
  }
}

// strentax 07/21 Add function to convert code-name display to end-user friendly display of shop upgrades
export const friendlyShopName = (input: ShopUpgradeNames) => {
  // TODO(i18n): add these under shop.names
  const names: Record<ShopUpgradeNames, string> = {
    offeringPotion: 'Offering Potion',
    obtainiumPotion: 'Obtainium Potion',
    offeringEX: 'Offering EX',
    offeringAuto: 'Offering Auto',
    obtainiumEX: 'Obtainium EX',
    obtainiumAuto: 'Obtainium Auto',
    instantChallenge: 'Instant Challenge Completions',
    antSpeed: 'Ant Speed',
    cashGrab: 'Cash Grab',
    shopTalisman: 'the Plastic talisman',
    seasonPass: 'Season Pass',
    challengeExtension: 'Reincarnation Challenge EX',
    challengeTome: 'Challenge 10 Requirement Reduce',
    cubeToQuark: 'Cube Quarks +50%',
    tesseractToQuark: 'Tesseract Quarks +50%',
    hypercubeToQuark: 'Hypercube Quarks +50%',
    seasonPass2: 'Season Pass 2',
    seasonPass3: 'Season Pass 3',
    chronometer: 'Chronometer 1',
    infiniteAscent: 'Infinite Ascent',
    calculator: 'PL-AT calculator',
    calculator2: 'PL-AT X calculator',
    calculator3: 'PL-AT Ω calculator',
    calculator4: 'PL-AT δ calculator',
    calculator5: 'PL-AT Γ calculator',
    calculator6: 'QUAAA-T calculator',
    calculator7: 'PL-AT ΩΩ calculator',
    constantEX: 'Constant EX',
    powderEX: 'Powder EX',
    chronometer2: 'Chronometer 2',
    chronometer3: 'Chronometer 3',
    seasonPassY: 'Season Pass Y',
    seasonPassZ: 'Season Pass Z',
    challengeTome2: 'Challenge 10 Requirement Reduction 2',
    instantChallenge2: 'Instant Challenge Completions 2',
    cubeToQuarkAll: 'Quark Gain Cube Improvement 2',
    cashGrab2: 'Cash Grab 2',
    chronometerZ: 'Chronometer Z',
    obtainiumEX2: 'Obtainium EX 2',
    offeringEX2: 'Offering EX 2',
    powderAuto: 'Automated Powder',
    seasonPassLost: 'Season Pass LOST',
    challenge15Auto: 'Challenge 15 Automation',
    extraWarp: 'Extra Warp',
    autoWarp: 'a quack powered Warps?',
    improveQuarkHept: 'Quark Hepteract 1',
    improveQuarkHept2: 'Quark Hepteract 2',
    improveQuarkHept3: 'Quark Hepteract 3',
    improveQuarkHept4: 'Quack Hepteract 4',
    shopImprovedDaily: 'Improved Daily Code 1',
    shopImprovedDaily2: 'Improved Daily Code 2',
    shopImprovedDaily3: 'Improved Daily Code 3',
    shopImprovedDaily4: 'Improved Daily Code 4',
    offeringEX3: 'The final Offering Upgrade',
    obtainiumEX3: 'The final Obtainium Upgrade',
    improveQuarkHept5: 'The final Quark Hepteract Improver',
    chronometerInfinity: 'The final Chronometer',
    seasonPassInfinity: 'The final Season pass',
    shopSingularityPenaltyDebuff: 'A Singularity Tenderizer',
    shopAmbrosiaLuckMultiplier4: 'The Fourth Multiplicative Ambrosia Luck Multiplier',
    shopOcteractAmbrosiaLuck: 'Octeract-Based Ambrosia Luck Amplifier',
    shopAmbrosiaGeneration1: 'Ambrosia Generation Speedup',
    shopAmbrosiaGeneration2: 'Another Ambrosia Generation Speedup',
    shopAmbrosiaGeneration3: 'A better Ambrosia Generation Speedup',
    shopAmbrosiaGeneration4: 'A FINAL Ambrosia Generation Speedup',
    shopAmbrosiaLuck1: 'Ambrosia Luck Increaser',
    shopAmbrosiaLuck2: 'Another Ambrosia Luck Increaser',
    shopAmbrosiaLuck3: 'A better Ambrosia Luck Increaser',
    shopAmbrosiaLuck4: 'A FINAL Ambrosia Luck Increaser',
    shopRedLuck1: 'Low Class Dice of Asmodeus',
    shopRedLuck2: 'Dice of Asmodeus',
    shopRedLuck3: 'High Class Dice of Asmodeus',
    shopCashGrabUltra: 'It\'s the FINAL CASHGRAB!',
    shopAmbrosiaAccelerator: 'An Ambrosial Accelerator!',
    shopEXUltra: 'It\'s the FINAL E X!',
    shopChronometerS: 'The FINAL Chronometer',
    shopAmbrosiaUltra: 'The FINAL Ambrosia Exaltation... I don\'t flippin know!',
    shopSingularitySpeedup: 'Singularity Timed-Perks Speedup',
    shopSingularityPotency: 'Singularity Passives Potency',
    shopSadisticRune: 'Sadistic Rune Unlock! Or does it?',
    shopInfiniteShopUpgrades: 'Blue Infinity Shop Voucher',
    shopHorseShoe: 'A Horse Shoe Singularity Debuff'
  }

  return names[input]
}

export const buyShopUpgrades = async (input: ShopUpgradeNames) => {
  const shopItem = shopData[input]

  if (player.shopUpgrades[input] >= shopItem.maxLevel) {
    return player.shopConfirmationToggle
      ? Alert(
        `You can't purchase ${
          friendlyShopName(
            input
          )
        } because you are already at the maximum ${shopItem.type === shopUpgradeTypes.UPGRADE ? 'level' : 'capacity'}!`
      )
      : null
  } else if (Number(player.worlds) < getShopCosts(input)) {
    return player.shopConfirmationToggle
      ? Alert(
        `You can't purchase ${
          friendlyShopName(
            input
          )
        } because you don't have enough Quarks!`
      )
      : null
  }

  // Actually lock for HTML exploit
  if (!isShopUpgradeUnlocked(input)) {
    return Alert(
      `You do not have the right to purchase ${friendlyShopName(input)}!`
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
      `You can afford to purchase up to ${merch} of ${
        friendlyShopName(
          input
        )
      } for ${buyCost.toLocaleString()} Quarks. How many would you like to buy?${maxPots + noRefunds}`
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
        shopData[other].price,
        toSpend,
        shopData[other].priceIncrease / shopData[other].price,
        shopData[other].maxLevel - player.shopUpgrades[other]
      )
      player.worlds.sub(otherPot.cost)
      player.shopUpgrades[other] = otherPot.levelCanBuy
      shopDescriptions(other)
      buyAny = buyAmount
    } else {
      buyAny = Math.floor(Number(buyInput))
      if (buyAny === 0) {
        return
      } else if (
        Number.isNaN(buyAny)
        || !Number.isFinite(buyAny)
        || buyAny < 0
      ) {
        return Alert('Amount must be a finite, positive integer.')
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
      `You are about to ${singular ? 'unlock' : `purchase ${merch} of`} ${
        friendlyShopName(
          input
        )
      } for ${buyCost.toLocaleString()} Quarks. Press 'OK' to finalize purchase.${maxPots + noRefunds}`
    )
  }
  if (p) {
    player.worlds.sub(buyCost)
    player.shopUpgrades[input] += buyAmount
    shopDescriptions(input)
    revealStuff()
  }
}

export const autoBuyConsumable = (input: ShopUpgradeNames) => {
  const maxBuyablePotions = Math.floor(
    Math.min(
      Number(player.worlds) / 100,
      Math.min(
        shopData[input].maxLevel - player.shopUpgrades[input],
        Math.pow(player.highestSingularityCount, 2) * 100
      )
    )
  )

  if (shopData[input].maxLevel <= player.shopUpgrades[input]) {
    return
  }
  if (maxBuyablePotions <= 0) {
    return
  }

  player.worlds.sub(100 * maxBuyablePotions)
  player.shopUpgrades[input] += maxBuyablePotions
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
    ? await Confirm(
      'This will fully refund most of your permanent upgrades for an upfront cost of 15 Quarks. Would you like to do this?'
    )
    : true

  if (p) {
    return forceResetShopUpgrades()
  }
}

export const forceResetShopUpgrades = () => {
  const singularityQuarks = player.quarksThisSingularity
  let refunds = false
  for (const shopItem in shopData) {
    const key = shopItem as keyof typeof shopData
    const item = shopData[key]
    if (
      item.refundable
      && player.shopUpgrades[key] > item.refundMinimumLevel
    ) {
      refunds = true
      // Determines how many quarks one would not be refunded, based on minimum refund level
      const doNotRefund = item.price * item.refundMinimumLevel
        + (item.priceIncrease
            * item.refundMinimumLevel
            * (item.refundMinimumLevel - 1))
          / 2

      // Refunds Quarks based on the shop level and price vals
      player.worlds.add(
        item.price * player.shopUpgrades[key]
          + (item.priceIncrease
              * player.shopUpgrades[key]
              * (player.shopUpgrades[key] - 1))
            / 2
          - doNotRefund,
        false
      )

      player.shopUpgrades[key] = item.refundMinimumLevel
    }
  }
  if (refunds) {
    player.worlds.sub(15)
  } else if (player.shopConfirmationToggle) {
    void Alert('Nothing to Refund!')
  }
  player.quarksThisSingularity = singularityQuarks
}

export const getQuarkInvestment = (upgrade: ShopUpgradeNames) => {
  if (!(upgrade in shopData) || !(upgrade in player.shopUpgrades)) {
    return 0
  }

  const val = shopData[upgrade].price * player.shopUpgrades[upgrade]
    + (shopData[upgrade].priceIncrease
        * (player.shopUpgrades[upgrade] - 1)
        * player.shopUpgrades[upgrade])
      / 2

  return val
}

export const isShopUpgradeUnlocked = (upgrade: ShopUpgradeNames): boolean => {
  switch (upgrade) {
    case 'offeringPotion':
      return true
    case 'obtainiumPotion':
      return true
    case 'offeringEX':
      return (
        player.reincarnationCount > 0 || player.highestSingularityCount > 0
      )
    case 'offeringAuto':
      return (
        player.reincarnationCount > 0 || player.highestSingularityCount > 0
      )
    case 'obtainiumEX':
      return (
        player.reincarnationCount > 0 || player.highestSingularityCount > 0
      )
    case 'obtainiumAuto':
      return (
        player.reincarnationCount > 0 || player.highestSingularityCount > 0
      )
    case 'instantChallenge':
      return (
        player.reincarnationCount > 0 || player.highestSingularityCount > 0
      )
    case 'antSpeed':
      return (
        player.highestchallengecompletions[10] > 0
        || player.ascensionCount > 0
        || player.highestSingularityCount > 0
      )
    case 'cashGrab':
      return (
        player.highestchallengecompletions[8] > 0
        || player.ascensionCount > 0
        || player.highestSingularityCount > 0
      )
    case 'shopTalisman':
      return (
        player.highestchallengecompletions[9] > 0
        || player.ascensionCount > 0
        || player.highestSingularityCount > 0
      )
    case 'seasonPass':
      return player.ascensionCount > 0 || player.highestSingularityCount > 0
    case 'challengeExtension':
      return player.ascensionCount > 0 || player.highestSingularityCount > 0
    case 'challengeTome':
      return player.ascensionCount > 0 || player.highestSingularityCount > 0
    case 'cubeToQuark':
      return player.ascensionCount > 0 || player.highestSingularityCount > 0
    case 'tesseractToQuark':
      return (
        player.highestchallengecompletions[11] > 0
        || player.highestSingularityCount > 0
      )
    case 'hypercubeToQuark':
      return (
        player.highestchallengecompletions[13] > 0
        || player.highestSingularityCount > 0
      )
    case 'seasonPass2':
      return (
        player.highestchallengecompletions[14] > 0
        || player.highestSingularityCount > 0
      )
    case 'seasonPass3':
      return (
        player.highestchallengecompletions[14] > 0
        || player.highestSingularityCount > 0
      )
    case 'chronometer':
      return (
        player.highestchallengecompletions[12] > 0
        || player.highestSingularityCount > 0
      )
    case 'infiniteAscent':
      return (
        player.highestchallengecompletions[14] > 0
        || player.highestSingularityCount > 0
      )
    case 'calculator':
      return player.ascensionCount > 0 || player.highestSingularityCount > 0
    case 'calculator2':
      return (
        player.highestchallengecompletions[11] > 0
        || player.highestSingularityCount > 0
      )
    case 'calculator3':
      return (
        player.highestchallengecompletions[13] > 0
        || player.highestSingularityCount > 0
      )
    case 'calculator4':
      return Boolean(getGQUpgradeEffect('wowPass'))
    case 'calculator5':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'calculator6':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'calculator7':
      return Boolean(
        player.singularityChallenges.limitedAscensions.rewards.shopUpgrade
      )
    case 'constantEX':
      return (
        player.highestchallengecompletions[14] > 0
        || player.highestSingularityCount > 0
      )
    case 'powderEX':
      return (
        player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
        || player.highestSingularityCount > 0
      )
    case 'chronometer2':
      return (
        player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
        || player.highestSingularityCount > 0
      )
    case 'chronometer3':
      return Boolean(getGQUpgradeEffect('wowPass'))
    case 'seasonPassY':
      return (
        player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
        || player.highestSingularityCount > 0
      )
    case 'seasonPassZ':
      return Boolean(getGQUpgradeEffect('wowPass'))
    case 'challengeTome2':
      return Boolean(getGQUpgradeEffect('wowPass'))
    case 'instantChallenge2':
      return Boolean(getGQUpgradeEffect('wowPass'))
    case 'cashGrab2':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'cubeToQuarkAll':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'chronometerZ':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'offeringEX2':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'obtainiumEX2':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'powderAuto':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'seasonPassLost':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'challenge15Auto':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'extraWarp':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'autoWarp':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'improveQuarkHept':
      return (
        player.challenge15Exponent >= G.challenge15Rewards.hepteractsUnlocked.requirement
        || player.highestSingularityCount > 0
      )
    case 'improveQuarkHept2':
      return Boolean(getGQUpgradeEffect('wowPass'))
    case 'improveQuarkHept3':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'improveQuarkHept4':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'shopImprovedDaily':
      return (
        player.highestchallengecompletions[14] > 0
        || player.highestSingularityCount > 0
      )
    case 'shopImprovedDaily2':
      return Boolean(getGQUpgradeEffect('wowPass'))
    case 'shopImprovedDaily3':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'shopImprovedDaily4':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'offeringEX3':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'obtainiumEX3':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'improveQuarkHept5':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'chronometerInfinity':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'seasonPassInfinity':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopSingularityPenaltyDebuff':
      return Boolean(
        player.singularityChallenges.noSingularityUpgrades.rewards.shopUpgrade
      )
    case 'shopAmbrosiaLuckMultiplier4':
      return Boolean(
        player.singularityChallenges.oneChallengeCap.rewards.shopUpgrade
      )
    case 'shopOcteractAmbrosiaLuck':
      return Boolean(
        player.singularityChallenges.noOcteracts.rewards.shopUpgrade
      )
    case 'shopAmbrosiaGeneration1':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'shopAmbrosiaGeneration2':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'shopAmbrosiaGeneration3':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopAmbrosiaGeneration4':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopAmbrosiaLuck1':
      return Boolean(getGQUpgradeEffect('wowPass2'))
    case 'shopAmbrosiaLuck2':
      return Boolean(getGQUpgradeEffect('wowPass3'))
    case 'shopAmbrosiaLuck3':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopAmbrosiaLuck4':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopRedLuck1':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopRedLuck2':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopRedLuck3':
      return Boolean(getGQUpgradeEffect('wowPass4'))
    case 'shopCashGrabUltra':
      return Boolean(player.singularityChallenges.noSingularityUpgrades.rewards.shopUpgrade2)
    case 'shopAmbrosiaAccelerator':
      return Boolean(player.singularityChallenges.noAmbrosiaUpgrades.rewards.shopUpgrade)
    case 'shopEXUltra':
      return Boolean(player.singularityChallenges.noAmbrosiaUpgrades.rewards.shopUpgrade2)
    case 'shopChronometerS':
      return Boolean(player.singularityChallenges.limitedTime.rewards.tier1Upgrade)
    case 'shopAmbrosiaUltra':
      return Boolean(player.singularityChallenges.limitedTime.rewards.tier2Upgrade)
    case 'shopSingularitySpeedup':
      return Boolean(player.singularityChallenges.sadisticPrequel.rewards.shopUpgrade)
    case 'shopSingularityPotency':
      return Boolean(player.singularityChallenges.sadisticPrequel.rewards.shopUpgrade2)
    case 'shopSadisticRune':
      return Boolean(player.singularityChallenges.sadisticPrequel.rewards.shopUpgrade3)
    case 'shopInfiniteShopUpgrades':
      return Boolean(player.singularityChallenges.limitedAscensions.rewards.shopUpgrade0)
    case 'shopHorseShoe':
      return Boolean(player.singularityChallenges.taxmanLastStand.rewards.shopUpgrade)
  }
}
