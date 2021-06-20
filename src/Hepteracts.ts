import { calculatePowderConversion, calculateSigmoid, forcedDailyReset } from "./Calculate";
import { Cube } from "./CubeExperimental";
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

type hepteractTypes = 'chronos' | 'hyperrealism' | 'quark' | 'challenge' |
                      'abyss' | 'accelerator' | 'acceleratorBoost' | 'multiplier'

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
    unlock = (hepteractName: string): HepteractCraft | Promise<void> => {
        if (this.UNLOCKED === true) {
            return this;
        }
        this.UNLOCKED = true;
        return Alert('Congratulations. You have unlocked the ability to craft ' + hepteractName + ' in the hepteract forge!');
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
        const itemLimits: Array<number> = []
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
            if (typeof player[item] === 'number')
                player[item] -= amountToCraft * this.OTHER_CONVERSIONS[item];
            else if (Object.prototype.isPrototypeOf.call(Cube, player[item]))
                (<Cube>player[item]).sub(amountToCraft * this.OTHER_CONVERSIONS[item]);
            else if (item == 'worlds')
                player.worlds.sub(amountToCraft * this.OTHER_CONVERSIONS[item])
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

const hepteractEffectiveValues = {
    'chronos': {
        LIMIT: 1000,
        DR: 1/6,
    },
    'hyperrealism': {
        LIMIT: 1000,
        DR: 0.33
    },
    'quark': {
        LIMIT: 1000,
        DR: 0.2
    },
    'challenge': {
        LIMIT: 1000,
        DR: 1/6
    },
    'abyss': {
        LIMIT: 1,
        DR: 0
    },
    'accelerator': {
        LIMIT: 1000,
        DR: 0.2
    },
    'acceleratorBoost': {
        LIMIT: 1000,
        DR: 0.2
    },
    'multiplier': {
        LIMIT: 1000,
        DR: 0.2
    }
}

export const createHepteract = (data: IHepteractCraft) => {
    return new HepteractCraft(data)
}

export const hepteractEffective = (data: hepteractTypes) => {
    let effectiveValue = Math.min(player.hepteractCrafts[data].BAL, hepteractEffectiveValues[data].LIMIT)

    if (player.hepteractCrafts[data].BAL > hepteractEffectiveValues[data].LIMIT) {
        effectiveValue *= Math.pow(player.hepteractCrafts[data].BAL / hepteractEffectiveValues[data].LIMIT, hepteractEffectiveValues[data].DR)
    }

    return effectiveValue
}

export const hepteractDescriptions = (type: hepteractTypes) => {
    document.getElementById('hepteractUnlockedText').style.display = 'block'
    document.getElementById('hepteractCurrentEffectText').style.display = 'block'
    document.getElementById('hepteractBalanceText').style.display = 'block'
    document.getElementById('powderDayWarpText').style.display = 'none'
    document.getElementById('hepteractCostText').style.display = 'block'

    const unlockedText = document.getElementById('hepteractUnlockedText')
    const effectText = document.getElementById('hepteractEffectText')
    const currentEffectText = document.getElementById('hepteractCurrentEffectText')
    const balanceText = document.getElementById('hepteractBalanceText')
    const costText = document.getElementById('hepteractCostText')
    switch(type){
        case 'chronos':
            unlockedText.textContent = (player.hepteractCrafts.chronos.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "This hepteract bends time, in your favor. +0.06% Ascension Speed per Chronos Hepteract."
            currentEffectText.textContent = "Current Effect: Ascension Speed +" + format(hepteractEffective('chronos') * 6 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.chronos.BAL, 0, true) + " / " + format(player.hepteractCrafts.chronos.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.chronos.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 1e115 Obtainium [WIP]"
            break;
        case 'hyperrealism':
            unlockedText.textContent = (player.hepteractCrafts.hyperrealism.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "This bad boy can make hypercube gain skyrocket. +0.06% Hypercubes per Hyperreal Hepteract."
            currentEffectText.textContent = "Current Effect: Hypercubes +" + format(hepteractEffective('hyperrealism') * 6 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.hyperrealism.BAL, 0, true) + " / " + format(player.hepteractCrafts.hyperrealism.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.hyperrealism.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 1e80 Offerings."
            break;
        case 'quark':
            unlockedText.textContent = (player.hepteractCrafts.quark.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "One pound, two pound fish, fishy grant +0.03% Quarks per Quark Hepteract fish fish."
            currentEffectText.textContent = "Current Effect: Quarks +" + format(hepteractEffective('quark') * 3 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.quark.BAL, 0, true) + " / " + format(player.hepteractCrafts.quark.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.quark.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 100 Quarks."
            break;
        case 'challenge':
            unlockedText.textContent = (player.hepteractCrafts.challenge.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "That's preposterous. How are you going to gain +0.05% C15 Exponent per Challenge Hepteract? How!?"
            currentEffectText.textContent = "Current Effect: C15 Exponent +" + format(hepteractEffective('challenge') * 5 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.challenge.BAL, 0, true) + " / " + format(player.hepteractCrafts.challenge.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.challenge.HEPTERACT_CONVERSION, 0, true) + " Hepteracts, 1e11 Platonic Cubes and 1e22 Cubes."
            break;
        case 'abyss':
            unlockedText.textContent = (player.hepteractCrafts.abyss.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "It seems like this holds the power to be at the End of Time. Do you remember why you need this?"
            currentEffectText.textContent = "<[You will submit to the Omega Entity of Time]>"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.abyss.BAL, 0, true) + " / " + format(player.hepteractCrafts.abyss.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.abyss.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 69 Wow! Cubes (lol)"
            break;
        case 'accelerator':
            unlockedText.textContent = (player.hepteractCrafts.accelerator.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "Haha, stupid Corruptions. +0.03% Uncorruptable Accelerators per 'Way too many accelerators' Hepteract!"
            currentEffectText.textContent = "Current Effect: Uncorruptable Accelerators +" + format(hepteractEffective('accelerator') * 3 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.accelerator.BAL, 0, true) + " / " + format(player.hepteractCrafts.accelerator.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.accelerator.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 1e14 Wow! Tesseracts"
            break;
        case 'acceleratorBoost':
            unlockedText.textContent = (player.hepteractCrafts.acceleratorBoost.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "Haha, stupid Corruptions. +0.03% Uncorruptable Accelerator Boosts per 'Way too many accelerator boosts' Hepteract!"
            currentEffectText.textContent = "Current Effect: Uncorruptable Accelerator Boosts +" + format(hepteractEffective('acceleratorBoost') * 3 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.acceleratorBoost.BAL, 0, true) + " / " + format(player.hepteractCrafts.acceleratorBoost.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.acceleratorBoost.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 1e10 Hypercubes"
            break;
        case 'multiplier':
            unlockedText.textContent = (player.hepteractCrafts.multiplier.UNLOCKED) ? "< UNLOCKED >": "< LOCKED >"
            effectText.textContent = "Haha, stupid Corruptions. +0.03% Uncorruptable Multipliers per 'Way too many multipliers' Hepteract!"
            currentEffectText.textContent = "Current Effect: Uncorruptable Multipliers +" + format(hepteractEffective('multiplier') * 3 / 100, 2, true) + "%"
            balanceText.textContent = "Inventory: " + format(player.hepteractCrafts.multiplier.BAL, 0, true) + " / " + format(player.hepteractCrafts.multiplier.CAP)
            costText.textContent = "One of these will cost you " + format(player.hepteractCrafts.multiplier.HEPTERACT_CONVERSION, 0, true) + " Hepteracts and 1e130 Obtainium"
            break;
    }
}

/**
 * Generates the description at the bottom of the page for Overflux Orb crafting
 */
export const hepteractToOverfluxOrbDescription = () => {
    document.getElementById('hepteractUnlockedText').style.display = 'none'
    document.getElementById('powderDayWarpText').style.display = 'none'
    document.getElementById('hepteractCostText').style.display = 'block'

    document.getElementById('hepteractCurrentEffectText').textContent = 'Orb Effect: Opening Cubes gives ' + format(100 *(-1 + calculateSigmoid(2, Math.pow(player.overfluxOrbs, 0.5), 40)), 2, true) + "% more Quarks."
    document.getElementById('hepteractBalanceText').textContent = 'Orbs Purchased Today: ' + format(player.overfluxOrbs, 0, true) + '.'
    document.getElementById('hepteractEffectText').textContent = "You can amalgamate Overflux Orbs here. [NOTE: these expire at the end of your current day]"
    document.getElementById('hepteractCostText').textContent = "Cost: 250,000 Hepteracts per Overflux Orb"
}

/**
 * Trades Hepteracts for Overflux Orbs at 250,000 : 1 ratio. If null or invalid will gracefully terminate.
 * @returns Alert of either purchase failure or success
 */
export const tradeHepteractToOverfluxOrb = async () => {
    const maxBuy = Math.floor(player.wowAbyssals / 250000)
    const hepteractInput = await Prompt('How many Orbs would you like to purchase? You can buy up to ' + format(maxBuy, 0, true) +  ' with your hepteracts.')
    const toUse = Number(hepteractInput);
    if (
        Number.isNaN(toUse) ||
        !Number.isInteger(toUse) ||
        toUse <= 0
    )
        return Alert(`Hey! That's not a valid number!`);
    
    const buyAmount = Math.min(maxBuy, toUse)
    const beforeEffect = calculateSigmoid(2, Math.pow(player.overfluxOrbs, 0.5), 40)
    player.overfluxOrbs += buyAmount
    player.wowAbyssals -= 250000 * buyAmount
    const afterEffect = calculateSigmoid(2, Math.pow(player.overfluxOrbs, 0.5), 40)

    return Alert(`You have purchased ` + format(buyAmount, 0, true) + ` Overflux Orbs [+${format(100 * (afterEffect - beforeEffect), 2, true)}% to effect]. Enjoy!`)

}

/**
 * Generates the description at the bottom of the page for Overflux Powder Properties
 */
export const overfluxPowderDescription = () => {
    document.getElementById('hepteractUnlockedText').style.display = 'none'
    document.getElementById('hepteractCurrentEffectText').textContent = 'Powder effect: ALL Cube Gain +' + format(Math.min(100, player.overfluxPowder / 100), 2, true) + '% and Quarks +' + format(Math.min(10, player.overfluxPowder / 1000), 2, true) + '% [Max effect at 10,000 Powder]'
    document.getElementById('hepteractBalanceText').textContent = 'You have ' + format(player.overfluxPowder, 2, true) + ' lumps of Overflux Powder.'
    document.getElementById('hepteractEffectText').textContent = `Expired Overflux Orbs become powder at a rate of ${format(1 / calculatePowderConversion().mult, 1, true)} Orbs per powder lump!`
    document.getElementById('hepteractCostText').style.display = 'none'

    document.getElementById('powderDayWarpText').style.display = 'block'
    document.getElementById('powderDayWarpText').textContent = `Day Warps remaining today: ${player.dailyPowderResetUses}`
}

/**
 * Attempts to operate a 'Day Reset' which, if successful, resets Daily Cube counters for the player.
 * Note by Platonic: kinda rushed job but idk if it can be improved.
 * @returns Alert, either for success or failure of warping
 */
export const overfluxPowderWarp = async () => {
    if (player.overfluxPowder < 25)
        return Alert('Sorry, but you need 25 powder to operate the warp machine.')
    if (player.dailyPowderResetUses <= 0)
        return Alert('Sorry, but this machine is on cooldown.')
    const c = await Confirm('You stumble upon a mysterious machine. A note attached says that you can reset daily Cube openings for 25 Powder. However it only works once each real life day. You in?')
    if (!c)
        return Alert('You walk away from the machine, powder intact.')
    else {
        player.overfluxPowder -= 25
        player.dailyPowderResetUses -= 1;
        forcedDailyReset();
        return Alert('Upon using the machine, your cubes feel just a little more rewarding. Daily cube opening counts have been reset! [-25 Powder]')
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
    OTHER_CONVERSIONS: {'runeshards': 1e80},
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

// Hepteract of The Abyssal [LOCKED]
export const AbyssHepteract = new HepteractCraft({
    BASE_CAP: 1,
    HEPTERACT_CONVERSION: 1e8,
    OTHER_CONVERSIONS: {'wowCubes': 69}
})

// Hepteract of Too Many Accelerator [LOCKED]
export const AcceleratorHepteract = new HepteractCraft({
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 1e5,
    OTHER_CONVERSIONS: {'wowTesseracts': 1e14}
})

// Hepteract of Too Many Accelerator Boost [LOCKED]
export const AcceleratorBoostHepteract = new HepteractCraft({
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 2e5,
    OTHER_CONVERSIONS: {'wowHypercubes': 1e10}
})

// Hepteract of Too Many Multiplier [LOCKED]
export const MultiplierHepteract = new HepteractCraft({
    BASE_CAP: 1000,
    HEPTERACT_CONVERSION: 3e5,
    OTHER_CONVERSIONS: {'researchPoints': 1e130}
})
