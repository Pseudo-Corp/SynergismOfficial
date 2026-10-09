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

const challenge15CubeRewardSoftcap = 1e20

const challenge15CubeReward = (e: number, scale: number, power: number) => {
  return 1 + Math.pow(Math.min(e, challenge15CubeRewardSoftcap) / scale, power)
      * Math.pow(Math.max(e, challenge15CubeRewardSoftcap) / challenge15CubeRewardSoftcap, power / 6)
}

export const Globals: GlobalVariables = {
  // this shows the logarithm of costs. ex: upgrade one will cost 1e+6 coins, upgrade 2 1e+7, etc.
  // dprint-ignore
  upgradeCosts: [
    0, 6, 7, 8, 10, 12, 20, 35, 50, 75, 100, 55, 75, 125, 150, 200, 250, 500, 750, 1000, 1500,
    5, 15, 25, 40, 60, 45, 75, 100, 125, 150, 150, 400, 800, 1600, 3200, 10000, 20000, 50000, 100000, 200000,
    1, 2, 3, 5, 6, 7, 42, 65, 87, 150, 300, 500, 1000, 1500, 2000, 3000, 6000, 12000, 25000, 75000,
    0, 1, 2, 2, 3, 5, 6, 10, 15, 22, 30, 37, 45, 52, 60, 1900, 2500, 3000, 10000, 21397,
    3, 6, 9, 12, 15, 60, 90, 7, 8, 8, 10, 13, 60, 1, 2, 4, 8, 16, 25, 40,
    12, 16, 20, 30, 50, 500, 1250, 5000, 25000, 125000, 1500, 7500, 30000, 150000, 1000000, 250, 1000, 5000, 25000, 125000,
    1e3, 1e6, 1e9, 1e12, 1e15
  ],

  // Mega list of Variables to be used elsewhere
  crystalUpgradesCost: [6, 15, 20, 40, 100, 200, 500, 1000],
  crystalUpgradeCostIncrement: [8, 15, 20, 40, 100, 200, 500, 1000],

  ticker: 0,

  freeAccelerator: 0,
  totalAccelerator: 0,
  freeAcceleratorBoost: 0,
  totalAcceleratorBoost: 0,
  acceleratorPower: 1.10,
  acceleratorEffect: new Decimal(1),

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

  challengeThreeMultiplier: new Decimal(1),

  prestigePointGain: new Decimal(),

  transcendPointGain: new Decimal(),
  reincarnationPointGain: new Decimal(),

  produceFirst: new Decimal(),
  produceSecond: new Decimal(),
  produceThird: new Decimal(),
  produceFourth: new Decimal(),
  produceFifth: new Decimal(),
  produceTotal: new Decimal(),

  produceFirstDiamonds: new Decimal(),
  produceSecondDiamonds: new Decimal(),
  produceThirdDiamonds: new Decimal(),
  produceFourthDiamonds: new Decimal(),
  produceFifthDiamonds: new Decimal(),
  produceDiamonds: new Decimal(),

  produceFirstMythos: new Decimal(),
  produceSecondMythos: new Decimal(),
  produceThirdMythos: new Decimal(),
  produceFourthMythos: new Decimal(),
  produceFifthMythos: new Decimal(),
  produceMythos: new Decimal(),

  produceFirstParticles: new Decimal(),
  produceSecondParticles: new Decimal(),
  produceThirdParticles: new Decimal(),
  produceFourthParticles: new Decimal(),
  produceFifthParticles: new Decimal(),
  produceParticles: new Decimal(),

  producePerSecond: new Decimal(),
  producePerSecondDiamonds: new Decimal(),
  producePerSecondMythos: new Decimal(),
  producePerSecondParticles: new Decimal(),

  tuSevenMulti: 1,
  currentTab: Tabs.Buildings,

  // dprint-ignore
  ordinals: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'] as const,

  challengeBaseRequirements: [10, 20, 60, 100, 200, 125, 500, 7500, 2.0e8, 2.5e9],

  taxdivisor: new Decimal('1'),
  taxdivisorcheck: new Decimal('1'),

  mythosupgrade13: new Decimal('1'),
  mythosupgrade14: new Decimal('1'),
  mythosupgrade15: new Decimal('1'),
  challengefocus: 0,

  maxexponent: 10000,

  talismanResourceObtainiumCosts: [1e13, 1e14, 1e16, 1e18, 1e20, 1e22, 1e24],
  talismanResourceOfferingCosts: [100, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9],

  timeWarp: false,
  testingDtMultiplier: 1,

  triggerChallenge: 0,

  prevBuildingCostKey: '',
  buildingCosts: {
    coin: [new Decimal(100), new Decimal(1e3), new Decimal(2e4), new Decimal(4e5), new Decimal(8e6)],
    diamond: [new Decimal(100), new Decimal(1e5), new Decimal(1e15), new Decimal(1e40), new Decimal(1e100)],
    mythos: [new Decimal(1), new Decimal(1e2), new Decimal(1e4), new Decimal(1e8), new Decimal(1e16)],
    particle: [new Decimal(1), new Decimal(1e2), new Decimal(1e4), new Decimal(1e8), new Decimal(1e16)],
    accelerator: [new Decimal(500)],
    multiplier: [new Decimal(1e4)],
    acceleratorBoost: [new Decimal(1e3)]
  },

  buildingSubTab: 'coin',
  // 1,000 of each before Diminishing Returns

  autoOfferingCounter: 0,
  MAX_AUTO_SACRIFICE_RUNE: 5,

  ascendBuildingProduction: {
    first: new Decimal(),
    second: new Decimal(),
    third: new Decimal(),
    fourth: new Decimal(),
    fifth: new Decimal()
  },

  acceleratorMultiplier: 1,

  constUpgradeCosts: [null, 1, 13, 17, 237, 316, 4216, 5623, 74989, 1e10, 1e24],

  globalConstantMult: new Decimal('1'),

  c15RewardFormulae: {
    cube1: (e: number) => challenge15CubeReward(e, 3e15, 0.24),
    ascensions: (e: number) => 1 + ((1 / 20) * Math.log2(e / 375)),
    coinExponent: (e: number) => 1 + ((1 / 150) * Math.log2(e / 750)),
    taxes: (e: number) => Math.pow(0.98, Math.log(e / 1.25e3) / Math.log(2)),
    obtainium: (e: number) => 1 + (1 / 4) * Math.pow(e / 7.5e3, 0.6),
    offering: (e: number) => 1 + (1 / 4) * Math.pow(e / 7.5e3, 0.8),
    accelerator: (e: number) => 1 + ((1 / 20) * Math.log(e / 2.5e3)) / Math.log(2),
    multiplier: (e: number) => 1 + ((1 / 20) * Math.log(e / 2.5e3)) / Math.log(2),
    runeExp: (e: number) => 1 + Math.pow(e / 2e4, 1.5),
    runeBonus: (e: number) => 1 + ((1 / 33) * Math.log(e / 1e4)) / Math.log(2),
    cube2: (e: number) => challenge15CubeReward(e, 3e15, 0.24),
    transcendChallengeReduction: (e: number) => Math.pow(0.98, Math.log(e / 2.5e4) / Math.log(2)),
    reincarnationChallengeReduction: (e: number) => Math.pow(0.98, Math.log(e / 2.5e4) / Math.log(2)),
    antSpeed: (e: number) => Math.pow(1 + Math.log(e / 2e5) / Math.log(2), 4),
    bonusAntLevel: (e: number) => 1 + ((1 / 20) * Math.log(e / 1.5e5)) / Math.log(2),
    achievementUnlock: (e: number) => e >= 666666 ? 1 : 0,
    cube3: (e: number) => challenge15CubeReward(e, 3e15, 0.47),
    talismanBonus: (e: number) => (e >= 7.5e5) ? 1 + 0.02 + ((1 / 1000) * Math.log(e / 7.5e5)) / Math.log(2) : 1,
    globalSpeed: (e: number) => 1 + ((1 / 20) * Math.log(e / 2.5e6)) / Math.log(2),
    blessingBonus: (e: number) => 1 + (1 / 5) * Math.pow(e / 3e7, 1 / 4),
    constantBonus: (e: number) => 1 + (1 / 5) * Math.pow(e / 1e8, 2 / 3),
    cube4: (e: number) => challenge15CubeReward(e, 3e14, 0.74),
    spiritBonus: (e: number) => 1 + (1 / 5) * Math.pow(e / 2e9, 1 / 4),
    score: (e: number) => challenge15CubeReward(e, 1e17, 0.63),
    quarks: (e: number) => 1 + (3 / 400) * Math.log2(e * 32 / 1e11),
    hepteractsUnlocked: (e: number) => e >= 1e15 ? 1 : 0,
    challengeHepteractUnlocked: (e: number) => e >= 2e15 ? 1 : 0,
    cube5: (e: number) => challenge15CubeReward(e, 1e14, 0.89),
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
      requirement: 0,
      displayAsMultiplier: true
    },
    cube2: {
      value: 1,
      baseValue: 1,
      requirement: 0,
      displayAsMultiplier: true
    },
    cube3: {
      value: 1,
      baseValue: 1,
      requirement: 0,
      displayAsMultiplier: true
    },
    cube4: {
      value: 1,
      baseValue: 1,
      requirement: 0,
      displayAsMultiplier: true
    },
    score: {
      value: 1,
      baseValue: 1,
      requirement: 0,
      displayAsMultiplier: true
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
    spiritBonus: {
      value: 1,
      baseValue: 1,
      requirement: 2e9
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
      requirement: 1e15,
      displayAsMultiplier: true
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
      HTMLColor: 'pink',
      doNotUsePercentage: true
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

  historyCountMax: 20,

  isEvent: false,

  // talismanResourceObtainiumCosts: [1e13, 1e14, 1e16, 1e18, 1e20, 1e22, 1e24]
  // talismanResourceOfferingCosts: [0, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9]

  purpleReactorTimer: 0,
  TIME_PER_AMBROSIA: 45,
  TIME_PER_RED_AMBROSIA: 1000,
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
  ],

  dOne: new Decimal(1),
  d3: new Decimal(3),
  d3_14: new Decimal(3.14),
  d0_5: new Decimal(0.5),
  d0_001: new Decimal(0.001),
  d0_0001: new Decimal(.0001),
  d100: new Decimal(100),
  d500: new Decimal(500),
  d10000: new Decimal(10000),
  d100000: new Decimal(100000),
  d1e5: new Decimal(1e5),
  d1e6: new Decimal(1e6),
  d4e6: new Decimal(4e6),
  d666666666: new Decimal(666666666),
  d4_32e10: new Decimal(4.32e10),
  d1e11: new Decimal(1e11),
  d1e12: new Decimal(1e12),
  d1e16: new Decimal(1e16),
  d1e20: new Decimal(1e20),
  d6_9e21: new Decimal(6.9e21),
  d1e25: new Decimal(1e25),
  d1e30: new Decimal(1e30),
  d1_509e33: new Decimal(1.509e33),
  d1e40: new Decimal(1e40),
  d1e50: new Decimal(1e50),
  d1e66: new Decimal(1e66),
  d1e100: new Decimal(1e100),
  d1e200: new Decimal(1e200),
  d1e300: new Decimal(1e300),
  d1e308: new Decimal(1e308),
  d1e250: new Decimal('1e250'),
  d1_8e308: new Decimal('1.8e308'),
  d1e1000: new Decimal('1e1000'),
  d1e1500: new Decimal('1e1500'),
  d1e2500: new Decimal('1e2500'),
  d1e5000: new Decimal('1e5000'),
  d1e7777: new Decimal('1e7777'),
  d1e10000: new Decimal('1e10000'),
  d1e15000: new Decimal('1e15000'),
  d1e25000: new Decimal('1e25000'),
  d1e50000: new Decimal('1e50000'),
  d1e77777: new Decimal('1e77777'),
  d1e99999: new Decimal('1e99999'),
  d1e100000: new Decimal('1e100000'),
  d1e120000: new Decimal('1e120000'),
  d1e125000: new Decimal('1e125000'),
  d1e250000: new Decimal('1e250000'),
  d1e300000: new Decimal('1e300000'),
  d1e1000000: new Decimal('1e1000000'),
  d1e2000000: new Decimal('1e2000000'),
  d1e2500000: new Decimal('1e2500000'),
  d1e5000000: new Decimal('1e5000000'),
  d1e10000000: new Decimal('1e10000000'),
  d1e25000000: new Decimal('1e25000000'),
  d1e50000000: new Decimal('1e50000000'),
  d1e100000000: new Decimal('1e100000000'),
  d1e2500000000: new Decimal('1e2500000000'),
  d1e10000000000: new Decimal('1e10000000000'),
  d1e100000000000: new Decimal('1e100000000000'),
  d1e2500000000000: new Decimal('1e2500000000000'),
  d1e10000000000000: new Decimal('1e10000000000000'),

  MIND_DIVISOR: 1_000_000,
  GLOBAL_RESET_THRESHOLD: 10,
  ASCENSION_RESET_THRESHOLD: 10
}

export const blankGlobals = { ...Globals }
