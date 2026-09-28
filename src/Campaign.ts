import i18next from 'i18next'
import { awardAchievementGroup } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { inheritanceTokens, singularityBonusTokenMult } from './Calculate'
import { compareCorruptionTierStates, type CorruptionTier, type CorruptionTierState } from './Corruptions'
import { getOcteractUpgradeEffect } from './Octeracts'
import { getShopUpgradeEffects } from './Shop'
import { getGQUpgradeEffect } from './singularity'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, MEDIUM_MODAL_UPDATE_TICK, Modal } from './UpdateHTML'
import { isMobile } from './Utility'

export let campaignTokens = 0
let maxCampaignTokens = 0

type CampaignTokenRewardNames =
  | 'tutorial'
  | 'cube'
  | 'obtainium'
  | 'offering'
  | 'ascensionScore'
  | 'quark'
  | 'tax'
  | 'c15'
  | 'rune6'
  | 'goldenQuark'
  | 'octeract'
  | 'ambrosiaLuck'
  | 'blueberrySpeed'

type CampaignTokenRewardDisplay = {
  tokenRequirement: number
  reward: () => Partial<Record<CampaignTokenRewardNames, string>> | string
  otherUnlockRequirement?: () => boolean
}

type TokenCorruptionTier = Exclude<CorruptionTier, 0>

const bonusRune6ThresholdReqs = [500, 750, 1000, 1250, 1500, 1750, 2000, 3000, 4000, 6000, 8000, 10000]

const tokenCorruptionTiers: TokenCorruptionTier[] = [1, 2, 3, 4]

const corruptionLevelTokens: Record<TokenCorruptionTier, Array<[lastLevel: number, tokensPerLevel: number]>> = {
  1: [[20, 5]],
  2: [[40, 5]],
  3: [[75, 5]],
  4: [[50, 20], [100, 25], [200, 30], [225, 50]]
}

const maxCampaignTokenProgress: CorruptionTierState = { tier: 4, level: 225 }

const tierLevelTokens = (tier: TokenCorruptionTier, level: number) => {
  let tokens = 0
  let previousLevel = 0
  for (const [lastLevel, tokensPerLevel] of corruptionLevelTokens[tier]) {
    tokens += tokensPerLevel * Math.max(0, Math.min(level, lastLevel) - previousLevel)
    previousLevel = lastLevel
  }
  return tokens
}

const baseCampaignTokens = (state: CorruptionTierState) => {
  let tokens = 0
  for (const tier of tokenCorruptionTiers) {
    if (tier < state.tier) {
      tokens += tierLevelTokens(tier, Number.POSITIVE_INFINITY)
    } else if (tier === state.tier) {
      tokens += tierLevelTokens(tier, state.level)
    }
  }
  return tokens
}

const levelTokenMultiplier = () => {
  let bonusPoints = 0
  bonusPoints += player.highestSingularityCount >= 16 ? 5 : 0
  bonusPoints += player.highestSingularityCount >= 69 ? 10 : 0
  bonusPoints += getGQUpgradeEffect('singBonusTokens1', 'firstCompletionBonusTokens')
  bonusPoints += getGQUpgradeEffect('singBonusTokens3', 'lastCompletionBonusTokens')
  bonusPoints += getOcteractUpgradeEffect('octeractBonusTokens1', 'lastCompletionBonusTokens')
  bonusPoints += getOcteractUpgradeEffect('octeractBonusTokens3', 'firstCompletionBonusTokens')
  return 1 + 0.02 * bonusPoints
}

const computeCampaignTokens = (state: CorruptionTierState) => {
  let multiplier = levelTokenMultiplier()
  multiplier *= singularityBonusTokenMult()
  multiplier *= getGQUpgradeEffect('singBonusTokens2', 'tokenMultiplier')
  multiplier *= getOcteractUpgradeEffect('octeractBonusTokens2', 'tokenMultiplier')

  return Math.floor(baseCampaignTokens(state) * multiplier)
    + inheritanceTokens()
    + getGQUpgradeEffect('singBonusTokens4', 'initialTokenBonus')
    + getOcteractUpgradeEffect('octeractBonusTokens4', 'initialTokenBonus')
}

export const updateTokens = () => {
  campaignTokens = computeCampaignTokens(player.corruptions.tokenProgress)
  awardAchievementGroup('campaignTokens')
}

export const updateMaxTokens = () => {
  maxCampaignTokens = computeCampaignTokens(maxCampaignTokenProgress)
}

export const earnCampaignTokens = (state: CorruptionTierState) => {
  if (compareCorruptionTierStates(state, player.corruptions.tokenProgress) <= 0) {
    return
  }

  player.corruptions.tokenProgress = { tier: state.tier, level: state.level }
  updateTokens()
  campaignTokenRewardHTMLUpdate()
}

export const campaignTokenBonuses = {
  tutorial: () => ({
    cubeBonus: 1 + 0.25 * +(campaignTokens > 0),
    obtainiumBonus: 1 + 0.2 * +(campaignTokens > 0),
    offeringBonus: 1 + 0.2 * +(campaignTokens > 0)
  }),
  cube: () => {
    return 1
      + 0.4 * 1 / 25 * Math.min(campaignTokens, 25)
      + 0.6 * (1 - Math.exp(-Math.max(campaignTokens - 25, 0) / 500))
      + 1 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  },
  obtainium: () => {
    return 1
      + 0.1 * 1 / 25 * Math.min(campaignTokens, 25)
      + 0.4 * (1 - Math.exp(-Math.max(campaignTokens - 25, 0) / 500))
      + 0.5 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  },
  offering: () => {
    return 1
      + 0.1 * 1 / 25 * Math.min(campaignTokens, 25)
      + 0.4 * (1 - Math.exp(-Math.max(campaignTokens - 25, 0) / 500))
      + 0.5 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  },
  ascensionScore: () => {
    return 1
      + 0.2 * 1 / 100 * Math.min(campaignTokens, 100)
      + 0.3 * (1 - Math.exp(-Math.max(campaignTokens - 100, 0) / 1000))
      + 0.5 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  },
  quark: () => {
    if (campaignTokens < 100) {
      return 1
    }
    return 1
      + 0.05 * Math.min(campaignTokens - 100, 100) / 100
      + 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 200, 0) / 3000))
      + 0.1 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 10000))
  },
  tax: () => {
    if (campaignTokens < 250) {
      return 1
    }
    return 1
      - 0.05 * 1 / 250 * Math.min(campaignTokens - 250, 250)
      - 0.15 * (1 - Math.exp(-Math.max(campaignTokens - 500, 0) / 1250))
      - 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 5000))
  },
  c15: () => {
    if (campaignTokens < 250) {
      return 1
    }
    return 1
      + 0.05 * 1 / 250 * Math.min(campaignTokens - 250, 250)
      + 0.95 * (1 - Math.exp(-Math.max(campaignTokens - 500, 0) / 1250))
  },
  rune6: () => {
    for (let i = 0; i < bonusRune6ThresholdReqs.length; i++) {
      if (campaignTokens < bonusRune6ThresholdReqs[i]) {
        return i
      }
    }
    return 12
  },
  goldenQuark: () => {
    if (campaignTokens < 500) {
      return 1
    }
    return 1
      + 0.05 * 1 / 500 * Math.min(campaignTokens - 500, 500)
      + 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 1000, 0) / 2500))
  },
  octeract: () => {
    if (campaignTokens < 1000) {
      return 1
    }
    return 1
      + 0.1 * 1 / 1000 * Math.min(campaignTokens - 1000, 1000)
      + 0.15 * (1 - Math.exp(-Math.max(campaignTokens - 2000, 0) / 4000))
  },
  ambrosiaLuck: () => {
    if (campaignTokens < 2000) {
      return 0
    }
    return 10
      + 40 * 1 / 2000 * Math.min(campaignTokens - 2000, 2000)
      + 50 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 2500))
  },
  blueberrySpeed: () => {
    if (campaignTokens < 2000) {
      return 1
    }
    return 1
      + 0.02 * 1 / 2000 * Math.min(campaignTokens - 2000, 2000)
      + 0.03 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 2000))
  }
}

const campaignTokenRewardDatas: Record<CampaignTokenRewardNames, CampaignTokenRewardDisplay> = {
  tutorial: {
    tokenRequirement: 0,
    reward: () => ({
      cube: formatAsPercentIncrease(campaignTokenBonuses.tutorial().cubeBonus),
      obtainium: formatAsPercentIncrease(campaignTokenBonuses.tutorial().obtainiumBonus),
      offering: formatAsPercentIncrease(campaignTokenBonuses.tutorial().offeringBonus)
    })
  },
  cube: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.cube())
  },
  obtainium: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.obtainium())
  },
  offering: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.offering())
  },
  ascensionScore: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.ascensionScore())
  },
  quark: {
    tokenRequirement: 100,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.quark())
  },
  tax: {
    tokenRequirement: 250,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.tax()),
    otherUnlockRequirement: () => (player.challengecompletions[13] > 0)
  },
  c15: {
    tokenRequirement: 250,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.c15()),
    otherUnlockRequirement: () => (player.challengecompletions[14] > 0)
  },
  rune6: {
    tokenRequirement: 500,
    reward: () => String(campaignTokenBonuses.rune6()),
    otherUnlockRequirement: () => (getShopUpgradeEffects('infiniteAscent', 'runeUnlocked'))
  },
  goldenQuark: {
    tokenRequirement: 500,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.goldenQuark()),
    otherUnlockRequirement: () => (player.highestSingularityCount > 0)
  },
  octeract: {
    tokenRequirement: 1000,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.octeract()),
    otherUnlockRequirement: () => (player.highestSingularityCount > 7)
  },
  ambrosiaLuck: {
    tokenRequirement: 2000,
    reward: () => format(campaignTokenBonuses.ambrosiaLuck(), 2, true),
    otherUnlockRequirement: () => (player.singularityChallenges.noSingularityUpgrades.completions > 0)
  },
  blueberrySpeed: {
    tokenRequirement: 2000,
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.blueberrySpeed()),
    otherUnlockRequirement: () => (player.singularityChallenges.noSingularityUpgrades.completions > 0)
  }
}

const campaignTokenRewardText = (key: CampaignTokenRewardNames, value: CampaignTokenRewardDisplay) => {
  const reward = value.reward()
  if (typeof reward === 'string') {
    return i18next.t(`campaigns.tokens.rewardTexts.${key}`, {
      reward
    })
  }

  return i18next.t(`campaigns.tokens.rewardTexts.${key}`, reward)
}

const campaignTokenRewardModalHTML = (iconStyle: string, rewardText: string) => {
  return `<div class="campaignTokenRewardModal" data-modal-preserve="children">
    <img src="Pictures/img_transparent.png" alt="" style='${iconStyle}' data-modal-preserve="children">
    <div class="campaignTokenRewardModalInfo">${rewardText}</div>
  </div>`
}

const campaignTokenRewardSumModalHTML = (rewardTexts: string[]) => {
  return `<div class="campaignTokenRewardModal campaignTokenRewardSumModal">
    ${rewardTexts.map((rewardText) => `<div>${rewardText}</div>`).join('')}
  </div>`
}

const campaignTokenRewardUnlocked = (value: CampaignTokenRewardDisplay) => {
  return campaignTokens >= value.tokenRequirement
    && (value.otherUnlockRequirement === undefined || value.otherUnlockRequirement())
}

export const createCampaignTokenRewardEventHandlers = () => {
  for (
    const [key, value] of Object.entries(campaignTokenRewardDatas) as [
      CampaignTokenRewardNames,
      CampaignTokenRewardDisplay
    ][]
  ) {
    const tokenIcon = DOMCacheGetOrSet(`campaignTokenRewardIcon-${key}`)

    tokenIcon.addEventListener('click', (event) => {
      const rewardText = campaignTokenRewardText(key, value)
      if (isMobile) {
        Modal(
          () => campaignTokenRewardModalHTML(tokenIcon.style.cssText, rewardText),
          event.clientX,
          event.clientY,
          { borderColor: 'gold' },
          MEDIUM_MODAL_UPDATE_TICK,
          tokenIcon
        )
        return
      }

      DOMCacheGetOrSet('campaignTokenRewardText').innerHTML = rewardText
    })
  }

  const totalRewardIcon = DOMCacheGetOrSet('campaignTokenRewardIcon-sum')

  totalRewardIcon.addEventListener('click', (event) => {
    const popupTexts: string[] = []
    for (
      const [key, value] of Object.entries(campaignTokenRewardDatas) as [
        CampaignTokenRewardNames,
        CampaignTokenRewardDisplay
      ][]
    ) {
      if (campaignTokenRewardUnlocked(value)) {
        popupTexts.push(campaignTokenRewardText(key, value))
      }
    }

    if (isMobile) {
      Modal(
        () => campaignTokenRewardSumModalHTML(popupTexts),
        event.clientX,
        event.clientY,
        { borderColor: 'gold' },
        MEDIUM_MODAL_UPDATE_TICK,
        totalRewardIcon
      )
      return
    }

    Alert(`${popupTexts.join('\n')}\n`)
  })
}

export const campaignTokenRewardHTMLUpdate = () => {
  DOMCacheGetOrSet('campaignTokenRewardText').textContent = ''

  DOMCacheGetOrSet('campaignTokenCount').textContent = i18next.t('campaigns.tokens.count', {
    count: campaignTokens,
    maxCount: maxCampaignTokens
  })

  for (
    const [key, value] of Object.entries(campaignTokenRewardDatas) as [
      CampaignTokenRewardNames,
      CampaignTokenRewardDisplay
    ][]
  ) {
    DOMCacheGetOrSet(`campaignTokenRewardIcon-${key}`).hidden = !campaignTokenRewardUnlocked(value)
  }

  DOMCacheGetOrSet('campaignTokenRewardIcon-sum').hidden = campaignTokens === 0
}
