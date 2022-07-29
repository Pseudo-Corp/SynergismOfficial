import { format, player } from './Synergism';
import { Alert } from './UpdateHTML';
import type { IUpgradeData } from './DynamicUpgrade';
import { DynamicUpgrade } from './DynamicUpgrade';
import { calculateAscensionAcceleration, calculateAscensionScore } from './Calculate';
import { productContents, sumContents } from './Utility';
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

        while (maxPurchasable > 0) {
            const cost = this.getCostTNL();
            if (player.wowOcteracts < cost) {
                break;
            } else {
                player.wowOcteracts -= cost;
                this.octeractsInvested += cost
                this.level += 1;
                purchased += 1;
                maxPurchasable -= 1;
            }
        }

        if (purchased === 0) {
            return Alert('You cannot afford this upgrade. Sorry!')
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
            : `/${this.maxLevel}`;
        const color = this.maxLevel === this.level ? 'plum' : 'white';

        let freeLevelInfo = this.freeLevels > 0 ?
            `<span style="color: orange"> [+${format(this.freeLevels, 1, true)}]</span>` : ''

        if (this.freeLevels > this.level) {
            freeLevelInfo = freeLevelInfo + '<span style="color: maroon"> (Softcapped) </span>'
        }

        return `<span style="color: gold">${this.name}</span>
                <span style="color: lightblue">${this.description}</span>
                <span style="color: ${color}"> Level ${this.level}${maxLevel}${freeLevelInfo}</span>
                <span style="color: gold">${this.getEffect().desc}</span>
                Cost for next level: ${format(costNextLevel,2,true, true, true)} Octeracts.
                Spent Octeracts: ${format(this.octeractsInvested, 2, true, true, true)}`
    }

    public updateUpgradeHTML(): void {
        DOMCacheGetOrSet('singularityOcteractsMultiline').innerHTML = this.toString()
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
                desc: `Octeract Gain is increased by ${n}%.`
            }
        }
    },
    octeractQuarkGain: {
        name: 'Quark Octeract',
        description: 'An altered forme of the hepteract, this gives a 1% Quark Bonus per level without Diminishing Return.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * (Math.pow(level + 1, 7) - Math.pow(level, 7))
        },
        maxLevel: -1,
        costPerLevel: 1e-7,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.01 * n,
                desc: `Quark gain is increased by ${n}%.`
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
                bonus: n/100,
                desc: `Golden Quarks are ${n}% cheaper!`
            }
        }
    },
    octeractExportQuarks: {
        name: 'Improved Download Speeds',
        description: 'Thanks to ethernet technology, export quarks are increased by 100% per level! Only normal ones.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(level + 1, 3)
        },
        maxLevel: 99,
        costPerLevel: 1,
        effect: (n: number) => {
            return {
                bonus: n + 1,
                desc: `Export quarks +${format(100 * n, 0 , true)}%`
            }
        }
    },
    octeractImprovedDaily: {
        name: 'CHONKER Daily Code',
        description: 'Derpsmith hacks into the source code, and adds +1 free GQ upgrade per day from Daily.',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(1.6, level)
        },
        maxLevel: 50,
        costPerLevel: 1e-3,
        effect: (n: number) => {
            return {
                bonus: n,
                desc: `Code 'daily' gives +${n} GQ upgrades per use.`
            }
        }
    },
    octeractImprovedDaily2: {
        name: 'CHONKERER Daily Code',
        description: 'Derpsmith implemented hyperspeed multiplication. +2% more GQ upgrades per day from Daily!',
        costFormula: (level: number, baseCost: number) => {
            return baseCost * Math.pow(2, level)
        },
        maxLevel: 50,
        costPerLevel: 1e-2,
        effect: (n: number) => {
            return {
                bonus: 1 + 0.02 * n,
                desc: `Code 'daily' gives +${2 * n}% more GQ upgrades per use.`
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
    }


}

export const derpsmithCornucopiaBonus = () => {
    let counter = 0
    const singCounts = [18, 38, 58, 78, 88, 98, 118, 148]
    for (const sing of singCounts) {
        if (player.singularityCount >= sing) {
            counter += 1
        }
    }

    return 1 + counter * player.singularityCount / 100
}

export const octeractGainPerSecond = () => {
    const SCOREREQ = 1e23
    const currentScore = calculateAscensionScore().effectiveScore

    const baseMultiplier = (currentScore >= SCOREREQ) ? currentScore / SCOREREQ : 0;
    const corruptionLevelSum = sumContents(player.usedCorruptions.slice(2, 10))

    const valueMultipliers = [
        1 + player.shopUpgrades.seasonPass3 / 100,
        1 + player.shopUpgrades.seasonPassY / 200,
        1 + player.shopUpgrades.seasonPassZ * player.singularityCount / 100,
        1 + player.shopUpgrades.seasonPassLost / 1000,
        1 + +(corruptionLevelSum >= 14 * 8) * player.cubeUpgrades[70] / 10000,
        1 + +(corruptionLevelSum >= 14 * 8) * +player.singularityUpgrades.divinePack.getEffect().bonus,
        +player.singularityUpgrades.singCubes1.getEffect().bonus,
        +player.singularityUpgrades.singCubes2.getEffect().bonus,
        +player.singularityUpgrades.singCubes3.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain2.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain3.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain4.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain5.getEffect().bonus,
        1 + 0.2 * +player.octeractUpgrades.octeractStarter.getEffect().bonus,
        +player.octeractUpgrades.octeractGain.getEffect().bonus,
        derpsmithCornucopiaBonus(),
        Math.pow(1 + +player.octeractUpgrades.octeractAscensionsOcteractGain.getEffect().bonus, 1 + Math.floor(Math.log10(1 + player.ascensionCount)))
    ]

    const ascensionSpeed = Math.pow(calculateAscensionAcceleration(), 1/2)
    const perSecond = 1/(24 * 3600 * 365 * 1e15) * baseMultiplier * productContents(valueMultipliers) * ascensionSpeed
    return perSecond
}