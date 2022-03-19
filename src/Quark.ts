/* Functions which Handle Quark Gains,  */

import { calculateCubeQuarkMultiplier, calculateEffectiveIALevel, calculateQuarkMultFromPowder} from "./Calculate";
import { hepteractEffective } from "./Hepteracts"
import { player } from "./Synergism"
import { Alert } from "./UpdateHTML";
import { Globals as G } from "./Variables"
import { DOMCacheGetOrSet } from './Cache/DOM';

const getBonus = async (): Promise<null | number> => {
    if (navigator.onLine === false) return null;
    if (document.hidden === true) return null;

    try {
        const r = await fetch('https://api.github.com/gists/44be6ad2dcf0d44d6a29dffe1d66a84a', {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        const t = await r.json() as { files: Record<string, { content: string }> };
        const b = Number(t.files['SynergismQuarkBoost.txt'].content);

        return b;
    } catch (e) {
        console.log(`GitHub Gist: ${(<Error>e).message}`);
    }

    try {
        const r = await fetch('https://synergism-quarks.khafra.workers.dev/');
        const j = await r.json() as { bonus: number };

        return j.bonus;
    } catch (e) {
        console.log(`workers.dev: ${(<Error>e).message}`);
        return undefined;
    }
}

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
        multiplier *= (1.1 + 0.15 / 75 * calculateEffectiveIALevel());
    }
    if (player.challenge15Exponent >= 1e15) { // Challenge 15: Exceed 1e15 exponent reward
        multiplier *= (1 + 5/10000 * hepteractEffective('quark'));
    }
    if (player.overfluxPowder > 0) { // Overflux Powder [Max: 10% at 10,000]
        multiplier *= calculateQuarkMultFromPowder();      
    }
    if (player.achievements[266] > 0) { // Achievement 266 [Max: 10% at 1Qa Ascensions]
        multiplier *= (1 + Math.min(0.1, (player.ascensionCount) / 1e16))
    }
    if (player.singularityCount > 0) { // Singularity Modifier
        multiplier *= (1 + player.singularityCount / 10)
    }
    if (G['isEvent']) {
        multiplier *= 2; // dec 23 to jan 3
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

    const quarkResearches = [99, 100, 125, 180, 195]
    for (const el of quarkResearches) {
        baseQuarkPerHour += player.researches[el]
    }
    const quarkMultiplier = getQuarkMultiplier();
    const quarkPerHour = baseQuarkPerHour * quarkMultiplier

    //Part 3: Calculates capacity of quarks on export
    const capacity = Math.floor(quarkPerHour * maxTime / 3600)

    //Part 4: Calculate how many quarks are to be gained.
    const quarkGain = Math.floor(player.quarkstimer * quarkPerHour / 3600);

    //Part 5 [June 9, 2021]: Calculate bonus awarded to cube quarks.
    const cubeMult = calculateCubeQuarkMultiplier();
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
    public BONUS = 0;
    /** Quark amount */
    private QUARKS = 0;

    private static interval: ReturnType<typeof setInterval> | null = null;

    constructor({ bonus, quarks }: { bonus?: number, quarks: number }) {
        this.QUARKS = quarks;
        if (bonus) {
            this.BONUS = bonus;
        } else {
            void this.getBonus();
        }

        if (QuarkHandler.interval === null) // although the values are cached for 15 mins, refresh every 5
            QuarkHandler.interval = setInterval(this.getBonus.bind(this), 60 * 1000 * 5);
    }

    /*** Calculates the number of quarks to give with the current bonus. */
    applyBonus(amount: number) {
        return amount * (1 + (this.BONUS / 100));
    }

    /** Subtracts quarks, as the name suggests. */
    add(amount: number, useBonus = true) {
        this.QUARKS += useBonus ? this.applyBonus(amount) : amount;
        player.quarksThisSingularity += useBonus ? this.applyBonus(amount) : amount;
        return this;
    }

    /** Add quarks, as suggested by the function's name. */
    sub(amount: number) {
        this.QUARKS -= amount;
        if (this.QUARKS < 0) this.QUARKS = 0;

        return this;
    }

    async getBonus() {
        const el = DOMCacheGetOrSet('currentBonus');
        if (localStorage.getItem('quarkBonus') !== null) { // is in cache
            const { bonus, fetched } = JSON.parse(localStorage.getItem('quarkBonus')) as { bonus: number, fetched: number };
            if (Date.now() - fetched < 60 * 1000 * 15) { // cache is younger than 15 minutes
                console.log(
                    `%c \tBonus of ${bonus}% quarks has been applied! \n\t(Cached at ${fetched})`, 
                    'color:gold; font-size:60px; font-weight:bold; font-family:helvetica;'
                );
                el.textContent = `Generous patrons give you a bonus of ${bonus}% more quarks!`
                return this.BONUS = bonus;
            }
        } else if (!navigator.onLine) {
            return el.textContent = `Current Bonus: N/A% (offline)!`;
        } else if (document.hidden) {
            return el.textContent = `Current Bonus: N/A% (unfocused)!`;
        }

        const b = await getBonus();

        if (b === null) {
            return;
        } else if (Number.isNaN(b) || typeof b !== 'number') 
            return Alert('No bonus could be applied, an error occurred. [NaN] :(');
        else if (!Number.isFinite(b))
            return Alert('No bonus could be applied, an error occurred. [Infinity] :(');
        else if (b < 0)
            return Alert('No bonus could be applied, an error occurred. [Zero] :(');

        console.log(`%c \tBonus of ${b}% quarks has been applied!`, 'color:gold; font-size:60px; font-weight:bold; font-family:helvetica;');
        el.textContent = `Generous patrons give you a bonus of ${b}% more quarks!`;
        localStorage.setItem('quarkBonus', JSON.stringify({ bonus: b, fetched: Date.now() }));
        this.BONUS = b;
    }

    [Symbol.toPrimitive] = (t: string) => t === 'number' ? this.QUARKS : null;
}