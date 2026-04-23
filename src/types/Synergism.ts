import type Decimal from 'break_infinity.js'
import type { ProgressiveAchievements } from '../Achievements'
import type { AmbrosiaUpgradeNames, BlueberryLoadoutMode, BlueberryOpt } from '../BlueberryUpgrades'
import type { CampaignManager } from '../Campaign'
import type { Challenge15RewardObject, Challenge15Rewards } from '../Challenges'
import type { CorruptionLoadout, Corruptions, CorruptionSaves } from '../Corruptions'
import type { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from '../CubeExperimental'
import type { PlayerAnts } from '../Features/Ants/structs/structs'
import type { HepteractKeys, HepteractValues } from '../Hepteracts'
import type { Category, ResetHistoryEntryUnion } from '../History'
import type { OcteractUpgrades } from '../Octeracts'
import type { QuarkHandler } from '../Quark'
import type { RedAmbrosiaNames } from '../RedAmbrosiaUpgrades'
import type { RuneBlessingKeys } from '../RuneBlessings'
import type { RuneKeys } from '../Runes'
import type { RuneSpiritKeys } from '../RuneSpirits'
import type { ShopUpgradeNames } from '../Shop'
import type { SingularityDataKeys } from '../singularity'
import type { SingularityChallenge, SingularityChallengeDataKeys } from '../SingularityChallenges'
import type { Tabs } from '../Tabs'
import type { TalismanCraftItems, TalismanKeys } from '../Talismans'
import type { AutoAscensionModes, AutoAscensionResetModes, AutoResetModes } from '../Toggles'

type ArrayStartingWithNull<T> = [null, ...T[]]

export type BuyAmount = 1 | 10 | 100 | 1000 | 10_000 | 100_000

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

  ants: PlayerAnts

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

  obtainium: Decimal
  maxObtainium: Decimal
  obtainiumtimer: number

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
    anthill: boolean
    blessings: boolean
    spirits: boolean
    talismans: boolean
    ascensions: boolean
    tesseracts: boolean
    hypercubes: boolean
    platonics: boolean
    hepteracts: boolean
  }
  achievements: number[]
  progressiveAchievements: Record<ProgressiveAchievements, number>

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

  runes: Record<RuneKeys, Decimal>
  runeBlessings: Record<RuneBlessingKeys, Decimal>
  runeSpirits: Record<RuneSpiritKeys, Decimal>

  offerings: Decimal
  maxOfferings: Decimal

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

  resetToggleModes: {
    prestige: AutoResetModes
    transcend: AutoResetModes
    reincarnation: AutoResetModes
    ascension: AutoAscensionModes
  }

  tesseractAutoBuyerToggle: boolean
  tesseractAutoBuyerAmount: number

  coinbuyamount: BuyAmount
  crystalbuyamount: BuyAmount
  mythosbuyamount: BuyAmount
  particlebuyamount: BuyAmount
  offeringbuyamount: BuyAmount
  tesseractbuyamount: BuyAmount

  shoptoggles: {
    coin: boolean
    prestige: boolean
    transcend: boolean
    generators: boolean
    reincarnate: boolean
  }

  // create a Map with keys defaulting to boolean
  codes: Map<number, boolean>

  shopUpgrades: Record<ShopUpgradeNames, number>

  shopPotionsConsumed: {
    offering: number
    obtainium: number
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

  antSacrificeTimer: number
  antSacrificeTimerReal: number

  talismans: Record<TalismanKeys, Record<TalismanCraftItems, Decimal>>

  talismanShards: Decimal
  commonFragments: Decimal
  uncommonFragments: Decimal
  rareFragments: Decimal
  epicFragments: Decimal
  legendaryFragments: Decimal
  mythicalFragments: Decimal

  buyTalismanShardPercent: number

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
  cubeUpgrades: ArrayStartingWithNull<number>
  cubeUpgradesBuyMaxToggle: boolean
  autoCubeUpgradesToggle: boolean
  autoPlatonicUpgradesToggle: boolean
  platonicUpgrades: number[]
  maxPlatToggle: boolean
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
    globalSpeed: number
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
  autoAscendMode: AutoAscensionResetModes
  autoAscendThreshold: number
  roombaResearchIndex: number
  ascStatToggles: Record<number, boolean>

  campaigns: CampaignManager

  corruptions: {
    next: CorruptionLoadout
    used: CorruptionLoadout
    saves: CorruptionSaves
    showStats: boolean
  }

  constantUpgrades: ArrayStartingWithNull<number>
  history: Record<Category, ResetHistoryEntryUnion[]>
  historyShowPerSecond: boolean

  autoChallengeRunning: boolean
  autoChallengeIndex: number
  autoChallengeToggles: boolean[]
  autoChallengeStartExponent: number
  autoChallengeTimer: {
    start: number
    exit: number
    enter: number
  }

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

  version: string

  rngCode: number
  skillCode?: number
  promoCodeTiming: {
    time: number
  }

  hepteracts: Record<HepteractKeys, HepteractValues>

  /*hepteractCrafts: {
    chronos: HepteractCraft
    hyperrealism: HepteractCraft
    quark: HepteractCraft
    challenge: HepteractCraft
    abyss: HepteractCraft
    accelerator: HepteractCraft
    acceleratorBoost: HepteractCraft
    multiplier: HepteractCraft
  }*/
  overfluxOrbs: number
  overfluxOrbsAutoBuy: boolean
  overfluxPowder: number
  dailyPowderResetUses: number
  autoWarpCheck: boolean

  singularityCount: number
  highestSingularityCount: number
  singularityCounter: number
  singularityElevatorTarget: number
  singularityElevatorSlowClimb: boolean
  singularityElevatorLocked: boolean
  singularityMatter: number
  goldenQuarks: number
  quarksThisSingularity: number
  totalQuarksEver: number
  hotkeys: Record<number, string[]>
  theme: string
  iconSet: number
  notation: 'Pure Scientific' | 'Pure Engineering' | 'Default'

  goldenQuarkUpgrades: Record<SingularityDataKeys, {
    level: number
    freeLevel: number
    goldenQuarksInvested: number
  }>

  octUpgrades: Record<OcteractUpgrades, {
    level: number
    freeLevel: number
    octeractsInvested: number
  }>

  ambrosiaUpgrades: Record<AmbrosiaUpgradeNames, {
    ambrosiaInvested: number
    blueberriesInvested: number
  }>

  dailyCodeUsed: boolean
  hepteractAutoCraftPercentage: number
  octeractTimer: number

  insideSingularityChallenge: boolean
  singularityChallenges: Record<
    SingularityChallengeDataKeys,
    SingularityChallenge
  >

  ambrosia: number
  lifetimeAmbrosia: number

  blueberryTime: number
  ambrosiaRNG: number // DEPRECIATED, DO NOT USE
  spentBlueberries: number
  brickOfLeadStrength: number

  blueberryLoadouts: Record<number, BlueberryOpt>
  blueberryLoadoutMode: BlueberryLoadoutMode

  redAmbrosia: number
  lifetimeRedAmbrosia: number
  redAmbrosiaTime: number
  redAmbrosiaUpgrades: Record<RedAmbrosiaNames, number>

  singChallengeTimer: number

  /**
   * When the player last exported the save.
   */
  lastExportedSave: number

  seed: number[]

  stats: {
    totalAddCodesUsed: number
  }
}

export interface GlobalVariables {
  upgradeCosts: number[]

  // Mega list of Variables to be used elsewhere
  crystalUpgradesCost: number[]
  crystalUpgradeCostIncrement: number[]

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
  totalMultiplierBoost: number

  globalCoinMultiplier: Decimal

  coinOneMulti: Decimal
  coinTwoMulti: Decimal
  coinThreeMulti: Decimal
  coinFourMulti: Decimal
  coinFiveMulti: Decimal

  globalCrystalMultiplier: Decimal
  globalMythosMultiplier: Decimal
  grandmasterMultiplier: Decimal

  mythosBuildingPower: number
  challengeThreeMultiplier: Decimal
  totalMythosOwned: number

  prestigePointGain: Decimal

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

  challengeBaseRequirements: number[]

  taxdivisor: Decimal
  taxdivisorcheck: Decimal

  mythosupgrade13: Decimal
  mythosupgrade14: Decimal
  mythosupgrade15: Decimal
  challengefocus: number

  maxexponent: number

  antMultiplier: Decimal

  talismanResourceObtainiumCosts: number[]
  talismanResourceOfferingCosts: number[]

  timeWarp: boolean

  triggerChallenge: number

  prevReductionValue: number

  buildingSubTab: BuildingSubtab

  autoOfferingCounter: number

  viscosityPower: number[]
  dilationMultiplier: number[]
  hyperchallengeMultiplier: number[]
  illiteracyPower: number[]
  deflationMultiplier: number[]
  extinctionDivisor: number[]
  droughtSalvage: number[]
  recessionPower: number[]

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

  constUpgradeCosts: ArrayStartingWithNull<number>

  globalConstantMult: Decimal

  corruptionTrigger: keyof Corruptions

  c15RewardFormulae: Record<Challenge15Rewards, (e: number) => number>
  challenge15Rewards: Challenge15RewardObject

  autoResetTimers: {
    prestige: number
    transcension: number
    reincarnation: number
    ascension: 0
  }

  timeMultiplier: number

  historyCountMax: number

  isEvent: boolean
  shopEnhanceVision: boolean

  ambrosiaTimer: number
  redAmbrosiaTimer: number
  TIME_PER_AMBROSIA: number
  TIME_PER_RED_AMBROSIA: number

  currentSingChallenge: SingularityChallengeDataKeys | undefined

  coinVanityThresholds: number[]
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
