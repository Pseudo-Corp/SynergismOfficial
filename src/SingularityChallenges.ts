import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateExalt3AscensionLimit,
  calculateExalt4EffectiveSingularityMultiplier,
  calculateExalt6PenaltyPerSecond,
  calculateExalt6TimeLimit,
  calculateGoldenQuarks
} from './Calculate'
import { singularity } from './Reset'
import { runes } from './Runes'
import { format, player } from './Synergism'
import { Alert, Confirm } from './UpdateHTML'
import { toOrdinal } from './Utility'
import { Globals as G } from './Variables'

export type SingularityChallengeRewards = {
  noSingularityUpgrades: {
    cubes: number
    goldenQuarks: number
    blueberries: number
    shopUpgrade: boolean
    additiveLuckMult: number
    shopUpgrade2: boolean
  }
  oneChallengeCap: {
    corrScoreIncrease: number
    blueberrySpeedMult: number
    capIncrease: number
    freeCorruptionLevel: number
    shopUpgrade: boolean
    reinCapIncrease2: number
    ascCapIncrease2: number
  }
  noOcteracts: {
    octeractPow: number
    offeringBonus: boolean
    obtainiumBonus: boolean
    shopUpgrade: boolean
  }
  limitedAscensions: {
    ascensionSpeedMult: number
    hepteractCap: boolean
    shopUpgrade: boolean
    shopUpgrade2: boolean
  }
  noAmbrosiaUpgrades: {
    bonusAmbrosia: number
    blueberries: number
    additiveLuckMult: number
    ambrosiaLuck: number
    redLuck: number
    blueberrySpeedMult: number
    redSpeedMult: number
    shopUpgrade: boolean
    shopUpgrade2: boolean
  }
  noQuarkUpgrades: {
    freeObtainiumLevels: number
    freeOfferingLevels: number
    freeSpeedLevels: number
    freeCubeLevels: number
    freeQuarkLevel: number
    freeInfinityLevels: number
    shopUpgrade: boolean
    topHatUnlock: boolean
  }
  limitedTime: {
    preserveQuarks: boolean
    quarkMult: number
    globalSpeed: number
    ascensionSpeed: number
    barRequirementMultiplier: number
    shopUpgrade: boolean
    shopUpgrade2: boolean
  }
  sadisticPrequel: {
    extraFree: number
    quarkMult: number
    freeUpgradeMult: number
    shopUpgrade: boolean
    shopUpgrade2: boolean
    shopUpgrade3: boolean
  }
  taxmanLastStand: {
    horseShoeUnlock: boolean
    shopUpgrade: boolean
    talismanUnlock: boolean
    talismanFreeLevel: number
    talismanRuneEffect: number
    antiquityOOM: number
    horseShoeOOM: number
  }
}

export type SingularityChallengeDataKeys = keyof SingularityChallengeRewards

interface ISingularityChallengeData {
  baseReq: number
  maxCompletions: number
  unlockSingularity: number
  HTMLTag: SingularityChallengeDataKeys
  singularityRequirement: (baseReq: number, completions: number) => number
  achievementPointValue: (n: number) => number
  scalingrewardcount: number
  uniquerewardcount: number
  resetTime?: boolean
  completions?: number
  enabled?: boolean
  alternateDescription?: () => string
  highestSingularityCompleted?: number
}

interface ISingularityChallengeDataWithEffect<
  T extends SingularityChallengeDataKeys,
  K extends keyof SingularityChallengeRewards[T]
> extends ISingularityChallengeData {
  effect: (n: number, key: K) => SingularityChallengeRewards[T][K]
}

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

  public get rewardAP () {
    return this.achievementPointValue(this.completions)
  }

  public get maxAP () {
    return this.achievementPointValue(this.maxCompletions)
  }

  valueOf (): ISingularityChallengeData {
    return {
      baseReq: this.baseReq,
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

export const singularityChallengeData: {
  [K in SingularityChallengeDataKeys]: ISingularityChallengeDataWithEffect<K, keyof SingularityChallengeRewards[K]>
} = {
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
    effect: (n, key) => {
      if (key === 'cubes') {
        return 1 + n
      } else if (key === 'goldenQuarks') {
        return 1 + 0.12 * +(n > 0)
      } else if (key === 'blueberries') {
        return +(n > 0)
      } else if (key === 'shopUpgrade') {
        return n >= 10
      } else if (key === 'additiveLuckMult') {
        return n >= 15 ? 0.05 : 0
      } else {
        return n >= 15 // shopUpgrade2
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
    effect: (n, key) => {
      if (key === 'corrScoreIncrease') {
        return 0.05 * n
      } else if (key === 'blueberrySpeedMult') {
        return (1 + n / 60)
      } else if (key === 'capIncrease') {
        return 3 * +(n > 0)
      } else if (key === 'freeCorruptionLevel') {
        return +(n >= 12)
      } else if (key === 'shopUpgrade') {
        return n >= 12
      } else if (key === 'reinCapIncrease2') {
        return 7 * +(n >= 15)
      } else {
        return 2 * +(n >= 15) // ascCapIncrease2
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
    effect: (n, key) => {
      if (key === 'octeractPow') {
        return (n <= 10) ? 0.02 * n : 0.2 + (n - 10) / 100
      } else if (key === 'offeringBonus') {
        return n > 0
      } else if (key === 'obtainiumBonus') {
        return n >= 10
      } else {
        return n >= 10 // shopUpgrade
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
    effect: (n, key) => {
      if (key === 'ascensionSpeedMult') {
        return 1 + 0.25 * n / 100
      } else if (key === 'hepteractCap') {
        return n > 0
      } else if (key === 'shopUpgrade') {
        return n >= 8
      } else {
        return n >= 10 // shopUpgrade2
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
    effect: (n, key) => {
      if (key === 'bonusAmbrosia') {
        return +(n > 0)
      } else if (key === 'blueberries') {
        return Math.floor(n / 5) + +(n > 0)
      } else if (key === 'additiveLuckMult') {
        return n / 200
      } else if (key === 'ambrosiaLuck') {
        return 20 * n
      } else if (key === 'redLuck') {
        return 4 * n
      } else if (key === 'blueberrySpeedMult') {
        return 1 + n / 25
      } else if (key === 'redSpeedMult') {
        return 1 + 2 * n / 100
      } else if (key === 'shopUpgrade') {
        return n >= 8
      } else {
        return n >= 10 // shopUpgrade2
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
    effect: (n, key) => {
      if (key === 'freeObtainiumLevels') {
        return n
      } else if (key === 'freeOfferingLevels') {
        return n
      } else if (key === 'freeSpeedLevels') {
        return n
      } else if (key === 'freeCubeLevels') {
        return n
      } else if (key === 'freeQuarkLevel') {
        return n >= 5 ? 1 : 0
      } else if (key === 'freeInfinityLevels') {
        return n
      } else if (key === 'shopUpgrade') {
        return n >= 1
      } else {
        return n >= 10 // topHatUnlock
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
      if (completions > 9) {
        return 277 + 2 * (completions - 10)
      } else {
        return baseReq + 8 * completions
      }
    },
    scalingrewardcount: 5,
    uniquerewardcount: 3,
    effect: (n, key) => {
      if (key === 'preserveQuarks') {
        return +(n > 0)
      } else if (key === 'quarkMult') {
        return 1 + 0.02 * n
      } else if (key === 'globalSpeed') {
        return 1 + 0.12 * n
      } else if (key === 'ascensionSpeed') {
        return 1 + 0.12 * n
      } else if (key === 'barRequirementMultiplier') {
        return 1 - 0.02 * n
      } else if (key === 'shopUpgrade') {
        return n >= 5
      } else {
        return n >= 10 // shopUpgrade2
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
    effect: (n, key) => {
      if (key === 'extraFree') {
        return 50 * +(n > 0)
      } else if (key === 'quarkMult') {
        return 1 + 0.06 * n
      } else if (key === 'freeUpgradeMult') {
        return 1 + 0.06 * n
      } else if (key === 'shopUpgrade') {
        return n >= 5
      } else if (key === 'shopUpgrade2') {
        return n >= 10
      } else {
        return n >= 15 // shopUpgrade3
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
    effect: (n, key) => {
      if (key === 'horseShoeUnlock') {
        return n > 0
      } else if (key === 'shopUpgrade') {
        return n >= 5
      } else if (key === 'talismanUnlock') {
        return n >= 10
      } else if (key === 'talismanFreeLevel') {
        return 25 * n
      } else if (key === 'talismanRuneEffect') {
        return 0.03 * n
      } else if (key === 'antiquityOOM') {
        return 1 / 50 * n / 10
      } else {
        return 1 / 20 * n / 10 // horseShoeOOM
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

export const getSingularityChallengeEffect = <
  T extends SingularityChallengeDataKeys,
  K extends keyof SingularityChallengeRewards[T]
>(challenge: T, key: K): SingularityChallengeRewards[T][K] => {
  const completions = player.singularityChallenges[challenge].completions
  return singularityChallengeData[challenge].effect(completions, key) as SingularityChallengeRewards[T][K]
}

export const maxAPFromChallenges = Object.values(singularityChallengeData).reduce(
  (acc, challenge) => acc + challenge.achievementPointValue(challenge.maxCompletions),
  0
)
