import { player } from './Synergism';
import { Alert } from './UpdateHTML';
import type { IUpgradeData } from './DynamicUpgrade';
import { DynamicUpgrade } from './DynamicUpgrade';
import { calculateAscensionAcceleration, calculateAscensionScore } from './Calculate';
import { productContents, sumContents } from './Utility';

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
            if (player.goldenQuarks < cost) {
                break;
            } else {
                player.goldenQuarks -= cost;
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

    toString(): string {
        return 'Not yet implemented!'
    }

    updateUpgradeHTML(): void {
        // Not Yet Implemented!
    }
}

export const octeractGainPerSecond = () => {
    const SCOREREQ = 1e32
    const currentScore = calculateAscensionScore().effectiveScore

    const baseMultiplier = (currentScore >= SCOREREQ) ? Math.cbrt(currentScore / SCOREREQ) : Math.pow(currentScore / SCOREREQ, 2);
    const corruptionLevelSum = sumContents(player.usedCorruptions.slice(2, 10))

    const valueMultipliers = [
        1 + player.shopUpgrades.seasonPass3 / 100,
        1 + player.shopUpgrades.seasonPassY / 200,
        1 + player.shopUpgrades.seasonPassZ * player.singularityCount / 100,
        1 + player.shopUpgrades.seasonPassLost / 200,
        1 + +(corruptionLevelSum >= 14 * 8) * player.cubeUpgrades[70] / 10000,
        1 + +(corruptionLevelSum >= 14 * 8) * +player.singularityUpgrades.divinePack.getEffect().bonus,
        +player.singularityUpgrades.singCubes1.getEffect().bonus,
        +player.singularityUpgrades.singCubes2.getEffect().bonus,
        +player.singularityUpgrades.singCubes3.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain2.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain3.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain4.getEffect().bonus,
        +player.singularityUpgrades.singOcteractGain5.getEffect().bonus
    ]

    const ascensionSpeed = calculateAscensionAcceleration()
    const perSecond = 1/(24 * 3600 * 365 * 1e9) * baseMultiplier * productContents(valueMultipliers) * ascensionSpeed
    return perSecond
}