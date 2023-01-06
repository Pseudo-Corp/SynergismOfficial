import { DOMCacheGetOrSet } from './Cache/DOM'
import type { IUpgradeData } from './DynamicUpgrade';
import { DynamicUpgrade } from './DynamicUpgrade'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Prompt, revealStuff } from './UpdateHTML'
import { toOrdinal } from './Utility'

export const updateSingularityPenalties = (): void => {
    const singularityCount = player.singularityCount;
    const color = player.runelevels[6] > 0 ? 'var(--green-text-color)' : 'var(--red-text-color)';
    const platonic = (singularityCount > 36) ? `<span style="color: var(--orchid-text-color)">Platonic Upgrade</span> costs are multiplied by <span style="color: var(--orchid-text-color)">${format(calculateSingularityDebuff('Platonic Costs', singularityCount), 2, true)}</span>.` : '<span class="grayText">???????? ??????? ????? ??? ?????????? ?? ???</span> <span class="redText">(Sing 37)</span>';
    const hepteract = (singularityCount > 50) ? `<span style="color: Pink">Hepteract Forge</span> costs are multiplied by <span style="color: Pink">${format(calculateSingularityDebuff('Hepteract Costs', singularityCount), 2, true)}</span>.` : '<span class="grayText">????????? ????? ????? ??? ?????????? ?? ???</span> <span class="redText">(Sing 51)</span>';
    const str = getSingularityOridnalText(singularityCount) +
                `<br><span style="color: RoyalBlue">Global Speed</span> is divided by <span style="color: RoyalBlue">${format(calculateSingularityDebuff('Global Speed', singularityCount), 2, true)}</span>.
                 <span style="color: Orange">Ascension Speed</span> is divided by <span style="color: Orange">${format(calculateSingularityDebuff('Ascension Speed', singularityCount), 2, true)}</span>.
                 <span style="color: Gold">Offering Gain</span> is divided by <span style="color: Gold">${format(calculateSingularityDebuff('Offering', singularityCount), 2, true)}</span>.
                 <span style="color: Steelblue">Obtainium Gain</span> is divided by <span style="color: Steelblue">${format(calculateSingularityDebuff('Obtainium', singularityCount), 2, true)}</span>.
                 <span style="color: Yellow">Cube Gain</span> is divided by <span style="color: Yellow">${format(calculateSingularityDebuff('Cubes', singularityCount), 2, true)}</span>.
                 <span style="color: var(--green-text-color)">Research Costs</span> are multiplied by <span style="color: var(--green-text-color)">${format(calculateSingularityDebuff('Researches', singularityCount), 2, true)}</span>.
                 <span style="color: Silver">Cube Upgrade Costs</span> (Excluding Cookies) are multiplied by <span style="color: Silver">${format(calculateSingularityDebuff('Cube Upgrades', singularityCount), 2, true)}</span>.
                 ${platonic}
                 ${hepteract}
                 Your penalties will ${singularityCount >= 230 ? 'now smoothly increase forever.' : `sharply increase in <span class="redText"> Singularity ${format(calculateNextSpike(player.singularityCount), 0, true)}</span>.`}
                 <span style='color: ${color}'>Antiquities of Ant God is ${(player.runelevels[6] > 0) ? '' : 'NOT'} purchased. Penalties are ${(player.runelevels[6] > 0) ? '' : 'NOT'} dispelled!</span>`

    DOMCacheGetOrSet('singularityPenaltiesMultiline').innerHTML = str;
}

function getSingularityOridnalText(singularityCount: number): string {
    return 'You are in the <span style="color: gold">' + toOrdinal(singularityCount) + ' Singularity</span>';
}

// Need a better way of handling the ones without a special formulae than 'Default' variant
type SingularitySpecialCostFormulae = 'Default' | 'Quadratic' | 'Cubic' | 'Exponential2'

export interface ISingularityData extends IUpgradeData {
    goldenQuarksInvested?: number
    minimumSingularity?: number
    canExceedCap?: boolean
    specialCostForm?: SingularitySpecialCostFormulae
    qualityOfLife?: boolean
}

/**
 * Singularity Upgrades are bought in the Shop of the singularity tab, and all have their own
 * name, description, level and maxlevel, plus a feature to toggle buy on each.
 */
export class SingularityUpgrade extends DynamicUpgrade {

    // Field Initialization
    public goldenQuarksInvested = 0;
    public minimumSingularity: number;
    public canExceedCap: boolean;
    public specialCostForm: SingularitySpecialCostFormulae
    public qualityOfLife: boolean

    public constructor(data: ISingularityData) {
        super(data)
        this.goldenQuarksInvested = data.goldenQuarksInvested ?? 0;
        this.minimumSingularity = data.minimumSingularity ?? 0;
        this.canExceedCap = data.canExceedCap ?? false;
        this.specialCostForm = data.specialCostForm ?? 'Default';
        this.qualityOfLife = data.qualityOfLife ?? false;
    }

    /**
     * Given an upgrade, give a concise information regarding its data.
     * @returns A string that details the name, description, level statistic, and next level cost.
     */
    toString(): string {
        const costNextLevel = this.getCostTNL();
        const maxLevel = this.maxLevel === -1
            ? ''
            : `/${format(this.computeMaxLevel(), 0 , true)}`;
        const color = this.computeMaxLevel() === this.level ? 'plum' : 'white';
        const minReqColor = player.highestSingularityCount < this.minimumSingularity ? 'var(--crimson-text-color)' : 'var(--green-text-color)';
        const minimumSingularity = this.minimumSingularity > 0
            ? `Minimum Singularity: ${this.minimumSingularity}`
            : 'No minimal Singularity to purchase required'

        let freeLevelInfo = this.freeLevels > 0 ?
            `<span style="color: orange"> [+${format(this.freeLevels, 2, true)}]</span>` : ''

        if (this.freeLevels > this.level) {
            freeLevelInfo = freeLevelInfo + '<span style="color: var(--maroon-text-color)"> (Softcapped) </span>'
        }

        return `<span style="color: gold">${this.name}</span>
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${minReqColor}">${minimumSingularity}</span>
                <span style="color: ${color}"> Level ${format(this.level, 0 , true)}${maxLevel}${freeLevelInfo}</span>
                <span style="color: gold">${this.getEffect().desc}</span>
                Cost for next level: ${format(costNextLevel,0,true)} Golden Quarks.
                Spent Quarks: ${format(this.goldenQuarksInvested, 0, true)}`
    }

    public updateUpgradeHTML(): void {
        DOMCacheGetOrSet('testingMultiline').innerHTML = this.toString()
    }

    /**
     * Retrieves the cost for upgrading the singularity upgrade once. Return 0 if maxed.
     * @returns A number representing how many Golden Quarks a player must have to upgrade once.
     */
    getCostTNL(): number {

        let costMultiplier = 1
        if (this.computeMaxLevel() > this.maxLevel && this.level >= this.maxLevel) {
            costMultiplier *= Math.pow(4, this.level - this.maxLevel + 1)
        }

        if (this.specialCostForm === 'Exponential2') {
            return this.costPerLevel * Math.sqrt(costMultiplier) * Math.pow(2, this.level)
        }

        if (this.specialCostForm === 'Cubic') {
            return this.costPerLevel * costMultiplier * (Math.pow(this.level + 1, 3) - Math.pow(this.level, 3))
        }

        if (this.specialCostForm === 'Quadratic') {
            return this.costPerLevel * costMultiplier * (Math.pow(this.level + 1, 2) - Math.pow(this.level, 2))
        }

        costMultiplier *= (this.maxLevel === -1 && this.level >= 100) ? this.level / 50 : 1;
        costMultiplier *= (this.maxLevel === -1 && this.level >= 400) ? this.level / 100 : 1;

        return (this.computeMaxLevel() === this.level) ? 0: Math.ceil(this.costPerLevel * (1 + this.level) * costMultiplier);
    }

    /**
     * Buy levels up until togglebuy or maxed.
     * @returns An alert indicating cannot afford, already maxed or purchased with how many
     *          levels purchased
     */
    public async buyLevel(event: MouseEvent): Promise<void> {
        let purchased = 0;
        let maxPurchasable = 1
        let GQBudget = player.goldenQuarks

        if (event.shiftKey) {
            maxPurchasable = 100000
            const buy = Number(await Prompt(`How many Golden Quarks would you like to spend? You have ${format(player.goldenQuarks, 0, true)} GQ. Type -1 to use max!`))

            if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) { // nan + Infinity checks
                return Alert('Value must be a finite number!');
            }

            if (buy === -1) {
                GQBudget = player.goldenQuarks
            } else if (buy <= 0) {
                return Alert('Purchase cancelled!')
            } else {
                GQBudget = buy
            }
            GQBudget = Math.min(player.goldenQuarks, GQBudget)
        }

        if (this.maxLevel > 0) {
            maxPurchasable = Math.min(maxPurchasable, this.computeMaxLevel() - this.level)
        }

        if (maxPurchasable === 0) {
            return Alert('Hey! You have already maxed this upgrade. :D')
        }

        if (player.highestSingularityCount < this.minimumSingularity) {
            return Alert('You\'re not powerful enough to purchase this yet.')
        }
        while (maxPurchasable > 0) {
            const cost = this.getCostTNL();
            if (player.goldenQuarks < cost || GQBudget < cost) {
                break;
            } else {
                player.goldenQuarks -= cost;
                GQBudget -= cost;
                this.goldenQuarksInvested += cost;
                this.level += 1;
                purchased += 1;
                maxPurchasable -= 1;
            }
            if (this.name === player.singularityUpgrades.oneMind.name) {
                player.ascensionCounter = 0
                player.ascensionCounterReal = 0
                player.ascensionCounterRealReal = 0
                void Alert('You have succumbed to the cult. Your ascension progress was reset as a one-time precaution...')
            }

            if (this.name === player.singularityUpgrades.singCitadel2.name) {
                player.singularityUpgrades.singCitadel.freeLevels = player.singularityUpgrades.singCitadel2.level
            }
        }

        if (purchased === 0) {
            return Alert('You cannot afford this upgrade. Sorry!')
        }
        if (purchased > 1) {
            void Alert(`Purchased ${format(purchased)} levels, thanks to Multi Buy!`)
        }

        this.updateUpgradeHTML();
        updateSingularityPenalties();
        updateSingularityPerks();
        revealStuff();
    }

    public computeFreeLevelSoftcap(): number {
        return Math.min(this.level, this.freeLevels) + Math.sqrt(Math.max(0, this.freeLevels - this.level))
    }

    public computeMaxLevel(): number {
        if (!this.canExceedCap) {
            return this.maxLevel
        } else {
            let cap = this.maxLevel
            const overclockPerks = [50, 60, 75, 100, 125, 150, 175, 200, 225, 250]
            for (let i = 0; i < overclockPerks.length; i++) {
                if (player.highestSingularityCount >= overclockPerks[i]) {
                    cap += 1
                } else {
                    break
                }
            }
            cap += +player.octeractUpgrades.octeractSingUpgradeCap.getEffect().bonus
            return cap
        }
    }

    public actualTotalLevels(): number {
        if (player.singularityChallenges.noSingularityUpgrades.enabled && !this.qualityOfLife) {
            return 0
        }

        if (player.singularityChallenges.limitedAscensions.enabled && this.name === player.singularityUpgrades.platonicDelta.name) {
            return 0
        }

        const actualFreeLevels = this.computeFreeLevelSoftcap();
        const linearLevels = this.level + actualFreeLevels
        let polynomialLevels = 0
        if (player.octeractUpgrades.octeractImprovedFree.getEffect().bonus) {
            let exponent = 0.6
            exponent += +player.octeractUpgrades.octeractImprovedFree2.getEffect().bonus;
            exponent += +player.octeractUpgrades.octeractImprovedFree3.getEffect().bonus;
            exponent += +player.octeractUpgrades.octeractImprovedFree4.getEffect().bonus;
            polynomialLevels = Math.pow(this.level * actualFreeLevels, exponent)
        }

        return Math.max(linearLevels, polynomialLevels)
    }

    public getEffect(): { bonus: number | boolean, desc: string } {
        return this.effect(this.actualTotalLevels())
    }

    public refund(): void {
        player.goldenQuarks += this.goldenQuarksInvested;
        this.level = 0;
        this.goldenQuarksInvested = 0;
    }
}

export const singularityData: Record<keyof Player['singularityUpgrades'], ISingularityData> = {
    goldenQuarks1: {
        name: 'Golden Quarks I',
        description: 'In the future, you will gain 10% more Golden Quarks on Singularities per level!',
        maxLevel: 15,
        costPerLevel: 12,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.10 * n,
                desc: `Permanently gain ${format(10 * n, 0, true)}% more Golden Quarks on Singularities.`
            }
        },
        qualityOfLife: true
    },
    goldenQuarks2: {
        name: 'Golden Quarks II',
        description: 'Buying GQ is 0.2% cheaper per level! [After 50%, effect grows much slower]',
        maxLevel: 75,
        costPerLevel: 60,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: (n > 250) ? 1 / Math.log2(n / 62.5) : 1 - Math.min(0.5, n / 500),
                desc: `Purchasing Golden Quarks in the shop is ${(n > 250)? format(100 - 100 / Math.log2(n / 62.5), 2, true) : format(Math.min(50, n / 5),2,true)}% cheaper.`
            }
        },
        qualityOfLife: true
    },
    goldenQuarks3: {
        name: 'Golden Quarks III',
        description: 'If you buy this, you will gain Golden Quarks per hour from Exports. Leveling up gives (level) additional per hour!',
        maxLevel: 1000,
        costPerLevel: 1000,
        effect: (n: number) => {
            return {
                bonus: n * (n + 1) / 2,
                desc: `Every hour, you gain ${format(n * (n + 1) / 2)} Golden Quarks from exporting.`
            }
        }
    },
    starterPack: {
        name: 'Starter Pack',
        description: 'Buy this! Buy This! Cube gain is permanently multiplied by 5, and gain 6x the Obtainium and Offerings from all sources, post-corruption.',
        maxLevel: 1,
        costPerLevel: 10,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} unlocked a 5x multiplier to Cubes and 6x multiplier to Obtainium and Offerings.`
            }
        }
    },
    wowPass: {
        name: 'Shop Bonanza',
        description: 'This upgrade will convince the seal merchant to sell you more cool stuff, which even persist on Singularity!',
        maxLevel: 1,
        costPerLevel: 350,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} unlocked the Shop Bonanza.`
            }
        },
        qualityOfLife: true
    },
    cookies: {
        name: 'Cookie Recipes I',
        description: 'For just a few Golden Quarks, re-open Wow! Bakery, adding five cookie-related Cube upgrades.',
        maxLevel: 1,
        costPerLevel: 100,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} unlocked volume 1 of the recipe book.`
            }
        },
        qualityOfLife: true
    },
    cookies2: {
        name: 'Cookie Recipes II',
        description: 'Diversify Wow! Bakery into cooking slightly more exotic cookies, adding five more cookie-related Cube upgrades.',
        maxLevel: 1,
        costPerLevel: 500,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} unlocked volume 2 of the recipe book.`
            }
        },
        qualityOfLife: true
    },
    cookies3: {
        name: 'Cookie Recipes III',
        description: 'Your Bakers threaten to quit without a higher pay. If you do pay them, they will bake even more fancy cookies.',
        maxLevel: 1,
        costPerLevel: 24999,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} appeased the union of Bakers.`
            }
        },
        qualityOfLife: true
    },
    cookies4: {
        name: 'Cookie Recipes IV',
        description: 'This is a small price to pay for Salvation.',
        maxLevel: 1,
        costPerLevel: 499999,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} paid your price for salvation.`
            }
        },
        qualityOfLife: true
    },
    cookies5: {
        name: 'Cookie Recipes V (WIP)',
        description: 'The worst atrocity a man can commit is witnessing, without anguish, the suffering of others.',
        maxLevel: 1,
        costPerLevel: 1.66e15,
        minimumSingularity: 215,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have' : 'have not'} paid witness to the suffering of the masses.`
            }
        },
        qualityOfLife: true
    },
    ascensions: {
        name: 'Improved Ascension Gain',
        description: 'Buying this, you will gain +2% Ascension Count forever, per level! Every 10 levels grants an additional, multiplicative +1% Ascension Count.',
        maxLevel: -1,
        costPerLevel: 5,
        effect: (n: number) => {
            return {
                bonus: (1 + 2 * n / 100) * (1 + Math.floor(n / 10) / 100),
                desc: `Ascension Count increases ${format((100 + 2 * n) * (1 + Math.floor(n/10) / 100) - 100, 1, true)}% faster.`
            }
        }
    },
    corruptionFourteen: {
        name: 'Level Fourteen Corruptions',
        description: 'Buy this to unlock level fourteen corruptions. :)',
        maxLevel: 1,
        costPerLevel: 1000,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} gained the ability to use level 14 corruptions. ${(n > 0)? ':)': ':('}`
            }
        }
    },
    corruptionFifteen: {
        name: 'Level Fifteen Corruptions',
        description: 'This doesn\'t *really* raise the corruption limit. Rather, it adds one FREE level to corruption multipliers, no matter what (can exceed cap). :)',
        maxLevel: 1,
        costPerLevel: 40000,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} gained a free corruption level. ${(n > 0)? ':)': ':('}`
            }
        }
    },
    singOfferings1: {
        name: 'Offering Charge',
        description: 'Upgrade this to get +2% Offerings per level, forever!',
        maxLevel: -1,
        costPerLevel: 1,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.02 * n,
                desc: `Permanently gain ${format(2 * n, 0, true)}% more Offerings.`
            }
        }

    },
    singOfferings2: {
        name: 'Offering Storm',
        description: 'Apparently, you can use this bar to attract more Offerings. +8% per level, to be precise.',
        maxLevel: 25,
        costPerLevel: 25,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.08 * n,
                desc: `Permanently gain ${format(8 * n, 0, true)}% more Offerings.`
            }
        }
    },
    singOfferings3: {
        name: 'Offering Tempest',
        description: 'This bar is so prestine, it\'ll make anyone submit their Offerings. +4% per level, to be precise.',
        maxLevel: 40,
        costPerLevel: 500,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.04 * n,
                desc: `Permanently gain ${format(4 * n, 0, true)}% more Offerings.`
            }
        }
    },
    singObtainium1: {
        name: 'Obtainium Wave',
        description: 'Upgrade this to get +2% Obtainium per level, forever!',
        maxLevel: -1,
        costPerLevel: 1,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.02 * n,
                desc: `Permanently gain ${format(2 * n, 0, true)}% more Obtainium.`
            }
        }
    },
    singObtainium2: {
        name: 'Obtainium Flood',
        description: 'Holy crap, water bending! +8% gained Obtainium per level.',
        maxLevel: 25,
        costPerLevel: 25,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.08 * n,
                desc: `Permanently gain ${format(8 * n, 0, true)}% more Obtainium.`
            }
        }
    },
    singObtainium3: {
        name: 'Obtainium Tsunami',
        description: 'A rising tide lifts all boats. +4% gained Obtainium per level.',
        maxLevel: 40,
        costPerLevel: 500,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.04 * n,
                desc: `Permanently gain ${format(4 * n, 0, true)}% more Obtainium.`
            }
        }
    },
    singCubes1: {
        name: 'Cube Flame',
        description: 'Upgrade this to get +2% Cubes per level, forever!',
        maxLevel: -1,
        costPerLevel: 1,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.02 * n,
                desc: `Permanently gain ${format(2 * n, 0, true)}% more Cubes.`
            }
        }
    },
    singCubes2: {
        name: 'Cube Blaze',
        description: 'Burn some more Golden Quarks! +8% gained Cubes per level.',
        maxLevel: 25,
        costPerLevel: 25,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.08 * n,
                desc: `Permanently gain ${format(8 * n, 0, true)}% more Cubes.`
            }
        }
    },
    singCubes3: {
        name: 'Cube Inferno',
        description: 'Even Dante is impressed. +4% gained Cubes per level.',
        maxLevel: 40,
        costPerLevel: 500,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.04 * n,
                desc: `Permanently gain ${format(4 * n, 0, true)}% more Cubes.`
            }
        }
    },
    singCitadel: {
        name: 'Citadel of Singularity',
        description: 'What a unique structual phenomenon... but it gives +2% Obtainium, Offerings, and 3-7D cubes per level! +1% Additional for every 10 levels!',
        maxLevel: -1,
        costPerLevel: 500000,
        minimumSingularity: 100,
        effect: (n: number) => {
            return {
                bonus: (1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100),
                desc: `Obtainium, Offerings, and 3-7D Cubes +${format(100 * ((1 + 0.02 * n) * (1 + Math.floor(n/10)/100) - 1))}%, forever!`
            }
        }
    },
    singCitadel2: {
        name: 'Citadel of Singularity: The Real Edition',
        description: 'This actual Citadel gives +2% Obtainium, Offerings, and 3-7D cubes per level! +1% Additional for every 10 levels! Also sets the free level of the fake citadel to whatever level this is.',
        maxLevel: 100,
        costPerLevel: 1e14,
        minimumSingularity: 210,
        specialCostForm: 'Quadratic',
        effect: (n: number) => {
            return {
                bonus: (1 + 0.02 * n) * (1 + Math.floor(n / 10) / 100),
                desc: `Obtainium, Offerings, and 3-7D Cubes +${format(100 * ((1 + 0.02 * n) * (1 + Math.floor(n/10)/100) - 1))}%, forever!`
            }
        }
    },
    octeractUnlock: {
        name: 'Octeracts',
        description: 'Hey!!! What are you trying to do?!?',
        maxLevel: 1,
        costPerLevel: 8888,
        minimumSingularity: 8,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} bought into the Octeract hype.`
            }
        },
        qualityOfLife: true
    },
    singOcteractPatreonBonus: {
        name: 'Platonic $ells out!!!',
        description: 'You know that Patreon bonus? Yeah, that\'s cool and all, but what if it also boosted Octeract production by the same amount?',
        maxLevel: 1,
        costPerLevel: 9999,
        minimumSingularity: 12,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `Octeract production is ${n}% faster for every $10 per month on the Patreon! Same as the Quark bonus which already exists.`
            }
        }
    },
    offeringAutomatic: {
        name: 'Blueberry Shards! (WIP)',
        description: 'The legends are true. \n The Prophecies are fulfilled. \n Ant God has heard your prayers. \n Let there be blueberries! \n And they were good.',
        maxLevel: -1,
        costPerLevel: 1e14,
        minimumSingularity: 222,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `You have purchased ${n} tasty blueberries.`
            }
        }
    },
    intermediatePack: {
        name: 'Intermediate Pack',
        description: 'Double Global Speed, Multiply Ascension speed by 1.5, and gain +2% Quarks forever. Yum... 2% Quark Milk.',
        maxLevel: 1,
        costPerLevel: 1,
        minimumSingularity: 4,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} upgraded your package to intermediate.`
            }
        }
    },
    advancedPack: {
        name: 'Advanced Pack',
        description: 'Now we\'re cooking with kerosene! Gain +4% Quarks stack with intermediate, +0.33 to all corruption score multipliers, regardless of level!',
        maxLevel: 1,
        costPerLevel: 200,
        minimumSingularity: 9,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} bought our advanced package.`
            }
        }
    },
    expertPack: {
        name: 'Expert Pack',
        description: 'That\'s a handful! Gain +6% Quarks stack with advanced, 1.5x Ascension Score, Code \'add\' gives 1.2x Ascension Timer.',
        maxLevel: 1,
        costPerLevel: 800,
        minimumSingularity: 16,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} switched to the expert provider.`
            }
        }
    },
    masterPack: {
        name: 'Master Pack',
        description: 'A tad insane. Gain +8% Quarks stack with expert, for every level 14 corruption, Ascension score is multiplied by 1.1.',
        maxLevel: 1,
        costPerLevel: 3200,
        minimumSingularity: 25,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} mastered your inner chakras.`
            }
        }
    },
    divinePack: {
        name: 'Divine Pack',
        description: 'OHHHHH. Gain +10% Quarks stack with master, and multiply Octeract gain by 7.77 if corruptions are all set to 14.',
        maxLevel: 1,
        costPerLevel: 12800,
        minimumSingularity: 36,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} found the reason for existence${(n > 0) ? '' : ' just yet'}.`
            }
        }
    },
    wowPass2: {
        name: 'Shop Liquidation Sale',
        description: 'The Seal Merchant needs to get rid of some exotic goods. Only for a steep price. I do not think that is how sales work.',
        maxLevel: 1,
        costPerLevel: 19999,
        minimumSingularity: 11,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} triggered the Liquidation event!`
            }
        },
        qualityOfLife: true
    },
    wowPass3: {
        name: 'QUAAAACK',
        description: 'QUAAAAAAAACK. The Merchant has gone crazy for your QUARKS!',
        maxLevel: 1,
        costPerLevel: 3e7 - 1,
        minimumSingularity: 83,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} triggered the QUACKSTRAVAGANZA!!`
            }
        },
        qualityOfLife: true
    },
    potionBuff: {
        name: 'Potion Decanter of Enlightenment',
        description: 'Purported to actually be the fountain of youth, this item powers up potions considerably!',
        maxLevel: 10,
        costPerLevel: 999,
        minimumSingularity: 4,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: Math.max(1, 10 * Math.pow(n, 2)),
                desc: `Potions currently give ${format(Math.max(1, 10 * Math.pow(n, 2)), 0, true)}x items!`
            }
        }
    },
    potionBuff2: {
        name: 'Potion Decanter of Inquisition',
        description: 'Staring at the glass, you aren\'t actually sure what this potion is.',
        maxLevel: 10,
        costPerLevel: 1e8,
        minimumSingularity: 121,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: Math.max(1, 2 * n),
                desc: `Potions currently give ${format(Math.max(1, 2 * n), 0, true)}x items!`
            }
        }
    },
    potionBuff3: {
        name: 'Potion Decanter of Maddening Instability',
        description: 'SHE\'S GONNA BLOW!!!! Said Midas, the Golden Quark Salesman. Oh yeah, did we mention he\'s in the game?',
        maxLevel: 10,
        costPerLevel: 1e12,
        minimumSingularity: 196,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: Math.max(1, 1 + 0.5 * n),
                desc: `Potions currently give ${format(Math.max(1, 1 + 0.5 * n), 2, true)}x items!`
            }
        }
    },
    singChallengeExtension: {
        name: 'Bigger Challenge Caps',
        description: 'Need more Challenges? Well, add 2 more Reincarnation Challenges and 1 Ascension Challenge to the cap, per level.',
        maxLevel: 4,
        costPerLevel: 999,
        minimumSingularity: 11,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `You feel motivated enough to complete ${2 * n} more Reincarnation Challenges, and ${n} more Ascension Challenges.`
            }
        }
    },
    singChallengeExtension2: {
        name: 'Biggerer Challenge Caps',
        description: 'Need even more Challenges? Well, add 2 more Reincarnation Challenges and 1 Ascension Challenge to the cap, per level.',
        maxLevel: 3,
        costPerLevel: 29999,
        minimumSingularity: 26,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `You feel motivated enough to complete ${2 * n} more Reincarnation Challenges, and ${n} more Ascension Challenges.`
            }
        }
    },
    singChallengeExtension3: {
        name: 'BiggererEST Challenge Caps',
        description: 'Need even MORE Challenges? Well, add 2 more Reincarnation Challenges and 1 Ascension Challenge to the cap, per level. Does it not seem excessive?',
        maxLevel: 3,
        costPerLevel: 749999,
        minimumSingularity: 51,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `You feel motivated enough to complete ${2 * n} more Reincarnation Challenges, and ${n} more Ascension Challenges.`
            }
        }
    },
    singQuarkImprover1: {
        name: 'Marginal Quark Gain Improver Thingy',
        description: 'A doohickey that I forgot what it looked like. +0.5% Quarks per level, multiplicative with all other bonuses! Seems like it grows in cost a lot faster than anything else though. Also, did you know these descriptions can be arbitarily long?',
        maxLevel: 30,
        costPerLevel: 1,
        minimumSingularity: 177,
        canExceedCap: true,
        specialCostForm: 'Exponential2',
        effect: (n: number) => {
            return {
                bonus: n/200,
                desc: `You gain ${format(n/2, 2, true)}% more Quarks!`
            }
        },
        qualityOfLife: true
    },
    singQuarkHepteract: {
        name: 'I wish my Quark Hepteract was marginally better.',
        description: 'Wrong game, oops. Anyway, would you like a very slightly better DR exponent on Quark Hepteract?',
        maxLevel: 1,
        costPerLevel: 14999,
        minimumSingularity: 5,
        effect: (n: number) => {
            return {
                bonus: n/100,
                desc: `The DR exponent is now ${format(2 *n, 2, true)}% larger!`
            }
        },
        qualityOfLife: true
    },
    singQuarkHepteract2: {
        name: 'I wish my Quark Hepteract was marginally better II.',
        description: 'Still not the right game. Same as the previous upgrade.',
        maxLevel: 1,
        costPerLevel: 449999,
        minimumSingularity: 30,
        effect: (n: number) => {
            return {
                bonus: n/100,
                desc: `The DR exponent is now ${format(2 * n, 2, true)}% larger!`
            }
        },
        qualityOfLife: true
    },
    singQuarkHepteract3: {
        name: 'I wish my Quark Hepteract was marginally better III.',
        description: 'I AM NOT THE GODMOTHER YOU ARE LOOKING FOR, DYLAN!',
        maxLevel: 1,
        costPerLevel: 13370000,
        minimumSingularity: 61,
        effect: (n: number) => {
            return {
                bonus: n/100,
                desc: `The DR exponent is now ${format(2 * n, 2, true)}% larger!`
            }
        },
        qualityOfLife: true
    },
    singOcteractGain: {
        name: 'Octeract Absinthe',
        description: 'You would have never known this tonic can boost your Octeracts! [+1% per level, in fact!]',
        maxLevel: -1,
        costPerLevel: 20000,
        minimumSingularity: 36,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Octeract Gain +${format(n, 0, true)}%`
            }
        }
    },
    singOcteractGain2: {
        name: 'Pieces of Eight',
        description: 'There is indeed eight of them, but each only gives +0.5% bonus, so each level gives +4% Octeract per level.',
        maxLevel: 25,
        costPerLevel: 40000,
        minimumSingularity: 36,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.04 * n,
                desc: `Octeract Gain +${format(4*n, 0, true)}%`
            }
        }
    },
    singOcteractGain3: {
        name: 'The Obelisk Shaped like an Octagon.',
        description: 'Platonic had to reach pretty far here. +2% Octeracts yeah!',
        maxLevel: 50,
        costPerLevel: 250000,
        minimumSingularity: 55,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.02 * n,
                desc: `Octeract Gain +${format(2 * n, 0, true)}%`
            }
        }
    },
    singOcteractGain4: {
        name: 'Octahedral Synthesis',
        description: 'How does this even work!?? +1% Octeracts, you bet!',
        maxLevel: 100,
        costPerLevel: 750000,
        minimumSingularity: 77,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Octeract Gain +${format(n, 0, true)}%`
            }
        }
    },
    singOcteractGain5: {
        name: 'The Eighth Wonder of the World',
        description: 'is the wonder of the world we live in. [+0.5% Octeracts. Platonic, this is so stingy! but, he does not care one bit.]',
        maxLevel: 200,
        costPerLevel: 7777777,
        minimumSingularity: 100,
        canExceedCap: true,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.005 * n,
                desc: `Octeract Gain +${format(n / 2, 1, true)}%`
            }
        }
    },
    platonicTau: {
        name: 'Platonic TAU',
        description: 'Placed in the wrong upgrade section, this will remove any restrictions on corruptions or corruption level caps! Also raises 3d cube gain to the power of 1.01!',
        maxLevel: 1,
        costPerLevel: 100000,
        minimumSingularity: 29,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `This upgrade has ${n > 0 ? '' : 'NOT'} been purchased!`
            }
        },
        qualityOfLife: true
    },
    platonicAlpha: {
        name: 'Platonic ALPHA...?',
        description: 'Confusion ensues as to why there are two of these. This one is capitalized, so buying this ensures Platonic Alpha is always maxed!',
        maxLevel: 1,
        costPerLevel: 2e7,
        minimumSingularity: 70,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `This upgrade has ${n > 0 ? '' : 'NOT'} been purchased!`
            }
        },
        qualityOfLife: true
    },
    platonicDelta: {
        name: 'Platonic DELTA',
        description: 'Time follows you towards the future, after getting this bad boy. Gain +100% more cubes per day in your current singularity, up to +900% at day 9.',
        maxLevel: 1,
        costPerLevel: 5e9,
        minimumSingularity: 111,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `This upgrade has ${n > 0 ? '' : 'NOT'} been purchased!`
            }
        }
    },
    platonicPhi: {
        name: 'Platonic PHI',
        description: 'Time follows you toward the past as well. Gain 5 additional free Singularity Upgrades per day in your singularity from code daily, up to +50 after 10 days.',
        maxLevel: 1,
        costPerLevel: 2e11,
        minimumSingularity: 152,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `This upgrade has ${n > 0 ? '' : 'NOT'} been purchased!`
            }
        },
        qualityOfLife: true
    },
    singFastForward: {
        name: 'Etherflux Singularities',
        description: 'Golden Quark gained by Singularity is increased by 100% (additive), and going singular at your all time highest count gives +1 singularity count!',
        maxLevel: 1,
        costPerLevel: 7e6 - 1,
        minimumSingularity: 50,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `You've ${n > 0 ? '' : 'NOT'} transformed the Etherflux!`
            }
        },
        qualityOfLife: true
    },
    singFastForward2: {
        name: 'Aetherflux Singularities',
        description: 'Golden Quark gained by Singularity is increased by 100% (additive) and going singular at your all time highest count gives +1 singularity count! It\'s like Etherflux but with an A.',
        maxLevel: 1,
        costPerLevel: 1e11 - 1,
        minimumSingularity: 150,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `You've ${n > 0 ? '' : 'NOT'} transformed the Aetherflux!`
            }
        },
        qualityOfLife: true
    },
    singAscensionSpeed: {
        name: 'A hecking good ascension speedup!',
        description: 'Ascension Speed is raised to the power of 1.03, raised to 0.97 if less than 1x.',
        maxLevel: 1,
        costPerLevel: 1e10,
        minimumSingularity: 130,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `Ascension Speed ^${format(1 + 0.03 * n, 2, true)}, ^${format(1 - 0.03 * n, 2, true)} if < 1x` // TODO
            }
        }
    },
    singAscensionSpeed2: {
        name: 'A mediocre ascension speedup!',
        description: 'Ascension speed is multiplied by 6 if you have not purchased Antiquities in your current Singularity.',
        maxLevel: 1,
        costPerLevel: 1e12,
        minimumSingularity: 150,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: 'The effect is clear!' // TODO
            }
        }
    },
    WIP: {
        name: 'WIP TEMPLATE',
        description: 'This is a template! Bottom Text.',
        maxLevel: 100,
        costPerLevel: 1e300,
        minimumSingularity: 251,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: 'Update this description at a later time!!!!!!!!!!' // TODO
            }
        }
    },
    ultimatePen: {
        name: 'The Ultimate Pen',
        description: 'You. It is you who is the author of your own story!',
        maxLevel: 1,
        costPerLevel: 2.22e22,
        minimumSingularity: 300,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `You do ${n > 0 ? '' : 'NOT'} own the Ultimate Pen. ${n > 0 ? ' However, the pen just ran out of ink. How will you get more?' : ''}`
            }
        }
    },
    oneMind: {
        name: 'ONE MIND',
        description: 'A note, you found on the ground: seems like an advertisement for a cult. "Lock your ascension speed to 10x, and multiply all cubes based on the difference." Hmm...',
        maxLevel: 1,
        costPerLevel: 1.66e13,
        minimumSingularity: 166,
        effect: (n : number) => {
            return {
                bonus: n > 0,
                desc: `You have ${n > 0 ? '' : 'NOT'} joined the cult!`
            }
        },
        qualityOfLife: true
    },
    wowPass4: {
        name: 'QUQUQUQUAAKCKCKKCKKCKK',
        description: 'Deals that\'ll cost you a beak and a wing!',
        maxLevel: 1,
        costPerLevel: 66666666666,
        minimumSingularity: 150,
        effect: (n : number) => {
            return {
                bonus: n > 0,
                desc: `You have ${n > 0 ? '' : 'NOT'} quacked your last QUARK`
            }
        },
        qualityOfLife: true
    },
    blueberries: {
        name: 'Blueberry Shards! (WIP)',
        description: 'Blueberries! Yeah, Platonic is out of ideas. Well, each Blueberry gives a 0.01% chance per second to generate some Ambrosia!',
        maxLevel: -1,
        costPerLevel: 1e16,
        minimumSingularity: 222,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `You have purchased ${n} tasty blueberries.`
            }
        },
        specialCostForm: 'Exponential2'
    }
}

/**
 * Singularity Perks are automatically obtained and upgraded, based on player.singularityCount
 * They can have one or several levels with a description for each level
 */
export class SingularityPerk {
    public readonly name: string
    public readonly levels: number[]
    public readonly description: (n: number, levels: number[]) => string

    public constructor(perk: SingularityPerk) {
        this.name = perk.name;
        this.levels = perk.levels;
        this.description = perk.description;
    }
}

// List of Singularity Perks based on player.highestSingularityCount
// The list is ordered on first level acquisition, so be careful when inserting a new one ;)
export const singularityPerks: SingularityPerk[] = [
    {
        name: 'XYZ: Xtra dailY rewardZ',
        levels: [1, 20, 200],
        description: (n: number, levels: number[]) => {
            if (n >= levels[2]) {
                return 'In addition to GQ and guaranteed free levels to GQ 1/2/3 at +0.2/+0.2/+1, you get DOUBLE the amount of free upgrade levels from the Daily Special Action!'
            } else if (n >= levels[1]) {
                return 'In addition to GQ and free upgrade levels, the Daily Special Action gives you additional free levels to GQ 1/2/3 at +0.2/+0.2/+1 levels respectively.'
            } else {
                return 'The Daily Special Action now rewards you with Golden Quarks and free levels for random Singularity upgrades, both scaling with your singularity count!'
            }
        }
    },
    {
        name: 'Unlimited growth',
        levels: [1],
        description: () => {
            return `+10% to Quarks gain and Ascension Count for each Singularity. Currently: +${format(10*player.singularityCount)}%`
        }
    },
    {
        name: 'Golden coins',
        levels: [1],
        description: () => {
            return 'Unspent Golden Quarks boost Coin gain. Especially strong for first Ascensions of each Singularity'
        }
    },
    {
        name: 'Hepteract Autocraft',
        levels: [1],
        description: () => {
            return 'Hepteract Autocraft will be unlocked'
        }
    },
    {
        name: 'Generous Orbs',
        levels: [1, 2, 5, 10, 15, 20, 25, 30, 35],
        description: (n: number, levels: number[]) => {
            const overfluxBonus = {
                8: 700, // How to read: levels[8] -> Sing 35 gives 700%
                7: 500,
                6: 415,
                5: 360,
                4: 315,
                3: 280,
                2: 255,
                1: 230
            } as const;

            for (let i = 8; i > 0; i--) {
                if (n >= levels[i]) {
                    return `Overflux Orbs effect on opening Cubes for Quarks can now go up to ${overfluxBonus[i as keyof typeof overfluxBonus]}%`
                }
            }
            return 'Overflux Orbs effect on opening Cubes for Quarks can now go up to 215%'
        }
    },
    {
        name: 'Research for Dummies',
        levels: [1, 11],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'You permanently keep Auto Research'
            } else {
                return 'You can Research using Hover to Buy'
            }
        }
    },
    {
        name: 'Super Start',
        levels: [2, 3, 4, 7, 15],
        description: (n: number, levels: number[]) => {
            if (n >= levels[4]) {
                return 'You start each Ascension with 1 Transcension, 1 Reincarnation, 1001 Mythos, 2.22e2222 Particles and 500 Obtainium'
            } else if (n >= levels[3]) {
                return 'You start each Ascension with 1 Transcension, 1 Reincarnation, 1001 Mythos, 1e100 Particles and 500 Obtainium'
            } else if (n >= levels[2]) {
                return 'You start each Ascension with 1 Transcension, 1 Reincarnation, 1001 Mythos, 1e16 Particles and 500 Obtainium'
            } else if (n >= levels[1]) {
                return 'You start each Ascension with 1 Transcension, 1 Reincarnation, 1001 Mythos and 10 Particles'
            } else {
                return 'You start each Ascension with 1 Transcension and 1001 Mythos'
            }
        }
    },
    {
        name: 'Not so Challenging',
        levels: [4, 7, 10, 15, 20],
        description: (n: number, levels: number[]) => {
            if (n >= levels[4]) {
                return 'You start each Ascension with 1 completion of Challenges 6, 7 & 9 and 5 completions of Challenge 8'
            } else if (n >= levels[3]) {
                return 'You start each Ascension with 1 completion of Challenges 6 & 7 and 5 completions of Challenge 8'
            } else if (n >= levels[2]) {
                return 'You start each Ascension with 1 completion of Challenges 6, 7 and 8'
            } else if (n >= levels[1]) {
                return 'You start each Ascension with 1 completion of Challenges 6 and 7'
            } else {
                return 'You start each Ascension with 1 completion of Challenge 6'
            }
        }
    },
    {
        name: 'Automation Upgrades',
        levels: [5, 10, 15, 25, 30, 100],
        description: (n: number, levels: number[]) => {
            if (n >= levels[5]) {
                return 'Having achieved 100 Singularity, you will never forget the taste of Wow! A pile of Chocolate Chip Cookies!'
            } else if (n >= levels[4]) {
                return 'You always have w1x4 through w1x8 and w2x10; r6x5, r6x10 and r6x20. Automation Shop is also automatically purchased!'
            } else if (n >= levels[3]) {
                return 'You always have w1x4 through w1x8 and w2x10. Automation Shop is now automatically purchased!'
            } else if (n >= levels[2]) {
                return 'You always have w1x4 through w1x8 and w2x10.'
            } else if (n >= levels[1]) {
                return 'You always have w1x4 through w1x8.'
            } else {
                return 'You always have w1x7. (Autobuyers for Particle buildings)'
            }
        }
    },
    {
        name: 'Even more Quarks',
        levels: [5, 20, 35, 50, 65, 80, 90, 100, 121, 144, 150, 160, 166, 169, 170, 175, 180, 190, 196, 200, 200, 201, 202, 203, 204, 205, 210, 212, 214, 216, 218, 220, 225, 250],
        description: (n: number, levels: number[]) => {

            for (let i = levels.length - 1; i >= 0; i--) {
                if (n >= levels[i]) {
                    return `You gain ${i+1} stacks of 5% Quarks! Total Increase: +${format(100 * (Math.pow(1.05, i+1) - 1), 2)}%`
                }
            }
            return 'This is a bug! Contact Platonic if you see this message, somehow.'
        }
    },
    {
        name: 'Shop Special Offer',
        levels: [5, 20, 51],
        description: (n: number, levels: number[]) => {
            if (n >= levels[2]) {
                return 'Reincarnation and Ascension tier Shop upgrades are kept permanently!'
            } else if (n >= levels[1]) {
                return 'You permanently keep 100 free levels of each Shop upgrade in the first row'
            } else {
                return 'You start each Singularity with 10 free levels of each Shop upgrade in the first row'
            }
        }
    },
    {
        name: 'Potion Autogenerator',
        levels: [6],
        description: () => {
            return 'Every 180 Seconds, automatically use one potion for Obtainium and Offerings! Interval reduced by 3% per singularity.'
        }
    },
    {
        name: 'Respec, be gone!',
        levels: [7],
        description: () => {
            return 'Talismans now buff all runes at all times!'
        }
    },
    {
        name: 'For the love of (the Ant) God',
        levels: [10, 15, 25],
        description: (n: number, levels: number[]) => {
            if (n >= levels[2]) {
                return 'You permanently keep Ant autobuyers and start each Ascension with a Tier 8 Ant'
            } else if (n >= levels[1]) {
                return 'You permanently keep Ant autobuyers and start each Ascension with a Tier 5 Ant'
            } else {
                return 'You permanently keep Ant autobuyers and start each Ascension with a Tier 1 Ant'
            }
        }
    },
    {
        name: 'It all adds up',
        levels: [10, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 235, 240],
        description: (n: number, levels: number[]) => {
            for (let i = levels.length - 1; i >= 0; i--) {
                if (n >= levels[i]) {
                    return `ADD code reward is divided by ${format(1 + (i+1)/5, 2, true)} but the cooldown is also divided by ${format(1 + (i+1)/5, 2, true)} and capacity is multiplied by ${format(1 + (i+1)/5, 2, true)} (rounded up).`
                }
            }
            return 'BUG!!!'
        }
    },
    {
        name: 'Automagical Runes',
        levels: [15, 30, 40, 50],
        description: (n: number, levels: number[]) => {
            if (n >= levels[3]) {
                return 'Runes autobuyer will buy Blessings, Spirits, Talisman Shards, Fragments and will level up Infinite Ascent AND Antiquities of Ant God'
            } else if (n >= levels[2]) {
                return 'Runes autobuyer will buy Blessings, Spirits, Talisman Shards, Fragments and will level up Infinite Ascent'
            } else if (n >= levels[1]) {
                return 'Runes autobuyer will buy Blessings, Spirits and level up Infinite Ascent'
            } else {
                return 'Runes autobuyer will buy Blessings and Spirits'
            }
        }
    },
    {
        name: 'Exalted Achievements',
        levels: [25],
        description: () => {
            return 'Unlocks new, very difficult achievements! They are earned differently from others, however... (WIP)'
        }
    },
    {
        name: 'Derpsmith\'s Cornucopia',
        levels: [18, 38, 58, 78, 88, 98, 118, 148, 178, 188, 198, 208, 218, 228, 238, 248],
        description: (n: number, levels: number[]) => {
            let counter = 0
            for (const singCount of levels) {
                if (n >= singCount) {
                    counter += 1
                }
            }

            return `With blessing from the Derpsmith, every singularity grants +${counter}% more Octeracts!`
        }
    },
    {
        name: 'Cool QoL Cubes',
        levels: [25, 35],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'Keep all Cube Opening researches AND gain the ability to automatically open a percentage of your cubes each Ascension!'
            } else {
                return 'Researches related to opening cubes will no longer reset on Ascension'
            }
        }
    },
    {
        name: 'Eternal Ascensions',
        levels: [25, 101],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'You can now automatically ascend based on time length and autorun Ascension Challenges with Instant Challenges 2!'
            } else {
                return 'You can now automatically ascend based on the length of the Ascension'
            }
        }
    },
    {
        name: 'Ant God\'s Cornucopia',
        levels: [30, 70, 100],
        description: (n: number, levels: number[]) => {
            if (n >= levels[2]) {
                return 'Ant Speed is multiplied by 1 TRILLION, this increase is immune to any and all corruption.'
            } else if (n >= levels[1]) {
                return 'Ant Speed is multiplied by 1 MILLION, this increase is immune to any and all corruption.'
            } else {
                return 'Ant Speed is multiplied by 1,000, this increase is immune to any and all corruption.'
            }
        }
    },
    {
        name: 'Overclocked',
        levels: [50, 60, 75, 100, 125, 150, 175, 200, 225, 250],
        description: (n: number, levels: number[]) => {
            for (let i = levels.length - 1; i >= 0; i--) {
                if (n >= levels[i]) {
                    return `Level Caps on Certain Singularity Upgrades are increased by ${i+1}!`
                }
            }
            return 'This is a bug! Contact Platonic if you see this message, somehow.'
        }
    },
    {
        name: 'Wow! Cube Automated Shipping',
        levels: [50, 150],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'Automatically buy Cube Upgrades with each ascension, no matter where you are!'
            } else {
                return 'Automatically buy Cube Upgrades with each ascension, but only if you are in a Singularity Challenge.'
            }
        }
    },
    {
        name: 'Golden Revolution',
        levels: [100],
        description: () => {
            return `Singularity grants 0.4% more Golden Quarks per Singularity. Currently: +${format(Math.min(100, 0.4*player.singularityCount), 1)}% (MAX: +100%)`
        }
    },
    {
        name: 'Golden Revolution II',
        levels: [100],
        description: () => {
            return `Golden Quarks are 0.2% cheaper per Singularity. Currently: -${format(Math.min(50, 0.2*player.singularityCount), 1)}% (MAX: -50%)`
        }
    },
    {
        name: 'Golden Revolution III',
        levels: [100],
        description: () => {
            return `Export gives 2% more Golden Quarks per Singularity. Currently: +${format(Math.min(500, 2*player.singularityCount))}% (MAX: +500%)`
        }
    },
    {
        name: 'Clones of Platonic Clicking At Your Desktop',
        levels: [100, 200],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'Automatically buy Platonic Upgrades with each ascension, without spending Obtainium or Offerings, anywhere!'
            } else {
                return 'Automatically buy Platonic Upgrades with each ascension, without spending Obtainium or Offerings, but only in a Singularity Challenge.'
            }
        }
    },
    {
        name: 'PL-AT Σ',
        levels: [125, 200],
        description: (n: number, levels: number[]) => {
            let counter = 0
            for (const singCount of levels) {
                if (n >= singCount) {
                    counter += 0.125
                }
            }
            return `Code 'add' refills ${counter}% faster per level per Singularity. Currently: ${format(Math.min(50, counter*player.singularityCount), 1)} (MAX: -60% Cooldown)`
        }
    },
    {
        name: 'Midas\' Millenium-Aged Gold',
        levels: [150],
        description: () => {
            return 'Every use of code `add` gives 0.01 free levels of GQ1 and 0.05 free levels of GQ3.'
        }
    },
    {
        name: 'Golden Revolution IV',
        levels: [160, 173, 185, 194, 204, 210, 219, 229, 240, 249],
        description: (n: number, levels: number[]) => {
            const perSecond = 1000000
            let divisor = 0
            for (const singCount of levels) {
                if (n >= singCount) {
                    divisor += 1
                }
            }
            return `Every Octeract tick, convert 1 in ${format(perSecond / divisor, 0, true)} GQ you would gain in this singularity to your balance automagically!`
        }
    },
    {
        name: 'Octeract Metagenesis',
        levels: [200, 205],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'Gives 1% of your purchased Octeract Cogenesis AND Trigenesis as bonus levels of themselves per use of the Daily Special Action!'
            } else {
                return 'Gives 1% of your purchased Octeract Cogenesis as bonus levels of Octeract Cogenesis per use of the Daily Special Action!'
            }
        }
    },
    {
        name: 'Immaculate Alchemy',
        levels: [200, 208, 221],
        description: (n: number, levels: number[]) => {
            if (n >= levels[2]) {
                return 'After Singularity 200, Fast Forwards no longer work! Instead, multiply your GQ gain and divide your GQ buy cost by 8.'
            } else if (n >= levels[1]) {
                return 'After Singularity 200, Fast Forwards no longer work! Instead, multiply your GQ gain and divide your GQ buy cost by 5.'
            } else {
                return 'After Singularity 200, Fast Forwards no longer work! Instead, multiply your GQ gain and divide your GQ buy cost by 3.'
            }
        }
    },
    {
        name: 'skrauQ',
        levels: [200],
        description: () => {
            const amt = Math.pow((player.singularityCount - 179) / 20, 2)
            return `Multiply all Quark Gain by ((Singularity - 179)/20)^2. Currently: ${format(amt)}... Yes, it's that good.`
        }
    }
]

export const updateSingularityPerks = (): void => {
    const singularityCount = player.highestSingularityCount;
    const str = `The highest Singularity you've reached is the <span style="color: gold">${toOrdinal(singularityCount)} Singularity.</span><br/>
                Here is the list of Perks you have acquired to compensate the Penalties
                (Hover for more details. Perks in <span class="newPerk">gold text</span> were added or improved in this Singularity)<br/>`
                + getAvailablePerksDescription(singularityCount)

    DOMCacheGetOrSet('singularityPerksMultiline').innerHTML = str;
}

export interface ISingularityPerkDisplayInfo {
    name: string
    description: string
    currentLevel: number
    lastUpgraded: number
    nextUpgrade: number | null
    acquired: number
}

/*
* Indicate current level of the Perk and when it was reached
*/
const getLastUpgradeInfo = (perk: SingularityPerk, singularityCount: number): {level: number, singularity: number, next: number | null} => {
    for (let i=perk.levels.length - 1; i >= 0; i--) {
        if (singularityCount >= perk.levels[i]) {
            return {
                level: i + 1,
                singularity: perk.levels[i],
                next: i < perk.levels.length - 1 ? perk.levels[i + 1] : null
            };
        }
    }

    return { level: 0, singularity: perk.levels[0], next: perk.levels[0] };
}

const getAvailablePerksDescription = (singularityCount: number): string => {
    let perksText = '';
    let availablePerks: ISingularityPerkDisplayInfo[] = [];
    const nextUpgrades: number[] = [];
    let singularityCountForNextPerk: number | null = null;
    for (const perk of singularityPerks) {
        const upgradeInfo = getLastUpgradeInfo(perk, singularityCount);
        if (upgradeInfo.level > 0) {
            availablePerks.push({
                name: perk.name,
                description: perk.description(singularityCount, perk.levels),
                currentLevel: upgradeInfo.level,
                lastUpgraded: upgradeInfo.singularity,
                nextUpgrade: upgradeInfo.next,
                acquired: perk.levels[0]
            });
            if (upgradeInfo.next) {
                nextUpgrades.push(upgradeInfo.next);
            }
        } else {
            singularityCountForNextPerk = upgradeInfo.singularity;
            break;
        }
    }

    // We want to sort the perks so that the most recently upgraded or lastUpgraded are listed first
    availablePerks = availablePerks.sort((p1, p2) => {
        if (p1.acquired == p2.acquired && p1.lastUpgraded == p2.lastUpgraded) {
            return 0;
        }
        if (p1.lastUpgraded > p2.lastUpgraded) {
            return -1;
        } else if (p1.lastUpgraded == p2.lastUpgraded && p1.acquired > p2.acquired) {
            return -1;
        }
        return 1;
    })

    for (const availablePerk of availablePerks) {
        perksText += '<br/>' + formatPerkDescription(availablePerk, singularityCount);
    }
    perksText += '<br/>';
    if (singularityCountForNextPerk) {
        perksText += '<br/>You will unlock a whole new Perk in Singularity ' + singularityCountForNextPerk;
    }
    const singularityCountForNextPerkUpgrade = nextUpgrades.reduce((a, b) => Math.min(a, +b), Infinity);
    if (singularityCountForNextPerkUpgrade < Infinity) {
        perksText += '<br/>An existing Perk will be improved in Singularity ' + singularityCountForNextPerkUpgrade;
    }
    return perksText;
}

function formatPerkDescription(perkData: ISingularityPerkDisplayInfo, singularityCount: number): string {
    const singTolerance = getFastForwardTotalMultiplier();
    const isNew = (singularityCount - perkData.lastUpgraded <= singTolerance);
    const levelInfo = perkData.currentLevel > 1 ? ' - Level '+ perkData.currentLevel : '';
    //const acquiredUpgraded = ' / Acq ' + perkData.acquired + ' / Upg ' + perkData.lastUpgraded;
    return `<span${isNew?' class="newPerk"':''} title="${perkData.description}">${perkData.name}${levelInfo}</span>`;
}

// Indicates the number of extra Singularity count gained on Singularity reset
export const getFastForwardTotalMultiplier = (): number => {
    let fastForward = 0;
    fastForward += +player.singularityUpgrades.singFastForward.getEffect().bonus
    fastForward += +player.singularityUpgrades.singFastForward2.getEffect().bonus
    fastForward += +player.octeractUpgrades.octeractFastForward.getEffect().bonus

    // Stop at sing 200 even if you include fast forward
    fastForward = Math.max(0, Math.min(fastForward, 200 - player.singularityCount - 1));

    // Please for the love of god don't allow FF during a challenge
    if (player.insideSingularityChallenge) {
        return 0
    }

    // If the next singularityCount is greater than the highestSingularityCount, fast forward to be equal to the highestSingularityCount
    if (player.highestSingularityCount !== player.singularityCount && player.singularityCount + fastForward + 1 >= player.highestSingularityCount) {
        return Math.max(0, Math.min(fastForward, player.highestSingularityCount - player.singularityCount - 1))
    }

    return fastForward;
}

export const getGoldenQuarkCost = (): {
    cost: number
    costReduction: number
} => {
    const baseCost = 10000

    let costReduction = 10000 // We will construct our cost reduction by subtracting 10000 - this value.

    costReduction *= (1 - 0.10 * Math.min(1, player.achievementPoints / 10000))
    costReduction *= (1 - 0.3 * player.cubeUpgrades[60] / 10000)
    costReduction *= +player.singularityUpgrades.goldenQuarks2.getEffect().bonus
    costReduction *= +player.octeractUpgrades.octeractGQCostReduce.getEffect().bonus
    costReduction *= (player.highestSingularityCount >= 100 ? 1 - 0.5 * player.highestSingularityCount / 250 : 1)

    let perkDivisor = 1
    if (player.highestSingularityCount >= 200) {
        perkDivisor = 3
    }
    if (player.highestSingularityCount >= 208) {
        perkDivisor = 5
    }
    if (player.highestSingularityCount >= 221) {
        perkDivisor = 8
    }
    costReduction /= perkDivisor

    costReduction = 10000 - costReduction

    return {
        cost: baseCost - costReduction,
        costReduction: costReduction
    }

}

export async function buyGoldenQuarks(): Promise<void> {
    const goldenQuarkCost = getGoldenQuarkCost()
    const maxBuy = Math.floor(+player.worlds / goldenQuarkCost.cost)
    let buyAmount = null

    if (maxBuy === 0) {
        return Alert('Sorry, I can\'t give credit. Come back when you\'re a little... mmm... richer!')
    }
    const buyPrompt = await Prompt(`You can buy Golden Quarks here for ${format(goldenQuarkCost.cost, 0, true)} Quarks (Discounted by ${format(goldenQuarkCost.costReduction, 0, true)})! You can buy up to ${format(maxBuy, 0, true)}. How many do you want? Type -1 to buy max!`)
    if (buyPrompt === null) {
        // Number(null) is 0. Yeah..
        return Alert('Okay, maybe next time.');
    }

    buyAmount = Number(buyPrompt)
    //Check these lol
    if (Number.isNaN(buyAmount) || !Number.isFinite(buyAmount)) {
        // nan + Infinity checks
        return Alert('Value must be a finite number!');
    } else if (buyAmount <= 0 && buyAmount != -1) {
        // 0 or less selected
        return Alert('You can\'t craft a nonpositive amount of these, you monster!');
    } else if (buyAmount > maxBuy) {
        return Alert('Sorry, I cannnot sell you this many Golden Quarks! Try buying fewer of them or typing -1 to buy max!')
    } else if (Math.floor(buyAmount) !== buyAmount) {
        // non integer
        return Alert('Sorry. I only sell whole Golden Quarks. None of that fractional transaction!')
    }

    if (buyAmount === -1) {
        const cost = maxBuy * goldenQuarkCost.cost
        player.worlds.sub(cost)
        player.goldenQuarks += maxBuy
        return Alert(`Transaction of ${format(maxBuy, 0, true)} Golden Quarks successful! [-${format(cost,0,true)} Quarks]`)
    } else {
        const cost = buyAmount * goldenQuarkCost.cost
        player.worlds.sub(cost)
        player.goldenQuarks += buyAmount
        return Alert(`Transaction of ${format(buyAmount, 0, true)} Golden Quarks successful! [-${format(cost, 0, true)} Quarks]`)
    }
}

export type SingularityDebuffs = 'Offering' | 'Obtainium' | 'Global Speed' | 'Researches' | 'Ascension Speed' | 'Cubes' | 'Cube Upgrades' |
                                 'Platonic Costs' | 'Hepteract Costs'

export const calculateEffectiveSingularities = (singularityCount: number = player.singularityCount): number => {
    let effectiveSingularities = singularityCount;
    effectiveSingularities *= Math.min(4.75, 0.75 * singularityCount / 10 + 1)

    if (player.insideSingularityChallenge) {
        if (player.singularityChallenges.noOcteracts.enabled) {
            effectiveSingularities *= Math.pow(player.singularityChallenges.noOcteracts.completions + 1, 3)
        }
    }

    if (singularityCount > 10) {
        effectiveSingularities *= 1.5
        effectiveSingularities *= Math.min(4, 1.25 * singularityCount / 10 - 0.25)
    }
    if (singularityCount > 25) {
        effectiveSingularities *= 2.5
        effectiveSingularities *= Math.min(6, 1.5 * singularityCount / 25 - 0.5)
    }
    if (singularityCount > 36) {
        effectiveSingularities *= 4
        effectiveSingularities *= Math.min(5, singularityCount / 18 - 1)
        effectiveSingularities *= Math.pow(1.1, Math.min(singularityCount - 36, 64))
    }
    if (singularityCount > 50) {
        effectiveSingularities *= 5
        effectiveSingularities *= Math.min(8, 2 * singularityCount / 50 - 1)
        effectiveSingularities *= Math.pow(1.1, Math.min(singularityCount - 50, 50))
    }
    if (singularityCount > 100) {
        effectiveSingularities *= 2
        effectiveSingularities *= singularityCount / 25
        effectiveSingularities *= Math.pow(1.1, singularityCount - 100)
    }
    if (singularityCount > 150) {
        effectiveSingularities *= 2
        effectiveSingularities *= Math.pow(1.05, singularityCount - 150)
    }
    if (singularityCount > 200) {
        effectiveSingularities *= 1.5
        effectiveSingularities *= Math.pow(1.275, singularityCount - 200)
    }
    if (singularityCount > 215) {
        effectiveSingularities *= 1.25
        effectiveSingularities *= Math.pow(1.2, singularityCount - 215)
    }
    if (singularityCount > 230) {
        effectiveSingularities *= 2
    }

    return effectiveSingularities
}
export const calculateNextSpike = (singularityCount: number = player.singularityCount): number => {
    const singularityPenaltyThreshold = [11, 26, 37, 51, 101, 151, 201, 216, 230];
    let penaltyDebuff = 0
    penaltyDebuff += player.shopUpgrades.shopSingularityPenaltyDebuff

    for (const sing of singularityPenaltyThreshold) {
        if (sing + penaltyDebuff > singularityCount) {
            return (sing + penaltyDebuff);
        }
    }
    return -1;
}
export const calculateSingularityDebuff = (debuff: SingularityDebuffs, singularityCount: number=player.singularityCount) => {
    if (singularityCount === 0) {
        return 1
    }
    if (player.runelevels[6] > 0) {
        return 1
    }

    let constitutiveSingularityCount = singularityCount
    constitutiveSingularityCount -= player.shopUpgrades.shopSingularityPenaltyDebuff

    const effectiveSingularities = calculateEffectiveSingularities(constitutiveSingularityCount);

    if (debuff === 'Offering') {
        return Math.sqrt(Math.min(effectiveSingularities, calculateEffectiveSingularities(150)) + 1)
    } else if (debuff === 'Global Speed') {
        return 1 + Math.sqrt(effectiveSingularities) / 4
    } else if (debuff === 'Obtainium') {
        return Math.sqrt(Math.min(effectiveSingularities, calculateEffectiveSingularities(150))  + 1)
    } else if (debuff === 'Researches') {
        return 1 + Math.sqrt(effectiveSingularities) / 2
    } else if (debuff === 'Ascension Speed') {
        return (singularityCount < 150) ?
            1 + Math.sqrt(effectiveSingularities) / 5:
            1 + Math.pow(effectiveSingularities, 0.75) / 10000
    } else if (debuff === 'Cubes') {
        return (player.singularityCount < 150) ?
            1 + Math.sqrt(effectiveSingularities) / 4:
            1 + Math.pow(effectiveSingularities, 0.75) / 1000
    } else if (debuff === 'Platonic Costs') {
        return (singularityCount > 36) ? 1 + Math.pow(effectiveSingularities, 3/10) / 12 : 1
    } else if (debuff === 'Hepteract Costs') {
        return (singularityCount > 50) ? 1 + Math.pow(effectiveSingularities, 11/50) / 25 : 1
    } else {
        // Cube upgrades
        return Math.cbrt(effectiveSingularities + 1)
    }
}
