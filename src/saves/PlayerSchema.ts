import Decimal from 'break_infinity.js'
import { z, ZodType } from 'zod'
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from '../CubeExperimental'
import { AbyssHepteract, AcceleratorBoostHepteract, AcceleratorHepteract, ChallengeHepteract, ChronosHepteract, HyperrealismHepteract, MultiplierHepteract, QuarkHepteract } from '../Hepteracts'
import { QuarkHandler } from '../Quark'

const decimalSchema = z.custom<Decimal>((value) => {
  try {
    new Decimal(value)
    return true
  } catch {
    return false
  }
}).transform((decimalSource) => new Decimal(decimalSource))

const arrayStartingWithNull = (s: ZodType) => z.array(z.union([z.null(), s]))
  .refine((arr) => arr.length > 0 && arr[0] === null, {
    message: 'First element must be null'
  })
  .refine((arr) => arr.slice(1).every((element) => typeof element === 'number'), {
    message: 'All elements after the first must be numbers'
  })

const ascendBuildingSchema = z.object({
  cost: z.number(),
  owned: z.number(),
  generated: decimalSchema,
  multiplier: z.number()
})

const singularityUpgradeSchema = (key: string) => z.object({
  level: z.number(),
  toggleBuy: z.number(),
  freeLevels: z.number(),
  [key]: z.number()
})

export const playerSchema = z.object({
  firstPlayed: z.string().datetime().optional().default(() => new Date().toISOString()),
  worlds: z.number().transform((obj) => {
    return new QuarkHandler({ quarks: obj })
  }),
  coins: decimalSchema,
  coinsThisPrestige: decimalSchema,
  coinsThisTranscension: decimalSchema,
  coinsThisReincarnation: decimalSchema,
  coinsTotal: decimalSchema,

  firstOwnedCoin: z.number(),
  firstGeneratedCoin: decimalSchema,
  firstCostCoin: decimalSchema,
  firstProduceCoin: z.number(),

  secondOwnedCoin: z.number(),
  secondGeneratedCoin: decimalSchema,
  secondCostCoin: decimalSchema,
  secondProduceCoin: z.number(),

  thirdOwnedCoin: z.number(),
  thirdGeneratedCoin: decimalSchema,
  thirdCostCoin: decimalSchema,
  thirdProduceCoin: z.number(),

  fourthOwnedCoin: z.number(),
  fourthGeneratedCoin: decimalSchema,
  fourthCostCoin: decimalSchema,
  fourthProduceCoin: z.number(),

  fifthOwnedCoin: z.number(),
  fifthGeneratedCoin: decimalSchema,
  fifthCostCoin: decimalSchema,
  fifthProduceCoin: z.number(),

  firstOwnedDiamonds: z.number(),
  firstGeneratedDiamonds: decimalSchema,
  firstCostDiamonds: decimalSchema,
  firstProduceDiamonds: z.number(),

  secondOwnedDiamonds: z.number(),
  secondGeneratedDiamonds: decimalSchema,
  secondCostDiamonds: decimalSchema,
  secondProduceDiamonds: z.number(),

  thirdOwnedDiamonds: z.number(),
  thirdGeneratedDiamonds: decimalSchema,
  thirdCostDiamonds: decimalSchema,
  thirdProduceDiamonds: z.number(),

  fourthOwnedDiamonds: z.number(),
  fourthGeneratedDiamonds: decimalSchema,
  fourthCostDiamonds: decimalSchema,
  fourthProduceDiamonds: z.number(),

  fifthOwnedDiamonds: z.number(),
  fifthGeneratedDiamonds: decimalSchema,
  fifthCostDiamonds: decimalSchema,
  fifthProduceDiamonds: z.number(),

  firstOwnedMythos: z.number(),
  firstGeneratedMythos: decimalSchema,
  firstCostMythos: decimalSchema,
  firstProduceMythos: z.number(),

  secondOwnedMythos: z.number(),
  secondGeneratedMythos: decimalSchema,
  secondCostMythos: decimalSchema,
  secondProduceMythos: z.number(),

  thirdOwnedMythos: z.number(),
  thirdGeneratedMythos: decimalSchema,
  thirdCostMythos: decimalSchema,
  thirdProduceMythos: z.number(),

  fourthOwnedMythos: z.number(),
  fourthGeneratedMythos: decimalSchema,
  fourthCostMythos: decimalSchema,
  fourthProduceMythos: z.number(),

  fifthOwnedMythos: z.number(),
  fifthGeneratedMythos: decimalSchema,
  fifthCostMythos: decimalSchema,
  fifthProduceMythos: z.number(),

  firstOwnedParticles: z.number(),
  firstGeneratedParticles: decimalSchema,
  firstCostParticles: decimalSchema,
  firstProduceParticles: z.number(),

  secondOwnedParticles: z.number(),
  secondGeneratedParticles: decimalSchema,
  secondCostParticles: decimalSchema,
  secondProduceParticles: z.number(),

  thirdOwnedParticles: z.number(),
  thirdGeneratedParticles: decimalSchema,
  thirdCostParticles: decimalSchema,
  thirdProduceParticles: z.number(),

  fourthOwnedParticles: z.number(),
  fourthGeneratedParticles: decimalSchema,
  fourthCostParticles: decimalSchema,
  fourthProduceParticles: z.number(),

  fifthOwnedParticles: z.number(),
  fifthGeneratedParticles: decimalSchema,
  fifthCostParticles: decimalSchema,
  fifthProduceParticles: z.number(),

  firstOwnedAnts: z.number(),
  firstGeneratedAnts: decimalSchema,
  firstCostAnts: decimalSchema,
  firstProduceAnts: z.number(),

  secondOwnedAnts: z.number(),
  secondGeneratedAnts: decimalSchema,
  secondCostAnts: decimalSchema,
  secondProduceAnts: z.number(),

  thirdOwnedAnts: z.number(),
  thirdGeneratedAnts: decimalSchema,
  thirdCostAnts: decimalSchema,
  thirdProduceAnts: z.number(),

  fourthOwnedAnts: z.number(),
  fourthGeneratedAnts: decimalSchema,
  fourthCostAnts: decimalSchema,
  fourthProduceAnts: z.number(),

  fifthOwnedAnts: z.number(),
  fifthGeneratedAnts: decimalSchema,
  fifthCostAnts: decimalSchema,
  fifthProduceAnts: z.number(),

  sixthOwnedAnts: z.number(),
  sixthGeneratedAnts: decimalSchema,
  sixthCostAnts: decimalSchema,
  sixthProduceAnts: z.number(),

  seventhOwnedAnts: z.number(),
  seventhGeneratedAnts: decimalSchema,
  seventhCostAnts: decimalSchema,
  seventhProduceAnts: z.number(),

  eighthOwnedAnts: z.number(),
  eighthGeneratedAnts: decimalSchema,
  eighthCostAnts: decimalSchema,
  eighthProduceAnts: z.number(),

  ascendBuilding1: ascendBuildingSchema,
  ascendBuilding2: ascendBuildingSchema,
  ascendBuilding3: ascendBuildingSchema,
  ascendBuilding4: ascendBuildingSchema,
  ascendBuilding5: ascendBuildingSchema,

  multiplierCost: decimalSchema,
  multiplierBought: z.number(),

  acceleratorCost: decimalSchema,
  acceleratorBought: z.number(),

  acceleratorBoostBought: z.number(),
  acceleratorBoostCost: decimalSchema,

  upgrades: z.number().array().length(141),

  prestigeCount: z.number(),
  transcendCount: z.number(),
  reincarnationCount: z.number(),

  prestigePoints: decimalSchema,
  transcendPoints: decimalSchema,
  reincarnationPoints: decimalSchema,

  prestigeShards: decimalSchema,
  transcendShards: decimalSchema,
  reincarnationShards: decimalSchema,

  toggles: z.record(z.string().regex(/^\d+$/), z.boolean().default(false)),

  challengecompletions: z.number().array(),
  highestchallengecompletions: z.union([z.number(), z.null()]).array(),
  challenge15Exponent: z.number(),
  highestChallenge15Exponent: z.number(),

  retrychallenges: z.boolean(),
  currentChallenge: z.object({
    transcension: z.number(),
    reincarnation: z.number(),
    ascension: z.number()
  }),
  researchPoints: z.number(),
  obtainiumtimer: z.number(),
  obtainiumpersecond: z.number(),
  maxobtainiumpersecond: z.number(),
  maxobtainium: z.number(),

  researches: z.number().array(),

  unlocks: z.record(z.string(), z.boolean()),
  achievements: z.number().array().length(281),

  achievementPoints: z.number(),

  prestigenomultiplier: z.boolean(),
  prestigenoaccelerator: z.boolean(),
  transcendnomultiplier: z.boolean(),
  transcendnoaccelerator: z.boolean(),
  reincarnatenomultiplier: z.boolean(),
  reincarnatenoaccelerator: z.boolean(),
  prestigenocoinupgrades: z.boolean(),
  transcendnocoinupgrades: z.boolean(),
  transcendnocoinorprestigeupgrades: z.boolean(),
  reincarnatenocoinupgrades: z.boolean(),
  reincarnatenocoinorprestigeupgrades: z.boolean(),
  reincarnatenocoinprestigeortranscendupgrades: z.boolean(),
  reincarnatenocoinprestigetranscendorgeneratorupgrades: z.boolean(),

  crystalUpgrades: z.number().array(),
  crystalUpgradesCost: z.number().array(),

  runelevels: z.number().array(),
  runeexp: z.number().array(),
  runeshards: z.number(),
  maxofferings: z.number(),
  offeringpersecond: z.number(),

  prestigecounter: z.number(),
  transcendcounter: z.number(),
  reincarnationcounter: z.number(),
  offlinetick: z.number(),

  prestigeamount: z.number(),
  transcendamount: z.number(),
  reincarnationamount: z.number(),

  fastestprestige: z.number(),
  fastesttranscend: z.number(),
  fastestreincarnate: z.number(),

  resettoggle1: z.number(),
  resettoggle2: z.number(),
  resettoggle3: z.number(),
  resettoggle4: z.number(),

  tesseractAutoBuyerToggle: z.number(),
  tesseractAutoBuyerAmount: z.number(),

  coinbuyamount: z.number(),
  crystalbuyamount: z.number(),
  mythosbuyamount: z.number(),
  particlebuyamount: z.number(),
  offeringbuyamount: z.number(),
  tesseractbuyamount: z.number(),

  shoptoggles: z.record(z.string(), z.boolean()),
  tabnumber: z.number(),
  subtabNumber: z.number(),

  codes: z.array(z.tuple([z.number(), z.boolean()])).transform((tuple) => new Map(tuple)),

  loaded1009: z.boolean(),
  loaded1009hotfix1: z.boolean(),
  loaded10091: z.boolean(),
  loaded1010: z.boolean(),
  loaded10101: z.boolean(),

  shopUpgrades: z.record(z.string(), z.union([z.number(), z.null()])),

  shopBuyMaxToggle: z.boolean(),
  shopHideToggle: z.boolean(),
  shopConfirmationToggle: z.boolean(),
  autoPotionTimer: z.number(),
  autoPotionTimerObtainium: z.number(),

  autoSacrificeToggle: z.boolean(),
  autoBuyFragment: z.boolean(),
  autoFortifyToggle: z.boolean(),
  autoEnhanceToggle: z.boolean(),
  autoResearchToggle: z.boolean(),
  researchBuyMaxToggle: z.boolean(),
  autoResearchMode: z.string(),
  autoResearch: z.number(),
  autoSacrifice: z.number(),
  sacrificeTimer: z.number(),
  quarkstimer: z.number(),
  goldenQuarksTimer: z.number(),

  antPoints: decimalSchema,
  antUpgrades: z.number().array(),
  antSacrificePoints: z.number(),
  antSacrificeTimer: z.number(),
  antSacrificeTimerReal: z.number(),

  talismanLevels: z.number().array(),
  talismanRarity: z.number().array(),
  talismanOne: arrayStartingWithNull(z.number()),
  talismanTwo: arrayStartingWithNull(z.number()),
  talismanThree: arrayStartingWithNull(z.number()),
  talismanFour: arrayStartingWithNull(z.number()),
  talismanFive: arrayStartingWithNull(z.number()),
  talismanSix: arrayStartingWithNull(z.number()),
  talismanSeven: arrayStartingWithNull(z.number()),
  talismanShards: z.number(),
  commonFragments: z.number(),
  uncommonFragments: z.number(),
  rareFragments: z.number(),
  epicFragments: z.number(),
  legendaryFragments: z.number(),
  mythicalFragments: z.number(),

  buyTalismanShardPercent: z.number(),

  autoAntSacrifice: z.boolean(),
  autoAntSacTimer: z.number(),
  autoAntSacrificeMode: z.number(),
  antMax: z.boolean(),

  ascensionCount: z.number(),
  ascensionCounter: z.number(),
  ascensionCounterReal: z.number(),
  ascensionCounterRealReal: z.number(),
  cubeUpgrades: arrayStartingWithNull(z.number()),
  cubeUpgradesBuyMaxToggle: z.boolean(),
  autoCubeUpgradesToggle: z.boolean(),
  autoPlatonicUpgradesToggle: z.boolean(),
  platonicUpgrades: z.number().array(),
  wowCubes: z.number().transform(() => new WowCubes(0)),
  wowTesseracts: z.number().transform(() => new WowTesseracts(0)),
  wowHypercubes: z.number().transform(() => new WowHypercubes(0)),
  wowPlatonicCubes: z.number().transform(() => new WowPlatonicCubes(0)),
  saveOfferingToggle: z.boolean(),
  wowAbyssals: z.number(),
  wowOcteracts: z.number(),
  totalWowOcteracts: z.number(),
  cubeBlessings: z.record(z.string(), z.number()),
  tesseractBlessings: z.record(z.string(), z.number()),
  hypercubeBlessings: z.record(z.string(), z.number()),
  platonicBlessings: z.record(z.string(), z.number()),

  // TODO: why are these on player?
  hepteractCrafts: z.object({
    chronos: z.any().transform(() => ChronosHepteract),
    hyperrealism: z.any().transform(() => HyperrealismHepteract),
    quark: z.any().transform(() =>QuarkHepteract),
    challenge: z.any().transform(() => ChallengeHepteract),
    abyss: z.any().transform(() => AbyssHepteract),
    accelerator: z.any().transform(() => AcceleratorHepteract),
    acceleratorBoost: z.any().transform(() => AcceleratorBoostHepteract),
    multiplier: z.any().transform(() => MultiplierHepteract)
  }),

  ascendShards: decimalSchema,
  autoAscend: z.boolean(),
  autoAscendMode: z.string(),
  autoAscendThreshold: z.number(),
  autoOpenCubes: z.boolean(),
  openCubes: z.number(),
  autoOpenTesseracts: z.boolean(),
  openTesseracts: z.number(),
  autoOpenHypercubes: z.boolean(),
  openHypercubes: z.number(),
  autoOpenPlatonicsCubes: z.boolean(),
  openPlatonicsCubes: z.number(),
  roombaResearchIndex: z.number(),
  ascStatToggles: z.record(z.string().regex(/^\d+$/), z.boolean()),

  prototypeCorruptions: z.number().array(),
  usedCorruptions: z.number().array(),
  corruptionLoadouts: z.record(z.string().regex(/^\d+$/), z.number().array()),
  corruptionLoadoutNames: z.string().array(),
  corruptionShowStats: z.boolean(),

  constantUpgrades: arrayStartingWithNull(z.number()),
  // TODO: real types
  history: z.object({
    ants: z.any().array(),
    ascend: z.any().array(),
    reset: z.any().array(),
    singularity: z.any().array()
  }),
  historyShowPerSecond: z.boolean(),

  autoChallengeRunning: z.boolean(),
  autoChallengeIndex: z.number(),
  autoChallengeToggles: z.boolean().array(),
  autoChallengeStartExponent: z.number(),
  autoChallengeTimer: z.record(z.string(), z.number()),

  runeBlessingLevels: z.number().array(),
  runeSpiritLevels: z.number().array(),
  runeBlessingBuyAmount: z.number(),
  runeSpiritBuyAmount: z.number(),

  autoTesseracts: z.boolean().array(),

  saveString: z.string(),
  exporttest: z.boolean(),

  dayCheck: z.string().datetime().nullable(),
  dayTimer: z.number(),
  cubeOpenedDaily: z.number(),
  cubeQuarkDaily: z.number(),
  tesseractOpenedDaily: z.number(),
  tesseractQuarkDaily: z.number(),
  hypercubeOpenedDaily: z.number(),
  hypercubeQuarkDaily: z.number(),
  platonicCubeOpenedDaily: z.number(),
  platonicCubeQuarkDaily: z.number(),
  overfluxOrbs: z.number(),
  overfluxOrbsAutoBuy: z.boolean(),
  overfluxPowder: z.number(),
  dailyPowderResetUses: z.number(),
  autoWarpCheck: z.boolean(),
  loadedOct4Hotfix: z.boolean(),
  loadedNov13Vers: z.boolean(),
  loadedDec16Vers: z.boolean(),
  loadedV253: z.boolean(),
  loadedV255: z.boolean(),
  loadedV297Hotfix1: z.boolean(),
  loadedV2927Hotfix1: z.boolean(),
  loadedV2930Hotfix1: z.boolean(),
  loadedV2931Hotfix1: z.boolean(),
  loadedV21003Hotfix1: z.boolean(),
  loadedV21007Hotfix1: z.boolean(),
  version: z.string(),
  rngCode: z.number(),
  promoCodeTiming: z.record(z.string(), z.number()),
  singularityCount: z.number(),
  highestSingularityCount: z.number(),
  singularityCounter: z.number(),
  goldenQuarks: z.number(),
  quarksThisSingularity: z.number().nullable(),
  totalQuarksEver: z.number(),
  hotkeys: z.record(z.number(), z.string().array()),
  theme: z.string(),
  iconSet: z.number(),
  notation: z.string(),

  // TODO: why is this on player?
  singularityUpgrades: z.record(z.string(), singularityUpgradeSchema('goldenQuarksInvested')),
  octeractUpgrades: z.record(z.string(), singularityUpgradeSchema('octeractsInvested')),

  dailyCodeUsed: z.boolean(),
  hepteractAutoCraftPercentage: z.number(),
  octeractTimer: z.number(),
  insideSingularityChallenge: z.boolean(),

  singularityChallenges: z.record(z.string(), z.object({
    completions: z.number(),
    highestSingularityCompleted: z.number(),
    enabled: z.boolean()
  })),

  ambrosia: z.number(),
  lifetimeAmbrosia: z.number(),
  ambrosiaRNG: z.number(),
  blueberryTime: z.number(),
  visitedAmbrosiaSubtab: z.boolean(),
  spentBlueberries: z.number(),
  // TODO: is this right?
  blueberryUpgrades:  z.record(z.string(), singularityUpgradeSchema('blueberriesInvested')),

  // TODO: what type?
  blueberryLoadouts: z.record(z.string().regex(/^\d+$/), z.any()),
  blueberryLoadoutMode: z.string(),

  ultimateProgress: z.number(),
  ultimatePixels: z.number(),

  // TODO: what type?
  caches: z.record(z.string(), z.any()),

  lastExportedSave: z.number()
})
