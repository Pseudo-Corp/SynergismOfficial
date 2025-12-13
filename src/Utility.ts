import Decimal, { type DecimalSource } from 'break_infinity.js'
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
  assert(Array.isArray(array))

  switch (array.length) {
    case 0:
      return 0
    case 1:
      return array[0]
    case 2:
      return array[0] + array[1]
    case 3:
      return array[0] + array[1] + array[2]
    case 4:
      return array[0] + array[1] + array[2] + array[3]
    case 5:
      return array[0] + array[1] + array[2] + array[3] + array[4]
  }

  let total = 0
  for (let i = 0; i < array.length; i++) {
    total += array[i]
  }

  return total
}

/**
 * Returns the product of all contents in an array
 * @param array {number[]}
 */
export const productContents = (array: number[]) => {
  switch (array.length) {
    case 0:
      return 0
    case 1:
      return array[0]
    case 2:
      return array[0] * array[1]
    case 3:
      return array[0] * array[1] * array[2]
    case 4:
      return array[0] * array[1] * array[2] * array[3]
    case 5:
      return array[0] * array[1] * array[2] * array[3] * array[4]
  }

  let total = 1
  for (let i = 0; i < array.length; i++) {
    total *= array[i]
  }

  return total
}

export const sortWithIndices = (toSort: number[]) => {
  return Array
    .from([...toSort.keys()])
    .sort((a, b) => toSort[a] < toSort[b] ? -1 : +(toSort[b] < toSort[a]))
}

export const sortDecimalWithIndices = (toSort: DecimalSource[]) => {
  return Array
    .from([...toSort.keys()])
    .sort((a, b) =>
      new Decimal(toSort[a]).lt(new Decimal(toSort[b])) ? -1 : +(new Decimal(toSort[b]).lt(new Decimal(toSort[a])))
    )
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

export const timeRemainingHours = (targetDate: Date): string => {
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
export const timeRemainingMinutes = (targetDate: number | Date | undefined): string => {
  if (targetDate === undefined) {
    return '--:--'
  }

  const now = Date.now()
  const targetTime = targetDate instanceof Date ? targetDate.getTime() : targetDate
  const timeDifference = targetTime - now

  if (timeDifference < 0) {
    return '--:--'
  }

  const minutes = addLeadingZero(Math.floor(timeDifference / (1000 * 60)))
  const seconds = addLeadingZero(Math.floor((timeDifference % (1000 * 60)) / 1000))

  return `${minutes}:${seconds}`
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
    throw new TypeError('assertion failed', message ? { cause: new TypeError(message) } : undefined)
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

/**
 * @license {MIT}
 * https://github.com/nodejs/undici/blob/6301265a20868d077faae6d51f5f6cf57ac2ebfe/lib/web/infra/index.js#L121
 *
 * I'm stealing my own code, fuck off
 */
export function isomorphicDecode (input: Uint8Array) {
  function fromCharCode (input: Iterable<number>) {
    // https://tc39.es/ecma262/#sec-string.fromcharcode
    return String.fromCharCode.apply(null, input as number[])
  }

  const length = input.length

  if ((2 << 15) - 1 > length) {
    return fromCharCode(input)
  }

  let result = ''
  let i = 0
  let addition = (2 << 15) - 1

  while (i < length) {
    if (i + addition > length) {
      addition = length - i
    }
    result += fromCharCode(input.subarray(i, i += addition))
  }

  return result
}

export const isMobile = (function isMobileDevice() {
  return window.matchMedia('(pointer: coarse)').matches
    || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})()

interface RetryOptions {
  backoff: 'exponential' | 'linear'
  initialDelay?: number // default: 1000ms
  maxDelay?: number // default: 30000ms
  multiplier?: number // default: 2
}

export const sleep = (delay: number) => new Promise((r) => setTimeout(r, delay))

/**
 * Retry a promise {@param times} times
 */
export async function retry<T> (
  times: number,
  operation: () => Promise<T>,
  retryOptions?: RetryOptions
) {
  const reject: unknown[] = []

  for (let i = 0; i < times; i++) {
    try {
      return await operation()
    } catch (e) {
      reject.push(e)

      if (retryOptions?.backoff === 'exponential') {
        const { initialDelay = 1000, multiplier = 2, maxDelay = 30_000 } = retryOptions
        const delay = Math.min(initialDelay * multiplier ** i, maxDelay)

        await sleep(delay)
      } else if (retryOptions?.backoff === 'linear') {
        const { initialDelay = 1000 } = retryOptions

        await sleep(initialDelay)
      }
    }
  }

  throw new AggregateError(reject, `Failed after ${times} retries`)
}

export const geometricSeries = (startIndex: number, endIndex: number, ratio: number): number => {
  if (ratio === 1) {
    return endIndex - startIndex + 1
  } else {
    return (ratio ** (endIndex + 1) - ratio ** startIndex) / (ratio - 1)
  }
}

export const infiniteGeometricSeries = (startIndex: number, ratio: number): number => {
  if (Math.abs(ratio) >= 1) {
    throw new Error('Ratio must be less than 1 for an infinite geometric series to converge.')
  }
  return ratio ** startIndex / (1 - ratio)
}
