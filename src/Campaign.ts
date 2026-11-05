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

let baseCampaignTokens = 0

type CampaignTokenRewardNames =
  | 'tutorial'
  | 'obtainium'
  | 'offering'
  | 'antELO'
  | 'quark'
  | 'tax'
  | 'c15'
  | 'rune6'
  | 'goldenQuark'
  | 'ambrosiaLuck'
  | 'blueberrySpeed'

type CampaignTokenRewardDisplay = {
  tokenRequirement: number
  tokenCap: number
  color: string
  reward: () => Partial<Record<CampaignTokenRewardNames, string>> | string
  otherUnlockRequirement?: () => boolean
}

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

const startingTokens = () => {
  return inheritanceTokens()
    + getGQUpgradeEffect('singBonusTokens4', 'initialTokenBonus')
    + getOcteractUpgradeEffect('octeractBonusTokens4', 'initialTokenBonus')
}

export const multipliedTokenText = (key: string, base: number, params: Record<string, string> = {}) => {
  const multiplier = tokenMultiplier()
  return multiplier > 1 && base > 0
    ? i18next.t(`${key}Bonus`, {
      earned: format(base * multiplier, 2, true),
      base: format(base),
      percent: format(100 * (multiplier - 1), 2, true),
      ...params
    })
    : i18next.t(key, { earned: format(base), ...params })
}

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
  tokens += startingTokens()
  baseCampaignTokens = tokens
  campaignTokens = Math.floor(tokens * tokenMultiplier())
  awardAchievementGroup(AchievementGroup.CampaignTokens)
}

export const markAscensionStartTokens = () => {
  player.corruptions.ascensionStartTokens = baseCampaignTokens
}

export const ascensionTokensGained = () => baseCampaignTokens - player.corruptions.ascensionStartTokens

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

const usableCampaignTokens = (key: CampaignTokenRewardNames) => {
  return Math.min(campaignTokens, campaignTokenRewardDatas[key].tokenCap)
}

export const campaignTokenBonuses = {
  tutorial: () => ({
    obtainiumBonus: 1 + 0.2 * usableCampaignTokens('tutorial'),
    offeringBonus: 1 + 0.2 * usableCampaignTokens('tutorial')
  }),
  obtainium: () => 1 + 0.01 * usableCampaignTokens('obtainium'),
  offering: () => 1 + 0.01 * usableCampaignTokens('offering'),
  antELO: () => usableCampaignTokens('antELO'),
  quark: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.quark)) {
      return 1
    }
    const tokens = usableCampaignTokens('quark')
    return 1
      + 0.0006 * Math.min(tokens - 100, 100)
      + 0.06 * Math.log10(Math.max(tokens, 200) / 200)
  },
  tax: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.tax)) {
      return 1
    }
    const tokens = usableCampaignTokens('tax')
    return 1
      - 0.05 * 1 / 250 * Math.min(tokens - 250, 250)
      - 0.05 * Math.log2(Math.max(tokens, 500) / 500)
  },
  c15: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.c15)) {
      return 1
    }
    const tokens = usableCampaignTokens('c15')
    return 1
      + 0.05 * 1 / 250 * Math.min(tokens - 250, 250)
      + 0.19 * Math.log2(Math.max(tokens, 500) / 500)
  },
  rune6: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.rune6)) {
      return 0
    }
    return 2 + 2 * Math.floor(Math.log2(usableCampaignTokens('rune6') / 750))
  },
  goldenQuark: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.goldenQuark)) {
      return 1
    }
    const tokens = usableCampaignTokens('goldenQuark')
    return 1
      + 0.05 * 1 / 500 * Math.min(tokens - 500, 500)
      + 0.05 * Math.log(Math.max(tokens, 1000) / 1000) / Math.log(20)
  },
  ambrosiaLuck: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.ambrosiaLuck)) {
      return 0
    }
    const tokens = usableCampaignTokens('ambrosiaLuck')
    return 10
      + 40 * 1 / 2000 * Math.min(tokens - 2000, 2000)
      + 50 * Math.log(Math.max(tokens, 4000) / 4000) / Math.log(3)
  },
  blueberrySpeed: () => {
    if (!campaignTokenRewardUnlocked(campaignTokenRewardDatas.blueberrySpeed)) {
      return 1
    }
    const tokens = usableCampaignTokens('blueberrySpeed')
    return 1.01
      + 0.02 * 1 / 2000 * Math.min(tokens - 2000, 2000)
      + 0.03 * Math.log10(Math.max(tokens, 4000) / 4000)
  }
}

const campaignTokenRewardDatas: Record<CampaignTokenRewardNames, CampaignTokenRewardDisplay> = {
  tutorial: {
    tokenRequirement: 0,
    tokenCap: 1,
    color: 'var(--white-color)',
    reward: () => ({
      obtainium: formatAsPercentIncrease(campaignTokenBonuses.tutorial().obtainiumBonus),
      offering: formatAsPercentIncrease(campaignTokenBonuses.tutorial().offeringBonus)
    })
  },
  obtainium: {
    tokenRequirement: 0,
    tokenCap: 10000,
    color: 'var(--pink-color)',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.obtainium())
  },
  offering: {
    tokenRequirement: 0,
    tokenCap: 10000,
    color: 'var(--orange-color)',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.offering())
  },
  antELO: {
    tokenRequirement: 0,
    tokenCap: 25000,
    color: 'var(--orchid-color)',
    reward: () => format(campaignTokenBonuses.antELO())
  },
  quark: {
    tokenRequirement: 100,
    tokenCap: 20000,
    color: 'var(--cyan-color)',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.quark())
  },
  tax: {
    tokenRequirement: 250,
    tokenCap: 8000,
    color: 'var(--lightgray-color)',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.tax()),
    otherUnlockRequirement: () => (player.challengecompletions[13] > 0)
  },
  c15: {
    tokenRequirement: 250,
    tokenCap: 16000,
    color: 'var(--lightgoldenrodyellow-color)',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.c15()),
    otherUnlockRequirement: () => (player.challengecompletions[14] > 0)
  },
  rune6: {
    tokenRequirement: 750,
    tokenCap: 24000,
    color: 'var(--lightgoldenrodyellow-color)',
    reward: () => String(campaignTokenBonuses.rune6()),
    otherUnlockRequirement: () => (getShopUpgradeEffects('infiniteAscent', 'runeUnlocked'))
  },
  goldenQuark: {
    tokenRequirement: 500,
    tokenCap: 20000,
    color: 'var(--gold-color)',
    reward: () => formatAsPercentIncrease(campaignTokenBonuses.goldenQuark()),
    otherUnlockRequirement: () => (player.highestSingularityCount > 0)
  },
  ambrosiaLuck: {
    tokenRequirement: 2000,
    tokenCap: 36000,
    color: 'var(--limegreen-color)',
    reward: () => format(campaignTokenBonuses.ambrosiaLuck(), 2, true),
    otherUnlockRequirement: () => (player.singularityChallenges.noSingularityUpgrades.completions > 0)
  },
  blueberrySpeed: {
    tokenRequirement: 2000,
    tokenCap: 40000,
    color: 'var(--lightblue-color)',
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

const campaignTokenRewardDetailHTML = (key: CampaignTokenRewardNames, value: CampaignTokenRewardDisplay) => {
  const cap = i18next.t(`campaigns.tokens.${campaignTokens >= value.tokenCap ? 'capReached' : 'cap'}`, {
    cap: format(value.tokenCap)
  })
  const formula = value.tokenCap > 1 ? `<p>${i18next.t(`campaigns.tokens.formulas.${key}`)}</p>` : ''
  return `<p class="campaignTokenRewardName">${i18next.t(`campaigns.tokens.names.${key}`)}</p>
    <p class="campaignTokenRewardFlavor">${i18next.t(`campaigns.tokens.flavors.${key}`)}</p>
    <p>${campaignTokenRewardText(key, value)}</p>
    ${formula}
    <p>${cap}</p>`
}

const campaignTokenRewardTeaserHTML = (key: CampaignTokenRewardNames, value: CampaignTokenRewardDisplay) => {
  const teaser = i18next.t('campaigns.tokens.teaser', {
    required: format(value.tokenRequirement),
    remaining: format(value.tokenRequirement - campaignTokens)
  })
  return `<p class="campaignTokenRewardName">${i18next.t(`campaigns.tokens.names.${key}`)}</p>
    <p>${teaser}</p>`
}

const campaignTokenRewardModalHTML = (iconStyle: string, rewardText: string, locked = false) => {
  const iconClass = locked ? 'campaignTokenRewardLocked' : ''
  return `<div class="campaignTokenRewardModal" data-modal-preserve="children">
    <img src="Pictures/img_transparent.png" alt="" style='${iconStyle}' class="${iconClass}" data-modal-preserve="children">
    <div class="campaignTokenRewardModalInfo">${rewardText}</div>
  </div>`
}

const campaignTokenRewardSumModalHTML = (rewardTexts: string[]) => {
  return `<div class="campaignTokenRewardModal campaignTokenRewardSumModal">
    ${rewardTexts.map((rewardText) => `<div>${rewardText}</div>`).join('')}
  </div>`
}

const campaignTokenRewardQualified = (value: CampaignTokenRewardDisplay) => {
  return value.otherUnlockRequirement === undefined || value.otherUnlockRequirement()
}

const campaignTokenRewardUnlocked = (value: CampaignTokenRewardDisplay) => {
  return campaignTokens >= value.tokenRequirement && campaignTokenRewardQualified(value)
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
      () =>
        campaignTokenRewardUnlocked(value)
          ? campaignTokenRewardModalHTML(tokenIcon.style.cssText, campaignTokenRewardDetailHTML(key, value))
          : campaignTokenRewardModalHTML(tokenIcon.style.cssText, campaignTokenRewardTeaserHTML(key, value), true),
      value.color
    )
  }

  registerCampaignTokenRewardModal(
    DOMCacheGetOrSet('campaignTokenRewardIcon-sum'),
    () => campaignTokenRewardSumModalHTML(campaignTokenRewardSumTexts()),
    'var(--gold-color)'
  )
}

const campaignTokenTotalsUpdate = () => {
  const inherited = startingTokens()
  const inheritanceElement = DOMCacheGetOrSet('campaignInheritanceTokens')
  inheritanceElement.hidden = inherited <= 0
  if (inherited > 0) {
    const html = multipliedTokenText('campaigns.tokens.inheritance', inherited)
    if (inheritanceElement.innerHTML !== html) {
      inheritanceElement.innerHTML = html
    }
  }

  const total = multipliedTokenText('campaigns.tokens.total', baseCampaignTokens, { earned: format(campaignTokens) })
  const totalElement = DOMCacheGetOrSet('campaignTokenCount')
  if (totalElement.innerHTML !== total) {
    totalElement.innerHTML = total
  }
}

export const campaignTokenRewardHTMLUpdate = () => {
  campaignTokenTotalsUpdate()

  for (
    const [key, value] of Object.entries(campaignTokenRewardDatas) as [
      CampaignTokenRewardNames,
      CampaignTokenRewardDisplay
    ][]
  ) {
    const icon = DOMCacheGetOrSet(`campaignTokenRewardIcon-${key}`)
    const hidden = !campaignTokenRewardQualified(value)
    if (icon.hidden !== hidden) {
      icon.hidden = hidden
    }
    icon.classList.toggle('campaignTokenRewardLocked', !campaignTokenRewardUnlocked(value))
  }

  const sumIcon = DOMCacheGetOrSet('campaignTokenRewardIcon-sum')
  if (sumIcon.hidden !== (campaignTokens === 0)) {
    sumIcon.hidden = campaignTokens === 0
  }
}
