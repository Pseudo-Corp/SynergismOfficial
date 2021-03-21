/* Functions which Handle Quark Gains,  */

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
        quarkPerHourMultiplier *= (1.1 + 0.1/5000 * player.runelevels[5])
    }

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
