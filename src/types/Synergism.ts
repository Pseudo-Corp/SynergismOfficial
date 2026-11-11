import type Decimal from 'break_infinity.js'
import type { ProgressiveAchievements } from '../Achievements'
import type { AmbrosiaUpgradeNames, BlueberryLoadoutMode, BlueberryOpt } from '../BlueberryUpgrades'
import type { Challenge15RewardObject, Challenge15Rewards } from '../Challenges'
import type { PlayerAnts } from '../Features/Ants/structs/structs'
import type {
  HeaderModuleId,
  HeaderModuleSize,
  HeaderRegionId,
  LoadoutPageModuleId,
  RainbowAmbrosiaModuleId
} from '../HeaderLayoutDefaults'
import type { HepteractKeys, HepteractValues } from '../Hepteracts'
import type { Category, ResetHistoryEntryUnion } from '../History'
import type { OcteractUpgrades } from '../Octeracts'
import type { PurpleReactorNames } from '../Purple'
import type { PurpleAmbrosiaNames } from '../PurpleAmbrosiaUpgrades'
import type { RedAmbrosiaNames } from '../RedAmbrosiaUpgrades'
import type { RuneType } from '../Runes'
import type { ShopUpgradeNames } from '../Shop'
import type { SingularityDataKeys } from '../singularity'
import type { SingularityChallengeDataKeys } from '../SingularityChallenges'
import type { SynthesisUpgrades } from '../Synthesis'
import type { Tabs } from '../Tabs'
import type { TalismanCraftItems, TalismanKeys } from '../Talismans'
import type { AutoAscensionModes, AutoResetModes } from '../Toggles'

type ArrayStartingWithNull<T> = [null, ...T[]]

export type BuyAmount = 1 | 10 | 100 | 1000 | 10_000 | 100_000

export interface HeaderLayout {
  columns: number
  regions: Record<HeaderRegionId, HeaderModuleId[][]>
  sizes: Partial<Record<HeaderModuleId, HeaderModuleSize>>
  positions: Partial<Record<HeaderModuleId, number>>
  hidden: HeaderModuleId[]
  rainbowAmbrosia: RainbowAmbrosiaModuleId
  octeractPerSecond: boolean
  loadoutPages: Record<LoadoutPageModuleId, number>
  loadoutIcons: {
    ambrosiaLoadoutsHeader: Partial<Record<number, AmbrosiaUpgradeNames>>
  }
}

export interface Player {
  firstPlayed: string
  worlds: number
  coins: Decimal
  coinsThisPrestige: Decimal
  coinsThisTranscension: Decimal
  coinsThisReincarnation: Decimal
  coinsThisAscension: Decimal
  coinsThisSingularity: Decimal
  coinsTotal: Decimal

  firstGeneratedCoin: Decimal
  secondGeneratedCoin: Decimal
  thirdGeneratedCoin: Decimal
  fourthGeneratedCoin: Decimal
  fifthGeneratedCoin: Decimal
  firstGeneratedDiamonds: Decimal
  secondGeneratedDiamonds: Decimal
  thirdGeneratedDiamonds: Decimal
  fourthGeneratedDiamonds: Decimal
  fifthGeneratedDiamonds: Decimal
  firstGeneratedMythos: Decimal
  secondGeneratedMythos: Decimal
  thirdGeneratedMythos: Decimal
  fourthGeneratedMythos: Decimal
  fifthGeneratedMythos: Decimal
  firstGeneratedParticles: Decimal
  secondGeneratedParticles: Decimal
  thirdGeneratedParticles: Decimal
  fourthGeneratedParticles: Decimal
  fifthGeneratedParticles: Decimal

  ants: PlayerAnts

  ascendBuilding1: {
    paid: number
    generated: Decimal
  }
  ascendBuilding2: {
    paid: number
    generated: Decimal
  }
  ascendBuilding3: {
    paid: number
    generated: Decimal
  }
  ascendBuilding4: {
    paid: number
    generated: Decimal
  }
  ascendBuilding5: {
    paid: number
    generated: Decimal
  }

  coinBuildings: number[]
  diamondBuildings: number[]
  mythosBuildings: number[]
  particleBuildings: number[]
  accelerators: number
  multipliers: number
  acceleratorBoosts: number

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

  retrychallenges: boolean
  currentChallenge: {
    transcension: number
    reincarnation: number
    ascension: number
  }

  obtainium: Decimal
  maxObtainium: Decimal

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

  runeEXP: Decimal[]
  runeLevels: number[]
  runeFreeLevels: number[]
  blessingEXP: Decimal[]
  blessingLevels: number[]
  spiritEXP: Decimal[]
  spiritLevels: number[]

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
  codes: number[]

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
  autoResearchToggle: boolean
  researchBuyMaxToggle: boolean
  autoResearchMode: 'cheapest' | 'manual'
  autoResearch: number
  autoSacrificeRune: RuneType | null
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
  ascensionAttemptCounter: number
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
  wowCubes: number
  wowTesseracts: number
  wowHypercubes: number
  wowPlatonicCubes: number
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
  autoAscendRules: string
  roombaResearchIndex: number
  ascStatToggles: Record<number, boolean>

  corruptions: {
    next: number
    used: number
    ascensionLevel: number
    tokenCompletions: number[]
    ascensionStartTokens: number
    highestCleared: number
    autoIncrease: boolean
    cleanseToHighest: boolean
    showRealTime: boolean
    loadouts: number[]
  }

  constantUpgrades: ArrayStartingWithNull<number>
  history: Record<Category, ResetHistoryEntryUnion[]>
  historyShowPerSecond: boolean

  autoChallengeRunning: boolean
  autoChallengeToggles: boolean[]
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

  dayCheck: string | null
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
  goldenQuarks: number
  quarksThisSingularity: number
  totalQuarksEver: number
  hotkeys: Record<number, string[]>
  iconSet: number
  notation: 'Pure Scientific' | 'Pure Engineering' | 'Default'
  headerLayouts: Record<'desktop' | 'mobile', HeaderLayout>

  goldenQuarkUpgrades: Record<SingularityDataKeys, {
    freeLevel: number
    goldenQuarksInvested: number
  }>

  octUpgrades: Record<OcteractUpgrades, {
    freeLevel: number
    octeractsInvested: number
  }>

  ambrosiaUpgrades: Record<AmbrosiaUpgradeNames, {
    ambrosiaInvested: number
    blueberriesInvested: number
    purpleAmbrosiaInvested?: number
  }>

  dailyCodeUsed: boolean
  hepteractAutoCraftPercentage: number
  octeractTimer: number

  insideSingularityChallenge: boolean
  singularityChallenges: Record<
    SingularityChallengeDataKeys,
    { completions: number; highestSingularityCompleted: number; enabled: boolean }
  >

  ambrosia: number
  lifetimeAmbrosia: number
  purpleAmbrosia: number
  lifetimePurpleAmbrosia: number

  blueberryTime: number
  spentBlueberries: number

  blueberryLoadouts: Record<number, BlueberryOpt>
  blueberryLoadoutMode: BlueberryLoadoutMode

  redAmbrosia: number
  lifetimeRedAmbrosia: number
  redAmbrosiaTime: number
  redAmbrosiaUpgrades: Record<RedAmbrosiaNames, number>
  purpleAmbrosiaUpgrades: Record<PurpleAmbrosiaNames, number>

  purpleHoneyProgress: number
  encabulatorOvercapToggle: boolean

  purpleReactor: {
    purpleHoney: number
    lifetimePurpleHoney: number
    storedAmbrosiaBarPoints: number
    storedRedAmbrosiaBarPoints: number
    ambrosiaBarPointPercentage: number
    redAmbrosiaBarPointPercentage: number
  }

  spentPurpleHoney: {
    upgrades: number
    purpleAmbrosia: number
  }

  purpleReactorUpgrades: Record<PurpleReactorNames, number>
  synthesisUpgrades: SynthesisUpgrades
  synthesisAutomationUnlocked: boolean
  synthesisAutomationEnabled: boolean

  singChallengeTimer: number

  /**
   * When the player last exported the save.
   */
  lastExportedSave: number

  seed: number[]

  stats: {
    totalAddCodesUsed: number
    highestPurpleHoney: number
    talismanShardsThisAscension: Decimal
  }

  purpleUpdateQuarkRefundAwarded: boolean
}

export interface GlobalVariables {
  upgradeCosts: number[]

  // Mega list of Variables to be used elsewhere
  crystalUpgradesCost: number[]
  crystalUpgradeCostIncrement: number[]

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

  challengefocus: number

  talismanResourceObtainiumCosts: number[]
  talismanResourceOfferingCosts: number[]

  timeWarp: boolean
  testingDtMultiplier: number

  triggerChallenge: number

  buildingSubTab: BuildingSubtab

  autoOfferingCounter: number

  constUpgradeCosts: ArrayStartingWithNull<number>

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

  purpleReactorTimer: number
  TIME_PER_AMBROSIA: number
  TIME_PER_RED_AMBROSIA: number

  currentSingChallenge: SingularityChallengeDataKeys | undefined

  coinVanityThresholds: number[]

  dOne: Decimal
  d0_5: Decimal
  d0_001: Decimal
  d0_0001: Decimal
  d100: Decimal
  d500: Decimal
  d10000: Decimal
  d100000: Decimal
  d4e6: Decimal
  d4_32e10: Decimal
  d1e11: Decimal
  d1e12: Decimal
  d1e16: Decimal
  d1e20: Decimal
  d6_9e21: Decimal
  d1e25: Decimal
  d1e30: Decimal
  d1_509e33: Decimal
  d1e40: Decimal
  d1e50: Decimal
  d1e66: Decimal
  d1e100: Decimal
  d1e200: Decimal
  d1e300: Decimal
  d1e308: Decimal
  d1e250: Decimal
  d1_8e308: Decimal
  d1e1000: Decimal
  d1e1500: Decimal
  d1e2500: Decimal
  d1e5000: Decimal
  d1e7777: Decimal
  d1e10000: Decimal
  d1e15000: Decimal
  d1e25000: Decimal
  d1e50000: Decimal
  d1e77777: Decimal
  d1e99999: Decimal
  d1e100000: Decimal
  d1e120000: Decimal
  d1e125000: Decimal
  d1e250000: Decimal
  d1e300000: Decimal
  d1e1000000: Decimal
  d1e2000000: Decimal
  d1e2500000: Decimal
  d1e5000000: Decimal
  d1e10000000: Decimal
  d1e25000000: Decimal
  d1e50000000: Decimal
  d1e100000000: Decimal
  d1e2500000000: Decimal
  d1e10000000000: Decimal
  d1e100000000000: Decimal
  d1e2500000000000: Decimal

  MIND_DIVISOR: number
  GLOBAL_RESET_THRESHOLD: number
  ASCENSION_RESET_THRESHOLD: number
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

export type BuildingSubtab =
  | 'coin'
  | 'diamond'
  | 'mythos'
  | 'particle'
  | 'tesseract'

export type ZeroToFour = 0 | 1 | 2 | 3 | 4

export type OneToFive = 1 | 2 | 3 | 4 | 5
