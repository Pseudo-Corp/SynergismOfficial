import { player } from '../../../../../../../../Synergism'

export const LEADERBOARD_WEIGHTS = [1, 0.8, 0.6, 0.4, 0.2]
export const NUM_LEADERBOARD_ENTRIES = LEADERBOARD_WEIGHTS.length

export const updateAntLeaderboards = () => {
  const currentELO = player.ants.rebornELO
  const currentSacrificeId = player.ants.currentSacrificeId

  // Update daily leaderboard
  updateSingleLeaderboard(player.ants.highestRebornELODaily, currentELO, currentSacrificeId)

  // Update all-time leaderboard
  updateSingleLeaderboard(player.ants.highestRebornELOEver, currentELO, currentSacrificeId)
}

const updateSingleLeaderboard = (
  leaderboard: Array<{ elo: number; sacrificeId: number }>,
  currentELO: number,
  currentSacrificeId: number
) => {
  // First, check if currentELO suffices (if it does not... no action needed)
  if (leaderboard.length === NUM_LEADERBOARD_ENTRIES) {
    if (currentELO < leaderboard[leaderboard.length - 1].elo) {
      return
    }
  }

  // Find if current sacrifice is already in the leaderboard
  const existingIndex = leaderboard.findIndex((entry) => entry.sacrificeId === currentSacrificeId)
  if (existingIndex !== -1) {
    // Update existing entry
    leaderboard[existingIndex].elo = currentELO
    if (existingIndex > 0 && leaderboard[existingIndex].elo > leaderboard[existingIndex - 1].elo) {
      // Sort again
      leaderboard.sort((a, b) => b.elo - a.elo)
    }
  } else {
    // Add new entry
    leaderboard.push({ elo: currentELO, sacrificeId: currentSacrificeId })
    leaderboard.sort((a, b) => b.elo - a.elo)
  }

  // Keep only top 5
  if (leaderboard.length > NUM_LEADERBOARD_ENTRIES) {
    leaderboard.length = NUM_LEADERBOARD_ENTRIES
  }
}
