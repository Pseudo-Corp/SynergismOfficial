import Decimal from 'break_infinity.js'
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
    0, 6, 7, 8, 10, 12, 20, 25, 30, 35, 45, 55, 75, 110, 150, 200, 250, 500, 750, 1000, 1500,
    2, 3, 4, 5, 6, 7, 10, 13, 20, 30, 150, 400, 800, 1600, 3200, 10000, 20000, 50000, 100000, 200000,
    1, 2, 3, 5, 6, 7, 42, 65, 87, 150, 300, 500, 1000, 1500, 2000, 3000, 6000, 12000, 25000, 75000,
    0, 1, 2, 2, 3, 5, 6, 10, 15, 22, 30, 37, 45, 52, 60, 1900, 2500, 3000, 7482, 21397,
    3, 6, 9, 12, 15, 20, 30, 6, 8, 8, 10, 13, 60, 1, 2, 4, 8, 16, 25, 40,
    12, 16, 20, 30, 50, 500, 1250, 5000, 25000, 125000, 1500, 7500, 30000, 150000, 1000000, 250, 1000, 5000, 25000, 125000,
    1e3, 1e6, 1e9, 1e12, 1e15
  ],

  // Mega list of Variables to be used elsewhere
  crystalUpgradesCost: [6, 15, 20, 40, 100, 200, 500, 1000],
  crystalUpgradeCostIncrement: [8, 15, 20, 40, 100, 200, 500, 1000],
  // dprint-ignore
  researchBaseCosts: [
    1e200,
    1, 1, 1, 1, 1,
    1, 1e2, 1e4, 1e6, 1e8,
    2, 2e2, 2e4, 2e6, 2e8,
    4e4, 4e8, 10, 1e5, 1e9,
    100, 100, 1e4, 2e3, 2e5,
    40, 200, 50, 5000, 20000000,
    777, 7777, 50000, 500000, 5000000,
    2e3, 2e6, 2e9, 1e5, 1e9,
    1, 1, 5, 25, 125,
    2, 5, 320, 1280, 2.5e9,
    10, 2e3, 4e5, 8e7, 2e9,
    5, 400, 1e4, 3e6, 9e8,
    100, 2500, 100, 2000, 2e5,
    1, 20, 3e3, 4e5, 5e7,
    10, 40, 160, 1000, 10000,
    4e9, 7e9, 1e10, 1.2e10, 1.5e10,
    1e12, 1e13, 3e12, 2e13, 2e13,
    2e14, 6e14, 2e15, 6e15, 2e16,
    1e16, 2e16, 2e17, 4e17, 1e18,
    1e13, 1e14, 1e15, 7.777e18, 7.777e20,
    1e16, 3e16, 1e17, 3e17, 1e20,
    1e18, 3e18, 1e19, 3e19, 1e20,
    1e20, 2e20, 4e20, 8e20, 1e21,
    2e21, 4e21, 8e21, 2e22, 4e22,
    3.2e21, 2e23, 4e23, 1e21, 7.777e32,
    5e8, 5e12, 5e16, 5e20, 5e24, /*ascension tier */
    1e25, 2e25, 4e25, 8e25, 1e26,
    4e26, 8e26, 1e27, 2e27, 1e28,
    5e9, 5e15, 5e21, 5e27, 1e28, /*challenge 11 tier */
    1e29, 2e29, 4e29, 8e29, 1e27,
    2e30, 4e30, 8e30, 1e31, 2e31,
    5e31, 1e32, 2e32, 4e32, 8e32, /*challenge 12 tier */
    1e33, 2e33, 4e33, 8e33, 1e34,
    3e34, 1e35, 3e35, 6e35, 1e36,
    3e36, 1e37, 3e37, 1e38, 3e38, /*challenge 13 tier */
    1e39, 3e39, 1e40, 3e40, 1e50,
    3e41, 1e42, 3e42, 6e42, 1e43,
    3e43, 1e44, 3e44, 1e45, 3e45, /*challenge 14 tier */
    2e46, 6e46, 2e47, 6e47, 1e64,
    6e48, 2e49, 1e50, 1e51, 4e56
  ],

  // dprint-ignore
  researchMaxLevels: [
    0, 1, 1, 1, 1, 1,
    10, 10, 10, 10, 10,
    10, 10, 10, 10, 10,
    10, 10, 1, 1, 1,
    25, 25, 25, 20, 20,
    10, 10, 10, 10, 10,
    12, 12, 10, 10, 10,
    10, 10, 10, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    10, 10, 10, 10, 10,
    20, 20, 20, 20, 20,
    1, 5, 4, 5, 5,
    10, 10, 10, 10, 10,
    1, 1, 1, 1, 1,
    10, 50, 50, 50, 50,
    10, 1, 20, 20, 20,
    20, 20, 20, 20, 10,
    20, 20, 20, 20, 1,
    20, 5, 5, 3, 2,
    10, 10, 10, 10, 1,
    10, 10, 20, 25, 25,
    50, 50, 50, 50, 100,
    10, 10, 10, 100, 100,
    25, 25, 25, 1, 5,
    10, 10, 10, 10, 1,
    10, 10, 10, 1, 1,
    25, 25, 25, 15, 1,
    10, 10, 10, 10, 1,
    10, 1, 6, 10, 1,
    25, 25, 1, 15, 1,
    10, 10, 10, 1, 1,
    10, 10, 10, 10, 1,
    25, 25, 25, 15, 1,
    10, 10, 10, 1, 1,
    10, 3, 6, 10, 5,
    25, 25, 1, 15, 1,
    20, 20, 20, 1, 1,
    20, 1, 50, 50, 10,
    25, 25, 25, 15, 100000
  ],

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
  freeMultiplierBoost: 0,
  totalMultiplierBoost: 0,

  globalCoinMultiplier: new Decimal(1),
  totalCoinOwned: 0,
  prestigeMultiplier: new Decimal(1),
  buildingPower: 1,
  reincarnationMultiplier: new Decimal(1),

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

  researchfiller1: 'Hover over the grid to get details about researches!',
  researchfiller2: 'Level: ',

  // dprint-ignore
  ordinals: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'] as const,
  // dprint-ignore
  cardinals: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twentyone', 'twentytwo', 'twentythree', 'twentyfour', 'twentyfive', 'twentysix', 'twentyseven', 'twentyeight', 'twentynine', 'thirty', 'thirtyone', 'thirtytwo', 'thirtythree', 'thirtyfour'],

  challengeBaseRequirements: [10, 20, 60, 100, 200, 125, 500, 7500, 2.0e8, 3.5e9],

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

  effectiveLevelMult: 1,
  optimalOfferingTimer: 600,
  optimalObtainiumTimer: 3600,

  runeSum: 0,

  globalAntMult: new Decimal('1'),
  antMultiplier: new Decimal('1'),

  antOneProduce: new Decimal('1'),
  antTwoProduce: new Decimal('1'),
  antThreeProduce: new Decimal('1'),
  antFourProduce: new Decimal('1'),
  antFiveProduce: new Decimal('1'),
  antSixProduce: new Decimal('1'),
  antSevenProduce: new Decimal('1'),
  antEightProduce: new Decimal('1'),

  antCostGrowth: [1e41, 3, 10, 1e2, 1e4, 1e8, 1e16, 1e32],

  antUpgradeBaseCost: [100, 100, 1000, 1000, 1e5, 1e6, 1e8, 1e11, 1e15, 1e20, 1e40, 1e100],
  antUpgradeCostIncreases: [10, 10, 10, 10, 100, 100, 100, 100, 1000, 1000, 1000, 1e100],

  bonusant1: 0,
  bonusant2: 0,
  bonusant3: 0,
  bonusant4: 0,
  bonusant5: 0,
  bonusant6: 0,
  bonusant7: 0,
  bonusant8: 0,
  bonusant9: 0,
  bonusant10: 0,
  bonusant11: 0,
  bonusant12: 0,

  rune1level: 1,
  rune2level: 1,
  rune3level: 1,
  rune4level: 1,
  rune5level: 1,
  rune1Talisman: 0,
  rune2Talisman: 0,
  rune3Talisman: 0,
  rune4Talisman: 0,
  rune5Talisman: 0,

  talisman1Effect: [null, 0, 0, 0, 0, 0],
  talisman2Effect: [null, 0, 0, 0, 0, 0],
  talisman3Effect: [null, 0, 0, 0, 0, 0],
  talisman4Effect: [null, 0, 0, 0, 0, 0],
  talisman5Effect: [null, 0, 0, 0, 0, 0],
  talisman6Effect: [null, 0, 0, 0, 0, 0],
  talisman7Effect: [null, 0, 0, 0, 0, 0],

  talisman6Power: 0,
  talisman7Quarks: 0,

  runescreen: 'runes',
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
  antELO: 0,
  effectiveELO: 0,

  timeWarp: false,

  blessingMultiplier: 1,
  spiritMultiplier: 1,
  runeBlessings: [0, 0, 0, 0, 0, 0],
  runeSpirits: [0, 0, 0, 0, 0, 0],

  effectiveRuneBlessingPower: [0, 0, 0, 0, 0, 0],
  effectiveRuneSpiritPower: [0, 0, 0, 0, 0, 0],

  blessingBaseCost: 1e6,
  spiritBaseCost: 1e20,

  triggerChallenge: 0,

  prevReductionValue: -1,

  buildingSubTab: 'coin',
  // 1,000 of each before Diminishing Returns
  blessingbase: [null, 1 / 500, 1 / 5000, 1 / 2000, 1 / 750, 1 / 200, 1 / 10000, 1 / 5000, 1 / 10, 1 / 10000, 1 / 1000],
  blessingDRPower: [null, 1 / 3, 1 / 3, 2 / 3, 1 / 2, 2 / 3, 2, 1 / 3, 1 / 3, 1 / 16, 1 / 16],
  giftbase: [1 / 1000, 1 / 1000, 1 / 1000, 1 / 1000, 1 / 1000, 1 / 1000, 1 / 1000, 1 / 1000, 1 / 1000, 1 / 1000],
  giftDRPower: [1 / 6, 1 / 6, 1 / 3, 1 / 4, 1 / 3, 1, 1 / 6, 1 / 6, 1 / 32, 1 / 32],
  benedictionbase: [
    null,
    1 / 1000,
    1 / 1000,
    1 / 1000,
    1 / 1000,
    1 / 1000,
    1 / 1000,
    1 / 1000,
    1 / 1000,
    1 / 1000,
    1 / 1000
  ],
  benedictionDRPower: [null, 1 / 12, 1 / 12, 1 / 6, 1 / 8, 1 / 6, 1 / 2, 1 / 12, 1 / 12, 1 / 64, 1 / 64],
  // 10 Million of each before Diminishing returns on first 3, 200k for second, and 10k for the last few
  platonicCubeBase: [2 / 4e6, 1.5 / 4e6, 1 / 4e6, 1 / 8e4, 1 / 1e4, 1 / 1e5, 1 / 1e4, 1 / 1e4],
  platonicDRPower: [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 16, 1 / 16, 1 / 4, 1 / 8],

  cubeBonusMultiplier: [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  tesseractBonusMultiplier: [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  hypercubeBonusMultiplier: [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  platonicBonusMultiplier: [1, 1, 1, 1, 1, 1, 1, 1],

  autoOfferingCounter: 0,
  researchOrderByCost: [],

  viscosityPower: [1, 0.87, 0.80, 0.75, 0.70, 0.6, 0.54, 0.45, 0.39, 0.33, 0.3, 0.2, 0.1, 0.05, 0, 0, 0],
  lazinessMultiplier: [
    1,
    1 / 3,
    1 / 10,
    1 / 40,
    1 / 200,
    1 / 1e5,
    1 / 1e7,
    1 / 1e10,
    1 / 1e13,
    1 / 1e16,
    1 / 1e20,
    1 / 1e25,
    1 / 1e35,
    1 / 1e50,
    1 / 1e65,
    1 / 1e80,
    1 / 1e100
  ],
  hyperchallengedMultiplier: [1, 1.2, 1.5, 1.7, 3, 5, 8, 13, 21, 34, 55, 100, 400, 1600, 7777, 18888, 88888],
  illiteracyPower: [1, 0.8, 0.7, 0.6, 0.5, 0.3, 0.2, 0.15, 0.10, 0.06, 0.04, 0.02, 0.01, 0.005, 0, 0, 0],
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
  extinctionMultiplier: [1, 0.92, 0.86, 0.8, 0.74, 0.65, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.1, 0, 0, 0, 0],
  droughtMultiplier: [1, 5, 25, 200, 1e4, 1e7, 1e11, 1e16, 1e22, 1e30, 1e40, 1e55, 1e80, 1e120, 1e177, 1e200, 1e250],
  financialcollapsePower: [
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
  corruptionTrigger: 1,

  challenge15Rewards: {
    cube1: 1,
    ascensions: 1,
    coinExponent: 1,
    taxes: 1,
    obtainium: 1,
    offering: 1,
    accelerator: 1,
    multiplier: 1,
    runeExp: 1,
    runeBonus: 1,
    cube2: 1,
    transcendChallengeReduction: 1,
    reincarnationChallengeReduction: 1,
    antSpeed: 1,
    bonusAntLevel: 1,
    cube3: 1,
    talismanBonus: 1,
    globalSpeed: 1,
    blessingBonus: 1,
    constantBonus: 1,
    cube4: 1,
    spiritBonus: 1,
    score: 1,
    quarks: 1,
    hepteractUnlocked: 0,
    cube5: 1,
    powder: 1,
    exponent: 1,
    freeOrbs: 0,
    ascensionSpeed: 1
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

  eventClicked: false,

  ambrosiaTimer: 0,
  TIME_PER_AMBROSIA: 600,

  currentSingChallenge: undefined
}

export const blankGlobals = { ...Globals }
