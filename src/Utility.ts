import Decimal from 'break_infinity.js';

export const isDecimal = (o: unknown): o is Decimal =>
    o instanceof Decimal ||
    (typeof o === 'object' &&
    o !== null &&
    Object.keys(o).length === 2 &&
    'mantissa' in o &&
    'exponent' in o)
;

/**
 * This function calculates the smallest integer increment/decrement that can be applied to a number that is
 * guaranteed to affect the numbers value
 * @param x
 * @returns {number} 1 if x < 2^53 and 2^ceil(log2(x)-53) otherwise
 */
export const smallestInc = (x = 0): number => {
    if (x <= Number.MAX_SAFE_INTEGER) {
        return 1;
    } else {
        return 2**Math.ceil(Math.log2(x)-53)
    }
}

/** 
 * Returns the sum of all contents in an array
 * @param array {(number|string)[]}
 * @returns {number}
 */
export const sumContents = (array: number[]): number => {
    array = Array.isArray(array)
        ? array
        : Object.values(array);

    return array.reduce((a, b) => a + b, 0);
}

/** 
 * Returns the product of all contents in an array
 * @param array {number[]}
 * @returns {number}
 */
export const productContents = (array: number[]): number => array.reduce((a, b) => a * b);

export const sortWithIndices = (toSort: number[]) => {
    return Array
        .from([...toSort.keys()])
        .sort((a, b) => toSort[a] < toSort[b] ? -1 : +(toSort[b] < toSort[a]));
}

/**
 * Identical to @see {Document.getElementById} but casts the type.
 * @param id {string}
 */
export const getElementById = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/**
 * Remove leading indents at the beginning of new lines in a template literal. 
 */
type ValidInterpolatedType = string | number | Date;
export const stripIndents = (temp: TemplateStringsArray, ...args: ValidInterpolatedType[]) => {
    const s = temp.raw;
    let f = '';
    for (let i = 0; i < s.length; i++) {
        // rather than using \s+ for all whitespace, we use a normal space
        // this fixes a bug where two+ new lines will be transformed into 1
        f += `${s[i].replace(/\n +/g, '\n')}${args.shift() ?? ''}`
    }

    return f.trim();
}

/**
 * Pads an array (a) with param (b) (c) times
 * @param a array to be padded
 * @param b item to pad to array
 * @param length Length to pad array to
 */
export const padArray = <T extends unknown>(a: T[], b: T, length: number) => {
    for (let i = 0; i < length; i++)
        if (!(i in a)) a[i] = b;

    return a;
} 

export const updateClassList = (targetElement: string, additions: Array<string>, removals: Array<string>) => {
    const target = document.getElementById(targetElement);
    for (const addition of additions) {
        target.classList.add(addition);
    }
    for (const removal of removals) {
        target.classList.remove(removal);
    }
}

export const btoa = (s: string) => {
    try {
        return window.btoa(s);
    } catch { 
        // e.code = 5
        return null;
    }
}

export const copyToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(text)
            .catch(e => console.error(e));

        return;
    }
    // Old browsers (legacy Edge, Safari 13.0)
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('style', 'top: 0; left: 0; position: fixed;');

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (_) {
        console.error("Failed to copy savegame to clipboard.");
    }

    document.body.removeChild(textArea);
};