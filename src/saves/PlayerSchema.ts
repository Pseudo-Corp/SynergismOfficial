import Decimal from 'break_infinity.js'
import { z, ZodType } from 'zod'
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from '../CubeExperimental'
import {
  AbyssHepteract,
  AcceleratorBoostHepteract,
  AcceleratorHepteract,
  ChallengeHepteract,
  ChronosHepteract,
  HyperrealismHepteract,
  MultiplierHepteract,
  QuarkHepteract
} from '../Hepteracts'
import { QuarkHandler } from '../Quark'
import { blankSave } from '../Synergism'

const decimalSchema = z.custom<Decimal>((value) => {
  try {
    new Decimal(value)
    return true
  } catch {
    return false
  }
}).transform((decimalSource) => new Decimal(decimalSource))

const arrayStartingWithNull = (s: ZodType) =>
  z.array(z.union([z.null(), s]))
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

const singularityUpgradeSchema = (key: string) =>
  z.object({
    level: z.number(),
    toggleBuy: z.number(),
    freeLevels: z.number(),
    [key]: z.number()
  })

const toggleSchema = z.record(z.string(), z.boolean()).transform((record) => {
  return Object.fromEntries(
    Object.entries(record).filter(([key, _value]) => /^\d+$/.test(key))
  )
})

const decimalStringSchema = z.string().regex(/^-?\d+(\.\d{1,2})?$/)
const integerStringSchema = z.string().regex(/^\d+$/)

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

  toggles: toggleSchema,

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
  achievements: z.number().array().transform((array) => {
    if (array.length < blankSave.achievements.length) {
      array.push(...blankSave.achievements.slice(0, blankSave.achievements.length - array.length))
    }

    return array
  }),

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

  prestigeamount: z.union([z.number(), decimalStringSchema.transform(Number)]),
  transcendamount: z.union([z.number(), decimalStringSchema.transform(Number)]),
  reincarnationamount: z.union([z.number(), decimalStringSchema.transform(Number)]),

  fastestprestige: z.number(),
  fastesttranscend: z.number(),
  fastestreincarnate: z.number(),

  resettoggle1: z.number(),
  resettoggle2: z.number(),
  resettoggle3: z.number(),
  resettoggle4: z.number().default(() => blankSave.resettoggle4),

  tesseractAutoBuyerToggle: z.number().default(() => blankSave.tesseractAutoBuyerToggle),
  tesseractAutoBuyerAmount: z.number().default(() => blankSave.tesseractAutoBuyerAmount),

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

  shopUpgrades: z.record(z.string(), z.union([z.number(), z.null(), z.boolean()])),

  shopBuyMaxToggle: z.union([z.boolean(), z.string()]).default(() => blankSave.shopBuyMaxToggle),
  shopHideToggle: z.boolean().default(() => blankSave.shopHideToggle),
  shopConfirmationToggle: z.boolean().default(() => blankSave.shopConfirmationToggle),
  autoPotionTimer: z.number().default(() => blankSave.autoPotionTimer),
  autoPotionTimerObtainium: z.number().default(() => blankSave.autoPotionTimerObtainium),

  autoSacrificeToggle: z.boolean(),
  autoBuyFragment: z.boolean().default(() => blankSave.autoBuyFragment),
  autoFortifyToggle: z.boolean().default(() => blankSave.autoFortifyToggle),
  autoEnhanceToggle: z.boolean().default(() => blankSave.autoEnhanceToggle),
  autoResearchToggle: z.boolean(),
  researchBuyMaxToggle: z.boolean().default(() => blankSave.researchBuyMaxToggle),
  autoResearchMode: z.string().default(() => blankSave.autoResearchMode),
  autoResearch: z.number(),
  autoSacrifice: z.number(),
  sacrificeTimer: z.number(),
  quarkstimer: z.number(),
  goldenQuarksTimer: z.number().default(() => blankSave.goldenQuarksTimer),

  antPoints: decimalSchema,
  antUpgrades: z.union([z.number().array(), arrayStartingWithNull(z.number()).transform((array) => array.slice(1))]),
  antSacrificePoints: z.number(),
  antSacrificeTimer: z.number(),
  antSacrificeTimerReal: z.number(),

  talismanLevels: z.union([z.number().array(), arrayStartingWithNull(z.number()).transform((array) => array.slice(1))]),
  talismanRarity: z.union([z.number().array(), arrayStartingWithNull(z.number()).transform((array) => array.slice(1))]),
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
  ascensionCounterReal: z.number().default(() => blankSave.ascensionCounterReal),
  ascensionCounterRealReal: z.number().default(() => blankSave.ascensionCounterRealReal),
  cubeUpgrades: arrayStartingWithNull(z.number()),
  cubeUpgradesBuyMaxToggle: z.boolean().default(() => blankSave.cubeUpgradesBuyMaxToggle),
  autoCubeUpgradesToggle: z.boolean().default(() => blankSave.autoCubeUpgradesToggle),
  autoPlatonicUpgradesToggle: z.boolean().default(() => blankSave.autoPlatonicUpgradesToggle),
  platonicUpgrades: z.number().array(),
  wowCubes: z.number().transform(() => new WowCubes(0)),
  wowTesseracts: z.number().transform(() => new WowTesseracts(0)),
  wowHypercubes: z.number().transform(() => new WowHypercubes(0)),
  wowPlatonicCubes: z.number().transform(() => new WowPlatonicCubes(0)),
  saveOfferingToggle: z.boolean().default(() => blankSave.saveOfferingToggle),
  wowAbyssals: z.number(),
  wowOcteracts: z.number().default(() => blankSave.wowOcteracts),
  totalWowOcteracts: z.number().default(() => blankSave.totalWowOcteracts),
  cubeBlessings: z.record(z.string(), z.number()),
  tesseractBlessings: z.record(z.string(), z.number()),
  hypercubeBlessings: z.record(z.string(), z.number()),
  platonicBlessings: z.record(z.string(), z.number()).default(() => ({ ...blankSave.platonicBlessings })),

  // TODO: why are these on player?
  hepteractCrafts: z.object({
    chronos: z.any().transform(() => ChronosHepteract),
    hyperrealism: z.any().transform(() => HyperrealismHepteract),
    quark: z.any().transform(() => QuarkHepteract),
    challenge: z.any().transform(() => ChallengeHepteract),
    abyss: z.any().transform(() => AbyssHepteract),
    accelerator: z.any().transform(() => AcceleratorHepteract),
    acceleratorBoost: z.any().transform(() => AcceleratorBoostHepteract),
    multiplier: z.any().transform(() => MultiplierHepteract)
  }).default(() => blankSave.hepteractCrafts),

  ascendShards: decimalSchema,
  autoAscend: z.boolean(),
  autoAscendMode: z.string(),
  autoAscendThreshold: z.number(),
  autoOpenCubes: z.boolean().default(() => blankSave.autoOpenCubes),
  openCubes: z.number().default(() => blankSave.openCubes),
  autoOpenTesseracts: z.boolean().default(() => blankSave.autoOpenTesseracts),
  openTesseracts: z.number().default(() => blankSave.openTesseracts),
  autoOpenHypercubes: z.boolean().default(() => blankSave.autoOpenHypercubes),
  openHypercubes: z.number().default(() => blankSave.openHypercubes),
  autoOpenPlatonicsCubes: z.boolean().default(() => blankSave.autoOpenPlatonicsCubes),
  openPlatonicsCubes: z.number().default(() => blankSave.openPlatonicsCubes),
  roombaResearchIndex: z.number(),
  ascStatToggles: z.record(integerStringSchema, z.boolean()),

  prototypeCorruptions: z.number().array(),
  usedCorruptions: z.number().array(),
  corruptionLoadouts: z.record(integerStringSchema, z.number().array()),
  corruptionLoadoutNames: z.string().array().default(() => blankSave.corruptionLoadoutNames.slice()),
  corruptionShowStats: z.boolean(),

  constantUpgrades: arrayStartingWithNull(z.number()),
  // TODO: real types
  history: z.object({
    ants: z.any().array(),
    ascend: z.any().array(),
    reset: z.any().array(),
    singularity: z.any().array().default(() => blankSave.history.singularity.slice())
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
  exporttest: z.union([z.string(), z.boolean()]).transform((value) => {
    if (typeof value === 'string') {
      return value === 'YES!'
    }

    return value
  }),

  dayCheck: z.string().datetime().nullable(),
  dayTimer: z.number(),
  cubeOpenedDaily: z.number(),
  cubeQuarkDaily: z.number(),
  tesseractOpenedDaily: z.number(),
  tesseractQuarkDaily: z.number(),
  hypercubeOpenedDaily: z.number(),
  hypercubeQuarkDaily: z.number(),
  platonicCubeOpenedDaily: z.number().default(() => blankSave.platonicCubeOpenedDaily),
  platonicCubeQuarkDaily: z.number().default(() => blankSave.platonicCubeQuarkDaily),
  overfluxOrbs: z.number().default(() => blankSave.overfluxOrbs),
  overfluxOrbsAutoBuy: z.boolean().default(() => blankSave.overfluxOrbsAutoBuy),
  overfluxPowder: z.number().default(() => blankSave.overfluxPowder),
  dailyPowderResetUses: z.number().default(() => blankSave.dailyPowderResetUses),
  autoWarpCheck: z.boolean().default(() => blankSave.autoWarpCheck),
  loadedOct4Hotfix: z.boolean(),
  loadedNov13Vers: z.boolean().default(() => blankSave.loadedNov13Vers),
  loadedDec16Vers: z.boolean().default(() => blankSave.loadedDec16Vers),
  loadedV253: z.boolean().default(() => blankSave.loadedV253),
  loadedV255: z.boolean().default(() => blankSave.loadedV255),
  loadedV297Hotfix1: z.boolean().default(() => blankSave.loadedV297Hotfix1),
  loadedV2927Hotfix1: z.boolean().default(() => blankSave.loadedV2927Hotfix1),
  loadedV2930Hotfix1: z.boolean().default(() => blankSave.loadedV2930Hotfix1),
  loadedV2931Hotfix1: z.boolean().default(() => blankSave.loadedV2931Hotfix1),
  loadedV21003Hotfix1: z.boolean().default(() => blankSave.loadedV21003Hotfix1),
  loadedV21007Hotfix1: z.boolean().default(() => blankSave.loadedV21007Hotfix1),
  version: z.string(),
  rngCode: z.number().default(() => blankSave.rngCode),
  promoCodeTiming: z.record(z.string(), z.number()).default(() => ({ time: Date.now() - 60 * 1000 * 15 })),
  singularityCount: z.number().default(() => blankSave.singularityCount),
  highestSingularityCount: z.number().default(() => blankSave.highestSingularityCount),
  singularityCounter: z.number().default(() => blankSave.singularityCount),
  goldenQuarks: z.number().default(() => blankSave.goldenQuarks),
  quarksThisSingularity: z.number().nullable().default(() => blankSave.quarksThisSingularity),
  totalQuarksEver: z.number().default(() => blankSave.totalQuarksEver),
  hotkeys: z.record(z.number(), z.string().array()).default(() => blankSave.hotkeys),
  theme: z.string().default(() => blankSave.theme),
  iconSet: z.number().default(() => blankSave.iconSet),
  notation: z.string().default(() => blankSave.notation),

  // TODO: why is this on player?
  singularityUpgrades: z.record(z.string(), singularityUpgradeSchema('goldenQuarksInvested'))
    .default(() => JSON.parse(JSON.stringify(blankSave.singularityUpgrades))),
  octeractUpgrades: z.record(z.string(), singularityUpgradeSchema('octeractsInvested'))
    .default(() => JSON.parse(JSON.stringify(blankSave.octeractUpgrades))),

  dailyCodeUsed: z.boolean().default(() => blankSave.dailyCodeUsed),
  hepteractAutoCraftPercentage: z.number().default(() => blankSave.hepteractAutoCraftPercentage),
  octeractTimer: z.number().default(() => blankSave.octeractTimer),
  insideSingularityChallenge: z.boolean().default(() => blankSave.insideSingularityChallenge),

  singularityChallenges: z.record(
    z.string(),
    z.object({
      completions: z.number(),
      highestSingularityCompleted: z.number(),
      enabled: z.boolean()
    })
  ).default(() => JSON.parse(JSON.stringify(blankSave.singularityChallenges))),

  ambrosia: z.number().default(() => blankSave.ambrosia),
  lifetimeAmbrosia: z.number().default(() => blankSave.lifetimeAmbrosia),
  ambrosiaRNG: z.number().default(() => blankSave.ambrosiaRNG),
  blueberryTime: z.number().default(() => blankSave.blueberryTime),
  visitedAmbrosiaSubtab: z.boolean().default(() => blankSave.visitedAmbrosiaSubtab),
  spentBlueberries: z.number().default(() => blankSave.spentBlueberries),
  // TODO: is this right?
  blueberryUpgrades: z.record(z.string(), singularityUpgradeSchema('blueberriesInvested'))
    .default(() => JSON.parse(JSON.stringify(blankSave.blueberryUpgrades))),

  // TODO: what type?
  blueberryLoadouts: z.record(integerStringSchema, z.any()).default(() => blankSave.blueberryLoadouts),
  blueberryLoadoutMode: z.string().default(() => blankSave.blueberryLoadoutMode),

  ultimateProgress: z.number().default(() => blankSave.ultimateProgress),
  ultimatePixels: z.number().default(() => blankSave.ultimatePixels),

  // TODO: what type?
  caches: z.record(z.string(), z.any()).default(() => blankSave.caches),

  lastExportedSave: z.number().default(() => blankSave.lastExportedSave)
})
