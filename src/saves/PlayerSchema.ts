import Decimal, { type DecimalSource } from 'break_infinity.js'
import { z, type ZodNumber, type ZodType } from 'zod'
import { CampaignManager, type ICampaignManagerData } from '../Campaign'
import { CorruptionLoadout, CorruptionSaves } from '../Corruptions'
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from '../CubeExperimental'
import { type HepteractKeys, hepteracts } from '../Hepteracts'
import { QuarkHandler } from '../Quark'
import {
  SingularityChallenge,
  singularityChallengeData,
  type SingularityChallengeDataKeys
} from '../SingularityChallenges'
import { blankSave, deepClone } from '../Synergism'
import { noTalismanFragments } from '../Talismans'
import type { Player } from '../types/Synergism'
import { padArray, sumContents } from '../Utility'

const decimalSchema = z.custom<DecimalSource>((value) => {
  try {
    new Decimal(value)
    return true
  } catch {
    return false
  }
}).transform((decimalSource) => new Decimal(decimalSource))

const arrayStartingWithNull = (s: ZodType) => z.tuple([z.null()]).rest(s)

const arrayExtend = <
  K extends keyof Player,
  Value extends Player[K] extends Array<infer V> ? V[] : never
>(array: Value, k: K) => {
  const b = blankSave[k] as Value
  if (array.length < b.length) {
    array.push(...b.slice(array.length))
  }
  return array
}

const buyAmount = z.number().refine((arg) =>
  arg === 1 || arg === 10 || arg === 100 || arg === 1000 || arg === 10_000 || arg === 100_000
).default(1)

const ascendBuildingSchema = z.object({
  cost: z.number(),
  owned: z.number(),
  generated: decimalSchema,
  multiplier: z.number()
})

const singularityUpgradeSchema = (...keys: string[]) => {
  return z.object<Record<'level' | 'freeLevels' | typeof keys[number], ZodNumber>>({
    level: z.number(),
    freeLevels: z.number(),
    ...keys.reduce((accum, value) => {
      accum[value] = z.number()
      return accum
    }, {} as Record<string, ZodType>)
  })
}

const toggleSchema = z.record(z.string(), z.boolean()).transform((record) => {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => /^\d+$/.test(key))
  )
}).transform((record) => {
  const entries = Object.entries(blankSave.toggles)

  for (const entry of entries) {
    if (!Object.hasOwn(record, entry[0])) {
      record[entry[0]] = entry[1]
    }
  }

  return record
})

const decimalStringSchema = z.string().regex(/^|-?\d+(\.\d{1,2})?$/)
const integerStringSchema = z.string().regex(/^\d+$/)

// TODO: FUCK THIS SHIT.
const hepteractCraftSchema = (k: HepteractKeys) =>
  z.object({
    AUTO: z.boolean().default(() => blankSave.hepteracts[k].AUTO),
    BAL: z.number().default(() => blankSave.hepteracts[k].BAL),
    BASE_CAP: z.number().default(() => hepteracts[k].BASE_CAP),
    CAP: z.number().default(() => 1000),
    DISCOUNT: z.number().default(() => 0),
    HEPTERACT_CONVERSION: z.number(),
    HTML_STRING: z.string().default(() => k),
    OTHER_CONVERSIONS: z.record(z.string(), z.number()),
    UNLOCKED: z.boolean().default(() => false)
  })

const newHepteractCraftSchema = z.object({
  BAL: z.number(),
  TIMES_CAP_EXTENDED: z.number(),
  AUTO: z.boolean()
})

const optionalCorruptionSchema = z.object({
  viscosity: z.number().optional().default(0),
  drought: z.number().optional().default(0),
  deflation: z.number().optional().default(0),
  extinction: z.number().optional().default(0),
  illiteracy: z.number().optional().default(0),
  recession: z.number().optional().default(0),
  dilation: z.number().optional().default(0),
  hyperchallenge: z.number().optional().default(0)
})

const talismanFragmentSchema = z.object({
  shard: decimalSchema.default(() => new Decimal(0)),
  commonFragment: decimalSchema.default(() => new Decimal(0)),
  uncommonFragment: decimalSchema.default(() => new Decimal(0)),
  rareFragment: decimalSchema.default(() => new Decimal(0)),
  epicFragment: decimalSchema.default(() => new Decimal(0)),
  legendaryFragment: decimalSchema.default(() => new Decimal(0)),
  mythicalFragment: decimalSchema.default(() => new Decimal(0))
})

const goldenQuarkUpgradeSchema = z.object({
  level: z.number().default(0),
  freeLevel: z.number().default(0),
  goldenQuarksInvested: z.number().default(0)
})

const octeractUpgradeSchema = z.object({
  level: z.number().default(0),
  freeLevel: z.number().default(0),
  octeractsInvested: z.number().default(0)
})

const ambrosiaUpgradeSchema = z.object({
  ambrosiaInvested: z.number().default(0),
  blueberriesInvested: z.number().default(0)
})

export const playerCorruptionSchema = z.object({
  used: optionalCorruptionSchema.transform((value) => {
    return new CorruptionLoadout(value)
  }),
  next: optionalCorruptionSchema.transform((value) => {
    return new CorruptionLoadout(value)
  }),
  saves: z.record(z.string(), optionalCorruptionSchema).transform((value) => {
    return new CorruptionSaves(value)
  }),
  showStats: z.boolean()
}).default(() => JSON.parse(JSON.stringify(blankSave.corruptions)))

export const campaignSchema = z.object({
  currentCampaign: z.string().optional(),
  campaigns: z.record(z.string(), z.number()).optional()
})

export const playerCampaignSchema = campaignSchema.transform((campaignData) => {
  return new CampaignManager(campaignData as ICampaignManagerData)
}).default(() => JSON.parse(JSON.stringify(blankSave.campaigns)))

export const playerSchema = z.object({
  firstPlayed: z.string().datetime().optional().default(() => new Date().toISOString()),
  worlds: z.number().transform((quarks) => new QuarkHandler(quarks)),
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

  firstOwnedAnts: z.number().default(() => blankSave.firstOwnedAnts),
  firstGeneratedAnts: decimalSchema,
  firstCostAnts: decimalSchema,
  firstProduceAnts: z.number().default(() => blankSave.firstProduceAnts),

  secondOwnedAnts: z.number().default(() => blankSave.secondOwnedAnts),
  secondGeneratedAnts: decimalSchema,
  secondCostAnts: decimalSchema,
  secondProduceAnts: z.number().default(() => blankSave.secondProduceAnts),

  thirdOwnedAnts: z.number().default(() => blankSave.thirdOwnedAnts),
  thirdGeneratedAnts: decimalSchema,
  thirdCostAnts: decimalSchema,
  thirdProduceAnts: z.number().default(() => blankSave.thirdProduceAnts),

  fourthOwnedAnts: z.number().default(() => blankSave.fourthOwnedAnts),
  fourthGeneratedAnts: decimalSchema,
  fourthCostAnts: decimalSchema,
  fourthProduceAnts: z.number().default(() => blankSave.fourthProduceAnts),

  fifthOwnedAnts: z.number().default(() => blankSave.fifthOwnedAnts),
  fifthGeneratedAnts: decimalSchema,
  fifthCostAnts: decimalSchema,
  fifthProduceAnts: z.number().default(() => blankSave.fifthProduceAnts),

  sixthOwnedAnts: z.number().default(() => blankSave.sixthOwnedAnts),
  sixthGeneratedAnts: decimalSchema,
  sixthCostAnts: decimalSchema,
  sixthProduceAnts: z.number().default(() => blankSave.sixthProduceAnts),

  seventhOwnedAnts: z.number().default(() => blankSave.seventhOwnedAnts),
  seventhGeneratedAnts: decimalSchema,
  seventhCostAnts: decimalSchema,
  seventhProduceAnts: z.number().default(() => blankSave.seventhProduceAnts),

  eighthOwnedAnts: z.number().default(() => blankSave.eighthOwnedAnts),
  eighthGeneratedAnts: decimalSchema,
  eighthCostAnts: decimalSchema,
  eighthProduceAnts: z.number().default(() => blankSave.eighthProduceAnts),

  ascendBuilding1: ascendBuildingSchema.default(() => deepClone()(blankSave.ascendBuilding1)),
  ascendBuilding2: ascendBuildingSchema.default(() => deepClone()(blankSave.ascendBuilding2)),
  ascendBuilding3: ascendBuildingSchema.default(() => deepClone()(blankSave.ascendBuilding3)),
  ascendBuilding4: ascendBuildingSchema.default(() => deepClone()(blankSave.ascendBuilding4)),
  ascendBuilding5: ascendBuildingSchema.default(() => deepClone()(blankSave.ascendBuilding5)),

  multiplierCost: decimalSchema,
  multiplierBought: z.number(),

  acceleratorCost: decimalSchema,
  acceleratorBought: z.number(),

  acceleratorBoostBought: z.number(),
  acceleratorBoostCost: decimalSchema,

  upgrades: z.number().array().transform((array) => {
    if (array.length < blankSave.upgrades.length) {
      array.push(...blankSave.upgrades.slice(0, blankSave.upgrades.length - array.length))
    }

    return array
  }),

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

  challengecompletions: z.union([
    z.number().array(),
    z.record(z.string(), z.number()).transform((value) => {
      const challengeCompletions = Object.values(value)
      padArray(
        challengeCompletions,
        0,
        blankSave.challengecompletions.length
      )
      return challengeCompletions
    })
  ]),
  highestchallengecompletions: z.union([
    z.union([z.number(), z.null()]).array(),
    z.record(z.string(), z.number()).transform((value) => {
      const highestChallengeCompletions = Object.values(value)
      padArray(
        highestChallengeCompletions,
        0,
        blankSave.highestchallengecompletions.length
      )
      return highestChallengeCompletions
    })
  ]),
  challenge15Exponent: z.number().default(() => blankSave.challenge15Exponent),
  highestChallenge15Exponent: z.number().default(() => blankSave.highestChallenge15Exponent),

  retrychallenges: z.boolean().default(() => blankSave.retrychallenges),
  currentChallenge: z.union([
    z.string().transform(() => ({ ...blankSave.currentChallenge })),
    z.object({
      transcension: z.number(),
      reincarnation: z.number(),
      ascension: z.number()
    }).default(() => ({ ...blankSave.currentChallenge }))
  ]),

  obtainium: decimalSchema.default(() => blankSave.obtainium),
  maxObtainium: decimalSchema.default(() => blankSave.maxObtainium),

  researchPoints: z.number().optional(),
  obtainiumtimer: z.number(),
  obtainiumpersecond: z.number().optional(),
  maxobtainiumpersecond: z.number().optional(),
  maxobtainium: z.number().optional(),

  researches: z.number().array().transform((array) => arrayExtend(array, 'researches')),

  unlocks: z.record(z.string(), z.boolean()).transform((object) => {
    return Object.fromEntries(
      Object.keys(blankSave.unlocks).map((key) => {
        const value = object[key] ?? blankSave.unlocks[key as keyof typeof blankSave['unlocks']]
        return value === null ? [key, false] : [key, Boolean(value)]
      })
    )
  }).default(() => ({ ...blankSave.unlocks })),
  achievements: z.number().array().transform((array) => arrayExtend(array, 'achievements')),
  progressiveAchievements: z.record(z.string(), z.number()).transform(
    (object) => {
      return Object.fromEntries(
        Object.keys(blankSave.progressiveAchievements).map((key) => {
          const value = object[key]
            ?? blankSave.progressiveAchievements[key as keyof typeof blankSave['progressiveAchievements']]
          return value === null ? [key, 0] : [key, Number(value)]
        })
      )
    }
  ).default(() => ({ ...blankSave.progressiveAchievements })),

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
  crystalUpgradesCost: z.number().array().default(() => [...blankSave.crystalUpgradesCost]),

  runes: z.record(z.string(), decimalSchema)
    .transform((object) => {
      return Object.fromEntries(
        Object.keys(blankSave.runes).map((key) => {
          const value = object[key] ?? blankSave.runes[key as keyof typeof blankSave['runes']]
          return value === null ? [key, new Decimal('0')] : [key, new Decimal(value)]
        })
      )
    })
    .default(() => ({ ...blankSave.runes })),

  runeBlessings: z.record(z.string(), decimalSchema)
    .transform((object) => {
      return Object.fromEntries(
        Object.keys(blankSave.runeBlessings).map((key) => {
          const value = object[key] ?? blankSave.runeBlessings[key as keyof typeof blankSave['runeBlessings']]
          return value === null ? [key, new Decimal('0')] : [key, new Decimal(value)]
        })
      )
    })
    .default(() => ({ ...blankSave.runeBlessings })),

  runeSpirits: z.record(z.string(), decimalSchema)
    .transform((object) => {
      return Object.fromEntries(
        Object.keys(blankSave.runeSpirits).map((key) => {
          const value = object[key] ?? blankSave.runeSpirits[key as keyof typeof blankSave['runeSpirits']]
          return value === null ? [key, new Decimal('0')] : [key, new Decimal(value)]
        })
      )
    })
    .default(() => ({ ...blankSave.runeSpirits })),

  runelevels: z.number().array().optional(),
  runeexp: z.union([z.number(), z.null().transform(() => 0)]).array().optional(),

  offerings: decimalSchema.default(() => blankSave.offerings),
  maxOfferings: decimalSchema.default(() => blankSave.maxOfferings),

  runeshards: z.number().optional(),
  maxofferings: z.number().optional(),

  offeringpersecond: z.number().optional(),

  prestigecounter: z.number(),
  transcendcounter: z.number(),
  reincarnationcounter: z.number(),
  offlinetick: z.number(),

  prestigeamount: z.union([z.number(), decimalStringSchema.transform(Number)]),
  transcendamount: z.union([z.number(), decimalStringSchema.transform(Number)]).default(() =>
    blankSave.transcendamount
  ),
  reincarnationamount: z.union([z.number(), decimalStringSchema.transform(Number)]),

  fastestprestige: z.number(),
  fastesttranscend: z.number(),
  fastestreincarnate: z.number(),

  resettoggle1: z.number().default(() => blankSave.resettoggle1),
  resettoggle2: z.number().default(() => blankSave.resettoggle2),
  resettoggle3: z.number().default(() => blankSave.resettoggle3),
  resettoggle4: z.number().default(() => blankSave.resettoggle4),

  tesseractAutoBuyerToggle: z.number().default(() => blankSave.tesseractAutoBuyerToggle),
  tesseractAutoBuyerAmount: z.number().default(() => blankSave.tesseractAutoBuyerAmount),

  coinbuyamount: buyAmount,
  crystalbuyamount: buyAmount,
  mythosbuyamount: buyAmount,
  particlebuyamount: buyAmount,
  offeringbuyamount: buyAmount,
  tesseractbuyamount: buyAmount,

  shoptoggles: z.record(z.string(), z.boolean()),
  tabnumber: z.any().optional(),
  subtabNumber: z.any().optional(),

  codes: z.array(z.tuple([z.number(), z.boolean()])).transform((tuple) => new Map(tuple)).default(() =>
    deepClone()([...blankSave.codes])
  ),

  loaded1009: z.boolean().default(() => blankSave.loaded1009),
  loaded1009hotfix1: z.boolean().default(() => blankSave.loaded1009hotfix1),
  loaded10091: z.boolean().default(() => blankSave.loaded10091),
  loaded1010: z.boolean().default(() => blankSave.loaded1010),
  loaded10101: z.boolean().default(() => blankSave.loaded10101),

  shopUpgrades: z.record(z.string(), z.union([z.number(), z.null(), z.boolean()]))
    .transform((object) => {
      return Object.fromEntries(
        Object.keys(blankSave.shopUpgrades).map((key) => {
          const value = object[key] ?? blankSave.shopUpgrades[key as keyof typeof blankSave['shopUpgrades']]
          return value === null ? [key, 0] : [key, Number(value)]
        })
      )
    })
    .default(() => ({ ...blankSave.shopUpgrades })),

  shopPotionsConsumed: z.object({
    offering: z.number(),
    obtainium: z.number()
  }).default(() => ({ ...blankSave.shopPotionsConsumed })),

  shopBuyMaxToggle: z.union([z.boolean(), z.string()]).default(() => blankSave.shopBuyMaxToggle),
  shopHideToggle: z.boolean().default(() => blankSave.shopHideToggle),
  shopConfirmationToggle: z.boolean().default(() => blankSave.shopConfirmationToggle),
  autoPotionTimer: z.number().default(() => blankSave.autoPotionTimer),
  autoPotionTimerObtainium: z.number().default(() => blankSave.autoPotionTimerObtainium),

  autoSacrificeToggle: z.boolean().default(() => blankSave.autoSacrificeToggle),
  autoBuyFragment: z.boolean().default(() => blankSave.autoBuyFragment),
  autoFortifyToggle: z.boolean().default(() => blankSave.autoFortifyToggle),
  autoEnhanceToggle: z.boolean().default(() => blankSave.autoEnhanceToggle),
  autoResearchToggle: z.boolean().default(() => blankSave.autoResearchToggle),
  researchBuyMaxToggle: z.boolean().default(() => blankSave.researchBuyMaxToggle),
  autoResearchMode: z.string().default(() => blankSave.autoResearchMode),
  autoResearch: z.number().default(() => blankSave.autoResearch),
  autoSacrifice: z.number().default(() => blankSave.autoSacrifice),
  sacrificeTimer: z.number().default(() => blankSave.sacrificeTimer),
  quarkstimer: z.number().default(() => blankSave.quarkstimer),
  goldenQuarksTimer: z.number().default(() => blankSave.goldenQuarksTimer),

  antPoints: decimalSchema,
  antUpgrades: z.union([z.number().array(), arrayStartingWithNull(z.number()).transform((array) => array.slice(1))])
    .default(() => [...blankSave.antUpgrades]),
  antSacrificePoints: z.union([z.number(), z.null().transform(() => Number.MAX_VALUE)]).default(() =>
    blankSave.antSacrificePoints
  ),
  antSacrificeTimer: z.number().default(() => blankSave.antSacrificeTimer),
  antSacrificeTimerReal: z.number().default(() => blankSave.antSacrificeTimerReal),

  talismans: z.record(z.string(), talismanFragmentSchema)
    .transform((object) => {
      return Object.fromEntries(
        Object.keys(blankSave.talismans).map((key) => {
          const value = object[key] ?? noTalismanFragments
          return value === null ? [key, noTalismanFragments] : [key, value]
        })
      )
    })
    .default(() => ({ ...blankSave.talismans })),

  talismanLevels: z.union([
    z.number().array(),
    arrayStartingWithNull(z.number()).transform((array) => array.slice(1))
  ]).optional(),
  talismanRarity: z.union([
    z.number().array(),
    arrayStartingWithNull(z.number()).transform((array) => array.slice(1))
  ]).optional(),
  talismanOne: arrayStartingWithNull(z.number()).optional(),
  talismanTwo: arrayStartingWithNull(z.number()).optional(),
  talismanThree: arrayStartingWithNull(z.number()).optional(),
  talismanFour: arrayStartingWithNull(z.number()).optional(),
  talismanFive: arrayStartingWithNull(z.number()).optional(),
  talismanSix: arrayStartingWithNull(z.number()).optional(),
  talismanSeven: arrayStartingWithNull(z.number()).optional(),
  talismanShards: decimalSchema.default(() => blankSave.talismanShards),
  commonFragments: decimalSchema.default(() => blankSave.commonFragments),
  uncommonFragments: decimalSchema.default(() => blankSave.uncommonFragments),
  rareFragments: decimalSchema.default(() => blankSave.rareFragments),
  epicFragments: decimalSchema.default(() => blankSave.epicFragments),
  legendaryFragments: decimalSchema.default(() => blankSave.legendaryFragments),
  mythicalFragments: decimalSchema.default(() => blankSave.mythicalFragments),

  buyTalismanShardPercent: z.number().default(() => blankSave.buyTalismanShardPercent),

  autoAntSacrifice: z.boolean().default(() => blankSave.autoAntSacrifice),
  autoAntSacTimer: z.number().default(() => blankSave.autoAntSacTimer),
  autoAntSacrificeMode: z.number().default(() => blankSave.autoAntSacrificeMode),
  antMax: z.boolean().default(() => blankSave.antMax),

  ascensionCount: z.number().default(() => blankSave.ascensionCount),
  ascensionCounter: z.number().default(() => blankSave.ascensionCounter),
  ascensionCounterReal: z.number().default(() => blankSave.ascensionCounterReal),
  ascensionCounterRealReal: z.number().default(() => blankSave.ascensionCounterRealReal),
  cubeUpgrades: arrayStartingWithNull(z.number())
    .transform((array) => arrayExtend(array as [null, ...number[]], 'cubeUpgrades'))
    .default((): [null, ...number[]] => [...blankSave.cubeUpgrades]),
  cubeUpgradesBuyMaxToggle: z.boolean().default(() => blankSave.cubeUpgradesBuyMaxToggle),
  autoCubeUpgradesToggle: z.boolean().default(() => blankSave.autoCubeUpgradesToggle),
  autoPlatonicUpgradesToggle: z.boolean().default(() => blankSave.autoPlatonicUpgradesToggle),
  platonicUpgrades: z.number().array().transform((array) => arrayExtend(array, 'platonicUpgrades')).default(
    () => [...blankSave.platonicUpgrades]
  ),
  wowCubes: z.number().default(() => Number(blankSave.wowCubes)).transform((cubes) => new WowCubes(cubes)),
  wowTesseracts: z.number().default(() => Number(blankSave.wowTesseracts)).transform((tesseract) =>
    new WowTesseracts(tesseract)
  ),
  wowHypercubes: z.number().default(() => Number(blankSave.wowHypercubes)).transform((cubes) =>
    new WowHypercubes(cubes)
  ),
  wowPlatonicCubes: z.number().default(() => Number(blankSave.wowPlatonicCubes)).transform((cubes) =>
    new WowPlatonicCubes(cubes)
  ),
  saveOfferingToggle: z.boolean().default(() => blankSave.saveOfferingToggle),
  wowAbyssals: z.number().default(() => blankSave.wowAbyssals),
  wowOcteracts: z.number().default(() => blankSave.wowOcteracts),
  totalWowOcteracts: z.number().default(() => blankSave.totalWowOcteracts),
  cubeBlessings: z.record(z.string(), z.number()).transform((obj) => {
    const sum = sumContents(Object.values(obj))
    if (!isFinite(sum) || sum > 1e300) {
      const obj: typeof blankSave.cubeBlessings = {
        accelerator: 2e299,
        multiplier: 2e299,
        offering: 1e299,
        runeExp: 1e299,
        obtainium: 1e299,
        antSpeed: 1e299,
        antSacrifice: 5e298,
        antELO: 5e298,
        talismanBonus: 5e298,
        globalSpeed: 5e298
      }
      return obj
    }
    return obj
  }).default(() => ({ ...blankSave.cubeBlessings })),
  tesseractBlessings: z.record(z.string(), z.number()).default(() => ({ ...blankSave.tesseractBlessings })),
  hypercubeBlessings: z.record(z.string(), z.number()).default(() => ({ ...blankSave.hypercubeBlessings })),
  platonicBlessings: z.record(z.string(), z.number()).default(() => ({ ...blankSave.platonicBlessings })),

  hepteracts: z.object({
    chronos: newHepteractCraftSchema.default(() => blankSave.hepteracts.chronos),
    hyperrealism: newHepteractCraftSchema.default(() => blankSave.hepteracts.hyperrealism),
    quark: newHepteractCraftSchema.default(() => blankSave.hepteracts.quark),
    challenge: newHepteractCraftSchema.default(() => blankSave.hepteracts.challenge),
    abyss: newHepteractCraftSchema.default(() => blankSave.hepteracts.abyss),
    accelerator: newHepteractCraftSchema.default(() => blankSave.hepteracts.accelerator),
    acceleratorBoost: newHepteractCraftSchema.default(() => blankSave.hepteracts.acceleratorBoost),
    multiplier: newHepteractCraftSchema.default(() => blankSave.hepteracts.multiplier)
  }).default(() => {
    return { ...blankSave.hepteracts }
  }),

  hepteractCrafts: z.object({
    chronos: hepteractCraftSchema('chronos').optional(),
    hyperrealism: hepteractCraftSchema('hyperrealism').optional(),
    quark: hepteractCraftSchema('quark').optional(),
    challenge: hepteractCraftSchema('challenge').optional(),
    abyss: hepteractCraftSchema('abyss').optional(),
    accelerator: hepteractCraftSchema('accelerator').optional(),
    acceleratorBoost: hepteractCraftSchema('acceleratorBoost').optional(),
    multiplier: hepteractCraftSchema('multiplier').optional()
  }).optional(),

  ascendShards: decimalSchema.default(() => deepClone()(blankSave.ascendShards)),
  autoAscend: z.boolean().default(() => blankSave.autoAscend),
  autoAscendMode: z.string().default(() => blankSave.autoAscendMode),
  autoAscendThreshold: z.number().default(() => blankSave.autoAscendThreshold),
  autoOpenCubes: z.boolean().default(() => blankSave.autoOpenCubes),
  openCubes: z.number().default(() => blankSave.openCubes),
  autoOpenTesseracts: z.boolean().default(() => blankSave.autoOpenTesseracts),
  openTesseracts: z.number().default(() => blankSave.openTesseracts),
  autoOpenHypercubes: z.boolean().default(() => blankSave.autoOpenHypercubes),
  openHypercubes: z.number().default(() => blankSave.openHypercubes),
  autoOpenPlatonicsCubes: z.boolean().default(() => blankSave.autoOpenPlatonicsCubes),
  openPlatonicsCubes: z.number().default(() => blankSave.openPlatonicsCubes),
  roombaResearchIndex: z.number().default(() => blankSave.roombaResearchIndex),
  ascStatToggles: z.record(integerStringSchema, z.boolean()).default(() => ({ ...blankSave.ascStatToggles })),

  campaigns: playerCampaignSchema,

  corruptions: playerCorruptionSchema,

  prototypeCorruptions: z.number().array().optional(),
  usedCorruptions: z.number().array().optional(),
  corruptionLoadouts: z.record(integerStringSchema, z.number().array()).optional(),

  corruptionLoadoutNames: z.string().array().optional(),
  corruptionShowStats: z.boolean().optional(),

  constantUpgrades: arrayStartingWithNull(z.number()).default((): [
    null,
    ...number[]
  ] => [...blankSave.constantUpgrades]),
  // TODO: real types
  history: z.object({
    ants: z.any().array(),
    ascend: z.any().array().default(() => [...blankSave.history.ascend]),
    reset: z.any().array().default(() => [...blankSave.history.reset]),
    singularity: z.any().array().default(() => [...blankSave.history.singularity])
  }).default(() => deepClone()(blankSave.history)),
  historyShowPerSecond: z.boolean().default(() => blankSave.historyShowPerSecond),

  autoChallengeRunning: z.boolean().default(() => blankSave.autoChallengeRunning),
  autoChallengeIndex: z.number().default(() => blankSave.autoChallengeIndex),
  autoChallengeToggles: z.boolean().array().default(() => [...blankSave.autoChallengeToggles]),
  autoChallengeStartExponent: z.number().default(() => blankSave.autoChallengeStartExponent),
  autoChallengeTimer: z.record(z.string(), z.number()).default(() => ({ ...blankSave.autoChallengeTimer })),

  runeBlessingLevels: z.number().array().optional(),
  runeSpiritLevels: z.number().array().optional(),
  runeBlessingBuyAmount: z.number().default(() => blankSave.runeBlessingBuyAmount),
  runeSpiritBuyAmount: z.number().default(() => blankSave.runeSpiritBuyAmount),

  autoTesseracts: z.boolean().array().default(() => [...blankSave.autoTesseracts]),

  saveString: z.string().default(() => blankSave.saveString),
  exporttest: z.union([z.string(), z.boolean()]).transform((value) => {
    if (typeof value === 'string') {
      return value === 'YES!'
    }

    return value
  }),

  dayCheck: z.string().datetime().nullable().default(() => blankSave.dayCheck as null).transform((value) => {
    return value === null ? value : new Date(value)
  }),
  dayTimer: z.number().default(() => blankSave.dayTimer),
  cubeOpenedDaily: z.number().default(() => blankSave.cubeOpenedDaily),
  cubeQuarkDaily: z.number().default(() => blankSave.cubeQuarkDaily),
  tesseractOpenedDaily: z.number().default(() => blankSave.tesseractOpenedDaily),
  tesseractQuarkDaily: z.number().default(() => blankSave.tesseractQuarkDaily),
  hypercubeOpenedDaily: z.number().default(() => blankSave.hypercubeOpenedDaily),
  hypercubeQuarkDaily: z.number().default(() => blankSave.hypercubeQuarkDaily),
  platonicCubeOpenedDaily: z.number().default(() => blankSave.platonicCubeOpenedDaily),
  platonicCubeQuarkDaily: z.number().default(() => blankSave.platonicCubeQuarkDaily),
  overfluxOrbs: z.number().default(() => blankSave.overfluxOrbs),
  overfluxOrbsAutoBuy: z.boolean().default(() => blankSave.overfluxOrbsAutoBuy),
  overfluxPowder: z.number().default(() => blankSave.overfluxPowder),
  dailyPowderResetUses: z.number().default(() => blankSave.dailyPowderResetUses),
  autoWarpCheck: z.boolean().default(() => blankSave.autoWarpCheck),
  loadedOct4Hotfix: z.boolean().default(() => blankSave.loadedOct4Hotfix),
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
  version: z.string().default(() => blankSave.version),
  rngCode: z.number().default(() => blankSave.rngCode),
  promoCodeTiming: z.record(z.string(), z.number()).default(() => ({ time: Date.now() - 60 * 1000 * 15 })),
  singularityCount: z.number().default(() => blankSave.singularityCount),
  highestSingularityCount: z.number().default(() => blankSave.highestSingularityCount),
  singularityCounter: z.number().default(() => blankSave.singularityCount),
  goldenQuarks: z.number().default(() => blankSave.goldenQuarks),
  quarksThisSingularity: z.number().nullable().default(() => blankSave.quarksThisSingularity),
  totalQuarksEver: z.number().default(() => blankSave.totalQuarksEver),
  hotkeys: z.record(integerStringSchema, z.string().array()).default(() => blankSave.hotkeys),
  theme: z.string().default(() => blankSave.theme),
  iconSet: z.number().default(() => blankSave.iconSet),
  notation: z.string().default(() => blankSave.notation),

  goldenQuarkUpgrades: z.record(z.string(), goldenQuarkUpgradeSchema).transform((object) => {
    return Object.fromEntries(
      Object.keys(blankSave.goldenQuarkUpgrades).map((key) => {
        const value = object[key] ?? { level: 0, freeLevel: 0, goldenQuarksInvested: 0 }
        return value === null ? [key, { level: 0, freeLevel: 0, goldenQuarksInvested: 0 }] : [key, value]
      })
    )
  })
    .default(() => ({ ...blankSave.goldenQuarkUpgrades })),

  octUpgrades: z.record(z.string(), octeractUpgradeSchema).transform((object) => {
    // We use the same goldenQuarkUpgradeSchema for multiple things. maybe it should be called
    // something different. Oh well... this can be changed later. -Plat
    return Object.fromEntries(
      Object.keys(blankSave.octUpgrades).map((key) => {
        const value = object[key] ?? { level: 0, freeLevel: 0, octeractsInvested: 0 }
        return value === null ? [key, { level: 0, freeLevel: 0, octeractsInvested: 0 }] : [key, value]
      })
    )
  })
    .default(() => ({ ...blankSave.octUpgrades })),

  ambrosiaUpgrades: z.record(z.string(), ambrosiaUpgradeSchema).transform((object) => {
    return Object.fromEntries(
      Object.keys(blankSave.ambrosiaUpgrades).map((key) => {
        const value = object[key] ?? { ambrosiaInvested: 0, blueberriesInvested: 0 }
        return value === null ? [key, { ambrosiaInvested: 0, blueberriesInvested: 0 }] : [key, value]
      })
    )
  })
    .default(() => ({ ...blankSave.ambrosiaUpgrades })),

  singularityUpgrades: z.record(z.string(), singularityUpgradeSchema('goldenQuarksInvested')).optional(),
  octeractUpgrades: z.record(z.string(), singularityUpgradeSchema('octeractsInvested')).optional(),

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
  )
    .transform((upgrades) =>
      Object.fromEntries(
        Object.keys(blankSave.singularityChallenges).map((key) => {
          const k = key as SingularityChallengeDataKeys
          const { completions, highestSingularityCompleted, enabled } = upgrades[k]
            ?? blankSave.singularityChallenges[k]

          return [
            k,
            new SingularityChallenge({
              baseReq: singularityChallengeData[k].baseReq,
              completions,
              maxCompletions: singularityChallengeData[k].maxCompletions,
              achievementPointValue: singularityChallengeData[k].achievementPointValue,
              unlockSingularity: singularityChallengeData[k].unlockSingularity,
              HTMLTag: singularityChallengeData[k].HTMLTag,
              highestSingularityCompleted,
              enabled,
              resetTime: singularityChallengeData[k].resetTime,
              singularityRequirement: singularityChallengeData[k].singularityRequirement,
              scalingrewardcount: singularityChallengeData[k].scalingrewardcount,
              uniquerewardcount: singularityChallengeData[k].uniquerewardcount,
              effect: singularityChallengeData[k].effect,
              alternateDescription: singularityChallengeData[k].alternateDescription
            }, k)
          ]
        })
      )
    )
    .default(() => JSON.parse(JSON.stringify(blankSave.singularityChallenges))),

  ambrosia: z.number().default(() => blankSave.ambrosia),
  lifetimeAmbrosia: z.number().default(() => blankSave.lifetimeAmbrosia),
  ambrosiaRNG: z.number().default(() => blankSave.ambrosiaRNG),
  blueberryTime: z.number().default(() => blankSave.blueberryTime),
  visitedAmbrosiaSubtab: z.boolean().default(() => blankSave.visitedAmbrosiaSubtab),
  visitedAmbrosiaSubtabRed: z.boolean().default(() => blankSave.visitedAmbrosiaSubtabRed),
  spentBlueberries: z.number().default(() => blankSave.spentBlueberries),
  // TODO: is this right?
  blueberryUpgrades: z.record(z.string(), singularityUpgradeSchema('blueberriesInvested', 'ambrosiaInvested'))
    .optional(),

  // TODO: what type?
  blueberryLoadouts: z.record(integerStringSchema, z.any()).default(() => blankSave.blueberryLoadouts),
  blueberryLoadoutMode: z.string().default(() => blankSave.blueberryLoadoutMode),

  ultimateProgress: z.number().optional(),
  ultimatePixels: z.number().optional(),
  cubeUpgradeRedBarFilled: z.number().optional(),

  redAmbrosia: z.number().default(() => blankSave.redAmbrosia),
  lifetimeRedAmbrosia: z.number().default(() => blankSave.lifetimeRedAmbrosia),
  redAmbrosiaTime: z.number().default(() => blankSave.redAmbrosiaTime),
  redAmbrosiaUpgrades: z.record(z.string(), z.number()).transform(
    (object) => {
      return Object.fromEntries(
        Object.keys(blankSave.redAmbrosiaUpgrades).map((key) => {
          const value = object[key]
            ?? blankSave.redAmbrosiaUpgrades[key as keyof typeof blankSave['redAmbrosiaUpgrades']]
          return value === null ? [key, 0] : [key, Number(value)]
        })
      )
    }
  ).default(() => ({ ...blankSave.redAmbrosiaUpgrades })),

  singChallengeTimer: z.number().default(() => blankSave.singChallengeTimer),

  lastExportedSave: z.number().default(() => blankSave.lastExportedSave),

  seed: z.number().array().default(() => blankSave.seed)
    .transform((value) => arrayExtend(value, 'seed'))
    .refine((value) => value.every((seed) => seed > Date.parse('2020-01-01T00:00:00Z') && seed < Date.now() + 1000))
})
