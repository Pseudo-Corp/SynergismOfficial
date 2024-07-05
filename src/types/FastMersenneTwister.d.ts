declare module 'fast-mersenne-twister' {
  interface api {
    genrand_int32: () => number
    // [0,0x7fffffff]
    genrand_int31: () => number
    // [0,1]
    genrand_real1: () => number
    // [0,1)
    genrand_real2: () => number
    // (0,1)
    genrand_real3: () => number
    // [0,1), 53-bit resolution
    genrand_res53: () => number

    randomNumber: () => number
    random31Bit: () => number
    randomInclusive: () => number
    random: () => number // returns values just like Math.random
    randomExclusive: () => number
    random53Bit: () => number
  }

  export function MersenneTwister (seed?: number): api
}
