import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateGoldenQuarkGain } from './Calculate'
import { singularity } from './Reset'
import { player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Confirm } from './UpdateHTML'
import { toOrdinal } from './Utility'
import { Globals as G } from './Variables'

export interface ISingularityChallengeData {
  baseReq: number
  maxCompletions: number
  unlockSingularity: number
  HTMLTag: keyof Player['singularityChallenges']
  singularityRequirement: (baseReq: number, completions: number) => number
  effect: (n: number) => Record<string, number | boolean>
  scalingrewardcount: number
  uniquerewardcount: number
  completions?: number
  enabled?: boolean
  highestSingularityCompleted?: number
  cacheUpdates?: (() => void)[]
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
  public singularityRequirement
  public effect
  public scalingrewardcount
  public uniquerewardcount
  readonly cacheUpdates: (() => void)[] | undefined

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
    this.singularityRequirement = data.singularityRequirement
    this.effect = data.effect
    this.scalingrewardcount = data.scalingrewardcount
    this.uniquerewardcount = data.uniquerewardcount

    this.updateIconHTML()
    this.updateChallengeCompletions()
    this.cacheUpdates = data.cacheUpdates ?? undefined
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
      return this.exitChallenge(player.runelevels[6] > 0)
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
      const goldenQuarkGain = calculateGoldenQuarkGain()
      const currentGQ = player.goldenQuarks
      this.enabled = true
      G.currentSingChallenge = this.HTMLTag
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
      return Alert(
        i18next.t('singularityChallenge.exitChallenge.acceptFailure')
      )
    }
  }

  public async exitChallenge (success: boolean) {
    if (!success) {
      const extra = player.runelevels[6] === 0
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
      await singularity(highestSingularityHold)
      player.singularityCounter = holdSingTimer
      this.updateCaches()
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
      return Alert(
        i18next.t('singularityChallenge.exitChallenge.acceptFailure')
      )
    }
  }

  updateCaches (): void {
    if (this.cacheUpdates !== undefined) {
      for (const cache of this.cacheUpdates) {
        cache()
      }
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
    <span style="color: lightblue">${this.description}</span>`
  }
  //Numerates through total reward count for Scaling & Unique string for EXALTS.
  scaleString (): string {
    let text = ''
    for (let i = 1; i <= this.scalingrewardcount; i++) {
    const list = i18next.t(`singularityChallenge.data.${String(this.HTMLTag)}.ScalingReward${i}`);
    text += i > 1 ? `\n${list}` : list
    }
     return text
  }

  //Ditto. Also worth mentioning this implementation means the list size can be arbitrary!
  uniqueString (): string {
    let text = ''
    for (let i = 1; i <= this.uniquerewardcount; i++) {
    const list = i18next.t(`singularityChallenge.data.${String(this.HTMLTag)}.UniqueReward${i}`);
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
    DOMCacheGetOrSet(`${String(this.HTMLTag)}`).style.backgroundColor = color
  }

  public get rewards () {
    return this.effect(this.completions)
  }
}

export const singularityChallengeData: Record<
  keyof Player['singularityUpgrades'],
  ISingularityChallengeData
> = {
  noSingularityUpgrades: {
    baseReq: 1,
    maxCompletions: 30,
    unlockSingularity: 25,
    HTMLTag: 'noSingularityUpgrades',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 8 * completions
    },
    scalingrewardcount: 1,
    uniquerewardcount: 5,
    effect: (n: number) => {
      return {
        cubes: 1 + 0.5 * n,
        goldenQuarks: 1 + 0.12 * +(n > 0),
        blueberries: +(n > 0),
        shopUpgrade: n >= 20,
        luckBonus: n >= 30 ? 0.04 : 0,
        shopUpgrade2: n >= 30
      }
    },
    cacheUpdates: [
      () => player.caches.blueberryInventory.updateVal('Exalt1'),
      () => player.caches.ambrosiaLuckAdditiveMult.updateVal('Exalt1')
    ]
  },
  oneChallengeCap: {
    baseReq: 10,
    maxCompletions: 25,
    unlockSingularity: 40,
    HTMLTag: 'oneChallengeCap',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 11 * completions
    },
    scalingrewardcount: 2,
    uniquerewardcount: 3,
    effect: (n: number) => {
      return {
        corrScoreIncrease: 0.03 * n,
        blueberrySpeedMult: (1 + n/100),
        capIncrease: 3 * +(n > 0),
        freeCorruptionLevel: n >= 20,
        shopUpgrade: n >= 20
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
    scalingrewardcount: 1,
    uniquerewardcount: 3,
    effect: (n: number) => {
      return {
        octeractPow: 0.02 * n,
        offeringBonus: n > 0,
        obtainiumBonus: n >= 10,
        shopUpgrade: n >= 10
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
    scalingrewardcount: 1,
    uniquerewardcount: 4,
    effect: (n: number) => {
      return {
        ultimateProgressBarUnlock: (n > 0),
        ascensionSpeedMult: (0.1 * n) / 100,
        hepteractCap: n > 0,
        exaltBonus: n >= 20,
        shopUpgrade: n >= 25
      }
    }
  },
  noAmbrosiaUpgrades: {
    baseReq: 150,
    maxCompletions: 20,
    unlockSingularity: 166,
    HTMLTag: 'noAmbrosiaUpgrades',
    singularityRequirement: (baseReq: number, completions: number) => {
      return baseReq + 6 * completions
    },
    scalingrewardcount: 2,
    uniquerewardcount: 6,
    effect: (n: number) => {
      return {
        bonusAmbrosia: +(n > 0),
        blueberries: Math.floor(n/10) + +(n > 0),
        luckBonus: n/200,
        additiveLuck: 15 * n,
        blueberrySpeedMult: (1 + n/50),
        shopUpgrade: n >= 15,
        shopUpgrade2: n >= 20
      }
    }
  }
}
