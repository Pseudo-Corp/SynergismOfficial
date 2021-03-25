import { format, player } from "./Synergism";
import { Alert, Confirm, Prompt } from "./UpdateHTML";

export interface IHepteractCraft {
    BASE_CAP: number,
    HEPTERACT_CONVERSION: number,
    OTHER_CONVERSIONS: {[key:string]:number},
    UNLOCKED?: boolean,
    BAL?: number,
    CAP?: number,
    DISCOUNT?: number 
}

type hepteractTypes = 'chronos' | 'hyperrealism' | 'quark' | 'challenge'

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
     * base_cap is the smallest capacity for such item.
     */
    CAP = 0;
    BASE_CAP = 0;

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

    constructor(data: IHepteractCraft) {
        this.BASE_CAP = data.BASE_CAP;
        this.HEPTERACT_CONVERSION = data.HEPTERACT_CONVERSION;
        this.OTHER_CONVERSIONS = data.OTHER_CONVERSIONS
        this.UNLOCKED = data.UNLOCKED ?? false; //This would basically always be true if this parameter is provided
        this.BAL = data.BAL ?? 0;
        this.CAP = data.CAP ?? this.BASE_CAP // This sets cap either as previous value or keeps it to default.
        this.DISCOUNT = data.DISCOUNT ?? 0;
    }

    // Unlock a synthesizer craft
    unlock() : HepteractCraft {
        this.UNLOCKED = true;
        return this;
    }

    // Add to balance through crafting.
    craft = async() : Promise<HepteractCraft> => {
        //Prompt used here. Thank you Khafra for the already made code! -Platonic
        const craftingPrompt = await Prompt('How many would you like to craft?');
        if (craftingPrompt === null) // Number(null) is 0. Yeah..
            return Alert('Okay, maybe next time.');
        const craftAmount = Number(craftingPrompt)

        //Check these lol
        if (Number.isNaN(craftAmount) || !Number.isFinite(craftAmount)) // nan + Infinity checks
        return Alert('Value must be a finite number!');
        else if (craftAmount <= 0) // 0 or less selected
        return Alert('You can\'t craft a nonpositive amount of these fucks, lol!');

        // If craft is unlocked, we return object
        if (!this.UNLOCKED) 
            return Alert('This is not an unlocked craft, thus you cannot craft this item!');

        // Calculate the largest craft amount possible, with an upper limit being craftAmount
        const hepteractLimit = Math.floor((player.wowAbyssals / this.HEPTERACT_CONVERSION) * 1 / (1 - this.DISCOUNT))

        // Create an array of how many we can craft using our conversion limits for additional items
        let itemLimits: Array<number> = []
        for (const item in this.OTHER_CONVERSIONS) {
            itemLimits.push(Math.floor(player[item] / this.OTHER_CONVERSIONS[item]) * 1 / (1 - this.DISCOUNT))
        }

        // Get the smallest of the array we created
        const smallestItemLimit = Math.min(...itemLimits)

        // Get the smallest of hepteract limit, limit found above and specified input
        const amountToCraft = Math.min(smallestItemLimit, hepteractLimit, craftAmount, this.CAP - this.BAL)
        this.BAL += amountToCraft

        // Subtract spent items from player
        player.wowAbyssals -= amountToCraft * this.HEPTERACT_CONVERSION
        for (const item in this.OTHER_CONVERSIONS) {
            player[item] -= amountToCraft * this.OTHER_CONVERSIONS[item]
        }
        return Alert('You have successfully crafted ' + format(amountToCraft, 0, true) + ' hepteracts. If this is less than your input, you either hit the inventory limit or you had insufficient resources.');
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
    expand = async(): Promise<HepteractCraft> => {
        const expandPrompt = await Confirm('This will empty your balance, but double your capacity. Agree to the terms and conditions and stuff?')
        if (!expandPrompt) {
            return this;
        }
        if (!this.UNLOCKED)
            return Alert('This is not an unlocked craft. Sorry!');

        // Below capacity
        if (this.BAL < this.CAP)
            return Alert('Insufficient inventory to expand. 404 909 error.');
        
        // Empties inventory in exchange for doubling maximum capacity.
        this.BAL = 0
        this.CAP *= 2
        return Alert('Successfully expanded your inventory. You can now fit ' + format(this.CAP, 0, true) + '.');
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
    get capacity() {
        return this.CAP
    }
    get discount() {
        return this.DISCOUNT
    }
    
}

export const createHepteract = (data: IHepteractCraft) => {
    return new HepteractCraft(data)
}

export const hepteractDescriptions = (type: hepteractTypes) => {
    const unlockedText = document.getElementById('hepteractUnlockedText')
    const effectText = document.getElementById('hepteractEffectText')
    const currentEffectText = document.getElementById('hepteractCurrentEffectText')
    const balanceText = document.getElementById('hepteractBalanceText')
    const costText = document.getElementById('hepteractCostText')
    switch(type){
        case 'chronos':
            unlockedText.textContent = (player.hepteractCrafts.chronos.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "This hepteract bends time, in your favor. +0.1% Ascension Speed per Chronos Hepteract."
            currentEffectText.textContent = "Current Effect: Ascension Speed +" + format(player.hepteractCrafts.chronos.BAL / 10, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.chronos.BAL, 0, true) + " / " + format(player.hepteractCrafts.chronos.CAP) + " [The bonus caps at 1,000 right now, WIP]"
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.chronos.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 1e115 Obtainium [WIP]"
            break;
        case 'hyperrealism':
            unlockedText.textContent = (player.hepteractCrafts.hyperrealism.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "This bad boy can make hypercube gain skyrocket. +0.1% Hypercubes per Hyperreal Hepteract."
            currentEffectText.textContent = "Current Effect: Hypercubes +" + format(player.hepteractCrafts.hyperrealism.BAL / 10, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.hyperrealism.BAL, 0, true) + " / " + format(player.hepteractCrafts.hyperrealism.CAP) + " [The bonus caps at 1,000 right now, WIP]"
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.hyperrealism.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 1e65 Offerings."
            break;
        case 'quark':
            unlockedText.textContent = (player.hepteractCrafts.quark.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "One pound, two pound fish, fishy grant +0.03% Quarks per Quark Hepteract fish fish."
            currentEffectText.textContent = "Current Effect: Quarks +" + format(player.hepteractCrafts.quark.BAL * 3 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.quark.BAL, 0, true) + " / " + format(player.hepteractCrafts.quark.CAP) + " [The bonus caps at 1,000 right now, WIP]"
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.quark.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 100 Quarks."
            break;
        case 'challenge':
            unlockedText.textContent = (player.hepteractCrafts.challenge.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "That's preposterous. How are you going to gain +0.03% C15 Exponent per Challenge Hepteract? How!?"
            currentEffectText.textContent = "Current Effect: C15 Exponent +" + format(player.hepteractCrafts.challenge.BAL * 3 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.challenge.BAL, 0, true) + " / " + format(player.hepteractCrafts.challenge.CAP) + " [The bonus caps at 1,000 right now, WIP]"
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.challenge.HEPTERACT_CONVERSION, 0, true) + " Hepteracts, 1e11 Platonic Cubes and 1e22 Cubes."
            break;
    }
}

// Hepteract of Chronos [UNLOCKED]
export const ChronosHepteract = new HepteractCraft({
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e4,
    OTHER_CONVERSIONS: {'researchPoints': 1e115},
    UNLOCKED: true
});

// Hepteract of Hyperrealism [UNLOCKED]
export const HyperrealismHepteract = new HepteractCraft({
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e4,
    OTHER_CONVERSIONS: {'runeshards': 1e65},
    UNLOCKED: true
});

// Hepteract of Too Many Quarks [UNLOCKED]
export const QuarkHepteract = new HepteractCraft({
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e4,
    OTHER_CONVERSIONS: {'worlds': 100},
    UNLOCKED: true
}); 

// Hepteract of Challenge [LOCKED]
export const ChallengeHepteract = new HepteractCraft({
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 5e4,
    OTHER_CONVERSIONS: {'wowPlatonicCubes': 1e11, 'wowCubes': 1e22} 
});
