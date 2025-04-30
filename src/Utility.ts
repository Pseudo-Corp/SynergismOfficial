import Decimal from 'break_infinity.js'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { format } from './Synergism'

export const isDecimal = (o: unknown): o is Decimal =>
  o instanceof Decimal
  || (typeof o === 'object'
    && o !== null
    && Object.keys(o).length === 2
    && 'mantissa' in o
    && 'exponent' in o)

/**
 * This function calculates the smallest integer increment/decrement that can be applied to a number that is
 * guaranteed to affect the numbers value
 * @param x
 * @returns {number} 1 if x < 2^53 and 2^ceil(log2(x)-53) otherwise
 * Since ceil(log2(x)-53) was 53 until 2^53+23, I changed it to floor(log2(x)-52)
 * This is incremented to 53 at 2^53-21 and is probably guaranteed thereafter. from by httpsnet
 */
export const smallestInc = (x = 0): number => {
  if (x <= Number.MAX_SAFE_INTEGER) {
    return 1
  } else {
    return 2 ** Math.floor(Math.log2(x) - 52)
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
    : Object.values(array)

  return array.reduce((a, b) => a + b, 0)
}

/**
 * Returns the product of all contents in an array
 * @param array {number[]}
 * @returns {number}
 */
// TODO: Add a productContents for Decimal, but callable using productContents...
export const productContents = (array: number[]): number => array.reduce((a, b) => a * b)

export const sortWithIndices = (toSort: number[]) => {
  return Array
    .from([...toSort.keys()])
    .sort((a, b) => toSort[a] < toSort[b] ? -1 : +(toSort[b] < toSort[a]))
}

/**
 * Identical to @see {DOMCacheGetOrSet} but casts the type.
 * @param id {string}
 */
export const getElementById = <T extends HTMLElement>(id: string) => DOMCacheGetOrSet(id) as T

/**
 * Remove leading indents at the beginning of new lines in a template literal.
 */
export const stripIndents = (raw: TemplateStringsArray, ...args: unknown[]): string => {
  const r = String.raw({ raw }, ...args)

  return r
    .replace(/^[^\S\r\n]+/gm, '')
    .trim()
}

/**
 * Pads an array (a) with param (b) (c) times
 * @param a array to be padded
 * @param b item to pad to array
 * @param length Length to pad array to
 */
export const padArray = <T>(a: T[], b: T, length: number) => {
  for (let i = 0; i < length; i++) {
    if (!(i in a)) {
      a[i] = b
    }
  }

  return a
}

export const updateClassList = (targetElement: string, additions: string[], removals: string[]) => {
  const target = DOMCacheGetOrSet(targetElement)
  for (const addition of additions) {
    target.classList.add(addition)
  }
  for (const removal of removals) {
    target.classList.remove(removal)
  }
}

export const btoa = (s: string) => {
  try {
    return window.btoa(s)
  } catch (err) {
    console.error('An error occurred:', err)
    // e.code = 5
    return null
  }
}

/**
 * Creates a string of the ordinal representation of an integer.
 * @param int An integer, which can be negative or positive.
 * @returns A string which follows the conventions of ordinal numbers
 *          in standard English
 */
export const toOrdinal = (int: number): string => {
  let suffix = 'th'
  if (int % 10 === 1) {
    suffix = (int % 100 === 11) ? 'th' : 'st'
  }
  if (int % 10 === 2) {
    suffix = (int % 100 === 12) ? 'th' : 'nd'
  }
  if (int % 10 === 3) {
    suffix = (int % 100 === 13) ? 'th' : 'rd'
  }

  return format(int, 0, true) + suffix
}

export const formatMS = (ms: number) =>
  Object.entries({
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60
  })
    .filter((f) => f[1] > 0)
    .map((t) => `${t[1]}${t[0]}`)
    .join(' ') || '0s'

export const formatS = (s: number) => {
  return formatMS(1000 * s)
}

export const addLeadingZero = (n: number): string => {
  return n < 10 ? `0${n}` : String(n)
}

export const timeReminingHours = (targetDate: Date): string => {
  const now = new Date()
  const timeDifference = targetDate.getTime() - now.getTime()

  if (timeDifference < 0) {
    return '--:--:--'
  }

  const hours = addLeadingZero(Math.floor(timeDifference / (1000 * 60 * 60)))
  const minutes = addLeadingZero(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds = addLeadingZero(Math.floor((timeDifference % (1000 * 60)) / 1000))

  return `${hours}:${minutes}:${seconds}`
}

export const cleanString = (s: string): string => {
  let cleaned = ''

  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i)

    cleaned += code > 255 ? '_' : s[i]
  }

  return cleaned
}

export function assert (condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new TypeError('assertion failed', { cause: new TypeError(message) })
  }
}

export function limitRange (number: number, min: number, max: number): number {
  if (number < min) {
    return max
  } else if (number > max) {
    return min
  }

  return number
}

export interface DeferredPromise<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (err: Error) => void
}

export const createDeferredPromise = <T>(): DeferredPromise<T> => {
  let resolve!: (unknown: T) => void
  let reject!: (err: Error) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { resolve, reject, promise }
}

export function memoize<Args extends unknown[], Ret> (fn: (...args: Args) => Ret) {
  let ran = false
  let ret: Ret

  return (...args: Args): Ret => {
    if (!ran) {
      ran = true
      ret = fn(...args)
    }

    return ret
  }
}

export const validateNonnegativeInteger = (n: number | string): boolean => {
  return Number.isFinite(n) && !Number.isNaN(n) && Number.isInteger(n)
}
/**
 * Finds the highest (index + 1) where array[index] is less than or equal to the target number,
 * but array[index + 1] is greater than the target number.
 * @param target {number} The target number to compare against.
 * @param array {number[]} A sorted array of numbers.
 * @returns {number} The highest (index + 1) satisfying the condition, or 0 if the target is smaller than all numbers,
 * or array.length if the target is larger than the largest number.
 */
export const findInsertionIndex = (target: number, array: number[]): number => {
  if (array.length === 0 || target < array[0]) {
    return 0
  }
  if (target >= array[array.length - 1]) {
    return array.length
  }

  let low = 0
  let high = array.length - 1

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2)
    if (array[mid] <= target) {
      low = mid
    } else {
      high = mid - 1
    }
  }

  return low + 1
}
