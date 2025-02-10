import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { corrIcons, CorruptionLoadout, type Corruptions, corruptionsSchema } from './Corruptions'
import { format, player } from './Synergism'
import { IconSets } from './Themes'
import { reset } from './Reset'

export type AscensionModifiers = 'GlobalSpeed'

export type CampaignLoadout = Corruptions
export type CampaignModifiers = Partial<Record<AscensionModifiers, number>>

export type CampaignKeys = 'first' | 'second' | 'third' | 'chal11' | 'ultimate'

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

  constructor (campaignManagerData?: ICampaignManagerData) {
    this.#campaigns = {
      first: new Campaign(campaignDatas.first, 'test1', campaignManagerData?.campaigns?.first ?? 0),
      second: new Campaign(campaignDatas.second, 'test2', campaignManagerData?.campaigns?.second ?? 0),
      third: new Campaign(campaignDatas.third, 'test3', campaignManagerData?.campaigns?.third ?? 0),
      chal11: new Campaign(campaignDatas.chal11, 'test4', campaignManagerData?.campaigns?.chal11 ?? 0),
      ultimate: new Campaign(campaignDatas.ultimate, 'test4', campaignManagerData?.campaigns?.ultimate ?? 0)
    }

    this.#currentCampaign = campaignManagerData?.currentCampaign ?? undefined

    if (campaignManagerData?.currentCampaign !== undefined) {
      this.#currentCampaign = campaignManagerData.currentCampaign
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
    return this.computeTotalCampaignTokens()
  }

  get maxTokens () {
    return this.computeMaxCampaignTokens()
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
    console.log('test1')
    player.corruptions.used = new CorruptionLoadout(this.#campaigns[key].campaignCorruptions)
    console.log('test2', player.corruptions.used)
  }

  set c10Completions (c10: number) {
    if (this.#currentCampaign) {
      this.#campaigns[this.#currentCampaign].c10Completions = c10
    }
  }

  resetCampaign (c10: number) {
    if (this.#currentCampaign) {
      this.c10Completions = c10
      this.#currentCampaign = undefined
    } 
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
  }
}

export const createCampaignIconHTMLS = () => {
  const campaignIconDiv = DOMCacheGetOrSet('campaignIconGrid')
  for (const key of Object.keys(campaignDatas) as CampaignKeys[]) {
    const campaignIcon = document.createElement('img')
    campaignIcon.classList.add('campaignIcon')
    campaignIcon.src = `Pictures/${IconSets[player.iconSet][0]}/Quark.png`
    campaignIconDiv.appendChild(campaignIcon)

    campaignIcon.onclick = () => {
      // Clear existing HTMLS
      DOMCacheGetOrSet('campaignCorruptions').innerHTML = ''
      DOMCacheGetOrSet('campaignCorruptionStats').innerHTML = ''


      DOMCacheGetOrSet('campaignName').textContent = i18next.t(`campaigns.data.${key}.name`)
      DOMCacheGetOrSet('campaignDesc').textContent = i18next.t(`campaigns.data.${key}.description`)

      const campaignCorrDiv = DOMCacheGetOrSet('campaignCorruptions')
      const usableCorruption = new CorruptionLoadout(corruptionsSchema.parse(campaignDatas[key].campaignCorruptions))
      const campaign = player.campaigns.getCampaign(key)
      console.log(usableCorruption.totalCorruptionAscensionMultiplier)
      // Display all present corruptions, levels and their effects
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

      // Display Corruption Stats
      const corruptionStats = DOMCacheGetOrSet('campaignCorruptionStats')

      const corruptionStatsIntro = document.createElement('p')
      corruptionStatsIntro.textContent = i18next.t('campaigns.corruptionStats.title')
      corruptionStats.appendChild(corruptionStatsIntro)

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
        corruptionStats.appendChild(metaText)
      }

      let campaignButton = document.createElement('button')
      if (player.campaigns.current === key) {
        campaignButton.textContent = i18next.t('campaigns.corruptionStats.resetCampaign')
        campaignButton.onclick = () => {
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



      corruptionStats.appendChild(corruptionScoreMultiplierText)
      corruptionStats.appendChild(totalCorruptionDifficultyScoreText)
      corruptionStats.appendChild(highestc10CompletionText)
      corruptionStats.appendChild(tokensEarnedText)
      if (campaignDatas[key].isMeta) {
        corruptionStats.appendChild(metaText)
      }
      corruptionStats.appendChild(campaignButton)
  }
}}

export const campaignTest = () => {
  const campaignIconDiv = DOMCacheGetOrSet('campaignIconGrid')

  for (let i = 0; i < 50; i++) {
    const campaignIcon = document.createElement('img')
    campaignIcon.classList.add('campaignIcon')
    campaignIcon.src = `Pictures/${IconSets[player.iconSet][0]}/Quark.png`
    campaignIconDiv.appendChild(campaignIcon)
  }
}
