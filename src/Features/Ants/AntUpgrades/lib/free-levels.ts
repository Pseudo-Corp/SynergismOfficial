import { getAchievementReward } from '../../../../Achievements'
import { CalcECC } from '../../../../Challenges'
import { player } from '../../../../Synergism'
import { Globals } from '../../../../Variables'

export const computeFreeAntUpgradeLevels = () => {
  let bonusLevels = 0
  bonusLevels += CalcECC('reincarnation', player.challengecompletions[9])
  bonusLevels += Math.round(2000 * (1 - Math.pow(0.999, player.constantUpgrades[6])))
  bonusLevels += 12 * CalcECC('ascension', player.challengecompletions[11])
  bonusLevels += 2 * player.researches[97]
  bonusLevels += 2 * player.researches[98]
  bonusLevels += player.researches[102]
  bonusLevels += 2 * player.researches[132]
  bonusLevels += Math.floor((1 / 200) * player.researches[200])
  bonusLevels += +getAchievementReward('freeAntUpgrades')
  bonusLevels *= Globals.challenge15Rewards.bonusAntLevel.value

  if (player.currentChallenge.ascension === 11) {
    bonusLevels += Math.floor(
      3 * player.challengecompletions[8]
        + 5 * player.challengecompletions[9]
    )
    return bonusLevels
  }

  return bonusLevels
}
