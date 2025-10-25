import { LEADERBOARD_WEIGHTS } from './leaderboard-update'

export const calculateLeaderboardValue = (leaderboard: Array<{ elo: number; sacrificeId: number }>): number => {
  let total = 0
  for (let i = 0; i < Math.min(leaderboard.length, LEADERBOARD_WEIGHTS.length); i++) {
    total += leaderboard[i].elo * LEADERBOARD_WEIGHTS[i]
  }
  return total
}
