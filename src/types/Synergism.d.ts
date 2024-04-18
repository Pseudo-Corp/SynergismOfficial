import type Decimal from 'break_infinity.js'
import type { BlueberryUpgrade } from '../BlueberryUpgrades'
import type { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from '../CubeExperimental'
import type { HepteractCraft } from '../Hepteracts'
import type { Category, ResetHistoryEntryUnion } from '../History'
import type { OcteractUpgrade } from '../Octeracts'
import type { IPlatBaseCost } from '../Platonic'
import type { QuarkHandler } from '../Quark'
import type { SingularityUpgrade } from '../singularity'
import type { SingularityChallenge, singularityChallengeData } from '../SingularityChallenges'
import type {
  AmbrosiaGenerationCache,
  AmbrosiaLuckAdditiveMultCache,
  AmbrosiaLuckCache,
  BlueberryInventoryCache
} from '../StatCache'
import type { Tabs } from '../Tabs'

export interface Player {
  firstPlayed: string
  worlds: QuarkHandler
  coins: Decimal
  coinsThisPrestige: Decimal
  coinsThisTranscension: Decimal
  coinsThisReincarnation: Decimal
  coinsTotal: Decimal

  firstOwnedCoin: number
  firstGeneratedCoin: Decimal
  firstCostCoin: Decimal
  firstProduceCoin: number

  secondOwnedCoin: number
  secondGeneratedCoin: Decimal
  secondCostCoin: Decimal
  secondProduceCoin: number

  thirdOwnedCoin: number
  thirdGeneratedCoin: Decimal
  thirdCostCoin: Decimal
  thirdProduceCoin: number

  fourthOwnedCoin: number
  fourthGeneratedCoin: Decimal
  fourthCostCoin: Decimal
  fourthProduceCoin: number

  fifthOwnedCoin: number
  fifthGeneratedCoin: Decimal
  fifthCostCoin: Decimal
  fifthProduceCoin: number

  firstOwnedDiamonds: number
  firstGeneratedDiamonds: Decimal
  firstCostDiamonds: Decimal
  firstProduceDiamonds: number

  secondOwnedDiamonds: number
  secondGeneratedDiamonds: Decimal
  secondCostDiamonds: Decimal
  secondProduceDiamonds: number

  thirdOwnedDiamonds: number
  thirdGeneratedDiamonds: Decimal
  thirdCostDiamonds: Decimal
  thirdProduceDiamonds: number

  fourthOwnedDiamonds: number
  fourthGeneratedDiamonds: Decimal
  fourthCostDiamonds: Decimal
  fourthProduceDiamonds: number

  fifthOwnedDiamonds: number
  fifthGeneratedDiamonds: Decimal
  fifthCostDiamonds: Decimal
  fifthProduceDiamonds: number

  firstOwnedMythos: number
  firstGeneratedMythos: Decimal
  firstCostMythos: Decimal
  firstProduceMythos: number

  secondOwnedMythos: number
  secondGeneratedMythos: Decimal
  secondCostMythos: Decimal
  secondProduceMythos: number

  thirdOwnedMythos: number
  thirdGeneratedMythos: Decimal
  thirdCostMythos: Decimal
  thirdProduceMythos: number

  fourthOwnedMythos: number
  fourthGeneratedMythos: Decimal
  fourthCostMythos: Decimal
  fourthProduceMythos: number

  fifthOwnedMythos: number
  fifthGeneratedMythos: Decimal
  fifthCostMythos: Decimal
  fifthProduceMythos: number

  firstOwnedParticles: number
  firstGeneratedParticles: Decimal
  firstCostParticles: Decimal
  firstProduceParticles: number

  secondOwnedParticles: number
  secondGeneratedParticles: Decimal
  secondCostParticles: Decimal
  secondProduceParticles: number

  thirdOwnedParticles: number
  thirdGeneratedParticles: Decimal
  thirdCostParticles: Decimal
  thirdProduceParticles: number

  fourthOwnedParticles: number
  fourthGeneratedParticles: Decimal
  fourthCostParticles: Decimal
  fourthProduceParticles: number

  fifthOwnedParticles: number
  fifthGeneratedParticles: Decimal
  fifthCostParticles: Decimal
  fifthProduceParticles: number

  firstOwnedAnts: number
  firstGeneratedAnts: Decimal
  firstCostAnts: Decimal
  firstProduceAnts: number

  secondOwnedAnts: number
  secondGeneratedAnts: Decimal
  secondCostAnts: Decimal
  secondProduceAnts: number

  thirdOwnedAnts: number
  thirdGeneratedAnts: Decimal
  thirdCostAnts: Decimal
  thirdProduceAnts: number

  fourthOwnedAnts: number
  fourthGeneratedAnts: Decimal
  fourthCostAnts: Decimal
  fourthProduceAnts: number

  fifthOwnedAnts: number
  fifthGeneratedAnts: Decimal
  fifthCostAnts: Decimal
  fifthProduceAnts: number

  sixthOwnedAnts: number
  sixthGeneratedAnts: Decimal
  sixthCostAnts: Decimal
  sixthProduceAnts: number

  seventhOwnedAnts: number
  seventhGeneratedAnts: Decimal
  seventhCostAnts: Decimal
  seventhProduceAnts: number

  eighthOwnedAnts: number
  eighthGeneratedAnts: Decimal
  eighthCostAnts: Decimal
  eighthProduceAnts: number

  ascendBuilding1: {
    cost: number
    owned: number
    generated: Decimal
    multiplier: number
  }
  ascendBuilding2: {
    cost: number
    owned: number
    generated: Decimal
    multiplier: number
  }
  ascendBuilding3: {
    cost: number
    owned: number
    generated: Decimal
    multiplier: number
  }
  ascendBuilding4: {
    cost: number
    owned: number
    generated: Decimal
    multiplier: number
  }
  ascendBuilding5: {
    cost: number
    owned: number
    generated: Decimal
    multiplier: number
  }

  multiplierCost: Decimal
  multiplierBought: number

  acceleratorCost: Decimal
  acceleratorBought: number

  acceleratorBoostBought: number
  acceleratorBoostCost: Decimal

  upgrades: number[]

  prestigeCount: number
  transcendCount: number
  reincarnationCount: number

  prestigePoints: Decimal
  transcendPoints: Decimal
  reincarnationPoints: Decimal

  prestigeShards: Decimal
  transcendShards: Decimal
  reincarnationShards: Decimal

  toggles: Record<number, boolean>

  challengecompletions: number[]
  highestchallengecompletions: number[]
  challenge15Exponent: number
  highestChallenge15Exponent: number

  retrychallenges: boolean
  currentChallenge: {
    transcension: number
    reincarnation: number
    ascension: number
  }
  researchPoints: number
  obtainiumtimer: number
  obtainiumpersecond: number
  maxobtainiumpersecond: number
  maxobtainium: number
  // Ignore the first index. The other 25 are shaped in a 5x5 grid similar to the production appearance
  researches: number[]

  unlocks: {
    coinone: boolean
    cointwo: boolean
    cointhree: boolean
    coinfour: boolean
    prestige: boolean
    generation: boolean
    transcend: boolean
    reincarnate: boolean
    rrow1: boolean
    rrow2: boolean
    rrow3: boolean
    rrow4: boolean
  }
  achievements: number[]

  achievementPoints: number

  prestigenomultiplier: boolean
  prestigenoaccelerator: boolean
  transcendnomultiplier: boolean
  transcendnoaccelerator: boolean
  reincarnatenomultiplier: boolean
  reincarnatenoaccelerator: boolean
  prestigenocoinupgrades: boolean
  transcendnocoinupgrades: boolean
  transcendnocoinorprestigeupgrades: boolean
  reincarnatenocoinupgrades: boolean
  reincarnatenocoinorprestigeupgrades: boolean
  reincarnatenocoinprestigeortranscendupgrades: boolean
  reincarnatenocoinprestigetranscendorgeneratorupgrades: boolean

  crystalUpgrades: number[]
  crystalUpgradesCost: number[]

  runelevels: number[]
  runeexp: number[]
  runeshards: number
  maxofferings: number
  offeringpersecond: number

  prestigecounter: number
  transcendcounter: number
  reincarnationcounter: number
  offlinetick: number

  prestigeamount: number
  transcendamount: number
  reincarnationamount: number

  fastestprestige: number
  fastesttranscend: number
  fastestreincarnate: number

  resettoggle1: number
  resettoggle2: number
  resettoggle3: number
  resettoggle4: number

  tesseractAutoBuyerToggle: number
  tesseractAutoBuyerAmount: number

  coinbuyamount: number
  crystalbuyamount: number
  mythosbuyamount: number
  particlebuyamount: number
  offeringbuyamount: number
  tesseractbuyamount: number

  shoptoggles: {
    coin: boolean
    prestige: boolean
    transcend: boolean
    generators: boolean
    reincarnate: boolean
  }
  tabnumber: number
  subtabNumber: number

  // create a Map with keys defaulting to boolean
  codes: Map<number, boolean>

  loaded1009: boolean
  loaded1009hotfix1: boolean
  loaded10091: boolean
  loaded1010: boolean
  loaded10101: boolean

  shopUpgrades: {
    offeringPotion: number
    obtainiumPotion: number
    offeringEX: number
    offeringAuto: number
    obtainiumEX: number
    obtainiumAuto: number
    instantChallenge: number
    antSpeed: number
    cashGrab: number
    shopTalisman: number
    seasonPass: number
    challengeExtension: number
    challengeTome: number
    cubeToQuark: number
    tesseractToQuark: number
    hypercubeToQuark: number
    seasonPass2: number
    seasonPass3: number
    chronometer: number
    infiniteAscent: number
    calculator: number
    calculator2: number
    calculator3: number
    calculator4: number
    calculator5: number
    calculator6: number
    calculator7: number
    constantEX: number
    powderEX: number
    chronometer2: number
    chronometer3: number
    seasonPassY: number
    seasonPassZ: number
    challengeTome2: number
    instantChallenge2: number
    cubeToQuarkAll: number
    cashGrab2: number
    seasonPassLost: number
    chronometerZ: number
    powderAuto: number
    offeringEX2: number
    obtainiumEX2: number
    challenge15Auto: number
    extraWarp: number
    autoWarp: number
    improveQuarkHept: number
    improveQuarkHept2: number
    improveQuarkHept3: number
    improveQuarkHept4: number
    shopImprovedDaily: number
    shopImprovedDaily2: number
    shopImprovedDaily3: number
    shopImprovedDaily4: number
    offeringEX3: number
    obtainiumEX3: number
    improveQuarkHept5: number
    seasonPassInfinity: number
    chronometerInfinity: number
    shopSingularityPenaltyDebuff: number
    shopAmbrosiaLuckMultiplier4: number
    shopOcteractAmbrosiaLuck: number
    shopAmbrosiaGeneration1: number
    shopAmbrosiaGeneration2: number
    shopAmbrosiaGeneration3: number
    shopAmbrosiaGeneration4: number
    shopAmbrosiaLuck1: number
    shopAmbrosiaLuck2: number
    shopAmbrosiaLuck3: number
    shopAmbrosiaLuck4: number
    shopCashGrabUltra: number
    shopAmbrosiaAccelerator: number
    shopEXUltra: number
  }
  shopConfirmationToggle: boolean
  shopBuyMaxToggle: boolean | 'TEN' | 'ANY'
  shopHideToggle: boolean
  autoPotionTimer: number
  autoPotionTimerObtainium: number

  autoSacrificeToggle: boolean
  autoBuyFragment: boolean
  autoFortifyToggle: boolean
  autoEnhanceToggle: boolean
  autoResearchToggle: boolean
  researchBuyMaxToggle: boolean
  autoResearchMode: 'cheapest' | 'manual'
  autoResearch: number
  autoSacrifice: number
  sacrificeTimer: number
  quarkstimer: number
  goldenQuarksTimer: number

  antPoints: Decimal
  antUpgrades: (null | number)[]
  antSacrificePoints: number
  antSacrificeTimer: number
  antSacrificeTimerReal: number

  talismanLevels: number[]
  talismanRarity: number[]
  talismanOne: (null | number)[]
  talismanTwo: (null | number)[]
  talismanThree: (null | number)[]
  talismanFour: (null | number)[]
  talismanFive: (null | number)[]
  talismanSix: (null | number)[]
  talismanSeven: (null | number)[]
  talismanShards: number
  commonFragments: number
  uncommonFragments: number
  rareFragments: number
  epicFragments: number
  legendaryFragments: number
  mythicalFragments: number

  buyTalismanShardPercent: number

  autoAntSacrifice: boolean
  autoAntSacTimer: number
  autoAntSacrificeMode: number
  antMax: boolean

  ascensionCount: number
  ascensionCounter: number
  ascensionCounterReal: number
  ascensionCounterRealReal: number
  autoOpenCubes: boolean
  openCubes: number
  autoOpenTesseracts: boolean
  openTesseracts: number
  autoOpenHypercubes: boolean
  openHypercubes: number
  autoOpenPlatonicsCubes: boolean
  openPlatonicsCubes: number
  cubeUpgrades: [null, ...number[]]
  cubeUpgradesBuyMaxToggle: boolean
  autoCubeUpgradesToggle: boolean
  autoPlatonicUpgradesToggle: boolean
  platonicUpgrades: number[]
  saveOfferingToggle: boolean
  wowCubes: WowCubes
  wowTesseracts: WowTesseracts
  wowHypercubes: WowHypercubes
  wowPlatonicCubes: WowPlatonicCubes
  wowAbyssals: number
  wowOcteracts: number
  totalWowOcteracts: number
  cubeBlessings: {
    accelerator: number
    multiplier: number
    offering: number
    runeExp: number
    obtainium: number
    antSpeed: number
    antSacrifice: number
    antELO: number
    talismanBonus: number
    globalSpeed: 0
  }
  tesseractBlessings: {
    accelerator: number
    multiplier: number
    offering: number
    runeExp: number
    obtainium: number
    antSpeed: number
    antSacrifice: number
    antELO: number
    talismanBonus: number
    globalSpeed: number
  }
  hypercubeBlessings: {
    accelerator: number
    multiplier: number
    offering: number
    runeExp: number
    obtainium: number
    antSpeed: number
    antSacrifice: number
    antELO: number
    talismanBonus: number
    globalSpeed: number
  }
  platonicBlessings: {
    cubes: number
    tesseracts: number
    hypercubes: number
    platonics: number
    hypercubeBonus: number
    taxes: number
    scoreBonus: number
    globalSpeed: number
  }
  ascendShards: Decimal
  autoAscend: boolean
  autoAscendMode: string
  autoAscendThreshold: number
  roombaResearchIndex: number
  ascStatToggles: Record<number, boolean>

  prototypeCorruptions: number[]
  usedCorruptions: number[]
  corruptionLoadouts: Record<number, number[]>
  corruptionLoadoutNames: string[]
  corruptionShowStats: boolean

  constantUpgrades: [null, ...number[]]
  history: Record<Category, ResetHistoryEntryUnion[]>
  historyShowPerSecond: boolean

  autoChallengeRunning: boolean
  autoChallengeIndex: number
  autoChallengeToggles: boolean[]
  autoChallengeStartExponent: number
  autoChallengeTimer: Record<string, number>

  runeBlessingLevels: number[]
  runeSpiritLevels: number[]
  runeBlessingBuyAmount: number
  runeSpiritBuyAmount: number

  autoTesseracts: boolean[]

  saveString: string
  exporttest: string | boolean

  dayCheck: Date | null
  dayTimer: number
  cubeOpenedDaily: number
  cubeQuarkDaily: number
  tesseractOpenedDaily: number
  tesseractQuarkDaily: number
  hypercubeOpenedDaily: number
  hypercubeQuarkDaily: number
  platonicCubeOpenedDaily: number
  platonicCubeQuarkDaily: number
  loadedOct4Hotfix: boolean
  loadedNov13Vers: boolean
  loadedDec16Vers: boolean
  loadedV253: boolean
  loadedV255: boolean
  loadedV297Hotfix1: boolean
  loadedV2927Hotfix1: boolean
  loadedV2930Hotfix1: boolean
  loadedV2931Hotfix1: boolean
  loadedV21003Hotfix1: boolean
  loadedV21007Hotfix1: boolean
  version: string

  rngCode: number
  skillCode?: number
  promoCodeTiming: {
    time: number
  }

  hepteractCrafts: {
    chronos: HepteractCraft
    hyperrealism: HepteractCraft
    quark: HepteractCraft
    challenge: HepteractCraft
    abyss: HepteractCraft
    accelerator: HepteractCraft
    acceleratorBoost: HepteractCraft
    multiplier: HepteractCraft
  }
  overfluxOrbs: number
  overfluxOrbsAutoBuy: boolean
  overfluxPowder: number
  dailyPowderResetUses: number
  autoWarpCheck: boolean

  singularityCount: number
  highestSingularityCount: number
  singularityCounter: number
  goldenQuarks: number
  quarksThisSingularity: number
  totalQuarksEver: number
  hotkeys: Record<number, string[]>
  theme: string
  iconSet: number
  notation: string

  singularityUpgrades: Record<keyof typeof singularityData, SingularityUpgrade>
  octeractUpgrades: Record<keyof typeof octeractData, OcteractUpgrade>
  dailyCodeUsed: boolean
  hepteractAutoCraftPercentage: number
  octeractTimer: number

  insideSingularityChallenge: boolean
  singularityChallenges: Record<
    keyof typeof singularityChallengeData,
    SingularityChallenge
  >

  ambrosia: number
  lifetimeAmbrosia: number
  blueberryTime: number
  ambrosiaRNG: number // DEPRECIATED, DO NOT USE
  visitedAmbrosiaSubtab: boolean
  spentBlueberries: number
  blueberryUpgrades: Record<
    keyof typeof blueberryUpgradeData,
    BlueberryUpgrade
  >
  blueberryLoadouts: Record<number, BlueberryOpt>
  blueberryLoadoutMode: BlueberryLoadoutMode

  ultimateProgress: number
  ultimatePixels: number

  caches: {
    ambrosiaLuckAdditiveMult: AmbrosiaLuckAdditiveMultCache
    ambrosiaLuck: AmbrosiaLuckCache
    ambrosiaGeneration: AmbrosiaGenerationCache
    blueberryInventory: BlueberryInventoryCache
  }

  /**
   * When the player last exported the save.
   */
  lastExportedSave: number
}

export interface GlobalVariables {
  runediv: number[]
  runeexpbase: number[]
  runeMaxLvl: number
  upgradeCosts: number[]

  // Mega list of Variables to be used elsewhere
  crystalUpgradesCost: number[]
  crystalUpgradeCostIncrement: number[]
  researchBaseCosts: number[]

  researchMaxLevels: number[]

  ticker: number

  costDivisor: number

  freeAccelerator: number
  totalAccelerator: number
  freeAcceleratorBoost: number
  totalAcceleratorBoost: number
  acceleratorPower: number
  acceleratorEffect: Decimal
  acceleratorEffectDisplay: Decimal
  generatorPower: Decimal

  freeMultiplier: number
  totalMultiplier: number
  multiplierPower: number
  multiplierEffect: Decimal
  challengeOneLog: number
  freeMultiplierBoost: number
  totalMultiplierBoost: number

  globalCoinMultiplier: Decimal
  totalCoinOwned: number
  prestigeMultiplier: Decimal
  buildingPower: number
  reincarnationMultiplier: Decimal

  coinOneMulti: Decimal
  coinTwoMulti: Decimal
  coinThreeMulti: Decimal
  coinFourMulti: Decimal
  coinFiveMulti: Decimal

  globalCrystalMultiplier: Decimal
  globalMythosMultiplier: Decimal
  grandmasterMultiplier: Decimal

  atomsMultiplier: Decimal

  mythosBuildingPower: number
  challengeThreeMultiplier: Decimal
  totalMythosOwned: number

  prestigePointGain: Decimal
  challengeFivePower: number

  transcendPointGain: Decimal
  reincarnationPointGain: Decimal

  produceFirst: Decimal
  produceSecond: Decimal
  produceThird: Decimal
  produceFourth: Decimal
  produceFifth: Decimal
  produceTotal: Decimal

  produceFirstDiamonds: Decimal
  produceSecondDiamonds: Decimal
  produceThirdDiamonds: Decimal
  produceFourthDiamonds: Decimal
  produceFifthDiamonds: Decimal
  produceDiamonds: Decimal

  produceFirstMythos: Decimal
  produceSecondMythos: Decimal
  produceThirdMythos: Decimal
  produceFourthMythos: Decimal
  produceFifthMythos: Decimal
  produceMythos: Decimal

  produceFirstParticles: Decimal
  produceSecondParticles: Decimal
  produceThirdParticles: Decimal
  produceFourthParticles: Decimal
  produceFifthParticles: Decimal
  produceParticles: Decimal

  producePerSecond: Decimal
  producePerSecondDiamonds: Decimal
  producePerSecondMythos: Decimal
  producePerSecondParticles: Decimal

  uFourteenMulti: Decimal
  uFifteenMulti: Decimal
  tuSevenMulti: number
  currentTab: Tabs

  researchfiller1: string
  researchfiller2: string

  ordinals: readonly [
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    ...string[]
  ]
  cardinals: string[]

  challengeBaseRequirements: number[]

  prestigeamount: number
  taxdivisor: Decimal
  taxdivisorcheck: Decimal
  runemultiplierincrease: {
    one: number
    two: number
    three: number
    four: number
    five: number
  }

  mythosupgrade13: Decimal
  mythosupgrade14: Decimal
  mythosupgrade15: Decimal
  challengefocus: number

  maxexponent: number

  effectiveLevelMult: number
  optimalOfferingTimer: number
  optimalObtainiumTimer: number

  runeSum: number

  globalAntMult: Decimal
  antMultiplier: Decimal

  antOneProduce: Decimal
  antTwoProduce: Decimal
  antThreeProduce: Decimal
  antFourProduce: Decimal
  antFiveProduce: Decimal
  antSixProduce: Decimal
  antSevenProduce: Decimal
  antEightProduce: Decimal

  antCostGrowth: number[]

  antUpgradeBaseCost: number[]
  antUpgradeCostIncreases: number[]

  bonusant1: number
  bonusant2: number
  bonusant3: number
  bonusant4: number
  bonusant5: number
  bonusant6: number
  bonusant7: number
  bonusant8: number
  bonusant9: number
  bonusant10: number
  bonusant11: number
  bonusant12: number

  rune1level: number
  rune2level: number
  rune3level: number
  rune4level: number
  rune5level: number
  rune1Talisman: number
  rune2Talisman: number
  rune3Talisman: number
  rune4Talisman: number
  rune5Talisman: number

  talisman1Effect: [null, ...number[]]
  talisman2Effect: [null, ...number[]]
  talisman3Effect: [null, ...number[]]
  talisman4Effect: [null, ...number[]]
  talisman5Effect: [null, ...number[]]
  talisman6Effect: [null, ...number[]]
  talisman7Effect: [null, ...number[]]

  talisman6Power: number
  talisman7Quarks: number

  runescreen: string
  settingscreen: string

  talismanResourceObtainiumCosts: number[]
  talismanResourceOfferingCosts: number[]

  talismanLevelCostMultiplier: number[]

  talismanPositiveModifier: [null, ...number[]]
  talismanNegativeModifier: [null, ...number[]]

  commonTalismanEnhanceCost: [null, ...number[]]
  uncommonTalismanEnchanceCost: [null, ...number[]]
  rareTalismanEnchanceCost: [null, ...number[]]
  epicTalismanEnhanceCost: [null, ...number[]]
  legendaryTalismanEnchanceCost: [null, ...number[]]
  mythicalTalismanEnchanceCost: [null, ...number[]]

  talismanRespec: number

  obtainiumGain: number

  mirrorTalismanStats: [null, ...number[]]
  antELO: number
  effectiveELO: number

  timeWarp: boolean

  blessingMultiplier: number
  spiritMultiplier: number
  runeBlessings: number[]
  runeSpirits: number[]

  effectiveRuneBlessingPower: number[]
  effectiveRuneSpiritPower: number[]

  blessingBaseCost: number
  spiritBaseCost: number

  triggerChallenge: number

  prevReductionValue: number

  buildingSubTab: BuildingSubtab
  // number000 of each before Diminishing Returns
  blessingbase: [null, ...number[]]
  blessingDRPower: [null, ...number[]]
  giftbase: number[]
  giftDRPower: number[]
  benedictionbase: [null, ...number[]]
  benedictionDRPower: [null, ...number[]]
  // 10 Million of each before Diminishing returns on first number 200k for second, and 10k for the last few
  platonicCubeBase: number[]
  platonicDRPower: number[]

  cubeBonusMultiplier: [null, ...number[]]
  tesseractBonusMultiplier: [null, ...number[]]
  hypercubeBonusMultiplier: [null, ...number[]]
  platonicBonusMultiplier: number[]

  autoOfferingCounter: number

  researchOrderByCost: number[]

  viscosityPower: number[]
  lazinessMultiplier: number[]
  hyperchallengedMultiplier: number[]
  illiteracyPower: number[]
  deflationMultiplier: number[]
  extinctionMultiplier: number[]
  droughtMultiplier: number[]
  financialcollapsePower: number[]

  corruptionPointMultipliers: number[]

  ascendBuildingProduction: {
    first: Decimal
    second: Decimal
    third: Decimal
    fourth: Decimal
    fifth: Decimal
  }
  freeUpgradeAccelerator: number
  freeUpgradeMultiplier: number

  acceleratorMultiplier: number
  multiplierMultiplier: number

  constUpgradeCosts: [null, ...number[]]

  globalConstantMult: Decimal
  autoTalismanTimer: number

  autoChallengeTimerIncrement: number
  corruptionTrigger: number

  challenge15Rewards: {
    cube1: number
    ascensions: number
    coinExponent: number
    taxes: number
    obtainium: number
    offering: number
    accelerator: number
    multiplier: number
    runeExp: number
    runeBonus: number
    cube2: number
    transcendChallengeReduction: number
    reincarnationChallengeReduction: number
    antSpeed: number
    bonusAntLevel: number
    cube3: number
    talismanBonus: number
    globalSpeed: number
    blessingBonus: number
    constantBonus: number
    cube4: number
    spiritBonus: number
    score: number
    quarks: number
    hepteractUnlocked: number
    cube5: number
    powder: number
    exponent: number
    freeOrbs: number
    ascensionSpeed: number
  }

  autoResetTimers: {
    prestige: number
    transcension: number
    reincarnation: number
    ascension: 0
  }

  timeMultiplier: number
  upgradeMultiplier: number

  historyCountMax: number

  isEvent: boolean
  shopEnhanceVision: boolean

  eventClicked: boolean

  ambrosiaTimer: number
  TIME_PER_AMBROSIA: number

  currentSingChallenge: keyof Player['singularityChallenges'] | undefined
}

export interface SynergismEvents {
  achievement: [number]
  historyAdd: [Category, ResetHistoryEntryUnion]
  promocode: [string]
  boughtPlatonicUpgrade: [IPlatBaseCost]
  openPlatonic: [number]
}

// If changing these, make reset tiers on top, then challenge types, then specific actions
export type resetNames =
  | 'prestige'
  | 'transcension'
  | 'reincarnation'
  | 'ascension'
  | 'singularity'
  | 'transcensionChallenge'
  | 'reincarnationChallenge'
  | 'ascensionChallenge'
  | 'acceleratorBoost'

// If adding new cube types add them below the last listed type. Thank you
export type cubeNames =
  | 'cubes'
  | 'tesseracts'
  | 'hypercubes'
  | 'platonics'
  | 'hepteracts'

export type BuildingSubtab =
  | 'coin'
  | 'diamond'
  | 'mythos'
  | 'particle'
  | 'tesseract'

export type ZeroToFour = 0 | 1 | 2 | 3 | 4

export type OneToFive = 1 | 2 | 3 | 4 | 5

export type ZeroToSeven = ZeroToFour | 5 | 6 | 7

export type FirstToFifth = GlobalVariables['ordinals'][ZeroToFour]

export type FirstToEighth = GlobalVariables['ordinals'][ZeroToSeven]
