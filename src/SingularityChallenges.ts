import { DOMCacheGetOrSet } from './Cache/DOM'
import { singularity } from './Reset'
import { player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Confirm } from './UpdateHTML'
import { toOrdinal } from './Utility'

export interface ISingularityChallengeData {
    name: string
    descripton: string
    rewardDescription: string
    baseReq: number
    maxCompletions: number
    unlockSingularity: number
    HTMLTag: string
    singularityRequirement: (baseReq: number, completions: number) => number
    effect: (n: number) => {[key: string]: number | boolean}
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
    public constructor(data: ISingularityChallengeData) {
        this.name = data.name
        this.description = data.descripton
        this.rewardDescription = data.rewardDescription
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

    public computeSingularityRquirement() {
        return this.singularityRequirement(this.baseReq, this.completions)
    }

    public updateChallengeCompletions() {
        let updateVal = 0
        while (this.singularityRequirement(this.baseReq, updateVal) <= this.highestSingularityCompleted) {
            updateVal += 1
        }

        this.completions = updateVal
    }

    public challengeEntryHandler() {
        if (!this.enabled) {
            return this.enableChallenge()
        } else {
            return this.exitChallenge((player.runelevels[6] > 0))
        }
    }

    public async enableChallenge() {
        const confirmation = await(Confirm(`You are about to enter ${this.name}. Your Singularity Timer will not reset but you will be taken back to the beginning of a Singularity. Do you proceed?`))

        if (!confirmation) {
            return Alert('Derpsmith nods his head. Come back when you are ready...')
        }

        if (!player.insideSingularityChallenge) {
            const setSingularity = this.computeSingularityRquirement()
            const holdSingTimer = player.singularityCounter
            const holdAdds = player.rngCode
            const holdQuarkExport = player.quarkstimer
            const holdGoldenQuarkExport = player.goldenQuarksTimer
            this.enabled = true
            player.insideSingularityChallenge = true
            await singularity(setSingularity)
            player.singularityCounter = holdSingTimer
            player.rngCode = holdAdds
            player.quarkstimer = holdQuarkExport
            player.goldenQuarksTimer = holdGoldenQuarkExport

            this.updateChallengeHTML()
            return Alert(`You are attempting ${this.name} #${this.completions + 1}! You were sent to Singularity ${this.computeSingularityRquirement()}. Buy Antiquities to complete the challenge!`)
        } else {
            return Alert('Derpsmith declares you are already in a singularity challenge and prohibits you from destroying the fabric of your Reality.')
        }
    }

    public async exitChallenge(success: boolean) {
        if (!success) {
            const confirmation = await(Confirm(`Are you sure you want to quit ${this.name} Tier ${this.completions + 1}?`))
            if (!confirmation) {
                return Alert('Derpsmith tries to hug you, but he has no arms.')
            }

        }

        this.enabled = false
        player.insideSingularityChallenge = false
        const highestSingularityHold = player.highestSingularityCount
        const holdSingTimer = player.singularityCounter
        const holdAdds = player.rngCode
        const holdQuarkExport = player.quarkstimer
        const holdGoldenQuarkExport = player.goldenQuarksTimer
        this.updateIconHTML()
        if (success) {
            this.highestSingularityCompleted = player.singularityCount
            this.updateChallengeCompletions()
            await singularity(highestSingularityHold)
            player.singularityCounter = holdSingTimer
            return Alert(`You have completed the ${toOrdinal(this.completions)} tier of ${this.name}! The corresponding challenge rewards have been updated.`)
        } else {
            await singularity(highestSingularityHold)
            player.singularityCounter = holdSingTimer
            player.rngCode = holdAdds
            player.quarkstimer = holdQuarkExport
            player.goldenQuarksTimer = holdGoldenQuarkExport
            return Alert('You have been transported back to your highest reached Singularity. Try again soon! -Derpsmith')
        }
    }

    /**
     * Given a Singularity Challenge, give a concise information regarding its data.
     * @returns A string that details the name, description, metadata.
     */
    toString(): string {

        const color = (this.completions === this.maxCompletions) ? 'orchid' : 'white'
        const enabled = (this.enabled) ? '<span style="color: red">[ENABLED]</span>' : '';
        return `<span style="color: gold">${this.name}</span> ${enabled}
                <span style="color: lightblue">${this.description}</span>
                Tiers completed: <span style="color: ${color}">${this.completions}/${this.maxCompletions}</span>
                <span style="color: gold">The current tier of this challenge takes place in Singularity <span style="color: orchid">${this.singularityRequirement(this.baseReq, this.completions)}</span></span>
                <span>${this.rewardDescription}</span>`
    }

    public updateChallengeHTML(): void {
        DOMCacheGetOrSet('singularityChallengesMultiline').innerHTML = this.toString()
    }

    public updateIconHTML(): void {
        const color = (this.enabled) ? 'orchid' : 'transparent'
        DOMCacheGetOrSet(`${this.HTMLTag}`).style.backgroundColor = color
    }

    public get rewards() {
        return this.effect(this.completions)
    }

}

export const singularityChallengeData: Record<keyof Player['singularityUpgrades'], ISingularityChallengeData> = {
    noSingularityUpgrades: {
        name: 'No Singularity Upgrades',
        descripton: 'Simply put, you have to beat the target singularity without (most) Singularity Upgrades. Octeracts, Perks and Quality of Life Singularity Upgrades are preserved.',
        rewardDescription: 'Each completion increases cube gain of every dimension by 50%! First completion gives +12% Golden Quarks. Final completion awards something `special` ;) (WIP)',
        baseReq: 1,
        maxCompletions: 20,
        unlockSingularity: 25,
        HTMLTag: 'noSingularityUpgrades',
        singularityRequirement: (baseReq: number, completions: number) => {
            return baseReq + 8 * completions
        },
        effect: (n: number) => {
            return {
                cubes: 1 + 0.5 * n,
                goldenQuarks: 1 + 0.12 * +(n > 0)
            }
        }
    }
}


