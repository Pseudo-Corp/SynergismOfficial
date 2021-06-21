/* Functions which Handle Quark Gains,  */

import { calculateSigmoid } from "./Calculate";
import { hepteractEffective } from "./Hepteracts"
import { player } from "./Synergism"
import { Alert } from "./UpdateHTML";
import { Globals as G } from "./Variables"

export const getQuarkMultiplier = () => {
    let multiplier = 1;
    if (player.achievementPoints > 0) { // Achievement Points
        multiplier += player.achievementPoints / 25000; // Cap of +0.20 at 5,000 Pts
    }
    if (player.achievements[250] > 0) { // Max research 8x25
        multiplier += 0.10;
    }
    if (player.achievements[251] > 0) { // Max Wow! Cube Upgrade 5x10
        multiplier += 0.10;
    }
    if (player.talismanRarity[7] > 5) { // Shop Talisman has Mythical Rarity
        multiplier += 0.20;
    }
    if (player.platonicUpgrades[5] > 0) { // Platonic ALPHA upgrade
        multiplier += 0.10;
    }
    if (player.platonicUpgrades[10] > 0) { // Platonic BETA Upgrade
        multiplier += 0.15;
    }
    if (player.platonicUpgrades[15] > 0) { // Platonic OMEGA upgrade
        multiplier += 0.20;
    }
    if (player.challenge15Exponent >= 1e11) { // Challenge 15: Exceed 1e11 exponent reward
        multiplier += (G['challenge15Rewards'].quarks - 1);
    }
    if (player.shopUpgrades.infiniteAscent) { // Purchased Infinite Ascent Rune
        multiplier *= (1.1 + 0.15 / 75 * player.runelevels[5]);
    }
    if (player.challenge15Exponent >= 1e15) { // Challenge 15: Exceed 1e15 exponent reward
        multiplier *= (1 + 3/10000 * hepteractEffective('quark'));
    }
    if (player.overfluxPowder > 0) { // Overflux Powder [Max: 10% at 10,000]
        multiplier *= (1 + Math.min(0.1, (player.overfluxPowder / 1e5)))      
    }
    if (player.achievements[266] > 0) { // Achievement 266 [Max: 10% at 1Qa Ascensions]
        multiplier *= (1 + Math.min(0.1, (player.ascensionCount) / 1e16))
    }
    return multiplier
}

export const quarkHandler = () => {
    let maxTime = 90000 //In Seconds
    if (player.researches[195] > 0) {
        maxTime += 18000 * player.researches[195] // Research 8x20
    }

    //Part 2: Calculate quark gain per hour
    let baseQuarkPerHour = 5;
    if (G['isEvent'])
        baseQuarkPerHour += 13;
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

    const quarkMultiplier = getQuarkMultiplier();
    const quarkPerHour = baseQuarkPerHour * quarkMultiplier

    //Part 3: Calculates capacity of quarks on export
    const capacity = Math.floor(quarkPerHour * maxTime / 3600)

    //Part 4: Calculate how many quarks are to be gained.
    const quarkGain = Math.floor(player.quarkstimer * quarkPerHour / 3600);

    //Part 5 [June 9, 2021]: Calculate bonus awarded to cube quarks.
    const cubeMult = calculateSigmoid(2, Math.pow(player.overfluxOrbs, 0.5), 40)
    //Return maxTime, quarkPerHour, capacity and quarkGain as object
    return {
        maxTime: maxTime,
        perHour: quarkPerHour,
        capacity: capacity,
        gain: quarkGain,
        cubeMult: cubeMult
    };
}

export class QuarkHandler {
    /** Global quark bonus */
    private BONUS = 0;
    /** Quark amount */
    private QUARKS = 0;

    private static interval: ReturnType<typeof setInterval> | null = null;

    constructor({ bonus, quarks }: { bonus?: number, quarks: number }) {
        this.QUARKS = quarks;
        if (bonus)
            this.BONUS = bonus;
        else
            this.getBonus();

        if (QuarkHandler.interval === null) // although the values are cached for 15 mins, refresh every 5
            QuarkHandler.interval = setInterval(this.getBonus.bind(this), 60 * 1000 * 5);
    }

    /*** Calculates the number of quarks to give with the current bonus. */
    applyBonus(amount: number) {
        return amount * (1 + (this.BONUS / 100));
    }

    /** Subtracts quarks, as the name suggests. */
    add(amount: number, useBonus = true) {
        if (useBonus)
            this.QUARKS += this.applyBonus(amount);
        else
            this.QUARKS += amount;
        return this;
    }

    /** Add quarks, as suggested by the function's name. */
    sub(amount: number) {
        this.QUARKS -= amount;
        if (this.QUARKS < 0) this.QUARKS = 0;

        return this;
    }

    public get _BONUS() : number {
        return this.BONUS
    }    

    async getBonus() {
        const el = document.getElementById('currentBonus');
        if (localStorage.getItem('quarkBonus') !== null) { // is in cache
            const { bonus, fetched } = JSON.parse(localStorage.getItem('quarkBonus'));
            if (Date.now() - fetched < 60 * 1000 * 15) { // cache is younger than 15 minutes
                console.log(
                    `%c \tBonus of ${bonus}% quarks has been applied! \n\t(Cached at ${fetched})`, 
                    'color:gold; font-size:60px; font-weight:bold; font-family:helvetica;'
                );
                el.textContent = `Generous patrons give you a bonus of ${bonus}% more quarks!`;
                return this.BONUS = bonus;
            }
        } else if (!navigator.onLine) {
            return el.textContent = `Current Bonus: N/A (offline)%!`;
        }

        try {
            const r = await fetch('https://api.github.com/gists/44be6ad2dcf0d44d6a29dffe1d66a84a', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const t = await r.json();
            const b = Number(t.files['SynergismQuarkBoost.txt'].content);

            if (Number.isNaN(b)) 
                return Alert('No bonus could be applied, an error occurred. [NaN] :(');
            else if (!Number.isFinite(b))
                return Alert('No bonus could be applied, an error occurred. [Infinity] :(');
            else if (b < 0)
                return Alert('No bonus could be applied, an error occurred. [Zero] :(');

            console.log(`%c \tBonus of ${b}% quarks has been applied!`, 'color:gold; font-size:60px; font-weight:bold; font-family:helvetica;');
            el.textContent = `Generous patrons give you a bonus of ${b}% more quarks!`;
            localStorage.setItem('quarkBonus', JSON.stringify({ bonus: b, fetched: Date.now() }));
            this.BONUS = b;
        } catch {
            console.log(`If you see an error with "fetch" or "network" in it, you can safely ignore it!`);
            // there are a few examples where this request might fail:
            //      1. tab is in the background, browser throttles it.
            //      2. idle too long, network connection is severed
            // there's nothing we can do if an error occurs so we should ignore it.
        }
    }

    [Symbol.toPrimitive] = (t: string) => t === 'number' ? this.QUARKS : null;
}