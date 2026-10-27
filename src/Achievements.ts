import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { calculatePurpleEnchantmentAP, maxPurpleEnchantmentAP } from './BlueberryUpgrades'
import { CoinBuilding, getBuildingOwned, getBuildingsOwned } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { campaignTokens } from './Campaign'
import { activeCorruptionLevel, ascensionEffectiveCorruptionLevel } from './Corruptions'
import { calculateLeaderboardValue } from './Features/Ants/AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/calculate-leaderboard'
import { AntProducers, LAST_ANT_PRODUCER } from './Features/Ants/structs/structs'
import { displayLevelStuff } from './Levels'
import { calculateOcteractUpgradeAP, maxOcteractUpgradeAP } from './Octeracts'
import { calculatePurpleReactorAP, maxPurpleReactorAP } from './Purple'
import { calculatePurpleAmbrosiaUpgradeAP, maxPurpleAmbrosiaUpgradeAP } from './PurpleAmbrosiaUpgrades'
import { calculateRedAmbrosiaUpgradeAP, maxRedAmbrosiaUpgradeAP } from './RedAmbrosiaUpgrades'
import { resetTiers } from './Reset'
import { runeBlessings } from './RuneBlessings'
import { runes, sumOfFreeRuneLevels, sumOfRuneLevels } from './Runes'
import { runeSpirits } from './RuneSpirits'
import { maxQuarkUpgradeAP, quarkUpgradeAP } from './Shop'
import { calculateGQUpgradeAP, getGQUpgradeEffect, maxGoldenQuarkUpgradeAP } from './singularity'
import { maxAPFromChallenges, type SingularityChallengeDataKeys } from './SingularityChallenges'
import {
  calculatePrestigePointGain,
  calculateReincarnationPointGain,
  calculateTranscendPointGain,
  format,
  player
} from './Synergism'
import { calculateSynthesisUpgradeAP, maxSynthesisUpgradeAP } from './Synthesis'
import { Tabs } from './Tabs'
import { maxTalismansRarityAP, talismans } from './Talismans'
import type { resetNames } from './types/Synergism'
import { CloseModal, MEDIUM_MODAL_UPDATE_TICK, Modal, Notification, revealStuff } from './UpdateHTML'
import { isMobile, memoize, sumContents } from './Utility'
import { Globals as G } from './Variables'

const achievementProgressSelectors = [
  '.tieredAchievementType',
  '.ungroupedAchievementType',
  '.progressiveAchievementType'
]

const createAchievementDetailsModalHTML = (imgSrc: string, label: string | null, detailsHTML: string) => {
  return `<div class="achievementDetailsModal" data-modal-preserve="children">
    <div class="achievementDetailsModalTitle" data-modal-preserve="children">
      <img src="${imgSrc}" alt="">
      ${label ? `<span>${label}</span>` : ''}
    </div>
    <div class="achievementDetailsModalInfo">${detailsHTML}</div>
  </div>`
}

const registerAchievementModal = (
  img: HTMLImageElement,
  descriptionHTML: () => string,
  borderColor: string,
  label: string | null = img.alt
) => {
  if (!isMobile) {
    img.addEventListener('mousemove', (e: MouseEvent) => {
      Modal(descriptionHTML, e.clientX, e.clientY, { borderColor })
    })
    img.addEventListener('focus', () => {
      const elm = img.getBoundingClientRect()
      Modal(descriptionHTML, elm.x, elm.y + elm.height / 2, { borderColor })
    })
    img.addEventListener('mouseout', CloseModal)
    img.addEventListener('blur', CloseModal)
    return
  }

  img.addEventListener('click', (event: MouseEvent) => {
    Modal(
      () => createAchievementDetailsModalHTML(img.src, label, descriptionHTML()),
      event.clientX,
      event.clientY,
      { borderColor },
      MEDIUM_MODAL_UPDATE_TICK,
      img
    )
  })
}

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
      if (player.currentChallenge.ascension === 11 && player.challengecompletions[10] >= 30) {
        awardUngroupedAchievement('extraChallenging')
      }
      break
    case 11:
      awardAchievementGroup('challenge11')
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

const getAchievementQuarks = () => {
  const globalQuarkMultiplier = player.worlds.applyBonus(1)
  let actualMultiplier = globalQuarkMultiplier
  if (actualMultiplier > 100) {
    actualMultiplier = Math.pow(100, 0.6) * Math.pow(actualMultiplier, 0.4)
  }

  return Math.floor(5 * actualMultiplier)
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
  | 'sacCount'
  | 'ungrouped'
  | 'addCodesUsed'

interface AchievementRewardValues {
  acceleratorPower: number
  accelerators: number
  multipliers: number
  accelBoosts: number
  crystalMultiplier: number
  taxReduction: number
  particleGain: number
  conversionExponent: number
  chronosTalisman: boolean
  midasTalisman: boolean
  metaphysicsTalisman: boolean
  polymathTalisman: boolean
  talismanPower: number
  sacrificeMult: number
  antSpeed: number
  antSacrificeUnlock: boolean
  preserveAnthillCount: boolean
  preserveAnthillCountSingularity: boolean
  antAutobuyers: number
  inceptusAutobuy: boolean
  fortunaeAutobuy: boolean
  tributumAutobuy: boolean
  celeritasAutobuy: boolean
  exploratoremAutobuy: boolean
  sacrificiumAutobuy: boolean
  experientiaAutobuy: boolean
  hicAutobuy: boolean
  scientiaAutobuy: boolean
  praemoenioAutobuy: boolean
  phylacteriumAutobuy: boolean
  antELOAdditive: number
  antELOAdditiveMultiplier: number
  wowSquareTalisman: boolean
  ascensionCountMultiplier: number
  ascensionCountAdditive: number
  wowCubeGain: number
  wowTesseractGain: number
  wowHypercubeGain: number
  wowPlatonicGain: number
  quarkGain: number
  wowHepteractGain: number
  cubesBanked: number
  constUpgrade1Buff: number
  constUpgrade2Buff: number
  platonicToHypercubes: number
  statTracker: boolean
  ascensionRewardScaling: boolean
  overfluxConversionRate: number
  diamondUpgrade18: boolean
  diamondUpgrade19: boolean
  diamondUpgrade20: boolean
  prestigeCountMultiplier: number
  transcensionCountMultiplier: number
  reincarnationCountMultiplier: number
  duplicationRuneUnlock: boolean
  prismRuneUnlock: boolean
  thriftRuneUnlock: boolean
  salvage: number
  offeringBonus: number
  obtainiumBonus: number
  transcendToPrestige: boolean
  reincarnationToTranscend: boolean
  antSacrificeCountMultiplier: number
  freeAntUpgrades: number
  autoAntSacrifice: boolean
  antSpeed2UpgradeImprover: number
  antSacrificeToReincarnation: boolean
  obtainiumTimerMultiplier: boolean
}

type AchievementRewards = keyof AchievementRewardValues

type AchievementReward = Partial<Record<AchievementRewards, () => number>>

interface Achievement {
  pointValue: number
  unlockCondition: () => boolean
  group: AchievementGroups
  reward?: AchievementReward
  checkReset?: () => boolean
  steamAchievementId?: string
}

interface ProgressiveAchievement {
  maxPointValue: number
  pointsAwarded: (cached: number) => number
  updateValue: () => number // Number to compare to existing caches
  useCachedValue: boolean
  rewardedAP: number // Updating achievementPoints: pointsAwarded() - rewardedAP
  extraI18n?: () => Record<string, number>
  displayOrder: number
  displayCondition: () => boolean
}

export type ProgressiveAchievements =
  | 'runeLevel'
  | 'freeRuneLevel'
  | 'quarkUpgrades'
  | 'antMasteries'
  | 'rebornELO'
  | 'talismanRarities'
  | 'singularityCount'
  | 'ambrosiaCount'
  | 'redAmbrosiaCount'
  | 'singularityUpgrades'
  | 'octeractUpgrades'
  | 'redAmbrosiaUpgrades'
  | 'exalts'
  | 'purpleHoneyUpgrades'
  | 'purpleAmbrosiaUpgrades'

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
    maxPointValue: 500,
    pointsAwarded: (cached: number) => {
      return Math.min(100, Math.floor(cached / 250)) + Math.min(200, Math.floor(cached / 750))
        + Math.min(200, Math.floor(cached / 2500))
    },
    updateValue: () => {
      return sumOfFreeRuneLevels()
    },
    useCachedValue: true,
    rewardedAP: 0,
    displayOrder: 2,
    displayCondition: () => player.prestigeCount > 0
  },
  quarkUpgrades: {
    maxPointValue: maxQuarkUpgradeAP,
    pointsAwarded: (_cached: number) => {
      return quarkUpgradeAP()
    },
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 3,
    displayCondition: () => player.reincarnationCount > 0 || player.highestSingularityCount > 0
  },
  antMasteries: {
    maxPointValue: 360,
    pointsAwarded: (_cached: number) => {
      let pointValue = 0
      for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
        pointValue += 3 * player.ants.masteries[ant].highestMastery
        if (player.ants.masteries[ant].highestMastery >= 12) {
          pointValue += 4
        }
      }
      return pointValue
    },
    updateValue: () => {
      let numMasteries = 0
      for (let ant = AntProducers.Workers; ant <= LAST_ANT_PRODUCER; ant++) {
        numMasteries += player.ants.masteries[ant].highestMastery
      }
      return numMasteries
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 4,
    displayCondition: () => player.unlocks.anthill
  },
  rebornELO: {
    maxPointValue: 1000,
    pointsAwarded: (_cached: number) => {
      const leaderboardELO = calculateLeaderboardValue(player.ants.highestRebornELOEver)
      return Math.min(100, Math.floor(leaderboardELO / 100))
        + Math.min(150, Math.floor(leaderboardELO / 1000))
        + Math.min(150, Math.floor(leaderboardELO / 9000))
        + Math.min(200, Math.floor(leaderboardELO / 75000))
        + Math.min(400, Math.floor(leaderboardELO / 150000))
    },
    updateValue: () => {
      return calculateLeaderboardValue(player.ants.highestRebornELOEver)
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 5,
    displayCondition: () => player.unlocks.anthill
  },
  singularityCount: {
    maxPointValue: 3600,
    pointsAwarded: (_cached: number) => {
      return 9 * player.highestSingularityCount
        + 3 * Math.max(0, player.highestSingularityCount - 100)
        + 3 * Math.max(0, player.highestSingularityCount - 200)
    },
    updateValue: () => {
      return player.highestSingularityCount
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 7,
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
    displayOrder: 11,
    displayCondition: () => player.highestSingularityCount >= 25
  },
  redAmbrosiaCount: {
    maxPointValue: 1000,
    pointsAwarded: (cached: number) => {
      return Math.min(200, Math.floor(cached / 25))
        + Math.min(200, Math.floor(cached / 2500))
        + Math.min(400, Math.floor(400 * cached / 5e6))
        + Math.min(200, Math.floor(200 * cached / 1.25e7))
    },
    updateValue: () => {
      return player.lifetimeRedAmbrosia
    },
    useCachedValue: true,
    rewardedAP: 0,
    displayOrder: 12,
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
        num4: player.singularityChallenges.noQuarkUpgrades.rewardAP,
        cap4: player.singularityChallenges.noQuarkUpgrades.maxAP,
        num5: player.singularityChallenges.noOcteracts.rewardAP,
        cap5: player.singularityChallenges.noOcteracts.maxAP,
        num6: player.singularityChallenges.noAmbrosiaUpgrades.rewardAP,
        cap6: player.singularityChallenges.noAmbrosiaUpgrades.maxAP,
        num7: player.singularityChallenges.limitedTime.rewardAP,
        cap7: player.singularityChallenges.limitedTime.maxAP,
        num8: player.singularityChallenges.sadisticPrequel.rewardAP,
        cap8: player.singularityChallenges.sadisticPrequel.maxAP,
        num9: player.singularityChallenges.taxmanLastStand.rewardAP,
        cap9: player.singularityChallenges.taxmanLastStand.maxAP,
        num10: player.singularityChallenges.barDependence.rewardAP,
        cap10: player.singularityChallenges.barDependence.maxAP
      }
    },
    displayOrder: 10,
    displayCondition: () => player.highestSingularityCount >= 25
  },
  singularityUpgrades: {
    maxPointValue: maxGoldenQuarkUpgradeAP,
    pointsAwarded: (_cached: number) => calculateGQUpgradeAP(),
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 8,
    displayCondition: () => player.highestSingularityCount > 0
  },
  octeractUpgrades: {
    maxPointValue: maxOcteractUpgradeAP,
    pointsAwarded: (_cached: number) => calculateOcteractUpgradeAP(),
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 9,
    displayCondition: () => getGQUpgradeEffect('octeractUnlock', 'unlocked')
  },
  redAmbrosiaUpgrades: {
    maxPointValue: maxRedAmbrosiaUpgradeAP,
    pointsAwarded: () => calculateRedAmbrosiaUpgradeAP(),
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 13,
    displayCondition: () => player.highestSingularityCount >= 150
  },
  talismanRarities: {
    maxPointValue: maxTalismansRarityAP,
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
    displayOrder: 6,
    displayCondition: () => player.unlocks.talismans
  },
  purpleHoneyUpgrades: {
    maxPointValue: maxPurpleReactorAP,
    pointsAwarded: (_cached: number) => {
      return calculatePurpleReactorAP()
    },
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 14,
    displayCondition: () => player.singularityChallenges.taxmanLastStand.completions > 0
  },
  purpleAmbrosiaUpgrades: {
    maxPointValue: maxSynthesisUpgradeAP + maxPurpleAmbrosiaUpgradeAP + maxPurpleEnchantmentAP,
    pointsAwarded: () =>
      calculateSynthesisUpgradeAP() + calculatePurpleAmbrosiaUpgradeAP() + calculatePurpleEnchantmentAP(),
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayOrder: 15,
    displayCondition: () => player.singularityChallenges.taxmanLastStand.completions > 0
  }
}

export const progressiveAchievementKeys = Object.keys(progressiveAchievements) as ProgressiveAchievements[]

export enum AchievementId {
  ParticipationTrophy = 0,
  FirstOwnedCoinTier1 = 1,
  FirstOwnedCoinTier2 = 2,
  FirstOwnedCoinTier3 = 3,
  FirstOwnedCoinTier4 = 4,
  FirstOwnedCoinTier5 = 5,
  FirstOwnedCoinTier6 = 6,
  FirstOwnedCoinTier7 = 7,
  SecondOwnedCoinTier1 = 8,
  SecondOwnedCoinTier2 = 9,
  SecondOwnedCoinTier3 = 10,
  SecondOwnedCoinTier4 = 11,
  SecondOwnedCoinTier5 = 12,
  SecondOwnedCoinTier6 = 13,
  SecondOwnedCoinTier7 = 14,
  ThirdOwnedCoinTier1 = 15,
  ThirdOwnedCoinTier2 = 16,
  ThirdOwnedCoinTier3 = 17,
  ThirdOwnedCoinTier4 = 18,
  ThirdOwnedCoinTier5 = 19,
  ThirdOwnedCoinTier6 = 20,
  ThirdOwnedCoinTier7 = 21,
  FourthOwnedCoinTier1 = 22,
  FourthOwnedCoinTier2 = 23,
  FourthOwnedCoinTier3 = 24,
  FourthOwnedCoinTier4 = 25,
  FourthOwnedCoinTier5 = 26,
  FourthOwnedCoinTier6 = 27,
  FourthOwnedCoinTier7 = 28,
  FifthOwnedCoinTier1 = 29,
  FifthOwnedCoinTier2 = 30,
  FifthOwnedCoinTier3 = 31,
  FifthOwnedCoinTier4 = 32,
  FifthOwnedCoinTier5 = 33,
  FifthOwnedCoinTier6 = 34,
  FifthOwnedCoinTier7 = 35,
  PrestigePointGainTier1 = 36,
  PrestigePointGainTier2 = 37,
  PrestigePointGainTier3 = 38,
  PrestigePointGainTier4 = 39,
  PrestigePointGainTier5 = 40,
  PrestigePointGainTier6 = 41,
  PrestigePointGainTier7 = 42,
  TranscendPointGainTier1 = 43,
  TranscendPointGainTier2 = 44,
  TranscendPointGainTier3 = 45,
  TranscendPointGainTier4 = 46,
  TranscendPointGainTier5 = 47,
  TranscendPointGainTier6 = 48,
  TranscendPointGainTier7 = 49,
  ReincarnationPointGainTier1 = 50,
  ReincarnationPointGainTier2 = 51,
  ReincarnationPointGainTier3 = 52,
  ReincarnationPointGainTier4 = 53,
  ReincarnationPointGainTier5 = 54,
  ReincarnationPointGainTier6 = 55,
  ReincarnationPointGainTier7 = 56,
  PrestigeNoMult = 57,
  TranscendNoMult = 58,
  ReincarnationNoMult = 59,
  PrestigeNoAccelerator = 60,
  TranscendNoAccelerator = 61,
  ReincarnationNoAccelerator = 62,
  DiamondSearch = 63,
  PrestigeNoCoinUpgrade = 64,
  TranscendNoCoinUpgrade = 65,
  TranscendNoCoinDiamondUpgrade = 66,
  ReincarnationNoCoinUpgrade = 67,
  ReincarnationNoCoinDiamondUpgrade = 68,
  ReincarnationNoCoinDiamondMythosUpgrade = 69,
  ReincarnationMinimumUpgrades = 70,
  GenerationAch1 = 71,
  GenerationAch2 = 72,
  GenerationAch3 = 73,
  GenerationAch4 = 74,
  Chal1NoGen = 75,
  Chal2NoGen = 76,
  Chal3NoGen = 77,
  Challenge1Tier1 = 78,
  Challenge1Tier2 = 79,
  Challenge1Tier3 = 80,
  Challenge1Tier4 = 81,
  Challenge1Tier5 = 82,
  Challenge1Tier6 = 83,
  Challenge1Tier7 = 84,
  Challenge2Tier1 = 85,
  Challenge2Tier2 = 86,
  Challenge2Tier3 = 87,
  Challenge2Tier4 = 88,
  Challenge2Tier5 = 89,
  Challenge2Tier6 = 90,
  Challenge2Tier7 = 91,
  Challenge3Tier1 = 92,
  Challenge3Tier2 = 93,
  Challenge3Tier3 = 94,
  Challenge3Tier4 = 95,
  Challenge3Tier5 = 96,
  Challenge3Tier6 = 97,
  Challenge3Tier7 = 98,
  Challenge4Tier1 = 99,
  Challenge4Tier2 = 100,
  Challenge4Tier3 = 101,
  Challenge4Tier4 = 102,
  Challenge4Tier5 = 103,
  Challenge4Tier6 = 104,
  Challenge4Tier7 = 105,
  Challenge5Tier1 = 106,
  Challenge5Tier2 = 107,
  Challenge5Tier3 = 108,
  Challenge5Tier4 = 109,
  Challenge5Tier5 = 110,
  Challenge5Tier6 = 111,
  Challenge5Tier7 = 112,
  Challenge6Tier1 = 113,
  Challenge6Tier2 = 114,
  Challenge6Tier3 = 115,
  Challenge6Tier4 = 116,
  Challenge6Tier5 = 117,
  Challenge6Tier6 = 118,
  Challenge6Tier7 = 119,
  Challenge7Tier1 = 120,
  Challenge7Tier2 = 121,
  Challenge7Tier3 = 122,
  Challenge7Tier4 = 123,
  Challenge7Tier5 = 124,
  Challenge7Tier6 = 125,
  Challenge7Tier7 = 126,
  Challenge8Tier1 = 127,
  Challenge8Tier2 = 128,
  Challenge8Tier3 = 129,
  Challenge8Tier4 = 130,
  Challenge8Tier5 = 131,
  Challenge8Tier6 = 132,
  Challenge8Tier7 = 133,
  Challenge9Tier1 = 134,
  Challenge9Tier2 = 135,
  Challenge9Tier3 = 136,
  Challenge9Tier4 = 137,
  Challenge9Tier5 = 138,
  Challenge9Tier6 = 139,
  Challenge9Tier7 = 140,
  Challenge10Tier1 = 141,
  Challenge10Tier2 = 142,
  Challenge10Tier3 = 143,
  Challenge10Tier4 = 144,
  Challenge10Tier5 = 145,
  Challenge10Tier6 = 146,
  Challenge10Tier7 = 147,
  AcceleratorsTier1 = 148,
  AcceleratorsTier2 = 149,
  AcceleratorsTier3 = 150,
  AcceleratorsTier4 = 151,
  AcceleratorsTier5 = 152,
  AcceleratorsTier6 = 153,
  AcceleratorsTier7 = 154,
  MultipliersTier1 = 155,
  MultipliersTier2 = 156,
  MultipliersTier3 = 157,
  MultipliersTier4 = 158,
  MultipliersTier5 = 159,
  MultipliersTier6 = 160,
  MultipliersTier7 = 161,
  AcceleratorBoostsTier1 = 162,
  AcceleratorBoostsTier2 = 163,
  AcceleratorBoostsTier3 = 164,
  AcceleratorBoostsTier4 = 165,
  AcceleratorBoostsTier5 = 166,
  AcceleratorBoostsTier6 = 167,
  AcceleratorBoostsTier7 = 168,
  AntCrumbsTier1 = 169,
  AntCrumbsTier2 = 170,
  AntCrumbsTier3 = 171,
  AntCrumbsTier4 = 172,
  AntCrumbsTier5 = 173,
  AntCrumbsTier6 = 174,
  AntCrumbsTier7 = 175,
  SacMultTier1 = 176,
  SacMultTier2 = 177,
  SacMultTier3 = 178,
  SacMultTier4 = 179,
  SacMultTier5 = 180,
  SacMultTier6 = 181,
  SacMultTier7 = 182,
  AscensionCountTier1 = 183,
  AscensionCountTier2 = 184,
  AscensionCountTier3 = 185,
  AscensionCountTier4 = 186,
  AscensionCountTier5 = 187,
  AscensionCountTier6 = 188,
  AscensionCountTier7 = 189,
  ConstantTier1 = 190,
  ConstantTier2 = 191,
  ConstantTier3 = 192,
  ConstantTier4 = 193,
  ConstantTier5 = 194,
  ConstantTier6 = 195,
  ConstantTier7 = 196,
  Challenge11Tier1 = 197,
  Challenge11Tier2 = 198,
  Challenge11Tier3 = 199,
  Challenge11Tier4 = 200,
  Challenge11Tier5 = 201,
  Challenge11Tier6 = 202,
  Challenge11Tier7 = 203,
  Challenge12Tier1 = 204,
  Challenge12Tier2 = 205,
  Challenge12Tier3 = 206,
  Challenge12Tier4 = 207,
  Challenge12Tier5 = 208,
  Challenge12Tier6 = 209,
  Challenge12Tier7 = 210,
  Challenge13Tier1 = 211,
  Challenge13Tier2 = 212,
  Challenge13Tier3 = 213,
  Challenge13Tier4 = 214,
  Challenge13Tier5 = 215,
  Challenge13Tier6 = 216,
  Challenge13Tier7 = 217,
  Challenge14Tier1 = 218,
  Challenge14Tier2 = 219,
  Challenge14Tier3 = 220,
  Challenge14Tier4 = 221,
  Challenge14Tier5 = 222,
  Challenge14Tier6 = 223,
  Challenge14Tier7 = 224,
  AscensionScoreTier1 = 225,
  AscensionScoreTier2 = 226,
  AscensionScoreTier3 = 227,
  AscensionScoreTier4 = 228,
  AscensionScoreTier5 = 229,
  AscensionScoreTier6 = 230,
  AscensionScoreTier7 = 231,
  SpeedBlessingTier1 = 232,
  SpeedBlessingTier2 = 233,
  SpeedBlessingTier3 = 234,
  SpeedSpiritTier1 = 235,
  SpeedSpiritTier2 = 236,
  SpeedSpiritTier3 = 237,
  MetaChallenged = 238,
  SeeingRed = 239,
  Ascended = 240,
  VerySlow = 241,
  VeryFast = 242,
  Unsmith = 243,
  Smith = 244,
  HighlyBlessed = 245,
  OneCubeOfMany = 246,
  ExtraChallenging = 247,
  SeeingRedNoBlue = 248,
  Overtaxed = 249,
  ThousandSuns = 250,
  ThousandMoons = 251,
  SadisticAch = 252,
  AscensionScoreTier8 = 253,
  AscensionScoreTier9 = 254,
  AscensionScoreTier10 = 255,
  AscensionScoreTier11 = 256,
  AscensionScoreTier12 = 257,
  AscensionScoreTier13 = 258,
  AscensionScoreTier14 = 259,
  AscensionCountTier8 = 260,
  AscensionCountTier9 = 261,
  AscensionCountTier10 = 262,
  AscensionCountTier11 = 263,
  AscensionCountTier12 = 264,
  AscensionCountTier13 = 265,
  AscensionCountTier14 = 266,
  ConstantTier8 = 267,
  ConstantTier9 = 268,
  ConstantTier10 = 269,
  ConstantTier11 = 270,
  ConstantTier12 = 271,
  ConstantTier13 = 272,
  ConstantTier14 = 273,
  SingularityCountTier1 = 274,
  SingularityCountTier2 = 275,
  SingularityCountTier3 = 276,
  SingularityCountTier4 = 277,
  SingularityCountTier5 = 278,
  SingularityCountTier6 = 279,
  SingularityCountTier7 = 280,
  FirstOwnedCoinTier8 = 281,
  FirstOwnedCoinTier9 = 282,
  FirstOwnedCoinTier10 = 283,
  SecondOwnedCoinTier8 = 284,
  SecondOwnedCoinTier9 = 285,
  SecondOwnedCoinTier10 = 286,
  ThirdOwnedCoinTier8 = 287,
  ThirdOwnedCoinTier9 = 288,
  ThirdOwnedCoinTier10 = 289,
  FourthOwnedCoinTier8 = 290,
  FourthOwnedCoinTier9 = 291,
  FourthOwnedCoinTier10 = 292,
  FifthOwnedCoinTier8 = 293,
  FifthOwnedCoinTier9 = 294,
  FifthOwnedCoinTier10 = 295,
  PrestigePointGainTier8 = 296,
  PrestigePointGainTier9 = 297,
  PrestigePointGainTier10 = 298,
  TranscendPointGainTier8 = 299,
  TranscendPointGainTier9 = 300,
  TranscendPointGainTier10 = 301,
  ReincarnationPointGainTier8 = 302,
  ReincarnationPointGainTier9 = 303,
  ReincarnationPointGainTier10 = 304,
  Challenge1Tier8 = 305,
  Challenge1Tier9 = 306,
  Challenge1Tier10 = 307,
  Challenge2Tier8 = 308,
  Challenge2Tier9 = 309,
  Challenge2Tier10 = 310,
  Challenge3Tier8 = 311,
  Challenge3Tier9 = 312,
  Challenge3Tier10 = 313,
  Challenge4Tier8 = 314,
  Challenge4Tier9 = 315,
  Challenge4Tier10 = 316,
  Challenge5Tier8 = 317,
  Challenge5Tier9 = 318,
  Challenge5Tier10 = 319,
  Challenge6Tier8 = 320,
  Challenge6Tier9 = 321,
  Challenge6Tier10 = 322,
  Challenge7Tier8 = 323,
  Challenge7Tier9 = 324,
  Challenge7Tier10 = 325,
  Challenge8Tier8 = 326,
  Challenge8Tier9 = 327,
  Challenge8Tier10 = 328,
  Challenge9Tier8 = 329,
  Challenge9Tier9 = 330,
  Challenge9Tier10 = 331,
  Challenge10Tier8 = 332,
  Challenge10Tier9 = 333,
  Challenge10Tier10 = 334,
  AcceleratorsTier8 = 335,
  AcceleratorsTier9 = 336,
  AcceleratorsTier10 = 337,
  MultipliersTier8 = 338,
  MultipliersTier9 = 339,
  MultipliersTier10 = 340,
  AcceleratorBoostsTier8 = 341,
  AcceleratorBoostsTier9 = 342,
  AcceleratorBoostsTier10 = 343,
  AntCrumbsTier8 = 344,
  AntCrumbsTier9 = 345,
  AntCrumbsTier10 = 346,
  SacMultTier8 = 347,
  SacMultTier9 = 348,
  SacMultTier10 = 349,
  AscensionCountTier15 = 350,
  AscensionCountTier16 = 351,
  AscensionCountTier17 = 352,
  AscensionCountTier18 = 353,
  AscensionCountTier19 = 354,
  AscensionCountTier20 = 355,
  ConstantTier15 = 356,
  ConstantTier16 = 357,
  ConstantTier17 = 358,
  ConstantTier18 = 359,
  ConstantTier19 = 360,
  ConstantTier20 = 361,
  Challenge11Tier8 = 362,
  Challenge11Tier9 = 363,
  Challenge11Tier10 = 364,
  Challenge11Tier11 = 365,
  Challenge11Tier12 = 366,
  Challenge12Tier8 = 367,
  Challenge12Tier9 = 368,
  Challenge12Tier10 = 369,
  Challenge12Tier11 = 370,
  Challenge12Tier12 = 371,
  Challenge13Tier8 = 372,
  Challenge13Tier9 = 373,
  Challenge13Tier10 = 374,
  Challenge13Tier11 = 375,
  Challenge13Tier12 = 376,
  Challenge14Tier8 = 377,
  Challenge14Tier9 = 378,
  Challenge14Tier10 = 379,
  Challenge14Tier11 = 380,
  Challenge14Tier12 = 381,
  SpeedBlessingTier4 = 382,
  SpeedBlessingTier5 = 383,
  SpeedBlessingTier6 = 384,
  SpeedBlessingTier7 = 385,
  SpeedBlessingTier8 = 386,
  SpeedBlessingTier9 = 387,
  SpeedBlessingTier10 = 388,
  SpeedSpiritTier4 = 389,
  SpeedSpiritTier5 = 390,
  SpeedSpiritTier6 = 391,
  SpeedSpiritTier7 = 392,
  SpeedSpiritTier8 = 393,
  SpeedSpiritTier9 = 394,
  SpeedSpiritTier10 = 395,
  RuneLevelTier1 = 396,
  RuneLevelTier2 = 397,
  RuneLevelTier3 = 398,
  RuneLevelTier4 = 399,
  RuneLevelTier5 = 400,
  RuneLevelTier6 = 401,
  RuneLevelTier7 = 402,
  RuneLevelTier8 = 403,
  RuneLevelTier9 = 404,
  RuneLevelTier10 = 405,
  RuneLevelTier11 = 406,
  RuneLevelTier12 = 407,
  RuneLevelTier13 = 408,
  RuneLevelTier14 = 409,
  RuneLevelTier15 = 410,
  RuneFreeLevelTier1 = 411,
  RuneFreeLevelTier2 = 412,
  RuneFreeLevelTier3 = 413,
  RuneFreeLevelTier4 = 414,
  RuneFreeLevelTier5 = 415,
  RuneFreeLevelTier6 = 416,
  RuneFreeLevelTier7 = 417,
  RuneFreeLevelTier8 = 418,
  RuneFreeLevelTier9 = 419,
  RuneFreeLevelTier10 = 420,
  RuneFreeLevelTier11 = 421,
  RuneFreeLevelTier12 = 422,
  RuneFreeLevelTier13 = 423,
  RuneFreeLevelTier14 = 424,
  RuneFreeLevelTier15 = 425,
  CampaignTokensTier1 = 426,
  CampaignTokensTier2 = 427,
  CampaignTokensTier3 = 428,
  CampaignTokensTier4 = 429,
  CampaignTokensTier5 = 430,
  CampaignTokensTier6 = 431,
  CampaignTokensTier7 = 432,
  CampaignTokensTier8 = 433,
  CampaignTokensTier9 = 434,
  CampaignTokensTier10 = 435,
  PrestigeCountTier1 = 436,
  PrestigeCountTier2 = 437,
  PrestigeCountTier3 = 438,
  PrestigeCountTier4 = 439,
  PrestigeCountTier5 = 440,
  PrestigeCountTier6 = 441,
  PrestigeCountTier7 = 442,
  PrestigeCountTier8 = 443,
  PrestigeCountTier9 = 444,
  PrestigeCountTier10 = 445,
  PrestigeCountTier11 = 446,
  PrestigeCountTier12 = 447,
  PrestigeCountTier13 = 448,
  PrestigeCountTier14 = 449,
  PrestigeCountTier15 = 450,
  TranscensionCountTier1 = 451,
  TranscensionCountTier2 = 452,
  TranscensionCountTier3 = 453,
  TranscensionCountTier4 = 454,
  TranscensionCountTier5 = 455,
  TranscensionCountTier6 = 456,
  TranscensionCountTier7 = 457,
  TranscensionCountTier8 = 458,
  TranscensionCountTier9 = 459,
  TranscensionCountTier10 = 460,
  TranscensionCountTier11 = 461,
  TranscensionCountTier12 = 462,
  TranscensionCountTier13 = 463,
  TranscensionCountTier14 = 464,
  TranscensionCountTier15 = 465,
  ReincarnationCountTier1 = 466,
  ReincarnationCountTier2 = 467,
  ReincarnationCountTier3 = 468,
  ReincarnationCountTier4 = 469,
  ReincarnationCountTier5 = 470,
  ReincarnationCountTier6 = 471,
  ReincarnationCountTier7 = 472,
  ReincarnationCountTier8 = 473,
  ReincarnationCountTier9 = 474,
  ReincarnationCountTier10 = 475,
  ReincarnationCountTier11 = 476,
  ReincarnationCountTier12 = 477,
  ReincarnationCountTier13 = 478,
  ReincarnationCountTier14 = 479,
  ReincarnationCountTier15 = 480,
  SacCountTier1 = 481,
  SacCountTier2 = 482,
  SacCountTier3 = 483,
  SacCountTier4 = 484,
  SacCountTier5 = 485,
  SacCountTier6 = 486,
  SacCountTier7 = 487,
  SacCountTier8 = 488,
  SacCountTier9 = 489,
  SacCountTier10 = 490,
  SacCountTier11 = 491,
  SacCountTier12 = 492,
  SacCountTier13 = 493,
  AddCodesUsedTier1 = 494,
  AddCodesUsedTier2 = 495,
  AddCodesUsedTier3 = 496,
  AddCodesUsedTier4 = 497,
  AddCodesUsedTier5 = 498,
  AddCodesUsedTier6 = 499,
  AddCodesUsedTier7 = 500,
  AddCodesUsedTier8 = 501,
  AddCodesUsedTier9 = 502,
  AddCodesUsedTier10 = 503,
  AddCodesUsedTier11 = 504,
  AddCodesUsedTier12 = 505,
  AddCodesUsedTier13 = 506,
  AddCodesUsedTier14 = 507,
  AddCodesUsedTier15 = 508
}

const achievements: Achievement[] = [
  { pointValue: 5, unlockCondition: () => true, group: 'ungrouped' }, // Free Achievement Perhaps?
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 1,
    group: 'firstOwnedCoin',
    steamAchievementId: 'GROUPED_WORKERS_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 10,
    group: 'firstOwnedCoin'
  },
  {
    pointValue: 15,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 100,
    group: 'firstOwnedCoin',
    reward: { acceleratorPower: () => 0.001 }
  },
  {
    pointValue: 20,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 1000,
    group: 'firstOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 5000,
    group: 'firstOwnedCoin',
    reward: { accelerators: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Workers) / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 10000,
    group: 'firstOwnedCoin',
    reward: { multipliers: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Workers) / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 20000,
    group: 'firstOwnedCoin',
    reward: { accelBoosts: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Workers) / 2000) }
  },
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 1,
    group: 'secondOwnedCoin',
    steamAchievementId: 'GROUPED_INVESTMENTS_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 10,
    group: 'secondOwnedCoin'
  },
  {
    pointValue: 15,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 100,
    group: 'secondOwnedCoin',
    reward: { acceleratorPower: () => 0.0015 }
  },
  {
    pointValue: 20,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 500,
    group: 'secondOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 5000,
    group: 'secondOwnedCoin',
    reward: { accelerators: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Investments) / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 10000,
    group: 'secondOwnedCoin',
    reward: { multipliers: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Investments) / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 20000,
    group: 'secondOwnedCoin',
    reward: { accelBoosts: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Investments) / 2000) }
  },
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 1,
    group: 'thirdOwnedCoin',
    steamAchievementId: 'GROUPED_PRINTERS_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 10,
    group: 'thirdOwnedCoin'
  },
  {
    pointValue: 15,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 100,
    group: 'thirdOwnedCoin',
    reward: { acceleratorPower: () => 0.002 }
  },
  {
    pointValue: 20,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 333,
    group: 'thirdOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 5000,
    group: 'thirdOwnedCoin',
    reward: { accelerators: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Printers) / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 10000,
    group: 'thirdOwnedCoin',
    reward: { multipliers: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Printers) / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 20000,
    group: 'thirdOwnedCoin',
    reward: { accelBoosts: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Printers) / 2000) }
  },
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 1,
    group: 'fourthOwnedCoin',
    steamAchievementId: 'GROUPED_MINTS_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 10,
    group: 'fourthOwnedCoin'
  },
  {
    pointValue: 15,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 100,
    group: 'fourthOwnedCoin',
    reward: { acceleratorPower: () => 0.002 }
  },
  {
    pointValue: 20,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 333,
    group: 'fourthOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 5000,
    group: 'fourthOwnedCoin',
    reward: { accelerators: () => Math.floor(getBuildingOwned('coin', CoinBuilding.CoinMints) / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 10000,
    group: 'fourthOwnedCoin',
    reward: { multipliers: () => Math.floor(getBuildingOwned('coin', CoinBuilding.CoinMints) / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 20000,
    group: 'fourthOwnedCoin',
    reward: { accelBoosts: () => Math.floor(getBuildingOwned('coin', CoinBuilding.CoinMints) / 2000) }
  },
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 1,
    group: 'fifthOwnedCoin',
    steamAchievementId: 'GROUPED_ALCHEMIES_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 10,
    group: 'fifthOwnedCoin'
  },
  {
    pointValue: 15,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 66,
    group: 'fifthOwnedCoin',
    reward: { acceleratorPower: () => 0.003 }
  },
  {
    pointValue: 20,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 200,
    group: 'fifthOwnedCoin',
    checkReset: () => player.highestSingularityCount >= 2
  },
  {
    pointValue: 25,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 6666,
    group: 'fifthOwnedCoin',
    reward: { accelerators: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Alchemies) / 500) }
  },
  {
    pointValue: 30,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 17777,
    group: 'fifthOwnedCoin',
    reward: { multipliers: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Alchemies) / 1000) }
  },
  {
    pointValue: 35,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 42777,
    group: 'fifthOwnedCoin',
    reward: { accelBoosts: () => Math.floor(getBuildingOwned('coin', CoinBuilding.Alchemies) / 2000) }
  },
  {
    pointValue: 5,
    unlockCondition: () => calculatePrestigePointGain().gte(G.dOne),
    group: 'prestigePointGain',
    checkReset: () => player.highestSingularityCount >= 2,
    steamAchievementId: 'GROUPED_DIAMONDS_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => calculatePrestigePointGain().gte(G.d1e6),
    group: 'prestigePointGain',
    reward: { crystalMultiplier: () => Math.max(1, Decimal.log(player.prestigePoints, Math.E)) },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => calculatePrestigePointGain().gte(G.d1e100),
    group: 'prestigePointGain',
    checkReset: () => player.highestSingularityCount >= 3
  },
  { pointValue: 20, unlockCondition: () => calculatePrestigePointGain().gte(G.d1e1000), group: 'prestigePointGain' },
  { pointValue: 25, unlockCondition: () => calculatePrestigePointGain().gte(G.d1e10000), group: 'prestigePointGain' },
  { pointValue: 30, unlockCondition: () => calculatePrestigePointGain().gte(G.d1e77777), group: 'prestigePointGain' },
  { pointValue: 35, unlockCondition: () => calculatePrestigePointGain().gte(G.d1e250000), group: 'prestigePointGain' },
  {
    pointValue: 5,
    unlockCondition: () => calculateTranscendPointGain().gte(G.dOne),
    group: 'transcendPointGain',
    checkReset: () => player.highestSingularityCount >= 2,
    steamAchievementId: 'GROUPED_MYTHOS_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e6),
    group: 'transcendPointGain',
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e50),
    group: 'transcendPointGain',
    reward: { taxReduction: () => 0.95 }
  },
  {
    pointValue: 20,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e308),
    group: 'transcendPointGain',
    reward: { taxReduction: () => 0.95 }
  },
  {
    pointValue: 25,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e1500),
    group: 'transcendPointGain',
    reward: { taxReduction: () => 0.9 }
  },
  { pointValue: 30, unlockCondition: () => calculateTranscendPointGain().gte(G.d1e25000), group: 'transcendPointGain' },
  {
    pointValue: 35,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e100000),
    group: 'transcendPointGain'
  },
  {
    pointValue: 5,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.dOne),
    group: 'reincarnationPointGain',
    reward: { particleGain: () => 2 },
    checkReset: () => player.highestSingularityCount >= 3,
    steamAchievementId: 'GROUPED_PARTICLES_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e5),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 15,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e30),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 20,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e200),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 25,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e1500),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 30,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e5000),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 35,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e7777),
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
      return getBuildingOwned('accelerator') === 0 && getBuildingOwned('acceleratorBoost') === 0
        && player.coinsThisTranscension.gte(G.d1e120000)
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
      return player.upgrades[102] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 10,
    unlockCondition: () => {
      return player.upgrades[103] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 15,
    unlockCondition: () => {
      return player.upgrades[104] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 20,
    unlockCondition: () => {
      return player.upgrades[105] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 25,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 1 && player.coinsThisTranscension.gte(G.d1e1000)
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 25,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 2 && player.coinsThisTranscension.gte(G.d1e1000)
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    group: 'ungrouped',
    reward: { conversionExponent: () => 0.01 },
    checkReset: () => player.highestSingularityCount >= 3
  },
  {
    pointValue: 50,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 3 && player.coinsThisTranscension.gte(G.d1e99999)
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
    checkReset: () => player.highestSingularityCount >= 3,
    steamAchievementId: 'GROUPED_CHALLENGE1_1'
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
    group: 'challenge1'
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[2] >= 1,
    group: 'challenge2',
    checkReset: () => player.highestSingularityCount >= 3,
    steamAchievementId: 'GROUPED_CHALLENGE2_1'
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
    group: 'challenge2'
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[3] >= 1,
    group: 'challenge3',
    checkReset: () => player.highestSingularityCount >= 3,
    steamAchievementId: 'GROUPED_CHALLENGE3_1'
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
    group: 'challenge3'
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
    group: 'challenge3'
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[4] >= 1,
    group: 'challenge4',
    checkReset: () => player.highestSingularityCount >= 3,
    steamAchievementId: 'GROUPED_CHALLENGE4_1'
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
    group: 'challenge4'
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[4] >= 10,
    group: 'challenge4'
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
    group: 'challenge4'
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[5] >= 1,
    group: 'challenge5',
    checkReset: () => player.highestSingularityCount >= 3,
    steamAchievementId: 'GROUPED_CHALLENGE5_1'
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
    group: 'challenge5'
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
    group: 'challenge5'
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[6] >= 1,
    group: 'challenge6',
    checkReset: () => player.highestSingularityCount >= 4,
    steamAchievementId: 'GROUPED_CHALLENGE6_1'
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[6] >= 2, group: 'challenge6' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[6] >= 3,
    group: 'challenge6'
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
    unlockCondition: () => player.challengecompletions[6] >= 15,
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
    group: 'challenge6'
  },
  {
    pointValue: 5,
    unlockCondition: () => player.challengecompletions[7] >= 1,
    group: 'challenge7',
    reward: { diamondUpgrade18: () => 0 },
    checkReset: () => player.highestSingularityCount >= 7,
    steamAchievementId: 'GROUPED_CHALLENGE7_1'
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[7] >= 2, group: 'challenge7' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[7] >= 3,
    group: 'challenge7'
  },
  { pointValue: 20, unlockCondition: () => player.challengecompletions[7] >= 5, group: 'challenge7' },
  {
    pointValue: 25,
    unlockCondition: () => player.challengecompletions[7] >= 10,
    group: 'challenge7',
    reward: { taxReduction: () => 0.95 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[7] >= 15,
    group: 'challenge7'
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
    reward: { diamondUpgrade19: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10,
    steamAchievementId: 'GROUPED_CHALLENGE8_1'
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[8] >= 2, group: 'challenge8' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[8] >= 3,
    group: 'challenge8'
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
    unlockCondition: () => player.challengecompletions[8] >= 15,
    group: 'challenge8'
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
    reward: { diamondUpgrade20: () => 1 },
    checkReset: () => player.highestSingularityCount >= 20,
    steamAchievementId: 'GROUPED_CHALLENGE9_1'
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
    reward: { sacrificeMult: () => 1.25, experientiaAutobuy: () => 1 }
  },
  { pointValue: 25, unlockCondition: () => player.challengecompletions[9] >= 10, group: 'challenge9' },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[9] >= 20,
    group: 'challenge9'
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
    steamAchievementId: 'GROUPED_CHALLENGE10_1'
  },
  { pointValue: 10, unlockCondition: () => player.challengecompletions[10] >= 2, group: 'challenge10' },
  {
    pointValue: 15,
    unlockCondition: () => player.challengecompletions[10] >= 3,
    group: 'challenge10'
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
    unlockCondition: () => player.challengecompletions[10] >= 20,
    group: 'challenge10'
  },
  {
    pointValue: 35,
    unlockCondition: () => player.challengecompletions[10] >= 25,
    group: 'challenge10',
    reward: { polymathTalisman: () => 1 }
  },
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('accelerator') >= 5,
    group: 'accelerators',
    steamAchievementId: 'GROUPED_ACCELERATOR_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => getBuildingOwned('accelerator') >= 25,
    group: 'accelerators',
    reward: { acceleratorPower: () => 0.01 }
  },
  { pointValue: 15, unlockCondition: () => getBuildingOwned('accelerator') >= 100, group: 'accelerators' },
  {
    pointValue: 20,
    unlockCondition: () => getBuildingOwned('accelerator') >= 666,
    group: 'accelerators',
    reward: { accelerators: () => 5 }
  },
  {
    pointValue: 25,
    unlockCondition: () => getBuildingOwned('accelerator') >= 2000,
    group: 'accelerators',
    reward: { accelerators: () => 12 }
  },
  {
    pointValue: 30,
    unlockCondition: () => getBuildingOwned('accelerator') >= 12500,
    group: 'accelerators',
    reward: { accelerators: () => 25 }
  },
  {
    pointValue: 35,
    unlockCondition: () => getBuildingOwned('accelerator') >= 100000,
    group: 'accelerators',
    reward: { accelerators: () => 50 }
  },
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('multiplier') >= 2,
    group: 'multipliers',
    steamAchievementId: 'GROUPED_MULTIPLIER_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => getBuildingOwned('multiplier') >= 20,
    group: 'multipliers',
    reward: { multipliers: () => 1 }
  },
  { pointValue: 15, unlockCondition: () => getBuildingOwned('multiplier') >= 100, group: 'multipliers' },
  {
    pointValue: 20,
    unlockCondition: () => getBuildingOwned('multiplier') >= 500,
    group: 'multipliers',
    reward: { multipliers: () => 1 }
  },
  {
    pointValue: 25,
    unlockCondition: () => getBuildingOwned('multiplier') >= 2000,
    group: 'multipliers',
    reward: { multipliers: () => 3 }
  },
  {
    pointValue: 30,
    unlockCondition: () => getBuildingOwned('multiplier') >= 12500,
    group: 'multipliers',
    reward: { multipliers: () => 6 }
  },
  {
    pointValue: 35,
    unlockCondition: () => getBuildingOwned('multiplier') >= 100000,
    group: 'multipliers',
    reward: { multipliers: () => 10 }
  },
  {
    pointValue: 5,
    unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 2,
    group: 'acceleratorBoosts',
    steamAchievementId: 'GROUPED_ACCELERATOR_BOOSTS_1'
  },
  { pointValue: 10, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 10, group: 'acceleratorBoosts' },
  { pointValue: 15, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 50, group: 'acceleratorBoosts' },
  { pointValue: 20, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 200, group: 'acceleratorBoosts' },
  { pointValue: 25, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 1000, group: 'acceleratorBoosts' },
  { pointValue: 30, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 5000, group: 'acceleratorBoosts' },
  { pointValue: 35, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 15000, group: 'acceleratorBoosts' },
  {
    pointValue: 5,
    unlockCondition: () => player.ants.crumbs.gte(G.d3),
    group: 'antCrumbs',
    reward: { antSpeed: () => Decimal.log(player.ants.crumbs.plus(10), 10) },
    steamAchievementId: 'GROUPED_CRUMBS_1'
  },
  { pointValue: 10, unlockCondition: () => player.ants.crumbs.gte(G.d1e5), group: 'antCrumbs' },
  {
    pointValue: 15,
    unlockCondition: () => player.ants.crumbs.gte(G.d666666666),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1.2 }
  },
  {
    pointValue: 20,
    unlockCondition: () => player.ants.crumbs.gte(G.d1e20),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1.25 }
  },
  {
    pointValue: 25,
    unlockCondition: () => player.ants.crumbsThisSacrifice.gte(G.d1e40),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1.4, antSacrificeUnlock: () => 1, antAutobuyers: () => 1 }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.ants.crumbs.gte(G.d1e250),
    group: 'antCrumbs',
    reward: { antSpeed: () => 1 + player.ants.immortalELO / 1000, scientiaAutobuy: () => 1 }
  },
  { pointValue: 35, unlockCondition: () => player.ants.crumbs.gte(G.d1e2500), group: 'antCrumbs' },
  {
    pointValue: 5,
    unlockCondition: () => player.ants.immortalELO >= 50 && player.ants.producers[AntProducers.Breeders].purchased > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, inceptusAutobuy: () => 1, fortunaeAutobuy: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 10,
    unlockCondition: () =>
      player.ants.immortalELO >= 200 && player.ants.producers[AntProducers.MetaBreeders].purchased > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, tributumAutobuy: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 15,
    unlockCondition: () =>
      player.ants.immortalELO >= 500 && player.ants.producers[AntProducers.MegaBreeders].purchased > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, celeritasAutobuy: () => 1, exploratoremAutobuy: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 20,
    unlockCondition: () => player.ants.immortalELO >= 1000 && player.ants.producers[AntProducers.Queens].purchased > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1, sacrificiumAutobuy: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 25,
    unlockCondition: () =>
      player.ants.immortalELO >= 2500 && player.ants.producers[AntProducers.LordRoyals].purchased > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 30,
    unlockCondition: () =>
      player.ants.immortalELO >= 20000 && player.ants.producers[AntProducers.Almighties].purchased > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 35,
    unlockCondition: () =>
      player.ants.immortalELO >= 100000 && player.ants.producers[AntProducers.Disciples].purchased > 0,
    group: 'sacMult',
    reward: { antAutobuyers: () => 1 },
    checkReset: () => player.highestSingularityCount >= 10
  },
  {
    pointValue: 5,
    unlockCondition: () => player.ascensionCount >= 1,
    group: 'ascensionCount',
    reward: { freeAntUpgrades: () => 2 }
  },
  {
    pointValue: 10,
    unlockCondition: () => player.ascensionCount >= 2,
    group: 'ascensionCount',
    reward: { preserveAnthillCount: () => 1, antSacrificeCountMultiplier: () => 2 }
  },
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
      ascensionCountMultiplier: () => 1 + 0.8 * ascensionEffectiveCorruptionLevel()
    }
  },
  {
    pointValue: 30,
    unlockCondition: () => player.ascensionCount >= 14142,
    group: 'ascensionCount',
    reward: {
      ascensionCountAdditive: () => (player.ascensionCounter > 10) ? 100 : 0
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
  { pointValue: 5, unlockCondition: () => player.ascendShards.gte(G.d3_14), group: 'constant' },
  { pointValue: 10, unlockCondition: () => player.ascendShards.gte(G.d1e6), group: 'constant' },
  { pointValue: 15, unlockCondition: () => player.ascendShards.gte(G.d4_32e10), group: 'constant' },
  {
    pointValue: 20,
    unlockCondition: () => player.ascendShards.gte(G.d6_9e21),
    group: 'constant',
    reward: { wowCubeGain: () => 1 + Decimal.log(player.ascendShards.add(1), 10) / 400 }
  },
  { pointValue: 25, unlockCondition: () => player.ascendShards.gte(G.d1_509e33), group: 'constant' },
  {
    pointValue: 30,
    unlockCondition: () => player.ascendShards.gte(G.d1e66),
    group: 'constant',
    reward: {
      wowCubeGain: () => 1 + 249 * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000),
      wowTesseractGain: () => 1 + 249 * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000)
    }
  },
  {
    pointValue: 35,
    unlockCondition: () => player.ascendShards.gte(G.d1_8e308),
    group: 'constant',
    reward: { wowPlatonicGain: () => 1 + 19 * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000) }
  },
  {
    pointValue: 10,
    unlockCondition: () => player.challengecompletions[11] >= 1,
    group: 'challenge11',
    reward: { statTracker: () => 1 },
    steamAchievementId: 'GROUPED_CHALLENGE11_1'
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[11] >= 2,
    group: 'challenge11'
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[11] >= 3,
    group: 'challenge11'
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[11] >= 5,
    group: 'challenge11'
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[11] >= 10,
    group: 'challenge11'
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
    reward: { ascensionRewardScaling: () => 1 },
    steamAchievementId: 'GROUPED_CHALLENGE12_1'
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[12] >= 2,
    group: 'challenge12'
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[12] >= 3,
    group: 'challenge12'
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[12] >= 5,
    group: 'challenge12'
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[12] >= 10,
    group: 'challenge12'
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
    steamAchievementId: 'GROUPED_CHALLENGE13_1'
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[13] >= 2,
    group: 'challenge13'
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[13] >= 3,
    group: 'challenge13'
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[13] >= 5,
    group: 'challenge13'
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[13] >= 10,
    group: 'challenge13'
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
    steamAchievementId: 'GROUPED_CHALLENGE14_1'
  },
  {
    pointValue: 20,
    unlockCondition: () => player.challengecompletions[14] >= 2,
    group: 'challenge14'
  },
  {
    pointValue: 30,
    unlockCondition: () => player.challengecompletions[14] >= 3,
    group: 'challenge14'
  },
  {
    pointValue: 40,
    unlockCondition: () => player.challengecompletions[14] >= 5,
    group: 'challenge14'
  },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[14] >= 10,
    group: 'challenge14'
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
  {
    pointValue: 5,
    unlockCondition: () => activeCorruptionLevel() >= 4,
    group: 'ascensionScore',
    steamAchievementId: 'GROUPED_ASCENSIONSCORE_1'
  },
  {
    pointValue: 10,
    unlockCondition: () => activeCorruptionLevel() >= 6,
    group: 'ascensionScore'
  },
  {
    pointValue: 15,
    unlockCondition: () => activeCorruptionLevel() >= 8,
    group: 'ascensionScore'
  },
  {
    pointValue: 20,
    unlockCondition: () => activeCorruptionLevel() >= 10,
    group: 'ascensionScore'
  },
  {
    pointValue: 25,
    unlockCondition: () => activeCorruptionLevel() >= 12,
    group: 'ascensionScore'
  },
  {
    pointValue: 30,
    unlockCondition: () => activeCorruptionLevel() >= 14,
    group: 'ascensionScore'
  },
  {
    pointValue: 35,
    unlockCondition: () => activeCorruptionLevel() >= 16,
    group: 'ascensionScore'
  },
  { pointValue: 10, unlockCondition: () => runeBlessings.speed.level >= 20, group: 'speedBlessing' },
  {
    pointValue: 20,
    unlockCondition: () => runeBlessings.speed.level >= 40,
    group: 'speedBlessing'
  },
  { pointValue: 30, unlockCondition: () => runeBlessings.speed.level >= 80, group: 'speedBlessing' },
  {
    pointValue: 10,
    unlockCondition: () => runeSpirits.speed.level >= 20,
    group: 'speedSpirit'
  },
  { pointValue: 20, unlockCondition: () => runeSpirits.speed.level >= 40, group: 'speedSpirit' },
  {
    pointValue: 30,
    unlockCondition: () => runeSpirits.speed.level >= 80,
    group: 'speedSpirit'
  },
  {
    pointValue: 50,
    unlockCondition: () => {
      return player.currentChallenge.transcension !== 0 && player.currentChallenge.reincarnation !== 0
        && player.currentChallenge.ascension !== 0
    },
    group: 'ungrouped'
  },
  { pointValue: 50, unlockCondition: () => player.mythicalFragments.gte(G.d1e25), group: 'ungrouped' },
  // 240: ASCENDED
  {
    pointValue: 50,
    unlockCondition: () => player.ascensionCount >= 1414213,
    group: 'ungrouped'
  },
  // 241: Global speed is SLOW
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 242: Global speed is FAST
  { pointValue: 50, unlockCondition: () => true, group: 'ungrouped' },
  // 243: :unsmith:
  { pointValue: 5, unlockCondition: () => true, group: 'ungrouped' },
  // 244: :smith:
  { pointValue: 5, unlockCondition: () => true, group: 'ungrouped' },
  // 245: High Speed Blessing
  {
    pointValue: 50,
    unlockCondition: () => runeBlessings.speed.level >= 380,
    group: 'ungrouped'
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
    unlockCondition: () => activeCorruptionLevel() >= 18,
    group: 'ascensionScore',
    reward: { wowHypercubeGain: () => 1.1 }
  },
  {
    pointValue: 45,
    unlockCondition: () => activeCorruptionLevel() >= 20,
    group: 'ascensionScore',
    reward: { wowCubeGain: () => 1.1 }
  },
  {
    pointValue: 50,
    unlockCondition: () => activeCorruptionLevel() >= 25,
    group: 'ascensionScore',
    reward: { wowTesseractGain: () => 1.1 }
  },
  {
    pointValue: 55,
    unlockCondition: () => activeCorruptionLevel() >= 30,
    group: 'ascensionScore',
    reward: { wowPlatonicGain: () => 1.1, overfluxConversionRate: () => 1.05 }
  },
  {
    pointValue: 60,
    unlockCondition: () => activeCorruptionLevel() >= 35,
    group: 'ascensionScore',
    reward: { overfluxConversionRate: () => 1.05 }
  },
  {
    pointValue: 65,
    unlockCondition: () => activeCorruptionLevel() >= 40,
    group: 'ascensionScore',
    reward: { wowHepteractGain: () => 1.1 }
  },
  {
    pointValue: 70,
    unlockCondition: () => activeCorruptionLevel() >= 45,
    group: 'ascensionScore',
    reward: { cubesBanked: () => 50 * player.hepteracts.abyss.TIMES_CAP_EXTENDED },
    steamAchievementId: 'GROUPED_ASCENSIONSCORE_2'
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
    group: 'ascensionCount'
  },
  {
    pointValue: 55,
    unlockCondition: () => player.ascensionCount >= 4e10,
    group: 'ascensionCount'
  },
  {
    pointValue: 60,
    unlockCondition: () => player.ascensionCount >= 8e11,
    group: 'ascensionCount'
  },
  {
    pointValue: 65,
    unlockCondition: () => player.ascensionCount >= 1.6e13,
    group: 'ascensionCount'
  },
  {
    pointValue: 70,
    unlockCondition: () => player.ascensionCount >= 1e14,
    group: 'ascensionCount',
    reward: { quarkGain: () => 1 + 0.1 * Math.min(player.ascensionCount / 1e15, 1) }
  },
  {
    pointValue: 40,
    unlockCondition: () => player.ascendShards.gte(G.d1e1000),
    group: 'constant',
    reward: { cubesBanked: () => Math.min(2000, Math.floor(Decimal.log(player.ascendShards.add(1), 10) / 50)) }
  },
  { pointValue: 45, unlockCondition: () => player.ascendShards.gte(G.d1e5000), group: 'constant' },
  { pointValue: 50, unlockCondition: () => player.ascendShards.gte(G.d1e15000), group: 'constant' },
  {
    pointValue: 55,
    unlockCondition: () => player.ascendShards.gte(G.d1e50000),
    group: 'constant',
    reward: {
      wowHepteractGain: () => 1 + Math.min(Decimal.log(player.ascendShards.add(1), 10) / 1e6, 1),
      constUpgrade1Buff: () => 0.01,
      constUpgrade2Buff: () => 0.01
    }
  },
  {
    pointValue: 60,
    unlockCondition: () => player.ascendShards.gte(G.d1e100000),
    group: 'constant',
    reward: { platonicToHypercubes: () => Math.min(1, Decimal.log(player.ascendShards.add(1), 10) / 1e6) }
  },
  { pointValue: 65, unlockCondition: () => player.ascendShards.gte(G.d1e300000), group: 'constant' },
  { pointValue: 70, unlockCondition: () => player.ascendShards.gte(G.d1e1000000), group: 'constant' },
  {
    pointValue: 10,
    unlockCondition: () => player.highestSingularityCount >= 1,
    group: 'singularityCount',
    steamAchievementId: 'GROUPED_SINGULARITY_1'
  },
  { pointValue: 20, unlockCondition: () => player.highestSingularityCount >= 2, group: 'singularityCount' },
  { pointValue: 30, unlockCondition: () => player.highestSingularityCount >= 3, group: 'singularityCount' },
  { pointValue: 40, unlockCondition: () => player.highestSingularityCount >= 4, group: 'singularityCount' },
  { pointValue: 50, unlockCondition: () => player.highestSingularityCount >= 5, group: 'singularityCount' },
  { pointValue: 60, unlockCondition: () => player.highestSingularityCount >= 7, group: 'singularityCount' },
  {
    pointValue: 70,
    unlockCondition: () => player.highestSingularityCount >= 10,
    group: 'singularityCount',
    steamAchievementId: 'GROUPED_SINGULARITY_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 1e5,
    group: 'firstOwnedCoin'
  },
  {
    pointValue: 45,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 1e6,
    group: 'firstOwnedCoin'
  },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Workers) >= 1e8,
    group: 'firstOwnedCoin',
    steamAchievementId: 'GROUPED_WORKERS_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 1e6,
    group: 'secondOwnedCoin'
  },
  {
    pointValue: 45,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 1e8,
    group: 'secondOwnedCoin'
  },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Investments) >= 1e9,
    group: 'secondOwnedCoin',
    steamAchievementId: 'GROUPED_INVESTMENTS_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 1e7,
    group: 'thirdOwnedCoin'
  },
  {
    pointValue: 45,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 1e8,
    group: 'thirdOwnedCoin'
  },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Printers) >= 5e9,
    group: 'thirdOwnedCoin',
    steamAchievementId: 'GROUPED_PRINTERS_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 1e8,
    group: 'fourthOwnedCoin'
  },
  {
    pointValue: 45,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 1e9,
    group: 'fourthOwnedCoin'
  },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.CoinMints) >= 2e10,
    group: 'fourthOwnedCoin',
    steamAchievementId: 'GROUPED_MINTS_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 1e9,
    group: 'fifthOwnedCoin'
  },
  {
    pointValue: 45,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 2e10,
    group: 'fifthOwnedCoin'
  },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('coin', CoinBuilding.Alchemies) >= 1e12,
    group: 'fifthOwnedCoin',
    steamAchievementId: 'GROUPED_ALCHEMIES_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => calculatePrestigePointGain().gte(G.d1e10000000),
    group: 'prestigePointGain'
  },
  {
    pointValue: 45,
    unlockCondition: () => calculatePrestigePointGain().gte(G.d1e10000000000),
    group: 'prestigePointGain'
  },
  {
    pointValue: 50,
    unlockCondition: () => calculatePrestigePointGain().gte(G.d1e10000000000000),
    group: 'prestigePointGain',
    steamAchievementId: 'GROUPED_DIAMONDS_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e2500000),
    group: 'transcendPointGain'
  },
  {
    pointValue: 45,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e2500000000),
    group: 'transcendPointGain'
  },
  {
    pointValue: 50,
    unlockCondition: () => calculateTranscendPointGain().gte(G.d1e2500000000000),
    group: 'transcendPointGain',
    steamAchievementId: 'GROUPED_MYTHOS_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e100000),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 45,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e100000000),
    group: 'reincarnationPointGain'
  },
  {
    pointValue: 50,
    unlockCondition: () => calculateReincarnationPointGain().gte(G.d1e100000000000),
    group: 'reincarnationPointGain',
    steamAchievementId: 'GROUPED_PARTICLES_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[1] >= 200, group: 'challenge1' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[1] >= 300, group: 'challenge1' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[1] >= 400,
    group: 'challenge1',
    steamAchievementId: 'GROUPED_CHALLENGE1_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[2] >= 200, group: 'challenge2' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[2] >= 300, group: 'challenge2' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[2] >= 400,
    group: 'challenge2',
    steamAchievementId: 'GROUPED_CHALLENGE2_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[3] >= 200, group: 'challenge3' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[3] >= 300, group: 'challenge3' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[3] >= 400,
    group: 'challenge3',
    steamAchievementId: 'GROUPED_CHALLENGE3_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[4] >= 200, group: 'challenge4' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[4] >= 300, group: 'challenge4' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[4] >= 400,
    group: 'challenge4',
    steamAchievementId: 'GROUPED_CHALLENGE4_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[5] >= 200, group: 'challenge5' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[5] >= 300, group: 'challenge5' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[5] >= 400,
    group: 'challenge5',
    steamAchievementId: 'GROUPED_CHALLENGE5_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[6] >= 40, group: 'challenge6' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[6] >= 80, group: 'challenge6' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[6] >= 120,
    group: 'challenge6',
    steamAchievementId: 'GROUPED_CHALLENGE6_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[7] >= 40, group: 'challenge7' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[7] >= 80, group: 'challenge7' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[7] >= 125,
    group: 'challenge7',
    steamAchievementId: 'GROUPED_CHALLENGE7_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[8] >= 40, group: 'challenge8' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[8] >= 80, group: 'challenge8' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[8] >= 130,
    group: 'challenge8',
    steamAchievementId: 'GROUPED_CHALLENGE8_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[9] >= 40, group: 'challenge9' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[9] >= 80, group: 'challenge9' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[9] >= 135,
    group: 'challenge9',
    steamAchievementId: 'GROUPED_CHALLENGE9_2'
  },
  { pointValue: 40, unlockCondition: () => player.challengecompletions[10] >= 40, group: 'challenge10' },
  { pointValue: 45, unlockCondition: () => player.challengecompletions[10] >= 80, group: 'challenge10' },
  {
    pointValue: 50,
    unlockCondition: () => player.challengecompletions[10] >= 140,
    group: 'challenge10',
    steamAchievementId: 'GROUPED_CHALLENGE10_2'
  },
  { pointValue: 40, unlockCondition: () => getBuildingOwned('accelerator') >= 1e6, group: 'accelerators' },
  { pointValue: 45, unlockCondition: () => getBuildingOwned('accelerator') >= 1e7, group: 'accelerators' },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('accelerator') >= 1e8,
    group: 'accelerators',
    steamAchievementId: 'GROUPED_ACCELERATOR_2'
  },
  { pointValue: 40, unlockCondition: () => getBuildingOwned('multiplier') >= 3e6, group: 'multipliers' },
  { pointValue: 45, unlockCondition: () => getBuildingOwned('multiplier') >= 3e7, group: 'multipliers' },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('multiplier') >= 3e8,
    group: 'multipliers',
    steamAchievementId: 'GROUPED_MULTIPLIER_2'
  },
  { pointValue: 40, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 1e5, group: 'acceleratorBoosts' },
  { pointValue: 45, unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 1e6, group: 'acceleratorBoosts' },
  {
    pointValue: 50,
    unlockCondition: () => getBuildingOwned('acceleratorBoost') >= 1e7,
    group: 'acceleratorBoosts',
    steamAchievementId: 'GROUPED_ACCELERATOR_BOOSTS_2'
  },
  { pointValue: 40, unlockCondition: () => player.ants.crumbs.gte(G.d1e25000), group: 'antCrumbs' },
  { pointValue: 45, unlockCondition: () => player.ants.crumbs.gte(G.d1e125000), group: 'antCrumbs' },
  {
    pointValue: 50,
    unlockCondition: () => player.ants.crumbs.gte(G.d1e1000000),
    group: 'antCrumbs',
    steamAchievementId: 'GROUPED_CRUMBS_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => player.ants.immortalELO >= 400000,
    group: 'sacMult'
  },
  {
    pointValue: 45,
    unlockCondition: () => player.ants.immortalELO >= 1500000,
    group: 'sacMult'
  },
  {
    pointValue: 50,
    unlockCondition: () =>
      player.ants.immortalELO >= 5000000 && player.ants.producers[AntProducers.HolySpirit].purchased > 0,
    reward: { antAutobuyers: () => 1 },
    group: 'sacMult'
  },
  { pointValue: 75, unlockCondition: () => player.ascensionCount >= 1e16, group: 'ascensionCount' },
  { pointValue: 80, unlockCondition: () => player.ascensionCount >= 1e20, group: 'ascensionCount' },
  { pointValue: 85, unlockCondition: () => player.ascensionCount >= 1e25, group: 'ascensionCount' },
  { pointValue: 90, unlockCondition: () => player.ascensionCount >= 1e35, group: 'ascensionCount' },
  { pointValue: 95, unlockCondition: () => player.ascensionCount >= 1e50, group: 'ascensionCount' },
  { pointValue: 100, unlockCondition: () => player.ascensionCount >= 1e75, group: 'ascensionCount' },
  { pointValue: 75, unlockCondition: () => player.ascendShards.gte(G.d1e2000000), group: 'constant' },
  { pointValue: 80, unlockCondition: () => player.ascendShards.gte(G.d1e5000000), group: 'constant' },
  { pointValue: 85, unlockCondition: () => player.ascendShards.gte(G.d1e10000000), group: 'constant' },
  { pointValue: 90, unlockCondition: () => player.ascendShards.gte(G.d1e25000000), group: 'constant' },
  { pointValue: 95, unlockCondition: () => player.ascendShards.gte(G.d1e50000000), group: 'constant' },
  { pointValue: 100, unlockCondition: () => player.ascendShards.gte(G.d1e100000000), group: 'constant' },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[11] >= 40, group: 'challenge11' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[11] >= 50, group: 'challenge11' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[11] >= 60, group: 'challenge11' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[11] >= 65, group: 'challenge11' },
  {
    pointValue: 120,
    unlockCondition: () => player.challengecompletions[11] >= 70,
    group: 'challenge11',
    steamAchievementId: 'GROUPED_CHALLENGE11_2'
  },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[12] >= 40, group: 'challenge12' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[12] >= 50, group: 'challenge12' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[12] >= 60, group: 'challenge12' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[12] >= 65, group: 'challenge12' },
  {
    pointValue: 120,
    unlockCondition: () => player.challengecompletions[12] >= 70,
    group: 'challenge12',
    steamAchievementId: 'GROUPED_CHALLENGE12_2'
  },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[13] >= 40, group: 'challenge13' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[13] >= 50, group: 'challenge13' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[13] >= 60, group: 'challenge13' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[13] >= 70, group: 'challenge13' },
  {
    pointValue: 120,
    unlockCondition: () => player.challengecompletions[13] >= 72,
    group: 'challenge13',
    steamAchievementId: 'GROUPED_CHALLENGE13_2'
  },
  { pointValue: 80, unlockCondition: () => player.challengecompletions[14] >= 40, group: 'challenge14' },
  { pointValue: 90, unlockCondition: () => player.challengecompletions[14] >= 50, group: 'challenge14' },
  { pointValue: 100, unlockCondition: () => player.challengecompletions[14] >= 60, group: 'challenge14' },
  { pointValue: 110, unlockCondition: () => player.challengecompletions[14] >= 70, group: 'challenge14' },
  {
    pointValue: 120,
    unlockCondition: () => player.challengecompletions[14] >= 72,
    group: 'challenge14',
    steamAchievementId: 'GROUPED_CHALLENGE14_2'
  },
  {
    pointValue: 40,
    unlockCondition: () => runeBlessings.speed.level >= 200,
    group: 'speedBlessing'
  },
  { pointValue: 50, unlockCondition: () => runeBlessings.speed.level >= 400, group: 'speedBlessing' },
  {
    pointValue: 60,
    unlockCondition: () => runeBlessings.speed.level >= 800,
    group: 'speedBlessing'
  },
  { pointValue: 70, unlockCondition: () => runeBlessings.speed.level >= 1000, group: 'speedBlessing' },
  {
    pointValue: 80,
    unlockCondition: () => runeBlessings.speed.level >= 1200,
    group: 'speedBlessing'
  },
  { pointValue: 90, unlockCondition: () => runeBlessings.speed.level >= 1500, group: 'speedBlessing' },
  {
    pointValue: 100,
    unlockCondition: () => runeBlessings.speed.level >= 2000,
    group: 'speedBlessing'
  },
  { pointValue: 40, unlockCondition: () => runeSpirits.speed.level >= 160, group: 'speedSpirit' },
  {
    pointValue: 50,
    unlockCondition: () => runeSpirits.speed.level >= 320,
    group: 'speedSpirit'
  },
  { pointValue: 60, unlockCondition: () => runeSpirits.speed.level >= 640, group: 'speedSpirit' },
  {
    pointValue: 70,
    unlockCondition: () => runeSpirits.speed.level >= 960,
    group: 'speedSpirit'
  },
  { pointValue: 80, unlockCondition: () => runeSpirits.speed.level >= 1280, group: 'speedSpirit' },
  {
    pointValue: 90,
    unlockCondition: () => runeSpirits.speed.level >= 1600,
    group: 'speedSpirit'
  },
  { pointValue: 100, unlockCondition: () => runeSpirits.speed.level >= 2000, group: 'speedSpirit' },
  {
    pointValue: 2,
    unlockCondition: () => runes.speed.level >= 100,
    group: 'runeLevel'
  },
  { pointValue: 4, unlockCondition: () => runes.speed.level >= 250, group: 'runeLevel' },
  {
    pointValue: 6,
    unlockCondition: () => runes.speed.level >= 500,
    group: 'runeLevel'
  },
  { pointValue: 8, unlockCondition: () => runes.speed.level >= 1000, group: 'runeLevel' },
  {
    pointValue: 10,
    unlockCondition: () => runes.speed.level >= 2000,
    group: 'runeLevel'
  },
  { pointValue: 12, unlockCondition: () => runes.speed.level >= 5000, group: 'runeLevel' },
  {
    pointValue: 14,
    unlockCondition: () => runes.speed.level >= 10000,
    group: 'runeLevel'
  },
  { pointValue: 16, unlockCondition: () => runes.speed.level >= 20000, group: 'runeLevel' },
  {
    pointValue: 18,
    unlockCondition: () => runes.speed.level >= 50000,
    group: 'runeLevel'
  },
  { pointValue: 20, unlockCondition: () => runes.speed.level >= 100000, group: 'runeLevel' },
  {
    pointValue: 22,
    unlockCondition: () => runes.speed.level >= 200000,
    group: 'runeLevel'
  },
  {
    pointValue: 24,
    unlockCondition: () => runes.speed.level >= 300000,
    group: 'runeLevel'
  },
  {
    pointValue: 26,
    unlockCondition: () => runes.speed.level >= 500000,
    group: 'runeLevel'
  },
  {
    pointValue: 28,
    unlockCondition: () => runes.speed.level >= 750000,
    group: 'runeLevel'
  },
  {
    pointValue: 30,
    unlockCondition: () => runes.speed.level >= 1000000,
    group: 'runeLevel'
  },
  {
    pointValue: 2,
    unlockCondition: () => runes.speed.freeLevels() >= 10,
    group: 'runeFreeLevel'
  },
  { pointValue: 4, unlockCondition: () => runes.speed.freeLevels() >= 40, group: 'runeFreeLevel' },
  {
    pointValue: 6,
    unlockCondition: () => runes.speed.freeLevels() >= 125,
    group: 'runeFreeLevel'
  },
  { pointValue: 8, unlockCondition: () => runes.speed.freeLevels() >= 250, group: 'runeFreeLevel' },
  {
    pointValue: 10,
    unlockCondition: () => runes.speed.freeLevels() >= 500,
    group: 'runeFreeLevel'
  },
  { pointValue: 12, unlockCondition: () => runes.speed.freeLevels() >= 1000, group: 'runeFreeLevel' },
  {
    pointValue: 14,
    unlockCondition: () => runes.speed.freeLevels() >= 2000,
    group: 'runeFreeLevel'
  },
  { pointValue: 16, unlockCondition: () => runes.speed.freeLevels() >= 4000, group: 'runeFreeLevel' },
  {
    pointValue: 18,
    unlockCondition: () => runes.speed.freeLevels() >= 7500,
    group: 'runeFreeLevel'
  },
  { pointValue: 20, unlockCondition: () => runes.speed.freeLevels() >= 12500, group: 'runeFreeLevel' },
  {
    pointValue: 22,
    unlockCondition: () => runes.speed.freeLevels() >= 25000,
    group: 'runeFreeLevel'
  },
  { pointValue: 24, unlockCondition: () => runes.speed.freeLevels() >= 37500, group: 'runeFreeLevel' },
  {
    pointValue: 26,
    unlockCondition: () => runes.speed.freeLevels() >= 50000,
    group: 'runeFreeLevel'
  },
  { pointValue: 28, unlockCondition: () => runes.speed.freeLevels() >= 75000, group: 'runeFreeLevel' },
  {
    pointValue: 30,
    unlockCondition: () => runes.speed.freeLevels() >= 100000,
    group: 'runeFreeLevel'
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
    reward: { prestigeCountMultiplier: () => Math.max(1, 1 + Math.floor(Math.log10(player.prestigeCount))) }
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
    reward: { transcensionCountMultiplier: () => Math.min(4, 1.25 + 2.75 * player.prestigecounter / 10) }
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
    reward: { reincarnationCountMultiplier: () => Math.min(4, 1.25 + 2.75 * player.prestigecounter / 1000) }
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
    reward: {
      reincarnationCountMultiplier: () => Math.max(1, 1 + Math.floor(Math.log10(player.reincarnationCount))),
      obtainiumTimerMultiplier: () => 1
    }
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
    reward: { thriftRuneUnlock: () => 1 }
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
    reward: {
      prestigeCountMultiplier: () => Math.min(4, 1.25 + 2.75 * player.prestigecounter / 1e6),
      ascensionCountMultiplier: () => Math.min(1.25, 1 + 0.25 * player.ascensionCounter / 1e6)
    }
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
  },
  {
    pointValue: 3,
    unlockCondition: () => player.ants.antSacrificeCount >= 1,
    group: 'sacCount',
    reward: { freeAntUpgrades: () => 1 }
  },
  {
    pointValue: 6,
    unlockCondition: () => player.ants.antSacrificeCount >= 10,
    group: 'sacCount',
    reward: { antSacrificeCountMultiplier: () => 2, hicAutobuy: () => 1 }
  },
  {
    pointValue: 9,
    unlockCondition: () => player.ants.antSacrificeCount >= 50,
    group: 'sacCount',
    reward: { autoAntSacrifice: () => 1 }
  },
  {
    pointValue: 12,
    unlockCondition: () => player.ants.antSacrificeCount >= 250,
    group: 'sacCount',
    reward: { antELOAdditiveMultiplier: () => 0.01, praemoenioAutobuy: () => 1 }
  },
  {
    pointValue: 15,
    unlockCondition: () => player.ants.antSacrificeCount >= 1250,
    group: 'sacCount',
    reward: { antELOAdditive: () => 25 }
  },
  {
    pointValue: 17,
    unlockCondition: () => player.ants.antSacrificeCount >= 5000,
    group: 'sacCount',
    reward: { antSpeed2UpgradeImprover: () => achievementLevel, phylacteriumAutobuy: () => 1 }
  },
  {
    pointValue: 19,
    unlockCondition: () => player.ants.antSacrificeCount >= 20000,
    group: 'sacCount'
  },
  {
    pointValue: 21,
    unlockCondition: () => player.ants.antSacrificeCount >= 80000,
    group: 'sacCount'
  },
  {
    pointValue: 23,
    unlockCondition: () => player.ants.antSacrificeCount >= 250000,
    group: 'sacCount'
  },
  {
    pointValue: 25,
    unlockCondition: () => player.ants.antSacrificeCount >= 1000000,
    group: 'sacCount',
    reward: { preserveAnthillCountSingularity: () => 1 }
  },
  {
    pointValue: 40,
    unlockCondition: () => player.ants.antSacrificeCount >= 3_000_000,
    group: 'sacCount'
  },
  {
    pointValue: 45,
    unlockCondition: () => player.ants.antSacrificeCount >= 10_000_000,
    group: 'sacCount',
    reward: { antSacrificeToReincarnation: () => 1 }
  },
  {
    pointValue: 55,
    unlockCondition: () => player.ants.antSacrificeCount >= 100_000_000,
    group: 'sacCount'
  },
  {
    pointValue: 3,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 10,
    group: 'addCodesUsed'
  },
  {
    pointValue: 6,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 20,
    group: 'addCodesUsed'
  },
  {
    pointValue: 9,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 50,
    group: 'addCodesUsed'
  },
  {
    pointValue: 12,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 100,
    group: 'addCodesUsed'
  },
  {
    pointValue: 15,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 200,
    group: 'addCodesUsed'
  },
  {
    pointValue: 18,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 300,
    group: 'addCodesUsed'
  },
  {
    pointValue: 21,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 500,
    group: 'addCodesUsed'
  },
  {
    pointValue: 24,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 750,
    group: 'addCodesUsed'
  },
  {
    pointValue: 27,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 1000,
    group: 'addCodesUsed'
  },
  {
    pointValue: 30,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 2000,
    group: 'addCodesUsed'
  },
  {
    pointValue: 33,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 3000,
    group: 'addCodesUsed'
  },
  {
    pointValue: 36,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 5000,
    group: 'addCodesUsed'
  },
  {
    pointValue: 39,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 6000,
    group: 'addCodesUsed'
  },
  {
    pointValue: 42,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 7500,
    group: 'addCodesUsed'
  },
  {
    pointValue: 45,
    unlockCondition: () => player.stats.totalAddCodesUsed >= 10000,
    group: 'addCodesUsed'
  }
]

interface AchievementDisplayInfo {
  order: number // Display achs in certain order
  displayCondition: () => boolean
}

const hasResetAtOrAboveLevel = (reset: resetTiers) => {
  if (reset <= resetTiers.singularity && player.singularityCount > 0) return true
  if (reset <= resetTiers.ascension && player.ascensionCount > 0) return true
  if (reset <= resetTiers.reincarnation && player.reincarnationCount > 0) return true
  if (reset <= resetTiers.transcension && player.transcendCount > 0) return true
  if (reset <= resetTiers.prestige && player.prestigeCount > 0) return true
  return false
}

export const groupedAchievementData: Record<Exclude<AchievementGroups, 'ungrouped'>, AchievementDisplayInfo> = {
  firstOwnedCoin: {
    order: 0,
    displayCondition: () => true
  },
  secondOwnedCoin: {
    order: 1,
    displayCondition: () => true
  },
  thirdOwnedCoin: {
    order: 2,
    displayCondition: () => true
  },
  fourthOwnedCoin: {
    order: 3,
    displayCondition: () => true
  },
  fifthOwnedCoin: {
    order: 4,
    displayCondition: () => true
  },
  prestigeCount: {
    order: 4.5,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige)
  },
  prestigePointGain: {
    order: 5,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige)
  },
  accelerators: {
    order: 6,
    displayCondition: () => true
  },
  multipliers: {
    order: 7,
    displayCondition: () => true
  },
  acceleratorBoosts: {
    order: 8,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige)
  },
  runeLevel: {
    order: 9,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige)
  },
  transcensionCount: {
    order: 9.5,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension)
  },
  transcendPointGain: {
    order: 10,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension)
  },
  challenge1: {
    order: 11,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension)
  },
  challenge2: {
    order: 12,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension)
  },
  challenge3: {
    order: 13,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension)
  },
  challenge4: {
    order: 14,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension)
  },
  challenge5: {
    order: 15,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension)
  },
  reincarnationCount: {
    order: 15.5,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.reincarnation)
  },
  reincarnationPointGain: {
    order: 16,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.reincarnation)
  },
  challenge6: {
    order: 17,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.reincarnation)
  },
  challenge7: {
    order: 18,
    displayCondition: () => player.highestchallengecompletions[6] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  challenge8: {
    order: 19,
    displayCondition: () => player.highestchallengecompletions[7] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  antCrumbs: {
    order: 20,
    displayCondition: () => player.highestchallengecompletions[8] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  sacCount: {
    order: 20.5,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  sacMult: {
    order: 21,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  runeFreeLevel: {
    order: 22,
    displayCondition: () => player.highestchallengecompletions[8] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  challenge9: {
    order: 23,
    displayCondition: () => player.highestchallengecompletions[8] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  speedBlessing: {
    order: 24,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  challenge10: {
    order: 25,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  ascensionCount: {
    order: 26,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  constant: {
    order: 27,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  challenge11: {
    order: 28,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.ascension)
  },
  campaignTokens: {
    order: 28.5,
    displayCondition: () => player.highestchallengecompletions[11] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity)
  },
  ascensionScore: {
    order: 29,
    displayCondition: () => player.highestchallengecompletions[11] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity)
  },
  challenge12: {
    order: 30,
    displayCondition: () => player.highestchallengecompletions[11] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity)
  },
  speedSpirit: {
    order: 31,
    displayCondition: () => player.highestchallengecompletions[12] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity)
  },
  challenge13: {
    order: 32,
    displayCondition: () => player.highestchallengecompletions[12] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity)
  },
  challenge14: {
    order: 33,
    displayCondition: () => player.highestchallengecompletions[13] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity)
  },
  singularityCount: {
    order: 34,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.singularity)
  },
  addCodesUsed: {
    order: 35,
    displayCondition: () => true
  }
}

export type UngroupedAchievementNames =
  | 'participationTrophy'
  | 'prestigeNoMult'
  | 'transcendNoMult'
  | 'reincarnationNoMult'
  | 'prestigeNoAccelerator'
  | 'transcendNoAccelerator'
  | 'reincarnationNoAccelerator'
  | 'diamondSearch'
  | 'prestigeNoCoinUpgrade'
  | 'transcendNoCoinUpgrade'
  | 'reincarnationNoCoinUpgrade'
  | 'transcendNoCoinDiamondUpgrade'
  | 'reincarnationNoCoinDiamondUpgrade'
  | 'reincarnationNoCoinDiamondMythosUpgrade'
  | 'reincarnationMinimumUpgrades'
  | 'generationAch1'
  | 'generationAch2'
  | 'generationAch3'
  | 'generationAch4'
  | 'chal1NoGen'
  | 'chal2NoGen'
  | 'chal3NoGen'
  | 'metaChallenged'
  | 'seeingRed'
  | 'ascended'
  | 'verySlow'
  | 'veryFast'
  | 'unsmith'
  | 'smith'
  | 'highlyBlessed'
  | 'oneCubeOfMany'
  | 'extraChallenging'
  | 'seeingRedNoBlue'
  | 'overtaxed'
  | 'thousandSuns'
  | 'thousandMoons'
  | 'sadisticAch'

interface UngroupedAchievementDisplayInfo extends AchievementDisplayInfo {
  achievementID: number
}

export const ungroupedAchievementData: Record<UngroupedAchievementNames, UngroupedAchievementDisplayInfo> = {
  participationTrophy: {
    order: 0,
    displayCondition: () => true,
    achievementID: AchievementId.ParticipationTrophy
  },
  prestigeNoMult: {
    order: 1,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: AchievementId.PrestigeNoMult
  },
  transcendNoMult: {
    order: 3,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.TranscendNoMult
  },
  reincarnationNoMult: {
    order: 5,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: AchievementId.ReincarnationNoMult
  },
  prestigeNoAccelerator: {
    order: 2,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: AchievementId.PrestigeNoAccelerator
  },
  transcendNoAccelerator: {
    order: 4,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.TranscendNoAccelerator
  },
  reincarnationNoAccelerator: {
    order: 6,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: AchievementId.ReincarnationNoAccelerator
  },
  diamondSearch: {
    order: 7,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.DiamondSearch
  },
  prestigeNoCoinUpgrade: {
    order: 8,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: AchievementId.PrestigeNoCoinUpgrade
  },
  transcendNoCoinUpgrade: {
    order: 9,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.TranscendNoCoinUpgrade
  },
  transcendNoCoinDiamondUpgrade: {
    order: 10,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.TranscendNoCoinDiamondUpgrade
  },
  reincarnationNoCoinUpgrade: {
    order: 11,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: AchievementId.ReincarnationNoCoinUpgrade
  },
  reincarnationNoCoinDiamondUpgrade: {
    order: 12,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: AchievementId.ReincarnationNoCoinDiamondUpgrade
  },
  reincarnationNoCoinDiamondMythosUpgrade: {
    order: 13,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: AchievementId.ReincarnationNoCoinDiamondMythosUpgrade
  },
  reincarnationMinimumUpgrades: {
    order: 14,
    displayCondition: () => player.reincarnationCount > 0,
    achievementID: AchievementId.ReincarnationMinimumUpgrades
  },
  generationAch1: {
    order: 15,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: AchievementId.GenerationAch1
  },
  generationAch2: {
    order: 16,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: AchievementId.GenerationAch2
  },
  generationAch3: {
    order: 17,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: AchievementId.GenerationAch3
  },
  generationAch4: {
    order: 18,
    displayCondition: () => player.prestigeCount > 0,
    achievementID: AchievementId.GenerationAch4
  },
  chal1NoGen: {
    order: 19,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.Chal1NoGen
  },
  chal2NoGen: {
    order: 20,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.Chal2NoGen
  },
  chal3NoGen: {
    order: 21,
    displayCondition: () => player.transcendCount > 0,
    achievementID: AchievementId.Chal3NoGen
  },
  metaChallenged: {
    order: 22,
    displayCondition: () => player.ascensionCount > 0,
    achievementID: AchievementId.MetaChallenged
  },
  seeingRed: {
    order: 23,
    displayCondition: () => player.unlocks.talismans,
    achievementID: AchievementId.SeeingRed
  },
  ascended: {
    order: 24,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: AchievementId.Ascended
  },
  verySlow: {
    order: 25,
    displayCondition: () => player.challengecompletions[12] > 0,
    achievementID: AchievementId.VerySlow
  },
  veryFast: {
    order: 26,
    displayCondition: () => player.challengecompletions[12] > 0,
    achievementID: AchievementId.VeryFast
  },
  unsmith: {
    order: 27,
    displayCondition: () => true,
    achievementID: AchievementId.Unsmith
  },
  smith: {
    order: 28,
    displayCondition: () => true,
    achievementID: AchievementId.Smith
  },
  highlyBlessed: {
    order: 29,
    displayCondition: () => player.unlocks.blessings,
    achievementID: AchievementId.HighlyBlessed
  },
  oneCubeOfMany: {
    order: 30,
    displayCondition: () => player.ascensionCount > 0,
    achievementID: AchievementId.OneCubeOfMany
  },
  extraChallenging: {
    order: 31,
    displayCondition: () => player.challengecompletions[11] >= 20,
    achievementID: AchievementId.ExtraChallenging
  },
  seeingRedNoBlue: {
    order: 32,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: AchievementId.SeeingRedNoBlue
  },
  overtaxed: {
    order: 33,
    displayCondition: () => player.challengecompletions[12] > 0,
    achievementID: AchievementId.Overtaxed
  },
  thousandSuns: {
    order: 34,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: AchievementId.ThousandSuns
  },
  thousandMoons: {
    order: 35,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: AchievementId.ThousandMoons
  },
  sadisticAch: {
    order: 36,
    displayCondition: () => player.challengecompletions[14] > 0,
    achievementID: AchievementId.SadisticAch
  }
}

export const ungroupedAchievementKeys = Object.keys(ungroupedAchievementData) as UngroupedAchievementNames[]

export const numAchievements = Object.keys(achievements).length
export const maxAchievementPoints = Object.values(achievements).reduce((sum, ach) => sum + ach.pointValue, 0)
  + Object.values(progressiveAchievements)
    .reduce((sum, ach) => sum + (ach.maxPointValue !== -1 ? ach.maxPointValue : 0), 0)

const achievementsByGroup: Record<AchievementGroups, number[]> = achievements
  .reduce((groups, achievement, index) => {
    if (achievement.group) {
      if (!groups[achievement.group]) {
        groups[achievement.group] = []
      }
      groups[achievement.group].push(index)
    }
    return groups
  }, {} as Record<AchievementGroups, number[]>)

const achievementGroupKeys = Object.keys(achievementsByGroup)
  .filter((k) => k !== 'ungrouped') as Exclude<AchievementGroups, 'ungrouped'>[]

const achRewards: { [K in AchievementRewards]: () => AchievementRewardValues[K] } = {
  acceleratorPower: () =>
    0.001 * player.achievements[AchievementId.FirstOwnedCoinTier3]
    + 0.0015 * player.achievements[AchievementId.SecondOwnedCoinTier3]
    + 0.002 * player.achievements[AchievementId.ThirdOwnedCoinTier3]
    + 0.002 * player.achievements[AchievementId.FourthOwnedCoinTier3]
    + 0.003 * player.achievements[AchievementId.FifthOwnedCoinTier3]
    + 0.01 * player.achievements[AchievementId.AcceleratorsTier2],
  accelerators: () => {
    const coinBuildings = getBuildingsOwned('coin')
    return (
      player.achievements[AchievementId.FirstOwnedCoinTier5] * Math.floor(coinBuildings[CoinBuilding.Workers] / 500)
      + player.achievements[AchievementId.SecondOwnedCoinTier5] * Math.floor(coinBuildings[CoinBuilding.Investments] / 500)
      + player.achievements[AchievementId.ThirdOwnedCoinTier5] * Math.floor(coinBuildings[CoinBuilding.Printers] / 500)
      + player.achievements[AchievementId.FourthOwnedCoinTier5] * Math.floor(coinBuildings[CoinBuilding.CoinMints] / 500)
      + player.achievements[AchievementId.FifthOwnedCoinTier5] * Math.floor(coinBuildings[CoinBuilding.Alchemies] / 500)
      + 2 * player.achievements[AchievementId.PrestigeNoAccelerator]
      + 4 * player.achievements[AchievementId.TranscendNoAccelerator]
      + 8 * player.achievements[AchievementId.ReincarnationNoAccelerator]
      + 5 * player.achievements[AchievementId.AcceleratorsTier4]
      + 12 * player.achievements[AchievementId.AcceleratorsTier5]
      + 25 * player.achievements[AchievementId.AcceleratorsTier6]
      + 50 * player.achievements[AchievementId.AcceleratorsTier7]
    )
  },
  multipliers: () => {
    const coinBuildings = getBuildingsOwned('coin')
    return (
      player.achievements[AchievementId.FirstOwnedCoinTier6] * Math.floor(coinBuildings[CoinBuilding.Workers] / 1000)
      + player.achievements[AchievementId.SecondOwnedCoinTier6] * Math.floor(coinBuildings[CoinBuilding.Investments] / 1000)
      + player.achievements[AchievementId.ThirdOwnedCoinTier6] * Math.floor(coinBuildings[CoinBuilding.Printers] / 1000)
      + player.achievements[AchievementId.FourthOwnedCoinTier6] * Math.floor(coinBuildings[CoinBuilding.CoinMints] / 1000)
      + player.achievements[AchievementId.FifthOwnedCoinTier6] * Math.floor(coinBuildings[CoinBuilding.Alchemies] / 1000)
      + player.achievements[AchievementId.PrestigeNoMult]
      + 2 * player.achievements[AchievementId.TranscendNoMult]
      + 4 * player.achievements[AchievementId.ReincarnationNoMult]
      + player.achievements[AchievementId.MultipliersTier2]
      + player.achievements[AchievementId.MultipliersTier4]
      + 3 * player.achievements[AchievementId.MultipliersTier5]
      + 6 * player.achievements[AchievementId.MultipliersTier6]
      + 10 * player.achievements[AchievementId.MultipliersTier7]
    )
  },
  accelBoosts: () => {
    const coinBuildings = getBuildingsOwned('coin')
    return (
      player.achievements[AchievementId.FirstOwnedCoinTier7] * Math.floor(coinBuildings[CoinBuilding.Workers] / 2000)
      + player.achievements[AchievementId.SecondOwnedCoinTier7] * Math.floor(coinBuildings[CoinBuilding.Investments] / 2000)
      + player.achievements[AchievementId.ThirdOwnedCoinTier7] * Math.floor(coinBuildings[CoinBuilding.Printers] / 2000)
      + player.achievements[AchievementId.FourthOwnedCoinTier7] * Math.floor(coinBuildings[CoinBuilding.CoinMints] / 2000)
      + player.achievements[AchievementId.FifthOwnedCoinTier7] * Math.floor(coinBuildings[CoinBuilding.Alchemies] / 2000)
    )
  },
  crystalMultiplier: () =>
    1
    + player.achievements[AchievementId.PrestigePointGainTier2]
      * Math.max(0, Decimal.log(player.prestigePoints, Math.E) - 1),
  quarkGain: () =>
    (1 + 0.05 * player.achievements[AchievementId.ThousandSuns])
    * (1 + 0.05 * player.achievements[AchievementId.ThousandMoons])
    * (1 + 0.1 * player.achievements[AchievementId.AscensionCountTier14] * Math.min(player.ascensionCount / 1e15, 1)),
  taxReduction: () =>
    (1 - 0.05 * player.achievements[AchievementId.TranscendPointGainTier3])
    * (1 - 0.05 * player.achievements[AchievementId.TranscendPointGainTier4])
    * (1 - 0.1 * player.achievements[AchievementId.TranscendPointGainTier5])
    * (1 - 0.04 * player.achievements[AchievementId.Challenge1Tier5])
    * (1 - 0.04 * player.achievements[AchievementId.Challenge2Tier5])
    * (1 - 0.04 * player.achievements[AchievementId.Challenge3Tier5])
    * (1 - 0.04 * player.achievements[AchievementId.Challenge4Tier5])
    * (1 - 0.04 * player.achievements[AchievementId.Challenge5Tier5])
    * (1 - 0.05 * player.achievements[AchievementId.Challenge6Tier5])
    * Math.pow(
      0.9925,
      player.achievements[AchievementId.Challenge6Tier6]
        * (player.challengecompletions[6] + player.challengecompletions[7] + player.challengecompletions[8]
          + player.challengecompletions[9] + player.challengecompletions[10])
    )
    * (1 - 0.05 * player.achievements[AchievementId.Challenge7Tier5])
    * (1 - 0.05 * player.achievements[AchievementId.Challenge8Tier5]),
  particleGain: () => 1 + player.achievements[AchievementId.ReincarnationPointGainTier1],
  chronosTalisman: () => Boolean(player.achievements[AchievementId.Challenge7Tier7]),
  midasTalisman: () => Boolean(player.achievements[AchievementId.Challenge8Tier7]),
  metaphysicsTalisman: () => Boolean(player.achievements[AchievementId.Challenge9Tier7]),
  polymathTalisman: () => Boolean(player.achievements[AchievementId.Challenge10Tier7]),
  wowSquareTalisman: () => Boolean(player.achievements[AchievementId.AscensionCountTier4]),
  conversionExponent: () =>
    0.01 * player.achievements[AchievementId.GenerationAch1]
    + 0.01 * player.achievements[AchievementId.GenerationAch2]
    + 0.01 * player.achievements[AchievementId.GenerationAch3]
    + 0.01 * player.achievements[AchievementId.GenerationAch4]
    + 0.01 * player.achievements[AchievementId.Chal1NoGen]
    + 0.01 * player.achievements[AchievementId.Chal2NoGen]
    + 0.01 * player.achievements[AchievementId.Chal3NoGen],
  talismanPower: () =>
    0.02 * player.achievements[AchievementId.Challenge9Tier2]
    + 0.02 * player.achievements[AchievementId.Challenge9Tier3]
    + 0.025 * player.achievements[AchievementId.Challenge10Tier4]
    + 0.025 * player.achievements[AchievementId.Challenge10Tier5]
    + 0.01 * player.achievements[AchievementId.Challenge11Tier7]
    + 0.01 * player.achievements[AchievementId.Challenge12Tier7]
    + 0.01 * player.achievements[AchievementId.Challenge13Tier7],
  sacrificeMult: () => 1 + 0.25 * player.achievements[AchievementId.Challenge9Tier4],
  antSpeed: () =>
    (1 + player.achievements[AchievementId.AntCrumbsTier1] * (Decimal.log(player.ants.crumbs.plus(10), 10) - 1))
    * (1 + 0.2 * player.achievements[AchievementId.AntCrumbsTier3])
    * (1 + 0.25 * player.achievements[AchievementId.AntCrumbsTier4])
    * (1 + 0.4 * player.achievements[AchievementId.AntCrumbsTier5])
    * (1 + player.achievements[AchievementId.AntCrumbsTier6] * player.ants.immortalELO / 1000),
  antSacrificeUnlock: () => Boolean(player.achievements[AchievementId.AntCrumbsTier5]),
  antAutobuyers: () =>
    player.achievements[AchievementId.AntCrumbsTier5]
    + player.achievements[AchievementId.SacMultTier1]
    + player.achievements[AchievementId.SacMultTier2]
    + player.achievements[AchievementId.SacMultTier3]
    + player.achievements[AchievementId.SacMultTier4]
    + player.achievements[AchievementId.SacMultTier5]
    + player.achievements[AchievementId.SacMultTier6]
    + player.achievements[AchievementId.SacMultTier7]
    + player.achievements[AchievementId.SacMultTier10],
  preserveAnthillCount: () => Boolean(player.achievements[AchievementId.AscensionCountTier2]),
  preserveAnthillCountSingularity: () => Boolean(player.achievements[AchievementId.SacCountTier10]),
  inceptusAutobuy: () => Boolean(player.achievements[AchievementId.SacMultTier1]),
  fortunaeAutobuy: () => Boolean(player.achievements[AchievementId.SacMultTier1]),
  tributumAutobuy: () => Boolean(player.achievements[AchievementId.SacMultTier2]),
  celeritasAutobuy: () => Boolean(player.achievements[AchievementId.SacMultTier3]),
  exploratoremAutobuy: () => Boolean(player.achievements[AchievementId.SacMultTier3]),
  sacrificiumAutobuy: () => Boolean(player.achievements[AchievementId.SacMultTier4]),
  experientiaAutobuy: () => Boolean(player.achievements[AchievementId.Challenge9Tier4]),
  hicAutobuy: () => Boolean(player.achievements[AchievementId.SacCountTier2]),
  scientiaAutobuy: () => Boolean(player.achievements[AchievementId.AntCrumbsTier6]),
  praemoenioAutobuy: () => Boolean(player.achievements[AchievementId.SacCountTier4]),
  phylacteriumAutobuy: () => Boolean(player.achievements[AchievementId.SacCountTier6]),
  antELOAdditive: () => 25 * player.achievements[AchievementId.SacCountTier5],
  antELOAdditiveMultiplier: () => 0.01 * player.achievements[AchievementId.SacCountTier4],
  ascensionCountMultiplier: () =>
    (1 + 0.8 * player.achievements[AchievementId.AscensionCountTier5] * ascensionEffectiveCorruptionLevel())
    * (1 + 0.1 * player.achievements[AchievementId.AscensionCountTier8])
    * (1 + 0.1 * player.achievements[AchievementId.AscensionCountTier9])
    * (1
      + player.achievements[AchievementId.ReincarnationCountTier9]
        * Math.min(0.25, 0.25 * player.ascensionCounter / 1e6)),
  ascensionCountAdditive: () =>
    player.achievements[AchievementId.AscensionCountTier6] * (player.ascensionCounter > 10 ? 100 : 0)
    + player.achievements[AchievementId.AscensionCountTier7]
      * (player.ascensionCounter > 10 ? 2 * player.ascensionCounterReal : 0)
    + 2 * player.achievements[AchievementId.Challenge11Tier6] * player.ascensionCounter
    + 2 * player.achievements[AchievementId.Challenge12Tier6] * player.ascensionCounter
    + 2 * player.achievements[AchievementId.Challenge13Tier6] * player.ascensionCounter
    + 2 * player.achievements[AchievementId.Challenge14Tier6] * player.ascensionCounter,
  wowCubeGain: () =>
    (1 + 2 * player.achievements[AchievementId.AscensionCountTier7] * Math.min(1, player.ascensionCount / 5e8))
    * (1 + player.achievements[AchievementId.ConstantTier4] * Decimal.log(player.ascendShards.add(1), 10) / 400)
    * (1
      + 249 * player.achievements[AchievementId.ConstantTier6]
        * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000))
    * (1 + 0.1 * player.achievements[AchievementId.AscensionScoreTier9]),
  wowTesseractGain: () =>
    (1
      + 249 * player.achievements[AchievementId.ConstantTier6]
        * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000))
    * (1 + 0.1 * player.achievements[AchievementId.AscensionScoreTier10]),
  wowHypercubeGain: () => 1 + 0.1 * player.achievements[AchievementId.AscensionScoreTier8],
  wowPlatonicGain: () =>
    (1
      + 19 * player.achievements[AchievementId.ConstantTier7]
        * Math.min(1, Decimal.log(player.ascendShards.plus(1), 10) / 100000))
    * (1 + 2 * player.achievements[AchievementId.Challenge14Tier6] * Math.min(1, player.ascensionCount / 2.674e9))
    * (1 + 0.1 * player.achievements[AchievementId.AscensionScoreTier11]),
  wowHepteractGain: () =>
    (1 + 0.1 * player.achievements[AchievementId.AscensionScoreTier13])
    * (1
      + player.achievements[AchievementId.ConstantTier11]
        * Math.min(Decimal.log(player.ascendShards.add(1), 10) / 1e6, 1)),
  cubesBanked: () =>
    50 * player.achievements[AchievementId.AscensionScoreTier14] * player.hepteracts.abyss.TIMES_CAP_EXTENDED
    + player.achievements[AchievementId.ConstantTier8]
      * Math.min(2000, Math.floor(Decimal.log(player.ascendShards.add(1), 10) / 50)),
  ascensionRewardScaling: () => Boolean(player.achievements[AchievementId.Challenge12Tier1]),
  constUpgrade1Buff: () => 0.01 * player.achievements[AchievementId.ConstantTier11],
  constUpgrade2Buff: () => 0.01 * player.achievements[AchievementId.ConstantTier11],
  platonicToHypercubes: () =>
    player.achievements[AchievementId.ConstantTier12] * Math.min(1, Decimal.log(player.ascendShards.add(1), 10) / 1e6),
  statTracker: () => Boolean(player.achievements[AchievementId.Challenge11Tier1]),
  overfluxConversionRate: () =>
    (1 + 0.05 * player.achievements[AchievementId.AscensionScoreTier11])
    * (1 + 0.05 * player.achievements[AchievementId.AscensionScoreTier12]),
  diamondUpgrade18: () => Boolean(player.achievements[AchievementId.Challenge7Tier1]),
  diamondUpgrade19: () => Boolean(player.achievements[AchievementId.Challenge8Tier1]),
  diamondUpgrade20: () => Boolean(player.achievements[AchievementId.Challenge9Tier1]),
  prestigeCountMultiplier: () =>
    (1
      + player.achievements[AchievementId.PrestigeCountTier2]
        * Math.max(0, Math.floor(Math.log10(player.prestigeCount))))
    * (1
      + player.achievements[AchievementId.ReincarnationCountTier9]
        * Math.min(3, 0.25 + 2.75 * player.prestigecounter / 1e6)),
  transcensionCountMultiplier: () =>
    (1 + player.achievements[AchievementId.PrestigeCountTier9] * Math.min(3, 0.25 + 2.75 * player.prestigecounter / 10))
    * (1
      + player.achievements[AchievementId.TranscensionCountTier2]
        * Math.max(0, Math.floor(Math.log10(player.transcendCount)))),
  reincarnationCountMultiplier: () =>
    (1
      + player.achievements[AchievementId.TranscensionCountTier9]
        * Math.min(3, 0.25 + 2.75 * player.prestigecounter / 1000))
    * (1
      + player.achievements[AchievementId.ReincarnationCountTier2]
        * Math.max(0, Math.floor(Math.log10(player.reincarnationCount)))),
  duplicationRuneUnlock: () => Boolean(player.achievements[AchievementId.PrestigeCountTier3]),
  offeringBonus: () =>
    1
    + 0.02 * player.achievements[AchievementId.PrestigeCountTier4]
      * Math.max(1, 1 + Math.floor(Math.log10(player.prestigeCount))),
  obtainiumBonus: () =>
    1
    + 0.02 * player.achievements[AchievementId.ReincarnationCountTier3]
      * Math.max(1, 1 + Math.floor(Math.log10(player.reincarnationCount))),
  salvage: () =>
    2 * player.achievements[AchievementId.TranscensionCountTier3]
    * Math.max(1, 1 + Math.floor(Math.log10(player.transcendCount))),
  prismRuneUnlock: () => Boolean(player.achievements[AchievementId.TranscensionCountTier4]),
  thriftRuneUnlock: () => Boolean(player.achievements[AchievementId.ReincarnationCountTier5]),
  transcendToPrestige: () => Boolean(player.achievements[AchievementId.PrestigeCountTier7]),
  reincarnationToTranscend: () => Boolean(player.achievements[AchievementId.TranscensionCountTier7]),
  freeAntUpgrades: () =>
    2 * player.achievements[AchievementId.AscensionCountTier1]
    + player.achievements[AchievementId.SacCountTier1],
  antSacrificeCountMultiplier: () =>
    (1 + player.achievements[AchievementId.AscensionCountTier2])
    * (1 + player.achievements[AchievementId.SacCountTier2]),
  autoAntSacrifice: () => Boolean(player.achievements[AchievementId.SacCountTier3]),
  antSpeed2UpgradeImprover: () => player.achievements[AchievementId.SacCountTier6] * achievementLevel,
  antSacrificeToReincarnation: () => Boolean(player.achievements[AchievementId.SacCountTier12]),
  obtainiumTimerMultiplier: () => Boolean(player.achievements[AchievementId.ReincarnationCountTier2])
}

export let achievementPoints = 0
export let achievementLevel = 0

export const updateAchievementPoints = (sourcedFromUpdate = false) => {
  achievementPoints = 0

  achievementPoints += achievements.reduce((sum, ach, index) => {
    return sum + (player.achievements[index] ? ach.pointValue : 0)
  }, 0)

  for (const k of progressiveAchievementKeys) {
    const pointsAwarded = progressiveAchievements[k].pointsAwarded(player.progressiveAchievements[k])
    achievementPoints += pointsAwarded
    progressiveAchievements[k].rewardedAP = pointsAwarded
    updateProgressiveCache(k, sourcedFromUpdate)
  }

  updateAchievementLevel(sourcedFromUpdate)
}

const unlockedSteamAchievements = new Set<string>()

const unlockSteamAchievement = async (steamAchievementId: string): Promise<void> => {
  if (PLATFORM === 'steam') {
    if (unlockedSteamAchievements.has(steamAchievementId)) {
      return // Prevent unnecessary calls to Steam
    }
    unlockedSteamAchievements.add(steamAchievementId)
    try {
      const { unlockAchievement } = await import('./steam/steam')
      await unlockAchievement(steamAchievementId)
    } catch (error) {
      unlockedSteamAchievements.delete(steamAchievementId)
      console.error(`Failed to unlock Steam achievement ${steamAchievementId}:`, error)
    }
  }
}

/**
 * Syncs all earned in-game achievements to Steam.
 * Call this after loading a save to ensure Steam achievements match game state.
 */
export const syncSteamAchievements = async (): Promise<void> => {
  if (PLATFORM === 'steam') {
    unlockedSteamAchievements.clear()

    const unlockPromises: Promise<unknown>[] = []

    for (let i = 0; i < achievements.length; i++) {
      const steamId = achievements[i].steamAchievementId
      if (steamId && player.achievements[i] === 1) {
        unlockPromises.push(unlockSteamAchievement(steamId))
      }
    }

    await Promise.all(unlockPromises)
  }
}

const awardAchievement = (index: number) => {
  if (player.achievements[index] === 1) {
    return
  }
  if (achievements[index].unlockCondition()) {
    player.achievements[index] = 1
    achievementPoints += achievements[index].pointValue
    updateAchievementLevel()
    if (player.toggles[34]) {
      const description = i18next.t(`achievements.descriptions.${index}`)
      // on mobile, notifications take up a decent amount of space, so show them for a shorter period of time
      void Notification(
        i18next.t('achievements.notification', { m: description }),
        isMobile ? 5000 : undefined
      )
    }
    player.worlds.add(getAchievementQuarks(), false, true)
    revealStuff()

    // Unlock Steam achievement if configured
    const steamId = achievements[index].steamAchievementId
    if (steamId) {
      void unlockSteamAchievement(steamId)
    }

    // Update displays if we are on Achievements Tab
    if (G.currentTab === Tabs.Achievements) {
      if (achievements[index].group === 'ungrouped') {
        updateUngroupedAchievementProgress(index)
      } else {
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

const updateProgressiveAP = (ach: ProgressiveAchievements, sourcedFromUpdate = false) => {
  const oldPoints = progressiveAchievements[ach].rewardedAP
  const pointsAwarded = progressiveAchievements[ach].pointsAwarded(player.progressiveAchievements[ach])
  achievementPoints += pointsAwarded - progressiveAchievements[ach].rewardedAP
  progressiveAchievements[ach].rewardedAP = pointsAwarded

  if (oldPoints !== pointsAwarded) {
    updateProgressiveAchievementProgress(ach)
    updateAchievementLevel(sourcedFromUpdate)
  }
}

export const updateProgressiveCache = (ach: ProgressiveAchievements, sourcedFromUpdate = false) => {
  if (!progressiveAchievements[ach].useCachedValue) {
    updateProgressiveAP(ach, sourcedFromUpdate)
  }
  const oldVal = player.progressiveAchievements[ach]
  player.progressiveAchievements[ach] = Math.max(
    player.progressiveAchievements[ach],
    progressiveAchievements[ach].updateValue()
  )
  if (oldVal !== player.progressiveAchievements[ach]) {
    updateProgressiveAP(ach, sourcedFromUpdate)
  }
}

const updateAchievementLevel = (fromUpdatePoints = false) => {
  const oldLevel = achievementLevel
  if (achievementPoints < 2500) {
    achievementLevel = Math.floor(achievementPoints / 50)
  } else {
    achievementLevel = 50 + Math.floor((achievementPoints - 2500) / 100)
  }
  displayLevelStuff()
  if (oldLevel < achievementLevel) {
    if (player.toggles[34] && !fromUpdatePoints) {
      void Notification(i18next.t('achievements.levelUpNotification', { old: oldLevel, new: achievementLevel }))
    }
  }
}

export function computeAchievementPoints (
  savedAchievements: number[],
  savedProgressiveAchievements: Record<string, number>
): number {
  let points = achievements.reduce((sum, ach, index) => {
    return sum + (savedAchievements[index] ? ach.pointValue : 0)
  }, 0)

  for (const k of progressiveAchievementKeys) {
    points += progressiveAchievements[k].pointsAwarded(savedProgressiveAchievements[k] ?? 0)
  }

  return points
}

export const toNextAchievementLevelEXP = () => {
  if (achievementPoints < 2500) {
    return 50 - (achievementPoints % 50)
  } else {
    return 100 - (achievementPoints % 100)
  }
}

export const getAchievementReward = <K extends AchievementRewards>(rewardType: K): AchievementRewardValues[K] => {
  return achRewards[rewardType]()
}

const createGroupedAchievementDescription = (group: AchievementGroups) => {
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
              val: format(rewardFunction(), 3, false)
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
    groupName += `<b style='color: gold'>${
      i18next.t('achievements.complete', {
        tier: achTier
      })
    }</b>`
    groupName = `<span class='rainbowText'>${groupName}</span>`
  } else {
    groupName += `<b style='color: gold'>${
      i18next.t('achievements.tier', {
        tier: achTier
      })
    }</b>`
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
  return finalText
  // DOMCacheGetOrSet('achievementMultiLine').innerHTML = finalText
}

const generateUngroupedDescription = (name: UngroupedAchievementNames) => {
  const index = ungroupedAchievementData[name].achievementID
  const ach = achievements[index]
  const achText = i18next.t(`achievements.descriptions.${index}`)
  let trimmedRequirement = achText

  const value = ach.pointValue
  let earnedValue = 0

  const hasAch = player.achievements[index] === 1
  if (hasAch) {
    trimmedRequirement = `<span class='rainbowText'>COMPLETE!</span><br>${trimmedRequirement}`
    earnedValue = value
  } else {
    trimmedRequirement += ` [+${ach.pointValue} AP]`
  }

  let extraText = ''
  if (ach.reward) {
    extraText = `${i18next.t('achievements.ungroupedExtraRewards')}<br>`
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
            val: format(rewardFunction(), 3, false)
          })
        }</span><br>`
      }
    }
  }

  const finalText = `${earnedValue}/${value} AP<br>
  ${trimmedRequirement}<br>
  ${extraText}`
  return finalText
}

const generateProgressiveAchievementDescription = (name: ProgressiveAchievements) => {
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

  return finalText
}

export const generateAchievementHTMLs = memoize(() => {
  const table = DOMCacheGetOrSet('tieredAchievementsTable')
  const ungroupedTable = DOMCacheGetOrSet('ungroupedAchievementsTable')
  const progressiveTable = DOMCacheGetOrSet('progressiveAchievementsTable')

  const sortedGroups = [...achievementGroupKeys]
    .sort((a, b) => {
      const orderA = groupedAchievementData[a].order
      const orderB = groupedAchievementData[b].order
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
    img.tabIndex = 0

    registerAchievementModal(img, createGroupedAchievementDescription.bind(null, k), 'cyan')

    // attach to the table
    div.appendChild(img)
    table.appendChild(div)
  }

  const sortedUngrouped = [...ungroupedAchievementKeys]
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
    img.alt = ''
    img.style.cursor = 'pointer'
    img.tabIndex = 0

    registerAchievementModal(img, () => generateUngroupedDescription(k), 'white', null)

    // attach to the table
    div.appendChild(img)
    ungroupedTable.appendChild(div)
  }

  // TODO: use toSorted
  const sortedProgressive = [...progressiveAchievementKeys]
    .sort((a, b) => {
      const orderA = progressiveAchievements[a].displayOrder
      const orderB = progressiveAchievements[b].displayOrder
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
    img.alt = i18next.t(`achievements.progressiveAchievements.${k}.name`)
    img.style.cursor = 'pointer'
    img.tabIndex = 0

    registerAchievementModal(img, () => generateProgressiveAchievementDescription(k), 'turquoise')

    // attach to the table
    div.appendChild(img)
    progressiveTable.appendChild(div)
  }
})

const updateGroupedAchievementProgress = (group: AchievementGroups) => {
  if (group === 'ungrouped') {
    throw new Error('Cannot update progress for ungrouped achievements in updateGroupedAchievementProgress')
  }

  const capitalizedName = group.charAt(0).toUpperCase() + group.slice(1)
  const img = DOMCacheGetOrSet(`achievementGroup${capitalizedName}`)

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

export const updateAllGroupedAchievementProgress = () => {
  for (const k of achievementGroupKeys) {
    updateGroupedAchievementProgress(k)
  }
}

const updateUngroupedAchievementProgress = (id: number) => {
  const capitalizedName = ungroupedAchievementKeys.find((k) => ungroupedAchievementData[k].achievementID === id)
  if (!capitalizedName) {
    throw new Error(`Ungrouped achievement with ID ${id} not found`)
  }

  const img = DOMCacheGetOrSet(
    `ungroupedAchievement${capitalizedName.charAt(0).toUpperCase() + capitalizedName.slice(1)}`
  )

  const isCompleted = player.achievements[id] === 1
  img.classList.remove('green-background')

  if (isCompleted) {
    img.classList.add('green-background')
  }
}

export const updateAllUngroupedAchievementProgress = () => {
  for (const ach of Object.values(ungroupedAchievementData)) {
    updateUngroupedAchievementProgress(ach.achievementID)
  }
}

const updateProgressiveAchievementProgress = (progAch: ProgressiveAchievements) => {
  const capitalizedName = progAch.charAt(0).toUpperCase() + progAch.slice(1)
  const img = DOMCacheGetOrSet(`progressiveAchievement${capitalizedName}`)

  const achData = progressiveAchievements[progAch]

  // Infinite progression implies we cannot define a percentage
  if (achData.maxPointValue === -1) {
    return
  }

  const currentAP = progressiveAchievements[progAch].rewardedAP
  const maxAP = achData.maxPointValue

  img.classList.toggle('green-background', currentAP >= maxAP)

  // Set progress percentage
  img.style.setProperty('--pct', `${currentAP}/${maxAP}`)
}

export const updateAllProgressiveAchievementProgress = () => {
  for (const k of progressiveAchievementKeys) {
    updateProgressiveAchievementProgress(k)
  }
}

export const displayAchievementProgress = () => {
  // Display Grouped Achievements AP
  for (const k of achievementGroupKeys) {
    // Do not display data on locked groups
    if (!groupedAchievementData[k].displayCondition()) {
      continue
    }

    const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
    const img = DOMCacheGetOrSet(`achievementGroup${capitalizedName}`)
    const parent = img.parentElement!

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

  // Display Ungrouped Achievements AP
  for (const k of ungroupedAchievementKeys) {
    // Do not display data on locked ungrouped achievements
    if (!ungroupedAchievementData[k].displayCondition()) {
      continue
    }

    const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
    const img = DOMCacheGetOrSet(`ungroupedAchievement${capitalizedName}`)
    const parent = img.parentElement!

    const achievementId = ungroupedAchievementData[k].achievementID
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

  // Display Progressive Achievements AP
  for (const k of progressiveAchievementKeys) {
    // Do not display data on locked progressive achievements
    if (!progressiveAchievements[k].displayCondition()) {
      continue
    }

    const capitalizedName = k.charAt(0).toUpperCase() + k.slice(1)
    const img = DOMCacheGetOrSet(`progressiveAchievement${capitalizedName}`)
    const parent = img.parentElement!

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

export const resetAchievementProgressDisplay = () => {
  achievementProgressSelectors.forEach((selector) => {
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
  for (const k of progressiveAchievementKeys) {
    player.progressiveAchievements[k] = 0
    progressiveAchievements[k].rewardedAP = 0
  }
  achievementPoints = 0
  achievementLevel = 0
}
