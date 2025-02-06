import i18next from 'i18next'
import { CorruptionLoadout, type Corruptions } from './Corruptions'
import { player } from './Synergism'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { IconSets } from './Themes'

export type AscensionModifiers = 'GlobalSpeed'

export type CampaignLoadout = Partial<Corruptions>
export type CampaignModifiers = Partial<Record<AscensionModifiers, number>>

export type CampaignKeys = 'test1' | 'test2' | 'test3'

export interface ICampaignManagerData {
  currentCampaign?: CampaignKeys | undefined
  campaigns?: Record<CampaignKeys, number>
}

export interface ICampaignData {
  campaignCorruptions: Partial<Corruptions>
  campaignModifiers: CampaignModifiers
  limit: number
  isMeta: boolean
}

export class CampaignManager {
  private totalCampaignTokens: number
  private currentCampaign: Campaign | undefined
  private campaigns!: Record<CampaignKeys, Campaign>

  constructor (campaignManagerData?: ICampaignManagerData) {
    this.campaigns = {} as Record<CampaignKeys, Campaign>
    if (campaignManagerData !== undefined) {
      for (const campaignKey of Object.keys(campaignDatas)) {
        const key = campaignKey as keyof typeof campaignDatas
        this.campaigns[key] = new Campaign(campaignDatas[key], key, campaignManagerData.campaigns?.[key])
      }
      const currentKey = campaignManagerData.currentCampaign
      if (currentKey !== undefined) {
        this.currentCampaign = this.campaigns[currentKey]
        player.corruptions.used = new CorruptionLoadout(this.currentCampaign.campaignCorruptions)
      } else {
        this.currentCampaign = undefined
      }
    }
    else {
      for (const campaignKey of Object.keys(campaignDatas)) {
        const key = campaignKey as keyof typeof campaignDatas
        this.campaigns[key] = new Campaign(campaignDatas[key], key, 0)
      }
      this.currentCampaign = undefined
    }
    this.totalCampaignTokens = this.computeTotalCampaignTokens()
  }

  computeTotalCampaignTokens = () => {
    let sum = 0
    for (const campaign in this.campaigns) {
      const key = campaign as keyof typeof this.campaigns
      sum += this.campaigns[key].computeTokenValue()
    }
    return sum
  }

  get tokens () {
    return this.totalCampaignTokens
  }

  get current () {
    return this.currentCampaign
  }

  // Store as this in player
  get c10Completions (): Record<CampaignKeys, number> {
    return Object.fromEntries(
      Object.entries(this.campaigns).map(([key, value]) => [key, value.c10Completions])
    ) as Record<CampaignKeys, number>
  }
}

export class Campaign {
  // Stored as variable out of scope
  name: string
  description: string
  campaignCorruptions: CampaignLoadout
  campaignModifiers: CampaignModifiers
  limit: number
  isMeta: boolean

  // Saved as a variable
  _c10Completions = 0

  constructor (campaignData: ICampaignData, key: string, c10?: number) {
    this.name = i18next.t(`campaigns.data.${key}.name`)
    this.description = i18next.t(`campaigns.data.${key}.description`)
    this.campaignCorruptions = campaignData.campaignCorruptions
    this.campaignModifiers = campaignData.campaignModifiers
    this.limit = campaignData.limit
    this.isMeta = campaignData.isMeta
    this._c10Completions = c10 ?? 0
  }

  public computeTokenValue = () => {
    const metaMultiplier = this.isMeta ? 2 : 1
    return metaMultiplier * Math.min(this.c10Completions, this.limit)
  }

  public createUsableLoadout = (): CorruptionLoadout => {
    return new CorruptionLoadout(this.campaignCorruptions)
  }

  public set c10Completions (value: number) {
    this._c10Completions = Math.min(value, this.limit)
  }
  public get c10Completions () {
    return this._c10Completions
  }
}

export const campaignDatas: Record<CampaignKeys, ICampaignData> = {
  test1: {
    campaignCorruptions: {
      viscosity: 1
    },
    campaignModifiers: {
      GlobalSpeed: 1
    },
    isMeta: true,
    limit: 10
  },
  test2: {
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
  test3: {
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