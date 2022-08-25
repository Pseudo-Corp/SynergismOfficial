import { format, player } from './Synergism';
import { Alert, Prompt } from './UpdateHTML';
import type { IUpgradeData } from './DynamicUpgrade';
import { DynamicUpgrade } from './DynamicUpgrade';
import type { Player } from './types/Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

export interface IOcteractData extends IUpgradeData {
    costFormula (level: number, baseCost: number): number
    octeractsInvested?: number
}

export class OcteractUpgrade extends DynamicUpgrade {
    readonly costFormula: (level: number, baseCost: number) => number
    public octeractsInvested = 0

    constructor(data: IOcteractData) {
        super(data);
        this.costFormula = data.costFormula;
        this.octeractsInvested = data.octeractsInvested ?? 0;
    }

    getCostTNL(): number {

        if (this.level === this.maxLevel) {
            return 0
        }

        return this.costFormula(this.level, this.costPerLevel)
    }

    /**
     * Buy levels up until togglebuy or maxxed.
     * @returns An alert indicating cannot afford, already maxxed or purchased with how many
     *          levels purchased
     */
    public async buyLevel(event: MouseEvent): Promise<void> {
        let purchased = 0;
        let maxPurchasable = 1;
        let OCTBudget = player.wowOcteracts;

        if (event.shiftKey) {
            maxPurchasable = 100000
            const buy = Number(await Prompt(`How many Octeracts would you like to spend? You have ${format(player.wowOcteracts, 0, true)} OCT. Type -1 to use max!`))

            if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) { // nan + Infinity checks
                return Alert('Value must be a finite number!');
            }

            if (buy === -1) {
                OCTBudget = player.wowOcteracts
            } else if (buy <= 0) {
                return Alert('Purchase cancelled!')
            } else {
                OCTBudget = buy
            }
            OCTBudget = Math.min(player.wowOcteracts, OCTBudget)
        }

        if (this.maxLevel > 0) {
            maxPurchasable = Math.min(maxPurchasable, this.maxLevel - this.level)
        }

        if (maxPurchasable === 0) {
            return Alert('hey! You have already maxxed this upgrade. :D')
        }

        while (maxPurchasable > 0) {
            const cost = this.getCostTNL();
            if (player.wowOcteracts < cost || OCTBudget < cost) {
                break;
            } else {
                player.wowOcteracts -= cost;
                OCTBudget -= cost;
                this.octeractsInvested += cost
                this.level += 1;
                purchased += 1;
                maxPurchasable -= 1;
            }
        }

        if (purchased === 0) {
            return Alert('You cannot afford this upgrade. Sorry!')
        }
        if (purchased > 1) {
            return Alert(`Purchased ${format(purchased)} levels, thanks to Multi Buy!`)
        }

        this.updateUpgradeHTML();
    }

    /**
     * Given an upgrade, give a concise information regarding its data.
     * @returns A string that details the name, description, level statistic, and next level cost.
     */
    toString(): string {
        const costNextLevel = this.getCostTNL();
        const maxLevel = this.maxLevel === -1
            ? ''
            : `/${format(this.maxLevel, 0 , true)}`;
        const color = this.maxLevel === this.level ? 'plum' : 'white';

        let freeLevelInfo = this.freeLevels > 0 ?
            `<span style="color: orange"> [+${format(this.freeLevels, 1, true)}]</span>` : ''

        if (this.freeLevels > this.level) {
            freeLevelInfo = freeLevelInfo + '<span style="color: maroon"> (Softcapped) </span>'
        }

        return `<span style="color: gold">${this.name}</span>
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${color}"> Level ${format(this.level, 0 , true)}${maxLevel}${freeLevelInfo}</span>
                <span style="color: gold">${this.getEffect().desc}</span>
                Cost for next level: ${format(costNextLevel,2,true, true, true)} Octeracts.
                Spent Octeracts: ${format(this.octeractsInvested, 2, true, true, true)}`
    }

    public updateUpgradeHTML(): void {
        DOMCacheGetOrSet('singularityOcteractsMultiline').innerHTML = this.toString()
        DOMCacheGetOrSet('singOcts').textContent = format(player.wowOcteracts, 2, true, true, true)
    }

    public computeFreeLevelSoftcap(): number {
        return Math.min(this.level, this.freeLevels) + Math.sqrt(Math.max(0, this.freeLevels - this.level))
    }

    public actualTotalLevels(): number {
        const actualFreeLevels = this.computeFreeLevelSoftcap();
        const linearLevels = this.level + actualFreeLevels
        return linearLevels // There is currently no 'improvement' to oct free upgrades.
    }

    public getEffect(): { bonus: number | boolean, desc: string } {
        return this.effect(this.actualTotalLevels())
    }

}

export const octeractData: Record<keyof Player['octeractUpgrades'], IOcteractData> = {
    octeractStarter: {
        name: 'Octeracts for Dummies',
        description: 'Hello... I Am Derpsmith... The Ancestor Of Ant God... I Did Not Expect You To Get Here. Here Is 25% More Quarks, 20% More Octeracts, And 100,000x Ant Speed...',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * (level + 1)
        },
        maxLevel: 1,
        costPerLevel: 1e-15,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `You have ${(n > 0) ? '' : 'not'} paid your respects to Derpsmith.`
            }
        }
    },
    octeractGain: {
        name: 'Octeract Cogenesis',
        description: 'Have you despised how slow these damn things are? Gain 1% more of them per level! Simple.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * (Math.pow(level + 1, 6) - Math.pow(level, 6))
        },
        maxLevel: -1,
        costPerLevel: 1e-8,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Octeract Gain is increased by ${format(n, 0 , true)}%.`
            }
        }
    },
    octeractQuarkGain: {
        name: 'Quark Octeract',
        description: 'An altered forme of the hepteract, this gives a 1% Quark Bonus per level without Diminishing Return.',
        costFormula: (level: number, baseCost: number) => {
            if (level < 1000) {
                return baseCost * (Math.pow(level + 1, 7) - Math.pow(level, 7))
            } else {
                return baseCost * (Math.pow(1001, 7) - Math.pow(1000, 7)) * Math.pow(10, level / 1000)
            }
        },
        maxLevel: 9900,
        costPerLevel: 1e-7,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Quark gain is increased by ${format(n, 0 , true)}%.`
            }
        }
    },
    octeractCorruption: {
        name: 'EXTRA CHONKY Corruptions',
        description: 'Adds one level to the cap on corruptions. Derpsmith approves.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(10, level * 10)
        },
        maxLevel: 2,
        costPerLevel: 10,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `Corruption level cap is increased by ${n}.`
            }
        }
    },
    octeractGQCostReduce: {
        name: 'EXTRA WIMPY Golden Quark Costs!',
        description: 'Reduces the cost of Golden Quarks in the shop by 1% per level.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(2, level)
        },
        maxLevel: 50,
        costPerLevel: 1e-9,
        effect: (n: number) => {
            return {
                bonus: 1 - n/100,
                desc: `Golden Quarks are ${n}% cheaper!`
            }
        }
    },
    octeractExportQuarks: {
        name: 'Improved Download Speeds',
        description: 'Thanks to ethernet technology, export quarks are increased by 40% per level! Only normal ones.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(level + 1, 3)
        },
        maxLevel: 100,
        costPerLevel: 1,
        effect: (n: number) => {
            return {
                bonus: 4 * n/10 + 1,
                desc: `Export quarks +${format(40 * n, 0 , true)}%`
            }
        }
    },
    octeractImprovedDaily: {
        name: 'CHONKER Daily Code',
        description: 'Derpsmith hacks into the source code, and adds +1 free Singularity upgrade per day from Daily.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(1.6, level)
        },
        maxLevel: 50,
        costPerLevel: 1e-3,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `Code 'daily' gives +${n} free Singularity upgrades per use.`
            }
        }
    },
    octeractImprovedDaily2: {
        name: 'CHONKERER Daily Code',
        description: 'Derpsmith implemented hyperspeed multiplication. +1% more free Singularity upgrades per day from Daily!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(2, level)
        },
        maxLevel: 50,
        costPerLevel: 1e-2,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Code 'daily' gives +${n}% more free Singularity upgrades per use.`
            }
        }
    },
    octeractImprovedQuarkHept: {
        name: 'I wish for even better Quark Hepteracts.',
        description: 'The godmother is absent, but Derpsmith is here! +2% DR exponent per level. Stacks additively with all the others!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(1e6, level)
        },
        maxLevel: 3,
        costPerLevel: 1/10,
        effect: (n: number) => {
            return {
                bonus: n / 100,
                desc: `Quark Hepteract DR +${format(n/100, 2, true)}.`
            }
        }
    },
    octeractImprovedGlobalSpeed: {
        name: 'The forbidden clock of time',
        description: 'Hypothesized to be locked in a hyperbolic time chamber. +1% Global Speed per level per singularity!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(level + 1, 3)
        },
        maxLevel: 1000,
        costPerLevel: 1e-5,
        effect: (n: number) => {
            return {
                bonus: n/100,
                desc: `Global Speed per singularity +${format(n,0,true)}%`
            }
        }
    },
    octeractImprovedAscensionSpeed: {
        name: 'Abstract Photokinetics',
        description: 'Gain +0.05% Ascension Speed per level per singularity!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(1e9, level / 100)
        },
        maxLevel: 100,
        costPerLevel: 100,
        effect: (n: number) => {
            return {
                bonus: n / 2000,
                desc: `Ascension Speed per singularity +${format(n/20, 2, true)}%`
            }
        }
    },
    octeractImprovedAscensionSpeed2: {
        name: 'Abstract Exokinetics',
        description: 'Gain +0.02% Ascension Speed per level per singularity!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(1e12, level / 250)
        },
        maxLevel: 250,
        costPerLevel: 1e5,
        effect: (n: number) => {
            return {
                bonus: n / 2000,
                desc: `Ascension Speed per singularity +${format(n/50, 2, true)}%`
            }
        }
    },
    octeractImprovedFree: {
        name: 'Wow! I want free upgrades to be better.',
        description: 'Singularity Upgrade level is (paid level * free levels)^0.6 instead of being added.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(level + 1, 3)
        },
        maxLevel: 1,
        costPerLevel: 100,
        effect: (n: number) => {
            return {
                bonus: n > 0,
                desc: `Singularity Upgrade free levels are ${(n > 0) ? '' : 'NOT'} being powered!`
            }
        }
    },
    octeractImprovedFree2: {
        name: 'Wow! Free upgrades still suck.',
        description: 'Who said beggars can\'t be choosers? Extends the exponent of the first upgrade to 0.65.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(level + 1, 3)
        },
        maxLevel: 1,
        costPerLevel: 1e7,
        effect: (n: number) => {
            return {
                bonus: 0.05 * n,
                desc: `Exponent of previous upgrade +${format(n / 20, 2, true)}.`
            }
        }
    },
    octeractImprovedFree3: {
        name: 'Wow! Make free upgrades good already, Platonic!',
        description: 'Extends the exponent of the free upgrades to 0.70.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(level + 1, 3)
        },
        maxLevel: 1,
        costPerLevel: 1e17,
        effect: (n: number) => {
            return {
                bonus: 0.05 * n,
                desc: `Exponent of the first upgrade +${format(n/20, 2, true)}`
            }
        }
    },
    octeractOfferings1: {
        name: 'Offering Electrolosis',
        description: 'Gain 1% more offerings per level.',
        costFormula: (level: number, baseCost: number) => {
            if (level < 25) {
                return baseCost * Math.pow(level + 1, 5)
            } else {
                return baseCost * 1e15 * Math.pow(10, level / 25 - 1)
            }
        },
        maxLevel: -1,
        costPerLevel: 1e-15,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Offering gain +${format(n)}%`
            }
        }
    },
    octeractObtainium1: {
        name: 'Obtainium Deluge',
        description: 'Gain 1% more obtainium per level.',
        costFormula: (level: number, baseCost: number) => {
            if (level < 25) {
                return baseCost * Math.pow(level + 1, 5)
            } else {
                return baseCost * 1e15 * Math.pow(10, level / 25 - 1)
            }
        },
        maxLevel: -1,
        costPerLevel: 1e-15,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Obtainium gain +${format(n)}%`
            }
        }
    },
    octeractAscensions: {
        name: 'Voided Warranty',
        description: 'Gain +1% Ascension Count per level, with a 2% bonus for every 10 levels.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(level + 1, 3)
        },
        maxLevel: -1,
        costPerLevel: 1,
        effect: (n: number) => {
            return {
                bonus: (1 + n / 100) * (1 + 2 * Math.floor(n / 10) / 100),
                desc: `Ascension Count increases ${format((100 + n) * (1 + 2 * Math.floor(n/10) / 100) - 100, 1, true)}% faster.`
            }
        }
    },
    octeractAscensionsOcteractGain: {
        name: 'Digital Octeract Accumulator',
        description: 'Octeract gain is 1% faster for every digit in your Ascension count!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(40, level)
        },
        maxLevel: 5,
        costPerLevel: 1000,
        effect: (n: number) => {
            return {
                bonus: n / 100,
                desc: `Octeract Gain per OOM Ascension count +${n}%`
            }
        }
    },
    octeractFastForward: {
        name: 'Derpsmith\'s Singularity Discombobulator',
        description: 'Each level makes Singularity give +100% Golden Quarks (additive) and singularity at all time highest count grants +1 singularity count!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(1e8, level)
        },
        maxLevel: 2,
        costPerLevel: 1e8,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `Singularities give ${100 * n}% more GQ and count as ${n} more.`
            }
        }
    }
}

