import { z } from 'zod'
import { CampaignManager } from '../Campaign'
import type { Corruptions } from '../Corruptions'
import type { Player } from '../types/Synergism'
import { playerSchema } from './PlayerSchema'

export const convertArrayToCorruption = (array: number[]): Corruptions => {
  return {
    viscosity: array[2],
    drought: array[8],
    deflation: array[6],
    extinction: array[7],
    illiteracy: array[5],
    recession: array[9],
    dilation: array[3],
    hyperchallenge: array[4]
  }
}

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

export const playerJsonSchema = playerSchema.extend({
  codes: z.any().transform((codes: Player['codes']) => Array.from(codes)),
  worlds: z.any().transform((worlds: Player['worlds']) => Number(worlds)),
  wowCubes: z.any().transform((cubes: Player['wowCubes']) => Number(cubes)),
  wowTesseracts: z.any().transform((tesseracts: Player['wowTesseracts']) => Number(tesseracts)),
  wowHypercubes: z.any().transform((hypercubes: Player['wowHypercubes']) => Number(hypercubes)),
  wowPlatonicCubes: z.any().transform((cubes: Player['wowPlatonicCubes']) => Number(cubes)),

  campaigns: z.instanceof(CampaignManager).transform((campaigns) => {
    return campaigns.campaignManagerData
  }),

  corruptions: z.object({
    used: z.object({ loadout: optionalCorruptionSchema }),
    next: z.object({ loadout: optionalCorruptionSchema }),
    saves: z.object({ corrSaveData: z.record(z.string(), optionalCorruptionSchema) }),
    showStats: z.boolean()
  }).transform((stuff) => {
    return {
      used: stuff.used.loadout,
      next: stuff.next.loadout,
      saves: stuff.saves.corrSaveData,
      showStats: stuff.showStats
    }
  }),

  singularityUpgrades: z.any().transform((upgrades: Player['singularityUpgrades']) =>
    Object.fromEntries(
      Object.entries(upgrades).map(([key, value]) => {
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
    )
  ),
  octeractUpgrades: z.any().transform((upgrades: Player['octeractUpgrades']) =>
    Object.fromEntries(
      Object.entries(upgrades).map(([key, value]) => {
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
    )
  ),
  singularityChallenges: z.any().transform((challenges: Player['singularityChallenges']) =>
    Object.fromEntries(
      Object.entries(challenges).map(([key, value]) => {
        return [
          key,
          {
            completions: value.completions,
            highestSingularityCompleted: value.highestSingularityCompleted,
            enabled: value.enabled
          }
        ]
      })
    )
  ),
  blueberryUpgrades: z.any().transform((upgrades: Player['blueberryUpgrades']) =>
    Object.fromEntries(
      Object.entries(upgrades).map(([key, value]) => {
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
  ),

  dayCheck: z.any().transform((dayCheck: Player['dayCheck']) => dayCheck?.toISOString() ?? null)
})
