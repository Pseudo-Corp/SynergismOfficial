

/* Note by Platonic, April 1 2021
This is an experimental file for making cubes their own class
and make them easily re-used for later purposes.
Please do not change the *file name* or use anything developed in this
file without asking me first. You may edit this file as much as you
want, though!
Thank you! */

import Decimal, { DecimalSource } from 'break_infinity.js';
import { player } from './Synergism';
import { Prompt, Alert } from './UpdateHTML';

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
export abstract class Currency extends Decimal {
    /** key on the player object */
    type: string;

    constructor (
        type: string,
        v?: DecimalSource
    ) {
        super(v);
        this.type = type;
    }

    /**
     * @description Open a given amount of cubes
     * @param amount Number of cubes to open
     * @param max if true, overwrites amount and opens the max amount of cubes.
     */
    abstract open(amount: number, max: boolean): Promise<void>;

    /** Open a custom amount of cubes */
    async openCustom() {
        const amount = await Prompt(`How many cubes would you like to open? You have ${player[this.type].toLocaleString()}!`);
        if (amount === null)
            return Alert('OK. No cubes opened.');
        const cubesToOpen = Number(amount);

        if (Number.isNaN(cubesToOpen) || !Number.isFinite(cubesToOpen)) // nan + Infinity checks
            return Alert('Value must be a finite number!');
        else if (player[this.type] < cubesToOpen) // not enough cubes to open
            return Alert('You don\'t have enough cubes to open!');
        else if (cubesToOpen <= 0) // 0 or less cubes to open
            return Alert('You can\'t open a negative number of cubes.');

        return this.open(cubesToOpen, cubesToOpen === player[this.type]);
    }
}