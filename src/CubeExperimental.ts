

/* Note by Platonic, April 1 2021
This is an experimental file for making cubes their own class
and make them easily re-used for later purposes.
Please do not change the *file name* or use anything developed in this
file without asking me first. You may edit this file as much as you
want, though!
Thank you! */

import Decimal, { DecimalSource } from 'break_infinity.js';

export abstract class Currency extends Decimal {
    type: string;
    constructor(
        type: string,
        v?: DecimalSource
    ) {
        super(v);
        this.type = type;
    }

    /** Open a set amount */
    abstract open(amount: number, max: boolean): Promise<void>;

    /** Open a custom amount */
    abstract openCustom(): Promise<void>;
}