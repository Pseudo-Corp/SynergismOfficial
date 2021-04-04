

/* Note by Platonic, April 1 2021
This is an experimental file for making cubes their own class
and make them easily re-used for later purposes.
Please do not change the *file name* or use anything developed in this
file without asking me first. You may edit this file as much as you
want, though!
Thank you! */

import { achievementaward } from './Achievements';
import { calculateCubeBlessings } from './Calculate';
import { CalcECC } from './Challenges';
import { player } from './Synergism';
import { calculateTesseractBlessings } from './Tesseracts';
import { Player } from './types/Synergism';
import { Prompt, Alert } from './UpdateHTML';
// import { Prompt, Alert } from './UpdateHTML';

/* Constants */

const blessings: Record<
    keyof Player['cubeBlessings'], 
    { weight: number, pdf: (x: number) => boolean }
> = {
    accelerator:   {weight: 4, pdf: (x: number) => 0 <= x && x <= 20},
    multiplier:    {weight: 4, pdf: (x: number) => 20 < x && x <= 40},
    offering:      {weight: 2, pdf: (x: number) => 40 < x && x <= 50},
    runeExp:       {weight: 2, pdf: (x: number) => 50 < x && x <= 60},
    obtainium:     {weight: 2, pdf: (x: number) => 60 < x && x <= 70},
    antSpeed:      {weight: 2, pdf: (x: number) => 70 < x && x <= 80},
    antSacrifice:  {weight: 1, pdf: (x: number) => 80 < x && x <= 85},
    antELO:        {weight: 1, pdf: (x: number) => 85 < x && x <= 90},
    talismanBonus: {weight: 1, pdf: (x: number) => 90 < x && x <= 95},
    globalSpeed:   {weight: 1, pdf: (x: number) => 95 < x && x <= 100}
}

/**
 * @description Generic class for handling cube subsets.
 * @example
 * class PlatCubes extends Currency {
 *   constructor() {
 *       super('wowPlatonicCubes', player.wowPlatonicCubes);
 *   }
 *
 *   async open(amount: number, value: boolean) {
 *       // implement open logic here
 *   }
 * }
 * 
 * new PlatCubes().openCustom(); 
 */
abstract class Currency {
    /** key on the player object */
    private key: keyof Player;
    private value: number;

    constructor (
        type: keyof Player,
        v: number = 0
    ) {
        this.key = type;
        this.value = v;
    }

    /**
     * @description Open a given amount of cubes
     * @param amount Number of cubes to open
     * @param max if true, overwrites amount and opens the max amount of cubes.
     */
    abstract open(amount: number, max: boolean): Promise<void> | void;

    /** Open a custom amount of cubes */
    async openCustom() {
        const amount = await Prompt(`How many cubes would you like to open? You have ${player[this.key].value.toLocaleString()}!`);
        if (amount === null)
            return Alert('OK. No cubes opened.');
        const cubesToOpen = Number(amount);

        if (Number.isNaN(cubesToOpen) || !Number.isFinite(cubesToOpen)) // nan + Infinity checks
            return Alert('Value must be a finite number!');
        else if (player[this.key].value < cubesToOpen) // not enough cubes to open
            return Alert('You don\'t have enough cubes to open!');
        else if (cubesToOpen <= 0) // 0 or less cubes to open
            return Alert('You can\'t open a negative number of cubes.');

        return this.open(cubesToOpen, cubesToOpen === player[this.key].value);
    }

    add(amount: number): Currency {
        this.value += amount;
        return this;
    }

    sub(amount: number): Currency {
        this.value = Math.max(0, this.value - amount);
        return this;
    }

    [Symbol.toPrimitive](h: string) {
        switch (h) {
            case 'string': return this.value.toString();
            case 'number': return this.value;
            default: return null;
        }
    }
}

Object.defineProperty(window, 'test', { value: Currency });

export class WowCubes extends Currency {
    constructor(amount: number = Number(player.wowCubes)) {
        super('wowCubes', amount);
    }

    open(value: number, max = false) {
        let toSpend = max ? Number(this) : Math.min(Number(this), value);

        if (value === 1 && player.cubeBlessings.accelerator >= 2e11 && player.achievements[246] < 1) {
            achievementaward(246)
        }

        this.sub(toSpend);
        player.cubeOpenedDaily += toSpend

        if(player.cubeQuarkDaily < 25 + 75 * player.shopUpgrades.cubeToQuark) {
            while(player.cubeOpenedDaily >= 10 * Math.pow(1 + player.cubeQuarkDaily, 4) && player.cubeQuarkDaily < 25 + 75 * player.shopUpgrades.cubeToQuark) {
                player.cubeQuarkDaily += 1;
                player.worlds.add(1);
            }
        }

        toSpend *= (1 + player.researches[138] / 1000)
        toSpend *= (1 + 0.8 * player.researches[168] / 1000)
        toSpend *= (1 + 0.6 * player.researches[198] / 1000)

        toSpend = Math.floor(toSpend)
        let toSpendModulo = toSpend % 20
        let toSpendDiv20 = Math.floor(toSpend / 20)
        
        if (toSpendDiv20 > 0 && player.cubeUpgrades[13] === 1) {
            toSpendModulo += toSpendDiv20
        }
        if (toSpendDiv20 > 0 && player.cubeUpgrades[23] === 1) {
            toSpendModulo += toSpendDiv20
        }
        if (toSpendDiv20 > 0 && player.cubeUpgrades[33] === 1) {
            toSpendModulo += toSpendDiv20
        }

        toSpendDiv20 += 100 / 100 * Math.floor(toSpendModulo / 20);
        toSpendModulo = toSpendModulo % 20;

        const keys = Object.keys(player.cubeBlessings) as (keyof Player['cubeBlessings'])[];

        // If you're opening more than 20 cubes, it will consume all cubes until remainder mod 20, giving expected values.
        for (const key of keys) {
            player.cubeBlessings[key] += blessings[key].weight * toSpendDiv20 * (1 + Math.floor(CalcECC('ascension', player.challengecompletions[12])));
        }

        // Then, the remaining cubes will be opened, simulating the probability [RNG Element]
        for (let i = 0; i < toSpendModulo; i++) {
            const num = 100 * Math.random();
            for (const key of keys) {
                if (blessings[key].pdf(num))
                    player.cubeBlessings[key] += (1 + Math.floor(CalcECC('ascension', player.challengecompletions[12])));
            }
        }

        calculateCubeBlessings();
    }
}

export class WowTesseracts extends Currency {
    constructor(amount: number = Number(player.wowTesseracts)) {
        super('wowTesseracts', amount);
    }

    open(value: number, max = false) {
        let toSpend = max ? Number(this) : Math.min(Number(this), value);

        player.wowTesseracts.sub(toSpend);
        player.tesseractOpenedDaily += toSpend

        if (player.tesseractQuarkDaily < 25 + 75 * player.shopUpgrades.tesseractToQuark) {
            while (
                player.tesseractOpenedDaily >= 10 * Math.pow(1 + player.tesseractQuarkDaily, 3) && 
                player.tesseractQuarkDaily < 25 + 75 * player.shopUpgrades.tesseractToQuark
            ) {
                player.tesseractQuarkDaily += 1;
                player.worlds.add(1);
            }
        }
        const toSpendModulo = toSpend % 20
        const toSpendDiv20 = Math.floor(toSpend / 20)

        // If you're opening more than 20 Tesseracts, it will consume all Tesseracts until remainder mod 20, giving expected values.
        for (const key in player.tesseractBlessings) {
            player.tesseractBlessings[key as keyof Player['tesseractBlessings']] += blessings[key as keyof typeof blessings].weight * toSpendDiv20;
        }
        // Then, the remaining tesseract will be opened, simulating the probability [RNG Element]
        for (let i = 0; i < toSpendModulo; i++) {
            const num = 100 * Math.random();
            for (const key in player.tesseractBlessings) {
                if (blessings[key as keyof typeof blessings].pdf(num))
                    player.tesseractBlessings[key as keyof Player['tesseractBlessings']] += 1;
            }
        }

        calculateTesseractBlessings();
        const extraCubeBlessings = Math.floor(12 * toSpend * player.researches[153])
        player.wowCubes.add(extraCubeBlessings);
        player.wowCubes.open(extraCubeBlessings, false)
    }
}