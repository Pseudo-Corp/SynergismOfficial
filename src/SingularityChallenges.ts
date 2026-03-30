import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateExalt3AscensionLimit, calculateExalt4EffectiveSingularityMultiplier, calculateExalt6PenaltyPerSecond, calculateExalt6TimeLimit, calculateGoldenQuarks } from './Calculate'
import { singularity } from './Reset'
import { runes } from './Runes'
import { format, player } from './Synergism'
import { Alert, Confirm } from './UpdateHTML'
import { toOrdinal } from './Utility'
import { Globals as G } from './Variables'

interface ISingularityChallengeData {
  baseReq: number
  maxCompletions: number
  unlockSingularity: number
  HTMLTag: SingularityChallengeDataKeys
  singularityRequirement: (baseReq: number, completions: number) => number
  effect: (n: number) => Record<string, number | boolean>
  achievementPointValue: (n: number) => number
  scalingrewardcount: number
  uniquerewardcount: number
  resetTime?: boolean
  completions?: number
  enabled?: boolean
  alternateDescription?: () => string
  highestSingularityCompleted?: number
}

export type SingularityChallengeDataKeys =
  | 'noSingularityUpgrades'
  | 'oneChallengeCap'
  | 'noOcteracts'
  | 'limitedAscensions'
  | 'noQuarkUpgrades'
  | 'noAmbrosiaUpgrades'
  | 'limitedTime'
  | 'sadisticPrequel'
  | 'taxmanLastStand'

export class SingularityChallenge {
  public name
  public description
  public baseReq
  public completions
  public maxCompletions
  public unlockSingularity
  public HTMLTag
  public highestSingularityCompleted
  public enabled
  public resetTime
  public singularityRequirement
  public effect
  public achievementPointValue
  public alternateDescription
  public scalingrewardcount
  public uniquerewardcount
  #key: string

  public constructor (data: ISingularityChallengeData, key: string) {
    const name = i18next.t(`singularityChallenge.data.${key}.name`)
    const description = i18next.t(
      `singularityChallenge.data.${key}.description`
    )
    this.name = name
    this.description = description
    this.baseReq = data.baseReq
    this.completions = data.completions ?? 0
    this.maxCompletions = data.maxCompletions
    this.unlockSingularity = data.unlockSingularity
    this.HTMLTag = data.HTMLTag
    this.highestSingularityCompleted = data.highestSingularityCompleted ?? 0
    this.enabled = data.enabled ?? false
    this.resetTime = data.resetTime ?? false
    this.singularityRequirement = data.singularityRequirement
    this.effect = data.effect
    this.achievementPointValue = data.achievementPointValue
    this.alternateDescription = data.alternateDescription ?? undefined
    this.scalingrewardcount = data.scalingrewardcount
    this.uniquerewardcount = data.uniquerewardcount

    this.updateIconHTML()
    this.updateChallengeCompletions()
    this.#key = key
  }

  public computeSingularityRquirement () {
    return this.singularityRequirement(this.baseReq, this.completions)
  }

  public updateChallengeCompletions () {
    let updateVal = 0
    while (
      this.singularityRequirement(this.baseReq, updateVal)
        <= this.highestSingularityCompleted
    ) {
      updateVal += 1
    }

    this.completions = Math.min(this.maxCompletions, updateVal)
  }

  public challengeEntryHandler () {
    if (!this.enabled) {
      return this.enableChallenge()
    } else {
      return this.exitChallenge(runes.antiquities.level > 0)
    }
  }

  public async enableChallenge () {
    if (player.highestSingularityCount < this.unlockSingularity) {
      return Alert(
        i18next.t('singularityChallenge.enterChallenge.lowSingularity')
      )
    }
    const confirmation = await Confirm(
      i18next.t('singularityChallenge.enterChallenge.confirmation', {
        name: this.name
      })
    )

    if (!confirmation) {
      return Alert(i18next.t('singularityChallenge.enterChallenge.decline'))
    }

    if (!player.insideSingularityChallenge) {
      const setSingularity = this.computeSingularityRquirement()
      const holdSingTimer = player.singularityCounter
      const holdQuarkExport = player.quarkstimer
      const holdGoldenQuarkExport = player.goldenQuarksTimer
      const goldenQuarkGain = calculateGoldenQuarks()
      const currentGQ = player.goldenQuarks
      this.enabled = true
      G.currentSingChallenge = this.HTMLTag
      player.insideSingularityChallenge = true
      singularity(setSingularity)

      if (!this.resetTime) {
        player.singularityCounter = holdSingTimer
      } else {
        player.singularityCounter = 0
      }
      player.goldenQuarks = currentGQ + goldenQuarkGain
      player.quarkstimer = holdQuarkExport
      player.goldenQuarksTimer = holdGoldenQuarkExport

      this.updateChallengeHTML()
      return Alert(
        i18next.t('singularityChallenge.enterChallenge.acceptSuccess', {
          name: this.name,
          tier: this.completions + 1,
          singReq: this.computeSingularityRquirement()
        })
      )
    } else {
      return Alert(
        i18next.t('singularityChallenge.exitChallenge.acceptFailure')
      )
    }
  }

  public async exitChallenge (success: boolean) {
    if (!success) {
      const extra = runes.antiquities.level === 0
        ? i18next.t('singularityChallenge.exitChallenge.incompleteWarning')
        : ''
      const confirmation = await Confirm(
        i18next.t('singularityChallenge.exitChallenge.confirmation', {
          name: this.name,
          tier: this.completions + 1,
          warning: extra
        })
      )
      if (!confirmation) {
        return Alert(i18next.t('singularityChallenge.exitChallenge.decline'))
      }
    }

    this.enabled = false
    G.currentSingChallenge = undefined
    player.insideSingularityChallenge = false
    const highestSingularityHold = player.highestSingularityCount
    const holdSingTimer = player.singularityCounter
    const holdQuarkExport = player.quarkstimer
    const holdGoldenQuarkExport = player.goldenQuarksTimer
    this.updateIconHTML()
    if (success) {
      this.highestSingularityCompleted = player.singularityCount
      this.updateChallengeCompletions()
      singularity(highestSingularityHold)
      player.singularityCounter = holdSingTimer
      return Alert(
        i18next.t('singularityChallenge.exitChallenge.acceptSuccess', {
          tier: toOrdinal(this.completions),
          name: this.name
        })
      )
    } else {
      singularity(highestSingularityHold)
      player.singularityCounter = holdSingTimer
      player.quarkstimer = holdQuarkExport
      player.goldenQuarksTimer = holdGoldenQuarkExport
      return Alert(
        i18next.t('singularityChallenge.exitChallenge.acceptFailure')
      )
    }
  }

  /**
   * Given a Singularity Challenge, give a concise information regarding its data.
   * @returns A string that details the name, description, metadata.
   */
  toString (): string {
    const color = this.completions === this.maxCompletions
      ? 'var(--orchid-text-color)'
      : 'white'
    const enabled = this.enabled
      ? `<span style="color: var(--red-text-color)">${
        i18next.t(
          'general.enabled'
        )
      }</span>`
      : ''
    return `<span style="color: gold">${this.name}</span> ${enabled}
      ${
      i18next.t(
        'singularityChallenge.toString.tiersCompleted'
      )
    }: <span style="color: ${color}">${this.completions}/${this.maxCompletions}</span>
      <span style="color: pink">${
      i18next.t(
        'singularityChallenge.toString.canEnter',
        {
          unlockSing: this.unlockSingularity,
          highestSing: player.highestSingularityCount
        }
      )
    }</span>
    <span style="color: gold">${
      i18next.t(
        'singularityChallenge.toString.currentTierSingularity'
      )
    } <span style="color: var(--orchid-text-color)">${
      this.singularityRequirement(
        this.baseReq,
        this.completions
      )
    }</span></span>
    <span style="color: lightblue">${
      this.alternateDescription !== undefined ? this.alternateDescription() : this.description
    }</span>`
  }
  // Numerates through total reward count for Scaling & Unique string for EXALTS.
  scaleString (): string {
    let text = ''
    for (let i = 1; i <= this.scalingrewardcount; i++) {
      const list = i18next.t(`singularityChallenge.data.${String(this.HTMLTag)}.ScalingReward${i}`)
      text += i > 1 ? `\n${list}` : list
    }
    return text
  }

  // Ditto. Also worth mentioning this implementation means the list size can be arbitrary!
  uniqueString (): string {
    let text = ''
    for (let i = 1; i <= this.uniquerewardcount; i++) {
      const list = i18next.t(`singularityChallenge.data.${String(this.HTMLTag)}.UniqueReward${i}`)
      text += i > 1 ? `\n${list}` : list
    }
    return text
  }

  public updateChallengeHTML (): void {
    DOMCacheGetOrSet('singularityChallengesInfo').innerHTML = this.toString()
    DOMCacheGetOrSet('singularityChallengesScalingRewards').innerHTML = this.scaleString()
    DOMCacheGetOrSet('singularityChallengesUniqueRewards').innerHTML = this.uniqueString()
  }

  public updateIconHTML (): void {
    const color = this.enabled ? 'orchid' : ''
    DOMCacheGetOrSet(this.HTMLTag).style.backgroundColor = color
  }

  public get rewards () {
    return this.effect(this.completions)
  }

  public get rewardAP () {
    return this.achievementPointValue(this.completions)
  }

  public get maxAP () {
    return this.achievementPointValue(this.maxCompletions)
  }

  valueOf (): ISingularityChallengeData {
    return {
      baseReq: this.baseReq,
      effect: this.effect,
      HTMLTag: this.HTMLTag,
      maxCompletions: this.maxCompletions,
      achievementPointValue: this.achievementPointValue,
      scalingrewardcount: this.scalingrewardcount,
      singularityRequirement: this.singularityRequirement,
      uniquerewardcount: this.uniquerewardcount,
      unlockSingularity: this.unlockSingularity,
      completions: this.completions,
      enabled: this.enabled,
      highestSingularityCompleted: this.highestSingularityCompleted,
      resetTime: this.resetTime
    }
  }

  key () {
    return this.#key
  }
}

export const singularityChallengeData: Record<
  SingularityChallengeDataKeys,
  ISingularityChallengeData
> = {
  noSingularityUpgrades: {
    baseReq: 1,
    maxCompletions: 15,
    unlockSingularity: 25,
    HTMLTag: 'noSingularityUpgrades',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 16 * completions + 8 * (completions >= 9 ? 1 : 0)
    },
    achievementPointValue: (n) => {
      return 15 * n
    },
    scalingrewardcount: 2,
    uniquerewardcount: 5,
    effect: (n: number) => {
      return {
        cubes: 1 + n,
        goldenQuarks: 1 + 0.12 * +(n > 0),
        blueberries: +(n > 0),
        shopUpgrade: n >= 10,
        luckBonus: n >= 15 ? 0.05 : 0,
        shopUpgrade2: n >= 15
      }
    }
  },
  oneChallengeCap: {
    baseReq: 10,
    maxCompletions: 15,
    unlockSingularity: 40,
    HTMLTag: 'oneChallengeCap',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 19 * completions - 2 * (completions >= 14 ? 1 : 0)
    },
    achievementPointValue: (n) => {
      return 15 * n
    },
    scalingrewardcount: 3,
    uniquerewardcount: 4,
    effect: (n: number) => {
      return {
        corrScoreIncrease: 0.05 * n,
        blueberrySpeedMult: (1 + n / 60),
        capIncrease: 3 * +(n > 0),
        freeCorruptionLevel: n >= 12,
        shopUpgrade: n >= 12,
        reinCapIncrease2: 7 * +(n >= 15),
        ascCapIncrease2: 2 * +(n >= 15)
      }
    }
  },
  noOcteracts: {
    baseReq: 75,
    maxCompletions: 15,
    unlockSingularity: 100,
    achievementPointValue: (n) => {
      return 20 * n
    },
    HTMLTag: 'noOcteracts',
    singularityRequirement: (baseReq: number, completions: number) => {
      if (completions < 10) {
        return baseReq + 13 * completions
      } else {
        return baseReq + 13 * 9 + 10 * (completions - 9)
      }
    },
    scalingrewardcount: 2,
    uniquerewardcount: 3,
    effect: (n: number) => {
      return {
        octeractPow: (n <= 10) ? 0.02 * n : 0.2 + (n - 10) / 100,
        offeringBonus: n > 0,
        obtainiumBonus: n >= 10,
        shopUpgrade: n >= 10
      }
    },
    alternateDescription: () => {
      const completions = player.singularityChallenges.noOcteracts.completions
      let stringText = i18next.t('singularityChallenge.data.noOcteracts.description')
      if (completions > 0) {
        const effectiveSingMult = calculateExalt4EffectiveSingularityMultiplier(completions, true)
        const effectMod1 = i18next.t('singularityChallenge.data.noOcteracts.effectMod1', {
          sing: format(effectiveSingMult, 0, true)
        })
        stringText += `<br>${effectMod1}`
      }
      return stringText
    }
  },
  limitedAscensions: {
    baseReq: 7,
    maxCompletions: 10,
    unlockSingularity: 50,
    achievementPointValue: (n) => {
      return 30 * n
    },
    HTMLTag: 'limitedAscensions',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 27 * completions
    },
    scalingrewardcount: 2,
    uniquerewardcount: 3,
    effect: (n: number) => {
      return {
        ascensionSpeedMult: (0.25 * n) / 100,
        hepteractCap: n > 0,
        shopUpgrade0: n >= 8,
        shopUpgrade: n >= 10
      }
    },
    alternateDescription: () => {
      const ascensionLimit = calculateExalt3AscensionLimit(player.singularityChallenges.limitedAscensions.completions)
      const baseDesc = i18next.t('singularityChallenge.data.limitedAscensions.description')
      const effectMod1 = i18next.t('singularityChallenge.data.limitedAscensions.effectMod1', {
        ascensions: format(ascensionLimit, 0, true)
      })
      const effectMod2 = i18next.t('singularityChallenge.data.limitedAscensions.effectMod2', {
        ascensions: format(ascensionLimit, 0, true)
      })
      const effectMod3 = i18next.t('singularityChallenge.data.limitedAscensions.effectMod3')
      return `${baseDesc}<br>${effectMod1}<br>${effectMod2}<br>${effectMod3}`
    }
  },
  noAmbrosiaUpgrades: {
    baseReq: 150,
    maxCompletions: 15,
    unlockSingularity: 166,
    achievementPointValue: (n) => {
      return 25 * n
    },
    HTMLTag: 'noAmbrosiaUpgrades',
    singularityRequirement: (baseReq: number, completions: number) => {
      if (completions < 10) {
        return baseReq + 12 * completions
      } else {
        return baseReq + 12 * 9 + 4 * (completions - 9)
      }
    },
    scalingrewardcount: 5,
    uniquerewardcount: 8,
    effect: (n: number) => {
      return {
        bonusAmbrosia: +(n > 0),
        blueberries: Math.floor(n / 5) + +(n > 0),
        luckBonus: n / 200,
        additiveLuck: 20 * n,
        redLuck: 4 * n,
        blueberrySpeedMult: 1 + n / 25,
        redSpeedMult: 1 + 2 * n / 100,
        shopUpgrade: n >= 8,
        shopUpgrade2: n >= 10
      }
    }
  },
  noQuarkUpgrades: {
    baseReq: 20,
    maxCompletions: 10,
    unlockSingularity: 66,
    achievementPointValue: (n) => {
      return 20 * n
    },
    HTMLTag: 'noQuarkUpgrades',
    singularityRequirement: (baseReq: number, completions: number) => {
      if (completions > 5) {
        return baseReq + 185 + 8 * (completions - 6)
      } else if (completions > 2) {
        return baseReq + 70 + 9 * (completions - 6)
      } else {
        return baseReq + 15 * completions
      }
    },
    scalingrewardcount: 6,
    uniquerewardcount: 3,
    effect: (n: number) => {
      return {
        freeObtainiumLevels: n,
        freeOfferingLevels: n,
        freeSpeedLevels: n,
        freeCubeLevels: n,
        freeQuarkLevel: n,
        freeInfinityLevels: n,
        shopUpgrade: n >= 1,
        topHatUnlock: n >= 10
      }
    },
    alternateDescription: () => {
      const introText = i18next.t('singularityChallenge.data.noQuarkUpgrades.description')
      const chalText = i18next.t('singularityChallenge.data.noQuarkUpgrades.challengeDesc')
      return `${introText}<br>${chalText}`
    }
  },
  limitedTime: {
    baseReq: 203,
    maxCompletions: 15,
    unlockSingularity: 216,
    achievementPointValue: (n) => {
      return 30 * n
    },
    HTMLTag: 'limitedTime',
    singularityRequirement: (baseReq: number, completions: number) => {
      if (completions > 10) {
        return 277 + 2 * (completions - 10)
      }
      else {
        return baseReq + 8 * completions
      }
    },
    scalingrewardcount: 5,
    uniquerewardcount: 3,
    effect: (n: number) => {
      return {
        preserveQuarks: +(n > 0),
        quarkMult: 1 + 0.02 * n,
        globalSpeed: 0.12 * n,
        ascensionSpeed: 0.12 * n,
        barRequirementMultiplier: 1 - 0.02 * n,
        tier1Upgrade: n >= 5,
        tier2Upgrade: n >= 10
      }
    },
    alternateDescription: () => {
      const completions = player.singularityChallenges.limitedTime.completions
      const baseDesc = i18next.t('singularityChallenge.data.limitedTime.description')
      const timeLimit = calculateExalt6TimeLimit(completions)
      const perSecondPenalty = calculateExalt6PenaltyPerSecond(completions)

      const timeMod1 = i18next.t('singularityChallenge.data.limitedTime.timeMod1', {
        time: format(timeLimit, 0, true)
      })
      const timeMod2 = i18next.t('singularityChallenge.data.limitedTime.timeMod2', {
        perSecondDivisor: format(perSecondPenalty, 3, true)
      })
      const timeMod3 = i18next.t('singularityChallenge.data.limitedTime.timeMod3')

      return `${baseDesc}<br>${timeMod1}<br>${timeMod2}<br>${timeMod3}`
    }
  },
  sadisticPrequel: {
    baseReq: 120,
    maxCompletions: 15,
    unlockSingularity: 256,
    achievementPointValue: (n) => {
      return 40 * n
    },
    HTMLTag: 'sadisticPrequel',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 8 * completions
    },
    scalingrewardcount: 3,
    uniquerewardcount: 4,
    effect: (n: number) => {
      return {
        extraFree: 50 * +(n > 0),
        quarkMult: 1 + 0.06 * n,
        freeUpgradeMult: 0.06 * n,
        shopUpgrade: n >= 5,
        shopUpgrade2: n >= 10,
        shopUpgrade3: n >= 15
      }
    }
  },
  taxmanLastStand: {
    baseReq: 240,
    maxCompletions: 10,
    unlockSingularity: 281,
    achievementPointValue: (n) => {
      return 50 * n
    },
    HTMLTag: 'taxmanLastStand',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 4 * completions
    },
    scalingrewardcount: 5,
    uniquerewardcount: 3,
    effect: (n: number) => {
      return {
        horseShoeUnlock: n > 0,
        shopUpgrade: n >= 5,
        talismanUnlock: n >= 10,
        talismanFreeLevel: 25 * n,
        talismanRuneEffect: 0.03 * n,
        antiquityOOM: 1 / 50 * n / 10,
        horseShoeOOM: 1 / 20 * n / 10
      }
    },
    alternateDescription: () => {
      const completions = player.singularityChallenges.taxmanLastStand.completions
      const baseDesc = i18next.t('singularityChallenge.data.taxmanLastStand.description')
      const salvText = i18next.t('singularityChallenge.data.taxmanLastStand.salvageMod')
      const taxText = i18next.t('singularityChallenge.data.taxmanLastStand.taxMod')
      const offText = i18next.t('singularityChallenge.data.taxmanLastStand.offeringMod')
      const obtText = i18next.t('singularityChallenge.data.taxmanLastStand.obtainiumMod')
      let stringText = `${baseDesc}<br>${salvText}<br>${taxText}<br>${offText}<br>${obtText}`

      if (completions >= 2) {
        const capMod = i18next.t('singularityChallenge.data.taxmanLastStand.capMod')
        stringText += `<br>${capMod}`
      }
      if (completions >= 5) {
        const tributeMod = i18next.t('singularityChallenge.data.taxmanLastStand.tributeMod')
        stringText += `<br>${tributeMod}`
      }
      if (completions >= 8) {
        const omegaMod = i18next.t('singularityChallenge.data.taxmanLastStand.omegaMod')
        stringText += `<br>${omegaMod}`
      }
      return stringText
    }
  }
}

export const maxAPFromChallenges = Object.values(singularityChallengeData).reduce(
  (acc, challenge) => acc + challenge.achievementPointValue(challenge.maxCompletions),
  0
)
