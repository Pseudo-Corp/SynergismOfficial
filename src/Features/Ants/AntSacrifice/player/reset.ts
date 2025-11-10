import { awardAchievementGroup, getAchievementReward } from '../../../../Achievements'
import { AntSacrificeTiers } from '../../../../Reset'
import { player } from '../../../../Synergism'
import { sacrificeCountHTML } from '../../HTML/updates/sacrifice'
import { defaultAntSacrificeCount, defaultCurrentSacrificeId } from './default'

export const resetPlayerAntSacrificeCounts = (resetTier: AntSacrificeTiers) => {
  // ALWAYS increment sacrificeId for the permanent Reborn ELO leaderboard
  player.ants.currentSacrificeId++
  if (resetTier >= AntSacrificeTiers.ascension) {
    player.ants.antSacrificeCount = defaultAntSacrificeCount
  } else {
    let sacrificeAdd = 1
    sacrificeAdd *= +getAchievementReward('antSacrificeCountMultiplier')
    player.ants.antSacrificeCount += sacrificeAdd
    awardAchievementGroup('sacCount')
  }

  // If you reset the game
  if (resetTier >= AntSacrificeTiers.never) {
    player.ants.currentSacrificeId = defaultCurrentSacrificeId
  }

  sacrificeCountHTML(player.ants.antSacrificeCount)
}
