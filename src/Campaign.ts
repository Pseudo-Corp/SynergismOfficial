import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { corrIcons, CorruptionLoadout, type Corruptions, corruptionsSchema, corruptionStatsUpdate } from './Corruptions'
import { format, player } from './Synergism'
import { IconSets } from './Themes'
import { reset } from './Reset'
import { Confirm, Notification } from './UpdateHTML'
import { isIARuneUnlocked } from './Calculate'

export type AscensionModifiers = 'GlobalSpeed'

export type CampaignLoadout = Corruptions
export type CampaignModifiers = Partial<Record<AscensionModifiers, number>>

export type CampaignKeys = 'first' | 'second' | 'third' | 'chal11' | 'ultimate' | // Next ones are for testing only
'freeTokens1' | 'freeTokens2' | 'freeTokens3' | 'freeTokens4' | 'freeTokens5' |
'freeTokens6' | 'freeTokens7' | 'freeTokens8' | 'freeTokens9' | 'freeTokens10'

export type CampaignTokenRewardNames = 'tutorial' | 'cube' | 'obtainium' | 'offering' | 
'ascensionScore' | 'timeThreshold' | 'quark' | 'tax' | 'c15' | 'rune6' | 'goldenQuark' |
'octeract' | 'ambrosiaLuck' | 'blueberrySpeed'

type CampaignTokenRewardDisplay = {
  tokenRequirement: number
  reward: () => Partial<Record<CampaignTokenRewardNames, string>> | string
  otherUnlockRequirement?: () => boolean
}

type TutorialBonus = {
  cubeBonus: number
  obtainiumBonus: number
  offeringBonus: number
}

export interface ICampaignManagerData {
  currentCampaign?: CampaignKeys
  campaigns?: Record<CampaignKeys, number>
}

export interface ICampaignData {
  campaignCorruptions: Partial<Corruptions>
  campaignModifiers: CampaignModifiers
  limit: number
  isMeta: boolean
}

export class CampaignManager {
  #currentCampaign: CampaignKeys | undefined
  #campaigns: Record<CampaignKeys, Campaign>
  #token = undefined
  #maxToken = undefined

  constructor (campaignManagerData?: ICampaignManagerData) {
    this.#campaigns = {
      first: new Campaign(campaignDatas.first, 'first', campaignManagerData?.campaigns?.first ?? 0),
      second: new Campaign(campaignDatas.second, 'second', campaignManagerData?.campaigns?.second ?? 0),
      third: new Campaign(campaignDatas.third, 'third', campaignManagerData?.campaigns?.third ?? 0),
      chal11: new Campaign(campaignDatas.chal11, 'chall11', campaignManagerData?.campaigns?.chal11 ?? 0),
      ultimate: new Campaign(campaignDatas.ultimate, 'ultimate', campaignManagerData?.campaigns?.ultimate ?? 0),
      freeTokens1: new Campaign(campaignDatas.freeTokens1, 'freeTokens1', campaignManagerData?.campaigns?.freeTokens1 ?? 0),
      freeTokens2: new Campaign(campaignDatas.freeTokens2, 'freeTokens2', campaignManagerData?.campaigns?.freeTokens2 ?? 0),
      freeTokens3: new Campaign(campaignDatas.freeTokens3, 'freeTokens3', campaignManagerData?.campaigns?.freeTokens3 ?? 0),
      freeTokens4: new Campaign(campaignDatas.freeTokens4, 'freeTokens4', campaignManagerData?.campaigns?.freeTokens4 ?? 0),
      freeTokens5: new Campaign(campaignDatas.freeTokens5, 'freeTokens5', campaignManagerData?.campaigns?.freeTokens5 ?? 0),
      freeTokens6: new Campaign(campaignDatas.freeTokens6, 'freeTokens6', campaignManagerData?.campaigns?.freeTokens6 ?? 0),
      freeTokens7: new Campaign(campaignDatas.freeTokens7, 'freeTokens7', campaignManagerData?.campaigns?.freeTokens7 ?? 0),
      freeTokens8: new Campaign(campaignDatas.freeTokens8, 'freeTokens8', campaignManagerData?.campaigns?.freeTokens8 ?? 0),
      freeTokens9: new Campaign(campaignDatas.freeTokens9, 'freeTokens9', campaignManagerData?.campaigns?.freeTokens9 ?? 0),
      freeTokens10: new Campaign(campaignDatas.freeTokens10, 'freeTokens10', campaignManagerData?.campaigns?.freeTokens10 ?? 0)
    }

    this.#currentCampaign = campaignManagerData?.currentCampaign ?? undefined
    if (this.#currentCampaign !== undefined) {
      player.corruptions.used = new CorruptionLoadout(
        this.#campaigns[this.#currentCampaign].campaignCorruptions
      )
    }
  }

  computeTotalCampaignTokens () {
    let sum = 0
    for (const campaign of Object.values(this.#campaigns)) {
      sum += campaign.tokens
    }
    return sum
  }

  computeMaxCampaignTokens () {
    let sum = 0
    for (const campaign of Object.values(this.#campaigns)) {
      sum += campaign.maxTokens
    }
    return sum
  }

  get tokens () {
    if (this.#token === undefined) {
      return this.computeTotalCampaignTokens()
    }
    else {
      return this.#token
    }
  }

  get maxTokens () {
    if (this.#maxToken === undefined) {
      return this.computeMaxCampaignTokens()
    }
    else {
      return this.#maxToken
    }
  }

  get current () {
    return this.#currentCampaign
  }

  get currentCampaign() {
    if (this.#currentCampaign === undefined) {
      return undefined
    }
    return this.#campaigns[this.#currentCampaign]
  }

  getCampaign(key: CampaignKeys) {
    return this.#campaigns[key]
  }

  get allC10Completions() {
    return Object.fromEntries(
      Object.entries(this.#campaigns).map(([key, campaign]) => [key, campaign.c10Completions])
    ) as Record<CampaignKeys, number>
  }

  // Set to player.
  get campaignManagerData () {
    return {
      currentCampaign: this.#currentCampaign,
      campaigns: this.allC10Completions
    } as ICampaignManagerData
  }

  set campaign (key: CampaignKeys) {
    this.#currentCampaign = key
    player.corruptions.used = new CorruptionLoadout(this.#campaigns[key].campaignCorruptions)
    corruptionStatsUpdate()
    campaignIconHTMLUpdate(key)
    campaignCorruptionStatHTMLUpdate(key)
  }

  set c10Completions (c10: number) {
    if (this.#currentCampaign) {
      this.#campaigns[this.#currentCampaign].c10Completions = c10
    }
  }

  resetCampaign (c10: number) {
    const savedKey = this.#currentCampaign
    if (this.#currentCampaign) {
      this.c10Completions = c10
      this.#currentCampaign = undefined

      // Update Token Count for player
      this.computeTotalCampaignTokens()
      campaignTokenRewardHTMLUpdate()
    }
    if (savedKey) {
      // Would no longer be equal to current campaign so reset background color
      // Or sets to green if c10 completions are maxed
      campaignIconHTMLUpdate(savedKey)
      campaignCorruptionStatHTMLUpdate(savedKey)
    }
  }

  get tutorialBonus (): TutorialBonus {
    return {
      cubeBonus: 1 + 0.1 * +(this.tokens > 0),
      obtainiumBonus: 1 + 0.25 * +(this.tokens > 0),
      offeringBonus: 1 + 0.25 * +(this.tokens > 0)
    }
  }

  get cubeBonus () {
    return 1 + 
    0.25 * 1/25 * Math.min(this.tokens, 25) +
    0.75 * (1 - Math.exp(-Math.max(this.tokens - 25, 0) / 500))
  }

  get obtainiumBonus () {
    return 1 + 
    0.25 * 1/25 * Math.min(this.tokens, 25) +
    0.75 * (1 - Math.exp(-Math.max(this.tokens - 25, 0) / 500))
  }

  get offeringBonus () {
    return 1 + 
    0.25 * 1/25 * Math.min(this.tokens, 25) +
    0.75 * (1 - Math.exp(-Math.max(this.tokens - 25, 0) / 500))
  }

  get ascensionScoreMultiplier () {
    return 1 + 
    0.5 * 1/100 * Math.min(this.tokens, 100) +
    0.5 * (1 - Math.exp(-Math.max(this.tokens - 100, 0) / 1000))
  }
  /**
   * Returns the time threshold reduction for Prestige, Reincarnation and Ascension
   * Threshold is defined as having quadratic penalty if your reset lasts less than X seconds
   * Reducing the threshold reduces the denominator of the penalty, e.g. if the base is 10 seconds,
   * the penalty is *(time/10)^2, reducing the threshold to 5 seconds would make the penalty *(time/5)^2
   */
  get timeThresholdReduction () {
    const thresholdReqs = [20, 100, 500, 2000]
    for (let i = 0; i < thresholdReqs.length; i++) {
      if (this.tokens < thresholdReqs[i]) {
        return i
      }
    }
    return 4
  }

  get quarkBonus () {
    if (this.tokens < 100) {
      return 1
    }
    else {
      return 1 + 
      0.1 * Math.min(this.tokens - 100, 100) / 100 +
      0.15 * (1 - Math.exp(-Math.max(this.tokens - 200, 0) / 3000))
    }
  }

  get taxMultiplier () {
    if (this.tokens < 250) {
      return 1
    }
    return 1 -
    0.05 * 1/250 * Math.min(this.tokens - 250, 250) +
    0.15 * (1 - Math.exp(-Math.max(this.tokens - 500, 0) / 1250))
  }

  get c15Bonus () {
    if (this.tokens < 250) {
      return 1
    }
    return 1 +
    0.1 * 1/250 * Math.min(this.tokens - 250, 250) +
    0.9 * (1 - Math.exp(-Math.max(this.tokens - 500, 0) / 1250))
  }

  get bonusRune6 () {
    const thresholdReqs = [500, 2000, 5000]
    for (let i = 0; i < thresholdReqs.length; i++) {
      if (this.tokens < thresholdReqs[i]) {
        return i
      }
    }
    return 3
  }

  get goldenQuarkBonus () {
    if (this.tokens < 500) {
      return 1
    }
    return 1 +
    0.1 * 1/500 * Math.min(this.tokens - 500, 500) +
    0.15 * (1 - Math.exp(-Math.max(this.tokens - 1000, 0) / 2500))
  }

  get octeractBonus () {
    if (this.tokens < 1000) {
      return 1
    }
    return 1 +
    0.1 * 1/1000 * Math.min(this.tokens - 1000, 1000) +
    0.4 * (1 - Math.exp(-Math.max(this.tokens - 2000, 0) / 4000))
  }

  get ambrosiaLuckBonus () {
    if (this.tokens < 2000) {
      return 0
    }
    return 10 +
    40 * 1/2000 * Math.min(this.tokens - 2000, 2000) +
    50 * (1 - Math.exp(-Math.max(this.tokens - 4000, 0) / 2500))
  }

  get blueberrySpeedBonus () {
    if (this.tokens < 2000) {
      return 1
    }
    return 1 +
    0.05 * 1/2000 * Math.min(this.tokens - 2000, 2000) +
    0.05 * (1 - Math.exp(-Math.max(this.tokens - 4000, 0) / 2000))
  }


}

export class Campaign {
  #name: string
  #description: string
  #campaignCorruptions: CampaignLoadout
  #campaignModifiers: CampaignModifiers
  #limit: number
  #isMeta: boolean
  #c10Completions = 0

  constructor (campaignData: ICampaignData, key: string, c10?: number) {
    this.#name = i18next.t(`campaigns.data.${key}.name`)
    this.#description = i18next.t(`campaigns.data.${key}.description`)
    this.#campaignCorruptions = corruptionsSchema.parse(campaignData.campaignCorruptions)
    this.#campaignModifiers = campaignData.campaignModifiers
    this.#limit = campaignData.limit
    this.#isMeta = campaignData.isMeta
    this.#c10Completions = c10 ?? 0
  }

  public computeTokenValue = (amount?: number) => {
    const metaMultiplier = this.#isMeta ? 2 : 1
    return metaMultiplier * Math.min(amount ?? this.c10Completions, this.#limit)
  }

  public createUsableLoadout = (): CorruptionLoadout => {
    return new CorruptionLoadout(this.#campaignCorruptions)
  }

  public set c10Completions (value: number) {
    if (value > this.#c10Completions) {
      this.#c10Completions = Math.min(value, this.#limit)
    }
  }

  public get campaignCorruptions () {
    return this.#campaignCorruptions
  }

  public get c10Completions () {
    return this.#c10Completions
  }

  public get name () {
    return this.#name
  }

  public get description () {
    return this.#description
  }

  public get limit () {
    return this.#limit
  }

  public get campaignModifiers () {
    return this.#campaignModifiers
  }

  public get isMeta () {
    return this.#isMeta
  }

  public get tokens () {
    return this.computeTokenValue()
  }

  public get maxTokens () {
    return this.computeTokenValue(this.#limit)
  }
}

export const campaignDatas: Record<CampaignKeys, ICampaignData> = {
  first: {
    campaignCorruptions: {
      viscosity: 1
    },
    campaignModifiers: {
      GlobalSpeed: 1
    },
    isMeta: true,
    limit: 10
  },
  second: {
    campaignCorruptions: {
      viscosity: 1,
      deflation: 1
    },
    campaignModifiers: {
      GlobalSpeed: 1
    },
    isMeta: true,
    limit: 15
  },
  third: {
    campaignCorruptions: {
      viscosity: 1,
      deflation: 1,
      dilation: 1
    },
    campaignModifiers: {
      GlobalSpeed: 1
    },
    isMeta: true,
    limit: 20
  },
  chal11: {
    campaignCorruptions: {
      viscosity: 11,
      drought: 11,
      deflation: 11,
      extinction: 11,
      illiteracy: 11,
      recession: 11,
      dilation: 11,
      hyperchallenge: 11
    },
    campaignModifiers: {
      GlobalSpeed: 1
    },
    isMeta: true,
    limit: 25
  },
  ultimate: {
    campaignCorruptions: {
      viscosity: 15,
      drought: 15,
      deflation: 15,
      extinction: 15,
      illiteracy: 15,
      recession: 15,
      dilation: 15,
      hyperchallenge: 15
    },
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens1: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: false,
    limit: 125
  },
  freeTokens2: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: false,
    limit: 125
  },
  freeTokens3: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens4: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens5: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens6: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens7: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens8: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens9: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  },
  freeTokens10: {
    campaignCorruptions: {},
    campaignModifiers: {},
    isMeta: true,
    limit: 125
  }
}

const formatAsPercentIncrease = (n: number, accuracy = 2) => {
  return `${format((n - 1) * 100, accuracy, true)}%`
}

// For icons, display them only if the player has enough tokens and fits the other requirements
// This is more of a display thing, the actual reward is computed in the CampaignManager
export const campaignTokenRewardDatas: Record<CampaignTokenRewardNames, CampaignTokenRewardDisplay> = {
  tutorial: {
    tokenRequirement: 0,
    reward: () => ({
      cube: formatAsPercentIncrease(player.campaigns.tutorialBonus.cubeBonus),
      obtainium: formatAsPercentIncrease(player.campaigns.tutorialBonus.obtainiumBonus),
      offering: formatAsPercentIncrease(player.campaigns.tutorialBonus.offeringBonus)
    })
  },
  cube: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(player.campaigns.cubeBonus)
  },
  obtainium: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(player.campaigns.obtainiumBonus)
  },
  offering: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(player.campaigns.offeringBonus)
  },
  ascensionScore: {
    tokenRequirement: 0,
    reward: () => formatAsPercentIncrease(player.campaigns.ascensionScoreMultiplier)
  },
  timeThreshold: {
    tokenRequirement: 20,
    reward: () => String(player.campaigns.timeThresholdReduction)
  },
  quark: {
    tokenRequirement: 100,
    reward: () => formatAsPercentIncrease(player.campaigns.quarkBonus)
  },
  tax: {
    tokenRequirement: 250,
    reward: () => formatAsPercentIncrease(player.campaigns.taxMultiplier),
    otherUnlockRequirement: () => (player.challengecompletions[13] > 0)
  },
  c15: {
    tokenRequirement: 250,
    reward: () => formatAsPercentIncrease(player.campaigns.c15Bonus),
    otherUnlockRequirement: () => (player.challengecompletions[14] > 0)
  },
  rune6: {
    tokenRequirement: 500,
    reward: () => String(player.campaigns.bonusRune6),
    otherUnlockRequirement: () => (isIARuneUnlocked())
  },
  goldenQuark: {
    tokenRequirement: 500,
    reward: () => formatAsPercentIncrease(player.campaigns.goldenQuarkBonus),
    otherUnlockRequirement: () => (player.highestSingularityCount > 0)
  },
  octeract: {
    tokenRequirement: 1000,
    reward: () => formatAsPercentIncrease(player.campaigns.octeractBonus),
    otherUnlockRequirement: () => (player.highestSingularityCount > 7)
  },
  ambrosiaLuck: {
    tokenRequirement: 2000,
    reward: () => format(player.campaigns.ambrosiaLuckBonus, 2, true),
    otherUnlockRequirement: () => (player.highestSingularityCount > 8)
  },
  blueberrySpeed: {
    tokenRequirement: 2000,
    reward: () => formatAsPercentIncrease(player.campaigns.blueberrySpeedBonus),
    otherUnlockRequirement: () => (player.highestSingularityCount > 9)
  }
}

export const campaignIconHTMLUpdate = (key: CampaignKeys) => {
  const icon = DOMCacheGetOrSet(`${key}CampaignIcon`)
  console.log('campaign clear ', player.campaigns.getCampaign(key).c10Completions)
  console.log('campaign limit ', campaignDatas[key].limit)
  if (key === player.campaigns.current) {
    icon.style.backgroundColor = 'orchid'
  }
  else if (player.campaigns.getCampaign(key).c10Completions === campaignDatas[key].limit) {
    icon.style.backgroundColor = 'green'
  }
  else {
    icon.style.backgroundColor = ''
  }
}

export const campaignCorruptionStatsHTMLReset = () => {
  DOMCacheGetOrSet('campaignCorruptions').innerHTML = ''
  DOMCacheGetOrSet('campaignCorruptionStats').innerHTML = ''
  DOMCacheGetOrSet('campaignName').textContent = ''
  DOMCacheGetOrSet('campaignDesc').textContent = ''
}

export const campaignCorruptionStatHTMLUpdate = (key: CampaignKeys) => {
  // Clear existing HTMLS
  campaignCorruptionStatsHTMLReset()
  DOMCacheGetOrSet('campaignName').textContent = `${player.campaigns.current === key ?
    i18next.t('campaigns.currentCampaignPreTitle') : ''
  } ${i18next.t(`campaigns.data.${key}.name`)}`
  DOMCacheGetOrSet('campaignDesc').textContent = i18next.t(`campaigns.data.${key}.description`)

  const campaign = player.campaigns.getCampaign(key)
  const usableCorruption = new CorruptionLoadout(corruptionsSchema.parse(campaignDatas[key].campaignCorruptions))
  const campaignCorrDiv = DOMCacheGetOrSet('campaignCorruptions')
  const corruptionStats = DOMCacheGetOrSet('campaignCorruptionStats')

  for (const [corruption, level] of Object.entries(campaignDatas[key].campaignCorruptions)) {

    const corrKey = corruption as keyof Corruptions
    const corrDiv = document.createElement('div')
    corrDiv.classList.add('campaignCorrDisplay')

    const corrIcon = document.createElement('img')
    corrIcon.src = `Pictures/${IconSets[player.iconSet][0]}/${corrIcons[corrKey]}`
    corrDiv.appendChild(corrIcon)

    const corrText = document.createElement('p')
    corrText.textContent = `lv${level} | ${i18next.t(`campaigns.corruptionTexts.${corrKey}`, {
      effect: format(usableCorruption.corruptionEffects(corrKey), 2, true)
    })}`
    corrDiv.appendChild(corrText)

    campaignCorrDiv.appendChild(corrDiv)
  }
  
  const corruptionScoreMultiplierText = document.createElement('p')
  corruptionScoreMultiplierText.textContent = i18next.t('campaigns.corruptionStats.corruptionScoreMult', {
    mult: format(usableCorruption.totalCorruptionAscensionMultiplier, 0, true)
  })

  const totalCorruptionDifficultyScoreText = document.createElement('p')
  totalCorruptionDifficultyScoreText.textContent = i18next.t('campaigns.corruptionStats.corruptionDifficulty', {
    difficulty: format(usableCorruption.totalCorruptionDifficultyScore, 0, true)
  })

  const highestc10CompletionText = document.createElement('p')
  highestc10CompletionText.textContent = i18next.t('campaigns.corruptionStats.highestc10Completion', {
    c10: campaign.c10Completions,
    maxc10: campaignDatas[key].limit
  })

  const tokensEarnedText = document.createElement('p')
  tokensEarnedText.textContent = i18next.t('campaigns.corruptionStats.tokensEarned', {
    tokens: campaign.computeTokenValue(),
    maxTokens: campaign.computeTokenValue(campaignDatas[key].limit)
  })

  let metaText = document.createElement('p')
  if (campaignDatas[key].isMeta) {
    metaText.textContent = i18next.t('campaigns.corruptionStats.metaText')
    metaText.style.color = 'gold'
  }

  let campaignButton = document.createElement('button')
  if (player.campaigns.current === key) {
    campaignButton.textContent = i18next.t('campaigns.corruptionStats.resetCampaign')
    campaignButton.onclick = async () => {
      if (player.challengecompletions[10] === 0) {
        const p = await Confirm(i18next.t('campaigns.noChallengeCompletionConfirm'))
        if (!p) { return }
      }
      reset('ascension')
    }
  }
  else {
    campaignButton.textContent = i18next.t('campaigns.corruptionStats.startCampaign')
    campaignButton.onclick = () => {
      reset('ascension')
      player.campaigns.campaign = key
    }
  }

  let saveLoadoutButton = document.createElement('button')
  saveLoadoutButton.classList.add('chal14')
  saveLoadoutButton.textContent = i18next.t('campaigns.saveLoadout')
  saveLoadoutButton.onclick = () => {
    player.corruptions.next = new CorruptionLoadout(usableCorruption.loadout)
    corruptionStatsUpdate()
    Notification(i18next.t('campaigns.saveLoadoutNotification', { name: i18next.t(`campaigns.data.${key}.name`) }))
  }

  corruptionStats.appendChild(corruptionScoreMultiplierText)
  corruptionStats.appendChild(totalCorruptionDifficultyScoreText)
  corruptionStats.appendChild(highestc10CompletionText)
  corruptionStats.appendChild(tokensEarnedText)
  if (campaignDatas[key].isMeta) {
    corruptionStats.appendChild(metaText)
  }
  corruptionStats.appendChild(campaignButton)
  corruptionStats.appendChild(saveLoadoutButton)
}

export const createCampaignIconHTMLS = () => {
  const campaignIconDiv = DOMCacheGetOrSet('campaignIconGrid')
  // Reset existing Icons
  campaignIconDiv.innerHTML = ''

  for (const key of Object.keys(campaignDatas) as CampaignKeys[]) {
    const campaignIcon = document.createElement('img')
    campaignIcon.id = `${key}CampaignIcon`
    campaignIcon.classList.add('campaignIcon')
    campaignIcon.src = `Pictures/${IconSets[player.iconSet][0]}/Quark.png`

    campaignIconDiv.appendChild(campaignIcon)
    campaignIconHTMLUpdate(key)

    campaignIcon.onclick = () => {
      campaignCorruptionStatHTMLUpdate(key)
}
}}

export const campaignTokenRewardHTMLUpdate = () => {
  // Reset HTMLs for the Icons
  DOMCacheGetOrSet('campaignTokenRewardIcons').innerHTML = ''
  DOMCacheGetOrSet('campaignTokenRewardText').textContent = ''

  DOMCacheGetOrSet('campaignTokenCount').textContent = i18next.t('campaigns.tokens.count', { count: player.campaigns.tokens, maxCount: player.campaigns.maxTokens })

  const tokenCount = player.campaigns.tokens

  for (const [key, value] of Object.entries(campaignTokenRewardDatas)) {

    // Create a new Icon if the player has enough tokens and extra requirements are met
    if (tokenCount >= value.tokenRequirement && (value.otherUnlockRequirement === undefined || value.otherUnlockRequirement())) {
      const tokenIcon = document.createElement('img')
      tokenIcon.src = `Pictures/${IconSets[player.iconSet][0]}/Quark.png`
      tokenIcon.classList.add('campaignTokenRewardIcon')

      if (typeof value.reward() === 'string') {
        tokenIcon.onclick = () => {
          DOMCacheGetOrSet('campaignTokenRewardText').textContent = i18next.t(`campaigns.tokens.rewardTexts.${key}`, {reward: value.reward()})
        }
      }
      else {
        tokenIcon.onclick = () => {
          const reward = value.reward() as Partial<Record<CampaignTokenRewardNames, string>>
          DOMCacheGetOrSet('campaignTokenRewardText').textContent = i18next.t(`campaigns.tokens.rewardTexts.${key}`, reward)
        }
      }


      DOMCacheGetOrSet('campaignTokenRewardIcons').appendChild(tokenIcon)
    }

  }

}

export const campaignTest = () => {
  const campaignIconDiv = DOMCacheGetOrSet('campaignIconGrid')

  for (let i = 0; i < 50; i++) {
    const campaignIcon = document.createElement('img')
    campaignIcon.classList.add('campaignIcon')
    campaignIcon.src = `Pictures/${IconSets[player.iconSet][0]}/Quark.png`
    campaignIconDiv.appendChild(campaignIcon)
  }
}
