import { player } from '../../../../../../../Synergism'

const eloBonusMultLevels = [3, 11, 27, 51, 83, 123, 171, 198, 227, 258, 291]
const eloPerkLevels = [2, 10, 26, 50, 82, 122, 170, 197, 226, 257, 290]

/**
 * @returns Value of perk "Advanced... Cheating Tactics?"
 */
export const singularityELOBonusMult = () => {
  const singCount = player.singularityCount

  for (let i = eloBonusMultLevels.length - 1; i >= 0; i--) {
    if (singCount >= eloBonusMultLevels[i]) {
      return 0.001 + 0.0009 * i
    }
  }

  return 0
}

/**
 * @returns Value of perk "Invigorated Spirits!"
 */
export const calculateSingularityPerkELO = () => {
  const singCount = player.singularityCount
  for (let i = eloPerkLevels.length - 1; i >= 0; i--) {
    if (singCount >= eloPerkLevels[i]) {
      const firstTranchMult = 0.02 + 0.018 * i
      const secondTranchMult = 0.001 + 0.0009 * i
      const immortalELO = player.ants.immortalELO
      return Math.min(200_000, immortalELO) * firstTranchMult
        + Math.max(0, Math.min(1_800_000, immortalELO - 200000)) * secondTranchMult
    }
  }

  return 0
}
