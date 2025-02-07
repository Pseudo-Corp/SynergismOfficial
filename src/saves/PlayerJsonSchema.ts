import { z } from 'zod'
import type { CorruptionLoadout, Corruptions } from '../Corruptions'
import type { Player } from '../types/Synergism'
import { playerCampaignSchema, playerCorruptionSchema, playerSchema } from './PlayerSchema'

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

export const playerJsonSchema = playerSchema.extend({
  codes: z.any().transform((codes: Player['codes']) => Array.from(codes)),
  worlds: z.any().transform((worlds: Player['worlds']) => Number(worlds)),
  wowCubes: z.any().transform((cubes: Player['wowCubes']) => Number(cubes)),
  wowTesseracts: z.any().transform((tesseracts: Player['wowTesseracts']) => Number(tesseracts)),
  wowHypercubes: z.any().transform((hypercubes: Player['wowHypercubes']) => Number(hypercubes)),
  wowPlatonicCubes: z.any().transform((cubes: Player['wowPlatonicCubes']) => Number(cubes)),

  campaigns: playerCampaignSchema.transform((campaignManager: Player['campaigns']) => {
    return campaignManager.c10Completions
  }),

  corruptions: playerCorruptionSchema.transform((stuff: Player['corruptions']) => {
    return {
      used: stuff.used.loadout,
      next: stuff.next.loadout,
      saves: Object.fromEntries(
        stuff.saves.getSaves().map((save: { name: string; loadout: CorruptionLoadout }) => {
          return [save.name, save.loadout.loadout]
        })
      ),
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
}).transform((player) => {
  if (player.usedCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.usedCorruptions)
    player.corruptions.used = corrLoadout
  }

  if (player.prototypeCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.prototypeCorruptions)
    player.corruptions.next = corrLoadout
  }

  if (player.corruptionShowStats !== undefined) {
    player.corruptions.showStats = player.corruptionShowStats
  }

  player.corruptions.showStats = player.corruptionShowStats ?? player.corruptions.showStats

  if (player.corruptionLoadouts !== undefined && player.corruptionLoadoutNames !== undefined) {
    const corruptionSaveStuff: { [key: string]: Corruptions } = player.corruptionLoadoutNames.reduce(
      (map, key, index) => {
        map[key] = convertArrayToCorruption(player.corruptionLoadouts![index + 1])
        return map
      },
      {} as Record<string, Corruptions>
    )

    player.corruptions.saves = corruptionSaveStuff
  }

  Reflect.deleteProperty(player, 'usedCorruptions')
  Reflect.deleteProperty(player, 'prototypeCorruptions')
  Reflect.deleteProperty(player, 'corruptionLoadoutNames')
  Reflect.deleteProperty(player, 'corruptionLoadouts')

  return player
})
