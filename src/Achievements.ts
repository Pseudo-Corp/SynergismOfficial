import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcCorruptionStuff, calculateAscensionScore } from './Calculate'
import { hepteracts } from './Hepteracts'
import { octeractUpgrades } from './Octeracts'
import { redAmbrosiaUpgrades } from './RedAmbrosiaUpgrades'
import { runeBlessings } from './RuneBlessings'
import { runes, sumOfFreeRuneLevels, sumOfRuneLevels } from './Runes'
import { runeSpirits } from './RuneSpirits'
import { getGQUpgradeEffect, goldenQuarkUpgrades } from './singularity'
import { maxAPFromChallenges, type SingularityChallengeDataKeys } from './SingularityChallenges'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { talismans } from './Talismans'
import type { resetNames } from './types/Synergism'
import { Alert, Notification, revealStuff } from './UpdateHTML'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'
import { Tabs } from './Tabs'
import { displayLevelStuff } from './Levels'
import { campaignTokens } from './Campaign'
import { antSacrificePointsToMultiplier } from './Ants'

export const resetAchievementCheck = (reset: resetNames) => {
  if (reset === 'prestige') {
    awardUngroupedAchievement('prestigeNoAccelerator')
    awardUngroupedAchievement('prestigeNoMult')
    awardUngroupedAchievement('prestigeNoCoinUpgrade')
    awardAchievementGroup('prestigePointGain')
  }
  if (reset === 'transcension') {
    awardUngroupedAchievement('transcendNoAccelerator')
    awardUngroupedAchievement('transcendNoMult')
    awardUngroupedAchievement('transcendNoCoinUpgrade')
    awardUngroupedAchievement('transcendNoCoinDiamondUpgrade')
    awardAchievementGroup('transcendPointGain')
  }
  if (reset === 'reincarnation') {
    awardUngroupedAchievement('reincarnationNoAccelerator')
    awardUngroupedAchievement('reincarnationNoMult')
    awardUngroupedAchievement('reincarnationNoCoinUpgrade')
    awardUngroupedAchievement('reincarnationNoCoinDiamondUpgrade')
    awardUngroupedAchievement('reincarnationNoCoinDiamondMythosUpgrade')
    awardUngroupedAchievement('reincarnationMinimumUpgrades')
    awardAchievementGroup('reincarnationPointGain')
  }
}

export const challengeAchievementCheck = (i: number) => {
  switch (i) {
    case 1:
      awardAchievementGroup('challenge1')
      awardUngroupedAchievement('chal1NoGen')
      break
    case 2:
      awardAchievementGroup('challenge2')
      awardUngroupedAchievement('chal2NoGen')
      break
    case 3:
      awardAchievementGroup('challenge3')
      awardUngroupedAchievement('chal3NoGen')
      break
    case 4:
      awardAchievementGroup('challenge4')
      break
    case 5:
      awardAchievementGroup('challenge5')
      awardUngroupedAchievement('diamondSearch')
      break
    case 6:
      awardAchievementGroup('challenge6')
      break
    case 7:
      awardAchievementGroup('challenge7')
      break
    case 8:
      awardAchievementGroup('challenge8')
      break
    case 9:
      awardAchievementGroup('challenge9')
      break
    case 10:
      awardAchievementGroup('challenge10')
      break
    case 11:
      awardAchievementGroup('challenge11')
      if (player.challengecompletions[10] > 50 && player.corruptions.used.extinction >= 5) {
        awardUngroupedAchievement('extraChallenging')
      }
      break
    case 12:
      awardAchievementGroup('challenge12')
      break
    case 13:
      awardAchievementGroup('challenge13')
      break
    case 14:
      awardAchievementGroup('challenge14')
      break
    case 15:
      awardUngroupedAchievement('sadisticAch')
      break
  }
}

export const buildingAchievementCheck = () => {
  awardAchievementGroup('firstOwnedCoin')
  awardAchievementGroup('secondOwnedCoin')
  awardAchievementGroup('thirdOwnedCoin')
  awardAchievementGroup('fourthOwnedCoin')
  awardAchievementGroup('fifthOwnedCoin')
}

export const getAchievementQuarks = (i: number) => {
  const globalQuarkMultiplier = player.worlds.applyBonus(1)
  let actualMultiplier = globalQuarkMultiplier
  if (actualMultiplier > 100) {
    actualMultiplier = Math.pow(100, 0.6) * Math.pow(actualMultiplier, 0.4)
  }

  return Math.floor(achievements[i].pointValue * actualMultiplier)
}

/* June 9, 2025 Achievements System Rewrite */
export type AchievementGroups =
  | 'firstOwnedCoin'
  | 'secondOwnedCoin'
  | 'thirdOwnedCoin'
  | 'fourthOwnedCoin'
  | 'fifthOwnedCoin'
  | 'prestigePointGain'
  | 'transcendPointGain'
  | 'reincarnationPointGain'
  | 'challenge1'
  | 'challenge2'
  | 'challenge3'
  | 'challenge4'
  | 'challenge5'
  | 'challenge6'
  | 'challenge7'
  | 'challenge8'
  | 'challenge9'
  | 'challenge10'
  | 'accelerators'
  | 'acceleratorBoosts'
  | 'multipliers'
  | 'antCrumbs'
  | 'sacMult'
  | 'ascensionCount'
  | 'constant'
  | 'challenge11'
  | 'challenge12'
  | 'challenge13'
  | 'challenge14'
  | 'ascensionScore'
  | 'speedBlessing'
  | 'speedSpirit'
  | 'singularityCount'
  | 'runeLevel'
  | 'runeFreeLevel'
  | 'campaignTokens'
  | 'prestigeCount'
  | 'transcensionCount'
  | 'reincarnationCount'
  | 'ungrouped'

export type AchievementRewards =
  | 'acceleratorPower'
  | 'accelerators'
  | 'multipliers'
  | 'accelBoosts'
  | 'crystalMultiplier'
  | 'taxReduction'
  | 'particleGain'
  | 'conversionExponent'
  | 'chronosTalisman'
  | 'midasTalisman'
  | 'metaphysicsTalisman'
  | 'polymathTalisman'
  | 'chal7Researches'
  | 'chal8Researches'
  | 'chal9Researches'
  | 'talismanPower'
  | 'sacrificeMult'
  | 'antSpeed'
  | 'antSacrificeUnlock'
  | 'antAutobuyers'
  | 'antUpgradeAutobuyers'
  | 'antELOAdditive'
  | 'antELOMultiplicative'
  | 'wowSquareTalisman'
  | 'ascensionCountMultiplier'
  | 'ascensionCountAdditive'
  | 'wowCubeGain'
  | 'wowTesseractGain'
  | 'wowHypercubeGain'
  | 'wowPlatonicGain'
  | 'quarkGain'
  | 'wowHepteractGain'
  | 'ascensionScore'
  | 'constUpgrade1Buff'
  | 'constUpgrade2Buff'
  | 'platonicToHypercubes'
  | 'statTracker'
  | 'ascensionRewardScaling'
  | 'overfluxConversionRate'
  | 'diamondUpgrade18'
  | 'diamondUpgrade19'
  | 'diamondUpgrade20'
  | 'prestigeCountMultiplier'
  | 'transcensionCountMultiplier'
  | 'reincarnationCountMultiplier'
  | 'duplicationRuneUnlock'
  | 'prismRuneUnlock'
  | 'thriftRuneUnlock'
  | 'salvage'
  | 'offeringBonus'
  | 'obtainiumBonus'
  | 'transcendToPrestige'
  | 'reincarnationToTranscend'

export type AchievementReward = Partial<Record<AchievementRewards, () => number>>

export interface Achievement {
  pointValue: number
  unlockCondition: () => boolean
  group: AchievementGroups
  reward?: AchievementReward
  checkReset?: () => boolean
}

export interface ProgressiveAchievementsObject {
  cached: number
  rewardedAP: number
}

export interface ProgressiveAchievement {
  maxPointValue: number
  pointsAwarded: (cached: number) => number
  updateValue: () => number // Number to compare to existing caches
  useCachedValue: boolean
  rewardedAP: number // Updating achievementPoints: pointsAwarded() - rewardedAP
  extraI18n?: () => Record<string, number>
  displayOrder: number
  displayCondition: () => boolean
}

export const progressiveAchievements: Record<ProgressiveAchievements, ProgressiveAchievement> = {
  runeLevel: {
    maxPointValue: 1000,
    pointsAwarded: (cached: number) => {
      return Math.min(200, Math.floor(cached / 1000)) + Math.min(400, Math.floor(cached / 2500))
        + Math.min(400, Math.floor(cached / 12500))
    },
    updateValue: () => {
      return sumOfRuneLevels()
    },
    useCachedValue: true,
    rewardedAP: 0,
    displayOrder: 1,
    displayCondition: () => player.prestigeCount > 0
  },
  freeRuneLevel: {
    maxPointValue: 1000,
    pointsAwarded: (cached: number) => {
      return Math.min(200, Math.floor(cached / 1000)) + Math.min(400, Math.floor(cached / 2500))
        + Math.min(400, Math.floor(cached / 10000))
    },
    updateValue: () => {
      return sumOfFreeRuneLevels()
    },
    useCachedValue: true,
    rewardedAP: 0,
    displayOrder: 2,
    displayCondition: () => player.prestigeCount > 0
  },
  singularityCount: {
    maxPointValue: 3600,
    pointsAwarded: (_cached: number) => {
      return 9 * player.highestSingularityCount
        + 3 * Math.max(0, player.highestSingularityCount - 100)
        + 3 * Math.max(0, player.highestSingularityCount - 200)
    },
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 4,
    displayCondition: () => player.highestSingularityCount > 0
  },
  ambrosiaCount: {
    maxPointValue: 800,
    pointsAwarded: (cached: number) => {
      return Math.min(200, Math.floor(cached / 100))
        + Math.min(200, Math.floor(cached / 10000))
        + Math.min(400, Math.floor(400 * Math.sqrt(cached / 1e8)))
    },
    updateValue: () => {
      return player.lifetimeAmbrosia
    },
    useCachedValue: true,
    rewardedAP: 0,
    displayOrder: 8,
    displayCondition: () => player.highestSingularityCount >= 25
  },
  redAmbrosiaCount: {
    maxPointValue: 800,
    pointsAwarded: (cached: number) => {
      return Math.min(200, Math.floor(cached / 25))
        + Math.min(200, Math.floor(cached / 2500))
        + Math.min(400, Math.floor(400 * Math.sqrt(cached / 5e6)))
    },
    updateValue: () => {
      return player.lifetimeRedAmbrosia
    },
    useCachedValue: true,
    rewardedAP: 0,
    displayOrder: 9,
    displayCondition: () => player.highestSingularityCount >= 150
  },
  exalts: {
    maxPointValue: maxAPFromChallenges,
    pointsAwarded: (_cached: number) => {
      let pointValue = 0
      for (const chal of Object.keys(player.singularityChallenges) as SingularityChallengeDataKeys[]) {
        pointValue += player.singularityChallenges[chal].rewardAP
      }
      return pointValue
    },
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    extraI18n: () => {
      return { 
        num1: player.singularityChallenges.noSingularityUpgrades.rewardAP,
        cap1: player.singularityChallenges.noSingularityUpgrades.maxAP,
        num2: player.singularityChallenges.oneChallengeCap.rewardAP,
        cap2: player.singularityChallenges.oneChallengeCap.maxAP,
        num3: player.singularityChallenges.limitedAscensions.rewardAP,
        cap3: player.singularityChallenges.limitedAscensions.maxAP,
        num4: player.singularityChallenges.noOcteracts.rewardAP,
        cap4: player.singularityChallenges.noOcteracts.maxAP,
        num5: player.singularityChallenges.noAmbrosiaUpgrades.rewardAP,
        cap5: player.singularityChallenges.noAmbrosiaUpgrades.maxAP,
        num6: player.singularityChallenges.limitedTime.rewardAP,
        cap6: player.singularityChallenges.limitedTime.maxAP,
        num7: player.singularityChallenges.sadisticPrequel.rewardAP,
        cap7: player.singularityChallenges.sadisticPrequel.maxAP,
        num8: player.singularityChallenges.noOfferingPower.rewardAP,
        cap8: player.singularityChallenges.noOfferingPower.maxAP,
      }
    },
    displayOrder: 7,
    displayCondition: () => player.highestSingularityCount >= 25
  },
  singularityUpgrades: {
    maxPointValue: -1,
    pointsAwarded: (_cached: number) => {
      let pointValue = 0
      // Go through all sing upgrades. if the max level is NOT -1, add 5 points if the upgrade level equals max level
      for (const upgrade of Object.values(goldenQuarkUpgrades)) {
        if (upgrade.maxLevel !== -1 && upgrade.level >= upgrade.maxLevel) {
          pointValue += 5
        }
      }
      return pointValue
    },
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 5,
    displayCondition: () => player.highestSingularityCount > 0
  },
  octeractUpgrades: {
    maxPointValue: -1,
    pointsAwarded: (_cached: number) => {
      let pointValue = 0
      // Go through all octeract upgrades. if the max level is NOT -1, add 5 points if the upgrade level equals max level
      for (const upgrade of Object.values(octeractUpgrades)) {
        if (upgrade.maxLevel !== -1 && upgrade.level >= upgrade.maxLevel) {
          pointValue += 8
        }
      }
      return pointValue
    },
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 6,
    displayCondition: () => Boolean(getGQUpgradeEffect('octeractUnlock'))
  },
  redAmbrosiaUpgrades: {
    maxPointValue: -1,
    pointsAwarded: () => {
      let pointValue = 0
      for (const upgrade of Object.values(redAmbrosiaUpgrades)) {
        if (upgrade.level >= upgrade.maxLevel) {
          pointValue += 10
        }
      }
      return pointValue
    },
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 10,
    displayCondition: () => player.highestSingularityCount >= 150
  },
  talismanRarities: {
    maxPointValue: -1,
    pointsAwarded: (cached: number) => {
      return 5 * cached
    },
    updateValue: () => {
      return Object.values(talismans).reduce((acc, talisman) => {
        acc += talisman.rarity
        return acc
      }, 0)
    },
    useCachedValue: true,
    rewardedAP: 0,
    displayOrder: 3,
    displayCondition: () => player.unlocks.talismans
  }
}

export const emptyProgressiveAchievements = Object
  .fromEntries(
    (Object.keys(progressiveAchievements)).map((key) => [key, { cached: 0, rewardedAP: 0 }])
  ) as Record<ProgressiveAchievements, ProgressiveAchievementsObject>

export const achievements: Achievement[] = [
  { pointValue: 5, unlockCondition: () => true, group: 'ungrouped' }, // Free Achievement Perhaps?
  { pointValue: 5, unlockCondition: () => player.firstOwnedCoin >= 1, group: 'firstOwnedCoin' },
  { pointValue: 10, unlockCondition: () => player.firstOwnedCoin >= 10, group: 'firstOwnedCoin' },
  {
    pointValue: 15,
    unlockCondition: () => player.firstOwnedCoin >= 100,
    group: 'firstOwnedCoin',
    reward: { acceleratorPower: () => 0.001 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.firstOwnedCoin >= 1000,
    group: 'firstOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => player.firstOwnedCoin >= 5000,
    group: 'firstOwnedCoin',
    reward: { accelerators: () => Math.floor(player.firstOwnedCoin / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.firstOwnedCoin >= 10000,
    group: 'firstOwnedCoin',
    reward: { multipliers: () => Math.floor(player.firstOwnedCoin / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.firstOwnedCoin >= 20000,
    group: 'firstOwnedCoin',
    reward: { accelBoosts: () => Math.floor(player.firstOwnedCoin / 2000) }
  },
  { pointValue: 5, unlockCondition: () => player.secondOwnedCoin >= 1, group: 'secondOwnedCoin' },
  { pointValue: 10, unlockCondition: () => player.secondOwnedCoin >= 10, group: 'secondOwnedCoin' },
  {
    pointValue: 15,
    unlockCondition: () => player.secondOwnedCoin >= 100,
    group: 'secondOwnedCoin',
    reward: { acceleratorPower: () => 0.0015 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.secondOwnedCoin >= 500,
    group: 'secondOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => player.secondOwnedCoin >= 5000,
    group: 'secondOwnedCoin',
    reward: { accelerators: () => Math.floor(player.secondOwnedCoin / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.secondOwnedCoin >= 10000,
    group: 'secondOwnedCoin',
    reward: { multipliers: () => Math.floor(player.secondOwnedCoin / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.secondOwnedCoin >= 20000,
    group: 'secondOwnedCoin',
    reward: { accelBoosts: () => Math.floor(player.secondOwnedCoin / 2000) }
  },
  { pointValue: 5, unlockCondition: () => player.thirdOwnedCoin >= 1, group: 'thirdOwnedCoin' },
  { pointValue: 10, unlockCondition: () => player.thirdOwnedCoin >= 10, group: 'thirdOwnedCoin' },
  {
    pointValue: 15,
    unlockCondition: () => player.thirdOwnedCoin >= 100,
    group: 'thirdOwnedCoin',
    reward: { acceleratorPower: () => 0.002 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.thirdOwnedCoin >= 333,
    group: 'thirdOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => player.thirdOwnedCoin >= 5000,
    group: 'thirdOwnedCoin',
    reward: { accelerators: () => Math.floor(player.thirdOwnedCoin / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.thirdOwnedCoin >= 10000,
    group: 'thirdOwnedCoin',
    reward: { multipliers: () => Math.floor(player.thirdOwnedCoin / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.thirdOwnedCoin >= 20000,
    group: 'thirdOwnedCoin',
    reward: { accelBoosts: () => Math.floor(player.thirdOwnedCoin / 2000) }
  },
  { pointValue: 5, unlockCondition: () => player.fourthOwnedCoin >= 1, group: 'fourthOwnedCoin' },
  { pointValue: 10, unlockCondition: () => player.fourthOwnedCoin >= 10, group: 'fourthOwnedCoin' },
  {
    pointValue: 15,
    unlockCondition: () => player.thirdOwnedCoin >= 100,
    group: 'fourthOwnedCoin',
    reward: { acceleratorPower: () => 0.002 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.thirdOwnedCoin >= 333,
    group: 'fourthOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => player.thirdOwnedCoin >= 5000,
    group: 'fourthOwnedCoin',
    reward: { accelerators: () => Math.floor(player.thirdOwnedCoin / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.thirdOwnedCoin >= 10000,
    group: 'fourthOwnedCoin',
    reward: { multipliers: () => Math.floor(player.thirdOwnedCoin / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.thirdOwnedCoin >= 20000,
    group: 'fourthOwnedCoin',
    reward: { accelBoosts: () => Math.floor(player.thirdOwnedCoin / 2000) }
  },
  { pointValue: 5, unlockCondition: () => player.fifthOwnedCoin >= 1, group: 'fifthOwnedCoin' },
  { pointValue: 10, unlockCondition: () => player.fifthOwnedCoin >= 10, group: 'fifthOwnedCoin' },
  {
    pointValue: 15,
    unlockCondition: () => player.fifthOwnedCoin >= 66,
    group: 'fifthOwnedCoin',
    reward: { acceleratorPower: () => 0.003 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.fifthOwnedCoin >= 200,
    group: 'fifthOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => player.fifthOwnedCoin >= 6666,
    group: 'fifthOwnedCoin',
    reward: { accelerators: () => Math.floor(player.fifthOwnedCoin / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.fifthOwnedCoin >= 17777,
    group: 'fifthOwnedCoin',
    reward: { multipliers: () => Math.floor(player.fifthOwnedCoin / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.fifthOwnedCoin >= 42777,
    group: 'fifthOwnedCoin',
    reward: { accelBoosts: () => Math.floor(player.fifthOwnedCoin / 2000) }
  },
  {
    pointValue: 5,
    unlockCondition: () => G.prestigePointGain.gte(1),
    group: 'prestigePointGain',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 10,
    unlockCondition: () => G.prestigePointGain.gte(1e6),
    group: 'prestigePointGain',
    reward: { crystalMultiplier: () => Math.max(1, Decimal.log(player.prestigePoints, Math.E)) },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => G.prestigePointGain.gte(1e100),
    group: 'prestigePointGain',
    checkReset: () => player.highestSingularityCount >= 3
  },
  { pointValue: 20, unlockCondition: () => G.prestigePointGain.gte('1e1000'), group: 'prestigePointGain' },
  { pointValue: 25, unlockCondition: () => G.prestigePointGain.gte('1e10000'), group: 'prestigePointGain' },
  { pointValue: 30, unlockCondition: () => G.prestigePointGain.gte('1e77777'), group: 'prestigePointGain' },
  { pointValue: 35, unlockCondition: () => G.prestigePointGain.gte('1e250000'), group: 'prestigePointGain' },
  {
    pointValue: 5,
    unlockCondition: () => G.transcendPointGain.gte(1),
    group: 'transcendPointGain',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 10,
    unlockCondition: () => G.transcendPointGain.gte(1e6),
    group: 'transcendPointGain',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => G.transcendPointGain.gte(1e50),
    group: 'transcendPointGain',
    reward: { taxReduction: () => 0.95 }
  },
  {
    pointValue: 20,
    unlockCondition: () => G.transcendPointGain.gte(1e308),
    group: 'transcendPointGain',
    reward: { taxReduction: () => 0.95 }
  },
  {
    pointValue: 25,
    unlockCondition: () => G.transcendPointGain.gte('1e1500'),
    group: 'transcendPointGain',
    reward: { taxReduction: () => 0.9 }
  },
  { pointValue: 30, unlockCondition: () => G.transcendPointGain.gte('1e25000'), group: 'transcendPointGain' },
  { pointValue: 35, unlockCondition: () => G.transcendPointGain.gte('1e100000'), group: 'transcendPointGain' },
  {
    pointValue: 5,
    unlockCondition: () => G.reincarnationPointGain.gte(1),
    group: 'reincarnationPointGain',
    reward: { particleGain: () => 2 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  { pointValue: 10, unlockCondition: () => G.reincarnationPointGain.gte(1e5), group: 'reincarnationPointGain' },
  { pointValue: 15, unlockCondition: () => G.reincarnationPointGain.gte(1e30), group: 'reincarnationPointGain' },
  {
    pointValue: 20,
    unlockCondition: () => G.reincarnationPointGain.gte(1e200),
    group: 'reincarnationPointGain',
  },
  {
    pointValue: 25,
    unlockCondition: () => G.reincarnationPointGain.gte('1e1500'),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 30,
    unlockCondition: () => G.reincarnationPointGain.gte('1e5000'),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 35,
    unlockCondition: () => G.reincarnationPointGain.gte('1e7777'),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 5,
    unlockCondition: () => player.prestigenomultiplier,
    group: 'ungrouped',
    reward: { multipliers: () => 1 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => player.transcendnomultiplier,
    group: 'ungrouped',
    reward: { multipliers: () => 2 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.reincarnatenomultiplier,
    group: 'ungrouped',
    reward: { multipliers: () => 4 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 20,
    unlockCondition: () => player.prestigenoaccelerator,
    group: 'ungrouped',
    reward: { accelerators: () => 2 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 25,
    unlockCondition: () => player.transcendnoaccelerator,
    group: 'ungrouped',
    reward: { accelerators: () => 4 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 30,
    unlockCondition: () => player.reincarnatenoaccelerator,
    group: 'ungrouped',
    reward: { accelerators: () => 8 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 35,
    unlockCondition: () => {
      return player.coinsThisTranscension.gte('1e120000') && player.acceleratorBought === 0
        && player.acceleratorBoostBought === 0
    },
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 5,
    unlockCondition: () => player.prestigenocoinupgrades,
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => player.transcendnocoinupgrades,
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.transcendnocoinorprestigeupgrades,
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.reincarnatenocoinupgrades,
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 20,
    unlockCondition: () => player.reincarnatenocoinorprestigeupgrades,
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 30,
    unlockCondition: () => player.reincarnatenocoinprestigeortranscendupgrades,
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 40,
    unlockCondition: () => player.reincarnatenocoinprestigetranscendorgeneratorupgrades,
    group: 'ungrouped',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => {
      return sumContents(player.upgrades.slice(101, 106)) === 1 && player.upgrades[102] === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => {
      return sumContents(player.upgrades.slice(101, 106)) === 1 && player.upgrades[103] === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => {
      return sumContents(player.upgrades.slice(101, 106)) === 1 && player.upgrades[104] === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 20,
    unlockCondition: () => {
      return sumContents(player.upgrades.slice(101, 106)) === 1 && player.upgrades[105] === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 25,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 1 && player.coinsThisTranscension.gte('1e1000')
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 25,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 2 && player.coinsThisTranscension.gte('1e1000')
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 50,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 3 && player.coinsThisTranscension.gte('1e99999')
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[1] >= 1,
    group: 'challenge1',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[1] >= 3,
    group: 'challenge1',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[1] >= 5,
    group: 'challenge1',
    checkReset: () => player.highestSingularityCount >= 3
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[1] >= 10, group: 'challenge1' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[1] >= 20,
    group: 'challenge1',
    reward: { taxReduction: () => 0.96 }
  },
  { pointValue: 30, unlockCondition: () => player.challengecompletions[1] >= 50, group: 'challenge1' },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[1] >= 75,
    group: 'challenge1',
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[2] >= 1,
    group: 'challenge2',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[2] >= 3,
    group: 'challenge2',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[2] >= 5,
    group: 'challenge2',
    checkReset: () => player.highestSingularityCount >= 3
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[2] >= 10, group: 'challenge2' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[2] >= 20,
    group: 'challenge2',
    reward: { taxReduction: () => 0.96 }
  },
  { pointValue: 30, unlockCondition: () => player.challengecompletions[2] >= 50, group: 'challenge2' },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[2] >= 75,
    group: 'challenge2',
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[3] >= 1,
    group: 'challenge3',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[3] >= 3,
    group: 'challenge3',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[3] >= 5,
    group: 'challenge3',
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[3] >= 10, group: 'challenge3' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[3] >= 20,
    group: 'challenge3',
    reward: { taxReduction: () => 0.96 }
  },
  { pointValue: 30, unlockCondition: () => player.challengecompletions[3] >= 50, group: 'challenge3' },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[3] >= 75,
    group: 'challenge3',
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[4] >= 1,
    group: 'challenge4',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[4] >= 3,
    group: 'challenge4',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[4] >= 5,
    group: 'challenge4',
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[4] >= 10,
    group: 'challenge4',
  },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[4] >= 20,
    group: 'challenge4',
    reward: { taxReduction: () => 0.96 }
  },
  { pointValue: 30, unlockCondition: () => player.challengecompletions[4] >= 50, group: 'challenge4' },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[4] >= 75,
    group: 'challenge4',
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[5] >= 1,
    group: 'challenge5',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[5] >= 3,
    group: 'challenge5',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[5] >= 5,
    group: 'challenge5',
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[5] >= 10, group: 'challenge5' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[5] >= 20,
    group: 'challenge5',
    reward: { taxReduction: () => 0.96 }
  },
  { pointValue: 30, unlockCondition: () => player.challengecompletions[5] >= 50, group: 'challenge5' },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[5] >= 75,
    group: 'challenge5',
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[6] >= 1,
    group: 'challenge6',
    checkReset: () => player.highestSingularityCount >= 4
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[6] >= 2, group: 'challenge6' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[6] >= 3,
    group: 'challenge6',
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[6] >= 5, group: 'challenge6' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[6] >= 10,
    group: 'challenge6',
    reward: { taxReduction: () => 0.95 }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[6] >= 20,
    group: 'challenge6',
    reward: {
      taxReduction: () =>
        Math.pow(
          0.9925,
          player.challengecompletions[6] + player.challengecompletions[7] + player.challengecompletions[8]
            + player.challengecompletions[9] + player.challengecompletions[10]
        )
    }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[6] >= 25,
    group: 'challenge6',
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[7] >= 1,
    group: 'challenge7',
    reward: { diamondUpgrade18: () => 0 },
    checkReset: () => player.highestSingularityCount >= 7
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[7] >= 2, group: 'challenge7' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[7] >= 3,
    group: 'challenge7',
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[7] >= 5, group: 'challenge7' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[7] >= 10,
    group: 'challenge7',
    reward: { taxReduction: () => 0.95, chal7Researches: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[7] >= 20,
    group: 'challenge7',
  },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[7] >= 25,
    group: 'challenge7',
    reward: { chronosTalisman: () => 1 }
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[8] >= 1,
    group: 'challenge8',
    reward: { chal8Researches: () => 1, diamondUpgrade19: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[8] >= 2, group: 'challenge8' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[8] >= 3,
    group: 'challenge8',
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[8] >= 5, group: 'challenge8' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[8] >= 10,
    group: 'challenge8',
    reward: { taxReduction: () => 0.95 }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[8] >= 20,
    group: 'challenge8',
  },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[8] >= 25,
    group: 'challenge8',
    reward: { midasTalisman: () => 1 }
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[9] >= 1,
    group: 'challenge9',
    reward: { chal9Researches: () => 1, diamondUpgrade20: () => 1 },
    checkReset: () => player.highestSingularityCount >= 20
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[9] >= 2,
    group: 'challenge9',
    reward: { talismanPower: () => 0.02 }
  },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[9] >= 3,
    group: 'challenge9',
    reward: { talismanPower: () => 0.02 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[9] >= 5,
    group: 'challenge9',
    reward: { sacrificeMult: () => 1.25 }
  },
  { pointValue: 25, unlockCondition: () => player.challengecompletions[9] >= 10, group: 'challenge9' },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[9] >= 20,
    group: 'challenge9',
  },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[9] >= 25,
    group: 'challenge9',
    reward: { metaphysicsTalisman: () => 1 }
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[10] >= 1,
    group: 'challenge10',
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[10] >= 2, group: 'challenge10' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[10] >= 3,
    group: 'challenge10',
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[10] >= 5,
    group: 'challenge10',
    reward: { talismanPower: () => 0.025 }
  },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[10] >= 10,
    group: 'challenge10',
    reward: { talismanPower: () => 0.025 }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[10] >= 15,
    group: 'challenge10',
  },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[10] >= 25,
    group: 'challenge10',
    reward: { polymathTalisman: () => 1 }
  },
  { pointValue: 5, unlockCondition: () => player.acceleratorBought >= 5, group: 'accelerators' },
  {
    pointValue: 10,
    unlockCondition: () => player.acceleratorBought >= 25,
    group: 'accelerators',
    reward: { acceleratorPower: () => 0.01 }
  },
  { pointValue: 15, unlockCondition: () => player.acceleratorBought >= 100, group: 'accelerators' },
  {
    pointValue: 20,
    unlockCondition: () => player.acceleratorBought >= 666,
    group: 'accelerators',
    reward: { accelerators: () => 5 }
  },
  {
    pointValue: 25,
    unlockCondition: () => player.acceleratorBought >= 2000,
    group: 'accelerators',
    reward: { accelerators: () => 12 }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.acceleratorBought >= 12500,
    group: 'accelerators',
    reward: { accelerators: () => 25 }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.acceleratorBought >= 100000,
    group: 'accelerators',
    reward: { accelerators: () => 50 }
  },
  { pointValue: 5, unlockCondition: () => player.multiplierBought >= 2, group: 'multipliers' },
  {
    pointValue: 10,
    unlockCondition: () => player.multiplierBought >= 20,
    group: 'multipliers',
    reward: { multipliers: () => 1 }
  },
  { pointValue: 15, unlockCondition: () => player.multiplierBought >= 100, group: 'multipliers' },
  {
    pointValue: 20,
    unlockCondition: () => player.multiplierBought >= 500,
    group: 'multipliers',
    reward: { multipliers: () => 1 }
  },
  {
    pointValue: 25,
    unlockCondition: () => player.multiplierBought >= 2000,
    group: 'multipliers',
    reward: { multipliers: () => 3 }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.multiplierBought >= 12500,
    group: 'multipliers',
    reward: { multipliers: () => 6 }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.multiplierBought >= 100000,
    group: 'multipliers',
    reward: { multipliers: () => 10 }
  },
  { pointValue: 5, unlockCondition: () => player.acceleratorBoostBought >= 2, group: 'acceleratorBoosts' },
  { pointValue: 10, unlockCondition: () => player.acceleratorBoostBought >= 10, group: 'acceleratorBoosts' },
  { pointValue: 15, unlockCondition: () => player.acceleratorBoostBought >= 50, group: 'acceleratorBoosts' },
  { pointValue: 20, unlockCondition: () => player.acceleratorBoostBought >= 200, group: 'acceleratorBoosts' },
  { pointValue: 25, unlockCondition: () => player.acceleratorBoostBought >= 1000, group: 'acceleratorBoosts' },
  { pointValue: 30, unlockCondition: () => player.acceleratorBoostBought >= 5000, group: 'acceleratorBoosts' },
  { pointValue: 35, unlockCondition: () => player.acceleratorBoostBought >= 15000, group: 'acceleratorBoosts' },
  {
    pointValue: 5,
    unlockCondition: () => player.antPoints.gte(3),
    group: 'antCrumbs',
    reward: { antSpeed: () => Decimal.log(player.antPoints.plus(10), 10) }
  },
  { pointValue: 10, unlockCondition: () => player.antPoints.gte(1e5), group: 'antCrumbs' },
  {
    pointValue: 15,
    unlockCondition: () => player.antPoints.gte(666666666),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1.2 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.antPoints.gte(1e20),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1.25 }
  },
  {
    pointValue: 25,
    unlockCondition: () => player.antPoints.gte(1e40),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1.4, antSacrificeUnlock: () => 1, antAutobuyers: () => 1 }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.antPoints.gte('1e500'),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1 + Math.log10(player.antSacrificePoints + 1) }
  },
  { pointValue: 35, unlockCondition: () => player.antPoints.gte('1e2500'), group: 'antCrumbs' },
  {
    pointValue: 5,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 2 && player.secondOwnedAnts > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, antUpgradeAutobuyers: () => 2 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 10,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 6 && player.thirdOwnedAnts > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, antUpgradeAutobuyers: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 15,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 20 && player.fourthOwnedAnts > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, antUpgradeAutobuyers: () => 2 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 20,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 100 && player.fifthOwnedAnts > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, antUpgradeAutobuyers: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 25,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 500 && player.sixthOwnedAnts > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, antUpgradeAutobuyers: () => 2 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 30,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 6666 && player.seventhOwnedAnts > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, antUpgradeAutobuyers: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 35,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 77777 && player.eighthOwnedAnts > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, antUpgradeAutobuyers: () => 2 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  { pointValue: 5, unlockCondition: () => player.ascensionCount >= 1, group: 'ascensionCount' },
  { pointValue: 10, unlockCondition: () => player.ascensionCount >= 2, group: 'ascensionCount' },
  { pointValue: 15, unlockCondition: () => player.ascensionCount >= 10, group: 'ascensionCount' },
  {
    pointValue: 20,
    unlockCondition: () => player.ascensionCount >= 100,
    group: 'ascensionCount',
    reward: { wowSquareTalisman: () => 1 }
  },
  {
    pointValue: 25,
    unlockCondition: () => player.ascensionCount >= 1000,
    group: 'ascensionCount',
    reward: {
      ascensionCountMultiplier: () => Math.log10(calculateAscensionScore().effectiveScore + 100) - 1,
    }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.ascensionCount >= 14142,
    group: 'ascensionCount',
    reward: {
      ascensionCountAdditive: () => (player.ascensionCounter > 10) ? 100 : 0,
    }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.ascensionCount >= 141421,
    group: 'ascensionCount',
    reward: {
      ascensionCountAdditive: () => (player.ascensionCounter > 10) ? player.ascensionCounterReal * 2 : 0,
      wowCubeGain: () => 1 + 2 * Math.min(1, player.ascensionCount / 5e8)
    }
  },
  { pointValue: 5, unlockCondition: () => player.ascendShards.gte(3.14), group: 'constant' },
  { pointValue: 10, unlockCondition: () => player.ascendShards.gte(1e6), group: 'constant' },
  { pointValue: 15, unlockCondition: () => player.ascendShards.gte(4.32e10), group: 'constant' },
  {
    pointValue: 20,
    unlockCondition: () => player.ascendShards.gte(6.9e21),
    group: 'constant',
    reward: { wowCubeGain: () => 1 + Decimal.log(player.ascendShards.add(1), 10) / 400 }
  },
  { pointValue: 25, unlockCondition: () => player.ascendShards.gte(1.509e33), group: 'constant' },
  {
    pointValue: 30,
    unlockCondition: () => player.ascendShards.gte(1e66),
    group: 'constant',
    reward: {
      wowCubeGain: () => 1 + 249 * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000),
      wowTesseractGain: () => 1 + 249 * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000)
    }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.ascendShards.gte('1.8e308'),
    group: 'constant',
    reward: { wowPlatonicGain: () => 1 + 19 * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000) }
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[11] >= 1,
    group: 'challenge11',
    reward: { statTracker: () => 1, }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[11] >= 2,
    group: 'challenge11',
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[11] >= 3,
    group: 'challenge11',
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[11] >= 5,
    group: 'challenge11',
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[11] >= 10,
    group: 'challenge11',
  },
  {
    pointValue: 60,
    unlockCondition: () => player.challengecompletions[11] >= 20,
    group: 'challenge11',
    reward: { ascensionCountAdditive: () => player.ascensionCounter * 2 }
  },
  {
    pointValue: 70,
    unlockCondition: () => player.challengecompletions[11] >= 30,
    group: 'challenge11',
    reward: { talismanPower: () => 0.01 }
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[12] >= 1,
    group: 'challenge12',
    reward: { ascensionRewardScaling: () => 1 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[12] >= 2,
    group: 'challenge12',
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[12] >= 3,
    group: 'challenge12',
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[12] >= 5,
    group: 'challenge12',
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[12] >= 10,
    group: 'challenge12',
  },
  {
    pointValue: 60,
    unlockCondition: () => player.challengecompletions[12] >= 20,
    group: 'challenge12',
    reward: { ascensionCountAdditive: () => player.ascensionCounter * 2 }
  },
  {
    pointValue: 70,
    unlockCondition: () => player.challengecompletions[12] >= 30,
    group: 'challenge12',
    reward: { talismanPower: () => 0.01 }
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[13] >= 1,
    group: 'challenge13',
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[13] >= 2,
    group: 'challenge13',
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[13] >= 3,
    group: 'challenge13',
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[13] >= 5,
    group: 'challenge13',
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[13] >= 10,
    group: 'challenge13',
  },
  {
    pointValue: 60,
    unlockCondition: () => player.challengecompletions[13] >= 20,
    group: 'challenge13',
    reward: { ascensionCountAdditive: () => player.ascensionCounter * 2 }
  },
  {
    pointValue: 70,
    unlockCondition: () => player.challengecompletions[13] >= 30,
    group: 'challenge13',
    reward: { talismanPower: () => 0.01 }
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[14] >= 1,
    group: 'challenge14',
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[14] >= 2,
    group: 'challenge14',
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[14] >= 3,
    group: 'challenge14',
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[14] >= 5,
    group: 'challenge14',
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[14] >= 10,
    group: 'challenge14',
  },
  {
    pointValue: 60,
    unlockCondition: () => player.challengecompletions[14] >= 20,
    group: 'challenge14',
    reward: {
      ascensionCountAdditive: () => player.ascensionCounter * 2,
      wowPlatonicGain: () => 1 + 2 * Math.min(1, player.ascensionCount / 2.674e9)
    }
  },
  { pointValue: 70, unlockCondition: () => player.challengecompletions[14] >= 30, group: 'challenge14' },
  { pointValue: 5, unlockCondition: () => CalcCorruptionStuff()[3] >= 1e5, group: 'ascensionScore' },
  { pointValue: 10, unlockCondition: () => CalcCorruptionStuff()[3] >= 1e6, group: 'ascensionScore' },
  { pointValue: 15, unlockCondition: () => CalcCorruptionStuff()[3] >= 1e7, group: 'ascensionScore' },
  { pointValue: 20, unlockCondition: () => CalcCorruptionStuff()[3] >= 1e8, group: 'ascensionScore' },
  { pointValue: 25, unlockCondition: () => CalcCorruptionStuff()[3] >= 1e9, group: 'ascensionScore' },
  { pointValue: 30, unlockCondition: () => CalcCorruptionStuff()[3] >= 5e9, group: 'ascensionScore' },
  { pointValue: 35, unlockCondition: () => CalcCorruptionStuff()[3] >= 2.5e10, group: 'ascensionScore' },
  { pointValue: 10, unlockCondition: () => runeBlessings.speed.level >= 100, group: 'speedBlessing', },
  {
    pointValue: 20,
    unlockCondition: () => runeBlessings.speed.level >= 250,
    group: 'speedBlessing',
  },
  { pointValue: 30, unlockCondition: () => runeBlessings.speed.level >= 500, group: 'speedBlessing' },
  {
    pointValue: 10,
    unlockCondition: () => runeSpirits.speed.level >= 100,
    group: 'speedSpirit',
  },
  { pointValue: 20, unlockCondition: () => runeSpirits.speed.level >= 250, group: 'speedSpirit' },
  {
    pointValue: 30,
    unlockCondition: () => runeSpirits.speed.level >= 500,
    group: 'speedSpirit',
  },
  {
    pointValue: 50,
    unlockCondition: () => {
      return player.currentChallenge.transcension !== 0 && player.currentChallenge.reincarnation !== 0
        && player.currentChallenge.ascension !== 0
    },
    group: 'ungrouped'
  },
  { pointValue: 50, unlockCondition: () => player.mythicalFragments >= 1e25, group: 'ungrouped' },
  {
    pointValue: 50,
    unlockCondition: () => player.ascensionCount >= 1414213,
    group: 'ungrouped',
  },
  // 241: Global speed is SLOW
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 242: Global speed is FAST
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 243: :unsmith:
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 244: :smith:
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 245: High Speed Blessing
  {
    pointValue: 50,
    unlockCondition: () => runeBlessings.speed.level >= 2222,
    group: 'ungrouped',
  },
  // 246: Open 1 cube with a ton of cube tributes already
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 247: Extra challenging
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 248: Seeing Red But Not Blue
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 249: Overtaxed
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 250: Thousand Suns
  {
    pointValue: 100,
    unlockCondition: () => player.researches[200] === 1e5,
    group: 'ungrouped',
    reward: {
      quarkGain: () => 1.05
    }
  },
  // 251: Thousand Moons
  {
    pointValue: 150,
    unlockCondition: () => player.cubeUpgrades[50] === 1e5,
    group: 'ungrouped',
    reward: {
      quarkGain: () => 1.05
    }
  },
  // 252: Sadistic II
  {
    pointValue: 50,
    unlockCondition: () => G.challenge15Rewards.achievementUnlock.value === 1,
    group: 'ungrouped'
  },
  {
    pointValue: 40,
    unlockCondition: () => CalcCorruptionStuff()[3] >= 1e12,
    group: 'ascensionScore',
    reward: { wowHypercubeGain: () => 1.1 }
  },
  {
    pointValue: 45,
    unlockCondition: () => CalcCorruptionStuff()[3] >= 1e14,
    group: 'ascensionScore',
    reward: { wowCubeGain: () => 1.1 }
  },
  {
    pointValue: 50,
    unlockCondition: () => CalcCorruptionStuff()[3] >= 1e17,
    group: 'ascensionScore',
    reward: { wowTesseractGain: () => 1.1 }
  },
  {
    pointValue: 55,
    unlockCondition: () => CalcCorruptionStuff()[3] >= 2e18,
    group: 'ascensionScore',
    reward: { wowPlatonicGain: () => 1.1, overfluxConversionRate: () => 1.05 }
  },
  {
    pointValue: 60,
    unlockCondition: () => CalcCorruptionStuff()[3] >= 4e19,
    group: 'ascensionScore',
    reward: { overfluxConversionRate: () => 1.05 }
  },
  {
    pointValue: 65,
    unlockCondition: () => CalcCorruptionStuff()[3] >= 1e21,
    group: 'ascensionScore',
    reward: { wowHepteractGain: () => 1.1 }
  },
  {
    pointValue: 70,
    unlockCondition: () => CalcCorruptionStuff()[3] >= 1e23,
    group: 'ascensionScore',
    reward: { ascensionScore: () => Math.pow(1.01, hepteracts.abyss.TIMES_CAP_EXTENDED) }
  },
  {
    pointValue: 40,
    unlockCondition: () => player.ascensionCount >= 1e7,
    group: 'ascensionCount',
    reward: { ascensionCountMultiplier: () => 1.1 }
  },
  {
    pointValue: 45,
    unlockCondition: () => player.ascensionCount >= 1e8,
    group: 'ascensionCount',
    reward: { ascensionCountMultiplier: () => 1.1 }
  },
  {
    pointValue: 50,
    unlockCondition: () => player.ascensionCount >= 2e9,
    group: 'ascensionCount',
  },
  {
    pointValue: 55,
    unlockCondition: () => player.ascensionCount >= 4e10,
    group: 'ascensionCount',
  },
  {
    pointValue: 60,
    unlockCondition: () => player.ascensionCount >= 8e11,
    group: 'ascensionCount',
  },
  {
    pointValue: 65,
    unlockCondition: () => player.ascensionCount >= 1.6e13,
    group: 'ascensionCount',
  },
  {
    pointValue: 70,
    unlockCondition: () => player.ascensionCount >= 1e14,
    group: 'ascensionCount',
    reward: { quarkGain: () => 1 + 0.1 * Math.min(player.ascensionCount / 1e15, 1) }
  },
  {
    pointValue: 40,
    unlockCondition: () => player.ascendShards.gte('1e1000'),
    group: 'constant',
    reward: { ascensionScore: () => 1 + Math.min(Decimal.log(player.ascendShards.add(1), 10) / 1e5, 1) }
  },
  { pointValue: 45, unlockCondition: () => player.ascendShards.gte('1e5000'), group: 'constant' },
  { pointValue: 50, unlockCondition: () => player.ascendShards.gte('1e15000'), group: 'constant' },
  {
    pointValue: 55,
    unlockCondition: () => player.ascendShards.gte('1e50000'),
    group: 'constant',
    reward: {
      wowHepteractGain: () => 1 + Math.min(Decimal.log(player.ascendShards.add(1), 10) / 1e6, 1),
      constUpgrade1Buff: () => 0.01,
      constUpgrade2Buff: () => 0.01
    }
  },
  {
    pointValue: 60,
    unlockCondition: () => player.ascendShards.gte('1e100000'),
    group: 'constant',
    reward: { platonicToHypercubes: () => Math.min(1, Decimal.log(player.ascendShards.add(1), 10) / 1e6) }
  },
  { pointValue: 65, unlockCondition: () => player.ascendShards.gte('1e300000'), group: 'constant' },
  { pointValue: 70, unlockCondition: () => player.ascendShards.gte('1e1000000'), group: 'constant' },
  { pointValue: 10, unlockCondition: () => player.highestSingularityCount >= 1, group: 'singularityCount' },
  { pointValue: 20, unlockCondition: () => player.highestSingularityCount >= 2, group: 'singularityCount' },
  { pointValue: 30, unlockCondition: () => player.highestSingularityCount >= 3, group: 'singularityCount' },
  { pointValue: 40, unlockCondition: () => player.highestSingularityCount >= 4, group: 'singularityCount' },
  { pointValue: 50, unlockCondition: () => player.highestSingularityCount >= 5, group: 'singularityCount' },
  { pointValue: 60, unlockCondition: () => player.highestSingularityCount >= 7, group: 'singularityCount' },
  { pointValue: 70, unlockCondition: () => player.highestSingularityCount >= 10, group: 'singularityCount' },
  { pointValue: 40, unlockCondition: () => player.firstOwnedCoin >= 1e5, group: 'firstOwnedCoin' },
  { pointValue: 45, unlockCondition: () => player.firstOwnedCoin >= 1e6, group: 'firstOwnedCoin' },
  { pointValue: 50, unlockCondition: () => player.firstOwnedCoin >= 1e8, group: 'firstOwnedCoin' },
  { pointValue: 40, unlockCondition: () => player.secondOwnedCoin >= 1e6, group: 'secondOwnedCoin' },
  { pointValue: 45, unlockCondition: () => player.secondOwnedCoin >= 1e8, group: 'secondOwnedCoin' },
  { pointValue: 50, unlockCondition: () => player.secondOwnedCoin >= 1e9, group: 'secondOwnedCoin' },
  { pointValue: 40, unlockCondition: () => player.thirdOwnedCoin >= 1e7, group: 'thirdOwnedCoin' },
  { pointValue: 45, unlockCondition: () => player.thirdOwnedCoin >= 1e8, group: 'thirdOwnedCoin' },
  { pointValue: 50, unlockCondition: () => player.thirdOwnedCoin >= 5e9, group: 'thirdOwnedCoin' },
  { pointValue: 40, unlockCondition: () => player.fourthOwnedCoin >= 1e8, group: 'fourthOwnedCoin' },
  { pointValue: 45, unlockCondition: () => player.fourthOwnedCoin >= 1e9, group: 'fourthOwnedCoin' },
  { pointValue: 50, unlockCondition: () => player.fourthOwnedCoin >= 2e10, group: 'fourthOwnedCoin' },
  { pointValue: 40, unlockCondition: () => player.fifthOwnedCoin >= 1e9, group: 'fifthOwnedCoin' },
  { pointValue: 45, unlockCondition: () => player.fifthOwnedCoin >= 2e10, group: 'fifthOwnedCoin' },
  { pointValue: 50, unlockCondition: () => player.fifthOwnedCoin >= 1e12, group: 'fifthOwnedCoin' },
  { pointValue: 40, unlockCondition: () => G.prestigePointGain.gte('1e10000000'), group: 'prestigePointGain' },
  { pointValue: 45, unlockCondition: () => G.prestigePointGain.gte('1e10000000000'), group: 'prestigePointGain' },
  {
    pointValue: 50,
    unlockCondition: () => G.prestigePointGain.gte('1e10000000000000'),
    group: 'prestigePointGain'
  },
  { pointValue: 40, unlockCondition: () => G.transcendPointGain.gte('1e2500000'), group: 'transcendPointGain' },
  { pointValue: 45, unlockCondition: () => G.transcendPointGain.gte('1e2500000000'), group: 'transcendPointGain' },
  {
    pointValue: 50,
    unlockCondition: () => G.transcendPointGain.gte('1e2500000000000'),
    group: 'transcendPointGain'
  },
  {
    pointValue: 40,
    unlockCondition: () => G.reincarnationPointGain.gte('1e100000'),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 45,
    unlockCondition: () => G.reincarnationPointGain.gte('1e100000000'),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 50,
    unlockCondition: () => G.reincarnationPointGain.gte('1e100000000000'),
    group: 'reincarnationPointGain'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[1] >= 1000, group: 'challenge1' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[1] >= 9000, group: 'challenge1' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[1] >= 9001, group: 'challenge1' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[2] >= 1000, group: 'challenge2' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[2] >= 9000, group: 'challenge2' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[2] >= 9001, group: 'challenge2' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[3] >= 1000, group: 'challenge3' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[3] >= 9000, group: 'challenge3' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[3] >= 9001, group: 'challenge3' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[4] >= 1000, group: 'challenge4' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[4] >= 9000, group: 'challenge4' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[4] >= 9001, group: 'challenge4' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[5] >= 1000, group: 'challenge5' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[5] >= 9000, group: 'challenge5' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[5] >= 9001, group: 'challenge5' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[6] >= 40, group: 'challenge6' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[6] >= 80, group: 'challenge6' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[6] >= 120, group: 'challenge6' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[7] >= 40, group: 'challenge7' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[7] >= 80, group: 'challenge7' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[7] >= 125, group: 'challenge7' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[8] >= 40, group: 'challenge8' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[8] >= 80, group: 'challenge8' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[8] >= 130, group: 'challenge8' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[9] >= 40, group: 'challenge9' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[9] >= 80, group: 'challenge9' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[9] >= 135, group: 'challenge9' },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[10] >= 40, group: 'challenge10' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[10] >= 80, group: 'challenge10' },
  { pointValue: 50, unlockCondition: () => player.challengecompletions[10] >= 140, group: 'challenge10' },
  { pointValue: 40, unlockCondition: () => player.acceleratorBought >= 1e6, group: 'accelerators' },
  { pointValue: 45, unlockCondition: () => player.acceleratorBought >= 1e7, group: 'accelerators' },
  { pointValue: 50, unlockCondition: () => player.acceleratorBought >= 1e8, group: 'accelerators' },
  { pointValue: 40, unlockCondition: () => player.multiplierBought >= 3e6, group: 'multipliers' },
  { pointValue: 45, unlockCondition: () => player.multiplierBought >= 3e7, group: 'multipliers' },
  { pointValue: 50, unlockCondition: () => player.multiplierBought >= 3e8, group: 'multipliers' },
  { pointValue: 40, unlockCondition: () => player.acceleratorBoostBought >= 1e5, group: 'acceleratorBoosts' },
  { pointValue: 45, unlockCondition: () => player.acceleratorBoostBought >= 1e6, group: 'acceleratorBoosts' },
  { pointValue: 50, unlockCondition: () => player.acceleratorBoostBought >= 1e7, group: 'acceleratorBoosts' },
  { pointValue: 40, unlockCondition: () => player.antPoints.gte('1e25000'), group: 'antCrumbs' },
  { pointValue: 45, unlockCondition: () => player.antPoints.gte('1e125000'), group: 'antCrumbs' },
  { pointValue: 50, unlockCondition: () => player.antPoints.gte('1e1000000'), group: 'antCrumbs' },
  {
    pointValue: 40,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 1e12,
    group: 'sacMult'
  },
  {
    pointValue: 45,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 1e50,
    group: 'sacMult'
  },
  {
    pointValue: 50,
    unlockCondition: () => antSacrificePointsToMultiplier(player.antSacrificePoints) >= 1e150,
    group: 'sacMult'
  },
  { pointValue: 75, unlockCondition: () => player.ascensionCount >= 1e16, group: 'ascensionCount' },
  { pointValue: 80, unlockCondition: () => player.ascensionCount >= 1e20, group: 'ascensionCount' },
  { pointValue: 85, unlockCondition: () => player.ascensionCount >= 1e25, group: 'ascensionCount' },
  { pointValue: 90, unlockCondition: () => player.ascensionCount >= 1e35, group: 'ascensionCount' },
  { pointValue: 95, unlockCondition: () => player.ascensionCount >= 1e50, group: 'ascensionCount' },
  { pointValue: 100, unlockCondition: () => player.ascensionCount >= 1e75, group: 'ascensionCount' },
  { pointValue: 75, unlockCondition: () => player.ascendShards.gte('1e2000000'), group: 'constant' },
  { pointValue: 80, unlockCondition: () => player.ascendShards.gte('1e5000000'), group: 'constant' },
  { pointValue: 85, unlockCondition: () => player.ascendShards.gte('1e10000000'), group: 'constant' },
  { pointValue: 90, unlockCondition: () => player.ascendShards.gte('1e25000000'), group: 'constant' },
  { pointValue: 95, unlockCondition: () => player.ascendShards.gte('1e50000000'), group: 'constant' },
  { pointValue: 100, unlockCondition: () => player.ascendShards.gte('1e100000000'), group: 'constant' },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[11] >= 40, group: 'challenge11' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[11] >= 50, group: 'challenge11' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[11] >= 60, group: 'challenge11' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[11] >= 65, group: 'challenge11' },
  { pointValue: 120, unlockCondition: () => player.challengecompletions[11] >= 70, group: 'challenge11' },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[12] >= 40, group: 'challenge12' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[12] >= 50, group: 'challenge12' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[12] >= 60, group: 'challenge12' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[12] >= 65, group: 'challenge12' },
  { pointValue: 120, unlockCondition: () => player.challengecompletions[12] >= 70, group: 'challenge12' },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[13] >= 40, group: 'challenge13' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[13] >= 50, group: 'challenge13' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[13] >= 60, group: 'challenge13' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[13] >= 70, group: 'challenge13' },
  { pointValue: 120, unlockCondition: () => player.challengecompletions[13] >= 72, group: 'challenge13' },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[14] >= 40, group: 'challenge14' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[14] >= 50, group: 'challenge14' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[14] >= 60, group: 'challenge14' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[14] >= 70, group: 'challenge14' },
  { pointValue: 120, unlockCondition: () => player.challengecompletions[14] >= 72, group: 'challenge14' },
  {
    pointValue: 40,
    unlockCondition: () => runeBlessings.speed.level >= 1000,
    group: 'speedBlessing',
  },
  { pointValue: 50, unlockCondition: () => runeBlessings.speed.level >= 2000, group: 'speedBlessing' },
  {
    pointValue: 60,
    unlockCondition: () => runeBlessings.speed.level >= 4000,
    group: 'speedBlessing',
  },
  { pointValue: 70, unlockCondition: () => runeBlessings.speed.level >= 6000, group: 'speedBlessing' },
  {
    pointValue: 80,
    unlockCondition: () => runeBlessings.speed.level >= 8000,
    group: 'speedBlessing',
  },
  { pointValue: 90, unlockCondition: () => runeBlessings.speed.level >= 10000, group: 'speedBlessing' },
  {
    pointValue: 100,
    unlockCondition: () => runeBlessings.speed.level >= 12500,
    group: 'speedBlessing',
  },
  { pointValue: 40, unlockCondition: () => runeSpirits.speed.level >= 1000, group: 'speedSpirit' },
  {
    pointValue: 50,
    unlockCondition: () => runeSpirits.speed.level >= 2000,
    group: 'speedSpirit',
  },
  { pointValue: 60, unlockCondition: () => runeSpirits.speed.level >= 4000, group: 'speedSpirit' },
  {
    pointValue: 70,
    unlockCondition: () => runeSpirits.speed.level >= 6000,
    group: 'speedSpirit',
  },
  { pointValue: 80, unlockCondition: () => runeSpirits.speed.level >= 8000, group: 'speedSpirit' },
  {
    pointValue: 90,
    unlockCondition: () => runeSpirits.speed.level >= 10000,
    group: 'speedSpirit',
  },
  { pointValue: 100, unlockCondition: () => runeSpirits.speed.level >= 12500, group: 'speedSpirit' },
  {
    pointValue: 2,
    unlockCondition: () => runes.speed.level >= 100,
    group: 'runeLevel',
  },
  { pointValue: 4, unlockCondition: () => runes.speed.level >= 250, group: 'runeLevel' },
  {
    pointValue: 6,
    unlockCondition: () => runes.speed.level >= 500,
    group: 'runeLevel',
  },
  { pointValue: 8, unlockCondition: () => runes.speed.level >= 1000, group: 'runeLevel' },
  {
    pointValue: 10,
    unlockCondition: () => runes.speed.level >= 2000,
    group: 'runeLevel',
  },
  { pointValue: 12, unlockCondition: () => runes.speed.level >= 5000, group: 'runeLevel' },
  {
    pointValue: 14,
    unlockCondition: () => runes.speed.level >= 10000,
    group: 'runeLevel',
  },
  { pointValue: 16, unlockCondition: () => runes.speed.level >= 20000, group: 'runeLevel' },
  {
    pointValue: 18,
    unlockCondition: () => runes.speed.level >= 50000,
    group: 'runeLevel',
  },
  { pointValue: 20, unlockCondition: () => runes.speed.level >= 100000, group: 'runeLevel' },
  {
    pointValue: 22,
    unlockCondition: () => runes.speed.level >= 200000,
    group: 'runeLevel',
  },
  {
    pointValue: 24,
    unlockCondition: () => runes.speed.level >= 300000,
    group: 'runeLevel',
  },
  {
    pointValue: 26,
    unlockCondition: () => runes.speed.level >= 500000,
    group: 'runeLevel',
  },
  {
    pointValue: 28,
    unlockCondition: () => runes.speed.level >= 750000,
    group: 'runeLevel',
  },
  {
    pointValue: 30,
    unlockCondition: () => runes.speed.level >= 1000000,
    group: 'runeLevel',
  },
  {
    pointValue: 2,
    unlockCondition: () => runes.speed.freeLevels() >= 50,
    group: 'runeFreeLevel',
  },
  { pointValue: 4, unlockCondition: () => runes.speed.freeLevels() >= 100, group: 'runeFreeLevel' },
  {
    pointValue: 6,
    unlockCondition: () => runes.speed.freeLevels() >= 250,
    group: 'runeFreeLevel',
  },
  { pointValue: 8, unlockCondition: () => runes.speed.freeLevels() >= 500, group: 'runeFreeLevel' },
  {
    pointValue: 10,
    unlockCondition: () => runes.speed.freeLevels() >= 1000,
    group: 'runeFreeLevel',
  },
  { pointValue: 12, unlockCondition: () => runes.speed.freeLevels() >= 2500, group: 'runeFreeLevel' },
  {
    pointValue: 14,
    unlockCondition: () => runes.speed.freeLevels() >= 5000,
    group: 'runeFreeLevel',
  },
  { pointValue: 16, unlockCondition: () => runes.speed.freeLevels() >= 10000, group: 'runeFreeLevel' },
  {
    pointValue: 18,
    unlockCondition: () => runes.speed.freeLevels() >= 20000,
    group: 'runeFreeLevel',
  },
  { pointValue: 20, unlockCondition: () => runes.speed.freeLevels() >= 50000, group: 'runeFreeLevel' },
  {
    pointValue: 22,
    unlockCondition: () => runes.speed.freeLevels() >= 100000,
    group: 'runeFreeLevel',
  },
  { pointValue: 24, unlockCondition: () => runes.speed.freeLevels() >= 200000, group: 'runeFreeLevel' },
  {
    pointValue: 26,
    unlockCondition: () => runes.speed.freeLevels() >= 300000,
    group: 'runeFreeLevel',
  },
  { pointValue: 28, unlockCondition: () => runes.speed.freeLevels() >= 500000, group: 'runeFreeLevel' },
  {
    pointValue: 30,
    unlockCondition: () => runes.speed.freeLevels() >= 750000,
    group: 'runeFreeLevel',
  },
  {
    pointValue: 5,
    unlockCondition: () => campaignTokens >= 10,
    group: 'campaignTokens'
  },
  {
    pointValue: 10,
    unlockCondition: () => campaignTokens >= 20,
    group: 'campaignTokens'
  },
  {
    pointValue: 15,
    unlockCondition: () => campaignTokens >= 40,
    group: 'campaignTokens'
  },
  {
    pointValue: 20,
    unlockCondition: () => campaignTokens >= 80,
    group: 'campaignTokens'
  },
  {
    pointValue: 25,
    unlockCondition: () => campaignTokens >= 160,
    group: 'campaignTokens'
  },
  {
    pointValue: 30,
    unlockCondition: () => campaignTokens >= 320,
    group: 'campaignTokens'
  },
  {
    pointValue: 35,
    unlockCondition: () => campaignTokens >= 1000,
    group: 'campaignTokens'
  },
  {
    pointValue: 40,
    unlockCondition: () => campaignTokens >= 2000,
    group: 'campaignTokens'
  },
  {
    pointValue: 45,
    unlockCondition: () => campaignTokens >= 4000,
    group: 'campaignTokens'
  },
  {
    pointValue: 50,
    unlockCondition: () => campaignTokens >= 9000,
    group: 'campaignTokens'
  },
  {
    pointValue: 2,
    unlockCondition: () => player.prestigeCount >= 1,
    group: 'prestigeCount'
  },
  {
    pointValue: 4,
    unlockCondition: () => player.prestigeCount >= 10,
    group: 'prestigeCount',
    reward: { prestigeCountMultiplier: () => Math.max(1, 1 + Math.floor(Math.log10(player.prestigeCount)))}
  },
  {
    pointValue: 6,
    unlockCondition: () => player.prestigeCount >= 100,
    group: 'prestigeCount',
    reward: { duplicationRuneUnlock: () => 1 }
  },
  {
    pointValue: 8,
    unlockCondition: () => player.prestigeCount >= 1_000,
    group: 'prestigeCount',
    reward: { offeringBonus: () => 1 + 0.02 * Math.max(1, 1 + Math.floor(Math.log10(player.prestigeCount))) }
  },
  {
    pointValue: 10,
    unlockCondition: () => player.prestigeCount >= 10_000,
    group: 'prestigeCount'
  },
  {
    pointValue: 12,
    unlockCondition: () => player.prestigeCount >= 100_000,
    group: 'prestigeCount'
  },
  {
    pointValue: 14,
    unlockCondition: () => player.prestigeCount >= 1_000_000,
    group: 'prestigeCount',
    reward: { transcendToPrestige: () => 1 }
  },
  {
    pointValue: 16,
    unlockCondition: () => player.prestigeCount >= 10_000_000,
    group: 'prestigeCount'
  },
  {
    pointValue: 18,
    unlockCondition: () => player.prestigeCount >= 100_000_000,
    group: 'prestigeCount',
    reward: { transcensionCountMultiplier: () => Math.min(4, 1.25 + 2.75 * Math.floor(player.prestigecounter / 10)) }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.prestigeCount >= 1_000_000_000,
    group: 'prestigeCount'
  },
  {
    pointValue: 22,
    unlockCondition: () => player.prestigeCount >= 100_000_000_000,
    group: 'prestigeCount'
  },
  {
    pointValue: 24,
    unlockCondition: () => player.prestigeCount >= 10_000_000_000_000,
    group: 'prestigeCount'
  },
  {
    pointValue: 26,
    unlockCondition: () => player.prestigeCount >= 1e15,
    group: 'prestigeCount'
  },
  {
    pointValue: 28,
    unlockCondition: () => player.prestigeCount >= 1e17,
    group: 'prestigeCount'
  },
  {
    pointValue: 30,
    unlockCondition: () => player.prestigeCount >= 1e20,
    group: 'prestigeCount'
  },
  {
    pointValue: 3,
    unlockCondition: () => player.transcendCount >= 1,
    group: 'transcensionCount'
  },
  {
    pointValue: 6,
    unlockCondition: () => player.transcendCount >= 10,
    group: 'transcensionCount',
    reward: { transcensionCountMultiplier: () => Math.max(1, 1 + Math.floor(Math.log10(player.transcendCount))) }
  },
  {
    pointValue: 9,
    unlockCondition: () => player.transcendCount >= 100,
    group: 'transcensionCount',
    reward: { salvage: () => 2 * Math.max(1, 1 + Math.floor(Math.log10(player.transcendCount))) }
  },
  {
    pointValue: 12,
    unlockCondition: () => player.transcendCount >= 1_000,
    group: 'transcensionCount',
    reward: { prismRuneUnlock: () => 1 }
  },
  {
    pointValue: 15,
    unlockCondition: () => player.transcendCount >= 10_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 18,
    unlockCondition: () => player.transcendCount >= 100_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 21,
    unlockCondition: () => player.transcendCount >= 1_000_000,
    group: 'transcensionCount',
    reward: { reincarnationToTranscend: () => 1 }
  },
  {
    pointValue: 24,
    unlockCondition: () => player.transcendCount >= 10_000_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 27,
    unlockCondition: () => player.transcendCount >= 100_000_000,
    group: 'transcensionCount',
    reward: { reincarnationCountMultiplier: () => Math.min(4, 1.25 + 2.75 * Math.floor(player.prestigecounter / 1000)) }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.transcendCount >= 1_000_000_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 33,
    unlockCondition: () => player.transcendCount >= 30_000_000_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 36,
    unlockCondition: () => player.transcendCount >= 900_000_000_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 39,
    unlockCondition: () => player.transcendCount >= 27_000_000_000_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 42,
    unlockCondition: () => player.transcendCount >= 810_000_000_000_000,
    group: 'transcensionCount'
  },
  {
    pointValue: 45,
    unlockCondition: () => player.transcendCount >= 1e17,
    group: 'transcensionCount'
  },
  {
    pointValue: 4,
    unlockCondition: () => player.reincarnationCount >= 1,
    group: 'reincarnationCount'
  },
  {
    pointValue: 8,
    unlockCondition: () => player.reincarnationCount >= 10,
    group: 'reincarnationCount',
    reward: { reincarnationCountMultiplier: () => Math.max(1, 1 + Math.floor(Math.log10(player.reincarnationCount))) }
  },
  {
    pointValue: 12,
    unlockCondition: () => player.reincarnationCount >= 100,
    group: 'reincarnationCount',
    reward: { obtainiumBonus: () => 1 + 0.02 * Math.max(1, 1 + Math.floor(Math.log10(player.reincarnationCount))) }
  },
  {
    pointValue: 16,
    unlockCondition: () => player.reincarnationCount >= 1_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 20,
    unlockCondition: () => player.reincarnationCount >= 10_000,
    group: 'reincarnationCount',
    reward: { thriftRuneUnlock: () => 1}
  },
  {
    pointValue: 24,
    unlockCondition: () => player.reincarnationCount >= 100_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 28,
    unlockCondition: () => player.reincarnationCount >= 1_000_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 32,
    unlockCondition: () => player.reincarnationCount >= 10_000_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 36,
    unlockCondition: () => player.reincarnationCount >= 100_000_000,
    group: 'reincarnationCount',
    reward: { prestigeCountMultiplier: () => Math.min(4, 1.25 + 2.75 * Math.floor(player.prestigecounter / 1e6)),
      ascensionCountMultiplier: () => Math.min(1.25, 1 + 0.25 * Math.floor(player.ascensionCounter / 1e6)) }
  },
  {
    pointValue: 40,
    unlockCondition: () => player.reincarnationCount >= 1_000_000_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 44,
    unlockCondition: () => player.reincarnationCount >= 8_000_000_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 48,
    unlockCondition: () => player.reincarnationCount >= 100_000_000_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 52,
    unlockCondition: () => player.reincarnationCount >= 1_000_000_000_000,
    group: 'reincarnationCount'
  },
  {
    pointValue: 56,
    unlockCondition: () => player.reincarnationCount >= 13_131_313_131_313,
    group: 'reincarnationCount'
  },
  {
    pointValue: 60,
    unlockCondition: () => player.reincarnationCount >= 2e14,
    group: 'reincarnationCount'
  }
]

export interface AchievementDisplayInfo {
  order: number // Display achs in certain order
  displayCondition: () => boolean
}

export const groupedAchievementData: Record<Exclude<AchievementGroups, 'ungrouped'>, AchievementDisplayInfo> = {
  firstOwnedCoin: {
    order: 0,
    displayCondition: () => player.prestigeCount > 0
  },
  secondOwnedCoin: {
    order: 1,
    displayCondition: () => player.prestigeCount > 0
  },
  thirdOwnedCoin: {
    order: 2,
    displayCondition: () => player.prestigeCount > 0
  },
  fourthOwnedCoin: {
    order: 3,
    displayCondition: () => player.prestigeCount > 0
  },
  fifthOwnedCoin: {
    order: 4,
    displayCondition: () => player.prestigeCount > 0
  },
  prestigeCount: {
    order: 4.5,
    displayCondition: () => player.prestigeCount > 0
  },
  prestigePointGain: {
    order: 5,
    displayCondition: () => player.prestigeCount > 0
  },
  accelerators: {
    order: 6,
    displayCondition: () => player.prestigeCount > 0
  },
  multipliers: {
    order: 7,
    displayCondition: () => player.prestigeCount > 0
  },
  acceleratorBoosts: {
    order: 8,
    displayCondition: () => player.prestigeCount > 0
  },
  runeLevel: {
    order: 9,
    displayCondition: () => player.prestigeCount > 0
  },
  transcensionCount: {
    order: 9.5,
    displayCondition: () => player.transcendCount > 0
  },
  transcendPointGain: {
    order: 10,
    displayCondition: () => player.transcendCount > 0
  },
  challenge1: {
    order: 11,
    displayCondition: () => player.transcendCount > 0
  },
  challenge2: {
    order: 12,
    displayCondition: () => player.transcendCount > 0
  },
  challenge3: {
    order: 13,
    displayCondition: () => player.transcendCount > 0
  },
  challenge4: {
    order: 14,
    displayCondition: () => player.transcendCount > 0
  },
  challenge5: {
    order: 15,
    displayCondition: () => player.transcendCount > 0
  },
  reincarnationCount: {
    order: 15.5,
    displayCondition: () => player.reincarnationCount > 0
  },
  reincarnationPointGain: {
    order: 16,
    displayCondition: () => player.reincarnationCount > 0
  },
  challenge6: {
    order: 17,
    displayCondition: () => player.reincarnationCount > 0
  },
  challenge7: {
    order: 18,
    displayCondition: () => player.highestchallengecompletions[6] > 0
  },
  challenge8: {
    order: 19,
    displayCondition: () => player.highestchallengecompletions[7] > 0
  },
  antCrumbs: {
    order: 20,
    displayCondition: () => player.highestchallengecompletions[8] > 0
  },
  sacMult: {
    order: 21,
    displayCondition: () => player.highestchallengecompletions[8] > 0
  },
  runeFreeLevel: {
    order: 22,
    displayCondition: () => player.highestchallengecompletions[8] > 0
  },
  challenge9: {
    order: 23,
    displayCondition: () => player.highestchallengecompletions[8] > 0
  },
  speedBlessing: {
    order: 24,
    displayCondition: () => player.highestchallengecompletions[9] > 0
  },
  challenge10: {
    order: 25,
    displayCondition: () => player.highestchallengecompletions[9] > 0
  },
  ascensionCount: {
    order: 26,
    displayCondition: () => player.ascensionCount > 0
  },
  constant: {
    order: 27,
    displayCondition: () => player.ascensionCount > 0
  },
  challenge11: {
    order: 28,
    displayCondition: () => player.ascensionCount > 0
  },
  campaignTokens: {
    order: 28.5,
    displayCondition: () => player.highestchallengecompletions[11] > 0
  },
  ascensionScore: {
    order: 29,
    displayCondition: () => player.highestchallengecompletions[11] > 0
  },
  challenge12: {
    order: 30,
    displayCondition: () => player.highestchallengecompletions[11] > 0
  },
  speedSpirit: {
    order: 31,
    displayCondition: () => player.highestchallengecompletions[12] > 0
  },
  challenge13: {
    order: 32,
    displayCondition: () => player.highestchallengecompletions[12] > 0
  },
  challenge14: {
    order: 33,
    displayCondition: () => player.highestchallengecompletions[13] > 0
  },
  singularityCount: {
    order: 34,
    displayCondition: () => player.singularityCount > 0
  }
}

export type UngroupedAchievementNames =
'participationTrophy' |
'prestigeNoMult' |
'transcendNoMult' |
'reincarnationNoMult' |
'prestigeNoAccelerator' |
'transcendNoAccelerator' |
'reincarnationNoAccelerator' |
'diamondSearch' |
'prestigeNoCoinUpgrade' |
'transcendNoCoinUpgrade' |
'reincarnationNoCoinUpgrade' |
'transcendNoCoinDiamondUpgrade' |
'reincarnationNoCoinDiamondUpgrade' |
'reincarnationNoCoinDiamondMythosUpgrade' |
'reincarnationMinimumUpgrades' |
'generationAch1' |
'generationAch2' |
'generationAch3' |
'generationAch4' |
'chal1NoGen' |
'chal2NoGen' |
'chal3NoGen' |
'metaChallenged' |
'seeingRed' |
'ascended' |
'verySlow' |
'veryFast' |
'unsmith' |
'smith' |
'highlyBlessed' |
'oneCubeOfMany' |
'extraChallenging' |
'seeingRedNoBlue' |
'overtaxed' |
'thousandSuns' |
'thousandMoons' |
'sadisticAch'


interface UngroupedAchievementDisplayInfo extends AchievementDisplayInfo {
  achievementID: number
}

export const ungroupedAchievementData: Record<UngroupedAchievementNames, UngroupedAchievementDisplayInfo> = {
  participationTrophy: {
    order: 0,
    displayCondition: () => true,
    achievementID: 0,
  },
  prestigeNoMult: {
    order: 1,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: 57,
  },
  transcendNoMult: {
    order: 3,
    displayCondition: () => player.transcendCount > 0, 
    achievementID: 58,
  },
  reincarnationNoMult: {
    order: 5,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: 59
  },
  prestigeNoAccelerator: {
    order: 2,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: 60
  },
  transcendNoAccelerator: {
    order: 4,
    displayCondition: () => player.transcendCount > 0,
    achievementID: 61
  },
  reincarnationNoAccelerator: {
    order: 6,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: 62
  },
  diamondSearch: {
    order: 7,
    displayCondition: () => player.transcendCount > 0,
    achievementID: 63
  },
  prestigeNoCoinUpgrade: {
    order: 8,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: 64
  },
  transcendNoCoinUpgrade: { 
    order: 9,
    displayCondition: () => player.transcendCount > 0,
    achievementID: 65
  },
  transcendNoCoinDiamondUpgrade: {
    order: 10,
    displayCondition: () => player.transcendCount > 0,
    achievementID: 66
  },
  reincarnationNoCoinUpgrade: {
    order: 11,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: 67
  },
  reincarnationNoCoinDiamondUpgrade: {
    order: 12,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: 68
  },
  reincarnationNoCoinDiamondMythosUpgrade: {
    order: 13,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: 69
  },
  reincarnationMinimumUpgrades: {
    order: 14,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: 70
  },
  generationAch1: {
    order: 15,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: 71
  },
  generationAch2: {
    order: 16,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: 72
  },
  generationAch3: {
    order: 17,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: 73
  },
  generationAch4: {
    order: 18,  
    displayCondition: () => player.prestigeCount > 0,
    achievementID: 74
  },
  chal1NoGen: {
    order: 19,
    displayCondition: () => player.transcendCount > 0, 
    achievementID: 75
  },
  chal2NoGen: { 
    order: 20,
    displayCondition: () => player.transcendCount > 0,
    achievementID: 76
  },
  chal3NoGen: {
    order: 21,
    displayCondition: () => player.transcendCount > 0,
    achievementID: 77
  },
  metaChallenged: {
    order: 22,
    displayCondition: () => player.ascensionCount > 0,
    achievementID: 238
  },
  seeingRed: {
    order: 23,
    displayCondition: () => player.unlocks.talismans,
    achievementID: 239
  },
  ascended: {
    order: 24,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: 240
  },
  verySlow: {
    order: 25,
    displayCondition: () => player.challengecompletions[12] > 0,
    achievementID: 241
  },
  veryFast: {
    order: 26,
    displayCondition: () => player.challengecompletions[12] > 0,
    achievementID: 242
  },
  unsmith: {
    order: 27,  
    displayCondition: () => true,
    achievementID: 243
  },
  smith: {
    order: 28,
    displayCondition: () => true,
    achievementID: 244
  },
  highlyBlessed: {
    order: 29,
    displayCondition: () => player.unlocks.blessings,
    achievementID: 245
  },
  oneCubeOfMany: { 
    order: 30,
    displayCondition: () => player.ascensionCount > 0,
    achievementID: 246
  },
  extraChallenging: {
    order: 31,
    displayCondition: () => player.challengecompletions[11] >= 20,
    achievementID: 247
  },
  seeingRedNoBlue: {
    order: 32,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: 248
  },
  overtaxed: {
    order: 33,
    displayCondition: () => player.challengecompletions[12] > 0,
    achievementID: 249
  },
  thousandSuns: {
    order: 34,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: 250
  },
  thousandMoons: {
    order: 35,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: 251
  },
  sadisticAch: {
    order: 36,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: 252
  }
}

export type ProgressiveAchievements =
  | 'runeLevel'
  | 'freeRuneLevel'
  | 'talismanRarities'
  | 'singularityCount'
  | 'ambrosiaCount'
  | 'redAmbrosiaCount'
  | 'singularityUpgrades'
  | 'octeractUpgrades'
  | 'redAmbrosiaUpgrades'
  | 'exalts'

export const emptyProgressiveCaches: Record<ProgressiveAchievements, number> = Object.fromEntries(
  (Object.keys(progressiveAchievements)).map((key) => [key, 0])
) as Record<ProgressiveAchievements, number>

export const numAchievements = achievements.length
export const maxAchievementPoints = achievements.reduce((sum, ach) => sum + ach.pointValue, 0)
  + Object.values(progressiveAchievements)
    .reduce((sum, ach) => sum + (ach.maxPointValue !== -1 ? ach.maxPointValue : 0), 0)

export const achievementsByGroup: Record<AchievementGroups, number[]> = achievements
  .reduce((groups, achievement, index) => {
    if (achievement.group) {
      if (!groups[achievement.group]) {
        groups[achievement.group] = []
      }
      groups[achievement.group].push(Number(index))
    }
    return groups
  }, {} as Record<AchievementGroups, number[]>)

export const achievementsByReward: Record<AchievementRewards, number[]> = achievements
  .reduce((rewards, achievement, index) => {
    if (achievement.reward) {
      for (const rewardType of Object.keys(achievement.reward) as AchievementRewards[]) {
        if (!rewards[rewardType]) {
          rewards[rewardType] = []
        }
        rewards[rewardType].push(Number(index))
      }
    }
    return rewards
  }, {} as Record<AchievementRewards, number[]>)

export const achRewards: Record<AchievementRewards, () => number | boolean> = {
  acceleratorPower: (): number => {
    return achievementsByReward.acceleratorPower.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.acceleratorPower!() : 0),
      0
    )
  },
  accelerators: (): number => {
    return achievementsByReward.accelerators.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.accelerators!() : 0),
      0
    )
  },
  multipliers: (): number => {
    return achievementsByReward.multipliers.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.multipliers!() : 0),
      0
    )
  },
  accelBoosts: (): number => {
    return achievementsByReward.accelBoosts.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.accelBoosts!() : 0),
      0
    )
  },
  crystalMultiplier: (): number => {
    return achievementsByReward.crystalMultiplier.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.crystalMultiplier!() : 1),
      1
    )
  },
  quarkGain: (): number => {
    return achievementsByReward.quarkGain.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.quarkGain!() : 1),
      1
    )
  },
  taxReduction: (): number => {
    return achievementsByReward.taxReduction.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.taxReduction!() : 1),
      1
    )
  },
  particleGain: (): number => {
    return achievementsByReward.particleGain.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.particleGain!() : 1),
      1
    )
  },
  chronosTalisman: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.chronosTalisman[0]])
  },
  midasTalisman: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.midasTalisman[0]])
  },
  metaphysicsTalisman: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.metaphysicsTalisman[0]])
  },
  polymathTalisman: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.polymathTalisman[0]])
  },
  wowSquareTalisman: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.wowSquareTalisman[0]])
  },
  conversionExponent: (): number => {
    return achievementsByReward.conversionExponent.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.conversionExponent!() : 0),
      0
    )
  },
  chal7Researches: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.chal7Researches[0]])
  },
  chal8Researches: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.chal8Researches[0]])
  },
  chal9Researches: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.chal9Researches[0]])
  },
  talismanPower: (): number => {
    return achievementsByReward.talismanPower.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.talismanPower!() : 0),
      0
    )
  },
  sacrificeMult: (): number => {
    return achievementsByReward.sacrificeMult.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.sacrificeMult!() : 1),
      1
    )
  },
  antSpeed: (): number => {
    return achievementsByReward.antSpeed.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.antSpeed!() : 1),
      1
    )
  },
  antSacrificeUnlock: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.antSacrificeUnlock[0]])
  },
  antAutobuyers: (): number => {
    return achievementsByReward.antAutobuyers.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.antAutobuyers!() : 0),
      0
    )
  },
  antUpgradeAutobuyers: (): number => {
    return achievementsByReward.antUpgradeAutobuyers.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.antUpgradeAutobuyers!() : 0),
      0
    )
  },
  antELOAdditive: (): number => {
    return 0
    /*
    return achievementsByReward.antELOAdditive.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.antELOAdditive!() : 0),
      0
    )*/
  },
  antELOMultiplicative: (): number => {
    return 1
    /*
    return achievementsByReward.antELOMultiplicative.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.antELOMultiplicative!() : 1),
      1
    )*/
  },
  ascensionCountMultiplier: (): number => {
    return achievementsByReward.ascensionCountMultiplier.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.ascensionCountMultiplier!() : 1),
      1
    )
  },
  ascensionCountAdditive: (): number => {
    return achievementsByReward.ascensionCountAdditive.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.ascensionCountAdditive!() : 0),
      0
    )
  },
  wowCubeGain: (): number => {
    return achievementsByReward.wowCubeGain.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.wowCubeGain!() : 1),
      1
    )
  },
  wowTesseractGain: (): number => {
    return achievementsByReward.wowTesseractGain.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.wowTesseractGain!() : 1),
      1
    )
  },
  wowHypercubeGain: (): number => {
    return achievementsByReward.wowHypercubeGain.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.wowHypercubeGain!() : 1),
      1
    )
  },
  wowPlatonicGain: (): number => {
    return achievementsByReward.wowPlatonicGain.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.wowPlatonicGain!() : 1),
      1
    )
  },
  wowHepteractGain: (): number => {
    return achievementsByReward.wowHepteractGain.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.wowHepteractGain!() : 1),
      1
    )
  },
  ascensionScore: (): number => {
    return achievementsByReward.ascensionScore.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.ascensionScore!() : 1),
      1
    )
  },
  ascensionRewardScaling: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.ascensionRewardScaling[0]])
  },
  constUpgrade1Buff: (): number => {
    return achievementsByReward.constUpgrade1Buff.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.constUpgrade1Buff!() : 0),
      0
    )
  },
  constUpgrade2Buff: (): number => {
    return achievementsByReward.constUpgrade2Buff.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.constUpgrade2Buff!() : 0),
      0
    )
  },
  platonicToHypercubes: (): number => {
    return achievementsByReward.platonicToHypercubes.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.platonicToHypercubes!() : 0),
      0
    )
  },
  statTracker: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.statTracker[0]])
  },
  overfluxConversionRate: (): number => {
    return achievementsByReward.overfluxConversionRate.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.overfluxConversionRate!() : 1),
      1
    )
  },
  diamondUpgrade18: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.diamondUpgrade18[0]])
  },
  diamondUpgrade19: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.diamondUpgrade19[0]])
  },
  diamondUpgrade20: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.diamondUpgrade20[0]])
  },
  prestigeCountMultiplier: (): number => {
    return achievementsByReward.prestigeCountMultiplier.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.prestigeCountMultiplier!() : 1),
      1
    )
  },
  transcensionCountMultiplier: (): number => {
    return achievementsByReward.transcensionCountMultiplier.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.transcensionCountMultiplier!() : 1),
      1
    )
  },
  reincarnationCountMultiplier: (): number => {
    return achievementsByReward.reincarnationCountMultiplier.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.reincarnationCountMultiplier!() : 1),
      1
    )
  },
  duplicationRuneUnlock: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.duplicationRuneUnlock[0]])
  },
  offeringBonus: (): number => {
    return achievementsByReward.offeringBonus.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.offeringBonus!() : 1),
      1
    )
  },
  obtainiumBonus: (): number => {
    return achievementsByReward.obtainiumBonus.reduce(
      (prod, index) => prod * (player.achievements[index] ? achievements[index].reward!.obtainiumBonus!() : 1),
      1
    )
  },
  salvage: (): number => {
    return achievementsByReward.salvage.reduce(
      (sum, index) => sum + (player.achievements[index] ? achievements[index].reward!.salvage!() : 0),
      0
    )
  },
  prismRuneUnlock: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.prismRuneUnlock[0]])
  },
  thriftRuneUnlock: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.thriftRuneUnlock[0]])
  },
  transcendToPrestige: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.transcendToPrestige[0]])
  },
  reincarnationToTranscend: (): boolean => {
    return Boolean(player.achievements[achievementsByReward.reincarnationToTranscend[0]])
  }
}

export let achievementPoints = 0
export let achievementLevel = 0

export const updateAchievementPoints = () => {
  achievementPoints = 0

  achievementPoints += achievements.reduce((sum, ach, index) => {
    return sum + (player.achievements[index] ? ach.pointValue : 0)
  }, 0)

  for (const k of Object.keys(progressiveAchievements) as ProgressiveAchievements[]) {
    const pointsAwarded = progressiveAchievements[k].pointsAwarded(player.progressiveAchievements[k])
    achievementPoints += pointsAwarded
    progressiveAchievements[k].rewardedAP = pointsAwarded
  }

  updateAchievementLevel()
}

export const awardAchievement = (index: number) => {
  if (player.achievements[index] === 1) {
    return false
  }
  if (achievements[index].unlockCondition()) {
    player.achievements[index] = 1
    achievementPoints += achievements[index].pointValue
    updateAchievementLevel()
    if (player.toggles[34]) {
      const description = i18next.t(`achievements.descriptions.${index}`)
      void Notification(i18next.t('achievements.notification', { m: description }))
    }
    player.worlds.add(getAchievementQuarks(index), false)
    revealStuff()

    // Update displays if we are on Achievements Tab
    if (G.currentTab === Tabs.Achievements) {
      if (achievements[index].group === 'ungrouped') {
        updateUngroupedAchievementProgress(index)
      }
      else {
        updateGroupedAchievementProgress(achievements[index].group)
      }
    }
  }
}

export const awardUngroupedAchievement = (name: UngroupedAchievementNames) => {
  const index = ungroupedAchievementData[name].achievementID
  awardAchievement(index)
}

export const awardAchievementGroup = (group: AchievementGroups) => {
  if (group === 'ungrouped') {
    throw new Error('Cannot award ungrouped achievements')
  }

  for (const index of achievementsByGroup[group]) {
    awardAchievement(index)
  }
}


export const updateProgressiveAP = (ach: ProgressiveAchievements) => {
  const oldPoints = progressiveAchievements[ach].rewardedAP
  const pointsAwarded = progressiveAchievements[ach].pointsAwarded(player.progressiveAchievements[ach])
  achievementPoints += pointsAwarded - progressiveAchievements[ach].rewardedAP
  progressiveAchievements[ach].rewardedAP = pointsAwarded

  if (oldPoints !== pointsAwarded) {
    updateProgressiveAchievementProgress(ach)
    updateAchievementLevel()
  }
}

export const updateProgressiveCache = (ach: ProgressiveAchievements) => {
  if (!progressiveAchievements[ach].useCachedValue) {
    updateProgressiveAP(ach)
  }
  const oldVal = player.progressiveAchievements[ach]
  player.progressiveAchievements[ach] = Math.max(player.progressiveAchievements[ach], progressiveAchievements[ach].updateValue())
  if (oldVal !== player.progressiveAchievements[ach]) {
    updateProgressiveAP(ach)
  }
}

export const updateAchievementLevel = () => {
  const oldLevel = achievementLevel
  if (achievementPoints < 2500) {
    achievementLevel = Math.floor(achievementPoints / 50)
  } else {
    achievementLevel =  50 + Math.floor((achievementPoints - 2500) / 100)
  }
  displayLevelStuff()

  if (oldLevel < achievementLevel) {
    if (player.toggles[34]) {
      void Notification(i18next.t('achievements.levelUpNotification', { old: oldLevel, new: achievementLevel }))
    }
  }
}

export const toNextAchievementLevelEXP = () => {
  if (achievementPoints < 2500) {
    return 50 - (achievementPoints % 50)
  } else {
    return 100 - (achievementPoints % 100)
  }
}

export const getAchievementReward = (rewardType: AchievementRewards): number | boolean => {
  return achRewards[rewardType]()
}

export const generateAchievementRewardSummary = () => {
  const intro = i18next.t('achievements.rewardTypes.title')
  let numericalTexts = ''
  let booleanTexts = ''

  for (const [rewardType, rewardFunction] of Object.entries(achRewards)) {
    const typeKey = rewardType as AchievementRewards
    const reward = rewardFunction()
    if (typeof reward === 'number') {
      if (typeKey === 'acceleratorPower') {
        numericalTexts += `${
          i18next.t(`achievements.rewardTypes.${rewardType}`, { val: formatAsPercentIncrease(1 + reward, 2) })
        }\n`
      } else if (typeKey === 'taxReduction') {
        // Formatted such that it has negative displayed value
        numericalTexts += `${
          i18next.t(`achievements.rewardTypes.${rewardType}`, { val: formatAsPercentIncrease(reward, 2) })
        }\n`
      } else if (typeKey === 'talismanPower') {
        numericalTexts += `${
          i18next.t(`achievements.rewardTypes.${rewardType}`, { val: formatAsPercentIncrease(1 + reward, 2) })
        }\n`
      } else if (typeKey === 'conversionExponent') {
        numericalTexts += `${
          i18next.t(`achievements.rewardTypes.${rewardType}`, { val: formatAsPercentIncrease(1 + reward, 0) })
        }\n`
      } else {
        numericalTexts += `${i18next.t(`achievements.rewardTypes.${rewardType}`, { val: format(reward, 2, false) })}\n`
      }
    } else if (typeof reward === 'boolean') {
      if (reward) {
        booleanTexts += `${
          i18next.t(`achievements.rewardTypes.${rewardType}`, {
            unlock: i18next.t('achievements.rewardTypes.unlocked')
          })
        }\n`
      }
    }
  }

  return Alert(`${intro}\n${numericalTexts}\n${booleanTexts}`)
}

export const createGroupedAchievementDescription = (group: AchievementGroups) => {
  if (group === 'ungrouped') {
    throw new Error('Cannot create description for ungrouped achievements')
  }

  let groupName = i18next.t(`achievements.groupNames.${group}`)
  let achTier = 0
  let currTier = 0
  let extraBonuses = ''
  let earnedAP = 0
  let possibleAP = 0
  for (const index of achievementsByGroup[group]) {
    const ach = achievements[index]
    const hasAch = player.achievements[index]
    const AP = ach.pointValue
    possibleAP += AP
    if (hasAch) {
      achTier += 1
      earnedAP += AP
    }

    if (ach.reward) {
      if (extraBonuses === '') {
        extraBonuses += `${i18next.t('achievements.tieredExtraRewards')} <br>`
      }
      for (const [rewardType, rewardFunction] of Object.entries(ach.reward)) {
        const rewardGroup = rewardType as AchievementRewards
        const rewardValue = achRewards[rewardGroup]()

        if (typeof rewardValue === 'boolean') {
          extraBonuses += `<span style="color:${hasAch ? 'green' : 'crimson'}">Tier ${currTier + 1} • ${
            i18next.t(`achievements.achievementRewards.${index}.${rewardGroup}`, {
              unlock: hasAch
                ? i18next.t('achievements.rewardTypes.unlocked')
                : i18next.t('achievements.rewardTypes.locked')
            })
          }</span><br>`
        }
        if (typeof rewardValue === 'number') {
          extraBonuses += `<span style="color:${achTier - currTier === 1 ? 'green' : 'crimson'}">Tier ${
            currTier + 1
          } • ${
            i18next.t(`achievements.achievementRewards.${index}.${rewardGroup}`, {
              val: format(rewardFunction(), 2, false)
            })
          }</span><br>`
        }
      }
    }

    /*if (ach.reward) {
      for (const [rewardType, rewardFunction] of Object.entries(ach.reward)) {
        const rewardGroup = rewardType as AchievementRewards
        const rewardValue = getAchieveReward[rewardGroup](achievementManager.achievementMap)

        if (typeof rewardValue === 'boolean') {
          extraBonuses += `Tier ${currTier + 1} <span style="color:${rewardValue ? 'green' : 'maroon'}">${
            i18next.t(`achievements.rewardTypes.${rewardType}`, {
              unlock: rewardValue ? i18next.t('achievements.rewardTypes.unlocked') : i18next.t('achievements.rewardTypes.locked')
            })
          }</span><br>`
        } else if (typeof rewardValue === 'number') {
          extraBonuses += `Tier ${currTier + 1} <span style="color:${achTier - currTier === 1 ? 'green' : 'maroon'}">${
            i18next.t(`achievements.rewardTypes.${rewardType}`, {
              val: format(rewardFunction(), 2, false)
            })
          }</span><br>`
        }
      }
    } */
    currTier += 1
  }
  if (achTier === currTier) {
    groupName += ' - COMPLETE!'
    groupName = `<span class='rainbowText'>${groupName}</span>`
  } else {
    groupName += ` - Tier ${achTier}`
  }

  const focusedIndex = achievementsByGroup[group][Math.min(achTier, currTier - 1)]
  let tierText = i18next.t(`achievements.descriptions.${achievementsByGroup[group][Math.min(achTier, currTier - 1)]}`)
  if (achTier < currTier) {
    tierText += ` [+${achievements[focusedIndex].pointValue} AP]`
  }

  const finalText = `${groupName}<br>
  ${earnedAP}/${possibleAP} AP<br>
  ${tierText}<br>
  ${extraBonuses}`
  DOMCacheGetOrSet('achievementMultiLine').innerHTML = finalText
}

export const generateUngroupedDescription = (name: UngroupedAchievementNames) => {
  const index = ungroupedAchievementData[name].achievementID
  const ach = achievements[index]
  const achText = i18next.t(`achievements.descriptions.${index}`)

  const colonIndex = achText.indexOf(':')
  let achName = achText.substring(0, colonIndex)
  const requirement = achText.substring(colonIndex + 1)
  let trimmedRequirement = requirement?.trim() || ''

  const value = ach.pointValue
  let earnedValue = 0

  const hasAch = player.achievements[index] === 1
  if (hasAch) {
    achName = `<span class='rainbowText'>${achName} - COMPLETE!</span>`
    earnedValue = value
  } else {
    trimmedRequirement += ` [+${ach.pointValue} AP]`
  }

  let extraText = ''
  if (ach.reward) {
    extraText = i18next.t('achievements.ungroupedExtraRewards') + '<br>'
    for (const [rewardType, rewardFunction] of Object.entries(ach.reward)) {
      const rewardGroup = rewardType as AchievementRewards
      const rewardValue = achRewards[rewardGroup]()

      if (typeof rewardValue === 'boolean') {
        extraText += `<span style="color:${hasAch ? 'green' : 'maroon'}">${
          i18next.t(`achievements.achievementRewards.${index}.${rewardType}`, {
            unlock: i18next.t('achievements.rewardTypes.unlocked')
          })
        }</span><br>`
      } else if (typeof rewardValue === 'number') {
        extraText += `<span style="color:${hasAch ? 'green' : 'maroon'}">${
          i18next.t(`achievements.achievementRewards.${index}.${rewardType}`, {
            val: format(rewardFunction(), 2, false)
          })
        }</span><br>`
      }
    }
  }

  const finalText = `${achName}<br>
  ${earnedValue}/${value} AP<br>
  ${trimmedRequirement}<br>
  ${extraText}`
  DOMCacheGetOrSet('achievementMultiLine').innerHTML = finalText
}

export const generateProgressiveAchievementDescription = (name: ProgressiveAchievements) => {
  const ach = progressiveAchievements[name]
  let achTitle = i18next.t(`achievements.progressiveAchievements.${name}.name`)
  const achText = i18next.t(`achievements.progressiveAchievements.${name}.description`, {
    x: format(player.progressiveAchievements[name], 0, true)
  })

  const i18nObject = ach.extraI18n ? ach.extraI18n() : {}
  const achAPSourceText = i18next.t(`achievements.progressiveAchievements.${name}.apSource`, i18nObject)

  let APText = ''

  if (ach.maxPointValue === -1) {
    APText = `${ach.rewardedAP} AP`
  } else {
    APText = `${ach.rewardedAP}/${ach.maxPointValue} AP`
  }

  if (ach.rewardedAP === ach.maxPointValue) {
    achTitle = `<span class='rainbowText'>${achTitle}</span>`
  }

  const finalText = `${achTitle}<br>
  ${APText}<br>
  ${achText}<br>
  ${achAPSourceText}`

  DOMCacheGetOrSet('achievementMultiLine').innerHTML = finalText
}

export const generateAchievementHTMLs = () => {
  const alreadyGenerated = document.getElementsByClassName('tieredAchievementType').length > 0

  if (alreadyGenerated) {
    return
  } else {
    const table = DOMCacheGetOrSet('tieredAchievementsTable')
    const ungroupedTable = DOMCacheGetOrSet('ungroupedAchievementsTable')
    const progressiveTable = DOMCacheGetOrSet('progressiveAchievementsTable')

    const sortedGroups = (Object.keys(achievementsByGroup) as AchievementGroups[])
      .filter((k) => k !== 'ungrouped')
      .sort((a, b) => {
        const orderA = groupedAchievementData[a as Exclude<AchievementGroups, 'ungrouped'>]?.order
          ?? Number.POSITIVE_INFINITY
        const orderB = groupedAchievementData[b as Exclude<AchievementGroups, 'ungrouped'>]?.order
          ?? Number.POSITIVE_INFINITY
        return orderA - orderB
      })

    for (const k of sortedGroups) {
      const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
      // create a new image element for each group that is not ungrouped

      const div = document.createElement('div')
      div.className = 'tieredAchievementType'

      const img = document.createElement('img')
      img.id = `achievementGroup${capitalizedName}`
      img.src = `Pictures/Achievements/Grouped/${capitalizedName}.png`
      img.alt = i18next.t(`achievements.groupNames.${k}`)
      img.style.cursor = 'pointer'

      img.onclick = () => {
        createGroupedAchievementDescription(k)
      }

      // attach to the table
      div.appendChild(img)
      table.appendChild(div)
    }

    const sortedUngrouped = (Object.keys(ungroupedAchievementData) as UngroupedAchievementNames[])
    .sort((a, b) => {
      const orderA = ungroupedAchievementData[a]?.order ?? Number.POSITIVE_INFINITY
      const orderB = ungroupedAchievementData[b]?.order ?? Number.POSITIVE_INFINITY
      return orderA - orderB
    })

    for (const k of sortedUngrouped) {
      const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
      // create a new image element for each ungrouped achievement

      const div = document.createElement('div')
      div.className = 'ungroupedAchievementType'

      const img = document.createElement('img')
      img.id = `ungroupedAchievement${capitalizedName}`
      img.src = `Pictures/Achievements/Ungrouped/${capitalizedName}.png`
      img.alt = i18next.t(`achievements.ungroupedNames.${k}`)
      img.style.cursor = 'pointer'

      img.onclick = () => {
        generateUngroupedDescription(k as UngroupedAchievementNames)
      }

      // attach to the table
      div.appendChild(img)
      ungroupedTable.appendChild(div)
    }

    const sortedProgressive = (Object.keys(progressiveAchievements) as ProgressiveAchievements[])
    .sort((a, b) => {
      const orderA = progressiveAchievements[a]?.displayOrder ?? Number.POSITIVE_INFINITY
      const orderB = progressiveAchievements[b]?.displayOrder ?? Number.POSITIVE_INFINITY
      return orderA - orderB
    })

    for (const k of sortedProgressive) {
      const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
      // create a new image element for each progressive achievement

      const div = document.createElement('div')
      div.className = 'progressiveAchievementType'

      const img = document.createElement('img')
      img.id = `progressiveAchievement${capitalizedName}`
      img.src = `Pictures/Achievements/Progressive/${capitalizedName}.png`
      img.alt = i18next.t(`achievements.progressiveNames.${k}`)
      img.style.cursor = 'pointer'

      img.onclick = () => {
        generateProgressiveAchievementDescription(k as ProgressiveAchievements)
      }

      // attach to the table
      div.appendChild(img)
      progressiveTable.appendChild(div)
    }
  }
}

export const updateGroupedAchievementProgress = (group: AchievementGroups) => {
  if (group === 'ungrouped') {
    throw new Error('Cannot update progress for ungrouped achievements in updateGroupedAchievementProgress')
  }
  
  const capitalizedName = group.charAt(0).toUpperCase() + group.slice(1)
  const img = DOMCacheGetOrSet(`achievementGroup${capitalizedName}`) as HTMLElement

  if (img) {
    const totalAchievements = achievementsByGroup[group].length
    const completedAchievements = achievementsByGroup[group].filter((id) => player.achievements[id] === 1).length
    img.classList.remove('green-background', 'purple-background')
    img.style.setProperty('border', 'none')

    // Optional: Add visual styling based on completion
    img.classList.remove('green-background')
    if (completedAchievements === totalAchievements) {
      img.classList.add('green-background')
    }

    img.style.setProperty('--pct', `${completedAchievements}/${totalAchievements}`)
  }

}


export const updateAllGroupedAchievementProgress = () => {
  for (const k of Object.keys(achievementsByGroup) as AchievementGroups[]) {
    if (k === 'ungrouped') {
      continue
    }
    updateGroupedAchievementProgress(k)
  }
}

export const updateUngroupedAchievementProgress = (id: number) => {
  const capitalizedName = Object.keys(ungroupedAchievementData).find((k) => ungroupedAchievementData[k as UngroupedAchievementNames].achievementID === id)
  if (!capitalizedName) {
    throw new Error(`Ungrouped achievement with ID ${id} not found`)
  }

  const img = DOMCacheGetOrSet(`ungroupedAchievement${capitalizedName.charAt(0).toUpperCase() + capitalizedName.slice(1)}`) as HTMLElement

  if (img) {
    const isCompleted = player.achievements[id] === 1
    img.classList.remove('green-background')

    if (isCompleted) {
      img.classList.add('green-background')
    }
  }
}

export const updateAllUngroupedAchievementProgress = () => {
  for (const ach of Object.values(ungroupedAchievementData)) {
    updateUngroupedAchievementProgress(ach.achievementID)
  }
}

export const updateProgressiveAchievementProgress = (progAch: ProgressiveAchievements) => {
  const capitalizedName = progAch.charAt(0).toUpperCase() + progAch.slice(1)
    const img = DOMCacheGetOrSet(`progressiveAchievement${capitalizedName}`) as HTMLElement

    if (img) {
      const achData = progressiveAchievements[progAch]

      // Infinite progression implies we cannot define a percentage
      if (achData.maxPointValue === -1) {
        return
      }

      const currentAP = progressiveAchievements[progAch].rewardedAP
      const maxAP = achData.maxPointValue

      img.classList.remove('green-background')

      // Add green background if fully completed
      if (currentAP >= maxAP) {
        img.classList.add('green-background')
      }

      // Set progress percentage
      img.style.setProperty('--pct', `${currentAP}/${maxAP}`)
    }
}

export const updateAllProgressiveAchievementProgress = () => {
  for (const k of Object.keys(progressiveAchievements) as ProgressiveAchievements[]) {
    updateProgressiveAchievementProgress(k)
  }
}

export const displayAchievementProgress = () => {
  // Display Grouped Achievements AP
  for (const k of Object.keys(achievementsByGroup) as AchievementGroups[]) {
    if (k === 'ungrouped') {
      continue
    }

    const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
    const img = DOMCacheGetOrSet(`achievementGroup${capitalizedName}`) as HTMLElement
    const parent = img.parentElement!

    if (img) {
      // Calculate earned and total AP for this group
      let earnedAP = 0
      let totalAP = 0

      for (const achievementId of achievementsByGroup[k]) {
        const pointValue = achievements[achievementId].pointValue
        totalAP += pointValue
        if (player.achievements[achievementId]) {
          earnedAP += pointValue
        }
      }

      img.classList.add('dimmed')

      // Remove any existing overlay first
      const existingOverlay = parent.querySelector('.achievement-ap-overlay')
      if (existingOverlay) {
        existingOverlay.remove()
      }

      // Create new AP overlay with fraction format
      const apOverlay = document.createElement('div')
      apOverlay.classList.add('achievement-ap-overlay')

      // Add gold text if AP is maxed
      if (earnedAP === totalAP) {
        apOverlay.classList.add('gold-text')
      }

      const numerator = document.createElement('div')
      numerator.classList.add('achievement-fraction-numerator')
      numerator.textContent = earnedAP.toString()

      const denominator = document.createElement('div')
      denominator.classList.add('achievement-fraction-denominator')
      denominator.textContent = totalAP.toString()

      apOverlay.appendChild(numerator)
      apOverlay.appendChild(denominator)

      parent.classList.add('relative-container')
      parent.appendChild(apOverlay)
    }
  }

  // Display Ungrouped Achievements AP
  for (const k of Object.keys(ungroupedAchievementData)) {
    const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
    const img = DOMCacheGetOrSet(`ungroupedAchievement${capitalizedName}`) as HTMLElement
    const parent = img.parentElement!

    if (img) {
      const achievementId = ungroupedAchievementData[k as UngroupedAchievementNames].achievementID
      const isCompleted = player.achievements[achievementId] === 1
      const pointValue = achievements[achievementId].pointValue
      const earnedAP = isCompleted ? pointValue : 0

      img.classList.add('dimmed')

      // Remove any existing overlay first
      const existingOverlay = parent.querySelector('.achievement-ap-overlay')
      if (existingOverlay) {
        existingOverlay.remove()
      }

      // Create new AP overlay with simple number
      const apOverlay = document.createElement('div')
      apOverlay.classList.add('achievement-ap-overlay')

      // Add gold text if achievement is completed
      if (isCompleted) {
        apOverlay.classList.add('gold-text')
      }

      apOverlay.textContent = earnedAP.toString()

      parent.classList.add('relative-container')
      parent.appendChild(apOverlay)
    }
  }

  // Display Progressive Achievements AP
  for (const k of Object.keys(progressiveAchievements) as ProgressiveAchievements[]) {
    const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
    const img = DOMCacheGetOrSet(`progressiveAchievement${capitalizedName}`) as HTMLElement
    const parent = img.parentElement!

    if (img) {
      const achData = progressiveAchievements[k]
      const currentAP = achData.rewardedAP
      const maxAP = achData.maxPointValue

      img.classList.add('dimmed')

      // Remove any existing overlay first
      const existingOverlay = parent.querySelector('.achievement-ap-overlay')
      if (existingOverlay) {
        existingOverlay.remove()
      }

      // Create new AP overlay
      const apOverlay = document.createElement('div')
      apOverlay.classList.add('achievement-ap-overlay')

      if (maxAP === -1) {
        // Simple number for infinite progression (no gold text possible)
        apOverlay.textContent = currentAP.toString()
      } else {
        // Fraction format for finite progression
        // Add gold text if AP is maxed
        if (currentAP >= maxAP) {
          apOverlay.classList.add('gold-text')
        }

        const numerator = document.createElement('div')
        numerator.classList.add('achievement-fraction-numerator')
        numerator.textContent = currentAP.toString()

        const denominator = document.createElement('div')
        denominator.classList.add('achievement-fraction-denominator')
        denominator.textContent = maxAP.toString()

        apOverlay.appendChild(numerator)
        apOverlay.appendChild(denominator)
      }

      parent.classList.add('relative-container')
      parent.appendChild(apOverlay)
    }
  }
}

export const resetAchievementProgressDisplay = () => {
  // Reset all achievement types
  const selectors = [
    '.tieredAchievementType',
    '.ungroupedAchievementType',
    '.progressiveAchievementType'
  ]

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      const img = element.querySelector('img')
      if (img) {
        img.classList.remove('dimmed')
      }

      // Remove the AP overlay if it exists
      const apOverlay = element.querySelector('.achievement-ap-overlay')
      if (apOverlay) {
        apOverlay.remove()
        element.classList.remove('relative-container')
      }
    })
  })
}

// You should really only use this when the game is reset.
export const resetAchievements = () => {
  player.achievements.fill(0)
  for (const k of Object.keys(progressiveAchievements) as ProgressiveAchievements[]) {
    player.progressiveAchievements[k] = 0
  }
  achievementPoints = 0
  achievementLevel = 0
}