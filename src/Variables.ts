import Decimal from 'break_infinity.js'
import { calculateSigmoid } from './Calculate'
import { Tabs } from './Tabs'
import type { GlobalVariables } from './types/Synergism'

export enum Upgrade {
  coin = 'coins',
  prestige = 'prestigePoints',
  transcend = 'transcendPoints',
  reincarnation = 'reincarnationPoints'
}

export const Globals: GlobalVariables = {
  runediv: [1.5, 2, 3, 5, 8, 1, 1],
  runeexpbase: [1, 4, 9, 16, 1000, 1e75, 1e256],
  runeMaxLvl: 40000,

  // this shows the logarithm of costs. ex: upgrade one will cost 1e+6 coins, upgrade 2 1e+7, etc.
  // dprint-ignore
  upgradeCosts: [
    0, 6, 7, 8, 10, 12, 20, 35, 50, 75, 100, 55, 75, 125, 150, 200, 250, 500, 750, 1000, 1500,
    5, 15, 25, 40, 60, 45, 75, 100, 125, 150, 150, 400, 800, 1600, 3200, 10000, 20000, 50000, 100000, 200000,
    1, 2, 3, 5, 6, 7, 42, 65, 87, 150, 300, 500, 1000, 1500, 2000, 3000, 6000, 12000, 25000, 75000,
    0, 1, 2, 2, 3, 5, 6, 10, 15, 22, 30, 37, 45, 52, 60, 1900, 2500, 3000, 10000, 21397,
    3, 6, 9, 12, 15, 60, 90, 6, 8, 8, 10, 13, 60, 1, 2, 4, 8, 16, 25, 40,
    12, 16, 20, 30, 50, 500, 1250, 5000, 25000, 125000, 1500, 7500, 30000, 150000, 1000000, 250, 1000, 5000, 25000, 125000,
    1e3, 1e6, 1e9, 1e12, 1e15
  ],

  // Mega list of Variables to be used elsewhere
  crystalUpgradesCost: [6, 15, 20, 40, 100, 200, 500, 1000],
  crystalUpgradeCostIncrement: [8, 15, 20, 40, 100, 200, 500, 1000],

  ticker: 0,

  costDivisor: 1,

  freeAccelerator: 0,
  totalAccelerator: 0,
  freeAcceleratorBoost: 0,
  totalAcceleratorBoost: 0,
  acceleratorPower: 1.10,
  acceleratorEffect: new Decimal(1),
  acceleratorEffectDisplay: new Decimal(1),
  generatorPower: new Decimal(1),

  freeMultiplier: 0,
  totalMultiplier: 0,
  multiplierPower: 2,
  multiplierEffect: new Decimal(1),
  challengeOneLog: 3,
  totalMultiplierBoost: 0,

  globalCoinMultiplier: new Decimal(1),

  coinOneMulti: new Decimal(1),
  coinTwoMulti: new Decimal(1),
  coinThreeMulti: new Decimal(1),
  coinFourMulti: new Decimal(1),
  coinFiveMulti: new Decimal(1),

  globalCrystalMultiplier: new Decimal(1),
  globalMythosMultiplier: new Decimal(0.01),
  grandmasterMultiplier: new Decimal(1),

  atomsMultiplier: new Decimal(1),

  mythosBuildingPower: 1,
  challengeThreeMultiplier: new Decimal(1),
  totalMythosOwned: 0,

  prestigePointGain: new Decimal(0),
  challengeFivePower: 1 / 3,

  transcendPointGain: new Decimal(0),
  reincarnationPointGain: new Decimal(0),

  produceFirst: new Decimal(0),
  produceSecond: new Decimal(0),
  produceThird: new Decimal(0),
  produceFourth: new Decimal(0),
  produceFifth: new Decimal(0),
  produceTotal: new Decimal(0),

  produceFirstDiamonds: new Decimal(0),
  produceSecondDiamonds: new Decimal(0),
  produceThirdDiamonds: new Decimal(0),
  produceFourthDiamonds: new Decimal(0),
  produceFifthDiamonds: new Decimal(0),
  produceDiamonds: new Decimal(0),

  produceFirstMythos: new Decimal(0),
  produceSecondMythos: new Decimal(0),
  produceThirdMythos: new Decimal(0),
  produceFourthMythos: new Decimal(0),
  produceFifthMythos: new Decimal(0),
  produceMythos: new Decimal(0),

  produceFirstParticles: new Decimal(0),
  produceSecondParticles: new Decimal(0),
  produceThirdParticles: new Decimal(0),
  produceFourthParticles: new Decimal(0),
  produceFifthParticles: new Decimal(0),
  produceParticles: new Decimal(0),

  producePerSecond: new Decimal(0),
  producePerSecondDiamonds: new Decimal(0),
  producePerSecondMythos: new Decimal(0),
  producePerSecondParticles: new Decimal(0),

  uFourteenMulti: new Decimal(1),
  uFifteenMulti: new Decimal(1),
  tuSevenMulti: 1,
  currentTab: Tabs.Buildings,

  // dprint-ignore
  ordinals: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'] as const,
  // dprint-ignore
  cardinals: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twentyone', 'twentytwo', 'twentythree', 'twentyfour', 'twentyfive', 'twentysix', 'twentyseven', 'twentyeight', 'twentynine', 'thirty', 'thirtyone', 'thirtytwo', 'thirtythree', 'thirtyfour'],

  challengeBaseRequirements: [10, 20, 60, 100, 200, 125, 500, 7500, 2.0e8, 2.5e9],

  prestigeamount: 1,
  taxdivisor: new Decimal('1'),
  taxdivisorcheck: new Decimal('1'),
  runemultiplierincrease: {
    one: 1,
    two: 1,
    three: 1,
    four: 1,
    five: 1
  },

  mythosupgrade13: new Decimal('1'),
  mythosupgrade14: new Decimal('1'),
  mythosupgrade15: new Decimal('1'),
  challengefocus: 0,

  maxexponent: 10000,

  antMultiplier: new Decimal('1'),

  settingscreen: 'settings',

  talismanResourceObtainiumCosts: [1e13, 1e14, 1e16, 1e18, 1e20, 1e22, 1e24],
  talismanResourceOfferingCosts: [100, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9],

  talismanLevelCostMultiplier: [1, 4, 1e4, 1e8, 1e13, 10, 100],

  talismanPositiveModifier: [null, 0.75, 1.5, 2.25, 3, 3.75, 4.5],
  talismanNegativeModifier: [null, 0, 0, 0, 0, 0, 0],

  commonTalismanEnhanceCost: [null, 0, 3000, 1000, 0, 0, 0, 0],
  uncommonTalismanEnchanceCost: [null, 0, 10000, 3000, 1000, 0, 0, 0],
  rareTalismanEnchanceCost: [null, 0, 100000, 20000, 2000, 500, 0, 0],
  epicTalismanEnhanceCost: [null, 0, 2e6, 2e5, 2e4, 2000, 1000, 0],
  legendaryTalismanEnchanceCost: [null, 0, 4e7, 2e6, 1e5, 20000, 2500, 200],
  mythicalTalismanEnchanceCost: [null, 0, 0, 0, 0, 0, 0, 0],

  talismanRespec: 1,

  obtainiumGain: 0,

  mirrorTalismanStats: [null, 1, 1, 1, 1, 1],

  timeWarp: false,

  triggerChallenge: 0,

  prevReductionValue: -1,

  buildingSubTab: 'coin',
  // 1,000 of each before Diminishing Returns

  autoOfferingCounter: 0,

  viscosityPower: [1, 0.87, 0.80, 0.75, 0.70, 0.6, 0.54, 0.45, 0.39, 0.33, 0.3, 0.2, 0.1, 0.05, 0, 0, 0],
  dilationMultiplier: [
    1,
    1 / 3,
    1 / 10,
    1 / 40,
    1 / 200,
    1 / 3e4,
    1 / 3e6,
    1 / 3e9,
    1 / 3e12,
    1 / 1e15,
    1 / 1e19,
    1 / 1e24,
    1 / 1e34,
    1 / 1e48,
    1 / 1e65,
    1 / 1e80,
    1 / 1e100
  ],
  hyperchallengeMultiplier: [1, 1.2, 1.5, 1.7, 3, 5, 8, 13, 21, 34, 55, 100, 400, 1600, 7777, 18888, 88888],
  illiteracyPower: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.20, 0.15, 0.10, 0.08, 0.06, 0.04],
  deflationMultiplier: [
    1,
    0.3,
    0.1,
    0.03,
    0.01,
    1 / 1e6,
    1 / 1e8,
    1 / 1e10,
    1 / 1e12,
    1 / 1e15,
    1 / 1e18,
    1 / 1e25,
    1 / 1e35,
    1 / 1e50,
    1 / 1e77,
    0,
    0
  ],
  // extinctionMultiplier: [1, 0.92, 0.86, 0.8, 0.74, 0.65, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.1, 0, 0, 0, 0],
  extinctionDivisor: [1, 1.25, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  droughtSalvage: [
    0,
    -25,
    -50,
    -75,
    -100,
    -200,
    -300,
    -400,
    -600,
    -800,
    -1_000,
    -1_250,
    -2_000,
    -4_000,
    -8_000,
    -12_000,
    -16_000
  ],
  /*
  droughtMultiplier: [
    1,
    1 / 5,
    1 / 25,
    1 / 200,
    1 / 1e4,
    1 / 1e7,
    1 / 1e11,
    1 / 1e16,
    1 / 1e22,
    1 / 1e30,
    1 / 1e40,
    1 / 1e55,
    1 / 1e80,
    1 / 1e120,
    1 / 1e177,
    1 / 1e200,
    1 / 1e250
  ],*/

  recessionPower: [
    1,
    0.9,
    0.7,
    0.6,
    0.5,
    0.37,
    0.30,
    0.23,
    0.18,
    0.15,
    0.12,
    0.09,
    0.03,
    0.01,
    0.007,
    0.0007,
    0.00007
  ],

  corruptionPointMultipliers: [1, 3, 4, 5, 6, 7, 7.75, 8.5, 9.25, 10, 10.75, 11.5, 12.25, 13, 16, 20, 25, 33, 35],
  ascendBuildingProduction: {
    first: new Decimal('0'),
    second: new Decimal('0'),
    third: new Decimal('0'),
    fourth: new Decimal('0'),
    fifth: new Decimal('0')
  },
  freeUpgradeAccelerator: 0,
  freeUpgradeMultiplier: 0,

  acceleratorMultiplier: 1,
  multiplierMultiplier: 1,

  constUpgradeCosts: [null, 1, 13, 17, 237, 316, 4216, 5623, 74989, 1e10, 1e24],

  globalConstantMult: new Decimal('1'),
  autoTalismanTimer: 0,

  autoChallengeTimerIncrement: 0,
  corruptionTrigger: 'illiteracy',

  c15RewardFormulae: {
    cube1: (e: number) => 1 + ((1 / 50) * Math.log2(e / 175)),
    ascensions: (e: number) => 1 + ((1 / 20) * Math.log2(e / 375)),
    coinExponent: (e: number) => 1 + ((1 / 150) * Math.log2(e / 750)),
    taxes: (e: number) => Math.pow(0.98, Math.log(e / 1.25e3) / Math.log(2)),
    obtainium: (e: number) => 1 + (1 / 4) * Math.pow(e / 7.5e3, 0.6),
    offering: (e: number) => 1 + (1 / 4) * Math.pow(e / 7.5e3, 0.8),
    accelerator: (e: number) => 1 + ((1 / 20) * Math.log(e / 2.5e3)) / Math.log(2),
    multiplier: (e: number) => 1 + ((1 / 20) * Math.log(e / 2.5e3)) / Math.log(2),
    runeExp: (e: number) => 1 + Math.pow(e / 2e4, 1.5),
    runeBonus: (e: number) => 1 + ((1 / 33) * Math.log(e / 1e4)) / Math.log(2),
    cube2: (e: number) => 1 + ((1 / 100) * Math.log(e / 1.5e4)) / Math.log(2),
    transcendChallengeReduction: (e: number) => Math.pow(0.98, Math.log(e / 2.5e4) / Math.log(2)),
    reincarnationChallengeReduction: (e: number) => Math.pow(0.98, Math.log(e / 2.5e4) / Math.log(2)),
    antSpeed: (e: number) => Math.pow(1 + Math.log(e / 2e5) / Math.log(2), 4),
    bonusAntLevel: (e: number) => 1 + ((1 / 20) * Math.log(e / 1.5e5)) / Math.log(2),
    achievementUnlock: (e: number) => e >= 666666 ? 1 : 0,
    cube3: (e: number) => 1 + ((1 / 150) * Math.log(e / 2.5e5)) / Math.log(2),
    talismanBonus: (e: number) => (e >= 7.5e5) ? 1 + 0.02 + ((1 / 1000) * Math.log(e / 7.5e5)) / Math.log(2) : 1,
    globalSpeed: (e: number) => 1 + ((1 / 20) * Math.log(e / 2.5e6)) / Math.log(2),
    blessingBonus: (e: number) => 1 + (1 / 5) * Math.pow(e / 3e7, 1 / 4),
    constantBonus: (e: number) => 1 + (1 / 5) * Math.pow(e / 1e8, 2 / 3),
    cube4: (e: number) => 1 + ((1 / 200) * Math.log(e / 1.25e8)) / Math.log(2),
    spiritBonus: (e: number) => 1 + (1 / 5) * Math.pow(e / 2e9, 1 / 4),
    score: (e: number) =>
      (e >= 1e20)
        ? 1 + (1 / 4) * Math.pow(e / 1e10, 1 / 8) * Math.pow(1e10, 1 / 8)
        : 1 + (1 / 4) * Math.pow(e / 1e10, 1 / 4),
    quarks: (e: number) => 1 + (3 / 400) * Math.log2(e * 32 / 1e11),
    hepteractsUnlocked: (e: number) => e >= 1e15 ? 1 : 0,
    challengeHepteractUnlocked: (e: number) => e >= 2e15 ? 1 : 0,
    cube5: (e: number) => 1 + (1 / 300) * Math.log2(e / (4e15 / 1024)),
    powder: (e: number) => 1 + (1 / 50) * Math.log2(e / (7e15 / 32)),
    abyssHepteractUnlocked: (e: number) => e >= 1e16 ? 1 : 0,
    exponent: (e: number) => calculateSigmoid(1.05, e, 1e18),
    acceleratorHepteractUnlocked: (e: number) => e >= 3.33e16 ? 1 : 0,
    acceleratorBoostHepteractUnlocked: (e: number) => e >= 3.33e16 ? 1 : 0,
    multiplierHepteractUnlocked: (e: number) => e >= 3.33e16 ? 1 : 0,
    freeOrbs: (e: number) => Math.floor(200 * Math.pow(e / 2e17, 0.5)),
    ascensionSpeed: (e: number) => 1 + 5 / 100 + (2 * Math.log2(e / 1.5e18)) / 100
  },

  challenge15Rewards: {
    cube1: {
      value: 1,
      baseValue: 1,
      requirement: 750
    },
    ascensions: {
      value: 1,
      baseValue: 1,
      requirement: 1500
    },
    coinExponent: {
      value: 1,
      baseValue: 1,
      requirement: 3000
    },
    taxes: {
      value: 1,
      baseValue: 1,
      requirement: 5000
    },
    obtainium: {
      value: 1,
      baseValue: 1,
      requirement: 7500
    },
    offering: {
      value: 1,
      baseValue: 1,
      requirement: 7500
    },
    accelerator: {
      value: 1,
      baseValue: 1,
      requirement: 10000
    },
    multiplier: {
      value: 1,
      baseValue: 1,
      requirement: 10000
    },
    runeExp: {
      value: 1,
      baseValue: 1,
      requirement: 20000
    },
    runeBonus: {
      value: 1,
      baseValue: 1,
      requirement: 40000
    },
    cube2: {
      value: 1,
      baseValue: 1,
      requirement: 60000
    },
    transcendChallengeReduction: {
      value: 1,
      baseValue: 1,
      requirement: 100000
    },
    reincarnationChallengeReduction: {
      value: 1,
      baseValue: 1,
      requirement: 100000
    },
    antSpeed: {
      value: 1,
      baseValue: 1,
      requirement: 200000
    },
    bonusAntLevel: {
      value: 1,
      baseValue: 1,
      requirement: 500000
    },
    achievementUnlock: {
      value: 0,
      baseValue: 0,
      requirement: 666666
    },
    cube3: {
      value: 1,
      baseValue: 1,
      requirement: 1000000
    },
    talismanBonus: {
      value: 1,
      baseValue: 1,
      requirement: 3000000
    },
    globalSpeed: {
      value: 1,
      baseValue: 1,
      requirement: 1e7
    },
    blessingBonus: {
      value: 1,
      baseValue: 1,
      requirement: 3e7
    },
    constantBonus: {
      value: 1,
      baseValue: 1,
      requirement: 1e8
    },
    cube4: {
      value: 1,
      baseValue: 1,
      requirement: 5e8
    },
    spiritBonus: {
      value: 1,
      baseValue: 1,
      requirement: 2e9
    },
    score: {
      value: 1,
      baseValue: 1,
      requirement: 1e10
    },
    quarks: {
      value: 1,
      baseValue: 1,
      requirement: 1e11,
      HTMLColor: 'lightgoldenrodyellow'
    },
    hepteractsUnlocked: {
      value: 0,
      baseValue: 0,
      requirement: 1e15,
      HTMLColor: 'pink'
    },
    challengeHepteractUnlocked: {
      value: 0,
      baseValue: 0,
      requirement: 2e15,
      HTMLColor: 'red'
    },
    cube5: {
      value: 1,
      baseValue: 1,
      requirement: 4e15
    },
    powder: {
      value: 1,
      baseValue: 1,
      requirement: 7e15
    },
    abyssHepteractUnlocked: {
      value: 0,
      baseValue: 0,
      requirement: 1e16
    },
    exponent: {
      value: 1,
      baseValue: 1,
      requirement: 2e16
    },
    acceleratorHepteractUnlocked: {
      value: 0,
      baseValue: 0,
      requirement: 3.33e16,
      HTMLColor: 'orange'
    },
    acceleratorBoostHepteractUnlocked: {
      value: 0,
      baseValue: 0,
      requirement: 3.33e16,
      HTMLColor: 'cyan'
    },
    multiplierHepteractUnlocked: {
      value: 0,
      baseValue: 0,
      requirement: 3.33e16,
      HTMLColor: 'pink'
    },
    freeOrbs: {
      value: 0,
      baseValue: 0,
      requirement: 2e17,
      HTMLColor: 'pink'
    },
    ascensionSpeed: {
      value: 1,
      baseValue: 1,
      requirement: 1.5e18,
      HTMLColor: 'orange'
    }
  },

  autoResetTimers: {
    prestige: 0,
    transcension: 0,
    reincarnation: 0,
    ascension: 0
  },

  timeMultiplier: 1,
  upgradeMultiplier: 1,

  historyCountMax: 20,

  isEvent: false,
  shopEnhanceVision: false,

  // talismanResourceObtainiumCosts: [1e13, 1e14, 1e16, 1e18, 1e20, 1e22, 1e24]
  // talismanResourceOfferingCosts: [0, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9]

  ambrosiaTimer: 0,
  redAmbrosiaTimer: 0,
  TIME_PER_AMBROSIA: 30,
  TIME_PER_RED_AMBROSIA: 100000,
  currentSingChallenge: undefined,

  coinVanityThresholds: [
    0,
    3,
    6,
    16,
    100,
    500,
    2500,
    1e4,
    1e5,
    1e6,
    1e7,
    1e8,
    1e9,
    1e12,
    1e15,
    1e20,
    1e24,
    1e28,
    1e32,
    1e40,
    1e50,
    1e60,
    1e70,
    1e80,
    1e90,
    1e100
  ]
}

export const blankGlobals = { ...Globals }
