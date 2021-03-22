import { player } from "./Synergism";

export class HepteractCraft {
    /**
     * Craft is unlocked or not (Default is locked)
     */
    UNLOCKED = false;

    /**
     * Current Inventory (amount) of craft you possess
     */
    BAL = 0;

    /**
     * Maximum Inventory (amount) of craft you can hold
     */
    CAP = 0;

    /**
     * Conversion rate of hepteract to synthesized items
     */
    HEPTERACT_CONVERSION = 0;

    /**
     * Conversion rate of additional items
     * This is in the form of keys being player variables,
     * values being the amount player has.
     */
    OTHER_CONVERSIONS: {
        [key: string]: number
    }

    /**
     * Discount Factor (number from [0, 1))
     */
    DISCOUNT = 0;

    constructor(capacity: number, hepteractCost: number, itemCosts: {[key: string]:number}, unlocked?: boolean) {
        this.CAP = capacity;
        this.HEPTERACT_CONVERSION = hepteractCost;
        this.OTHER_CONVERSIONS = itemCosts
        this.UNLOCKED = unlocked; //This would basically always be true if this parameter is provided
    }

    // Unlock a synthesizer craft
    unlock() : HepteractCraft {
        this.UNLOCKED = true;
        return this;
    }

    // Add to balance through crafting.
    craft(craftAmount: number): HepteractCraft {
        // If craft is unlocked, we return object
        if (!this.UNLOCKED) 
            return this;

        // Calculate the largest craft amount possible, with an upper limit being craftAmount
        const hepteractLimit = Math.floor((player.wowAbyssals / this.HEPTERACT_CONVERSION) * 1 / (1 - this.DISCOUNT))

        // Create an array of how many we can craft using our conversion limits for additional items
        let itemLimits: Array<number>
        for (const item in this.OTHER_CONVERSIONS) {
            itemLimits.push(Math.floor(player[item] / this.OTHER_CONVERSIONS[item]) * 1 / (1 - this.DISCOUNT))
        }

        // Get the smallest of the array we created
        const smallestItemLimit = Math.min(...itemLimits)

        // Get the smallest of hepteract limit, limit found above and specified input
        const amountToCraft = Math.min(smallestItemLimit, hepteractLimit, craftAmount)
        this.BAL += amountToCraft

        // Subtract spent items from player
        player.wowAbyssals -= amountToCraft * this.HEPTERACT_CONVERSION
        for (const item in this.OTHER_CONVERSIONS) {
            player[item] -= amountToCraft * this.OTHER_CONVERSIONS[item]
        }
        return this;
    }

    // Reduce balance through spending
    spend(amount: number): HepteractCraft {
        if (!this.UNLOCKED)
            return this;

        this.BAL -= amount;
        return this;
    }

    // Expand your capacity
    /**
     * Expansion can only happen if your current balance is full.
     */
    expand(): HepteractCraft {
        if (!this.UNLOCKED)
            return this;

        // Below capacity
        if (this.BAL < this.CAP)
            return this;
        
        // Empties inventory in exchange for doubling maximum capacity.
        this.BAL = 0
        this.CAP *= 2
        return this;
    }

    // Add some percentage points to your discount
    /**
     * Discount has boundaries [0, 1), and upper limit
     *  is defined by (1 - EPSILON). Craft amount is multiplied by 1 / (1 - Discount)
     */
    addDiscount(amount: number): HepteractCraft {
        // If amount would put Discount to 1 or higher set to upper limit
        if (this.DISCOUNT + amount > (1 - Number.EPSILON)) {
            this.DISCOUNT = 1 - Number.EPSILON;
            return this;
        }

        this.DISCOUNT += amount;
        return this;
    }

    // Get balance of item
    get amount() {
        return this.BAL;
    }
    
}