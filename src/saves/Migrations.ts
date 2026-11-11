import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import * as z from 'zod'
import type { ZodType } from 'zod'
import { AchievementId } from '../Achievements'
import type { AmbrosiaUpgradeNames } from '../BlueberryUpgrades'
import { AntProducers } from '../Features/Ants/structs/structs'
import { NUM_SACRIFICE_MODES } from '../Features/Ants/toggles/structs/sacrifice'
import { type HepteractKeys, hepteracts } from '../Hepteracts'
import { octeractUpgradeNames, octeractUpgrades } from '../Octeracts'
import { runes, RuneType } from '../Runes'
import { getGQUpgradeCumulativeCost, type SingularityDataKeys } from '../singularity'
import { blankSave, deepClone, format } from '../Synergism'
import { talismanInvestmentForLevel } from '../Talismans'
import { Alert } from '../UpdateHTML'
import { arrayStartingWithNull, decimalSchema, playerSchema } from './PlayerSchema'

type Shape = Record<string, ZodType>
type Fields<S extends Shape> = { [K in keyof S]: z.output<S[K]> }
type PlayerData = z.output<typeof playerSchema>

interface Migration {
  requires: Shape
  optional?: Shape
  migrate: (player: PlayerData, legacy: never) => void
}

const migration = <R extends Shape, O extends Shape = Record<never, never>>(m: {
  requires: R
  optional?: O
  migrate: (player: PlayerData, legacy: Fields<R> & Partial<Fields<O>>) => void
}) => m

const singularityUpgradeSchema = (...keys: string[]) => {
  return z.object<Record<typeof keys[number], ZodType<number>>>({
    level: z.number(),
    // Saves from before free levels existed don't have this field at all
    freeLevels: z.number().default(0),
    ...keys.reduce((accum, value) => {
      accum[value] = z.number()
      return accum
    }, {} as Record<string, ZodType<number>>)
  })
}

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

const resetLegacyCorruptions = (player: PlayerData) => {
  player.corruptions = deepClone(blankSave.corruptions)

  if (player.currentChallenge.ascension === 15) {
    player.currentChallenge.ascension = 0
  }
}

const legacyRuneKeys = [
  'speed',
  'duplication',
  'prism',
  'thrift',
  'superiorIntellect',
  'infiniteAscent',
  'antiquities',
  'horseShoe',
  'finiteDescent',
  'topHat'
] as const

const migrations: Migration[] = [
  migration({ requires: { usedCorruptions: z.unknown() }, migrate: resetLegacyCorruptions }),
  migration({ requires: { prototypeCorruptions: z.unknown() }, migrate: resetLegacyCorruptions }),
  migration({ requires: { corruptionLoadouts: z.unknown() }, migrate: resetLegacyCorruptions }),
  migration({ requires: { corruptionLoadoutNames: z.unknown() }, migrate: resetLegacyCorruptions }),
  migration({
    requires: {
      corruptions: z.object({
        used: z.custom<object>((value) => typeof value === 'object' && value !== null)
      }).optional().catch(undefined)
    },
    migrate: resetLegacyCorruptions
  }),

  migration({
    requires: {},
    optional: {
      ultimatePixels: z.number(),
      cubeUpgradeRedBarFilled: z.number()
    },
    migrate: (player, { ultimatePixels = 0, cubeUpgradeRedBarFilled = 0 }) => {
      // One-time conversion for red bar filled and ultimate pixels (to a lesser degree)
      const redAmbrosia = Math.floor(ultimatePixels * 0.2 + cubeUpgradeRedBarFilled)

      player.redAmbrosia += redAmbrosia
      player.lifetimeRedAmbrosia += redAmbrosia
    }
  }),

  migration({
    requires: {
      talismanLevels: z.union([
        z.number().array(),
        arrayStartingWithNull(z.number()).transform<number[]>((array) => array.slice(1) as number[])
      ])
    },
    migrate: (player, { talismanLevels }) => {
      player.talismans.exemption = talismanInvestmentForLevel(talismanLevels[0], 'exemption')
      player.talismans.chronos = talismanInvestmentForLevel(talismanLevels[1], 'chronos')
      player.talismans.midas = talismanInvestmentForLevel(talismanLevels[2], 'midas')
      player.talismans.metaphysics = talismanInvestmentForLevel(talismanLevels[3], 'metaphysics')
      player.talismans.polymath = talismanInvestmentForLevel(talismanLevels[4], 'polymath')
      player.talismans.mortuus = talismanInvestmentForLevel(talismanLevels[5], 'mortuus')
      player.talismans.plastic = talismanInvestmentForLevel(talismanLevels[6], 'plastic')
    }
  }),

  migration({
    requires: { runes: z.record(z.string(), decimalSchema.nullable()) },
    migrate: (player, { runes: legacyRunes }) => {
      legacyRuneKeys.forEach((key, rune) => {
        player.runeEXP[rune] = new Decimal(legacyRunes[key] ?? 0)
      })
    }
  }),

  migration({
    requires: { runeBlessings: z.record(z.string(), decimalSchema.nullable()) },
    migrate: (player, { runeBlessings }) => {
      legacyRuneKeys.slice(0, player.blessingEXP.length).forEach((key, rune) => {
        player.blessingEXP[rune] = new Decimal(runeBlessings[key] ?? 0)
      })
    }
  }),

  migration({
    requires: { runeSpirits: z.record(z.string(), decimalSchema.nullable()) },
    migrate: (player, { runeSpirits }) => {
      legacyRuneKeys.slice(0, player.spiritEXP.length).forEach((key, rune) => {
        player.spiritEXP[rune] = new Decimal(runeSpirits[key] ?? 0)
      })
    }
  }),

  migration({
    requires: { autoSacrifice: z.number() },
    migrate: (player, { autoSacrifice }) => {
      const rune = autoSacrifice - 1
      player.autoSacrificeRune = rune in runes ? rune : null
    }
  }),

  migration({
    requires: {
      runeexp: z.union([z.number(), z.null().transform(() => 0)]).array()
    },
    migrate: (player, { runeexp }) => {
      player.runeEXP[RuneType.Speed] = new Decimal(runeexp[0] ?? 0)
      player.runeEXP[RuneType.Duplication] = new Decimal(runeexp[1] ?? 0)
      player.runeEXP[RuneType.Prism] = new Decimal(runeexp[2] ?? 0)
      player.runeEXP[RuneType.Thrift] = new Decimal(runeexp[3] ?? 0)
      player.runeEXP[RuneType.SuperiorIntellect] = new Decimal(runeexp[4] ?? 0)
      player.runeEXP[RuneType.InfiniteAscent] = new Decimal(runeexp[5] ?? 0)
      player.runeEXP[RuneType.Antiquities] = new Decimal(runeexp[6] ?? 0)

      // Retroactively reward players with unlocks, because I don't have a better place here
      player.unlocks.anthill = player.achievements[AchievementId.Challenge8Tier1] === 1
        || (player.highestchallengecompletions[8] ?? 0) > 0
      player.unlocks.talismans = player.achievements[AchievementId.Challenge9Tier1] === 1
        || (player.highestchallengecompletions[9] ?? 0) > 0
      player.unlocks.blessings = player.achievements[AchievementId.Challenge9Tier1] === 1
        || (player.highestchallengecompletions[9] ?? 0) > 0
      player.unlocks.ascensions = player.achievements[AchievementId.Challenge10Tier1] === 1
        || (player.highestchallengecompletions[10] ?? 0) > 0
      player.unlocks.tesseracts = player.achievements[AchievementId.Challenge11Tier1] === 1
        || (player.highestchallengecompletions[11] ?? 0) > 0
      player.unlocks.spirits = player.achievements[AchievementId.Challenge12Tier1] === 1
        || (player.highestchallengecompletions[12] ?? 0) > 0
      player.unlocks.hypercubes = player.achievements[AchievementId.Challenge13Tier1] === 1
        || (player.highestchallengecompletions[13] ?? 0) > 0
      player.unlocks.platonics = player.achievements[AchievementId.Challenge14Tier1] === 1
        || (player.highestchallengecompletions[14] ?? 0) > 0
      player.unlocks.hepteracts = player.challenge15Exponent >= 1e15
    }
  }),

  migration({
    requires: { runeshards: z.number() },
    migrate: (player, { runeshards }) => {
      player.offerings = new Decimal(runeshards)
    }
  }),

  migration({
    requires: { maxofferings: z.number() },
    migrate: (player, { maxofferings }) => {
      player.maxOfferings = new Decimal(maxofferings)
    }
  }),

  migration({
    requires: { researchPoints: z.number() },
    migrate: (player, { researchPoints }) => {
      player.obtainium = new Decimal(researchPoints)
    }
  }),

  migration({
    requires: { maxobtainium: z.number() },
    migrate: (player, { maxobtainium }) => {
      player.maxObtainium = new Decimal(maxobtainium)
    }
  }),

  migration({
    requires: { runeBlessingLevels: z.number().array() },
    migrate: (player, { runeBlessingLevels }) => {
      player.blessingEXP[RuneType.Speed] = new Decimal(
        Math.pow(Math.min(1e140, runeBlessingLevels[1] ?? 0), 2) * 1e8 / 2
      )
      player.blessingEXP[RuneType.Duplication] = new Decimal(
        Math.pow(Math.min(1e140, runeBlessingLevels[2] ?? 0), 2) * 1e8 / 2
      )
      player.blessingEXP[RuneType.Prism] = new Decimal(
        Math.pow(Math.min(1e140, runeBlessingLevels[3] ?? 0), 2) * 1e8 / 2
      )
      player.blessingEXP[RuneType.Thrift] = new Decimal(
        Math.pow(Math.min(1e140, runeBlessingLevels[4] ?? 0), 2) * 1e8 / 2
      )
      player.blessingEXP[RuneType.SuperiorIntellect] = new Decimal(
        Math.pow(Math.min(1e140, runeBlessingLevels[5] ?? 0), 2) * 1e8 / 2
      )
    }
  }),

  migration({
    requires: { runeSpiritLevels: z.number().array() },
    migrate: (player, { runeSpiritLevels }) => {
      player.spiritEXP[RuneType.Speed] = new Decimal(Math.pow(Math.min(1e140, runeSpiritLevels[1] ?? 0), 2) * 1e20 / 2)
      player.spiritEXP[RuneType.Duplication] = new Decimal(
        Math.pow(Math.min(1e140, runeSpiritLevels[2] ?? 0), 2) * 1e20 / 2
      )
      player.spiritEXP[RuneType.Prism] = new Decimal(Math.pow(Math.min(1e140, runeSpiritLevels[3] ?? 0), 2) * 1e20 / 2)
      player.spiritEXP[RuneType.Thrift] = new Decimal(Math.pow(Math.min(1e140, runeSpiritLevels[4] ?? 0), 2) * 1e20 / 2)
      player.spiritEXP[RuneType.SuperiorIntellect] = new Decimal(
        Math.pow(Math.min(1e140, runeSpiritLevels[5] ?? 0), 2) * 1e20 / 2
      )
    }
  }),

  migration({
    requires: {
      hepteractCrafts: z.object({
        chronos: hepteractCraftSchema('chronos').optional(),
        hyperrealism: hepteractCraftSchema('hyperrealism').optional(),
        quark: hepteractCraftSchema('quark').optional(),
        challenge: hepteractCraftSchema('challenge').optional(),
        abyss: hepteractCraftSchema('abyss').optional(),
        accelerator: hepteractCraftSchema('accelerator').optional(),
        acceleratorBoost: hepteractCraftSchema('acceleratorBoost').optional(),
        multiplier: hepteractCraftSchema('multiplier').optional()
      })
    },
    migrate: (player, { hepteractCrafts }) => {
      for (const [key, value] of Object.entries(hepteractCrafts)) {
        const k = key as HepteractKeys
        if (value !== undefined) {
          const BAL = value.BAL ?? 0
          const TIMES_CAP_EXTENDED = Math.round(Math.log2(value.CAP / value.BASE_CAP)) ?? 0
          const AUTO = value.AUTO ?? false

          player.hepteracts[k] = { BAL, TIMES_CAP_EXTENDED, AUTO }
        }
      }
    }
  }),

  migration({
    requires: {
      singularityUpgrades: z.record(z.string(), singularityUpgradeSchema('goldenQuarksInvested'))
    },
    migrate: (player, { singularityUpgrades }) => {
      for (const key of Object.keys(singularityUpgrades)) {
        // This is shit - the old SingularityUpgrades object had this upgrade that didn't do anything
        if (key === 'WIP') {
          continue
        }

        // Older saves may predate some upgrades; keep their schema defaults.
        if (singularityUpgrades[key] === undefined) {
          continue
        }

        const k = key as SingularityDataKeys

        const freeLevel = singularityUpgrades[k].freeLevels ?? 0
        const goldenQuarksInvested = getGQUpgradeCumulativeCost(k, singularityUpgrades[k].level)

        player.goldenQuarkUpgrades[k] = {
          freeLevel,
          goldenQuarksInvested
        }
      }
    }
  }),

  migration({
    requires: {
      octeractUpgrades: z.record(z.string(), singularityUpgradeSchema('octeractsInvested'))
    },
    migrate: (player, legacy) => {
      for (const key of octeractUpgradeNames) {
        // Older saves may predate some upgrades; keep their schema defaults.
        if (legacy.octeractUpgrades[key] === undefined) {
          continue
        }

        const freeLevel = legacy.octeractUpgrades[key].freeLevels ?? 0
        const octeractsInvested = octeractUpgrades[key].costFormula(legacy.octeractUpgrades[key].level)

        player.octUpgrades[key] = {
          freeLevel,
          octeractsInvested
        }
      }
    }
  }),

  migration({
    requires: {
      // TODO: is this right?
      blueberryUpgrades: z.record(z.string(), singularityUpgradeSchema('blueberriesInvested', 'ambrosiaInvested'))
    },
    migrate: (player, { blueberryUpgrades }) => {
      for (const key of Object.keys(blueberryUpgrades)) {
        const k = key as AmbrosiaUpgradeNames

        const ambrosiaInvested = blueberryUpgrades[k].ambrosiaInvested ?? 0
        const blueberriesInvested = blueberryUpgrades[k].blueberriesInvested ?? 0

        player.ambrosiaUpgrades[k] = {
          ambrosiaInvested,
          blueberriesInvested
        }
      }
    }
  }),

  // In the ants rewrite, we assume that anything above 1e1000 crumbs can be 'chopped off'
  // For balancing purposes
  migration({
    requires: { antPoints: decimalSchema },
    optional: {
      firstOwnedAnts: z.number(),
      firstGeneratedAnts: decimalSchema,
      secondOwnedAnts: z.number(),
      secondGeneratedAnts: decimalSchema,
      thirdOwnedAnts: z.number(),
      thirdGeneratedAnts: decimalSchema,
      fourthOwnedAnts: z.number(),
      fourthGeneratedAnts: decimalSchema,
      fifthOwnedAnts: z.number(),
      fifthGeneratedAnts: decimalSchema,
      sixthOwnedAnts: z.number(),
      antUpgrades: z.union([
        z.number().array(),
        arrayStartingWithNull(z.number()).transform((array) => array.slice(1))
      ]),
      antSacrificePoints: z.union([z.number(), z.null().transform(() => Number.MAX_VALUE)]),
      autoAntSacrifice: z.boolean(),
      autoAntSacTimer: z.number(),
      autoAntSacrificeMode: z.number(),
      antMax: z.boolean()
    },
    migrate: (player, legacy) => {
      player.ants.producers[AntProducers.Workers] = {
        purchased: Math.min(2000, legacy.firstOwnedAnts ?? 0),
        generated: Decimal.min(new Decimal(1e200), legacy.firstGeneratedAnts ?? new Decimal())
      }

      player.ants.producers[AntProducers.Breeders] = {
        purchased: Math.min(1000, legacy.secondOwnedAnts ?? 0),
        generated: Decimal.min(new Decimal(1e200), legacy.secondGeneratedAnts ?? new Decimal())
      }

      player.ants.producers[AntProducers.MetaBreeders] = {
        purchased: Math.min(500, legacy.thirdOwnedAnts ?? 0),
        generated: Decimal.min(new Decimal(1e200), legacy.thirdGeneratedAnts ?? new Decimal())
      }

      player.ants.producers[AntProducers.MegaBreeders] = {
        purchased: Math.min(250, legacy.fourthOwnedAnts ?? 0),
        generated: Decimal.min(new Decimal(1e200), legacy.fourthGeneratedAnts ?? new Decimal())
      }

      player.ants.producers[AntProducers.Queens] = {
        purchased: Math.min(87, legacy.fifthOwnedAnts ?? 0),
        generated: Decimal.min(new Decimal(10), legacy.fifthGeneratedAnts ?? new Decimal())
      }

      player.ants.producers[AntProducers.LordRoyals] = {
        purchased: Math.min(1, legacy.sixthOwnedAnts ?? 0),
        generated: new Decimal()
      }

      // The rest cost more than 1e1000 crumbs, so we can ignore

      if (legacy.antUpgrades !== undefined) {
        player.ants.upgrades[0] = Math.min(1000, legacy.antUpgrades[0] ?? 0)
        player.ants.upgrades[1] = Math.min(1000, legacy.antUpgrades[1] ?? 0)
        player.ants.upgrades[2] = Math.min(1000, legacy.antUpgrades[2] ?? 0)
        player.ants.upgrades[3] = Math.min(1000, legacy.antUpgrades[3] ?? 0)
        player.ants.upgrades[4] = Math.min(500, legacy.antUpgrades[4] ?? 0)
        player.ants.upgrades[5] = Math.min(500, legacy.antUpgrades[5] ?? 0)
        player.ants.upgrades[6] = Math.min(500, legacy.antUpgrades[6] ?? 0)
        player.ants.upgrades[7] = Math.min(500, legacy.antUpgrades[7] ?? 0)
        player.ants.upgrades[8] = Math.min(333, legacy.antUpgrades[8] ?? 0)
        player.ants.upgrades[9] = Math.min(333, legacy.antUpgrades[9] ?? 0)
        player.ants.upgrades[10] = Math.min(45, legacy.antUpgrades[10] ?? 0)
        player.ants.upgrades[11] = Math.min(7, legacy.antUpgrades[11] ?? 0)
      }

      player.ants.crumbs = Decimal.min(new Decimal('1e1000'), Decimal.max(1, legacy.antPoints))
      player.ants.crumbsThisSacrifice = Decimal.min(new Decimal('1e1000'), Decimal.max(1, legacy.antPoints))
      player.ants.crumbsEverMade = Decimal.min(new Decimal('1e1000'), Decimal.max(1, legacy.antPoints))

      if (legacy.antSacrificePoints !== undefined) {
        player.ants.immortalELO = Math.min(1000, legacy.antSacrificePoints)
        player.ants.rebornELO = 0
        player.ants.antSacrificeCount = (legacy.antSacrificePoints > 0) ? 1 : 0
      }

      if (legacy.autoAntSacrifice !== undefined) {
        player.ants.toggles.autoSacrificeEnabled = legacy.autoAntSacrifice
      }

      if (legacy.autoAntSacTimer !== undefined) {
        player.ants.toggles.autoSacrificeThreshold = legacy.autoAntSacTimer
      }

      if (legacy.autoAntSacrificeMode !== undefined) {
        player.ants.toggles.autoSacrificeMode = legacy.autoAntSacrificeMode % NUM_SACRIFICE_MODES
      }

      if (legacy.antMax !== undefined) {
        player.ants.toggles.maxBuyProducers = legacy.antMax
        player.ants.toggles.maxBuyUpgrades = legacy.antMax
      }
    }
  }),

  // The old resettoggles treated '0' and '1' states the same, and '2' state as the alternative.
  migration({
    requires: { resettoggle1: z.number() },
    migrate: (player, { resettoggle1 }) => {
      player.resetToggleModes.prestige = resettoggle1 === 2 ? 1 : 0
    }
  }),

  migration({
    requires: { resettoggle2: z.number() },
    migrate: (player, { resettoggle2 }) => {
      player.resetToggleModes.transcend = resettoggle2 === 2 ? 1 : 0
    }
  }),

  migration({
    requires: { resettoggle3: z.number() },
    migrate: (player, { resettoggle3 }) => {
      player.resetToggleModes.reincarnation = resettoggle3 === 2 ? 1 : 0
    }
  }),

  migration({
    requires: { resettoggle4: z.number() },
    migrate: (player, { resettoggle4 }) => {
      player.resetToggleModes.ascension = resettoggle4 === 2 ? 1 : 0
    }
  }),

  migration({
    requires: { firstOwnedCoin: z.number() },
    migrate: (player) => {
      let corruptionLevel = 0

      if (player.highestSingularityCount >= 8) {
        corruptionLevel = 45
      } else if (player.highestSingularityCount >= 1 || player.platonicUpgrades[10] > 0) {
        corruptionLevel = 30
      } else if (player.platonicUpgrades[5] > 0) {
        corruptionLevel = 22
      } else if ((player.highestchallengecompletions[14] ?? 0) > 0) {
        corruptionLevel = 15
      } else if ((player.highestchallengecompletions[13] ?? 0) > 0) {
        corruptionLevel = 7
      } else if ((player.highestchallengecompletions[12] ?? 0) > 0) {
        corruptionLevel = 5
      } else if ((player.highestchallengecompletions[11] ?? 0) > 0) {
        corruptionLevel = 3
      }

      if (player.corruptions.highestCleared < corruptionLevel) {
        player.corruptions.highestCleared = corruptionLevel

        if (player.challengecompletions[11] > 0) {
          player.currentChallenge.ascension = 0
          player.corruptions.used = Math.max(player.corruptions.used, corruptionLevel)
          player.corruptions.ascensionLevel = Math.max(player.corruptions.ascensionLevel, corruptionLevel)
          player.corruptions.next = Math.max(player.corruptions.next, corruptionLevel)
          player.challengecompletions[10] = Math.max(player.challengecompletions[10], 1)
        }

        void Alert(i18next.t('versionChangeAnnouncements.v4-4-1-Corruptions', { level: format(corruptionLevel) }))
      }

      if (player.singularityChallenges.barDependence.highestSingularityCompleted > 292) {
        player.singularityChallenges.barDependence.highestSingularityCompleted = 292

        void Alert(i18next.t('versionChangeAnnouncements.v4-4-1-BarCharging'))
      }
    }
  })
]

const legacyShape: Shape = {}
for (const { requires, optional } of migrations) {
  Object.assign(legacyShape, requires, optional)
}

const legacySchema = z.object(legacyShape).partial()

export const parseSave = (data: unknown) => {
  const player = playerSchema.safeParse(data)
  if (!player.success) {
    return player
  }

  const legacy = legacySchema.safeParse(data)
  if (!legacy.success) {
    return legacy
  }

  for (const { requires, migrate } of migrations) {
    if (Object.keys(requires).every((key) => legacy.data[key] !== undefined)) {
      migrate(player.data, legacy.data as never)
    }
  }

  return player
}
