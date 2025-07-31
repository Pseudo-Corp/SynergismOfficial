import '@ungap/custom-elements'
import Decimal, { type DecimalSource } from 'break_infinity.js'
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
import { btoa, sortWithIndices, sumContents } from './Utility'
import { blankGlobals, Globals as G } from './Variables'

import {
  achievementPoints,
  type AchievementRewards,
  achRewards,
  awardAchievementGroup,
  awardUngroupedAchievement,
  buildingAchievementCheck,
  challengeAchievementCheck,
  generateAchievementHTMLs,
  getAchievementReward,
  numAchievements,
  type ProgressiveAchievements,
  progressiveAchievements,
  resetAchievementCheck,
  updateAchievementPoints,
  updateAllGroupedAchievementProgress,
  updateAllProgressiveAchievementProgress,
  updateAllUngroupedAchievementProgress,
  updateProgressiveCache,
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
  buyTesseractBuilding,
  calculateTessBuildingsInBudget,
  getCost,
  getReductionValue
} from './Buy'
import {
  calculateAcceleratorMultiplier,
  calculateAnts,
  calculateCubeBlessings,
  calculateGlobalSpeedMult,
  calculateGoldenQuarks,
  calculateObtainium,
  calculateOfferings,
  calculateOffline,
  calculateSigmoidExponential,
  calculateTotalAcceleratorBoost,
  calculateTotalCoinOwned,
  dailyResetCheck,
  exitOffline
} from './Calculate'
import {
  corruptionButtonsAdd,
  corruptionLoadLoadout,
  CorruptionLoadout,
  corruptionLoadoutTableCreate,
  corruptionLoadoutTableUpdate,
  CorruptionSaves,
  corruptionsSchema,
  corruptionStatsUpdate,
  updateCorruptionLoadoutNames,
  updateUndefinedLoadouts
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
import {
  generateRunesHTML,
  getRuneEffects,
  indexToRune,
  type RuneKeys,
  runes,
  sacrificeOfferings,
  sumOfRuneLevels,
  updateAllRuneLevelsFromEXP
} from './Runes'
import { c15RewardUpdate } from './Statistics'
import {
  buyTalismanLevelToRarityIncrease,
  generateTalismansHTML,
  noTalismanFragments,
  type TalismanCraftItems,
  type TalismanKeys,
  talismans,
  toggleTalismanBuy,
  updateTalismanInventory,
  updateTalismanLevelAndSpentFromInvested,
  updateTalismanRarities
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
import rfdc from 'rfdc'
import {
  type AmbrosiaUpgradeNames,
  ambrosiaUpgrades,
  blankAmbrosiaUpgradeObject,
  displayProperLoadoutCount,
  setAmbrosiaUpgradeLevels,
  updateBlueberryLoadoutCount
} from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  campaignIconHTMLUpdates,
  CampaignManager,
  campaignTokenRewardHTMLUpdate,
  createCampaignIconHTMLS,
  updateMaxTokens,
  updateTokens
} from './Campaign'
import { dev, lastUpdated, prod, testing, version } from './Config'
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from './CubeExperimental'
import { eventCheck } from './Event'
import {
  defaultHepteractValues,
  getHepteractEffects,
  type HepteractKeys,
  hepteracts,
  type HepteractValues,
  setAutomaticHepteractTexts,
  toggleAutoBuyOrbs
} from './Hepteracts'
import { disableHotkeys } from './Hotkeys'
import { init as i18nInit } from './i18n'
import { handleLogin } from './Login'
import {
  blankOcteractLevelObject,
  getOcteractUpgradeEffect,
  type OcteractDataKeys,
  octeractUpgrades
} from './Octeracts'
import { updatePlatonicUpgradeBG } from './Platonic'
import { initializePCoinCache, PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getQuarkBonus, QuarkHandler } from './Quark'
import {
  blankRedAmbrosiaUpgradeObject,
  type RedAmbrosiaNames,
  redAmbrosiaUpgrades,
  setRedAmbrosiaUpgradeLevels
} from './RedAmbrosiaUpgrades'
import {
  buyBlessingLevels,
  getRuneBlessingEffect,
  type RuneBlessingKeys,
  runeBlessings,
  updateAllBlessingLevelsFromEXP
} from './RuneBlessings'
import {
  buySpiritLevels,
  getRuneSpiritEffect,
  type RuneSpiritKeys,
  runeSpirits,
  updateAllSpiritLevelsFromEXP
} from './RuneSpirits'
import { playerJsonSchema } from './saves/PlayerJsonSchema'
import { playerUpdateVarSchema } from './saves/PlayerUpdateVarSchema'
import {
  blankGQLevelObject,
  getFastForwardTotalMultiplier,
  goldenQuarkUpgrades,
  type SingularityDataKeys
} from './singularity'
import {
  SingularityChallenge,
  singularityChallengeData,
  type SingularityChallengeDataKeys
} from './SingularityChallenges'
import { changeSubTab, changeTab, getActiveSubTab, Tabs } from './Tabs'
import { settingAnnotation, toggleIconSet, toggleTheme } from './Themes'
import { clearTimeout, clearTimers, setInterval, setTimeout } from './Timers'
import { generateLevelMilestoneHTMLS, generateLevelRewardHTMLs, getLevelMilestone } from './Levels'

export const player: Player = {
  firstPlayed: new Date().toISOString(),
  worlds: new QuarkHandler(0),
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

  obtainium: new Decimal('0'),
  maxObtainium: new Decimal('0'),

  obtainiumtimer: 0,
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
    rrow4: false,
    anthill: false,
    blessings: false,
    spirits: false,
    talismans: false,
    ascensions: false,
    tesseracts: false,
    hypercubes: false,
    platonics: false,
    hepteracts: false,
  },
  achievements: Array(numAchievements).fill(0) as number[],
  progressiveAchievements: {
    runeLevel: 0,
    freeRuneLevel: 0,
    singularityCount: 0,
    ambrosiaCount: 0,
    redAmbrosiaCount: 0,
    exalts: 0,
    talismanRarities: 0,
    singularityUpgrades: 0,
    octeractUpgrades: 0,
    redAmbrosiaUpgrades: 0
  },

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

  runes: {
    speed: new Decimal(0),
    duplication: new Decimal(0),
    prism: new Decimal(0),
    thrift: new Decimal(0),
    superiorIntellect: new Decimal(0),
    infiniteAscent: new Decimal(0),
    antiquities: new Decimal(0),
    horseShoe: new Decimal(0)
  },

  runeBlessings: {
    speed: new Decimal(0),
    duplication: new Decimal(0),
    prism: new Decimal(0),
    thrift: new Decimal(0),
    superiorIntellect: new Decimal(0)
  },

  runeSpirits: {
    speed: new Decimal(0),
    duplication: new Decimal(0),
    prism: new Decimal(0),
    thrift: new Decimal(0),
    superiorIntellect: new Decimal(0)
  },

  offerings: new Decimal('0'),
  maxOfferings: new Decimal('0'),

  prestigecounter: 0,
  transcendcounter: 0,
  reincarnationcounter: 0,
  offlinetick: Date.now(),

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
    shopChronometerS: 0,
    shopAmbrosiaUltra: 0,
    shopSingularitySpeedup: 0,
    shopSingularityPotency: 0,
    shopSadisticRune: 0,
    shopRedLuck1: 0,
    shopRedLuck2: 0,
    shopRedLuck3: 0,
    shopInfiniteShopUpgrades: 0
  },

  shopPotionsConsumed: {
    offering: 0,
    obtainium: 0
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
  antSacrificeTimer: 0,
  antSacrificeTimerReal: 0,

  talismans: {
    exemption: noTalismanFragments,
    chronos: noTalismanFragments,
    midas: noTalismanFragments,
    metaphysics: noTalismanFragments,
    polymath: noTalismanFragments,
    mortuus: noTalismanFragments,
    plastic: noTalismanFragments,
    wowSquare: noTalismanFragments,
    achievement: noTalismanFragments,
    cookieGrandma: noTalismanFragments,
    horseShoe: noTalismanFragments
  },

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

  hepteracts: {
    chronos: { ...defaultHepteractValues },
    hyperrealism: { ...defaultHepteractValues },
    quark: { ...defaultHepteractValues },
    challenge: { ...defaultHepteractValues },
    abyss: { ...defaultHepteractValues },
    accelerator: { ...defaultHepteractValues },
    acceleratorBoost: { ...defaultHepteractValues },
    multiplier: { ...defaultHepteractValues }
  },

  /*hepteractCrafts: {
    chronos: ChronosHepteract,
    hyperrealism: HyperrealismHepteract,
    quark: QuarkHepteract,
    challenge: ChallengeHepteract,
    abyss: AbyssHepteract,
    accelerator: AcceleratorHepteract,
    acceleratorBoost: AcceleratorBoostHepteract,
    multiplier: MultiplierHepteract
  },*/

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

  corruptions: {
    next: new CorruptionLoadout(corruptionsSchema.parse({})),
    used: new CorruptionLoadout(corruptionsSchema.parse({})),
    saves: new CorruptionSaves({
      'Loadout 1': corruptionsSchema.parse({}),
      'Loadout 2': corruptionsSchema.parse({}),
      'Loadout 3': corruptionsSchema.parse({}),
      'Loadout 4': corruptionsSchema.parse({}),
      'Loadout 5': corruptionsSchema.parse({}),
      'Loadout 6': corruptionsSchema.parse({}),
      'Loadout 7': corruptionsSchema.parse({}),
      'Loadout 8': corruptionsSchema.parse({}),
      'Loadout 9': corruptionsSchema.parse({}),
      'Loadout 10': corruptionsSchema.parse({}),
      'Loadout 11': corruptionsSchema.parse({}),
      'Loadout 12': corruptionsSchema.parse({}),
      'Loadout 13': corruptionsSchema.parse({}),
      'Loadout 14': corruptionsSchema.parse({}),
      'Loadout 15': corruptionsSchema.parse({}),
      'Loadout 16': corruptionsSchema.parse({})
    }),
    showStats: true
  },

  campaigns: new CampaignManager(),
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
  iconSet: 1,
  notation: 'Default',

  goldenQuarkUpgrades: blankGQLevelObject,
  octUpgrades: blankOcteractLevelObject,
  ambrosiaUpgrades: blankAmbrosiaUpgradeObject,

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
    ),
    limitedTime: new SingularityChallenge(
      singularityChallengeData.limitedTime,
      'limitedTime'
    ),
    sadisticPrequel: new SingularityChallenge(
      singularityChallengeData.sadisticPrequel,
      'sadisticPrequel'
    ),
    noOfferingPower: new SingularityChallenge(
      singularityChallengeData.noOfferingPower,
      'noOfferingPower'
    )
  },

  ambrosia: 0,
  lifetimeAmbrosia: 0,
  ambrosiaRNG: 0,
  blueberryTime: 0,
  visitedAmbrosiaSubtab: false,
  visitedAmbrosiaSubtabRed: false,
  spentBlueberries: 0,

  blueberryLoadouts: {
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
    10: {},
    11: {},
    12: {},
    13: {},
    14: {},
    15: {},
    16: {}
  },
  blueberryLoadoutMode: 'saveTree',

  redAmbrosia: 0,
  lifetimeRedAmbrosia: 0,
  redAmbrosiaTime: 0,
  // NOTE: This only keeps track of the total number of Red Ambrosia
  // Invested, because I realized that keeping classes on the player is generally a bad idea
  redAmbrosiaUpgrades: blankRedAmbrosiaUpgradeObject,

  singChallengeTimer: 0,

  lastExportedSave: 0,

  seed: Array.from({ length: 3 }, () => Date.now())
}

export const deepClone = () =>
  rfdc({
    proto: false,
    circles: false,
    constructorHandlers: [
      [Decimal, (o: DecimalSource) => new Decimal(o)],
      [QuarkHandler, (o: QuarkHandler) => new QuarkHandler(o.valueOf())],
      [WowCubes, (o: WowCubes) => new WowCubes(o.valueOf())],
      [WowTesseracts, (o: WowTesseracts) => new WowTesseracts(o.valueOf())],
      [WowHypercubes, (o: WowHypercubes) => new WowHypercubes(o.valueOf())],
      [WowPlatonicCubes, (o: WowPlatonicCubes) => new WowPlatonicCubes(o.valueOf())],
      [CorruptionLoadout, (o: CorruptionLoadout) => new CorruptionLoadout(o.loadout)],
      [CorruptionSaves, (o: CorruptionSaves) => new CorruptionSaves(o.corrSaveData)],
      [CampaignManager, (o: CampaignManager) => new CampaignManager(o.campaignManagerData)],
      [SingularityChallenge, (o: SingularityChallenge) => new SingularityChallenge(o.valueOf(), o.key())]
    ]
  })

export const blankSave = deepClone()(player)

export const saveSynergy = (button?: boolean) => {
  player.offlinetick = Date.now()
  player.loaded1009 = true
  player.loaded1009hotfix1 = true

  // save to player.goldenQuarkUpgrades, taking the level and freeLevel from corresponding goldenQuarkUpgrades from singularity.ts
  player.goldenQuarkUpgrades = Object.fromEntries(
    Object.keys(player.goldenQuarkUpgrades).map((key) => {
      const k = key as SingularityDataKeys
      const gqu = goldenQuarkUpgrades[k]
      return [key, { level: gqu.level, freeLevel: gqu.freeLevel }]
    })
  ) as Record<SingularityDataKeys, { level: number; freeLevel: number }>

  player.octUpgrades = Object.fromEntries(
    Object.keys(player.octUpgrades).map((key) => {
      const k = key as OcteractDataKeys
      const ou = octeractUpgrades[k]
      return [key, { level: ou.level, freeLevel: ou.freeLevel }]
    })
  ) as Record<OcteractDataKeys, { level: number; freeLevel: number }>

  player.ambrosiaUpgrades = Object.fromEntries(
    Object.keys(player.ambrosiaUpgrades).map((key) => {
      const k = key as AmbrosiaUpgradeNames
      const au = ambrosiaUpgrades[k]
      return [key, { ambrosiaInvested: au.ambrosiaInvested, blueberriesInvested: au.blueberriesInvested }]
    })
  ) as Record<AmbrosiaUpgradeNames, { ambrosiaInvested: number; blueberriesInvested: number }>

  player.redAmbrosiaUpgrades = Object.fromEntries(
    Object.keys(player.redAmbrosiaUpgrades).map((key) => {
      const k = key as RedAmbrosiaNames
      return [key, redAmbrosiaUpgrades[k].redAmbrosiaInvested]
    })
  ) as Record<RedAmbrosiaNames, number>

  player.talismans = Object.fromEntries(
    Object.keys(player.talismans).map((key) => {
      const k = key as TalismanKeys
      return [key, { ...talismans[k].fragmentsInvested }]
    })
  ) as Record<TalismanKeys, Record<TalismanCraftItems, number>>

  player.runes = Object.fromEntries(
    Object.keys(player.runes).map((key) => {
      const k = key as RuneKeys
      return [key, new Decimal(runes[k].runeEXP)]
    })
  ) as Record<RuneKeys, Decimal>

  player.runeBlessings = Object.fromEntries(
    Object.keys(player.runeBlessings).map((key) => {
      const k = key as RuneBlessingKeys
      return [key, new Decimal(runeBlessings[k].runeEXP)]
    })
  ) as Record<RuneBlessingKeys, Decimal>

  player.runeSpirits = Object.fromEntries(
    Object.keys(player.runeSpirits).map((key) => {
      const k = key as RuneSpiritKeys
      return [key, new Decimal(runeSpirits[k].runeEXP)]
    })
  ) as Record<RuneSpiritKeys, Decimal>

  player.hepteracts = Object.fromEntries(
    Object.keys(player.hepteracts).map((key) => {
      const k = key as HepteractKeys
      return [key, {
        BAL: hepteracts[k].BAL,
        TIMES_CAP_EXTENDED: hepteracts[k].TIMES_CAP_EXTENDED,
        AUTO: hepteracts[k].AUTO
      }]
    })
  ) as Record<HepteractKeys, HepteractValues>

  const p = playerJsonSchema.parse(player)
  const save = btoa(JSON.stringify(p))
  if (save !== null) {
    localStorage.setItem('Synergysave2', save)
  } else {
    void Alert(i18next.t('testing.errorSaving'))
    return false
  }

  if (button) {
    const el = DOMCacheGetOrSet('saveinfo')
    el.textContent = i18next.t('testing.gameSaved')
    setTimeout(() => (el.textContent = ''), 4000)
  }

  return true
}

const loadSynergy = () => {
  const saveString = localStorage.getItem('Synergysave2')
  const data = saveString ? JSON.parse(atob(saveString)) : null

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

    const validatedPlayer = playerUpdateVarSchema.safeParse(data)

    if (validatedPlayer.success) {
      Object.assign(player, validatedPlayer.data)
    } else {
      console.log(validatedPlayer.error)
      console.log(data)
      clearTimers()
      return
    }

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

    // TODO(@KhafraDev): remove G.currentSingChallenge
    // fix current sing challenge blank
    if (player.insideSingularityChallenge) {
      const challenges = Object.keys(player.singularityChallenges) as SingularityChallengeDataKeys[]
      for (let i = 0; i < challenges.length; i++) {
        if (player.singularityChallenges[challenges[i]].enabled) {
          G.currentSingChallenge = singularityChallengeData[challenges[i]].HTMLTag
          break
        }
      }
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

    if (player.firstOwnedAnts < 1 && player.firstCostAnts.gte('1e1200')) {
      player.firstCostAnts = new Decimal('1e700')
      player.firstOwnedAnts = 0
    }

    // Does this need to be kept here?
    if (player.transcendCount < 0) {
      player.transcendCount = 0
    }
    if (player.reincarnationCount < 0) {
      player.reincarnationCount = 0
    }
    if (player.offerings.lte(0)) {
      player.offerings = new Decimal(0)
    }
    if (player.obtainium.lte(0)) {
      player.obtainium = new Decimal(0)
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
    // Why was this made?
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

    // Probably want to remove Corruptions from Player Object...
    player.corruptions.used = new CorruptionLoadout(player.corruptions.used.loadout)
    // This is needed to fix saves that had issues with not resetting corruption at the singularity
    player.corruptions.used.setCorruptionLevelsWithChallengeRequirement(player.corruptions.used.loadout)

    for (let j = 1; j < 126; j++) {
      upgradeupdate(j, true)
    }

    for (let j = 1; j <= 200; j++) {
      updateResearchBG(j)
    }
    for (let j = 1; j < player.cubeUpgrades.length; j++) {
      updateCubeUpgradeBG(j)
    }
    const platUpg = document.querySelectorAll('button[id^="platUpg"]')
    for (let j = 1; j <= platUpg.length; j++) {
      updatePlatonicUpgradeBG(j)
    }

    // WHY
    const q = [
      'coin',
      'crystal',
      'mythos',
      'particle',
      'offering',
      'tesseract'
    ] as const

    for (let j = 0; j <= 5; j++) {
      for (let k = 0; k < 6; k++) {
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
        if (k === 4) {
          d = '10k'
        }
        if (k === 5) {
          d = '100k'
        }
        const e = `${q[j]}${d}`
        DOMCacheGetOrSet(e).style.backgroundColor = ''
      }
      let c = ''
      const curBuyAmount = player[`${q[j]}buyamount` as const]
      console.log(curBuyAmount)
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
      if (curBuyAmount === 10000) {
        c = '10k'
      }
      if (curBuyAmount === 100000) {
        c = '100k'
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
    getChallengeConditions()
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
    updateUndefinedLoadouts() // Monetization update added more corruption loadout slots
    updateBlueberryLoadoutCount() // Monetization update also added more Blueberry loadout slots

    const corrs = 1 + 8 + PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL
    // const corrs = Math.min(8, Object.keys(player.corruptionLoadouts).length) + 1
    for (let i = 0; i < corrs; i++) {
      corruptionLoadoutTableUpdate(true, i)
      corruptionLoadoutTableUpdate(false, i)
    }

    showCorruptionStatsLoadouts()
    updateCorruptionLoadoutNames()

    // For blueberry upgrades!
    displayProperLoadoutCount()

    DOMCacheGetOrSet('talismanLevelUpCost').style.display = 'none'

    DOMCacheGetOrSet('antSacrificeSummary').style.display = 'none'

    // This must be initialized at the beginning of the calculation
    c15RewardUpdate()

    calculatePlatonicBlessings()
    calculateHypercubeBlessings()
    calculateTesseractBlessings()
    calculateCubeBlessings()

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

    if (player.autoSacrificeToggle && player.autoSacrifice > 0) {
      DOMCacheGetOrSet(`${indexToRune[player.autoSacrifice]}Rune`).style.backgroundColor = 'orange'
    }

    if (player.autoWarpCheck) {
      DOMCacheGetOrSet('warpAuto').textContent = i18next.t('general.autoOnColon')
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
    resetHistoryRenderAllTables()
    updateSingularityAchievements()
    updateSingularityGlobalPerks()

    // Update the Sing requirements on reload for a challenge if applicable
    if (G.currentSingChallenge !== undefined) {
      const sing = player.singularityChallenges[G.currentSingChallenge].computeSingularityRquirement()
      player.singularityCount = sing
    }
  }

  // updateAchievementBG()
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
  if (strParts[1] !== undefined) {
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

  // NaN check
  // biome-ignore lint/suspicious/noSelfCompare: NaN !== NaN
  if (input !== input) {
    return '0 [NaN]'
  }

  const inputType = typeof input

  if (
    // this case handles numbers less than 1e-6 and greater than 0
    inputType === 'number'
    && player.notation === 'Default'
    && (input as number) < (!fractional ? 1e-3 : 1e-15) // arbitrary number, don't change 1e-3
    && (input as number) > 0 // don't handle negative numbers, probably could be removed
  ) {
    return input.toExponential(accuracy)
  } else if (
    inputType === 'number'
    && player.notation === 'Default'
    && -(input as number) < (!fractional ? 1e-3 : 1e-15) // arbitrary number, don't change 1e-3
    && -(input as number) > 0
  ) {
    return `-${(-input).toExponential(accuracy)}`
  }

  let power!: number
  let mantissa!: number
  if (inputType === 'number') {
    if ((input as number) < 0) {
      return `-${format(-input, accuracy, long, truncate, fractional)}`
    }
    if (input === 0) {
      return '0'
    }

    // Gets power and mantissa if input is of type number and isn't 0
    power = Math.floor(Math.log10(Math.abs(input as number)))
    mantissa = (input as number) / Math.pow(10, power)
  } else if (input instanceof Decimal) {
    if (input.lessThan(0)) {
      return `-${format(input.negated(), accuracy, long, truncate, fractional)}`
    }
    // Gets power and mantissa if input is of type decimal
    power = input.e
    mantissa = input.mantissa
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
  } else if (
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
  if (power < 0 && inputType === 'number' && fractional) {
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
  } else if (power < 6 || (long && power < 12)) {
    // If the power is less than 6 or format long and less than 12 use standard formatting (1,234,567)
    // Gets the standard representation of the number, safe as power is guaranteed to be > -12 and < 12
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
  }

  return '0 [und.]'
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

export const formatAsPercentIncrease = (n: number, accuracy = 2) => {
  return `${format((n - 1) * 100, accuracy, true)}%`
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
  a += +getAchievementReward('accelerators')

  a += 5 * CalcECC('transcend', player.challengecompletions[2])
  G.freeUpgradeAccelerator = a
  a += G.totalAcceleratorBoost
    * (5
      + 2 * player.researches[18]
      + 2 * player.researches[19]
      + 3 * player.researches[20]
      + (G.cubeBonusMultiplier[1] - 1))

  if (player.unlocks.prestige) {
    a *= getRuneEffects('speed').multiplicativeAccelerators
  }

  calculateAcceleratorMultiplier()
  a *= G.acceleratorMultiplier
  a = Math.pow(
    a,
    Math.min(
      1,
      (1 + player.platonicUpgrades[6] / 30)
        * G.viscosityPower[player.corruptions.used.viscosity]
    )
  )
  a += getHepteractEffects('accelerator').accelerators
  a *= G.challenge15Rewards.accelerator.value
  a *= getHepteractEffects('accelerator').acceleratorMultiplier
  a = Math.floor(Math.min(1e100, a))

  if (player.corruptions.used.viscosity >= 15) {
    a = Math.pow(a, 0.2)
  }
  if (player.corruptions.used.viscosity >= 16) {
    a = 1
  }

  G.freeAccelerator = a
  G.totalAccelerator += G.freeAccelerator

  G.tuSevenMulti = 1

  if (player.upgrades[46] > 0.5) {
    G.tuSevenMulti = 1.05
  }

  const achievementBonus = +getAchievementReward('acceleratorPower')

  G.acceleratorPower = Math.pow(
    1.1
      + getRuneEffects('speed').acceleratorPower
      + 1 / 400 * CalcECC('transcend', player.challengecompletions[2])
      + achievementBonus
      + G.tuSevenMulti
        * (G.totalAcceleratorBoost / 100)
        * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20),
    1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7])
  )

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

  a += +getAchievementReward('multipliers')
  a += 20
    * player.researches[94]
    * Math.floor(sumOfRuneLevels() / 8)

  G.freeUpgradeMultiplier = Math.min(1e100, a)
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
  a *= getRuneEffects('duplication').multiplicativeMultipliers
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
        * G.viscosityPower[player.corruptions.used.viscosity]
    )
  )
  a += getHepteractEffects('multiplier').multiplier
  a *= G.challenge15Rewards.multiplier.value
  a *= getHepteractEffects('multiplier').multiplierMultiplier
  a = Math.floor(Math.min(1e100, a))

  if (player.corruptions.used.viscosity >= 15) {
    a = Math.pow(a, 0.2)
  }
  if (player.corruptions.used.viscosity >= 16) {
    a = 1
  }

  G.freeMultiplier = a
  G.totalMultiplier = G.freeMultiplier + player.multiplierBought

  G.challengeOneLog = 3

  let b = 0
  const c = 0
  b += Decimal.log(player.transcendShards.add(1), 3)
  b += getRuneEffects('duplication').multiplierBoosts
  b += 2 * CalcECC('transcend', player.challengecompletions[1])
  b *= 1 + (11 * player.researches[33]) / 100
  b *= 1 + (11 * player.researches[34]) / 100
  b *= 1 + (11 * player.researches[35]) / 100
  b *= 1 + player.researches[89] / 5
  b *= getRuneBlessingEffect('duplication').multiplierBoosts

  G.totalMultiplierBoost = Math.pow(
    Math.floor(b) + c,
    1 + CalcECC('reincarnation', player.challengecompletions[7]) * 0.04
  )

  let c7 = 1
  if (player.challengecompletions[7] > 0.5) {
    c7 = 1.25
  }

  G.multiplierPower = 2 + 0.02 * G.totalMultiplierBoost * c7

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
      + getRuneSpiritEffect('prism').crystalCaps,
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
      Decimal.min(1e30, Decimal.pow(player.transcendPoints.add(4), 1 / 2))
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
            * player.corruptions.used.recession
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
  lol = Decimal.pow(lol, G.challenge15Rewards.coinExponent.value)
  G.globalCoinMultiplier = lol
  G.globalCoinMultiplier = Decimal.pow(
    G.globalCoinMultiplier,
    G.recessionPower[player.corruptions.used.recession]
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
        ).times(1e22)
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
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    +getAchievementReward('crystalMultiplier')
  )
  G.globalCrystalMultiplier = G.globalCrystalMultiplier.times(
    Decimal.pow(10, getRuneEffects('prism').productionLog10)
  )
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
      Decimal.pow(1.01, achievementPoints * player.crystalUpgrades[0])
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
      .times(Decimal.pow(1.01, achievementPoints))
      .times(achievementPoints / 5 + 1)
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
        + +getAchievementReward('constUpgrade1Buff')
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
              + 1000 * +getAchievementReward('constUpgrade2Buff')
              + 10 * player.shopUpgrades.constantEX
              + 1000 * (G.challenge15Rewards.exponent.value - 1)
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
    G.challenge15Rewards.constantBonus.value
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
    awardAchievementGroup('constant')
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
    challengeAchievementCheck(1)
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
    challengeAchievementCheck(2)
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
    challengeAchievementCheck(3)
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
    challengeAchievementCheck(4)
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
    challengeAchievementCheck(5)
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
      challengeAchievementCheck(ascendchal)
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
      challengeAchievementCheck(15)
    }
  }
}

export const updateAntMultipliers = (): void => {
  G.globalAntMult = new Decimal(1)
  G.globalAntMult = G.globalAntMult.times(getRuneEffects('superiorIntellect').antSpeed)
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
        * Math.pow(Decimal.log10(player.maxOfferings.add(1)), 2)
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
      Decimal.max(1, player.obtainium),
      getRuneBlessingEffect('superiorIntellect').obtToAntExponent
    )
  )

  // TODO: Replace with Talisman Bonus --Platonic
  /*G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(1 + sumOfRuneLevels() / 100, 0.5)
  )*/

  G.globalAntMult = G.globalAntMult.times(
    Decimal.pow(1.1, CalcECC('reincarnation', player.challengecompletions[9]))
  )
  G.globalAntMult = G.globalAntMult.times(G.cubeBonusMultiplier[6])
  G.globalAntMult = G.globalAntMult.times(
    +getAchievementReward('antSpeed')
  )
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
      1 - (0.9 / 90) * Math.min(99, player.corruptions.used.totalLevels)
    )
  } else {
    // C15 used to have 9 corruptions set to 11, which above would provide a power of 0.01. Now it's hardcoded this way.
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.01)
  }

  G.globalAntMult = Decimal.pow(
    G.globalAntMult,
    G.extinctionMultiplier[player.corruptions.used.extinction]
  )
  G.globalAntMult = G.globalAntMult.times(G.challenge15Rewards.antSpeed.value)
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

  if (player.highestSingularityCount >= 1) {
    G.globalAntMult = G.globalAntMult.times(4.44)
  }

  if (player.corruptions.used.extinction >= 14) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.02)
  }
  if (player.corruptions.used.extinction >= 15) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.02)
  }
  if (player.corruptions.used.extinction >= 16) {
    G.globalAntMult = Decimal.pow(G.globalAntMult, 0.02)
  }

  if (getOcteractUpgradeEffect('octeractStarter')) {
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

  if (player.singularityChallenges.noOfferingPower.enabled) {
    G.globalAntMult = G.globalAntMult.times(
      1e10 * Math.pow(2, -player.singularityChallenges.noOfferingPower.completions)
    )
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
  prestigePow *= G.deflationMultiplier[player.corruptions.used.deflation]
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
          (1 / 3) * G.deflationMultiplier[player.corruptions.used.deflation]
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
  G.reincarnationPointGain = G.reincarnationPointGain.times(
    +getAchievementReward('particleGain')
  )
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
        resetAchievementCheck('prestige')
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
        resetAchievementCheck('transcension')
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
    challengeAchievementCheck(q)
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
        resetAchievementCheck('reincarnation')
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
    challengeAchievementCheck(q)
    if (player.highestchallengecompletions[8] > 0) {
      player.unlocks.anthill = true
    }
    if (player.highestchallengecompletions[9] > 0) {
      player.unlocks.talismans = true
      player.unlocks.blessings = true
    }
    if (player.highestchallengecompletions[10] > 0) {
      player.unlocks.ascensions = true
    }
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
      calculateAnts()
    }
    if (player.shopUpgrades.instantChallenge === 0 || leaving) {
      reset('reincarnationChallenge', false, 'leaveChallenge')
      player.reincarnationCount -= 1
    }
  }

  if (i === 'ascension') {
    if (
      player.unlocks.ascensions
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
      challengeAchievementCheck(a)
      if (player.highestchallengecompletions[11] > 0) {
        player.unlocks.tesseracts = true
      }
      if (player.highestchallengecompletions[12] > 0) {
        player.unlocks.spirits = true
      }
      if (player.highestchallengecompletions[13] > 0) {
        player.unlocks.hypercubes = true
      }
      if (player.highestchallengecompletions[14] > 0) {
        player.unlocks.platonics = true
      }
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
        (manual || leaving || player.shopUpgrades.challenge15Auto > 0) // removed a check that ensures always all lv11.. did not seem necessary
      ) {
        if (
          player.coins.gte(Decimal.pow(10, player.challenge15Exponent / c15SM))
        ) {
          player.challenge15Exponent = Decimal.log(player.coins.add(1), 10) * c15SM
          c15RewardUpdate()
        }
      }
      if (player.challenge15Exponent >= 1e15) {
        player.unlocks.hepteracts = true
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
    if (runes.antiquities.level === 0) {
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
          y: format(calculateGoldenQuarks(), 2, true)
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
          y: format(calculateGoldenQuarks(), 2, true),
          z: format(getQuarkBonus())
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
      singularity()
      saveSynergy()
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
        resetAchievementCheck('prestige')
        reset('prestige')
      }
    } else {
      resetAchievementCheck('prestige')
      reset('prestige')
    }
  }
  if (i === 'transcend') {
    if (player.toggles[29]) {
      const z = await Confirm(i18next.t('main.transcendPrompt'))
      if (z) {
        resetAchievementCheck('transcension')
        reset('transcension')
      }
    } else {
      resetAchievementCheck('transcension')
      reset('transcension')
    }
  }
  if (i === 'reincarnate') {
    if (player.currentChallenge.ascension !== 12) {
      if (player.toggles[30]) {
        const z = await Confirm(i18next.t('main.reincarnatePrompt'))
        if (z) {
          resetAchievementCheck('reincarnation')
          reset('reincarnation')
        }
      } else {
        resetAchievementCheck('reincarnation')
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
  G.effectiveLevelMult *= G.challenge15Rewards.runeBonus.value
  G.effectiveLevelMult *= G.cubeBonusMultiplier[9]
}

export const updateAll = (): void => {
  G.uFourteenMulti = new Decimal(1)
  G.uFifteenMulti = new Decimal(1)

  if (player.upgrades[14] > 0.5) {
    G.uFourteenMulti = Decimal.pow(1.15, G.freeAccelerator).times(1e5)
  }
  if (player.upgrades[15] > 0.5) {
    G.uFifteenMulti = Decimal.pow(1.15, G.freeAccelerator).times(1e5)
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

  awardAchievementGroup('antCrumbs')
  awardUngroupedAchievement('thousandSuns')
  awardUngroupedAchievement('thousandMoons')

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
    && getLevelMilestone('tier1CrystalAutobuy') === 1
    && player.prestigePoints.gte(player.firstCostDiamonds)
  ) {
    buyMax(1, 'Diamonds')
  }
  if (
    player.toggles[11]
    && getLevelMilestone('tier2CrystalAutobuy') === 1
    && player.prestigePoints.gte(player.secondCostDiamonds)
  ) {
    buyMax(2, 'Diamonds')
  }
  if (
    player.toggles[12]
    && getLevelMilestone('tier3CrystalAutobuy') === 1
    && player.prestigePoints.gte(player.thirdCostDiamonds)
  ) {
    buyMax(3, 'Diamonds')
  }
  if (
    player.toggles[13]
    && getLevelMilestone('tier4CrystalAutobuy') === 1
    && player.prestigePoints.gte(player.fourthCostDiamonds)
  ) {
    buyMax(4, 'Diamonds')
  }
  if (
    player.toggles[14]
    && getLevelMilestone('tier5CrystalAutobuy') === 1
    && player.prestigePoints.gte(player.fifthCostDiamonds)
  ) {
    buyMax(5, 'Diamonds')
  }

  updateEffectiveLevelMult() // update before prism rune, fixes c15 bug

  let c = 0
  if (
    player.upgrades[73] > 0.5
    && player.currentChallenge.reincarnation !== 0
  ) {
    c += 10
  }
  if (
    getLevelMilestone('tier1CrystalAutobuy') === 1
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
    getLevelMilestone('tier2CrystalAutobuy') === 1
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
    getLevelMilestone('tier3CrystalAutobuy') === 1
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
    getLevelMilestone('tier4CrystalAutobuy') === 1
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
    getLevelMilestone('tier5CrystalAutobuy') === 1
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

  if ((player.researches[130] > 0 || player.researches[135] > 0) && player.autoFortifyToggle) {
    for (const key of Object.keys(talismans) as TalismanKeys[]) {
      buyTalismanLevelToRarityIncrease(key, true)
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
  p += +getAchievementReward('conversionExponent')

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

  if (player.offerings.greaterThan(player.maxOfferings)) {
    player.maxOfferings = new Decimal(player.offerings)
  }
  if (player.obtainium.greaterThan(player.maxObtainium)) {
    player.maxObtainium = new Decimal(player.obtainium)
  }

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
  ) {
    const c15SM = challenge15ScoreMultiplier()
    if (player.coins.gte(Decimal.pow(10, player.challenge15Exponent / c15SM))) {
      player.challenge15Exponent = Decimal.log(player.coins.add(1), 10) * c15SM
      c15RewardUpdate()
      updateChallengeLevel(15)
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
  setInterval(campaignIconHTMLUpdates, 15000)
  setInterval(updateAllRuneLevelsFromEXP, 25)
  setInterval(updateAllBlessingLevelsFromEXP, 25)
  setInterval(updateAllSpiritLevelsFromEXP, 25)
  setInterval(updateTalismanRarities, 250)
  setInterval(() => awardAchievementGroup('runeFreeLevel'), 25)
  setInterval(() => {
    for (const key of Object.keys(progressiveAchievements) as ProgressiveAchievements[]) {
      updateProgressiveCache(key)
    }
  }, 25)

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
    const timeMult = calculateGlobalSpeedMult()
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
    addTimers('redAmbrosia', dt)

    // Triggers automatic rune sacrifice (adds milliseconds to payload timer)
    if (player.shopUpgrades.offeringAuto > 0 && player.autoSacrificeToggle) {
      automaticTools('runeSacrifice', dt)
    }

    // Triggers automatic ant sacrifice (adds milliseonds to payload timers)
    if (getAchievementReward('antSacrificeUnlock')) {
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
      && getLevelMilestone('autoPrestige') === 1
      && G.prestigePointGain.gte(
        player.prestigePoints.times(Decimal.pow(10, player.prestigeamount))
      )
      && player.coinsThisPrestige.gte(1e16)
    ) {
      resetAchievementCheck('prestige')
      reset('prestige', true)
    }
  }
  if (player.resettoggle1 === 2) {
    G.autoResetTimers.prestige += dt
    const time = Math.max(0.01, player.prestigeamount)
    if (
      player.toggles[15]
      && getLevelMilestone('autoPrestige') === 1
      && G.autoResetTimers.prestige >= time
      && player.coinsThisPrestige.gte(1e16)
    ) {
      resetAchievementCheck('transcension')
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
      resetAchievementCheck('transcension')
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
      resetAchievementCheck('transcension')
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
        resetAchievementCheck('reincarnation')
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
        resetAchievementCheck('reincarnation')
        reset('reincarnation', true)
      }
    }
  }
  calculateOfferings()
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
      if (num >= 0 && num < 8 + PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL) {
        if (player.toggles[41]) {
          void Notification(
            i18next.t('main.corruptionLoadoutApplied', {
              x: num + 1,
              y: player.corruptions.saves.saves[num].name
            }),
            5000
          )
        }
        corruptionLoadLoadout(num)
      } else {
        if (player.toggles[41]) {
          void Notification(i18next.t('main.allCorruptionsZero'), 5000)
        }
        player.corruptions.next.resetCorruptions()
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
        if (getActiveSubTab() === 0) {
          sacrificeOfferings(indexToRune[num], player.offerings)
        } else if (getActiveSubTab() === 2) {
          buyBlessingLevels(indexToRune[num] as RuneBlessingKeys, player.offerings)
        } else if (getActiveSubTab() === 3) {
          buySpiritLevels(indexToRune[num] as RuneSpiritKeys, player.offerings)
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
      if (G.currentTab === Tabs.Runes) {
        if (getActiveSubTab() === 0) {
          sacrificeOfferings('infiniteAscent', player.offerings)
        }
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
      if (G.currentTab === Tabs.Runes) {
        if (getActiveSubTab() === 0) {
          sacrificeOfferings('antiquities', player.offerings)
        }
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
export const reloadShit = (reset = false) => {
  clearTimers()

  // Shows a reset button when page loading seems to stop or cause an error
  const preloadDeleteGame = setTimeout(
    () => (DOMCacheGetOrSet('preloadDeleteGame').style.display = 'block'),
    10000
  )

  disableHotkeys()

  const saveObject = localStorage.getItem('Synergysave2')

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
      localStorage.setItem('Synergysave2', saveString)
      Alert(i18next.t('main.transferredFromLZ'))
    }

    loadSynergy()
  }

  // Recover Sing Upgrade (now GQ upgrade) level from Player Obj
  if (player.goldenQuarkUpgrades !== undefined) {
    for (const [key, value] of Object.entries(player.goldenQuarkUpgrades)) {
      const k = key as SingularityDataKeys
      goldenQuarkUpgrades[k].level = value.level
      goldenQuarkUpgrades[k].freeLevel = value.freeLevel
    }
  }

  // Recover Oct Upgrades level from Player Obj
  if (player.octUpgrades !== undefined) {
    for (const [key, value] of Object.entries(player.octUpgrades)) {
      const k = key as OcteractDataKeys

      octeractUpgrades[k].level = value.level
      octeractUpgrades[k].freeLevel = value.freeLevel
    }
  }

  if (player.ambrosiaUpgrades !== undefined) {
    for (const [key, value] of Object.entries(player.ambrosiaUpgrades)) {
      const k = key as AmbrosiaUpgradeNames
      ambrosiaUpgrades[k].ambrosiaInvested = value.ambrosiaInvested ?? 0
      ambrosiaUpgrades[k].blueberriesInvested = value.blueberriesInvested ?? 0
    }
  }

  if (player.redAmbrosiaUpgrades !== undefined) {
    for (const [key, value] of Object.entries(player.redAmbrosiaUpgrades)) {
      const k = key as RedAmbrosiaNames
      redAmbrosiaUpgrades[k].redAmbrosiaInvested = value
    }
  }

  if (player.talismans !== undefined) {
    for (const key of Object.keys(player.talismans) as TalismanKeys[]) {
      updateTalismanLevelAndSpentFromInvested(key)
    }
  }

  if (player.runes !== undefined) {
    for (const key of Object.keys(player.runes) as RuneKeys[]) {
      const runeEXP = player.runes[key]
      runes[key].runeEXP = new Decimal(runeEXP)
    }
    updateAllRuneLevelsFromEXP()
  }

  if (player.runeBlessings !== undefined) {
    for (const key of Object.keys(player.runeBlessings) as RuneBlessingKeys[]) {
      const blessingEXP = player.runeBlessings[key]
      runeBlessings[key].runeEXP = new Decimal(blessingEXP)
    }
    updateAllBlessingLevelsFromEXP()
  }

  if (player.runeSpirits !== undefined) {
    for (const key of Object.keys(player.runeSpirits) as RuneSpiritKeys[]) {
      const spiritEXP = player.runeSpirits[key]
      runeSpirits[key].runeEXP = new Decimal(spiritEXP)
    }
    updateAllSpiritLevelsFromEXP()
  }

  if (player.hepteracts !== undefined) {
    for (const key of Object.keys(player.hepteracts) as HepteractKeys[]) {
      hepteracts[key].BAL = player.hepteracts[key].BAL ?? hepteracts[key].BAL
      hepteracts[key].AUTO = player.hepteracts[key].AUTO ?? hepteracts[key].AUTO
      hepteracts[key].TIMES_CAP_EXTENDED = player.hepteracts[key].TIMES_CAP_EXTENDED
        ?? hepteracts[key].TIMES_CAP_EXTENDED
    }
  }

  updateTokens()
  updateMaxTokens()
  updateAchievementPoints()
  setAmbrosiaUpgradeLevels()
  setRedAmbrosiaUpgradeLevels()

  for (const k of Object.keys(achRewards) as AchievementRewards[]) {
    console.log(`Applying reward ${k}: `, getAchievementReward(k))
  }

  if (!reset) {
    calculateOffline()
  } else {
    if (!player.singularityChallenges.limitedTime.rewards.preserveQuarks) {
      player.worlds.reset()
    }

    if (!saveSynergy()) {
      return
    }
  }

  toggleTheme(true)
  toggleShops()
  setAutomaticHepteractTexts()
  settingAnnotation()
  toggleIconSet()
  toggleauto()
  htmlInserts()
  createTimer()

  // Reset Displays
  changeTab(Tabs.Buildings)

  changeSubTab(Tabs.Buildings, { page: 0 })
  changeSubTab(Tabs.Runes, { page: 0 }) // Set 'runes' subtab back to 'runes' tab
  changeSubTab(Tabs.Challenges, { page: 0 }) // Set 'challenges' subtab back to 'normal' tab
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
        1000 * 60 * 5
      )
    })
  showExitOffline()
  campaignIconHTMLUpdates()
  campaignTokenRewardHTMLUpdate()
  updateAllUngroupedAchievementProgress()
  updateAllGroupedAchievementProgress()
  updateAllProgressiveAchievementProgress()
  updateChallengeDisplay()
  clearTimeout(preloadDeleteGame)

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
    navigator.storage.persisted()
      .then((persistent) => persistent ? Promise.resolve(false) : navigator.storage.persist())
      .then((isPersistentNow) => {
        if (isPersistentNow) {
          void Alert(i18next.t('main.dataPersistent'))
        }
      })
  }

  const saveType = DOMCacheGetOrSet('saveType') as HTMLInputElement
  saveType.checked = localStorage.getItem('copyToClipboard') !== null
}

window.addEventListener('load', async () => {
  if (dev || testing) {
    const { worker } = await import('./mock/browser')
    await worker.start({
      serviceWorker: {
        url: './mockServiceWorker.js'
      }
    })
  }

  await i18nInit()
  handleLogin().catch(console.error)

  try {
    await initializePCoinCache()
  } catch (e) {
    console.error(e)
    const response = await Confirm(
      'PseudoCoin bonuses weren\'t fetched, if you have purchased upgrades they will not take effect. '
        + 'Press OK to continue to the game without upgrades.'
    )

    if (!response) return
  }

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

  generateRunesHTML()
  generateTalismansHTML()
  generateEventHandlers()
  corruptionButtonsAdd()
  corruptionLoadoutTableCreate()
  createCampaignIconHTMLS()
  generateAchievementHTMLs()
  generateLevelRewardHTMLs()
  generateLevelMilestoneHTMLS()

  reloadShit()
}, { once: true })

window.addEventListener('unload', () => {
  // This fixes a bug in Chrome (who would have guessed?) that
  // wouldn't properly load elements if the user scrolled down
  // and reloaded a page. Why is this a bug, Chrome? Why would
  // a page that is reloaded be affected by what the user did
  // beforehand? How does anyone use this buggy browser???????
  window.scrollTo(0, 0)
})
