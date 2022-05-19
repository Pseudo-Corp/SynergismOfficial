import { DOMCacheGetOrSet } from './Cache/DOM'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { toOrdinal } from './Utility'

/**
 *
 * Updates all statistics related to Singularities in the Singularity Tab.
 *
 */
export const updateSingularityStats = (): void => {
    const color = player.runelevels[6]>0?'green':'red'
    const str = `You are in the ${toOrdinal(player.singularityCount)} singularity, and have<span style="color: gold"> ${format(player.goldenQuarks,0,true)} golden quarks.</span>
                 <br>Global Speed is divided by ${format(calculateSingularityDebuff('Global Speed'), 2, true)}.
                 Ascension Speed is divided by ${format(calculateSingularityDebuff('Ascension Speed'), 2, true)}
                 Offering Gain is divided by ${format(calculateSingularityDebuff('Offering'), 2, true)}
                 Obtainium Gain is divided by ${format(calculateSingularityDebuff('Obtainium'), 2, true)}
                 Cube Gain is divided by ${format(calculateSingularityDebuff('Cubes'), 2, true)}.
                 Research Costs are multiplied by ${format(calculateSingularityDebuff('Researches'), 2, true)}.
                 Cube Upgrade Costs (Excluding Cookies) are multiplied by ${format(calculateSingularityDebuff('Cube Upgrades'), 2, true)}.
                 <br><span style='color: ${color}'>Antiquities of Ant God is ${(player.runelevels[6] > 0) ? '' : 'NOT'} purchased. Penalties are ${(player.runelevels[6] > 0) ? '' : 'NOT'} dispelled!</span>`

    DOMCacheGetOrSet('singularityMultiline').innerHTML = str;
}

export interface ISingularityData {
    name: string
    description: string
    level?: number
    maxLevel: number
    costPerLevel: number
    toggleBuy?: number
    goldenQuarksInvested?: number
    minimumSingularity?: number
}

/**
 * Singularity Upgrades are bought in the singularity tab, and all have their own
 * name, description, level and maxlevel, plus a feature to toggle buy on each.
 */
export class SingularityUpgrade {

    // Field Initialization
    private readonly name: string;
    private readonly description: string;
    public level = 0;
    private readonly maxLevel: number; //-1 = infinitely levelable
    private readonly costPerLevel: number;
    public toggleBuy = 1; //-1 = buy MAX (or 1000 in case of infinity levels!)
    public goldenQuarksInvested = 0;
    private readonly minimumSingularity: number;

    public constructor(data: ISingularityData) {
        this.name = data.name;
        this.description = data.description;
        this.level = data.level ?? this.level;
        this.maxLevel = data.maxLevel;
        this.costPerLevel = data.costPerLevel;
        this.toggleBuy = data.toggleBuy ?? 1;
        this.goldenQuarksInvested = data.goldenQuarksInvested ?? 0;
        this.minimumSingularity = data.minimumSingularity ?? 0;
    }

    /**
     * Given an upgrade, give a concise information regarding its data.
     * @returns A string that details the name, description, level statistic, and next level cost.
     */
    toString(): string {
        const costNextLevel = this.getCostTNL();
        const maxLevel = this.maxLevel === -1
            ? ''
            : `/${this.maxLevel}`;

        const minimumSingularity = this.minimumSingularity > 0
            ? `Minimum Singularity: ${this.minimumSingularity}`
            : 'No minimal singularity to purchase required'

        return `<span style="color: goldenrod">${this.name}</span>
                <span style="color: #00b300">${this.description}</span>
                <span style="color:red;">${minimumSingularity}</span>
                Level ${this.level}${maxLevel}
                Cost for next level: ${format(costNextLevel)} Golden Quarks.
                Spent Quarks: ${format(this.goldenQuarksInvested, 0, true)}`
    }

    public updateUpgradeHTML(): void {
        DOMCacheGetOrSet('testingMultiline').innerHTML = this.toString()
    }

    /**
     * Retrieves the cost for upgrading the singularity upgrade once. Return 0 if maxed.
     * @returns A number representing how many Golden Quarks a player must have to upgrade once.
     */
    private getCostTNL(): number {
        return (this.maxLevel === this.level) ? 0: this.costPerLevel * (1 + this.level);
    }

    /**
     * Buy levels up until togglebuy or maxxed.
     * @returns An alert indicating cannot afford, already maxxed or purchased with how many
     *          levels purchased
     */
    public async buyLevel(): Promise<void> {
        let purchased = 0;
        let maxPurchasable = (this.maxLevel === -1)
            ? ((this.toggleBuy === -1)
                ? 1000
                : this.toggleBuy)
            : Math.min(this.toggleBuy, this.maxLevel - this.level);

        if (maxPurchasable === 0) {
            return Alert('hey! You have already maxxed this upgrade. :D')
        }

        if (player.singularityCount < this.minimumSingularity) {
            return Alert('you\'re not powerful enough to purchase this yet.')
        }
        while (maxPurchasable > 0) {
            const cost = this.getCostTNL();
            if (player.goldenQuarks < cost) {
                break;
            } else {
                player.goldenQuarks -= cost;
                this.goldenQuarksInvested += cost;
                this.level += 1;
                purchased += 1;
                maxPurchasable -= 1;
            }
        }

        if (purchased === 0) {
            return Alert('You cannot afford this upgrade. Sorry!')
        }

        this.updateUpgradeHTML();
        updateSingularityStats();
    }

    public async changeToggle(): Promise<void> {

        // Is null unless given an explicit number
        const newToggle = await Prompt(`
        Set maximum purchase amount per click for the ${this.name} upgrade.

        type -1 to set to MAX by default.
        `);
        const newToggleAmount = Number(newToggle);

        if (newToggle === null) {
            return Alert(`Toggle kept at ${format(this.toggleBuy)}.`)
        }

        if (!Number.isInteger(newToggle)) {
            return Alert('Toggle value must be a whole number!');
        }
        if (newToggleAmount < -1) {
            return Alert('The only valid negative number for toggle is -1.');
        }
        if (newToggleAmount === 0) {
            return Alert('You cannot set the toggle to 0.');
        }

        this.toggleBuy = newToggleAmount;
        const m = newToggleAmount === -1
            ? 'Your toggle is now set to MAX'
            : `Your toggle is now set to ${format(this.toggleBuy)}`;

        return Alert(m);
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
        description: 'In the future, you will gain 5% more Golden Quarks on singularities! This also reduces the cost to buy Golden Quarks in the shop by 500 per level.',
        maxLevel: 10,
        costPerLevel: 12
    },
    goldenQuarks2: {
        name: 'Golden Quarks II',
        description: 'If you buy this, you will gain 2% more Golden Quarks on singularities. This also reduces the cost to buy Golden Quarks in the shop by 200 per level. Stacks with the first upgrade.',
        maxLevel: 25,
        costPerLevel: 60
    },
    goldenQuarks3: {
        name: 'Golden Quarks III',
        description: 'If you buy this, you will gain 1 Golden Quark per hour from Exports. Also reduces the cost to buy Golden Quarks in the shop by 1,000 per level.',
        maxLevel: 5,
        costPerLevel: 1000
    },
    starterPack: {
        name: 'Starter Pack',
        description: 'Buy this! Buy This! Cube gain is permanently multiplied by 5, and gain 6x the Obtainium and Offerings from all sources, post-corruption.',
        maxLevel: 1,
        costPerLevel: 10
    },
    wowPass: {
        name: 'Wow Pass Unlock',
        description: 'This upgrade will convince the seal merchant to sell you more Wow Passes, which even persist on Singularity!.',
        maxLevel: 1,
        costPerLevel: 500
    },
    cookies: {
        name: 'Cookie Recipes I',
        description: 'For just a few golden quarks, re-open Wow! Bakery, adding five cookie-related cube upgrades.',
        maxLevel: 1,
        costPerLevel: 100
    },
    cookies2: {
        name: 'Cookie Recipes II',
        description: 'Diversify Wow! Bakery into cooking slightly more exotic cookies, adding five more cookie-related cube upgrades..',
        maxLevel: 1,
        costPerLevel: 500
    },
    cookies3: {
        name: 'Cookie Recipes III',
        description: 'Your Bakers threaten to quit without a higher pay. If you do pay them, they will bake even more fancy cookies.',
        maxLevel: 1,
        costPerLevel: 24999
    },
    cookies4: {
        name: 'Cookie Recipes IV',
        description: 'This is a small price to pay for Salvation.',
        maxLevel: 1,
        costPerLevel: 199999
    },
    ascensions: {
        name: 'Improved Ascension Gain',
        description: 'Buying this, you will gain +2% Ascension Count forever, per level! Every 20 levels grants an additional, multiplicative +1% Ascension Count.',
        maxLevel: -1,
        costPerLevel: 5
    },
    corruptionFourteen: {
        name: 'Level Fourteen Corruptions',
        description: 'Buy this to unlock level fourteen corruptions :).',
        maxLevel: 1,
        costPerLevel: 1000
    },
    corruptionFifteen: {
        name: 'Level Fifteen Corruptions',
        description: 'This doesn\'t *really* raise the corruption limit. Rather, it adds one FREE level to corruption multipliers, no matter what (can exceed cap). :)',
        maxLevel: 1,
        costPerLevel: 40000
    },
    singOfferings1: {
        name: 'Offering Charge',
        description: 'Upgrade this to get +2% offerings per level, forever!',
        maxLevel: -1,
        costPerLevel: 1
    },
    singOfferings2: {
        name: 'Offering Storm',
        description: 'Apparently, you can use this bar to attract more offerings. +8% per level, to be precise.',
        maxLevel: 25,
        costPerLevel: 25
    },
    singOfferings3: {
        name: 'Offering Tempest',
        description: 'This bar is so prestine, it\'ll make anyone submit their offerings. +4% per level, to be precise.',
        maxLevel: 40,
        costPerLevel: 500
    },
    singObtainium1: {
        name: 'Obtainium Wave',
        description: 'Upgrade this to get +2% obtainium per level, forever!',
        maxLevel: -1,
        costPerLevel: 1
    },
    singObtainium2: {
        name: 'Obtainium Flood',
        description: 'Holy crap, water bending! +8% gained obtainium per level.',
        maxLevel: 25,
        costPerLevel: 25
    },
    singObtainium3: {
        name: 'Obtainium Tsunami',
        description: 'A rising tide lifts all boats. +4% gained obtainium per level.',
        maxLevel: 40,
        costPerLevel: 500
    },
    singCubes1: {
        name: 'Cube Flame',
        description: 'Upgrade this to get +2% Cubes per level, forever!',
        maxLevel: -1,
        costPerLevel: 1
    },
    singCubes2: {
        name: 'Cube Blaze',
        description: 'Burn some more Golden Quarks! +8% gained Cubes per level.',
        maxLevel: 25,
        costPerLevel: 25
    },
    singCubes3: {
        name: 'Cube Inferno',
        description: 'Even Dante is impressed. +4% gained Cubes per level.',
        maxLevel: 40,
        costPerLevel: 500
    },
    octeractUnlock: {
        name: 'Octeracts ;) (WIP)',
        description: 'Hey!!! What are you trying to do?!?',
        maxLevel: 1,
        costPerLevel: 8888,
        minimumSingularity: 10
    },
    offeringAutomatic: {
        name: 'Offering Lootzifer (WIP)',
        description: 'Black Magic. Don\'t make deals with the devil. Each second, you get +2% of offering gain automatically per level. Also +10% Offerings!',
        maxLevel: 50,
        costPerLevel: 2000,
        minimumSingularity: 6
    },
    intermediatePack: {
        name: 'Intermediate Pack',
        description: 'Double Global Speed, Multiply Ascension speed by 1.5, and gain +2% Quarks forever. Yum... 2% Quark Milk.',
        maxLevel: 1,
        costPerLevel: 1,
        minimumSingularity: 4
    },
    advancedPack: {
        name: 'Advanced Pack',
        description: 'Now we\'re cooking with kerosene! Gain +4% Quarks stack with intermediate, +0.33 to all corruption score multipliers, regardless of level!',
        maxLevel: 1,
        costPerLevel: 200,
        minimumSingularity: 9
    },
    expertPack: {
        name: 'Expert Pack',
        description: 'That\'s a handful! Gain +6% Quarks stack with advanced, 1.5x Ascension Score, Code \'add\' gives 1.2x Ascension Timer.',
        maxLevel: 1,
        costPerLevel: 800,
        minimumSingularity: 16
    },
    masterPack: {
        name: 'Master Pack',
        description: 'A tad insane. Gain +8% Quarks stack with expert, for every level 14 corruption, ascension score is multiplied by 1.1.',
        maxLevel: 1,
        costPerLevel: 3200,
        minimumSingularity: 25
    },
    divinePack: {
        name: 'Divine Pack',
        description: 'OHHHHH. Gain +10% Quarks stack with master, and multiply Octeract gain by 7.77 if corruptions are all set to 14. Also unlock Platonic Upgrade autobuyers!',
        maxLevel: 1,
        costPerLevel: 12800,
        minimumSingularity: 36
    },
    wowPass2: {
        name: 'Shop Liquidation Sale',
        description: 'The Seal Merchant needs to get rid of some exotic goods. Only for a steep price. I do not think that is how sales work.',
        maxLevel: 1,
        costPerLevel: 49999,
        minimumSingularity: 11
    }
}

export const getGoldenQuarkCost = (): {
    cost: number
    costReduction: number
} => {
    const baseCost = 100000

    let costReduction = 0
    costReduction += 2 * Math.min(player.achievementPoints, 5000)
    costReduction += 1 * Math.max(0, player.achievementPoints - 5000)
    costReduction += player.cubeUpgrades[60]
    costReduction += 500 * player.singularityUpgrades.goldenQuarks1.level
    costReduction += 200 * player.singularityUpgrades.goldenQuarks2.level
    costReduction += 1000 * player.singularityUpgrades.goldenQuarks3.level


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
    const buyPrompt = await Prompt(`You can buy golden quarks here for ${format(goldenQuarkCost.cost)} Quarks (Discounted by ${format(goldenQuarkCost.costReduction)})! You can buy up to ${format(maxBuy)}. How many do you want? Type -1 to buy max!`)
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
        return Alert('Sorry, I cannnot sell you this many golden quarks! Try buying fewer of them or typing -1 to buy max!')
    } else if (Math.floor(buyAmount) !== buyAmount) {
        // non integer
        return Alert('Sorry. I only sell whole Golden Quarks. None of that fractional transaction!')
    }

    if (buyAmount === -1) {
        const cost = maxBuy * goldenQuarkCost.cost
        player.worlds.sub(cost)
        player.goldenQuarks += maxBuy
        return Alert(`Transaction of ${format(maxBuy)} golden quarks successful! [-${format(cost,0,true)} Quarks]`)
    } else {
        const cost = buyAmount * goldenQuarkCost.cost
        player.worlds.sub(cost)
        player.goldenQuarks += buyAmount
        return Alert(`Transaction of ${format(buyAmount)} golden quarks successful! [-${format(cost, 0, true)} Quarks]`)
    }
}

export type SingularityDebuffs = 'Offering' | 'Obtainium' | 'Global Speed' | 'Researches' | 'Ascension Speed' | 'Cubes' | 'Cube Upgrades'

export const calculateSingularityDebuff = (debuff: SingularityDebuffs) => {
    if (player.singularityCount === 0) {
        return 1
    }
    if (player.runelevels[6] > 0) {
        return 1
    }

    let effectiveSingularities = player.singularityCount;
    effectiveSingularities *= Math.min(4.75, 0.75 * player.singularityCount / 10 + 1)
    if (player.singularityCount > 10) {
        effectiveSingularities *= 1.5
        effectiveSingularities *= Math.min(4, 1.25 * player.singularityCount / 10 - 0.25)
    }
    if (player.singularityCount > 25) {
        effectiveSingularities *= 2.5
        effectiveSingularities *= Math.min(6, 1.5 * player.singularityCount / 25 - 0.5)
    }
    if (player.singularityCount > 50) {
        effectiveSingularities *= 6
        effectiveSingularities *= Math.min(8, 2 * player.singularityCount / 50 - 1)
    }
    if (player.singularityCount > 100) {
        effectiveSingularities *= player.singularityCount / 25
    }
    if (player.singularityCount > 250) {
        effectiveSingularities *= player.singularityCount / 62.5
    }

    if (debuff === 'Offering') {
        return Math.sqrt(effectiveSingularities + 1)
    } else if (debuff === 'Global Speed') {
        return 1 + Math.sqrt(effectiveSingularities) / 4
    } else if (debuff === 'Obtainium') {
        return Math.sqrt(effectiveSingularities + 1)
    } else if (debuff === 'Researches') {
        return 1 + Math.sqrt(effectiveSingularities) / 2
    } else if (debuff === 'Ascension Speed') {
        return 1 + Math.sqrt(effectiveSingularities) / 5
    } else if (debuff === 'Cubes') {
        return 1 + Math.sqrt(effectiveSingularities) / 4
    } else {
        // Cube upgrades
        return Math.cbrt(effectiveSingularities + 1)
    }
}