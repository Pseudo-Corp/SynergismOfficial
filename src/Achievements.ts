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
    awardUngroupedAchievement(UngroupedAchievement.PrestigeNoAccelerator)
    awardUngroupedAchievement(UngroupedAchievement.PrestigeNoMult)
    awardUngroupedAchievement(UngroupedAchievement.PrestigeNoCoinUpgrade)
    awardAchievementGroup(AchievementGroup.PrestigePointGain)
  }
  if (reset === 'transcension') {
    awardUngroupedAchievement(UngroupedAchievement.TranscendNoAccelerator)
    awardUngroupedAchievement(UngroupedAchievement.TranscendNoMult)
    awardUngroupedAchievement(UngroupedAchievement.TranscendNoCoinUpgrade)
    awardUngroupedAchievement(UngroupedAchievement.TranscendNoCoinDiamondUpgrade)
    awardAchievementGroup(AchievementGroup.TranscendPointGain)
  }
  if (reset === 'reincarnation') {
    awardUngroupedAchievement(UngroupedAchievement.ReincarnationNoAccelerator)
    awardUngroupedAchievement(UngroupedAchievement.ReincarnationNoMult)
    awardUngroupedAchievement(UngroupedAchievement.ReincarnationNoCoinUpgrade)
    awardUngroupedAchievement(UngroupedAchievement.ReincarnationNoCoinDiamondUpgrade)
    awardUngroupedAchievement(UngroupedAchievement.ReincarnationNoCoinDiamondMythosUpgrade)
    awardUngroupedAchievement(UngroupedAchievement.ReincarnationMinimumUpgrades)
    awardAchievementGroup(AchievementGroup.ReincarnationPointGain)
  }
}

export const challengeAchievementCheck = (i: number) => {
  switch (i) {
    case 1:
      awardAchievementGroup(AchievementGroup.Challenge1)
      awardUngroupedAchievement(UngroupedAchievement.Chal1NoGen)
      break
    case 2:
      awardAchievementGroup(AchievementGroup.Challenge2)
      awardUngroupedAchievement(UngroupedAchievement.Chal2NoGen)
      break
    case 3:
      awardAchievementGroup(AchievementGroup.Challenge3)
      awardUngroupedAchievement(UngroupedAchievement.Chal3NoGen)
      break
    case 4:
      awardAchievementGroup(AchievementGroup.Challenge4)
      break
    case 5:
      awardAchievementGroup(AchievementGroup.Challenge5)
      awardUngroupedAchievement(UngroupedAchievement.DiamondSearch)
      break
    case 6:
      awardAchievementGroup(AchievementGroup.Challenge6)
      break
    case 7:
      awardAchievementGroup(AchievementGroup.Challenge7)
      break
    case 8:
      awardAchievementGroup(AchievementGroup.Challenge8)
      break
    case 9:
      awardAchievementGroup(AchievementGroup.Challenge9)
      break
    case 10:
      awardAchievementGroup(AchievementGroup.Challenge10)
      if (player.currentChallenge.ascension === 11 && player.challengecompletions[10] >= 30) {
        awardUngroupedAchievement(UngroupedAchievement.ExtraChallenging)
      }
      break
    case 11:
      awardAchievementGroup(AchievementGroup.Challenge11)
      break
    case 12:
      awardAchievementGroup(AchievementGroup.Challenge12)
      break
    case 13:
      awardAchievementGroup(AchievementGroup.Challenge13)
      break
    case 14:
      awardAchievementGroup(AchievementGroup.Challenge14)
      break
    case 15:
      awardUngroupedAchievement(UngroupedAchievement.SadisticAch)
      break
  }
}

export const buildingAchievementCheck = () => {
  awardAchievementGroup(AchievementGroup.FirstOwnedCoin)
  awardAchievementGroup(AchievementGroup.SecondOwnedCoin)
  awardAchievementGroup(AchievementGroup.ThirdOwnedCoin)
  awardAchievementGroup(AchievementGroup.FourthOwnedCoin)
  awardAchievementGroup(AchievementGroup.FifthOwnedCoin)
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

interface AchievementBase {
  id: AchievementId
  pointValue: number
  rewards?: AchievementRewards[]
  steamAchievementId?: string
}

interface AchievementTier<T> extends AchievementBase {
  requirement: T
  extraCondition?: () => boolean
}

interface GroupedAchievementOf<K extends string, T> {
  key: string
  kind: K
  firstLockedTier: number
  displayCondition: () => boolean
  getValue: () => T
  tiers: AchievementTier<T>[]
}

type GroupedAchievementData =
  | GroupedAchievementOf<'number', number>
  | GroupedAchievementOf<'decimal', Decimal>

interface UngroupedAchievementData extends AchievementBase {
  key: string
  unlockCondition: () => boolean
  displayCondition: () => boolean
}

interface ProgressiveAchievement {
  maxPointValue: number
  pointsAwarded: (cached: number) => number
  updateValue: () => number // Number to compare to existing caches
  useCachedValue: boolean
  rewardedAP: number // Updating achievementPoints: pointsAwarded() - rewardedAP
  extraI18n?: () => Record<string, number>
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
    displayCondition: () => player.unlocks.anthill
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
    displayCondition: () => player.unlocks.talismans
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
    displayCondition: () => player.highestSingularityCount > 0
  },
  singularityUpgrades: {
    maxPointValue: maxGoldenQuarkUpgradeAP,
    pointsAwarded: (_cached: number) => calculateGQUpgradeAP(),
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
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
    displayCondition: () => getGQUpgradeEffect('octeractUnlock', 'unlocked')
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
    displayCondition: () => player.highestSingularityCount >= 25
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
    displayCondition: () => player.highestSingularityCount >= 150
  },
  redAmbrosiaUpgrades: {
    maxPointValue: maxRedAmbrosiaUpgradeAP,
    pointsAwarded: () => calculateRedAmbrosiaUpgradeAP(),
    updateValue: () => {
      return 0
    },
    useCachedValue: false,
    rewardedAP: 0,
    displayCondition: () => player.highestSingularityCount >= 150
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

const hasResetAtOrAboveLevel = (reset: resetTiers) => {
  if (reset <= resetTiers.singularity && player.singularityCount > 0) return true
  if (reset <= resetTiers.ascension && player.ascensionCount > 0) return true
  if (reset <= resetTiers.reincarnation && player.reincarnationCount > 0) return true
  if (reset <= resetTiers.transcension && player.transcendCount > 0) return true
  if (reset <= resetTiers.prestige && player.prestigeCount > 0) return true
  return false
}

export enum AchievementGroup {
  FirstOwnedCoin,
  SecondOwnedCoin,
  ThirdOwnedCoin,
  FourthOwnedCoin,
  FifthOwnedCoin,
  PrestigeCount,
  PrestigePointGain,
  Accelerators,
  Multipliers,
  AcceleratorBoosts,
  RuneLevel,
  TranscensionCount,
  TranscendPointGain,
  Challenge1,
  Challenge2,
  Challenge3,
  Challenge4,
  Challenge5,
  ReincarnationCount,
  ReincarnationPointGain,
  Challenge6,
  Challenge7,
  Challenge8,
  AntCrumbs,
  SacCount,
  SacMult,
  RuneFreeLevel,
  Challenge9,
  SpeedBlessing,
  Challenge10,
  AscensionCount,
  Constant,
  Challenge11,
  CampaignTokens,
  AscensionScore,
  Challenge12,
  SpeedSpirit,
  Challenge13,
  Challenge14,
  SingularityCount,
  AddCodesUsed
}

export const groupedAchievements: GroupedAchievementData[] = [
  {
    key: 'firstOwnedCoin',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => getBuildingOwned('coin', CoinBuilding.Workers),
    tiers: [
      { id: AchievementId.FirstOwnedCoinTier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_WORKERS_1' },
      { id: AchievementId.FirstOwnedCoinTier2, pointValue: 10, requirement: 10 },
      {
        id: AchievementId.FirstOwnedCoinTier3,
        pointValue: 15,
        requirement: 100,
        rewards: ['acceleratorPower']
      },
      { id: AchievementId.FirstOwnedCoinTier4, pointValue: 20, requirement: 1000 },
      {
        id: AchievementId.FirstOwnedCoinTier5,
        pointValue: 25,
        requirement: 5000,
        rewards: ['accelerators']
      },
      {
        id: AchievementId.FirstOwnedCoinTier6,
        pointValue: 30,
        requirement: 10000,
        rewards: ['multipliers']
      },
      {
        id: AchievementId.FirstOwnedCoinTier7,
        pointValue: 35,
        requirement: 20000,
        rewards: ['accelBoosts']
      },
      { id: AchievementId.FirstOwnedCoinTier8, pointValue: 40, requirement: 1e5 },
      { id: AchievementId.FirstOwnedCoinTier9, pointValue: 45, requirement: 1e6 },
      {
        id: AchievementId.FirstOwnedCoinTier10,
        pointValue: 50,
        requirement: 1e8,
        steamAchievementId: 'GROUPED_WORKERS_2'
      }
    ]
  },
  {
    key: 'secondOwnedCoin',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => getBuildingOwned('coin', CoinBuilding.Investments),
    tiers: [
      {
        id: AchievementId.SecondOwnedCoinTier1,
        pointValue: 5,
        requirement: 1,
        steamAchievementId: 'GROUPED_INVESTMENTS_1'
      },
      { id: AchievementId.SecondOwnedCoinTier2, pointValue: 10, requirement: 10 },
      {
        id: AchievementId.SecondOwnedCoinTier3,
        pointValue: 15,
        requirement: 100,
        rewards: ['acceleratorPower']
      },
      { id: AchievementId.SecondOwnedCoinTier4, pointValue: 20, requirement: 500 },
      {
        id: AchievementId.SecondOwnedCoinTier5,
        pointValue: 25,
        requirement: 5000,
        rewards: ['accelerators']
      },
      {
        id: AchievementId.SecondOwnedCoinTier6,
        pointValue: 30,
        requirement: 10000,
        rewards: ['multipliers']
      },
      {
        id: AchievementId.SecondOwnedCoinTier7,
        pointValue: 35,
        requirement: 20000,
        rewards: ['accelBoosts']
      },
      { id: AchievementId.SecondOwnedCoinTier8, pointValue: 40, requirement: 1e6 },
      { id: AchievementId.SecondOwnedCoinTier9, pointValue: 45, requirement: 1e8 },
      {
        id: AchievementId.SecondOwnedCoinTier10,
        pointValue: 50,
        requirement: 1e9,
        steamAchievementId: 'GROUPED_INVESTMENTS_2'
      }
    ]
  },
  {
    key: 'thirdOwnedCoin',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => getBuildingOwned('coin', CoinBuilding.Printers),
    tiers: [
      {
        id: AchievementId.ThirdOwnedCoinTier1,
        pointValue: 5,
        requirement: 1,
        steamAchievementId: 'GROUPED_PRINTERS_1'
      },
      { id: AchievementId.ThirdOwnedCoinTier2, pointValue: 10, requirement: 10 },
      {
        id: AchievementId.ThirdOwnedCoinTier3,
        pointValue: 15,
        requirement: 100,
        rewards: ['acceleratorPower']
      },
      { id: AchievementId.ThirdOwnedCoinTier4, pointValue: 20, requirement: 333 },
      {
        id: AchievementId.ThirdOwnedCoinTier5,
        pointValue: 25,
        requirement: 5000,
        rewards: ['accelerators']
      },
      {
        id: AchievementId.ThirdOwnedCoinTier6,
        pointValue: 30,
        requirement: 10000,
        rewards: ['multipliers']
      },
      {
        id: AchievementId.ThirdOwnedCoinTier7,
        pointValue: 35,
        requirement: 20000,
        rewards: ['accelBoosts']
      },
      { id: AchievementId.ThirdOwnedCoinTier8, pointValue: 40, requirement: 1e7 },
      { id: AchievementId.ThirdOwnedCoinTier9, pointValue: 45, requirement: 1e8 },
      {
        id: AchievementId.ThirdOwnedCoinTier10,
        pointValue: 50,
        requirement: 5e9,
        steamAchievementId: 'GROUPED_PRINTERS_2'
      }
    ]
  },
  {
    key: 'fourthOwnedCoin',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => getBuildingOwned('coin', CoinBuilding.CoinMints),
    tiers: [
      { id: AchievementId.FourthOwnedCoinTier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_MINTS_1' },
      { id: AchievementId.FourthOwnedCoinTier2, pointValue: 10, requirement: 10 },
      {
        id: AchievementId.FourthOwnedCoinTier3,
        pointValue: 15,
        requirement: 100,
        rewards: ['acceleratorPower']
      },
      { id: AchievementId.FourthOwnedCoinTier4, pointValue: 20, requirement: 333 },
      {
        id: AchievementId.FourthOwnedCoinTier5,
        pointValue: 25,
        requirement: 5000,
        rewards: ['accelerators']
      },
      {
        id: AchievementId.FourthOwnedCoinTier6,
        pointValue: 30,
        requirement: 10000,
        rewards: ['multipliers']
      },
      {
        id: AchievementId.FourthOwnedCoinTier7,
        pointValue: 35,
        requirement: 20000,
        rewards: ['accelBoosts']
      },
      { id: AchievementId.FourthOwnedCoinTier8, pointValue: 40, requirement: 1e8 },
      { id: AchievementId.FourthOwnedCoinTier9, pointValue: 45, requirement: 1e9 },
      {
        id: AchievementId.FourthOwnedCoinTier10,
        pointValue: 50,
        requirement: 2e10,
        steamAchievementId: 'GROUPED_MINTS_2'
      }
    ]
  },
  {
    key: 'fifthOwnedCoin',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => getBuildingOwned('coin', CoinBuilding.Alchemies),
    tiers: [
      {
        id: AchievementId.FifthOwnedCoinTier1,
        pointValue: 5,
        requirement: 1,
        steamAchievementId: 'GROUPED_ALCHEMIES_1'
      },
      { id: AchievementId.FifthOwnedCoinTier2, pointValue: 10, requirement: 10 },
      {
        id: AchievementId.FifthOwnedCoinTier3,
        pointValue: 15,
        requirement: 66,
        rewards: ['acceleratorPower']
      },
      { id: AchievementId.FifthOwnedCoinTier4, pointValue: 20, requirement: 200 },
      {
        id: AchievementId.FifthOwnedCoinTier5,
        pointValue: 25,
        requirement: 6666,
        rewards: ['accelerators']
      },
      {
        id: AchievementId.FifthOwnedCoinTier6,
        pointValue: 30,
        requirement: 17777,
        rewards: ['multipliers']
      },
      {
        id: AchievementId.FifthOwnedCoinTier7,
        pointValue: 35,
        requirement: 42777,
        rewards: ['accelBoosts']
      },
      { id: AchievementId.FifthOwnedCoinTier8, pointValue: 40, requirement: 1e9 },
      { id: AchievementId.FifthOwnedCoinTier9, pointValue: 45, requirement: 2e10 },
      {
        id: AchievementId.FifthOwnedCoinTier10,
        pointValue: 50,
        requirement: 1e12,
        steamAchievementId: 'GROUPED_ALCHEMIES_2'
      }
    ]
  },
  {
    key: 'prestigeCount',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige),
    getValue: () => player.prestigeCount,
    tiers: [
      { id: AchievementId.PrestigeCountTier1, pointValue: 2, requirement: 1 },
      {
        id: AchievementId.PrestigeCountTier2,
        pointValue: 4,
        requirement: 10,
        rewards: ['prestigeCountMultiplier']
      },
      {
        id: AchievementId.PrestigeCountTier3,
        pointValue: 6,
        requirement: 100,
        rewards: ['duplicationRuneUnlock']
      },
      {
        id: AchievementId.PrestigeCountTier4,
        pointValue: 8,
        requirement: 1_000,
        rewards: ['offeringBonus']
      },
      { id: AchievementId.PrestigeCountTier5, pointValue: 10, requirement: 10_000 },
      { id: AchievementId.PrestigeCountTier6, pointValue: 12, requirement: 100_000 },
      {
        id: AchievementId.PrestigeCountTier7,
        pointValue: 14,
        requirement: 1_000_000,
        rewards: ['transcendToPrestige']
      },
      { id: AchievementId.PrestigeCountTier8, pointValue: 16, requirement: 10_000_000 },
      {
        id: AchievementId.PrestigeCountTier9,
        pointValue: 18,
        requirement: 100_000_000,
        rewards: ['transcensionCountMultiplier']
      },
      { id: AchievementId.PrestigeCountTier10, pointValue: 20, requirement: 1_000_000_000 },
      { id: AchievementId.PrestigeCountTier11, pointValue: 22, requirement: 100_000_000_000 },
      { id: AchievementId.PrestigeCountTier12, pointValue: 24, requirement: 10_000_000_000_000 },
      { id: AchievementId.PrestigeCountTier13, pointValue: 26, requirement: 1e15 },
      { id: AchievementId.PrestigeCountTier14, pointValue: 28, requirement: 1e17 },
      { id: AchievementId.PrestigeCountTier15, pointValue: 30, requirement: 1e20 }
    ]
  },
  {
    key: 'prestigePointGain',
    kind: 'decimal',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige),
    getValue: () => calculatePrestigePointGain(),
    tiers: [
      {
        id: AchievementId.PrestigePointGainTier1,
        pointValue: 5,
        requirement: new Decimal(1),
        steamAchievementId: 'GROUPED_DIAMONDS_1'
      },
      {
        id: AchievementId.PrestigePointGainTier2,
        pointValue: 10,
        requirement: new Decimal(1e6),
        rewards: ['crystalMultiplier']
      },
      { id: AchievementId.PrestigePointGainTier3, pointValue: 15, requirement: new Decimal(1e100) },
      { id: AchievementId.PrestigePointGainTier4, pointValue: 20, requirement: new Decimal('1e1000') },
      { id: AchievementId.PrestigePointGainTier5, pointValue: 25, requirement: new Decimal('1e10000') },
      { id: AchievementId.PrestigePointGainTier6, pointValue: 30, requirement: new Decimal('1e77777') },
      { id: AchievementId.PrestigePointGainTier7, pointValue: 35, requirement: new Decimal('1e250000') },
      { id: AchievementId.PrestigePointGainTier8, pointValue: 40, requirement: new Decimal('1e10000000') },
      { id: AchievementId.PrestigePointGainTier9, pointValue: 45, requirement: new Decimal('1e10000000000') },
      {
        id: AchievementId.PrestigePointGainTier10,
        pointValue: 50,
        requirement: new Decimal('1e10000000000000'),
        steamAchievementId: 'GROUPED_DIAMONDS_2'
      }
    ]
  },
  {
    key: 'accelerators',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => getBuildingOwned('accelerator'),
    tiers: [
      {
        id: AchievementId.AcceleratorsTier1,
        pointValue: 5,
        requirement: 5,
        steamAchievementId: 'GROUPED_ACCELERATOR_1'
      },
      {
        id: AchievementId.AcceleratorsTier2,
        pointValue: 10,
        requirement: 25,
        rewards: ['acceleratorPower']
      },
      { id: AchievementId.AcceleratorsTier3, pointValue: 15, requirement: 100 },
      { id: AchievementId.AcceleratorsTier4, pointValue: 20, requirement: 666, rewards: ['accelerators'] },
      { id: AchievementId.AcceleratorsTier5, pointValue: 25, requirement: 2000, rewards: ['accelerators'] },
      { id: AchievementId.AcceleratorsTier6, pointValue: 30, requirement: 12500, rewards: ['accelerators'] },
      { id: AchievementId.AcceleratorsTier7, pointValue: 35, requirement: 100000, rewards: ['accelerators'] },
      { id: AchievementId.AcceleratorsTier8, pointValue: 40, requirement: 1e6 },
      { id: AchievementId.AcceleratorsTier9, pointValue: 45, requirement: 1e7 },
      {
        id: AchievementId.AcceleratorsTier10,
        pointValue: 50,
        requirement: 1e8,
        steamAchievementId: 'GROUPED_ACCELERATOR_2'
      }
    ]
  },
  {
    key: 'multipliers',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => getBuildingOwned('multiplier'),
    tiers: [
      { id: AchievementId.MultipliersTier1, pointValue: 5, requirement: 2, steamAchievementId: 'GROUPED_MULTIPLIER_1' },
      { id: AchievementId.MultipliersTier2, pointValue: 10, requirement: 20, rewards: ['multipliers'] },
      { id: AchievementId.MultipliersTier3, pointValue: 15, requirement: 100 },
      { id: AchievementId.MultipliersTier4, pointValue: 20, requirement: 500, rewards: ['multipliers'] },
      { id: AchievementId.MultipliersTier5, pointValue: 25, requirement: 2000, rewards: ['multipliers'] },
      { id: AchievementId.MultipliersTier6, pointValue: 30, requirement: 12500, rewards: ['multipliers'] },
      { id: AchievementId.MultipliersTier7, pointValue: 35, requirement: 100000, rewards: ['multipliers'] },
      { id: AchievementId.MultipliersTier8, pointValue: 40, requirement: 3e6 },
      { id: AchievementId.MultipliersTier9, pointValue: 45, requirement: 3e7 },
      {
        id: AchievementId.MultipliersTier10,
        pointValue: 50,
        requirement: 3e8,
        steamAchievementId: 'GROUPED_MULTIPLIER_2'
      }
    ]
  },
  {
    key: 'acceleratorBoosts',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige),
    getValue: () => getBuildingOwned('acceleratorBoost'),
    tiers: [
      {
        id: AchievementId.AcceleratorBoostsTier1,
        pointValue: 5,
        requirement: 2,
        steamAchievementId: 'GROUPED_ACCELERATOR_BOOSTS_1'
      },
      { id: AchievementId.AcceleratorBoostsTier2, pointValue: 10, requirement: 10 },
      { id: AchievementId.AcceleratorBoostsTier3, pointValue: 15, requirement: 50 },
      { id: AchievementId.AcceleratorBoostsTier4, pointValue: 20, requirement: 200 },
      { id: AchievementId.AcceleratorBoostsTier5, pointValue: 25, requirement: 1000 },
      { id: AchievementId.AcceleratorBoostsTier6, pointValue: 30, requirement: 5000 },
      { id: AchievementId.AcceleratorBoostsTier7, pointValue: 35, requirement: 15000 },
      { id: AchievementId.AcceleratorBoostsTier8, pointValue: 40, requirement: 1e5 },
      { id: AchievementId.AcceleratorBoostsTier9, pointValue: 45, requirement: 1e6 },
      {
        id: AchievementId.AcceleratorBoostsTier10,
        pointValue: 50,
        requirement: 1e7,
        steamAchievementId: 'GROUPED_ACCELERATOR_BOOSTS_2'
      }
    ]
  },
  {
    key: 'runeLevel',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.prestige),
    getValue: () => runes.speed.level,
    tiers: [
      { id: AchievementId.RuneLevelTier1, pointValue: 2, requirement: 100 },
      { id: AchievementId.RuneLevelTier2, pointValue: 4, requirement: 250 },
      { id: AchievementId.RuneLevelTier3, pointValue: 6, requirement: 500 },
      { id: AchievementId.RuneLevelTier4, pointValue: 8, requirement: 1000 },
      { id: AchievementId.RuneLevelTier5, pointValue: 10, requirement: 2000 },
      { id: AchievementId.RuneLevelTier6, pointValue: 12, requirement: 5000 },
      { id: AchievementId.RuneLevelTier7, pointValue: 14, requirement: 10000 },
      { id: AchievementId.RuneLevelTier8, pointValue: 16, requirement: 20000 },
      { id: AchievementId.RuneLevelTier9, pointValue: 18, requirement: 50000 },
      { id: AchievementId.RuneLevelTier10, pointValue: 20, requirement: 100000 },
      { id: AchievementId.RuneLevelTier11, pointValue: 22, requirement: 200000 },
      { id: AchievementId.RuneLevelTier12, pointValue: 24, requirement: 300000 },
      { id: AchievementId.RuneLevelTier13, pointValue: 26, requirement: 500000 },
      { id: AchievementId.RuneLevelTier14, pointValue: 28, requirement: 750000 },
      { id: AchievementId.RuneLevelTier15, pointValue: 30, requirement: 1000000 }
    ]
  },
  {
    key: 'transcensionCount',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension),
    getValue: () => player.transcendCount,
    tiers: [
      { id: AchievementId.TranscensionCountTier1, pointValue: 3, requirement: 1 },
      {
        id: AchievementId.TranscensionCountTier2,
        pointValue: 6,
        requirement: 10,
        rewards: ['transcensionCountMultiplier']
      },
      {
        id: AchievementId.TranscensionCountTier3,
        pointValue: 9,
        requirement: 100,
        rewards: ['salvage']
      },
      {
        id: AchievementId.TranscensionCountTier4,
        pointValue: 12,
        requirement: 1_000,
        rewards: ['prismRuneUnlock']
      },
      { id: AchievementId.TranscensionCountTier5, pointValue: 15, requirement: 10_000 },
      { id: AchievementId.TranscensionCountTier6, pointValue: 18, requirement: 100_000 },
      {
        id: AchievementId.TranscensionCountTier7,
        pointValue: 21,
        requirement: 1_000_000,
        rewards: ['reincarnationToTranscend']
      },
      { id: AchievementId.TranscensionCountTier8, pointValue: 24, requirement: 10_000_000 },
      {
        id: AchievementId.TranscensionCountTier9,
        pointValue: 27,
        requirement: 100_000_000,
        rewards: ['reincarnationCountMultiplier']
      },
      { id: AchievementId.TranscensionCountTier10, pointValue: 30, requirement: 1_000_000_000 },
      { id: AchievementId.TranscensionCountTier11, pointValue: 33, requirement: 30_000_000_000 },
      { id: AchievementId.TranscensionCountTier12, pointValue: 36, requirement: 900_000_000_000 },
      { id: AchievementId.TranscensionCountTier13, pointValue: 39, requirement: 27_000_000_000_000 },
      { id: AchievementId.TranscensionCountTier14, pointValue: 42, requirement: 810_000_000_000_000 },
      { id: AchievementId.TranscensionCountTier15, pointValue: 45, requirement: 1e17 }
    ]
  },
  {
    key: 'transcendPointGain',
    kind: 'decimal',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension),
    getValue: () => calculateTranscendPointGain(),
    tiers: [
      {
        id: AchievementId.TranscendPointGainTier1,
        pointValue: 5,
        requirement: new Decimal(1),
        steamAchievementId: 'GROUPED_MYTHOS_1'
      },
      { id: AchievementId.TranscendPointGainTier2, pointValue: 10, requirement: new Decimal(1e6) },
      {
        id: AchievementId.TranscendPointGainTier3,
        pointValue: 15,
        requirement: new Decimal(1e50),
        rewards: ['taxReduction']
      },
      {
        id: AchievementId.TranscendPointGainTier4,
        pointValue: 20,
        requirement: new Decimal(1e308),
        rewards: ['taxReduction']
      },
      {
        id: AchievementId.TranscendPointGainTier5,
        pointValue: 25,
        requirement: new Decimal('1e1500'),
        rewards: ['taxReduction']
      },
      { id: AchievementId.TranscendPointGainTier6, pointValue: 30, requirement: new Decimal('1e25000') },
      { id: AchievementId.TranscendPointGainTier7, pointValue: 35, requirement: new Decimal('1e100000') },
      { id: AchievementId.TranscendPointGainTier8, pointValue: 40, requirement: new Decimal('1e2500000') },
      { id: AchievementId.TranscendPointGainTier9, pointValue: 45, requirement: new Decimal('1e2500000000') },
      {
        id: AchievementId.TranscendPointGainTier10,
        pointValue: 50,
        requirement: new Decimal('1e2500000000000'),
        steamAchievementId: 'GROUPED_MYTHOS_2'
      }
    ]
  },
  {
    key: 'challenge1',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension),
    getValue: () => player.challengecompletions[1],
    tiers: [
      { id: AchievementId.Challenge1Tier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_CHALLENGE1_1' },
      { id: AchievementId.Challenge1Tier2, pointValue: 10, requirement: 3 },
      { id: AchievementId.Challenge1Tier3, pointValue: 15, requirement: 5 },
      { id: AchievementId.Challenge1Tier4, pointValue: 20, requirement: 10 },
      { id: AchievementId.Challenge1Tier5, pointValue: 25, requirement: 20, rewards: ['taxReduction'] },
      { id: AchievementId.Challenge1Tier6, pointValue: 30, requirement: 50 },
      { id: AchievementId.Challenge1Tier7, pointValue: 35, requirement: 75 },
      { id: AchievementId.Challenge1Tier8, pointValue: 40, requirement: 200 },
      { id: AchievementId.Challenge1Tier9, pointValue: 45, requirement: 300 },
      {
        id: AchievementId.Challenge1Tier10,
        pointValue: 50,
        requirement: 400,
        steamAchievementId: 'GROUPED_CHALLENGE1_2'
      }
    ]
  },
  {
    key: 'challenge2',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension),
    getValue: () => player.challengecompletions[2],
    tiers: [
      { id: AchievementId.Challenge2Tier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_CHALLENGE2_1' },
      { id: AchievementId.Challenge2Tier2, pointValue: 10, requirement: 3 },
      { id: AchievementId.Challenge2Tier3, pointValue: 15, requirement: 5 },
      { id: AchievementId.Challenge2Tier4, pointValue: 20, requirement: 10 },
      { id: AchievementId.Challenge2Tier5, pointValue: 25, requirement: 20, rewards: ['taxReduction'] },
      { id: AchievementId.Challenge2Tier6, pointValue: 30, requirement: 50 },
      { id: AchievementId.Challenge2Tier7, pointValue: 35, requirement: 75 },
      { id: AchievementId.Challenge2Tier8, pointValue: 40, requirement: 200 },
      { id: AchievementId.Challenge2Tier9, pointValue: 45, requirement: 300 },
      {
        id: AchievementId.Challenge2Tier10,
        pointValue: 50,
        requirement: 400,
        steamAchievementId: 'GROUPED_CHALLENGE2_2'
      }
    ]
  },
  {
    key: 'challenge3',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension),
    getValue: () => player.challengecompletions[3],
    tiers: [
      { id: AchievementId.Challenge3Tier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_CHALLENGE3_1' },
      { id: AchievementId.Challenge3Tier2, pointValue: 10, requirement: 3 },
      { id: AchievementId.Challenge3Tier3, pointValue: 15, requirement: 5 },
      { id: AchievementId.Challenge3Tier4, pointValue: 20, requirement: 10 },
      { id: AchievementId.Challenge3Tier5, pointValue: 25, requirement: 20, rewards: ['taxReduction'] },
      { id: AchievementId.Challenge3Tier6, pointValue: 30, requirement: 50 },
      { id: AchievementId.Challenge3Tier7, pointValue: 35, requirement: 75 },
      { id: AchievementId.Challenge3Tier8, pointValue: 40, requirement: 200 },
      { id: AchievementId.Challenge3Tier9, pointValue: 45, requirement: 300 },
      {
        id: AchievementId.Challenge3Tier10,
        pointValue: 50,
        requirement: 400,
        steamAchievementId: 'GROUPED_CHALLENGE3_2'
      }
    ]
  },
  {
    key: 'challenge4',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension),
    getValue: () => player.challengecompletions[4],
    tiers: [
      { id: AchievementId.Challenge4Tier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_CHALLENGE4_1' },
      { id: AchievementId.Challenge4Tier2, pointValue: 10, requirement: 3 },
      { id: AchievementId.Challenge4Tier3, pointValue: 15, requirement: 5 },
      { id: AchievementId.Challenge4Tier4, pointValue: 20, requirement: 10 },
      { id: AchievementId.Challenge4Tier5, pointValue: 25, requirement: 20, rewards: ['taxReduction'] },
      { id: AchievementId.Challenge4Tier6, pointValue: 30, requirement: 50 },
      { id: AchievementId.Challenge4Tier7, pointValue: 35, requirement: 75 },
      { id: AchievementId.Challenge4Tier8, pointValue: 40, requirement: 200 },
      { id: AchievementId.Challenge4Tier9, pointValue: 45, requirement: 300 },
      {
        id: AchievementId.Challenge4Tier10,
        pointValue: 50,
        requirement: 400,
        steamAchievementId: 'GROUPED_CHALLENGE4_2'
      }
    ]
  },
  {
    key: 'challenge5',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.transcension),
    getValue: () => player.challengecompletions[5],
    tiers: [
      { id: AchievementId.Challenge5Tier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_CHALLENGE5_1' },
      { id: AchievementId.Challenge5Tier2, pointValue: 10, requirement: 3 },
      { id: AchievementId.Challenge5Tier3, pointValue: 15, requirement: 5 },
      { id: AchievementId.Challenge5Tier4, pointValue: 20, requirement: 10 },
      { id: AchievementId.Challenge5Tier5, pointValue: 25, requirement: 20, rewards: ['taxReduction'] },
      { id: AchievementId.Challenge5Tier6, pointValue: 30, requirement: 50 },
      { id: AchievementId.Challenge5Tier7, pointValue: 35, requirement: 75 },
      { id: AchievementId.Challenge5Tier8, pointValue: 40, requirement: 200 },
      { id: AchievementId.Challenge5Tier9, pointValue: 45, requirement: 300 },
      {
        id: AchievementId.Challenge5Tier10,
        pointValue: 50,
        requirement: 400,
        steamAchievementId: 'GROUPED_CHALLENGE5_2'
      }
    ]
  },
  {
    key: 'reincarnationCount',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.reincarnation),
    getValue: () => player.reincarnationCount,
    tiers: [
      { id: AchievementId.ReincarnationCountTier1, pointValue: 4, requirement: 1 },
      {
        id: AchievementId.ReincarnationCountTier2,
        pointValue: 8,
        requirement: 10,
        rewards: ['reincarnationCountMultiplier', 'obtainiumTimerMultiplier']
      },
      {
        id: AchievementId.ReincarnationCountTier3,
        pointValue: 12,
        requirement: 100,
        rewards: ['obtainiumBonus']
      },
      { id: AchievementId.ReincarnationCountTier4, pointValue: 16, requirement: 1_000 },
      {
        id: AchievementId.ReincarnationCountTier5,
        pointValue: 20,
        requirement: 10_000,
        rewards: ['thriftRuneUnlock']
      },
      { id: AchievementId.ReincarnationCountTier6, pointValue: 24, requirement: 100_000 },
      { id: AchievementId.ReincarnationCountTier7, pointValue: 28, requirement: 1_000_000 },
      { id: AchievementId.ReincarnationCountTier8, pointValue: 32, requirement: 10_000_000 },
      {
        id: AchievementId.ReincarnationCountTier9,
        pointValue: 36,
        requirement: 100_000_000,
        rewards: ['prestigeCountMultiplier', 'ascensionCountMultiplier']
      },
      { id: AchievementId.ReincarnationCountTier10, pointValue: 40, requirement: 1_000_000_000 },
      { id: AchievementId.ReincarnationCountTier11, pointValue: 44, requirement: 8_000_000_000 },
      { id: AchievementId.ReincarnationCountTier12, pointValue: 48, requirement: 100_000_000_000 },
      { id: AchievementId.ReincarnationCountTier13, pointValue: 52, requirement: 1_000_000_000_000 },
      { id: AchievementId.ReincarnationCountTier14, pointValue: 56, requirement: 13_131_313_131_313 },
      { id: AchievementId.ReincarnationCountTier15, pointValue: 60, requirement: 2e14 }
    ]
  },
  {
    key: 'reincarnationPointGain',
    kind: 'decimal',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.reincarnation),
    getValue: () => calculateReincarnationPointGain(),
    tiers: [
      {
        id: AchievementId.ReincarnationPointGainTier1,
        pointValue: 5,
        requirement: new Decimal(1),
        rewards: ['particleGain'],
        steamAchievementId: 'GROUPED_PARTICLES_1'
      },
      { id: AchievementId.ReincarnationPointGainTier2, pointValue: 10, requirement: new Decimal(1e5) },
      { id: AchievementId.ReincarnationPointGainTier3, pointValue: 15, requirement: new Decimal(1e30) },
      { id: AchievementId.ReincarnationPointGainTier4, pointValue: 20, requirement: new Decimal(1e200) },
      { id: AchievementId.ReincarnationPointGainTier5, pointValue: 25, requirement: new Decimal('1e1500') },
      { id: AchievementId.ReincarnationPointGainTier6, pointValue: 30, requirement: new Decimal('1e5000') },
      { id: AchievementId.ReincarnationPointGainTier7, pointValue: 35, requirement: new Decimal('1e7777') },
      { id: AchievementId.ReincarnationPointGainTier8, pointValue: 40, requirement: new Decimal('1e100000') },
      { id: AchievementId.ReincarnationPointGainTier9, pointValue: 45, requirement: new Decimal('1e100000000') },
      {
        id: AchievementId.ReincarnationPointGainTier10,
        pointValue: 50,
        requirement: new Decimal('1e100000000000'),
        steamAchievementId: 'GROUPED_PARTICLES_2'
      }
    ]
  },
  {
    key: 'challenge6',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.reincarnation),
    getValue: () => player.challengecompletions[6],
    tiers: [
      { id: AchievementId.Challenge6Tier1, pointValue: 5, requirement: 1, steamAchievementId: 'GROUPED_CHALLENGE6_1' },
      { id: AchievementId.Challenge6Tier2, pointValue: 10, requirement: 2 },
      { id: AchievementId.Challenge6Tier3, pointValue: 15, requirement: 3 },
      { id: AchievementId.Challenge6Tier4, pointValue: 20, requirement: 5 },
      { id: AchievementId.Challenge6Tier5, pointValue: 25, requirement: 10, rewards: ['taxReduction'] },
      {
        id: AchievementId.Challenge6Tier6,
        pointValue: 30,
        requirement: 15,
        rewards: ['taxReduction']
      },
      { id: AchievementId.Challenge6Tier7, pointValue: 35, requirement: 25 },
      { id: AchievementId.Challenge6Tier8, pointValue: 40, requirement: 40 },
      { id: AchievementId.Challenge6Tier9, pointValue: 45, requirement: 80 },
      {
        id: AchievementId.Challenge6Tier10,
        pointValue: 50,
        requirement: 120,
        steamAchievementId: 'GROUPED_CHALLENGE6_2'
      }
    ]
  },
  {
    key: 'challenge7',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[6] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.challengecompletions[7],
    tiers: [
      {
        id: AchievementId.Challenge7Tier1,
        pointValue: 5,
        requirement: 1,
        rewards: ['diamondUpgrade18'],
        steamAchievementId: 'GROUPED_CHALLENGE7_1'
      },
      { id: AchievementId.Challenge7Tier2, pointValue: 10, requirement: 2 },
      { id: AchievementId.Challenge7Tier3, pointValue: 15, requirement: 3 },
      { id: AchievementId.Challenge7Tier4, pointValue: 20, requirement: 5 },
      { id: AchievementId.Challenge7Tier5, pointValue: 25, requirement: 10, rewards: ['taxReduction'] },
      { id: AchievementId.Challenge7Tier6, pointValue: 30, requirement: 15 },
      { id: AchievementId.Challenge7Tier7, pointValue: 35, requirement: 25, rewards: ['chronosTalisman'] },
      { id: AchievementId.Challenge7Tier8, pointValue: 40, requirement: 40 },
      { id: AchievementId.Challenge7Tier9, pointValue: 45, requirement: 80 },
      {
        id: AchievementId.Challenge7Tier10,
        pointValue: 50,
        requirement: 125,
        steamAchievementId: 'GROUPED_CHALLENGE7_2'
      }
    ]
  },
  {
    key: 'challenge8',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[7] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.challengecompletions[8],
    tiers: [
      {
        id: AchievementId.Challenge8Tier1,
        pointValue: 5,
        requirement: 1,
        rewards: ['diamondUpgrade19'],
        steamAchievementId: 'GROUPED_CHALLENGE8_1'
      },
      { id: AchievementId.Challenge8Tier2, pointValue: 10, requirement: 2 },
      { id: AchievementId.Challenge8Tier3, pointValue: 15, requirement: 3 },
      { id: AchievementId.Challenge8Tier4, pointValue: 20, requirement: 5 },
      { id: AchievementId.Challenge8Tier5, pointValue: 25, requirement: 10, rewards: ['taxReduction'] },
      { id: AchievementId.Challenge8Tier6, pointValue: 30, requirement: 15 },
      { id: AchievementId.Challenge8Tier7, pointValue: 35, requirement: 25, rewards: ['midasTalisman'] },
      { id: AchievementId.Challenge8Tier8, pointValue: 40, requirement: 40 },
      { id: AchievementId.Challenge8Tier9, pointValue: 45, requirement: 80 },
      {
        id: AchievementId.Challenge8Tier10,
        pointValue: 50,
        requirement: 130,
        steamAchievementId: 'GROUPED_CHALLENGE8_2'
      }
    ]
  },
  {
    key: 'antCrumbs',
    kind: 'decimal',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[8] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.ants.crumbsThisSacrifice,
    tiers: [
      {
        id: AchievementId.AntCrumbsTier1,
        pointValue: 5,
        requirement: new Decimal(3),
        rewards: ['antSpeed'],
        steamAchievementId: 'GROUPED_CRUMBS_1'
      },
      { id: AchievementId.AntCrumbsTier2, pointValue: 10, requirement: new Decimal(1e5) },
      {
        id: AchievementId.AntCrumbsTier3,
        pointValue: 15,
        requirement: new Decimal(666666666),
        rewards: ['antSpeed']
      },
      {
        id: AchievementId.AntCrumbsTier4,
        pointValue: 20,
        requirement: new Decimal(1e20),
        rewards: ['antSpeed']
      },
      {
        id: AchievementId.AntCrumbsTier5,
        pointValue: 25,
        requirement: new Decimal(1e40),
        rewards: ['antSpeed', 'antSacrificeUnlock', 'antAutobuyers']
      },
      {
        id: AchievementId.AntCrumbsTier6,
        pointValue: 30,
        requirement: new Decimal('1e250'),
        rewards: ['antSpeed', 'scientiaAutobuy']
      },
      { id: AchievementId.AntCrumbsTier7, pointValue: 35, requirement: new Decimal('1e2500') },
      { id: AchievementId.AntCrumbsTier8, pointValue: 40, requirement: new Decimal('1e25000') },
      { id: AchievementId.AntCrumbsTier9, pointValue: 45, requirement: new Decimal('1e125000') },
      {
        id: AchievementId.AntCrumbsTier10,
        pointValue: 50,
        requirement: new Decimal('1e1000000'),
        steamAchievementId: 'GROUPED_CRUMBS_2'
      }
    ]
  },
  {
    key: 'sacCount',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.ants.antSacrificeCount,
    tiers: [
      { id: AchievementId.SacCountTier1, pointValue: 3, requirement: 1, rewards: ['freeAntUpgrades'] },
      {
        id: AchievementId.SacCountTier2,
        pointValue: 6,
        requirement: 10,
        rewards: ['antSacrificeCountMultiplier', 'hicAutobuy']
      },
      { id: AchievementId.SacCountTier3, pointValue: 9, requirement: 50, rewards: ['autoAntSacrifice'] },
      {
        id: AchievementId.SacCountTier4,
        pointValue: 12,
        requirement: 250,
        rewards: ['antELOAdditiveMultiplier', 'praemoenioAutobuy']
      },
      { id: AchievementId.SacCountTier5, pointValue: 15, requirement: 1250, rewards: ['antELOAdditive'] },
      {
        id: AchievementId.SacCountTier6,
        pointValue: 17,
        requirement: 5000,
        rewards: ['antSpeed2UpgradeImprover', 'phylacteriumAutobuy']
      },
      { id: AchievementId.SacCountTier7, pointValue: 19, requirement: 20000 },
      { id: AchievementId.SacCountTier8, pointValue: 21, requirement: 80000 },
      { id: AchievementId.SacCountTier9, pointValue: 23, requirement: 250000 },
      {
        id: AchievementId.SacCountTier10,
        pointValue: 25,
        requirement: 1000000,
        rewards: ['preserveAnthillCountSingularity']
      },
      { id: AchievementId.SacCountTier11, pointValue: 40, requirement: 3_000_000 },
      {
        id: AchievementId.SacCountTier12,
        pointValue: 45,
        requirement: 10_000_000,
        rewards: ['antSacrificeToReincarnation']
      },
      { id: AchievementId.SacCountTier13, pointValue: 55, requirement: 100_000_000 }
    ]
  },
  {
    key: 'sacMult',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.ants.immortalELO,
    tiers: [
      {
        id: AchievementId.SacMultTier1,
        pointValue: 5,
        requirement: 50,
        extraCondition: () => player.ants.producers[AntProducers.Breeders].purchased > 0,
        rewards: ['antAutobuyers', 'inceptusAutobuy', 'fortunaeAutobuy']
      },
      {
        id: AchievementId.SacMultTier2,
        pointValue: 10,
        requirement: 200,
        extraCondition: () => player.ants.producers[AntProducers.MetaBreeders].purchased > 0,
        rewards: ['antAutobuyers', 'tributumAutobuy']
      },
      {
        id: AchievementId.SacMultTier3,
        pointValue: 15,
        requirement: 500,
        extraCondition: () => player.ants.producers[AntProducers.MegaBreeders].purchased > 0,
        rewards: ['antAutobuyers', 'celeritasAutobuy', 'exploratoremAutobuy']
      },
      {
        id: AchievementId.SacMultTier4,
        pointValue: 20,
        requirement: 1000,
        extraCondition: () => player.ants.producers[AntProducers.Queens].purchased > 0,
        rewards: ['antAutobuyers', 'sacrificiumAutobuy']
      },
      {
        id: AchievementId.SacMultTier5,
        pointValue: 25,
        requirement: 2500,
        extraCondition: () => player.ants.producers[AntProducers.LordRoyals].purchased > 0,
        rewards: ['antAutobuyers']
      },
      {
        id: AchievementId.SacMultTier6,
        pointValue: 30,
        requirement: 20000,
        extraCondition: () => player.ants.producers[AntProducers.Almighties].purchased > 0,
        rewards: ['antAutobuyers']
      },
      {
        id: AchievementId.SacMultTier7,
        pointValue: 35,
        requirement: 100000,
        extraCondition: () => player.ants.producers[AntProducers.Disciples].purchased > 0,
        rewards: ['antAutobuyers']
      },
      { id: AchievementId.SacMultTier8, pointValue: 40, requirement: 400000 },
      { id: AchievementId.SacMultTier9, pointValue: 45, requirement: 1500000 },
      {
        id: AchievementId.SacMultTier10,
        pointValue: 50,
        requirement: 5000000,
        extraCondition: () => player.ants.producers[AntProducers.HolySpirit].purchased > 0,
        rewards: ['antAutobuyers']
      }
    ]
  },
  {
    key: 'runeFreeLevel',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[8] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => runes.speed.freeLevels(),
    tiers: [
      { id: AchievementId.RuneFreeLevelTier1, pointValue: 2, requirement: 10 },
      { id: AchievementId.RuneFreeLevelTier2, pointValue: 4, requirement: 40 },
      { id: AchievementId.RuneFreeLevelTier3, pointValue: 6, requirement: 125 },
      { id: AchievementId.RuneFreeLevelTier4, pointValue: 8, requirement: 250 },
      { id: AchievementId.RuneFreeLevelTier5, pointValue: 10, requirement: 500 },
      { id: AchievementId.RuneFreeLevelTier6, pointValue: 12, requirement: 1000 },
      { id: AchievementId.RuneFreeLevelTier7, pointValue: 14, requirement: 2000 },
      { id: AchievementId.RuneFreeLevelTier8, pointValue: 16, requirement: 4000 },
      { id: AchievementId.RuneFreeLevelTier9, pointValue: 18, requirement: 7500 },
      { id: AchievementId.RuneFreeLevelTier10, pointValue: 20, requirement: 12500 },
      { id: AchievementId.RuneFreeLevelTier11, pointValue: 22, requirement: 25000 },
      { id: AchievementId.RuneFreeLevelTier12, pointValue: 24, requirement: 37500 },
      { id: AchievementId.RuneFreeLevelTier13, pointValue: 26, requirement: 50000 },
      { id: AchievementId.RuneFreeLevelTier14, pointValue: 28, requirement: 75000 },
      { id: AchievementId.RuneFreeLevelTier15, pointValue: 30, requirement: 100000 }
    ]
  },
  {
    key: 'challenge9',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[8] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.challengecompletions[9],
    tiers: [
      {
        id: AchievementId.Challenge9Tier1,
        pointValue: 5,
        requirement: 1,
        rewards: ['diamondUpgrade20'],
        steamAchievementId: 'GROUPED_CHALLENGE9_1'
      },
      { id: AchievementId.Challenge9Tier2, pointValue: 10, requirement: 2, rewards: ['talismanPower'] },
      { id: AchievementId.Challenge9Tier3, pointValue: 15, requirement: 3, rewards: ['talismanPower'] },
      {
        id: AchievementId.Challenge9Tier4,
        pointValue: 20,
        requirement: 5,
        rewards: ['sacrificeMult', 'experientiaAutobuy']
      },
      { id: AchievementId.Challenge9Tier5, pointValue: 25, requirement: 10 },
      { id: AchievementId.Challenge9Tier6, pointValue: 30, requirement: 20 },
      { id: AchievementId.Challenge9Tier7, pointValue: 35, requirement: 25, rewards: ['metaphysicsTalisman'] },
      { id: AchievementId.Challenge9Tier8, pointValue: 40, requirement: 40 },
      { id: AchievementId.Challenge9Tier9, pointValue: 45, requirement: 80 },
      {
        id: AchievementId.Challenge9Tier10,
        pointValue: 50,
        requirement: 135,
        steamAchievementId: 'GROUPED_CHALLENGE9_2'
      }
    ]
  },
  {
    key: 'speedBlessing',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => runeBlessings.speed.level,
    tiers: [
      { id: AchievementId.SpeedBlessingTier1, pointValue: 10, requirement: 20 },
      { id: AchievementId.SpeedBlessingTier2, pointValue: 20, requirement: 40 },
      { id: AchievementId.SpeedBlessingTier3, pointValue: 30, requirement: 80 },
      { id: AchievementId.SpeedBlessingTier4, pointValue: 40, requirement: 200 },
      { id: AchievementId.SpeedBlessingTier5, pointValue: 50, requirement: 400 },
      { id: AchievementId.SpeedBlessingTier6, pointValue: 60, requirement: 800 },
      { id: AchievementId.SpeedBlessingTier7, pointValue: 70, requirement: 1000 },
      { id: AchievementId.SpeedBlessingTier8, pointValue: 80, requirement: 1200 },
      { id: AchievementId.SpeedBlessingTier9, pointValue: 90, requirement: 1500 },
      { id: AchievementId.SpeedBlessingTier10, pointValue: 100, requirement: 2000 }
    ]
  },
  {
    key: 'challenge10',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => player.highestchallengecompletions[9] > 0 || hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.challengecompletions[10],
    tiers: [
      {
        id: AchievementId.Challenge10Tier1,
        pointValue: 5,
        requirement: 1,
        steamAchievementId: 'GROUPED_CHALLENGE10_1'
      },
      { id: AchievementId.Challenge10Tier2, pointValue: 10, requirement: 2 },
      { id: AchievementId.Challenge10Tier3, pointValue: 15, requirement: 3 },
      { id: AchievementId.Challenge10Tier4, pointValue: 20, requirement: 5, rewards: ['talismanPower'] },
      { id: AchievementId.Challenge10Tier5, pointValue: 25, requirement: 10, rewards: ['talismanPower'] },
      { id: AchievementId.Challenge10Tier6, pointValue: 30, requirement: 20 },
      { id: AchievementId.Challenge10Tier7, pointValue: 35, requirement: 25, rewards: ['polymathTalisman'] },
      { id: AchievementId.Challenge10Tier8, pointValue: 40, requirement: 40 },
      { id: AchievementId.Challenge10Tier9, pointValue: 45, requirement: 80 },
      {
        id: AchievementId.Challenge10Tier10,
        pointValue: 50,
        requirement: 140,
        steamAchievementId: 'GROUPED_CHALLENGE10_2'
      }
    ]
  },
  {
    key: 'ascensionCount',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.ascensionCount,
    tiers: [
      { id: AchievementId.AscensionCountTier1, pointValue: 5, requirement: 1, rewards: ['freeAntUpgrades'] },
      {
        id: AchievementId.AscensionCountTier2,
        pointValue: 10,
        requirement: 2,
        rewards: ['preserveAnthillCount', 'antSacrificeCountMultiplier']
      },
      { id: AchievementId.AscensionCountTier3, pointValue: 15, requirement: 10 },
      {
        id: AchievementId.AscensionCountTier4,
        pointValue: 20,
        requirement: 100,
        rewards: ['wowSquareTalisman']
      },
      {
        id: AchievementId.AscensionCountTier5,
        pointValue: 25,
        requirement: 1000,
        rewards: ['ascensionCountMultiplier']
      },
      {
        id: AchievementId.AscensionCountTier6,
        pointValue: 30,
        requirement: 14142,
        rewards: ['ascensionCountAdditive']
      },
      {
        id: AchievementId.AscensionCountTier7,
        pointValue: 35,
        requirement: 141421,
        rewards: ['ascensionCountAdditive', 'wowCubeGain']
      },
      {
        id: AchievementId.AscensionCountTier8,
        pointValue: 40,
        requirement: 1e7,
        rewards: ['ascensionCountMultiplier']
      },
      {
        id: AchievementId.AscensionCountTier9,
        pointValue: 45,
        requirement: 1e8,
        rewards: ['ascensionCountMultiplier']
      },
      { id: AchievementId.AscensionCountTier10, pointValue: 50, requirement: 2e9 },
      { id: AchievementId.AscensionCountTier11, pointValue: 55, requirement: 4e10 },
      { id: AchievementId.AscensionCountTier12, pointValue: 60, requirement: 8e11 },
      { id: AchievementId.AscensionCountTier13, pointValue: 65, requirement: 1.6e13 },
      {
        id: AchievementId.AscensionCountTier14,
        pointValue: 70,
        requirement: 1e14,
        rewards: ['quarkGain']
      },
      { id: AchievementId.AscensionCountTier15, pointValue: 75, requirement: 1e16 },
      { id: AchievementId.AscensionCountTier16, pointValue: 80, requirement: 1e20 },
      { id: AchievementId.AscensionCountTier17, pointValue: 85, requirement: 1e25 },
      { id: AchievementId.AscensionCountTier18, pointValue: 90, requirement: 1e35 },
      { id: AchievementId.AscensionCountTier19, pointValue: 95, requirement: 1e50 },
      { id: AchievementId.AscensionCountTier20, pointValue: 100, requirement: 1e75 }
    ]
  },
  {
    key: 'constant',
    kind: 'decimal',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.ascendShards,
    tiers: [
      { id: AchievementId.ConstantTier1, pointValue: 5, requirement: new Decimal(3.14) },
      { id: AchievementId.ConstantTier2, pointValue: 10, requirement: new Decimal(1e6) },
      { id: AchievementId.ConstantTier3, pointValue: 15, requirement: new Decimal(4.32e10) },
      {
        id: AchievementId.ConstantTier4,
        pointValue: 20,
        requirement: new Decimal(6.9e21),
        rewards: ['wowCubeGain']
      },
      { id: AchievementId.ConstantTier5, pointValue: 25, requirement: new Decimal(1.509e33) },
      {
        id: AchievementId.ConstantTier6,
        pointValue: 30,
        requirement: new Decimal(1e66),
        rewards: ['wowCubeGain', 'wowTesseractGain']
      },
      {
        id: AchievementId.ConstantTier7,
        pointValue: 35,
        requirement: new Decimal('1.8e308'),
        rewards: ['wowPlatonicGain']
      },
      {
        id: AchievementId.ConstantTier8,
        pointValue: 40,
        requirement: new Decimal('1e1000'),
        rewards: ['cubesBanked']
      },
      { id: AchievementId.ConstantTier9, pointValue: 45, requirement: new Decimal('1e5000') },
      { id: AchievementId.ConstantTier10, pointValue: 50, requirement: new Decimal('1e15000') },
      {
        id: AchievementId.ConstantTier11,
        pointValue: 55,
        requirement: new Decimal('1e50000'),
        rewards: ['wowHepteractGain', 'constUpgrade1Buff', 'constUpgrade2Buff']
      },
      {
        id: AchievementId.ConstantTier12,
        pointValue: 60,
        requirement: new Decimal('1e100000'),
        rewards: ['platonicToHypercubes']
      },
      { id: AchievementId.ConstantTier13, pointValue: 65, requirement: new Decimal('1e300000') },
      { id: AchievementId.ConstantTier14, pointValue: 70, requirement: new Decimal('1e1000000') },
      { id: AchievementId.ConstantTier15, pointValue: 75, requirement: new Decimal('1e2000000') },
      { id: AchievementId.ConstantTier16, pointValue: 80, requirement: new Decimal('1e5000000') },
      { id: AchievementId.ConstantTier17, pointValue: 85, requirement: new Decimal('1e10000000') },
      { id: AchievementId.ConstantTier18, pointValue: 90, requirement: new Decimal('1e25000000') },
      { id: AchievementId.ConstantTier19, pointValue: 95, requirement: new Decimal('1e50000000') },
      { id: AchievementId.ConstantTier20, pointValue: 100, requirement: new Decimal('1e100000000') }
    ]
  },
  {
    key: 'challenge11',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.ascension),
    getValue: () => player.challengecompletions[11],
    tiers: [
      {
        id: AchievementId.Challenge11Tier1,
        pointValue: 10,
        requirement: 1,
        rewards: ['statTracker'],
        steamAchievementId: 'GROUPED_CHALLENGE11_1'
      },
      { id: AchievementId.Challenge11Tier2, pointValue: 20, requirement: 2 },
      { id: AchievementId.Challenge11Tier3, pointValue: 30, requirement: 3 },
      { id: AchievementId.Challenge11Tier4, pointValue: 40, requirement: 5 },
      { id: AchievementId.Challenge11Tier5, pointValue: 50, requirement: 10 },
      {
        id: AchievementId.Challenge11Tier6,
        pointValue: 60,
        requirement: 20,
        rewards: ['ascensionCountAdditive']
      },
      { id: AchievementId.Challenge11Tier7, pointValue: 70, requirement: 30, rewards: ['talismanPower'] },
      { id: AchievementId.Challenge11Tier8, pointValue: 80, requirement: 40 },
      { id: AchievementId.Challenge11Tier9, pointValue: 90, requirement: 50 },
      { id: AchievementId.Challenge11Tier10, pointValue: 100, requirement: 60 },
      { id: AchievementId.Challenge11Tier11, pointValue: 110, requirement: 65 },
      {
        id: AchievementId.Challenge11Tier12,
        pointValue: 120,
        requirement: 70,
        steamAchievementId: 'GROUPED_CHALLENGE11_2'
      }
    ]
  },
  {
    key: 'campaignTokens',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () =>
      player.highestchallengecompletions[11] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity),
    getValue: () => campaignTokens,
    tiers: [
      { id: AchievementId.CampaignTokensTier1, pointValue: 5, requirement: 10 },
      { id: AchievementId.CampaignTokensTier2, pointValue: 10, requirement: 20 },
      { id: AchievementId.CampaignTokensTier3, pointValue: 15, requirement: 40 },
      { id: AchievementId.CampaignTokensTier4, pointValue: 20, requirement: 80 },
      { id: AchievementId.CampaignTokensTier5, pointValue: 25, requirement: 160 },
      { id: AchievementId.CampaignTokensTier6, pointValue: 30, requirement: 320 },
      { id: AchievementId.CampaignTokensTier7, pointValue: 35, requirement: 1000 },
      { id: AchievementId.CampaignTokensTier8, pointValue: 40, requirement: 2000 },
      { id: AchievementId.CampaignTokensTier9, pointValue: 45, requirement: 4000 },
      { id: AchievementId.CampaignTokensTier10, pointValue: 50, requirement: 9000 }
    ]
  },
  {
    key: 'ascensionScore',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () =>
      player.highestchallengecompletions[11] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity),
    getValue: () => activeCorruptionLevel(),
    tiers: [
      {
        id: AchievementId.AscensionScoreTier1,
        pointValue: 5,
        requirement: 4,
        steamAchievementId: 'GROUPED_ASCENSIONSCORE_1'
      },
      { id: AchievementId.AscensionScoreTier2, pointValue: 10, requirement: 6 },
      { id: AchievementId.AscensionScoreTier3, pointValue: 15, requirement: 8 },
      { id: AchievementId.AscensionScoreTier4, pointValue: 20, requirement: 10 },
      { id: AchievementId.AscensionScoreTier5, pointValue: 25, requirement: 12 },
      { id: AchievementId.AscensionScoreTier6, pointValue: 30, requirement: 14 },
      { id: AchievementId.AscensionScoreTier7, pointValue: 35, requirement: 16 },
      {
        id: AchievementId.AscensionScoreTier8,
        pointValue: 40,
        requirement: 18,
        rewards: ['wowHypercubeGain']
      },
      { id: AchievementId.AscensionScoreTier9, pointValue: 45, requirement: 20, rewards: ['wowCubeGain'] },
      {
        id: AchievementId.AscensionScoreTier10,
        pointValue: 50,
        requirement: 25,
        rewards: ['wowTesseractGain']
      },
      {
        id: AchievementId.AscensionScoreTier11,
        pointValue: 55,
        requirement: 30,
        rewards: ['wowPlatonicGain', 'overfluxConversionRate']
      },
      {
        id: AchievementId.AscensionScoreTier12,
        pointValue: 60,
        requirement: 35,
        rewards: ['overfluxConversionRate']
      },
      {
        id: AchievementId.AscensionScoreTier13,
        pointValue: 65,
        requirement: 40,
        rewards: ['wowHepteractGain']
      },
      {
        id: AchievementId.AscensionScoreTier14,
        pointValue: 70,
        requirement: 45,
        rewards: ['cubesBanked'],
        steamAchievementId: 'GROUPED_ASCENSIONSCORE_2'
      }
    ]
  },
  {
    key: 'challenge12',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () =>
      player.highestchallengecompletions[11] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity),
    getValue: () => player.challengecompletions[12],
    tiers: [
      {
        id: AchievementId.Challenge12Tier1,
        pointValue: 10,
        requirement: 1,
        rewards: ['ascensionRewardScaling'],
        steamAchievementId: 'GROUPED_CHALLENGE12_1'
      },
      { id: AchievementId.Challenge12Tier2, pointValue: 20, requirement: 2 },
      { id: AchievementId.Challenge12Tier3, pointValue: 30, requirement: 3 },
      { id: AchievementId.Challenge12Tier4, pointValue: 40, requirement: 5 },
      { id: AchievementId.Challenge12Tier5, pointValue: 50, requirement: 10 },
      {
        id: AchievementId.Challenge12Tier6,
        pointValue: 60,
        requirement: 20,
        rewards: ['ascensionCountAdditive']
      },
      { id: AchievementId.Challenge12Tier7, pointValue: 70, requirement: 30, rewards: ['talismanPower'] },
      { id: AchievementId.Challenge12Tier8, pointValue: 80, requirement: 40 },
      { id: AchievementId.Challenge12Tier9, pointValue: 90, requirement: 50 },
      { id: AchievementId.Challenge12Tier10, pointValue: 100, requirement: 60 },
      { id: AchievementId.Challenge12Tier11, pointValue: 110, requirement: 65 },
      {
        id: AchievementId.Challenge12Tier12,
        pointValue: 120,
        requirement: 70,
        steamAchievementId: 'GROUPED_CHALLENGE12_2'
      }
    ]
  },
  {
    key: 'speedSpirit',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () =>
      player.highestchallengecompletions[12] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity),
    getValue: () => runeSpirits.speed.level,
    tiers: [
      { id: AchievementId.SpeedSpiritTier1, pointValue: 10, requirement: 20 },
      { id: AchievementId.SpeedSpiritTier2, pointValue: 20, requirement: 40 },
      { id: AchievementId.SpeedSpiritTier3, pointValue: 30, requirement: 80 },
      { id: AchievementId.SpeedSpiritTier4, pointValue: 40, requirement: 160 },
      { id: AchievementId.SpeedSpiritTier5, pointValue: 50, requirement: 320 },
      { id: AchievementId.SpeedSpiritTier6, pointValue: 60, requirement: 640 },
      { id: AchievementId.SpeedSpiritTier7, pointValue: 70, requirement: 960 },
      { id: AchievementId.SpeedSpiritTier8, pointValue: 80, requirement: 1280 },
      { id: AchievementId.SpeedSpiritTier9, pointValue: 90, requirement: 1600 },
      { id: AchievementId.SpeedSpiritTier10, pointValue: 100, requirement: 2000 }
    ]
  },
  {
    key: 'challenge13',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () =>
      player.highestchallengecompletions[12] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity),
    getValue: () => player.challengecompletions[13],
    tiers: [
      {
        id: AchievementId.Challenge13Tier1,
        pointValue: 10,
        requirement: 1,
        steamAchievementId: 'GROUPED_CHALLENGE13_1'
      },
      { id: AchievementId.Challenge13Tier2, pointValue: 20, requirement: 2 },
      { id: AchievementId.Challenge13Tier3, pointValue: 30, requirement: 3 },
      { id: AchievementId.Challenge13Tier4, pointValue: 40, requirement: 5 },
      { id: AchievementId.Challenge13Tier5, pointValue: 50, requirement: 10 },
      {
        id: AchievementId.Challenge13Tier6,
        pointValue: 60,
        requirement: 20,
        rewards: ['ascensionCountAdditive']
      },
      { id: AchievementId.Challenge13Tier7, pointValue: 70, requirement: 30, rewards: ['talismanPower'] },
      { id: AchievementId.Challenge13Tier8, pointValue: 80, requirement: 40 },
      { id: AchievementId.Challenge13Tier9, pointValue: 90, requirement: 50 },
      { id: AchievementId.Challenge13Tier10, pointValue: 100, requirement: 60 },
      { id: AchievementId.Challenge13Tier11, pointValue: 110, requirement: 70 },
      {
        id: AchievementId.Challenge13Tier12,
        pointValue: 120,
        requirement: 72,
        steamAchievementId: 'GROUPED_CHALLENGE13_2'
      }
    ]
  },
  {
    key: 'challenge14',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () =>
      player.highestchallengecompletions[13] > 0 || hasResetAtOrAboveLevel(resetTiers.singularity),
    getValue: () => player.challengecompletions[14],
    tiers: [
      {
        id: AchievementId.Challenge14Tier1,
        pointValue: 10,
        requirement: 1,
        steamAchievementId: 'GROUPED_CHALLENGE14_1'
      },
      { id: AchievementId.Challenge14Tier2, pointValue: 20, requirement: 2 },
      { id: AchievementId.Challenge14Tier3, pointValue: 30, requirement: 3 },
      { id: AchievementId.Challenge14Tier4, pointValue: 40, requirement: 5 },
      { id: AchievementId.Challenge14Tier5, pointValue: 50, requirement: 10 },
      {
        id: AchievementId.Challenge14Tier6,
        pointValue: 60,
        requirement: 20,
        rewards: ['ascensionCountAdditive', 'wowPlatonicGain']
      },
      { id: AchievementId.Challenge14Tier7, pointValue: 70, requirement: 30 },
      { id: AchievementId.Challenge14Tier8, pointValue: 80, requirement: 40 },
      { id: AchievementId.Challenge14Tier9, pointValue: 90, requirement: 50 },
      { id: AchievementId.Challenge14Tier10, pointValue: 100, requirement: 60 },
      { id: AchievementId.Challenge14Tier11, pointValue: 110, requirement: 70 },
      {
        id: AchievementId.Challenge14Tier12,
        pointValue: 120,
        requirement: 72,
        steamAchievementId: 'GROUPED_CHALLENGE14_2'
      }
    ]
  },
  {
    key: 'singularityCount',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => hasResetAtOrAboveLevel(resetTiers.singularity),
    getValue: () => player.highestSingularityCount,
    tiers: [
      {
        id: AchievementId.SingularityCountTier1,
        pointValue: 10,
        requirement: 1,
        steamAchievementId: 'GROUPED_SINGULARITY_1'
      },
      { id: AchievementId.SingularityCountTier2, pointValue: 20, requirement: 2 },
      { id: AchievementId.SingularityCountTier3, pointValue: 30, requirement: 3 },
      { id: AchievementId.SingularityCountTier4, pointValue: 40, requirement: 4 },
      { id: AchievementId.SingularityCountTier5, pointValue: 50, requirement: 5 },
      { id: AchievementId.SingularityCountTier6, pointValue: 60, requirement: 7 },
      {
        id: AchievementId.SingularityCountTier7,
        pointValue: 70,
        requirement: 10,
        steamAchievementId: 'GROUPED_SINGULARITY_2'
      }
    ]
  },
  {
    key: 'addCodesUsed',
    kind: 'number',
    firstLockedTier: 0,
    displayCondition: () => true,
    getValue: () => player.stats.totalAddCodesUsed,
    tiers: [
      { id: AchievementId.AddCodesUsedTier1, pointValue: 3, requirement: 10 },
      { id: AchievementId.AddCodesUsedTier2, pointValue: 6, requirement: 20 },
      { id: AchievementId.AddCodesUsedTier3, pointValue: 9, requirement: 50 },
      { id: AchievementId.AddCodesUsedTier4, pointValue: 12, requirement: 100 },
      { id: AchievementId.AddCodesUsedTier5, pointValue: 15, requirement: 200 },
      { id: AchievementId.AddCodesUsedTier6, pointValue: 18, requirement: 300 },
      { id: AchievementId.AddCodesUsedTier7, pointValue: 21, requirement: 500 },
      { id: AchievementId.AddCodesUsedTier8, pointValue: 24, requirement: 750 },
      { id: AchievementId.AddCodesUsedTier9, pointValue: 27, requirement: 1000 },
      { id: AchievementId.AddCodesUsedTier10, pointValue: 30, requirement: 2000 },
      { id: AchievementId.AddCodesUsedTier11, pointValue: 33, requirement: 3000 },
      { id: AchievementId.AddCodesUsedTier12, pointValue: 36, requirement: 5000 },
      { id: AchievementId.AddCodesUsedTier13, pointValue: 39, requirement: 6000 },
      { id: AchievementId.AddCodesUsedTier14, pointValue: 42, requirement: 7500 },
      { id: AchievementId.AddCodesUsedTier15, pointValue: 45, requirement: 10000 }
    ]
  }
]

export enum UngroupedAchievement {
  ParticipationTrophy,
  PrestigeNoMult,
  PrestigeNoAccelerator,
  TranscendNoMult,
  TranscendNoAccelerator,
  ReincarnationNoMult,
  ReincarnationNoAccelerator,
  DiamondSearch,
  PrestigeNoCoinUpgrade,
  TranscendNoCoinUpgrade,
  TranscendNoCoinDiamondUpgrade,
  ReincarnationNoCoinUpgrade,
  ReincarnationNoCoinDiamondUpgrade,
  ReincarnationNoCoinDiamondMythosUpgrade,
  ReincarnationMinimumUpgrades,
  GenerationAch1,
  GenerationAch2,
  GenerationAch3,
  GenerationAch4,
  Chal1NoGen,
  Chal2NoGen,
  Chal3NoGen,
  MetaChallenged,
  SeeingRed,
  Ascended,
  VerySlow,
  VeryFast,
  Unsmith,
  Smith,
  HighlyBlessed,
  OneCubeOfMany,
  ExtraChallenging,
  SeeingRedNoBlue,
  Overtaxed,
  ThousandSuns,
  ThousandMoons,
  SadisticAch
}

export const ungroupedAchievements: UngroupedAchievementData[] = [
  {
    key: 'participationTrophy',
    id: AchievementId.ParticipationTrophy,
    pointValue: 5,
    unlockCondition: () => true,
    displayCondition: () => true
  },
  {
    key: 'prestigeNoMult',
    id: AchievementId.PrestigeNoMult,
    pointValue: 5,
    unlockCondition: () => player.prestigenomultiplier,
    displayCondition: () => player.prestigeCount > 0,
    rewards: ['multipliers']
  },
  {
    key: 'prestigeNoAccelerator',
    id: AchievementId.PrestigeNoAccelerator,
    pointValue: 20,
    unlockCondition: () => player.prestigenoaccelerator,
    displayCondition: () => player.prestigeCount > 0,
    rewards: ['accelerators']
  },
  {
    key: 'transcendNoMult',
    id: AchievementId.TranscendNoMult,
    pointValue: 10,
    unlockCondition: () => player.transcendnomultiplier,
    displayCondition: () => player.transcendCount > 0,
    rewards: ['multipliers']
  },
  {
    key: 'transcendNoAccelerator',
    id: AchievementId.TranscendNoAccelerator,
    pointValue: 25,
    unlockCondition: () => player.transcendnoaccelerator,
    displayCondition: () => player.transcendCount > 0,
    rewards: ['accelerators']
  },
  {
    key: 'reincarnationNoMult',
    id: AchievementId.ReincarnationNoMult,
    pointValue: 15,
    unlockCondition: () => player.reincarnatenomultiplier,
    displayCondition: () => player.reincarnationCount > 0,
    rewards: ['multipliers']
  },
  {
    key: 'reincarnationNoAccelerator',
    id: AchievementId.ReincarnationNoAccelerator,
    pointValue: 30,
    unlockCondition: () => player.reincarnatenoaccelerator,
    displayCondition: () => player.reincarnationCount > 0,
    rewards: ['accelerators']
  },
  {
    key: 'diamondSearch',
    id: AchievementId.DiamondSearch,
    pointValue: 35,
    unlockCondition: () => {
      return getBuildingOwned('accelerator') === 0 && getBuildingOwned('acceleratorBoost') === 0
        && player.coinsThisTranscension.gte(G.d1e120000)
    },
    displayCondition: () => player.transcendCount > 0
  },
  {
    key: 'prestigeNoCoinUpgrade',
    id: AchievementId.PrestigeNoCoinUpgrade,
    pointValue: 5,
    unlockCondition: () => player.prestigenocoinupgrades,
    displayCondition: () => player.prestigeCount > 0
  },
  {
    key: 'transcendNoCoinUpgrade',
    id: AchievementId.TranscendNoCoinUpgrade,
    pointValue: 10,
    unlockCondition: () => player.transcendnocoinupgrades,
    displayCondition: () => player.transcendCount > 0
  },
  {
    key: 'transcendNoCoinDiamondUpgrade',
    id: AchievementId.TranscendNoCoinDiamondUpgrade,
    pointValue: 15,
    unlockCondition: () => player.transcendnocoinorprestigeupgrades,
    displayCondition: () => player.transcendCount > 0
  },
  {
    key: 'reincarnationNoCoinUpgrade',
    id: AchievementId.ReincarnationNoCoinUpgrade,
    pointValue: 15,
    unlockCondition: () => player.reincarnatenocoinupgrades,
    displayCondition: () => player.reincarnationCount > 0
  },
  {
    key: 'reincarnationNoCoinDiamondUpgrade',
    id: AchievementId.ReincarnationNoCoinDiamondUpgrade,
    pointValue: 20,
    unlockCondition: () => player.reincarnatenocoinorprestigeupgrades,
    displayCondition: () => player.reincarnationCount > 0
  },
  {
    key: 'reincarnationNoCoinDiamondMythosUpgrade',
    id: AchievementId.ReincarnationNoCoinDiamondMythosUpgrade,
    pointValue: 30,
    unlockCondition: () => player.reincarnatenocoinprestigeortranscendupgrades,
    displayCondition: () => player.reincarnationCount > 0
  },
  {
    key: 'reincarnationMinimumUpgrades',
    id: AchievementId.ReincarnationMinimumUpgrades,
    pointValue: 40,
    unlockCondition: () => player.reincarnatenocoinprestigetranscendorgeneratorupgrades,
    displayCondition: () => player.reincarnationCount > 0
  },
  {
    key: 'generationAch1',
    id: AchievementId.GenerationAch1,
    pointValue: 10,
    unlockCondition: () => {
      return player.upgrades[102] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    displayCondition: () => player.prestigeCount > 0,
    rewards: ['conversionExponent']
  },
  {
    key: 'generationAch2',
    id: AchievementId.GenerationAch2,
    pointValue: 10,
    unlockCondition: () => {
      return player.upgrades[103] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    displayCondition: () => player.prestigeCount > 0,
    rewards: ['conversionExponent']
  },
  {
    key: 'generationAch3',
    id: AchievementId.GenerationAch3,
    pointValue: 15,
    unlockCondition: () => {
      return player.upgrades[104] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    displayCondition: () => player.prestigeCount > 0,
    rewards: ['conversionExponent']
  },
  {
    key: 'generationAch4',
    id: AchievementId.GenerationAch4,
    pointValue: 20,
    unlockCondition: () => {
      return player.upgrades[105] === 1 && sumContents(player.upgrades.slice(101, 106)) === 1
    },
    displayCondition: () => player.prestigeCount > 0,
    rewards: ['conversionExponent']
  },
  {
    key: 'chal1NoGen',
    id: AchievementId.Chal1NoGen,
    pointValue: 25,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 1 && player.coinsThisTranscension.gte(G.d1e1000)
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    displayCondition: () => player.transcendCount > 0,
    rewards: ['conversionExponent']
  },
  {
    key: 'chal2NoGen',
    id: AchievementId.Chal2NoGen,
    pointValue: 25,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 2 && player.coinsThisTranscension.gte(G.d1e1000)
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    displayCondition: () => player.transcendCount > 0,
    rewards: ['conversionExponent']
  },
  {
    key: 'chal3NoGen',
    id: AchievementId.Chal3NoGen,
    pointValue: 50,
    unlockCondition: () => {
      return player.currentChallenge.transcension === 3 && player.coinsThisTranscension.gte(G.d1e99999)
        && sumContents(player.upgrades.slice(101, 106)) === 0
    },
    displayCondition: () => player.transcendCount > 0,
    rewards: ['conversionExponent']
  },
  {
    key: 'metaChallenged',
    id: AchievementId.MetaChallenged,
    pointValue: 50,
    unlockCondition: () => {
      return player.currentChallenge.transcension !== 0 && player.currentChallenge.reincarnation !== 0
        && player.currentChallenge.ascension !== 0
    },
    displayCondition: () => player.ascensionCount > 0
  },
  {
    key: 'seeingRed',
    id: AchievementId.SeeingRed,
    pointValue: 50,
    unlockCondition: () => player.mythicalFragments.gte(G.d1e25),
    displayCondition: () => player.unlocks.talismans
  },
  {
    key: 'ascended',
    id: AchievementId.Ascended,
    pointValue: 50,
    unlockCondition: () => player.ascensionCount >= 1414213,
    displayCondition: () => player.challengecompletions[14] > 0
  },
  {
    key: 'verySlow',
    id: AchievementId.VerySlow,
    pointValue: 50,
    unlockCondition: () => true,
    displayCondition: () => player.challengecompletions[12] > 0
  },
  {
    key: 'veryFast',
    id: AchievementId.VeryFast,
    pointValue: 50,
    unlockCondition: () => true,
    displayCondition: () => player.challengecompletions[12] > 0
  },
  {
    key: 'unsmith',
    id: AchievementId.Unsmith,
    pointValue: 5,
    unlockCondition: () => true,
    displayCondition: () => true
  },
  {
    key: 'smith',
    id: AchievementId.Smith,
    pointValue: 5,
    unlockCondition: () => true,
    displayCondition: () => true
  },
  {
    key: 'highlyBlessed',
    id: AchievementId.HighlyBlessed,
    pointValue: 50,
    unlockCondition: () => runeBlessings.speed.level >= 380,
    displayCondition: () => player.unlocks.blessings
  },
  {
    key: 'oneCubeOfMany',
    id: AchievementId.OneCubeOfMany,
    pointValue: 50,
    unlockCondition: () => true,
    displayCondition: () => player.ascensionCount > 0
  },
  {
    key: 'extraChallenging',
    id: AchievementId.ExtraChallenging,
    pointValue: 50,
    unlockCondition: () => true,
    displayCondition: () => player.challengecompletions[11] >= 20
  },
  {
    key: 'seeingRedNoBlue',
    id: AchievementId.SeeingRedNoBlue,
    pointValue: 50,
    unlockCondition: () => true,
    displayCondition: () => player.challengecompletions[14] > 0
  },
  {
    key: 'overtaxed',
    id: AchievementId.Overtaxed,
    pointValue: 50,
    unlockCondition: () => true,
    displayCondition: () => player.challengecompletions[12] > 0
  },
  {
    key: 'thousandSuns',
    id: AchievementId.ThousandSuns,
    pointValue: 100,
    unlockCondition: () => player.researches[200] === 1e5,
    displayCondition: () => player.challengecompletions[14] > 0,
    rewards: ['quarkGain']
  },
  {
    key: 'thousandMoons',
    id: AchievementId.ThousandMoons,
    pointValue: 150,
    unlockCondition: () => player.cubeUpgrades[50] === 1e5,
    displayCondition: () => player.challengecompletions[14] > 0,
    rewards: ['quarkGain']
  },
  {
    key: 'sadisticAch',
    id: AchievementId.SadisticAch,
    pointValue: 50,
    unlockCondition: () => G.challenge15Rewards.achievementUnlock.value === 1,
    displayCondition: () => player.challengecompletions[14] > 0
  }
]

const capitalize = (key: string) => key.charAt(0).toUpperCase() + key.slice(1)

const allAchievements: AchievementBase[] = [
  ...groupedAchievements.flatMap((group): AchievementBase[] => group.tiers),
  ...ungroupedAchievements
]

export const numAchievements = allAchievements.length
export const maxAchievementPoints = allAchievements.reduce((sum, ach) => sum + ach.pointValue, 0)
  + Object.values(progressiveAchievements)
    .reduce((sum, ach) => sum + (ach.maxPointValue !== -1 ? ach.maxPointValue : 0), 0)

const groupedAchievementMaxAP = groupedAchievements.map((group) =>
  group.tiers.reduce((sum, tier) => sum + tier.pointValue, 0)
)

export const groupedAchievementElementIds = groupedAchievements.map((group) =>
  `achievementGroup${capitalize(group.key)}`
)
export const ungroupedAchievementElementIds = ungroupedAchievements.map((ach) =>
  `ungroupedAchievement${capitalize(ach.key)}`
)
export const progressiveAchievementElementIds = Object.fromEntries(
  progressiveAchievementKeys.map((k) => [k, `progressiveAchievement${capitalize(k)}`])
) as Record<ProgressiveAchievements, string>

const validateEnumOrder = (enumName: string, members: Record<number, string>, entries: { key: string }[]) => {
  for (let i = 0; i < entries.length; i++) {
    if (members[i] !== capitalize(entries[i].key)) {
      throw new Error(`${enumName}.${members[i]} does not match entry ${entries[i].key} at index ${i}`)
    }
  }
  if (members[entries.length] !== undefined) {
    throw new Error(`${enumName}.${members[entries.length]} has no matching entry`)
  }
}

const hasAscendingRequirements = (group: GroupedAchievementData) =>
  group.kind === 'number'
    ? group.tiers.every((tier, i) => i === 0 || tier.requirement >= group.tiers[i - 1].requirement)
    : group.tiers.every((tier, i) => i === 0 || tier.requirement.gte(group.tiers[i - 1].requirement))

const validateAchievements = () => {
  const seen: boolean[] = []
  for (const ach of allAchievements) {
    if (seen[ach.id]) {
      throw new Error(`Achievement ${AchievementId[ach.id]} is defined more than once`)
    }
    seen[ach.id] = true
  }
  for (const id of Object.values(AchievementId)) {
    if (typeof id === 'number' && !seen[id]) {
      throw new Error(`Achievement ${AchievementId[id]} is not defined`)
    }
  }
  for (const group of groupedAchievements) {
    if (!hasAscendingRequirements(group)) {
      throw new Error(`Achievement group ${group.key} has requirements out of order`)
    }
  }
  validateEnumOrder('AchievementGroup', AchievementGroup, groupedAchievements)
  validateEnumOrder('UngroupedAchievement', UngroupedAchievement, ungroupedAchievements)
}

if (DEV) {
  validateAchievements()
}

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
      + player.achievements[AchievementId.SecondOwnedCoinTier5]
        * Math.floor(coinBuildings[CoinBuilding.Investments] / 500)
      + player.achievements[AchievementId.ThirdOwnedCoinTier5] * Math.floor(coinBuildings[CoinBuilding.Printers] / 500)
      + player.achievements[AchievementId.FourthOwnedCoinTier5]
        * Math.floor(coinBuildings[CoinBuilding.CoinMints] / 500)
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
      + player.achievements[AchievementId.SecondOwnedCoinTier6]
        * Math.floor(coinBuildings[CoinBuilding.Investments] / 1000)
      + player.achievements[AchievementId.ThirdOwnedCoinTier6] * Math.floor(coinBuildings[CoinBuilding.Printers] / 1000)
      + player.achievements[AchievementId.FourthOwnedCoinTier6]
        * Math.floor(coinBuildings[CoinBuilding.CoinMints] / 1000)
      + player.achievements[AchievementId.FifthOwnedCoinTier6]
        * Math.floor(coinBuildings[CoinBuilding.Alchemies] / 1000)
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
      + player.achievements[AchievementId.SecondOwnedCoinTier7]
        * Math.floor(coinBuildings[CoinBuilding.Investments] / 2000)
      + player.achievements[AchievementId.ThirdOwnedCoinTier7] * Math.floor(coinBuildings[CoinBuilding.Printers] / 2000)
      + player.achievements[AchievementId.FourthOwnedCoinTier7]
        * Math.floor(coinBuildings[CoinBuilding.CoinMints] / 2000)
      + player.achievements[AchievementId.FifthOwnedCoinTier7]
        * Math.floor(coinBuildings[CoinBuilding.Alchemies] / 2000)
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

const sumEarnedAchievementPoints = (earned: number[]) => {
  let points = 0
  for (const ach of allAchievements) {
    if (earned[ach.id]) {
      points += ach.pointValue
    }
  }
  return points
}

export const updateAchievementPoints = (sourcedFromUpdate = false) => {
  achievementPoints = sumEarnedAchievementPoints(player.achievements)
  refreshGroupFirstLockedTiers()

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

    for (const ach of allAchievements) {
      if (ach.steamAchievementId && player.achievements[ach.id] === 1) {
        unlockPromises.push(unlockSteamAchievement(ach.steamAchievementId))
      }
    }

    await Promise.all(unlockPromises)
  }
}

const grantAchievement = (ach: AchievementBase) => {
  player.achievements[ach.id] = 1
  achievementPoints += ach.pointValue
  updateAchievementLevel()
  if (player.toggles[34]) {
    const description = i18next.t(`achievements.descriptions.${ach.id}`)
    // on mobile, notifications take up a decent amount of space, so show them for a shorter period of time
    void Notification(
      i18next.t('achievements.notification', { m: description }),
      isMobile ? 5000 : undefined
    )
  }
  player.worlds.add(getAchievementQuarks(), false, true)
  revealStuff()

  if (ach.steamAchievementId) {
    void unlockSteamAchievement(ach.steamAchievementId)
  }
}

const meetsNumberRequirement = (value: number, requirement: number) => value >= requirement
const meetsDecimalRequirement = (value: Decimal, requirement: Decimal) => value.gte(requirement)

const refreshGroupFirstLockedTiers = () => {
  for (const group of groupedAchievements) {
    let tier = 0
    while (tier < group.tiers.length && player.achievements[group.tiers[tier].id] === 1) {
      tier++
    }
    group.firstLockedTier = tier
  }
}

const awardTiers = <T>(
  group: GroupedAchievementOf<string, T>,
  meetsRequirement: (value: T, requirement: T) => boolean
) => {
  const tiers = group.tiers
  let tier = group.firstLockedTier
  if (tier === tiers.length) {
    return false
  }

  const value = group.getValue()
  let awarded = false
  for (; tier < tiers.length; tier++) {
    const data = tiers[tier]
    if (player.achievements[data.id] === 1) {
      continue
    }
    if (!meetsRequirement(value, data.requirement) || (data.extraCondition && !data.extraCondition())) {
      break
    }
    grantAchievement(data)
    awarded = true
  }
  group.firstLockedTier = tier
  return awarded
}

export const awardAchievementGroup = (group: AchievementGroup) => {
  const data = groupedAchievements[group]
  const awarded = data.kind === 'number'
    ? awardTiers(data, meetsNumberRequirement)
    : awardTiers(data, meetsDecimalRequirement)

  if (awarded && G.currentTab === Tabs.Achievements) {
    updateGroupedAchievementProgress(group)
  }
}

export const awardUngroupedAchievement = (ungrouped: UngroupedAchievement) => {
  const ach = ungroupedAchievements[ungrouped]
  if (player.achievements[ach.id] === 1) {
    return
  }
  if (ach.unlockCondition()) {
    grantAchievement(ach)
    if (G.currentTab === Tabs.Achievements) {
      updateUngroupedAchievementProgress(ungrouped)
    }
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
  let points = sumEarnedAchievementPoints(savedAchievements)

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

const createGroupedAchievementDescription = (group: AchievementGroup) => {
  const tiers = groupedAchievements[group].tiers
  let groupName = i18next.t(`achievements.groupNames.${groupedAchievements[group].key}`)
  let achTier = 0
  let currTier = 0
  let extraBonuses = ''
  let earnedAP = 0
  for (const tier of tiers) {
    const hasAch = player.achievements[tier.id]
    if (hasAch) {
      achTier += 1
      earnedAP += tier.pointValue
    }

    if (tier.rewards) {
      if (extraBonuses === '') {
        extraBonuses += `${i18next.t('achievements.tieredExtraRewards')} <br>`
      }
      for (const reward of tier.rewards) {
        extraBonuses += `<span style="color:${hasAch ? 'green' : 'crimson'}">Tier ${currTier + 1} • ${
          i18next.t(`achievements.achievementRewards.${tier.id}.${reward}`)
        }</span><br>`
      }
    }

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

  const focusedTier = tiers[Math.min(achTier, currTier - 1)]
  let tierText = i18next.t(`achievements.descriptions.${focusedTier.id}`)
  if (achTier < currTier) {
    tierText += ` [+${focusedTier.pointValue} AP]`
  }

  const finalText = `${groupName}<br>
  ${earnedAP}/${groupedAchievementMaxAP[group]} AP<br>
  ${tierText}<br>
  ${extraBonuses}`
  return finalText
}

const generateUngroupedDescription = (ungrouped: UngroupedAchievement) => {
  const ach = ungroupedAchievements[ungrouped]
  const achText = i18next.t(`achievements.descriptions.${ach.id}`)
  let trimmedRequirement = achText

  const value = ach.pointValue
  let earnedValue = 0

  const hasAch = player.achievements[ach.id] === 1
  if (hasAch) {
    trimmedRequirement = `<span class='rainbowText'>COMPLETE!</span><br>${trimmedRequirement}`
    earnedValue = value
  } else {
    trimmedRequirement += ` [+${ach.pointValue} AP]`
  }

  let extraText = ''
  if (ach.rewards) {
    extraText = `${i18next.t('achievements.ungroupedExtraRewards')}<br>`
    for (const reward of ach.rewards) {
      extraText += `<span style="color:${hasAch ? 'green' : 'maroon'}">${
        i18next.t(`achievements.achievementRewards.${ach.id}.${reward}`)
      }</span><br>`
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

  for (let group = 0; group < groupedAchievements.length; group++) {
    const key = groupedAchievements[group].key

    const div = document.createElement('div')
    div.className = 'tieredAchievementType'

    const img = document.createElement('img')
    img.id = groupedAchievementElementIds[group]
    img.src = `Pictures/Achievements/Grouped/${capitalize(key)}.png`
    img.alt = i18next.t(`achievements.groupNames.${key}`)
    img.style.cursor = 'pointer'
    img.tabIndex = 0

    registerAchievementModal(img, createGroupedAchievementDescription.bind(null, group), 'cyan')

    div.appendChild(img)
    table.appendChild(div)
  }

  for (let ungrouped = 0; ungrouped < ungroupedAchievements.length; ungrouped++) {
    const div = document.createElement('div')
    div.className = 'ungroupedAchievementType'

    const img = document.createElement('img')
    img.id = ungroupedAchievementElementIds[ungrouped]
    img.src = `Pictures/Achievements/Ungrouped/${capitalize(ungroupedAchievements[ungrouped].key)}.png`
    img.alt = ''
    img.style.cursor = 'pointer'
    img.tabIndex = 0

    registerAchievementModal(img, () => generateUngroupedDescription(ungrouped), 'white', null)

    div.appendChild(img)
    ungroupedTable.appendChild(div)
  }

  for (const k of progressiveAchievementKeys) {
    const div = document.createElement('div')
    div.className = 'progressiveAchievementType'

    const img = document.createElement('img')
    img.id = progressiveAchievementElementIds[k]
    img.src = `Pictures/Achievements/Progressive/${capitalize(k)}.png`
    img.alt = i18next.t(`achievements.progressiveAchievements.${k}.name`)
    img.style.cursor = 'pointer'
    img.tabIndex = 0

    registerAchievementModal(img, () => generateProgressiveAchievementDescription(k), 'turquoise')

    div.appendChild(img)
    progressiveTable.appendChild(div)
  }
})

const updateGroupedAchievementProgress = (group: AchievementGroup) => {
  const img = DOMCacheGetOrSet(groupedAchievementElementIds[group])
  const tiers = groupedAchievements[group].tiers

  let completedAchievements = 0
  for (const tier of tiers) {
    if (player.achievements[tier.id] === 1) {
      completedAchievements++
    }
  }

  img.classList.remove('purple-background')
  img.style.setProperty('border', 'none')
  img.classList.toggle('green-background', completedAchievements === tiers.length)
  img.style.setProperty('--pct', `${completedAchievements}/${tiers.length}`)
}

export const updateAllGroupedAchievementProgress = () => {
  for (let group = 0; group < groupedAchievements.length; group++) {
    updateGroupedAchievementProgress(group)
  }
}

const updateUngroupedAchievementProgress = (ungrouped: UngroupedAchievement) => {
  const img = DOMCacheGetOrSet(ungroupedAchievementElementIds[ungrouped])
  img.classList.toggle('green-background', player.achievements[ungroupedAchievements[ungrouped].id] === 1)
}

export const updateAllUngroupedAchievementProgress = () => {
  for (let ungrouped = 0; ungrouped < ungroupedAchievements.length; ungrouped++) {
    updateUngroupedAchievementProgress(ungrouped)
  }
}

const updateProgressiveAchievementProgress = (progAch: ProgressiveAchievements) => {
  const img = DOMCacheGetOrSet(progressiveAchievementElementIds[progAch])

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

const createFractionOverlay = (numerator: number, denominator: number) => {
  const apOverlay = document.createElement('div')
  apOverlay.classList.add('achievement-ap-overlay')

  if (numerator >= denominator) {
    apOverlay.classList.add('gold-text')
  }

  const numeratorDiv = document.createElement('div')
  numeratorDiv.classList.add('achievement-fraction-numerator')
  numeratorDiv.textContent = numerator.toString()

  const denominatorDiv = document.createElement('div')
  denominatorDiv.classList.add('achievement-fraction-denominator')
  denominatorDiv.textContent = denominator.toString()

  apOverlay.appendChild(numeratorDiv)
  apOverlay.appendChild(denominatorDiv)
  return apOverlay
}

const attachAPOverlay = (elementId: string, apOverlay: HTMLElement) => {
  const img = DOMCacheGetOrSet(elementId)
  const parent = img.parentElement!

  img.classList.add('dimmed')
  parent.querySelector('.achievement-ap-overlay')?.remove()
  parent.classList.add('relative-container')
  parent.appendChild(apOverlay)
}

export const displayAchievementProgress = () => {
  for (let group = 0; group < groupedAchievements.length; group++) {
    if (!groupedAchievements[group].displayCondition()) {
      continue
    }

    let earnedAP = 0
    for (const tier of groupedAchievements[group].tiers) {
      if (player.achievements[tier.id]) {
        earnedAP += tier.pointValue
      }
    }

    attachAPOverlay(
      groupedAchievementElementIds[group],
      createFractionOverlay(earnedAP, groupedAchievementMaxAP[group])
    )
  }

  for (let ungrouped = 0; ungrouped < ungroupedAchievements.length; ungrouped++) {
    const ach = ungroupedAchievements[ungrouped]
    if (!ach.displayCondition()) {
      continue
    }

    const isCompleted = player.achievements[ach.id] === 1

    const apOverlay = document.createElement('div')
    apOverlay.classList.add('achievement-ap-overlay')
    if (isCompleted) {
      apOverlay.classList.add('gold-text')
    }
    apOverlay.textContent = (isCompleted ? ach.pointValue : 0).toString()

    attachAPOverlay(ungroupedAchievementElementIds[ungrouped], apOverlay)
  }

  for (const k of progressiveAchievementKeys) {
    const achData = progressiveAchievements[k]
    if (!achData.displayCondition()) {
      continue
    }

    let apOverlay: HTMLElement
    if (achData.maxPointValue === -1) {
      apOverlay = document.createElement('div')
      apOverlay.classList.add('achievement-ap-overlay')
      apOverlay.textContent = achData.rewardedAP.toString()
    } else {
      apOverlay = createFractionOverlay(achData.rewardedAP, achData.maxPointValue)
    }

    attachAPOverlay(progressiveAchievementElementIds[k], apOverlay)
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
  for (const group of groupedAchievements) {
    group.firstLockedTier = 0
  }
  for (const k of progressiveAchievementKeys) {
    player.progressiveAchievements[k] = 0
    progressiveAchievements[k].rewardedAP = 0
  }
  achievementPoints = 0
  achievementLevel = 0
}
