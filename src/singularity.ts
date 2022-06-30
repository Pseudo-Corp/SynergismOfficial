import { DOMCacheGetOrSet } from './Cache/DOM'
import { format, player } from './Synergism'
import type { Player } from './types/Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { toOrdinal } from './Utility'

export const updateSingularityPenalties = (): void => {
    const color = player.runelevels[6] > 0 ? 'green' : 'red';
    const str = getSingularityOridnalText(player.singularityCount) +
                `<br>Global Speed is divided by ${format(calculateSingularityDebuff('Global Speed'), 2, true)}.
                 Ascension Speed is divided by ${format(calculateSingularityDebuff('Ascension Speed'), 2, true)}
                 Offering Gain is divided by ${format(calculateSingularityDebuff('Offering'), 2, true)}
                 Obtainium Gain is divided by ${format(calculateSingularityDebuff('Obtainium'), 2, true)}
                 Cube Gain is divided by ${format(calculateSingularityDebuff('Cubes'), 2, true)}.
                 Research Costs are multiplied by ${format(calculateSingularityDebuff('Researches'), 2, true)}.
                 Cube Upgrade Costs (Excluding Cookies) are multiplied by ${format(calculateSingularityDebuff('Cube Upgrades'), 2, true)}.
                 <br><span style='color: ${color}'>Antiquities of Ant God is ${(player.runelevels[6] > 0) ? '' : 'NOT'} purchased. Penalties are ${(player.runelevels[6] > 0) ? '' : 'NOT'} dispelled!</span>`

    DOMCacheGetOrSet('singularityPenaltiesMultiline').innerHTML = str;
}

function getSingularityOridnalText(singularityCount: number): string {
    return 'You are in the <span style="color: gold">' + toOrdinal(singularityCount) + ' singularity</span>';
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
    effect? (n: number): {bonus: number | boolean, desc: string}
    freeLevels?: number
}

/**
 * Singularity Upgrades are bought in the Shop of the singularity tab, and all have their own
 * name, description, level and maxlevel, plus a feature to toggle buy on each.
 */
export class SingularityUpgrade {

    // Field Initialization
    private readonly name: string;
    private readonly description: string;
    public level = 0;
    public freeLevels = 0;
    private readonly maxLevel: number; //-1 = infinitely levelable
    private readonly costPerLevel: number;
    public toggleBuy = 1; //-1 = buy MAX (or 1000 in case of infinity levels!)
    public goldenQuarksInvested = 0;
    public minimumSingularity: number;
    private readonly effect: (n: number) => {bonus: number | boolean, desc: string}

    public constructor(data: ISingularityData) {
        this.name = data.name;
        this.description = data.description;
        this.level = data.level ?? this.level;
        this.maxLevel = data.maxLevel;
        this.costPerLevel = data.costPerLevel;
        this.toggleBuy = data.toggleBuy ?? 1;
        this.goldenQuarksInvested = data.goldenQuarksInvested ?? 0;
        this.minimumSingularity = data.minimumSingularity ?? 0;
        this.freeLevels = data.freeLevels ?? 0;
        this.effect = data.effect ?? function (n:number) {
            return {bonus: n, desc: 'WIP not implemented'}
        }
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
        const color = this.maxLevel === this.level ? 'plum' : 'white';
        const minReqColor = player.singularityCount < this.minimumSingularity ? 'crimson' : 'green';
        const minimumSingularity = this.minimumSingularity > 0
            ? `Minimum Singularity: ${this.minimumSingularity}`
            : 'No minimal Singularity to purchase required'

        const freeLevelInfo = this.freeLevels > 0 ?
            `<span style="color: orange"> [+${format(this.freeLevels, 1, true)}]</span>` : ''

        return `<span style="color: gold">${this.name}</span>
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${minReqColor}">${minimumSingularity}</span>
                <span style="color: ${color}"> Level ${this.level}${maxLevel}${freeLevelInfo}</span>
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
    private getCostTNL(): number {
        let costMultiplier = (this.maxLevel === -1 && this.level >= 100) ? this.level / 50 : 1;
        costMultiplier *= (this.maxLevel === -1 && this.level >= 400) ? this.level / 100 : 1;
        return (this.maxLevel === this.level) ? 0: Math.ceil(this.costPerLevel * (1 + this.level) * costMultiplier);
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
        updateSingularityPenalties();
        updateSingularityPerks();
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

    public getEffect(): {bonus: number | boolean, desc: string} {
        return this.effect(this.level + this.freeLevels)
    }
}

export const singularityData: Record<keyof Player['singularityUpgrades'], ISingularityData> = {
    goldenQuarks1: {
        name: 'Golden Quarks I',
        description: 'In the future, you will gain 5% more Golden Quarks on Singularities! This also reduces the cost to buy Golden Quarks in the shop by 500 per level.',
        maxLevel: 10,
        costPerLevel: 12,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.05 * n,
                desc: `Permanently gain ${format(5 * n, 0, true)}% more Golden Quarks on Singularities.`
            }
        }
    },
    goldenQuarks2: {
        name: 'Golden Quarks II',
        description: 'If you buy this, you will gain 2% more Golden Quarks on Singularities. This also reduces the cost to buy Golden Quarks in the shop by 200 per level. Stacks with the first upgrade.',
        maxLevel: 25,
        costPerLevel: 60,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.02 * n,
                desc: `Permanently gain ${format(2 * n, 0, true)}% more Golden Quarks on Singularities.`
            }
        }
    },
    goldenQuarks3: {
        name: 'Golden Quarks III',
        description: 'If you buy this, you will gain 1 Golden Quark per hour from Exports. Also reduces the cost to buy Golden Quarks in the shop by 1,000 per level.',
        maxLevel: 15,
        costPerLevel: 1000,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `Every hour, you gain ${format(n)} Golden Quarks from exporting.`
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
        costPerLevel: 500,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} unlocked the Shop Bonanza.`
            }
        }
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
        }
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
        }
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
        }
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
        }
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
        effect: (n: number) => {
            return {
                bonus: 1 + 0.04 * n,
                desc: `Permanently gain ${format(4 * n, 0, true)}% more Cubes.`
            }
        }
    },
    octeractUnlock: {
        name: 'Octeracts ;) (WIP)',
        description: 'Hey!!! What are you trying to do?!?',
        maxLevel: 1,
        costPerLevel: 44444,
        minimumSingularity: 36,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} bought into the Octeract hype.`
            }
        }
    },
    offeringAutomatic: {
        name: 'Offering Lootzifer (WIP)',
        description: 'Black Magic. Don\'t make deals with the devil. Each second, you get +2% of Offering gain automatically per level. Also +10% Offerings!',
        maxLevel: 50,
        costPerLevel: 2000,
        minimumSingularity: 6,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} made a deal with the devil Lootzifer.`
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
                desc: `You ${(n > 0) ? 'have': 'have not'} found the reason for existence ${(n > 0) ? '' : ' just yet'}.`
            }
        }
    },
    wowPass2: {
        name: 'Shop Liquidation Sale',
        description: 'The Seal Merchant needs to get rid of some exotic goods. Only for a steep price. I do not think that is how sales work.',
        maxLevel: 1,
        costPerLevel: 49999,
        minimumSingularity: 11,
        effect: (n: number) => {
            return {
                bonus: (n > 0),
                desc: `You ${(n > 0) ? 'have': 'have not'} triggered the Liquidation event!`
            }
        }
    },
    potionBuff: {
        name: 'Potion Decanter of Enlightenment',
        description: 'Purported to actually be the fountain of youth, this item powers up potions considerably!',
        maxLevel: 10,
        costPerLevel: 999,
        minimumSingularity: 4,
        effect: (n: number) => {
            return {
                bonus: Math.max(1, 10 * Math.pow(n, 2)),
                desc: `Potions currently give ${Math.max(1, 10 * Math.pow(n, 2))}x items!`
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
    singQuarkHepteract: {
        name: 'I wish my Quark Hepteract was marginally better.',
        description: 'Wrong game, oops. Anyway, would you like a very slightly better DR exponent on Quark Hepteract?',
        maxLevel: 1,
        costPerLevel: 14999,
        minimumSingularity: 5,
        effect: (n: number) => {
            return {
                bonus: n/100,
                desc: `The DR exponent is now ${format(n/100, 2, true)} larger!`
            }
        }
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
                desc: `The DR exponent is now ${format(n/100, 2, true)} larger!`
            }
        }
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
                desc: `The DR exponent is now ${format(n/100, 2, true)} larger!`
            }
        }
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

// List of Singularity Perks based on player.singularityCount
// The list is ordered on first level acquisition, so be careful when inserting a new one ;)
export const singularityPerks: SingularityPerk[] = [
    {
        name: 'XYZ: Xtra dailY rewardZ',
        levels: [1],
        description: () => {
            return 'Daily Special Action now rewards you with Golden Quarks and free levels for random Singularity upgrades'
        }
    },
    {
        name: 'Unlimited growth',
        levels: [1],
        description: (n: number) => {
            return `+10% to Quarks gain and Ascension Count for each Singularity (currently +${format(10*n)}%)`
        }
    },
    {
        name: 'Super Start',
        levels: [2, 3, 4, 7],
        description: (n: number, levels: number[]) => {
            if (n >= levels[3]) {
                return 'You start each Ascension with 1 Transcension, 1 Reincarnation, 1001 Mythos, 1e100 Particles and 500 Obtainium'
            } else if (n >= levels[2]) {
                return 'You start each Ascension with 1 Transcension, 1 Reincarnation, 1001 Mythos, 10 Particles and 500 Obtainium'
            } else if (n >= levels[1]) {
                return 'You start each Ascension with 1 Transcension, 1 Reincarnation, 1001 Mythos and 10 Particles'
            } else {
                return 'You start each Ascension with 1 Transcension and 1001 Mythos'
            }
        }
    },
    {
        name: 'Not so challenging',
        levels: [4, 7, 10, 15, 20],
        description: (n: number, levels: number[]) => {
            if (n >= levels[4]) {
                return 'You start each Ascension with 5 completion of Challenge 8 and 1 completion of Challenges 6, 7 and 9'
            } else if (n >= levels[3]) {
                return 'You start each Ascension with 5 completion of Challenge 8 and 1 completion of Challenges 6 and 7'
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
        name: 'Shop Special Offer',
        levels: [5, 20],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'You always keep 100 free levels of each Shop upgrade in the first row'
            } else {
                return 'You start each Singularity with 10 free levels of each Shop upgrade in the first row'
            }
        }
    },
    {
        name: 'A particular improvement',
        levels: [5],
        description: () => {
            return 'You start each Ascension with Autobuyers for Particle buildings'
        }
    },
    {
        name: 'Even more Quarks',
        levels: [5, 20],
        description: (n: number, levels: number[]) => {
            if (n >= levels[1]) {
                return 'You get another +5% multiplicative Quark bonus, and then ANOTHER one on top of it!'
            } else {
                return 'You get another +5% multiplicative Quark bonus!'
            }
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
                return 'You always keep Ant autobuyers and start each Ascension with a Tier 8 Ant'
            } else if (n >= levels[1]) {
                return 'You always keep Ant autobuyers and start each Ascension with a Tier 5 Ant'
            } else {
                return 'You always keep Ant autobuyers and start each Ascension with a Tier 1 Ant'
            }
        }
    },
    {
        name: 'Research for Dummies',
        levels: [11],
        description: () => {
            return 'You always keep Auto Research.'
        }
    },
    {
        name: 'Blessed by the Spirits',
        levels: [15],
        description: () => {
            return 'Runes autobuyer will also buy Blessings and Spirits'
        }
    },
    {
        name: 'Infinite Auto Ascent',
        levels: [30],
        description: () => {
            return 'Runes autobuyer will also level up Infinite Ascent.'
        }
    }
]

export const updateSingularityPerks = (): void => {
    const singularityCount = player.singularityCount;
    const str = getSingularityOridnalText(singularityCount) +
                `<br/><br/>Here is the list of Perks you have acquired to compensate the Penalties
                (Hover for more details. Perks in <span class="newPerk">gold text</span> were added or improved in this singularity)<br/>`
                + getAvailablePerksDescription(singularityCount)

    DOMCacheGetOrSet('singularityPerksMultiline').innerHTML = str;
}

export interface ISingularityPerkDisplayInfo {
    name: string
    description: string
    currentLevel: number
    lastUpgraded: number
    acquired: number
}

/*
* Indicate current level of the Perk and when it was reached
*/
const getLastUpgradeInfo = (perk: SingularityPerk, singularityCount: number): {level: number, singularity: number} => {
    for (let i=perk.levels.length - 1; i >= 0; i--) {
        if (singularityCount >= perk.levels[i]) {
            return { level: i + 1, singularity: perk.levels[i] } ;
        }
    }

    return { level: 0, singularity: perk.levels[0] };
}

const getAvailablePerksDescription = (singularityCount: number): string => {
    let perksText = '';
    let availablePerks: ISingularityPerkDisplayInfo[] = [];
    let singularityCountForNextPerk: number | null = null;
    for (const perk of singularityPerks) {
        const upgradeInfo = getLastUpgradeInfo(perk, singularityCount);
        if (upgradeInfo.level > 0) {
            availablePerks.push({
                name: perk.name,
                description: perk.description(singularityCount, perk.levels),
                currentLevel: upgradeInfo.level,
                lastUpgraded: upgradeInfo.singularity,
                acquired: perk.levels[0]
            });
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
    if (singularityCountForNextPerk) {
        perksText += '<br/><br/>You will unlock a whole new Perk in singularity ' + singularityCountForNextPerk;
    }
    return perksText;
}

function formatPerkDescription(perkData: ISingularityPerkDisplayInfo, singularityCount: number): string {
    const isNew = perkData.lastUpgraded === singularityCount;
    const levelInfo = perkData.currentLevel > 1 ? ' - Level '+ perkData.currentLevel : '';
    //const acquiredUpgraded = ' / Acq ' + perkData.acquired + ' / Upg ' + perkData.lastUpgraded;
    return `<span${isNew?' class="newPerk"':''} title="${perkData.description}">${perkData.name}${levelInfo}</span>`;
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
    const buyPrompt = await Prompt(`You can buy Golden Quarks here for ${format(goldenQuarkCost.cost)} Quarks (Discounted by ${format(goldenQuarkCost.costReduction)})! You can buy up to ${format(maxBuy)}. How many do you want? Type -1 to buy max!`)
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
        return Alert(`Transaction of ${format(maxBuy)} Golden Quarks successful! [-${format(cost,0,true)} Quarks]`)
    } else {
        const cost = buyAmount * goldenQuarkCost.cost
        player.worlds.sub(cost)
        player.goldenQuarks += buyAmount
        return Alert(`Transaction of ${format(buyAmount)} Golden Quarks successful! [-${format(cost, 0, true)} Quarks]`)
    }
}

export type SingularityDebuffs = 'Offering' | 'Obtainium' | 'Global Speed' | 'Researches' | 'Ascension Speed' | 'Cubes' | 'Cube Upgrades'

export const calculateSingularityDebuff = (debuff: SingularityDebuffs, singularityCount: number=player.singularityCount) => {
    if (singularityCount === 0) {
        return 1
    }
    if (player.runelevels[6] > 0) {
        return 1
    }

    let effectiveSingularities = singularityCount;
    effectiveSingularities *= Math.min(4.75, 0.75 * singularityCount / 10 + 1)
    if (singularityCount > 10) {
        effectiveSingularities *= 1.5
        effectiveSingularities *= Math.min(4, 1.25 * singularityCount / 10 - 0.25)
    }
    if (singularityCount > 25) {
        effectiveSingularities *= 2.5
        effectiveSingularities *= Math.min(6, 1.5 * singularityCount / 25 - 0.5)
    }
    if (singularityCount > 50) {
        effectiveSingularities *= 6
        effectiveSingularities *= Math.min(8, 2 * singularityCount / 50 - 1)
    }
    if (singularityCount > 100) {
        effectiveSingularities *= singularityCount / 25
    }
    if (singularityCount > 250) {
        effectiveSingularities *= singularityCount / 62.5
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
