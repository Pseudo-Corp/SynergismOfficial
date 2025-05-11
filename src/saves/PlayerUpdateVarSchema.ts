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
    const corruptionSaveStuff = player.corruptionLoadoutNames.reduce(
      (map, key, index) => {
        if (player.corruptionLoadouts?.[index + 1]) {
          map[key] = convertArrayToCorruption(player.corruptionLoadouts[index + 1] ?? Array(100).fill(0))
        }
        return map
      },
      {} as Record<string, Corruptions>
    )

    player.corruptions.saves = new CorruptionSaves(corruptionSaveStuff)
  }

  if (player.ultimatePixels !== undefined || player.cubeUpgradeRedBarFilled !== undefined) {
    // One-time conversion for red bar filled and ultimate pixels (to a lesser degree)

    const redBarFilled = player.cubeUpgradeRedBarFilled ?? 0
    const ultimatePixels = player.ultimatePixels ?? 0

    player.redAmbrosia += Math.floor(ultimatePixels * 0.2 + redBarFilled)
    player.lifetimeRedAmbrosia += Math.floor(ultimatePixels * 0.2 + redBarFilled)
  }

  Reflect.deleteProperty(player, 'usedCorruptions')
  Reflect.deleteProperty(player, 'prototypeCorruptions')
  Reflect.deleteProperty(player, 'corruptionShowStats')
  Reflect.deleteProperty(player, 'corruptionLoadouts')
  Reflect.deleteProperty(player, 'corruptionLoadoutNames')
  Reflect.deleteProperty(player, 'ultimatePixels')
  Reflect.deleteProperty(player, 'cubeUpgradeRedBarFilled')

  return player
})
