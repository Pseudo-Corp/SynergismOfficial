/* Functions which Handle Quark Gains,  */

import { hepteractEffective } from "./Hepteracts"
import { player } from "./Synergism"
import { Globals as G } from "./Variables"

export const quarkHandler = () : { maxTime: number; perHour: number;
                                    capacity: number; gain: number} => {
    let maxTime = 90000 //In Seconds
    if (player.researches[195] > 0) {
        maxTime += 18000 * player.researches[195] // Research 8x20
    }

    //Part 2: Calculate quark gain per hour
    let baseQuarkPerHour = 5;
    if (player.researches[99] > 0) {
        baseQuarkPerHour += player.researches[99]; //Caps at 2 not 1
    }
    if (player.researches[100] > 0) {
        baseQuarkPerHour += 1;
    }
    if (player.researches[125] > 0) {
        baseQuarkPerHour += 1;
    }
    if (player.researches[180] > 0) {
        baseQuarkPerHour += 1;
    }
    if (player.researches[195] > 0) {
        baseQuarkPerHour += player.researches[195] //Caps at 2 not 1
    }

    let quarkPerHourMultiplier = 1;
    if (player.achievementPoints > 0) {
        quarkPerHourMultiplier += player.achievementPoints / 25000 // Max of +20.00%
    }
    if (player.achievements[250] > 0) {
        quarkPerHourMultiplier += 0.10
    }
    if (player.achievements[251] > 0) {
        quarkPerHourMultiplier += 0.10
    }
    if (player.talismanRarity[7] > 5) {
        quarkPerHourMultiplier += 0.20
    }
    if (player.platonicUpgrades[5] > 0) {
        quarkPerHourMultiplier += 0.10
    }
    if (player.platonicUpgrades[10] > 0) {
        quarkPerHourMultiplier += 0.15
    }
    if (player.platonicUpgrades[15] > 0) {
        quarkPerHourMultiplier += 0.20
    }
    if (player.challenge15Exponent >= 1e11) {
        quarkPerHourMultiplier += (G['challenge15Rewards'].quarks - 1)
    }
    if (player.shopUpgrades.infiniteAscent) {
        quarkPerHourMultiplier *= (1.1 + 0.15 / 75 * player.runelevels[5])
    }
        quarkPerHourMultiplier *= (1 + 3/10000 * hepteractEffective('quark'))

    const quarkPerHour = baseQuarkPerHour * quarkPerHourMultiplier

    //Part 3: Calculates capacity of quarks on export
    const capacity = Math.floor(quarkPerHour * maxTime / 3600)

    //Part 4: Calculate how many quarks are to be gained.
    const quarkGain = Math.floor(player.quarkstimer * quarkPerHour / 3600);

    //Return maxTime, quarkPerHour, capacity and quarkGain as object
    return {
        maxTime: maxTime,
        perHour: quarkPerHour,
        capacity: capacity,
        gain: quarkGain
    };
}

export class QuarkHandler {
    /** Global quark bonus */
    BONUS = 0;
    /** Quark amount */
    QUARKS = 0;

    constructor({ bonus, quarks }: { bonus?: number, quarks: number }) {
        this.QUARKS = quarks;
        if (bonus)
            this.BONUS = bonus;
    }

    /*** Calculates the number of quarks to give with the current bonus. */
    applyBonus(amount: number) {
        return amount * (1 + (this.BONUS / 100));
    }

    /** Subtracts quarks, as the name suggests. */
    add(amount: number) {
        this.QUARKS += this.applyBonus(amount);

        return this;
    }

    /** Add quarks, as suggested by the function's name. */
    sub(amount: number) {
        this.QUARKS -= amount;
        if (this.QUARKS < 0) this.QUARKS = 0;

        return this;
    }

    [Symbol.toPrimitive] = (t: string) => t === 'number' ? this.QUARKS : null;
}