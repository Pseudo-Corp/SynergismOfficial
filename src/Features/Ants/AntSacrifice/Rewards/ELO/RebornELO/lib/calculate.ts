import { rebornELOCreationSpeedMultStats } from '../../../../../../../Statistics'
import { player } from '../../../../../../../Synergism'

export const calculateAvailableRebornELO = () => {
  const pool = player.ants.immortalELO
  const alreadyActivated = player.ants.rebornELO
  return Math.max(0, pool - alreadyActivated)
}

export const rebornELOCreationSpeedMult = () => {
  return rebornELOCreationSpeedMultStats.reduce((a, b) => a * b.stat(), 1)
}