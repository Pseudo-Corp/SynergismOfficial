import { player } from '../../../../../../../Synergism'

/**
 * @returns Value of perk "Advanced... Cheating Tactics?"
 */
export const singularityELOBonusMult = () => {
  const singCount = player.singularityCount
  const levelArray = [3, 11, 27, 51, 83, 123, 171, 198, 227, 258, 291]

  for (let i = levelArray.length - 1; i >= 0; i--) {
    if (singCount >= levelArray[i]) {
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
  const levelArray = [2, 10, 26, 50, 82, 122, 170, 197, 226, 257, 290]

  for (let i = levelArray.length - 1; i >= 0; i--) {
    if (singCount >= levelArray[i]) {
      const firstTranchMult = 0.02 + 0.018 * i
      const secondTranchMult = 0.001 + 0.0009 * i
      const immortalELO = player.ants.immortalELO
      return Math.min(200_000, immortalELO) * firstTranchMult
        + Math.max(0, Math.min(1_800_000, immortalELO - 200000)) * secondTranchMult
    }
  }

  return 0
}
