import i18next from "i18next"
import { CorruptionLoadout, type Corruptions } from "./Corruptions"
import { player } from "./Synergism"

export type AscensionModifiers = 'GlobalSpeed'

export type CampaignLoadout = Partial<Corruptions>
export type CampaignModifiers = Partial<Record<AscensionModifiers, number>>

export type CampaignKeys = 'test1' | 'test2' | 'test3'

export interface ICampaignManagerData {
    currentCampaign: CampaignKeys | undefined
    campaigns: Record<CampaignKeys, ICampaignData>
}

export interface ICampaignData {
    campaignLoadout: CampaignLoadout,
    campaignModifiers: CampaignModifiers,
    limit: number,
    isMeta: boolean
    c10Completions?: number
}

export class CampaignManager {

    totalCampaignTokens: number
    currentCampaign: Campaign | undefined
    campaigns!: Record<CampaignKeys, Campaign>

    constructor(campaignManagerData: ICampaignManagerData) {
        
        for (const campaignKey of Object.keys(campaignManagerData.campaigns)) {
            const key = campaignKey as keyof typeof campaignManagerData.campaigns
            this.campaigns[key] = new Campaign(campaignDatas[key], key)
        }

        const currentKey = campaignManagerData.currentCampaign

        if (currentKey !== undefined) {
            this.currentCampaign = this.campaigns[currentKey]
            player.corruptions.used = this.currentCampaign.createUsableLoadout()
        }
        else {
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

}

export class Campaign {

    // Stored as variable out of scope
    name: string
    description: string
    campaignLoadout: CampaignLoadout
    campaignModifiers: CampaignModifiers
    limit: number
    isMeta: boolean
    
    // Saved as a variable
    _c10Completions = 0

    constructor(campaignData: ICampaignData, key: string) {
        this.name = i18next.t(`campaigns.data.${key}.name`)
        this.description = i18next.t(`campaigns.data.${key}.description`)
        this.campaignLoadout = campaignData.campaignLoadout
        this.campaignModifiers = campaignData.campaignModifiers
        this.limit = campaignData.limit
        this.isMeta = campaignData.isMeta
        this._c10Completions = campaignData.c10Completions ?? 0
    }

    public computeTokenValue = () => {
        const metaMultiplier = this.isMeta ? 2: 1
        return metaMultiplier * Math.min(this.c10Completions, this.limit)
    }

    public createUsableLoadout = (): CorruptionLoadout => {
        return new CorruptionLoadout(this.campaignLoadout)
    }
    
    public set c10Completions(value: number) {
        this._c10Completions = Math.min(value, this.limit)
    }
    public get c10Completions() {
        return this._c10Completions
    }

}

export const campaignDatas: Record<CampaignKeys, ICampaignData> = {
    test1: {
        campaignLoadout: {
            'viscosity': 1
        },
        campaignModifiers: {
            'GlobalSpeed': 1
        },
        isMeta: true,
        limit: 10,
    },
    test2: {
        campaignLoadout: {
            'viscosity': 1,
            'deflation': 1
        },
        campaignModifiers: {
            'GlobalSpeed': 1
        },
        isMeta: true,
        limit: 15,
    },
    test3: {
        campaignLoadout: {
            'viscosity': 1,
            'deflation': 1,
            'dilation': 1,
        },
        campaignModifiers: {
            'GlobalSpeed': 1
        },
        isMeta: true,
        limit: 20,
    }
}   
