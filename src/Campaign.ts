import i18next from 'i18next'
import { AchievementGroup, awardAchievementGroup } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { inheritanceTokens, singularityBonusTokenMult } from './Calculate'
import { getOcteractUpgradeEffect } from './Octeracts'
import { getShopUpgradeEffects } from './Shop'
import { getGQUpgradeEffect } from './singularity'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { CloseModal, MEDIUM_MODAL_UPDATE_TICK, Modal } from './UpdateHTML'
import { isMobile } from './Utility'

export let campaignTokens = 0

type CampaignTokenRewardNames =
  | 'tutorial'
  | 'cube'
  | 'obtainium'
  | 'offering'
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
  color: string
  reward: () => Partial<Record<CampaignTokenRewardNames, string>> | string
  otherUnlockRequirement?: () => boolean
}

const bonusRune6ThresholdReqs = [500, 750, 1000, 1250, 1500, 1750, 2000, 3000, 4000, 6000, 8000, 10000]

const tokenMultiplier = () => {
  return 1
    + (singularityBonusTokenMult() - 1)
    + (getGQUpgradeEffect('singBonusTokens2', 'tokenMultiplier') - 1)
    + (getOcteractUpgradeEffect('octeractBonusTokens2', 'tokenMultiplier') - 1)
}

const firstCompletionBonusPoints = () => {
  return 5
    + (player.highestSingularityCount >= 16 ? 1 : 0)
    + (player.highestSingularityCount >= 69 ? 1 : 0)
    + getGQUpgradeEffect('singBonusTokens1', 'firstCompletionBonusTokens')
    + getGQUpgradeEffect('singBonusTokens3', 'lastCompletionBonusTokens')
    + getOcteractUpgradeEffect('octeractBonusTokens3', 'firstCompletionBonusTokens')
    + getOcteractUpgradeEffect('octeractBonusTokens1', 'lastCompletionBonusTokens')
}

const levelTokens = (completions: number, first: number) => completions + (completions >= 1 ? first : 0)

export const corruptionLevelTokenInfo = (level: number) => {
  const completions = player.corruptions.tokenCompletions[level] ?? 0
  const first = Math.floor(firstCompletionBonusPoints())
  return {
    completions,
    first,
    firstEarned: completions >= 1,
    earned: levelTokens(completions, first)
  }
}

export const updateTokens = () => {
  const first = Math.floor(firstCompletionBonusPoints())
  const completions = player.corruptions.tokenCompletions
  let tokens = 0
  for (let level = 1; level < completions.length; level++) {
    tokens += levelTokens(completions[level] ?? 0, first)
  }
  tokens += inheritanceTokens()
    + getGQUpgradeEffect('singBonusTokens4', 'initialTokenBonus')
    + getOcteractUpgradeEffect('octeractBonusTokens4', 'initialTokenBonus')
  campaignTokens = Math.floor(tokens * tokenMultiplier())
  awardAchievementGroup(AchievementGroup.CampaignTokens)
}

export const earnCampaignTokens = (level: number, c10Completions: number) => {
  let improved = false
  for (let l = 1; l <= level; l++) {
    if (c10Completions > (player.corruptions.tokenCompletions[l] ?? 0)) {
      player.corruptions.tokenCompletions[l] = c10Completions
      improved = true
    }
  }
  if (improved) {
    updateTokens()
    campaignTokenRewardHTMLUpdate()
  }
}

export const campaignTokenBonuses = {
  tutorial: () => ({
    cubeBonus: 1 + 0.25 * +(campaignTokens > 0),
    obtainiumBonus: 1 + 0.2 * +(campaignTokens > 0),
    offeringBonus: 1 + 0.2 * +(campaignTokens > 0)
  }),
  cube: () => 1 + 2 * (1 - Math.pow(1 - 1 / 400, campaignTokens)),
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
  quark: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.quark)) {
      return 1
    }
    return 1
      + 0.05 * Math.min(campaignTokens - 100, 100) / 100
      + 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 200, 0) / 3000))
      + 0.1 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 10000))
  },
  tax: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.tax)) {
      return 1
    }
    return 1
      - 0.05 * 1 / 250 * Math.min(campaignTokens - 250, 250)
      - 0.15 * (1 - Math.exp(-Math.max(campaignTokens - 500, 0) / 1250))
      - 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 5000))
  },
  c15: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.c15)) {
      return 1
    }
    return 1
      + 0.05 * 1 / 250 * Math.min(campaignTokens - 250, 250)
      + 0.95 * (1 - Math.exp(-Math.max(campaignTokens - 500, 0) / 1250))
  },
  rune6: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.rune6)) {
      return 0
    }
    for (let i = 0; i < bonusRune6ThresholdReqs.length; i++) {
      if (campaignTokens < bonusRune6ThresholdReqs[i]) {
        return i
      }
    }
    return 12
  },
  goldenQuark: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.goldenQuark)) {
      return 1
    }
    return 1
      + 0.05 * 1 / 500 * Math.min(campaignTokens - 500, 500)
      + 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 1000, 0) / 2500))
  },
  octeract: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.octeract)) {
      return 1
    }
    return 1
      + 0.1 * 1 / 1000 * Math.min(campaignTokens - 1000, 1000)
      + 0.15 * (1 - Math.exp(-Math.max(campaignTokens - 2000, 0) / 4000))
  },
  ambrosiaLuck: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.ambrosiaLuck)) {
      return 0
    }
    return 10
      + 40 * 1 / 2000 * Math.min(campaignTokens - 2000, 2000)
      + 50 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 2500))
  },
  blueberrySpeed: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.blueberrySpeed)) {
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
    color: 'white',
    reward: () => ({
      cube: formatAsPercentIncrease(campaignTokenBonuses.tutorial().cubeBonus),
      obtainium: formatAsPercentIncrease(campaignTokenBonuses.tutorial().obtainiumBonus),
      offering: formatAsPercentIncrease(campaignTokenBonuses.tutorial().offeringBonus)
    })
  },
  cube: {
    tokenRequirement: 0,
    color: 'white',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.cube())
  },
  obtainium: {
    tokenRequirement: 0,
    color: 'pink',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.obtainium())
  },
  offering: {
    tokenRequirement: 0,
    color: 'orange',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.offering())
  },
  quark: {
    tokenRequirement: 100,
    color: 'cyan',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.quark())
  },
  tax: {
    tokenRequirement: 250,
    color: 'lightgray',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.tax()),
    otherUnlockRequirement: () => (player.challengecompletions[13] > 0)
  },
  c15: {
    tokenRequirement: 250,
    color: 'lightgoldenrodyellow',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.c15()),
    otherUnlockRequirement: () => (player.challengecompletions[14] > 0)
  },
  rune6: {
    tokenRequirement: 500,
    color: 'lightgoldenrodyellow',
    reward: () => String(campaignTokenBonuses.rune6()),
    otherUnlockRequirement: () => (getShopUpgradeEffects('infiniteAscent', 'runeUnlocked'))
  },
  goldenQuark: {
    tokenRequirement: 500,
    color: 'gold',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.goldenQuark()),
    otherUnlockRequirement: () => (player.highestSingularityCount > 0)
  },
  octeract: {
    tokenRequirement: 1000,
    color: 'teal',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.octeract()),
    otherUnlockRequirement: () => (player.highestSingularityCount > 7)
  },
  ambrosiaLuck: {
    tokenRequirement: 2000,
    color: 'limegreen',
    reward: () => format(campaignTokenBonuses.ambrosiaLuck(), 2, true),
    otherUnlockRequirement: () => (player.singularityChallenges.noSingularityUpgrades.completions > 0)
  },
  blueberrySpeed: {
    tokenRequirement: 2000,
    color: 'lightblue',
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

const registerCampaignTokenRewardModal = (icon: HTMLElement, html: () => string, borderColor: string) => {
  if (isMobile) {
    icon.addEventListener('click', (event) => {
      Modal(html, event.clientX, event.clientY, { borderColor }, MEDIUM_MODAL_UPDATE_TICK, icon)
    })
    return
  }

  icon.addEventListener('mousemove', (event) => {
    Modal(html, event.clientX, event.clientY, { borderColor }, MEDIUM_MODAL_UPDATE_TICK, icon)
  })
  icon.addEventListener('mouseout', CloseModal)
}

const campaignTokenRewardSumTexts = () => {
  const rewardTexts: string[] = []
  for (
    const [key, value] of Object.entries(campaignTokenRewardDatas) as [
      CampaignTokenRewardNames,
      CampaignTokenRewardDisplay
    ][]
  ) {
    if (campaignTokenRewardUnlocked(value)) {
      rewardTexts.push(campaignTokenRewardText(key, value))
    }
  }
  return rewardTexts
}

export const createCampaignTokenRewardEventHandlers = () => {
  for (
    const [key, value] of Object.entries(campaignTokenRewardDatas) as [
      CampaignTokenRewardNames,
      CampaignTokenRewardDisplay
    ][]
  ) {
    const tokenIcon = DOMCacheGetOrSet(`campaignTokenRewardIcon-${key}`)
    registerCampaignTokenRewardModal(
      tokenIcon,
      () => campaignTokenRewardModalHTML(tokenIcon.style.cssText, campaignTokenRewardText(key, value)),
      value.color
    )
  }

  registerCampaignTokenRewardModal(
    DOMCacheGetOrSet('campaignTokenRewardIcon-sum'),
    () => campaignTokenRewardSumModalHTML(campaignTokenRewardSumTexts()),
    'gold'
  )
}

export const campaignTokenRewardHTMLUpdate = () => {
  DOMCacheGetOrSet('campaignTokenCount').textContent = i18next.t('campaigns.tokens.count', {
    count: campaignTokens
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
