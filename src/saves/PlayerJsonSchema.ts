import { z } from 'zod'
import type { Player } from '../types/Synergism'
import { playerSchema } from './PlayerSchema'
import { Corruptions, CorruptionSaves } from '../Corruptions'

export const playerJsonSchema = playerSchema.extend({
  codes: z.any().transform((codes: Player['codes']) => Array.from(codes)),
  worlds: z.any().transform((worlds: Player['worlds']) => Number(worlds)),
  wowCubes: z.any().transform((cubes: Player['wowCubes']) => Number(cubes)),
  wowTesseracts: z.any().transform((tesseracts: Player['wowTesseracts']) => Number(tesseracts)),
  wowHypercubes: z.any().transform((hypercubes: Player['wowHypercubes']) => Number(hypercubes)),
  wowPlatonicCubes: z.any().transform((cubes: Player['wowPlatonicCubes']) => Number(cubes)),

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
  pixelUpgrades: z.any().transform((upgrades: Player['pixelUpgrades']) =>
    Object.fromEntries(
      Object.entries(upgrades).map(([key, value]) => {
        return [
          key,
          {
            level: value.level,
            pixelsInvested: value.pixelsInvested,
            toggleBuy: value.toggleBuy,
            freeLevels: value.freeLevels
          }
        ]
      })
    )
  ),
  dayCheck: z.any().transform((dayCheck: Player['dayCheck']) => dayCheck?.toISOString() ?? null),
  //usedCorruptions: z.any().transform(() => undefined),
  //prototypeCorruptions: z.any().transform(() => undefined),
  //corruptionLoadouts: z.any().transform(() => undefined),
  //corruptionLoadoutNames: z.any().transform(() => undefined),
  //corruptionShowStats: z.any().transform(() => undefined)

}).transform((player) => {
  
  player.corruptions.used = player.usedCorruptions ?? player.corruptions.used
  player.corruptions.prototype = player.prototypeCorruptions ?? player.corruptions.prototype
  player.corruptions.showStats = player.corruptionShowStats ?? player.corruptions.showStats

  if (player.corruptionLoadouts !== undefined && player.corruptionLoadoutNames !== undefined) {

    const corruptionSaveStuff: { [key: string]: Partial<Corruptions> } = player.corruptionLoadoutNames.reduce((map, key, index) => {
      map[key] = player.corruptionLoadouts![index]
      return map
    }, {} as Record<string, Partial<Corruptions>>)

    player.corruptions.saves = new CorruptionSaves(corruptionSaveStuff)
  }

  player.usedCorruptions = undefined
  player.prototypeCorruptions = undefined
  player.corruptionShowStats = undefined
  player.corruptionLoadoutNames = undefined
  player.corruptionLoadouts = undefined

  return player
})
