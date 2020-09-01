"use strict";
/**
 * An implementation of Decimal.js that uses BigInts.
 * @author Khafra (KhafraDev)
 */
class Decimal {
    constructor(value) {
        this.value = this.factory(value);
    }
    /**
     * Create a Decimal object.
     */
    factory(value) {
        if (typeof value === 'bigint') {
            return value;
        }
        else if (typeof value === 'number') {
            if (value !== value) { // easy NaN check
                throw new Error('Factory method encountered NaN!');
            }
            return BigInt(Math.floor(value));
        }
        else if (typeof value === 'string') {
            if (+value === +value && isFinite(+value)) { // string can be converted to number
                return BigInt(+value);
            }
            else if (value.indexOf('e') === -1) { // can be converted to BigInt easily
                return BigInt(value);
            }
            // 1.4e1000 -> true
            // 1e1000 	-> true
            if (!/\d+e\d+/.test(value)) {
                throw new Error(`Invalid string received: ${value}.`);
            }
            const [mantissa, exponent] = value.split('e');
            const places = (+mantissa % 1 === 0) // 1.4 % 1 !== 0, 1 % 1 === 0
                ? +exponent
                : Math.abs((mantissa.length - 1) - +exponent);
            const intStr = mantissa.replace(',', '').padEnd(places, '0');
            return BigInt(intStr);
        }
        else if (value instanceof Decimal) {
            return BigInt(value.value);
        }
        else {
            const toString = {}.toString;
            throw new Error(`Unexpected type in factory method: ${toString.call(value)}`);
        }
    }
    /**
     * Check if the current Decimal value is greater than or equal to another Decimal
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    greaterThanOrEqualTo(value) {
        return this.value >= this.factory(value);
    }
    /**
     * Check if the current Decimal value is less than or equal to another Decimal
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    lessThanOrEqualTo(value) {
        return this.value <= this.factory(value);
    }
    /**
     * Check if the current Decimal value is greater than another Decimal
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    greaterThan(value) {
        return this.value > this.factory(value);
    }
    /**
     * Check if the current Decimal value is less than another Decimal
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    lessThan(value) {
        return this.value < this.factory(value);
    }
    /**
     * @return
     * 	1 		if the value of the current Decimal is greater than the value of the input
     * 	-1 		if the value of the current Decimal is less than the value of the input
     * 	0		if they are equal
     * 	NaN		if the of either Decimal is NaN.
     * @param value Value to compare to
     */
    compareTo(value) {
        value = this.factory(value);
        if (Number.isNaN(value) || Number.isNaN(this.value)) {
            return NaN;
        }
        else if (this.value === value) {
            return 0;
        }
        else if (this.value > value) {
            return 1;
        }
        else { // this.value < value
            return -1;
        }
    }
    /**
     * Divide the current Decimal by a Decimal-like value.
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    dividedBy(value) {
        return this.value / this.factory(value);
    }
    /**
     * Returns `true` if values are equal, false otherwise.
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    equals(value) {
        return this.value === this.factory(value);
    }
    /**
     * @see {bigint.toString}
     * @param radix number
     */
    toString(radix) {
        return this.value.toString(radix);
    }
    /**
     * Subtract 2 Decimals.
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    minus(value) {
        return this.value = this.value - this.factory(value), this;
    }
    /**
     * Add 2 Decimals.
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    add(value) {
        return this.value = this.value + this.factory(value), this;
    }
    /**
     * Get remainder of a Decimal given a Decimal-like value
     * @param {DecimalInputs} value string | bigint | number | Decimal
     */
    modulo(value) {
        return this.value % this.factory(value);
    }
    /**
     * Return a negated Decimal.
     */
    negate() {
        return this.value * -1n;
    }
    /**
     * nth root
     * @see https://stackoverflow.com/a/58863398
     */
    root(k = 2n) {
        let o = 0n;
        let x = this.value;
        let limit = 100;
        while (x ** k !== k && x !== o && --limit) {
            o = x;
            x = ((k - 1n) * x + this.value / x ** (k - 1n)) / k;
        }
        return x;
    }
}
