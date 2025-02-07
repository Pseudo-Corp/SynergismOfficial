import { CorruptionLoadout, type Corruptions, CorruptionSaves } from '../Corruptions'
import { convertArrayToCorruption } from './PlayerJsonSchema'
import { playerSchema } from './PlayerSchema'

export const playerUpdateVarSchema = playerSchema.transform((player) => {
  if (player.usedCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.usedCorruptions)
    player.corruptions.used = new CorruptionLoadout(corrLoadout)
  }

  if (player.prototypeCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.prototypeCorruptions)
    player.corruptions.next = new CorruptionLoadout(corrLoadout)
  }

  if (player.corruptionShowStats !== undefined) {
    player.corruptions.showStats = player.corruptionShowStats
  }

  if (player.corruptionLoadouts !== undefined && player.corruptionLoadoutNames !== undefined) {
    const corruptionSaveStuff: { [key: string]: Corruptions } = player.corruptionLoadoutNames.reduce(
      (map, key, index) => {
        map[key] = convertArrayToCorruption(player.corruptionLoadouts![index + 1])
        return map
      },
      {} as Record<string, Corruptions>
    )

    player.corruptions.saves = new CorruptionSaves(corruptionSaveStuff)
  }

  player.usedCorruptions = undefined
  player.prototypeCorruptions = undefined
  player.corruptionLoadoutNames = undefined
  player.corruptionLoadouts = undefined

  return player
})