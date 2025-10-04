import i18next from 'i18next'
import { awardAchievementGroup } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { inheritanceTokens, isIARuneUnlocked, singularityBonusTokenMult } from './Calculate'
import {
  corrIcons,
  CorruptionLoadout,
  type Corruptions,
  corruptionsSchema,
  corruptionStatsUpdate,
  maxCorruptionLevel
} from './Corruptions'
import { getOcteractUpgradeEffect } from './Octeracts'
import { reset } from './Reset'
import { getGQUpgradeEffect } from './singularity'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { IconSets } from './Themes'
import { Alert, Confirm, Notification } from './UpdateHTML'

export let campaignTokens = 0
export let maxCampaignTokens = 0

export type CampaignKeys =
  | 'first'
  | 'second'
  | 'third'
  | 'fourth'
  | 'fifth'
  | 'sixth'
  | 'seventh'
  | 'eighth'
  | 'ninth'
  | 'tenth'
  | 'eleventh'
  | 'twelfth'
  | 'thirteenth'
  | 'fourteenth'
  | 'fifteenth'
  | 'sixteenth'
  | 'seventeenth'
  | 'eighteenth'
  | 'nineteenth'
  | 'twentieth'
  | 'twentyFirst'
  | 'twentySecond'
  | 'twentyThird'
  | 'twentyFourth'
  | 'twentyFifth'
  | 'twentySixth'
  | 'twentySeventh'
  | 'twentyEighth'
  | 'twentyNinth'
  | 'thirtieth'
  | 'thirtyFirst'
  | 'thirtySecond'
  | 'thirtyThird'
  | 'thirtyFourth'
  | 'thirtyFifth'
  | 'thirtySixth'
  | 'thirtySeventh'
  | 'thirtyEighth'
  | 'thirtyNinth'
  | 'fortieth'
  | 'fortyFirst'
  | 'fortySecond'
  | 'fortyThird'
  | 'fortyFourth'
  | 'fortyFifth'
  | 'fortySixth'
  | 'fortySeventh'
  | 'fortyEighth'
  | 'fortyNinth'
  | 'fiftieth'

export type CampaignTokenRewardNames =
  | 'tutorial'
  | 'cube'
  | 'obtainium'
  | 'offering'
  | 'ascensionScore'
  | 'timeThreshold'
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
  unlockRequirement: () => boolean
  limit: number
  isMeta: boolean
  cardinal: number
}

export class CampaignManager {
  #currentCampaign: CampaignKeys | undefined
  #campaigns: Record<CampaignKeys, Campaign>

  constructor (campaignManagerData?: ICampaignManagerData) {
    this.#campaigns = {
      first: new Campaign(campaignDatas.first, 'first', campaignManagerData?.campaigns?.first ?? 0),
      second: new Campaign(campaignDatas.second, 'second', campaignManagerData?.campaigns?.second ?? 0),
      third: new Campaign(campaignDatas.third, 'third', campaignManagerData?.campaigns?.third ?? 0),
      fourth: new Campaign(campaignDatas.fourth, 'fourth', campaignManagerData?.campaigns?.fourth ?? 0),
      fifth: new Campaign(campaignDatas.fifth, 'fifth', campaignManagerData?.campaigns?.fifth ?? 0),
      sixth: new Campaign(campaignDatas.sixth, 'sixth', campaignManagerData?.campaigns?.sixth ?? 0),
      seventh: new Campaign(campaignDatas.seventh, 'seventh', campaignManagerData?.campaigns?.seventh ?? 0),
      eighth: new Campaign(campaignDatas.eighth, 'eighth', campaignManagerData?.campaigns?.eighth ?? 0),
      ninth: new Campaign(campaignDatas.ninth, 'ninth', campaignManagerData?.campaigns?.ninth ?? 0),
      tenth: new Campaign(campaignDatas.tenth, 'tenth', campaignManagerData?.campaigns?.tenth ?? 0),
      eleventh: new Campaign(campaignDatas.eleventh, 'eleventh', campaignManagerData?.campaigns?.eleventh ?? 0),
      twelfth: new Campaign(campaignDatas.twelfth, 'twelfth', campaignManagerData?.campaigns?.twelfth ?? 0),
      thirteenth: new Campaign(campaignDatas.thirteenth, 'thirteenth', campaignManagerData?.campaigns?.thirteenth ?? 0),
      fourteenth: new Campaign(campaignDatas.fourteenth, 'fourteenth', campaignManagerData?.campaigns?.fourteenth ?? 0),
      fifteenth: new Campaign(campaignDatas.fifteenth, 'fifteenth', campaignManagerData?.campaigns?.fifteenth ?? 0),
      sixteenth: new Campaign(campaignDatas.sixteenth, 'sixteenth', campaignManagerData?.campaigns?.sixteenth ?? 0),
      seventeenth: new Campaign(
        campaignDatas.seventeenth,
        'seventeenth',
        campaignManagerData?.campaigns?.seventeenth ?? 0
      ),
      eighteenth: new Campaign(campaignDatas.eighteenth, 'eighteenth', campaignManagerData?.campaigns?.eighteenth ?? 0),
      nineteenth: new Campaign(campaignDatas.nineteenth, 'nineteenth', campaignManagerData?.campaigns?.nineteenth ?? 0),
      twentieth: new Campaign(campaignDatas.twentieth, 'twentieth', campaignManagerData?.campaigns?.twentieth ?? 0),
      twentyFirst: new Campaign(
        campaignDatas.twentyFirst,
        'twentyFirst',
        campaignManagerData?.campaigns?.twentyFirst ?? 0
      ),
      twentySecond: new Campaign(
        campaignDatas.twentySecond,
        'twentySecond',
        campaignManagerData?.campaigns?.twentySecond ?? 0
      ),
      twentyThird: new Campaign(
        campaignDatas.twentyThird,
        'twentyThird',
        campaignManagerData?.campaigns?.twentyThird ?? 0
      ),
      twentyFourth: new Campaign(
        campaignDatas.twentyFourth,
        'twentyFourth',
        campaignManagerData?.campaigns?.twentyFourth ?? 0
      ),
      twentyFifth: new Campaign(
        campaignDatas.twentyFifth,
        'twentyFifth',
        campaignManagerData?.campaigns?.twentyFifth ?? 0
      ),
      twentySixth: new Campaign(
        campaignDatas.twentySixth,
        'twentySixth',
        campaignManagerData?.campaigns?.twentySixth ?? 0
      ),
      twentySeventh: new Campaign(
        campaignDatas.twentySeventh,
        'twentySeventh',
        campaignManagerData?.campaigns?.twentySeventh ?? 0
      ),
      twentyEighth: new Campaign(
        campaignDatas.twentyEighth,
        'twentyEighth',
        campaignManagerData?.campaigns?.twentyEighth ?? 0
      ),
      twentyNinth: new Campaign(
        campaignDatas.twentyNinth,
        'twentyNinth',
        campaignManagerData?.campaigns?.twentyNinth ?? 0
      ),
      thirtieth: new Campaign(campaignDatas.thirtieth, 'thirtieth', campaignManagerData?.campaigns?.thirtieth ?? 0),
      thirtyFirst: new Campaign(
        campaignDatas.thirtyFirst,
        'thirtyFirst',
        campaignManagerData?.campaigns?.thirtyFirst ?? 0
      ),
      thirtySecond: new Campaign(
        campaignDatas.thirtySecond,
        'thirtySecond',
        campaignManagerData?.campaigns?.thirtySecond ?? 0
      ),
      thirtyThird: new Campaign(
        campaignDatas.thirtyThird,
        'thirtyThird',
        campaignManagerData?.campaigns?.thirtyThird ?? 0
      ),
      thirtyFourth: new Campaign(
        campaignDatas.thirtyFourth,
        'thirtyFourth',
        campaignManagerData?.campaigns?.thirtyFourth ?? 0
      ),
      thirtyFifth: new Campaign(
        campaignDatas.thirtyFifth,
        'thirtyFifth',
        campaignManagerData?.campaigns?.thirtyFifth ?? 0
      ),
      thirtySixth: new Campaign(
        campaignDatas.thirtySixth,
        'thirtySixth',
        campaignManagerData?.campaigns?.thirtySixth ?? 0
      ),
      thirtySeventh: new Campaign(
        campaignDatas.thirtySeventh,
        'thirtySeventh',
        campaignManagerData?.campaigns?.thirtySeventh ?? 0
      ),
      thirtyEighth: new Campaign(
        campaignDatas.thirtyEighth,
        'thirtyEighth',
        campaignManagerData?.campaigns?.thirtyEighth ?? 0
      ),
      thirtyNinth: new Campaign(
        campaignDatas.thirtyNinth,
        'thirtyNinth',
        campaignManagerData?.campaigns?.thirtyNinth ?? 0
      ),
      fortieth: new Campaign(campaignDatas.fortieth, 'fortieth', campaignManagerData?.campaigns?.fortieth ?? 0),
      fortyFirst: new Campaign(campaignDatas.fortyFirst, 'fortyFirst', campaignManagerData?.campaigns?.fortyFirst ?? 0),
      fortySecond: new Campaign(
        campaignDatas.fortySecond,
        'fortySecond',
        campaignManagerData?.campaigns?.fortySecond ?? 0
      ),
      fortyThird: new Campaign(campaignDatas.fortyThird, 'fortyThird', campaignManagerData?.campaigns?.fortyThird ?? 0),
      fortyFourth: new Campaign(
        campaignDatas.fortyFourth,
        'fortyFourth',
        campaignManagerData?.campaigns?.fortyFourth ?? 0
      ),
      fortyFifth: new Campaign(campaignDatas.fortyFifth, 'fortyFifth', campaignManagerData?.campaigns?.fortyFifth ?? 0),
      fortySixth: new Campaign(campaignDatas.fortySixth, 'fortySixth', campaignManagerData?.campaigns?.fortySixth ?? 0),
      fortySeventh: new Campaign(
        campaignDatas.fortySeventh,
        'fortySeventh',
        campaignManagerData?.campaigns?.fortySeventh ?? 0
      ),
      fortyEighth: new Campaign(
        campaignDatas.fortyEighth,
        'fortyEighth',
        campaignManagerData?.campaigns?.fortyEighth ?? 0
      ),
      fortyNinth: new Campaign(campaignDatas.fortyNinth, 'fortyNinth', campaignManagerData?.campaigns?.fortyNinth ?? 0),
      fiftieth: new Campaign(campaignDatas.fiftieth, 'fiftieth', campaignManagerData?.campaigns?.fiftieth ?? 0)
    }

    this.#currentCampaign = campaignManagerData?.currentCampaign ?? undefined
    if (this.#currentCampaign !== undefined) {
      player.corruptions.used = new CorruptionLoadout(
        this.#campaigns[this.#currentCampaign].campaignCorruptions
      )
    }
  }

  computeMaxCampaignTokens () {
    let sum = 0
    for (const campaign of Object.values(this.#campaigns)) {
      sum += campaign.maxTokens
    }

    sum += inheritanceTokens()
    sum += getGQUpgradeEffect('singBonusTokens4')
    sum += getOcteractUpgradeEffect('octeractBonusTokens4')

    return sum
  }

  get current () {
    return this.#currentCampaign
  }

  get currentCampaign () {
    if (this.#currentCampaign === undefined) {
      return undefined
    }
    return this.#campaigns[this.#currentCampaign]
  }

  get allCampaigns () {
    return this.#campaigns
  }

  getCampaign (key: CampaignKeys) {
    return this.#campaigns[key]
  }

  get allC10Completions () {
    return Object.fromEntries(
      Object.entries(this.#campaigns).map(([key, campaign]) => [key, campaign.c10Completions])
    ) as Record<CampaignKeys, number>
  }

  // Set to player.
  get campaignManagerData () {
    return {
      currentCampaign: this.#currentCampaign,
      campaigns: this.allC10Completions
    } satisfies ICampaignManagerData
  }

  set campaign (key: CampaignKeys) {
    this.#currentCampaign = key
    player.corruptions.used = new CorruptionLoadout(this.#campaigns[key].campaignCorruptions)
    corruptionStatsUpdate()
    campaignIconHTMLUpdate(key)
    campaignCorruptionStatHTMLUpdate(key)
    // Update Campaign Active Text
    activeCampaignTextHTML()
  }

  set c10Completions (c10: number) {
    if (this.#currentCampaign) {
      this.#campaigns[this.#currentCampaign].c10Completions = c10
    }
  }

  // Use this when autocompleting Campaigns based on corruption loadouts
  // (Only for Singularity 4 or beyond)
  setC10ToArbitrary (key: CampaignKeys, c10: number) {
    this.#campaigns[key].c10Completions = c10
  }

  resetCampaign (c10: number) {
    const savedKey = this.#currentCampaign
    if (this.#currentCampaign) {
      this.c10Completions = c10
      this.#currentCampaign = undefined

      // Update Token Count for player
      updateTokens()
      updateMaxTokens()
      campaignTokenRewardHTMLUpdate()

      // Update Campaign Active Text
      activeCampaignTextHTML()
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
      cubeBonus: 1 + 0.25 * +(campaignTokens > 0),
      obtainiumBonus: 1 + 0.2 * +(campaignTokens > 0),
      offeringBonus: 1 + 0.2 * +(campaignTokens > 0)
    }
  }

  get cubeBonus () {
    return 1
      + 0.4 * 1 / 25 * Math.min(campaignTokens, 25)
      + 0.6 * (1 - Math.exp(-Math.max(campaignTokens - 25, 0) / 500))
      + 1 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  }

  get obtainiumBonus () {
    return 1
      + 0.1 * 1 / 25 * Math.min(campaignTokens, 25)
      + 0.4 * (1 - Math.exp(-Math.max(campaignTokens - 25, 0) / 500))
      + 0.5 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  }

  get offeringBonus () {
    return 1
      + 0.1 * 1 / 25 * Math.min(campaignTokens, 25)
      + 0.4 * (1 - Math.exp(-Math.max(campaignTokens - 25, 0) / 500))
      + 0.5 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  }

  get ascensionScoreMultiplier () {
    return 1
      + 0.2 * 1 / 100 * Math.min(campaignTokens, 100)
      + 0.3 * (1 - Math.exp(-Math.max(campaignTokens - 100, 0) / 1000))
      + 0.5 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 5000))
  }
  /**
   * Returns the time threshold reduction for Prestige, Reincarnation and Ascension
   * Threshold is defined as having quadratic penalty if your reset lasts less than X seconds
   * Reducing the threshold reduces the denominator of the penalty, e.g. if the base is 10 seconds,
   * the penalty is *(time/10)^2, reducing the threshold to 5 seconds would make the penalty *(time/5)^2
   */
  get timeThresholdReduction () {
    const thresholdReqs = [20, 100, 250, 500, 1000, 2000, 3500, 5000]
    for (let i = 0; i < thresholdReqs.length; i++) {
      if (campaignTokens < thresholdReqs[i]) {
        return i / 4
      }
    }
    return 2
  }

  get quarkBonus () {
    if (campaignTokens < 100) {
      return 1
    } else {
      return 1
        + 0.05 * Math.min(campaignTokens - 100, 100) / 100
        + 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 200, 0) / 3000))
        + 0.1 * (1 - Math.exp(-Math.max(campaignTokens - 2500, 0) / 10000))
    }
  }

  get taxMultiplier () {
    if (campaignTokens < 250) {
      return 1
    }
    return 1
      - 0.05 * 1 / 250 * Math.min(campaignTokens - 250, 250)
      - 0.15 * (1 - Math.exp(-Math.max(campaignTokens - 500, 0) / 1250))
      - 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 5000))
  }

  get c15Bonus () {
    if (campaignTokens < 250) {
      return 1
    }
    return 1
      + 0.05 * 1 / 250 * Math.min(campaignTokens - 250, 250)
      + 0.95 * (1 - Math.exp(-Math.max(campaignTokens - 500, 0) / 1250))
  }

  get bonusRune6 () {
    const thresholdReqs = [500, 750, 1000, 1250, 1500, 1750, 2000, 3000, 4000, 6000, 8000, 10000]
    for (let i = 0; i < thresholdReqs.length; i++) {
      if (campaignTokens < thresholdReqs[i]) {
        return i
      }
    }
    return 12
  }

  get goldenQuarkBonus () {
    if (campaignTokens < 500) {
      return 1
    }
    return 1
      + 0.05 * 1 / 500 * Math.min(campaignTokens - 500, 500)
      + 0.05 * (1 - Math.exp(-Math.max(campaignTokens - 1000, 0) / 2500))
  }

  get octeractBonus () {
    if (campaignTokens < 1000) {
      return 1
    }
    return 1
      + 0.1 * 1 / 1000 * Math.min(campaignTokens - 1000, 1000)
      + 0.15 * (1 - Math.exp(-Math.max(campaignTokens - 2000, 0) / 4000))
  }

  get ambrosiaLuckBonus () {
    if (campaignTokens < 2000) {
      return 0
    }
    return 10
      + 40 * 1 / 2000 * Math.min(campaignTokens - 2000, 2000)
      + 50 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 2500))
  }

  get blueberrySpeedBonus () {
    if (campaignTokens < 2000) {
      return 1
    }
    return 1
      + 0.02 * 1 / 2000 * Math.min(campaignTokens - 2000, 2000)
      + 0.03 * (1 - Math.exp(-Math.max(campaignTokens - 4000, 0) / 2000))
  }
}

export const updateTokens = () => {
  let sum = 0
  for (const campaign of Object.values(player.campaigns.allCampaigns)) {
    sum += campaign.tokens
  }

  sum += inheritanceTokens()
  sum += getGQUpgradeEffect('singBonusTokens4')
  sum += getOcteractUpgradeEffect('octeractBonusTokens4')
  campaignTokens = sum

  awardAchievementGroup('campaignTokens')
}

export const updateMaxTokens = () => {
  let sum = 0
  for (const campaign of Object.values(player.campaigns.allCampaigns)) {
    sum += campaign.maxTokens
  }

  sum += inheritanceTokens()
  sum += getGQUpgradeEffect('singBonusTokens4')
  sum += getOcteractUpgradeEffect('octeractBonusTokens4')

  maxCampaignTokens = sum
}

export class Campaign {
  #name: string
  #description: string
  #campaignCorruptions: Corruptions
  #limit: number
  #isMeta: boolean
  #campaignCorruptionLoadout: CorruptionLoadout
  #c10Completions = 0

  constructor (campaignData: ICampaignData, key: string, c10?: number) {
    this.#name = i18next.t(`campaigns.data.${key}.name`)
    this.#description = i18next.t(`campaigns.data.${key}.description`)
    this.#campaignCorruptions = corruptionsSchema.parse(campaignData.campaignCorruptions)
    this.#limit = campaignData.limit
    this.#isMeta = campaignData.isMeta
    this.#c10Completions = c10 ?? 0

    const temp = this.#campaignCorruptions

    this.#campaignCorruptionLoadout = new CorruptionLoadout(temp)
  }

  public computeTokenValue = (amount?: number) => {
    const completed = Math.min(amount ?? this.#c10Completions, this.#limit)

    let additiveTotal = 0
    additiveTotal += completed // Base

    if (completed >= 1) { // TODO in day 1: Make into own method?
      if (player.highestSingularityCount >= 16) {
        additiveTotal += 5
      }
      additiveTotal += getGQUpgradeEffect('singBonusTokens1')
      additiveTotal += getOcteractUpgradeEffect('octeractBonusTokens3')
    }

    if (completed === this.#limit) {
      if (player.highestSingularityCount >= 69) {
        additiveTotal += 10
      }
      additiveTotal += getGQUpgradeEffect('singBonusTokens3')
      additiveTotal += getOcteractUpgradeEffect('octeractBonusTokens1')
    }

    let multiplier = 1

    multiplier *= this.#isMeta ? 2 : 1
    multiplier *= singularityBonusTokenMult()
    multiplier *= getGQUpgradeEffect('singBonusTokens2')
    multiplier *= getOcteractUpgradeEffect('octeractBonusTokens2')
    return Math.floor(additiveTotal * multiplier)
  }

  get usableLoadout () {
    return this.#campaignCorruptionLoadout
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
    isMeta: false,
    unlockRequirement: () => {
      return true
    },
    limit: 10,
    cardinal: 1
  },
  second: {
    campaignCorruptions: {
      drought: 1
    },
    isMeta: true,
    unlockRequirement: () => {
      return true
    },
    limit: 10,
    cardinal: 2
  },
  third: {
    campaignCorruptions: {
      viscosity: 1,
      drought: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return true
    },
    limit: 10,
    cardinal: 3
  },
  fourth: {
    campaignCorruptions: {
      viscosity: 2,
      drought: 2
    },
    isMeta: false,
    unlockRequirement: () => {
      return true
    },
    limit: 10,
    cardinal: 4
  },
  fifth: {
    campaignCorruptions: {
      viscosity: 3,
      drought: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return true
    },
    limit: 10,
    cardinal: 5
  },
  sixth: {
    campaignCorruptions: {
      viscosity: 4,
      drought: 4
    },
    isMeta: false,
    unlockRequirement: () => {
      return true
    },
    limit: 15,
    cardinal: 6
  },
  seventh: {
    campaignCorruptions: {
      viscosity: 5,
      drought: 5
    },
    isMeta: true,
    unlockRequirement: () => {
      return true
    },
    limit: 15,
    cardinal: 7
  },
  eighth: {
    campaignCorruptions: {
      viscosity: 1,
      drought: 1,
      deflation: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 15,
    cardinal: 8
  },
  ninth: {
    campaignCorruptions: {
      viscosity: 3,
      drought: 1,
      deflation: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 15,
    cardinal: 9
  },
  tenth: {
    campaignCorruptions: {
      viscosity: 5,
      drought: 1,
      extinction: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 15,
    cardinal: 10
  },
  eleventh: {
    campaignCorruptions: {
      viscosity: 7,
      drought: 1,
      extinction: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 20,
    cardinal: 11
  },
  twelfth: {
    campaignCorruptions: {
      viscosity: 7,
      drought: 1,
      deflation: 3,
      extinction: 3
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 20,
    cardinal: 12
  },
  thirteenth: {
    campaignCorruptions: {
      viscosity: 7,
      drought: 3,
      deflation: 3,
      extinction: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 20,
    cardinal: 13
  },
  fourteenth: {
    campaignCorruptions: {
      viscosity: 7,
      drought: 5,
      deflation: 3,
      extinction: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 20,
    cardinal: 14
  },
  fifteenth: {
    campaignCorruptions: {
      viscosity: 7,
      drought: 7,
      deflation: 3,
      extinction: 3
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 7
    },
    limit: 20,
    cardinal: 15
  },
  sixteenth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 4,
      illiteracy: 1,
      recession: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 25,
    cardinal: 16
  },
  seventeenth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 4,
      illiteracy: 3,
      recession: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 25,
    cardinal: 17
  },
  eighteenth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 4,
      deflation: 1,
      extinction: 3,
      illiteracy: 3,
      recession: 1
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 25,
    cardinal: 18
  },
  nineteenth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 4,
      deflation: 1,
      extinction: 3,
      illiteracy: 6,
      recession: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 25,
    cardinal: 19
  },
  twentieth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 4,
      deflation: 1,
      extinction: 3,
      illiteracy: 9,
      recession: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 25,
    cardinal: 20
  },
  twentyFirst: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 4,
      deflation: 9,
      extinction: 3,
      illiteracy: 3,
      recession: 1
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 30,
    cardinal: 21
  },
  twentySecond: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 6,
      deflation: 9,
      extinction: 3,
      illiteracy: 6,
      recession: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 30,
    cardinal: 22
  },
  twentyThird: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 6,
      deflation: 9,
      extinction: 3,
      illiteracy: 9,
      recession: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 30,
    cardinal: 23
  },
  twentyFourth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 9,
      deflation: 9,
      extinction: 3,
      illiteracy: 9,
      recession: 1
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 30,
    cardinal: 24
  },
  twentyFifth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 9,
      deflation: 9,
      extinction: 5,
      illiteracy: 9,
      recession: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 9
    },
    limit: 30,
    cardinal: 25
  },
  twentySixth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 9,
      deflation: 9,
      extinction: 3,
      illiteracy: 9,
      recession: 3,
      dilation: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 35,
    cardinal: 26
  },
  twentySeventh: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 9,
      deflation: 9,
      extinction: 3,
      illiteracy: 9,
      recession: 3,
      hyperchallenge: 1
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 35,
    cardinal: 27
  },
  twentyEighth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 9,
      deflation: 9,
      extinction: 3,
      illiteracy: 9,
      recession: 3,
      dilation: 1,
      hyperchallenge: 1
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 35,
    cardinal: 28
  },
  twentyNinth: {
    campaignCorruptions: {
      viscosity: 9,
      drought: 9,
      deflation: 9,
      extinction: 3,
      illiteracy: 9,
      recession: 3,
      dilation: 3,
      hyperchallenge: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 35,
    cardinal: 29
  },
  thirtieth: {
    campaignCorruptions: {
      viscosity: 0,
      drought: 5,
      deflation: 4,
      extinction: 11,
      illiteracy: 0,
      recession: 11,
      dilation: 4,
      hyperchallenge: 1
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 35,
    cardinal: 30
  },
  thirtyFirst: {
    campaignCorruptions: {
      viscosity: 0,
      drought: 5,
      deflation: 4,
      extinction: 11,
      illiteracy: 0,
      recession: 11,
      dilation: 4,
      hyperchallenge: 2
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 40,
    cardinal: 31
  },
  thirtySecond: {
    campaignCorruptions: {
      viscosity: 1,
      drought: 5,
      deflation: 4,
      extinction: 11,
      illiteracy: 1,
      recession: 11,
      dilation: 5,
      hyperchallenge: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 40,
    cardinal: 32
  },
  thirtyThird: {
    campaignCorruptions: {
      viscosity: 1,
      drought: 5,
      deflation: 4,
      extinction: 11,
      illiteracy: 2,
      recession: 11,
      dilation: 4,
      hyperchallenge: 3
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 45,
    cardinal: 33
  },
  thirtyFourth: {
    campaignCorruptions: {
      viscosity: 1,
      drought: 9,
      deflation: 4,
      extinction: 11,
      illiteracy: 2,
      recession: 11,
      dilation: 4,
      hyperchallenge: 5
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 45,
    cardinal: 34
  },
  thirtyFifth: {
    campaignCorruptions: {
      viscosity: 2,
      drought: 9,
      deflation: 4,
      extinction: 11,
      illiteracy: 2,
      recession: 11,
      dilation: 4,
      hyperchallenge: 4
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 50,
    cardinal: 35
  },
  thirtySixth: {
    campaignCorruptions: {
      viscosity: 2,
      drought: 9,
      deflation: 4,
      extinction: 11,
      illiteracy: 2,
      recession: 11,
      dilation: 5,
      hyperchallenge: 5
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 50,
    cardinal: 36
  },
  thirtySeventh: {
    campaignCorruptions: {
      viscosity: 2,
      drought: 10,
      deflation: 4,
      extinction: 11,
      illiteracy: 2,
      recession: 11,
      dilation: 5,
      hyperchallenge: 5
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 55,
    cardinal: 37
  },
  thirtyEighth: {
    campaignCorruptions: {
      viscosity: 3,
      drought: 10,
      deflation: 4,
      extinction: 11,
      illiteracy: 2,
      recession: 11,
      dilation: 5,
      hyperchallenge: 4
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 55,
    cardinal: 38
  },
  thirtyNinth: {
    campaignCorruptions: {
      drought: 10,
      deflation: 4,
      extinction: 11,
      illiteracy: 2,
      recession: 11,
      dilation: 6,
      hyperchallenge: 9
    },
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 11
    },
    limit: 60,
    cardinal: 39
  },
  fortieth: {
    campaignCorruptions: {
      viscosity: 3,
      drought: 11,
      deflation: 4,
      extinction: 11,
      illiteracy: 11,
      recession: 11,
      dilation: 6,
      hyperchallenge: 9
    },
    isMeta: true,
    unlockRequirement: () => {
      return player.cubeUpgrades[50] > 99999
    },
    limit: 60,
    cardinal: 40
  },
  fortyFirst: {
    campaignCorruptions: {
      viscosity: 3,
      drought: 11,
      deflation: 4,
      extinction: 11,
      illiteracy: 11,
      recession: 11,
      dilation: 7,
      hyperchallenge: 11
    },
    isMeta: true,
    unlockRequirement: () => {
      return player.cubeUpgrades[50] > 99999
    },
    limit: 65,
    cardinal: 41
  },
  fortySecond: {
    campaignCorruptions: {
      viscosity: 3,
      drought: 12,
      deflation: 4,
      extinction: 12,
      illiteracy: 12,
      recession: 12,
      dilation: 9,
      hyperchallenge: 11
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 12
    },
    limit: 70,
    cardinal: 42
  },
  fortyThird: {
    campaignCorruptions: {
      viscosity: 5,
      drought: 12,
      deflation: 4,
      extinction: 12,
      illiteracy: 12,
      recession: 12,
      dilation: 9,
      hyperchallenge: 11
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 12
    },
    limit: 75,
    cardinal: 43
  },
  fortyFourth: {
    campaignCorruptions: {
      viscosity: 5,
      drought: 12,
      deflation: 12,
      extinction: 12,
      illiteracy: 12,
      recession: 12,
      dilation: 11,
      hyperchallenge: 11
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 12
    },
    limit: 80,
    cardinal: 44
  },
  fortyFifth: {
    campaignCorruptions: {
      viscosity: 5,
      drought: 13,
      deflation: 13,
      extinction: 12,
      illiteracy: 13,
      recession: 13,
      dilation: 11,
      hyperchallenge: 8
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 13
    },
    limit: 85,
    cardinal: 45
  },
  fortySixth: {
    campaignCorruptions: {
      viscosity: 6,
      drought: 13,
      deflation: 13,
      extinction: 13,
      illiteracy: 13,
      recession: 13,
      dilation: 12,
      hyperchallenge: 11
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 13
    },
    limit: 95,
    cardinal: 46
  },
  fortySeventh: {
    campaignCorruptions: {
      viscosity: 6,
      drought: 13,
      deflation: 13,
      extinction: 13,
      illiteracy: 13,
      recession: 13,
      dilation: 13,
      hyperchallenge: 7
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 13
    },
    limit: 105,
    cardinal: 47
  },
  fortyEighth: {
    campaignCorruptions: {
      viscosity: 6,
      drought: 13,
      deflation: 13,
      extinction: 13,
      illiteracy: 13,
      recession: 13,
      dilation: 13,
      hyperchallenge: 11
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 13
    },
    limit: 115,
    cardinal: 48
  },
  fortyNinth: {
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
    isMeta: false,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 13
    },
    limit: 125,
    cardinal: 49
  },
  fiftieth: {
    campaignCorruptions: {
      viscosity: 13,
      drought: 13,
      deflation: 13,
      extinction: 13,
      illiteracy: 13,
      recession: 13,
      dilation: 13,
      hyperchallenge: 13
    },
    isMeta: true,
    unlockRequirement: () => {
      return maxCorruptionLevel() >= 13
    },
    limit: 140,
    cardinal: 50
  }
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

export const activeCampaignTextHTML = () => {
  const campaignName = player.campaigns.current
    ? i18next.t(`campaigns.data.${player.campaigns.current}.name`)
    : i18next.t('campaigns.emptyCampaignName')
  const cardinal = player.campaigns.current ? campaignDatas[player.campaigns.current].cardinal : 0
  DOMCacheGetOrSet('currentCampaignText').innerHTML = i18next.t('campaigns.activeCampaign', {
    name: campaignName,
    cardinal: cardinal
  })
}

export const campaignIconHTMLUpdates = () => {
  for (const key of Object.keys(campaignDatas) as CampaignKeys[]) {
    campaignIconHTMLUpdate(key)
  }

  // Update the active campaign text
  activeCampaignTextHTML()
}

export const campaignIconHTMLUpdate = (key: CampaignKeys) => {
  const icon = document.querySelector<HTMLElement>(`#campaignIconGrid > #${key}CampaignIcon`)!
  if (!campaignDatas[key].unlockRequirement()) {
    icon.style.display = 'none'
  } else {
    icon.style.display = 'block'
  }

  icon.classList.remove('green-background', 'purple-background')
  icon.style.setProperty('border', 'none')
  icon.style.removeProperty('margin')
  const completions = player.campaigns.getCampaign(key).c10Completions
  const limit = campaignDatas[key].limit

  if (key === player.campaigns.current) {
    icon.classList.add('purple-background')
    icon.style.setProperty('border', '1px solid turquoise')
    icon.style.setProperty('margin', '-1px')
  } else if (completions === limit) {
    icon.classList.add('green-background')
  }

  icon.style.setProperty('--pct', `${completions}/${limit}`)
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
  DOMCacheGetOrSet('campaignName').textContent = `${
    player.campaigns.current === key
      ? i18next.t('campaigns.currentCampaignPreTitle')
      : ''
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
    corrText.textContent = `lv${level} | ${
      i18next.t(`campaigns.corruptionTexts.${corrKey}`, {
        effect: format(usableCorruption.corruptionEffects(corrKey), 2, true)
      })
    }`
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

  const metaText = document.createElement('p')
  if (campaignDatas[key].isMeta) {
    metaText.textContent = i18next.t('campaigns.corruptionStats.metaText')
    metaText.style.color = 'gold'
  }

  const campaignButton = document.createElement('button')
  if (player.campaigns.current === key) {
    campaignButton.textContent = i18next.t('campaigns.corruptionStats.resetCampaign')
    campaignButton.onclick = async () => {
      if (player.challengecompletions[10] === 0) {
        const p = await Confirm(i18next.t('campaigns.noChallengeCompletionConfirm'))
        if (!p) return
      }
      reset('ascension')
    }
  } else {
    campaignButton.textContent = i18next.t('campaigns.corruptionStats.startCampaign')
    campaignButton.onclick = () => {
      if (player.currentChallenge.ascension !== 0) {
        return Alert(i18next.t('campaigns.errorMessages.ascensionChallenge'))
      }
      reset('ascension')
      player.campaigns.campaign = key
    }
  }

  const saveLoadoutButton = document.createElement('button')
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
    campaignIcon.src = `Pictures/Campaigns/CampaignIcons/${key}.png`

    campaignIconDiv.appendChild(campaignIcon)

    campaignIcon.onclick = () => {
      campaignCorruptionStatHTMLUpdate(key)
    }
  }
}

export const campaignTokenRewardHTMLUpdate = () => {
  // Reset HTMLs for the Icons
  DOMCacheGetOrSet('campaignTokenRewardIcons').innerHTML = ''
  DOMCacheGetOrSet('campaignTokenRewardText').textContent = ''

  DOMCacheGetOrSet('campaignTokenCount').textContent = i18next.t('campaigns.tokens.count', {
    count: campaignTokens,
    maxCount: maxCampaignTokens
  })

  for (const [key, value] of Object.entries(campaignTokenRewardDatas)) {
    // Create a new Icon if the player has enough tokens and extra requirements are met
    if (
      campaignTokens >= value.tokenRequirement
      && (value.otherUnlockRequirement === undefined || value.otherUnlockRequirement())
    ) {
      const tokenIcon = document.createElement('img')
      tokenIcon.src = `Pictures/Campaigns/${key}.png`
      tokenIcon.classList.add('campaignTokenRewardIcon')

      if (typeof value.reward() === 'string') {
        tokenIcon.onclick = () => {
          DOMCacheGetOrSet('campaignTokenRewardText').innerHTML = i18next.t(`campaigns.tokens.rewardTexts.${key}`, {
            reward: value.reward()
          })
        }
      } else {
        tokenIcon.onclick = () => {
          const reward = value.reward() as Partial<Record<CampaignTokenRewardNames, string>>
          DOMCacheGetOrSet('campaignTokenRewardText').innerHTML = i18next.t(
            `campaigns.tokens.rewardTexts.${key}`,
            reward
          )
        }
      }

      DOMCacheGetOrSet('campaignTokenRewardIcons').appendChild(tokenIcon)
    }
  }

  // Create the final icon that displays the total sum of rewards in a popup.
  if (campaignTokens > 0) {
    const totalRewardIcon = document.createElement('img')
    totalRewardIcon.src = 'Pictures/Campaigns/sum.png'

    let popupText = ''
    for (const [key, value] of Object.entries(campaignTokenRewardDatas)) {
      if (
        campaignTokens >= value.tokenRequirement
        && (value.otherUnlockRequirement === undefined || value.otherUnlockRequirement())
      ) {
        if (typeof value.reward() === 'string') {
          popupText += `${i18next.t(`campaigns.tokens.rewardTexts.${key}`, { reward: value.reward() })}\n`
        } else {
          const reward = value.reward() as Partial<Record<CampaignTokenRewardNames, string>>
          popupText += `${i18next.t(`campaigns.tokens.rewardTexts.${key}`, reward)}\n`
        }
      }
    }

    totalRewardIcon.onclick = () => {
      return Alert(popupText)
    }
    DOMCacheGetOrSet('campaignTokenRewardIcons').appendChild(totalRewardIcon)
  }
}
