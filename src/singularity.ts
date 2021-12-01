import { DOMCacheGetOrSet } from "./Cache/DOM"
import { format, player } from "./Synergism"
import { Player } from "./types/Synergism"
import { Alert, Prompt } from "./UpdateHTML"
import { toOrdinal } from "./Utility"

/**
 * 
 * Updates all statistics related to Singularities in the Singularity Tab.
 * 
 */
export const updateSingularityStats = ():void => {
    DOMCacheGetOrSet('singularityCount').textContent = toOrdinal(player.singularityCount)
    DOMCacheGetOrSet('goldenQuarks').textContent = format(player.goldenQuarks, 0, true)
    DOMCacheGetOrSet('singularitySpeedDivisor').textContent = format(player.singularityCount + 1, 2, true)
    DOMCacheGetOrSet('singularityCubeDivisor').textContent = format(1 + 1/16 * Math.pow(player.singularityCount, 2), 2, true)
    DOMCacheGetOrSet('singularityResearchMultiplier').textContent = format(player.singularityCount + 1, 2, true)
    DOMCacheGetOrSet('singularityCubeUpgradeMultiplier').textContent = format(player.singularityCount + 1, 2, true)
}

export interface ISingularityData {
    name: string
    description: string
    level?: number
    maxLevel: number
    costPerLevel: number
    toggleBuy?: number
    goldenQuarksInvested?: number
}

/**
 * Singularity Upgrades are bought in the singularity tab, and all have their own
 * name, description, level and maxlevel, plus a feature to toggle buy on each.
 */
export class SingularityUpgrade {

    // Field Initialization
    private readonly name: string;
    private readonly description: string;
    public level:number = 0;
    private readonly maxLevel: number; //-1 = infinitely levelable
    private readonly costPerLevel: number; 
    public toggleBuy:number = 1; //-1 = buy MAX (or 1000 in case of infinity levels!)
    public goldenQuarksInvested:number = 0;

    public constructor(data: ISingularityData){
        this.name = data.name;
        this.description = data.description;
        this.level = data.level ?? this.level;
        this.maxLevel = data.maxLevel;
        this.costPerLevel = data.costPerLevel;
        this.toggleBuy = data.toggleBuy ?? 1;
        this.goldenQuarksInvested = data.goldenQuarksInvested ?? 0;
    }

    /**
     * Given an upgrade, give a concise information regarding its data.
     * @returns A string that details the name, description, level statistic, and next level cost.
     */
    toString():string {
        let maxLevel = `/${this.maxLevel}`
        if (this.maxLevel === -1)
            maxLevel = ""

        const costNextLevel = this.getCostTNL();
        return `${this.name}\n
                ${this.description}\n
                Level ${this.level}${maxLevel}\n
                Cost for next level: ${format(costNextLevel)} Golden Quarks.\n
                Spent Quarks: ${this.goldenQuarksInvested}`
    }

    public updateUpgradeHTML():void {
        DOMCacheGetOrSet('testingMultiline').innerHTML = this.toString()
    }

    /**
     * Retrieves the cost for upgrading the singularity upgrade once. Return 0 if maxed.
     * @returns A number representing how many Golden Quarks a player must have to upgrade once.
     */
    private getCostTNL():number {
        return (this.maxLevel === this.level) ? 0: this.costPerLevel * (1 + this.level);
    }

    /**
     * Buy levels up until togglebuy or maxxed.
     * @returns An alert indicating cannot afford, already maxxed or purchased with how many
     *          levels purchased
     */
    public async buyLevel(): Promise<void> {
        let maxPurchasable = Math.min(this.toggleBuy, this.maxLevel - this.level);
        if (this.maxLevel === -1)
            maxPurchasable = (this.toggleBuy === -1) ?
                             1000:
                             this.toggleBuy;

        let purchased = 0;
        if (maxPurchasable === 0)
            return Alert("hey! You have already maxxed this upgrade. :D")

        let cost:number
        while (maxPurchasable > 1) {
            cost = this.getCostTNL();            
            if (player.goldenQuarks < cost) {
                break;
            }

            else {
                player.goldenQuarks -= cost;
                this.goldenQuarksInvested += cost;
                this.level += 1;
                purchased += 1;
                maxPurchasable -= 1;                
            }
        } 
        
        return (purchased === 0)? 
                Alert(`You cannot afford this upgrade. Sorry!`):
                Alert(`You have purchased ${format(purchased)} levels of the ${this.name} upgrade.`);
    }

    public async changeToggle():Promise<void> {

        // Is null unless given an explicit number
        let newToggle = null
        newToggle = await Prompt(`Set maximum purchase amount per click for the ${this.name} upgrade. \n
                                  type -1 to set to MAX by default.`)

        if (newToggle === null)
            return Alert(`Toggle kept at ${format(this.toggleBuy)}.`)

        newToggle = Number(newToggle)

        if (!Number.isInteger(newToggle))
            return Alert("Toggle value must be a whole number!");
        if (newToggle < -1)
            return Alert("The only valid negative number for toggle is -1.");
        if (newToggle === 0)
            return Alert("You cannot set the toggle to 0.");

        this.toggleBuy = newToggle;
        return (newToggle === -1)?
                Alert("Your toggle is now set to MAX"):
                Alert(`Your toggle is now set to ${this.toggleBuy}`);        
    }
}

export const singularityData: Record<keyof Player['singularityUpgrades'], ISingularityData> = {
    goldenQuarks1: {
        name: "Golden Quarks I",
        description: "Testing for now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    goldenQuarks2: {
        name: "Golden Quarks II",
        description: "Testing for now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    goldenQuarks3: {
        name: "Golden Quarks III",
        description: "Testing for now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    starterPack: {
        name: "Starter Pack",
        description: "Testing for now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    wowPass: {
        name: "Wow Pass Unlock",
        description: "Testing for now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    cookies: {
        name: "Assorted Cookies",
        description: "Testing for now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    ascensions: {
        name: "Improved Ascension Gain",
        description: "Tesitng For Now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    corruptionFourteen: {
        name: "Level Fourteen Corruptions",
        description: "Testing for Now.",
        maxLevel: -1,
        costPerLevel: 200,
    },
    corruptionFifteen: {
        name: "Level Fifteen Corruptions",
        description: "Testing for Now",
        maxLevel: -1,
        costPerLevel: 200,
    },
}