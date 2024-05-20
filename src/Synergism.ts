import '@ungap/custom-elements'
import type { DecimalSource } from 'break_infinity.js'
import Decimal from 'break_infinity.js'
import LZString from 'lz-string'

import {
  autoAscensionChallengeSweepUnlock,
  CalcECC,
  challenge15ScoreMultiplier,
  challengeDisplay,
  challengeRequirement,
  getChallengeConditions,
  getMaxChallenges,
  getNextChallenge,
  highestChallengeRewards,
  runChallengeSweep
} from './Challenges'
import { btoa, cleanString, isDecimal, sortWithIndices, sumContents } from './Utility'
import { blankGlobals, Globals as G } from './Variables'

import {
  achievementaward,
  ascensionAchievementCheck,
  buildingAchievementCheck,
  challengeachievementcheck,
  resetachievementcheck
} from './Achievements'
import { antSacrificePointsToMultiplier, autoBuyAnts, calculateCrumbToCoinExp } from './Ants'
import { autoUpgrades } from './Automation'
import type { TesseractBuildings } from './Buy'
import {
  boostAccelerator,
  buyAccelerator,
  buyCrystalUpgrades,
  buyMax,
  buyMultiplier,
  buyParticleBuilding,
  buyRuneBonusLevels,
  buyTesseractBuilding,
  calculateTessBuildingsInBudget,
  getCost,
  getReductionValue
} from './Buy'
import {
  calculateAcceleratorMultiplier,
  calculateAnts,
  calculateCorruptionPoints,
  calculateCubeBlessings,
  calculateGoldenQuarkGain,
  calculateObtainium,
  calculateOfferings,
  calculateOffline,
  calculateRuneLevels,
  calculateSigmoidExponential,
  calculateTimeAcceleration,
  calculateTotalAcceleratorBoost,
  calculateTotalCoinOwned,
  dailyResetCheck,
  exitOffline
} from './Calculate'
import {
  corrChallengeMinimum,
  corruptionButtonsAdd,
  corruptionLoadoutSaveLoad,
  corruptionLoadoutTableCreate,
  corruptionLoadoutTableUpdate,
  corruptionStatsUpdate,
  maxCorruptionLevel,
  updateCorruptionLoadoutNames
} from './Corruptions'
import { updateCubeUpgradeBG } from './Cubes'
import { generateEventHandlers } from './EventListeners'
import { addTimers, automaticTools } from './Helper'
import { resetHistoryRenderAllTables } from './History'
import { calculateHypercubeBlessings } from './Hypercubes'
import { calculatePlatonicBlessings } from './PlatonicCubes'
import { buyResearch, maxRoombaResearchIndex, updateResearchBG } from './Research'
import { autoResearchEnabled } from './Research'
import {
  reset,
  resetrepeat,
  singularity,
  updateAutoCubesOpens,
  updateAutoReset,
  updateSingularityAchievements,
  updateSingularityGlobalPerks,
  updateTesseractAutoBuyAmount
} from './Reset'
import { redeemShards } from './Runes'
import { c15RewardUpdate } from './Statistics'
import {
  buyTalismanEnhance,
  buyTalismanLevels,
  calculateMaxTalismanLevel,
  toggleTalismanBuy,
  updateTalismanAppearance,
  updateTalismanInventory
} from './Talismans'
import { calculatetax } from './Tax'
import { calculateTesseractBlessings } from './Tesseracts'
import {
  autoCubeUpgradesToggle,
  autoPlatonicUpgradesToggle,
  toggleAntAutoSacrifice,
  toggleAntMaxBuy,
  toggleAscStatPerSecond,
  toggleauto,
  toggleAutoAscend,
  toggleAutoChallengeModeText,
  toggleChallenges,
  toggleShops,
  updateAutoChallenge,
  updateRuneBlessingBuyAmount
} from './Toggles'
import type { OneToFive, Player, resetNames, ZeroToFour } from './types/Synergism'
import {
  Alert,
  buttoncolorchange,
  changeTabColor,
  Confirm,
  htmlInserts,
  Notification,
  revealStuff,
  showCorruptionStatsLoadouts,
  updateAchievementBG,
  updateChallengeDisplay,
  updateChallengeLevel
} from './UpdateHTML'
import {
  ascendBuildingDR,
  buyConstantUpgrades,
  categoryUpgrades,
  getConstUpgradeMetadata,
  upgradeupdate
} from './Upgrades'
// import { LegacyShopUpgrades } from './types/LegacySynergism';

import i18next from 'i18next'
import localforage from 'localforage'
import { BlueberryUpgrade, blueberryUpgradeData } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { checkVariablesOnLoad } from './CheckVariables'
import { lastUpdated, prod, testing, version } from './Config'
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from './CubeExperimental'
import { eventCheck } from './Event'
import {
  AbyssHepteract,
  AcceleratorBoostHepteract,
  AcceleratorHepteract,
  ChallengeHepteract,
  ChronosHepteract,
  hepteractEffective,
  HyperrealismHepteract,
  MultiplierHepteract,
  QuarkHepteract,
  toggleAutoBuyOrbs
} from './Hepteracts'
import { disableHotkeys } from './Hotkeys'
import { init as i18nInit } from './i18n'
import { handleLogin } from './Login'
import { octeractData, OcteractUpgrade } from './Octeracts'
import { updatePlatonicUpgradeBG } from './Platonic'
import { QuarkHandler } from './Quark'
import { getFastForwardTotalMultiplier, singularityData, SingularityUpgrade } from './singularity'
import { SingularityChallenge, singularityChallengeData } from './SingularityChallenges'
import {
  AmbrosiaGenerationCache,
  AmbrosiaLuckAdditiveMultCache,
  AmbrosiaLuckCache,
  BlueberryInventoryCache,
  cacheReinitialize
} from './StatCache'
import { changeSubTab, changeTab, Tabs } from './Tabs'
import { settingAnnotation, toggleIconSet, toggleTheme } from './Themes'
import { clearTimeout, clearTimers, setInterval, setTimeout } from './Timers'
import type { PlayerSave } from './types/LegacySynergism'

export const player: Player = {
  firstPlayed: new Date().toISOString(),
  worlds: new QuarkHandler({ quarks: 0, bonus: 0 }),
  coins: new Decimal('1e2'),
  coinsThisPrestige: new Decimal('1e2'),
  coinsThisTranscension: new Decimal('1e2'),
  coinsThisReincarnation: new Decimal('1e2'),
  coinsTotal: new Decimal('100'),

  firstOwnedCoin: 0,
  firstGeneratedCoin: new Decimal('0'),
  firstCostCoin: new Decimal('100'),
  firstProduceCoin: 0.25,

  secondOwnedCoin: 0,
  secondGeneratedCoin: new Decimal('0'),
  secondCostCoin: new Decimal('1e3'),
  secondProduceCoin: 2.5,

  thirdOwnedCoin: 0,
  thirdGeneratedCoin: new Decimal('0'),
  thirdCostCoin: new Decimal('2e4'),
  thirdProduceCoin: 25,

  fourthOwnedCoin: 0,
  fourthGeneratedCoin: new Decimal('0'),
  fourthCostCoin: new Decimal('4e5'),
  fourthProduceCoin: 250,

  fifthOwnedCoin: 0,
  fifthGeneratedCoin: new Decimal('0'),
  fifthCostCoin: new Decimal('8e6'),
  fifthProduceCoin: 2500,

  firstOwnedDiamonds: 0,
  firstGeneratedDiamonds: new Decimal('0'),
  firstCostDiamonds: new Decimal('100'),
  firstProduceDiamonds: 0.05,

  secondOwnedDiamonds: 0,
  secondGeneratedDiamonds: new Decimal('0'),
  secondCostDiamonds: new Decimal('1e5'),
  secondProduceDiamonds: 0.0005,

  thirdOwnedDiamonds: 0,
  thirdGeneratedDiamonds: new Decimal('0'),
  thirdCostDiamonds: new Decimal('1e15'),
  thirdProduceDiamonds: 0.00005,

  fourthOwnedDiamonds: 0,
  fourthGeneratedDiamonds: new Decimal('0'),
  fourthCostDiamonds: new Decimal('1e40'),
  fourthProduceDiamonds: 0.000005,

  fifthOwnedDiamonds: 0,
  fifthGeneratedDiamonds: new Decimal('0'),
  fifthCostDiamonds: new Decimal('1e100'),
  fifthProduceDiamonds: 0.000005,

  firstOwnedMythos: 0,
  firstGeneratedMythos: new Decimal('0'),
  firstCostMythos: new Decimal('1'),
  firstProduceMythos: 1,

  secondOwnedMythos: 0,
  secondGeneratedMythos: new Decimal('0'),
  secondCostMythos: new Decimal('100'),
  secondProduceMythos: 0.01,

  thirdOwnedMythos: 0,
  thirdGeneratedMythos: new Decimal('0'),
  thirdCostMythos: new Decimal('1e4'),
  thirdProduceMythos: 0.001,

  fourthOwnedMythos: 0,
  fourthGeneratedMythos: new Decimal('0'),
  fourthCostMythos: new Decimal('1e8'),
  fourthProduceMythos: 0.0002,

  fifthOwnedMythos: 0,
  fifthGeneratedMythos: new Decimal('0'),
  fifthCostMythos: new Decimal('1e16'),
  fifthProduceMythos: 0.00004,

  firstOwnedParticles: 0,
  firstGeneratedParticles: new Decimal('0'),
  firstCostParticles: new Decimal('1'),
  firstProduceParticles: 0.25,

  secondOwnedParticles: 0,
  secondGeneratedParticles: new Decimal('0'),
  secondCostParticles: new Decimal('100'),
  secondProduceParticles: 0.2,

  thirdOwnedParticles: 0,
  thirdGeneratedParticles: new Decimal('0'),
  thirdCostParticles: new Decimal('1e4'),
  thirdProduceParticles: 0.15,

  fourthOwnedParticles: 0,
  fourthGeneratedParticles: new Decimal('0'),
  fourthCostParticles: new Decimal('1e8'),
  fourthProduceParticles: 0.1,

  fifthOwnedParticles: 0,
  fifthGeneratedParticles: new Decimal('0'),
  fifthCostParticles: new Decimal('1e16'),
  fifthProduceParticles: 0.5,

  firstOwnedAnts: 0,
  firstGeneratedAnts: new Decimal('0'),
  firstCostAnts: new Decimal('1e700'),
  firstProduceAnts: 0.0001,

  secondOwnedAnts: 0,
  secondGeneratedAnts: new Decimal('0'),
  secondCostAnts: new Decimal('3'),
  secondProduceAnts: 0.00005,

  thirdOwnedAnts: 0,
  thirdGeneratedAnts: new Decimal('0'),
  thirdCostAnts: new Decimal('100'),
  thirdProduceAnts: 0.00002,

  fourthOwnedAnts: 0,
  fourthGeneratedAnts: new Decimal('0'),
  fourthCostAnts: new Decimal('1e4'),
  fourthProduceAnts: 0.00001,

  fifthOwnedAnts: 0,
  fifthGeneratedAnts: new Decimal('0'),
  fifthCostAnts: new Decimal('1e12'),
  fifthProduceAnts: 0.000005,

  sixthOwnedAnts: 0,
  sixthGeneratedAnts: new Decimal('0'),
  sixthCostAnts: new Decimal('1e36'),
  sixthProduceAnts: 0.000002,

  seventhOwnedAnts: 0,
  seventhGeneratedAnts: new Decimal('0'),
  seventhCostAnts: new Decimal('1e100'),
  seventhProduceAnts: 0.000001,

  eighthOwnedAnts: 0,
  eighthGeneratedAnts: new Decimal('0'),
  eighthCostAnts: new Decimal('1e300'),
  eighthProduceAnts: 0.00000001,

  ascendBuilding1: {
    cost: 1,
    owned: 0,
    generated: new Decimal('0'),
    multiplier: 0.01
  },
  ascendBuilding2: {
    cost: 10,
    owned: 0,
    generated: new Decimal('0'),
    multiplier: 0.01
  },
  ascendBuilding3: {
    cost: 100,
    owned: 0,
    generated: new Decimal('0'),
    multiplier: 0.01
  },
  ascendBuilding4: {
    cost: 1000,
    owned: 0,
    generated: new Decimal('0'),
    multiplier: 0.01
  },
  ascendBuilding5: {
    cost: 10000,
    owned: 0,
    generated: new Decimal('0'),
    multiplier: 0.01
  },

  multiplierCost: new Decimal('1e4'),
  multiplierBought: 0,

  acceleratorCost: new Decimal('500'),
  acceleratorBought: 0,

  acceleratorBoostBought: 0,
  acceleratorBoostCost: new Decimal('1e3'),

  upgrades: Array(141).fill(0) as number[],

  prestigeCount: 0,
  transcendCount: 0,
  reincarnationCount: 0,

  prestigePoints: new Decimal('0'),
  transcendPoints: new Decimal('0'),
  reincarnationPoints: new Decimal('0'),

  prestigeShards: new Decimal('0'),
  transcendShards: new Decimal('0'),
  reincarnationShards: new Decimal('0'),

  toggles: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
    16: false,
    17: false,
    18: false,
    19: false,
    20: false,
    21: false,
    22: false,
    23: false,
    24: false,
    25: false,
    26: false,
    27: false,
    28: true,
    29: true,
    30: true,
    31: true,
    32: true,
    33: true,
    34: true,
    35: true,
    36: false,
    37: false,
    38: false,
    39: true,
    40: true,
    41: true,
    42: false,
    43: false
  },

  challengecompletions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  highestchallengecompletions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  challenge15Exponent: 0,
  highestChallenge15Exponent: 0,

  retrychallenges: false,
  currentChallenge: {
    transcension: 0,
    reincarnation: 0,
    ascension: 0
  },
  researchPoints: 0,
  obtainiumtimer: 0,
  obtainiumpersecond: 0,
  maxobtainiumpersecond: 0,
  maxobtainium: 0,
  // Ignore the first index. The other 25 are shaped in a 5x5 grid similar to the production appearance
  // dprint-ignore
  researches: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0,
  ],

  unlocks: {
    coinone: false,
    cointwo: false,
    cointhree: false,
    coinfour: false,
    prestige: false,
    generation: false,
    transcend: false,
    reincarnate: false,
    rrow1: false,
    rrow2: false,
    rrow3: false,
    rrow4: false
  },
  achievements: Array(281).fill(0) as number[],

  achievementPoints: 0,

  prestigenomultiplier: true,
  prestigenoaccelerator: true,
  transcendnomultiplier: true,
  transcendnoaccelerator: true,
  reincarnatenomultiplier: true,
  reincarnatenoaccelerator: true,
  prestigenocoinupgrades: true,
  transcendnocoinupgrades: true,
  transcendnocoinorprestigeupgrades: true,
  reincarnatenocoinupgrades: true,
  reincarnatenocoinorprestigeupgrades: true,
  reincarnatenocoinprestigeortranscendupgrades: true,
  reincarnatenocoinprestigetranscendorgeneratorupgrades: true,

  crystalUpgrades: [0, 0, 0, 0, 0, 0, 0, 0],
  crystalUpgradesCost: [7, 15, 20, 40, 100, 200, 500, 1000],

  runelevels: [1, 1, 1, 1, 1, 0, 0],
  runeexp: [0, 0, 0, 0, 0, 0, 0],
  runeshards: 0,
  maxofferings: 0,
  offeringpersecond: 0,

  prestigecounter: 0,
  transcendcounter: 0,
  reincarnationcounter: 0,
  offlinetick: 0,

  prestigeamount: 0,
  transcendamount: 0,
  reincarnationamount: 0,

  fastestprestige: 9999999999,
  fastesttranscend: 99999999999,
  fastestreincarnate: 999999999999,

  resettoggle1: 1,
  resettoggle2: 1,
  resettoggle3: 1,
  resettoggle4: 1,

  tesseractAutoBuyerToggle: 0,
  tesseractAutoBuyerAmount: 0,

  coinbuyamount: 1,
  crystalbuyamount: 1,
  mythosbuyamount: 1,
  particlebuyamount: 1,
  offeringbuyamount: 1,
  tesseractbuyamount: 1,

  shoptoggles: {
    coin: true,
    prestige: true,
    transcend: true,
    generators: true,
    reincarnate: true
  },
  tabnumber: 1,
  subtabNumber: 0,

  // create a Map with keys defaulting to false
  codes: new Map(Array.from({ length: 48 }, (_, i) => [i + 1, false])),

  loaded1009: true,
  loaded1009hotfix1: true,
  loaded10091: true,
  loaded1010: true,
  loaded10101: true,

  shopUpgrades: {
    offeringPotion: 1,
    obtainiumPotion: 1,
    offeringEX: 0,
    offeringAuto: 0,
    obtainiumEX: 0,
    obtainiumAuto: 0,
    instantChallenge: 0,
    antSpeed: 0,
    cashGrab: 0,
    shopTalisman: 0,
    seasonPass: 0,
    challengeExtension: 0,
    challengeTome: 0,
    cubeToQuark: 0,
    tesseractToQuark: 0,
    hypercubeToQuark: 0,
    seasonPass2: 0,
    seasonPass3: 0,
    chronometer: 0,
    infiniteAscent: 0,
    calculator: 0,
    calculator2: 0,
    calculator3: 0,
    calculator4: 0,
    calculator5: 0,
    calculator6: 0,
    calculator7: 0,
    constantEX: 0,
    powderEX: 0,
    chronometer2: 0,
    chronometer3: 0,
    seasonPassY: 0,
    seasonPassZ: 0,
    challengeTome2: 0,
    instantChallenge2: 0,
    cashGrab2: 0,
    chronometerZ: 0,
    cubeToQuarkAll: 0,
    offeringEX2: 0,
    obtainiumEX2: 0,
    seasonPassLost: 0,
    powderAuto: 0,
    challenge15Auto: 0,
    extraWarp: 0,
    autoWarp: 0,
    improveQuarkHept: 0,
    improveQuarkHept2: 0,
    improveQuarkHept3: 0,
    improveQuarkHept4: 0,
    shopImprovedDaily: 0,
    shopImprovedDaily2: 0,
    shopImprovedDaily3: 0,
    shopImprovedDaily4: 0,
    offeringEX3: 0,
    obtainiumEX3: 0,
    improveQuarkHept5: 0,
    seasonPassInfinity: 0,
    chronometerInfinity: 0,
    shopSingularityPenaltyDebuff: 0,
    shopAmbrosiaLuckMultiplier4: 0,
    shopOcteractAmbrosiaLuck: 0,
    shopAmbrosiaGeneration1: 0,
    shopAmbrosiaGeneration2: 0,
    shopAmbrosiaGeneration3: 0,
    shopAmbrosiaGeneration4: 0,
    shopAmbrosiaLuck1: 0,
    shopAmbrosiaLuck2: 0,
    shopAmbrosiaLuck3: 0,
    shopAmbrosiaLuck4: 0,
    shopCashGrabUltra: 0,
    shopAmbrosiaAccelerator: 0,
    shopEXUltra: 0,
  },
  shopBuyMaxToggle: false,
  shopHideToggle: false,
  shopConfirmationToggle: true,
  autoPotionTimer: 0,
  autoPotionTimerObtainium: 0,

  autoSacrificeToggle: false,
  autoBuyFragment: false,
  autoFortifyToggle: false,
  autoEnhanceToggle: false,
  autoResearchToggle: false,
  researchBuyMaxToggle: false,
  autoResearchMode: 'manual',
  autoResearch: 0,
  autoSacrifice: 0,
  sacrificeTimer: 0,
  quarkstimer: 90000,
  goldenQuarksTimer: 90000,

  antPoints: new Decimal('1'),
  antUpgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  antSacrificePoints: 0,
  antSacrificeTimer: 900,
  antSacrificeTimerReal: 900,

  talismanLevels: [0, 0, 0, 0, 0, 0, 0],
  talismanRarity: [1, 1, 1, 1, 1, 1, 1],
  talismanOne: [null, -1, 1, 1, 1, -1],
  talismanTwo: [null, 1, 1, -1, -1, 1],
  talismanThree: [null, 1, -1, 1, 1, -1],
  talismanFour: [null, -1, -1, 1, 1, 1],
  talismanFive: [null, 1, 1, -1, -1, 1],
  talismanSix: [null, 1, 1, 1, -1, -1],
  talismanSeven: [null, -1, 1, -1, 1, 1],
  talismanShards: 0,
  commonFragments: 0,
  uncommonFragments: 0,
  rareFragments: 0,
  epicFragments: 0,
  legendaryFragments: 0,
  mythicalFragments: 0,

  buyTalismanShardPercent: 10,

  autoAntSacrifice: false,
  autoAntSacTimer: 900,
  autoAntSacrificeMode: 0,
  antMax: false,

  ascensionCount: 0,
  ascensionCounter: 0,
  ascensionCounterReal: 0,
  ascensionCounterRealReal: 0,
  // dprint-ignore
  cubeUpgrades: [
    null,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ],
  cubeUpgradesBuyMaxToggle: false,
  autoCubeUpgradesToggle: false,
  autoPlatonicUpgradesToggle: false,
  platonicUpgrades: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  wowCubes: new WowCubes(0),
  wowTesseracts: new WowTesseracts(0),
  wowHypercubes: new WowHypercubes(0),
  wowPlatonicCubes: new WowPlatonicCubes(0),
  saveOfferingToggle: false,
  wowAbyssals: 0,
  wowOcteracts: 0,
  totalWowOcteracts: 0,
  cubeBlessings: {
    accelerator: 0,
    multiplier: 0,
    offering: 0,
    runeExp: 0,
    obtainium: 0,
    antSpeed: 0,
    antSacrifice: 0,
    antELO: 0,
    talismanBonus: 0,
    globalSpeed: 0
  },
  tesseractBlessings: {
    accelerator: 0,
    multiplier: 0,
    offering: 0,
    runeExp: 0,
    obtainium: 0,
    antSpeed: 0,
    antSacrifice: 0,
    antELO: 0,
    talismanBonus: 0,
    globalSpeed: 0
  },
  hypercubeBlessings: {
    accelerator: 0,
    multiplier: 0,
    offering: 0,
    runeExp: 0,
    obtainium: 0,
    antSpeed: 0,
    antSacrifice: 0,
    antELO: 0,
    talismanBonus: 0,
    globalSpeed: 0
  },
  platonicBlessings: {
    cubes: 0,
    tesseracts: 0,
    hypercubes: 0,
    platonics: 0,
    hypercubeBonus: 0,
    taxes: 0,
    scoreBonus: 0,
    globalSpeed: 0
  },

  hepteractCrafts: {
    chronos: ChronosHepteract,
    hyperrealism: HyperrealismHepteract,
    quark: QuarkHepteract,
    challenge: ChallengeHepteract,
    abyss: AbyssHepteract,
    accelerator: AcceleratorHepteract,
    acceleratorBoost: AcceleratorBoostHepteract,
    multiplier: MultiplierHepteract
  },

  ascendShards: new Decimal('0'),
  autoAscend: false,
  autoAscendMode: 'c10Completions',
  autoAscendThreshold: 1,
  autoOpenCubes: false,
  openCubes: 0,
  autoOpenTesseracts: false,
  openTesseracts: 0,
  autoOpenHypercubes: false,
  openHypercubes: 0,
  autoOpenPlatonicsCubes: false,
  openPlatonicsCubes: 0,
  roombaResearchIndex: 0,
  ascStatToggles: {
    // false here means show per second
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  },

  prototypeCorruptions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  usedCorruptions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  corruptionLoadouts: {
    // If you add loadouts don't forget to add loadout names!
    1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  corruptionLoadoutNames: [
    'Loadout 1',
    'Loadout 2',
    'Loadout 3',
    'Loadout 4',
    'Loadout 5',
    'Loadout 6',
    'Loadout 7',
    'Loadout 8'
  ],
  corruptionShowStats: true,

  constantUpgrades: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  history: { ants: [], ascend: [], reset: [], singularity: [] },
  historyShowPerSecond: false,

  autoChallengeRunning: false,
  autoChallengeIndex: 1,
  autoChallengeToggles: [
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false
  ],
  autoChallengeStartExponent: 10,
  autoChallengeTimer: {
    start: 10,
    exit: 2,
    enter: 2
  },

  runeBlessingLevels: [0, 0, 0, 0, 0, 0],
  runeSpiritLevels: [0, 0, 0, 0, 0, 0],
  runeBlessingBuyAmount: 0,
  runeSpiritBuyAmount: 0,

  autoTesseracts: [false, false, false, false, false, false],

  saveString: 'Synergism-$VERSION$-$TIME$.txt',
  exporttest: !testing,

  dayCheck: null,
  dayTimer: 0,
  cubeOpenedDaily: 0,
  cubeQuarkDaily: 0,
  tesseractOpenedDaily: 0,
  tesseractQuarkDaily: 0,
  hypercubeOpenedDaily: 0,
  hypercubeQuarkDaily: 0,
  platonicCubeOpenedDaily: 0,
  platonicCubeQuarkDaily: 0,
  overfluxOrbs: 0,
  overfluxOrbsAutoBuy: false,
  overfluxPowder: 0,
  dailyPowderResetUses: 1,
  autoWarpCheck: false,
  loadedOct4Hotfix: false,
  loadedNov13Vers: true,
  loadedDec16Vers: true,
  loadedV253: true,
  loadedV255: true,
  loadedV297Hotfix1: true,
  loadedV2927Hotfix1: true,
  loadedV2930Hotfix1: true,
  loadedV2931Hotfix1: true,
  loadedV21003Hotfix1: true,
  loadedV21007Hotfix1: true,
  version,
  rngCode: 0,
  promoCodeTiming: {
    time: 0
  },
  singularityCount: 0,
  highestSingularityCount: 0,
  singularityCounter: 0,
  goldenQuarks: 0,
  quarksThisSingularity: 0,
  totalQuarksEver: 0,
  hotkeys: {},
  theme: 'Dark Mode',
  iconSet: 0,
  notation: 'Default',

  singularityUpgrades: {
    goldenQuarks1: new SingularityUpgrade(
      singularityData.goldenQuarks1,
      'goldenQuarks1'
    ),
    goldenQuarks2: new SingularityUpgrade(
      singularityData.goldenQuarks2,
      'goldenQuarks2'
    ),
    goldenQuarks3: new SingularityUpgrade(
      singularityData.goldenQuarks3,
      'goldenQuarks3'
    ),
    starterPack: new SingularityUpgrade(
      singularityData.starterPack,
      'starterPack'
    ),
    wowPass: new SingularityUpgrade(singularityData.wowPass, 'wowPass'),
    cookies: new SingularityUpgrade(singularityData.cookies, 'cookies'),
    cookies2: new SingularityUpgrade(singularityData.cookies2, 'cookies2'),
    cookies3: new SingularityUpgrade(singularityData.cookies3, 'cookies3'),
    cookies4: new SingularityUpgrade(singularityData.cookies4, 'cookies4'),
    cookies5: new SingularityUpgrade(singularityData.cookies5, 'cookies5'),
    ascensions: new SingularityUpgrade(
      singularityData.ascensions,
      'ascensions'
    ),
    corruptionFourteen: new SingularityUpgrade(
      singularityData.corruptionFourteen,
      'corruptionFourteen'
    ),
    corruptionFifteen: new SingularityUpgrade(
      singularityData.corruptionFifteen,
      'corruptionFifteen'
    ),
    singOfferings1: new SingularityUpgrade(
      singularityData.singOfferings1,
      'singOfferings1'
    ),
    singOfferings2: new SingularityUpgrade(
      singularityData.singOfferings2,
      'singOfferings2'
    ),
    singOfferings3: new SingularityUpgrade(
      singularityData.singOfferings3,
      'singOfferings3'
    ),
    singObtainium1: new SingularityUpgrade(
      singularityData.singObtainium1,
      'singObtainium1'
    ),
    singObtainium2: new SingularityUpgrade(
      singularityData.singObtainium2,
      'singObtainium2'
    ),
    singObtainium3: new SingularityUpgrade(
      singularityData.singObtainium3,
      'singObtainium3'
    ),
    singCubes1: new SingularityUpgrade(
      singularityData.singCubes1,
      'singCubes1'
    ),
    singCubes2: new SingularityUpgrade(
      singularityData.singCubes2,
      'singCubes2'
    ),
    singCubes3: new SingularityUpgrade(
      singularityData.singCubes3,
      'singCubes3'
    ),
    singCitadel: new SingularityUpgrade(
      singularityData.singCitadel,
      'singCitadel'
    ),
    singCitadel2: new SingularityUpgrade(
      singularityData.singCitadel2,
      'singCitadel2'
    ),
    octeractUnlock: new SingularityUpgrade(
      singularityData.octeractUnlock,
      'octeractUnlock'
    ),
    singOcteractPatreonBonus: new SingularityUpgrade(
      singularityData.singOcteractPatreonBonus,
      'singOcteractPatreonBonus'
    ),
    intermediatePack: new SingularityUpgrade(
      singularityData.intermediatePack,
      'intermediatePack'
    ),
    advancedPack: new SingularityUpgrade(
      singularityData.advancedPack,
      'advancedPack'
    ),
    expertPack: new SingularityUpgrade(
      singularityData.expertPack,
      'expertPack'
    ),
    masterPack: new SingularityUpgrade(
      singularityData.masterPack,
      'masterPack'
    ),
    divinePack: new SingularityUpgrade(
      singularityData.divinePack,
      'divinePack'
    ),
    wowPass2: new SingularityUpgrade(singularityData.wowPass2, 'wowPass2'),
    potionBuff: new SingularityUpgrade(
      singularityData.potionBuff,
      'potionBuff'
    ),
    potionBuff2: new SingularityUpgrade(
      singularityData.potionBuff2,
      'potionBuff2'
    ),
    potionBuff3: new SingularityUpgrade(
      singularityData.potionBuff3,
      'potionBuff3'
    ),
    singChallengeExtension: new SingularityUpgrade(
      singularityData.singChallengeExtension,
      'singChallengeExtension'
    ),
    singChallengeExtension2: new SingularityUpgrade(
      singularityData.singChallengeExtension2,
      'singChallengeExtension2'
    ),
    singChallengeExtension3: new SingularityUpgrade(
      singularityData.singChallengeExtension3,
      'singChallengeExtension3'
    ),
    singQuarkImprover1: new SingularityUpgrade(
      singularityData.singQuarkImprover1,
      'singQuarkImprover1'
    ),
    singQuarkHepteract: new SingularityUpgrade(
      singularityData.singQuarkHepteract,
      'singQuarkHepteract'
    ),
    singQuarkHepteract2: new SingularityUpgrade(
      singularityData.singQuarkHepteract2,
      'singQuarkHepteract2'
    ),
    singQuarkHepteract3: new SingularityUpgrade(
      singularityData.singQuarkHepteract3,
      'singQuarkHepteract3'
    ),
    singOcteractGain: new SingularityUpgrade(
      singularityData.singOcteractGain,
      'singOcteractGain'
    ),
    singOcteractGain2: new SingularityUpgrade(
      singularityData.singOcteractGain2,
      'singOcteractGain2'
    ),
    singOcteractGain3: new SingularityUpgrade(
      singularityData.singOcteractGain3,
      'singOcteractGain3'
    ),
    singOcteractGain4: new SingularityUpgrade(
      singularityData.singOcteractGain4,
      'singOcteractGain4'
    ),
    singOcteractGain5: new SingularityUpgrade(
      singularityData.singOcteractGain5,
      'singOcteractGain5'
    ),
    wowPass3: new SingularityUpgrade(singularityData.wowPass3, 'wowPass3'),
    ultimatePen: new SingularityUpgrade(
      singularityData.ultimatePen,
      'ultimatePen'
    ),
    platonicTau: new SingularityUpgrade(
      singularityData.platonicTau,
      'platonicTau'
    ),
    platonicAlpha: new SingularityUpgrade(
      singularityData.platonicAlpha,
      'platonicAlpha'
    ),
    platonicDelta: new SingularityUpgrade(
      singularityData.platonicDelta,
      'platonicDelta'
    ),
    platonicPhi: new SingularityUpgrade(
      singularityData.platonicPhi,
      'platonicPhi'
    ),
    singFastForward: new SingularityUpgrade(
      singularityData.singFastForward,
      'singFastForward'
    ),
    singFastForward2: new SingularityUpgrade(
      singularityData.singFastForward2,
      'singFastForward2'
    ),
    singAscensionSpeed: new SingularityUpgrade(
      singularityData.singAscensionSpeed,
      'singAscensionSpeed'
    ),
    singAscensionSpeed2: new SingularityUpgrade(
      singularityData.singAscensionSpeed2,
      'singAscensionSpeed2'
    ),
    oneMind: new SingularityUpgrade(singularityData.oneMind, 'oneMind'),
    wowPass4: new SingularityUpgrade(singularityData.wowPass4, 'wowPass4'),
    offeringAutomatic: new SingularityUpgrade(
      singularityData.offeringAutomatic,
      'offeringAutomatic'
    ),
    blueberries: new SingularityUpgrade(
      singularityData.blueberries,
      'blueberries'
    ),
    singAmbrosiaLuck: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck,
      'singAmbrosiaLuck'
    ),
    singAmbrosiaLuck2: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck2,
      'singAmbrosiaLuck2'
    ),
    singAmbrosiaLuck3: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck3,
      'singAmbrosiaLuck3'
    ),
    singAmbrosiaLuck4: new SingularityUpgrade(
      singularityData.singAmbrosiaLuck4,
      'singAmbrosiaLuck4'
    ),
    singAmbrosiaGeneration: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration,
      'singAmbrosiaGeneration'
    ),
    singAmbrosiaGeneration2: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration2,
      'singAmbrosiaGeneration2'
    ),
    singAmbrosiaGeneration3: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration3,
      'singAmbrosiaGeneration3'
    ),
    singAmbrosiaGeneration4: new SingularityUpgrade(
      singularityData.singAmbrosiaGeneration4,
      'singAmbrosiaGeneration4'
    )
  },

  octeractUpgrades: {
    octeractStarter: new OcteractUpgrade(
      octeractData.octeractStarter,
      'octeractStarter'
    ),
    octeractGain: new OcteractUpgrade(
      octeractData.octeractGain,
      'octeractGain'
    ),
    octeractGain2: new OcteractUpgrade(
      octeractData.octeractGain2,
      'octeractGain2'
    ),
    octeractQuarkGain: new OcteractUpgrade(
      octeractData.octeractQuarkGain,
      'octeractQuarkGain'
    ),
    octeractQuarkGain2: new OcteractUpgrade(
      octeractData.octeractQuarkGain2,
      'octeractQuarkGain2'
    ),
    octeractCorruption: new OcteractUpgrade(
      octeractData.octeractCorruption,
      'octeractCorruption'
    ),
    octeractGQCostReduce: new OcteractUpgrade(
      octeractData.octeractGQCostReduce,
      'octeractGQCostReduce'
    ),
    octeractExportQuarks: new OcteractUpgrade(
      octeractData.octeractExportQuarks,
      'octeractExportQuarks'
    ),
    octeractImprovedDaily: new OcteractUpgrade(
      octeractData.octeractImprovedDaily,
      'octeractImprovedDaily'
    ),
    octeractImprovedDaily2: new OcteractUpgrade(
      octeractData.octeractImprovedDaily2,
      'octeractImprovedDaily2'
    ),
    octeractImprovedDaily3: new OcteractUpgrade(
      octeractData.octeractImprovedDaily3,
      'octeractImprovedDaily3'
    ),
    octeractImprovedQuarkHept: new OcteractUpgrade(
      octeractData.octeractImprovedQuarkHept,
      'octeractImprovedQuarkHept'
    ),
    octeractImprovedGlobalSpeed: new OcteractUpgrade(
      octeractData.octeractImprovedGlobalSpeed,
      'octeractImprovedGlobalSpeed'
    ),
    octeractImprovedAscensionSpeed: new OcteractUpgrade(
      octeractData.octeractImprovedAscensionSpeed,
      'octeractImprovedAscensionSpeed'
    ),
    octeractImprovedAscensionSpeed2: new OcteractUpgrade(
      octeractData.octeractImprovedAscensionSpeed2,
      'octeractImprovedAscensionSpeed2'
    ),
    octeractImprovedFree: new OcteractUpgrade(
      octeractData.octeractImprovedFree,
      'octeractImprovedFree'
    ),
    octeractImprovedFree2: new OcteractUpgrade(
      octeractData.octeractImprovedFree2,
      'octeractImprovedFree2'
    ),
    octeractImprovedFree3: new OcteractUpgrade(
      octeractData.octeractImprovedFree3,
      'octeractImprovedFree3'
    ),
    octeractImprovedFree4: new OcteractUpgrade(
      octeractData.octeractImprovedFree4,
      'octeractImprovedFree4'
    ),
    octeractSingUpgradeCap: new OcteractUpgrade(
      octeractData.octeractSingUpgradeCap,
      'octeractSingUpgradeCap'
    ),
    octeractOfferings1: new OcteractUpgrade(
      octeractData.octeractOfferings1,
      'octeractOfferings1'
    ),
    octeractObtainium1: new OcteractUpgrade(
      octeractData.octeractObtainium1,
      'octeractObtainium1'
    ),
    octeractAscensions: new OcteractUpgrade(
      octeractData.octeractAscensions,
      'octeractAscensions'
    ),
    octeractAscensions2: new OcteractUpgrade(
      octeractData.octeractAscensions2,
      'octeractAscensions2'
    ),
    octeractAscensionsOcteractGain: new OcteractUpgrade(
      octeractData.octeractAscensionsOcteractGain,
      'octeractAscensionsOcteractGain'
    ),
    octeractFastForward: new OcteractUpgrade(
      octeractData.octeractFastForward,
      'octeractFastForward'
    ),
    octeractAutoPotionSpeed: new OcteractUpgrade(
      octeractData.octeractAutoPotionSpeed,
      'octeractAutoPotionSpeed'
    ),
    octeractAutoPotionEfficiency: new OcteractUpgrade(
      octeractData.octeractAutoPotionEfficiency,
      'octeractAutoPotionEfficiency'
    ),
    octeractOneMindImprover: new OcteractUpgrade(
      octeractData.octeractOneMindImprover,
      'octeractOneMindImprover'
    ),
    octeractAmbrosiaLuck: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck,
      'octeractAmbrosiaLuck'
    ),
    octeractAmbrosiaLuck2: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck2,
      'octeractAmbrosiaLuck2'
    ),
    octeractAmbrosiaLuck3: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck3,
      'octeractAmbrosiaLuck3'
    ),
    octeractAmbrosiaLuck4: new OcteractUpgrade(
      octeractData.octeractAmbrosiaLuck4,
      'octeractAmbrosiaLuck4'
    ),
    octeractAmbrosiaGeneration: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration,
      'octeractAmbrosiaGeneration'
    ),
    octeractAmbrosiaGeneration2: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration2,
      'octeractAmbrosiaGeneration2'
    ),
    octeractAmbrosiaGeneration3: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration3,
      'octeractAmbrosiaGeneration3'
    ),
    octeractAmbrosiaGeneration4: new OcteractUpgrade(
      octeractData.octeractAmbrosiaGeneration4,
      'octeractAmbrosiaGeneration4'
    )
  },

  dailyCodeUsed: false,
  hepteractAutoCraftPercentage: 50,
  octeractTimer: 0,
  insideSingularityChallenge: false,

  singularityChallenges: {
    noSingularityUpgrades: new SingularityChallenge(
      singularityChallengeData.noSingularityUpgrades,
      'noSingularityUpgrades'
    ),
    oneChallengeCap: new SingularityChallenge(
      singularityChallengeData.oneChallengeCap,
      'oneChallengeCap'
    ),
    noOcteracts: new SingularityChallenge(
      singularityChallengeData.noOcteracts,
      'noOcteracts'
    ),
    limitedAscensions: new SingularityChallenge(
      singularityChallengeData.limitedAscensions,
      'limitedAscensions'
    ),
    noAmbrosiaUpgrades: new SingularityChallenge(
      singularityChallengeData.noAmbrosiaUpgrades,
      'noAmbrosiaUpgrades'
    )
  },

  ambrosia: 0,
  lifetimeAmbrosia: 0,
  ambrosiaRNG: 0,
  blueberryTime: 0,
  visitedAmbrosiaSubtab: false,
  spentBlueberries: 0,
  blueberryUpgrades: {
    ambrosiaTutorial: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaTutorial,
      'ambrosiaTutorial'
    ),
    ambrosiaQuarks1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarks1,
      'ambrosiaQuarks1'
    ),
    ambrosiaCubes1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubes1,
      'ambrosiaQuarks1'
    ),
    ambrosiaLuck1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuck1,
      'ambrosiaLuck1'
    ),
    ambrosiaCubeQuark1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubeQuark1,
      'ambrosiaCubeQuark1'
    ),
    ambrosiaLuckQuark1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuckQuark1,
      'ambrosiaLuckQuark1'
    ),
    ambrosiaLuckCube1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuckCube1,
      'ambrosiaLuckCube1'
    ),
    ambrosiaQuarkCube1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarkCube1,
      'ambrosiaQuarkCube1'
    ),
    ambrosiaCubeLuck1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubeLuck1,
      'ambrosiaCubeLuck1'
    ),
    ambrosiaQuarkLuck1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarkLuck1,
      'ambrosiaQuarkLuck1'
    ),
    ambrosiaQuarks2: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaQuarks2,
      'ambrosiaQuarks2'
    ),
    ambrosiaCubes2: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaCubes2,
      'ambrosiaQuarks2'
    ),
    ambrosiaLuck2: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaLuck2,
      'ambrosiaLuck2'
    ),
    ambrosiaPatreon: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaPatreon,
      'ambrosiaPatreon'
    ),
    ambrosiaObtainium1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaObtainium1,
      'ambrosiaObtainium1'
    ),
    ambrosiaOffering1: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaOffering1,
      'ambrosiaOffering1'
    ),
    ambrosiaHyperflux: new BlueberryUpgrade(
      blueberryUpgradeData.ambrosiaHyperflux,
      'ambrosiaHyperflux'
    )
  },

  blueberryLoadouts: {
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {}
  },
  blueberryLoadoutMode: 'saveTree',

  ultimateProgress: 0,
  ultimatePixels: 0,

  caches: {
    ambrosiaLuckAdditiveMult: new AmbrosiaLuckAdditiveMultCache(),
    ambrosiaLuck: new AmbrosiaLuckCache(),
    ambrosiaGeneration: new AmbrosiaGenerationCache(),
    blueberryInventory: new BlueberryInventoryCache()
  },

  lastExportedSave: 0
}

export const blankSave = Object.assign({}, player, {
  codes: new Map(Array.from({ length: 48 }, (_, i) => [i + 1, false]))
})

// The main cause of the double singularity bug was caused by a race condition
// when the game was saving just as the user was entering a Singularity. To fix
// this, hopefully, we disable saving the game when in the prompt or currently
// entering a Singularity.
export const saveCheck = { canSave: true }

export const saveSynergy = async (button?: boolean): Promise<boolean> => {
  player.offlinetick = Date.now()
  player.loaded1009 = true
  player.loaded1009hotfix1 = true

  // shallow hold, doesn't modify OG object nor is affected by modifications to OG
  const p = Object.assign({}, player, {
    codes: Array.from(player.codes),
    worlds: Number(player.worlds),
    wowCubes: Number(player.wowCubes),
    wowTesseracts: Number(player.wowTesseracts),
    wowHypercubes: Number(player.wowHypercubes),
    wowPlatonicCubes: Number(player.wowPlatonicCubes),
    singularityUpgrades: Object.fromEntries(
      Object.entries(player.singularityUpgrades).map(([key, value]) => {
        return [
          key,
          {
            level: value.level,
            goldenQuarksInvested: value.goldenQuarksInvested,
            toggleBuy: value.toggleBuy,
            freeLevels: value.freeLevels
          }
        ]
      })
    ),
    octeractUpgrades: Object.fromEntries(
      Object.entries(player.octeractUpgrades).map(([key, value]) => {
        return [
          key,
          {
            level: value.level,
            octeractsInvested: value.octeractsInvested,
            toggleBuy: value.toggleBuy,
            freeLevels: value.freeLevels
          }
        ]
      })
    ),
    singularityChallenges: Object.fromEntries(
      Object.entries(player.singularityChallenges).map(([key, value]) => {
        return [
          key,
          {
            completions: value.completions,
            highestSingularityCompleted: value.highestSingularityCompleted,
            enabled: value.enabled
          }
        ]
      })
    ),
    blueberryUpgrades: Object.fromEntries(
      Object.entries(player.blueberryUpgrades).map(([key, value]) => {
        return [
          key,
          {
            level: value.level,
            ambrosiaInvested: value.ambrosiaInvested,
            blueberriesInvested: value.blueberriesInvested,
            toggleBuy: value.toggleBuy,
            freeLevels: value.freeLevels
          }
        ]
      })
    )
  })

  const save = btoa(JSON.stringify(p))
  if (save !== null) {
    const saveBlob = new Blob([save], { type: 'text/plain' })

    // Should prevent overwritting of localforage that is currently used
    if (!saveCheck.canSave) {
      return false
    }

    localStorage.setItem('Synergysave2', save)
    await localforage.setItem<Blob>('Synergysave2', saveBlob)
  } else {
    await Alert(i18next.t('testing.errorSaving'))
    return false
  }

  if (button) {
    const el = DOMCacheGetOrSet('saveinfo')
    el.textContent = i18next.t('testing.gameSaved')
    setTimeout(() => (el.textContent = ''), 4000)
  }

  return true
}

/**
 * Map of properties on the Player object to adapt
 */
const toAdapt = new Map<keyof Player, (data: PlayerSave) => unknown>([
  [
    'worlds',
    (data) =>
      new QuarkHandler({
        quarks: Number(data.worlds) || 0,
        bonus: player.worlds.BONUS
      })
  ],
  ['wowCubes', (data) => new WowCubes(Number(data.wowCubes) || 0)],
  [
    'wowTesseracts',
    (data) => new WowTesseracts(Number(data.wowTesseracts) || 0)
  ],
  [
    'wowHypercubes',
    (data) => new WowHypercubes(Number(data.wowHypercubes) || 0)
  ],
  [
    'wowPlatonicCubes',
    (data) => new WowPlatonicCubes(Number(data.wowPlatonicCubes) || 0)
  ]
])

const loadSynergy = async () => {
  const save = (await localforage.getItem<Blob>('Synergysave2'))
    ?? localStorage.getItem('Synergysave2')

  const saveString = typeof save === 'string' ? save : await save?.text()
  const data = saveString
    ? (JSON.parse(atob(saveString)) as PlayerSave & Record<string, unknown>)
    : null

  if (testing || !prod) {
    Object.defineProperties(window, {
      player: { value: player },
      G: { value: G },
      Decimal: { value: Decimal },
      i18n: { value: i18next }
    })

    if (data && testing) {
      data.exporttest = false
    }
  }

  Object.assign(G, { ...blankGlobals })

  if (data) {
    if ((data.exporttest === false || data.exporttest === 'NO!') && !testing) {
      return Alert(i18next.t('testing.saveInLive2'))
    }

    const oldCodesUsed = Array.from(
      { length: 24 }, // old codes only went up to 24
      (_, i) => `offerpromo${i + 1}used`
    )

    // size before loading
    const size = player.codes.size

    const oldPromoKeys = Object.keys(data).filter((k) => k.includes('offerpromo'))
    if (oldPromoKeys.length > 0) {
      oldPromoKeys.forEach((k) => {
        const value = data[k]
        const num = +k.replace(/[^\d]/g, '')
        player.codes.set(num, Boolean(value))
      })
    }

    Object.keys(data).forEach((stringProp) => {
      const prop = stringProp as keyof Player
      if (!(prop in player)) {
        return
      } else if (toAdapt.has(prop)) {
        return ((player[prop] as unknown) = toAdapt.get(prop)!(data))
      } else if (isDecimal(player[prop])) {
        return ((player[prop] as Decimal) = new Decimal(
          data[prop] as DecimalSource
        ))
      } else if (prop === 'codes') {
        const codes = data[prop]
        if (codes != null) {
          return (player.codes = new Map(codes))
        }
      } else if (oldCodesUsed.includes(prop)) {
        return
      } else if (Array.isArray(data[prop])) {
        const arr = data[prop] as unknown[]
        // in old savefiles, some arrays may be 1-based instead of 0-based (newer)
        // so if the lengths of the savefile key is greater than that of the player obj
        // it means a key was removed; likely a 1-based index where array[0] was null
        // so we can get rid of it entirely.
        if ((player[prop] as unknown[]).length < arr.length) {
          return ((player[prop] as unknown[]) = arr.slice(
            arr.length - (player[prop] as unknown[]).length
          ))
        }
      }

      return ((player[prop] as unknown) = data[prop])
    })

    player.lastExportedSave = data.lastExportedSave ?? 0

    if (data.offerpromo24used !== undefined) {
      player.codes.set(25, false)
    }

    // sets all non-existent codes to default value false
    if (player.codes.size < size) {
      for (let i = player.codes.size + 1; i <= size; i++) {
        if (!player.codes.has(i)) {
          player.codes.set(i, false)
        }
      }
    }

    // sets all non-existent codes to default value false
    if (player.codes.size < size) {
      for (let i = player.codes.size + 1; i <= size; i++) {
        if (!player.codes.has(i)) {
          player.codes.set(i, false)
        }
      }
    }

    if (!('rngCode' in data)) {
      player.rngCode = 0
    }

    if (data.loaded1009 === undefined || !data.loaded1009) {
      player.loaded1009 = false
    }
    if (data.loaded1009hotfix1 === undefined || !data.loaded1009hotfix1) {
      player.loaded1009hotfix1 = false
    }
    if (data.loaded10091 === undefined) {
      player.loaded10091 = false
    }
    if (data.loaded1010 === undefined) {
      player.loaded1010 = false
    }
    if (data.loaded10101 === undefined) {
      player.loaded10101 = false
    }

    // Fix dumb shop stuff
    // First, if shop isn't even defined we just define it as so
    if (data.shopUpgrades === undefined) {
      player.shopUpgrades = Object.assign({}, blankSave.shopUpgrades)
    }

    if (typeof player.researches[76] === 'undefined') {
      player.codes.set(13, false)
      player.researches.push(
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      )
      player.achievements.push(
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      )
      player.maxofferings = player.runeshards
      player.maxobtainium = player.researchPoints
      player.researchPoints += 51200 * player.researches[50]
      player.researches[50] = 0
    }

    player.maxofferings = player.maxofferings || 0
    player.maxobtainium = player.maxobtainium || 0
    player.runeshards = player.runeshards || 0
    player.researchPoints = player.researchPoints || 0

    if (
      !data.loaded1009
      || data.loaded1009hotfix1 === null
      || data.shopUpgrades?.offeringPotion === undefined
    ) {
      player.firstOwnedParticles = 0
      player.secondOwnedParticles = 0
      player.thirdOwnedParticles = 0
      player.fourthOwnedParticles = 0
      player.fifthOwnedParticles = 0
      player.firstCostParticles = new Decimal('1')
      player.secondCostParticles = new Decimal('1e2')
      player.thirdCostParticles = new Decimal('1e4')
      player.fourthCostParticles = new Decimal('1e8')
      player.fifthCostParticles = new Decimal('1e16')
      player.autoSacrificeToggle = false
      player.autoResearchToggle = false
      player.autoResearchMode = 'manual'
      player.autoResearch = 0
      player.autoSacrifice = 0
      player.sacrificeTimer = 0
      player.loaded1009 = true
      player.codes.set(18, false)
    }
    if (!data.loaded1009hotfix1) {
      player.loaded1009hotfix1 = true
      player.codes.set(19, true)
      player.firstOwnedParticles = 0
      player.secondOwnedParticles = 0
      player.thirdOwnedParticles = 0
      player.fourthOwnedParticles = 0
      player.fifthOwnedParticles = 0
      player.firstCostParticles = new Decimal('1')
      player.secondCostParticles = new Decimal('1e2')
      player.thirdCostParticles = new Decimal('1e4')
      player.fourthCostParticles = new Decimal('1e8')
      player.fifthCostParticles = new Decimal('1e16')
    }
    if (
      data.loaded10091 === undefined
      || !data.loaded10091
      || player.researches[86] > 100
      || player.researches[87] > 100
      || player.researches[88] > 100
      || player.researches[89] > 100
      || player.researches[90] > 10
    ) {
      player.loaded10091 = true
      player.researchPoints += 7.5e8 * player.researches[82]
      player.researchPoints += 2e8 * player.researches[83]
      player.researchPoints += 4.5e9 * player.researches[84]
      player.researchPoints += 2.5e7 * player.researches[86]
      player.researchPoints += 7.5e7 * player.researches[87]
      player.researchPoints += 3e8 * player.researches[88]
      player.researchPoints += 1e9 * player.researches[89]
      player.researchPoints += 2.5e7 * player.researches[90]
      player.researchPoints += 1e8 * player.researches[91]
      player.researchPoints += 2e9 * player.researches[92]
      player.researchPoints += 9e9 * player.researches[93]
      player.researchPoints += 7.25e10 * player.researches[94]
      player.researches[86] = 0
      player.researches[87] = 0
      player.researches[88] = 0
      player.researches[89] = 0
      player.researches[90] = 0
      player.researches[91] = 0
      player.researches[92] = 0
    }

    // const shop = data.shopUpgrades as LegacyShopUpgrades & Player['shopUpgrades'];
    if (
      data.achievements?.[169] === undefined
      || typeof player.achievements[169] === 'undefined'
      //    (shop.antSpeed === undefined && shop.antSpeedLevel === undefined) ||
      //    (shop.antSpeed === undefined && typeof shop.antSpeedLevel === 'undefined') ||
      || data.loaded1010 === undefined
      || data.loaded1010 === false
    ) {
      player.loaded1010 = true
      player.codes.set(21, false)

      player.firstOwnedAnts = 0
      player.firstGeneratedAnts = new Decimal('0')
      player.firstCostAnts = new Decimal('1e700')
      player.firstProduceAnts = 0.0001

      player.secondOwnedAnts = 0
      player.secondGeneratedAnts = new Decimal('0')
      player.secondCostAnts = new Decimal('3')
      player.secondProduceAnts = 0.00005

      player.thirdOwnedAnts = 0
      player.thirdGeneratedAnts = new Decimal('0')
      player.thirdCostAnts = new Decimal('100')
      player.thirdProduceAnts = 0.00002

      player.fourthOwnedAnts = 0
      player.fourthGeneratedAnts = new Decimal('0')
      player.fourthCostAnts = new Decimal('1e4')
      player.fourthProduceAnts = 0.00001

      player.fifthOwnedAnts = 0
      player.fifthGeneratedAnts = new Decimal('0')
      player.fifthCostAnts = new Decimal('1e12')
      player.fifthProduceAnts = 0.000005

      player.sixthOwnedAnts = 0
      player.sixthGeneratedAnts = new Decimal('0')
      player.sixthCostAnts = new Decimal('1e36')
      player.sixthProduceAnts = 0.000002

      player.seventhOwnedAnts = 0
      player.seventhGeneratedAnts = new Decimal('0')
      player.seventhCostAnts = new Decimal('1e100')
      player.seventhProduceAnts = 0.000001

      player.eighthOwnedAnts = 0
      player.eighthGeneratedAnts = new Decimal('0')
      player.eighthCostAnts = new Decimal('1e300')
      player.eighthProduceAnts = 0.00000001

      player.achievements.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
      player.antPoints = new Decimal('1')

      player.upgrades[38] = 0
      player.upgrades[39] = 0
      player.upgrades[40] = 0

      player.upgrades[76] = 0
      player.upgrades[77] = 0
      player.upgrades[78] = 0
      player.upgrades[79] = 0
      player.upgrades[80] = 0

      //    player.shopUpgrades.antSpeed = 0;
      //    player.shopUpgrades.shopTalisman = 0;

      player.antUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      player.unlocks.rrow4 = false
      player.researchPoints += 3e7 * player.researches[50]
      player.researchPoints += 2e9 * player.researches[96]
      player.researchPoints += 5e9 * player.researches[97]
      player.researchPoints += 3e10 * player.researches[98]
      player.researches[50] = 0
      player.researches[96] = 0
      player.researches[97] = 0
      player.researches[98] = 0
      player.researches.push(
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      )

      player.talismanLevels = [0, 0, 0, 0, 0, 0, 0]
      player.talismanRarity = [1, 1, 1, 1, 1, 1, 1]

      player.talismanShards = 0
      player.commonFragments = 0
      player.uncommonFragments = 0
      player.rareFragments = 0
      player.epicFragments = 0
      player.legendaryFragments = 0
      player.mythicalFragments = 0
      player.buyTalismanShardPercent = 10

      player.talismanOne = [null, -1, 1, 1, 1, -1]
      player.talismanTwo = [null, 1, 1, -1, -1, 1]
      player.talismanThree = [null, 1, -1, 1, 1, -1]
      player.talismanFour = [null, -1, -1, 1, 1, 1]
      player.talismanFive = [null, 1, 1, -1, -1, 1]
      player.talismanSix = [null, 1, 1, 1, -1, -1]
      player.talismanSeven = [null, -1, 1, -1, 1, 1]

      player.antSacrificePoints = 0
      player.antSacrificeTimer = 0

      player.obtainiumpersecond = 0
      player.maxobtainiumpersecond = 0
    }

    if (data.loaded10101 === undefined || data.loaded10101 === false) {
      player.loaded10101 = true

      // dprint-ignore
      const refundThese = [
        0, 31, 32, 61, 62, 63, 64, 76, 77, 78, 79, 80, 81, 98, 104, 105, 106,
        107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
        121, 122, 123, 125,
      ];
      // dprint-ignore
      const refundReward = [
        0, 2, 20, 5, 10, 80, 5e3, 1e7, 1e7, 2e7, 3e7, 4e7, 2e8, 3e10, 1e11,
        1e12, 2e11, 1e12, 2e10, 2e11, 1e12, 2e13, 5e13, 1e14, 2e14, 5e14, 1e15,
        2e15, 1e16, 1e15, 1e16, 1e14, 1e15, 1e15, 1e20,
      ];
      for (let i = 1; i < refundThese.length; i++) {
        player.researchPoints += player.researches[refundThese[i]] * refundReward[i]
        player.researches[refundThese[i]] = 0
      }
      player.autoAntSacrifice = false
      player.antMax = false
    }

    if (player.firstOwnedAnts < 1 && player.firstCostAnts.gte('1e1200')) {
      player.firstCostAnts = new Decimal('1e700')
      player.firstOwnedAnts = 0
    }

    checkVariablesOnLoad(data)
    if (data.ascensionCount === undefined || player.ascensionCount === 0) {
      player.ascensionCount = 0
      if (player.ascensionCounter === 0 && player.prestigeCount > 0) {
        player.ascensionCounter = 86400 * 90
      }
      /*player.cubeUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];*/

      if (player.singularityCount === 0) {
        player.cubeUpgrades = [...blankSave.cubeUpgrades]
      }
      player.wowCubes = new WowCubes(0)
      player.wowTesseracts = new WowTesseracts(0)
      player.wowHypercubes = new WowHypercubes(0)
      player.wowPlatonicCubes = new WowPlatonicCubes(0)
      player.cubeBlessings = {
        accelerator: 0,
        multiplier: 0,
        offering: 0,
        runeExp: 0,
        obtainium: 0,
        antSpeed: 0,
        antSacrifice: 0,
        antELO: 0,
        talismanBonus: 0,
        globalSpeed: 0
      }
    }
    if (data.autoAntSacTimer == null) {
      player.autoAntSacTimer = 900
    }
    if (data.autoAntSacrificeMode === undefined) {
      player.autoAntSacrificeMode = 0
    }

    if (player.transcendCount < 0) {
      player.transcendCount = 0
    }
    if (player.reincarnationCount < 0) {
      player.reincarnationCount = 0
    }
    if (player.runeshards < 0) {
      player.runeshards = 0
    }
    if (player.researchPoints < 0) {
      player.researchPoints = 0
    }

    if (player.resettoggle1 === 0) {
      player.resettoggle1 = 1
      player.resettoggle2 = 1
      player.resettoggle3 = 1
      player.resettoggle4 = 1
    }
    if (player.tesseractAutoBuyerToggle === 0) {
      player.tesseractAutoBuyerToggle = 1
    }
    if (player.reincarnationCount < 0.5 && player.unlocks.rrow4) {
      player.unlocks = {
        coinone: false,
        cointwo: false,
        cointhree: false,
        coinfour: false,
        prestige: false,
        generation: false,
        transcend: false,
        reincarnate: false,
        rrow1: false,
        rrow2: false,
        rrow3: false,
        rrow4: false
      }
    }

    if (data.history === undefined) {
      player.history = { ants: [], ascend: [], reset: [], singularity: [] }
    } else {
      // See: https://discord.com/channels/677271830838640680/964168000360038481/964168002071330879
      const keys = Object.keys(
        blankSave.history
      ) as (keyof (typeof blankSave)['history'])[]

      for (const historyKey of keys) {
        if (!(historyKey in player.history)) {
          player.history[historyKey] = []
        }
      }
    }

    if (data.historyShowPerSecond === undefined) {
      player.historyShowPerSecond = false
    }

    if (!Number.isInteger(player.ascendBuilding1.cost)) {
      player.ascendBuilding1.cost = 1
      player.ascendBuilding1.owned = 0
      player.ascendBuilding2.cost = 10
      player.ascendBuilding2.owned = 0
      player.ascendBuilding3.cost = 100
      player.ascendBuilding3.owned = 0
      player.ascendBuilding4.cost = 1000
      player.ascendBuilding4.owned = 0
      player.ascendBuilding5.cost = 10000
      player.ascendBuilding5.owned = 0
    }

    if (!player.dayCheck) {
      player.dayCheck = new Date()
    }
    if (typeof player.dayCheck === 'string') {
      player.dayCheck = new Date(player.dayCheck)
      if (isNaN(player.dayCheck.getTime())) {
        player.dayCheck = new Date()
      }
    }
    // Measures for people who play the past
    let updatedLast = lastUpdated
    if (!isNaN(updatedLast.getTime())) {
      updatedLast = new Date(
        updatedLast.getFullYear(),
        updatedLast.getMonth(),
        updatedLast.getDate() - 1
      )
      if (player.dayCheck.getTime() < updatedLast.getTime()) {
        player.dayCheck = updatedLast
      }
    } else if (player.dayCheck.getTime() < 1654009200000) {
      player.dayCheck = new Date('06/01/2022 00:00:00')
    }
    // Calculate daily
    player.dayCheck = new Date(
      player.dayCheck.getFullYear(),
      player.dayCheck.getMonth(),
      player.dayCheck.getDate()
    )

    const maxLevel = maxCorruptionLevel()
    player.usedCorruptions = player.usedCorruptions.map(
      (curr: number, index: number) => {
        if (index >= 2 && index <= 9) {
          return Math.min(
            maxLevel
              * (player.challengecompletions[corrChallengeMinimum(index)] > 0
                ? 1
                : 0),
            curr
          )
        }
        return curr
      }
    )

    for (let i = 1; i <= 5; i++) {
      const ascendBuildingI = `ascendBuilding${i as OneToFive}` as const
      player[ascendBuildingI].generated = new Decimal(
        player[ascendBuildingI].generated
      )
    }

    while (typeof player.achievements[252] === 'undefined') {
      player.achievements.push(0)
    }
    while (typeof player.researches[200] === 'undefined') {
      player.researches.push(0)
    }
    while (typeof player.upgrades[140] === 'undefined') {
      player.upgrades.push(0)
    }

    if (
      player.saveString === ''
      || player.saveString === 'Synergism-v1011Test.txt'
    ) {
      player.saveString = player.singularityCount === 0
        ? 'Synergism-$VERSION$-$TIME$.txt'
        : 'Synergism-$VERSION$-$TIME$-$SING$.txt'
    }
    ;(DOMCacheGetOrSet('saveStringInput') as HTMLInputElement).value = cleanString(player.saveString)

    for (let j = 1; j < 126; j++) {
      upgradeupdate(j, true)
    }

    for (let j = 1; j <= 200; j++) {
      updateResearchBG(j)
    }
    for (let j = 1; j < player.cubeUpgrades.length; j++) {
      updateCubeUpgradeBG(j)
    }
    const platUpg = document.querySelectorAll('img[id^="platUpg"]')
    for (let j = 1; j <= platUpg.length; j++) {
      updatePlatonicUpgradeBG(j)
    }

    const q = [
      'coin',
      'crystal',
      'mythos',
      'particle',
      'offering',
      'tesseract'
    ] as const
    if (
      player.coinbuyamount !== 1
      && player.coinbuyamount !== 10
      && player.coinbuyamount !== 100
      && player.coinbuyamount !== 1000
    ) {
      player.coinbuyamount = 1
    }
    if (
      player.crystalbuyamount !== 1
      && player.crystalbuyamount !== 10
      && player.crystalbuyamount !== 100
      && player.crystalbuyamount !== 1000
    ) {
      player.crystalbuyamount = 1
    }
    if (
      player.mythosbuyamount !== 1
      && player.mythosbuyamount !== 10
      && player.mythosbuyamount !== 100
      && player.mythosbuyamount !== 1000
    ) {
      player.mythosbuyamount = 1
    }
    if (
      player.particlebuyamount !== 1
      && player.particlebuyamount !== 10
      && player.particlebuyamount !== 100
      && player.particlebuyamount !== 1000
    ) {
      player.particlebuyamount = 1
    }
    if (
      player.offeringbuyamount !== 1
      && player.offeringbuyamount !== 10
      && player.offeringbuyamount !== 100
      && player.offeringbuyamount !== 1000
    ) {
      player.offeringbuyamount = 1
    }
    if (
      player.tesseractbuyamount !== 1
      && player.tesseractbuyamount !== 10
      && player.tesseractbuyamount !== 100
      && player.tesseractbuyamount !== 1000
    ) {
      player.tesseractbuyamount = 1
    }
    for (let j = 0; j <= 5; j++) {
      for (let k = 0; k < 4; k++) {
        let d = ''
        if (k === 0) {
          d = 'one'
        }
        if (k === 1) {
          d = 'ten'
        }
        if (k === 2) {
          d = 'hundred'
        }
        if (k === 3) {
          d = 'thousand'
        }
        const e = `${q[j]}${d}`
        DOMCacheGetOrSet(e).style.backgroundColor = ''
      }
      let c = ''
      const curBuyAmount = player[`${q[j]}buyamount` as const]
      if (curBuyAmount === 1) {
        c = 'one'
      }
      if (curBuyAmount === 10) {
        c = 'ten'
      }
      if (curBuyAmount === 100) {
        c = 'hundred'
      }
      if (curBuyAmount === 1000) {
        c = 'thousand'
      }

      const b = `${q[j]}${c}`
      DOMCacheGetOrSet(b).style.backgroundColor = 'green'
    }

    const testArray = []
    // Creates a copy of research costs array
    for (let i = 0; i < G.researchBaseCosts.length; i++) {
      testArray.push(G.researchBaseCosts[i])
    }
    // Sorts the above array, and returns the index order of sorted array
    G.researchOrderByCost = sortWithIndices(testArray)
    player.roombaResearchIndex = 0

    // June 09, 2021: Updated toggleShops() and removed boilerplate - Platonic
    toggleShops()
    getChallengeConditions()
    updateChallengeDisplay()
    revealStuff()
    toggleauto()

    // Challenge summary should be displayed
    if (player.currentChallenge.transcension > 0) {
      challengeDisplay(player.currentChallenge.transcension)
    } else if (player.currentChallenge.reincarnation > 0) {
      challengeDisplay(player.currentChallenge.reincarnation)
    } else if (player.currentChallenge.ascension > 0) {
      challengeDisplay(player.currentChallenge.ascension)
    } else {
      challengeDisplay(1)
    }

    corruptionStatsUpdate()
    const corrs = Math.min(8, Object.keys(player.corruptionLoadouts).length) + 1
    for (let i = 0; i < corrs; i++) {
      corruptionLoadoutTableUpdate(i)
    }
    showCorruptionStatsLoadouts()
    updateCorruptionLoadoutNames()

    DOMCacheGetOrSet('researchrunebonus').textContent = i18next.t(
      'runes.thanksResearches',
      {
        percent: format(100 * G.effectiveLevelMult - 100, 4, true)
      }
    )

    DOMCacheGetOrSet('talismanlevelup').style.display = 'none'
    DOMCacheGetOrSet('talismanrespec').style.display = 'none'

    DOMCacheGetOrSet('antSacrificeSummary').style.display = 'none'

    // This must be initialized at the beginning of the calculation
    c15RewardUpdate()

    calculatePlatonicBlessings()
    calculateHypercubeBlessings()
    calculateTesseractBlessings()
    calculateCubeBlessings()
    updateTalismanAppearance(0)
    updateTalismanAppearance(1)
    updateTalismanAppearance(2)
    updateTalismanAppearance(3)
    updateTalismanAppearance(4)
    updateTalismanAppearance(5)
    updateTalismanAppearance(6)
    for (const id in player.ascStatToggles) {
      toggleAscStatPerSecond(+id) // toggle each stat twice to make sure the displays are correct and match what they used to be
      toggleAscStatPerSecond(+id)
    }

    // Strictly check the input and data with values other than numbers
    const omit = /e\+/
    let inputd = player.autoChallengeTimer.start
    let inpute = Number(
      (DOMCacheGetOrSet('startAutoChallengeTimerInput') as HTMLInputElement)
        .value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(
        DOMCacheGetOrSet('startAutoChallengeTimerInput') as HTMLInputElement
      ).value = `${player.autoChallengeTimer.start || blankSave.autoChallengeTimer.start}`.replace(omit, 'e')
      updateAutoChallenge(1)
    }

    DOMCacheGetOrSet('startTimerValue').innerHTML = i18next.t(
      'challenges.timeStartSweep',
      {
        time: format(player.autoChallengeTimer.start, 2, true)
      }
    )

    inputd = player.autoChallengeTimer.exit
    inpute = Number(
      (DOMCacheGetOrSet('exitAutoChallengeTimerInput') as HTMLInputElement)
        .value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(
        DOMCacheGetOrSet('exitAutoChallengeTimerInput') as HTMLInputElement
      ).value = `${player.autoChallengeTimer.exit || blankSave.autoChallengeTimer.exit}`.replace(omit, 'e')
      updateAutoChallenge(2)
    }

    DOMCacheGetOrSet('exitTimerValue').innerHTML = i18next.t(
      'challenges.timeExitChallenge',
      {
        time: format(player.autoChallengeTimer.exit, 2, true)
      }
    )

    inputd = player.autoChallengeTimer.enter
    inpute = Number(
      (DOMCacheGetOrSet('enterAutoChallengeTimerInput') as HTMLInputElement)
        .value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(
        DOMCacheGetOrSet('enterAutoChallengeTimerInput') as HTMLInputElement
      ).value = `${player.autoChallengeTimer.enter || blankSave.autoChallengeTimer.enter}`.replace(omit, 'e')
      updateAutoChallenge(3)
    }

    DOMCacheGetOrSet('enterTimerValue').innerHTML = i18next.t(
      'challenges.timeEnterChallenge',
      {
        time: format(player.autoChallengeTimer.enter, 2, true)
      }
    )

    inputd = player.prestigeamount
    inpute = Number(
      (DOMCacheGetOrSet('prestigeamount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('prestigeamount') as HTMLInputElement).value = `${
        player.prestigeamount || blankSave.prestigeamount
      }`.replace(omit, 'e')
      updateAutoReset(1)
    }
    inputd = player.transcendamount
    inpute = Number(
      (DOMCacheGetOrSet('transcendamount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('transcendamount') as HTMLInputElement).value = `${
        player.transcendamount || blankSave.transcendamount
      }`.replace(omit, 'e')
      updateAutoReset(2)
    }
    inputd = player.reincarnationamount
    inpute = Number(
      (DOMCacheGetOrSet('reincarnationamount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('reincarnationamount') as HTMLInputElement).value = `${
        player.reincarnationamount || blankSave.reincarnationamount
      }`.replace(omit, 'e')
      updateAutoReset(3)
    }
    inputd = player.autoAscendThreshold
    inpute = Number(
      (DOMCacheGetOrSet('ascensionAmount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('ascensionAmount') as HTMLInputElement).value = `${
        player.autoAscendThreshold || blankSave.autoAscendThreshold
      }`.replace(omit, 'e')
      updateAutoReset(4)
    }
    inputd = player.autoAntSacTimer
    inpute = Number(
      (DOMCacheGetOrSet('autoAntSacrificeAmount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('autoAntSacrificeAmount') as HTMLInputElement).value = `${
        player.autoAntSacTimer || blankSave.autoAntSacTimer
      }`.replace(
        omit,
        'e'
      )
      updateAutoReset(5)
    }
    inputd = player.tesseractAutoBuyerAmount
    inpute = Number(
      (DOMCacheGetOrSet('tesseractAmount') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('tesseractAmount') as HTMLInputElement).value = `${
        player.tesseractAutoBuyerAmount || blankSave.tesseractAutoBuyerAmount
      }`.replace(omit, 'e')
      updateTesseractAutoBuyAmount()
    }
    inputd = player.openCubes
    inpute = Number(
      (DOMCacheGetOrSet('cubeOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('cubeOpensInput') as HTMLInputElement).value = `${player.openCubes || blankSave.openCubes}`
        .replace(omit, 'e')
      updateAutoCubesOpens(1)
    }
    inputd = player.openTesseracts
    inpute = Number(
      (DOMCacheGetOrSet('tesseractsOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('tesseractsOpensInput') as HTMLInputElement).value = `${
        player.openTesseracts || blankSave.openTesseracts
      }`.replace(omit, 'e')
      updateAutoCubesOpens(2)
    }
    inputd = player.openHypercubes
    inpute = Number(
      (DOMCacheGetOrSet('hypercubesOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('hypercubesOpensInput') as HTMLInputElement).value = `${
        player.openHypercubes || blankSave.openHypercubes
      }`.replace(omit, 'e')
      updateAutoCubesOpens(3)
    }
    inputd = player.openPlatonicsCubes
    inpute = Number(
      (DOMCacheGetOrSet('platonicCubeOpensInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('platonicCubeOpensInput') as HTMLInputElement).value = `${
        player.openPlatonicsCubes || blankSave.openPlatonicsCubes
      }`.replace(
        omit,
        'e'
      )
      updateAutoCubesOpens(4)
    }
    inputd = player.runeBlessingBuyAmount
    inpute = Number(
      (DOMCacheGetOrSet('buyRuneBlessingInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('buyRuneBlessingInput') as HTMLInputElement).value = `${
        player.runeBlessingBuyAmount || blankSave.runeBlessingBuyAmount
      }`.replace(omit, 'e')
      updateRuneBlessingBuyAmount(1)
    }

    DOMCacheGetOrSet('buyRuneBlessingToggle').innerHTML = i18next.t(
      'runes.blessings.buyUpTo',
      {
        amount: format(player.runeBlessingBuyAmount)
      }
    )

    inputd = player.runeSpiritBuyAmount
    inpute = Number(
      (DOMCacheGetOrSet('buyRuneSpiritInput') as HTMLInputElement).value
    )
    if (inpute !== inputd || isNaN(inpute + inputd)) {
      ;(DOMCacheGetOrSet('buyRuneSpiritInput') as HTMLInputElement).value = `${
        player.runeSpiritBuyAmount || blankSave.runeSpiritBuyAmount
      }`.replace(omit, 'e')
      updateRuneBlessingBuyAmount(2)
    }
    DOMCacheGetOrSet('buyRuneSpiritToggleValue').innerHTML = i18next.t(
      'runes.spirits.buyUpTo',
      {
        amount: format(player.runeSpiritBuyAmount, 0, true)
      }
    )

    if (player.resettoggle1 === 1) {
      DOMCacheGetOrSet('prestigeautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
    if (player.resettoggle2 === 1) {
      DOMCacheGetOrSet('transcendautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
    if (player.resettoggle3 === 1) {
      DOMCacheGetOrSet('reincarnateautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
    if (player.resettoggle4 === 1) {
      DOMCacheGetOrSet('tesseractautobuymode').textContent = i18next.t('toggles.modeAmount')
    }

    if (player.resettoggle1 === 2) {
      DOMCacheGetOrSet('prestigeautotoggle').textContent = i18next.t('toggles.modeTime')
    }
    if (player.resettoggle2 === 2) {
      DOMCacheGetOrSet('transcendautotoggle').textContent = i18next.t('toggles.modeTime')
    }
    if (player.resettoggle3 === 2) {
      DOMCacheGetOrSet('reincarnateautotoggle').textContent = i18next.t('toggles.modeTime')
    }
    if (player.resettoggle4 === 2) {
      DOMCacheGetOrSet('tesseractautobuymode').textContent = i18next.t(
        'toggles.modePercentage'
      )
    }

    if (player.tesseractAutoBuyerToggle === 1) {
      DOMCacheGetOrSet('tesseractautobuytoggle').textContent = i18next.t(
        'runes.talismans.autoBuyOn'
      )
      DOMCacheGetOrSet('tesseractautobuytoggle').style.border = '2px solid green'
    }
    if (player.tesseractAutoBuyerToggle === 2) {
      DOMCacheGetOrSet('tesseractautobuytoggle').textContent = i18next.t(
        'runes.talismans.autoBuyOff'
      )
      DOMCacheGetOrSet('tesseractautobuytoggle').style.border = '2px solid red'
    }

    if (player.autoOpenCubes) {
      DOMCacheGetOrSet('openCubes').textContent = i18next.t('wowCubes.autoOn', {
        percent: format(player.openCubes, 0)
      })
      DOMCacheGetOrSet('openCubes').style.border = '1px solid green'
      DOMCacheGetOrSet('cubeOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openCubes').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openCubes').style.border = '1px solid red'
      DOMCacheGetOrSet('cubeOpensInput').style.border = '1px solid red'
    }
    if (player.autoOpenTesseracts) {
      DOMCacheGetOrSet('openTesseracts').textContent = i18next.t(
        'wowCubes.autoOn',
        {
          percent: format(player.openTesseracts, 0)
        }
      )
      DOMCacheGetOrSet('openTesseracts').style.border = '1px solid green'
      DOMCacheGetOrSet('tesseractsOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openTesseracts').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openTesseracts').style.border = '1px solid red'
      DOMCacheGetOrSet('tesseractsOpensInput').style.border = '1px solid red'
    }
    if (player.autoOpenHypercubes) {
      DOMCacheGetOrSet('openHypercubes').textContent = i18next.t(
        'wowCubes.autoOn',
        {
          percent: format(player.openHypercubes, 0)
        }
      )
      DOMCacheGetOrSet('openHypercubes').style.border = '1px solid green'
      DOMCacheGetOrSet('hypercubesOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openHypercubes').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openHypercubes').style.border = '1px solid red'
      DOMCacheGetOrSet('hypercubesOpensInput').style.border = '1px solid red'
    }
    if (player.autoOpenPlatonicsCubes) {
      DOMCacheGetOrSet('openPlatonicCube').textContent = i18next.t(
        'wowCubes.autoOn',
        {
          percent: format(player.openPlatonicsCubes, 0)
        }
      )
      DOMCacheGetOrSet('openPlatonicCube').style.border = '1px solid green'
      DOMCacheGetOrSet('platonicCubeOpensInput').style.border = '1px solid green'
    } else {
      DOMCacheGetOrSet('openPlatonicCube').textContent = i18next.t('wowCubes.autoOff')
      DOMCacheGetOrSet('openPlatonicCube').style.border = '1px solid red'
      DOMCacheGetOrSet('platonicCubeOpensInput').style.border = '1px solid red'
    }

    if (player.autoResearchToggle) {
      DOMCacheGetOrSet('toggleautoresearch').textContent = i18next.t(
        'researches.automaticOn'
      )
    } else {
      DOMCacheGetOrSet('toggleautoresearch').textContent = i18next.t(
        'researches.automaticOff'
      )
    }
    if (player.autoResearchMode === 'cheapest') {
      DOMCacheGetOrSet('toggleautoresearchmode').textContent = i18next.t(
        'researches.autoModeCheapest'
      )
    } else {
      DOMCacheGetOrSet('toggleautoresearchmode').textContent = i18next.t(
        'researches.autoModeManual'
      )
    }
    if (player.autoSacrificeToggle) {
      DOMCacheGetOrSet('toggleautosacrifice').textContent = i18next.t(
        'runes.blessings.autoRuneOn'
      )
      DOMCacheGetOrSet('toggleautosacrifice').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('toggleautosacrifice').textContent = i18next.t(
        'runes.blessings.autoRuneOff'
      )
      DOMCacheGetOrSet('toggleautosacrifice').style.border = '2px solid red'
    }
    if (player.autoBuyFragment) {
      DOMCacheGetOrSet('toggleautoBuyFragments').textContent = i18next.t(
        'runes.talismans.autoBuyOn'
      )
      DOMCacheGetOrSet('toggleautoBuyFragments').style.border = '2px solid white'
      DOMCacheGetOrSet('toggleautoBuyFragments').style.color = 'orange'
    } else {
      DOMCacheGetOrSet('toggleautoBuyFragments').textContent = i18next.t(
        'runes.talismans.autoBuyOff'
      )
      DOMCacheGetOrSet('toggleautoBuyFragments').style.border = '2px solid orange'
      DOMCacheGetOrSet('toggleautoBuyFragments').style.color = 'white'
    }
    if (player.autoFortifyToggle) {
      DOMCacheGetOrSet('toggleautofortify').textContent = i18next.t(
        'runes.autoFortifyOn'
      )
      DOMCacheGetOrSet('toggleautofortify').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('toggleautofortify').textContent = i18next.t(
        'runes.autoFortifyOff'
      )
      DOMCacheGetOrSet('toggleautofortify').style.border = '2px solid red'
    }
    if (player.autoEnhanceToggle) {
      DOMCacheGetOrSet('toggleautoenhance').textContent = i18next.t(
        'runes.autoEnhanceOn'
      )
      DOMCacheGetOrSet('toggleautoenhance').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('toggleautoenhance').textContent = i18next.t(
        'runes.autoEnhanceOff'
      )
      DOMCacheGetOrSet('toggleautoenhance').style.border = '2px solid red'
    }
    player.saveOfferingToggle = false // Lint doesnt like it being inside if
    DOMCacheGetOrSet('saveOffToggle').textContent = i18next.t(
      'toggles.saveOfferingsOff'
    )
    DOMCacheGetOrSet('saveOffToggle').style.color = 'white'
    if (player.autoAscend) {
      DOMCacheGetOrSet('ascensionAutoEnable').textContent = i18next.t(
        'corruptions.autoAscend.on'
      )
      DOMCacheGetOrSet('ascensionAutoEnable').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('ascensionAutoEnable').textContent = i18next.t(
        'corruptions.autoAscend.off'
      )
      DOMCacheGetOrSet('ascensionAutoEnable').style.border = '2px solid red'
    }
    if (player.shopConfirmationToggle) {
      DOMCacheGetOrSet('toggleConfirmShop').textContent = i18next.t(
        'shop.shopConfirmationOn'
      )
    } else {
      DOMCacheGetOrSet('toggleConfirmShop').textContent = i18next.t(
        'shop.shopConfirmationOff'
      )
    }
    switch (player.shopBuyMaxToggle) {
      case false:
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buy1')
        break
      case 'TEN':
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buy10')
        break
      case true:
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buyMax')
        break
      case 'ANY':
        DOMCacheGetOrSet('toggleBuyMaxShopText').textContent = i18next.t('shop.buyAny')
    }
    if (player.shopHideToggle) {
      DOMCacheGetOrSet('toggleHideShop').textContent = i18next.t('shop.hideMaxedOn')
    } else {
      DOMCacheGetOrSet('toggleHideShop').textContent = i18next.t('shop.hideMaxedOff')
    }
    if (player.researchBuyMaxToggle) {
      DOMCacheGetOrSet('toggleresearchbuy').textContent = i18next.t(
        'researches.upgradeMax'
      )
    } else {
      DOMCacheGetOrSet('toggleresearchbuy').textContent = i18next.t(
        'researches.upgradeOne'
      )
    }
    if (player.cubeUpgradesBuyMaxToggle) {
      DOMCacheGetOrSet('toggleCubeBuy').textContent = i18next.t(
        'toggles.upgradeMaxIfPossible'
      )
    } else {
      DOMCacheGetOrSet('toggleCubeBuy').textContent = i18next.t(
        'toggles.upgradeOneLevelWow'
      )
    }
    autoCubeUpgradesToggle(false)
    autoPlatonicUpgradesToggle(false)

    for (let i = 1; i <= 2; i++) {
      toggleAntMaxBuy()
      toggleAntAutoSacrifice(0)
      toggleAntAutoSacrifice(1)
    }

    for (let i = 1; i <= 2; i++) {
      toggleAutoAscend(0)
      toggleAutoAscend(1)
    }

    DOMCacheGetOrSet(
      'historyTogglePerSecondButton'
    ).textContent = `Per second: ${player.historyShowPerSecond ? 'ON' : 'OFF'}`
    DOMCacheGetOrSet('historyTogglePerSecondButton').style.borderColor = player.historyShowPerSecond ? 'green' : 'red'

    // If auto research is enabled and runing; Make sure there is something to try to research if possible
    if (
      player.autoResearchToggle
      && autoResearchEnabled()
      && player.autoResearchMode === 'cheapest'
    ) {
      player.autoResearch = G.researchOrderByCost[player.roombaResearchIndex]
    }

    player.autoResearch = Math.min(200, player.autoResearch)
    player.autoSacrifice = Math.min(5, player.autoSacrifice)

    if (player.researches[61] === 0) {
      DOMCacheGetOrSet('automaticobtainium').textContent = i18next.t(
        'main.buyResearch3x11'
      )
    }

    if (player.autoSacrificeToggle && player.autoSacrifice > 0.5) {
      DOMCacheGetOrSet(`rune${player.autoSacrifice}`).style.backgroundColor = 'orange'
    }

    if (player.autoWarpCheck) {
      DOMCacheGetOrSet('warpAuto').textContent = i18next.t(
        'general.autoOnColon'
      )
      DOMCacheGetOrSet('warpAuto').style.border = '2px solid green'
    } else {
      DOMCacheGetOrSet('warpAuto').textContent = i18next.t(
        'general.autoOffColon'
      )
      DOMCacheGetOrSet('warpAuto').style.border = '2px solid red'
    }
    DOMCacheGetOrSet('autoHepteractPercentage').textContent = i18next.t(
      'wowCubes.hepteractForge.autoSetting',
      {
        x: `${player.hepteractAutoCraftPercentage}`
      }
    )
    DOMCacheGetOrSet('hepteractToQuarkTradeAuto').textContent = player.overfluxOrbsAutoBuy
      ? i18next.t('general.autoOnColon')
      : i18next.t('general.autoOffColon')
    DOMCacheGetOrSet('hepteractToQuarkTradeAuto').style.border = `2px solid ${
      player.overfluxOrbsAutoBuy ? 'green' : 'red'
    }`
    toggleAutoBuyOrbs(true, true)

    DOMCacheGetOrSet('blueberryToggleMode').innerHTML = player.blueberryLoadoutMode === 'saveTree'
      ? i18next.t('ambrosia.loadouts.save')
      : i18next.t('ambrosia.loadouts.load')

    toggleTalismanBuy(player.buyTalismanShardPercent)
    updateTalismanInventory()
    calculateObtainium()
    calculateAnts()
    calculateRuneLevels()
    resetHistoryRenderAllTables()
    updateSingularityAchievements()
    updateSingularityGlobalPerks()
  }

  updateAchievementBG()
  if (player.currentChallenge.reincarnation) {
    resetrepeat('reincarnationChallenge')
  } else if (player.currentChallenge.transcension) {
    resetrepeat('transcensionChallenge')
  }

  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes()
  const s = d.getSeconds()
  player.dayTimer = 60 * 60 * 24 - (s + 60 * m + 60 * 60 * h)
}

// dprint-ignore
const FormatList = [
  "",
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qt",
  "Sx",
  "Sp",
  "Oc",
  "No",
  "Dc",
  "UDc",
  "DDc",
  "TDc",
  "QaDc",
  "QtDc",
  "SxDc",
  "SpDc",
  "OcDc",
  "NoDc",
  "Vg",
  "UVg",
  "DVg",
  "TVg",
  "QaVg",
  "QtVg",
  "SxVg",
  "SpVg",
  "OcVg",
  "NoVg",
  "Tg",
  "UTg",
  "DTg",
  "TTg",
  "QaTg",
  "QtTg",
  "SxTg",
  "SpTg",
  "OTg",
  "NTg",
  "Qd",
  "UQd",
  "DQd",
  "TQd",
  "QaQd",
  "QtQd",
  "SxQd",
  "SpQd",
  "OcQd",
  "NoQd",
  "Qi",
  "UQi",
  "DQi",
  "TQi",
  "QaQi",
  "QtQi",
  "SxQi",
  "SpQi",
  "OQi",
  "NQi",
  "Se",
  "USe",
  "DSe",
  "TSe",
  "QaSe",
  "QtSe",
  "SxSe",
  "SpSe",
  "OcSe",
  "NoSe",
  "St",
  "USt",
  "DSt",
  "TSt",
  "QaSt",
  "QtSt",
  "SxSt",
  "SpSt",
  "OcSt",
  "NoSt",
  "Ocg",
  "UOcg",
  "DOcg",
  "TOcg",
  "QaOcg",
  "QtOcg",
  "SxOcg",
  "SpOcg",
  "OcOcg",
  "NoOcg",
  "Nono",
  "UNono",
  "DNono",
  "TNono",
  "QaNono",
  "QtNono",
  "SxNono",
  "SpNono",
  "OcNono",
  "NoNono",
  "Ce",
];

// Bad browsers (like Safari) only recently implemented this.
const supportsFormatToParts = typeof Intl.NumberFormat.prototype.formatToParts === 'function'

// In some browsers, this will return an empty-1 length array (?), causing a "TypeError: Cannot read property 'value' of undefined"
// if we destructure it... To reproduce: ` const [ { value } ] = []; `
// https://discord.com/channels/677271830838640680/730669616870981674/830218436201283584
const IntlFormatter = !supportsFormatToParts
  ? null
  : Intl.NumberFormat()
    .formatToParts(1000.1)
    .filter((part) => part.type === 'decimal' || part.type === 'group')

// gets the system number delimiter and decimal values, defaults to en-US
const [{ value: group }, { value: dec }] = IntlFormatter?.length !== 2
  ? [{ value: ',' }, { value: '.' }]
  : IntlFormatter

// Number.toLocaleString opts for 2 decimal places
const locOpts = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

const padEvery = (str: string, places = 3) => {
  let step = 1
  let newStr = ''
  const strParts = str.split('.')
  // don't take any decimal places
  for (let i = strParts[0].length - 1; i >= 0; i--) {
    // pad every [places] places if we aren't at the beginning of the string
    if (step++ === places && i !== 0) {
      step = 1
      newStr = group + str[i] + newStr
    } else {
      newStr = str[i] + newStr
    }
  }
  // re-add decimal places
  if (typeof strParts[1] !== 'undefined') {
    newStr += dec + strParts[1]
  } // see https://www.npmjs.com/package/flatstr

  ;(newStr as unknown as number) | 0
  return newStr
}

/**
 * This function displays the numbers such as 1,234 or 1.00e1234 or 1.00e1.234M.
 * @param input value to format
 * @param accuracy
 * how many decimal points that are to be displayed (Values <10 if !long, <1000 if long).
 * only works up to 305 (308 - 3), however it only worked up to ~14 due to rounding errors regardless
 * @param long dictates whether or not a given number displays as scientific at 1,000,000. This auto defaults to short if input >= 1e7
 */
export const format = (
  input:
    | Decimal
    | number
    | { [Symbol.toPrimitive]: unknown }
    | null
    | undefined,
  accuracy = 0,
  long = false,
  truncate = true,
  fractional = false
): string => {
  if (input == null) {
    return '0 [null]'
  }

  if (typeof input === 'object' && Symbol.toPrimitive in input) {
    input = Number(input)
  }

  if (
    // invalid parameter
    (!(input instanceof Decimal) && typeof input !== 'number')
    || isNaN(input as number)
  ) {
    return isNaN(input as number) ? '0 [NaN]' : '0 [und.]'
  } else if (
    // this case handles numbers less than 1e-6 and greater than 0
    typeof input === 'number'
    && player.notation === 'Default'
    && input < (!fractional ? 1e-3 : 1e-15) // arbitrary number, don't change 1e-3
    && input > 0 // don't handle negative numbers, probably could be removed
  ) {
    return input.toExponential(accuracy)
  }

  let power!: number
  let mantissa!: number
  if (isDecimal(input)) {
    // Gets power and mantissa if input is of type decimal
    power = input.e
    mantissa = input.mantissa
  } else if (typeof input === 'number') {
    if (input === 0) {
      return '0'
    }

    // Gets power and mantissa if input is of type number and isn't 0
    power = Math.floor(Math.log10(Math.abs(input)))
    mantissa = input / Math.pow(10, power)
  }

  // This prevents numbers from jittering between two different powers by rounding errors
  if (mantissa > 9.9999999) {
    mantissa = 1
    ;++power
  }

  if (mantissa < 1 && mantissa > 0.9999999) {
    mantissa = 1
  }

  // If the power is less than 15 it's effectively 0

  if (power < -15) {
    return '0'
  }
  if (player.notation === 'Pure Engineering') {
    const powerOver = power % 3 < 0 ? 3 + (power % 3) : power % 3
    power = power - powerOver
    mantissa = mantissa * Math.pow(10, powerOver)
  }
  if (
    player.notation === 'Pure Scientific'
    || player.notation === 'Pure Engineering'
  ) {
    if (power >= 1e6) {
      if (!Number.isFinite(power)) {
        return 'Infinity'
      }
      return `E${format(power, 3)}`
    }
    accuracy = power === 2 && accuracy > 2 ? 2 : accuracy
    if (power >= 6 || power < 0) {
      accuracy = accuracy < 2 ? 2 : accuracy
      // Makes the power group 3 with commas
      const mantissaLook = (
        Math.floor(mantissa * Math.pow(10, accuracy)) / Math.pow(10, accuracy)
      ).toLocaleString(undefined, locOpts)
      const powerLook = padEvery(power.toString())
      // returns format (1.23e456,789)
      return `${mantissaLook}e${powerLook}`
    }
    mantissa = mantissa * Math.pow(10, power)
    if (mantissa - Math.floor(mantissa) > 0.9999999) {
      mantissa = Math.ceil(mantissa)
    }
    const mantissaLook = (
      Math.floor(mantissa * Math.pow(10, accuracy)) / Math.pow(10, accuracy)
    ).toLocaleString(undefined, {
      minimumFractionDigits: accuracy,
      maximumFractionDigits: accuracy
    })
    return `${mantissaLook}`
  }
  // If the power is negative, then we will want to address that separately.
  if (power < 0 && !isDecimal(input) && fractional) {
    if (power <= -15) {
      return `${format(mantissa, accuracy, long)} / ${
        Math.pow(
          10,
          -power - 15
        )
      }Qa`
    }
    if (power <= -12) {
      return `${format(mantissa, accuracy, long)} / ${
        Math.pow(
          10,
          -power - 12
        )
      }T`
    }
    if (power <= -9) {
      return `${format(mantissa, accuracy, long)} / ${
        Math.pow(
          10,
          -power - 9
        )
      }B`
    }
    if (power <= -6) {
      return `${format(mantissa, accuracy, long)} / ${
        Math.pow(
          10,
          -power - 6
        )
      }M`
    }
    if (power <= -3) {
      return `${format(mantissa, accuracy, long)} / ${
        Math.pow(
          10,
          -power - 3
        )
      }K`
    }
    return `${format(mantissa, accuracy, long)} / ${Math.pow(10, -power)}`
  } else if (power < 6 || (long && power < 7)) {
    // If the power is less than 6 or format long and less than 7 use standard formatting (1,234,567)
    // Gets the standard representation of the number, safe as power is guaranteed to be > -12 and < 7
    let standard = mantissa * Math.pow(10, power)
    let standardString: string
    // Rounds up if the number experiences a rounding error
    if (standard - Math.floor(standard) > 0.9999999) {
      standard = Math.ceil(standard)
    }
    // If the power is less than 1 or format long and less than 3 apply toFixed(accuracy) to get decimal places
    if ((power < 2 || (long && power < 3)) && accuracy > 0) {
      standardString = standard.toFixed(
        power === 2 && accuracy > 2 ? 2 : accuracy
      )
    } else {
      // If it doesn't fit those criteria drop the decimal places
      standard = Math.floor(standard)
      standardString = standard.toString()
    }

    // Split it on the decimal place
    return padEvery(standardString)
  } else if (power < 1e6) {
    // If the power is less than 1e6 then apply standard scientific notation
    // Makes mantissa be rounded down to 2 decimal places
    const mantissaLook = (Math.floor(mantissa * 100) / 100).toLocaleString(
      undefined,
      locOpts
    )
    // Makes the power group 3 with commas
    const powerLook = padEvery(power.toString())
    // returns format (1.23e456,789)
    return `${mantissaLook}e${powerLook}`
  } else if (power >= 1e6) {
    if (!Number.isFinite(power)) {
      return 'Infinity'
    }

    // if the power is greater than 1e6 apply notation scientific notation
    // Makes mantissa be rounded down to 2 decimal places
    const mantissaLook = testing && truncate
      ? ''
      : (Math.floor(mantissa * 100) / 100).toLocaleString(undefined, locOpts)

    // Drops the power down to 4 digits total but never greater than 1000 in increments that equate to notations, (1234000 -> 1.234) ( 12340000 -> 12.34) (123400000 -> 123.4) (1234000000 -> 1.234)
    const powerDigits = Math.ceil(Math.log10(power))
    let powerFront = ((powerDigits - 1) % 3) + 1
    let powerLook = power / Math.pow(10, powerDigits - powerFront)
    if (powerLook === 1000) {
      powerLook = 1
      powerFront = 1
    }

    const powerLookF = powerLook.toLocaleString(undefined, {
      minimumFractionDigits: 4 - powerFront,
      maximumFractionDigits: 4 - powerFront
    })
    const powerLodge = Math.floor(Math.log10(power) / 3)
    // Return relevant notations alongside the "look" power based on what the power actually is
    if (typeof FormatList[powerLodge] === 'string') {
      return `${mantissaLook}e${powerLookF}${FormatList[powerLodge]}`
    }

    // If it doesn't fit a notation then default to mantissa e power
    return `e${power.toExponential(2)}`
  } else {
    return '0 [und.]'
  }
}

export const formatTimeShort = (
  seconds: number,
  msMaxSeconds?: number
): string => {
  return (
    (seconds >= 86400 ? `${format(Math.floor(seconds / 86400))}d` : '')
    + (seconds >= 3600 ? `${format(Math.floor(seconds / 3600) % 24)}h` : '')
    + (seconds >= 60 ? `${format(Math.floor(seconds / 60) % 60)}m` : '')
    + (seconds >= 8640000
      ? ''
      : `${
        format(Math.floor(seconds) % 60)
        + (msMaxSeconds && seconds < msMaxSeconds // Don't show seconds when you're over 100 days, like honestly
          ? `.${
            Math.floor((seconds % 1) * 1000)
              .toString()
              .padStart(3, '0')
          }`
          : '')
      }s`)
  )
}

export const updateAllTick = (): void => {
  let a = 0

  G.totalAccelerator = player.acceleratorBought
  G.costDivisor = 1

  if (player.upgrades[8] !== 0) {
    a += Math.floor(player.multiplierBought / 7)
  }
  if (player.upgrades[21] !== 0) {
    a += 5
  }
  if (player.upgrades[22] !== 0) {
    a += 4
  }
  if (player.upgrades[23] !== 0) {
    a += 3
  }
  if (player.upgrades[24] !== 0) {
    a += 2
  }
  if (player.upgrades[25] !== 0) {
    a += 1
  }
  if (player.upgrades[27] !== 0) {
    a += Math.min(250, Math.floor(Decimal.log(player.coins.add(1), 1e3)))
      + Math.min(
        1750,
        Math.max(0, Math.floor(Decimal.log(player.coins.add(1), 1e15)) - 50)
      )
  }
  if (player.upgrades[29] !== 0) {
    a += Math.floor(
      Math.min(
        2000,
        (player.firstOwnedCoin
          + player.secondOwnedCoin
          + player.thirdOwnedCoin
          + player.fourthOwnedCoin
          + player.fifthOwnedCoin)
          / 80
      )
    )
  }
  if (player.upgrades[32] !== 0) {
    a += Math.min(
      500,
      Math.floor(Decimal.log(player.prestigePoints.add(1), 1e25))
    )
  }
  if (player.upgrades[45] !== 0) {
    a += Math.min(
      2500,
      Math.floor(Decimal.log(player.transcendShards.add(1), 10))
    )
  }
  if (player.achievements[5] !== 0) {
    a += Math.floor(player.firstOwnedCoin / 500)
  }
  if (player.achievements[12] !== 0) {
    a += Math.floor(player.secondOwnedCoin / 500)
  }
  if (player.achievements[19] !== 0) {
    a += Math.floor(player.thirdOwnedCoin / 500)
  }
  if (player.achievements[26] !== 0) {
    a += Math.floor(player.fourthOwnedCoin / 500)
  }
  if (player.achievements[33] !== 0) {
    a += Math.floor(player.fifthOwnedCoin / 500)
  }
  if (player.achievements[60] !== 0) {
    a += 2
  }
  if (player.achievements[61] !== 0) {
    a += 2
  }
  if (player.achievements[62] !== 0) {
    a += 2
  }

  a += 5 * CalcECC('transcend', player.challengecompletions[2])
  G.freeUpgradeAccelerator = a
  a += G.totalAcceleratorBoost
    * (4
      + 2 * player.researches[18]
      + 2 * player.researches[19]
      + 3 * player.researches[20]
      + G.cubeBonusMultiplier[1])
  if (player.unlocks.prestige) {
    a += Math.floor(Math.pow((G.rune1level * G.effectiveLevelMult) / 4, 1.25))
    a *= 1 + ((G.rune1level * 1) / 400) * G.effectiveLevelMult
  }

  calculateAcceleratorMultiplier()
  a *= G.acceleratorMultiplier
  a = Math.pow(
    a,
    Math.min(
      1,
      (1 + player.platonicUpgrades[6] / 30)
        * G.viscosityPower[player.usedCorruptions[2]]
    )
  )
  a += 2000 * hepteractEffective('accelerator')
  a *= G.challenge15Rewards.accelerator
  a *= 1 + (3 / 10000) * hepteractEffective('accelerator')
  a = Math.floor(Math.min(1e100, a))

  if (player.usedCorruptions[2] >= 15) {
    a = Math.pow(a, 0.2)
  }
  if (player.usedCorruptions[2] >= 16) {
    a = 1
  }

  G.freeAccelerator = a
  G.totalAccelerator += G.freeAccelerator

  G.tuSevenMulti = 1

  if (player.upgrades[46] > 0.5) {
    G.tuSevenMulti = 1.05
  }

  G.acceleratorPower = Math.pow(
    1.1
      + G.tuSevenMulti
        * (G.totalAcceleratorBoost / 100)
        * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20),
    1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7])
  )
  G.acceleratorPower += ((1 / 200)
    * Math.floor(CalcECC('transcend', player.challengecompletions[2]) / 2)
    * 100)
    / 100
  for (let i = 1; i <= 5; i++) {
    if (player.achievements[7 * i - 4] > 0) {
      G.acceleratorPower += 0.0005 * i
    }
  }

  // No MA and Sadistic will always overwrite Transcend challenges starting in v2.0.0
  if (
    player.currentChallenge.reincarnation !== 7
    && player.currentChallenge.reincarnation !== 10
  ) {
    if (player.currentChallenge.transcension === 1) {
      G.acceleratorPower *= 25 / (50 + player.challengecompletions[1])
      G.acceleratorPower += 0.55
      G.acceleratorPower = Math.max(1, G.acceleratorPower)
    }
    if (player.currentChallenge.transcension === 2) {
      G.acceleratorPower = 1
    }
    if (player.currentChallenge.transcension === 3) {
      G.acceleratorPower = 1.05
        + 2
          * G.tuSevenMulti
          * (G.totalAcceleratorBoost / 300)
          * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20)
    }
  }
  G.acceleratorPower = Math.min(1e300, G.acceleratorPower)
  if (player.currentChallenge.reincarnation === 7) {
    G.acceleratorPower = 1
  }
  if (player.currentChallenge.reincarnation === 10) {
    G.acceleratorPower = 1
  }

  if (player.currentChallenge.transcension !== 1) {
    G.acceleratorEffect = Decimal.pow(G.acceleratorPower, G.totalAccelerator)
  }

  if (player.currentChallenge.transcension === 1) {
    G.acceleratorEffect = Decimal.pow(
      G.acceleratorPower,
      G.totalAccelerator + G.totalMultiplier
    )
  }
  G.acceleratorEffectDisplay = new Decimal(G.acceleratorPower * 100 - 100)
  if (player.currentChallenge.reincarnation === 10) {
    G.acceleratorEffect = new Decimal(1)
  }
  G.generatorPower = new Decimal(1)
  if (
    player.upgrades[11] > 0.5
    && player.currentChallenge.reincarnation !== 7
  ) {
    G.generatorPower = Decimal.pow(1.02, G.totalAccelerator)
  }
}

export const updateAllMultiplier = (): void => {
  let a = 0

  if (player.upgrades[7] > 0) {
    a += Math.min(
      4,
      1 + Math.floor(Decimal.log(player.fifthOwnedCoin + 1, 10))
    )
  }
  if (player.upgrades[9] > 0) {
    a += Math.floor(player.acceleratorBought / 10)
  }
  if (player.upgrades[21] > 0) {
    a += 1
  }
  if (player.upgrades[22] > 0) {
    a += 1
  }
  if (player.upgrades[23] > 0) {
    a += 1
  }
  if (player.upgrades[24] > 0) {
    a += 1
  }
  if (player.upgrades[25] > 0) {
    a += 1
  }
  if (player.upgrades[28] > 0) {
    a += Math.min(
      1000,
      Math.floor(
        (player.firstOwnedCoin
          + player.secondOwnedCoin
          + player.thirdOwnedCoin
          + player.fourthOwnedCoin
          + player.fifthOwnedCoin)
          / 160
      )
    )
  }
  if (player.upgrades[30] > 0) {
    a += Math.min(75, Math.floor(Decimal.log(player.coins.add(1), 1e10)))
      + Math.min(925, Math.floor(Decimal.log(player.coins.add(1), 1e30)))
  }
  if (player.upgrades[33] > 0) {
    a += G.totalAcceleratorBoost
  }
  if (player.upgrades[49] > 0) {
    a += Math.min(
      50,
      Math.floor(Decimal.log(player.transcendPoints.add(1), 1e10))
    )
  }
  if (player.upgrades[68] > 0) {
    a += Math.min(2500, Math.floor((Decimal.log(G.taxdivisor, 10) * 1) / 1000))
  }
  if (player.challengecompletions[1] > 0) {
    a += 1
  }
  if (player.achievements[6] > 0.5) {
    a += Math.floor(player.firstOwnedCoin / 1000)
  }
  if (player.achievements[13] > 0.5) {
    a += Math.floor(player.secondOwnedCoin / 1000)
  }
  if (player.achievements[20] > 0.5) {
    a += Math.floor(player.thirdOwnedCoin / 1000)
  }
  if (player.achievements[27] > 0.5) {
    a += Math.floor(player.fourthOwnedCoin / 1000)
  }
  if (player.achievements[34] > 0.5) {
    a += Math.floor(player.fifthOwnedCoin / 1000)
  }
  if (player.achievements[57] > 0.5) {
    a += 1
  }
  if (player.achievements[58] > 0.5) {
    a += 1
  }
  if (player.achievements[59] > 0.5) {
    a += 1
  }
  a += 20
    * player.researches[94]
    * Math.floor(
      (G.rune1level
        + G.rune2level
        + G.rune3level
        + G.rune4level
        + G.rune5level)
        / 8
    )

  G.freeUpgradeMultiplier = Math.min(1e100, a)

  if (player.achievements[38] > 0.5) {
    a += (Math.floor(
      (Math.floor((G.rune2level / 10) * G.effectiveLevelMult)
        * Math.floor(1 + (G.rune2level / 10) * G.effectiveLevelMult))
        / 2
    )
      * 100)
      / 100
  }

  a *= 1 + player.achievements[57] / 100
  a *= 1 + player.achievements[58] / 100
  a *= 1 + player.achievements[59] / 100
  a *= Math.pow(
    1.01,
    player.upgrades[21]
      + player.upgrades[22]
      + player.upgrades[23]
      + player.upgrades[24]
      + player.upgrades[25]
  )
  a *= 1 + 0.03 * player.upgrades[34] + 0.02 * player.upgrades[35]
  a *= 1
    + (1 / 5)
      * player.researches[2]
      * (1 + (1 / 2) * CalcECC('ascension', player.challengecompletions[14]))
  a *= 1
    + (1 / 20) * player.researches[11]
    + (1 / 25) * player.researches[12]
    + (1 / 40) * player.researches[13]
    + (3 / 200) * player.researches[14]
    + (1 / 200) * player.researches[15]
  a *= 1 + (G.rune2level / 400) * G.effectiveLevelMult
  a *= 1 + (1 / 20) * player.researches[87]
  a *= 1 + (1 / 100) * player.researches[128]
  a *= 1 + (0.8 / 100) * player.researches[143]
  a *= 1 + (0.6 / 100) * player.researches[158]
  a *= 1 + (0.4 / 100) * player.researches[173]
  a *= 1 + (0.2 / 100) * player.researches[188]
  a *= 1 + (0.01 / 100) * player.researches[200]
  a *= 1 + (0.01 / 100) * player.cubeUpgrades[50]
  a *= calculateSigmoidExponential(
    40,
    (((player.antUpgrades[4]! + G.bonusant5) / 1000) * 40) / 39
  )
  a *= G.cubeBonusMultiplier[2]
  if (
    (player.currentChallenge.transcension !== 0
      || player.currentChallenge.reincarnation !== 0)
    && player.upgrades[50] > 0.5
  ) {
    a *= 1.25
  }
  a = Math.pow(
    a,
    Math.min(
      1,
      (1 + player.platonicUpgrades[6] / 30)
        * G.viscosityPower[player.usedCorruptions[2]]
    )
  )
  a += 1000 * hepteractEffective('multiplier')
  a *= G.challenge15Rewards.multiplier
  a *= 1 + (3 / 10000) * hepteractEffective('multiplier')
  a = Math.floor(Math.min(1e100, a))

  if (player.usedCorruptions[2] >= 15) {
    a = Math.pow(a, 0.2)
  }
  if (player.usedCorruptions[2] >= 16) {
    a = 1
  }

  G.freeMultiplier = a
  G.totalMultiplier = G.freeMultiplier + player.multiplierBought

  G.challengeOneLog = 3

  let b = 0
  let c = 0
  b += Decimal.log(player.transcendShards.add(1), 3)
  b *= 1 + (11 * player.researches[33]) / 100
  b *= 1 + (11 * player.researches[34]) / 100
  b *= 1 + (11 * player.researches[35]) / 100
  b *= 1 + player.researches[89] / 5
  b *= 1 + 10 * G.effectiveRuneBlessingPower[2]

  c += Math.floor(
    0.1 * b * CalcECC('transcend', player.challengecompletions[1])
  )
  c += CalcECC('transcend', player.challengecompletions[1]) * 10
  G.freeMultiplierBoost = c
  G.totalMultiplierBoost = Math.pow(
    Math.floor(b) + c,
    1 + CalcECC('reincarnation', player.challengecompletions[7]) * 0.04
  )

  let c7 = 1
  if (player.challengecompletions[7] > 0.5) {
    c7 = 1.25
  }

  G.multiplierPower = 2 + 0.005 * G.totalMultiplierBoost * c7

  // No MA and Sadistic will always override Transcend Challenges starting in v2.0.0
  if (
    player.currentChallenge.reincarnation !== 7
    && player.currentChallenge.reincarnation !== 10
  ) {
    if (player.currentChallenge.transcension === 1) {
      G.multiplierPower = 1
    }
    if (player.currentChallenge.transcension === 2) {
      G.multiplierPower = 1.25 + 0.0012 * (b + c) * c7
    }
  }
  G.multiplierPower = Math.min(1e300, G.multiplierPower)

  if (player.currentChallenge.reincarnation === 7) {
    G.multiplierPower = 1
  }
  if (player.currentChallenge.reincarnation === 10) {
    G.multiplierPower = 1
  }

  G.multiplierEffect = Decimal.pow(G.multiplierPower, G.totalMultiplier)
}

export const multipliers = (): void => {
  let s = new Decimal(1)
  let c = new Decimal(1)
  let crystalExponent = 1 / 3
  crystalExponent += Math.min(
    10
      + (0.05 * player.researches[129] * Math.log(player.commonFragments + 1))
        / Math.log(4)
      + ((20 * calculateCorruptionPoints()) / 400)
        * G.effectiveRuneSpiritPower[3],
    0.05 * player.crystalUpgrades[3]
  )
  crystalExponent += 0.04 * CalcECC('transcend', player.challengecompletions[3])
  crystalExponent += 0.08 * player.researches[28]
  crystalExponent += 0.08 * player.researches[29]
  crystalExponent += 0.04 * player.researches[30]
  crystalExponent += 8 * player.cubeUpgrades[17]
  G.prestigeMultiplier = Decimal.pow(
    player.prestigeShards,
    crystalExponent
  ).add(1)

  let c7 = 1
  if (player.currentChallenge.reincarnation === 7) {
    c7 = 0.05
  }
  if (player.currentChallenge.reincarnation === 8) {
    c7 = 0
  }

  G.buildingPower = 1
    + (1 - Math.pow(2, -1 / 160))
      * c7
      * Decimal.log(player.reincarnationShards.add(1), 10)
      * (1
        + (1 / 20) * player.researches[36]
        + (1 / 40) * player.researches[37]
        + (1 / 40) * player.researches[38])
    + (((c7 + 0.2) * 0.25) / 1.2)
      * CalcECC('reincarnation', player.challengecompletions[8])

  G.buildingPower = Math.pow(
    G.buildingPower,
    1 + player.cubeUpgrades[12] * 0.09
  )
  G.buildingPower = Math.pow(
    G.buildingPower,
    1 + player.cubeUpgrades[36] * 0.05
  )
  G.reincarnationMultiplier = Decimal.pow(G.buildingPower, G.totalCoinOwned)

  G.antMultiplier = Decimal.pow(
    Decimal.max(1, player.antPoints),
    calculateCrumbToCoinExp()
  )

  s = s.times(G.multiplierEffect)
  s = s.times(G.acceleratorEffect)
  s = s.times(G.prestigeMultiplier)
  s = s.times(G.reincarnationMultiplier)
  s = s.times(G.antMultiplier)
  // PLAT - check
  const first6CoinUp = new Decimal(G.totalCoinOwned + 1).times(
    Decimal.min(1e30, Decimal.pow(1.008, G.totalCoinOwned))
  )

  if (player.highestSingularityCount > 0) {
    s = s.times(
      Math.pow(player.goldenQuarks + 1, 1.5)
        * Math.pow(player.highestSingularityCount + 1, 2)
    )
  }
  if (player.upgrades[6] > 0.5) {
    s = s.times(first6CoinUp)
  }
  if (player.upgrades[12] > 0.5) {
    s = s.times(Decimal.min(1e4, Decimal.pow(1.01, player.prestigeCount)))
  }
  if (player.upgrades[20] > 0.5) {
    // PLAT - check
    s = s.times(Decimal.pow(G.totalCoinOwned / 4 + 1, 10))
  }
  if (player.upgrades[41] > 0.5) {
    s = s.times(
      Decimal.min(1e30, Decimal.pow(player.transcendPoints.add(1), 1 / 2))
    )
  }
  if (player.upgrades[43] > 0.5) {
    s = s.times(Decimal.min(1e30, Decimal.pow(1.01, player.transcendCount)))
  }
  if (player.upgrades[48] > 0.5) {
    s = s.times(
      Decimal.pow((G.totalMultiplier * G.totalAccelerator) / 1000 + 1, 8)
    )
  }
  if (player.currentChallenge.reincarnation === 6) {
    s = s.dividedBy(1e250)
  }
  if (player.currentChallenge.reincarnation === 7) {
    s = s.dividedBy('1e1250')
  }
  if (player.currentChallenge.reincarnation === 9) {
    s = s.dividedBy('1e2000000')
  }
  if (player.currentChallenge.reincarnation === 10) {
    s = s.dividedBy('1e12500000')
  }
  c = Decimal.pow(s, 1 + 0.001 * player.researches[17])
  let lol = Decimal.pow(c, 1 + 0.025 * player.upgrades[123])
  if (
    player.currentChallenge.ascension === 15
    && player.platonicUpgrades[5] > 0
  ) {
    lol = Decimal.pow(lol, 1.1)
  }
  if (
    player.currentChallenge.ascension === 15
    && player.platonicUpgrades[14] > 0
  ) {
    lol = Decimal.pow(
      lol,
      1
        + ((1 / 20)
            * player.usedCorruptions[9]
            * Decimal.log(player.coins.add(1), 10))
          / (1e7 + Decimal.log(player.coins.add(1), 10))
    )
  }
  if (
    player.currentChallenge.ascension === 15
    && player.platonicUpgrades[15] > 0
  ) {
    lol = Decimal.pow(lol, 1.1)
  }
  lol = Decimal.pow(lol, G.challenge15Rewards.coinExponent)
  G.globalCoinMultiplier = lol
  G.globalCoinMultiplier = Decimal.pow(
    G.globalCoinMultiplier,
    G.financialcollapsePower[player.usedCorruptions[9]]
  )

  G.coinOneMulti = new Decimal(1)
  if (player.upgrades[1] > 0.5) {
    G.coinOneMulti = G.coinOneMulti.times(first6CoinUp)
  }
  if (player.upgrades[10] > 0.5) {
    G.coinOneMulti = G.coinOneMulti.times(
      Decimal.pow(2, Math.min(50, player.secondOwnedCoin / 15))
    )
  }
  if (player.upgrades[56] > 0.5) {
    G.coinOneMulti = G.coinOneMulti.times('1e5000')
  }

  G.coinTwoMulti = new Decimal(1)
  if (player.upgrades[2] > 0.5) {
    G.coinTwoMulti = G.coinTwoMulti.times(first6CoinUp)
  }
  if (player.upgrades[13] > 0.5) {
    G.coinTwoMulti = G.coinTwoMulti.times(
      Decimal.min(
        1e50,
        Decimal.pow(
          player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1),
          4 / 3
        ).times(1e10)
      )
    )
  }
  if (player.upgrades[19] > 0.5) {
    G.coinTwoMulti = G.coinTwoMulti.times(
      Decimal.min(1e200, player.transcendPoints.times(1e30).add(1))
    )
  }
  if (player.upgrades[57] > 0.5) {
    G.coinTwoMulti = G.coinTwoMulti.times('1e7500')
  }

  G.coinThreeMulti = new Decimal(1)
  if (player.upgrades[3] > 0.5) {
    G.coinThreeMulti = G.coinThreeMulti.times(first6CoinUp)
  }
  if (player.upgrades[18] > 0.5) {
    G.coinThreeMulti = G.coinThreeMulti.times(
      Decimal.min(1e125, player.transcendShards.add(1))
    )
  }
  if (player.upgrades[58] > 0.5) {
    G.coinThreeMulti = G.coinThreeMulti.times('1e15000')
  }

  G.coinFourMulti = new Decimal(1)
  if (player.upgrades[4] > 0.5) {
    G.coinFourMulti = G.coinFourMulti.times(first6CoinUp)
  }
  if (player.upgrades[17] > 0.5) {
    G.coinFourMulti = G.coinFourMulti.times(1e100)
  }
  if (player.upgrades[59] > 0.5) {
    G.coinFourMulti = G.coinFourMulti.times('1e25000')
  }

  G.coinFiveMulti = new Decimal(1)
  if (player.upgrades[5] > 0.5) {
    G.coinFiveMulti = G.coinFiveMulti.times(first6CoinUp)
  }
  if (player.upgrades[60] > 0.5) {
    G.coinFiveMulti = G.coinFiveMulti.times('1e35000')
  }

  G.globalCrystalMultiplier = new Decimal(1)
  if (player.achievements[36] > 0.5) {
    G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(2)
  }
  if (player.achievements[37] > 0.5 && player.prestigePoints.gte(10)) {
    G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
      Decimal.log(player.prestigePoints.add(1), 10)
    )
  }
  if (player.achievements[44] > 0.5) {
    G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
      Decimal.pow((G.rune3level / 2) * G.effectiveLevelMult, 2)
        .times(Decimal.pow(2, (G.rune3level * G.effectiveLevelMult) / 2 - 8))
        .add(1)
    )
  }
  if (player.upgrades[36] > 0.5) {
    G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
      Decimal.min('1e5000', Decimal.pow(player.prestigePoints, 1 / 500))
    )
  }
  if (player.upgrades[63] > 0.5) {
    G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
      Decimal.min('1e6000', Decimal.pow(player.reincarnationPoints.add(1), 6))
    )
  }
  if (player.researches[39] > 0.5) {
    G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
      Decimal.pow(G.reincarnationMultiplier, 1 / 50)
    )
  }

  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.min(
      Decimal.pow(10, 50 + 2 * player.crystalUpgrades[0]),
      Decimal.pow(1.05, player.achievementPoints * player.crystalUpgrades[0])
    )
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.min(
      Decimal.pow(10, 100 + 5 * player.crystalUpgrades[1]),
      Decimal.pow(
        Decimal.log(player.coins.add(1), 10),
        player.crystalUpgrades[1] / 3
      )
    )
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.pow(
      1
        + Math.min(
          0.12
            + 0.88 * player.upgrades[122]
            + (0.001
                * player.researches[129]
                * Math.log(player.commonFragments + 1))
              / Math.log(4),
          0.001 * player.crystalUpgrades[2]
        ),
      player.firstOwnedDiamonds
        + player.secondOwnedDiamonds
        + player.thirdOwnedDiamonds
        + player.fourthOwnedDiamonds
        + player.fifthOwnedDiamonds
    )
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.pow(
      1.01,
      (player.challengecompletions[1]
        + player.challengecompletions[2]
        + player.challengecompletions[3]
        + player.challengecompletions[4]
        + player.challengecompletions[5])
        * player.crystalUpgrades[4]
    )
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.pow(10, CalcECC('transcend', player.challengecompletions[5]))
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.pow(
      1e4,
      player.researches[5]
        * (1 + (1 / 2) * CalcECC('ascension', player.challengecompletions[14]))
    )
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.pow(2.5, player.researches[26])
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.pow(2.5, player.researches[27])
  )

  G.globalMythosMultiplier = new Decimal(1)

  if (player.upgrades[37] > 0.5) {
    G.globalMythosMultiplier = G.globalMythosMultiplier.times(
      Decimal.pow(Decimal.log(player.prestigePoints.add(10), 10), 2)
    )
  }
  if (player.upgrades[42] > 0.5) {
    G.globalMythosMultiplier = G.globalMythosMultiplier.times(
      Decimal.min(
        1e50,
        Decimal.pow(player.prestigePoints.add(1), 1 / 50)
          .dividedBy(2.5)
          .add(1)
      )
    )
  }
  if (player.upgrades[47] > 0.5) {
    G.globalMythosMultiplier = G.globalMythosMultiplier
      .times(Decimal.pow(1.05, player.achievementPoints))
      .times(player.achievementPoints + 1)
  }
  if (player.upgrades[51] > 0.5) {
    G.globalMythosMultiplier = G.globalMythosMultiplier.times(
      Decimal.pow(G.totalAcceleratorBoost, 2)
    )
  }
  if (player.upgrades[52] > 0.5) {
    G.globalMythosMultiplier = G.globalMythosMultiplier.times(
      Decimal.pow(G.globalMythosMultiplier, 0.025)
    )
  }
  if (player.upgrades[64] > 0.5) {
    G.globalMythosMultiplier = G.globalMythosMultiplier.times(
      Decimal.pow(player.reincarnationPoints.add(1), 2)
    )
  }
  if (player.researches[40] > 0.5) {
    G.globalMythosMultiplier = G.globalMythosMultiplier.times(
      Decimal.pow(G.reincarnationMultiplier, 1 / 250)
    )
  }
  G.grandmasterMultiplier = new Decimal(1)
  G.totalMythosOwned = player.firstOwnedMythos
    + player.secondOwnedMythos
    + player.thirdOwnedMythos
    + player.fourthOwnedMythos
    + player.fifthOwnedMythos

  G.mythosBuildingPower = 1 + CalcECC('transcend', player.challengecompletions[3]) / 200
  G.challengeThreeMultiplier = Decimal.pow(
    G.mythosBuildingPower,
    G.totalMythosOwned
  )

  G.grandmasterMultiplier = G.grandmasterMultiplier.times(
    G.challengeThreeMultiplier
  )

  G.mythosupgrade13 = new Decimal(1)
  G.mythosupgrade14 = new Decimal(1)
  G.mythosupgrade15 = new Decimal(1)
  if (player.upgrades[53] === 1) {
    G.mythosupgrade13 = G.mythosupgrade13.times(
      Decimal.min('1e1250', Decimal.pow(G.acceleratorEffect, 1 / 125))
    )
  }
  if (player.upgrades[54] === 1) {
    G.mythosupgrade14 = G.mythosupgrade14.times(
      Decimal.min('1e2000', Decimal.pow(G.multiplierEffect, 1 / 180))
    )
  }
  if (player.upgrades[55] === 1) {
    G.mythosupgrade15 = G.mythosupgrade15.times(
      Decimal.pow('1e1000', Math.min(1000, G.buildingPower - 1))
    )
  }

  G.globalConstantMult = new Decimal('1')
  G.globalConstantMult = G.globalConstantMult.times(
    Decimal.pow(
      1.05
        + 0.01 * player.achievements[270]
        + 0.001 * player.platonicUpgrades[18],
      player.constantUpgrades[1]
    )
  )
  G.globalConstantMult = G.globalConstantMult.times(
    Decimal.pow(
      1
        + 0.001
          * Math.min(
            100
              + 10 * player.achievements[270]
              + 10 * player.shopUpgrades.constantEX
              + 1000 * (G.challenge15Rewards.exponent - 1)
              + 3 * player.platonicUpgrades[18],
            player.constantUpgrades[2]
          ),
      ascendBuildingDR()
    )
  )
  G.globalConstantMult = G.globalConstantMult.times(
    1 + (2 / 100) * player.researches[139]
  )
  G.globalConstantMult = G.globalConstantMult.times(
    1 + (3 / 100) * player.researches[154]
  )
  G.globalConstantMult = G.globalConstantMult.times(
    1 + (4 / 100) * player.researches[169]
  )
  G.globalConstantMult = G.globalConstantMult.times(
    1 + (5 / 100) * player.researches[184]
  )
  G.globalConstantMult = G.globalConstantMult.times(
    1 + (10 / 100) * player.researches[199]
  )
  G.globalConstantMult = G.globalConstantMult.times(
    G.challenge15Rewards.constantBonus
  )
  if (player.platonicUpgrades[5] > 0) {
    G.globalConstantMult = G.globalConstantMult.times(2)
  }
  if (player.platonicUpgrades[10] > 0) {
    G.globalConstantMult = G.globalConstantMult.times(10)
  }
  if (player.platonicUpgrades[15] > 0) {
    G.globalConstantMult = G.globalConstantMult.times(1e250)
  }
  G.globalConstantMult = G.globalConstantMult.times(
    Decimal.pow(player.overfluxPowder + 1, 10 * player.platonicUpgrades[16])
  )
}

export const resourceGain = (dt: number): void => {
  calculateTotalCoinOwned()
  calculateTotalAcceleratorBoost()

  updateAllTick()
  updateAllMultiplier()
  multipliers()
  calculatetax()
  if (G.produceTotal.gte(0.001)) {
    const addcoin = Decimal.min(
      G.produceTotal.dividedBy(G.taxdivisor),
      Decimal.pow(10, G.maxexponent - Decimal.log(G.taxdivisorcheck, 10))
    ).times(dt / 0.025)
    player.coins = player.coins.add(addcoin)
    player.coinsThisPrestige = player.coinsThisPrestige.add(addcoin)
    player.coinsThisTranscension = player.coinsThisTranscension.add(addcoin)
    player.coinsThisReincarnation = player.coinsThisReincarnation.add(addcoin)
    player.coinsTotal = player.coinsTotal.add(addcoin)
  }

  resetCurrency()
  if (player.upgrades[93] === 1 && player.coinsThisPrestige.gte(1e16)) {
    player.prestigePoints = player.prestigePoints.add(
      Decimal.floor(G.prestigePointGain.dividedBy(4000).times(dt / 0.025))
    )
  }
  if (player.upgrades[100] === 1 && player.coinsThisTranscension.gte(1e100)) {
    player.transcendPoints = player.transcendPoints.add(
      Decimal.floor(G.transcendPointGain.dividedBy(4000).times(dt / 0.025))
    )
  }
  if (player.cubeUpgrades[28] > 0 && player.transcendShards.gte(1e300)) {
    player.reincarnationPoints = player.reincarnationPoints.add(
      Decimal.floor(G.reincarnationPointGain.dividedBy(4000).times(dt / 0.025))
    )
  }
  G.produceFirstDiamonds = player.firstGeneratedDiamonds
    .add(player.firstOwnedDiamonds)
    .times(player.firstProduceDiamonds)
    .times(G.globalCrystalMultiplier)
  G.produceSecondDiamonds = player.secondGeneratedDiamonds
    .add(player.secondOwnedDiamonds)
    .times(player.secondProduceDiamonds)
    .times(G.globalCrystalMultiplier)
  G.produceThirdDiamonds = player.thirdGeneratedDiamonds
    .add(player.thirdOwnedDiamonds)
    .times(player.thirdProduceDiamonds)
    .times(G.globalCrystalMultiplier)
  G.produceFourthDiamonds = player.fourthGeneratedDiamonds
    .add(player.fourthOwnedDiamonds)
    .times(player.fourthProduceDiamonds)
    .times(G.globalCrystalMultiplier)
  G.produceFifthDiamonds = player.fifthGeneratedDiamonds
    .add(player.fifthOwnedDiamonds)
    .times(player.fifthProduceDiamonds)
    .times(G.globalCrystalMultiplier)

  player.fourthGeneratedDiamonds = player.fourthGeneratedDiamonds.add(
    G.produceFifthDiamonds.times(dt / 0.025)
  )
  player.thirdGeneratedDiamonds = player.thirdGeneratedDiamonds.add(
    G.produceFourthDiamonds.times(dt / 0.025)
  )
  player.secondGeneratedDiamonds = player.secondGeneratedDiamonds.add(
    G.produceThirdDiamonds.times(dt / 0.025)
  )
  player.firstGeneratedDiamonds = player.firstGeneratedDiamonds.add(
    G.produceSecondDiamonds.times(dt / 0.025)
  )
  G.produceDiamonds = G.produceFirstDiamonds

  if (
    player.currentChallenge.transcension !== 3
    && player.currentChallenge.reincarnation !== 10
  ) {
    player.prestigeShards = player.prestigeShards.add(
      G.produceDiamonds.times(dt / 0.025)
    )
  }

  G.produceFifthMythos = player.fifthGeneratedMythos
    .add(player.fifthOwnedMythos)
    .times(player.fifthProduceMythos)
    .times(G.globalMythosMultiplier)
    .times(G.grandmasterMultiplier)
    .times(G.mythosupgrade15)
  G.produceFourthMythos = player.fourthGeneratedMythos
    .add(player.fourthOwnedMythos)
    .times(player.fourthProduceMythos)
    .times(G.globalMythosMultiplier)
  G.produceThirdMythos = player.thirdGeneratedMythos
    .add(player.thirdOwnedMythos)
    .times(player.thirdProduceMythos)
    .times(G.globalMythosMultiplier)
    .times(G.mythosupgrade14)
  G.produceSecondMythos = player.secondGeneratedMythos
    .add(player.secondOwnedMythos)
    .times(player.secondProduceMythos)
    .times(G.globalMythosMultiplier)
  G.produceFirstMythos = player.firstGeneratedMythos
    .add(player.firstOwnedMythos)
    .times(player.firstProduceMythos)
    .times(G.globalMythosMultiplier)
    .times(G.mythosupgrade13)
  player.fourthGeneratedMythos = player.fourthGeneratedMythos.add(
    G.produceFifthMythos.times(dt / 0.025)
  )
  player.thirdGeneratedMythos = player.thirdGeneratedMythos.add(
    G.produceFourthMythos.times(dt / 0.025)
  )
  player.secondGeneratedMythos = player.secondGeneratedMythos.add(
    G.produceThirdMythos.times(dt / 0.025)
  )
  player.firstGeneratedMythos = player.firstGeneratedMythos.add(
    G.produceSecondMythos.times(dt / 0.025)
  )

  G.produceMythos = new Decimal('0')
  G.produceMythos = player.firstGeneratedMythos
    .add(player.firstOwnedMythos)
    .times(player.firstProduceMythos)
    .times(G.globalMythosMultiplier)
    .times(G.mythosupgrade13)
  G.producePerSecondMythos = G.produceMythos.times(40)

  let pm = new Decimal('1')
  if (player.upgrades[67] > 0.5) {
    pm = pm.times(
      Decimal.pow(
        1.03,
        player.firstOwnedParticles
          + player.secondOwnedParticles
          + player.thirdOwnedParticles
          + player.fourthOwnedParticles
          + player.fifthOwnedParticles
      )
    )
  }
  G.produceFifthParticles = player.fifthGeneratedParticles
    .add(player.fifthOwnedParticles)
    .times(player.fifthProduceParticles)
  G.produceFourthParticles = player.fourthGeneratedParticles
    .add(player.fourthOwnedParticles)
    .times(player.fourthProduceParticles)
  G.produceThirdParticles = player.thirdGeneratedParticles
    .add(player.thirdOwnedParticles)
    .times(player.thirdProduceParticles)
  G.produceSecondParticles = player.secondGeneratedParticles
    .add(player.secondOwnedParticles)
    .times(player.secondProduceParticles)
  G.produceFirstParticles = player.firstGeneratedParticles
    .add(player.firstOwnedParticles)
    .times(player.firstProduceParticles)
    .times(pm)
  player.fourthGeneratedParticles = player.fourthGeneratedParticles.add(
    G.produceFifthParticles.times(dt / 0.025)
  )
  player.thirdGeneratedParticles = player.thirdGeneratedParticles.add(
    G.produceFourthParticles.times(dt / 0.025)
  )
  player.secondGeneratedParticles = player.secondGeneratedParticles.add(
    G.produceThirdParticles.times(dt / 0.025)
  )
  player.firstGeneratedParticles = player.firstGeneratedParticles.add(
    G.produceSecondParticles.times(dt / 0.025)
  )

  G.produceParticles = new Decimal('0')
  G.produceParticles = player.firstGeneratedParticles
    .add(player.firstOwnedParticles)
    .times(player.firstProduceParticles)
    .times(pm)
  G.producePerSecondParticles = G.produceParticles.times(40)

  if (
    player.currentChallenge.transcension !== 3
    && player.currentChallenge.reincarnation !== 10
  ) {
    player.transcendShards = player.transcendShards.add(
      G.produceMythos.times(dt / 0.025)
    )
  }
  if (player.currentChallenge.reincarnation !== 10) {
    player.reincarnationShards = player.reincarnationShards.add(
      G.produceParticles.times(dt / 0.025)
    )
  }

  createAnts(dt)
  for (let i = 1; i <= 5; i++) {
    G.ascendBuildingProduction[G.ordinals[(5 - i) as ZeroToFour]] = player[
      `ascendBuilding${(6 - i) as OneToFive}` as const
    ].generated
      .add(player[`ascendBuilding${(6 - i) as OneToFive}` as const].owned)
      .times(player[`ascendBuilding${i as OneToFive}` as const].multiplier)
      .times(G.globalConstantMult)

    if (i !== 5) {
      const fiveMinusI = (5 - i) as 1 | 2 | 3 | 4
      player[`ascendBuilding${fiveMinusI}` as const].generated = player[
        `ascendBuilding${fiveMinusI}` as const
      ].generated.add(
        G.ascendBuildingProduction[G.ordinals[fiveMinusI]].times(dt)
      )
    }
  }

  player.ascendShards = player.ascendShards.add(
    G.ascendBuildingProduction.first.times(dt)
  )

  if (player.ascensionCount > 0) {
    ascensionAchievementCheck(2)
  }

  if (
    player.researches[71] > 0.5
    && player.challengecompletions[1]
      < Math.min(
        player.highestchallengecompletions[1],
        25 + 5 * player.researches[66] + 925 * player.researches[105]
      )
    && player.coins.gte(
      Decimal.pow(
        10,
        1.25
          * G.challengeBaseRequirements[0]
          * Math.pow(1 + player.challengecompletions[1], 2)
      )
    )
  ) {
    player.challengecompletions[1] += 1
    challengeachievementcheck(1, true)
    updateChallengeLevel(1)
  }
  if (
    player.researches[72] > 0.5
    && player.challengecompletions[2]
      < Math.min(
        player.highestchallengecompletions[2],
        25 + 5 * player.researches[67] + 925 * player.researches[105]
      )
    && player.coins.gte(
      Decimal.pow(
        10,
        1.6
          * G.challengeBaseRequirements[1]
          * Math.pow(1 + player.challengecompletions[2], 2)
      )
    )
  ) {
    player.challengecompletions[2] += 1
    challengeachievementcheck(2, true)
    updateChallengeLevel(2)
  }
  if (
    player.researches[73] > 0.5
    && player.challengecompletions[3]
      < Math.min(
        player.highestchallengecompletions[3],
        25 + 5 * player.researches[68] + 925 * player.researches[105]
      )
    && player.coins.gte(
      Decimal.pow(
        10,
        1.7
          * G.challengeBaseRequirements[2]
          * Math.pow(1 + player.challengecompletions[3], 2)
      )
    )
  ) {
    player.challengecompletions[3] += 1
    challengeachievementcheck(3, true)
    updateChallengeLevel(3)
  }
  if (
    player.researches[74] > 0.5
    && player.challengecompletions[4]
      < Math.min(
        player.highestchallengecompletions[4],
        25 + 5 * player.researches[69] + 925 * player.researches[105]
      )
    && player.coins.gte(
      Decimal.pow(
        10,
        1.45
          * G.challengeBaseRequirements[3]
          * Math.pow(1 + player.challengecompletions[4], 2)
      )
    )
  ) {
    player.challengecompletions[4] += 1
    challengeachievementcheck(4, true)
    updateChallengeLevel(4)
  }
  if (
    player.researches[75] > 0.5
    && player.challengecompletions[5]
      < Math.min(
        player.highestchallengecompletions[5],
        25 + 5 * player.researches[70] + 925 * player.researches[105]
      )
    && player.coins.gte(
      Decimal.pow(
        10,
        2
          * G.challengeBaseRequirements[4]
          * Math.pow(1 + player.challengecompletions[5], 2)
      )
    )
  ) {
    player.challengecompletions[5] += 1
    challengeachievementcheck(5, true)
    updateChallengeLevel(5)
  }

  const chal = player.currentChallenge.transcension
  const reinchal = player.currentChallenge.reincarnation
  const ascendchal = player.currentChallenge.ascension
  if (chal !== 0) {
    if (
      player.coinsThisTranscension.gte(
        challengeRequirement(chal, player.challengecompletions[chal], chal)
      )
    ) {
      void resetCheck('transcensionChallenge', false)
      G.autoChallengeTimerIncrement = 0
    }
  }
  if (reinchal < 9 && reinchal !== 0) {
    if (
      player.transcendShards.gte(
        challengeRequirement(
          reinchal,
          player.challengecompletions[reinchal],
          reinchal
        )
      )
    ) {
      void resetCheck('reincarnationChallenge', false)
      G.autoChallengeTimerIncrement = 0
    }
  }
  if (reinchal >= 9) {
    if (
      player.coins.gte(
        challengeRequirement(
          reinchal,
          player.challengecompletions[reinchal],
          reinchal
        )
      )
    ) {
      void resetCheck('reincarnationChallenge', false)
      G.autoChallengeTimerIncrement = 0
    }
  }
  if (ascendchal !== 0 && ascendchal < 15) {
    if (
      player.challengecompletions[10]
        >= (challengeRequirement(
          ascendchal,
          player.challengecompletions[ascendchal],
          ascendchal
        ) as number)
    ) {
      void resetCheck('ascensionChallenge', false)
      challengeachievementcheck(ascendchal, true)
    }
  }
  if (ascendchal === 15) {
    if (
      player.coins.gte(
        challengeRequirement(
          ascendchal,
          player.challengecompletions[ascendchal],
          ascendchal
        )
      )
    ) {
      void resetCheck('ascensionChallenge', false)
    }
  }
}

export const updateAntMultipliers = (): void => {
  // Update 2.5.0: Updated to have a base of 10 instead of 1x
  G.globalAntMult = new Decimal(10)
  // Update 2.9.0: Updated to give a 5x multiplier no matter what
  G.globalAntMult = G.globalAntMult.times(5)
  G.globalAntMult = G.globalAntMult.times(
    1
      + (1 / 2500)
        * Math.pow(
          G.rune5level
            * G.effectiveLevelMult
            * (1
              + (player.researches[84] / 200)
                * (1
                  + (1
                      * G.effectiveRuneSpiritPower[5]
                      * calculateCorruptionPoints())
                    / 400)),
          2
        )
  )
  if (player.upgrades[76] === 1) {
    G.globalAntMult = G.globalAntMult.times(5)
  }
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(
      1
        + player.upgrades[77] / 250
        + player.researches[96] / 5000
        + player.cubeUpgrades[65] / 250,
      player.firstOwnedAnts
        + player.secondOwnedAnts
        + player.thirdOwnedAnts
        + player.fourthOwnedAnts
        + player.fifthOwnedAnts
        + player.sixthOwnedAnts
        + player.seventhOwnedAnts
        + player.eighthOwnedAnts
    )
  )
  G.globalAntMult = G.globalAntMult.times(
    1
      + player.upgrades[78]
        * 0.005
        * Math.pow(Math.log10(player.maxofferings + 1), 2)
  )
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(
      1.11 + player.researches[101] / 1000 + player.researches[162] / 10000,
      player.antUpgrades[0]! + G.bonusant1
    )
  )
  G.globalAntMult = G.globalAntMult.times(
    antSacrificePointsToMultiplier(player.antSacrificePoints)
  )
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(
      Math.max(1, player.researchPoints),
      G.effectiveRuneBlessingPower[5]
    )
  )
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(1 + G.runeSum / 100, G.talisman6Power)
  )
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(1.1, CalcECC('reincarnation', player.challengecompletions[9]))
  )
  G.globalAntMult = G.globalAntMult.times(G.cubeBonusMultiplier[6])
  if (player.achievements[169] === 1) {
    G.globalAntMult = G.globalAntMult.times(
      Decimal.log(player.antPoints.add(10), 10)
    )
  }
  if (player.achievements[171] === 1) {
    G.globalAntMult = G.globalAntMult.times(1.16666)
  }
  if (player.achievements[172] === 1) {
    G.globalAntMult = G.globalAntMult.times(
      1
        + 2 * (1 - Math.pow(2, -Math.min(1, player.reincarnationcounter / 7200)))
    )
  }
  if (player.upgrades[39] === 1) {
    G.globalAntMult = G.globalAntMult.times(1.6)
  }
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(
      1 + 0.1 * Decimal.log(player.ascendShards.add(1), 10),
      player.constantUpgrades[5]
    )
  )
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(1e5, CalcECC('ascension', player.challengecompletions[11]))
  )
  if (player.researches[147] > 0) {
    G.globalAntMult = G.globalAntMult.times(
      Decimal.log(player.antPoints.add(10), 10)
    )
  }
  if (player.researches[177] > 0) {
    G.globalAntMult = G.globalAntMult.times(
      Decimal.pow(
        Decimal.log(player.antPoints.add(10), 10),
        player.researches[177]
      )
    )
  }

  if (player.currentChallenge.ascension === 12) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.5)
  }
  if (player.currentChallenge.ascension === 13) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.23)
  }
  if (player.currentChallenge.ascension === 14) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.2)
  }

  if (player.currentChallenge.ascension !== 15) {
    G.globalAntMult = Decimal.pow(
      G.globalAntMult,
      1 - (0.9 / 90) * Math.min(99, sumContents(player.usedCorruptions))
    )
  } else {
    // C15 used to have 9 corruptions set to 11, which above would provide a power of 0.01. Now it's hardcoded this way.
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.01)
  }

  G.globalAntMult = Decimal.pow(
    G.globalAntMult,
    G.extinctionMultiplier[player.usedCorruptions[7]]
  )
  G.globalAntMult = G.globalAntMult.times(G.challenge15Rewards.antSpeed)
  // V2.5.0: Moved ant shop upgrade as 'uncorruptable'
  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(1.2, player.shopUpgrades.antSpeed)
  )

  if (player.platonicUpgrades[12] > 0) {
    G.globalAntMult = G.globalAntMult.times(
      Decimal.pow(
        1 + (1 / 100) * player.platonicUpgrades[12],
        sumContents(player.highestchallengecompletions)
      )
    )
  }
  if (
    player.currentChallenge.ascension === 15
    && player.platonicUpgrades[10] > 0
  ) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 1.25)
  }
  if (player.achievements[274] > 0) {
    G.globalAntMult = G.globalAntMult.times(4.44)
  }

  if (player.usedCorruptions[7] >= 14) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.02)
  }
  if (player.usedCorruptions[7] >= 15) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.02)
  }
  if (player.usedCorruptions[7] >= 16) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.02)
  }

  if (player.octeractUpgrades.octeractStarter.getEffect().bonus) {
    G.globalAntMult = G.globalAntMult.times(100000)
  }

  if (player.highestSingularityCount >= 30) {
    G.globalAntMult = G.globalAntMult.times(1000)
  }

  if (player.highestSingularityCount >= 70) {
    G.globalAntMult = G.globalAntMult.times(1000)
  }

  if (player.highestSingularityCount >= 100) {
    G.globalAntMult = G.globalAntMult.times(1e6)
  }
}

export const createAnts = (dt: number): void => {
  updateAntMultipliers()
  G.antEightProduce = player.eighthGeneratedAnts
    .add(player.eighthOwnedAnts)
    .times(player.eighthProduceAnts)
    .times(G.globalAntMult)
  G.antSevenProduce = player.seventhGeneratedAnts
    .add(player.seventhOwnedAnts)
    .times(player.seventhProduceAnts)
    .times(G.globalAntMult)
  G.antSixProduce = player.sixthGeneratedAnts
    .add(player.sixthOwnedAnts)
    .times(player.sixthProduceAnts)
    .times(G.globalAntMult)
  G.antFiveProduce = player.fifthGeneratedAnts
    .add(player.fifthOwnedAnts)
    .times(player.fifthProduceAnts)
    .times(G.globalAntMult)
  G.antFourProduce = player.fourthGeneratedAnts
    .add(player.fourthOwnedAnts)
    .times(player.fourthProduceAnts)
    .times(G.globalAntMult)
  G.antThreeProduce = player.thirdGeneratedAnts
    .add(player.thirdOwnedAnts)
    .times(player.thirdProduceAnts)
    .times(G.globalAntMult)
  G.antTwoProduce = player.secondGeneratedAnts
    .add(player.secondOwnedAnts)
    .times(player.secondProduceAnts)
    .times(G.globalAntMult)
  G.antOneProduce = player.firstGeneratedAnts
    .add(player.firstOwnedAnts)
    .times(player.firstProduceAnts)
    .times(G.globalAntMult)
  player.seventhGeneratedAnts = player.seventhGeneratedAnts.add(
    G.antEightProduce.times(dt / 1)
  )
  player.sixthGeneratedAnts = player.sixthGeneratedAnts.add(
    G.antSevenProduce.times(dt / 1)
  )
  player.fifthGeneratedAnts = player.fifthGeneratedAnts.add(
    G.antSixProduce.times(dt / 1)
  )
  player.fourthGeneratedAnts = player.fourthGeneratedAnts.add(
    G.antFiveProduce.times(dt / 1)
  )
  player.thirdGeneratedAnts = player.thirdGeneratedAnts.add(
    G.antFourProduce.times(dt / 1)
  )
  player.secondGeneratedAnts = player.secondGeneratedAnts.add(
    G.antThreeProduce.times(dt / 1)
  )
  player.firstGeneratedAnts = player.firstGeneratedAnts.add(
    G.antTwoProduce.times(dt / 1)
  )

  player.antPoints = player.antPoints.add(G.antOneProduce.times(dt / 1))
}

export const resetCurrency = (): void => {
  let prestigePow = 0.5 + CalcECC('transcend', player.challengecompletions[5]) / 100
  let transcendPow = 0.03

  // Calculates the conversion exponent for resets (Challenges 5 and 10 reduce the exponent accordingly).
  if (player.currentChallenge.transcension === 5) {
    prestigePow = 0.01 / (1 + player.challengecompletions[5])
    transcendPow = 0.001
  }
  if (player.currentChallenge.reincarnation === 10) {
    prestigePow = 1e-4 / (1 + player.challengecompletions[10])
    transcendPow = 0.001
  }
  prestigePow *= G.deflationMultiplier[player.usedCorruptions[6]]
  // Prestige Point Formulae
  G.prestigePointGain = Decimal.floor(
    Decimal.pow(player.coinsThisPrestige.dividedBy(1e12), prestigePow)
  )
  if (
    player.upgrades[16] > 0.5
    && player.currentChallenge.transcension !== 5
    && player.currentChallenge.reincarnation !== 10
  ) {
    G.prestigePointGain = G.prestigePointGain.times(
      Decimal.min(
        Decimal.pow(10, 1e33),
        Decimal.pow(
          G.acceleratorEffect,
          (1 / 3) * G.deflationMultiplier[player.usedCorruptions[6]]
        )
      )
    )
  }

  // Transcend Point Formulae
  G.transcendPointGain = Decimal.floor(
    Decimal.pow(player.coinsThisTranscension.dividedBy(1e100), transcendPow)
  )
  if (
    player.upgrades[44] > 0.5
    && player.currentChallenge.transcension !== 5
    && player.currentChallenge.reincarnation !== 10
  ) {
    G.transcendPointGain = G.transcendPointGain.times(
      Decimal.min(1e6, Decimal.pow(1.01, player.transcendCount))
    )
  }

  // Reincarnation Point Formulae
  G.reincarnationPointGain = Decimal.floor(
    Decimal.pow(player.transcendShards.dividedBy(1e300), 0.01)
  )
  if (player.currentChallenge.reincarnation !== 0) {
    G.reincarnationPointGain = Decimal.pow(G.reincarnationPointGain, 0.01)
  }
  if (player.achievements[50] === 1) {
    G.reincarnationPointGain = G.reincarnationPointGain.times(2)
  }
  if (player.upgrades[65] > 0.5) {
    G.reincarnationPointGain = G.reincarnationPointGain.times(5)
  }
  if (player.currentChallenge.ascension === 12) {
    G.reincarnationPointGain = new Decimal('0')
  }
}

export const resetCheck = async (
  i: resetNames,
  manual = true,
  leaving = false
): Promise<void> => {
  if (i === 'prestige') {
    if (player.coinsThisPrestige.gte(1e16) || G.prestigePointGain.gte(100)) {
      if (manual) {
        void resetConfirmation('prestige')
      } else {
        resetachievementcheck(1)
        reset('prestige')
      }
    }
  }
  if (i === 'transcension') {
    if (
      (player.coinsThisTranscension.gte(1e100)
        || G.transcendPointGain.gte(0.5))
      && player.currentChallenge.transcension === 0
    ) {
      if (manual) {
        void resetConfirmation('transcend')
      }
      if (!manual) {
        resetachievementcheck(2)
        reset('transcension')
      }
    }
  }
  if (
    i === 'transcensionChallenge'
    && player.currentChallenge.transcension !== 0
  ) {
    const q = player.currentChallenge.transcension
    const maxCompletions = getMaxChallenges(q)
    const reqCheck = (comp: number) => player.coinsThisTranscension.gte(challengeRequirement(q, comp, q))
    if (
      reqCheck(player.challengecompletions[q])
      && player.challengecompletions[q] < maxCompletions
    ) {
      let maxInc = 1
      if (player.shopUpgrades.instantChallenge > 0) {
        maxInc = 10
      }
      if (player.shopUpgrades.instantChallenge2 > 0) {
        maxInc += player.highestSingularityCount
      }
      if (player.currentChallenge.ascension === 13) {
        maxInc = 1
      }
      let counter = 0
      let comp = player.challengecompletions[q]
      while (counter < maxInc) {
        if (reqCheck(comp) && comp < maxCompletions) {
          comp++
        }
        counter++
      }
      player.challengecompletions[q] = comp
      challengeDisplay(q, false)
      updateChallengeLevel(q)
    }
    if (
      player.challengecompletions[q] > player.highestchallengecompletions[q]
    ) {
      while (
        player.challengecompletions[q] > player.highestchallengecompletions[q]
      ) {
        player.highestchallengecompletions[q] += 1
        highestChallengeRewards(q, player.highestchallengecompletions[q])
      }
      calculateCubeBlessings()
    }
    challengeachievementcheck(q)
    if (
      !player.retrychallenges
      || manual
      || (player.autoChallengeRunning
        && player.challengecompletions[q] >= maxCompletions)
    ) {
      toggleAutoChallengeModeText('ENTER')
      player.currentChallenge.transcension = 0
      updateChallengeDisplay()
    }
    if (player.shopUpgrades.instantChallenge === 0 || leaving) {
      reset('transcensionChallenge', false, 'leaveChallenge')
      player.transcendCount -= 1
    }
  }

  if (i === 'reincarnation') {
    if (
      G.reincarnationPointGain.gt(0.5)
      && player.currentChallenge.transcension === 0
      && player.currentChallenge.reincarnation === 0
    ) {
      if (manual) {
        void resetConfirmation('reincarnate')
      }
      if (!manual) {
        resetachievementcheck(3)
        reset('reincarnation')
      }
    }
  }
  if (
    i === 'reincarnationChallenge'
    && player.currentChallenge.reincarnation !== 0
  ) {
    const q = player.currentChallenge.reincarnation
    const maxCompletions = getMaxChallenges(q)
    const reqCheck = (comp: number) => {
      if (q <= 8) {
        return player.transcendShards.gte(challengeRequirement(q, comp, q))
      } else {
        // challenges 9 and 10
        return player.coins.gte(challengeRequirement(q, comp, q))
      }
    }
    if (
      reqCheck(player.challengecompletions[q])
      && player.challengecompletions[q] < maxCompletions
    ) {
      let maxInc = 1
      if (player.shopUpgrades.instantChallenge > 0) {
        maxInc = 10
      }
      if (player.shopUpgrades.instantChallenge2 > 0) {
        maxInc += player.highestSingularityCount
      }
      if (player.currentChallenge.ascension === 13) {
        maxInc = 1
      }
      let counter = 0
      let comp = player.challengecompletions[q]
      while (counter < maxInc) {
        if (reqCheck(comp) && comp < maxCompletions) {
          comp++
        }
        counter++
      }
      player.challengecompletions[q] = comp
      challengeDisplay(q, false)
      updateChallengeLevel(q)
    }
    if (
      player.challengecompletions[q] > player.highestchallengecompletions[q]
    ) {
      while (
        player.challengecompletions[q] > player.highestchallengecompletions[q]
      ) {
        player.highestchallengecompletions[q] += 1
        highestChallengeRewards(q, player.highestchallengecompletions[q])
      }
      calculateHypercubeBlessings()
      calculateTesseractBlessings()
      calculateCubeBlessings()
    }
    challengeachievementcheck(q)
    if (
      !player.retrychallenges
      || manual
      || (player.autoChallengeRunning
        && player.challengecompletions[q] >= maxCompletions)
    ) {
      toggleAutoChallengeModeText('ENTER')
      player.currentChallenge.reincarnation = 0
      if (player.shopUpgrades.instantChallenge > 0) {
        for (let i = 1; i <= 5; i++) {
          player.challengecompletions[i] = player.highestchallengecompletions[i]
        }
      }
      updateChallengeDisplay()
      calculateRuneLevels()
      calculateAnts()
    }
    if (player.shopUpgrades.instantChallenge === 0 || leaving) {
      reset('reincarnationChallenge', false, 'leaveChallenge')
      player.reincarnationCount -= 1
    }
  }

  if (i === 'ascension') {
    if (
      player.achievements[141] > 0
      && (!player.toggles[31] || player.challengecompletions[10] > 0)
    ) {
      if (manual) {
        void resetConfirmation('ascend')
      }
    }
  }

  if (i === 'ascensionChallenge' && player.currentChallenge.ascension !== 0) {
    let conf = true
    if (manual) {
      if (player.challengecompletions[11] === 0 || player.toggles[31]) {
        conf = await Confirm(i18next.t('main.exitAscensionChallenge'))
      }
    }
    if (!conf) {
      return
    }
    const a = player.currentChallenge.ascension
    const maxCompletions = getMaxChallenges(a)

    if (a !== 0 && a < 15) {
      if (
        player.challengecompletions[10]
          >= (challengeRequirement(
            a,
            player.challengecompletions[a],
            a
          ) as number)
        && player.challengecompletions[a] < maxCompletions
      ) {
        player.challengecompletions[a] += 1
        updateChallengeLevel(a)
        challengeDisplay(a, false)
      }
      challengeachievementcheck(a, true)
    }
    if (a === 15) {
      const c15SM = challenge15ScoreMultiplier()
      if (
        player.coins.gte(
          challengeRequirement(a, player.challengecompletions[a], a)
        )
        && player.challengecompletions[a] < maxCompletions
      ) {
        player.challengecompletions[a] += 1
        updateChallengeLevel(a)
        challengeDisplay(a, false)
      }
      if (
        (manual || leaving || player.shopUpgrades.challenge15Auto > 0)
        && player.usedCorruptions.slice(2, 10).every((a) => a === 11)
      ) {
        if (
          player.coins.gte(Decimal.pow(10, player.challenge15Exponent / c15SM))
        ) {
          player.challenge15Exponent = Decimal.log(player.coins.add(1), 10) * c15SM
          c15RewardUpdate()
        }
      }
    }

    if (
      player.challengecompletions[a] > player.highestchallengecompletions[a]
    ) {
      player.highestchallengecompletions[a] += 1
      player.wowHypercubes.add(1)
      if (player.highestchallengecompletions[a] >= maxCompletions) {
        leaving = true
      }
    }

    if (!player.retrychallenges || manual || leaving) {
      if (
        !(
          !manual
          && (autoAscensionChallengeSweepUnlock()
            || !player.autoChallengeRunning) // If not autochallenge, don't reset
          && player.autoAscend
          && player.challengecompletions[11] > 0
          && player.cubeUpgrades[10] > 0
        )
      ) {
        player.currentChallenge.ascension = 0
        updateChallengeDisplay()
      }
    }

    if ((player.shopUpgrades.instantChallenge2 === 0 && a !== 15) || manual) {
      reset('ascensionChallenge', false)
    }
  }

  if (i === 'singularity') {
    if (player.runelevels[6] === 0) {
      return Alert(i18next.t('main.noAntiquity'))
    }

    const thankSing = 300

    if (player.insideSingularityChallenge) {
      return Alert(i18next.t('main.insideSingularityChallenge'))
    }

    if (player.singularityCount >= thankSing) {
      return Alert(i18next.t('main.gameBeat'))
    }

    let confirmed = false
    const nextSingularityNumber = player.singularityCount + 1 + getFastForwardTotalMultiplier()

    if (!player.toggles[33] && player.singularityCount > 0) {
      confirmed = await Confirm(
        i18next.t('main.singularityConfirm0', {
          x: format(nextSingularityNumber),
          y: format(calculateGoldenQuarkGain(), 2, true)
        })
      )
    } else {
      await Alert(
        i18next.t('main.singularityMessage1', {
          x: format(player.singularityCount)
        })
      )
      await Alert(i18next.t('main.singularityMessage2'))
      await Alert(i18next.t('main.singularityMessage3'))
      await Alert(
        i18next.t('main.singularityMessage4', {
          x: format(nextSingularityNumber),
          y: format(calculateGoldenQuarkGain(), 2, true),
          z: format(player.worlds.BONUS)
        })
      )
      await Alert(i18next.t('main.singularityMessage5'))

      confirmed = await Confirm(i18next.t('main.singularityConfirm1'))
      if (confirmed) {
        confirmed = await Confirm(i18next.t('main.singularityConfirm2'))
      }
      if (confirmed) {
        confirmed = await Confirm(i18next.t('main.singularityConfirm3'))
      }
    }

    if (!confirmed) {
      return Alert(i18next.t('main.singularityCancelled'))
    } else {
      await singularity()
      await saveSynergy()
      return Alert(
        i18next.t('main.welcomeToSingularity', {
          x: format(player.singularityCount)
        })
      )
    }
  }
}

export const resetConfirmation = async (i: string): Promise<void> => {
  if (i === 'prestige') {
    if (player.toggles[28]) {
      const r = await Confirm(i18next.t('main.prestigePrompt'))
      if (r) {
        resetachievementcheck(1)
        reset('prestige')
      }
    } else {
      resetachievementcheck(1)
      reset('prestige')
    }
  }
  if (i === 'transcend') {
    if (player.toggles[29]) {
      const z = await Confirm(i18next.t('main.transcendPrompt'))
      if (z) {
        resetachievementcheck(2)
        reset('transcension')
      }
    } else {
      resetachievementcheck(2)
      reset('transcension')
    }
  }
  if (i === 'reincarnate') {
    if (player.currentChallenge.ascension !== 12) {
      if (player.toggles[30]) {
        const z = await Confirm(i18next.t('main.reincarnatePrompt'))
        if (z) {
          resetachievementcheck(3)
          reset('reincarnation')
        }
      } else {
        resetachievementcheck(3)
        reset('reincarnation')
      }
    }
  }
  if (i === 'ascend') {
    const z = !player.toggles[31] || (await Confirm(i18next.t('main.ascendPrompt')))
    if (z) {
      reset('ascension')
    }
  }
}

export const updateEffectiveLevelMult = (): void => {
  G.effectiveLevelMult = 1
  G.effectiveLevelMult *= 1
    + (player.researches[4] / 10)
      * (1 + (1 / 2) * CalcECC('ascension', player.challengecompletions[14])) // Research 1x4
  G.effectiveLevelMult *= 1 + player.researches[21] / 100 // Research 2x6
  G.effectiveLevelMult *= 1 + player.researches[90] / 100 // Research 4x15
  G.effectiveLevelMult *= 1 + player.researches[131] / 200 // Research 6x6
  G.effectiveLevelMult *= 1 + ((player.researches[161] / 200) * 3) / 5 // Research 7x11
  G.effectiveLevelMult *= 1 + ((player.researches[176] / 200) * 2) / 5 // Research 8x1
  G.effectiveLevelMult *= 1 + ((player.researches[191] / 200) * 1) / 5 // Research 8x16
  G.effectiveLevelMult *= 1 + ((player.researches[146] / 200) * 4) / 5 // Research 6x21
  G.effectiveLevelMult *= 1
    + ((0.01 * Math.log(player.talismanShards + 1)) / Math.log(4))
      * Math.min(1, player.constantUpgrades[9])
  G.effectiveLevelMult *= G.challenge15Rewards.runeBonus
}

export const updateAll = (): void => {
  G.uFourteenMulti = new Decimal(1)
  G.uFifteenMulti = new Decimal(1)

  if (player.upgrades[14] > 0.5) {
    G.uFourteenMulti = Decimal.pow(1.15, G.freeAccelerator)
  }
  if (player.upgrades[15] > 0.5) {
    G.uFifteenMulti = Decimal.pow(1.15, G.freeAccelerator)
  }

  if (!player.unlocks.coinone && player.coins.gte(500)) {
    player.unlocks.coinone = true
    revealStuff()
  }
  if (!player.unlocks.cointwo && player.coins.gte(10000)) {
    player.unlocks.cointwo = true
    revealStuff()
  }
  if (!player.unlocks.cointhree && player.coins.gte(100000)) {
    player.unlocks.cointhree = true
    revealStuff()
  }
  if (!player.unlocks.coinfour && player.coins.gte(4e6)) {
    player.unlocks.coinfour = true
    revealStuff()
  }
  if (player.achievements[169] === 0 && player.antPoints.gte(3)) {
    achievementaward(169)
  }
  if (player.achievements[170] === 0 && player.antPoints.gte(1e5)) {
    achievementaward(170)
  }
  if (player.achievements[171] === 0 && player.antPoints.gte(666666666)) {
    achievementaward(171)
  }
  if (player.achievements[172] === 0 && player.antPoints.gte(1e20)) {
    achievementaward(172)
  }
  if (player.achievements[173] === 0 && player.antPoints.gte(1e40)) {
    achievementaward(173)
  }
  if (player.achievements[174] === 0 && player.antPoints.gte('1e500')) {
    achievementaward(174)
  }
  if (player.achievements[175] === 0 && player.antPoints.gte('1e2500')) {
    achievementaward(175)
  }

  if (player.researches[200] >= 1e5 && player.achievements[250] < 1) {
    achievementaward(250)
  }
  if (player.cubeUpgrades[50] >= 1e5 && player.achievements[251] < 1) {
    achievementaward(251)
  }

  // Autobuy "Upgrades" Tab
  autoUpgrades()

  // Autobuy "Building" Tab

  if (
    player.toggles[1]
    && player.upgrades[81] === 1
    && player.coins.gte(player.firstCostCoin)
  ) {
    buyMax(1, 'Coin')
  }
  if (
    player.toggles[2]
    && player.upgrades[82] === 1
    && player.coins.gte(player.secondCostCoin)
  ) {
    buyMax(2, 'Coin')
  }
  if (
    player.toggles[3]
    && player.upgrades[83] === 1
    && player.coins.gte(player.thirdCostCoin)
  ) {
    buyMax(3, 'Coin')
  }
  if (
    player.toggles[4]
    && player.upgrades[84] === 1
    && player.coins.gte(player.fourthCostCoin)
  ) {
    buyMax(4, 'Coin')
  }
  if (
    player.toggles[5]
    && player.upgrades[85] === 1
    && player.coins.gte(player.fifthCostCoin)
  ) {
    buyMax(5, 'Coin')
  }
  if (
    player.toggles[6]
    && player.upgrades[86] === 1
    && player.coins.gte(player.acceleratorCost)
  ) {
    buyAccelerator(true)
  }
  if (
    player.toggles[7]
    && player.upgrades[87] === 1
    && player.coins.gte(player.multiplierCost)
  ) {
    buyMultiplier(true)
  }
  if (
    player.toggles[8]
    && player.upgrades[88] === 1
    && player.prestigePoints.gte(player.acceleratorBoostCost)
  ) {
    boostAccelerator(true)
  }

  // Autobuy "Prestige" Tab

  if (
    player.toggles[10]
    && player.achievements[78] === 1
    && player.prestigePoints.gte(player.firstCostDiamonds)
  ) {
    buyMax(1, 'Diamonds')
  }
  if (
    player.toggles[11]
    && player.achievements[85] === 1
    && player.prestigePoints.gte(player.secondCostDiamonds)
  ) {
    buyMax(2, 'Diamonds')
  }
  if (
    player.toggles[12]
    && player.achievements[92] === 1
    && player.prestigePoints.gte(player.thirdCostDiamonds)
  ) {
    buyMax(3, 'Diamonds')
  }
  if (
    player.toggles[13]
    && player.achievements[99] === 1
    && player.prestigePoints.gte(player.fourthCostDiamonds)
  ) {
    buyMax(4, 'Diamonds')
  }
  if (
    player.toggles[14]
    && player.achievements[106] === 1
    && player.prestigePoints.gte(player.fifthCostDiamonds)
  ) {
    buyMax(5, 'Diamonds')
  }

  updateEffectiveLevelMult() // update before prism rune, fixes c15 bug

  let c = 0
  c += (Math.floor((G.rune3level / 16) * G.effectiveLevelMult) * 100) / 100
  if (
    player.upgrades[73] > 0.5
    && player.currentChallenge.reincarnation !== 0
  ) {
    c += 10
  }
  if (
    player.achievements[79] > 0.5
    && player.prestigeShards.gte(
      Decimal.pow(
        10,
        G.crystalUpgradesCost[0]
          + G.crystalUpgradeCostIncrement[0]
            * Math.floor(Math.pow(player.crystalUpgrades[0] - 0.5 - c, 2) / 2)
      )
    )
  ) {
    buyCrystalUpgrades(1, true)
  }
  if (
    player.achievements[86] > 0.5
    && player.prestigeShards.gte(
      Decimal.pow(
        10,
        G.crystalUpgradesCost[1]
          + G.crystalUpgradeCostIncrement[1]
            * Math.floor(Math.pow(player.crystalUpgrades[1] - 0.5 - c, 2) / 2)
      )
    )
  ) {
    buyCrystalUpgrades(2, true)
  }
  if (
    player.achievements[93] > 0.5
    && player.prestigeShards.gte(
      Decimal.pow(
        10,
        G.crystalUpgradesCost[2]
          + G.crystalUpgradeCostIncrement[2]
            * Math.floor(Math.pow(player.crystalUpgrades[2] - 0.5 - c, 2) / 2)
      )
    )
  ) {
    buyCrystalUpgrades(3, true)
  }
  if (
    player.achievements[100] > 0.5
    && player.prestigeShards.gte(
      Decimal.pow(
        10,
        G.crystalUpgradesCost[3]
          + G.crystalUpgradeCostIncrement[3]
            * Math.floor(Math.pow(player.crystalUpgrades[3] - 0.5 - c, 2) / 2)
      )
    )
  ) {
    buyCrystalUpgrades(4, true)
  }
  if (
    player.achievements[107] > 0.5
    && player.prestigeShards.gte(
      Decimal.pow(
        10,
        G.crystalUpgradesCost[4]
          + G.crystalUpgradeCostIncrement[4]
            * Math.floor(Math.pow(player.crystalUpgrades[4] - 0.5 - c, 2) / 2)
      )
    )
  ) {
    buyCrystalUpgrades(5, true)
  }

  // Autobuy "Transcension" Tab

  if (
    player.toggles[16]
    && player.upgrades[94] === 1
    && player.transcendPoints.gte(player.firstCostMythos)
  ) {
    buyMax(1, 'Mythos')
  }
  if (
    player.toggles[17]
    && player.upgrades[95] === 1
    && player.transcendPoints.gte(player.secondCostMythos)
  ) {
    buyMax(2, 'Mythos')
  }
  if (
    player.toggles[18]
    && player.upgrades[96] === 1
    && player.transcendPoints.gte(player.thirdCostMythos)
  ) {
    buyMax(3, 'Mythos')
  }
  if (
    player.toggles[19]
    && player.upgrades[97] === 1
    && player.transcendPoints.gte(player.fourthCostMythos)
  ) {
    buyMax(4, 'Mythos')
  }
  if (
    player.toggles[20]
    && player.upgrades[98] === 1
    && player.transcendPoints.gte(player.fifthCostMythos)
  ) {
    buyMax(5, 'Mythos')
  }

  // Autobuy "Reincarnation" Tab

  if (
    player.toggles[22]
    && player.cubeUpgrades[7] === 1
    && player.reincarnationPoints.gte(player.firstCostParticles)
  ) {
    buyParticleBuilding(1, true)
  }
  if (
    player.toggles[23]
    && player.cubeUpgrades[7] === 1
    && player.reincarnationPoints.gte(player.secondCostParticles)
  ) {
    buyParticleBuilding(2, true)
  }
  if (
    player.toggles[24]
    && player.cubeUpgrades[7] === 1
    && player.reincarnationPoints.gte(player.thirdCostParticles)
  ) {
    buyParticleBuilding(3, true)
  }
  if (
    player.toggles[25]
    && player.cubeUpgrades[7] === 1
    && player.reincarnationPoints.gte(player.fourthCostParticles)
  ) {
    buyParticleBuilding(4, true)
  }
  if (
    player.toggles[26]
    && player.cubeUpgrades[7] === 1
    && player.reincarnationPoints.gte(player.fifthCostParticles)
  ) {
    buyParticleBuilding(5, true)
  }

  // Autobuy "ascension" tab
  if (player.researches[175] > 0) {
    for (let i = 1; i <= 10; i++) {
      if (player.ascendShards.gte(getConstUpgradeMetadata(i).pop()!)) {
        buyConstantUpgrades(i, true)
      }
    }
  }

  // Autobuy tesseract buildings (Mode: AMOUNT)
  if (
    player.researches[190] > 0
    && player.tesseractAutoBuyerToggle === 1
    && player.resettoggle4 < 2
  ) {
    const ownedBuildings: TesseractBuildings = [null, null, null, null, null]
    for (let i = 1; i <= 5; i++) {
      if (player.autoTesseracts[i]) {
        ownedBuildings[i - 1] = player[`ascendBuilding${i as OneToFive}` as const].owned
      }
    }
    const budget = Number(player.wowTesseracts) - player.tesseractAutoBuyerAmount
    const buyToBuildings = calculateTessBuildingsInBudget(
      ownedBuildings,
      budget
    )
    // Prioritise buying buildings from highest tier to lowest,
    // in case there are any off-by-ones or floating point errors.
    for (let i = 5; i >= 1; i--) {
      const buyFrom = ownedBuildings[i - 1]
      const buyTo = buyToBuildings[i - 1]
      if (buyFrom !== null && buyTo !== null && buyTo !== buyFrom) {
        buyTesseractBuilding(i as OneToFive, buyTo - buyFrom)
      }
    }
  }

  // Talismans
  if (player.researches[130] > 0 || player.researches[135] > 0) {
    const talismansUnlocked = [
      player.achievements[119] > 0,
      player.achievements[126] > 0,
      player.achievements[133] > 0,
      player.achievements[140] > 0,
      player.achievements[147] > 0,
      player.antUpgrades[11]! > 0 || player.ascensionCount > 0,
      player.shopUpgrades.shopTalisman > 0
    ]
    let upgradedTalisman = false

    // First, we need to enhance all of the talismans. Then, we can fortify all of the talismans.
    // If we were to do this in one loop, the players resources would be drained on individual expensive levels
    // of early talismans before buying important enhances for the later ones. This results in drastically
    // reduced overall gains when talisman resources are scarce.
    if (player.autoEnhanceToggle && player.researches[135] > 0) {
      for (let i = 0; i < talismansUnlocked.length; ++i) {
        if (talismansUnlocked[i] && player.talismanRarity[i] < 6) {
          upgradedTalisman = buyTalismanEnhance(i, true) || upgradedTalisman
        }
      }
    }

    if (player.autoFortifyToggle && player.researches[130] > 0) {
      for (let i = 0; i < talismansUnlocked.length; ++i) {
        const maxTalismanLevel = calculateMaxTalismanLevel(i)
        if (
          talismansUnlocked[i]
          && player.talismanLevels[i] < maxTalismanLevel
        ) {
          upgradedTalisman = buyTalismanLevels(i, true) || upgradedTalisman
        }
      }
    }

    // Recalculate talisman-related upgrades and display on success
    if (upgradedTalisman) {
      updateTalismanInventory()
      calculateRuneLevels()
    }
  }

  // Generation
  if (player.upgrades[101] > 0.5) {
    player.fourthGeneratedCoin = player.fourthGeneratedCoin.add(
      player.fifthGeneratedCoin
        .add(player.fifthOwnedCoin)
        .times(G.uFifteenMulti)
        .times(G.generatorPower)
    )
  }
  if (player.upgrades[102] > 0.5) {
    player.thirdGeneratedCoin = player.thirdGeneratedCoin.add(
      player.fourthGeneratedCoin
        .add(player.fourthOwnedCoin)
        .times(G.uFourteenMulti)
        .times(G.generatorPower)
    )
  }
  if (player.upgrades[103] > 0.5) {
    player.secondGeneratedCoin = player.secondGeneratedCoin.add(
      player.thirdGeneratedCoin
        .add(player.thirdOwnedCoin)
        .times(G.generatorPower)
    )
  }
  if (player.upgrades[104] > 0.5) {
    player.firstGeneratedCoin = player.firstGeneratedCoin.add(
      player.secondGeneratedCoin
        .add(player.secondOwnedCoin)
        .times(G.generatorPower)
    )
  }
  if (player.upgrades[105] > 0.5) {
    player.fifthGeneratedCoin = player.fifthGeneratedCoin.add(
      player.firstOwnedCoin
    )
  }
  let p = 1
  p += (1 / 100)
    * (player.achievements[71]
      + player.achievements[72]
      + player.achievements[73]
      + player.achievements[74]
      + player.achievements[75]
      + player.achievements[76]
      + player.achievements[77])

  let a = 0
  if (player.upgrades[106] > 0.5) {
    a += 0.1
  }
  if (player.upgrades[107] > 0.5) {
    a += 0.15
  }
  if (player.upgrades[108] > 0.5) {
    a += 0.25
  }
  if (player.upgrades[109] > 0.5) {
    a += 0.25
  }
  if (player.upgrades[110] > 0.5) {
    a += 0.25
  }
  a *= p

  let b = 0
  if (player.upgrades[111] > 0.5) {
    b += 0.08
  }
  if (player.upgrades[112] > 0.5) {
    b += 0.08
  }
  if (player.upgrades[113] > 0.5) {
    b += 0.08
  }
  if (player.upgrades[114] > 0.5) {
    b += 0.08
  }
  if (player.upgrades[115] > 0.5) {
    b += 0.08
  }
  b *= p

  c = 0
  if (player.upgrades[116] > 0.5) {
    c += 0.05
  }
  if (player.upgrades[117] > 0.5) {
    c += 0.05
  }
  if (player.upgrades[118] > 0.5) {
    c += 0.05
  }
  if (player.upgrades[119] > 0.5) {
    c += 0.05
  }
  if (player.upgrades[120] > 0.5) {
    c += 0.05
  }
  c *= p

  if (a !== 0) {
    player.fifthGeneratedCoin = player.fifthGeneratedCoin.add(
      Decimal.pow(
        player.firstGeneratedDiamonds.add(player.firstOwnedDiamonds).add(1),
        a
      )
    )
  }
  if (b !== 0) {
    player.fifthGeneratedDiamonds = player.fifthGeneratedDiamonds.add(
      Decimal.pow(
        player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1),
        b
      )
    )
  }
  if (c !== 0) {
    player.fifthGeneratedMythos = player.fifthGeneratedMythos.add(
      Decimal.pow(
        player.firstGeneratedParticles.add(player.firstOwnedParticles).add(1),
        c
      )
    )
  }

  if (player.runeshards > player.maxofferings) {
    player.maxofferings = player.runeshards
  }
  if (player.researchPoints > player.maxobtainium) {
    player.maxobtainium = player.researchPoints
  }

  if (isNaN(player.runeshards)) {
    player.runeshards = 0
  }
  if (player.runeshards > 1e300) {
    player.runeshards = 1e300
  }
  if (isNaN(player.researchPoints)) {
    player.researchPoints = 0
  }
  if (player.researchPoints > 1e300) {
    player.researchPoints = 1e300
  }

  G.optimalOfferingTimer = 600
    + 30 * player.researches[85]
    + 0.4 * G.rune5level
    + 120 * player.shopUpgrades.offeringEX
  G.optimalObtainiumTimer = 3600 + 120 * player.shopUpgrades.obtainiumEX
  autoBuyAnts()

  if (
    player.autoAscend
    && player.challengecompletions[11] > 0
    && player.cubeUpgrades[10] > 0
    && player.currentChallenge.reincarnation !== 10
  ) {
    let ascension = false
    if (
      player.autoAscendMode === 'c10Completions'
      && player.challengecompletions[10] >= Math.max(1, player.autoAscendThreshold)
    ) {
      ascension = true
    }
    if (
      player.autoAscendMode === 'realAscensionTime'
      && player.ascensionCounterRealReal
        >= Math.max(0.1, player.autoAscendThreshold)
    ) {
      ascension = true
    }
    if (ascension && player.challengecompletions[10] > 0) {
      // Auto Ascension and Auto Challenge Sweep enables rotation of the Ascension Challenge
      if (
        autoAscensionChallengeSweepUnlock()
        && player.currentChallenge.ascension !== 0
        && player.retrychallenges
        && player.researches[150] === 1
        && player.autoChallengeRunning
      ) {
        let nextChallenge = getNextChallenge(
          player.currentChallenge.ascension + 1,
          false,
          11,
          15
        )
        if (
          nextChallenge <= 15
          && player.currentChallenge.ascension !== nextChallenge
        ) {
          void resetCheck('ascensionChallenge', false, true)
          player.currentChallenge.ascension = nextChallenge
          reset('ascensionChallenge', false)
        } else {
          nextChallenge = getNextChallenge(
            player.currentChallenge.ascension + 1,
            true,
            11,
            15
          )
          void resetCheck('ascensionChallenge', false, true)
          player.currentChallenge.ascension = nextChallenge <= 15 ? nextChallenge : 0
          reset('ascensionChallenge', false)
        }
      } else {
        if (player.currentChallenge.ascension !== 0) {
          void resetCheck('ascensionChallenge', false, true)
          reset('ascensionChallenge', false)
        } else {
          reset('ascension', false)
        }
      }
    }
  }

  let metaData = null
  if (player.researches[175] > 0) {
    for (let i = 1; i <= 10; i++) {
      metaData = getConstUpgradeMetadata(i)
      if (player.ascendShards.gte(metaData[1])) {
        buyConstantUpgrades(i, true)
      }
    }
  }

  const reductionValue = getReductionValue()
  if (reductionValue !== G.prevReductionValue) {
    G.prevReductionValue = reductionValue
    const resources = ['Coin', 'Diamonds', 'Mythos'] as const

    for (let res = 0; res < resources.length; ++res) {
      const resource = resources[res]
      for (let ord = 0; ord < 5; ++ord) {
        const num = G.ordinals[ord as ZeroToFour]
        player[`${num}Cost${resource}` as const] = getCost(
          (ord + 1) as OneToFive,
          resource,
          player[`${num}Owned${resource}` as const] + 1,
          reductionValue
        )
      }
    }

    for (let i = 0; i <= 4; i++) {
      const particleOriginalCost = [1, 1e2, 1e4, 1e8, 1e16]
      const num = G.ordinals[i as ZeroToFour]
      const buyTo = player[`${num}OwnedParticles` as const] + 1
      player[`${num}CostParticles` as const] = new Decimal(
        Decimal.pow(2, buyTo - 1).times(
          Decimal.pow(
            1.001,
            (Math.max(0, buyTo - 325000) * Math.max(0, buyTo - 325000 + 1)) / 2
          )
        )
      ).times(particleOriginalCost[i])
    }
  }

  // Challenge 15 autoupdate
  if (
    player.shopUpgrades.challenge15Auto > 0
    && player.currentChallenge.ascension === 15
    && player.usedCorruptions.slice(2, 10).every((a) => a === 11)
  ) {
    const c15SM = challenge15ScoreMultiplier()
    if (player.coins.gte(Decimal.pow(10, player.challenge15Exponent / c15SM))) {
      player.challenge15Exponent = Decimal.log(player.coins.add(1), 10) * c15SM
      c15RewardUpdate()
    }
  }
}

export const fastUpdates = (): void => {
  updateAll()
  htmlInserts()
}

export const slowUpdates = (): void => {
  buttoncolorchange()
  buildingAchievementCheck()
}

export const constantIntervals = (): void => {
  setInterval(saveSynergy, 5000)
  setInterval(slowUpdates, 200)
  setInterval(fastUpdates, 50)

  if (!G.timeWarp) {
    exitOffline()
  }
}

let lastUpdate = 0

export const createTimer = (): void => {
  lastUpdate = performance.now()
  setInterval(tick, 5)
}

const dt = 5
const filterStrength = 20
let deltaMean = 0

const loadingDate = new Date()
const loadingBasePerfTick = performance.now()

// performance.now() doesn't always reset on reload, so we capture a "base value"
// to keep things stable
// The returned time is pinned to when the page itself was loaded to remain
// resilient against changed system clocks
export const getTimePinnedToLoadDate = () => {
  return loadingDate.getTime() + (performance.now() - loadingBasePerfTick)
}

const tick = () => {
  const now = performance.now()
  let delta = now - lastUpdate
  // compute pseudo-average delta cf. https://stackoverflow.com/a/5111475/343834
  deltaMean += (delta - deltaMean) / filterStrength
  let dtEffective: number
  while (delta > 5) {
    // tack will compute dtEffective milliseconds of game time
    dtEffective = dt
    // If the mean lag (deltaMean) is more than a whole frame (16ms), compensate by computing deltaMean - dt ms, up to 1 hour
    dtEffective += deltaMean > 16 ? Math.min(3600 * 1000, deltaMean - dt) : 0
    // compute at max delta ms to avoid negative delta
    dtEffective = Math.min(delta, dtEffective)
    // run tack and record timings
    tack(dtEffective / 1000)
    lastUpdate += dtEffective
    delta -= dtEffective
  }
}

const tack = (dt: number) => {
  if (!G.timeWarp) {
    // Adds Resources (coins, ants, etc)
    const timeMult = calculateTimeAcceleration().mult
    resourceGain(dt * timeMult)
    // Adds time (in milliseconds) to all reset functions, and quarks timer.
    addTimers('prestige', dt)
    addTimers('transcension', dt)
    addTimers('reincarnation', dt)
    addTimers('ascension', dt)
    addTimers('quarks', dt)
    addTimers('goldenQuarks', dt)
    addTimers('octeracts', dt)
    addTimers('singularity', dt)
    addTimers('autoPotion', dt)
    addTimers('ambrosia', dt)

    // Triggers automatic rune sacrifice (adds milliseconds to payload timer)
    if (player.shopUpgrades.offeringAuto > 0 && player.autoSacrificeToggle) {
      automaticTools('runeSacrifice', dt)
    }

    // Triggers automatic ant sacrifice (adds milliseonds to payload timers)
    if (player.achievements[173] === 1) {
      automaticTools('antSacrifice', dt)
    }

    /*Triggers automatic obtainium gain if research [2x11] is unlocked,
        Otherwise it just calculates obtainium multiplier values. */
    if (player.researches[61] === 1) {
      automaticTools('addObtainium', dt)
    } else {
      calculateObtainium()
    }

    // Automatically tries and buys researches lol
    if (
      player.autoResearchToggle
      && player.autoResearch > 0
      && player.autoResearch <= maxRoombaResearchIndex(player)
      && (autoResearchEnabled() || player.autoResearchMode === 'manual')
    ) {
      // buyResearch() probably shouldn't even be called if player.autoResearch exceeds the highest unlocked research
      let counter = 0
      const maxCount = 1 + player.challengecompletions[14]
      while (counter < maxCount) {
        if (player.autoResearch > 0) {
          const linGrowth = player.autoResearch === 200 ? 0.01 : 0
          if (!buyResearch(player.autoResearch, true, linGrowth)) {
            break
          }
        } else {
          break
        }
        counter++
      }
    }
  }

  // Adds an offering every 2 seconds
  if (player.highestchallengecompletions[3] > 0) {
    automaticTools('addOfferings', dt / 2)
  }

  // Adds an offering every 1/(cube upgrade 1x2) seconds. It shares a timer with the one above.
  if (player.cubeUpgrades[2] > 0) {
    automaticTools('addOfferings', dt * player.cubeUpgrades[2])
  }

  runChallengeSweep(dt)

  // Check for automatic resets
  // Auto Prestige. === 1 indicates amount, === 2 indicates time.
  if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
    if (
      player.toggles[15]
      && player.achievements[43] === 1
      && G.prestigePointGain.gte(
        player.prestigePoints.times(Decimal.pow(10, player.prestigeamount))
      )
      && player.coinsThisPrestige.gte(1e16)
    ) {
      resetachievementcheck(1)
      reset('prestige', true)
    }
  }
  if (player.resettoggle1 === 2) {
    G.autoResetTimers.prestige += dt
    const time = Math.max(0.01, player.prestigeamount)
    if (
      player.toggles[15]
      && player.achievements[43] === 1
      && G.autoResetTimers.prestige >= time
      && player.coinsThisPrestige.gte(1e16)
    ) {
      resetachievementcheck(1)
      reset('prestige', true)
    }
  }

  if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
    if (
      player.toggles[21]
      && player.upgrades[89] === 1
      && G.transcendPointGain.gte(
        player.transcendPoints.times(Decimal.pow(10, player.transcendamount))
      )
      && player.coinsThisTranscension.gte(1e100)
      && player.currentChallenge.transcension === 0
    ) {
      resetachievementcheck(2)
      reset('transcension', true)
    }
  }
  if (player.resettoggle2 === 2) {
    G.autoResetTimers.transcension += dt
    const time = Math.max(0.01, player.transcendamount)
    if (
      player.toggles[21]
      && player.upgrades[89] === 1
      && G.autoResetTimers.transcension >= time
      && player.coinsThisTranscension.gte(1e100)
      && player.currentChallenge.transcension === 0
    ) {
      resetachievementcheck(2)
      reset('transcension', true)
    }
  }

  if (player.currentChallenge.ascension !== 12) {
    G.autoResetTimers.reincarnation += dt
    if (player.resettoggle3 === 2) {
      const time = Math.max(0.01, player.reincarnationamount)
      if (
        player.toggles[27]
        && player.researches[46] > 0.5
        && player.transcendShards.gte('1e300')
        && G.autoResetTimers.reincarnation >= time
        && player.currentChallenge.transcension === 0
        && player.currentChallenge.reincarnation === 0
      ) {
        resetachievementcheck(3)
        reset('reincarnation', true)
      }
    }
    if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
      if (
        player.toggles[27]
        && player.researches[46] > 0.5
        && G.reincarnationPointGain.gte(
          player.reincarnationPoints
            .add(1)
            .times(Decimal.pow(10, player.reincarnationamount))
        )
        && player.transcendShards.gte(1e300)
        && player.currentChallenge.transcension === 0
        && player.currentChallenge.reincarnation === 0
      ) {
        resetachievementcheck(3)
        reset('reincarnation', true)
      }
    }
  }
  calculateOfferings('reincarnation')
}

export const synergismHotkeys = (event: KeyboardEvent, key: string): void => {
  if (!player.toggles[40]) {
    return
  }

  const types = {
    coin: 'Coin',
    diamond: 'Diamonds',
    mythos: 'Mythos',
    particle: 'Particles',
    tesseract: 'Tesseracts'
  } as const

  const type = types[G.buildingSubTab]

  if (event.shiftKey) {
    let num = Number(key) - 1
    if (key === 'BACKQUOTE') {
      num = -1
    }
    if (player.challengecompletions[11] > 0 && !isNaN(num)) {
      if (num >= 0 && num < player.corruptionLoadoutNames.length) {
        if (player.toggles[41]) {
          void Notification(
            i18next.t('main.corruptionLoadoutApplied', {
              x: num + 1,
              y: player.corruptionLoadoutNames[num]
            }),
            5000
          )
        }
        corruptionLoadoutSaveLoad(false, num + 1)
      } else {
        if (player.toggles[41]) {
          void Notification(i18next.t('main.allCorruptionsZero'), 5000)
        }
        corruptionLoadoutSaveLoad(false, 0)
      }
      event.preventDefault()
    }
    return
  }

  switch (key) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5': {
      const num = Number(key) as OneToFive

      if (G.currentTab === Tabs.Buildings) {
        if (type === 'Particles') {
          buyParticleBuilding(num)
        } else if (type === 'Tesseracts') {
          buyTesseractBuilding(num)
        } else {
          buyMax(num, type)
        }
      }
      if (G.currentTab === Tabs.Upgrades) {
        categoryUpgrades(num, false)
      }
      if (G.currentTab === Tabs.Runes) {
        if (G.runescreen === 'runes') {
          redeemShards(num)
        }
        if (G.runescreen === 'blessings') {
          buyRuneBonusLevels('Blessings', num)
        }
        if (G.runescreen === 'spirits') {
          buyRuneBonusLevels('Spirits', num)
        }
      }
      if (G.currentTab === Tabs.Challenges) {
        toggleChallenges(num)
        challengeDisplay(num)
      }
      break
    }

    case '6':
      if (G.currentTab === Tabs.Upgrades) {
        categoryUpgrades(6, false)
      }
      if (G.currentTab === Tabs.Buildings && G.buildingSubTab === 'diamond') {
        buyCrystalUpgrades(1)
      }
      if (G.currentTab === Tabs.Challenges && player.reincarnationCount > 0) {
        toggleChallenges(6)
        challengeDisplay(6)
      }
      break
    case '7':
      if (G.currentTab === Tabs.Buildings && G.buildingSubTab === 'diamond') {
        buyCrystalUpgrades(2)
      }
      if (G.currentTab === Tabs.Challenges && player.achievements[113] === 1) {
        toggleChallenges(7)
        challengeDisplay(7)
      }
      break
    case '8':
      if (G.currentTab === Tabs.Buildings && G.buildingSubTab === 'diamond') {
        buyCrystalUpgrades(3)
      }
      if (G.currentTab === Tabs.Challenges && player.achievements[120] === 1) {
        toggleChallenges(8)
        challengeDisplay(8)
      }
      break
    case '9':
      if (G.currentTab === Tabs.Buildings && G.buildingSubTab === 'diamond') {
        buyCrystalUpgrades(4)
      }
      if (G.currentTab === Tabs.Challenges && player.achievements[127] === 1) {
        toggleChallenges(9)
        challengeDisplay(9)
      }
      break
    case '0':
      if (G.currentTab === Tabs.Buildings && G.buildingSubTab === 'diamond') {
        buyCrystalUpgrades(5)
      }
      if (G.currentTab === Tabs.Challenges && player.achievements[134] === 1) {
        toggleChallenges(10)
        challengeDisplay(10)
      }
      break
  }
}

export const showExitOffline = () => {
  const el = DOMCacheGetOrSet('exitOffline')
  el.style.visibility = 'visible'
  setTimeout(() => el.focus(), 100)
}

/**
 * Reloads shit.
 * @param reset if this param is passed, offline progression will not be calculated.
 */
export const reloadShit = async (reset = false) => {
  clearTimers()

  // Shows a reset button when page loading seems to stop or cause an error
  const preloadDeleteGame = setTimeout(
    () => (DOMCacheGetOrSet('preloadDeleteGame').style.display = 'block'),
    10000
  )

  disableHotkeys()

  // Wait a tick to continue. This is a (likely futile) attempt to see if this solves save corrupting.
  // This ensures all queued tasks are executed before continuing on.
  await new Promise((res) => {
    setTimeout(res, 0)
  })

  const save = (await localforage.getItem<Blob>('Synergysave2'))
    ?? localStorage.getItem('Synergysave2')

  const saveObject = typeof save === 'string' ? save : await save?.text()

  if (saveObject) {
    const dec = LZString.decompressFromBase64(saveObject)
    const isLZString = dec !== ''

    if (isLZString) {
      if (!dec) {
        return Alert(i18next.t('save.loadFailed'))
      }

      const saveString = btoa(dec)

      if (saveString === null) {
        return Alert(i18next.t('save.loadFailed'))
      }

      localStorage.clear()
      const blob = new Blob([saveString], { type: 'text/plain' })
      localStorage.setItem('Synergysave2', saveString)
      await localforage.setItem<Blob>('Synergysave2', blob)
      await Alert(i18next.t('main.transferredFromLZ'))
    }

    await loadSynergy()
  }

  if (!reset) {
    await calculateOffline()
  } else {
    player.worlds.reset()
    // saving is disabled during a singularity event to prevent bug
    // early return here if the save fails can keep game state from properly resetting after a singularity
    if (saveCheck.canSave) {
      const saved = await saveSynergy()
      if (!saved) {
        return
      }
    }
  }

  toggleTheme(true)
  settingAnnotation()
  toggleIconSet()
  toggleauto()
  htmlInserts()
  createTimer()

  // Reset Displays
  if (!playerNeedsReminderToExport()) {
    changeTab(Tabs.Buildings)
  } else {
    changeTab(Tabs.Settings)

    void Alert(i18next.t('general.exportYourGame'))
  }

  changeSubTab(Tabs.Buildings, { page: 0 })
  changeSubTab(Tabs.Runes, { page: 0 }) // Set 'runes' subtab back to 'runes' tab
  changeSubTab(Tabs.WowCubes, { page: 0 }) // Set 'cube tribues' subtab back to 'cubes' tab
  changeSubTab(Tabs.Corruption, { page: 0 }) // set 'corruption main'
  changeSubTab(Tabs.Singularity, { page: 0 }) // set 'singularity main'
  changeSubTab(Tabs.Settings, { page: 0 }) // set 'statistics main'

  dailyResetCheck()
  setInterval(dailyResetCheck, 30000)

  constantIntervals()
  changeTabColor()

  eventCheck()
    .catch(() => {})
    .finally(() => {
      setInterval(
        () =>
          eventCheck().catch((error: Error) => {
            console.error(error)
          }),
        15_000
      )
    })
  showExitOffline()
  clearTimeout(preloadDeleteGame)

  setInterval(cacheReinitialize, 15000)

  if (localStorage.getItem('pleaseStar') === null) {
    void Alert(i18next.t('main.starRepo'))
    localStorage.setItem('pleaseStar', '')
  }

  // All versions of Chrome and Firefox supported by the game have this API,
  // but not all versions of Edge and Safari do.
  if (
    typeof navigator.storage?.persist === 'function'
    && typeof navigator.storage?.persisted === 'function'
  ) {
    const persistent = await navigator.storage.persisted()

    if (!persistent) {
      const isPersistentNow = await navigator.storage.persist()

      if (isPersistentNow) {
        void Alert(i18next.t('main.dataPersistent'))
      }
    } else {
      console.log(`Storage is persistent! (persistent = ${persistent})`)
    }
  }

  const saveType = DOMCacheGetOrSet('saveType') as HTMLInputElement
  saveType.checked = localStorage.getItem('copyToClipboard') !== null
}

function playerNeedsReminderToExport () {
  const day = 1000 * 60 * 60 * 24

  return Date.now() - player.lastExportedSave > day * 3
}

window.addEventListener('load', async () => {
  await i18nInit()

  const ver = DOMCacheGetOrSet('versionnumber')
  const addZero = (n: number) => `${n}`.padStart(2, '0')
  if (ver instanceof HTMLElement) {
    const textUpdate = !isNaN(lastUpdated.getTime())
      ? ` [Last Update: ${addZero(lastUpdated.getHours())}:${
        addZero(
          lastUpdated.getMinutes()
        )
      } UTC ${addZero(lastUpdated.getDate())}-${
        lastUpdated.toLocaleString(
          'en-us',
          { month: 'short' }
        )
      }-${lastUpdated.getFullYear()}].`
      : ''
    ver.textContent = `You're ${testing ? 'testing' : 'playing'} v${version} - The Alternate Reality${textUpdate} ${
      testing ? i18next.t('testing.saveInLive') : ''
    }`
  }
  document.title = `Synergism v${version}`

  generateEventHandlers()

  void reloadShit()

  corruptionButtonsAdd()
  corruptionLoadoutTableCreate()

  handleLogin().catch(console.error)
})

window.addEventListener('unload', () => {
  // This fixes a bug in Chrome (who would have guessed?) that
  // wouldn't properly load elements if the user scrolled down
  // and reloaded a page. Why is this a bug, Chrome? Why would
  // a page that is reloaded be affected by what the user did
  // beforehand? How does anyone use this buggy browser???????
  window.scrollTo(0, 0)
})
