import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateGoldenQuarkGain } from './Calculate'
import { singularity } from './Reset'
import { player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Confirm } from './UpdateHTML'
import { toOrdinal } from './Utility'

export interface ISingularityChallengeData {
  baseReq: number
  maxCompletions: number
  unlockSingularity: number
  HTMLTag: string
  singularityRequirement: (baseReq: number, completions: number) => number
  effect: (n: number) => Record<string, number | boolean>
  completions?: number
  enabled?: boolean
  highestSingularityCompleted?: number
}

export class SingularityChallenge {
  public name
  public description
  public rewardDescription
  public baseReq
  public completions
  public maxCompletions
  public unlockSingularity
  public HTMLTag
  public highestSingularityCompleted
  public enabled
  public singularityRequirement
  public effect
  public constructor (data: ISingularityChallengeData, key: string) {
    const name = i18next.t(`singularityChallenge.data.${key}.name`)
    const description = i18next.t(`singularityChallenge.data.${key}.description`)
    const rewardDescription = i18next.t(`singularityChallenge.data.${key}.rewardDescription`)
    this.name = name
    this.description = description
    this.rewardDescription = rewardDescription
    this.baseReq = data.baseReq
    this.completions = data.completions ?? 0
    this.maxCompletions = data.maxCompletions
    this.unlockSingularity = data.unlockSingularity
    this.HTMLTag = data.HTMLTag
    this.highestSingularityCompleted = data.highestSingularityCompleted ?? 0
    this.enabled = data.enabled ?? false
    this.singularityRequirement = data.singularityRequirement
    this.effect = data.effect

    this.updateIconHTML()
    this.updateChallengeCompletions()
  }

  public computeSingularityRquirement () {
    return this.singularityRequirement(this.baseReq, this.completions)
  }

  public updateChallengeCompletions () {
    let updateVal = 0
    while (this.singularityRequirement(this.baseReq, updateVal) <= this.highestSingularityCompleted) {
      updateVal += 1
    }

    this.completions = Math.min(this.maxCompletions, updateVal)
  }

  public challengeEntryHandler () {
    if (!this.enabled) {
      return this.enableChallenge()
    } else {
      return this.exitChallenge(player.runelevels[6] > 0)
    }
  }

  public async enableChallenge () {
    if (player.highestSingularityCount < this.unlockSingularity) {
      return Alert(i18next.t('singularityChallenge.enterChallenge.lowSingularity'))
    }
    const confirmation =
      await (Confirm(i18next.t('singularityChallenge.enterChallenge.confirmation', { name: this.name })))

    if (!confirmation) {
      return Alert(i18next.t('singularityChallenge.enterChallenge.decline'))
    }

    if (!player.insideSingularityChallenge) {
      const setSingularity = this.computeSingularityRquirement()
      const holdSingTimer = player.singularityCounter
      const holdQuarkExport = player.quarkstimer
      const holdGoldenQuarkExport = player.goldenQuarksTimer
      const goldenQuarkGain = calculateGoldenQuarkGain()
      const currentGQ = player.goldenQuarks
      this.enabled = true
      player.insideSingularityChallenge = true
      await singularity(setSingularity)
      player.singularityCounter = holdSingTimer
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
      return Alert(i18next.t('singularityChallenge.exitChallenge.acceptFailure'))
    }
  }

  public async exitChallenge (success: boolean) {
    if (!success) {
      const extra = (player.runelevels[6] === 0)
        ? i18next.t('singularityChallenge.exitChallenge.incompleteWarning')
        : ''
      const confirmation = await (Confirm(
        i18next.t('singularityChallenge.exitChallenge.confirmation', {
          name: this.name,
          tier: this.completions + 1,
          warning: extra
        })
      ))
      if (!confirmation) {
        return Alert(i18next.t('singularityChallenge.exitChallenge.decline'))
      }
    }

    this.enabled = false
    player.insideSingularityChallenge = false
    const highestSingularityHold = player.highestSingularityCount
    const holdSingTimer = player.singularityCounter
    const holdQuarkExport = player.quarkstimer
    const holdGoldenQuarkExport = player.goldenQuarksTimer
    this.updateIconHTML()
    if (success) {
      this.highestSingularityCompleted = player.singularityCount
      this.updateChallengeCompletions()
      await singularity(highestSingularityHold)
      player.singularityCounter = holdSingTimer
      return Alert(
        i18next.t('singularityChallenge.exitChallenge.acceptSuccess', {
          tier: toOrdinal(this.completions),
          name: this.name
        })
      )
    } else {
      await singularity(highestSingularityHold)
      player.singularityCounter = holdSingTimer
      player.quarkstimer = holdQuarkExport
      player.goldenQuarksTimer = holdGoldenQuarkExport
      return Alert(i18next.t('singularityChallenge.exitChallenge.acceptFailure'))
    }
  }

  /**
   * Given a Singularity Challenge, give a concise information regarding its data.
   * @returns A string that details the name, description, metadata.
   */
  toString (): string {
    const color = (this.completions === this.maxCompletions) ? 'var(--orchid-text-color)' : 'white'
    const enabled = (this.enabled)
      ? `<span style="color: var(--red-text-color)">${i18next.t('general.enabled')}</span>`
      : ''
    return `<span style="color: gold">${this.name}</span> ${enabled}
                <span style="color: lightblue">${this.description}</span>
                <span style="color: pink">${
      i18next.t('singularityChallenge.toString.canEnter', {
        unlockSing: this.unlockSingularity,
        highestSing: player.highestSingularityCount
      })
    }</span>
                ${
      i18next.t('singularityChallenge.toString.tiersCompleted')
    }: <span style="color: ${color}">${this.completions}/${this.maxCompletions}</span>
                <span style="color: gold">${
      i18next.t('singularityChallenge.toString.currentTierSingularity')
    } <span style="color: var(--orchid-text-color)">${
      this.singularityRequirement(this.baseReq, this.completions)
    }</span></span>
                <span>${this.rewardDescription}</span>`
  }

  public updateChallengeHTML (): void {
    DOMCacheGetOrSet('singularityChallengesMultiline').innerHTML = this.toString()
  }

  public updateIconHTML (): void {
    const color = (this.enabled) ? 'orchid' : ''
    DOMCacheGetOrSet(`${this.HTMLTag}`).style.backgroundColor = color
  }

  public get rewards () {
    return this.effect(this.completions)
  }
}

export const singularityChallengeData: Record<keyof Player['singularityUpgrades'], ISingularityChallengeData> = {
  noSingularityUpgrades: {
    baseReq: 1,
    maxCompletions: 30,
    unlockSingularity: 25,
    HTMLTag: 'noSingularityUpgrades',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 8 * completions
    },
    effect: (n: number) => {
      return {
        cubes: 1 + 0.5 * n,
        goldenQuarks: 1 + 0.12 * +(n > 0),
        blueberries: +(n > 0),
        shopUpgrade: (n >= 20)
      }
    }
  },
  oneChallengeCap: {
    baseReq: 10,
    maxCompletions: 25,
    unlockSingularity: 40,
    HTMLTag: 'oneChallengeCap',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 11 * completions
    },
    effect: (n: number) => {
      return {
        corrScoreIncrease: 0.03 * n,
        capIncrease: 3 * +(n > 0),
        freeCorruptionLevel: (n >= 20)
      }
    }
  },
  noOcteracts: {
    baseReq: 75,
    maxCompletions: 10,
    unlockSingularity: 100,
    HTMLTag: 'noOcteracts',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 13 * completions
    },
    effect: (n: number) => {
      return {
        octeractPow: 0.02 * n,
        offeringBonus: (n > 0),
        obtainiumBonus: (n === 10)
      }
    }
  },
  limitedAscensions: {
    baseReq: 10,
    maxCompletions: 25,
    unlockSingularity: 50,
    HTMLTag: 'limitedAscensions',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 10 * completions
    },
    effect: (n: number) => {
      return {
        ascensionSpeedMult: 0.1 * n / 100,
        hepteractCap: (n > 0),
        calculatorUnlock: (n >= 25)
      }
    }
  }
}
